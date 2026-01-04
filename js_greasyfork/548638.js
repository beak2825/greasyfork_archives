// ==UserScript==
// @name         YouTube Controller
// @namespace    yt-controller
// @version      2.8.1
// @description  Transcript toggle and 15s/5s back/forward buttons for YouTube watch & shorts pages. Shadow DOM sandboxed; SPA-safe routing.
// @match        *://www.youtube.com/*
// @run-at       document-start
// @all-frames   true
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548638/YouTube%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/548638/YouTube%20Controller.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- config (kept from your v2.7 tweaks)
  const SEEK_5  = 5;
  const SEEK_15 = 15;

  const BTN      = 30;  // px
  const GAP      = 6;   // px
  const RADIUS   = 10;  // px
  const ICON_PX  = 16;  // px
  const OFFSET_X = 15;  // px from logo
  const MIN_TOP  = 8;

  // Route guard: only enable on /watch or /shorts
  const isTargetRoute = () =>
    location.pathname.startsWith('/watch') || location.pathname.startsWith('/shorts');

  // --- load Material Symbols in the page (shadow uses it)
  function ensureMaterialSymbols() {
    if (document.getElementById('ytCtrlMaterialSymbols')) return;
    const link = document.createElement('link');
    link.id = 'ytCtrlMaterialSymbols';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,600,1,0';
    (document.head || document.documentElement).appendChild(link);
  }

  // --- create shadow host + shadow UI (isolated CSS)
  const HOST_ID = 'ytControllerHost';
  let host, root, bar;
  let btnTranscript, btnBack15, btnBack5, btnFwd5, btnFwd15;
  let mo; // MutationObserver
  let mounted = false;

  function ensureHost() {
    if (host && root && bar) return true;
    if (!document.body) return false;

    host = document.getElementById(HOST_ID);
    if (!host) {
      host = document.createElement('div');
      host.id = HOST_ID;
      host.style.position = 'fixed';
      host.style.left = '16px';
      host.style.top  = '12px';
      host.style.zIndex = '2147483647';
      host.style.pointerEvents = 'auto';
      document.body.appendChild(host);
    }
    if (!root) {
      root = host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = `
        :host { all: initial; }
        .bar { display: inline-flex; gap: ${GAP}px; }
        .btn {
          width: ${BTN}px; height: ${BTN}px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ff6060; /* your light-mode red */
          color: #fff;
          border: none;
          border-radius: ${RADIUS}px;
          box-shadow: none;
          cursor: pointer;
          outline: none;
          transition: filter .15s ease;
        }
        @media (prefers-color-scheme: dark) {
          .btn { background: #6e5dd1; box-shadow: 0 2px 6px rgba(0,0,0,.28); }
        }
        .btn:hover:not([disabled]) { filter: brightness(1.06) saturate(1.05); }
        .btn:active:not([disabled]) { filter: brightness(.98); }
        .btn[disabled] { opacity: .45; cursor: not-allowed; filter: none; }
        .ms {
          font-family: 'Material Symbols Rounded', sans-serif;
          font-variation-settings: 'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24;
          font-size: ${ICON_PX}px;
          line-height: 1;
        }
      `;
      root.appendChild(style);

      bar = document.createElement('div');
      bar.className = 'bar';
      root.appendChild(bar);
    }
    return true;
  }

  // --- helpers
  function ms(name) { const s = document.createElement('span'); s.className = 'ms'; s.textContent = name; return s; }

  // SMART video targeting (watch & shorts)
  function getActiveVideo() {
    const path = location.pathname;
    if (path.startsWith('/shorts')) {
      let v = document.querySelector('ytd-reel-video-renderer[is-active] video');
      if (v) return v;
      v = document.querySelector('ytd-reel-video-renderer[tabindex="0"] video, ytd-reel-video-renderer[is-playable] video');
      if (v) return v;
      const candidates = document.querySelectorAll('ytd-shorts video, #shorts-container video, video[playsinline]');
      for (const el of candidates) if (el.offsetParent !== null) return el;
      return document.querySelector('video');
    }
    return (
      document.querySelector('#movie_player video.html5-main-video') ||
      document.querySelector('ytd-player video.html5-main-video') ||
      document.querySelector('video[controls][src]') ||
      document.querySelector('video')
    );
  }

  // safe seek with tiny retry if video not ready yet
  function seekBy(delta) {
    const trySeek = (attempt = 0) => {
      const v = getActiveVideo();
      if (!v) { if (attempt < 10) setTimeout(() => trySeek(attempt + 1), 60); return; }
      const dur = Number.isFinite(v.duration) ? v.duration : 9e9;
      v.currentTime = Math.max(0, Math.min(dur, (v.currentTime || 0) + delta));
    };
    trySeek();
  }

  // header anchor
  function findLogoAnchor() {
    return (
      document.querySelector('a#logo') ||
      document.querySelector('ytd-topbar-logo-renderer a') ||
      document.querySelector('#logo-icon') ||
      document.querySelector('yt-icon-button#guide-button') ||
      null
    );
  }
  function positionHost() {
    if (!host) return;
    const logo = findLogoAnchor();
    if (logo) {
      const r = logo.getBoundingClientRect();
      const top = Math.max(MIN_TOP, Math.round(r.top + (r.height - BTN) / 2));
      const left = Math.round(r.right + OFFSET_X);
      host.style.top  = `${top}px`;
      host.style.left = `${left}px`;
    } else {
      host.style.top  = '12px';
      host.style.left = '16px';
    }
  }

  // -------- Transcript utilities --------
  function getTranscriptButtons() {
    let showBtn = null, hideBtn = null, closeBtn = null;
    const all = [
      ...document.querySelectorAll('button'),
      ...document.querySelectorAll('[role="button"]'),
      ...document.querySelectorAll('tp-yt-paper-button')
    ];
    for (const el of all) {
      const t = (el.textContent || '').trim().toLowerCase();
      if (!t) continue;
      if (t.includes('show transcript')) showBtn = el;
      if (t.includes('hide transcript')) hideBtn = el;
    }
    closeBtn = document.querySelector(
      'ytd-engagement-panel-section-list-renderer[target-id*="transcript"] yt-icon-button[aria-label*="Close"], ' +
      'ytd-engagement-panel-section-list-renderer[target-id*="transcript"] [aria-label*="Close transcript"]'
    );
    return { showBtn, hideBtn, closeBtn };
  }
  function isTranscriptVisible() {
    const { hideBtn } = getTranscriptButtons();
    if (hideBtn) return true;
    const panel =
      document.querySelector('ytd-engagement-panel-section-list-renderer[target-id*="transcript"]') ||
      document.querySelector('ytd-transcript-renderer') ||
      document.querySelector('ytd-transcript-search-panel-renderer');
    if (panel) {
      const visAttr = panel.getAttribute('visibility') || '';
      if (/EXPANDED/i.test(visAttr)) return true;
      if (panel.offsetParent !== null) return true;
    }
    return false;
  }
  function transcriptAvailable() {
    const { showBtn, hideBtn } = getTranscriptButtons();
    return !!(showBtn || hideBtn);
  }
  function toggleTranscript(btnUI) {
    const { showBtn, hideBtn, closeBtn } = getTranscriptButtons();
    if (isTranscriptVisible()) {
      if (hideBtn) hideBtn.click();
      else if (closeBtn) closeBtn.click();
    } else if (showBtn) {
      showBtn.click();
    }
    setTimeout(() => {
      const showing = isTranscriptVisible();
      if (btnUI && btnUI.firstChild) {
        btnUI.firstChild.textContent = showing ? 'playlist_remove' : 'text_ad';
        btnUI.title = showing ? 'Hide transcript' : 'Show transcript';
      }
    }, 50);
  }

  // --- build toolbar (Transcript, ←15, ←5, →5, →15)
  function build() {
    if (!ensureHost()) return false;
    ensureMaterialSymbols();

    if (bar.childElementCount === 0) {
      // Transcript
      btnTranscript = document.createElement('button');
      btnTranscript.className = 'btn';
      btnTranscript.title = 'Show transcript';
      btnTranscript.appendChild(ms('text_ad'));
      btnTranscript.addEventListener('click', () => toggleTranscript(btnTranscript));

      // Jumps
      btnBack15 = document.createElement('button');
      btnBack15.className = 'btn'; btnBack15.title = 'Back 15s';
      btnBack15.appendChild(ms('fast_rewind'));
      btnBack15.addEventListener('click', () => seekBy(-SEEK_15));

      btnBack5 = document.createElement('button');
      btnBack5.className = 'btn'; btnBack5.title = 'Back 5s';
      btnBack5.appendChild(ms('keyboard_double_arrow_left'));
      btnBack5.addEventListener('click', () => seekBy(-SEEK_5));

      btnFwd5 = document.createElement('button');
      btnFwd5.className = 'btn'; btnFwd5.title = 'Forward 5s';
      btnFwd5.appendChild(ms('keyboard_double_arrow_right'));
      btnFwd5.addEventListener('click', () => seekBy(SEEK_5));

      btnFwd15 = document.createElement('button');
      btnFwd15.className = 'btn'; btnFwd15.title = 'Forward 15s';
      btnFwd15.appendChild(ms('fast_forward'));
      btnFwd15.addEventListener('click', () => seekBy(SEEK_15));

      bar.append(btnTranscript, btnBack15, btnBack5, btnFwd5, btnFwd15);
    }

    positionHost();
    updateTranscriptState();
    mounted = true;

    // Observe for state changes only when mounted
    if (!mo) {
      mo = new MutationObserver(() => {
        positionHost();
        updateTranscriptState();
      });
    }
    mo.disconnect();
    mo.observe(document.documentElement, { childList: true, subtree: true });

    return true;
  }

  // --- unmount toolbar when leaving target routes
  function destroy() {
    mounted = false;
    if (mo) mo.disconnect();
    btnTranscript = btnBack15 = btnBack5 = btnFwd5 = btnFwd15 = null;
    if (host && host.parentNode) host.parentNode.removeChild(host);
    host = root = bar = null;
  }

  // --- router: mount/destroy on SPA changes
  function routeTick() {
    if (isTargetRoute()) {
      if (!mounted) build();
    } else {
      if (mounted) destroy();
    }
  }

  // boot + route guard
  function start() {
    if (document.body) { routeTick(); return; }
    const iv = setInterval(() => { if (document.body) { clearInterval(iv); routeTick(); } }, 50);
  }
  start();

  // keep positioned
  window.addEventListener('resize', () => { if (mounted) positionHost(); }, { passive: true });
  window.addEventListener('scroll', () => { if (mounted) positionHost(); }, { passive: true });

  // hook SPA navigations
  ['pushState','replaceState'].forEach(k=>{
    const o = history[k];
    history[k] = function(){ const r = o.apply(this, arguments);
      setTimeout(routeTick, 0);
      return r;
    };
  });
  window.addEventListener('popstate', () => setTimeout(routeTick, 0));

  // last-resort periodic check (in case YouTube uses internal router without history API)
  setInterval(routeTick, 800);
})();
