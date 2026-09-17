import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { getSettings, getContactPhone } from "@/lib/queries";
import { pageMetadata, breadcrumbJsonLd, BASE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "服务流程_渭南电脑维修监控安装上门五步流程",
  description:
    "渭南IT技术服务流程：电话沟通、预约上门、现场检测报价、施工维修、验收售后。临渭区2小时响应，先报价后施工，7天质保。",
  path: "/process",
});

const STEPS = [
  {
    t: "1. 电话/微信沟通",
    d: "您来电或微信描述故障现象、设备型号和地址，我会远程初步判断问题原因，并给出大致费用区间，方便您心里有数。",
    tip: "小问题可直接电话指导解决，不必上门。",
  },
  {
    t: "2. 预约上门",
    d: "约定上门时间，临渭区内 2 小时内响应，城区街道、开发区、乡镇村组均可上门；偏远乡镇建议提前一天预约，我会准时到达。",
    tip: "上门检测免费（临渭区内），不修不收维修费。",
  },
  {
    t: "3. 现场检测报价",
    d: "到场后当面检测设备，确认故障原因和所需配件，把维修方案、所需时间、全部费用一次说清楚，您确认后我才开始施工。",
    tip: "价格透明，绝不中途加价。",
  },
  {
    t: "4. 施工/维修",
    d: "现场完成维修、安装或布线。重装系统或涉及数据操作前，会先与您确认并备份重要数据；换下的旧配件您可自行保留。",
    tip: "全程操作透明，您可以在旁边观看。",
  },
  {
    t: "5. 验收与售后",
    d: "施工完成后当面测试验收，确认问题解决后结算，可开具收款凭证。同一故障 7 天内免费返修，监控工程享 3 个月免费维护。",
    tip: "售后有保障，出问题随时联系。",
  },
];

export default async function ProcessPage() {
  const s = await getSettings();
  const phone = getContactPhone(s);
  const breadcrumbs = [
    { name: "首页", url: `${BASE}/` },
    { name: "服务流程", url: `${BASE}/process` },
  ];
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <h1 className="text-2xl font-bold">服务流程</h1>
      <p className="text-gray-700 mt-3">
        从您打电话那一刻起，到维修完成售后无忧，全程五个环节透明可控。临渭区内 2 小时响应，先报价后施工，不修不收维修费。
      </p>
      <ol className="mt-6 space-y-4">
        {STEPS.map((s) => (
          <li key={s.t} className="border rounded-lg p-5">
            <h2 className="font-bold text-lg text-blue-700">{s.t}</h2>
            <p className="text-sm text-gray-600 mt-2">{s.d}</p>
            <p className="text-xs text-blue-600 mt-2 font-medium">{s.tip}</p>
          </li>
        ))}
      </ol>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">结算与售后说明</h2>
        <ul className="space-y-2 text-gray-700 list-disc pl-5 text-sm">
          <li>支付方式：现金、微信、支付宝均可，商铺和公司可开收款凭证。</li>
          <li>质保政策：同一故障 7 天内免费返修；更换硬件按厂家质保执行；监控工程整体 3 个月免费维护。</li>
          <li>价格区间参考请查看 <Link href="/#price" className="text-blue-600 hover:underline">首页价格表</Link>，或直接电话咨询。</li>
        </ul>
        {phone && (
          <Link
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium min-h-[48px]"
          >
            电话预约：{phone}
          </Link>
        )}
      </section>
    </section>
  );
}
