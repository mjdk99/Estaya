import { describe, expect, it } from "vitest";
import { handleInquiry, InquiryRejected, type InquiryDb, type DocSnap, type Tx } from "./handle";
import { digestFor, validateInquiry, type Kind } from "./validate";

const SECRET = "test-secret";

function supply(overrides: Record<string, unknown> = {}) {
  return {
    submissionId: "11111111-1111-4111-8111-111111111111",
    kind: "supply_offer",
    name: "Ada Lovelace",
    email: "ada@example.org",
    organization: "County Hospital",
    phone: "",
    companyFax: "",
    details: {
      location: "Duluth, MN",
      description: "Unopened procedure gloves, about four cases.",
      quantity: "",
    },
    ...overrides,
  };
}

function partner(overrides: Record<string, unknown> = {}) {
  return {
    submissionId: "22222222-2222-4222-8222-222222222222",
    kind: "partner_inquiry",
    name: "Grace Hopper",
    email: "grace@nonprofit.test",
    organization: "North Clinic Partners",
    companyFax: "",
    details: {
      needs: "Exam gloves and basic wound-care supplies.",
      region: "Northern Minnesota",
    },
    ...overrides,
  };
}

function contact(overrides: Record<string, unknown> = {}) {
  return {
    submissionId: "33333333-3333-4333-8333-333333333333",
    kind: "contact",
    name: "Max Reed",
    email: "max@example.com",
    companyFax: "",
    details: {
      topic: "support",
      message: "I would like to ask about supporting Estaya.",
    },
    ...overrides,
  };
}

function createDb() {
  const docs = new Map<string, Record<string, unknown>>();
  let queue = Promise.resolve();
  const db: InquiryDb = {
    collection(name: string) {
      return {
        doc(id: string) {
          return { path: `${name}/${id}` };
        },
      };
    },
    runTransaction(fn) {
      const run = async () => {
        const pending = new Map<string, Record<string, unknown>>();
        const tx: Tx = {
          async get(ref) {
            const data = pending.get(ref.path) ?? docs.get(ref.path);
            return snap(data);
          },
          set(ref, data) {
            pending.set(ref.path, data);
          },
        };
        const result = await fn(tx);
        for (const [path, data] of pending) docs.set(path, data);
        return result;
      };
      const next = queue.then(run, run);
      queue = next.then(() => undefined, () => undefined);
      return next;
    },
  };
  return { db, docs };
}

function snap(data: Record<string, unknown> | undefined): DocSnap {
  return {
    exists: data !== undefined,
    data: () => data,
  };
}

function options(overrides: Partial<Parameters<typeof handleInquiry>[2]> = {}) {
  return {
    nowMs: 1_700_000_000_000,
    secret: SECRET,
    networkSignal: "203.0.113.10",
    enabled: { supply_offer: true, partner_inquiry: true, contact: true } as Record<Kind, boolean>,
    limits: { emailMax: 5, emailWindowMs: 3_600_000, networkMax: 30, networkWindowMs: 3_600_000 },
    timestamp: () => "server-time",
    ...overrides,
  };
}

describe("validateInquiry", () => {
  it("accepts each kind and omits blank optional fields", () => {
    const offer = validateInquiry(supply());
    expect(offer.ok).toBe(true);
    if (!offer.ok) return;
    expect(offer.value.details).toEqual({
      location: "Duluth, MN",
      description: "Unopened procedure gloves, about four cases.",
    });
    expect(offer.value.phone).toBeUndefined();
    expect(validateInquiry(partner()).ok).toBe(true);
    expect(validateInquiry(contact()).ok).toBe(true);
  });

  it("accepts any email provider and only http(s) websites", () => {
    const offer = validateInquiry(supply({ email: "donor@clinic.example" }));
    expect(offer.ok).toBe(true);
    const badSite = validateInquiry(partner({ details: { ...partner().details, website: "javascript:alert(1)" } }));
    expect(badSite.ok).toBe(false);
    const goodSite = validateInquiry(partner({ details: { ...partner().details, website: "https://north.example" } }));
    expect(goodSite.ok).toBe(true);
  });

  it("rejects invalid fields, extra keys, and honeypots", () => {
    const missing = validateInquiry(supply({ email: "not-an-email", organization: "" }));
    expect(missing.ok).toBe(false);
    if (missing.ok || missing.reason !== "invalid") throw new Error("expected invalid");
    expect(missing.fields.email).toBeTruthy();
    expect(missing.fields.organization).toBeTruthy();
    expect(validateInquiry(supply({ surprise: true })).ok).toBe(false);
    expect(validateInquiry(contact({ details: { topic: "nope", message: "Hello" } })).ok).toBe(false);
    const honey = validateInquiry(supply({ companyFax: "filled" }));
    expect(honey.ok).toBe(false);
    if (!honey.ok) expect(honey.reason).toBe("honeypot");
  });

  it("keeps the digest stable for the same payload", () => {
    const first = validateInquiry(supply());
    const second = validateInquiry(supply({ submissionId: "44444444-4444-4444-8444-444444444444" }));
    if (!first.ok || !second.ok) throw new Error("expected ok");
    expect(first.value.digest).toBe(second.value.digest);
    expect(first.value.digest).toBe(digestFor(first.value));
  });
});

