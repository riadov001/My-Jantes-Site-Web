import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import {
  Star, ArrowRight, Phone, MessageCircle, Shield, Zap, Award, Users,
  CheckCircle2, Smartphone, Monitor, Globe, LayoutDashboard, Clock,
  Camera, FileText, Wrench, PartyPopper, MapPin, ChevronRight
} from "lucide-react";
import type { Testimonial, GalleryItem, SiteService } from "@shared/schema";
import { useEffect } from "react";

const DEFAULT_STATS = [
  { value: "5 000+", label: "Jantes rénovées" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "garantie*", label: "Sur nos prestations" },
  { value: "48h", label: "Délai moyen" },
];

const DEFAULT_TRUST = [
  "Peinture certifiée OEM",
  "Diamantage sur tour numérique",
  "Garantie*",
  "Devis gratuit sous 24h",
  "Liévin — Hauts-de-France",
];

const process = [
  { icon: Camera, step: "01", title: "Envoyez vos photos", desc: "Par WhatsApp, e-mail ou via notre formulaire, montrez-nous vos jantes.", whatsapp: true },
  { icon: FileText, step: "02", title: "Devis sous 24h", desc: "Réponse rapide avec estimation personnalisée gratuite." },
  { icon: Wrench, step: "03", title: "Dépôt à l'atelier", desc: "46 rue de la Convention, 62800 Liévin." },
  { icon: PartyPopper, step: "04", title: "Restitution de vos jantes", desc: "Restitution de vos jantes avec leur garantie*." },
];

const whyUs = [
  { icon: Shield, title: "Garantie*", desc: "Garantie sur la tenue de peinture et la finition de nos prestations." },
  { icon: Zap, title: "Délais rapides", desc: "Intervention sous 24 à 72h. Service express disponible." },
  { icon: Award, title: "Usinage Numérique", desc: "Tour numérique pour finitions diamantage parfaites." },
  { icon: Users, title: "5 000+ jantes traitées", desc: "Expérience et savoir-faire reconnus à Liévin." },
];

