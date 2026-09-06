import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { listPublished, getSettings } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: s.defaultSeoTitle ?? `${s.siteName}_渭南电脑维修_监控安装_网络布线`,
    description: s.defaultSeoDescription ?? undefined,
    path: "/",
  });
}

export default async function HomePage() {
  const { items } = await listPublished(1, 5);
  return (
    <>
      <section className="py-6">
        <h1 className="text-2xl font-bold">渭南电脑维修与监控安装技术服务</h1>
        <p className="mt-2 text-gray-600">个人技术服务，{SITE.serviceArea}，响应快、上门快、价格透明。</p>
        {SITE.phone && (
          <a href={`tel:${SITE.phone}`} className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded font-medium">
            立即致电：{SITE.phone}
          </a>
        )}
      </section>

      <section className="py-6">
        <h2 className="text-xl font-bold mb-4">服务项目</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SITE.services.map((sv) => (
            <Link key={sv.slug} href={`/service/${sv.slug}`} className="border rounded p-4 hover:border-blue-500">
              <h3 className="font-bold">{sv.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{sv.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {items.length > 0 && (
        <section className="py-6">
          <h2 className="text-xl font-bold mb-4">技术文章</h2>
          <ul className="space-y-2">
            {items.map((a) => (
              <li key={a.id}>
                <Link href={`/articles/${a.slug}`} className="text-blue-600 hover:underline">{a.title}</Link>
              </li>
            ))}
          </ul>
          <Link href="/articles" className="inline-block mt-3 text-sm text-gray-500">查看全部文章 →</Link>
        </section>
      )}

      <section className="py-6">
        <h2 className="text-xl font-bold mb-4">快速留言</h2>
        <p className="text-sm text-gray-600 mb-3">留下需求，我会尽快回电（仅服务渭南市及临渭区）。</p>
        <ContactForm />
      </section>
    </>
  );
}
