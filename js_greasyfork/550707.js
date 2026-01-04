// ==UserScript==
// @name         Twitch Low-Latency Catch-Up
// @version      1.1
// @description  Enjoy a smoother, truly live Twitch experience! This script intelligently manages playback speed to eliminate frustrating lag, keeping you in the moment. Comes with a simple on-screen menu to customize your settings.
// @author       Mattskiiau
// @license      GNU GPLv3
// @match        https://www.twitch.tv/*
// @match        https://player.twitch.tv/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1519406
// @downloadURL https://update.greasyfork.org/scripts/550707/Twitch%20Low-Latency%20Catch-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/550707/Twitch%20Low-Latency%20Catch-Up.meta.js
// ==/UserScript==
(function () {
  'use strict';

  const DEFAULTS = {
    targetLag: 2.5,
    maxBoost: 1.03,
    enabled: true,
    checkMs: 100,
    rateEpsilon: 0.003,
    bufferSafety: 1.5,
    rateStepUp: 0.05,
    rateStepDown: 0.05,
    rateSmoothFactor: 0.55,
    rateMinStep: 0.01,
    normalizeLag: 1.25, // This will be auto-calculated
  };

  let SETTINGS = { ...DEFAULTS };

  const LS_KEYS = ['llc-v3.0-settings', 'llc-v2.0-settings', 'llc-v1.9-settings', 'llc-v1.8-settings', 'llc-v1.7-settings', 'llc-v1.6-settings', 'llc-v1.5-settings', 'llc-v1.4-settings','llc-v1.3-settings','llc-v1.2-settings','llc-v1.1'];
  const UI_KEYS = ['llc-v3.0-ui', 'llc-v2.0-ui', 'llc-v1.9-ui', 'llc-v1.8-ui', 'llc-v1.7-ui', 'llc-v1.6-ui', 'llc-v1.5-ui', 'llc-v1.4-ui','llc-v1.3-ui','llc-v1.2-ui'];
  const PANEL_ID = 'llc30';
  const VIDEO_SCAN_INTERVAL = 2000;

  let activeVideo = null;
  let cachedVideos = [];
  let lastVideoScan = 0;
  const panelRefs = { root: null, body: null, lag: null, rate: null, minBtn: null };
  let rateEstimate = 1;

  function resetPanelRefs() {
    panelRefs.root = panelRefs.body = panelRefs.lag = panelRefs.rate = panelRefs.minBtn = null;
  }

  function load() {
    let loadedSettings = null;
    for (const k of LS_KEYS) {
      try {
        const s = JSON.parse(localStorage.getItem(k) || 'null');
        if (s && typeof s === 'object') {
          loadedSettings = s;
          break;
        }
      } catch (_) {}
    }
    if (loadedSettings) {
        SETTINGS = Object.assign({}, DEFAULTS, loadedSettings);
    }
  }

  function save() {
    try {
      localStorage.setItem(LS_KEYS[0], JSON.stringify(SETTINGS));
    } catch (_) {}
  }

  function loadUI() {
    for (const k of UI_KEYS) {
      try {
        const v = JSON.parse(localStorage.getItem(k) || 'null');
        if (v) return v;
      } catch (_) {}
    }
    return {};
  }

  function saveUIState(obj) {
    try {
      localStorage.setItem(UI_KEYS[0], JSON.stringify(obj));
    } catch (_) {}
  }

  function log(...a) {
    if (SETTINGS.debug) console.log('[LLC]', ...a);
  }

  function collectVideos(root) {
    const out = [];
    try {
      const walker = document.createTreeWalker(root || document, NodeFilter.SHOW_ELEMENT);
      let n = walker.currentNode;
      while (n) {
        if (n.tagName === 'VIDEO') out.push(n);
        if (n.shadowRoot) out.push(...collectVideos(n.shadowRoot));
        if (n.tagName === 'IFRAME') {
          try {
            if (n.contentDocument) out.push(...collectVideos(n.contentDocument));
          } catch (_) {}
        }
        n = walker.nextNode();
      }
    } catch (_) {}
    return out;
  }

  function isRectVisible(rect) {
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.left < innerWidth && rect.top < innerHeight;
  }

  function isCandidate(video) {
    return !!video && video.isConnected && video.readyState >= 2;
  }

  function refreshVideos(force = false) {
    const now = Date.now();
    if (!force && now - lastVideoScan < VIDEO_SCAN_INTERVAL) {
      cachedVideos = cachedVideos.filter(isCandidate);
      if (!cachedVideos.includes(activeVideo)) activeVideo = null;
      if (cachedVideos.length) return cachedVideos;
    }
    lastVideoScan = now;
    cachedVideos = collectVideos(document).filter(isCandidate);
    if (!cachedVideos.includes(activeVideo)) activeVideo = null;
    return cachedVideos;
  }

  function selectBestVideo(list) {
    let best = null;
    let bestScore = -1;
    for (const v of list) {
      const rect = v.getBoundingClientRect();
      if (!isRectVisible(rect)) continue;
      const score = rect.width * rect.height;
      if (score > bestScore) {
        bestScore = score;
        best = v;
      }
    }
    return best;
  }

  function pickActiveVideo() {
    if (isCandidate(activeVideo)) {
      const rect = activeVideo.getBoundingClientRect();
      if (isRectVisible(rect)) return activeVideo;
      activeVideo = null;
    }

    let vids = refreshVideos(false);
    let best = selectBestVideo(vids);
    if (!best) {
      vids = refreshVideos(true);
      best = selectBestVideo(vids);
    }
    if (best) activeVideo = best;
    return best;
  }

  function isAdPlaying() {
    return !!(document.querySelector('[data-a-target="video-ad-label"]') || document.querySelector('.ad-banner, .player-ad-banner, .video-player__ad-overlay'));
  }

  function isLive(video) {
    if (!video) return false;
    const liveish = !Number.isFinite(video.duration) || (video.seekable && video.seekable.length > 0);
    return liveish;
  }

  function extractLag(range, currentTime) {
    try {
      if (range && range.length) {
        const end = range.end(range.length - 1);
        const lag = end - currentTime;
        if (Number.isFinite(lag) && lag >= -1 && lag < 120) return lag;
      }
    } catch (_) {}
    return NaN;
  }

  function getLag(video) {
    const lagFromSeekable = extractLag(video.seekable, video.currentTime);
    if (Number.isFinite(lagFromSeekable)) return lagFromSeekable;
    return extractLag(video.buffered, video.currentTime);
  }

  function getBufferedAhead(video) {
    try {
      const bf = video && video.buffered;
      if (bf && bf.length) {
        return Math.max(0, bf.end(bf.length - 1) - video.currentTime);
      }
    } catch (_) {}
    return 0;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function setRate(video, rate) {
    if (!video) return 1;
    const target = clamp(rate, 0.25, SETTINGS.maxBoost);
    if (Math.abs(video.playbackRate - target) > SETTINGS.rateEpsilon) {
      try {
        video.playbackRate = target;
      } catch (_) {}
      try {
        if ('preservesPitch' in video) video.preservesPitch = true;
        if ('mozPreservesPitch' in video) video.mozPreservesPitch = true;
        if ('webkitPreservesPitch' in video) video.webkitPreservesPitch = true;
      } catch (_) {}
      log('rate:', target.toFixed(2));
    }
    rateEstimate = video.playbackRate;
    return video.playbackRate;
  }

  const originalPlaybackRate = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
  if (originalPlaybackRate) {
    Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
      get() {
        return originalPlaybackRate.get.call(this);
      },
      set(v) {
        try {
          originalPlaybackRate.set.call(this, v);
        } catch (_) {}
      },
    });
  }

  function smoothRate(desired) {
    const current = rateEstimate;
    if (!Number.isFinite(desired)) return current;
    const delta = desired - current;
    if (Math.abs(delta) < SETTINGS.rateMinStep) {
      rateEstimate = clamp(desired, 0.25, SETTINGS.maxBoost);
      return rateEstimate;
    }
    const limit = delta > 0 ? SETTINGS.rateStepUp : SETTINGS.rateStepDown;
    const step = Math.min(Math.abs(delta) * SETTINGS.rateSmoothFactor, limit);
    const next = current + Math.sign(delta) * step;
    rateEstimate = clamp(next, 0.25, SETTINGS.maxBoost);
    return rateEstimate;
  }

  function updatePanelDisplay(lag, rate) {
    if (!SETTINGS.enabled) {
      if (panelRefs.lag) panelRefs.lag.textContent = 'off';
      if (panelRefs.rate) panelRefs.rate.textContent = '1.00×';
      return;
    }
    if (panelRefs.lag) panelRefs.lag.textContent = Number.isFinite(lag) ? `${lag.toFixed(1)} s` : '-- s';
    if (panelRefs.rate) panelRefs.rate.textContent = (Number.isFinite(rate) ? rate : 1).toFixed(2) + '×';
  }

  function panel() {
    if (panelRefs.root && panelRefs.root.isConnected) return;
    if (!document.body) return;

    const el = document.createElement('div');
    el.id = PANEL_ID;
    el.style.cssText = 'position:fixed;z-index:2147483647;background:#111c;color:#eee;border-radius:8px;font:12px system-ui,Segoe UI,Roboto,Arial;backdrop-filter:blur(4px);box-shadow:0 2px 10px rgba(0,0,0,.4);user-select:none;width:240px;';

    const uiState = Object.assign({ left: null, top: null, collapsed: false, advanced: false }, loadUI());

    el.innerHTML = `
      <div id="llc_hdr" style="display:flex;align-items:center;gap:8px;padding:6px 8px;cursor:move">
        <strong style="font-weight:600">Stats:</strong>
        <span id="llc_l" style="opacity:.9">-- s</span>
        <span id="llc_r" style="opacity:.9">1.00×</span>
        <div style="flex:1"></div>
        <button id="llc_min" title="Minimize" style="background:#222;color:#eee;border:0;border-radius:6px;padding:2px 6px;cursor:pointer">–</button>
      </div>
      <div id="llc_body" style="display: flex; flex-direction: column; gap: 8px; padding: 8px;">
        <label style="display:flex; justify-content: space-between; align-items: center;">
            <span>Target Delay:</span>
            <span style="display: flex; align-items: center; gap: 4px;">
                <input data-key="targetLag" type="number" step="0.1" min="0" style="width: 60px; text-align: right; border-radius: 4px; border: 1px solid #555; background: #222; color: #eee;">
                <span style="width: 20px; text-align: left;">s</span>
            </span>
        </label>
        <label style="display:flex; justify-content: space-between; align-items: center;">
            <span>Speed Rate: </span>
            <span style="display: flex; align-items: center; gap: 4px;">
                <input data-key="maxBoost" type="number" step="0.01" min="1" max="5" style="width: 60px; text-align: right; border-radius: 4px; border: 1px solid #555; background: #222; color: #eee;">
                <span style="width: 20px; text-align: left;">×</span>
            </span>
        </label>
        <label style="display:flex; justify-content: space-between; align-items: center;">
            <span>Enabled:</span>
            <input data-key="enabled" type="checkbox">
        </label>
      </div>
      <div id="llc_advanced_body" style="display: none; flex-direction: column; gap: 8px; padding: 8px; border-top: 1px solid #444;">
      </div>
      <div id="llc_footer" style="display:flex; justify-content: space-between; padding: 4px 8px 8px 8px;">
        <button id="llc_advanced_toggle" style="background:none; border:none; color:#aaa; cursor:pointer;">Advanced ▾</button>
        <button id="llc_reset" style="background:none; border:none; color:#aaa; cursor:pointer;">Reset</button>
      </div>
      `;

    document.body.appendChild(el);

    const hdr = el.querySelector('#llc_hdr');
    const body = el.querySelector('#llc_body');
    const advancedBody = el.querySelector('#llc_advanced_body');
    const advancedToggleBtn = el.querySelector('#llc_advanced_toggle');
    const resetBtn = el.querySelector('#llc_reset');
    const footer = el.querySelector('#llc_footer');
    const minBtn = el.querySelector('#llc_min');

    panelRefs.root = el;
    panelRefs.body = body;
    panelRefs.lag = el.querySelector('#llc_l');
    panelRefs.rate = el.querySelector('#llc_r');
    panelRefs.minBtn = minBtn;

    const inputs = {};
    let advancedOpen = uiState.advanced;

    const advancedSettings = {
        checkMs: { min: 50, max: 5000, step: 50, unit: 'ms', title: 'How often the script checks for lag.' },
        rateStepUp: { min: 0.01, max: 1, step: 0.01, unit: 'Δ/s', title: 'Maximum rate increase per second.' },
        rateStepDown: { min: 0.01, max: 1, step: 0.01, unit: 'Δ/s', title: 'Maximum rate decrease per second.' },
        rateSmoothFactor: { min: 0.01, max: 1, step: 0.01, unit: '', title: 'Smoothing factor for rate changes.' },
        bufferSafety: { min: 0, max: 10, step: 0.1, unit: 's', title: 'Minimum video buffer required for max boost.' },
    };

    for (const [key, props] of Object.entries(advancedSettings)) {
        const label = document.createElement('label');
        label.style.cssText = 'display:flex; justify-content: space-between; align-items: center;';
        label.innerHTML = `
            <span style="display: flex; align-items: center; gap: 4px;">
                ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                <span title="${props.title}" style="cursor:help; border: 1px solid #777; border-radius: 50%; width: 14px; height: 14px; display: inline-flex; justify-content: center; align-items: center; font-size: 10px;">i</span>
            </span>
            <span style="display: flex; align-items: center; gap: 4px;">
                <input data-key="${key}" type="number" step="${props.step}" min="${props.min}" max="${props.max}" style="width: 60px; text-align: right; border-radius: 4px; border: 1px solid #555; background: #222; color: #eee;">
                <span style="width: 20px; text-align: left;">${props.unit}</span>
            </span>
        `;
        advancedBody.appendChild(label);
    }

    el.querySelectorAll('[data-key]').forEach(input => {
        const key = input.dataset.key;
        inputs[key] = input;
    });

    function updateUIFromSettings() {
        for (const [key, input] of Object.entries(inputs)) {
            if (input.type === 'checkbox') {
                input.checked = SETTINGS[key];
            } else {
                input.value = SETTINGS[key];
            }
        }
    }

    function persist() {
        for (const [key, input] of Object.entries(inputs)) {
            const value = input.type === 'checkbox' ? input.checked : Number(input.value);
            if (SETTINGS[key] !== value) {
                SETTINGS[key] = value;
            }
        }
        SETTINGS.normalizeLag = SETTINGS.targetLag / 2;
        save();
    }

    el.querySelectorAll('[data-key]').forEach(input => {
        input.addEventListener('input', persist);
    });

    resetBtn.addEventListener('click', () => {
        SETTINGS = { ...DEFAULTS };
        save();
        updateUIFromSettings();
    });

    function setAdvancedVisible(visible) {
        const collapsed = body.style.display === 'none';
        advancedOpen = visible;
        advancedBody.style.display = (!collapsed && visible) ? 'flex' : 'none';
        advancedToggleBtn.textContent = visible ? 'Advanced ▴' : 'Advanced ▾';
        saveUIState({ ...loadUI(), advanced: visible });
    }

    advancedToggleBtn.addEventListener('click', () => setAdvancedVisible(!advancedOpen));

    function setCollapsed(collapsed) {
      body.style.display = collapsed ? 'none' : 'flex';
      advancedBody.style.display = (!collapsed && advancedOpen) ? 'flex' : 'none';
      advancedToggleBtn.textContent = advancedOpen ? 'Advanced ▴' : 'Advanced ▾';
      footer.style.display = collapsed ? 'none' : 'flex';
      minBtn.textContent = collapsed ? '+' : '–';
      saveUIState({ ...loadUI(), collapsed });
    }

    function toggleCollapsed() {
      setCollapsed(body.style.display !== 'none');
    }

    minBtn.addEventListener('click', toggleCollapsed);

    function placeInitial() {
      const rect = el.getBoundingClientRect();
      if (uiState.left == null || uiState.top == null) {
        const left = clamp(innerWidth - rect.width - 12, 0, Math.max(0, innerWidth - rect.width));
        const top = clamp(innerHeight - rect.height - 12, 0, Math.max(0, innerHeight - rect.height));
        el.style.left = left + 'px';
        el.style.top = top + 'px';
      } else {
        el.style.left = clamp(uiState.left, 0, innerWidth - rect.width) + 'px';
        el.style.top = clamp(uiState.top, 0, innerHeight - rect.height) + 'px';
      }
    }

    (function enableDrag() {
      let dragging = false;
      let ox = 0;
      let oy = 0;
      let sx = 0;
      let sy = 0;
      let moved = false;

      hdr.addEventListener('pointerdown', (ev) => {
        dragging = true;
        moved = false;
        hdr.setPointerCapture(ev.pointerId);
        const r = el.getBoundingClientRect();
        ox = ev.clientX;
        oy = ev.clientY;
        sx = r.left;
        sy = r.top;
      });

      hdr.addEventListener('pointermove', (ev) => {
        if (!dragging) return;
        const dx = ev.clientX - ox;
        const dy = ev.clientY - oy;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
        const nx = clamp(sx + dx, 0, innerWidth - el.offsetWidth);
        const ny = clamp(sy + dy, 0, innerHeight - el.offsetHeight);
        el.style.left = nx + 'px';
        el.style.top = ny + 'px';
      });

      hdr.addEventListener('pointerup', (ev) => {
        if (!dragging) return;
        dragging = false;
        hdr.releasePointerCapture(ev.pointerId);
        const r = el.getBoundingClientRect();
        saveUIState({ left: r.left, top: r.top, collapsed: body.style.display === 'none' });
        if (!moved) toggleCollapsed();
      });

      window.addEventListener('resize', () => {
        const r = el.getBoundingClientRect();
        el.style.left = clamp(r.left, 0, innerWidth - el.offsetWidth) + 'px';
        el.style.top = clamp(r.top, 0, innerHeight - el.offsetHeight) + 'px';
      });
    })();

    updateUIFromSettings();
    setAdvancedVisible(uiState.advanced);
    setCollapsed(uiState.collapsed);
    placeInitial();
  }

  function controlLoop() {
    const video = pickActiveVideo();
    if (!video) {
      updatePanelDisplay(NaN, 1);
      return;
    }

    if (Number.isFinite(video.playbackRate)) {
      rateEstimate = video.playbackRate;
    }

    if (!SETTINGS.enabled) {
      rateEstimate = 1;
      const applied = setRate(video, 1.0);
      updatePanelDisplay(NaN, applied);
      return;
    }

    if (!isLive(video) || isAdPlaying()) {
      rateEstimate = 1;
      const applied = setRate(video, 1.0);
      updatePanelDisplay(NaN, applied);
      return;
    }

    const lag = getLag(video);
    if (!Number.isFinite(lag)) {
      rateEstimate = 1;
      const applied = setRate(video, 1.0);
      updatePanelDisplay(NaN, applied);
      return;
    }

    const bufferAhead = getBufferedAhead(video);

    let targetRate = 1.0;

    if (rateEstimate > 1.0) {
        if (lag > SETTINGS.normalizeLag) {
            const excess = lag - SETTINGS.normalizeLag;
            const catchupSpan = Math.max(0.25, (SETTINGS.targetLag - SETTINGS.normalizeLag) * 1.5);
            const normalized = clamp(excess / catchupSpan, 0, 1);
            targetRate = 1 + normalized * (SETTINGS.maxBoost - 1);
        } else {
            targetRate = 1.0;
        }
    } else {
        if (lag > SETTINGS.targetLag) {
            const excess = lag - SETTINGS.targetLag;
            const catchupSpan = Math.max(0.25, SETTINGS.targetLag * 1.5);
            const normalized = clamp(excess / catchupSpan, 0, 1);
            targetRate = 1 + normalized * (SETTINGS.maxBoost - 1);
        }
    }

    if (targetRate > 1.0 && bufferAhead < SETTINGS.bufferSafety) {
      const bufferScale = clamp(bufferAhead / SETTINGS.bufferSafety, 0, 1);
      const maxAllowed = 1 + (SETTINGS.maxBoost - 1) * bufferScale;
      targetRate = Math.min(targetRate, maxAllowed);
    }

    const smoothed = smoothRate(targetRate);
    const applied = setRate(video, smoothed);
    updatePanelDisplay(lag, applied);
  }

  function main() {
    load();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', panel, { once: true });
    } else {
      panel();
    }
    setInterval(controlLoop, SETTINGS.checkMs);
  }

  main();
})();