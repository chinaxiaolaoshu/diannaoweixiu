import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 仅在服务端使用。DATABASE_URL 为服务端环境变量，严禁 NEXT_PUBLIC_ 前缀。
// 通用 PostgreSQL 驱动（postgres-js），兼容 Supabase / Neon / 任意 PG。
// Next.js 会在构建阶段预渲染并分析认证路由，此时可能还没有注入运行时环境变量。
// postgres-js 会在真正执行查询时才建立连接，因此使用仅用于构建阶段的占位地址，
// 避免模块导入时因 DATABASE_URL 未定义而直接触发服务器 500。
const url = process.env.DATABASE_URL ?? "postgres://build:build@localhost:5432/build";
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
