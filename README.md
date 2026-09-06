# 渭南IT技术服务网站（0913610.xyz）

个人 IT 技术服务站，服务渭南市及临渭区：电脑维修、监控安装与维修、弱电施工、网络布线。

- 前台: apps/web -> https://www.0913610.xyz （Next.js 15 App Router, SSR/ISR, 百度 SEO 友好）
- 后台: apps/admin -> https://admin.0913610.xyz （NextAuth v5, 完全独立部署）
- 数据库: packages/db （Drizzle ORM + Neon PostgreSQL）

## 本地开发

```bash
pnpm install
cp .env.example .env   # 填写 DATABASE_URL 等
pnpm db:migrate        # 执行迁移（packages/db/drizzle/0000_init.sql）
pnpm create-admin admin@0913610.xyz "你的强密码" 管理员
pnpm dev               # web: http://localhost:3000  admin: http://localhost:3001
```

Schema 变更后：`pnpm db:generate` 生成新迁移，再 `pnpm db:migrate`。

## Vercel 部署

1. 在 Neon (https://neon.tech) 创建 PostgreSQL，复制连接串。
2. 本地执行 `pnpm db:migrate` 与 `pnpm create-admin` 初始化数据库和管理员。
3. Vercel 创建两个项目（同一仓库）：
   - **web**: Root Directory = `apps/web`，绑定域名 `www.0913610.xyz`，关闭 Deployment Protection（保证蜘蛛可抓取）。
   - **admin**: Root Directory = `apps/admin`，绑定域名 `admin.0913610.xyz`，建议开启 Vercel Protection。
4. 两项目分别配置 .env.example 中的服务端环境变量（AUTH_SECRET/R2 仅 admin 需要；SITE_URL/REVALIDATE_SECRET 两边都要）。
5. DNS: `www`、`admin` 分别 CNAME 到 Vercel；裸域名 301 到 www 由 apps/web/middleware.ts 处理。

## SEO 自检清单

- `curl -A "Baiduspider" -I https://www.0913610.xyz/` 返回 200（不按 UA 拦截）
- `curl -I -X HEAD https://www.0913610.xyz/` 返回 200
- `/robots.txt` 含 Baiduspider Allow、Disallow /admin/、Sitemap 行
- `/sitemap.xml` 仅含已发布内容，含 lastmod，不含草稿/后台/API
- 草稿文章 URL 返回 404（不是 403）
- `curl -sI http://0913610.xyz` 返回 301 到 https://www.0913610.xyz
- 页面源码正文完整（非空 div）、仅一个 h1、canonical 指向 www 主域
- Vercel Preview 环境源码含 noindex,nofollow；Production 为 index,follow
- admin 域未登录访问任意后台页跳转 /login

## 未实现/可选

- RSS (/rss.xml)：未实现
- 定时发布：未实现（Schema 已预留 published_at）
- 百度主动推送：代码已提供，配置 BAIDU_PUSH_TOKEN 后启用，推送失败不影响发布
