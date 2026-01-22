// ==UserScript==
// @name         MIUI Browser Tab KeepAlive
// @namespace    https://github.com/DJ-Flitzefinger/miui-browser-tab-keepalive
// @version      1.0.0
// @description  Tampermonkey userscript that prevents MIUI/HyperOS from killing mobile browser tabs. Works with Firefox, Edge, Yandex, Kiwi, and other browsers. No root required.
// @license      GPL-3.0-or-later
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://vimeo.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/563527/MIUI%20Browser%20Tab%20KeepAlive.user.js
// @updateURL https://update.greasyfork.org/scripts/563527/MIUI%20Browser%20Tab%20KeepAlive.meta.js
// ==/UserScript==

(() => {
  'use strict';


  // ============================================================
  // PROFILE CONFIGURATION
  // ============================================================
  // Two profiles for easy trial & error. Short-tap toggles master,
  // long-press (450-600ms) activates Profile 2 (aggressive).
  // Profile 2 + MASTER = red lock icon.
  // ============================================================

  const PROFILE_1 = {
    // --------------------------------------------------------
    // PHANTOM VIDEO
    // --------------------------------------------------------
    canvasStreamFps: 0.1,      // FPS for canvas-based video stream
    muted: true,               // v.muted (true = silent)
    volume: 0,                 // v.volume (0 = silent, 0.001 = barely audible)

    // --------------------------------------------------------
    // RETRY WATCHDOG (Phantom Video Recovery)
    // --------------------------------------------------------
    retryWatchdog: false,      // Enable/disable watchdog
    retryDelayMinMs: 15000,    // Min delay between retries
    retryDelayMaxMs: 120000,   // Max delay (exponential backoff cap)

    // --------------------------------------------------------
    // INDEXEDDB HEARTBEAT (Very small periodic DB write to create an extra activity "pulse")
    // --------------------------------------------------------
    indexedDBHeartbeat: false, // Enable/disable IndexedDB heartbeat
    heartbeatIntervalMs: 15000,// How often to write heartbeat

    // --------------------------------------------------------
    // MEDIA SESSION REFRESH (How often to re-assert the MediaSession metadata + playback state)
    // --------------------------------------------------------
    mediaSessionRefresh: false,           // Enable/disable MediaSession refresh (some music playing apps will stop playing!)
    mediaSessionRefreshIntervalMs: 10000, // How often to re-assert MediaSession. If set to 0 and "true" only asserted one time when activating

    // --------------------------------------------------------
    // WAKE LOCK (Holds a screen wake lock to prevent deep sleep (Doze mode) when screen is off. Consumes more battery)
    // --------------------------------------------------------
    wakeLock: false,                      // Enable/disable WakeLock API
    wakeLockRefreshIntervalMs: 0,         // WakeLock refresh interval (0 = no refresh, hold continuously)

    // --------------------------------------------------------
    // SERVICE WORKER / ACTIVITY (Registers a background service worker with periodic activity to simulate ongoing work)
    // --------------------------------------------------------
    serviceWorker: false,      // Enable/disable Service Worker
    activityIntervalMs: 10000, // SW activity interval

    // --------------------------------------------------------
    // WEB LOCK (Holds an exclusive lock to make the tab look less "idle" to the browser. Low cost, usefulness depends on ROM/device)
    // --------------------------------------------------------
    webLock: true,             // Enable/disable Web Locks API
  };

  const PROFILE_2 = {
    // --------------------------------------------------------
    // PHANTOM VIDEO
    // --------------------------------------------------------
    canvasStreamFps: 2,        // Higher FPS
    muted: false,              // Not muted
    volume: 0.001,             // Barely audible

    // --------------------------------------------------------
    // RETRY WATCHDOG
    // --------------------------------------------------------
    retryWatchdog: true,       // Enabled
    retryDelayMinMs: 5000,     // Faster retry
    retryDelayMaxMs: 30000,    // Lower cap

    // --------------------------------------------------------
    // INDEXEDDB HEARTBEAT
    // --------------------------------------------------------
    indexedDBHeartbeat: true,  // Enabled
    heartbeatIntervalMs: 5000, // More frequent

    // --------------------------------------------------------
    // MEDIA SESSION REFRESH
    // --------------------------------------------------------
    mediaSessionRefresh: false,          // Disabled (can interfere with other media apps)
    mediaSessionRefreshIntervalMs: 5000, // More frequent refresh (if enabled)

    // --------------------------------------------------------
    // WAKE LOCK
    // --------------------------------------------------------
    wakeLock: true,                      // Enabled
    wakeLockRefreshIntervalMs: 30000,    // Periodic refresh to handle auto-releases

    // --------------------------------------------------------
    // SERVICE WORKER / ACTIVITY
    // --------------------------------------------------------
    serviceWorker: true,       // Enabled
    activityIntervalMs: 5000,  // More frequent

    // --------------------------------------------------------
    // WEB LOCK
    // --------------------------------------------------------
    webLock: true,             // Enabled
  };

  // ============================================================
  // INTERNAL: Build SETTINGS object from active profile
  // ============================================================

  function buildSettingsFromProfile(profile) {
    return {
      mediaSession: {
        enabled: profile.mediaSessionRefresh,
        refreshIntervalMs: profile.mediaSessionRefreshIntervalMs,
        // ALWAYS active, NOT configurable per profile
        skipIfRealMediaOnPage: true,
      },
      phantomVideo: {
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
        indexedDBHeartbeat: {
          enabled: profile.indexedDBHeartbeat,
          heartbeatIntervalMs: profile.heartbeatIntervalMs,
        },
        wakeLock: {
          enabled: profile.wakeLock,
          refreshIntervalMs: profile.wakeLockRefreshIntervalMs,
        },
        serviceWorker: {
          enabled: profile.serviceWorker,
          activityIntervalMs: profile.activityIntervalMs,
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

    // Update lock color based on profile (only visible when master)
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
  // WakeLock API (optional extra to prevent deep sleep)
  // ============================================================

  let wakeLock = null;
  let wakeLockRefreshTimer = null;

  async function acquireWakeLock() {
    if (!SETTINGS.extras.wakeLock.enabled) return;
    if (wakeLock) return;
    if (!('wakeLock' in navigator)) return;

    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.error('WakeLock failed:', err);
    }
  }

  async function refreshWakeLock() {
    releaseWakeLock();
    await acquireWakeLock();
  }

  function startWakeLockRefresh() {
    const interval = Number(SETTINGS.extras.wakeLock.refreshIntervalMs) || 0;
    if (interval <= 0) return;

    if (wakeLockRefreshTimer) clearInterval(wakeLockRefreshTimer);

    wakeLockRefreshTimer = setInterval(() => {
      if (!runningKeepAlive) return;
      void refreshWakeLock();
    }, Math.max(2000, interval));
  }

  function stopWakeLockRefresh() {
    if (wakeLockRefreshTimer) {
      clearInterval(wakeLockRefreshTimer);
      wakeLockRefreshTimer = null;
    }
  }

  function releaseWakeLock() {
    if (!wakeLock) return;

    try {
      wakeLock.release();
      wakeLock = null;
    } catch {}
  }

  // ============================================================
  // Service Worker (optional extra for background activity)
  // ============================================================

  let swRegistration = null;
  let swActivityTimer = null;

  async function startServiceWorker() {
    if (!SETTINGS.extras.serviceWorker.enabled) return;
    if (swRegistration) return;
    if (!('serviceWorker' in navigator)) return;

    try {
      // Create an inline Service Worker script as a Blob
      const swCode = `
        self.addEventListener('install', () => {
          self.skipWaiting();
        });

        self.addEventListener('activate', () => {
          self.clients.claim();
        });

        setInterval(() => {
          // Dummy activity to simulate ongoing work (e.g., postMessage to keep alive)
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage({ type: 'keepalive' }));
          });
        }, ${SETTINGS.extras.serviceWorker.activityIntervalMs});
      `;

      const blob = new Blob([swCode], { type: 'application/javascript' });
      const swUrl = URL.createObjectURL(blob);

      swRegistration = await navigator.serviceWorker.register(swUrl);

      // Listen for messages from SW (optional, but keeps communication open)
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'keepalive') {
          // Do nothing, just acknowledge activity
        }
      });
    } catch (err) {
      console.error('Service Worker failed:', err);
    }
  }

  async function stopServiceWorker() {
    if (!swRegistration) return;

    try {
      await swRegistration.unregister();
      swRegistration = null;
    } catch {}

    if (swActivityTimer) {
      clearInterval(swActivityTimer);
      swActivityTimer = null;
    }
  }

  // ============================================================
  // IndexedDB heartbeat (optional tiny periodic DB write)
  // ============================================================

  const IDB_NAME = 'ffka-keepalive-db';
  const IDB_STORE = 'heartbeat';

  let idbDatabase = null;
  let idbHeartbeatTimer = null;

  function openIndexedDB() {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(IDB_NAME, 1);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(IDB_STORE)) {
            db.createObjectStore(IDB_STORE, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject(request.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function writeIndexedDBHeartbeat() {
    if (!idbDatabase) return;
    try {
      const tx = idbDatabase.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put({ id: tabId, ts: Date.now() });
    } catch {}
  }

  async function startIndexedDBHeartbeat() {
    if (!SETTINGS.extras.indexedDBHeartbeat.enabled) return;
    if (idbHeartbeatTimer) return;

    try {
      idbDatabase = await openIndexedDB();
      await writeIndexedDBHeartbeat();

      idbHeartbeatTimer = setInterval(() => {
        if (!runningKeepAlive) return;
        void writeIndexedDBHeartbeat();
      }, Math.max(5000, Number(SETTINGS.extras.indexedDBHeartbeat.heartbeatIntervalMs) || 15000));
    } catch {
      // IndexedDB may be unavailable; continue without it.
    }
  }

  function stopIndexedDBHeartbeat() {
    if (idbHeartbeatTimer) {
      clearInterval(idbHeartbeatTimer);
      idbHeartbeatTimer = null;
    }
    if (idbDatabase) {
      try { idbDatabase.close(); } catch {}
      idbDatabase = null;
    }
  }

  // ============================================================
  // Phantom media core (silent hidden video + MediaSession)
  // ============================================================

  let runningKeepAlive = false;

  let videoEl = null;
  let retryDelayMs = 0;
  let watchdogTimer = null;
  let mediaSessionTimer = null;

  function isRetryWatchdogEnabled() {
    const cfg = SETTINGS.phantomVideo.retryWatchdog;
    if (!cfg || !cfg.enabled) return false;
    const min = Number(cfg.retryDelayMinMs) || 0;
    const max = Number(cfg.retryDelayMaxMs) || 0;
    return min > 0 && max > 0;
  }

  async function ensureVideoElement() {
    if (videoEl) return;

    const v = document.createElement('video');
    v.style.cssText = 'display:none !important; width:1px; height:1px; position:fixed; left:-9999px; top:-9999px;';
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.muted = SETTINGS.phantomVideo.muted;
    v.volume = SETTINGS.phantomVideo.volume;

    // Canvas-based video stream (low FPS to save battery).
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 2, 2);
    }
    const stream = canvas.captureStream(SETTINGS.phantomVideo.canvasStreamFps);
    v.srcObject = stream;

    document.documentElement.appendChild(v);
    videoEl = v;
  }

  async function tryResumePhantomVideo() {
    if (!runningKeepAlive) return;
    if (!videoEl) return;
    if (!videoEl.paused) return;

    try {
      await videoEl.play();

      // If the watchdog is enabled, reset the retry delay after a successful resume.
      if (isRetryWatchdogEnabled()) {
        retryDelayMs = Number(SETTINGS.phantomVideo.retryWatchdog.retryDelayMinMs) || retryDelayMs;
      }
    } catch {
      // Only apply exponential backoff when the watchdog is enabled.
      if (isRetryWatchdogEnabled()) {
        const max = Number(SETTINGS.phantomVideo.retryWatchdog.retryDelayMaxMs) || retryDelayMs;
        retryDelayMs = Math.min(
          max,
          Math.floor(retryDelayMs * 1.6)
        );
      }
    }
  }

  function scheduleWatchdogLoop() {
    if (!isRetryWatchdogEnabled()) return;

    // Start with the configured minimum delay.
    retryDelayMs = Number(SETTINGS.phantomVideo.retryWatchdog.retryDelayMinMs) || retryDelayMs;
    if (retryDelayMs <= 0) return;

    const loop = async () => {
      if (!runningKeepAlive) return;
      await tryResumePhantomVideo();
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

  function isOtherMediaPlayingOnPage() {
    try {
      const els = document.querySelectorAll('audio,video');
      for (const el of els) {
        if (el === videoEl) continue;
        if (el && !el.paused && !el.ended && el.readyState > 2) return true;
      }
    } catch {}
    return false;
  }

  function setMediaSessionPlaying(isPlaying) {
    try {
      if (!('mediaSession' in navigator)) return;

      if (isPlaying) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Phantom KeepAlive',
          artist: 'Firefox',
          album: 'MIUI workaround',
        });
        navigator.mediaSession.playbackState = 'playing';

        const safe = (action, fn) => {
          try { navigator.mediaSession.setActionHandler(action, fn); } catch {}
        };

        safe('play', async () => { try { await videoEl?.play(); } catch {} });
        safe('pause', () => { try { videoEl?.pause(); } catch {} });

        // If the user stops playback from the Android notification, disable the keepalive.
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

  function refreshPhantomMediaSession() {
    if (!runningKeepAlive) return;

    if (SETTINGS.mediaSession.skipIfRealMediaOnPage && isOtherMediaPlayingOnPage()) {
      return;
    }

    // Re-assert metadata/playbackState (Android may restore the notification/player).
    setMediaSessionPlaying(true);

    // Also ensure the phantom video is actually playing.
    void tryResumePhantomVideo();
  }

  function startMediaSessionRefresh() {
    if (!SETTINGS.mediaSession.enabled) return;
    const interval = Number(SETTINGS.mediaSession.refreshIntervalMs) || 0;
    if (interval <= 0) return;

    stopMediaSessionRefresh();

    mediaSessionTimer = setInterval(() => {
      if (!runningKeepAlive) return;
      refreshPhantomMediaSession();
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
    await acquireWakeLock();
    startWakeLockRefresh();
    await startServiceWorker();
    await startIndexedDBHeartbeat();

    await ensureVideoElement();
    try { await videoEl?.play(); } catch {}

    setMediaSessionPlaying(true);

    if (isRetryWatchdogEnabled()) {
      retryDelayMs = Number(SETTINGS.phantomVideo.retryWatchdog.retryDelayMinMs) || 0;
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
    retryDelayMs = isRetryWatchdogEnabled() ? (Number(SETTINGS.phantomVideo.retryWatchdog.retryDelayMinMs) || 0) : 0;

    releaseWebLock();
    stopWakeLockRefresh();
    releaseWakeLock();
    void stopServiceWorker();
    stopIndexedDBHeartbeat();

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

  // Reinitialize KeepAlive with new profile settings (stop + start)
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

    // Store initial position for move detection
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

      // Long-press action: activate Profile 2
      const st = await readMasterState();
      const isMaster = isThisTabMaster(st);

      // Set profile to 2
      await setActiveProfile(2);

      if (!isMaster) {
        // Make this tab master AND activate Profile 2
        await setMasterStateAsThisTab();
      }

      // Reinitialize with Profile 2 settings
      await reinitKeepAliveWithProfile(2);

      // Update UI to show red lock (if master)
      const newSt = await readMasterState();
      setUiState(isThisTabMaster(newSt), 2);

    }, LONG_PRESS_DURATION_MS);
  }

  function handlePointerMove(e) {
    if (!longPressTimer) return;

    // Cancel long-press if finger moved too far
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

  // Prevent click if long-press was triggered
  function handleClick(e) {
    if (longPressTriggered) {
      e.preventDefault();
      e.stopPropagation();
      longPressTriggered = false;
      return;
    }

    // Original short-tap behavior: force-claim master / disable if master
    void (async () => {
      const st = await readMasterState();

      if (isThisTabMaster(st)) {
        // Currently master -> disable keepalive
        await clearMasterState();
        // Reset to Profile 1 when disabling
        await setActiveProfile(1);
        applyProfileSettings(1);
        await applyMasterState();
        return;
      }

      // Not master -> make THIS tab master (keeps current profile)
      await setMasterStateAsThisTab();
      await applyMasterState();
    })();
  }

  // ============================================================
  // Event wiring
  // ============================================================

  // React to shared master state changes.
  gmOnChange(KEY_MASTER_ID, () => void applyMasterState());
  gmOnChange(KEY_MASTER_ENABLED, () => void applyMasterState());
  gmOnChange(KEY_ACTIVE_PROFILE, async () => {
    const profileNum = await readActiveProfile();
    await reinitKeepAliveWithProfile(profileNum);
    const st = await readMasterState();
    setUiState(isThisTabMaster(st), profileNum);
  });

  // Best-effort resume phantom playback + ensure MediaSession (master only).
  // Also refresh WakeLock on visibility change.
  document.addEventListener('visibilitychange', async () => {
    if (!runningKeepAlive) return;
    await tryResumePhantomVideo();
    setMediaSessionPlaying(true);
    if (SETTINGS.extras.wakeLock.enabled) {
      void refreshWakeLock();
    }
  }, { passive: true });

  // Badge behavior with long-press support
  // Use touchstart/touchend for touch devices, pointerdown/pointerup as fallback
  badge.addEventListener('touchstart', handlePointerDown, { passive: true });
  badge.addEventListener('touchmove', handlePointerMove, { passive: true });
  badge.addEventListener('touchend', handlePointerUp, { passive: true });
  badge.addEventListener('touchcancel', handlePointerCancel, { passive: true });

  // Fallback for non-touch (desktop testing)
  badge.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // Already handled by touch events
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

  // Prevent context menu on long press
  badge.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
  }, { passive: false });

  // If the master tab is closed, best-effort clear the master state.
  // Note: OS-kills may skip unload, but force-claim makes recovery easy.
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
    // Load active profile on init
    const profileNum = await readActiveProfile();
    applyProfileSettings(profileNum);
    await applyMasterState();
  })();

})();
