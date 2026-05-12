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
import {
  Phone, Mail, MapPin, Clock, CheckCircle2, Send, Smartphone, ArrowRight,
  Upload, X, LayoutDashboard, Monitor, Globe, Zap, ScanSearch, Sparkles,
  Loader2, FileText, Activity, Lock, Star, ChevronRight
} from "lucide-react";
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
}).superRefine((data, ctx) => {
  if ((data.requestType === "devis" || data.requestType === "rdv") && !data.imageUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Une photo est obligatoire pour les demandes de devis et de rendez-vous",
      path: ["imageUrl"],
    });
  }
});

type ContactForm = z.infer<typeof contactFormSchema>;

const REQUEST_TYPES = [
  { value: "devis", label: "Demande de devis (Photo obligatoire)" },
  { value: "rdv", label: "Demande de rendez-vous (Photo obligatoire)" },
  { value: "rappel", label: "Demande de rappel" },
  { value: "pro", label: "Ouverture d'un compte professionnel" },
];

const ESPACE_CLIENT_FEATURES = [
  { icon: Activity, title: "Suivi en temps réel", desc: "Visualisez chaque étape de votre prestation depuis votre téléphone." },
  { icon: FileText, title: "Devis & factures", desc: "Tous vos documents accessibles en un clic, téléchargeables en PDF." },
  { icon: Clock, title: "Prise de RDV en ligne", desc: "Réservez votre créneau 24h/24, 7j/7 sans attente." },
  { icon: Globe, title: "Historique complet", desc: "Retrouvez toutes vos interventions passées avec photos avant/après." },
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
  const [submitted, setSubmitted] = useState(false);
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
      setSubmitted(true);
      form.reset();
      setUploadedImage(null);
      setOcrResult(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      const res = await fetch("/api/admin/upload-public", { method: "POST", body: formData });
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
        toast({ title: "Erreur d'analyse", description: json.error || "L'analyse n'a pas pu aboutir.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur d'analyse", description: "L'analyse IA n'a pas pu aboutir.", variant: "destructive" });
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
  const address = c("contact.address", "46 rue de la Convention, 62800 Liévin");
  const email = c("contact.email", "contact@myjantes.com");
  const hoursLine1 = c("footer.hours_line1", "Lun – Ven : 9h – 12h30");
  const hoursLine2 = c("footer.hours_line2", "13h30 – 18h00");
  const espaceClientUrl = c("global.espace_client_url", c("pages.contact.espace_client_url", "https://pwapp.myjantes.fr"));
  const espaceClientCta = c("pages.contact.espace_client_cta", "Accéder à mon espace client");

  const selectedService = form.watch("service");

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact MyJantes — Devis Gratuit",
    "description": "Formulaire de contact pour demande de devis, rénovation et peinture de jantes à Liévin.",
    "url": "https://myjantes.fr/contact",
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-auto-dark flex items-center justify-center px-4">
        <SEO
          title="Demande envoyée — MyJantes"
          description="Votre demande de devis a bien été envoyée. Nous vous répondrons dans les 24h."
          canonicalPath="/contact"
          schema={schema}
        />
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 uppercase tracking-tight">
            Demande envoyée !
          </h1>
          <p className="text-white/60 text-base mb-8 leading-relaxed">
            Nous avons bien reçu votre demande. Notre équipe vous répondra dans les <strong className="text-white">24 heures</strong> ouvrées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setSubmitted(false)}
              className="bg-auto-red hover:bg-auto-red-dark text-white font-black"
            >
              Nouvelle demande
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact & Devis Gratuit — MyJantes | Rénovation Jantes Liévin"
        description="Contactez MyJantes pour un devis gratuit de rénovation, peinture ou soudure de jantes. Réponse sous 24h. Spécialiste jantes alliage à Liévin (62)."
        keywords="contact MyJantes, devis rénovation jantes, devis peinture jantes gratuit, jantes Liévin"
        canonicalPath="/contact"
        schema={schema}
      />

      {/* ─── HERO STRIP ──────────────────────────────────────────────── */}
      <div className="bg-auto-dark pt-32 pb-0">
        <div className="max-w-4xl mx-auto px-4 text-center pb-12">
          <span className="inline-flex items-center gap-2 bg-auto-red/20 border border-auto-red/30 text-auto-red text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-auto-red animate-pulse" />
            Liévin — Hauts-de-France
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tight leading-[0.95]" data-testid="heading-contact">
            {c("pages.contact.title", "Contact &")}
            <span className="block text-auto-red drop-shadow-[0_4px_30px_rgba(220,38,38,0.5)]">
              Devis
            </span>
          </h1>
          <p className="text-white/55 text-base max-w-xl mx-auto">
            {c("pages.contact.subtitle", "Une question ? Un devis ? Notre équipe vous répond sous 24h.")}
          </p>
        </div>

        {/* Contact info strip */}
        <div className="border-t border-white/5 bg-white/3">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/5">
              {[
                { icon: Phone, label: "Téléphone", value: phone, href: phoneHref },
                { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
                { icon: MapPin, label: "Adresse", value: "46 rue de la Convention, Liévin", href: "#" },
                { icon: Clock, label: "Horaires", value: `${hoursLine1} / ${hoursLine2}`, href: "#" },
              ].map(item => (
                <a key={item.label} href={item.href} className="flex flex-col items-center py-5 px-3 hover:bg-white/5 transition-colors group">
                  <item.icon className="w-4 h-4 text-auto-red mb-1.5" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">{item.label}</span>
                  <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors text-center leading-tight">{item.value}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SERVICES SELECTOR ───────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="bg-gray-50 border-b border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-auto-red font-black mb-2">Nos prestations</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
                Quelle prestation vous intéresse ?
              </h2>
              <p className="text-gray-400 text-sm mt-2">Cliquez sur une prestation pour pré-remplir votre formulaire de devis.</p>
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
                  {svc.badge && (
                    <span className={`inline-block mb-2.5 text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full ${
                      svc.badge === "Best-seller"
                        ? "bg-auto-red/10 text-auto-red"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {svc.badge}
                    </span>
                  )}
                  <p className={`font-black text-sm leading-tight mb-1 ${selectedService === svc.title ? "text-auto-red" : "text-gray-900"}`}>
                    {svc.title}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium leading-tight">{svc.price.includes("€") && !svc.price.startsWith("À partir de") ? `À partir de ${svc.price}` : svc.price}</p>
                </button>
              ))}
            </div>

            {selectedService && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-2 text-sm text-auto-red font-bold bg-auto-red/5 border border-auto-red/20 rounded-full px-5 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <strong>{selectedService}</strong> sélectionné — formulaire pré-rempli ci-dessous
                  <button type="button" onClick={() => form.setValue("service", "")} className="ml-1 text-auto-red/60 hover:text-auto-red">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── QUOTE FORM ───────────────────────────────────────────────── */}
      <div id="form" ref={formRef} className="bg-white py-12 sm:py-16 lg:py-20 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4">

          {/* Form header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-auto-red/8 border border-auto-red/20 text-auto-red text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
              <Send className="w-3 h-3" />
              Devis gratuit sans engagement
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight mb-3">
              {c("pages.contact.form_title", "Demandez votre devis gratuit")}
            </h2>
            <p className="text-gray-500 text-sm">
              {c("pages.contact.form_subtitle", "Réponse garantie sous 24h — Devis sans engagement")}
            </p>
            <p className="text-gray-400 text-xs mt-1">Ce devis est une estimation. Un diagnostic structuré sera établi à réception de vos jantes.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/80 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-auto-red via-red-500 to-auto-red-dark" />

            <div className="p-6 sm:p-8 lg:p-10">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                  className="space-y-6"
                  data-testid="form-contact"
                >
                  {/* Identity */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Vos coordonnées</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" data-testid="input-contact-name" className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors" {...field} />
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
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Prénom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" data-testid="input-contact-firstname" className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jean@example.com" data-testid="input-contact-email" className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors" {...field} />
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
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Téléphone *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="06 00 00 00 00" data-testid="input-contact-phone" className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Vehicle & service */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Votre véhicule & prestation</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vehicle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Véhicule</FormLabel>
                            <FormControl>
                              <Input placeholder="ex : BMW Série 3, Audi A4…" data-testid="input-contact-vehicle" className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors" {...field} />
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
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Prestation souhaitée</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-service" aria-label="Prestation souhaitée" className="h-11 rounded-xl border-gray-200 bg-gray-50">
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
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Request type & nb wheels */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Votre demande</p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="requestType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Objet de votre demande *</FormLabel>
                            <div className="space-y-2.5 mt-2">
                              {REQUEST_TYPES.map(rt => (
                                <label key={rt.value} className="flex items-start gap-3 cursor-pointer group p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                  <input
                                    type="radio"
                                    name="requestType"
                                    value={rt.value}
                                    checked={field.value === rt.value}
                                    onChange={() => field.onChange(rt.value)}
                                    className="mt-0.5 accent-red-600 w-4 h-4"
                                    data-testid={`radio-request-${rt.value}`}
                                  />
                                  <span className="text-sm text-gray-600 group-hover:text-gray-900 leading-tight">{rt.label}</span>
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
                            <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre de jantes</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-nb-wheels" aria-label="Nombre de jantes" className="h-11 rounded-xl border-gray-200 bg-gray-50">
                                  <SelectValue placeholder="Combien de jantes ?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["1", "2", "3", "4"].map(n => (
                                  <SelectItem key={n} value={n}>{n} jante{parseInt(n) > 1 ? "s" : ""}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100" />

                  {/* Photo upload */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Photo de vos jantes</p>
                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all bg-gray-50/50 ${form.formState.errors.imageUrl ? "border-red-400 bg-red-50/30" : "border-gray-200 hover:border-auto-red/40 hover:bg-red-50/20"}`}
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
                        <div className="flex items-center justify-center gap-3 text-gray-500 py-2">
                          <div className="w-5 h-5 border-2 border-auto-red border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm font-bold">Envoi en cours...</span>
                        </div>
                      ) : uploadedImage ? (
                        <div className="relative inline-block">
                          <img src={uploadedImage} className="max-h-40 mx-auto rounded-xl object-cover shadow-md" alt="Photo uploadée" />
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setUploadedImage(null); form.setValue("imageUrl", ""); setOcrResult(null); }}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-2">
                          <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500 font-medium">
                            Glissez et déposez ou <span className="text-auto-red font-bold">cliquez pour choisir</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, HEIC — Max 10 Mo</p>
                        </div>
                      )}
                    </div>

                    {uploadedImage && !ocrResult && (
                      <button
                        type="button"
                        onClick={() => setShowOcrConsent(true)}
                        disabled={ocrAnalyzing}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                        data-testid="button-ocr-analyze"
                      >
                        {ocrAnalyzing ? (
                          <><Loader2 className="w-4 h-4 animate-spin" />Analyse IA en cours...</>
                        ) : (
                          <><ScanSearch className="w-4 h-4" /><Sparkles className="w-3.5 h-3.5" />Analyser avec l'IA (carte grise / jante)</>
                        )}
                      </button>
                    )}

                    {form.formState.errors.imageUrl && (
                      <p className="mt-2 text-sm font-medium text-red-600" data-testid="error-image-required">
                        {form.formState.errors.imageUrl.message}
                      </p>
                    )}

                    {ocrResult && (
                      <div className="mt-3 bg-purple-50 border border-purple-200 rounded-2xl p-4" data-testid="ocr-results">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-black text-purple-700 uppercase tracking-wider">Résultat de l'analyse IA</span>
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

                  <div className="border-t border-gray-100" />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider">Informations complémentaires *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez l'état de vos jantes, le type de finition souhaitée, toute information utile pour votre devis…"
                            data-testid="input-contact-message"
                            className="min-h-[120px] rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Consent */}
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="mt-0.5 w-4 h-4 accent-red-600 rounded"
                              checked={field.value}
                              onChange={e => field.onChange(e.target.checked)}
                              data-testid="checkbox-consent"
                            />
                          </FormControl>
                          <span className="text-xs text-gray-500 leading-relaxed">
                            J'accepte que mes données personnelles soient utilisées pour traiter ma demande de devis. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression.
                          </span>
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-14 bg-auto-red hover:bg-auto-red-dark text-white font-black text-base uppercase tracking-wider rounded-xl shadow-lg shadow-auto-red/20 hover:shadow-auto-red/40 transition-all hover:-translate-y-0.5"
                    data-testid="button-submit-contact"
                  >
                    {mutation.isPending ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Envoi en cours...</>
                    ) : (
                      <><Send className="w-5 h-5 mr-2" />Envoyer ma demande de devis</>
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-400">
                    Réponse sous 24h · Devis gratuit sans engagement · Données protégées
                  </p>
                </form>
              </Form>
            </div>
          </div>

          {/* Quick contact strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <a href={phoneHref} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-auto-red/30 hover:bg-red-50/30 transition-all group" data-testid="link-phone">
              <div className="w-9 h-9 bg-auto-red/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-auto-red" />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Téléphone</p>
                <p className="font-bold text-gray-900 text-xs">{phone}</p>
              </div>
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-green-300 hover:bg-green-50/50 transition-all group" data-testid="link-whatsapp">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">WhatsApp</p>
                <p className="font-bold text-gray-900 text-xs">Envoyer un message</p>
              </div>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group sm:col-auto col-span-2" data-testid="link-email">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Email</p>
                <p className="font-bold text-gray-900 text-xs truncate">{email}</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ─── ESPACE CLIENT ────────────────────────────────────────────── */}
      <section className="relative bg-auto-dark overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-auto-red/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.08),transparent_70%)]" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div>
              <span className="inline-flex items-center gap-2 bg-auto-red/10 border border-auto-red/30 text-auto-red text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6">
                <Lock className="w-3 h-3" />
                {c("pages.contact.espace_client_badge", "Déjà client MyJantes ?")}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 uppercase leading-[0.95] tracking-tight">
                {c("pages.contact.espace_client_title", "Accédez à votre espace personnel")}
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-8 max-w-lg">
                {c("pages.contact.espace_client_subtitle", "Suivez vos jantes en temps réel, consultez vos devis et factures, prenez rendez-vous en ligne depuis votre espace client dédié.")}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {ESPACE_CLIENT_FEATURES.map(feature => (
                  <div key={feature.title} className="flex gap-3.5 bg-white/4 border border-white/8 rounded-2xl p-4 hover:bg-white/8 transition-colors">
                    <div className="w-9 h-9 bg-auto-red/10 border border-auto-red/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <feature.icon className="w-4.5 h-4.5 text-auto-red" />
                    </div>
                    <div>
                      <p className="font-black text-white text-sm mb-1">{feature.title}</p>
                      <p className="text-white/40 text-xs leading-snug">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={espaceClientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-espace-client"
                  className="inline-flex items-center justify-center gap-2 bg-auto-red hover:bg-auto-red-dark text-white font-black px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-auto-red/20 hover:shadow-auto-red/40 hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                >
                  <Smartphone className="w-4 h-4" />
                  {espaceClientCta}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 hover:text-white hover:bg-white/8 font-bold px-6 py-3.5 rounded-xl transition-all text-sm"
                >
                  Demander un devis
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-6 bg-gradient-to-br from-auto-red/15 to-transparent rounded-[3rem] blur-3xl" />
                <div className="relative bg-[#141414] border border-white/10 rounded-3xl p-7 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-auto-red rounded-full" />

                  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/8">
                    <div className="w-10 h-10 bg-auto-red/10 border border-auto-red/20 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-auto-red" />
                    </div>
                    <div>
                      <p className="font-black text-white text-sm">Espace Client MyJantes</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400/70 text-[10px] font-bold uppercase tracking-wider">Connecté</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { icon: Activity, label: "Ma prestation en cours", value: "En cabine de peinture", dot: "bg-auto-red animate-pulse" },
                      { icon: FileText, label: "Mon dernier devis", value: "Rénovation — 4 jantes", dot: "bg-green-500" },
                      { icon: Clock, label: "Prochain RDV", value: "Mer. 12 Mars, 10h00", dot: "bg-blue-400" },
                      { icon: Star, label: "Ma note", value: "⭐⭐⭐⭐⭐ 5/5", dot: "bg-amber-400" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 bg-white/4 border border-white/5 rounded-xl px-4 py-3">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                        <item.icon className="w-4 h-4 text-white/30 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-white/35 font-bold uppercase tracking-wider truncate">{item.label}</p>
                          <p className="text-xs font-bold text-white/80 truncate">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/8 text-center">
                    <p className="text-[10px] text-white/25 font-bold uppercase tracking-wider">{espaceClientUrl.replace(/^https?:\/\//, "")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </section>

      {/* OCR consent modal */}
      {showOcrConsent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base">Analyse IA de l'image</h3>
                <p className="text-xs text-gray-500">Consentement requis</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              En cliquant sur "Analyser", vous acceptez que votre image soit analysée par notre IA pour détecter automatiquement les informations de votre véhicule et vos jantes. Ces données restent confidentielles.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={runOcrAnalysis}
                disabled={ocrAnalyzing}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black"
              >
                {ocrAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyse...</> : "Analyser"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOcrConsent(false)}
                className="flex-1 border-gray-200 font-bold"
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
