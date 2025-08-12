# 部署指南

## Zeabur 部署

1. **推送到 GitHub**
```bash
# 在 GitHub 创建新仓库后
git remote add origin https://github.com/yourusername/gastritis-care.git
git branch -M main
git push -u origin main
```

2. **在 Zeabur 部署**
- 登录 [Zeabur](https://zeabur.com)
- 点击 "New Project"
- 选择 "Deploy from GitHub"
- 选择 `gastritis-care` 仓库
- 自动检测为 Node.js 项目
- 添加环境变量：
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- 点击 "Deploy"

## Vercel 部署（备选）

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **部署**
```bash
vercel
```

3. **配置环境变量**
在 Vercel Dashboard 中添加：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Netlify 部署（备选）

1. **创建 netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

2. **部署**
- 推送代码到 GitHub
- 在 Netlify 连接 GitHub 仓库
- 自动部署

## 环境变量说明

必需的环境变量：
- `VITE_SUPABASE_URL`: Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase 匿名密钥

可选的环境变量：
- `VITE_OPENAI_API_KEY`: OpenAI API 密钥（未来功能）

## 构建优化

生产构建命令：
```bash
npm run build
```

构建后的文件在 `dist` 目录，可直接部署到任何静态文件服务器。

## 性能优化建议

1. 启用 Gzip 压缩
2. 配置 CDN 加速
3. 设置浏览器缓存策略
4. 使用 HTTP/2

## 监控建议

1. 添加 Google Analytics
2. 配置 Sentry 错误监控
3. 设置 Uptime 监控