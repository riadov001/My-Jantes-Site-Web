import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import {
  Star, ArrowRight, Phone, MessageCircle, Shield, Zap, Award, Users, ChevronRight, CheckCircle2,
  Smartphone, Monitor, Globe, LayoutDashboard, Clock
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
    title: "Redressage de précision",
    description: "Correction des voiles et déformations par presse hydraulique. Expertise certifiée pour une sécurité totale.",
    href: "/services/redressage-jantes",
    image: "/images/service-redressage.png",
  },
  {
    icon: "🔩",
    title: "Débosselage PDR",
    description: "Élimination des chocs sans repeinture. Technique innovante, rapide et économique.",
    href: "/services/debosselage",
    image: "/images/gallery-2.png",
  },
];

const stats = [
  { value: "5 000+", label: "Jantes rénovées" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "12 mois", label: "Garantie Totale" },
  { value: "48h", label: "Délai moyen" },
];

const whyUs = [
  { icon: Shield, title: "Garantie Totale", desc: "Une qualité exceptionnelle, garantie totale sur toutes nos prestations." },
  { icon: Zap, title: "Délais rapides", desc: "Intervention sous 24 à 72h selon la prestation. Service express disponible." },
  { icon: Award, title: "Usinage Numérique", desc: "Équipement de pointe avec usinage sur tour numérique pour un fini parfait." },
  { icon: Users, title: "Expertise reconnue", desc: "Plus de 5 000 jantes traitées par nos artisans passionnés à Liévin." },
];

export default function Home() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials"] });
  const { data: gallery = [] } = useQuery<GalleryItem[]>({ queryKey: ["/api/gallery"] });

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MyJantes - L'Expert des jantes en alu",
    "description": "Rénovation, peinture et redressage de jantes à Liévin. Qualité exceptionnelle, garantie totale.",
    "url": "https://myjantes.fr",
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="MyJantes - L'Expert des jantes en alu | Rénovation & Peinture"
        description="L'Expert de la rénovation, peinture et redressage de jantes en alliage à Liévin. Garantie totale, délais rapides, devis gratuit sous 24h."
        keywords="rénovation jantes, peinture jantes, redressage jantes, jantes alu, Liévin, MyJantes"
        canonicalPath="/"
        schema={schema}
      />

      {/* HERO */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Accueil"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/attached_assets/generated_videos/wheel_painting_illustration.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-auto-dark/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-auto-dark via-transparent to-transparent" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 animate-fade-up">
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
            <span className="block mt-2 text-white/60 text-lg">Qualité exceptionnelle, garantie totale.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
            <Button
              asChild
              size="lg"
              className="bg-auto-red hover:bg-auto-red-dark text-white border-0 px-8 text-base font-semibold shadow-2xl h-14"
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
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 text-base font-semibold h-14"
              data-testid="button-hero-galerie"
            >
              <Link href="/galerie">Réalisations</Link>
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW VIDEO SECTION */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src="/attached_assets/generated_videos/automotive_workshop_illustration.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-bold uppercase tracking-widest text-auto-red mb-1">Notre Atelier</p>
                <h3 className="text-xl font-bold">Usinage tour numérique à Liévin</h3>
              </div>
            </div>
            <div>
              <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 uppercase tracking-widest text-xs">Innovation & Qualité</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 font-['Montserrat',sans-serif]">Une technologie de pointe pour vos jantes</h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Chez MyJantes, nous investissons dans les meilleures technologies. Notre tour numérique permet un usinage ultra-précis pour les finitions "Diamond Cut", redonnant à vos jantes leur aspect d'usine.
              </p>
              <ul className="space-y-4">
                {[
                  "Diagnostic laser du voile",
                  "Peinture haute résistance",
                  "Contrôle qualité certifié",
                  "Garantie totale 12 mois"
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="text-auto-red w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 text-xs uppercase tracking-wider">
              Nos prestations
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-['Montserrat',sans-serif]">Expertise complète</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Chaque intervention est réalisée avec une rigueur absolue à Liévin pour un résultat irréprochable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <Link key={service.href} href="/services">
                <Card className="group overflow-hidden border-0 shadow-lg hover-elevate transition-all duration-500 h-full cursor-pointer bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="font-black text-gray-900 text-xl mb-3 group-hover:text-auto-red transition-colors font-['Montserrat',sans-serif]">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 mb-6 leading-relaxed">{service.description}</p>
                    <span className="inline-flex items-center gap-2 text-auto-red text-sm font-bold uppercase tracking-widest">
                      Découvrir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* APP PROMO SECTION */}
      <section className="py-24 bg-auto-dark relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-full h-1 bg-auto-red" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-6 bg-auto-red/20 text-auto-red-light border-auto-red/30 uppercase tracking-[0.2em] text-xs font-bold">Prochainement</Badge>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 font-['Montserrat',sans-serif] leading-tight">
                Gérez tout depuis votre <span className="text-auto-red">smartphone</span>
              </h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Nous lançons bientôt l'application MyJantes Web & Mobile. Une plateforme unique pour gérer vos devis, suivre l'avancement de vos travaux et réserver vos créneaux en un clic.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: LayoutDashboard, title: "Dashboard Client", desc: "Suivi en temps réel de vos jantes." },
                  { icon: Clock, title: "Prise de RDV", desc: "Réservez votre créneau 24h/24." },
                  { icon: Smartphone, title: "App Mobile", desc: "Notifications push pour chaque étape." },
                  { icon: Globe, title: "Accès Web", desc: "Gérez vos factures et devis en ligne." },
                ].map(item => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-auto-red" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                      <p className="text-white/40 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="bg-white text-auto-dark hover:bg-white/90 font-black px-10 h-14 rounded-full transition-transform hover:scale-105">
                Être informé du lancement
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="absolute inset-0 bg-auto-red/20 blur-[120px] rounded-full scale-75" />
              <div className="relative bg-auto-dark-2 w-full max-w-[320px] aspect-[9/19] rounded-[3rem] border-[8px] border-white/10 shadow-2xl overflow-hidden p-4 flex flex-col items-center justify-center text-center">
                <Smartphone className="w-16 h-16 text-auto-red mb-6 animate-pulse" />
                <h4 className="font-black text-xl mb-2">MyJantes App</h4>
                <p className="text-white/40 text-sm">L'avenir de la rénovation de jantes est entre vos mains.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-white text-gray-900 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-wider font-bold">
                Engagement MyJantes
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black mb-6 font-['Montserrat',sans-serif]">Qualité exceptionnelle, garantie totale</h2>
              <p className="text-gray-600 mb-10 leading-relaxed text-lg">
                Basés à Liévin, nous sommes fiers de notre savoir-faire. Chaque jante qui sort de notre atelier bénéficie d'une attention méticuleuse et d'une garantie complète.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {whyUs.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                      <item.icon className="w-6 h-6 text-auto-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-auto-red/5 rounded-3xl -rotate-2" />
              <img
                src="/images/atelier.png"
                alt="Atelier Liévin"
                className="relative w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-auto-red relative overflow-hidden" aria-labelledby="heading-cta">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 font-['Montserrat',sans-serif]">
            Redonnez vie à vos jantes
          </h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Obtenez un devis gratuit en moins de 24h. Envoyez vos photos par WhatsApp ou via notre formulaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Button
              asChild
              size="lg"
              className="bg-white text-auto-red hover:bg-white/90 border-0 font-black px-10 h-14"
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
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 px-10 h-14 font-bold"
            >
              <a href="https://wa.me/33321408053" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" />
                WhatsApp direct
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 px-10 h-14 font-bold"
            >
              <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                Espace client
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
