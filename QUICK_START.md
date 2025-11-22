# 🚀 快速开始：5分钟部署到阿里云

## 前提条件
- ✅ 已购买阿里云服务器
- ✅ 知道服务器的公网IP
- ✅ 知道服务器的root密码

---

## 第一步：连接服务器（2分钟）

### Mac/Linux 用户
打开终端，输入：
```bash
ssh root@你的公网IP
```
输入密码（输入时不会显示，直接输入后按回车）

### Windows 用户
使用 PuTTY 或 Xshell 连接服务器

---

## 第二步：一键安装环境（2分钟）

复制以下命令，在服务器上执行：

```bash
# 更新系统
apt update && apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安装 Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 安装 Git
apt install -y git

# 配置 npm 国内镜像（加速）
npm config set registry https://registry.npmmirror.com
```

---

## 第三步：部署项目（1分钟）

```bash
# 进入网站目录
cd /var/www

# 克隆项目（替换为你的仓库地址）
git clone https://github.com/daiboboemail-DSA/test.git

# 进入项目
cd test

# 运行自动部署脚本
chmod +x deploy.sh
bash deploy.sh
```

---

## 第四步：配置 Nginx

```bash
# 编辑配置文件
nano /etc/nginx/sites-available/default
```

找到 `root` 这一行，修改为：
```nginx
root /var/www/test/dist;
```

保存（Ctrl+X，然后Y，然后Enter）

```bash
# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx
```

---

## 完成！🎉

在浏览器访问：`http://你的公网IP`

---

## 后续更新代码

以后只需要在服务器上执行：
```bash
cd /var/www/test
bash deploy.sh
```

---

## 遇到问题？

查看详细指南：`ALIYUN_DEPLOY_GUIDE.md`

