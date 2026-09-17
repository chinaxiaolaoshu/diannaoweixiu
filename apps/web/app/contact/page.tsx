import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { getSettings, getContactPhone } from "@/lib/queries";
import { pageMetadata, breadcrumbJsonLd, BASE } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const phone = getContactPhone(s);
  const hours = s.openingHours ?? SITE.openingHoursLabel;
  return pageMetadata({
    title: "联系我们_渭南电脑维修_监控安装上门服务预约",
    description: `渭南市临渭区电脑维修、监控安装上门服务预约。${hours}，临渭区内2小时响应，先报价后施工。电话 ${phone}。`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const s = await getSettings();
  const phone = getContactPhone(s);
  const hours = s.openingHours ?? SITE.openingHoursLabel;
  const breadcrumbs = [
    { name: "首页", url: `${BASE}/` },
    { name: "联系我们", url: `${BASE}/contact` },
  ];
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <h1 className="text-2xl font-bold">联系我们</h1>
      <p className="text-gray-700 mt-3">
        渭南市临渭区电脑维修、监控安装与维修、网络布线上门服务预约。{hours}，临渭区内 2 小时响应上门，偏远乡镇当天到达。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="border rounded-lg p-5">
          <h2 className="font-bold text-blue-700">电话预约（推荐）</h2>
          <p className="text-sm text-gray-600 mt-2">直接说明故障或需求，初步判断问题与大致费用。</p>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium min-h-[48px] w-full sm:w-auto"
            >
              拨打电话：{phone}
            </a>
          )}
          {(s.wechat || SITE.wechat) && <p className="text-sm text-gray-600 mt-3">微信同号：{s.wechat || SITE.wechat}</p>}
        </div>
        <div className="border rounded-lg p-5">
          <h2 className="font-bold text-blue-700">服务时间</h2>
          <p className="text-sm text-gray-600 mt-2">{hours}</p>
          <p className="text-sm text-gray-600 mt-2">临渭区内 2 小时内响应；农村、乡镇一般当天到达。</p>
          <p className="text-sm text-gray-600 mt-2">华州区等周边区县暂不上门，可电话/微信免费咨询。</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">在线留言</h2>
      <p className="text-sm text-gray-600 mb-4">留下您的需求、地址与联系方式，我会尽快回电（仅服务渭南市临渭区）。</p>
      <ContactForm />
    </section>
  );
}
