# 案例库管理系统 - 实施计划

## 📊 当前状态分析

### ✅ 已完成
- 前端展示页面（美观的案例展示）
- 基础案例上传功能
- Supabase 数据库集成
- 图片 Base64 存储

### ❌ 缺失功能
- 管理后台界面
- 标签管理系统
- 视频上传和管理
- 案例编辑功能
- 批量操作
- 数据统计

---

## 🎯 实施步骤

### Step 1: 数据库扩展（1-2小时）

#### 1.1 更新数据库 Schema
```sql
-- 创建标签表
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建案例标签关联表
CREATE TABLE IF NOT EXISTS case_tags (
  case_id BIGINT REFERENCES cases(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, tag_id)
);

-- 扩展 cases 表
ALTER TABLE cases ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
ALTER TABLE cases ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
```

#### 1.2 在 Supabase 中执行
1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 执行上述 SQL 语句
4. 配置 RLS 策略（如果需要权限控制）

---

### Step 2: 创建管理后台路由（2-3小时）

#### 2.1 安装依赖
```bash
npm install react-router-dom @tanstack/react-query
```

#### 2.2 创建路由结构
```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 前端展示页面
import FrontendApp from './pages/FrontendApp';
// 管理后台
import AdminApp from './admin/AdminApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontendApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Step 3: 创建管理后台基础框架（3-4小时）

#### 3.1 创建管理后台布局组件
```javascript
// src/admin/components/AdminLayout.jsx
- 侧边栏导航
- 顶部导航栏
- 主内容区
```

#### 3.2 创建管理后台页面
```javascript
// src/admin/pages/
- CasesList.jsx      // 案例列表
- CaseEdit.jsx       // 案例编辑
- TagsList.jsx       // 标签列表
- TagEdit.jsx        // 标签编辑
- MediaLibrary.jsx   // 媒体库
- Dashboard.jsx     // 数据统计
```

---

### Step 4: 实现案例管理功能（4-6小时）

#### 4.1 案例列表页面
- 数据获取（使用 React Query）
- 搜索和筛选功能
- 分页
- 批量操作

#### 4.2 案例编辑页面
- 表单组件
- 图片上传（支持替换）
- 视频上传
- 标签选择（多选）
- 状态管理

#### 4.3 案例服务扩展
```javascript
// src/services/caseService.js
- updateCase()      // 更新案例
- getCaseById()     // 获取单个案例
- searchCases()     // 搜索案例
- batchDelete()     // 批量删除
```

---

### Step 5: 实现标签管理功能（2-3小时）

#### 5.1 标签服务
```javascript
// src/services/tagService.js
- getTags()         // 获取所有标签
- createTag()       // 创建标签
- updateTag()       // 更新标签
- deleteTag()       // 删除标签
- getTagsByCase()   // 获取案例的标签
```

#### 5.2 标签管理界面
- 标签列表
- 标签创建/编辑表单
- 标签颜色选择器

---

### Step 6: 实现媒体管理功能（3-4小时）

#### 6.1 视频上传
- 使用 Supabase Storage（修复之前的问题）
- 或使用 Base64（临时方案）
- 上传进度显示

#### 6.2 媒体库
- 媒体文件浏览
- 媒体删除
- 媒体替换

---

### Step 7: 实现数据统计（2-3小时）

#### 7.1 统计数据获取
```javascript
// src/services/statsService.js
- getCaseStats()    // 案例统计
- getTagStats()     // 标签统计
- getMediaStats()   // 媒体统计
```

#### 7.2 图表展示
- 使用 Recharts 或 Chart.js
- 饼图、柱状图、折线图

---

## 📅 时间估算

| 步骤 | 功能 | 时间 |
|------|------|------|
| Step 1 | 数据库扩展 | 1-2小时 |
| Step 2 | 路由设置 | 2-3小时 |
| Step 3 | 管理后台框架 | 3-4小时 |
| Step 4 | 案例管理 | 4-6小时 |
| Step 5 | 标签管理 | 2-3小时 |
| Step 6 | 媒体管理 | 3-4小时 |
| Step 7 | 数据统计 | 2-3小时 |
| **总计** | | **17-25小时** |

---

## 🎨 向 AI Studio 提要求的模板

### 完整要求模板

```
我需要为现有的案例库管理系统创建一个管理后台。

### 现有项目情况：
- 前端展示页面已完成（React + Vite + Tailwind）
- 使用 Supabase 作为数据库
- 已有基础的案例上传功能

### 需要设计的管理后台功能：

1. **案例管理**
   - 案例列表页面（支持搜索、筛选、排序、分页）
   - 案例编辑页面（表单：标题、描述、标签、图片、视频、状态）
   - 案例创建页面
   - 批量删除功能

2. **标签管理**
   - 标签列表（显示标签名称、颜色、使用次数）
   - 标签创建/编辑表单（名称、颜色、描述）
   - 标签删除（需确认）

3. **媒体管理**
   - 媒体库浏览（图片和视频）
   - 媒体上传（支持拖拽）
   - 媒体删除和替换

4. **数据统计**
   - 概览卡片（案例总数、标签数等）
   - 图表展示（按标签分类、上传趋势）

### 设计要求：
- 与前端展示页面保持一致的设计风格
- 响应式设计（桌面端侧边栏，移动端底部导航）
- 清晰的导航结构
- 友好的用户交互

### 技术栈：
- React + Vite
- Tailwind CSS
- React Router（路由）
- React Query（数据获取）
- Supabase（数据库）

请帮我设计这个管理后台的完整界面和交互流程。
```

---

## 🚀 快速开始建议

### 方案 A: 分阶段实施（推荐）
1. **第一阶段**：先实现核心功能（案例列表、编辑、标签管理）
2. **第二阶段**：添加视频和批量操作
3. **第三阶段**：添加统计和高级功能

### 方案 B: 使用 AI Studio 设计
1. 使用上面的模板向 AI Studio 提要求
2. 获得完整的设计和代码
3. 集成到现有项目中

### 方案 C: 我帮你实现
1. 我可以帮你逐步实现各个功能模块
2. 从最核心的功能开始
3. 逐步完善

---

## 💡 建议

**推荐方案：**
1. 先用 AI Studio 设计管理后台的界面和交互流程
2. 然后我帮你实现具体的功能代码
3. 这样可以快速获得美观的界面，同时确保功能完整

**你想从哪个方案开始？**

