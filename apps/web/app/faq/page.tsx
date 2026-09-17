import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { getSettings, getContactPhone } from "@/lib/queries";
import { pageMetadata, faqPageJsonLd, BASE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "常见问题_渭南电脑维修监控安装收费上门范围质保",
  description: "渭南电脑维修、监控安装常见问题解答：怎么收费、上门范围、多久到、数据安全、质保多久、华州区能否上门等。",
  path: "/faq",
});

const FAQS = [
  { q: "服务范围是哪里？华州区可以上门吗？", a: "上门服务范围为渭南市临渭区（含城区各街道、渭南高新区及下辖乡镇）。华州区等周边区县暂不上门，可电话或微信免费咨询，简单故障远程指导解决。" },
  { q: "上门检测收费吗？", a: "临渭区内上门检测免费，检测后明确报价，您确认后才施工，不修不收维修费，绝不中途加价。" },
  { q: "临渭区上门多久能到？", a: "临渭区内通常 2 小时内响应，紧急故障优先安排；下辖乡镇村组一般当天到达，偏远乡镇建议提前电话预约。" },
  { q: "电脑重装系统数据会丢吗？", a: "重装前会与您确认重要数据并先备份，确保数据安全；如已无法进入系统，会先尝试无损导出数据再重装。" },
  { q: "监控安装可以手机远程查看吗？", a: "可以，安装调试完成后会帮您配置手机远程查看并教会使用，老人也能轻松上手；支持自动循环录像，无需每天管理。" },
  { q: "监控安装一般需要多久？", a: "家用 2–4 个摄像头通常半天内完成（含布线、调试、手机远程配置）；商铺或办公室点位较多时一般 1 天内完成，施工当天即可使用。" },
  { q: "维修后有质保吗？", a: "同一故障 7 天内免费返修，更换配件按厂家质保政策执行；监控工程整体提供 3 个月免费维护，非人为损坏不另收费。" },
  { q: "怎么收费？可以开发票吗？", a: "先检测报价后施工：系统重装 80–150 元，监控安装 150–300 元/个，网络布线 120–260 元/点，详见首页价格参考表。可开收款凭证，需要发票请提前说明。" },
  { q: "电脑里重要数据能恢复吗？", a: "误删文件、格式化、硬盘异响等均可尝试恢复，成功率视损坏程度而定；会先检测评估并报价，确认后才操作，全程保障隐私不外泄。" },
  { q: "农村、乡镇可以上门吗？", a: "可以，临渭区各乡镇村组均可上门，包括下邽、固市、崇凝、桥南、官道、三张等，偏远村镇请提前电话沟通上门时间。" },
];

export default async function FaqPage() {
  const s = await getSettings();
  const phone = getContactPhone(s);
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQS)) }}
      />
      <h1 className="text-2xl font-bold">常见问题</h1>
      <p className="text-gray-700 mt-3">
        关于收费、上门范围、服务流程和售后质保的常见疑问，都在这里。没找到答案？直接电话或微信咨询。
      </p>
      <div className="mt-6 space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="border rounded-lg p-4">
            <summary className="font-bold cursor-pointer marker:text-blue-600">{f.q}</summary>
            <p className="text-sm text-gray-600 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        {phone && (
          <Link
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium min-h-[48px]"
          >
            电话咨询：{phone}
          </Link>
        )}
        <Link
          href="/process"
          className="inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded font-medium min-h-[48px]"
        >
          查看服务流程
        </Link>
      </div>
    </section>
  );
}
