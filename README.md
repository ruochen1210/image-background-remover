# Image Background Remover 🤍

AI 智能图片背景移除工具，一键抠图，输出透明背景 PNG。

## 在线演示

[https://image-background-remover.vercel.app](https://image-background-remover.vercel.app) (待部署)

## 功能特点

- ✅ 拖拽上传，简单易用
- ✅ AI 自动抠图，无需手动操作
- ✅ 透明背景 PNG 输出
- ✅ Next.js + Tailwind CSS 现代化技术栈
- ✅ 响应式设计，支持移动端

## 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel
- **AI 服务**: Remove.bg API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 获取 Remove.bg API Key

1. 访问 [remove.bg](https://www.remove.bg/api)
2. 注册账号
3. 获取 API Key（免费额度：50 张/月）

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
REMOVE_BG_API_KEY=your_api_key_here
```

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel
```

或者在 [Vercel Dashboard](https://vercel.com/dashboard) 中：
1. 导入 GitHub 仓库
2. 设置环境变量 `REMOVE_BG_API_KEY`
3. 自动部署

## 项目结构

```
image-background-remover/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── remove-bg/
│   │   │       └── route.ts      # API 路由 (Remove.bg 代理)
│   │   ├── page.tsx              # 主页面
│   │   ├── layout.tsx            # 布局
│   │   └── globals.css           # 全局样式
│   └── ...
├── .env.local                    # 环境变量 (不要提交到 Git)
├── .env.example                  # 环境变量示例
├── next.config.ts                # Next.js 配置
├── tailwind.config.ts            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
└── README.md                     # 说明文档
```

## 成本估算

| 服务 | 免费额度 | 超出费用 |
|------|----------|----------|
| Vercel | 100GB 流量/月 | $20/月起 |
| Remove.bg API | 50 张/月 | $0.2/张 |

## API 说明

### 接口

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

### 本地调试

```bash
# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# TypeScript 类型检查
npx tsc --noEmit
```

### 本地预览生产构建

```bash
npm run build
npm start
```

## 注意事项

1. **API Key 安全**: 不要将 API Key 暴露在前端代码中，务必通过 API Route 代理
2. **文件大小限制**: Remove.bg 单张图片最大 32MB
3. **免费额度**: Remove.bg 免费额度仅 50 张/月，商用请购买套餐
4. **环境变量**: `.env.local` 文件不要提交到 Git

## 后续优化

- [ ] 批量处理功能
- [ ] 用户账户系统
- [ ] 历史记录保存
- [ ] 自定义背景替换
- [ ] 高清模式（付费）
- [ ] 图片编辑功能（裁剪、旋转）

## 许可证

MIT License

## 作者

欧阳若凡 (ruochen1210)

---

Made with ❤️ by Teresa
