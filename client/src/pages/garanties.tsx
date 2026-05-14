import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { CheckCircle2, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Garanties() {
  const { data: content = {}, isLoading } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const fontFamily = content["typography.font"] || "Montserrat";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-8 h-8 text-auto-red animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <SEO
        title={`${content["pages.guarantees.title"] || "Garanties"} - MyJantes`}
        description={content["pages.guarantees.content"]?.slice(0, 160)}
        keywords="garantie rénovation jantes, garantie peinture jantes, qualité jantes alliage, MyJantes garantie"
        canonicalPath="/garanties"
        schema={{ "@context": "https://schema.org", "@type": "WebPage", "name": content["pages.guarantees.title"] || "Garanties MyJantes", "url": "https://myjantes.fr/garanties" }}
      />

      <div className="bg-auto-dark pt-36 pb-20 md:pt-28 md:pb-12 lg:pt-24 lg:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
            {content["pages.guarantees.title"] || "Qualité Exceptionnelle"}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">Votre satisfaction est notre priorité. Nous garantissons chaque jante qui sort de notre atelier.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="bg-gray-50 rounded-3xl p-10 mb-16 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-auto-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-auto-red/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>Garantie*</h2>
          </div>
          <div className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
            {content["pages.guarantees.content"] || "Toutes nos prestations de rénovation et de peinture bénéficient d'une garantie* sur la tenue de peinture et la finition."}
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {["Tenue de la peinture", "Éclat du vernis", "Adhérence des apprêts", "Conformité de la teinte"].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="text-auto-red w-5 h-5 shrink-0" />
                <span className="font-bold text-gray-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
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
            <h3 className="text-2xl font-black mb-4" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>Une question sur la garantie ?</h3>
            <p className="text-white/60 mb-8">Notre équipe est à votre disposition pour tout complément d'information.</p>
            <Button asChild size="lg" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-10">
              <Link href="/contact#formulaire">Nous contacter</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
