import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  schema?: object;
}

export function SEO({ title, description, keywords, canonicalPath, ogImage, schema }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "MyJantes", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);

    // Add alt text for OG image if exists
    if (ogImage) {
      setMeta("og:image", ogImage, true);
      setMeta("og:image:alt", title, true);
      setMeta("twitter:image", ogImage);
    }

    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `https://myjantes.fr${canonicalPath}`);
    }

    if (schema) {
      let scriptEl = document.querySelector('script[data-page-schema]');
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-page-schema", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    }

    return () => {
      const schemaEl = document.querySelector('script[data-page-schema]');
      if (schemaEl) schemaEl.remove();
    };
  }, [title, description, keywords, canonicalPath, ogImage, schema]);

  return null;
}
