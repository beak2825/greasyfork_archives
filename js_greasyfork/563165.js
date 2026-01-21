// ==UserScript==
// @name         Firefox MIUI Tab KeepAlive
// @namespace    https://github.com/DJ-Flitzefinger/firefox-miui-tab-keepalive
// @version      2.0.0
// @description  Prevents Firefox Mobile from being killed/discarded by MIUI by keeping one dedicated YouTube tab "active" via a silent phantom MediaSession.
// @license      GPL-3.0-or-later
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/563165/Firefox%20MIUI%20Tab%20KeepAlive.user.js
// @updateURL https://update.greasyfork.org/scripts/563165/Firefox%20MIUI%20Tab%20KeepAlive.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // Only run in the top-level document (avoid iframes).
  if (window.top !== window.self) return;

  // Prevent duplicate UI injection in the same document.
  const BADGE_ID = 'ffka-lock-badge';
  if (document.getElementById(BADGE_ID)) return;

  // ============================================================
  // USER TUNING (battery vs. stability)
  //
  // Important:
  // - On many MIUI builds the Android media notification/player must stay "alive"
  //   continuously, otherwise the workaround stops working.
  // - This script therefore keeps a silent phantom video + MediaSession running
  //   permanently in the MASTER tab.
  //
  // UI:
  // - Circle  = keepalive badge (always visible on YouTube pages)
  // - Lock    = THIS tab is the current MASTER tab (only the master runs keepalive)
  //
  // Force-claim (simplicity):
  // - Clicking the circle ALWAYS makes the current tab the new MASTER.
  // - Clicking the circle in the current MASTER tab disables the keepalive.
  // ============================================================

  const SETTINGS = {
    // --------------------------------------------------------
    // Media notification / MediaSession stability
    // --------------------------------------------------------
    mediaSession: {
      /**
       * How often to re-assert the MediaSession metadata + playback state.
       *
       * Effects:
       * - smaller  => more aggressive (notification/player tends to stay alive)
       * - larger   => less overhead, but notification might disappear more easily
       * - 0        => disable refresh (only use if your device stays stable)
       */
      refreshIntervalMs: 10000,

      /**
       * Best-effort safeguard: do NOT refresh the phantom MediaSession while this page
       * is currently playing real media (any audio/video element except the phantom one).
       */
      skipIfRealMediaOnPage: true,
    },

    // --------------------------------------------------------
    // Phantom video stability
    // --------------------------------------------------------
    phantomVideo: {
      /**
       * Backoff for retrying video.play() if the browser blocks/resets it.
       *
       * Effects:
       * - smaller retryDelayMinMs => faster recovery, more wakeups
       * - larger retryDelayMaxMs  => fewer wakeups, but longer without playback
       */
      retryDelayMinMs: 15000,
      retryDelayMaxMs: 120000,

      /**
       * FPS for the canvas-based video stream.
       * Higher values may consume more battery.
       */
      canvasStreamFps: 0.5,
    },

    // --------------------------------------------------------
    // Optional lightweight extra activity signals
    // --------------------------------------------------------
    extras: {
      /**
       * Web Locks API:
       * Holds an exclusive lock to make the tab look less "idle" to the browser.
       * Low cost, usefulness depends on ROM/device.
       */
      webLock: true,

      /**
       * IndexedDB heartbeat:
       * Very small periodic DB write to create an extra activity "pulse".
       */
      indexedDBHeartbeat: true,
    },

    indexedDB: {
      /**
       * How often the IndexedDB heartbeat is written.
       * Smaller values create more activity/wakeups.
       */
      heartbeatIntervalMs: 15000,
    },
  };

  // ============================================================
  // Shared state (Tampermonkey storage, shared across YouTube tabs)
  // ============================================================

  const KEY_MASTER_ID = 'ffka_master_tabid';        // string|null
  const KEY_MASTER_ENABLED = 'ffka_master_enabled'; // boolean

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

  // Lock icon with outline so it remains visible on light backgrounds.
  lockSvg.innerHTML = `
    <!-- Shackle -->
    <path d="M7 11V8.5C7 6.01 9.01 4 11.5 4S16 6.01 16 8.5V11"
      fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M7 11V8.5C7 6.01 9.01 4 11.5 4S16 6.01 16 8.5V11"
      fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.6" stroke-linecap="round"/>

    <!-- Body -->
    <path d="M6.5 11.2h11c.83 0 1.5.67 1.5 1.5v6.3c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-6.3c0-.83.67-1.5 1.5-1.5z"
      fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="3.2" stroke-linejoin="round"/>
    <path d="M6.5 11.2h11c.83 0 1.5.67 1.5 1.5v6.3c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-6.3c0-.83.67-1.5 1.5-1.5z"
      fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.6" stroke-linejoin="round"/>
  `;

  badge.appendChild(lockSvg);
  document.documentElement.appendChild(badge);

  function setUiState(isMaster) {
    lockSvg.style.opacity = isMaster ? '1' : '0';
    badge.style.borderColor = isMaster ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.60)';
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
    if (!SETTINGS.extras.indexedDBHeartbeat) return;
    if (idbHeartbeatTimer) return;

    try {
      idbDatabase = await openIndexedDB();
      await writeIndexedDBHeartbeat();

      idbHeartbeatTimer = setInterval(() => {
        if (!runningKeepAlive) return;
        void writeIndexedDBHeartbeat();
      }, Math.max(5000, Number(SETTINGS.indexedDB.heartbeatIntervalMs) || 15000));
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
  let retryDelayMs = SETTINGS.phantomVideo.retryDelayMinMs;
  let watchdogTimer = null;
  let mediaSessionTimer = null;

  async function ensureVideoElement() {
    if (videoEl) return;

    const v = document.createElement('video');
    v.style.cssText = 'display:none !important; width:1px; height:1px; position:fixed; left:-9999px; top:-9999px;';
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.muted = true;
    v.volume = 0;

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
      retryDelayMs = SETTINGS.phantomVideo.retryDelayMinMs;
    } catch {
      retryDelayMs = Math.min(
        SETTINGS.phantomVideo.retryDelayMaxMs,
        Math.floor(retryDelayMs * 1.6)
      );
    }
  }

  function scheduleWatchdogLoop() {
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
    await startIndexedDBHeartbeat();

    await ensureVideoElement();
    try { await videoEl?.play(); } catch {}

    setMediaSessionPlaying(true);

    retryDelayMs = SETTINGS.phantomVideo.retryDelayMinMs;
    clearWatchdogLoop();
    scheduleWatchdogLoop();

    startMediaSessionRefresh();
  }

  function stopKeepAlive() {
    if (!runningKeepAlive) return;
    runningKeepAlive = false;

    stopMediaSessionRefresh();
    setMediaSessionPlaying(false);

    clearWatchdogLoop();
    retryDelayMs = SETTINGS.phantomVideo.retryDelayMinMs;

    releaseWebLock();
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

  // ============================================================
  // Master state application (queued, avoids lost updates)
  // ============================================================

  let applying = false;
  let applyQueued = false;
  let localMasterActive = false;

  async function setLocalMasterMode(isMaster) {
    setUiState(isMaster);

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
  // Event wiring
  // ============================================================

  // React to shared master state changes.
  gmOnChange(KEY_MASTER_ID, () => void applyMasterState());
  gmOnChange(KEY_MASTER_ENABLED, () => void applyMasterState());

  // Best-effort resume phantom playback + ensure MediaSession (master only).
  document.addEventListener('visibilitychange', async () => {
    if (!runningKeepAlive) return;
    await tryResumePhantomVideo();
    setMediaSessionPlaying(true);
  }, { passive: true });

  // Badge behavior (force-claim):
  // - If this tab is master: disable keepalive.
  // - Otherwise: make THIS tab master (overwrites any previous master).
  badge.addEventListener('click', async () => {
    const st = await readMasterState();

    if (isThisTabMaster(st)) {
      await clearMasterState();
      await applyMasterState();
      return;
    }

    await setMasterStateAsThisTab();
    await applyMasterState();
  }, { passive: true });

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

  void applyMasterState();

})();
