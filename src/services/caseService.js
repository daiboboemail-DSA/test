import { isSupabaseReady, getSupabaseClient } from '../lib/supabase';
import { uploadImageToOSS, deleteImageFromOSS, isOSSEnabled } from './ossService';

// 本地存储键名
const STORAGE_KEY = 'case_library_cases';

/**
 * 从本地存储获取案例
 */
const getCasesFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * 保存案例到本地存储
 */
const saveCasesToLocalStorage = (cases) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 获取所有案例
 */
export const getCases = async () => {
  // 优先使用 Supabase 数据库
  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase 未配置，使用本地存储');
    return getCasesFromLocalStorage();
  }

  try {
    // 安全地调用 Supabase
    if (typeof client.from !== 'function') {
      throw new Error('Supabase client.from is not a function');
    }
    
    const queryResult = await client
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    // 安全地检查返回结果
    if (!queryResult) {
      throw new Error('Query returned no result');
    }
    
    if (queryResult.error) {
      throw queryResult.error;
    }

    return queryResult.data || [];
  } catch (error) {
    console.error('Error fetching cases from Supabase:', error);
    // 降级到本地存储
    return getCasesFromLocalStorage();
  }
};

/**
 * 上传案例（包含图片）
 */
export const createCase = async (caseData) => {
  // 检查 Supabase 是否可用
  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase 未配置，使用本地存储');
    return createCaseLocal(caseData);
  }

  try {
    console.log('开始创建案例，使用 Supabase 数据库...');
    
    // 1. 上传图片为 Base64（不使用 Supabase Storage，避免错误）
    console.log('开始上传图片到 Base64...');
    const beforeImageUrl = await uploadImage(caseData.beforeFile, `before_${Date.now()}`);
    const afterImageUrl = await uploadImage(caseData.afterFile, `after_${Date.now()}`);
    console.log('图片上传完成（Base64 格式）');

    // 2. 保存案例数据到 Supabase 数据库
    console.log('开始保存数据到数据库...');
    
    // 再次获取客户端，确保在异步操作中仍然有效
    const dbClient = getSupabaseClient();
    if (!dbClient) {
      throw new Error('Supabase 客户端在操作过程中变为无效');
    }
    
    if (typeof dbClient.from !== 'function') {
      throw new Error('Supabase client.from is not a function');
    }
    
    const insertData = {
      title: caseData.title,
      tag: caseData.tag || '未分类案例',
      "desc": caseData.desc || '效果显著', // 注意：desc 需要用引号，因为它是保留关键字
      before_image: beforeImageUrl, // Base64 格式的图片
      after_image: afterImageUrl,   // Base64 格式的图片
    };
    console.log('准备插入数据到数据库...');
    
    // 安全地调用 insert
    const insertResult = await dbClient
      .from('cases')
      .insert([insertData])
      .select()
      .single();

    // 安全地检查返回结果
    if (!insertResult) {
      throw new Error('Insert returned no result');
    }
    
    if (insertResult.error) {
      console.error('数据库插入错误:', insertResult.error);
      throw insertResult.error;
    }
    
    console.log('✅ 数据保存成功到 Supabase 数据库');
    return insertResult.data;
  } catch (error) {
    console.error('Error creating case:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    // 降级到本地存储
    console.warn('降级到本地存储...');
    return createCaseLocal(caseData);
  }
};

/**
 * 本地存储创建案例（降级方案）
 */
const createCaseLocal = async (caseData) => {
  try {
    console.warn('⚠️ 使用本地存储（Supabase 暂时禁用）');
    
    // 先上传图片为 Base64
    console.log('开始上传图片到 Base64...');
    const beforeImageUrl = await uploadImage(caseData.beforeFile, `before_${Date.now()}`);
    const afterImageUrl = await uploadImage(caseData.afterFile, `after_${Date.now()}`);
    console.log('图片上传完成');
    
    const newCase = {
      id: Date.now(),
      title: caseData.title,
      tag: caseData.tag || '未分类案例',
      desc: caseData.desc || '效果显著',
      before_image: beforeImageUrl,
      after_image: afterImageUrl,
      created_at: new Date().toISOString(),
    };

    // 保存到本地存储（包含 Base64 图片）
    try {
      const cases = getCasesFromLocalStorage();
      cases.unshift(newCase);
      saveCasesToLocalStorage(cases);
      console.log('✅ 案例已保存到本地存储');
    } catch (storageError) {
      if (storageError.name === 'QuotaExceededError') {
        console.error('❌ 本地存储空间已满，无法保存数据');
        alert('存储空间不足，无法保存到本地。图片太大，请配置 Supabase 以使用云端存储。');
        throw new Error('本地存储空间已满');
      }
      throw storageError;
    }

    return newCase;
  } catch (error) {
    console.error('Error creating case locally:', error);
    throw error;
  }
};

/**
 * 上传图片（临时方案：直接使用 Base64）
 */
const uploadImage = async (file, fileName) => {
  console.log('开始上传图片到 Base64...');
  
  // 如果已经是 Base64 字符串，直接返回
  if (typeof file === 'string' && file.startsWith('data:')) {
    console.log('文件已经是 Base64 格式');
    return file;
  }
  
  // 转换为 Base64
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Base64 转换成功');
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.error('Base64 转换失败:', error);
        reject(error);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('创建 FileReader 失败:', error);
      reject(error);
    }
  });
};

/**
 * 删除案例
 */
export const deleteCase = async (id) => {
  // 优先使用 Supabase 数据库
  const client = getSupabaseClient();
  if (!client) {
    console.warn('Supabase 未配置，使用本地存储删除');
    return deleteCaseLocal(id);
  }

  try {
    // 安全地调用 Supabase
    if (typeof client.from !== 'function') {
      throw new Error('Supabase client.from is not a function');
    }

    // 删除数据库记录
    const deleteResult = await client
      .from('cases')
      .delete()
      .eq('id', id);

    // 安全地检查返回结果
    if (!deleteResult) {
      throw new Error('Delete returned no result');
    }
    
    if (deleteResult.error) {
      throw deleteResult.error;
    }

    console.log('✅ 案例已从 Supabase 数据库删除');
    return true;
  } catch (error) {
    console.error('Error deleting case from Supabase:', error);
    // 降级到本地存储
    return deleteCaseLocal(id);
  }
};

/**
 * 本地存储删除案例（降级方案）
 */
const deleteCaseLocal = async (id) => {
  try {
    const cases = getCasesFromLocalStorage();
    const filtered = cases.filter(c => c.id !== id);
    saveCasesToLocalStorage(filtered);
    return true;
  } catch (error) {
    console.error('Error deleting case locally:', error);
    throw error;
  }
};

