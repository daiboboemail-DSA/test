# 阿里云服务器部署指南（零基础版）

## 📋 目录
1. [第一步：购买阿里云服务器](#第一步购买阿里云服务器)
2. [第二步：连接服务器](#第二步连接服务器)
3. [第三步：安装必要软件](#第三步安装必要软件)
4. [第四步：部署项目](#第四步部署项目)
5. [第五步：配置域名（可选）](#第五步配置域名可选)
6. [常见问题解决](#常见问题解决)

---

## 第一步：购买阿里云服务器

### 1.1 注册/登录阿里云账号
1. 访问 [阿里云官网](https://www.aliyun.com/)
2. 点击右上角"登录"或"注册"
3. 完成账号注册（需要手机号验证）

### 1.2 购买云服务器 ECS
1. 登录后，点击顶部导航栏的"产品" → 选择"云服务器ECS"
2. 或者直接访问：https://ecs.console.aliyun.com/
3. 点击"创建实例"或"立即购买"

### 1.3 配置服务器参数（重要！）

#### 基础配置
- **付费模式**：选择"包年包月"（适合长期使用）或"按量付费"（适合测试）
- **地域**：选择离你最近的城市（如：华东1-杭州）
- **实例规格**：
  - **入门级**：`ecs.t6-c1m2.large`（2核2GB，适合个人项目）
  - **推荐**：`ecs.t6-c2m4.large`（2核4GB，性能更好）
  - **预算充足**：`ecs.c6.large`（2核4GB，性能更强）

#### 镜像选择（操作系统）
- **推荐选择**：`Ubuntu 22.04 64位` 或 `Ubuntu 20.04 64位`
- 这是最常用的 Linux 系统，适合新手

#### 存储
- **系统盘**：40GB（默认即可，SSD云盘）
- **数据盘**：不需要（后续可以添加）

#### 网络配置
- **专有网络VPC**：使用默认VPC
- **公网IP**：**必须勾选"分配公网IPv4地址"**
- **带宽**：选择"按固定带宽"，设置为 **3Mbps**（够用且便宜）

#### 安全组（防火墙）
- 点击"新建安全组"
- 添加以下规则：
  ```
  规则1：
  - 端口范围：22
  - 授权对象：0.0.0.0/0
  - 说明：SSH远程连接
  
  规则2：
  - 端口范围：80
  - 授权对象：0.0.0.0/0
  - 说明：HTTP网站访问
  
  规则3：
  - 端口范围：443
  - 授权对象：0.0.0.0/0
  - 说明：HTTPS网站访问
  ```

#### 登录凭证（非常重要！）
- **选择"自定义密码"**
- 设置一个强密码（建议包含大小写字母、数字、特殊字符）
- **务必记住这个密码！**（建议保存到密码管理器）

#### 实例名称
- 可以自定义，如：`my-web-server`

### 1.4 确认订单并支付
1. 检查所有配置
2. 选择购买时长（建议先买1个月测试）
3. 点击"确认订单"
4. 完成支付

### 1.5 获取服务器信息
购买成功后，在控制台可以看到：
- **公网IP地址**：例如 `47.xxx.xxx.xxx`（这个很重要！）
- **实例ID**：例如 `i-xxxxx`
- **用户名**：通常是 `root`（Ubuntu系统）

---

## 第二步：连接服务器

### 方法一：使用阿里云控制台（最简单，推荐新手）

1. 登录阿里云控制台
2. 进入"云服务器ECS" → "实例"
3. 找到你的服务器，点击"远程连接"
4. 选择"VNC远程连接"
5. 输入刚才设置的密码
6. 连接成功！

### 方法二：使用SSH工具（Mac/Linux）

#### Mac系统（推荐使用终端）
1. 打开"终端"应用（在"应用程序" → "实用工具"）
2. 输入以下命令：
```bash
ssh root@你的公网IP
```
例如：`ssh root@47.xxx.xxx.xxx`
3. 输入密码（输入时不会显示，直接输入后按回车）
4. 看到 `root@xxx:~#` 就表示连接成功！

#### Windows系统
1. 下载安装 [PuTTY](https://www.putty.org/) 或 [Xshell](https://www.xshell.com/)
2. 打开软件，输入：
   - 主机名：你的公网IP
   - 端口：22
   - 连接类型：SSH
3. 点击"连接"
4. 输入用户名：`root`
5. 输入密码

---

## 第三步：安装必要软件

连接服务器后，在终端中依次执行以下命令：

### 3.1 更新系统（必须）
```bash
apt update && apt upgrade -y
```
等待完成（可能需要几分钟）

### 3.2 安装 Node.js（运行前端项目）
```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v   # 应该显示版本号
```

### 3.3 安装 Nginx（Web服务器）
```bash
apt install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx  # 设置开机自启

# 验证是否运行
systemctl status nginx
```

### 3.4 安装 Git（下载代码）
```bash
apt install -y git
```

### 3.5 安装 PM2（进程管理工具，可选但推荐）
```bash
npm install -g pm2
```

---

## 第四步：部署项目

### 4.1 克隆项目到服务器

```bash
# 进入常用目录
cd /var/www

# 克隆你的项目（替换为你的GitHub仓库地址）
git clone https://github.com/daiboboemail-DSA/test.git

# 进入项目目录
cd test
```

### 4.2 构建项目

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，会在 `dist` 目录生成网站文件。

### 4.3 配置 Nginx

```bash
# 编辑 Nginx 配置文件
nano /etc/nginx/sites-available/default
```

在文件中找到 `server` 块，修改为：

```nginx
server {
    listen 80;
    server_name _;  # 暂时用下划线，有域名后替换为域名
    
    root /var/www/test/dist;  # 指向你的项目构建目录
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

保存文件：
- 按 `Ctrl + X`
- 按 `Y` 确认
- 按 `Enter` 保存

### 4.4 测试并重启 Nginx

```bash
# 测试配置是否正确
nginx -t

# 如果显示 "syntax is ok"，则重启 Nginx
systemctl restart nginx
```

### 4.5 访问网站

在浏览器中输入你的**公网IP地址**，例如：
```
http://47.xxx.xxx.xxx
```

应该能看到你的网站了！🎉

---

## 第五步：配置域名（可选）

如果你有域名，可以绑定到服务器：

### 5.1 域名解析
1. 登录你的域名服务商（如阿里云域名控制台）
2. 找到域名解析设置
3. 添加一条A记录：
   - 主机记录：`@` 或 `www`
   - 记录类型：`A`
   - 记录值：你的服务器公网IP
   - TTL：600

### 5.2 修改 Nginx 配置
```bash
nano /etc/nginx/sites-available/default
```

将 `server_name _;` 改为：
```nginx
server_name 你的域名.com www.你的域名.com;
```

然后重启 Nginx：
```bash
systemctl restart nginx
```

---

## 常见问题解决

### 问题1：无法连接服务器
- **检查**：安全组是否开放了22端口
- **检查**：服务器是否在运行（控制台查看状态）
- **解决**：重启服务器试试

### 问题2：网站无法访问
- **检查**：Nginx 是否运行：`systemctl status nginx`
- **检查**：安全组是否开放了80端口
- **检查**：防火墙是否阻止：`ufw allow 80`

### 问题3：npm install 很慢或失败
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
```

### 问题4：忘记服务器密码
1. 在阿里云控制台，找到你的服务器
2. 点击"更多" → "密码/密钥" → "重置实例密码"
3. 设置新密码后重启服务器

### 问题5：磁盘空间不足
```bash
# 查看磁盘使用情况
df -h

# 清理不需要的文件
apt autoremove -y
apt autoclean
```

### 问题6：需要更新代码
```bash
cd /var/www/test
git pull
npm run build
systemctl restart nginx
```

---

## 快速命令参考

```bash
# 查看服务器状态
systemctl status nginx

# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 日志
tail -f /var/log/nginx/error.log

# 查看服务器资源使用
htop  # 需要先安装：apt install htop

# 查看公网IP
curl ifconfig.me
```

---

## 成本估算

- **入门配置**（2核2GB，3M带宽）：约 **50-80元/月**
- **推荐配置**（2核4GB，3M带宽）：约 **80-120元/月**
- **域名**：约 **10-50元/年**（可选）

---

## 下一步建议

1. ✅ 完成基础部署
2. 🔒 配置 HTTPS（使用 Let's Encrypt 免费证书）
3. 📊 设置监控和日志
4. 🔄 配置自动部署（GitHub Actions → 服务器）

---

## 需要帮助？

如果遇到问题，请提供：
1. 错误信息截图
2. 执行的命令
3. 服务器配置信息

祝你部署顺利！🚀

