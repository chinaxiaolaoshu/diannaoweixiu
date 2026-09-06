import {
  db, articles, categories, tags, articleCategories, articleTags, siteSettings,
} from "@repo/db";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

// 构建期数据库可能不可达（CI、首次部署）。此处统一容错：
// 失败时返回空数据，页面构建成功后由 ISR（revalidate）在运行时自动补全真实数据。
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.warn("[db] query failed, serving fallback:", (e as Error).message);
    return fallback;
  }
}

export async function getSettings() {
  const rows = await safe(() => db.select().from(siteSettings).limit(1), []);
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
  const items = await safe(
    () => db.select().from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt))
      .limit(perPage).offset(offset),
    []
  );
  const totals = await safe(
    () => db.select({ value: count() }).from(articles)
      .where(eq(articles.status, "published")),
    [{ value: 0 }]
  );
  const [{ value: total }] = totals;
  return { items, total: Number(total), page, perPage };
}

// 只查已发布文章：草稿对外必然 404
export async function getPublishedArticle(slug: string) {
  const rows = await safe(
    () => db.select().from(articles)
      .where(and(eq(articles.slug, slug), eq(articles.status, "published"))),
    []
  );
  return rows[0] ?? null;
}

export async function listPublishedSlugs() {
  return safe(
    () => db.select({ slug: articles.slug }).from(articles).where(eq(articles.status, "published")),
    []
  );
}

export async function getCategoryPage(slug: string) {
  const catRows = await safe(() => db.select().from(categories).where(eq(categories.slug, slug)), []);
  const [cat] = catRows;
  if (!cat) return null;
  const rows = await safe(
    () => db.select({ a: articles }).from(articleCategories)
      .innerJoin(articles, eq(articleCategories.articleId, articles.id))
      .where(and(eq(articleCategories.categoryId, cat.id), eq(articles.status, "published")))
      .orderBy(desc(articles.publishedAt)),
    []
  );
  return { cat, items: rows.map((r) => r.a) };
}

export async function getTagPage(slug: string) {
  const tagRows = await safe(() => db.select().from(tags).where(eq(tags.slug, slug)), []);
  const [tag] = tagRows;
  if (!tag) return null;
  const rows = await safe(
    () => db.select({ a: articles }).from(articleTags)
      .innerJoin(articles, eq(articleTags.articleId, articles.id))
      .where(and(eq(articleTags.tagId, tag.id), eq(articles.status, "published")))
      .orderBy(desc(articles.publishedAt)),
    []
  );
  return { tag, items: rows.map((r) => r.a) };
}

export async function searchArticles(q: string) {
  if (!q.trim()) return [];
  const kw = `%${q.trim()}%`;
  return safe(
    () => db.select().from(articles)
      .where(and(eq(articles.status, "published"), or(ilike(articles.title, kw), ilike(articles.excerpt, kw))))
      .orderBy(desc(articles.publishedAt)).limit(20),
    []
  );
}

export async function listAllTaxonomies() {
  const [cats, tgs] = await Promise.all([
    safe(() => db.select().from(categories), []),
    safe(() => db.select().from(tags), []),
  ]);
  return { cats, tgs };
}
