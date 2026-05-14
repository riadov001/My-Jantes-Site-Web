import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Clock, Instagram, Star } from "lucide-react";
import { SiSnapchat } from "react-icons/si";
import type { SiteService } from "@shared/schema";

export function Footer() {
  const { data: siteContent = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const { data: services = [] } = useQuery<SiteService[]>({ queryKey: ["/api/services"] });

  const c = (key: string, fallback = "") => siteContent[key] || fallback;

  const logoUrl = c("header.logo_url", "/images/logo-myjantes.png");
  const phone = c("contact.phone", "03 21 40 80 53");
  const phoneHref = c("contact.phone_href", "tel:+33321408053");
  const email = c("contact.email", "contact@myjantes.com");
  const address = c("contact.address", "46 rue de la Convention, 62800 Liévin");
  const tagline = c("footer.tagline", "L'expert de la jante alu");
  const hoursLine1 = c("footer.hours_line1", "Lun – Ven : 9h – 12h30");
  const hoursLine2 = c("footer.hours_line2", "13h30 – 18h00");
  const hoursShort = c("footer.hours_short", "Lun–Ven 9h–18h");

  const socialInstagram = c("footer.social_instagram", "https://www.instagram.com/myjantes/");
  const socialSnapchat = c("footer.social_snapchat", "https://t.snapchat.com/LtSpPwJ3");
  const socialFacebook = c("footer.social_facebook", "https://www.facebook.com/myjantes");
  const socialTiktok = c("footer.social_tiktok", "https://www.tiktok.com/@myjantes");
  const socialGoogle = c("footer.social_google", "https://share.google/WLKmvaJTSrAFGic2B");

  const serviceLinks = services.length > 0
    ? services.map(s => ({ label: s.title, href: "/services" }))
    : [
        { label: "Soudure", href: "/services" },
        { label: "Sablage", href: "/services" },
        { label: "Devoilage", href: "/services" },
        { label: "Usinage", href: "/services" },
        { label: "Tribofinition", href: "/services" },
        { label: "Rénovation", href: "/services" },
        { label: "Personnalisation", href: "/services" },
        { label: "Hydrodipping", href: "/services" },
      ];

  return (
    <footer className="bg-auto-dark text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <img
                src={logoUrl}
                alt="Logo MyJantes - L'expert de la jante alu"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/80 text-sm font-semibold tracking-wide mb-4">
              {tagline}
            </p>
            <div className="flex gap-3">
              {socialInstagram && (
                <a href={socialInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram MyJantes" data-testid="link-social-instagram" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socialSnapchat && (
                <a href={socialSnapchat} target="_blank" rel="noopener noreferrer" aria-label="Snapchat MyJantes" data-testid="link-social-snapchat" className="w-9 h-9 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/20 transition-colors">
                  <SiSnapchat className="w-4 h-4" />
                </a>
              )}
              {socialFacebook && (
                <a href={socialFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook MyJantes" data-testid="link-social-facebook" className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400/60 hover:text-blue-400 hover:bg-blue-600/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {socialTiktok && (
                <a href={socialTiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok MyJantes" data-testid="link-social-tiktok" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.05a8.27 8.27 0 004.76 1.5V7.12a4.83 4.83 0 01-1-.43z" />
                  </svg>
                </a>
              )}
              {socialGoogle && (
                <a href={socialGoogle} target="_blank" rel="noopener noreferrer" aria-label="Avis Google MyJantes" className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-500/30 transition-colors">
                  <Star className="w-4 h-4 fill-current" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Nos Services</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((item) => (
                <li key={item.label}>
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

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Espace Client Pro — Pros uniquement", href: c("global.espace_client_url", "https://pwapp.myjantes.fr"), external: true },
                { label: "Réalisations", href: "/galerie" },
                { label: "Nos Garanties", href: "/garanties" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact & Devis", href: "/contact#formulaire" },
              ].map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/55 hover:text-white text-sm transition-colors font-bold text-auto-red"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      data-testid={`link-footer-nav-${item.href.replace("/", "")}`}
                      className="text-white/55 hover:text-white text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <div>
                  <a href={phoneHref} data-testid="link-footer-phone" className="text-white/70 hover:text-white text-sm transition-colors">
                    {phone}
                  </a>
                  
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <a href={`mailto:${email}`} data-testid="link-footer-email" className="text-white/70 hover:text-white text-sm transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <span className="text-white/55 text-sm leading-tight">{address.replace(", ", ",\n").split(",").map((line, i) => <span key={i}>{i > 0 && <br/>}{line.trim()}</span>)}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/55 text-sm">{hoursLine1}</p>
                  <p className="text-white/55 text-sm">{hoursLine2}</p>
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
            {socialGoogle && (
              <a href={socialGoogle} target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-white/60 text-xs transition-colors flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Avis Google
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
