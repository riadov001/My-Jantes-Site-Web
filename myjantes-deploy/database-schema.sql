-- ============================================================
-- MyJantes — Script de création de la base de données PostgreSQL
-- ============================================================
-- Exécutez ce script une seule fois sur votre base Neon/Supabase
-- pour créer toutes les tables nécessaires.
--
-- Usage : psql "$DATABASE_URL" -f database-schema.sql
-- Ou copiez-collez dans l'éditeur SQL de Neon / Supabase.
-- ============================================================

-- Sessions Express (connect-pg-simple)
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Utilisateurs (admin)
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "email" text,
  "is_admin" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now()
);

-- Logs d'activité admin
CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL,
  "action" text NOT NULL,
  "category" text NOT NULL DEFAULT 'general',
  "details" text,
  "created_at" timestamp DEFAULT now()
);

-- Demandes de contact / devis
CREATE TABLE IF NOT EXISTS "contact_requests" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "first_name" text,
  "email" text NOT NULL,
  "phone" text,
  "vehicle" text,
  "service" text,
  "request_type" text,
  "nb_wheels" text,
  "image_url" text,
  "message" text NOT NULL,
  "status" text NOT NULL DEFAULT 'nouveau',
  "created_at" timestamp DEFAULT now()
);

-- Articles de blog
CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "excerpt" text NOT NULL,
  "content" text NOT NULL,
  "cover_image" text,
  "meta_title" text,
  "meta_description" text,
  "published" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Galerie avant/après
CREATE TABLE IF NOT EXISTS "gallery_items" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "service_type" text NOT NULL,
  "before_image" text,
  "after_image" text NOT NULL,
  "description" text,
  "published" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now()
);

-- Témoignages clients
CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "location" text,
  "rating" integer NOT NULL DEFAULT 5,
  "content" text NOT NULL,
  "vehicle" text,
  "google_review_url" text,
  "published" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now()
);

-- FAQ
CREATE TABLE IF NOT EXISTS "faq_items" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "question" text NOT NULL,
  "answer" text NOT NULL,
  "category" text NOT NULL DEFAULT 'general',
  "sort_order" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT true
);

-- Services (prestations)
CREATE TABLE IF NOT EXISTS "site_services" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "description" text NOT NULL,
  "image" text NOT NULL DEFAULT '/images/service-renovation.png',
  "badge" text NOT NULL DEFAULT '',
  "features" jsonb NOT NULL DEFAULT '[]',
  "price" text NOT NULL DEFAULT '',
  "slug" text NOT NULL DEFAULT '',
  "sort_order" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now()
);

-- Contenu CMS du site
CREATE TABLE IF NOT EXISTS "site_content" (
  "key" text PRIMARY KEY,
  "value" text NOT NULL,
  "label" text NOT NULL DEFAULT '',
  "category" text NOT NULL DEFAULT 'general',
  "updated_at" timestamp DEFAULT now()
);

-- Stats de pages vues
CREATE TABLE IF NOT EXISTS "page_views" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "path" text NOT NULL,
  "referrer" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now()
);

-- Fichiers médias uploadés
CREATE TABLE IF NOT EXISTS "media_files" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "filename" text NOT NULL,
  "original_name" text NOT NULL,
  "url" text NOT NULL,
  "mime_type" text NOT NULL,
  "size" integer NOT NULL DEFAULT 0,
  "created_at" timestamp DEFAULT now()
);

-- Conversations chatbot IA
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Messages chatbot IA
CREATE TABLE IF NOT EXISTS "messages" (
  "id" serial PRIMARY KEY,
  "conversation_id" integer NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================
-- NOTE : Le serveur crée automatiquement toutes ces tables
-- au premier démarrage (idempotent via CREATE TABLE IF NOT EXISTS).
-- Ce script est fourni à titre de référence / initialisation manuelle.
-- ============================================================
