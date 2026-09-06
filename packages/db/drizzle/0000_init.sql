CREATE TYPE "role" AS ENUM ('admin', 'editor');
CREATE TYPE "article_status" AS ENUM ('draft', 'published');
CREATE TYPE "redirect_code" AS ENUM ('301', '302', '410');

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "email" varchar(255) NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "name" varchar(100) NOT NULL,
  "role" "role" NOT NULL DEFAULT 'editor',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "articles" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "excerpt" text,
  "content" text NOT NULL,
  "cover_image" text,
  "status" "article_status" NOT NULL DEFAULT 'draft',
  "published_at" timestamp,
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "seo_title" varchar(255),
  "seo_description" varchar(500),
  "canonical_url" text,
  "noindex" boolean NOT NULL DEFAULT false,
  "author_id" integer NOT NULL REFERENCES "users"("id")
);
CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" ("slug");

CREATE TABLE "categories" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "slug" varchar(100) NOT NULL UNIQUE,
  "description" text
);

CREATE TABLE "tags" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "slug" varchar(100) NOT NULL UNIQUE
);

CREATE TABLE "article_categories" (
  "article_id" integer NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE,
  "category_id" integer NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
  PRIMARY KEY ("article_id", "category_id")
);

CREATE TABLE "article_tags" (
  "article_id" integer NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE,
  "tag_id" integer NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  PRIMARY KEY ("article_id", "tag_id")
);

CREATE TABLE "media" (
  "id" serial PRIMARY KEY,
  "url" text NOT NULL,
  "alt" varchar(255) NOT NULL,
  "width" integer NOT NULL,
  "height" integer NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "site_settings" (
  "id" serial PRIMARY KEY,
  "site_name" varchar(100) NOT NULL DEFAULT '渭南IT技术服务',
  "site_url" text NOT NULL DEFAULT 'https://www.0913610.xyz',
  "default_seo_title" varchar(255),
  "default_seo_description" varchar(500),
  "default_og_image" text,
  "baidu_verification_code" varchar(255),
  "baidu_tongji_code" text,
  "about_content" text
);

CREATE TABLE "redirects" (
  "id" serial PRIMARY KEY,
  "source_path" varchar(500) NOT NULL UNIQUE,
  "target_path" varchar(500) NOT NULL,
  "status_code" "redirect_code" NOT NULL DEFAULT '301',
  "enabled" boolean NOT NULL DEFAULT true
);

CREATE TABLE "messages" (
  "id" serial PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "phone" varchar(30) NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- 初始化站点设置（含渭南市临渭区默认文案）
INSERT INTO "site_settings" ("site_url", "default_seo_title", "default_seo_description")
VALUES (
  'https://www.0913610.xyz',
  '渭南IT技术服务_渭南电脑维修_监控安装_网络布线',
  '个人IT技术服务，服务渭南市及临渭区：电脑维修、监控安装维修、弱电施工、网络布线，电话快速响应，上门服务。'
);
