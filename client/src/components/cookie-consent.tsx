import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { Link } from "wouter";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("myjantes_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("myjantes_cookie_consent", "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("myjantes_cookie_consent", "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] animate-in slide-in-from-bottom duration-500" data-testid="cookie-banner">
      <div className="bg-auto-dark/95 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-auto-red/20 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-5 h-5 text-auto-red" />
              </div>
              <div>
                <p className="text-white text-sm font-bold mb-1">Cookies & Données Personnelles</p>
                <p className="text-white/50 text-xs leading-relaxed">
                  MyJantes utilise des cookies essentiels pour le fonctionnement du site et des cookies analytiques pour améliorer votre expérience. Vos données personnelles sont traitées conformément au RGPD.{" "}
                  <Link href="/politique-confidentialite" className="text-auto-red hover:underline">Politique de confidentialité</Link>
                  {" "}·{" "}
                  <Link href="/mentions-legales" className="text-auto-red hover:underline">Mentions légales</Link>
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={refuse}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-xl transition-colors"
                data-testid="button-cookie-refuse"
              >
                Refuser
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-white bg-auto-red hover:bg-auto-red-dark rounded-xl transition-colors shadow-lg shadow-auto-red/20"
                data-testid="button-cookie-accept"
              >
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
