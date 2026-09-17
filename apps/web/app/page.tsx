import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { listPublished, getSettings, getContactPhone } from "@/lib/queries";
import { pageMetadata, faqPageJsonLd, BASE } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const phone = getContactPhone(s);
  const hours = s.openingHours ?? SITE.openingHoursLabel;
  return pageMetadata({
    title: s.defaultSeoTitle ?? `渭南电脑维修_临渭区上门修电脑_监控安装维修 - ${s.siteName}`,
    description:
      s.defaultSeoDescription ??
      `渭南市临渭区电脑上门维修、监控摄像头安装与维修、网络布线服务。${hours}，2小时响应，先报价后施工，7天质保。电话 ${phone}。`,
    path: "/",
  });
}

function escapeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

const PROMISES = [
  { title: "快速响应", desc: "临渭区内 2 小时内响应上门，紧急情况优先安排，乡镇村组当天到达。" },
  { title: "价格透明", desc: "先检测报价，确认后再施工，配件明码标价，旧件可自行保留，无隐藏费用。" },
  { title: "质保无忧", desc: "同一故障 7 天内免费返修，更换配件按厂家政策保修，监控工程享 3 个月维护。" },
  { title: "数据安全", desc: "操作前确认备份方案，涉数据恢复先报价后操作，保障隐私不外泄。" },
];

const STEPS = [
  { t: "电话/微信沟通", d: "描述故障或需求，发图发视频远程初判，初步判断问题与大致费用区间。" },
  { t: "预约上门", d: "约定上门时间，临渭区内 2 小时响应，准时到达，农村乡镇当天安排。" },
  { t: "现场检测报价", d: "当面检测确认故障原因，明确维修方案与总价，您确认后才开始施工。" },
  { t: "施工/维修", d: "现场完成维修、安装或布线，重要数据先备份，全程操作透明可见。" },
  { t: "验收与售后", d: "当面验收测试通过后结算，同一问题 7 天内免费返修，开具收款凭证。" },
];

const HOME_FAQS = [
  {
    q: "渭南上门修电脑怎么收费？有上门费吗？",
    a: `临渭区内上门检测免费，先检测报价，确认后施工。系统重装 80–150 元，硬件更换为配件价加 30–80 元人工，监控安装 150–300 元/个，全部明码标价，无隐藏费用。`,
  },
  {
    q: "临渭区上门多久能到？",
    a: "临渭区内通常 2 小时内响应，紧急情况优先安排；下辖乡镇村组一般当天到达，偏远地区提前电话沟通上门时间。",
  },
  {
    q: "家里安装监控可以手机远程看吗？老人会用吗？",
    a: "可以。安装调试完成后会帮您配置手机远程查看，现场教会使用，操作简单，老人也能轻松上手；录像机支持自动覆盖循环录像，无需每天管。",
  },
  {
    q: "电脑里重要数据会丢吗？",
    a: "重装系统或维修前，会与您确认重要数据并先备份；涉及数据恢复的故障（误删、格式化、硬盘异响）会先报价再操作，全程保障数据完整与隐私安全。",
  },
  {
    q: "维修后有质保吗？",
    a: "同一故障 7 天内免费返修，更换的硬件按厂家质保政策执行；监控工程整体提供 3 个月免费维护，非人为损坏不另收费。",
  },
  {
    q: "农村、乡镇、村里可以上门吗？",
    a: "可以，临渭区各乡镇村组均可上门，如下邽、固市、崇凝、桥南、官道等，偏远乡镇建议提前一天电话预约。",
  },
  {
    q: "华州区或其他区县可以服务吗？",
    a: `目前上门服务以临渭区为主；华州区等周边区县暂不上门，可电话或微信免费咨询，简单故障远程指导解决。`,
  },
  {
    q: "商铺、办公室可以开发票/收据吗？",
    a: "可提供收款凭证；如需发票请提前说明，按实际金额开具，方便商铺和公司报销入账。",
  },
];

