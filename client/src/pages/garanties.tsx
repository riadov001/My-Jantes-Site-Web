import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Garanties() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Garantie 12 Mois Rénovation Jantes – Qualité Certifiée | MyJantes"
        description="Toutes nos prestations de rénovation et peinture de jantes sont garanties 12 mois. Découvrez nos engagements qualité, les conditions et exclusions de garantie."
        keywords="garantie rénovation jantes, garantie peinture jantes 12 mois, qualité jantes alliage, MyJantes garantie"
        canonicalPath="/garanties"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Garanties MyJantes – 12 mois sur toutes les prestations",
          "description": "Garantie totale de 12 mois sur toutes nos rénovations de jantes en alliage.",
          "url": "https://myjantes.fr/garanties"
        }}
      />
      
      <div className="bg-auto-dark pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Sérénité Totale
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 font-['Montserrat',sans-serif]">Qualité Exceptionnelle</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Votre satisfaction est notre priorité. Nous garantissons chaque jante qui sort de notre atelier.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gray-50 rounded-3xl p-10 mb-16 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-auto-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-auto-red/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-['Montserrat',sans-serif]">Garantie de 12 Mois</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Toutes nos prestations de rénovation et de peinture bénéficient d'une **garantie totale de 12 mois** à compter de la date de facturation. Cette garantie couvre tout défaut de peinture (décollement, cloquage) lié à une malfaçon de préparation ou d'application.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Tenue de la peinture",
              "Éclat du vernis",
              "Adhérence des apprêts",
              "Conformité de la teinte"
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="text-auto-red w-5 h-5 shrink-0" />
                <span className="font-bold text-gray-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="text-2xl font-black text-gray-900 mb-6 font-['Montserrat',sans-serif] flex items-center gap-3">
              <AlertTriangle className="text-amber-500 w-6 h-6" />
              Exclusions de garantie
            </h3>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>La garantie ne pourra être invoquée dans les cas suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chocs contre des trottoirs ou autres objets.</li>
                <li>Utilisation de produits de nettoyage acides ou abrasifs non recommandés.</li>
                <li>Nettoyage haute pression à bout portant (moins de 30cm).</li>
                <li>Dommages causés par un montage/démontage de pneu ultérieur chez un tiers.</li>
                <li>Oxydation due à une griffure non réparée ayant laissé l'aluminium à nu.</li>
              </ul>
            </div>
          </section>

          <section className="bg-auto-dark text-white rounded-3xl p-10 text-center">
            <h3 className="text-2xl font-black mb-4 font-['Montserrat',sans-serif]">Une question sur la garantie ?</h3>
            <p className="text-white/60 mb-8">Notre équipe est à votre disposition pour tout complément d'information.</p>
            <Button asChild size="lg" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-10">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
