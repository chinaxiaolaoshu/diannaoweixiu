import type { MetadataRoute } from "next";
import { db, articles, categories, tags } from "@repo/db";
import { and, eq } from "drizzle-orm";
import { BASE } from "@/lib/seo";
import { SITE } from "@repo/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
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

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/service`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/areas`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/process`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/faq`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/articles`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/contact`, lastModified: now, priority: 0.6, changeFrequency: "yearly" },
    { url: `${BASE}/about`, lastModified: now, priority: 0.5, changeFrequency: "yearly" },
    ...SITE.services.map((s) => ({
      url: `${BASE}/service/${s.slug}`,
      lastModified: now,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
  ];

  return [
    ...staticPages,
    ...posts.map((p) => ({
      url: `${BASE}/articles/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...cats.map((c) => ({
      url: `${BASE}/categories/${c.slug}`,
      lastModified: now,
      priority: 0.4,
      changeFrequency: "weekly" as const,
    })),
    ...tgs.map((t) => ({
      url: `${BASE}/tags/${t.slug}`,
      lastModified: now,
      priority: 0.3,
      changeFrequency: "weekly" as const,
    })),
  ];
}
