import { supabase } from '../lib/supabase';

/**
 * 获取所有案例
 */
export const getCases = async () => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
};

/**
 * 上传案例（包含图片）
 */
export const createCase = async (caseData) => {
  try {
    // 1. 先上传图片到 Supabase Storage
    const beforeImageUrl = await uploadImage(caseData.beforeFile, `before_${Date.now()}`);
    const afterImageUrl = await uploadImage(caseData.afterFile, `after_${Date.now()}`);

    // 2. 保存案例数据到数据库
    const { data, error } = await supabase
      .from('cases')
      .insert([
        {
          title: caseData.title,
          tag: caseData.tag || '未分类案例',
          desc: caseData.desc || '效果显著',
          before_image: beforeImageUrl,
          after_image: afterImageUrl,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;
  }
};

/**
 * 上传图片到 Supabase Storage
 */
const uploadImage = async (file, fileName) => {
  try {
    // 如果是 base64 数据，先转换为 Blob
    let blob;
    if (typeof file === 'string' && file.startsWith('data:')) {
      // base64 数据 URL
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

    const { data, error } = await supabase.storage
      .from('case-images')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // 获取公开 URL
    const { data: { publicUrl } } = supabase.storage
      .from('case-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    // 如果上传失败，返回 base64 数据（降级方案）
    if (typeof file === 'string') return file;
    throw error;
  }
};

/**
 * 删除案例
 */
export const deleteCase = async (id) => {
  try {
    // 先获取案例数据，删除关联的图片
    const { data: caseData } = await supabase
      .from('cases')
      .select('before_image, after_image')
      .eq('id', id)
      .single();

    if (caseData) {
      // 从 Storage 删除图片（如果存在）
      if (caseData.before_image && caseData.before_image.includes('supabase.co')) {
        const beforePath = caseData.before_image.split('/').pop();
        await supabase.storage.from('case-images').remove([beforePath]);
      }
      if (caseData.after_image && caseData.after_image.includes('supabase.co')) {
        const afterPath = caseData.after_image.split('/').pop();
        await supabase.storage.from('case-images').remove([afterPath]);
      }
    }

    // 删除数据库记录
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting case:', error);
    throw error;
  }
};

