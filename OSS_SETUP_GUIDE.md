# 📦 阿里云OSS对象存储配置指南

## 为什么使用OSS？

- 💰 **省钱**：按量付费，比服务器存储便宜
- 🚀 **快速**：CDN加速，访问速度快
- 📈 **扩展**：自动扩容，无需担心空间
- 🔄 **迁移**：后期升级服务器，OSS数据无需迁移

---

## 第一步：创建OSS存储桶

### 1.1 登录阿里云控制台
1. 访问 [阿里云控制台](https://oss.console.aliyun.com/)
2. 点击"对象存储OSS"

### 1.2 创建Bucket（存储桶）
1. 点击"创建Bucket"
2. 填写配置：
   - **Bucket名称**：例如 `my-case-images`（全局唯一，不能重复）
   - **地域**：选择与服务器相同的地域（降低流量费用）
     - 如果服务器在杭州，选择 `华东1（杭州）`
   - **存储类型**：标准存储
   - **读写权限**：**公共读**（图片需要公开访问）
   - **版本控制**：关闭
   - **服务端加密**：关闭（测试阶段）
3. 点击"确定"

### 1.3 记录Bucket信息
创建成功后，记录：
- **Bucket名称**：`_________________`
- **地域**：`_________________`（例如：oss-cn-hangzhou）

---

## 第二步：创建AccessKey（访问密钥）

### 2.1 创建AccessKey
1. 鼠标悬停在右上角头像
2. 点击"AccessKey管理"
3. 点击"创建AccessKey"
4. **重要**：立即保存以下信息（只显示一次）：
   - **AccessKey ID**：`_________________`
   - **AccessKey Secret**：`_________________`

⚠️ **安全提示**：
- 不要将AccessKey提交到Git仓库
- 不要分享给他人
- 定期轮换密钥

---

## 第三步：配置代码

### 3.1 安装OSS SDK

在项目根目录执行：
```bash
npm install ali-oss
```

### 3.2 配置环境变量

#### 本地开发（.env.local）
创建 `.env.local` 文件：
```env
VITE_OSS_REGION=oss-cn-hangzhou
VITE_OSS_ACCESS_KEY_ID=你的AccessKeyID
VITE_OSS_ACCESS_KEY_SECRET=你的AccessKeySecret
VITE_OSS_BUCKET=你的Bucket名称
```

#### 服务器部署（.env.production）
在服务器上创建 `.env.production` 文件：
```env
VITE_OSS_REGION=oss-cn-hangzhou
VITE_OSS_ACCESS_KEY_ID=你的AccessKeyID
VITE_OSS_ACCESS_KEY_SECRET=你的AccessKeySecret
VITE_OSS_BUCKET=你的Bucket名称
```

⚠️ **不要提交 `.env` 文件到Git！**

### 3.3 修改 caseService.js

将 `src/services/caseService.js` 中的图片上传逻辑改为使用OSS：

```javascript
import { uploadImageToOSS, deleteImageFromOSS, isOSSEnabled } from './ossService';

// 在 createCase 函数中
const beforeImageUrl = await uploadImageToOSS(beforeFile);
const afterImageUrl = await uploadImageToOSS(afterFile);

// 在 deleteCase 函数中
await deleteImageFromOSS(caseItem.before_image);
await deleteImageFromOSS(caseItem.after_image);
```

---

## 第四步：测试上传

### 4.1 本地测试
```bash
npm run dev
```

上传一张图片，检查：
1. 浏览器控制台是否有错误
2. OSS控制台是否能看到上传的文件
3. 图片URL是否能正常访问

### 4.2 服务器部署
```bash
# 在服务器上
cd /var/www/test
git pull
npm install
npm run build
systemctl restart nginx
```

---

## 第五步：配置CDN加速（可选但推荐）

### 5.1 为什么需要CDN？
- 降低流量费用（CDN流量比OSS直连便宜）
- 提高访问速度（就近访问）
- 降低服务器带宽压力

### 5.2 配置步骤
1. 在阿里云控制台，进入"CDN"
2. 添加域名
3. 源站类型选择"OSS域名"
4. 选择你的OSS Bucket
5. 配置完成

### 5.3 修改代码使用CDN域名
在 `ossService.js` 中，可以配置CDN域名：
```javascript
const CDN_DOMAIN = 'https://cdn.yourdomain.com'; // 你的CDN域名

// 上传后返回CDN URL而不是OSS直连URL
```

---

## 成本估算

### OSS存储费用
- **标准存储**：0.12元/GB/月
- **流量费用**：0.5元/GB（直连）或 0.24元/GB（CDN）

### 示例计算（100GB图片）
- 存储费用：100GB × 0.12元 = 12元/月
- 流量费用（假设50GB/月）：
  - 直连：50GB × 0.5元 = 25元/月
  - CDN：50GB × 0.24元 = 12元/月
- **总计**：24-37元/月（比服务器存储便宜很多）

---

## 安全配置

### 1. 设置Bucket策略（推荐）
只允许上传，不允许删除（通过代码控制删除）：
```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "oss:GetObject",
      "Resource": "acs:oss:*:*:your-bucket-name/*"
    }
  ]
}
```

### 2. 使用STS临时凭证（高级，可选）
对于生产环境，建议使用STS临时凭证，而不是直接使用AccessKey。

---

## 常见问题

### Q1: 上传失败，提示权限不足
**解决**：检查AccessKey是否有OSS的读写权限

### Q2: 图片无法访问
**解决**：检查Bucket的读写权限是否为"公共读"

### Q3: 流量费用太高
**解决**：配置CDN，使用CDN域名访问

### Q4: 如何迁移现有图片？
**解决**：使用OSS控制台的"数据迁移"功能，或编写脚本批量上传

---

## 迁移检查清单

- [ ] 创建OSS Bucket
- [ ] 创建AccessKey
- [ ] 配置环境变量
- [ ] 安装OSS SDK：`npm install ali-oss`
- [ ] 修改代码使用OSS
- [ ] 本地测试上传
- [ ] 服务器部署测试
- [ ] 配置CDN（可选）
- [ ] 监控费用使用情况

---

## 下一步

完成OSS配置后，你的应用将：
- ✅ 图片存储在OSS，不占用服务器空间
- ✅ 访问速度快（CDN加速）
- ✅ 成本低（按量付费）
- ✅ 后期升级服务器时，OSS数据无需迁移

🎉 **配置完成！开始省钱吧！**

