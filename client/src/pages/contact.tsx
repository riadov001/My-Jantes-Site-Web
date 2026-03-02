import { useEffect, useRef, useState } from "react";
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
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Smartphone, ArrowRight, MessageCircle, Upload, X, Star } from "lucide-react";
import { Link } from "wouter";

const contactFormSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  firstName: z.string().min(1, "Prénom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Téléphone requis"),
  requestType: z.string().min(1, "Veuillez choisir l'objet de votre demande"),
  nbWheels: z.string().optional(),
  vehicle: z.string().optional(),
  service: z.string().optional(),
  imageUrl: z.string().optional(),
  message: z.string().min(1, "Informations supplémentaires requises"),
  consent: z.boolean().refine(v => v === true, { message: "Vous devez accepter les conditions" }),
});

type ContactForm = z.infer<typeof contactFormSchema>;

const REQUEST_TYPES = [
  { value: "devis", label: "Demande de devis (Photo obligatoire)" },
  { value: "rdv", label: "Demande de rendez-vous (Photo obligatoire)" },
  { value: "rappel", label: "Demande de rappel" },
  { value: "pro", label: "Ouverture d'un compte professionnel" },
];

export default function Contact() {
  const { toast } = useToast();
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const c = (key: string, fallback = "") => content[key] || fallback;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "", firstName: "", email: "", phone: "",
      requestType: "", nbWheels: "", vehicle: "", service: "",
      imageUrl: "", message: "", consent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ContactForm) => {
      const { consent, ...rest } = data;
      return apiRequest("POST", "/api/contact", { ...rest, imageUrl: uploadedImage || rest.imageUrl });
    },
    onSuccess: () => {
      toast({ title: "Demande envoyée !", description: "Nous vous répondrons dans les 24h. Merci !" });
      form.reset();
      setUploadedImage(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Une erreur s'est produite. Veuillez réessayer.", variant: "destructive" });
    },
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload-public", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedImage(data.url);
        form.setValue("imageUrl", data.url);
      }
    } catch {
      toast({ title: "Erreur d'envoi de l'image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const phone = c("contact.phone", "03 21 40 80 53");
  const phoneHref = c("contact.phone_href", "tel:+33321408053");
  const whatsappHref = c("contact.whatsapp_href", "https://wa.me/33671370418");
  const whatsappNumber = c("contact.whatsapp_number", "06 71 37 04 18");
  const address = c("contact.address", "46 rue de la Convention, 62800 Liévin");
  const email = c("contact.email", "contact@myjantes.com");
  const hoursLine1 = c("footer.hours_line1", "Lun – Ven : 9h – 12h30");
  const hoursLine2 = c("footer.hours_line2", "13h30 – 18h00");

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact MyJantes — Devis Gratuit",
    "description": "Formulaire de contact pour demande de devis, rénovation et peinture de jantes à Liévin.",
    "url": "https://myjantes.fr/contact",
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact & Devis Gratuit — MyJantes | Rénovation Jantes Liévin"
        description="Contactez MyJantes pour un devis gratuit de rénovation, peinture ou soudure de jantes. Réponse sous 24h. Spécialiste jantes alliage à Liévin (62)."
        keywords="contact MyJantes, devis rénovation jantes, devis peinture jantes gratuit, jantes Liévin"
        canonicalPath="/contact"
        schema={schema}
      />

      <div className="bg-auto-dark pt-32 pb-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" data-testid="heading-contact">
            {c("pages.contact.title", "Nous Contacter")}
          </h1>
          <p className="text-white/55 text-base">
            {c("pages.contact.subtitle", "Contactez-nous pour tous renseignements. Obtenez votre devis gratuit.")}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Demandez Votre Devis Gratuit</h2>
          <p className="text-gray-500 text-sm">Ce devis est une estimation du montant de la prestation.</p>
          <p className="text-gray-500 text-sm">Un diagnostic structuré sera établi par nos expert à réception de vos jantes.</p>
        </div>

        <Card className="border border-gray-100 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className="space-y-5"
                data-testid="form-contact"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Dupont" data-testid="input-contact-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean" data-testid="input-contact-firstname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse de messagerie *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jean@example.com" data-testid="input-contact-email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="06 00 00 00 00" data-testid="input-contact-phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objet de votre demande *</FormLabel>
                        <div className="space-y-2 mt-2">
                          {REQUEST_TYPES.map(rt => (
                            <label key={rt.value} className="flex items-start gap-2.5 cursor-pointer group">
                              <input
                                type="radio"
                                name="requestType"
                                value={rt.value}
                                checked={field.value === rt.value}
                                onChange={() => field.onChange(rt.value)}
                                className="mt-0.5 accent-red-600"
                                data-testid={`radio-request-${rt.value}`}
                              />
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">{rt.label}</span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nbWheels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de jantes *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-nb-wheels" aria-label="Nombre de jantes">
                              <SelectValue placeholder="Nombre de jantes" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {["1", "2", "3", "4"].map(n => (
                              <SelectItem key={n} value={n}>{n}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Importer votre image</label>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-auto-red/40 transition-colors bg-gray-50/50 hover:bg-red-50/20"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileUpload(file);
                    }}
                    data-testid="dropzone-image"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }}
                    />
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <div className="w-5 h-5 border-2 border-auto-red border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </div>
                    ) : uploadedImage ? (
                      <div className="relative">
                        <img src={uploadedImage} className="max-h-32 mx-auto rounded-lg object-cover" alt="Photo uploadée" />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setUploadedImage(null); form.setValue("imageUrl", ""); }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Glissez et déposez ou <span className="text-auto-red font-semibold">cliquez</span></p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG, HEIC — Max 10 Mo</p>
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Informations supplémentaires</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Modèle de véhicule, taille des jantes, dommages constatés, finition souhaitée..."
                          className="min-h-[110px] resize-y"
                          data-testid="textarea-contact-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Consentement *</FormLabel>
                      <div className="flex items-start gap-2.5 mt-1">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={e => field.onChange(e.target.checked)}
                          className="mt-0.5 accent-red-600"
                          data-testid="checkbox-consent"
                        />
                        <span className="text-sm text-gray-600">
                          J'accepte que mes données soient fournies à Myjantes afin d'être recontacté(e).
                        </span>
                      </div>
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
                      Demander un devis
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="bg-auto-dark py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-10">
            <MapPin className="inline w-6 h-6 text-auto-red mr-2" />
            Nous Contacter – Avec Ou Sans Rendez-Vous
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { icon: Phone, title: "Téléphone", value: phone, href: phoneHref, sub: "Appel direct" },
              { icon: MessageCircle, title: "WhatsApp", value: whatsappNumber, href: whatsappHref, sub: "Message rapide" },
              { icon: Mail, title: "Email", value: email, href: `mailto:${email}`, sub: "Réponse sous 24h" },
              { icon: MapPin, title: "Adresse", value: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}`, sub: "Liévin — 62800" },
            ].map(item => (
              <a
                key={item.title}
                href={item.href}
                target={["Adresse", "WhatsApp"].includes(item.title) ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 text-center transition-all hover:border-auto-red/40 hover:shadow-lg hover:shadow-auto-red/10"
              >
                <div className="w-11 h-11 bg-auto-red/20 group-hover:bg-auto-red rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                  <item.icon className="w-5 h-5 text-auto-red group-hover:text-white transition-colors" />
                </div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{item.title}</p>
                <p className="text-white font-bold text-sm leading-tight">{item.value}</p>
                <p className="text-white/40 text-xs mt-1">{item.sub}</p>
              </a>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-5 h-5 text-auto-red shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-sm mb-1">Horaires D'ouverture</p>
                <p className="text-white/60 text-sm">{hoursLine1}</p>
                <p className="text-white/60 text-sm">{hoursLine2}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-bold">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href={phoneHref}><Phone className="w-4 h-4 mr-2" /> Appeler</a>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                  <Smartphone className="w-4 h-4 mr-2" /> Espace client
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
