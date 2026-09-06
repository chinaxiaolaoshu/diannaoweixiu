import "dotenv/config";
import { hash } from "bcryptjs";
import { db, users } from "../src";

// 用法: pnpm create-admin <email> <password> [name]
// 密码使用 bcrypt 哈希存储，不在代码中硬编码任何默认账号。
const [email, password, name] = process.argv.slice(2);

if (!email || !password) {
  console.error("用法: pnpm create-admin <email> <password> [name]");
  process.exit(1);
}
if (password.length < 10) {
  console.error("密码至少 10 位");
  process.exit(1);
}

const passwordHash = await hash(password, 12);
await db.insert(users).values({ email, passwordHash, name: name ?? "管理员", role: "admin" });
console.log("管理员创建成功:", email);
