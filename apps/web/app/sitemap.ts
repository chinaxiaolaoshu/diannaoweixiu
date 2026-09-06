import type { MetadataRoute } from "next";
import { db, articles, categories, tags } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { BASE } from "@/lib/seo";

// 仅包含已发布内容与公开页面；不含草稿、后台、API、参数 URL
// 数据库不可达时返回基础页面集，构建成功后由 ISR 运行时自动补全
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const empty = { posts: [] as (typeof articles.$inferSelect)[], cats: [] as (typeof categories.$inferSelect)[], tgs: [] as (typeof tags.$inferSelect)[] };
  let { posts, cats, tgs } = empty;
  try {
    [posts, cats, tgs] = await Promise.all([
      db.select().from(articles).where(and(eq(articles.status, "published"), eq(articles.noindex, false))),
      db.select().from(categories),
      db.select().from(tags),
    ]);
  } catch (e) {
    console.warn("[db] sitemap query failed, serving base pages only:", (e as Error).message);
  }
  return [
    { url: `${BASE}/`, lastModified: new Date() },
    { url: `${BASE}/articles`, lastModified: new Date() },
    { url: `${BASE}/service`, lastModified: new Date() },
    { url: `${BASE}/process`, lastModified: new Date() },
    { url: `${BASE}/faq`, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/contact`, lastModified: new Date() },
    ...posts.map((p) => ({ url: `${BASE}/articles/${p.slug}`, lastModified: p.updatedAt })),
    ...cats.map((c) => ({ url: `${BASE}/categories/${c.slug}`, lastModified: new Date() })),
    ...tgs.map((t) => ({ url: `${BASE}/tags/${t.slug}`, lastModified: new Date() })),
  ];
}
