import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  LogOut, Image, Star, HelpCircle, CheckCircle2,
  Clock, XCircle, Eye, Trash2, MessageSquare, LayoutDashboard,
  Lock, User, Plus, X, Phone,
  Edit2, Save, Wrench, FileText, Globe, Type, Settings, Monitor, Images,
  TrendingUp, Link2, MousePointerClick, Users, Activity,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { ContactRequest, GalleryItem, Testimonial, FaqItem, SiteService, SiteContent, MediaFile } from "@shared/schema";

type Tab = "dashboard" | "contacts" | "galerie" | "avis" | "faq" | "prestations" | "contenu" | "liens" | "medias";

const AVAILABLE_IMAGES = [
  { url: "/images/atelier-soudure.jpg", label: "Service Soudure" },
  { url: "/images/atelier-machines.jpg", label: "Atelier Machines" },
  { url: "/images/atelier-tour-cnc.jpg", label: "Tour CNC" },
  { url: "/images/jante-bleue.jpg", label: "Jante Bleue" },
  { url: "/images/jante-violette.jpg", label: "Jante Violette" },
  { url: "/images/jante-noire.jpg", label: "Jante Noire" },
  { url: "/images/jante-diamantage.jpg", label: "Diamantage VW" },
  { url: "/images/gallery-1.png", label: "Galerie 1" },
  { url: "/images/gallery-2.png", label: "Galerie 2" },
  { url: "/images/gallery-3.png", label: "Galerie 3" },
  { url: "/images/service-renovation.png", label: "Rénovation" },
  { url: "/images/service-peinture.png", label: "Peinture" },
  { url: "/images/service-redressage.png", label: "Redressage" },
  { url: "/images/before-after-1.png", label: "Avant/Après" },
  { url: "/images/logo-myjantes.png", label: "Logo" },
];

