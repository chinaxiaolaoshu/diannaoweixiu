import Link from "next/link";
import type { Metadata } from "next";
import { searchArticles } from "@/lib/queries";

// 搜索结果页带参数，统一 noindex，避免重复参数 URL 被收录
export const metadata: Metadata = {
  title: "站内搜索",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q) : [];
  return (
    <section>
      <h1 className="text-2xl font-bold">站内搜索</h1>
      <form action="/search" method="get" className="mt-4 flex gap-2 max-w-md">
        <input name="q" defaultValue={q} placeholder="输入关键词，如：监控安装" className="flex-1 border rounded p-2" />
        <button className="bg-blue-600 text-white px-4 rounded">搜索</button>
      </form>
      {q && (
        <div className="mt-6">
          <h2 className="font-bold">“{q}” 的搜索结果（{results.length}）</h2>
          <ul className="space-y-3 mt-3">
            {results.map((a) => (
              <li key={a.id}><Link href={`/articles/${a.slug}`} className="text-blue-600 hover:underline">{a.title}</Link></li>
            ))}
            {results.length === 0 && <li className="text-gray-600">未找到相关文章。</li>}
          </ul>
        </div>
      )}
    </section>
  );
}
