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
            {content["pages.services.badge"] || "Nos prestations"}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-services-page" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
            {content["sections.services.title"] || "Services professionnels"}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {content["sections.services.subtitle"] || "Des solutions adaptées à tous vos besoins pour des jantes toujours parfaites."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <RefreshCw className="w-8 h-8 text-auto-red animate-spin" />
          </div>
        ) : (
          <div className="space-y-20 lg:space-y-32">
            {siteServices.map((service, i) => (
              <div
                key={service.id}
                id={service.slug || service.id}
                className={`flex flex-col lg:flex-row gap-10 lg:gap-20 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                data-testid={`section-service-${service.id}`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-auto-red to-auto-red-dark rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="relative w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="space-y-4">
                    {service.price && (
                      <Badge className="bg-auto-red/10 text-auto-red border-auto-red/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                        {service.price}
                      </Badge>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tight" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                        {service.title}
                      </h2>
                      {service.badge && (
                        <span className="text-[10px] font-black bg-auto-red text-white px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-auto-red/20 animate-pulse">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
                    {service.description}
                  </p>
                  
                  {(service.features as string[]).length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      {(service.features as string[]).map((feat) => (
                        <div key={feat} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-auto-red shrink-0" />
                          <span className="text-gray-700 text-sm font-bold">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-10 h-14 shadow-xl shadow-auto-red/20 transition-all hover:scale-105 active:scale-95"
                      data-testid={`button-service-devis-${service.id}`}
                    >
                      <Link href="/contact">
                        Devis gratuit <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-gray-200 font-bold px-10 h-14 transition-all hover:bg-gray-50"
                    >
                      <a href={`tel:${content["contact.phone"] || "0321408053"}`}>
                        Appeler l'atelier
                      </a>
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
