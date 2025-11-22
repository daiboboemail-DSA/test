# ⚡ Supabase 快速参考卡片

## 🎯 5分钟快速设置

### 1️⃣ 注册账号
- 访问：https://supabase.com/
- 使用 GitHub 账号注册（最简单）

### 2️⃣ 创建项目
- 点击 "New Project"
- 名称：`my-case-library`
- 密码：设置强密码（记住它！）
- 区域：`Southeast Asia (Singapore)`
- 计划：选择 **"Free"**

### 3️⃣ 创建数据库表
- 点击 "SQL Editor" → "New query"
- 复制粘贴以下 SQL：

```sql
CREATE TABLE cases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tag VARCHAR(100),
  desc TEXT,
  before_image TEXT,
  after_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON cases FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON cases FOR DELETE USING (true);
```

- 点击 "Run" 执行

### 4️⃣ 创建存储桶
- 点击 "Storage" → "Create bucket"
- 名称：`case-images`（必须用这个名称）
- ✅ 勾选 "Public bucket"
- 点击 "Create bucket"

### 5️⃣ 配置存储策略
- 点击 `case-images` 存储桶 → "Policies" → "New Policy"
- 选择 "For full customization"
- 粘贴以下 SQL：

```sql
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'case-images');
CREATE POLICY "Allow public access" ON storage.objects FOR SELECT USING (bucket_id = 'case-images');
CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'case-images');
```

- 点击 "Save policy"

### 6️⃣ 获取 API 密钥
- 点击 "Settings" → "API"
- 复制 **Project URL**：`https://xxxxx.supabase.co`
- 复制 **anon public** 密钥

### 7️⃣ 配置项目

#### 本地开发（.env.local）
```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_public密钥
```

#### GitHub Secrets（用于部署）
1. GitHub 仓库 → Settings → Secrets and variables → Actions
2. 添加两个 Secret：
   - `VITE_SUPABASE_URL` = 你的 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 anon public 密钥

### 8️⃣ 测试
```bash
npm run dev
```
- 打开 http://localhost:5173
- 上传一个案例测试
- 在 Supabase 控制台验证数据

---

## 📋 重要信息记录

### Supabase 项目信息
- **Project URL**：`_________________`
- **anon public Key**：`_________________`
- **数据库密码**：`_________________`（已保存）

### 存储桶信息
- **存储桶名称**：`case-images`
- **是否公开**：✅ 是

---

## ✅ 检查清单

- [ ] 项目创建成功
- [ ] 数据库表创建成功
- [ ] 存储桶创建成功（Public）
- [ ] 存储策略配置成功
- [ ] API 密钥已复制
- [ ] .env.local 已配置
- [ ] GitHub Secrets 已配置
- [ ] 本地测试成功
- [ ] 数据可以正常上传
- [ ] 图片可以正常显示

---

## 🆘 遇到问题？

查看详细指南：`SUPABASE_SETUP.md`

常见问题：
- SQL 执行失败 → 检查语法
- 图片无法上传 → 检查存储桶名称和策略
- 图片无法访问 → 检查存储桶是否为 Public

---

**完成设置后，你的应用就可以使用 Supabase 存储数据了！** 🎉

