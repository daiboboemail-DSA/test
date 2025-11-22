# 🚀 Supabase 完整设置指南（零基础版）

## 📋 目录
1. [第一步：注册 Supabase 账号](#第一步注册-supabase-账号)
2. [第二步：创建项目](#第二步创建项目)
3. [第三步：创建数据库表](#第三步创建数据库表)
4. [第四步：配置存储（图片上传）](#第四步配置存储图片上传)
5. [第五步：获取 API 密钥](#第五步获取-api-密钥)
6. [第六步：配置到项目](#第六步配置到项目)
7. [第七步：测试上传](#第七步测试上传)
8. [常见问题](#常见问题)

---

## 第一步：注册 Supabase 账号

### 1.1 访问 Supabase 官网
1. 打开浏览器，访问：https://supabase.com/
2. 点击右上角的 **"Start your project"** 或 **"Sign In"**

### 1.2 注册账号
1. 点击 **"Sign Up"** 或 **"Get Started"**
2. 选择注册方式（推荐使用 GitHub 账号注册，最简单）：
   - **方式A：使用 GitHub 注册**（推荐 ⭐）
     - 点击 "Continue with GitHub"
     - 授权 Supabase 访问你的 GitHub
     - 完成注册
   
   - **方式B：使用邮箱注册**
     - 输入邮箱地址
     - 设置密码
     - 验证邮箱（检查收件箱）

### 1.3 完成注册
- 注册成功后，会自动进入 Supabase 控制台
- 如果提示选择组织，选择 "Personal"（个人）

---

## 第二步：创建项目

### 2.1 创建新项目
1. 在 Supabase 控制台，点击 **"New Project"** 或 **"Create a new project"**

### 2.2 填写项目信息

#### 基本信息
- **Name（项目名称）**：例如 `my-case-library` 或 `test-project`
- **Database Password（数据库密码）**：
  - ⚠️ **非常重要！** 设置一个强密码（包含大小写字母、数字、特殊字符）
  - **务必记住这个密码！**（建议保存到密码管理器）
  - 例如：`MyStrong@Password123`

#### 区域选择
- **Region（区域）**：
  - 如果主要用户在国内：选择 **"Southeast Asia (Singapore)"**（新加坡，相对较快）
  - 如果主要用户在国外：选择离用户最近的区域
  - ⚠️ **注意**：区域创建后无法更改

#### 定价计划
- **Pricing Plan（定价计划）**：选择 **"Free"**（免费版）
  - 免费额度：
    - 500MB 数据库存储
    - 1GB 文件存储
    - 2GB 带宽/月
    - 50,000 月活跃用户
    - 完全够测试使用！

### 2.3 创建项目
1. 点击 **"Create new project"**
2. 等待项目创建（通常需要 1-2 分钟）
3. 创建完成后，会自动进入项目控制台

---

## 第三步：创建数据库表

### 3.1 进入 SQL 编辑器
1. 在左侧菜单，点击 **"SQL Editor"**
2. 点击 **"New query"**

### 3.2 创建案例表
复制以下 SQL 代码，粘贴到 SQL 编辑器中：

```sql
-- 创建案例表
CREATE TABLE cases (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  tag VARCHAR(100),
  "desc" TEXT,
  before_image TEXT,
  after_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 设置表的访问权限（允许公开读取）
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取
CREATE POLICY "Allow public read access" ON cases
  FOR SELECT
  USING (true);

-- 创建策略：允许所有人插入（上传案例）
CREATE POLICY "Allow public insert" ON cases
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许所有人删除（删除案例）
CREATE POLICY "Allow public delete" ON cases
  FOR DELETE
  USING (true);
```

### 3.3 执行 SQL
1. 点击右下角的 **"Run"** 按钮
2. 或者按快捷键 `Ctrl + Enter`（Windows）或 `Cmd + Enter`（Mac）
3. 看到 "Success. No rows returned" 表示成功

### 3.4 验证表创建成功
1. 在左侧菜单，点击 **"Table Editor"**
2. 应该能看到 `cases` 表
3. 点击表名，可以看到表结构

---

## 第四步：配置存储（图片上传）

### 4.1 创建存储桶
1. 在左侧菜单，点击 **"Storage"**
2. 点击 **"Create a new bucket"**

### 4.2 配置存储桶
- **Name（名称）**：`case-images`（必须用这个名称，代码中已配置）
- **Public bucket（公开存储桶）**：✅ **必须勾选**（图片需要公开访问）
- **File size limit（文件大小限制）**：50MB（默认即可，可以调整）
- **Allowed MIME types（允许的文件类型）**：
  - 留空表示允许所有类型
  - 或者填写：`image/jpeg,image/png,image/gif,image/webp`

### 4.3 创建存储桶
1. 点击 **"Create bucket"**
2. 创建成功

### 4.4 设置存储策略（允许上传和删除）

⚠️ **重要**：需要创建 **3 个独立的策略**，每个策略只配置一个操作。

#### 策略一：允许上传图片（INSERT）

1. 在 Storage 页面，点击 `case-images` 存储桶
2. 点击 **"Policies"** 标签
3. 点击 **"New Policy"**
4. 填写表单：
   - **Policy name**：输入 `Allow public uploads`
   - **Allowed operation**：✅ **只勾选 "INSERT"**（其他不要勾选）
   - **Target roles**：保持默认（不需要修改）
   - **Policy definition**：在代码编辑器中输入：
     ```sql
     bucket_id = 'case-images'
     ```
5. 点击 **"Review"**，然后点击 **"Save policy"**

#### 策略二：允许查看图片（SELECT）

1. 再次点击 **"New Policy"**
2. 填写表单：
   - **Policy name**：输入 `Allow public access`
   - **Allowed operation**：✅ **只勾选 "SELECT"**（其他不要勾选）
   - **Target roles**：保持默认
   - **Policy definition**：输入：
     ```sql
     bucket_id = 'case-images'
     ```
3. 点击 **"Review"**，然后点击 **"Save policy"**

#### 策略三：允许删除图片（DELETE）

1. 再次点击 **"New Policy"**
2. 填写表单：
   - **Policy name**：输入 `Allow public deletes`
   - **Allowed operation**：✅ **只勾选 "DELETE"**（其他不要勾选）
   - **Target roles**：保持默认
   - **Policy definition**：输入：
     ```sql
     bucket_id = 'case-images'
     ```
3. 点击 **"Review"**，然后点击 **"Save policy"**

#### 完成检查

配置完成后，你应该看到 3 个策略：
- ✅ `Allow public uploads` - INSERT
- ✅ `Allow public access` - SELECT
- ✅ `Allow public deletes` - DELETE

**详细说明**：查看 `SUPABASE_STORAGE_POLICY_GUIDE.md`

---

## 第五步：获取 API 密钥

### 5.1 进入项目设置
1. 在左侧菜单底部，点击 **"Settings"**（齿轮图标）
2. 点击 **"API"**

### 5.2 记录 API 信息
在 API 设置页面，你会看到：

#### Project URL（项目 URL）
- 格式：`https://xxxxxxxxxxxxx.supabase.co`
- **复制这个 URL**，后面会用到

#### API Keys（API 密钥）
找到 **"anon public"** 密钥：
- 这是一个公开的密钥，可以安全地在前端使用
- **复制这个密钥**，后面会用到

⚠️ **重要提示**：
- `anon public` 密钥：用于前端代码（可以公开）
- `service_role` 密钥：**不要**在前端使用，只在后端使用

---

## 第六步：配置到项目

### 6.1 在本地项目配置

#### 创建环境变量文件
在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录执行
touch .env.local
```

#### 编辑环境变量文件
打开 `.env.local`，添加以下内容：

```env
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_public密钥
```

**示例**：
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDAwMDAwMCwiZXhwIjoxOTU1NTczNjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 6.2 配置 GitHub Secrets（用于 GitHub Pages 部署）

#### 进入 GitHub 仓库设置
1. 打开你的 GitHub 仓库：https://github.com/daiboboemail-DSA/test
2. 点击 **"Settings"**（设置）
3. 在左侧菜单，点击 **"Secrets and variables"** → **"Actions"**

#### 添加 Secrets
点击 **"New repository secret"**，添加两个密钥：

**Secret 1：**
- **Name**：`VITE_SUPABASE_URL`
- **Value**：你的 Supabase URL（例如：`https://abcdefghijklmnop.supabase.co`）
- 点击 **"Add secret"**

**Secret 2：**
- **Name**：`VITE_SUPABASE_ANON_KEY`
- **Value**：你的 anon public 密钥
- 点击 **"Add secret"**

### 6.3 验证配置
1. 重启开发服务器：
   ```bash
   npm run dev
   ```
2. 打开浏览器控制台（F12）
3. 检查是否有 Supabase 连接错误

---

## 第七步：测试上传

### 7.1 本地测试
1. 启动开发服务器：
   ```bash
   npm run dev
   ```
2. 打开浏览器，访问：http://localhost:5173
3. 进入案例库页面
4. 点击"添加新案例"
5. 填写信息并上传两张图片
6. 点击保存

### 7.2 验证数据
1. 回到 Supabase 控制台
2. 点击 **"Table Editor"** → **"cases"**
3. 应该能看到刚上传的案例数据
4. 点击 **"Storage"** → **"case-images"**
5. 应该能看到上传的图片文件

### 7.3 验证图片访问
1. 在案例列表中，点击图片
2. 图片应该能正常显示
3. 如果图片无法显示，检查：
   - Storage 存储桶是否设置为 "Public"
   - Storage 策略是否正确配置

---

## 常见问题

### Q1: 注册时提示邮箱已存在
**解决**：直接使用 "Sign In" 登录，或者使用其他邮箱注册

### Q2: 创建项目时提示密码不符合要求
**解决**：密码必须包含：
- 至少 8 个字符
- 大小写字母
- 数字
- 特殊字符

### Q3: SQL 执行失败
**解决**：
- 检查 SQL 语法是否正确
- 确保表名没有重复
- 查看错误信息，根据提示修改

### Q4: 图片上传失败
**解决**：
1. 检查 Storage 存储桶名称是否为 `case-images`
2. 检查存储桶是否设置为 "Public"
3. 检查 Storage 策略是否正确配置
4. 检查文件大小是否超过限制

### Q5: 图片无法访问
**解决**：
1. 检查存储桶是否为 "Public"
2. 检查 Storage 策略中的 SELECT 策略是否正确
3. 检查图片 URL 是否正确

### Q6: 免费额度不够用
**解决**：
- 优化图片大小（压缩图片）
- 删除不需要的旧数据
- 或者升级到付费计划

### Q7: 如何查看使用量
1. 在 Supabase 控制台，点击 **"Settings"** → **"Usage"**
2. 可以看到数据库、存储、带宽的使用情况

---

## 📊 免费额度说明

### Supabase Free Plan（免费版）

| 资源 | 免费额度 | 说明 |
|------|---------|------|
| **数据库存储** | 500MB | 案例数据很小，够用 |
| **文件存储** | 1GB | 可以存储约 200-500 张图片（取决于图片大小） |
| **带宽** | 2GB/月 | 每月 2GB 流量 |
| **月活跃用户** | 50,000 | 完全够用 |
| **项目数量** | 无限 | 可以创建多个项目 |

### 超出免费额度后
- 会收到邮件通知
- 可以选择升级到付费计划
- 或者优化使用（删除旧数据、压缩图片）

---

## ✅ 检查清单

完成以下所有步骤：

- [ ] 注册 Supabase 账号
- [ ] 创建项目（选择 Free 计划）
- [ ] 记录数据库密码
- [ ] 创建 `cases` 表（执行 SQL）
- [ ] 创建 `case-images` 存储桶（设置为 Public）
- [ ] 配置 Storage 策略（允许上传、读取、删除）
- [ ] 获取 API URL 和密钥
- [ ] 配置 `.env.local` 文件
- [ ] 配置 GitHub Secrets
- [ ] 本地测试上传功能
- [ ] 验证数据在 Supabase 中
- [ ] 验证图片可以正常访问

---

## 🎉 完成！

配置完成后，你的应用将：
- ✅ 数据存储在 Supabase 云端数据库
- ✅ 图片存储在 Supabase Storage
- ✅ 支持多设备访问
- ✅ 数据永久保存
- ✅ 完全免费（在免费额度内）

**现在可以开始测试你的案例库功能了！** 🚀

---

## 📝 下一步

1. ✅ 测试上传案例
2. ✅ 测试删除案例
3. ✅ 测试图片显示
4. ✅ 部署到 GitHub Pages
5. ✅ 监控 Supabase 使用量

---

## 💡 提示

- **定期备份**：虽然 Supabase 会自动备份，但建议定期导出重要数据
- **监控使用量**：定期查看使用量，避免超出免费额度
- **优化图片**：上传前压缩图片，节省存储空间
- **清理数据**：定期删除不需要的测试数据

---

**祝你使用顺利！如有问题，查看"常见问题"部分或查看 Supabase 官方文档。** 📚
