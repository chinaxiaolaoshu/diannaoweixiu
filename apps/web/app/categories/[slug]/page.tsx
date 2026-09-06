import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryPage } from "@/lib/queries";
import { pageMetadata, breadcrumbJsonLd, BASE } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPage(slug);
  if (!data) return { robots: { index: false, follow: false } };
  return pageMetadata({ title: `${data.cat.name}_分类`, description: data.cat.description ?? undefined, path: `/categories/${slug}` });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryPage(slug);
  if (!data) notFound();
  const jsonLd = breadcrumbJsonLd([
    { name: "首页", url: `${BASE}/` },
    { name: data.cat.name, url: `${BASE}/categories/${slug}` },
  ]);
  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold">分类：{data.cat.name}</h1>
      {data.cat.description && <p className="text-gray-600 mt-2">{data.cat.description}</p>}
      <ul className="space-y-3 mt-4">
        {data.items.map((a) => (
          <li key={a.id}><Link href={`/articles/${a.slug}`} className="text-blue-600 hover:underline">{a.title}</Link></li>
        ))}
        {data.items.length === 0 && <li className="text-gray-600">该分类下暂无文章。</li>}
      </ul>
    </section>
  );
}
