// ==UserScript==
// @name         Pluscord (Discord Enhancer)
// @namespace    https://pluscord.local
// @version      2.0.0
// @description  Message logger, custom backgrounds, themes, quick menu, QoL tweaks, CSS editor, and image uploads for Discord. Local-only; DOM/CSS enhancements.
// @author       pietrodelfiore_
// @match        https://discord.com/*
// @match        https://ptb.discord.com/*
// @match        https://canary.discord.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_uploadFile
// @downloadURL https://update.greasyfork.org/scripts/551984/Pluscord%20%28Discord%20Enhancer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551984/Pluscord%20%28Discord%20Enhancer%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const APP_NAME = 'Pluscord';
  const VERSION = '2.0.0';

  // --- Load Discord Font ---
  function loadDiscordFont() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/fonts/latin/NotoSans-Regular.ttf';
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/ttf';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    const fontFace = document.createElement('style');
    fontFace.textContent = `
      @font-face {
        font-family: 'gg sans';
        font-style: normal;
        font-weight: 400;
        src: url('https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/fonts/latin/NotoSans-Regular.ttf') format('truetype');
      }
      @font-face {
        font-family: 'gg sans';
        font-style: normal;
        font-weight: 500;
        src: url('https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/fonts/latin/NotoSans-Medium.ttf') format('truetype');
      }
      @font-face {
        font-family: 'gg sans';
        font-style: normal;
        font-weight: 600;
        src: url('https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/fonts/latin/NotoSans-SemiBold.ttf') format('truetype');
      }
      @font-face {
        font-family: 'gg sans';
        font-style: normal;
        font-weight: 700;
        src: url('https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/fonts/latin/NotoSans-Bold.ttf') format('truetype');
      }
    `;
    document.head.appendChild(fontFace);
  }

  // --- Defaults ---
  const DEFAULTS = {
    theme: 'amoled',
    customTheme: { bg: '#0b0d10', panelBg: '#111318', text: '#e7e7e7', accent: '#5b9fff', link: '#7aa8ff', mention: '#243343' },
    appearance: { imageUrl: '', appOpacity: 1.0, avatarShape: 'default', customScrollbar: true, avatarFrames: false },
    compactMode: false,
    codeCopyButton: true,
    msgCharCounter: true,
    charLimit: 2000,
    absoluteTimestamps: false,
    disableAnimations: false,
    revealSpoilers: false,
    uiCleanup: { hideGift: true, hideGIF: false, hideSticker: false, hideTyping: false },
    highlight: { keywords: [], myName: '', color: '#2db879', useRegex: false, caseSensitive: false },
    floatingButton: true,
    performanceBoost: false,
    boost: { pauseGIFs: true, collapseEmbeds: false, collapseAttachments: true, hideAvatars: false, hideMemberList: false, reduceTransparency: true, simplifyShadows: true },
    messageLogger: { enabled: false, logDeletes: true, logEdits: true, maxLogs: 200 },
    quickActions: { autoScroll: true, jumpToBottom: true, markUnread: true },
    experimental: { customCSS: '', devMode: false },
    // New features
    quickReplies: { enabled: false, templates: [] },
    formattingShortcuts: { enabled: true, bold: 'Ctrl+B', italic: 'Ctrl+I', strikethrough: 'Ctrl+Shift+S', code: 'Ctrl+Shift+C' },
    quickReactions: { enabled: false, emojis: ['👍', '❤️', '😂', '😮', '😢', '👎'] },
    translation: { enabled: false, autoDetect: true, defaultLang: 'en' },
    textToSpeech: { enabled: false, voice: 'default', rate: 1.0, volume: 1.0 },
    notifications: { customSounds: false, soundFile: '', suppressMentions: false },
    serverFolders: { enabled: false, folders: [] },
    pinnedChannels: { enabled: false, channels: [] },
    userNotes: { enabled: false, notes: {} },
    moderation: { autoMod: false, filters: [], warningTemplates: [] },
    integrations: { spotify: false, github: false, calendar: false },
    cssEditor: { theme: 'monokai', fontSize: 14, wordWrap: true, livePreview: true },
    imageUploads: { backgrounds: [], avatars: [] }
  };

  // --- Storage & Utils ---
  function loadSettings() {
    let s; try { s = GM_getValue('settings', null); } catch { s = null; }
    if (!s) return structuredClone(DEFAULTS);
    return deepMerge(structuredClone(DEFAULTS), s);
  }
  function saveSettings(settings) { GM_setValue('settings', settings); }
  function deepMerge(base, update) {
    for (const k in update) {
      if (update[k] && typeof update[k] === 'object' && !Array.isArray(update[k])) {
        base[k] = deepMerge(base[k] || {}, update[k]);
      } else {
        base[k] = update[k];
      }
    }
    return base;
  }
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  let S = loadSettings();
  let styleTag = null;
  let messageCache = new Map();
  let logCache = [];
  let mainObserver = null;
  let mediaObserver = null;
  let managedVideos = new Set();
  let seenSpoilers = new WeakSet();
  let quickReplyMenu = null;
  let reactionMenu = null;
  let userNotesMenu = null;
  let serverFoldersContainer = null;
  let pinnedChannelsList = null;
  let cssEditor = null;
  let imageUploader = null;

  // --- Image Upload Handler ---
  function handleImageUpload(type, callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;

        // Store the image
        if (!S.imageUploads[type]) S.imageUploads[type] = [];
        S.imageUploads[type].push({
          name: file.name,
          data: dataUrl,
          size: file.size,
          type: file.type,
          uploaded: new Date().toISOString()
        });

        // Keep only last 10 images per type
        if (S.imageUploads[type].length > 10) {
          S.imageUploads[type] = S.imageUploads[type].slice(-10);
        }

        saveSettings(S);
        if (callback) callback(dataUrl);
        toast(`Image uploaded: ${file.name}`);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // --- CSS Editor with Syntax Highlighting ---
  function createCSSEditor() {
    const editor = document.createElement('div');
    editor.id = 'pluscord-css-editor';
    editor.innerHTML = `
      <div class="editor-header">
        <div class="editor-title">CSS Editor</div>
        <div class="editor-controls">
          <select id="editor-theme">
            <option value="monokai">Monokai</option>
            <option value="github">GitHub</option>
            <option value="dracula">Dracula</option>
            <option value="discord">Discord</option>
          </select>
          <select id="editor-font-size">
            <option value="12">12px</option>
            <option value="14" selected>14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
          </select>
          <button id="editor-word-wrap">Word Wrap</button>
          <button id="editor-live-preview">Live Preview</button>
          <button id="editor-format">Format</button>
          <button id="editor-close">×</button>
        </div>
      </div>
      <div class="editor-content">
        <div class="editor-line-numbers"></div>
        <div class="editor-code" contenteditable="true" spellcheck="false"></div>
      </div>
      <div class="editor-footer">
        <div class="editor-status"></div>
        <div class="editor-actions">
          <button id="editor-apply">Apply</button>
          <button id="editor-save">Save</button>
        </div>
      </div>
    `;

    // Add styles
    const editorStyles = document.createElement('style');
    editorStyles.textContent = `
      #pluscord-css-editor {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80vw;
        height: 80vh;
        background: var(--background-secondary, #2f3136);
        border: 1px solid var(--background-tertiary, #202225);
        border-radius: 8px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.24);
        display: none;
        flex-direction: column;
        font-family: 'gg sans', 'Noto Sans', sans-serif;
        z-index: 2147483647;
      }

      #pluscord-css-editor .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--background-tertiary, #202225);
      }

      #pluscord-css-editor .editor-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--header-primary, #ffffff);
      }

      #pluscord-css-editor .editor-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      #pluscord-css-editor select {
        background: var(--background-primary, #36393f);
        color: var(--text-normal, #dcddde);
        border: 1px solid var(--background-tertiary, #202225);
        border-radius: 4px;
        padding: 6px 8px;
        font-size: 14px;
      }

      #pluscord-css-editor button {
        background: var(--background-modifier-hover, #4f545c);
        color: var(--text-normal, #dcddde);
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.17s ease;
      }

      #pluscord-css-editor button:hover {
        background: var(--background-modifier-active, #7289da);
      }

      #pluscord-css-editor .editor-content {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      #pluscord-css-editor .editor-line-numbers {
        background: var(--background-tertiary, #202225);
        color: var(--text-muted, #72767d);
        padding: 16px 8px;
        text-align: right;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 14px;
        line-height: 1.5;
        user-select: none;
        overflow: hidden;
      }

      #pluscord-css-editor .editor-code {
        flex: 1;
        padding: 16px;
        font-family: 'Consolas', 'Monaco', monospace;
        font-size: 14px;
        line-height: 1.5;
        color: var(--text-normal, #dcddde);
        background: var(--background-primary, #36393f);
        overflow: auto;
        white-space: pre;
        outline: none;
      }

      #pluscord-css-editor .editor-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-top: 1px solid var(--background-tertiary, #202225);
      }

      #pluscord-css-editor .editor-status {
        color: var(--text-muted, #72767d);
        font-size: 14px;
      }

      #pluscord-css-editor .editor-actions {
        display: flex;
        gap: 8px;
      }

      #pluscord-css-editor .editor-actions button {
        background: var(--brand-experiment, #5865f2);
        color: white;
      }

      #pluscord-css-editor .editor-actions button:hover {
        background: var(--brand-experiment-hover, #4752c4);
      }

      /* Syntax highlighting themes */
      .theme-monokai .keyword { color: #f92672; }
      .theme-monokai .string { color: #a6e22e; }
      .theme-monokai .number { color: #ae81ff; }
      .theme-monokai .comment { color: #75715e; }
      .theme-monokai .selector { color: #66d9ef; }
      .theme-monokai .property { color: #fd971f; }
      .theme-monokai .value { color: #e6db74; }

      .theme-github .keyword { color: #d73a49; }
      .theme-github .string { color: #032f62; }
      .theme-github .number { color: #005cc5; }
      .theme-github .comment { color: #6a737d; }
      .theme-github .selector { color: #6f42c1; }
      .theme-github .property { color: #e36209; }
      .theme-github .value { color: #22863a; }

      .theme-dracula .keyword { color: #ff79c6; }
      .theme-dracula .string { color: #f1fa8c; }
      .theme-dracula .number { color: #bd93f9; }
      .theme-dracula .comment { color: #6272a4; }
      .theme-dracula .selector { color: #8be9fd; }
      .theme-dracula .property { color: #50fa7b; }
      .theme-dracula .value { color: #ffb86c; }

      .theme-discord .keyword { color: #eb459e; }
      .theme-discord .string { color: #f6c177; }
      .theme-discord .number { color: #31748f; }
      .theme-discord .comment { color: #9ccfd8; }
      .theme-discord .selector { color: #c4a7e7; }
      .theme-discord .property { color: #ebbcba; }
      .theme-discord .value { color: #90b99f; }
    `;
    document.head.appendChild(editorStyles);

    document.body.appendChild(editor);
    return editor;
  }

  function highlightCSS(code, theme) {
    // Simple CSS syntax highlighting
    return code
      .replace(/([{}])/g, '<span class="bracket">$1</span>')
      .replace(/([:;,])/g, '<span class="punctuation">$1</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
      .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="property">$1</span>$2')
      .replace(/:(\s*)([^;]+)(;)/g, ':$1<span class="value">$2</span>$3')
      .replace(/^([^.]+)(?=\s*{)/gm, '<span class="selector">$1</span>')
      .replace(/\b(important|initial|inherit|unset|revert|auto|none|hidden|visible|block|inline|flex|grid|absolute|relative|fixed|sticky|static|center|left|right|top|bottom|justify|align|baseline|middle|sub|super|text-top|text-bottom|uppercase|lowercase|capitalize|underline|overline|line-through|italic|oblique|normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|solid|dotted|dashed|double|groove|ridge|inset|outset|none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|transparent|rgba?|hsla?|url|var|calc|attr|counter|counters|cross-fade|element|image|paint|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient|color|color-mix|color-adjust|opacity|filter|drop-shadow|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|transform|rotate|scale|skew|translate|perspective|matrix|matrix3d|rotateX|rotateY|rotateZ|rotate3d|scaleX|scaleY|scaleZ|scale3d|skewX|skewY|translateX|translateY|translateZ|translate3d|transition|animation|delay|duration|timing-function|iteration-count|direction|fill-mode|play-state|keyframes|media|supports|document|namespace|page|font-face|charset|import|layer|container|scope|starting-style|property|scroll-timeline|view-timeline|counter-style|font-palette|position-try|position-fallback)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(\d+\.?\d*%?|#[0-9a-fA-F]{3,6}|[a-zA-Z-]+)\b/g, '<span class="number">$1</span>');
  }

  function setupCSSEditor() {
    if (!cssEditor) cssEditor = createCSSEditor();

    const codeEl = cssEditor.querySelector('.editor-code');
    const lineNumbersEl = cssEditor.querySelector('.editor-line-numbers');
    const statusEl = cssEditor.querySelector('.editor-status');
    const themeSelect = cssEditor.querySelector('#editor-theme');
    const fontSizeSelect = cssEditor.querySelector('#editor-font-size');
    const wordWrapBtn = cssEditor.querySelector('#editor-word-wrap');
    const livePreviewBtn = cssEditor.querySelector('#editor-live-preview');
    const formatBtn = cssEditor.querySelector('#editor-format');
    const closeBtn = cssEditor.querySelector('#editor-close');
    const applyBtn = cssEditor.querySelector('#editor-apply');
    const saveBtn = cssEditor.querySelector('#editor-save');

    // Load current CSS
    codeEl.textContent = S.experimental.customCSS || '';

    // Update line numbers
    function updateLineNumbers() {
      const lines = codeEl.textContent.split('\n').length;
      lineNumbersEl.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
    }

    updateLineNumbers();

    // Syntax highlighting
    function applySyntaxHighlighting() {
      const theme = themeSelect.value;
      codeEl.innerHTML = highlightCSS(codeEl.textContent, theme);
      codeEl.classList.remove('theme-monokai', 'theme-github', 'theme-dracula', 'theme-discord');
      codeEl.classList.add(`theme-${theme}`);
    }

    // Event listeners
    codeEl.addEventListener('input', () => {
      updateLineNumbers();
      applySyntaxHighlighting();

      if (S.cssEditor.livePreview) {
        S.experimental.customCSS = codeEl.textContent;
        refreshGlobalStyles();
      }

      // Update status
      const lines = codeEl.textContent.split('\n').length;
      const chars = codeEl.textContent.length;
      statusEl.textContent = `Lines: ${lines} | Characters: ${chars}`;
    });

    codeEl.addEventListener('scroll', () => {
      lineNumbersEl.scrollTop = codeEl.scrollTop;
    });

    themeSelect.addEventListener('change', () => {
      S.cssEditor.theme = themeSelect.value;
      saveSettings(S);
      applySyntaxHighlighting();
    });

    fontSizeSelect.addEventListener('change', () => {
      S.cssEditor.fontSize = parseInt(fontSizeSelect.value);
      saveSettings(S);
      codeEl.style.fontSize = `${S.cssEditor.fontSize}px`;
      lineNumbersEl.style.fontSize = `${S.cssEditor.fontSize}px`;
    });

    wordWrapBtn.addEventListener('click', () => {
      S.cssEditor.wordWrap = !S.cssEditor.wordWrap;
      saveSettings(S);
      codeEl.style.whiteSpace = S.cssEditor.wordWrap ? 'pre-wrap' : 'pre';
      wordWrapBtn.textContent = S.cssEditor.wordWrap ? 'No Wrap' : 'Word Wrap';
    });

    livePreviewBtn.addEventListener('click', () => {
      S.cssEditor.livePreview = !S.cssEditor.livePreview;
      saveSettings(S);
      livePreviewBtn.textContent = S.cssEditor.livePreview ? 'No Preview' : 'Live Preview';
    });

    formatBtn.addEventListener('click', () => {
      // Simple CSS formatting
      let formatted = codeEl.textContent
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      codeEl.textContent = formatted;
      updateLineNumbers();
      applySyntaxHighlighting();
    });

    closeBtn.addEventListener('click', () => {
      cssEditor.style.display = 'none';
    });

    applyBtn.addEventListener('click', () => {
      S.experimental.customCSS = codeEl.textContent;
      refreshGlobalStyles();
      toast('CSS applied');
    });

    saveBtn.addEventListener('click', () => {
      S.experimental.customCSS = codeEl.textContent;
      saveSettings(S);
      toast('CSS saved');
    });

    // Initialize settings
    themeSelect.value = S.cssEditor.theme;
    fontSizeSelect.value = S.cssEditor.fontSize;
    codeEl.style.fontSize = `${S.cssEditor.fontSize}px`;
    lineNumbersEl.style.fontSize = `${S.cssEditor.fontSize}px`;
    codeEl.style.whiteSpace = S.cssEditor.wordWrap ? 'pre-wrap' : 'pre';
    wordWrapBtn.textContent = S.cssEditor.wordWrap ? 'No Wrap' : 'Word Wrap';
    livePreviewBtn.textContent = S.cssEditor.livePreview ? 'No Preview' : 'Live Preview';

    applySyntaxHighlighting();
  }

  // --- Image Uploader ---
  function createImageUploader() {
    const uploader = document.createElement('div');
    uploader.id = 'pluscord-image-uploader';
    uploader.innerHTML = `
      <div class="uploader-header">
        <div class="uploader-title">Image Manager</div>
        <button id="uploader-close">×</button>
      </div>
      <div class="uploader-tabs">
        <button class="tab active" data-tab="backgrounds">Backgrounds</button>
        <button class="tab" data-tab="avatars">Avatars</button>
        <button class="tab" data-tab="upload">Upload</button>
      </div>
      <div class="uploader-content">
        <div class="tab-content active" id="tab-backgrounds">
          <div class="image-grid" id="backgrounds-grid"></div>
        </div>
        <div class="tab-content" id="tab-avatars">
          <div class="image-grid" id="avatars-grid"></div>
        </div>
        <div class="tab-content" id="tab-upload">
          <div class="upload-area" id="upload-area">
            <div class="upload-icon">📁</div>
            <div class="upload-text">Drag & drop images here or click to browse</div>
            <input type="file" id="file-input" accept="image/*" multiple style="display: none;">
          </div>
          <div class="upload-options">
            <select id="upload-type">
              <option value="backgrounds">Background</option>
              <option value="avatars">Avatar</option>
            </select>
            <button id="upload-btn">Upload Images</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const uploaderStyles = document.createElement('style');
    uploaderStyles.textContent = `
      #pluscord-image-uploader {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80vw;
        height: 80vh;
        background: var(--background-secondary, #2f3136);
        border: 1px solid var(--background-tertiary, #202225);
        border-radius: 8px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.24);
        display: none;
        flex-direction: column;
        font-family: 'gg sans', 'Noto Sans', sans-serif;
        z-index: 2147483647;
      }

      #pluscord-image-uploader .uploader-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--background-tertiary, #202225);
      }

      #pluscord-image-uploader .uploader-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--header-primary, #ffffff);
      }

      #pluscord-image-uploader .uploader-header button {
        background: none;
        border: none;
        color: var(--text-normal, #dcddde);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #pluscord-image-uploader .uploader-tabs {
        display: flex;
        border-bottom: 1px solid var(--background-tertiary, #202225);
      }

      #pluscord-image-uploader .tab {
        background: none;
        border: none;
        color: var(--text-muted, #72767d);
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        position: relative;
      }

      #pluscord-image-uploader .tab.active {
        color: var(--header-primary, #ffffff);
      }

      #pluscord-image-uploader .tab.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--brand-experiment, #5865f2);
      }

      #pluscord-image-uploader .uploader-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      #pluscord-image-uploader .tab-content {
        display: none;
        flex: 1;
        overflow: auto;
        padding: 16px;
      }

      #pluscord-image-uploader .tab-content.active {
        display: block;
      }

      #pluscord-image-uploader .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      #pluscord-image-uploader .image-item {
        background: var(--background-primary, #36393f);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        aspect-ratio: 16/9;
      }

      #pluscord-image-uploader .image-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #pluscord-image-uploader .image-item .image-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        padding: 8px;
        color: white;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #pluscord-image-uploader .image-item .image-actions {
        display: flex;
        gap: 8px;
      }

      #pluscord-image-uploader .image-item button {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
      }

      #pluscord-image-uploader .upload-area {
        border: 2px dashed var(--background-tertiary, #202225);
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        margin-bottom: 16px;
        cursor: pointer;
        transition: border-color 0.2s;
      }

      #pluscord-image-uploader .upload-area:hover {
        border-color: var(--brand-experiment, #5865f2);
      }

      #pluscord-image-uploader .upload-area.dragover {
        border-color: var(--brand-experiment, #5865f2);
        background: rgba(88, 101, 242, 0.1);
      }

      #pluscord-image-uploader .upload-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }

      #pluscord-image-uploader .upload-text {
        color: var(--text-muted, #72767d);
        font-size: 14px;
      }

      #pluscord-image-uploader .upload-options {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      #pluscord-image-uploader .upload-options select {
        background: var(--background-primary, #36393f);
        color: var(--text-normal, #dcddde);
        border: 1px solid var(--background-tertiary, #202225);
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 14px;
      }

      #pluscord-image-uploader .upload-options button {
        background: var(--brand-experiment, #5865f2);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }
    `;
    document.head.appendChild(uploaderStyles);

    document.body.appendChild(uploader);
    return uploader;
  }

  function setupImageUploader() {
    if (!imageUploader) imageUploader = createImageUploader();

    const tabs = imageUploader.querySelectorAll('.tab');
    const tabContents = imageUploader.querySelectorAll('.tab-content');
    const uploadArea = imageUploader.querySelector('#upload-area');
    const fileInput = imageUploader.querySelector('#file-input');
    const uploadType = imageUploader.querySelector('#upload-type');
    const uploadBtn = imageUploader.querySelector('#upload-btn');
    const closeBtn = imageUploader.querySelector('#uploader-close');

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        tab.classList.add('active');
        imageUploader.querySelector(`#tab-${targetTab}`).classList.add('active');

        // Load images for the selected tab
        if (targetTab === 'backgrounds') {
          loadImages('backgrounds');
        } else if (targetTab === 'avatars') {
          loadImages('avatars');
        }
      });
    });

    // Load images
    function loadImages(type) {
      const grid = imageUploader.querySelector(`#${type}-grid`);
      const images = S.imageUploads[type] || [];

      grid.innerHTML = images.map((img, index) => `
        <div class="image-item">
          <img src="${img.data}" alt="${img.name}">
          <div class="image-overlay">
            <span>${img.name}</span>
            <div class="image-actions">
              <button data-action="use" data-index="${index}">Use</button>
              <button data-action="delete" data-index="${index}">Delete</button>
            </div>
          </div>
        </div>
      `).join('');

      // Add event listeners to buttons
      grid.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.dataset.action;
          const index = parseInt(btn.dataset.index);

          if (action === 'use') {
            const img = images[index];
            if (type === 'backgrounds') {
              S.appearance.imageUrl = img.data;
              saveSettings(S);
              refreshGlobalStyles();
              toast('Background applied');
            } else if (type === 'avatars') {
              // TODO: Implement avatar functionality
              toast('Avatar feature coming soon');
            }
          } else if (action === 'delete') {
            if (confirm('Delete this image?')) {
              S.imageUploads[type].splice(index, 1);
              saveSettings(S);
              loadImages(type);
              toast('Image deleted');
            }
          }
        });
      });
    }

    // File upload
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });

    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });

    function handleFiles(files) {
      const type = uploadType.value;

      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          toast(`${file.name} is not an image`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;

          if (!S.imageUploads[type]) S.imageUploads[type] = [];
          S.imageUploads[type].push({
            name: file.name,
            data: dataUrl,
            size: file.size,
            type: file.type,
            uploaded: new Date().toISOString()
          });

          // Keep only last 10 images per type
          if (S.imageUploads[type].length > 10) {
            S.imageUploads[type] = S.imageUploads[type].slice(-10);
          }

          saveSettings(S);
          loadImages(type);
          toast(`Uploaded: ${file.name}`);
        };
        reader.readAsDataURL(file);
      });
    }

    closeBtn.addEventListener('click', () => {
      imageUploader.style.display = 'none';
    });

    // Load initial images
    loadImages('backgrounds');
  }

  // --- Theming and CSS ---
  function buildGlobalCSS() {
    const T = {
      discord: { bg: 'transparent', panelBg: 'rgba(32,34,37,.98)', text: 'var(--text-normal, #dbdee1)', accent: '#5865f2', link: '#00a8fc', highlight: '#4cc38a' },
      amoled: { bg: '#0b0d10', panelBg: '#111318', text: '#e7e7e7', accent: '#5b9fff', link: '#7aa8ff', highlight: '#2db879' },
      solarized: { bg: '#002b36', panelBg: '#073642', text: '#eee8d5', accent: '#268bd2', link: '#2aa198', highlight: '#b58900' },
      nord: { bg: '#2e3440', panelBg: '#3b4252', text: '#eceff4', accent: '#88c0d0', link: '#81a1c1', highlight: '#a3be8c' },
      custom: S.customTheme,
      dark: { bg: '#1a1d1f', panelBg: '#202225', text: '#dcddde', accent: '#5865f2', link: '#00b0f4', highlight: '#3ba55d' },
      light: { bg: '#f2f3f5', panelBg: '#ffffff', text: '#2e3338', accent: '#5865f2', link: '#00b0f4', highlight: '#3ba55d' },
      purple: { bg: '#1e1b2e', panelBg: '#2d2a3e', text: '#e0e0e0', accent: '#b794f6', link: '#d4a5ff', highlight: '#ab46bc' },
      green: { bg: '#1d281f', panelBg: '#2d3729', text: '#e0e0e0', accent: '#a9d34a', link: '#c5e88a', highlight: '#73c936' }
    };
    const t = T[S.theme] || T.amoled;
    const AP = S.appearance;

    return `
/* ${APP_NAME} ${VERSION} */
:root {
  --pc-bg: ${t.bg}; --pc-panel-bg: ${t.panelBg}; --pc-text: ${t.text};
  --pc-accent: ${t.accent}; --pc-link: ${t.link};
  --pc-highlight: ${S.highlight.color || t.highlight};
  --pc-bg-image: ${AP.imageUrl ? `url("${AP.imageUrl.replace(/"/g, '\\"')}")` : 'none'};
}

