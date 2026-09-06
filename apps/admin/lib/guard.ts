import { auth } from "@/auth";

export type Role = "admin" | "editor";

// 所有写操作必须调用：服务端验证登录与角色，不依赖前端隐藏按钮
export async function requireUser(roles: Role[] = ["admin", "editor"]) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: Role; email?: string } | undefined;
  if (!user?.role || !roles.includes(user.role)) {
    throw new Error("FORBIDDEN: 无权限执行此操作");
  }
  return { id: Number(user.id), role: user.role, email: user.email ?? "" };
}
