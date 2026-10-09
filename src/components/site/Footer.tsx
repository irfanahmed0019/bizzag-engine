import { Link } from "@tanstack/react-router";
import { WhatsAppLink } from "@/components/site/WhatsAppButton";
export function Footer() {
  return <footer className="brand-footer"><div className="brand-footer-logo">BIZZAG</div><p>BE YOUR STYLE.</p><div className="brand-footer-links"><Link to="/shop">Shop</Link><Link to="/contact">Contact</Link><Link to="/about">About Bizzag</Link><WhatsAppLink>WhatsApp</WhatsAppLink></div><small>© {new Date().getFullYear()} BIZZAG. Be your style.</small></footer>;
}
