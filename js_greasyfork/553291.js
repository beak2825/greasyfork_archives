// ==UserScript==
// @name         Alpha Board（链上盈利数据展示/底部横排暂时/可隐藏/柔和玻璃）
// @namespace    https://greasyfork.org/zh-CN/users/1211909-amazing-fish
// @version      1.2.6
// @description  链上实时账户看板 · 默认最小化 · 按模型独立退避 · 轻量玻璃态 UI · 低饱和 P&L · 横排 6 卡片并展示相对更新时间
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      api.hyperliquid.xyz
// @connect      api.binance.com
// @connect      data-asg.goldprice.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553291/Alpha%20Board%EF%BC%88%E9%93%BE%E4%B8%8A%E7%9B%88%E5%88%A9%E6%95%B0%E6%8D%AE%E5%B1%95%E7%A4%BA%E5%BA%95%E9%83%A8%E6%A8%AA%E6%8E%92%E6%9A%82%E6%97%B6%E5%8F%AF%E9%9A%90%E8%97%8F%E6%9F%94%E5%92%8C%E7%8E%BB%E7%92%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553291/Alpha%20Board%EF%BC%88%E9%93%BE%E4%B8%8A%E7%9B%88%E5%88%A9%E6%95%B0%E6%8D%AE%E5%B1%95%E7%A4%BA%E5%BA%95%E9%83%A8%E6%A8%AA%E6%8E%92%E6%9A%82%E6%97%B6%E5%8F%AF%E9%9A%90%E8%97%8F%E6%9F%94%E5%92%8C%E7%8E%BB%E7%92%83%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 仅在顶层窗口注入，并防止重复安装
  let isTopLevel = true;
  try { isTopLevel = window.top === window.self; } catch { isTopLevel = false; }
  if (!isTopLevel) return;

  const globalScope = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const INSTALL_FLAG = '__alphaBoardInstalled__';
  if (globalScope[INSTALL_FLAG]) return;
  globalScope[INSTALL_FLAG] = true;

  /**
   * Alpha Board 1.2.6
   * ------------------
   *  - 针对多模型地址的链上账户价值聚合看板
   *  - 以 Hyperliquid API 为数据源，独立退避拉取、无本地持久化
   *  - 默认最小化，支持标题点击折叠，卡片横向排列并带相对时间
   *  - 鼠标滚轮上下滑动可驱动卡片横向滑动，并带缓动动画
   *  - 轻量玻璃态视觉 + 低饱和红/绿提示，适合常驻屏幕
   */

  /** ===== 常量与默认（无记忆） ===== */
  const INITIAL_CAPITAL = 10000;     // 账户价值基准，用于计算 PnL
  const FRESH_THRESH_MS = 15000;     // 顶栏“Stale” 阈值
  const JITTER_MS = 250;             // 轮询轻微抖动，避免同时请求
  const BACKOFF_STEPS = [3000, 5000, 8000, 12000]; // 网络失败退避梯度
  const LOCK_RETRY_MS = 700;         // 未抢到共享锁时的重试间隔
  let   COLLAPSED = true;            // 默认以折叠状态启动

  // 默认地址列表：直接在此修改即可，不会弹窗也不写本地存储
  const ADDRS = {
    'GPT-5': '0x67293D914eAFb26878534571add81F6Bd2D9fE06',
    'Gemini 2.5 Pro': '0x1b7A7D099a670256207a30dD0AE13D35f278010f',
    'Claude Sonnet 4.5': '0x59fA085d106541A834017b97060bcBBb0aa82869',
    'Grok-4': '0x56D652e62998251b56C8398FB11fcFe464c08F84',
    'DeepSeek V3.1': '0xC20aC4Dc4188660cBF555448AF52694CA62b0734',
    'Qwen3-Max': '0x7a8fd8bba33e37361ca6b0cb4518a44681bad2f3'
  };

  // 模型清单，用于确定卡片顺序与徽章缩写
  const MODELS = [
    { key: 'GPT-5', badge: 'GPT' },
    { key: 'Gemini 2.5 Pro', badge: 'GEM' },
    { key: 'Claude Sonnet 4.5', badge: 'CLD' },
    { key: 'Grok-4', badge: 'GRK' },
    { key: 'DeepSeek V3.1', badge: 'DSK' },
    { key: 'Qwen3-Max', badge: 'QWN' },
  ];

  const FEATURE_CARDS = [
    {
      key: 'btc',
      badge: 'BTC',
      name: 'BTC · 实时价',
      source: '数据源 Binance',
      fetcher: fetchBtcTicker,
    },
    {
      key: 'xau',
      badge: 'XAU',
      name: '黄金 · 现货价',
      source: '数据源 GoldPrice.org',
      fetcher: fetchGoldPrice,
    },
  ];

  const FEATURE_REFRESH_MS = 6000;

  const VISIBLE_CARD_COUNT = 4;
  const WIDTH_EXTRA_PX = 80;
  const DOM_DELTA_LINE = 1;
  const DOM_DELTA_PAGE = 2;
  const WHEEL_LINE_HEIGHT = 16;
  const WHEEL_ANIM_MIN_MS = 160;
  const WHEEL_ANIM_MAX_MS = 420;
  const WHEEL_ANIM_PX_RATIO = 0.45;
  const ACTIVATION_KEYS = new Set(['Enter', ' ']);

  let cancelWheelAnimation = ()=>{};

  const mqlReducedMotion = globalScope.matchMedia ? globalScope.matchMedia('(prefers-reduced-motion: reduce)') : null;
  let REDUCED_MOTION = !!(mqlReducedMotion && mqlReducedMotion.matches);
  if (mqlReducedMotion) {
    const handleMotionChange = (ev)=>{
      const next = !!(ev.matches ?? ev.currentTarget?.matches);
      REDUCED_MOTION = next;
      if (next) cancelWheelAnimation();
    };
    if (typeof mqlReducedMotion.addEventListener === 'function') {
      mqlReducedMotion.addEventListener('change', handleMotionChange);
    } else if (typeof mqlReducedMotion.addListener === 'function') {
      mqlReducedMotion.addListener(handleMotionChange);
    }
  }

  /** ===== 玻璃态 + 透明度优化样式（更透、更克制） ===== */
  // 所有视觉样式集中在一处，方便微调颜色、透明度或布局。
  GM_addStyle(`
    #ab-dock {
      position: fixed; left: 12px; bottom: 12px; z-index: 2147483647;
      pointer-events: none;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
                   Roboto,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC", Arial;
      color-scheme: dark;
      --gap: 7px; --radius: 14px;
      --pY: 6px; --pX: 10px; --icon: 28px;
      --ab-target-width: calc(4 * 168px + 3 * var(--gap) + 24px + ${WIDTH_EXTRA_PX}px);
      --fsName: 9.5px; --fsVal: 12.5px; --fsSub: 9.5px;

      /* ↓↓↓ 更低存在感的玻璃态（降低 blur / saturate / 亮度） ↓↓↓ */
      --bg: rgba(12,14,18,0.26);
      --bg2: rgba(12,14,18,0.12);
      --card: rgba(18,21,28,0.28);
      --card-hover: rgba(26,30,38,0.38);
      --brd: rgba(255,255,255,0.10);
      --soft: rgba(255,255,255,0.08);
      --shadow: 0 12px 30px rgba(0,0,0,0.2);

      /* ↓↓↓ 低饱和柔和绿/红（P&L + 状态点 + 闪烁） ↓↓↓ */
      --green: rgb(204,255,216);
      --red:   rgb(255,215,213);
      --blue:  #60a5fa;
      --text:  #e6e8ee;
    }

    /* 展开按钮：更透、轻玻璃 */
    #ab-toggle {
      pointer-events: auto;
      display: inline-flex;
      align-items:center; gap:6px;
      padding:5px 9px; border-radius:11px;
      background: rgba(18,21,28,0.24);
      border:1px solid rgba(255,255,255,0.10); color:var(--text); font-weight:600; font-size:11px; letter-spacing:.3px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.22);
      cursor: pointer; user-select: none;
      backdrop-filter: saturate(0.75) blur(3px);
      transition: background .2s ease, border-color .2s ease, transform .15s ease;
    }
    #ab-toggle:hover { background: rgba(22,25,34,0.32); border-color: rgba(255,255,255,0.16); transform: translateY(-1px); }

    /* 面板主体：更透、少 blur、少 saturate */
    #ab-wrap {
      pointer-events: auto;
      display: none;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.008)) ,
        radial-gradient(140% 160% at 0% 100%, rgba(96,165,250,0.05), transparent 60%) ,
        var(--bg);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      padding: 6px 10px 8px;
      box-shadow: 0 14px 30px rgba(0,0,0,0.24);
      width: min(96vw, var(--ab-target-width));
      max-width: min(96vw, var(--ab-target-width));
      backdrop-filter: saturate(0.75) blur(3px);
      overflow: visible;
    }

    #ab-dock.ab-expanded #ab-toggle { display: none; }
    #ab-dock.ab-expanded #ab-wrap { display: block; }
    #ab-dock.ab-collapsed #ab-toggle { display: inline-flex; }
    #ab-dock.ab-collapsed #ab-wrap { display: none; }

    #ab-topbar { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom:4px; padding:0; width:100%; gap:8px; }
    #ab-left { display:flex; align-items:center; gap:8px; min-width:0; }
    #ab-center { display:flex; align-items:center; justify-content:center; }
    #ab-right { display:flex; align-items:center; justify-content:flex-end; gap:8px; }
    #ab-title { color:#f7faff; font-size:11px; font-weight:700; letter-spacing:.35px; cursor: pointer; text-transform: uppercase; text-shadow: 0 0 8px rgba(0,0,0,0.35); }
    #ab-status { display:flex; align-items:center; gap:5px; font-size:10.5px; color:#f0f4ff; letter-spacing:.25px; text-shadow: 0 0 8px rgba(0,0,0,0.32); font-weight:500; line-height:1; white-space:nowrap; }
    .ab-dot { width:8px; height:8px; border-radius:50%; background:#9ca3af; }
    .ab-live  { background: var(--green); box-shadow: 0 0 10px color-mix(in srgb, var(--green) 35%, transparent); }
    .ab-warn  { background: #f59e0b;   box-shadow: 0 0 10px rgba(245,158,11,0.30); }
    .ab-dead  { background: var(--red); box-shadow: 0 0 10px color-mix(in srgb, var(--red) 35%, transparent); }

    #ab-link {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 8px;
      color: #f5f7ff;
      text-decoration: none;
      background: rgba(255,255,255,0.05);
      border: 1px solid transparent;
      transition: background .2s ease, border-color .2s ease, transform .15s ease;
    }
    #ab-link:hover {
      background: rgba(255,255,255,0.10);
      border-color: rgba(255,255,255,0.12);
      transform: translateY(-1px);
    }
    #ab-link svg { width: 14px; height: 14px; fill: currentColor; }

    #ab-expand-btn {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid transparent;
      color: #f5f7ff;
      font-size: 13px;
      font-weight: 600;
      line-height: 1;
      cursor: pointer;
      backdrop-filter: none;
      box-shadow: none;
      transition: transform .15s ease, color .2s ease;
    }
    #ab-expand-btn:hover {
      color: #ffffff;
      transform: translateY(-1px);
    }
    #ab-expand-btn:active { transform: scale(0.95); }
    #ab-expand-btn:focus-visible {
      outline: 2px solid rgba(96,165,250,0.45);
      outline-offset: 2px;
    }
    #ab-expand-btn svg {
      width: 12px;
      height: 12px;
      stroke: currentColor;
      stroke-width: 1.6;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform .2s ease;
    }
    #ab-expand-btn.expanded svg {
      transform: rotate(180deg);
    }

    /* 横向一行 + 滚动 */
    #ab-row-viewport {
      position: relative;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
      width: 100%;
      max-width: min(96vw, var(--ab-target-width));
      padding: 0 10px 8px 10px;
      margin: 0;
    }
    #ab-row-viewport::-webkit-scrollbar { height: 4px; }
    #ab-row-viewport::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
    #ab-row-viewport:hover,
    #ab-row-viewport:focus-within {
      scrollbar-color: rgba(255,255,255,0.16) transparent;
    }
    #ab-row-viewport:hover::-webkit-scrollbar-thumb,
    #ab-row-viewport:focus-within::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.16);
    }

    #ab-row {
      display:flex;
      flex-wrap: nowrap;
      gap: var(--gap);
      padding-right: 4px;
      transition: opacity .2s ease;
    }

    .ab-card {
      flex: 0 0 auto;
      min-width: 152px; max-width: 208px;
      position: relative; display:flex; align-items:flex-start; gap:8px;
      padding: var(--pY) var(--pX);
      background: linear-gradient(155deg, rgba(255,255,255,0.05), rgba(255,255,255,0));
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius);
      transition: transform 220ms ease, box-shadow 220ms ease, background 160ms ease, border-color 160ms ease;
      will-change: transform;
      --hover-lift: 0px;
      --flip-translate-x: 0px;
      --flip-translate-y: 0px;
      --card-shadow: 0 0 0 0 rgba(0,0,0,0);
      --flash-shadow: 0 0 0 0 rgba(0,0,0,0);
      transform: translate(var(--flip-translate-x, 0px), var(--flip-translate-y, 0px)) translateY(var(--hover-lift, 0px));
      box-shadow: var(--card-shadow), var(--flash-shadow);
    }
    .ab-card:hover {
      background: linear-gradient(155deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
      border-color: rgba(255,255,255,0.16);
      --card-shadow: 0 10px 24px rgba(0,0,0,0.26);
      --hover-lift: -1px;
    }

    .ab-icon {
      width: var(--icon); height: var(--icon);
      border-radius: 8px; display:grid; place-items:center;
      font-weight:700; font-size:9.5px; letter-spacing:.45px; color:#10131a;
      background: rgba(248,251,255,0.58);
      border: 1px solid rgba(255,255,255,0.28); user-select:none; cursor: pointer;
      box-shadow: 0 6px 16px rgba(0,0,0,0.22);
      backdrop-filter: blur(6px) saturate(1.1);
      transition: background 160ms ease, border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
    }
    .ab-icon:hover { background: rgba(255,255,255,0.82); border-color: rgba(255,255,255,0.42); box-shadow: 0 10px 20px rgba(0,0,0,0.28); }
    .ab-icon:active { transform: scale(0.96); }
    .ab-body { display:flex; flex-direction:column; gap:3px; min-width:0; }
    .ab-head { display:flex; align-items:center; justify-content:space-between; gap:6px; }
    .ab-name { font-size: var(--fsName); color:#f7faff; font-weight:600; letter-spacing:.22px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow: 0 0 6px rgba(0,0,0,0.32); }
    .ab-time { font-size:9.5px; color:#eef3ff; letter-spacing:.22px; white-space:nowrap; font-weight:500; text-shadow: 0 0 6px rgba(0,0,0,0.30); }
    .ab-val  { font-size: var(--fsVal);  color:#f9fbff; font-weight:700; letter-spacing:.26px; font-variant-numeric: tabular-nums; text-shadow: 0 0 6px rgba(0,0,0,0.28); }
    .ab-sub  { font-size: var(--fsSub);  color:#a4afc0; font-variant-numeric: tabular-nums; letter-spacing:.18px; }

    /* ↓ P&L 低饱和绿/红 */
    .ab-sub .pos { color: color-mix(in srgb, var(--green) 82%, #d1fae5); }
    .ab-sub .neg { color: color-mix(in srgb, var(--red) 82%,   #fee2e2); }

    /* 涨跌闪烁（进一步降低透明度与冲击感） */
    @media (prefers-reduced-motion: no-preference) {
      .flash-up   { --flash-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--green) 18%, transparent); }
      .flash-down { --flash-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--red)   18%, transparent); }
    }

    #ab-feature-cards {
      display: none;
      flex-wrap: wrap;
      gap: var(--gap);
      width: 100%;
      padding: 6px 10px 0 10px;
      pointer-events: none;
    }
    #ab-feature-cards .ab-card {
      min-width: 168px;
      pointer-events: auto;
    }
    #ab-feature-cards .ab-icon { cursor: default; }
    #ab-dock.ab-feature-open #ab-row-viewport {
      overflow: hidden;
      padding-bottom: 0;
      scrollbar-width: none;
    }
    #ab-dock.ab-feature-open #ab-row-viewport::-webkit-scrollbar { display: none; }
    #ab-dock.ab-feature-open #ab-feature-cards {
      display: flex;
      pointer-events: auto;
    }
    #ab-dock.ab-feature-open #ab-row {
      opacity: 0;
      pointer-events: none;
      display: none;
    }

    /* 骨架占位 */
    .skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.05) 65%);
      background-size: 400% 100%;
      animation: ab-shimmer 1.2s ease-in-out infinite;
      border-radius: 999px; height: 8px; width: 104px; opacity: .6;
    }
    @keyframes ab-shimmer {
      0% { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* Toast */
    #ab-toast {
      position: absolute; left: 8px; bottom: 100%; margin-bottom: 8px;
      background: rgba(0,0,0,0.78); color:#fff; padding:6px 8px; border-radius:8px;
      font-size:11px; pointer-events:none; opacity:0; transform: translateY(6px);
      transition: opacity .2s ease, transform .2s ease;
    }
    #ab-toast.show { opacity:1; transform: translateY(0); }
  `);

  /** ===== DOM ===== */
  // 创建挂载点与初始骨架，配合 toggle/title 控制展示状态。
  const dock = document.createElement('div');
  dock.id = 'ab-dock';
  dock.innerHTML = `
    <div id="ab-toggle" title="展开 Alpha Board">Alpha Board</div>
    <div id="ab-wrap" role="region" aria-label="Alpha Board 实时看板">
      <div id="ab-topbar">
        <div id="ab-left">
          <span id="ab-title" title="点击最小化">Alpha Board · 链上实时</span>
          <div id="ab-status" aria-live="polite">
            <span class="ab-dot" id="ab-dot"></span>
            <span id="ab-time">Syncing…</span>
          </div>
        </div>
        <div id="ab-center">
          <button
            id="ab-expand-btn"
            type="button"
            aria-label="展开扩展内容"
            aria-expanded="false"
            title="展开扩展内容"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.25 6.25L8 10l3.75-3.75" />
            </svg>
          </button>
        </div>
        <div id="ab-right">
          <a
            id="ab-link"
            href="https://nof1.ai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="打开 Nof1.ai（新窗口）"
            title="打开 Nof1.ai（新窗口）"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 112 0v3a4 4 0 01-4 4H5a4 4 0 01-4-4V6a4 4 0 014-4h3a1 1 0 110 2H5z" />
              <path d="M9 3a1 1 0 011-1h7a1 1 0 011 1v7a1 1 0 11-2 0V5.414l-8.293 8.293a1 1 0 11-1.414-1.414L14.586 4H10a1 1 0 01-1-1z" />
            </svg>
          </a>
        </div>
      </div>
      <div id="ab-row-viewport">
        <div id="ab-row"></div>
        <div
          id="ab-feature-cards"
          role="region"
          aria-label="Alpha Board 扩展内容"
          aria-hidden="true"
        ></div>
      </div>
      <div id="ab-toast" role="status" aria-live="polite"></div>
    </div>
  `;
  document.documentElement.appendChild(dock);

  const wrap       = dock.querySelector('#ab-wrap');
  const viewport   = dock.querySelector('#ab-row-viewport');
  const row        = dock.querySelector('#ab-row');
  const toggle     = dock.querySelector('#ab-toggle');
  const title      = dock.querySelector('#ab-title');
  const expandBtn  = dock.querySelector('#ab-expand-btn');
  const featureCardsContainer = dock.querySelector('#ab-feature-cards');
  const dot        = dock.querySelector('#ab-dot');
  const timeEl     = dock.querySelector('#ab-time');
  const toast      = dock.querySelector('#ab-toast');

  const featureCardsByKey = new Map();
  const featureState = new Map();
  const featureTimeDisplays = new Map();
  const featureLastValueMap = new Map();
  const featureMetaByKey = new Map();

  if (featureCardsContainer) {
    FEATURE_CARDS.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'ab-card ab-feature-card';
      card.setAttribute('data-key', item.key);
      card.innerHTML = `
        <div class="ab-icon" aria-hidden="true">${item.badge}</div>
        <div class="ab-body">
          <div class="ab-head">
            <div class="ab-name" title="${item.name}">${item.name}</div>
            <div class="ab-time">等待数据</div>
          </div>
          <div class="ab-val"><span class="skeleton" style="width:120px;"></span></div>
          <div class="ab-sub">${item.source || ''}</div>
        </div>
      `;
      featureCardsContainer.appendChild(card);
      featureCardsByKey.set(item.key, card);
      featureTimeDisplays.set(item.key, card.querySelector('.ab-time'));
      featureState.set(item.key, { price: null, change: null, percent: null, ts: 0 });
      featureMetaByKey.set(item.key, item);
    });
  }

  // 展开/收起（默认最小化）
  toggle.setAttribute('role', 'button');
  toggle.setAttribute('aria-controls', 'ab-wrap');
  toggle.setAttribute('tabindex', '0');
  title.setAttribute('role', 'button');
  title.setAttribute('tabindex', '0');
  title.setAttribute('aria-controls', 'ab-wrap');

  function applyCollapseState(){
    if (COLLAPSED) {
      dock.classList.add('ab-collapsed');
      dock.classList.remove('ab-expanded');
      toggle.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      title.setAttribute('aria-expanded', 'false');
      wrap.setAttribute('aria-hidden', 'true');
    } else {
      dock.classList.add('ab-expanded');
      dock.classList.remove('ab-collapsed');
      toggle.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'true');
      title.setAttribute('aria-expanded', 'true');
      wrap.setAttribute('aria-hidden', 'false');
    }
  }
  function minimize(){ COLLAPSED = true;  applyCollapseState(); }
  function expand()  { COLLAPSED = false; applyCollapseState(); scheduleWidthSync(); }
  let FEATURE_EXPANDED = false;
  function setFeatureState(next){
    const nextExpanded = !!next;
    if (viewport) {
      if (nextExpanded) {
        const rect = viewport.getBoundingClientRect();
        const measured = rect.height || viewport.scrollHeight;
        if (measured) {
          viewport.style.minHeight = `${measured}px`;
        } else {
          viewport.style.removeProperty('min-height');
        }
      } else {
        viewport.style.removeProperty('min-height');
      }
    }
    FEATURE_EXPANDED = nextExpanded;
    dock.classList.toggle('ab-feature-open', FEATURE_EXPANDED);
    if (expandBtn) {
      const label = FEATURE_EXPANDED ? '收起扩展内容' : '展开扩展内容';
      expandBtn.setAttribute('aria-label', label);
      expandBtn.setAttribute('title', label);
      expandBtn.setAttribute('aria-expanded', FEATURE_EXPANDED ? 'true' : 'false');
      expandBtn.classList.toggle('expanded', FEATURE_EXPANDED);
    }
    if (featureCardsContainer) {
      featureCardsContainer.setAttribute('aria-hidden', FEATURE_EXPANDED ? 'false' : 'true');
    }
  }
  function toggleFeature(){ setFeatureState(!FEATURE_EXPANDED); }
  function attachPressHandlers(el, handler){
    el.addEventListener('click', handler);
    const tagName = (el.tagName || '').toLowerCase();
    if (tagName === 'button') return;
    el.addEventListener('keydown', (ev)=>{
      if (!ACTIVATION_KEYS.has(ev.key)) return;
      ev.preventDefault();
      handler(ev);
    });
  }
  attachPressHandlers(toggle, expand);
  attachPressHandlers(title, minimize);
  if (expandBtn) attachPressHandlers(expandBtn, toggleFeature);
  setFeatureState(false);
  minimize();

  let widthSyncPending = false;
  let lastWidthApplied = 0;
  function scheduleWidthSync(){
    if (widthSyncPending) return;
    widthSyncPending = true;
    requestAnimationFrame(()=>{
      widthSyncPending = false;
      applyWidthSync();
    });
  }
  function applyWidthSync(){
    const cards = Array.from(row.querySelectorAll('.ab-card'));
    if (!cards.length) return;

    const sampleCount = Math.min(cards.length, VISIBLE_CARD_COUNT);
    let totalWidth = 0;
    let measured = 0;

    for (let i = 0; i < sampleCount; i += 1) {
      const rect = cards[i].getBoundingClientRect();
      if (!rect.width) continue;
      totalWidth += rect.width;
      measured += 1;
    }

    if (!measured) return;

    const rowStyles = getComputedStyle(row);
    const gapValue = parseFloat(rowStyles.gap || rowStyles.columnGap || '0') || 0;
    const rowPadL = parseFloat(rowStyles.paddingLeft || '0') || 0;
    const rowPadR = parseFloat(rowStyles.paddingRight || '0') || 0;

    const viewportStyles = getComputedStyle(viewport);
    const viewportPadL = parseFloat(viewportStyles.paddingLeft || '0') || 0;
    const viewportPadR = parseFloat(viewportStyles.paddingRight || '0') || 0;

    const visibleGapTotal = gapValue * Math.max(0, measured - 1);
    const baseWidth = totalWidth
      + visibleGapTotal
      + rowPadL + rowPadR
      + viewportPadL + viewportPadR;

    const contentWidth = baseWidth + WIDTH_EXTRA_PX;

    const maxWidthPx = Math.min(window.innerWidth * 0.96, contentWidth);
    if (Math.abs(maxWidthPx - lastWidthApplied) < 0.5) return;
    lastWidthApplied = maxWidthPx;
    dock.style.setProperty('--ab-target-width', `${maxWidthPx}px`);
  }
  window.addEventListener('resize', scheduleWidthSync, { passive: true });
  viewport.addEventListener('wheel', handleViewportWheel, { passive: false });

  let wheelAnimId = 0;
  let wheelAnimStart = 0;
  let wheelAnimFrom = 0;
  let wheelAnimTo = 0;
  let wheelAnimDuration = WHEEL_ANIM_MIN_MS;
  let wheelAnimTarget = null;

  cancelWheelAnimation = ()=>{
    if (!wheelAnimTarget) return;
    if (wheelAnimId) cancelAnimationFrame(wheelAnimId);
    wheelAnimTarget.scrollLeft = wheelAnimTo;
    wheelAnimId = 0;
    wheelAnimTarget = null;
  };

  function easeOutCubic(t){
    return 1 - Math.pow(1 - t, 3);
  }

  function beginWheelAnimation(target, to, distance){
    if (REDUCED_MOTION) {
      cancelWheelAnimation();
      target.scrollLeft = to;
      return;
    }
    wheelAnimTarget = target;
    wheelAnimFrom = target.scrollLeft;
    wheelAnimTo = to;
    wheelAnimDuration = Math.min(
      WHEEL_ANIM_MAX_MS,
      Math.max(WHEEL_ANIM_MIN_MS, WHEEL_ANIM_MIN_MS + distance * WHEEL_ANIM_PX_RATIO)
    );
    wheelAnimStart = performance.now();
    if (!wheelAnimId) {
      wheelAnimId = requestAnimationFrame(stepWheelAnimation);
    }
  }

  function stepWheelAnimation(now){
    const target = wheelAnimTarget;
    if (!target) {
      wheelAnimId = 0;
      return;
    }

    const duration = wheelAnimDuration;
    if (duration <= 0) {
      target.scrollLeft = wheelAnimTo;
      wheelAnimId = 0;
      wheelAnimTarget = null;
      return;
    }

    const progress = Math.min(1, (now - wheelAnimStart) / duration);
    const eased = easeOutCubic(progress);
    const next = wheelAnimFrom + (wheelAnimTo - wheelAnimFrom) * eased;
    target.scrollLeft = next;

    if (progress < 1 && Math.abs(wheelAnimTo - next) > 0.01) {
      wheelAnimId = requestAnimationFrame(stepWheelAnimation);
    } else {
      target.scrollLeft = wheelAnimTo;
      wheelAnimId = 0;
      wheelAnimTarget = null;
    }
  }

  function handleViewportWheel(ev){
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    const target = ev.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;
    if (maxScrollLeft <= 0) return;

    const primaryDelta = Math.abs(ev.deltaY) >= Math.abs(ev.deltaX) ? ev.deltaY : 0;
    if (!primaryDelta) return;

    let deltaPx = primaryDelta;
    if (ev.deltaMode === DOM_DELTA_LINE) deltaPx *= WHEEL_LINE_HEIGHT;
    else if (ev.deltaMode === DOM_DELTA_PAGE) deltaPx *= target.clientWidth;

    if (!deltaPx) return;

    const prev = target.scrollLeft;
    const next = Math.min(maxScrollLeft, Math.max(0, prev + deltaPx));
    if (Math.abs(next - prev) < 0.01) return;

    beginWheelAnimation(target, next, Math.abs(next - prev));
    ev.preventDefault();
  }

  /** ===== 状态与卡片 ===== */
  const state = new Map();              // key -> { value, addr, addrCanon, ts }
  const cardsByKey = new Map();         // key -> card DOM 节点
  const timeDisplays = new Map();       // key -> 时间显示 DOM
  let   lastOrder = MODELS.map(m=>m.key); // 保留历史顺序以便未来做最小化动画
  let   lastGlobalSuccess = 0;
  let   seenAnySuccess = false;
  const lastValueMap = new Map();       // 涨跌闪烁使用
  const addrSubscribers = new Map();    // canon addr -> Set<modelKey>

  MODELS.forEach((m) => {
    const card = document.createElement('div');
    card.className = 'ab-card';
    card.setAttribute('data-key', m.key);
    card.innerHTML = `
      <div class="ab-icon" title="点击复制地址">${m.badge}</div>
      <div class="ab-body">
        <div class="ab-head">
          <div class="ab-name" title="${m.key}">${m.key}</div>
          <div class="ab-time"><span class="skeleton" style="width:48px;"></span></div>
        </div>
        <div class="ab-val"><span class="skeleton"></span></div>
        <div class="ab-sub"><span class="skeleton" style="width:80px;"></span></div>
      </div>
    `;
    row.appendChild(card);
    cardsByKey.set(m.key, card);

    // 初始状态：为每张卡片记住地址和时间显示节点
    const addr = ADDRRSafe(ADDRS[m.key]);
    const canon = canonAddress(addr);
    state.set(m.key, { value: null, addr, addrCanon: canon, ts: 0 });
    timeDisplays.set(m.key, card.querySelector('.ab-time'));

    if (canon) {
      if (!addrSubscribers.has(canon)) addrSubscribers.set(canon, new Set());
      addrSubscribers.get(canon).add(m.key);
    }

    // 复制地址
    card.querySelector('.ab-icon').addEventListener('click', async ()=>{
      const addr = state.get(m.key).addr;
      if (!addr) { showToast('未配置地址'); return; }
      try {
        if (typeof GM_setClipboard === 'function') GM_setClipboard(addr);
        else await navigator.clipboard.writeText(addr);
        showToast('地址已复制');
      } catch { showToast('复制失败'); }
    });
  });

  scheduleWidthSync();
  refreshCardTimes();

  /** ===== 网络层 ===== */
  const storage = (()=>{ try { return globalScope.localStorage; } catch { return null; } })();
  const STORAGE_OK = !!storage;
  const TAB_ID = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const CACHE_PREFIX = '__ab_cache__';
  const LOCK_PREFIX  = '__ab_lock__';
  const CACHE_TTL_MS = 2500;
  const LOCK_TIMEOUT_MS = 15000;
  const CHANNEL_NAME = 'alpha-board-net-sync';
  const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;
  const sharedResultCache = new Map(); // canon addr -> { value, ts, success }
  const heldLocks = new Map(); // storage key -> token
  const sleep = (ms)=>new Promise(resolve=>setTimeout(resolve, ms));

  if (bc) {
    bc.addEventListener('message', (ev)=>{
      const data = ev.data;
      if (!data || data.type !== 'ab-result') return;
      if (data.origin === TAB_ID) return;
      if (typeof data.addr !== 'string') return;
      handleSharedResult(data.addr, data.payload);
    });
  }

  if (STORAGE_OK) {
    globalScope.addEventListener('storage', (ev)=>{
      if (!ev.key || !ev.newValue) return;
      if (ev.key.startsWith(CACHE_PREFIX)) {
        const addr = ev.key.slice(CACHE_PREFIX.length);
        const payload = safeParseJSON(ev.newValue);
        handleSharedResult(addr, payload);
      }
    });

    globalScope.addEventListener('unload', ()=>{
      heldLocks.forEach((token, key)=>{
        try {
          const current = safeParseJSON(storage.getItem(key));
          if (!current || current.owner === TAB_ID) storage.removeItem(key);
        } catch {}
      });
      heldLocks.clear();
    });
  }

  /**
   * 以 GM_xmlhttpRequest POST JSON，统一处理超时/异常。
   * @param {string} url
   * @param {object} data
   * @returns {Promise<any>}
   */
  function gmPostJson(url, data) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST', url, data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        onload: (res) => {
          try { resolve(JSON.parse(res.responseText)); }
          catch (e) { reject(e); }
        },
        onerror: reject, ontimeout: reject
      });
    });
  }

  function gmGetJson(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url,
        timeout: 10000,
        onload: (res) => {
          try { resolve(JSON.parse(res.responseText)); }
          catch (e) { reject(e); }
        },
        onerror: reject, ontimeout: reject
      });
    });
  }

  /**
   * 拉取地址的账户价值，优先读取逐仓/全仓字段，异常时返回 null。
   * @param {string} address
   * @returns {Promise<number|null>}
   */
  async function fetchAccountValue(address) {
    if (!address || !/^0x[a-fA-F0-9]{40}$/i.test(address)) return null;
    try {
      const resp = await gmPostJson('https://api.hyperliquid.xyz/info', {
        type: 'clearinghouseState', user: address, dex: ''
      });
      const v = resp?.marginSummary?.accountValue || resp?.crossMarginSummary?.accountValue;
      const num = v ? parseFloat(v) : NaN;
      return Number.isFinite(num) ? num : null;
    } catch { return null; }
  }

  async function fetchBtcTicker(){
    try {
      const resp = await gmGetJson('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
      const priceRaw = resp?.lastPrice ?? resp?.weightedAvgPrice ?? resp?.price;
      const changeRaw = resp?.priceChange;
      const pctRaw = resp?.priceChangePercent;
      const price = priceRaw == null ? NaN : parseFloat(priceRaw);
      if (!Number.isFinite(price)) return null;
      const change = changeRaw == null ? NaN : parseFloat(changeRaw);
      const percent = pctRaw == null ? NaN : parseFloat(pctRaw);
      return {
        price,
        change: Number.isFinite(change) ? change : null,
        percent: Number.isFinite(percent) ? percent / 100 : null,
        ts: Date.now(),
      };
    } catch { return null; }
  }

  async function fetchGoldPrice(){
    try {
      const resp = await gmGetJson('https://data-asg.goldprice.org/dbXRates/USD');
      const items = Array.isArray(resp?.items) ? resp.items : [];
      const usd = items.find((item)=> item && item.curr === 'USD') || items[0];
      const priceRaw = usd?.xauPrice;
      const changeRaw = usd?.chgXau;
      const pctRaw = usd?.pcXau;
      const price = priceRaw == null ? NaN : parseFloat(priceRaw);
      if (!Number.isFinite(price)) return null;
      const change = changeRaw == null ? NaN : parseFloat(changeRaw);
      const percent = pctRaw == null ? NaN : parseFloat(pctRaw);
      const tsRaw = resp?.tsj ?? resp?.ts;
      const ts = tsRaw == null ? NaN : Number(tsRaw);
      return {
        price,
        change: Number.isFinite(change) ? change : null,
        percent: Number.isFinite(percent) ? percent / 100 : null,
        ts: Number.isFinite(ts) ? ts : Date.now(),
      };
    } catch { return null; }
  }

  function tryUseSharedResult(canon, rec){
    if (!canon) return false;
    const payload = getFreshSharedResult(canon);
    if (!payload) return false;
    if (payload.success) {
      rec.step = 0;
    } else {
      rec.step = Math.min(rec.step + 1, BACKOFF_STEPS.length - 1);
    }
    handleSharedResult(canon, payload);
    return true;
  }

  function getFreshSharedResult(canon){
    if (!canon) return null;
    const now = Date.now();
    const cached = sharedResultCache.get(canon);
    if (cached && (now - cached.ts) <= CACHE_TTL_MS) return cached;
    if (STORAGE_OK) {
      const stored = readCache(canon);
      if (stored && (now - stored.ts) <= CACHE_TTL_MS) return stored;
    }
    return null;
  }

  async function tryAcquireLock(canon){
    if (!STORAGE_OK || !canon) return false;
    const key = LOCK_PREFIX + canon;
    const token = `${TAB_ID}:${Math.random().toString(36).slice(2, 10)}`;
    let attempt = 0;
    while (attempt < 4) {
      attempt += 1;
      const now = Date.now();
      try {
        const current = safeParseJSON(storage.getItem(key));
        if (current && typeof current.ts === 'number' && typeof current.owner === 'string') {
          if (current.owner !== TAB_ID && (now - current.ts) < LOCK_TIMEOUT_MS) return false;
        }
        const payload = JSON.stringify({ owner: TAB_ID, ts: now, token });
        storage.setItem(key, payload);
        await sleep(0);
        const verify = safeParseJSON(storage.getItem(key));
        if (verify && verify.owner === TAB_ID && verify.token === token) {
          heldLocks.set(key, token);
          return true;
        }
      } catch {
        return false;
      }
      await sleep(5 * attempt);
    }
    return false;
  }

  function releaseLock(canon){
    if (!STORAGE_OK || !canon) return;
    const key = LOCK_PREFIX + canon;
    try {
      const current = safeParseJSON(storage.getItem(key));
      const token = heldLocks.get(key);
      if (!current || current.owner !== TAB_ID) {
        if (!current) storage.removeItem(key);
      } else if (!current.token || !token || current.token === token) {
        storage.removeItem(key);
      }
    } catch { storage?.removeItem?.(key); }
    heldLocks.delete(key);
  }

  function readCache(canon){
    if (!STORAGE_OK || !canon) return null;
    try {
      return safeParseJSON(storage.getItem(CACHE_PREFIX + canon));
    } catch { return null; }
  }

  function writeCache(canon, payload){
    if (!STORAGE_OK || !canon) return;
    try {
      storage.setItem(CACHE_PREFIX + canon, JSON.stringify(payload));
    } catch {}
  }

  function shareResult(canon, payload){
    if (!canon || !payload) return;
    if (STORAGE_OK) writeCache(canon, payload);
    if (bc) {
      try { bc.postMessage({ type: 'ab-result', addr: canon, payload, origin: TAB_ID }); } catch {}
    }
    handleSharedResult(canon, payload);
  }

  function handleSharedResult(canon, payload){
    if (!canon || !payload || typeof payload.ts !== 'number') return;
    const prev = sharedResultCache.get(canon);
    if (prev && prev.ts >= payload.ts) return;
    sharedResultCache.set(canon, payload);

    if (payload.success) {
      seenAnySuccess = true;
      lastGlobalSuccess = Math.max(lastGlobalSuccess, payload.ts);
      const keys = addrSubscribers.get(canon);
      if (keys) {
        keys.forEach(key=>{
          if (state.has(key)) updateCard(key, payload.value, payload.ts);
        });
      }
      updateStatus();
    }
  }

  /** ===== 按模型独立轮询 + 失败退避 ===== */
  const pollers = new Map(); // key -> { step, timer }

  /**
   * 为指定模型启动独立轮询：成功时重置退避，失败时升级退避。
   * @param {string} mkey
   */
  function startPoller(mkey){
    const rec = { step: 0, timer: null };
    pollers.set(mkey, rec);

    const run = async () => {
      const s = state.get(mkey);
      const addr = s.addr;
      const canon = s.addrCanon || canonAddress(addr);
      if (!s.addrCanon) s.addrCanon = canon;

      // 无地址时：视为“不可用”，降频到最高 12s
      if (!addr) {
        updateCard(mkey, null);
        rec.step = BACKOFF_STEPS.length - 1;
        scheduleNext();
        return;
      }

      if (tryUseSharedResult(canon, rec)) {
        scheduleNext();
        return;
      }

      let acquired = false;
      if (STORAGE_OK && canon) {
        acquired = await tryAcquireLock(canon);
        if (!acquired) {
          scheduleNext(LOCK_RETRY_MS);
          return;
        }
      }

      try {
        const val = await fetchAccountValue(addr);
        const nowTs = Date.now();
        if (val == null) {
          rec.step = Math.min(rec.step + 1, BACKOFF_STEPS.length - 1);
          if (canon) shareResult(canon, { value: null, ts: nowTs, success: false });
        } else {
          rec.step = 0;
          if (canon) {
            shareResult(canon, { value: val, ts: nowTs, success: true });
          } else {
            seenAnySuccess = true;
            lastGlobalSuccess = nowTs;
            updateCard(mkey, val, nowTs);
            updateStatus();
          }
        }
        scheduleNext();
      } finally {
        if (acquired && canon) releaseLock(canon);
      }
    };

    function scheduleNext(customDelay){
      const base = typeof customDelay === 'number' ? customDelay : BACKOFF_STEPS[rec.step];
      const jitter = typeof customDelay === 'number' ? 0 : (Math.random() * 2 - 1) * JITTER_MS;
      clearTimeout(rec.timer);
      rec.timer = setTimeout(run, Math.max(0, base + jitter));
    }

    scheduleNext();
  }

  // 为所有模型启动独立轮询
  MODELS.forEach(m => startPoller(m.key));

  function startFeatureTickerPollers(){
    FEATURE_CARDS.forEach((card)=>{
      const { key, fetcher } = card;
      if (!featureCardsByKey.has(key) || typeof fetcher !== 'function') return;

      let timer = null;

      const run = async ()=>{
        try {
          const data = await fetcher();
          if (data) {
            updateFeatureCard(key, data);
          } else {
            const hadValue = !!(featureState.get(key)?.price != null);
            updateFeatureCard(key, null, hadValue);
          }
        } catch {
          const hadValue = !!(featureState.get(key)?.price != null);
          updateFeatureCard(key, null, hadValue);
        } finally {
          scheduleNext();
        }
      };

      const scheduleNext = ()=>{
        clearTimeout(timer);
        timer = setTimeout(run, FEATURE_REFRESH_MS);
      };

      run();
    });
  }

  startFeatureTickerPollers();

  /** ===== 渲染 ===== */
  /**
   * 更新单个模型卡片的文案、排序及动画效果。
   * @param {string} mkey
   * @param {number|null} value
   */
  function updateCard(mkey, value, tsOverride){
    const s = state.get(mkey);
    s.value = value;

    // 先记录旧位置信息（用于 FLIP 动画）
    const firstRects = new Map();
    MODELS.forEach(m=>{
      const el = cardsByKey.get(m.key);
      firstRects.set(m.key, el.getBoundingClientRect());
    });

    // 更新本卡展示
    const el = cardsByKey.get(mkey);
    const valEl = el.querySelector('.ab-val');
    const subEl = el.querySelector('.ab-sub');
    if (value == null) {
      valEl.innerHTML = '<span class="skeleton" style="width:120px;"></span>';
      subEl.textContent = s.addr ? '等待数据…' : '地址未配置';
      s.ts = 0;
    } else {
      const prev = lastValueMap.get(mkey);
      valEl.textContent = fmtUSD(value);
      const pnl = value - INITIAL_CAPITAL;
      const pct = pnl / INITIAL_CAPITAL;
      subEl.innerHTML = `PnL <span class="${pnl>=0?'pos':'neg'}">${fmtUSD(pnl)} · ${fmtPct(pct)}</span>`;
      s.ts = typeof tsOverride === 'number' ? tsOverride : Date.now();

      // 涨跌闪烁（更柔和）
      if (typeof prev === 'number' && prev !== value) {
        el.classList.remove('flash-up','flash-down');
        void el.offsetWidth;
        el.classList.add(prev < value ? 'flash-up' : 'flash-down');
        setTimeout(()=>el.classList.remove('flash-up','flash-down'), 260);
      }
      lastValueMap.set(mkey, value);
    }

    // 重排：按最新值排序（不显示名次，仅内部排序）
    const items = MODELS.map(m => ({ key: m.key, value: state.get(m.key).value }));
    items.sort((a,b)=>(b.value??-Infinity)-(a.value??-Infinity));
    const newOrder = items.map(i=>i.key);

    const els = items.map(i=>cardsByKey.get(i.key));
    const lastRects = new Map();
    els.forEach(el=>{
      const key = el.getAttribute('data-key');
      lastRects.set(key, firstRects.get(key));
    });
    els.forEach((el)=> row.appendChild(el));

    els.forEach(el=>{
      const key = el.getAttribute('data-key');
      const first = lastRects.get(key);
      const last  = el.getBoundingClientRect();
      if (first) {
        const dx = first.left - last.left;
        const dy = first.top  - last.top;
        if (dx || dy) {
          el.style.transition = 'none';
          el.style.setProperty('--flip-translate-x', `${dx}px`);
          el.style.setProperty('--flip-translate-y', `${dy}px`);
          el.getBoundingClientRect();
          el.style.transition = 'transform 240ms ease';
          el.style.setProperty('--flip-translate-x', '0px');
          el.style.setProperty('--flip-translate-y', '0px');
          el.addEventListener('transitionend', ()=>{ el.style.transition=''; }, { once:true });
        }
      }
    });

    lastOrder = newOrder;
    refreshCardTimes();
    scheduleWidthSync();
  }

  function updateFeatureCard(key, payload, errored){
    const card = featureCardsByKey.get(key);
    if (!card) return;

    let s = featureState.get(key);
    if (!s) {
      s = { price: null, change: null, percent: null, ts: 0 };
      featureState.set(key, s);
    }

    const meta = featureMetaByKey.get(key) || {};
    const valEl = card.querySelector('.ab-val');
    const subEl = card.querySelector('.ab-sub');

    if (!payload || payload.price == null) {
      if (s.price == null) {
        valEl.innerHTML = '<span class="skeleton" style="width:120px;"></span>';
        subEl.textContent = errored ? '获取失败，请稍后' : (meta.source || '等待数据…');
        s.ts = 0;
      }
      return;
    }

    const nowTs = payload.ts || Date.now();
    const prev = featureLastValueMap.get(key);
    valEl.textContent = fmtUSD(payload.price);
    const change = typeof payload.change === 'number' ? payload.change : null;
    const percent = typeof payload.percent === 'number' ? payload.percent : null;

    if (change != null && percent != null) {
      subEl.innerHTML = `24h <span class="${change>=0?'pos':'neg'}">${fmtUSDWithSign(change)} · ${fmtPct(percent)}</span>`;
    } else if (change != null) {
      subEl.innerHTML = `24h <span class="${change>=0?'pos':'neg'}">${fmtUSDWithSign(change)}</span>`;
    } else if (percent != null) {
      subEl.innerHTML = `24h <span class="${percent>=0?'pos':'neg'}">${fmtPct(percent)}</span>`;
    } else if (meta.source) {
      subEl.textContent = meta.source;
    } else {
      subEl.textContent = '最新行情';
    }

    if (typeof prev === 'number' && prev !== payload.price) {
      card.classList.remove('flash-up','flash-down');
      void card.offsetWidth;
      card.classList.add(prev < payload.price ? 'flash-up' : 'flash-down');
      setTimeout(()=>card.classList.remove('flash-up','flash-down'), 260);
    }
    featureLastValueMap.set(key, payload.price);

    s.price = payload.price;
    s.change = change;
    s.percent = percent;
    s.ts = nowTs;
    refreshCardTimes();
  }

  /** ===== 顶栏状态：Live / Stale / Dead ===== */
  /**
   * 刷新顶栏状态点及文字，反映最新网络健康情况。
   */
  function updateStatus(){
    const now = Date.now();
    if (!seenAnySuccess) {
      dot.className = 'ab-dot ab-dead';
      timeEl.textContent = 'No data';
      return;
    }
    const stale = (now - lastGlobalSuccess) > FRESH_THRESH_MS;
    dot.className = 'ab-dot ' + (stale ? 'ab-warn' : 'ab-live');
    timeEl.textContent = (stale ? 'Stale' : ('更新 ' + fmtTime(now)));
  }
  /**
   * 刷新卡片上的相对时间显示。
   */
  function refreshCardTimes(){
    const now = Date.now();
    timeDisplays.forEach((el, key)=>{
      if (!el) return;
      const s = state.get(key);
      if (!s) return;
      if (!s.addr) { el.textContent = '未配置'; return; }
      if (!s.ts) { el.textContent = '等待数据'; return; }
      el.textContent = fmtSince(s.ts, now);
    });
    featureTimeDisplays.forEach((el, key)=>{
      if (!el) return;
      const s = featureState.get(key);
      if (!s || !s.ts) { el.textContent = '等待数据'; return; }
      el.textContent = fmtSince(s.ts, now);
    });
  }
  // 轻量 UI 刷新：仅更新文本与状态点，不追加网络请求
  setInterval(()=>{ updateStatus(); refreshCardTimes(); }, 1000);

  /** ===== 工具函数 ===== */
  function canonAddress(addr){ return typeof addr === 'string' ? addr.trim().toLowerCase() : ''; }
  function safeParseJSON(str){ try { return str ? JSON.parse(str) : null; } catch { return null; } }
  /** 清洗地址字符串，避免 undefined/null */
  function ADDRRSafe(addr) { return typeof addr === 'string' ? addr.trim() : ''; }
  /** 统一格式化 USD 文案 */
  function fmtUSD(n){ return n==null ? '—' : '$' + n.toLocaleString(undefined,{maximumFractionDigits:2}); }
  function fmtUSDWithSign(n){
    if (n == null) return '—';
    const absFmt = fmtUSD(Math.abs(n));
    return (n >= 0 ? '+' : '-') + absFmt.slice(1);
  }
  /** 输出带正负号的百分比 */
  function fmtPct(n){ return n==null ? '—' : ((n>=0?'+':'') + (n*100).toFixed(2) + '%'); }
  /**
   * 根据时间戳生成中文相对时间。
   * @param {number} ts
   * @param {number} [now]
   */
  function fmtSince(ts, now = Date.now()){
    const diff = Math.max(0, now - ts);
    if (diff < 5000) return '刚刚';
    if (diff < 60000) return Math.floor(diff/1000) + ' 秒前';
    if (diff < 3600000) return Math.floor(diff/60000) + ' 分钟前';
    if (diff < 86400000) return Math.floor(diff/3600000) + ' 小时前';
    return Math.floor(diff/86400000) + ' 天前';
  }
  /** HH:MM:SS 形式的绝对时间 */
  function fmtTime(ts){
    const d=new Date(ts); const p=n=>n<10?'0'+n:n;
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  /**
   * 统一的轻量提示气泡。
   * @param {string} msg
   */
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toast.classList.remove('show'), 1200);
  }
})();
