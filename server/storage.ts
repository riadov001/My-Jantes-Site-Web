import { db } from "./db";
import { eq, desc, asc, sql, count, gte } from "drizzle-orm";
import {
  users, contactRequests, blogPosts, galleryItems, testimonials, faqItems, siteServices, siteContent, pageViews, mediaFiles,
  type User, type InsertUser, type ContactRequest, type InsertContact,
  type BlogPost, type InsertBlog, type GalleryItem, type InsertGallery,
  type Testimonial, type InsertTestimonial, type FaqItem, type InsertFaq,
  type SiteService, type InsertSiteService, type SiteContent, type InsertSiteContent,
  type PageView, type MediaFile, type InsertMediaFile,
} from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(username: string, password: string): Promise<User | null>;

  getContactRequests(): Promise<ContactRequest[]>;
  createContactRequest(data: InsertContact): Promise<ContactRequest>;
  updateContactStatus(id: string, status: string): Promise<ContactRequest | undefined>;
  deleteContactRequest(id: string): Promise<void>;

  getBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(data: InsertBlog): Promise<BlogPost>;
  updateBlogPost(id: string, data: Partial<InsertBlog>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  getGalleryItems(publishedOnly?: boolean): Promise<GalleryItem[]>;
  getGalleryItem(id: string): Promise<GalleryItem | undefined>;
  createGalleryItem(data: InsertGallery): Promise<GalleryItem>;
  updateGalleryItem(id: string, data: Partial<InsertGallery>): Promise<GalleryItem | undefined>;
  deleteGalleryItem(id: string): Promise<void>;

  getTestimonials(publishedOnly?: boolean): Promise<Testimonial[]>;
  createTestimonial(data: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, data: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<void>;

  getFaqItems(publishedOnly?: boolean): Promise<FaqItem[]>;
  createFaqItem(data: InsertFaq): Promise<FaqItem>;
  updateFaqItem(id: string, data: Partial<InsertFaq>): Promise<FaqItem | undefined>;
  deleteFaqItem(id: string): Promise<void>;

  getSiteServices(publishedOnly?: boolean): Promise<SiteService[]>;
  getSiteService(id: string): Promise<SiteService | undefined>;
  createSiteService(data: InsertSiteService): Promise<SiteService>;
  updateSiteService(id: string, data: Partial<InsertSiteService>): Promise<SiteService | undefined>;
  deleteSiteService(id: string): Promise<void>;

  getAllSiteContent(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  setSiteContent(key: string, value: string, label?: string, category?: string): Promise<SiteContent>;
  deleteSiteContent(key: string): Promise<void>;

  trackPageView(path: string, referrer?: string, userAgent?: string): Promise<void>;
  getAnalytics(): Promise<{ totalViews: number; viewsByPage: { path: string; views: number }[]; recentViews: PageView[] }>;

  getMediaFiles(): Promise<MediaFile[]>;
  createMediaFile(data: InsertMediaFile): Promise<MediaFile>;
  deleteMediaFile(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hash = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db.insert(users).values({ ...insertUser, password: hash }).returning();
    return user;
  }

  async validatePassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async getContactRequests() {
    return db.select().from(contactRequests).orderBy(desc(contactRequests.createdAt));
  }

  async createContactRequest(data: InsertContact) {
    const [req] = await db.insert(contactRequests).values(data).returning();
    return req;
  }

  async updateContactStatus(id: string, status: string) {
    const [req] = await db.update(contactRequests).set({ status }).where(eq(contactRequests.id, id)).returning();
    return req;
  }

  async deleteContactRequest(id: string) {
    await db.delete(contactRequests).where(eq(contactRequests.id, id));
  }

  async getBlogPosts(publishedOnly = false) {
    if (publishedOnly) {
      return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
    }
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(data: InsertBlog) {
    const [post] = await db.insert(blogPosts).values(data).returning();
    return post;
  }

  async updateBlogPost(id: string, data: Partial<InsertBlog>) {
    const [post] = await db.update(blogPosts).set({ ...data, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    return post;
  }

  async deleteBlogPost(id: string) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getGalleryItems(publishedOnly = false) {
    if (publishedOnly) {
      return db.select().from(galleryItems).where(eq(galleryItems.published, true)).orderBy(desc(galleryItems.createdAt));
    }
    return db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
  }

  async getGalleryItem(id: string) {
    const [item] = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return item;
  }

  async createGalleryItem(data: InsertGallery) {
    const [item] = await db.insert(galleryItems).values(data).returning();
    return item;
  }

  async updateGalleryItem(id: string, data: Partial<InsertGallery>) {
    const [item] = await db.update(galleryItems).set(data).where(eq(galleryItems.id, id)).returning();
    return item;
  }

  async deleteGalleryItem(id: string) {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  async getTestimonials(publishedOnly = false) {
    if (publishedOnly) {
      return db.select().from(testimonials).where(eq(testimonials.published, true)).orderBy(desc(testimonials.createdAt));
    }
    return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(data: InsertTestimonial) {
    const [t] = await db.insert(testimonials).values(data).returning();
    return t;
  }

  async updateTestimonial(id: string, data: Partial<InsertTestimonial>) {
    const [t] = await db.update(testimonials).set(data).where(eq(testimonials.id, id)).returning();
    return t;
  }

  async deleteTestimonial(id: string) {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async getFaqItems(publishedOnly = false) {
    if (publishedOnly) {
      return db.select().from(faqItems).where(eq(faqItems.published, true)).orderBy(faqItems.sortOrder);
    }
    return db.select().from(faqItems).orderBy(faqItems.sortOrder);
  }

  async createFaqItem(data: InsertFaq) {
    const [f] = await db.insert(faqItems).values(data).returning();
    return f;
  }

  async updateFaqItem(id: string, data: Partial<InsertFaq>) {
    const [f] = await db.update(faqItems).set(data).where(eq(faqItems.id, id)).returning();
    return f;
  }

  async deleteFaqItem(id: string) {
    await db.delete(faqItems).where(eq(faqItems.id, id));
  }

  async getSiteServices(publishedOnly = false) {
    if (publishedOnly) {
      return db.select().from(siteServices).where(eq(siteServices.published, true)).orderBy(asc(siteServices.sortOrder));
    }
    return db.select().from(siteServices).orderBy(asc(siteServices.sortOrder));
  }

  async getSiteService(id: string) {
    const [s] = await db.select().from(siteServices).where(eq(siteServices.id, id));
    return s;
  }

  async createSiteService(data: InsertSiteService) {
    const [s] = await db.insert(siteServices).values(data).returning();
    return s;
  }

  async updateSiteService(id: string, data: Partial<InsertSiteService>) {
    const [s] = await db.update(siteServices).set(data).where(eq(siteServices.id, id)).returning();
    return s;
  }

  async deleteSiteService(id: string) {
    await db.delete(siteServices).where(eq(siteServices.id, id));
  }

  async getAllSiteContent() {
    return db.select().from(siteContent).orderBy(siteContent.category, siteContent.key);
  }

  async getSiteContentByKey(key: string) {
    const [c] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return c;
  }

  async setSiteContent(key: string, value: string, label = "", category = "general") {
    const existing = await this.getSiteContentByKey(key);
    if (existing) {
      const [c] = await db.update(siteContent)
        .set({ value, label: label || existing.label, category: category || existing.category, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();
      return c;
    } else {
      const [c] = await db.insert(siteContent).values({ key, value, label, category }).returning();
      return c;
    }
  }

  async deleteSiteContent(key: string) {
    await db.delete(siteContent).where(eq(siteContent.key, key));
  }

  async trackPageView(path: string, referrer?: string, userAgent?: string) {
    try {
      await db.insert(pageViews).values({ path, referrer, userAgent });
    } catch {
      // silently fail if table doesn't exist yet
    }
  }

  async getAnalytics() {
    try {
      const total = await db.select({ count: count() }).from(pageViews);
      const totalViews = Number(total[0]?.count ?? 0);

      const byPage = await db
        .select({ path: pageViews.path, views: count() })
        .from(pageViews)
        .groupBy(pageViews.path)
        .orderBy(desc(count()))
        .limit(20);

      const recent = await db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(50);

      // Last 30 days by date
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const byDay = await db
        .select({
          date: sql<string>`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`,
          views: count(),
        })
        .from(pageViews)
        .where(gte(pageViews.createdAt, thirtyDaysAgo))
        .groupBy(sql`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${pageViews.createdAt}, 'YYYY-MM-DD')`);

      return {
        totalViews,
        viewsByPage: byPage.map(r => ({ path: r.path, views: Number(r.views) })),
        recentViews: recent,
        viewsByDay: byDay.map(r => ({ date: r.date, views: Number(r.views) })),
      };
    } catch {
      return { totalViews: 0, viewsByPage: [], recentViews: [], viewsByDay: [] };
    }
  }

  async getMediaFiles() {
    try {
      return db.select().from(mediaFiles).orderBy(desc(mediaFiles.createdAt));
    } catch {
      return [];
    }
  }

  async createMediaFile(data: InsertMediaFile) {
    const [f] = await db.insert(mediaFiles).values(data).returning();
    return f;
  }

  async deleteMediaFile(id: string) {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }
}

export const storage = new DatabaseStorage();
