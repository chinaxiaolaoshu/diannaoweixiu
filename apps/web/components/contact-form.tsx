"use client";

import { useActionState } from "react";
import { submitMessage, type MessageState } from "@/lib/actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState<MessageState, FormData>(submitMessage, null);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <input name="name" required maxLength={100} placeholder="您的称呼" className="w-full border rounded p-2" />
      <input name="phone" required maxLength={11} placeholder="联系电话" className="w-full border rounded p-2" />
      <textarea name="content" required rows={4} maxLength={2000} placeholder="需求描述（如：临渭区上门修电脑 / 监控安装报价）" className="w-full border rounded p-2" />
      <button disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50">
        {pending ? "提交中..." : "提交留言"}
      </button>
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      {state?.ok && <p className="text-green-600 text-sm">提交成功，我会尽快联系您。</p>}
    </form>
  );
}
