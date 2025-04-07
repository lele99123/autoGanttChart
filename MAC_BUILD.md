# Mac 构建指南

## 前提条件

1. 安装 Node.js (https://nodejs.org/)
2. 安装 Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

## 构建步骤

1. 安装依赖：
   ```bash
   npm install
   ```

2. 转换图标（如果需要）：
   ```bash
   chmod +x convert-icon.sh
   ./convert-icon.sh
   ```

3. 构建应用程序：
   ```bash
   npm run build
   ```

构建完成后，你可以在 `dist` 目录下找到打包好的应用程序。

## 运行应用程序

1. 直接运行：
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

2. 或者使用 npm 脚本：
   ```bash
   npm run nw
   ```

## 注意事项

- 确保 `server.js` 和数据库文件在正确的位置
- 如果遇到权限问题，请使用 `chmod` 命令修改文件权限
- 首次运行时，系统可能会询问是否允许运行应用程序，请在系统偏好设置中允许运行 