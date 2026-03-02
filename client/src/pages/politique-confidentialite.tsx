import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";

export default function PolitiqueConfidentialite() {
  const { data: content = {} } = useQuery<Record<string, string>>({ queryKey: ["/api/site-content"] });
  const c = (key: string, fallback = "") => content[key] || fallback;

  return (
    <div className="min-h-screen bg-white pt-36 pb-20">
      <SEO title="Politique de Confidentialité - MyJantes" description="Politique de confidentialité et protection des données de MyJantes.fr" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Politique de Confidentialité</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Collecte de l'information</h2>
            <p className="whitespace-pre-wrap">{c("privacy.collection", "Nous recueillons des informations lorsque vous remplissez notre formulaire de contact ou nous contactez par téléphone ou email. Les informations recueillies incluent votre nom, adresse e-mail, numéro de téléphone et les détails de votre véhicule.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Utilisation des informations</h2>
            <p className="whitespace-pre-wrap">{c("privacy.usage", "Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :\n- Vous contacter pour votre devis\n- Améliorer le service client et vos besoins de prise en charge\n- Améliorer notre site Web")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Protection des informations</h2>
            <p className="whitespace-pre-wrap">{c("privacy.protection", "Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cookies</h2>
            <p className="whitespace-pre-wrap">{c("privacy.cookies", "Notre site peut utiliser des cookies pour améliorer l'expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer quand un cookie est envoyé. Toutefois, certaines fonctionnalités du site pourraient ne pas fonctionner correctement sans cookies.")}</p>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Vos droits</h2>
            <p className="whitespace-pre-wrap">{c("privacy.rights", "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles. Pour exercer ces droits, contactez-nous à l'adresse : contact@myjantes.com.")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
