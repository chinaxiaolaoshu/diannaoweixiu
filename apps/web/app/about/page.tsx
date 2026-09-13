import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "关于我们",
  description: "渭南本地个人IT技术服务者，专注电脑维修、监控安装、弱电施工与网络布线，服务渭南市及临渭区，支持上门。",
  path: "/about",
});

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <section>
      <h1 className="text-2xl font-bold">关于我们</h1>
      {s.aboutContent ? (
        // 后台保存时已消毒
        <div className="prose mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: s.aboutContent }} />
      ) : (
        <div className="mt-4 space-y-3 text-gray-700">
          <p>渭南本地的个人 IT 技术服务者，长期从事电脑维修、监控安装与维修、弱电施工和网络布线工作。</p>
          <p>服务范围仅限渭南市及临渭区，支持上门服务，价格透明，先报价后施工。</p>
          <p>电话：{s.siteName} | 微信：请在线留言</p>
        </div>
      )}

      <h2 className="text-xl font-bold mt-10 mb-4">联系我们</h2>
      <div className="space-y-2 text-gray-700">
        <p>服务地区：陕西省渭南市及临渭区（支持上门）</p>
        <p>电话：<a href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`} className="text-blue-600 font-bold">{process.env.NEXT_PUBLIC_CONTACT_PHONE}</a></p>
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">在线留言</h2>
      <ContactForm />
    </section>
  );
}
