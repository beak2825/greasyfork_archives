// ==UserScript==
// @name         Actually Working YouTube Miniplayer
// @author       Torkelicious
// @version      1.0
// @license      GPL-3.0-or-later
// @description  Miniplayer when you scroll down under the video. (configurable!!!)
// @icon         https://www.youtube.com/favicon.ico
// @match        *://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1403155
// @downloadURL https://update.greasyfork.org/scripts/554522/Actually%20Working%20YouTube%20Miniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/554522/Actually%20Working%20YouTube%20Miniplayer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //  these settings are user-configurable
  const DEFAULTS = {
    pinnedVideoSize: '480x270',          // supports 'WIDTHxHEIGHT' or 'WIDTHxauto'
    pinnedVideoPosition: 'Bottom right', // one of the nine presets below
  };

  // Persisted settings
  const settings = {
    pinnedVideoSize: (() => {
      try {
        return GM_getValue('pinnedVideoSize', DEFAULTS.pinnedVideoSize);
      } catch (e) {
        console.warn('Failed to load pinnedVideoSize:', e);
        return DEFAULTS.pinnedVideoSize;
      }
    })(),
    pinnedVideoPosition: (() => {
      try {
        return GM_getValue('pinnedVideoPosition', DEFAULTS.pinnedVideoPosition);
      } catch (e) {
        console.warn('Failed to load pinnedVideoPosition:', e);
        return DEFAULTS.pinnedVideoPosition;
      }
    })(),
  };

  // Presets for the dropdowns
  const SIZE_PRESETS = [
    '320x180','426x240','480x270','640x360','854x480','960x540','1280x720',
    '480xauto','640xauto','854xauto'
  ];
  const POSITION_PRESETS = [
    'Top left','Top center','Top right',
    'Center left','Center','Center right',
    'Bottom left','Bottom center','Bottom right'
  ];

  // ID for config UI
  const CONFIG_OVERLAY_ID = 'yt-miniplayer-config-overlay';
  const CONFIG_STYLE_ID = 'yt-miniplayer-config-style';

  // DOM selectors as constants
  const SELECTORS = {
    moviePlayer: '#movie_player',
    below: '#below',
    watchFlexy: 'ytd-watch-flexy',
    video: '#movie_player video',
  };

  // State
  let isReady = false;
  let styleEl = null;
  let sentinelObserver = null;
  let flexyAttrObserver = null;
  let resizeListenerAttached = false;

  // Sticky only buttons
  let stickyCloseBtn = null;
  let stickyTopBtn = null;

  // ---------------- Config UI ----------------
  function ensureConfigCss() {
    if (document.getElementById(CONFIG_STYLE_ID)) return;
    GM_addStyle(`
#${CONFIG_OVERLAY_ID} {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
}
#${CONFIG_OVERLAY_ID} .panel {
  background: #1f1f1f; color: #fff; min-width: 320px; max-width: 90vw;
  border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  padding: 16px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans";
}
#${CONFIG_OVERLAY_ID} .panel h2 { margin: 0 0 12px 0; font-size: 16px; font-weight: 600; }
#${CONFIG_OVERLAY_ID} .row { margin: 10px 0; }
#${CONFIG_OVERLAY_ID} label { display: block; margin-bottom: 6px; font-size: 13px; color: #ddd; }
#${CONFIG_OVERLAY_ID} select {
  width: 100%; padding: 6px 8px; border-radius: 8px; border: 1px solid #444; background: #2a2a2a; color: #fff;
}
#${CONFIG_OVERLAY_ID} .buttons { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
#${CONFIG_OVERLAY_ID} button {
  appearance: none; border: 1px solid #555; background: #2b2b2b; color: #fff; padding: 6px 12px; border-radius: 8px; cursor: pointer;
}
#${CONFIG_OVERLAY_ID} button.primary { background: #3d6ae0; border-color: #2f55b5; }
    `).id = CONFIG_STYLE_ID;
  }

  function createEl(tag, props) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (k === 'text') el.textContent = v;
        else if (k === 'children' && Array.isArray(v)) v.forEach(c => el.appendChild(c));
        else if (k === 'on') {
          for (const [evt, handler] of Object.entries(v)) el.addEventListener(evt, handler);
        } else el.setAttribute(k, v);
      }
    }
    return el;
  }
  function optionFor(value, label) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label ?? value;
    return o;
  }

  function showConfigDialog() {
    ensureConfigCss();
    const old = document.getElementById(CONFIG_OVERLAY_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    const overlay = createEl('div', { id: CONFIG_OVERLAY_ID });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const panel = createEl('div', { class: 'panel' });
    const title = createEl('h2', { text: 'Miniplayer Settings' });

    // Size row
    const sizeRow = createEl('div', { class: 'row' });
    const sizeLabel = createEl('label', { text: 'Pinned size' });
    const sizeSelect = createEl('select');
    if (!SIZE_PRESETS.includes(settings.pinnedVideoSize)) {
      sizeSelect.appendChild(optionFor(settings.pinnedVideoSize, `${settings.pinnedVideoSize} (current)`));
    }
    SIZE_PRESETS.forEach(s => sizeSelect.appendChild(optionFor(s)));
    sizeSelect.value = settings.pinnedVideoSize;

    // Position row
    const posRow = createEl('div', { class: 'row' });
    const posLabel = createEl('label', { text: 'Pinned position' });
    const posSelect = createEl('select');
    if (!POSITION_PRESETS.includes(settings.pinnedVideoPosition)) {
      posSelect.appendChild(optionFor(settings.pinnedVideoPosition, `${settings.pinnedVideoPosition} (current)`));
    }
    POSITION_PRESETS.forEach(p => posSelect.appendChild(optionFor(p)));
    posSelect.value = settings.pinnedVideoPosition;

    // Buttons
    const buttons = createEl('div', { class: 'buttons' });
    const cancelBtn = createEl('button', { text: 'Cancel' });
    cancelBtn.addEventListener('click', () => overlay.remove());
    const saveBtn = createEl('button', { text: 'Save', class: 'primary' });
    saveBtn.addEventListener('click', () => {
      const newSize = sizeSelect.value;
      const newPos = posSelect.value;

      if (newSize !== settings.pinnedVideoSize) {
        settings.pinnedVideoSize = newSize;
        try {
          GM_setValue('pinnedVideoSize', newSize);
        } catch (e) {
          console.error('Failed to save pinnedVideoSize:', e);
        }
      }
      if (newPos !== settings.pinnedVideoPosition) {
        settings.pinnedVideoPosition = newPos;
        try {
          GM_setValue('pinnedVideoPosition', newPos);
        } catch (e) {
          console.error('Failed to save pinnedVideoPosition:', e);
        }
      }

      rebuildStickyStyle();
      scheduleResize();
      overlay.remove();
    });

    buttons.appendChild(cancelBtn);
    buttons.appendChild(saveBtn);

    sizeRow.appendChild(sizeLabel);
    sizeRow.appendChild(sizeSelect);
    posRow.appendChild(posLabel);
    posRow.appendChild(posSelect);

    panel.appendChild(title);
    panel.appendChild(sizeRow);
    panel.appendChild(posRow);
    panel.appendChild(buttons);

    overlay.appendChild(panel);
    document.documentElement.appendChild(overlay);
    sizeSelect.focus();
  }

  GM_registerMenuCommand('Configure Miniplayer', showConfigDialog);

  // ---------------- Core ----------------
  function parseSizeTokens(text) {
    const m = (text || '').match(/\d+|auto/gi);
    return m || ['480', '270'];
  }
  function getCurrentVideoAspect() {
    const v = document.querySelector(SELECTORS.video);
    if (v && v.videoWidth && v.videoHeight) return v.videoWidth / v.videoHeight;
    const p = document.getElementById('movie_player');
    if (p && p.clientWidth && p.clientHeight) return p.clientWidth / p.clientHeight;
    return 16 / 9;
  }
  function computePinnedSize() {
    const tokens = parseSizeTokens(settings.pinnedVideoSize);
    const wantedW = tokens[0] && tokens[0] !== 'auto' ? parseInt(tokens[0], 10) : 480;
    const wantAutoH = (tokens[1] || '').toLowerCase() === 'auto';
    const w = Number.isFinite(wantedW) ? wantedW : 480;
    let h;
    if (wantAutoH) {
      const ar = getCurrentVideoAspect();
      h = Math.round(w / (ar || (16 / 9)));
    } else {
      const wantedH = tokens[1] && tokens[1] !== 'auto' ? parseInt(tokens[1], 10) : 270;
      h = Number.isFinite(wantedH) ? wantedH : 270;
    }
    return [w, h];
  }

  // Debounced resize dispatch to avoid excessive events !!!
  let resizeRafId = null;
  function scheduleResize() {
    if (resizeRafId) return;
    resizeRafId = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      resizeRafId = null;
    });
  }

  function rebuildStickyStyle() {
    const [w, h] = computePinnedSize();
    const pos = (settings.pinnedVideoPosition || DEFAULTS.pinnedVideoPosition).toLowerCase();

    const cssProp = { top: 'initial', bottom: 'initial', right: 'initial', left: 'initial', transform: 'initial' };

    // i should make this configurable maybe?
    const GAP = '10px';

    // Vertical
    if (pos.startsWith('top')) cssProp.top = GAP;
    else if (pos.startsWith('center')) {
      cssProp.top = '50vh';
      cssProp.transform = 'translateY(-50%)';
    } else cssProp.bottom = GAP; // default bottom

    // Horizontal
    if (pos.endsWith('left')) cssProp.left = GAP;
    else if (pos.endsWith('center')) {
      cssProp.left = '50vw';
      cssProp.transform = (cssProp.transform === 'initial' ? '' : cssProp.transform + ' ') + 'translateX(-50%)';
    } else cssProp.right = GAP; // default right

    const css = `
/* Sticky player container positioning (size/pos only) - high specificity */
.yttw-sticky-player.yttw-sticky-player ytd-watch-flexy #player-container.ytd-watch-flexy {
  position: fixed !important;
  width: ${w}px !important;
  height: ${h}px !important;
  top: ${cssProp.top} !important;
  bottom: ${cssProp.bottom} !important;
  right: ${cssProp.right} !important;
  left: ${cssProp.left} !important;
  transform: ${cssProp.transform} !important;
  z-index: 9999 !important;
  overflow: hidden !important;
}

/* Fill the sticky box and avoid cropping */
.yttw-sticky-player.yttw-sticky-player #movie_player,
.yttw-sticky-player.yttw-sticky-player .html5-video-container {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
}
.yttw-sticky-player.yttw-sticky-player #movie_player video {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  object-fit: contain !important;
}

/* Sticky-only buttons; minimal styles */
.yttw-sticky-player ytd-watch-flexy #movie_player:hover .yttw-sticky-player-button {
  opacity: 1;
  visibility: visible;
}
.yttw-sticky-player-button {
  display: flex !important;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  position: absolute;
  cursor: pointer;
  top: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  z-index: 60;
  background-color: rgba(0, 0, 0, 0.4);
  transition: opacity .2s, visibility .2s;
  border: none;
  padding: 0;
}
`;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'yt-miniplayer-sticky-style';
      document.documentElement.appendChild(styleEl);
    }
    styleEl.textContent = css;
  }

  // Buttons when sticky is active
  function createSvgIcon(paths) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'white');
    svg.style.width = '22px';
    svg.style.height = '22px';
    paths.forEach(d => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d);
      svg.appendChild(p);
    });
    return svg;
  }
  function ensureStickyButtons() {
    if (stickyCloseBtn && stickyTopBtn) return;
    const moviePlayer = document.getElementById('movie_player');
    if (!moviePlayer) return;

    stickyCloseBtn = document.createElement('button');
    stickyCloseBtn.className = 'yttw-sticky-player-button';
    stickyCloseBtn.title = 'Close Miniplayer';
    stickyCloseBtn.setAttribute('aria-label', 'Close Miniplayer');
    stickyCloseBtn.setAttribute('role', 'button');
    stickyCloseBtn.style.left = '8px';
    stickyCloseBtn.appendChild(createSvgIcon([
      'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
    ]));
    stickyCloseBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      document.body.classList.remove('yttw-sticky-player');
      removeStickyButtons();
    });

    stickyTopBtn = document.createElement('button');
    stickyTopBtn.className = 'yttw-sticky-player-button';
    stickyTopBtn.title = 'Scroll to Top';
    stickyTopBtn.setAttribute('aria-label', 'Scroll to Top');
    stickyTopBtn.setAttribute('role', 'button');
    stickyTopBtn.style.right = '8px';
    stickyTopBtn.appendChild(createSvgIcon([
      'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z'
    ]));
    stickyTopBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    moviePlayer.append(stickyCloseBtn, stickyTopBtn);
  }
  function removeStickyButtons() {
    if (stickyCloseBtn) stickyCloseBtn.remove();
    if (stickyTopBtn) stickyTopBtn.remove();
    stickyCloseBtn = stickyTopBtn = null;
  }

  // Under video check using #below
  function toggleStickyPlayer(entries) {
    if (!isReady) return;

    const belowElement = document.getElementById('below');
    if (!belowElement) return;

    // Adjust sticky box in case aspect changed just before toggling
    rebuildStickyStyle();

    const belowTopAbs = belowElement.getBoundingClientRect().top + window.scrollY;

    if (entries[0].isIntersecting) {
      document.body.classList.remove('yttw-sticky-player');
      removeStickyButtons();
    } else {
      const scrolledUnderVideo = window.scrollY >= (belowTopAbs - 1);
      if (scrolledUnderVideo) {
        document.body.classList.add('yttw-sticky-player');
        ensureStickyButtons();
      } else {
        document.body.classList.remove('yttw-sticky-player');
        removeStickyButtons();
      }
    }

    scheduleResize();
  }

  function setupElements() {
    const moviePlayer = document.getElementById('movie_player');
    const belowElement = document.getElementById('below');
    if (!moviePlayer || !belowElement) return;

    rebuildStickyStyle();

    // Sentinel at the boundary between player and below
    const intersectionTrigger = document.createElement('div');
    intersectionTrigger.id = 'miniplayer-intersection-trigger';
    intersectionTrigger.style.position = 'absolute';
    intersectionTrigger.style.top = '0';
    intersectionTrigger.style.height = '1px';
    if (!belowElement.style.position || belowElement.style.position === 'static') {
      belowElement.style.position = 'relative';
    }
    belowElement.appendChild(intersectionTrigger);

    // Observe the sentinel
    sentinelObserver = new IntersectionObserver(toggleStickyPlayer);
    sentinelObserver.observe(intersectionTrigger);

    // Observe ytd-watch-flexy for mode changes (theater/miniplayer/fullscreen)
    const flexy = document.querySelector(SELECTORS.watchFlexy);
    if (flexy) {
      flexyAttrObserver = new MutationObserver(() => {
        const wasSticky = document.body.classList.contains('yttw-sticky-player');
        // Hide sticky during mode transition
        document.body.classList.remove('yttw-sticky-player');
        removeStickyButtons();

        rebuildStickyStyle();
        window.requestAnimationFrame(() => {
          scheduleResize();
          const belowTopAbs = document.getElementById('below')?.getBoundingClientRect().top + window.scrollY || Infinity;
          if (wasSticky && window.scrollY >= (belowTopAbs - 1)) {
            document.body.classList.add('yttw-sticky-player');
            ensureStickyButtons();
            window.requestAnimationFrame(() => scheduleResize());
          }
        });
      });
      flexyAttrObserver.observe(flexy, { attributes: true, attributeFilter: ['theater', 'fullscreen', 'miniplayer'] });
    }

    // React to fullscreen changes
    document.addEventListener('fullscreenchange', () => {
      const wasSticky = document.body.classList.contains('yttw-sticky-player');
      if (document.fullscreenElement) {
        document.body.classList.remove('yttw-sticky-player');
        removeStickyButtons();
      }
      rebuildStickyStyle();
      scheduleResize();
      if (!document.fullscreenElement && wasSticky) {
        document.body.classList.add('yttw-sticky-player');
        ensureStickyButtons();
        window.requestAnimationFrame(() => scheduleResize());
      }
    });

    // Recompute sticky size on viewport changes & prevent duplicate listeners)
    if (!resizeListenerAttached) {
      window.addEventListener('resize', rebuildStickyStyle);
      resizeListenerAttached = true;
    }

    document.body.classList.add('miniplayer-userscript-loaded');
    isReady = true;
  }

  function initializeMiniplayer() {
    // Only run on watch pages
    if (!window.location.pathname.startsWith('/watch')) {
      isReady = false;
      return;
    }
    if (document.body.classList.contains('miniplayer-userscript-loaded')) {
      isReady = true;
      return;
    }

    // Check if elements already exist before observing
    if (document.getElementById('movie_player') && document.getElementById('below')) {
      setupElements();
      return;
    }

    // Wait for player and below to exist
    const readyObs = new MutationObserver((mutations, obs) => {
      if (document.getElementById('movie_player') && document.getElementById('below')) {
        setupElements();
        obs.disconnect();
      }
    });
    readyObs.observe(document.body, { childList: true, subtree: true });
  }

  function cleanup() {
    document.body.classList.remove('miniplayer-userscript-loaded', 'yttw-sticky-player');
    isReady = false;

    if (sentinelObserver) { sentinelObserver.disconnect(); sentinelObserver = null; }
    if (flexyAttrObserver) { flexyAttrObserver.disconnect(); flexyAttrObserver = null; }

    const oldTrigger = document.getElementById('miniplayer-intersection-trigger');
    if (oldTrigger) oldTrigger.remove();

    if (styleEl && styleEl.parentNode) {
      styleEl.parentNode.removeChild(styleEl);
      styleEl = null;
    }

    if (resizeListenerAttached) {
      window.removeEventListener('resize', rebuildStickyStyle);
      resizeListenerAttached = false;
    }

    removeStickyButtons();

    // Remove config overlay if open during navigation
    const overlay = document.getElementById(CONFIG_OVERLAY_ID);
    if (overlay) overlay.remove();
  }

  // SPA navigation
  document.addEventListener('yt-navigate-finish', () => {
    cleanup();
    initializeMiniplayer();
  });

  // Initialize on load
  initializeMiniplayer();

})();