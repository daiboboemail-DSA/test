# 🚀 Supabase 快速配置指南

## ⚡ 5 分钟快速配置

### 步骤 1: 注册并创建项目 (2 分钟)

1. 访问 https://supabase.com
2. 点击右上角 "Start your project" 或 "Sign in"
3. 使用 GitHub/Google 账号登录（推荐）
4. 登录后点击 "New Project"
5. 填写信息：
   ```
   Organization: 选择或创建新组织
   Project Name: case-library (或任意名称)
   Database Password: [设置一个强密码，记住它！]
   Region: Southeast Asia (Singapore) [选择离你最近的]
   ```
6. 点击 "Create new project"
7. ⏳ 等待 2-3 分钟，项目创建完成

---

### 步骤 2: 获取 API 密钥 (30 秒)

1. 项目创建完成后，点击左侧菜单 **"Settings"** (⚙️ 图标)
2. 点击 **"API"** 子菜单
3. 找到以下信息并复制：

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. 📋 复制这两个值，稍后需要用到

---

### 步骤 3: 创建数据库表 (1 分钟)

1. 点击左侧菜单 **"SQL Editor"** (📝 图标)
2. 点击 **"New query"** 按钮
3. 打开项目中的 `database/schema.sql` 文件
4. 复制整个文件内容
5. 粘贴到 SQL Editor
6. 点击右下角 **"Run"** 按钮（或按 Cmd/Ctrl + Enter）
7. ✅ 看到 "Success. No rows returned" 表示成功

---

### 步骤 4: 创建 Storage Bucket (1 分钟)

1. 点击左侧菜单 **"Storage"** (📦 图标)
2. 点击 **"Create a new bucket"** 按钮
3. 填写信息：
   ```
   Name: case-images
   Public bucket: ✅ 勾选（重要！）
   File size limit: 50 MB (默认即可)
   Allowed MIME types: image/* (默认即可)
   ```
4. 点击 **"Create bucket"**

---

### 步骤 5: 设置数据库权限 (1 分钟)

1. 点击左侧菜单 **"Table Editor"** (📊 图标)
2. 找到 `cases` 表，点击表名
3. 点击 **"Policies"** 标签
4. 点击 **"New Policy"** 按钮
5. 选择 **"Enable read access for everyone"**
6. 点击 **"Use this template"**
7. 点击 **"Review"** → **"Save policy"**

8. 再次点击 **"New Policy"**
9. 选择 **"Create a policy from scratch"**
10. 填写：
    ```
    Policy name: Allow insert for everyone
    Allowed operation: INSERT
    Target roles: anon
    Policy definition: true
    ```
11. 点击 **"Review"** → **"Save policy"**

12. 再次点击 **"New Policy"**
13. 填写：
    ```
    Policy name: Allow delete for everyone
    Allowed operation: DELETE
    Target roles: anon
    Policy definition: true
    ```
14. 点击 **"Review"** → **"Save policy"**

---

### 步骤 6: 设置 Storage 权限 (1 分钟)

1. 点击左侧菜单 **"Storage"** → **"Policies"**
2. 选择 `case-images` bucket
3. 点击 **"New Policy"**

   **策略 1: 读取权限**
   ```
   Policy name: Public read access
   Allowed operation: SELECT
   Target roles: anon
   Policy definition: true
   ```

   **策略 2: 上传权限**
   ```
   Policy name: Public upload access
   Allowed operation: INSERT
   Target roles: anon
   Policy definition: true
   ```

   **策略 3: 删除权限**
   ```
   Policy name: Public delete access
   Allowed operation: DELETE
   Target roles: anon
   Policy definition: true
   ```

4. 每个策略都点击 **"Review"** → **"Save policy"**

---

### 步骤 7: 配置环境变量 (30 秒)

1. 在项目根目录创建 `.env` 文件（如果不存在）
2. 添加以下内容：

   ```env
   VITE_SUPABASE_URL=你的_Project_URL
   VITE_SUPABASE_ANON_KEY=你的_anon_public_key
   ```

3. 替换为你在步骤 2 中复制的实际值

   **示例：**
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

### 步骤 8: 测试配置 (30 秒)

1. 安装依赖（如果还没安装）：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开浏览器访问 http://localhost:5173

4. 滚动到案例库部分，尝试：
   - ✅ 查看现有案例（应该显示空列表或已有数据）
   - ✅ 点击"添加新案例"上传图片
   - ✅ 检查是否能成功上传

---

## ✅ 配置检查清单

完成配置后，确认以下项目：

- [ ] Supabase 项目已创建
- [ ] 已获取 Project URL 和 anon key
- [ ] 已执行 `database/schema.sql` 创建表
- [ ] 已创建 `case-images` Storage bucket（公开）
- [ ] 已设置数据库 RLS 策略（读取、插入、删除）
- [ ] 已设置 Storage 策略（读取、上传、删除）
- [ ] 已创建 `.env` 文件并配置密钥
- [ ] 本地测试上传功能正常

---

## 🆘 常见问题

### Q: 上传图片时提示 "new row violates row-level security"
**A:** Storage 策略未正确设置，检查步骤 6 的 Storage 权限配置

### Q: 无法读取案例列表
**A:** 数据库 RLS 策略未设置，检查步骤 5 的数据库权限配置

### Q: 提示 "cases 表不存在"
**A:** 未执行 SQL 脚本，检查步骤 3

### Q: 图片上传后无法显示
**A:** Storage bucket 未设置为公开，检查步骤 4 中是否勾选 "Public bucket"

---

## 📝 配置完成后部署到 GitHub

配置完成后，需要将环境变量添加到 GitHub：

1. 在 GitHub 仓库页面，点击 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **"New repository secret"**
3. 添加两个 secrets：
   - `VITE_SUPABASE_URL`: 你的 Project URL
   - `VITE_SUPABASE_ANON_KEY`: 你的 anon key
4. 更新 GitHub Actions workflow 以使用这些 secrets（我会帮你完成）

---

## 🎉 完成！

配置完成后，你的案例库就可以：
- ✅ 持久化存储案例数据
- ✅ 上传图片到云端
- ✅ 跨设备访问数据
- ✅ 自动备份

需要帮助？查看 `SUPABASE_SETUP.md` 获取更详细的说明。

