import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-16 text-center">
      <h1 className="text-3xl font-bold">404 页面不存在</h1>
      <p className="mt-3 text-gray-600">您访问的页面不存在或已删除。</p>
      <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline">返回首页</Link>
    </section>
  );
}
