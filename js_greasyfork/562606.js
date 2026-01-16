// ==UserScript==
// @name         Chaturbate Full Page Video (Video.js UI + Auto Hide)
// @version      2.4.3
// @description  Chaturbate: Full-page overlay (no browser fullscreen) for room pages. Preserves Video.js UI (volume/quality) and uses reliable auto-hide. Toggle ☩ + dynamic page support. Avoids black screens on listing pages.
// @author       You
// @match        https://*.chaturbate.com/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/867375
// @downloadURL https://update.greasyfork.org/scripts/562606/Chaturbate%20Full%20Page%20Video%20%28Videojs%20UI%20%2B%20Auto%20Hide%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562606/Chaturbate%20Full%20Page%20Video%20%28Videojs%20UI%20%2B%20Auto%20Hide%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var STATE = {
    maximized: true,
    videoEl: null,
    playerRoot: null,
    coverEl: null,
    toggleEl: null,
    styleEl: null,
    saved: (typeof WeakMap !== 'undefined') ? new WeakMap() : null,
    resizeTimer: null,
    mo: null,
    hideDelayMs: 2500,
    hideTimer: null,
    bound: false,
    lastUrl: location.href
  };

  // Blocked routes (avoid false positives)
  var BLOCKED = {
    'followed-cams': true, 'tags': true, 'accounts': true, 'support': true, 'billing': true,
    'apps': true, 'api': true, 'privacy': true, 'terms': true, 'studio': true, 'contest': true,
    'search': true, 'affiliates': true, 'developers': true, 'login': true, 'logout': true,
    'signup': true, 'register': true, 'forgot': true, 'tipping': true, 'gifts': true,
    'events': true, 'campaigns': true
  };

  function isRoomPath(pathname) {
    var p = (pathname || '/').replace(/\/+$/, '');
    if (!p) p = '/';
    if (p === '/') return false;

    var parts = p.split('/');
    var segs = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) segs.push(parts[i]);
    }
    if (segs.length !== 1) return false;

    var seg = (segs[0] || '').toLowerCase();
    if (BLOCKED[seg]) return false;

    return true;
  }

  function ensureUI() {
    if (!STATE.coverEl) {
      var cover = document.createElement('div');
      cover.id = 'fpv_cover';
      cover.style.position = 'fixed';
      cover.style.top = '0';
      cover.style.left = '0';
      cover.style.right = '0';
      cover.style.bottom = '0';
      cover.style.background = 'black';
      cover.style.zIndex = '998';
      cover.style.display = 'none';
      cover.style.pointerEvents = 'none';
      document.documentElement.appendChild(cover);
      STATE.coverEl = cover;
    }

    if (!STATE.toggleEl) {
      var t = document.createElement('div');
      t.id = 'fpv_toggle';
      t.style.color = 'black';
      t.style.backgroundColor = 'white';
      t.style.borderRadius = '100px';
      t.style.border = '1px solid pink';
      t.style.zIndex = '999999';
      t.style.position = 'fixed';
      t.style.top = '0';
      t.style.right = '0';
      t.style.cursor = 'pointer';
      t.style.userSelect = 'none';
      t.style.width = '30px';
      t.style.height = '30px';
      t.style.margin = '4px';
      t.style.textAlign = 'center';
      t.style.lineHeight = '30px';
      t.style.fontSize = '30px';
      t.style.opacity = '1';
      t.style.display = 'none'; // only show on room pages
      t.textContent = '☩';

      t.addEventListener('mouseover', function () { t.style.opacity = '0.9'; }, false);
      t.addEventListener('mouseout', function () { t.style.opacity = '1'; }, false);
      t.addEventListener('click', function (e) {
        if (e.button !== 0) return;
        STATE.maximized = !STATE.maximized;
        applyLayout();
      }, false);

      document.documentElement.appendChild(t);
      STATE.toggleEl = t;
    }

    if (!STATE.styleEl) {
      var s = document.createElement('style');
      s.id = 'fpv_style';
      s.textContent = [
        '.fpv-max.video-js .vjs-control-bar {',
        '  visibility: visible !important;',
        '  display: flex !important;',
        '  z-index: 1000002 !important;',
        '}',
        '.fpv-max.video-js .vjs-big-play-button {',
        '  z-index: 1000003 !important;',
        '}',
        '.fpv-max.fpv-show-controls.video-js .vjs-control-bar {',
        '  opacity: 1 !important;',
        '  pointer-events: auto !important;',
        '}',
        '.fpv-max.fpv-hide-controls.video-js .vjs-control-bar {',
        '  opacity: 0 !important;',
        '  pointer-events: none !important;',
        '}',
        '.fpv-max.fpv-show-controls.video-js .vjs-volume-panel,',
        '.fpv-max.fpv-show-controls.video-js .vjs-menu,',
        '.fpv-max.fpv-show-controls.video-js .vjs-menu-button,',
        '.fpv-max.fpv-show-controls.video-js .vjs-control,',
        '.fpv-max.fpv-show-controls.video-js .vjs-button {',
        '  pointer-events: auto !important;',
        '}',
        '.fpv-max.fpv-hide-controls.video-js .vjs-volume-panel,',
        '.fpv-max.fpv-hide-controls.video-js .vjs-menu,',
        '.fpv-max.fpv-hide-controls.video-js .vjs-menu-button,',
        '.fpv-max.fpv-hide-controls.video-js .vjs-control,',
        '.fpv-max.fpv-hide-controls.video-js .vjs-button {',
        '  pointer-events: none !important;',
        '}'
      ].join('\n');
      document.documentElement.appendChild(s);
      STATE.styleEl = s;
    }
  }

  function clearHideTimer() {
    if (STATE.hideTimer) {
      clearTimeout(STATE.hideTimer);
      STATE.hideTimer = null;
    }
  }

  function showControls() {
    var root = STATE.playerRoot;
    if (!root) return;

    root.classList.add('fpv-show-controls');
    root.classList.remove('fpv-hide-controls');

    clearHideTimer();
    STATE.hideTimer = setTimeout(function () {
      hideControls();
    }, STATE.hideDelayMs);
  }

  function hideControls() {
    var root = STATE.playerRoot;
    if (!root) return;

    root.classList.add('fpv-hide-controls');
    root.classList.remove('fpv-show-controls');
  }

  function onActivity() {
    if (!STATE.maximized) return;
    if (!isRoomPath(location.pathname)) return;
    showControls();
  }

  function bindActivity() {
    if (STATE.bound) return;
    STATE.bound = true;

    // UseCapture boolean (compat)
    document.addEventListener('mousemove', onActivity, true);
    document.addEventListener('pointermove', onActivity, true);
    document.addEventListener('touchstart', onActivity, true);
    document.addEventListener('keydown', onActivity, true);
  }

  function unbindActivity() {
    if (!STATE.bound) return;
    STATE.bound = false;

    document.removeEventListener('mousemove', onActivity, true);
    document.removeEventListener('pointermove', onActivity, true);
    document.removeEventListener('touchstart', onActivity, true);
    document.removeEventListener('keydown', onActivity, true);
  }

  function pickMainVideoJsRootRoomOnly() {
    if (!isRoomPath(location.pathname)) return null;

    var roots = document.querySelectorAll('.video-js');
    if (!roots || !roots.length) return null;

    var candidates = [];
    for (var i = 0; i < roots.length; i++) {
      var r = roots[i];
      if (r.querySelector('.vjs-control-bar') && r.querySelector('video.vjs-tech')) {
        candidates.push(r);
      }
    }
    if (!candidates.length) return null;

    candidates.sort(function (a, b) {
      var ar = a.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      return (br.width * br.height) - (ar.width * ar.height);
    });

    return candidates[0] || null;
  }

  function getTechVideo(root) {
    if (!root) return null;
    return root.querySelector('video.vjs-tech') || root.querySelector('video') || null;
  }

  function saveOriginal(root, techVideo) {
    if (!root || !techVideo) return;
    if (!STATE.saved) return;
    if (STATE.saved.has(techVideo)) return;

    STATE.saved.set(techVideo, {
      rootStyle: root.getAttribute('style') || '',
      videoStyle: techVideo.getAttribute('style') || '',
      rootClass: root.getAttribute('class') || ''
    });
  }

  function restoreIfSaved(root, techVideo) {
    if (!STATE.saved) return;
    var s = techVideo ? STATE.saved.get(techVideo) : null;
    if (root && techVideo && s) {
      root.setAttribute('style', s.rootStyle);
      techVideo.setAttribute('style', s.videoStyle);
      root.setAttribute('class', s.rootClass);
    }
  }

  function hardCleanup() {
    clearHideTimer();
    unbindActivity();

    if (STATE.coverEl) STATE.coverEl.style.display = 'none';
    if (STATE.toggleEl) STATE.toggleEl.style.display = 'none';

    if (STATE.playerRoot && STATE.videoEl && STATE.playerRoot.isConnected && STATE.videoEl.isConnected) {
      restoreIfSaved(STATE.playerRoot, STATE.videoEl);
    }

    STATE.videoEl = null;
    STATE.playerRoot = null;
  }

  function maximize(root, techVideo) {
    root.classList.add('fpv-max');

    root.style.position = 'fixed';
    root.style.top = '0';
    root.style.left = '0';
    root.style.width = '100vw';
    root.style.height = '100vh';
    root.style.zIndex = '999';
    root.style.background = 'black';

    techVideo.style.width = '100%';
    techVideo.style.height = '100%';
    techVideo.style.objectFit = 'contain';
    techVideo.style.background = 'black';

    if (STATE.coverEl) STATE.coverEl.style.display = 'block';
    if (STATE.toggleEl) STATE.toggleEl.style.display = 'block';

    bindActivity();
    showControls();
  }

  function applyLayout() {
    ensureUI();

    if (!isRoomPath(location.pathname)) {
      hardCleanup();
      return;
    }

    if (STATE.toggleEl) STATE.toggleEl.style.display = 'block';

    var rootNow = pickMainVideoJsRootRoomOnly();
    if (!rootNow) {
      if (STATE.coverEl) STATE.coverEl.style.display = 'none';
      return;
    }

    var techNow = getTechVideo(rootNow);
    if (!techNow) {
      if (STATE.coverEl) STATE.coverEl.style.display = 'none';
      return;
    }

    STATE.playerRoot = rootNow;
    STATE.videoEl = techNow;
    saveOriginal(rootNow, techNow);

    if (!STATE.maximized) {
      restoreIfSaved(rootNow, techNow);
      if (STATE.coverEl) STATE.coverEl.style.display = 'none';
      clearHideTimer();
      unbindActivity();
      return;
    }

    maximize(rootNow, techNow);
  }

  function boot() {
    ensureUI();
    applyLayout();

    function checkUrl() {
      if (STATE.lastUrl !== location.href) {
        STATE.lastUrl = location.href;
        applyLayout();
      }
    }

    STATE.mo = new MutationObserver(function () {
      checkUrl();
      applyLayout();
    });
    STATE.mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('resize', function () {
      clearTimeout(STATE.resizeTimer);
      STATE.resizeTimer = setTimeout(function () { applyLayout(); }, 120);
    }, true);

    window.addEventListener('popstate', applyLayout, true);
    window.addEventListener('hashchange', applyLayout, true);

    setInterval(checkUrl, 500);

    console.log('[FPV] boot ok');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, false);
  } else {
    boot();
  }
})();
