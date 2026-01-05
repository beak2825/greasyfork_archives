// ==UserScript==
// @name         X/Twitter - Hide videos initially
// @namespace    https://tampermonkey.net/
// @version      0.2
// @description  Removes video players and replaces with a "Show video" button.
// @match        https://x.com/*
// @match        https://twitter.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561434/XTwitter%20-%20Hide%20videos%20initially.user.js
// @updateURL https://update.greasyfork.org/scripts/561434/XTwitter%20-%20Hide%20videos%20initially.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = false;

  // Keep the selectors you already confirmed work
  const VIDEO_PLAYER_SEL = '[data-testid="videoPlayer"]';
  const VIDEO_COMPONENT_SEL = '[data-testid="videoComponent"]';

  const MARK_ATTR = 'data-tm-video-removed';
  const REVEALED_ATTR = 'data-tm-video-revealed';

  // Store original nodes per container (so restore reattaches real nodes)
  const store = new WeakMap(); // videoPlayer -> { nodes: Node[] }

  function log(...a) { if (DEBUG) console.log('[TM-RMV]', ...a); }

  // --- CSS for placeholder ---
  const style = document.createElement('style');
  style.textContent = `
    .tmv3-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: rgba(0,0,0,0.12);
      min-height: 120px;
      padding: 14px;
    }
    .tmv3-btn {
      appearance: none;
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 999px;
      padding: 9px 14px;
      background: rgba(0,0,0,0.35);
      color: rgb(231, 233, 234);
      cursor: pointer;
      font: 700 13px/1 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }
    .tmv3-btn:hover { background: rgba(0,0,0,0.5); }
  `;
  document.head.appendChild(style);

  function pauseAndFreezeVideosInside(el) {
    const vids = el.querySelectorAll?.('video');
    if (!vids) return;
    vids.forEach(v => {
      try { v.pause(); } catch {}
      try { v.currentTime = 0; } catch {}
      try { v.autoplay = false; } catch {}
      try { v.removeAttribute('autoplay'); } catch {}
      try { v.muted = true; } catch {}
      try { v.preload = 'none'; } catch {}
    });
  }

  function buildPlaceholder(onShow) {
    const wrap = document.createElement('div');
    wrap.className = 'tmv3-placeholder';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tmv3-btn';
    btn.textContent = 'Show video';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onShow(btn);
    }, true);

    wrap.appendChild(btn);
    return wrap;
  }

  function restore(videoPlayer, clickedButtonEl) {
    const saved = store.get(videoPlayer);
    if (!saved || !saved.nodes?.length) {
      log('No saved nodes to restore');
      return;
    }

    // Remove placeholder
    videoPlayer.innerHTML = '';

    // Reattach original nodes
    for (const n of saved.nodes) {
      videoPlayer.appendChild(n);
    }

    videoPlayer.setAttribute(REVEALED_ATTR, '1');
    videoPlayer.setAttribute(MARK_ATTR, '0'); // allow future scans, but revealed will skip re-removal

    // Try to make the video actually load/play using the user click gesture.
    // (If X controls playback, this won’t hurt; if it’s a plain <video>, it helps.)
    const v = videoPlayer.querySelector('video');
    if (v) {
      try { v.preload = 'metadata'; } catch {}
      try { v.muted = false; } catch {}
      try { v.load(); } catch {}

      // Attempt play only if user clicked (we are in click handler)
      // If it fails due to policy, it will just remain paused.
      v.play?.().catch(() => {});
    }

    log('Restored');
  }

  function removeVideoPlayer(videoPlayer) {
    if (!(videoPlayer instanceof HTMLElement)) return;

    // If user chose to reveal this one, don’t remove again.
    if (videoPlayer.getAttribute(REVEALED_ATTR) === '1') return;

    // Already removed?
    if (videoPlayer.getAttribute(MARK_ATTR) === '1') return;

    // Only act if it really is a video area
    const hasVideoComponent = !!videoPlayer.querySelector(VIDEO_COMPONENT_SEL);
    const hasVideoTag = !!videoPlayer.querySelector('video');
    if (!hasVideoComponent && !hasVideoTag) return;

    // Stop playback before detaching
    pauseAndFreezeVideosInside(videoPlayer);

    // Detach and store *real nodes*
    const nodes = [];
    while (videoPlayer.firstChild) {
      nodes.push(videoPlayer.removeChild(videoPlayer.firstChild));
    }
    store.set(videoPlayer, { nodes });

    // Insert placeholder
    videoPlayer.appendChild(buildPlaceholder(() => restore(videoPlayer)));
    videoPlayer.setAttribute(MARK_ATTR, '1');

    log('Removed video player');
  }

  // Extra “extreme” safety: if something plays before we remove it, pause it.
  function installPlayInterceptor() {
    document.addEventListener('play', (e) => {
      const v = e.target;
      if (!(v instanceof HTMLVideoElement)) return;

      const vp = v.closest?.(VIDEO_PLAYER_SEL);
      if (!vp) return;

      // If not revealed, block it.
      if (vp.getAttribute(REVEALED_ATTR) === '1') return;

      try { v.pause(); } catch {}
      try { v.currentTime = 0; } catch {}
    }, true);
  }

  function scan(root = document) {
    const players = root.querySelectorAll?.(VIDEO_PLAYER_SEL);
    if (!players) return;
    players.forEach(removeVideoPlayer);
  }

  function observe() {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;

          if (node.matches?.(VIDEO_PLAYER_SEL)) {
            removeVideoPlayer(node);
          } else if (node.querySelector?.(VIDEO_PLAYER_SEL)) {
            scan(node);
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // Boot
  installPlayInterceptor();
  scan(document);
  observe();
})();
