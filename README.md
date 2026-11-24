# Estaya

Public website for Estaya, the Minnesota nonprofit described in `Estaya_Website_Cursor_Brief.md`. The site explains a medical supply recovery program that is still being built, and it can take supply, partner, and contact inquiries once those paths are turned on.

This is not the German real-estate company that also uses the name Estaya. Copy follows the November 2026 website brief.

Firebase project id: `estaya`. Project number: `1004630519922`. Both are set from the owner’s confirmation. `.firebaserc` points at `estaya`. No one has logged in or deployed from this workspace.

Astro writes the static site into `public/`, which is the directory `firebase.json` already serves. Source images and the favicon live in `static/`. There is no single-page rewrite.

## Local commands

Use Node.js 22. From `/agent`:

```bash
npm install
npm --prefix functions install
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run preview` serves the production build at `http://127.0.0.1:4321/`. That build keeps inquiry forms closed and sends `noindex`.

To work on the forms against the emulator:

```bash
node functions/scripts/ensure-dev-secret.mjs
npm --prefix functions run build
npm run dev
```

In another terminal:

```bash
npx firebase emulators:start --only hosting,functions,firestore
```

`npm run dev` loads `.env.development`, shows the three forms, and points the callable at `127.0.0.1:5001`. Do not use that file for a production build.

```bash
npm run test:emulator
```

runs the Firestore and Functions emulators, submits all three inquiry types, and checks rules, retries, conflicts, and the email throttle.

## Firebase CLI

Install and sign in only when you are ready to deploy. This repository does not run those commands.

```bash
npm install -g firebase-tools
firebase login
firebase use estaya
```

`firebase use estaya` matches `.firebaserc`. Replace it only if the real project id changes.

Deploy rules and the function before Hosting, then smoke-test one approved submission of each enabled form and delete those records:

```bash
firebase deploy --only firestore:rules,firestore:indexes,functions
firebase deploy --only hosting
```

`npm run build` runs before a Hosting deploy because `firebase.json` has a hosting predeploy hook. Functions compile in their own predeploy hook.

## Production checklist

Still required before publication:

1. Create the Firestore database in Native mode and choose its location first. `us-central1` is the function region. A United States multi-region such as `nam5` is a reasonable database location; confirm it before the first create. Production and development should be separate projects if both will exist.
2. Blaze plan, a billing budget alert, and the function ceiling already set in code (`maxInstances: 10` on `submitInquiry`). Budget alerts do not stop spend.
3. Web app config for project `estaya` is in gitignored `.env.production` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). It is not hardcoded in source. `.env.example` lists the variable names only.
4. App Check site key was not provided. `PUBLIC_FIREBASE_APPCHECK_SITE_KEY` is unset. Production still enforces App Check on `submitInquiry` once deployed, and the site will not show intake forms until a site key is set. Do not ship an App Check debug token.
5. Secret Manager: `firebase functions:secrets:set RATE_LIMIT_SECRET`. The emulator uses `functions/.secret.local`, which is gitignored. Optional tuning: `EMAIL_RATE_LIMIT` (default 5/hour), `NETWORK_RATE_LIMIT` (default 30/hour), and the matching window variables.
6. Turn on intake only after a person owns the queue. Set `INTAKE_SUPPLY_OFFER`, `INTAKE_PARTNER_INQUIRY`, and `INTAKE_CONTACT` to `true` on the function, and the matching `PUBLIC_INTAKE_*` values to `true` at build time. Until then the pages show a neutral closed message.
7. Authorized domains, staff IAM for the Firebase console, and saved console filters for `inquiries` by `kind`, `status`, and `createdAt`. There is no public or staff login screen.
8. Confirmed canonical URL. Set `PUBLIC_SITE_URL` and `PUBLIC_ALLOW_INDEX=true` on the production build only. Previews stay `noindex` and do not publish a sitemap.
9. Public email, mailing address, social accounts, and any tax or registration wording. None are printed until they are confirmed. `PUBLIC_CONTACT_EMAIL` adds a mailto link and a form fallback.
10. Financial giving stays off. Set `PUBLIC_DONATE_ENABLED=true`, an `https://` `PUBLIC_DONATE_URL`, and reviewed `PUBLIC_DONATE_WORDING` together. Card data and receipts stay with the provider.
11. Privacy review: effective date, privacy contact, retention and deletion, and a description of App Check or email if those are enabled. Marketing analytics stay off.
12. Approved logo files (horizontal, stacked, emblem-only) and any documentary photography. Replacement points are `brandAssets` in `src/config/site.ts`. The current mark is the word ESTAYA in Playfair Display, and the favicon is a text E.
13. Custom domain and a check that forwards reach the real inbox. Remove smoke-test inquiry documents after review.

Firestore rules deny every browser read and write. The function uses the Admin SDK. Staff work in the Firebase console. Inquiry documents live at `inquiries/{submissionId}` with status `new`. Staff can move a record to `in_review`, `responded`, or `closed` and should set `updatedAt` when they do. `deleteAfter` is unset until a retention policy exists.

## What the launch build deliberately leaves out

Commercial listings, auctions, inventory, partner accounts, ordering, CRM, volunteer scheduling, and an editorial CMS are later work. The modeled national waste figures are not published. No founder biographies or impact counts are shown, because none were supplied. The brand board image was not in the workspace, so `docs/estaya-brand-reference.png` is not included. The hero is a generated landscape, not an Estaya photograph, and there are no photos of supplies or people.
