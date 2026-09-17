import type { MetadataRoute } from "next";
import { BASE } from "@/lib/seo";

// 国内搜索引擎蜘蛛全覆盖：百度(含渲染蜘蛛)/360/搜狗/神马/头条/必应/谷歌
// 低价值路径统一禁抓：后台、接口、搜索结果页（重复参数 URL）、分页参数
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin/", "/api/", "/search", "/articles?page=", "/_next/"];
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
