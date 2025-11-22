# 📋 阿里云部署检查清单

按照这个清单逐步完成，确保不遗漏任何步骤。

## 购买服务器阶段

- [ ] 注册/登录阿里云账号
- [ ] 购买云服务器 ECS
- [ ] 选择配置（推荐：2核4GB，Ubuntu 22.04）
- [ ] 设置公网IP和带宽（3Mbps）
- [ ] 配置安全组（开放22、80、443端口）
- [ ] 设置root密码（务必记住！）
- [ ] 完成支付
- [ ] 记录公网IP地址：`_________________`

## 连接服务器阶段

- [ ] 成功连接到服务器（SSH或控制台）
- [ ] 能够看到命令行提示符

## 安装环境阶段

- [ ] 执行系统更新：`apt update && apt upgrade -y`
- [ ] 安装 Node.js：`node -v` 显示版本号
- [ ] 安装 Nginx：`systemctl status nginx` 显示运行中
- [ ] 安装 Git：`git --version` 显示版本号
- [ ] 配置 npm 镜像：`npm config get registry` 显示国内镜像地址

## 部署项目阶段

- [ ] 克隆项目到服务器：`cd /var/www/test`
- [ ] 安装依赖：`npm install` 成功
- [ ] 构建项目：`npm run build` 成功
- [ ] 检查 dist 目录存在：`ls dist`

## 配置 Nginx 阶段

- [ ] 编辑 Nginx 配置：`nano /etc/nginx/sites-available/default`
- [ ] 修改 root 路径为：`/var/www/test/dist`
- [ ] 测试配置：`nginx -t` 显示 "syntax is ok"
- [ ] 重启 Nginx：`systemctl restart nginx`

## 测试访问阶段

- [ ] 在浏览器访问：`http://你的公网IP`
- [ ] 网站正常显示
- [ ] 所有功能正常（图片、交互等）

## 安全配置（可选但推荐）

- [ ] 修改 SSH 端口（默认22）
- [ ] 配置防火墙规则
- [ ] 设置 SSH 密钥登录（替代密码）
- [ ] 配置 HTTPS（Let's Encrypt 免费证书）

## 后续维护

- [ ] 了解如何更新代码：`cd /var/www/test && bash deploy.sh`
- [ ] 了解如何查看日志：`tail -f /var/log/nginx/error.log`
- [ ] 了解如何重启服务：`systemctl restart nginx`

---

## 完成时间记录

- 开始时间：`_________________`
- 完成时间：`_________________`
- 总耗时：`_________________`

## 遇到的问题记录

1. 问题：`_________________`
   解决：`_________________`

2. 问题：`_________________`
   解决：`_________________`

---

✅ **全部完成！恭喜你成功部署！** 🎉

