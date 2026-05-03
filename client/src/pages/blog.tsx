import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, Clock, ArrowLeft } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function BlogPostView({ slug }: { slug: string }) {
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-32 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
          <Button asChild variant="outline">
            <Link href="/blog">Retour au blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={post.metaTitle || `${post.title} | MyJantes`}
        description={post.metaDescription || post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
      />

      <div className="bg-auto-dark pt-36 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Button asChild variant="ghost" className="text-white/60 hover:text-white mb-6">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour au blog
            </Link>
          </Button>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight" data-testid="heading-blog-post">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/50 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.createdAt ? format(new Date(post.createdAt), "d MMMM yyyy", { locale: fr }) : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {Math.ceil(post.content.split(" ").length / 200)} min de lecture
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-2xl shadow-lg mb-12 aspect-video object-cover"
          />
        )}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <Button asChild variant="outline">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Tous les articles
            </Link>
          </Button>
          <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0 font-black">
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const { slug } = useParams<{ slug?: string }>();

  if (slug) {
    return <BlogPostView slug={slug} />;
  }

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

      <div className="bg-auto-dark pt-36 pb-16">
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
                <Card className="group border border-gray-100 shadow-sm overflow-hidden h-full cursor-pointer hover:shadow-xl transition-shadow duration-300">
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
                    <h2 className="font-bold text-gray-900 text-base mb-2 group-hover:text-auto-red transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-auto-red text-sm font-medium">
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
