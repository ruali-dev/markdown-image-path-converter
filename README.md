# Markdown Image Path Converter

<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri" alt="Tauri 2.x">
  <img src="https://img.shields.io/badge/Rust-1.70+-orange?logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/Platform-Windows-lightgrey?logo=windows" alt="Windows">
  <img src="https://img.shields.io/badge/Size-~2MB-green" alt="Size">
</p>

<p align="center">
  <a href="README_ZH.md">🇨🇳 中文文档</a>
</p>

A lightweight desktop application that converts local image paths in Markdown files to a unified relative path format.

## ✨ Features

- 🎯 **One-Click Conversion** - Select a Markdown file and convert all image paths instantly
- 🔍 **Live Preview** - See all changes before applying them
- ⚙️ **Custom Prefix** - Set your own target path prefix (default: `upload`)
- 🔄 **Extension Conversion** - Convert image extensions (e.g., `.png` → `.jpg`), leave empty to keep original
- 💾 **Flexible Output** - Overwrite original file or save as a new file
- 🎨 **Modern UI** - Beautiful dark theme with glassmorphism effects
- 📦 **Tiny Size** - Only ~2MB installer (compared to 100MB+ for Electron apps)

## 📸 Screenshot

<p align="center">
  <img src="screenshots/main.png" alt="Application Screenshot" width="700">
</p>

## 🚀 Installation

### Download Installer

Download the latest release from the [Releases](https://github.com/ruali-dev/markdown-image-path-converter/releases) page.

### Build from Source

**Prerequisites:**
- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) 1.70+

```bash
# Clone the repository
git clone https://github.com/ruali-dev/markdown-image-path-converter.git
cd markdown-image-path-converter

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build installer
npm run tauri build
```

## 📖 Usage

1. **Launch** the application
2. **Click** "Browse File" to select a Markdown file
3. **Preview** the path conversions in the preview panel
4. **Adjust** the target prefix if needed (default: `upload`)
5. **Click** "Convert & Overwrite" or "Save As" to apply changes

### Example Conversion

| Before | After |
|--------|-------|
| `![img](D:/blog/images/photo.png)` | `![img](upload/photo.png)` |
| `![](C:\Users\docs\screenshot.jpg)` | `![](upload/screenshot.jpg)` |

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Rust
- **Framework**: [Tauri 2.x](https://tauri.app/)
- **Regex**: Rust `regex` crate

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
