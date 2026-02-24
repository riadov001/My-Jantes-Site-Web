import { storage } from "./storage";
import { db } from "./db";
import {
  users, testimonials, blogPosts, galleryItems, faqItems,
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
      // Seed already ran, skip the rest
      return;
    }

    await storage.createUser({
      username: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    await db.update(users).set({ isAdmin: true }).where(eq(users.username, ADMIN_EMAIL));

    await db.insert(testimonials).values([
      {
        name: "Cédric",
        location: "Liévin",
        rating: 5,
        content: "Accueil au top, travail de pro et soigné. Je recommande les yeux fermés. Mes jantes sont comme neuves !",
        vehicle: "Volkswagen Golf",
        published: true,
      },
      {
        name: "David",
        location: "Lens",
        rating: 5,
        content: "Super boulot sur mes jantes de Tesla. Équipe très pro, délais respectés et résultat magnifique. Merci MyJantes !",
        vehicle: "Tesla Model 3",
        published: true,
      },
      {
        name: "Aurélien",
        location: "Arras",
        rating: 5,
        content: "Rénovation de 4 jantes diamond cut. Le résultat est bluffant, identique à l'origine. Très bon rapport qualité/prix.",
        vehicle: "Mercedes Classe A",
        published: true,
      },
      {
        name: "Julien",
        location: "Béthune",
        rating: 5,
        content: "Un grand merci pour le redressage de ma jante voilée. Service rapide et efficace. Je reviendrai pour la peinture.",
        vehicle: "Audi S3",
        published: true,
      },
      {
        name: "Mickaël",
        location: "Douai",
        rating: 5,
        content: "Peinture complète en noir brillant. Finition parfaite, aucune poussière. Travail vraiment sérieux.",
        vehicle: "BMW M4",
        published: true,
      },
    ]);

    await db.insert(blogPosts).values([
      {
        title: "Comment entretenir vos jantes en alliage pour les garder comme neuves",
        slug: "entretien-jantes-alliage",
        excerpt: "Découvrez nos conseils professionnels pour préserver l'éclat de vos jantes en alliage et prolonger leur durée de vie.",
        content: `# Comment entretenir vos jantes en alliage

Les jantes en alliage sont un élément essentiel de l'esthétique de votre véhicule. Un entretien régulier permet de les conserver en parfait état.

## Nettoyage régulier

Il est recommandé de nettoyer vos jantes toutes les deux semaines minimum. Utilisez un produit spécifique pour jantes en alliage et une brosse douce.

## Protection contre la corrosion

Appliquez une cire protectrice après chaque nettoyage. Cela crée une barrière protectrice contre les agressions extérieures.

## Inspection des dommages

Vérifiez régulièrement l'absence de rayures ou de déformations. Un dommage détecté tôt coûtera moins cher à réparer.

## Contactez nos experts

Si vous constatez des dommages, n'hésitez pas à nous contacter. Nos spécialistes vous proposeront la meilleure solution de rénovation.`,
        coverImage: "/images/gallery-1.png",
        metaTitle: "Entretien Jantes Alliage - Conseils Experts | MyJantes",
        metaDescription: "Apprenez à entretenir vos jantes en alliage avec nos conseils professionnels. Nettoyage, protection et inspection pour des jantes toujours impeccables.",
        published: true,
      },
      {
        title: "Rénovation de jantes : Quand est-il temps de les refaire ?",
        slug: "quand-renover-jantes",
        excerpt: "Rayures, fissures, déformations... Apprenez à identifier les signes qui indiquent qu'il est temps de rénover vos jantes.",
        content: `# Rénovation de jantes : Quand agir ?

Vos jantes subissent quotidiennement de nombreuses agressions. Il est important de savoir identifier le bon moment pour les rénover.

## Les signes qui ne trompent pas

### Rayures et éraflures
Les rayures superficielles sont les dommages les plus courants. Elles peuvent souvent être traitées par polissage ou peinture locale.

### Déformations et voiles
Une jante déformée ou voilée peut affecter la tenue de route et la sécurité. Un redressage professionnel s'impose.

### Corrosion et oxydation
L'oxydation est un signe de dégradation avancée. Sans traitement, elle peut fragiliser la structure de la jante.

## Notre solution

Chez MyJantes, nous réalisons un diagnostic complet gratuit avant tout devis. Contactez-nous pour une évaluation de vos jantes.`,
        coverImage: "/images/service-renovation.png",
        metaTitle: "Quand Rénover ses Jantes - Guide Complet | MyJantes",
        metaDescription: "Identifiez les signes d'usure de vos jantes : rayures, déformations, corrosion. Découvrez quand et comment faire rénover vos jantes.",
        published: true,
      },
      {
        title: "Les tendances de peinture jantes 2024 : Couleurs et finitions tendance",
        slug: "tendances-peinture-jantes-2024",
        excerpt: "Noir mat, gris anthracite, bronze... Découvrez les couleurs et finitions les plus tendance pour personnaliser vos jantes en 2024.",
        content: `# Tendances Peinture Jantes 2024

La personnalisation des jantes est en plein essor. Voici les tendances qui dominent le marché en 2024.

## Les couleurs phares

### Noir mat
Le noir mat reste la couleur la plus demandée. Il apporte un aspect sportif et élégant à tout type de véhicule.

### Gris anthracite
Cette teinte sophistiquée s'accorde parfaitement avec la plupart des couleurs de carrosserie.

### Bronze et cuivre
Les tons chauds métalliques font leur grand retour et se marient idéalement avec les véhicules sombres.

## Les finitions tendance

- **Mat** : élégant et sportif
- **Brillant** : classique et premium
- **Diamond cut** : haut de gamme avec une touche de brillance
- **Bicolore** : personnalisation maximale

## Réalisez votre projet

Nos experts vous conseillent sur les meilleures options de personnalisation pour votre véhicule.`,
        coverImage: "/images/service-peinture.png",
        metaTitle: "Tendances Peinture Jantes 2024 - Couleurs et Finitions | MyJantes",
        metaDescription: "Découvrez les tendances 2024 en peinture de jantes : noir mat, gris anthracite, bronze. Inspirez-vous pour personnaliser vos roues.",
        published: true,
      },
    ]);

    await db.insert(galleryItems).values([
      {
        title: "Rénovation jantes BMW",
        serviceType: "renovation",
        afterImage: "/images/gallery-1.png",
        beforeImage: "/images/before-after-1.png",
        description: "Rénovation complète de jantes BMW - sablage, apprêt, peinture gris anthracite",
        published: true,
      },
      {
        title: "Peinture personnalisée",
        serviceType: "peinture",
        afterImage: "/images/gallery-2.png",
        description: "Peinture noir mat personnalisée sur jantes 19 pouces",
        published: true,
      },
      {
        title: "Jantes sport custom",
        serviceType: "peinture",
        afterImage: "/images/gallery-3.png",
        description: "Finition bronze satiné sur jantes sport",
        published: true,
      },
      {
        title: "Rénovation jantes Audi",
        serviceType: "renovation",
        afterImage: "/images/service-renovation.png",
        description: "Remise à neuf complète sur jantes Audi 5 branches",
        published: true,
      },
    ]);

    await db.insert(faqItems).values([
      {
        question: "Combien de temps dure une rénovation de jantes ?",
        answer: "La durée varie selon le type de prestation. Un redressage simple prend 1 à 2 jours. Une rénovation complète avec peinture peut prendre 3 à 5 jours ouvrés.",
        category: "delais",
        sortOrder: 1,
        published: true,
      },
      {
        question: "Quels types de jantes pouvez-vous rénover ?",
        answer: "Nous travaillons sur tous types de jantes en alliage (aluminium), quelle que soit la marque ou le modèle. Nous intervenons également sur les jantes acier.",
        category: "services",
        sortOrder: 2,
        published: true,
      },
      {
        question: "La rénovation de jantes est-elle garantie ?",
        answer: "Oui ! Toutes nos prestations sont garanties 12 mois contre les défauts de peinture et de main-d'œuvre. Nous utilisons des peintures professionnelles haute résistance.",
        category: "garantie",
        sortOrder: 3,
        published: true,
      },
      {
        question: "Peut-on changer la couleur de ses jantes ?",
        answer: "Absolument ! Nous pouvons peindre vos jantes dans la couleur de votre choix : noir mat, gris anthracite, bronze, couleur carrosserie assortie et bien plus encore.",
        category: "services",
        sortOrder: 4,
        published: true,
      },
      {
        question: "Comment obtenir un devis ?",
        answer: "Contactez-nous par téléphone, WhatsApp ou via notre formulaire en ligne. Envoyez-nous des photos de vos jantes et nous vous répondrons dans les 24h avec un devis gratuit.",
        category: "devis",
        sortOrder: 5,
        published: true,
      },
      {
        question: "Faut-il démonter les roues avant de les apporter ?",
        answer: "Non, vous pouvez amener votre véhicule tel quel. Nous nous occupons du démontage et remontage des jantes. Nous pouvons également intervenir si vous avez déjà démonté les roues.",
        category: "pratique",
        sortOrder: 6,
        published: true,
      },
      {
        question: "Quels sont vos tarifs ?",
        answer: "Nos tarifs débutent à partir de 45€ par jante pour un polissage simple. La rénovation complète commence à partir de 120€ par jante. Contactez-nous pour un devis personnalisé.",
        category: "tarifs",
        sortOrder: 7,
        published: true,
      },
      {
        question: "Puis-je vous envoyer uniquement mes jantes par colis ?",
        answer: "Oui, nous acceptons les jantes envoyées par colis. Contactez-nous d'abord pour convenir des modalités d'envoi et de retour. Des frais de transport s'appliquent.",
        category: "pratique",
        sortOrder: 8,
        published: true,
      },
    ]);

    console.log("[seed] Base de données initialisée avec succès");
  } catch (error) {
    console.error("[seed] Erreur lors de l'initialisation:", error);
  }
}
