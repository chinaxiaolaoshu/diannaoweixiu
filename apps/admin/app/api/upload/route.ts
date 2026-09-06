import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import imageSize from "image-size";
import { db, media } from "@repo/db";
import { auth } from "@/auth";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  // 服务端验证登录
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "").slice(0, 255);
  if (!(file instanceof File)) return new Response("缺少文件", { status: 400 });
  if (!ALLOWED.includes(file.type)) return new Response("仅允许 jpg/png/webp", { status: 400 });
  if (file.size > MAX_SIZE) return new Response("文件超过 5MB", { status: 400 });
  if (!alt) return new Response("请填写 alt 文本（建议包含渭南/临渭区或业务词）", { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const dim = imageSize(buf);
  const ext = file.type.split("/")[1];
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buf,
    ContentType: file.type,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  const url = `${process.env.R2_PUBLIC_URL}/${key}`; // 稳定 URL
  const [row] = await db.insert(media).values({
    url, alt, width: dim.width ?? 0, height: dim.height ?? 0,
  }).returning();
  return Response.json(row);
}
