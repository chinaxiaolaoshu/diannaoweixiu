import {
  pgTable, serial, text, varchar, boolean, timestamp, integer,
  pgEnum, primaryKey, uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "editor"]);
export const statusEnum = pgEnum("article_status", ["draft", "published"]);
export const redirectEnum = pgEnum("redirect_code", ["301", "302", "410"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: roleEnum("role").notNull().default("editor"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  status: statusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: varchar("seo_description", { length: 500 }),
  canonicalUrl: text("canonical_url"),
  noindex: boolean("noindex").notNull().default(false),
  authorId: integer("author_id").references(() => users.id).notNull(),
}, (t) => [uniqueIndex("articles_slug_idx").on(t.slug)]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const articleCategories = pgTable("article_categories", {
  articleId: integer("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
}, (t) => [primaryKey({ columns: [t.articleId, t.categoryId] })]);

export const articleTags = pgTable("article_tags", {
  articleId: integer("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  tagId: integer("tag_id").references(() => tags.id, { onDelete: "cascade" }).notNull(),
}, (t) => [primaryKey({ columns: [t.articleId, t.tagId] })]);

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }).notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: varchar("site_name", { length: 100 }).notNull().default("渭南IT技术服务"),
  siteUrl: text("site_url").notNull().default("https://www.0913610.xyz"),
  defaultSeoTitle: varchar("default_seo_title", { length: 255 }),
  defaultSeoDescription: varchar("default_seo_description", { length: 500 }),
  defaultOgImage: text("default_og_image"),
  baiduVerificationCode: varchar("baidu_verification_code", { length: 255 }),
  baiduTongjiCode: text("baidu_tongji_code"),
  aboutContent: text("about_content"),
});

export const redirects = pgTable("redirects", {
  id: serial("id").primaryKey(),
  sourcePath: varchar("source_path", { length: 500 }).notNull().unique(),
  targetPath: varchar("target_path", { length: 500 }).notNull(),
  statusCode: redirectEnum("status_code").notNull().default("301"),
  enabled: boolean("enabled").notNull().default(true),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
