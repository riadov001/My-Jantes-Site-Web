import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Accueil", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Rénovation de jantes", href: "/services/renovation-jantes" },
      { label: "Peinture de jantes", href: "/services/peinture-jantes" },
      { label: "Redressage de jantes", href: "/services/redressage-jantes" },
      { label: "Débosselage", href: "/services/debosselage" },
    ],
  },
  { label: "Galerie", href: "/galerie" },
  { label: "Blog", href: "/blog" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
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
          {/* Logo */}
          <Link href="/" data-testid="link-logo" className="flex items-center group">
            <img
              src="/images/logo-myjantes.png"
              alt="MyJantes - L'Expert des jantes en alu"
              className="h-16 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={link.href}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive(link.href)
                      ? "text-auto-red bg-auto-red/8"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>
                {link.children && openDropdown === link.href && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-xl border border-gray-100 py-1 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        data-testid={`link-dropdown-${child.label.toLowerCase().replace(/\s/g, "-")}`}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+33600000000"
              data-testid="link-phone-cta"
              className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <Phone className="w-4 h-4 text-auto-red" />
              <span>06 00 00 00 00</span>
            </a>
            <Button
              asChild
              className="hidden lg:inline-flex bg-auto-red hover:bg-auto-red-dark text-white border-0 text-sm font-semibold"
              data-testid="button-nav-devis"
            >
              <Link href="/contact">Devis gratuit</Link>
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

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
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
                {link.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        data-testid={`link-mobile-sub-${child.label.toLowerCase().replace(/\s/g, "-")}`}
                        className="block px-3 py-2 text-xs text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a
                href="tel:+33600000000"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700"
                data-testid="link-mobile-phone"
              >
                <Phone className="w-4 h-4 text-auto-red" />
                06 00 00 00 00
              </a>
              <Button
                asChild
                className="bg-auto-red hover:bg-auto-red-dark text-white border-0"
                data-testid="button-mobile-devis"
              >
                <Link href="/contact">Devis gratuit</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
