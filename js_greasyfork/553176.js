// ==UserScript==
// @name         自定义网页样式
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  按下 ALT + E 打开自定义 CSS 编辑器
// @author       Verlif
// @license      MIT
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/553176/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/553176/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  let panel = null;
  let editor = null;
  let styleEl = null;
  let isResizing = false;
  let originalCSS = '';
  let livePreview = true;

  const STORAGE_KEY_PREFIX = 'custom_css_';
  const WINDOW_STATE_KEY = 'custom_css_window_state';

  // --- 读取保存的 CSS 并应用 ---
  const savedCSS = await GM_getValue(STORAGE_KEY_PREFIX + location.host, '');
  if (savedCSS) applyCSS(savedCSS);

  // --- 初始化窗口状态 ---
  const windowState = await GM_getValue(WINDOW_STATE_KEY, {});
  let panelLeft = windowState.left || 100;
  let panelTop = windowState.top || 100;
  let panelWidth = windowState.width || 500;
  let panelHeight = windowState.height || 350;

  // --- ALT + E 打开/关闭面板 ---
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      if (panel) closePanel(false);
      else createPanel();
    }
  });

  // --- 关闭面板 ---
  async function closePanel(saved) {
    if (!panel) return;
    if (!saved) applyCSS(originalCSS);
    await saveWindowState();
    panel.remove();
    panel = null;
    editor = null;
  }

  // --- 保存窗口状态 ---
  async function saveWindowState() {
    if (!panel) return;
    const newState = {
      left: panel.offsetLeft,
      top: panel.offsetTop,
      width: panel.offsetWidth,
      height: panel.offsetHeight,
    };
    panelLeft = newState.left;
    panelTop = newState.top;
    panelWidth = newState.width;
    panelHeight = newState.height;
    await GM_setValue(WINDOW_STATE_KEY, newState);
  }

  // --- 创建面板 ---
  async function createPanel() {
    originalCSS = styleEl ? styleEl.textContent : '';
    const savedCSS = await GM_getValue(STORAGE_KEY_PREFIX + location.host, '');

    panel = document.createElement('div');
    panel.style.cssText = `
      position: fixed;
      top: ${panelTop}px;
      left: ${panelLeft}px;
      width: ${panelWidth}px;
      height: ${panelHeight}px;
      background: #fff;
      border: 1px solid #ccc;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      border-radius: 8px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      font-family: sans-serif;
    `;

    const header = document.createElement('div');
    header.textContent = '自定义 CSS 编辑器';
    header.style.cssText = `
      padding: 8px 12px;
      background: #f4f4f4;
      border-bottom: 1px solid #ddd;
      cursor: move;
      color: black;
      user-select: none;
      font-weight: bold;
      border-radius: 8px 8px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    const toggleLive = document.createElement('button');
    toggleLive.textContent = livePreview ? '实时预览:开' : '实时预览:关';
    toggleLive.style.cssText = `
      font-size: 12px;
      padding: 2px 6px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fafafa;
      color: black;
      cursor: pointer;
    `;
    toggleLive.onclick = () => {
      livePreview = !livePreview;
      toggleLive.textContent = livePreview ? '实时预览:开' : '实时预览:关';
      if (livePreview && editor) applyCSS(editor.getValue());
      else applyCSS(originalCSS);
    };
    header.appendChild(toggleLive);

    const editorContainer = document.createElement('div');
    editorContainer.style.cssText = `
      flex: 1;
      overflow: hidden;
      position: relative;
    `;

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 8px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      border-top: 1px solid #ddd;
      background: #fafafa;
      border-radius: 0 0 8px 8px;
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存并应用';
    saveBtn.style.cssText = `
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
      background: #e0e0e0;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      color: black;
    `;

    footer.appendChild(saveBtn);
    footer.appendChild(closeBtn);

    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
      background: linear-gradient(135deg, transparent 50%, #007bff 50%);
      border-bottom-right-radius: 8px;
      z-index: 10;
    `;
    editorContainer.appendChild(resizeHandle);

    panel.appendChild(header);
    panel.appendChild(editorContainer);
    panel.appendChild(footer);
    document.body.appendChild(panel);

    makePanelDraggable(panel, header);
    makePanelResizable(panel, editorContainer, resizeHandle);

    closeBtn.onclick = () => closePanel(false);
    saveBtn.onclick = async () => {
      const css = editor.getValue();
      await GM_setValue(STORAGE_KEY_PREFIX + location.host, css);
      applyCSS(css);
      showToast('样式已保存并应用');
      closePanel(true);
    };

    await loadCodeMirror(editorContainer, savedCSS);

    // 修复 CodeMirror 初始化光标错位
    setTimeout(() => {
      if (editor && editor.refresh) editor.refresh();
    }, 300);
  }
  

  // 面板样式
  styleEl = document.createElement('style');
  styleEl.textContent = `.CodeMirror-scroll { width: calc(100%) }`;
  document.head.appendChild(styleEl);

  // --- 拖动逻辑 ---
  function makePanelDraggable(panel, dragHandle) {
    let offsetX, offsetY, isDragging = false;
    let rafId;

    dragHandle.addEventListener('mousedown', (e) => {
      if (isResizing) return;
      isDragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;

      function move(e) {
        if (!isDragging) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          panel.style.left = e.clientX - offsetX + 'px';
          panel.style.top = e.clientY - offsetY + 'px';
        });
      }

      function stop() {
        isDragging = false;
        saveWindowState();
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', stop);
    });
  }

  // --- 右下角拖拽调整大小 ---
  function makePanelResizable(panel, editorContainer, handle) {
    let startX, startY, startWidth, startHeight;
    let rafId;

    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = panel.offsetWidth;
      startHeight = panel.offsetHeight;

      function resize(e) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const newWidth = Math.max(300, startWidth + (e.clientX - startX));
          const newHeight = Math.max(200, startHeight + (e.clientY - startY));
          panel.style.width = newWidth + 'px';
          panel.style.height = newHeight + 'px';
          editorContainer.style.height = `calc(100% - 90px)`;
          if (editor && editor.refresh) editor.refresh();
          saveWindowState();
        });
      }

      function stop() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stop);
      }

      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stop);
      e.preventDefault();
    });
  }

  // --- 加载 CodeMirror 编辑器 ---
  async function loadCodeMirror(container, initialValue) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.17/lib/codemirror.css';
    document.head.appendChild(link);

    await loadScript('https://cdn.jsdelivr.net/npm/codemirror@5.65.17/lib/codemirror.js');
    await loadScript('https://cdn.jsdelivr.net/npm/codemirror@5.65.17/mode/css/css.js');

    const textarea = document.createElement('textarea');
    container.appendChild(textarea);

    editor = CodeMirror.fromTextArea(textarea, {
      mode: 'css',
      lineNumbers: true,
      lineWrapping: true,
      theme: 'default'
    });

    editor.setValue(initialValue);
    editor.getWrapperElement().style.height = '100%';
    editor.getWrapperElement().style.width = '100%';
    editor.getWrapperElement().style.fontSize = '16px';
    editor.on('change', () => {
      if (livePreview) applyCSS(editor.getValue());
    });
  }

  // --- 加载外部脚本 ---
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // --- 应用 CSS ---
  function applyCSS(css) {
    if (styleEl) styleEl.remove();
    styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  // --- 提示气泡 ---
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 9999999;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 1500);
  }

})();