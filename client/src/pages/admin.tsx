import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  LogOut, Image, Star, HelpCircle, CheckCircle2,
  Clock, XCircle, Eye, Trash2, MessageSquare, LayoutDashboard,
  Lock, User, Plus, X, Phone,
  Edit2, Save, Wrench, FileText, Globe, Type, Settings, Monitor, Images,
  TrendingUp, Link2, MousePointerClick, Users, Activity, ChevronRight, Menu,
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
  { key: "trust_item_4", label: "Bande de confiance — Item 4", category: "trust" },
  { key: "trust_item_5", label: "Bande de confiance — Item 5", category: "trust" },
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
    <div className="min-h-screen bg-auto-dark flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-16 mx-auto mb-6 brightness-0 invert" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Administration</h1>
          <p className="text-white/40 text-sm mt-2 font-medium">Connectez-vous pour gérer votre site</p>
        </div>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Identifiant</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input type="email" value={username} onChange={e => setUsername(e.target.value)} className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-auto-red/50" placeholder="contact@myjantes.com" required />
                </div>
              </div>
              <div>
                <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black mb-2 block">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-auto-red/50" placeholder="••••••••" required />
                </div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-xs font-bold flex items-center gap-2"><XCircle className="w-4 h-4" /> {error}</div>}
              <Button type="submit" className="w-full bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black h-12 text-sm uppercase tracking-widest transition-all hover:scale-[1.02]" disabled={loading}>
                {loading ? <span className="animate-pulse">Connexion...</span> : "Accéder au panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Admin() {
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

  const { data: contacts = [] } = useQuery<ContactRequest[]>({ queryKey: ["/api/admin/contacts"], enabled: authenticated === true });
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
    { id: "contenu", label: "Configuration", icon: Settings },
    { id: "liens", label: "Navigation", icon: Link2 },
    { id: "medias", label: "Médiathèque", icon: Images },
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
                onClick={() => setTab(item.id)}
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
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            
            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Visites totales", value: analytics?.totalViews ?? 0, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Contacts reçus", value: analytics?.totalContacts ?? 0, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Nouveaux", value: analytics?.newContacts ?? 0, icon: Activity, color: "text-auto-red", bg: "bg-red-50", important: true },
                    { label: "Avis Clients", value: analytics?.totalTestimonials ?? 0, icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
                  ].map((kpi, i) => (
                    <Card key={i} className={`border-0 shadow-sm overflow-hidden ${kpi.important && (kpi.value > 0) ? "ring-2 ring-auto-red" : ""}`}>
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${kpi.bg}`}>
                          <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                        </div>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{(kpi.value || 0).toLocaleString("fr-FR")}</p>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-2">{kpi.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-sm p-6">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400">
                      <TrendingUp className="w-4 h-4 text-auto-red" /> Évolution du trafic
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics?.viewsByDay ?? []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={d => d.split("-")[2]} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={4} dot={false} animationDuration={1000} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="border-0 shadow-sm p-6">
                    <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-400">
                      <MessageSquare className="w-4 h-4 text-auto-red" /> Dernières demandes
                    </h3>
                    <div className="space-y-4">
                      {contacts.slice(0, 5).map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setTab("contacts")}>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-gray-900 truncate">{c.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">{c.vehicle || "Sans véhicule"}</p>
                          </div>
                          <Badge className={c.status === "nouveau" ? "bg-auto-red text-white" : "bg-gray-200 text-gray-500"}>
                            {c.status.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* ── CONTACTS ── */}
            {tab === "contacts" && (
              <div className="space-y-4">
                {contacts.map(c => (
                  <Card key={c.id} className="border-0 shadow-sm group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-black uppercase tracking-tight">{c.name} {c.firstName}</h3>
                              <Badge className={c.status === "nouveau" ? "bg-blue-500" : "bg-green-500"}>{c.status}</Badge>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(c.createdAt!).toLocaleDateString("fr-FR")}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Email</p>
                              <p className="text-xs font-bold truncate">{c.email}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Téléphone</p>
                              <p className="text-xs font-bold">{c.phone}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Véhicule</p>
                              <p className="text-xs font-bold">{c.vehicle || "—"}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Jantes</p>
                              <p className="text-xs font-bold">{c.nbWheels || "—"}</p>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-sm text-gray-700">
                            "{c.message}"
                          </div>
                        </div>
                        {c.imageUrl && (
                          <div className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
                            <a href={c.imageUrl} target="_blank" rel="noreferrer">
                              <img src={c.imageUrl} className="w-full h-full object-cover transition-transform hover:scale-110" />
                            </a>
                          </div>
                        )}
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

            {/* Fallback for other tabs */}
            {tab !== "dashboard" && tab !== "contacts" && tab !== "contenu" && (
              <Card className="border-0 shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Wrench className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Interface en maintenance</h3>
                <p className="text-gray-400 text-sm font-medium">Cette section est en cours de refonte vers le nouveau design.</p>
                <Button variant="outline" className="mt-6 border-gray-200" onClick={() => setTab("dashboard")}>Retour au tableau de bord</Button>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
