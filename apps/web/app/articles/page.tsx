import Link from "next/link";
import type { Metadata } from "next";
import { listPublished } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
  title: "技术文章",
  description: "渭南电脑维修、监控安装、网络布线相关技术文章与经验分享。",
  path: "/articles",
});

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const { items, total, perPage } = await listPublished(page, 10);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">技术文章</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">暂无文章。</p>
      ) : (
        <ul className="space-y-4">
          {items.map((a) => (
            <li key={a.id} className="border-b pb-3">
              <h2 className="font-bold">
                <Link href={`/articles/${a.slug}`} className="hover:text-blue-600">{a.title}</Link>
              </h2>
              {a.excerpt && <p className="text-sm text-gray-600 mt-1">{a.excerpt}</p>}
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <nav aria-label="分页" className="flex gap-3 mt-6 text-sm">
          {page > 1 && <Link href={`/articles?page=${page - 1}`} className="text-blue-600">上一页</Link>}
          <span>第 {page} / {totalPages} 页</span>
          {page < totalPages && <Link href={`/articles?page=${page + 1}`} className="text-blue-600">下一页</Link>}
        </nav>
      )}
    </section>
  );
}
