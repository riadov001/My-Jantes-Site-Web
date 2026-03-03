import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import { Pool } from "pg";
import path from "path";
import fs from "fs";
import multer from "multer";
import { storage } from "./storage";
import { sendContactNotification } from "./email";
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
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
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
    const user = await storage.validatePassword(username, password);
    if (!user || !user.isAdmin) return res.status(401).json({ message: "Identifiants invalides" });
    req.session.userId = user.id;
    req.session.isAdmin = true;
    return res.json({ message: "Connecté", user: { id: user.id, username: user.username } });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => res.json({ message: "Déconnecté" }));
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.session.userId && req.session.isAdmin) return res.json({ authenticated: true, userId: req.session.userId });
    return res.json({ authenticated: false });
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
    sendContactNotification({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      vehicle: result.data.vehicle,
      message: result.data.message,
      service: result.data.requestType || result.data.service,
    }).catch(err => console.error("[email] sendContactNotification failed:", err));
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
    const item = await storage.updateGalleryItem(req.params.id, result.data);
    if (!item) return res.status(404).json({ message: "Élément non trouvé" });
    return res.json(item);
  });

  app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
    await storage.deleteGalleryItem(req.params.id);
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
    const t = await storage.updateTestimonial(req.params.id, result.data);
    if (!t) return res.status(404).json({ message: "Témoignage non trouvé" });
    return res.json(t);
  });

  app.delete("/api/admin/testimonials/:id", requireAdmin, async (req, res) => {
    await storage.deleteTestimonial(req.params.id);
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
    const f = await storage.updateFaqItem(req.params.id, result.data);
    if (!f) return res.status(404).json({ message: "FAQ non trouvée" });
    return res.json(f);
  });

  app.delete("/api/admin/faq/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaqItem(req.params.id);
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
    const s = await storage.updateSiteService(req.params.id, result.data);
    if (!s) return res.status(404).json({ message: "Prestation non trouvée" });
    return res.json(s);
  });

  app.delete("/api/admin/services/:id", requireAdmin, async (req, res) => {
    await storage.deleteSiteService(req.params.id);
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
    const c = await storage.setSiteContent(req.params.key, String(value), label, category);
    return res.json(c);
  });

  app.patch("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ message: "Valeur requise" });
    const c = await storage.setSiteContent(req.params.key, String(value));
    return res.json(c);
  });

  app.delete("/api/admin/site-content/:key", requireAdmin, async (req, res) => {
    await storage.deleteSiteContent(req.params.key);
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
    await storage.deleteMediaFile(req.params.id);
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

      const services = await storage.getSiteServices(true);
      const faqItems = await storage.getFaqItems(true);
      const contentItems = await storage.getAllSiteContent();
      const contentMap: Record<string, string> = {};
      for (const item of contentItems) contentMap[item.key] = item.value;

      const servicesContext = services.map(s =>
        `- ${s.title}: ${s.description} | Prix: ${s.price} | Lien: /services/${s.slug}`
      ).join("\n");

      const faqContext = faqItems.map(f =>
        `Q: ${f.question}\nR: ${f.answer}`
      ).join("\n\n");

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

      const openai = new OpenAI({
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      });

      const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        ...history.slice(-10).map((m: any) => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: message },
      ];

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
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

      const genai = new GoogleGenAI({
        apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
        httpOptions: { baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL },
      });

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
