import { desc } from "drizzle-orm";
import { db, messages } from "@repo/db";

export default async function MessagesPage() {
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">留言管理</h1>
      <table className="w-full bg-white border text-sm">
        <thead><tr className="border-b text-left"><th className="p-2">称呼</th><th className="p-2">电话</th><th className="p-2">需求</th><th className="p-2">时间</th></tr></thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id} className="border-b align-top">
              <td className="p-2">{m.name}</td>
              <td className="p-2">{m.phone}</td>
              <td className="p-2 whitespace-pre-wrap">{m.content}</td>
              <td className="p-2">{m.createdAt.toLocaleString("zh-CN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
