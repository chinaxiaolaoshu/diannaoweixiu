"use server";

import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  db, articles, articleCategories, articleTags, categories, tags,
  siteSettings, redirects,
} from "@repo/db";
import { requireUser } from "./guard";

const SITE_URL = process.env.SITE_URL ?? "https://www.0913610.xyz";

// 富文本 XSS 白名单消毒
function clean(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h2", "h3", "figure", "figcaption"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
      a: ["href", "title", "rel"],
    },
    allowedSchemes: ["https", "http", "mailto", "tel"],
  });
}

// 通知前台刷新 ISR 缓存（失败不阻断流程）
async function revalidateWeb(path: string) {
  try {
    await fetch(
      `${SITE_URL}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=${encodeURIComponent(path)}`,
      { method: "POST" },
    );
  } catch { /* ignore */ }
}

// 百度主动推送（可选）：仅推 canonical URL，Token 仅存服务端，失败不影响发布
async function baiduPush(url: string) {
  const token = process.env.BAIDU_PUSH_TOKEN;
  if (!token) return;
  try {
    await fetch(`http://data.zz.baidu.com/urls?site=${encodeURIComponent(SITE_URL)}&token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: url,
    });
  } catch { /* ignore */ }
}

// ---------------- 文章 ----------------
const articleSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "slug 仅允许小写字母、数字、短横线"),
  excerpt: z.string().max(1000).optional().default(""),
  content: z.string().min(1),
  coverImage: z.string().url().or(z.literal("")).default(""),
  seoTitle: z.string().max(255).optional().default(""),
  seoDescription: z.string().max(500).optional().default(""),
  canonicalUrl: z.string().url().or(z.literal("")).default(""),
  noindex: z.coerce.boolean().default(false),
  status: z.enum(["draft", "published"]),
});

export async function saveArticle(formData: FormData) {
  const user = await requireUser();
  const parsed = articleSchema.parse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    seoTitle: formData.get("seoTitle") || "",
    seoDescription: formData.get("seoDescription") || "",
    canonicalUrl: formData.get("canonicalUrl") || "",
    noindex: formData.get("noindex") === "on",
    status: formData.get("status"),
  });
  const categoryIds = formData.getAll("categoryIds").map(Number).filter(Boolean);
  const tagIds = formData.getAll("tagIds").map(Number).filter(Boolean);

  const values = {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt || null,
    content: clean(parsed.content),
    coverImage: parsed.coverImage || null,
    seoTitle: parsed.seoTitle || null,
    seoDescription: parsed.seoDescription || null,
    canonicalUrl: parsed.canonicalUrl || null,
    noindex: parsed.noindex,
    status: parsed.status,
    updatedAt: new Date(),
  };

  let id = parsed.id;
  let firstPublish = false;

  if (id) {
    const [prev] = await db.select().from(articles).where(eq(articles.id, id));
    if (!prev) throw new Error("文章不存在");
    firstPublish = prev.status === "draft" && parsed.status === "published";
    await db.update(articles).set({
      ...values,
      publishedAt: parsed.status === "published" ? (prev.publishedAt ?? new Date()) : prev.publishedAt,
    }).where(eq(articles.id, id));
    await db.delete(articleCategories).where(eq(articleCategories.articleId, id));
    await db.delete(articleTags).where(eq(articleTags.articleId, id));
  } else {
    firstPublish = parsed.status === "published";
    const [row] = await db.insert(articles).values({
      ...values,
      publishedAt: parsed.status === "published" ? new Date() : null,
      authorId: user.id,
    }).returning();
    id = row.id;
  }

  if (categoryIds.length) {
    await db.insert(articleCategories).values(categoryIds.map((categoryId) => ({ articleId: id!, categoryId })));
  }
  if (tagIds.length) {
    await db.insert(articleTags).values(tagIds.map((tagId) => ({ articleId: id!, tagId })));
  }

  await revalidateWeb(`/articles/${parsed.slug}`);
  if (firstPublish) await baiduPush(`${SITE_URL}/articles/${parsed.slug}`);

  revalidatePath("/articles");
  redirect("/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireUser(["admin"]); // 删除仅限 admin
  const id = Number(formData.get("id"));
  const [a] = await db.select().from(articles).where(eq(articles.id, id));
  if (a) {
    await db.delete(articles).where(eq(articles.id, id));
    await revalidateWeb(`/articles/${a.slug}`);
  }
  revalidatePath("/articles");
}

// ---------------- 分类 / 标签 ----------------
const taxonomySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional().default(""),
});

export async function createCategory(formData: FormData) {
  await requireUser();
  const p = taxonomySchema.parse({
    name: formData.get("name"), slug: formData.get("slug"), description: formData.get("description") || "",
  });
  await db.insert(categories).values({ name: p.name, slug: p.slug, description: p.description || null });
  revalidatePath("/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireUser(["admin"]);
  await db.delete(categories).where(eq(categories.id, Number(formData.get("id"))));
  revalidatePath("/categories");
}

export async function createTag(formData: FormData) {
  await requireUser();
  const p = taxonomySchema.pick({ name: true, slug: true }).parse({ name: formData.get("name"), slug: formData.get("slug") });
  await db.insert(tags).values(p);
  revalidatePath("/tags");
}

export async function deleteTag(formData: FormData) {
  await requireUser(["admin"]);
  await db.delete(tags).where(eq(tags.id, Number(formData.get("id"))));
  revalidatePath("/tags");
}

// ---------------- 站点设置 ----------------
const settingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteUrl: z.string().url(),
  defaultSeoTitle: z.string().max(255).optional().default(""),
  defaultSeoDescription: z.string().max(500).optional().default(""),
  defaultOgImage: z.string().url().or(z.literal("")).default(""),
  baiduVerificationCode: z.string().max(255).optional().default(""),
  baiduTongjiCode: z.string().max(5000).optional().default(""),
  aboutContent: z.string().max(100000).optional().default(""),
});

export async function updateSettings(formData: FormData) {
  await requireUser(["admin"]);
  const p = settingsSchema.parse({
    siteName: formData.get("siteName"),
    siteUrl: formData.get("siteUrl"),
    defaultSeoTitle: formData.get("defaultSeoTitle") || "",
    defaultSeoDescription: formData.get("defaultSeoDescription") || "",
    defaultOgImage: formData.get("defaultOgImage") || "",
    baiduVerificationCode: formData.get("baiduVerificationCode") || "",
    baiduTongjiCode: formData.get("baiduTongjiCode") || "",
    aboutContent: formData.get("aboutContent") || "",
  });
  const values = {
    siteName: p.siteName,
    siteUrl: p.siteUrl,
    defaultSeoTitle: p.defaultSeoTitle || null,
    defaultSeoDescription: p.defaultSeoDescription || null,
    defaultOgImage: p.defaultOgImage || null,
    baiduVerificationCode: p.baiduVerificationCode || null,
    baiduTongjiCode: p.baiduTongjiCode || null,
    aboutContent: p.aboutContent ? clean(p.aboutContent) : null,
  };
  const [existing] = await db.select().from(siteSettings).limit(1);
  if (existing) await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id));
  else await db.insert(siteSettings).values(values);
  await revalidateWeb("/");
  await revalidateWeb("/about");
  revalidatePath("/settings");
}

// ---------------- 301 重定向 ----------------
const redirectSchema = z.object({
  sourcePath: z.string().min(1).max(500).regex(/^\//, "必须以 / 开头"),
  targetPath: z.string().min(1).max(500),
  statusCode: z.enum(["301", "302", "410"]),
});

export async function createRedirect(formData: FormData) {
  await requireUser(["admin"]);
  const p = redirectSchema.parse({
    sourcePath: formData.get("sourcePath"),
    targetPath: formData.get("targetPath"),
    statusCode: formData.get("statusCode"),
  });
  await db.insert(redirects).values(p);
  revalidatePath("/redirects");
}

export async function toggleRedirect(formData: FormData) {
  await requireUser(["admin"]);
  const id = Number(formData.get("id"));
  const [r] = await db.select().from(redirects).where(eq(redirects.id, id));
  if (r) await db.update(redirects).set({ enabled: !r.enabled }).where(eq(redirects.id, id));
  revalidatePath("/redirects");
}

export async function deleteRedirect(formData: FormData) {
  await requireUser(["admin"]);
  await db.delete(redirects).where(eq(redirects.id, Number(formData.get("id"))));
  revalidatePath("/redirects");
}
