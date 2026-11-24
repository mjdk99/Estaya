import { createHash } from "crypto";

export const SCHEMA_VERSION = 1;
export const KINDS = ["supply_offer", "partner_inquiry", "contact"] as const;
export type Kind = (typeof KINDS)[number];

export const SOURCE_PATH: Record<Kind, string> = {
  supply_offer: "/give-supplies/",
  partner_inquiry: "/for-nonprofits/",
  contact: "/contact/",
};

const TOP_KEYS = new Set([
  "submissionId",
  "kind",
  "name",
  "email",
  "organization",
  "phone",
  "details",
  "companyFax",
]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = new Set(["general", "support", "purchasing"]);
const PAYLOAD_LIMIT = 12 * 1024;

const LIMITS = {
  name: 100,
  email: 254,
  organization: 160,
  phone: 40,
  short: 160,
  narrative: 2000,
  website: 300,
};

export interface CanonicalInquiry {
  submissionId: string;
  kind: Kind;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  details: Record<string, string>;
  digest: string;
}

export type ValidateResult =
  | { ok: true; value: CanonicalInquiry }
  | { ok: false; reason: "invalid"; fields: Record<string, string> }
  | { ok: false; reason: "honeypot" };

interface FieldRule {
  message: string;
  max: number;
}

export function validateInquiry(raw: unknown): ValidateResult {
  if (!isPlainObject(raw)) {
    return invalid({ _form: "Submit the form again." });
  }

  let encoded = 0;
  try {
    encoded = Buffer.byteLength(JSON.stringify(raw), "utf8");
  } catch {
    return invalid({ _form: "Submit the form again." });
  }
  if (encoded > PAYLOAD_LIMIT) {
    return invalid({ _form: "That submission is too long. Shorten it and try again." });
  }

  for (const key of Object.keys(raw)) {
    if (!TOP_KEYS.has(key)) return invalid({ _form: "Submit the form again." });
  }

  if (raw.companyFax !== undefined && raw.companyFax !== "") {
    if (typeof raw.companyFax !== "string" || raw.companyFax.trim() !== "") {
      return { ok: false, reason: "honeypot" };
    }
  }

  const fields: Record<string, string> = {};
  const submissionId = readRequired(raw.submissionId, 80, fields, "submissionId", "Submit the form again.");
  if (submissionId && !UUID_PATTERN.test(submissionId)) {
    fields.submissionId = "Submit the form again.";
  }

  const kind = raw.kind;
  const knownKind = kind === "supply_offer" || kind === "partner_inquiry" || kind === "contact";
  if (!knownKind) fields.kind = "Submit the form again.";

  const name = readRequired(raw.name, LIMITS.name, fields, "name", "Enter your name.");
  const email = readRequired(raw.email, LIMITS.email, fields, "email", "Enter a valid email address.");
  if (email && !EMAIL_PATTERN.test(email)) fields.email = "Enter a valid email address.";

  const details: Record<string, string> = {};
  if (!isPlainObject(raw.details)) {
    fields.details = "Submit the form again.";
  } else if (kind === "supply_offer") {
    collectDetails(raw.details, details, fields, {
      location: { message: "Enter the city and state or region.", max: LIMITS.short },
      description: { message: "Describe the items.", max: LIMITS.narrative },
    }, {
      quantity: LIMITS.short,
      condition: LIMITS.short,
      equipment: LIMITS.short,
      timing: LIMITS.short,
    });
  } else if (kind === "partner_inquiry") {
    collectDetails(raw.details, details, fields, {
      needs: { message: "Describe the supplies your organization needs.", max: LIMITS.narrative },
      region: { message: "Enter the region or country served.", max: LIMITS.short },
    }, {
      website: LIMITS.website,
      quantity: LIMITS.short,
      timing: LIMITS.short,
      intendedUse: LIMITS.narrative,
    });
    if (details.website && !isHttpUrl(details.website)) {
      fields.website = "Enter a website that starts with http:// or https://.";
      delete details.website;
    }
  } else if (kind === "contact") {
    collectDetails(raw.details, details, fields, {
      topic: { message: "Choose a topic.", max: 40 },
      message: { message: "Enter a message.", max: LIMITS.narrative },
    }, {});
    if (details.topic && !TOPICS.has(details.topic)) {
      fields.topic = "Choose a topic.";
      delete details.topic;
    }
  }

  let organization: string | undefined;
  if (kind === "supply_offer") {
    organization = readRequired(raw.organization, LIMITS.organization, fields, "organization", "Enter the organization name.");
  } else if (kind === "partner_inquiry") {
    organization = readRequired(raw.organization, LIMITS.organization, fields, "organization", "Enter the nonprofit or organization name.");
  } else if (typeof raw.organization === "string") {
    if (raw.organization.trim()) {
      organization = readRequired(raw.organization, LIMITS.organization, fields, "organization", "Enter a shorter organization name.");
    }
  } else if (raw.organization !== undefined) {
    fields.organization = "Enter the organization name.";
  }

  let phone: string | undefined;
  if (typeof raw.phone === "string") {
    if (raw.phone.trim()) {
      phone = readRequired(raw.phone, LIMITS.phone, fields, "phone", "Enter a shorter phone number.");
    }
  } else if (raw.phone !== undefined) {
    fields.phone = "Enter a phone number as text.";
  }

  if (Object.keys(fields).length > 0 || !knownKind || !name || !email || !submissionId) {
    return invalid(fields);
  }

  const value: CanonicalInquiry = {
    submissionId,
    kind,
    name,
    email,
    details,
    digest: "",
  };
  if (organization) value.organization = organization;
  if (phone) value.phone = phone;
  value.digest = digestFor(value);
  return { ok: true, value };
}

export function digestFor(value: Pick<CanonicalInquiry, "kind" | "name" | "email" | "organization" | "phone" | "details">): string {
  const canonical = {
    details: value.details,
    email: value.email,
    kind: value.kind,
    name: value.name,
    organization: value.organization ?? null,
    phone: value.phone ?? null,
  };
  return createHash("sha256").update(stableString(canonical), "utf8").digest("hex");
}

function collectDetails(
  input: Record<string, unknown>,
  details: Record<string, string>,
  fields: Record<string, string>,
  required: Record<string, FieldRule>,
  optional: Record<string, number>,
): void {
  const allowed = new Set([...Object.keys(required), ...Object.keys(optional)]);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) {
      fields._form = "Submit the form again.";
      return;
    }
  }
  for (const [key, rule] of Object.entries(required)) {
    const value = readRequired(input[key], rule.max, fields, key, rule.message);
    if (value) details[key] = value;
  }
  for (const [key, max] of Object.entries(optional)) {
    if (input[key] === undefined || input[key] === "") continue;
    const value = readRequired(input[key], max, fields, key, "Enter this as text.");
    if (value) details[key] = value;
  }
}

function readRequired(
  value: unknown,
  max: number,
  fields: Record<string, string>,
  key: string,
  message: string,
): string | undefined {
  if (typeof value !== "string") {
    fields[key] = message;
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    fields[key] = message;
    return undefined;
  }
  if (trimmed.includes("\0")) {
    fields[key] = message;
    return undefined;
  }
  if (trimmed.length > max) {
    fields[key] = `Use ${max} characters or fewer.`;
    return undefined;
  }
  return trimmed;
}

function invalid(fields: Record<string, string>): ValidateResult {
  return { ok: false, reason: "invalid", fields };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function stableString(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map((item) => stableString(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableString(record[key])}`).join(",")}}`;
}
