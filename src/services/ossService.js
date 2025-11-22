/**
 * 阿里云OSS对象存储服务
 * 用于替代Supabase Storage，降低存储成本
 */

// OSS配置（从环境变量读取）
const OSS_CONFIG = {
  region: import.meta.env.VITE_OSS_REGION || 'oss-cn-hangzhou', // 例如：oss-cn-hangzhou
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID,
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET,
  bucket: import.meta.env.VITE_OSS_BUCKET || 'your-bucket-name',
};

// 检查OSS是否配置
const isOSSConfigured = OSS_CONFIG.accessKeyId && 
                        OSS_CONFIG.accessKeySecret && 
                        OSS_CONFIG.bucket &&
                        OSS_CONFIG.accessKeyId !== 'YOUR_ACCESS_KEY_ID';

let OSS = null;

// 动态加载OSS SDK（只在需要时加载，减少包体积）
const loadOSS = async () => {
  if (OSS !== undefined) return OSS; // 包括 null 的情况
  
  // 如果 OSS 未配置，直接返回 null
  if (!isOSSConfigured) {
    OSS = null;
    return null;
  }
  
  try {
    // 需要先安装：npm install ali-oss
    // 使用字符串形式的动态 import，避免构建时检查
    const moduleName = 'ali-oss';
    const AliOSS = await import(/* @vite-ignore */ moduleName);
    OSS = AliOSS.default;
    return OSS;
  } catch (error) {
    // OSS SDK 未安装，返回 null 而不是抛出错误
    console.warn('OSS SDK not installed. OSS features will be disabled. To enable, run: npm install ali-oss');
    OSS = null;
    return null;
  }
};

/**
 * 初始化OSS客户端
 */
const getOSSClient = async () => {
  if (!isOSSConfigured) {
    return null;
  }
  
  const AliOSS = await loadOSS();
  if (!AliOSS) {
    return null; // OSS SDK 未安装
  }
  
  return new AliOSS({
    region: OSS_CONFIG.region,
    accessKeyId: OSS_CONFIG.accessKeyId,
    accessKeySecret: OSS_CONFIG.accessKeySecret,
    bucket: OSS_CONFIG.bucket,
  });
};

/**
 * 上传图片到OSS
 * @param {File|Blob|string} file - 文件对象或Base64字符串
 * @param {string} fileName - 文件名（可选，自动生成）
 * @returns {Promise<string>} 返回图片的公开URL
 */
export const uploadImageToOSS = async (file, fileName = null) => {
  if (!isOSSConfigured) {
    // 降级：如果OSS未配置，返回Base64数据URL
    if (typeof file === 'string') {
      return file; // 已经是Base64
    }
    // 转换为Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  try {
    const client = await getOSSClient();
    if (!client) {
      // OSS SDK 未安装，降级到 Base64
      if (typeof file === 'string') {
        return file;
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    
    // 生成文件名
    if (!fileName) {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      const ext = file.name?.split('.').pop() || 'jpg';
      fileName = `cases/${timestamp}-${random}.${ext}`;
    }

    // 如果是Base64字符串，转换为Blob
    let blob;
    if (typeof file === 'string' && file.startsWith('data:')) {
      // Base64转Blob
      const response = await fetch(file);
      blob = await response.blob();
    } else if (file instanceof File || file instanceof Blob) {
      blob = file;
    } else {
      throw new Error('Invalid file type');
    }

    // 上传到OSS
    const result = await client.put(fileName, blob, {
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
      },
    });

    // 返回公开访问URL
    return result.url;
  } catch (error) {
    console.error('OSS upload failed:', error);
    // 降级到Base64
    if (typeof file === 'string') {
      return file;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

/**
 * 删除OSS中的文件
 * @param {string} url - 文件的完整URL
 */
export const deleteImageFromOSS = async (url) => {
  if (!isOSSConfigured || !url) return;

  try {
    const client = await getOSSClient();
    
    // 从URL中提取文件名
    // URL格式：https://bucket-name.oss-region.aliyuncs.com/path/to/file.jpg
    const urlObj = new URL(url);
    const fileName = urlObj.pathname.substring(1); // 去掉开头的/

    await client.delete(fileName);
  } catch (error) {
    console.error('OSS delete failed:', error);
    // 静默失败，不影响主流程
  }
};

/**
 * 检查OSS配置状态
 */
export const isOSSEnabled = isOSSConfigured;

