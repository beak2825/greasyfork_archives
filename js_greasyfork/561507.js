// ==UserScript==
// @name         Copy MD + LaTeX
// @name:zh-TW   複製為 Markdown + LaTeX
// @name:zh-CN   复制为 Markdown + LaTeX
// @namespace    mdltx.copy.self
// @version      3.1.0
// @description  Copy selection/article/page as Markdown, preserving LaTeX from KaTeX/MathJax/MathML. Enhanced code block language detection for AI chat platforms. Self-contained with modern UI.
// @description:zh-TW  將選取範圍／文章／整頁複製為 Markdown，完整保留 KaTeX/MathJax/MathML 數學公式。增強 AI 聊天平台的程式碼區塊語言偵測。獨立運作，相容 Trusted Types。
// @description:zh-CN  将选取范围／文章／整页复制为 Markdown，完整保留 KaTeX/MathJax/MathML 数学公式。增强 AI 聊天平台的代码区块语言检测。独立运作，相容 Trusted Types。
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
// @downloadURL https://update.greasyfork.org/scripts/561507/Copy%20MD%20%2B%20LaTeX.user.js
// @updateURL https://update.greasyfork.org/scripts/561507/Copy%20MD%20%2B%20LaTeX.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // § 設定系統
  // ─────────────────────────────────────────────────────────────

  const DEFAULTS = {
    hotkeyEnabled: true, hotkeyAlt: true, hotkeyCtrl: false, hotkeyShift: false, hotkeyKey: 'm',
    showButton: true, buttonPosition: 'bottom-right', buttonOffsetX: 16, buttonOffsetY: 16,
    buttonOpacity: 0.85, buttonHoverOpacity: 1, buttonSize: 42,
    buttonAutoHide: false, buttonAutoHideDelay: 1500, buttonHiddenOpacity: 0,
    buttonClickAction: 'auto',
    noSelectionMode: 'page', stripCommonIndentInBlockMath: true, absoluteUrls: true, waitMathJax: true, escapeMarkdownChars: true,
    listMarker: '-', emphasisMarker: '*', strongMarker: '**', horizontalRule: '---',
    articleMinChars: 600, articleMinRatio: 0.55, ignoreNav: false,
    visibilityMode: 'loose', hiddenScanMaxElements: 5000, hiddenUntilFoundVisible: true, strictOffscreen: false, offscreenMargin: 100,
    extractShadowDOM: true, extractIframes: false,
    waitBeforeCaptureMs: 0, waitDomIdleMs: 0,
    strongEmBlockStrategy: 'split', complexTableStrategy: 'list', detailsStrategy: 'preserve', unknownEmptyTagStrategy: 'literal', mergeAdjacentCodeSpans: true,
    enableContentBasedLangDetection: true, lmArenaEnhancedDetection: true, aiChatPlatformDetection: true,
    theme: 'auto', toastDuration: 2500, language: 'auto',
    settingsMode: 'simple',
    downloadFilenameTemplate: '{title}_{date}',
    settingsVersion: 5,
  };

  const SETTING_TYPES = {
    hotkeyEnabled: 'boolean', hotkeyAlt: 'boolean', hotkeyCtrl: 'boolean', hotkeyShift: 'boolean', hotkeyKey: 'string',
    showButton: 'boolean', buttonPosition: 'string', buttonOffsetX: 'number', buttonOffsetY: 'number',
    buttonOpacity: 'number', buttonHoverOpacity: 'number', buttonSize: 'number',
    buttonAutoHide: 'boolean', buttonAutoHideDelay: 'number', buttonHiddenOpacity: 'number',
    buttonClickAction: 'string',
    noSelectionMode: 'string', stripCommonIndentInBlockMath: 'boolean', absoluteUrls: 'boolean', waitMathJax: 'boolean', escapeMarkdownChars: 'boolean',
    listMarker: 'string', emphasisMarker: 'string', strongMarker: 'string', horizontalRule: 'string',
    articleMinChars: 'number', articleMinRatio: 'number', ignoreNav: 'boolean',
    visibilityMode: 'string', hiddenScanMaxElements: 'number', hiddenUntilFoundVisible: 'boolean', strictOffscreen: 'boolean', offscreenMargin: 'number',
    extractShadowDOM: 'boolean', extractIframes: 'boolean',
    waitBeforeCaptureMs: 'number', waitDomIdleMs: 'number',
    strongEmBlockStrategy: 'string', complexTableStrategy: 'string', detailsStrategy: 'string', unknownEmptyTagStrategy: 'string', mergeAdjacentCodeSpans: 'boolean',
    enableContentBasedLangDetection: 'boolean', lmArenaEnhancedDetection: 'boolean', aiChatPlatformDetection: 'boolean',
    theme: 'string', toastDuration: 'number', language: 'string',
    settingsMode: 'string',
    downloadFilenameTemplate: 'string',
    settingsVersion: 'number',
  };

  const S = {
    get(k) {
      try {
        const raw = GM_getValue(k, DEFAULTS[k]), type = SETTING_TYPES[k], def = DEFAULTS[k];
        if (type === 'boolean') return raw === true || raw === 'true' || raw === 1 || raw === '1' ? true : raw === false || raw === 'false' || raw === 0 || raw === '0' ? false : def;
        if (type === 'number') { const n = Number(raw); return isNaN(n) ? def : n; }
        if (type === 'string') return raw == null ? def : String(raw);
        return raw ?? def;
      } catch (e) { console.warn('[mdltx] Failed to get setting:', k, e); return DEFAULTS[k]; }
    },
    set(k, v) { try { GM_setValue(k, v); } catch (e) { console.warn('[mdltx] Failed to set setting:', k, e); } },
    getAll() { const r = {}; for (const k of Object.keys(DEFAULTS)) r[k] = this.get(k); return r; },
    resetAll() { for (const k of Object.keys(DEFAULTS)) try { GM_setValue(k, DEFAULTS[k]); } catch (e) { console.warn('[mdltx] Failed to reset setting:', k, e); } }
  };

  function migrateSettings() {
    try {
      const cur = S.get('settingsVersion');
      const migrations = [
        [2, ['strongEmBlockStrategy', 'complexTableStrategy', 'detailsStrategy', 'unknownEmptyTagStrategy', 'hiddenUntilFoundVisible', 'strictOffscreen']],
        [3, ['waitBeforeCaptureMs', 'waitDomIdleMs', 'mergeAdjacentCodeSpans', 'offscreenMargin']],
        [4, ['buttonHoverOpacity', 'buttonSize', 'buttonAutoHide', 'buttonAutoHideDelay', 'buttonClickAction', 'listMarker', 'emphasisMarker', 'strongMarker', 'horizontalRule', 'settingsMode', 'buttonHiddenOpacity']],
        [5, ['enableContentBasedLangDetection', 'lmArenaEnhancedDetection', 'aiChatPlatformDetection']],
      ];
      for (const [ver, keys] of migrations) {
        if (cur < ver) for (const k of keys) if (GM_getValue(k) === undefined) GM_setValue(k, DEFAULTS[k]);
      }
      if (cur < DEFAULTS.settingsVersion) GM_setValue('settingsVersion', DEFAULTS.settingsVersion);
    } catch (e) { console.warn('[mdltx] Migration failed:', e); }
  }

  // ─────────────────────────────────────────────────────────────
  // § 國際化
  // ─────────────────────────────────────────────────────────────

  const I18N = {
    'zh-TW': {
      copyMd: '複製 MD', copySelection: '複製選取內容', copyArticle: '智慧擷取文章', copyPage: '複製整個頁面', downloadMd: '下載為 .md 檔案', settings: '設定',
      processing: '處理中...', copied: '已複製！', downloaded: '已下載！', failed: '失敗',
      settingsTitle: 'MD+LaTeX 複製工具設定',
      settingsModeLabel: '設定模式', settingsModeSimple: '簡易', settingsModeAdvanced: '進階',
      generalSettings: '一般設定', showButton: '顯示浮動按鈕', buttonPosition: '按鈕位置', bottomRight: '右下角', bottomLeft: '左下角', topRight: '右上角', topLeft: '左上角',
      buttonOpacity: '按鈕不透明度', buttonHoverOpacity: '懸停時不透明度', buttonSize: '按鈕大小',
      buttonAutoHide: '自動隱藏按鈕', buttonAutoHideDelay: '離開後隱藏延遲 (ms)', buttonHiddenOpacity: '隱藏時不透明度',
      buttonClickAction: '左鍵點擊動作', clickActionAuto: '自動（有選取複製選取，否則依預設）', clickActionSelection: '複製選取內容', clickActionArticle: '智慧擷取文章', clickActionPage: '複製整個頁面', clickActionDownload: '下載為 .md 檔案',
      theme: '主題', themeAuto: '自動', themeLight: '淺色', themeDark: '深色', language: '語言', langAuto: '自動',
      hotkeySettings: '快捷鍵設定', enableHotkey: '啟用快捷鍵', hotkeyCombo: '快捷鍵組合', pressKey: '按下按鍵...',
      conversionSettings: '轉換設定', noSelectionMode: '無選取時預設模式', modePage: '整個頁面', modeArticle: '智慧文章', absoluteUrls: '使用絕對網址', ignoreNav: '忽略導覽/頁首/頁尾/側邊欄', waitMathJax: '等待 MathJax 渲染', stripIndent: '移除區塊數學的共同縮排', escapeMarkdownChars: '逸出 Markdown 特殊字元', extractShadowDOM: '擷取 Shadow DOM 內容', extractIframes: '擷取 iframe 內容（同源）',
      markdownFormat: 'Markdown 格式', listMarker: '清單符號', emphasisMarker: '斜體符號', strongMarker: '粗體符號', horizontalRule: '水平線符號',
      captureSettings: '擷取時機設定', waitBeforeCapture: '抽取前等待時間 (ms)', waitDomIdle: 'DOM 穩定後等待 (ms)',
      visibilitySettings: '可見性設定', visibilityMode: '隱藏元素判斷策略', visibilityLoose: '寬鬆（display/visibility/hidden）', visibilityStrict: '嚴格（含 opacity/content-visibility/offscreen）', visibilityDom: 'DOM 優先（僅 hidden 屬性）', strictOffscreen: '啟用螢幕外元素偵測', offscreenMargin: '螢幕外邊界距離 (px)',
      formatSettings: '格式處理設定', strongEmBlockStrategy: '粗體/斜體跨區塊策略', strategySplit: '拆段（推薦）', strategyHtml: 'HTML 標籤', strategyStrip: '移除格式', complexTableStrategy: '複雜表格策略', strategyList: '轉為清單', strategyTableHtml: 'HTML 表格', detailsStrategy: 'Details 元素策略', detailsPreserve: '保留完整內容', detailsStrictVisual: '僅保留 summary', mergeAdjacentCodeSpans: '合併相鄰程式碼區段',
      codeBlockSettings: '程式碼區塊設定',
      enableContentBasedLangDetection: '啟用內容推斷語言',
      enableContentBasedLangDetectionTooltip: '根據程式碼內容特徵自動推斷語言',
      lmArenaEnhancedDetection: 'LMArena 增強偵測',
      lmArenaEnhancedDetectionTooltip: '針對 LMArena.ai 的程式碼區塊結構進行特殊處理',
      aiChatPlatformDetection: 'AI 聊天平台增強偵測',
      aiChatPlatformDetectionTooltip: '針對 Claude、Grok、ChatGPT 等平台的程式碼區塊進行特殊處理',
      advancedSettings: '進階設定', articleMinChars: '文章最少字元數', articleMinRatio: '文章最小比例', toastDuration: 'Toast 顯示時間 (ms)',
      resetSettings: '重設為預設值', saveSettings: '儲存設定', cancel: '取消', close: '關閉',
      toastSuccess: '✅ 已複製 Markdown', toastSuccessDetail: '模式：{mode}｜字元數：{count}', toastDownloadSuccess: '✅ 已下載 Markdown', toastDownloadDetail: '檔案：{filename}｜字元數：{count}', toastError: '❌ 轉換失敗', toastErrorDetail: '錯誤：{error}',
      modeSelection: '選取', modeArticleLabel: '文章', modePageLabel: '頁面',
      hotkeyHint: '快捷鍵提示', dragToMove: '拖曳移動', currentHotkey: '目前快捷鍵', confirmReset: '確定要重設所有設定嗎？', settingsResetDone: '設定已重設為預設值', noSelection: '（無選取內容）', settingsSaved: '設定已儲存',
      buttonHint: '左鍵：{action}\n右鍵：選單\n拖曳：移動',
      buttonHintHotkey: '快捷鍵：{hotkey}',
      settingsHint: 'Enter 儲存 · Esc 取消',
    },
    'zh-CN': {
      copyMd: '复制 MD', copySelection: '复制选中内容', copyArticle: '智能提取文章', copyPage: '复制整个页面', downloadMd: '下载为 .md 文件', settings: '设置',
      processing: '处理中...', copied: '已复制！', downloaded: '已下载！', failed: '失败',
      settingsTitle: 'MD+LaTeX 复制工具设置',
      settingsModeLabel: '设置模式', settingsModeSimple: '简易', settingsModeAdvanced: '高级',
      generalSettings: '常规设置', showButton: '显示浮动按钮', buttonPosition: '按钮位置', bottomRight: '右下角', bottomLeft: '左下角', topRight: '右上角', topLeft: '左上角',
      buttonOpacity: '按钮不透明度', buttonHoverOpacity: '悬停时不透明度', buttonSize: '按钮大小',
      buttonAutoHide: '自动隐藏按钮', buttonAutoHideDelay: '离开后隐藏延迟 (ms)', buttonHiddenOpacity: '隐藏时不透明度',
      buttonClickAction: '左键点击动作', clickActionAuto: '自动（有选中复制选中，否则依默认）', clickActionSelection: '复制选中内容', clickActionArticle: '智能提取文章', clickActionPage: '复制整个页面', clickActionDownload: '下载为 .md 文件',
      theme: '主题', themeAuto: '自动', themeLight: '浅色', themeDark: '深色', language: '语言', langAuto: '自动',
      hotkeySettings: '快捷键设置', enableHotkey: '启用快捷键', hotkeyCombo: '快捷键组合', pressKey: '按下按键...',
      conversionSettings: '转换设置', noSelectionMode: '无选中时默认模式', modePage: '整个页面', modeArticle: '智能文章', absoluteUrls: '使用绝对网址', ignoreNav: '忽略导航/页眉/页脚/侧边栏', waitMathJax: '等待 MathJax 渲染', stripIndent: '移除块级数学的公共缩进', escapeMarkdownChars: '转义 Markdown 特殊字符', extractShadowDOM: '提取 Shadow DOM 内容', extractIframes: '提取 iframe 内容（同源）',
      markdownFormat: 'Markdown 格式', listMarker: '列表符号', emphasisMarker: '斜体符号', strongMarker: '粗体符号', horizontalRule: '水平线符号',
      captureSettings: '抓取时机设置', waitBeforeCapture: '抓取前等待时间 (ms)', waitDomIdle: 'DOM 稳定后等待 (ms)',
      visibilitySettings: '可见性设置', visibilityMode: '隐藏元素判断策略', visibilityLoose: '宽松（display/visibility/hidden）', visibilityStrict: '严格（含 opacity/content-visibility/offscreen）', visibilityDom: 'DOM 优先（仅 hidden 属性）', strictOffscreen: '启用屏幕外元素检测', offscreenMargin: '屏幕外边界距离 (px)',
      formatSettings: '格式处理设置', strongEmBlockStrategy: '粗体/斜体跨区块策略', strategySplit: '拆段（推荐）', strategyHtml: 'HTML 标签', strategyStrip: '移除格式', complexTableStrategy: '复杂表格策略', strategyList: '转为列表', strategyTableHtml: 'HTML 表格', detailsStrategy: 'Details 元素策略', detailsPreserve: '保留完整内容', detailsStrictVisual: '仅保留 summary', mergeAdjacentCodeSpans: '合并相邻代码区段',
      codeBlockSettings: '代码区块设置',
      enableContentBasedLangDetection: '启用内容推断语言',
      enableContentBasedLangDetectionTooltip: '根据代码内容特征自动推断语言',
      lmArenaEnhancedDetection: 'LMArena 增强检测',
      lmArenaEnhancedDetectionTooltip: '针对 LMArena.ai 的代码区块结构进行特殊处理',
      aiChatPlatformDetection: 'AI 聊天平台增强检测',
      aiChatPlatformDetectionTooltip: '针对 Claude、Grok、ChatGPT 等平台的代码区块进行特殊处理',
      advancedSettings: '高级设置', articleMinChars: '文章最少字符数', articleMinRatio: '文章最小比例', toastDuration: 'Toast 显示时间 (ms)',
      resetSettings: '重置为默认值', saveSettings: '保存设置', cancel: '取消', close: '关闭',
      toastSuccess: '✅ 已复制 Markdown', toastSuccessDetail: '模式：{mode}｜字符数：{count}', toastDownloadSuccess: '✅ 已下载 Markdown', toastDownloadDetail: '文件：{filename}｜字符数：{count}', toastError: '❌ 转换失败', toastErrorDetail: '错误：{error}',
      modeSelection: '选中', modeArticleLabel: '文章', modePageLabel: '页面',
      hotkeyHint: '快捷键提示', dragToMove: '拖拽移动', currentHotkey: '当前快捷键', confirmReset: '确定要重置所有设置吗？', settingsResetDone: '设置已重置为默认值', noSelection: '（无选中内容）', settingsSaved: '设置已保存',
      buttonHint: '左键：{action}\n右键：菜单\n拖拽：移动',
      buttonHintHotkey: '快捷键：{hotkey}',
      settingsHint: 'Enter 保存 · Esc 取消',
    },
    'en': {
      copyMd: 'Copy MD', copySelection: 'Copy Selection', copyArticle: 'Smart Article', copyPage: 'Copy Entire Page', downloadMd: 'Download as .md', settings: 'Settings',
      processing: 'Processing...', copied: 'Copied!', downloaded: 'Downloaded!', failed: 'Failed',
      settingsTitle: 'MD+LaTeX Copy Tool Settings',
      settingsModeLabel: 'Settings Mode', settingsModeSimple: 'Simple', settingsModeAdvanced: 'Advanced',
      generalSettings: 'General Settings', showButton: 'Show Floating Button', buttonPosition: 'Button Position', bottomRight: 'Bottom Right', bottomLeft: 'Bottom Left', topRight: 'Top Right', topLeft: 'Top Left',
      buttonOpacity: 'Button Opacity', buttonHoverOpacity: 'Hover Opacity', buttonSize: 'Button Size',
      buttonAutoHide: 'Auto-hide Button', buttonAutoHideDelay: 'Hide Delay After Leave (ms)', buttonHiddenOpacity: 'Hidden Opacity',
      buttonClickAction: 'Left-click Action', clickActionAuto: 'Auto (copy selection if any, else default)', clickActionSelection: 'Copy Selection', clickActionArticle: 'Smart Article', clickActionPage: 'Copy Entire Page', clickActionDownload: 'Download as .md',
      theme: 'Theme', themeAuto: 'Auto', themeLight: 'Light', themeDark: 'Dark', language: 'Language', langAuto: 'Auto',
      hotkeySettings: 'Hotkey Settings', enableHotkey: 'Enable Hotkey', hotkeyCombo: 'Hotkey Combination', pressKey: 'Press a key...',
      conversionSettings: 'Conversion Settings', noSelectionMode: 'Default Mode (No Selection)', modePage: 'Entire Page', modeArticle: 'Smart Article', absoluteUrls: 'Use Absolute URLs', ignoreNav: 'Ignore Nav/Header/Footer/Aside', waitMathJax: 'Wait for MathJax', stripIndent: 'Strip Common Indent in Block Math', escapeMarkdownChars: 'Escape Markdown special characters', extractShadowDOM: 'Extract Shadow DOM content', extractIframes: 'Extract iframe content (same-origin)',
      markdownFormat: 'Markdown Format', listMarker: 'List Marker', emphasisMarker: 'Emphasis Marker', strongMarker: 'Strong Marker', horizontalRule: 'Horizontal Rule',
      captureSettings: 'Capture Timing Settings', waitBeforeCapture: 'Wait before capture (ms)', waitDomIdle: 'Wait after DOM idle (ms)',
      visibilitySettings: 'Visibility Settings', visibilityMode: 'Hidden Element Strategy', visibilityLoose: 'Loose (display/visibility/hidden)', visibilityStrict: 'Strict (incl. opacity/content-visibility/offscreen)', visibilityDom: 'DOM Only (hidden attribute only)', strictOffscreen: 'Enable offscreen element detection', offscreenMargin: 'Offscreen margin (px)',
      formatSettings: 'Format Processing Settings', strongEmBlockStrategy: 'Bold/Italic Block Strategy', strategySplit: 'Split (recommended)', strategyHtml: 'HTML Tags', strategyStrip: 'Strip formatting', complexTableStrategy: 'Complex Table Strategy', strategyList: 'Convert to list', strategyTableHtml: 'HTML table', detailsStrategy: 'Details Element Strategy', detailsPreserve: 'Preserve full content', detailsStrictVisual: 'Keep summary only', mergeAdjacentCodeSpans: 'Merge adjacent code spans',
      codeBlockSettings: 'Code Block Settings',
      enableContentBasedLangDetection: 'Enable content-based language inference',
      enableContentBasedLangDetectionTooltip: 'Automatically infer language from code content patterns',
      lmArenaEnhancedDetection: 'LMArena enhanced detection',
      lmArenaEnhancedDetectionTooltip: 'Special handling for LMArena.ai code block structures',
      aiChatPlatformDetection: 'AI chat platform detection',
      aiChatPlatformDetectionTooltip: 'Special handling for Claude, Grok, ChatGPT and other AI chat platforms',
      advancedSettings: 'Advanced Settings', articleMinChars: 'Article Minimum Characters', articleMinRatio: 'Article Minimum Ratio', toastDuration: 'Toast Duration (ms)',
      resetSettings: 'Reset to Defaults', saveSettings: 'Save Settings', cancel: 'Cancel', close: 'Close',
      toastSuccess: '✅ Markdown Copied', toastSuccessDetail: 'Mode: {mode} | Characters: {count}', toastDownloadSuccess: '✅ Markdown Downloaded', toastDownloadDetail: 'File: {filename} | Characters: {count}', toastError: '❌ Conversion Failed', toastErrorDetail: 'Error: {error}',
      modeSelection: 'Selection', modeArticleLabel: 'Article', modePageLabel: 'Page',
      hotkeyHint: 'Hotkey Hint', dragToMove: 'Drag to move', currentHotkey: 'Current Hotkey', confirmReset: 'Are you sure you want to reset all settings?', settingsResetDone: 'Settings have been reset to defaults', noSelection: '(No selection)', settingsSaved: 'Settings saved',
      buttonHint: 'Left: {action}\nRight: Menu\nDrag: Move',
      buttonHintHotkey: 'Hotkey: {hotkey}',
      settingsHint: 'Enter to Save · Esc to Cancel',
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

  function getHotkeyString() {
    if (!S.get('hotkeyEnabled')) return '';
    const parts = [];
    if (S.get('hotkeyCtrl')) parts.push('Ctrl');
    if (S.get('hotkeyAlt')) parts.push('Alt');
    if (S.get('hotkeyShift')) parts.push('Shift');
    parts.push(S.get('hotkeyKey').toUpperCase());
    return parts.join('+');
  }

  function getClickActionLabel(short = false) {
    const action = S.get('buttonClickAction'), lang = detectLanguage();
    if (short) {
      const map = {
        'zh-TW': { auto: '自動', selection: '選取', article: '文章', page: '頁面', download: '下載' },
        'zh-CN': { auto: '自动', selection: '选中', article: '文章', page: '页面', download: '下载' },
        'en': { auto: 'Auto', selection: 'Selection', article: 'Article', page: 'Page', download: 'Download' }
      };
      return (map[lang] || map['en'])[action] || map[lang]?.auto || 'Auto';
    }
    return { auto: t('clickActionAuto'), selection: t('copySelection'), article: t('copyArticle'), page: t('copyPage'), download: t('downloadMd') }[action] || t('clickActionAuto');
  }

  // ─────────────────────────────────────────────────────────────
  // § SVG 圖示
  // ─────────────────────────────────────────────────────────────

  const SVG_NS = 'http://www.w3.org/2000/svg';

  const ICON_DEFS = {
    markdown: {
      viewBox: '0 0 24 24',
      elements: [
        { type: 'rect', x: '7.3', y: '5.0', width: '14.2', height: '15.8', rx: '3.0', strokeOpacity: '0.28', strokeWidth: '1.65', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { type: 'rect', x: '3.0', y: '3.2', width: '14.2', height: '15.8', rx: '3.0', fill: 'currentColor', fillOpacity: '0.08', strokeOpacity: '0.98', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { type: 'path', d: 'M6.35 16.1V8.85l2.35 3.05 2.35-3.05v7.25', strokeOpacity: '0.95', strokeWidth: '2.0', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { type: 'path', d: 'M15.05 8.9v6.1', strokeOpacity: '0.92', strokeWidth: '2.0', strokeLinecap: 'round', strokeLinejoin: 'round' },
        { type: 'path', d: 'M13.6 13.25l1.45 1.9 1.45-1.9', strokeOpacity: '0.92', strokeWidth: '2.0', strokeLinecap: 'round', strokeLinejoin: 'round' }
      ]
    },
    copy: 'M9 9h10v10H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
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
    chevronUp: 'M18 15l-6-6-6 6',
  };

  function createIcon(type, size) {
    const def = ICON_DEFS[type];
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('shape-rendering', 'geometricPrecision');
    if (size) { svg.setAttribute('width', String(size)); svg.setAttribute('height', String(size)); }

    if (typeof def === 'string') {
      svg.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', def);
      svg.appendChild(path);
    } else if (def && typeof def === 'object') {
      svg.setAttribute('viewBox', def.viewBox || '0 0 24 24');
      for (const el of (def.elements || [])) {
        let node;
        if (el.type === 'path') {
          node = document.createElementNS(SVG_NS, 'path');
          node.setAttribute('d', el.d);
        } else if (el.type === 'rect') {
          node = document.createElementNS(SVG_NS, 'rect');
          ['x', 'y', 'width', 'height', 'rx', 'ry'].forEach(a => el[a] && node.setAttribute(a, el[a]));
        } else if (el.type === 'circle') {
          node = document.createElementNS(SVG_NS, 'circle');
          ['cx', 'cy', 'r'].forEach(a => el[a] && node.setAttribute(a, el[a]));
        }
        if (node) {
          ['fill', 'stroke', 'fillOpacity', 'strokeOpacity', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin'].forEach(a => {
            if (el[a] != null) node.setAttribute(a.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), String(el[a]));
          });
          svg.appendChild(node);
        }
      }
    } else {
      svg.setAttribute('viewBox', '0 0 24 24');
    }
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
.mdltx-btn{position:fixed;z-index:2147483647;display:flex;align-items:center;justify-content:center;width:var(--mdltx-btn-size,42px);height:var(--mdltx-btn-size,42px);padding:0;border-radius:50%;border:1px solid var(--mdltx-border);background:var(--mdltx-bg);color:var(--mdltx-text);box-shadow:0 4px 12px var(--mdltx-shadow);cursor:pointer;user-select:none;touch-action:none;transition:transform 0.2s ease,box-shadow 0.2s ease,background 0.2s ease,color 0.2s ease,opacity 0.3s ease;font-family:inherit;opacity:var(--mdltx-btn-opacity,0.85)}
.mdltx-btn:hover:not(.dragging):not(.processing){transform:translateY(-2px) scale(1.05);box-shadow:0 8px 24px var(--mdltx-shadow-lg);opacity:var(--mdltx-btn-hover-opacity,1)!important}
.mdltx-btn:focus-visible{outline:3px solid var(--mdltx-primary);outline-offset:2px}
.mdltx-btn:active:not(.dragging){transform:translateY(0) scale(0.98)}
.mdltx-btn.dragging{cursor:grabbing;opacity:0.9!important;transition:opacity 0.1s ease}
.mdltx-btn.processing{pointer-events:none}
.mdltx-btn.success{background:var(--mdltx-success);color:#fff;border-color:var(--mdltx-success)}
.mdltx-btn.error{background:var(--mdltx-error);color:#fff;border-color:var(--mdltx-error)}
.mdltx-btn.auto-hidden{opacity:var(--mdltx-btn-hidden-opacity,0)!important;pointer-events:none}
.mdltx-btn-icon{width:70%;height:70%;display:flex;align-items:center;justify-content:center}
.mdltx-btn-icon svg{width:100%;height:100%}
.mdltx-btn-spinner{width:50%;height:50%;border:2px solid var(--mdltx-border);border-top-color:var(--mdltx-primary);border-radius:50%;animation:mdltx-spin 0.8s linear infinite}
@keyframes mdltx-spin{to{transform:rotate(360deg)}}
.mdltx-sensor{position:fixed;z-index:2147483646;background:transparent;pointer-events:auto;border-radius:50%}
.mdltx-tooltip{position:fixed;z-index:2147483648;background:var(--mdltx-bg);color:var(--mdltx-text);border:1px solid var(--mdltx-border);padding:10px 14px;border-radius:10px;font-size:12px;line-height:1.5;box-shadow:0 4px 16px var(--mdltx-shadow-lg);max-width:260px;opacity:0;visibility:hidden;transition:opacity 0.15s ease,visibility 0.15s ease;pointer-events:none;white-space:pre-line}
.mdltx-tooltip.show{opacity:1;visibility:visible}
.mdltx-tooltip-hotkey{display:block;margin-top:6px;padding-top:6px;border-top:1px solid var(--mdltx-border);color:var(--mdltx-text-secondary);font-size:11px}
.mdltx-menu{position:fixed;z-index:2147483647;min-width:220px;padding:6px;background:var(--mdltx-bg);border:1px solid var(--mdltx-border);border-radius:12px;box-shadow:0 8px 32px var(--mdltx-shadow-lg);opacity:0;visibility:hidden;transform:scale(0.95) translateY(-10px);transform-origin:top;transition:all 0.15s ease}
.mdltx-menu.open{opacity:1;visibility:visible;transform:scale(1) translateY(0)}
.mdltx-menu.from-bottom{transform-origin:bottom;transform:scale(0.95) translateY(10px)}
.mdltx-menu.from-bottom.open{transform:scale(1) translateY(0)}
.mdltx-menu-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;transition:background 0.15s ease,transform 0.15s ease;color:var(--mdltx-text);border:none;background:none;width:100%;text-align:left;font-family:inherit;font-size:14px}
.mdltx-menu-item:hover:not(:disabled){background:var(--mdltx-bg-secondary);transform:translateX(2px)}
.mdltx-menu-item:focus-visible{background:var(--mdltx-bg-secondary);outline:none}
.mdltx-menu-item:active:not(:disabled){background:var(--mdltx-bg-tertiary)}
.mdltx-menu-item:disabled{opacity:0.5;cursor:not-allowed}
.mdltx-menu-item-icon{width:18px;height:18px;flex-shrink:0;color:var(--mdltx-text-secondary);display:flex;align-items:center;justify-content:center}
.mdltx-menu-item-icon svg{width:100%;height:100%}
.mdltx-menu-item.active .mdltx-menu-item-icon{color:var(--mdltx-primary)}
.mdltx-menu-item-text{flex:1}
.mdltx-menu-item-hint{font-size:12px;color:var(--mdltx-text-secondary);margin-left:auto}
.mdltx-menu-divider{height:1px;background:var(--mdltx-border);margin:6px 0}
.mdltx-menu-hint{padding:6px 12px;font-size:11px;color:var(--mdltx-text-secondary)}
.mdltx-toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(100px);z-index:2147483647;display:flex;align-items:flex-start;gap:12px;padding:14px 18px;min-width:280px;max-width:min(500px,90vw);border-radius:12px;background:var(--mdltx-bg);border:1px solid var(--mdltx-border);box-shadow:0 8px 32px var(--mdltx-shadow-lg);opacity:0;visibility:hidden;transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
.mdltx-toast.show{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.mdltx-toast.success{border-left:4px solid var(--mdltx-success)}
.mdltx-toast.error{border-left:4px solid var(--mdltx-error)}
.mdltx-toast.info{border-left:4px solid var(--mdltx-primary)}
.mdltx-toast-icon{width:20px;height:20px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center}
.mdltx-toast-icon svg{width:100%;height:100%}
.mdltx-toast.success .mdltx-toast-icon{color:var(--mdltx-success)}
.mdltx-toast.error .mdltx-toast-icon{color:var(--mdltx-error)}
.mdltx-toast.info .mdltx-toast-icon{color:var(--mdltx-primary)}
.mdltx-toast-content{flex:1;min-width:0}
.mdltx-toast-title{font-weight:600;margin-bottom:2px}
.mdltx-toast-detail{font-size:13px;color:var(--mdltx-text-secondary);word-break:break-word}
.mdltx-toast-close{width:24px;height:24px;padding:4px;border:none;background:none;cursor:pointer;border-radius:6px;color:var(--mdltx-text-secondary);transition:all 0.15s ease;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.mdltx-toast-close svg{width:16px;height:16px}
.mdltx-toast-close:hover{background:var(--mdltx-bg-secondary);color:var(--mdltx-text)}
.mdltx-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:var(--mdltx-overlay);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;visibility:hidden;transition:all 0.2s ease}
.mdltx-modal-overlay.open{opacity:1;visibility:visible}
.mdltx-modal{width:100%;max-width:640px;max-height:calc(100vh - 40px);background:var(--mdltx-bg);border-radius:16px;box-shadow:0 24px 48px var(--mdltx-shadow-lg);display:flex;flex-direction:column;transform:scale(0.95);transition:transform 0.2s ease}
.mdltx-modal-overlay.open .mdltx-modal{transform:scale(1)}
.mdltx-modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid var(--mdltx-border);flex-shrink:0}
.mdltx-modal-title{font-size:18px;font-weight:600;color:var(--mdltx-text)}
.mdltx-modal-close{width:32px;height:32px;padding:6px;border:none;background:none;cursor:pointer;border-radius:8px;color:var(--mdltx-text-secondary);transition:all 0.15s ease;display:flex;align-items:center;justify-content:center}
.mdltx-modal-close svg{width:20px;height:20px}
.mdltx-modal-close:hover{background:var(--mdltx-bg-secondary);color:var(--mdltx-text)}
.mdltx-modal-body{flex:1;overflow-y:auto;padding:20px 24px}
.mdltx-modal-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 24px;border-top:1px solid var(--mdltx-border);flex-shrink:0}
.mdltx-modal-footer-hint{font-size:12px;color:var(--mdltx-text-secondary)}
.mdltx-modal-footer-left,.mdltx-modal-footer-right{display:flex;gap:8px}
.mdltx-mode-toggle{display:flex;background:var(--mdltx-bg-secondary);border-radius:8px;padding:4px;margin-bottom:20px}
.mdltx-mode-toggle-btn{flex:1;padding:8px 16px;border:none;background:none;color:var(--mdltx-text-secondary);font-size:13px;font-weight:500;cursor:pointer;border-radius:6px;transition:all 0.2s ease}
.mdltx-mode-toggle-btn:hover{color:var(--mdltx-text)}
.mdltx-mode-toggle-btn.active{background:var(--mdltx-bg);color:var(--mdltx-text);box-shadow:0 1px 3px var(--mdltx-shadow)}
.mdltx-mode-toggle-btn:focus-visible{outline:2px solid var(--mdltx-primary);outline-offset:-2px}
.mdltx-section{margin-bottom:24px}
.mdltx-section:last-child{margin-bottom:0}
.mdltx-section.hidden{display:none}
.mdltx-section-title{font-size:13px;font-weight:600;color:var(--mdltx-text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px}
.mdltx-field{margin-bottom:16px}
.mdltx-field:last-child{margin-bottom:0}
.mdltx-field.hidden{display:none}
.mdltx-field-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
.mdltx-label{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--mdltx-text);cursor:pointer}
.mdltx-label-text{flex:1}
.mdltx-checkbox{width:18px;height:18px;accent-color:var(--mdltx-primary);cursor:pointer}
.mdltx-select{padding:8px 12px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg);color:var(--mdltx-text);font-family:inherit;font-size:14px;cursor:pointer;min-width:180px}
.mdltx-select:focus{outline:none;border-color:var(--mdltx-primary);box-shadow:var(--mdltx-focus-ring)}
.mdltx-input{padding:8px 12px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg);color:var(--mdltx-text);font-family:inherit;font-size:14px;width:100px;transition:border-color 0.15s ease,box-shadow 0.15s ease}
.mdltx-input:focus{outline:none;border-color:var(--mdltx-primary);box-shadow:var(--mdltx-focus-ring)}
.mdltx-input.invalid{border-color:var(--mdltx-error);background:rgba(220,38,38,0.05)}
.mdltx-input.valid{border-color:var(--mdltx-success)}
.mdltx-input-wrapper{position:relative;display:inline-flex;align-items:center}
.mdltx-range-container{display:flex;align-items:center;gap:8px}
.mdltx-range{width:120px;accent-color:var(--mdltx-primary)}
.mdltx-range-value{font-size:13px;color:var(--mdltx-text-secondary);min-width:48px;text-align:right}
.mdltx-hotkey-input{display:flex;align-items:center;gap:8px}
.mdltx-hotkey-display{display:flex;gap:4px;flex-wrap:wrap}
.mdltx-kbd{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:26px;padding:0 8px;background:var(--mdltx-bg-secondary);border:1px solid var(--mdltx-border);border-radius:6px;font-size:12px;font-weight:500;color:var(--mdltx-text)}
.mdltx-hotkey-record-btn{padding:6px 12px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg-secondary);color:var(--mdltx-text);font-family:inherit;font-size:13px;cursor:pointer;transition:all 0.15s ease}
.mdltx-hotkey-record-btn:hover{background:var(--mdltx-bg-tertiary)}
.mdltx-hotkey-record-btn.recording{background:var(--mdltx-primary);color:#fff;border-color:var(--mdltx-primary)}
.mdltx-btn-primary{padding:10px 20px;border:none;border-radius:8px;background:var(--mdltx-primary);color:#fff;font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease}
.mdltx-btn-primary:hover{background:var(--mdltx-primary-hover)}
.mdltx-btn-primary:focus-visible{outline:2px solid var(--mdltx-primary);outline-offset:2px}
.mdltx-btn-secondary{padding:10px 20px;border:1px solid var(--mdltx-border);border-radius:8px;background:var(--mdltx-bg);color:var(--mdltx-text);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease}
.mdltx-btn-secondary:hover{background:var(--mdltx-bg-secondary)}
.mdltx-btn-secondary:focus-visible{outline:2px solid var(--mdltx-primary);outline-offset:2px}
.mdltx-btn-danger{padding:10px 20px;border:1px solid var(--mdltx-error);border-radius:8px;background:transparent;color:var(--mdltx-error);font-family:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.15s ease}
.mdltx-btn-danger:hover{background:var(--mdltx-error);color:#fff}
.mdltx-btn-danger:focus-visible{outline:2px solid var(--mdltx-error);outline-offset:2px}
.icon{display:inline-block;vertical-align:middle}
.mdltx-conditional{margin-left:26px;padding-left:12px;border-left:2px solid var(--mdltx-border);margin-top:8px}
.mdltx-conditional.hidden{display:none}
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      return Array.from(this.container.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),a[href]')).filter(el => el.offsetParent !== null || el.getAttribute('tabindex') === '0');
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

  function calculateTooltipPosition(btnRect, tipW, tipH) {
    const margin = 10, vw = window.innerWidth, vh = window.innerHeight;
    const top = btnRect.top > tipH + margin ? btnRect.top - tipH - margin
              : vh - btnRect.bottom > tipH + margin ? btnRect.bottom + margin
              : Math.max(margin, (vh - tipH) / 2);
    let left = btnRect.left + (btnRect.width - tipW) / 2;
    left = Math.max(margin, Math.min(left, vw - tipW - margin));
    return { top, left };
  }

  // ─────────────────────────────────────────────────────────────
  // § UI Manager
  // ─────────────────────────────────────────────────────────────

  class UIManager {
    constructor() {
      this.host = null; this.shadow = null; this.root = null;
      this.button = null; this.sensor = null; this.tooltip = null; this.menu = null; this.toast = null; this.modal = null;
      this.isProcessing = false; this.isDragging = false; this.dragPointerId = null; this.dragOffset = { x: 0, y: 0 };
      this.menuOpen = false; this.toastTimeoutId = null;
      this._buttonWidth = 0; this._buttonHeight = 0;
      this._focusTrap = null; this._prevBodyOverflow = '';
      this._tm = new TimeoutManager();
      this._autoHideTimeoutId = null; this._isButtonHidden = false; this._isMouseOverButton = false;
      this._tooltipShowTimeoutId = null;
      this._handlers = { docClick: null, docKey: null, themeChange: null, selChange: null };
    }

    init() {
      try {
        this._createHost();
        this.updateTheme();
        if (S.get('showButton')) { this._createButton(); this._createSensor(); this._createTooltip(); this._createMenu(); }
        this._createToast();
        this._bindGlobal();
        this._setupThemeListener();
        this._setupSelectionListener();
        this._setupAutoReinject();
      } catch (e) { console.error('[mdltx] UI init failed:', e); }
    }

    _setupThemeListener() {
      this._handlers.themeChange = () => { if (S.get('theme') === 'auto') this.updateTheme(); };
      try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this._handlers.themeChange); } catch {}
    }

    _setupSelectionListener() {
      this._handlers.selChange = () => { if (this.menuOpen) this._updateMenuSelState(); };
      document.addEventListener('selectionchange', this._handlers.selChange);
    }

    _startAutoHideTimer() {
      if (!S.get('buttonAutoHide')) return;
      this._cancelAutoHideTimer();
      this._autoHideTimeoutId = this._tm.set(() => {
        if (!this._isMouseOverButton && !this.menuOpen && !this.isDragging) this._hideButton();
      }, S.get('buttonAutoHideDelay'));
    }

    _cancelAutoHideTimer() { if (this._autoHideTimeoutId) { this._tm.clear(this._autoHideTimeoutId); this._autoHideTimeoutId = null; } }

    _showButton() {
      if (!this.button || !this._isButtonHidden) return;
      this._isButtonHidden = false;
      this.button.classList.remove('auto-hidden');
      if (this.sensor) this.sensor.style.pointerEvents = 'none';
    }

    _hideButton() {
      if (!this.button || this._isButtonHidden || this.menuOpen || this.isDragging || this._isMouseOverButton) return;
      this._isButtonHidden = true;
      this.button.classList.add('auto-hidden');
      this._updateSensorPosition();
      if (this.sensor) this.sensor.style.pointerEvents = 'auto';
    }

    _onButtonMouseEnter() { this._isMouseOverButton = true; this._cancelAutoHideTimer(); this._showButton(); }
    _onButtonMouseLeave() { this._isMouseOverButton = false; if (S.get('buttonAutoHide') && !this.menuOpen) this._startAutoHideTimer(); }

    _updateSensorPosition() {
      if (!this.sensor || !this.button) return;
      const pos = S.get('buttonPosition'), offX = S.get('buttonOffsetX'), offY = S.get('buttonOffsetY'), btnSize = S.get('buttonSize'), sensorSize = btnSize + 20;
      const s = this.sensor.style;
      s.width = `${sensorSize}px`; s.height = `${sensorSize}px`; s.top = s.bottom = s.left = s.right = '';
      const offset = (btnSize - sensorSize) / 2;
      const safeInsets = { b: 'env(safe-area-inset-bottom,0px)', r: 'env(safe-area-inset-right,0px)', l: 'env(safe-area-inset-left,0px)', t: 'env(safe-area-inset-top,0px)' };
      const positions = {
        'bottom-right': { bottom: `calc(${offY + offset}px + ${safeInsets.b})`, right: `calc(${offX + offset}px + ${safeInsets.r})` },
        'bottom-left': { bottom: `calc(${offY + offset}px + ${safeInsets.b})`, left: `calc(${offX + offset}px + ${safeInsets.l})` },
        'top-right': { top: `calc(${offY + offset}px + ${safeInsets.t})`, right: `calc(${offX + offset}px + ${safeInsets.r})` },
        'top-left': { top: `calc(${offY + offset}px + ${safeInsets.t})`, left: `calc(${offX + offset}px + ${safeInsets.l})` }
      };
      Object.assign(s, positions[pos] || positions['bottom-right']);
    }

    _setupAutoReinject() {
      this._reinjectObserver = new MutationObserver(() => {
        if (this.host && !document.body.contains(this.host)) { console.log('[mdltx] Host removed, reinserting...'); this._reinject(); }
      });
      this._reinjectObserver.observe(document.body, { childList: true });
      this._bodyObserver = new MutationObserver((mutations) => {
        for (const m of mutations) for (const node of m.addedNodes) {
          if (node.tagName === 'BODY' || node === document.body) {
            setTimeout(() => {
              this._reinjectObserver?.disconnect();
              this._reinjectObserver?.observe(document.body, { childList: true });
              if (!document.getElementById('mdltx-ui-host')) { console.log('[mdltx] New body detected, reinserting...'); this._reinject(); }
            }, 100);
          }
        }
      });
      this._bodyObserver.observe(document.documentElement, { childList: true });
    }

    _reinject() {
      this._cancelAutoHideTimer();
      this.host = this.shadow = this.root = this.button = this.sensor = this.tooltip = this.menu = this.toast = null;
      this._isButtonHidden = this._isMouseOverButton = false;
      this._createHost();
      this.updateTheme();
      if (S.get('showButton')) { this._createButton(); this._createSensor(); this._createTooltip(); this._createMenu(); }
      this._createToast();
    }

    _createHost() {
      this.host = document.createElement('div');
      this.host.id = 'mdltx-ui-host';
      this.host.setAttribute('data-mdltx-ui', '1');
      this.shadow = this.host.attachShadow({ mode: 'closed' });
      const style = document.createElement('style'); style.textContent = STYLES;
      this.shadow.appendChild(style);
      this.root = document.createElement('div'); this.root.className = 'mdltx-root';
      this.shadow.appendChild(this.root);
      document.body.appendChild(this.host);
    }

    updateTheme() { if (this.root) this.root.setAttribute('data-theme', getEffectiveTheme()); }

    _createButton() {
      if (this.button) return;
      const size = S.get('buttonSize');
      this.button = createElement('button', { className: 'mdltx-btn', type: 'button', role: 'button', tabindex: '0', 'aria-label': t('copyMd'), 'aria-haspopup': 'menu', 'aria-expanded': 'false' }, [
        createElement('span', { className: 'mdltx-btn-icon' }, [createIcon('markdown')])
      ]);
      this.button.style.setProperty('--mdltx-btn-size', `${size}px`);
      this.button.style.setProperty('--mdltx-btn-opacity', S.get('buttonOpacity'));
      this.button.style.setProperty('--mdltx-btn-hover-opacity', S.get('buttonHoverOpacity'));
      this.button.style.setProperty('--mdltx-btn-hidden-opacity', S.get('buttonHiddenOpacity'));
      this.root.appendChild(this.button);
      this._updateButtonPos();
      this._bindButton();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this.button) { this._buttonWidth = this.button.offsetWidth; this._buttonHeight = this.button.offsetHeight; }
      }));
      if (S.get('buttonAutoHide')) this._startAutoHideTimer();
    }

    _createSensor() {
      if (this.sensor) return;
      this.sensor = createElement('div', { className: 'mdltx-sensor', 'aria-hidden': 'true' });
      this.sensor.style.pointerEvents = 'none';
      this.sensor.addEventListener('mouseenter', () => this._onButtonMouseEnter());
      this.root.appendChild(this.sensor);
      this._updateSensorPosition();
    }

    _createTooltip() {
      if (this.tooltip) return;
      this.tooltip = createElement('div', { className: 'mdltx-tooltip', role: 'tooltip', 'aria-hidden': 'true' });
      this.root.appendChild(this.tooltip);
    }

    _showTooltip() {
      if (!this.tooltip || !this.button || this.menuOpen || this.isDragging || this.isProcessing) return;
      const actionLabel = getClickActionLabel(true);
      let content = t('buttonHint', { action: actionLabel });
      const hotkey = getHotkeyString();
      if (hotkey) content += '\n' + t('buttonHintHotkey', { hotkey });
      this.tooltip.innerHTML = '';
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (i > 0 && hotkey && line.includes(hotkey)) {
          this.tooltip.appendChild(createElement('span', { className: 'mdltx-tooltip-hotkey', textContent: line }));
        } else {
          this.tooltip.appendChild(document.createTextNode(line));
          if (i < lines.length - 1) this.tooltip.appendChild(document.createElement('br'));
        }
      });
      requestAnimationFrame(() => {
        if (!this.button || !this.tooltip) return;
        const btnRect = this.button.getBoundingClientRect(), tipRect = this.tooltip.getBoundingClientRect();
        const pos = calculateTooltipPosition(btnRect, tipRect.width || 200, tipRect.height || 80);
        this.tooltip.style.top = `${pos.top}px`; this.tooltip.style.left = `${pos.left}px`;
        this.tooltip.classList.add('show'); this.tooltip.setAttribute('aria-hidden', 'false');
      });
    }

    _hideTooltip() {
      if (!this.tooltip) return;
      this.tooltip.classList.remove('show'); this.tooltip.setAttribute('aria-hidden', 'true');
      if (this._tooltipShowTimeoutId) { this._tm.clear(this._tooltipShowTimeoutId); this._tooltipShowTimeoutId = null; }
    }

    _updateButtonPos() {
      if (!this.button) return;
      const pos = S.get('buttonPosition'), offX = S.get('buttonOffsetX'), offY = S.get('buttonOffsetY');
      const s = this.button.style; s.top = s.bottom = s.left = s.right = '';
      const safeInsets = { b: 'env(safe-area-inset-bottom,0px)', r: 'env(safe-area-inset-right,0px)', l: 'env(safe-area-inset-left,0px)', t: 'env(safe-area-inset-top,0px)' };
      const positions = {
        'bottom-right': { bottom: `calc(${offY}px + ${safeInsets.b})`, right: `calc(${offX}px + ${safeInsets.r})` },
        'bottom-left': { bottom: `calc(${offY}px + ${safeInsets.b})`, left: `calc(${offX}px + ${safeInsets.l})` },
        'top-right': { top: `calc(${offY}px + ${safeInsets.t})`, right: `calc(${offX}px + ${safeInsets.r})` },
        'top-left': { top: `calc(${offY}px + ${safeInsets.t})`, left: `calc(${offX}px + ${safeInsets.l})` }
      };
      Object.assign(s, positions[pos] || positions['bottom-right']);
      this._updateSensorPosition();
    }

    _createMenu() {
      if (this.menu) return;
      this.menu = createElement('div', { className: 'mdltx-menu', id: 'mdltx-menu', role: 'menu', 'aria-label': t('copyMd'), tabindex: '-1' });
      this._updateMenuContent();
      this.root.appendChild(this.menu);
    }

    _updateMenuContent() {
      if (!this.menu) return;
      const hasSel = hasSelection(), noSelMode = S.get('noSelectionMode');
      this.menu.innerHTML = '';
      const mkItem = (action, icon, text, disabled = false) => {
        const item = createElement('button', { className: 'mdltx-menu-item', role: 'menuitem', type: 'button', tabindex: disabled ? '-1' : '0', dataset: { action } }, [
          createElement('span', { className: 'mdltx-menu-item-icon' }, [createIcon(icon)]),
          createElement('span', { className: 'mdltx-menu-item-text', textContent: text })
        ]);
        if (disabled) item.setAttribute('disabled', '');
        return item;
      };
      const selItem = mkItem('selection', 'selection', t('copySelection'), !hasSel);
      if (!hasSel) selItem.appendChild(createElement('span', { className: 'mdltx-menu-item-hint', textContent: t('noSelection') }));
      const artItem = mkItem('article', 'article', t('copyArticle')); if (noSelMode === 'article') artItem.classList.add('active');
      const pageItem = mkItem('page', 'page', t('copyPage')); if (noSelMode === 'page') pageItem.classList.add('active');
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
      if (hasSel) {
        selItem.removeAttribute('disabled'); selItem.setAttribute('tabindex', '0');
        const h = selItem.querySelector('.mdltx-menu-item-hint'); if (h) h.remove();
      } else {
        selItem.setAttribute('disabled', ''); selItem.setAttribute('tabindex', '-1');
        if (!selItem.querySelector('.mdltx-menu-item-hint')) selItem.appendChild(createElement('span', { className: 'mdltx-menu-item-hint', textContent: t('noSelection') }));
      }
    }

    _getHotkeyHint() { const hotkey = getHotkeyString(); return hotkey ? `${t('currentHotkey')}: ${hotkey}` : ''; }

    _createToast() {
      if (this.toast) return;
      this.toast = createElement('div', { className: 'mdltx-toast', role: 'status', 'aria-live': 'polite' });
      this.root.appendChild(this.toast);
    }

    showMenu() {
      if (!this.button || !this.menu) return;
      this._hideTooltip(); this._cancelAutoHideTimer(); this._updateMenuContent();
      const m = this.menu, b = this.button, s = m.style;
      s.visibility = 'hidden'; s.display = 'block'; m.classList.add('open');
      const mr = m.getBoundingClientRect(), br = b.getBoundingClientRect(), pos = S.get('buttonPosition');
      s.top = s.bottom = s.left = s.right = ''; m.classList.remove('from-bottom');
      if (pos.includes('bottom')) {
        if (br.top < mr.height + 16) { s.top = `${br.bottom + 8}px`; m.classList.add('from-bottom'); }
        else s.bottom = `${window.innerHeight - br.top + 8}px`;
      } else {
        if (window.innerHeight - br.bottom < mr.height + 16) s.bottom = `${window.innerHeight - br.top + 8}px`;
        else { s.top = `${br.bottom + 8}px`; m.classList.add('from-bottom'); }
      }
      if (pos.includes('right')) { if (br.right < mr.width) s.left = `${br.left}px`; else s.right = `${window.innerWidth - br.right}px`; }
      else { if (window.innerWidth - br.left < mr.width) s.right = `${window.innerWidth - br.right}px`; else s.left = `${br.left}px`; }
      s.visibility = ''; s.display = ''; this.menuOpen = true; b.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => { const f = m.querySelector('.mdltx-menu-item:not([disabled])'); if (f) f.focus(); });
    }

    hideMenu(restoreFocus = true) {
      if (this.menu) this.menu.classList.remove('open');
      if (this.button) { this.button.setAttribute('aria-expanded', 'false'); if (restoreFocus) this.button.focus(); }
      this.menuOpen = false;
      if (S.get('buttonAutoHide') && !this._isMouseOverButton) this._startAutoHideTimer();
    }

    showToast(type, title, detail = '', duration = null) {
      if (!this.toast) return;
      if (this.toastTimeoutId !== null) { this._tm.clear(this.toastTimeoutId); this.toastTimeoutId = null; }
      this.toast.classList.remove('show');
      requestAnimationFrame(() => {
        this.toast.innerHTML = ''; this.toast.className = `mdltx-toast ${type}`;
        const icons = { success: 'check', error: 'alertCircle', info: 'info' };
        const closeBtn = createElement('button', { className: 'mdltx-toast-close', type: 'button', 'aria-label': t('close'), tabindex: '0' }, [createIcon('x')]);
        closeBtn.addEventListener('click', () => this.hideToast());
        this.toast.append(
          createElement('span', { className: 'mdltx-toast-icon' }, [createIcon(icons[type] || 'info')]),
          createElement('div', { className: 'mdltx-toast-content' }, [
            createElement('div', { className: 'mdltx-toast-title', textContent: title }),
            ...(detail ? [createElement('div', { className: 'mdltx-toast-detail', textContent: detail })] : [])
          ]),
          closeBtn
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
      const iconEl = this.button.querySelector('.mdltx-btn-icon'); if (!iconEl) return;
      this.button.classList.remove('processing', 'success', 'error'); iconEl.innerHTML = '';
      const states = {
        processing: { cls: 'processing', icon: () => createElement('div', { className: 'mdltx-btn-spinner' }), reset: false },
        success: { cls: 'success', icon: () => createIcon('check'), reset: 1500 },
        downloaded: { cls: 'success', icon: () => createIcon('check'), reset: 1500 },
        error: { cls: 'error', icon: () => createIcon('x'), reset: 2000 }
      };
      const cfg = states[state];
      if (cfg) { this.button.classList.add(cfg.cls); iconEl.appendChild(cfg.icon()); if (cfg.reset) this._tm.set(() => this.setButtonState('default'), cfg.reset); }
      else iconEl.appendChild(createIcon('markdown'));
    }

    showSettings() {
      this.hideMenu(false);
      if (this.modal) { this.modal.remove(); this.modal = null; }
      this._prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const settings = S.getAll(), isAdvanced = settings.settingsMode === 'advanced';

      const mkCheck = (id, label, checked, advanced = false) => {
        const cb = createElement('input', { type: 'checkbox', className: 'mdltx-checkbox', id, tabindex: '0' }); if (checked) cb.checked = true;
        const field = createElement('div', { className: `mdltx-field${advanced ? ' hidden' : ''}` }, [
          createElement('div', { className: 'mdltx-field-row' }, [createElement('label', { className: 'mdltx-label' }, [cb, createElement('span', { className: 'mdltx-label-text', textContent: label })])])
        ]);
        if (advanced) field.setAttribute('data-advanced', '1');
        return field;
      };

      const mkSelect = (id, label, opts, val, advanced = false) => {
        const sel = createElement('select', { className: 'mdltx-select', id, tabindex: '0' });
        for (const o of opts) { const opt = createElement('option', { value: o.value, textContent: o.label }); if (o.value === val) opt.selected = true; sel.appendChild(opt); }
        const field = createElement('div', { className: `mdltx-field${advanced ? ' hidden' : ''}` }, [
          createElement('div', { className: 'mdltx-field-row' }, [createElement('span', { className: 'mdltx-label-text', textContent: label }), sel])
        ]);
        if (advanced) field.setAttribute('data-advanced', '1');
        return field;
      };

      const mkRange = (id, label, val, min, max, step, format = v => `${Math.round(v * 100)}%`, advanced = false) => {
        const field = createElement('div', { className: `mdltx-field${advanced ? ' hidden' : ''}` }, [
          createElement('div', { className: 'mdltx-field-row' }, [
            createElement('span', { className: 'mdltx-label-text', textContent: label }),
            createElement('div', { className: 'mdltx-range-container' }, [
              createElement('input', { type: 'range', className: 'mdltx-range', id, tabindex: '0', min: String(min), max: String(max), step: String(step), value: String(val) }),
              createElement('span', { className: 'mdltx-range-value', id: `${id}-value`, textContent: format(val) })
            ])
          ])
        ]);
        if (advanced) field.setAttribute('data-advanced', '1');
        return field;
      };

      const mkNum = (id, label, val, min, max, step = 1, advanced = false) => {
        const field = createElement('div', { className: `mdltx-field${advanced ? ' hidden' : ''}` }, [
          createElement('div', { className: 'mdltx-field-row' }, [
            createElement('span', { className: 'mdltx-label-text', textContent: label }),
            createElement('div', { className: 'mdltx-input-wrapper' }, [
              createElement('input', { type: 'number', className: 'mdltx-input', id, tabindex: '0', value: String(val), min: String(min), max: String(max), step: String(step) })
            ])
          ])
        ]);
        if (advanced) field.setAttribute('data-advanced', '1');
        return field;
      };

      const mkSection = (title, advanced = false, ...fields) => {
        const section = createElement('div', { className: `mdltx-section${advanced ? ' hidden' : ''}` }, [createElement('div', { className: 'mdltx-section-title', textContent: title }), ...fields]);
        if (advanced) section.setAttribute('data-advanced', '1');
        return section;
      };

      const overlay = createElement('div', { className: 'mdltx-modal-overlay', tabindex: '-1' });
      const modal = createElement('div', { className: 'mdltx-modal', role: 'dialog', 'aria-labelledby': 'mdltx-settings-title', 'aria-modal': 'true' });
      const header = createElement('div', { className: 'mdltx-modal-header' }, [createElement('h2', { className: 'mdltx-modal-title', id: 'mdltx-settings-title', textContent: t('settingsTitle') })]);
      const closeBtn = createElement('button', { className: 'mdltx-modal-close', type: 'button', 'aria-label': t('close'), tabindex: '0' }, [createIcon('x')]);
      header.appendChild(closeBtn);

      const modeToggle = createElement('div', { className: 'mdltx-mode-toggle', role: 'tablist' }, [
        createElement('button', { className: `mdltx-mode-toggle-btn ${!isAdvanced ? 'active' : ''}`, type: 'button', role: 'tab', tabindex: '0', 'aria-selected': !isAdvanced ? 'true' : 'false', dataset: { mode: 'simple' }, textContent: t('settingsModeSimple') }),
        createElement('button', { className: `mdltx-mode-toggle-btn ${isAdvanced ? 'active' : ''}`, type: 'button', role: 'tab', tabindex: '0', 'aria-selected': isAdvanced ? 'true' : 'false', dataset: { mode: 'advanced' }, textContent: t('settingsModeAdvanced') })
      ]);

      const hotkeyField = createElement('div', { className: 'mdltx-field', id: 'hotkey-combo-field', style: { display: settings.hotkeyEnabled ? 'block' : 'none' } });
      const hotkeyDisplay = createElement('div', { className: 'mdltx-hotkey-display', id: 'hotkey-display' });
      if (settings.hotkeyCtrl) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Ctrl' }));
      if (settings.hotkeyAlt) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Alt' }));
      if (settings.hotkeyShift) hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: 'Shift' }));
      hotkeyDisplay.appendChild(createElement('span', { className: 'mdltx-kbd', textContent: settings.hotkeyKey.toUpperCase() }));
      hotkeyField.appendChild(createElement('div', { className: 'mdltx-field-row' }, [
        createElement('span', { className: 'mdltx-label-text', textContent: t('hotkeyCombo') }),
        createElement('div', { className: 'mdltx-hotkey-input' }, [hotkeyDisplay, createElement('button', { className: 'mdltx-hotkey-record-btn', type: 'button', id: 'hotkey-record-btn', tabindex: '0', textContent: t('pressKey') })])
      ]));

      const autoHideCond = createElement('div', { className: `mdltx-conditional ${settings.buttonAutoHide ? '' : 'hidden'}`, id: 'autohide-conditional' });
      autoHideCond.appendChild(mkNum('setting-buttonAutoHideDelay', t('buttonAutoHideDelay'), settings.buttonAutoHideDelay, 300, 10000, 100));
      autoHideCond.appendChild(mkRange('setting-buttonHiddenOpacity', t('buttonHiddenOpacity'), settings.buttonHiddenOpacity, 0, 0.5, 0.05));

      const offscreenCond = createElement('div', { className: `mdltx-conditional ${settings.strictOffscreen ? '' : 'hidden'}`, id: 'offscreen-conditional' });
      offscreenCond.appendChild(mkNum('setting-offscreenMargin', t('offscreenMargin'), settings.offscreenMargin, 0, 500, 10));

      const body = createElement('div', { className: 'mdltx-modal-body' }, [
        modeToggle,
        mkSection(t('generalSettings'), false,
          mkCheck('setting-showButton', t('showButton'), settings.showButton),
          mkSelect('setting-buttonPosition', t('buttonPosition'), [{ value: 'bottom-right', label: t('bottomRight') }, { value: 'bottom-left', label: t('bottomLeft') }, { value: 'top-right', label: t('topRight') }, { value: 'top-left', label: t('topLeft') }], settings.buttonPosition),
          mkRange('setting-buttonSize', t('buttonSize'), settings.buttonSize, 28, 64, 2, v => `${v}px`),
          mkRange('setting-buttonOpacity', t('buttonOpacity'), settings.buttonOpacity, 0.3, 1, 0.05),
          mkRange('setting-buttonHoverOpacity', t('buttonHoverOpacity'), settings.buttonHoverOpacity, 0.5, 1, 0.05, v => `${Math.round(v * 100)}%`, true),
          mkCheck('setting-buttonAutoHide', t('buttonAutoHide'), settings.buttonAutoHide),
          autoHideCond,
          mkSelect('setting-buttonClickAction', t('buttonClickAction'), [{ value: 'auto', label: t('clickActionAuto') }, { value: 'selection', label: t('clickActionSelection') }, { value: 'article', label: t('clickActionArticle') }, { value: 'page', label: t('clickActionPage') }, { value: 'download', label: t('clickActionDownload') }], settings.buttonClickAction),
          mkSelect('setting-theme', t('theme'), [{ value: 'auto', label: t('themeAuto') }, { value: 'light', label: t('themeLight') }, { value: 'dark', label: t('themeDark') }], settings.theme),
          mkSelect('setting-language', t('language'), [{ value: 'auto', label: t('langAuto') }, { value: 'zh-TW', label: '繁體中文' }, { value: 'zh-CN', label: '简体中文' }, { value: 'en', label: 'English' }], settings.language)
        ),
        mkSection(t('hotkeySettings'), false, mkCheck('setting-hotkeyEnabled', t('enableHotkey'), settings.hotkeyEnabled), hotkeyField),
        mkSection(t('conversionSettings'), false,
          mkSelect('setting-noSelectionMode', t('noSelectionMode'), [{ value: 'page', label: t('modePage') }, { value: 'article', label: t('modeArticle') }], settings.noSelectionMode),
          mkCheck('setting-absoluteUrls', t('absoluteUrls'), settings.absoluteUrls),
          mkCheck('setting-ignoreNav', t('ignoreNav'), settings.ignoreNav, true),
          mkCheck('setting-waitMathJax', t('waitMathJax'), settings.waitMathJax),
          mkCheck('setting-stripIndent', t('stripIndent'), settings.stripCommonIndentInBlockMath, true),
          mkCheck('setting-escapeMarkdownChars', t('escapeMarkdownChars'), settings.escapeMarkdownChars, true),
          mkCheck('setting-extractShadowDOM', t('extractShadowDOM'), settings.extractShadowDOM, true),
          mkCheck('setting-extractIframes', t('extractIframes'), settings.extractIframes, true)
        ),
        mkSection(t('markdownFormat'), true,
          mkSelect('setting-listMarker', t('listMarker'), [{ value: '-', label: '- (dash)' }, { value: '*', label: '* (asterisk)' }, { value: '+', label: '+ (plus)' }], settings.listMarker),
          mkSelect('setting-emphasisMarker', t('emphasisMarker'), [{ value: '*', label: '*text*' }, { value: '_', label: '_text_' }], settings.emphasisMarker),
          mkSelect('setting-strongMarker', t('strongMarker'), [{ value: '**', label: '**text**' }, { value: '__', label: '__text__' }], settings.strongMarker),
          mkSelect('setting-horizontalRule', t('horizontalRule'), [{ value: '---', label: '---' }, { value: '***', label: '***' }, { value: '___', label: '___' }], settings.horizontalRule)
        ),
        mkSection(t('codeBlockSettings'), true,
          (() => { const f = mkCheck('setting-enableContentBasedLangDetection', t('enableContentBasedLangDetection'), settings.enableContentBasedLangDetection, true); f.querySelector('label')?.setAttribute('title', t('enableContentBasedLangDetectionTooltip')); return f; })(),
          (() => { const f = mkCheck('setting-lmArenaEnhancedDetection', t('lmArenaEnhancedDetection'), settings.lmArenaEnhancedDetection, true); f.querySelector('label')?.setAttribute('title', t('lmArenaEnhancedDetectionTooltip')); return f; })(),
          (() => { const f = mkCheck('setting-aiChatPlatformDetection', t('aiChatPlatformDetection'), settings.aiChatPlatformDetection, true); f.querySelector('label')?.setAttribute('title', t('aiChatPlatformDetectionTooltip')); return f; })()
        ),
        mkSection(t('captureSettings'), true,
          mkNum('setting-waitBeforeCaptureMs', t('waitBeforeCapture'), settings.waitBeforeCaptureMs, 0, 30000, 100),
          mkNum('setting-waitDomIdleMs', t('waitDomIdle'), settings.waitDomIdleMs, 0, 5000, 100)
        ),
        mkSection(t('formatSettings'), true,
          mkSelect('setting-strongEmBlockStrategy', t('strongEmBlockStrategy'), [{ value: 'split', label: t('strategySplit') }, { value: 'html', label: t('strategyHtml') }, { value: 'strip', label: t('strategyStrip') }], settings.strongEmBlockStrategy),
          mkSelect('setting-complexTableStrategy', t('complexTableStrategy'), [{ value: 'list', label: t('strategyList') }, { value: 'html', label: t('strategyTableHtml') }], settings.complexTableStrategy),
          mkSelect('setting-detailsStrategy', t('detailsStrategy'), [{ value: 'preserve', label: t('detailsPreserve') }, { value: 'strict-visual', label: t('detailsStrictVisual') }], settings.detailsStrategy),
          mkCheck('setting-mergeAdjacentCodeSpans', t('mergeAdjacentCodeSpans'), settings.mergeAdjacentCodeSpans)
        ),
        mkSection(t('visibilitySettings'), true,
          mkSelect('setting-visibilityMode', t('visibilityMode'), [{ value: 'loose', label: t('visibilityLoose') }, { value: 'strict', label: t('visibilityStrict') }, { value: 'dom', label: t('visibilityDom') }], settings.visibilityMode),
          mkCheck('setting-strictOffscreen', t('strictOffscreen'), settings.strictOffscreen),
          offscreenCond
        ),
        mkSection(t('advancedSettings'), true,
          mkNum('setting-articleMinChars', t('articleMinChars'), settings.articleMinChars, 100, 10000, 50),
          mkNum('setting-articleMinRatio', t('articleMinRatio'), settings.articleMinRatio, 0.1, 1, 0.05),
          mkNum('setting-toastDuration', t('toastDuration'), settings.toastDuration, 500, 10000, 100)
        )
      ]);

      const footer = createElement('div', { className: 'mdltx-modal-footer' }, [
        createElement('div', { className: 'mdltx-modal-footer-left' }, [createElement('button', { className: 'mdltx-btn-danger', type: 'button', id: 'settings-reset', tabindex: '0', textContent: t('resetSettings') })]),
        createElement('span', { className: 'mdltx-modal-footer-hint', textContent: t('settingsHint') }),
        createElement('div', { className: 'mdltx-modal-footer-right' }, [
          createElement('button', { className: 'mdltx-btn-secondary', type: 'button', id: 'settings-cancel', tabindex: '0', textContent: t('cancel') }),
          createElement('button', { className: 'mdltx-btn-primary', type: 'button', id: 'settings-save', tabindex: '0', textContent: t('saveSettings') })
        ])
      ]);

      modal.append(header, body, footer);
      overlay.appendChild(modal);
      this.root.appendChild(overlay);
      this.modal = overlay;
      this._focusTrap = new FocusTrap(modal);
      void overlay.offsetHeight;
      overlay.classList.add('open');
      this._focusTrap.activate();
      this._bindSettings(overlay, settings);
      this._updateSettingsVisibility(isAdvanced);
    }

    _updateSettingsVisibility(isAdvanced) {
      if (!this.modal) return;
      this.modal.querySelectorAll('[data-advanced="1"]').forEach(el => el.classList.toggle('hidden', !isAdvanced));
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
      const origOpacity = originalSettings.buttonOpacity, origSize = originalSettings.buttonSize, origTheme = getEffectiveTheme();
      let tempHotkey = { ctrl: originalSettings.hotkeyCtrl, alt: originalSettings.hotkeyAlt, shift: originalSettings.hotkeyShift, key: originalSettings.hotkeyKey };
      let currentMode = originalSettings.settingsMode;
      const gv = id => overlay.querySelector(`#${id}`);

      const stopRec = () => {
        if (!recording) return; recording = false;
        const btn = gv('hotkey-record-btn'); if (btn) { btn.classList.remove('recording'); btn.textContent = t('pressKey'); }
        if (hotkeyHandler) { document.removeEventListener('keydown', hotkeyHandler, true); hotkeyHandler = null; }
      };

      const restorePreview = () => {
        if (this.button) { this.button.style.setProperty('--mdltx-btn-opacity', origOpacity); this.button.style.setProperty('--mdltx-btn-size', `${origSize}px`); }
        if (this.root) this.root.setAttribute('data-theme', origTheme);
      };

      const close = (restore = true) => { stopRec(); if (restore) restorePreview(); this.closeSettings(); };

      const saveSettings = () => {
        stopRec();
        const valNum = (v, min, max, def) => { const n = parseFloat(v); return isNaN(n) ? def : Math.max(min, Math.min(max, n)); };
        const vals = {
          showButton: gv('setting-showButton')?.checked,
          buttonPosition: gv('setting-buttonPosition')?.value,
          buttonSize: valNum(gv('setting-buttonSize')?.value, 28, 64, 42),
          buttonOpacity: valNum(gv('setting-buttonOpacity')?.value, 0.3, 1, 0.85),
          buttonHoverOpacity: valNum(gv('setting-buttonHoverOpacity')?.value, 0.5, 1, 1),
          buttonAutoHide: gv('setting-buttonAutoHide')?.checked,
          buttonAutoHideDelay: valNum(gv('setting-buttonAutoHideDelay')?.value, 300, 10000, 1500),
          buttonHiddenOpacity: valNum(gv('setting-buttonHiddenOpacity')?.value, 0, 0.5, 0),
          buttonClickAction: gv('setting-buttonClickAction')?.value,
          theme: gv('setting-theme')?.value, language: gv('setting-language')?.value,
          hotkeyEnabled: gv('setting-hotkeyEnabled')?.checked,
          hotkeyCtrl: tempHotkey.ctrl, hotkeyAlt: tempHotkey.alt, hotkeyShift: tempHotkey.shift, hotkeyKey: tempHotkey.key,
          noSelectionMode: gv('setting-noSelectionMode')?.value,
          absoluteUrls: gv('setting-absoluteUrls')?.checked, ignoreNav: gv('setting-ignoreNav')?.checked,
          waitMathJax: gv('setting-waitMathJax')?.checked, stripCommonIndentInBlockMath: gv('setting-stripIndent')?.checked,
          escapeMarkdownChars: gv('setting-escapeMarkdownChars')?.checked,
          extractShadowDOM: gv('setting-extractShadowDOM')?.checked, extractIframes: gv('setting-extractIframes')?.checked,
          listMarker: gv('setting-listMarker')?.value, emphasisMarker: gv('setting-emphasisMarker')?.value,
          strongMarker: gv('setting-strongMarker')?.value, horizontalRule: gv('setting-horizontalRule')?.value,
          waitBeforeCaptureMs: valNum(gv('setting-waitBeforeCaptureMs')?.value, 0, 30000, 0),
          waitDomIdleMs: valNum(gv('setting-waitDomIdleMs')?.value, 0, 5000, 0),
          visibilityMode: gv('setting-visibilityMode')?.value,
          strictOffscreen: gv('setting-strictOffscreen')?.checked,
          offscreenMargin: valNum(gv('setting-offscreenMargin')?.value, 0, 500, 100),
          articleMinChars: valNum(gv('setting-articleMinChars')?.value, 100, 10000, 600),
          articleMinRatio: valNum(gv('setting-articleMinRatio')?.value, 0.1, 1, 0.55),
          toastDuration: valNum(gv('setting-toastDuration')?.value, 500, 10000, 2500),
          strongEmBlockStrategy: gv('setting-strongEmBlockStrategy')?.value,
          complexTableStrategy: gv('setting-complexTableStrategy')?.value,
          detailsStrategy: gv('setting-detailsStrategy')?.value,
          mergeAdjacentCodeSpans: gv('setting-mergeAdjacentCodeSpans')?.checked,
          enableContentBasedLangDetection: gv('setting-enableContentBasedLangDetection')?.checked,
          lmArenaEnhancedDetection: gv('setting-lmArenaEnhancedDetection')?.checked,
          aiChatPlatformDetection: gv('setting-aiChatPlatformDetection')?.checked,
          settingsMode: currentMode,
        };
        for (const [k, v] of Object.entries(vals)) if (v !== undefined) S.set(k, v);
        close(false); this.refresh(); this.showToast('success', t('toastSuccess'), t('settingsSaved'));
      };

      overlay.querySelector('.mdltx-modal-close')?.addEventListener('click', () => close(true));
      gv('settings-cancel')?.addEventListener('click', () => close(true));
      overlay.addEventListener('click', e => { if (e.target === overlay) close(true); });

      overlay.querySelector('.mdltx-modal')?.addEventListener('keydown', e => {
        if (recording) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
        else if (e.key === 'Enter') {
          const t = e.target, isInput = t.tagName === 'INPUT' && t.type !== 'checkbox', isBtn = t.tagName === 'BUTTON', isSel = t.tagName === 'SELECT';
          if (!isInput && !isBtn && !isSel) { e.preventDefault(); e.stopPropagation(); saveSettings(); }
        }
      });

      overlay.querySelectorAll('.mdltx-mode-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode; currentMode = mode;
          overlay.querySelectorAll('.mdltx-mode-toggle-btn').forEach(b => { const active = b.dataset.mode === mode; b.classList.toggle('active', active); b.setAttribute('aria-selected', active ? 'true' : 'false'); });
          this._updateSettingsVisibility(mode === 'advanced');
        });
      });

      const bindRangePreview = (id, valueFn, onUpdate) => {
        const slider = gv(id), valEl = gv(`${id}-value`);
        if (slider && valEl) slider.addEventListener('input', () => { const v = parseFloat(slider.value); valEl.textContent = valueFn ? valueFn(v) : `${Math.round(v * 100)}%`; if (onUpdate) onUpdate(v); });
      };
      bindRangePreview('setting-buttonOpacity', v => `${Math.round(v * 100)}%`, v => { if (this.button) this.button.style.setProperty('--mdltx-btn-opacity', v); });
      bindRangePreview('setting-buttonHoverOpacity', v => `${Math.round(v * 100)}%`);
      bindRangePreview('setting-buttonHiddenOpacity', v => `${Math.round(v * 100)}%`);
      bindRangePreview('setting-buttonSize', v => `${v}px`, v => { if (this.button) this.button.style.setProperty('--mdltx-btn-size', `${v}px`); });

      const themeSelect = gv('setting-theme');
      if (themeSelect) themeSelect.addEventListener('change', () => { this.root.setAttribute('data-theme', themeSelect.value === 'auto' ? getEffectiveTheme() : themeSelect.value); });

      const setupNumVal = (id, min, max) => {
        const inp = gv(id); if (!inp) return;
        inp.addEventListener('input', () => { const v = parseFloat(inp.value); inp.classList.remove('valid', 'invalid'); if (inp.value !== '') inp.classList.add(!isNaN(v) && v >= min && v <= max ? 'valid' : 'invalid'); });
        inp.addEventListener('blur', () => { const v = parseFloat(inp.value); inp.value = isNaN(v) ? min : Math.max(min, Math.min(max, v)); inp.classList.remove('valid', 'invalid'); });
      };
      setupNumVal('setting-articleMinChars', 100, 10000); setupNumVal('setting-articleMinRatio', 0.1, 1); setupNumVal('setting-toastDuration', 500, 10000);
      setupNumVal('setting-waitBeforeCaptureMs', 0, 30000); setupNumVal('setting-waitDomIdleMs', 0, 5000);
      setupNumVal('setting-offscreenMargin', 0, 500); setupNumVal('setting-buttonAutoHideDelay', 300, 10000);

      const strictCb = gv('setting-strictOffscreen'), offCond = gv('offscreen-conditional');
      if (strictCb && offCond) strictCb.addEventListener('change', () => offCond.classList.toggle('hidden', !strictCb.checked));
      const autoHideCb = gv('setting-buttonAutoHide'), autoHideCond = gv('autohide-conditional');
      if (autoHideCb && autoHideCond) autoHideCb.addEventListener('change', () => autoHideCond.classList.toggle('hidden', !autoHideCb.checked));

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
        recordBtn.addEventListener('click', () => {
          if (recording) { stopRec(); return; }
          recording = true; recordBtn.classList.add('recording'); recordBtn.textContent = '...';
          hotkeyHandler = e => {
            if (!recording || ignoredKeys.has(e.key)) return;
            e.preventDefault(); e.stopPropagation();
            tempHotkey = { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, key: e.key.toLowerCase() };
            updateHotkeyDisp(); stopRec();
          };
          document.addEventListener('keydown', hotkeyHandler, true);
        });
      }

      const hotkeyEnabled = gv('setting-hotkeyEnabled'), hotkeyField = gv('hotkey-combo-field');
      if (hotkeyEnabled && hotkeyField) hotkeyEnabled.addEventListener('change', () => { hotkeyField.style.display = hotkeyEnabled.checked ? 'block' : 'none'; if (!hotkeyEnabled.checked) stopRec(); });

      gv('settings-reset')?.addEventListener('click', () => { if (confirm(t('confirmReset'))) { S.resetAll(); close(false); this.refresh(); this.showToast('success', t('toastSuccess'), t('settingsResetDone')); } });
      gv('settings-save')?.addEventListener('click', saveSettings);
    }

    _bindButton() {
      if (!this.button) return;
      this.button.addEventListener('mouseenter', () => { this._onButtonMouseEnter(); if (this._tooltipShowTimeoutId) this._tm.clear(this._tooltipShowTimeoutId); this._tooltipShowTimeoutId = this._tm.set(() => this._showTooltip(), 400); });
      this.button.addEventListener('mouseleave', () => { this._onButtonMouseLeave(); this._hideTooltip(); });
      this.button.addEventListener('click', async e => {
        if (this.isDragging || this.isProcessing) return;
        e.stopPropagation(); this._hideTooltip();
        if (this.menuOpen) { this.hideMenu(); return; }
        const action = S.get('buttonClickAction');
        switch (action) {
          case 'selection': await this.handleCopy('selection'); break;
          case 'article': await this.handleCopy('article'); break;
          case 'page': await this.handleCopy('page'); break;
          case 'download': await this.handleDownload(); break;
          default: await this.handleCopy(hasSelection() ? 'selection' : decideModeNoSelection()); break;
        }
      });
      this.button.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation(); this._hideTooltip(); if (this.isDragging || this.isProcessing) return; this.menuOpen ? this.hideMenu() : this.showMenu(); });
      this.button.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.button.click(); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!this.menuOpen) this.showMenu(); }
        else if (e.key === 'Escape' && this.menuOpen) { e.preventDefault(); this.hideMenu(); }
      });
      this.button.addEventListener('focus', () => { this._onButtonMouseEnter(); this._tooltipShowTimeoutId = this._tm.set(() => this._showTooltip(), 300); });
      this.button.addEventListener('blur', () => { this._hideTooltip(); if (!this._isMouseOverButton && S.get('buttonAutoHide')) this._startAutoHideTimer(); });

      this.button.addEventListener('pointerdown', e => {
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
          this._hideTooltip(); this._cancelAutoHideTimer(); if (this.menuOpen) this.hideMenu(false);
          const x = ev.clientX - this.dragOffset.x, y = ev.clientY - this.dragOffset.y;
          const pos = (y < window.innerHeight / 2 ? 'top' : 'bottom') + '-' + (x < window.innerWidth / 2 ? 'left' : 'right');
          const btnW = this._buttonWidth || this.button.offsetWidth || 42, btnH = this._buttonHeight || this.button.offsetHeight || 42;
          let offX = pos.includes('right') ? window.innerWidth - x - btnW : x, offY = pos.includes('bottom') ? window.innerHeight - y - btnH : y;
          offX = Math.max(8, Math.min(offX, window.innerWidth - btnW - 8)); offY = Math.max(8, Math.min(offY, window.innerHeight - btnH - 8));
          S.set('buttonPosition', pos); S.set('buttonOffsetX', Math.round(offX)); S.set('buttonOffsetY', Math.round(offY));
          this._updateButtonPos();
        };
        const onUp = ev => {
          if (ev.pointerId !== this.dragPointerId) return;
          try { this.button.releasePointerCapture(ev.pointerId); } catch {}
          this.dragPointerId = null;
          this.button.removeEventListener('pointermove', onMove); this.button.removeEventListener('pointerup', onUp); this.button.removeEventListener('pointercancel', onUp);
          this.button.classList.remove('dragging');
          if (moved) this._tm.set(() => { this.isDragging = false; }, 50);
          else this.isDragging = false;
        };
        this.button.addEventListener('pointermove', onMove); this.button.addEventListener('pointerup', onUp); this.button.addEventListener('pointercancel', onUp);
      });
    }

    _bindMenu() {
      if (!this.menu) return;
      this.menu.querySelectorAll('.mdltx-menu-item').forEach(item => {
        item.addEventListener('click', async e => {
          if (item.hasAttribute('disabled')) { e.preventDefault(); return; }
          const action = item.dataset.action; this.hideMenu();
          if (action === 'settings') this.showSettings();
          else if (action === 'download') await this.handleDownload();
          else if (action) await this.handleCopy(action);
        });
        item.addEventListener('keydown', async e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); } });
      });
      this.menu.addEventListener('keydown', e => {
        const items = Array.from(this.menu.querySelectorAll('.mdltx-menu-item:not([disabled])')), len = items.length; if (!len) return;
        const curIdx = items.indexOf(this.shadow?.activeElement);
        const nav = { ArrowDown: (curIdx + 1) % len, ArrowUp: (curIdx - 1 + len) % len, Home: 0, End: len - 1 };
        if (e.key in nav) { e.preventDefault(); items[nav[e.key]]?.focus(); }
        else if (e.key === 'Escape') { e.preventDefault(); this.hideMenu(); }
        else if (e.key === 'Tab') { e.preventDefault(); items[(e.shiftKey ? (curIdx - 1 + len) % len : (curIdx + 1) % len)]?.focus(); }
      });
    }

    _bindGlobal() {
      if (this._handlers.docClick) document.removeEventListener('click', this._handlers.docClick);
      if (this._handlers.docKey) document.removeEventListener('keydown', this._handlers.docKey);
      this._handlers.docClick = e => { if (!this.menuOpen) return; const path = e.composedPath?.() || [e.target]; if (!path.includes(this.host) && !this.host?.contains(e.target)) this.hideMenu(); };
      this._handlers.docKey = e => { if (e.key === 'Escape' && this.menuOpen && !this.modal) { e.preventDefault(); this.hideMenu(); } };
      document.addEventListener('click', this._handlers.docClick);
      document.addEventListener('keydown', this._handlers.docKey);
    }

    refresh() {
      this._cancelAutoHideTimer();
      if (this.button) { this.button.remove(); this.button = null; }
      if (this.sensor) { this.sensor.remove(); this.sensor = null; }
      if (this.tooltip) { this.tooltip.remove(); this.tooltip = null; }
      if (this.menu) { this.menu.remove(); this.menu = null; }
      this._isButtonHidden = this._isMouseOverButton = false;
      this.updateTheme();
      if (S.get('showButton')) { this._createButton(); this._createSensor(); this._createTooltip(); this._createMenu(); }
      if (this.menu) this._updateMenuContent();
    }

    async handleCopy(mode) {
      if (this.isProcessing) return; this.isProcessing = true; this.setButtonState('processing');
      try {
        const result = await copyMarkdown(mode); this.setButtonState('success');
        const labels = { selection: t('modeSelection'), article: t('modeArticleLabel'), page: t('modePageLabel') };
        this.showToast('success', t('toastSuccess'), t('toastSuccessDetail', { mode: labels[result.actualMode] || result.actualMode, count: result.length }));
      } catch (e) { console.error('[mdltx] error:', e); this.setButtonState('error'); this.showToast('error', t('toastError'), t('toastErrorDetail', { error: e?.message || String(e) })); }
      finally { this.isProcessing = false; }
    }

    async handleDownload() {
      if (this.isProcessing) return; this.isProcessing = true; this.setButtonState('processing');
      try {
        const mode = hasSelection() ? 'selection' : decideModeNoSelection();
        const result = await generateMarkdown(mode), filename = generateFilename();
        downloadAsFile(result.markdown, filename); this.setButtonState('downloaded');
        this.showToast('success', t('toastDownloadSuccess'), t('toastDownloadDetail', { filename, count: result.length }));
      } catch (e) { console.error('[mdltx] download error:', e); this.setButtonState('error'); this.showToast('error', t('toastError'), t('toastErrorDetail', { error: e?.message || String(e) })); }
      finally { this.isProcessing = false; }
    }

    destroy() {
      this._cancelAutoHideTimer();
      if (this._handlers.docClick) { document.removeEventListener('click', this._handlers.docClick); this._handlers.docClick = null; }
      if (this._handlers.docKey) { document.removeEventListener('keydown', this._handlers.docKey); this._handlers.docKey = null; }
      if (this._handlers.selChange) { document.removeEventListener('selectionchange', this._handlers.selChange); this._handlers.selChange = null; }
      if (this._handlers.themeChange) { try { window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this._handlers.themeChange); } catch {} this._handlers.themeChange = null; }
      if (this._focusTrap) { this._focusTrap.deactivate(); this._focusTrap = null; }
      if (this._tooltipShowTimeoutId) { this._tm.clear(this._tooltipShowTimeoutId); this._tooltipShowTimeoutId = null; }
      this._tm.clearAll();
      if (this._reinjectObserver) { this._reinjectObserver.disconnect(); this._reinjectObserver = null; }
      if (this._bodyObserver) { this._bodyObserver.disconnect(); this._bodyObserver = null; }
      if (this._prevBodyOverflow !== undefined) document.body.style.overflow = this._prevBodyOverflow;
      if (this.host) { this.host.remove(); this.host = null; }
      this.shadow = this.root = this.button = this.sensor = this.tooltip = this.menu = this.toast = this.modal = null;
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

  const KNOWN_LANGUAGES = new Set([
    'python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'perl', 'lua', 'r', 'matlab', 'julia',
    'html', 'css', 'scss', 'sass', 'less', 'stylus', 'json', 'xml', 'yaml', 'toml', 'ini', 'jsx', 'tsx', 'vue', 'svelte', 'astro',
    'bash', 'shell', 'sh', 'zsh', 'fish', 'powershell', 'batch', 'cmd',
    'sql', 'mysql', 'postgresql', 'sqlite', 'plsql', 'tsql', 'nosql', 'mongodb', 'graphql', 'prisma',
    'markdown', 'latex', 'tex', 'restructuredtext', 'asciidoc', 'org',
    'dockerfile', 'docker', 'makefile', 'cmake', 'nginx', 'apache', 'terraform', 'ansible', 'kubernetes', 'k8s', 'helm',
    'assembly', 'nasm', 'masm', 'wasm', 'wat', 'zig', 'nim', 'crystal', 'vlang', 'd', 'ada', 'fortran', 'cobol', 'pascal', 'delphi',
    'haskell', 'clojure', 'fsharp', 'ocaml', 'erlang', 'elixir', 'scheme', 'lisp', 'racket', 'elm', 'purescript',
    'dart', 'flutter', 'objectivec', 'groovy',
    'diff', 'patch', 'log', 'plaintext', 'text', 'plain', 'raw', 'console', 'output',
    'csv', 'tsv', 'ndjson', 'jsonl', 'protobuf', 'thrift', 'avro',
    'solidity', 'vyper', 'move', 'cairo', 'wgsl', 'glsl', 'hlsl', 'cuda',
    'sparql', 'cypher', 'gremlin', 'xpath', 'xquery',
    'hocon', 'dhall', 'jsonnet', 'cue', 'pkl', 'kdl',
    'handlebars', 'mustache', 'jinja', 'jinja2', 'twig', 'ejs', 'pug', 'jade', 'haml', 'slim',
    'coffeescript', 'livescript', 'reason', 'rescript', 'grain', 'moonscript', 'fennel',
    'verilog', 'vhdl', 'systemverilog',
    'applescript', 'autohotkey', 'ahk', 'autoit',
    'tcl', 'awk', 'sed', 'vim', 'viml', 'vimscript',
    'nix', 'starlark', 'bazel', 'buck',
  ]);

  const LANGUAGE_ALIASES = {
    js: 'javascript', mjs: 'javascript', cjs: 'javascript', node: 'javascript', nodejs: 'javascript',
    ts: 'typescript', mts: 'typescript', cts: 'typescript',
    py: 'python', py3: 'python', python3: 'python', ipython: 'python', jupyter: 'python',
    rb: 'ruby', rake: 'ruby', gemfile: 'ruby', podfile: 'ruby',
    'c++': 'cpp', cxx: 'cpp', cc: 'cpp', hpp: 'cpp', hxx: 'cpp', hh: 'cpp', 'h++': 'cpp',
    h: 'c', 'c#': 'csharp', cs: 'csharp', csx: 'csharp', dotnet: 'csharp',
    'm': 'objectivec', mm: 'objectivec', 'objective-c': 'objectivec', objc: 'objectivec',
    sh: 'bash', zsh: 'bash', ksh: 'bash', csh: 'bash', tcsh: 'bash', bashrc: 'bash', zshrc: 'bash',
    ps1: 'powershell', psm1: 'powershell', psd1: 'powershell', pwsh: 'powershell',
    bat: 'batch', cmd: 'batch',
    htm: 'html', xhtml: 'html', shtml: 'html', css3: 'css',
    md: 'markdown', mdown: 'markdown', mkd: 'markdown', mkdown: 'markdown', mdx: 'markdown', rmd: 'markdown',
    yml: 'yaml',
    tex: 'latex', ltx: 'latex', sty: 'latex', cls: 'latex', bib: 'bibtex', bibtex: 'bibtex',
    rst: 'restructuredtext', rest: 'restructuredtext',
    adoc: 'asciidoc', asc: 'asciidoc',
    jsonc: 'json', json5: 'json', jsonl: 'json', ndjson: 'json', geojson: 'json',
    pgsql: 'postgresql', postgres: 'postgresql',
    mssql: 'tsql', 't-sql': 'tsql', 'pl/sql': 'plsql',
    dockerfile: 'dockerfile', docker: 'dockerfile', containerfile: 'dockerfile',
    makefile: 'makefile', make: 'makefile', mak: 'makefile', mk: 'makefile', gnumakefile: 'makefile',
    tf: 'terraform', hcl: 'terraform',
    hs: 'haskell', lhs: 'haskell',
    clj: 'clojure', cljs: 'clojure', cljc: 'clojure', edn: 'clojure',
    'f#': 'fsharp', fs: 'fsharp', fsx: 'fsharp', fsi: 'fsharp',
    ml: 'ocaml', mli: 'ocaml',
    ex: 'elixir', exs: 'elixir', eex: 'elixir', heex: 'elixir', leex: 'elixir',
    erl: 'erlang', hrl: 'erlang',
    scm: 'scheme', ss: 'scheme', rkt: 'racket',
    cl: 'lisp', el: 'lisp', elisp: 'lisp', 'emacs-lisp': 'lisp', 'common-lisp': 'lisp',
    rs: 'rust', kt: 'kotlin', kts: 'kotlin', jl: 'julia',
    asm: 'assembly', s: 'assembly', v: 'vlang', sol: 'solidity',
    text: 'text', txt: 'text', plaintext: 'text', plain: 'text', raw: 'text',
    log: 'log', logs: 'log',
    console: 'console', terminal: 'console', term: 'console', output: 'output', stdout: 'output',
    diff: 'diff', patch: 'diff', csv: 'csv', tsv: 'tsv',
    vue: 'vue', svelte: 'svelte', astro: 'astro',
    hbs: 'handlebars', j2: 'jinja2', jinja: 'jinja2',
    vim: 'vim', vimrc: 'vim', nvim: 'vim',
    conf: 'ini', config: 'ini', cfg: 'ini', env: 'ini', properties: 'ini',
    '': '', none: '', nolang: '', unknown: '',
  };

  const AI_CHAT_PLATFORM_HOSTS = new Set([
    'claude.ai', 'grok.com', 'lmarena.ai', 'chat.openai.com', 'chatgpt.com', 'copilot.microsoft.com',
    'gemini.google.com', 'bard.google.com', 'poe.com', 'character.ai', 'you.com', 'perplexity.ai',
    'phind.com', 'huggingface.co', 'deepseek.com', 'chat.deepseek.com', 'kimi.moonshot.cn',
    'tongyi.aliyun.com', 'chat.mistral.ai', 'pi.ai', 'cohere.com', 'coral.cohere.com',
  ]);

  const MATHML_OP_MAP = {
    '±': '\\pm', '∓': '\\mp', '×': '\\times', '÷': '\\div', '·': '\\cdot', '•': '\\bullet',
    '≤': '\\le', '≥': '\\ge', '≠': '\\ne', '≈': '\\approx', '≡': '\\equiv', '≪': '\\ll', '≫': '\\gg', '≺': '\\prec', '≻': '\\succ', '≼': '\\preceq', '≽': '\\succeq', '≲': '\\lesssim', '≳': '\\gtrsim', '≶': '\\lessgtr', '≷': '\\gtrless',
    'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta', 'ε': '\\epsilon', 'ζ': '\\zeta', 'η': '\\eta', 'θ': '\\theta', 'ι': '\\iota', 'κ': '\\kappa', 'λ': '\\lambda', 'μ': '\\mu', 'ν': '\\nu', 'ξ': '\\xi', 'π': '\\pi', 'ρ': '\\rho', 'σ': '\\sigma', 'τ': '\\tau', 'υ': '\\upsilon', 'φ': '\\phi', 'χ': '\\chi', 'ψ': '\\psi', 'ω': '\\omega', 'ϵ': '\\varepsilon', 'ϑ': '\\vartheta', 'ϕ': '\\varphi', 'ϱ': '\\varrho', 'ς': '\\varsigma', 'ϖ': '\\varpi', 'ϰ': '\\varkappa', 'ϝ': '\\digamma',
    'Γ': '\\Gamma', 'Δ': '\\Delta', 'Θ': '\\Theta', 'Λ': '\\Lambda', 'Ξ': '\\Xi', 'Π': '\\Pi', 'Σ': '\\Sigma', 'Υ': '\\Upsilon', 'Φ': '\\Phi', 'Ψ': '\\Psi', 'Ω': '\\Omega',
    '∈': '\\in', '∉': '\\notin', '∋': '\\ni', '⊂': '\\subset', '⊃': '\\supset', '⊆': '\\subseteq', '⊇': '\\supseteq', '⊊': '\\subsetneq', '⊋': '\\supsetneq', '∪': '\\cup', '∩': '\\cap', '⊔': '\\sqcup', '⊓': '\\sqcap', '∧': '\\land', '∨': '\\lor', '¬': '\\neg', '⊕': '\\oplus', '⊗': '\\otimes', '⊖': '\\ominus', '⊘': '\\oslash', '⊙': '\\odot', '∅': '\\emptyset', '∀': '\\forall', '∃': '\\exists', '∄': '\\nexists', '⊢': '\\vdash', '⊣': '\\dashv', '⊨': '\\models', '⊩': '\\Vdash',
    '→': '\\to', '←': '\\leftarrow', '↔': '\\leftrightarrow', '⇒': '\\Rightarrow', '⇐': '\\Leftarrow', '⇔': '\\Leftrightarrow', '↑': '\\uparrow', '↓': '\\downarrow', '↕': '\\updownarrow', '⇑': '\\Uparrow', '⇓': '\\Downarrow', '⇕': '\\Updownarrow', '↦': '\\mapsto', '↪': '\\hookrightarrow', '↩': '\\hookleftarrow', '↗': '\\nearrow', '↘': '\\searrow', '↙': '\\swarrow', '↖': '\\nwarrow', '⟶': '\\longrightarrow', '⟵': '\\longleftarrow', '⟷': '\\longleftrightarrow', '⟹': '\\Longrightarrow', '⟸': '\\Longleftarrow', '⟺': '\\Longleftrightarrow', '↠': '\\twoheadrightarrow', '↣': '\\rightarrowtail', '⇀': '\\rightharpoonup', '⇁': '\\rightharpoondown', '↼': '\\leftharpoonup', '↽': '\\leftharpoondown',
    '∞': '\\infty', '∂': '\\partial', '∇': '\\nabla', '∑': '\\sum', '∏': '\\prod', '∐': '\\coprod', '∫': '\\int', '∮': '\\oint', '∬': '\\iint', '∭': '\\iiint', '√': '\\sqrt', '∝': '\\propto', '∼': '\\sim', '≃': '\\simeq', '≅': '\\cong', '⊥': '\\perp', '∥': '\\parallel', '∠': '\\angle', '∡': '\\measuredangle', '°': '^\\circ', '′': "'", '″': "''", '‴': "'''", '…': '\\ldots', '⋯': '\\cdots', '⋮': '\\vdots', '⋱': '\\ddots', '⊤': '\\top', '★': '\\star', '⋆': '\\star', '†': '\\dagger', '‡': '\\ddagger', 'ℓ': '\\ell', 'ℏ': '\\hbar', 'ℑ': '\\Im', 'ℜ': '\\Re', 'ℵ': '\\aleph', 'ℶ': '\\beth', '⌈': '\\lceil', '⌉': '\\rceil', '⌊': '\\lfloor', '⌋': '\\rfloor', '⟨': '\\langle', '⟩': '\\rangle', '∘': '\\circ', '∙': '\\bullet', '⋄': '\\diamond', '△': '\\triangle', '▽': '\\triangledown', '⊲': '\\triangleleft', '⊳': '\\triangleright', '⋈': '\\bowtie', '⊎': '\\uplus', '⊍': '\\cupdot',
    'ℕ': '\\mathbb{N}', 'ℤ': '\\mathbb{Z}', 'ℚ': '\\mathbb{Q}', 'ℝ': '\\mathbb{R}', 'ℂ': '\\mathbb{C}', 'ℍ': '\\mathbb{H}', 'ℙ': '\\mathbb{P}',
    '≜': '\\triangleq', '≝': '\\triangleq', '≐': '\\doteq', '≑': '\\doteqdot', '∴': '\\therefore', '∵': '\\because', '⊻': '\\veebar', '⊼': '\\barwedge', '⋅': '\\cdot',
    '⁺': '^+', '⁻': '^-', '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
    '₀': '_0', '₁': '_1', '₂': '_2', '₃': '_3', '₄': '_4', '₅': '_5', '₆': '_6', '₇': '_7', '₈': '_8', '₉': '_9',
    'ₐ': '_a', 'ₑ': '_e', 'ᵢ': '_i', 'ⱼ': '_j', 'ₖ': '_k', 'ₗ': '_l', 'ₘ': '_m', 'ₙ': '_n', 'ₒ': '_o', 'ₚ': '_p', 'ᵣ': '_r', 'ₛ': '_s', 'ₜ': '_t', 'ᵤ': '_u', 'ᵥ': '_v', 'ₓ': '_x',
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
      if (cur.tagName === 'DETAILS') { if (cur.hasAttribute('open')) { cur = cur.parentElement; continue; } return !(el.tagName === 'SUMMARY' && el.parentElement === cur); }
      cur = cur.parentElement;
    }
    return false;
  }

  function isOffscreen(el) {
    if (!el || el.nodeType !== 1 || !S.get('strictOffscreen')) return false;
    try {
      const rect = el.getBoundingClientRect(); if (rect.width === 0 && rect.height === 0) return false;
      const margin = S.get('offscreenMargin');
      return rect.bottom <= -margin || rect.right <= -margin || rect.top >= window.innerHeight + margin || rect.left >= window.innerWidth + margin;
    } catch { return false; }
  }

  function isVisuallyHidden(el) {
    if (!el || el.nodeType !== 1) return false;
    const mode = S.get('visibilityMode'); if (mode === 'dom') return false;
    try {
      const cs = window.getComputedStyle?.(el); if (!cs) return false;
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
    const mode = S.get('visibilityMode'); if (mode === 'dom') return false;
    if ((el.getAttribute?.('aria-hidden') || '').toLowerCase() === 'true') return true;
    if (mode === 'strict' && isInClosedDetails(el)) return true;
    return isVisuallyHidden(el);
  }

  function annotateHidden(scope) {
    const tagged = [], max = S.get('hiddenScanMaxElements');
    try {
      const walker = document.createTreeWalker(scope || document.body, NodeFilter.SHOW_ELEMENT); let n = 0;
      while (walker.nextNode() && ++n <= max) {
        const el = walker.currentNode;
        if (isOurUI(el) || isMathInfra(el) || el.tagName === 'DETAILS' || el.tagName === 'SUMMARY') continue;
        if (shouldHideElement(el)) { el.setAttribute('data-mdltx-hidden', '1'); tagged.push(el); }
      }
    } catch (e) { console.warn('[mdltx] annotateHidden error:', e); }
    return tagged;
  }

  function annotateFormatBoundaries(scope) {
    const tagged = [];
    try {
      (scope || document.body).querySelectorAll('strong *, b *, em *, i *, del *, s *').forEach(el => {
        if (el.nodeType !== 1) return;
        try { const style = window.getComputedStyle(el); if (/^(block|flex|grid|table)$/.test(style.display)) { el.setAttribute('data-mdltx-block', '1'); tagged.push(el); } } catch {}
      });
    } catch (e) { console.warn('[mdltx] annotateFormatBoundaries error:', e); }
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
          const doc = iframe.contentDocument; if (!doc?.body) return;
          const content = md(doc.body, normalizeCtx({ baseUri: doc.baseURI || iframe.src || document.baseURI, escapeText: S.get('escapeMarkdownChars') }));
          if (content.trim()) { iframe.setAttribute('data-mdltx-iframe-md', content.trim()); tagged.push(iframe); }
        } catch {}
      });
    } catch (e) { console.warn('[mdltx] annotateIframes error:', e); }
    return tagged;
  }

  function extractShadowContent(el, ctx) {
    if (!S.get('extractShadowDOM') || !el.shadowRoot) return '';
    try { let r = ''; for (const child of Array.from(el.shadowRoot.childNodes)) r += md(child, ctx); return r; } catch { return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § MathJax / LaTeX / MathML
  // ─────────────────────────────────────────────────────────────

  function getPageMathJax() { try { return (typeof unsafeWindow !== 'undefined' && unsafeWindow.MathJax) || window.MathJax || null; } catch { return window.MathJax || null; } }

  function getMathItemsWithin(scope) {
    try {
      const doc = getPageMathJax()?.startup?.document; if (!doc) return [];
      return typeof doc.getMathItemsWithin === 'function' ? (doc.getMathItemsWithin(scope || document.body) || []) : (Array.isArray(doc.math) ? doc.math : []);
    } catch { return []; }
  }

  async function waitForMathJax(scope) {
    if (!S.get('waitMathJax')) return;
    const MJ = getPageMathJax(); if (!MJ) return;
    try {
      for (let i = 0; i < 10; i++) {
        try { if (MJ.startup?.promise) await MJ.startup.promise; } catch {}
        try { if (typeof MJ.typesetPromise === 'function') { try { await MJ.typesetPromise(scope ? [scope] : undefined); } catch { await MJ.typesetPromise(); } } } catch {}
        if ((getMathItemsWithin(scope) || []).length > 0) return;
        if (document.querySelector('mjx-container,.MathJax') && i >= 1) return;
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (e) { console.warn('[mdltx] waitForMathJax error:', e); }
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
    } catch (e) { console.warn('[mdltx] annotateMathJax error:', e); }
    return added;
  }

  function extractTex(el) {
    if (!el) return '';
    try {
      const dt = el.getAttribute?.('data-mdltx-tex'); if (dt) return dt.trim();
      const alttext = el.getAttribute?.('alttext'); if (alttext) return alttext.trim();
      const annSelectors = ['annotation[encoding="application/x-tex"]', 'annotation[encoding="application/x-latex"]', 'annotation[encoding*="tex"]', 'annotation[encoding*="TeX"]', 'annotation[encoding*="latex"]', 'annotation[encoding*="LaTeX"]', 'annotation:not([encoding])'];
      for (const sel of annSelectors) { const ann = el.querySelector?.(sel); if (ann?.textContent?.trim()) return ann.textContent.trim(); }
      const ds = el.dataset || {};
      if (ds.latex) return ds.latex.trim(); if (ds.tex) return ds.tex.trim(); if (ds.formula) return ds.formula.trim();
      if (el.tagName === 'SCRIPT' && /^math\/tex/i.test(el.type || '')) return (el.textContent || '').trim();
      const sc = el.querySelector?.('script[type^="math/tex"]'); if (sc?.textContent) return sc.textContent.trim();
      const mathml = el.querySelector?.('.katex-mathml annotation'); if (mathml?.textContent) return mathml.textContent.trim();
      const title = el.getAttribute?.('title'); if (title && /^[\\{}\[\]a-zA-Z0-9_^+\-*/=<>()., ]+$/.test(title)) return title.trim();
    } catch {}
    return '';
  }

  function isDisplayMath(el, tex) {
    tex = String(tex || '');
    try {
      const disp = el.getAttribute?.('data-mdltx-display'); if (disp) return disp === 'block';
      if (el.classList?.contains('katex-display') || el.closest?.('.katex-display,.MathJax_Display,.math-display,[data-math-display="block"]')) return true;
      if (el.tagName === 'MJX-CONTAINER') { const da = el.getAttribute?.('display'); if (da === 'true' || da === 'block') return true; }
      if (el.tagName === 'MATH') { const disp = el.getAttribute?.('display'); if (disp === 'block') return true; }
    } catch {}
    if (/\\begin\{(align|aligned|equation|gather|multline|cases|array|matrix|bmatrix|pmatrix|vmatrix|Bmatrix|Vmatrix|split|eqnarray)\*?\}/.test(tex)) return true;
    return tex.includes('\n') && tex.length > 20;
  }

  function stripCommonIndent(tex) {
    try {
      let lines = String(tex || '').replace(/\r\n/g, '\n').split('\n');
      while (lines.length && !lines[0].trim()) lines.shift();
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      let min = null;
      for (const l of lines) if (l.trim()) { const n = l.match(/^[ \t]*/)[0].length; min = min === null ? n : Math.min(min, n); }
      return min > 0 ? lines.map(l => l.slice(min)).join('\n') : lines.join('\n');
    } catch { return tex; }
  }

  function processMathML(mathEl) {
    try {
      const existingTex = extractTex(mathEl);
      if (existingTex) {
        const isBlock = mathEl.getAttribute('display') === 'block' || mathEl.closest?.('[display="block"]');
        return isBlock ? `\n\n$$\n${existingTex}\n$$\n\n` : `$${existingTex}$`;
      }
      const getChildren = node => Array.from(node?.childNodes || []).filter(c => c.nodeType === 1);
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
          case 'mover': {
            if (ch.length < 2) return txt();
            const base = collect(ch[0]), over = collect(ch[1]);
            if (over === '→' || over === '\\to' || over === '⟶' || over === '⃗') return `\\vec{${base}}`;
            if (over === '¯' || over === '−' || over === '-' || over === '‾' || over === '̄') return `\\overline{${base}}`;
            if (over === '^' || over === '̂' || over === '∧' || over === 'ˆ') return `\\hat{${base}}`;
            if (over === '~' || over === '̃' || over === '˜') return `\\tilde{${base}}`;
            if (over === '˙' || over === '.') return `\\dot{${base}}`;
            if (over === '¨' || over === '..') return `\\ddot{${base}}`;
            if (over === '⏞') return `\\overbrace{${base}}`;
            if (over === '⌢') return `\\widehat{${base}}`;
            return `\\overset{${over}}{${base}}`;
          }
          case 'munder': {
            if (ch.length < 2) return txt();
            const base = collect(ch[0]), under = collect(ch[1]);
            if (under === '_' || under === '̲' || under === '‾') return `\\underline{${base}}`;
            if (under === '⏟') return `\\underbrace{${base}}`;
            return `\\underset{${under}}{${base}}`;
          }
          case 'munderover': {
            if (ch.length < 3) return txt();
            const base = collect(ch[0]), under = collect(ch[1]), over = collect(ch[2]), baseText = txt().trim();
            if (['∑', '∏', '∫', '⋃', '⋂', 'lim', '\\sum', '\\prod', '\\int'].includes(baseText) || ['∑', '∏', '∫', '⋃', '⋂'].includes(base)) return `${collect(ch[0])}_{${under}}^{${over}}`;
            return `\\underset{${under}}{\\overset{${over}}{${base}}}`;
          }
          case 'mo': {
            const t = txt();
            if (MATHML_OP_MAP[t]) return MATHML_OP_MAP[t];
            if (t === '(' || t === ')' || t === '[' || t === ']') return t;
            if (t === '{') return '\\{'; if (t === '}') return '\\}'; if (t === '|') return '|';
            return t;
          }
          case 'mi': {
            const t = txt();
            if (t.length === 1 && /[a-zA-Z]/.test(t)) return t;
            if (/^(sin|cos|tan|cot|sec|csc|log|ln|exp|lim|max|min|sup|inf|det|dim|ker|im|arg|deg|gcd|lcm|mod|Pr|arcsin|arccos|arctan|sinh|cosh|tanh|coth|sech|csch|arsinh|arcosh|artanh)$/i.test(t)) return `\\${t.toLowerCase()}`;
            return MATHML_OP_MAP[t] ?? t;
          }
          case 'mn': return txt();
          case 'mtext': { const t = txt(); return t.trim() ? `\\text{${t}}` : t; }
          case 'mspace': return '\\,';
          case 'mphantom': return `\\phantom{${ch.map(collect).join('')}}`;
          case 'mrow': case 'math': case 'semantics': case 'mstyle': case 'mpadded': return ch.map(collect).join('');
          case 'mtable': {
            const rows = Array.from(node.querySelectorAll(':scope > mtr'));
            const content = rows.map(mtr => Array.from(mtr.querySelectorAll(':scope > mtd')).map(collect).join(' & ')).join(' \\\\ ');
            return `\\begin{matrix} ${content} \\end{matrix}`;
          }
          case 'mfenced': {
            const open = node.getAttribute('open') || '(', close = node.getAttribute('close') || ')', sep = node.getAttribute('separators') || ',';
            const inner = ch.map(collect).join(` ${sep.trim()} `);
            const leftMap = { '(': '(', '[': '[', '{': '\\{', '|': '|', '‖': '\\|', '⟨': '\\langle', '〈': '\\langle', '': '' };
            const rightMap = { ')': ')', ']': ']', '}': '\\}', '|': '|', '‖': '\\|', '⟩': '\\rangle', '〉': '\\rangle', '': '' };
            const l = leftMap[open] ?? open, r = rightMap[close] ?? close;
            if (l || r) return `\\left${l || '.'}${inner}\\right${r || '.'}`;
            return inner;
          }
          case 'menclose': {
            const notation = node.getAttribute('notation') || 'box', inner = ch.map(collect).join('');
            if (notation.includes('box') || notation.includes('roundedbox')) return `\\boxed{${inner}}`;
            if (notation.includes('circle')) return `\\circled{${inner}}`;
            if (notation.includes('updiagonalstrike') || notation.includes('downdiagonalstrike')) return `\\cancel{${inner}}`;
            if (notation.includes('horizontalstrike')) return `\\hcancel{${inner}}`;
            if (notation.includes('radical')) return `\\sqrt{${inner}}`;
            return inner;
          }
          case 'annotation': case 'annotation-xml': case 'none': case 'mprescripts': return '';
          case 'mmultiscripts': {
            let result = ch.length > 0 ? collect(ch[0]) : '', i = 1;
            while (i < ch.length && ch[i].tagName?.toLowerCase() !== 'mprescripts') {
              const sub = ch[i] ? collect(ch[i]) : '', sup = ch[i + 1] ? collect(ch[i + 1]) : '';
              if (sub && sub !== 'none') result += `_{${sub}}`;
              if (sup && sup !== 'none') result += `^{${sup}}`;
              i += 2;
            }
            return result;
          }
          default: return ch.length ? ch.map(collect).join('') : txt();
        }
      };
      const content = collect(mathEl).trim(); if (!content) return '';
      return mathEl.getAttribute('display') === 'block' ? `\n\n$$\n${content}\n$$\n\n` : `$${content}$`;
    } catch (e) { console.warn('[mdltx] processMathML error:', e); return ''; }
  }

  function processWikipediaMath(el) {
    try {
      if (!el?.classList?.contains('mwe-math-element') && !el?.closest?.('.mwe-math-element')) return null;
      const host = el.classList?.contains('mwe-math-element') ? el : el.closest('.mwe-math-element'); if (!host) return null;
      const dl = host.closest?.('dl'), dd = host.closest?.('dd');
      const inMwExtMathDisplay = !!host.closest?.('.mw-ext-math-display') || !!host.closest?.('.mw-ext-math') || !!(dl && /mw-ext-math-display|mw-ext-math/i.test(dl.className || '')) || !!(dd && /mw-ext-math-display|mw-ext-math/i.test(dd.className || ''));
      const isDdOnlyDl = !!(dd && dl && !dl.querySelector?.(':scope > dt'));
      const inDisplayFallback = !!host.closest?.('.mwe-math-fallback-image-display');
      const wrap = (tex, isBlock) => {
        tex = String(tex || '').trim(); if (!tex) return '';
        if (isBlock && /^\{\s*\\displaystyle\b/i.test(tex) && /\}\s*$/.test(tex)) tex = tex.replace(/^\{\s*\\displaystyle\s*/i, '').replace(/\}\s*$/i, '').trim();
        return isBlock ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
      };
      const mathEl = host.querySelector?.('math') || (host.tagName === 'MATH' ? host : null);
      const shouldBeBlock = (mathEl?.getAttribute?.('display') === 'block') || inMwExtMathDisplay || isDdOnlyDl || inDisplayFallback;
      if (mathEl) {
        const alttext = mathEl.getAttribute?.('alttext'); if (alttext) return wrap(alttext, shouldBeBlock);
        const tex2 = extractTex(mathEl); if (tex2) return wrap(tex2, shouldBeBlock);
        const res = processMathML(mathEl);
        if (res) { if (shouldBeBlock && /^\$[^$][\s\S]*\$$/.test(res) && !/^\$\$/.test(res)) { const inner = res.slice(1, -1); return `\n\n$$\n${inner}\n$$\n\n`; } return res; }
        return null;
      }
      const img = host.querySelector?.('img.mwe-math-fallback-image-inline, img.mwe-math-fallback-image-display');
      if (img) {
        const alt = (img.getAttribute('alt') || '').trim(); if (!alt) return null;
        const imgIsBlock = img.classList.contains('mwe-math-fallback-image-display') || shouldBeBlock || (img.closest?.('.mw-ext-math-display') !== null);
        return wrap(alt, imgIsBlock);
      }
      return null;
    } catch (e) { console.warn('[mdltx] processWikipediaMath error:', e); return null; }
  }

  function wikipediaImgToTex(imgEl) {
    try {
      if (!imgEl?.classList) return '';
      const isWikiInline = imgEl.classList.contains('mwe-math-fallback-image-inline'), isWikiBlock = imgEl.classList.contains('mwe-math-fallback-image-display');
      if (!isWikiInline && !isWikiBlock) return '';
      const alt = (imgEl.getAttribute('alt') || '').trim(); if (!alt) return '';
      let tex = alt.replace(/^\{\s*\\displaystyle\s*/i, '').replace(/\}\s*$/i, '').trim();
      tex = tex.replace(/^\$(.*)\$$/, '$1').trim(); if (!tex) return '';
      const block = isWikiBlock || (imgEl.closest?.('.mw-ext-math-display') !== null);
      return block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
    } catch { return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § 語言偵測與平台偵測
  // ─────────────────────────────────────────────────────────────

  function normalizeLanguage(lang) {
    if (!lang) return '';
    lang = String(lang).toLowerCase().trim().replace(/^(language-|lang-|hljs-|prism-|shiki-|syntax-|code-)/, '').replace(/(-language|-lang|-code|-syntax|-highlight)$/, '');
    lang = lang.split(/[\s,;|]+/)[0] || '';
    return LANGUAGE_ALIASES[lang] || lang;
  }

  function inferLangFromContent(content) {
    if (!S.get('enableContentBasedLangDetection') || !content || typeof content !== 'string') return '';
    const text = content.trim().slice(0, 1500), firstLine = text.split('\n')[0] || '';

    if (text.startsWith('#!')) {
      if (/python|python3/.test(firstLine)) return 'python';
      if (/\b(bash|sh|zsh|ksh)\b/.test(firstLine)) return 'bash';
      if (/\bnode\b/.test(firstLine)) return 'javascript';
      if (/\bruby\b/.test(firstLine)) return 'ruby';
      if (/\bperl\b/.test(firstLine)) return 'perl';
      if (/\bphp\b/.test(firstLine)) return 'php';
      if (/\blua\b/.test(firstLine)) return 'lua';
      if (/\bawk\b/.test(firstLine)) return 'awk';
      const m = firstLine.match(/env\s+(\w+)/); if (m) return normalizeLanguage(m[1]);
    }

    if (/^<!DOCTYPE\s+html/i.test(text) || /^<html[\s>]/i.test(text)) return 'html';
    if (/^<\?xml\s/i.test(text)) return 'xml';
    if (/^<svg[\s>]/i.test(text)) return 'svg';
    if (/^<\!--[\s\S]*?-->/.test(text) && /<\w+[\s>]/.test(text) && /<html|<head|<body|<div|<span|<p\s|<a\s|<script|<style/i.test(text)) return 'html';

    const mdPatterns = [/^#{1,6}\s+.+$/m, /^\s*[-*+]\s+.+$/m, /^\s*\d+\.\s+.+$/m, /\[.+?\]\(.+?\)/, /\*\*.+?\*\*|__.+?__/, /^```[\s\S]*?```$/m, /^>\s+.+$/m, /^\s*[-*_]{3,}\s*$/m];
    let mdScore = 0; for (const p of mdPatterns) if (p.test(text)) mdScore++;
    if (mdScore >= 3 || (/^#{1,6}\s+.+\n/.test(text) && mdScore >= 1)) return 'markdown';

    if (/^\s*[\[{]/.test(text) && /[\]}]\s*$/.test(text)) {
      if (/^\s*\{[\s\S]*"[^"]+"\s*:/.test(text) || /^\s*\[[\s\S]*\{/.test(text)) { try { JSON.parse(text); return 'json'; } catch { if (/^\s*\{/.test(text) && /"[^"]+"\s*:/.test(text)) return 'json'; } }
    }

    if (/^---\s*\n/.test(text) || /^%YAML\s/i.test(text)) return 'yaml';
    if (/^[a-z_][a-z0-9_]*:\s*.+$/im.test(text) && !/^\s*\{/.test(text) && !/^\s*\[/.test(text)) { const yamlLines = text.split('\n').filter(l => /^[a-z_][a-z0-9_]*:\s*/i.test(l.trim())); if (yamlLines.length >= 2) return 'yaml'; }
    if (/^\s*\[[a-z_][a-z0-9_]*\]\s*$/im.test(text) && /^[a-z_][a-z0-9_]*\s*=\s*/im.test(text)) return 'toml';
    if (/^\s*\[.+\]\s*$/m.test(text) && /^[a-z_][a-z0-9_]*\s*=\s*.+$/im.test(text) && !/^\s*\{/.test(text)) return 'ini';
    if (/^(@import|@charset|@media|@keyframes|@font-face)\s/m.test(text)) return 'css';
    if (/^[.#]?[a-z][a-z0-9_-]*\s*\{[\s\S]*?\}/im.test(text) && /:\s*[^;]+;/.test(text)) return 'css';
    if (/^\$[a-z_][a-z0-9_-]*\s*:/im.test(text)) return 'scss';

    const jsPatterns = [/^(const|let|var|function|class|import|export|async|await)\s/m, /=>\s*[\{(]/, /\.then\s*\(/, /console\.(log|error|warn)\s*\(/, /document\.(getElementById|querySelector|createElement)/, /window\./, /require\s*\(/, /module\.exports/];
    let jsScore = 0; for (const p of jsPatterns) if (p.test(text)) jsScore++;
    const tsPatterns = [/:\s*(string|number|boolean|any|void|never|unknown|object)\b/, /interface\s+[A-Z]/, /type\s+[A-Z]\w*\s*=/, /<[A-Z]\w*>/, /as\s+(string|number|boolean|any|const)\b/];
    let tsScore = 0; for (const p of tsPatterns) if (p.test(text)) tsScore++;
    if (tsScore >= 2) return 'typescript'; if (jsScore >= 2) return 'javascript';

    const pyPatterns = [/^(def|class|import|from|if|elif|else|for|while|try|except|with|async|await)\s/m, /^\s*def\s+\w+\s*\([^)]*\)\s*:/m, /^\s*class\s+\w+.*:/m, /print\s*\(/, /^\s*@\w+/m, /self\./, /__init__|__name__|__main__/, /import\s+(os|sys|re|json|requests|numpy|pandas)/];
    let pyScore = 0; for (const p of pyPatterns) if (p.test(text)) pyScore++; if (pyScore >= 2) return 'python';

    if (/^(public|private|protected)\s+(static\s+)?(class|interface|enum)\s/m.test(text)) return 'java';
    if (/^package\s+[a-z][a-z0-9_.]*;/m.test(text)) return 'java';
    if (/System\.out\.print(ln)?\s*\(/.test(text)) return 'java';
    if (/^#include\s*<[a-z_]+\.h>/m.test(text)) return 'c';
    if (/^#include\s*<(iostream|string|vector|map|set|algorithm|memory)>/m.test(text)) return 'cpp';
    if (/std::(cout|cin|endl|string|vector|map|set)\b/.test(text)) return 'cpp';
    if (/^(using\s+namespace\s+std|template\s*<)/m.test(text)) return 'cpp';
    if (/^using\s+(System|Microsoft|Newtonsoft)/m.test(text)) return 'csharp';
    if (/^namespace\s+[A-Z]/m.test(text) && /class\s+[A-Z]/.test(text)) return 'csharp';
    if (/Console\.Write(Line)?\s*\(/.test(text)) return 'csharp';
    if (/^package\s+\w+\s*$/m.test(text) && /^(import|func|type|var|const)\s/m.test(text)) return 'go';
    if (/fmt\.(Print|Println|Printf|Sprintf)\s*\(/.test(text)) return 'go';
    if (/^(fn|pub\s+fn|impl|struct|enum|trait|mod|use|let\s+mut)\s/m.test(text)) { if (/println!\s*\(|eprintln!\s*\(|format!\s*\(/.test(text) || /fn\s+\w+\s*\([^)]*\)\s*(->|\{)/.test(text)) return 'rust'; }
    if (/^(require|require_relative|gem|class|module|def|end)\s/m.test(text)) { if (/^\s*end\s*$/m.test(text) && /^\s*def\s+\w+/m.test(text)) return 'ruby'; if (/puts\s|\.each\s+do\s*\|/.test(text)) return 'ruby'; }
    if (/^<\?php\s/m.test(text) || /^\s*<\?=/m.test(text)) return 'php';
    if (/\$[a-z_][a-z0-9_]*\s*=/i.test(text) && /\bfunction\s+\w+\s*\(/i.test(text)) return 'php';

    const shellPatterns = [/^\s*(if|then|else|elif|fi|for|do|done|while|case|esac)\s/m, /\$\{?\w+\}?/, /^\s*echo\s+/m, /^\s*(export|source|alias)\s/m, /\|\s*(grep|awk|sed|cut|sort|uniq|wc)\s/];
    let shellScore = 0; for (const p of shellPatterns) if (p.test(text)) shellScore++; if (shellScore >= 2) return 'bash';
    if (/^\s*\$[A-Z][a-zA-Z0-9_]*\s*=/m.test(text) && /\b(Get-|Set-|New-|Remove-|Write-Host|Write-Output)\b/.test(text)) return 'powershell';
    if (/^\s*(function|param|begin|process|end)\s/im.test(text) && /\$[A-Z]/m.test(text)) return 'powershell';
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|GRANT|REVOKE)\s/im.test(text)) return 'sql';
    if (/\b(FROM|WHERE|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING)\b/i.test(text)) return 'sql';
    if (/^FROM\s+\w+/m.test(text) && /^(RUN|CMD|ENTRYPOINT|COPY|ADD|ENV|EXPOSE|WORKDIR)\s/m.test(text)) return 'dockerfile';
    if (/^[a-z_][a-z0-9_-]*\s*:/m.test(text) && /^\t/.test(text)) return 'makefile';
    if (/^\.(PHONY|SUFFIXES|DEFAULT)\s*:/m.test(text)) return 'makefile';
    if (/^(diff\s+--git|---\s+a\/|@@\s+-\d+,\d+\s+\+\d+,\d+\s+@@)/m.test(text)) return 'diff';
    if (/^[-+]{3}\s+/.test(text) && /^[-+](?![-+])/m.test(text)) return 'diff';
    if (/^\\documentclass|^\\usepackage|^\\begin\{document\}/m.test(text)) return 'latex';
    if (/\\(section|subsection|chapter|title|author|maketitle|textbf|textit)\{/.test(text)) return 'latex';
    if (/^\s*(query|mutation|subscription|fragment|type|input|enum|interface|union|scalar)\s+\w+/m.test(text)) return 'graphql';
    return '';
  }

  function isAIChatPlatform() { try { const h = location.hostname.toLowerCase(); if (AI_CHAT_PLATFORM_HOSTS.has(h)) return true; for (const host of AI_CHAT_PLATFORM_HOSTS) if (h.endsWith('.' + host) || h === host) return true; return false; } catch { return false; } }
  function isLMArenaHost() { try { return /lmarena\.ai$/i.test(location.hostname); } catch { return false; } }
  function isClaudeHost() { try { return /claude\.ai$/i.test(location.hostname); } catch { return false; } }
  function isGrokHost() { try { return /grok\.com$/i.test(location.hostname); } catch { return false; } }
  function isChatGPTHost() { try { const h = location.hostname.toLowerCase(); return h === 'chat.openai.com' || h === 'chatgpt.com'; } catch { return false; } }

  function detectLangFromAIChatPlatform(codeEl) {
    try {
      const preParent = codeEl.closest('pre'), container = preParent?.parentElement || codeEl.parentElement; if (!container) return '';
      if (isClaudeHost()) {
        const claudeContainer = codeEl.closest('[data-code-block-id]') || codeEl.closest('[class*="code-block"]');
        if (claudeContainer) { const lang = claudeContainer.getAttribute('data-language') || claudeContainer.querySelector('[data-language]')?.getAttribute('data-language'); if (lang) return normalizeLanguage(lang); }
        const toolbar = container.querySelector('[class*="sticky"]') || container.previousElementSibling;
        if (toolbar) { for (const span of toolbar.querySelectorAll('span, div')) { const text = (span.textContent || '').trim().toLowerCase(); if (text && text.length < 20 && KNOWN_LANGUAGES.has(text)) return text; } }
      }
      if (isChatGPTHost()) {
        const header = container.querySelector('[class*="code-block-header"]') || container.querySelector('[class*="flex"][class*="justify-between"]');
        if (header) { const langSpan = header.querySelector('span:first-child') || header.querySelector('[class*="text-xs"]'); if (langSpan) { const text = (langSpan.textContent || '').trim().toLowerCase(); if (text && KNOWN_LANGUAGES.has(normalizeLanguage(text))) return normalizeLanguage(text); } }
        if (preParent) { const langMatch = (preParent.className || '').match(/language-([a-z0-9_+-]+)/i); if (langMatch) return normalizeLanguage(langMatch[1]); }
      }
      if (isGrokHost()) {
        const grokContainer = codeEl.closest('[class*="message-content"]') || codeEl.closest('[class*="prose"]');
        if (grokContainer) { const codeBlock = codeEl.closest('[class*="code"]'), header = codeBlock?.querySelector('[class*="header"]') || codeBlock?.previousElementSibling;
          if (header) { const text = (header.textContent || '').trim().toLowerCase(), normalized = normalizeLanguage(text.split(/[\s.]+/)[0]); if (normalized && KNOWN_LANGUAGES.has(normalized)) return normalized; } }
      }
      const possibleHeaders = [container.querySelector('[class*="header"]'), container.querySelector('[class*="toolbar"]'), container.querySelector('[class*="title"]'), container.previousElementSibling, preParent?.previousElementSibling].filter(Boolean);
      for (const header of possibleHeaders) { if (!header) continue; const firstWord = (header.textContent || '').trim().split(/[\s\n]+/)[0]?.toLowerCase(); if (firstWord && firstWord.length < 20) { const normalized = normalizeLanguage(firstWord); if (KNOWN_LANGUAGES.has(normalized) || LANGUAGE_ALIASES[normalized]) return normalizeLanguage(normalized); } }
    } catch (e) { console.warn('[mdltx] detectLangFromAIChatPlatform error:', e); }
    return '';
  }

  function detectLangFromLMArena(codeEl) {
    try {
      const preParent = codeEl.closest('pre'), container = preParent?.closest('div[class*="relative"]') || codeEl.closest('div[class*="relative"]') || preParent?.parentElement;
      if (container) {
        const header = container.querySelector('[class*="flex"][class*="justify-between"]') || container.querySelector('[class*="toolbar"]') || container.querySelector('[class*="header"]') || container.firstElementChild;
        if (header && header !== preParent) {
          for (const el of header.querySelectorAll('span, div, button')) { const text = (el.textContent || '').trim().toLowerCase(); if (text && text.length < 25 && !/^(copy|copied|share|run|edit|expand|collapse|\d+)$/i.test(text)) { const normalized = normalizeLanguage(text.split(/[\s.]+/)[0]); if (KNOWN_LANGUAGES.has(normalized) || LANGUAGE_ALIASES[normalized]) return normalizeLanguage(normalized); } }
        }
        const langFromData = container.getAttribute('data-language') || container.getAttribute('data-lang') || container.getAttribute('data-code-lang'); if (langFromData) return normalizeLanguage(langFromData);
      }
      if (preParent) { const shikiLang = preParent.getAttribute('data-lang') || preParent.getAttribute('data-language'); if (shikiLang) return normalizeLanguage(shikiLang);
        const shikiMatch = (preParent.className || '').match(/shiki[_-]?(?:lang[_-])?([a-z0-9_+-]+)/i); if (shikiMatch && !['light', 'dark', 'themes', 'nord', 'dracula'].includes(shikiMatch[1].toLowerCase())) return normalizeLanguage(shikiMatch[1]); }
    } catch (e) { console.warn('[mdltx] detectLangFromLMArena error:', e); }
    return '';
  }

  function detectLang(codeEl) {
    if (!codeEl) return '';
    try {
      const annotated = codeEl.getAttribute?.('data-mdltx-lang') || codeEl.closest?.('[data-mdltx-lang]')?.getAttribute('data-mdltx-lang'); if (annotated) return normalizeLanguage(annotated);
      const dataAttrs = ['data-language', 'data-lang', 'data-syntax', 'data-code-language', 'data-code-lang', 'data-highlight', 'data-prismjs', 'data-shiki-lang'];
      for (const attr of dataAttrs) { const val = codeEl.getAttribute?.(attr); if (val) { const normalized = normalizeLanguage(val); if (normalized && normalized !== 'text') return normalized; } }
      const classList = (codeEl.className || '').toLowerCase();
      const langMatch = classList.match(/(?:^|\s)(language|lang|hljs|prism|shiki|syntax|brush|highlight)-([a-z0-9_+-]+)/i);
      if (langMatch && langMatch[2]) { const normalized = normalizeLanguage(langMatch[2]); if (normalized && !['line', 'number', 'copy', 'wrapper', 'block', 'inline', 'light', 'dark'].includes(normalized)) return normalized; }
      for (const lang of KNOWN_LANGUAGES) if (new RegExp(`(?:^|\\s|-)${lang}(?:$|\\s|-)`, 'i').test(classList)) return lang;
      const preParent = codeEl.closest('pre');
      if (preParent && preParent !== codeEl) {
        for (const attr of dataAttrs) { const val = preParent.getAttribute?.(attr); if (val) { const normalized = normalizeLanguage(val); if (normalized && normalized !== 'text') return normalized; } }
        const preLangMatch = (preParent.className || '').toLowerCase().match(/(?:^|\s)(language|lang|hljs|prism|shiki)-([a-z0-9_+-]+)/i);
        if (preLangMatch && preLangMatch[2]) { const normalized = normalizeLanguage(preLangMatch[2]); if (normalized && !['line', 'number', 'copy', 'wrapper', 'block'].includes(normalized)) return normalized; }
      }
      if (S.get('aiChatPlatformDetection') && isAIChatPlatform()) { const aiLang = detectLangFromAIChatPlatform(codeEl); if (aiLang) return aiLang; }
      if (S.get('lmArenaEnhancedDetection') && isLMArenaHost()) { const lmLang = detectLangFromLMArena(codeEl); if (lmLang) return lmLang; }
      const shikiEl = codeEl.closest('[class*="shiki"]') || preParent?.closest('[class*="shiki"]');
      if (shikiEl) { const shikiLang = shikiEl.getAttribute('data-lang') || shikiEl.getAttribute('data-language'); if (shikiLang) return normalizeLanguage(shikiLang);
        const shikiMatch = shikiEl.className.match(/shiki[_-](?:lang[_-])?([a-z0-9_+-]+)/i); if (shikiMatch && !['light', 'dark', 'themes'].includes(shikiMatch[1])) return normalizeLanguage(shikiMatch[1]); }
      const hljsEl = codeEl.closest('[class*="hljs"]') || codeEl.querySelector('[class*="hljs"]');
      if (hljsEl) { const hljsMatch = hljsEl.className.match(/hljs[_-]?([a-z0-9_+-]+)/i); if (hljsMatch && !['line', 'number', 'copy', 'wrapper', 'ln', 'code'].includes(hljsMatch[1])) return normalizeLanguage(hljsMatch[1]); }
      const prismMatch = classList.match(/(?:^|\s)(?:prism-)?([a-z0-9_+-]+)(?:\s|$)/i); if (prismMatch) { const candidate = normalizeLanguage(prismMatch[1]); if (KNOWN_LANGUAGES.has(candidate)) return candidate; }
      const container = codeEl.closest('[class*="code"]') || preParent?.parentElement;
      if (container) {
        const langLabelSelectors = ['[class*="language-label"]', '[class*="code-lang"]', '[class*="lang-label"]', '[class*="code-header"] span', '[class*="toolbar"] span', '[class*="filename"]', '[class*="code-title"]', 'span[class*="text-xs"]', 'span[class*="text-sm"]', '.code-block-extension-header', '.code-block-header'];
        for (const sel of langLabelSelectors) { try { const label = container.querySelector(sel); if (label) { const labelText = (label.textContent || '').trim().toLowerCase(); if (labelText && labelText.length < 25 && !/^(copy|copied|code|share|\d+\s*lines?|run|preview|edit)$/i.test(labelText)) { const normalized = normalizeLanguage(labelText.split(/[\s.]+/)[0]); if (KNOWN_LANGUAGES.has(normalized) || LANGUAGE_ALIASES[normalized]) return normalizeLanguage(normalized); } } } catch {} }
        for (const attr of dataAttrs) { const val = container.getAttribute?.(attr); if (val) { const normalized = normalizeLanguage(val); if (normalized && normalized !== 'text') return normalized; } }
      }
      if (S.get('enableContentBasedLangDetection')) { const content = codeEl.textContent || ''; if (content.trim()) { const inferred = inferLangFromContent(content); if (inferred) return inferred; } }
    } catch (e) { console.warn('[mdltx] detectLang error:', e); }
    return '';
  }

  function annotateCodeBlockLanguages(scope) {
    const tagged = [];
    try {
      const codeBlocks = (scope || document.body).querySelectorAll('pre code, pre[class*="shiki"], pre[class*="hljs"]');
      for (const codeEl of codeBlocks) {
        if (codeEl.hasAttribute('data-mdltx-lang') || codeEl.closest?.('[data-mdltx-ui="1"]') || codeEl.closest?.('[data-mdltx-hidden="1"]')) continue;
        const lang = detectLang(codeEl);
        codeEl.setAttribute('data-mdltx-lang', lang || '');
        tagged.push(codeEl);
      }
    } catch (e) { console.warn('[mdltx] annotateCodeBlockLanguages error:', e); }
    return tagged;
  }

  // ─────────────────────────────────────────────────────────────
  // § 輔助函數與文字處理
  // ─────────────────────────────────────────────────────────────

  function escapeRegExp(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function isInlineishNode(n) { return n && ((n.nodeType === 3 && (n.nodeValue || '').trim()) || (n.nodeType === 1 && (INLINEISH_TAGS.has(n.tagName) || n.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,math,.mwe-math-element,img.mwe-math-fallback-image-inline,img.mwe-math-fallback-image-display')))); }
  function wsTextNodeToSpace(textNode) { const p = textNode.previousSibling, n = textNode.nextSibling; return (p && n && isInlineishNode(p) && isInlineishNode(n)) ? ' ' : ''; }
  function isBlockBoundary(node) { return node?.nodeType === 1 && (BLOCK_TAGS.has(node.tagName) || node.tagName === 'BR' || node.hasAttribute?.('data-mdltx-block')); }
  function containsBlockishContent(el) { return el?.nodeType === 1 && (el.querySelector('br') || [...BLOCK_TAGS].some(tag => el.querySelector(tag.toLowerCase())) || el.querySelector('[data-mdltx-block="1"]')); }
  function hasUnsafeMarkdownBlocks(el) { return el?.nodeType === 1 && !!el.querySelector('ul,ol,li,table,pre,blockquote'); }

  function processUnknownEmptyTag(el, ctx) {
    const strategy = S.get('unknownEmptyTagStrategy'); if (strategy === 'drop') return '';
    if (el.closest?.('svg') || el.closest?.('math') || el.tagName?.includes('-')) return null;
    if (!KNOWN_HTML_TAGS.has(el.tagName) && el.childNodes.length === 0) { const tagName = el.tagName.toLowerCase(); return ctx?.escapeText ? `&lt;${tagName}&gt;` : `<${tagName}>`; }
    return null;
  }

  function processRuby(rubyEl) { let result = ''; for (const child of rubyEl.childNodes) { if (child.nodeType === 3) result += child.nodeValue || ''; else if (child.nodeType === 1 && !/^(RT|RP)$/.test(child.tagName)) result += child.tagName === 'RUBY' ? processRuby(child) : (child.textContent || ''); } return result; }
  function processSvg(svgEl) { const texts = []; try { const title = svgEl.querySelector('title'); if (title?.textContent?.trim()) texts.push(title.textContent.trim()); const desc = svgEl.querySelector('desc'); if (desc?.textContent?.trim()) texts.push(desc.textContent.trim()); svgEl.querySelectorAll('text').forEach(t => { if (t.textContent?.trim()) texts.push(t.textContent.trim()); }); } catch {} return texts.join(' '); }

  function smartConcat(out, part) {
    if (!out) return part; if (!part) return out;
    for (const [len, mk] of [[3, '***'], [2, '**'], [2, '~~'], [1, '*']]) if (out.slice(-len) === mk && part.slice(0, len) === mk) return out.slice(0, -len) + part.slice(len);
    if (S.get('mergeAdjacentCodeSpans')) { const outM = out.match(/(`+)([^`]+)\1$/), partM = part.match(/^(`+)([^`]+)\1/); if (outM && partM) return out.slice(0, -outM[0].length) + wrapInlineCode(outM[2] + partM[2]) + part.slice(partM[0].length); }
    return out + part;
  }

  function trimNewlinesOnly(s) { return String(s || '').replace(/^\n+/, '').replace(/\n+$/, ''); }
  function normalizeCtx(ctx) { return { depth: ctx?.depth ?? 0, escapeText: ctx?.escapeText ?? S.get('escapeMarkdownChars'), inTable: ctx?.inTable ?? false, baseUri: ctx?.baseUri ?? document.baseURI }; }
  function getListMarker() { return S.get('listMarker') || '-'; }
  function getEmphasisMarker() { return S.get('emphasisMarker') || '*'; }
  function getStrongMarker() { return S.get('strongMarker') || '**'; }
  function getHorizontalRule() { return S.get('horizontalRule') || '---'; }

  function waitForDomIdle(timeout) {
    return new Promise(resolve => {
      let timer = null;
      const observer = new MutationObserver(() => { if (timer) clearTimeout(timer); timer = setTimeout(() => { observer.disconnect(); resolve(); }, timeout); });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      timer = setTimeout(() => { observer.disconnect(); resolve(); }, timeout);
    });
  }

  function escapeMarkdownText(s, ctx) { s = String(s ?? ''); if (ctx?.inTable) s = s.replace(/\|/g, '&#124;'); if (ctx?.escapeText) s = s.replace(/([\\*_`\[\]~])/g, '\\$1').replace(/</g, '&lt;').replace(/>/g, '&gt;'); return s; }
  function escapeBracketText(s) { return String(s ?? '').replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]'); }
  function escapeLinkLabel(s, ctx) { s = String(s ?? '').replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]'); if (ctx?.escapeText) s = s.replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~'); return s; }
  function escapeLinkDest(url, inTable = false) { url = String(url || '').trim(); if (!url) return ''; if (inTable) url = url.replace(/\|/g, '%7C'); if (/[()\s"<>]/.test(url)) return `<${encodeURI(url).replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\|/g, '%7C')}>`; return url.replace(/\\/g, '\\\\').replace(/\)/g, '\\)'); }
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

  function hrefForA(aEl, baseUri) {
    try { const raw = (aEl.getAttribute?.('href') || '').trim(); if (!raw || raw.startsWith('#') || /^javascript:/i.test(raw)) return raw.startsWith('#') ? raw : ''; return S.get('absoluteUrls') ? absUrl(aEl.href || raw, baseUri) : raw; } catch { return ''; }
  }

  function parseSrcset(srcset) {
    try { srcset = String(srcset || '').trim(); if (!srcset) return ''; let bestUrl = '', bestScore = -1;
      for (const p of srcset.split(',').map(s => s.trim()).filter(Boolean)) { const m = p.match(/^(\S+)(?:\s+(\d+(?:\.\d+)?)(w|x))?$/i); if (!m) continue; const url = m[1], value = m[2] ? parseFloat(m[2]) : 1, unit = (m[3] || 'x').toLowerCase(), score = unit === 'w' ? value : value * 10000; if (score > bestScore) { bestScore = score; bestUrl = url; } }
      return bestUrl;
    } catch { return ''; }
  }

  function pickImgSrc(node) {
    try { if (node.currentSrc) return node.currentSrc;
      for (const a of ['src', 'data-src', 'data-original', 'data-orig', 'data-lazy-src', 'data-url', 'data-image', 'data-src-url', 'data-zoom-src', 'data-hires']) { const v = node.getAttribute?.(a); if (v) return v; }
      return parseSrcset(node.getAttribute?.('srcset') || node.getAttribute?.('data-srcset') || '');
    } catch { return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § 格式處理
  // ─────────────────────────────────────────────────────────────

  function wrapWithFormat(content, formatTag) {
    content = String(content || '').trim(); if (!content) return '';
    switch (formatTag) { case 'STRONG': case 'B': return `${getStrongMarker()}${content}${getStrongMarker()}`; case 'EM': case 'I': return `${getEmphasisMarker()}${content}${getEmphasisMarker()}`; case 'DEL': case 'S': return `~~${content}~~`; default: return content; }
  }

  function splitInlineFormatAcrossBlocks(node, formatTag, ctx) {
    ctx = normalizeCtx(ctx); const sep = ctx.inTable ? '<br>' : '\n\n'; const parts = []; let buf = '';
    const flushBuf = () => { const t = String(buf || '').trim(); if (!t) { buf = ''; return; }
      const chunks = ctx.inTable ? t.split(/<br\s*\/?>/i).map(s => s.trim()).filter(Boolean) : t.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
      if (chunks.length <= 1) parts.push(wrapWithFormat(t, formatTag));
      else { for (let i = 0; i < chunks.length; i++) { parts.push(wrapWithFormat(chunks[i], formatTag)); if (i < chunks.length - 1) parts.push(sep); } }
      buf = '';
    };
    const pushSep = () => { if (!parts.length || parts[parts.length - 1] === sep) return; parts.push(sep); };
    const pushBlock = (blockNode) => { const inner = mdInline(blockNode, ctx).trim(); if (!inner) return; pushSep(); parts.push(wrapWithFormat(inner, formatTag)); parts.push(ctx.inTable ? '<br>' : '\n\n'); };
    for (const child of Array.from(node.childNodes)) { if (child.nodeType === 1 && isBlockBoundary(child)) { flushBuf(); if (child.tagName === 'BR') parts.push('<br>'); else pushBlock(child); } else buf += mdInline(child, ctx); }
    flushBuf();
    let out = parts.join('');
    if (ctx.inTable) out = out.replace(/(?:<br>\s*){3,}/g, '<br><br>').replace(/^(?:<br>\s*)+/, '').replace(/(?:<br>\s*)+$/, '');
    else out = out.replace(/\n{3,}/g, '\n\n');
    return out;
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
    try { const mainCells = tbl.querySelectorAll(':scope > thead > tr > td, :scope > thead > tr > th, :scope > tbody > tr > td, :scope > tbody > tr > th, :scope > tr > td, :scope > tr > th');
      for (const cell of mainCells) { if (cell.closest('tfoot')) continue; const rs = parseInt(cell.getAttribute('rowspan') || '1', 10), cs = parseInt(cell.getAttribute('colspan') || '1', 10); if (rs > 1 || cs > 1 || cell.querySelector(':scope > table')) return true; }
    } catch {} return false;
  }

  function flattenListText(listMd, marker) { marker = marker || getListMarker(); const re = new RegExp(`^\\s*${escapeRegExp(marker)}\\s+`, 'gm'); return String(listMd || '').split('\n').map(l => l.replace(re, '').trim()).filter(Boolean).join('; '); }

  function tableToList(tbl, ctx) {
    ctx = normalizeCtx(ctx); const marker = getListMarker(), items = [];
    try { const rows = Array.from(tbl.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr, :scope > tr'));
      for (const tr of rows) { const cells = Array.from(tr.querySelectorAll(':scope > th, :scope > td')), cellTexts = [];
        for (const cell of cells) { const parts = [], nestedTables = Array.from(cell.querySelectorAll(':scope > table'));
          if (nestedTables.length) for (const nt of nestedTables) { const nestedList = tableToList(nt, ctx), flattened = flattenListText(nestedList, marker); if (flattened) parts.push(`[${flattened}]`); }
          const cellClone = cell.cloneNode(true); try { cellClone.querySelectorAll(':scope > table').forEach(n => n.remove()); } catch {}
          const text = cellToMd(cellClone, ctx).trim(); if (text) parts.push(text);
          const combined = parts.filter(Boolean).join(' ').trim(); if (combined) cellTexts.push(combined);
        }
        if (cellTexts.length) { const line = `${marker} ${cellTexts.join(' | ')}`.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim(); items.push(line); }
      }
    } catch (e) { console.warn('[mdltx] tableToList error:', e); }
    return items.join('\n');
  }

  function cellToMd(cell, ctx) {
    ctx = normalizeCtx({ ...ctx, inTable: true }); const placeholders = {}; let pid = 0; const nonce = generateNonce();
    const protect = c => { const k = makePlaceholder('CELL', nonce, pid++); placeholders[k] = c; return k; };
    try { const hasBlock = !!cell.querySelector('ul,ol,pre,blockquote,p,div,br'); let result;
      if (hasBlock) { const parts = [];
        for (const ch of Array.from(cell.childNodes)) { if (ch.nodeType === 3) { const t = ch.nodeValue?.trim(); if (t) parts.push(escapeMarkdownText(t, ctx)); }
          else if (ch.nodeType === 1) { const T = ch.tagName; if (T === 'TABLE') continue;
            if (T === 'UL' || T === 'OL') parts.push(Array.from(ch.querySelectorAll('li')).map(li => mdInline(li, ctx).trim()).filter(Boolean).join('; '));
            else if (T === 'PRE') { const code = ch.querySelector('code') || ch; parts.push(protect(wrapInlineCode((code.textContent || '').replace(/\n/g, ' ').trim()))); }
            else if (T === 'CODE') parts.push(protect(wrapInlineCode(ch.textContent || '')));
            else parts.push(mdInline(ch, ctx).trim());
          }
        }
        result = parts.join(' ');
      } else result = mdInline(cell, ctx);
      result = String(result || '').replace(/(?:<br>\s*){3,}/g, '<br><br>').replace(/<br\s*\/?>/gi, ' ').replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      for (const [k, v] of Object.entries(placeholders)) result = result.split(k).join(v);
      return result.trim();
    } catch (e) { console.warn('[mdltx] cellToMd error:', e); return ''; }
  }

  function serializeTableAsHtml(tbl, ctx) {
    try { const clone = tbl.cloneNode(true), nestedMap = new Map(); let nid = 0; const nonce = generateNonce();
      clone.querySelectorAll('table table').forEach(nt => { const key = makePlaceholder('NTBL', nonce, nid++); nestedMap.set(key, serializeTableAsHtml(nt, ctx) || ''); const sp = document.createElement('span'); sp.textContent = key; nt.replaceWith(sp); });
      clone.querySelectorAll('td, th').forEach(cell => { const mdContent = cellToMd(cell, ctx); cell.textContent = ''; cell.innerHTML = mdContent; });
      const allowedAttrs = new Set(['rowspan', 'colspan', 'scope']);
      clone.querySelectorAll('*').forEach(el => { Array.from(el.attributes).forEach(attr => { if (!allowedAttrs.has(attr.name)) el.removeAttribute(attr.name); }); });
      let html = clone.outerHTML; for (const [k, v] of nestedMap.entries()) if (v) html = html.split(k).join(v);
      return html;
    } catch (e) { console.warn('[mdltx] serializeTableAsHtml error:', e); return ''; }
  }

  function tableToMd(tbl, ctx) {
    ctx = normalizeCtx(ctx);
    try { if (tableHasComplexStructure(tbl)) { const strategy = S.get('complexTableStrategy'); if (strategy === 'html') return `\n\n${serializeTableAsHtml(tbl, ctx)}\n\n`;
        const caption = tbl.querySelector('caption'), captionText = caption ? mdInline(caption, ctx).trim() : '', listContent = tableToList(tbl, ctx);
        return captionText ? `${getEmphasisMarker()}${captionText}${getEmphasisMarker()}\n\n${listContent}` : listContent; }
      const rows = [], caption = tbl.querySelector('caption'), captionText = caption ? mdInline(caption, ctx).trim() : ''; let hasHr = false;
      const mainRows = Array.from(tbl.querySelectorAll(':scope > thead > tr, :scope > tbody > tr, :scope > tr')).filter(tr => !tr.closest('tfoot'));
      const tfootRows = Array.from(tbl.querySelectorAll(':scope > tfoot > tr'));
      mainRows.forEach((tr, i) => { const cells = []; tr.querySelectorAll(':scope > th, :scope > td').forEach(td => { const colspan = parseInt(td.getAttribute('colspan') || '1', 10); cells.push(cellToMd(td, ctx)); for (let c = 1; c < colspan; c++) cells.push(''); });
        if (!cells.length) return; rows.push(`| ${cells.join(' | ')} |`);
        if (!hasHr && (tr.querySelector('th') || i === 0)) { rows.push(`| ${cells.map(() => '---').join(' | ')} |`); hasHr = true; }
      });
      let result = rows.join('\n');
      if (tfootRows.length > 0) { const tfootTexts = []; tfootRows.forEach(tr => { const cells = []; tr.querySelectorAll(':scope > th, :scope > td').forEach(td => { const text = cellToMd(td, ctx).trim(); if (text) cells.push(text); }); if (cells.length) tfootTexts.push(cells.join(' | ')); });
        if (tfootTexts.length) result += `\n\n${getEmphasisMarker()}${tfootTexts.join('; ')}${getEmphasisMarker()}`; }
      return captionText ? `${getEmphasisMarker()}${captionText}${getEmphasisMarker()}\n\n${result}` : result;
    } catch (e) { console.warn('[mdltx] tableToMd error:', e); return ''; }
  }

  function dlToMd(dl, ctx) {
    ctx = normalizeCtx(ctx);
    try { const isWikiMathDl = dl.classList?.contains('mw-ext-math-display'), hasDT = !!dl.querySelector?.(':scope > dt'), ddList = Array.from(dl.querySelectorAll?.(':scope > dd') || []), isDdOnlyDl = ddList.length > 0 && !hasDT;
      if (isWikiMathDl || isDdOnlyDl) { const blocks = []; for (const ch of Array.from(dl.children)) if (ch.tagName === 'DT' || ch.tagName === 'DD') { const m = trimNewlinesOnly(md(ch, ctx)).trim(); if (m) blocks.push(m); } const out = blocks.join('\n\n').trim(); return out ? `\n\n${out}\n\n` : ''; }
      const items = []; let curTerm = null, defs = []; const marker = getListMarker(), strong = getStrongMarker();
      const flush = () => { if (!curTerm) { const defTextOnly = defs.map(d => d.trim()).filter(Boolean).join('<br>'); if (defTextOnly) items.push(`${marker} ${defTextOnly}`); curTerm = null; defs = []; return; }
        const term = curTerm.trim(), defText = defs.map(d => d.trim()).filter(Boolean).join('<br>');
        items.push(term && defText ? `${marker} ${strong}${term}${strong}：${defText}` : term ? `${marker} ${strong}${term}${strong}` : '');
        curTerm = null; defs = [];
      };
      for (const ch of Array.from(dl.children)) { if (ch.tagName === 'DT') { flush(); curTerm = mdInline(ch, ctx); } else if (ch.tagName === 'DD') defs.push(mdInline(ch, ctx)); }
      flush(); return items.length ? `\n\n${items.join('\n')}\n\n` : '';
    } catch (e) { console.warn('[mdltx] dlToMd error:', e); return ''; }
  }

  function figureToMd(fig, ctx) {
    ctx = normalizeCtx(ctx);
    try { const imgs = Array.from(fig.querySelectorAll('img')).map(img => md(img, ctx).trim()).filter(Boolean), capEl = fig.querySelector('figcaption'), cap = capEl ? mdInline(capEl, ctx).trim() : '';
      let out = imgs.length ? imgs.join('\n\n') : ''; if (cap) out += (out ? '\n\n' : '') + `${getEmphasisMarker()}${cap}${getEmphasisMarker()}`;
      return out ? `\n\n${out}\n\n` : '';
    } catch (e) { console.warn('[mdltx] figureToMd error:', e); return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § Markdown 轉換（行內）
  // ─────────────────────────────────────────────────────────────

  function mdInline(node, ctx) {
    ctx = normalizeCtx(ctx); if (!node || isHiddenInClone(node)) return '';
    try {
      if (node.nodeType === 3) { const raw = node.nodeValue || '', ptag = node.parentElement?.tagName || ''; if (ptag === 'PRE' || ptag === 'CODE') return raw; if (/^\s+$/.test(raw)) return wsTextNodeToSpace(node) || (INLINE_PARENT_TAGS.has(ptag) ? ' ' : ''); return escapeMarkdownText(String(raw).replace(/\s+/g, ' '), ctx); }
      if (node.nodeType !== 1) return '';
      const T = node.tagName;
      if (/^(SCRIPT|STYLE|NOSCRIPT|MJX-ASSISTIVE-MML|TEMPLATE)$/.test(T) || isOurUI(node)) return '';
      if (S.get('ignoreNav') && isNavLike(node)) return '';
      if (node.classList?.contains('mwe-math-element')) { const wiki = processWikipediaMath(node); if (wiki !== null) return wiki; }
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
      if (T === 'IMG') { const wtex = wikipediaImgToTex(node); if (wtex) return wtex; const alt = escapeBracketText((node.getAttribute('alt') || '').trim()), u = absUrl(pickImgSrc(node), ctx.baseUri); return u ? `![${alt}](${escapeLinkDest(u, ctx.inTable)})` : (alt || ''); }
      if (T === 'SUB') return `<sub>${processChildrenInline(node, ctx).trim()}</sub>`;
      if (T === 'SUP') return `<sup>${processChildrenInline(node, ctx).trim()}</sup>`;
      if (T === 'KBD') return `<kbd>${processChildrenInline(node, ctx).trim()}</kbd>`;
      if (T === 'U') return `<u>${processChildrenInline(node, ctx)}</u>`;
      if (T === 'MARK') return `<mark>${processChildrenInline(node, ctx)}</mark>`;
      if (T === 'MATH') return processMathML(node);
      if (node.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"]')) { if (node.closest?.('pre,code')) return node.textContent || ''; let tex = extractTex(node); if (!tex) return ''; const block = isDisplayMath(node, tex); if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex); return block ? `<br>$$ ${tex} $$<br>` : `$${tex}$`; }
      if (BLOCK_TAGS.has(T)) return processChildrenInline(node, ctx).trim();
      return processChildrenInline(node, ctx);
    } catch (e) { console.warn('[mdltx] mdInline error:', e); return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § Markdown 轉換（區塊）
  // ─────────────────────────────────────────────────────────────

  function md(node, ctx) {
    ctx = normalizeCtx(ctx); if (!node || isOurUI(node) || isHiddenInClone(node)) return '';
    try {
      if (node.nodeType === 3) { const raw = node.nodeValue || '', ptag = node.parentElement?.tagName || ''; if (ptag === 'PRE' || ptag === 'CODE') return raw; if (/^\s+$/.test(raw)) return wsTextNodeToSpace(node) || (INLINE_PARENT_TAGS.has(ptag) ? ' ' : ''); return escapeMarkdownText(String(raw).replace(/\s+/g, ' '), ctx); }
      if (node.nodeType !== 1) return '';
      const T = node.tagName;
      if (/^(SCRIPT|STYLE|NOSCRIPT|MJX-ASSISTIVE-MML|TEMPLATE)$/.test(T)) return '';
      if (S.get('ignoreNav') && isNavLike(node)) return '';
      if (node.classList?.contains('mwe-math-element')) { const wiki = processWikipediaMath(node); if (wiki !== null) return wiki; }
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
      if (T === 'DETAILS') { const isOpen = node.hasAttribute('open'), summary = node.querySelector(':scope > summary'), summaryText = summary ? mdInline(summary, ctx).trim() : 'Details';
        if (S.get('detailsStrategy') === 'strict-visual' && !isOpen) return `\n\n<details>\n<summary>${summaryText}</summary>\n\n</details>\n\n`;
        let inner = ''; for (const ch of Array.from(node.childNodes)) if (!(ch.nodeType === 1 && ch.tagName === 'SUMMARY')) inner += md(ch, ctx);
        return `\n\n<details${isOpen ? ' open' : ''}>\n<summary>${summaryText}</summary>\n\n${trimNewlinesOnly(inner)}\n\n</details>\n\n`; }
      if (T === 'TABLE') return `\n\n${tableToMd(node, ctx)}\n\n`;
      if (T === 'PRE') { const cd = node.querySelector('code'), targetEl = cd || node; let lang = targetEl.getAttribute('data-mdltx-lang'); if (lang === null || lang === undefined) lang = detectLang(targetEl); lang = lang || '';
        const body = (targetEl).textContent?.replace(/\n+$/g, '') || '', fence = chooseFence(body); return `\n\n${fence}${lang}\n${body}\n${fence}\n\n`; }
      if (T === 'INPUT') { const type = (node.getAttribute('type') || '').toLowerCase(); if (type === 'checkbox') return (node.checked || node.defaultChecked || node.getAttribute('checked') !== null) ? '[x] ' : '[ ] '; return ''; }
      if (T === 'CODE' && node.parentElement?.tagName !== 'PRE') { const txt = node.textContent || ''; return txt.trim() ? wrapInlineCode(txt) : ''; }
      if (T === 'RUBY') return processRuby(node);
      if (/^H[1-6]$/.test(T)) { const lvl = parseInt(T.slice(1), 10), inner = processChildren(node, ctx).trim(); return inner ? `\n\n${'#'.repeat(lvl)} ${inner}\n\n` : ''; }
      if (T === 'BR') return '<br>\n';
      if (T === 'HR') return `\n\n${getHorizontalRule()}\n\n`;
      if (T === 'A') { const textContent = processChildren(node, { ...ctx, escapeText: false }).trim(), text = textContent || (node.getAttribute('href') || ''), href = hrefForA(node, ctx.baseUri); return href ? mdLink(text, href, ctx.inTable) : escapeLinkLabel(text, ctx); }
      if (T === 'IMG') { const wtex = wikipediaImgToTex(node); if (wtex) return wtex; const alt = escapeBracketText((node.getAttribute('alt') || '').trim()), u = absUrl(pickImgSrc(node), ctx.baseUri); return u ? `![${alt}](${escapeLinkDest(u, ctx.inTable)})` : (alt || ''); }
      if (/^(STRONG|B|EM|I|DEL|S)$/.test(T)) return processInlineFormat(node, T, ctx);
      if (T === 'Q') { const inner = processChildren(node, ctx).trim(); return inner ? `「${inner}」` : ''; }
      if (T === 'SUB') return `<sub>${processChildren(node, ctx).trim()}</sub>`;
      if (T === 'SUP') return `<sup>${processChildren(node, ctx).trim()}</sup>`;
      if (T === 'KBD') return `<kbd>${processChildren(node, ctx).trim()}</kbd>`;
      if (T === 'U') return `<u>${processChildren(node, ctx)}</u>`;
      if (T === 'MARK') return `<mark>${processChildren(node, ctx)}</mark>`;
      if (node.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"]')) { if (node.closest?.('pre,code')) return node.textContent || ''; let tex = extractTex(node); if (!tex) return ''; const block = isDisplayMath(node, tex); if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex); return block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`; }
      if (T === 'BLOCKQUOTE') { let inner = processChildren(node, ctx).replace(/\n{3,}/g, '\n\n').trim().replace(/^\s{4}([-*+] |\d+\. )/gm, '$1'); return `\n\n${inner.split('\n').map(l => l.trim() === '' ? '>' : `> ${l}`).join('\n')}\n\n`; }
      if (T === 'UL' || T === 'OL') { const ordered = T === 'OL'; let idx = 1, out = ''; for (const li of Array.from(node.children)) { if (li.tagName !== 'LI') continue; out += renderLi(li, ctx.depth || 0, ordered ? idx++ : 0, ctx); } return out.trim() ? `\n\n${out}\n\n` : ''; }
      if (T === 'P') { const inner = processChildren(node, ctx).trim(); return inner ? `\n\n${inner}\n\n` : ''; }
      if (/^(DIV|SECTION|ARTICLE|MAIN|NAV|HEADER|FOOTER|ASIDE)$/.test(T)) return `\n\n${processChildren(node, ctx)}\n\n`;
      return processChildren(node, ctx);
    } catch (e) { console.warn('[mdltx] md error:', e); return ''; }
  }

  function renderLi(li, depth, olIndex, ctx) {
    ctx = normalizeCtx(ctx); const indent = ' '.repeat(depth * 4), marker = getListMarker(), prefix = olIndex ? `${olIndex}. ` : `${marker} `;
    let contentParts = '', nestedParts = '';
    try { for (const ch of Array.from(li.childNodes)) { if (ch.nodeType === 1 && (ch.tagName === 'UL' || ch.tagName === 'OL')) nestedParts += md(ch, { ...ctx, depth: depth + 1 }); else contentParts += md(ch, ctx); }
      const content = String(contentParts).replace(/\n{3,}/g, '\n\n').trim(), nested = nestedParts?.trim() ? trimNewlinesOnly(nestedParts) : '';
      if (!content && !nested) return '';
      const lines = content ? content.split('\n') : ['']; let out = `${indent}${prefix}${lines[0] || ''}\n`;
      for (let i = 1; i < lines.length; i++) out += `${indent}    ${lines[i]}\n`;
      if (nested) out += `${nested}\n`;
      return out;
    } catch (e) { console.warn('[mdltx] renderLi error:', e); return ''; }
  }

  // ─────────────────────────────────────────────────────────────
  // § 公式 placeholder 與輸出正規化
  // ─────────────────────────────────────────────────────────────

  function replaceMathWithPlaceholders(container) {
    const map = {}; let id = 0; const nonce = generateNonce();
    try { const selector = '.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"],math,.mwe-math-element,img.mwe-math-fallback-image-inline,img.mwe-math-fallback-image-display';
      container.querySelectorAll(selector).forEach(el => {
        if (el.closest('pre,code') || el.closest?.('[data-mdltx-ui="1"]') || el.closest?.('[data-mdltx-hidden="1"]')) return;
        let out = '';
        if (el.classList?.contains('mwe-math-element')) { out = processWikipediaMath(el) ?? ''; if (out) { const key = makePlaceholder('MATH', nonce, id++); map[key] = out; const sp = document.createElement('span'); sp.textContent = key; el.replaceWith(sp); } return; }
        if (el.closest?.('.mwe-math-element')) return;
        if (el.tagName === 'IMG') { out = wikipediaImgToTex(el) || ''; if (out) { const key = makePlaceholder('MATH', nonce, id++); map[key] = out; const sp = document.createElement('span'); sp.textContent = key; el.replaceWith(sp); } return; }
        if (el.tagName === 'MATH') { out = processMathML(el) || ''; if (out) { const key = makePlaceholder('MATH', nonce, id++); map[key] = out; const sp = document.createElement('span'); sp.textContent = key; el.replaceWith(sp); } return; }
        let tex0 = extractTex(el); if (!tex0) return;
        const block = isDisplayMath(el, tex0); let tex = (block && S.get('stripCommonIndentInBlockMath')) ? stripCommonIndent(tex0) : tex0;
        const key = makePlaceholder('MATH', nonce, id++); map[key] = block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
        const sp = document.createElement('span'); sp.textContent = key; el.replaceWith(sp);
      });
    } catch (e) { console.warn('[mdltx] replaceMathWithPlaceholders error:', e); }
    return map;
  }

  function normalizeOutput(mdText) {
    try { let s = String(mdText || ''); const blocks = {}, nonce = generateNonce(); let bid = 0;
      s = s.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[ \t]*(?=\n|$)/g, (m, p1) => { const key = makePlaceholder('CODEBLOCK', nonce, bid++); blocks[key] = m.slice(p1.length); return p1 + key; });
      s = s.replace(/\u00a0/g, ' ').replace(/[\u200B\u2060\uFEFF]/g, '').replace(/([^\n \t])[ \t]+\n/g, '$1\n').replace(/\n{3,}/g, '\n\n').trim();
      for (const [k, v] of Object.entries(blocks)) s = s.split(k).join(v);
      return s.trim();
    } catch (e) { console.warn('[mdltx] normalizeOutput error:', e); return mdText; }
  }

  // ─────────────────────────────────────────────────────────────
  // § 選取與文章偵測
  // ─────────────────────────────────────────────────────────────

  function getSelection() {
    try { const sel = window.getSelection?.(); if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return { hasSelection: false, range: null };
      const range = sel.getRangeAt(0), fragment = range.cloneContents(); if (!fragment.hasChildNodes()) return { hasSelection: false, range: null };
      const hasMeaningful = (fragment.textContent?.trim() || '') || fragment.querySelector?.('img,svg,math,.katex,mjx-container,table,pre,code,.mwe-math-element,img.mwe-math-fallback-image-inline,img.mwe-math-fallback-image-display');
      return hasMeaningful ? { hasSelection: true, range } : { hasSelection: false, range: null };
    } catch { return { hasSelection: false, range: null }; }
  }

  function hasSelection() { return getSelection().hasSelection; }
  function getSelectionRange() { return getSelection().range; }

  function findArticleRoot() {
    const candidates = [];
    try { for (const sel of ['article', 'main', '[role="main"]', '#content', '#main', '#article', '#post', '.content', '.main', '.article', '.post', '.entry', '.markdown-body']) try { document.querySelectorAll(sel).forEach(el => candidates.push(el)); } catch {}
      Array.from(document.querySelectorAll('section,div')).slice(0, 250).forEach(el => candidates.push(el));
      const isBad = el => /^(NAV|ASIDE|FOOTER|HEADER|FORM)$/.test(el.tagName) || el.closest('nav,aside,footer,header,form') || /^(navigation|banner|contentinfo|complementary)$/.test((el.getAttribute?.('role') || '').toLowerCase());
      const score = el => { if (!el || isBad(el)) return -1e9; const len = (el.textContent || '').trim().length; if (len < 200) return -1e9; return len + (el.querySelectorAll('p').length || 0) * 120 + (el.querySelectorAll('pre,code').length || 0) * 60 - (el.querySelectorAll('a').length || 0) * 30; };
      let best = null, bestScore = -1e9; for (const el of candidates) { const sc = score(el); if (sc > bestScore) { bestScore = sc; best = el; } }
      return best || document.body;
    } catch { return document.body; }
  }

  function isArticleTooSmall(el) { try { const a = (el?.textContent || '').trim().length, b = (document.body?.textContent || '').trim().length || 1; return a < S.get('articleMinChars') || a / b < S.get('articleMinRatio'); } catch { return true; } }
  function decideModeNoSelection() { const m = String(S.get('noSelectionMode') || 'page'); return m === 'article' ? 'article' : 'page'; }

  // ─────────────────────────────────────────────────────────────
  // § 主要流程
  // ─────────────────────────────────────────────────────────────

  function isWikipediaHost() { try { return /(^|\.)wikipedia\.org$/i.test(location.hostname); } catch { return false; } }
  function cleanupWikipediaUiNoise(root) { if (!isWikipediaHost() || !root?.querySelectorAll) return; try { root.querySelectorAll('span.mw-editsection, span[class*="mw-editsection"]').forEach(n => n.remove()); } catch (e) { console.warn('[mdltx] cleanupWikipediaUiNoise error:', e); } }

  async function makeRoot(mode) {
    try { const rng = mode === 'selection' ? getSelectionRange() : null;
      const scope = rng ? ((rng.commonAncestorContainer.nodeType === 1 ? rng.commonAncestorContainer : rng.commonAncestorContainer.parentElement) || document.body) : document.body;
      const hiddenTagged = annotateHidden(scope), iframeTagged = annotateIframes(scope), formatTagged = annotateFormatBoundaries(scope), codeBlockTagged = annotateCodeBlockLanguages(scope);
      await waitForMathJax(scope);
      const mjTagged = annotateMathJax(scope);
      let root, actualMode = mode;
      if (mode === 'selection' && rng) { const box = document.createElement('div'); box.appendChild(rng.cloneContents()); root = box; }
      else if (mode === 'article') { const art = findArticleRoot(); if (!art || art === document.body || isArticleTooSmall(art)) { root = document.body.cloneNode(true); actualMode = 'page'; } else root = art.cloneNode(true); }
      else root = document.body.cloneNode(true);
      cleanupAnnotations(mjTagged, 'data-mdltx-tex'); cleanupAnnotations(mjTagged, 'data-mdltx-display');
      cleanupAnnotations(hiddenTagged, 'data-mdltx-hidden'); cleanupAnnotations(iframeTagged, 'data-mdltx-iframe-md');
      cleanupAnnotations(formatTagged, 'data-mdltx-block'); cleanupAnnotations(codeBlockTagged, 'data-mdltx-lang');
      cleanupWikipediaUiNoise(root);
      try { root.querySelectorAll?.('[data-mdltx-ui="1"],#mdltx-ui-host').forEach(n => n.remove());
        root.querySelectorAll?.('[data-mdltx-hidden="1"]').forEach(n => { if (isMathInfra(n)) { n.removeAttribute('data-mdltx-hidden'); return; } n.remove(); });
        root.querySelectorAll?.('[data-mdltx-processed]').forEach(n => n.removeAttribute('data-mdltx-processed'));
      } catch {}
      return { root, actualMode };
    } catch (e) { console.error('[mdltx] makeRoot error:', e); throw e; }
  }

  async function generateMarkdown(mode) {
    try { const waitMs = S.get('waitBeforeCaptureMs'); if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
      const idleMs = S.get('waitDomIdleMs'); if (idleMs > 0) await waitForDomIdle(idleMs);
      if (mode === 'selection' && !hasSelection()) mode = decideModeNoSelection();
      const { root, actualMode } = await makeRoot(mode);
      const mathMap = replaceMathWithPlaceholders(root);
      const ctx = { depth: 0, escapeText: S.get('escapeMarkdownChars'), inTable: false, baseUri: document.baseURI };
      let out = md(root, ctx);
      for (const k of Object.keys(mathMap)) out = out.split(k).join(mathMap[k]);
      out = normalizeOutput(out);
      return { markdown: out, actualMode, length: out.length };
    } catch (e) { console.error('[mdltx] generateMarkdown error:', e); throw e; }
  }

  async function setClipboardText(text) {
    try { GM_setClipboard(text); return true; }
    catch (e) { try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; } } catch {} throw e; }
  }

  async function copyMarkdown(mode) {
    try { const result = await generateMarkdown(mode); await setClipboardText(result.markdown); return result; }
    catch (e) { console.error('[mdltx] copyMarkdown error:', e); throw e; }
  }

  // ─────────────────────────────────────────────────────────────
  // § 快捷鍵與選單
  // ─────────────────────────────────────────────────────────────

  function installHotkey() {
    window.addEventListener('keydown', async e => {
      try { if (e.repeat || !S.get('hotkeyEnabled')) return;
        const key = (e.key || '').toLowerCase(), targetKey = S.get('hotkeyKey').toLowerCase(); if (key !== targetKey) return;
        if (S.get('hotkeyAlt') !== e.altKey || S.get('hotkeyCtrl') !== e.ctrlKey || S.get('hotkeyShift') !== e.shiftKey || e.metaKey) return;
        const target = e.target; if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
        e.preventDefault(); e.stopPropagation();
        const mode = hasSelection() ? 'selection' : decideModeNoSelection();
        if (ui) await ui.handleCopy(mode); else await copyMarkdown(mode);
      } catch (err) { console.error('[mdltx] Hotkey error:', err); }
    }, true);
  }

  function installMenu() {
    try {
      GM_registerMenuCommand('📋 ' + t('copySelection'), async () => { try { if (ui) await ui.handleCopy('selection'); else await copyMarkdown('selection'); } catch (e) { console.error('[mdltx] Menu command error:', e); } });
      GM_registerMenuCommand('📰 ' + t('copyArticle'), async () => { try { if (ui) await ui.handleCopy('article'); else await copyMarkdown('article'); } catch (e) { console.error('[mdltx] Menu command error:', e); } });
      GM_registerMenuCommand('🌐 ' + t('copyPage'), async () => { try { if (ui) await ui.handleCopy('page'); else await copyMarkdown('page'); } catch (e) { console.error('[mdltx] Menu command error:', e); } });
      GM_registerMenuCommand('💾 ' + t('downloadMd'), async () => { try { if (ui) await ui.handleDownload(); else { const mode = hasSelection() ? 'selection' : decideModeNoSelection(); const result = await generateMarkdown(mode); downloadAsFile(result.markdown, generateFilename()); } } catch (e) { console.error('[mdltx] Menu command error:', e); } });
      GM_registerMenuCommand('⚙️ ' + t('settings'), () => { try { if (ui) ui.showSettings(); } catch (e) { console.error('[mdltx] Menu command error:', e); } });
    } catch (e) { console.warn('[mdltx] Failed to register menu commands:', e); }
  }

  // ─────────────────────────────────────────────────────────────
  // § 初始化
  // ─────────────────────────────────────────────────────────────

  let ui = null;

  function init() {
    try {
      migrateSettings();
      ui = new UIManager();
      ui.init();
      installHotkey();
      installMenu();
      console.log('[mdltx] Copy MD + LaTeX v3.1.0 initialized.');
    } catch (e) { console.error('[mdltx] Initialization failed:', e); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 0);

})();