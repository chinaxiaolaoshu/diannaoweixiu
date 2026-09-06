"use server";

import { z } from "zod";
import { db, messages } from "@repo/db";

const schema = z.object({
  name: z.string().min(1, "请填写称呼").max(100),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效手机号"),
  content: z.string().min(5, "需求描述至少 5 个字").max(2000),
});

export type MessageState = { ok?: boolean; error?: string } | null;

export async function submitMessage(_prev: MessageState, formData: FormData): Promise<MessageState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.insert(messages).values(parsed.data);
  return { ok: true };
}
