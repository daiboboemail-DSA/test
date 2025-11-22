import { supabase, isSupabaseReady, getSupabaseClient } from '../lib/supabase';
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
  // 如果 Supabase 未配置，使用本地存储
  const client = getSupabaseClient();
  if (!client) {
    return getCasesFromLocalStorage();
  }

  try {
    const { data, error } = await client
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
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
  console.log('创建案例 - Supabase 检查:', {
    isReady: isSupabaseReady(),
    clientExists: !!client,
    hasFromMethod: client ? typeof client.from === 'function' : false,
    clientType: typeof client
  });

  // 如果 Supabase 未配置或无效，使用本地存储
  if (!client) {
    console.warn('Supabase 不可用，使用本地存储');
    return createCaseLocal(caseData);
  }

  try {
    console.log('开始创建案例，Supabase 状态:', isSupabaseReady());
    console.log('Supabase 客户端:', client ? '已初始化' : '未初始化');
    
    // 1. 先上传图片（优先使用OSS，然后是Supabase，最后降级到Base64）
    console.log('开始上传图片...');
    const beforeImageUrl = await uploadImage(caseData.beforeFile, `before_${Date.now()}`);
    const afterImageUrl = await uploadImage(caseData.afterFile, `after_${Date.now()}`);
    console.log('图片上传完成:', { beforeImageUrl: beforeImageUrl?.substring(0, 50), afterImageUrl: afterImageUrl?.substring(0, 50) });

    // 2. 保存案例数据到数据库
    console.log('开始保存数据到数据库...');
    
    // 再次获取客户端，确保在异步操作中仍然有效
    const dbClient = getSupabaseClient();
    if (!dbClient) {
      throw new Error('Supabase 客户端在操作过程中变为无效');
    }
    
    const insertData = {
      title: caseData.title,
      tag: caseData.tag || '未分类案例',
      "desc": caseData.desc || '效果显著', // 注意：desc 需要用引号，因为它是保留关键字
      before_image: beforeImageUrl,
      after_image: afterImageUrl,
    };
    console.log('插入数据:', insertData);
    
    const { data, error } = await dbClient
      .from('cases')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('数据库插入错误:', error);
      console.error('错误详情:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('数据保存成功:', data);
    return data;
  } catch (error) {
    console.error('Error creating case:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    // 降级到本地存储
    alert(`保存失败：${error.message}\n\n数据已保存到本地，但刷新后会丢失。\n请检查 Supabase 配置。`);
    return createCaseLocal(caseData);
  }
};

/**
 * 本地存储创建案例（降级方案）
 */
const createCaseLocal = async (caseData) => {
  try {
    // 注意：本地存储不适合存储大图片（Base64），会导致 QuotaExceededError
    // 这里只保存文本信息，不保存图片
    console.warn('⚠️ 使用本地存储（Supabase 未配置或连接失败）');
    console.warn('⚠️ 本地存储不支持大图片，只保存文本信息');
    
    const newCase = {
      id: Date.now(),
      title: caseData.title,
      tag: caseData.tag || '未分类案例',
      desc: caseData.desc || '效果显著',
      before_image: '[本地存储不支持图片]',
      after_image: '[本地存储不支持图片]',
      created_at: new Date().toISOString(),
    };

    // 保存到本地存储（只保存文本信息）
    try {
      const cases = getCasesFromLocalStorage();
      cases.unshift(newCase);
      saveCasesToLocalStorage(cases);
    } catch (storageError) {
      if (storageError.name === 'QuotaExceededError') {
        console.error('❌ 本地存储空间已满，无法保存数据');
        alert('存储空间不足，无法保存到本地。请配置 Supabase 以使用云端存储。');
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
 * 上传图片（优先级：OSS > Supabase Storage > Base64本地存储）
 */
const uploadImage = async (file, fileName) => {
  // 优先级1：尝试使用OSS（如果已配置）
  if (isOSSEnabled()) {
    try {
      const url = await uploadImageToOSS(file, fileName);
      if (url && !url.startsWith('data:')) {
        // OSS上传成功，返回OSS URL
        return url;
      }
      // OSS上传失败，继续尝试其他方案
    } catch (error) {
      console.warn('OSS upload failed, trying Supabase:', error);
    }
  }

  // 优先级2：尝试使用Supabase Storage（如果已配置）
  const client = getSupabaseClient();
  if (client && client.storage) {
    try {
      // 如果是 base64 数据，先转换为 Blob
      let blob;
      if (typeof file === 'string' && file.startsWith('data:')) {
        const response = await fetch(file);
        blob = await response.blob();
      } else if (file instanceof File) {
        blob = file;
      } else {
        throw new Error('Invalid file format');
      }

      // 上传到 Supabase Storage
      const fileExt = fileName.split('.').pop() || 'jpg';
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // 再次获取客户端，确保在异步操作中仍然有效
      const storageClient = getSupabaseClient();
      if (!storageClient || !storageClient.storage || typeof storageClient.storage.from !== 'function') {
        throw new Error('Supabase storage not available');
      }

      const { data, error } = await storageClient.storage
        .from('case-images')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // 获取公开 URL
      const { data: { publicUrl } } = storageClient.storage
        .from('case-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.warn('Supabase upload failed, using Base64:', error);
    }
  }

  // 优先级3：降级到Base64本地存储
  if (typeof file === 'string' && file.startsWith('data:')) {
    return file;
  }
  
  // 转换为Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 删除案例
 */
export const deleteCase = async (id) => {
  // 如果 Supabase 未配置，使用本地存储
  const client = getSupabaseClient();
  if (!client) {
    return deleteCaseLocal(id);
  }

  try {
    // 先获取案例数据，删除关联的图片
    const { data: caseData } = await client
      .from('cases')
      .select('before_image, after_image')
      .eq('id', id)
      .single();

    if (caseData) {
      // 删除图片（支持OSS和Supabase）
      // 优先尝试OSS删除
      if (isOSSEnabled()) {
        await deleteImageFromOSS(caseData.before_image);
        await deleteImageFromOSS(caseData.after_image);
      }
      
      // 如果是Supabase Storage的图片，也删除
      const storageClient = getSupabaseClient();
      if (caseData.before_image && caseData.before_image.includes('supabase.co') && storageClient && storageClient.storage && typeof storageClient.storage.from === 'function') {
        const beforePath = caseData.before_image.split('/').pop();
        await storageClient.storage.from('case-images').remove([beforePath]);
      }
      if (caseData.after_image && caseData.after_image.includes('supabase.co') && storageClient && storageClient.storage && typeof storageClient.storage.from === 'function') {
        const afterPath = caseData.after_image.split('/').pop();
        await storageClient.storage.from('case-images').remove([afterPath]);
      }
    }

    // 再次获取客户端，确保在异步操作中仍然有效
    const dbClient = getSupabaseClient();
    if (!dbClient) {
      throw new Error('Supabase 客户端在操作过程中变为无效');
    }

    // 删除数据库记录
    const { error } = await dbClient
      .from('cases')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting case:', error);
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

