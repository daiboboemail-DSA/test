# ⚡ Storage 策略快速配置指南

## 🎯 必须创建的 3 个策略

为了让你的应用正常工作，**必须创建这 3 个策略**：

1. ✅ **上传策略**（INSERT）- 允许用户上传图片
2. ✅ **查看策略**（SELECT）- 允许用户查看图片
3. ✅ **删除策略**（DELETE）- 允许用户删除图片

---

## 📝 策略一：上传策略（最重要！）

### 这是第一个要创建的策略，用于允许上传图片

#### 操作步骤：

1. **进入策略页面**
   - Storage → case-images → Policies
   - 点击 **"New Policy"**

2. **填写 Policy name**
   ```
   Allow public uploads
   ```

3. **选择 Allowed operation**
   - ✅ **勾选 "INSERT"**（这是上传操作）
   - ❌ 不要勾选其他选项

4. **Target roles**
   - 保持默认，不需要修改

5. **Policy definition**
   - 在代码编辑器中，输入：
   ```sql
   bucket_id = 'case-images'
   ```

6. **保存**
   - 点击 "Review" → "Save policy"

---

## 📝 策略二：查看策略

### 用于允许用户查看图片

1. **再次点击 "New Policy"**

2. **填写信息**：
   - Policy name: `Allow public access`
   - Allowed operation: ✅ **只勾选 "SELECT"**
   - Policy definition: `bucket_id = 'case-images'`

3. **保存**

---

## 📝 策略三：删除策略

### 用于允许用户删除图片

1. **再次点击 "New Policy"**

2. **填写信息**：
   - Policy name: `Allow public deletes`
   - Allowed operation: ✅ **只勾选 "DELETE"**
   - Policy definition: `bucket_id = 'case-images'`

3. **保存**

---

## ✅ 完成检查

配置完成后，在 Policies 列表中应该看到：

```
✅ Allow public uploads    (INSERT)
✅ Allow public access      (SELECT)
✅ Allow public deletes     (DELETE)
```

---

## ⚠️ 重要提示

### 为什么需要 3 个策略？
- Supabase 的策略是按操作类型分开的
- **INSERT** = 上传操作
- **SELECT** = 查看操作
- **DELETE** = 删除操作
- 每个操作需要独立的策略

### 如果只创建了查看策略会怎样？
- ❌ 用户无法上传图片
- ❌ 用户无法删除图片
- ✅ 只能查看已有的图片

### 如果只创建了上传策略会怎样？
- ✅ 用户可以上传图片
- ❌ 用户无法查看图片（上传后看不到）
- ❌ 用户无法删除图片

**所以必须创建全部 3 个策略！**

---

## 🎯 快速参考表

| 策略名称 | 操作类型 | 作用 | 是否必须 |
|---------|---------|------|---------|
| `Allow public uploads` | INSERT | 允许上传 | ✅ **必须** |
| `Allow public access` | SELECT | 允许查看 | ✅ **必须** |
| `Allow public deletes` | DELETE | 允许删除 | ✅ **必须** |

---

## 💡 常见问题

### Q: 我只想允许上传，不想允许删除可以吗？
**可以**，只创建 INSERT 和 SELECT 策略即可。但你的应用代码中有删除功能，所以建议创建全部 3 个。

### Q: 策略名称可以自定义吗？
**可以**，策略名称只是用来识别的，可以改成任何名字。但建议使用有意义的名称。

### Q: Policy definition 必须写 `bucket_id = 'case-images'` 吗？
**是的**，这确保策略只对 `case-images` 存储桶生效。如果你有其他存储桶，它们不会受到影响。

---

## 🎉 完成！

创建完这 3 个策略后，你的 Storage 就完全配置好了！

**下一步**：
1. ✅ 测试上传图片
2. ✅ 测试查看图片
3. ✅ 测试删除图片

---

**记住：上传策略（INSERT）是第一个必须创建的！** 🚀

