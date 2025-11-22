# 📚 部署方案总览

## 🎯 你的需求

- **应用场景**：案例库（图片/视频上传）+ 网页展示
- **阶段**：个人测试 → 企业付费
- **目标**：测试阶段省钱，后期平滑迁移

---

## 💡 推荐方案

### 测试阶段（省钱方案）💰

**配置**：
- 服务器：1核1GB，20GB系统盘
- 存储：阿里云OSS对象存储（图片/视频）
- 带宽：1Mbps按量付费
- **月成本：约 70-80元**

**优势**：
- ✅ 成本低
- ✅ 图片存储在OSS，不占服务器空间
- ✅ 后期升级服务器时，OSS数据无需迁移

### 企业阶段（升级方案）🚀

**配置**：
- 服务器：4核8GB或更高（在控制台直接升级，5-10分钟）
- 存储：继续使用OSS（无需迁移）
- 带宽：3-5Mbps固定带宽
- **月成本：约 400-600元**

**优势**：
- ✅ 升级简单，零数据丢失
- ✅ OSS自动扩容
- ✅ 性能提升明显

---

## 📖 文档索引

### 1. **ALIYUN_DEPLOY_GUIDE.md** - 详细部署指南
   - 从购买服务器到部署的完整步骤
   - 适合零基础用户
   - 包含截图说明位置

### 2. **QUICK_START.md** - 快速开始
   - 5分钟快速部署流程
   - 适合有经验的用户

### 3. **COST_OPTIMIZATION.md** - 成本优化方案 ⭐
   - 测试阶段省钱方案
   - 后期迁移方案
   - 成本对比表

### 4. **OSS_SETUP_GUIDE.md** - OSS配置指南
   - 如何创建OSS存储桶
   - 如何配置代码使用OSS
   - 成本估算

### 5. **DEPLOY_CHECKLIST.md** - 部署检查清单
   - 逐步检查，确保不遗漏

---

## 🚀 快速开始

### 方案A：使用OSS存储（推荐，省钱）

1. 阅读 `COST_OPTIMIZATION.md` 了解方案
2. 按照 `OSS_SETUP_GUIDE.md` 配置OSS
3. 安装OSS SDK：`npm install ali-oss`
4. 配置环境变量（见 `OSS_SETUP_GUIDE.md`）
5. 按照 `ALIYUN_DEPLOY_GUIDE.md` 部署服务器

### 方案B：使用Supabase存储（国际化）

1. 按照 `SUPABASE_SETUP.md` 配置Supabase
2. 按照 `ALIYUN_DEPLOY_GUIDE.md` 部署服务器

---

## 🔄 存储方案对比

| 特性 | OSS（推荐） | Supabase Storage |
|------|-----------|------------------|
| **国内访问速度** | ⭐⭐⭐⭐⭐ 很快 | ⭐⭐⭐ 较慢 |
| **成本** | ⭐⭐⭐⭐⭐ 便宜 | ⭐⭐⭐ 中等 |
| **配置复杂度** | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 简单 |
| **迁移成本** | ⭐⭐⭐⭐⭐ 无需迁移 | ⭐⭐⭐ 需要迁移 |

**建议**：主要用户在国内 → 使用OSS；国际化 → 使用Supabase

---

## 📊 成本对比

### 测试阶段（个人）

- **低配服务器+OSS**：70-80元/月 ⭐ 推荐
- 中配服务器+服务器存储：80-120元/月
- 按量付费服务器：65-85元/月

### 企业阶段

- **4核8GB+OSS**：400-600元/月
- 8核16GB+OSS：700-1000元/月

---

## ✅ 迁移可行性

### 从测试到企业阶段

**完全可行！** 两种方式：

1. **升级配置**（推荐）
   - 在控制台直接升级服务器配置
   - 5-10分钟完成
   - 零数据丢失
   - OSS数据无需迁移

2. **迁移到新服务器**
   - 创建新服务器
   - 同步代码和数据
   - 修改域名解析
   - OSS数据无需迁移

---

## 🛠️ 自动化工具

### deploy.sh - 自动部署脚本

在服务器上执行：
```bash
cd /var/www/test
bash deploy.sh
```

自动完成：
- 更新代码
- 安装依赖
- 构建项目
- 重启Nginx

---

## 📝 环境变量配置

### OSS配置（.env.local 或 .env.production）

```env
VITE_OSS_REGION=oss-cn-hangzhou
VITE_OSS_ACCESS_KEY_ID=你的AccessKeyID
VITE_OSS_ACCESS_KEY_SECRET=你的AccessKeySecret
VITE_OSS_BUCKET=你的Bucket名称
```

### Supabase配置（可选）

```env
VITE_SUPABASE_URL=你的SupabaseURL
VITE_SUPABASE_ANON_KEY=你的SupabaseKey
```

⚠️ **不要提交 .env 文件到Git！**

---

## 🎯 下一步

1. ✅ 阅读 `COST_OPTIMIZATION.md` 选择方案
2. ✅ 按照对应指南配置存储（OSS或Supabase）
3. ✅ 按照 `ALIYUN_DEPLOY_GUIDE.md` 部署服务器
4. ✅ 使用 `DEPLOY_CHECKLIST.md` 检查完成情况

---

## 💬 需要帮助？

遇到问题：
1. 查看对应指南的"常见问题"部分
2. 检查 `DEPLOY_CHECKLIST.md` 是否遗漏步骤
3. 提供错误信息和执行步骤

---

**祝你部署顺利！🚀**

