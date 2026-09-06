import { db, tags } from "@repo/db";
import { createTag, deleteTag } from "@/lib/actions";

export default async function TagsPage() {
  const rows = await db.select().from(tags);
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">标签管理</h1>
      <form action={createTag} className="bg-white border rounded p-4 max-w-md mb-6">
        <label htmlFor="name">名称</label>
        <input id="name" type="text" name="name" required />
        <label htmlFor="slug">Slug</label>
        <input id="slug" type="text" name="slug" required pattern="[a-z0-9-]+" />
        <button className="btn mt-3">新建标签</button>
      </form>
      <ul className="space-y-2 text-sm">
        {rows.map((t) => (
          <li key={t.id} className="bg-white border rounded p-3 flex justify-between items-center">
            <span>{t.name} <span className="text-gray-500">/{t.slug}</span></span>
            <form action={deleteTag}><input type="hidden" name="id" value={t.id} /><button className="btn-danger">删除</button></form>
          </li>
        ))}
      </ul>
    </section>
  );
}
