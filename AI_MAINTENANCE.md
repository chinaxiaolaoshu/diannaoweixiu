# AI_MAINTENANCE — 本站建造思路与架构说明（AI/维护者必读）

> 目的：让未来的维护者（人类或 AI 助手）不依赖口头交接即可理解本站**如何建造、为什么这样建、如何安全地继续修改**。
> 含凭据的完整版文档由站长本地保存，本仓库版本不含任何密钥。
> 最后更新：2026-09-10

## 0. 三十秒理解本站

渭南市 IT 上门服务（电脑维修/监控/弱电/网络布线）营销网站。**一个 monorepo、一个 PostgreSQL、两个独立部署的 Next.js 应用**：
- 前台 `apps/web` → https://www.0913610.xyz （SEO 优先，ISR 静态化）
- 后台 `apps/admin` → https://admin.0913610.xyz （NextAuth 登录，Server Actions 写库）
- 共享包 `packages/db`（Drizzle schema + postgres-js 客户端）、`packages/config`（站点文案常量）

## 1. 技术栈

Next.js 15 App Router + React 19 / TypeScript / Tailwind CSS（无组件库）/ Drizzle ORM 0.36 + drizzle-kit / postgres-js 驱动（`prepare:false`）/ NextAuth v5 beta.25（Credentials + bcryptjs + JWT）/ sanitize-html / pinyin-pro / pnpm 9 workspace + Turborepo / Vercel 双项目部署 / Cloudflare DNS（灰云）/ GitHub Actions CI。

数据库为**通用 PostgreSQL**（postgres-js 驱动，不绑定任何供应商 SDK）。2026-09 因 Supabase 平台事故整体迁至 Neon，**只换了 DATABASE_URL 环境变量，代码零改动**——这是刻意保持的供应商无关设计，请勿引入 Supabase/Neon 专属 SDK。

## 2. Monorepo 结构

```
apps/web/    前台（详见 §4 路由地图）
  app/       页面 + robots.ts + sitemap.ts + api/revalidate
  lib/       queries.ts(全部DB查询+safe()容错) / seo.ts(metadata) / actions.ts(留言)
  middleware.ts  裸域301→www + redirects表查询（§7 已知问题2）
apps/admin/  后台
  app/(dashboard)/  登录保护组：articles/categories/tags/media/messages/redirects/settings
  app/api/auth/[...nextauth]/  NextAuth 路由
  app/api/upload/  R2 上传路由
  auth.ts + auth.config.ts  NextAuth（Edge安全分离模式）
  middleware.ts  全站登录拦截
  lib/actions.ts  全部 Server Actions / lib/guard.ts  requireUser 权限
packages/db/ @repo/db：schema.ts(10表) / index.ts(客户端) / drizzle/(迁移SQL) / scripts/(create-admin、seed-articles)
packages/config/ @repo/config：SITE 常量（4 个服务项全文案：symptoms/preparation/quoteFactors/acceptance）
```

两个 app 通过 `"@repo/db": "workspace:*"` 引用共享包；因包是 TS 源码无构建产物，**两个 app 的 next.config.mjs 必须 `transpilePackages: ["@repo/db", "（web还需）@repo/config"]`**，删除会导致构建失败。

## 3. 数据库（packages/db/src/schema.ts）

10 表：users（role: admin|editor）、articles（slug 唯一索引 / status: draft|published / content 存**消毒后 HTML** / SEO 四字段）、categories、tags、article_categories、article_tags（复合主键 cascade）、media、site_settings（单行：站名/默认SEO/百度验证码/统计码/关于页HTML）、redirects（301|302|410 + enabled）、messages（前台留言）。3 枚举：role / article_status / redirect_code。

**变更 schema 的标准流程**：改 schema.ts → `pnpm db:generate` → `pnpm db:migrate`（连生产 DATABASE_URL）。**Vercel 构建不跑迁移**。

## 4. 路由地图

