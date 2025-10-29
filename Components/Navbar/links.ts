export type NavLink = {
  href: string;
  label: string;
};

// Single source of truth for top-level navigation links
export const NAV_LINKS: NavLink[] = [
  { href: "/recitations", label: "Recitations" },
  { href: "/mushaf", label: "Mus'haf" },
];

export const ACCOUNT_LINKS: NavLink[] = [
  //   { href: "/profile", label: "Profile" },
  //   { href: "/settings", label: "Settings" },
];