export default async function HomePage() {
  const { items } = await listPublished(1, 5);
  const s = await getSettings();
  const phone = getContactPhone(s);
  const hours = s.openingHours ?? SITE.openingHoursLabel;

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: s.defaultSeoTitle ?? `${s.siteName}_渭南电脑维修_临渭区上门维修_监控安装`,
    description: s.defaultSeoDescription ?? "渭南市临渭区电脑维修、监控安装、弱电施工、网络布线个人技术服务",
    url: BASE,
    inLanguage: "zh-CN",
    mainEntity: { "@id": `${BASE}/#business` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(homeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqPageJsonLd(HOME_FAQS)) }} />

      <section className="py-8 bg-gradient-to-b from-blue-50 to-white -mx-4 px-4 sm:mx-0 sm:px-0 rounded-b-lg">
        <h1 className="text-3xl font-bold text-gray-900">渭南电脑维修_监控安装上门服务</h1>
        <p className="mt-3 text-lg text-gray-700 max-w-2xl">
          渭南市临渭区专业 IT 上门技术服务：台式机/笔记本维修、监控摄像头安装与维修、弱电施工、网络布线与 WiFi 全屋覆盖。家庭、商铺、农村、办公室均可上门，{hours}，临渭区内 2 小时响应，先报价后施工，7 天质保。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {phone && (
            <a href={`tel:${phone}`} className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-medium min-h-[48px] text-lg">
              立即致电：{phone}
            </a>
          )}
          <Link href="/contact" className="inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded font-medium min-h-[48px] text-lg">
            在线留言
          </Link>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-5">为什么选择我们</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMISES.map((p) => (
            <div key={p.title} className="border rounded-lg p-4 bg-white">
              <h3 className="font-bold text-blue-700">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-5">服务项目</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SITE.services.map((sv) => (
            <Link key={sv.slug} href={`/service/${sv.slug}`} className="border rounded-lg p-5 hover:border-blue-500 hover:shadow-md transition-all group flex gap-4">
              <img
                src={`/images/service-${sv.slug}.svg`}
                alt={`渭南${sv.name}服务示意图`}
                width={80}
                height={80}
                loading="lazy"
                className="w-20 h-20 shrink-0"
              />
              <div>
                <h3 className="font-bold text-lg group-hover:text-blue-600">渭南{sv.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{sv.desc}</p>
                <span className="inline-block mt-3 text-xs text-blue-600 font-medium">了解详情与报价 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-2">服务流程</h2>
        <p className="text-sm text-gray-600 mb-5">从电话沟通到验收售后，全程透明可控，每一步都让您心里有数。</p>
        <ol className="space-y-3">
          {STEPS.map((st, i) => (
            <li key={st.t} className="border rounded-lg p-4 flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold">{st.t}</h3>
                <p className="text-sm text-gray-600 mt-1">{st.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-500">
          详细说明请查看 <Link href="/process" className="text-blue-600 hover:underline">服务流程</Link>，常见疑问可参考 <Link href="/faq" className="text-blue-600 hover:underline">常见问题</Link>。
        </p>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-2">价格参考</h2>
        <p className="text-sm text-gray-600 mb-5">以下为常见服务价格区间，实际以现场检测报价为准，确认后施工，不修不收维修费。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50 text-left">
                <th scope="col" className="border p-3 font-bold">服务项目</th>
                <th scope="col" className="border p-3 font-bold whitespace-nowrap">参考价格</th>
                <th scope="col" className="border p-3 font-bold">说明</th>
              </tr>
            </thead>
            <tbody>
              {SITE.priceTable.map((p) => (
                <tr key={p.item} className="align-top">
                  <td className="border p-3 font-medium whitespace-nowrap">{p.item}</td>
                  <td className="border p-3 text-blue-700 font-bold whitespace-nowrap">{p.price}</td>
                  <td className="border p-3 text-gray-600">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-2">服务区域</h2>
        <p className="text-sm text-gray-700">
          上门服务覆盖渭南市临渭区全域，包括站南、向阳、解放、杜桥、双王等城区街道，渭南高新区，以及下邽、固市、崇凝、桥南、官道、三张等下辖乡镇，农村、家庭、商铺、办公室均可上门。华州区等周边区县暂不上门，可电话免费咨询。
        </p>
        <Link href="/areas" className="inline-block mt-4 text-sm text-blue-600 hover:underline font-medium">
          查看完整服务区域 →
        </Link>
      </section>

      <section className="py-8">
        <h2 className="text-xl font-bold mb-5">常见问题</h2>
        <div className="space-y-3">
          {HOME_FAQS.map((f) => (
            <details key={f.q} className="border rounded-lg p-4">
              <summary className="font-bold cursor-pointer marker:text-blue-600">{f.q}</summary>
              <p className="text-sm text-gray-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {items.length > 0 && (
        <section className="py-8">
          <h2 className="text-xl font-bold mb-4">技术文章</h2>
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id} className="border-l-2 border-blue-300 pl-3">
                <Link href={`/articles/${a.slug}`} className="text-blue-700 hover:text-blue-900 font-medium">{a.title}</Link>
                {a.excerpt && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.excerpt}</p>}
              </li>
            ))}
          </ul>
          <Link href="/articles" className="inline-block mt-4 text-sm text-blue-600 hover:underline font-medium">查看全部文章 →</Link>
        </section>
      )}

      <section className="py-8">
        <h2 className="text-xl font-bold mb-2">快速留言</h2>
        <p className="text-sm text-gray-600 mb-4">留下您的需求，我会尽快回电（仅服务渭南市临渭区，华州区等周边可电话咨询）。</p>
        <ContactForm />
      </section>
    </>
  );
}
