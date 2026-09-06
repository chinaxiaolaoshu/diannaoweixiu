import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, articles } from "@repo/db";
import { deleteArticle } from "@/lib/actions";

export default async function ArticlesAdminPage() {
  const rows = await db.select().from(articles).orderBy(desc(articles.updatedAt));
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">文章管理</h1>
        <Link href="/articles/new" className="btn">新建文章</Link>
      </div>
      <table className="w-full bg-white border text-sm">
        <thead><tr className="border-b text-left"><th className="p-2">标题</th><th className="p-2">slug</th><th className="p-2">状态</th><th className="p-2">更新时间</th><th className="p-2">操作</th></tr></thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.title}</td>
              <td className="p-2 text-gray-500">{a.slug}</td>
              <td className="p-2">{a.status === "published" ? "已发布" : "草稿"}{a.noindex ? " · noindex" : ""}</td>
              <td className="p-2">{a.updatedAt.toLocaleDateString("zh-CN")}</td>
              <td className="p-2 flex gap-2">
                <Link href={`/articles/${a.id}`} className="text-blue-600">编辑</Link>
                <form action={deleteArticle}><input type="hidden" name="id" value={a.id} /><button className="text-red-600">删除</button></form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
