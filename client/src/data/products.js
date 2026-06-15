/**
 * MAKES — how a product is produced.
 * Used by: Home (wayfinder grid), Shop (filter chips + getBanner), ProductDetail (make badge + callout).
 *
 * Fields:
 *   lead     — short label used in chips and wayfinder cards
 *   leadFull — longer sentence used in the ProductDetail callout card
 *   bg       — Tailwind class for colored dot/chip backgrounds
 *   tone     — semantic key used for badge color lookup (BADGE in ProductDetail)
 *   lightText — true when white text is legible on the banner background
 */
export const MAKES = [
  {
    id: "bespoke",
    label: "Made to order",
    desc: "Custom — stitched from your photo.",
    lead: "2–3 weeks",
    leadFull: "Hand-stitched from your photo — please allow 2–3 weeks.",
    bg: "bg-cat-terra",
    tone: "terra",
    lightText: true,
  },
  {
    id: "ready",
    label: "Ready to ship",
    desc: "One-of-a-kind, in stock right now.",
    lead: "Ships in 2–4 days",
    leadFull: "One-of-a-kind and in stock — ships in 2–4 days.",
    bg: "bg-cat-moss",
    tone: "moss",
    lightText: true,
  },
  {
    id: "studio",
    label: "Prints & gifts",
    desc: "Cards, pins & totes — made in-studio.",
    lead: "Ships fast",
    leadFull: "Printed and made in-studio — ships fast.",
    bg: "bg-cat-golden",
    tone: "golden",
    lightText: false,
  },
];

/**
 * CATEGORIES — product collection categories.
 * Used by: Home (category grid cards), Shop (filter chips + getBanner).
 *
 * Fields:
 *   bg         — Tailwind class for card/chip background colour
 *   text       — Tailwind class for card text colour
 *   bannerBg   — CSS custom property value used in Shop's dynamic inline banner style
 *   lightText  — true when white text is legible on the banner background
 */
export const CATEGORIES = [
  {
    id: "cauliger",
    name: "Cauliger & Friends",
    blurb: "The signature characters.",
    bg: "bg-cat-terra",
    text: "text-cream",
    bannerBg: "var(--cat-terracotta)",
    lightText: true,
  },
  {
    id: "garden",
    name: "Flower & Garden",
    blurb: "Blooms from Broccoli's garden.",
    bg: "bg-cat-moss",
    text: "text-cream",
    bannerBg: "var(--cat-moss)",
    lightText: true,
  },
  {
    id: "pets",
    name: "People & Pets",
    blurb: "Your photo stitched as a keepsake.",
    bg: "bg-cat-sky",
    text: "text-cream",
    bannerBg: "var(--cat-sky)",
    lightText: true,
  },
  {
    id: "wangi",
    name: "Ugly but Wangi",
    blurb: "Charmingly odd, impossibly lovable.",
    bg: "bg-cat-pistachio",
    text: "text-walnut",
    bannerBg: "var(--cat-pistachio)",
    lightText: false,
  },
  {
    id: "printed",
    name: "Prints & gifts",
    blurb: "Cards, prints & paper goods.",
    bg: "bg-cat-golden",
    text: "text-walnut",
    bannerBg: "var(--cat-golden)",
    lightText: false,
  },
];

/**
 * PROCESS_STEPS — the three-step commission process.
 * Used by: Home (process section), CustomOrder (process strip).
 */
export const PROCESS_STEPS = [
  {
    n: "01",
    t: "Share your memory",
    d: "Send a photo and tell us the story behind it.",
  },
  {
    n: "02",
    t: "We redraw it",
    d: "We sketch your memory in Cauliger's storybook style for your approval.",
  },
  {
    n: "03",
    t: "Stitched & framed",
    d: "Hand-stitched in cotton thread and framed in a wooden hoop.",
  },
];

/**
 * HOOP_FINISHES — available hoop frame finishes.
 * Used by: ProductDetail (swatch selector), CustomOrder (RadioChips).
 *
 * Fields:
 *   value — form field value / state key
 *   label — display label
 *   bg    — Tailwind class for the coloured swatch dot/circle
 */
export const HOOP_FINISHES = [
  { value: "walnut", label: "Walnut", bg: "bg-walnut" },
  { value: "natural", label: "Natural", bg: "bg-paper-300" },
  { value: "cream", label: "Cream", bg: "bg-cream" },
];
