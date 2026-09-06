import { db, siteSettings } from "@repo/db";
import { updateSettings } from "@/lib/actions";

export default async function SettingsPage() {
  const [s] = await db.select().from(siteSettings).limit(1);
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">网站基础设置</h1>
      <form action={updateSettings} className="bg-white border rounded p-6 max-w-2xl">
        <label htmlFor="siteName">站点名称</label>
        <input id="siteName" type="text" name="siteName" required defaultValue={s?.siteName ?? "渭南IT技术服务"} />
        <label htmlFor="siteUrl">站点 URL（canonical 主域）</label>
        <input id="siteUrl" type="url" name="siteUrl" required defaultValue={s?.siteUrl ?? "https://www.0913610.xyz"} />
        <label htmlFor="defaultSeoTitle">默认 SEO 标题</label>
        <input id="defaultSeoTitle" type="text" name="defaultSeoTitle" defaultValue={s?.defaultSeoTitle ?? ""} />
        <label htmlFor="defaultSeoDescription">默认 SEO 描述（建议包含“服务渭南市及临渭区”）</label>
        <textarea id="defaultSeoDescription" name="defaultSeoDescription" rows={2} defaultValue={s?.defaultSeoDescription ?? ""} />
        <label htmlFor="defaultOgImage">默认 OG 图 URL</label>
        <input id="defaultOgImage" type="url" name="defaultOgImage" defaultValue={s?.defaultOgImage ?? ""} />
        <label htmlFor="baiduVerificationCode">百度站长验证码（content 值）</label>
        <input id="baiduVerificationCode" type="text" name="baiduVerificationCode" defaultValue={s?.baiduVerificationCode ?? ""} />
        <label htmlFor="baiduTongjiCode">百度统计代码（可选，仅生产环境输出）</label>
        <textarea id="baiduTongjiCode" name="baiduTongjiCode" rows={3} defaultValue={s?.baiduTongjiCode ?? ""} />
        <label htmlFor="aboutContent">“关于我”页内容（HTML，保存时消毒）</label>
        <textarea id="aboutContent" name="aboutContent" rows={8} defaultValue={s?.aboutContent ?? ""} />
        <button className="btn mt-4">保存设置</button>
      </form>
    </section>
  );
}
