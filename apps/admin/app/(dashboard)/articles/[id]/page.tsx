import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, articles } from "@repo/db";
import ArticleForm from "../article-form";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.id, Number(id)));
  if (!article) notFound();
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">编辑文章</h1>
      <ArticleForm article={article} />
    </section>
  );
}
