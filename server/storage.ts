import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  users, contactRequests, blogPosts, galleryItems, testimonials, faqItems,
  type User, type InsertUser, type ContactRequest, type InsertContact,
  type BlogPost, type InsertBlog, type GalleryItem, type InsertGallery,
  type Testimonial, type InsertTestimonial, type FaqItem, type InsertFaq,
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(username: string, password: string): Promise<User | null>;

  getContactRequests(): Promise<ContactRequest[]>;
  createContactRequest(data: InsertContact): Promise<ContactRequest>;
  updateContactStatus(id: string, status: string): Promise<ContactRequest | undefined>;

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
}

export const storage = new DatabaseStorage();
