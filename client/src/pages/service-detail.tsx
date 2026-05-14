import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import type { SiteService } from "@shared/schema";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: services = [], isLoading } = useQuery<SiteService[]>({
    queryKey: ["/api/services"],
  });
  const { data: siteContent = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const c = (key: string, fallback = "") => siteContent[key] || fallback;

  const service = services.find((s) => s.slug === id || s.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="relative h-[60vh] bg-gray-100 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

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

  const features = (service.features as string[]) || [];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${service.title} - MyJantes`}
        description={service.description}
        canonicalPath={`/services/${service.slug || service.id}`}
      />

      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-auto-dark/60 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <Button asChild variant="ghost" className="text-white/60 hover:text-white mb-8">
            <Link href="/services" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour aux services
            </Link>
          </Button>
          {service.badge && (
            <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-widest">
              {service.badge}
            </Badge>
          )}
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 uppercase tracking-tight">{service.title}</h1>
          <p className="text-xl text-white/80 leading-relaxed">{service.description}</p>
          {service.price && (
            <p className="mt-4 text-auto-red-light font-black text-lg">{service.price}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-8">Notre expertise</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">{service.description}</p>

            {features.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div key={feature} className="flex gap-3">
                    <CheckCircle2 className="w-6 h-6 text-auto-red shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-black text-gray-900">Pourquoi choisir MyJantes ?</h3>
            <div className="space-y-6">
              {[
                { title: "Diagnostic gratuit", desc: "Évaluation précise de l'état de vos jantes avant toute intervention." },
                { title: "Peinture certifiée OEM", desc: "Nous utilisons des produits conformes aux normes constructeurs pour un résultat durable." },
                { title: "Contrôle qualité final", desc: "Chaque jante est inspectée avant restitution pour garantir votre satisfaction." },
                { title: "Délais maîtrisés", desc: "Restitution rapide, généralement sous 48 à 72h selon la prestation." },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-6 relative">
                  {index !== 3 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-100" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-auto-red text-white flex items-center justify-center font-black shrink-0 relative z-10 shadow-lg shadow-auto-red/20">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Prêt pour un devis ?</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">
            Envoyez-nous les photos de vos jantes et recevez une estimation précise en moins de 24 heures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-auto-red hover:bg-auto-red-dark text-white px-10 h-14 font-black border-0">
              <Link href="/contact#formulaire">Devis gratuit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 border-gray-200 font-bold">
              <a href={c("global.espace_client_url", "https://pwapp.myjantes.fr")} target="_blank" rel="noopener noreferrer">
                Espace client <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
