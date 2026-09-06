import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// 仅在服务端使用。DATABASE_URL 为服务端环境变量，严禁 NEXT_PUBLIC_ 前缀。
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export * from "./schema";