**web**：`/`（首页ISR）`/articles`+`/[slug]`（ISR 3600+generateStaticParams）`/service`+`/[slug]`（静态，数据来自 @repo/config）`/categories/[slug]` `/tags/[slug]` `/search`（动态）`/about` `/contact`（留言Server Action→messages表）`/faq` `/process` `/api/revalidate`（POST+secret→revalidatePath）`robots.ts` `sitemap.ts`（仅已发布）。

**admin**：`/login` → `(dashboard)/`（仪表盘、articles 列表/新建/编辑、categories、tags、media、messages、redirects、settings）。

## 5. 核心机制（修改必读）

### 5.1 发布链路
`saveArticle(actions.ts)` → `requireUser()` → zod 校验 → `processContent()` 正文处理 → drizzle 写库 → `revalidateWeb()` 调 `{SITE_URL}/api/revalidate?secret=REVALIDATE_SECRET` → 前台 revalidatePath 刷新 ISR+sitemap → 可选 baiduPush。**REVALIDATE_SECRET 两项目必须一致**，否则发布后前台不更新。

### 5.2 正文编辑器（2026-09-10 定稿方案）
后台**纯文本输入，每行 = 一个自然段**。`processContent(raw)`：`looksLikeHtml()` 判断内容是否 HTML——是则原样走 sanitize-html 白名单（兼容存量 HTML 文章）；纯文本则 `textToHtml()`：按 `\n` 分行→非空行包 `<p>`→行内 URL 自动转 `<a rel="nofollow">`→先转义 `&<>`。编辑旧文章时 `article-form.tsx htmlToText()` 把 HTML 还原成纯文本。数据库永远只存消毒后的 HTML，前台 `dangerouslySetInnerHTML` 渲染。

### 5.3 拼音 slug
`titleToSlug()`：pinyin-pro 无声调→过滤 a-z0-9-→截断100；`uniqueSlug()` 撞库加 `-2/-3`。slug 留空自动生成。

### 5.4 认证
NextAuth v5 官方分离模式：auth.config.ts（Edge 可用，无 bcrypt/DB，authorized 回调+JWT注入role）+ auth.ts（Credentials+bcrypt+查users）。middleware 全站拦截未登录。**所有 Server Action 必须先 `await requireUser()`**（guard.ts），删数据操作 `requireUser(["admin"])`。Session cookie 不设 domain（仅 admin 子域生效）。

### 5.5 构建容错
web/lib/queries.ts 的 `safe()`：构建期 DB 不可达（CI 占位串/Vercel 首建）返回空数据照样构建成功，上线后 ISR 运行时补真实数据。**因此 CI 与本地验证可用占位 DATABASE_URL**。

## 6. 部署（Vercel + Cloudflare）

- Vercel 同一仓库两个项目，**构建配置是手动覆盖的，勿改回默认**（默认 Next.js 自动检测会用 turbo 同时构建两 app 导致 `/_not-found` TypeError 失败）：

| 项目 | Root Directory | Install Command | Build Command | Output |
|---|---|---|---|---|
| web | `apps/web` | `cd ../.. && pnpm install` | `cd ../.. && pnpm --filter web build` | `.next` |
| admin | `apps/admin` | `cd ../.. && pnpm install` | `cd ../.. && pnpm --filter admin build` | `.next` |

- Cloudflare DNS 全灰云：`@` A `76.76.21.21`；`www`/`admin` CNAME `cname.vercel-dns.com`。裸域→www 301 由 web middleware 处理。
- **web 项目必须关闭 Vercel Deployment Protection**（否则百度蜘蛛 401）。
- 环境变量：web 需 `DATABASE_URL / SITE_URL / REVALIDATE_SECRET / NEXT_PUBLIC_CONTACT_PHONE /（middleware redirects 功能需 SUPABASE_URL+SUPABASE_SERVICE_KEY，见已知问题）`；admin 需 `DATABASE_URL / SITE_URL / REVALIDATE_SECRET / AUTH_SECRET /（可选 R2_* 5项、BAIDU_PUSH_TOKEN）`。对照表见 `.env.example`。
- **注意**：push 到 main 后 Vercel 自动部署目前不触发（Git 集成失效，原因未查）。需 API 手动触发：`POST /v13/deployments?projectId={id}&teamId={team}&skipAutoDetectionConfirmation=1`，body `{"name":"<项目名>","target":"production","gitSource":{"type":"github","repo":"chinaxiaolaoshu/diannaoweixiu","repoId":1358930496,"ref":"main"}}`。⚠️ **name 必须与 Vercel 项目名完全一致，否则会误建空项目且构建失败**（曾发生，误建项目需删除）。

