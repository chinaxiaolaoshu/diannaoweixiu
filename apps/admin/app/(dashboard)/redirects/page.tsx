import { db, redirects } from "@repo/db";
import { createRedirect, toggleRedirect, deleteRedirect } from "@/lib/actions";

export default async function RedirectsPage() {
  const rows = await db.select().from(redirects);
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">301 重定向管理</h1>
      <form action={createRedirect} className="bg-white border rounded p-4 max-w-md mb-6">
        <label htmlFor="sourcePath">旧路径（如 /old-page）</label>
        <input id="sourcePath" type="text" name="sourcePath" required />
        <label htmlFor="targetPath">新路径（410 时可填 /）</label>
        <input id="targetPath" type="text" name="targetPath" required />
        <label htmlFor="statusCode">类型</label>
        <select id="statusCode" name="statusCode" defaultValue="301">
          <option value="301">301 永久迁移</option>
          <option value="302">302 临时跳转</option>
          <option value="410">410 已删除</option>
        </select>
        <button className="btn mt-3">新建规则</button>
      </form>
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="bg-white border rounded p-3 flex justify-between items-center gap-2">
            <span>{r.sourcePath} → {r.targetPath}（{r.statusCode}）{r.enabled ? "" : " · 已停用"}</span>
            <span className="flex gap-2">
              <form action={toggleRedirect}><input type="hidden" name="id" value={r.id} /><button className="text-blue-600">{r.enabled ? "停用" : "启用"}</button></form>
              <form action={deleteRedirect}><input type="hidden" name="id" value={r.id} /><button className="text-red-600">删除</button></form>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
