import type { Metadata } from "next";
import { SITE } from "@repo/config";

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

type Settings = {
  siteName: string;
  siteUrl: string;
  defaultSeoTitle: string | null;
  defaultSeoDescription: string | null;
  phone: string | null;
  openingHours: string | null;
  priceRange: string | null;
  serviceAreaDesc: string | null;
  seoKeywords: string | null;
};

// 电话/营业时间/价格区间均读 DB（后台可改），env 仅作兜底
function parseOpeningHours(label: string | null): { days: string[]; opens: string; closes: string } | null {
  if (!label) return null;
  const m = label.match(/(\d{1,2}):(\d{2})\s*[-–—到]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: `${m[1].padStart(2, "0")}:${m[2]}`,
    closes: `${m[3].padStart(2, "0")}:${m[4]}`,
  };
}

export function websiteJsonLd(s: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.siteName,
    alternateName: "渭南电脑维修_监控安装",
    url: s.siteUrl,
    inLanguage: "zh-CN",
  };
}

export function localBusinessJsonLd(s: Settings) {
  const phone = s.phone || process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const tel = phone ? `+86${phone.replace(/^86/, "").replace(/[\s-]/g, "")}` : undefined;
  const hours = parseOpeningHours(s.openingHours);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${s.siteUrl}/#business`,
    name: s.siteName,
    alternateName: "渭南电脑维修_监控安装",
    url: s.siteUrl,
    telephone: tel,
    description: s.defaultSeoDescription ?? s.serviceAreaDesc ?? "渭南市临渭区电脑维修、监控安装维修、弱电施工、网络布线个人技术服务",
    image: [`${s.siteUrl}/og-image.svg`],
    logo: `${s.siteUrl}/favicon.svg`,
    priceRange: s.priceRange || "50-500元",
    currenciesAccepted: "CNY",
    paymentAccepted: "现金,微信支付,支付宝",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: "陕西省",
      addressLocality: "渭南市",
      // 上门服务无门店：街道地址写服务主区，不编造具体门牌
      streetAddress: "陕西省渭南市临渭区（上门服务）",
      postalCode: "714000",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.5022,
      longitude: 109.5096,
    },
    openingHoursSpecification: hours
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: hours.days,
            opens: hours.opens,
            closes: hours.closes,
          },
        ]
      : undefined,
    areaServed: SITE.serviceAreas.map((a) => ({
      "@type": "AdministrativeArea",
      name: a.isPrimary ? `陕西省渭南市${a.name}` : `陕西省渭南市${a.name}（仅咨询）`,
    })),
    knowsAbout: ["电脑维修", "监控安装", "监控维修", "网络布线", "WiFi覆盖优化", "弱电施工", "数据恢复"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: tel,
      contactType: "customer service",
      areaServed: "CN",
      availableLanguage: ["zh-CN"],
    },
  };
}

// 服务页 Service 结构化数据：含 offer 明细，帮助搜索引擎理解服务与价格区间
export function serviceJsonLd(s: Settings, sv: { slug: string; name: string; desc: string }) {
  const priceNote = SITE.priceTable.find((p) => p.item.includes(sv.name.slice(0, 2)));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `渭南${sv.name}`,
    serviceType: sv.name,
    description: sv.desc,
    url: `${s.siteUrl}/service/${sv.slug}`,
    inLanguage: "zh-CN",
    areaServed: SITE.serviceAreas.filter((a) => a.isPrimary).map((a) => ({
      "@type": "AdministrativeArea",
      name: `陕西省渭南市${a.name}`,
    })),
    provider: { "@id": `${s.siteUrl}/#business` },
    offers: priceNote
      ? {
          "@type": "Offer",
          priceCurrency: "CNY",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: priceNote.price,
            priceCurrency: "CNY",
            description: priceNote.note,
          },
        }
      : undefined,
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
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
