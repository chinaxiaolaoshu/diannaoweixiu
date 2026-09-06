import { db, categories, tags, articleCategories, articleTags } from "@repo/db";
import { eq } from "drizzle-orm";
import { saveArticle } from "@/lib/actions";

type ArticleRow = {
  id: number; title: string; slug: string; excerpt: string | null; content: string;
  coverImage: string | null; status: "draft" | "published"; seoTitle: string | null;
  seoDescription: string | null; canonicalUrl: string | null; noindex: boolean;
};

export default async function ArticleForm({ article }: { article?: ArticleRow }) {
  const [cats, tgs] = await Promise.all([db.select().from(categories), db.select().from(tags)]);
  const selectedCats = article
    ? (await db.select().from(articleCategories).where(eq(articleCategories.articleId, article.id))).map((r) => r.categoryId)
    : [];
  const selectedTags = article
    ? (await db.select().from(articleTags).where(eq(articleTags.articleId, article.id))).map((r) => r.tagId)
    : [];
  return (
    <form action={saveArticle} className="bg-white border rounded p-6 max-w-3xl">
      {article && <input type="hidden" name="id" value={article.id} />}
      <label htmlFor="title">标题</label>
      <input id="title" type="text" name="title" required defaultValue={article?.title} />
      <label htmlFor="slug">Slug（小写字母/数字/短横线）</label>
      <input id="slug" type="text" name="slug" required pattern="[a-z0-9-]+" defaultValue={article?.slug} />
      <label htmlFor="excerpt">摘要</label>
      <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ""} />
      <label htmlFor="content">正文（HTML，保存时服务端白名单消毒）</label>
      <textarea id="content" name="content" rows={14} required defaultValue={article?.content} />
      <label htmlFor="coverImage">封面图 URL（可在媒体管理上传后复制）</label>
      <input id="coverImage" type="url" name="coverImage" defaultValue={article?.coverImage ?? ""} />

      <fieldset className="mt-4">
        <legend className="text-sm font-medium">分类</legend>
        <div className="flex flex-wrap gap-3 mt-1 text-sm">
          {cats.map((c) => (
            <label key={c.id} className="inline-flex items-center gap-1 mt-0">
              <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={selectedCats.includes(c.id)} />{c.name}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-3">
        <legend className="text-sm font-medium">标签</legend>
        <div className="flex flex-wrap gap-3 mt-1 text-sm">
          {tgs.map((t) => (
            <label key={t.id} className="inline-flex items-center gap-1 mt-0">
              <input type="checkbox" name="tagIds" value={t.id} defaultChecked={selectedTags.includes(t.id)} />{t.name}
            </label>
          ))}
        </div>
      </fieldset>

      <h2 className="font-bold mt-6">SEO 设置</h2>
      <label htmlFor="seoTitle">SEO 标题（留空用文章标题）</label>
      <input id="seoTitle" type="text" name="seoTitle" defaultValue={article?.seoTitle ?? ""} />
      <label htmlFor="seoDescription">SEO 描述（留空用摘要）</label>
      <textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={article?.seoDescription ?? ""} />
      <label htmlFor="canonicalUrl">Canonical URL（留空自动生成）</label>
      <input id="canonicalUrl" type="url" name="canonicalUrl" defaultValue={article?.canonicalUrl ?? ""} />
      <label className="inline-flex items-center gap-2 mt-3">
        <input type="checkbox" name="noindex" defaultChecked={article?.noindex} /> noindex（不让搜索引擎收录）
      </label>

      <label htmlFor="status">状态</label>
      <select id="status" name="status" defaultValue={article?.status ?? "draft"}>
        <option value="draft">草稿</option>
        <option value="published">发布</option>
      </select>

      <button className="btn mt-6">保存</button>
    </form>
  );
}
