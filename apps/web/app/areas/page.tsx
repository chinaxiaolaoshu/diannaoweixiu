import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { pageMetadata, breadcrumbJsonLd, BASE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "服务区域_渭南临渭区上门服务范围_华州区电话咨询",
  description:
    "渭南IT技术服务上门范围：临渭区全域（城区各街道、开发区及下辖乡镇）2小时内上门；华州区等周边区县暂不上门，可电话免费咨询。",
  path: "/areas",
});

export default function AreasPage() {
  const breadcrumbs = [
    { name: "首页", url: `${BASE}/` },
    { name: "服务区域", url: `${BASE}/areas` },
  ];
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <h1 className="text-2xl font-bold">服务区域</h1>
      <p className="text-gray-700 mt-3">
        本站上门服务以渭南市临渭区为核心，覆盖城区各街道、开发区及下辖乡镇，家庭、商铺、农村、办公室均可上门。偏远地区请提前电话沟通，华州区等周边区县暂不上门，可电话/微信免费咨询。
      </p>

      {SITE.serviceAreas.map((area) => (
        <section key={area.name} className="mt-8 border rounded-lg p-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-lg font-bold">渭南市{area.name}</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                area.isPrimary ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}
            >
              {area.isPrimary ? "上门服务" : "仅咨询"}
            </span>
            <span className="text-sm text-blue-600 font-medium">{area.response}</span>
          </div>
          <p className="text-sm text-gray-700 mt-2">{area.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {area.places.map((p) => (
              <span key={p} className="text-xs border rounded px-2 py-1 text-gray-600 bg-gray-50">
                {p}
              </span>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-8">
        <h2 className="text-xl font-bold">不在上述区域？</h2>
        <p className="text-sm text-gray-700 mt-2">
          其他区域请电话咨询，简单故障可远程指导解决；如确需现场施工，可协助对接周边师傅。
        </p>
        {SITE.phone && (
          <Link
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center justify-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium min-h-[48px]"
          >
            电话咨询：{SITE.phone}
          </Link>
        )}
      </section>
    </section>
  );
}
