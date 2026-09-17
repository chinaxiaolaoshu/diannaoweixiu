import type { Metadata } from "next";
import { SITE } from "@repo/config";
import { getSettings, getContactPhone } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/contact-form";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "关于我们_渭南临渭区电脑维修监控安装技术员",
  description:
    "渭南本地个人IT技术服务者，多年电脑维修、监控安装、弱电施工与网络布线经验，服务临渭区家庭、商铺与办公室，先报价后施工。",
  path: "/about",
});

export default async function AboutPage() {
  const s = await getSettings();
  const phone = getContactPhone(s);
  const hours = s.openingHours ?? SITE.openingHoursLabel;
  return (
    <section>
      <h1 className="text-2xl font-bold">关于我们</h1>
      {s.aboutContent ? (
        // 后台保存时已消毒
        <div className="prose mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: s.aboutContent }} />
      ) : (
        <div className="mt-4 space-y-4 text-gray-700 leading-relaxed">
          <p>
            我是渭南本地的个人 IT 技术服务者，长期在临渭区从事电脑维修、监控安装与维修、弱电施工和网络布线工作。从家庭电脑故障到商铺监控、办公室网络，各种常见问题都能现场处理，不需要您把机器搬来搬去。
          </p>
          <p>
            服务理念很简单：<strong>先检测、再报价、确认后施工</strong>。上门检测故障后会把问题原因和所需费用一次说清楚，您同意了才开始动手；配件明码标价，换下来的旧件您自己保留；同一故障 7 天内免费返修，让您售后无忧。
          </p>
          <p>
            服务对象覆盖临渭区的家庭用户、沿街商铺、农村住户和小型办公室。无论是台式机开机无反应、笔记本蓝屏死机、电脑越用越卡，还是店铺要装几个监控、家里 WiFi 信号差、办公室网线需要重新布放，都可以电话预约上门。
          </p>
          <p>
            上门范围以渭南市临渭区为主，城区各街道、渭南高新区及下辖乡镇都能到，临渭区内通常 2 小时内响应；偏远乡镇建议提前电话预约。华州区等周边区县暂不上门，可电话或微信免费咨询，简单故障远程指导解决。
          </p>
        </div>
      )}

      <h2 className="text-xl font-bold mt-10 mb-4">服务承诺</h2>
      <ul className="space-y-2 text-gray-700 list-disc pl-5">
        <li>临渭区内 2 小时响应，乡镇村组当天到达，紧急故障优先安排。</li>
        <li>上门免费检测，报价确认后施工，修不好不收维修费。</li>
        <li>维修同一故障享 7 天质保，更换配件按厂家政策保修。</li>
        <li>操作前备份重要数据，保障您的数据与隐私安全。</li>
      </ul>

      <h2 className="text-xl font-bold mt-10 mb-4">联系我们</h2>
      <div className="space-y-2 text-gray-700">
        <p>服务地区：陕西省渭南市临渭区（城区、高新区及下辖乡镇，支持上门）</p>
        <p>服务时间：{hours}</p>
        {phone && (
          <p>
            电话：<a href={`tel:${phone}`} className="text-blue-600 font-bold">{phone}</a>
            {(s.wechat || SITE.wechat) && <span>（微信同号）</span>}
          </p>
        )}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">在线留言</h2>
      <ContactForm />
    </section>
  );
}
