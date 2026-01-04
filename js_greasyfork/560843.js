// ==UserScript==
// @name         YouTube Speed Hotzone Pro (1.25 + Drag) for m.youtube.com
// @namespace    ?
// @author       ?
// @license      CC-BY-4.0
// @version      2.5.0
// @description  Click-through hotzone; FAB+panel only. True 1.25x via 0.05 step. Long-press FAB to drag-position (saved).
// @match        https://m.youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560843/YouTube%20Speed%20Hotzone%20Pro%20%28125%20%2B%20Drag%29%20for%20myoutubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/560843/YouTube%20Speed%20Hotzone%20Pro%20%28125%20%2B%20Drag%29%20for%20myoutubecom.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    MIN_SPEED: 0.05,
    MAX_SPEED: 10,
    STEP: 0.05,                 // ✅ 1.25 需要 0.05 或 0.25；这里用 0.05 更细
    DEFAULT_SPEED: 1,
    DEFAULT_PRESET: 1.25,        // ✅ 快捷一键 1.25
    STORAGE_KEY_SPEED: 'yts-hotzone-speed',
    STORAGE_KEY_REMEMBER: 'yts-hotzone-remember',
    STORAGE_KEY_OFFSET: 'yts-hotzone-offset', // {dx, dy}

    // UI 尺寸
    HOTZONE_WIDTH_PX: 420,
    HOTZONE_HEIGHT_PX: 92,
    FAB_FROM_VIDEO_BOTTOM_PX: 74,
    PANEL_GAP_PX: 10,

    // 拖动定位（更高效）
    DRAG_HOLD_MS: 220,           // 长按进入拖动
    DRAG_THRESHOLD_PX: 6,        // 移动多少算拖动
    SNAP_PX: 1,                  // >0 可做吸附；这里用 1 表示基本不吸附

    // 速度保持（避免被 YT 覆盖）
    ENFORCE_MS: 4200,            // 设置后监控一段时间纠正 playbackRate
    ENFORCE_TICK_MS: 220,

    DEBUG: false
  };

  const Z = 2147483647;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const roundToStep = (v, step) => Math.round(v / step) * step;

  const fmtSpeed = (v) => {
    // 0.05 步进时：1.25 这种显示两位更舒服；整数/一位也可以自动收敛
    const s = v.toFixed(2);
    return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
  };

  class Store {
    constructor(key) { this.key = key; }
    set(v) { try { localStorage.setItem(this.key, JSON.stringify(v)); } catch (_) {} }
    get(def) {
      try {
        const raw = localStorage.getItem(this.key);
        return raw ? JSON.parse(raw) : def;
      } catch (_) { return def; }
    }
  }

  const STYLES = `
    #yts-speed-hotzone,
    #yts-speed-fab,
    #yts-speed-panel,
    #yts-speed-panel * {
      box-sizing: border-box !important;
      -webkit-tap-highlight-color: transparent !important;
      font-family: Arial, sans-serif !important;
    }

    /* 热区容器：只定位，点穿网页 */
    #yts-speed-hotzone {
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      width: ${CONFIG.HOTZONE_WIDTH_PX}px !important;
      height: ${CONFIG.HOTZONE_HEIGHT_PX}px !important;
      z-index: ${Z} !important;
      pointer-events: none !important;
      background: rgba(0,0,0,0) !important;
      border-radius: 14px !important;
    }

    /* FAB：可点 + 可拖（仅 FAB 捕获 pointer） */
    #yts-speed-fab {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;

      width: 42px !important;
      height: 42px !important;
      border-radius: 999px !important;
      background: rgba(0, 0, 0, 0.72) !important;
      border: 2px solid rgba(255, 255, 255, 0.22) !important;
      color: #fff !important;

      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;

      font-weight: 900 !important;
      font-size: 12px !important;
      user-select: none !important;
      cursor: pointer !important;
      backdrop-filter: blur(6px) !important;
      transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease !important;

      pointer-events: auto !important;
      touch-action: none !important; /* ✅ 支持拖动（防止页面滚动抢手势） */
    }

    #yts-speed-fab:hover {
      background: rgba(255, 0, 0, 0.82) !important;
      border-color: rgba(255, 255, 255, 0.50) !important;
      transform: translate(-50%, -50%) scale(1.06) !important;
    }

    #yts-speed-fab:active {
      transform: translate(-50%, -50%) scale(0.96) !important;
    }

    /* 拖动时给个状态（不挡点击） */
    #yts-speed-fab.yts-dragging {
      background: rgba(0, 140, 255, 0.82) !important;
      border-color: rgba(255,255,255,0.55) !important;
    }

    /* 面板：可点 */
    #yts-speed-panel {
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      z-index: ${Z} !important;
      pointer-events: auto !important;

      width: min(860px, calc(100vw - 16px)) !important;
      transform: translateX(-50%) !important;

      background: var(--yt-spec-base-background, rgba(255,255,255,0.96)) !important;
      color: var(--yt-spec-text-primary, #111) !important;
      border: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.12)) !important;
      box-shadow: 0 10px 28px rgba(0,0,0,0.20) !important;

      border-radius: 12px !important;
      padding: 10px 12px !important;

      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 10px !important;

      max-height: 0 !important;
      opacity: 0 !important;
      overflow: hidden !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      border-width: 0 !important;

      transition: max-height 0.18s ease, opacity 0.18s ease, padding 0.18s ease, border-width 0.18s ease !important;
    }

    #yts-speed-panel.yts-open {
      max-height: 280px !important;
      opacity: 1 !important;
      overflow: visible !important;
      padding-top: 10px !important;
      padding-bottom: 10px !important;
      border-width: 1px !important;
    }

    #yts-speed-label {
      font-weight: 900 !important;
      min-width: 62px !important;
      text-align: center !important;
      padding: 6px 10px !important;
      border-radius: 999px !important;
      background: var(--yt-spec-10-percent-layer, rgba(0,0,0,0.08)) !important;
      color: var(--yt-spec-text-primary, #111) !important;
    }

    #yts-speed-slider {
      flex: 1 1 240px !important;
      min-width: 180px !important;
      height: 6px !important;
      -webkit-appearance: none !important;
      appearance: none !important;
      background: rgba(127, 127, 127, 0.30) !important;
      border-radius: 999px !important;
      outline: none !important;
      cursor: pointer !important;
    }

    #yts-speed-slider::-webkit-slider-thumb {
      -webkit-appearance: none !important;
      appearance: none !important;
      width: 18px !important;
      height: 18px !important;
      border-radius: 50% !important;
      background: #ff0000 !important;
      cursor: pointer !important;
      border: 0 !important;
    }
    #yts-speed-slider::-moz-range-thumb {
      width: 18px !important;
      height: 18px !important;
      border-radius: 50% !important;
      background: #ff0000 !important;
      cursor: pointer !important;
      border: 0 !important;
    }

    #yts-speed-presets {
      display: flex !important;
      gap: 6px !important;
      align-items: center !important;
      padding-left: 8px !important;
      border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.12)) !important;
    }

    .yts-preset-btn {
      padding: 6px 10px !important;
      border-radius: 10px !important;
      border: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.12)) !important;
      background: var(--yt-spec-raised-background, rgba(255,255,255,0.85)) !important;
      color: var(--yt-spec-text-primary, #111) !important;
      cursor: pointer !important;
      user-select: none !important;
      font-size: 12px !important;
      font-weight: 800 !important;
      touch-action: manipulation !important;
    }

    .yts-preset-btn.active {
      background: #ff0000 !important;
      border-color: #ff0000 !important;
      color: #fff !important;
    }

    #yts-speed-remember {
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding-left: 8px !important;
      border-left: 1px solid var(--yt-spec-10-percent-layer, rgba(0,0,0,0.12)) !important;
      font-size: 12px !important;
      user-select: none !important;
      cursor: pointer !important;
    }

    #yts-speed-remember input {
      width: 16px !important;
      height: 16px !important;
      accent-color: #ff0000 !important;
      cursor: pointer !important;
    }

    @media (max-width: 420px) {
      #yts-speed-slider { min-width: 150px !important; }
    }
  `;

  class Controller {
    constructor() {
      this.speedStore = new Store(CONFIG.STORAGE_KEY_SPEED);
      this.rememberStore = new Store(CONFIG.STORAGE_KEY_REMEMBER);
      this.offsetStore = new Store(CONFIG.STORAGE_KEY_OFFSET);

      this.video = null;
      this.currentSpeed = this.getInitialSpeed();

      this.hotzone = null;
      this.fab = null;
      this.panel = null;
      this.slider = null;
      this.label = null;
      this.checkbox = null;

      this.canHover = window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;
      this.closeTimer = null;

      // 拖动定位状态
      this.drag = {
        holding: false,
        dragging: false,
        holdTimer: null,
        pointerId: null,
        startX: 0,
        startY: 0,
        startDx: 0,
        startDy: 0
      };

      this.offset = this.offsetStore.get({ dx: 0, dy: 0 });

      // 定位刷新节流
      this.posScheduled = false;

      // 速度监控
      this.enforceTimer = null;
      this.enforceEndsAt = 0;

      // observers
      this.ro = null;
      this.mo = null;

      this.init();
    }

    dlog(...a) { if (CONFIG.DEBUG) console.log('[YTS-Pro]', ...a); }

    getInitialSpeed() {
      const remember = this.rememberStore.get(false);
      return remember ? this.speedStore.get(CONFIG.DEFAULT_SPEED) : CONFIG.DEFAULT_SPEED;
    }

    injectStyles() {
      if (document.getElementById('yts-hotzone-styles')) return;
      const style = document.createElement('style');
      style.id = 'yts-hotzone-styles';
      style.textContent = STYLES;
      (document.head || document.documentElement).appendChild(style);
    }

    findVideo() {
      return (
        document.querySelector('#movie_player video.html5-main-video') ||
        document.querySelector('video.html5-main-video') ||
        document.querySelector('#player-container-id video') ||
        document.querySelector('ytm-player video') ||
        document.querySelector('video')
      );
    }

    isValidVideo(v) {
      if (!v || !v.getBoundingClientRect) return false;
      const r = v.getBoundingClientRect();
      return r && r.width >= 120 && r.height >= 90;
    }

    getVideoRect() {
      const v = this.video || this.findVideo();
      if (!this.isValidVideo(v)) return null;
      return v.getBoundingClientRect();
    }

    ensureVideo() {
      const v = this.findVideo();
      if (v && v !== this.video) {
        this.video = v;
        this.installVideoHooks(v);
        this.installResizeObserver(v);
        this.forceSetSpeed(this.currentSpeed);
        this.schedulePositionUpdate();
      }
    }

    installResizeObserver(video) {
      try { this.ro?.disconnect(); } catch (_) {}
      if (!video || !('ResizeObserver' in window)) return;
      this.ro = new ResizeObserver(() => this.schedulePositionUpdate());
      this.ro.observe(video);
    }

    installMutationObserver() {
      // 轻量：只负责“视频替换检测”，别做重活
      try { this.mo?.disconnect(); } catch (_) {}
      this.mo = new MutationObserver(() => {
        // 用微任务节流
        Promise.resolve().then(() => this.ensureVideo());
      });
      this.mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    ensureUI() {
      this.injectStyles();

      if (!document.getElementById('yts-speed-hotzone') || !document.getElementById('yts-speed-panel')) {
        this.createUI();
        this.bindUIEvents();
      } else {
        this.hotzone = document.getElementById('yts-speed-hotzone');
        this.fab = document.getElementById('yts-speed-fab');
        this.panel = document.getElementById('yts-speed-panel');
        this.slider = document.getElementById('yts-speed-slider');
        this.label = document.getElementById('yts-speed-label');
        this.checkbox = document.getElementById('yts-speed-remember-checkbox');
      }

      this.syncUI();
      this.schedulePositionUpdate();
    }

    createUI() {
      this.hotzone = document.createElement('div');
      this.hotzone.id = 'yts-speed-hotzone';

      this.fab = document.createElement('div');
      this.fab.id = 'yts-speed-fab';
      this.fab.textContent = `${fmtSpeed(this.currentSpeed)}x`;
      this.fab.setAttribute('role', 'button');
      this.fab.setAttribute('tabindex', '0');

      this.hotzone.appendChild(this.fab);

      this.panel = document.createElement('div');
      this.panel.id = 'yts-speed-panel';

      this.label = document.createElement('span');
      this.label.id = 'yts-speed-label';
      this.label.textContent = `${fmtSpeed(this.currentSpeed)}x`;

      this.slider = document.createElement('input');
      this.slider.type = 'range';
      this.slider.id = 'yts-speed-slider';
      this.slider.min = String(CONFIG.MIN_SPEED);
      this.slider.max = String(CONFIG.MAX_SPEED);
      this.slider.step = String(CONFIG.STEP);
      this.slider.value = String(this.currentSpeed);

      const presets = document.createElement('div');
      presets.id = 'yts-speed-presets';

      // ✅ 预设包含 1.25；也保留常用档
      const presetList = [0.5, 1, 1.25, 1.5, 2, 2.5];
      for (const s of presetList) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'yts-preset-btn';
        b.textContent = `${fmtSpeed(s)}x`;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setSpeed(s, { reason: 'preset' });
        });
        presets.appendChild(b);
      }

      const rememberLabel = document.createElement('label');
      rememberLabel.id = 'yts-speed-remember';

      this.checkbox = document.createElement('input');
      this.checkbox.id = 'yts-speed-remember-checkbox';
      this.checkbox.type = 'checkbox';
      this.checkbox.checked = this.rememberStore.get(false);

      const rememberText = document.createElement('span');
      rememberText.textContent = '記住';

      rememberLabel.appendChild(this.checkbox);
      rememberLabel.appendChild(rememberText);

      this.panel.appendChild(this.label);
      this.panel.appendChild(this.slider);
      this.panel.appendChild(presets);
      this.panel.appendChild(rememberLabel);

      document.body.appendChild(this.hotzone);
      document.body.appendChild(this.panel);

      // 强制顶层与点穿
      this.hotzone.style.setProperty('z-index', String(Z), 'important');
      this.hotzone.style.setProperty('pointer-events', 'none', 'important');
      this.fab.style.setProperty('pointer-events', 'auto', 'important');
      this.panel.style.setProperty('z-index', String(Z), 'important');
      this.panel.style.setProperty('pointer-events', 'auto', 'important');

      this.updatePresetButtons();
    }

    openPanel() { this.panel?.classList.add('yts-open'); }
    closePanel() { this.panel?.classList.remove('yts-open'); }
    togglePanel() { this.panel?.classList.toggle('yts-open'); }

    scheduleClose(ms = 140) {
      clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => this.closePanel(), ms);
    }
    cancelClose() { clearTimeout(this.closeTimer); this.closeTimer = null; }

    bindUIEvents() {
      // slider（用 rAF 合并 input 事件更顺滑）
      let raf = 0;
      this.slider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => this.setSpeed(v, { reason: 'slider' }));
      });

      // remember
      this.checkbox.addEventListener('change', () => {
        this.rememberStore.set(this.checkbox.checked);
        if (this.checkbox.checked) this.speedStore.set(this.currentSpeed);
      });

      // wheel on FAB
      this.fab.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -CONFIG.STEP : CONFIG.STEP;
        this.setSpeed(this.currentSpeed + delta, { reason: 'wheel' });
      }, { passive: false });

      // dblclick reset
      this.fab.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setSpeed(1, { reason: 'dblclick' });
      });

      // hover behaviors
      if (this.canHover) {
        this.fab.addEventListener('mouseenter', () => { this.cancelClose(); this.openPanel(); });
        this.fab.addEventListener('mouseleave', () => this.scheduleClose(120));
        this.panel.addEventListener('mouseenter', () => { this.cancelClose(); this.openPanel(); });
        this.panel.addEventListener('mouseleave', () => this.scheduleClose(140));
      }

      // 点击外部关闭（capture）
      document.addEventListener('pointerdown', (e) => {
        if (!this.panel?.classList.contains('yts-open')) return;
        const t = e.target;
        if (t instanceof Node && (this.fab.contains(t) || this.panel.contains(t))) return;
        this.closePanel();
      }, true);

      // FAB：短按开关面板；长按拖动定位
      this.bindDragToFab();

      // keyboard：不在输入框时启用
      window.addEventListener('keydown', (e) => {
        if (e.defaultPrevented) return;
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;

        if (e.key === '[') { this.setSpeed(this.currentSpeed - CONFIG.STEP, { reason: 'kbd' }); }
        if (e.key === ']') { this.setSpeed(this.currentSpeed + CONFIG.STEP, { reason: 'kbd' }); }
        if (e.key === '\\') { this.setSpeed(1, { reason: 'kbd' }); }
        if (e.key.toLowerCase() === 'p') { this.setSpeed(CONFIG.DEFAULT_PRESET, { reason: 'kbd' }); }
      }, true);

      // Enter/Space toggle
      this.fab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.togglePanel();
        }
      });

      // scroll/resize/fullscreen/orientation：只触发定位刷新（不跑死循环）
      window.addEventListener('scroll', () => this.schedulePositionUpdate(), { passive: true });
      window.addEventListener('resize', () => this.schedulePositionUpdate(), { passive: true });
      window.addEventListener('orientationchange', () => this.schedulePositionUpdate(), { passive: true });
      document.addEventListener('fullscreenchange', () => this.schedulePositionUpdate(), true);

      // YouTube SPA
      document.addEventListener('yt-navigate-finish', () => { this.ensureVideo(); this.schedulePositionUpdate(); }, true);
      document.addEventListener('yt-page-data-updated', () => { this.ensureVideo(); this.schedulePositionUpdate(); }, true);
      document.addEventListener('spfdone', () => { this.ensureVideo(); this.schedulePositionUpdate(); }, true);
    }

    bindDragToFab() {
      const d = this.drag;

      const clearHold = () => {
        if (d.holdTimer) clearTimeout(d.holdTimer);
        d.holdTimer = null;
        d.holding = false;
      };

      const startDrag = () => {
        d.dragging = true;
        this.fab.classList.add('yts-dragging');
        // 拖动时不要误触 toggle
      };

      const endDrag = () => {
        d.dragging = false;
        this.fab.classList.remove('yts-dragging');
        d.pointerId = null;
        clearHold();
        // 保存偏移
        this.offsetStore.set(this.offset);
      };

      this.fab.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        d.pointerId = e.pointerId;
        d.startX = e.clientX;
        d.startY = e.clientY;
        d.startDx = this.offset.dx || 0;
        d.startDy = this.offset.dy || 0;

        d.holding = true;
        clearHold();
        d.holdTimer = setTimeout(() => {
          d.holding = false;
          startDrag();
        }, CONFIG.DRAG_HOLD_MS);

        try { this.fab.setPointerCapture(e.pointerId); } catch (_) {}
      }, true);

      this.fab.addEventListener('pointermove', (e) => {
        if (d.pointerId == null || e.pointerId !== d.pointerId) return;

        const dx = e.clientX - d.startX;
        const dy = e.clientY - d.startY;

        // 如果没到长按，但移动超过阈值，也进入拖动
        if (!d.dragging && (Math.abs(dx) + Math.abs(dy) >= CONFIG.DRAG_THRESHOLD_PX)) {
          clearHold();
          startDrag();
        }

        if (!d.dragging) return;

        // 更新偏移（相对“默认锚点”）
        const ndx = d.startDx + dx;
        const ndy = d.startDy + dy;

        // 简单吸附（几乎不吸）
        this.offset.dx = Math.round(ndx / CONFIG.SNAP_PX) * CONFIG.SNAP_PX;
        this.offset.dy = Math.round(ndy / CONFIG.SNAP_PX) * CONFIG.SNAP_PX;

        this.schedulePositionUpdate();
      }, true);

      this.fab.addEventListener('pointerup', (e) => {
        if (d.pointerId == null || e.pointerId !== d.pointerId) return;

        const moved = Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY);

        // 拖动结束
        if (d.dragging) {
          endDrag();
          return;
        }

        // 非拖动：短按切换面板
        clearHold();
        if (moved < CONFIG.DRAG_THRESHOLD_PX) {
          // 触控：短按 toggle；桌面 hover 已打开也允许 toggle
          this.togglePanel();
        }

        d.pointerId = null;
      }, true);

      this.fab.addEventListener('pointercancel', (e) => {
        if (d.pointerId == null || e.pointerId !== d.pointerId) return;
        endDrag();
      }, true);
    }

    installVideoHooks(video) {
      // 防止重复安装
      if (!video || video.__ytsProHooked) return;
      video.__ytsProHooked = true;

      // 如果 YT 改了 rate，纠正回来
      video.addEventListener('ratechange', () => {
        if (!this.video) return;
        if (Math.abs(this.video.playbackRate - this.currentSpeed) > 0.01) {
          // 只在我们“需要保持”的窗口内严格纠正，平时不死磕
          if (Date.now() < this.enforceEndsAt) {
            this.video.playbackRate = this.currentSpeed;
          }
        }
      }, true);

      // 播放相关时机：确保 speed
      video.addEventListener('play', () => this.forceSetSpeed(this.currentSpeed), true);
      video.addEventListener('loadeddata', () => this.forceSetSpeed(this.currentSpeed), true);
      video.addEventListener('canplay', () => this.forceSetSpeed(this.currentSpeed), true);
    }

    forceSetSpeed(speed) {
      if (!this.video) return;
      this.video.playbackRate = speed;

      // 多次补写（YouTube 有时会覆盖）
      setTimeout(() => { if (this.video) this.video.playbackRate = speed; }, 120);
      setTimeout(() => { if (this.video) this.video.playbackRate = speed; }, 320);

      // 开启短期监控（性能友好：只监控几秒，不是永久 interval）
      this.enforceEndsAt = Date.now() + CONFIG.ENFORCE_MS;
      this.startEnforcer();
    }

    startEnforcer() {
      if (this.enforceTimer) clearInterval(this.enforceTimer);
      this.enforceTimer = setInterval(() => {
        if (!this.video) return;
        const now = Date.now();
        if (now >= this.enforceEndsAt) {
          clearInterval(this.enforceTimer);
          this.enforceTimer = null;
          return;
        }
        if (Math.abs(this.video.playbackRate - this.currentSpeed) > 0.01) {
          this.video.playbackRate = this.currentSpeed;
        }
      }, CONFIG.ENFORCE_TICK_MS);
    }

    updatePresetButtons() {
      if (!this.panel) return;
      this.panel.querySelectorAll('.yts-preset-btn').forEach((btn) => {
        const t = btn.textContent.replace('x', '').trim();
        const s = parseFloat(t);
        btn.classList.toggle('active', Math.abs(s - this.currentSpeed) < 0.001);
      });
    }

    syncUI() {
      const txt = `${fmtSpeed(this.currentSpeed)}x`;
      if (this.fab) this.fab.textContent = txt;
      if (this.label) this.label.textContent = txt;
      if (this.slider) this.slider.value = String(this.currentSpeed);
      this.updatePresetButtons();
    }

    setSpeed(speed, { reason } = {}) {
      speed = clamp(speed, CONFIG.MIN_SPEED, CONFIG.MAX_SPEED);
      speed = roundToStep(speed, CONFIG.STEP);

      // 防止浮点垃圾（比如 1.2500000002）
      speed = parseFloat(speed.toFixed(2));

      this.currentSpeed = speed;
      if (this.video) this.forceSetSpeed(speed);

      this.speedStore.set(speed);
      if (this.checkbox?.checked) this.speedStore.set(speed);

      this.syncUI();
      if (CONFIG.DEBUG) this.dlog('setSpeed', speed, reason);
    }

    schedulePositionUpdate() {
      if (this.posScheduled) return;
      this.posScheduled = true;
      requestAnimationFrame(() => {
        this.posScheduled = false;
        this.updatePosition();
      });
    }

    updatePosition() {
      const rect = this.getVideoRect();
      if (!rect || !this.hotzone || !this.panel) {
        if (this.hotzone) this.hotzone.style.setProperty('display', 'none', 'important');
        if (this.panel) this.panel.style.setProperty('display', 'none', 'important');
        return;
      }

      this.hotzone.style.setProperty('display', 'block', 'important');
      this.panel.style.setProperty('display', 'flex', 'important');

      const hzW = CONFIG.HOTZONE_WIDTH_PX;
      const hzH = CONFIG.HOTZONE_HEIGHT_PX;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.bottom - CONFIG.FAB_FROM_VIDEO_BOTTOM_PX;

      // ✅ offset 应用在锚点上（拖动定位更直觉）
      const anchorX = centerX + (this.offset.dx || 0);
      const anchorY = centerY + (this.offset.dy || 0);

      const left = clamp(anchorX - hzW / 2, 8, window.innerWidth - 8 - hzW);
      const top = clamp(anchorY - hzH / 2, 8, window.innerHeight - 8 - hzH);

      this.hotzone.style.setProperty('left', `${left}px`, 'important');
      this.hotzone.style.setProperty('top', `${top}px`, 'important');

      // panel：尽量靠视频下方；打开时避免出屏
      const panelLeft = clamp(anchorX, 8 + 200, window.innerWidth - 8 - 200);
      let panelTop = rect.bottom + CONFIG.PANEL_GAP_PX;

      const open = this.panel.classList.contains('yts-open');
      if (open) {
        const approxH = Math.min(280, this.panel.scrollHeight || 280);
        if (panelTop + approxH > window.innerHeight - 8) {
          panelTop = clamp(top - approxH - 10, 8, window.innerHeight - 8 - approxH);
        }
      } else {
        panelTop = clamp(panelTop, 8, window.innerHeight - 8);
      }

      this.panel.style.setProperty('left', `${panelLeft}px`, 'important');
      this.panel.style.setProperty('top', `${panelTop}px`, 'important');
    }

    init() {
      this.injectStyles();
      this.ensureVideo();
      this.ensureUI();

      // 初次：如果用户勾了 remember，就恢复存储 speed；否则用 DEFAULT_SPEED
      if (this.video) this.forceSetSpeed(this.currentSpeed);

      // ✅ SPA / 动态替换：轻量 observer + 少量定时兜底
      this.installMutationObserver();
      setInterval(() => this.ensureVideo(), 1200); // 兜底：频率低，不会伤性能

      // 初次定位
      this.schedulePositionUpdate();
    }
  }

  function boot() {
    try { new Controller(); } catch (e) { console.error('[YTS-Pro] init error', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
