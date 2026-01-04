// ==UserScript==
// @name         Gemini Singularity (V0.9)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Gemini 聊天页面轻量美化：更舒服的排版 + 发光代码块 & 表格（保持原生布局），主题自适应 + 可访问性增强。
// @author       GQLJ
// @match        https://gemini.google.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMTE4MjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDIwNjE3Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJnbG93IiBjeD0iNTAlIiBjeT0iMCUiIHI9IjcwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2MGE1ZmEiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFkNGVkOCIgc3RvcC1vcGFjaXR5PSIwLjAiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIgcng9IjE0IiBmaWxsPSJ1cmwoI2JnKSIvPgogIDxjaXJjbGUgY3g9IjMyIiBjeT0iMTgiIHI9IjE4IiBmaWxsPSJ1cmwoI2dsb3cpIiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTYlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZTVlN2ViIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZvbnQtd2VpZ2h0PSI3MDAiPgogICAgRwogIDwvdGV4dD4KPC9zdmc+
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557899/Gemini%20Singularity%20%28V09%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557899/Gemini%20Singularity%20%28V09%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = false;
  if (window.top !== window.self) return;

  // =========================
  //  可配置项（菜单开关）
  // =========================
  const DEFAULTS = {
    maxWidth: 980,
    fontSize: 17,
    fontSizeMobile: 16,

    enableRemoteFonts: true,
    enableGlow: true,
    enableEntryAnim: true,
    justifyText: true,
    roundImages: true,
    tableMobileScroll: true,
  };

  const cfg = {
    maxWidth: Number(GM_getValue('maxWidth', DEFAULTS.maxWidth)),
    fontSize: Number(GM_getValue('fontSize', DEFAULTS.fontSize)),
    fontSizeMobile: Number(GM_getValue('fontSizeMobile', DEFAULTS.fontSizeMobile)),

    enableRemoteFonts: !!GM_getValue('enableRemoteFonts', DEFAULTS.enableRemoteFonts),
    enableGlow: !!GM_getValue('enableGlow', DEFAULTS.enableGlow),
    enableEntryAnim: !!GM_getValue('enableEntryAnim', DEFAULTS.enableEntryAnim),
    justifyText: !!GM_getValue('justifyText', DEFAULTS.justifyText),
    roundImages: !!GM_getValue('roundImages', DEFAULTS.roundImages),
    tableMobileScroll: !!GM_getValue('tableMobileScroll', DEFAULTS.tableMobileScroll),
  };

  function toggle(key) {
    GM_setValue(key, !cfg[key]);
    window.location.reload();
  }

  try {
    GM_registerMenuCommand(`远程字体: ${cfg.enableRemoteFonts ? '开' : '关'}`, () => toggle('enableRemoteFonts'));
    GM_registerMenuCommand(`发光效果: ${cfg.enableGlow ? '开' : '关'}`, () => toggle('enableGlow'));
    GM_registerMenuCommand(`入场动画: ${cfg.enableEntryAnim ? '开' : '关'}`, () => toggle('enableEntryAnim'));
    GM_registerMenuCommand(`段落两端对齐: ${cfg.justifyText ? '开' : '关'}`, () => toggle('justifyText'));
    GM_registerMenuCommand(`图片圆角: ${cfg.roundImages ? '开' : '关'}`, () => toggle('roundImages'));
    GM_registerMenuCommand(`移动端表格横滑: ${cfg.tableMobileScroll ? '开' : '关'}`, () => toggle('tableMobileScroll'));
  } catch (_) {}

  // =========================
  //  字体加载（可关）— 用 link 替代 @import
  // =========================
  function injectFonts() {
    if (!cfg.enableRemoteFonts) return;
    const head = document.head || document.documentElement;

    const pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    head.appendChild(pre1);

    const pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = 'anonymous';
    head.appendChild(pre2);

    const link = document.createElement('link');
    link.rel = 'stylesheet';

    // ✅ 修复：URL 不能在单引号字符串里换行
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;750&family=JetBrains+Mono:wght@400;500;600&display=swap';

    head.appendChild(link);
  }
  injectFonts();

  // =========================
  //  阴影强度（可关）
  // =========================
  const glowShadows = cfg.enableGlow
    ? `
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.04),
        0 0 22px var(--singularity-glow-soft),
        0 22px 55px -18px rgba(0,0,0,0.7) !important;
    `
    : `
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.04),
        0 18px 45px -22px rgba(0,0,0,0.55) !important;
    `;

  const glowShadowsHover = cfg.enableGlow
    ? `
      box-shadow:
        0 0 0 1px var(--singularity-glow-strong),
        0 0 40px var(--singularity-glow-strong),
        0 25px 65px -20px rgba(0,0,0,0.85) !important;
    `
    : `
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.06),
        0 22px 55px -24px rgba(0,0,0,0.75) !important;
    `;

  const tableShadows = cfg.enableGlow
    ? `
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.03),
        0 0 18px var(--singularity-glow-soft),
        0 4px 20px rgba(0,0,0,0.05);
    `
    : `
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.03),
        0 4px 18px rgba(0,0,0,0.05);
    `;

  const tableShadowsHover = cfg.enableGlow
    ? `
      box-shadow:
        0 0 0 1px var(--singularity-glow-strong),
        0 0 28px var(--singularity-glow-strong),
        0 6px 28px rgba(0,0,0,0.12);
    `
    : `
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.05),
        0 6px 26px rgba(0,0,0,0.12);
    `;

  const entryAnimCSS = cfg.enableEntryAnim
    ? `
      @keyframes singularFadeIn {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .model-response-text > :is(p, h1, h2, h3, h4, blockquote, table, ul, ol, code-block, mjx-container[display="true"]),
      markdown-renderer > :is(p, h1, h2, h3, h4, blockquote, table, ul, ol, code-block, mjx-container[display="true"]) {
        animation: singularFadeIn 0.45s var(--ease-out-expo) both;
      }
    `
    : `
      .model-response-text > *,
      markdown-renderer > * { animation: none !important; }
    `;

  const justifyCSS = cfg.justifyText
    ? `
      :where(.model-response-text, markdown-renderer) p {
        text-align: justify;
        text-justify: inter-ideograph;
      }
    `
    : `
      :where(.model-response-text, markdown-renderer) p { text-align: left; }
    `;

  const imagesCSS = cfg.roundImages
    ? `
      :where(.model-response-text, markdown-renderer) img {
        max-width: 100%;
        height: auto;
        border-radius: 14px;
        box-shadow: 0 8px 28px rgba(0,0,0,0.08);
      }
    `
    : `
      :where(.model-response-text, markdown-renderer) img {
        max-width: 100%;
        height: auto;
      }
    `;

  const tableMobileCSS = cfg.tableMobileScroll
    ? `
      @media (max-width: 768px) {
        :where(.model-response-text, markdown-renderer) table {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      }
    `
    : '';

  // =========================
  //  CSS
  // =========================
  const css = `
    :root {
      --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
      --glass-blur: blur(20px) saturate(180%);

      --body-font: ${cfg.enableRemoteFonts ? `'Inter', ` : ''}system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --code-font: ${cfg.enableRemoteFonts ? `'JetBrains Mono', ` : ''}'Fira Code', 'Menlo', ui-monospace, SFMono-Regular, monospace;

      --accent: #4285f4;
      --accent-strong: #1a73e8;
      --accent-soft: rgba(66, 133, 244, 0.08);

      --singularity-glow-soft: rgba(138, 180, 248, 0.26);
      --singularity-glow-strong: rgba(138, 180, 248, 0.55);

      --singularity-max-width: ${cfg.maxWidth}px;
      --singularity-font-size: ${cfg.fontSize}px;
      --singularity-font-size-mobile: ${cfg.fontSizeMobile}px;

      /* 代码块：主题自适应变量（默认按浅色） */
      --sg-code-bg: var(--gm-surface-variant, #f6f7f8);
      --sg-code-text: var(--gm-on-surface, #202124);
      --sg-code-border: var(--gm-outline-variant, rgba(0,0,0,0.10));
      --sg-code-header-bg: rgba(255,255,255,0.75);
      --sg-code-header-sep: rgba(0,0,0,0.06);

      scrollbar-width: thin;
      scrollbar-color: var(--gm-outline-variant, rgba(128,128,128,0.2)) transparent;
    }

    /* 深色主题兜底 */
    @media (prefers-color-scheme: dark) {
      :root {
        --sg-code-bg: #050608;
        --sg-code-text: #e4e4e4;
        --sg-code-border: var(--gm-outline-variant, rgba(255,255,255,0.12));
        --sg-code-header-bg: rgba(30, 30, 30, 0.6);
        --sg-code-header-sep: rgba(255,255,255,0.06);
      }
    }

    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: var(--gm-outline-variant, rgba(128,128,128,0.2));
      border-radius: 99px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    ::-webkit-scrollbar-thumb:hover { background-color: var(--gm-outline, rgba(128,128,128,0.5)); }

    .conversation-container,
    .bottom-container,
    .input-area-container {
      max-width: var(--singularity-max-width) !important;
      margin: 0 auto !important;
      padding-inline: 12px;
    }

    ::selection { background: rgba(66, 133, 244, 0.25); color: inherit; }

    ${entryAnimCSS}

    @media (prefers-reduced-motion: reduce) {
      .model-response-text > *,
      markdown-renderer > * { animation: none !important; }
      code-block,
      .model-response-text table,
      markdown-renderer table { transition: none !important; }
    }

    @media (prefers-reduced-transparency: reduce) {
      code-block, :where(.model-response-text, markdown-renderer) table { box-shadow: none !important; }
      .code-block-decoration { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
    }

    :where(.model-response-text, markdown-renderer) {
      font-family: var(--body-font) !important;
      font-size: var(--singularity-font-size) !important;
      line-height: 1.85 !important;
      letter-spacing: 0.012em;
      color: var(--gm-on-surface) !important;
      hyphens: auto;
    }

    :where(.model-response-text, markdown-renderer) :is(h1, h2, h3, h4) {
      font-weight: 750 !important;
      letter-spacing: -0.02em;
      margin-top: 1.8em !important;
      margin-bottom: 0.8em !important;
      color: var(--gm-on-surface);
      position: relative;
    }
    :where(.model-response-text, markdown-renderer) h1 { font-size: 1.6em !important; }
    :where(.model-response-text, markdown-renderer) h2 { font-size: 1.35em !important; }
    :where(.model-response-text, markdown-renderer) h3 { font-size: 1.18em !important; }
    :where(.model-response-text, markdown-renderer) h4 { font-size: 1.05em !important; }

    :where(.model-response-text, markdown-renderer) :is(h1, h2, h3, h4)::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 72px;
      height: 2px;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), transparent);
      opacity: 0.55;
    }

    :where(.model-response-text, markdown-renderer) p { margin-bottom: 1.8em !important; max-width: 100%; }

    ${justifyCSS}

    @media (max-width: 768px) {
      :where(.model-response-text, markdown-renderer) { font-size: var(--singularity-font-size-mobile) !important; }
      :where(.model-response-text, markdown-renderer) p { text-align: left !important; }
    }

    :where(.model-response-text, markdown-renderer) ul li::marker { color: var(--accent); }
    :where(.model-response-text, markdown-renderer) ol li::marker { color: var(--accent); font-weight: 600; font-variant-numeric: tabular-nums; }
    :where(.model-response-text, markdown-renderer) li { padding-left: 4px; margin-bottom: 0.8em !important; }

    :where(.model-response-text, markdown-renderer) a {
      text-decoration: none !important;
      color: var(--accent-strong) !important;
      border-bottom: 1.5px solid rgba(26, 115, 232, 0.3);
      transition: box-shadow 0.18s ease-out, background 0.18s ease-out, border-color 0.18s ease-out;
      font-weight: 500;
      border-radius: 4px;
    }
    :where(.model-response-text, markdown-renderer) a:hover {
      border-bottom-color: var(--accent-strong);
      background: var(--accent-soft);
      box-shadow: 0 0 0 4px var(--accent-soft);
    }
    @media (prefers-color-scheme: dark) {
      :where(.model-response-text, markdown-renderer) a { color: #8ab4f8 !important; border-color: rgba(138, 180, 248, 0.35); }
    }

    :where(.conversation-container, .bottom-container, .input-area-container)
      :is(a, button, [role="button"], input, textarea, select):focus-visible {
      outline: 2px solid var(--accent) !important;
      outline-offset: 3px !important;
      border-radius: 8px;
      box-shadow: 0 0 0 4px var(--accent-soft) !important;
    }

    code-block {
      display: block;
      margin: 32px 0 !important;
      border-radius: 16px !important;
      border: 1px solid var(--sg-code-border) !important;
      background: var(--sg-code-bg) !important;
      ${glowShadows}
      overflow: hidden !important;
      position: relative;
      z-index: 1;
      transition: box-shadow 0.22s var(--ease-out-expo), border-color 0.22s var(--ease-out-expo);
    }
    code-block:hover { border-color: var(--singularity-glow-strong); ${glowShadowsHover} }

    .code-block-decoration {
      height: 50px !important;
      display: flex;
      align-items: center;
      padding: 0 22px !important;
      background: var(--sg-code-header-bg) !important;
      border-bottom: 1px solid var(--sg-code-header-sep);
    }
    @supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
      .code-block-decoration { backdrop-filter: var(--glass-blur) !important; -webkit-backdrop-filter: var(--glass-blur) !important; }
    }

    .code-block-decoration::before {
      content: '';
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ff5f56;
      box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
      margin-right: 20px;
      opacity: 0.8;
      transition: opacity 0.3s;
    }
    code-block:hover .code-block-decoration::before { opacity: 1; }

    code-block pre {
      background: transparent !important;
      padding: 24px !important;
      font-family: var(--code-font) !important;
      font-size: 14.5px !important;
      line-height: 1.7 !important;
      color: var(--sg-code-text) !important;
      text-shadow: none;
      overflow-x: auto;
      tab-size: 4;
    }
    @media (prefers-color-scheme: dark) { code-block pre { text-shadow: 0 1px 2px rgba(0,0,0,0.5); } }

    :where(.model-response-text, markdown-renderer) :not(pre) > code {
      font-family: var(--code-font) !important;
      background: var(--gm-secondary-container, rgba(0,0,0,0.05)) !important;
      color: var(--gm-on-secondary-container, #d93025) !important;
      padding: 4px 8px !important;
      border-radius: 8px !important;
      font-size: 0.85em !important;
      border: 1px solid var(--gm-outline-variant, rgba(0,0,0,0.05));
      vertical-align: baseline;
      font-weight: 600;
      word-break: break-word;
    }

    :where(.model-response-text, markdown-renderer) blockquote {
      border: none !important;
      position: relative;
      margin: 2.4em 0 !important;
      padding: 1.6em 2em !important;
      background: linear-gradient(135deg, var(--gm-surface-variant, rgba(66, 133, 244, 0.05)) 0%, rgba(66, 133, 244, 0.01) 100%);
      border-radius: 16px;
      color: var(--gm-on-surface-variant) !important;
    }
    :where(.model-response-text, markdown-renderer) blockquote::before {
      content: '❝';
      position: absolute;
      top: 10px;
      right: 14px;
      font-size: 28px;
      opacity: 0.18;
      color: var(--accent);
      pointer-events: none;
    }
    :where(.model-response-text, markdown-renderer) blockquote::after {
      content: '';
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 12px;
      width: 3px;
      background: var(--accent);
      border-radius: 0 4px 4px 0;
      box-shadow: 2px 0 8px rgba(66, 133, 244, 0.3);
    }

    :where(.model-response-text, markdown-renderer) table {
      border-collapse: separate !important;
      border-spacing: 0;
      width: 100%;
      margin: 2.4em 0 !important;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--gm-outline-variant, rgba(128,128,128,0.2));
      ${tableShadows}
      transition: box-shadow 0.22s var(--ease-out-expo), border-color 0.22s var(--ease-out-expo);
    }
    :where(.model-response-text, markdown-renderer) table:hover { border-color: var(--singularity-glow-strong); ${tableShadowsHover} }
    :where(.model-response-text, markdown-renderer) th {
      background: var(--gm-surface-variant, #f1f3f4);
      color: var(--gm-on-surface);
      padding: 16px 18px !important;
      font-weight: 700;
      font-size: 0.95em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
    :where(.model-response-text, markdown-renderer) td {
      padding: 14px 18px !important;
      border-top: 1px solid var(--gm-outline-variant, rgba(128,128,128,0.05));
      background: var(--gm-surface, transparent);
      transition: background 0.1s;
    }
    :where(.model-response-text, markdown-renderer) tr:hover td { background: var(--gm-secondary-container, rgba(66, 133, 244, 0.05)); }
    ${tableMobileCSS}

    :where(.model-response-text, markdown-renderer) mjx-container[display="true"] {
      margin: 2.5em 0 !important;
      padding: 1.5em 2em !important;
      background: var(--gm-surface-variant, rgba(128,128,128,0.03));
      border-radius: 12px;
      border: 1px solid var(--gm-outline-variant, transparent);
      color: var(--gm-on-surface) !important;
      overflow-x: auto;
    }

    ${imagesCSS}

    .input-area-container { position: relative; padding-bottom: 40px !important; }

    /* 自定义拖放框：与输入区域宽度对齐 */
    .sg-drop-overlay {
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 8px;
      min-height: 64px;
      border-radius: 18px;
      border: 1.5px dashed var(--accent, #8ab4f8);
      background: rgba(138, 180, 248, 0.06);
      display: none;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      box-sizing: border-box;
      color: var(--gm-on-surface-variant, #8ab4f8);
      font-size: 0.95em;
      text-align: center;
    }
    .sg-drop-overlay--visible { display: flex; }

    @media (forced-colors: active) {
      code-block,
      :where(.model-response-text, markdown-renderer) table,
      :where(.model-response-text, markdown-renderer) blockquote,
      :where(.model-response-text, markdown-renderer) mjx-container[display="true"] {
        box-shadow: none !important;
        background: Canvas !important;
        color: CanvasText !important;
        border: 1px solid CanvasText !important;
      }
      .code-block-decoration {
        background: Canvas !important;
        border-bottom: 1px solid CanvasText !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      :where(.model-response-text, markdown-renderer) :is(h1,h2,h3,h4)::after {
        background: CanvasText !important;
        opacity: 1 !important;
      }
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  // =========================
  //  上传文件：自定义拖放框，对齐输入框
  // =========================
  const DROP_HINT_RE = /(将文件拖放到此处|将文件拖放到这里|Drop (files?|file) here)/i;

  function hideNativeDropOverlay() {
    if (!document.body) return;
    const nodes = document.querySelectorAll('div,span,p');
    for (const el of nodes) {
      const t = (el.textContent || '').trim();
      if (!t || !DROP_HINT_RE.test(t)) continue;
      const box = el.closest('div');
      if (box && !box.dataset.sgDropHidden) {
        box.dataset.sgDropHidden = '1';
        box.style.setProperty('display', 'none', 'important');
        box.style.setProperty('pointer-events', 'none', 'important');
      }
    }
  }

  let customDropOverlay = null;

  function ensureCustomDropOverlay() {
    const root =
      document.querySelector('.input-area-container') ||
      document.querySelector('.bottom-container') ||
      document.body;

    if (!root) return null;

    if (!customDropOverlay) {
      customDropOverlay = document.createElement('div');
      customDropOverlay.className = 'sg-drop-overlay';
      customDropOverlay.textContent = '将文件拖放到此处';
      root.appendChild(customDropOverlay);
    }

    return customDropOverlay;
  }

  function setDropOverlayVisible(visible) {
    const ov = ensureCustomDropOverlay();
    if (!ov) return;
    if (visible) ov.classList.add('sg-drop-overlay--visible');
    else ov.classList.remove('sg-drop-overlay--visible');
    hideNativeDropOverlay();
  }

  function isFileDrag(evt) {
    const dt = evt.dataTransfer;
    if (!dt) return false;
    const types = dt.types;
    if (!types) return false;
    return types.includes
      ? types.includes('Files')
      : Array.prototype.indexOf.call(types, 'Files') !== -1;
  }

  let dragDepth = 0;

  window.addEventListener('dragenter', (e) => {
    if (!isFileDrag(e)) return;
    dragDepth++;
    setDropOverlayVisible(true);
  });

  window.addEventListener('dragover', (e) => {
    if (!isFileDrag(e)) return;
    e.preventDefault();
  });

  window.addEventListener('dragleave', (e) => {
    if (!isFileDrag(e)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) setDropOverlayVisible(false);
  });

  window.addEventListener('drop', (e) => {
    if (!isFileDrag(e)) return;
    dragDepth = 0;
    setDropOverlayVisible(false);
  });

  if (DEBUG) console.log('Gemini Singularity (V0.9) Activated.', cfg);
})();
