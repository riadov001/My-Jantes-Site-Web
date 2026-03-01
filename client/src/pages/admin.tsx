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
  Wrench, FileText, Globe, Type, Settings
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
                    data-testid="input-admin-username"
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
                    data-testid="input-admin-password"
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
                data-testid="button-admin-login"
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
  { value: "Montserrat", label: "Montserrat (actuelle)" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Raleway", label: "Raleway" },
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
];

const CONTENT_FIELDS: { key: string; label: string; category: string; multiline?: boolean; type?: "json-array-simple" | "json-stats" | "font-select" }[] = [
  { key: "hero.badge", label: "Badge hero (texte sur fond rouge)", category: "hero" },
  { key: "hero.title_line1", label: "Titre hero — ligne 1", category: "hero" },
  { key: "hero.title_line2", label: "Titre hero — ligne 2 (accent rouge)", category: "hero" },
  { key: "hero.subtitle", label: "Sous-titre hero", category: "hero", multiline: true },
  { key: "hero.cta_primary", label: "Bouton principal (devis)", category: "hero" },
  { key: "hero.cta_gallery", label: "Bouton galerie", category: "hero" },
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
  { key: "typography.font", label: "Police d'écriture principale", category: "typography", type: "font-select" },
];

const CATEGORY_LABELS: Record<string, string> = {
  hero: "Section Hero",
  stats: "Statistiques",
  trust: "Bande de confiance",
  contact: "Coordonnées & Contact",
  sections: "Titres des sections",
  typography: "Typographie",
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

  const update = (i: number, v: string) => {
    const next = [...parsed];
    next[i] = v;
    onChange(JSON.stringify(next));
  };
  const add = () => onChange(JSON.stringify([...parsed, ""]));
  const remove = (i: number) => onChange(JSON.stringify(parsed.filter((_, idx) => idx !== i)));

  return (
    <div className="space-y-2">
      {parsed.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item} onChange={e => update(i, e.target.value)} className="h-8 text-sm flex-grow" />
          <button onClick={() => remove(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-auto-red font-semibold flex items-center gap-1 hover:underline">
        <Plus className="w-3 h-3" /> Ajouter un élément
      </button>
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
          <button onClick={() => remove(i)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-50 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs text-auto-red font-semibold flex items-center gap-1 hover:underline">
        <Plus className="w-3 h-3" /> Ajouter une caractéristique
      </button>
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
    onSuccess: () => {
      setAuthenticated(false);
      setLocation("/");
    },
  });

  const { data: contacts = [], isLoading: loadingContacts } = useQuery<ContactRequest[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: authenticated === true,
  });

  const { data: gallery = [], isLoading: loadingGallery } = useQuery<GalleryItem[]>({
    queryKey: ["/api/admin/gallery"],
    enabled: authenticated === true,
  });

  const { data: testimonials = [], isLoading: loadingTestimonials } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    enabled: authenticated === true,
  });

  const { data: faqItems = [], isLoading: loadingFaq } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq"],
    enabled: authenticated === true,
  });

  const { data: siteServices = [], isLoading: loadingServices } = useQuery<SiteService[]>({
    queryKey: ["/api/admin/services"],
    enabled: authenticated === true,
  });

  const { data: siteContentItems = [], isLoading: loadingContent } = useQuery<SiteContent[]>({
    queryKey: ["/api/admin/site-content"],
    enabled: authenticated === true,
  });

  const contentMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const item of siteContentItems) {
      m[item.key] = item.value;
    }
    return m;
  }, [siteContentItems]);

  const getContentValue = (key: string) => {
    return contentEdits[key] !== undefined ? contentEdits[key] : (contentMap[key] ?? "");
  };

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    if (contactSearch.trim()) {
      const q = contactSearch.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        c.message.toLowerCase().includes(q) ||
        (c.service && c.service.toLowerCase().includes(q))
      );
    }
    if (contactStatusFilter !== "all") {
      result = result.filter(c => c.status === contactStatusFilter);
    }
    result.sort((a, b) => {
      const da = new Date(a.createdAt!).getTime();
      const db = new Date(b.createdAt!).getTime();
      return contactSort === "newest" ? db - da : da - db;
    });
    return result;
  }, [contacts, contactSearch, contactStatusFilter, contactSort]);

  const updateContactStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/admin/contacts/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Statut mis à jour" }); },
  });

  const deleteContact = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/contacts/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }); toast({ title: "Contact supprimé" }); },
  });

  const toggleGallery = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/gallery/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }),
  });

  const deleteGallery = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }); toast({ title: "Photo supprimée" }); },
  });

  const createGallery = useMutation({
    mutationFn: (data: typeof galleryForm) => apiRequest("POST", "/api/admin/gallery", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setShowAddGallery(false);
      setGalleryForm({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" });
      toast({ title: "Photo ajoutée" });
    },
  });

  const updateGallery = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof galleryForm }) =>
      apiRequest("PUT", `/api/admin/gallery/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      setEditingGalleryId(null);
      setGalleryForm({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" });
      toast({ title: "Photo mise à jour" });
    },
  });

  const toggleTestimonial = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/testimonials/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }),
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }); toast({ title: "Avis supprimé" }); },
  });

  const createTestimonial = useMutation({
    mutationFn: (data: typeof testimonialForm) => apiRequest("POST", "/api/admin/testimonials", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setShowAddTestimonial(false);
      setTestimonialForm({ name: "", location: "", rating: 5, content: "", vehicle: "" });
      toast({ title: "Avis ajouté" });
    },
  });

  const updateTestimonial = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof testimonialForm }) =>
      apiRequest("PUT", `/api/admin/testimonials/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setEditingTestimonialId(null);
      setTestimonialForm({ name: "", location: "", rating: 5, content: "", vehicle: "" });
      toast({ title: "Avis mis à jour" });
    },
  });

  const toggleFaq = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/faq/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }),
  });

  const deleteFaq = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/faq/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }); toast({ title: "FAQ supprimée" }); },
  });

  const createFaq = useMutation({
    mutationFn: (data: typeof faqForm) => apiRequest("POST", "/api/admin/faq", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/faq"] });
      setShowAddFaq(false);
      setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 });
      toast({ title: "FAQ ajoutée" });
    },
  });

  const updateFaq = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof faqForm }) =>
      apiRequest("PUT", `/api/admin/faq/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/faq"] });
      setEditingFaqId(null);
      setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 });
      toast({ title: "FAQ mise à jour" });
    },
  });

  const toggleService = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/services/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/services"] }),
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/services/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/services"] }); toast({ title: "Prestation supprimée" }); },
  });

  const createService = useMutation({
    mutationFn: (data: typeof serviceForm) => apiRequest("POST", "/api/admin/services", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setShowAddService(false);
      setServiceForm(defaultServiceForm);
      toast({ title: "Prestation ajoutée" });
    },
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof serviceForm }) =>
      apiRequest("PUT", `/api/admin/services/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setEditingServiceId(null);
      setServiceForm(defaultServiceForm);
      toast({ title: "Prestation mise à jour" });
    },
  });

  const saveContent = async (key: string) => {
    const value = getContentValue(key);
    const field = CONTENT_FIELDS.find(f => f.key === key);
    setSavingContent(p => ({ ...p, [key]: true }));
    try {
      await apiRequest("PUT", `/api/admin/site-content/${key}`, {
        value,
        label: field?.label ?? key,
        category: field?.category ?? "general",
      });
      qc.invalidateQueries({ queryKey: ["/api/admin/site-content"] });
      qc.invalidateQueries({ queryKey: ["/api/site-content"] });
      setContentEdits(p => { const n = { ...p }; delete n[key]; return n; });
      toast({ title: "Contenu sauvegardé" });
    } catch {
      toast({ title: "Erreur de sauvegarde", variant: "destructive" });
    } finally {
      setSavingContent(p => ({ ...p, [key]: false }));
    }
  };

  const startEditGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setShowAddGallery(false);
    setGalleryForm({ title: item.title, serviceType: item.serviceType, afterImage: item.afterImage, beforeImage: item.beforeImage || "", description: item.description || "" });
  };

  const startEditTestimonial = (item: Testimonial) => {
    setEditingTestimonialId(item.id);
    setShowAddTestimonial(false);
    setTestimonialForm({ name: item.name, location: item.location || "", rating: item.rating, content: item.content, vehicle: item.vehicle || "" });
  };

  const startEditFaq = (item: FaqItem) => {
    setEditingFaqId(item.id);
    setShowAddFaq(false);
    setFaqForm({ question: item.question, answer: item.answer, category: item.category || "general", sortOrder: item.sortOrder || 0 });
  };

  const startEditService = (item: SiteService) => {
    setEditingServiceId(item.id);
    setShowAddService(false);
    setServiceForm({
      title: item.title,
      description: item.description,
      image: item.image,
      badge: item.badge,
      features: (item.features as string[]) || [],
      price: item.price,
      slug: item.slug,
      sortOrder: item.sortOrder,
      published: item.published,
    });
  };

  const cancelEditGallery = () => { setEditingGalleryId(null); setGalleryForm({ title: "", serviceType: "renovation", afterImage: "", beforeImage: "", description: "" }); };
  const cancelEditTestimonial = () => { setEditingTestimonialId(null); setTestimonialForm({ name: "", location: "", rating: 5, content: "", vehicle: "" }); };
  const cancelEditFaq = () => { setEditingFaqId(null); setFaqForm({ question: "", answer: "", category: "general", sortOrder: 0 }); };
  const cancelEditService = () => { setEditingServiceId(null); setServiceForm(defaultServiceForm); };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-auto-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-auto-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authenticated === false) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  const newContacts = contacts.filter(c => c.status === "nouveau").length;
  const enCoursContacts = contacts.filter(c => c.status === "en_cours").length;
  const publishedGallery = gallery.filter(g => g.published).length;
  const publishedTestimonials = testimonials.filter(t => t.published).length;
  const publishedServices = siteServices.filter(s => s.published).length;

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "contacts", label: "Contacts / Devis", icon: MessageSquare, count: newContacts },
    { id: "galerie", label: "Galerie", icon: Image, count: gallery.length },
    { id: "prestations", label: "Prestations", icon: Wrench, count: siteServices.length },
    { id: "avis", label: "Avis Clients", icon: Star, count: testimonials.length },
    { id: "faq", label: "FAQ", icon: HelpCircle, count: faqItems.length },
    { id: "contenu", label: "Contenu du site", icon: Settings },
  ];

  const contentCategories = Array.from(new Set(CONTENT_FIELDS.map(f => f.category)));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-auto-dark border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo-myjantes.png" alt="MyJantes" className="h-8 brightness-0 invert" />
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span>Administration</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors" data-testid="link-admin-site">
              <ExternalLink className="w-3.5 h-3.5" /> Voir le site
            </a>
            <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors" data-testid="link-admin-app">
              <ExternalLink className="w-3.5 h-3.5" /> Espace client
            </a>
            <span className="text-white/40 text-xs hidden sm:block">contact@myjantes.com</span>
            <Button variant="outline" size="sm" className="border-white/20 text-white/70 hover:text-white bg-transparent font-semibold text-xs" onClick={() => logoutMutation.mutate()} data-testid="button-admin-logout">
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Nouveaux devis", value: newContacts, color: "text-blue-600", bg: "bg-blue-50", sub: `${enCoursContacts} en cours` },
            { label: "Photos galerie", value: gallery.length, color: "text-auto-red", bg: "bg-red-50", sub: `${publishedGallery} publiée(s)` },
            { label: "Prestations", value: siteServices.length, color: "text-purple-600", bg: "bg-purple-50", sub: `${publishedServices} publiée(s)` },
            { label: "Avis clients", value: testimonials.length, color: "text-amber-600", bg: "bg-amber-50", sub: `${publishedTestimonials} publié(s)` },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className={`p-5 ${s.bg} rounded-xl`}>
                <p className={`text-3xl font-black ${s.color}`} data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`tab-${t.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-auto-red text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${tab === t.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTACTS TAB */}
        {tab === "contacts" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Rechercher par nom, email, téléphone, message..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} className="pl-10" data-testid="input-contact-search" />
              </div>
              <div className="flex gap-2">
                <select value={contactStatusFilter} onChange={e => setContactStatusFilter(e.target.value)} className="h-10 border rounded-md px-3 text-sm bg-white" data-testid="select-contact-filter">
                  <option value="all">Tous les statuts</option>
                  <option value="nouveau">Nouveaux</option>
                  <option value="en_cours">En cours</option>
                  <option value="traite">Traités</option>
                  <option value="annule">Annulés</option>
                </select>
                <button onClick={() => setContactSort(s => s === "newest" ? "oldest" : "newest")} className="h-10 px-3 border rounded-md bg-white text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-1.5" data-testid="button-contact-sort">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {contactSort === "newest" ? "Récents" : "Anciens"}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">{filteredContacts.length} résultat(s) sur {contacts.length}</p>
            <div className="space-y-3">
              {loadingContacts ? (
                <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-30" /><p>Chargement...</p></CardContent></Card>
              ) : filteredContacts.length === 0 ? (
                <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><Mail className="w-8 h-8 mx-auto mb-3 opacity-30" /><p>{contacts.length === 0 ? "Aucune demande de contact" : "Aucun résultat pour cette recherche"}</p></CardContent></Card>
              ) : filteredContacts.map(contact => {
                const s = statusConfig[contact.status] || statusConfig.nouveau;
                return (
                  <Card key={contact.id} className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid={`contact-card-${contact.id}`}>
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${s.color}`}>
                              <s.icon className="w-3 h-3" /> {s.label}
                            </span>
                            <span className="text-gray-400 text-xs">{new Date(contact.createdAt!).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                            {contact.service && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{contact.service}</span>}
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">{contact.name}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                            <a href={`mailto:${contact.email}`} className="hover:text-auto-red flex items-center gap-1" data-testid={`link-contact-email-${contact.id}`}><Mail className="w-3.5 h-3.5" />{contact.email}</a>
                            {contact.phone && <a href={`tel:${contact.phone}`} className="hover:text-auto-red flex items-center gap-1" data-testid={`link-contact-phone-${contact.id}`}><Phone className="w-3.5 h-3.5" />{contact.phone}</a>}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">{contact.message}</p>
                        </div>
                        <div className="flex sm:flex-col gap-2 shrink-0">
                          {Object.entries(statusConfig).map(([key, cfg]) => (
                            <button
                              key={key}
                              onClick={() => updateContactStatus.mutate({ id: contact.id, status: key })}
                              data-testid={`button-status-${key}-${contact.id}`}
                              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${contact.status === key ? cfg.color + " border-current" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                            >
                              {cfg.label}
                            </button>
                          ))}
                          <button
                            onClick={() => { if (confirm("Supprimer ce contact ?")) deleteContact.mutate(contact.id); }}
                            className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-1"
                            data-testid={`button-delete-contact-${contact.id}`}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* GALERIE TAB */}
        {tab === "galerie" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{gallery.length} photo(s) · {publishedGallery} publiée(s)</p>
              <Button size="sm" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-semibold" onClick={() => { setShowAddGallery(!showAddGallery); cancelEditGallery(); }} data-testid="button-add-gallery">
                {showAddGallery ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter une photo</>}
              </Button>
            </div>
            {(showAddGallery || editingGalleryId) && (
              <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{editingGalleryId ? "Modifier la photo" : "Nouvelle photo"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Titre *</label>
                      <Input value={galleryForm.title} onChange={e => setGalleryForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Rénovation jantes BMW" data-testid="input-gallery-title" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Type de service</label>
                      <select value={galleryForm.serviceType} onChange={e => setGalleryForm(p => ({ ...p, serviceType: e.target.value }))} className="w-full h-10 border rounded-md px-3 text-sm" data-testid="select-gallery-type">
                        <option value="renovation">Rénovation</option>
                        <option value="peinture">Peinture</option>
                        <option value="soudure">Soudure</option>
                        <option value="sablage">Sablage</option>
                        <option value="devoilage">Devoilage</option>
                        <option value="personnalisation">Personnalisation</option>
                        <option value="hydrodipping">Hydrodipping</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Image après (URL) *</label>
                      <Input value={galleryForm.afterImage} onChange={e => setGalleryForm(p => ({ ...p, afterImage: e.target.value }))} placeholder="https://..." data-testid="input-gallery-after" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Image avant (URL, optionnel)</label>
                      <Input value={galleryForm.beforeImage} onChange={e => setGalleryForm(p => ({ ...p, beforeImage: e.target.value }))} placeholder="https://..." data-testid="input-gallery-before" />
                    </div>
                  </div>
                  {(galleryForm.afterImage || galleryForm.beforeImage) && (
                    <div className="flex gap-4 mb-4">
                      {galleryForm.afterImage && <div className="w-24 h-24 rounded-lg overflow-hidden border"><img src={galleryForm.afterImage} alt="Aperçu après" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
                      {galleryForm.beforeImage && <div className="w-24 h-24 rounded-lg overflow-hidden border"><img src={galleryForm.beforeImage} alt="Aperçu avant" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} /></div>}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                    <Textarea value={galleryForm.description} onChange={e => setGalleryForm(p => ({ ...p, description: e.target.value }))} placeholder="Description de la réalisation..." rows={2} data-testid="input-gallery-desc" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { if (editingGalleryId) updateGallery.mutate({ id: editingGalleryId, data: galleryForm }); else createGallery.mutate(galleryForm); }} disabled={!galleryForm.title || !galleryForm.afterImage || createGallery.isPending || updateGallery.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white border-0" data-testid="button-submit-gallery">
                      {editingGalleryId ? (updateGallery.isPending ? "Mise à jour..." : <><Save className="w-4 h-4 mr-1" /> Enregistrer</>) : (createGallery.isPending ? "Ajout en cours..." : "Ajouter la photo")}
                    </Button>
                    {editingGalleryId && <Button variant="outline" onClick={cancelEditGallery}>Annuler</Button>}
                  </div>
                </CardContent>
              </Card>
            )}
            {loadingGallery ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-30" /><p>Chargement...</p></CardContent></Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map(item => (
                  <Card key={item.id} className={`border-0 shadow-sm overflow-hidden group ${editingGalleryId === item.id ? 'ring-2 ring-auto-red' : ''}`} data-testid={`gallery-card-${item.id}`}>
                    <div className="relative aspect-square">
                      <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button onClick={() => startEditGallery(item)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-blue-50" title="Modifier" data-testid={`button-edit-gallery-${item.id}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                        <button onClick={() => toggleGallery.mutate({ id: item.id, published: !item.published })} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100" title={item.published ? "Dépublier" : "Publier"} data-testid={`button-toggle-gallery-${item.id}`}><Eye className={`w-4 h-4 ${item.published ? "text-green-600" : "text-gray-400"}`} /></button>
                        <button onClick={() => { if (confirm("Supprimer cette photo ?")) deleteGallery.mutate(item.id); }} className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50" title="Supprimer" data-testid={`button-delete-gallery-${item.id}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.published ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>{item.published ? "Visible" : "Masqué"}</span>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{item.serviceType}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRESTATIONS TAB */}
        {tab === "prestations" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{siteServices.length} prestation(s) · {publishedServices} publiée(s)</p>
              <Button size="sm" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-semibold" onClick={() => { setShowAddService(!showAddService); cancelEditService(); }} data-testid="button-add-service">
                {showAddService ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter une prestation</>}
              </Button>
            </div>

            {(showAddService || editingServiceId) && (
              <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{editingServiceId ? "Modifier la prestation" : "Nouvelle prestation"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Titre *</label>
                      <Input value={serviceForm.title} onChange={e => setServiceForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Rénovation complète" data-testid="input-service-title" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Badge (affiché sur la carte)</label>
                      <Input value={serviceForm.badge} onChange={e => setServiceForm(p => ({ ...p, badge: e.target.value }))} placeholder="Ex: Best-seller, Réparation..." data-testid="input-service-badge" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Description *</label>
                    <Textarea value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} placeholder="Description de la prestation..." rows={3} data-testid="input-service-desc" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Image (URL)</label>
                      <Input value={serviceForm.image} onChange={e => setServiceForm(p => ({ ...p, image: e.target.value }))} placeholder="/images/... ou https://..." data-testid="input-service-image" />
                      {serviceForm.image && (
                        <div className="mt-2 w-24 h-16 rounded overflow-hidden border">
                          <img src={serviceForm.image} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Tarif</label>
                      <Input value={serviceForm.price} onChange={e => setServiceForm(p => ({ ...p, price: e.target.value }))} placeholder="À partir de 120€/jante" data-testid="input-service-price" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Slug URL (ex: renovation-jantes)</label>
                      <Input value={serviceForm.slug} onChange={e => setServiceForm(p => ({ ...p, slug: e.target.value }))} placeholder="renovation-jantes" data-testid="input-service-slug" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Ordre d'affichage</label>
                      <Input type="number" value={serviceForm.sortOrder} onChange={e => setServiceForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} data-testid="input-service-order" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Caractéristiques / Points forts</label>
                    <FeatureListEditor value={serviceForm.features} onChange={v => setServiceForm(p => ({ ...p, features: v }))} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-xs font-medium text-gray-500">Visible sur le site</label>
                    <button
                      onClick={() => setServiceForm(p => ({ ...p, published: !p.published }))}
                      className={`w-10 h-5 rounded-full transition-colors relative ${serviceForm.published ? "bg-green-500" : "bg-gray-300"}`}
                      data-testid="toggle-service-published"
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${serviceForm.published ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-xs text-gray-500">{serviceForm.published ? "Oui" : "Non"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => { if (editingServiceId) updateService.mutate({ id: editingServiceId, data: serviceForm }); else createService.mutate(serviceForm); }}
                      disabled={!serviceForm.title || !serviceForm.description || createService.isPending || updateService.isPending}
                      className="bg-auto-red hover:bg-auto-red-dark text-white border-0"
                      data-testid="button-submit-service"
                    >
                      {editingServiceId ? (updateService.isPending ? "Mise à jour..." : <><Save className="w-4 h-4 mr-1" /> Enregistrer</>) : (createService.isPending ? "Ajout en cours..." : "Ajouter la prestation")}
                    </Button>
                    {editingServiceId && <Button variant="outline" onClick={cancelEditService}>Annuler</Button>}
                  </div>
                </CardContent>
              </Card>
            )}

            {loadingServices ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-30" /><p>Chargement...</p></CardContent></Card>
            ) : siteServices.length === 0 ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><Wrench className="w-8 h-8 mx-auto mb-3 opacity-30" /><p>Aucune prestation</p></CardContent></Card>
            ) : (
              <div className="space-y-3">
                {siteServices.map(s => (
                  <Card key={s.id} className={`border-0 shadow-sm ${editingServiceId === s.id ? 'ring-2 ring-auto-red' : ''}`} data-testid={`service-card-${s.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-gray-900">{s.title}</h3>
                            {s.badge && <span className="text-[10px] font-bold bg-auto-red text-white px-2 py-0.5 rounded-full">{s.badge}</span>}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{s.published ? "Visible" : "Masqué"}</span>
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-1">{s.description}</p>
                          {s.price && <p className="text-xs font-semibold text-auto-red">{s.price}</p>}
                          {(s.features as string[]).length > 0 && (
                            <p className="text-[10px] text-gray-400 mt-1">{(s.features as string[]).length} caractéristique(s)</p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => startEditService(s)} className="w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center" title="Modifier" data-testid={`button-edit-service-${s.id}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                          <button onClick={() => toggleService.mutate({ id: s.id, published: !s.published })} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${s.published ? "border-green-200 bg-green-50 hover:bg-green-100" : "border-gray-200 hover:bg-gray-50"}`} title={s.published ? "Masquer" : "Publier"} data-testid={`button-toggle-service-${s.id}`}><Eye className={`w-4 h-4 ${s.published ? "text-green-600" : "text-gray-400"}`} /></button>
                          <button onClick={() => { if (confirm("Supprimer cette prestation ?")) deleteService.mutate(s.id); }} className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center" title="Supprimer" data-testid={`button-delete-service-${s.id}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AVIS TAB */}
        {tab === "avis" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{testimonials.length} avis · {publishedTestimonials} publié(s)</p>
              <Button size="sm" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-semibold" onClick={() => { setShowAddTestimonial(!showAddTestimonial); cancelEditTestimonial(); }} data-testid="button-add-testimonial">
                {showAddTestimonial ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter un avis</>}
              </Button>
            </div>
            {(showAddTestimonial || editingTestimonialId) && (
              <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{editingTestimonialId ? "Modifier l'avis" : "Nouvel avis client"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Nom du client *</label>
                      <Input value={testimonialForm.name} onChange={e => setTestimonialForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Thomas R." data-testid="input-testimonial-name" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Ville</label>
                      <Input value={testimonialForm.location} onChange={e => setTestimonialForm(p => ({ ...p, location: e.target.value }))} placeholder="Ex: Liévin" data-testid="input-testimonial-location" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Véhicule</label>
                      <Input value={testimonialForm.vehicle} onChange={e => setTestimonialForm(p => ({ ...p, vehicle: e.target.value }))} placeholder="Ex: BMW Série 3" data-testid="input-testimonial-vehicle" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Note (1–5)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setTestimonialForm(p => ({ ...p, rating: n }))} className="p-1" data-testid={`button-rating-${n}`}>
                          <Star className={`w-6 h-6 ${n <= testimonialForm.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Avis *</label>
                    <Textarea value={testimonialForm.content} onChange={e => setTestimonialForm(p => ({ ...p, content: e.target.value }))} placeholder="Ce que le client a dit..." rows={3} data-testid="input-testimonial-content" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { if (editingTestimonialId) updateTestimonial.mutate({ id: editingTestimonialId, data: testimonialForm }); else createTestimonial.mutate(testimonialForm); }} disabled={!testimonialForm.name || !testimonialForm.content || createTestimonial.isPending || updateTestimonial.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white border-0" data-testid="button-submit-testimonial">
                      {editingTestimonialId ? (updateTestimonial.isPending ? "Mise à jour..." : <><Save className="w-4 h-4 mr-1" /> Enregistrer</>) : (createTestimonial.isPending ? "Ajout en cours..." : "Ajouter l'avis")}
                    </Button>
                    {editingTestimonialId && <Button variant="outline" onClick={cancelEditTestimonial}>Annuler</Button>}
                  </div>
                </CardContent>
              </Card>
            )}
            {loadingTestimonials ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-30" /><p>Chargement...</p></CardContent></Card>
            ) : (
              <div className="space-y-3">
                {testimonials.map(t => (
                  <Card key={t.id} className={`border-0 shadow-sm ${editingTestimonialId === t.id ? 'ring-2 ring-auto-red' : ''}`} data-testid={`testimonial-card-${t.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />)}
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{t.published ? "Publié" : "Masqué"}</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">"{t.content}"</p>
                          <p className="font-bold text-gray-900 text-sm">{t.name}{(t.vehicle || t.location) && <span className="text-gray-400 font-normal"> — {[t.vehicle, t.location].filter(Boolean).join(", ")}</span>}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => startEditTestimonial(t)} className="w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center" title="Modifier" data-testid={`button-edit-testimonial-${t.id}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                          <button onClick={() => toggleTestimonial.mutate({ id: t.id, published: !t.published })} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${t.published ? "border-green-200 bg-green-50 hover:bg-green-100" : "border-gray-200 hover:bg-gray-50"}`} title={t.published ? "Masquer" : "Publier"} data-testid={`button-toggle-testimonial-${t.id}`}><Eye className={`w-4 h-4 ${t.published ? "text-green-600" : "text-gray-400"}`} /></button>
                          <button onClick={() => { if (confirm("Supprimer cet avis ?")) deleteTestimonial.mutate(t.id); }} className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center" title="Supprimer" data-testid={`button-delete-testimonial-${t.id}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ TAB */}
        {tab === "faq" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{faqItems.length} question(s)</p>
              <Button size="sm" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-semibold" onClick={() => { setShowAddFaq(!showAddFaq); cancelEditFaq(); }} data-testid="button-add-faq">
                {showAddFaq ? <><X className="w-4 h-4 mr-1" /> Annuler</> : <><Plus className="w-4 h-4 mr-1" /> Ajouter une FAQ</>}
              </Button>
            </div>
            {(showAddFaq || editingFaqId) && (
              <Card className="border-0 shadow-md mb-6">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{editingFaqId ? "Modifier la FAQ" : "Nouvelle question FAQ"}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Catégorie</label>
                      <select value={faqForm.category} onChange={e => setFaqForm(p => ({ ...p, category: e.target.value }))} className="w-full h-10 border rounded-md px-3 text-sm" data-testid="select-faq-category">
                        <option value="general">Général</option>
                        <option value="services">Services</option>
                        <option value="delais">Délais</option>
                        <option value="garantie">Garantie</option>
                        <option value="devis">Devis</option>
                        <option value="tarifs">Tarifs</option>
                        <option value="pratique">Pratique</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Ordre d'affichage</label>
                      <Input type="number" value={faqForm.sortOrder} onChange={e => setFaqForm(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} data-testid="input-faq-order" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Question *</label>
                    <Input value={faqForm.question} onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))} placeholder="La question fréquemment posée..." data-testid="input-faq-question" />
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Réponse *</label>
                    <Textarea value={faqForm.answer} onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))} placeholder="La réponse détaillée..." rows={4} data-testid="input-faq-answer" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { if (editingFaqId) updateFaq.mutate({ id: editingFaqId, data: faqForm }); else createFaq.mutate(faqForm); }} disabled={!faqForm.question || !faqForm.answer || createFaq.isPending || updateFaq.isPending} className="bg-auto-red hover:bg-auto-red-dark text-white border-0" data-testid="button-submit-faq">
                      {editingFaqId ? (updateFaq.isPending ? "Mise à jour..." : <><Save className="w-4 h-4 mr-1" /> Enregistrer</>) : (createFaq.isPending ? "Ajout en cours..." : "Ajouter la FAQ")}
                    </Button>
                    {editingFaqId && <Button variant="outline" onClick={cancelEditFaq}>Annuler</Button>}
                  </div>
                </CardContent>
              </Card>
            )}
            {loadingFaq ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-30" /><p>Chargement...</p></CardContent></Card>
            ) : (
              <div className="space-y-3">
                {faqItems.map(f => (
                  <Card key={f.id} className={`border-0 shadow-sm ${editingFaqId === f.id ? 'ring-2 ring-auto-red' : ''}`} data-testid={`faq-card-${f.id}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">{f.category}</span>
                            <span className="text-[10px] text-gray-400">#{f.sortOrder}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{f.published ? "Publié" : "Masqué"}</span>
                          </div>
                          <p className="font-bold text-gray-900 text-sm mb-1">{f.question}</p>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{f.answer}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => startEditFaq(f)} className="w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center" title="Modifier" data-testid={`button-edit-faq-${f.id}`}><Edit2 className="w-4 h-4 text-blue-600" /></button>
                          <button onClick={() => toggleFaq.mutate({ id: f.id, published: !f.published })} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${f.published ? "border-green-200 bg-green-50 hover:bg-green-100" : "border-gray-200 hover:bg-gray-50"}`} title={f.published ? "Masquer" : "Publier"} data-testid={`button-toggle-faq-${f.id}`}><Eye className={`w-4 h-4 ${f.published ? "text-green-600" : "text-gray-400"}`} /></button>
                          <button onClick={() => { if (confirm("Supprimer cette FAQ ?")) deleteFaq.mutate(f.id); }} className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center" title="Supprimer" data-testid={`button-delete-faq-${f.id}`}><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CONTENU DU SITE TAB */}
        {tab === "contenu" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-black text-gray-900 mb-1">Contenu du site</h2>
              <p className="text-sm text-gray-500">Modifiez les textes, coordonnées, statistiques et la police d'écriture affichés sur votre site. Chaque champ se sauvegarde individuellement.</p>
            </div>

            {loadingContent ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin opacity-30" /><p>Chargement...</p></CardContent></Card>
            ) : (
              <div className="space-y-6">
                {contentCategories.map(category => {
                  const fields = CONTENT_FIELDS.filter(f => f.category === category);
                  return (
                    <Card key={category} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          {category === "hero" && <Globe className="w-4 h-4 text-auto-red" />}
                          {category === "typography" && <Type className="w-4 h-4 text-purple-600" />}
                          {category === "contact" && <Phone className="w-4 h-4 text-blue-600" />}
                          {category === "sections" && <FileText className="w-4 h-4 text-gray-600" />}
                          {CATEGORY_LABELS[category] || category}
                        </h3>
                        <div className="space-y-4">
                          {fields.map(field => {
                            const currentVal = getContentValue(field.key);
                            const isDirty = contentEdits[field.key] !== undefined && contentEdits[field.key] !== contentMap[field.key];
                            return (
                              <div key={field.key}>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-medium text-gray-600">{field.label}</label>
                                  {isDirty && (
                                    <Button
                                      size="sm"
                                      onClick={() => saveContent(field.key)}
                                      disabled={savingContent[field.key]}
                                      className="h-7 px-3 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0"
                                      data-testid={`button-save-content-${field.key.replace(/\./g, "-")}`}
                                    >
                                      {savingContent[field.key] ? "..." : <><Save className="w-3 h-3 mr-1" /> Sauvegarder</>}
                                    </Button>
                                  )}
                                </div>

                                {field.type === "font-select" ? (
                                  <div>
                                    <select
                                      value={currentVal}
                                      onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))}
                                      className="w-full h-10 border rounded-md px-3 text-sm"
                                      style={{ fontFamily: currentVal }}
                                      data-testid={`select-content-${field.key.replace(/\./g, "-")}`}
                                    >
                                      {AVAILABLE_FONTS.map(f => (
                                        <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
                                      ))}
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1">Aperçu: <span style={{ fontFamily: currentVal, fontSize: "14px" }}>MyJantes — L'expert de la jante alu à Liévin</span></p>
                                    {isDirty && (
                                      <Button size="sm" onClick={() => saveContent(field.key)} disabled={savingContent[field.key]} className="mt-2 h-7 px-3 text-xs bg-auto-red hover:bg-auto-red-dark text-white border-0">
                                        {savingContent[field.key] ? "..." : <><Save className="w-3 h-3 mr-1" /> Appliquer la police</>}
                                      </Button>
                                    )}
                                  </div>
                                ) : field.type === "json-stats" ? (
                                  <StatEditor value={currentVal} onChange={v => setContentEdits(p => ({ ...p, [field.key]: v }))} />
                                ) : field.type === "json-array-simple" ? (
                                  <ArraySimpleEditor value={currentVal} onChange={v => setContentEdits(p => ({ ...p, [field.key]: v }))} />
                                ) : field.multiline ? (
                                  <Textarea
                                    value={currentVal}
                                    onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))}
                                    rows={2}
                                    className={`text-sm ${isDirty ? "border-auto-red/50 bg-red-50/30" : ""}`}
                                    data-testid={`input-content-${field.key.replace(/\./g, "-")}`}
                                  />
                                ) : (
                                  <Input
                                    value={currentVal}
                                    onChange={e => setContentEdits(p => ({ ...p, [field.key]: e.target.value }))}
                                    className={`text-sm ${isDirty ? "border-auto-red/50 bg-red-50/30" : ""}`}
                                    data-testid={`input-content-${field.key.replace(/\./g, "-")}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
