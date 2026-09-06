import type { MetadataRoute } from "next";
import { BASE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Baiduspider", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
