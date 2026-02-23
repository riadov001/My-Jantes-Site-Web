import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog MyJantes - Conseils et Actualités",
    "description": "Conseils d'experts pour l'entretien, la rénovation et la personnalisation de jantes en alliage.",
    "url": "https://myjantes.fr/blog",
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Blog - Conseils & Actualités Jantes Alliage | MyJantes"
        description="Conseils d'experts pour l'entretien et la rénovation de vos jantes. Guides pratiques, tendances et actualités du monde des jantes."
        keywords="blog jantes, conseils rénovation jantes, entretien jantes alliage, tendances peinture jantes"
        canonicalPath="/blog"
        schema={schema}
      />

      {/* Hero */}
      <div className="bg-auto-dark pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Actualités & Conseils
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-blog">
            Blog MyJantes
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Guides pratiques, tendances et conseils d'experts pour prendre soin de vos jantes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Aucun article publié pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} data-testid={`card-blog-${post.id}`}>
                <Card className="group border border-gray-100 shadow-sm overflow-hidden h-full hover-elevate cursor-pointer">
                  {post.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.createdAt
                          ? format(new Date(post.createdAt), "d MMM yyyy", { locale: fr })
                          : ""}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {Math.ceil(post.content.split(" ").length / 200)} min de lecture
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                      Lire l'article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