## 7. 已知问题 / 待办

1. **middleware redirects 功能失效**：web/middleware.ts 在 Edge 用 Supabase PostgREST 查 redirects 表（Edge 不能 TCP）。Supabase 已死，env 指向死域静默失败返回空数组。修复思路：改用 Neon HTTP API / Node runtime 中转路由 / Vercel redirects。
2. **Git push 不自动触发 Vercel 部署**：每次需 API 手动触发（见 §6）。根治：Vercel 项目设置重新连接仓库。
3. R2 图片上传未启用（5 个 R2_* 未配置）；百度 push token 未配；微信 env 未配。
4. CSP / X-XSS-Protection 未加（已有 nosniff/DENY/Referrer/Permissions 4 项）。
5. 定时发布、RSS 未实现。
6. 2026-09-08 有一篇手动发布的文章只存在于死掉的 Supabase，未迁入现库（站长可从 Supabase Dashboard 找回补录）。

## 8. 历史：Supabase→Neon 迁移（2026-09）

Supabase 平台事故（API 域 NXDOMAIN / pooler `tenant not found`）致全站宕机。处置：Neon 建库→`pnpm db:migrate` 重建表→create-admin 重建管理员→seed-articles 重种文章→Vercel 两项目换 DATABASE_URL→API 触发重部署。**全程代码零改动**，验证了供应商无关设计的价值。

## 9. 修改上线的标准流程

1. 本地改代码（仓库根路径见站长文档）
2. 占位环境变量本地构建验证：`DATABASE_URL=postgresql://placeholder:... AUTH_SECRET=x pnpm --filter admin build`（Windows PowerShell 用 `$env:` 前缀设置；构建 1-5 分钟正常）
3. `git add <文件> && git commit && git push origin main`（远程领先先 pull --no-rebase 合并）
4. API 触发对应项目部署（改了哪个 app 发哪个；都改了两个都发）
5. 轮询部署状态到 READY，线上验证页面
6. Windows 注意：PowerShell 内联多行 JS 模板字符串反引号会被吞——**涉及脚本一律写成 .js 文件再 node 执行**；`$pid` 是保留变量

## 10. SEO 基建（改动勿破坏）

robots 允许 Baiduspider / sitemap 仅含已发布+服务页 / 全站 canonical 到 www / 裸域 301 / Vercel Preview 自动 noindex / 草稿返回 404 非 403 / 百度验证文件 `apps/web/public/baidu_verify_codeva-iwIIj80gC9.html` 勿删 / JSON-LD（Service+FAQ+Breadcrumb+Article+WebPage）/ 安全响应头 4 项（web/next.config.mjs）/ 服务页与文章页互链。

## 11. 从零重建顺序（浓缩版）

monorepo 骨架（pnpm-workspace+turbo）→ packages/config 写文案 → packages/db 建 schema+generate+migrate → apps/web（首页/服务页读常量/文章 ISR/revalidate 路由/robots+sitemap/middleware 301/安全头）→ apps/admin（NextAuth 分离配置/登录拦截/CRUD+Server Actions requireUser+zod+sanitize）→ 建生产库并 migrate+create-admin+seed → Vercel 双项目（**手动覆盖三构建配置+env+绑域名+关 web Protection**）→ Cloudflare DNS 三记录灰云 → 百度验证+提交 → CI workflow。
