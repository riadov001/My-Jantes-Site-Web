import { SEO } from "@/components/seo";

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white pt-36 pb-20">
      <SEO title="Politique de Confidentialité - MyJantes" description="Politique de confidentialité et protection des données de MyJantes.fr" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8 font-['Montserrat',sans-serif]">Politique de Confidentialité</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Collecte de l'information</h2>
            <p>Nous recueillons des informations lorsque vous remplissez notre formulaire de contact ou nous contactez par WhatsApp. Les informations recueillies incluent votre nom, adresse e-mail, numéro de téléphone et les détails de votre véhicule.</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Utilisation des informations</h2>
            <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :<br/>
            - Vous contacter pour votre devis<br/>
            - Améliorer le service client et vos besoins de prise en charge<br/>
            - Améliorer notre site Web</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Protection des informations</h2>
            <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