describe("handleInquiry", () => {
  it("stores one inquiry and treats an unchanged retry as the same record", async () => {
    const { db, docs } = createDb();
    const payload = supply();
    const first = await handleInquiry(db, payload, options());
    const second = await handleInquiry(db, payload, options());
    expect(first.replay).toBe(false);
    expect(second.replay).toBe(true);
    expect([...docs.keys()].filter((key) => key.startsWith("inquiries/"))).toHaveLength(1);
    const stored = docs.get(`inquiries/${payload.submissionId}`);
    expect(stored?.status).toBe("new");
    expect(stored?.sourcePath).toBe("/give-supplies/");
    expect(stored?.phone).toBeUndefined();
  });

  it("serializes concurrent retries into one record", async () => {
    const { db, docs } = createDb();
    const payload = partner();
    const [a, b] = await Promise.all([
      handleInquiry(db, payload, options()),
      handleInquiry(db, payload, options()),
    ]);
    expect([a.replay, b.replay].sort()).toEqual([false, true]);
    expect([...docs.keys()].filter((key) => key.startsWith("inquiries/"))).toHaveLength(1);
  });

  it("rejects a reused id when the payload changed", async () => {
    const { db, docs } = createDb();
    const payload = contact();
    await handleInquiry(db, payload, options());
    await expect(handleInquiry(db, contact({ details: { topic: "general", message: "A different note." } }), options())).rejects.toMatchObject({ reason: "conflict" });
    expect(docs.get(`inquiries/${payload.submissionId}`)?.details).toMatchObject({ topic: "support" });
  });

  it("does not write invalid, honeypot, or disabled submissions", async () => {
    const { db, docs } = createDb();
    await expect(handleInquiry(db, supply({ email: "bad" }), options())).rejects.toMatchObject({ reason: "invalid" });
    await expect(handleInquiry(db, supply({ companyFax: "bot" }), options())).rejects.toMatchObject({ reason: "honeypot" });
    await expect(handleInquiry(db, supply(), options({ enabled: { supply_offer: false, partner_inquiry: true, contact: true } }))).rejects.toMatchObject({ reason: "disabled" });
    expect([...docs.keys()].filter((key) => key.startsWith("inquiries/"))).toHaveLength(0);
  });

  it("throttles a shared network and a single email", async () => {
    const { db } = createDb();
    const tight = options({ limits: { emailMax: 5, emailWindowMs: 3_600_000, networkMax: 2, networkWindowMs: 3_600_000 } });
    await handleInquiry(db, supply(), tight);
    await handleInquiry(db, partner(), tight);
    await expect(handleInquiry(db, contact(), tight)).rejects.toBeInstanceOf(InquiryRejected);

    const { db: emailDb } = createDb();
    for (let index = 0; index < 5; index += 1) {
      await handleInquiry(emailDb, supply({
        submissionId: `55555555-5555-4555-8555-55555555555${index}`,
        details: { location: "Rochester, MN", description: `Case ${index}` },
      }), options());
    }
    await expect(handleInquiry(emailDb, supply({
      submissionId: "55555555-5555-4555-8555-555555555559",
      details: { location: "Rochester, MN", description: "Case overflow" },
    }), options())).rejects.toMatchObject({ reason: "rate_limited" });
  });

  it("reports a datastore failure without writing", async () => {
    const failing: InquiryDb = {
      collection: () => ({ doc: () => ({ path: "inquiries/x" }) }),
      runTransaction: async () => {
        throw new Error("firestore unavailable");
      },
    };
    await expect(handleInquiry(failing, supply(), options())).rejects.toMatchObject({ reason: "unavailable" });
  });
});