body.pluscord-on #app-mount::before {
  content: ""; position: fixed; inset: 0; background-color: var(--pc-bg);
  background-image: var(--pc-bg-image); background-size: cover; background-position: center;
  z-index: -1;
}
/* App backdrop opacity */
body.pluscord-on [class*="app-"] {
  background: color-mix(in srgb, var(--pc-panel-bg) ${clamp(AP.appOpacity, 0, 1) * 100}%, transparent);
}
/* Keep app content positioned above */
#app-mount > * { position: relative; }

/* Avatar shape (best-effort) */
 ${AP.avatarShape === 'rounded' ? 'img[class*="avatar-"], [class*="avatarDecoration-"] { border-radius: 8px !important; }' : ''}
 ${AP.avatarShape === 'square' ? 'img[class*="avatar-"], [class*="avatarDecoration-"] { border-radius: 0 !important; }' : ''}

/* Avatar frames */
 ${AP.avatarFrames ? `
img[class*="avatar-"] {
  box-shadow: 0 0 0 2px var(--pc-accent);
  position: relative;
}
img[class*="avatar-"]:after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: inherit;
  pointer-events: none;
}
` : ''}

/* Custom scrollbars */
 ${AP.customScrollbar ? `
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: var(--pc-panel-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--pc-accent);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--pc-accent) 80%, black);
}
` : ''}

