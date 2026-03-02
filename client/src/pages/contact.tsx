import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SEO } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Smartphone, ArrowRight, MessageCircle } from "lucide-react";
import { insertContactSchema } from "@shared/schema";
import { Link } from "wouter";

const contactFormSchema = insertContactSchema.extend({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Message trop court (minimum 10 caractères)"),
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

  const c = (key: string, fallback = "") => content[key] || fallback;

  useEffect(() => {
    const el = document.getElementById("contact-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", service: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactForm) => apiRequest("POST", "/api/contact", data),
    onSuccess: () => {
      toast({ title: "Message envoyé !", description: "Nous vous répondrons dans les 24h. Merci !" });
      form.reset();
    },
    onError: () => {
      toast({ title: "Erreur", description: "Une erreur s'est produite. Veuillez réessayer.", variant: "destructive" });
    },
  });

  const phone = c("contact.phone", "03 21 40 80 53");
  const phoneHref = c("contact.phone_href", "tel:+33321408053");
  const whatsappHref = c("contact.whatsapp_href", "https://wa.me/33671370418");
  const whatsappNumber = c("contact.whatsapp_number", "06 71 37 04 18");
  const address = c("contact.address", "46 rue de la Convention, 62800 Liévin");
  const email = c("contact.email", "contact@myjantes.com");
  const hoursLine1 = c("footer.hours_line1", "Lun–Ven : 9h – 18h");
  const hoursLine2 = c("footer.hours_line2", "Sam : 9h – 14h | Dim : Fermé");

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact & Devis Gratuit — MyJantes | Rénovation Jantes Liévin"
        description="Contactez MyJantes pour un devis gratuit. Réponse sous 24h. Formulaire en ligne ou téléphone. Spécialiste jantes alliage à Liévin."
        keywords="contact MyJantes, devis rénovation jantes, devis peinture jantes gratuit"
        canonicalPath="/contact"
      />

      {/* Hero compact */}
      <div className="bg-auto-dark pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" data-testid="heading-contact">
            {c("pages.contact.title", "Contactez-nous")}
          </h1>
          <p className="text-white/55 text-lg">
            {c("pages.contact.subtitle", "Réponse garantie sous 24h. Envoyez vos photos pour un devis personnalisé.")}
          </p>
        </div>
      </div>

      {/* Espace Client MyJantes App */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-br from-auto-dark to-gray-900 border border-white/5 rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
            <div className="shrink-0 w-16 h-16 bg-auto-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-auto-red/30">
              <Smartphone className="w-8 h-8" />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-lg font-black text-white mb-1">Espace Client MyJantes</h3>
              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                Suivez vos prestations en temps réel, gérez vos documents et communiquez directement avec notre équipe.
              </p>
              <Button asChild size="sm" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-bold">
                <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer" data-testid="link-espace-client">
                  Accéder à mon espace <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div id="contact-form" className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Formulaire de contact</h2>
          <p className="text-gray-500">Décrivez votre projet et nous vous répondons sous 24h.</p>
        </div>

        <Card className="border border-gray-100 shadow-md">
          <CardContent className="p-8">
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
                            <SelectItem value="peinture">Peinture & Personnalisation</SelectItem>
                            <SelectItem value="soudure">Soudure</SelectItem>
                            <SelectItem value="sablage">Sablage</SelectItem>
                            <SelectItem value="devoilage">Devoilage</SelectItem>
                            <SelectItem value="hydrodipping">Hydrodipping</SelectItem>
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
                  className="w-full bg-auto-red hover:bg-auto-red-dark text-white border-0 font-bold h-12 text-base"
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

                <p className="text-center text-xs text-gray-400">
                  Vos données sont traitées uniquement pour répondre à votre demande.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {[
            "Photos de vos jantes (avant + profil)",
            "Diamètre des jantes (15\", 17\", 19\"...)",
            "Type de prestation souhaitée",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-auto-red shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Coordonnées — en bas */}
      <div className="bg-auto-dark py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">Contactez-nous directement</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                icon: Phone,
                title: "Téléphone",
                value: phone,
                href: phoneHref,
                sub: "Appel direct",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                value: whatsappNumber,
                href: whatsappHref,
                sub: "Message rapide",
              },
              {
                icon: Mail,
                title: "Email",
                value: email,
                href: `mailto:${email}`,
                sub: "Réponse sous 24h",
              },
              {
                icon: MapPin,
                title: "Adresse",
                value: address,
                href: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
                sub: "Liévin — 62800",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.title === "Adresse" || item.title === "WhatsApp" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 text-center transition-all hover:border-auto-red/40 hover:shadow-lg hover:shadow-auto-red/10"
              >
                <div className="w-12 h-12 bg-auto-red/20 group-hover:bg-auto-red rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                  <item.icon className="w-5 h-5 text-auto-red group-hover:text-white transition-colors" />
                </div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{item.title}</p>
                <p className="text-white font-bold text-sm leading-tight">{item.value}</p>
                <p className="text-white/40 text-xs mt-1">{item.sub}</p>
              </a>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Clock className="w-6 h-6 text-auto-red shrink-0" />
              <div>
                <p className="text-white font-bold text-sm mb-1">Horaires d'ouverture</p>
                <p className="text-white/60 text-sm">{hoursLine1}</p>
                <p className="text-white/60 text-sm">{hoursLine2}</p>
              </div>
            </div>
            <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-bold shrink-0">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Écrire sur WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
