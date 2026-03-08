import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SEO } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send, Smartphone, ArrowRight, MessageCircle, Upload, X, LayoutDashboard, Monitor, Globe, Zap, ScanSearch, Sparkles, Loader2, FileText } from "lucide-react";
import { Link } from "wouter";
import type { SiteService as Service } from "@shared/schema";

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
  const { data: services = [] } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ocrAnalyzing, setOcrAnalyzing] = useState(false);
  const [ocrResult, setOcrResult] = useState<{ vehicle?: string; plate?: string; wheelInfo?: string; details?: string } | null>(null);
  const [showOcrConsent, setShowOcrConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

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

  const runOcrAnalysis = async () => {
    if (!uploadedImage) return;
    setOcrAnalyzing(true);
    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadedImage }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        const data = json.data;
        setOcrResult(data);
        if (data.vehicle) form.setValue("vehicle", data.vehicle);
        if (data.wheelInfo || data.details) {
          const current = form.getValues("message");
          const ocrInfo = [data.wheelInfo, data.details].filter(Boolean).join(" — ");
          form.setValue("message", current ? `${current}\n\n[IA] ${ocrInfo}` : `[IA] ${ocrInfo}`);
        }
        toast({ title: "Analyse terminée", description: "Les informations détectées ont été ajoutées au formulaire." });
      } else {
        toast({ title: "Erreur d'analyse", description: json.error || "L'analyse n'a pas pu aboutir. Veuillez remplir manuellement.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur d'analyse", description: "L'analyse IA n'a pas pu aboutir. Veuillez remplir les champs manuellement.", variant: "destructive" });
    } finally {
      setOcrAnalyzing(false);
      setShowOcrConsent(false);
    }
  };

  const selectService = (svc: Service) => {
    form.setValue("service", svc.title);
    form.setValue("requestType", "devis");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const phone = c("contact.phone", "03 21 40 80 53");
  const phoneHref = c("contact.phone_href", "tel:+33321408053");
  const whatsappHref = c("contact.whatsapp_href", "https://wa.me/33671370418");
  const whatsappNumber = c("contact.whatsapp_number", "06 71 37 04 18");
  const address = c("contact.address", "46 rue de la Convention, 62800 Liévin");
  const email = c("contact.email", "contact@myjantes.com");
  const hoursLine1 = c("footer.hours_line1", "Lun – Ven : 9h – 12h30");
  const hoursLine2 = c("footer.hours_line2", "13h30 – 18h00");

  const selectedService = form.watch("service");

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

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
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

      {/* ─── SERVICES ─────────────────────────────────────────────────── */}
      {services.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-auto-red font-bold mb-2">Nos prestations</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                Quelle prestation vous intéresse ?
              </h2>
              <p className="text-gray-400 text-sm mt-2">Cliquez sur une prestation pour pré-remplir votre demande de devis.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {services.filter(s => s.published).map(svc => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => selectService(svc)}
                  data-testid={`card-service-${svc.slug}`}
                  className={`group relative rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                    selectedService === svc.title
                      ? "border-auto-red bg-auto-red/5 shadow-md shadow-auto-red/10"
                      : "border-gray-200 bg-white hover:border-auto-red/40"
                  }`}
                >
                  {selectedService === svc.title && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-4 h-4 text-auto-red" />
                    </div>
                  )}
                  <Badge className={`mb-2.5 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 ${
                    svc.badge === "Best-seller"
                      ? "bg-auto-red/10 text-auto-red border-auto-red/20"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}>
                    {svc.badge}
                  </Badge>
                  <p className={`font-black text-sm leading-tight mb-1 ${selectedService === svc.title ? "text-auto-red" : "text-gray-900"}`}>
                    {svc.title}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium leading-tight">{svc.price}</p>
                </button>
              ))}
            </div>

            {selectedService && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 text-sm text-auto-red font-semibold bg-auto-red/5 border border-auto-red/20 rounded-full px-4 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <strong>{selectedService}</strong> sélectionné — votre formulaire est pré-rempli ci-dessous
                  <button
                    type="button"
                    onClick={() => form.setValue("service", "")}
                    className="ml-1 text-auto-red/60 hover:text-auto-red"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── FORM ─────────────────────────────────────────────────────── */}
      <div ref={formRef} className="max-w-3xl mx-auto px-4 py-10 sm:py-14 scroll-mt-20">
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
                    name="vehicle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Véhicule</FormLabel>
                        <FormControl>
                          <Input placeholder="ex : BMW Série 3, Audi A4…" data-testid="input-contact-vehicle" {...field} />
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
                        <FormLabel>Prestation souhaitée</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger data-testid="select-service" aria-label="Prestation souhaitée">
                              <SelectValue placeholder="Choisir une prestation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {services.filter(s => s.published).map(s => (
                              <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                  {uploadedImage && !ocrResult && (
                    <button
                      type="button"
                      onClick={() => setShowOcrConsent(true)}
                      disabled={ocrAnalyzing}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                      data-testid="button-ocr-analyze"
                    >
                      {ocrAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyse IA en cours...
                        </>
                      ) : (
                        <>
                          <ScanSearch className="w-4 h-4" />
                          <Sparkles className="w-3.5 h-3.5" />
                          Analyser avec l'IA (carte grise / jante)
                        </>
                      )}
                    </button>
                  )}

                  {ocrResult && (
                    <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-4" data-testid="ocr-results">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Résultat de l'analyse IA</span>
                      </div>
                      <div className="space-y-1 text-sm text-purple-900">
                        {ocrResult.vehicle && <p><strong>Véhicule :</strong> {ocrResult.vehicle}</p>}
                        {ocrResult.plate && <p><strong>Immatriculation :</strong> {ocrResult.plate}</p>}
                        {ocrResult.wheelInfo && <p><strong>Jantes :</strong> {ocrResult.wheelInfo}</p>}
                        {ocrResult.details && <p><strong>Détails :</strong> {ocrResult.details}</p>}
                      </div>
                    </div>
                  )}
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

      {/* ─── ESPACE CLIENT ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-auto-dark border border-white/10 p-8 sm:p-12 shadow-2xl shadow-auto-red/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-auto-red/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-auto-red/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/4" />

          <div className="relative flex flex-col md:flex-row gap-10 items-center">
            <div className="shrink-0 relative">
              <div className="w-20 h-20 rounded-3xl bg-auto-red flex items-center justify-center shadow-lg shadow-auto-red/40">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-auto-dark flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <Badge className="mb-4 bg-auto-red text-white border-0 uppercase tracking-[0.2em] text-[11px] font-black px-4 py-1">
                EXCLUSIVITÉ MYJANTES
              </Badge>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight uppercase tracking-tight">
                VOTRE ATELIER DANS <span className="text-auto-red">VOTRE POCHE</span>
              </h3>
              <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed max-w-2xl">
                Suivez l'avancement de vos jantes étape par étape. Photos en direct, devis instantanés et historique complet de vos interventions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Zap, label: "SUIVI EN DIRECT", desc: "Photos à chaque étape" },
                  { icon: FileText, label: "DEVIS & FACTURES", desc: "Documents archivés" },
                  { icon: Clock, label: "PRISE DE RDV", desc: "Disponible 24h/24" },
                  { icon: Monitor, label: "ACCÈS ILLIMITÉ", desc: "Web & Mobile" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <item.icon className="w-6 h-6 text-auto-red shrink-0" />
                    <div className="text-left">
                      <p className="text-white text-sm font-black uppercase tracking-wider">{item.label}</p>
                      <p className="text-white/40 text-xs mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black h-14 px-10 text-lg group"
                  data-testid="button-espace-client-main"
                >
                  <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                    OUVRIR MON ESPACE
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-14 px-8 font-bold"
                >
                  <a href="#form-contact">Nouveau client ? Demander un devis</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTACT INFO ─────────────────────────────────────────────── */}
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

      {showOcrConsent && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" data-testid="modal-ocr-consent">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <ScanSearch className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">Analyse IA de votre image</h3>
                <p className="text-xs text-gray-400">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 leading-relaxed">
              <p className="mb-2">En cliquant sur <strong>"Analyser"</strong>, vous acceptez que :</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span> Votre image soit envoyée à un service d'intelligence artificielle pour analyse</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span> Les données extraites (véhicule, immatriculation) seront pré-remplies dans le formulaire</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">•</span> Aucune donnée n'est conservée après l'analyse</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowOcrConsent(false)}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-xl transition-colors"
                data-testid="button-ocr-cancel"
              >
                Annuler
              </button>
              <button
                onClick={runOcrAnalysis}
                disabled={ocrAnalyzing}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="button-ocr-confirm"
              >
                {ocrAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {ocrAnalyzing ? "Analyse..." : "Analyser"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
