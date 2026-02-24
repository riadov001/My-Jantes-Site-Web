import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";

const services = [
  {
    id: "renovation-jantes",
    title: "Rénovation complète de jantes",
    description: "La rénovation complète est notre prestation phare. Elle redonne une seconde vie à vos jantes abîmées, rayées ou oxydées.",
    image: "/images/service-renovation.png",
    features: [
      "Sablage ou décapage chimique complet",
      "Application d'un apprêt anti-corrosion",
      "Peinture en cabine professionnelle",
      "Vernis bi-composant haute résistance",
      "Contrôle qualité final",
    ],
    price: "À partir de 120€/jante",
    href: "/services/renovation-jantes",
  },
  {
    id: "peinture-jantes",
    title: "Peinture & Customisation",
    description: "Exprimez votre personnalité avec une peinture sur mesure. Noir mat, gris anthracite, bronze, bicolore... Toutes les finitions sont possibles.",
    image: "/images/service-peinture.png",
    features: [
      "Plus de 50 couleurs disponibles",
      "Finitions mat, satiné, brillant, métallisé",
      "Diamond cut (bi-ton usiné)",
      "Peinture assortie à la carrosserie",
      "Peinture à l'eau écologique",
    ],
    price: "À partir de 100€/jante",
    href: "/services/peinture-jantes",
  },
  {
    id: "redressage-jantes",
    title: "Redressage de jantes",
    description: "Une jante voilée ou déformée est un danger pour la sécurité. Notre presse hydraulique de précision corrige tous types de déformations.",
    image: "/images/service-redressage.png",
    features: [
      "Diagnostic gratuit avant intervention",
      "Presse hydraulique de précision CNC",
      "Contrôle du voile par laser",
      "Applicable sur jantes 14 à 22 pouces",
      "Résultat garanti ou remboursé",
    ],
    price: "À partir de 60€/jante",
    href: "/services/redressage-jantes",
  },
  {
    id: "debosselage",
    title: "Débosselage",
    description: "La technique PDR (Paintless Dent Repair) permet d'éliminer les bosses et impacts sans repeinture pour un résultat invisible.",
    image: "/images/gallery-2.png",
    features: [
      "Sans démontage du pneu dans la plupart des cas",
      "Technique PDR non destructive",
      "Préserve la peinture d'origine",
      "Résultat invisible",
      "Économique par rapport à un remplacement",
    ],
    price: "À partir de 45€/jante",
    href: "/services/debosselage",
  },
];

export default function Services() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Services de rénovation de jantes – MyJantes Liévin",
    "description": "Rénovation complète, peinture, redressage et débosselage de jantes en alliage à Liévin.",
    "url": "https://myjantes.fr/services",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Rénovation complète de jantes", "url": "https://myjantes.fr/services" },
      { "@type": "ListItem", "position": 2, "name": "Peinture et customisation", "url": "https://myjantes.fr/services" },
      { "@type": "ListItem", "position": 3, "name": "Redressage de jantes", "url": "https://myjantes.fr/services" },
      { "@type": "ListItem", "position": 4, "name": "Débosselage PDR", "url": "https://myjantes.fr/services" }
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Nos Services - Rénovation, Peinture, Redressage de Jantes | MyJantes"
        description="Découvrez tous nos services de rénovation jantes : peinture sur mesure, redressage, débosselage. Devis gratuit, garantie 12 mois."
        keywords="services rénovation jantes, peinture jantes, redressage jantes, débosselage jantes alliage"
        canonicalPath="/services"
        schema={schema}
      />

      {/* Hero */}
      <div className="relative bg-auto-dark pt-36 pb-20 md:pt-28 md:pb-12 lg:pt-24 lg:pb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/atelier.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-auto-dark/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Nos prestations
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-services-page">
            Services professionnels
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Des solutions adaptées à tous vos besoins pour des jantes toujours parfaites.
          </p>
        </div>
      </div>

      {/* Services list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-12 lg:space-y-16">
          {services.map((service, i) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              data-testid={`section-service-${service.id}`}
            >
              <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full rounded-lg shadow-xl"
                  loading="lazy"
                />
              </div>
              <div className={i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs uppercase tracking-wider">
                  {service.price}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{service.title}</h2>
                <p className="text-gray-500 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    asChild
                    className="bg-auto-red hover:bg-auto-red-dark text-white border-0"
                    data-testid={`button-service-devis-${service.id}`}
                  >
                    <Link href="/contact">
                      Devis gratuit <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Besoin d'un conseil personnalisé ?</h2>
          <p className="text-white/60 mb-8">Notre équipe répond à toutes vos questions et vous propose le meilleur devis.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 px-8" data-testid="button-services-cta-contact">
              <Link href="/contact">Nous contacter</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/5" data-testid="button-services-cta-whatsapp">
              <a href="https://wa.me/33321408053" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
