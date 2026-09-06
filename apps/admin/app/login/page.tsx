import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";

async function login(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (e) {
    if (e instanceof AuthError) redirect("/login?error=1");
    throw e;
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await auth();
  if (session?.user) redirect("/");
  const { error } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form action={login} className="bg-white border rounded p-6 w-full max-w-sm">
        <h1 className="text-xl font-bold">管理后台登录</h1>
        {error && <p className="text-red-600 text-sm mt-2">邮箱或密码错误</p>}
        <label htmlFor="email">邮箱</label>
        <input id="email" name="email" type="email" required autoComplete="username" />
        <label htmlFor="password">密码</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" />
        <button className="btn w-full mt-4">登录</button>
      </form>
    </main>
  );
}
