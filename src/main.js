// Tauri API
const { invoke } = window.__TAURI__.core;

// DOM 元素
const filePathInput = document.getElementById('file-path');
const browseBtn = document.getElementById('browse-btn');
const targetPrefixInput = document.getElementById('target-prefix');
const targetExtensionInput = document.getElementById('target-extension');
const previewContent = document.getElementById('preview-content');
const changeCountBadge = document.getElementById('change-count');
const convertBtn = document.getElementById('convert-btn');
const saveasBtn = document.getElementById('saveas-btn');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const toast = document.getElementById('toast');

// 状态
let currentFilePath = null;
let originalContent = '';
let changes = [];

// ===== 工具函数 =====

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function setStatus(text, type = 'normal') {
  statusText.textContent = text;
  statusBar.className = `status-bar ${type}`;
}

function updateButtons() {
  const hasChanges = changes.length > 0;
  convertBtn.disabled = !hasChanges;
  saveasBtn.disabled = !currentFilePath;
}

// ===== 核心功能 =====

async function selectFile() {
  try {
    setStatus('正在打开文件选择器...', 'loading');

    // Tauri 2.x dialog 插件 API
    const dialogModule = window.__TAURI__['dialog'] || window.__TAURI__.dialog;

    if (!dialogModule || !dialogModule.open) {
      // 如果 dialog 模块不可用，显示错误信息
      console.error('Dialog module not available:', window.__TAURI__);
      showToast('文件对话框不可用，请使用安装版本', 'error');
      setStatus('就绪');
      return;
    }

    const selected = await dialogModule.open({
      multiple: false,
      filters: [{
        name: 'Markdown',
        extensions: ['md', 'markdown', 'txt']
      }]
    });

    if (selected) {
      filePathInput.value = selected;
      currentFilePath = selected;
      await loadFile(selected);
    } else {
      setStatus('就绪');
    }
  } catch (error) {
    console.error('选择文件错误:', error);
    showToast('选择文件失败: ' + error, 'error');
    setStatus('就绪');
  }
}

async function loadFile(filePath) {
  try {
    setStatus('正在读取文件...', 'loading');
    originalContent = await invoke('read_file', { path: filePath });
    await updatePreview();
    setStatus('文件已加载');
  } catch (error) {
    console.error('读取文件错误:', error);
    setStatus('读取失败', 'error');
    showToast('无法读取文件: ' + error, 'error');
  }
}

async function updatePreview() {
  const prefix = targetPrefixInput.value.trim() || 'upload';
  const extension = targetExtensionInput.value.trim();

  try {
    const result = await invoke('convert_paths', {
      content: originalContent,
      targetPrefix: prefix,
      targetExtension: extension
    });

    changes = result.changes;
    changeCountBadge.textContent = `${changes.length} 处更改`;

    if (changes.length === 0) {
      previewContent.innerHTML = `
        <div class="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          <p>没有发现需要转换的图片路径</p>
        </div>
      `;
    } else {
      previewContent.innerHTML = changes.map((change, index) => `
        <div class="preview-item" style="animation-delay: ${index * 0.05}s">
          <span class="index">${index + 1}.</span>
          <span class="old-path">${escapeHtml(change.old_path)}</span>
          <span class="arrow">→</span>
          <span class="new-path">${escapeHtml(change.new_path)}</span>
        </div>
      `).join('');
    }

    updateButtons();
  } catch (error) {
    console.error('预览错误:', error);
    showToast('预览失败: ' + error, 'error');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function convertAndOverwrite() {
  if (!currentFilePath || changes.length === 0) return;

  try {
    setStatus('正在转换...', 'loading');
    const prefix = targetPrefixInput.value.trim() || 'upload';
    const extension = targetExtensionInput.value.trim();

    await invoke('convert_and_save', {
      path: currentFilePath,
      targetPrefix: prefix,
      targetExtension: extension
    });

    // 重新加载文件以更新预览
    await loadFile(currentFilePath);

    showToast(`✅ 转换完成！已更改 ${changes.length} 处路径`);
    setStatus('转换完成');
  } catch (error) {
    console.error('转换错误:', error);
    setStatus('转换失败', 'error');
    showToast('转换失败: ' + error, 'error');
  }
}

async function saveAs() {
  if (!currentFilePath) return;

  try {
    const dialogModule = window.__TAURI__['dialog'] || window.__TAURI__.dialog;

    if (!dialogModule || !dialogModule.save) {
      showToast('保存对话框不可用', 'error');
      return;
    }

    const savePath = await dialogModule.save({
      defaultPath: 'converted.md',
      filters: [{
        name: 'Markdown',
        extensions: ['md']
      }]
    });

    if (savePath) {
      setStatus('正在保存...', 'loading');
      const prefix = targetPrefixInput.value.trim() || 'upload';
      const extension = targetExtensionInput.value.trim();

      await invoke('convert_and_save_as', {
        sourcePath: currentFilePath,
        targetPath: savePath,
        targetPrefix: prefix,
        targetExtension: extension
      });

      showToast(`✅ 已保存到: ${savePath}`);
      setStatus('保存完成');
    }
  } catch (error) {
    console.error('保存错误:', error);
    setStatus('保存失败', 'error');
    showToast('保存失败: ' + error, 'error');
  }
}

// ===== 事件绑定 =====

browseBtn.addEventListener('click', selectFile);
convertBtn.addEventListener('click', convertAndOverwrite);
saveasBtn.addEventListener('click', saveAs);

// 前缀/后缀输入框变化时更新预览
let debounceTimer;
function handleInputChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    if (originalContent) {
      updatePreview();
    }
  }, 300);
}

targetPrefixInput.addEventListener('input', handleInputChange);
targetExtensionInput.addEventListener('input', handleInputChange);

// 初始化
setStatus('就绪');
