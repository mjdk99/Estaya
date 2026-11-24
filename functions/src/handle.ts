import { createHmac } from "crypto";
import { SCHEMA_VERSION, SOURCE_PATH, validateInquiry, type Kind } from "./validate";

export type RejectReason = "invalid" | "honeypot" | "disabled" | "rate_limited" | "conflict" | "unavailable";

export class InquiryRejected extends Error {
  readonly reason: RejectReason;
  readonly fields?: Record<string, string>;

  constructor(reason: RejectReason, fields?: Record<string, string>) {
    super(reason);
    this.name = "InquiryRejected";
    this.reason = reason;
    this.fields = fields;
  }
}

export interface HandleOptions {
  nowMs: number;
  secret: string;
  networkSignal: string;
  enabled: Record<Kind, boolean>;
  limits: {
    emailMax: number;
    emailWindowMs: number;
    networkMax: number;
    networkWindowMs: number;
  };
  timestamp: () => unknown;
}

export interface DocRef {
  path: string;
}

export interface DocSnap {
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}

export interface Tx {
  get(ref: DocRef): Promise<DocSnap>;
  set(ref: DocRef, data: Record<string, unknown>): void;
}

export interface InquiryDb {
  collection(name: string): { doc(id: string): DocRef };
  runTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
}

export async function handleInquiry(
  db: InquiryDb,
  raw: unknown,
  options: HandleOptions,
): Promise<{ ok: true; replay: boolean }> {
  if (!options.secret) throw new InquiryRejected("unavailable");

  const validated = validateInquiry(raw);
  if (!validated.ok) {
    if (validated.reason === "honeypot") throw new InquiryRejected("honeypot");
    throw new InquiryRejected("invalid", validated.fields);
  }

  const value = validated.value;
  if (!options.enabled[value.kind]) throw new InquiryRejected("disabled");

  const emailKey = sign(options.secret, `email:${value.email.toLowerCase()}`);
  const networkKey = sign(options.secret, `net:${options.networkSignal || "shared-unknown"}`);

  try {
    return await db.runTransaction(async (tx) => {
      const ref = db.collection("inquiries").doc(value.submissionId);
      const existing = await tx.get(ref);
      if (existing.exists) {
        if (existing.data()?.requestDigest === value.digest) return { ok: true, replay: true };
        throw new InquiryRejected("conflict");
      }

      const emailRef = db.collection("rateLimits").doc(emailKey);
      const networkRef = db.collection("rateLimits").doc(networkKey);
      const emailSnap = await tx.get(emailRef);
      const networkSnap = await tx.get(networkRef);
      const emailState = readWindow(emailSnap, options.nowMs, options.limits.emailWindowMs);
      const networkState = readWindow(networkSnap, options.nowMs, options.limits.networkWindowMs);
      if (emailState.count >= options.limits.emailMax || networkState.count >= options.limits.networkMax) {
        throw new InquiryRejected("rate_limited");
      }

      const stamp = options.timestamp();
      const record: Record<string, unknown> = {
        schemaVersion: SCHEMA_VERSION,
        kind: value.kind,
        status: "new",
        name: value.name,
        email: value.email,
        details: value.details,
        sourcePath: SOURCE_PATH[value.kind],
        createdAt: stamp,
        updatedAt: stamp,
        requestDigest: value.digest,
      };
      if (value.organization) record.organization = value.organization;
      if (value.phone) record.phone = value.phone;

      tx.set(ref, record);
      tx.set(emailRef, nextWindow(emailState, options.nowMs, options.limits.emailWindowMs));
      tx.set(networkRef, nextWindow(networkState, options.nowMs, options.limits.networkWindowMs));
      return { ok: true, replay: false };
    });
  } catch (error) {
    if (error instanceof InquiryRejected) throw error;
    throw new InquiryRejected("unavailable");
  }
}

function sign(secret: string, value: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function readWindow(snap: DocSnap, nowMs: number, windowMs: number): { count: number; start: number } {
  const data = snap.exists ? snap.data() : undefined;
  const start = typeof data?.windowStartMs === "number" ? data.windowStartMs : 0;
  const count = typeof data?.count === "number" ? data.count : 0;
  if (!snap.exists || nowMs - start >= windowMs) return { count: 0, start: nowMs };
  return { count, start };
}

function nextWindow(state: { count: number; start: number }, nowMs: number, windowMs: number): Record<string, unknown> {
  return {
    count: state.count + 1,
    windowStartMs: state.start,
    expiresAtMs: nowMs + windowMs,
  };
}
