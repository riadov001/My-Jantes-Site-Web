import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, Award, Clock } from "lucide-react";

export default function APropos() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="À Propos de MyJantes – Expert Rénovation Jantes à Liévin | MyJantes"
        description="Découvrez l'histoire, les valeurs et l'expertise de MyJantes à Liévin. Spécialiste rénovation et peinture de jantes en alliage, garantie 12 mois, équipements de pointe."
        keywords="MyJantes histoire, expert jantes Liévin, atelier jantes Hauts-de-France, rénovation jantes professionnelle"
        canonicalPath="/a-propos"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "À Propos de MyJantes",
          "description": "L'Expert des jantes en alu à Liévin. Notre histoire, notre équipe et nos valeurs.",
          "url": "https://myjantes.fr/a-propos",
          "mainEntity": {
            "@type": "AutoRepair",
            "name": "MyJantes",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "46 rue de la Convention",
              "addressLocality": "Liévin",
              "postalCode": "62800",
              "addressCountry": "FR"
            }
          }
        }}
      />
      
      <div className="bg-auto-dark pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Notre Histoire
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 font-['Montserrat',sans-serif]">L'Expert des jantes en alu</h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Depuis notre atelier de Liévin, nous redonnons vie à vos jantes avec une passion et une précision artisanale.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 font-['Montserrat',sans-serif]">Une expertise reconnue</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              MyJantes est né d'une volonté simple : offrir un service de rénovation de jantes de qualité industrielle aux particuliers et professionnels de la région.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Initialement basés à Lille, nous nous sommes installés à Liévin pour bénéficier d'un espace technique plus vaste, nous permettant d'investir dans des équipements de pointe comme notre tour numérique pour les finitions Diamond Cut.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-auto-red w-5 h-5" />
                <span className="font-bold text-gray-900">Savoir-faire artisanal</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-auto-red w-5 h-5" />
                <span className="font-bold text-gray-900">Technologie OEM</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="/images/atelier.png" alt="Atelier MyJantes" className="rounded-2xl shadow-2xl relative z-10" />
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-auto-red/20 rounded-2xl z-0" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Qualité Totale", desc: "Nous ne faisons aucun compromis sur les matériaux et les processus de peinture." },
            { icon: Award, title: "Garantie 12 Mois", desc: "Toutes nos prestations sont couvertes par une garantie totale sur la tenue de la finition." },
            { icon: Clock, title: "Délais Respectés", desc: "Nous savons que votre temps est précieux. Nous respectons nos délais d'intervention." }
          ].map((item, i) => (
            <Card key={i} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="w-12 h-12 bg-auto-red/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-6 h-6 text-auto-red" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
