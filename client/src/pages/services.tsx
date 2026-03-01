import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import { CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import type { SiteService } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function Services() {
  const { data: siteServices = [], isLoading } = useQuery<SiteService[]>({ queryKey: ["/api/services"] });
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

  const fontFamily = content["typography.font"] || "Montserrat";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Services de rénovation de jantes – MyJantes Liévin",
    "description": "Rénovation complète, peinture, soudure, sablage, devoilage et hydrodipping de jantes en alliage à Liévin.",
    "url": "https://myjantes.fr/services",
    "itemListElement": siteServices.map((s, i) => ({
      "@type": "ListItem", "position": i + 1, "name": s.title, "url": "https://myjantes.fr/services"
    })),
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <SEO
        title="Nos Services - Rénovation, Peinture, Soudure, Sablage | MyJantes"
        description="Découvrez tous nos services : rénovation, peinture, soudure, sablage, devoilage, hydrodipping. Devis gratuit, garantie*."
        keywords="services rénovation jantes, peinture jantes, soudure jantes, sablage jantes, devoilage, hydrodipping jantes alliage"
        canonicalPath="/services"
        schema={schema}
      />

      <div className="relative bg-auto-dark pt-36 pb-20 md:pt-28 md:pb-12 lg:pt-24 lg:pb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/atelier.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-auto-dark/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Nos prestations
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-services-page" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
            {content["sections.services.title"] || "Services professionnels"}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {content["sections.services.subtitle"] || "Des solutions adaptées à tous vos besoins pour des jantes toujours parfaites."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="w-8 h-8 text-auto-red animate-spin" />
          </div>
        ) : (
          <div className="space-y-12 lg:space-y-16">
            {siteServices.map((service, i) => (
              <div
                key={service.id}
                id={service.slug || service.id}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
                data-testid={`section-service-${service.id}`}
              >
                <div className={i % 2 === 1 ? "lg:col-start-2" : ""}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full rounded-2xl shadow-xl"
                    loading="lazy"
                  />
                </div>
                <div className={i % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  {service.price && (
                    <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-wider">
                      {service.price}
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>{service.title}</h2>
                    {service.badge && (
                      <span className="text-[10px] font-black bg-auto-red text-white px-2 py-0.5 rounded-full">{service.badge}</span>
                    )}
                  </div>
                  <p className="text-gray-500 mb-6 leading-relaxed">{service.description}</p>
                  {(service.features as string[]).length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {(service.features as string[]).map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-auto-red shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
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
        )}
      </div>

      <div className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>Besoin d'un conseil personnalisé ?</h2>
          <p className="text-white/60 mb-8">Notre équipe répond à toutes vos questions et vous propose le meilleur devis.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 px-8" data-testid="button-services-cta-contact">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
