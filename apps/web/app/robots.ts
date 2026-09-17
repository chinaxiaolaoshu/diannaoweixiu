import type { MetadataRoute } from "next";
import { BASE } from "@/lib/seo";
import { getSettings } from "@/lib/queries";

// 国内搜索引擎蜘蛛全覆盖：百度(含渲染蜘蛛)/360/搜狗/神马/头条/必应/谷歌
// 默认禁抓低价值路径；后台 robots_extra 可追加自定义规则
export default async function robots(): Promise<MetadataRoute.Robots> {
  const s = await getSettings();
  const disallow = ["/admin/", "/api/", "/search", "/articles?page=", "/_next/"];
  // 后台自定义规则（每行一条 / 开头），保存时已校验格式
  if (s.robotsExtra) {
    for (const line of s.robotsExtra.split(/\r?\n/)) {
      const t = line.trim();
      if (t.startsWith("/") && !disallow.includes(t)) disallow.push(t);
    }
  }
  const uas = [
    "Baiduspider",
    "Baiduspider-render",
    "Googlebot",
    "Bingbot",
    "360Spider",
    "360Spider-Image",
    "HaosouSpider",
    "Sogou web spider",
    "Sogou inst spider",
    "Sogou spider2",
    "Yeti",
    "YisouSpider",
    "Bytespider",
    "*",
  ];
  return {
    rules: uas.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
