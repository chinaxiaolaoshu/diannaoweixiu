import { db, siteSettings } from "@repo/db";
import { updateSettings } from "@/lib/actions";

export default async function SettingsPage() {
  const [s] = await db.select().from(siteSettings).limit(1);
  return (
    <section>
      <h1 className="text-xl font-bold mb-6">网站设置</h1>

      <form action={updateSettings} className="space-y-8">
        {/* 基础信息 */}
        <fieldset className="bg-white border rounded p-6">
          <legend className="font-bold px-2">基础信息</legend>
          <div className="space-y-3">
            <div>
              <label htmlFor="siteName">站点名称 <span className="text-red-600">*</span></label>
              <input id="siteName" type="text" name="siteName" required defaultValue={s?.siteName ?? "渭南IT技术服务"} />
            </div>
            <div>
              <label htmlFor="siteUrl">站点 URL（canonical 主域） <span className="text-red-600">*</span></label>
              <input id="siteUrl" type="url" name="siteUrl" required defaultValue={s?.siteUrl ?? "https://www.0913610.xyz"} />
            </div>
            <div>
              <label htmlFor="defaultSeoTitle">默认 SEO 标题（留空自动用"站名_渭南电脑维修_监控安装"）</label>
              <input id="defaultSeoTitle" type="text" name="defaultSeoTitle" defaultValue={s?.defaultSeoTitle ?? ""} />
            </div>
            <div>
              <label htmlFor="defaultSeoDescription">默认 SEO 描述（建议含"服务渭南市及临渭区"）</label>
              <textarea id="defaultSeoDescription" name="defaultSeoDescription" rows={2} defaultValue={s?.defaultSeoDescription ?? ""} />
            </div>
            <div>
              <label htmlFor="defaultOgImage">默认 OG 图 URL</label>
              <input id="defaultOgImage" type="url" name="defaultOgImage" defaultValue={s?.defaultOgImage ?? ""} />
            </div>
          </div>
        </fieldset>

        {/* 联系方式：NAP 一致性核心，改完全站同步 */}
        <fieldset className="bg-white border rounded p-6">
          <legend className="font-bold px-2">联系方式（全站同步）</legend>
          <p className="text-xs text-gray-500 mb-3">电话/微信/营业时间会同步到页脚、关于页、联系页与 LocalBusiness 结构化数据，保存后即时生效。</p>
          <div className="space-y-3">
            <div>
              <label htmlFor="phone">联系电话 <span className="text-red-600">*</span>（11 位手机号或带区号固话）</label>
              <input id="phone" type="tel" name="phone" required pattern="^[0-9+\-\s]+$" placeholder="15609186302" defaultValue={s?.phone ?? ""} />
            </div>
            <div>
              <label htmlFor="wechat">微信号（可留空）</label>
              <input id="wechat" type="text" name="wechat" defaultValue={s?.wechat ?? ""} />
            </div>
            <div>
              <label htmlFor="openingHours">营业时间 <span className="text-red-600">*</span>（用于 JSON-LD 与页脚展示）</label>
              <input id="openingHours" type="text" name="openingHours" required placeholder="周一至周日 08:00 – 21:00" defaultValue={s?.openingHours ?? ""} />
            </div>
            <div>
              <label htmlFor="priceRange">价格区间 <span className="text-red-600">*</span>（LocalBusiness 结构化数据）</label>
              <input id="priceRange" type="text" name="priceRange" required placeholder="50-500元" defaultValue={s?.priceRange ?? ""} />
            </div>
          </div>
        </fieldset>

        {/* SEO 爬虫友好设置 */}
        <fieldset className="bg-white border rounded p-6">
          <legend className="font-bold px-2">SEO 爬虫设置</legend>
          <p className="text-xs text-gray-500 mb-3">关键词布局、服务区域描述与 robots 自定义规则，自动写入前台 meta 与 robots.txt。</p>
          <div className="space-y-3">
            <div>
              <label htmlFor="seoKeywords">全站关键词（英文逗号分隔，写入首页 keywords）</label>
              <textarea id="seoKeywords" name="seoKeywords" rows={2} placeholder="渭南电脑维修,渭南上门修电脑,渭南监控安装" defaultValue={s?.seoKeywords ?? ""} />
            </div>
            <div>
              <label htmlFor="serviceAreaDesc">服务区域描述（写入首页与 LocalBusiness）</label>
              <textarea id="serviceAreaDesc" name="serviceAreaDesc" rows={2} defaultValue={s?.serviceAreaDesc ?? ""} />
            </div>
            <div>
              <label htmlFor="robotsExtra">robots 自定义禁抓路径（每行一条，须以 / 开头）</label>
              <textarea id="robotsExtra" name="robotsExtra" rows={3} placeholder={"/search&#10;/articles?page="} defaultValue={s?.robotsExtra ?? ""} />
            </div>
          </div>
        </fieldset>

        {/* 搜索引擎对接 */}
        <fieldset className="bg-white border rounded p-6">
          <legend className="font-bold px-2">搜索引擎对接</legend>
          <div className="space-y-3">
            <div>
              <label htmlFor="baiduVerificationCode">百度站长验证码（content 值）</label>
              <input id="baiduVerificationCode" type="text" name="baiduVerificationCode" defaultValue={s?.baiduVerificationCode ?? ""} />
            </div>
            <div>
              <label htmlFor="baiduTongjiCode">百度统计代码（可选，仅生产环境输出）</label>
              <textarea id="baiduTongjiCode" name="baiduTongjiCode" rows={3} defaultValue={s?.baiduTongjiCode ?? ""} />
            </div>
          </div>
        </fieldset>

        {/* 关于页 */}
        <fieldset className="bg-white border rounded p-6">
          <legend className="font-bold px-2">关于页内容</legend>
          <label htmlFor="aboutContent">"关于我"页内容（HTML，保存时自动消毒）</label>
          <textarea id="aboutContent" name="aboutContent" rows={8} defaultValue={s?.aboutContent ?? ""} />
        </fieldset>

        <div className="sticky bottom-4">
          <button className="btn w-full sm:w-auto">保存全部设置</button>
        </div>
      </form>
    </section>
  );
}
