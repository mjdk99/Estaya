import { initializeApp, getApps } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { onCall, HttpsError, type CallableRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { handleInquiry, InquiryRejected, type InquiryDb } from "./handle";
import type { Kind } from "./validate";

if (getApps().length === 0) initializeApp();

const rateLimitSecret = defineSecret("RATE_LIMIT_SECRET");
const REGION = "us-central1";
const FAILURE = "We couldn’t submit your form. Please try again.";

export const submitInquiry = onCall(
  {
    region: REGION,
    secrets: [rateLimitSecret],
    enforceAppCheck: process.env.FUNCTIONS_EMULATOR !== "true",
    invoker: "public",
    maxInstances: 10,
    memory: "256MiB",
    timeoutSeconds: 20,
  },
  async (request) => {
    try {
      const result = await handleInquiry(getFirestore() as unknown as InquiryDb, request.data, {
        nowMs: Date.now(),
        secret: readSecret(),
        networkSignal: networkSignal(request),
        enabled: enabledKinds(),
        limits: {
          emailMax: intEnv("EMAIL_RATE_LIMIT", 5),
          emailWindowMs: intEnv("EMAIL_RATE_WINDOW_MS", 60 * 60 * 1000),
          networkMax: intEnv("NETWORK_RATE_LIMIT", 30),
          networkWindowMs: intEnv("NETWORK_RATE_WINDOW_MS", 60 * 60 * 1000),
        },
        timestamp: () => FieldValue.serverTimestamp(),
      });
      logger.info("inquiry_accepted", { replay: result.replay });
      return { ok: true };
    } catch (error) {
      if (error instanceof InquiryRejected) {
        logger.warn("inquiry_rejected", { reason: error.reason });
        throw toHttps(error);
      }
      logger.error("inquiry_failed", { code: "internal" });
      throw new HttpsError("unavailable", FAILURE);
    }
  },
);

function readSecret(): string {
  try {
    const value = rateLimitSecret.value();
    if (value) return value;
  } catch {
    // Secret Manager is not bound in the emulator unless .secret.local is present.
  }
  if (process.env.FUNCTIONS_EMULATOR === "true" && process.env.RATE_LIMIT_SECRET) {
    return process.env.RATE_LIMIT_SECRET;
  }
  return "";
}

function enabledKinds(): Record<Kind, boolean> {
  const emulator = process.env.FUNCTIONS_EMULATOR === "true";
  const flag = (name: string) => {
    const value = process.env[name];
    if (emulator) return value !== "false";
    return value === "true";
  };
  return {
    supply_offer: flag("INTAKE_SUPPLY_OFFER"),
    partner_inquiry: flag("INTAKE_PARTNER_INQUIRY"),
    contact: flag("INTAKE_CONTACT"),
  };
}

function intEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function networkSignal(request: CallableRequest<unknown>): string {
  const header = request.rawRequest?.headers?.["x-forwarded-for"];
  const forwarded = Array.isArray(header) ? header[0] : header;
  const ip = typeof forwarded === "string" && forwarded.trim()
    ? forwarded.split(",")[0]!.trim()
    : request.rawRequest?.ip || request.rawRequest?.socket?.remoteAddress || "shared-unknown";
  return ip.slice(0, 128);
}

function toHttps(error: InquiryRejected): HttpsError {
  if (error.reason === "invalid") {
    return new HttpsError("invalid-argument", "Check the highlighted fields.", { fields: error.fields ?? {} });
  }
  if (error.reason === "disabled") {
    return new HttpsError("failed-precondition", "This form is not accepting submissions.", { code: "disabled" });
  }
  if (error.reason === "conflict") {
    return new HttpsError("already-exists", FAILURE, { code: "conflict" });
  }
  if (error.reason === "rate_limited" || error.reason === "honeypot") {
    return new HttpsError("resource-exhausted", FAILURE, { code: "rejected" });
  }
  return new HttpsError("unavailable", FAILURE);
}
