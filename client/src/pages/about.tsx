import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Award, MapPin, History, Users, Target, Star } from "lucide-react";
import type { Testimonial } from "@shared/schema";

type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
  relative_time_description: string;
};

export default function About() {
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/testimonials"] });
  const { data: googleReviews = [] } = useQuery<GoogleReview[]>({ queryKey: ["/api/google-reviews"] });
  const c = (key: string, fallback = "") => content[key] || fallback;
  const fontFamily = c("typography.font", "Montserrat");

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <SEO
        title="Notre Histoire - MyJantes | L'Expert de la Jante à Liévin"
        description="Découvrez l'histoire de MyJantes : de la passion automobile à l'expertise technologique en rénovation de jantes à Liévin."
        keywords="histoire myjantes, rénovation jantes liévin, expert jantes alu, sablage jantes 62"
        canonicalPath="/a-propos"
      />

      <section className="relative pt-32 pb-20 md:pt-28 md:pb-12 lg:pt-24 lg:pb-10 bg-auto-dark overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-auto-red/20 text-auto-red-light border-auto-red/30 px-4 py-1 uppercase tracking-widest text-xs font-bold">
            {c("pages.about.badge", "Depuis 2022")}
          </Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            {c("pages.about.hero_title_line1", "Une passion,")} <br/>
            <span className="text-auto-red">{c("pages.about.hero_title_line2", "une expertise.")}</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            {c("pages.about.hero_subtitle", "Basés au cœur du Pas-de-Calais, nous transformons chaque jante avec la précision d'une pièce d'horlogerie.")}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-auto-red/10 rounded-full blur-3xl" />
              <img
                src={c("pages.about.image", "/images/service-renovation.png")}
                alt="Expertise MyJantes : Rénovation de jantes en alliage à Liévin"
                className="rounded-3xl shadow-2xl relative z-10 w-full"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-auto-red rounded-full flex items-center justify-center text-white">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{c("pages.about.experience", "4+ Ans")}</p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">D'expérience</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8">
                {c("pages.about.story_title", "De la passion à l'excellence")}
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                {c("pages.about.story_content", `L'aventure MyJantes a débuté avec un constat simple : les passionnés d'automobile manquaient d'un interlocuteur expert capable d'allier technologie industrielle et finition artisanale pour leurs jantes.\n\nInitialement focalisés sur la peinture classique, nous avons rapidement investi dans des équipements de pointe, notamment un tour numérique haute précision pour répondre à la demande croissante de diamantage sur tour numérique (jantes bi-ton).\n\nAujourd'hui, notre atelier de Liévin est devenu une référence dans les Hauts-de-France, traitant plus de 100 jantes par semaine pour des particuliers exigeants et des concessions prestigieuses.`)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{c("pages.about.values_title", "Nos piliers fondamentaux")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: c("pages.about.value1_title", "Précision Millimétrée"), desc: c("pages.about.value1_desc", "Chaque redressage et chaque usinage est vérifié au comparateur pour garantir une sécurité totale.") },
              { icon: Users, title: c("pages.about.value2_title", "Relation Client"), desc: c("pages.about.value2_desc", "Pas de surprise. Nous communiquons en temps réel sur l'avancement de vos travaux.") },
              { icon: Award, title: c("pages.about.value3_title", "Qualité d'Usine"), desc: c("pages.about.value3_desc", "Nous utilisons exclusivement des peintures et vernis conformes aux normes constructeurs (OEM).") },
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="w-14 h-14 bg-auto-red/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-auto-red transition-colors">
                    <item.icon className="w-7 h-7 text-auto-red group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AVIS CLIENTS ─────────────────────────────────────────── */}
      {(googleReviews.length > 0 || testimonials.length > 0) && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              {googleReviews.length > 0 ? (
                <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 text-xs uppercase tracking-widest">Avis Google ⭐ Vérifiés</Badge>
              ) : (
                <Badge className="mb-4 bg-auto-red/10 text-auto-red border-auto-red/20 text-xs uppercase tracking-widest">Avis vérifiés</Badge>
              )}
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
                {c("sections.testimonials.title", "Ce que disent nos clients")}
              </h2>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                <span className="ml-2 text-gray-500 text-sm font-medium">5/5 — Avis clients</span>
              </div>
            </div>

            {googleReviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {googleReviews.slice(0, 3).map((review, i) => (
                  <Card key={i} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-0.5">
                          {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                        </div>
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Google</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-6 italic">"{review.text}"</p>
                      <div className="flex items-center gap-3">
                        {review.profile_photo_url ? (
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-auto-red/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-auto-red font-black text-sm">{review.author_name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{review.author_name}</p>
                          <p className="text-gray-400 text-xs">{review.relative_time_description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </section>
      )}

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-auto-dark rounded-[2.5rem] p-8 sm:p-12 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-auto-red/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {c("pages.about.commitments_title", "Notre engagement à Liévin")}
                </h2>
                <div className="space-y-4">
                  {[
                    c("pages.about.commitment1", "Garantie* sur la tenue de peinture et la finition."),
                    c("pages.about.commitment2", "Délais d'intervention maîtrisés (24h à 48h en moyenne)."),
                    c("pages.about.commitment3", "Transparence totale sur les tarifs et les méthodes."),
                    c("pages.about.commitment4", "Soutien de l'économie locale et formation interne."),
                  ].filter(Boolean).map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-auto-red shrink-0" />
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                  <p className="text-3xl font-black text-white">{c("pages.about.stat1_value", "5 000+")}</p>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{c("pages.about.stat1_label", "Jantes traitées")}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                  <p className="text-3xl font-black text-white">{c("pages.about.stat2_value", "98%")}</p>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{c("pages.about.stat2_label", "Satisfaction")}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center col-span-2">
                  <p className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-auto-red" /> {c("contact.address", "46 rue de la Convention")}
                  </p>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Liévin, 62800</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
