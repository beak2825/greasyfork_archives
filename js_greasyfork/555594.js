// ==UserScript==
// @name         ScoreBoard - 扣分计分器
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  悬浮小窗扣分器：自定义扣分项、记录模式、Excel 导入导出、拖拽缩放、最小化悬浮球、全局黑名单 / 白名单（跨站共享）、UI 缩放与字体优化等。
// @author       Tukumi
// @match        *://*/*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555594/ScoreBoard%20-%20%E6%89%A3%E5%88%86%E8%AE%A1%E5%88%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555594/ScoreBoard%20-%20%E6%89%A3%E5%88%86%E8%AE%A1%E5%88%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'lex_scoreboard_pro_v2_2';

  const defaultItems = [
    { reason: '未考虑八进制和十六进制数', score: -1 },
    { reason: '未区分运算符和标点符号',   score: -2 },
    { reason: '未能正确识别字符串',       score: -2 },
    { reason: '未考虑字符类型',           score: -2 },
    { reason: '未对注释识别功能进行充分测试', score: -1 },
    { reason: '未能统计语句行数，字符总数，并输出统计结果', score: -4 },
    { reason: '未能统计各类单词的个数',   score: -4 },
    { reason: '未进行词法错误案例测试',   score: -4 },
    { reason: '未报告错误所在的位置',     score: -2 },
    { reason: '测试案例单一',             score: -2 },
    { reason: '缺乏处理函数和代码',       score: -5 }
  ];

  // 读取配置：优先使用 GM_* 全局存储，兼容旧版 localStorage（自动迁移一次）
  function loadConfig() {
    try {
      let cfg = null;

      // 1) 全局（推荐）：GM_getValue
      if (typeof GM_getValue === 'function') {
        const rawGM = GM_getValue(STORAGE_KEY, null);
        if (rawGM) {
          if (typeof rawGM === 'string') {
            cfg = JSON.parse(rawGM);
          } else if (typeof rawGM === 'object') {
            cfg = rawGM;
          }
        }
      }

      // 2) 若 GM 中没有，则尝试从当前站点 localStorage 迁移（兼容旧版，只迁移一次）
      if (!cfg && typeof localStorage !== 'undefined') {
        const rawLS = localStorage.getItem(STORAGE_KEY);
        if (rawLS) {
          try {
            cfg = JSON.parse(rawLS);
            if (typeof GM_setValue === 'function') {
              GM_setValue(STORAGE_KEY, rawLS);
            }
          } catch (e) {
            // ignore parse error
          }
        }
      }

      if (!cfg) throw 0;

      return {
        items: Array.isArray(cfg.items) && cfg.items.length ? cfg.items : defaultItems.slice(),
        rememberSelection: !!cfg.rememberSelection,
        initialSelectionMode: cfg.initialSelectionMode === 'all' ? 'all' : 'none',
        lastCheckedIndices: Array.isArray(cfg.lastCheckedIndices) ? cfg.lastCheckedIndices : [],
        initialX: typeof cfg.initialX === 'number' ? cfg.initialX : null,
        initialY: typeof cfg.initialY === 'number' ? cfg.initialY : null,
        width: typeof cfg.width === 'number' ? cfg.width : 420,
        height: typeof cfg.height === 'number' ? cfg.height : 360,
        uiScale: typeof cfg.uiScale === 'number' ? cfg.uiScale : 1.0,
        disabledSites: cfg.disabledSites || {},
        whitelistSites: cfg.whitelistSites || {},
        globallyDisabled: !!cfg.globallyDisabled,
        isMinimizeOnStart: cfg.isMinimizeOnStart,
      };
    } catch {
      return {
        items: defaultItems.slice(),
        rememberSelection: false,
        initialSelectionMode: 'none',
        lastCheckedIndices: [],
        initialX: null,
        initialY: null,
        width: 420,
        height: 360,
        uiScale: 1.0,
        disabledSites: {},
        whitelistSites: {},
        globallyDisabled: false,
        isMinimizeOnStart: false,
      };
    }
  }

  let config = loadConfig();
  const host = location.host;

  function isWhitelistMode() {
    return !!(config.whitelistSites && Object.keys(config.whitelistSites).length);
  }

  // 启用逻辑：
  // 1. 若全局禁用，则直接退出。
  // 2. 若白名单非空，则仅在白名单域名上启用（黑名单忽略）。
  // 3. 若白名单为空，则按黑名单与全局禁用逻辑处理。
  if (config.globallyDisabled) return;
  if (isWhitelistMode()) {
    if (!config.whitelistSites[host]) return;
  } else {
    if (config.disabledSites && config.disabledSites[host]) return;
  }

  let saveTimer = null;
  function saveConfig(throttle = true) {
    const data = {
      items: config.items,
      rememberSelection: config.rememberSelection,
      initialSelectionMode: config.initialSelectionMode,
      lastCheckedIndices: config.rememberSelection ? config.lastCheckedIndices.slice(0, 400) : [],
      initialX: config.initialX,
      initialY: config.initialY,
      width: config.width,
      height: config.height,
      uiScale: config.uiScale,
      disabledSites: config.disabledSites || {},
      whitelistSites: config.whitelistSites || {},
      globallyDisabled: !!config.globallyDisabled,
      isMinimizeOnStart: config.isMinimizeOnStart,
    };
    const serialized = JSON.stringify(data);

    const doSave = () => {
      try {
        if (typeof GM_setValue === 'function') {
          GM_setValue(STORAGE_KEY, serialized); // 跨站共享
        }
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, serialized); // 同步一份到当前域，方便调试
        }
      } catch (e) {
        console.warn('[LexScoreBoard] save failed', e);
      }
    };

    if (!throttle) {
      doSave();
    } else {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(doSave, 200);
    }
  }

  // ===== CSS =====
  const css = `
  :root{
    --lex-bg: rgba(10,16,30,0.98);
    --lex-bg-soft: rgba(17,24,39,0.98);
    --lex-accent: #3b82f6;
    --lex-accent-soft: rgba(59,130,246,0.18);
    --lex-border-subtle: rgba(148,163,253,0.28);
    --lex-text-main: #e5e7eb;
    --lex-text-sub: #9ca3af;
    --lex-radius-xl: 16px;
    --lex-shadow-soft: 0 16px 44px rgba(15,23,42,0.78);
    --lex-font: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
    --lex-trans-fast: 0.16s ease-out;
  }
  body{
    line-height: 22px;
  }
  .lex-sb-card{
    position: fixed;
    top: 20px; right: 20px;
    width: ${config.width}px; height: ${config.height}px;
    max-width: 86vw; max-height: 86vh;
    min-width: 300px; min-height: 220px;
    background: radial-gradient(circle at top left, rgba(56,189,248,0.06), transparent) var(--lex-bg-soft);
    border-radius: var(--lex-radius-xl);
    box-shadow: var(--lex-shadow-soft);
    border: 1px solid rgba(148,163,253,0.40);
    backdrop-filter: blur(16px) saturate(160%);
    display:flex; flex-direction:column; overflow:hidden;
    z-index: 999999;
    font-family: var(--lex-font);
    color: var(--lex-text-main);
    transform-origin: top left;
    transform: scale(var(--lex-ui-scale,1));
  }
  .lex-sb-header{
    padding: 8px 10px 6px;
    display:flex; align-items:center; justify-content:space-between; gap:8px;
    cursor: move; user-select:none;
    background: linear-gradient(to right, rgba(59,130,246,0.30), transparent);
    border-bottom: 1px solid rgba(148,163,253,0.26);
  }
  .lex-sb-title-wrap{display:flex;flex-direction:column;gap:2px;}
  .lex-sb-title{ font-size:16px; font-weight:700; color:#f3f4f6; }
  .lex-sb-sub{ font-size:12px; color:var(--lex-text-sub); }
  .lex-sb-actions{ display:flex; align-items:center; gap:6px; }
  .lex-sb-btn-icon{
    width:18px; height:18px; border-radius: 50%; border: 1px solid rgba(148,163,253,0.5);
    display:flex; align-items:center; justify-content:center; cursor:pointer;
    color:#e5e7eb; background:transparent; padding:0 0 0 0.5px; font-size:12px;
    box-sizing:border-box; line-height:12;
    transition:all var(--lex-trans-fast);
  }
  .lex-sb-btn-icon:hover{
    border-color:rgba(148,163,253,0.7);
    background:rgba(15,23,42,0.98);
    box-shadow:0 0 8px rgba(148,163,253,0.6);
  }
  .lex-sb-body{ padding:10px; display:flex; flex-direction:column; gap:8px; flex:1; overflow:hidden; font-size:14px; }
  .lex-sb-mode-bar{ display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; border-radius:10px; background:rgba(9,9,11,0.98); border:1px solid rgba(75,85,99,0.9); color:var(--lex-text-sub); font-size:13px; }
  .lex-sb-mode-label span.lex-on{color:#22c55e;font-weight:700;}
  .lex-sb-mode-label span.lex-off{color:#9ca3af;}
  .lex-sb-row-head{ display:grid; grid-template-columns:2.6fr 0.8fr; gap:6px; padding:4px 8px; text-transform:uppercase; letter-spacing:0.12em; font-size:11px; color:var(--lex-text-sub); }
  .lex-sb-list{
    flex:1; overflow-y:auto; padding-right:4px; margin-right:-2px;
  }
  .lex-sb-row{
    display:grid; grid-template-columns:2.6fr 0.8fr; gap:6px;
    padding:6px 8px; align-items:center;
    border-radius:10px;
    background:radial-gradient(circle at top,rgba(148,163,253,0.07),transparent);
    border:1px solid transparent;
    transition:all var(--lex-trans-fast);
  }
  .lex-sb-row:hover{
    background:radial-gradient(circle at top,rgba(59,130,246,0.14),rgba(6,8,15,0.98));
    border-color:rgba(59,130,246,0.5);
    box-shadow:0 6px 18px rgba(15,23,42,0.92);
    transform:translateY(-1px);
  }
  .lex-sb-reason{ font-size:14px; line-height:1.6; cursor:pointer; position:relative; padding-right:18px; }
  .lex-sb-reason::after{
    content:"复制";
    position:absolute; right:0; top:50%;
    transform:translateY(-50%);
    font-size:10px; padding:1px 6px;
    border-radius:999px;
    background:rgba(10,16,30,1);
    border:1px solid rgba(148,163,253,0.5);
    color:var(--lex-accent);
    opacity:0; pointer-events:none;
    transition:opacity var(--lex-trans-fast);
  }
  .lex-sb-row:hover .lex-sb-reason::after{opacity:1;}
  .lex-sb-score-col{ display:flex; justify-content:flex-end; align-items:center; }
  .lex-sb-check-label{ display:inline-flex; align-items:center; gap:6px; padding:4px 10px 4px 6px; border-radius:999px; background:rgba(5,5,8,0.98); border:1px solid rgba(148,163,253,0.6); color:#f97316; font-size:14px; cursor:pointer; transition:all var(--lex-trans-fast); }
  .lex-sb-check-label:hover{
    background:var(--lex-accent-soft);
    box-shadow:0 3px 10px rgba(15,23,42,0.96);
    transform:translateY(-1px);
  }
  .lex-sb-checkbox{
    width:16px; height:16px; margin:0;
    accent-color:var(--lex-accent);
    cursor:pointer;
  }
  .lex-sb-summary{
    margin-top:2px; padding:6px 8px;
    border-radius:12px;
    border:1px solid var(--lex-border-subtle);
    background:radial-gradient(circle at top,rgba(59,130,246,0.12),rgba(5,5,8,0.98));
    display:grid; grid-template-columns:2.6fr 1fr;
    gap:8px; align-items:flex-start;
  }
  .lex-sb-summary-label{ font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--lex-text-sub); }
  .lex-sb-summary-text{ min-height:30px; max-height:70px; overflow-y:auto; font-size:14px; line-height:1.5; padding:8px 10px; border-radius:8px; background:rgba(5,5,8,0.98); border:1px solid rgba(75,85,99,0.96); color:#bfdbfe; cursor:pointer; position:relative; word-break:break-all; }
  .lex-sb-summary-text::after{
    content:"点击复制汇总";
    position:absolute; right:6px; bottom:4px;
    font-size:10px; color:var(--lex-text-sub);
    opacity:0; transition:opacity var(--lex-trans-fast);
  }
  .lex-sb-summary-text:hover{
    border-color:var(--lex-accent);
    box-shadow:0 3px 12px rgba(15,23,42,0.96);
  }
  .lex-sb-summary-text:hover::after{opacity:1;}
  .lex-sb-total{ font-size:22px; font-weight:700; padding:8px 10px; border-radius:10px; text-align:right; background:rgba(5,5,8,0.98); border:1px solid rgba(75,85,99,1); color:#f97316; box-shadow:inset 0 0 10px rgba(15,23,42,0.96); }
  .lex-sb-footer{
    display:flex; justify-content:space-between;
    align-items:center; gap:8px;
  }
  .lex-sb-btn{ padding:7px 12px; border-radius:999px; border:1px solid rgba(148,163,253,0.6); background:transparent; color:#e5e7eb; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all var(--lex-trans-fast); }
  .lex-sb-btn:hover{
    color:#fee2e2; border-color:#f97316;
    background:radial-gradient(circle at top,rgba(248,250,252,0.04),transparent);
    box-shadow:0 3px 12px rgba(15,23,42,0.96);
    transform:translateY(-1px);
  }
  .lex-sb-resize{
    position:absolute; right:4px; bottom:4px;
    width:14px; height:14px; cursor:se-resize; opacity:0.8;
    background:linear-gradient(135deg,transparent 0,transparent 50%, rgba(148,163,253,0.9) 51%, rgba(148,163,253,1) 100%);
    border-bottom-right-radius:var(--lex-radius-xl);
  }

  .lex-sb-settings-mask{
    position:absolute; inset:0;
    background:rgba(15,23,42,0.84);
    backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:10;
  }
  .lex-sb-settings{
    width:94%; max-height:94%;
    background:rgba(9,9,11,0.98);
    border-radius:12px;
    border:1px solid rgba(148,163,253,0.6);
    padding:10px;
    display:flex; flex-direction:column; gap:8px;
    font-size:13px; color:var(--lex-text-main);
    overflow:auto;
  }
  .lex-sb-settings-title{
    font-size:15px; font-weight:700;
    display:flex; justify-content:space-between; align-items:center;
  }
  .lex-sb-settings-close{
    cursor:pointer; padding:4px 8px;
    border-radius:6px;
    border:1px solid rgba(148,163,253,0.6);
    font-size:12px; color:var(--lex-text-main);
  }
  .lex-sb-settings-row{
    display:flex; gap:10px;
    align-items:center; flex-wrap:wrap;
  }
  .lex-sb-settings input[type="number"],
  .lex-sb-settings textarea,
  .lex-sb-settings select{
    background:rgba(3,7,18,0.98);
    border:1px solid rgba(75,85,99,1);
    color:var(--lex-text-main);
    border-radius:6px;
    font-size:13px;
    padding:6px 8px;
    box-sizing:border-box;
  }
  .lex-sb-settings textarea{
    width:100%; min-height:96px;
    resize:vertical; line-height:1.6;
  }
  .lex-sb-settings small{
    color:var(--lex-text-sub); font-size:12px;
  }
  .lex-sb-settings-btn{
    padding:6px 10px;
    border-radius:8px;
    border:1px solid rgba(148,163,253,0.6);
    background:transparent;
    color:var(--lex-text-main); font-size:12px;
    cursor:pointer;
    transition:all var(--lex-trans-fast);
  }
  .lex-sb-settings-btn:hover{
    color:#bfdbfe; background:rgba(17,24,39,0.98);
  }

  .lex-file-wrap{
    position:relative;
    display:inline-flex;
    align-items:center;
    cursor:pointer;
  }
  .lex-file-choose{
    padding:6px 10px;
    border-radius:8px;
    border:1px dashed rgba(148,163,253,0.6);
    background:rgba(17,24,39,0.98);
    color:#bfdbfe;
    cursor:pointer;
    transition:all var(--lex-trans-fast);
  }
  .lex-hidden-input{
    position:absolute;
    inset:0;
    opacity:0;
    cursor:pointer;
  }

  .lex-sb-close-mask{
    position:fixed; inset:0;
    background:rgba(15,23,42,0.6);
    backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
    z-index:1000000;
  }
  .lex-sb-close-dialog{
    width:300px; background:#fff;
    border-radius:14px;
    padding:16px 16px 12px;
    box-shadow:0 16px 40px rgba(15,23,42,0.32);
    color:#111827;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    font-size:14px;
  }
  .lex-sb-close-title{
    font-size:16px; font-weight:700;
    margin-bottom:8px;
    display:flex; justify-content:space-between; align-items:center;
  }
  .lex-sb-close-x{ cursor:pointer; font-size:18px; color:#9ca3af; }
  .lex-sb-close-option{
    display:flex; align-items:center; gap:8px;
    margin-bottom:8px; font-size:14px;
  }
  .lex-sb-close-option input{ accent-color:#ec4899; }
  .lex-sb-close-actions{
    display:flex; justify-content:flex-end;
    gap:10px; margin-top:8px;
  }
  .lex-sb-close-btn{
    padding:6px 14px;
    border-radius:999px;
    border:1px solid #f9a8d4;
    font-size:14px;
    cursor:pointer;
    background:#fff; color:#ec4899;
  }
  .lex-sb-close-btn.cancel{
    border-color:#e5e7eb; color:#6b7280;
  }
  .lex-sb-close-btn.confirm{
    background:#ec4899; color:#fff;
    border-color:#ec4899;
  }

  .lex-minimized .lex-sb-body,
  .lex-minimized .lex-sb-resize{
    display:none;
  }
  .lex-minimized .lex-sb-sub{ font-size:12px; color:var(--lex-text-sub); }
  .lex-minimized{
    height:56px !important;
    min-width:0 !important;
    min-height:0 !important;
    max-height:56px !important;
    overflow:hidden !important;
    padding:0 !important;
    box-shadow:0 20px 40px rgba(15,23,42,0.55);
    background:linear-gradient(to right,#0f172a,#111827,#020817) !important;
  }
  .lex-minimized .lex-sb-header{
    padding:8px 10px 6px; border-bottom:none; cursor:move; align-items:center;
  }

  .lex-bubble{
    width:48px !important;
    height:48px !important;
    min-width:0 !important;
    min-height:0 !important;
    max-width:48px !important;
    max-height:48px !important;
    border-radius:9999px !important;
    padding:0 !important;
    box-shadow:0 10px 26px rgba(15,23,42,0.65);
    overflow:hidden !important;
    display:flex;
    align-items:center;
    justify-content:center;
    position:fixed;
    background:radial-gradient(circle at top,rgba(59,130,246,0.22),rgba(9,9,11,1));
  }
  .lex-bubble .lex-sb-title-wrap{ display:none; }
  .lex-bubble .lex-sb-body,
  .lex-bubble .lex-sb-resize{ display:none; }
  .lex-bubble .lex-sb-header{
    padding:0;
    border:none;
    background:transparent;
    cursor:pointer;
    justify-content:center;
    align-items:center;
    display:flex;
    width:100%;
    height:100%;
  }
  .lex-bubble .lex-sb-actions{
    gap:0;
    display:none;
    align-items:center;
    justify-content:center;
    width:100%;
  }
  .lex-bubble .lex-sb-btn-icon{
    display:none;
  }
  .lex-icon-bubble{
    width:22px;
    height:22px;
    border-radius:6px;
    background:linear-gradient(to bottom, #111827, #020817);
    box-shadow:0 0 4px rgba(148,163,253,0.7) inset, 0 0 6px rgba(148,163,253,0.45);
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .lex-icon-bubble::before{
    content:"";
    position:absolute;
    inset:4px 0px;
    border-radius:4px;
    background:
      repeating-linear-gradient(
        to right,
        rgba(248,250,252,0.0),
        rgba(248,250,252,0.0) 3px,
        rgba(248,250,252,0.9) 3px,
        rgba(248,250,252,0.9) 4px
      );
    opacity:0.9;
  }
  .lex-icon-bubble::after{
    content:"";
    position:absolute;
    inset:4px 0px;
    left:3px;
    right:3px;
    bottom:5px;
    border-radius:50%;
    background:linear-gradient(to right,#f97316,#22c55e,#3b82f6);
    opacity:0.96;
  }
  .lex-bubble:hover{
    transform:translateY(-2px);
    box-shadow:0 18px 40px rgba(15,23,42,0.9);
  }
  .lex-bubble:hover .lex-icon-bubble{
    transform:scale(1.06);
    box-shadow:0 0 9px rgba(148,163,253,1);
  }
  .lex-sb-list::-webkit-scrollbar,
  .lex-sb-summary-text::-webkit-scrollbar{
    width:6px; height:6px;
  }
  .lex-sb-list::-webkit-scrollbar-thumb,
  .lex-sb-summary-text::-webkit-scrollbar-thumb{
    background:rgba(148,163,253,0.55);
    border-radius:999px;
  }

  .lex-sb-toast{
    position:fixed;
    left:50%; bottom:18px;
    transform:translateX(-50%) translateY(40px);
    padding:4px 10px;
    border-radius:999px;
    font-size:10px;
    background:rgba(5,5,8,0.98);
    color:var(--lex-text-main);
    border:1px solid rgba(148,163,253,0.55);
    box-shadow:0 8px 26px rgba(15,23,42,0.98);
    opacity:0; pointer-events:none;
    transition:all 0.22s cubic-bezier(.33,.02,.11,.99);
    z-index:999999;
    backdrop-filter:blur(14px) saturate(160%);
  }
  .lex-sb-toast-show{
    opacity:1;
    transform:translateX(-50%) translateY(0);
  }
  .lex-minimized .lex-sb-actions{
    margin-left:auto;
    gap:6px;
  }
  `;
  if (typeof GM_addStyle !== 'undefined') GM_addStyle(css);
  else { const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }

  // ===== UI 构建 =====
  const card = document.createElement('div');
  card.className = 'lex-sb-card';
  card.style.setProperty('--lex-ui-scale', config.uiScale);

  if (config.initialX != null && config.initialY != null) {
    card.style.left = config.initialX + 'px';
    card.style.top = config.initialY + 'px';
    card.style.right = 'auto';
  }

  const header = document.createElement('div'); header.className = 'lex-sb-header';
  const titleWrap = document.createElement('div'); titleWrap.className = 'lex-sb-title-wrap';
  const title = document.createElement('div'); title.className = 'lex-sb-title'; title.textContent = '扣分计分器';
  const sub = document.createElement('div'); sub.className = 'lex-sb-sub'; sub.textContent = '悬浮小窗 · 自定义 · 记录模式';
  titleWrap.appendChild(title); titleWrap.appendChild(sub);

  const actions = document.createElement('div'); actions.className = 'lex-sb-actions';
  const settingsBtn = btnIcon('⚙','设置');
  const recordToggleBtn = btnIcon('📑','切换记录模式');
  const minimizeBtn = btnIcon('—','最小化');
  const closeBtn = btnIcon('✕','关闭');
  const bubbleIcon = document.createElement('span');
  bubbleIcon.className = 'lex-icon-bubble';
  bubbleIcon.textContent = '';

  actions.appendChild(settingsBtn);
  actions.appendChild(recordToggleBtn);
  actions.appendChild(minimizeBtn);
  actions.appendChild(closeBtn);
  header.appendChild(titleWrap);
  header.appendChild(actions);

  const body = document.createElement('div'); body.className = 'lex-sb-body';

  const modeBar = document.createElement('div'); modeBar.className = 'lex-sb-mode-bar';
  const modeLabel = document.createElement('div'); modeLabel.className = 'lex-sb-mode-label';
  const modeButtons = document.createElement('div'); modeButtons.style.display='flex'; modeButtons.style.gap='6px';

  const startRecordBtn = mkBtn('开始记录');
  const confirmRecordBtn = mkBtn('确认本次扣分'); confirmRecordBtn.style.display='none';
  const endRecordBtn = mkBtn('结束并导出'); endRecordBtn.style.display='none';

  modeButtons.appendChild(startRecordBtn);
  modeButtons.appendChild(confirmRecordBtn);
  modeButtons.appendChild(endRecordBtn);
  modeBar.appendChild(modeLabel);
  modeBar.appendChild(modeButtons);
  body.appendChild(modeBar);

  const headRow = document.createElement('div'); headRow.className = 'lex-sb-row-head';
  const h1 = document.createElement('div'); h1.textContent = '错误类型（点击复制）';
  const h2 = document.createElement('div'); h2.style.textAlign = 'right'; h2.textContent = '扣分';
  headRow.appendChild(h1); headRow.appendChild(h2);
  body.appendChild(headRow);

  const list = document.createElement('div'); list.className = 'lex-sb-list';
  body.appendChild(list);

  const summaryWrap = document.createElement('div'); summaryWrap.className = 'lex-sb-summary';
  const summaryItem = block('原因汇总');
  const summaryText = document.createElement('div'); summaryText.className = 'lex-sb-summary-text';
  summaryItem.appendChild(summaryText);
  const totalItem = block('总扣分');
  const totalText = document.createElement('div'); totalText.className = 'lex-sb-total';
  totalText.textContent = '0';
  totalItem.appendChild(totalText);
  summaryWrap.appendChild(summaryItem);
  summaryWrap.appendChild(totalItem);
  body.appendChild(summaryWrap);

  const footer = document.createElement('div'); footer.className = 'lex-sb-footer';
  const selectAllBtn = mkBtn('全选');
  const clearSelectionBtn = mkBtn('清空勾选');
  const clearItemsBtn = mkBtn('清空扣分项');
  footer.appendChild(selectAllBtn);
  footer.appendChild(clearSelectionBtn);
  footer.appendChild(clearItemsBtn);
  body.appendChild(footer);

  const resizeHandle = document.createElement('div'); resizeHandle.className = 'lex-sb-resize';

  card.appendChild(header);
  card.appendChild(body);
  card.appendChild(resizeHandle);

  const toast = document.createElement('div'); toast.className = 'lex-sb-toast';
  document.body.appendChild(card);
  document.body.appendChild(toast);

  function btnIcon(txt, title){
    const b=document.createElement('button');
    b.className='lex-sb-btn-icon';
    b.title=title;
    b.textContent=txt;
    return b;
  }
  function mkBtn(txt){
    const b=document.createElement('button');
    b.className='lex-sb-btn';
    b.textContent=txt;
    return b;
  }
  function block(label){
    const wrap=document.createElement('div');
    wrap.className='lex-sb-summary-item';
    const lab=document.createElement('div');
    lab.className='lex-sb-summary-label';
    lab.textContent=label;
    wrap.appendChild(lab);
    return wrap;
  }

  // ===== 状态 =====
  let currentItems = (config.items && config.items.length ? config.items : defaultItems.slice())
    .map(i => ({ reason:String(i.reason||'').trim(), score:Number(i.score)||0 }));
  let inRecordMode=false, recordStarted=false, recordData=[], lastConfirmClickTime=0;
  let minimized=false, bubble=false;
  let __lex_justDragged=false;

  // ===== 工具 =====
  function showToast(msg){
    toast.textContent=msg;
    toast.classList.add('lex-sb-toast-show');
    clearTimeout(showToast._t);
    showToast._t=setTimeout(()=>toast.classList.remove('lex-sb-toast-show'),1300);
  }
  function copyText(text){
    if (!text) return;
    if (navigator.clipboard?.writeText)
      navigator.clipboard.writeText(text)
        .then(()=>showToast('已复制：'+(text.length>40?text.slice(0,40)+'...':text)))
        .catch(()=>fallbackCopy(text));
    else fallbackCopy(text);
  }
  function fallbackCopy(text){
    const ta=document.createElement('textarea');
    ta.value=text;
    ta.style.position='fixed';
    ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); showToast('已复制'); }catch{}
    document.body.removeChild(ta);
  }

  // ===== 渲染 =====
  function renderModeLabel(){
    if (!inRecordMode) modeLabel.innerHTML='模式：<span class="lex-off">普通模式</span>';
    else if (!recordStarted) modeLabel.innerHTML='模式：<span class="lex-on">记录模式</span>（未开始）';
    else modeLabel.innerHTML='模式：<span class="lex-on">记录模式</span>（记录中 · '+recordData.length+'条）';
  }
  function renderRecordButtons(){
    if (!inRecordMode){
      startRecordBtn.style.display='';
      confirmRecordBtn.style.display='none';
      endRecordBtn.style.display='none';
      return;
    }
    if (!recordStarted){
      startRecordBtn.style.display='';
      confirmRecordBtn.style.display='none';
      endRecordBtn.style.display='none';
    } else {
      startRecordBtn.style.display='none';
      confirmRecordBtn.style.display='';
      endRecordBtn.style.display='';
    }
  }
  function renderList(){
    list.innerHTML='';
    currentItems.forEach((item, index)=>{
      if (!item || !item.reason) return;
      const row=document.createElement('div'); row.className='lex-sb-row';
      const reason=document.createElement('div');
      reason.className='lex-sb-reason';
      reason.textContent=item.reason;
      reason.dataset.index=index;
      const scoreCol=document.createElement('div'); scoreCol.className='lex-sb-score-col';
      const label=document.createElement('label'); label.className='lex-sb-check-label';
      const cb=document.createElement('input');
      cb.type='checkbox';
      cb.className='lex-sb-checkbox';
      cb.dataset.index=index;
      cb.dataset.score=item.score;
      const span=document.createElement('span'); span.textContent=item.score;
      label.appendChild(cb); label.appendChild(span);
      scoreCol.appendChild(label);
      row.appendChild(reason); row.appendChild(scoreCol);
      list.appendChild(row);
    });
    const cbs=list.querySelectorAll('.lex-sb-checkbox');
    if (config.rememberSelection && config.lastCheckedIndices?.length) {
      cbs.forEach(cb=>{
        const idx=Number(cb.dataset.index);
        cb.checked=config.lastCheckedIndices.includes(idx);
      });
    } else {
      const all=config.initialSelectionMode==='all';
      cbs.forEach(cb=>cb.checked=all);
    }
    updateSummaryAndRemember();
  }
  function updateSummaryAndRemember(){
    const cbs=list.querySelectorAll('.lex-sb-checkbox');
    const reasons=[]; let total=0; const checkedIdx=[];
    cbs.forEach(cb=>{
      if(cb.checked){
        const idx=Number(cb.dataset.index);
        const it=currentItems[idx];
        if(!it) return;
        reasons.push(it.reason);
        total+=Number(it.score)||0;
        checkedIdx.push(idx);
      }
    });
    summaryText.textContent=reasons.join('；');
    totalText.textContent=String(total);
    if (config.rememberSelection){
      config.lastCheckedIndices=checkedIdx;
      saveConfig(true);
    }
  }
  function clearSelection(){
    list.querySelectorAll('.lex-sb-checkbox').forEach(cb=>cb.checked=false);
    summaryText.textContent='';
    totalText.textContent='0';
    config.lastCheckedIndices=[];
    saveConfig(true);
  }
  function selectAll(){
    list.querySelectorAll('.lex-sb-checkbox').forEach(cb=>cb.checked=true);
    updateSummaryAndRemember();
  }

  // ===== 事件：列表复制 & 勾选 =====
  list.addEventListener('click', e=>{
    const n=e.target.closest('.lex-sb-reason');
    if(n){
      const idx=Number(n.dataset.index);
      const it=currentItems[idx];
      if(it) copyText(it.reason);
    }
  });
  list.addEventListener('change', e=>{
    if(e.target.classList.contains('lex-sb-checkbox')) updateSummaryAndRemember();
  });
  summaryText.addEventListener('click', ()=>{
    const t=summaryText.textContent.trim();
    if(!t){ showToast('当前没有已选原因'); return; }
    copyText(t);
  });
  selectAllBtn.addEventListener('click', selectAll);
  clearSelectionBtn.addEventListener('click', clearSelection);
  clearItemsBtn.addEventListener('click', ()=>{
    if(!currentItems.length) return;
    if(!confirm('确定要清空所有扣分项吗？（可在设置中恢复默认）')) return;
    currentItems=[];
    config.items=[];
    renderList();
    saveConfig(false);
    showToast('已清空所有扣分项');
  });

  // ===== 拖拽 =====
  (function enableDrag(){
    let down=false, dx=0, dy=0, sx=0, sy=0, moved=false;
    function start(x,y){
      down=true; moved=false; sx=x; sy=y;
      const r=card.getBoundingClientRect();
      dx=x-r.left; dy=y-r.top;
      header.classList.add('dragging');
    }
    function move(x,y){
      if(!down) return;
      if (Math.abs(x - sx) + Math.abs(y - sy) > 3) moved = true;
      const scale=config.uiScale||1;
      let nx=x-dx, ny=y-dy;
      const maxX=window.innerWidth - card.offsetWidth*scale;
      const maxY=window.innerHeight - card.offsetHeight*scale;
      nx=Math.max(4, Math.min(maxX-4, nx));
      ny=Math.max(4, Math.min(maxY-4, ny));
      card.style.left=nx+'px';
      card.style.top=ny+'px';
      card.style.right='auto';
    }
    function end(){
      if(!down) return;
      down=false;
      header.classList.remove('dragging');
      const r=card.getBoundingClientRect();
      config.initialX=r.left;
      config.initialY=r.top;
      saveConfig(true);
      if (minimized) maybeSnapToEdge();
      __lex_justDragged = moved;
      if (__lex_justDragged) setTimeout(()=>{ __lex_justDragged=false; }, 220);
    }
    header.addEventListener('mousedown', e=>{
      if(e.button!==0) return;
      start(e.clientX,e.clientY);
      e.preventDefault();
    });
    document.addEventListener('mousemove', e=>move(e.clientX,e.clientY));
    document.addEventListener('mouseup', end);
    header.addEventListener('touchstart', e=>{
      const t=e.touches[0];
      start(t.clientX,t.clientY);
    }, {passive:true});
    document.addEventListener('touchmove', e=>{
      if(!down) return;
      const t=e.touches[0];
      move(t.clientX,t.clientY);
    }, {passive:true});
    document.addEventListener('touchend', end);
  })();

  // ===== 缩放 =====
  (function enableResize(){
    let resizing=false, sx=0, sy=0, sw=0, sh=0;
    resizeHandle.addEventListener('mousedown', e=>{
      e.preventDefault();
      resizing=true;
      sx=e.clientX; sy=e.clientY;
      const r=card.getBoundingClientRect();
      sw=r.width; sh=r.height;
    });
    document.addEventListener('mousemove', e=>{
      if(!resizing) return;
      let nw=sw+(e.clientX-sx);
      let nh=sh+(e.clientY-sy);
      nw=Math.max(300, Math.min(window.innerWidth*0.86, nw));
      nh=Math.max(220, Math.min(window.innerHeight*0.86, nh));
      card.style.width=nw+'px';
      card.style.height=nh+'px';
    });
    document.addEventListener('mouseup', ()=>{
      if(!resizing) return;
      resizing=false;
      const r=card.getBoundingClientRect();
      config.width=r.width;
      config.height=r.height;
      saveConfig(true);
    });
  })();

  // ===== 设置面板 =====
  function openSettings(){
    if (card.querySelector('.lex-sb-settings-mask')) return;

    const mask=document.createElement('div'); mask.className='lex-sb-settings-mask';
    const panel=document.createElement('div'); panel.className='lex-sb-settings';

    const titleRow=document.createElement('div'); titleRow.className='lex-sb-settings-title';
    titleRow.innerHTML='<span>设置</span>';
    const closeS=document.createElement('div'); closeS.className='lex-sb-settings-close'; closeS.textContent='关闭';
    titleRow.appendChild(closeS);
    panel.appendChild(titleRow);

    // 记忆 + 初始勾选 + UI缩放
    const row1=document.createElement('div'); row1.className='lex-sb-settings-row';
    const rememberCb=checkboxWithLabel('记住上次勾选状态', config.rememberSelection, v=>{
      config.rememberSelection=v;
      if(!v) config.lastCheckedIndices=[];
      saveConfig(true);
    });
    row1.appendChild(rememberCb.wrap);

    const selLabel=document.createElement('label'); selLabel.textContent=' 初始勾选：';
    const selSelect=document.createElement('select');
    ['none','all'].forEach(v=>{
      const o=document.createElement('option');
      o.value=v;
      o.textContent=(v==='none'?'默认全不选':'默认全选（排除法）');
      if(config.initialSelectionMode===v) o.selected=true;
      if(v === 'all') selectAll();
      else if(v === 'none') clearSelection();
      selSelect.appendChild(o);
    });
    selSelect.onchange=()=>{
      config.initialSelectionMode=selSelect.value;
      saveConfig(true);
    };
    selLabel.appendChild(selSelect);
    row1.appendChild(selLabel);

    const scaleLabel=document.createElement('label'); scaleLabel.textContent=' UI缩放：';
    const scaleRange=document.createElement('input');
    scaleRange.type='range';
    scaleRange.min='0.85'; scaleRange.max='1.6'; scaleRange.step='0.05';
    scaleRange.value=String(config.uiScale||1);
    const scaleVal=document.createElement('span'); scaleVal.textContent=String(config.uiScale||1);
    scaleRange.oninput=()=>{
      config.uiScale=parseFloat(scaleRange.value)||1;
      card.style.setProperty('--lex-ui-scale', config.uiScale);
      scaleVal.textContent=String(config.uiScale);
      saveConfig(true);
    };
    scaleLabel.appendChild(scaleRange);
    scaleLabel.appendChild(scaleVal);
    row1.appendChild(scaleLabel);

    const minimizeOnStart = checkboxWithLabel('启动即最小化', config.isMinimizeOnStart, v=>{
      config.isMinimizeOnStart = v;
      if(v) {
        minimized = true;
        toggleMinimize();
      }
      saveConfig(true);
    })
    row1.appendChild(minimizeOnStart.wrap)

    panel.appendChild(row1);

    // 初始位置
    const row2=document.createElement('div'); row2.className='lex-sb-settings-row';
    row2.innerHTML='<span>初始位置 (px)：</span>';
    const inputX=mkNum(config.initialX ?? '');
    const inputY=mkNum(config.initialY ?? '');
    const useCur=btnS('使用当前');
    useCur.onclick=()=>{
      const r=card.getBoundingClientRect();
      inputX.value=Math.round(r.left);
      inputY.value=Math.round(r.top);
    };
    row2.appendChild(inputX);
    row2.appendChild(inputY);
    row2.appendChild(useCur);
    panel.appendChild(row2);
    panel.appendChild(small('留空则使用默认位置；“使用当前”会记录窗口当前左上角。'));

    // 窗口尺寸
    const row2b=document.createElement('div'); row2b.className='lex-sb-settings-row';
    row2b.innerHTML='<span>窗口尺寸 (px)：</span>';
    const inputW=mkNum(Math.round(config.width));
    const inputH=mkNum(Math.round(config.height));
    const applyWH=btnS('应用尺寸');
    applyWH.onclick=()=>{
      const w=parseInt(inputW.value,10);
      const h=parseInt(inputH.value,10);
      if(w>0 && h>0){
        card.style.width=w+'px';
        card.style.height=h+'px';
        config.width=w; config.height=h;
        saveConfig(true);
        showToast('尺寸已应用并保存');
      }
    };
    row2b.appendChild(inputW);
    row2b.appendChild(inputH);
    row2b.appendChild(applyWH);
    panel.appendChild(row2b);

    // 扣分项配置
    panel.appendChild(document.createElement('hr'));
    const labelScore=document.createElement('div');
    labelScore.style.fontWeight='700';
    labelScore.textContent='扣分项配置';
    panel.appendChild(labelScore);
    const textarea=document.createElement('textarea');
    textarea.value=currentItems.map(i=>`${i.reason} | ${i.score}`).join('\n');
    panel.appendChild(textarea);
    panel.appendChild(small('每行：错误原因 | 分值（负数）。保存后覆盖当前扣分项。'));

    const row3=document.createElement('div'); row3.className='lex-sb-settings-row';
    const applyItems=btnS('保存扣分项');
    const restoreDefault=btnS('恢复默认扣分项');
    const resetAll=btnS('恢复全部默认设置');
    row3.appendChild(applyItems);
    row3.appendChild(restoreDefault);
    row3.appendChild(resetAll);
    panel.appendChild(row3);

    applyItems.onclick=()=>{
      const lines=textarea.value.split('\n').map(s=>s.trim()).filter(Boolean);
      const arr=[];
      for(const line of lines){
        const p=line.split('|');
        if(!p[0]) continue;
        const reason=p[0].trim();
        const score=Number((p[1]||'').trim())||0;
        arr.push({reason,score});
      }
      if(!arr.length){ alert('没有有效条目'); return; }
      currentItems=arr;
      config.items=currentItems;
      config.lastCheckedIndices=[];
      saveConfig(false);
      renderList();
      showToast('扣分项已更新');
    };
    restoreDefault.onclick=()=>{
      if(!confirm('恢复默认扣分项？')) return;
      currentItems=defaultItems.map(i=>({...i}));
      config.items=currentItems;
      config.lastCheckedIndices=[];
      saveConfig(false);
      renderList();
      textarea.value=currentItems.map(i=>`${i.reason} | ${i.score}`).join('\n');
      showToast('已恢复默认');
    };
    resetAll.onclick=()=>{
      if(!confirm('恢复全部默认设置（位置/尺寸/勾选/扣分项/缩放等）？')) return;
      if (typeof GM_setValue === 'function') GM_setValue(STORAGE_KEY, '');
      if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
      showToast('已恢复默认，请刷新页面');
    };

    // Excel 导入
    panel.appendChild(document.createElement('hr'));
    const labelExcel=document.createElement('div');
    labelExcel.style.fontWeight='700';
    labelExcel.textContent='从 Excel 导入扣分项';
    panel.appendChild(labelExcel);
    const fileRow=document.createElement('div'); fileRow.className='lex-sb-settings-row';
    const fileWrap=document.createElement('div'); fileWrap.className='lex-file-wrap';
    const chooseBtn=document.createElement('div'); chooseBtn.className='lex-file-choose'; chooseBtn.textContent='选择文件';
    const fileInput=document.createElement('input');
    fileInput.type='file';
    fileInput.accept='.xlsx,.xls';
    fileInput.className='lex-hidden-input';
    fileWrap.appendChild(chooseBtn);
    fileWrap.appendChild(fileInput);
    fileRow.appendChild(fileWrap);
    const fileNameSpan=document.createElement('span');
    fileRow.appendChild(fileNameSpan);
    panel.appendChild(fileRow);
    panel.appendChild(small('规范：第一张表，A列“错误类型”，B列“扣分”（负整数）。首行可为表头。'));

    chooseBtn.onclick=()=>fileInput.click();
    fileInput.onchange=(e)=>{
      const f=e.target.files[0];
      fileNameSpan.textContent=f ? ('已选择：'+f.name) : '';
      if(!f) return;
      const reader=new FileReader();
      reader.onload=evt=>{
        try{
          const wb=XLSX.read(evt.target.result,{type:'binary'});
          const name=wb.SheetNames[0];
          const sheet=wb.Sheets[name];
          const arr=XLSX.utils.sheet_to_json(sheet,{header:1});
          const imported=[];
          for(let i=0;i<arr.length;i++){
            const row=arr[i];
            if(!row || !row.length) continue;
            let reason=(row[0]||'').toString().trim();
            let score=row[1];
            if(!reason) continue;
            if(i===0 && /错|分/.test(reason)) continue; // 表头
            score=Number(score);
            if(Number.isNaN(score)) continue;
            imported.push({reason,score});
          }
          if(!imported.length){
            alert('未解析到有效数据');
            return;
          }
          currentItems=imported;
          config.items=currentItems;
          config.lastCheckedIndices=[];
          saveConfig(false);
          renderList();
          textarea.value=currentItems.map(i=>`${i.reason} | ${i.score}`).join('\n');
          showToast('已从 Excel 导入');
        }catch(err){
          console.error(err);
          alert('Excel 解析失败');
        }
      };
      reader.readAsBinaryString(f);
    };

    // 白名单
    panel.appendChild(document.createElement('hr'));
    const wlLabel=document.createElement('div');
    wlLabel.style.fontWeight='700';
    wlLabel.textContent='网站白名单（优先于黑名单，非空时仅在以下站点启用，全局共享）';
    panel.appendChild(wlLabel);
    const wlTextarea=document.createElement('textarea');
    wlTextarea.placeholder='每行一个域名，例如：\nexample.com';
    wlTextarea.value=Object.keys(config.whitelistSites||{}).join('\n');
    panel.appendChild(wlTextarea);
    const wlRow=document.createElement('div'); wlRow.className='lex-sb-settings-row';
    const wlApply=btnS('应用白名单');
    const wlAddCur=btnS('添加当前站点');
    const wlClear=btnS('清空白名单');
    wlRow.appendChild(wlApply);
    wlRow.appendChild(wlAddCur);
    wlRow.appendChild(wlClear);
    panel.appendChild(wlRow);

    wlApply.onclick=()=>{
      const lines=wlTextarea.value.split('\n').map(s=>s.trim()).filter(Boolean);
      const map={}; lines.forEach(h=>map[h]=true);
      config.whitelistSites=map;
      saveConfig(false);
      showToast('白名单已更新（全局生效）');
    };
    wlAddCur.onclick=()=>{
      if(!host) return;
      config.whitelistSites=config.whitelistSites||{};
      config.whitelistSites[host]=true;
      wlTextarea.value=Object.keys(config.whitelistSites).join('\n');
      saveConfig(false);
      showToast('已将当前站点加入白名单（全局）');
    };
    wlClear.onclick=()=>{
      if(!confirm('确定清空白名单？（将恢复为使用黑名单控制）')) return;
      config.whitelistSites={};
      wlTextarea.value='';
      saveConfig(false);
      showToast('白名单已清空，恢复黑名单模式');
    };

    // 黑名单
    panel.appendChild(document.createElement('hr'));
    const blLabel=document.createElement('div');
    blLabel.style.fontWeight='700';
    blLabel.textContent='网站黑名单（仅在白名单为空时生效，全局共享）';
    panel.appendChild(blLabel);
    const blTextarea=document.createElement('textarea');
    blTextarea.placeholder='每行一个域名，例如：\nexample.com';
    blTextarea.value=Object.keys(config.disabledSites||{}).join('\n');
    panel.appendChild(blTextarea);
    const blRow=document.createElement('div'); blRow.className='lex-sb-settings-row';
    const blApply=btnS('应用黑名单');
    const blClearSite=btnS('移除当前站点');
    const blClearAll=btnS('清空黑名单');
    blRow.appendChild(blApply);
    blRow.appendChild(blClearSite);
    blRow.appendChild(blClearAll);
    panel.appendChild(blRow);

    blApply.onclick=()=>{
      const lines=blTextarea.value.split('\n').map(s=>s.trim()).filter(Boolean);
      const map={}; lines.forEach(h=>map[h]=true);
      config.disabledSites=map;
      saveConfig(false);
      showToast('黑名单已更新（全局生效）');
    };
    blClearSite.onclick=()=>{
      if(config.disabledSites && config.disabledSites[host]){
        delete config.disabledSites[host];
        saveConfig(false);
        blTextarea.value=Object.keys(config.disabledSites).join('\n');
        showToast('已移除当前站点');
      }
    };
    blClearAll.onclick=()=>{
      if(!confirm('清空所有黑名单？')) return;
      config.disabledSites={};
      saveConfig(false);
      blTextarea.value='';
      showToast('已清空黑名单');
    };

    // 保存位置按钮
    const rowSave=document.createElement('div'); rowSave.className='lex-sb-settings-row';
    const applyPos=btnS('应用位置');
    applyPos.onclick=()=>{
      const x=parseInt(inputX.value,10);
      const y=parseInt(inputY.value,10);
      if(!Number.isFinite(x)||!Number.isFinite(y)){
        alert('请输入数字');
        return;
      }
      card.style.left=x+'px';
      card.style.top=y+'px';
      card.style.right='auto';
      config.initialX=x;
      config.initialY=y;
      saveConfig(true);
      showToast('位置已应用并保存');
    };
    rowSave.appendChild(applyPos);
    panel.appendChild(rowSave);

    mask.appendChild(panel);
    card.appendChild(mask);

    function close(){ mask.remove(); }
    closeS.onclick=close;
    mask.addEventListener('click', e=>{
      if(e.target===mask) close();
    });

    function checkboxWithLabel(text, checked, onChange){
      const wrap=document.createElement('label');
      wrap.style.display='inline-flex';
      wrap.style.alignItems='center';
      wrap.style.gap='8px';
      const cb=document.createElement('input');
      cb.type='checkbox'; cb.checked=checked;
      cb.onchange=()=>onChange(cb.checked);
      wrap.appendChild(cb);
      wrap.appendChild(document.createTextNode(text));
      return {wrap, cb};
    }
    function mkNum(val){
      const i=document.createElement('input');
      i.type='number'; i.value=val;
      return i;
    }
    function btnS(txt){
      const b=document.createElement('button');
      b.className='lex-sb-settings-btn';
      b.textContent=txt;
      return b;
    }
    function small(t){
      const s=document.createElement('small');
      s.textContent=t;
      return s;
    }
  }
  settingsBtn.addEventListener('click', e=>{
    e.stopPropagation();
    if(minimized)
      toggleMinimize(false);
    openSettings();
  });

  // ===== 关闭对话框 =====
  function openCloseDialog(){
    const mask=document.createElement('div'); mask.className='lex-sb-close-mask';
    const dialog=document.createElement('div'); dialog.className='lex-sb-close-dialog';

    const titleRow=document.createElement('div'); titleRow.className='lex-sb-close-title';
    const t=document.createElement('span'); t.textContent='关闭悬浮球';
    const x=document.createElement('span'); x.className='lex-sb-close-x'; x.textContent='×';
    titleRow.appendChild(t); titleRow.appendChild(x);

    const o1=radio('本次关闭直到下次访问', true);
    const o2=radio('当前网站禁用');
    const o3=radio('永久禁用（本地存储中清除可恢复）');

    const actions=document.createElement('div'); actions.className='lex-sb-close-actions';
    const cancel=btnC('取消','cancel');
    const ok=btnC('确定','confirm');
    actions.appendChild(cancel); actions.appendChild(ok);

    dialog.appendChild(titleRow);
    dialog.appendChild(o1.wrap);
    dialog.appendChild(o2.wrap);
    dialog.appendChild(o3.wrap);
    dialog.appendChild(actions);
    mask.appendChild(dialog);
    document.body.appendChild(mask);

    function close(){ mask.remove(); }
    x.onclick=close;
    cancel.onclick=close;
    mask.onclick=(e)=>{ if(e.target===mask) close(); };

    ok.onclick=()=>{
      if(o2.input.checked){
        // 当前网站禁用：若在白名单中则移除，并加入黑名单（用于白名单清空后的回退）
        if (isWhitelistMode()) {
          if (config.whitelistSites && config.whitelistSites[host]) {
            delete config.whitelistSites[host];
          }
        }
        config.disabledSites = config.disabledSites || {};
        config.disabledSites[host] = true;
        saveConfig(false);
      } else if(o3.input.checked){
        config.globallyDisabled=true;
        saveConfig(false);
      }
      card.remove();
      toast.remove();
      close();
    };

    function radio(text, checked){
      const wrap=document.createElement('label');
      wrap.className='lex-sb-close-option';
      const input=document.createElement('input');
      input.type='radio'; input.name='lex-close'; input.checked=!!checked;
      wrap.appendChild(input);
      wrap.appendChild(document.createTextNode(text));
      return {wrap,input};
    }
    function btnC(txt, cls){
      const b=document.createElement('button');
      b.className='lex-sb-close-btn '+(cls||'');
      if(cls==='confirm') b.classList.add('confirm');
      if(cls==='cancel') b.classList.add('cancel');
      b.textContent=txt;
      return b;
    }
  }
  closeBtn.addEventListener('click', e=>{
    e.stopPropagation();
    openCloseDialog();
  });

  // ===== 最小化 / 悬浮球逻辑 =====
  function toggleMinimize(force){
    if (typeof force === 'boolean') {
      minimized = force;
    } else {
      minimized = !minimized;
    }
    card.classList.toggle('lex-minimized', minimized);

    if (!minimized){
      // 恢复正常
      bubble = false;
      card.classList.remove('lex-bubble');
      if (header.contains(bubbleIcon)) header.removeChild(bubbleIcon);
      if (config.width) card.style.width = config.width + 'px';
      if (config.height) card.style.height = config.height + 'px';
      return;
    }
    // 进入最小化时尝试吸附为悬浮球
    maybeSnapToEdge();
  }

  function maybeSnapToEdge(){
    if (!minimized){
      bubble = false;
      card.classList.remove('lex-bubble');
      if (header.contains(bubbleIcon)) header.removeChild(bubbleIcon);
      return;
    }
    const r = card.getBoundingClientRect();
    const margin = 12;
    const distL = r.left;
    const distR = window.innerWidth - r.right;
    const nearLeft = distL < 30;
    const nearRight = distR < 30;

    if (nearLeft || nearRight){
      bubble = true;
      card.classList.add('lex-bubble');
      if (nearLeft){
        card.style.left = margin + 'px';
        card.style.right = 'auto';
      } else {
        card.style.left = 'auto';
        card.style.right = margin + 'px';
      }
      if (!header.contains(bubbleIcon)) header.appendChild(bubbleIcon);
    } else {
      bubble = false;
      card.classList.remove('lex-bubble');
      if (header.contains(bubbleIcon)) header.removeChild(bubbleIcon);
    }
  }

  minimizeBtn.addEventListener('click', e=>{
    e.stopPropagation();
    toggleMinimize();
  });

  // 标题栏双击最小化/还原
  header.addEventListener('dblclick', ()=>{
    toggleMinimize();
  });

  // 悬浮球点击恢复
  header.addEventListener('click', ()=>{
    if (__lex_justDragged) return; // ignore click triggered by drag end
    if (card.classList.contains('lex-bubble')) {
      toggleMinimize(false);
    }
  });

  window.addEventListener('resize', ()=>{ if(minimized) maybeSnapToEdge(); });

  // ===== 记录模式 =====
  function toggleRecordMode(){
    inRecordMode=!inRecordMode;
    if(!inRecordMode){
      recordStarted=false;
      recordData=[];
      showToast('已切换普通模式');
    }else{
      showToast('已切换记录模式，点击“开始记录”');
    }
    renderModeLabel();
    renderRecordButtons();
  }
  recordToggleBtn.addEventListener('click', e=>{
    e.stopPropagation();
    toggleRecordMode();
  });
  startRecordBtn.addEventListener('click', ()=>{
    if(!inRecordMode) return;
    recordStarted=true;
    recordData=[];
    renderModeLabel();
    renderRecordButtons();
    showToast('记录开始');
  });
  confirmRecordBtn.addEventListener('click', ()=>{
    if(!recordStarted) return;
    const now=Date.now();
    if(now - lastConfirmClickTime < 600){
      const rec=buildCurrentRecord();
      if(!rec){ showToast('当前没有勾选'); return; }
      recordData.push(rec);
      renderModeLabel();
      showToast('已记录一条');
    }else{
      lastConfirmClickTime=now;
      showToast('再次点击确认以防误触');
    }
  });
  endRecordBtn.addEventListener('click', ()=>{
    if(!recordStarted){
      showToast('尚未开始记录');
      return;
    }
    if(!recordData.length){
      if(!confirm('没有记录，是否结束？')) return;
      inRecordMode=false;
      recordStarted=false;
      recordData=[];
      renderModeLabel();
      renderRecordButtons();
      return;
    }
    try{
      const wb=XLSX.utils.book_new();
      const sum=[['序号','时间','总扣分','条目数']];
      recordData.forEach((r,i)=>sum.push([i+1,r.time,r.total,r.details.length]));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sum), '汇总');
      const det=[['记录序号','时间','错误类型','扣分']];
      recordData.forEach((r,i)=>r.details.forEach(d=>det.push([i+1,r.time,d.reason,d.score])));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(det), '详情');
      const out=XLSX.write(wb,{bookType:'xlsx',type:'array'});
      const blob=new Blob([out],{type:'application/octet-stream'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download='扣分记录_'+new Date().toISOString().replace(/[:T]/g,'-').split('.')[0]+'.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('已导出 Excel');
    }catch(e){
      console.error(e);
      showToast('导出失败');
    }
    inRecordMode=false;
    recordStarted=false;
    recordData=[];
    renderModeLabel();
    renderRecordButtons();
  });

  function buildCurrentRecord(){
    const cbs=list.querySelectorAll('.lex-sb-checkbox');
    const rows=[]; let total=0;
    cbs.forEach(cb=>{
      if(cb.checked){
        const idx=Number(cb.dataset.index);
        const it=currentItems[idx];
        if(!it) return;
        rows.push({reason:it.reason, score:it.score});
        total+=Number(it.score)||0;
      }
    });
    if(!rows.length) return null;
    return {
      time: new Date().toLocaleString(),
      total,
      details: rows
    };
  }
  function initiateFunc(){
    renderModeLabel();
    renderRecordButtons();
    renderList();
    if(config.isMinimizeOnStart){
      minimized = true;
      toggleMinimize(true);          
    }
  }

  // 初始化
  initiateFunc();


})();