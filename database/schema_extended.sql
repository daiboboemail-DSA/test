-- ============================================
-- 案例库管理系统 - 扩展数据库 Schema
-- ============================================

-- 1. 标签表
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6', -- 十六进制颜色代码
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 案例标签关联表（多对多关系）
CREATE TABLE IF NOT EXISTS case_tags (
  case_id BIGINT REFERENCES cases(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, tag_id)
);

-- 3. 扩展 cases 表（添加新字段）
ALTER TABLE cases ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published'; -- published, draft, hidden
ALTER TABLE cases ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- 4. 创建索引
CREATE INDEX IF NOT EXISTS idx_case_tags_case_id ON case_tags(case_id);
CREATE INDEX IF NOT EXISTS idx_case_tags_tag_id ON case_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_sort_order ON cases(sort_order);

-- 5. 创建更新时间触发器（标签表）
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 创建视图：案例及其标签（方便查询）
CREATE OR REPLACE VIEW cases_with_tags AS
SELECT 
    c.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', t.id,
                'name', t.name,
                'color', t.color
            )
        ) FILTER (WHERE t.id IS NOT NULL),
        '[]'::json
    ) AS tags
FROM cases c
LEFT JOIN case_tags ct ON c.id = ct.case_id
LEFT JOIN tags t ON ct.tag_id = t.id
GROUP BY c.id;

-- 7. 创建函数：获取标签使用次数
CREATE OR REPLACE FUNCTION get_tag_usage_count(tag_id_param BIGINT)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM case_tags
        WHERE tag_id = tag_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- 8. 插入一些默认标签（可选）
INSERT INTO tags (name, color, description) VALUES
    ('红血丝修复', '#EF4444', '针对红血丝问题的案例'),
    ('敏感肌修护', '#F59E0B', '敏感肌修护相关案例'),
    ('屏障修复', '#10B981', '皮肤屏障修复案例'),
    ('抗衰老', '#8B5CF6', '抗衰老相关案例')
ON CONFLICT (name) DO NOTHING;

