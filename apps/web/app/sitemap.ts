import type { MetadataRoute } from "next";
import { db, articles, categories, tags } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { BASE } from "@/lib/seo";
import { SITE } from "@repo/config";

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
    ...SITE.services.map((s) => ({ url: `${BASE}/service/${s.slug}` })),
    { url: `${BASE}/process`, lastModified: new Date() },
    { url: `${BASE}/faq`, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/contact`, lastModified: new Date() },
    ...posts.map((p) => ({ url: `${BASE}/articles/${p.slug}`, lastModified: p.updatedAt })),
    ...cats.map((c) => ({ url: `${BASE}/categories/${c.slug}`, lastModified: new Date() })),
    ...tgs.map((t) => ({ url: `${BASE}/tags/${t.slug}`, lastModified: new Date() })),
  ];
}
