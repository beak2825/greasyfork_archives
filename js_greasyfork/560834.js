// ==UserScript==
// @name         YouTube Mobile Overlay Touch Unlock (Extreme v1.1 - No Description Jump)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  m.youtube.com：移除/失效化遮罩层(scrim/backdrop)与背景 inert 锁定，让打开评论/播放清单/分享/搜索等面板时仍可点击页面其它区域（降低“跳到 Description/滚动乱跳”副作用）
// @author       ?
// @license      CC-BY-4.0
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560834/YouTube%20Mobile%20Overlay%20Touch%20Unlock%20%28Extreme%20v11%20-%20No%20Description%20Jump%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560834/YouTube%20Mobile%20Overlay%20Touch%20Unlock%20%28Extreme%20v11%20-%20No%20Description%20Jump%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============================================================
  // Config
  // ============================================================
  const CONFIG = Object.freeze({
    debug: true,

    // Strong mode: aggressively neutralize scrims/backdrops
    strongMode: true,

    // scanning
    scanIntervalMs: 900,
    mutationThrottleMs: 80,

    // safety budgets
    maxPatchedPerEpoch: 2000,

    // heuristics for full-screen blockers
    minCoverRatio: 0.78,        // >= 78% viewport area
    maxInteractiveDesc: 2,      // scrim should have few/no interactive descendants
    minZIndex: 100,             // ignore low z-index overlays

    // unlock background scroll / inert
    // ★ 为了避免“跳到 Description / 滚动位置乱跳”，默认不再强制改 overflow
    forceUnlockScroll: false,

    // 仍然移除 inert（这是背景不可点的常见原因）
    forceRemoveInert: true,

    // 可选：只解锁 touch-action（不动 overflow），一般不会导致跳动
    forceUnlockTouchAction: true,

    // self-test sampling
    selfTest: true,
    selfTestGrid: 3,            // 3x3 points
    selfTestDelayMs: 120,

    // SPA navigation hooks（默认关掉，减少对 YouTube 内部路由的干扰；靠 interval + mutation 自愈足够）
    hookHistory: false,
  });

  const log = (...args) => CONFIG.debug && console.log('[YT-Overlay-Unlock]', ...args);

  // ============================================================
  // State (epoch / self-heal)
  // ============================================================
  const state = {
    epoch: 0,
    patchedThisEpoch: 0,

    // Remember original inline styles for reversibility
    patched: new WeakMap(), // el -> { styleText, pointerEvents, touchAction }

    // observers
    mo: null,
    timerId: null,

    // url
    lastUrl: '',
  };

  // ============================================================
  // Utility
  // ============================================================
  function isElement(el) { return el && el.nodeType === 1; }

  function getRect(el) {
    try { return el.getBoundingClientRect(); } catch (_) { return null; }
  }

  function isFullscreenish(el) {
    const r = getRect(el);
    if (!r) return false;

    const vw = Math.max(1, window.innerWidth || 1);
    const vh = Math.max(1, window.innerHeight || 1);

    const coverArea = Math.max(0, r.width) * Math.max(0, r.height);
    const viewArea = vw * vh;
    const ratio = coverArea / viewArea;

    // also require it’s roughly positioned over viewport
    const near = (Math.abs(r.left) < vw * 0.25) && (Math.abs(r.top) < vh * 0.25);

    return ratio >= CONFIG.minCoverRatio && near;
  }

  function parseAlpha(color) {
    // supports rgb()/rgba()
    if (!color) return 0;
    const m = color.match(/rgba?\(([^)]+)\)/i);
    if (!m) return 0;
    const parts = m[1].split(',').map(s => s.trim());
    if (parts.length < 3) return 0;
    if (parts.length === 3) return 1; // rgb = opaque
    const a = Number(parts[3]);
    return Number.isFinite(a) ? a : 0;
  }

  function zIndexNum(z) {
    if (!z || z === 'auto') return 0;
    const n = Number(z);
    return Number.isFinite(n) ? n : 0;
  }

  function countInteractiveDesc(el) {
    try {
      return el.querySelectorAll('button,[role="button"],a[href],input,textarea,select,summary').length;
    } catch (_) {
      return 0;
    }
  }

  function looksLikeScrimByName(el) {
    const id = (el.id || '').toLowerCase();
    const cls = (el.className && String(el.className).toLowerCase()) || '';
    const tag = (el.tagName || '').toLowerCase();

    return (
      tag.includes('scrim') ||
      id.includes('scrim') || cls.includes('scrim') ||
      id.includes('backdrop') || cls.includes('backdrop') ||
      id.includes('overlay') || cls.includes('overlay') ||
      id.includes('modal') || cls.includes('modal')
    );
  }

  function isLikelyBlocker(el) {
    if (!isElement(el)) return false;

    const cs = getComputedStyle(el);
    const pos = cs.position;
    if (!(pos === 'fixed' || pos === 'absolute' || pos === 'sticky')) return false;

    const zi = zIndexNum(cs.zIndex);
    if (zi < CONFIG.minZIndex && !CONFIG.strongMode) return false;

    // full-screen-ish
    if (!isFullscreenish(el) && !looksLikeScrimByName(el)) return false;

    // background opacity or blur suggests scrim
    const alpha = parseAlpha(cs.backgroundColor);
    const hasBlur = (cs.backdropFilter && cs.backdropFilter !== 'none') || (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none');
    const hasOpacity = Number(cs.opacity) < 1;

    // interactive descendants: scrim should be mostly empty
    const inter = countInteractiveDesc(el);
    const interactiveOk = inter <= CONFIG.maxInteractiveDesc;

    // scrim often has aria-hidden or role=presentation
    const ariaHidden = el.getAttribute('aria-hidden') === 'true';
    const role = (el.getAttribute('role') || '').toLowerCase();
    const roleOk = role === 'presentation' || role === 'none' || role === '';

    const visualOk = (alpha > 0.05) || hasBlur || hasOpacity;

    // Conservative decision unless strongMode
    if (CONFIG.strongMode) {
      return (visualOk && interactiveOk) || (looksLikeScrimByName(el) && interactiveOk) || (ariaHidden && visualOk);
    }
    return visualOk && interactiveOk && roleOk;
  }

  // ============================================================
  // Patch
  // ============================================================
  function patchBlocker(el, reason = '') {
    if (!isLikelyBlocker(el)) return false;
    if (state.patchedThisEpoch >= CONFIG.maxPatchedPerEpoch) return false;

    if (!state.patched.has(el)) {
      state.patched.set(el, {
        styleText: el.getAttribute('style') || '',
        pointerEvents: el.style.pointerEvents || '',
        touchAction: el.style.touchAction || '',
      });
    }

    // 核心：让遮罩不再接收点击，让事件穿透
    el.style.pointerEvents = 'none';
    el.style.touchAction = 'auto';

    el.dataset.ytOverlayUnlock = '1';
    state.patchedThisEpoch++;

    if (CONFIG.debug) {
      const cs = getComputedStyle(el);
      log(`✓ patched blocker (${reason})`, el.tagName, el.id, String(el.className || '').slice(0, 80), 'z=', cs.zIndex);
    }
    return true;
  }

  function unlockScrollAndInert() {
    // 为了避免“跳动”，默认不动 overflow；你若确实要解锁滚动，把 CONFIG.forceUnlockScroll 改 true
    if (CONFIG.forceUnlockTouchAction) {
      const html = document.documentElement;
      const body = document.body;
      try {
        if (html && getComputedStyle(html).touchAction === 'none') html.style.touchAction = 'auto';
      } catch (_) {}
      try {
        if (body && getComputedStyle(body).touchAction === 'none') body.style.touchAction = 'auto';
      } catch (_) {}
    }

    if (CONFIG.forceUnlockScroll) {
      const html = document.documentElement;
      const body = document.body;
      const x = window.scrollX || 0;
      const y = window.scrollY || 0;

      try {
        if (html && getComputedStyle(html).overflow === 'hidden') html.style.overflow = 'auto';
      } catch (_) {}
      try {
        if (body && getComputedStyle(body).overflow === 'hidden') body.style.overflow = 'auto';
      } catch (_) {}

      // 尽量把位置拉回去，避免 overflow 改动导致跳动
      try { window.scrollTo(x, y); } catch (_) {}
    }

    if (CONFIG.forceRemoveInert) {
      try {
        document.querySelectorAll('[inert]').forEach(el => el.removeAttribute('inert'));
      } catch (_) {}
    }
  }

  // ============================================================
  // Scan
  // ============================================================
  function scan(root = document.documentElement, reason = 'scan') {
    if (!root) return;

    unlockScrollAndInert();

    // 1) Fast path: name-based candidates
    const selectors = [
      '[id*="scrim" i]', '[class*="scrim" i]',
      '[id*="backdrop" i]', '[class*="backdrop" i]',
      '[id*="overlay" i]', '[class*="overlay" i]',
      '[role="presentation"]'
    ];

    for (const sel of selectors) {
      let nodes = [];
      try { nodes = root.querySelectorAll(sel); } catch (_) {}
      for (const el of nodes) patchBlocker(el, reason + ':name');
    }

    // 2) Heuristic path: fixed full-screen blockers
    let all = [];
    try { all = root.querySelectorAll('*'); } catch (_) {}
    const step = all.length > 5000 ? 4 : 1;

    for (let i = 0; i < all.length; i += step) {
      patchBlocker(all[i], reason + ':heur');
    }

    if (CONFIG.selfTest) {
      setTimeout(selfTest, CONFIG.selfTestDelayMs);
    }
  }

  // ============================================================
  // Self-test (runtime verification)
  // ============================================================
  function selfTest() {
    const n = Math.max(2, CONFIG.selfTestGrid);
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;

    let hit = 0;
    for (let iy = 1; iy <= n; iy++) {
      for (let ix = 1; ix <= n; ix++) {
        const x = Math.floor((vw * ix) / (n + 1));
        const y = Math.floor((vh * iy) / (n + 1));
        const el = document.elementFromPoint(x, y);

        // 如果 elementFromPoint 返回的是我们打了标的遮罩，就再补扫一次
        if (el && el.dataset && el.dataset.ytOverlayUnlock === '1') hit++;
      }
    }

    if (hit > 0) {
      log(`⚠ selfTest: still hitting patched blockers at ${hit} points; re-scan`);
      scan(document.documentElement, 'selfTest-rescan');
    } else {
      log('✓ selfTest: ok');
    }
  }

  // ============================================================
  // Observers & SPA hooks
  // ============================================================
  function newEpoch(reason) {
    state.epoch++;
    state.patchedThisEpoch = 0;
    log(`★ NEW EPOCH=${state.epoch} (${reason})`);
    scan(document.documentElement, 'epoch');
  }

  function setupObserver() {
    let t = null;
    state.mo = new MutationObserver((muts) => {
      if (t) return;
      t = setTimeout(() => {
        t = null;
        for (const m of muts) {
          if (m.type === 'childList' && m.addedNodes?.length) {
            for (const n of m.addedNodes) {
              if (n && n.nodeType === 1) scan(n, 'mutation');
            }
          }
        }
        unlockScrollAndInert();
      }, CONFIG.mutationThrottleMs);
    });

    state.mo.observe(document.documentElement, { childList: true, subtree: true });
    log('✓ observer started');
  }

  function hookHistory() {
    if (!CONFIG.hookHistory) return;

    const _push = history.pushState;
    const _replace = history.replaceState;

    history.pushState = function () {
      const ret = _push.apply(this, arguments);
      onNavigate('pushState');
      return ret;
    };
    history.replaceState = function () {
      const ret = _replace.apply(this, arguments);
      onNavigate('replaceState');
      return ret;
    };
    window.addEventListener('popstate', () => onNavigate('popstate'), { passive: true });
    window.addEventListener('yt-navigate-finish', () => onNavigate('yt-navigate-finish'), { passive: true });
  }

  function onNavigate(src) {
    const url = location.href;
    if (url === state.lastUrl) return;
    state.lastUrl = url;
    newEpoch('nav:' + src);
  }

  function init() {
    log('init overlay-unlock v1.1... (no description jump)');
    state.lastUrl = location.href;

    // Base CSS guard (lightweight)
    const style = document.createElement('style');
    style.id = 'yt-overlay-unlock-style';
    style.textContent = `
      [id*="scrim" i], [class*="scrim" i],
      [id*="backdrop" i], [class*="backdrop" i] {
        pointer-events: none !important;
      }
    `;
    (document.documentElement || document.head || document.body || document).appendChild(style);

    setupObserver();
    hookHistory();

    // periodic scan (self-heal)
    state.timerId = setInterval(() => scan(document.documentElement, 'interval'), CONFIG.scanIntervalMs);

    // initial scan
    setTimeout(() => scan(document.documentElement, 'boot'), 200);
    setTimeout(() => scan(document.documentElement, 'boot2'), 900);

    log('✓ init done');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Debug
  if (CONFIG.debug) {
    window.__YT_OVERLAY_UNLOCK__ = {
      CONFIG,
      state,
      scan,
      selfTest,
      newEpoch,
      isLikelyBlocker
    };
    log('debug: window.__YT_OVERLAY_UNLOCK__');
  }
})();