/* Compact mode */
body.pluscord-compact article[aria-roledescription="Message"] { margin: 2px 0 !important; padding: 2px 6px !important; }

/* UI cleanup */
body.pluscord-hide-gift [aria-label="Send a gift" i] { display: none !important; }
body.pluscord-hide-gif [aria-label*="GIF Picker" i] { display: none !important; }
body.pluscord-hide-sticker [aria-label*="Sticker Picker" i] { display: none !important; }
body.pluscord-hide-typing [class*="typing-"] { display: none !important; }

/* Motion + Boost */
body.pluscord-reduce-motion *, body.pluscord-boost * { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
body.pluscord-boost-reduce-transparency * { backdrop-filter: none !important; filter: none !important; }
body.pluscord-boost-simplify-shadows * { box-shadow: none !important; text-shadow: none !important; }
body.pluscord-boost-hide-avatars [class*="avatar"] { visibility: hidden !important; }
body.pluscord-boost-hide-members [aria-label="Members"] { display: none !important; }

/* Collapse heavy content */
body.pluscord-boost-collapse-embeds [class*="embed"] { max-height: 28px !important; overflow: hidden !important; }
body.pluscord-boost-collapse-attachments [class*="mediaAttachmentsContainer-"] { max-height: 48px !important; overflow: hidden !important; position: relative; }
body.pluscord-boost-collapse-attachments .pluscord-expand-btn {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: rgba(0,0,0,.7); color: #fff; padding: 4px 8px;
  border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
  user-select: none; border: 1px solid rgba(255,255,255,.2); z-index: 2;
}
body.pluscord-boost-collapse-attachments .pluscord-expanded { max-height: none !important; }

/* Enhanced keyword highlighting */
.pluscord-keyword {
  box-shadow: inset 0 0 0 2px var(--pc-highlight);
  background: color-mix(in srgb, var(--pc-highlight) 12%, transparent);
  border-radius: 4px;
  padding: 0 2px;
}

/* Code block copy button */
.pluscord-pre-wrap { position: relative; }
.pluscord-copy {
  position: absolute; top: 6px; right: 6px; padding: 3px 6px;
  font-size: 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.55); color: #fff; cursor: pointer;
  user-select: none; transition: all 0.2s ease;
}
.pluscord-pre-wrap:hover .pluscord-copy { opacity: 1; transform: scale(1.05); }
.pluscord-copied { background: rgba(45,184,121,.8) !important; border-color: rgba(45,184,121,1) !important; }

