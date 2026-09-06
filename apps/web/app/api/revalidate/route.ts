import { revalidatePath } from "next/cache";

// 后台发布/更新文章时调用，刷新 ISR 缓存与 sitemap
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.REVALIDATE_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const path = searchParams.get("path") ?? "/";
  revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/sitemap.xml");
  return Response.json({ revalidated: true, path });
}
