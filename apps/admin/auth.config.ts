import type { NextAuthConfig } from "next-auth";

// Edge 安全配置（不引入 bcrypt/数据库），供 middleware 使用
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  // Cookie 不设 domain：默认仅限 admin.0913610.xyz，不为全域 .0913610.xyz
  cookies: {
    sessionToken: { options: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" } },
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLogin = request.nextUrl.pathname.startsWith("/login");
      if (isLogin) return true;
      return !!auth?.user; // 未登录自动跳转 /login
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.uid = (user as { id?: string }).id;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as unknown as Record<string, unknown>).role = token.role;
      (session.user as unknown as Record<string, unknown>).id = token.uid;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
