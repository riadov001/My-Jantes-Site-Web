import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";

export default function MentionsLegales() {
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const c = (key: string, fallback = "") => content[key] || fallback;

  return (
    <div className="min-h-screen bg-white pt-36 pb-20">
      <SEO title="Mentions Légales - MyJantes" description="Mentions légales du site MyJantes.fr" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Mentions Légales</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Présentation du site</h2>
            <p>En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site myjantes.fr l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :</p>
            <p>
              <strong>Propriétaire :</strong> {c("legal.owner", "SAS MY JANTES")} – {c("contact.address", "46 rue de la Convention, 62800 Liévin")}<br/>
              <strong>SIREN :</strong> {c("legal.siren", "913 678 199")}<br/>
              <strong>Responsable de publication :</strong> {c("legal.responsible", "Iliass MEGAIZ")}<br/>
              <strong>Email :</strong> {c("contact.email", "contact@myjantes.com")}<br/>
              <strong>Téléphone :</strong> {c("contact.phone", "03 21 40 80 53")}<br/>
              <strong>Hébergeur :</strong> {c("legal.host", "Hostinger International Ltd.")} – {c("legal.host_address", "61 Lordou Vironos Street, 6023 Larnaka, Chypre")}
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Conditions générales d'utilisation</h2>
            <p className="whitespace-pre-wrap">{c("legal.cgu", "L'utilisation du site implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après décrites. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Description des services fournis</h2>
            <p className="whitespace-pre-wrap">{c("legal.services_desc", "Le site a pour objet de fournir une information concernant l'ensemble des activités de la société. MY JANTES s'efforce de fournir sur le site des informations aussi précises que possible.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Limitations de responsabilité</h2>
            <p className="whitespace-pre-wrap">{c("legal.liability", "MY JANTES ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site myjantes.fr. MY JANTES décline toute responsabilité quant à l'utilisation qui pourrait être faite des informations et contenus présents sur myjantes.fr.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Propriété intellectuelle</h2>
            <p className="whitespace-pre-wrap">{c("legal.intellectual_property", "Tout le contenu du présent site, incluant, de façon non limitative, les graphismes, images, textes, vidéos, animations, sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété exclusive de la société MY JANTES à l'exception des marques, logos ou contenus appartenant à d'autres sociétés partenaires.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Données personnelles</h2>
            <p className="whitespace-pre-wrap">{c("legal.gdpr", "MY JANTES s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site myjantes.fr, soient conformes au règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés. Pour toute demande relative à vos données personnelles, contactez-nous à contact@myjantes.com.")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
