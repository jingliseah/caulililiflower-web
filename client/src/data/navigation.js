/**
 * NAV_LINKS — primary storefront navigation.
 * Used by: StorefrontLayout (desktop nav + mobile menu).
 */
export const NAV_LINKS = [
  { to: "/about", label: "Our story" },
  { to: "/shop", label: "Shop" },
  { to: "/custom-order", label: "Custom order" },
];

/**
 * FOOTER_COLS — footer link columns.
 * Used by: StorefrontLayout (footer grid).
 */
export const FOOTER_COLS = [
  {
    heading: "Shop",
    links: ["Keychains & pins", "Greeting cards", "Gift cards"],
  },
  {
    heading: "Studio",
    links: ["Our story", "How it's made", "Care guide", "Contact"],
  },
  {
    heading: "Help",
    links: ["Shipping", "Returns", "FAQ", "@caulililiflower"],
  },
];
