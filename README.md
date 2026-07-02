# 物业证据收集平台

一个用于收集物业服务不作为证据的网站平台，数据存储在 MongoDB Atlas 数据库。

## 功能特性

- 📝 问题描述录入
- 📷 图片证据上传（支持多图，base64 存储）
- 🏠 业主房号登记
- 📞 联系方式记录
- ✅ 真实性承诺声明
- 📱 响应式设计（PC端 + 移动端）
- 🗄️ **MongoDB Atlas 数据持久化**
- 📋 证据列表展示（支持状态筛选）

## 技术栈

- **框架**: [Astro](https://astro.build/)
- **前端框架**: [Vue 3](https://vuejs.org/)
- **样式**: [TailwindCSS](https://tailwindcss.com/)
- **数据库**: [MongoDB Atlas](https://www.mongodb.com/atlas) (免费)
- **部署**: [Vercel](https://vercel.com/)
- **包管理**: pnpm

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 MongoDB Atlas

#### 创建 MongoDB Atlas 免费集群：

1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas) 注册账号
2. 创建免费项目 (Free Tier)
3. 创建集群（选择免费 Shared 集群）
4. 设置数据库用户名和密码
5. 配置网络访问：**Network Access -> Add IP Address -> Allow from anywhere (0.0.0.0/0)**

#### 获取连接字符串：

1. 进入 **Database** 页面
2. 点击 **Connect** 按钮
3. 选择 **Connect your application**
4. 复制 Connection String（类似如下格式）：
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 MongoDB 连接信息：

```env
MONGODB_URI=mongodb+srv://你的用户名:你的密码@你的集群.mongodb.net/?retryWrites=true&w=majority
DB_NAME=property-evidence
```

### 4. 本地开发

```bash
pnpm dev
```

访问 http://localhost:4321 查看网站。

### 5. 构建生产版本

```bash
pnpm build
```

### 6. 预览生产构建

```bash
pnpm preview
```

## 部署到 Vercel

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI：
   ```bash
   pnpm add -D vercel
   ```

2. 登录并部署：
   ```bash
   vercel
   ```

3. 配置环境变量：
   ```bash
   vercel env add MONGODB_URI
   vercel env add DB_NAME
   ```

4. 重新部署使环境变量生效：
   ```bash
   vercel --prod
   ```

### 方法二：通过 GitHub + Vercel Dashboard

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel Dashboard](https://vercel.com/new) 导入项目
3. 在 Settings -> Environment Variables 中添加：
   - `MONGODB_URI`: 你的 MongoDB 连接字符串
   - `DB_NAME`: property-evidence
4. 点击 Deploy

## API 接口

### 获取证据列表

```
GET /api/evidence
Query Params:
  - page: 页码（默认 1）
  - limit: 每页数量（默认 20）
  - status: 状态筛选（pending/processing/resolved）

Response:
{
  "success": true,
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 100, "pages": 5 }
}
```

### 提交新证据

```
POST /api/evidence
Body:
{
  "roomNumber": "1栋2单元301室",
  "contact": "13800138000",
  "description": "问题描述...",
  "images": ["data:image/jpeg;base64,..."],
  "agreedToDeclaration": true
}

Response (201):
{
  "success": true,
  "data": { ... }
}
```

## 项目结构

```
├── src/
│   ├── components/
│   │   └── EvidenceForm.vue      # 主表单组件（列表+表单切换）
│   ├── lib/
│   │   ├── mongodb.ts            # MongoDB 连接配置
│   │   └── types.ts              # TypeScript 类型定义
│   ├── layouts/
│   │   └── Layout.astro          # 页面布局
│   └── pages/
│       ├── index.astro           # 首页
│       └── api/
│           └── evidence.ts        # API 路由（CRUD）
├── public/
│   └── favicon.svg               # 网站图标
├── .env.example                  # 环境变量示例
├── astro.config.mjs              # Astro 配置
├── tailwind.config.mjs           # TailwindCSS 配置
├── vercel.json                   # Vercel 部署配置
└── package.json                  # 项目依赖
```

## 数据模型

### Evidence Collection

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | ObjectId | 主键 |
| roomNumber | string | 业主房号 |
| contact | string | 联系方式 |
| description | string | 问题描述 |
| images | string[] | 图片数组 (base64) |
| agreedToDeclaration | boolean | 是否同意声明 |
| status | string | 状态 (pending/processing/resolved) |
| createdAt | Date | 创建时间 |
| updatedAt | Date | 更新时间 |

## 注意事项

⚠️ **生产环境建议：**

1. **图片存储**：当前使用 base64 存储在 MongoDB 中，适合小规模使用。大量图片建议使用对象存储服务：
   - [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
   - [Cloudinary](https://cloudinary.com/)
   - [AWS S3](https://aws.amazon.com/s3/)

2. **安全性**：
   - 添加 Rate Limiting 防止滥用
   - 添加输入验证和 XSS 防护
   - 使用 HTTPS

3. **MongoDB 安全**：
   - 生产环境应启用 IP 白名单限制
   - 启用认证机制
   - 定期备份数据

## 许可证

MIT License
