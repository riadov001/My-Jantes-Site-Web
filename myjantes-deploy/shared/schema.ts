import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(),
  category: text("category").notNull().default("general"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  firstName: text("first_name"),
  email: text("email").notNull(),
  phone: text("phone"),
  vehicle: text("vehicle"),
  service: text("service"),
  requestType: text("request_type"),
  nbWheels: text("nb_wheels"),
  imageUrl: text("image_url"),
  message: text("message").notNull(),
  status: text("status").notNull().default("nouveau"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const galleryItems = pgTable("gallery_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  serviceType: text("service_type").notNull(),
  beforeImage: text("before_image"),
  afterImage: text("after_image").notNull(),
  description: text("description"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location"),
  rating: integer("rating").notNull().default(5),
  content: text("content").notNull(),
  vehicle: text("vehicle"),
  googleReviewUrl: text("google_review_url"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("general"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const siteServices = pgTable("site_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull().default("/images/service-renovation.png"),
  badge: text("badge").notNull().default(""),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  price: text("price").notNull().default(""),
  slug: text("slug").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  label: text("label").notNull().default(""),
  category: text("category").notNull().default("general"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mediaFiles = pgTable("media_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contactRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertBlogSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertFaqSchema = createInsertSchema(faqItems).omit({
  id: true,
});

export const insertSiteServiceSchema = createInsertSchema(siteServices).omit({
  id: true,
  createdAt: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  updatedAt: true,
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type SiteService = typeof siteServices.$inferSelect;
export type InsertSiteService = z.infer<typeof insertSiteServiceSchema>;
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
