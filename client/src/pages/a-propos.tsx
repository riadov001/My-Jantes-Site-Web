import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { RefreshCw } from "lucide-react";

export default function About() {
  const { data: content = {}, isLoading } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

  const fontFamily = content["typography.font"] || "Montserrat";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-8 h-8 text-auto-red animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      <SEO title={`${content["pages.about.title"] || "À propos"} - MyJantes`} description={content["pages.about.content"]?.slice(0, 160)} canonicalPath="/a-propos" />
      <div className="bg-auto-dark pt-36 pb-20 overflow-hidden relative">
        {content["pages.about.image"] && (
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('${content["pages.about.image"]}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
            {content["pages.about.title"] || "À propos de MyJantes"}
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
          {content["pages.about.content"] || "Expert en rénovation de jantes alu à Liévin."}
        </div>
      </div>
    </div>
  );
}
