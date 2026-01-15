// ==UserScript==
// @name         Full Page Video (Video.js UI + Reliable Auto Hide)
// @version      2.4.0
// @description  Chaturbate: Full-page overlay without fullscreen. Maximizes Video.js container preserving UI (volume, quality) and uses script-controlled auto-hide for the control bar. Toggle ☩ + dynamic page support.
// @author       Thiago David
// @match        https://*.chaturbate.com/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/867375
// @downloadURL https://update.greasyfork.org/scripts/562606/Full%20Page%20Video%20%28Videojs%20UI%20%2B%20Reliable%20Auto%20Hide%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562606/Full%20Page%20Video%20%28Videojs%20UI%20%2B%20Reliable%20Auto%20Hide%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STATE = {
    maximized: true,
    videoEl: null,
    playerRoot: null,
    coverEl: null,
    toggleEl: null,
    styleEl: null,
    saved: new WeakMap(),
    resizeTimer: null,
    mo: null,

    hideDelayMs: 2500,    // tempo sem movimento para esconder
    hideTimer: null,
    lastShownAt: 0,
    bound: false,
  };

  function ensureUI() {
    if (!STATE.coverEl) {
      const cover = document.createElement('div');
      cover.id = 'fpv_cover';
      Object.assign(cover.style, {
        position: 'fixed',
        inset: '0',
        background: 'black',
        zIndex: '998',
        display: 'none',
        pointerEvents: 'none',
      });
      document.documentElement.appendChild(cover);
      STATE.coverEl = cover;
    }

    if (!STATE.toggleEl) {
      const t = document.createElement('div');
      t.id = 'fpv_toggle';
      Object.assign(t.style, {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: '100px',
        border: '1px solid pink',
        zIndex: '999999',
        position: 'fixed',
        top: '0',
        right: '0',
        cursor: 'pointer',
        userSelect: 'none',
        width: '30px',
        height: '30px',
        margin: '4px',
        textAlign: 'center',
        lineHeight: '30px',
        fontSize: '30px',
        opacity: '1',
      });
      t.textContent = '☩';
      t.addEventListener('mouseover', () => (t.style.opacity = '0.9'));
      t.addEventListener('mouseout', () => (t.style.opacity = '1'));
      t.addEventListener('click', (e) => {
        if (e.button !== 0) return;
        STATE.maximized = !STATE.maximized;
        applyLayout();
      });
      document.documentElement.appendChild(t);
      STATE.toggleEl = t;
    }

    if (!STATE.styleEl) {
      const s = document.createElement('style');
      s.id = 'fpv_style';
      s.textContent = `
        /* Base: quando maximizado, garantimos que controles existam e sejam empilhados corretamente */
        .fpv-max.video-js .vjs-control-bar {
          visibility: visible !important;
          display: flex !important;
          z-index: 1000002 !important;
        }

        .fpv-max.video-js .vjs-big-play-button {
          z-index: 1000003 !important;
        }

        /* Quando mostramos controles */
        .fpv-max.fpv-show-controls.video-js .vjs-control-bar {
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        /* Quando escondemos controles */
        .fpv-max.fpv-hide-controls.video-js .vjs-control-bar {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Menus e botões só são clicáveis quando está visível */
        .fpv-max.fpv-show-controls.video-js .vjs-volume-panel,
        .fpv-max.fpv-show-controls.video-js .vjs-menu,
        .fpv-max.fpv-show-controls.video-js .vjs-menu-button,
        .fpv-max.fpv-show-controls.video-js .vjs-control,
        .fpv-max.fpv-show-controls.video-js .vjs-button {
          pointer-events: auto !important;
        }

        .fpv-max.fpv-hide-controls.video-js .vjs-volume-panel,
        .fpv-max.fpv-hide-controls.video-js .vjs-menu,
        .fpv-max.fpv-hide-controls.video-js .vjs-menu-button,
        .fpv-max.fpv-hide-controls.video-js .vjs-control,
        .fpv-max.fpv-hide-controls.video-js .vjs-button {
          pointer-events: none !important;
        }
      `;
      document.documentElement.appendChild(s);
      STATE.styleEl = s;
    }
  }

  function pickMainVideo() {
    const vids = Array.from(document.querySelectorAll('video'));
    if (!vids.length) return null;

    const visible = vids.filter(v => (v.clientWidth * v.clientHeight) > 0);
    const list = visible.length ? visible : vids;

    list.sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight));
    return list[0] || null;
  }

  function findPlayerRoot(video) {
    return video.closest('.video-js') || video.closest('[data-vjs-player]') || video.parentElement || video;
  }

  function getVjsTech(video, root) {
    if (video.classList && video.classList.contains('vjs-tech')) return video;
    const tech = root ? root.querySelector('video.vjs-tech') : null;
    return tech || video;
  }

  function saveOriginal(root, techVideo) {
    if (STATE.saved.has(techVideo)) return;

    STATE.saved.set(techVideo, {
      rootStyle: root.getAttribute('style') || '',
      videoStyle: techVideo.getAttribute('style') || '',
      rootClass: root.getAttribute('class') || '',
    });
  }

  function restoreOriginal(root, techVideo) {
    const s = STATE.saved.get(techVideo);
    if (!s) return;

    root.setAttribute('style', s.rootStyle);
    techVideo.setAttribute('style', s.videoStyle);
    root.setAttribute('class', s.rootClass);

    if (STATE.coverEl) STATE.coverEl.style.display = 'none';

    clearHideTimer();
    unbindActivity();
  }

  function clearHideTimer() {
    if (STATE.hideTimer) {
      clearTimeout(STATE.hideTimer);
      STATE.hideTimer = null;
    }
  }

  function showControls() {
    const root = STATE.playerRoot;
    if (!root) return;

    root.classList.add('fpv-show-controls');
    root.classList.remove('fpv-hide-controls');

    STATE.lastShownAt = Date.now();
    clearHideTimer();
    STATE.hideTimer = setTimeout(() => {
      hideControls();
    }, STATE.hideDelayMs);
  }

  function hideControls() {
    const root = STATE.playerRoot;
    if (!root) return;

    root.classList.add('fpv-hide-controls');
    root.classList.remove('fpv-show-controls');
  }

  function onActivity() {
    if (!STATE.maximized) return;
    showControls();
  }

  function bindActivity() {
    if (STATE.bound) return;
    STATE.bound = true;

    // pega mouse em qualquer lugar, porque às vezes o vídeo cobre tudo e o root não recebe evento como esperado
    document.addEventListener('mousemove', onActivity, { passive: true, capture: true });
    document.addEventListener('pointermove', onActivity, { passive: true, capture: true });
    document.addEventListener('touchstart', onActivity, { passive: true, capture: true });
    document.addEventListener('keydown', onActivity, { passive: true, capture: true });
  }

  function unbindActivity() {
    if (!STATE.bound) return;
    STATE.bound = false;

    document.removeEventListener('mousemove', onActivity, { capture: true });
    document.removeEventListener('pointermove', onActivity, { capture: true });
    document.removeEventListener('touchstart', onActivity, { capture: true });
    document.removeEventListener('keydown', onActivity, { capture: true });
  }

  function maximize(root, techVideo) {
    root.classList.add('fpv-max');

    Object.assign(root.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '999',
      background: 'black',
    });

    Object.assign(techVideo.style, {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      background: 'black',
    });

    if (STATE.coverEl) STATE.coverEl.style.display = 'block';

    bindActivity();
    showControls();
  }

  function applyLayout() {
    ensureUI();

    const v = STATE.videoEl;
    const root = STATE.playerRoot;
    if (!v || !root) return;

    const tech = getVjsTech(v, root);

    if (!STATE.maximized) {
      restoreOriginal(root, tech);
      return;
    }

    maximize(root, tech);
  }

  function attach(video) {
    if (!video || video === STATE.videoEl) return;

    const root = findPlayerRoot(video);
    const tech = getVjsTech(video, root);

    STATE.videoEl = video;
    STATE.playerRoot = root;

    saveOriginal(root, tech);

    tech.addEventListener('loadedmetadata', () => {
      if (STATE.maximized) applyLayout();
    }, { passive: true });

    tech.addEventListener('emptied', () => {
      if (STATE.maximized) applyLayout();
    }, { passive: true });

    applyLayout();
    console.log('[FPV] attached');
  }

  function boot() {
    ensureUI();
    attach(pickMainVideo());

    STATE.mo = new MutationObserver(() => {
      const v = pickMainVideo();
      if (v && v !== STATE.videoEl) attach(v);
    });
    STATE.mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('resize', () => {
      clearTimeout(STATE.resizeTimer);
      STATE.resizeTimer = setTimeout(() => applyLayout(), 120);
    }, true);

    console.log('[FPV] boot ok');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
