// ==UserScript==
// @name         MIUI Browser Tab KeepAlive
// @namespace    https://github.com/DJ-Flitzefinger/miui-browser-tab-keepalive
// @version      2.0.1
// @description  Tampermonkey userscript that helps prevent MIUI/HyperOS from killing mobile browser tabs. No root required.
// @license      GPL-3.0-or-later
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://vimeo.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/563835/MIUI%20Browser%20Tab%20KeepAlive.user.js
// @updateURL https://update.greasyfork.org/scripts/563835/MIUI%20Browser%20Tab%20KeepAlive.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ============================================================
  // PROFILE CONFIGURATION
  // ============================================================
  // Two profiles for easy trial & error.
  // Short-tap toggles master.
  // Long-press (450-600ms) activates Profile 2.
  // Profile 2 + MASTER = red lock icon.
  // ============================================================

  const PROFILE_1 = {
    // --------------------------------------------------------
    // VIDEO KEEPALIVE
    // --------------------------------------------------------
    VideoKeepAlive: true,     // Enable/disable Video KeepAlive (hidden video + MediaSession)

    // --------------------------------------------------------
    // KEEPALIVE PRIORITY
    // --------------------------------------------------------
    KeepAlivePriority: 'video',  // Primary mode if both VideoKeepAlive and AudioKeepAlive are enabled ('video' or 'audio')

    canvasStreamFps: 0.1,      // FPS for canvas-based video stream
    muted: true,               // v.muted (true = silent)
    volume: 0,                 // v.volume (0 = silent, 0.001 = barely audible)

    // --------------------------------------------------------
    // RETRY WATCHDOG (Restarts KeepAlive if Audio/Video stops)
    // --------------------------------------------------------
    retryWatchdog: false,      // If KeepAlive stops entirely, re-initialize Audio/Video (stronger than the per-mode resume loops)
    retryDelayMinMs: 15000,    // Min delay between retries
    retryDelayMaxMs: 120000,   // Max delay (exponential backoff cap)

    // --------------------------------------------------------
    // MEDIA SESSION REFRESH (How often to re-assert the MediaSession metadata + playback state)
    // --------------------------------------------------------
    mediaSessionRefresh: false,           // Enable/disable MediaSession refresh (some music playing apps will stop playing!)
    mediaSessionRefreshIntervalMs: 10000, // How often to re-assert. If set to 0 and "true" only asserted one time when activating

    // --------------------------------------------------------
    // WEB LOCK (Holds an exclusive lock to make the tab look less "idle")
    // --------------------------------------------------------
    webLock: true,

    // --------------------------------------------------------
    // AUDIO KEEPALIVE (audio playback + MediaSession)
    // --------------------------------------------------------
    AudioKeepAlive: false,
    AudioFrequencyHz: 440,
    AudioGain: 0.00001,
    AudioResumeIntervalMs: 5000, // Audio resume interval, if it somehow stops (0 = off)
  };

  const PROFILE_2 = {
    // --------------------------------------------------------
    // VIDEO KEEPALIVE
    // --------------------------------------------------------
    VideoKeepAlive: true,

    // --------------------------------------------------------
    // KEEPALIVE PRIORITY
    // --------------------------------------------------------
    KeepAlivePriority: 'audio',

    canvasStreamFps: 2,
    muted: true,
    volume: 0,

    // --------------------------------------------------------
    // RETRY WATCHDOG
    // --------------------------------------------------------
    retryWatchdog: true,
    retryDelayMinMs: 5000,
    retryDelayMaxMs: 15000,

    // --------------------------------------------------------
    // MEDIA SESSION REFRESH
    // --------------------------------------------------------
    mediaSessionRefresh: false,
    mediaSessionRefreshIntervalMs: 10000,

    // --------------------------------------------------------
    // WEB LOCK
    // --------------------------------------------------------
    webLock: true,

    // --------------------------------------------------------
    // AUDIO KEEPALIVE
    // --------------------------------------------------------
    AudioKeepAlive: true,
    AudioFrequencyHz: 440,
    AudioGain: 0.00001,
    AudioResumeIntervalMs: 5000,
  };

  // ============================================================
  // INTERNAL: Build SETTINGS object from active profile
  // ============================================================
  function buildSettingsFromProfile(profile) {
    return {
      keepAlive: {
        priority: (profile.KeepAlivePriority === 'audio') ? 'audio' : 'video',
      },
      mediaSession: {
        enabled: profile.mediaSessionRefresh,
        refreshIntervalMs: profile.mediaSessionRefreshIntervalMs,
        // ALWAYS active, NOT configurable per profile
        skipIfRealMediaOnPage: true,
      },
      videoKeepAlive: {
        enabled: profile.VideoKeepAlive,
        retryWatchdog: {
          enabled: profile.retryWatchdog,
          retryDelayMinMs: profile.retryDelayMinMs,
          retryDelayMaxMs: profile.retryDelayMaxMs,
        },
        canvasStreamFps: profile.canvasStreamFps,
        muted: profile.muted,
        volume: profile.volume,
      },
      extras: {
        webLock: profile.webLock,

        audioKeepAlive: {
          enabled: profile.AudioKeepAlive,
          frequencyHz: profile.AudioFrequencyHz,
          gain: profile.AudioGain,
          resumeIntervalMs: profile.AudioResumeIntervalMs,
        },
      },
    };
  }

  // Current active settings (will be updated on profile change)
  let SETTINGS = buildSettingsFromProfile(PROFILE_1);

  // Only run in the top-level document (avoid iframes).
  if (window.top !== window.self) return;

  // Prevent duplicate UI injection in the same document.
  const BADGE_ID = 'ffka-lock-badge';
  if (document.getElementById(BADGE_ID)) return;

  // ============================================================
  // Shared state (Tampermonkey storage, shared across YouTube tabs)
  // ============================================================

  const KEY_MASTER_ID = 'ffka_master_tabid';        // string|null
  const KEY_MASTER_ENABLED = 'ffka_master_enabled'; // boolean
  const KEY_ACTIVE_PROFILE = 'ffka_active_profile'; // number (1 or 2)

  async function gmGet(key, defVal) {
    try {
      const v = GM_getValue(key, defVal);
      return (v && typeof v.then === 'function') ? await v : v;
    } catch {
      return defVal;
    }
  }

  async function gmSet(key, val) {
    try {
      const r = GM_setValue(key, val);
      if (r && typeof r.then === 'function') await r;
    } catch {}
  }

  function gmOnChange(key, cb) {
    try {
      if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener(key, (_name, _oldV, _newV, _remote) => cb());
      }
    } catch {}
  }

  const tabId = (() => {
    const a = new Uint32Array(4);
    crypto.getRandomValues(a);
    return [...a].map(x => x.toString(16).padStart(8, '0')).join('');
  })();

  async function readMasterState() {
    const id = await gmGet(KEY_MASTER_ID, null);
    const enabled = !!(await gmGet(KEY_MASTER_ENABLED, false));
    return { id: (typeof id === 'string' ? id : null), enabled };
  }

  async function clearMasterState() {
    await gmSet(KEY_MASTER_ENABLED, false);
    await gmSet(KEY_MASTER_ID, null);
  }

  async function setMasterStateAsThisTab() {
    await gmSet(KEY_MASTER_ID, tabId);
    await gmSet(KEY_MASTER_ENABLED, true);
  }

  function isThisTabMaster(state) {
    return !!(state?.enabled && state?.id && state.id === tabId);
  }

  // ============================================================
  // Profile management
  // ============================================================

  let currentProfileNum = 1;

  async function readActiveProfile() {
    const p = await gmGet(KEY_ACTIVE_PROFILE, 1);
    return (p === 2) ? 2 : 1;
  }

  async function setActiveProfile(num) {
    const profileNum = (num === 2) ? 2 : 1;
    await gmSet(KEY_ACTIVE_PROFILE, profileNum);
  }

  function getProfileConfig(num) {
    return (num === 2) ? PROFILE_2 : PROFILE_1;
  }

  function applyProfileSettings(num) {
    currentProfileNum = (num === 2) ? 2 : 1;
    SETTINGS = buildSettingsFromProfile(getProfileConfig(currentProfileNum));
  }

  // ============================================================
  // UI (floating circle + lock)
  // ============================================================

  const SIZE = 44;
  const MARGIN = 12;

  const badge = document.createElement('div');
  badge.id = BADGE_ID;
  badge.setAttribute('aria-label', 'Keepalive toggle');
  badge.style.cssText = `
    position: fixed;
    right: ${MARGIN}px;
    bottom: ${MARGIN}px;
    width: ${SIZE}px;
    height: ${SIZE}px;
    z-index: 2147483647;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1.5px solid rgba(255,255,255,0.60);
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.18);
  `;

  const lockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lockSvg.setAttribute('viewBox', '0 0 24 24');
  lockSvg.setAttribute('width', '22');
  lockSvg.setAttribute('height', '22');
  lockSvg.style.opacity = '0';
  lockSvg.style.transition = 'opacity 120ms linear';

  // Lock icon paths - we'll update stroke colors based on profile
  const LOCK_WHITE_COLOR = 'rgba(255,255,255,0.85)';
  const LOCK_RED_COLOR = 'rgba(255,80,80,0.95)';
  const LOCK_SHADOW_COLOR = 'rgba(0,0,0,0.45)';

  function createLockSvgContent(strokeColor) {
    return `
      <!-- Shackle -->
      <path d="M7 11V8.5C7 6.01 9.01 4 11.5 4S16 6.01 16 8.5V11"
        fill="none" stroke="${LOCK_SHADOW_COLOR}" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M7 11V8.5C7 6.01 9.01 4 11.5 4S16 6.01 16 8.5V11"
        fill="none" stroke="${strokeColor}" stroke-width="1.6" stroke-linecap="round"/>

      <!-- Body -->
      <path d="M6.5 11.2h11c.83 0 1.5.67 1.5 1.5v6.3c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-6.3c0-.83.67-1.5 1.5-1.5z"
        fill="none" stroke="${LOCK_SHADOW_COLOR}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M6.5 11.2h11c.83 0 1.5.67 1.5 1.5v6.3c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-6.3c0-.83.67-1.5 1.5-1.5z"
        fill="none" stroke="${strokeColor}" stroke-width="1.6" stroke-linejoin="round"/>
    `;
  }

  lockSvg.innerHTML = createLockSvgContent(LOCK_WHITE_COLOR);
  badge.appendChild(lockSvg);
  document.documentElement.appendChild(badge);

  function setUiState(isMaster, profileNum) {
    lockSvg.style.opacity = isMaster ? '1' : '0';
    badge.style.borderColor = isMaster ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.60)';

    const lockColor = (profileNum === 2) ? LOCK_RED_COLOR : LOCK_WHITE_COLOR;
    lockSvg.innerHTML = createLockSvgContent(lockColor);
  }


  // ============================================================
  // Web Locks API (optional extra "not idle" signal)
  // ============================================================

  let webLockHeld = false;
  let webLockAbortController = null;

  async function acquireWebLock() {
    if (!SETTINGS.extras.webLock) return;
    if (webLockHeld) return;
    if (!('locks' in navigator)) return;

    try {
      webLockAbortController = new AbortController();
      webLockHeld = true;

      navigator.locks.request(
        'ffka-keepalive',
        { mode: 'exclusive', signal: webLockAbortController.signal },
        () => new Promise(() => {})
      ).catch(() => {
        webLockHeld = false;
      });
    } catch {
      webLockHeld = false;
    }
  }

  function releaseWebLock() {
    if (!webLockHeld) return;

    try {
      if (webLockAbortController) {
        webLockAbortController.abort();
        webLockAbortController = null;
      }
    } catch {}

    webLockHeld = false;
  }

  // ============================================================
  // Helpers
  // ============================================================

  const clampMs = (n, min, max) => {
    const v = Number(n);
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
  };

  function isOtherMediaPlayingOnPage() {
    try {
      const els = document.querySelectorAll('audio,video');
      for (const el of els) {
        if (el === videoEl) continue;
        if (el === audioEl) continue;
        if (el && !el.paused && !el.ended && el.readyState > 2) return true;
      }
    } catch {}
    return false;
  }

  function isVideoKeepAliveEnabled() {
    const vk = SETTINGS?.videoKeepAlive;
    if (!vk) return true;
    return vk.enabled !== false;
  }

  function isAudioKeepAliveEnabled() {
    return !!SETTINGS?.extras?.audioKeepAlive?.enabled;
  }

  function primaryKeepAliveMode() {
    const prio = SETTINGS?.keepAlive?.priority || 'video';
    if (prio === 'audio') {
      if (isAudioKeepAliveEnabled()) return 'audio';
      if (isVideoKeepAliveEnabled()) return 'video';
      return null;
    }
    // default: video-first
    if (isVideoKeepAliveEnabled()) return 'video';
    if (isAudioKeepAliveEnabled()) return 'audio';
    return null;
  }

  // ============================================================
  // Audio KeepAlive (audio playback + MediaSession)
  // ============================================================

  let audioCtx = null;
  let audioOsc = null;
  let audioGainNode = null;
  let audioDest = null;
  let audioEl = null;
  let audioResumeTimer = null;

  function stopAudioKeepAlive() {
    try {
      if (audioResumeTimer) {
        clearInterval(audioResumeTimer);
        audioResumeTimer = null;
      }

      try { audioEl?.pause?.(); } catch {}
      try {
        const so = audioEl?.srcObject;
        if (so?.getTracks) so.getTracks().forEach(t => { try { t.stop(); } catch {} });
      } catch {}
      try { audioEl?.remove?.(); } catch {}
      audioEl = null;

      try { audioOsc?.stop(); } catch {}
      try { audioOsc?.disconnect(); } catch {}
      audioOsc = null;

      try { audioGainNode?.disconnect(); } catch {}
      audioGainNode = null;

      try { audioDest?.disconnect?.(); } catch {}
      audioDest = null;

      try { audioCtx?.close(); } catch {}
      audioCtx = null;
    } catch {}
  }

  async function tryStartAudioPlayback(fromGesture) {
    if (!audioEl) return;

    try {
      // Do not force-mute here. Use gain to control audibility.
      try { audioEl.muted = false; } catch {}
      try { audioEl.volume = 1; } catch {}

      try { if (audioCtx?.state === 'suspended') await audioCtx.resume(); } catch {}
      await audioEl.play();
    } catch {
    }
  }

  async function startAudioKeepAlive() {
    const cfg = SETTINGS?.extras?.audioKeepAlive;
    if (!cfg?.enabled) return;
    if (audioCtx || audioEl) return;

    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;

      audioCtx = new Ctx();
      try { await audioCtx.resume(); } catch {}

      audioOsc = audioCtx.createOscillator();
      audioGainNode = audioCtx.createGain();
      audioDest = audioCtx.createMediaStreamDestination();

      audioOsc.frequency.value = Number(cfg.frequencyHz) || 440;
      audioGainNode.gain.value = Number(cfg.gain) || 0.0001;

      audioOsc.connect(audioGainNode);
      audioGainNode.connect(audioDest);
      // Also connect to speakers so the tone is actually audible (gain controls loudness).
      try { audioGainNode.connect(audioCtx.destination); } catch {}

      audioOsc.start();

      audioEl = document.createElement('audio');
      audioEl.style.cssText = 'display:none !important; width:1px; height:1px; position:fixed; left:-9999px; top:-9999px;';
      audioEl.loop = true;
      audioEl.autoplay = true;
      audioEl.muted = false;
      audioEl.volume = 1;
      audioEl.srcObject = audioDest.stream;

      document.documentElement.appendChild(audioEl);

      await tryStartAudioPlayback(false);

      const resumeMs = Number(cfg.resumeIntervalMs) || 0;
      if (resumeMs > 0) {
        const interval = clampMs(resumeMs, 250, 5000);
        audioResumeTimer = setInterval(() => {
          if (!runningKeepAlive) return;
          try {
            if (audioCtx?.state === 'suspended') audioCtx.resume();
          } catch {}
          try {
            if (audioEl?.paused) void tryStartAudioPlayback(false);
          } catch {}
        }, interval);
      }
    } catch {
      stopAudioKeepAlive();
    }
  }

  // ============================================================
  // Video KeepAlive core (silent hidden video + MediaSession)
  // ============================================================

  let runningKeepAlive = false;

  let videoEl = null;
  let retryDelayMs = 0;
  let watchdogTimer = null;
  let mediaSessionTimer = null;

  function isRetryWatchdogEnabled() {
    if (!isVideoKeepAliveEnabled()) return false;
    const cfg = SETTINGS.videoKeepAlive.retryWatchdog;
    if (!cfg || !cfg.enabled) return false;
    const min = Number(cfg.retryDelayMinMs) || 0;
    const max = Number(cfg.retryDelayMaxMs) || 0;
    return min > 0 && max > 0;
  }

  async function ensureVideoElement() {
    if (!isVideoKeepAliveEnabled()) return;
    if (videoEl) return;

    const v = document.createElement('video');
    v.style.cssText = 'display:none !important; width:1px; height:1px; position:fixed; left:-9999px; top:-9999px;';
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.muted = SETTINGS.videoKeepAlive.muted;
    v.volume = SETTINGS.videoKeepAlive.volume;

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 2, 2);
    }

    const fps = Number(SETTINGS.videoKeepAlive.canvasStreamFps) || 0.1;
    const stream = canvas.captureStream(fps);
    v.srcObject = stream;

    document.documentElement.appendChild(v);
    videoEl = v;
  }

  async function tryResumeVideoKeepAlive() {
    if (!runningKeepAlive) return;
    if (!isVideoKeepAliveEnabled()) return;
    if (!videoEl) return;
    if (!videoEl.paused) return;

    try {
      await videoEl.play();

      if (isRetryWatchdogEnabled()) {
        retryDelayMs = Number(SETTINGS.videoKeepAlive.retryWatchdog.retryDelayMinMs) || retryDelayMs;
      }
    } catch {
      if (isRetryWatchdogEnabled()) {
        const max = Number(SETTINGS.videoKeepAlive.retryWatchdog.retryDelayMaxMs) || retryDelayMs;
        retryDelayMs = Math.min(max, Math.floor(retryDelayMs * 1.6));
      }
    }
  }

  function scheduleWatchdogLoop() {
    if (!isVideoKeepAliveEnabled()) return;
    if (!isRetryWatchdogEnabled()) return;

    retryDelayMs = Number(SETTINGS.videoKeepAlive.retryWatchdog.retryDelayMinMs) || retryDelayMs;
    if (retryDelayMs <= 0) return;

    const loop = async () => {
      if (!runningKeepAlive) return;
      await tryResumeVideoKeepAlive();
      watchdogTimer = setTimeout(loop, retryDelayMs);
    };

    watchdogTimer = setTimeout(loop, retryDelayMs);
  }

  function clearWatchdogLoop() {
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
      watchdogTimer = null;
    }
  }

  function setMediaSessionPlaying(isPlaying) {
    try {
      if (!('mediaSession' in navigator)) return;

      const mode = primaryKeepAliveMode();
      if (!mode) return;

      if (isPlaying) {
        if (SETTINGS.mediaSession.skipIfRealMediaOnPage && isOtherMediaPlayingOnPage()) {
          return;
        }

        let title = 'KeepAlive';
        let artist = 'Browser';
        let album = 'MIUI workaround';

        if (mode === 'video') title = 'Video KeepAlive';
        if (mode === 'audio') title = 'Audio KeepAlive';

        navigator.mediaSession.metadata = new MediaMetadata({ title, artist, album });
        navigator.mediaSession.playbackState = 'playing';

        const safe = (action, fn) => {
          try { navigator.mediaSession.setActionHandler(action, fn); } catch {}
        };

        const targetPlay = async () => {
          try {
            if (mode === 'video') await videoEl?.play();
            else if (mode === 'audio') await audioEl?.play();
          } catch {}
        };

        const targetPause = () => {
          try {
            if (mode === 'video') videoEl?.pause();
            else if (mode === 'audio') audioEl?.pause();
          } catch {}
        };

        safe('play', targetPlay);
        safe('pause', targetPause);

        safe('stop', async () => {
          try {
            const st = await readMasterState();
            if (isThisTabMaster(st)) await clearMasterState();
          } catch {}
        });
      } else {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = null;

        const safe = (action) => {
          try { navigator.mediaSession.setActionHandler(action, null); } catch {}
        };
        safe('play');
        safe('pause');
        safe('stop');
      }
    } catch {}
  }

  function refreshKeepAliveMediaSession() {
    if (!runningKeepAlive) return;

    setMediaSessionPlaying(true);

    const mode = primaryKeepAliveMode();
    if (mode === 'video') {
      void tryResumeVideoKeepAlive();
    } else if (mode === 'audio') {
      void tryStartAudioPlayback(false);
    }
  }

  function startMediaSessionRefresh() {
    const mode = primaryKeepAliveMode();
    if (!mode) return;
    if (!SETTINGS.mediaSession.enabled) return;

    const interval = Number(SETTINGS.mediaSession.refreshIntervalMs) || 0;
    if (interval <= 0) return;

    stopMediaSessionRefresh();

    mediaSessionTimer = setInterval(() => {
      if (!runningKeepAlive) return;
      refreshKeepAliveMediaSession();
    }, Math.max(2000, interval));
  }

  function stopMediaSessionRefresh() {
    if (mediaSessionTimer) {
      clearInterval(mediaSessionTimer);
      mediaSessionTimer = null;
    }
  }

  async function startKeepAlive() {
    if (runningKeepAlive) return;
    runningKeepAlive = true;

    await acquireWebLock();

    const mode = primaryKeepAliveMode();

    if (mode === 'audio') {
      await startAudioKeepAlive();
    } else if (mode === 'video') {
      await ensureVideoElement();
      try { await videoEl?.play(); } catch {}
    }

    setMediaSessionPlaying(true);

    if (mode === 'video' && isRetryWatchdogEnabled()) {
      retryDelayMs = Number(SETTINGS.videoKeepAlive.retryWatchdog.retryDelayMinMs) || 0;
      clearWatchdogLoop();
      scheduleWatchdogLoop();
    } else {
      clearWatchdogLoop();
      retryDelayMs = 0;
    }

    startMediaSessionRefresh();
  }

  function stopKeepAlive() {
    if (!runningKeepAlive) return;
    runningKeepAlive = false;

    stopMediaSessionRefresh();
    setMediaSessionPlaying(false);
    clearWatchdogLoop();

    stopAudioKeepAlive();

    releaseWebLock();

    try {
      if (videoEl) {
        videoEl.pause();

        const so = videoEl.srcObject;
        if (so && so.getTracks) {
          so.getTracks().forEach(t => { try { t.stop(); } catch {} });
        }

        videoEl.srcObject = null;
        videoEl.removeAttribute('src');
        videoEl.load();
        videoEl.remove();
      }
    } catch {}

    videoEl = null;
  }


  async function reinitKeepAliveWithProfile(profileNum) {
    applyProfileSettings(profileNum);

    if (runningKeepAlive) {
      stopKeepAlive();
      await startKeepAlive();
    }
  }

  // ============================================================
  // Master state application (queued, avoids lost updates)
  // ============================================================

  let applying = false;
  let applyQueued = false;
  let localMasterActive = false;

  async function setLocalMasterMode(isMaster) {
    const profileNum = await readActiveProfile();
    applyProfileSettings(profileNum);

    setUiState(isMaster, profileNum);

    if (isMaster === localMasterActive) return;
    localMasterActive = isMaster;

    if (isMaster) {
      await startKeepAlive();
    } else {
      stopKeepAlive();
    }
  }

  async function applyMasterState() {
    if (applying) {
      applyQueued = true;
      return;
    }

    applying = true;

    try {
      const st = await readMasterState();
      await setLocalMasterMode(isThisTabMaster(st));
    } finally {
      applying = false;

      if (applyQueued) {
        applyQueued = false;
        void applyMasterState();
      }
    }
  }

  // ============================================================
  // Long-press handling (mobile touch robust)
  // ============================================================

  const LONG_PRESS_DURATION_MS = 500;
  let longPressTimer = null;
  let longPressTriggered = false;
  let touchStartX = 0;
  let touchStartY = 0;
  const TOUCH_MOVE_THRESHOLD = 10;

  function clearLongPressTimer() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function handlePointerDown(e) {
    longPressTriggered = false;

    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    } else {
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    }

    clearLongPressTimer();

    longPressTimer = setTimeout(async () => {
      longPressTriggered = true;
      longPressTimer = null;

      const st = await readMasterState();
      const isMaster = isThisTabMaster(st);

      await setActiveProfile(2);

      if (!isMaster) {
        await setMasterStateAsThisTab();
      }

      await reinitKeepAliveWithProfile(2);

      const newSt = await readMasterState();
      setUiState(isThisTabMaster(newSt), 2);

    }, LONG_PRESS_DURATION_MS);
  }

  function handlePointerMove(e) {
    if (!longPressTimer) return;

    let currentX, currentY;
    if (e.touches && e.touches.length > 0) {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }

    const dx = Math.abs(currentX - touchStartX);
    const dy = Math.abs(currentY - touchStartY);

    if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) {
      clearLongPressTimer();
    }
  }

  function handlePointerUp() {
    clearLongPressTimer();
  }

  function handlePointerCancel() {
    clearLongPressTimer();
  }

  function handleClick(e) {
    if (longPressTriggered) {
      e.preventDefault();
      e.stopPropagation();
      longPressTriggered = false;
      return;
    }

    void (async () => {
      const st = await readMasterState();

      if (isThisTabMaster(st)) {
        await clearMasterState();

        await setActiveProfile(1);
        applyProfileSettings(1);
        await applyMasterState();
        return;
      }

      await setMasterStateAsThisTab();
      await applyMasterState();
    })();
  }

  // ============================================================
  // Event wiring
  // ============================================================

  gmOnChange(KEY_MASTER_ID, () => void applyMasterState());
  gmOnChange(KEY_MASTER_ENABLED, () => void applyMasterState());
  gmOnChange(KEY_ACTIVE_PROFILE, async () => {
    const profileNum = await readActiveProfile();
    await reinitKeepAliveWithProfile(profileNum);
    const st = await readMasterState();
    setUiState(isThisTabMaster(st), profileNum);
  });

  document.addEventListener('visibilitychange', async () => {
    if (!runningKeepAlive) return;
    refreshKeepAliveMediaSession();
  }, { passive: true });

  badge.addEventListener('touchstart', handlePointerDown, { passive: true });
  badge.addEventListener('touchmove', handlePointerMove, { passive: true });
  badge.addEventListener('touchend', handlePointerUp, { passive: true });
  badge.addEventListener('touchcancel', handlePointerCancel, { passive: true });

  badge.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    handlePointerDown(e);
  }, { passive: true });
  badge.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    handlePointerMove(e);
  }, { passive: true });
  badge.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'touch') return;
    handlePointerUp();
  }, { passive: true });
  badge.addEventListener('pointercancel', (e) => {
    if (e.pointerType === 'touch') return;
    handlePointerCancel();
  }, { passive: true });

  badge.addEventListener('click', handleClick, { passive: false });

  badge.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });

  const tryClearIfMaster = async () => {
    try {
      const st = await readMasterState();
      if (isThisTabMaster(st)) {
        await clearMasterState();
      }
    } catch {}
  };

  window.addEventListener('pagehide', () => { void tryClearIfMaster(); }, { passive: true });
  window.addEventListener('beforeunload', () => { void tryClearIfMaster(); }, { passive: true });

  // ============================================================
  // Initialization
  // ============================================================

  void (async () => {
    const profileNum = await readActiveProfile();
    applyProfileSettings(profileNum);
    await applyMasterState();
  })();

})();
