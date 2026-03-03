import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  LogOut, Image, Star, HelpCircle, CheckCircle2,
  Clock, XCircle, Eye, Trash2, MessageSquare, LayoutDashboard,
  Lock, User, Plus, X, Phone,
  Edit2, Save, Wrench, FileText, Globe, Type, Settings, Monitor, Images,
  TrendingUp, Link2, MousePointerClick, Users, Activity, ChevronRight, Menu,
  EyeOff, Shield, UserPlus, KeyRound, History,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { ContactRequest, GalleryItem, Testimonial, FaqItem, SiteService, SiteContent, MediaFile } from "@shared/schema";

type Tab = "dashboard" | "contacts" | "galerie" | "avis" | "faq" | "prestations" | "contenu" | "liens" | "medias" | "profil";

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

const AVAILABLE_FONTS = [
  "Eurostile Extended",
  "Orbitron", "Michroma", "Rajdhani", "Chakra Petch", "Audiowide",
  "Exo 2", "Teko", "Russo One", "Oxanium", "Tektur", "Bruno Ace", "Bruno Ace SC",
  "Electrolize", "Share Tech Mono", "Syncopate", "Aldrich", "Quantico", "Jura",
  "Iceberg", "Megrim", "Poiret One",
  "Bebas Neue", "Barlow Condensed", "Saira", "Saira Condensed", "Titillium Web",
  "Bai Jamjuree", "Oswald",
  "Montserrat", "Open Sans", "Poppins", "Raleway", "Inter", "Roboto",
  "Lato", "Nunito", "Playfair Display", "Quicksand", "Rubik", "Work Sans",
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

const CONTENT_FIELDS: { key: string; label: string; category: string; multiline?: boolean; type?: "font-select" | "color-select" | "logo-size-select" | "image-picker" }[] = [
  { key: "header.logo_url", label: "URL du logo", category: "header", type: "image-picker" },
  { key: "header.logo_size", label: "Taille du logo", category: "header", type: "logo-size-select" },
  { key: "theme.color", label: "Couleur principale", category: "theme", type: "color-select" },
  { key: "typography.font", label: "Police d'écriture (corps du texte)", category: "typography", type: "font-select" },
  { key: "typography.heading_font", label: "Police des titres (H1, H2, H3...)", category: "typography", type: "font-select" },
  { key: "typography.font_size", label: "Taille de police — Corps (px)", category: "typography" },
  { key: "typography.heading_scale", label: "Échelle des titres (ex: 1.2, 1.5)", category: "typography" },
  { key: "hero.badge", label: "Badge hero", category: "hero" },
  { key: "hero.title_line1", label: "Titre hero — ligne 1", category: "hero" },
  { key: "hero.title_line2", label: "Titre hero — ligne 2 (accent)", category: "hero" },
  { key: "hero.subtitle", label: "Sous-titre hero", category: "hero", multiline: true },
  { key: "hero.cta_primary", label: "Bouton principal (devis)", category: "hero" },
  { key: "hero.cta_gallery", label: "Bouton galerie", category: "hero" },
  { key: "hero.bg_video", label: "Vidéo fond hero (MP4)", category: "hero" },
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
  { key: "sections.services.title", label: "Titre — Section prestations", category: "sections" },
  { key: "sections.services.subtitle", label: "Sous-titre — Section prestations", category: "sections" },
  { key: "sections.gallery.title", label: "Titre — Section galerie", category: "sections" },
  { key: "sections.gallery.subtitle", label: "Sous-titre — Section galerie", category: "sections" },
  { key: "sections.testimonials.title", label: "Titre — Section avis", category: "sections" },
  { key: "sections.whyus.title", label: "Titre — Section avantages", category: "sections" },
  { key: "pages.services.badge", label: "Badge — Page Services", category: "pages" },
  { key: "pages.gallery.badge", label: "Badge — Page Galerie", category: "pages" },
  { key: "pages.faq.badge", label: "Badge — Page FAQ", category: "pages" },
  { key: "pages.about.badge", label: "Badge — Page À propos", category: "pages" },
  { key: "pages.about.hero_title_line1", label: "Titre À propos — ligne 1", category: "pages" },
  { key: "pages.about.hero_title_line2", label: "Titre À propos — ligne 2", category: "pages" },
  { key: "pages.about.hero_subtitle", label: "Sous-titre À propos", category: "pages" },
  { key: "pages.about.story_title", label: "Titre section histoire", category: "pages" },
  { key: "pages.about.story_content", label: "Texte section histoire", category: "pages", multiline: true },
  { key: "pages.about.image", label: "Image — Page À propos", category: "pages", type: "image-picker" },
  { key: "pages.contact.title", label: "Titre — Page Contact", category: "pages" },
  { key: "pages.contact.subtitle", label: "Sous-titre — Page Contact", category: "pages" },
  { key: "trust_item_1", label: "Bande de confiance — Item 1", category: "trust" },
  { key: "trust_item_2", label: "Bande de confiance — Item 2", category: "trust" },
  { key: "trust_item_3", label: "Bande de confiance — Item 3", category: "trust" },
  { key: "footer.tagline", label: "Slogan footer", category: "footer" },
  { key: "footer.hours_line1", label: "Horaires ligne 1", category: "footer" },
  { key: "footer.hours_line2", label: "Horaires ligne 2", category: "footer" },
];

const CATEGORY_LABELS: Record<string, string> = {
  header: "Header & Logo", theme: "Couleurs & Thème", typography: "Typographie",
  nav: "Menu Navigation", hero: "Section Hero",
  contact: "Coordonnées", sections: "Contenus Sections",
  trust: "Confiance", pages: "Pages Internes",
  legal: "Légal", footer: "Pied de page",
};

function ImagePicker({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [open, setOpen] = useState(false);
  const select = (url: string) => { onChange(url); setOpen(false); };

  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-10 text-sm bg-gray-50 border-gray-200"
          placeholder="/images/..."
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="px-4 border-gray-200 bg-white hover:bg-gray-50 shrink-0"
        >
          <Images className="w-4 h-4 mr-2" /> Médias
        </Button>
      </div>
      {value && (
        <div className="mt-2 relative group w-32 aspect-video rounded-lg overflow-hidden border">
          <img src={value} className="w-full h-full object-cover" />
          <button onClick={() => onChange("")} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Médiathèque</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="w-5 h-5" /></Button>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {AVAILABLE_IMAGES.map(img => (
                <button key={img.url} onClick={() => select(img.url)} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-auto-red transition-all">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center p-2">
                    <span className="text-white text-[10px] font-bold text-center uppercase tracking-tighter">{img.label}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function ResetPasswordForm({ token, onDone }: { token: string; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== confirm) { setErr("Les mots de passe ne correspondent pas"); return; }
    if (pw.length < 8) { setErr("Min. 8 caractères requis"); return; }
    setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: pw }),
      });
      const d = await res.json();
      if (res.ok) { setMsg(d.message); setTimeout(() => { window.history.replaceState({}, "", "/admin"); onDone(); }, 2500); }
      else { setErr(d.message || "Erreur"); }
    } catch { setErr("Erreur réseau."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-auto-dark flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-16 mx-auto mb-6 brightness-0 invert" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Nouveau mot de passe</h1>
        </div>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            {msg ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-5 text-green-400 text-sm font-bold text-center">{msg}<br /><span className="text-green-300/50 text-xs">Redirection...</span></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Nouveau mot de passe</label>
                  <Input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 pr-12" placeholder="Min. 8 caractères" required />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-[36px] text-white/30 hover:text-white/70">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
                <div>
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Confirmer</label>
                  <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20" placeholder="••••••••" required />
                </div>
                {err && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-bold flex items-center gap-2"><XCircle className="w-4 h-4" /> {err}</div>}
                <Button type="submit" disabled={loading} className="w-full bg-auto-red hover:bg-auto-red-dark text-white font-black h-12 text-sm uppercase tracking-widest">
                  {loading ? "Enregistrement..." : "Définir le mot de passe"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: forgotUsername }),
      });
      const d = await res.json();
      setForgotMsg(d.message);
    } catch { setForgotMsg("Erreur lors de l'envoi. Réessayez."); }
    finally { setForgotLoading(false); }
  };

  return (
    <div className="min-h-screen bg-auto-dark flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-16 mx-auto mb-6 brightness-0 invert" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Administration</h1>
          <p className="text-white/40 text-sm mt-2 font-medium">Connectez-vous pour gérer votre site</p>
        </div>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            {!showForgot ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Identifiant</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input type="email" value={username} onChange={e => setUsername(e.target.value)} className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-auto-red/50" placeholder="contact@myjantes.com" required data-testid="input-login-username" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-auto-red/50" placeholder="••••••••" required data-testid="input-login-password" />
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-bold flex items-center gap-2"><XCircle className="w-4 h-4" /> {error}</div>}
                <Button type="submit" className="w-full bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black h-12 text-sm uppercase tracking-widest transition-all hover:scale-[1.02]" disabled={loading} data-testid="button-login-submit">
                  {loading ? <span className="animate-pulse">Connexion...</span> : "Accéder au panel"}
                </Button>
                <button type="button" onClick={() => setShowForgot(true)} className="w-full text-center text-white/30 hover:text-white/60 text-xs font-bold transition-colors mt-2" data-testid="button-forgot-password">
                  Mot de passe oublié ?
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgot} className="space-y-6">
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Réinitialiser le mot de passe</h3>
                  <p className="text-white/30 text-xs mb-5">Entrez votre identifiant pour recevoir un lien par email.</p>
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Identifiant</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input type="email" value={forgotUsername} onChange={e => setForgotUsername(e.target.value)} className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-auto-red/50" placeholder="contact@myjantes.com" required data-testid="input-forgot-username" />
                  </div>
                </div>
                {forgotMsg && <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-green-400 text-xs font-bold">{forgotMsg}</div>}
                <Button type="submit" className="w-full bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black h-12 text-sm uppercase tracking-widest" disabled={forgotLoading} data-testid="button-forgot-submit">
                  {forgotLoading ? "Envoi..." : "Envoyer le lien"}
                </Button>
                <button type="button" onClick={() => { setShowForgot(false); setForgotMsg(""); }} className="w-full text-center text-white/30 hover:text-white/60 text-xs font-bold transition-colors" data-testid="button-back-login">
                  ← Retour à la connexion
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminApp() {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [contentEdits, setContentEdits] = useState<Record<string, string>>({});
  const [savingContent, setSavingContent] = useState<Record<string, boolean>>({});
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [showAddGallery, setShowAddGallery] = useState(false);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [newUserForm, setNewUserForm] = useState({ username: "", password: "", email: "", isAdmin: false });
  const [profileEmail, setProfileEmail] = useState("");

  const [galleryForm, setGalleryForm] = useState({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" });
  const [testimonialForm, setTestimonialForm] = useState({ name: "", location: "", rating: 5, content: "", vehicle: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "general", sortOrder: 0 });
  const defaultServiceForm = { title: "", description: "", image: "/images/service-renovation.png", badge: "", features: [] as string[], price: "", slug: "", sortOrder: 0, published: true };
  const [serviceForm, setServiceForm] = useState(defaultServiceForm);

  const { data: contacts = [] } = useQuery<ContactRequest[]>({ queryKey: ["/api/admin/contacts"], enabled: authenticated === true });
  const { data: gallery = [] } = useQuery<GalleryItem[]>({ queryKey: ["/api/admin/gallery"], enabled: authenticated === true });
  const { data: testimonials = [] } = useQuery<Testimonial[]>({ queryKey: ["/api/admin/testimonials"], enabled: authenticated === true });
  const { data: faqItems = [] } = useQuery<FaqItem[]>({ queryKey: ["/api/admin/faq"], enabled: authenticated === true });
  const { data: siteServices = [] } = useQuery<SiteService[]>({ queryKey: ["/api/admin/services"], enabled: authenticated === true });
  const { data: siteContentItems = [] } = useQuery<SiteContent[]>({ queryKey: ["/api/admin/site-content"], enabled: authenticated === true });
  const { data: mediaFiles = [] } = useQuery<MediaFile[]>({ queryKey: ["/api/admin/media"], enabled: authenticated === true });
  const { data: analytics } = useQuery<any>({ queryKey: ["/api/admin/analytics"], enabled: authenticated === true });

  const contentMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const item of siteContentItems) m[item.key] = item.value;
    return m;
  }, [siteContentItems]);

  const getVal = (key: string) => contentEdits[key] !== undefined ? contentEdits[key] : (contentMap[key] ?? "");

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

  const deleteContactMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/contacts/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Contact supprimé" }); },
  });
  const updateContactStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => apiRequest("PATCH", `/api/admin/contacts/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Statut mis à jour" }); },
  });

  const addGalleryMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/gallery", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); setShowAddGallery(false); setGalleryForm({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" }); toast({ title: "Réalisation ajoutée" }); },
  });
  const updateGalleryMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/admin/gallery/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); setEditingGalleryId(null); toast({ title: "Réalisation modifiée" }); },
  });
  const deleteGalleryMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); toast({ title: "Réalisation supprimée" }); },
  });

  const addTestimonialMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/testimonials", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); setShowAddTestimonial(false); setTestimonialForm({ name: "", location: "", rating: 5, content: "", vehicle: "" }); toast({ title: "Avis ajouté" }); },
  });
  const deleteTestimonialMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); toast({ title: "Avis supprimé" }); },
  });

  const addFaqMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/faq", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); setShowAddFaq(false); setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 }); toast({ title: "FAQ ajoutée" }); },
  });
  const deleteFaqMut = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/faq/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); toast({ title: "FAQ supprimée" }); },
  });

  const addServiceMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/services", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); setShowAddService(false); setServiceForm(defaultServiceForm); toast({ title: "Prestation ajoutée" }); },
  });
  const updateServiceMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest("PUT", `/api/admin/services/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); setEditingServiceId(null); setShowAddService(false); setServiceForm(defaultServiceForm); toast({ title: "Prestation modifiée" }); },
  });
  const deleteServiceMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/services/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); toast({ title: "Prestation supprimée" }); },
  });

  const deleteMediaMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/media/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/media"] }); toast({ title: "Fichier supprimé" }); },
  });

  const { data: profile } = useQuery<any>({ queryKey: ["/api/admin/profile"], enabled: authenticated === true });
  useEffect(() => { if (profile?.email) setProfileEmail(profile.email); }, [profile]);
  const { data: adminUsers = [] } = useQuery<any[]>({ queryKey: ["/api/admin/users"], enabled: tab === "profil" && authenticated === true });
  const { data: activityLogs = [] } = useQuery<any[]>({ queryKey: ["/api/admin/activity-logs"], enabled: tab === "profil" && authenticated === true });

  const changePasswordMut = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => apiRequest("PUT", "/api/admin/profile/password", data),
    onSuccess: () => { setPwForm({ current: "", next: "", confirm: "" }); toast({ title: "Mot de passe modifié ✓" }); },
    onError: (err: any) => toast({ title: err.message || "Erreur", variant: "destructive" }),
  });

  const changeEmailMut = useMutation({
    mutationFn: (email: string) => apiRequest("PUT", "/api/admin/profile/email", { email }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/profile"] }); toast({ title: "Email modifié ✓" }); },
  });

  const createUserMut = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/users", data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/users"] }); setShowAddUser(false); setNewUserForm({ username: "", password: "", email: "", isAdmin: false }); toast({ title: "Utilisateur créé ✓" }); },
    onError: (err: any) => toast({ title: err.message || "Erreur", variant: "destructive" }),
  });

  const deleteUserMut = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/users"] }); toast({ title: "Utilisateur supprimé" }); },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData, credentials: "include" });
      if (res.ok) {
        qc.invalidateQueries({ queryKey: ["/api/admin/media"] });
        toast({ title: "Fichier uploadé" });
      } else { toast({ title: "Erreur d'upload", variant: "destructive" }); }
    } catch { toast({ title: "Erreur d'upload", variant: "destructive" }); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast({ title: "URL copiée" });
  };

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => { setAuthenticated(false); setLocation("/"); },
  });

  useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setAuthenticated(data.authenticated);
      return data;
    },
  });

  if (authenticated === null) return <div className="min-h-screen bg-auto-dark flex items-center justify-center"><div className="w-12 h-12 border-4 border-auto-red border-t-transparent rounded-full animate-spin" /></div>;
  if (authenticated === false) return <LoginForm onLogin={() => setAuthenticated(true)} />;

  const menuItems: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: TrendingUp },
    { id: "contacts", label: "Demandes & Devis", icon: MessageSquare, badge: contacts.filter(c => c.status === "nouveau").length },
    { id: "galerie", label: "Réalisations", icon: Image },
    { id: "prestations", label: "Prestations", icon: Wrench },
    { id: "avis", label: "Avis Clients", icon: Star },
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contenu", label: "Configuration", icon: Settings },
    { id: "liens", label: "Navigation", icon: Link2 },
    { id: "medias", label: "Médiathèque", icon: Images },
    { id: "profil", label: "Profil & Sécurité", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-auto-dark transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 border-r border-white/5`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-10 brightness-0 invert" />
            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-4 ml-1">Administration Panel</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${tab === item.id ? "bg-auto-red text-white shadow-lg shadow-auto-red/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${tab === item.id ? "text-white" : "text-white/30 group-hover:text-white"}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${tab === item.id ? "bg-white text-auto-red" : "bg-auto-red text-white"}`}>{item.badge}</span> : null}
                <ChevronRight className={`w-4 h-4 opacity-0 transition-opacity ${tab === item.id ? "opacity-100" : ""}`} />
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5">
            <Button variant="ghost" onClick={() => logoutMutation.mutate()} className="w-full justify-start text-white/40 hover:text-white hover:bg-white/5 font-bold">
              <LogOut className="w-5 h-5 mr-3" /> Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
              {menuItems.find(i => i.id === tab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-gray-500">Serveur Opérationnel</span>
            </div>
          </div>
        </header>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-12">
            
            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {[
                    { label: "Visites totales", value: analytics?.totalViews ?? 0, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Contacts reçus", value: analytics?.totalContacts ?? 0, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Nouveaux", value: analytics?.newContacts ?? 0, icon: Activity, color: "text-auto-red", bg: "bg-red-50", important: true },
                    { label: "Avis Clients", value: analytics?.totalTestimonials ?? 0, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                  ].map((kpi, i) => (
                    <Card key={i} className={`border-0 shadow-sm overflow-hidden ${kpi.important && (kpi.value > 0) ? "ring-2 ring-auto-red" : ""}`}>
                      <CardContent className="p-4 sm:p-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 ${kpi.bg}`}>
                          <kpi.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${kpi.color}`} />
                        </div>
                        <p className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">{(kpi.value || 0).toLocaleString("fr-FR")}</p>
                        <p className="text-[9px] sm:text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1 sm:mt-2">{kpi.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
                  <Card className="border-0 shadow-sm lg:col-span-3">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 text-gray-400">
                        <TrendingUp className="w-4 h-4 text-auto-red" /> Évolution du trafic
                      </h3>
                      <div className="h-[220px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analytics?.viewsByDay ?? []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={d => d.split("-")[2]} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} width={30} />
                            <Tooltip />
                            <Line type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={3} dot={false} animationDuration={1000} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm lg:col-span-2">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-black text-xs sm:text-sm uppercase tracking-widest mb-4 sm:mb-6 flex items-center gap-2 text-gray-400">
                        <MessageSquare className="w-4 h-4 text-auto-red" /> Dernières demandes
                      </h3>
                      <div className="space-y-3">
                        {contacts.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-8">Aucune demande pour le moment</p>
                        ) : contacts.slice(0, 6).map(c => (
                          <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setTab("contacts")}>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm text-gray-900 truncate">{c.name} {c.firstName || ""}</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-0.5 truncate">{c.vehicle || c.email}</p>
                            </div>
                            <Badge className={`shrink-0 text-[9px] ${c.status === "nouveau" ? "bg-auto-red text-white" : "bg-gray-200 text-gray-500"}`}>
                              {c.status.toUpperCase()}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      {contacts.length > 6 && (
                        <button onClick={() => setTab("contacts")} className="w-full mt-4 text-center text-xs text-auto-red font-bold uppercase tracking-wider hover:underline" data-testid="button-view-all-contacts">
                          Voir toutes les demandes ({contacts.length})
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("galerie")}>
                    <Image className="w-5 h-5 text-auto-red mx-auto mb-2" />
                    <p className="text-lg sm:text-xl font-black text-gray-900">{gallery.length}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Réalisations</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("prestations")}>
                    <Wrench className="w-5 h-5 text-auto-red mx-auto mb-2" />
                    <p className="text-lg sm:text-xl font-black text-gray-900">{siteServices.length}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prestations</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("avis")}>
                    <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <p className="text-lg sm:text-xl font-black text-gray-900">{testimonials.length}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avis</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTab("faq")}>
                    <HelpCircle className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-lg sm:text-xl font-black text-gray-900">{faqItems.length}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">FAQ</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── CONTACTS ── */}
            {tab === "contacts" && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold">Aucune demande de contact</p>
                    </CardContent>
                  </Card>
                ) : contacts.map(c => (
                  <Card key={c.id} className={`border-0 shadow-sm ${c.status === "nouveau" ? "ring-1 ring-auto-red/20 bg-red-50/30" : ""}`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">{c.name} {c.firstName}</h3>
                            <Badge className={`text-[9px] sm:text-[10px] ${c.status === "nouveau" ? "bg-auto-red text-white" : "bg-green-500 text-white"}`}>{c.status}</Badge>
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(c.createdAt!).toLocaleDateString("fr-FR")}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                              <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase mb-0.5">Email</p>
                                <a href={`mailto:${c.email}`} className="text-[11px] sm:text-xs font-bold text-auto-red truncate block">{c.email}</a>
                              </div>
                              <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase mb-0.5">Téléphone</p>
                                <a href={`tel:${c.phone}`} className="text-[11px] sm:text-xs font-bold text-auto-red">{c.phone}</a>
                              </div>
                              <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase mb-0.5">Véhicule</p>
                                <p className="text-[11px] sm:text-xs font-bold truncate">{c.vehicle || "—"}</p>
                              </div>
                              <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase mb-0.5">Nb jantes</p>
                                <p className="text-[11px] sm:text-xs font-bold">{c.nbWheels || "—"}</p>
                              </div>
                            </div>

                            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase mb-1">Message</p>
                              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">"{c.message}"</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {c.status === "nouveau" && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase h-8" onClick={() => updateContactStatusMut.mutate({ id: c.id, status: "traité" })} data-testid={`button-treat-contact-${c.id}`}>
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Traité
                                </Button>
                              )}
                              {c.status === "traité" && (
                                <Button size="sm" variant="outline" className="text-[10px] font-black uppercase h-8" onClick={() => updateContactStatusMut.mutate({ id: c.id, status: "nouveau" })} data-testid={`button-untreat-contact-${c.id}`}>
                                  <Clock className="w-3 h-3 mr-1" /> Nouveau
                                </Button>
                              )}
                              {c.phone && (
                                <Button size="sm" variant="outline" asChild className="text-[10px] font-bold h-8 text-green-600 hover:bg-green-50">
                                  <a href={`https://wa.me/${c.phone.replace(/\s/g, "").replace(/^0/, "33")}`} target="_blank" rel="noreferrer">
                                    <Phone className="w-3 h-3 mr-1" /> WhatsApp
                                  </a>
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="text-[10px] font-bold h-8 text-red-500 hover:bg-red-50" onClick={() => deleteContactMut.mutate(c.id)} data-testid={`button-delete-contact-${c.id}`}>
                                <Trash2 className="w-3 h-3 mr-1" /> Suppr.
                              </Button>
                            </div>
                          </div>

                          {c.imageUrl && (
                            <div className="w-full sm:w-32 md:w-40 aspect-square rounded-xl overflow-hidden border-2 border-white shadow-lg shrink-0">
                              <a href={c.imageUrl} target="_blank" rel="noreferrer">
                                <img src={c.imageUrl} className="w-full h-full object-cover transition-transform hover:scale-110" alt="Photo jointe" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* ── CONTENU / CONFIG ── */}
            {tab === "contenu" && (
              <div className="grid gap-8">
                {Object.keys(CATEGORY_LABELS).map(cat => {
                  const fields = CONTENT_FIELDS.filter(f => f.category === cat);
                  if (fields.length === 0) return null;
                  return (
                    <Card key={cat} className="border-0 shadow-sm">
                      <CardHeader className="border-b border-gray-100 p-8">
                        <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                          <Settings className="w-5 h-5 text-auto-red" /> {CATEGORY_LABELS[cat]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-8">
                        {fields.map(field => {
                          const currentVal = getVal(field.key);
                          const isDirty = contentEdits[field.key] !== undefined && contentEdits[field.key] !== contentMap[field.key];
                          return (
                            <div key={field.key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-[0.1em] text-gray-500">{field.label}</label>
                                {isDirty && (
                                  <Button size="sm" onClick={() => saveContent(field.key)} disabled={savingContent[field.key]} className="h-7 bg-auto-red text-white text-[10px] font-black uppercase px-4 shadow-lg shadow-auto-red/20">
                                    <Save className="w-3 h-3 mr-2" /> Enregistrer
                                  </Button>
                                )}
                              </div>
                              
                              {field.type === "font-select" ? (
                                <select value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 font-bold text-sm" style={{ fontFamily: currentVal }}>
                                  {AVAILABLE_FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                                </select>
                              ) : field.type === "color-select" ? (
                                <div className="flex flex-wrap gap-3">
                                  {COLOR_PRESETS.map(cp => (
                                    <button key={cp.value} title={cp.label} onClick={() => setContentEdits(p => ({ ...p, [field.key]: cp.value }))} className={`w-10 h-10 rounded-full border-4 transition-all ${currentVal === cp.value ? "border-gray-900 scale-110 shadow-lg" : "border-white hover:scale-110"}`} style={{ backgroundColor: cp.preview }} />
                                  ))}
                                </div>
                              ) : field.type === "image-picker" ? (
                                <ImagePicker label="" value={currentVal} onChange={url => setContentEdits(p => ({ ...p, [field.key]: url }))} />
                              ) : field.multiline ? (
                                <Textarea value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="bg-gray-50 border-gray-200 rounded-2xl p-4 min-h-[120px] font-medium" />
                              ) : (
                                <Input value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-medium" />
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ── GALERIE ── */}
            {tab === "galerie" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 font-bold">{gallery.length} réalisation{gallery.length > 1 ? "s" : ""}</p>
                  <Button onClick={() => setShowAddGallery(true)} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase tracking-widest" data-testid="button-add-gallery">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                  </Button>
                </div>

                {showAddGallery && (
                  <Card className="border-2 border-auto-red/20 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center"><h3 className="font-black uppercase text-sm">Nouvelle réalisation</h3><Button variant="ghost" size="sm" onClick={() => setShowAddGallery(false)}><X className="w-4 h-4" /></Button></div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Titre</label><Input value={galleryForm.title} onChange={e => setGalleryForm(p => ({ ...p, title: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-gallery-title" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Type de service</label>
                          <select value={galleryForm.serviceType} onChange={e => setGalleryForm(p => ({ ...p, serviceType: e.target.value }))} className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-sm" data-testid="select-gallery-type">
                            <option value="renovation">Rénovation</option><option value="peinture">Peinture</option><option value="soudure">Soudure</option><option value="reparation">Réparation</option><option value="polish">Polish</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Image Après (URL)</label><Input value={galleryForm.afterImage} onChange={e => setGalleryForm(p => ({ ...p, afterImage: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-gallery-after" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Image Avant (URL)</label><Input value={galleryForm.beforeImage} onChange={e => setGalleryForm(p => ({ ...p, beforeImage: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-gallery-before" /></div>
                      </div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Description</label><Textarea value={galleryForm.description} onChange={e => setGalleryForm(p => ({ ...p, description: e.target.value }))} className="bg-gray-50 border-gray-200 min-h-[80px]" data-testid="input-gallery-desc" /></div>
                      <Button onClick={() => addGalleryMut.mutate(galleryForm)} disabled={!galleryForm.title || !galleryForm.afterImage || addGalleryMut.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase" data-testid="button-submit-gallery">
                        {addGalleryMut.isPending ? "Ajout..." : "Ajouter la réalisation"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map(item => (
                    <Card key={item.id} className="border-0 shadow-sm overflow-hidden group" data-testid={`card-gallery-${item.id}`}>
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                        <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute top-3 left-3"><Badge className="bg-auto-red text-white text-[10px] font-black">{item.serviceType}</Badge></div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-black text-sm uppercase truncate">{item.title}</h4>
                        {item.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>}
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1 text-[10px] font-bold h-8" onClick={() => deleteGalleryMut.mutate(item.id)} data-testid={`button-delete-gallery-${item.id}`}>
                            <Trash2 className="w-3 h-3 mr-1" /> Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── PRESTATIONS ── */}
            {tab === "prestations" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 font-bold">{siteServices.length} prestation{siteServices.length > 1 ? "s" : ""}</p>
                  <Button onClick={() => setShowAddService(true)} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase tracking-widest" data-testid="button-add-service">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                  </Button>
                </div>

                {showAddService && (
                  <Card className="border-2 border-auto-red/20 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center"><h3 className="font-black uppercase text-sm">{editingServiceId ? "Modifier la prestation" : "Nouvelle prestation"}</h3><Button variant="ghost" size="sm" onClick={() => { setShowAddService(false); setEditingServiceId(null); setServiceForm(defaultServiceForm); }}><X className="w-4 h-4" /></Button></div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Titre</label><Input value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-service-title" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Slug</label><Input value={serviceForm.slug} onChange={e => setServiceForm(p => ({ ...p, slug: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-service-slug" /></div>
                      </div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Description</label><Textarea value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} className="bg-gray-50 border-gray-200 min-h-[80px]" data-testid="input-service-desc" /></div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Image (URL)</label><Input value={serviceForm.image} onChange={e => setServiceForm(p => ({ ...p, image: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-service-image" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Badge</label><Input value={serviceForm.badge} onChange={e => setServiceForm(p => ({ ...p, badge: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-service-badge" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Prix</label><Input value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-service-price" /></div>
                      </div>
                      <Button onClick={() => {
                        if (editingServiceId) {
                          updateServiceMut.mutate({ id: editingServiceId, data: serviceForm });
                        } else {
                          addServiceMut.mutate(serviceForm);
                        }
                      }} disabled={!serviceForm.title || addServiceMut.isPending || updateServiceMut.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase" data-testid="button-submit-service">
                        {editingServiceId ? (updateServiceMut.isPending ? "Modification..." : "Modifier la prestation") : (addServiceMut.isPending ? "Ajout..." : "Ajouter la prestation")}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {siteServices.map(svc => (
                    <Card key={svc.id} className="border-0 shadow-sm" data-testid={`card-service-${svc.id}`}>
                      <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        {svc.image && (
                          <div className="w-full sm:w-20 h-40 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                            <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 w-full">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-black text-base uppercase">{svc.title}</h4>
                              {svc.badge && <Badge className="bg-auto-red text-white text-[10px]">{svc.badge}</Badge>}
                              {svc.price && <span className="text-xs font-bold text-gray-400">{svc.price}</span>}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{svc.description}</p>
                          </div>
                            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                              <Button variant="outline" size="sm" className="text-[10px] font-bold h-8 flex-1 sm:flex-none" onClick={() => {
                                setServiceForm({
                                  title: svc.title,
                                  description: svc.description,
                                  image: svc.image,
                                  badge: svc.badge || "",
                                  features: (svc.features as string[]) || [],
                                  price: svc.price || "",
                                  slug: svc.slug || "",
                                  sortOrder: svc.sortOrder || 0,
                                  published: svc.published ?? true
                                });
                                setEditingServiceId(svc.id.toString());
                                setShowAddService(true);
                              }} data-testid={`button-edit-service-${svc.id}`}>
                                <Edit2 className="w-3 h-3 mr-1" /> Modifier
                              </Button>
                              <Button variant="outline" size="sm" className="text-[10px] font-bold h-8 text-red-500 hover:bg-red-50 flex-1 sm:flex-none" onClick={() => deleteServiceMut.mutate(svc.id)} data-testid={`button-delete-service-${svc.id}`}>
                                <Trash2 className="w-3 h-3 mr-1" /> Supprimer
                              </Button>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── AVIS ── */}
            {tab === "avis" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 font-bold">{testimonials.length} avis client{testimonials.length > 1 ? "s" : ""}</p>
                  <Button onClick={() => setShowAddTestimonial(true)} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase tracking-widest" data-testid="button-add-testimonial">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                  </Button>
                </div>

                {showAddTestimonial && (
                  <Card className="border-2 border-auto-red/20 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center"><h3 className="font-black uppercase text-sm">Nouvel avis</h3><Button variant="ghost" size="sm" onClick={() => setShowAddTestimonial(false)}><X className="w-4 h-4" /></Button></div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Nom</label><Input value={testimonialForm.name} onChange={e => setTestimonialForm(p => ({ ...p, name: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-testimonial-name" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Ville</label><Input value={testimonialForm.location} onChange={e => setTestimonialForm(p => ({ ...p, location: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-testimonial-location" /></div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Note (1-5)</label><Input type="number" min={1} max={5} value={testimonialForm.rating} onChange={e => setTestimonialForm(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-testimonial-rating" /></div>
                      </div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Véhicule</label><Input value={testimonialForm.vehicle} onChange={e => setTestimonialForm(p => ({ ...p, vehicle: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-testimonial-vehicle" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Commentaire</label><Textarea value={testimonialForm.content} onChange={e => setTestimonialForm(p => ({ ...p, content: e.target.value }))} className="bg-gray-50 border-gray-200 min-h-[80px]" data-testid="input-testimonial-content" /></div>
                      <Button onClick={() => addTestimonialMut.mutate(testimonialForm)} disabled={!testimonialForm.name || !testimonialForm.content || addTestimonialMut.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase" data-testid="button-submit-testimonial">
                        {addTestimonialMut.isPending ? "Ajout..." : "Ajouter l'avis"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {testimonials.map(t => (
                    <Card key={t.id} className="border-0 shadow-sm" data-testid={`card-testimonial-${t.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-black text-sm uppercase">{t.name}</h4>
                              <span className="text-xs text-gray-400 font-bold">{t.location}</span>
                              <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
                            </div>
                            {t.vehicle && <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{t.vehicle}</p>}
                            <p className="text-sm text-gray-600 italic">"{t.content}"</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteTestimonialMut.mutate(t.id)} className="text-gray-300 hover:text-red-500 shrink-0" data-testid={`button-delete-testimonial-${t.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQ (hidden from sidebar but accessible) ── */}
            {tab === "faq" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 font-bold">{faqItems.length} question{faqItems.length > 1 ? "s" : ""}</p>
                  <Button onClick={() => setShowAddFaq(true)} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase tracking-widest" data-testid="button-add-faq">
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                  </Button>
                </div>

                {showAddFaq && (
                  <Card className="border-2 border-auto-red/20 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-center"><h3 className="font-black uppercase text-sm">Nouvelle FAQ</h3><Button variant="ghost" size="sm" onClick={() => setShowAddFaq(false)}><X className="w-4 h-4" /></Button></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Question</label><Input value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-faq-question" /></div>
                      <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Réponse</label><Textarea value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} className="bg-gray-50 border-gray-200 min-h-[100px]" data-testid="input-faq-answer" /></div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Catégorie</label>
                          <select value={faqForm.category} onChange={e => setFaqForm(p => ({ ...p, category: e.target.value }))} className="w-full h-10 bg-gray-50 border border-gray-200 rounded-md px-3 text-sm" data-testid="select-faq-category">
                            <option value="general">Général</option><option value="services">Services</option><option value="tarifs">Tarifs</option><option value="livraison">Livraison</option>
                          </select>
                        </div>
                        <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Ordre</label><Input type="number" value={faqForm.sortOrder} onChange={e => setFaqForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-faq-order" /></div>
                      </div>
                      <Button onClick={() => addFaqMut.mutate(faqForm)} disabled={!faqForm.question || !faqForm.answer || addFaqMut.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase" data-testid="button-submit-faq">
                        {addFaqMut.isPending ? "Ajout..." : "Ajouter la FAQ"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {faqItems.map(faq => (
                    <Card key={faq.id} className="border-0 shadow-sm" data-testid={`card-faq-${faq.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <HelpCircle className="w-4 h-4 text-auto-red shrink-0" />
                              <h4 className="font-black text-sm">{faq.question}</h4>
                              <Badge variant="outline" className="text-[10px]">{faq.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-500 pl-7">{faq.answer}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteFaqMut.mutate(faq.id)} className="text-gray-300 hover:text-red-500 shrink-0" data-testid={`button-delete-faq-${faq.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── LIENS / NAVIGATION ── */}
            {tab === "liens" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="border-b border-gray-100 p-8">
                    <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                      <Link2 className="w-5 h-5 text-auto-red" /> Liens de navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {[
                      { key: "links.phone", label: "Téléphone" },
                      { key: "links.email", label: "Email" },
                      { key: "links.address", label: "Adresse" },
                      { key: "links.facebook", label: "Facebook" },
                      { key: "links.instagram", label: "Instagram" },
                      { key: "links.tiktok", label: "TikTok" },
                      { key: "links.google_maps", label: "Google Maps" },
                      { key: "links.booking_url", label: "URL de réservation" },
                    ].map(field => {
                      const currentVal = getVal(field.key);
                      const isDirty = contentEdits[field.key] !== undefined && contentEdits[field.key] !== contentMap[field.key];
                      return (
                        <div key={field.key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-[0.1em] text-gray-500">{field.label}</label>
                            {isDirty && (
                              <Button size="sm" onClick={() => saveContent(field.key)} disabled={savingContent[field.key]} className="h-7 bg-auto-red text-white text-[10px] font-black uppercase px-4 shadow-lg shadow-auto-red/20">
                                <Save className="w-3 h-3 mr-2" /> Enregistrer
                              </Button>
                            )}
                          </div>
                          <Input value={currentVal} onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))} className="h-12 bg-gray-50 border-gray-200 rounded-xl px-4 font-medium" data-testid={`input-link-${field.key}`} />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ── MEDIATHEQUE ── */}
            {tab === "medias" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 font-bold">{mediaFiles.length} fichier{mediaFiles.length > 1 ? "s" : ""}</p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <input
                      type="file"
                      id="media-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          await apiRequest("POST", "/api/admin/upload", formData);
                          queryClient.invalidateQueries({ queryKey: ["/api/admin/media"] });
                          toast({ title: "Fichier ajouté" });
                        } catch (err) {
                          toast({ title: "Erreur d'upload", variant: "destructive" });
                        }
                      }}
                    />
                    <Button onClick={() => document.getElementById("media-upload")?.click()} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase tracking-widest w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" /> Téléverser
                    </Button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mediaFiles.map(file => (
                    <Card key={file.id} className="border-0 shadow-sm overflow-hidden group" data-testid={`card-media-${file.id}`}>
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {file.mimeType?.startsWith("image/") ? (
                          <img src={file.url} alt={file.filename} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <FileText className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs font-bold truncate mb-2" title={file.filename}>{file.filename}</p>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" className="flex-1 text-[9px] font-bold h-7" onClick={() => copyToClipboard(file.url)} data-testid={`button-copy-media-${file.id}`}>
                            {copiedUrl === file.url ? <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> : <Globe className="w-3 h-3 mr-1" />}
                            {copiedUrl === file.url ? "Copié" : "URL"}
                          </Button>
                          <Button variant="outline" size="sm" className="text-[9px] font-bold h-7 text-red-500 hover:bg-red-50" onClick={() => deleteMediaMut.mutate(file.id)} data-testid={`button-delete-media-${file.id}`}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* ── PROFIL & SÉCURITÉ ── */}
            {tab === "profil" && (
              <div className="space-y-6">

                {/* Profile card */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="border-b border-gray-100 p-8">
                    <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                      <User className="w-5 h-5 text-auto-red" /> Mon Profil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-auto-red flex items-center justify-center text-white font-black text-2xl uppercase">
                        {profile?.username?.[0] || "A"}
                      </div>
                      <div>
                        <p className="font-black text-xl text-gray-900">{profile?.username || "—"}</p>
                        <p className="text-sm text-gray-400">{profile?.isAdmin ? "Administrateur" : "Utilisateur"}</p>
                        <p className="text-xs text-gray-400 mt-1">{profile?.email || "Aucun email associé"}</p>
                      </div>
                    </div>

                    {/* Change email */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-gray-100">
                      <h4 className="text-xs font-black uppercase tracking-[0.15em] text-gray-500">Adresse email (pour reset mot de passe)</h4>
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          value={profileEmail}
                          onChange={e => setProfileEmail(e.target.value)}
                          placeholder="votre@email.com"
                          className="h-11 bg-gray-50 border-gray-200"
                          data-testid="input-profile-email"
                        />
                        <Button
                          onClick={() => { if (profileEmail) changeEmailMut.mutate(profileEmail); }}
                          disabled={!profileEmail || changeEmailMut.isPending}
                          className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase shrink-0 px-4"
                          data-testid="button-save-email"
                        >
                          <Save className="w-4 h-4 mr-2" /> Enregistrer
                        </Button>
                      </div>
                    </div>

                    {/* Change password */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.15em] text-gray-500 flex items-center gap-2"><KeyRound className="w-4 h-4 text-auto-red" /> Changer le mot de passe</h4>
                      <div className="space-y-3">
                        {(["current", "next", "confirm"] as const).map(field => (
                          <div key={field} className="relative">
                            <Input
                              type={showPw[field] ? "text" : "password"}
                              placeholder={field === "current" ? "Mot de passe actuel" : field === "next" ? "Nouveau mot de passe (min. 8 car.)" : "Confirmer le nouveau mot de passe"}
                              value={pwForm[field]}
                              onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
                              className="h-11 bg-gray-50 border-gray-200 pr-12"
                              data-testid={`input-pw-${field}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            >
                              {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          if (pwForm.next !== pwForm.confirm) { toast({ title: "Les mots de passe ne correspondent pas", variant: "destructive" }); return; }
                          if (pwForm.next.length < 8) { toast({ title: "Le mot de passe doit faire au moins 8 caractères", variant: "destructive" }); return; }
                          changePasswordMut.mutate({ currentPassword: pwForm.current, newPassword: pwForm.next });
                        }}
                        disabled={!pwForm.current || !pwForm.next || !pwForm.confirm || changePasswordMut.isPending}
                        className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase"
                        data-testid="button-change-password"
                      >
                        {changePasswordMut.isPending ? "Modification..." : "Modifier le mot de passe"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* User management */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="border-b border-gray-100 p-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                        <Users className="w-5 h-5 text-auto-red" /> Gestion des utilisateurs
                      </CardTitle>
                      <Button onClick={() => setShowAddUser(true)} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase" data-testid="button-add-user">
                        <UserPlus className="w-4 h-4 mr-2" /> Ajouter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    {showAddUser && (
                      <Card className="border-2 border-auto-red/20 shadow-lg">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-black uppercase text-sm">Nouvel utilisateur</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddUser(false)}><X className="w-4 h-4" /></Button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Identifiant</label><Input value={newUserForm.username} onChange={e => setNewUserForm(p => ({ ...p, username: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" placeholder="ex: contact@myjantes.com" data-testid="input-user-username" /></div>
                            <div><label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Email (pour reset MDP)</label><Input type="email" value={newUserForm.email} onChange={e => setNewUserForm(p => ({ ...p, email: e.target.value }))} className="h-10 bg-gray-50 border-gray-200" data-testid="input-user-email" /></div>
                          </div>
                          <div className="relative">
                            <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Mot de passe (min. 8 car.)</label>
                            <Input type={showPw.next ? "text" : "password"} value={newUserForm.password} onChange={e => setNewUserForm(p => ({ ...p, password: e.target.value }))} className="h-10 bg-gray-50 border-gray-200 pr-12" data-testid="input-user-password" />
                            <button type="button" onClick={() => setShowPw(p => ({ ...p, next: !p.next }))} className="absolute right-3 top-[30px] text-gray-400 hover:text-gray-700">{showPw.next ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={newUserForm.isAdmin} onChange={e => setNewUserForm(p => ({ ...p, isAdmin: e.target.checked }))} className="w-4 h-4 accent-auto-red" />
                            <span className="text-sm font-bold text-gray-700">Accès administrateur</span>
                          </label>
                          <Button onClick={() => createUserMut.mutate(newUserForm)} disabled={!newUserForm.username || !newUserForm.password || createUserMut.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white font-black text-xs uppercase" data-testid="button-submit-user">
                            {createUserMut.isPending ? "Création..." : "Créer l'utilisateur"}
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {adminUsers.map((u: any) => (
                      <div key={u.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl" data-testid={`row-user-${u.id}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-200 flex items-center justify-center font-black text-gray-500 uppercase">{u.username[0]}</div>
                          <div>
                            <p className="text-sm font-black">{u.username}</p>
                            <p className="text-xs text-gray-400">{u.email || "Sans email"} · {u.isAdmin ? "Admin" : "Utilisateur"}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteUserMut.mutate(u.id)} className="text-gray-300 hover:text-red-500" data-testid={`button-delete-user-${u.id}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Activity logs */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="border-b border-gray-100 p-8">
                    <CardTitle className="text-lg font-black uppercase tracking-widest text-gray-400 flex items-center gap-3">
                      <History className="w-5 h-5 text-auto-red" /> Historique des modifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    {activityLogs.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">Aucun événement enregistré</p>
                    ) : (
                      <div className="space-y-2">
                        {activityLogs.slice(0, 100).map((log: any) => (
                          <div key={log.id} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0" data-testid={`row-log-${log.id}`}>
                            <div className="w-2 h-2 rounded-full bg-auto-red mt-2 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800">{log.action}</p>
                              {log.details && <p className="text-xs text-gray-400 mt-0.5">{log.details}</p>}
                              <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">{log.category}</p>
                            </div>
                            <span className="text-[10px] text-gray-300 shrink-0 mt-0.5">
                              {new Date(log.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const resetToken = new URLSearchParams(window.location.search).get("reset");
  if (resetToken) return <ResetPasswordForm token={resetToken} onDone={() => { window.history.replaceState({}, "", "/admin"); setLocation("/admin"); }} />;
  return <AdminApp />;
}
