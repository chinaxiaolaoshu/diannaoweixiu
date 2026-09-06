import type { Metadata } from "next";
import { pageMetadata, BASE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "常见问题",
  description: "渭南电脑维修、监控安装、网络布线常见问题解答：收费、上门范围、质保等。",
  path: "/faq",
});

// 真实 FAQ 内容，因此允许输出 FAQPage 结构化数据（不伪造）
const FAQS = [
  { q: "服务范围是哪里？", a: "仅服务陕西省渭南市及临渭区，支持上门。" },
  { q: "上门检测收费吗？", a: "临渭区内上门检测请先电话沟通，报价确认后才施工，不修不收维修费。" },
  { q: "电脑重装系统数据会丢吗？", a: "重装前会与您确认重要数据并先备份，确保数据安全。" },
  { q: "监控安装可以手机远程查看吗？", a: "可以，安装调试完成后会帮您配置手机远程查看并教会使用。" },
  { q: "维修后有质保吗？", a: "同一故障在约定质保期内免费返修，更换的硬件按厂家质保执行。" },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold">常见问题</h1>
      <div className="mt-4 space-y-4">
        {FAQS.map((f) => (
          <div key={f.q} className="border rounded p-4">
            <h2 className="font-bold">{f.q}</h2>
            <p className="text-sm text-gray-600 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
