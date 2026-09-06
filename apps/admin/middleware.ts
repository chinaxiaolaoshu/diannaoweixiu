import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 后台全站需登录（authorized 回调），未登录跳转 /login
export default NextAuth(authConfig).auth;

export const config = { matcher: ["/((?!api/auth|_next|favicon.ico).*)"] };
