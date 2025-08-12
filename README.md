# 胃炎患者饮食管理系统

一个专为萎缩性胃炎伴肠化生患者设计的智能饮食管理工具，采用黑白灰极简设计风格，提供症状追踪、食物安全查询、个性化饮食建议等功能。

## 🌟 特色功能

### 核心功能
- **症状记录** - 疼痛评分、喉咙异物感追踪、多维度症状记录
- **食物查询** - 三级安全评级系统（推荐/谨慎/避免）
- **智能推荐** - 基于症状的个性化饮食建议
- **实时预警** - 症状恶化自动提醒

### 技术亮点
- **Supabase后端** - PostgreSQL数据库 + 实时订阅
- **Framer Motion动画** - 流畅的交互体验
- **黑白灰设计** - 高对比度、适老化界面
- **响应式布局** - 完美适配手机、平板、电脑

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/yourusername/gastritis-care.git
cd gastritis-care
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的 Supabase 配置：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 📊 数据库架构

### 核心数据表
- `profiles` - 用户健康档案
- `symptom_records` - 症状记录
- `foods` - 食物数据库
- `meal_records` - 饮食记录
- `health_insights` - 健康洞察

所有表都配置了 Row Level Security，确保数据隐私安全。

## 🎨 设计规范

### 配色方案
- 主色：纯黑 `#000000`
- 背景：纯白 `#FFFFFF`
- 辅助：灰度色阶 `#F5F5F5` - `#171717`

### 字体系统
- 标题：32px Black
- 正文：18px Regular（适老化）
- 最小字号：16px

## 🛠 技术栈

- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS
- **动画库**: Framer Motion
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: React Hooks
- **图标库**: Lucide React
- **构建工具**: Vite

## 📱 功能界面

### 主要页面
1. **首页** - 健康状态总览、今日建议
2. **症状记录** - 疼痛评分、症状选择、备注记录
3. **食物查询** - 智能搜索、安全等级分类
4. **个人中心** - 用户信息、设置管理

## 🔒 隐私与安全

- 端到端加密传输
- Row Level Security 数据隔离
- 本地数据缓存
- 符合医疗数据保护标准

## 📈 后续优化

- [ ] AI 食物识别（拍照识别）
- [ ] 语音输入支持
- [ ] 数据导出功能
- [ ] 医生端管理界面
- [ ] 多语言支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

MIT License

## 👥 团队

专为 60 岁萎缩性胃炎患者打造的健康管理工具。

---

**免责声明**: 本应用仅供健康管理参考，不能替代专业医疗诊断和治疗。如有严重症状，请及时就医。