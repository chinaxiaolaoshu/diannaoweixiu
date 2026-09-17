"use server";

import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { pinyin } from "pinyin-pro";
import {
  db, articles, articleCategories, articleTags, categories, tags,
  siteSettings, redirects,
} from "@repo/db";
import { requireUser } from "./guard";

const SITE_URL = process.env.SITE_URL ?? "https://www.0913610.xyz";

// 中文标题自动转拼音 slug：渭南电脑维修指南 -> weinan-dian-nao-wei-xiu-zhi-nan
function titleToSlug(title: string): string {
  const raw = pinyin(title, { toneType: "none", type: "array", nonZh: "consecutive" }).join("-");
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100) || `article-${Date.now()}`;
}

// slug 查重：存在则追加 -2 / -3 ...
async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = base || `article-${Date.now()}`;
  let n = 2;
  while (true) {
    const rows = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug));
    if (!rows.length || (excludeId && rows.length === 1 && rows[0].id === excludeId)) return slug;
    slug = `${base}-${n++}`;
  }
}

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

// 判断内容是否已经是 HTML（含标签则按原文消毒，保持旧数据兼容）
function looksLikeHtml(s: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}

// 纯文本转 HTML：每个非空行为一个 <p> 段落；连续空行忽略（每行=一段）
// 行内链接自动转 <a>，URL 自动加 rel="nofollow"
function textToHtml(text: string): string {
  const esc = (t: string) => t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const safe = esc(line)
        // 行内 URL 自动转链接（http/https），URL 中的引号/尖括号已被转义不会进入链接
        .replace(/(https?:\/\/[^\s"']+)/g, '<a href="$1" rel="nofollow">$1</a>');
      return `<p>${safe}</p>`;
    })
    .join("\n");
}

// 正文最终处理：纯文本自动分段转 <p>；已是 HTML 则原样走白名单消毒
function processContent(raw: string): string {
  return clean(looksLikeHtml(raw) ? raw : textToHtml(raw));
}

// ---------------- SEO 自动生成 ----------------
// 服务关键词池：命中即认为文章涉及该服务，用于补充 SEO 标题
const SEO_KEYWORDS = [
  "电脑维修", "电脑重装", "系统重装", "重装系统", "蓝屏", "死机", "数据恢复", "硬盘",
  "监控安装", "监控维修", "摄像头", "录像机", "远程监控",
  "弱电施工", "综合布线", "门禁", "机房",
  "网络布线", "WiFi", "wifi", "无线", "路由器", "交换机", "上网",
];

// 提取正文纯文本（去掉 HTML 标签，供 SEO 分析）
function textOf(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// SEO 标题自动生成：文章标题 + 命中的服务关键词（最多补2个）+ 地域词，总长≤60
function autoSeoTitle(title: string, contentHtml: string): string {
  const text = title + " " + textOf(contentHtml);
  const hits: string[] = [];
  for (const kw of SEO_KEYWORDS) {
    if (text.includes(kw) && !hits.includes(kw)) hits.push(kw);
    if (hits.length >= 2) break;
  }
  let out = title;
  if (hits.length) out += `_${hits.join("_")}`;
  if (!out.includes("渭南")) out += "_渭南";
  return out.length > 60 ? out.slice(0, 60) : out;
}

// SEO 描述自动生成：摘要优先，否则取正文前段；保证语句完整、≤150字
function autoSeoDescription(excerpt: string | null | undefined, contentHtml: string): string {
  if (excerpt && excerpt.trim()) return excerpt.trim().slice(0, 150);
  const text = textOf(contentHtml);
  if (!text) return "";
  const firstSentence = text.slice(0, 150);
  // 尽量在句号/问号/分号处截断，避免半句话
  const cut = Math.max(firstSentence.lastIndexOf("。"), firstSentence.lastIndexOf("；"), firstSentence.lastIndexOf("?"), firstSentence.lastIndexOf("，"));
  return cut > 30 ? firstSentence.slice(0, cut + 1) : firstSentence;
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
  // slug 可留空：留空时由中文标题自动转拼音生成
  slug: z.string().max(255).regex(/^[a-z0-9-]*$/, "slug 仅允许小写字母、数字、短横线").optional().default(""),
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
    slug: formData.get("slug") || "",
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

  // 正文先处理成 HTML（纯文本自动分段 / HTML 消毒）
  const contentHtml = processContent(parsed.content);

  // slug 留空时自动从中文标题生成；填了则查重
  const slug = parsed.slug
    ? await uniqueSlug(parsed.slug, parsed.id)
    : await uniqueSlug(titleToSlug(parsed.title), parsed.id);

  // SEO 标题/描述留空时自动生成（标题+服务关键词+渭南 / 摘要或正文首段）
  const seoTitle = parsed.seoTitle || autoSeoTitle(parsed.title, contentHtml);
  const seoDescription = parsed.seoDescription || autoSeoDescription(parsed.excerpt, contentHtml);

  const values = {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt || null,
    content: contentHtml,
    coverImage: parsed.coverImage || null,
    seoTitle,
    seoDescription,
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

  await revalidateWeb(`/articles/${slug}`);
  if (firstPublish) await baiduPush(`${SITE_URL}/articles/${slug}`);

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
// 电话格式校验：允许 11 位手机号或带区号/短横线的固话，拒绝特殊字符
function normalizePhone(input: string): string {
  const trimmed = input.trim().replace(/[\s-]/g, "");
  if (!/^1[3-9]\d{9}$/.test(trimmed) && !/^0\d{9,11}$/.test(trimmed)) {
    throw new Error("电话格式不正确：请输入 11 位手机号（如 15609186302）或带区号的固话（如 09132109999）");
  }
  return trimmed;
}

// robots_extra：每行一条 Disallow 路径，校验必须以 / 开头
function normalizeRobotsExtra(input: string): string {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const l of lines) {
    if (!l.startsWith("/")) throw new Error(`robots 自定义规则 "${l}" 必须以 / 开头`);
  }
  return lines.join("\n");
}

const settingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteUrl: z.string().url(),
  defaultSeoTitle: z.string().max(255).optional().default(""),
  defaultSeoDescription: z.string().max(500).optional().default(""),
  defaultOgImage: z.string().url().or(z.literal("")).default(""),
  baiduVerificationCode: z.string().max(255).optional().default(""),
  baiduTongjiCode: z.string().max(5000).optional().default(""),
  aboutContent: z.string().max(100000).optional().default(""),
  // 联系方式
  phone: z.string().max(30).optional().default(""),
  wechat: z.string().max(100).optional().default(""),
  openingHours: z.string().max(255).optional().default(""),
  priceRange: z.string().max(100).optional().default(""),
  // SEO 设置
  seoKeywords: z.string().max(500).optional().default(""),
  serviceAreaDesc: z.string().max(500).optional().default(""),
  robotsExtra: z.string().max(5000).optional().default(""),
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
    phone: formData.get("phone") || "",
    wechat: formData.get("wechat") || "",
    openingHours: formData.get("openingHours") || "",
    priceRange: formData.get("priceRange") || "",
    seoKeywords: formData.get("seoKeywords") || "",
    serviceAreaDesc: formData.get("serviceAreaDesc") || "",
    robotsExtra: formData.get("robotsExtra") || "",
  });

  // 电话必填且校验格式（NAP 一致性核心字段）
  const phone = p.phone ? normalizePhone(p.phone) : "";
  if (!phone) throw new Error("联系电话为必填项");

  const robotsExtra = p.robotsExtra ? normalizeRobotsExtra(p.robotsExtra) : "";

  const values = {
    siteName: p.siteName,
    siteUrl: p.siteUrl,
    defaultSeoTitle: p.defaultSeoTitle || null,
    defaultSeoDescription: p.defaultSeoDescription || null,
    defaultOgImage: p.defaultOgImage || null,
    baiduVerificationCode: p.baiduVerificationCode || null,
    baiduTongjiCode: p.baiduTongjiCode || null,
    aboutContent: p.aboutContent ? clean(p.aboutContent) : null,
    phone,
    wechat: p.wechat || null,
    openingHours: p.openingHours || null,
    priceRange: p.priceRange || null,
    seoKeywords: p.seoKeywords || null,
    serviceAreaDesc: p.serviceAreaDesc || null,
    robotsExtra: robotsExtra || null,
  };
  const [existing] = await db.select().from(siteSettings).limit(1);
  if (existing) await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id));
  else await db.insert(siteSettings).values(values);
  // 联系方式/SEO 变更影响全站：刷新首页、关于、联系、布局与 sitemap/robots
  await revalidateWeb("/");
  await revalidateWeb("/about");
  await revalidateWeb("/contact");
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
