export const site = {
  name: "Estaya",
  tagline: "Where Resources Amplify Impact",
  mission:
    "Estaya connects valuable medical resources with partners, equipping them to meet critical needs and advance their missions.",
  vision:
    "A world where valuable medical resources never go to waste while people and organizations still need them.",
  description:
    "Estaya is building a way to recover surplus medical supplies and equipment and connect them with organizations that can use them.",
  heroCopy:
    "Estaya is building a way to recover surplus medical supplies and equipment and get them to nonprofit partners that can put them to use.",
} as const;

export const routes = [
  { path: "/", title: "Estaya | Medical Supply Recovery", description: site.heroCopy },
  { path: "/about/", title: "About Estaya", description: "Estaya is a Minnesota nonprofit building a medical supply recovery program." },
  {
    path: "/how-it-works/",
    title: "How Medical Supply Recovery Works | Estaya",
    description: "How Estaya plans to recover, assess, match, and fund a supply of medical products for nonprofit partners.",
  },
  {
    path: "/give-supplies/",
    title: "Give Medical Supplies | Estaya",
    description: "Hospitals, clinics, manufacturers, and distributors can tell Estaya about surplus medical supplies or equipment.",
  },
  {
    path: "/for-nonprofits/",
    title: "For Nonprofit Partners | Estaya",
    description: "Nonprofit organizations can tell Estaya what medical supplies they need and where the products would be used.",
  },
  {
    path: "/support/",
    title: "Support Estaya",
    description: "Help build the systems and partnerships Estaya needs to collect, assess, and distribute medical supplies.",
  },
  {
    path: "/contact/",
    title: "Contact Estaya",
    description: "Send Estaya a question or tell us how you would like to work together.",
  },
  {
    path: "/privacy/",
    title: "Privacy | Estaya",
    description: "How Estaya handles information submitted through this website.",
  },
] as const;

export const primaryNav = [
  { href: "/about/", label: "About" },
  { href: "/how-it-works/", label: "How It Works" },
  { href: "/give-supplies/", label: "Give Supplies" },
  { href: "/for-nonprofits/", label: "For Nonprofits" },
  { href: "/support/", label: "Support Estaya" },
] as const;

export const footerNav = [
  ...primaryNav,
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy" },
] as const;

export const values = [
  ["Stewardship", "We take care of the supplies, funds and information entrusted to us."],
  ["Partnership", "We work with organizations that know their communities and listen to what they need."],
  ["Resourcefulness", "We find practical ways to put useful supplies and equipment back to work."],
  ["Impact", "We measure our work by whether useful products reach organizations that can put them to use."],
  ["Integrity", "We act honestly, ethically and accountably, including when decisions are difficult."],
  ["Humility", "We listen, learn from mistakes and value what others know."],
  ["Trust", "We earn confidence by following through on commitments and communicating openly."],
] as const;

export const needParagraphs = [
  "U.S. healthcare organizations discard medical supplies and equipment that may still be useful. At the same time, healthcare providers in under-resourced communities can struggle to get basic products they need. The nonprofits serving them already know their communities and work with local healthcare providers. Sourcing, sorting and shipping products from multiple donors can take substantial time, money and space.",
  "Even established recovery operations can struggle to match available inventory with what partners need. A large shipment can leave a partner without the requested products and create extra work sorting, storing or disposing of items it cannot use. Equipment also brings practical questions about condition, compatibility, maintenance and shipping.",
  "Estaya’s approach is to collect and assess surplus in one place, match products to requests from qualified nonprofit partners and sell suitable donated inventory to help fund the work. Qualified nonprofits are intended to receive products at no product cost. Shipping may be partner-paid initially, and Estaya aims to subsidize more freight as resources allow. A partner should understand any freight or related logistics costs before accepting a shipment.",
] as const;

export const steps = [
  ["Recover.", "We plan to work with hospitals, clinics, manufacturers and distributors to identify medical products they would otherwise discard and coordinate how those products reach Estaya."],
  ["Assess.", "We will sort and assess supplies and equipment, track their source, and review condition and suitability for available uses."],
  ["Match.", "We will use requests from qualified nonprofit partners to identify products they can receive and use. Availability and shipping arrangements are confirmed during coordination."],
  ["Sustain.", "Sales of suitable donated products will help fund collection, sorting, storage and distribution so Estaya can make medical products available to qualified nonprofits at no product cost."],
] as const;

/**
 * Stand-in marks until approved SVG lockups are supplied.
 * Leave these null. Do not draw a temporary emblem.
 */
