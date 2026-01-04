// ==UserScript==
// @name         ChatGPT 长对话卡顿优化（浮窗保活版 · UI美化&性能增强）
// @namespace    chatgpt-conversation-pruner
// @version      1.6
// @description  隐藏/卸载部分历史对话 DOM 缓解长对话卡顿；浮窗保活 + 全局可拖拽 + 限制拖动范围 + 统计实时更新 + 回看/性能模式切换。
// @match        https://chatgpt.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560394/ChatGPT%20%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8D%A1%E9%A1%BF%E4%BC%98%E5%8C%96%EF%BC%88%E6%B5%AE%E7%AA%97%E4%BF%9D%E6%B4%BB%E7%89%88%20%C2%B7%20UI%E7%BE%8E%E5%8C%96%E6%80%A7%E8%83%BD%E5%A2%9E%E5%BC%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560394/ChatGPT%20%E9%95%BF%E5%AF%B9%E8%AF%9D%E5%8D%A1%E9%A1%BF%E4%BC%98%E5%8C%96%EF%BC%88%E6%B5%AE%E7%AA%97%E4%BF%9D%E6%B4%BB%E7%89%88%20%C2%B7%20UI%E7%BE%8E%E5%8C%96%E6%80%A7%E8%83%BD%E5%A2%9E%E5%BC%BA%EF%BC%89.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /************* 🔧 可配置参数 *************/
    let KEEP_VISIBLE = 8;       // 保留最近多少条可见
    let HIDE_BEYOND = 10;       // 总条数超过多少开始处理
    let ENABLE_REMOVE = false;  // 是否真卸载（remove）
    let READ_MODE = false;      // 回看模式：全部展开且暂停剪枝
    let PERF_SNAPSHOT = null;   // 保存性能模式参数快照
    let hotkeysBound = false;


    const HOST_ID = 'cgpt-pruner-host';
    const UI_MIN_KEY = 'cgpt_pruner_ui_minimized_v3';
    const UI_POS_KEY = 'cgpt_pruner_ui_pos_v3';
    const UI_READ_KEY = 'cgpt_pruner_read_mode_v2';

    const BOOT_CHECK_INTERVAL = 500;
    const VIEWPORT_MARGIN = 8;
    /****************************************/

    // -------------------------
    // Utils
    // -------------------------
    const log = (...args) => console.log('[ChatGPT Pruner]', ...args);

    const idle = (fn) => {
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(fn, { timeout: 600 });
        } else {
            requestAnimationFrame(fn);
        }
    };

    function clampInt(v, min, fallback) {
        const n = Number.parseInt(v, 10);
        if (!Number.isFinite(n)) return fallback;
        return Math.max(min, n);
    }

    // Storage: prefer Tampermonkey persistent storage (GM_*), fallback to localStorage.
function safeGet(key) {
    // 1) GM storage
    try {
        if (typeof GM_getValue === 'function') {
            const v = GM_getValue(key, null);
            if (v !== null && v !== undefined) return String(v);
        }
    } catch (_) {}

    // 2) localStorage
    try { return localStorage.getItem(key); } catch (_) { return null; }
}

