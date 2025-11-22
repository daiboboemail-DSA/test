import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 检查配置是否有效
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

// 调试信息
if (typeof window !== 'undefined') {
  console.log('Supabase 配置检查:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '未配置',
    isConfigured: isSupabaseConfigured
  });
}

// 如果未配置，创建一个虚拟客户端（避免崩溃）
let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase 客户端创建成功');
  } catch (error) {
    console.error('创建 Supabase 客户端失败:', error);
    supabaseClient = null;
  }
} else {
  console.warn('Supabase 未配置，客户端为 null');
}

export const supabase = supabaseClient;

// 导出配置状态，供其他模块使用
export const isSupabaseReady = () => {
  const ready = isSupabaseConfigured && supabase !== null && typeof supabase?.from === 'function';
  if (!ready && isSupabaseConfigured) {
    console.error('Supabase 配置了但客户端无效:', {
      isConfigured: isSupabaseConfigured,
      supabaseIsNull: supabase === null,
      hasFromMethod: typeof supabase?.from === 'function'
    });
  }
  return ready;
};