export const brandAssets = {
  logoHorizontal: null as string | null,
  logoStacked: null as string | null,
  emblem: null as string | null,
  hero: {
    width: 2400,
    height: 1350,
    avif: "/images/hero-1280.avif 1280w, /images/hero-2400.avif 2400w",
    webp: "/images/hero-1280.webp 1280w, /images/hero-2400.webp 2400w",
    src: "/images/hero-2400.webp",
  },
};

export const messages = {
  supply: "Thanks. We received your supply offer. Estaya will review the details and follow up by email.",
  partner: "Thanks. We received your inquiry. Estaya will review what your organization needs and follow up by email.",
  contact: "Thanks. Estaya received your message.",
  failure: "We couldn’t submit your form. Please try again.",
} as const;

export interface FormField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  maxLength: number;
  group: "top" | "details";
  requiredMessage: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  url?: boolean;
}

const topicOptions = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Supporting Estaya" },
  { value: "purchasing", label: "Commercial purchasing" },
];

export const forms = {
  supply_offer: {
    id: "offer",
    heading: "Tell us what you have",
    button: "Submit a supply offer",
    success: messages.supply,
    fields: [
      field("name", "Name", "text", true, 100, "top", "Enter your name.", "name"),
      field("email", "Work email", "email", true, 254, "top", "Enter a valid email address.", "email"),
      field("organization", "Organization", "text", true, 160, "top", "Enter the organization name.", "organization"),
      field("location", "City and state or region", "text", true, 160, "details", "Enter the city and state or region."),
      field("description", "Description of items", "textarea", true, 2000, "details", "Describe the items."),
      field("phone", "Phone", "tel", false, 40, "top", "Enter a shorter phone number.", "tel"),
      field("quantity", "Quantity or pallets", "text", false, 160, "details", "Enter this as text."),
      field("condition", "Condition and expiration", "textarea", false, 160, "details", "Enter this as text."),
      field("equipment", "Equipment manufacturer and model", "text", false, 160, "details", "Enter this as text."),
      field("timing", "Availability timing", "text", false, 160, "details", "Enter this as text."),
    ] satisfies FormField[],
  },
  partner_inquiry: {
    id: "inquire",
    heading: "Share your organization’s needs",
    button: "Send a partner inquiry",
    success: messages.partner,
    fields: [
      field("name", "Name", "text", true, 100, "top", "Enter your name.", "name"),
      field("email", "Work email", "email", true, 254, "top", "Enter a valid email address.", "email"),
      field("organization", "Nonprofit or organization name", "text", true, 160, "top", "Enter the nonprofit or organization name.", "organization"),
      field("needs", "Supplies needed", "textarea", true, 2000, "details", "Describe the supplies your organization needs."),
      field("region", "Region or country served", "text", true, 160, "details", "Enter the region or country served."),
      field("phone", "Phone", "tel", false, 40, "top", "Enter a shorter phone number.", "tel"),
      field("website", "Website", "text", false, 300, "details", "Enter a website that starts with http:// or https://.", "url"),
      field("quantity", "Quantity", "text", false, 160, "details", "Enter this as text."),
      field("timing", "Timing", "text", false, 160, "details", "Enter this as text."),
      field("intendedUse", "How the supplies are intended to be used", "textarea", false, 2000, "details", "Enter this as text."),
    ] satisfies FormField[],
  },
  contact: {
    id: "message",
    heading: "Send a message",
    button: "Send a message",
    success: messages.contact,
    fields: [
      field("name", "Name", "text", true, 100, "top", "Enter your name.", "name"),
      field("email", "Email", "email", true, 254, "top", "Enter a valid email address.", "email"),
      field("organization", "Organization", "text", false, 160, "top", "Enter a shorter organization name.", "organization"),
      {
        key: "topic",
        label: "Topic",
        type: "select" as const,
        required: true,
        maxLength: 40,
        group: "details" as const,
        requiredMessage: "Choose a topic.",
        options: topicOptions,
      },
      field("message", "Message", "textarea", true, 2000, "details", "Enter a message."),
    ] satisfies FormField[],
  },
};

function field(
  key: string,
  label: string,
  type: FormField["type"],
  required: boolean,
  maxLength: number,
  group: FormField["group"],
  requiredMessage: string,
  autoComplete?: string,
): FormField {
  return {
    key,
    label,
    type,
    required,
    maxLength,
    group,
    requiredMessage,
    autoComplete,
    url: autoComplete === "url",
  };
}

export function routeFor(pathname: string) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return routes.find((route) => route.path === path);
}
