import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Smartphone, ArrowRight } from "lucide-react";
import { insertContactSchema } from "@shared/schema";

const contactFormSchema = insertContactSchema.extend({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court (minimum 10 caractères)"),
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les 24h. Merci !",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact MyJantes",
    "description": "Contactez MyJantes pour un devis gratuit de rénovation de jantes.",
    "url": "https://myjantes.fr/contact",
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact & Devis Gratuit - Rénovation Jantes | MyJantes"
        description="Contactez MyJantes pour un devis gratuit. Réponse sous 24h. Téléphone ou formulaire en ligne. Spécialiste jantes alliage."
        keywords="contact MyJantes, devis rénovation jantes, devis peinture jantes gratuit"
        canonicalPath="/contact"
        schema={schema}
      />

      {/* Hero */}
      <div className="bg-auto-dark pt-36 pb-16 md:pt-28 md:pb-10 lg:pt-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Devis gratuit
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-contact">
            Contactez-nous
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Réponse garantie sous 24h. Envoyez vos photos pour un devis personnalisé.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, title: "Téléphone", content: "03 21 40 80 53", href: "tel:+33321408053", sub: "Lun–Ven 9h–18h" },
                  { icon: Mail, title: "Email", content: "contact@myjantes.com", href: "mailto:contact@myjantes.com", sub: "Réponse sous 24h" },
                  { icon: MapPin, title: "Adresse", content: "46 rue de la Convention, 62800 Liévin", href: null, sub: "Expert jantes alu" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-auto-red/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-auto-red" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-gray-900 font-medium text-sm hover:text-primary transition-colors">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium text-sm">{item.content}</p>
                      )}
                      <p className="text-gray-400 text-xs">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Horaires
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Lundi – Vendredi", hours: "9h00 – 12h00 / 13h30 – 18h00" },
                  { day: "Samedi – Dimanche", hours: "Fermé" },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <span className="text-gray-600">{h.day}</span>
                    <span className={`font-medium ${h.hours === "Fermé" ? "text-gray-400" : "text-gray-900"}`}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Pour un devis rapide, préparez :</h3>
              <ul className="space-y-2">
                {[
                  "Photos de vos jantes (avant + profil)",
                  "Diamètre des jantes (15\", 17\", 19\"...)",
                  "Type de prestation souhaitée",
                  "Couleur ou finition désirée",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-xs">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {/* Espace Client Banner */}
            <div className="mb-10 bg-gradient-to-br from-auto-dark to-gray-900 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="shrink-0 w-20 h-20 bg-auto-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-auto-red/30">
                <Smartphone className="w-10 h-10" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-black text-white mb-2 font-['Montserrat',sans-serif]">Espace Client MyJantes</h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">
                  Accédez à votre espace personnel pour suivre vos prestations, gérer vos documents et communiquer directement avec notre équipe.
                </p>
                <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-6">
                  <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer" data-testid="link-espace-client">
                    Espace client <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Asterisk benefits */}
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-3">* Pourquoi créer votre Espace Client ?</p>
              <ul className="space-y-2">
                {[
                  "Suivi complet et en temps réel de l'avancement de votre prestation",
                  "Fluidité totale dans vos démarches : devis, validation, facturation en un seul endroit",
                  "Visibilité complète sur chaque étape de la rénovation de vos jantes",
                  "Historique de toutes vos interventions, factures et documents disponibles à tout moment",
                  "Communication directe avec notre équipe sans passer par email ou téléphone",
                  "Notifications en temps réel pour ne manquer aucune mise à jour sur votre dossier",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-blue-700 text-xs leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Formulaire de contact</h2>
                <p className="text-gray-500 text-sm mb-8">Décrivez votre projet et joignez vos photos par email.</p>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                    className="space-y-5"
                    data-testid="form-contact"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean Dupont" data-testid="input-contact-name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jean@example.com" data-testid="input-contact-email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="06 00 00 00 00" data-testid="input-contact-phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service souhaité</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-contact-service" aria-label="Choisir un service">
                                  <SelectValue placeholder="Choisir un service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="renovation">Rénovation complète</SelectItem>
                                <SelectItem value="peinture">Peinture & Customisation</SelectItem>
                                <SelectItem value="redressage">Redressage</SelectItem>
                                <SelectItem value="debosselage">Débosselage</SelectItem>
                                <SelectItem value="autre">Autre / Non défini</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Votre message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre projet : modèle de véhicule, taille des jantes, dommages constatés, finition souhaitée..."
                              className="min-h-[140px] resize-y"
                              data-testid="textarea-contact-message"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-auto-red hover:bg-auto-red-dark text-white border-0 font-semibold"
                      disabled={mutation.isPending}
                      data-testid="button-contact-submit"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                          Envoi en cours...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Envoyer ma demande
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
