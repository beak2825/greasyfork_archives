// ==UserScript==
// @name         Copy MD + LaTeX (Self-contained, KaTeX/MathJax)
// @name:zh-TW   複製為 Markdown + LaTeX（支援 KaTeX/MathJax）
// @name:zh-CN   复制为 Markdown + LaTeX（支持 KaTeX/MathJax）
// @namespace    mdltx.copy.self
// @version      3.0.0
// @description  Copy selection/article/page as Markdown, preserving LaTeX from KaTeX/MathJax. Self-contained. Modern UI with settings panel.
// @description:zh-TW  將選取範圍／文章／整頁複製為 Markdown，完整保留 KaTeX/MathJax 數學公式。獨立運作，相容 Trusted Types。
// @description:zh-CN  将选取范围／文章／整页复制为 Markdown，完整保留 KaTeX/MathJax 数学公式。独立运作，相容 Trusted Types。
// @license      CC0-1.0
// @match        *://*/*
// @match        file:///*
// @run-at       document-idle
// @noframes
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561507/Copy%20MD%20%2B%20LaTeX%20%28Self-contained%2C%20KaTeXMathJax%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561507/Copy%20MD%20%2B%20LaTeX%20%28Self-contained%2C%20KaTeXMathJax%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // § 設定系統
  // ─────────────────────────────────────────────────────────────

  const DEFAULTS = {
    hotkeyEnabled: true, hotkeyAlt: true, hotkeyCtrl: false, hotkeyShift: false, hotkeyKey: 'm',
    showButton: true, buttonPosition: 'bottom-right', buttonOffsetX: 16, buttonOffsetY: 16, buttonOpacity: 1,
    noSelectionMode: 'page', stripCommonIndentInBlockMath: true, absoluteUrls: true, waitMathJax: true, escapeMarkdownChars: true,
    articleMinChars: 600, articleMinRatio: 0.55, ignoreNav: false,
    visibilityMode: 'loose', hiddenScanMaxElements: 5000, hiddenUntilFoundVisible: true, strictOffscreen: false, offscreenMargin: 100,
    extractShadowDOM: true, extractIframes: false,
    waitBeforeCaptureMs: 0, waitDomIdleMs: 0,
    strongEmBlockStrategy: 'split', complexTableStrategy: 'list', detailsStrategy: 'preserve', unknownEmptyTagStrategy: 'literal', mergeAdjacentCodeSpans: true,
    theme: 'auto', toastDuration: 2500, language: 'auto',
    downloadFilenameTemplate: '{title}_{date}',
    settingsVersion: 5,
  };

  const SETTING_TYPES = {
    hotkeyEnabled: 'boolean', hotkeyAlt: 'boolean', hotkeyCtrl: 'boolean', hotkeyShift: 'boolean', hotkeyKey: 'string',
    showButton: 'boolean', buttonPosition: 'string', buttonOffsetX: 'number', buttonOffsetY: 'number', buttonOpacity: 'number',
    noSelectionMode: 'string', stripCommonIndentInBlockMath: 'boolean', absoluteUrls: 'boolean', waitMathJax: 'boolean', escapeMarkdownChars: 'boolean',
    articleMinChars: 'number', articleMinRatio: 'number', ignoreNav: 'boolean',
    visibilityMode: 'string', hiddenScanMaxElements: 'number', hiddenUntilFoundVisible: 'boolean', strictOffscreen: 'boolean', offscreenMargin: 'number',
    extractShadowDOM: 'boolean', extractIframes: 'boolean',
    waitBeforeCaptureMs: 'number', waitDomIdleMs: 'number',
    strongEmBlockStrategy: 'string', complexTableStrategy: 'string', detailsStrategy: 'string', unknownEmptyTagStrategy: 'string', mergeAdjacentCodeSpans: 'boolean',
    theme: 'string', toastDuration: 'number', language: 'string',
    downloadFilenameTemplate: 'string',
    settingsVersion: 'number',
  };

  const S = {
    get(k) {
      const raw = GM_getValue(k, DEFAULTS[k]), type = SETTING_TYPES[k], def = DEFAULTS[k];
      if (type === 'boolean') return raw === true || raw === 'true' || raw === 1 || raw === '1' ? true : raw === false || raw === 'false' || raw === 0 || raw === '0' ? false : def;
      if (type === 'number') { const n = Number(raw); return isNaN(n) ? def : n; }
      if (type === 'string') return raw == null ? def : String(raw);
      return raw ?? def;
    },
    set(k, v) { GM_setValue(k, v); },
    getAll() { const r = {}; for (const k of Object.keys(DEFAULTS)) r[k] = this.get(k); return r; },
    resetAll() { for (const k of Object.keys(DEFAULTS)) GM_setValue(k, DEFAULTS[k]); }
  };

  function migrateSettings() {
    const cur = S.get('settingsVersion');
    const migrations = [
      [2, ['strongEmBlockStrategy', 'complexTableStrategy', 'detailsStrategy', 'unknownEmptyTagStrategy', 'hiddenUntilFoundVisible', 'strictOffscreen']],
      [3, ['waitBeforeCaptureMs', 'waitDomIdleMs']],
      [4, ['mergeAdjacentCodeSpans', 'offscreenMargin']],
    ];
    for (const [ver, keys] of migrations) {
      if (cur < ver) for (const k of keys) if (GM_getValue(k) === undefined) GM_setValue(k, DEFAULTS[k]);
    }
    if (cur < DEFAULTS.settingsVersion) GM_setValue('settingsVersion', DEFAULTS.settingsVersion);
  }

  // ─────────────────────────────────────────────────────────────
  // § 國際化
  // ─────────────────────────────────────────────────────────────

  const I18N = {
    'zh-TW': {
      copyMd: '複製 MD', copySelection: '複製選取內容', copyArticle: '智慧擷取文章', copyPage: '複製整個頁面', downloadMd: '下載為 .md 檔案', settings: '設定',
      processing: '處理中...', copied: '已複製！', downloaded: '已下載！', failed: '失敗',
      settingsTitle: 'MD+LaTeX 複製工具設定',
      generalSettings: '一般設定', showButton: '顯示浮動按鈕', buttonPosition: '按鈕位置', bottomRight: '右下角', bottomLeft: '左下角', topRight: '右上角', topLeft: '左上角', buttonOpacity: '按鈕透明度', theme: '主題', themeAuto: '自動', themeLight: '淺色', themeDark: '深色', language: '語言', langAuto: '自動',
      hotkeySettings: '快捷鍵設定', enableHotkey: '啟用快捷鍵', hotkeyCombo: '快捷鍵組合', pressKey: '按下按鍵...',
      conversionSettings: '轉換設定', noSelectionMode: '無選取時預設模式', modePage: '整個頁面', modeArticle: '智慧文章', absoluteUrls: '使用絕對網址', ignoreNav: '忽略導覽/頁首/頁尾/側邊欄', waitMathJax: '等待 MathJax 渲染', stripIndent: '移除區塊數學的共同縮排', escapeMarkdownChars: '逸出 Markdown 特殊字元', extractShadowDOM: '擷取 Shadow DOM 內容', extractIframes: '擷取 iframe 內容（同源）',
      captureSettings: '擷取時機設定', waitBeforeCapture: '抽取前等待時間 (ms)', waitDomIdle: 'DOM 穩定後等待 (ms)',
      visibilitySettings: '可見性設定', visibilityMode: '隱藏元素判斷策略', visibilityLoose: '寬鬆（display/visibility/hidden）', visibilityStrict: '嚴格（含 opacity/content-visibility/offscreen）', visibilityDom: 'DOM 優先（僅 hidden 屬性）', strictOffscreen: '啟用螢幕外元素偵測', offscreenMargin: '螢幕外邊界距離 (px)',
      formatSettings: '格式處理設定', strongEmBlockStrategy: '粗體/斜體跨區塊策略', strategySplit: '拆段（推薦）', strategyHtml: 'HTML 標籤', strategyStrip: '移除格式', complexTableStrategy: '複雜表格策略', strategyList: '轉為清單', strategyTableHtml: 'HTML 表格', detailsStrategy: 'Details 元素策略', detailsPreserve: '保留完整內容', detailsStrictVisual: '僅保留 summary', mergeAdjacentCodeSpans: '合併相鄰程式碼區段',
      advancedSettings: '進階設定', articleMinChars: '文章最少字元數', articleMinRatio: '文章最小比例', toastDuration: 'Toast 顯示時間 (ms)',
      resetSettings: '重設為預設值', saveSettings: '儲存設定', cancel: '取消', close: '關閉',
      toastSuccess: '✅ 已複製 Markdown', toastSuccessDetail: '模式：{mode}｜字元數：{count}', toastDownloadSuccess: '✅ 已下載 Markdown', toastDownloadDetail: '檔案：{filename}｜字元數：{count}', toastError: '❌ 轉換失敗', toastErrorDetail: '錯誤：{error}',
      modeSelection: '選取', modeArticleLabel: '文章', modePageLabel: '頁面',
      hotkeyHint: '快捷鍵提示', dragToMove: '拖曳移動', currentHotkey: '目前快捷鍵', confirmReset: '確定要重設所有設定嗎？', settingsResetDone: '設定已重設為預設值', noSelection: '（無選取內容）', settingsSaved: '設定已儲存',
    },
    'zh-CN': {
      copyMd: '复制 MD', copySelection: '复制选中内容', copyArticle: '智能提取文章', copyPage: '复制整个页面', downloadMd: '下载为 .md 文件', settings: '设置',
      processing: '处理中...', copied: '已复制！', downloaded: '已下载！', failed: '失败',
      settingsTitle: 'MD+LaTeX 复制工具设置',
      generalSettings: '常规设置', showButton: '显示浮动按钮', buttonPosition: '按钮位置', bottomRight: '右下角', bottomLeft: '左下角', topRight: '右上角', topLeft: '左上角', buttonOpacity: '按钮透明度', theme: '主题', themeAuto: '自动', themeLight: '浅色', themeDark: '深色', language: '语言', langAuto: '自动',
      hotkeySettings: '快捷键设置', enableHotkey: '启用快捷键', hotkeyCombo: '快捷键组合', pressKey: '按下按键...',
      conversionSettings: '转换设置', noSelectionMode: '无选中时默认模式', modePage: '整个页面', modeArticle: '智能文章', absoluteUrls: '使用绝对网址', ignoreNav: '忽略导航/页眉/页脚/侧边栏', waitMathJax: '等待 MathJax 渲染', stripIndent: '移除块级数学的公共缩进', escapeMarkdownChars: '转义 Markdown 特殊字符', extractShadowDOM: '提取 Shadow DOM 内容', extractIframes: '提取 iframe 内容（同源）',
      captureSettings: '抓取时机设置', waitBeforeCapture: '抓取前等待时间 (ms)', waitDomIdle: 'DOM 稳定后等待 (ms)',
      visibilitySettings: '可见性设置', visibilityMode: '隐藏元素判断策略', visibilityLoose: '宽松（display/visibility/hidden）', visibilityStrict: '严格（含 opacity/content-visibility/offscreen）', visibilityDom: 'DOM 优先（仅 hidden 属性）', strictOffscreen: '启用屏幕外元素检测', offscreenMargin: '屏幕外边界距离 (px)',
      formatSettings: '格式处理设置', strongEmBlockStrategy: '粗体/斜体跨区块策略', strategySplit: '拆段（推荐）', strategyHtml: 'HTML 标签', strategyStrip: '移除格式', complexTableStrategy: '复杂表格策略', strategyList: '转为列表', strategyTableHtml: 'HTML 表格', detailsStrategy: 'Details 元素策略', detailsPreserve: '保留完整内容', detailsStrictVisual: '仅保留 summary', mergeAdjacentCodeSpans: '合并相邻代码区段',
      advancedSettings: '高级设置', articleMinChars: '文章最少字符数', articleMinRatio: '文章最小比例', toastDuration: 'Toast 显示时间 (ms)',
      resetSettings: '重置为默认值', saveSettings: '保存设置', cancel: '取消', close: '关闭',
      toastSuccess: '✅ 已复制 Markdown', toastSuccessDetail: '模式：{mode}｜字符数：{count}', toastDownloadSuccess: '✅ 已下载 Markdown', toastDownloadDetail: '文件：{filename}｜字符数：{count}', toastError: '❌ 转换失败', toastErrorDetail: '错误：{error}',
      modeSelection: '选中', modeArticleLabel: '文章', modePageLabel: '页面',
      hotkeyHint: '快捷键提示', dragToMove: '拖拽移动', currentHotkey: '当前快捷键', confirmReset: '确定要重置所有设置吗？', settingsResetDone: '设置已重置为默认值', noSelection: '（无选中内容）', settingsSaved: '设置已保存',
    },
    'en': {
      copyMd: 'Copy MD', copySelection: 'Copy Selection', copyArticle: 'Smart Article', copyPage: 'Copy Entire Page', downloadMd: 'Download as .md', settings: 'Settings',
      processing: 'Processing...', copied: 'Copied!', downloaded: 'Downloaded!', failed: 'Failed',
      settingsTitle: 'MD+LaTeX Copy Tool Settings',
      generalSettings: 'General Settings', showButton: 'Show Floating Button', buttonPosition: 'Button Position', bottomRight: 'Bottom Right', bottomLeft: 'Bottom Left', topRight: 'Top Right', topLeft: 'Top Left', buttonOpacity: 'Button Opacity', theme: 'Theme', themeAuto: 'Auto', themeLight: 'Light', themeDark: 'Dark', language: 'Language', langAuto: 'Auto',
      hotkeySettings: 'Hotkey Settings', enableHotkey: 'Enable Hotkey', hotkeyCombo: 'Hotkey Combination', pressKey: 'Press a key...',
      conversionSettings: 'Conversion Settings', noSelectionMode: 'Default Mode (No Selection)', modePage: 'Entire Page', modeArticle: 'Smart Article', absoluteUrls: 'Use Absolute URLs', ignoreNav: 'Ignore Nav/Header/Footer/Aside', waitMathJax: 'Wait for MathJax', stripIndent: 'Strip Common Indent in Block Math', escapeMarkdownChars: 'Escape Markdown special characters', extractShadowDOM: 'Extract Shadow DOM content', extractIframes: 'Extract iframe content (same-origin)',
      captureSettings: 'Capture Timing Settings', waitBeforeCapture: 'Wait before capture (ms)', waitDomIdle: 'Wait after DOM idle (ms)',
      visibilitySettings: 'Visibility Settings', visibilityMode: 'Hidden Element Strategy', visibilityLoose: 'Loose (display/visibility/hidden)', visibilityStrict: 'Strict (incl. opacity/content-visibility/offscreen)', visibilityDom: 'DOM Only (hidden attribute only)', strictOffscreen: 'Enable offscreen element detection', offscreenMargin: 'Offscreen margin (px)',
      formatSettings: 'Format Processing Settings', strongEmBlockStrategy: 'Bold/Italic Block Strategy', strategySplit: 'Split (recommended)', strategyHtml: 'HTML Tags', strategyStrip: 'Strip formatting', complexTableStrategy: 'Complex Table Strategy', strategyList: 'Convert to list', strategyTableHtml: 'HTML table', detailsStrategy: 'Details Element Strategy', detailsPreserve: 'Preserve full content', detailsStrictVisual: 'Keep summary only', mergeAdjacentCodeSpans: 'Merge adjacent code spans',
      advancedSettings: 'Advanced Settings', articleMinChars: 'Article Minimum Characters', articleMinRatio: 'Article Minimum Ratio', toastDuration: 'Toast Duration (ms)',
      resetSettings: 'Reset to Defaults', saveSettings: 'Save Settings', cancel: 'Cancel', close: 'Close',
      toastSuccess: '✅ Markdown Copied', toastSuccessDetail: 'Mode: {mode} | Characters: {count}', toastDownloadSuccess: '✅ Markdown Downloaded', toastDownloadDetail: 'File: {filename} | Characters: {count}', toastError: '❌ Conversion Failed', toastErrorDetail: 'Error: {error}',
      modeSelection: 'Selection', modeArticleLabel: 'Article', modePageLabel: 'Page',
      hotkeyHint: 'Hotkey Hint', dragToMove: 'Drag to move', currentHotkey: 'Current Hotkey', confirmReset: 'Are you sure you want to reset all settings?', settingsResetDone: 'Settings have been reset to defaults', noSelection: '(No selection)', settingsSaved: 'Settings saved',
    }
  };

  function detectLanguage() {
    const lang = S.get('language');
    if (lang !== 'auto') return lang;
    const b = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return /^zh-(tw|hk|mo|hant)/.test(b) ? 'zh-TW' : b.startsWith('zh') ? 'zh-CN' : 'en';
  }

  function t(key, r = {}) {
    let text = I18N[detectLanguage()]?.[key] || I18N['en'][key] || key;
    for (const [k, v] of Object.entries(r)) text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    return text;
  }

  function getEffectiveTheme() {
    const theme = S.get('theme');
    if (theme !== 'auto') return theme;
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; } catch { return 'light'; }
  }

  // ─────────────────────────────────────────────────────────────
  // § SVG 圖示
  // ─────────────────────────────────────────────────────────────

  const SVG_NS = 'http://www.w3.org/2000/svg';

  const ICON_PATHS = {
    copy: 'M9 9h13v13H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    selection: 'M4 7V4h3M20 7V4h-3M4 17v3h3M20 17v3h-3M9 9h6v6H9z',
    article: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    page: 'M3 3h18v18H3zM3 9h18M9 21V9',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
    check: 'M20 6L9 17l-5-5',
    x: 'M18 6L6 18M6 6l12 12',
    alertCircle: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01',
    info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
    chevronDown: 'M6 9l6 6 6-6',
  };

  function createIcon(type) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', ICON_PATHS[type] || '');
    svg.appendChild(path);
    return svg;
  }

  // ─────────────────────────────────────────────────────────────
  // § 樣式表
  // ─────────────────────────────────────────────────────────────

  const STYLES = `
:host{all:initial;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:14px;line-height:1.5}
.mdltx-root{--mdltx-primary:#2563eb;--mdltx-primary-hover:#1d4ed8;--mdltx-success:#16a34a;--mdltx-error:#dc2626;--mdltx-warning:#d97706;--mdltx-focus-ring:0 0 0 3px rgba(37,99,235,0.4)}
.mdltx-root[data-theme="light"]{--mdltx-bg:#fff;--mdltx-bg-secondary:#f3f4f6;--mdltx-bg-tertiary:#e5e7eb;--mdltx-text:#1f2937;--mdltx-text-secondary:#6b7280;--mdltx-border:#d1d5db;--mdltx-shadow:rgba(0,0,0,0.1);--mdltx-shadow-lg:rgba(0,0,0,0.15);--mdltx-overlay:rgba(0,0,0,0.5)}
.mdltx-root[data-theme="dark"]{--mdltx-bg:#1f2937;--mdltx-bg-secondary:#374151;--mdltx-bg-tertiary:#4b5563;--mdltx-text:#f9fafb;--mdltx-text-secondary:#9ca3af;--mdltx-border:#4b5563;--mdltx-shadow:rgba(0,0,0,0.3);--mdltx-shadow-lg:rgba(0,0,0,0.4);--mdltx-overlay:rgba(0,0,0,0.7)}
.mdltx-root{color:var(--mdltx-text)}.mdltx-root *{box-sizing:border-box;margin:0;padding:0}
@media(prefers-reduced-motion:reduce){.mdltx-root *,.mdltx-root *::before,.mdltx-root *::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}
.mdltx-root button:focus-visible,.mdltx-root .mdltx-menu-item:focus-visible,.mdltx-root .mdltx-select:focus-visible,.mdltx-root .mdltx-input:focus-visible,.mdltx-root .mdltx-checkbox:focus-visible,.mdltx-root .mdltx-range:focus-visible{outline:2px solid var(--mdltx-primary);outline-offset:2px}
.mdltx-btn{position:fixed;z-index:2147483647;display:flex;align-items:center;gap:6px;padding:10px 14px;border-radius:12px;border:1px solid var(--mdltx-border);background:var(--mdltx-bg);color:var(--mdltx-text);box-shadow:0 4px 12px var(--mdltx-shadow);cursor:pointer;user-select:none;touch-action:none;transition:transform 0.2s ease,box-shadow 0.2s ease,background 0.2s ease,color 0.2s ease;font-family:inherit;font-size:14px;font-weight:500}
.mdltx-btn:hover:not(.dragging):not(.processing){transform:translateY(-2px);box-shadow:0 8px 24px var(--mdltx-shadow-lg)}
.mdltx-btn:active:not(.dragging){transform:translateY(0)}.mdltx-btn.open{background:var(--mdltx-bg-secondary)}
.mdltx-btn.dragging{cursor:grabbing;opacity:0.8;transition:opacity 0.1s ease}.mdltx-btn.processing{pointer-events:none;opacity:0.7}
.mdltx-btn.success{background:var(--mdltx-success);color:#fff;border-color:var(--mdltx-success)}
.mdltx-btn.error{background:var(--mdltx-error);color:#fff;border-color:var(--mdltx-error)}
.mdltx-btn-icon{width:18px;height:18px;flex-shrink:0;display:flex;align-items:center;justify-content:center}.mdltx-btn-icon svg{width:100%;height:100%}
.mdltx-btn-spinner{width:16px;height:16px;border:2px solid var(--mdltx-border);border-top-color:var(--mdltx-primary);border-radius:50%;animation:mdltx-spin 0.8s linear infinite}
@keyframes mdltx-spin{to{transform:rotate(360deg)}}
.mdltx-menu{position:fixed;z-index:2147483647;min-width:220px;padding:6px;background:var(--mdltx-bg);border:1px solid var(--mdltx-border);border-radius:12px;box-shadow:0 8px 32px var(--mdltx-shadow-lg);opacity:0;visibility:hidden;transform:scale(0.95) translateY(-10px);transform-origin:top;transition:all 0.15s ease}
.mdltx-menu.open{opacity:1;visibility:visible;transform:scale(1) translateY(0)}
.mdltx-menu-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s ease,transform 0.15s ease;color:var(--mdltx-text);border:none;background:none;width:100%;text-align:left;font-family:inherit;font-size:14px}
.mdltx-menu-item:hover:not(:disabled){background:var(--mdltx-bg-secondary);transform:translateX(2px)}
.mdltx-menu-item:active:not(:disabled){background:var(--mdltx-bg-tertiary)}.mdltx-menu-item:disabled{opacity:0.5;cursor:not-allowed}
.mdltx-menu-item-icon{width:18px;height:18px;flex-shrink:0;color:var(--mdltx-text-secondary);display:flex;align-items:center;justify-content:center}.mdltx-menu-item-icon svg{width:100%;height:100%}
.mdltx-menu-item.active .mdltx-menu-item-icon{color:var(--mdltx-primary)}.mdltx-menu-item-text{flex:1}
.mdltx-menu-item-hint{font-size:12px;color:var(--mdltx-text-secondary);margin-left:auto}
.mdltx-menu-divider{height:1px;background:var(--mdltx-border);margin:6px 0}.mdltx-menu-hint{padding:6px 12px;font-size:11px;color:var(--mdltx-text-secondary)}
.mdltx-toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(100px);z-index:2147483647;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;min-width:280px;max-width:min(500px,90vw);border-radius:12px;background:var(--mdltx-bg);border:1px solid var(--mdltx-border);box-shadow:0 8px 32px var(--mdltx-shadow-lg);opacity:0;visibility:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
.mdltx-toast.show{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.mdltx-toast.success{border-left:4px solid var(--mdltx-success)}.mdltx-toast.error{border-left:4px solid var(--mdltx-error)}.mdltx-toast.info{border-left:4px solid var(--mdltx-primary)}
.mdltx-toast-icon{width:20px;height:20px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center}.mdltx-toast-icon svg{width:100%;height:100%}
.mdltx-toast.success .mdltx-toast-icon{color:var(--mdltx-success)}.mdltx-toast.error .mdltx-toast-icon{color:var(--mdltx-error)}.mdltx-toast.info .mdltx-toast-icon{color:var(--mdltx-primary)}
.mdltx-toast-content{flex:1;min-width:0}.mdltx-toast-title{font-weight:600;margin-bottom:2px}.mdltx-toast-detail{font-size:13px;color:var(--mdltx-text-secondary);word-break:break-word}
.mdltx-toast-close{width:24px;height:24px;padding:4px;border:none;background:none;cursor:pointer;border-radius:6px;color:var(--mdltx-text-secondary);transition:all 0.15s ease;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.mdltx-toast-close svg{width:16px;height:16px}.mdltx-toast-close:hover{background:var(--mdltx-bg-secondary);color:var(--mdltx-text)}
.mdltx-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:var(--mdltx-overlay);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;visibility:hidden;transition:all 0.2s ease}
.mdltx-modal-overlay.open{opacity:1;visibility:visible}
.mdltx-modal{width:100%;max-width:580px;max-height:calc(100vh - 40px);background:var(--mdltx-bg);border-radius:16px;box-shadow:0 24px 48px var(--mdltx-shadow-lg);display:flex;flex-direction:column;transform:scale(0.95);transition:transform 0.2s ease}
.mdltx-modal-overlay.open .mdltx-modal{transform:scale(1)}
.mdltx-modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--mdltx-border);flex-shrink:0}
.mdltx-modal-title{font-size:18px;font-weight:600;color:var(--mdltx-text)}
.mdltx-modal-close{width:32px;height:32px;padding:6px;border:none;background:none;cursor:pointer;border-radius:8px;color:var(--mdltx-text-secondary);transition:all 0.15s ease;display:flex;align-items:center;justify-content:center}
.mdltx-modal-close svg{width:20px;height:20px}.mdltx-modal-close:hover{background:var(--mdltx-bg-secondary);color:var(--mdltx-text)}
.mdltx-modal-body{flex:1;overflow-y:auto;padding:20px 24px}
.mdltx-modal-footer{display:flex;justify-content:space-between;gap:12px;padding:16px 24px;border-top:1px solid var(--mdltx-border);flex-shrink:0}
.mdltx-modal-footer-left,.mdltx-modal-footer-right{display:flex;gap:8px}
.mdltx-section{margin-bottom:24px}.mdltx-section:last-child{margin-bottom:0}
.mdltx-section-title{font-size:13px;font-weight:600;color:var(--mdltx-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px}
.mdltx-field{margin-bottom:16px}.mdltx-field:last-child{margin-bottom:0}
.mdltx-field-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
.mdltx-label{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--mdltx-text);cursor:pointer}.mdltx-label-text{flex:1}
.mdltx-checkbox{width:18px;height:18px;accent-color:var(--mdltx-primary);cursor:pointer}
.mdltx-select{padding:8px 12px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg);color:var(--mdltx-text);font-family:inherit;font-size:14px;cursor:pointer;min-width:180px}
.mdltx-select:focus{outline:none;border-color:var(--mdltx-primary);box-shadow:var(--mdltx-focus-ring)}
.mdltx-input{padding:8px 12px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg);color:var(--mdltx-text);font-family:inherit;font-size:14px;width:100px;transition:border-color 0.15s ease,box-shadow 0.15s ease}
.mdltx-input:focus{outline:none;border-color:var(--mdltx-primary);box-shadow:var(--mdltx-focus-ring)}
.mdltx-input.invalid{border-color:var(--mdltx-error);background:rgba(220,38,38,0.05)}.mdltx-input.valid{border-color:var(--mdltx-success)}
.mdltx-input-wrapper{position:relative;display:inline-flex;align-items:center}
.mdltx-range-container{display:flex;align-items:center;gap:8px}.mdltx-range{width:120px;accent-color:var(--mdltx-primary)}
.mdltx-range-value{font-size:13px;color:var(--mdltx-text-secondary);min-width:36px;text-align:right}
.mdltx-hotkey-input{display:flex;align-items:center;gap:8px}.mdltx-hotkey-display{display:flex;gap:4px;flex-wrap:wrap}
.mdltx-kbd{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:26px;padding:0 8px;background:var(--mdltx-bg-secondary);border:1px solid var(--mdltx-border);border-radius:6px;font-size:12px;font-weight:500;color:var(--mdltx-text)}
.mdltx-hotkey-record-btn{padding:6px 12px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg-secondary);color:var(--mdltx-text);font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.15s ease}
.mdltx-hotkey-record-btn:hover{background:var(--mdltx-bg-tertiary)}.mdltx-hotkey-record-btn.recording{background:var(--mdltx-primary);color:#fff;border-color:var(--mdltx-primary)}
.mdltx-btn-primary{padding:10px 20px;border:none;border-radius:8px;background:var(--mdltx-primary);color:#fff;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease}
.mdltx-btn-primary:hover{background:var(--mdltx-primary-hover)}
.mdltx-btn-secondary{padding:10px 20px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg);color:var(--mdltx-text);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease}
.mdltx-btn-secondary:hover{background:var(--mdltx-bg-secondary)}
.mdltx-btn-danger{padding:10px 20px;border:1px solid var(--mdltx-error);border-radius:8px;background:transparent;color:var(--mdltx-error);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease}
.mdltx-btn-danger:hover{background:var(--mdltx-error);color:#fff}
.icon{display:inline-block;vertical-align:middle}
.mdltx-conditional{margin-left:26px;padding-left:12px;border-left:2px solid var(--mdltx-border);margin-top:8px}.mdltx-conditional.hidden{display:none}
`;

  // ─────────────────────────────────────────────────────────────
  // § DOM 工具
  // ─────────────────────────────────────────────────────────────

  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'className') el.className = value;
      else if (key === 'textContent') el.textContent = value;
      else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
      else if (key === 'dataset' && typeof value === 'object') Object.assign(el.dataset, value);
      else el.setAttribute(key, value);
    }
    for (const child of children) {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child instanceof Node) el.appendChild(child);
    }
    return el;
  }

  function sanitizeFilename(name) {
    return String(name || 'document').replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 100) || 'document';
  }

  function generateFilename() {
    const title = sanitizeFilename(document.title || 'untitled'), date = new Date().toISOString().slice(0, 10);
    return S.get('downloadFilenameTemplate').replace('{title}', title).replace('{date}', date).replace('{timestamp}', Date.now().toString()) + '.md';
  }

  function downloadAsFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' }), url = URL.createObjectURL(blob);
    const a = createElement('a', { href: url, download: filename, style: { display: 'none' } });
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    return filename;
  }

  class FocusTrap {
    constructor(container) { this.container = container; this.prev = null; this._onKey = this._onKey.bind(this); }
    activate() {
      this.prev = document.activeElement;
      this.container.addEventListener('keydown', this._onKey);
      requestAnimationFrame(() => { const f = this._focusable()[0]; if (f) f.focus(); });
    }
    deactivate() {
      this.container.removeEventListener('keydown', this._onKey);
      if (this.prev?.focus) try { this.prev.focus(); } catch {}
      this.prev = null;
    }
    _focusable() {
      return Array.from(this.container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),a[href]')).filter(el => el.offsetParent !== null);
    }
    _onKey(e) {
      if (e.key !== 'Tab') return;
      const f = this._focusable(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1], act = (this.container.getRootNode?.() || document).activeElement;
      if (e.shiftKey) { if (act === first || !f.includes(act)) { e.preventDefault(); last.focus(); } }
      else { if (act === last || !f.includes(act)) { e.preventDefault(); first.focus(); } }
    }
  }

  class TimeoutManager {
    constructor() { this._t = new Set(); }
    set(fn, delay) { const id = setTimeout(() => { this._t.delete(id); fn(); }, delay); this._t.add(id); return id; }
    clear(id) { if (id !== undefined) { clearTimeout(id); this._t.delete(id); } }
    clearAll() { for (const id of this._t) clearTimeout(id); this._t.clear(); }
  }

  function generateNonce() { return Math.random().toString(36).slice(2, 10); }
  function makePlaceholder(kind, nonce, id) { return `@@MDLTX${kind}-${nonce}-${id}@@`; }

  // ─────────────────────────────────────────────────────────────
  // § UI Manager
  // ─────────────────────────────────────────────────────────────

  class UIManager {
    constructor() {
      this.host = null; this.shadow = null; this.root = null;
      this.button = null; this.menu = null; this.toast = null; this.modal = null;
      this.isProcessing = false; this.isDragging = false; this.dragPointerId = null;
      this.dragOffset = { x: 0, y: 0 }; this.menuOpen = false; this.toastTimeoutId = null;
      this._buttonWidth = 0; this._buttonHeight = 0;
      this._focusTrap = null; this._prevBodyOverflow = '';
      this._tm = new TimeoutManager();
      this._handlers = { docClick: null, docKey: null, themeChange: null, selChange: null };
    }

    init() {
      this._createHost();
      this.updateTheme();
      if (S.get('showButton')) { this._createButton(); this._createMenu(); }
      this._createToast();
      this._bindGlobal();
      this._handlers.themeChange = () => { if (S.get('theme') === 'auto') this.updateTheme(); };
      try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this._handlers.themeChange); } catch {}
      this._handlers.selChange = () => { if (this.menuOpen) this._updateMenuSelState(); };
      document.addEventListener('selectionchange', this._handlers.selChange);
    }

    _createHost() {
      this.host = document.createElement('div');
      this.host.id = 'mdltx-ui-host';
      this.host.setAttribute('data-mdltx-ui', '1');
      this.shadow = this.host.attachShadow({ mode: 'closed' });
      const style = document.createElement('style'); style.textContent = STYLES; this.shadow.appendChild(style);
      this.root = document.createElement('div'); this.root.className = 'mdltx-root'; this.shadow.appendChild(this.root);
      document.body.appendChild(this.host);
    }

    updateTheme() { if (this.root) this.root.setAttribute('data-theme', getEffectiveTheme()); }

    _createButton() {
      if (this.button) return;
      this.button = createElement('button', {
        className: 'mdltx-btn', type: 'button', role: 'button',
        'aria-label': t('copyMd'), 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-controls': 'mdltx-menu'
      }, [
        createElement('span', { className: 'mdltx-btn-icon' }, [createIcon('copy')]),
        createElement('span', { className: 'mdltx-btn-text', textContent: t('copyMd') }),
        createElement('span', { className: 'mdltx-btn-icon mdltx-btn-chevron' }, [createIcon('chevronDown')])
      ]);
      this.root.appendChild(this.button);
      this._updateButtonPos();
      this._bindButton();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this.button) { this._buttonWidth = this.button.offsetWidth; this._buttonHeight = this.button.offsetHeight; }
      }));
    }

    _updateButtonPos() {
      if (!this.button) return;
      const pos = S.get('buttonPosition'), offX = S.get('buttonOffsetX'), offY = S.get('buttonOffsetY'), s = this.button.style;
      s.top = s.bottom = s.left = s.right = ''; s.opacity = S.get('buttonOpacity');
      const [sB, sR, sL, sT] = ['env(safe-area-inset-bottom,0px)', 'env(safe-area-inset-right,0px)', 'env(safe-area-inset-left,0px)', 'env(safe-area-inset-top,0px)'];
      const positions = {
        'bottom-right': { bottom: `calc(${offY}px + ${sB})`, right: `calc(${offX}px + ${sR})` },
        'bottom-left': { bottom: `calc(${offY}px + ${sB})`, left: `calc(${offX}px + ${sL})` },
        'top-right': { top: `calc(${offY}px + ${sT})`, right: `calc(${offX}px + ${sR})` },
        'top-left': { top: `calc(${offY}px + ${sT})`, left: `calc(${offX}px + ${sL})` }
      };
      Object.assign(s, positions[pos] || positions['bottom-right']);
    }

    _createMenu() {
      if (this.menu) return;
      this.menu = createElement('div', { className: 'mdltx-menu', id: 'mdltx-menu', role: 'menu', 'aria-label': t('copyMd') });
      this._updateMenuContent();
      this.root.appendChild(this.menu);
    }

    _updateMenuContent() {
      if (!this.menu) return;
      const hasSel = hasSelection(), noSelMode = S.get('noSelectionMode');
      this.menu.innerHTML = '';

      const mkItem = (action, icon, text, disabled = false) => {
        const item = createElement('button', { className: 'mdltx-menu-item', role: 'menuitem', type: 'button', dataset: { action } }, [
          createElement('span', { className: 'mdltx-menu-item-icon' }, [createIcon(icon)]),
          createElement('span', { className: 'mdltx-menu-item-text', textContent: text })
        ]);
        if (disabled) item.setAttribute('disabled', '');
        return item;
      };

      const selItem = mkItem('selection', 'selection', t('copySelection'), !hasSel);
      if (!hasSel) selItem.appendChild(createElement('span', { className: 'mdltx-menu-item-hint', textContent: t('noSelection') }));

      const artItem = mkItem('article', 'article', t('copyArticle'));
      if (noSelMode === 'article') artItem.classList.add('active');

      const pageItem = mkItem('page', 'page', t('copyPage'));
      if (noSelMode === 'page') pageItem.classList.add('active');

      [selItem, artItem, pageItem,
        createElement('div', { className: 'mdltx-menu-divider', role: 'separator' }),
        mkItem('download', 'download', t('downloadMd')),
        createElement('div', { className: 'mdltx-menu-divider', role: 'separator' }),
        mkItem('settings', 'settings', t('settings')),
        createElement('div', { className: 'mdltx-menu-hint', textContent: this._getHotkeyHint() })
      ].forEach(el => this.menu.appendChild(el));

      this._bindMenu();
    }

    _updateMenuSelState() {
      if (!this.menu) return;
      const hasSel = hasSelection(), selItem = this.menu.querySelector('[data-action="selection"]');
      if (!selItem) return;
      if (hasSel) { selItem.removeAttribute('disabled'); const h = selItem.querySelector('.mdltx-menu-item-hint'); if (h) h.remove(); }
      else { selItem.setAttribute('disabled', ''); if (!selItem.querySelector('.mdltx-menu-item-hint')) selItem.appendChild(createElement('span', { className: 'mdltx-menu-item-hint', textContent: t('noSelection') })); }
    }

    _getHotkeyHint() {
      if (!S.get('hotkeyEnabled')) return '';
      const parts = [];
      if (S.get('hotkeyCtrl')) parts.push('Ctrl');
      if (S.get('hotkeyAlt')) parts.push('Alt');
      if (S.get('hotkeyShift')) parts.push('Shift');
      parts.push(S.get('hotkeyKey').toUpperCase());
      return `${t('currentHotkey')}: ${parts.join(' + ')}`;
    }

    _createToast() {
      if (this.toast) return;
      this.toast = createElement('div', { className: 'mdltx-toast', role: 'status', 'aria-live': 'polite' });
      this.root.appendChild(this.toast);
    }

    showMenu() {
      if (!this.button || !this.menu) return;
      this._updateMenuContent();
      const m = this.menu, b = this.button, s = m.style;
      s.visibility = 'hidden'; s.display = 'block'; m.classList.add('open');
      const mr = m.getBoundingClientRect(), br = b.getBoundingClientRect(), pos = S.get('buttonPosition');
      s.top = s.bottom = s.left = s.right = '';
      if (pos.includes('bottom')) { if (br.top < mr.height + 16) s.top = `${br.bottom + 8}px`; else s.bottom = `${window.innerHeight - br.top + 8}px`; }
      else { if (window.innerHeight - br.bottom < mr.height + 16) s.bottom = `${window.innerHeight - br.top + 8}px`; else s.top = `${br.bottom + 8}px`; }
      if (pos.includes('right')) { if (br.right < mr.width) s.left = `${br.left}px`; else s.right = `${window.innerWidth - br.right}px`; }
      else { if (window.innerWidth - br.left < mr.width) s.right = `${window.innerWidth - br.right}px`; else s.left = `${br.left}px`; }
      s.visibility = ''; s.display = '';
      this.menuOpen = true; b.classList.add('open'); b.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => { const f = m.querySelector('.mdltx-menu-item:not([disabled])'); if (f) f.focus(); });
    }

    hideMenu(restoreFocus = true) {
      if (this.menu) this.menu.classList.remove('open');
      if (this.button) { this.button.classList.remove('open'); this.button.setAttribute('aria-expanded', 'false'); if (restoreFocus) this.button.focus(); }
      this.menuOpen = false;
    }

    showToast(type, title, detail = '', duration = null) {
      if (this.toastTimeoutId !== null) { this._tm.clear(this.toastTimeoutId); this.toastTimeoutId = null; }
      this.toast.classList.remove('show');
      requestAnimationFrame(() => {
        this.toast.innerHTML = ''; this.toast.className = `mdltx-toast ${type}`;
        const icons = { success: 'check', error: 'alertCircle', info: 'info' };
        const closeBtn = createElement('button', { className: 'mdltx-toast-close', type: 'button', 'aria-label': t('close') }, [createIcon('x')]);
        closeBtn.addEventListener('click', () => this.hideToast());
        this.toast.append(
          createElement('span', { className: 'mdltx-toast-icon' }, [createIcon(icons[type] || 'info')]),
          createElement('div', { className: 'mdltx-toast-content' }, [
            createElement('div', { className: 'mdltx-toast-title', textContent: title }),
            ...(detail ? [createElement('div', { className: 'mdltx-toast-detail', textContent: detail })] : [])
          ]), closeBtn
        );
        void this.toast.offsetHeight; this.toast.classList.add('show');
        const ms = duration ?? S.get('toastDuration');
        if (ms > 0) this.toastTimeoutId = this._tm.set(() => this.hideToast(), ms);
      });
    }

    hideToast() {
      if (!this.toast) return;
      this.toast.classList.remove('show');
      if (this.toastTimeoutId !== null) { this._tm.clear(this.toastTimeoutId); this.toastTimeoutId = null; }
      this._tm.set(() => { if (this.toast && !this.toast.classList.contains('show')) this.toast.innerHTML = ''; }, 300);
    }

    setButtonState(state) {
      if (!this.button) return;
      const iconEl = this.button.querySelector('.mdltx-btn-icon:first-child');
      const textEl = this.button.querySelector('.mdltx-btn-text');
      const chevronEl = this.button.querySelector('.mdltx-btn-chevron');
      if (!iconEl || !textEl) return;
      this.button.classList.remove('processing', 'success', 'error'); iconEl.innerHTML = '';
      const states = {
        processing: { cls: 'processing', icon: () => createElement('div', { className: 'mdltx-btn-spinner' }), text: t('processing'), hideChev: true },
        success: { cls: 'success', icon: () => createIcon('check'), text: t('copied'), hideChev: true, reset: 2000 },
        downloaded: { cls: 'success', icon: () => createIcon('check'), text: t('downloaded'), hideChev: true, reset: 2000 },
        error: { cls: 'error', icon: () => createIcon('x'), text: t('failed'), hideChev: true, reset: 2000 }
      };
      const cfg = states[state];
      if (cfg) {
        this.button.classList.add(cfg.cls); iconEl.appendChild(cfg.icon()); textEl.textContent = cfg.text;
        if (chevronEl) chevronEl.style.display = cfg.hideChev ? 'none' : '';
        if (cfg.reset) this._tm.set(() => this.setButtonState('default'), cfg.reset);
      } else {
        iconEl.appendChild(createIcon('copy')); textEl.textContent = t('copyMd');
        if (chevronEl) chevronEl.style.display = '';
      }
    }

    showSettings() {
      this.hideMenu(false);
      if (this.modal) { this.modal.remove(); this.modal = null; }
      this._prevBodyOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
      const settings = S.getAll();

      const mkCheck = (id, label, checked) => {
        const cb = createElement('input', { type: 'checkbox', className: 'mdltx-checkbox', id }); if (checked) cb.checked = true;
        return createElement('div', { className: 'mdltx-field' }, [createElement('div', { className: 'mdltx-field-row' }, [createElement('label', { className: 'mdltx-label' }, [cb, createElement('span', { className: 'mdltx-label-text', textContent: label })])])]);
      };
      const mkSelect = (id, label, opts, val) => {
        const sel = createElement('select', { className: 'mdltx-select', id });
        for (const o of opts) { const opt = createElement('option', { value: o.value, textContent: o.label }); if (o.value === val) opt.selected = true; sel.appendChild(opt); }
        return createElement('div', { className: 'mdltx-field' }, [createElement('div', { className: 'mdltx-field-row' }, [createElement('span', { className: 'mdltx-label-text', textContent: label }), sel])]);
      };
      const mkRange = (id, label, val, min, max, step) => createElement('div', { className: 'mdltx-field' }, [createElement('div', { className: 'mdltx-field-row' }, [
        createElement('span', { className: 'mdltx-label-text', textContent: label }),
        createElement('div', { className: 'mdltx-range-container' }, [
          createElement('input', { type: 'range', className: 'mdltx-range', id, min: String(min), max: String(max), step: String(step), value: String(val) }),
          createElement('span', { className: 'mdltx-range-value', id: `${id}-value`, textContent: `${Math.round(val * 100)}%` })
        ])
      ])]);
      const mkNum = (id, label, val, min, max, step = 1) => createElement('div', { className: 'mdltx-field' }, [createElement('div', { className: 'mdltx-field-row' }, [
        createElement('span', { className: 'mdltx-label-text', textContent: label }),
        createElement('div', { className: 'mdltx-input-wrapper' }, [createElement('input', { type: 'number', className: 'mdltx-input', id, value: String(val), min: String(min), max: String(max), step: String(step) })])
      ])]);

      const overlay = createElement('div', { className: 'mdltx-modal-overlay' });
      const modal = createElement('div', { className: 'mdltx-modal', role: 'dialog', 'aria-labelledby': 'mdltx-settings-title', 'aria-modal': 'true' });

      const header = createElement('div', { className: 'mdltx-modal-header' }, [createElement('h2', { className: 'mdltx-modal-title', id: 'mdltx-settings-title', textContent: t('settingsTitle') })]);
      const closeBtn = createElement('button', { className: 'mdltx-modal-close', type: 'button', 'aria-label': t('close') }, [createIcon('x')]); header.appendChild(closeBtn);

      const mkSection = (title, ...fields) => createElement('div', { className: 'mdltx-section' }, [createElement('div', { className: 'mdltx-section-title', textContent: title }), ...fields]);

      const hotkeyField = createElement('div', { className: 'mdltx-field', id: 'hotkey-combo-field', style: { display: settings.hotkeyEnabled ? 'block' : 'none' } });
      const hotkeyDisplay = createElement('div', { className: 'mdltx-hotkey-display', id: 'hotkey-display' });
      if (settings.hotkeyCtrl) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Ctrl' }));
      if (settings.hotkeyAlt) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Alt' }));
      if (settings.hotkeyShift) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Shift' }));
      hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: settings.hotkeyKey.toUpperCase() }));
      hotkeyField.appendChild(createElement('div', { className: 'mdltx-field-row' }, [
        createElement('span', { className: 'mdltx-label-text', textContent: t('hotkeyCombo') }),
        createElement('div', { className: 'mdltx-hotkey-input' }, [hotkeyDisplay, createElement('button', { className: 'mdltx-hotkey-record-btn', type: 'button', id: 'hotkey-record-btn', textContent: t('pressKey') })])
      ]));

      const offscreenCond = createElement('div', { className: `mdltx-conditional ${settings.strictOffscreen ? '' : 'hidden'}`, id: 'offscreen-conditional' });
      offscreenCond.appendChild(mkNum('setting-offscreenMargin', t('offscreenMargin'), settings.offscreenMargin, 0, 500, 10));

      const body = createElement('div', { className: 'mdltx-modal-body' }, [
        mkSection(t('generalSettings'),
          mkCheck('setting-showButton', t('showButton'), settings.showButton),
          mkSelect('setting-buttonPosition', t('buttonPosition'), [{ value: 'bottom-right', label: t('bottomRight') }, { value: 'bottom-left', label: t('bottomLeft') }, { value: 'top-right', label: t('topRight') }, { value: 'top-left', label: t('topLeft') }], settings.buttonPosition),
          mkRange('setting-buttonOpacity', t('buttonOpacity'), settings.buttonOpacity, 0.3, 1, 0.1),
          mkSelect('setting-theme', t('theme'), [{ value: 'auto', label: t('themeAuto') }, { value: 'light', label: t('themeLight') }, { value: 'dark', label: t('themeDark') }], settings.theme),
          mkSelect('setting-language', t('language'), [{ value: 'auto', label: t('langAuto') }, { value: 'zh-TW', label: '繁體中文' }, { value: 'zh-CN', label: '简体中文' }, { value: 'en', label: 'English' }], settings.language)),
        mkSection(t('hotkeySettings'), mkCheck('setting-hotkeyEnabled', t('enableHotkey'), settings.hotkeyEnabled), hotkeyField),
        mkSection(t('conversionSettings'),
          mkSelect('setting-noSelectionMode', t('noSelectionMode'), [{ value: 'page', label: t('modePage') }, { value: 'article', label: t('modeArticle') }], settings.noSelectionMode),
          mkCheck('setting-absoluteUrls', t('absoluteUrls'), settings.absoluteUrls),
          mkCheck('setting-ignoreNav', t('ignoreNav'), settings.ignoreNav),
          mkCheck('setting-waitMathJax', t('waitMathJax'), settings.waitMathJax),
          mkCheck('setting-stripIndent', t('stripIndent'), settings.stripCommonIndentInBlockMath),
          mkCheck('setting-escapeMarkdownChars', t('escapeMarkdownChars'), settings.escapeMarkdownChars),
          mkCheck('setting-extractShadowDOM', t('extractShadowDOM'), settings.extractShadowDOM),
          mkCheck('setting-extractIframes', t('extractIframes'), settings.extractIframes)),
        mkSection(t('captureSettings'), mkNum('setting-waitBeforeCaptureMs', t('waitBeforeCapture'), settings.waitBeforeCaptureMs, 0, 30000, 100), mkNum('setting-waitDomIdleMs', t('waitDomIdle'), settings.waitDomIdleMs, 0, 5000, 100)),
        mkSection(t('formatSettings'),
          mkSelect('setting-strongEmBlockStrategy', t('strongEmBlockStrategy'), [{ value: 'split', label: t('strategySplit') }, { value: 'html', label: t('strategyHtml') }, { value: 'strip', label: t('strategyStrip') }], settings.strongEmBlockStrategy),
          mkSelect('setting-complexTableStrategy', t('complexTableStrategy'), [{ value: 'list', label: t('strategyList') }, { value: 'html', label: t('strategyTableHtml') }], settings.complexTableStrategy),
          mkSelect('setting-detailsStrategy', t('detailsStrategy'), [{ value: 'preserve', label: t('detailsPreserve') }, { value: 'strict-visual', label: t('detailsStrictVisual') }], settings.detailsStrategy),
          mkCheck('setting-mergeAdjacentCodeSpans', t('mergeAdjacentCodeSpans'), settings.mergeAdjacentCodeSpans)),
        mkSection(t('visibilitySettings'),
          mkSelect('setting-visibilityMode', t('visibilityMode'), [{ value: 'loose', label: t('visibilityLoose') }, { value: 'strict', label: t('visibilityStrict') }, { value: 'dom', label: t('visibilityDom') }], settings.visibilityMode),
          mkCheck('setting-strictOffscreen', t('strictOffscreen'), settings.strictOffscreen), offscreenCond),
        mkSection(t('advancedSettings'), mkNum('setting-articleMinChars', t('articleMinChars'), settings.articleMinChars, 100, 10000, 50), mkNum('setting-articleMinRatio', t('articleMinRatio'), settings.articleMinRatio, 0.1, 1, 0.05), mkNum('setting-toastDuration', t('toastDuration'), settings.toastDuration, 500, 10000, 100))
      ]);

      const footer = createElement('div', { className: 'mdltx-modal-footer' }, [
        createElement('div', { className: 'mdltx-modal-footer-left' }, [createElement('button', { className: 'mdltx-btn-danger', type: 'button', id: 'settings-reset', textContent: t('resetSettings') })]),
        createElement('div', { className: 'mdltx-modal-footer-right' }, [
          createElement('button', { className: 'mdltx-btn-secondary', type: 'button', id: 'settings-cancel', textContent: t('cancel') }),
          createElement('button', { className: 'mdltx-btn-primary', type: 'button', id: 'settings-save', textContent: t('saveSettings') })
        ])
      ]);

      modal.append(header, body, footer); overlay.appendChild(modal); this.root.appendChild(overlay); this.modal = overlay;
      this._focusTrap = new FocusTrap(modal);
      void overlay.offsetHeight; overlay.classList.add('open'); this._focusTrap.activate();
      this._bindSettings(overlay, settings);
    }

    closeSettings() {
      if (!this.modal) return;
      if (this._focusTrap) { this._focusTrap.deactivate(); this._focusTrap = null; }
      document.body.style.overflow = this._prevBodyOverflow; this._prevBodyOverflow = '';
      this.modal.classList.remove('open');
      this._tm.set(() => { if (this.modal?.parentNode) this.modal.remove(); this.modal = null; }, 200);
    }

    _bindSettings(overlay, originalSettings) {
      let recording = false, hotkeyHandler = null;
      const origOpacity = originalSettings.buttonOpacity, origTheme = getEffectiveTheme();
      let tempHotkey = { ctrl: originalSettings.hotkeyCtrl, alt: originalSettings.hotkeyAlt, shift: originalSettings.hotkeyShift, key: originalSettings.hotkeyKey };
      const gv = id => overlay.querySelector(`#${id}`);

      const stopRec = () => {
        if (!recording) return; recording = false;
        const btn = gv('hotkey-record-btn'); if (btn) { btn.classList.remove('recording'); btn.textContent = t('pressKey'); }
        if (hotkeyHandler) { document.removeEventListener('keydown', hotkeyHandler, true); hotkeyHandler = null; }
      };
      const restorePreview = () => { if (this.button) this.button.style.opacity = origOpacity; if (this.root) this.root.setAttribute('data-theme', origTheme); };
      const close = (restore = true) => { stopRec(); if (restore) restorePreview(); this.closeSettings(); };

      overlay.querySelector('.mdltx-modal-close')?.addEventListener('click', () => close(true));
      gv('settings-cancel')?.addEventListener('click', () => close(true));
      overlay.addEventListener('click', e => { if (e.target === overlay) close(true); });
      overlay.querySelector('.mdltx-modal')?.addEventListener('keydown', e => { if (e.key === 'Escape' && !recording) { e.preventDefault(); e.stopPropagation(); close(true); } });

      const opSlider = gv('setting-buttonOpacity'), opVal = gv('setting-buttonOpacity-value');
      if (opSlider && opVal) opSlider.oninput = () => { const v = parseFloat(opSlider.value); opVal.textContent = Math.round(v * 100) + '%'; if (this.button) this.button.style.opacity = v; };

      const themeSelect = gv('setting-theme');
      if (themeSelect) themeSelect.onchange = () => { this.root.setAttribute('data-theme', themeSelect.value === 'auto' ? getEffectiveTheme() : themeSelect.value); };

      const setupNumVal = (id, min, max) => {
        const inp = gv(id); if (!inp) return;
        inp.addEventListener('input', () => { const v = parseFloat(inp.value); inp.classList.remove('valid', 'invalid'); if (inp.value !== '') inp.classList.add(!isNaN(v) && v >= min && v <= max ? 'valid' : 'invalid'); });
        inp.addEventListener('blur', () => { const v = parseFloat(inp.value); inp.value = isNaN(v) ? min : Math.max(min, Math.min(max, v)); inp.classList.remove('valid', 'invalid'); });
      };
      setupNumVal('setting-articleMinChars', 100, 10000); setupNumVal('setting-articleMinRatio', 0.1, 1); setupNumVal('setting-toastDuration', 500, 10000);
      setupNumVal('setting-waitBeforeCaptureMs', 0, 30000); setupNumVal('setting-waitDomIdleMs', 0, 5000); setupNumVal('setting-offscreenMargin', 0, 500);

      const strictCb = gv('setting-strictOffscreen'), offCond = gv('offscreen-conditional');
      if (strictCb && offCond) strictCb.addEventListener('change', () => offCond.classList.toggle('hidden', !strictCb.checked));

      const hotkeyDisplay = gv('hotkey-display');
      const updateHotkeyDisp = () => {
        if (!hotkeyDisplay) return; hotkeyDisplay.innerHTML = '';
        if (tempHotkey.ctrl) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Ctrl' }));
        if (tempHotkey.alt) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Alt' }));
        if (tempHotkey.shift) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Shift' }));
        hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: tempHotkey.key.toUpperCase() }));
      };

      const ignoredKeys = new Set(['Control', 'Alt', 'Shift', 'Meta', 'CapsLock', 'Tab', 'Escape', 'Enter', 'Backspace', 'Delete', 'Insert', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrintScreen', 'ScrollLock', 'Pause', 'ContextMenu', 'NumLock', 'Clear', 'Help']);
      const recordBtn = gv('hotkey-record-btn');
      if (recordBtn) {
        recordBtn.onclick = () => {
          if (recording) { stopRec(); return; }
          recording = true; recordBtn.classList.add('recording'); recordBtn.textContent = '...';
          hotkeyHandler = e => {
            if (!recording || ignoredKeys.has(e.key)) return;
            e.preventDefault(); e.stopPropagation();
            tempHotkey = { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, key: e.key.toLowerCase() };
            updateHotkeyDisp(); stopRec();
          };
          document.addEventListener('keydown', hotkeyHandler, true);
        };
      }

      const hotkeyEnabled = gv('setting-hotkeyEnabled'), hotkeyField = gv('hotkey-combo-field');
      if (hotkeyEnabled && hotkeyField) hotkeyEnabled.onchange = () => { hotkeyField.style.display = hotkeyEnabled.checked ? 'block' : 'none'; if (!hotkeyEnabled.checked) stopRec(); };

      gv('settings-reset')?.addEventListener('click', () => { if (confirm(t('confirmReset'))) { S.resetAll(); close(false); this.refresh(); this.showToast('success', t('toastSuccess'), t('settingsResetDone')); } });

      const valNum = (v, min, max, def) => { const n = parseFloat(v); return isNaN(n) ? def : Math.max(min, Math.min(max, n)); };

      gv('settings-save')?.addEventListener('click', () => {
        stopRec();
        const vals = {
          showButton: gv('setting-showButton')?.checked, buttonPosition: gv('setting-buttonPosition')?.value,
          buttonOpacity: valNum(gv('setting-buttonOpacity')?.value, 0.3, 1, 1),
          theme: gv('setting-theme')?.value, language: gv('setting-language')?.value,
          hotkeyEnabled: gv('setting-hotkeyEnabled')?.checked,
          hotkeyCtrl: tempHotkey.ctrl, hotkeyAlt: tempHotkey.alt, hotkeyShift: tempHotkey.shift, hotkeyKey: tempHotkey.key,
          noSelectionMode: gv('setting-noSelectionMode')?.value,
          absoluteUrls: gv('setting-absoluteUrls')?.checked, ignoreNav: gv('setting-ignoreNav')?.checked,
          waitMathJax: gv('setting-waitMathJax')?.checked, stripCommonIndentInBlockMath: gv('setting-stripIndent')?.checked,
          escapeMarkdownChars: gv('setting-escapeMarkdownChars')?.checked,
          extractShadowDOM: gv('setting-extractShadowDOM')?.checked, extractIframes: gv('setting-extractIframes')?.checked,
          waitBeforeCaptureMs: valNum(gv('setting-waitBeforeCaptureMs')?.value, 0, 30000, 0),
          waitDomIdleMs: valNum(gv('setting-waitDomIdleMs')?.value, 0, 5000, 0),
          visibilityMode: gv('setting-visibilityMode')?.value, strictOffscreen: gv('setting-strictOffscreen')?.checked,
          offscreenMargin: valNum(gv('setting-offscreenMargin')?.value, 0, 500, 100),
          articleMinChars: valNum(gv('setting-articleMinChars')?.value, 100, 10000, 600),
          articleMinRatio: valNum(gv('setting-articleMinRatio')?.value, 0.1, 1, 0.55),
          toastDuration: valNum(gv('setting-toastDuration')?.value, 500, 10000, 2500),
          strongEmBlockStrategy: gv('setting-strongEmBlockStrategy')?.value, complexTableStrategy: gv('setting-complexTableStrategy')?.value,
          detailsStrategy: gv('setting-detailsStrategy')?.value, mergeAdjacentCodeSpans: gv('setting-mergeAdjacentCodeSpans')?.checked,
        };
        for (const [k, v] of Object.entries(vals)) if (v !== undefined) S.set(k, v);
        close(false); this.refresh(); this.showToast('success', t('toastSuccess'), t('settingsSaved'));
      });
    }

    _bindButton() {
      if (!this.button) return;
      this.button.onclick = e => { if (!this.isDragging) { e.stopPropagation(); this.menuOpen ? this.hideMenu() : this.showMenu(); } };
      this.button.onpointerdown = e => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        const rect = this.button.getBoundingClientRect();
        this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        const startX = e.clientX, startY = e.clientY; let moved = false;
        this.button.setPointerCapture(e.pointerId); this.dragPointerId = e.pointerId;

        const onMove = ev => {
          if (ev.pointerId !== this.dragPointerId) return;
          const dx = ev.clientX - startX, dy = ev.clientY - startY;
          if (!moved && Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
          moved = true; this.isDragging = true; this.button.classList.add('dragging');
          if (this.menuOpen) this.hideMenu(false);
          const x = ev.clientX - this.dragOffset.x, y = ev.clientY - this.dragOffset.y;
          const pos = (y < window.innerHeight / 2 ? 'top' : 'bottom') + '-' + (x < window.innerWidth / 2 ? 'left' : 'right');
          const btnW = this._buttonWidth || this.button.offsetWidth || 100, btnH = this._buttonHeight || this.button.offsetHeight || 40;
          let offX = pos.includes('right') ? window.innerWidth - x - btnW : x;
          let offY = pos.includes('bottom') ? window.innerHeight - y - btnH : y;
          offX = Math.max(8, Math.min(offX, window.innerWidth - btnW - 8));
          offY = Math.max(8, Math.min(offY, window.innerHeight - btnH - 8));
          S.set('buttonPosition', pos); S.set('buttonOffsetX', Math.round(offX)); S.set('buttonOffsetY', Math.round(offY));
          this._updateButtonPos();
        };
        const onUp = ev => {
          if (ev.pointerId !== this.dragPointerId) return;
          try { this.button.releasePointerCapture(ev.pointerId); } catch {}
          this.dragPointerId = null;
          this.button.removeEventListener('pointermove', onMove);
          this.button.removeEventListener('pointerup', onUp);
          this.button.removeEventListener('pointercancel', onUp);
          this.button.classList.remove('dragging');
          if (moved) this._tm.set(() => { this.isDragging = false; }, 50);
          else this.isDragging = false;
        };
        this.button.addEventListener('pointermove', onMove);
        this.button.addEventListener('pointerup', onUp);
        this.button.addEventListener('pointercancel', onUp);
      };
    }

    _bindMenu() {
      if (!this.menu) return;
      this.menu.querySelectorAll('.mdltx-menu-item').forEach(item => {
        item.onclick = async e => {
          if (item.hasAttribute('disabled')) { e.preventDefault(); return; }
          const action = item.dataset.action; this.hideMenu();
          if (action === 'settings') this.showSettings();
          else if (action === 'download') await this.handleDownload();
          else if (action) await this.handleCopy(action);
        };
      });
      this.menu.onkeydown = e => {
        const items = Array.from(this.menu.querySelectorAll('.mdltx-menu-item:not([disabled])')), len = items.length;
        if (!len) return;
        const curIdx = items.indexOf(this.shadow?.activeElement);
        const nav = { ArrowDown: (curIdx + 1) % len, ArrowUp: (curIdx - 1 + len) % len, Home: 0, End: len - 1 };
        if (e.key in nav) { e.preventDefault(); items[nav[e.key]]?.focus(); }
        else if (e.key === 'Escape') { e.preventDefault(); this.hideMenu(); }
      };
    }

    _bindGlobal() {
      if (this._handlers.docClick) document.removeEventListener('click', this._handlers.docClick);
      if (this._handlers.docKey) document.removeEventListener('keydown', this._handlers.docKey);
      this._handlers.docClick = e => {
        if (!this.menuOpen) return;
        const path = e.composedPath?.() || [e.target];
        if (!path.includes(this.host) && !this.host?.contains(e.target)) this.hideMenu();
      };
      this._handlers.docKey = e => { if (e.key === 'Escape' && this.menuOpen && !this.modal) { e.preventDefault(); this.hideMenu(); } };
      document.addEventListener('click', this._handlers.docClick);
      document.addEventListener('keydown', this._handlers.docKey);
    }

    refresh() {
      if (this.button) { this.button.remove(); this.button = null; }
      if (this.menu) { this.menu.remove(); this.menu = null; }
      this.updateTheme();
      if (S.get('showButton')) { this._createButton(); this._createMenu(); }
      if (this.menu) this._updateMenuContent();
    }

    async handleCopy(mode) {
      if (this.isProcessing) return;
      this.isProcessing = true; this.setButtonState('processing');
      try {
        const result = await copyMarkdown(mode);
        this.setButtonState('success');
        const labels = { selection: t('modeSelection'), article: t('modeArticleLabel'), page: t('modePageLabel') };
        this.showToast('success', t('toastSuccess'), t('toastSuccessDetail', { mode: labels[result.actualMode] || result.actualMode, count: result.length }));
      } catch (e) {
        console.error('[mdltx] error:', e);
        this.setButtonState('error');
        this.showToast('error', t('toastError'), t('toastErrorDetail', { error: e?.message || String(e) }));
      } finally { this.isProcessing = false; }
    }

    async handleDownload() {
      if (this.isProcessing) return;
      this.isProcessing = true; this.setButtonState('processing');
      try {
        const mode = hasSelection() ? 'selection' : decideModeNoSelection();
        const result = await generateMarkdown(mode), filename = generateFilename();
        downloadAsFile(result.markdown, filename);
        this.setButtonState('downloaded');
        this.showToast('success', t('toastDownloadSuccess'), t('toastDownloadDetail', { filename, count: result.length }));
      } catch (e) {
        console.error('[mdltx] download error:', e);
        this.setButtonState('error');
        this.showToast('error', t('toastError'), t('toastErrorDetail', { error: e?.message || String(e) }));
      } finally { this.isProcessing = false; }
    }

    destroy() {
      if (this._handlers.docClick) { document.removeEventListener('click', this._handlers.docClick); this._handlers.docClick = null; }
      if (this._handlers.docKey) { document.removeEventListener('keydown', this._handlers.docKey); this._handlers.docKey = null; }
      if (this._handlers.selChange) { document.removeEventListener('selectionchange', this._handlers.selChange); this._handlers.selChange = null; }
      if (this._handlers.themeChange) { try { window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this._handlers.themeChange); } catch {} this._handlers.themeChange = null; }
      if (this._focusTrap) { this._focusTrap.deactivate(); this._focusTrap = null; }
      this._tm.clearAll();
      if (this._prevBodyOverflow !== undefined) document.body.style.overflow = this._prevBodyOverflow;
      if (this.host) { this.host.remove(); this.host = null; }
      this.shadow = this.root = this.button = this.menu = this.toast = this.modal = null;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // § 常數集合
  // ─────────────────────────────────────────────────────────────

  const BLOCK_TAGS = new Set('P,DIV,UL,OL,LI,TABLE,BLOCKQUOTE,PRE,HR,H1,H2,H3,H4,H5,H6,SECTION,ARTICLE,HEADER,FOOTER,NAV,ASIDE,FIGURE,FIGCAPTION,DETAILS,SUMMARY,DL,DT,DD,MAIN,ADDRESS,HGROUP,FORM,FIELDSET,DIALOG'.split(','));
  const INLINE_PARENT_TAGS = new Set('A,SPAN,SMALL,LABEL,EM,I,STRONG,B,DEL,S,U,MARK,SUB,SUP,KBD,CITE,Q,ABBR'.split(','));
  const INLINEISH_TAGS = new Set([...INLINE_PARENT_TAGS, 'CODE', 'IMG', 'TIME', 'INPUT']);
  const MATH_INFRA_TAGS = new Set('MATH,SEMANTICS,ANNOTATION,MROW,MI,MN,MO,MTEXT,MSUP,MSUB,MSUBSUP,MFRAC,MSQRT,MROOT,MTABLE,MTR,MTD,MSTYLE,MPADDED,MUNDER,MOVER,MUNDEROVER,MERROR,MFENCED,MENCLOSE,MSPACE,MPHANTOM,MMULTISCRIPTS,MPRESCRIPTS,NONE,MLABELEDTR'.split(','));
  const KNOWN_HTML_TAGS = new Set('A,ABBR,ADDRESS,AREA,ARTICLE,ASIDE,AUDIO,B,BASE,BDI,BDO,BLOCKQUOTE,BODY,BR,BUTTON,CANVAS,CAPTION,CITE,CODE,COL,COLGROUP,DATA,DATALIST,DD,DEL,DETAILS,DFN,DIALOG,DIV,DL,DT,EM,EMBED,FIELDSET,FIGCAPTION,FIGURE,FOOTER,FORM,H1,H2,H3,H4,H5,H6,HEAD,HEADER,HGROUP,HR,HTML,I,IFRAME,IMG,INPUT,INS,KBD,LABEL,LEGEND,LI,LINK,MAIN,MAP,MARK,MENU,META,METER,NAV,NOSCRIPT,OBJECT,OL,OPTGROUP,OPTION,OUTPUT,P,PARAM,PICTURE,PRE,PROGRESS,Q,RP,RT,RUBY,S,SAMP,SCRIPT,SECTION,SELECT,SLOT,SMALL,SOURCE,SPAN,STRONG,STYLE,SUB,SUMMARY,SUP,TABLE,TBODY,TD,TEMPLATE,TEXTAREA,TFOOT,TH,THEAD,TIME,TITLE,TR,TRACK,U,UL,VAR,VIDEO,WBR,MATH,SEMANTICS,ANNOTATION,MROW,MI,MN,MO,MTEXT,MSUP,MSUB,MSUBSUP,MFRAC,MSQRT,MROOT,MTABLE,MTR,MTD,MSTYLE,MPADDED,MUNDER,MOVER,MUNDEROVER,MERROR,MFENCED,MENCLOSE,SVG,G,PATH,RECT,CIRCLE,ELLIPSE,LINE,POLYLINE,POLYGON,TEXT,TSPAN,DEFS,USE,SYMBOL,CLIPPATH,LINEARGRADIENT,RADIALGRADIENT,STOP,FILTER,MASK,PATTERN,MARKER,IMAGE,SWITCH,FOREIGNOBJECT,DESC,METADATA,VIEW'.split(','));
  const KNOWN_LANGUAGES = new Set('python,javascript,typescript,java,c,cpp,csharp,go,rust,ruby,php,sql,bash,shell,html,css,json,xml,yaml,markdown,r,swift,kotlin,scala,perl,lua,matlab,powershell,text,plain,dockerfile,makefile,cmake,nginx,graphql,toml,ini,diff,latex,jsx,tsx,vue,svelte,sass,scss,less,stylus,objectivec,dart,elixir,erlang,haskell,clojure,fsharp,ocaml,scheme,lisp,prolog,fortran,cobol,pascal,ada,assembly,nasm,wasm,zig,nim,crystal,julia,groovy'.split(','));
  const LANGUAGE_ALIASES = { js: 'javascript', ts: 'typescript', py: 'python', rb: 'ruby', cs: 'csharp', 'c++': 'cpp', 'c#': 'csharp', sh: 'bash', zsh: 'bash', yml: 'yaml', md: 'markdown', ps1: 'powershell', psm1: 'powershell', tex: 'latex', objc: 'objectivec', 'objective-c': 'objectivec', 'f#': 'fsharp', coffee: 'coffeescript', kt: 'kotlin', rs: 'rust', hs: 'haskell', ex: 'elixir', exs: 'elixir', erl: 'erlang', ml: 'ocaml', scm: 'scheme', cl: 'lisp', jl: 'julia', asm: 'assembly', s: 'assembly' };

  const MATHML_OP_MAP = {
    '±': '\\pm', '∓': '\\mp', '×': '\\times', '÷': '\\div', '·': '\\cdot',
    '≤': '\\le', '≥': '\\ge', '≠': '\\ne', '≈': '\\approx', '≡': '\\equiv', '≪': '\\ll', '≫': '\\gg',
    'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta', 'ε': '\\epsilon', 'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta', 'ι': '\\iota', 'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu', 'ν': '\\nu', 'ξ': '\\xi', 'π': '\\pi', 'ρ': '\\rho', 'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\phi', 'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega', 'ϵ': '\\varepsilon', 'ϑ': '\\vartheta', 'ϕ': '\\varphi', 'ϱ': '\\varrho', 'ς': '\\varsigma', 'ϖ': '\\varpi', 'ϰ': '\\varkappa', 'ϝ': '\\digamma',
    'Γ': '\\Gamma', 'Δ': '\\Delta', 'Θ': '\\Theta', 'Λ': '\\Lambda', 'Ξ': '\\Xi', 'Π': '\\Pi', 'Σ': '\\Sigma', 'Υ': '\\Upsilon', 'Φ': '\\Phi', 'Ψ': '\\Psi', 'Ω': '\\Omega',
    '∈': '\\in', '∉': '\\notin', '∋': '\\ni', '⊂': '\\subset', '⊃': '\\supset', '⊆': '\\subseteq', '⊇': '\\supseteq', '⊊': '\\subsetneq', '⊋': '\\supsetneq', '∪': '\\cup', '∩': '\\cap', '⊔': '\\sqcup', '⊓': '\\sqcap', '∧': '\\land', '∨': '\\lor', '¬': '\\neg', '⊕': '\\oplus', '⊗': '\\otimes', '⊖': '\\ominus', '⊘': '\\oslash', '⊙': '\\odot', '∅': '\\emptyset', '∀': '\\forall', '∃': '\\exists', '∄': '\\nexists', '⊢': '\\vdash', '⊣': '\\dashv', '⊨': '\\models',
    '→': '\\to', '←': '\\leftarrow', '↔': '\\leftrightarrow', '⇒': '\\Rightarrow', '⇐': '\\Leftarrow', '⇔': '\\Leftrightarrow', '↑': '\\uparrow', '↓': '\\downarrow', '↕': '\\updownarrow', '⇑': '\\Uparrow', '⇓': '\\Downarrow', '⇕': '\\Updownarrow', '↦': '\\mapsto', '↪': '\\hookrightarrow', '↩': '\\hookleftarrow', '↗': '\\nearrow', '↘': '\\searrow', '↙': '\\swarrow', '↖': '\\nwarrow', '⟶': '\\longrightarrow', '⟵': '\\longleftarrow', '⟷': '\\longleftrightarrow', '⟹': '\\Longrightarrow', '⟸': '\\Longleftarrow', '⟺': '\\Longleftrightarrow',
    '∞': '\\infty', '∂': '\\partial', '∇': '\\nabla', '∑': '\\sum', '∏': '\\prod', '∐': '\\coprod', '∫': '\\int', '∮': '\\oint', '∬': '\\iint', '∭': '\\iiint', '√': '\\sqrt', '∝': '\\propto', '∼': '\\sim', '≃': '\\simeq', '≅': '\\cong', '⊥': '\\perp', '∥': '\\parallel', '∠': '\\angle', '°': '^\\circ', '′': "'", '″': "''", '…': '\\ldots', '⋯': '\\cdots', '⋮': '\\vdots', '⋱': '\\ddots', '⊤': '\\top', '★': '\\star', '⋆': '\\star', '†': '\\dagger', '‡': '\\ddagger', 'ℓ': '\\ell', 'ℏ': '\\hbar', 'ℑ': '\\Im', 'ℜ': '\\Re', 'ℵ': '\\aleph', '⌈': '\\lceil', '⌉': '\\rceil', '⌊': '\\lfloor', '⌋': '\\rfloor', '⟨': '\\langle', '⟩': '\\rangle', '∘': '\\circ', '∙': '\\bullet', '⋄': '\\diamond', '△': '\\triangle', '▽': '\\triangledown', '⊲': '\\triangleleft', '⊳': '\\triangleright', '⋈': '\\bowtie'
  };

  // ─────────────────────────────────────────────────────────────
  // § 可見性判斷
  // ─────────────────────────────────────────────────────────────

  function isOurUI(el) { try { return el?.getAttribute?.('data-mdltx-ui') === '1' || el?.id === 'mdltx-ui-host' || !!el?.closest?.('[data-mdltx-ui="1"]'); } catch { return false; } }
  function isMathInfra(el) { return el?.nodeType === 1 && !!(el.closest?.('.katex,.katex-display,.katex-mathml,mjx-container,.MathJax,span.MathJax') || MATH_INFRA_TAGS.has(el.tagName)); }
  function isNavLike(el) { return el?.nodeType === 1 && (/^(NAV|HEADER|FOOTER|ASIDE)$/.test(el.tagName) || /^(navigation|banner|contentinfo|complementary)$/.test((el.getAttribute?.('role') || '').toLowerCase())); }
  function isHiddenInClone(node) { try { return node?.getAttribute?.('data-mdltx-hidden') === '1' || !!node?.closest?.('[data-mdltx-hidden="1"]'); } catch { return false; } }

  function isElementHiddenByAttribute(el) {
    if (!el || el.nodeType !== 1) return false;
    const hiddenAttr = el.getAttribute?.('hidden');
    if (hiddenAttr === 'until-found') { const mode = S.get('visibilityMode'); return !(S.get('hiddenUntilFoundVisible') && (mode === 'dom' || mode === 'loose')); }
    return el.hidden === true || hiddenAttr !== null;
  }

  function isInClosedDetails(el) {
    if (!el || el.nodeType !== 1 || S.get('detailsStrategy') !== 'strict-visual') return false;
    let cur = el.parentElement;
    while (cur) {
      if (cur.tagName === 'DETAILS') {
        if (cur.hasAttribute('open')) { cur = cur.parentElement; continue; }
        return !(el.tagName === 'SUMMARY' && el.parentElement === cur);
      }
      cur = cur.parentElement;
    }
    return false;
  }

  function isOffscreen(el) {
    if (!el || el.nodeType !== 1 || !S.get('strictOffscreen')) return false;
    try {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return false;
      const margin = S.get('offscreenMargin');
      return rect.bottom <= -margin || rect.right <= -margin || rect.top >= window.innerHeight + margin || rect.left >= window.innerWidth + margin;
    } catch { return false; }
  }

  function isVisuallyHidden(el) {
    if (!el || el.nodeType !== 1) return false;
    const mode = S.get('visibilityMode');
    if (mode === 'dom') return false;
    try {
      const cs = window.getComputedStyle?.(el);
      if (!cs) return false;
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse') return true;
      if (mode === 'strict') {
        if (cs.opacity === '0' || cs.contentVisibility === 'hidden') return true;
        if (el.tagName === 'DIALOG' && !el.hasAttribute('open')) return true;
        if (el.hasAttribute('popover') && !el.matches?.(':popover-open')) return true;
        if (el.hasAttribute('inert')) return true;
        if (cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(100%)') return true;
        if (parseFloat(cs.width) < 1 && parseFloat(cs.height) < 1 && cs.overflow === 'hidden') return true;
        return isOffscreen(el);
      }
    } catch {}
    return false;
  }

  function shouldHideElement(el) {
    if (!el || el.nodeType !== 1 || isOurUI(el) || isMathInfra(el)) return false;
    if (isElementHiddenByAttribute(el)) return true;
    const mode = S.get('visibilityMode');
    if (mode === 'dom') return false;
    if ((el.getAttribute?.('aria-hidden') || '').toLowerCase() === 'true') return true;
    if (mode === 'strict' && isInClosedDetails(el)) return true;
    return isVisuallyHidden(el);
  }

  function annotateHidden(scope) {
    const tagged = [], max = S.get('hiddenScanMaxElements');
    try {
      const walker = document.createTreeWalker(scope || document.body, NodeFilter.SHOW_ELEMENT);
      let n = 0;
      while (walker.nextNode() && ++n <= max) {
        const el = walker.currentNode;
        if (isOurUI(el) || isMathInfra(el) || el.tagName === 'DETAILS' || el.tagName === 'SUMMARY') continue;
        if (shouldHideElement(el)) { el.setAttribute('data-mdltx-hidden', '1'); tagged.push(el); }
      }
    } catch {}
    return tagged;
  }

  function annotateFormatBoundaries(scope) {
    const tagged = [];
    try {
      (scope || document.body).querySelectorAll('strong *, b *, em *, i *, del *, s *').forEach(el => {
        if (el.nodeType !== 1) return;
        try {
          const style = window.getComputedStyle(el);
          if (/^(block|flex|grid|table)$/.test(style.display)) { el.setAttribute('data-mdltx-block', '1'); tagged.push(el); }
        } catch {}
      });
    } catch {}
    return tagged;
  }

  function cleanupAnnotations(nodes, attr) { for (const n of nodes || []) try { n.removeAttribute(attr); } catch {} }

  // ─────────────────────────────────────────────────────────────
  // § iframe / Shadow DOM
  // ─────────────────────────────────────────────────────────────

  function annotateIframes(scope) {
    if (!S.get('extractIframes')) return [];
    const tagged = [];
    try {
      (scope || document.body).querySelectorAll('iframe').forEach(iframe => {
        try {
          const doc = iframe.contentDocument;
          if (!doc?.body) return;
          const content = md(doc.body, normalizeCtx({ baseUri: doc.baseURI || iframe.src || document.baseURI, escapeText: S.get('escapeMarkdownChars') }));
          if (content.trim()) { iframe.setAttribute('data-mdltx-iframe-md', content.trim()); tagged.push(iframe); }
        } catch {}
      });
    } catch {}
    return tagged;
  }

  function extractShadowContent(el, ctx) {
    if (!S.get('extractShadowDOM') || !el.shadowRoot) return '';
    try { let r = ''; for (const child of Array.from(el.shadowRoot.childNodes)) r += md(child, ctx); return r; } catch { return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § MathJax / LaTeX
  // ─────────────────────────────────────────────────────────────

  function getPageMathJax() { try { return (typeof unsafeWindow !== 'undefined' && unsafeWindow.MathJax) || window.MathJax || null; } catch { return window.MathJax || null; } }
  function getMathItemsWithin(scope) { const doc = getPageMathJax()?.startup?.document; if (!doc) return []; return typeof doc.getMathItemsWithin === 'function' ? (doc.getMathItemsWithin(scope || document.body) || []) : (Array.isArray(doc.math) ? doc.math : []); }

  async function waitForMathJax(scope) {
    if (!S.get('waitMathJax')) return;
    const MJ = getPageMathJax(); if (!MJ) return;
    for (let i = 0; i < 10; i++) {
      try { if (MJ.startup?.promise) await MJ.startup.promise; } catch {}
      try { if (typeof MJ.typesetPromise === 'function') { try { await MJ.typesetPromise(scope ? [scope] : undefined); } catch { await MJ.typesetPromise(); } } } catch {}
      if ((getMathItemsWithin(scope) || []).length > 0) return;
      if (document.querySelector('mjx-container,.MathJax') && i >= 1) return;
      await new Promise(r => setTimeout(r, 200));
    }
  }

  function annotateMathJax(scope) {
    const added = [];
    try {
      for (const it of getMathItemsWithin(scope)) {
        const root = it?.typesetRoot; if (!root?.setAttribute) continue;
        if (scope && scope !== document.body && !scope.contains?.(root)) continue;
        const tex = it.math; if (typeof tex !== 'string' || !tex.trim() || root.hasAttribute('data-mdltx-tex')) continue;
        root.setAttribute('data-mdltx-tex', tex);
        root.setAttribute('data-mdltx-display', it.display ? 'block' : 'inline');
        added.push(root);
      }
    } catch {}
    return added;
  }

  function extractTex(el) {
    if (!el) return '';
    const dt = el.getAttribute?.('data-mdltx-tex'); if (dt) return dt.trim();
    try { const ann = el.querySelector?.('annotation[encoding*="tex"],annotation[encoding*="TeX"],annotation[encoding*="latex"],annotation[encoding*="LaTeX"],annotation'); if (ann?.textContent) return ann.textContent.trim(); } catch {}
    const ds = el.dataset || {}; if (ds.latex) return ds.latex.trim(); if (ds.tex) return ds.tex.trim();
    if (el.tagName === 'SCRIPT' && /^math\/tex/i.test(el.type || '')) return (el.textContent || '').trim();
    try { const sc = el.querySelector?.('script[type^="math/tex"]'); if (sc?.textContent) return sc.textContent.trim(); } catch {}
    return (el.textContent || '').trim();
  }

  function isDisplayMath(el, tex) {
    tex = String(tex || '');
    const disp = el.getAttribute?.('data-mdltx-display'); if (disp) return disp === 'block';
    if (el.classList?.contains('katex-display') || el.closest?.('.katex-display,.MathJax_Display,.math-display,[data-math-display="block"]')) return true;
    if (el.tagName === 'MJX-CONTAINER') { const da = el.getAttribute?.('display'); if (da === 'true' || da === 'block') return true; }
    if (/\\begin\{(align|aligned|equation|gather|multline|cases|array|matrix|bmatrix|pmatrix|vmatrix|Bmatrix|Vmatrix|split|eqnarray)\*?\}/.test(tex)) return true;
    return tex.includes('\n') && tex.length > 20;
  }

  function processMathML(mathEl) {
    const ann = mathEl.querySelector('annotation[encoding*="tex"],annotation[encoding*="TeX"],annotation[encoding*="latex"],annotation[encoding*="LaTeX"]');
    if (ann?.textContent?.trim()) { const tex = ann.textContent.trim(), isBlock = mathEl.getAttribute('display') === 'block' || mathEl.closest?.('[display="block"]'); return isBlock ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`; }
    const getChildren = node => Array.from(node.childNodes).filter(c => c.nodeType === 1);
    const collect = node => {
      if (!node) return '';
      if (node.nodeType === 3) return (node.nodeValue || '').trim();
      if (node.nodeType !== 1) return '';
      const tag = node.tagName?.toLowerCase() || '', ch = getChildren(node), txt = () => (node.textContent || '').trim();
      switch (tag) {
        case 'msup': return ch.length >= 2 ? `{${collect(ch[0])}}^{${collect(ch[1])}}` : txt();
        case 'msub': return ch.length >= 2 ? `{${collect(ch[0])}}_{${collect(ch[1])}}` : txt();
        case 'msubsup': return ch.length >= 3 ? `{${collect(ch[0])}}_{${collect(ch[1])}}^{${collect(ch[2])}}` : txt();
        case 'mfrac': return ch.length >= 2 ? `\\frac{${collect(ch[0])}}{${collect(ch[1])}}` : txt();
        case 'msqrt': return `\\sqrt{${ch.map(collect).join('')}}`;
        case 'mroot': return ch.length >= 2 ? `\\sqrt[${collect(ch[1])}]{${collect(ch[0])}}` : txt();
        case 'mover': { if (ch.length < 2) return txt(); const base = collect(ch[0]), over = collect(ch[1]); if (over === '→' || over === '\\to') return `\\vec{${base}}`; if (over === '¯' || over === '−' || over === '-') return `\\bar{${base}}`; if (over === '^' || over === '̂') return `\\hat{${base}}`; if (over === '~' || over === '̃') return `\\tilde{${base}}`; if (over === '˙' || over === '.') return `\\dot{${base}}`; if (over === '¨' || over === '..') return `\\ddot{${base}}`; return `\\overset{${over}}{${base}}`; }
        case 'munder': { if (ch.length < 2) return txt(); const base = collect(ch[0]), under = collect(ch[1]); if (under === '_' || under === '̲') return `\\underline{${base}}`; return `\\underset{${under}}{${base}}`; }
        case 'munderover': { if (ch.length < 3) return txt(); const base = collect(ch[0]), under = collect(ch[1]), over = collect(ch[2]); if (['∑', '∏', '∫', '⋃', '⋂', 'lim'].includes(txt().trim())) return `${collect(ch[0])}_{${under}}^{${over}}`; return `\\underset{${under}}{\\overset{${over}}{${base}}}`; }
        case 'mo': { const t = txt(); return MATHML_OP_MAP[t] ?? t; }
        case 'mi': { const t = txt(); if (t.length === 1 && /[a-zA-Z]/.test(t)) return t; if (/^(sin|cos|tan|cot|sec|csc|log|ln|exp|lim|max|min|sup|inf|det|dim|ker|im|arg|deg|gcd|lcm|mod|Pr)$/.test(t)) return `\\${t}`; return MATHML_OP_MAP[t] ?? t; }
        case 'mn': case 'mtext': return txt();
        case 'mspace': return '\\,';
        case 'mphantom': return `\\phantom{${ch.map(collect).join('')}}`;
        case 'mrow': case 'math': case 'semantics': case 'mstyle': case 'mpadded': return ch.map(collect).join('');
        case 'mtable': return `\\begin{matrix} ${Array.from(node.querySelectorAll(':scope > mtr')).map(mtr => Array.from(mtr.querySelectorAll(':scope > mtd')).map(collect).join(' & ')).join(' \\\\ ')} \\end{matrix}`;
        case 'mfenced': { const open = node.getAttribute('open') || '(', close = node.getAttribute('close') || ')', sep = node.getAttribute('separators') || ',', inner = ch.map(collect).join(` ${sep.trim()} `); const leftMap = { '(': '(', '[': '[', '{': '\\{', '|': '|', '‖': '\\|', '⟨': '\\langle' }, rightMap = { ')': ')', ']': ']', '}': '\\}', '|': '|', '‖': '\\|', '⟩': '\\rangle' }; return `\\left${leftMap[open] || open}${inner}\\right${rightMap[close] || close}`; }
        case 'menclose': { const notation = node.getAttribute('notation') || 'box', inner = ch.map(collect).join(''); if (notation.includes('box') || notation.includes('roundedbox')) return `\\boxed{${inner}}`; if (notation.includes('circle')) return `\\circled{${inner}}`; if (notation.includes('left')) return `\\left|${inner}\\right.`; if (notation.includes('right')) return `\\left.${inner}\\right|`; if (notation.includes('top')) return `\\overline{${inner}}`; if (notation.includes('bottom')) return `\\underline{${inner}}`; if (notation.includes('updiagonalstrike') || notation.includes('downdiagonalstrike')) return `\\cancel{${inner}}`; if (notation.includes('horizontalstrike')) return `\\hcancel{${inner}}`; if (notation.includes('radical')) return `\\sqrt{${inner}}`; return inner; }
        case 'annotation': case 'annotation-xml': return '';
        default: return ch.length ? ch.map(collect).join('') : txt();
      }
    };
    const content = collect(mathEl).trim(); if (!content) return '';
    return mathEl.getAttribute('display') === 'block' ? `\n\n$$\n${content}\n$$\n\n` : `$${content}$`;
  }

  function stripCommonIndent(tex) {
    let lines = String(tex || '').replace(/\r\n/g, '\n').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    let min = null;
    for (const l of lines) if (l.trim()) { const n = l.match(/^[ \t]*/)[0].length; min = min === null ? n : Math.min(min, n); }
    return min > 0 ? lines.map(l => l.slice(min)).join('\n') : lines.join('\n');
  }

  // ─────────────────────────────────────────────────────────────
  // § 等待與文字處理
  // ─────────────────────────────────────────────────────────────

  function waitForDomIdle(timeout) {
    return new Promise(resolve => {
      let timer = null;
      const observer = new MutationObserver(() => { if (timer) clearTimeout(timer); timer = setTimeout(() => { observer.disconnect(); resolve(); }, timeout); });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      timer = setTimeout(() => { observer.disconnect(); resolve(); }, timeout);
    });
  }

  function escapeMarkdownText(s, ctx) {
    s = String(s ?? '');
    if (ctx?.inTable) s = s.replace(/\|/g, '&#124;');
    if (ctx?.escapeText) s = s.replace(/([\\*_`\[\]~])/g, '\\$1').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return s;
  }

  function escapeBracketText(s) { return String(s ?? '').replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]'); }
  function escapeLinkLabel(s, ctx) { s = String(s ?? '').replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]'); if (ctx?.escapeText) s = s.replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~'); return s; }

  function escapeLinkDest(url, inTable = false) {
    url = String(url || '').trim(); if (!url) return '';
    if (inTable) url = url.replace(/\|/g, '%7C');
    if (/[()\s"<>]/.test(url)) return `<${encodeURI(url).replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\|/g, '%7C')}>`;
    return url.replace(/\\/g, '\\\\').replace(/\)/g, '\\)');
  }

  function mdLink(text, href, inTable = false) { const lt = escapeBracketText(text || ''), lh = escapeLinkDest(href || '', inTable); return lh ? `[${lt}](${lh})` : lt; }

  function wrapInlineCode(text) {
    text = String(text ?? ''); if (!text) return '``';
    let maxLen = 0; for (const t of (text.match(/`+/g) || [])) maxLen = Math.max(maxLen, t.length);
    const wrapper = '`'.repeat(Math.max(1, maxLen + 1)), needsPad = text[0] === '`' || text.slice(-1) === '`' || text[0] === ' ' || text.slice(-1) === ' ';
    return needsPad ? `${wrapper} ${text} ${wrapper}` : `${wrapper}${text}${wrapper}`;
  }

  function chooseFence(content) { const maxBt = maxRunOfChar(content, '`'), maxTl = maxRunOfChar(content, '~'), ch = maxBt <= maxTl ? '`' : '~'; return ch.repeat(Math.max(3, (ch === '`' ? maxBt : maxTl) + 1)); }
  function maxRunOfChar(s, ch) { let max = 0, cur = 0; for (let i = 0; i < s.length; i++) { if (s[i] === ch) { if (++cur > max) max = cur; } else cur = 0; } return max; }

  function absUrl(url, baseUri) { if (!S.get('absoluteUrls')) return url || ''; try { return new URL(url, baseUri || document.baseURI || location.href).href; } catch { return url || ''; } }
  function hrefForA(aEl, baseUri) { const raw = (aEl.getAttribute?.('href') || '').trim(); if (!raw || raw.startsWith('#') || /^javascript:/i.test(raw)) return raw.startsWith('#') ? raw : ''; return S.get('absoluteUrls') ? absUrl(aEl.href || raw, baseUri) : raw; }

  function parseSrcset(srcset) {
    srcset = String(srcset || '').trim(); if (!srcset) return '';
    let bestUrl = '', bestScore = -1;
    for (const p of srcset.split(',').map(s => s.trim()).filter(Boolean)) {
      const m = p.match(/^(\S+)(?:\s+(\d+(?:\.\d+)?)(w|x))?$/i); if (!m) continue;
      const url = m[1], value = m[2] ? parseFloat(m[2]) : 1, unit = (m[3] || 'x').toLowerCase(), score = unit === 'w' ? value : value * 10000;
      if (score > bestScore) { bestScore = score; bestUrl = url; }
    }
    return bestUrl;
  }

  function pickImgSrc(node) {
    if (node.currentSrc) return node.currentSrc;
    for (const a of ['src', 'data-src', 'data-original', 'data-orig', 'data-lazy-src', 'data-url', 'data-image', 'data-src-url', 'data-zoom-src', 'data-hires']) { const v = node.getAttribute?.(a); if (v) return v; }
    return parseSrcset(node.getAttribute?.('srcset') || node.getAttribute?.('data-srcset') || '');
  }

  function normalizeLanguage(lang) { lang = String(lang).toLowerCase().trim(); return LANGUAGE_ALIASES[lang] || lang; }

  function detectLang(codeEl) {
    if (!codeEl) return '';
    for (const attr of ['data-language', 'data-lang', 'data-syntax', 'data-code-language']) { const val = codeEl.getAttribute?.(attr); if (val) return normalizeLanguage(val); }
    const classList = (codeEl.className || '').toLowerCase();
    const langMatch = classList.match(/(?:language|lang)-([a-z0-9_+-]+)/i); if (langMatch) return normalizeLanguage(langMatch[1]);
    for (const lang of KNOWN_LANGUAGES) { if (new RegExp(`(?:^|\\s|-)${lang}(?:$|\\s|-)`, 'i').test(classList)) return lang; }
    const parent = codeEl.closest('pre'); if (parent && parent !== codeEl) { const parentLang = detectLang(parent); if (parentLang) return parentLang; }
    const hljs = codeEl.closest('[class*="hljs"]'); if (hljs) { const hljsMatch = hljs.className.match(/hljs[_-]?([a-z0-9_+-]+)/i); if (hljsMatch && hljsMatch[1] !== 'line') return normalizeLanguage(hljsMatch[1]); }
    const prismCopy = codeEl.getAttribute?.('data-prismjs-copy'); if (prismCopy) { const prismMatch = codeEl.className.match(/language-([a-z0-9_+-]+)/i); if (prismMatch) return normalizeLanguage(prismMatch[1]); }
    const cm = codeEl.closest('.CodeMirror'); if (cm) { const cmMode = cm.querySelector('[data-mode]')?.getAttribute('data-mode'); if (cmMode) return normalizeLanguage(cmMode); }
    return '';
  }

  // ─────────────────────────────────────────────────────────────
  // § 輔助函數
  // ─────────────────────────────────────────────────────────────

  function isInlineishNode(n) { return n && ((n.nodeType === 3 && (n.nodeValue || '').trim()) || (n.nodeType === 1 && (INLINEISH_TAGS.has(n.tagName) || n.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,math')))); }
  function wsTextNodeToSpace(textNode) { const p = textNode.previousSibling, n = textNode.nextSibling; return (p && n && isInlineishNode(p) && isInlineishNode(n)) ? ' ' : ''; }
  function isBlockBoundary(node) { return node?.nodeType === 1 && (BLOCK_TAGS.has(node.tagName) || node.tagName === 'BR' || node.hasAttribute?.('data-mdltx-block')); }
  function containsBlockishContent(el) { return el?.nodeType === 1 && (el.querySelector('br') || [...BLOCK_TAGS].some(tag => el.querySelector(tag.toLowerCase())) || el.querySelector('[data-mdltx-block="1"]')); }
  function hasUnsafeMarkdownBlocks(el) { return el?.nodeType === 1 && !!el.querySelector('ul,ol,li,table,pre,blockquote'); }

  function processUnknownEmptyTag(el, ctx) {
    const strategy = S.get('unknownEmptyTagStrategy'); if (strategy === 'drop') return '';
    if (el.closest?.('svg') || el.closest?.('math')) return null;
    if (el.tagName?.includes('-')) return null;
    if (!KNOWN_HTML_TAGS.has(el.tagName) && el.childNodes.length === 0) { const tagName = el.tagName.toLowerCase(); return ctx?.escapeText ? `&lt;${tagName}&gt;` : `<${tagName}>`; }
    return null;
  }

  function processRuby(rubyEl) {
    let result = '';
    for (const child of rubyEl.childNodes) {
      if (child.nodeType === 3) result += child.nodeValue || '';
      else if (child.nodeType === 1 && !/^(RT|RP)$/.test(child.tagName)) result += child.tagName === 'RUBY' ? processRuby(child) : (child.textContent || '');
    }
    return result;
  }

  function processSvg(svgEl) {
    const texts = [];
    const title = svgEl.querySelector('title'); if (title?.textContent?.trim()) texts.push(title.textContent.trim());
    const desc = svgEl.querySelector('desc'); if (desc?.textContent?.trim()) texts.push(desc.textContent.trim());
    svgEl.querySelectorAll('text').forEach(t => { if (t.textContent?.trim()) texts.push(t.textContent.trim()); });
    return texts.join(' ');
  }

  function smartConcat(out, part) {
    if (!out) return part; if (!part) return out;
    for (const [len, mk] of [[3, '***'], [2, '**'], [2, '~~'], [1, '*']]) if (out.slice(-len) === mk && part.slice(0, len) === mk) return out.slice(0, -len) + part.slice(len);
    if (S.get('mergeAdjacentCodeSpans')) {
      const outM = out.match(/(`+)([^`]+)\1$/), partM = part.match(/^(`+)([^`]+)\1/);
      if (outM && partM) return out.slice(0, -outM[0].length) + wrapInlineCode(outM[2] + partM[2]) + part.slice(partM[0].length);
    }
    return out + part;
  }

  function trimNewlinesOnly(s) { return String(s || '').replace(/^\n+/, '').replace(/\n+$/, ''); }
  function normalizeCtx(ctx) { return { depth: ctx?.depth ?? 0, escapeText: ctx?.escapeText ?? S.get('escapeMarkdownChars'), inTable: ctx?.inTable ?? false, baseUri: ctx?.baseUri ?? document.baseURI }; }

  // ─────────────────────────────────────────────────────────────
  // § 格式處理
  // ─────────────────────────────────────────────────────────────

  function wrapWithFormat(content, formatTag) {
    content = String(content || '').trim(); if (!content) return '';
    switch (formatTag) { case 'STRONG': case 'B': return `**${content}**`; case 'EM': case 'I': return `*${content}*`; case 'DEL': case 'S': return `~~${content}~~`; default: return content; }
  }

  function splitInlineFormatAcrossBlocks(node, formatTag, ctx) {
    const result = []; let currentInlineContent = '';
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 1 && isBlockBoundary(child)) {
        if (currentInlineContent.trim()) result.push(wrapWithFormat(currentInlineContent.trim(), formatTag));
        currentInlineContent = '';
        result.push(child.tagName === 'BR' ? '<br>' : md(child, ctx));
      } else currentInlineContent += mdInline(child, ctx);
    }
    if (currentInlineContent.trim()) result.push(wrapWithFormat(currentInlineContent.trim(), formatTag));
    return result.join('');
  }

  function processInlineFormat(node, formatTag, ctx) {
    const hasBlock = containsBlockishContent(node);
    if (!hasBlock) { const inner = processChildrenInline(node, ctx).trim(); return inner ? wrapWithFormat(inner, formatTag) : ''; }
    if (hasUnsafeMarkdownBlocks(node)) return processChildren(node, ctx);
    const strategy = S.get('strongEmBlockStrategy');
    switch (strategy) {
      case 'split': return splitInlineFormatAcrossBlocks(node, formatTag, ctx);
      case 'strip': return processChildren(node, ctx);
      case 'html': default: { const tagName = formatTag.toLowerCase(), htmlTag = tagName === 'b' ? 'strong' : tagName === 'i' ? 'em' : tagName === 's' ? 'del' : tagName; return `<${htmlTag}>${trimNewlinesOnly(processChildren(node, ctx)).trim()}</${htmlTag}>`; }
    }
  }

  function processChildren(node, ctx, override = {}) { const uc = { ...ctx, ...override }; let r = ''; for (const c of Array.from(node.childNodes)) r = smartConcat(r, md(c, uc)); return r; }
  function processChildrenInline(node, ctx, override = {}) { const uc = { ...ctx, ...override }; let r = ''; for (const c of Array.from(node.childNodes)) r = smartConcat(r, mdInline(c, uc)); return r; }

  // ─────────────────────────────────────────────────────────────
  // § 表格處理
  // ─────────────────────────────────────────────────────────────

  function tableHasComplexStructure(tbl) {
    const mainCells = tbl.querySelectorAll(':scope > thead > tr > td, :scope > thead > tr > th, :scope > tbody > tr > td, :scope > tbody > tr > th, :scope > tr > td, :scope > tr > th');
    for (const cell of mainCells) {
      if (cell.closest('tfoot')) continue;
      const rs = parseInt(cell.getAttribute('rowspan') || '1', 10), cs = parseInt(cell.getAttribute('colspan') || '1', 10);
      if (rs > 1 || cs > 1 || cell.querySelector(':scope > table')) return true;
    }
    return false;
  }

  function tableToList(tbl, ctx) {
    ctx = normalizeCtx(ctx);
    const rows = tbl.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr'), items = [];
    rows.forEach(tr => {
      const cells = tr.querySelectorAll(':scope > th, :scope > td'), cellTexts = [];
      cells.forEach(cell => {
        const nestedTable = cell.querySelector(':scope > table');
        if (nestedTable) { const nestedContent = tableToList(nestedTable, ctx), flattened = nestedContent.replace(/^- /gm, '').split('\n').filter(Boolean).join('; '); if (flattened) cellTexts.push(`[${flattened}]`); nestedTable.setAttribute('data-mdltx-processed', '1'); }
        const text = cellToMd(cell, ctx).trim(); if (text) cellTexts.push(text);
      });
      if (cellTexts.length) items.push(`- ${cellTexts.join(' | ')}`);
    });
    return items.join('\n');
  }

  function cellToMd(cell, ctx) {
    ctx = normalizeCtx({ ...ctx, inTable: true });
    const placeholders = {}; let pid = 0; const nonce = generateNonce();
    const protect = c => { const k = makePlaceholder('CELL', nonce, pid++); placeholders[k] = c; return k; };
    const hasBlock = cell.querySelector('ul,ol,pre,blockquote,p,div');
    let result;
    if (hasBlock) {
      const parts = [];
      for (const ch of Array.from(cell.childNodes)) {
        if (ch.nodeType === 3) { const t = ch.nodeValue?.trim(); if (t) parts.push(escapeMarkdownText(t, ctx)); }
        else if (ch.nodeType === 1) {
          const T = ch.tagName;
          if (T === 'TABLE' && ch.hasAttribute('data-mdltx-processed')) continue;
          if (T === 'TABLE') continue;
          if (T === 'UL' || T === 'OL') parts.push(Array.from(ch.querySelectorAll('li')).map(li => mdInline(li, ctx).trim()).filter(Boolean).join('; '));
          else if (T === 'PRE') { const code = ch.querySelector('code') || ch; parts.push(protect(wrapInlineCode((code.textContent || '').replace(/\n/g, ' ').trim()))); }
          else if (T === 'CODE') parts.push(protect(wrapInlineCode(ch.textContent || '')));
          else parts.push(mdInline(ch, ctx).trim());
        }
      }
      result = parts.join(' ');
    } else result = mdInline(cell, ctx);
    result = result.replace(/(?:<br>\s*){3,}/g, '<br><br>').replace(/<br\s*\/?>/gi, ' ');
    for (const [k, v] of Object.entries(placeholders)) result = result.split(k).join(v);
    return result.trim();
  }

  function serializeTableAsHtml(tbl, ctx) {
    const clone = tbl.cloneNode(true);
    clone.querySelectorAll('td, th').forEach(cell => { const mdContent = cellToMd(cell, ctx); cell.textContent = ''; cell.innerHTML = mdContent; });
    const allowedAttrs = ['rowspan', 'colspan', 'scope'];
    clone.querySelectorAll('*').forEach(el => { Array.from(el.attributes).forEach(attr => { if (!allowedAttrs.includes(attr.name)) el.removeAttribute(attr.name); }); });
    return clone.outerHTML;
  }

  function tableToMd(tbl, ctx) {
    ctx = normalizeCtx(ctx);
    if (tableHasComplexStructure(tbl)) {
      const strategy = S.get('complexTableStrategy');
      if (strategy === 'html') return `\n\n${serializeTableAsHtml(tbl, ctx)}\n\n`;
      const caption = tbl.querySelector('caption'), captionText = caption ? mdInline(caption, ctx).trim() : '', listContent = tableToList(tbl, ctx);
      return captionText ? `*${captionText}*\n\n${listContent}` : listContent;
    }
    const rows = [], caption = tbl.querySelector('caption'), captionText = caption ? mdInline(caption, ctx).trim() : '';
    let hasHr = false;
    const mainRows = tbl.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tr:not(tfoot tr)'), tfootRows = tbl.querySelectorAll(':scope > tfoot > tr');
    mainRows.forEach((tr, i) => {
      if (tr.closest('tfoot')) return;
      const cells = [];
      tr.querySelectorAll(':scope > th, :scope > td').forEach(td => { const colspan = parseInt(td.getAttribute('colspan') || '1', 10); cells.push(cellToMd(td, ctx)); for (let c = 1; c < colspan; c++) cells.push(''); });
      if (!cells.length) return;
      rows.push(`| ${cells.join(' | ')} |`);
      if (!hasHr && (tr.querySelector('th') || i === 0)) { rows.push(`| ${cells.map(() => '---').join(' | ')} |`); hasHr = true; }
    });
    let result = rows.join('\n');
    if (tfootRows.length > 0) {
      const tfootTexts = [];
      tfootRows.forEach(tr => { const cells = []; tr.querySelectorAll(':scope > th, :scope > td').forEach(td => { const text = cellToMd(td, ctx).trim(); if (text) cells.push(text); }); if (cells.length) tfootTexts.push(cells.join(' | ')); });
      if (tfootTexts.length) result += `\n\n*${tfootTexts.join('; ')}*`;
    }
    return captionText ? `*${captionText}*\n\n${result}` : result;
  }

  function dlToMd(dl, ctx) {
    ctx = normalizeCtx(ctx);
    const items = []; let curTerm = null, defs = [];
    const flush = () => { if (!curTerm) return; const term = curTerm.trim(), defText = defs.map(d => d.trim()).filter(Boolean).join('<br>'); items.push(term && defText ? `- **${term}**：${defText}` : term ? `- **${term}**` : ''); curTerm = null; defs = []; };
    for (const ch of Array.from(dl.children)) { if (ch.tagName === 'DT') { flush(); curTerm = mdInline(ch, ctx); } else if (ch.tagName === 'DD') defs.push(mdInline(ch, ctx)); }
    flush();
    return items.length ? `\n\n${items.join('\n')}\n\n` : '';
  }

  function figureToMd(fig, ctx) {
    ctx = normalizeCtx(ctx);
    const imgs = Array.from(fig.querySelectorAll('img')).map(img => md(img, ctx).trim()).filter(Boolean);
    const capEl = fig.querySelector('figcaption'), cap = capEl ? mdInline(capEl, ctx).trim() : '';
    let out = imgs.length ? imgs.join('\n\n') : '';
    if (cap) out += (out ? '\n\n' : '') + `*${cap}*`;
    return out ? `\n\n${out}\n\n` : '';
  }

  // ─────────────────────────────────────────────────────────────
  // § Markdown 轉換
  // ─────────────────────────────────────────────────────────────

  function mdInline(node, ctx) {
    ctx = normalizeCtx(ctx);
    if (!node || isHiddenInClone(node)) return '';
    if (node.nodeType === 3) {
      const raw = node.nodeValue || '', ptag = node.parentElement?.tagName || '';
      if (ptag === 'PRE' || ptag === 'CODE') return raw;
      if (/^\s+$/.test(raw)) return wsTextNodeToSpace(node) || (INLINE_PARENT_TAGS.has(ptag) ? ' ' : '');
      return escapeMarkdownText(String(raw).replace(/\s+/g, ' '), ctx);
    }
    if (node.nodeType !== 1) return '';
    const T = node.tagName;
    if (/^(SCRIPT|STYLE|NOSCRIPT|MJX-ASSISTIVE-MML|TEMPLATE)$/.test(T) || isOurUI(node)) return '';
    if (S.get('ignoreNav') && isNavLike(node)) return '';
    const unknownResult = processUnknownEmptyTag(node, ctx); if (unknownResult !== null) return unknownResult;
    if (T === 'SLOT') { let r = ''; for (const n of (node.assignedNodes?.({ flatten: true }) || [])) r = smartConcat(r, mdInline(n, ctx)); return r; }
    if (T === 'SVG') return processSvg(node);
    if (T === 'RUBY') return processRuby(node);
    if (T === 'BR') return '<br>';
    if (T === 'INPUT') { const type = (node.getAttribute('type') || '').toLowerCase(); if (type === 'checkbox') return (node.checked || node.defaultChecked || node.getAttribute('checked') !== null) ? '[x] ' : '[ ] '; return ''; }
    if (/^(STRONG|B|EM|I|DEL|S)$/.test(T)) return processInlineFormat(node, T, ctx);
    if (T === 'Q') { const inner = processChildrenInline(node, ctx).trim(); return inner ? `「${inner}」` : ''; }
    if (T === 'CODE') { const txt = node.textContent || ''; return txt.trim() ? wrapInlineCode(txt) : ''; }
    if (T === 'A') { const textContent = processChildrenInline(node, { ...ctx, escapeText: false }).trim(), text = textContent || (node.getAttribute('href') || ''), href = hrefForA(node, ctx.baseUri); return href ? mdLink(text, href, ctx.inTable) : escapeLinkLabel(text, ctx); }
    if (T === 'IMG') { const alt = escapeBracketText((node.getAttribute('alt') || '').trim()), u = absUrl(pickImgSrc(node), ctx.baseUri); return u ? `![${alt}](${escapeLinkDest(u, ctx.inTable)})` : (alt || ''); }
    if (T === 'SUB') return `<sub>${processChildrenInline(node, ctx).trim()}</sub>`;
    if (T === 'SUP') return `<sup>${processChildrenInline(node, ctx).trim()}</sup>`;
    if (T === 'KBD') return `<kbd>${processChildrenInline(node, ctx).trim()}</kbd>`;
    if (T === 'U') return `<u>${processChildrenInline(node, ctx)}</u>`;
    if (T === 'MARK') return `<mark>${processChildrenInline(node, ctx)}</mark>`;
    if (T === 'MATH') return processMathML(node);
    if (node.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"]')) {
      if (node.closest?.('pre,code')) return node.textContent || '';
      let tex = extractTex(node); if (!tex) return '';
      const block = isDisplayMath(node, tex); if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex);
      return block ? `<br>$$ ${tex} $$<br>` : `$${tex}$`;
    }
    if (BLOCK_TAGS.has(T)) return processChildrenInline(node, ctx).trim();
    return processChildrenInline(node, ctx);
  }

  function md(node, ctx) {
    ctx = normalizeCtx(ctx);
    if (!node || isOurUI(node) || isHiddenInClone(node)) return '';
    if (node.nodeType === 3) {
      const raw = node.nodeValue || '', ptag = node.parentElement?.tagName || '';
      if (ptag === 'PRE' || ptag === 'CODE') return raw;
      if (/^\s+$/.test(raw)) return wsTextNodeToSpace(node) || (INLINE_PARENT_TAGS.has(ptag) ? ' ' : '');
      return escapeMarkdownText(String(raw).replace(/\s+/g, ' '), ctx);
    }
    if (node.nodeType !== 1) return '';
    const T = node.tagName;
    if (/^(SCRIPT|STYLE|NOSCRIPT|MJX-ASSISTIVE-MML|TEMPLATE)$/.test(T)) return '';
    if (S.get('ignoreNav') && isNavLike(node)) return '';
    const unknownResult = processUnknownEmptyTag(node, ctx); if (unknownResult !== null) return unknownResult;
    if (T === 'SLOT') { let r = ''; for (const n of (node.assignedNodes?.({ flatten: true }) || [])) r = smartConcat(r, md(n, ctx)); return r; }
    if (T === 'SVG') { const text = processSvg(node); return text ? `\n\n${text}\n\n` : ''; }
    if (T === 'CANVAS') { const fb = node.textContent?.trim(); return fb ? `\n\n${fb}\n\n` : ''; }
    if (T === 'MATH') return processMathML(node);
    if (T === 'IFRAME') { const pre = node.getAttribute('data-mdltx-iframe-md'); return pre ? `\n\n${pre}\n\n` : ''; }
    if (T.includes('-') && S.get('extractShadowDOM')) { const sc = extractShadowContent(node, ctx); if (sc) return sc; }
    if (T === 'FIGURE') return figureToMd(node, ctx);
    if (T === 'DL') return dlToMd(node, ctx);
    if (T === 'DIV' && node.hasAttribute('data-code-block')) { const header = node.querySelector(':scope > div:first-child'), lang = (header?.textContent || '').trim().toLowerCase(), codeEl = node.querySelector('pre code') || node.querySelector('pre'), content = (codeEl?.textContent || '').replace(/\n+$/g, ''), fence = chooseFence(content); return `\n\n${fence}${lang}\n${content}\n${fence}\n\n`; }
    if (T === 'DETAILS') {
      const isOpen = node.hasAttribute('open'), summary = node.querySelector(':scope > summary'), summaryText = summary ? mdInline(summary, ctx).trim() : 'Details';
      if (S.get('detailsStrategy') === 'strict-visual' && !isOpen) return `\n\n<details>\n<summary>${summaryText}</summary>\n\n</details>\n\n`;
      let inner = ''; for (const ch of Array.from(node.childNodes)) if (!(ch.nodeType === 1 && ch.tagName === 'SUMMARY')) inner += md(ch, ctx);
      return `\n\n<details${isOpen ? ' open' : ''}>\n<summary>${summaryText}</summary>\n\n${trimNewlinesOnly(inner)}\n\n</details>\n\n`;
    }
    if (T === 'TABLE') return `\n\n${tableToMd(node, ctx)}\n\n`;
    if (T === 'PRE') { const cd = node.querySelector('code'), lang = detectLang(cd || node), body = (cd || node).textContent?.replace(/\n+$/g, '') || '', fence = chooseFence(body); return `\n\n${fence}${lang}\n${body}\n${fence}\n\n`; }
    if (T === 'INPUT') { const type = (node.getAttribute('type') || '').toLowerCase(); if (type === 'checkbox') return (node.checked || node.defaultChecked || node.getAttribute('checked') !== null) ? '[x] ' : '[ ] '; return ''; }
    if (T === 'CODE' && node.parentElement?.tagName !== 'PRE') { const txt = node.textContent || ''; return txt.trim() ? wrapInlineCode(txt) : ''; }
    if (T === 'RUBY') return processRuby(node);
    if (/^H[1-6]$/.test(T)) { const lvl = parseInt(T.slice(1), 10), inner = processChildren(node, ctx).trim(); return inner ? `\n\n${'#'.repeat(lvl)} ${inner}\n\n` : ''; }
    if (T === 'BR') return '<br>\n';
    if (T === 'HR') return '\n\n---\n\n';
    if (T === 'A') { const textContent = processChildren(node, { ...ctx, escapeText: false }).trim(), text = textContent || (node.getAttribute('href') || ''), href = hrefForA(node, ctx.baseUri); return href ? mdLink(text, href, ctx.inTable) : escapeLinkLabel(text, ctx); }
    if (T === 'IMG') { const alt = escapeBracketText((node.getAttribute('alt') || '').trim()), u = absUrl(pickImgSrc(node), ctx.baseUri); return u ? `![${alt}](${escapeLinkDest(u, ctx.inTable)})` : (alt || ''); }
    if (/^(STRONG|B|EM|I|DEL|S)$/.test(T)) return processInlineFormat(node, T, ctx);
    if (T === 'Q') { const inner = processChildren(node, ctx).trim(); return inner ? `「${inner}」` : ''; }
    if (T === 'SUB') return `<sub>${processChildren(node, ctx).trim()}</sub>`;
    if (T === 'SUP') return `<sup>${processChildren(node, ctx).trim()}</sup>`;
    if (T === 'KBD') return `<kbd>${processChildren(node, ctx).trim()}</kbd>`;
    if (T === 'U') return `<u>${processChildren(node, ctx)}</u>`;
    if (T === 'MARK') return `<mark>${processChildren(node, ctx)}</mark>`;
    if (node.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"]')) {
      if (node.closest?.('pre,code')) return node.textContent || '';
      let tex = extractTex(node); if (!tex) return '';
      const block = isDisplayMath(node, tex); if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex);
      return block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
    }
    if (T === 'BLOCKQUOTE') { let inner = processChildren(node, ctx).replace(/\n{3,}/g, '\n\n').trim().replace(/^\s{4}([-*+] |\d+\. )/gm, '$1'); return `\n\n${inner.split('\n').map(l => l.trim() === '' ? '>' : `> ${l}`).join('\n')}\n\n`; }
    if (T === 'UL' || T === 'OL') { const ordered = T === 'OL'; let idx = 1, out = ''; for (const li of Array.from(node.children)) { if (li.tagName !== 'LI') continue; out += renderLi(li, ctx.depth || 0, ordered ? idx++ : 0, ctx); } return out.trim() ? `\n\n${out}\n\n` : ''; }
    if (T === 'P') { const inner = processChildren(node, ctx).trim(); return inner ? `\n\n${inner}\n\n` : ''; }
    if (/^(DIV|SECTION|ARTICLE|MAIN|NAV|HEADER|FOOTER|ASIDE)$/.test(T)) return `\n\n${processChildren(node, ctx)}\n\n`;
    return processChildren(node, ctx);
  }

  function renderLi(li, depth, olIndex, ctx) {
    ctx = normalizeCtx(ctx);
    const indent = ' '.repeat(depth * 4), prefix = olIndex ? `${olIndex}. ` : '- ';
    let contentParts = '', nestedParts = '';
    for (const ch of Array.from(li.childNodes)) {
      if (ch.nodeType === 1 && (ch.tagName === 'UL' || ch.tagName === 'OL')) nestedParts += md(ch, { ...ctx, depth: depth + 1 });
      else contentParts += md(ch, ctx);
    }
    const content = String(contentParts).replace(/\n{3,}/g, '\n\n').trim(), nested = nestedParts?.trim() ? trimNewlinesOnly(nestedParts) : '';
    if (!content && !nested) return '';
    const lines = content ? content.split('\n') : [''];
    let out = `${indent}${prefix}${lines[0] || ''}\n`;
    for (let i = 1; i < lines.length; i++) out += `${indent}    ${lines[i]}\n`;
    if (nested) out += `${nested}\n`;
    return out;
  }

  function replaceMathWithPlaceholders(container) {
    const map = {}; let id = 0; const nonce = generateNonce();
    container.querySelectorAll('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"]').forEach(el => {
      if (el.closest('pre,code') || el.closest?.('[data-mdltx-ui="1"]') || el.closest?.('[data-mdltx-hidden="1"]')) return;
      const tex0 = extractTex(el); if (!tex0) return;
      const block = isDisplayMath(el, tex0);
      let tex = block && S.get('stripCommonIndentInBlockMath') ? stripCommonIndent(tex0) : tex0;
      const key = makePlaceholder('MATH', nonce, id++);
      map[key] = block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
      const sp = document.createElement('span'); sp.textContent = key; el.replaceWith(sp);
    });
    return map;
  }

  function normalizeOutput(mdText) {
    let s = String(mdText || '');
    const blocks = {}, nonce = generateNonce(); let bid = 0;
    s = s.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[ \t]*(?=\n|$)/g, (m, p1) => { const key = makePlaceholder('CODEBLOCK', nonce, bid++); blocks[key] = m.slice(p1.length); return p1 + key; });
    s = s.replace(/\u00a0/g, ' ').replace(/[\u200B\u2060\uFEFF]/g, '').replace(/([^\n \t])[ \t]+\n/g, '$1\n').replace(/\n{3,}/g, '\n\n').trim();
    for (const [k, v] of Object.entries(blocks)) s = s.split(k).join(v);
    return s.trim();
  }

  // ─────────────────────────────────────────────────────────────
  // § 選取與文章
  // ─────────────────────────────────────────────────────────────

  function getSelection() {
    try {
      const sel = window.getSelection?.();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return { hasSelection: false, range: null };
      const range = sel.getRangeAt(0), fragment = range.cloneContents();
      if (!fragment.hasChildNodes()) return { hasSelection: false, range: null };
      return (fragment.textContent?.trim() || fragment.querySelector('img,svg,math,.katex,mjx-container,table,pre,code')) ? { hasSelection: true, range } : { hasSelection: false, range: null };
    } catch { return { hasSelection: false, range: null }; }
  }

  function hasSelection() { return getSelection().hasSelection; }
  function getSelectionRange() { return getSelection().range; }

  function findArticleRoot() {
    const candidates = [];
    for (const sel of ['article', 'main', '[role="main"]', '#content', '#main', '#article', '#post', '.content', '.main', '.article', '.post', '.entry', '.markdown-body']) try { document.querySelectorAll(sel).forEach(el => candidates.push(el)); } catch {}
    Array.from(document.querySelectorAll('section,div')).slice(0, 250).forEach(el => candidates.push(el));
    const isBad = el => /^(NAV|ASIDE|FOOTER|HEADER|FORM)$/.test(el.tagName) || el.closest('nav,aside,footer,header,form') || /^(navigation|banner|contentinfo|complementary)$/.test((el.getAttribute?.('role') || '').toLowerCase());
    const score = el => { if (!el || isBad(el)) return -1e9; const len = (el.textContent || '').trim().length; if (len < 200) return -1e9; return len + (el.querySelectorAll('p').length || 0) * 120 + (el.querySelectorAll('pre,code').length || 0) * 60 - (el.querySelectorAll('a').length || 0) * 30; };
    let best = null, bestScore = -1e9;
    for (const el of candidates) { const sc = score(el); if (sc > bestScore) { bestScore = sc; best = el; } }
    return best || document.body;
  }

  function isArticleTooSmall(el) { try { const a = (el?.textContent || '').trim().length, b = (document.body?.textContent || '').trim().length || 1; return a < S.get('articleMinChars') || a / b < S.get('articleMinRatio'); } catch { return true; } }
  function decideModeNoSelection() { const m = String(S.get('noSelectionMode') || 'page'); return m === 'article' ? 'article' : 'page'; }

  // ─────────────────────────────────────────────────────────────
  // § 主要流程
  // ─────────────────────────────────────────────────────────────

  async function makeRoot(mode) {
    const rng = mode === 'selection' ? getSelectionRange() : null;
    const scope = rng ? ((rng.commonAncestorContainer.nodeType === 1 ? rng.commonAncestorContainer : rng.commonAncestorContainer.parentElement) || document.body) : document.body;
    const hiddenTagged = annotateHidden(scope), iframeTagged = annotateIframes(scope), formatTagged = annotateFormatBoundaries(scope);
    await waitForMathJax(scope);
    const mjTagged = annotateMathJax(scope);
    let root, actualMode = mode;
    if (mode === 'selection' && rng) { const box = document.createElement('div'); box.appendChild(rng.cloneContents()); root = box; }
    else if (mode === 'article') { const art = findArticleRoot(); if (!art || art === document.body || isArticleTooSmall(art)) { root = document.body.cloneNode(true); actualMode = 'page'; } else root = art.cloneNode(true); }
    else root = document.body.cloneNode(true);
    cleanupAnnotations(mjTagged, 'data-mdltx-tex'); cleanupAnnotations(mjTagged, 'data-mdltx-display');
    cleanupAnnotations(hiddenTagged, 'data-mdltx-hidden'); cleanupAnnotations(iframeTagged, 'data-mdltx-iframe-md'); cleanupAnnotations(formatTagged, 'data-mdltx-block');
    try {
      root.querySelectorAll?.('[data-mdltx-ui="1"],#mdltx-ui-host').forEach(n => n.remove());
      root.querySelectorAll?.('[data-mdltx-hidden="1"]').forEach(n => { if (isMathInfra(n)) { n.removeAttribute('data-mdltx-hidden'); return; } n.remove(); });
      root.querySelectorAll?.('[data-mdltx-processed]').forEach(n => n.removeAttribute('data-mdltx-processed'));
    } catch {}
    return { root, actualMode };
  }

  async function generateMarkdown(mode) {
    const waitMs = S.get('waitBeforeCaptureMs'); if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
    const idleMs = S.get('waitDomIdleMs'); if (idleMs > 0) await waitForDomIdle(idleMs);
    if (mode === 'selection' && !hasSelection()) mode = decideModeNoSelection();
    const { root, actualMode } = await makeRoot(mode);
    const mathMap = replaceMathWithPlaceholders(root);
    const ctx = { depth: 0, escapeText: S.get('escapeMarkdownChars'), inTable: false, baseUri: document.baseURI };
    let out = md(root, ctx);
    for (const k of Object.keys(mathMap)) out = out.split(k).join(mathMap[k]);
    out = normalizeOutput(out);
    return { markdown: out, actualMode, length: out.length };
  }

  async function copyMarkdown(mode) { const result = await generateMarkdown(mode); GM_setClipboard(result.markdown); return result; }

  // ─────────────────────────────────────────────────────────────
  // § 快捷鍵與 Menu
  // ─────────────────────────────────────────────────────────────

  function installHotkey() {
    window.addEventListener('keydown', async e => {
      if (e.repeat || !S.get('hotkeyEnabled')) return;
      const key = (e.key || '').toLowerCase(), targetKey = S.get('hotkeyKey').toLowerCase();
      if (key !== targetKey) return;
      if (S.get('hotkeyAlt') !== e.altKey || S.get('hotkeyCtrl') !== e.ctrlKey || S.get('hotkeyShift') !== e.shiftKey || e.metaKey) return;
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      e.preventDefault(); e.stopPropagation();
      const mode = hasSelection() ? 'selection' : decideModeNoSelection();
      if (ui) await ui.handleCopy(mode); else await copyMarkdown(mode);
    }, true);
  }

  function installMenu() {
    try {
      GM_registerMenuCommand('📋 ' + t('copySelection'), async () => { if (ui) await ui.handleCopy('selection'); else await copyMarkdown('selection'); });
      GM_registerMenuCommand('📰 ' + t('copyArticle'), async () => { if (ui) await ui.handleCopy('article'); else await copyMarkdown('article'); });
      GM_registerMenuCommand('🌐 ' + t('copyPage'), async () => { if (ui) await ui.handleCopy('page'); else await copyMarkdown('page'); });
      GM_registerMenuCommand('💾 ' + t('downloadMd'), async () => { if (ui) await ui.handleDownload(); else { const mode = hasSelection() ? 'selection' : decideModeNoSelection(), result = await generateMarkdown(mode); downloadAsFile(result.markdown, generateFilename()); } });
      GM_registerMenuCommand('⚙️ ' + t('settings'), () => { if (ui) ui.showSettings(); });
    } catch (e) { console.warn('[mdltx] Failed to register menu commands:', e); }
  }

  // ─────────────────────────────────────────────────────────────
  // § 初始化
  // ─────────────────────────────────────────────────────────────

  let ui = null;

  function init() {
    try { migrateSettings(); ui = new UIManager(); ui.init(); installHotkey(); installMenu(); }
    catch (e) { console.error('[mdltx] Initialization failed:', e); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 0);

})();