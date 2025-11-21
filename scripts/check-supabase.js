/**
 * Supabase 配置检查脚本
 * 运行: node scripts/check-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 检查 Supabase 配置...\n');

// 检查环境变量
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('❌ 错误: VITE_SUPABASE_URL 未配置');
  console.log('   请在 .env 文件中设置 VITE_SUPABASE_URL');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('❌ 错误: VITE_SUPABASE_ANON_KEY 未配置');
  console.log('   请在 .env 文件中设置 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ 环境变量已配置');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

// 测试连接
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConfig() {
  try {
    // 1. 检查数据库表
    console.log('📊 检查数据库表...');
    const { data: tables, error: tableError } = await supabase
      .from('cases')
      .select('id')
      .limit(1);

    if (tableError) {
      if (tableError.code === 'PGRST116') {
        console.error('❌ 错误: cases 表不存在');
        console.log('   请运行 database/schema.sql 创建表');
      } else {
        console.error('❌ 数据库错误:', tableError.message);
      }
      return false;
    }
    console.log('✅ cases 表存在\n');

    // 2. 检查 Storage bucket
    console.log('📦 检查 Storage bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
      console.error('❌ Storage 错误:', bucketError.message);
      return false;
    }

    const caseImagesBucket = buckets.find(b => b.name === 'case-images');
    if (!caseImagesBucket) {
      console.error('❌ 错误: case-images bucket 不存在');
      console.log('   请在 Supabase Dashboard 中创建 case-images bucket');
      return false;
    }
    console.log('✅ case-images bucket 存在\n');

    // 3. 检查权限（尝试读取）
    console.log('🔐 检查读取权限...');
    const { error: readError } = await supabase
      .from('cases')
      .select('*')
      .limit(1);

    if (readError && readError.code === '42501') {
      console.error('❌ 错误: 没有读取权限');
      console.log('   请设置 RLS 策略允许读取');
      return false;
    }
    console.log('✅ 读取权限正常\n');

    // 4. 检查上传权限（尝试上传测试文件）
    console.log('📤 检查上传权限...');
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFileName = `test_${Date.now()}.txt`;

    const { error: uploadError } = await supabase.storage
      .from('case-images')
      .upload(testFileName, testBlob);

    if (uploadError) {
      if (uploadError.message.includes('new row violates row-level security')) {
        console.error('❌ 错误: 没有上传权限');
        console.log('   请设置 Storage 策略允许上传');
        return false;
      }
      console.error('❌ 上传错误:', uploadError.message);
      return false;
    }

    // 清理测试文件
    await supabase.storage.from('case-images').remove([testFileName]);
    console.log('✅ 上传权限正常\n');

    console.log('🎉 所有检查通过！Supabase 配置正确。\n');
    return true;
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    return false;
  }
}

checkConfig().then(success => {
  process.exit(success ? 0 : 1);
});

