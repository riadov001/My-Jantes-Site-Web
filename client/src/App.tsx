import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingButtons } from "@/components/floating-buttons";
import { CookieConsent } from "@/components/cookie-consent";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import ServiceDetail from "@/pages/service-detail";
import Galerie from "@/pages/galerie";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import FAQ from "@/pages/faq";
import Garanties from "@/pages/garanties";
import Blog from "@/pages/blog";
import Admin from "@/pages/admin";
import MentionsLegales from "@/pages/mentions-legales";
import PolitiqueConfidentialite from "@/pages/politique-confidentialite";

const COLOR_PRESETS: Record<string, { red: string; dark: string; light: string }> = {
  red: { red: "0 84% 50%", dark: "0 77% 42%", light: "0 93% 82%" },
  blue: { red: "217 91% 60%", dark: "217 91% 48%", light: "217 95% 85%" },
  green: { red: "142 76% 36%", dark: "142 76% 28%", light: "142 76% 82%" },
  orange: { red: "25 95% 53%", dark: "25 95% 42%", light: "25 95% 82%" },
  purple: { red: "262 83% 58%", dark: "262 83% 46%", light: "262 83% 82%" },
  pink: { red: "330 81% 60%", dark: "330 81% 48%", light: "330 81% 82%" },
  teal: { red: "173 80% 40%", dark: "173 80% 32%", light: "173 80% 82%" },
  gold: { red: "38 92% 50%", dark: "38 92% 40%", light: "38 92% 82%" },
};

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function ThemeApplier() {
  const { data: siteContent = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });

  useEffect(() => {
    const font = siteContent["typography.font"] || "Montserrat";
    document.documentElement.style.setProperty("--font-sans", `'${font}', sans-serif`);

    const headingFont = siteContent["typography.heading_font"] || "Eurostile Extended";
    document.documentElement.style.setProperty("--font-heading", `'${headingFont}', '${font}', sans-serif`);

    const fontSize = siteContent["typography.font_size"] || "16";
    document.documentElement.style.setProperty("--base-font-size", `${fontSize}px`);
    document.documentElement.style.fontSize = `${fontSize}px`;

    const headingScale = parseFloat(siteContent["typography.heading_scale"] || "1.25");
    document.documentElement.style.setProperty("--heading-scale", String(headingScale));

    const colorKey = siteContent["theme.color"] || "red";
    const preset = COLOR_PRESETS[colorKey] || COLOR_PRESETS.red;
    document.documentElement.style.setProperty("--auto-red", preset.red);
    document.documentElement.style.setProperty("--auto-red-dark", preset.dark);
    document.documentElement.style.setProperty("--auto-red-light", preset.light);
  }, [siteContent]);

  return null;
}

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <ThemeApplier />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/galerie" component={Galerie} />
          <Route path="/faq" component={FAQ} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={Blog} />
          <Route path="/contact" component={Contact} />
          <Route path="/a-propos" component={About} />
          <Route path="/garanties" component={Garanties} />
          <Route path="/mentions-legales" component={MentionsLegales} />
          <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <FloatingButtons />
      <CookieConsent />
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  if (location === "/admin" || location.startsWith("/admin/")) {
    return <Admin />;
  }
  return <PublicLayout />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
