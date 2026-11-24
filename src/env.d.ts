/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_ALLOW_INDEX?: string;
  readonly PUBLIC_USE_FIREBASE_EMULATOR?: string;
  readonly PUBLIC_FIREBASE_API_KEY?: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID?: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
  readonly PUBLIC_FIREBASE_APP_ID?: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly PUBLIC_FIREBASE_FUNCTIONS_REGION?: string;
  readonly PUBLIC_FIREBASE_APPCHECK_SITE_KEY?: string;
  readonly PUBLIC_INTAKE_SUPPLY_OFFER?: string;
  readonly PUBLIC_INTAKE_PARTNER_INQUIRY?: string;
  readonly PUBLIC_INTAKE_CONTACT?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
  readonly PUBLIC_DONATE_ENABLED?: string;
  readonly PUBLIC_DONATE_URL?: string;
  readonly PUBLIC_DONATE_WORDING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
