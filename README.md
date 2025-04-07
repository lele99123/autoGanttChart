# 学习计划甘特图生成器

一个用于创建和管理学习计划的甘特图应用程序。

## 功能特点

- 创建和管理学习计划
- 为每个计划添加任务
- 可视化显示计划进度
- 支持按日期筛选计划
- 支持导出计划数据

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Node.js, Express
- 数据库：MongoDB (Vercel部署) / SQLite (本地开发)

## 本地开发

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/autoganttchart.git
   cd autoganttchart
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建 `.env` 文件并配置环境变量：
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

4. 启动开发服务器：
   ```bash
   npm run dev
   ```

5. 在浏览器中访问 `http://localhost:3000`

## Vercel 部署

1. 在 [Vercel](https://vercel.com) 上创建账号

2. 安装 Vercel CLI：
   ```bash
   npm install -g vercel
   ```

3. 登录 Vercel：
   ```bash
   vercel login
   ```

4. 部署项目：
   ```bash
   vercel
   ```

5. 在 Vercel 仪表板中配置环境变量：
   - 添加 `MONGODB_URI` 环境变量

## 构建桌面应用

### Windows

```bash
npm run build
```

构建输出将位于 `dist` 目录中。

### Mac

1. 确保已安装 Xcode Command Line Tools
2. 运行构建命令：
   ```bash
   npm run build
   ```

## 许可证

MIT 