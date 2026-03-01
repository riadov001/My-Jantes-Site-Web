import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  LogOut, Mail, Image, Star, HelpCircle, CheckCircle2,
  Clock, XCircle, Eye, Trash2, MessageSquare, LayoutDashboard,
  Lock, User, Plus, X, Phone, ExternalLink, RefreshCw,
  Search, Edit2, Save, Filter, ArrowUpDown, ChevronDown,
  Wrench, FileText, Globe, Type, Settings, Monitor
} from "lucide-react";
import type { ContactRequest, GalleryItem, Testimonial, FaqItem, SiteService, SiteContent } from "@shared/schema";

type Tab = "contacts" | "galerie" | "avis" | "faq" | "prestations" | "contenu";

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
      if (res.ok) {
        onLogin();
      } else {
        const data = await res.json();
        setError(data.message || "Identifiants invalides");
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-auto-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-16 mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-2xl font-black text-white font-['Montserrat',sans-serif]">Administration</h1>
          <p className="text-white/40 text-sm mt-1">Accès réservé — MyJantes</p>
        </div>
        <Card className="border border-white/10 bg-white/5 backdrop-blur">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="email"
                    placeholder="contact@myjantes.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-auto-red"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-auto-red"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black h-12"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-white/20 text-xs mt-6">MyJantes Admin © {new Date().getFullYear()}</p>
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
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Raleway", label: "Raleway" },
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Lato", label: "Lato" },
  { value: "Nunito", label: "Nunito" },
  { value: "Oswald", label: "Oswald" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Bebas Neue", label: "Bebas Neue" },
  { value: "Quicksand", label: "Quicksand" },
  { value: "Rubik", label: "Rubik" },
  { value: "Work Sans", label: "Work Sans" },
];

const COLOR_PRESETS = [
  { value: "red", label: "Rouge (par défaut)", preview: "#dc2626" },
  { value: "blue", label: "Bleu", preview: "#3b82f6" },
  { value: "green", label: "Vert", preview: "#16a34a" },
  { value: "orange", label: "Orange", preview: "#f97316" },
  { value: "purple", label: "Violet", preview: "#8b5cf6" },
  { value: "pink", label: "Rose", preview: "#ec4899" },
  { value: "teal", label: "Turquoise", preview: "#14b8a6" },
  { value: "gold", label: "Or", preview: "#eab308" },
];

const LOGO_SIZES = [
  { value: "sm", label: "Petit (48px)" },
  { value: "md", label: "Moyen (64px)" },
  { value: "lg", label: "Grand (80px)" },
  { value: "xl", label: "Très grand (96px)" },
];

const CONTENT_FIELDS: { key: string; label: string; category: string; multiline?: boolean; type?: "json-array-simple" | "json-stats" | "font-select" | "color-select" | "logo-size-select" }[] = [
  { key: "header.logo_url", label: "URL du logo (header & footer)", category: "header" },
  { key: "header.logo_size", label: "Taille du logo dans le header", category: "header", type: "logo-size-select" },
  { key: "theme.color", label: "Couleur principale du site", category: "theme", type: "color-select" },
  { key: "typography.font", label: "Police d'écriture principale", category: "typography", type: "font-select" },
  { key: "hero.badge", label: "Badge hero (texte sur fond couleur)", category: "hero" },
  { key: "hero.title_line1", label: "Titre hero — ligne 1", category: "hero" },
  { key: "hero.title_line2", label: "Titre hero — ligne 2 (accent couleur)", category: "hero" },
  { key: "hero.subtitle", label: "Sous-titre hero", category: "hero", multiline: true },
  { key: "hero.cta_primary", label: "Bouton principal (devis)", category: "hero" },
  { key: "hero.cta_gallery", label: "Bouton galerie", category: "hero" },
  { key: "hero.bg_video", label: "URL vidéo fond hero (MP4)", category: "hero" },
  { key: "hero.bg_image", label: "URL image fond hero (si pas de vidéo)", category: "hero" },
  { key: "stats", label: "Statistiques (4 blocs)", category: "stats", type: "json-stats" },
  { key: "trust_items", label: "Bande de confiance (items)", category: "trust", type: "json-array-simple" },
  { key: "contact.phone", label: "Numéro de téléphone (affiché)", category: "contact" },
  { key: "contact.phone_href", label: "Lien téléphone (tel:+33...)", category: "contact" },
  { key: "contact.whatsapp_number", label: "Numéro WhatsApp (affiché)", category: "contact" },
  { key: "contact.whatsapp_href", label: "Lien WhatsApp complet", category: "contact" },
  { key: "contact.address", label: "Adresse de l'atelier", category: "contact" },
  { key: "contact.email", label: "Email de contact", category: "contact" },
  { key: "sections.process.title", label: "Titre — Section processus", category: "sections" },
  { key: "sections.process.subtitle", label: "Sous-titre — Section processus", category: "sections" },
  { key: "sections.services.title", label: "Titre — Section prestations", category: "sections" },
  { key: "sections.services.subtitle", label: "Sous-titre — Section prestations", category: "sections" },
  { key: "sections.gallery.title", label: "Titre — Section galerie", category: "sections" },
  { key: "sections.gallery.subtitle", label: "Sous-titre — Section galerie", category: "sections" },
  { key: "sections.testimonials.title", label: "Titre — Section avis clients", category: "sections" },
  { key: "sections.whyus.title", label: "Titre — Section avantages", category: "sections" },
  { key: "pages.about.title", label: "Titre — Page À propos", category: "pages" },
  { key: "pages.about.content", label: "Contenu — Page À propos", category: "pages", multiline: true },
  { key: "pages.about.image", label: "URL Image — Page À propos", category: "pages" },
  { key: "pages.guarantees.title", label: "Titre — Page Garanties", category: "pages" },
  { key: "pages.guarantees.content", label: "Contenu — Page Garanties", category: "pages", multiline: true },
  { key: "pages.contact.title", label: "Titre — Page Contact", category: "pages" },
  { key: "pages.contact.subtitle", label: "Sous-titre — Page Contact", category: "pages" },
  { key: "footer.tagline", label: "Slogan sous le logo", category: "footer" },
  { key: "footer.hours_line1", label: "Horaires ligne 1", category: "footer" },
  { key: "footer.hours_line2", label: "Horaires ligne 2", category: "footer" },
  { key: "footer.hours_short", label: "Horaires (format court)", category: "footer" },
  { key: "footer.social_instagram", label: "Lien Instagram", category: "footer" },
  { key: "footer.social_facebook", label: "Lien Facebook", category: "footer" },
  { key: "footer.social_snapchat", label: "Lien Snapchat", category: "footer" },
  { key: "footer.social_tiktok", label: "Lien TikTok", category: "footer" },
  { key: "footer.social_google", label: "Lien avis Google", category: "footer" },
];

const CATEGORY_LABELS: Record<string, string> = {
  header: "Header & Logo",
  theme: "Couleur du site",
  typography: "Typographie",
  hero: "Section Hero",
  stats: "Statistiques",
  trust: "Bande de confiance",
  contact: "Coordonnées & Contact",
  sections: "Titres des sections",
  pages: "Contenu des pages",
  footer: "Footer & Réseaux sociaux",
};

function StatEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let parsed: { value: string; label: string }[] = [];
  try { parsed = JSON.parse(value); } catch { parsed = []; }
  const update = (i: number, field: "value" | "label", v: string) => {
    const next = [...parsed];
    next[i] = { ...next[i], [field]: v };
    onChange(JSON.stringify(next));
  };
  return (
    <div className="space-y-3">
      {parsed.map((stat, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">Valeur stat {i + 1}</label>
            <Input value={stat.value} onChange={e => update(i, "value", e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 mb-0.5 block">Label stat {i + 1}</label>
            <Input value={stat.label} onChange={e => update(i, "label", e.target.value)} className="h-8 text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ArraySimpleEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let parsed: string[] = [];
  try { parsed = JSON.parse(value); } catch { parsed = []; }
  const update = (i: number, v: string) => { const next = [...parsed]; next[i] = v; onChange(JSON.stringify(next)); };
  const add = () => onChange(JSON.stringify([...parsed, ""]));
  const remove = (i: number) => onChange(JSON.stringify(parsed.filter((_, idx) => idx !== i)));
  return (
    <div className="space-y-2">
      {parsed.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item} onChange={e => update(i, e.target.value)} className="h-8 text-sm flex-grow" />
          <button onClick={() => remove(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-auto-red font-semibold flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Ajouter un élément</button>
    </div>
  );
}

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
      <button onClick={add} className="text-xs text-auto-red font-semibold flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Ajouter une caractéristique</button>
    </div>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("contacts");
  const { toast } = useToast();
  const qc = useQueryClient();

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

  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState<string>("all");
  const [contactSort, setContactSort] = useState<"newest" | "oldest">("newest");

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
  const { data: siteServices = [], isLoading: loadingServices } = useQuery<SiteService[]>({ queryKey: ["/api/admin/services"], enabled: authenticated === true });
  const { data: siteContentItems = [], isLoading: loadingContent } = useQuery<SiteContent[]>({ queryKey: ["/api/admin/site-content"], enabled: authenticated === true });

  const contentMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const item of siteContentItems) m[item.key] = item.value;
    return m;
  }, [siteContentItems]);

  const getContentValue = (key: string) => contentEdits[key] !== undefined ? contentEdits[key] : (contentMap[key] ?? "");

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (contactSearch.trim()) {
      const q = contactSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.toLowerCase().includes(q)) || c.message.toLowerCase().includes(q));
    }
    if (contactStatusFilter !== "all") result = result.filter(c => c.status === contactStatusFilter);
    result.sort((a, b) => {
      const da = new Date(a.createdAt!).getTime();
      const db = new Date(b.createdAt!).getTime();
      return contactSort === "newest" ? db - da : da - db;
    });
    return result;
  }, [contacts, contactSearch, contactStatusFilter, contactSort]);

  const updateContactStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiRequest("PATCH", `/api/admin/contacts/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Statut mis à jour" }); },
  });

  const deleteContact = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/contacts/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Contact supprimé" }); },
  });

  const createGallery = useMutation({
    mutationFn: (data: typeof galleryForm) => apiRequest("POST", "/api/admin/gallery", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); setShowAddGallery(false); setGalleryForm({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" }); toast({ title: "Photo ajoutée" }); },
  });

  const updateGallery = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof galleryForm }) => apiRequest("PUT", `/api/admin/gallery/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); setEditingGalleryId(null); setGalleryForm({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" }); toast({ title: "Photo mise à jour" }); },
  });

  const deleteGallery = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); toast({ title: "Photo supprimée" }); },
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); setEditingTestimonialId(null); setTestimonialForm({ name: "", location: "", rating: 5, content: "", vehicle: "" }); toast({ title: "Avis mis à jour" }); },
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); toast({ title: "Avis supprimé" }); },
  });

  const toggleTestimonial = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => apiRequest("PUT", `/api/admin/testimonials/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }),
  });

  const createFaq = useMutation({
    mutationFn: (data: typeof faqForm) => apiRequest("POST", "/api/admin/faq", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); setShowAddFaq(false); setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 }); toast({ title: "FAQ ajoutée" }); },
  });

  const updateFaq = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof faqForm }) => apiRequest("PUT", `/api/admin/faq/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); setEditingFaqId(null); setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 }); toast({ title: "FAQ mise à jour" }); },
  });

  const deleteFaq = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/faq/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); toast({ title: "FAQ supprimée" }); },
  });

  const toggleFaq = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => apiRequest("PUT", `/api/admin/faq/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }),
  });

  const saveContent = async (key: string) => {
    setSavingContent(p => ({ ...p, [key]: true }));
    try {
      await apiRequest("PATCH", `/api/admin/site-content/${key}`, { value: contentEdits[key] });
      qc.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      const next = { ...contentEdits }; delete next[key]; setContentEdits(next);
      toast({ title: "Contenu sauvegardé" });
    } catch { toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" }); }
    finally { setSavingContent(p => ({ ...p, [key]: false })); }
  };

  const startEditService = (s: SiteService) => { setEditingServiceId(s.id); setServiceForm({ ...s, features: s.features as string[] }); setShowAddService(false); };
  const cancelEditService = () => { setEditingServiceId(null); setServiceForm(defaultServiceForm); };

  if (authenticated === null) return <div className="min-h-screen bg-auto-dark flex items-center justify-center"><div className="w-8 h-8 border-2 border-auto-red border-t-transparent rounded-full animate-spin" /></div>;
  if (authenticated === false) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "contacts", label: "Contacts / Devis", icon: MessageSquare, count: contacts.filter(c => c.status === "nouveau").length },
    { id: "galerie", label: "Galerie", icon: Image },
    { id: "prestations", label: "Prestations", icon: Wrench },
    { id: "avis", label: "Avis Clients", icon: Star },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contenu", label: "Contenu du site", icon: Settings },
  ];

  const contentCategories = Array.from(new Set(CONTENT_FIELDS.map(f => f.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-auto-dark border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-8 brightness-0 invert" />
            <div className="flex items-center gap-2 text-white/60 text-sm"><LayoutDashboard className="w-4 h-4" /> Administration</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}><LogOut className="w-3.5 h-3.5 mr-1.5" /> Déconnexion</Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${tab === t.id ? "bg-auto-red text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
              <t.icon className="w-4 h-4" />{t.label}
              {t.count !== undefined && t.count > 0 && <span className="bg-white/20 px-1.5 rounded text-[10px]">{t.count}</span>}
            </button>
          ))}
        </div>

        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.map(c => (
              <Card key={c.id}><CardContent className="p-5 flex items-center justify-between">
                <div><h3 className="font-bold">{c.name}</h3><p className="text-sm text-gray-500">{c.email} - {c.phone}</p><p className="text-xs mt-1 line-clamp-1">{c.message}</p></div>
                <div className="flex items-center gap-2">
                  <select value={c.status} onChange={e => updateContactStatus.mutate({ id: c.id, status: e.target.value })} className="text-xs border rounded p-1">{Object.keys(statusConfig).map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}</select>
                  <button onClick={() => confirm("Supprimer ?") && deleteContact.mutate(c.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </CardContent></Card>
            ))}
          </div>
        )}

        {tab === "galerie" && (
          <div>
            <Button size="sm" onClick={() => setShowAddGallery(!showAddGallery)} className="mb-4">{showAddGallery ? "Annuler" : "Ajouter une photo"}</Button>
            {showAddGallery && (
              <Card className="mb-6"><CardContent className="p-6 space-y-4">
                <Input placeholder="Titre" value={galleryForm.title} onChange={e => setGalleryForm(p => ({ ...p, title: e.target.value }))} />
                <Input placeholder="URL Image" value={galleryForm.afterImage} onChange={e => setGalleryForm(p => ({ ...p, afterImage: e.target.value }))} />
                <Button onClick={() => createGallery.mutate(galleryForm)}>Ajouter</Button>
              </CardContent></Card>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map(g => (
                <Card key={g.id} className="overflow-hidden">
                  <img src={g.afterImage} className="w-full aspect-square object-cover" />
                  <CardContent className="p-2 flex justify-between items-center">
                    <button onClick={() => toggleGallery.mutate({ id: g.id, published: !g.published })} className={g.published ? "text-green-600" : "text-gray-400"}><Eye className="w-4 h-4" /></button>
                    <button onClick={() => confirm("Supprimer ?") && deleteGallery.mutate(g.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tab === "prestations" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{siteServices.length} prestation(s)</p>
              <Button size="sm" onClick={() => { setShowAddService(!showAddService); cancelEditService(); }}>{showAddService ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter</>}</Button>
            </div>
            {(showAddService || editingServiceId) && (
              <Card className="mb-6"><CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs">Titre</label><Input value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))} /></div>
                  <div><label className="text-xs">Badge</label><Input value={serviceForm.badge} onChange={e => setServiceForm(p => ({ ...p, badge: e.target.value }))} /></div>
                </div>
                <div className="mb-4"><label className="text-xs">Description</label><Textarea value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="mb-4"><label className="text-xs">Caractéristiques</label><FeatureListEditor value={serviceForm.features} onChange={v => setServiceForm(p => ({ ...p, features: v }))} /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs">Prix</label><Input value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} /></div>
                  <div><label className="text-xs">Slug</label><Input value={serviceForm.slug} onChange={e => setServiceForm(p => ({ ...p, slug: e.target.value }))} /></div>
                </div>
                <div className="mb-4"><label className="text-xs">URL Image</label><Input value={serviceForm.image} onChange={e => setServiceForm(p => ({ ...p, image: e.target.value }))} /></div>
                <div className="flex gap-2">
                  <Button onClick={() => editingServiceId ? updateService.mutate({ id: editingServiceId, data: serviceForm }) : createService.mutate(serviceForm)}>{editingServiceId ? "Enregistrer" : "Ajouter"}</Button>
                  {editingServiceId && <Button variant="outline" onClick={cancelEditService}>Annuler</Button>}
                </div>
              </CardContent></Card>
            )}
            <div className="space-y-3">
              {siteServices.map(s => (
                <Card key={s.id}><CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={s.image} className="w-12 h-12 rounded object-cover" />
                    <div><h3 className="font-bold">{s.title}</h3><p className="text-xs text-gray-500">{s.price}</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditService(s)} className="p-2 border rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => toggleService.mutate({ id: s.id, published: !s.published })} className={`p-2 border rounded ${s.published ? "bg-green-50" : ""}`}><Eye className="w-4 h-4" /></button>
                    <button onClick={() => confirm("Supprimer ?") && deleteService.mutate(s.id)} className="p-2 border rounded bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </CardContent></Card>
              ))}
            </div>
          </div>
        )}

        {tab === "avis" && (
          <div className="space-y-4">
            <Button size="sm" onClick={() => setShowAddTestimonial(!showAddTestimonial)}>{showAddTestimonial ? "Annuler" : "Ajouter un avis"}</Button>
            {showAddTestimonial && (
              <Card><CardContent className="p-6 space-y-4">
                <Input placeholder="Nom" value={testimonialForm.name} onChange={e => setTestimonialForm(p => ({ ...p, name: e.target.value }))} />
                <Textarea placeholder="Commentaire" value={testimonialForm.content} onChange={e => setTestimonialForm(p => ({ ...p, content: e.target.value }))} />
                <Button onClick={() => createTestimonial.mutate(testimonialForm)}>Ajouter</Button>
              </CardContent></Card>
            )}
            {testimonials.map(t => (
              <Card key={t.id}><CardContent className="p-4 flex justify-between items-center">
                <div><h3 className="font-bold">{t.name}</h3><p className="text-xs text-gray-500 line-clamp-1">{t.content}</p></div>
                <div className="flex gap-2">
                  <button onClick={() => toggleTestimonial.mutate({ id: t.id, published: !t.published })} className={t.published ? "text-green-600" : "text-gray-400"}><Eye className="w-4 h-4" /></button>
                  <button onClick={() => confirm("Supprimer ?") && deleteTestimonial.mutate(t.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </CardContent></Card>
            ))}
          </div>
        )}

        {tab === "faq" && (
          <div className="space-y-4">
            <Button size="sm" onClick={() => setShowAddFaq(!showAddFaq)}>{showAddFaq ? "Annuler" : "Ajouter FAQ"}</Button>
            {showAddFaq && (
              <Card><CardContent className="p-6 space-y-4">
                <Input placeholder="Question" value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))} />
                <Textarea placeholder="Réponse" value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} />
                <Button onClick={() => createFaq.mutate(faqForm)}>Ajouter</Button>
              </CardContent></Card>
            )}
            {faqItems.map(f => (
              <Card key={f.id}><CardContent className="p-4 flex justify-between items-center">
                <div><h3 className="font-bold text-sm">{f.question}</h3></div>
                <div className="flex gap-2">
                  <button onClick={() => toggleFaq.mutate({ id: f.id, published: !f.published })} className={f.published ? "text-green-600" : "text-gray-400"}><Eye className="w-4 h-4" /></button>
                  <button onClick={() => confirm("Supprimer ?") && deleteFaq.mutate(f.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </CardContent></Card>
            ))}
          </div>
        )}

        {tab === "contenu" && (
          <div className="space-y-6">
            {contentCategories.map(category => {
              const fields = CONTENT_FIELDS.filter(f => f.category === category);
              return (
                <Card key={category} className="border-0 shadow-sm"><CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
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
                  <div className="space-y-4">
                    {fields.map(field => {
                      const currentVal = getContentValue(field.key);
                      const isDirty = contentEdits[field.key] !== undefined && contentEdits[field.key] !== contentMap[field.key];
                      return (
                        <div key={field.key} className="space-y-1">
                          <div className="flex justify-between items-center"><label className="text-xs font-medium">{field.label}</label>
                          {isDirty && <Button size="sm" onClick={() => saveContent(field.key)} className="h-6 text-[10px]"><Save className="w-3 h-3 mr-1" /> Sauver</Button>}</div>
                          {field.type === "color-select" ? (
                            <div className="flex flex-wrap gap-2">{COLOR_PRESETS.map(cp => <button key={cp.value} onClick={() => setContentEdits(p => ({ ...p, [field.key]: cp.value }))} className={`w-6 h-6 rounded-full border-2 ${currentVal === cp.value ? "border-black" : "border-transparent"}`} style={{ backgroundColor: cp.preview }} title={cp.label} />)}</div>
                          ) : field.type === "logo-size-select" ? (
                            <select value={currentVal || "lg"} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="w-full h-8 border rounded text-xs px-2">{LOGO_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
                          ) : field.type === "font-select" ? (
                            <select value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="w-full h-8 border rounded text-xs px-2" style={{ fontFamily: currentVal }}>{AVAILABLE_FONTS.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}</select>
                          ) : field.multiline ? (
                            <Textarea value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} rows={3} className="text-xs" />
                          ) : (
                            <Input value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="h-8 text-xs" />
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
      </div>
    </div>
  );
}
