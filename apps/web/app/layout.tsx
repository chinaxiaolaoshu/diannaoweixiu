import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@repo/config";
import { getSettings } from "@/lib/queries";
import { websiteJsonLd, localBusinessJsonLd, IS_PROD } from "@/lib/seo";
import { getContactPhone } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const phone = getContactPhone(s);
  return {
    metadataBase: new URL(s.siteUrl),
    title: {
      default: s.defaultSeoTitle ?? `${s.siteName}_渭南电脑维修_监控安装_网络布线`,
      template: `%s_${s.siteName}`,
    },
    description: s.defaultSeoDescription ?? "渭南电脑上门维修、监控安装维修、弱电施工、网络布线服务。临渭区2小时响应，先报价后施工，7天质保。电话预约。",
    robots: IS_PROD ? { index: true, follow: true } : { index: false, follow: false },
    keywords: s.seoKeywords
      ? s.seoKeywords
      : [
          "渭南电脑维修",
          "渭南上门修电脑",
          "渭南监控安装",
          "渭南摄像头安装",
          "临渭区电脑维修",
          "华州区监控安装",
          "渭南网络布线",
          "弱电施工",
        ].join(", "),
    other: s.baiduVerificationCode ? { "baidu-site-verification": s.baiduVerificationCode } : {},
  };
}

// 移动端与本地搜索友好：固定主题色、覆盖状态栏
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1d4ed8",
};

const NAV = [
  { href: "/", label: "首页" },
  { href: "/service", label: "服务项目" },
  { href: "/areas", label: "服务区域" },
  { href: "/articles", label: "技术文章" },
  { href: "/process", label: "服务流程" },
  { href: "/faq", label: "常见问题" },
  { href: "/about", label: "关于我们" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const phone = getContactPhone(s);
  const jsonLd = [websiteJsonLd(s), localBusinessJsonLd(s)];
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {IS_PROD && (
          <script dangerouslySetInnerHTML={{ __html: `(function(){var el=document.createElement("script");el.src="https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?2f6d32e5bd190585db6729e15bfeb97875de3ab8c0cfbe42b3ddc107c555edb130632485602430134f60bc55ca391050b680e2741bf7233a8f1da9902314a3fa";el.id="ttzz";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(el,s);})(window)` }} />
        )}
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="font-bold text-lg flex items-center gap-2">
              <span className="inline-block w-8 h-8 bg-blue-600 text-white rounded text-center leading-8 text-sm">修</span>
              {s.siteName}
            </Link>
            <nav aria-label="主导航">
              <ul className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                {NAV.map((n) => (
                  <li key={n.href}><Link href={n.href} className="hover:text-blue-600 px-1 py-1">{n.label}</Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6 min-h-[60vh]">{children}</main>
        <footer className="border-t mt-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8 text-sm text-gray-600 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <p className="font-bold text-gray-900">{s.siteName}</p>
              <p className="mt-2">渭南市临渭区电脑维修、监控安装与维修、弱电施工、网络布线上门服务。</p>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2">服务项目</p>
              <ul className="space-y-1">
                {SITE.services.map((sv) => (
                  <li key={sv.slug}><Link href={`/service/${sv.slug}`} className="hover:text-blue-600">{sv.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2">快速导航</p>
              <ul className="space-y-1">
                <li><Link href="/areas" className="hover:text-blue-600">服务区域</Link></li>
                <li><Link href="/process" className="hover:text-blue-600">服务流程</Link></li>
                <li><Link href="/faq" className="hover:text-blue-600">常见问题</Link></li>
                <li><Link href="/articles" className="hover:text-blue-600">技术文章</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">联系我们</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2">联系我们</p>
              <p>{s.openingHours ?? SITE.openingHoursLabel}</p>
              {phone && <p className="mt-1">电话：<a href={`tel:${phone}`} className="text-blue-600 font-bold">{phone}</a></p>}
              {(s.wechat || SITE.wechat) && <p>微信：{s.wechat || SITE.wechat}</p>}
            </div>
          </div>
          <div className="border-t">
            <div className="max-w-4xl mx-auto px-4 py-3 text-xs text-gray-500 flex flex-wrap justify-between gap-2">
              <span>© {new Date().getFullYear()} {s.siteName} · {SITE.region}</span>
              <span>本站内容仅供参考，具体价格以现场检测报价为准</span>
            </div>
          </div>
        </footer>
        {IS_PROD && s.baiduTongjiCode && (
          <script dangerouslySetInnerHTML={{ __html: s.baiduTongjiCode }} />
        )}
      </body>
    </html>
  );
}
