import { storage } from "./storage";
import { db } from "./db";
import {
  users, testimonials, blogPosts, galleryItems, faqItems, siteServices, siteContent,
} from "@shared/schema";
import { sql, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "contact@myjantes.com";
const ADMIN_PASSWORD = "MyJantes@2026!*";

export async function seedDatabase() {
  try {
    // Always ensure admin user has a valid hashed password
    const [existingAdmin] = await db.select().from(users).where(eq(users.username, ADMIN_EMAIL));
    if (existingAdmin) {
      if (!existingAdmin.password || existingAdmin.password.length < 10) {
        const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await db.update(users).set({ password: hash, isAdmin: true }).where(eq(users.username, ADMIN_EMAIL));
      }

      // Seed services if empty
      const existingServices = await db.select().from(siteServices).limit(1);
      if (existingServices.length === 0) {
        await seedServices();
      }

      // Seed site content if empty
      const existingContent = await db.select().from(siteContent).limit(1);
      if (existingContent.length === 0) {
        await seedSiteContent();
      }

      return;
    }

    await storage.createUser({ username: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    await db.update(users).set({ isAdmin: true }).where(eq(users.username, ADMIN_EMAIL));

    await db.insert(testimonials).values([
      { name: "Cédric", location: "Liévin", rating: 5, content: "Accueil au top, travail de pro et soigné. Je recommande les yeux fermés. Mes jantes sont comme neuves !", vehicle: "Volkswagen Golf", published: true },
      { name: "David", location: "Lens", rating: 5, content: "Super boulot sur mes jantes de Tesla. Équipe très pro, délais respectés et résultat magnifique. Merci MyJantes !", vehicle: "Tesla Model 3", published: true },
      { name: "Aurélien", location: "Arras", rating: 5, content: "Rénovation de 4 jantes avec diamantage sur tour numérique. Le résultat est bluffant, identique à l'origine. Très bon rapport qualité/prix.", vehicle: "Mercedes Classe A", published: true },
      { name: "Julien", location: "Béthune", rating: 5, content: "Un grand merci pour le redressage de ma jante voilée. Service rapide et efficace. Je reviendrai pour la peinture.", vehicle: "Audi S3", published: true },
      { name: "Mickaël", location: "Douai", rating: 5, content: "Peinture complète en noir brillant. Finition parfaite, aucune poussière. Travail vraiment sérieux.", vehicle: "BMW M4", published: true },
    ]);

    await db.insert(blogPosts).values([
      {
        title: "Comment entretenir vos jantes en alliage pour les garder comme neuves",
        slug: "entretien-jantes-alliage",
        excerpt: "Découvrez nos conseils professionnels pour préserver l'éclat de vos jantes en alliage et prolonger leur durée de vie.",
        content: `# Comment entretenir vos jantes en alliage\n\nLes jantes en alliage sont un élément essentiel de l'esthétique de votre véhicule. Un entretien régulier permet de les conserver en parfait état.\n\n## Nettoyage régulier\n\nIl est recommandé de nettoyer vos jantes toutes les deux semaines minimum. Utilisez un produit spécifique pour jantes en alliage et une brosse douce.\n\n## Protection contre la corrosion\n\nAppliquez une cire protectrice après chaque nettoyage. Cela crée une barrière protectrice contre les agressions extérieures.\n\n## Inspection des dommages\n\nVérifiez régulièrement l'absence de rayures ou de déformations. Un dommage détecté tôt coûtera moins cher à réparer.\n\n## Contactez nos experts\n\nSi vous constatez des dommages, n'hésitez pas à nous contacter. Nos spécialistes vous proposeront la meilleure solution de rénovation.`,
        coverImage: "/images/gallery-1.png",
        metaTitle: "Entretien Jantes Alliage - Conseils Experts | MyJantes",
        metaDescription: "Apprenez à entretenir vos jantes en alliage avec nos conseils professionnels.",
        published: true,
      },
      {
        title: "Rénovation de jantes : Quand est-il temps de les refaire ?",
        slug: "quand-renover-jantes",
        excerpt: "Rayures, fissures, déformations... Apprenez à identifier les signes qui indiquent qu'il est temps de rénover vos jantes.",
        content: `# Rénovation de jantes : Quand agir ?\n\nVos jantes subissent quotidiennement de nombreuses agressions. Il est important de savoir identifier le bon moment pour les rénover.\n\n## Les signes qui ne trompent pas\n\n### Rayures et éraflures\nLes rayures superficielles sont les dommages les plus courants. Elles peuvent souvent être traitées par polissage ou peinture locale.\n\n### Déformations et voiles\nUne jante déformée ou voilée peut affecter la tenue de route et la sécurité. Un redressage professionnel s'impose.\n\n### Corrosion et oxydation\nL'oxydation est un signe de dégradation avancée. Sans traitement, elle peut fragiliser la structure de la jante.\n\n## Notre solution\n\nChez MyJantes, nous réalisons un diagnostic complet gratuit avant tout devis. Contactez-nous pour une évaluation de vos jantes.`,
        coverImage: "/images/service-renovation.png",
        metaTitle: "Quand Rénover ses Jantes - Guide Complet | MyJantes",
        metaDescription: "Identifiez les signes d'usure de vos jantes : rayures, déformations, corrosion.",
        published: true,
      },
      {
        title: "Les tendances de peinture jantes 2024 : Couleurs et finitions tendance",
        slug: "tendances-peinture-jantes-2024",
        excerpt: "Noir mat, gris anthracite, bronze... Découvrez les couleurs et finitions les plus tendance pour personnaliser vos jantes en 2024.",
        content: `# Tendances Peinture Jantes 2024\n\nLa personnalisation des jantes est en plein essor. Voici les tendances qui dominent le marché en 2024.\n\n## Les couleurs phares\n\n### Noir mat\nLe noir mat reste la couleur la plus demandée. Il apporte un aspect sportif et élégant à tout type de véhicule.\n\n### Gris anthracite\nCette teinte sophistiquée s'accorde parfaitement avec la plupart des couleurs de carrosserie.\n\n### Bronze et cuivre\nLes tons chauds métalliques font leur grand retour et se marient idéalement avec les véhicules sombres.\n\n## Les finitions tendance\n\n- **Mat** : élégant et sportif\n- **Brillant** : classique et premium\n- **Diamantage sur tour numérique** : haut de gamme avec une touche de brillance\n- **Bicolore** : personnalisation maximale`,
        coverImage: "/images/service-peinture.png",
        metaTitle: "Tendances Peinture Jantes 2024 - Couleurs et Finitions | MyJantes",
        metaDescription: "Découvrez les tendances 2024 en peinture de jantes : noir mat, gris anthracite, bronze.",
        published: true,
      },
    ]);

    await db.insert(galleryItems).values([
      { title: "Rénovation jantes BMW", serviceType: "renovation", afterImage: "/images/gallery-1.png", beforeImage: "/images/before-after-1.png", description: "Rénovation complète de jantes BMW - sablage, apprêt, peinture gris anthracite", published: true },
      { title: "Peinture personnalisée", serviceType: "peinture", afterImage: "/images/gallery-2.png", description: "Peinture noir mat personnalisée sur jantes 19 pouces", published: true },
      { title: "Jantes sport custom", serviceType: "peinture", afterImage: "/images/gallery-3.png", description: "Finition bronze satiné sur jantes sport", published: true },
      { title: "Rénovation jantes Audi", serviceType: "renovation", afterImage: "/images/service-renovation.png", description: "Remise à neuf complète sur jantes Audi 5 branches", published: true },
    ]);

    await db.insert(faqItems).values([
      { question: "Combien de temps dure une rénovation de jantes ?", answer: "La durée varie selon le type de prestation. Un redressage simple prend 1 à 2 jours. Une rénovation complète avec peinture peut prendre 3 à 5 jours ouvrés.", category: "delais", sortOrder: 1, published: true },
      { question: "Quels types de jantes pouvez-vous rénover ?", answer: "Nous travaillons sur tous types de jantes en alliage (aluminium), quelle que soit la marque ou le modèle. Nous intervenons également sur les jantes acier.", category: "services", sortOrder: 2, published: true },
      { question: "La rénovation de jantes est-elle garantie ?", answer: "Oui ! Toutes nos prestations bénéficient d'une garantie* sur la tenue de peinture et la finition. Nous utilisons des peintures professionnelles haute résistance.", category: "garantie", sortOrder: 3, published: true },
      { question: "Peut-on changer la couleur de ses jantes ?", answer: "Absolument ! Nous pouvons peindre vos jantes dans la couleur de votre choix : noir mat, gris anthracite, bronze, couleur carrosserie assortie et bien plus encore.", category: "services", sortOrder: 4, published: true },
      { question: "Comment obtenir un devis ?", answer: "Contactez-nous par téléphone, WhatsApp ou via notre formulaire en ligne. Envoyez-nous des photos de vos jantes et nous vous répondrons dans les 24h avec un devis gratuit.", category: "devis", sortOrder: 5, published: true },
      { question: "Faut-il démonter les roues avant de les apporter ?", answer: "Non, vous pouvez amener votre véhicule tel quel. Nous nous occupons du démontage et remontage des jantes. Nous pouvons également intervenir si vous avez déjà démonté les roues.", category: "pratique", sortOrder: 6, published: true },
      { question: "Quels sont vos tarifs ?", answer: "Nos tarifs débutent à partir de 45€ par jante pour un polissage simple. La rénovation complète commence à partir de 120€ par jante. Contactez-nous pour un devis personnalisé.", category: "tarifs", sortOrder: 7, published: true },
      { question: "Puis-je vous envoyer uniquement mes jantes par colis ?", answer: "Oui, nous acceptons les jantes envoyées par colis. Contactez-nous d'abord pour convenir des modalités d'envoi et de retour. Des frais de transport s'appliquent.", category: "pratique", sortOrder: 8, published: true },
    ]);

    await seedServices();
    await seedSiteContent();

    console.log("[seed] Base de données initialisée avec succès");
  } catch (error) {
    console.error("[seed] Erreur lors de l'initialisation:", error);
  }
}

async function seedServices() {
  await db.insert(siteServices).values([
    {
      title: "Soudure",
      description: "Réparation structurelle de vos jantes fissurées ou cassées par soudure professionnelle TIG/MIG.",
      image: "/images/service-renovation.png",
      badge: "Réparation",
      features: ["Diagnostic gratuit avant intervention", "Soudure TIG/MIG professionnelle", "Contrôle d'étanchéité après réparation", "Applicable sur jantes 14 à 22 pouces", "Résultat garanti"],
      price: "À partir de 60€/jante",
      slug: "soudure-jantes",
      sortOrder: 1,
      published: true,
    },
    {
      title: "Sablage",
      description: "Décapage complet par sablage pour une préparation parfaite avant rénovation ou peinture.",
      image: "/images/service-peinture.png",
      badge: "Préparation",
      features: ["Décapage complet de la peinture", "Élimination de la corrosion", "Préparation de surface optimale", "Compatible tous types de jantes", "Étape clé avant peinture"],
      price: "Inclus dans la rénovation",
      slug: "sablage",
      sortOrder: 2,
      published: true,
    },
    {
      title: "Devoilage",
      description: "Correction des voiles et déformations par presse hydraulique de précision. Sécurité avant tout.",
      image: "/images/service-redressage.png",
      badge: "Sécurité",
      features: ["Diagnostic gratuit avant intervention", "Presse hydraulique de précision CNC", "Contrôle du voile par laser", "Applicable sur jantes 14 à 22 pouces", "Résultat garanti"],
      price: "À partir de 45€/jante",
      slug: "devoilage",
      sortOrder: 3,
      published: true,
    },
    {
      title: "Rénovation",
      description: "Rénovation complète : sablage, apprêt, peinture et vernis haute résistance. Notre prestation phare.",
      image: "/images/service-renovation.png",
      badge: "Best-seller",
      features: ["Sablage ou décapage chimique complet", "Application d'un apprêt anti-corrosion", "Peinture en cabine professionnelle", "Vernis bi-composant haute résistance", "Contrôle qualité final"],
      price: "À partir de 120€/jante",
      slug: "renovation-jantes",
      sortOrder: 4,
      published: true,
    },
    {
      title: "Personnalisation",
      description: "Noir mat, bronze, bicolore, diamantage sur tour numérique... Finitions sur mesure selon vos envies.",
      image: "/images/service-peinture.png",
      badge: "Sur mesure",
      features: ["Plus de 50 couleurs disponibles", "Finitions mat, satiné, brillant, métallisé", "Diamantage sur tour numérique (bi-ton usiné)", "Peinture assortie à la carrosserie", "Peinture à l'eau écologique"],
      price: "À partir de 100€/jante",
      slug: "peinture-jantes",
      sortOrder: 5,
      published: true,
    },
    {
      title: "Hydrodipping",
      description: "Personnalisation par impression hydrographique pour des finitions uniques et originales.",
      image: "/images/gallery-2.png",
      badge: "Coming soon",
      features: ["Design 100% personnalisable", "Finition laquée par-dessus", "Effet unique et exclusif", "Sur devis uniquement"],
      price: "Sur devis",
      slug: "hydrodipping",
      sortOrder: 6,
      published: true,
    },
  ]);
}

async function seedSiteContent() {
  const defaults = [
    { key: "hero.badge", value: "Atelier à Liévin — 62800", label: "Badge Hero", category: "hero" },
    { key: "hero.title_line1", value: "L'expert de la", label: "Titre hero ligne 1", category: "hero" },
    { key: "hero.title_line2", value: "jante alu", label: "Titre hero ligne 2 (accent)", category: "hero" },
    { key: "hero.subtitle", value: "Soudure · Sablage · Devoilage · Rénovation · Personnalisation · Hydrodipping", label: "Sous-titre hero", category: "hero" },
    { key: "hero.cta_primary", value: "Devis gratuit", label: "Bouton principal CTA", category: "hero" },
    { key: "hero.cta_gallery", value: "Voir les réalisations", label: "Bouton galerie CTA", category: "hero" },
    { key: "stats", value: JSON.stringify([{ value: "5 000+", label: "Jantes rénovées" }, { value: "98%", label: "Clients satisfaits" }, { value: "garantie*", label: "Sur nos prestations" }, { value: "48h", label: "Délai moyen" }]), label: "Statistiques (JSON)", category: "stats" },
    { key: "trust_items", value: JSON.stringify(["Peinture certifiée OEM", "Diamantage sur tour numérique", "Garantie*", "Devis gratuit sous 24h", "Liévin — Hauts-de-France"]), label: "Bande de confiance (JSON)", category: "trust" },
    { key: "contact.phone", value: "03 21 40 80 53", label: "Téléphone", category: "contact" },
    { key: "contact.phone_href", value: "tel:+33321408053", label: "Lien téléphone (href)", category: "contact" },
    { key: "contact.whatsapp_number", value: "06 71 37 04 18", label: "Numéro WhatsApp (affiché)", category: "contact" },
    { key: "contact.whatsapp_href", value: "https://wa.me/33671370418?text=Bonjour,%20je%20souhaite%20un%20devis%20pour%20mes%20jantes.", label: "Lien WhatsApp (href)", category: "contact" },
    { key: "contact.address", value: "46 rue de la Convention, 62800 Liévin", label: "Adresse atelier", category: "contact" },
    { key: "contact.email", value: "contact@myjantes.com", label: "Email", category: "contact" },
    { key: "typography.font", value: "Montserrat", label: "Police d'écriture principale", category: "typography" },
    { key: "sections.process.title", value: "Comment ça marche ?", label: "Titre section processus", category: "sections" },
    { key: "sections.process.subtitle", value: "De vos photos à des jantes comme neuves — en 4 étapes simples.", label: "Sous-titre section processus", category: "sections" },
    { key: "sections.services.title", value: "Expertise complète", label: "Titre section prestations", category: "sections" },
    { key: "sections.services.subtitle", value: "Chaque intervention est réalisée avec une rigueur absolue à Liévin.", label: "Sous-titre section prestations", category: "sections" },
    { key: "sections.gallery.title", value: "Nos réalisations", label: "Titre section galerie", category: "sections" },
    { key: "sections.gallery.subtitle", value: "Avant / Après — L'excellence MyJantes en images.", label: "Sous-titre section galerie", category: "sections" },
    { key: "sections.testimonials.title", value: "Ce que disent nos clients", label: "Titre section avis", category: "sections" },
    { key: "sections.whyus.title", value: "Pourquoi choisir MyJantes ?", label: "Titre section avantages", category: "sections" },
  ];
  for (const item of defaults) {
    await storage.setSiteContent(item.key, item.value, item.label, item.category);
  }
}
