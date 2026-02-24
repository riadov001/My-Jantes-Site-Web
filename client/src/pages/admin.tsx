import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  LogOut, Mail, Image, Star, HelpCircle, CheckCircle2,
  Clock, XCircle, Eye, Trash2, MessageSquare, Users, LayoutDashboard,
  Lock, User
} from "lucide-react";
import type { ContactRequest, GalleryItem, Testimonial, FaqItem } from "@shared/schema";

type Tab = "contacts" | "galerie" | "avis" | "faq";

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

export default function Admin() {
  const [, setLocation] = useLocation();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("contacts");
  const { toast } = useToast();
  const qc = useQueryClient();

  // Check auth on load
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

  const { data: contacts = [] } = useQuery<ContactRequest[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: authenticated === true,
  });

  const { data: gallery = [] } = useQuery<GalleryItem[]>({
    queryKey: ["/api/admin/gallery"],
    enabled: authenticated === true,
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
    enabled: authenticated === true,
  });

  const { data: faqItems = [] } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq"],
    enabled: authenticated === true,
  });

  const updateContactStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/admin/contacts/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/contacts"] }),
  });

  const toggleTestimonial = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/testimonials/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] }),
  });

  const deleteTestimonial = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/testimonials/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Avis supprimé" });
    },
  });

  const toggleGallery = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/gallery/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] }),
  });

  const deleteGallery = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/gallery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/gallery"] });
      toast({ title: "Photo supprimée" });
    },
  });

  const toggleFaq = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      apiRequest("PUT", `/api/admin/faq/${id}`, { published }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/faq"] }),
  });

  const deleteFaq = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/faq/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/faq"] });
      toast({ title: "FAQ supprimée" });
    },
  });

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

  const tabs: { id: Tab; label: string; icon: React.ElementType; count: number }[] = [
    { id: "contacts", label: "Contacts / Devis", icon: MessageSquare, count: contacts.filter(c => c.status === "nouveau").length },
    { id: "galerie", label: "Galerie", icon: Image, count: gallery.length },
    { id: "avis", label: "Avis Clients", icon: Star, count: testimonials.length },
    { id: "faq", label: "FAQ", icon: HelpCircle, count: faqItems.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <span className="text-white/40 text-xs hidden sm:block">contact@myjantes.com</span>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white/70 hover:text-white bg-transparent font-semibold text-xs"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Nouveaux devis", value: contacts.filter(c => c.status === "nouveau").length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Photos galerie", value: gallery.length, color: "text-auto-red", bg: "bg-red-50" },
            { label: "Avis clients", value: testimonials.length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Total contacts", value: contacts.length, color: "text-gray-700", bg: "bg-gray-100" },
          ].map(s => (
            <Card key={s.label} className="border-0 shadow-sm">
              <CardContent className={`p-5 ${s.bg} rounded-xl`}>
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-auto-red text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${tab === t.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTACTS TAB */}
        {tab === "contacts" && (
          <div className="space-y-3">
            {contacts.length === 0 ? (
              <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><Mail className="w-8 h-8 mx-auto mb-3 opacity-30" /><p>Aucune demande de contact</p></CardContent></Card>
            ) : contacts.map(contact => {
              const s = statusConfig[contact.status] || statusConfig.new;
              return (
                <Card key={contact.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${s.color}`}>
                            <s.icon className="w-3 h-3" /> {s.label}
                          </span>
                          <span className="text-gray-400 text-xs">{new Date(contact.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                          {contact.service && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{contact.service}</span>}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{contact.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                          <a href={`mailto:${contact.email}`} className="hover:text-auto-red flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{contact.email}</a>
                          {contact.phone && <a href={`tel:${contact.phone}`} className="hover:text-auto-red flex items-center gap-1"><Users className="w-3.5 h-3.5" />{contact.phone}</a>}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">{contact.message}</p>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                          <button
                            key={key}
                            onClick={() => updateContactStatus.mutate({ id: contact.id, status: key })}
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${contact.status === key ? cfg.color + " border-current" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* GALERIE TAB */}
        {tab === "galerie" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map(item => (
              <Card key={item.id} className="border-0 shadow-sm overflow-hidden group">
                <div className="relative aspect-square">
                  <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => toggleGallery.mutate({ id: item.id, published: !item.published })}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                      title={item.published ? "Dépublier" : "Publier"}
                    >
                      <Eye className={`w-4 h-4 ${item.published ? "text-green-600" : "text-gray-400"}`} />
                    </button>
                    <button
                      onClick={() => { if (confirm("Supprimer cette photo ?")) deleteGallery.mutate(item.id); }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.published ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                    {item.published ? "Visible" : "Masqué"}
                  </span>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{item.serviceType}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* AVIS TAB */}
        {tab === "avis" && (
          <div className="space-y-3">
            {testimonials.map(t => (
              <Card key={t.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {t.published ? "Publié" : "Masqué"}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">"{t.content}"</p>
                      <p className="font-bold text-gray-900 text-sm">{t.name} <span className="text-gray-400 font-normal">— {t.vehicle}, {t.location}</span></p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => toggleTestimonial.mutate({ id: t.id, published: !t.published })}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${t.published ? "border-green-200 bg-green-50 hover:bg-green-100" : "border-gray-200 hover:bg-gray-50"}`}
                        title={t.published ? "Masquer" : "Publier"}
                      >
                        <Eye className={`w-4 h-4 ${t.published ? "text-green-600" : "text-gray-400"}`} />
                      </button>
                      <button
                        onClick={() => { if (confirm("Supprimer cet avis ?")) deleteTestimonial.mutate(t.id); }}
                        className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAQ TAB */}
        {tab === "faq" && (
          <div className="space-y-3">
            {faqItems.map(f => (
              <Card key={f.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {f.published ? "Publié" : "Masqué"}
                        </span>
                        {f.category && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{f.category}</span>}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{f.question}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.answer}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => toggleFaq.mutate({ id: f.id, published: !f.published })}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${f.published ? "border-green-200 bg-green-50 hover:bg-green-100" : "border-gray-200 hover:bg-gray-50"}`}
                      >
                        <Eye className={`w-4 h-4 ${f.published ? "text-green-600" : "text-gray-400"}`} />
                      </button>
                      <button
                        onClick={() => { if (confirm("Supprimer cette FAQ ?")) deleteFaq.mutate(f.id); }}
                        className="w-8 h-8 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
