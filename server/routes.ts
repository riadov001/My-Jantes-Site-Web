import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import memorystore from "memorystore";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { sendContactNotification, sendPasswordResetEmail } from "./email";
import {
  insertContactSchema,
  insertBlogSchema,
  insertGallerySchema,
  insertTestimonialSchema,
  insertFaqSchema,
  insertSiteServiceSchema,
} from "@shared/schema";
import { seedDatabase } from "./seed";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const MemoryStore = memorystore(session);

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

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /image\/(jpeg|jpg|png|gif|webp|heic)|video\/(mp4|webm|mov|quicktime)/i;
    if (allowed.test(file.mimetype)) cb(null, true);
    else cb(new Error("Type de fichier non supporté"));
  }
});

function parseObjPath(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const parts = p.split("/");
  const bucketName = parts[1];
  const objectName = parts.slice(2).join("/");
  return { bucketName, objectName };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  const dbConnectionString =
    process.env.NODE_ENV === "production" && process.env.PROD_DB_URL
      ? process.env.PROD_DB_URL
      : process.env.DATABASE_URL;

  const pool = new Pool({ connectionString: dbConnectionString });

  let dbAvailable = false;

  // Create session table manually to avoid missing table.sql in production bundle
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL,
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
      );
    `);
    await pool.query(`CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");`);
    dbAvailable = true;
  } catch (e) {
    console.log("[session] DB unavailable, switching to memory store:", (e as Error).message);
  }

  const isProduction = process.env.NODE_ENV === "production";

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

  const sessionStore = dbAvailable
    ? new PgSession({ pool, createTableIfMissing: false })
    : new MemoryStore({ checkPeriod: 86400000 });

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "myjantes-secret-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) return res.sendFile(filePath);
    next();
  });

  registerObjectStorageRoutes(app);

  await seedDatabase();

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Identifiants requis" });

    try {
      const user = await storage.validatePassword(username, password);
      if (!user || !user.isAdmin) return res.status(401).json({ message: "Identifiants invalides" });
      req.session.userId = user.id;
      req.session.isAdmin = true;
      return res.json({ message: "Connecté", user: { id: user.id, username: user.username } });
    } catch (dbErr) {
      console.warn("[auth] DB unavailable, trying fallback credentials:", (dbErr as Error).message);
      const fallbackEmail = process.env.ADMIN_EMAIL || "contact@myjantes.com";
      const fallbackPassword = process.env.ADMIN_PASSWORD;
      if (!fallbackPassword) return res.status(503).json({ message: "Service temporairement indisponible" });
      const validFallback = username === fallbackEmail && (await bcrypt.compare(password, fallbackPassword).catch(() => password === fallbackPassword));
      if (!validFallback) return res.status(401).json({ message: "Identifiants invalides" });
      req.session.userId = "admin-fallback";
      req.session.isAdmin = true;
      return res.json({ message: "Connecté", user: { id: "admin-fallback", username } });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Déconnecté" }));
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.userId && req.session.isAdmin) return res.json({ authenticated: true, userId: req.session.userId });
    return res.json({ authenticated: false });
  });

  const resetTokenStore = new Map<string, { userId: string; expires: number }>();

  app.post("/api/admin/forgot-password", async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Identifiant requis" });
    const user = await storage.getUserByUsername(username);
    if (!user || !user.email) return res.json({ message: "Si un compte avec cet identifiant et un email associé existe, un lien de réinitialisation a été envoyé." });
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    resetTokenStore.set(token, { userId: user.id, expires: Date.now() + 3600 * 1000 });
    sendPasswordResetEmail(user.email, token, user.username).catch(err => console.error("[email] reset error:", err));
    return res.json({ message: "Si un compte avec cet identifiant et un email associé existe, un lien de réinitialisation a été envoyé." });
  });

  app.post("/api/admin/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    const record = resetTokenStore.get(token);
    if (!record || record.expires < Date.now()) return res.status(400).json({ message: "Lien expiré ou invalide" });
    await storage.updateUserPassword(record.userId, newPassword);
    resetTokenStore.delete(token);
    return res.json({ message: "Mot de passe réinitialisé" });
  });

  app.get("/api/admin/profile", requireAdmin, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.put("/api/admin/profile/password", requireAdmin, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Champs requis" });
    if (newPassword.length < 8) return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
    const user = await storage.getUser(req.session.userId!);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    const valid = await storage.validatePassword(user.username, currentPassword);
    if (!valid) return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    await storage.updateUserPassword(user.id, newPassword);
    await storage.createActivityLog(user.id, "Changement de mot de passe", "sécurité");
    return res.json({ message: "Mot de passe modifié" });
  });

  app.put("/api/admin/profile/email", requireAdmin, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email requis" });
    const user = await storage.updateUserEmail(req.session.userId!, email);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    await storage.createActivityLog(req.session.userId!, `Email modifié: ${email}`, "sécurité");
    const { password: _, ...safeUser } = user;
    return res.json(safeUser);
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    return res.json(allUsers.map(({ password: _, ...u }) => u));
  });

  app.post("/api/admin/users", requireAdmin, async (req, res) => {
    const { username, password, email, isAdmin } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Identifiant et mot de passe requis" });
    if (password.length < 8) return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
    try {
      const user = await storage.createUser({ username, password, email, isAdmin: !!isAdmin });
      await storage.createActivityLog(req.session.userId!, `Utilisateur créé: ${username}`, "utilisateurs");
      const { password: _, ...safeUser } = user;
      return res.status(201).json(safeUser);
    } catch {
      return res.status(409).json({ message: "Cet identifiant existe déjà" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    const userId = req.params.id as string;
    if (userId === req.session.userId) return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    const user = await storage.getUser(userId);
    await storage.deleteUser(userId);
    await storage.createActivityLog(req.session.userId!, `Utilisateur supprimé: ${user?.username}`, "utilisateurs");
    return res.json({ message: "Utilisateur supprimé" });
  });

  app.get("/api/admin/activity-logs", requireAdmin, async (req, res) => {
    const logs = await storage.getActivityLogs(200);
    return res.json(logs);
  });

  // Page view tracking (public)
  app.post("/api/track", async (req, res) => {
    const { path: pagePath } = req.body;
    if (pagePath && typeof pagePath === "string") {
      await storage.trackPageView(pagePath, req.headers.referer, req.headers["user-agent"]);
    }
    return res.json({ ok: true });
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ message: "Données invalides", errors: result.error.errors });
    const contact = await storage.createContactRequest(result.data);
    const adminEmailContent = await storage.getSiteContentByKey("contact.email");
    sendContactNotification({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      vehicle: result.data.vehicle,
      message: result.data.message,
      service: result.data.requestType || result.data.service,
      adminEmail: adminEmailContent?.value || "contact@myjantes.com",
    }).catch(err => console.error("[email] sendContactNotification failed:", err));
    return res.status(201).json(contact);
  });

  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    const contacts = await storage.getContactRequests();
    return res.json(contacts);
  });

  app.patch("/api/admin/contacts/:id/status", requireAdmin, async (req, res) => {
    const { status } = req.body;
    const contact = await storage.updateContactStatus(req.params.id as string, status);
    if (!contact) return res.status(404).json({ message: "Contact non trouvé" });
    return res.json(contact);
  });

  app.delete("/api/admin/contacts/:id", requireAdmin, async (req, res) => {
    await storage.deleteContactRequest(req.params.id as string);
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
    const post = await storage.updateBlogPost(req.params.id as string, result.data);
    if (!post) return res.status(404).json({ message: "Article non trouvé" });
    return res.json(post);
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    await storage.deleteBlogPost(req.params.id as string);
    return res.json({ message: "Article supprimé" });
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    const items = await storage.getGalleryItems(true);
    return res.json(items);
  });

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
    const item = await storage.updateGalleryItem(req.params.id as string, result.data);
    if (!item) return res.status(404).json({ message: "Élément non trouvé" });
    return res.json(item);
  });

  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    await storage.deleteGalleryItem(req.params.id as string);
    return res.json({ message: "Élément supprimé" });
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    const items = await storage.getTestimonials(true);
    return res.json(items);
  });

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
    const t = await storage.updateTestimonial(req.params.id as string, result.data);
    if (!t) return res.status(404).json({ message: "Témoignage non trouvé" });
    return res.json(t);
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    await storage.deleteTestimonial(req.params.id as string);
    return res.json({ message: "Témoignage supprimé" });
  });

  // FAQ routes
  app.get("/api/faq", async (req, res) => {
    const items = await storage.getFaqItems(true);
    return res.json(items);
  });

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
    const f = await storage.updateFaqItem(req.params.id as string, result.data);
    if (!f) return res.status(404).json({ message: "FAQ non trouvée" });
    return res.json(f);
  });

  app.delete("/api/admin/faq/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaqItem(req.params.id as string);
    return res.json({ message: "FAQ supprimée" });
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    const items = await storage.getSiteServices(true);
    return res.json(items);
  });

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
    const s = await storage.updateSiteService(req.params.id as string, result.data);
    if (!s) return res.status(404).json({ message: "Prestation non trouvée" });
    return res.json(s);
  });

  app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
    await storage.deleteSiteService(req.params.id as string);
    return res.json({ message: "Prestation supprimée" });
  });

  // Site Content routes
  app.get("/api/site-content", async (req, res) => {
    const items = await storage.getAllSiteContent();
    const map: Record<string, string> = {};
    for (const item of items) map[item.key] = item.value;
    return res.json(map);
  });

  app.get("/api/admin/site-content", requireAdmin, async (req, res) => {
    const items = await storage.getAllSiteContent();
    return res.json(items);
  });

  app.put("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    const { value, label, category } = req.body;
    if (value === undefined) return res.status(400).json({ message: "Valeur requise" });
    const c = await storage.setSiteContent(req.params.key as string, String(value), label, category);
    return res.json(c);
  });

  app.patch("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ message: "Valeur requise" });
    const c = await storage.setSiteContent(req.params.key as string, String(value));
    return res.json(c);
  });

  app.delete("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    await storage.deleteSiteContent(req.params.key as string);
    return res.json({ message: "Contenu supprimé" });
  });

  // Upload — admin (for media library) — stores to Object Storage + local
  app.post("/api/admin/upload", requireAdmin, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Fichier requis" });
    let url = `/uploads/${req.file.filename}`;

    try {
      const { ObjectStorageService, objectStorageClient } = await import("./replit_integrations/object_storage");
      const oss = new ObjectStorageService();
      const privateDir = oss.getPrivateObjectDir();
      const { bucketName, objectName } = parseObjPath(`${privateDir}/uploads/${req.file.filename}`);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      await file.save(fs.readFileSync(req.file.path), { contentType: req.file.mimetype });
      url = `/objects/uploads/${req.file.filename}`;
    } catch (e) {
      console.log("Object storage upload fallback to local:", (e as Error).message);
    }

    await storage.createMediaFile({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
    return res.json({ url, filename: req.file.filename, mimeType: req.file.mimetype });
  });

  // Upload — public (for contact form image) — stores to Object Storage + local
  app.post("/api/admin/upload-public", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Fichier requis" });
    let url = `/uploads/${req.file.filename}`;

    try {
      const { ObjectStorageService, objectStorageClient } = await import("./replit_integrations/object_storage");
      const oss = new ObjectStorageService();
      const privateDir = oss.getPrivateObjectDir();
      const { bucketName, objectName } = parseObjPath(`${privateDir}/uploads/${req.file.filename}`);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      await file.save(fs.readFileSync(req.file.path), { contentType: req.file.mimetype });
      url = `/objects/uploads/${req.file.filename}`;
    } catch (e) {
      console.log("Object storage upload-public fallback to local:", (e as Error).message);
    }

    return res.json({ url });
  });

  // Media library
  app.get("/api/admin/media", requireAdmin, async (req, res) => {
    const files = await storage.getMediaFiles();
    return res.json(files);
  });

  app.delete("/api/admin/media/:id", requireAdmin, async (req, res) => {
    await storage.deleteMediaFile(req.params.id as string);
    return res.json({ message: "Fichier supprimé" });
  });

  // Analytics
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    const analytics = await storage.getAnalytics();
    const contacts = await storage.getContactRequests();
    const gallery = await storage.getGalleryItems(false);
    const testimonials = await storage.getTestimonials(false);
    const services = await storage.getSiteServices(false);
    const faq = await storage.getFaqItems(false);
    return res.json({
      ...analytics,
      totalContacts: contacts.length,
      newContacts: contacts.filter(c => c.status === "nouveau").length,
      pendingContacts: contacts.filter(c => c.status === "en_cours").length,
      treatedContacts: contacts.filter(c => c.status === "traite").length,
      totalGallery: gallery.length,
      totalTestimonials: testimonials.length,
      totalServices: services.length,
      totalFaq: faq.length,
    });
  });

  app.post("/api/chatbot", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      if (!message) return res.status(400).json({ error: "Message requis" });

      const FALLBACK_SERVICES_CONTEXT = `- Soudure: Réparation structurelle de vos jantes fissurées ou cassées par soudure professionnelle TIG/MIG. | Prix: À partir de 60€/jante | Lien: /services/soudure-jantes
- Sablage: Décapage complet par sablage pour une préparation parfaite avant rénovation ou peinture. | Prix: Inclus dans la rénovation | Lien: /services/sablage
- Devoilage: Correction des voiles et déformations par presse hydraulique de précision. | Prix: À partir de 45€/jante | Lien: /services/devoilage
- Rénovation: Rénovation complète : sablage, apprêt, peinture et vernis haute résistance. Notre prestation phare. | Prix: À partir de 120€/jante | Lien: /services/renovation-jantes
- Personnalisation: Noir mat, bronze, bicolore, diamantage sur tour numérique... Finitions sur mesure. | Prix: À partir de 100€/jante | Lien: /services/peinture-jantes
- Hydrodipping: Personnalisation par impression hydrographique pour des finitions uniques. | Prix: Sur devis | Lien: /services/hydrodipping`;

      const FALLBACK_FAQ_CONTEXT = `Q: Combien de temps prend une rénovation de jantes ?
R: En général, comptez 3 à 5 jours ouvrés pour une rénovation complète. Les réparations simples (soudure, redressage) peuvent être réalisées en 24 à 48h.

Q: Quels types de jantes traitez-vous ?
R: Nous traitons exclusivement les jantes en alliage aluminium (alu), du 14 au 22 pouces, pour tous types de véhicules.

Q: Proposez-vous un devis gratuit ?
R: Oui, le diagnostic et le devis sont gratuits. Contactez-nous via le formulaire ou appelez-nous directement.

Q: Intervenez-vous sur place ou faut-il déposer les jantes ?
R: Les jantes doivent être déposées à notre atelier de Liévin. Nous n'effectuons pas de déplacement à domicile.

Q: Quelles garanties offrez-vous sur votre travail ?
R: Nous offrons une garantie sur nos prestations. Notre objectif est votre entière satisfaction.`;

      let servicesContext = FALLBACK_SERVICES_CONTEXT;
      let faqContext = FALLBACK_FAQ_CONTEXT;
      const contentMap: Record<string, string> = {};

      try {
        const [services, faqItemsDb, contentItems] = await Promise.all([
          storage.getSiteServices(true),
          storage.getFaqItems(true),
          storage.getAllSiteContent(),
        ]);
        if (services.length > 0) {
          servicesContext = services.map(s =>
            `- ${s.title}: ${s.description} | Prix: ${s.price} | Lien: /services/${s.slug}`
          ).join("\n");
        }
        if (faqItemsDb.length > 0) {
          faqContext = faqItemsDb.map(f =>
            `Q: ${f.question}\nR: ${f.answer}`
          ).join("\n\n");
        }
        for (const item of contentItems) contentMap[item.key] = item.value;
      } catch (dbError) {
        console.warn("Chatbot: DB unavailable, using fallback data:", (dbError as Error).message);
      }

      const systemPrompt = `Tu es l'assistant virtuel de MyJantes, expert en rénovation de jantes alu situé à Liévin (62800), Hauts-de-France.

INFORMATIONS CLÉS:
- Adresse: ${contentMap["contact.address"] || "46 rue de la Convention, 62800 Liévin"}
- Téléphone: ${contentMap["contact.phone"] || "03 21 40 80 53"}
- Email: ${contentMap["contact.email"] || "contact@myjantes.com"}
- WhatsApp: ${contentMap["contact.whatsapp_number"] || "06 71 37 04 18"}
- Horaires: ${contentMap["footer.hours_line1"] || "Lun-Ven 9h-12h30"}, ${contentMap["footer.hours_line2"] || "13h30-18h00"}

NOS PRESTATIONS:
${servicesContext}

FAQ:
${faqContext}

PAGES DU SITE:
- Accueil: /
- Services: /services
- Galerie de réalisations: /galerie
- Contact & Devis: /contact
- À propos: /a-propos
- FAQ: /faq
- Garanties: /garanties

RÈGLES:
1. Réponds TOUJOURS en français, de manière professionnelle mais chaleureuse.
2. Fournis des liens de redirection quand c'est pertinent (format markdown: [texte](/chemin)).
3. Pour les demandes de devis, redirige vers la page contact: [Demander un devis gratuit](/contact).
4. Tu ne connais QUE les informations ci-dessus. Ne fabrique pas de prix ou d'informations.
5. Sois concis mais utile. Maximum 3-4 phrases par réponse.
6. Mets en avant la qualité, le professionnalisme et la proximité de l'atelier.`;

      const geminiApiKey =
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!geminiApiKey) {
        return res.status(503).json({ error: "Service chatbot non configuré" });
      }

      const genai = new GoogleGenAI({ apiKey: geminiApiKey });

      const contents = [
        ...history.slice(-10).map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content as string }],
        })),
        { role: "user", parts: [{ text: message as string }] },
      ];

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await genai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Chatbot error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Erreur du chatbot" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Erreur du chatbot" });
      }
    }
  });

  app.post("/api/ocr", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl) return res.status(400).json({ error: "URL d'image requise" });

      if (!imageUrl.startsWith("/objects/") && !imageUrl.startsWith("/uploads/")) {
        return res.status(400).json({ error: "Seules les images uploadées sur le site sont acceptées" });
      }

      const geminiApiKey =
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
      if (!geminiApiKey) return res.status(503).json({ error: "Service OCR non configuré" });
      const genai = new GoogleGenAI({ apiKey: geminiApiKey });

      const localUrl = `${req.protocol}://${req.get("host")}${imageUrl}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const imageResponse = await fetch(localUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!imageResponse.ok) return res.status(400).json({ error: "Image introuvable" });

      const contentType = imageResponse.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) return res.status(400).json({ error: "Le fichier n'est pas une image" });

      const imageBuffer = await imageResponse.arrayBuffer();
      if (imageBuffer.byteLength > 10 * 1024 * 1024) return res.status(400).json({ error: "Image trop volumineuse (max 10 Mo)" });

      const base64Image = Buffer.from(imageBuffer).toString("base64");
      const mimeType = contentType;

      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [
            { inlineData: { mimeType, data: base64Image } },
            { text: `Analyse cette image de carte grise ou de jante/roue de véhicule. Extrais les informations suivantes si visibles:
- Marque du véhicule
- Modèle du véhicule
- Immatriculation
- Type de jante (taille, matériau si visible)
- Tout autre détail pertinent pour une demande de rénovation de jantes

Réponds en JSON avec ces champs (laisse vide si non trouvé):
{"vehicle": "Marque Modèle", "plate": "Immatriculation", "wheelInfo": "Infos jante", "details": "Autres détails"}` },
          ],
        }],
      });

      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      let parsed: Record<string, string> = {};
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = {};
      }

      res.json({
        success: true,
        data: {
          vehicle: parsed.vehicle || "",
          plate: parsed.plate || "",
          wheelInfo: parsed.wheelInfo || "",
          details: parsed.details || "",
        },
      });
    } catch (error) {
      console.error("OCR error:", error);
      res.status(500).json({ error: "Erreur lors de l'analyse de l'image" });
    }
  });

  return httpServer;
}
