import type { Metadata } from "next";

export const IS_PROD = process.env.VERCEL_ENV === "production";
export const BASE = process.env.SITE_URL ?? "https://www.0913610.xyz";

// Vercel Preview 环境强制 noindex，防止预览域名被收录
export function robotsFor(noindex = false) {
  return IS_PROD && !noindex ? { index: true, follow: true } : { index: false, follow: false };
}

export function pageMetadata(opts: { title: string; description?: string; path: string; noindex?: boolean }): Metadata {
  const url = `${BASE}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: robotsFor(opts.noindex),
    openGraph: { title: opts.title, description: opts.description, url, type: "website", locale: "zh_CN" },
    twitter: { card: "summary" },
  };
}

type ArticleLike = {
  title: string; slug: string; excerpt: string | null; coverImage: string | null;
  seoTitle: string | null; seoDescription: string | null; canonicalUrl: string | null;
  noindex: boolean; publishedAt: Date | null; updatedAt: Date;
};

export function buildArticleMetadata(a: ArticleLike): Metadata {
  const url = a.canonicalUrl || `${BASE}/articles/${a.slug}`;
  const title = a.seoTitle || a.title;
  const description = a.seoDescription || a.excerpt || undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: robotsFor(a.noindex),
    openGraph: { title, description, url, type: "article", locale: "zh_CN", images: a.coverImage ? [a.coverImage] : [] },
    twitter: { card: a.coverImage ? "summary_large_image" : "summary" },
  };
}

type Settings = { siteName: string; siteUrl: string; defaultSeoDescription: string | null };

export function websiteJsonLd(s: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.siteName,
    url: s.siteUrl,
    inLanguage: "zh-CN",
  };
}

// 本地服务主体：明确服务地区为渭南市临渭区，不伪造其他数据
export function localBusinessJsonLd(s: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s.siteName,
    url: s.siteUrl,
    description: "渭南市临渭区电脑维修、监控安装维修、弱电施工、网络布线个人技术服务",
    areaServed: ["陕西省渭南市", "临渭区"],
    address: { "@type": "PostalAddress", addressRegion: "陕西省", addressLocality: "渭南市", streetAddress: "临渭区" },
  };
}

export function articleJsonLd(a: ArticleLike, siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.seoDescription || a.excerpt || undefined,
    image: a.coverImage || undefined,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    mainEntityOfPage: `${BASE}/articles/${a.slug}`,
    author: { "@type": "Person", name: siteName },
    inLanguage: "zh-CN",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
