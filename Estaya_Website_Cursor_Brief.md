# Estaya website build brief for Cursor

## Start here

Save this file at the root of the website repository. Save the [preferred Estaya brand board](https://chatgpt.com/library?file_id=libfile_0f61f45815d88191902b0d17863c0dd0&account_id=personal) as `docs/estaya-brand-reference.png` so Cursor can use it as a visual reference. Then paste this into Cursor Agent.

> Read `Estaya_Website_Cursor_Brief.md` completely and use it as the implementation specification. Inspect the repository first. Build the responsive public website and its private, Firestore-backed inquiry workflow. Use Astro with TypeScript, Firebase Hosting, Cloud Firestore, and Firebase Cloud Functions as described below. Use the supplied launch copy and visual tokens. Follow the attached Estaya brand board for art direction, and use this brief for the exact website copy and implementation requirements. Build and test locally with the Firebase Emulator Suite. Leave production setup and publication to the owner, and list the exact configuration still needed. Start with the page templates and public content, then implement forms, then run the verification checklist. Check the disabled and enabled states for each launch feature. Preserve any unrelated repository work. If an asset or public claim is unverified, use the specific fallback in this brief. Return a summary of implemented routes, tests run and manual launch steps.

## 1. Website goals and launch scope

Estaya is a newly incorporated Minnesota nonprofit developing a medical supply recovery and redistribution program. The website should explain what happens to donated medical products, make it easy for organizations to start a conversation, and establish credibility while the operation is being built.

| Audience | What they need to learn | Primary action |
| --- | --- | --- |
| Hospitals, clinics, medical manufacturers and distributors | Whether Estaya may be able to recover their surplus and how to coordinate a handoff | **Offer medical supplies** |
| Nonprofits that source supplies for healthcare or humanitarian work | How matching works, who the program is intended for and what costs to expect | **Tell us what you need** |
| Individuals, foundations and organizations interested in supporting Estaya | What they would help build and how to connect with Estaya | **Ask about supporting Estaya** |
| Buyers and resellers | Who to contact about future opportunities to purchase suitable inventory | **Ask about purchasing** on Contact |

Build the public site and inquiry intake in the first release. Commercial listings, auctions, inventory visibility, partner accounts, ordering, CRM integrations, volunteer scheduling and an editorial CMS belong to later releases. Operate the launch inquiry queue in Firestore through authorized staff access to the Firebase console.

Public content uses launch-stage wording. Confirm before publication which inquiries Estaya is ready to receive. A product offer or partner inquiry starts a conversation and does not confirm acceptance, pickup, eligibility, stock or fulfillment. Verify the current organization and fundraising status before enabling money donation features. A discussion about supporting Estaya can use a general contact path while the charitable giving setup is being reviewed.

## 2. Organization and messaging

Use these sentences as written wherever the site identifies them as the mission and vision.

| Item | Wording |
| --- | --- |
| Name | Estaya |
| Tagline | Where Resources Amplify Impact |
| Mission | Estaya connects valuable medical resources with partners, equipping them to meet critical needs and advance their missions. |
| Vision | A world where valuable medical resources never go to waste while people and organizations still need them. |
| One-line description | Estaya is building a way to recover surplus medical supplies and equipment and connect them with organizations that can use them. |

### Core values

The seven value names come from Estaya’s planning. The descriptions below are website copy.

| Value | Website copy |
| --- | --- |
| Stewardship | We take care of the supplies, funds and information entrusted to us. |
| Partnership | We work with organizations that know their communities and listen to what they need. |
| Resourcefulness | We find practical ways to put useful supplies and equipment back to work. |
| Impact | We measure our work by whether useful products reach organizations that can put them to use. |
| Integrity | We act honestly, ethically and accountably, including when decisions are difficult. |
| Humility | We listen, learn from mistakes and value what others know. |
| Trust | We earn confidence by following through on commitments and communicating openly. |

### The need and Estaya’s response

U.S. healthcare organizations discard medical supplies and equipment that may still be useful. At the same time, healthcare providers in under-resourced communities can struggle to get basic products they need. The nonprofits serving them already know their communities and work with local healthcare providers. Sourcing, sorting and shipping products from multiple donors can take substantial time, money and space.

Even established recovery operations can struggle to match available inventory with what partners need. A large shipment can leave a partner without the requested products and create extra work sorting, storing or disposing of items it cannot use. Equipment also brings practical questions about condition, compatibility, maintenance and shipping.

Estaya’s approach is to collect and assess surplus in one place, match products to requests from qualified nonprofit partners and sell suitable donated inventory to help fund the work. Qualified nonprofits are intended to receive products at no product cost. Shipping may be partner-paid initially, and Estaya aims to subsidize more freight as resources allow. A partner should understand any freight or related logistics costs before accepting a shipment.

Use **surplus** for medical supplies and equipment a donor can no longer use, and **waste** when referring to disposal or the disposal outcome. Use **nonprofit partners** to describe the program’s audience and preserve **partners** in the mission statement. Describe planned operations as planned. Use direct language, name the actual work and give partner organizations credit for knowing their needs. Keep people and communities at the center of the narrative.

Hold the modeled $5.3 billion and 198,000 short tons U.S. estimates until the narrower nonpharmaceutical methodology and source are ready for public review. Publish impact numbers when Estaya has defined and verified its own measures. Start with fulfillment evidence from Estaya’s records, such as completed partner orders and requested products fulfilled by category. Treat weight as operational context. Use partner-approved stories and photography when available.

## 3. Brand guide

Use the uploaded brand board as the preferred design direction. Its strongest website references are the primary logo at the top, the five swatches, the typography samples and the laptop mockup at the bottom. Reuse their visual language for a complete site with clear navigation and forms. The board’s optional mission, vision and marketing samples are concept copy. Use the business-plan language in section 2 and the page copy in section 4.

### Color

The first five web values are sampled from the middle of the supplied palette swatches. The image has slight pixel variation. Treat these as working web values until original brand files supply official codes.

| CSS token | Hex | Role |
| --- | --- | --- |
| `--color-teal` | `#082F3B` | Deep Teal. Primary actions, headings, logo on light and main dark panels |
| `--color-sage` | `#607E62` | Sage Green. Emblem and restrained decorative accents |
| `--color-gold` | `#C7944A` | Warm Gold. Emblem, short dividers and small accents paired with Deep Teal |
| `--color-stone` | `#E5E1DA` | Stone. Quiet background sections and light panel details |
| `--color-slate` | `#354851` | Slate. Body text and secondary information |
| `--color-white` | `#FFFFFF` | Main canvas, cards and type on a tested dark overlay |
| `--color-off-white` | `#F8F7F4` | Optional warm canvas |
| `--color-teal-dark` | `#05232D` | Teal hover state, footer depth and hero overlays |
| `--color-input-border` | `#6C797D` | Form field outlines |
| `--color-error` | `#9C2C2C` | Error copy and borders on light surfaces |

Use white on Deep Teal for solid primary buttons, Deep Teal and Slate on white or Stone for text, and Warm Gold for accents on dark areas. Keep Sage Green largely in icons and illustrations. Use a visible two-tone focus ring across light and dark backgrounds. Validate rendered combinations against WCAG 2.2 AA, including text over the hero photo at all breakpoints and states. Pair status colors with text.

### Typography and layout

- Use **Playfair Display** for hero and section headings, usually 500–600. Use **Montserrat** for body, buttons, navigation and forms, with 400–500 for reading and 600–700 for controls. Self-host licensed WOFF2 files with `font-display: swap`. Fallbacks are `Georgia, serif` and `system-ui, sans-serif`.
- Set the homepage title to `clamp(2.65rem, 5.5vw, 4.75rem)` with line-height around 1.08. Set inner H1s to `clamp(2.25rem, 4vw, 3.5rem)`, H2s to `clamp(1.75rem, 3vw, 2.6rem)`, and body to 1–1.125rem with line-height around 1.65. Keep long prose to 62–68 characters per line.
- Use a white header and a full-bleed landscape hero with a centered serif title and light call to action, following the laptop mockup. Give the primary action a light fill and the secondary action a clear border or underlined treatment. Use a Deep Teal gradient overlay behind copy. Keep the image visible at the top and sides. Give the hero around 540–640px of height on desktop, with natural height driven by the content on phones. When the image is missing, use a solid Deep Teal hero with the same text treatment.
- Below the hero, alternate white and Stone sections. Use left-aligned headings on inner pages, short Warm Gold dividers sparingly, and a Deep Teal footer. Use three audience cards on wide layouts, then stack them when space tightens. Prefer subtle borders over prominent shadows.
- Build on a 4px spacing unit, a 1160px maximum container and fluid gutters from 20px to 40px. Use section padding around 56–96px, modest radii around 6–8px, and comfortable targets of at least 44px high for primary controls. Keep the mobile header compact and place both hero actions within easy reach.

### Logo and imagery

- The preferred emblem is the board’s gold upright seed or leaf above curved bands of Deep Teal and Sage Green. Pair it with the large uppercase serif **ESTAYA** wordmark. The tagline sits below the wordmark for full lockups. Preserve the emblem’s proportions, negative space and orientation.
- Use the horizontal lockup in the white header, the stacked light version in the dark footer and the emblem alone for the favicon and social avatar when finalized. Use about 28–36px emblem height in the header and at least half the emblem width in clear space around standalone placements. The tagline may be omitted in compact navigation. Use the one-line lockup only while it remains readable.
- Production assets needed are transparent SVGs or high-resolution PNGs for the horizontal, stacked and emblem-only versions, plus the reversed version where applicable. The board is a flattened layout reference. Keep it under `docs/` and out of site assets. While standalone art is pending, use a live uppercase Playfair Display wordmark and a simple text E favicon. Keep the replacement points centralized. Avoid drawing a different emblem as a temporary stand-in.
- For the hero, source or generate a cinematic sunrise over layered forested ridges, with muted cool teal shadows and warm gold at the horizon. Use it as an atmospheric brand image. Crop with room for the centered content and keep the darkest overlay behind the letters. Use a clean image without text or embedded marks. The footer can use quiet, oversized curved bands inspired by the emblem if approved artwork is available.
- Use documentary-style photography farther down the page to show boxed unused supplies, inventory assessment or shipment preparation. Use licensed or Estaya-owned images and clear actual photos with their subjects. Keep decorative landscapes out of mission-result stories.
- Use descriptive alt text on informative images and empty alt text on purely decorative images. Publish responsive WebP/AVIF with explicit dimensions. Load the hero eagerly if used, and defer images below the fold. Use simple consistent outline icons paired with visible labels when helpful.

### Header, footer and calls to action

Header order is **About**, **How It Works**, **Give Supplies**, **For Nonprofits**, and **Support Estaya**. Keep **Contact** in the mobile menu and footer. Use the wordmark for Home. Use **Offer medical supplies** and **For nonprofit partners** in the home hero. “Give Supplies” always refers to physical products. A future **Donate** button is reserved for financial contributions.

Footer content includes the Estaya wordmark, tagline, short description, core navigation, Contact, Privacy, and copyright. Add a verified public email, mailing address, social accounts, and any public tax wording only after the owner supplies or confirms them. The footer works with just a Contact link at launch.

## 4. Routes, page structure and launch copy

Publish directory routes with trailing slashes. Link to the canonical versions consistently. Each inner page starts with a single descriptive H1, then useful body copy and a clear action.

### Home · `/`

**H1** — Where Resources Amplify Impact.

**Hero copy** — Estaya is building a way to recover surplus medical supplies and equipment and get them to nonprofit partners that can put them to use.

**Buttons** — Offer medical supplies → `/give-supplies/#offer`. For nonprofit partners → `/for-nonprofits/`.

**The need** — Medical supplies and equipment that could still serve a purpose are discarded, even as healthcare providers struggle to get the products they need. Many nonprofits already know what their communities need. Finding, sorting and shipping those products takes time and resources.

**How it works** — Recover surplus from healthcare organizations. Assess what can be used and where it fits. Connect products with nonprofit partners and sell suitable inventory to help fund recovery and distribution. Link to `/how-it-works/`.

**Audience links** — “Have supplies to offer?” → Give Supplies. “Looking for supplies?” → For Nonprofits. “Want to help build Estaya?” → Support Estaya. Give each card a one-sentence description and a visible text link.

**Closing callout** — “Help build a more dependable source of medical supplies.” Link to Support Estaya.

### About · `/about/`

**H1** — About Estaya.

**Intro** — Estaya is a Minnesota nonprofit building a medical supply recovery program. We’re developing a central place to collect, assess and match surplus medical products with organizations that can use them.

**Sections** — Show the exact mission and vision from section 2, the full need and response copy from section 2, then all seven values. Link to How It Works. Add approved founder, board or public documents only when available. Avoid empty biography and report sections on the public page.

### How It Works · `/how-it-works/`

**H1** — From surplus to supplies partners can use.

1. **Recover.** We plan to work with hospitals, clinics, manufacturers and distributors to identify medical products they would otherwise discard and coordinate how those products reach Estaya.
2. **Assess.** We will sort and assess supplies and equipment, track their source, and review condition and suitability for available uses.
3. **Match.** We will use requests from qualified nonprofit partners to identify products they can receive and use. Availability and shipping arrangements are confirmed during coordination.
4. **Sustain.** Sales of suitable donated products will help fund collection, sorting, storage and distribution so Estaya can make medical products available to qualified nonprofits at no product cost.

**Links** — Offer medical supplies and Tell us what you need.

### Give Supplies · `/give-supplies/`

**H1** — Give surplus medical supplies and equipment.

**Intro** — If your hospital, clinic, manufacturing facility or distribution operation has surplus medical supplies or equipment, tell us what you have. Estaya will review the offer and follow up about fit and logistics.

**What to share** — Tell us the type of products, approximate quantities, condition and where they are located. For equipment, share the manufacturer and model if known. For supplies, share expiration information when available.

**FAQ**

- **What can I offer?** Contact us about surplus medical supplies or equipment. Acceptance depends on the items, their condition and whether Estaya has an appropriate way to use them. Estaya excludes pharmaceuticals.
- **Can I schedule a pickup or drop-off?** Start with an inquiry. Estaya will confirm the handoff and discuss freight or pickup when it can accept an offer.

**Form section** — `id="offer"`, heading “Tell us what you have,” button “Submit a supply offer.”

### For Nonprofits · `/for-nonprofits/`

**H1** — Tell us what medical supplies your organization needs.

**Intro** — Estaya is developing a program for nonprofit organizations that source supplies and equipment for healthcare and humanitarian work. Tell us what your organization needs and where it will be used so we can understand whether there’s a fit.

**How it starts** — Share your organization’s needs. Estaya will review the request and follow up about eligibility, available products and shipping as the program develops.

**Cost** — The program is designed to provide products to qualified nonprofit partners at no product cost. Partners may initially cover shipping. Estaya will confirm any costs and arrangements during follow-up.

**FAQ** — “Can individuals request supplies?” The launch program is designed for nonprofit organizations. “Does an inquiry reserve products?” An inquiry helps us understand your needs. Product availability and fulfillment are confirmed separately.

**Form section** — `id="inquire"`, heading “Share your organization’s needs,” button “Send a partner inquiry.”

### Support Estaya · `/support/`

**H1** — Help Estaya get started.

**Intro** — Help build the work that makes recovered medical products useful again. Estaya is setting up the systems and partnerships needed to collect, assess and distribute medical supplies.

**Support options** — “Introduce us to a healthcare organization,” “Connect us with a nonprofit partner,” and “Ask about supporting Estaya.” Send support inquiries to `/contact/?topic=support`. Link product donors to Give Supplies.

Keep a hosted financial giving integration behind an explicit disabled-by-default launch setting. When enabled by the owner, render **Donate** only with an approved verified provider URL and reviewed public wording. Use hosted checkout. Leave financial amounts, card data, receipt delivery and donation records to the provider. Keep the site’s product inquiry pipeline independent of financial gifts.

### Contact · `/contact/`

**H1** — Contact Estaya.

**Intro** — Send us a question or tell us how you’d like to work together. If you’re offering medical supplies or requesting them on behalf of a nonprofit, use the relevant form so we can review the details.

**Links** — Give Supplies and For Nonprofits.

**Form** — Topic choices are General inquiry, Supporting Estaya and Commercial purchasing. Allowlist `?topic=support` and `?topic=purchasing` as presets; arbitrary parameters have no effect. Button “Send a message.”

### Privacy · `/privacy/`

Use a launch draft based on the actual release behavior. Publish after owner review and supply a real effective date and privacy contact. Suggested copy:

> When you submit a form, Estaya receives the contact details and information you provide so we can respond, assess potential donations or partnerships, and coordinate next steps. Our hosting, form processing and security services help us operate the website. Authorized staff can access inquiries for this work. Please avoid sending patient information, payment details or sensitive personal records. You can contact us with privacy questions through the Contact page.

Before publishing, add the actual retention and deletion policy, describe any enabled email or analytics services and applicable cookies, and confirm disclosures match App Check and any other form screening. Keep marketing tracking disabled by default.

### 404

**H1** — Page not found. Include links to Home and Contact. Return HTTP 404 for invalid routes.

### Future publishing

Add an Updates or Impact route only when reviewed content exists. Financial documents, true results, public partner listings, an online donation campaign and a partner catalog can be added as they become ready. Keep customer purchasing inquiries available through Contact while commercial inventory is handled separately.

## 5. Firebase and Firestore architecture

| Layer | Implementation |
| --- | --- |
| Website | Astro static output and TypeScript. Prerender separate routes with their own SEO metadata. Keep page copy, navigation labels and asset references in the repo. |
| Hosting | Firebase Hosting serves `dist/` and custom 404. Set Astro to directory format with trailing slashes. Configure Hosting to enforce the corresponding trailing slash policy. Avoid a catch-all SPA rewrite. |
| Form processing | One regional Firebase Cloud Functions v2 callable, `submitInquiry`. Validate by inquiry type and use the Admin SDK to write Firestore. Initialize the Firebase browser SDK only on pages with active forms. Use a currently supported Node LTS runtime that Firebase Functions supports and pin the same major in dev. |
| Database | Cloud Firestore in Native mode. Use it for submission records and minimal throttling state. Choose the Firestore location before provisioning and deploy Functions in an appropriate nearby supported region. Keep production and development separate. |
| App verification | Firebase App Check with a web attestation provider supported by Firebase for the approved domains. Enforce App Check on the production callable. Keep emulator and debug configuration out of production. |
| Staff workflow | Named staff use the Firebase console with workspace-managed accounts and appropriate IAM permissions. Use views in the console to find incoming inquiries by type, status and date. The launch site has no public auth or staff login screen. |
| Payments | Optional hosted provider link, enabled by verified launch configuration. |
| Email | Launch uses the Firestore queue. Optional staff notification can be added later through a provider with server-managed secrets. Keep notifications minimal and deduplicate retries. Form success reflects Firestore persistence. |

Use Firebase Hosting and Firestore in development with the local Firebase Emulator Suite. The proposed deployed Cloud Functions backend uses the Blaze plan. Set a billing budget alert and a deliberate Functions instance ceiling before production exposure. Budget alerts notify the owner and do not cap spend. Select instance limits that suit expected traffic and test the failure experience.

### Submit and review inquiries

| Kind | Required | Optional | Submission button |
| --- | --- | --- | --- |
| `supply_offer` | Name, work email, organization, city and state/region, description of items | Phone, quantity/pallets, condition and expiration details, equipment manufacturer/model, availability timing | Submit a supply offer |
| `partner_inquiry` | Name, work email, nonprofit or organization name, supplies needed, region or country served | Phone, website, quantity, timing, how the supplies are intended to be used | Send a partner inquiry |
| `contact` | Name, email, topic, message | Organization | Send a message |

Use form-specific field labels. Accept valid email addresses regardless of their provider. Use text for quantities and logistics descriptions, because donors often only have estimates. Keep a short notice beside the submit button with a Privacy link and a request to exclude patient details, payment details and sensitive records. Omit file uploads in v1.

Success messages:

- **Supply offer** — “Thanks. We received your supply offer. Estaya will review the details and follow up by email.”
- **Partner inquiry** — “Thanks. We received your inquiry. Estaya will review what your organization needs and follow up by email.”
- **Contact** — “Thanks. Estaya received your message.”

Show specific validation errors near the relevant inputs. Keep values in memory while submitting and after recoverable errors. Announce pending, success and error states using an accessible live region. Disable repeat submissions while pending. On system failure, show “We couldn’t submit your form. Please try again.” Add the owner-approved public email as a fallback once configured. Clear inputs only after acknowledged success. For users without JavaScript, keep content and navigation usable and show the verified email when available.

### Firestore model

`inquiries/{submissionId}`

| Field | Shape and ownership |
| --- | --- |
| `schemaVersion` | Integer, initialized by server |
| `kind` | Enum `supply_offer`, `partner_inquiry`, `contact` |
| `status` | Server initializes `new`. Staff can progress it to `in_review`, `responded`, or `closed`. |
| `name`, `email`, `organization`, `phone` | Trimmed strings. Include optional fields only if supplied. |
| `details` | Type-specific allowlisted fields from the form contract. Store plain text and escape it when displaying. |
| `sourcePath` | Server maps from kind to a known route |
| `createdAt`, `updatedAt` | Firestore server timestamps on creation. Staff update `updatedAt` on review transitions. |
| `requestDigest` | Server-generated digest of validated canonical payload, used only for safe retries |
| `deleteAfter` | Optional Timestamp if the owner approves a cleanup policy. Use an explicit cleanup process or configured TTL if chosen. |

Use a client-generated cryptographically random UUID for `submissionId`. Reuse it for an unchanged submission after a timeout or retryable error. Regenerate if the user edits the payload. In a Firestore transaction, accept an existing ID only when the request digest agrees. Return the same generic success shape without echoing or exposing records. Create at most one inquiry and apply throttling atomically to new submissions. Suggested operational limiter state is a private `rateLimits/{hashedKey}` document with a short expiry and window counter. Key it by a server-side HMAC of available request signals, avoid raw network identifiers in Firestore, and account for legitimate users sharing a network. Apply a conservative shared-network ceiling plus a tighter per-email ceiling. Treat thresholds as adjustable configuration and verify production behavior with the actual hosting and gateway path.

Keep `firestore.rules` closed to all browser clients. The functions runtime uses Admin SDK, which bypasses rules and relies on IAM. Give its runtime service account only the permissions needed, including any bound secrets. Set runtime secrets in Secret Manager. The browser config contains the normal Firebase web project identifiers and public App Check site key. Never ship Admin credentials, email provider credentials, or the rate-limit signing secret in public environment variables.

The server must check the feature setting for the submitted kind, reject unexpected keys and types, enforce bounded input before writes, and treat honeypot or over-limit requests as rejected. Recommended bounds are name 100, email 254, organization 160, location 160, phone 40, website 300, each short detail field 160, each narrative 2,000 characters and total payload 12 KB. Validate enumerated topics, normalize email only as needed for throttling, and allow only HTTP(S) URLs for optional organization websites. Log operational error codes and counts, with no inquiry payloads or raw contact data. Keep firestore indexes minimal until a real staff query needs a new one. Exclude free text from indexing where helpful.

### Repository and configuration

Create `astro.config.mjs`, `firebase.json`, `firestore.rules`, `firestore.indexes.json`, `functions/`, `src/pages/`, `src/components/`, `src/layouts/`, `src/styles/`, a shared typed content/site configuration module, `public/` and `README.md`. Use a checked-in lockfile and a non-secret `.env.example`. Keep project aliases or approved project IDs explicit in deployment commands.

| Setting | Default and behavior |
| --- | --- |
| Canonical public URL | Set after the domain is confirmed. Previews use noindex; generate production sitemap and canonical URLs from the approved base. |
| Firebase public config | Document all required Astro `PUBLIC_FIREBASE_*` values, Functions region and App Check public site key in `.env.example`. |
| Public contact email | Unset until verified. Omit unused mailto links and route general contact to the active contact form. |
| Supply offer and partner interest | Implement separate settings, active in the emulator. Production activation requires the corresponding intake process, deployed callable and a confirmed staff owner. Until then show a neutral availability message with a general contact link if available. |
| Financial giving | Disabled until the owner reviews giving status and configures an approved HTTPS provider URL. |
| App Check and limits | Enforce attestation in production. Use local emulator/debug configuration only for development. Document server-side limits, feature settings, and secret binding. |
| Analytics | Off initially. If enabled later, measure form completions and CTA clicks without sending form data. Update the privacy page to reflect actual collection. |

Configure Hosting security headers to fit the implementation. Test a restrictive Content Security Policy against the exact Firebase and App Check origins in staging. Use MIME sniffing protection and a conservative referrer policy. Set distinct cache behavior for fingerprinted assets versus HTML. Do not publish workspace notes, design references, source files, environment files or secrets in the Hosting directory.

## 6. SEO, accessibility and launch verification

Suggested title tags are **Estaya | Medical Supply Recovery**, **About Estaya**, **How Medical Supply Recovery Works | Estaya**, **Give Medical Supplies | Estaya**, **For Nonprofit Partners | Estaya**, **Support Estaya**, **Contact Estaya**, and **Privacy | Estaya**. Write one description per route based on the page intro. Add a configured canonical URL, sitemap, robots file, favicon and an Open Graph image based on the approved lockup or the live-type fallback. Use basic Organization structured data grounded in verified public details.

| Check | Done when |
| --- | --- |
| Public routes | All pages render as static HTML, load directly from their URLs and have working internal links and anchors. Unknown URLs return the 404 page and status. Local preview matches route behavior. |
| Brand implementation | Typography, color, hero and logo treatments follow the preferred board. Site reads cleanly when the hero image and final logo are missing. |
| Responsive | Check 360, 768 and 1440px widths, plus browser zoom. No clipped headlines, horizontal overflow or unreachable navigation. |
| Accessible | Use semantic regions, a skip link and heading order. Verify keyboard navigation, visible focus, mobile menu focus handling, text contrast, reduced-motion behavior, labeled controls and announced error/success states. Run automated accessibility checks and a manual keyboard pass. |
| Firestore integration | With emulators, submit all three forms and verify exactly one correct private record for each. Check retry after a simulated timeout, concurrent retries, duplicate payload IDs, invalid fields, disabled kind, throttling and Firestore failure. Verify browser clients cannot read or write the collections, including through arbitrary document IDs. |
| Launch settings | Verify contact details, URL, public organization wording, inquiry readiness, funding setup, privacy copy and image/mark permissions. Test all feature-off states. Ensure staging is noindex and production is indexable when approved. |
| Deployment handoff | Provide repeatable install, typecheck, lint, build, emulator and test commands. Include a production setup checklist for the Firebase projects, region and database, Authorized Domains and App Check as applicable, IAM, billing alerts, secrets, custom domain and deployment order. Record checks completed and prerequisites still pending. |

Put production configuration in the README. Deploy database rules and backend before pointing production forms at them, then verify one approved smoke submission for each enabled form and remove the test records. Confirm forwards or replies to the public inbox work. Use the official setup references below and verify current commands for the installed CLI and package versions.

## 7. References and editorial decisions

- Estaya’s exact mission, vision and program direction come from the November 18 business plan. Shorter page copy in this brief is drafted for the website. [Estaya Business Plan](https://chatgpt.com/library?file_id=libfile_5c5d19c81edc8191b87dc4b00d3c5b1b&account_id=personal)
- The visual direction follows the supplied board. The palette hex values were sampled from the image. The production logo files, approved domain and final photography still need to be supplied or confirmed. [Preferred Estaya brand board](https://chatgpt.com/library?file_id=libfile_0f61f45815d88191902b0d17863c0dd0&account_id=personal)
- The initial site uses inquiry forms instead of partner ordering, and avoids publishing research estimates, prospective partner names or tax-deductibility promises while the underlying public claims are verified. Confirm the applicable requirements for the intended fundraising launch. [Minnesota Attorney General charity registration](https://www.ag.state.mn.us/Charity/InfoCharitableOrgandTrusts.asp) · [IRS guidance on contributions while exemption applications are pending](https://www.irs.gov/charities-non-profits/charitable-organizations/exempt-organizations-general-issues-deductibility-of-contributions-while-application-pending)
- [Astro deployment to Firebase Hosting](https://docs.astro.build/en/guides/deploy/firebase/) · [Firebase Hosting configuration](https://firebase.google.com/docs/hosting/full-config) · [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [App Check for Cloud Functions](https://firebase.google.com/docs/app-check/cloud-functions) · [Cloud Functions configuration and secrets](https://firebase.google.com/docs/functions/config-env) · [Firestore rules testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator) · [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
