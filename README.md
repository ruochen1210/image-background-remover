# Image Background Remover 🤍

AI 智能图片背景移除工具，一键抠图，输出透明背景 PNG。

## 在线演示

[https://image-bg-remover.pages.dev](https://image-bg-remover.pages.dev) (待部署)

## 功能特点

- ✅ 拖拽上传，简单易用
- ✅ AI 自动抠图，无需手动操作
- ✅ 透明背景 PNG 输出
- ✅ 纯前端 + Cloudflare 部署，零服务器成本
- ✅ 响应式设计，支持移动端

## 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **托管**: Cloudflare Pages
- **API 代理**: Cloudflare Workers
- **AI 服务**: Remove.bg API

## 快速开始

### 1. 获取 Remove.bg API Key

1. 访问 [remove.bg](https://www.remove.bg/api)
2. 注册账号
3. 获取 API Key（免费额度：50 张/月）

### 2. 部署 Worker

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 修改 worker.js 中的 REMOVE_BG_API_KEY 为你的 API Key
# 或者使用 secrets（推荐）:
wrangler secret put REMOVE_BG_API_KEY

# 部署 Worker
wrangler deploy
```

部署成功后，记下 Worker URL（如：`https://image-bg-remover-worker.your-subdomain.workers.dev`）

### 3. 修改前端配置

编辑 `app.js`，将 API_URL 改为你的 Worker URL：

```javascript
const API_URL = 'https://your-worker.your-subdomain.workers.dev/api/remove-bg';
```

### 4. 部署 Pages

```bash
# 登录 Cloudflare
wrangler login

# 部署到 Pages
wrangler pages deploy . --project-name=image-bg-remover
```

或者在 Cloudflare Dashboard 中：
1. 进入 Pages → 创建项目
2. 连接 GitHub 仓库
3. 自动部署

## 项目结构

```
image-bg-remover/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 前端逻辑
├── worker.js           # Cloudflare Worker (API 代理)
├── wrangler.toml       # Worker 配置
└── README.md           # 说明文档
```

## 成本估算

| 服务 | 免费额度 | 超出费用 |
|------|----------|----------|
| Cloudflare Pages | 无限 | - |
| Cloudflare Workers | 10 万次请求/天 | $0.3/百万次 |
| Remove.bg API | 50 张/月 | $0.2/张 |

## API 说明

### Worker 接口

**POST** `/api/remove-bg`

**请求**: `multipart/form-data`
- `image`: 图片文件 (JPG/PNG, max 32MB)

**响应**: 
- 成功：返回 PNG 图片 (image/png)
- 失败：返回 JSON 错误信息

```json
{
  "success": false,
  "message": "错误描述"
}
```

## 开发

### 本地调试 Worker

```bash
wrangler dev
```

### 本地预览前端

```bash
# 使用任意静态文件服务器
npx serve .
# 或
python -m http.server 8000
```

## 注意事项

1. **API Key 安全**: 不要将 API Key 暴露在前端代码中，务必通过 Worker 代理
2. **文件大小限制**: Remove.bg 单张图片最大 32MB
3. **免费额度**: Remove.bg 免费额度仅 50 张/月，商用请购买套餐
4. **CORS**: Worker 已配置跨域，确保前端可以正常调用

## 后续优化

- [ ] 批量处理功能
- [ ] 用户账户系统
- [ ] 历史记录保存
- [ ] 自定义背景替换
- [ ] 高清模式（付费）

## 许可证

MIT License

## 作者

欧阳若凡 (ruochen1210)

---

Made with ❤️ by Teresa
