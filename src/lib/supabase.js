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

// 安全地检查 supabase 客户端是否可用
const isSupabaseClientValid = (client) => {
  try {
    if (!client) return false;
    if (typeof client !== 'object') return false;
    if (typeof client.from !== 'function') return false;
    if (!client.storage || typeof client.storage !== 'object') return false;
    if (typeof client.storage.from !== 'function') return false;
    // 测试 storage.from 是否返回有效对象
    try {
      const testBucket = client.storage.from('test');
      if (!testBucket || typeof testBucket !== 'object') return false;
    } catch (e) {
      // 如果测试失败，说明 storage 不可用
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error validating Supabase client:', error);
    return false;
  }
};

// 导出配置状态，供其他模块使用
export const isSupabaseReady = () => {
  const ready = isSupabaseConfigured && isSupabaseClientValid(supabase);
  if (!ready && isSupabaseConfigured) {
    console.error('Supabase 配置了但客户端无效:', {
      isConfigured: isSupabaseConfigured,
      supabaseIsNull: supabase === null,
      supabaseType: typeof supabase,
      hasFromMethod: typeof supabase?.from === 'function',
      hasStorage: !!supabase?.storage
    });
  }
  return ready;
};

// 导出安全访问函数
export const getSupabaseClient = () => {
  try {
    // 首先检查配置
    if (!isSupabaseConfigured) {
      return null;
    }
    
    // 检查客户端是否存在
    if (!supabase || supabase === null) {
      return null;
    }
    
    // 验证客户端是否有效
    if (!isSupabaseClientValid(supabase)) {
      console.warn('Supabase client exists but is not valid');
      return null;
    }
    
    return supabase;
  } catch (error) {
    console.error('Error getting Supabase client:', error);
    return null;
  }
};

