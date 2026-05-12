import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { Link } from "wouter";
import { ArrowRight, X, Phone } from "lucide-react";
import type { GalleryItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { BeforeAfterSlider } from "@/components/before-after-slider";

const categories = [
  { label: "Tout voir", value: "all" },
  { label: "Rénovation", value: "renovation" },
  { label: "Peinture", value: "peinture" },
  { label: "Redressage", value: "devoilage" },
  { label: "Soudure", value: "soudure" },
  { label: "Sablage", value: "sablage" },
  { label: "Personnalisation", value: "personnalisation" },
  { label: "Hydrodipping", value: "hydrodipping" },
];

export default function Galerie() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const { data: gallery = [], isLoading } = useQuery<GalleryItem[]>({ queryKey: ["/api/gallery"] });
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

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

      <div className="bg-auto-dark pt-36 pb-16 md:pt-28 md:pb-10 lg:pt-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            {content["pages.gallery.badge"] || "Nos réalisations"}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-galerie">
            Galerie avant / après
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Chaque jante est un projet unique. Découvrez nos transformations les plus spectaculaires.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="flex gap-2 flex-wrap mb-10 justify-center" role="group" aria-label="Filtrer par catégorie">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              data-testid={`filter-${cat.value}`}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                filter === cat.value
                  ? "bg-auto-red text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Aucune réalisation dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Badge className="mb-1.5 bg-auto-red border-0 text-white text-[10px] uppercase font-bold px-2 py-0">
                      {item.serviceType}
                    </Badge>
                    <p className="text-white font-bold text-xs line-clamp-1">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-label="Vue agrandie"
          data-testid="modal-gallery"
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
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
            {selected.beforeImage ? (
              <>
                <BeforeAfterSlider
                  beforeImage={selected.beforeImage}
                  afterImage={selected.afterImage}
                  alt={selected.title}
                  className="w-full aspect-[4/3] sm:aspect-video bg-black"
                />
                <p className="text-white/40 text-[10px] uppercase tracking-widest text-center mt-3 font-bold">
                  Glissez le curseur pour comparer
                </p>
              </>
            ) : (
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Après</p>
                <img
                  src={selected.afterImage}
                  alt={`Après - ${selected.title}`}
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold text-lg" data-testid="text-modal-title">{selected.title}</h3>
              {selected.description && (
                <p className="text-white/60 text-sm mt-1">{selected.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 py-16 border-t border-gray-100 mb-0">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Confiez-nous vos jantes</h2>
          <p className="text-gray-500 mb-8">Un projet similaire ? Contactez-nous pour un devis gratuit.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black px-8 h-12 w-full sm:w-auto" data-testid="button-gallery-cta">
              <Link href="/contact#form">
                Devis gratuit <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-200 font-bold px-8 h-12 w-full sm:w-auto">
              <a href={`tel:${content["contact.phone_href"] || "+33321408053"}`}>
                <Phone className="mr-2 w-4 h-4" /> Appeler l'atelier
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
