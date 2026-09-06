import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "关于我",
  description: "渭南本地个人IT技术服务者，专注电脑维修、监控安装、弱电施工与网络布线，服务渭南市及临渭区。",
  path: "/about",
});

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <section>
      <h1 className="text-2xl font-bold">关于我</h1>
      {s.aboutContent ? (
        // 后台保存时已消毒
        <div className="prose mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: s.aboutContent }} />
      ) : (
        <div className="mt-4 space-y-3 text-gray-700">
          <p>我是一名渭南本地的个人 IT 技术服务者，长期从事电脑维修、监控安装与维修、弱电施工和网络布线工作。</p>
          <p>服务范围仅限渭南市及临渭区，支持上门服务，价格透明，先报价后施工。</p>
        </div>
      )}
    </section>
  );
}