function ImagePicker({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);

  const select = (url: string) => { onChange(url); setManualUrl(url); setOpen(false); };

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex gap-2">
        <Input
          value={manualUrl}
          onChange={e => { setManualUrl(e.target.value); onChange(e.target.value); }}
          className="h-8 text-xs flex-grow"
          placeholder="/images/..."
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-3 h-8 border rounded text-xs bg-gray-50 hover:bg-gray-100 flex items-center gap-1 shrink-0"
        >
          <Images className="w-3 h-3" /> Médiathèque
        </button>
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <img src={value} className="h-12 w-20 object-cover rounded border" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <button onClick={() => select("")} className="text-xs text-red-500 hover:underline">Supprimer</button>
        </div>
      )}
      {open && (
        <div className="border rounded-xl bg-white shadow-lg p-3 mt-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Cliquez pour sélectionner</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {AVAILABLE_IMAGES.map(img => (
              <button
                key={img.url}
                type="button"
                onClick={() => select(img.url)}
                className={`relative group rounded overflow-hidden border-2 aspect-square ${value === img.url ? "border-auto-red" : "border-transparent hover:border-gray-300"}`}
                title={img.label}
              >
                <img src={img.url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end justify-center pb-1">
                  <span className="text-white text-[9px] font-semibold leading-tight text-center px-1">{img.label}</span>
                </div>
                {value === img.url && <div className="absolute top-1 right-1 w-3 h-3 bg-auto-red rounded-full" />}
              </button>
            ))}
          </div>
          <button onClick={() => setOpen(false)} className="mt-2 text-xs text-gray-400 hover:text-gray-600">Fermer</button>
        </div>
      )}
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (res.ok) { onLogin(); }
      else { const d = await res.json(); setError(d.message || "Identifiants invalides"); }
    } catch { setError("Erreur de connexion. Réessayez."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-auto-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-16 mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-2xl font-black text-white">Administration</h1>
          <p className="text-white/40 text-sm mt-1">Accès réservé — MyJantes</p>
        </div>
        <Card className="border border-white/10 bg-white/5">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input type="email" value={username} onChange={e => setUsername(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30" required />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30" required />
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-auto-red text-white border-0 font-black h-12" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  nouveau: { label: "Nouveau", color: "bg-blue-100 text-blue-700", icon: Clock },
  en_cours: { label: "En cours", color: "bg-amber-100 text-amber-700", icon: Eye },
  traite: { label: "Traité", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  annule: { label: "Annulé", color: "bg-gray-100 text-gray-500", icon: XCircle },
};

const AVAILABLE_FONTS = [
  "Eurostile Extended",
  "Montserrat", "Open Sans", "Poppins", "Raleway", "Inter", "Roboto",
  "Lato", "Nunito", "Oswald", "Playfair Display", "Bebas Neue", "Quicksand", "Rubik", "Work Sans",
];

const COLOR_PRESETS = [
  { value: "red", preview: "#dc2626", label: "Rouge" },
  { value: "blue", preview: "#3b82f6", label: "Bleu" },
  { value: "green", preview: "#16a34a", label: "Vert" },
  { value: "orange", preview: "#f97316", label: "Orange" },
  { value: "purple", preview: "#8b5cf6", label: "Violet" },
  { value: "pink", preview: "#ec4899", label: "Rose" },
  { value: "teal", preview: "#14b8a6", label: "Turquoise" },
  { value: "gold", preview: "#eab308", label: "Or" },
];

const LOGO_SIZES = [
  { value: "sm", label: "Petit (48px)" }, { value: "md", label: "Moyen (64px)" },
  { value: "lg", label: "Grand (80px)" }, { value: "xl", label: "Très grand (96px)" },
];

type FieldType = "font-select" | "color-select" | "logo-size-select" | "image-picker" | undefined;
const CONTENT_FIELDS: { key: string; label: string; category: string; multiline?: boolean; type?: FieldType }[] = [
  { key: "header.logo_url", label: "URL du logo", category: "header", type: "image-picker" },
  { key: "header.logo_size", label: "Taille du logo", category: "header", type: "logo-size-select" },
  { key: "theme.color", label: "Couleur principale", category: "theme", type: "color-select" },
  { key: "typography.font", label: "Police d'écriture (corps du texte)", category: "typography", type: "font-select" },
  { key: "typography.heading_font", label: "Police des titres (H1, H2, H3...)", category: "typography", type: "font-select" },
  { key: "hero.badge", label: "Badge hero", category: "hero" },
  { key: "hero.title_line1", label: "Titre hero — ligne 1", category: "hero" },
  { key: "hero.title_line2", label: "Titre hero — ligne 2 (accent)", category: "hero" },
  { key: "hero.subtitle", label: "Sous-titre hero", category: "hero", multiline: true },
  { key: "hero.cta_primary", label: "Bouton principal (devis)", category: "hero" },
  { key: "hero.cta_gallery", label: "Bouton galerie", category: "hero" },
  { key: "hero.bg_video", label: "Vidéo fond hero (MP4) — laisser vide pour image", category: "hero" },
  { key: "hero.bg_image", label: "Image fond hero", category: "hero", type: "image-picker" },
  { key: "sections.workshop.media", label: "Image/Vidéo — Section Atelier", category: "sections", type: "image-picker" },
  { key: "contact.phone", label: "Numéro de téléphone", category: "contact" },
  { key: "contact.phone_href", label: "Lien téléphone (tel:+33...)", category: "contact" },
  { key: "contact.whatsapp_number", label: "Numéro WhatsApp", category: "contact" },
  { key: "contact.whatsapp_href", label: "Lien WhatsApp complet", category: "contact" },
  { key: "contact.address", label: "Adresse de l'atelier", category: "contact" },
  { key: "contact.email", label: "Email de contact", category: "contact" },
  { key: "sections.process.title", label: "Titre — Section processus", category: "sections" },
  { key: "sections.process.subtitle", label: "Sous-titre — Section processus", category: "sections" },
  { key: "sections.process.items", label: "Étapes du processus (JSON)", category: "sections", multiline: true },
  { key: "sections.services.title", label: "Titre — Section prestations", category: "sections" },
  { key: "sections.services.subtitle", label: "Sous-titre — Section prestations", category: "sections" },
  { key: "sections.gallery.title", label: "Titre — Section galerie", category: "sections" },
  { key: "sections.gallery.subtitle", label: "Sous-titre — Section galerie", category: "sections" },
  { key: "sections.testimonials.title", label: "Titre — Section avis", category: "sections" },
  { key: "sections.whyus.title", label: "Titre — Section avantages", category: "sections" },
  { key: "sections.whyus.items", label: "Avantages (JSON)", category: "sections", multiline: true },
  { key: "pages.services.badge", label: "Badge — Page Services", category: "pages" },
  { key: "pages.gallery.badge", label: "Badge — Page Galerie", category: "pages" },
  { key: "pages.faq.badge", label: "Badge — Page FAQ", category: "pages" },
  { key: "pages.about.badge", label: "Badge — Page À propos (ex : Depuis 2022)", category: "pages" },
  { key: "pages.about.experience", label: "Années d'expérience (ex : 4+ Ans)", category: "pages" },
  { key: "pages.about.hero_title_line1", label: "Titre À propos — ligne 1", category: "pages" },
  { key: "pages.about.hero_title_line2", label: "Titre À propos — ligne 2 (accent)", category: "pages" },
  { key: "pages.about.hero_subtitle", label: "Sous-titre À propos", category: "pages" },
  { key: "pages.about.story_title", label: "Titre section histoire", category: "pages" },
  { key: "pages.about.story_content", label: "Texte section histoire", category: "pages", multiline: true },
  { key: "pages.about.values_title", label: "Titre section valeurs", category: "pages" },
  { key: "pages.about.value1_title", label: "Valeur 1 — Titre", category: "pages" },
  { key: "pages.about.value1_desc", label: "Valeur 1 — Description", category: "pages", multiline: true },
  { key: "pages.about.value2_title", label: "Valeur 2 — Titre", category: "pages" },
  { key: "pages.about.value2_desc", label: "Valeur 2 — Description", category: "pages", multiline: true },
  { key: "pages.about.value3_title", label: "Valeur 3 — Titre", category: "pages" },
  { key: "pages.about.value3_desc", label: "Valeur 3 — Description", category: "pages", multiline: true },
  { key: "pages.about.commitments_title", label: "Titre section engagements", category: "pages" },
  { key: "pages.about.commitment1", label: "Engagement 1", category: "pages" },
  { key: "pages.about.commitment2", label: "Engagement 2", category: "pages" },
  { key: "pages.about.commitment3", label: "Engagement 3", category: "pages" },
  { key: "pages.about.commitment4", label: "Engagement 4", category: "pages" },
  { key: "pages.about.stat1_value", label: "Stat 1 — Chiffre (ex : 5 000+)", category: "pages" },
  { key: "pages.about.stat1_label", label: "Stat 1 — Label", category: "pages" },
  { key: "pages.about.stat2_value", label: "Stat 2 — Chiffre (ex : 98%)", category: "pages" },
  { key: "pages.about.stat2_label", label: "Stat 2 — Label", category: "pages" },
  { key: "pages.about.image", label: "Image — Page À propos", category: "pages", type: "image-picker" },
  { key: "pages.guarantees.title", label: "Titre — Page Garanties", category: "pages" },
  { key: "pages.guarantees.content", label: "Contenu — Page Garanties", category: "pages", multiline: true },
  { key: "pages.contact.title", label: "Titre — Page Contact", category: "pages" },
  { key: "pages.contact.subtitle", label: "Sous-titre — Page Contact", category: "pages" },
  { key: "trust_item_1", label: "Bande de confiance — Item 1", category: "trust" },
  { key: "trust_item_2", label: "Bande de confiance — Item 2", category: "trust" },
  { key: "trust_item_3", label: "Bande de confiance — Item 3", category: "trust" },
  { key: "trust_item_4", label: "Bande de confiance — Item 4", category: "trust" },
  { key: "trust_item_5", label: "Bande de confiance — Item 5", category: "trust" },
  { key: "legal.owner", label: "Raison sociale (ex : SAS MY JANTES)", category: "legal" },
  { key: "legal.siren", label: "SIREN", category: "legal" },
  { key: "legal.responsible", label: "Responsable de publication", category: "legal" },
  { key: "legal.host", label: "Hébergeur", category: "legal" },
  { key: "legal.host_address", label: "Adresse hébergeur", category: "legal" },
  { key: "legal.cgu", label: "CGU — Texte", category: "legal", multiline: true },
  { key: "legal.services_desc", label: "Description des services — Texte", category: "legal", multiline: true },
  { key: "legal.liability", label: "Limitations de responsabilité — Texte", category: "legal", multiline: true },
  { key: "legal.intellectual_property", label: "Propriété intellectuelle — Texte", category: "legal", multiline: true },
  { key: "legal.gdpr", label: "Données personnelles (RGPD) — Texte", category: "legal", multiline: true },
  { key: "privacy.collection", label: "Politique confidentialité — Collecte", category: "legal", multiline: true },
  { key: "privacy.usage", label: "Politique confidentialité — Utilisation", category: "legal", multiline: true },
  { key: "privacy.protection", label: "Politique confidentialité — Protection", category: "legal", multiline: true },
  { key: "privacy.cookies", label: "Politique confidentialité — Cookies", category: "legal", multiline: true },
  { key: "privacy.rights", label: "Politique confidentialité — Droits", category: "legal", multiline: true },
  { key: "footer.tagline", label: "Slogan footer", category: "footer" },
  { key: "footer.hours_line1", label: "Horaires ligne 1", category: "footer" },
  { key: "footer.hours_line2", label: "Horaires ligne 2", category: "footer" },
  { key: "footer.hours_short", label: "Horaires courts", category: "footer" },
  { key: "footer.social_instagram", label: "Lien Instagram", category: "footer" },
  { key: "footer.social_facebook", label: "Lien Facebook", category: "footer" },
  { key: "footer.social_snapchat", label: "Lien Snapchat", category: "footer" },
  { key: "footer.social_tiktok", label: "Lien TikTok", category: "footer" },
  { key: "footer.social_google", label: "Lien avis Google", category: "footer" },
];

const CATEGORY_LABELS: Record<string, string> = {
  header: "Header & Logo", theme: "Couleur du site", typography: "Typographie",
  nav: "Navigation (liens du menu)", hero: "Section Hero (fond, textes, boutons)",
  contact: "Coordonnées & Contact", sections: "Titres des sections",
  trust: "Bande de confiance", pages: "Contenu des pages",
  legal: "Mentions légales & Confidentialité", footer: "Footer & Réseaux sociaux",
};

function FeatureListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const add = () => onChange([...value, ""]);
  const update = (i: number, v: string) => { const n = [...value]; n[i] = v; onChange(n); };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {value.map((feat, i) => (
        <div key={i} className="flex gap-2">
          <Input value={feat} onChange={e => update(i, e.target.value)} className="h-8 text-sm flex-grow" placeholder={`Caractéristique ${i + 1}`} />
          <button onClick={() => remove(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-auto-red font-semibold flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Ajouter</button>
    </div>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const { toast } = useToast();
  const qc = useQueryClient();

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showAddGallery, setShowAddGallery] = useState(false);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [galleryForm, setGalleryForm] = useState({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" });
  const [testimonialForm, setTestimonialForm] = useState({ name: "", location: "", rating: 5, content: "", vehicle: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "general", sortOrder: 0 });
  const defaultServiceForm = { title: "", description: "", image: "/images/service-renovation.png", badge: "", features: [] as string[], price: "", slug: "", sortOrder: 0, published: true };
  const [serviceForm, setServiceForm] = useState(defaultServiceForm);
  const [contentEdits, setContentEdits] = useState<Record<string, string>>({});
  const [savingContent, setSavingContent] = useState<Record<string, boolean>>({});
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setAuthenticated(data.authenticated);
      return data;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => { setAuthenticated(false); setLocation("/"); },
  });

  const { data: contacts = [] } = useQuery<ContactRequest[]>({ queryKey: ["/api/admin/contacts"], enabled: authenticated === true });
  const { data: gallery = [] } = useQuery<GalleryItem[]>({ queryKey: ["/api/admin/gallery"], enabled: authenticated === true });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/admin/testimonials"], enabled: authenticated === true });
  const { data: faqItems = [] } = useQuery<FaqItem[]>({ queryKey: ["/api/admin/faq"], enabled: authenticated === true });
  const { data: siteServices = [] } = useQuery<SiteService[]>({ queryKey: ["/api/admin/services"], enabled: authenticated === true });
  const { data: siteContentItems = [] } = useQuery<SiteContent[]>({ queryKey: ["/api/admin/site-content"], enabled: authenticated === true });
  const { data: mediaFiles = [] } = useQuery<MediaFile[]>({ queryKey: ["/api/admin/media"], enabled: authenticated === true });
  const { data: analytics } = useQuery<{
    totalViews: number; viewsByPage: { path: string; views: number }[];
    viewsByDay: { date: string; views: number }[]; recentViews: { path: string; createdAt: string }[];
    totalContacts: number; newContacts: number; pendingContacts: number; treatedContacts: number;
    totalGallery: number; totalTestimonials: number; totalServices: number; totalFaq: number;
  }>({ queryKey: ["/api/admin/analytics"], enabled: authenticated === true });

  const contentMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const item of siteContentItems) m[item.key] = item.value;
    return m;
  }, [siteContentItems]);

  const getVal = (key: string) => contentEdits[key] !== undefined ? contentEdits[key] : (contentMap[key] ?? "");

  const updateContactStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiRequest("PATCH", `/api/admin/contacts/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }),
  });
  const deleteContact = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/contacts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }),
  });

  const emptyGallery = { title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" };
  const createGallery = useMutation({
    mutationFn: (data: typeof galleryForm) => apiRequest("POST", "/api/admin/gallery", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); setShowAddGallery(false); setGalleryForm(emptyGallery); toast({ title: "Réalisation ajoutée" }); },
  });
  const updateGallery = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof galleryForm }) => apiRequest("PUT", `/api/admin/gallery/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); setEditingGalleryId(null); setGalleryForm(emptyGallery); toast({ title: "Réalisation mise à jour" }); },
  });
  const deleteGallery = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); toast({ title: "Supprimé" }); },
  });
  const toggleGallery = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => apiRequest("PUT", `/api/admin/gallery/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }),
  });

  const createTestimonial = useMutation({
    mutationFn: (data: typeof testimonialForm) => apiRequest("POST", "/api/admin/testimonials", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); setShowAddTestimonial(false); setTestimonialForm({ name: "", location: "", rating: 5, content: "", vehicle: "" }); toast({ title: "Avis ajouté" }); },
  });
  const updateTestimonial = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof testimonialForm }) => apiRequest("PUT", `/api/admin/testimonials/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); setEditingTestimonialId(null); toast({ title: "Mis à jour" }); },
  });
  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }),
  });
  const toggleTestimonial = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => apiRequest("PUT", `/api/admin/testimonials/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }),
  });

  const createFaq = useMutation({
    mutationFn: (data: typeof faqForm) => apiRequest("POST", "/api/admin/faq", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); setShowAddFaq(false); setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 }); toast({ title: "FAQ ajoutée" }); },
  });
  const deleteFaq = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/faq/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }),
  });
  const toggleFaq = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => apiRequest("PUT", `/api/admin/faq/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }),
  });

  const createService = useMutation({
    mutationFn: (data: typeof defaultServiceForm) => apiRequest("POST", "/api/admin/services", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); setShowAddService(false); setServiceForm(defaultServiceForm); toast({ title: "Prestation ajoutée" }); },
  });
  const updateService = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof defaultServiceForm }) => apiRequest("PUT", `/api/admin/services/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); setEditingServiceId(null); setServiceForm(defaultServiceForm); toast({ title: "Prestation mise à jour" }); },
  });
  const deleteService = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/services/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); toast({ title: "Supprimée" }); },
  });
  const toggleService = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => apiRequest("PUT", `/api/admin/services/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/services"] }),
  });

  const saveContent = async (key: string) => {
    setSavingContent(p => ({ ...p, [key]: true }));
    try {
      await apiRequest("PATCH", `/api/admin/site-content/${key}`, { value: contentEdits[key] });
      qc.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      const next = { ...contentEdits }; delete next[key]; setContentEdits(next);
      toast({ title: "Sauvegardé ✓" });
    } catch { toast({ title: "Erreur", variant: "destructive" }); }
    finally { setSavingContent(p => ({ ...p, [key]: false })); }
  };

  const startEditGallery = (g: GalleryItem) => {
    setEditingGalleryId(g.id);
    setGalleryForm({ title: g.title, serviceType: g.serviceType, afterImage: g.afterImage, beforeImage: g.beforeImage || "", description: g.description || "" });
    setShowAddGallery(false);
  };
  const startEditService = (s: SiteService) => { setEditingServiceId(s.id); setServiceForm({ ...s, features: s.features as string[] }); setShowAddService(false); };
  const cancelEditService = () => { setEditingServiceId(null); setServiceForm(defaultServiceForm); };
  const cancelEditGallery = () => { setEditingGalleryId(null); setGalleryForm(emptyGallery); };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteMedia = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/media/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/media"] }); toast({ title: "Fichier supprimé" }); },
  });

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (res.ok) { successCount++; }
        else { errorCount++; }
      } catch { errorCount++; }
    }

    qc.invalidateQueries({ queryKey: ["/api/admin/media"] });
    if (successCount > 0) toast({ title: `${successCount} fichier(s) ajouté(s)` });
    if (errorCount > 0) toast({ title: `${errorCount} fichier(s) en erreur`, variant: "destructive" });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (authenticated === null) return <div className="min-h-screen bg-auto-dark flex items-center justify-center"><div className="w-8 h-8 border-2 border-auto-red border-t-transparent rounded-full animate-spin" /></div>;
  if (authenticated === false) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: TrendingUp },
    { id: "contacts", label: "Contacts", icon: MessageSquare, badge: contacts.filter(c => c.status === "nouveau").length },
    { id: "galerie", label: "Réalisations", icon: Image },
    { id: "prestations", label: "Prestations", icon: Wrench },
    { id: "avis", label: "Avis", icon: Star },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contenu", label: "Contenu", icon: Settings },
    { id: "liens", label: "Liens & Navigation", icon: Link2 },
    { id: "medias", label: "Médiathèque", icon: Images },
  ];

  const contentCategories = Array.from(new Set(CONTENT_FIELDS.map(f => f.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-auto-dark border-b border-white/10 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-8 brightness-0 invert" />
            <div className="flex items-center gap-2 text-white/60 text-sm"><LayoutDashboard className="w-4 h-4" /> Administration</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}><LogOut className="w-3.5 h-3.5 mr-1.5" /> Déconnexion</Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-1.5 flex-wrap mb-6 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${tab === t.id ? "bg-auto-red text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}>
              <t.icon className="w-3.5 h-3.5" />{t.label}
              {(t.badge ?? 0) > 0 && <span className={`px-1.5 rounded-full text-[10px] font-black ${tab === t.id ? "bg-white/30 text-white" : "bg-auto-red text-white"}`}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "Vues totales", value: analytics?.totalViews ?? 0, icon: Eye, color: "bg-blue-50 text-blue-600" },
                { label: "Contacts reçus", value: analytics?.totalContacts ?? 0, icon: MessageSquare, color: "bg-purple-50 text-purple-600" },
                { label: "Nouveaux contacts", value: analytics?.newContacts ?? 0, icon: Activity, color: "bg-red-50 text-auto-red", highlight: (analytics?.newContacts ?? 0) > 0 },
                { label: "Réalisations", value: analytics?.totalGallery ?? 0, icon: Image, color: "bg-green-50 text-green-600" },
                { label: "Avis publiés", value: analytics?.totalTestimonials ?? 0, icon: Star, color: "bg-yellow-50 text-yellow-600" },
              ].map((kpi, i) => (
                <Card key={i} className={`border-0 shadow-sm ${kpi.highlight ? "ring-2 ring-auto-red" : ""}`}>
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}>
                      <kpi.icon className="w-5 h-5" />
                    </div>
                    <p className="text-3xl font-black text-gray-900">{kpi.value.toLocaleString("fr-FR")}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">{kpi.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Second row: contact status breakdown + content counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "En attente", value: analytics?.newContacts ?? 0, color: "bg-orange-50 text-orange-600" },
                { label: "En cours", value: analytics?.pendingContacts ?? 0, color: "bg-blue-50 text-blue-600" },
                { label: "Traités", value: analytics?.treatedContacts ?? 0, color: "bg-green-50 text-green-600" },
                { label: "Prestations actives", value: analytics?.totalServices ?? 0, color: "bg-gray-50 text-gray-600" },
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <span className="text-sm font-black">{item.value}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Évolution des visites (30 jours) */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-auto-red" /> Visites — 30 derniers jours</h3>
                  {(analytics?.viewsByDay?.length ?? 0) === 0 ? (
                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune donnée de visite disponible</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={analytics?.viewsByDay ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v) => [v, "Visites"]} labelFormatter={l => `Date: ${l}`} />
                        <Line type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Top pages visitées */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-auto-red" /> Pages les plus visitées</h3>
                  {(analytics?.viewsByPage?.length ?? 0) === 0 ? (
                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Aucune donnée disponible</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analytics?.viewsByPage?.slice(0, 8) ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="path" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v) => [v, "Visites"]} />
                        <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                          {(analytics?.viewsByPage?.slice(0, 8) ?? []).map((_, idx) => (
                            <Cell key={idx} fill={idx === 0 ? "#dc2626" : "#f87171"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Derniers contacts reçus */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-auto-red" /> Derniers contacts reçus</h3>
                {contacts.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Aucun contact pour l'instant</p>
                ) : (
                  <div className="space-y-2">
                    {contacts.slice(0, 5).map(c => (
                      <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-gray-900 truncate">{c.name}</p>
                          <p className="text-xs text-gray-500 truncate">{c.email} {c.phone && `· ${c.phone}`}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig[c.status]?.color || "bg-gray-100"}`}>{statusConfig[c.status]?.label || c.status}</span>
                          <button onClick={() => setTab("contacts")} className="text-[10px] text-auto-red font-semibold hover:underline">Voir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {contacts.length > 5 && (
                  <button onClick={() => setTab("contacts")} className="mt-3 text-xs text-auto-red font-semibold hover:underline w-full text-center">
                    Voir tous les contacts ({contacts.length}) →
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── CONTACTS ── */}
        {tab === "contacts" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium">{contacts.length} demande(s) de contact</p>
            {contacts.length === 0 && <Card><CardContent className="p-8 text-center text-gray-400">Aucun contact pour l'instant</CardContent></Card>}
            {contacts.map(c => (
              <Card key={c.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{c.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig[c.status]?.color || "bg-gray-100"}`}>{statusConfig[c.status]?.label || c.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{c.email} {c.phone && `· ${c.phone}`}</p>
                      {c.vehicle && <p className="text-xs text-gray-500">Véhicule: {c.vehicle}</p>}
                      <p className="text-sm mt-2 text-gray-700 whitespace-pre-wrap">{c.message}</p>
                      <p className="text-[10px] text-gray-400 mt-2">{new Date(c.createdAt!).toLocaleString("fr-FR")}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <select value={c.status} onChange={e => updateContactStatus.mutate({ id: c.id, status: e.target.value })} className="text-xs border rounded-lg p-1.5 bg-white">
                        {Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                      </select>
                      <button onClick={() => confirm("Supprimer ce contact ?") && deleteContact.mutate(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── GALERIE / RÉALISATIONS ── */}
        {tab === "galerie" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{gallery.length} réalisation(s)</p>
              <Button size="sm" onClick={() => { setShowAddGallery(!showAddGallery); cancelEditGallery(); }}>
                {showAddGallery ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter une réalisation</>}
              </Button>
            </div>

            {(showAddGallery || editingGalleryId) && (
              <Card className="mb-6 border-auto-red/20"><CardContent className="p-6">
                <h3 className="font-bold mb-4">{editingGalleryId ? "Modifier la réalisation" : "Nouvelle réalisation"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-medium">Titre</label>
                    <Input value={galleryForm.title} onChange={e => setGalleryForm(p => ({ ...p, title: e.target.value }))} className="mt-1" placeholder="Ex: Jante BMW noire brillante" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Type de prestation</label>
                    <select value={galleryForm.serviceType} onChange={e => setGalleryForm(p => ({ ...p, serviceType: e.target.value }))} className="mt-1 w-full h-9 border rounded-lg px-3 text-sm bg-white">
                      <option value="renovation">Rénovation</option>
                      <option value="peinture">Peinture / Personnalisation</option>
                      <option value="soudure">Soudure</option>
                      <option value="devoilage">Devoilage</option>
                      <option value="sablage">Sablage</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs font-medium">Description</label>
                  <Textarea value={galleryForm.description} onChange={e => setGalleryForm(p => ({ ...p, description: e.target.value }))} className="mt-1" rows={2} placeholder="Description de la réalisation..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <ImagePicker label="Image Après (principale)" value={galleryForm.afterImage} onChange={url => setGalleryForm(p => ({ ...p, afterImage: url }))} />
                  <ImagePicker label="Image Avant (optionnel)" value={galleryForm.beforeImage} onChange={url => setGalleryForm(p => ({ ...p, beforeImage: url }))} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => editingGalleryId ? updateGallery.mutate({ id: editingGalleryId, data: galleryForm }) : createGallery.mutate(galleryForm)} className="bg-auto-red text-white border-0">
                    {editingGalleryId ? "Enregistrer" : "Ajouter"}
                  </Button>
                  <Button variant="outline" onClick={cancelEditGallery}>Annuler</Button>
                </div>
              </CardContent></Card>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(g => (
                <Card key={g.id} className={`overflow-hidden border-0 shadow-sm ${!g.published ? "opacity-50" : ""}`}>
                  <div className="relative aspect-square">
                    <img src={g.afterImage} className="w-full h-full object-cover" alt={g.title} />
                    {g.beforeImage && <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">Avant/Après</div>}
                    <div className="absolute top-1 right-1 text-[9px] bg-white/90 text-gray-700 px-1.5 py-0.5 rounded font-semibold capitalize">{g.serviceType}</div>
                  </div>
                  <CardContent className="p-2.5">
                    <p className="text-xs font-semibold truncate mb-2">{g.title}</p>
                    <div className="flex gap-1">
                      <button onClick={() => startEditGallery(g)} className="flex-1 py-1 border rounded text-[10px] font-semibold hover:bg-gray-50 flex items-center justify-center gap-0.5"><Edit2 className="w-3 h-3" /> Modifier</button>
                      <button onClick={() => toggleGallery.mutate({ id: g.id, published: !g.published })} className={`p-1.5 border rounded ${g.published ? "bg-green-50 text-green-700" : "text-gray-400"}`}><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => confirm("Supprimer ?") && deleteGallery.mutate(g.id)} className="p-1.5 border rounded bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── PRESTATIONS ── */}
        {tab === "prestations" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{siteServices.length} prestation(s)</p>
              <Button size="sm" onClick={() => { setShowAddService(!showAddService); cancelEditService(); }}>
                {showAddService ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter</>}
              </Button>
            </div>

            {(showAddService || editingServiceId) && (
              <Card className="mb-6 border-auto-red/20"><CardContent className="p-6">
                <h3 className="font-bold mb-4">{editingServiceId ? "Modifier la prestation" : "Nouvelle prestation"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs font-medium">Titre</label><Input value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))} className="mt-1" /></div>
                  <div><label className="text-xs font-medium">Badge</label><Input value={serviceForm.badge} onChange={e => setServiceForm(p => ({ ...p, badge: e.target.value }))} className="mt-1" placeholder="Best-seller, Nouveau..." /></div>
                </div>
                <div className="mb-4"><label className="text-xs font-medium">Description</label><Textarea value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} className="mt-1" rows={2} /></div>
                <div className="mb-4">
                  <label className="text-xs font-medium block mb-1">Prix <span className="text-auto-red font-bold">(affiché sur le site)</span></label>
                  <Input value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} className="max-w-xs" placeholder="À partir de 120€/jante" />
                </div>
                <div className="mb-4"><label className="text-xs font-medium">Caractéristiques</label><div className="mt-1"><FeatureListEditor value={serviceForm.features} onChange={v => setServiceForm(p => ({ ...p, features: v }))} /></div></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs font-medium">Slug (URL)</label><Input value={serviceForm.slug} onChange={e => setServiceForm(p => ({ ...p, slug: e.target.value }))} className="mt-1" placeholder="renovation-jantes" /></div>
                  <div><label className="text-xs font-medium">Ordre</label><Input type="number" value={serviceForm.sortOrder} onChange={e => setServiceForm(p => ({ ...p, sortOrder: +e.target.value }))} className="mt-1" /></div>
                </div>
                <div className="mb-4"><ImagePicker label="Image de la prestation" value={serviceForm.image} onChange={url => setServiceForm(p => ({ ...p, image: url }))} /></div>
                <div className="flex gap-2">
                  <Button onClick={() => editingServiceId ? updateService.mutate({ id: editingServiceId, data: serviceForm }) : createService.mutate(serviceForm)} className="bg-auto-red text-white border-0">
                    {editingServiceId ? "Enregistrer" : "Ajouter"}
                  </Button>
                  {editingServiceId && <Button variant="outline" onClick={cancelEditService}>Annuler</Button>}
                </div>
              </CardContent></Card>
            )}

            <div className="space-y-3">
              {siteServices.map(s => (
                <Card key={s.id} className={`border-0 shadow-sm ${!s.published ? "opacity-60" : ""}`}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <img src={s.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border" />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{s.title}</h3>
                        {s.badge && <span className="text-[10px] bg-auto-red/10 text-auto-red px-2 py-0.5 rounded-full font-semibold">{s.badge}</span>}
                      </div>
                      <p className="text-sm font-semibold text-auto-red mt-0.5">{s.price}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{s.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEditService(s)} className="p-2 border rounded-lg hover:bg-gray-50"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => toggleService.mutate({ id: s.id, published: !s.published })} className={`p-2 border rounded-lg ${s.published ? "bg-green-50 text-green-700" : "text-gray-400"}`}><Eye className="w-4 h-4" /></button>
                      <button onClick={() => confirm("Supprimer cette prestation ?") && deleteService.mutate(s.id)} className="p-2 border rounded-lg bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── AVIS ── */}
        {tab === "avis" && (
          <div className="space-y-3">
            <Button size="sm" onClick={() => setShowAddTestimonial(!showAddTestimonial)}>
              {showAddTestimonial ? "Annuler" : <><Plus className="w-4 h-4 mr-1" /> Ajouter un avis</>}
            </Button>
            {showAddTestimonial && (
              <Card><CardContent className="p-6 space-y-3">
                <Input placeholder="Nom" value={testimonialForm.name} onChange={e => setTestimonialForm(p => ({ ...p, name: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Ville" value={testimonialForm.location} onChange={e => setTestimonialForm(p => ({ ...p, location: e.target.value }))} />
                  <Input placeholder="Véhicule" value={testimonialForm.vehicle} onChange={e => setTestimonialForm(p => ({ ...p, vehicle: e.target.value }))} />
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-xs">Note:</label>
                  {[1,2,3,4,5].map(n => <button key={n} onClick={() => setTestimonialForm(p => ({ ...p, rating: n }))} className={`text-lg ${testimonialForm.rating >= n ? "text-amber-400" : "text-gray-300"}`}>★</button>)}
                </div>
                <Textarea placeholder="Commentaire" value={testimonialForm.content} onChange={e => setTestimonialForm(p => ({ ...p, content: e.target.value }))} rows={3} />
                <Button onClick={() => createTestimonial.mutate(testimonialForm)} className="bg-auto-red text-white border-0">Ajouter</Button>
              </CardContent></Card>
            )}
            {testimonials.map(t => (
              <Card key={t.id} className={`border-0 shadow-sm ${!t.published ? "opacity-60" : ""}`}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-bold">{t.name}</span><span className="text-xs text-gray-500">{t.location}</span></div>
                    <p className="text-amber-400 text-sm">{"★".repeat(t.rating)}</p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{t.content}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleTestimonial.mutate({ id: t.id, published: !t.published })} className={`p-2 border rounded-lg ${t.published ? "bg-green-50 text-green-700" : "text-gray-400"}`}><Eye className="w-4 h-4" /></button>
                    <button onClick={() => confirm("Supprimer ?") && deleteTestimonial.mutate(t.id)} className="p-2 border rounded-lg bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── FAQ ── */}
        {tab === "faq" && (
          <div className="space-y-3">
            <Button size="sm" onClick={() => setShowAddFaq(!showAddFaq)}>
              {showAddFaq ? "Annuler" : <><Plus className="w-4 h-4 mr-1" /> Ajouter une FAQ</>}
            </Button>
            {showAddFaq && (
              <Card><CardContent className="p-6 space-y-3">
                <Input placeholder="Question" value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))} />
                <Textarea placeholder="Réponse" value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} rows={3} />
                <Button onClick={() => createFaq.mutate(faqForm)} className="bg-auto-red text-white border-0">Ajouter</Button>
              </CardContent></Card>
            )}
            {faqItems.map(f => (
              <Card key={f.id} className={`border-0 shadow-sm ${!f.published ? "opacity-60" : ""}`}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <p className="font-semibold text-sm">{f.question}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{f.answer}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleFaq.mutate({ id: f.id, published: !f.published })} className={`p-2 border rounded-lg ${f.published ? "bg-green-50 text-green-700" : "text-gray-400"}`}><Eye className="w-4 h-4" /></button>
                    <button onClick={() => confirm("Supprimer ?") && deleteFaq.mutate(f.id)} className="p-2 border rounded-lg bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── CONTENU DU SITE ── */}
        {tab === "contenu" && (
          <div className="space-y-6">
            {contentCategories.map(category => {
              const fields = CONTENT_FIELDS.filter(f => f.category === category);
              return (
                <Card key={category} className="border-0 shadow-sm"><CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b">
                    {category === "header" && <Image className="w-4 h-4 text-auto-red" />}
                    {category === "theme" && <Settings className="w-4 h-4 text-amber-600" />}
                    {category === "hero" && <Globe className="w-4 h-4 text-auto-red" />}
                    {category === "typography" && <Type className="w-4 h-4 text-purple-600" />}
                    {category === "contact" && <Phone className="w-4 h-4 text-blue-600" />}
                    {category === "sections" && <FileText className="w-4 h-4 text-gray-600" />}
                    {category === "pages" && <Monitor className="w-4 h-4 text-indigo-600" />}
                    {category === "footer" && <Globe className="w-4 h-4 text-green-600" />}
                    {CATEGORY_LABELS[category] || category}
                  </h3>
                  <div className="space-y-5">
                    {fields.map(field => {
                      const currentVal = getVal(field.key);
                      const isDirty = contentEdits[field.key] !== undefined && contentEdits[field.key] !== contentMap[field.key];
                      return (
                        <div key={field.key}>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-semibold text-gray-700">{field.label}</label>
                            {isDirty && (
                              <Button size="sm" onClick={() => saveContent(field.key)} disabled={savingContent[field.key]} className="h-6 text-[10px] bg-auto-red text-white border-0 px-2">
                                <Save className="w-3 h-3 mr-1" />{savingContent[field.key] ? "..." : "Sauver"}
                              </Button>
                            )}
                          </div>
                          {field.type === "color-select" ? (
                            <div className="flex flex-wrap gap-2">
                              {COLOR_PRESETS.map(cp => (
                                <button key={cp.value} title={cp.label} onClick={() => setContentEdits(p => ({ ...p, [field.key]: cp.value }))} className={`w-7 h-7 rounded-full border-2 transition-all ${currentVal === cp.value ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"}`} style={{ backgroundColor: cp.preview }} />
                              ))}
                              <span className="text-xs text-gray-400 self-center ml-1">Couleur choisie: <b className="text-gray-700">{currentVal}</b></span>
                            </div>
                          ) : field.type === "logo-size-select" ? (
                            <select value={currentVal || "lg"} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="w-full sm:w-48 h-9 border rounded-lg px-3 text-sm bg-white">
                              {LOGO_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                          ) : field.type === "font-select" ? (
                            <select value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="w-full sm:w-64 h-9 border rounded-lg px-3 text-sm bg-white" style={{ fontFamily: currentVal }}>
                              {AVAILABLE_FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                            </select>
                          ) : field.type === "image-picker" ? (
                            <ImagePicker label="" value={currentVal} onChange={url => setContentEdits(p => ({ ...p, [field.key]: url }))} />
                          ) : field.multiline ? (
                            <Textarea value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} rows={3} className="text-sm" />
                          ) : (
                            <Input value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="h-9 text-sm" />
                          )}
                          {isDirty && !["color-select", "logo-size-select", "font-select"].includes(field.type || "") && (
                            <p className="text-[10px] text-amber-600 mt-1">● Modification non sauvegardée — cliquez Sauver</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent></Card>
              );
            })}
          </div>
        )}

        {/* ── LIENS & NAVIGATION ── */}
        {tab === "liens" && (
          <div className="space-y-6">
            {/* Nav links editor */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Link2 className="w-4 h-4 text-auto-red" /> Menu de navigation</h2>
                <p className="text-sm text-gray-500 mb-6">Modifiez les liens et libellés affichés dans la barre de navigation du site.</p>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(n => {
                    const labelKey = `nav.link_${n}_label`;
                    const hrefKey = `nav.link_${n}_href`;
                    return (
                      <div key={n} className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 shrink-0 w-20">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Lien {n}</span>
                        </div>
                        <div className="flex flex-1 gap-2 flex-wrap sm:flex-nowrap">
                          <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Libellé</label>
                            <Input
                              value={getVal(labelKey)}
                              onChange={e => setContentEdits(p => ({ ...p, [labelKey]: e.target.value }))}
                              className="h-8 text-sm mt-0.5"
                              placeholder="Accueil"
                              data-testid={`input-nav-label-${n}`}
                            />
                          </div>
                          <div className="flex-1 min-w-[140px]">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">URL</label>
                            <Input
                              value={getVal(hrefKey)}
                              onChange={e => setContentEdits(p => ({ ...p, [hrefKey]: e.target.value }))}
                              className="h-8 text-sm mt-0.5 font-mono"
                              placeholder="/page"
                              data-testid={`input-nav-href-${n}`}
                            />
                          </div>
                          <div className="flex gap-1 items-end">
                            {contentEdits[labelKey] !== undefined && (
                              <Button size="sm" onClick={() => saveContent(labelKey)} disabled={savingContent[labelKey]} className="h-8 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0">
                                {savingContent[labelKey] ? "..." : <Save className="w-3.5 h-3.5" />}
                              </Button>
                            )}
                            {contentEdits[hrefKey] !== undefined && (
                              <Button size="sm" onClick={() => saveContent(hrefKey)} disabled={savingContent[hrefKey]} className="h-8 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0">
                                {savingContent[hrefKey] ? "..." : <Save className="w-3.5 h-3.5" />}
                              </Button>
                            )}
                            {(contentEdits[labelKey] !== undefined || contentEdits[hrefKey] !== undefined) && (
                              <Button size="sm" variant="outline" onClick={() => { const n2 = { ...contentEdits }; delete n2[labelKey]; delete n2[hrefKey]; setContentEdits(n2); }} className="h-8 text-xs">
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CTA button */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><MousePointerClick className="w-4 h-4 text-auto-red" /> Bouton CTA (appel à l'action)</h2>
                <p className="text-sm text-gray-500 mb-4">Bouton rouge en haut à droite de la navigation et dans le menu mobile.</p>
                <div className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Texte du bouton</label>
                    <Input
                      value={getVal("nav.cta_label")}
                      onChange={e => setContentEdits(p => ({ ...p, "nav.cta_label": e.target.value }))}
                      className="h-8 text-sm mt-0.5"
                      placeholder="Devis gratuit"
                      data-testid="input-cta-label"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">URL destination</label>
                    <Input
                      value={getVal("nav.cta_href")}
                      onChange={e => setContentEdits(p => ({ ...p, "nav.cta_href": e.target.value }))}
                      className="h-8 text-sm mt-0.5 font-mono"
                      placeholder="/contact"
                      data-testid="input-cta-href"
                    />
                  </div>
                  <div className="flex items-end gap-1">
                    {contentEdits["nav.cta_label"] !== undefined && (
                      <Button size="sm" onClick={() => saveContent("nav.cta_label")} className="h-8 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0">
                        {savingContent["nav.cta_label"] ? "..." : <><Save className="w-3.5 h-3.5 mr-1" />Sauvegarder</>}
                      </Button>
                    )}
                    {contentEdits["nav.cta_href"] !== undefined && (
                      <Button size="sm" onClick={() => saveContent("nav.cta_href")} className="h-8 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0">
                        {savingContent["nav.cta_href"] ? "..." : <><Save className="w-3.5 h-3.5 mr-1" />URL</>}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social & contact quick links */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Globe className="w-4 h-4 text-auto-red" /> Liens rapides — Réseaux & Contact</h2>
                <p className="text-sm text-gray-500 mb-4">Ces liens s'affichent dans le footer et les boutons WhatsApp/téléphone du site.</p>
                <div className="space-y-3">
                  {[
                    { key: "contact.phone_href", label: "Téléphone (href)", placeholder: "tel:+33321408053" },
                    { key: "contact.whatsapp_href", label: "WhatsApp (lien complet)", placeholder: "https://wa.me/33..." },
                    { key: "footer.social_instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
                    { key: "footer.social_facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
                    { key: "footer.social_tiktok", label: "TikTok", placeholder: "https://tiktok.com/..." },
                    { key: "footer.social_snapchat", label: "Snapchat", placeholder: "https://snapchat.com/..." },
                    { key: "footer.social_google", label: "Avis Google (lien)", placeholder: "https://g.page/..." },
                  ].map(field => (
                    <div key={field.key} className="flex flex-col sm:flex-row gap-2 items-end">
                      <div className="flex-1">
                        <label className="text-xs font-semibold text-gray-500">{field.label}</label>
                        <Input
                          value={getVal(field.key)}
                          onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))}
                          className="h-8 text-sm mt-0.5 font-mono text-xs"
                          placeholder={field.placeholder}
                          data-testid={`input-link-${field.key}`}
                        />
                      </div>
                      {contentEdits[field.key] !== undefined && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => saveContent(field.key)} disabled={savingContent[field.key]} className="h-8 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0">
                            {savingContent[field.key] ? "..." : <><Save className="w-3.5 h-3.5 mr-1" />Sauv.</>}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { const n = { ...contentEdits }; delete n[field.key]; setContentEdits(n); }} className="h-8 text-xs">
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview current nav state */}
            <Card className="border-0 shadow-sm bg-auto-dark">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Aperçu de la navigation actuelle</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {[1, 2, 3, 4, 5].map(n => {
                    const lbl = getVal(`nav.link_${n}_label`);
                    const href = getVal(`nav.link_${n}_href`);
                    if (!lbl) return null;
                    return (
                      <span key={n} className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg font-medium">
                        {lbl} <span className="text-white/40 text-xs">({href})</span>
                      </span>
                    );
                  })}
                  <span className="px-3 py-1.5 bg-auto-red text-white text-sm rounded-lg font-bold">
                    {getVal("nav.cta_label") || "Devis gratuit"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── MÉDIATHÈQUE ── */}
        {tab === "medias" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" data-testid="text-media-title">Médiathèque</h2>
                <p className="text-sm text-gray-500">{mediaFiles.length} fichier(s) importé(s) — Cliquez sur un fichier pour copier son URL</p>
              </div>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  multiple
                  onChange={onFileChange}
                  className="hidden"
                  data-testid="input-media-upload"
                />
                <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-auto-red text-white border-0" data-testid="button-upload-media">
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Envoi...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-1" /> Importer photos / vidéos</>
                  )}
                </Button>
              </div>
            </div>

            {mediaFiles.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-3 text-gray-700">Fichiers importés</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaFiles.map(mf => {
                    const isVideo = mf.mimeType.startsWith("video/");
                    return (
                      <div key={mf.id} className={`group relative rounded-xl overflow-hidden border-2 aspect-square transition-all hover:shadow-lg ${copiedUrl === mf.url ? "border-green-500 scale-95" : "border-gray-200 hover:border-auto-red"}`} data-testid={`card-media-${mf.id}`}>
                        <button onClick={() => copyUrl(mf.url)} className="w-full h-full">
                          {isVideo ? (
                            <video src={mf.url} className="w-full h-full object-cover" muted preload="metadata" />
                          ) : (
                            <img src={mf.url} className="w-full h-full object-cover" alt={mf.originalName} />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                            <span className="text-white text-xs font-semibold text-center px-2">{mf.originalName}</span>
                            <span className="text-white/70 text-[10px]">Cliquer pour copier l'URL</span>
                          </div>
                          {copiedUrl === mf.url && (
                            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">URL copiée !</span>
                            </div>
                          )}
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1.5 flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-[9px] truncate">{mf.originalName}</p>
                            <p className="text-white/50 text-[8px]">{isVideo ? "Vidéo" : "Image"} — {(mf.size / 1024).toFixed(0)} Ko</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); confirm("Supprimer ce fichier ?") && deleteMedia.mutate(mf.id); }}
                            className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white ml-1 shrink-0"
                            data-testid={`button-delete-media-${mf.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {isVideo && <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">VIDEO</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {mediaFiles.length === 0 && (
              <Card className="mb-8 border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <Images className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-semibold">Aucun fichier importé</p>
                  <p className="text-gray-400 text-sm mt-1">Cliquez sur "Importer photos / vidéos" pour ajouter des fichiers depuis votre appareil</p>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mt-4" data-testid="button-upload-empty">
                    <Plus className="w-4 h-4 mr-1" /> Choisir des fichiers
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="bg-gray-50 rounded-xl p-4 border">
              <h3 className="font-bold text-sm mb-3 text-gray-700">Images pré-installées</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {AVAILABLE_IMAGES.map(img => (
                  <button
                    key={img.url}
                    onClick={() => copyUrl(img.url)}
                    className={`group relative rounded-lg overflow-hidden border-2 aspect-square transition-all hover:shadow-md ${copiedUrl === img.url ? "border-green-500 scale-95" : "border-transparent hover:border-auto-red"}`}
                    data-testid={`button-preinstalled-${img.label}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt={img.label} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <span className="text-white text-[9px] font-semibold text-center px-1">{img.label}</span>
                    </div>
                    {copiedUrl === img.url && <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center"><span className="text-white font-bold text-xs">Copié !</span></div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