export default function Home() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials"] });
  const { data: gallery = [] } = useQuery<GalleryItem[]>({ queryKey: ["/api/gallery"] });
  const { data: siteServices = [] } = useQuery<SiteService[]>({ queryKey: ["/api/services"] });
  const { data: siteContent = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

  const c = (key: string, fallback = "") => siteContent[key] || fallback;

  const stats: { value: string; label: string }[] = (() => {
    try { return JSON.parse(c("stats")) || DEFAULT_STATS; } catch { return DEFAULT_STATS; }
  })();

  const trustItems: string[] = (() => {
    try { return JSON.parse(c("trust_items")) || DEFAULT_TRUST; } catch { return DEFAULT_TRUST; }
  })();

  const fontFamily = c("typography.font", "Montserrat");

  useEffect(() => {
    if (fontFamily && fontFamily !== "Montserrat") {
      document.documentElement.style.setProperty("--font-sans", `'${fontFamily}', sans-serif`);
    } else {
      document.documentElement.style.removeProperty("--font-sans");
    }
  }, [fontFamily]);

  const displayServices = siteServices.length > 0 ? siteServices : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MyJantes – L'expert de la jante alu à Liévin",
    "description": "Rénovation, peinture et soudure de jantes en alliage à Liévin. Garantie*, devis gratuit sous 24h.",
    "url": "https://myjantes.fr",
    "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2"] },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://myjantes.fr" }]
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <SEO
        title="MyJantes – L'expert de la jante alu à Liévin | Rénovation & Peinture"
        description="Rénovation, peinture, soudure et sablage de jantes en alliage à Liévin (62). Garantie*, devis gratuit sous 24h. MyJantes, l'expert de la jante alu dans les Hauts-de-France."
        keywords="rénovation jantes Liévin, peinture jantes alliage, soudure jantes 62, sablage jantes, rénovation jantes Hauts-de-France, MyJantes, expert jante alu"
        canonicalPath="/"
        ogImage="https://myjantes.fr/images/service-renovation.png"
        schema={schema}
      />

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen md:min-h-0 flex items-center justify-center overflow-hidden" aria-label="Accueil">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/attached_assets/generated_videos/wheel_painting_illustration.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-auto-dark" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pt-28 md:pb-12 lg:pt-24 lg:pb-12">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 bg-auto-red/20 border border-auto-red/40 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-auto-red animate-pulse" />
              {c("hero.badge", "Atelier à Liévin — 62800")}
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <img
              src="/images/logo-myjantes.png"
              alt="Logo MyJantes"
              className="h-32 sm:h-44 lg:h-56 w-auto object-contain brightness-0 invert drop-shadow-2xl"
            />
          </div>

          <h1
            className="text-center text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4"
            style={{ fontFamily: `'${fontFamily}', sans-serif` }}
            data-testid="heading-hero-main"
          >
            {c("hero.title_line1", "L'expert de la")}
            <span className="block text-auto-red drop-shadow-[0_4px_20px_rgba(220,38,38,0.5)]">
              {c("hero.title_line2", "jante alu")}
            </span>
          </h1>

          <p className="text-center text-base sm:text-lg text-white/75 mb-6 max-w-xl mx-auto leading-relaxed" data-testid="text-hero-description">
            {c("hero.subtitle", "Soudure · Sablage · Devoilage · Rénovation · Personnalisation · Hydrodipping")}
            <br />
            <span className="text-white/50 text-sm">Qualité exceptionnelle — garantie*</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Button asChild size="lg" className="w-full sm:w-auto bg-auto-red hover:bg-auto-red-dark text-white border-0 px-8 h-12 text-sm font-black shadow-2xl shadow-auto-red/30" data-testid="button-hero-devis">
              <Link href="/contact">
                {c("hero.cta_primary", "Devis gratuit")} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/25 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 h-12 font-semibold text-sm" data-testid="button-hero-galerie">
              <Link href="/galerie">{c("hero.cta_gallery", "Voir les réalisations")}</Link>
            </Button>
            <a
              href={c("contact.phone_href", "tel:+33321408053")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-colors font-semibold text-sm"
              data-testid="link-hero-phone"
            >
              <Phone className="w-4 h-4 text-auto-red" />
              {c("contact.phone", "03 21 40 80 53")}
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 px-4 py-4 text-center">
                <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-white/50 text-xs mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANDE DE CONFIANCE ───────────────────────────────────── */}
      <div className="bg-auto-dark border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/50 text-xs uppercase tracking-widest font-semibold">
            {trustItems.map(item => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-auto-red shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── COMMENT ÇA MARCHE ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-widest">Simple & rapide</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
              {c("sections.process.title", "Comment ça marche ?")}
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              {c("sections.process.subtitle", "De vos photos à des jantes comme neuves — en 4 étapes simples.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {process.map((step, i) => (
              <div key={step.step} className="relative">
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-1rem)] w-8 text-gray-200 z-10">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
                <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl font-black text-gray-100" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>{step.step}</span>
                    <div className="w-10 h-10 bg-auto-red/10 rounded-xl flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-auto-red" />
                    </div>
                  </div>
                  <h3 className="font-black text-gray-900 text-base mb-2" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">{step.desc}</p>
                  {step.whatsapp && (
                    <a
                      href={c("contact.whatsapp_href", "https://wa.me/33671370418?text=Bonjour,%20je%20souhaite%20un%20devis%20pour%20mes%20jantes.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-step1-whatsapp"
                      className="inline-flex items-center gap-2 mt-3 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp : {c("contact.whatsapp_number", "06 71 37 04 18")}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-8 h-12">
              <Link href="/contact">Commencer mon devis gratuit <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────────── */}
      {displayServices.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-widest">Nos prestations</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                {c("sections.services.title", "Expertise complète")}
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                {c("sections.services.subtitle", "Chaque intervention est réalisée avec une rigueur absolue à Liévin.")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {displayServices.map((service) => (
                <Link key={service.id} href="/services">
                  <Card className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={service.image}
                        alt={`Service MyJantes : ${service.title}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {service.badge && (
                        <span className="absolute top-3 right-3 bg-auto-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-black text-gray-900 text-base mb-2 group-hover:text-auto-red transition-colors line-clamp-1" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                        {service.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                      {service.price && (
                        <p className="text-xs font-bold text-auto-red mb-2">{service.price}</p>
                      )}
                      <span className="inline-flex items-center gap-2 text-auto-red text-[10px] font-black uppercase tracking-widest">
                        Découvrir <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ATELIER VIDEO + AVANTAGES ────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover" title="Atelier MyJantes à Liévin">
                <source src="/attached_assets/generated_videos/automotive_workshop_illustration.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-auto-red mb-1">Atelier MyJantes</p>
                <h3 className="text-lg sm:text-xl font-bold">Diamantage sur tour numérique</h3>
                <p className="text-white/60 text-sm flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {c("contact.address", "46 rue de la Convention, Liévin")}
                </p>
              </div>
            </div>
            <div>
              <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 uppercase tracking-widest text-xs">Technologie OEM</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                {c("sections.whyus.title", "Pourquoi choisir MyJantes ?")}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Basés à Liévin, nous investissons dans les meilleures technologies pour des résultats d'usine. Chaque jante est traitée avec une rigueur absolue et repart avec une garantie complète.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {whyUs.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-auto-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black">
                  <Link href="/a-propos">Notre histoire <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-gray-200 font-bold">
                  <Link href="/garanties">Nos garanties</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RÉALISATIONS (gallery) ───────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
              <div>
                <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-widest">Galerie</Badge>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                  {c("sections.gallery.title", "Nos réalisations")}
                </h2>
              </div>
              <Button asChild variant="outline" className="border-gray-200 font-bold shrink-0">
                <Link href="/galerie">Voir tout <ChevronRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {gallery.slice(0, 4).map((item) => (
                <Link key={item.id} href="/galerie">
                  <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-md cursor-pointer">
                    <img
                      src={item.afterImage}
                      alt={`Réalisation MyJantes : ${item.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100">
                      <p className="text-white font-bold text-xs line-clamp-1">{item.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── AVIS CLIENTS ─────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-12">
              <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-widest">Avis vérifiés</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                {c("sections.testimonials.title", "Ce que disent nos clients")}
              </h2>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                <span className="ml-2 text-gray-500 text-sm font-medium">5/5 — 98 avis clients</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <Card key={t.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-0.5 mb-4">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-6 italic">"{t.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-auto-red/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-auto-red font-black text-sm">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-gray-400 text-xs">{t.vehicle} · {t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── APP PROMO ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-auto-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-auto-red" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-auto-red/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-5 bg-auto-red/20 text-auto-red-light border-auto-red/30 uppercase tracking-[0.2em] text-xs font-bold">Espace Client</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
                Gérez tout depuis votre <span className="text-auto-red">smartphone</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg mb-8 leading-relaxed">
                Accédez à votre espace personnel pour suivre en temps réel l'avancement de vos jantes, gérer vos devis, factures et prendre rendez-vous en un clic.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: LayoutDashboard, title: "Suivi en temps réel", desc: "Visualisez chaque étape de votre prestation." },
                  { icon: Clock, title: "Prise de RDV en ligne", desc: "Réservez votre créneau 24h/24." },
                  { icon: Monitor, title: "Factures & devis", desc: "Tous vos documents en un seul endroit." },
                  { icon: Globe, title: "Historique complet", desc: "Retrouvez toutes vos interventions passées." },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 bg-white/5 rounded-xl p-4">
                    <item.icon className="w-5 h-5 text-auto-red mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-sm mb-0.5">{item.title}</p>
                      <p className="text-white/40 text-xs leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-8 h-12">
                <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                  Accéder à l'Espace client <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                <div className="text-center mb-6">
                  <Smartphone className="w-14 h-14 text-auto-red mx-auto mb-3 animate-pulse" />
                  <p className="font-black text-white text-xl" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>MyJantes App</p>
                  <p className="text-white/40 text-sm mt-1">appmyjantes.mytoolsgroup.eu</p>
                </div>
                <div className="space-y-3">
                  {["Suivi prestation", "Devis & factures", "Historique", "Notifications"].map(item => (
                    <div key={item} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5">
                      <CheckCircle2 className="w-4 h-4 text-auto-red shrink-0" />
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-24 bg-auto-red relative overflow-hidden" aria-labelledby="heading-cta">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-5" style={{ fontFamily: `'${fontFamily}', sans-serif` }} id="heading-cta">
            Redonnez vie à vos jantes
          </h2>
          <p className="text-white/80 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Devis gratuit sous 24h. Envoyez vos photos par e-mail ou via notre formulaire en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-white text-auto-red hover:bg-white/90 border-0 font-black px-8 h-14">
              <Link href="/contact">
                Devis gratuit <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 px-8 h-14 font-bold">
              <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                Espace client
              </a>
            </Button>
          </div>
          <p className="mt-8 text-white/50 text-sm flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            {c("contact.address", "46 rue de la Convention, 62800 Liévin")} — Lun–Ven 9h–12h / 13h30–18h
          </p>
        </div>
      </section>
    </div>
  );
}