function safeSet(key, val) {
    // Write to both: GM for persistence robustness; localStorage for compatibility/migration.
    try { if (typeof GM_setValue === 'function') GM_setValue(key, String(val)); } catch (_) {}
    try { localStorage.setItem(key, String(val)); } catch (_) {}
}


    // -------------------------
    // Turns query (尽量稳定 + 可退化)
    // -------------------------
    function getTurns() {
        return Array.from(document.querySelectorAll('article[data-testid^="conversation-turn"]'));
    }

    function getBestObserveRoot() {
        return (
            document.querySelector('main') ||
            document.querySelector('[role="main"]') ||
            document.body
        );
    }

    // -------------------------
    // Prune logic
    // -------------------------
    const stateByEl = new WeakMap(); // el -> 'shown' | 'hidden'
    let pruneScheduled = false;

    // UI 统计回调（createPanel 时赋值）
    let uiUpdateStats = null;
    let uiUpdateMode = null;

    function schedulePrune() {
        if (READ_MODE) {
            // 回看模式不剪枝，但允许统计刷新
            if (uiUpdateStats) uiUpdateStats();
            return;
        }
        if (pruneScheduled) return;
        pruneScheduled = true;
        idle(() => {
            pruneScheduled = false;
            prune();
            if (uiUpdateStats) uiUpdateStats();
        });
    }

    function setElHidden(el, hidden) {
        const prev = stateByEl.get(el);
        const next = hidden ? 'hidden' : 'shown';
        if (prev === next) return;

        el.style.display = hidden ? 'none' : '';
        stateByEl.set(el, next);
    }

    function normalizeParams() {
        KEEP_VISIBLE = clampInt(KEEP_VISIBLE, 1, 8);
        HIDE_BEYOND  = clampInt(HIDE_BEYOND, 1, 10);
        if (HIDE_BEYOND < KEEP_VISIBLE) HIDE_BEYOND = KEEP_VISIBLE;
    }

    function prune() {
        normalizeParams();

        const turns = getTurns();
        const total = turns.length;
        if (total === 0) return;

        if (READ_MODE) {
            for (const el of turns) setElHidden(el, false);
            return;
        }

        if (total <= HIDE_BEYOND) {
            for (const el of turns) setElHidden(el, false);
            return;
        }

        // 超过 HIDE_BEYOND 才开始处理
        if (total <= HIDE_BEYOND) {
            for (const el of turns) setElHidden(el, false);
            return;
        }

        // 最终目标：只保留 KEEP_VISIBLE 条
        const removeBefore = total - KEEP_VISIBLE;

        if (ENABLE_REMOVE && removeBefore > 0) {
            for (let i = 0; i < removeBefore; i++) {
                turns[i].remove();
            }
            return; // remove 后直接结束，避免再走 hide
        }

        // hide 模式（不 remove）
        for (let i = 0; i < total; i++) {
            setElHidden(turns[i], i < removeBefore);
        }


        // hide：只保留最近 KEEP_VISIBLE 条
        const fresh = getTurns();
        const freshTotal = fresh.length;
        const hideBefore = freshTotal - KEEP_VISIBLE;

        for (let i = 0; i < freshTotal; i++) {
            setElHidden(fresh[i], i < hideBefore);
        }
    }

    // -------------------------
    // Observer
    // -------------------------
    let turnsObserver = null;

    function startObserver() {
        if (turnsObserver) turnsObserver.disconnect();
        const root = getBestObserveRoot();
        turnsObserver = new MutationObserver(() => schedulePrune());
        turnsObserver.observe(root, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (turnsObserver) turnsObserver.disconnect();
    }

    function waitForChat() {
        const timer = setInterval(() => {
            const turns = getTurns();
            if (turns.length > 0) {
                clearInterval(timer);
                prune();
                startObserver();
                if (uiUpdateStats) uiUpdateStats();
            }
        }, BOOT_CHECK_INTERVAL);
    }

    // -------------------------
    // UI Panel
    // -------------------------
    let panelHost = null;

    function readPos() {
        const raw = safeGet(UI_POS_KEY);
        if (!raw) return { right: 20, bottom: 20 };
        try {
            const obj = JSON.parse(raw);
            if (typeof obj?.right === 'number' && typeof obj?.bottom === 'number') return obj;
        } catch (_) {}
        return { right: 20, bottom: 20 };
    }

    function writePos(pos) {
        safeSet(UI_POS_KEY, JSON.stringify(pos));
    }
    function getViewportSize() {
        const de = document.documentElement;
        const w = de?.clientWidth || window.innerWidth || 0;
        const h = de?.clientHeight || window.innerHeight || 0;
        return { w, h };
    }


    function clampHostIntoView(host) {
        const rect = host.getBoundingClientRect();
        let right = Number.parseFloat(host.style.right) || 20;
        let bottom = Number.parseFloat(host.style.bottom) || 20;

        const maxRight = Math.max(VIEWPORT_MARGIN, window.innerWidth - rect.width - VIEWPORT_MARGIN);
        const maxBottom = Math.max(VIEWPORT_MARGIN, window.innerHeight - rect.height - VIEWPORT_MARGIN);

        right = Math.min(Math.max(VIEWPORT_MARGIN, right), maxRight);
        bottom = Math.min(Math.max(VIEWPORT_MARGIN, bottom), maxBottom);

        host.style.right = `${right}px`;
        host.style.bottom = `${bottom}px`;
        // Do not persist here. Persistence must happen only at deliberate moments (e.g., drag end).
    }

    function createPanel() {
        document.querySelectorAll('#' + HOST_ID).forEach(n => n.remove());

        const host = document.createElement('div');
        host.id = HOST_ID;
        host.style.position = 'fixed';
        host.style.zIndex = '999999';
        host.style.right = `${Math.max(VIEWPORT_MARGIN, readPos().right)}px`;
        host.style.bottom = `${Math.max(VIEWPORT_MARGIN, readPos().bottom)}px`;

        document.documentElement.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
  <style>
    :host { all: initial; }
    * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
    button, input { font: inherit; }

	/* ---- Theme tokens ---- */
	.t{
	  --bg: rgba(8, 6, 12, .66);
	  --bg2: rgba(255,255,255,.06);
	  --bd: rgba(255,255,255,.12);
	  --bd2: rgba(255,255,255,.18);
	  --txt: rgba(255,255,255,.92);
	  --muted: rgba(255,255,255,.74);
	  --muted2: rgba(255,255,255,.58);

	  /* Cyberpunk 霓虹三色 */
	  --a1: rgba(0, 240, 255, 1);    /* 电蓝 */
	  --a2: rgba(255, 0, 200, 1);    /* 霓虹粉 */
	  --a3: rgba(160, 90, 255, 1);   /* 紫电 */

	  --accent: rgba(255, 0, 200, 1);
	  --accentBg: rgba(255, 0, 200, .16);

	  --good: rgba(80, 255, 210, 1);
	  --goodBg: rgba(80,255,210,.14);

	  --warn: rgba(255, 60, 120, 1);
	  --warnBg: rgba(255, 60, 120, .14);

	  --shadow: 0 18px 56px rgba(0,0,0,.62);
	  --shadow2: 0 10px 28px rgba(0,0,0,.44);
	  --radius: 16px;
	  --radius2: 14px;
	}



    /* ---- Surface ---- */
	.glass{
	  background:
		radial-gradient(120% 140% at 20% 10%, rgba(255,255,255,.10), rgba(0,0,0,0)),
		radial-gradient(120% 140% at 85% 0%, rgba(255,0,200,.10), rgba(0,0,0,0)),
		radial-gradient(120% 140% at 0% 90%, rgba(0,240,255,.10), rgba(0,0,0,0)),
		var(--bg);
	  color: var(--txt);
	  border: 1px solid rgba(255,255,255,.12);
	  box-shadow:
		var(--shadow),
		0 0 0 1px rgba(255,255,255,.05) inset,
		0 0 22px rgba(0,240,255,.12),
		0 0 22px rgba(255,0,200,.10);
	  backdrop-filter: blur(16px);
	  -webkit-backdrop-filter: blur(16px);
	}


    .panel {
      width: 304px;
      border-radius: var(--radius);
      padding: 12px;
    }

    /* ---- Header ---- */
    .header {
      display:flex; align-items:center; justify-content:space-between;
      gap: 10px;
      user-select:none;
      padding: 6px 6px 10px;
    }

    .brand {
      display:flex; align-items:center; gap:10px;
      font-weight: 760;
      letter-spacing: .2px;
    }
	.logo{
	  width: 28px; height: 28px;
	  border-radius: 12px;
	  background: linear-gradient(135deg, rgba(0,240,255,.95), rgba(255,0,200,.90), rgba(160,90,255,.90));
	  box-shadow:
		0 12px 26px rgba(0,0,0,.38),
		0 0 18px rgba(0,240,255,.20),
		0 0 18px rgba(255,0,200,.18);
	  position: relative;
	}


    .logo:before {
      content:"";
      position:absolute; inset: 7px;
      border-radius: 999px;
      background: rgba(0,0,0,.18);
      border: 1px solid rgba(255,255,255,.20);
    }

    .grip {
      width: 28px; height: 18px;
      opacity: .55;
      display:grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 2px;
      margin-left: 2px;
    }
    .grip i { width: 3px; height: 3px; border-radius: 999px; background: rgba(255,255,255,.60); }

    .right {
      display:flex; align-items:center; gap: 8px;
    }

    .modeBadge{
      font-size:12px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid var(--bd2);
      background: rgba(255,255,255,.08);
      color: var(--txt);
      white-space: nowrap;
    }
    .modeBadge.read{
      background: var(--goodBg);
      border-color: rgba(70,210,160,.30);
    }

    .iconBtn {
      width: 34px; height: 30px;
      border-radius: 12px;
      border: 1px solid var(--bd);
      background: rgba(255,255,255,.08);
      color: var(--txt);
      cursor: pointer;
      display:flex; align-items:center; justify-content:center;
      transition: transform .12s ease, background .12s ease, border-color .12s ease;
      user-select:none;
    }
    .iconBtn:hover { background: rgba(255,255,255,.13); transform: translateY(-1px); }
    .iconBtn:active { transform: translateY(0px) scale(.99); }
    .iconBtn:focus { outline: 2px solid rgba(120,155,255,.35); outline-offset: 2px; }

    /* ---- Segmented control ---- */
    .seg {
      display:flex;
      border: 1px solid var(--bd);
      background: rgba(255,255,255,.06);
      border-radius: 14px;
      padding: 4px;
      gap: 4px;
      user-select:none;
    }
    .seg button{
      flex:1;
      height: 36px;
      border-radius: 12px;
      border: 0;
      background: transparent;
      color: var(--muted);
      cursor:pointer;
      transition: background .14s ease, color .14s ease, transform .14s ease;
    }
    .seg button:hover { background: rgba(255,255,255,.08); color: var(--txt); }
    .seg button.active{
      background: rgba(255,255,255,.14);
      color: var(--txt);
      box-shadow: var(--shadow2);
    }
    .seg button:active { transform: scale(.99); }

    /* ---- Stats cards ---- */
    .statsGrid{
      margin-top: 10px;
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .stat{
      border: 1px solid var(--bd);
      background: rgba(0,0,0,.12);
      border-radius: 14px;
      padding: 9px 10px;
      min-height: 54px;
      display:flex; flex-direction:column; justify-content:space-between;
    }
    .stat .k{ font-size: 11px; color: var(--muted2); }
    .stat .v{ font-size: 15px; font-weight: 760; letter-spacing: .2px; }

    /* Keep old statsLine id for compatibility (hidden, but kept) */
    #statsLine { display:none; }

    /* ---- Form rows ---- */
    .section{
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,.10);
    }

    .row{
      display:flex; align-items:center; justify-content:space-between;
      gap: 10px;
      padding: 8px 6px;
    }
    .label{
      display:flex; flex-direction:column;
      gap: 2px;
      min-width: 0;
    }
    .label .t1{ font-size: 12px; color: var(--txt); font-weight: 650; }
    .label .t2{ font-size: 11px; color: var(--muted2); white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }

    .num{
      width: 110px;
      border-radius: 12px;
      border: 1px solid var(--bd);
      background: rgba(255,255,255,.06);
      color: var(--txt);
      padding: 8px 10px;
      outline: none;
      text-align: right;
      transition: border-color .12s ease, background .12s ease;
    }
    .num:focus { border-color: rgba(120,155,255,.40); background: rgba(255,255,255,.08); }

    /* ---- Switch ---- */
    .switch{
      width: 46px; height: 26px;
      border-radius: 999px;
      border: 1px solid var(--bd);
      background: rgba(255,255,255,.10);
      position: relative;
      cursor: pointer;
      flex: 0 0 auto;
      transition: background .12s ease, border-color .12s ease;
    }
    .switch i{
      position:absolute;
      top: 3px; left: 3px;
      width: 20px; height: 20px;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      box-shadow: 0 10px 18px rgba(0,0,0,.28);
      transition: transform .14s ease;
    }
    .switch.on{
      background: rgba(255, 94, 94, .22);
      border-color: rgba(255, 94, 94, .35);
    }
    .switch.on i{ transform: translateX(20px); }

    .risk{
      margin-top: 8px;
      padding: 10px 10px;
      border-radius: 14px;
      border: 1px solid rgba(255, 94, 94, .26);
      background: rgba(255, 94, 94, .10);
      color: rgba(255,255,255,.86);
      font-size: 11px;
      line-height: 1.35;
      display:none;
    }
    .risk.show{ display:block; }

    /* ---- Footer buttons ---- */
    .footer{
      margin-top: 12px;
      display:flex;
      gap: 8px;
    }
    .btn{
      height: 38px;
      border-radius: 14px;
      border: 1px solid var(--bd);
      cursor:pointer;
      transition: transform .12s ease, background .12s ease, border-color .12s ease;
      user-select:none;
    }
    .btn:active{ transform: scale(.99); }

	.primary{
	  flex:1.2;
	  background:
		linear-gradient(135deg, rgba(60,220,255,.22), rgba(140,115,255,.20)),
		rgba(255,255,255,.06);
	  border-color: rgba(140,115,255,.34);
	  color: var(--txt);
	  font-weight: 760;
	  box-shadow:
		0 10px 24px rgba(0,0,0,.36),
		0 0 16px rgba(140,115,255,.16);
	}
	.primary:hover{
	  background:
		linear-gradient(135deg, rgba(60,220,255,.28), rgba(140,115,255,.24)),
		rgba(255,255,255,.08);
	  box-shadow:
		0 12px 28px rgba(0,0,0,.40),
		0 0 20px rgba(60,220,255,.18),
		0 0 20px rgba(140,115,255,.16);
	}


    .ghost{
      flex: .8;
      background: rgba(255,255,255,.06);
      color: var(--muted);
    }
    .ghost:hover{
      background: rgba(255,255,255,.10);
      color: var(--txt);
    }

    .hint{
      margin-top: 10px;
      font-size: 11px;
      color: var(--muted2);
      line-height: 1.35;
      user-select:none;
    }

    /* ---- Mini ---- */
	.mini{
	  width: 56px;
	  height: 56px;
	  border-radius: 999px;
	  display: inline-flex;
	  align-items: center;
	  justify-content: center;
	  cursor: pointer;
	  user-select: none;

	  background:
		radial-gradient(130% 130% at 30% 20%, rgba(255,255,255,.20), rgba(0,0,0,0) 45%),
		radial-gradient(120% 120% at 70% 75%, rgba(0,240,255,.28), rgba(0,0,0,0) 55%),
		linear-gradient(135deg, rgba(255,0,200,.24), rgba(160,90,255,.22), rgba(0,240,255,.18)),
		rgba(10,8,16,.72);

	  border: 1px solid rgba(255,255,255,.16);

	  box-shadow:
		0 20px 50px rgba(0,0,0,.62),
		0 0 0 1px rgba(255,255,255,.06) inset,
		0 0 18px rgba(0,240,255,.25),
		0 0 26px rgba(255,0,200,.22),
		0 0 30px rgba(160,90,255,.18);

	  transition: transform .14s ease, filter .14s ease, box-shadow .14s ease;
	}

	.mini:hover{
	  transform: translateY(-2px) scale(1.04);
	  filter: brightness(1.10) saturate(1.15);
	  box-shadow:
		0 24px 56px rgba(0,0,0,.64),
		0 0 0 1px rgba(255,255,255,.08) inset,
		0 0 22px rgba(0,240,255,.32),
		0 0 34px rgba(255,0,200,.28),
		0 0 38px rgba(160,90,255,.22);
	}

	.mini:active{
	  transform: translateY(0px) scale(1.01);
	  filter: brightness(1.05) saturate(1.10);
	}

	.mini svg{
	  opacity: .96;
	  filter:
		drop-shadow(0 0 10px rgba(0,240,255,.30))
		drop-shadow(0 0 12px rgba(255,0,200,.22));
	}



    .hidden { display:none !important; }

    /* ---- No-drag ---- */
    .noDrag { touch-action: manipulation; }
  </style>

  <div class="t">
    <div class="panel glass" id="panel" title="空白处可拖拽移动（控件区域不拖）">
      <div class="header">
        <div class="brand">
          <div class="logo"></div>
          <div style="display:flex; flex-direction:column; gap:2px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span>Pruner</span>
              <div class="grip" aria-hidden="true">
                <i></i><i></i><i></i><i></i><i></i><i></i>
                <i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
            </div>
            <div style="font-size:11px; color: rgba(255,255,255,.58);">Long chat, zero lag.</div>
          </div>
        </div>
        <div class="right">
          <span class="modeBadge" id="modeBadge">性能</span>
          <button class="iconBtn noDrag" id="minBtn" type="button" title="最小化">—</button>
        </div>
      </div>

      <div class="seg noDrag" role="tablist" aria-label="模式切换">
        <button id="readModeBtn" type="button">回看</button>
        <button id="perfModeBtn" type="button">性能</button>
      </div>

      <div class="statsGrid">
        <div class="stat"><div class="k">Turn</div><div class="v" id="sTotal">0</div></div>
        <div class="stat"><div class="k">Visible</div><div class="v" id="sShown">0</div></div>
        <div class="stat"><div class="k">Hidden</div><div class="v" id="sHidden">0</div></div>
      </div>

      <!-- 兼容你旧逻辑的隐藏统计行 -->
      <div class="row" id="statsLine">turn：0 | 可见：0 | 隐藏：0</div>

      <div class="section">
        <div class="row">
          <div class="label">
            <div class="t1">真卸载 DOM</div>
            <div class="t2">不可逆移除旧 turn（刷新可恢复）</div>
          </div>
          <div class="switch noDrag" id="removeSwitch" role="switch" aria-checked="false" title="切换真卸载">
            <i></i>
          </div>
          <input class="noDrag" type="checkbox" id="removeToggle" style="display:none;">
        </div>
        <div class="risk" id="riskBox">
          真卸载会直接 remove 历史节点：更省内存，但回看需要刷新页面重新加载。
        </div>

        <div class="row">
          <div class="label">
            <div class="t1">保留最近</div>
            <div class="t2">最终显示/保留的条数</div>
          </div>
          <input class="num noDrag" type="number" id="keepVisible" min="1">
        </div>

        <div class="row">
          <div class="label">
            <div class="t1">超过开始处理</div>
            <div class="t2">不超过则不做任何优化</div>
          </div>
          <input class="num noDrag" type="number" id="hideBeyond" min="1">
        </div>

        <div class="footer">
          <button class="btn primary noDrag" id="applyBtn" type="button">应用设置</button>
          <button class="btn ghost noDrag" id="resetBtn" type="button" title="恢复默认参数">重置</button>
        </div>

        <div class="hint">
          快捷键：Alt+Q 最小化/展开；Alt+W 回看/性能切换。
        </div>
      </div>
    </div>

    <div class="mini hidden" id="mini" title="展开 Pruner（可拖拽）">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M7.2 7.2l2.2 2.2M14.6 14.6l2.2 2.2M16.8 7.2l-2.2 2.2M9.4 14.6l-2.2 2.2"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.8"/>
</svg>


    </div>
  </div>
`;


        const $ = (id) => shadow.getElementById(id);

        function setMinimized(minimized) {
            $('panel').classList.toggle('hidden', minimized);
            $('mini').classList.toggle('hidden', !minimized);
            safeSet(UI_MIN_KEY, minimized ? '1' : '0');
            // 形态变化后重新 clamp，防止宽高变化导致跑出界面
            requestAnimationFrame(() => requestAnimationFrame(() => clampHostIntoView(host)));
        }

        function computeStats() {
            const turns = getTurns();
            const total = turns.length;
            let shown = 0, hidden = 0;
            for (const el of turns) {
                const disp = (el.style && el.style.display) || '';
                if (disp === 'none') hidden++;
                else shown++;
            }
            return { total, shown, hidden };
        }

        function updateStatsLine() {
            const s = computeStats();

            const stats = $('statsLine');
            if (stats) stats.textContent = `turn：${s.total} | 可见：${s.shown} | 隐藏：${s.hidden}`;

            const t = shadow.getElementById('sTotal');
            const a = shadow.getElementById('sShown');
            const h = shadow.getElementById('sHidden');
            if (t) t.textContent = String(s.total);
            if (a) a.textContent = String(s.shown);
            if (h) h.textContent = String(s.hidden);
        }


        function updateModeUI() {
            const badge = $('modeBadge');
            if (badge) {
                badge.textContent = READ_MODE ? '回看' : '性能';
                badge.classList.toggle('read', READ_MODE);
            }
            const readBtn = $('readModeBtn');
            const perfBtn = $('perfModeBtn');
            if (readBtn) readBtn.classList.toggle('active', READ_MODE);
            if (perfBtn) perfBtn.classList.toggle('active', !READ_MODE);

            updateStatsLine();
        }

        // 把 UI 刷新函数挂到全局（prune/observer 会调用）
        uiUpdateStats = updateStatsLine;
        uiUpdateMode = updateModeUI;

        // 初始化控件
        $('removeToggle').checked = ENABLE_REMOVE;
        $('keepVisible').value = KEEP_VISIBLE;
        $('hideBeyond').value = HIDE_BEYOND;
        const sw = $('removeSwitch');
        const cb = $('removeToggle');
        const risk = $('riskBox');

        function syncSwitchUI() {
            const on = cb.checked;
            sw.classList.toggle('on', on);
            sw.setAttribute('aria-checked', on ? 'true' : 'false');
            risk.classList.toggle('show', on);
        }

        sw.addEventListener('click', (e) => {
            e.stopPropagation();
            cb.checked = !cb.checked;
            syncSwitchUI();
        }, { passive: true });

        // 初始化
        syncSwitchUI();


        // 应用参数
        $('applyBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            ENABLE_REMOVE = $('removeToggle').checked;

            const kv = clampInt($('keepVisible').value, 1, KEEP_VISIBLE);
            const hb = clampInt($('hideBeyond').value, 1, HIDE_BEYOND);

            KEEP_VISIBLE = kv;
            HIDE_BEYOND = hb;
            if (HIDE_BEYOND < KEEP_VISIBLE) HIDE_BEYOND = KEEP_VISIBLE;

            prune();
            updateStatsLine();
        }, { passive: true });

        $('resetBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            KEEP_VISIBLE = 8;
            HIDE_BEYOND = 10;
            ENABLE_REMOVE = false;

            $('keepVisible').value = KEEP_VISIBLE;
            $('hideBeyond').value = HIDE_BEYOND;
            $('removeToggle').checked = ENABLE_REMOVE;

            // 同步 switch UI（如果存在）
            const sw = $('removeSwitch');
            const risk = $('riskBox');
            if (sw) {
                sw.classList.remove('on');
                sw.setAttribute('aria-checked', 'false');
            }
            if (risk) risk.classList.remove('show');

            prune();
            updateStatsLine();
        }, { passive: true });


        // 最小化/展开（关键：阻止事件被拖拽逻辑吞掉）
        $('minBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            setMinimized(true);
        }, { passive: true });

        $('mini').addEventListener('click', (e) => {
            e.stopPropagation();
            setMinimized(false);
        }, { passive: true });

        // 恢复最小化状态
        setMinimized(safeGet(UI_MIN_KEY) === '1');

        // 模式切换
        function showAllTurns() {
            const turns = getTurns();
            for (const el of turns) setElHidden(el, false);
        }

        function enterReadMode() {
            if (READ_MODE) return;
            READ_MODE = true;
            PERF_SNAPSHOT = { KEEP_VISIBLE, HIDE_BEYOND, ENABLE_REMOVE };

            // 回看：禁止 remove，避免不可逆
            ENABLE_REMOVE = false;
            $('removeToggle').checked = false;

            showAllTurns();
            stopObserver();
            safeSet(UI_READ_KEY, '1');
            updateModeUI();
        }

        function exitReadMode() {
            if (!READ_MODE) return;
            READ_MODE = false;

            if (PERF_SNAPSHOT) {
                KEEP_VISIBLE = PERF_SNAPSHOT.KEEP_VISIBLE;
                HIDE_BEYOND = PERF_SNAPSHOT.HIDE_BEYOND;
                ENABLE_REMOVE = PERF_SNAPSHOT.ENABLE_REMOVE;
            }

            $('removeToggle').checked = ENABLE_REMOVE;
            $('keepVisible').value = KEEP_VISIBLE;
            $('hideBeyond').value = HIDE_BEYOND;

            startObserver();
            schedulePrune();
            safeSet(UI_READ_KEY, '0');
            updateModeUI();
        }

        $('readModeBtn').addEventListener('click', (e) => { e.stopPropagation(); enterReadMode(); }, { passive: true });
        $('perfModeBtn').addEventListener('click', (e) => { e.stopPropagation(); exitReadMode(); }, { passive: true });

        // 启动恢复上次模式
        if (safeGet(UI_READ_KEY) === '1') enterReadMode();
        else updateModeUI();

        // -------------------------
        // 拖拽：全界面可拖（交互控件除外）+ 限制范围
        // -------------------------
        function enableDrag(surfaceEl) {
            let dragging = false;
            let startX = 0, startY = 0;
            let startRight = 0, startBottom = 0;

            const isInteractive = (t) => {
                if (!t || !(t instanceof Element)) return false;
                // noDrag 明确排除，此外标准交互控件也排除
                return !!t.closest('.noDrag, input, textarea, select, button, a, label, [contenteditable="true"]');
            };

            const onDown = (e) => {
                if (e.button !== 0) return;
                if (isInteractive(e.target)) return;

                dragging = true;
                const rect = host.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                const { w: vw, h: vh } = getViewportSize();
                startRight = vw - rect.right;
                startBottom = vh - rect.bottom;

                try { surfaceEl.setPointerCapture(e.pointerId); } catch (_) {}
                e.preventDefault();
            };

            const onMove = (e) => {
                if (!dragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                // base position is measured from the viewport's right/bottom edges
                let right = startRight - dx;
                let bottom = startBottom - dy;

                // Clamp using the actual visible surface size (panel or mini), matching Monitor Ultimate's logic.
                const r = surfaceEl.getBoundingClientRect();
                const w = r.width || 320;
                const h = r.height || 64;

                const maxRight = Math.max(VIEWPORT_MARGIN, window.innerWidth - w - VIEWPORT_MARGIN);
                const maxBottom = Math.max(VIEWPORT_MARGIN, window.innerHeight - h - VIEWPORT_MARGIN);

                right = Math.min(Math.max(VIEWPORT_MARGIN, right), maxRight);
                bottom = Math.min(Math.max(VIEWPORT_MARGIN, bottom), maxBottom);

                host.style.right = `${right}px`;
                host.style.bottom = `${bottom}px`;
            };

            const onUp = () => {
                if (!dragging) return;
                dragging = false;

                // Final clamp (layout could change during drag), then persist once.
                clampHostIntoView(host);

                const right = Number.parseFloat(host.style.right) || 20;
                const bottom = Number.parseFloat(host.style.bottom) || 20;
                writePos({ right, bottom });
            };

            surfaceEl.addEventListener('pointerdown', onDown, { passive: false });
            window.addEventListener('pointermove', onMove, { passive: true });
            window.addEventListener('pointerup', onUp, { passive: true });
            window.addEventListener('pointercancel', onUp, { passive: true });
}

        // 面板和 mini 都启用拖拽（面板：任意空白处可拖）
        enableDrag($('panel'));
        enableDrag($('mini'));

        
// 尺寸变化兜底：内容刷新/换行/缩放导致宽高变化时，自动 clamp，避免贴顶/贴边时“按钮飞出”
let uiRO = null;
if (typeof ResizeObserver === 'function') {
    uiRO = new ResizeObserver(() => {
        // 合并到下一帧，避免抖动
        requestAnimationFrame(() => requestAnimationFrame(() => clampHostIntoView(host)));
    });
    try { uiRO.observe(host); } catch (_) {}
}

// resize 时兜底 clamp
        window.addEventListener('resize', () => clampHostIntoView(host));
        requestAnimationFrame(() => requestAnimationFrame(() => clampHostIntoView(host)));

        // 快捷键：Alt+Q 最小化/展开；Alt+W 切回看/性能
        /*window.addEventListener('keydown', (e) => {
      if (!e.altKey) return;

      if (e.key === 'q' || e.key === 'Q') {
        const isPanelVisible = !$('panel').classList.contains('hidden');
        setMinimized(isPanelVisible);
      }

      if (e.key === 'w' || e.key === 'W') {
        if (READ_MODE) exitReadMode();
        else enterReadMode();
      }
    });*/

        // 统计轻量兜底：面板展开时每 600ms 刷一次（避免“偶尔不更新”）
        let statsTimer = null;
        const startStatsTicker = () => {
            if (statsTimer) return;
            statsTimer = window.setInterval(() => {
                const minimized = $('panel').classList.contains('hidden');
                if (!minimized && uiUpdateStats) uiUpdateStats();
            }, 600);
        };
        const stopStatsTicker = () => {
            if (!statsTimer) return;
            clearInterval(statsTimer);
            statsTimer = null;
        };
        startStatsTicker();

        // 当页面隐藏时停一下，回来再开
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopStatsTicker();
            else startStatsTicker();
        });

        return host;
    }

    // -------------------------
    // Panel keep-alive
    // -------------------------
    let panelGuardObserver = null;

    function ensurePanelAlive() {
        if (!panelHost || !panelHost.isConnected || !document.getElementById(HOST_ID)) {
            panelHost = createPanel();
            log('Panel created/recreated');
        } else {
            // Monitor-style: always re-apply stored position, then clamp (no persistence here).
            const pos = readPos();
            panelHost.style.right = `${pos.right}px`;
            panelHost.style.bottom = `${pos.bottom}px`;
            clampHostIntoView(panelHost);
        }
    }

    function startPanelGuard() {
        if (panelGuardObserver) panelGuardObserver.disconnect();
        panelGuardObserver = new MutationObserver(() => {
            if (!document.getElementById(HOST_ID)) ensurePanelAlive();
        });
        panelGuardObserver.observe(document.documentElement, { childList: true, subtree: true });
    }
    function getShadow() {
        const host = document.getElementById(HOST_ID);
        return host ? host.shadowRoot : null;
    }
    function bindHotkeysOnce() {
        if (hotkeysBound) return;
        hotkeysBound = true;

        window.addEventListener('keydown', (e) => {
            if (!e.altKey) return;
            if (e.repeat) return; // 防止长按连发

            const sh = getShadow();
            if (!sh) return;

            const panel = sh.getElementById('panel');
            const mini = sh.getElementById('mini');
            const readBtn = sh.getElementById('readModeBtn');
            const perfBtn = sh.getElementById('perfModeBtn');
            const minBtn = sh.getElementById('minBtn');

            if (e.key === 'q' || e.key === 'Q') {
                const minimized = panel.classList.contains('hidden');
                if (minimized) mini.click();
                else minBtn.click();
            }

            if (e.key === 'w' || e.key === 'W') {
                if (READ_MODE) perfBtn.click();
                else readBtn.click();
            }
        }, { capture: true });
    }
    // -------------------------
    // Route hook
    // -------------------------
    function hookHistory() {
        const _push = history.pushState;
        const _replace = history.replaceState;

        history.pushState = function (...args) {
            const ret = _push.apply(this, args);
            window.dispatchEvent(new Event('cgpt:route'));
            return ret;
        };

        history.replaceState = function (...args) {
            const ret = _replace.apply(this, args);
            window.dispatchEvent(new Event('cgpt:route'));
            return ret;
        };

        window.addEventListener('popstate', () => window.dispatchEvent(new Event('cgpt:route')));

        window.addEventListener('cgpt:route', () => {
            ensurePanelAlive();
            // 路由变更后：如果回看模式，别开 observer；否则重启 observer 并 prune
            if (READ_MODE) {
                stopObserver();
                if (uiUpdateMode) uiUpdateMode();
                if (uiUpdateStats) uiUpdateStats();
            } else {
                startObserver();
                schedulePrune();
            }
        });
    }

    // -------------------------
    // Boot
    // -------------------------
    function boot() {
        hookHistory();
        ensurePanelAlive();
        bindHotkeysOnce();
        startPanelGuard();
        waitForChat();

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                ensurePanelAlive();
                if (!READ_MODE) schedulePrune();
                if (uiUpdateStats) uiUpdateStats();
            }
        });

        log('Booted');
    }

    if (document.readyState === 'complete') boot();
    else window.addEventListener('load', boot, { once: true });
})();
