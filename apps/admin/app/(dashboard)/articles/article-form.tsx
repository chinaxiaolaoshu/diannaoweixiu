import { db, categories, tags, articleCategories, articleTags } from "@repo/db";
import { eq } from "drizzle-orm";
import { saveArticle } from "@/lib/actions";

type ArticleRow = {
  id: number; title: string; slug: string; excerpt: string | null; content: string;
  coverImage: string | null; status: "draft" | "published"; seoTitle: string | null;
  seoDescription: string | null; canonicalUrl: string | null; noindex: boolean;
};

// 编辑旧文章时，把已存的 HTML 正文还原成可读纯文本（每段一行），方便继续用纯文本方式编辑
function htmlToText(html: string): string {
  return html
    .replace(/<(p|div|h2|h3|li|figcaption)[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+|\n+$/g, "");
}

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
      <label htmlFor="slug">Slug（留空自动按标题拼音生成，如 weinan-diannao-weixiu）</label>
      <input id="slug" type="text" name="slug" pattern="[a-z0-9-]*" defaultValue={article?.slug} placeholder="留空自动生成" />
      <label htmlFor="excerpt">摘要</label>
      <textarea id="excerpt" name="excerpt" rows={2} defaultValue={article?.excerpt ?? ""} />
      <label htmlFor="content">正文（每行一段，回车即可分段，无需任何代码）</label>
      <textarea id="content" name="content" rows={14} required wrap="soft"
        className="leading-relaxed"
        placeholder={"示例：\n渭南电脑维修上门服务覆盖临渭区、高新区。\n\n我们提供系统重装、硬件检测、数据恢复等服务。\n\n第三段内容……"}
        defaultValue={article ? htmlToText(article.content) : ""} />
      <p className="text-xs text-gray-400 mt-1">提示：一行文字 = 一个自然段，空一行也可以；保存后自动生成排版好的正文。</p>
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
