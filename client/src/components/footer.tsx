import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Instagram, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-auto-dark text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <img
                src="/images/logo-myjantes.png"
                alt="Logo MyJantes - L'Expert des jantes en alu"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/80 text-sm font-semibold tracking-wide mb-4 font-['Montserrat',sans-serif]">
              L'Expert des jantes en alu
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/myjantes/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram MyJantes"
                data-testid="link-social-instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.snapchat.com/LtSpPwJ3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Snapchat MyJantes"
                className="w-9 h-9 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12.001 2c-.615 0-.964.127-1.397.359-.444.24-.763.535-1.127.917-.361.378-.659.789-.96 1.258-.291.455-.544.912-.767 1.343l-.116.223c-.092.174-.183.333-.271.474-.28.455-.47.662-.731.815-.26.151-.557.215-.992.215-.23 0-.411-.017-.549-.052-.158-.041-.318-.112-.519-.244-.2-.132-.424-.316-.69-.582-.258-.258-.553-.553-1.053-.553-.418 0-.756.27-.932.658-.124.275-.074.609.123.861l.056.071c.159.201.31.393.44.577.12.169.213.31.282.441.111.209.184.457.184.776 0 .548-.488.751-1.089.751-.237 0-.533-.03-.89-.09l-.499-.085c-.258-.044-.542-.093-.846-.093-.655 0-1.257.433-1.257 1.203 0 .153.023.294.067.424l.011.033c.045.131.109.288.19.462.155.334.37.733.642 1.187.276.46.611.966.993 1.487.362.492.747.962 1.144 1.385.195.207.391.4.585.579l.135.123c.319.288.583.528.841.802.16.169.314.349.467.536l.092.112c.162.2.327.423.5.659.384.524.814 1.196 1.411 1.761.597.564 1.332.934 2.37.934.364 0 .8-.063 1.25-.191.453-.129.932-.34 1.402-.553.472-.214.93-.422 1.342-.569.414-.148.749-.214 1.052-.214.303 0 .638.066 1.052.214.412.147.87.355 1.342.569.47.213.949.424 1.402.553.45.128.886.191 1.25.191 1.038 0 1.773-.37 2.37-.934.597-.565 1.027-1.237 1.411-1.761.173-.236.338-.459.5-.659l.092-.112c.153-.187.307-.367.467-.536.258-.274.522-.514.841-.802l.135-.123c.194-.179.39-.372.585-.579.397-.423.782-.893 1.144-1.385.382-.521.717-1.027.993-1.487.272-.454.487-.853.642-1.187.081-.174.145-.331.19-.462l.011-.033c.044-.13.067-.271.067-.424 0-.77-.602-1.203-1.257-1.203-.304 0-.588.049-.846.093l-.499.085c-.357.06-.653.09-.89.09-.601 0-1.089-.203-1.089-.751 0-.319.073-.567.184-.776.069-.131.162-.272.282-.441.13-.184.281-.376.44-.577l.056-.071c.197-.252.247-.586.123-.861-.176-.388-.514-.658-.932-.658-.5 0-.795.295-1.053.553-.266.266-.49.45-.69.582-.201.132-.361.203-.519.244-.138.035-.319.052-.549.052-.435 0-.732-.064-.992-.215-.261-.153-.451-.36-.731-.815-.088-.141-.179-.3-.271-.474l-.116-.223c-.223-.431-.476-.888-.767-1.343-.301-.469-.599-.88-.96-1.258-.364-.382-.683-.677-1.127-.917-.433-.232-.782-.359-1.397-.359z" />
                </svg>
              </a>
              <a
                href="https://share.google/WLKmvaJTSrAFGic2B"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Avis Google MyJantes"
                className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                <Star className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Nos Services</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Rénovation de jantes", href: "/services" },
                { label: "Peinture de jantes", href: "/services" },
                { label: "Redressage de jantes", href: "/services" },
                { label: "Débosselage", href: "/services" },
                { label: "Garantie Totale", href: "/garanties" },
              ].map((item) => (
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

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Espace Client", href: "https://appmyjantes.mytoolsgroup.eu", external: true },
                { label: "Réalisations", href: "/galerie" },
                { label: "Nos Garanties", href: "/garanties" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact & Devis", href: "/contact" },
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

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+33321408053" data-testid="link-footer-phone" className="text-white/70 hover:text-white text-sm transition-colors">
                    03 21 40 80 53
                  </a>
                  <span className="block text-white/35 text-xs">Lun–Ven 9h–18h</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <a href="mailto:contact@myjantes.com" data-testid="link-footer-email" className="text-white/70 hover:text-white text-sm transition-colors">
                  contact@myjantes.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <span className="text-white/55 text-sm leading-tight">46 rue de la Convention,<br/>62800 Liévin</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-auto-red mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/55 text-sm">Lun – Ven : 9h – 12h</p>
                  <p className="text-white/55 text-sm">13h30 – 18h00</p>
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
            <a href="https://share.google/WLKmvaJTSrAFGic2B" target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-white/60 text-xs transition-colors flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Avis Google
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
