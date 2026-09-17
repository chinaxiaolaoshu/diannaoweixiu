/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS：强制 HTTPS，覆盖子域，预载入列表（百度蜘蛛与浏览器均受益）
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  transpilePackages: ["@repo/db", "@repo/config"],
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // SVG/OG 图等静态资源长期不变缓存，加速回访与蜘蛛重复抓取
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};
export default nextConfig;
