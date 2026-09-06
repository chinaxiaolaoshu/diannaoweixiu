import { db, categories } from "@repo/db";
import { createCategory, deleteCategory } from "@/lib/actions";

export default async function CategoriesPage() {
  const rows = await db.select().from(categories);
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">分类管理</h1>
      <form action={createCategory} className="bg-white border rounded p-4 max-w-md mb-6">
        <label htmlFor="name">名称</label>
        <input id="name" type="text" name="name" required />
        <label htmlFor="slug">Slug</label>
        <input id="slug" type="text" name="slug" required pattern="[a-z0-9-]+" />
        <label htmlFor="description">描述（可选）</label>
        <textarea id="description" name="description" rows={2} />
        <button className="btn mt-3">新建分类</button>
      </form>
      <ul className="space-y-2 text-sm">
        {rows.map((c) => (
          <li key={c.id} className="bg-white border rounded p-3 flex justify-between items-center">
            <span>{c.name} <span className="text-gray-500">/{c.slug}</span></span>
            <form action={deleteCategory}><input type="hidden" name="id" value={c.id} /><button className="btn-danger">删除</button></form>
          </li>
        ))}
      </ul>
    </section>
  );
}
