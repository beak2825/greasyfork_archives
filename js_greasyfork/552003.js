// ==UserScript==
// @name         Torn Chat Timezones - Test Branch
// @namespace    Tampermonkey Scripts
// @version      3.4.1
// @description  Show timezone next to names - With validation feedback & help modal
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/552003/Torn%20Chat%20Timezones%20-%20Test%20Branch.user.js
// @updateURL https://update.greasyfork.org/scripts/552003/Torn%20Chat%20Timezones%20-%20Test%20Branch.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const STORAGE_KEY = 'torn_tz_map_v1';
  const UI_KEY = 'torn_tz_ui_v1';
  const SELF_TZ_KEY = '__self_tz';
  const DISP_MODE_KEY = '__disp_mode';
  const CLOCK_FMT_KEY = '__clock_fmt';
  const SHOW_TIME_KEY = '__show_time';
  const SHOW_TZ_LABEL_KEY = '__show_tz_label';
  const TZ_FONT_SIZE_KEY = '__tz_font_size';
  const TZ_FONT_WEIGHT_KEY = '__tz_font_weight';
  const TZ_FONT_STYLE_KEY = '__tz_font_style';
  const TZ_COLOR_KEY = '__tz_color';

  const CHAT_ID_PREFIXES = ['faction-', 'private-'];
  const PROFILE_LINK_SELECTOR = 'a[href^="/profiles.php?XID="]';
  const CHAT_CONTAINER_SELECTOR = '[id^="faction-"], [id^="private-"]';

  const DEBOUNCE_SEARCH = 120;
  const DEBOUNCE_DECORATION = 16; // ~60fps

  // ============================================================================
  // CACHING LAYER
  // ============================================================================

  const cache = {
    settings: null,
    dateTimeFormatters: new Map(),
    offsetCache: new Map(),
    MAX_FORMATTER_CACHE_SIZE: 100,
    MAX_OFFSET_CACHE_SIZE: 200,

    invalidate() {
      this.settings = null;
      this.offsetCache.clear();
    },

    getSettings() {
      if (!this.settings) {
        this.settings = storage.get();
      }
      return this.settings;
    },

    getDateTimeFormatter(tz, options) {
      const key = `${tz}_${JSON.stringify(options)}`;
      if (!this.dateTimeFormatters.has(key)) {
        // Limit cache size to prevent memory leaks
        if (this.dateTimeFormatters.size >= this.MAX_FORMATTER_CACHE_SIZE) {
          const firstKey = this.dateTimeFormatters.keys().next().value;
          this.dateTimeFormatters.delete(firstKey);
        }
        try {
          this.dateTimeFormatters.set(key, new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            ...options
          }));
        } catch (e) {
          console.warn('[TZ] Failed to create DateTimeFormat for', tz, e);
          return null;
        }
      }
      return this.dateTimeFormatters.get(key);
    },

    getOffset(tz) {
      if (!this.offsetCache.has(tz)) {
        // Limit cache size to prevent memory leaks
        if (this.offsetCache.size >= this.MAX_OFFSET_CACHE_SIZE) {
          const firstKey = this.offsetCache.keys().next().value;
          this.offsetCache.delete(firstKey);
        }
        this.offsetCache.set(tz, resolveOffsetMinutes(tz));
      }
      return this.offsetCache.get(tz);
    }
  };

  // ============================================================================
  // STORAGE LAYER
  // ============================================================================

  const hasGM = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';

  const storage = {
    _getValue(key) {
      try {
        return JSON.parse(hasGM ? GM_getValue(key,'{}') : (localStorage.getItem(key)||'{}')) || {};
      } catch {
        return {};
      }
    },
    _setValue(key, value) {
      const s = JSON.stringify(value||{}, null, 2);
      if (hasGM) GM_setValue(key, s);
      else localStorage.setItem(key, s);
    },
    get() { return this._getValue(STORAGE_KEY); },
    set(m) {
      this._setValue(STORAGE_KEY, m);
      cache.invalidate();
    },
    getUI() { return this._getValue(UI_KEY); },
    setUI(u) { this._setValue(UI_KEY, u); },
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const qs = (s,r=document)=>r.querySelector(s);
  const qsa = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc = s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  function setRadioGroupState(container, name, value) {
    container.querySelectorAll(`input[name="${name}"]`).forEach(input => {
      input.checked = (input.value === value);
    });
  }

  function validateInput(value, type) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return { valid: false, message: `Missing ${type}.` };
    if (type === 'XID' && !/^\d{3,}$/.test(trimmed)) return { valid: false, message: 'Invalid XID format.' };
    return { valid: true, value: trimmed };
  }

  function ensureStyle(css){
    if(typeof GM_addStyle==='function'){
      GM_addStyle(css);
      return;
    }
    const t=document.createElement('style');
    t.textContent=css;
    document.head.appendChild(t);
  }

  function toast(msg, ok=true){
    const t=document.createElement('div');
    t.textContent=msg;
    t.style.cssText=`position:fixed;left:50%;top:calc(18px + env(safe-area-inset-top));transform:translateX(-50%);padding:8px 12px;border-radius:10px;font:13px/1.2 system-ui,Segoe UI,Roboto,sans-serif;` +
      `color:${ok?'#052':'#7f1d1d'};background:${ok?'#a7f3d0':'#fee2e2'};border:1px solid ${ok?'#10b981':'#ef4444'};` +
      `box-shadow:0 8px 30px rgba(0,0,0,.25);z-index:2147483647;`;
    document.body.appendChild(t);
    setTimeout(()=>{
      t.style.opacity='0';
      t.style.transition='opacity .3s';
      setTimeout(()=>t.remove(),300);
    },1200);
  }

  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function throttle(fn, delay) {
    let pending = false;
    return function(...args) {
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          fn.apply(this, args);
          pending = false;
        });
      }
    };
  }

  // ============================================================================
  // STYLES
  // ============================================================================

  ensureStyle(`
    .tz-modal, .tz-modal *{ box-sizing:border-box }
    .tz-modal{ position:fixed; inset:0; padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left)); z-index:2147480000; display:flex; align-items:center; justify-content:center; background:rgba(8,11,15,.6); backdrop-filter:blur(6px) saturate(120%); animation:tz-fade .12s ease-out }
    @keyframes tz-fade{ from{opacity:0} to{opacity:1} }

    :root{
      --tz-surface:#12161d; --tz-surface-2:#171c24; --tz-border:#243043; --tz-text:#e6edf3; --tz-text-dim:#9fb0c5;
      --tz-accent:#5aa7ff; --tz-accent-2:#7dd3fc; --tz-danger:#ef4444; --tz-focus:0 0 0 3px rgba(90,167,255,.38);
      --tz-radius:14px; --tz-shadow:0 16px 50px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04);
      --tz-success:#10b981; --tz-error:#ef4444;
    }

    .tz-card{ position:relative; width:min(980px,100%); max-height:88vh; overflow:auto; font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:var(--tz-text); background:var(--tz-surface); border:1px solid var(--tz-border); border-radius:var(--tz-radius); box-shadow:var(--tz-shadow) }

    .tz-header{ position:sticky; top:0; z-index:5; display:flex; gap:10px; align-items:flex-start; padding:14px; background:var(--tz-surface); border-bottom:1px solid var(--tz-border); box-shadow:0 2px 8px rgba(0,0,0,.2) }
    .tz-header-content{ flex:1; min-width:0 }
    .tz-title{ font-weight:800; font-size:18px; margin-bottom:4px }
    .tz-sub{ color:var(--tz-text-dim); font-size:12px; line-height:1.3 }
    .tz-sub--warning{ color:#fbbf24; font-weight:600 }
    .tz-header-actions{ display:flex; gap:8px; align-items:center; flex-shrink:0 }
    .tz-x{ cursor:pointer; padding:6px 8px; border-radius:8px; font-size:18px; color:var(--tz-text-dim) }
    .tz-x:hover{ background:rgba(255,255,255,.06) }

    .tz-body{ padding:14px; display:grid; gap:14px }

    .tz-input{ background:var(--tz-surface-2); color:var(--tz-text); border:1px solid var(--tz-border); border-radius:10px; padding:10px 12px; min-height:38px; width:100%; transition: border-color 0.2s ease, box-shadow 0.2s ease }
    .tz-input:focus{ outline:none; border-color:var(--tz-accent); box-shadow:var(--tz-focus) }
    .tz-input[readonly]{ opacity:.8; cursor:not-allowed }

    .tz-input--neutral{ border-color:var(--tz-border) }
    .tz-input--valid{ border-color:#10b981 !important; box-shadow:0 0 0 1px #10b981 !important }
    .tz-input--invalid{ border-color:#ef4444 !important; box-shadow:0 0 0 1px #ef4444 !important }

    .tz-validation-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 2;
    }

    .tz-validation-icon--valid { color: #10b981; }
    .tz-validation-icon--invalid {
      color: #ef4444;
      cursor: pointer;
      pointer-events: auto;
    }

    .tz-validation-icon--invalid:hover { opacity: 0.8; }

    .tz-validation-icon--invalid::after {
      content: '❓';
      font-size: 14px;
      margin-left: 3px;
      opacity: 0.8;
    }

    .tz-btn{ display:inline-flex; align-items:center; justify-content:center; gap:6px; background:linear-gradient(180deg,var(--tz-surface-2),rgba(0,0,0,.05)); color:var(--tz-text); border:1px solid var(--tz-border); border-radius:10px; min-height:38px; padding:8px 14px; font-weight:700; letter-spacing:.2px; cursor:pointer; white-space:nowrap }
    .tz-btn--primary{ background:linear-gradient(180deg,var(--tz-accent),var(--tz-accent-2)); color:#071423; border-color:transparent }
    .tz-btn--danger{ background:linear-gradient(180deg,var(--tz-danger),#b91c1c); color:#fff; border-color:transparent }
    .tz-btn:disabled{ opacity:.6; cursor:not-allowed }
    .tz-btn--compact{ padding:6px 10px; min-height:32px; font-size:13px }

    @media (min-width:641px){
      .tz-header-actions .tz-btn--compact{ padding:10px 18px; min-height:42px; font-size:15px }
    }

    .tz-actions{ display:flex; gap:8px; flex-wrap:wrap; align-items:center }
    .tz-actions .tz-btn{ flex:1 1 auto }
    .tz-actions label.tz-btn{
      display:inline-flex !important;
      align-items:center !important;
      justify-content:center !important;
      cursor:pointer !important;
      box-sizing:border-box !important;
      font-family:inherit !important;
      font-size:inherit !important;
      line-height:inherit !important;
      margin:0 !important;
      padding:8px 14px !important;
      min-height:38px !important;
    }

    .tz-grid{ display:grid; gap:8px; grid-template-columns:minmax(260px,1.3fr) minmax(180px,.9fr) minmax(220px,1.1fr) auto; align-items:center }
    @media (max-width:940px){
      .tz-grid{ grid-template-columns:1fr }
    }

    .tz-list{ border:1px solid var(--tz-border); border-radius:12px; overflow:hidden; background:var(--tz-surface-2) }
    .tz-list-stats{ display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--tz-surface); border-bottom:1px solid var(--tz-border); font-size:12px; color:var(--tz-text-dim) }
    .tz-list-stats strong{ color:var(--tz-text); font-weight:700 }
    .tz-list header{ display:flex; gap:8px; align-items:center; padding:10px 12px; border-bottom:1px solid var(--tz-border); background:var(--tz-surface-2) }
    .tz-list table{ width:100%; border-collapse:separate; border-spacing:0; table-layout:fixed }
    .tz-list thead th{ background:var(--tz-surface-2); color:var(--tz-text-dim); text-align:left; font-weight:800; font-size:12px; padding:10px 12px; border-bottom:1px solid var(--tz-border); cursor:pointer; user-select:none; white-space:nowrap }
    .tz-list tbody td{ padding:10px 12px; border-bottom:1px dashed rgba(128,128,128,.25); vertical-align:middle; overflow:hidden; text-overflow:ellipsis }
    .tz-col-xid{ width:130px; color:#bbb; font-weight:600 }
    .tz-col-pname{ width:220px }
    .tz-col-tz{ width:200px }
    .tz-col-actions{ width:84px; text-align:right; white-space:nowrap }
    .tz-row-input{ width:100% }
    .tz-hide{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(1px,1px,1px,1px) }
    .tz-sticky-actions{ position:sticky; top:48px; z-index:6; display:flex; gap:8px; align-items:center; justify-content:flex-end; background:linear-gradient(180deg,var(--tz-surface),transparent); padding:8px 12px; flex-wrap:wrap; display:none }

    .tz-my-row{ display:grid; gap:8px; grid-template-columns:1fr auto auto; align-items:center }
    .tz-my-buttons{ display:contents }
    .tz-my-help{ font-size:12px; color:var(--tz-text-dim); grid-column:1 / -1 }

    @media (max-width:640px){
      .tz-my-row{ grid-template-columns:1fr }
      .tz-my-buttons{ display:flex; gap:8px; grid-column:1 / -1 }
      .tz-my-buttons .tz-btn{ flex:1 }
    }

    .tz-prefs{ display:grid; gap:8px; grid-template-columns:1fr }
    @media (min-width:560px){ .tz-prefs{ grid-template-columns:repeat(2,minmax(220px,1fr)) } }
    @media (min-width:900px){ .tz-prefs{ grid-template-columns:repeat(3,minmax(220px,1fr)) } }

    .tz-pref-item{ display:flex; flex-direction:column; gap:6px }
    .tz-pref-label{ font-weight:700; font-size:13px; margin-bottom:2px }

    .tz-radio{ display:flex; gap:10px; align-items:center; flex-wrap:wrap }
    .tz-radio label{ display:flex; gap:6px; align-items:center; padding:6px 10px; border:1px solid var(--tz-border); border-radius:10px; background:var(--tz-surface-2); cursor:pointer; font-size:13px; white-space:nowrap }
    .tz-radio input{ margin:0 }

    @media (max-width:640px){
      .tz-header, .tz-body{ padding:12px }
      .tz-header{ flex-wrap:wrap }
      .tz-header-content{ order:0; width:100% }
      .tz-header-actions{ order:2; width:100%; justify-content:stretch }
      .tz-header-actions .tz-btn{ flex:1 }
      .tz-x{ order:1; margin-left:auto }
      .tz-list thead{ display:none }
      .tz-list tbody{ display:block }
      .tz-list tbody tr{ display:grid; grid-template-columns:1fr; gap:8px; padding:10px 12px; border-bottom:1px solid rgba(128,128,128,.25) }
      .tz-list tbody td{ display:block; padding:0; border:0 }
      .tz-list tbody td + td{ margin-top:6px }
      .tz-list tbody td::before{ content:attr(data-label); display:block; font-size:11px; color:var(--tz-text-dim); margin-bottom:2px }
      .tz-col-actions{ text-align:left }
      .tz-sticky-actions{ display:none }
    }

    .tz-collapse{ border:1px solid var(--tz-border); border-radius:12px; overflow:hidden; background:var(--tz-surface-2) }
    .tz-collapse-header{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid var(--tz-border) }
    .tz-collapse-title{ font-weight:800; font-size:13px; color:var(--tz-text-dim) }
    .tz-collapse-toggle{ cursor:pointer }
    .tz-collapse-content{ padding:12px; display:grid; gap:14px }
    .tz-collapse[data-open="false"] .tz-collapse-content{ display:none }

    .tz-input-wrap{ position:relative; display:flex; align-items:center }
    .tz-input-wrap .tz-input{ flex:1; padding-right:32px }

    .tz-clear-btn{
      position:absolute;
      right:32px;
      background:transparent;
      border:none;
      font-size:20px;
      color:var(--tz-text-dim);
      cursor:pointer;
      padding:0;
      line-height:1;
      z-index: 1;
    }
    .tz-clear-btn:hover{ color:var(--tz-text) }

    a[href^="/profiles.php?XID="] .tz-display {
      opacity: 0.7 !important;
    }

    .tz-tabs{ display:flex; gap:2px; margin-bottom:16px; border-bottom:1px solid var(--tz-border) }
    .tz-tab{ flex:1; padding:10px 12px; background:var(--tz-surface-2); border:none; color:var(--tz-text-dim); cursor:pointer; font-weight:600; border-radius:8px 8px 0 0; transition:all .2s }
    .tz-tab.active{ background:var(--tz-surface); color:var(--tz-text); border-bottom:2px solid var(--tz-accent) }
    .tz-tab:hover:not(.active){ background:rgba(255,255,255,.05); color:var(--tz-text) }
    .tz-tab-content{ display:none }
    .tz-tab-content.active{ display:block }

    .tz-slider-container{ display:flex; gap:8px; align-items:center; margin:8px 0; flex-wrap:wrap }
    .tz-slider{ flex:1; min-width:120px; height:6px; background:var(--tz-border); border-radius:3px; outline:none; cursor:pointer }
    .tz-slider::-webkit-slider-thumb{ appearance:none; width:18px; height:18px; background:var(--tz-accent); border-radius:50%; cursor:pointer; border:2px solid var(--tz-surface) }
    .tz-slider::-moz-range-thumb{ width:18px; height:18px; background:var(--tz-accent); border-radius:50%; cursor:pointer; border:2px solid var(--tz-surface) }
    .tz-slider-value{ min-width:50px; text-align:center; font-weight:600; color:var(--tz-text); font-size:13px }
    .tz-slider-label{ font-size:11px; color:var(--tz-text-dim); white-space:nowrap }

    .tz-import-dialog{ position:fixed; inset:0; z-index:2147480001; display:flex; align-items:center; justify-content:center; background:rgba(8,11,15,.85); backdrop-filter:blur(8px); animation:tz-fade .15s ease-out }
    .tz-import-card{ background:var(--tz-surface); border:1px solid var(--tz-border); border-radius:var(--tz-radius); box-shadow:var(--tz-shadow); padding:20px; width:min(450px,90vw); max-height:80vh; overflow-y:auto }
    .tz-import-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid var(--tz-border) }
    .tz-import-title{ font-size:18px; font-weight:800; color:var(--tz-text) }
    .tz-import-body{ display:grid; gap:16px }
    .tz-import-section{ background:var(--tz-surface-2); border:1px solid var(--tz-border); border-radius:10px; padding:14px }
    .tz-import-section-title{ font-weight:700; font-size:14px; color:var(--tz-text); margin-bottom:8px }
    .tz-import-section-desc{ font-size:12px; color:var(--tz-text-dim); margin-bottom:10px; line-height:1.4 }
    .tz-import-preview{ background:rgba(0,0,0,.2); border:1px solid rgba(255,255,255,.1); border-radius:6px; padding:8px 10px; font-size:12px; color:var(--tz-accent-2); font-family:'Courier New',monospace; margin-top:8px }
    .tz-import-checkbox{ display:flex; align-items:center; gap:8px; padding:8px; border-radius:8px; cursor:pointer; transition:background .2s }
    .tz-import-checkbox:hover{ background:rgba(255,255,255,.05) }
    .tz-import-checkbox input[type="checkbox"]{ width:18px; height:18px; cursor:pointer; accent-color:var(--tz-accent) }
    .tz-import-checkbox label{ cursor:pointer; font-size:13px; color:var(--tz-text); user-select:none }
    .tz-import-actions{ display:flex; gap:10px; margin-top:20px; padding-top:16px; border-top:1px solid var(--tz-border) }
    .tz-import-warning{ background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:8px; padding:10px 12px; font-size:12px; color:#fca5a5; margin-top:12px }

    .tz-help-intro{ padding:12px; background:var(--tz-surface-2); border:1px solid var(--tz-border); border-radius:10px; margin-bottom:16px; text-align:center; font-size:14px; line-height:1.5 }
    .tz-help-grid{ display:grid; gap:12px; grid-template-columns:1fr; margin-bottom:20px }
    @media (min-width:560px){ .tz-help-grid{ grid-template-columns:repeat(2,1fr) } }
    .tz-help-card{ padding:14px; background:var(--tz-surface-2); border:1px solid var(--tz-border); border-radius:10px }
    .tz-help-card-title{ font-weight:700; font-size:14px; margin-bottom:4px }
    .tz-help-card-desc{ font-size:12px; color:var(--tz-text-dim); margin-bottom:10px }
    .tz-help-examples{ display:flex; flex-wrap:wrap; gap:6px }
    .tz-example-tag{ display:inline-block; padding:4px 8px; background:rgba(90,167,255,.15); border:1px solid rgba(90,167,255,.3); border-radius:6px; font-family:'Courier New',monospace; font-size:12px; font-weight:600; color:var(--tz-accent-2) }
    .tz-help-section{ margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--tz-border) }
    .tz-help-section:last-child{ border-bottom:none; margin-bottom:0; padding-bottom:0 }
    .tz-help-section-title{ font-weight:700; font-size:15px; margin-bottom:12px }
    .tz-help-list{ margin:0; padding-left:20px }
    .tz-help-list li{ margin-bottom:10px; line-height:1.5; font-size:13px }
    .tz-help-list code{ padding:2px 5px; background:rgba(90,167,255,.15); border:1px solid rgba(90,167,255,.3); border-radius:4px; font-family:'Courier New',monospace; font-size:12px }
    .tz-help-finder{ background:var(--tz-surface-2); border:1px solid var(--tz-border); border-radius:10px; padding:12px }
    .tz-help-finder-step{ display:flex; gap:12px; align-items:flex-start; padding:10px 0 }
    .tz-help-finder-step:not(:last-child){ border-bottom:1px dashed rgba(128,128,128,.2) }
    .tz-step-number{ display:flex; align-items:center; justify-content:center; width:28px; height:28px; background:var(--tz-accent); color:#071423; border-radius:50%; font-weight:700; font-size:14px; flex-shrink:0 }
    .tz-step-desc{ font-size:12px; color:var(--tz-text-dim) }
    .tz-btn-inline{ display:inline-block; padding:2px 8px; background:var(--tz-accent); color:#071423; border:none; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; margin-left:4px }
    .tz-btn-inline:hover{ opacity:0.85 }
    .tz-help-details{ margin-bottom:10px; background:var(--tz-surface-2); border:1px solid var(--tz-border); border-radius:8px; overflow:hidden }
    .tz-help-details summary{ padding:10px 12px; cursor:pointer; font-weight:600; font-size:13px; user-select:none }
    .tz-help-details summary:hover{ background:rgba(255,255,255,.03) }
    .tz-help-details p{ padding:0 12px 12px 12px; margin:0; font-size:13px; line-height:1.5; color:var(--tz-text-dim) }
    .tz-help-details code{ padding:2px 5px; background:rgba(90,167,255,.15); border:1px solid rgba(90,167,255,.3); border-radius:4px; font-family:'Courier New',monospace; font-size:12px }
    .tz-help-details a{ color:var(--tz-accent-2); text-decoration:underline }
  `);

  // ============================================================================
  // TIMEZONE UTILITIES
  // ============================================================================

  function extractNameAndXID(input){
    const s = String(input||'').trim();
    if(!s) return {name:'', xid:''};
    const url = s.match(/XID=(\d{3,})/i);
    if (url) return {name: s.replace(/https?:\/\/[^ ]+/, '').trim(), xid: url[1]};
    const m = s.match(/^(.*?)[\s]*\[(\d{3,})\][\s]*$/);
    if (m) return {name: m[1].trim(), xid: m[2]};
    if (/^\d{3,}$/.test(s)) return {name:'', xid:s};
    return {name:s, xid:''};
  }

  // Autocomplete removed - validation indicators provide better UX

  const ABBR_TO_MINUTES = {
    UTC: 0, GMT: 0,
    PST: -8*60, PDT: -7*60, MST: -7*60, MDT: -6*60, CST: -6*60, CDT: -5*60, EST: -5*60, EDT: -4*60, AST: -4*60, ADT: -3*60,
    BST: +1*60, CET: +1*60, CEST:+2*60, EET: +2*60, EEST:+3*60, WAT: +1*60, CAT: +2*60, EAT: +3*60,
    IST: +5*60+30, SGT: +8*60, HKT:+8*60, AWST:+8*60, KST: +9*60, JST:+9*60,
    AEST:+10*60, AEDT:+11*60, ACST:+9*60+30, ACDT:+10*60+30, NZST:+12*60, NZDT:+13*60,
    // Additional common abbreviations
    MT: -7*60, // Mountain Time (treating as MST)
    PT: -8*60, // Pacific Time (treating as PST)
    CT: -6*60, // Central Time (treating as CST)
    ET: -5*60, // Eastern Time (treating as EST)
  };

  function parseUTCLabelToMinutes(s){
    const m = String(s||'').trim().toUpperCase().match(/^(?:UTC|GMT)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?$/);
    if(!m) return null;
    const sign = m[1] === '-' ? -1 : 1;
    const hh = parseInt(m[2],10);
    const mm = m[3] ? parseInt(m[3],10) : 0;
    return sign * (hh*60 + mm);
  }

  function offsetFromIanaMinutes(tz){
    try{
      const dtf = cache.getDateTimeFormatter(tz, {
        hour12:false,
        year:'numeric', month:'2-digit', day:'2-digit',
        hour:'2-digit', minute:'2-digit', second:'2-digit'
      });
      if (!dtf) return null;

      const now = new Date();
      const parts = dtf.formatToParts(now);
      const map = {};
      for (const {type, value} of parts) if (type !== 'literal') map[type]=value;
      const asUTC = Date.UTC(+map.year, (+map.month)-1, +map.day, +map.hour, +map.minute, +map.second);
      return Math.round((asUTC - now.getTime())/60000);
    }catch{
      return null;
    }
  }

  function resolveOffsetMinutes(tz){
    if(!tz) return null;
    const key = String(tz).trim().toUpperCase();
    if (key in ABBR_TO_MINUTES) return ABBR_TO_MINUTES[key];
    const utc = parseUTCLabelToMinutes(tz);
    if(utc!==null) return utc;
    return offsetFromIanaMinutes(tz);
  }

  function diffHoursRounded(targetTz, myTz){
    const a = cache.getOffset(targetTz);
    const b = cache.getOffset(myTz);
    if(a===null || b===null) return null;
    return Math.round((a - b)/60);
  }

  function timeStringInTz(tz, fmt){
    const off = cache.getOffset(tz);
    if (off===null) return null;
    const now = new Date();
    const localMs = now.getTime() + off*60000;
    const d = new Date(localMs);
    let h = d.getUTCHours(), m = d.getUTCMinutes();
    if (fmt === '12'){
      const suf = h>=12 ? 'PM' : 'AM';
      let hh = h%12; if (hh===0) hh=12;
      return `${hh}:${String(m).padStart(2,'0')} ${suf}`;
    }
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function formatUTCOffsetLabel(minutes){
    const sign = minutes < 0 ? '-' : '+';
    const abs = Math.abs(minutes);
    const hh = Math.floor(abs/60);
    const mm = abs % 60;
    return `UTC${sign}${hh}${mm ? ':'+String(mm).padStart(2,'0') : ''}`;
  }

  // ============================================================================
  // IMPORT/EXPORT
  // ============================================================================

  const SETTINGS_EXPORT_MAP = [
    [SELF_TZ_KEY, 'selfTz'],
    [DISP_MODE_KEY, 'displayMode'],
    [CLOCK_FMT_KEY, 'clockFormat'],
    [SHOW_TIME_KEY, 'showTime'],
    [SHOW_TZ_LABEL_KEY, 'showTzLabel'],
    [TZ_FONT_SIZE_KEY, 'tzFontSize'],
    [TZ_FONT_WEIGHT_KEY, 'tzFontWeight'],
    [TZ_FONT_STYLE_KEY, 'tzFontStyle'],
    [TZ_COLOR_KEY, 'tzColor'],
  ];

  const VALID_SETTING_KEYS = new Set(SETTINGS_EXPORT_MAP.map(([k])=>k));
  const isNumericKey = k => /^\d{3,}$/.test(k);
  const isNameKey = k => /^__name_\d{3,}$/.test(k);
  const isNoteKey = k => /^__note_\d{3,}$/.test(k);

  function buildExportObject(draft){
    const xids = Object.keys(draft).filter(isNumericKey).sort((a,b)=>+a-+b);
    const entries = xids.map(xid => {
      const o = { xid, tz: draft[xid] || '' };
      const name = draft[`__name_${xid}`];
      const note = draft[`__note_${xid}`];
      if (name) o.name = name;
      if (note) o.note = note;
      return o;
    });

    const settings = {};
    for (const [internal, external] of SETTINGS_EXPORT_MAP){
      if (internal in draft) settings[external] = draft[internal];
    }

    return {
      meta: { format: 'torn-chat-timezones', version: '2', exportedAt: new Date().toISOString() },
      settings,
      entries
    };
  }

  function applyNewSchemaIntoDraft(incoming, draft, options = { includeSettings: true, includeEntries: true }) {
    let added = 0, updated = 0;

    if (options.includeSettings) {
      const settings = incoming?.settings || {};
      for (const [internal, external] of SETTINGS_EXPORT_MAP) {
        if (external in settings) {
          if (settings[external] == null || settings[external] === '') {
            delete draft[internal];
          } else {
            draft[internal] = settings[external];
          }
        }
      }
    }

    if (options.includeEntries) {
      const entries = Array.isArray(incoming?.entries) ? incoming.entries : [];
      for (const e of entries) {
        const xid = String(e.xid || '').trim();
        const tz = String(e.tz || '').trim();
        if (!xid || !tz) continue;

        if (!(xid in draft)) added++;
        else if (JSON.stringify(draft[xid]) !== JSON.stringify(tz)) updated++;
        draft[xid] = tz;

        const nameK = `__name_${xid}`;
        const noteK = `__note_${xid}`;
        if (e.name && e.name !== draft[nameK]) draft[nameK] = e.name;
        else if (!e.name && nameK in draft) delete draft[nameK];
        if (e.note && e.note !== draft[noteK]) draft[noteK] = e.note;
        else if (!e.note && noteK in draft) delete draft[noteK];
      }
    }

    return { added, updated };
  }

  function applyLegacySchemaIntoDraft(incoming, draft, options = { includeSettings: true, includeEntries: true }) {
    let added = 0, updated = 0;

    for (const [k, v] of Object.entries(incoming)) {
      const isSetting = VALID_SETTING_KEYS.has(k);
      const isEntry = isNumericKey(k) || isNameKey(k) || isNoteKey(k);

      if (!isSetting && !isEntry) continue;
      if (isSetting && !options.includeSettings) continue;
      if (isEntry && !options.includeEntries) continue;

      if (!(k in draft)) added++;
      else if (JSON.stringify(draft[k]) !== JSON.stringify(v)) updated++;
      draft[k] = v;
    }

    return { added, updated };
  }

  function showImportDialog(fileData, onConfirm, onCancel) {
    const dialog = document.createElement('div');
    dialog.className = 'tz-import-dialog';

    let includeSettings = true;
    let includeEntries = true;

    let previewData = { settingsCount: 0, entriesCount: 0, format: 'unknown' };
    try {
      const parsed = JSON.parse(fileData);
      const isNewFormat = parsed && Array.isArray(parsed.entries);

      if (isNewFormat) {
        previewData.format = 'v2';
        previewData.settingsCount = Object.keys(parsed.settings || {}).length;
        previewData.entriesCount = (parsed.entries || []).length;
      } else {
        previewData.format = 'v1 (legacy)';
        const keys = Object.keys(parsed || {});
        previewData.settingsCount = keys.filter(k => VALID_SETTING_KEYS.has(k)).length;
        previewData.entriesCount = keys.filter(k => isNumericKey(k)).length;
      }
    } catch (e) {
      previewData.format = 'invalid';
    }

    dialog.innerHTML = `
      <div class="tz-import-card">
        <div class="tz-import-header">
          <div class="tz-import-title">Import Options</div>
          <button class="tz-x" id="tz-import-cancel" title="Cancel">✖</button>
        </div>

        <div class="tz-import-body">
          <div class="tz-import-section">
            <div class="tz-import-section-title">📄 File Information</div>
            <div class="tz-import-preview">Format: ${previewData.format}<br>Settings found: ${previewData.settingsCount}<br>Entries found: ${previewData.entriesCount}</div>
          </div>

          <div class="tz-import-section">
            <div class="tz-import-section-title">⚙️ Settings</div>
            <div class="tz-import-section-desc">Display preferences, timezone format, font styles, and colors</div>
            <div class="tz-import-checkbox">
              <input type="checkbox" id="tz-import-settings" ${includeSettings ? 'checked' : ''}>
              <label for="tz-import-settings">Import settings (${previewData.settingsCount} found)</label>
            </div>
          </div>

          <div class="tz-import-section">
            <div class="tz-import-section-title">👥 Player Entries</div>
            <div class="tz-import-section-desc">Player XIDs, names, notes, and timezone mappings</div>
            <div class="tz-import-checkbox">
              <input type="checkbox" id="tz-import-entries" ${includeEntries ? 'checked' : ''}>
              <label for="tz-import-entries">Import entries (${previewData.entriesCount} found)</label>
            </div>
            ${previewData.entriesCount > 0 ? `<div class="tz-import-warning">⚠️ Existing entries with matching XIDs will be updated. This cannot be undone until you save.</div>` : ''}
          </div>
        </div>

        <div class="tz-import-actions">
          <button class="tz-btn" id="tz-import-cancel-btn">Cancel</button>
          <button class="tz-btn tz-btn--primary" id="tz-import-confirm-btn" style="flex:1">Import Selected</button>
        </div>
      </div>
    `;

    const card = dialog.querySelector('.tz-import-card');
    const settingsCheckbox = dialog.querySelector('#tz-import-settings');
    const entriesCheckbox = dialog.querySelector('#tz-import-entries');
    const confirmBtn = dialog.querySelector('#tz-import-confirm-btn');

    function updateConfirmButton() {
      const nothingSelected = !settingsCheckbox.checked && !entriesCheckbox.checked;
      confirmBtn.disabled = nothingSelected;
      confirmBtn.style.opacity = nothingSelected ? '0.5' : '1';
      confirmBtn.style.cursor = nothingSelected ? 'not-allowed' : 'pointer';
    }

    settingsCheckbox.addEventListener('change', () => {
      includeSettings = settingsCheckbox.checked;
      updateConfirmButton();
    });

    entriesCheckbox.addEventListener('change', () => {
      includeEntries = entriesCheckbox.checked;
      updateConfirmButton();
    });

    const close = () => {
      dialog.remove();
      if (onCancel) onCancel();
    };

    const confirm = () => {
      if (!settingsCheckbox.checked && !entriesCheckbox.checked) {
        toast('Please select at least one option to import', false);
        return;
      }
      dialog.remove();
      onConfirm({ includeSettings, includeEntries });
    };

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) close();
    });

    dialog.querySelector('#tz-import-cancel').addEventListener('click', close);
    dialog.querySelector('#tz-import-cancel-btn').addEventListener('click', close);
    confirmBtn.addEventListener('click', confirm);

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Enter' && !confirmBtn.disabled) confirm();
    });

    document.body.appendChild(dialog);
    updateConfirmButton();
  }

  // ============================================================================
  // HELP MODAL
  // ============================================================================

  function showTimezoneHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'tz-modal';
    modal.innerHTML = `
      <div class="tz-card" style="max-width:550px">
        <div class="tz-header">
          <div class="tz-title">🔍 How to Enter Timezones</div>
          <button class="tz-x" title="Close">✖</button>
        </div>

        <div class="tz-body">
          <div class="tz-help-intro">
            Enter any of these formats. The script will show a ✓ or ✗ to confirm if it's valid.
          </div>

          <div class="tz-help-grid">
            <div class="tz-help-card">
              <div class="tz-help-card-title">🔤 Abbreviations</div>
              <div class="tz-help-card-desc">Common 3-4 letter codes (not all supported)</div>
              <div class="tz-help-examples">
                <span class="tz-example-tag">PST</span>
                <span class="tz-example-tag">EST</span>
                <span class="tz-example-tag">GMT</span>
                <span class="tz-example-tag">CET</span>
                <span class="tz-example-tag">JST</span>
                <span class="tz-example-tag">AEST</span>
              </div>
            </div>

            <div class="tz-help-card">
              <div class="tz-help-card-title">🌍 UTC Offsets</div>
              <div class="tz-help-card-desc">Hours from UTC (simple & clear)</div>
              <div class="tz-help-examples">
                <span class="tz-example-tag">UTC+5</span>
                <span class="tz-example-tag">UTC-8</span>
                <span class="tz-example-tag">UTC+5:30</span>
                <span class="tz-example-tag">GMT+1</span>
              </div>
            </div>

            <div class="tz-help-card">
              <div class="tz-help-card-title">🗺️ IANA Timezones</div>
              <div class="tz-help-card-desc">Full timezone names (auto DST)</div>
              <div class="tz-help-examples">
                <span class="tz-example-tag">America/New_York</span>
                <span class="tz-example-tag">Europe/London</span>
                <span class="tz-example-tag">Asia/Tokyo</span>
                <span class="tz-example-tag">Australia/Sydney</span>
              </div>
            </div>
          </div>

          <div class="tz-help-section">
            <div class="tz-help-section-title">💡 Quick Tips</div>
            <ul class="tz-help-list">
              <li><strong>Watch for the checkmark:</strong> Type your timezone and look for the ✓ or ✗ indicator</li>
              <li><strong>Use UTC offsets when unsure:</strong> <code>UTC+7</code> always works, no matter the city. <strong>Not all abbreviations are supported</strong> - if your abbreviation shows ✗, use the UTC offset instead</li>
              <li><strong>Full IANA names handle DST:</strong> <code>America/New_York</code> switches between EST/EDT automatically</li>
              <li><strong>Abbreviations are fixed:</strong> <code>PST</code> is always -8 hours (doesn't switch to PDT automatically)</li>
            </ul>
          </div>

          <div class="tz-help-section">
            <div class="tz-help-section-title">🔎 Finding Your Timezone</div>
            <div class="tz-help-finder">
              <div class="tz-help-finder-step">
                <span class="tz-step-number">1</span>
                <div>
                  <strong>Check what time it is where you are</strong><br>
                  <span class="tz-step-desc">Right now it's <strong id="tz-current-time">--:--</strong></span>
                </div>
              </div>
              <div class="tz-help-finder-step">
                <span class="tz-step-number">2</span>
                <div>
                  <strong>Calculate hours from UTC</strong><br>
                  <span class="tz-step-desc">UTC time is <strong id="tz-utc-time">--:--</strong></span>
                </div>
              </div>
              <div class="tz-help-finder-step">
                <span class="tz-step-number">3</span>
                <div>
                  <strong>Use the "Guess" button for automatic detection</strong><br>
                  <span class="tz-step-desc">Click <button class="tz-btn-inline" id="tz-guess-inline">Guess My Timezone</button> to auto-fill your timezone (uses IANA format like <code>America/New_York</code>)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="tz-help-section">
            <div class="tz-help-section-title">❓ Common Questions</div>
            <details class="tz-help-details">
              <summary>What if my timezone isn't listed in autocomplete?</summary>
              <p>There's no autocomplete dropdown - just type any valid timezone format and watch for the ✓ checkmark. Common abbreviations like PST, GMT, and JST are supported, but not all abbreviations work. If you see ✗, try using the UTC offset format instead (like <code>UTC+7</code> or <code>UTC-5</code>), which works for every timezone.</p>
            </details>
            <details class="tz-help-details">
              <summary>What's the difference between PST and America/Los_Angeles?</summary>
              <p><code>PST</code> is always -8 hours from UTC. <code>America/Los_Angeles</code> automatically switches between PST (winter, -8 hours) and PDT (summer, -7 hours). IANA timezone names like <code>America/Los_Angeles</code> handle daylight saving time automatically, making them more accurate year-round.</p>
            </details>
            <details class="tz-help-details">
              <summary>What does the "Guess" button fill in?</summary>
              <p>The "Guess" button detects your system timezone and fills in the full IANA name (like <code>America/New_York</code> or <code>Europe/London</code>). This format automatically handles daylight saving time changes throughout the year.</p>
            </details>
            <details class="tz-help-details">
              <summary>Why does it say "Invalid" when I type a city name?</summary>
              <p>City names alone don't work (e.g., "Bangkok" won't work). Use the format <code>Region/City</code> like <code>Asia/Bangkok</code> or use the UTC offset like <code>UTC+7</code>.</p>
            </details>
            <details class="tz-help-details">
              <summary>How do I find the full IANA name for my timezone?</summary>
              <p>Search online for "IANA timezone [your city]" or use a site like <a href="https://www.timeanddate.com/time/map/" target="_blank" rel="noopener">timeanddate.com</a>. Or just use <code>UTC±offset</code> which always works!</p>
            </details>
          </div>

          <button class="tz-btn tz-btn--primary" id="tz-help-close" style="width:100%;margin-top:12px">Got it!</button>
        </div>
      </div>
    `;

    // Update live times
    function updateTimes() {
      const now = new Date();
      const localTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const utcTime = now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: false });
      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const offsetMins = Math.abs(offsetMinutes) % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const offsetStr = offsetMins > 0 ? `${sign}${offsetHours}:${String(offsetMins).padStart(2,'0')}` : `${sign}${offsetHours}`;

      const currentTimeEl = modal.querySelector('#tz-current-time');
      const utcTimeEl = modal.querySelector('#tz-utc-time');
      const offsetEl = modal.querySelector('#tz-calculated-offset');

      if (currentTimeEl) currentTimeEl.textContent = localTime;
      if (utcTimeEl) utcTimeEl.textContent = utcTime;
      if (offsetEl) offsetEl.textContent = `UTC${offsetStr}`;
    }

    updateTimes();
    const timeInterval = setInterval(updateTimes, 1000);

    const close = () => {
      clearInterval(timeInterval);
      modal.remove();
    };

    modal.querySelector('.tz-x').addEventListener('click', close);
    modal.querySelector('#tz-help-close').addEventListener('click', close);
    modal.querySelector('#tz-guess-inline')?.addEventListener('click', () => {
      try {
        const iana = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        toast(`Your timezone: ${iana}`, true);
        close();
      } catch {
        toast('Your timezone: UTC', true);
        close();
      }
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    document.body.appendChild(modal);
  }

  // ============================================================================
  // DISPLAY FORMATTING
  // ============================================================================

  function formatDisplay(labelTz){
    const map = cache.getSettings();
    const myTz = map[SELF_TZ_KEY] || null;
    const mode = map[DISP_MODE_KEY] || 'relative';
    const clk = map[CLOCK_FMT_KEY] || '24';
    const showTime = map[SHOW_TIME_KEY] !== false;
    const showLabel = map[SHOW_TZ_LABEL_KEY] !== false;

    if (!showTime && !showLabel) return '';

    const parts = [];

    if (showTime) {
      if (mode === 'clock') {
        const tstr = timeStringInTz(labelTz, clk);
        parts.push(tstr || labelTz);
      } else {
        if (!myTz) {
          if (!showLabel) return '';
        } else {
          const diff = diffHoursRounded(labelTz, myTz);
          if (diff == null || !isFinite(diff)) {
            if (!showLabel) return '';
          } else {
            const sign = diff>0 ? '+' : (diff<0 ? '−' : '±');
            const n = Math.abs(diff);
            if (showLabel) parts.push(`${sign}${n}h`);
            else parts.push(`${sign}${n} ${n === 1 ? 'hour' : 'hours'}`);
          }
        }
      }
    }

    if (showLabel) parts.push(labelTz);
    return parts.length ? `(${parts.join(' | ')})` : '';
  }

  function applyFontStyles(span) {
    const map = cache.getSettings();
    const fontSize = map[TZ_FONT_SIZE_KEY] || '0.85';
    const fontWeight = map[TZ_FONT_WEIGHT_KEY] || '400';
    const fontStyle = map[TZ_FONT_STYLE_KEY] || 'italic';
    const color = map[TZ_COLOR_KEY] || '#888888';

    span.style.fontSize = `${fontSize}em`;
    span.style.fontWeight = fontWeight;
    span.style.fontStyle = fontStyle;
    span.style.color = color;
  }

  function updateExistingTimezoneStyles() {
    try {
      qsa('a[href^="/profiles.php?XID="] .tz-display').forEach(span => {
        try {
          applyFontStyles(span);
          } catch (e) {
          console.warn('[TZ] Failed to apply font styles to span:', e);
        }
      });
    } catch (e) {
      console.error('[TZ] updateExistingTimezoneStyles failed:', e);
    }
  }

  function updateExistingTimezoneDisplays() {
    try {
      const map = cache.getSettings();
      qsa(PROFILE_LINK_SELECTOR, document).forEach(anchor => {
        try {
          if (!anchor.dataset.tzProcessed) return;

          const xid = xidFromAnchor(anchor);
          if (!xid || (SELF_XID && xid === SELF_XID)) return;

          const tz = map[xid];

          const existingSpan = anchor.querySelector('.tz-display');
          if (existingSpan) {
            const baseText = anchor.textContent.replace(/\s+\([^)]+\):$/, ':');
            anchor.textContent = baseText;
            delete anchor.dataset.tzProcessed;
          }

          if (tz) {
            injectTzIntoSenderAnchor(anchor, tz);
          }
        } catch (e) {
          console.warn('[TZ] Failed to update timezone display for anchor:', e);
        }
      });
    } catch (e) {
      console.error('[TZ] updateExistingTimezoneDisplays failed:', e);
    }
  }

  // ============================================================================
  // TIMEZONE INJECTION
  // ============================================================================

  function injectTzIntoSenderAnchor(a, tz){
    if(!a || a.dataset.tzProcessed) return;

    const t = a.textContent || '';
    if(!t.endsWith(':')) return;

    const base = t.replace(/\s+\([^)]+\):$/, ':');
    const display = tz ? formatDisplay(tz) : '';

    if (display) {
      const label = base.replace(/:$/, '');

      while (a.firstChild) a.removeChild(a.firstChild);

      a.appendChild(document.createTextNode(label + ' '));

      const span = document.createElement('span');
      span.className = 'tz-display';
      span.textContent = display;
      a.appendChild(span);

      a.appendChild(document.createTextNode(':'));

      try {
        applyFontStyles(span);
      } catch (e) {
        console.warn('[TZ] applyFontStyles failed', e);
      }
    } else {
      a.textContent = base;
    }

    a.dataset.tzProcessed = 'true';
  }

  // ============================================================================
  // CHAT DECORATION
  // ============================================================================

  function inTargetChat(el){
    let p=el;
    while(p&&p!==document.body){
      if(p.id && CHAT_ID_PREFIXES.some(prefix => p.id.startsWith(prefix))) return p;
      p=p.parentElement;
    }
    return null;
  }

  function getSelfXID(){
    const wsc=qs('#websocketConnectionData');
    if(wsc?.textContent){
      try{
        const j=JSON.parse(wsc.textContent.trim());
        if(j?.userID) return String(j.userID);
      }catch{}
    }
    const me=qs('#topHeaderBanner .settings-menu a[href^="/profiles.php?XID="]');
    if(me){
      const m=me.getAttribute('href')?.match(/XID=(\d+)/);
      if(m) return m[1];
    }
    const avatar=qs('#topHeaderBanner img.mini-avatar-image');
    if(avatar){
      const m=avatar.src.match(/-(\d+)\.(?:gif|png|jpg)/i);
      if(m) return m[1];
    }
    return null;
  }

  const SELF_XID = getSelfXID();

  function xidFromAnchor(a){
    if(!a) return null;
    let m=a.getAttribute('href')?.match(/XID=(\d+)/);
    if(m) return m[1];
    m=a.id?.match(/:(\d+)$/);
    return m?m[1]:null;
  }

  function decorateMessageAuthors(root=document){
    try {
      const map = cache.getSettings();
      const containers = qsa(CHAT_CONTAINER_SELECTOR, root);

      if (containers.length === 0 && root !== document) {
        if (inTargetChat(root)) {
          containers.push(root);
        }
      }

      if (containers.length === 0) return;

      for (const container of containers) {
        const anchors = qsa(PROFILE_LINK_SELECTOR, container)
          .filter(a =>
            a.textContent?.endsWith(':') &&
            !a.dataset.tzProcessed
          );

        if (anchors.length === 0) continue;

        for (const a of anchors) {
          try {
            const xid = xidFromAnchor(a);
            if (!xid || (SELF_XID && xid === SELF_XID)) continue;

            const tz = map[xid];
            if (tz) injectTzIntoSenderAnchor(a, tz);
          } catch (e) {
            console.warn('[TZ] Failed to decorate anchor:', a, e);
          }
        }
      }
    } catch (e) {
      console.error('[TZ] decorateMessageAuthors failed:', e);
    }
  }

  const decorateThrottled = throttle(decorateMessageAuthors, DEBOUNCE_DECORATION);

  // ============================================================================
  // MUTATION OBSERVER (OPTIMIZED)
  // ============================================================================

  const observedContainers = new WeakSet();

  const observer = new MutationObserver(mutations => {
    let needsDecoration = false;

    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (inTargetChat(node) || node.querySelector?.(PROFILE_LINK_SELECTOR)) {
          needsDecoration = true;
          break;
        }
      }
      if (needsDecoration) break;
    }

    if (needsDecoration) {
      decorateThrottled(document);
    }
  });

  function observeChatContainers() {
    try {
      const containers = qsa(CHAT_CONTAINER_SELECTOR);

      if (containers.length === 0) {
        return;
      }

      for (const container of containers) {
        if (!observedContainers.has(container)) {
          observer.observe(container, { childList: true, subtree: true });
          observedContainers.add(container);
        }
      }
    } catch (e) {
      console.error('[TZ] observeChatContainers failed:', e);
    }
  }

  let containerObserverTimeout = null;
  const containerObserver = new MutationObserver((mutations) => {
    let foundNewContainers = false;

    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (CHAT_ID_PREFIXES.some(prefix => node.id?.startsWith(prefix))) {
          foundNewContainers = true;
          break;
        }

        if (node.querySelector?.(CHAT_CONTAINER_SELECTOR)) {
          foundNewContainers = true;
          break;
        }
      }
      if (foundNewContainers) break;
    }

    if (foundNewContainers) {
      clearTimeout(containerObserverTimeout);
      containerObserverTimeout = setTimeout(() => {
        observeChatContainers();
        decorateMessageAuthors(document);
      }, 100);
    }
  });

  containerObserver.observe(document.body, { childList: true, subtree: true });

  // ============================================================================
  // TIMEZONE VALIDATION (ENHANCED)
  // ============================================================================

  function validateTimezone(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return false;

    const offset = resolveOffsetMinutes(trimmed);
    return offset !== null;
  }

  function updateTimezoneInputValidation(input) {
    const value = input.value.trim();

    // Remove old indicators
    input.classList.remove('tz-input--valid', 'tz-input--invalid', 'tz-input--neutral');
    const existingIcon = input.parentElement.querySelector('.tz-validation-icon');
    if (existingIcon) existingIcon.remove();

    if (!value) {
      input.classList.add('tz-input--neutral');
      return;
    }

    // Test if timezone is valid
    const offset = resolveOffsetMinutes(value);

    if (offset !== null) {
      // Valid timezone
      input.classList.add('tz-input--valid');

      // Show checkmark icon inside input
      const icon = document.createElement('span');
      icon.className = 'tz-validation-icon tz-validation-icon--valid';
      icon.innerHTML = '✓';
      icon.title = 'Valid timezone';
      input.parentElement.appendChild(icon);
    } else {
      // Invalid timezone
      input.classList.add('tz-input--invalid');

      // Show error icon with help link
      const icon = document.createElement('span');
      icon.className = 'tz-validation-icon tz-validation-icon--invalid';
      icon.innerHTML = '✗';
      icon.title = 'Invalid timezone - click for help';
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', showTimezoneHelpModal);
      input.parentElement.appendChild(icon);
    }
  }

  // ============================================================================
  // SETTINGS MODAL
  // ============================================================================

  function openTZSettings(){
    let stored = storage.get();
    let draft = JSON.parse(JSON.stringify(stored));
    const ui = Object.assign({ sortKey:'xid', sortDir:'asc', search:'', optsCollapsed:false }, storage.getUI());
    const nameKey = xid => `__name_${xid}`;
    const noteKey = xid => `__note_${xid}`;
    let dirty = false;
    let searchTimer = null;
    const eventListeners = [];

    const modal=document.createElement('div');
    modal.className='tz-modal';
    modal.innerHTML = `
      <div class="tz-card" aria-labelledby="tz-title">
        <div class="tz-header">
          <div class="tz-header-content">
            <div class="tz-title" id="tz-title">Chat Timezones</div>
            <div class="tz-sub" id="tz-subtitle">Edit freely; nothing is saved until you click <b>Save Changes</b>.</div>
          </div>
          <div class="tz-header-actions">
            <button id="tz-discard" class="tz-btn tz-btn--compact">Discard</button>
            <button id="tz-save" class="tz-btn tz-btn--primary tz-btn--compact" disabled>Save</button>
          </div>
          <button class="tz-x" title="Close" aria-label="Close">✖</button>
        </div>

        <div class="tz-body">
          <div class="tz-collapse" id="tz-collapse" data-open="${ui.optsCollapsed ? 'false' : 'true'}">
            <div class="tz-collapse-header">
              <div class="tz-collapse-title">Options</div>
              <button id="tz-collapse-toggle" class="tz-btn tz-collapse-toggle">${ui.optsCollapsed ? 'Show options' : 'Hide options'}</button>
            </div>
            <div class="tz-collapse-content">
              <div class="tz-tabs">
                <button class="tz-tab active" data-tab="main">Main</button>
                <button class="tz-tab" data-tab="display">Display</button>
                <button class="tz-tab" data-tab="fonts">Fonts</button>
              </div>

              <div class="tz-tab-content active" id="tab-main">
                <div class="tz-my-row" role="group" aria-label="My timezone">
                  <div class="tz-input-wrap">
                    <input id="tz-my-tz" class="tz-input ${draft[SELF_TZ_KEY] ? 'tz-input--valid' : 'tz-input--neutral'}" placeholder="My timezone e.g. UTC+5, PST, GMT..." value="${esc(draft[SELF_TZ_KEY] || '')}">
                  </div>
                  <div class="tz-my-buttons">
                    <button id="tz-my-guess" class="tz-btn" title="Guess based on your system timezone">Guess</button>
                    <button id="tz-show-help" class="tz-btn" title="Show timezone help">❓ Help</button>
                  </div>
                </div>

                <div class="tz-grid" role="group" aria-label="Add or update timezone" style="margin-top: 16px;">
                  <div class="tz-input-wrap">
                    <input id="tz-add-id" class="tz-input" placeholder="Paste 'Name [XID]'">
                    <button id="tz-clear-fields" type="button" class="tz-clear-btn" title="Clear all">✖</button>
                  </div>
                  <input id="tz-add-name" class="tz-input" placeholder="Player name (auto-filled)" readonly tabindex="-1">
                  <div class="tz-input-wrap">
                    <input id="tz-add-tz" class="tz-input" placeholder="Timezone e.g. UTC+5, PST, GMT...">
                  </div>
                  <button id="tz-add-btn" class="tz-btn tz-btn--primary">Add / Update</button>
                </div>

                <div class="tz-actions" style="margin-top: 16px;">
                  <button id="tz-export" class="tz-btn" title="Ctrl/Cmd+E">Export JSON</button>
                  <input id="tz-import-file" type="file" accept="application/json" class="tz-hide">
                  <label for="tz-import-file" class="tz-btn">Import JSON</label>
                  <button id="tz-delete-all" class="tz-btn tz-btn--danger" title="Clear list">Delete All</button>
                </div>
              </div>

              <div class="tz-tab-content" id="tab-display">
                <div class="tz-prefs" role="group" aria-label="Display preferences">
                  <div>
                    <div style="font-weight:700;margin-bottom:6px">Display style</div>
                    <div class="tz-radio">
                      <label><input type="radio" name="tz-mode" value="relative" ${(draft[DISP_MODE_KEY]||'relative')==='relative'?'checked':''}> <span>Relative (+N)</span></label>
                      <label><input type="radio" name="tz-mode" value="clock" ${(draft[DISP_MODE_KEY]||'relative')==='clock'?'checked':''}> <span>Exact time (HH:MM)</span></label>
                    </div>
                  </div>
                  <div>
                    <div style="font-weight:700;margin-bottom:6px">Clock format</div>
                    <div class="tz-radio">
                      <label><input type="radio" name="tz-clock" value="24" ${(draft[CLOCK_FMT_KEY]||'24')==='24'?'checked':''}> <span>24-hour</span></label>
                      <label><input type="radio" name="tz-clock" value="12" ${(draft[CLOCK_FMT_KEY]||'24')==='12'?'checked':''}> <span>12-hour (AM/PM)</span></label>
                    </div>
                  </div>
                  <div>
                    <div style="font-weight:700;margin-bottom:6px">What to show</div>
                    <div class="tz-radio">
                      <label><input type="checkbox" id="tz-show-time" ${draft[SHOW_TIME_KEY]!==false?'checked':''}> <span>Show time/offset</span></label>
                      <label><input type="checkbox" id="tz-show-tzlabel" ${draft[SHOW_TZ_LABEL_KEY]!==false?'checked':''}> <span>Show timezone label</span></label>
                    </div>
                    <div class="tz-my-help">Uncheck both to hide annotations entirely.</div>
                  </div>
                </div>
              </div>

              <div class="tz-tab-content" id="tab-fonts">
                <div class="tz-prefs" role="group" aria-label="Font settings">
                  <div class="tz-pref-item" style="grid-column: 1 / -1;">
                    <div class="tz-pref-label">Font size</div>
                    <div class="tz-slider-container">
                      <span class="tz-slider-label">50%</span>
                      <input type="range" id="tz-font-size-slider" class="tz-slider" min="50" max="150" value="${Math.round((parseFloat(draft[TZ_FONT_SIZE_KEY] || '0.85') * 100))}">
                      <span class="tz-slider-label">150%</span>
                      <span id="tz-font-size-value" class="tz-slider-value">${Math.round((parseFloat(draft[TZ_FONT_SIZE_KEY] || '0.85') * 100))}%</span>
                    </div>
                  </div>
                  <div class="tz-pref-item">
                    <div class="tz-pref-label">Font weight</div>
                    <div class="tz-radio">
                      <label><input type="radio" name="tz-font-weight" value="300" ${(draft[TZ_FONT_WEIGHT_KEY]||'400')==='300'?'checked':''}> <span>Light</span></label>
                      <label><input type="radio" name="tz-font-weight" value="400" ${(draft[TZ_FONT_WEIGHT_KEY]||'400')==='400'?'checked':''}> <span>Normal</span></label>
                      <label><input type="radio" name="tz-font-weight" value="600" ${(draft[TZ_FONT_WEIGHT_KEY]||'400')==='600'?'checked':''}> <span>Bold</span></label>
                    </div>
                  </div>
                  <div class="tz-pref-item">
                    <div class="tz-pref-label">Font style</div>
                    <div class="tz-radio">
                      <label><input type="radio" name="tz-font-style" value="normal" ${(draft[TZ_FONT_STYLE_KEY]||'italic')==='normal'?'checked':''}> <span>Normal</span></label>
                      <label><input type="radio" name="tz-font-style" value="italic" ${(draft[TZ_FONT_STYLE_KEY]||'italic')==='italic'?'checked':''}> <span>Italic</span></label>
                      <label><input type="radio" name="tz-font-style" value="oblique" ${(draft[TZ_FONT_STYLE_KEY]||'italic')==='oblique'?'checked':''}> <span>Oblique</span></label>
                    </div>
                  </div>
                  <div class="tz-pref-item">
                    <div class="tz-pref-label">Text color</div>
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                      <input type="color" id="tz-color-picker" value="${draft[TZ_COLOR_KEY] || '#888888'}" style="width:40px;height:32px;border:1px solid var(--tz-border);border-radius:6px;cursor:pointer">
                      <span style="font-size:12px;color:var(--tz-text-dim)">Customize timezone text color</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tz-sticky-actions">
                <button id="tz-discard" class="tz-btn">Discard Changes</button>
                <button id="tz-save" class="tz-btn tz-btn--primary" disabled>Save Changes</button>
              </div>
            </div>
          </div>

          <div class="tz-list" role="region" aria-label="Timezone mappings">
            <div class="tz-list-stats">
              <span>Total entries: <strong id="tz-total-count">0</strong></span>
              <span id="tz-filtered-count" style="display:none">Showing: <strong id="tz-filtered-value">0</strong></span>
            </div>
            <header>
              <input id="tz-search" class="tz-input tz-search" placeholder="Search XID, name, notes, timezone…" value="${esc(ui.search||'')}">
              <button id="tz-clear" class="tz-btn" title="Clear search">Clear</button>
            </header>
            <table>
              <thead>
                <tr>
                  <th class="tz-col-xid" role="columnheader" data-key="xid">XID</th>
                  <th class="tz-col-pname" role="columnheader" data-key="name">Player name</th>
                  <th role="columnheader" data-key="note">Notes</th>
                  <th class="tz-col-tz" role="columnheader" data-key="tz">Timezone</th>
                  <th class="tz-col-actions"></th>
                </tr>
              </thead>
              <tbody id="tz-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const card = modal.firstElementChild;
    const $=(s,r=card)=>r.querySelector(s);

    const subtitleEl = $('#tz-subtitle');
    const setDirty = (v=true)=>{
      dirty = v;
      $('#tz-save').disabled = !dirty;

      if (dirty) {
        subtitleEl.innerHTML = '<span class="tz-sub--warning">⚠️ You have unsaved changes.</span> Click <b>Save</b> to save, or <b>Discard</b> to revert.';
      } else {
        subtitleEl.innerHTML = 'Edit freely; nothing is saved until you click <b>Save Changes</b>.';
      }
    };

    const idEl = $('#tz-add-id');
    const nameEl = $('#tz-add-name');
    const tzEl = $('#tz-add-tz');
    const myTzEl = $('#tz-my-tz');

    function persist(){ storage.set(draft); stored = storage.get(); }
    function persistUI(){ storage.setUI(ui); }

    function collectRows(){
      const rows = Object.keys(draft)
        .filter(k=>!k.startsWith('__') && !VALID_SETTING_KEYS.has(k))
        .map(xid=>({ xid, name: draft[nameKey(xid)] ?? '', note: draft[noteKey(xid)] ?? '', tz: draft[xid] ?? '' }));

      const q = ui.search.toLowerCase();
      const filtered = q ? rows.filter(r =>
        r.xid.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.note.toLowerCase().includes(q) || r.tz.toLowerCase().includes(q)
      ) : rows;

      const dir = ui.sortDir === 'desc' ? -1 : 1;
      const key = ui.sortKey;
      filtered.sort((a,b)=>{
        if(key==='xid'){
          const an=+a.xid, bn=+b.xid;
          if(!isNaN(an)&&!isNaN(bn)) return (an-bn)*dir;
          return a.xid.localeCompare(b.xid)*dir;
        }
        const cmp=(a[key]||'').toString().localeCompare((b[key]||'').toString(), undefined, {sensitivity:'base'});
        if(cmp!==0) return cmp*dir;
        const an=+a.xid, bn=+b.xid;
        if(!isNaN(an)&&!isNaN(bn)) return (an-bn)*dir;
        return a.xid.localeCompare(b.xid)*dir;
      });
      return filtered;
    }

    function setHeaderSortIndicators(){
      qsa('thead th[role="columnheader"]', card).forEach(th=>{
        th.removeAttribute('aria-sort');
        if(th.dataset.key===ui.sortKey) th.setAttribute('aria-sort', ui.sortDir==='desc'?'descending':'ascending');
      });
    }

    function render(){
      const tbody = $('#tz-tbody');

      const allEntries = Object.keys(draft)
        .filter(k=>!k.startsWith('__') && !VALID_SETTING_KEYS.has(k));

      const rows = collectRows();

      const totalCount = allEntries.length;
      const filteredCount = rows.length;
      const isFiltered = ui.search.trim().length > 0;

      $('#tz-total-count').textContent = totalCount;

      const filteredCountEl = $('#tz-filtered-count');
      if (isFiltered && filteredCount !== totalCount) {
        $('#tz-filtered-value').textContent = filteredCount;
        filteredCountEl.style.display = '';
      } else {
        filteredCountEl.style.display = 'none';
      }

      tbody.innerHTML = rows.map(r=>`
        <tr data-xid="${esc(r.xid)}">
          <td data-label="XID" class="tz-col-xid">${esc(r.xid)}</td>
          <td data-label="Player name" class="tz-col-pname"><input data-k="name" class="tz-row-input tz-input" placeholder="player name" value="${esc(r.name)}"></td>
          <td data-label="Notes"><input data-k="note" class="tz-row-input tz-input" placeholder="optional note" value="${esc(r.note)}"></td>
          <td data-label="Timezone" class="tz-col-tz"><div class="tz-input-wrap"><input data-k="tz" class="tz-row-input tz-input" value="${esc(r.tz)}" placeholder="e.g. UTC, PST etc."></div></td>
          <td data-label="Actions" class="tz-col-actions"><button class="tz-btn tz-btn--danger" data-act="del">Del</button></td>
        </tr>
      `).join('') || `<tr><td colspan="5" style="padding:14px 12px; color:var(--tz-text-dim)">No entries match your search.</td></tr>`;

      // Add validation to timezone inputs in the table
      qsa('.tz-row-input[data-k="tz"]', tbody).forEach(input => {
        updateTimezoneInputValidation(input);
        input.addEventListener('input', () => {
          updateTimezoneInputValidation(input);
        });
      });

      setHeaderSortIndicators();
    }

    function addOrUpdate(){
      try{
        const parsed = extractNameAndXID(idEl.value.trim());
        const xidValidation = validateInput(parsed.xid, 'XID');
        const tzValidation = validateInput(tzEl.value, 'timezone');

        if(!xidValidation.valid){ toast(xidValidation.message, false); return; }
        if(!tzValidation.valid){ toast(tzValidation.message, false); return; }

        const xid = xidValidation.value;
        const name = (parsed.name || nameEl.value).trim();
        const tz = tzValidation.value;

        draft[xid]=tz;
        if(name) draft[nameKey(xid)]=name; else delete draft[nameKey(xid)];
        idEl.value = nameEl.value = tzEl.value = '';
        idEl.focus();
        render();
        setDirty(true);
        toast(`Added/updated ${name?name+' ':''}[${xid}] → ${tz}`);
      }catch(err){
        console.error('[torn tz] add/update failed', err);
        toast('Add/Update failed. See console for details.', false);
      }
    }

    function exportJSON(){
      try{
        const exportObj = buildExportObject(draft);
        const pretty = JSON.stringify(exportObj, null, 2);
        const ts = new Date().toISOString().replace(/[:.]/g,'-');
        const filename = `chat-timezones-v2-${ts}.json`;

        if (typeof GM_download === 'function') {
          GM_download({
            url: 'data:application/json;charset=utf-8,' + encodeURIComponent(pretty),
            name: filename,
            saveAs: true
          });
        } else {
          const blob = new Blob([pretty], {type:'application/json'});
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 0);
        }
        toast('Exported JSON (v2 schema)');
      }catch(err){
        console.error('[torn tz] export failed', err);
        toast('Export failed.', false);
      }
    }

    function importJSON(file){
      const reader = new FileReader();
      reader.onload = () => {
        try{
          const fileData = String(reader.result || '{}');

          showImportDialog(fileData, (options) => {
            try {
              const incoming = JSON.parse(fileData);
              const isNew = incoming && Array.isArray(incoming.entries);

              const stats = isNew
                ? applyNewSchemaIntoDraft(incoming, draft, options)
                : applyLegacySchemaIntoDraft(incoming, draft, options);

              // Update UI elements if settings were imported
              if (options.includeSettings) {
                // Update My Timezone
                myTzEl.value = draft[SELF_TZ_KEY] || '';
                updateTimezoneInputValidation(myTzEl);

                // Update Display Mode radio buttons
                setRadioGroupState(card, 'tz-mode', draft[DISP_MODE_KEY] || 'relative');

                // Update Clock Format radio buttons
                setRadioGroupState(card, 'tz-clock', draft[CLOCK_FMT_KEY] || '24');

                // Update Show Time/Label checkboxes
                $('#tz-show-time').checked = draft[SHOW_TIME_KEY] !== false;
                $('#tz-show-tzlabel').checked = draft[SHOW_TZ_LABEL_KEY] !== false;

                // Update Font Size slider
                const fontSizePercent = Math.round((parseFloat(draft[TZ_FONT_SIZE_KEY] || '0.85') * 100));
                $('#tz-font-size-slider').value = fontSizePercent;
                $('#tz-font-size-value').textContent = `${fontSizePercent}%`;

                // Update Font Weight radio buttons
                setRadioGroupState(card, 'tz-font-weight', draft[TZ_FONT_WEIGHT_KEY] || '400');

                // Update Font Style radio buttons
                setRadioGroupState(card, 'tz-font-style', draft[TZ_FONT_STYLE_KEY] || 'italic');

                // Update Color Picker
                $('#tz-color-picker').value = draft[TZ_COLOR_KEY] || '#888888';
              }

              render();
              setDirty(true);

              const parts = [];
              if (options.includeSettings) parts.push('settings');
              if (options.includeEntries) parts.push(`${stats.added} added, ${stats.updated} updated`);

              toast(`Imported ${parts.join(' | ')}`);
            } catch (err) {
              console.error('[torn tz] import failed', err);
              toast('Import failed: invalid or unsupported JSON.', false);
            }
          }, () => {
            toast('Import cancelled', false);
          });
        }catch(err){
          console.error('[torn tz] import file read failed', err);
          toast('Failed to read import file.', false);
        }
      };
      reader.readAsText(file);
    }

    function deleteAll(){
      const entries = Object.keys(draft).filter(k=>!k.startsWith('__') && !VALID_SETTING_KEYS.has(k)).length;
      if (!entries) { toast('List is already empty'); return; }
      if (!confirm(`Delete ALL ${entries} entries?\n\nThis removes every XID, name, note, and timezone (unsaved until you click Save).`)) return;
      for (const k of Object.keys(draft)) {
        if (!k.startsWith('__') && !VALID_SETTING_KEYS.has(k)) {
          delete draft[k];
        }
      }
      render();
      setDirty(true);
      toast('List cleared');
    }

    function saveAll(){
      const myTz = myTzEl.value.trim();
      if (myTz) draft[SELF_TZ_KEY] = myTz; else delete draft[SELF_TZ_KEY];

      draft[DISP_MODE_KEY] = card.querySelector('input[name="tz-mode"]:checked')?.value || 'relative';
      draft[CLOCK_FMT_KEY] = card.querySelector('input[name="tz-clock"]:checked')?.value || '24';
      draft[SHOW_TIME_KEY] = $('#tz-show-time')?.checked !== false;
      draft[SHOW_TZ_LABEL_KEY] = $('#tz-show-tzlabel')?.checked !== false;
      draft[TZ_FONT_SIZE_KEY] = (parseInt($('#tz-font-size-slider').value) / 100).toString();
      draft[TZ_FONT_WEIGHT_KEY] = card.querySelector('input[name="tz-font-weight"]:checked')?.value || '400';
      draft[TZ_FONT_STYLE_KEY] = card.querySelector('input[name="tz-font-style"]:checked')?.value || 'italic';
      draft[TZ_COLOR_KEY] = $('#tz-color-picker').value || '#888888';

      persist();
      setDirty(false);
      toast('Changes saved');
      updateExistingTimezoneDisplays();
      updateExistingTimezoneStyles();
      decorateMessageAuthors(document);
    }

    function discardAll(){
      draft = JSON.parse(JSON.stringify(stored));
      myTzEl.value = draft[SELF_TZ_KEY] || '';
      updateTimezoneInputValidation(myTzEl);
      setRadioGroupState(card, 'tz-mode', draft[DISP_MODE_KEY] || 'relative');
      setRadioGroupState(card, 'tz-clock', draft[CLOCK_FMT_KEY] || '24');
      const fontSizePercent = Math.round((parseFloat(draft[TZ_FONT_SIZE_KEY] || '0.85') * 100));
      $('#tz-font-size-slider').value = fontSizePercent;
      $('#tz-font-size-value').textContent = `${fontSizePercent}%`;
      setRadioGroupState(card, 'tz-font-weight', draft[TZ_FONT_WEIGHT_KEY] || '400');
      setRadioGroupState(card, 'tz-font-style', draft[TZ_FONT_STYLE_KEY] || 'italic');
      $('#tz-color-picker').value = draft[TZ_COLOR_KEY] || '#888888';
      $('#tz-show-time').checked = draft[SHOW_TIME_KEY] !== false;
      $('#tz-show-tzlabel').checked = draft[SHOW_TZ_LABEL_KEY] !== false;
      render();
      setDirty(false);
      toast('Reverted to saved data');
    }

    const collapseEl = $('#tz-collapse');
    const collapseBtn = $('#tz-collapse-toggle');
    function setCollapsed(collapsed){
      collapseEl.setAttribute('data-open', collapsed ? 'false' : 'true');
      collapseBtn.textContent = collapsed ? 'Show options' : 'Hide options';
      ui.optsCollapsed = collapsed;
      persistUI();
    }

    const clearFieldsHandler = () => {
      idEl.value = nameEl.value = tzEl.value = '';
      idEl.focus();
    };

    const idFocusHandler = () => {
      idEl.value = nameEl.value = tzEl.value = '';
    };

    const collapseHandler = () => setCollapsed(collapseEl.getAttribute('data-open') === 'true');

    const tabClickHandler = (e) => {
      const tab = e.target.closest('.tz-tab');
      if (!tab) return;

      const targetTab = tab.dataset.tab;
      qsa('.tz-tab', card).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      qsa('.tz-tab-content', card).forEach(content => content.classList.remove('active'));
      $(`#tab-${targetTab}`).classList.add('active');
    };

    const fontSlider = $('#tz-font-size-slider');
    const fontValue = $('#tz-font-size-value');
    const sliderHandler = () => {
      const value = fontSlider.value;
      fontValue.textContent = `${value}%`;
      setDirty(true);
    };

    const fireOnEnter = (e) => {
      if(e.key==='Enter'){
        e.preventDefault();
        addOrUpdate();
      }
    };

    const exportKeyHandler = (e) => {
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='e'){
        e.preventDefault();
        exportJSON();
      }
    };

    const importHandler = (e) => {
      const f = e.target.files?.[0];
      if (f) {
        importJSON(f);
        e.target.value = '';
      }
    };

    const guessHandler = () => {
      try{
        const iana = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        myTzEl.value = iana;
        updateTimezoneInputValidation(myTzEl);
        setDirty(true);
        toast(`Guessed: ${iana}`);
      }catch{
        myTzEl.value = 'UTC';
        updateTimezoneInputValidation(myTzEl);
        setDirty(true);
        toast('Guessed: UTC');
      }
    };

    const myTzInputHandler = () => {
      updateTimezoneInputValidation(myTzEl);
      setDirty(true);
    };

    const tzInputHandler = () => {
      updateTimezoneInputValidation(tzEl);
    };

    const tzFocusHandler = () => {};

    const inputHandler = (e) => {
      const t = e.target;
      if(!(t instanceof HTMLInputElement)) return;

      if (t.id === 'tz-show-time' || t.id === 'tz-show-tzlabel' ||
          t.id === 'tz-color-picker' || t.id === 'tz-font-size-slider' ||
          t.name==='tz-mode' || t.name==='tz-clock' || t.name==='tz-font-weight' || t.name==='tz-font-style'){
        setDirty(true);
        return;
      }

      const tr = t.closest('tr');
      if(!tr) return;
      const xid = tr.getAttribute('data-xid');
      if(!xid) return;
      const k = t.getAttribute('data-k');
      if(k==='tz') draft[xid]=t.value;
      if(k==='name'){
        if(t.value) draft[nameKey(xid)]=t.value;
        else delete draft[nameKey(xid)];
      }
      if(k==='note'){
        if(t.value) draft[noteKey(xid)]=t.value;
        else delete draft[noteKey(xid)];
      }
      setDirty(true);
    };

    const clickHandler = (e) => {
      const del = e.target.closest('[data-act="del"]');
      if(del){
        const tr = del.closest('tr');
        const xid = tr.getAttribute('data-xid');
        if(confirm(`Delete mapping for XID ${xid}?`)){
          delete draft[xid];
          delete draft[nameKey(xid)];
          delete draft[noteKey(xid)];
          render();
          setDirty(true);
        }
        return;
      }
      const th = e.target.closest('thead th[role="columnheader"][data-key]');
      if(th){
        const key = th.dataset.key;
        if(ui.sortKey===key) ui.sortDir = ui.sortDir==='asc' ? 'desc' : 'asc';
        else { ui.sortKey = key; ui.sortDir = 'asc'; }
        persistUI();
        render();
      }
    };

    const searchEl = $('#tz-search');
    const searchHandler = debounce(() => {
      ui.search = searchEl.value;
      persistUI();
      render();
    }, DEBOUNCE_SEARCH);

    const clearSearchHandler = () => {
      searchEl.value='';
      ui.search='';
      persistUI();
      render();
      searchEl.focus();
    };

    function maybeAutofillFromId(){
      const {name,xid} = extractNameAndXID(idEl.value);
      if(xid && idEl.value.trim()!==xid) idEl.value=xid;
      if(name && nameEl.value.trim()==='') nameEl.value=name;
    }
    const idInputHandler = maybeAutofillFromId;
    const idPasteHandler = () => setTimeout(maybeAutofillFromId,0);

    const remove = () => {
      clearTimeout(searchTimer);
      eventListeners.forEach(({el, event, handler}) => el.removeEventListener(event, handler));
      document.documentElement.style.overflow='';
      modal.remove();
    };

    const modalClickHandler = (e) => { if(e.target===modal) remove(); };
    const closeHandler = () => remove();
    const escapeHandler = (e) => { if(e.key==='Escape') remove(); };

    const addListener = (el, event, handler) => {
      if (el) {
        el.addEventListener(event, handler);
        eventListeners.push({el, event, handler});
      }
    };

    addListener($('#tz-clear-fields'), 'click', clearFieldsHandler);
    addListener(idEl, 'focus', idFocusHandler);
    addListener(collapseBtn, 'click', collapseHandler);
    addListener(card, 'click', tabClickHandler);
    addListener(fontSlider, 'input', sliderHandler);
    addListener($('#tz-add-btn'), 'click', addOrUpdate);
    addListener(idEl, 'keydown', fireOnEnter);
    addListener(tzEl, 'keydown', fireOnEnter);
    addListener($('#tz-export'), 'click', exportJSON);
    addListener(card, 'keydown', exportKeyHandler);
    addListener($('#tz-import-file'), 'change', importHandler);
    addListener($('#tz-delete-all'), 'click', deleteAll);
    addListener($('#tz-save'), 'click', saveAll);
    addListener($('#tz-discard'), 'click', discardAll);
    addListener($('#tz-my-guess'), 'click', guessHandler);
    addListener($('#tz-show-help'), 'click', showTimezoneHelpModal);
    addListener(myTzEl, 'input', myTzInputHandler);
    addListener(card, 'input', inputHandler);
    addListener(card, 'click', clickHandler);
    addListener(searchEl, 'input', searchHandler);
    addListener($('#tz-clear'), 'click', clearSearchHandler);
    addListener(tzEl, 'input', tzInputHandler);
    addListener(tzEl, 'focus', tzFocusHandler);
    addListener(idEl, 'input', idInputHandler);
    addListener(idEl, 'paste', idPasteHandler);
    addListener(modal, 'click', modalClickHandler);
    addListener(card.querySelector('.tz-x'), 'click', closeHandler);
    addListener(modal, 'keydown', escapeHandler);

    document.documentElement.style.overflow='hidden';
    document.body.appendChild(modal);
    render();
    updateTimezoneInputValidation(myTzEl);
    updateTimezoneInputValidation(tzEl);
    setDirty(false);
  }

  // ============================================================================
  // SETTINGS PANEL INTEGRATION
  // ============================================================================

  function mountSettingsPanelButton(){
    const panel = document.getElementById('settings_panel');
    if(!panel || panel.querySelector('#tz-block')) return;

    let anchorBlock = null;
    panel.querySelectorAll('span').forEach(span=>{
      if((span.textContent||'').trim().startsWith('Rejoin official chat rooms')){
        let cur = span.parentElement;
        while(cur&&cur!==panel){
          if([...cur.classList].some(c=>c.startsWith('root___'))){
            anchorBlock = cur;
            break;
          }
          cur = cur.parentElement;
        }
      }
    });
    if(!anchorBlock) return;

    const sampleBtn = anchorBlock.querySelector('button');
    const sampleClass = sampleBtn?.className||'';
    const sampleLabel = sampleBtn?.querySelector('span')?.className||'';

    const divider = document.createElement('div');
    divider.style.cssText='height:1px;width:100%;background:rgba(255,255,255,0.15);margin:10px 0;border-radius:1px;';
    anchorBlock.insertAdjacentElement('afterend', divider);

    const block = document.createElement('div');
    block.id='tz-block';
    block.style.cssText='margin:5px 0 0 0;';
    const header = document.createElement('div');
    header.textContent='Script settings';
    header.style.cssText='font-weight:bold;color:#ccc;margin-bottom:6px;font-size:13px;';
    block.appendChild(header);

    const btn = document.createElement('button');
    btn.type='button';
    btn.className=sampleClass.trim();
    btn.style.cssText+='display:inline-flex !important;width:auto !important;min-width:0;align-items:center;justify-content:center;margin:0;';
    const label = document.createElement('span');
    label.className=sampleLabel;
    label.textContent='Timezones';
    btn.appendChild(label);
    btn.addEventListener('click', openTZSettings);
    block.appendChild(btn);
    divider.insertAdjacentElement('afterend', block);
  }

  // ============================================================================
  // INITIALIZATION WITH SMART RETRY LOGIC
  // ============================================================================

  function initTimezoneUI(){
    mountSettingsPanelButton();
    const mo = new MutationObserver(() => mountSettingsPanelButton());
    mo.observe(document.body, {childList: true, subtree: true});
  }

  function initialDecoration() {
    try {
      const containers = qsa(CHAT_CONTAINER_SELECTOR);
      if (containers.length > 0) {
        decorateMessageAuthors(document);
        observeChatContainers();
      }
    } catch (e) {
      console.error('[TZ] initialDecoration failed:', e);
    }
  }

  function decorateWithRetry(attempt = 0) {
    try {
      const containers = qsa(CHAT_CONTAINER_SELECTOR);

      if (containers.length > 0) {
        decorateMessageAuthors(document);
        observeChatContainers();
        return;
      }

      if (attempt === 0) {
        setTimeout(() => decorateWithRetry(1), 200);
      }
    } catch (e) {
      console.error('[TZ] decorateWithRetry failed:', e);
    }
  }

  let visibilityTimeout = null;
  document.addEventListener('visibilitychange', () => {
    try {
      if (!document.hidden) {
        clearTimeout(visibilityTimeout);
        visibilityTimeout = setTimeout(() => {
          const containers = qsa(CHAT_CONTAINER_SELECTOR);
          if (containers.length > 0) {
            decorateMessageAuthors(document);
            observeChatContainers();
          }
        }, 300);
      }
    } catch (e) {
      console.error('[TZ] visibilitychange handler failed:', e);
    }
  });

  let lastUrl = location.href;
  let urlChangeTimeout = null;
  const urlObserver = new MutationObserver(() => {
    try {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        clearTimeout(urlChangeTimeout);
        urlChangeTimeout = setTimeout(() => {
          initialDecoration();
        }, 300);
      }
    } catch (e) {
      console.error('[TZ] URL change handler failed:', e);
    }
  });

  const titleEl = document.querySelector('title');
  if (titleEl) {
    urlObserver.observe(titleEl, { childList: true, characterData: true });
  }

  function initialize() {
    try {
      initTimezoneUI();
      initialDecoration();

      if (qsa(CHAT_CONTAINER_SELECTOR).length === 0) {
        setTimeout(() => {
          try {
            const containers = qsa(CHAT_CONTAINER_SELECTOR);
            if (containers.length > 0) {
              decorateMessageAuthors(document);
              observeChatContainers();
            }
          } catch (e) {
            console.error('[TZ] Delayed decoration failed:', e);
          }
        }, 500);
      }
    } catch (e) {
      console.error('[TZ] Initialization failed:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();