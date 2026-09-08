import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 仅在服务端使用。DATABASE_URL 为服务端环境变量，严禁 NEXT_PUBLIC_ 前缀。
// 通用 PostgreSQL 驱动（postgres-js），兼容 Supabase / Neon / 任意 PG。
const url = process.env.DATABASE_URL!;
const client = postgres(url, {
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: url.includes("localhost") ? false : "require",
  // Supabase Transaction Pooler (6543) 不支持预编译语句，必须关闭
  prepare: false,
});
export const db = drizzle(client, { schema });
export * from "./schema";
