import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import { Pool } from "pg";
import { storage } from "./storage";
import {
  insertContactSchema,
  insertBlogSchema,
  insertGallerySchema,
  insertTestimonialSchema,
  insertFaqSchema,
  insertSiteServiceSchema,
} from "@shared/schema";
import { seedDatabase } from "./seed";
import { z } from "zod";

const PgSession = connectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    userId?: string;
    isAdmin?: boolean;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || !req.session.isAdmin) {
    return res.status(401).json({ message: "Non autorisé" });
  }
  next();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  app.use(cors({
    origin: [
      "https://appmyjantes.mytoolsgroup.eu",
      "http://appmyjantes.mytoolsgroup.eu",
      /\.replit\.app$/,
      /\.replit\.dev$/,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));

  app.use(
    session({
      store: new PgSession({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "myjantes-secret-2024",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
  );

  await seedDatabase();

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Identifiants requis" });
    }
    const user = await storage.validatePassword(username, password);
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    req.session.userId = user.id;
    req.session.isAdmin = true;
    return res.json({ message: "Connecté", user: { id: user.id, username: user.username } });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Déconnecté" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.userId && req.session.isAdmin) {
      return res.json({ authenticated: true, userId: req.session.userId });
    }
    return res.json({ authenticated: false });
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Données invalides", errors: result.error.errors });
    }
    const contact = await storage.createContactRequest(result.data);
    return res.status(201).json(contact);
  });

  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    const contacts = await storage.getContactRequests();
    return res.json(contacts);
  });

  app.patch("/api/admin/contacts/:id/status", requireAdmin, async (req, res) => {
    const { status } = req.body;
    const contact = await storage.updateContactStatus(req.params.id, status);
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    return res.json(contact);
  });

  app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    await storage.deleteContactRequest(req.params.id);
    return res.json({ message: "Contact supprimé" });
  });

  // Blog routes (public)
  app.get("/api/blog", async (req, res) => {
    const posts = await storage.getBlogPosts(true);
    return res.json(posts);
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post || !post.published) return res.status(404).json({ message: "Article non trouvé" });
    return res.json(post);
  });

  // Blog routes (admin)
  app.get("/api/admin/blog", requireAdmin, async (req, res) => {
    const posts = await storage.getBlogPosts(false);
    return res.json(posts);
  });

  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    const result = insertBlogSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const post = await storage.createBlogPost(result.data);
    return res.status(201).json(post);
  });

  app.put("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    const result = insertBlogSchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const post = await storage.updateBlogPost(req.params.id, result.data);
    if (!post) return res.status(404).json({ message: "Article non trouvé" });
    return res.json(post);
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    await storage.deleteBlogPost(req.params.id);
    return res.json({ message: "Article supprimé" });
  });

  // Gallery routes (public)
  app.get("/api/gallery", async (req, res) => {
    const items = await storage.getGalleryItems(true);
    return res.json(items);
  });

  // Gallery routes (admin)
  app.get("/api/admin/gallery", requireAdmin, async (req, res) => {
    const items = await storage.getGalleryItems(false);
    return res.json(items);
  });

  app.post("/api/admin/gallery", requireAdmin, async (req, res) => {
    const result = insertGallerySchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const item = await storage.createGalleryItem(result.data);
    return res.status(201).json(item);
  });

  app.put("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    const result = insertGallerySchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const item = await storage.updateGalleryItem(req.params.id, result.data);
    if (!item) return res.status(404).json({ message: "Élément non trouvé" });
    return res.json(item);
  });

  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    await storage.deleteGalleryItem(req.params.id);
    return res.json({ message: "Élément supprimé" });
  });

  // Testimonials routes (public)
  app.get("/api/testimonials", async (req, res) => {
    const items = await storage.getTestimonials(true);
    return res.json(items);
  });

  // Testimonials routes (admin)
  app.get("/api/admin/testimonials", requireAdmin, async (req, res) => {
    const items = await storage.getTestimonials(false);
    return res.json(items);
  });

  app.post("/api/admin/testimonials", requireAdmin, async (req, res) => {
    const result = insertTestimonialSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const t = await storage.createTestimonial(result.data);
    return res.status(201).json(t);
  });

  app.put("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    const result = insertTestimonialSchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const t = await storage.updateTestimonial(req.params.id, result.data);
    if (!t) return res.status(404).json({ message: "Témoignage non trouvé" });
    return res.json(t);
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    await storage.deleteTestimonial(req.params.id);
    return res.json({ message: "Témoignage supprimé" });
  });

  // FAQ routes (public)
  app.get("/api/faq", async (req, res) => {
    const items = await storage.getFaqItems(true);
    return res.json(items);
  });

  // FAQ routes (admin)
  app.get("/api/admin/faq", requireAdmin, async (req, res) => {
    const items = await storage.getFaqItems(false);
    return res.json(items);
  });

  app.post("/api/admin/faq", requireAdmin, async (req, res) => {
    const result = insertFaqSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const f = await storage.createFaqItem(result.data);
    return res.status(201).json(f);
  });

  app.put("/api/admin/faq/:id", requireAdmin, async (req, res) => {
    const result = insertFaqSchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const f = await storage.updateFaqItem(req.params.id, result.data);
    if (!f) return res.status(404).json({ message: "FAQ non trouvée" });
    return res.json(f);
  });

  app.delete("/api/admin/faq/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaqItem(req.params.id);
    return res.json({ message: "FAQ supprimée" });
  });

  // Site Services routes (public)
  app.get("/api/services", async (req, res) => {
    const items = await storage.getSiteServices(true);
    return res.json(items);
  });

  // Site Services routes (admin)
  app.get("/api/admin/services", requireAdmin, async (req, res) => {
    const items = await storage.getSiteServices(false);
    return res.json(items);
  });

  app.post("/api/admin/services", requireAdmin, async (req, res) => {
    const result = insertSiteServiceSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const s = await storage.createSiteService(result.data);
    return res.status(201).json(s);
  });

  app.put("/api/admin/services/:id", requireAdmin, async (req, res) => {
    const result = insertSiteServiceSchema.partial().safeParse(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.errors });
    const s = await storage.updateSiteService(req.params.id, result.data);
    if (!s) return res.status(404).json({ message: "Prestation non trouvée" });
    return res.json(s);
  });

  app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
    await storage.deleteSiteService(req.params.id);
    return res.json({ message: "Prestation supprimée" });
  });

  // Site Content routes (public)
  app.get("/api/site-content", async (req, res) => {
    const items = await storage.getAllSiteContent();
    const map: Record<string, string> = {};
    for (const item of items) {
      map[item.key] = item.value;
    }
    return res.json(map);
  });

  // Site Content routes (admin)
  app.get("/api/admin/site-content", requireAdmin, async (req, res) => {
    const items = await storage.getAllSiteContent();
    return res.json(items);
  });

  app.put("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    const { value, label, category } = req.body;
    if (value === undefined) return res.status(400).json({ message: "Valeur requise" });
    const c = await storage.setSiteContent(req.params.key, String(value), label, category);
    return res.json(c);
  });

  app.delete("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    await storage.deleteSiteContent(req.params.key);
    return res.json({ message: "Contenu supprimé" });
  });

  return httpServer;
}
