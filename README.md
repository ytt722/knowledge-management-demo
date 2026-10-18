# 知识底座 Demo

产品级领域知识管理交互演示，图谱页面基于 AntV G6 渲染，运行时资源已随项目一并打包，不依赖 CDN。

## 本地启动

需要 Node.js 18 或更高版本。在项目目录执行：

### Windows 一键启动（推荐）

双击项目根目录的 \`start-demo.cmd\`，或在 PowerShell 中执行：

\`\`\`powershell
cd C:\Users\12615\Documents\方案设计\sites\knowledge-management-demo
.\start-demo.cmd
\`\`\`

启动脚本会优先使用系统 Node.js；若系统未安装 Node.js，则尝试使用 Codex 自带的 Node.js，因此不要求本机存在 \`npm\` 命令。

### 使用 npm

\`\`\`powershell
npm start
\`\`\`

也可以直接运行：

\`\`\`powershell
node server.mjs
\`\`\`

浏览器打开 [http://127.0.0.1:4173/#review](http://127.0.0.1:4173/#review)。

## 分享给其他人查看

同一局域网内的访问者可以使用：

\`\`\`text
http://你的本机IP:4173/#review
\`\`\`

需要确保系统防火墙允许 TCP 4173 端口。若需要长期公网访问，可将 \`dist\` 目录部署到 Nginx、IIS、GitHub Pages 或任意静态网站托管服务。

在线演示：[knowledge-management-journey-demo.woodsy-maple-3352.chatgpt.site](https://knowledge-management-journey-demo.woodsy-maple-3352.chatgpt.site/#review)