/* Composer counter */
form[class^="form-"] { position: relative; }
.pluscord-counter {
  position: absolute; right: 8px; bottom: 6px; padding: 2px 6px;
  border-radius: 6px; background: rgba(0,0,0,0.35); font-size: 12px;
  color: var(--pc-text); opacity: .75; pointer-events: none;
}
.pluscord-counter.warn { background: rgba(255,165,0,.25); color: #ffcb6b; }
.pluscord-counter.error { background: rgba(220,20,60,.25); color: #ff6b6b; }

/* Floating button (+) — higher z-index and self-healing */
#pluscord-fab {
  position: fixed; right: 16px; bottom: 16px; width: 40px; height: 40px;
  border-radius: 12px; background: var(--pc-panel-bg); color: var(--pc-text);
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: 0 6px 18px rgba(0,0,0,.35);
  display: grid; place-items: center; font-weight: 700;
  font-family: 'gg sans', 'Noto Sans', sans-serif; cursor: pointer;
  z-index: 2147483647; user-select: none;
  transition: all 0.2s ease;
}
#pluscord-fab:hover { transform: scale(1.1); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }

/* Settings panel host */
#pluscord-panel-host { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 2147483646; }
#pluscord-panel-host.open { display: flex; }

/* Custom CSS injection */
 ${S.experimental.customCSS}
    `;
  }

  function refreshGlobalStyles() {
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'pluscord-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = buildGlobalCSS();
  }

  function applyBodyClasses() {
    const cl = document.body.classList;
    cl.toggle('pluscord-on', true);
    cl.toggle('pluscord-compact', !!S.compactMode);
    cl.toggle('pluscord-reduce-motion', !!S.disableAnimations || !!S.performanceBoost);
    cl.toggle('pluscord-hide-gift', !!S.uiCleanup.hideGift);
    cl.toggle('pluscord-hide-gif', !!S.uiCleanup.hideGIF);
    cl.toggle('pluscord-hide-sticker', !!S.uiCleanup.hideSticker);
    cl.toggle('pluscord-hide-typing', !!S.uiCleanup.hideTyping);

    const B = S.boost || {};
    cl.toggle('pluscord-boost', !!S.performanceBoost);
    cl.toggle('pluscord-boost-collapse-embeds', !!S.performanceBoost && !!B.collapseEmbeds);
    cl.toggle('pluscord-boost-collapse-attachments', !!S.performanceBoost && !!B.collapseAttachments);
    cl.toggle('pluscord-boost-hide-avatars', !!S.performanceBoost && !!B.hideAvatars);
    cl.toggle('pluscord-boost-hide-members', !!S.performanceBoost && !!B.hideMemberList);
    cl.toggle('pluscord-boost-reduce-transparency', !!S.performanceBoost && !!B.reduceTransparency);
    cl.toggle('pluscord-boost-simplify-shadows', !!S.performanceBoost && !!B.simplifyShadows);
  }

  // --- Settings Panel ---
  let panelHost, panelShadow, fabBtn;

  function ensureFab(force = false) {
    if (!S.floatingButton) {
      document.getElementById('pluscord-fab')?.remove();
      return null;
    }
    let btn = document.getElementById('pluscord-fab');
    if (!btn || force) {
      btn?.remove();
      btn = document.createElement('div');
      btn.id = 'pluscord-fab';
      btn.setAttribute('role', 'button');
      btn.title = 'Pluscord Quick Menu (Alt+M). Right-click for Settings.';
      btn.textContent = '+';
      document.body.appendChild(btn);
      btn.onclick = toggleQuickMenu;
      btn.oncontextmenu = (e) => { e.preventDefault(); togglePanel(); };
    }
    return btn;
  }

  function buildPanel() {
    ensureFab(true);

    panelHost = document.createElement('div');
    panelHost.id = 'pluscord-panel-host';
    document.body.appendChild(panelHost);

    panelShadow = panelHost.attachShadow({ mode: 'open' });
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');

        :host {
          --bg: var(--pc-panel-bg);
          --text: var(--pc-text);
          --accent: var(--pc-accent);
          --background-primary: #36393f;
          --background-secondary: #2f3136;
          --background-tertiary: #202225;
          --background-accent: #5865f2;
          --header-primary: #ffffff;
          --header-secondary: #b9bbbe;
          --text-normal: #dcddde;
          --text-muted: #72767d;
          --text-link: #00b0f4;
          --interactive-normal: #b9bbbe;
          --interactive-hover: #dcddde;
          --interactive-active: #ffffff;
          --interactive-muted: #4f545c;
          --brand-experiment: #5865f2;
          --brand-experiment-hover: #4752c4;
        }

        * {
          font-family: 'gg sans', 'Noto Sans', sans-serif;
        }

        .backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.45);
        }

        .panel {
          position: relative;
          width: min(900px, 95vw);
          max-height: 90vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          background: var(--background-secondary);
          color: var(--text-normal);
          border: 1px solid var(--background-tertiary);
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0,0,0,.24);
          overflow: hidden;
        }

        header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--background-tertiary);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: var(--header-primary);
        }

        h3 {
          margin: 16px 0 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--header-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        main {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 400px;
          overflow: hidden;
        }

        nav {
          background: var(--background-primary);
          padding: 8px;
          border-right: 1px solid var(--background-tertiary);
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        nav button {
          background: transparent;
          color: var(--interactive-normal);
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          transition: background-color 0.17s ease, color 0.17s ease;
        }

        nav button:hover {
          background: var(--background-modifier-hover);
          color: var(--interactive-hover);
        }

        nav button.active {
          background: var(--brand-experiment);
          color: white;
        }

        section {
          padding: 20px;
          overflow-y: auto;
          display: none;
        }

        section.active {
          display: block;
        }

        .row {
          display: flex;
          gap: 16px;
          align-items: center;
          margin: 16px 0;
        }

        .row > label {
          width: 260px;
          color: var(--header-secondary);
          font-size: 14px;
          font-weight: 500;
          flex-shrink: 0;
        }

        input[type="text"], input[type="number"], select, textarea {
          background: var(--background-primary);
          color: var(--text-normal);
          border: 1px solid var(--background-tertiary);
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 14px;
          transition: border-color 0.17s ease;
        }

        input[type="text"]:focus, input[type="number"]:focus, select:focus, textarea:focus {
          border-color: var(--brand-experiment);
          outline: none;
        }

        input[type="color"] {
          width: 48px;
          height: 32px;
          border: none;
          background: transparent;
          padding: 0;
          border-radius: 4px;
          cursor: pointer;
        }

        input[type="range"] {
          flex-grow: 1;
        }

        .switch {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .switch input[type="checkbox"] {
          width: 44px;
          height: 24px;
          appearance: none;
          background: var(--background-modifier-accent);
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.17s ease;
        }

        .switch input[type="checkbox"]:checked {
          background: var(--brand-experiment);
        }

        .switch input[type="checkbox"]::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.17s ease;
        }

        .switch input[type="checkbox"]:checked::after {
          transform: translateX(20px);
        }

        .hint {
          color: var(--text-muted);
          font-size: 12px;
          margin-top: 4px;
        }

        .danger {
          color: #faa61a;
          font-weight: 600;
        }

        .primary {
          background: var(--brand-experiment);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.17s ease;
        }

        .primary:hover {
          background: var(--brand-experiment-hover);
        }

        .ghost {
          background: transparent;
          color: var(--interactive-normal);
          border: 1px solid var(--background-tertiary);
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.17s ease;
        }

        .ghost:hover {
          background: var(--background-modifier-hover);
          color: var(--interactive-hover);
          border-color: var(--background-accent);
        }

        footer {
          padding: 16px 20px;
          border-top: 1px solid var(--background-tertiary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .log-entry {
          background: var(--background-primary);
          border: 1px solid var(--background-tertiary);
          border-radius: 4px;
          margin-bottom: 8px;
          padding: 12px;
          font-size: 14px;
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          color: var(--header-secondary);
          font-size: 12px;
          margin-bottom: 8px;
        }

        .log-content p {
          margin: 4px 0;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .log-old {
          color: var(--text-muted);
        }

        .log-delete {
          border-left: 3px solid #ed4245;
        }

        .log-edit {
          border-left: 3px solid #faa61a;
        }

        .color-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
        }

        .color-row label {
          width: auto;
        }

        .color-preview {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid var(--background-tertiary);
        }

        .template-list, .folder-list, .channel-list {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid var(--background-tertiary);
          border-radius: 4px;
          margin: 8px 0;
        }

        .template-item, .folder-item, .channel-item {
          padding: 12px;
          border-bottom: 1px solid var(--background-tertiary);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .template-item:last-child, .folder-item:last-child, .channel-item:last-child {
          border-bottom: none;
        }

        .template-name, .folder-name, .channel-name {
          font-weight: 600;
        }

        .template-content {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .template-actions, .folder-actions, .channel-actions {
          display: flex;
          gap: 8px;
        }

        .template-actions button, .folder-actions button, .channel-actions button {
          font-size: 12px;
          padding: 4px 8px;
        }

        .divider {
          height: 1px;
          background: var(--background-tertiary);
          margin: 16px 0;
        }
      </style>
      <div class="backdrop"></div>
      <div class="panel">
        <header>
          <h1>Pluscord Settings</h1>
          <div style="color: var(--text-muted); font-size: 14px;">v${VERSION}</div>
        </header>
        <main>
            <nav>
                <button data-tab="appearance" class="active">Appearance</button>
                <button data-tab="messages">Messages</button>
                <button data-tab="cleanup">UI Cleanup</button>
                <button data-tab="performance">Performance</button>
                <button data-tab="quickactions">Quick Actions</button>
                <button data-tab="logger">Message Logger</button>
                <button data-tab="communication">Communication</button>
                <button data-tab="server">Server Tools</button>
                <button data-tab="css">CSS Editor</button>
                <button data-tab="images">Images</button>
                <button data-tab="experimental">Experimental</button>
                <button data-tab="data">Data</button>
            </nav>
            <section id="tab-appearance" class="active">
                <h3>Theme</h3>
                <div class="row">
                  <label>Theme</label>
                  <select id="pc-theme">
                    <option value="discord">Discord</option>
                    <option value="amoled">AMOLED</option>
                    <option value="solarized">Solarized</option>
                    <option value="nord">Nord</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div id="pc-custom-colors" style="display:none;">
                  <div class="color-row">
                    <label>Background</label>
                    <input type="color" id="pc-bg">
                    <div class="color-preview" id="pc-bg-preview"></div>
                  </div>
                  <div class="color-row">
                    <label>Panel</label>
                    <input type="color" id="pc-panel">
                    <div class="color-preview" id="pc-panel-preview"></div>
                  </div>
                </div>
                <h3>Background</h3>
                <div class="row">
                  <label>Background Image</label>
                  <div style="display: flex; gap: 8px; flex: 1;">
                    <input type="text" id="pc-bg-image" placeholder="Enter URL or upload image">
                    <button class="ghost" id="pc-upload-bg">Upload</button>
                  </div>
                </div>
                <div class="row">
                  <label>App Opacity</label>
                  <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <input type="range" id="pc-opacity" min="0.1" max="1" step="0.05">
                    <span id="pc-opacity-val" style="min-width: 40px;">100%</span>
                  </div>
                </div>
                <h3>Layout</h3>
                <div class="row">
                  <label>Avatar Shape</label>
                  <select id="pc-avatar-shape">
                    <option value="default">Default</option>
                    <option value="rounded">Rounded</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-avatar-frames">
                  <label for="pc-avatar-frames">Avatar frames</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-custom-scrollbar">
                  <label for="pc-custom-scrollbar">Custom scrollbars</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-compact">
                  <label for="pc-compact">Compact mode</label>
                </div>
            </section>
            <section id="tab-messages">
                <h3>Display</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-abs-ts">
                  <label for="pc-abs-ts">Absolute timestamps</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-spoilers">
                  <label for="pc-spoilers">Auto-reveal spoilers</label>
                </div>
                <h3>Highlighting</h3>
                <div class="row">
                  <label>Highlight keywords</label>
                  <input type="text" id="pc-keywords" placeholder="word, another word">
                </div>
                <div class="row">
                  <label>Highlight my name</label>
                  <input type="text" id="pc-myname" placeholder="Your display name">
                </div>
                <div class="color-row">
                  <label>Highlight color</label>
                  <input type="color" id="pc-hl-color">
                  <div class="color-preview" id="pc-hl-preview"></div>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-regex">
                  <label for="pc-regex">Use regex for keywords</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-case-sensitive">
                  <label for="pc-case-sensitive">Case sensitive keywords</label>
                </div>
                <h3>Tools</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-copy">
                  <label for="pc-copy">Show "Copy" on code blocks</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-counter">
                  <label for="pc-counter">Show character counter</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-tts">
                  <label for="pc-tts">Text-to-speech button</label>
                </div>
            </section>
            <section id="tab-cleanup">
                <h3>Chat Input</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-hide-gift">
                  <label for="pc-hide-gift">Hide "Send a gift" button</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-hide-gif">
                  <label for="pc-hide-gif">Hide GIF button</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-hide-sticker">
                  <label for="pc-hide-sticker">Hide Sticker button</label>
                </div>
                <h3>General UI</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-hide-typing">
                  <label for="pc-hide-typing">Hide typing indicator</label>
                </div>
            </section>
            <section id="tab-performance">
                <h3>General</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-reduce">
                  <label for="pc-reduce">Reduce animations</label>
                </div>
                <h3>Boost Mode</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-boost">
                  <label for="pc-boost">Enable Boost Mode (reduce lag)</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-boost-gif">
                  <label for="pc-boost-gif">Pause GIFs/videos until hover</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-boost-embed">
                  <label for="pc-boost-embed">Collapse link embeds</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-boost-attach">
                  <label for="pc-boost-attach">Collapse attachments (click to expand)</label>
                </div>
            </section>
            <section id="tab-quickactions">
                <h3>Quick Actions</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-auto-scroll">
                  <label for="pc-auto-scroll">Auto-scroll to bottom</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-jump-bottom">
                  <label for="pc-jump-bottom">Jump to bottom button</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-mark-unread">
                  <label for="pc-mark-unread">Mark as unread button</label>
                </div>
            </section>
            <section id="tab-logger">
                <h3>Message Logger</h3>
                <p class="hint"><span class="danger">Disclaimer:</span> Use at your own risk. Storing message content may be against Discord's ToS. This log is <strong>cleared when you refresh or close the tab.</strong></p>
                <div class="row switch">
                  <input type="checkbox" id="pc-log-enabled">
                  <label for="pc-log-enabled">Enable Message Logger</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-log-deletes">
                  <label for="pc-log-deletes">Log deleted messages</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-log-edits">
                  <label for="pc-log-edits">Log edited messages</label>
                </div>
                <div class="row">
                  <label>Max log entries</label>
                  <input type="number" id="pc-log-max" min="10" max="1000" value="${S.messageLogger.maxLogs}">
                </div>
                <div class="row">
                  <button class="ghost" id="pc-log-clear">Clear Log</button>
                </div>
                <div class="divider"></div>
                <div id="pc-log-container" style="max-height: 250px; overflow-y: auto;"></div>
            </section>
            <section id="tab-communication">
                <h3>Quick Replies</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-qr-enabled">
                  <label for="pc-qr-enabled">Enable quick replies</label>
                </div>
                <div class="template-list" id="pc-qr-list"></div>
                <div class="row">
                  <button class="ghost" id="pc-qr-add">Add Template</button>
                </div>
                <h3>Formatting Shortcuts</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-fs-enabled">
                  <label for="pc-fs-enabled">Enable formatting shortcuts</label>
                </div>
                <div class="row">
                  <label>Bold</label>
                  <input type="text" id="pc-fs-bold" value="${S.formattingShortcuts.bold}">
                </div>
                <div class="row">
                  <label>Italic</label>
                  <input type="text" id="pc-fs-italic" value="${S.formattingShortcuts.italic}">
                </div>
                <div class="row">
                  <label>Strikethrough</label>
                  <input type="text" id="pc-fs-strikethrough" value="${S.formattingShortcuts.strikethrough}">
                </div>
                <div class="row">
                  <label>Code</label>
                  <input type="text" id="pc-fs-code" value="${S.formattingShortcuts.code}">
                </div>
                <h3>Quick Reactions</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-reactions-enabled">
                  <label for="pc-reactions-enabled">Enable quick reactions</label>
                </div>
                <div class="row">
                  <label>Reaction emojis</label>
                  <input type="text" id="pc-reactions-emojis" value="${S.quickReactions.emojis.join(' ')}">
                </div>
                <h3>Translation</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-translation-enabled">
                  <label for="pc-translation-enabled">Enable translation</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-translation-auto">
                  <label for="pc-translation-auto">Auto-detect language</label>
                </div>
                <div class="row">
                  <label>Default language</label>
                  <select id="pc-translation-lang">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                    <option value="ru">Russian</option>
                  </select>
                </div>
                <h3>Text-to-Speech</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-tts-enabled">
                  <label for="pc-tts-enabled">Enable text-to-speech</label>
                </div>
                <div class="row">
                  <label>Voice</label>
                  <select id="pc-tts-voice"></select>
                </div>
                <div class="row">
                  <label>Rate</label>
                  <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <input type="range" id="pc-tts-rate" min="0.5" max="2" step="0.1" value="${S.textToSpeech.rate}">
                    <span id="pc-tts-rate-val" style="min-width: 40px;">${S.textToSpeech.rate}x</span>
                  </div>
                </div>
                <div class="row">
                  <label>Volume</label>
                  <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <input type="range" id="pc-tts-volume" min="0" max="1" step="0.1" value="${S.textToSpeech.volume}">
                    <span id="pc-tts-volume-val" style="min-width: 40px;">${Math.round(S.textToSpeech.volume * 100)}%</span>
                  </div>
                </div>
            </section>
            <section id="tab-server">
                <h3>Server Folders</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-folders-enabled">
                  <label for="pc-folders-enabled">Enable server folders</label>
                </div>
                <div class="folder-list" id="pc-folders-list"></div>
                <div class="row">
                  <button class="ghost" id="pc-folders-add">Add Folder</button>
                </div>
                <h3>Pinned Channels</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-pinned-enabled">
                  <label for="pc-pinned-enabled">Enable pinned channels</label>
                </div>
                <div class="channel-list" id="pc-pinned-list"></div>
                <div class="row">
                  <button class="ghost" id="pc-pinned-add">Pin Current Channel</button>
                </div>
                <h3>User Notes</h3>
                <div class="row switch">
                  <input type="checkbox" id="pc-notes-enabled">
                  <label for="pc-notes-enabled">Enable user notes</label>
                </div>
            </section>
            <section id="tab-css">
                <h3>CSS Editor</h3>
                <p class="hint">Edit custom CSS with syntax highlighting and live preview.</p>
                <div class="row">
                  <button class="primary" id="pc-open-css-editor">Open CSS Editor</button>
                </div>
                <h3>Editor Settings</h3>
                <div class="row">
                  <label>Theme</label>
                  <select id="pc-css-theme">
                    <option value="monokai">Monokai</option>
                    <option value="github">GitHub</option>
                    <option value="dracula">Dracula</option>
                    <option value="discord">Discord</option>
                  </select>
                </div>
                <div class="row">
                  <label>Font Size</label>
                  <select id="pc-css-font-size">
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                  </select>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-css-word-wrap">
                  <label for="pc-css-word-wrap">Word wrap</label>
                </div>
                <div class="row switch">
                  <input type="checkbox" id="pc-css-live-preview">
                  <label for="pc-css-live-preview">Live preview</label>
                </div>
            </section>
            <section id="tab-images">
                <h3>Image Manager</h3>
                <p class="hint">Upload and manage images for backgrounds and avatars.</p>
                <div class="row">
                  <button class="primary" id="pc-open-image-uploader">Open Image Manager</button>
                </div>
                <h3>Storage</h3>
                <div class="row">
                  <label>Background images</label>
                  <span>${(S.imageUploads.backgrounds || []).length}/10</span>
                </div>
                <div class="row">
                  <label>Avatar images</label>
                  <span>${(S.imageUploads.avatars || []).length}/10</span>
                </div>
            </section>
            <section id="tab-experimental">
                <h3>Experimental Features</h3>
                <p class="hint">These features are unstable and may break with Discord updates.</p>
                <div class="row switch">
                  <input type="checkbox" id="pc-dev-mode">
                  <label for="pc-dev-mode">Developer mode (shows debug info)</label>
                </div>
                <h3>Custom CSS</h3>
                <div class="row" style="align-items:flex-start;">
                  <label>Custom CSS</label>
                  <textarea id="pc-custom-css" placeholder="Enter custom CSS here..." style="min-height: 120px;"></textarea>
                </div>
                <div class="row">
                  <button class="ghost" id="pc-preview-css">Preview</button>
                  <button class="primary" id="pc-apply-css">Apply</button>
                </div>
            </section>
            <section id="tab-data">
                <h3>Manage Settings</h3>
                <div class="row" style="align-items:flex-start;">
                  <label>Export</label>
                  <textarea id="pc-export" readonly style="min-height: 120px;"></textarea>
                </div>
                <div class="row" style="align-items:flex-start;">
                  <label>Import</label>
                  <textarea id="pc-import" placeholder='Paste settings here' style="min-height: 120px;"></textarea>
                </div>
                <div class="row">
                  <button class="ghost" id="pc-copy-export">Copy</button>
                  <button class="primary" id="pc-do-import">Import</button>
                </div>
                <div class="divider"></div>
                <button class="ghost danger" id="pc-reset">Reset All Settings</button>
            </section>
        </main>
        <footer>
            <div class="hint">Local-only. May break with Discord updates.</div>
            <div style="display:flex; gap:8px;">
              <button class="ghost" id="pc-close">Close</button>
              <button class="primary" id="pc-apply">Apply & Close</button>
            </div>
        </footer>
      </div>
    `;
    panelShadow.appendChild(wrap);

    const I = Object.fromEntries(
      Array.from(panelShadow.querySelectorAll('[id^="pc-"]'))
      .map(el => [el.id.replace('pc-', '').replace(/-(\w)/g, (_, c) => c.toUpperCase()), el])
    );

    const close = () => panelHost.classList.remove('open');
    panelShadow.querySelector('.backdrop').onclick = close;
    I.close.onclick = close;

    panelShadow.querySelectorAll('nav button').forEach(btn => {
      btn.onclick = () => {
        panelShadow.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panelShadow.querySelectorAll('section').forEach(s => s.classList.toggle('active', s.id === `tab-${btn.dataset.tab}`));
      };
    });

    // Color preview updates
    ['bg', 'panel', 'hl'].forEach(colorId => {
      const input = panelShadow.getElementById(`pc-${colorId}`);
      const preview = panelShadow.getElementById(`pc-${colorId}-preview`);
      if (input && preview) {
        input.addEventListener('input', () => {
          preview.style.backgroundColor = input.value;
        });
        preview.style.backgroundColor = input.value;
      }
    });

    I.opacity.oninput = () => {
      I.opacityVal.textContent = `${Math.round(I.opacity.value * 100)}%`;
    };

    I.logMax.oninput = () => {
      I.logMax.value = clamp(parseInt(I.logMax.value || '200'), 10, 1000);
    };

    I.logClear.onclick = () => {
      logCache.length = 0;
      updateLoggerPanel();
    };

    // Custom CSS preview
    I.previewCss.onclick = () => {
      const tempSettings = structuredClone(S);
      tempSettings.experimental.customCSS = I.customCss.value;
      saveSettings(tempSettings);
      refreshGlobalStyles();
      toast('Custom CSS previewed. Click Apply to save.');
    };

    I.applyCss.onclick = () => {
      S.experimental.customCSS = I.customCss.value;
      saveSettings(S);
      refreshGlobalStyles();
      toast('Custom CSS applied');
    };

    // Background upload
    I.uploadBg.onclick = () => {
      handleImageUpload('backgrounds', (dataUrl) => {
        I.bgImage.value = dataUrl;
        S.appearance.imageUrl = dataUrl;
        saveSettings(S);
        refreshGlobalStyles();
      });
    };

    // CSS Editor
    I.openCssEditor.onclick = () => {
      setupCSSEditor();
      cssEditor.style.display = 'flex';
    };

    // Image Uploader
    I.openImageUploader.onclick = () => {
      setupImageUploader();
      imageUploader.style.display = 'flex';
    };

    // TTS rate and volume
    I.ttsRate.oninput = () => {
      I.ttsRateVal.textContent = `${I.ttsRate.value}x`;
    };

    I.ttsVolume.oninput = () => {
      I.ttsVolumeVal.textContent = `${Math.round(I.ttsVolume.value * 100)}%`;
    };

    // Quick replies
    I.qrEnabled.onchange = () => {
      S.quickReplies.enabled = I.qrEnabled.checked;
      saveSettings(S);
      updateQuickReplyMenu();
    };

    I.qrAdd.onclick = () => {
      const name = prompt('Template name:');
      if (!name) return;
      const content = prompt('Template content:');
      if (!content) return;

      S.quickReplies.templates.push({ name, content });
      saveSettings(S);
      updateQuickReplyTemplates();
      updateQuickReplyMenu();
    };

    function updateQuickReplyTemplates() {
      const container = panelShadow.getElementById('pc-qr-list');
      if (!container) return;

      container.innerHTML = S.quickReplies.templates.map((template, index) => `
        <div class="template-item">
          <div>
            <div class="template-name">${template.name}</div>
            <div class="template-content">${template.content}</div>
          </div>
          <div class="template-actions">
            <button class="ghost" data-index="${index}" data-action="edit">Edit</button>
            <button class="ghost danger" data-index="${index}" data-action="delete">Delete</button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const index = parseInt(btn.dataset.index);
          const action = btn.dataset.action;

          if (action === 'edit') {
            const name = prompt('Template name:', S.quickReplies.templates[index].name);
            if (!name) return;
            const content = prompt('Template content:', S.quickReplies.templates[index].content);
            if (!content) return;

            S.quickReplies.templates[index] = { name, content };
            saveSettings(S);
            updateQuickReplyTemplates();
            updateQuickReplyMenu();
          } else if (action === 'delete') {
            if (!confirm('Delete this template?')) return;
            S.quickReplies.templates.splice(index, 1);
            saveSettings(S);
            updateQuickReplyTemplates();
            updateQuickReplyMenu();
          }
        };
      });
    }

    // Server folders
    I.foldersEnabled.onchange = () => {
      S.serverFolders.enabled = I.foldersEnabled.checked;
      saveSettings(S);
      updateServerFolders();
    };

    I.foldersAdd.onclick = () => {
      const name = prompt('Folder name:');
      if (!name) return;

      S.serverFolders.folders.push({ name, servers: [], collapsed: false });
      saveSettings(S);
      updateServerFoldersList();
      updateServerFolders();
    };

    function updateServerFoldersList() {
      const container = panelShadow.getElementById('pc-folders-list');
      if (!container) return;

      container.innerHTML = S.serverFolders.folders.map((folder, index) => `
        <div class="folder-item">
          <div class="folder-name">${folder.name}</div>
          <div class="folder-actions">
            <button class="ghost" data-index="${index}" data-action="edit">Edit</button>
            <button class="ghost danger" data-index="${index}" data-action="delete">Delete</button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const index = parseInt(btn.dataset.index);
          const action = btn.dataset.action;

          if (action === 'edit') {
            const name = prompt('Folder name:', S.serverFolders.folders[index].name);
            if (!name) return;

            S.serverFolders.folders[index].name = name;
            saveSettings(S);
            updateServerFoldersList();
            updateServerFolders();
          } else if (action === 'delete') {
            if (!confirm('Delete this folder?')) return;
            S.serverFolders.folders.splice(index, 1);
            saveSettings(S);
            updateServerFoldersList();
            updateServerFolders();
          }
        };
      });
    }

    // Pinned channels
    I.pinnedEnabled.onchange = () => {
      S.pinnedChannels.enabled = I.pinnedEnabled.checked;
      saveSettings(S);
      updatePinnedChannels();
    };

    I.pinnedAdd.onclick = () => {
      const channelName = document.querySelector('[class*="title-"] [class*="name-"]')?.innerText;
      if (!channelName) {
        toast('Could not identify current channel');
        return;
      }

      const channelId = window.location.pathname.split('/').pop();
      if (!channelId) {
        toast('Could not identify current channel');
        return;
      }

      if (S.pinnedChannels.channels.some(c => c.id === channelId)) {
        toast('Channel already pinned');
        return;
      }

      S.pinnedChannels.channels.push({ id: channelId, name: channelName });
      saveSettings(S);
      updatePinnedChannelsList();
      updatePinnedChannels();
      toast(`Pinned #${channelName}`);
    };

    function updatePinnedChannelsList() {
      const container = panelShadow.getElementById('pc-pinned-list');
      if (!container) return;

      container.innerHTML = S.pinnedChannels.channels.map((channel, index) => `
        <div class="channel-item">
          <div class="channel-name">#${channel.name}</div>
          <div class="channel-actions">
            <button class="ghost danger" data-index="${index}" data-action="unpin">Unpin</button>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const index = parseInt(btn.dataset.index);
          const action = btn.dataset.action;

          if (action === 'unpin') {
            if (!confirm('Unpin this channel?')) return;
            S.pinnedChannels.channels.splice(index, 1);
            saveSettings(S);
            updatePinnedChannelsList();
            updatePinnedChannels();
          }
        };
      });
    }

    // TTS voices
    function updateTTSVoices() {
      const voiceSelect = panelShadow.getElementById('pc-tts-voice');
      if (!voiceSelect) return;

      voiceSelect.innerHTML = '';

      if ('speechSynthesis' in window) {
        const voices = speechSynthesis.getVoices();
        voices.forEach(voice => {
          const option = document.createElement('option');
          option.value = voice.name;
          option.textContent = `${voice.name} (${voice.lang})`;
          if (voice.name === S.textToSpeech.voice) option.selected = true;
          voiceSelect.appendChild(option);
        });
      }
    }

    if ('speechSynthesis' in window) {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = updateTTSVoices;
      }
      updateTTSVoices();
    }

    function syncPanelFromSettings() {
      I.theme.value = S.theme;
      I.bgImage.value = S.appearance.imageUrl;
      I.opacity.value = S.appearance.appOpacity;
      I.opacityVal.textContent = `${Math.round(S.appearance.appOpacity * 100)}%`;
      I.avatarShape.value = S.appearance.avatarShape;
      I.avatarFrames.checked = !!S.appearance.avatarFrames;
      I.customScrollbar.checked = !!S.appearance.customScrollbar;
      panelShadow.getElementById('pc-custom-colors').style.display = (S.theme === 'custom') ? 'block' : 'none';
      if (S.theme === 'custom') {
        const bg = S.customTheme.bg || '#0b0d10';
        const panel = S.customTheme.panelBg || '#111318';
        panelShadow.getElementById('pc-bg').value = bg;
        panelShadow.getElementById('pc-panel').value = panel;
        panelShadow.getElementById('pc-bg-preview').style.backgroundColor = bg;
        panelShadow.getElementById('pc-panel-preview').style.backgroundColor = panel;
      }
      I.compact.checked = !!S.compactMode;
      I.absTs.checked = !!S.absoluteTimestamps;
      I.spoilers.checked = !!S.revealSpoilers;
      I.keywords.value = (S.highlight.keywords || []).join(', ');
      I.myname.value = S.highlight.myName || '';
      I.hlColor.value = S.highlight.color || '#2db879';
      panelShadow.getElementById('pc-hl-preview').style.backgroundColor = I.hlColor.value;
      I.regex.checked = !!S.highlight.useRegex;
      I.caseSensitive.checked = !!S.highlight.caseSensitive;
      I.copy.checked = !!S.codeCopyButton;
      I.counter.checked = !!S.msgCharCounter;
      I.tts.checked = !!S.textToSpeech.enabled;
      I.hideGift.checked = !!S.uiCleanup.hideGift;
      I.hideGif.checked = !!S.uiCleanup.hideGIF;
      I.hideSticker.checked = !!S.uiCleanup.hideSticker;
      I.hideTyping.checked = !!S.uiCleanup.hideTyping;
      I.reduce.checked = !!S.disableAnimations;
      I.boost.checked = !!S.performanceBoost;
      I.boostGif.checked = !!S.boost.pauseGIFs;
      I.boostEmbed.checked = !!S.boost.collapseEmbeds;
      I.boostAttach.checked = !!S.boost.collapseAttachments;
      I.autoScroll.checked = !!S.quickActions.autoScroll;
      I.jumpBottom.checked = !!S.quickActions.jumpToBottom;
      I.markUnread.checked = !!S.quickActions.markUnread;
      I.devMode.checked = !!S.experimental.devMode;
      I.customCss.value = S.experimental.customCSS || '';
      I.export.value = JSON.stringify(S, null, 2);

      // Communication settings
      I.qrEnabled.checked = !!S.quickReplies.enabled;
      updateQuickReplyTemplates();
      I.fsEnabled.checked = !!S.formattingShortcuts.enabled;
      I.fsBold.value = S.formattingShortcuts.bold;
      I.fsItalic.value = S.formattingShortcuts.italic;
      I.fsStrikethrough.value = S.formattingShortcuts.strikethrough;
      I.fsCode.value = S.formattingShortcuts.code;
      I.reactionsEnabled.checked = !!S.quickReactions.enabled;
      I.reactionsEmojis.value = S.quickReactions.emojis.join(' ');
      I.translationEnabled.checked = !!S.translation.enabled;
      I.translationAuto.checked = !!S.translation.autoDetect;
      I.translationLang.value = S.translation.defaultLang;
      I.ttsEnabled.checked = !!S.textToSpeech.enabled;
      I.ttsRate.value = S.textToSpeech.rate;
      I.ttsVolume.value = S.textToSpeech.volume;

      // Server settings
      I.foldersEnabled.checked = !!S.serverFolders.enabled;
      updateServerFoldersList();
      I.pinnedEnabled.checked = !!S.pinnedChannels.enabled;
      updatePinnedChannelsList();
      I.notesEnabled.checked = !!S.userNotes.enabled;

      // CSS Editor settings
      I.cssTheme.value = S.cssEditor.theme;
      I.cssFontSize.value = S.cssEditor.fontSize;
      I.cssWordWrap.checked = !!S.cssEditor.wordWrap;
      I.cssLivePreview.checked = !!S.cssEditor.livePreview;
    }

    function applyPanelToSettings() {
      S.theme = I.theme.value;
      S.appearance.imageUrl = I.bgImage.value.trim();
      S.appearance.appOpacity = clamp(parseFloat(I.opacity.value || '1'), 0.1, 1);
      S.appearance.avatarShape = I.avatarShape.value;
      S.appearance.avatarFrames = I.avatarFrames.checked;
      S.appearance.customScrollbar = I.customScrollbar.checked;
      if (S.theme === 'custom') {
        const bg = panelShadow.getElementById('pc-bg').value || '#0b0d10';
        const panel = panelShadow.getElementById('pc-panel').value || '#111318';
        S.customTheme = { ...S.customTheme, bg, panelBg: panel };
      }
      S.compactMode = I.compact.checked;
      S.absoluteTimestamps = I.absTs.checked;
      S.revealSpoilers = I.spoilers.checked;
      S.highlight.keywords = I.keywords.value.split(',').map(s => s.trim()).filter(Boolean);
      S.highlight.myName = I.myname.value.trim();
      S.highlight.color = I.hlColor.value || '#2db879';
      S.highlight.useRegex = I.regex.checked;
      S.highlight.caseSensitive = I.caseSensitive.checked;
      S.codeCopyButton = I.copy.checked;
      S.msgCharCounter = I.counter.checked;
      S.textToSpeech.enabled = I.tts.checked;
      S.uiCleanup = { hideGift: I.hideGift.checked, hideGIF: I.hideGif.checked, hideSticker: I.hideSticker.checked, hideTyping: I.hideTyping.checked };
      S.disableAnimations = I.reduce.checked;
      S.performanceBoost = I.boost.checked;
      S.boost = { ...S.boost, pauseGIFs: I.boostGif.checked, collapseEmbeds: I.boostEmbed.checked, collapseAttachments: I.boostAttach.checked };
      S.quickActions = { autoScroll: I.autoScroll.checked, jumpToBottom: I.jumpBottom.checked, markUnread: I.markUnread.checked };
      S.messageLogger = { enabled: I.logEnabled.checked, logDeletes: I.logDeletes.checked, logEdits: I.logEdits.checked, maxLogs: parseInt(I.logMax.value || '200') };
      S.experimental.devMode = I.devMode.checked;
      S.experimental.customCSS = I.customCss.value;

      // Communication settings
      S.quickReplies.enabled = I.qrEnabled.checked;
      S.formattingShortcuts.enabled = I.fsEnabled.checked;
      S.formattingShortcuts.bold = I.fsBold.value;
      S.formattingShortcuts.italic = I.fsItalic.value;
      S.formattingShortcuts.strikethrough = I.fsStrikethrough.value;
      S.formattingShortcuts.code = I.fsCode.value;
      S.quickReactions.enabled = I.reactionsEnabled.checked;
      S.quickReactions.emojis = I.reactionsEmojis.value.trim().split(/\s+/).filter(Boolean);
      S.translation.enabled = I.translationEnabled.checked;
      S.translation.autoDetect = I.translationAuto.checked;
      S.translation.defaultLang = I.translationLang.value;
      S.textToSpeech.enabled = I.ttsEnabled.checked;
      S.textToSpeech.voice = I.ttsVoice.value;
      S.textToSpeech.rate = parseFloat(I.ttsRate.value);
      S.textToSpeech.volume = parseFloat(I.ttsVolume.value);

      // Server settings
      S.serverFolders.enabled = I.foldersEnabled.checked;
      S.pinnedChannels.enabled = I.pinnedEnabled.checked;
      S.userNotes.enabled = I.notesEnabled.checked;

      // CSS Editor settings
      S.cssEditor.theme = I.cssTheme.value;
      S.cssEditor.fontSize = parseInt(I.cssFontSize.value);
      S.cssEditor.wordWrap = I.cssWordWrap.checked;
      S.cssEditor.livePreview = I.cssLivePreview.checked;

      saveSettings(S);
      fullRefresh();
    }

    I.apply.onclick = () => { applyPanelToSettings(); close(); };
    I.copyExport.onclick = async () => {
      try {
        await navigator.clipboard.writeText(I.export.value);
        toast('Settings copied');
      } catch {
        alert('Clipboard permission denied.');
      }
    };
    I.doImport.onclick = () => {
      try {
        const data = JSON.parse(I.import.value);
        S = deepMerge(structuredClone(DEFAULTS), data);
        saveSettings(S);
        syncPanelFromSettings();
        fullRefresh();
        toast('Imported settings');
      } catch {
        alert('Invalid JSON.');
      }
    };
    I.reset.onclick = () => {
      if (!confirm('Reset all Pluscord settings to defaults?')) return;
      S = structuredClone(DEFAULTS);
      saveSettings(S);
      syncPanelFromSettings();
      fullRefresh();
      toast('Settings reset');
    };
    I.theme.onchange = () => {
      panelShadow.getElementById('pc-custom-colors').style.display = (I.theme.value === 'custom') ? 'block' : 'none';
    };

    syncPanelFromSettings();
  }

  function togglePanel() {
    if (!panelHost) buildPanel();
    panelHost.classList.toggle('open');
    if (panelHost.classList.contains('open')) {
      const exp = panelShadow.getElementById('pc-export');
      if (exp) exp.value = JSON.stringify(S, null, 2);
      updateLoggerPanel();
      setQuickMenuOpen(false);
    }
  }

  // --- Quick Menu ---
  let qmHost, qmShadow, qmOpen = false;
  function buildQuickMenu() {
    qmHost = document.createElement('div');
    qmHost.id = 'pluscord-qm-host';
    qmHost.style.cssText = 'position:fixed; inset:0; display:none; z-index:2147483646;';
    document.body.appendChild(qmHost);

    qmShadow = qmHost.attachShadow({ mode: 'open' });
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');

        :host {
          --bg: var(--pc-panel-bg);
          --text: var(--pc-text);
          --accent: var(--pc-accent);
          --background-primary: #36393f;
          --background-secondary: #2f3136;
          --background-tertiary: #202225;
          --background-accent: #5865f2;
          --header-primary: #ffffff;
          --header-secondary: #b9bbbe;
          --text-normal: #dcddde;
          --text-muted: #72767d;
          --text-link: #00b0f4;
          --interactive-normal: #b9bbbe;
          --interactive-hover: #dcddde;
          --interactive-active: #ffffff;
          --interactive-muted: #4f545c;
          --brand-experiment: #5865f2;
          --brand-experiment-hover: #4752c4;
        }

        * {
          font-family: 'gg sans', 'Noto Sans', sans-serif;
        }

        .backdrop {
          position: absolute;
          inset: 0;
          background: transparent;
        }

        .menu {
          position: absolute;
          right: 16px;
          bottom: 64px;
          background: var(--background-secondary);
          color: var(--text-normal);
          border: 1px solid var(--background-tertiary);
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0,0,0,.24);
          min-width: 300px;
          max-width: 340px;
          overflow: hidden;
        }

        header {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--background-tertiary);
          font-weight: 600;
          font-size: 14px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          padding: 12px;
        }

        button.toggle, button.ghost {
          background: var(--background-primary);
          color: var(--interactive-normal);
          border: 1px solid var(--background-tertiary);
          border-radius: 4px;
          padding: 10px;
          cursor: pointer;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.17s ease;
        }

        button.toggle:hover, button.ghost:hover {
          background: var(--background-modifier-hover);
          color: var(--interactive-hover);
          border-color: var(--background-accent);
        }

        button.toggle.active {
          background: var(--brand-experiment);
          color: white;
          border-color: var(--brand-experiment);
        }

        .swatches {
          display: flex;
          gap: 6px;
        }

        .swatch {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1px solid var(--background-tertiary);
          cursor: pointer;
          transition: transform 0.17s ease;
        }

        .swatch:hover {
          transform: scale(1.1);
        }

        .quick-actions {
          padding: 12px;
          border-top: 1px solid var(--background-tertiary);
        }

        .quick-actions h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: var(--header-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.17s ease;
        }

        .quick-action:hover {
          background: var(--background-modifier-hover);
        }

        .quick-action-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        footer {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid var(--background-tertiary);
        }

        button.ghost {
          background: transparent;
          font-weight: 500;
        }
      </style>
      <div class="backdrop"></div>
      <div class="menu" role="dialog" aria-label="Pluscord Quick Menu">
        <header>
          <span>Pluscord</span>
          <div class="swatches">
            <div class="swatch" data-theme="amoled" style="background:#0b0d10" title="AMOLED"></div>
            <div class="swatch" data-theme="nord" style="background:#3b4252" title="Nord"></div>
            <div class="swatch" data-theme="solarized" style="background:#073642" title="Solarized"></div>
            <div class="swatch" data-theme="discord" style="background:#202225" title="Discord"></div>
          </div>
        </header>
        <div class="grid">
          <button class="toggle" id="qm-boost">🚀 Boost</button>
          <button class="toggle" id="qm-compact">🗜️ Compact</button>
          <button class="toggle" id="qm-reduce">🎞️ Animations</button>
          <button class="toggle" id="qm-copy">📋 Copy buttons</button>
          <button class="toggle" id="qm-abs">🕒 Absolute TS</button>
          <button class="toggle" id="qm-clean-gift">🎁 Hide Gift</button>
          <button class="toggle" id="qm-qr">💬 Quick Replies</button>
          <button class="toggle" id="qm-reactions">😀 Reactions</button>
        </div>
        <div class="quick-actions">
          <h4>Quick Actions</h4>
          <div class="quick-action" id="qm-jump-bottom">
            <div class="quick-action-icon">⬇️</div>
            <span>Jump to Bottom</span>
          </div>
          <div class="quick-action" id="qm-mark-unread">
            <div class="quick-action-icon">📌</div>
            <span>Mark as Unread</span>
          </div>
          <div class="quick-action" id="qm-pin-channel">
            <div class="quick-action-icon">📌</div>
            <span>Pin Channel</span>
          </div>
        </div>
        <footer>
          <button class="ghost" id="qm-settings">⚙️ Settings</button>
          <button class="ghost" id="qm-close">Close</button>
        </footer>
      </div>
    `;
    qmShadow.appendChild(wrap);

    qmShadow.querySelector('.backdrop').addEventListener('click', () => setQuickMenuOpen(false));
    qmShadow.getElementById('qm-close').addEventListener('click', () => setQuickMenuOpen(false));
    qmShadow.getElementById('qm-settings').addEventListener('click', () => { setQuickMenuOpen(false); togglePanel(); });

    // Toggles
    qmShadow.getElementById('qm-boost').addEventListener('click', () => {
      S.performanceBoost = !S.performanceBoost;
      saveSettings(S);
      applyBodyClasses();
      syncBoostObservers();
      syncQuickMenuFromSettings();
      toast(S.performanceBoost ? 'Boost ON' : 'Boost OFF');
    });
    qmShadow.getElementById('qm-compact').addEventListener('click', () => {
      S.compactMode = !S.compactMode;
      saveSettings(S);
      applyBodyClasses();
      syncQuickMenuFromSettings();
    });
    qmShadow.getElementById('qm-reduce').addEventListener('click', () => {
      S.disableAnimations = !S.disableAnimations;
      saveSettings(S);
      applyBodyClasses();
      syncQuickMenuFromSettings();
    });
    qmShadow.getElementById('qm-copy').addEventListener('click', () => {
      S.codeCopyButton = !S.codeCopyButton;
      saveSettings(S);
      rescanAll();
      syncQuickMenuFromSettings();
    });
    qmShadow.getElementById('qm-abs').addEventListener('click', () => {
      S.absoluteTimestamps = !S.absoluteTimestamps;
      saveSettings(S);
      rescanAll();
      syncQuickMenuFromSettings();
    });
    qmShadow.getElementById('qm-clean-gift').addEventListener('click', () => {
      S.uiCleanup.hideGift = !S.uiCleanup.hideGift;
      saveSettings(S);
      applyBodyClasses();
      syncQuickMenuFromSettings();
    });
    qmShadow.getElementById('qm-qr').addEventListener('click', () => {
      S.quickReplies.enabled = !S.quickReplies.enabled;
      saveSettings(S);
      updateQuickReplyMenu();
      syncQuickMenuFromSettings();
    });
    qmShadow.getElementById('qm-reactions').addEventListener('click', () => {
      S.quickReactions.enabled = !S.quickReactions.enabled;
      saveSettings(S);
      updateReactionMenu();
      syncQuickMenuFromSettings();
    });

    // Quick actions
    qmShadow.getElementById('qm-jump-bottom').addEventListener('click', () => {
      const messagesContainer = document.querySelector('[class*="messages-"]');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        toast('Jumped to bottom');
      }
    });

    qmShadow.getElementById('qm-mark-unread').addEventListener('click', () => {
      const unreadBtn = document.querySelector('[class*="markUnread-"]');
      if (unreadBtn) {
        unreadBtn.click();
        toast('Marked as unread');
      } else {
        toast('No unread messages to mark');
      }
    });

    qmShadow.getElementById('qm-pin-channel').addEventListener('click', () => {
      const channelName = document.querySelector('[class*="title-"] [class*="name-"]')?.innerText;
      if (!channelName) {
        toast('Could not identify current channel');
        return;
      }

      const channelId = window.location.pathname.split('/').pop();
      if (!channelId) {
        toast('Could not identify current channel');
        return;
      }

      if (S.pinnedChannels.channels.some(c => c.id === channelId)) {
        toast('Channel already pinned');
        return;
      }

      S.pinnedChannels.channels.push({ id: channelId, name: channelName });
      saveSettings(S);
      updatePinnedChannels();
      toast(`Pinned #${channelName}`);
    });

    // Theme swatches
    qmShadow.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        S.theme = sw.dataset.theme;
        saveSettings(S);
        refreshGlobalStyles();
        rescanAll();
        syncQuickMenuFromSettings();
      });
    });

    syncQuickMenuFromSettings();
  }

  function setQuickMenuOpen(isOpen) {
    qmOpen = !!isOpen;
    if (!qmHost) return;
    qmHost.style.display = qmOpen ? 'block' : 'none';
  }
  function toggleQuickMenu() {
    if (!qmHost) buildQuickMenu();
    setQuickMenuOpen(!qmOpen);
    if (qmOpen) syncQuickMenuFromSettings();
    if (panelHost?.classList.contains('open')) panelHost.classList.remove('open');
  }
  function syncQuickMenuFromSettings() {
    if (!qmShadow) return;
    const setActive = (id, on) => qmShadow.getElementById(id)?.classList.toggle('active', !!on);
    setActive('qm-boost', !!S.performanceBoost);
    setActive('qm-compact', !!S.compactMode);
    setActive('qm-reduce', !!S.disableAnimations || !!S.performanceBoost);
    setActive('qm-copy', !!S.codeCopyButton);
    setActive('qm-abs', !!S.absoluteTimestamps);
    setActive('qm-clean-gift', !!S.uiCleanup.hideGift);
    setActive('qm-qr', !!S.quickReplies.enabled);
    setActive('qm-reactions', !!S.quickReactions.enabled);
  }

  // --- Toast ---
  let toastTimer = 0;
  function toast(msg = 'Done') {
    let el = document.getElementById('pluscord-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'pluscord-toast';
      el.style.cssText = `position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.75); color:#fff; padding:10px 14px; border-radius:10px; z-index:2147483647; font-weight:600; transition: opacity .2s; font-family: 'gg sans', 'Noto Sans', sans-serif;`;
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 1400);
  }

  // --- Quick Reply Menu ---
  function updateQuickReplyMenu() {
    if (!S.quickReplies.enabled) {
      if (quickReplyMenu) {
        quickReplyMenu.style.display = 'none';
      }
      return;
    }

    if (!quickReplyMenu) {
      quickReplyMenu = document.createElement('div');
      quickReplyMenu.id = 'pluscord-quick-reply';
      document.body.appendChild(quickReplyMenu);
    }

    quickReplyMenu.innerHTML = `
      <header>
        <span>Quick Replies</span>
        <button id="qr-close">×</button>
      </header>
      <div class="templates">
        ${S.quickReplies.templates.map((template, index) => `
          <div class="template" data-index="${index}">
            <div class="template-name">${template.name}</div>
            <div class="template-content">${template.content}</div>
          </div>
        `).join('')}
      </div>
      <footer>
        <button id="qr-manage">Manage</button>
      </footer>
    `;

    quickReplyMenu.querySelector('#qr-close').addEventListener('click', () => {
      quickReplyMenu.style.display = 'none';
    });

    quickReplyMenu.querySelector('#qr-manage').addEventListener('click', () => {
      quickReplyMenu.style.display = 'none';
      togglePanel();
      // Switch to communication tab
      if (panelHost) {
        panelHost.classList.add('open');
        panelShadow.querySelector('nav button[data-tab="communication"]').click();
      }
    });

    quickReplyMenu.querySelectorAll('.template').forEach(template => {
      template.addEventListener('click', () => {
        const index = parseInt(template.dataset.index);
        const content = S.quickReplies.templates[index].content;
        const chatInput = document.querySelector('div[role="textbox"]') || document.querySelector('textarea');
        if (chatInput) {
          chatInput.focus();
          chatInput.innerText = content;
          // Trigger input event
          const event = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(event);
        }
        quickReplyMenu.style.display = 'none';
      });
    });
  }

  // --- Quick Reactions Menu ---
  function updateReactionMenu() {
    if (!S.quickReactions.enabled) {
      if (reactionMenu) {
        reactionMenu.style.display = 'none';
      }
      return;
    }

    if (!reactionMenu) {
      reactionMenu = document.createElement('div');
      reactionMenu.id = 'pluscord-reactions';
      document.body.appendChild(reactionMenu);
    }

    reactionMenu.innerHTML = S.quickReactions.emojis.map(emoji => `
      <div class="reaction" data-emoji="${emoji}">${emoji}</div>
    `).join('');

    reactionMenu.querySelectorAll('.reaction').forEach(reaction => {
      reaction.addEventListener('click', () => {
        const emoji = reaction.dataset.emoji;
        // Find the currently focused message and add reaction
        const focusedMessage = document.activeElement?.closest('article[aria-roledescription="Message"]');
        if (focusedMessage) {
          const reactButton = focusedMessage.querySelector('[aria-label="Add Reaction"]');
          if (reactButton) {
            reactButton.click();
            // Wait for emoji picker to open
            setTimeout(() => {
              const emojiButton = document.querySelector(`[aria-label="${emoji}"]`);
              if (emojiButton) emojiButton.click();
            }, 100);
          }
        }
        reactionMenu.style.display = 'none';
      });
    });
  }

  // --- User Notes Menu ---
  function updateUserNotesMenu(userId, userName, userAvatar) {
    if (!S.userNotes.enabled) return;

    if (!userNotesMenu) {
      userNotesMenu = document.createElement('div');
      userNotesMenu.id = 'pluscord-user-notes';
      document.body.appendChild(userNotesMenu);
    }

    const userNote = S.userNotes.notes[userId] || '';

    userNotesMenu.innerHTML = `
      <header>
        <span>User Notes</span>
        <button id="notes-close">×</button>
      </header>
      <div class="user-info">
        <img class="user-avatar" src="${userAvatar}" alt="${userName}">
        <div class="user-name">${userName}</div>
      </div>
      <div class="note-content">
        <textarea id="user-note-textarea" placeholder="Add a private note about this user...">${userNote}</textarea>
      </div>
      <footer>
        <button id="notes-save">Save</button>
      </footer>
    `;

    userNotesMenu.querySelector('#notes-close').addEventListener('click', () => {
      userNotesMenu.style.display = 'none';
    });

    userNotesMenu.querySelector('#notes-save').addEventListener('click', () => {
      const noteText = userNotesMenu.querySelector('#user-note-textarea').value;
      if (noteText.trim()) {
        S.userNotes.notes[userId] = noteText;
      } else {
        delete S.userNotes.notes[userId];
      }
      saveSettings(S);
      userNotesMenu.style.display = 'none';
      toast('Note saved');
    });

    userNotesMenu.style.display = 'block';
  }

  // --- Server Folders ---
  function updateServerFolders() {
    if (!S.serverFolders.enabled) {
      if (serverFoldersContainer) {
        serverFoldersContainer.style.display = 'none';
      }
      return;
    }

    if (!serverFoldersContainer) {
      serverFoldersContainer = document.createElement('div');
      serverFoldersContainer.id = 'pluscord-server-folders';

      // Insert before the server list
      const serverList = document.querySelector('[class*="scroller-"]');
      if (serverList) {
        serverList.parentNode.insertBefore(serverFoldersContainer, serverList);
      }
    }

    serverFoldersContainer.innerHTML = S.serverFolders.folders.map((folder, index) => `
      <div class="folder ${folder.collapsed ? 'collapsed' : ''}" data-index="${index}">
        <div class="folder-header">
          ${folder.collapsed ? '▶' : '▼'} ${folder.name}
        </div>
        <div class="folder-servers">
          ${folder.servers.map(serverId => {
            const server = document.querySelector(`[data-dnd-item-id="${serverId}"]`);
            if (!server) return '';
            const serverIcon = server.querySelector('img')?.src || '';
            return `<div class="folder-server" style="background-image: url('${serverIcon}')" data-server-id="${serverId}"></div>`;
          }).join('')}
        </div>
      </div>
    `).join('');

    serverFoldersContainer.querySelectorAll('.folder-header').forEach(header => {
      header.addEventListener('click', () => {
        const folderEl = header.parentElement;
        const index = parseInt(folderEl.dataset.index);
        S.serverFolders.folders[index].collapsed = !S.serverFolders.folders[index].collapsed;
        saveSettings(S);
        updateServerFolders();
      });
    });

    serverFoldersContainer.querySelectorAll('.folder-server').forEach(serverEl => {
      serverEl.addEventListener('click', () => {
        const serverId = serverEl.dataset.serverId;
        const serverLink = document.querySelector(`a[href*="/channels/${serverId}"]`);
        if (serverLink) serverLink.click();
      });
    });
  }

  // --- Pinned Channels ---
  function updatePinnedChannels() {
    if (!S.pinnedChannels.enabled) {
      if (pinnedChannelsList) {
        pinnedChannelsList.style.display = 'none';
      }
      return;
    }

    if (!pinnedChannelsList) {
      pinnedChannelsList = document.createElement('div');
      pinnedChannelsList.id = 'pluscord-pinned-channels';

      // Insert at the top of the channel list
      const channelList = document.querySelector('[class*="container-"]');
      if (channelList) {
        channelList.insertBefore(pinnedChannelsList, channelList.firstChild);
      }
    }

    pinnedChannelsList.innerHTML = `
      <div class="header">
        <span>Pinned Channels</span>
        <button id="pinned-toggle">−</button>
      </div>
      <div class="channels">
        ${S.pinnedChannels.channels.map(channel => `
          <div class="channel" data-channel-id="${channel.id}">
            <div class="channel-icon">#</div>
            <div class="channel-name">${channel.name}</div>
            <div class="unpin">✕</div>
          </div>
        `).join('')}
      </div>
    `;

    pinnedChannelsList.querySelector('#pinned-toggle').addEventListener('click', () => {
      const channels = pinnedChannelsList.querySelector('.channels');
      const toggle = pinnedChannelsList.querySelector('#pinned-toggle');
      if (channels.style.display === 'none') {
        channels.style.display = 'block';
        toggle.textContent = '−';
      } else {
        channels.style.display = 'none';
        toggle.textContent = '+';
      }
    });

    pinnedChannelsList.querySelectorAll('.channel').forEach(channelEl => {
      channelEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('unpin')) return;
        const channelId = channelEl.dataset.channelId;
        window.location.href = `/channels/${window.location.pathname.split('/')[2]}/${channelId}`;
      });
    });

    pinnedChannelsList.querySelectorAll('.unpin').forEach(unpinBtn => {
      unpinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const channelEl = unpinBtn.parentElement;
        const channelId = channelEl.dataset.channelId;
        const channelIndex = S.pinnedChannels.channels.findIndex(c => c.id === channelId);
        if (channelIndex !== -1) {
          S.pinnedChannels.channels.splice(channelIndex, 1);
          saveSettings(S);
          updatePinnedChannels();
          toast('Channel unpinned');
        }
      });
    });
  }

  // --- Core Enhancements & Observers ---
  function enhanceMessageArticle(article) {
    if (!(article instanceof HTMLElement)) return;
    const msgId = article.id?.split('-').pop();

    try {
      const kw = collectKeywords();
      const txt = (article.querySelector('[id^="message-content-"]')?.innerText || '');

      if (Array.isArray(kw) && kw.length > 0) {
        const hasMatch = kw.some(keyword => {
          if (keyword instanceof RegExp) {
            return keyword.test(txt);
          }
          return S.highlight.caseSensitive ? txt.includes(keyword) : txt.toLowerCase().includes(keyword.toLowerCase());
        });

        article.classList.toggle('pluscord-keyword', hasMatch);
      }
    } catch {}

    if (S.absoluteTimestamps) {
      article.querySelectorAll('time[datetime]').forEach(t => {
        if (!t.dataset.pcOriginalText) t.dataset.pcOriginalText = t.textContent || '';
        const dt = t.getAttribute('datetime');
        if (dt) { try { t.textContent = new Date(dt).toLocaleString(); } catch {} }
      });
    } else {
      article.querySelectorAll('time[datetime][data-pc-original-text]').forEach(t => {
        t.textContent = t.dataset.pcOriginalText;
        delete t.dataset.pcOriginalText;
      });
    }

    if (S.codeCopyButton) {
      article.querySelectorAll('pre:not(.pluscord-pre-wrap)').forEach(pre => {
        pre.classList.add('pluscord-pre-wrap');
        const code = pre.querySelector('code'); if (!code) return;
        if (pre.querySelector(':scope > .pluscord-copy')) return;
        const btn = document.createElement('button');
        btn.className = 'pluscord-copy'; btn.textContent = 'Copy';
        btn.onclick = async e => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(code.innerText);
            btn.textContent = 'Copied';
            btn.classList.add('pluscord-copied');
            setTimeout(() => {
              btn.textContent = 'Copy';
              btn.classList.remove('pluscord-copied');
            }, 900);
          }
          catch { alert('Clipboard permission denied.'); }
        };
        pre.appendChild(btn);
      });
    } else {
      article.querySelectorAll('.pluscord-copy').forEach(b => b.remove());
    }

    if (S.textToSpeech.enabled) {
      if (!article.querySelector('.pluscord-tts')) {
        const ttsBtn = document.createElement('div');
        ttsBtn.className = 'pluscord-tts';
        ttsBtn.textContent = '🔊';
        ttsBtn.onclick = () => {
          const content = article.querySelector('[id^="message-content-"]')?.innerText || '';
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.voice = speechSynthesis.getVoices().find(v => v.name === S.textToSpeech.voice) || null;
            utterance.rate = S.textToSpeech.rate;
            utterance.volume = S.textToSpeech.volume;
            speechSynthesis.speak(utterance);
          }
        };
        article.appendChild(ttsBtn);
      }
    } else {
      article.querySelectorAll('.pluscord-tts').forEach(b => b.remove());
    }

    if (S.translation.enabled) {
      const contentEl = article.querySelector('[id^="message-content-"]');
      if (contentEl && !contentEl.querySelector('.pluscord-translate')) {
        const translateBtn = document.createElement('div');
        translateBtn.className = 'pluscord-translate';
        translateBtn.textContent = '🌐';
        translateBtn.style.cssText = 'position: absolute; top: 6px; right: 30px; width: 20px; height: 20px; background: rgba(0,0,0,0.55); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; opacity: 0; transition: opacity 0.2s;';
        translateBtn.onclick = () => {
          const text = contentEl.innerText;
          // Use a simple translation API (in a real implementation, you'd use a proper API)
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${S.translation.defaultLang}&dt=t&q=${encodeURIComponent(text)}`,
            onload: (response) => {
              try {
                const data = JSON.parse(response.responseText);
                const translatedText = data[0].map(item => item[0]).join('');
                contentEl.innerText = translatedText;
                article.classList.add('pluscord-translated');
                toast('Message translated');
              } catch (e) {
                toast('Translation failed');
              }
            },
            onerror: () => toast('Translation failed')
          });
        };
        article.appendChild(translateBtn);
      }
    }

    if (S.userNotes.enabled) {
      const avatarEl = article.querySelector('img[class*="avatar-"]');
      if (avatarEl && !avatarEl.dataset.pcNotesEnabled) {
        avatarEl.dataset.pcNotesEnabled = 'true';
        avatarEl.style.cursor = 'pointer';
        avatarEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const userId = article.id?.split('-').pop();
          const userName = article.querySelector('[id^="message-username-"]')?.innerText || 'Unknown';
          const userAvatar = avatarEl.src;
          if (userId) updateUserNotesMenu(userId, userName, userAvatar);
        });
      }
    }

    if (S.performanceBoost && S.boost.collapseAttachments) {
      article.querySelectorAll('[class*="mediaAttachmentsContainer-"]:not([data-pc-expanded])').forEach(container => {
        container.dataset.pcExpanded = '0';
        if (!container.querySelector('.pluscord-expand-btn')) {
          const btn = document.createElement('div');
          btn.className = 'pluscord-expand-btn';
          btn.textContent = 'Click to Expand';
          btn.onclick = () => {
            container.classList.add('pluscord-expanded');
            btn.remove();
            container.dataset.pcExpanded = '1';
          };
          container.appendChild(btn);
        }
      });
    }

    if (S.messageLogger.enabled && msgId) {
      const contentEl = article.querySelector('[id^="message-content-"]');
      if (contentEl) messageCache.set(msgId, { content: contentEl.innerText, element: article });
    }
  }

  function collectKeywords() {
    const kws = (S.highlight.keywords || []).map(s => s.trim()).filter(Boolean);
    if (S.highlight.myName) kws.push(S.highlight.myName.trim());

    if (S.highlight.useRegex) {
      return kws.map(k => {
        try {
          return new RegExp(k, S.highlight.caseSensitive ? 'g' : 'gi');
        } catch {
          return k.toLowerCase();
        }
      });
    }

    return S.highlight.caseSensitive ? kws : kws.map(k => k.toLowerCase());
  }

  function startObservers() {
    if (mainObserver) mainObserver.disconnect();
    mainObserver = new MutationObserver(mutList => {
      for (const mut of mutList) {
        for (const n of mut.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          if (n.matches?.('article[aria-roledescription="Message"]')) enhanceMessageArticle(n);
          else n.querySelectorAll?.('article[aria-roledescription="Message"]').forEach(enhanceMessageArticle);
          if (S.revealSpoilers) n.querySelectorAll?.('[class*="spoiler"]').forEach(sp => {
            if (!seenSpoilers.has(sp)) {
              sp.click?.();
              seenSpoilers.add(sp);
            }
          });
        }

        if (!S.messageLogger.enabled) continue;

        if (S.messageLogger.logDeletes && mut.removedNodes.length > 0) {
          for (const n of mut.removedNodes) {
            if (n instanceof HTMLElement && n.matches?.('article[aria-roledescription="Message"]')) {
              const msgId = n.id?.split('-').pop();
              const cached = msgId ? messageCache.get(msgId) : null;
              if (cached) logEvent('delete', cached.element);
            }
          }
        }

        if (S.messageLogger.logEdits) {
          const target = mut.target;
          if (target instanceof HTMLElement && target.matches?.('[id^="message-content-"]')) {
            const article = target.closest('article[aria-roledescription="Message"]');
            if (article) {
              const msgId = article.id?.split('-').pop();
              const cached = msgId ? messageCache.get(msgId) : null;
              const editedFlag = article.querySelector('[class*="edited-"]');
              if (cached && editedFlag) {
                logEvent('edit', article, cached.content);
                const newContent = article.querySelector('[id^="message-content-"]')?.innerText || '';
                messageCache.set(msgId, { content: newContent, element: article });
              }
            }
          }
        }
      }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

    document.querySelectorAll('article[aria-roledescription="Message"]').forEach(enhanceMessageArticle);
    if (S.revealSpoilers) document.querySelectorAll('[class*="spoiler"]').forEach(sp => sp.click?.());
  }

  function logEvent(type, element, oldContent = '') {
    const msgId = element?.id?.split('-').pop();
    if (!msgId) return;
    if (logCache.some(log => log.id === msgId && log.type === type)) return;

    const author = element.querySelector('[id^="message-username-"]')?.innerText || 'Unknown';
    const content = element.querySelector('[id^="message-content-"]')?.innerText || '(no text content)';
    const channel = document.querySelector('[class*="title-"] [class*="name-"]')?.innerText || 'Unknown Channel';
    const timestamp = new Date().toISOString();

    logCache.unshift({
      id: msgId,
      type,
      author,
      content,
      oldContent,
      channel,
      time: timestamp
    });

    if (logCache.length > S.messageLogger.maxLogs) logCache.pop();
    updateLoggerPanel();

    if (type === 'delete') {
      messageCache.delete(msgId);
    }
  }

  function updateLoggerPanel() {
    if (!panelShadow) return;
    const container = panelShadow.getElementById('pc-log-container');
    if (!container) return;

    if (!logCache.length) {
      container.innerHTML = '<p class="hint">No events logged yet.</p>';
      return;
    }

    container.innerHTML = logCache.map(log => `
      <div class="log-entry log-${log.type}">
        <div class="log-header">
          <div><strong>${log.type === 'delete' ? 'Deleted' : 'Edited'}</strong> by ${escapeHtml(log.author)} in #${escapeHtml(log.channel)}</div>
          <small>${log.time}</small>
        </div>
        <div class="log-content">
          ${log.type === 'edit' ? `<p class="log-old"><em>Old:</em> ${escapeHtml(log.oldContent)}</p>` : ''}
          <p><em>${log.type === 'edit' ? 'New:' : ''}</em> ${escapeHtml(log.content)}</p>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Media observer
  function setupHoverPlay(video) {
    if (!(video instanceof HTMLVideoElement) || managedVideos.has(video)) return;
    managedVideos.add(video);
    try {
      video.dataset.pcHoverplay = '1';
      video.autoplay = false;
      video.muted = true;
      video.preload = 'metadata';
      const enter = () => { if (S.performanceBoost && S.boost.pauseGIFs) { video.play().catch(() => {}); } };
      const leave = () => { if (S.performanceBoost && S.boost.pauseGIFs) { video.pause(); } };
      video.addEventListener('mouseenter', enter);
      video.addEventListener('mouseleave', leave);
      video.addEventListener('focusin', enter);
      video.addEventListener('focusout', leave);
      video.pause();
    } catch {}
  }

  function startMediaObserver() {
    if (mediaObserver) mediaObserver.disconnect();
    mediaObserver = new MutationObserver((mutList) => {
      for (const mut of mutList) {
        for (const n of mut.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          if (n instanceof HTMLVideoElement) setupHoverPlay(n);
          else n.querySelectorAll?.('video').forEach(setupHoverPlay);
        }
      }
    });
    mediaObserver.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('video').forEach(setupHoverPlay);
  }

  function stopMediaObserver() {
    if (mediaObserver) mediaObserver.disconnect();
    mediaObserver = null;
    document.querySelectorAll('video[data-pc-hoverplay]').forEach(v => {
      try {
        v.removeAttribute('data-pc-hoverplay');
        v.preload = 'auto';
      } catch {}
    });
    managedVideos.clear();
  }

  function syncBoostObservers() {
    if (S.performanceBoost && S.boost.pauseGIFs) startMediaObserver();
    else stopMediaObserver();
  }

  function rescanAll() {
    document.querySelectorAll('article[aria-roledescription="Message"]').forEach(enhanceMessageArticle);
  }

  function fullRefresh() {
    refreshGlobalStyles();
    applyBodyClasses();
    startObservers();
    syncBoostObservers();
    ensureFab();
    updateQuickReplyMenu();
    updateReactionMenu();
    updateServerFolders();
    updatePinnedChannels();
  }

  // Router + self-heal hooks
  function hookRouter() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...a) {
      const r = origPush.apply(this, a);
      queueMicrotask(() => ensureFab());
      return r;
    };
    history.replaceState = function (...a) {
      const r = origReplace.apply(this, a);
      queueMicrotask(() => ensureFab());
      return r;
    };
    window.addEventListener('popstate', () => ensureFab());
    setInterval(() => ensureFab(), 3000);
  }

  // Formatting shortcuts
  function setupFormattingShortcuts() {
    if (!S.formattingShortcuts.enabled) return;

    document.addEventListener('keydown', (e) => {
      const chatInput = document.querySelector('div[role="textbox"]') || document.querySelector('textarea');
      if (!chatInput || document.activeElement !== chatInput) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      let formattedText = '';

      if (e.ctrlKey && e.key === 'b' && !e.shiftKey && !e.altKey) { // Bold
        e.preventDefault();
        formattedText = `**${selectedText}**`;
      } else if (e.ctrlKey && e.key === 'i' && !e.shiftKey && !e.altKey) { // Italic
        e.preventDefault();
        formattedText = `*${selectedText}*`;
      } else if (e.ctrlKey && e.shiftKey && e.key === 'S' && !e.altKey) { // Strikethrough
        e.preventDefault();
        formattedText = `~~${selectedText}~~`;
      } else if (e.ctrlKey && e.shiftKey && e.key === 'C' && !e.altKey) { // Code
        e.preventDefault();
        formattedText = `\`${selectedText}\``;
      }

      if (formattedText) {
        range.deleteContents();
        range.insertNode(document.createTextNode(formattedText));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        // Trigger input event
        const event = new Event('input', { bubbles: true });
        chatInput.dispatchEvent(event);
      }
    });
  }

  // Spotify integration
  function setupSpotifyIntegration() {
    if (!S.integrations.spotify) return;

    // Create Spotify controls
    const spotifyControls = document.createElement('div');
    spotifyControls.id = 'pluscord-spotify-controls';
    spotifyControls.style.cssText = `
      position: fixed; bottom: 70px; left: 16px;
      background: var(--pc-panel-bg); color: var(--pc-text);
      border: 1px solid rgba(255,255,255,.12); border-radius: 12px;
      box-shadow: 0 18px 40px rgba(0,0,0,.5);
      padding: 10px; display: flex; align-items: center; gap: 8px;
      font-family: ui-sans-serif, system-ui, sans-serif;
      z-index: 2147483646;
    `;

    spotifyControls.innerHTML = `
      <div style="font-weight: 600; font-size: 12px;">Spotify</div>
      <button id="spotify-prev" style="background: none; border: none; color: var(--pc-text); cursor: pointer;">⏮</button>
      <button id="spotify-play" style="background: none; border: none; color: var(--pc-text); cursor: pointer;">⏯</button>
      <button id="spotify-next" style="background: none; border: none; color: var(--pc-text); cursor: pointer;">⏭</button>
      <div id="spotify-track" style="font-size: 12px; opacity: 0.8; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Not playing</div>
    `;

    document.body.appendChild(spotifyControls);

    // Hide controls by default
    spotifyControls.style.display = 'none';

    // Check if Spotify is connected
    function checkSpotifyStatus() {
      GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('spotify_token') || '')
        },
        onload: (response) => {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            if (data.item) {
              const trackName = data.item.name;
              const artistName = data.item.artists.map(a => a.name).join(', ');
              document.getElementById('spotify-track').textContent = `${trackName} - ${artistName}`;
              document.getElementById('spotify-play').textContent = data.is_playing ? '⏸' : '▶';
              spotifyControls.style.display = 'flex';
            } else {
              spotifyControls.style.display = 'none';
            }
          } else {
            spotifyControls.style.display = 'none';
          }
        },
        onerror: () => {
          spotifyControls.style.display = 'none';
        }
      });
    }

    // Set up button event listeners
    document.getElementById('spotify-prev').addEventListener('click', () => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.spotify.com/v1/me/player/previous',
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('spotify_token') || '')
        },
        onload: () => setTimeout(checkSpotifyStatus, 500)
      });
    });

    document.getElementById('spotify-play').addEventListener('click', () => {
      const isPlaying = document.getElementById('spotify-play').textContent === '⏸';
      GM_xmlhttpRequest({
        method: 'POST',
        url: `https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}`,
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('spotify_token') || '')
        },
        onload: () => setTimeout(checkSpotifyStatus, 500)
      });
    });

    document.getElementById('spotify-next').addEventListener('click', () => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.spotify.com/v1/me/player/next',
        headers: {
          'Authorization': 'Bearer ' + (localStorage.getItem('spotify_token') || '')
        },
        onload: () => setTimeout(checkSpotifyStatus, 500)
      });
    });

    // Check status every 5 seconds
    setInterval(checkSpotifyStatus, 5000);
    checkSpotifyStatus();
  }

  // Custom notification sounds
  function setupCustomNotificationSounds() {
    if (!S.notifications.customSounds || !S.notifications.soundFile) return;

    // Override Discord's notification sound
    const originalPlay = Audio.prototype.play;
    Audio.prototype.play = function() {
      if (this.src.includes('notification')) {
        // Play custom sound instead
        const customAudio = new Audio(S.notifications.soundFile);
        customAudio.volume = this.volume;
        return customAudio.play();
      }
      return originalPlay.apply(this, arguments);
    };
  }

  // Main Init
  function init() {
    loadDiscordFont();
    fullRefresh();
    hookRouter();
    setupFormattingShortcuts();

    if (S.integrations.spotify) setupSpotifyIntegration();
    if (S.notifications.customSounds) setupCustomNotificationSounds();

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === 'p') { e.preventDefault(); togglePanel(); }
        if (k === 'b') { e.preventDefault(); S.performanceBoost = !S.performanceBoost; saveSettings(S); applyBodyClasses(); syncBoostObservers(); toast(`Boost: ${S.performanceBoost ? 'ON' : 'OFF'}`); }
        if (k === 'm') { e.preventDefault(); toggleQuickMenu(); }
        if (k === 'r' && S.quickReactions.enabled) { e.preventDefault(); toggleReactionMenu(); }
        if (k === 'q' && S.quickReplies.enabled) { e.preventDefault(); toggleQuickReplyMenu(); }
      }
    });

    try {
      GM_registerMenuCommand('Pluscord: Quick Menu', toggleQuickMenu);
      GM_registerMenuCommand('Pluscord: Open Settings', togglePanel);
      GM_registerMenuCommand('Pluscord: Toggle Boost', () => { S.performanceBoost = !S.performanceBoost; saveSettings(S); applyBodyClasses(); syncBoostObservers(); });
      GM_registerMenuCommand('Pluscord: Show Floating Button', () => { S.floatingButton = true; saveSettings(S); ensureFab(true); });
    } catch {}

    window.Pluscord = {
      version: VERSION,
      settings: () => structuredClone(S),
      set: (next) => { S = deepMerge(S, next); saveSettings(S); fullRefresh(); },
      fullRefresh,
      togglePanel,
      toggleQuickMenu,
      updateQuickReplyMenu,
      updateReactionMenu,
      updateServerFolders,
      updatePinnedChannels
    };
    console.log(`[${APP_NAME}] v${VERSION} loaded`);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();

})();