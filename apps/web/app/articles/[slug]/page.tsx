import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedArticle, getSettings, listPublishedSlugs } from "@/lib/queries";
import { buildArticleMetadata, articleJsonLd, breadcrumbJsonLd, BASE } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const rows = await listPublishedSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getPublishedArticle(slug);
  if (!a) return { robots: { index: false, follow: false } };
  return buildArticleMetadata(a);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 只查已发布：草稿对外直接 404（不是 403）
  const a = await getPublishedArticle(slug);
  if (!a) notFound();
  const s = await getSettings();
  const jsonLd = [
    articleJsonLd(a, s.siteName),
    breadcrumbJsonLd([
      { name: "首页", url: `${BASE}/` },
      { name: "技术文章", url: `${BASE}/articles` },
      { name: a.title, url: `${BASE}/articles/${a.slug}` },
    ]),
  ];
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold">{a.title}</h1>
      {a.publishedAt && (
        <p className="text-sm text-gray-500 mt-2">
          发布于 <time dateTime={a.publishedAt.toISOString()}>{a.publishedAt.toLocaleDateString("zh-CN")}</time>
        </p>
      )}
      {a.coverImage && (
        <img src={a.coverImage} alt={`${a.title}_渭南IT技术服务`} width={1200} height={630} loading="lazy" className="mt-4 rounded w-full h-auto" />
      )}
      {/* 内容在后台保存时已经过 sanitize-html 白名单消毒 */}
      <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: a.content }} />
    </article>
  );
}
