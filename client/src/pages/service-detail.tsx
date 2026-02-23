import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CheckCircle2, ArrowLeft, MessageCircle, ArrowRight } from "lucide-react";

const servicesData: Record<string, any> = {
  "renovation-jantes": {
    title: "Rénovation complète de jantes",
    description: "La rénovation complète est notre spécialité à Liévin. Nous traitons chaque jante avec une rigueur industrielle pour un résultat showroom.",
    longDescription: "Notre processus de rénovation complète ne se contente pas de masquer les défauts. Nous remettons la jante à nu pour traiter l'aluminium en profondeur, éliminer l'oxydation et appliquer un système de peinture multicouche ultra-résistant.",
    image: "/images/service-renovation.png",
    benefits: [
      "Aspect strictement neuf en sortie d'atelier",
      "Protection longue durée contre le sel et les débris",
      "Valorisation immédiate de votre véhicule",
      "Garantie totale sur la tenue de la peinture"
    ],
    steps: [
      { name: "Décapage", desc: "Mise à nu totale de l'aluminium par bain chimique ou sablage fin." },
      { name: "Réparation", desc: "Suppression des rayures, impacts et rechargement de matière si nécessaire." },
      { name: "Apprêtage", desc: "Application d'une base époxy cuite au four pour une adhérence maximale." },
      { name: "Peinture & Vernis", desc: "Finition haute précision et vernis de protection haute résistance." }
    ]
  },
  "peinture-jantes": {
    title: "Peinture & Customisation",
    description: "Personnalisez votre véhicule avec nos finitions haut de gamme : Noir mat, Satiné, Gloss ou couleurs sur mesure.",
    longDescription: "Que vous souhaitiez un look agressif en noir satiné ou une élégance classique, notre laboratoire de colorimétrie réalise toutes vos envies. Nous utilisons des peintures de grade automobile (OEM) pour une durabilité identique à l'origine.",
    image: "/images/service-peinture.png",
    benefits: [
      "Large choix de teintes et de finitions",
      "Possibilité de bi-ton (Diamond Cut)",
      "Peinture résistante aux hautes températures des freins",
      "Finition personnalisée unique"
    ],
    steps: [
      { name: "Préparation", desc: "Ponçage méticuleux et dégraissage de la surface." },
      { name: "Masquage", desc: "Protection des zones ne devant pas être peintes." },
      { name: "Application", desc: "Peinture en cabine pressurisée pour éviter toute poussière." },
      { name: "Cuisson", desc: "Séchage contrôlé en étuve pour une dureté optimale." }
    ]
  },
  "redressage-jantes": {
    title: "Redressage de précision",
    description: "Correction des voiles et plats par presse hydraulique. Ne changez pas vos jantes, réparez-les !",
    longDescription: "Un choc contre un trottoir ou un nid-de-poule peut voiler votre jante, provoquant des vibrations et une usure prématurée des pneus. Notre équipement de redressage à froid préserve les propriétés mécaniques de l'alliage.",
    image: "/images/service-redressage.png",
    benefits: [
      "Économie importante par rapport à l'achat de jantes neuves",
      "Suppression des vibrations dans le volant",
      "Sécurité de conduite retrouvée",
      "Intervention rapide"
    ],
    steps: [
      { name: "Contrôle Laser", desc: "Mesure précise du voile et du saut sur banc d'équilibrage." },
      { name: "Redressage", desc: "Action ciblée par vérins hydrauliques de précision." },
      { name: "Vérification", desc: "Contrôle final pour valider la parfaite circularité." }
    ]
  },
  "debosselage": {
    title: "Débosselage PDR",
    description: "Élimination des chocs localisés sans repeinture. Rapide, efficace et économique.",
    longDescription: "Le débosselage sans peinture (PDR) est idéal pour les impacts légers sur les bords de jantes qui n'ont pas entamé la peinture. C'est la solution la plus écologique et la plus rapide pour retrouver une jante parfaite.",
    image: "/images/gallery-2.png",
    benefits: [
      "Conservation de la peinture d'origine",
      "Temps d'immobilisation réduit",
      "Prix très compétitif",
      "Résultat invisible à l'œil nu"
    ],
    steps: [
      { name: "Analyse", desc: "Évaluation de la profondeur et de l'accès à la bosse." },
      { name: "Massage", desc: "Repousse délicate du métal par l'arrière ou par traction." },
      { name: "Finition", desc: "Polissage de la zone pour un éclat parfait." }
    ]
  }
};

export default function ServiceDetail() {
  const { id } = useParams();
  const service = servicesData[id as string];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
          <Button asChild variant="outline">
            <Link href="/services">Voir tous les services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO title={`${service.title} - MyJantes`} description={service.description} />
      
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-auto-dark/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <Button asChild variant="link" className="text-white/60 hover:text-white mb-8">
            <Link href="/services" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour aux services
            </Link>
          </Button>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 font-['Montserrat',sans-serif]">{service.title}</h1>
          <p className="text-xl text-white/80 leading-relaxed">{service.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-8 font-['Montserrat',sans-serif]">Notre expertise</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">{service.longDescription}</p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {service.benefits.map((benefit: string) => (
                <div key={benefit} className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-auto-red shrink-0" />
                  <span className="text-gray-900 font-medium text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-gray-900 mb-8 font-['Montserrat',sans-serif]">Le processus MyJantes</h3>
            <div className="space-y-6">
              {service.steps.map((step: any, index: number) => (
                <div key={step.name} className="flex gap-6 relative">
                  {index !== service.steps.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-100" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-auto-red text-white flex items-center justify-center font-black shrink-0 relative z-10 shadow-lg shadow-auto-red/20">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{step.name}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="mt-24 bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-4 font-['Montserrat',sans-serif]">Prêt pour un devis ?</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">
            Envoyez-nous les photos de vos jantes et recevez une estimation précise en moins de 24 heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-auto-red hover:bg-auto-red-dark text-white px-10 h-14 font-black">
              <Link href="/contact">Devis gratuit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 border-gray-200 font-bold">
              <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                Espace client <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
