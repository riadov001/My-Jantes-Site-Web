import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-auto-dark text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/images/logo-myjantes.png"
                alt="MyJantes"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-5">
              Spécialiste de la rénovation, peinture et redressage de jantes en alliage. Qualité professionnelle garantie.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook MyJantes"
                data-testid="link-social-facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram MyJantes"
                data-testid="link-social-instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/33600000000"
                aria-label="WhatsApp MyJantes"
                data-testid="link-social-whatsapp"
                className="w-9 h-9 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 hover:text-green-300 hover:bg-green-600/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Nos Services</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Rénovation de jantes", href: "/services/renovation-jantes" },
                { label: "Peinture de jantes", href: "/services/peinture-jantes" },
                { label: "Redressage de jantes", href: "/services/redressage-jantes" },
                { label: "Débosselage", href: "/services/debosselage" },
                { label: "Tous les services", href: "/services" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-testid={`link-footer-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-white/55 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Galerie réalisations", href: "/galerie" },
                { label: "Actualités & Conseils", href: "/blog" },
                { label: "FAQ", href: "/faq" },
                { label: "À propos", href: "/a-propos" },
                { label: "Contact & Devis", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-testid={`link-footer-nav-${item.href.replace("/", "")}`}
                    className="text-white/55 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+33600000000" data-testid="link-footer-phone" className="text-white/70 hover:text-white text-sm transition-colors">
                    06 00 00 00 00
                  </a>
                  <span className="block text-white/35 text-xs">Appel & WhatsApp</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <a href="mailto:contact@myjantes.fr" data-testid="link-footer-email" className="text-white/70 hover:text-white text-sm transition-colors">
                  contact@myjantes.fr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <span className="text-white/55 text-sm">France — Intervention nationale</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/55 text-sm">Lun – Ven : 8h – 18h</p>
                  <p className="text-white/55 text-sm">Sam : 9h – 13h</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} MyJantes.fr — Tous droits réservés
          </p>
          <div className="flex items-center gap-5">
            <Link href="/mentions-legales" className="text-white/35 hover:text-white/60 text-xs transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-white/35 hover:text-white/60 text-xs transition-colors">
              Confidentialité
            </Link>
            <a href="/sitemap.xml" className="text-white/35 hover:text-white/60 text-xs transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
