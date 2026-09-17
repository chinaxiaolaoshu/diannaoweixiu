import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { pageMetadata, breadcrumbJsonLd, serviceJsonLd, faqPageJsonLd, BASE } from "@/lib/seo";
import { getSettings } from "@/lib/queries";

export function generateStaticParams() {
  return SITE.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sv = SITE.services.find((s) => s.slug === slug);
  if (!sv) return { robots: { index: false, follow: false } };
  return pageMetadata({
    title: `渭南${sv.name}_临渭区上门服务`,
    description: `${sv.desc}临渭区内2小时响应，先报价后施工，7天质保。电话 ${SITE.phone}。`,
    path: `/service/${slug}`,
  });
}

function escapeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sv = SITE.services.find((s) => s.slug === slug);
  if (!sv) notFound();
  const s = await getSettings();

  const breadcrumbs = [
    { name: "首页", url: `${BASE}/` },
    { name: "服务项目", url: `${BASE}/service` },
    { name: sv.name, url: `${BASE}/service/${sv.slug}` },
  ];

  const faqItems = [
    { q: `${sv.name}多久能上门？`, a: "临渭区内通常2小时内响应，紧急情况优先安排；偏远乡镇当天到达，建议提前电话预约。" },
    { q: "如何收费？", a: "先检测报价，确认后再施工；配件费另计，明码标价，无隐藏费用。" },
    { q: "有保修吗？", a: "维修类服务同一故障7天质保，更换配件按厂家政策执行；监控工程享3个月免费维护。" },
  ];

  const related = SITE.services.filter((x) => x.slug !== sv.slug);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(serviceJsonLd(s, sv)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqPageJsonLd(faqItems)) }} />
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
        <div className="mt-2 space-y-3">
          {faqItems.map((item) => (
            <details key={item.q} className="border rounded-lg p-3">
              <summary className="font-medium cursor-pointer marker:text-blue-600">{item.q}</summary>
              <p className="text-sm text-gray-700 mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold">服务范围</h2>
        <p className="mt-2 text-gray-700">
          {SITE.serviceArea}，临渭区全域支持上门，{SITE.openingHoursLabel}，先报价后施工。华州区等周边区县可电话免费咨询。
        </p>
        <p className="mt-2 text-sm text-gray-600">
          价格参考请查看 <Link href="/" className="text-blue-600 hover:underline">首页价格表</Link>，服务流程见 <Link href="/process" className="text-blue-600 hover:underline">服务流程</Link>。
        </p>
        {SITE.phone && (
          <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium min-h-[44px]">
            电话咨询：{SITE.phone}
          </a>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold mb-3">相关服务</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/service/${r.slug}`}
              className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-bold group-hover:text-blue-600">{r.name}</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{r.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/service" className="text-sm text-gray-500 hover:text-blue-600 min-h-[44px] flex items-center">← 返回服务项目</Link>
        <Link href="/contact" className="text-sm text-blue-600 hover:underline min-h-[44px] flex items-center">在线留言 →</Link>
      </div>
    </article>
  );
}
