import { NextResponse, type NextRequest } from "next/server";

// 301 重定向表缓存（每实例 60s），避免每请求查库
// Edge Runtime 不支持 TCP，改用 Supabase REST (PostgREST) fetch 查询
type Row = { source_path: string; target_path: string; status_code: string };
let cache: { data: Row[]; ts: number } | null = null;

async function getRedirects(): Promise<Row[]> {
  if (cache && Date.now() - cache.ts < 60_000) return cache.data;
  try {
    const base = process.env.SUPABASE_URL!.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_KEY!;
    const res = await fetch(
      `${base}/rest/v1/redirects?select=source_path,target_path,status_code&enabled=eq.true`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return cache?.data ?? [];
    const rows = (await res.json()) as Row[];
    cache = { data: rows, ts: Date.now() };
    return rows;
  } catch {
    return cache?.data ?? [];
  }
}

// 注意：绝不根据 User-Agent / IP / Referer 拦截请求，保证百度蜘蛛正常抓取。
export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // 裸域名 301 到 www 主域（canonical 域名统一）
  if (host === "0913610.xyz") {
    return NextResponse.redirect(`https://www.0913610.xyz${url.pathname}${url.search}`, 301);
  }

  const rows = await getRedirects();
  const hit = rows.find((r) => r.source_path === url.pathname);
  if (hit) {
    if (hit.status_code === "410") return new NextResponse(null, { status: 410 });
    return NextResponse.redirect(new URL(hit.target_path, url.origin), hit.status_code === "301" ? 301 : 302);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
