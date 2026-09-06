import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { pageMetadata, breadcrumbJsonLd, BASE } from "@/lib/seo";

export function generateStaticParams() {
  return SITE.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sv = SITE.services.find((s) => s.slug === slug);
  if (!sv) return { robots: { index: false, follow: false } };
  return pageMetadata({ title: `渭南${sv.name}`, description: sv.desc, path: `/service/${slug}` });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sv = SITE.services.find((s) => s.slug === slug);
  if (!sv) notFound();
  const jsonLd = breadcrumbJsonLd([
    { name: "首页", url: `${BASE}/` },
    { name: "服务项目", url: `${BASE}/service` },
    { name: sv.name, url: `${BASE}/service/${slug}` },
  ]);
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold">渭南{sv.name}</h1>
      <p className="text-gray-700 mt-3">{sv.desc}</p>
      <section className="mt-6">
        <h2 className="text-lg font-bold">服务内容</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
          {sv.details.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-lg font-bold">服务范围</h2>
        <p className="mt-2 text-gray-700">{SITE.serviceArea}，支持上门，先报价后施工。</p>
        {SITE.phone && (
          <a href={`tel:${SITE.phone}`} className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded font-medium">电话咨询：{SITE.phone}</a>
        )}
      </section>
      <p className="mt-8"><Link href="/service" className="text-sm text-gray-500">← 返回服务项目</Link></p>
    </article>
  );
}
