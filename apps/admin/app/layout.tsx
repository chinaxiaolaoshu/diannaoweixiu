import type { Metadata } from "next";
import "./globals.css";

// 后台永远 noindex，且 robots.txt 层面已禁止抓取 /admin/
export const metadata: Metadata = {
  title: "管理后台",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
