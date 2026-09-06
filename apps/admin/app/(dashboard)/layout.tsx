import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

const NAV = [
  { href: "/", label: "仪表盘" },
  { href: "/articles", label: "文章管理" },
  { href: "/categories", label: "分类管理" },
  { href: "/tags", label: "标签管理" },
  { href: "/media", label: "媒体管理" },
  { href: "/messages", label: "留言管理" },
  { href: "/redirects", label: "301重定向" },
  { href: "/settings", label: "网站设置" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 双重保险：middleware 之外，服务端再验证一次
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="flex min-h-screen">
      <aside className="w-48 border-r bg-white p-4">
        <p className="font-bold mb-4">管理后台</p>
        <nav className="space-y-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="block hover:text-blue-600">{n.label}</Link>
          ))}
        </nav>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }} className="mt-8">
          <button className="text-sm text-red-600">退出登录（{session.user.name}）</button>
        </form>
      </aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
