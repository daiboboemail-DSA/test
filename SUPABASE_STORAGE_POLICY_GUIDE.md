# 📦 Supabase Storage 策略配置详细指南

## 🎯 你需要创建 3 个策略

为了让用户可以上传、查看和删除图片，需要创建 3 个策略：
1. **上传策略**（INSERT）- 允许上传图片
2. **读取策略**（SELECT）- 允许查看图片
3. **删除策略**（DELETE）- 允许删除图片

---

## 📝 策略一：允许上传图片（INSERT）

### 步骤详解

#### 1. 点击 "New Policy"
在 Storage → case-images → Policies 页面，点击 **"New Policy"**

#### 2. 填写 Policy name（策略名称）
- **输入**：`Allow public uploads`
- **说明**：这个名字可以自定义，但建议用这个，方便识别

#### 3. 选择 Allowed operation（允许的操作）
- ✅ **勾选 "INSERT"**（上传操作）
- ❌ 其他选项（SELECT、UPDATE、DELETE）**不要勾选**

#### 4. Target roles（目标角色）
- **保持默认**：`Defaults to all (public) roles if none selected`
- **不需要修改**，这样所有人都可以上传

#### 5. Policy definition（策略定义）
在代码编辑器中，**删除所有现有内容**，然后粘贴以下代码：

```sql
bucket_id = 'case-images'
```

**完整说明**：
- 这个策略的意思是：允许对 `case-images` 这个存储桶进行 INSERT（上传）操作
- 不需要写完整的 SQL，只需要写条件表达式

#### 6. 保存策略
- 点击右下角的 **"Review"** 按钮
- 检查信息无误后，点击 **"Save policy"**

---

## 📝 策略二：允许查看图片（SELECT）

### 步骤详解

#### 1. 再次点击 "New Policy"
在同一个页面，再次点击 **"New Policy"**

#### 2. 填写 Policy name（策略名称）
- **输入**：`Allow public access`
- **说明**：允许公开访问

#### 3. 选择 Allowed operation（允许的操作）
- ✅ **勾选 "SELECT"**（读取操作）
- ❌ 其他选项（INSERT、UPDATE、DELETE）**不要勾选**

#### 4. Target roles（目标角色）
- **保持默认**：`Defaults to all (public) roles if none selected`

#### 5. Policy definition（策略定义）
在代码编辑器中，粘贴以下代码：

```sql
bucket_id = 'case-images'
```

#### 6. 保存策略
- 点击 **"Review"** → **"Save policy"**

---

## 📝 策略三：允许删除图片（DELETE）

### 步骤详解

#### 1. 再次点击 "New Policy"
在同一个页面，再次点击 **"New Policy"**

#### 2. 填写 Policy name（策略名称）
- **输入**：`Allow public deletes`
- **说明**：允许公开删除

#### 3. 选择 Allowed operation（允许的操作）
- ✅ **勾选 "DELETE"**（删除操作）
- ❌ 其他选项（SELECT、INSERT、UPDATE）**不要勾选**

#### 4. Target roles（目标角色）
- **保持默认**：`Defaults to all (public) roles if none selected`

#### 5. Policy definition（策略定义）
在代码编辑器中，粘贴以下代码：

```sql
bucket_id = 'case-images'
```

#### 6. 保存策略
- 点击 **"Review"** → **"Save policy"**

---

## 📊 完整配置总结

### 三个策略的配置对比

| 策略名称 | 操作类型 | Policy Definition |
|---------|---------|------------------|
| `Allow public uploads` | ✅ INSERT | `bucket_id = 'case-images'` |
| `Allow public access` | ✅ SELECT | `bucket_id = 'case-images'` |
| `Allow public deletes` | ✅ DELETE | `bucket_id = 'case-images'` |

### 每个字段的说明

#### Policy name（策略名称）
- **作用**：给策略起个名字，方便识别
- **要求**：不超过 50 个字符
- **建议**：使用英文，描述清楚策略的作用

#### Allowed operation（允许的操作）
- **SELECT**：读取/查看文件
- **INSERT**：上传文件
- **UPDATE**：更新文件（我们不需要）
- **DELETE**：删除文件

#### Target roles（目标角色）
- **默认值**：`Defaults to all (public) roles if none selected`
- **含义**：所有人都可以使用（公开访问）
- **不需要修改**

#### Policy definition（策略定义）
- **格式**：SQL 条件表达式
- **我们用的**：`bucket_id = 'case-images'`
- **含义**：只对 `case-images` 存储桶生效

---

## ✅ 配置完成后的检查

### 检查清单

完成所有 3 个策略后，你应该看到：

- [ ] 策略列表中显示 3 个策略
- [ ] `Allow public uploads` - INSERT 操作
- [ ] `Allow public access` - SELECT 操作
- [ ] `Allow public deletes` - DELETE 操作

### 验证配置

1. **测试上传**：
   - 在你的应用中上传一张图片
   - 如果成功，说明 INSERT 策略配置正确

2. **测试查看**：
   - 上传后，图片应该能正常显示
   - 如果能看到，说明 SELECT 策略配置正确

3. **测试删除**：
   - 删除一个案例
   - 如果成功，说明 DELETE 策略配置正确

---

## 🎨 界面操作图示说明

### 创建策略的界面布局

```
┌─────────────────────────────────────────┐
│ Adding new policy to case-images    [X] │
├─────────────────────────────────────────┤
│                                         │
│ Policy name:                            │
│ [Allow public uploads____________] 0/50 │
│                                         │
│ Allowed operation:                      │
│ ☐ SELECT                               │
│ ☑ INSERT  ← 勾选这个                    │
│ ☐ UPDATE                               │
│ ☐ DELETE                               │
│                                         │
│ Target roles:                           │
│ [Defaults to all (public)...]  ↓        │
│                                         │
│ Policy definition:                      │
│ ┌─────────────────────────────────┐     │
│ │ bucket_id = 'case-images'      │     │
│ └─────────────────────────────────┘     │
│                                         │
│                    [View templates] [Review] │
└─────────────────────────────────────────┘
```

---

## ⚠️ 常见错误

### 错误1：Policy name 太长
- **问题**：超过 50 个字符
- **解决**：缩短名称，使用简洁的描述

### 错误2：勾选了多个操作
- **问题**：一个策略勾选了 SELECT、INSERT、DELETE 多个操作
- **解决**：**每个策略只勾选一个操作**，创建 3 个独立的策略

### 错误3：Policy definition 写错了
- **问题**：写了完整的 SQL 语句
- **解决**：只写条件表达式：`bucket_id = 'case-images'`

### 错误4：存储桶名称不对
- **问题**：Policy definition 中的存储桶名称写错了
- **解决**：确保是 `'case-images'`（注意有单引号）

---

## 💡 提示

### 为什么需要 3 个策略？
- Supabase 的策略是按操作类型分开的
- 每个操作（SELECT、INSERT、DELETE）需要独立的策略
- 这样更安全，可以精确控制权限

### 为什么用 `bucket_id = 'case-images'`？
- 这个条件限制策略只对 `case-images` 存储桶生效
- 如果你有其他存储桶，它们不会受到影响

### 可以修改策略名称吗？
- **可以**，策略名称只是用来识别的
- 建议使用有意义的名称，方便管理

---

## 🎉 完成！

配置完 3 个策略后，你的 Storage 就配置好了！

**下一步**：
1. ✅ 测试上传图片
2. ✅ 测试查看图片
3. ✅ 测试删除图片
4. ✅ 如果都正常，说明配置成功！

---

**如果还有问题，查看 Supabase 官方文档或联系我！** 📚

