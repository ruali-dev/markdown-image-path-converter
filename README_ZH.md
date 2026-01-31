# Markdown 图片路径转换器

<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri" alt="Tauri 2.x">
  <img src="https://img.shields.io/badge/Rust-1.70+-orange?logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/Platform-Windows-lightgrey?logo=windows" alt="Windows">
  <img src="https://img.shields.io/badge/Size-~2MB-green" alt="Size">
</p>

<p align="center">
  <a href="README.md">🇺🇸 English</a>
</p>

一个轻量级桌面应用，用于将 Markdown 文件中的本地图片路径转换为统一的相对路径格式。

## ✨ 功能特点

- 🎯 **一键转换** - 选择 Markdown 文件，立即转换所有图片路径
- 🔍 **实时预览** - 应用更改前预览所有转换内容
- ⚙️ **自定义前缀** - 设置目标路径前缀（默认：`upload`）
- 💾 **灵活输出** - 覆盖原文件或另存为新文件
- 🎨 **现代界面** - 深色主题 + 玻璃拟态效果
- 📦 **体积小巧** - 安装包仅 ~2MB（对比 Electron 应用 100MB+）

## 📸 截图

应用采用现代深色主题界面：
- 文件选择卡片
- 可自定义路径前缀设置
- 实时转换预览
- 一键转换按钮

## 🚀 安装

### 下载安装包

从 [Releases](https://github.com/ruali-dev/markdown-image-path-converter/releases) 页面下载最新版本。

### 从源码构建

**前置要求：**
- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) 1.70+

```bash
# 克隆仓库
git clone https://github.com/ruali-dev/markdown-image-path-converter.git
cd markdown-image-path-converter

# 安装依赖
npm install

# 开发模式运行
npm run tauri dev

# 构建安装包
npm run tauri build
```

## 📖 使用方法

1. **启动** 应用程序
2. **点击** "浏览文件" 选择一个 Markdown 文件
3. **预览** 预览面板中显示的路径转换
4. **调整** 目标前缀（如需要，默认为 `upload`）
5. **点击** "转换并覆盖" 或 "另存为" 应用更改

### 转换示例

| 转换前 | 转换后 |
|--------|-------|
| `![图片](D:/blog/images/photo.png)` | `![图片](upload/photo.png)` |
| `![](C:\Users\文档\截图.jpg)` | `![](upload/截图.jpg)` |

## 🛠️ 技术栈

- **前端**: HTML, CSS, JavaScript
- **后端**: Rust
- **框架**: [Tauri 2.x](https://tauri.app/)
- **正则**: Rust `regex` crate

## 📝 开源协议

MIT License - 可自由用于任何目的。

## 🤝 贡献

欢迎贡献代码！请随时提交 Pull Request。
