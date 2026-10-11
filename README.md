# 滤清器代理企业官网 · Authorized FILTERSUN Distributor Website

面向 **富滤盛（FILTERSUN）授权代理** 的中英双语企业官网。纯静态输出，
可部署到 **腾讯云 EdgeOne**（香港节点）或 **Cloudflare Pages**，已内置 GitHub 自动同步与部署。

**全站白色系设计** · 中英双语 · 7,878 个静态页面 · 4,821 个件号在线查询

---

## 目录

1. [快速开始](#1-快速开始)
2. [★ 上线前必改：一个文件搞定](#2-上线前必改一个文件搞定)
3. [站点结构与规模](#3-站点结构与规模)
4. [★ 产品数据：抓取、自动同步与跟踪厂家更新](#4-产品数据抓取自动同步与跟踪厂家更新)
5. [★ 自动部署（GitHub → EdgeOne / Cloudflare）](#5-自动部署github--edgeone--cloudflare)
6. [表单接入](#6-表单接入)
7. [部署细节与缓存策略](#7-部署细节与缓存策略)
8. [上线后 SEO 检查清单](#8-上线后-seo-检查清单)
9. [素材与版权说明](#9-素材与版权说明)
10. [常见问题排查](#10-常见问题排查)

---

## 1. 快速开始

环境要求：**Node.js ≥ 20**（推荐 22），包管理器 **pnpm**。

```bash
pnpm install        # 安装依赖
pnpm dev            # 本地开发，默认 http://localhost:4321
pnpm build          # 构建到 dist/（约 3 分钟，生成 7,878 个页面）
pnpm preview        # 本地预览构建结果
```

> 构建时间主要花在近 7,600 个件号详情页上，属正常现象。

### 全部命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` / `build` / `preview` | 开发 / 构建 / 预览 |
| `pnpm sync` | **一键同步厂家目录**：抓取 → 对比 → 下载新图 → 压缩 → 出报告 |
| `pnpm sync:dry` | 只抓取并对比，不改动任何文件（先看看有没有更新） |
| `pnpm crawl` | 只抓取件号目录（每分类最多 200 页） |
| `pnpm assets` | 下载企业素材 + 产品图到 `public/`（已存在自动跳过） |
| `pnpm media` | 压缩 `public/media` 与 `public/catalog` 图片 |
| `pnpm brand` | 重新生成 favicon / Logo / OG 分享图 |
| `pnpm report` | 产品数据体检报告（分类覆盖、缺图率、翻译缺失） |
| `pnpm shot` | 基于 CDP 的截图与布局诊断工具 |

---

## 2. ★ 上线前必改：一个文件搞定

**所有会变的信息都集中在根目录的 [`site.config.mjs`](./site.config.mjs)**，改完 `pnpm build` 即全站生效。

已为你填好广州分公司信息，请核对后替换仍需确认的项：

```js
export const siteConfig = {
  url: 'https://www.你的域名.com',                // [必改] 正式域名

  brand: {
    legalNameZh: '你的公司全称',                  // [必改]
    shortNameZh: '你的品牌简称',                  // [必改] 页头 Logo
    shortNameEn: 'YOURBRAND',                    // [必改] 英文站 Logo
    legalNameEn: 'Your Company Co., Ltd.',
  },

  contact: {
    salesPhone: '139 2641 0788',                 // ✔ 已填（手机）
    landline:   '020-82199699',                  // ✔ 已填（座机）
    wechatId:   '13926410788',                   // ⚠ 默认取手机号，请改成实际微信号
    whatsapp:   '8613926410788',                 // ⚠ 由手机号推导，请核对
    email:      'sales@example.com',             // [必改] 替换成真实邮箱
    addressZh:  '广州市天河区珠吉路科珠工程机械市场 B09-10',   // ✔ 已填
    geo: { lat: 23.1353, lng: 113.4127 },        // ⚠ 大致坐标，请用高德拾取实际值
  },

  forms:      { endpoint: '' },                  // 见「表单接入」
  compliance: { icpZh: '' },                     // 香港节点免备案；国内节点需填写
  verification: { google: '', bing: '', baidu: '' },

  // 件号详情页生成策略，见第 4 章
  productPagePolicy: 'complete',
}
```

### 还需要替换的图片

| 文件 | 说明 |
| --- | --- |
| `public/brand/wechat-qr.png` | **★ 当前是占位二维码，必须换成你的真实微信二维码** |
| `public/brand/logo.svg` | 品牌横版 Logo |
| `public/favicon.svg`、`favicon.ico`、`brand/apple-touch-icon.png` | 站点图标 |
| `public/brand/og-default.jpg` | 社交分享封面（1200×630） |

> Logo 图形是自绘的「六边形 + 滤材褶皱」标记，改 [`Logo.astro`](./src/components/Logo.astro)
> 里的 `<svg>` 即可换成你自己的标识。

---

## 3. 站点结构与规模

```
├─ site.config.mjs          ★ 唯一配置文件
├─ edgeone.json             腾讯云 EdgeOne 部署配置
├─ functions/api/inquiry.js EdgeOne 边缘函数（接收询价表单）
├─ .github/workflows/
│   └─ sync-catalog.yml     ★ 定时同步厂家件号目录
├─ scripts/
│   ├─ crawl-catalog.mjs    抓取厂家件号目录
│   ├─ sync-catalog.mjs     ★ 一键同步（抓取+对比+下图+压缩+报告）
│   ├─ fetch-assets.mjs     下载素材与产品图（增量）
│   ├─ optimize-media.mjs   压缩图片并同步图片映射表
│   ├─ gen-brand-assets.mjs 生成 Logo / OG / favicon
│   ├─ catalog-report.mjs   数据体检报告
│   └─ shot.mjs             CDP 截图与布局诊断
├─ src/
│   ├─ pages/               路由（中文在根，英文在 /en/）
│   ├─ components/          组件（14 个页面主体 + 通用组件）
│   ├─ data/                产品数据、大类、应用领域、内容文案
│   ├─ i18n/                界面文案字典
│   ├─ lib/                 SEO 与结构化数据
│   └─ styles/global.css    设计系统（Tailwind v4 令牌）
└─ public/
    ├─ catalog/             产品图（1,401 张，15 MB）
    ├─ media/               企业照片、证书（5.4 MB）
    └─ brand/               Logo / OG / 二维码
```

### 规模

| 项目 | 数量 |
| --- | --- |
| 件号总数 | **4,821** |
| 有实物图 | 1,414 |
| 有规格尺寸 | 3,545 |
| 生成详情页的件号 | 3,899（策略 `complete`） |
| **静态页面总数** | **7,878** |
| 其中中文件号页 / 英文件号页 | 3,793 / 3,793 |
| 产品大类 / 细分品类 | 8 / 49 |
| 应用领域落地页 | 18 |
| 原创技术文章 | 6 |

### 主要 URL

| 中文 | 英文 |
| --- | --- |
| `/` | `/en/` |
| `/products/`、`/products/construction/` | `/en/products/`、`/en/products/construction/` |
| `/p/FS641A/` | `/en/p/FS641A/` |
| `/search/?q=FS6` | `/en/search/?q=FS6` |
| `/applications/excavator/` | `/en/applications/excavator/` |
| `/service/`、`/quality/`、`/about/`、`/contact/`、`/faq/`、`/news/`、`/sitemap/` | 加 `/en` 前缀 |

---

## 4. ★ 产品数据：抓取、自动同步与跟踪厂家更新

### 4.1 数据来源与抓取规则

数据来自富滤盛官网「件号查询」列表页，抓取脚本**只读公开页面**，串行 + 延迟，不会给对方服务器压力。
抓到的是**件号 + 规格尺寸 + 产品品类 + 实物图**四要素。

> ⚠️ 关键实现细节：厂家列表页是**按子分类顺序**排列的。如果只抓父分类
> （如 `catid=90` 工程机械滤清器，共 113 页），前十几页会全是「空气滤芯」。
> 因此 [`crawl-catalog.mjs`](./scripts/crawl-catalog.mjs) 直接抓**叶子分类**（57 个），
> 既覆盖均匀，也让官网能生成真实的细分品类页。

### 4.2 一键同步（日常只需要这一条命令）

```bash
pnpm sync
```

它会依次完成：

1. 备份当前数据到 `src/data/.products.backup.json`
2. 重新抓取全部件号
3. **与旧数据对比**，打印 新增 / 删除 / 规格变更 / 品类变更 / 新增实物图 明细
4. 下载**新增**的产品图（已存在的自动跳过，不会重复下载）
5. 压缩图片并同步更新 `src/data/catalog-images.json`
6. 写同步记录到 `src/data/sync-report.json`

**安全阀**：如果本次抓取数量比上次少 20% 以上，脚本判定为「厂家站点异常」，
自动回滚到备份数据并以退出码 2 结束，**绝不会把线上目录清空**。
确认厂家确实下架了大量产品时，可加 `--force` 强制接受。

想先看看有没有更新、不改动文件：

```bash
pnpm sync:dry
```

### 4.3 自动跟踪厂家更新（GitHub Actions，已配置）

[`.github/workflows/sync-catalog.yml`](./.github/workflows/sync-catalog.yml) 会：

- **每周一 03:00（北京时间）** 自动执行一次 `pnpm sync`
- 跑一次 `pnpm build` 确认站点仍能构建
- 有变更就自动 commit + push → **自动触发 EdgeOne / Cloudflare Pages 重新部署**
- 结果写入 GitHub Actions 的 Summary，方便查看本次同步了什么

也可以在 GitHub 仓库页面 → **Actions** → 「同步厂家件号目录」→ **Run workflow** 手动触发，
并可临时指定抓取页数或强制接受骤降结果。

> 想改成每天同步？把 workflow 里的 `cron: '0 19 * * 0'` 改成 `'0 19 * * *'` 即可。

### 4.4 件号详情页的生成策略

4,821 个件号里，有 922 个连规格和图片都没有（厂家只有一行件号）。
全部生成详情页会产生大量「薄内容页」，对 SEO 反而有害。

在 `site.config.mjs` 里控制：

```js
productPagePolicy: 'complete'   // 默认：有图 或 有规格 才生成详情页
// 'withImage' —— 只有带实物图的件号生成（页面最少）
// 'all'       —— 全部生成（注意部署平台的单次部署文件数上限）
```

> **未生成详情页的件号不会丢失**：它们依然完整地存在于
> 「件号查询」数据库和大类清单表里，客户搜索、筛选、询价都不受影响，
> 只是列表里显示「询价」而不是「查看详情」。

### 4.5 各类件号数量分布

| 大类 | 件号数 | 品类数 | 缺图 |
| --- | --- | --- | --- |
| construction 工程机械 | 2,548 | 16 | 1,816 |
| truck 商用车 | 1,075 | 5 | 1,075 |
| compressor 空压机 | 474 | 5 | 265 |
| separator 油水分离与配件 | 324 | 9 | 58 |
| genset 发电机与农机 | 207 | 4 | 63 |
| hydraulic 液压油滤芯 | 98 | 5 | 83 |
| industrial 工业与精密 | 68 | 5 | 30 |
| purifier 净化与新风 | 27 | 5 | 17 |

> 缺图是**厂家源站本身就没有图**（约 70%）。没有图的件号会自动回退到带品类图标的
> 占位卡，不会出现破图。以后厂家补了图，`pnpm sync` 会自动抓回来。

### 4.6 想增删分类 / 手工维护件号

- 增删抓取分类：编辑 [`scripts/crawl-catalog.mjs`](./scripts/crawl-catalog.mjs) 顶部的 `CATEGORIES`
- 调整大类定义与中英对照：[`src/data/groups.mjs`](./src/data/groups.mjs)
- 手工追加件号：[`src/data/products.mjs`](./src/data/products.mjs) 的 `products` 之后追加即可

---

## 5. ★ 自动部署（GitHub → EdgeOne / Cloudflare）

仓库：`https://github.com/kalichen88/lvqingqii-guanwang.git`（默认分支 `main`）

你的 GitHub 已绑定腾讯云 EdgeOne 与 Cloudflare Pages，因此**推送代码即自动构建部署**，
不需要额外写部署工作流。

### 5.1 两个平台都需要确认的构建设置

| 配置项 | 值 |
| --- | --- |
| 安装命令 | `pnpm install --frozen-lockfile` |
| 构建命令 | `pnpm build` |
| 输出目录 | `dist` |
| Node 版本 | `22`（Astro 7 要求 ≥ 20） |

### 5.2 Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择 `lvqingqii-guanwang` 仓库，分支 `main`
3. Framework preset 选 **Astro**（没有就选 None，手填上表命令）
4. 环境变量可选加 `NODE_VERSION = 22`
5. Save and Deploy

> **文件数提醒**：Cloudflare Pages 免费版单次部署上限 **20,000 个文件**。
> 当前构建约 **8,800 个文件**，在限额内。如果以后把 `productPagePolicy` 改成 `'all'`
> （会变成约 10,000 页 / 17,000 文件）请留意接近上限。

### 5.3 腾讯云 EdgeOne Pages（香港节点）

1. [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone) → **Pages** → **新建项目** → **导入 Git 仓库**
2. 选择同一仓库，框架预设选 **Astro**（或自定义）
3. 构建配置会被仓库里的 [`edgeone.json`](./edgeone.json) 自动覆盖，通常无需手填
4. **加速区域选「全球（不含中国大陆）」** —— 香港/海外节点**无需 ICP 备案**，海外访问快
5. 绑定自定义域名：项目 → 域名管理 → 添加域名 → 到 DNS 服务商加 CNAME → 自动签发免费 HTTPS

> ⚠️ EdgeOne「直接上传」方式**不会执行 `functions/api/inquiry.js`**。
> 要用边缘函数收表单，请走 Git 部署，或改用第 6 章的方案 A / C。

### 5.4 中国大陆节点提示

如果之后要加 **中国大陆** 加速区域，域名必须完成 **ICP 备案**（腾讯云备案系统，约 7–20 个工作日）。
届时在 `site.config.mjs` 填上：

```js
compliance: { icpZh: '粤ICP备xxxxxxxx号-1' }
```

页脚会自动显示备案信息。

---

## 6. 表单接入

表单组件 [`InquiryForm.astro`](./src/components/InquiryForm.astro)，行为由 `forms.endpoint` 决定：

### 方案 A：零后端（默认，开箱可用）

```js
forms: { endpoint: '' }
```

提交后打开访客的邮件客户端并预填内容，同时页面提示电话与微信。
**优点**：不需要任何服务端。**缺点**：依赖访客装了邮件客户端。

### 方案 B：EdgeOne 边缘函数（推荐）

仓库里已附现成示例：[`functions/api/inquiry.js`](./functions/api/inquiry.js)。

1. 用 **Git 部署**（`functions/` 目录会一起上传，EdgeOne Pages 自动识别路由）
2. 在 EdgeOne 控制台 → 项目设置 → **环境变量**配置任一渠道：

   | 变量 | 说明 |
   | --- | --- |
   | `WEBHOOK_URL` | 企业微信 / 钉钉 / 飞书 群机器人 Webhook（最简单，推荐） |
   | `RESEND_API_KEY` + `MAIL_TO` + `MAIL_FROM` | 走 Resend 发邮件 |

3. 改配置并重新构建：

   ```js
   forms: { endpoint: '/api/inquiry' }
   ```

函数已内置：蜜罐过滤、同 IP 限流（1 分钟 5 次）、必填校验、多渠道路由。

> Cloudflare Pages 用的是 `functions/` 目录下的 **Pages Functions**，语法与本例兼容
> （`onRequestPost` 导出），可以直接用。

### 方案 C：第三方表单服务

`endpoint` 填 Formspree / Getform / 飞书多维表格 Webhook 等地址即可（POST JSON）。

### 件号直达询价

列表页上无详情页的件号，点「询价」会跳到 `/contact/?part=FS641A#quote`，
表单会**自动预填件号**并把焦点放到电话输入框。

---

## 7. 部署细节与缓存策略

### 7.1 edgeone.json 已配置

- `/_astro/*`（带内容哈希的 JS/CSS）→ `max-age=31536000, immutable`，永久缓存不会串版
- `/catalog/*`、`/media/*`、`/brand/*` → 30 天缓存
- `*.html` → `max-age=0, must-revalidate`，内容更新即时生效
- 安全响应头：`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Permissions-Policy`

Cloudflare Pages 会自动对 `_astro/*` 做同样的长缓存优化，无需额外配置。

### 7.2 页面体积

| 页面 | 原始 | gzip |
| --- | --- | --- |
| 首页 | 165 KB | 27.6 KB |
| 件号详情页 | 110 KB | 19.6 KB |
| 件号查询页 | 363 KB | 49.2 KB |
| 大类页（2,548 条） | 3.4 MB | 约 200 KB |

边缘会自动 gzip/brotli，实际传输体积很小。
构建产物未压缩约 **320 MB**、约 **8,800 个文件**。

### 7.3 更新网站后看到旧内容

HTML 不缓存（`must-revalidate`），刷新即可。
若图片/样式仍是旧的，到平台控制台清一次缓存；`/_astro/*` 带哈希文件名，正常不需要清。

---

## 8. 上线后 SEO 检查清单

- [ ] `site.config.mjs` 的 `url` 已改为正式域名并重新构建（canonical / sitemap 依赖它）
- [ ] `indexingEnabled: true`（**建议先设 false，内容确认后再打开**）
- [ ] 访问 `/robots.txt` 确认有 `Sitemap:` 行
- [ ] 访问 `/sitemap-index.xml` 确认可打开
- [ ] [Google Search Console](https://search.google.com/search-console) 添加资源并提交 sitemap
- [ ] [百度搜索资源平台](https://ziyuan.baidu.com/) 添加站点并提交 sitemap
- [ ] [Bing 网站管理员工具](https://www.bing.com/webmasters) 提交（可一键导入 GSC）
- [ ] 验证码填进 `site.config.mjs` 的 `verification` 后重新构建
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) 抽查一个件号页
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) 跑一次首页
- [ ] Google 搜 `site:你的域名` 确认收录数在增长

### 已内建的 SEO 要素

| 要素 | 位置 |
| --- | --- |
| 每页独立 title / description | 各路由文件 |
| canonical + hreflang（zh-CN / en / x-default） | [`seo.mjs`](./src/lib/seo.mjs) |
| Organization / WebSite | 全站注入 |
| Product（含 sku、mpn、尺寸） | 每个件号详情页 |
| FAQPage | 首页、FAQ 页、查询页 |
| Article | 每篇文章 |
| BreadcrumbList | 所有二级页 |
| AutoPartsStore（本地商家） | 联系页 |
| XML sitemap（含语言标注） | `@astrojs/sitemap` |

---

## 9. 素材与版权说明

- 产品图片、企业环境照片、证书扫描件来自富滤盛官方站点公开素材。
  作为**授权代理**用于产品展示属正常商业使用，但请：
  1. 确认你的授权代理身份在有效期内；
  2. 不要修改后声称是自家工厂照片；
  3. 证书类图片建议注明「证书由生产厂家持有」（品质页已注明）。
- 页脚已含商标声明：*「本站所售富滤盛 / FILTERSUN 产品均为厂家正规渠道正品，商标归权利人所有。」*
- 站内文章、FAQ、页面文案均为原创撰写，可自由修改使用。

---

## 10. 常见问题排查

**构建报 `Cannot find module 'sharp'`** → `pnpm add -D sharp`

**同步时提示「判定为厂家站点异常，已回滚」**
→ 说明本次抓到的件号数比上次少 20% 以上。多半是厂家站点临时故障或反爬。
稍后重试；确认厂家真的下架了大量产品时，加 `--force`。

**图片有 435 张从 `.gif` 变成了 `.jpg`**
→ 压缩脚本把 GIF 转成了 JPEG（体积小得多），并**自动同步更新了
`src/data/catalog-images.json`**，不需要手工处理。

**`optimize-media.mjs` 报 `UNKNOWN: unknown error, open`**
→ libvips 在 Windows 上持有文件句柄时无法回写同一路径。脚本已改为先读进内存再处理，
若仍出现请检查杀毒软件是否锁定文件。

**不要用 Windows PowerShell 的 `Get-Content`/`Set-Content` 批量改这些文件**
→ PowerShell 5.1 默认按 GBK 读取，会把 UTF-8 中文写成乱码。请用 VS Code 等 UTF-8 编辑器。
（`Get-Content -Encoding UTF8` + `Set-Content -Encoding UTF8` 是安全的。）

**件号详情页太多，构建慢 / 文件数接近部署上限**
→ 把 `site.config.mjs` 的 `productPagePolicy` 改成 `'withImage'`，
页面数会降到约 2,900 个。

**GitHub Actions 同步失败**
→ 检查：① 仓库 Settings → Actions → General → Workflow permissions 是否选了
**Read and write permissions**；② 厂家站点是否可从 GitHub 服务器访问。

---

## 技术栈

| | |
| --- | --- |
| 框架 | [Astro 7](https://astro.build/)（静态输出） |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com/)（`@theme` 设计令牌，全站白色系） |
| 字体 | Inter Variable + JetBrains Mono（自托管，无外部请求） |
| 图标 | 自绘 24×24 线性图标集（[`Icon.astro`](./src/components/Icon.astro)） |
| 搜索 | 纯客户端索引检索，无后端、无第三方依赖 |
| 图片处理 | sharp（下载时压缩，GIF→JPEG 自动转换并同步映射表） |
| CI/CD | GitHub Actions（定时同步）+ EdgeOne / Cloudflare Pages（自动构建部署） |
