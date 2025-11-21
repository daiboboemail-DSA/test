# Supabase 数据库设置指南

## 第一步：创建 Supabase 项目

1. 访问 https://supabase.com
2. 注册/登录账号
3. 点击 "New Project"
4. 填写项目信息：
   - Project Name: `case-library` (或任意名称)
   - Database Password: 设置一个强密码（记住它）
   - Region: 选择离你最近的区域
5. 点击 "Create new project"，等待创建完成（约 2 分钟）

## 第二步：获取 API 密钥

1. 在项目页面，点击左侧菜单 "Settings" → "API"
2. 找到以下信息：
   - **Project URL**: 复制这个 URL
   - **anon public key**: 复制这个 key

## 第三步：创建数据库表

1. 在项目页面，点击左侧菜单 "SQL Editor"
2. 点击 "New query"
3. 复制 `database/schema.sql` 文件中的内容
4. 粘贴到 SQL Editor
5. 点击 "Run" 执行

## 第四步：创建 Storage Bucket

1. 在项目页面，点击左侧菜单 "Storage"
2. 点击 "Create a new bucket"
3. 填写信息：
   - Name: `case-images`
   - Public bucket: ✅ 勾选（允许公开访问图片）
4. 点击 "Create bucket"

## 第五步：配置环境变量

1. 在项目根目录创建 `.env` 文件（如果不存在）
2. 添加以下内容：

```env
VITE_SUPABASE_URL=你的_Project_URL
VITE_SUPABASE_ANON_KEY=你的_anon_public_key
```

3. 替换为你在第二步获取的实际值

## 第六步：设置 Row Level Security (RLS)

1. 在项目页面，点击左侧菜单 "Table Editor"
2. 找到 `cases` 表
3. 点击表名，然后点击 "Policies" 标签
4. 点击 "New Policy"
5. 选择 "Enable read access for everyone"（允许所有人读取）
6. 再创建一个策略：
   - Policy name: `Allow insert for everyone`
   - Allowed operation: `INSERT`
   - Target roles: `anon`
   - Policy definition: `true`
7. 再创建一个策略：
   - Policy name: `Allow delete for everyone`
   - Allowed operation: `DELETE`
   - Target roles: `anon`
   - Policy definition: `true`

## 第七步：设置 Storage 策略

1. 在项目页面，点击左侧菜单 "Storage" → "Policies"
2. 选择 `case-images` bucket
3. 创建以下策略：

### 读取策略（允许所有人读取）
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `anon`
- Policy definition: `true`

### 上传策略（允许所有人上传）
- Policy name: `Public upload access`
- Allowed operation: `INSERT`
- Target roles: `anon`
- Policy definition: `true`

### 删除策略（允许所有人删除）
- Policy name: `Public delete access`
- Allowed operation: `DELETE`
- Target roles: `anon`
- Policy definition: `true`

## 完成！

现在你的项目已经配置好了 Supabase 数据库。重新运行项目：

```bash
npm install
npm run dev
```

## 注意事项

⚠️ **安全提示**：
- 这个配置允许所有人读写数据，适合演示项目
- 生产环境建议添加身份验证和更严格的权限控制
- 不要将 `.env` 文件提交到 Git（已在 .gitignore 中）

## 故障排查

### 问题：无法上传图片
- 检查 Storage bucket 是否创建
- 检查 Storage 策略是否正确设置
- 检查浏览器控制台错误信息

### 问题：无法读取案例
- 检查数据库表是否创建
- 检查 RLS 策略是否正确设置
- 检查环境变量是否正确配置

### 问题：CORS 错误
- Supabase 默认允许所有来源，如果遇到 CORS 问题，检查项目设置

