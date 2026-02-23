import { SEO } from "@/components/seo";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white pt-36 pb-20">
      <SEO title="Mentions Légales - MyJantes" description="Mentions légales du site MyJantes.fr" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8 font-['Montserrat',sans-serif]">Mentions Légales</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Présentation du site</h2>
            <p>En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site myjantes.fr l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :</p>
            <p><strong>Propriétaire :</strong> SAS MY JANTES – 46 rue de la Convention, 62800 Liévin<br/>
            <strong>SIREN :</strong> 913 678 199<br/>
            <strong>Responsable publication :</strong> Iliass MEGAIZ<br/>
            <strong>Hébergeur :</strong> Hostinger</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Conditions générales d’utilisation</h2>
            <p>L’utilisation du site implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Description des services fournis</h2>
            <p>Le site a pour objet de fournir une information concernant l’ensemble des activités de la société. MY JANTES s’efforce de fournir sur le site des informations aussi précises que possible.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
