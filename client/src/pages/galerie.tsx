import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { Link } from "wouter";
import { ArrowRight, X } from "lucide-react";
import type { GalleryItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { label: "Tout voir", value: "all" },
  { label: "Rénovation", value: "renovation" },
  { label: "Peinture", value: "peinture" },
  { label: "Redressage", value: "redressage" },
];

export default function Galerie() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const { data: gallery = [], isLoading } = useQuery<GalleryItem[]>({ queryKey: ["/api/gallery"] });

  const filtered = filter === "all" ? gallery : gallery.filter((g) => g.serviceType === filter);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Galerie de réalisations MyJantes",
    "description": "Galerie avant/après de nos rénovations de jantes en alliage.",
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Galerie Réalisations - Avant/Après Jantes | MyJantes"
        description="Découvrez nos réalisations avant/après en rénovation et peinture de jantes. Plus de 5000 jantes traitées. Résultats spectaculaires."
        keywords="galerie jantes, avant après rénovation jantes, réalisations peinture jantes"
        canonicalPath="/galerie"
        schema={schema}
      />

      {/* Hero */}
      <div className="bg-auto-dark pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Nos réalisations
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-galerie">
            Galerie avant / après
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Chaque jante est un projet unique. Découvrez nos transformations les plus spectaculaires.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-10 justify-center" role="group" aria-label="Filtrer par catégorie">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              data-testid={`filter-${cat.value}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === cat.value
                  ? "bg-auto-red text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Aucune réalisation dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
                onClick={() => setSelected(item)}
                data-testid={`gallery-item-${item.id}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(item)}
                aria-label={`Voir réalisation: ${item.title}`}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.afterImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="mb-2 bg-auto-red border-0 text-white text-xs capitalize">
                      {item.serviceType}
                    </Badge>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    {item.description && (
                      <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-label="Vue agrandie"
          data-testid="modal-gallery"
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setSelected(null)}
            data-testid="button-close-modal"
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`grid ${selected.beforeImage ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
              {selected.beforeImage && (
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Avant</p>
                  <img
                    src={selected.beforeImage}
                    alt={`Avant - ${selected.title}`}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Après</p>
                <img
                  src={selected.afterImage}
                  alt={`Après - ${selected.title}`}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold text-lg">{selected.title}</h3>
              {selected.description && (
                <p className="text-white/60 text-sm mt-1">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Confiez-nous vos jantes</h2>
          <p className="text-gray-500 mb-6">Un projet similaire ? Contactez-nous pour un devis gratuit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0" data-testid="button-gallery-cta">
              <Link href="/contact">
                Devis gratuit <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-200 font-bold">
              <a href="https://appmyjantes.mytoolsgroup.eu" target="_blank" rel="noopener noreferrer">
                Espace client
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
