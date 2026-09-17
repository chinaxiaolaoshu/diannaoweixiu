import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedArticle, getSettings, listPublishedSlugs, listRelated } from "@/lib/queries";
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
  const related = await listRelated(slug, 4);
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
          {a.updatedAt && a.updatedAt.getTime() !== a.publishedAt.getTime() && (
            <> · 更新于 <time dateTime={a.updatedAt.toISOString()}>{a.updatedAt.toLocaleDateString("zh-CN")}</time></>
          )}
        </p>
      )}
      {a.coverImage && (
        <img src={a.coverImage} alt={`${a.title}_渭南IT技术服务`} width={1200} height={630} loading="lazy" className="mt-4 rounded w-full h-auto" />
      )}
      {/* 内容在后台保存时已经过 sanitize-html 白名单消毒 */}
      <div className="prose mt-6 max-w-none" dangerouslySetInnerHTML={{ __html: a.content }} />
      <p className="mt-8 text-sm text-gray-500 border-t pt-4">
        本文由 {s.siteName} 原创整理，转载请注明出处。如果您在渭南市临渭区遇到类似问题，欢迎电话预约上门服务。
      </p>
      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-bold mb-3">相关推荐</h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.id} className="border-l-2 border-blue-300 pl-3">
                <Link href={`/articles/${r.slug}`} className="text-blue-700 hover:text-blue-900 font-medium text-sm">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/articles" className="text-sm text-gray-500 hover:text-blue-600 min-h-[44px] flex items-center">← 返回技术文章</Link>
        <Link href="/contact" className="text-sm text-blue-600 hover:underline min-h-[44px] flex items-center">在线留言 →</Link>
      </div>
    </article>
  );
}
