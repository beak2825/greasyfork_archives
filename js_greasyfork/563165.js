// ==UserScript==
// @name         Firefox MIUI Tab KeepAlive
// @namespace    https://github.com/DJ-Flitzefinger/firefox-miui-tab-keepalive
// @version      1.0
// @description  Prevents Firefox Mobile tabs from being discarded or reloaded by MIUI’s aggressive memory management on Xiaomi phones, using a silent phantom MediaSession and background playback support on whitelisted sites.
// @license      GPL-3.0-or-later
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/563165/Firefox%20MIUI%20Tab%20KeepAlive.user.js
// @updateURL https://update.greasyfork.org/scripts/563165/Firefox%20MIUI%20Tab%20KeepAlive.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // UI should only be injected in the top-level document (avoid iframes)
  if (window.top !== window.self) return;

  // Prevent duplicate UI injection in the same document
  const BADGE_ID = 'ffka-lock-badge';
  if (document.getElementById(BADGE_ID)) return;

  // ============================================================
  // Configuration
  // ============================================================

  /**
   * Domains where background-play support is enabled.
   * Suffix match: "youtube.com" matches "m.youtube.com", "www.youtube.com", etc.
   */
  const BGPLAY_HOST_SUFFIXES = [
    // 'your-domain.tld',
    'amazon.com',
    'amazon.de',
    'audible.com',
    'audible.de',
    'brightcove.com',
    'coursera.org',
    'dailymotion.com',
    'disneyplus.com',
    'facebook.com',
    'instagram.com',
    'jwplayer.com',
    'loom.com',
    'metacafe.com',
    'mixcloud.com',
    'netflix.com',
    'open.spotify.com',
    'primevideo.com',
    'soundcloud.com',
    'streamable.com',
    'tiktok.com',
    'tv.apple.com',
    'twitch.tv',
    'twitter.com',
    'udemy.com',
    'vidyard.com',
    'vimeo.com',
    'x.com',
    'youtube-nocookie.com',
    'youtube.com',
  ];

  /**
   * Background-play "owner" parameters.
   * Only the owner tab fakes visibility and emits lightweight activity ticks.
   */
  const OWNER_HEARTBEAT_MS = 8000;
  const OWNER_TTL_MS = 25000;

  /**
   * Synthetic user-activity tick interval (owner tab only).
   * Keep this large (60–120s) to minimize wakeups while still helping sites that stop playback on inactivity.
   */
  const USER_ACTIVITY_TICK_MS = 60000;

  /**
   * MediaSession refresh interval.
   * Keeps the phantom entry stable in Android's "Now Playing" UI.
   */
  const MEDIASESSION_REFRESH_MS = 60000;

  /**
   * Backoff watchdog parameters for resuming phantom playback.
   * The watchdog only retries play(); it does not refresh MediaSession.
   */
  const RETRY_DELAY_MIN = 15000;
  const RETRY_DELAY_MAX = 120000;

  // ============================================================
  // Global state (Tampermonkey storage, cross-domain)
  // ============================================================

  const KEY_ENABLED = 'ffka_enabled_global';     // boolean
  const KEY_OWNER_ID = 'ffka_bg_owner_id';       // string
  const KEY_OWNER_TS = 'ffka_bg_owner_ts';       // number (ms epoch)

  async function gmGet(key, defVal) {
    try {
      const v = GM_getValue(key, defVal);
      return (v && typeof v.then === 'function') ? await v : v;
    } catch (_) {
      return defVal;
    }
  }

  async function gmSet(key, val) {
    try {
      const r = GM_setValue(key, val);
      if (r && typeof r.then === 'function') await r;
    } catch (_) {}
  }

  function gmOnChange(key, cb) {
    try {
      if (typeof GM_addValueChangeListener === 'function') {
        GM_addValueChangeListener(key, (_name, _oldV, newV, _remote) => cb(newV));
      }
    } catch (_) {}
  }

  async function getGlobalEnabled() {
    return !!(await gmGet(KEY_ENABLED, false));
  }

  async function setGlobalEnabled(on) {
    await gmSet(KEY_ENABLED, !!on);
  }

  // ============================================================
  // Helpers
  // ============================================================

  const now = () => Date.now();

  function hostMatchesSuffixList(hostname, suffixList) {
    const h = String(hostname || '').toLowerCase();
    return suffixList.some((suf) => {
      const s = String(suf || '').toLowerCase().trim();
      if (!s) return false;
      return h === s || h.endsWith('.' + s);
    });
  }

  function isBgPlayDomain() {
    return hostMatchesSuffixList(location.hostname, BGPLAY_HOST_SUFFIXES);
  }

  const tabId = (() => {
    const a = new Uint32Array(4);
    crypto.getRandomValues(a);
    return [...a].map(x => x.toString(16).padStart(8, '0')).join('');
  })();

  async function getOwnerState() {
    const id = String(await gmGet(KEY_OWNER_ID, ''));
    const ts = Number(await gmGet(KEY_OWNER_TS, 0)) || 0;
    return { id, ts };
  }

  async function isOwnerAlive() {
    const { id, ts } = await getOwnerState();
    if (!id || !ts) return false;
    return (now() - ts) <= OWNER_TTL_MS;
  }

  async function isMeOwner() {
    const { id, ts } = await getOwnerState();
    if (!id || !ts) return false;
    if (id !== tabId) return false;
    return (now() - ts) <= OWNER_TTL_MS;
  }

  /**
   * Claim ownership for bg-play features.
   * The last writer wins, which is intended: "last played" becomes the owner.
   */
  async function claimOwner(reason) {
    void reason;
    if (!(await getGlobalEnabled())) return;

    await gmSet(KEY_OWNER_ID, tabId);
    await gmSet(KEY_OWNER_TS, now());
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
    /* Dual-contrast outline for light/dark backgrounds, still transparent */
    box-shadow: 0 0 0 1px rgba(0,0,0,0.18);
  `;

  const lockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  lockSvg.setAttribute('viewBox', '0 0 24 24');
  lockSvg.setAttribute('width', '22');
  lockSvg.setAttribute('height', '22');
  lockSvg.style.opacity = '0';
  lockSvg.style.transition = 'opacity 120ms linear';
  lockSvg.innerHTML = `
    <path d="M7 11V8.5C7 6.01 9.01 4 11.5 4S16 6.01 16 8.5V11"
      fill="none" stroke="rgba(255,255,255,0.60)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M6.5 11.2h11c.83 0 1.5.67 1.5 1.5v6.3c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-6.3c0-.83.67-1.5 1.5-1.5z"
      fill="none" stroke="rgba(255,255,255,0.60)" stroke-width="1.6" stroke-linejoin="round"/>
  `;
  badge.appendChild(lockSvg);
  document.documentElement.appendChild(badge);

  function setUi(on) {
    lockSvg.style.opacity = on ? '1' : '0';
    badge.style.borderColor = on ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.60)';
  }

  // ============================================================
  // KeepAlive core (phantom media)
  // ============================================================

  const USE_MEDIA_SESSION = true;

  let enabledLocal = false;
  let videoEl = null;

  let retryDelayMs = RETRY_DELAY_MIN;
  let watchdogTimer = null;
  let mediaSessionTimer = null;

  function setMediaSessionPlaying(isPlaying) {
    if (!USE_MEDIA_SESSION) return;
    try {
      if (!('mediaSession' in navigator)) return;

      if (isPlaying) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'Phantom KeepAlive',
          artist: 'Firefox',
          album: 'MIUI workaround'
        });
        navigator.mediaSession.playbackState = 'playing';

        const safe = (action, fn) => {
          try { navigator.mediaSession.setActionHandler(action, fn); } catch (_) {}
        };
        safe('play', async () => { try { await videoEl?.play(); } catch (_) {} });
        safe('pause', () => { try { videoEl?.pause(); } catch (_) {} });
        safe('stop', () => { stopKeepAlive(); });
      } else {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.metadata = null;

        const safe = (action) => {
          try { navigator.mediaSession.setActionHandler(action, null); } catch (_) {}
        };
        safe('play'); safe('pause'); safe('stop');
      }
    } catch (_) {}
  }

  function startMediaSessionRefresh() {
    if (!USE_MEDIA_SESSION) return;
    if (MEDIASESSION_REFRESH_MS <= 0) return;

    stopMediaSessionRefresh();
    mediaSessionTimer = setInterval(() => {
      if (!enabledLocal) return;
      setMediaSessionPlaying(true);
    }, MEDIASESSION_REFRESH_MS);
  }

  function stopMediaSessionRefresh() {
    if (mediaSessionTimer) {
      clearInterval(mediaSessionTimer);
      mediaSessionTimer = null;
    }
  }

  const DATA_MP4 =
    'data:video/mp4;base64,' +
    'AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAABsbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAA+gAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAABR0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAABAAAAAEAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAJtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAAPoAAAD6AABAAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABGm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAABAAAAAQAAABx1cmwgAAAAAQAAAFJzdGJsAAAAQHN0c2QAAAABAAAAAAAwYXZjMQAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAABj//wAAACRzdHRzAAAAAQAAAAEAAAABAAAAHGN0dHMAAAABAAAAAQAAAAEAAAAUc3RzYwAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAEAAAABAAAAAQAAABRzdGNvAAAAAQAAAAEAAAABAAAAHG1vb2YAAAAMbWZoZAAAAAEAAAAA';

  async function ensureVideoElement() {
    if (videoEl) return;

    const v = document.createElement('video');
    v.style.cssText = 'display:none !important; width:1px; height:1px; position:fixed; left:-9999px; top:-9999px;';
    v.playsInline = true;
    v.loop = true;
    v.autoplay = true;
    v.muted = true;
    v.volume = 0;

    v.src = DATA_MP4;

    v.addEventListener('error', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, 2, 2);
        }
        const stream = canvas.captureStream(1);
        v.srcObject = stream;
      } catch (_) {}
    }, { once: true });

    document.documentElement.appendChild(v);
    videoEl = v;
  }

  async function tryResumePhantomVideo() {
    if (!enabledLocal || !videoEl) return;
    if (!videoEl.paused) return;

    try {
      await videoEl.play();
      retryDelayMs = RETRY_DELAY_MIN;
    } catch (_) {
      retryDelayMs = Math.min(RETRY_DELAY_MAX, Math.floor(retryDelayMs * 1.6));
    }
  }

  function scheduleWatchdogLoop() {
    if (!enabledLocal) return;

    const loop = async () => {
      if (!enabledLocal) return;
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

  async function startKeepAlive() {
    if (enabledLocal) return;
    enabledLocal = true;

    setUi(true);

    await ensureVideoElement();
    try { await videoEl.play(); } catch (_) {}

    setMediaSessionPlaying(true);

    retryDelayMs = RETRY_DELAY_MIN;
    clearWatchdogLoop();
    scheduleWatchdogLoop();

    startMediaSessionRefresh();
  }

  function stopKeepAlive() {
    if (!enabledLocal) return;
    enabledLocal = false;

    setUi(false);

    stopUserActivityTick();
    stopOwnerHeartbeatLoop();

    stopMediaSessionRefresh();
    setMediaSessionPlaying(false);

    clearWatchdogLoop();
    retryDelayMs = RETRY_DELAY_MIN;

    try {
      if (videoEl) {
        videoEl.pause();
        const so = videoEl.srcObject;
        if (so && so.getTracks) so.getTracks().forEach(t => { try { t.stop(); } catch (_) {} });

        videoEl.srcObject = null;
        videoEl.removeAttribute('src');
        videoEl.load();
        videoEl.remove();
      }
    } catch (_) {}
    videoEl = null;

    localOwnerFlag = false;
  }

  // ============================================================
  // Background-play support (whitelisted domains, owner tab only)
  // ============================================================

  const origVisibilityState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState')
    || Object.getOwnPropertyDescriptor(document, 'visibilityState');
  const origHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden')
    || Object.getOwnPropertyDescriptor(document, 'hidden');

  function getRealVisibilityState() {
    try {
      const d = origVisibilityState;
      if (d && typeof d.get === 'function') return d.get.call(document);
      return document.visibilityState;
    } catch (_) {
      return 'visible';
    }
  }

  function getRealHidden() {
    try {
      const d = origHidden;
      if (d && typeof d.get === 'function') return d.get.call(document);
      return document.hidden;
    } catch (_) {
      return false;
    }
  }

  let visibilityHooksInstalled = false;
  let localOwnerFlag = false;

  async function refreshLocalOwnerFlag() {
    localOwnerFlag = await isMeOwner();
  }

  function installVisibilityHooksOnce() {
    if (visibilityHooksInstalled) return;
    visibilityHooksInstalled = true;

    try {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get() {
          if (enabledLocal && isBgPlayDomain() && localOwnerFlag) return 'visible';
          return getRealVisibilityState();
        }
      });
    } catch (_) {}

    try {
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get() {
          if (enabledLocal && isBgPlayDomain() && localOwnerFlag) return false;
          return getRealHidden();
        }
      });
    } catch (_) {}

    const blocker = (ev) => {
      if (enabledLocal && isBgPlayDomain() && localOwnerFlag) ev.stopImmediatePropagation();
    };
    document.addEventListener('visibilitychange', blocker, true);
    document.addEventListener('webkitvisibilitychange', blocker, true);
  }

  // ============================================================
  // Owner-only user activity tick (no focus)
  // ============================================================

  let userActivityTimer = null;

  function startUserActivityTick() {
    if (userActivityTimer) return;

    userActivityTimer = setInterval(() => {
      if (!enabledLocal) return;
      if (!isBgPlayDomain()) return;
      if (!localOwnerFlag) return;

      try { window.__ffkaLastActivity = Date.now(); } catch (_) {}
      try { window.dispatchEvent(new Event('mousemove')); } catch (_) {}
      try { window.dispatchEvent(new Event('pointermove')); } catch (_) {}
    }, Math.max(5000, USER_ACTIVITY_TICK_MS));
  }

  function stopUserActivityTick() {
    if (userActivityTimer) {
      clearInterval(userActivityTimer);
      userActivityTimer = null;
    }
  }

  // ============================================================
  // Owner heartbeat (owner tab only)
  // ============================================================

  let ownerHeartbeatTimer = null;

  function startOwnerHeartbeatLoop() {
    if (ownerHeartbeatTimer) return;

    ownerHeartbeatTimer = setInterval(async () => {
      if (!(await getGlobalEnabled())) return;
      if (!isBgPlayDomain()) return;
      if (!(await isMeOwner())) return;
      await gmSet(KEY_OWNER_TS, now());
    }, OWNER_HEARTBEAT_MS);
  }

  function stopOwnerHeartbeatLoop() {
    if (ownerHeartbeatTimer) {
      clearInterval(ownerHeartbeatTimer);
      ownerHeartbeatTimer = null;
    }
  }

  // ============================================================
  // Global state application
  // ============================================================

  async function applyGlobalEnabledState() {
    const on = await getGlobalEnabled();
    setUi(on);

    if (on) {
      installVisibilityHooksOnce();
      await startKeepAlive();

      const alive = await isOwnerAlive();
      if (!alive) await claimOwner('fallback-enable');
      await refreshLocalOwnerFlag();

      startOwnerHeartbeatLoop();
      startUserActivityTick();
    } else {
      stopKeepAlive();
    }
  }

  // ============================================================
  // Ownership policy
  // ============================================================

  /**
   * Make the "last played" tab the owner.
   * This triggers on actual media playback in the page.
   */
  document.addEventListener('play', async (ev) => {
    if (!(await getGlobalEnabled())) return;
    if (!isBgPlayDomain()) return;
    if (!ev || !ev.target) return;

    await claimOwner('media-play');
    await refreshLocalOwnerFlag();
  }, true);

  // ============================================================
  // Event wiring
  // ============================================================

  gmOnChange(KEY_ENABLED, async () => {
    await applyGlobalEnabledState();
    await refreshLocalOwnerFlag();
  });

  gmOnChange(KEY_OWNER_ID, async () => {
    await refreshLocalOwnerFlag();
  });

  gmOnChange(KEY_OWNER_TS, async () => {
    await refreshLocalOwnerFlag();
  });

  document.addEventListener('visibilitychange', async () => {
    if (!enabledLocal) return;
    await tryResumePhantomVideo();
    setMediaSessionPlaying(true);
    await refreshLocalOwnerFlag();
  }, { passive: true });

  badge.addEventListener('click', async () => {
    const newOn = !(await getGlobalEnabled());
    await setGlobalEnabled(newOn);

    if (newOn) {
      await startKeepAlive();

      const alive = await isOwnerAlive();
      if (!alive) await claimOwner('fallback-enable');
      await refreshLocalOwnerFlag();

      installVisibilityHooksOnce();
      startOwnerHeartbeatLoop();
      startUserActivityTick();
    } else {
      stopKeepAlive();
    }
  }, { passive: true });

  // ============================================================
  // Initialization
  // ============================================================

  (async () => {
    await applyGlobalEnabledState();
    await refreshLocalOwnerFlag();
  })();

})();