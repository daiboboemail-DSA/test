#!/bin/bash

# 阿里云服务器自动部署脚本
# 使用方法：在服务器上执行 bash deploy.sh

set -e  # 遇到错误立即退出

echo "🚀 开始部署项目..."

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 错误：请在项目根目录执行此脚本${NC}"
    exit 1
fi

# 1. 更新代码（如果是从Git克隆的）
if [ -d ".git" ]; then
    echo -e "${YELLOW}📥 更新代码...${NC}"
    git pull || echo "⚠️  Git pull 失败，继续执行..."
fi

# 2. 安装/更新依赖
echo -e "${YELLOW}📦 安装依赖...${NC}"
npm install

# 3. 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build

# 4. 检查构建结果
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败：dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建成功！${NC}"

# 5. 检查 Nginx 配置
if command -v nginx &> /dev/null; then
    echo -e "${YELLOW}🔍 检查 Nginx 配置...${NC}"
    if nginx -t; then
        echo -e "${YELLOW}🔄 重启 Nginx...${NC}"
        systemctl restart nginx
        echo -e "${GREEN}✅ Nginx 已重启${NC}"
    else
        echo -e "${RED}❌ Nginx 配置有误，请检查${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Nginx 未安装，跳过重启步骤${NC}"
fi

echo -e "${GREEN}🎉 部署完成！${NC}"
echo -e "${GREEN}访问你的网站查看效果：http://你的服务器IP${NC}"

