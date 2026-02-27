import { SEO } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, Award, Clock, MapPin, Star, History, Users, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Notre Histoire - MyJantes | L'Expert de la Jante à Liévin"
        description="Découvrez l'histoire de MyJantes : de la passion automobile à l'expertise technologique en rénovation de jantes à Liévin."
        keywords="histoire myjantes, rénovation jantes liévin, expert jantes alu, sablage jantes 62"
        canonicalPath="/a-propos"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-28 md:pb-12 lg:pt-24 lg:pb-10 bg-auto-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/attached_assets/generated_videos/automotive_workshop_illustration.mp4" 
            className="w-full h-full object-cover"
            alt="Atelier"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-auto-red/20 text-auto-red-light border-auto-red/30 px-4 py-1 uppercase tracking-widest text-xs font-bold">
            Depuis 2020
          </Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 font-['Montserrat',sans-serif] leading-tight">
            Une passion, <br/><span className="text-auto-red">une expertise.</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Basés au cœur du Pas-de-Calais, nous transformons chaque jante avec la précision d'une pièce d'horlogerie.
          </p>
        </div>
      </section>

      {/* L'Histoire Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-auto-red/10 rounded-full blur-3xl" />
              <img 
                src="/images/service-renovation.png" 
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
                    <p className="text-2xl font-black text-gray-900">5+ Ans</p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">D'expérience</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 font-['Montserrat',sans-serif]">
                De la passion à l'excellence
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  L'aventure MyJantes a débuté avec un constat simple : les passionnés d'automobile manquaient d'un interlocuteur expert capable d'allier <strong>technologie industrielle</strong> et <strong>finition artisanale</strong> pour leurs jantes.
                </p>
                <p>
                  Initialement focalisés sur la peinture classique, nous avons rapidement investi dans des équipements de pointe, notamment un <strong>tour numérique haute précision</strong> pour répondre à la demande croissante de diamantage sur tour numérique (jantes bi-ton).
                </p>
                <p>
                  Aujourd'hui, notre atelier de Liévin est devenu une référence dans les Hauts-de-France, traitant plus de 100 jantes par semaine pour des particuliers exigeants et des concessions prestigieuses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Montserrat',sans-serif]">Nos piliers fondamentaux</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: "Précision Millimétrée", 
                desc: "Chaque redressage et chaque usinage est vérifié au comparateur pour garantir une sécurité totale." 
              },
              { 
                icon: Users, 
                title: "Relation Client", 
                desc: "Pas de surprise. Nous communiquons en temps réel via notre application sur l'avancement de vos travaux." 
              },
              { 
                icon: Award, 
                title: "Qualité d'Usine", 
                desc: "Nous utilisons exclusivement des peintures et vernis conformes aux normes constructeurs (OEM)." 
              }
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

      {/* Engagements Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-auto-dark rounded-[2.5rem] p-8 sm:p-12 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-auto-red/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 font-['Montserrat',sans-serif]">
                  Notre engagement à Liévin
                </h2>
                <div className="space-y-4">
                  {[
                    "Garantie* sur la tenue de peinture et la finition.",
                    "Délais d'intervention maîtrisés (48h à 72h en moyenne).",
                    "Transparence totale sur les tarifs et les méthodes.",
                    "Soutien de l'économie locale et formation interne."
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-auto-red shrink-0" />
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                  <p className="text-3xl font-black text-white">5 000+</p>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Jantes traitées</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                  <p className="text-3xl font-black text-white">98%</p>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Satisfaction</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center col-span-2">
                  <p className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5 text-auto-red" /> 46 rue de la Convention
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
