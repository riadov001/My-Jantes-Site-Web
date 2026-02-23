import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import {
  Star, ArrowRight, Phone, MessageCircle, Shield, Zap, Award, Users, ChevronRight, CheckCircle2,
} from "lucide-react";
import type { Testimonial, GalleryItem } from "@shared/schema";

const services = [
  {
    icon: "🔧",
    title: "Rénovation complète",
    description: "Sablage, apprêt, peinture et vernis. Vos jantes retrouvent leur éclat d'origine ou une finition entièrement personnalisée.",
    href: "/services/renovation-jantes",
    image: "/images/service-renovation.png",
  },
  {
    icon: "🎨",
    title: "Peinture & Customisation",
    description: "Noir mat, bronze, bicolore, diamond cut... Exprimez votre style avec nos finitions professionnelles haut de gamme.",
    href: "/services/peinture-jantes",
    image: "/images/service-peinture.png",
  },
  {
    icon: "⚙️",
    title: "Redressage de jantes",
    description: "Correction des voiles et déformations par presse hydraulique de précision. Votre sécurité est notre priorité.",
    href: "/services/redressage-jantes",
    image: "/images/service-redressage.png",
  },
  {
    icon: "🔩",
    title: "Débosselage",
    description: "Élimination des bosses et chocs sans démontage. Technique PDR pour un résultat invisible et économique.",
    href: "/services/debosselage",
    image: "/images/gallery-2.png",
  },
];

const stats = [
  { value: "5 000+", label: "Jantes rénovées" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "12 mois", label: "Garantie offerte" },
  { value: "48h", label: "Délai moyen" },
];

const whyUs = [
  { icon: Shield, title: "Garantie 12 mois", desc: "Toutes nos prestations sont garanties 12 mois contre les défauts de peinture et de main-d'œuvre." },
  { icon: Zap, title: "Délais rapides", desc: "Intervention sous 24 à 72h selon la prestation. Service express disponible sur demande." },
  { icon: Award, title: "Qualité professionnelle", desc: "Matériaux et peintures de grade professionnel. Résultats identiques à une jante neuve." },
  { icon: Users, title: "Expertise reconnue", desc: "Plus de 5 000 jantes traitées. Des artisans passionnés avec une expertise reconnue." },
];

