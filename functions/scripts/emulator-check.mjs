import { randomUUID } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = "estaya";
const endpoint = `http://127.0.0.1:5001/${projectId}/us-central1/submitInquiry`;
const failures = [];

initializeApp({ projectId });
const db = getFirestore();

function payload(kind, submissionId, extra = {}) {
  if (kind === "supply_offer") {
    return {
      submissionId,
      kind,
      name: "Emulator Donor",
      email: extra.email ?? "donor.emulator@example.org",
      organization: "Emulator Hospital",
      companyFax: extra.companyFax ?? "",
      details: {
        location: "Saint Paul, MN",
        description: extra.description ?? "Sealed gloves and gauze.",
        ...(extra.details ?? {}),
      },
    };
  }
  if (kind === "partner_inquiry") {
    return {
      submissionId,
      kind,
      name: "Emulator Partner",
      email: extra.email ?? "partner.emulator@example.org",
      organization: "Emulator Nonprofit",
      companyFax: "",
      details: {
        needs: extra.needs ?? "Wound-care supplies for partner clinics.",
        region: "Minnesota",
      },
    };
  }
  return {
    submissionId,
    kind: "contact",
    name: "Emulator Caller",
    email: extra.email ?? "contact.emulator@example.org",
    companyFax: "",
    details: {
      topic: "purchasing",
      message: extra.message ?? "Ask about purchasing suitable inventory later.",
    },
  };
}

async function post(data) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data }),
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const supplyId = randomUUID();
const partnerId = randomUUID();
const contactId = randomUUID();

const supply = payload("supply_offer", supplyId);
const created = await post(supply);
assert(created.body?.result?.ok === true, `supply create failed: ${JSON.stringify(created)}`);
const replay = await post(supply);
assert(replay.body?.result?.ok === true, `supply replay failed: ${JSON.stringify(replay)}`);

const partnerBody = payload("partner_inquiry", partnerId);
const [first, second] = await Promise.all([post(partnerBody), post(partnerBody)]);
assert(first.body?.result?.ok === true && second.body?.result?.ok === true, `concurrent partner failed: ${JSON.stringify([first, second])}`);

const contactBody = payload("contact", contactId);
const contactResult = await post(contactBody);
assert(contactResult.body?.result?.ok === true, `contact failed: ${JSON.stringify(contactResult)}`);
const conflict = await post(payload("contact", contactId, { message: "Changed after the first submit." }));
assert(conflict.body?.error?.status === "ALREADY_EXISTS", `conflict status: ${JSON.stringify(conflict)}`);

const invalid = await post({ kind: "supply_offer", email: "nope" });
assert(invalid.body?.error?.status === "INVALID_ARGUMENT", `invalid status: ${JSON.stringify(invalid)}`);
const honey = await post(payload("supply_offer", randomUUID(), { companyFax: "bot", email: "honey.emulator@example.org" }));
assert(honey.body?.error, `honeypot should reject: ${JSON.stringify(honey)}`);

for (let index = 0; index < 5; index += 1) {
  const result = await post(payload("supply_offer", randomUUID(), {
    email: "limit.emulator@example.org",
    description: `Limit case ${index} with a unique sentence.`,
  }));
  assert(result.body?.result?.ok === true, `limit seed ${index} failed: ${JSON.stringify(result)}`);
}
const limited = await post(payload("supply_offer", randomUUID(), {
  email: "limit.emulator@example.org",
  description: "This sixth offer should be throttled.",
}));
assert(limited.body?.error?.status === "RESOURCE_EXHAUSTED", `throttle status: ${JSON.stringify(limited)}`);

const inquiries = await db.collection("inquiries").get();
const byId = new Map(inquiries.docs.map((doc) => [doc.id, doc.data()]));
assert(byId.has(supplyId), "missing supply record");
assert(byId.get(supplyId)?.kind === "supply_offer", "supply kind");
assert(byId.get(supplyId)?.status === "new", "supply status");
assert(byId.get(supplyId)?.sourcePath === "/give-supplies/", "supply path");
assert([...byId.values()].filter((row) => row.email === supply.email).length === 1, "supply retry duplicated");
assert([...byId.values()].filter((row) => row.email === partnerBody.email).length === 1, "partner concurrent duplicated");
assert(byId.get(contactId)?.details?.message === contactBody.details.message, "conflict overwrote contact");
assert([...byId.values()].filter((row) => row.email === "limit.emulator@example.org").length === 5, "throttle wrote an extra record");
assert(![...byId.values()].some((row) => row.email === "honey.emulator@example.org"), "honeypot wrote a record");

const rulesUrl = `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/inquiries/${supplyId}`;
const publicRead = await fetch(rulesUrl);
const publicWrite = await fetch(rulesUrl, {
  method: "PATCH",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ fields: { name: { stringValue: "intruder" } } }),
});
assert(publicRead.status === 403, `public read status ${publicRead.status}`);
assert(publicWrite.status === 403, `public write status ${publicWrite.status}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Emulator checks passed (${inquiries.size} inquiry records).`);
