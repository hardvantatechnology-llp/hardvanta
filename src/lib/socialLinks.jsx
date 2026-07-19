// Shared social-link data — used by the Footer and the new top delivery bar
// so URLs/icons never drift between the two.
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

// X (Twitter) official SVG — lucide doesn't have the X logo.
export function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export const socials = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: XIcon, href: "#", label: "X" },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/company/hardvanta-technologies-llp/posts/?feedView=all",
    label: "LinkedIn",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/hardvantatechnologies",
    label: "Instagram",
  },
  { Icon: Youtube, href: "#", label: "YouTube" },
];
