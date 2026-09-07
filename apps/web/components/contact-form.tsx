"use client";

import { useActionState } from "react";
import { submitMessage, type MessageState } from "@/lib/actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState<MessageState, FormData>(submitMessage, null);
  return (
    <form action={action} className="space-y-3 max-w-md">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">您的称呼</label>
        <input id="contact-name" name="name" required maxLength={100} placeholder="例如：张先生" className="w-full border rounded p-2 min-h-[44px]" />
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
        <input id="contact-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" required maxLength={11} placeholder="11位手机号" className="w-full border rounded p-2 min-h-[44px]" />
      </div>
      <div>
        <label htmlFor="contact-content" className="block text-sm font-medium text-gray-700 mb-1">需求描述</label>
        <textarea id="contact-content" name="content" required rows={4} maxLength={2000} placeholder="如：临渭区上门修电脑 / 监控安装报价" className="w-full border rounded p-2 min-h-[88px]" />
      </div>
      <button disabled={pending} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium min-h-[44px] disabled:opacity-50 w-full sm:w-auto">
        {pending ? "提交中..." : "提交留言"}
      </button>
      {state?.error && <p className="text-red-600 text-sm" role="alert">{state.error}</p>}
      {state?.ok && <p className="text-green-600 text-sm" role="status">提交成功，我会尽快联系您。</p>}
    </form>
  );
}
