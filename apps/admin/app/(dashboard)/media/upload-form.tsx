"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      setMsg("上传成功");
      (e.target as HTMLFormElement).reset?.();
      router.refresh();
    } else {
      setMsg(await res.text());
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded p-4 max-w-md mb-6">
      <label htmlFor="file">图片（jpg/png/webp，≤ 5MB）</label>
      <input id="file" type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
      <label htmlFor="alt">Alt 文本（建议自然包含“渭南”“临渭区”或业务词）</label>
      <input id="alt" type="text" name="alt" required maxLength={255} />
      <button disabled={busy} className="btn mt-3">{busy ? "上传中..." : "上传"}</button>
      {msg && <p className="text-sm mt-2">{msg}</p>}
    </form>
  );
}
