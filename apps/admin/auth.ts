import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users } from "@repo/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = String(creds?.email ?? "").trim();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;
        const [u] = await db.select().from(users).where(eq(users.email, email));
        if (!u) return null;
        const ok = await compare(password, u.passwordHash); // bcrypt 哈希比对
        if (!ok) return null;
        return { id: String(u.id), email: u.email, name: u.name, role: u.role };
      },
    }),
  ],
});
