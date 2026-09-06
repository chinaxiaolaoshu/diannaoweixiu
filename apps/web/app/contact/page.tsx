import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = pageMetadata({
  title: "联系我",
  description: "联系渭南IT技术服务：电话、微信或在线留言，服务渭南市及临渭区，支持上门。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">联系我</h1>
      <div className="mt-4 space-y-2 text-gray-700">
        <p>服务地区：陕西省渭南市及临渭区（支持上门）</p>
        {SITE.phone && <p>电话：<a href={`tel:${SITE.phone}`} className="text-blue-600 font-bold">{SITE.phone}</a></p>}
        {SITE.wechat && <p>微信：{SITE.wechat}</p>}
      </div>
      <h2 className="text-xl font-bold mt-8 mb-3">在线留言</h2>
      <ContactForm />
    </section>
  );
}
