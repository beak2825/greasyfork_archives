// ==UserScript==
// @name         Beautiful Scrollbar
// @namespace    http://github.com/quantavil/beautiful-scrollbar
// @version      5.6.4
// @description  Fast custom scrollbar with multi-container support, minimal dark settings UI, animated themes, hover-only option, idle thin indicator with delay, and instant quick-jump keys. ESC for settings. 1=top, 0=bottom, 2–9=% instant jump. Optional quick smooth scroll for bar clicks (keys stay instant).
// @author       quantavil
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/551683/Beautiful%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/551683/Beautiful%20Scrollbar.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // -------------------------------
  // Config + Themes
  // -------------------------------
  const MIN_THUMB = 30, RATIO = 0.95, Z = 9999999;
  const IDLE_DELAY = 1000; // ms — wait before collapsing to thin indicator

  // New fields per theme:
  // - anim    -> CSS animation shorthand (e.g., "bs-barber 2.2s linear infinite")
  // - bgSize  -> background-size for the thumb
  const THEMES = {
    none:   { name:'⚪ None',       track:'rgba(0,0,0,0.03)', thumb:'rgba(100,100,100,0.3)', hover:'rgba(100,100,100,0.45)', w:8,  radius:0,  glow:'none' },
    modern: { name:'✨ Modern',     track:'rgba(0,0,0,0.08)', thumb:'linear-gradient(135deg,#667eea,#764ba2)', hover:'linear-gradient(135deg,#764ba2,#667eea)', w:10, radius:10, glow:'0 2px 10px rgba(0,0,0,.25)' },
    neon:   { name:'🌟 Neon Glow',  track:'rgba(0,0,0,0.15)', thumb:'linear-gradient(180deg,#00f5ff,#0ea5e9)', hover:'linear-gradient(180deg,#22d3ee,#06b6d4)', w:9,  radius:8,  glow:'0 0 12px rgba(6,182,212,.6)' },
    ocean:  { name:'🌊 Ocean',      track:'rgba(15,23,42,0.2)', thumb:'linear-gradient(180deg,#0ea5e9,#0369a1)', hover:'linear-gradient(180deg,#38bdf8,#0ea5e9)', w:10, radius:10, glow:'0 2px 8px rgba(14,165,233,.25)' },
    sunset: { name:'🌅 Sunset',     track:'rgba(30,15,10,0.15)', thumb:'linear-gradient(180deg,#f59e0b,#dc2626)', hover:'linear-gradient(180deg,#fbbf24,#f97316)', w:10, radius:10, glow:'0 2px 8px rgba(251,191,36,.25)' },
    forest: { name:'🌲 Forest',     track:'rgba(10,20,10,0.15)', thumb:'linear-gradient(180deg,#10b981,#059669)', hover:'linear-gradient(180deg,#34d399,#10b981)', w:10, radius:10, glow:'0 2px 8px rgba(16,185,129,.25)' },
    candy:  { name:'🍬 Candy',      track:'rgba(25,10,25,0.15)', thumb:'linear-gradient(135deg,#ec4899,#a855f7)', hover:'linear-gradient(135deg,#f472b6,#c084fc)', w:10, radius:10, glow:'0 2px 8px rgba(236,72,153,.25)' },
    dark:   { name:'🌑 Dark',       track:'rgba(0,0,0,0.28)', thumb:'#556', hover:'#788', w:8, radius:8, glow:'0 2px 8px rgba(0,0,0,.35)' },
    gold:   { name:'✨ Gold',       track:'rgba(30,25,15,0.15)', thumb:'linear-gradient(135deg,#fbbf24,#d97706)', hover:'linear-gradient(135deg,#fcd34d,#fbbf24)', w:10, radius:10, glow:'0 0 10px rgba(251,191,36,.35)' },
    cyber:  { name:'🤖 Cyber',      track:'rgba(0,0,0,0.3)', thumb:'linear-gradient(180deg,#a78bfa,#7c3aed)', hover:'linear-gradient(180deg,#c4b5fd,#a78bfa)', w:9, radius:8, glow:'0 0 10px rgba(139,92,246,.4)' },
    ruby:   { name:'💎 Ruby',       track:'rgba(20,10,15,0.15)', thumb:'linear-gradient(135deg,#dc2626,#991b1b)', hover:'linear-gradient(135deg,#ef4444,#dc2626)', w:10, radius:10, glow:'0 0 8px rgba(220,38,38,.3)' },
    slate:  { name:'🪨 Slate',      track:'rgba(2,6,23,.16)', thumb:'linear-gradient(180deg,#64748b,#334155)', hover:'linear-gradient(180deg,#94a3b8,#64748b)', w:9, radius:10, glow:'0 2px 10px rgba(2,6,23,.35)' },

    // Animated themes
    rainbow: {
      name:'🌈 Rainbow Flow',
      track:'rgba(0,0,0,0.14)',
      thumb:'linear-gradient(90deg,#ff0080,#ff8c00,#ffd700,#00ff6a,#00cfff,#8a2be2,#ff0080)',
      hover:'linear-gradient(90deg,#ff4da6,#ffa64d,#ffe066,#4dff9a,#66e0ff,#b48cff,#ff4da6)',
      w:10, radius:10, glow:'0 0 12px rgba(255,255,255,.18)',
      bgSize:'400% 100%',
      anim:'bs-rainbow 8s linear infinite'
    },
    glint: {
      name:'✨ Shimmer Glint',
      track:'rgba(0,0,0,0.18)',
      thumb:'linear-gradient(120deg, rgba(255,255,255,.0) 30%, rgba(255,255,255,.45) 50%, rgba(255,255,255,.0) 70%), linear-gradient(180deg,#64748b,#334155)',
      hover:'linear-gradient(120deg, rgba(255,255,255,.0) 30%, rgba(255,255,255,.65) 50%, rgba(255,255,255,.0) 70%), linear-gradient(180deg,#94a3b8,#475569)',
      w:10, radius:10, glow:'0 2px 10px rgba(148,163,184,.25)',
      bgSize:'200% 100%, 100% 100%',
      anim:'bs-glint 2.6s linear infinite'
    },
    holo: {
      name:'🫧 Holo Wave',
      track:'rgba(0,0,0,0.16)',
      thumb:'linear-gradient(120deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)',
      hover:'linear-gradient(120deg, #67e8f9, #c4b5fd, #f9a8d4, #67e8f9)',
      w:10, radius:10, glow:'0 0 14px rgba(99,102,241,.25)',
      bgSize:'200% 200%',
      anim:'bs-pan 6s ease-in-out infinite'
    },
    water: {
      name:'💧 Water Filling',
      track:'rgba(2,6,23,.20)',
      thumb:'radial-gradient(circle at 24px 10px, rgba(255,255,255,.26) 11%, rgba(255,255,255,0) 12%), radial-gradient(circle at 6px 14px, rgba(255,255,255,.18) 9%, rgba(255,255,255,0) 10%), linear-gradient(180deg,#7dd3fc,#38bdf8 55%,#0ea5e9)',
      hover:'radial-gradient(circle at 24px 10px, rgba(255,255,255,.36) 11%, rgba(255,255,255,0) 12%), radial-gradient(circle at 6px 14px, rgba(255,255,255,.28) 9%, rgba(255,255,255,0) 10%), linear-gradient(180deg,#a5e6ff,#7dd3fc 55%,#38bdf8)',
      w:10, radius:10, glow:'0 2px 10px rgba(56,189,248,.28)',
      bgSize:'48px 18px, 64px 20px, 100% 100%',
      anim:'bs-water 4s linear infinite'
    }
  };

  // -------------------------------
  // Utils
  // -------------------------------
  const $root = () => document.scrollingElement || document.documentElement;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const toBool = (v) => v === true || v === 1 || v === '1' || v === 'true';

  const Store = {
    get(k, d) { try { if (typeof GM_getValue === 'function') return GM_getValue(k, d); } catch(_){} try { const v = localStorage.getItem(k); return v !== null ? v : d; } catch(_){ return d; } },
    set(k, v) { try { if (typeof GM_setValue === 'function') { GM_setValue(k, v); return; } } catch(_){} try { localStorage.setItem(k, v); } catch(_){} }
  };

  const addCSS = (css) => {
    try { if (typeof GM_addStyle === 'function') return GM_addStyle(css); } catch(_){}
    const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  };

  const isEditable = (el) => {
    const t = el?.tagName; return el?.isContentEditable || t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT';
  };

  const isScrollable = (el) => {
    if (!el || !el.nodeType) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    return /auto|scroll|overlay/.test((cs.overflowY || cs.overflow || '').toLowerCase())
           && el.scrollHeight > el.clientHeight + 1;
  };

  const findScrollable = (t) => {
    if (!t) return $root();
    if (t.closest('.bs-bar, .bs-ui')) return null;
    for (let el = t; el && el !== document.documentElement; el = el.parentElement) {
      if (el === document.body) return $root();
      if (isScrollable(el)) return el;
    }
    return $root();
  };

  const getDigit = (e) => {
    const k = e.key; if (k?.length === 1 && k >= '0' && k <= '9') return k;
    const c = e.code || ''; if (/^Digit[0-9]$/.test(c)) return c.slice(5);
    if (/^Numpad[0-9]$/.test(c)) return c.slice(6);
    return null;
  };

  // -------------------------------
  // Theme handling
  // -------------------------------
  let CUR_THEME = Store.get('bs-theme', 'modern');
  const setTheme = (name) => {
    if (!THEMES[name]) name = 'modern';
    CUR_THEME = name; Store.set('bs-theme', name);
    const t = THEMES[name], r = document.documentElement.style;
    r.setProperty('--bs-track', t.track);
    r.setProperty('--bs-thumb', t.thumb);
    r.setProperty('--bs-thumb-hover', t.hover || t.thumb);
    r.setProperty('--bs-radius', (t.radius ?? 8) + 'px');
    r.setProperty('--bs-width', (t.w ?? 10) + 'px');
    r.setProperty('--bs-glow', t.glow || 'none');
    r.setProperty('--bs-thumb-anim', t.anim || 'none');
    r.setProperty('--bs-thumb-bg-size', t.bgSize || 'auto');
  };

  // -------------------------------
  // Scrollbar Instance
  // -------------------------------
  class SB {
    constructor(container) {
      this.c = container;
      this.r = container === $root();
      this.el = document.createElement('div');
      this.el.className = 'bs-bar';
      this.thumb = document.createElement('div');
      this.thumb.className = 'bs-thumb';
      this.el.appendChild(this.thumb);
      document.body.appendChild(this.el);
      this.raf = 0;
      this._anim = 0;
      this._idleTO = 0;
      this.isHover = false;
      if (!this.r && this.c && this.c.classList) this.c.classList.add('bs-hide-v');

      this.onScroll = () => {
        this.req();
        this.awake();
        this.scheduleIdle();
      };

      this.bind();
      this.update();
      this.scheduleIdle(); // start collapsed after a delay if untouched
    }

    _setScroll(v) {
      (this.r ? $root() : this.c).scrollTop = v;
    }
    cancelSmooth() {
      if (this._anim) cancelAnimationFrame(this._anim);
      this._anim = 0;
    }
    to(y) { // instant
      this.cancelSmooth();
      const m = this.m(), v = clamp(y, 0, m.max);
      this._setScroll(v);
    }
    smoothTo(y, dur = 180) {
      this.cancelSmooth();
      const m = this.m(), start = m.scroll, end = clamp(y, 0, m.max);
      if (Math.abs(end - start) < 2) { this.to(end); return; }
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic
      const step = (now) => {
        const t = clamp((now - t0) / dur, 0, 1);
        this._setScroll(start + (end - start) * ease(t));
        if (t < 1) this._anim = requestAnimationFrame(step);
        else this._anim = 0;
      };
      this._anim = requestAnimationFrame(step);
    }
    go(y) { // obey smooth toggle for bar actions
      if (SMOOTH_BAR) this.smoothTo(y);
      else this.to(y);
    }

    // Idle/Active state
    awake() {
      clearTimeout(this._idleTO);
      this._idleTO = 0;
      this.el.classList.remove('idle');
    }
    scheduleIdle() {
      if (!this.el) return;
      if (this.isHover || this.el.classList.contains('drag')) return;
      clearTimeout(this._idleTO);
      this._idleTO = setTimeout(() => {
        if (this.el && !this.isHover && !this.el.classList.contains('drag')) {
          this.el.classList.add('idle');
        }
      }, IDLE_DELAY);
    }

    bind() {
      // Track click -> jump
      this.el.addEventListener('click', (e) => {
        if (e.target !== this.el) return;
        // any click is activity
        this.awake();
        this.scheduleIdle();

        const rect = this.el.getBoundingClientRect();
        const th = this.thumb.offsetHeight, space = rect.height - th;
        if (space <= 0) return;
        const p = clamp((e.clientY - rect.top - th / 2) / space, 0, 1);
        const m = this.m(); this.go(m.max * p);
      });

      // Touch tap on track -> jump
      this.el.addEventListener('touchstart', (e) => {
        if (e.target !== this.el) return;
        const t = e.touches && e.touches[0]; if (!t) return;
        this.awake();
        this.scheduleIdle();
        const rect = this.el.getBoundingClientRect();
        const th = this.thumb.offsetHeight, space = rect.height - th; if (space <= 0) return;
        const p = clamp((t.clientY - rect.top - th / 2) / space, 0, 1);
        const m = this.m(); this.go(m.max * p);
      }, { passive: true });

      // Hover state for idle logic
      this.el.addEventListener('mouseenter', () => { this.isHover = true; this.awake(); });
      this.el.addEventListener('mouseleave', () => { this.isHover = false; this.scheduleIdle(); });

      // Drag thumb (always direct)
      this.thumb.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; e.preventDefault();
        const startY = e.clientY, start = this.m().scroll;
        this.el.classList.add('drag');
        this.awake(); // expand immediately
        this.cancelSmooth();
        const mm = (ev) => {
          ev.preventDefault();
          const m = this.m(), rect = this.el.getBoundingClientRect();
          const th = this.thumb.offsetHeight, space = rect.height - th; if (space <= 0) return;
          this.to(start + ((ev.clientY - startY) / space) * m.max);
        };
        const mu = () => {
          this.el.classList.remove('drag');
          document.removeEventListener('mousemove', mm);
          document.removeEventListener('mouseup', mu);
          this.scheduleIdle(); // collapse after delay when drag ends
        };
        document.addEventListener('mousemove', mm);
        document.addEventListener('mouseup', mu);
      });

      // Touch drag on thumb
      this.thumb.addEventListener('touchstart', (e) => {
        const t = e.touches && e.touches[0]; if (!t) return;
        const startY = t.clientY, start = this.m().scroll;
        this.el.classList.add('drag');
        this.awake();
        this.cancelSmooth();
        const mm = (ev) => {
          const tt = ev.touches && ev.touches[0]; if (!tt) return;
          const m = this.m(), rect = this.el.getBoundingClientRect();
          const th = this.thumb.offsetHeight, space = rect.height - th; if (space <= 0) return;
          this.to(start + ((tt.clientY - startY) / space) * m.max);
          ev.preventDefault();
        };
        const mu = () => {
          this.el.classList.remove('drag');
          document.removeEventListener('touchmove', mm);
          document.removeEventListener('touchend', mu);
          document.removeEventListener('touchcancel', mu);
          this.scheduleIdle();
        };
        document.addEventListener('touchmove', mm, { passive: false });
        document.addEventListener('touchend', mu);
        document.addEventListener('touchcancel', mu);
      });

      (this.r ? window : this.c).addEventListener('scroll', this.onScroll, { passive: true });
    }

    m() {
      if (this.r) {
        const rootEl = $root();
        const scroll = window.pageYOffset || rootEl.scrollTop;
        const vh = window.innerHeight;
        const sh = Math.max(rootEl.scrollHeight || 0, document.body?.scrollHeight || 0, vh);
        return { scroll, vh, sh, max: Math.max(0, sh - vh) };
      }
      const scroll = this.c.scrollTop, vh = this.c.clientHeight, sh = this.c.scrollHeight;
      return { scroll, vh, sh, max: Math.max(0, sh - vh) };
    }

    update() {
      if (!this.el) return;
      const m = this.m();
      let vis = m.max > 0 ? 1 : 0;
      let top = 0, h = window.innerHeight, right = 0;

      if (!this.r) {
        const rect = this.c.getBoundingClientRect();
        if (rect.height <= 0 || rect.bottom <= 0 || rect.top >= window.innerHeight) vis = 0;
        else {
          top = Math.max(0, rect.top);
          h = Math.min(rect.bottom, window.innerHeight) - top;
          right = Math.max(0, window.innerWidth - rect.right);
        }
      }

      this.el.style.opacity = String(vis);
      this.el.style.pointerEvents = vis ? 'auto' : 'none';
      this.el.style.top = top + 'px';
      this.el.style.height = h + 'px';
      this.el.style.right = right + 'px';
      if (!vis) return;

      const barH = this.el.offsetHeight || h;
      const th = Math.max(MIN_THUMB, Math.min(barH * RATIO, barH * (m.vh / Math.max(m.sh, 1))));
      const p = m.max ? (m.scroll / m.max) : 0;
      const y = (barH - th) * p;
      this.thumb.style.height = Math.round(th) + 'px';
      this.thumb.style.transform = `translateY(${Math.round(y)}px)`;
    }

    req() { cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(() => this.update()); }

    destroy() {
      this.cancelSmooth();
      clearTimeout(this._idleTO);
      cancelAnimationFrame(this.raf);
      (this.r ? window : this.c).removeEventListener('scroll', this.onScroll);
      this.el?.remove();
      if (!this.r && this.c && this.c.classList) this.c.classList.remove('bs-hide-v');
      this.el = this.thumb = this.c = null;
    }
  }

  // -------------------------------
  // Manager (tracks active container)
  // -------------------------------
  class Manager {
    constructor() {
      this.map = new Map();
      this.rootInst = this.get($root());
      this.active = this.rootInst;
      this.bind();
      this.observe();
    }
    get(c) { if (!this.map.has(c)) this.map.set(c, new SB(c)); return this.map.get(c); }
    setActiveFrom(evtOrTarget) {
      const target = evtOrTarget?.target || evtOrTarget;
      if (target?.closest?.('.bs-bar, .bs-ui')) return;
      let path = evtOrTarget?.composedPath?.();
      if (Array.isArray(path) && path.length) {
        for (const el of path) {
          if (!el || !el.nodeType || el === document || el === window) continue;
          if (typeof el.closest === 'function' && el.closest('.bs-bar, .bs-ui')) continue;
          if (isScrollable(el)) { this.active = this.get(el); return; }
          const rn = el.getRootNode?.();
          if (rn && rn.host && isScrollable(rn.host)) { this.active = this.get(rn.host); return; }
        }
      }
      const c = findScrollable(target);
      if (c) this.active = this.get(c);
    }
    bind() {
      const onEvt = (e) => this.setActiveFrom(e);
      document.addEventListener('mouseover', onEvt);
      document.addEventListener('wheel', onEvt, { passive: true });
      document.addEventListener('focusin', onEvt);
      window.addEventListener('resize', () => this.updateAll(), { passive: true });
    }
    updateAll() { this.map.forEach(i => i.req()); }
    clean() {
      this.map.forEach((inst, el) => {
        if (el !== $root() && !el?.isConnected) { inst.destroy(); this.map.delete(el); }
      });
    }
    observe() {
      this._moScheduled = false;
      const schedule = () => {
        if (this._moScheduled) return;
        this._moScheduled = true;
        requestAnimationFrame(() => { this._moScheduled = false; this.clean(); this.updateAll(); });
      };
      const mo = new MutationObserver(schedule);
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  // -------------------------------
  // Settings UI (themes + smooth)
  // -------------------------------
  let UI = null, UI_OPEN = false, MGR = null;
  let SMOOTH_BAR = toBool(Store.get('bs-smooth-bar', '0')); // off by default
  let KEYS_SHIFT = toBool(Store.get('bs-keys-shift', '1'));

  const setSmoothBar = (on) => {
    SMOOTH_BAR = !!on;
    Store.set('bs-smooth-bar', SMOOTH_BAR ? '1' : '0');
  };

  const buildUI = () => {
    if (UI) return;
    const cards = Object.entries(THEMES).map(([k, v]) => {
      const extra = [
        v.bgSize ? `background-size:${v.bgSize};` : '',
        v.anim ? `animation:${v.anim};` : ''
      ].join('');
      return `
        <button class="bs-card ${k === CUR_THEME ? 'on' : ''}" data-k="${k}" aria-label="${v.name}">
          <span class="bs-prev">
            <i style="background:${v.track}"></i>
            <b style="background:${v.thumb}; ${extra} box-shadow:${v.glow || 'none'}"></b>
          </span>
          <span class="bs-name">${v.name}</span>
        </button>
      `;
    }).join('');
    UI = document.createElement('div');
    UI.className = 'bs-ui bs-ov';
    UI.innerHTML = `
      <div class="bs-panel" role="dialog" aria-label="Scrollbar Settings" aria-modal="true">
        <div class="bs-top">
          <div class="bs-title">Scrollbar</div>
          <button class="bs-close" aria-label="Close">✕</button>
        </div>

        <div class="bs-subtitle">Themes</div>
        <div class="bs-grid" role="list">${cards}</div>

        <div class="bs-subtitle">Behavior</div>
        <div class="bs-row">
          <div class="bs-row-label">Quick smooth scroll (bar only)</div>
          <button class="bs-switch ${SMOOTH_BAR ? 'on' : ''}" data-k="smooth" role="switch" aria-checked="${SMOOTH_BAR}" aria-label="Quick smooth scroll (bar only)"><i></i></button>
        </div>
        <div class="bs-row">
          <div class="bs-row-label">Require Shift for number jumps</div>
          <button class="bs-switch ${KEYS_SHIFT ? 'on' : ''}" data-k="keys" role="switch" aria-checked="${KEYS_SHIFT}" aria-label="Require Shift for number jumps"><i></i></button>
        </div>

        <div class="bs-meta"><kbd>1</kbd> top • <kbd>0</kbd> bottom • <kbd>2–9</kbd> jump %</div>
      </div>
    `;
    UI.addEventListener('click', (e) => {
      if (e.target.classList.contains('bs-ov')) closeUI();
      if (e.target.classList.contains('bs-close')) closeUI();

      const btn = e.target.closest('.bs-card');
      if (btn) {
        setTheme(btn.dataset.k);
        UI.querySelectorAll('.bs-card').forEach(b => b.classList.toggle('on', b === btn));
        MGR?.updateAll();
        return;
      }

      const sw = e.target.closest('.bs-switch');
      if (sw) {
        const on = !sw.classList.contains('on');
        const which = sw.dataset.k;
        if (which === 'smooth') setSmoothBar(on);
        if (which === 'keys') { KEYS_SHIFT = !!on; Store.set('bs-keys-shift', KEYS_SHIFT ? '1' : '0'); }
        sw.classList.toggle('on', on);
        sw.setAttribute('aria-checked', String(on));
      }
    });
    UI.addEventListener('keydown', (e) => {
      const btn = e.target.closest?.('.bs-card');
      if (btn && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); btn.click(); }
      const sw = e.target.closest?.('.bs-switch');
      if (sw && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); sw.click(); }
      if (e.key === 'Escape') closeUI();
    });
    document.body.appendChild(UI);
  };

  const openUI = () => { buildUI(); UI.classList.add('show'); UI_OPEN = true; setTimeout(() => UI.querySelector('.bs-card.on')?.focus(), 50); };
  const closeUI = () => { UI?.classList.remove('show'); UI_OPEN = false; };

  // -------------------------------
  // Styles (idle thin indicator; cleanup redundant rules)
  // -------------------------------
  const injectStyles = () => addCSS(`
    :root{
      --bs-track: rgba(0,0,0,.08);
      --bs-thumb: #889;
      --bs-thumb-hover: #aab;
      --bs-radius: 10px;
      --bs-width: 10px;
      --bs-glow: none;
      --bs-red: #ef4444;
      --bs-red-strong: #dc2626;
      --bs-thumb-anim: none;
      --bs-thumb-bg-size: auto;

      /* Idle indicator tuning */
      --bs-indicator-width: 3px;  /* collapsed bar width */
      --bs-thin-thumb: 2px;       /* collapsed thumb visible line */
      --bs-idle-opacity: .6;      /* collapsed thumb opacity */
    }
    html::-webkit-scrollbar:vertical, body::-webkit-scrollbar:vertical, .bs-hide-v::-webkit-scrollbar:vertical { width:0!important; display:none!important; }
    html, body { scrollbar-width: none!important; -ms-overflow-style: none!important; }
    .bs-hide-v { scrollbar-width: none!important; -ms-overflow-style: none!important; }

    /* Custom bar */
    .bs-bar{
      position:fixed; right:0; top:0; width:var(--bs-width); height:100vh;
      background:var(--bs-track);
      border-radius:var(--bs-radius) 0 0 var(--bs-radius);
      z-index:${Z}; transition:opacity .2s,width .15s, background .15s;
      opacity:0; pointer-events:none;
    }
    .bs-bar:hover{ width:calc(var(--bs-width) + 3px); }
    .bs-thumb{
      position:absolute; left:0; right:0; top:0;
      min-height:${MIN_THUMB}px;
      background:var(--bs-thumb);
      background-size: var(--bs-thumb-bg-size, auto);
      border-radius:var(--bs-radius);
      box-shadow:var(--bs-glow);
      cursor:grab; will-change:transform;
      transition:background .15s, box-shadow .2s, opacity .15s;
      animation: var(--bs-thumb-anim, none);
      animation-play-state: running;
      touch-action: none;
    }
    .bs-bar:hover .bs-thumb{ background:var(--bs-thumb-hover); box-shadow:var(--bs-glow), 0 2px 8px rgba(0,0,0,.25); }
    .bs-bar.drag .bs-thumb{ cursor:grabbing; }

    /* Idle collapse to thin indicator */
    .bs-bar.idle{
      width: var(--bs-indicator-width);
      background: transparent;
    }
    .bs-bar.idle .bs-thumb{
      opacity: var(--bs-idle-opacity);
      box-shadow: none;
      background: var(--bs-thumb);
      clip-path: inset(0 calc(50% - (var(--bs-thin-thumb) / 2)) 0 calc(50% - (var(--bs-thin-thumb) / 2)));
      animation-play-state: paused;
    }

    

    /* Overlay */
    .bs-ov{ position:fixed; inset:0; display:none; align-items:center; justify-content:center; background:rgba(3,6,12,.72); backdrop-filter: blur(6px); z-index:${Z+10}; }
    .bs-ov.show{ display:flex; }

    /* Panel */
    .bs-panel{ width:min(92vw,680px); max-height:88vh; display:flex; flex-direction:column; background:rgba(10,14,22,.92); color:#e5e7eb; border:1px solid rgba(255,255,255,.06); border-radius:14px; box-shadow:0 18px 60px rgba(0,0,0,.6); overflow:hidden; font:13.5px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
    .bs-top{ display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01)); border-bottom:1px solid rgba(255,255,255,.06); }
    .bs-title{ font-weight:700; font-size:13.5px; color:#cbd5e1; letter-spacing:.2px; }
    .bs-close{ width:32px; height:32px; border-radius:9px; border:1px solid rgba(255,255,255,.12); background:rgba(255,255,255,.06); color:#e5e7eb; font-size:18px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
    .bs-close:hover{ border-color: var(--bs-red); background: rgba(239,68,68,.16); color:#fff; }
    .bs-close:active{ transform: scale(.95); background: rgba(239,68,68,.28); border-color: var(--bs-red-strong); color:#fff; }

    .bs-subtitle{ padding:10px 14px 6px; color:#9aa4b2; font-weight:700; text-transform:uppercase; letter-spacing:.06em; font-size:11.5px; }
    .bs-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(125px,1fr)); gap:10px; padding:12px; overflow:auto; max-height:42vh; }
    .bs-card{ appearance:none; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.04); border-radius:12px; padding:10px; cursor:pointer; text-align:center; color:#e5e7eb; transition:transform .12s, border-color .12s, background .12s, box-shadow .12s; outline:none; width:100%; }
    .bs-card:hover{ transform:translateY(-2px); border-color:rgba(99,102,241,.6); background:rgba(99,102,241,.12); box-shadow:0 6px 16px rgba(0,0,0,.35); }
    .bs-card.on{ border-color:#60a5fa; box-shadow:0 0 0 2px rgba(96,165,250,.16) inset, 0 10px 24px rgba(0,0,0,.35); background:rgba(96,165,250,.10); }
    .bs-prev{ position:relative; height:52px; border-radius:9px; background:#0b1220; margin-bottom:8px; overflow:hidden; box-shadow:inset 0 2px 8px rgba(0,0,0,.35); display:block; }
    .bs-prev i{ position:absolute; right:6px; top:6px; bottom:6px; width:8px; border-radius:4px; }
    .bs-prev b{ position:absolute; right:6px; top:12px; width:8px; height:20px; border-radius:4px; }

    .bs-row{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 14px; border-top:1px solid rgba(255,255,255,.06); }
    .bs-row-label{ color:#cbd5e1; font-weight:600; }
    .bs-switch{ position:relative; width:44px; height:24px; border-radius:999px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.18); cursor:pointer; transition:all .15s; outline:none; }
    .bs-switch i{ position:absolute; top:2px; left:2px; width:20px; height:20px; background:#e5e7eb; border-radius:999px; transition:all .15s; box-shadow:0 2px 6px rgba(0,0,0,.25); }
    .bs-switch.on{ background:rgba(96,165,250,.35); border-color:rgba(96,165,250,.5); }
    .bs-switch.on i{ transform:translateX(20px); background:#fff; }

    .bs-meta{ padding:10px 12px 12px; text-align:center; color:#94a3b8; font-size:12px; border-top:1px solid rgba(255,255,255,.06); }
    .bs-meta kbd{ background:rgba(148,163,184,.18); border:1px solid rgba(148,163,184,.28); padding:2px 6px; border-radius:6px; font:600 11px ui-monospace,monospace; color:#cbd5e1; }

    /* Scrollbar for the grid (override hide) */
    .bs-grid::-webkit-scrollbar{ width:8px!important; display:block!important; }
    .bs-grid::-webkit-scrollbar-thumb{ background:rgba(96,165,250,.35); border-radius:4px; }
    .bs-grid::-webkit-scrollbar-thumb:hover{ background:rgba(96,165,250,.6); }
    .bs-grid{ scrollbar-width:thin!important; }

    /* Keyframes for animated themes */
    @keyframes bs-rainbow { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
    @keyframes bs-glint { 0%{background-position:200% 0,0 0} 100%{background-position:-200% 0,0 0} }
    @keyframes bs-water { 0%{background-position:0 4px,0 0,0 0} 100%{background-position:96px 4px,72px 0,0 0} }
    @keyframes bs-pan { 0%{background-position:0% 0%} 50%{background-position:100% 100%} 100%{background-position:0% 0%} }

    @media (prefers-reduced-motion: reduce){
      .bs-thumb, .bs-prev b { animation: none!important; }
      .bs-bar, .bs-thumb, .bs-card, .bs-close, .bs-switch { transition:none!important; }
    }
  `);

  // -------------------------------
  // Keyboard (instant jumps on active container)
  // -------------------------------
  const bindKeys = () => {
    document.addEventListener('keydown', (e) => {
      if (UI_OPEN || isEditable(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (KEYS_SHIFT && !e.shiftKey) return;
      const d = getDigit(e); if (d == null) return;

      const inst = MGR?.active || MGR?.rootInst; if (!inst) return;
      const m = inst.m();
      e.preventDefault();

      // Keys remain instant
      if (d === '1') inst.to(0);
      else if (d === '0') inst.to(m.max);
      else inst.to(m.max * (parseInt(d, 10) / 10));
    });
  };

  // -------------------------------
  // Init
  // -------------------------------
    const start = () => {
      injectStyles();
      setTheme(CUR_THEME);
      MGR = new Manager();
      bindKeys();
      if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('🎨 Scrollbar Settings', () => (UI_OPEN ? closeUI() : openUI()));
      }
    };

  if (document.body) start();
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else setTimeout(start, 30);
})();