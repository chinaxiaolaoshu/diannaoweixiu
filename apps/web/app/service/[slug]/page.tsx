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
  return pageMetadata({ title: `渭南${sv.name}_临渭区上门服务`, description: sv.desc, path: `/service/${slug}` });
}

function escapeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sv = SITE.services.find((s) => s.slug === slug);
  if (!sv) notFound();

  const breadcrumbs = [
    { name: "首页", url: `${BASE}/` },
    { name: "服务项目", url: `${BASE}/service` },
    { name: sv.name, url: `${BASE}/service/${sv.slug}` },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `渭南${sv.name}`,
    description: sv.desc,
    url: `${BASE}/service/${sv.slug}`,
    areaServed: ["陕西省渭南市", "临渭区"],
    provider: { "@id": `${BASE}/#business` },
  };

  const faqItems = [
    { q: `${sv.name}多久能上门？`, a: "临渭区内通常2小时内响应，具体视当日工单安排而定。" },
    { q: "如何收费？", a: "先检测报价，确认后再施工；配件费另计，无隐藏费用。" },
    { q: "有保修吗？", a: "维修类服务默认提供7天质保，更换配件按厂家政策执行。" },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbJsonLd(breadcrumbs)) }} />

      <nav aria-label="面包屑" className="text-sm text-gray-500 mb-4">
        <ol className="flex flex-wrap gap-1">
          {breadcrumbs.map((b, i) => (
            <li key={b.url} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span aria-current="page">{b.name}</span>
              ) : (
                <Link href={b.url} className="hover:text-blue-600">{b.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="text-2xl font-bold">渭南{sv.name}</h1>
      <p className="text-gray-700 mt-3">{sv.desc}</p>

      <section className="mt-6">
        <h2 className="text-lg font-bold">常见故障现象</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
          {sv.symptoms.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">服务内容</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
          {sv.details.map((d) => <li key={d}>{d}</li>)}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">上门前准备</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
          {sv.preparation.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">影响报价的因素</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
          {sv.quoteFactors.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">验收标准</h2>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
          {sv.acceptance.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">常见问题</h2>
        <dl className="mt-2 space-y-3">
          {faqItems.map((item) => (
            <div key={item.q}>
              <dt className="font-medium text-gray-900">{item.q}</dt>
              <dd className="mt-1 text-gray-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">服务范围</h2>
        <p className="mt-2 text-gray-700">{SITE.serviceArea}，支持上门，先报价后施工。</p>
        {SITE.phone && (
          <a href={`tel:${SITE.phone}`} className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded font-medium min-h-[44px] flex items-center justify-center">
            电话咨询：{SITE.phone}
          </a>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/service" className="text-sm text-gray-500 hover:text-blue-600 min-h-[44px] flex items-center">← 返回服务项目</Link>
        <Link href="/contact" className="text-sm text-blue-600 hover:underline min-h-[44px] flex items-center">在线留言 →</Link>
      </div>
    </article>
  );
}
