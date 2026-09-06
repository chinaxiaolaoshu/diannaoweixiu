import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "服务项目",
  description: "渭南市及临渭区 IT 服务项目：电脑维修、监控安装与维修、弱电施工、网络布线。",
  path: "/service",
});

export default function ServicePage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">服务项目</h1>
      <p className="text-gray-600 mt-2">{SITE.serviceArea}，支持上门服务。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {SITE.services.map((sv) => (
          <Link key={sv.slug} href={`/service/${sv.slug}`} className="border rounded p-4 hover:border-blue-500">
            <h2 className="font-bold">{sv.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{sv.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
