import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Réalisations", href: "/galerie" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

const LOGO_SIZES: Record<string, string> = {
  sm: "h-12",
  md: "h-16",
  lg: "h-20",
  xl: "h-24",
  "2xl": "h-16 sm:h-20 lg:h-32",
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { data: siteContent = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

  const logoUrl = siteContent["header.logo_url"] || "/images/logo-myjantes.png";
  const logoSize = siteContent["header.logo_size"] || "lg";
  const logoClass = LOGO_SIZES[logoSize] || LOGO_SIZES.lg;
  const phone = siteContent["contact.phone"] || "03 21 40 80 53";
  const phoneHref = siteContent["contact.phone_href"] || "tel:+33321408053";

  const navLinks = [1, 2, 3, 4, 5].map(n => ({
    label: siteContent[`nav.link_${n}_label`] || DEFAULT_NAV_LINKS[n - 1]?.label || "",
    href: siteContent[`nav.link_${n}_href`] || DEFAULT_NAV_LINKS[n - 1]?.href || "/",
  })).filter(l => l.label);

  const ctaLabel = siteContent["nav.cta_label"] || "Devis gratuit";
  const ctaHref = siteContent["nav.cta_href"] || "/contact#formulaire";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-white shadow-md"
          : "bg-white/90 backdrop-blur-md shadow-sm"
      }`}
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link href="/" data-testid="link-logo" className="flex items-center group">
            <img
              src={logoUrl}
              alt="MyJantes - L'Expert des jantes en alu"
              className={`${logoClass} w-auto object-contain group-hover:opacity-90 transition-opacity`}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                  isActive(link.href)
                    ? "text-auto-red bg-auto-red/8"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={phoneHref}
              data-testid="link-phone-cta"
              className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-auto-red" />
              <span>{phone}</span>
            </a>
            <Button
              asChild
              className="hidden lg:inline-flex bg-auto-red hover:bg-auto-red-dark text-white border-0 text-sm font-black px-6"
              data-testid="button-nav-devis"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                className={`block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(link.href)
                    ? "text-auto-red bg-auto-red/5"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a
                href={phoneHref}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700"
                data-testid="link-mobile-phone"
              >
                <Phone className="w-4 h-4 text-auto-red" />
                {phone}
              </a>
              <Button
                asChild
                className="bg-auto-red hover:bg-auto-red-dark text-white border-0"
                data-testid="button-mobile-devis"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
