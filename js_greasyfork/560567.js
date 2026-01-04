// ==UserScript==
// @name         ChatGPT Monitor Ultimate (Degraded + Risk + Service) ✅
// @namespace    https://chatgpt.com/
// @version      1.0.0
// @description  One script to monitor: Service (Free/Paid + expiry), PoW difficulty (risk + bar + history copy), Deep Research remaining, IP quality (Scamalytics), OpenAI status. Draggable, position memory, collapse, and SPA keep-alive.
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @match        *://chat.chatgpt.com/*
// @match        *://*.openai.com/*
// @connect      status.openai.com
// @connect      scamalytics.com
// @connect      cloudflare.com
// @connect      www.cloudflare.com
// @connect      ipinfo.io
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560567/ChatGPT%20Monitor%20Ultimate%20%28Degraded%20%2B%20Risk%20%2B%20Service%29%20%E2%9C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/560567/ChatGPT%20Monitor%20Ultimate%20%28Degraded%20%2B%20Risk%20%2B%20Service%29%20%E2%9C%85.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const W = (typeof unsafeWindow !== 'undefined' && unsafeWindow) ? unsafeWindow : window;

  /*************************
   * Config
   *************************/
  const IDS = {
    root: 'cgpt-monitor-ultimate-root',
    indicator: 'cgpt-monitor-ultimate-indicator',
  };

  const LS = {
    pos: 'cgpt_monitor_ultimate_pos_v1',
    collapsed: 'cgpt_monitor_ultimate_collapsed_v1',
    history: 'cgpt_monitor_ultimate_pow_history_v1',
  };

  const CFG = {
    poll: {
      powMs: 2 * 60_000,
      serviceMs: 10 * 60_000,
      statusMs: 60_000,
      ipMs: 10 * 60_000,
      ipQualityMs: 30 * 60_000,
      drMs: 5 * 60_000,
    },
    guardThrottleMs: 200,
    historyMax: 60,
    defaultPos: { right: 24, bottom: 20 },
  };

  /*************************
   * State
   *************************/
  const S = {
    serviceGeneric: 'Unknown',   // Paid / Free / Trial
    serviceTier: 'Unknown',      // Plus / Go / Pro / Team / Enterprise / Free / Unknown
    serviceExpiryISO: null,

    powDifficulty: null,
    powLevel: 'Unknown',
    powColor: '#10b981',
    powBarPct: 50,
    powHistory: [],

    drRemain: null,
    drResetISO: null,

    ip: null,
    warp: false,
    ipQualityLabel: 'Unknown',
    ipQualityColor: '#9ca3af',
    ipQualityScore: null,

    statusLabel: 'Unknown',
    statusColor: '#9ca3af',

    bearer: null,
    lastGuardAt: 0,
    dragging: false,

    ui: { root: null, indicator: null, el: {}, shadow: null },
  };

  /*************************
   * Utils
   *************************/
  const safeLSGet = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
  const safeLSSet = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function fmtLocal(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d)) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  async function copyText(text) {
    if (!text) return false;

    // 1) Tampermonkey API (most reliable)
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(text, { type: 'text', mimetype: 'text/plain' });
        return true;
      }
    } catch (_) {}

    // 2) Clipboard API
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    // 3) execCommand fallback
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      document.documentElement.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch (_) {}

    return false;
  }

  function parseHexDifficulty(difficulty) {
    if (!difficulty || difficulty === 'N/A') return { trimmed: 'N/A', len: 0 };
    const trimmed = String(difficulty).replace(/^0x/i, '').replace(/^0+/, '') || '0';
    return { trimmed, len: trimmed.length };
  }

  function powToLevelInfo(difficulty) {
    const { trimmed, len } = parseHexDifficulty(difficulty);

    if (trimmed === 'N/A') {
      return { level: 'N/A', color: '#10b981', pct: 50, label: 'N/A', trimmed };
    }
    if (len >= 6) return { level: 'Very Easy', color: '#10b981', pct: 92, label: 'Very Easy', trimmed };
    if (len === 5) return { level: 'Easy', color: '#10b981', pct: 82, label: 'Easy', trimmed };
    if (len === 4) return { level: 'Medium', color: '#f59e0b', pct: 58, label: 'Medium', trimmed };
    if (len === 3) return { level: 'Hard', color: '#ef4444', pct: 32, label: 'Hard', trimmed };
    return { level: 'Critical', color: '#ef4444', pct: 18, label: 'Critical', trimmed };
  }

  function parseChatRequirementsFields(data) {
    const root = data?.chat_requirements || data?.requirements || data;
    const pow = root?.proofofwork || root?.proof_of_work || root?.pow;
    const difficulty = pow?.difficulty ?? null;
    const userType = root?.persona || root?.user_type || root?.account_type || null;
    return { difficulty, userType };
  }

  function parseDR(data) {
    if (!data || typeof data !== 'object') return;
    const lp = data.limits_progress;
    if (!Array.isArray(lp)) return;
    const item = lp.find(x => x?.feature_name === 'deep_research');
    if (!item || typeof item.remaining !== 'number') return;

    const changed = (S.drRemain !== item.remaining) || (S.drResetISO !== item.reset_after);
    S.drRemain = item.remaining;
    S.drResetISO = item.reset_after || null;

    if (changed) render();
  }

  function findEntitlement(data) {
    if (!data || typeof data !== 'object') return null;
    if (data.entitlement) return data.entitlement;
    if (data.accounts?.default?.entitlement) return data.accounts.default.entitlement;
    if (data.accounts && typeof data.accounts === 'object') {
      for (const key of Object.keys(data.accounts)) {
        const maybe = data.accounts[key]?.entitlement;
        if (maybe) return maybe;
      }
    }
    return null;
  }

  function deriveService(entitlement) {
    const str = (v) => (typeof v === 'string' ? v : '');
    const low = (v) => str(v).toLowerCase();

    const plan =
      low(entitlement?.subscription_plan) ||
      low(entitlement?.plan) ||
      low(entitlement?.product_name) ||
      low(entitlement?.name) ||
      low(entitlement?.type) ||
      low(entitlement?.id) ||
      low(entitlement?.tier) ||
      '';

    const status = low(entitlement?.status);
    const hasTrial =
      plan.includes('trial') ||
      status.includes('trial') ||
      !!entitlement?.trial_ends_at;

    const isPaid =
      plan.includes('plus') ||
      plan.includes('go') ||
      plan.includes('pro') ||
      plan.includes('team') ||
      plan.includes('enterprise') ||
      plan.includes('paid') ||
      status.includes('active') ||
      low(entitlement?.billing_period).includes('month') ||
      low(entitlement?.billing_period).includes('year');

    // Generic: Paid / Free / Trial
    // Avoid overwriting more reliable accounts/check results
    const currentTier = S.serviceTier || 'Unknown';
    const currentGeneric = S.serviceGeneric || 'Unknown';
    const generic = hasTrial ? 'Trial' : (isPaid ? 'Paid' : 'Free');

    // Tier: Plus / Go / Pro / Team / Enterprise (or Free/Unknown)
    let tier = 'Unknown';
    if (!isPaid && !hasTrial) tier = 'Free';
    else if (plan.includes('enterprise')) tier = 'Enterprise';
    else if (plan.includes('team')) tier = 'Team';
    else if (plan.includes('pro')) tier = 'Pro';
    else if (plan.includes('go')) tier = 'Go';
    else if (plan.includes('plus')) tier = 'Plus';
    else if (isPaid) tier = 'Paid';

    const expiresAtStr =
      entitlement?.discount?.expires_at ||
      entitlement?.expires_at ||
      entitlement?.renews_at ||
      entitlement?.cancels_at ||
      entitlement?.trial_ends_at ||
      null;

    return { generic, tier, expiryISO: expiresAtStr };
  }
  function setPow(difficulty) {
    if (!difficulty) return;
    if (S.powDifficulty === difficulty) return;

    S.powDifficulty = difficulty;
    const info = powToLevelInfo(difficulty);
    S.powLevel = info.label;
    S.powColor = info.color;
    S.powBarPct = info.pct;

    const ts = new Date().toISOString();
    S.powHistory.unshift({ ts, difficulty });
    S.powHistory = S.powHistory.slice(0, CFG.historyMax);
    safeLSSet(LS.history, JSON.stringify(S.powHistory));

    render();
  }

  function setServiceFromAccountsCheck(data) {
    const ent = findEntitlement(data);
    if (!ent) return;
    const { generic, tier, expiryISO } = deriveService(ent);

    const changed =
      (S.serviceGeneric !== generic) ||
      (S.serviceTier !== tier) ||
      (S.serviceExpiryISO !== expiryISO);

    S.serviceGeneric = generic;
    S.serviceTier = tier;
    S.serviceExpiryISO = expiryISO || null;

    if (changed) render();
  }

  function setServiceFromChatRequirements(userType) {
    if (!userType) return;
    const t = String(userType).toLowerCase();

    // Try to infer tier from userType hints
    let tier = 'Unknown';
    if (t.includes('enterprise')) tier = 'Enterprise';
    else if (t.includes('team')) tier = 'Team';
    else if (t.includes('pro')) tier = 'Pro';
    else if (t.includes('go')) tier = 'Go';
    else if (t.includes('plus')) tier = 'Plus';
    else if (t.includes('free')) tier = 'Free';

    const generic = t.includes('trial') ? 'Trial' : (tier !== 'Free' && tier !== 'Unknown' ? 'Paid' : 'Free');

    const nextTier = (currentTier !== 'Unknown' && currentTier !== 'Free') ? currentTier : tier;
    const nextGeneric = (currentGeneric !== 'Unknown' && currentGeneric !== 'Free') ? currentGeneric : generic;
    const changed = (S.serviceGeneric !== nextGeneric) || (S.serviceTier !== nextTier);
    if (changed) {
      S.serviceGeneric = nextGeneric;
      S.serviceTier = nextTier;
      render();
    }
  }

  /*************************
   * UI helpers
   *************************/
  function readPos() {
    const raw = safeLSGet(LS.pos);
    if (!raw) return { ...CFG.defaultPos };
    try {
      const obj = JSON.parse(raw);
      if (typeof obj?.right === 'number' && typeof obj?.bottom === 'number') {
        return { right: clamp(obj.right, 8, 2000), bottom: clamp(obj.bottom, 8, 2000) };
      }
    } catch (_) {}
    return { ...CFG.defaultPos };
  }
  function writePos(pos) { safeLSSet(LS.pos, JSON.stringify({ right: pos.right, bottom: pos.bottom })); }

  function readCurrentPosFromUI() {
    // Prefer current on-screen styles; fallback to stored localStorage position.
    const collapsed = (typeof isCollapsed === 'function') ? isCollapsed() : false;
    const el = collapsed ? S.ui.indicator : S.ui.root;
    const r = parseFloat(el?.style?.right);
    const b = parseFloat(el?.style?.bottom);
    if (Number.isFinite(r) && Number.isFinite(b)) return { right: r, bottom: b };
    return readPos();
  }


  
  function clampPosToViewport(pos) {
    const margin = 8;
    const collapsed = (typeof isCollapsed === 'function') ? isCollapsed() : false;

    // Use live element size when possible (fixes "fly out" when content height changes, especially at top edge).
    const vpW = document.documentElement.clientWidth || vpW;
    const vpH = document.documentElement.clientHeight || vpH;

    const activeEl = collapsed ? S.ui.indicator : S.ui.root;
    const activeRect = activeEl?.getBoundingClientRect?.();
    const liveW = (activeRect && activeRect.width > 0) ? Math.round(activeRect.width) : null;
    const liveH = (activeRect && activeRect.height > 0) ? Math.round(activeRect.height) : null;

    const indicatorRect = S.ui.indicator?.getBoundingClientRect?.();
    let indW = Math.max(12, Math.round(indicatorRect?.width || 34));
    let indH = Math.max(12, Math.round(indicatorRect?.height || 34));

    const cardEl = S.ui.root?.shadowRoot?.getElementById?.('card');
    let cardW = cardEl?.offsetWidth || 360;
    let cardH = cardEl?.offsetHeight || 260;
    if (liveW && liveH) {
      if (collapsed) { indW = liveW; indH = liveH; }
      else { cardW = liveW; cardH = liveH; }
    }


    const w = collapsed ? indW : cardW;
    const h = collapsed ? indH : cardH;

    const maxRight = Math.max(margin, vpW - w - margin);
    const maxBottom = Math.max(margin, vpH - h - margin);

    return {
      right: clamp(pos.right, margin, maxRight),
      bottom: clamp(pos.bottom, margin, maxBottom),
    };
  }


  function isCollapsed() { return safeLSGet(LS.collapsed) === '1'; }
  function setCollapsed(v) {
    // Preserve current on-screen position (avoid snapping to default corner)
    ensureUI();
    const curCollapsed = isCollapsed();
    const srcEl = curCollapsed ? S.ui.indicator : S.ui.root;
    let right = parseFloat(srcEl?.style?.right);
    let bottom = parseFloat(srcEl?.style?.bottom);

    // Fallback to stored pos if style not set yet
    if (!Number.isFinite(right) || !Number.isFinite(bottom)) {
      const p = readPos();
      right = p.right;
      bottom = p.bottom;
    }

    // Store position before toggling, so expanded/collapsed share the same anchor
    writePos({ right, bottom });

    safeLSSet(LS.collapsed, v ? '1' : '0');

    // Apply clamped position under the NEW state (collapsed uses indicator size)
    const pos = clampPosToViewport(readPos());
    if (S.ui.root) { S.ui.root.style.right = `${pos.right}px`; S.ui.root.style.bottom = `${pos.bottom}px`; }
    if (S.ui.indicator) { S.ui.indicator.style.right = `${pos.right}px`; S.ui.indicator.style.bottom = `${pos.bottom}px`; }
    writePos(pos);

    renderVisibility();

    // Re-clamp on the next paint(s) to avoid edge-jump when the UI size changes.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const pos2 = clampPosToViewport(readCurrentPosFromUI());
        if (S.ui.root) { S.ui.root.style.right = `${pos2.right}px`; S.ui.root.style.bottom = `${pos2.bottom}px`; }
        if (S.ui.indicator) { S.ui.indicator.style.right = `${pos2.right}px`; S.ui.indicator.style.bottom = `${pos2.bottom}px`; }
        writePos(pos2);
      });
    });
  }

  function hexToRGBA(hex, a) {
    const h = String(hex).replace('#', '').trim();
    if (h.length !== 6) return `rgba(16,185,129,${a})`;
    const r = parseInt(h.slice(0,2), 16);
    const g = parseInt(h.slice(2,4), 16);
    const b = parseInt(h.slice(4,6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function toast(msg) {
    const t = S.ui.el.toast;
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(t._tm);
    t._tm = setTimeout(() => { t.style.display = 'none'; }, 1100);
  }

  function syncIndicatorColor() {
    if (!S.ui.indicator) return;
    const dot = S.ui.indicator.firstChild;
    if (!dot) return;
    dot.style.background = S.powColor || '#10b981';
    S.ui.indicator.style.background = hexToRGBA(S.powColor || '#10b981', 0.18);
    S.ui.indicator.style.borderColor = hexToRGBA(S.powColor || '#10b981', 0.35);
  }

  function setText(el, txt, force) {
    if (!el) return;
    const v = String(txt ?? '');
    if (!force && el.textContent === v) return;
    el.textContent = v;
  }

  function setTag(el, txt, color, force) {
    if (!el) return;
    const v = String(txt ?? '');
    if (force || el.textContent !== v) el.textContent = v;
    el.style.borderColor = hexToRGBA(color, 0.25);
    el.style.background = hexToRGBA(color, 0.10);
    el.style.color = color;
  }

  /*************************
   * UI create + events
   *************************/
  function ensureUI() {
    if (S.ui.root?.isConnected && S.ui.indicator?.isConnected) return true;

    document.getElementById(IDS.root)?.remove();
    document.getElementById(IDS.indicator)?.remove();

    const pos = readPos();

    const root = document.createElement('div');
    root.id = IDS.root;
    root.style.position = 'fixed';
    root.style.zIndex = '999999';
    root.style.pointerEvents = 'auto';
    root.style.right = `${pos.right}px`;
    root.style.bottom = `${pos.bottom}px`;

    const indicator = document.createElement('div');
    indicator.id = IDS.indicator;
    indicator.style.position = 'fixed';
    indicator.style.zIndex = '999999';
    indicator.style.right = `${pos.right}px`;
    indicator.style.bottom = `${pos.bottom}px`;
    indicator.style.width = '34px';
    indicator.style.height = '34px';
    indicator.style.borderRadius = '999px';
    indicator.style.background = 'rgba(16, 185, 129, .18)';
    indicator.style.border = '1px solid rgba(16,185,129,.35)';
    indicator.style.backdropFilter = 'blur(10px)';
    indicator.style.webkitBackdropFilter = 'blur(10px)';
    indicator.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
    indicator.style.cursor = 'pointer';
    indicator.style.display = 'none';
    indicator.style.pointerEvents = 'auto';
    indicator.title = 'Open Monitor';

    const dot = document.createElement('div');
    dot.style.width = '10px';
    dot.style.height = '10px';
    dot.style.borderRadius = '999px';
    dot.style.background = '#10b981';
    dot.style.position = 'absolute';
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.style.transform = 'translate(-50%, -50%)';
    indicator.appendChild(dot);

    const shadow = root.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host, * { box-sizing: border-box; }
        .card{
          width: 360px;
          padding: 18px 18px 16px 18px;
          border-radius: 16px;
          background: var(--cgpt-bg, rgba(255,255,255,.92));
          color: var(--cgpt-fg, #111827);
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 14px 42px rgba(0,0,0,.22);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font: 650 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          position: relative;
          user-select: none;
        }
        @media (prefers-color-scheme: dark){
          .card{
            background: rgba(17,17,17,.76);
            color: rgba(255,255,255,.92);
            border: 1px solid rgba(255,255,255,.10);
            box-shadow: 0 16px 46px rgba(0,0,0,.45);
          }
        }

        .header{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 10px;
          margin-bottom: 12px;
          cursor: grab;
        }
        .header:active{ cursor: grabbing; }
        .title{
          display:flex;
          align-items:center;
          gap: 10px;
          font-weight: 800;
          letter-spacing: .2px;
        }
        .logoDot{
          width: 10px; height: 10px; border-radius: 6px;
          background: rgba(16,185,129,.8);
          box-shadow: 0 0 0 3px rgba(16,185,129,.18);
        }
        .actions{
          display:flex;
          align-items:center;
          gap: 8px;
        }
        .btn{
          border-radius: 10px;
          padding: 7px 10px;
          border: 1px solid rgba(0,0,0,.10);
          background: rgba(0,0,0,.04);
          cursor:pointer;
          font: 750 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          user-select:none;
        }
        @media (prefers-color-scheme: dark){
          .btn{ border:1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.08); color: rgba(255,255,255,.92); }
        }
        .btn:hover{ background: rgba(0,0,0,.07); }
        @media (prefers-color-scheme: dark){
          .btn:hover{ background: rgba(255,255,255,.12); }
        }

        .item{ margin-top: 12px; }
        .row{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 12px;
        }
        .label{
          opacity:.75;
          font-weight: 750;
          min-width: 66px;
        }
        .value{
          font-weight: 850;
        }

        .tierText{
          font-weight: 850;
          color: #111827;
        }
        @media (prefers-color-scheme: dark){
          .tierText{ color: rgba(255,255,255,.92); }
        }
        .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .tag{
          display:inline-flex;
          align-items:center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,.10);
          background: rgba(0,0,0,.04);
          font-size: 12px;
          font-weight: 850;
          user-select:none;
        }
        @media (prefers-color-scheme: dark){
          .tag{ border:1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.07); }
        }

        .progressWrap{
          margin-top: 10px;
          position: relative;
          height: 6px;
        }
        .barBg{
          position:absolute; inset:0;
          border-radius: 999px;
          background: rgba(0,0,0,.08);
        }
        @media (prefers-color-scheme: dark){
          .barBg{ background: rgba(255,255,255,.12); }
        }
        .bar{
          position:absolute;
          left:0; top:0; bottom:0;
          width: 50%;
          border-radius: 999px;
          background: #10b981;
          transition: width .25s ease;
        }

        .ipContainer{
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }
        .warp{
          font-size: 11px;
          font-weight: 950;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(59,130,246,.12);
          border: 1px solid rgba(59,130,246,.20);
          color: rgb(37,99,235);
        }
        @media (prefers-color-scheme: dark){
          .warp{ color: rgb(147,197,253); border-color: rgba(147,197,253,.25); background: rgba(147,197,253,.10); }
        }

        a.link{
          color: inherit;
          text-decoration: none;
          border-bottom: 1px dashed rgba(0,0,0,.25);
        }
        @media (prefers-color-scheme: dark){
          a.link{ border-bottom-color: rgba(255,255,255,.25); }
        }

        .hint{
          margin-top: 10px;
          opacity: .65;
          font-weight: 650;
          font-size: 12px;
        }

        .toast{
          position:absolute;
          right: 14px;
          top: 14px;
          padding: 6px 10px;
          border-radius: 10px;
          background: rgba(0,0,0,.78);
          color: #fff;
          font: 800 12px/1 system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          display:none;
          pointer-events:none;
        }
      </style>

      <div class="card" id="card">
        <div class="toast" id="toast">Copied</div>

        <div class="header" id="dragHandle" title="Drag to move">
          <div class="title">
            <span class="logoDot"></span>
            <span>Service Monitor</span>
          </div>
          <div class="actions">
            <div class="btn" id="copyBtn" data-no-drag="1" title="Copy PoW history">Copy</div>
            <div class="btn" id="collapseBtn" data-no-drag="1" title="Collapse">–</div>
          </div>
        </div>

        <div class="item">
          <div class="row">
            <span class="label">Service</span>
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="value tierText" id="serviceGenericText" data-no-drag="1">Unknown</span>
              <span class="tag" id="serviceTierTag" data-no-drag="1">Unknown</span>
            </div>
          </div>
          <div class="hint" id="expiryHint" style="display:none;"></div>
        </div>

        <div class="item">
          <div class="row">
            <span class="label">PoW</span>
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="value mono" id="powVal">N/A</span>
              <span class="tag" id="powLevel">N/A</span>
            </div>
          </div>
          <div class="progressWrap" title="Lower difficulty (green) usually responds faster">
            <div class="barBg"></div>
            <div class="bar" id="powBar"></div>
          </div>
        </div>

        <div class="item">
          <div class="row">
            <span class="label">Deep Research</span>
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="value mono" id="drVal">…</span>
              <span class="tag" id="drTag">Unknown</span>
            </div>
          </div>
          <div class="hint" id="drHint" style="display:none;"></div>
        </div>

        <div class="item">
          <div class="row">
            <span class="label">IP</span>
            <div class="ipContainer">
              <span class="value mono" id="ipVal" data-no-drag="1" title="Click to copy IP">Unknown</span>
              <span class="warp" id="warpBadge" style="display:none;">WARP</span>
              <span class="tag" id="ipQuality" data-no-drag="1" title="Click to open Scamlytics">Unknown</span>
            </div>
          </div>
        </div>

        <div class="item">
          <div class="row">
            <span class="label">Status</span>
            <a class="link" id="statusLink" href="https://status.openai.com" target="_blank" rel="noreferrer noopener" data-no-drag="1">
              <span class="value" id="statusVal">Unknown</span>
            </a>
          </div>
        </div>

        <div class="hint">Tip: click IP to copy, click “Copy” to copy PoW history.</div>
      </div>
    `;

    document.documentElement.appendChild(root);
    document.documentElement.appendChild(indicator);

    S.ui.root = root;
    S.ui.indicator = indicator;
    S.ui.shadow = shadow;

    const $ = (id) => shadow.getElementById(id);
    S.ui.el = {
      card: $('card'),
      toast: $('toast'),
      dragHandle: $('dragHandle'),
      copyBtn: $('copyBtn'),
      collapseBtn: $('collapseBtn'),
      serviceGenericText: $('serviceGenericText'),
      serviceTierTag: $('serviceTierTag'),
      expiryHint: $('expiryHint'),
      powVal: $('powVal'),
      powLevel: $('powLevel'),
      powBar: $('powBar'),
      drVal: $('drVal'),
      drTag: $('drTag'),
      drHint: $('drHint'),
      ipVal: $('ipVal'),
      warpBadge: $('warpBadge'),
      ipQuality: $('ipQuality'),
      statusVal: $('statusVal'),
      statusLink: $('statusLink'),
    };

    // Collapse/Expand
    S.ui.el.collapseBtn.onclick = (e) => { e.stopPropagation(); setCollapsed(true); };
    indicator.onclick = () => setCollapsed(false);

    // Copy IP
    S.ui.el.ipVal.onclick = async (e) => {
      e.stopPropagation();
      if (!S.ip) return;
      const ok = await copyText(S.ip);
      toast(ok ? 'IP copied' : 'Copy failed');
    };

    // Open scamalytics
    S.ui.el.ipQuality.onclick = (e) => {
      e.stopPropagation();
      if (!S.ip) return;
      window.open(`https://scamalytics.com/ip/${S.ip}`, '_blank');
    };

    // Copy PoW history
    S.ui.el.copyBtn.onclick = async (e) => {
      e.stopPropagation();
      const text = formatHistory();
      const ok = await copyText(text);
      toast(ok ? 'History copied' : 'Copy failed');
    };

    enableDrag(root, indicator, S.ui.el.dragHandle);

    renderVisibility();
    render(true);
    return true;
  }

  function renderVisibility() {
    ensureUI();
    const collapsed = isCollapsed();
    if (S.ui.root) S.ui.root.style.display = collapsed ? 'none' : 'block';
    if (S.ui.indicator) S.ui.indicator.style.display = collapsed ? 'block' : 'none';
    syncIndicatorColor();
    // Note: no guard() here; caller decides when to clamp/position.

  }

  function render(force = false) {
    if (!ensureUI()) return;

    // Service (two-level)
    const expiryText = S.serviceExpiryISO ? `Renews/Expires: ${fmtLocal(S.serviceExpiryISO)}` : '';

    const svcGeneric = S.serviceGeneric || 'Unknown';
    const svcTier = S.serviceTier || 'Unknown';

    const genericColor =
      svcGeneric === 'Paid' ? '#0ea5e9' :
      svcGeneric === 'Trial' ? '#a855f7' :
      svcGeneric === 'Free' ? '#9ca3af' : '#9ca3af';

    const tierColor =
      (svcTier === 'Plus' || svcTier === 'Go' || svcTier === 'Pro' || svcTier === 'Team' || svcTier === 'Enterprise' || svcTier === 'Paid')
        ? '#0ea5e9'
        : (svcTier === 'Free' ? '#9ca3af' : '#9ca3af');


    // Symmetry: value shows Paid/Free/Trial; pill shows tier (Plus/Go/Pro/Team/Enterprise)
    setText(S.ui.el.serviceGenericText, svcGeneric, force);
    setTag(S.ui.el.serviceTierTag, svcTier, tierColor, force);
    if (S.ui.el.expiryHint) {
      if (expiryText) {
        S.ui.el.expiryHint.style.display = 'block';
        setText(S.ui.el.expiryHint, expiryText, force);
      } else {
        S.ui.el.expiryHint.style.display = 'none';
      }
    }

    // PoW
    const powInfo = powToLevelInfo(S.powDifficulty || 'N/A');
    setText(S.ui.el.powVal, powInfo.trimmed, force);
    setTag(S.ui.el.powLevel, powInfo.label, powInfo.color, force);
    if (S.ui.el.powBar) {
      const w = `${clamp(powInfo.pct, 0, 100)}%`;
      if (force || S.ui.el.powBar.style.width !== w) S.ui.el.powBar.style.width = w;
      S.ui.el.powBar.style.background = powInfo.color;
    }

    // Deep Research
    const drRemain = (typeof S.drRemain === 'number') ? S.drRemain : null;
    const drText = (drRemain === null) ? '…' : String(drRemain);
    setText(S.ui.el.drVal, drText, force);

    // Tag + hint: keep it simple (no UI redesign)
    let drTagTxt = 'Unknown';
    let drTagColor = '#9ca3af';
    if (drRemain !== null) {
      if (drRemain === 0) { drTagTxt = '0'; drTagColor = '#ef4444'; }
      else if (drRemain <= 3) { drTagTxt = 'Low'; drTagColor = '#f59e0b'; }
      else { drTagTxt = 'OK'; drTagColor = '#10b981'; }
    }
    setTag(S.ui.el.drTag, drTagTxt, drTagColor, force);

    if (S.ui.el.drHint) {
      if (drRemain !== null && S.drResetISO) {
        S.ui.el.drHint.style.display = 'block';
        setText(S.ui.el.drHint, `Reset: ${fmtLocal(S.drResetISO)}`, force);
      } else {
        S.ui.el.drHint.style.display = 'none';
      }
    }

    // IP
    setText(S.ui.el.ipVal, S.ip || 'Unknown', force);
    if (S.ui.el.warpBadge) S.ui.el.warpBadge.style.display = S.warp ? 'inline-flex' : 'none';
    setTag(S.ui.el.ipQuality, S.ipQualityLabel || 'Unknown', S.ipQualityColor || '#9ca3af', force);

    // Status
    setText(S.ui.el.statusVal, S.statusLabel || 'Unknown', force);
    if (S.ui.el.statusVal) {
      S.ui.el.statusVal.style.color = S.statusColor || '#9ca3af';
      S.ui.el.statusVal.style.fontWeight = '850';
    }

    syncIndicatorColor();
  }

  /*************************
   * Drag (ignore interactive children)
   *************************/
  function enableDrag(root, indicator, handle) {
    let dragging = false;
    let startX = 0, startY = 0, startRight = 0, startBottom = 0;

    const shouldIgnore = (target) => {
      if (!target) return false;
      return !!target.closest?.('[data-no-drag="1"]');
    };


    // --- Added: keep the floating card fully visible by clamping with real card size ---
    const cardEl = root?.shadowRoot?.getElementById('card');

    const getCardSize = () => {
      const w = cardEl?.offsetWidth || 360;
      const h = cardEl?.offsetHeight || 260;
      return { w, h };
    };

    const onDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (shouldIgnore(e.target)) return;

      dragging = true;
      S.dragging = true;

      // When collapsed, root is display:none -> rect is useless; use indicator rect.
      const rectSource = (typeof isCollapsed === 'function' && isCollapsed()) ? indicator : root;
      const rect = rectSource.getBoundingClientRect();

      startX = e.clientX;
      startY = e.clientY;
      startRight = window.innerWidth - rect.right;
      startBottom = window.innerHeight - rect.bottom;

      try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch (_) {}
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const collapsed = (typeof isCollapsed === 'function' && isCollapsed());
const { w, h } = collapsed ? (() => {
  const r = indicator.getBoundingClientRect();
  return { w: r.width || 56, h: r.height || 56 };
})() : getCardSize();


      const maxRight = Math.max(8, window.innerWidth - w - 8);
      const maxBottom = Math.max(8, window.innerHeight - h - 8);

      const right = clamp(startRight - dx, 8, maxRight);
      const bottom = clamp(startBottom - dy, 8, maxBottom);

      root.style.right = `${right}px`;
      root.style.bottom = `${bottom}px`;
      indicator.style.right = `${right}px`;
      indicator.style.bottom = `${bottom}px`;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      S.dragging = false;

      // Read from indicator because it always exists/visible even when collapsed
      const right = parseFloat(indicator.style.right) || CFG.defaultPos.right;
      const bottom = parseFloat(indicator.style.bottom) || CFG.defaultPos.bottom;
      writePos({ right, bottom });
    };

    // Drag from header (expanded) AND from indicator (collapsed)
    handle.addEventListener('pointerdown', onDown, { passive: false });
    indicator.addEventListener('pointerdown', onDown, { passive: false });

    // --- Added: allow dragging from the card body as a safety net ---
    const card = root?.shadowRoot?.getElementById('card');
    card?.addEventListener('pointerdown', onDown, { passive: false });

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });

    indicator.style.cursor = 'grab';
  }

  /*************************
   * Keep-alive
   *************************/
  function guard() {
    if (S.dragging) return;

    const now = Date.now();
    if (now - S.lastGuardAt < CFG.guardThrottleMs) return;
    S.lastGuardAt = now;

    const ok = ensureUI();
    if (!ok) return;

    const base = readCurrentPosFromUI();
    const pos = clampPosToViewport(base);

    if (S.ui.root) { S.ui.root.style.right = `${pos.right}px`; S.ui.root.style.bottom = `${pos.bottom}px`; }
    if (S.ui.indicator) { S.ui.indicator.style.right = `${pos.right}px`; S.ui.indicator.style.bottom = `${pos.bottom}px`; }
    writePos(pos);

    renderVisibility();
  }

  function hookHistory() {
    const push0 = history.pushState;
    const rep0 = history.replaceState;
    history.pushState = function (...args) { const r = push0.apply(this, args); queueMicrotask(guard); return r; };
    history.replaceState = function (...args) { const r = rep0.apply(this, args); queueMicrotask(guard); return r; };
    window.addEventListener('popstate', () => queueMicrotask(guard));
  }

  /*************************
   * Network hooks
   *************************/
  function tryCaptureBearer(input, init) {
    const hdrs = init?.headers || (input instanceof Request ? input.headers : null);
    if (!hdrs) return;
    let tok = null;
    try {
      if (typeof hdrs.get === 'function') tok = hdrs.get('authorization');
      tok = tok || hdrs.authorization || hdrs.Authorization;
    } catch (_) {}
    if (tok) S.bearer = tok;
  }

  function getFetchUrl(resource) {
    try {
      if (typeof resource === 'string') return resource;
      if (resource && typeof resource.url === 'string') return resource.url;
    } catch (_) {}
    return '';
  }

  function isUrlMatch(url, needle) {
    return typeof url === 'string' && url.includes(needle);
  }

  function installHooksOnce() {
    if (W.__cgpt_monitor_ultimate_hooked_v101) return;
    W.__cgpt_monitor_ultimate_hooked_v101 = true;

    const fetch0 = W.fetch ? W.fetch.bind(W) : null;
    if (fetch0) {
      W.fetch = async (resource, options = {}) => {
        tryCaptureBearer(resource, options);
        const res = await fetch0(resource, options);
        const url = getFetchUrl(resource);

        if (isUrlMatch(url, '/backend-api/sentinel/chat-requirements')) {
          try {
            const cloned = res.clone();
            const data = await cloned.json();
            const { difficulty, userType } = parseChatRequirementsFields(data);
            if (difficulty) setPow(difficulty);
            if (userType) setServiceFromChatRequirements(userType);
          } catch (_) {}
        }

        if (isUrlMatch(url, '/backend-api/accounts/check')) {
          try {
            const cloned = res.clone();
            const data = await cloned.json();
            setServiceFromAccountsCheck(data);
          } catch (_) {}
        }

        if (isUrlMatch(url, '/backend-api/conversation/init') || isUrlMatch(url, '/backend-api/conversation/')) {
          try {
            const cloned = res.clone();
            const data = await cloned.json();
            parseDR(data);
          } catch (_) {}
        }

        return res;
      };
    }

    const open0 = XMLHttpRequest.prototype.open;
    const send0 = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      try {
        this.__trackPow = isUrlMatch(url, '/backend-api/sentinel/chat-requirements');
        this.__trackSvc = isUrlMatch(url, '/backend-api/accounts/check');
        this.__trackDR = isUrlMatch(url, '/backend-api/conversation/init') || isUrlMatch(url, '/backend-api/conversation/');
      } catch (_) {}
      return open0.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
      if (this.__trackPow || this.__trackSvc || this.__trackDR) {
        this.addEventListener('load', () => {
          try {
            const data = JSON.parse(this.responseText);
            if (this.__trackPow) {
              const { difficulty, userType } = parseChatRequirementsFields(data);
              if (difficulty) setPow(difficulty);
              if (userType) setServiceFromChatRequirements(userType);
            }
            if (this.__trackSvc) setServiceFromAccountsCheck(data);
            if (this.__trackDR) parseDR(data);
          } catch (_) {}
        });
      }
      return send0.apply(this, args);
    };
  }

  /*************************
   * External fetch helpers
   *************************/
  function gmGet(url, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      try {
        GM_xmlhttpRequest({
          method: 'GET',
          url,
          timeout: timeoutMs,
          onload: (r) => (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(new Error(`HTTP ${r.status}`)),
          onerror: () => reject(new Error('Network error')),
          ontimeout: () => reject(new Error('Timeout')),
        });
      } catch (e) { reject(e); }
    });
  }

  async function refreshIP() {
    try {
      const text = await gmGet('https://www.cloudflare.com/cdn-cgi/trace', 3500);
      const ip = /(^|\n)ip=([^\n]+)/.exec(text)?.[2]?.trim() || null;
      const warp = /(^|\n)warp=([^\n]+)/.exec(text)?.[2]?.trim() || '';
      if (ip && ip !== S.ip) { S.ip = ip; render(); }
      const warpOn = warp.toLowerCase().includes('on');
      if (S.warp !== warpOn) { S.warp = warpOn; render(); }
      return;
    } catch (_) {}
    try {
      const raw = await gmGet('https://ipinfo.io/json', 4500);
      const data = JSON.parse(raw);
      if (data?.ip && data.ip !== S.ip) { S.ip = data.ip; render(); }
    } catch (_) {}
  }

  function parseScamalytics(html) {
    const scoreMatch =
      /Risk\s*Score\s*<\/[^>]+>\s*<[^>]*>\s*([0-9]{1,3})/i.exec(html) ||
      /risk\s*score[^0-9]*([0-9]{1,3})/i.exec(html);

    const score = scoreMatch ? clamp(parseInt(scoreMatch[1], 10), 0, 100) : null;

    let label = 'Unknown';
    let color = '#9ca3af';
    if (score !== null) {
      if (score <= 20) { label = 'Low'; color = '#10b981'; }
      else if (score <= 50) { label = 'Medium'; color = '#f59e0b'; }
      else { label = 'High'; color = '#ef4444'; }
    } else {
      const txt = html.toLowerCase();
      if (txt.includes('high risk')) { label = 'High'; color = '#ef4444'; }
      else if (txt.includes('medium risk')) { label = 'Medium'; color = '#f59e0b'; }
      else if (txt.includes('low risk')) { label = 'Low'; color = '#10b981'; }
    }
    return { score, label, color };
  }

  async function refreshIPQuality() {
    if (!S.ip) return;
    try {
      const html = await gmGet(`https://scamalytics.com/ip/${S.ip}`, 4500);
      const { score, label, color } = parseScamalytics(html);

      const changed = (S.ipQualityScore !== score) || (S.ipQualityLabel !== label) || (S.ipQualityColor !== color);
      S.ipQualityScore = score;
      S.ipQualityLabel = score !== null ? `${label} (${score})` : label;
      S.ipQualityColor = color;
      if (changed) render();
    } catch (_) {}
  }

  async function refreshStatus() {
    // Use GM to avoid CORS issues that can keep it Unknown forever.
    try {
      const raw = await gmGet('https://status.openai.com/api/v2/status.json', 5000);
      const data = JSON.parse(raw);
      const desc = data?.status?.description || 'Unknown';

      let color = '#9ca3af';
      const d = String(desc).toLowerCase();
      if (d.includes('operational')) color = '#10b981';
      else if (d.includes('degraded') || d.includes('partial')) color = '#f59e0b';
      else if (d.includes('major') || d.includes('outage') || d.includes('critical')) color = '#ef4444';

      if (S.statusLabel !== desc || S.statusColor !== color) {
        S.statusLabel = desc;
        S.statusColor = color;
        render();
      }
    } catch (_) {}
  }

  async function pollDR() {
    if (!S.bearer) return;
    try {
      const r = await fetch('/backend-api/conversation/init', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json', authorization: S.bearer },
        body: '{}',
      });
      parseDR(await r.json());
    } catch (_) {}
  }

  async function pollPoW() {
    try {
      const r = await fetch('/backend-api/sentinel/chat-requirements', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
        credentials: 'include',
      });
      const data = await r.json();
      const { difficulty, userType } = parseChatRequirementsFields(data);
      if (difficulty) setPow(difficulty);
      if (userType) setServiceFromChatRequirements(userType);
    } catch (_) {}
  }

  async function pollService() {
    try {
      const r = await fetch('/backend-api/accounts/check', { credentials: 'include' });
      const data = await r.json();
      setServiceFromAccountsCheck(data);
    } catch (_) {}
  }

  function loadHistory() {
    const raw = safeLSGet(LS.history);
    if (!raw) return;
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) S.powHistory = arr.slice(0, CFG.historyMax);
    } catch (_) {}
  }

  function formatHistory() {
    if (!Array.isArray(S.powHistory) || S.powHistory.length === 0) return 'No history';
    return S.powHistory
      .slice(0, CFG.historyMax)
      .map((x) => `${x.ts}  ${x.difficulty}`)
      .join('\n');
  }

  /*************************
   * Boot
   *************************/
  function boot() {
    loadHistory();
    installHooksOnce();

    const ready = () => {
      ensureUI();
      render(true);

      // initial
      pollPoW();
      pollService();
      refreshStatus();
      refreshIP().then(() => refreshIPQuality());
      setTimeout(pollDR, 5000);

      // periodic
      setInterval(pollPoW, CFG.poll.powMs);
      setInterval(pollService, CFG.poll.serviceMs);
      setInterval(refreshStatus, CFG.poll.statusMs);
      setInterval(refreshIP, CFG.poll.ipMs);
      setInterval(refreshIPQuality, CFG.poll.ipQualityMs);
      setInterval(pollDR, CFG.poll.drMs);

      // keepalive
      const mo = new MutationObserver(() => guard());
      mo.observe(document.documentElement, { childList: true, subtree: true });
      hookHistory();

      window.addEventListener('resize', () => guard(), { passive: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) guard(); });
    };

    if (document.body) ready();
    else document.addEventListener('DOMContentLoaded', ready, { once: true });
  }

  boot();
})();
