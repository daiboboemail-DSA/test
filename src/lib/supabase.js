import { createClient } from '@supabase/supabase-js';

// Supabase 配置
// 注意：这些是公开的客户端密钥，可以安全地放在前端代码中
// 实际使用时，你需要：
// 1. 在 https://supabase.com 注册账号
// 2. 创建新项目
// 3. 在项目设置中获取你的 URL 和 anon key
// 4. 替换下面的值

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

