import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "服务项目_渭南电脑维修监控安装网络布线",
  description: "渭南市临渭区IT服务项目：电脑维修、监控安装与维修、弱电施工、网络布线，家庭/商铺/农村/办公室均可上门。",
  path: "/service",
});

export default function ServicePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">服务项目</h1>
      <p className="text-gray-700 mt-3">
        {SITE.serviceArea}，家庭、商铺、农村、办公室均可上门。临渭区内 2 小时响应，先检测报价确认后再施工，同一故障 7 天质保。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {SITE.services.map((sv) => (
          <Link key={sv.slug} href={`/service/${sv.slug}`} className="border rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition-all flex gap-4">
            <img
              src={`/images/service-${sv.slug}.svg`}
              alt={`渭南${sv.name}服务示意图`}
              width={64}
              height={64}
              loading="lazy"
              className="w-16 h-16 shrink-0"
            />
            <div>
              <h2 className="font-bold text-lg">{sv.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{sv.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-600">
        具体价格参考请查看 <Link href="/" className="text-blue-600 hover:underline">首页价格表</Link>，服务区域详见 <Link href="/areas" className="text-blue-600 hover:underline">服务区域</Link>。
      </p>
    </section>
  );
}
