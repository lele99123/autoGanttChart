# 学习计划甘特图生成器

这是一个纯静态的学习计划甘特图生成器，使用浏览器本地存储保存数据。

## 特点

- 完全客户端应用，无需后端服务器
- 使用浏览器的localStorage存储所有数据
- 响应式设计，适配不同屏幕尺寸
- 可以导出CSV格式的甘特图数据

## Vercel部署说明

### 前提条件

- GitHub账户
- Vercel账户（可以使用GitHub账户登录）

### 部署步骤

1. 将此项目推送到GitHub仓库
2. 登录Vercel控制台 [https://vercel.com/](https://vercel.com/)
3. 点击 "Import Project" 或 "New Project"
4. 选择你的GitHub仓库
5. 使用以下配置:
   - Framework Preset: 选择 "Other"
   - Build Command: 留空
   - Output Directory: 留空
   - Root Directory: 保持默认值
   - Environment Variables: 不需要添加任何变量

部署完成后，Vercel将提供一个URL以访问你的应用。

### 清理NW.js痕迹

如果在部署中仍然出现 "正在启动服务器..." 的消息，请确保:

1. 你的项目中有以下文件:
   - `vercel.json` - 包含纯静态站点配置
   - `index.html` - 主HTML文件，包含所有应用代码
   - `package.json` - 极简版本，不包含NW.js配置

2. 可以删除这些文件（如果存在）:
   - `server.js`
   - `app-config.json`
   - `db.js`
   - `database.js`
   - `database.sqlite`
   - `start.sh`
   - `/models` 目录
   - `/routes` 目录

3. 修改你的`vercel.json`为:
```json
{
  "buildCommand": false,
  "outputDirectory": ".",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 本地运行

只需要在浏览器中打开`index.html`文件即可。

## 数据存储

所有数据都存储在浏览器的localStorage中，包括:
- 学科和章节数据
- 学习计划
- 章节难度设置

数据不会上传到任何服务器，因此在不同浏览器或设备之间不会同步。 