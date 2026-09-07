// Updated to include site icon and telephone in LocalBusiness schema
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@repo/config";
import { getSettings } from "@/lib/queries";
import { websiteJsonLd, localBusinessJsonLd, IS_PROD } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(s.siteUrl),
    title: {
      default: s.defaultSeoTitle ?? `${s.siteName}_渭南电脑维修_监控安装_网络布线`,
      template: `%s_${s.siteName}`,
    },
    description: s.defaultSeoDescription ?? "个人IT技术服务，服务渭南市及临渭区：电脑维修、监控安装维修、弱电施工、网络布线。",
    robots: IS_PROD ? { index: true, follow: true } : { index: false, follow: false },
    // 添加关键词 meta，帮助搜索引擎更好识别本地业务
    keywords: [
      "渭南电脑维修",
      "临渭区上门维修",
      "渭南监控安装",
      "弱电施工",
      "网络布线",
      "上门服务",
      "技术支持"
    ].join(", "),
    other: s.baiduVerificationCode ? { "baidu-site-verification": s.baiduVerificationCode } : {},
  };
}

const NAV = [
  { href: "/", label: "首页" },
  { href: "/service", label: "服务项目" },
  { href: "/articles", label: "技术文章" },
  { href: "/process", label: "服务流程" },
  { href: "/faq", label: "常见问题" },
  { href: "/about", label: "关于我" },
  { href: "/contact", label: "联系我" },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const jsonLd = [websiteJsonLd(s), localBusinessJsonLd(s)];
  return (
    <html lang="zh-CN">
      <head>
        {/* Site favicon */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="border-b">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="font-bold text-lg">{s.siteName}</Link>
            <nav aria-label="主导航">
              <ul className="flex flex-wrap gap-3 text-sm">
                {NAV.map((n) => (
                  <li key={n.href}><Link href={n.href} className="hover:text-blue-600">{n.label}</Link></li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6 min-h-[60vh]">{children}</main>
        <footer className="border-t mt-8">
          <div className="max-w-4xl mx-auto px-4 py-6 text-sm text-gray-600 space-y-2">
            <p>个人IT技术服务，服务渭南市及临渭区：电脑维修、监控安装与维修、弱电施工、网络布线。</p>
            {SITE.phone && <p>电话：<a href={`tel:${SITE.phone}`} className="text-blue-600">{SITE.phone}</a>{SITE.wechat && ` ｜ 微信：${SITE.wechat}`}</p>}
            <p>© {new Date().getFullYear()} {s.siteName}</p>
          </div>
        </footer>
        {IS_PROD && s.baiduTongjiCode && (
          <script dangerouslySetInnerHTML={{ __html: s.baiduTongjiCode }} />
        )}
      </body>
    </html>
  );
}
