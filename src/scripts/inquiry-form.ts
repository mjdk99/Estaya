import { messages } from "../config/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = new Set(["general", "support", "purchasing"]);

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const attempts = new WeakMap<HTMLFormElement, { id: string; hash: string }>();
let callableLoader: Promise<(data: Record<string, unknown>) => Promise<unknown>> | null = null;

for (const form of document.querySelectorAll<HTMLFormElement>("[data-inquiry-form]")) {
  const topic = new URLSearchParams(window.location.search).get("topic");
  const select = form.querySelector<HTMLSelectElement>('[data-field="topic"]');
  if (select && (topic === "support" || topic === "purchasing")) select.value = topic;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitForm(form);
  });
}

async function submitForm(form: HTMLFormElement): Promise<void> {
  if (form.dataset.pending === "true") return;
  const status = form.querySelector<HTMLElement>("[data-status]");
  const button = form.querySelector<HTMLButtonElement>("[type='submit']");
  if (!status || !button) return;

  const errors = validate(form);
  showErrors(form, errors);
  if (Object.keys(errors).length > 0) {
    status.textContent = "Check the highlighted fields.";
    focusStatus(status);
    return;
  }

  const body = payload(form);
  const hash = JSON.stringify(body);
  const previous = attempts.get(form);
  const submissionId = previous && previous.hash === hash ? previous.id : crypto.randomUUID();
  attempts.set(form, { id: submissionId, hash });

  form.dataset.pending = "true";
  button.disabled = true;
  form.setAttribute("aria-busy", "true");
  status.textContent = "Submitting your form.";

  try {
    const call = await getCallable();
    await call({ ...body, submissionId, companyFax: honeypotValue(form) });
    form.reset();
    attempts.delete(form);
    showErrors(form, {});
    status.textContent = form.dataset.success || messages.contact;
  } catch (error) {
    const parsed = readError(error);
    if (parsed.code === "already-exists") attempts.delete(form);
    if (parsed.fields && Object.keys(parsed.fields).length > 0) {
      showErrors(form, parsed.fields);
      status.textContent = parsed.fields._form || "Check the highlighted fields.";
    } else if (parsed.code === "failed-precondition") {
      status.textContent = "This form is not accepting submissions.";
    } else {
      const email = form.dataset.email;
      status.textContent = email ? `${messages.failure} You can also email ${email}.` : messages.failure;
    }
  } finally {
    form.dataset.pending = "false";
    button.disabled = false;
    form.removeAttribute("aria-busy");
    focusStatus(status);
  }
}

function validate(form: HTMLFormElement): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const element of controls(form)) {
    if (element.dataset.field === "companyFax") continue;
    const value = element.value.trim();
    const max = Number(element.dataset.max || "0");
    const key = element.dataset.field ?? element.name;
    if (element.required && !value) {
      errors[key] = element.dataset.requiredMessage || "This field is required.";
      continue;
    }
    if (value && max > 0 && value.length > max) {
      errors[key] = `Use ${max} characters or fewer.`;
      continue;
    }
    if (value && element.type === "email" && !EMAIL.test(value)) {
      errors[key] = "Enter a valid email address.";
    }
    if (value && element.dataset.url === "true") {
      try {
        const url = new URL(value);
        if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("protocol");
      } catch {
        errors[key] = "Enter a website that starts with http:// or https://.";
      }
    }
    if (key === "topic" && value && !TOPICS.has(value)) errors[key] = "Choose a topic.";
  }
  return errors;
}

function showErrors(form: HTMLFormElement, errors: Record<string, string>): void {
  for (const element of controls(form)) {
    const key = element.dataset.field;
    if (!key || key === "companyFax") continue;
    const message = errors[key];
    const slot = form.querySelector<HTMLElement>(`[data-error-for="${CSS.escape(key)}"]`);
    if (message) {
      element.setAttribute("aria-invalid", "true");
      if (slot) slot.textContent = message;
    } else {
      element.removeAttribute("aria-invalid");
      if (slot) slot.textContent = "";
    }
  }
  const formSlot = form.querySelector<HTMLElement>('[data-error-for="_form"]');
  if (formSlot) formSlot.textContent = errors._form ?? "";
}

function payload(form: HTMLFormElement): Record<string, unknown> {
  const top: Record<string, string> = {};
  const details: Record<string, string> = {};
  for (const element of controls(form)) {
    const key = element.dataset.field;
    if (!key || key === "companyFax") continue;
    const value = element.value.trim();
    if (!value && !element.required) continue;
    if (element.dataset.group === "details") details[key] = value;
    else top[key] = value;
  }
  return { kind: form.dataset.kind, ...top, details };
}

function honeypotValue(form: HTMLFormElement): string {
  return form.querySelector<HTMLInputElement>('[data-field="companyFax"]')?.value ?? "";
}

function controls(form: HTMLFormElement): FieldElement[] {
  return [...form.querySelectorAll<FieldElement>("[data-field]")];
}

function focusStatus(status: HTMLElement): void {
  status.tabIndex = -1;
  status.focus();
}

function readError(error: unknown): { code?: string; fields?: Record<string, string> } {
  if (!error || typeof error !== "object") return {};
  const candidate = error as { code?: string; details?: unknown };
  const code = candidate.code?.replace(/^functions\//, "");
  const details = unwrap(candidate.details);
  const fields = details && typeof details.fields === "object" && details.fields
    ? details.fields as Record<string, string>
    : undefined;
  return { code: details?.code || code, fields };
}

function unwrap(details: unknown): { fields?: unknown; code?: string } | null {
  if (!details) return null;
  if (Array.isArray(details)) {
    const match = details.find((item) => item && typeof item === "object" && ("fields" in item || "code" in item));
    return match && typeof match === "object" ? match as { fields?: unknown; code?: string } : null;
  }
  if (typeof details === "object") return details as { fields?: unknown; code?: string };
  return null;
}

async function getCallable(): Promise<(data: Record<string, unknown>) => Promise<unknown>> {
  if (!callableLoader) callableLoader = loadCallable();
  return callableLoader;
}

async function loadCallable(): Promise<(data: Record<string, unknown>) => Promise<unknown>> {
  const { initializeApp } = await import("firebase/app");
  const { connectFunctionsEmulator, getFunctions, httpsCallable } = await import("firebase/functions");
  const storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
  const app = initializeApp({
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    ...(storageBucket ? { storageBucket } : {}),
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  });
  if (import.meta.env.PUBLIC_USE_FIREBASE_EMULATOR !== "true" && import.meta.env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY) {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import("firebase/app-check");
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  }
  const functions = getFunctions(app, import.meta.env.PUBLIC_FIREBASE_FUNCTIONS_REGION || "us-central1");
  if (import.meta.env.PUBLIC_USE_FIREBASE_EMULATOR === "true") {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
  const callable = httpsCallable(functions, "submitInquiry", { timeout: 20000 });
  return (data) => callable(data);
}