export default function Home() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials"] });
  const { data: gallery = [] } = useQuery<GalleryItem[]>({ queryKey: ["/api/gallery"] });

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MyJantes - Rénovation et Peinture de Jantes en Alliage",
    "description": "Spécialiste rénovation, peinture et redressage de jantes. Devis gratuit, garantie 12 mois.",
    "url": "https://myjantes.fr",
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MyJantes - Rénovation & Peinture de Jantes | Spécialiste Jantes Alliage"
        description="Spécialiste rénovation, peinture et redressage de jantes en alliage. Devis gratuit en 24h, garantie 12 mois. Résultats professionnels, tarifs compétitifs."
        keywords="rénovation jantes, peinture jantes, redressage jantes, jantes alliage, réparation jantes"
        canonicalPath="/"
        schema={schema}
      />

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Accueil"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-auto-dark/90 via-auto-dark/75 to-auto-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-auto-dark via-transparent to-transparent" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-6 leading-[1.1] font-['Montserrat',sans-serif] tracking-tight"
            data-testid="heading-hero-main"
          >
            L'Expert des
            <span className="block text-auto-red mt-2 drop-shadow-[0_5px_15px_rgba(220,38,38,0.4)]">jantes en alu</span>
          </h1>
          <p
            className="text-xl sm:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
            data-testid="text-hero-description"
          >
            Rénovation, peinture et redressage de précision. 
            <span className="block mt-2 text-white/60 text-lg">Qualité professionnelle garantie 12 mois.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Button
              asChild
              size="lg"
              className="bg-auto-red hover:bg-auto-red-dark text-white border-0 px-8 text-base font-semibold shadow-2xl"
              data-testid="button-hero-devis"
            >
              <Link href="/contact">
                Demander un devis gratuit
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 text-base font-semibold"
              data-testid="button-hero-galerie"
            >
              <Link href="/galerie">Voir nos réalisations</Link>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50">
          <div className="w-0.5 h-12 bg-gradient-to-b from-transparent to-white/60 animate-pulse" />
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-white" aria-labelledby="heading-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs uppercase tracking-wider">
              Nos prestations
            </Badge>
            <h2
              id="heading-services"
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              data-testid="heading-services-main"
            >
              Des services experts pour vos jantes
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              De la rénovation complète à la personnalisation sur mesure, nous maîtrisons toutes les techniques pour sublimer vos jantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                data-testid={`card-service-${i}`}
              >
                <Card className="group overflow-hidden border border-gray-100 shadow-sm hover-elevate transition-all duration-300 h-full cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.description}</p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                      En savoir plus <ChevronRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-gray-200 text-gray-700" data-testid="button-all-services">
              <Link href="/services">
                Voir tous nos services <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-gray-950 text-white" aria-labelledby="heading-pourquoi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
                Pourquoi nous choisir
              </Badge>
              <h2
                id="heading-pourquoi"
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
                data-testid="heading-whyus"
              >
                La qualité professionnelle à votre service
              </h2>
              <p className="text-white/60 mb-10 leading-relaxed">
                Chez MyJantes, chaque jante est traitée avec le même soin et la même exigence. Nous utilisons uniquement des matériaux professionnels pour des résultats durables.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyUs.map((item) => (
                  <div key={item.title} className="flex gap-4" data-testid={`feature-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                    <div className="w-10 h-10 rounded-lg bg-auto-red/15 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-auto-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                      <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-10 flex-wrap">
                <Button
                  asChild
                  className="bg-auto-red hover:bg-auto-red-dark text-white border-0"
                  data-testid="button-whyus-contact"
                >
                  <Link href="/contact">Obtenir un devis</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white bg-transparent hover:bg-white/5"
                  data-testid="button-whyus-about"
                >
                  <Link href="/a-propos">Notre histoire</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/atelier.png"
                alt="Atelier professionnel MyJantes"
                className="w-full rounded-lg shadow-2xl"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -left-5 bg-auto-red text-white p-6 rounded-lg shadow-xl">
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-white/80 font-medium uppercase tracking-wider">mois de garantie</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="py-24 bg-white" aria-labelledby="heading-gallery-preview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs uppercase tracking-wider">
                Nos réalisations
              </Badge>
              <h2
                id="heading-gallery-preview"
                className="text-3xl sm:text-4xl font-bold text-gray-900"
                data-testid="heading-gallery-preview"
              >
                Avant / Après : des transformations spectaculaires
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-lg group"
                  data-testid={`gallery-preview-${item.id}`}
                >
                  <img
                    src={item.afterImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                    <p className="p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" className="border-gray-200" data-testid="button-see-all-gallery">
                <Link href="/galerie">
                  Voir toutes nos réalisations <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-gray-50" aria-labelledby="heading-testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs uppercase tracking-wider">
                Avis clients
              </Badge>
              <h2
                id="heading-testimonials"
                className="text-3xl sm:text-4xl font-bold text-gray-900"
                data-testid="heading-testimonials"
              >
                Ce que disent nos clients
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <Card
                  key={t.id}
                  className="border border-gray-100 shadow-sm p-6"
                  data-testid={`card-testimonial-${t.id}`}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{t.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs">{t.vehicle} — {t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="py-24 bg-auto-red relative overflow-hidden" aria-labelledby="heading-cta">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2
            id="heading-cta"
            className="text-3xl sm:text-4xl font-bold text-white mb-5"
            data-testid="heading-cta"
          >
            Prêt à redonner vie à vos jantes ?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Obtenez un devis gratuit et personnalisé en moins de 24h. Envoyez-nous simplement des photos de vos jantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Button
              asChild
              size="lg"
              className="bg-white text-auto-red hover:bg-white/90 border-0 font-semibold px-8"
              data-testid="button-cta-devis"
            >
              <Link href="/contact">
                Devis gratuit en 24h
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 px-8"
              data-testid="button-cta-whatsapp"
            >
              <a href="https://wa.me/33600000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp direct
              </a>
            </Button>
          </div>
          <div className="mt-8 flex justify-center gap-6 flex-wrap">
            {["Devis gratuit", "Réponse sous 24h", "Garantie 12 mois"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
                <CheckCircle2 className="w-4 h-4 text-white/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
