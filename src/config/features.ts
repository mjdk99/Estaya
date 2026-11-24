export type IntakeKind = "supply_offer" | "partner_inquiry" | "contact";

const intakeFlags: Record<IntakeKind, keyof ImportMetaEnv> = {
  supply_offer: "PUBLIC_INTAKE_SUPPLY_OFFER",
  partner_inquiry: "PUBLIC_INTAKE_PARTNER_INQUIRY",
  contact: "PUBLIC_INTAKE_CONTACT",
};

export function siteUrl(): string | null {
  const value = import.meta.env.PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function indexingEnabled(): boolean {
  return import.meta.env.PUBLIC_ALLOW_INDEX === "true" && Boolean(siteUrl());
}

function firebaseConfigured(): boolean {
  const env = import.meta.env;
  return Boolean(
    env.PUBLIC_FIREBASE_API_KEY &&
      env.PUBLIC_FIREBASE_AUTH_DOMAIN &&
      env.PUBLIC_FIREBASE_PROJECT_ID &&
      env.PUBLIC_FIREBASE_APP_ID &&
      env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  );
}

function appCheckReady(): boolean {
  if (import.meta.env.PUBLIC_USE_FIREBASE_EMULATOR === "true") return true;
  return Boolean(import.meta.env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY);
}

export function intakeOpen(kind: IntakeKind): boolean {
  return import.meta.env[intakeFlags[kind]] === "true" && firebaseConfigured() && appCheckReady();
}

export function contactEmail(): string | null {
  const value = import.meta.env.PUBLIC_CONTACT_EMAIL?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return value;
}

export function donateOffer(): { href: string; wording: string } | null {
  if (import.meta.env.PUBLIC_DONATE_ENABLED !== "true") return null;
  const href = import.meta.env.PUBLIC_DONATE_URL?.trim() ?? "";
  const wording = import.meta.env.PUBLIC_DONATE_WORDING?.trim() ?? "";
  if (!wording || !href.startsWith("https://")) return null;
  return { href, wording };
}
