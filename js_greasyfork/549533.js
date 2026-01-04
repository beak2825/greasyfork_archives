// ==UserScript==
// @name         Remote Emoji Picker for Linux.do
// @namespace    https://linux.do/
// @version      1.0.1
// @description  从远程 JSON 加载表情包并注入表情选择器到 Linux.do 论坛
// @author       stevessr
// @match        https://linux.do/*
// @match        https://*.linux.do/*
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef76f9c0f8d9_2_32x32.png
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549533/Remote%20Emoji%20Picker%20for%20Linuxdo.user.js
// @updateURL https://update.greasyfork.org/scripts/549533/Remote%20Emoji%20Picker%20for%20Linuxdo.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ============== 配置 ==============
  const CONFIG = {
    // 远程 JSON URL - 可以通过油猴菜单修改
    remoteUrl: GM_getValue('remoteUrl', 'https://video2gif-pages.pages.dev/assets/defaultEmojiGroups.json'),
    // 缓存有效期（毫秒）- 默认 1 小时
    cacheDuration: 60 * 60 * 1000,
    // 图片输出缩放比例
    imageScale: GM_getValue('imageScale', 30),
    // 输出格式：'markdown' 或 'html'
    outputFormat: GM_getValue('outputFormat', 'markdown'),
    // 是否显示搜索栏
    showSearchBar: true,
    // 是否启用悬浮预览
    enableHoverPreview: GM_getValue('enableHoverPreview', true),
    // 视图模式：'auto', 'desktop', 'mobile'
    viewMode: GM_getValue('viewMode', 'auto')
  };

  // ============== 移动端检测 ==============
  function isMobile() {
    const userAgent = navigator.userAgent;
    const mobileKeywords = ['Android', 'iPhone', 'iPad', 'iPod', 'Windows Phone'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword));
  }

  function shouldUseMobileView() {
    if (CONFIG.viewMode === 'mobile') return true;
    if (CONFIG.viewMode === 'desktop') return false;
    return isMobile();
  }

  // ============== 注册油猴菜单 ==============
  GM_registerMenuCommand('设置远程 JSON URL', () => {
    const url = prompt('请输入远程 JSON URL:', CONFIG.remoteUrl);
    if (url !== null) {
      GM_setValue('remoteUrl', url);
      CONFIG.remoteUrl = url;
      localStorage.removeItem('emoji_remote_cache_timestamp');
      alert('URL 已设置，请刷新页面加载新配置');
    }
  });

  GM_registerMenuCommand('设置图片缩放比例', () => {
    const scale = prompt('请输入缩放比例 (1-100):', CONFIG.imageScale);
    if (scale !== null) {
      const num = parseInt(scale, 10);
      if (!isNaN(num) && num >= 1 && num <= 100) {
        GM_setValue('imageScale', num);
        CONFIG.imageScale = num;
        alert('缩放比例已设置为 ' + num + '%');
      }
    }
  });

  GM_registerMenuCommand('切换输出格式', () => {
    const newFormat = CONFIG.outputFormat === 'markdown' ? 'html' : 'markdown';
    GM_setValue('outputFormat', newFormat);
    CONFIG.outputFormat = newFormat;
    alert('输出格式已切换为：' + newFormat);
  });

  GM_registerMenuCommand('清除缓存', () => {
    localStorage.removeItem('emoji_remote_cache');
    localStorage.removeItem('emoji_remote_cache_timestamp');
    alert('缓存已清除，请刷新页面');
  });

  GM_registerMenuCommand('切换视图模式', () => {
    const modes = ['auto', 'desktop', 'mobile'];
    const modeLabels = { auto: '自动', desktop: '桌面', mobile: '移动' };
    const currentIndex = modes.indexOf(CONFIG.viewMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    GM_setValue('viewMode', nextMode);
    CONFIG.viewMode = nextMode;
    alert('视图模式已切换为：' + modeLabels[nextMode] + (nextMode === 'auto' ? ' (当前检测：' + (isMobile() ? '移动' : '桌面') + ')' : ''));
  });

  // ============== 存储工具 ==============
  const CACHE_KEY = 'emoji_remote_cache';
  const CACHE_TIME_KEY = 'emoji_remote_cache_timestamp';

  function loadCache() {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function saveCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } catch (e) {
      console.warn('[Remote Emoji] 缓存保存失败：', e);
    }
  }

  function isCacheValid() {
    try {
      const timestamp = localStorage.getItem(CACHE_TIME_KEY);
      if (!timestamp) return false;
      return Date.now() - parseInt(timestamp, 10) < CONFIG.cacheDuration;
    } catch (e) {
      return false;
    }
  }

  // ============== 远程加载 ==============
  function fetchRemoteConfig(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('未设置远程 URL'));
        return;
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
          try {
            const data = JSON.parse(response.responseText);
            if (data.groups && Array.isArray(data.groups)) {
              resolve(data.groups);
            } else if (Array.isArray(data)) {
              resolve(data);
            } else {
              reject(new Error('无效的 JSON 格式'));
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }

  // ============== 表情数据管理 ==============
  let emojiGroups = [];

  async function loadEmojiGroups() {
    // 先尝试使用缓存
    if (isCacheValid()) {
      const cached = loadCache();
      if (cached && cached.length > 0) {
        emojiGroups = cached;
        console.log('[Remote Emoji] 使用缓存数据');
        // 后台刷新
        refreshInBackground();
        return;
      }
    }

    // 从远程加载
    if (!CONFIG.remoteUrl) {
      console.warn('[Remote Emoji] 未设置远程 URL，请通过油猴菜单设置');
      return;
    }

    try {
      console.log('[Remote Emoji] 从远程加载：', CONFIG.remoteUrl);
      const groups = await fetchRemoteConfig(CONFIG.remoteUrl);
      emojiGroups = groups;
      saveCache(groups);
      console.log('[Remote Emoji] 加载成功，共', groups.length, '个分组');
    } catch (e) {
      console.error('[Remote Emoji] 远程加载失败：', e);
      // 尝试使用过期缓存
      const cached = loadCache();
      if (cached) {
        emojiGroups = cached;
        console.log('[Remote Emoji] 使用过期缓存');
      }
    }
  }

  function refreshInBackground() {
    if (!CONFIG.remoteUrl) return;
    fetchRemoteConfig(CONFIG.remoteUrl).then(groups => {
      emojiGroups = groups;
      saveCache(groups);
      console.log('[Remote Emoji] 后台刷新完成');
    }).catch(() => {});
  }

  // ============== 样式注入 ==============
  const ANIMATION_DURATION = 200;

  function injectStyles() {
    if (document.getElementById('remote-emoji-picker-styles')) return;

    const css = `
      /* 悬浮预览 */
      .emoji-picker-hover-preview {
        position: fixed;
        pointer-events: none;
        display: none;
        z-index: 1000002;
        max-width: 320px;
        max-height: 320px;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.32);
        background: var(--secondary, #fff);
        padding: 8px;
        border: 1px solid var(--primary-low, #ddd);
      }
      .emoji-picker-hover-preview img {
        display: block;
        max-width: 100%;
        max-height: 220px;
        object-fit: contain;
      }
      .emoji-picker-hover-preview .label {
        font-size: 12px;
        color: var(--primary, #333);
        margin-top: 8px;
        text-align: center;
        word-break: break-word;
      }

      /* 选择器容器 */
      .remote-emoji-picker {
        position: fixed;
        z-index: 999999;
        background: var(--secondary, #fff);
        border: 1px solid var(--primary-low, #ddd);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        max-width: 400px;
        max-height: 450px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* 进入动画 */
      .remote-emoji-picker.picker-enter {
        opacity: 0 !important;
        transform: scale(0.95) translateY(-8px) !important;
      }
      .remote-emoji-picker.picker-enter-active {
        opacity: 1 !important;
        transform: scale(1) translateY(0) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-out, transform ${ANIMATION_DURATION}ms ease-out !important;
      }

      /* 退出动画 */
      .remote-emoji-picker.picker-exit {
        opacity: 1 !important;
        transform: scale(1) translateY(0) !important;
      }
      .remote-emoji-picker.picker-exit-active {
        opacity: 0 !important;
        transform: scale(0.95) translateY(-8px) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in !important;
      }

      /* 搜索栏 */
      .remote-emoji-picker .search-bar {
        padding: 8px;
        border-bottom: 1px solid var(--primary-low, #eee);
        display: flex;
        gap: 8px;
      }
      .remote-emoji-picker .search-bar input {
        flex: 1;
        padding: 6px 10px;
        border: 1px solid var(--primary-low, #ddd);
        border-radius: 4px;
        font-size: 14px;
        background: var(--secondary, #fff);
        color: var(--primary, #333);
      }
      .remote-emoji-picker .search-bar .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--primary, #666);
        padding: 0 8px;
      }

      /* 分组导航 */
      .remote-emoji-picker .group-nav {
        display: flex;
        gap: 4px;
        padding: 6px 8px;
        border-bottom: 1px solid var(--primary-low, #eee);
        overflow-x: auto;
        flex-shrink: 0;
      }
      .remote-emoji-picker .group-nav button {
        background: none;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 16px;
        flex-shrink: 0;
      }
      .remote-emoji-picker .group-nav button:hover {
        background: var(--primary-very-low, #f0f0f0);
      }
      .remote-emoji-picker .group-nav button.active {
        background: var(--tertiary, #007bff);
        color: white;
      }
      .remote-emoji-picker .group-nav button img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        vertical-align: middle;
      }

      /* 内容区 */
      .remote-emoji-picker .content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      /* 分组区块 */
      .remote-emoji-picker .group-section {
        margin-bottom: 16px;
      }
      .remote-emoji-picker .group-section h3 {
        font-size: 12px;
        color: var(--primary-medium, #888);
        margin: 0 0 8px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--primary-very-low, #eee);
      }
      .remote-emoji-picker .emoji-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 4px;
      }
      .remote-emoji-picker .emoji-grid img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        cursor: pointer;
        border-radius: 4px;
        transition: transform 0.1s, background 0.1s;
      }
      .remote-emoji-picker .emoji-grid img:hover {
        transform: scale(1.2);
        background: var(--primary-very-low, #f0f0f0);
      }

      /* 工具栏按钮 */
      .remote-emoji-toolbar-btn {
        background: none;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 18px;
        border-radius: 4px;
      }
      .remote-emoji-toolbar-btn:hover {
        background: var(--primary-very-low, #f0f0f0);
      }

      /* ============== 移动端样式 ============== */
      /* 移动端遮罩 */
      .remote-emoji-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999998;
      }
      .remote-emoji-backdrop.backdrop-enter {
        opacity: 0 !important;
      }
      .remote-emoji-backdrop.backdrop-enter-active {
        opacity: 1 !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-out !important;
      }
      .remote-emoji-backdrop.backdrop-exit {
        opacity: 1 !important;
      }
      .remote-emoji-backdrop.backdrop-exit-active {
        opacity: 0 !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-in !important;
      }

      /* 移动端模态框 */
      .remote-emoji-modal {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        background: var(--secondary, #fff);
        border-radius: 16px 16px 0 0;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .remote-emoji-modal.modal-enter {
        opacity: 0 !important;
        transform: translateY(100%) !important;
      }
      .remote-emoji-modal.modal-enter-active {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-out, transform ${ANIMATION_DURATION}ms ease-out !important;
      }
      .remote-emoji-modal.modal-exit {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      .remote-emoji-modal.modal-exit-active {
        opacity: 0 !important;
        transform: translateY(100%) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in !important;
      }

      /* 移动端头部 */
      .remote-emoji-modal .modal-header {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--primary-low, #eee);
        gap: 12px;
      }
      .remote-emoji-modal .modal-header input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid var(--primary-low, #ddd);
        border-radius: 8px;
        font-size: 16px;
        background: var(--secondary, #fff);
        color: var(--primary, #333);
      }
      .remote-emoji-modal .modal-header .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--primary, #666);
        padding: 4px 8px;
      }

      /* 移动端分组导航 */
      .remote-emoji-modal .group-nav {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--primary-low, #eee);
        overflow-x: auto;
        flex-shrink: 0;
        -webkit-overflow-scrolling: touch;
      }
      .remote-emoji-modal .group-nav button {
        background: none;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 8px;
        font-size: 20px;
        flex-shrink: 0;
      }
      .remote-emoji-modal .group-nav button:hover,
      .remote-emoji-modal .group-nav button:active {
        background: var(--primary-very-low, #f0f0f0);
      }
      .remote-emoji-modal .group-nav button.active {
        background: var(--tertiary, #007bff);
        color: white;
      }
      .remote-emoji-modal .group-nav button img {
        width: 22px;
        height: 22px;
        object-fit: contain;
        vertical-align: middle;
      }

      /* 移动端内容区 */
      .remote-emoji-modal .content {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        -webkit-overflow-scrolling: touch;
      }

      /* 移动端分组区块 */
      .remote-emoji-modal .group-section {
        margin-bottom: 20px;
      }
      .remote-emoji-modal .group-section h3 {
        font-size: 14px;
        color: var(--primary-medium, #888);
        margin: 0 0 10px 0;
        padding-bottom: 6px;
        border-bottom: 1px solid var(--primary-very-low, #eee);
      }
      .remote-emoji-modal .emoji-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }
      .remote-emoji-modal .emoji-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: contain;
        cursor: pointer;
        border-radius: 8px;
        padding: 4px;
        transition: background 0.1s;
      }
      .remote-emoji-modal .emoji-grid img:active {
        background: var(--primary-very-low, #f0f0f0);
      }
    `;

    const style = document.createElement('style');
    style.id = 'remote-emoji-picker-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ============== 悬浮预览 ==============
  let hoverPreview = null;

  function ensureHoverPreview() {
    if (!hoverPreview) {
      hoverPreview = document.createElement('div');
      hoverPreview.className = 'emoji-picker-hover-preview';
      hoverPreview.innerHTML = '<img><div class="label"></div>';
      document.body.appendChild(hoverPreview);
    }
    return hoverPreview;
  }

  function bindHoverPreview(imgEl, emoji) {
    if (!CONFIG.enableHoverPreview) return;

    const preview = ensureHoverPreview();
    const previewImg = preview.querySelector('img');
    const previewLabel = preview.querySelector('.label');

    imgEl.addEventListener('mouseenter', (e) => {
      previewImg.src = emoji.url;
      previewLabel.textContent = emoji.name || '';
      preview.style.display = 'block';
      movePreview(e);
    });

    imgEl.addEventListener('mousemove', movePreview);

    imgEl.addEventListener('mouseleave', () => {
      preview.style.display = 'none';
    });

    function movePreview(e) {
      const pad = 12;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const rect = preview.getBoundingClientRect();
      let left = e.clientX + pad;
      let top = e.clientY + pad;
      if (left + rect.width > vw) left = e.clientX - rect.width - pad;
      if (top + rect.height > vh) top = e.clientY - rect.height - pad;
      preview.style.left = left + 'px';
      preview.style.top = top + 'px';
    }
  }

  // ============== 插入表情 ==============
  function insertEmoji(emoji) {
    // 查找编辑器
    const selectors = [
      'textarea.d-editor-input',
      'textarea.ember-text-area',
      '.ProseMirror.d-editor-input',
      '[contenteditable="true"]'
    ];

    let editor = null;
    for (const sel of selectors) {
      editor = document.querySelector(sel);
      if (editor) break;
    }

    if (!editor) {
      console.error('[Remote Emoji] 找不到编辑器');
      return;
    }

    // 构建插入文本
    const width = emoji.width || 500;
    const height = emoji.height || 500;
    const scale = CONFIG.imageScale;

    let insertText = '';
    if (CONFIG.outputFormat === 'html') {
      const scaledWidth = Math.max(1, Math.round(width * (scale / 100)));
      const scaledHeight = Math.max(1, Math.round(height * (scale / 100)));
      insertText = `<img src="${emoji.url}" title=":${emoji.name}:" class="emoji" alt=":${emoji.name}:" loading="lazy" width="${scaledWidth}" height="${scaledHeight}"> `;
    } else {
      insertText = `![${emoji.name}|${width}x${height},${scale}%](${emoji.url}) `;
    }

    // 插入到 textarea
    if (editor.tagName === 'TEXTAREA') {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + insertText + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + insertText.length;
      editor.focus();
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // 插入到 ProseMirror 或 contenteditable
    else {
      try {
        const dataTransfer = new DataTransfer();
        if (CONFIG.outputFormat === 'html') {
          dataTransfer.setData('text/html', insertText);
        } else {
          dataTransfer.setData('text/plain', insertText);
        }
        const pasteEvent = new ClipboardEvent('paste', { clipboardData: dataTransfer, bubbles: true });
        editor.dispatchEvent(pasteEvent);
      } catch (e) {
        // Fallback
        document.execCommand('insertText', false, insertText);
      }
    }
  }

  // ============== 表情选择器 ==============
  let currentPicker = null;
  let currentBackdrop = null;
  let isAnimating = false;

  // 关闭移动端模态框
  function closeMobilePicker(callback) {
    if (isAnimating) {
      if (callback) callback();
      return;
    }

    if (!currentPicker && !currentBackdrop) {
      if (callback) callback();
      return;
    }

    isAnimating = true;

    // 隐藏悬浮预览
    if (hoverPreview) {
      hoverPreview.style.display = 'none';
    }

    // 遮罩退出动画
    if (currentBackdrop) {
      currentBackdrop.classList.add('backdrop-exit');
      void currentBackdrop.offsetHeight;
      currentBackdrop.classList.remove('backdrop-exit');
      currentBackdrop.classList.add('backdrop-exit-active');
    }

    // 模态框退出动画
    if (currentPicker) {
      currentPicker.classList.add('modal-exit');
      void currentPicker.offsetHeight;
      currentPicker.classList.remove('modal-exit');
      currentPicker.classList.add('modal-exit-active');
    }

    setTimeout(() => {
      if (currentBackdrop) {
        currentBackdrop.remove();
        currentBackdrop = null;
      }
      if (currentPicker) {
        currentPicker.remove();
        currentPicker = null;
      }
      isAnimating = false;
      if (callback) callback();
    }, ANIMATION_DURATION);
  }

  // 关闭桌面端选择器
  function closeDesktopPicker(callback) {
    if (!currentPicker || isAnimating) {
      if (callback) callback();
      return;
    }

    isAnimating = true;

    // 隐藏悬浮预览
    if (hoverPreview) {
      hoverPreview.style.display = 'none';
    }

    // 添加退出动画
    currentPicker.classList.add('picker-exit');
    void currentPicker.offsetHeight;
    currentPicker.classList.remove('picker-exit');
    currentPicker.classList.add('picker-exit-active');

    setTimeout(() => {
      if (currentPicker) {
        currentPicker.remove();
        currentPicker = null;
      }
      isAnimating = false;
      if (callback) callback();
    }, ANIMATION_DURATION);
  }

  // 统一关闭函数
  function closePicker(callback) {
    if (currentBackdrop) {
      closeMobilePicker(callback);
    } else {
      closeDesktopPicker(callback);
    }
  }

  // 创建移动端选择器
  function createMobilePicker() {
    if (emojiGroups.length === 0) {
      alert('没有可用的表情数据，请先设置远程 URL');
      return null;
    }

    // 创建遮罩
    const backdrop = document.createElement('div');
    backdrop.className = 'remote-emoji-backdrop backdrop-enter';
    backdrop.onclick = () => closePicker();

    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'remote-emoji-modal modal-enter';

    // 头部（搜索栏 + 关闭按钮）
    const header = document.createElement('div');
    header.className = 'modal-header';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索表情...';
    header.appendChild(searchInput);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => closePicker();
    header.appendChild(closeBtn);

    modal.appendChild(header);

    // 分组导航
    const groupNav = document.createElement('div');
    groupNav.className = 'group-nav';

    emojiGroups.forEach((group, index) => {
      if (!group.emojis || group.emojis.length === 0) return;

      const btn = document.createElement('button');
      btn.title = group.name;
      if (index === 0) btn.classList.add('active');

      const icon = group.icon;
      if (icon && (icon.startsWith('http') || icon.startsWith('data:'))) {
        const img = document.createElement('img');
        img.src = icon;
        img.alt = group.name;
        btn.appendChild(img);
      } else {
        btn.textContent = icon || '📁';
      }

      btn.onclick = () => {
        groupNav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const section = content.querySelector(`[data-group="${group.id}"]`);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      groupNav.appendChild(btn);
    });

    modal.appendChild(groupNav);

    // 内容区
    const content = document.createElement('div');
    content.className = 'content';

    emojiGroups.forEach(group => {
      if (!group.emojis || group.emojis.length === 0) return;

      const section = document.createElement('div');
      section.className = 'group-section';
      section.dataset.group = group.id;

      const title = document.createElement('h3');
      title.textContent = group.name;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'emoji-grid';

      group.emojis.forEach(emoji => {
        if (!emoji.url || !emoji.name) return;

        const img = document.createElement('img');
        img.src = emoji.displayUrl || emoji.url;
        img.alt = emoji.name;
        img.title = emoji.name;
        img.loading = 'lazy';
        img.dataset.name = emoji.name.toLowerCase();

        img.onclick = () => {
          insertEmoji(emoji);
          closePicker();
        };

        grid.appendChild(img);
      });

      section.appendChild(grid);
      content.appendChild(section);
    });

    modal.appendChild(content);

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      content.querySelectorAll('.emoji-grid img').forEach(img => {
        const name = img.dataset.name || '';
        img.style.display = (query === '' || name.includes(query)) ? '' : 'none';
      });
      content.querySelectorAll('.group-section').forEach(section => {
        const visibleEmojis = section.querySelectorAll('.emoji-grid img:not([style*="display: none"])');
        section.style.display = visibleEmojis.length > 0 ? '' : 'none';
      });
    });

    return { backdrop, modal };
  }

  // 创建桌面端选择器
  function createDesktopPicker() {
    if (emojiGroups.length === 0) {
      alert('没有可用的表情数据，请先设置远程 URL');
      return null;
    }

    const picker = document.createElement('div');
    // 创建时带有进入动画初始类
    picker.className = 'remote-emoji-picker picker-enter';

    // 搜索栏
    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索表情...';
    searchBar.appendChild(searchInput);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => closePicker();
    searchBar.appendChild(closeBtn);

    picker.appendChild(searchBar);

    // 分组导航
    const groupNav = document.createElement('div');
    groupNav.className = 'group-nav';

    emojiGroups.forEach((group, index) => {
      if (!group.emojis || group.emojis.length === 0) return;

      const btn = document.createElement('button');
      btn.title = group.name;
      if (index === 0) btn.classList.add('active');

      // 图标
      const icon = group.icon;
      if (icon && (icon.startsWith('http') || icon.startsWith('data:'))) {
        const img = document.createElement('img');
        img.src = icon;
        img.alt = group.name;
        btn.appendChild(img);
      } else {
        btn.textContent = icon || '📁';
      }

      btn.onclick = () => {
        groupNav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const section = content.querySelector(`[data-group="${group.id}"]`);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      groupNav.appendChild(btn);
    });

    picker.appendChild(groupNav);

    // 内容区
    const content = document.createElement('div');
    content.className = 'content';

    emojiGroups.forEach(group => {
      if (!group.emojis || group.emojis.length === 0) return;

      const section = document.createElement('div');
      section.className = 'group-section';
      section.dataset.group = group.id;

      const title = document.createElement('h3');
      title.textContent = group.name;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'emoji-grid';

      group.emojis.forEach(emoji => {
        if (!emoji.url || !emoji.name) return;

        const img = document.createElement('img');
        img.src = emoji.displayUrl || emoji.url;
        img.alt = emoji.name;
        img.title = emoji.name;
        img.loading = 'lazy';
        img.dataset.name = emoji.name.toLowerCase();

        bindHoverPreview(img, emoji);

        img.onclick = () => {
          insertEmoji(emoji);
          closePicker();
        };

        grid.appendChild(img);
      });

      section.appendChild(grid);
      content.appendChild(section);
    });

    picker.appendChild(content);

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      content.querySelectorAll('.emoji-grid img').forEach(img => {
        const name = img.dataset.name || '';
        img.style.display = (query === '' || name.includes(query)) ? '' : 'none';
      });
      content.querySelectorAll('.group-section').forEach(section => {
        const visibleEmojis = section.querySelectorAll('.emoji-grid img:not([style*="display: none"])');
        section.style.display = visibleEmojis.length > 0 ? '' : 'none';
      });
    });

    return picker;
  }

  function showPicker(anchorEl) {
    if (isAnimating) return;

    // 如果已有 picker，先关闭再打开
    if (currentPicker || currentBackdrop) {
      closePicker(() => showPicker(anchorEl));
      return;
    }

    const useMobile = shouldUseMobileView();

    if (useMobile) {
      // 移动端模式
      const result = createMobilePicker();
      if (!result) return;

      currentBackdrop = result.backdrop;
      currentPicker = result.modal;

      document.body.appendChild(currentBackdrop);
      document.body.appendChild(currentPicker);

      // 触发进入动画
      requestAnimationFrame(() => {
        if (!currentBackdrop || !currentPicker) return;

        void currentBackdrop.offsetHeight;
        currentBackdrop.classList.remove('backdrop-enter');
        currentBackdrop.classList.add('backdrop-enter-active');

        void currentPicker.offsetHeight;
        currentPicker.classList.remove('modal-enter');
        currentPicker.classList.add('modal-enter-active');

        // 动画完成后清理类
        setTimeout(() => {
          if (currentBackdrop) {
            currentBackdrop.classList.remove('backdrop-enter-active');
          }
          if (currentPicker) {
            currentPicker.classList.remove('modal-enter-active');
          }
        }, ANIMATION_DURATION);
      });
    } else {
      // 桌面端模式
      currentPicker = createDesktopPicker();
      if (!currentPicker) return;

      document.body.appendChild(currentPicker);

      // 定位
      const rect = anchorEl.getBoundingClientRect();
      const margin = 8;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top = rect.bottom + margin;
      let left = rect.left;

      // 等待渲染后调整位置并触发进入动画
      requestAnimationFrame(() => {
        if (!currentPicker) return;

        const pickerRect = currentPicker.getBoundingClientRect();

        if (top + pickerRect.height > vh) {
          top = Math.max(margin, rect.top - pickerRect.height - margin);
        }
        if (left + pickerRect.width > vw) {
          left = Math.max(margin, vw - pickerRect.width - margin);
        }

        currentPicker.style.top = top + 'px';
        currentPicker.style.left = left + 'px';

        // 触发进入动画
        void currentPicker.offsetHeight;
        currentPicker.classList.remove('picker-enter');
        currentPicker.classList.add('picker-enter-active');

        // 动画完成后清理类
        setTimeout(() => {
          if (currentPicker) {
            currentPicker.classList.remove('picker-enter-active');
          }
        }, ANIMATION_DURATION);
      });

      // 点击外部关闭
      setTimeout(() => {
        const handler = (e) => {
          if (currentPicker && !currentPicker.contains(e.target) && e.target !== anchorEl && !isAnimating) {
            document.removeEventListener('click', handler);
            closePicker();
          }
        };
        document.addEventListener('click', handler);
      }, 100);
    }
  }

  // ============== 工具栏注入 ==============
  function findToolbars() {
    const selectors = [
      '.d-editor-button-bar',
      '.toolbar-visible',
      '.chat-composer__wrapper .chat-composer__inner-container'
    ];

    const toolbars = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => toolbars.push(el));
    }
    return toolbars;
  }

  function injectButton(toolbar) {
    if (toolbar.querySelector('.remote-emoji-toolbar-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'btn no-text btn-icon remote-emoji-toolbar-btn';
    btn.title = '表情包';
    btn.type = 'button';
    btn.textContent = '🐱';

    btn.onclick = (e) => {
      e.stopPropagation();
      showPicker(btn);
    };

    toolbar.appendChild(btn);
  }

  function attemptInjection() {
    const toolbars = findToolbars();
    toolbars.forEach(toolbar => injectButton(toolbar));
    return toolbars.length;
  }

  // ============== 初始化 ==============
  async function init() {
    console.log('[Remote Emoji] 初始化...');

    injectStyles();
    await loadEmojiGroups();

    // 尝试注入
    let attempts = 0;
    const maxAttempts = 10;

    function tryInject() {
      attempts++;
      const count = attemptInjection();

      if (count > 0) {
        console.log('[Remote Emoji] 注入成功，工具栏数量：', count);
      } else if (attempts < maxAttempts) {
        setTimeout(tryInject, 1000);
      } else {
        console.log('[Remote Emoji] 未找到工具栏');
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInject);
    } else {
      tryInject();
    }

    // 定期检查新工具栏
    setInterval(attemptInjection, 30000);

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
      attemptInjection();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 检测是否是 Discourse 站点
  function isDiscourseSite() {
    const metaTags = document.querySelectorAll('meta[name*="discourse"], meta[content*="discourse"]');
    if (metaTags.length > 0) return true;

    const generator = document.querySelector('meta[name="generator"]');
    if (generator && generator.content && generator.content.toLowerCase().includes('discourse')) return true;

    if (document.querySelector('#main-outlet, .ember-application, textarea.d-editor-input')) return true;

    return false;
  }

  if (isDiscourseSite()) {
    init();
  } else {
    console.log('[Remote Emoji] 非 Discourse 站点，跳过');
  }

})();
