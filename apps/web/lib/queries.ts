import {
  db, articles, categories, tags, articleCategories, articleTags, siteSettings,
} from "@repo/db";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

export async function getSettings() {
  const rows = await db.select().from(siteSettings).limit(1);
  return (
    rows[0] ?? {
      siteName: "渭南IT技术服务",
      siteUrl: process.env.SITE_URL ?? "https://www.0913610.xyz",
      defaultSeoTitle: null,
      defaultSeoDescription: null,
      defaultOgImage: null,
      baiduVerificationCode: null,
      baiduTongjiCode: null,
      aboutContent: null,
    }
  );
}

export async function listPublished(page = 1, perPage = 10) {
  const offset = (Math.max(1, page) - 1) * perPage;
  const items = await db.select().from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(perPage).offset(offset);
  const [{ value: total }] = await db.select({ value: count() }).from(articles)
    .where(eq(articles.status, "published"));
  return { items, total: Number(total), page, perPage };
}

// 只查已发布文章：草稿对外必然 404
export async function getPublishedArticle(slug: string) {
  const [a] = await db.select().from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")));
  return a ?? null;
}

export async function listPublishedSlugs() {
  return db.select({ slug: articles.slug }).from(articles).where(eq(articles.status, "published"));
}

export async function getCategoryPage(slug: string) {
  const [cat] = await db.select().from(categories).where(eq(categories.slug, slug));
  if (!cat) return null;
  const rows = await db.select({ a: articles }).from(articleCategories)
    .innerJoin(articles, eq(articleCategories.articleId, articles.id))
    .where(and(eq(articleCategories.categoryId, cat.id), eq(articles.status, "published")))
    .orderBy(desc(articles.publishedAt));
  return { cat, items: rows.map((r) => r.a) };
}

export async function getTagPage(slug: string) {
  const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
  if (!tag) return null;
  const rows = await db.select({ a: articles }).from(articleTags)
    .innerJoin(articles, eq(articleTags.articleId, articles.id))
    .where(and(eq(articleTags.tagId, tag.id), eq(articles.status, "published")))
    .orderBy(desc(articles.publishedAt));
  return { tag, items: rows.map((r) => r.a) };
}

export async function searchArticles(q: string) {
  if (!q.trim()) return [];
  const kw = `%${q.trim()}%`;
  return db.select().from(articles)
    .where(and(eq(articles.status, "published"), or(ilike(articles.title, kw), ilike(articles.excerpt, kw))))
    .orderBy(desc(articles.publishedAt)).limit(20);
}

export async function listAllTaxonomies() {
  const [cats, tgs] = await Promise.all([db.select().from(categories), db.select().from(tags)]);
  return { cats, tgs };
}
