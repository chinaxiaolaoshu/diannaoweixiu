import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { db, articles, messages } from "@repo/db";

export default async function DashboardPage() {
  const [[pub], [draft], [msg], recent] = await Promise.all([
    db.select({ value: count() }).from(articles).where(eq(articles.status, "published")),
    db.select({ value: count() }).from(articles).where(eq(articles.status, "draft")),
    db.select({ value: count() }).from(messages),
    db.select().from(articles).orderBy(desc(articles.updatedAt)).limit(5),
  ]);
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">仪表盘</h1>
      <div className="grid grid-cols-3 gap-4 max-w-xl">
        <div className="bg-white border rounded p-4"><p className="text-2xl font-bold">{Number(pub.value)}</p><p className="text-sm text-gray-600">已发布文章</p></div>
        <div className="bg-white border rounded p-4"><p className="text-2xl font-bold">{Number(draft.value)}</p><p className="text-sm text-gray-600">草稿</p></div>
        <div className="bg-white border rounded p-4"><p className="text-2xl font-bold">{Number(msg.value)}</p><p className="text-sm text-gray-600">留言</p></div>
      </div>
      <h2 className="font-bold mt-8 mb-3">最近编辑</h2>
      <ul className="space-y-2 text-sm">
        {recent.map((a) => (
          <li key={a.id}>
            <Link href={`/articles/${a.id}`} className="text-blue-600 hover:underline">{a.title}</Link>
            <span className="text-gray-500 ml-2">{a.status === "published" ? "已发布" : "草稿"} · {a.updatedAt.toLocaleString("zh-CN")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
