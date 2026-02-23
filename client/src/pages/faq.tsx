import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageCircle, ArrowRight } from "lucide-react";
import type { FaqItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  services: "Nos services",
  delais: "Délais",
  garantie: "Garantie",
  devis: "Devis & Tarifs",
  tarifs: "Tarifs",
  pratique: "Infos pratiques",
  general: "Général",
};

export default function FAQ() {
  const { data: faqs = [], isLoading } = useQuery<FaqItem[]>({ queryKey: ["/api/faq"] });

  const grouped = faqs.reduce((acc, faq) => {
    const cat = faq.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="FAQ - Questions Fréquentes Rénovation Jantes | MyJantes"
        description="Toutes les réponses à vos questions sur la rénovation de jantes : délais, tarifs, garantie, prestations. FAQ complète MyJantes."
        keywords="FAQ jantes, questions rénovation jantes, tarifs peinture jantes, garantie jantes"
        canonicalPath="/faq"
        schema={schema}
      />

      {/* Hero */}
      <div className="bg-auto-dark pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-auto-red/20 text-auto-red-light border-auto-red/30 text-xs uppercase tracking-wider">
            Questions fréquentes
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="heading-faq">
            Vos questions, nos réponses
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur nos services de rénovation de jantes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : Object.entries(grouped).length === 0 ? (
          <p className="text-center text-gray-400">Aucune question disponible</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-auto-red inline-block" />
                  {categoryLabels[category] || category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {items.map((faq, i) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm"
                      data-testid={`faq-item-${faq.id}`}
                    >
                      <AccordionTrigger
                        className="px-5 py-4 text-left font-medium text-gray-900 hover:no-underline hover:bg-gray-50 text-sm"
                        data-testid={`faq-trigger-${i}`}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5 pt-1">
                        <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-16 bg-gray-950 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="text-white/60 mb-7">Contactez-nous directement, nous répondons sous 24h.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild className="bg-auto-red hover:bg-auto-red-dark text-white border-0" data-testid="button-faq-contact">
              <Link href="/contact">
                Nous contacter <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white bg-transparent hover:bg-white/5" data-testid="button-faq-whatsapp">
              <a href="https://wa.me/33600000000" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 w-4 h-4" /> WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
