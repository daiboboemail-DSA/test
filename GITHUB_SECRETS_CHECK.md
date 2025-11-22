# 🔍 GitHub Secrets 配置检查指南

## 问题症状

- ✅ 图片可以上传并显示
- ❌ 数据库中没有数据
- ❌ 刷新页面后案例消失

**原因**：GitHub Secrets 未配置或配置错误，导致 Supabase 连接失败，降级到了本地存储。

---

## 🔧 解决步骤

### 第一步：检查 GitHub Secrets 是否配置

1. **打开 GitHub 仓库**
   - 访问：https://github.com/daiboboemail-DSA/test

2. **进入 Settings**
   - 点击仓库顶部的 **"Settings"** 标签

3. **找到 Secrets**
   - 左侧菜单：**"Secrets and variables"** → **"Actions"**

4. **检查是否有以下两个 Secrets**：
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`

### 第二步：如果没有配置，添加 Secrets

#### 添加 VITE_SUPABASE_URL

1. 点击 **"New repository secret"**
2. **Name**：`VITE_SUPABASE_URL`
3. **Value**：从 Supabase 控制台复制
   - Supabase 控制台 → Settings → API → Project URL
   - 格式：`https://xxxxxxxxxxxxx.supabase.co`
4. 点击 **"Add secret"**

#### 添加 VITE_SUPABASE_ANON_KEY

1. 再次点击 **"New repository secret"**
2. **Name**：`VITE_SUPABASE_ANON_KEY`
3. **Value**：从 Supabase 控制台复制
   - Supabase 控制台 → Settings → API → anon public 密钥
   - 是一串很长的字符
4. 点击 **"Add secret"**

### 第三步：验证配置

1. **检查 Secrets 列表**
   - 应该看到两个 Secrets
   - 注意：只能看到名称，看不到值（这是正常的）

2. **重新触发部署**
   - 方法一：推送一个小的更改到 GitHub
   - 方法二：在 Actions 页面，找到最新的 workflow，点击 **"Re-run jobs"**

3. **等待部署完成**
   - 在 Actions 页面查看部署状态
   - 等待显示绿色的 ✓

### 第四步：测试

1. **访问网站**：https://daiboboemail-DSA.github.io/test/
2. **打开浏览器控制台**（F12）
3. **上传一个案例**
4. **检查控制台**：
   - 如果没有错误 → 配置成功
   - 如果有 Supabase 相关错误 → 检查 Secrets 值是否正确

5. **验证数据**：
   - 在 Supabase 控制台 → Table Editor → cases
   - 应该能看到刚上传的数据

---

## ⚠️ 常见错误

### 错误1：Secrets 名称写错了

**错误示例**：
- `SUPABASE_URL`（缺少 VITE_ 前缀）
- `VITE_SUPABASE_URL_`（多了下划线）

**正确名称**：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 错误2：Secrets 值不正确

**检查方法**：
1. 在 Supabase 控制台 → Settings → API
2. 复制 Project URL 和 anon public 密钥
3. 确保没有多余的空格
4. 确保没有换行符

### 错误3：部署后 Secrets 没有生效

**解决方法**：
1. 检查 GitHub Actions 日志
2. 在 Actions 页面，点击最新的 workflow
3. 查看 "Build" 步骤的日志
4. 检查是否有环境变量相关的错误

---

## 🔍 如何验证 Secrets 是否正确

### 方法一：查看构建日志

1. GitHub 仓库 → **"Actions"** 标签
2. 点击最新的 workflow run
3. 点击 **"build"** 任务
4. 展开 **"Build"** 步骤
5. 检查是否有 Supabase 相关的错误

### 方法二：检查网站控制台

1. 访问：https://daiboboemail-DSA.github.io/test/
2. 打开浏览器控制台（F12）
3. 查看是否有 Supabase 连接错误

### 方法三：测试上传功能

1. 上传一个案例
2. 在 Supabase 控制台检查数据是否保存
3. 刷新页面，检查案例是否还在

---

## 📝 配置检查清单

- [ ] 在 GitHub Settings → Secrets → Actions 中
- [ ] 有 `VITE_SUPABASE_URL` Secret
- [ ] 有 `VITE_SUPABASE_ANON_KEY` Secret
- [ ] 两个 Secrets 的值都正确（从 Supabase 控制台复制）
- [ ] 重新部署了网站（推送代码或手动触发）
- [ ] 部署成功后测试上传功能
- [ ] 数据能保存到 Supabase 数据库
- [ ] 刷新页面后数据还在

---

## 🎯 快速修复步骤

1. ✅ 检查 GitHub Secrets 是否配置
2. ✅ 如果没有，按照上面的步骤添加
3. ✅ 重新部署（推送代码或手动触发）
4. ✅ 测试上传功能
5. ✅ 验证数据保存到数据库

---

## 💡 提示

### 为什么需要 GitHub Secrets？

- Vite 在**构建时**需要环境变量
- GitHub Actions 在构建时从 Secrets 读取环境变量
- 构建后的代码会包含这些环境变量
- 这样部署的网站才能连接 Supabase

### Secrets 的安全性

- Secrets 是加密存储的
- 只有仓库管理员可以看到名称（看不到值）
- 不会泄露到代码仓库中
- 只在构建时使用

---

**配置完成后，数据就会保存到 Supabase 数据库了！** 🎉

