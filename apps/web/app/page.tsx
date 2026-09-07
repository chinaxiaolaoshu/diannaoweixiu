import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { listPublished, getSettings } from "@/lib/queries";
import { pageMetadata, BASE } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: s.defaultSeoTitle ?? `渭南电脑维修_临渭区上门维修_监控安装维修 - ${s.siteName}`,
    description: s.defaultSeoDescription ?? `渭南市临渭区电脑维修、监控安装维修、弱电施工、网络布线上门服务。响应快、价格透明、先报价后施工。电话${SITE.phone}`,
    path: "/",
  });
}

function escapeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

const PROMISES = [
  { title: "快速响应", desc: "临渭区内2小时内响应，紧急情况优先安排" },
  { title: "价格透明", desc: "先检测报价确认后再施工，无隐藏费用" },
  { title: "质保无忧", desc: "维修7天质保，更换配件按厂家政策保修" },
  { title: "数据安全", desc: "操作前确认备份方案，保障您的数据完整" },
];

export default async function HomePage() {
  const { items } = await listPublished(1, 5);
  const s = await getSettings();

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: s.defaultSeoTitle ?? `${s.siteName}_渭南电脑维修_临渭区上门维修_监控安装`,
    description: s.defaultSeoDescription ?? "渭南市临渭区电脑维修、监控安装、弱电施工、网络布线个人技术服务",
    url: BASE,
    inLanguage: "zh-CN",
    mainEntity: {
      "@id": `${BASE}/#business`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(homeSchema) }} />

      <section className="py-8 bg-gradient-to-b from-blue-50 to-white -mx-4 px-4 sm:mx-0 sm:px-0 rounded-b-lg">
        <h1 className="text-3xl font-bold text-gray-900">渭南电脑维修与监控安装技术服务</h1>
        <p className="mt-3 text-lg text-gray-700 max-w-2xl">
          专业IT技术服务，{SITE.serviceArea}。台式机笔记本维修、监控摄像头安装、弱电综合布线、WiFi全屋覆盖，上门快、价格透明、先报价后施工。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {SITE.phone && (
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-medium min-h-[48px] text-lg">
              立即致电：{SITE.phone}
            </a>
          )}
          <Link href="/contact" className="inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded font-medium min-h-[48px] text-lg">
            在线留言
          </Link>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-5">为什么选择我们</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMISES.map((p) => (
            <div key={p.title} className="border rounded-lg p-4 bg-white">
              <h3 className="font-bold text-blue-700">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-5">服务项目</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SITE.services.map((sv) => (
            <Link key={sv.slug} href={`/service/${sv.slug}`} className="border rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition-all group">
              <h3 className="font-bold text-lg group-hover:text-blue-600">{sv.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{sv.desc}</p>
              <span className="inline-block mt-3 text-xs text-blue-600 font-medium">了解详情 →</span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          服务范围：渭南市临渭区全域上门，包括城区、开发区及周边乡镇。其他区域请电话咨询。
        </p>
      </section>

      {items.length > 0 && (
        <section className="py-8">
          <h2 className="text-xl font-bold mb-4">技术文章</h2>
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id} className="border-l-2 border-blue-300 pl-3">
                <Link href={`/articles/${a.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{a.title}</Link>
                {a.excerpt && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.excerpt}</p>}
              </li>
            ))}
          </ul>
          <Link href="/articles" className="inline-block mt-4 text-sm text-blue-600 hover:underline font-medium">查看全部文章 →</Link>
        </section>
      )}

      <section className="py-8">
        <h2 className="text-xl font-bold mb-2">快速留言</h2>
        <p className="text-sm text-gray-600 mb-4">留下您的需求，我会尽快回电（仅服务渭南市及临渭区）。</p>
        <ContactForm />
      </section>
    </>
  );
}
