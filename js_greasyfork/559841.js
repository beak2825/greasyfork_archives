// ==UserScript==
// @name         Reddit: Use System Theme
// @namespace    https://example.com/
// @version      1.6.1
// @description  Sync Reddit night mode to OS theme; persists via GraphQL; updates all tabs + new tabs without reload.
// @license MIT
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559841/Reddit%3A%20Use%20System%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/559841/Reddit%3A%20Use%20System%20Theme.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const GRAPHQL_URL = "https://www.reddit.com/svc/shreddit/graphql";
  const OPERATION = "UpdateAccountPreferences";
  const MIN_MS_BETWEEN_SERVER_UPDATES = 10_000;

  const SYNC_KEY = "reddit_theme_sync_v1";
  const CHANNEL_NAME = "reddit-theme-sync-v1";
  const GM_SYNC_KEY = "reddit_theme_sync_gm_v1";

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  let inFlight = false;

  const bc = ("BroadcastChannel" in window) ? new BroadcastChannel(CHANNEL_NAME) : null;

  // Helps avoid infinite fights with the page
  let lastApplied = null; // boolean|null
  let lastSeenTs = 0;

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const part of cookies) {
      const eq = part.indexOf("=");
      const key = eq >= 0 ? part.slice(0, eq) : part;
      if (key === name) return eq >= 0 ? decodeURIComponent(part.slice(eq + 1)) : "";
    }
    return null;
  }

  function setCookie(name, value, { domain, maxAgeSeconds = 31536000 } = {}) {
    const base = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    const domainPart = domain ? `; Domain=${domain}` : "";
    document.cookie = base + domainPart + secure;
  }

  function findCsrfInInlineScripts() {
    const scripts = Array.from(document.scripts || []);
    for (const s of scripts) {
      if (s.src) continue;
      const t = s.textContent || "";
      if (!t) continue;

      const m =
        t.match(/"csrfToken"\s*:\s*"([a-f0-9]{16,})"/i) ||
        t.match(/csrfToken\s*:\s*"([a-f0-9]{16,})"/i) ||
        t.match(/"csrf_token"\s*:\s*"([a-f0-9]{16,})"/i) ||
        t.match(/csrf_token\s*:\s*"([a-f0-9]{16,})"/i);

      if (m?.[1]) return m[1];
    }
    return null;
  }

  function getCsrfToken() {
    const fromCookie = getCookie("csrf_token");
    if (fromCookie) return fromCookie;

    const meta = document.querySelector('meta[name="csrf-token"], meta[name="csrf_token"]');
    if (meta?.content) return meta.content;

    try {
      const r = unsafeWindow?.__r;
      const t = r?.config?.csrfToken || r?.config?.csrf_token;
      if (t) return t;
    } catch {}

    return findCsrfInInlineScripts();
  }

  function desiredNightModeEnabled() {
    return !!media.matches;
  }

  function applyClientTheme(isDark) {
    isDark = !!isDark;
    if (lastApplied === isDark) return;
    lastApplied = isDark;

    const mode = isDark ? "dark" : "light";
    const night = isDark ? "1" : "0";

    // Common immediate switches
    document.documentElement.style.colorScheme = mode;

    // These attributes/classes are “best effort”; harmless if ignored.
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.setAttribute("data-color-mode", mode);
    document.documentElement.setAttribute("data-nightmode", night);

    document.documentElement.classList.toggle("theme-dark", isDark);
    document.documentElement.classList.toggle("theme-light", !isDark);

    // Best-effort hints Reddit variants commonly respect:
    setCookie("nightmode", night, { domain: location.hostname });
    setCookie("nightmode", night, { domain: ".reddit.com" });

    try {
      localStorage.setItem("nightmode", isDark ? "true" : "false");
      localStorage.setItem("theme", mode);
      localStorage.setItem("reddit_theme", mode);
    } catch {}
  }

  function broadcastTheme(isDark) {
    const msg = { isDark: !!isDark, ts: Date.now() };
    lastSeenTs = Math.max(lastSeenTs, msg.ts);

    try { localStorage.setItem(SYNC_KEY, JSON.stringify(msg)); } catch {}
    try { bc?.postMessage(msg); } catch {}
    try { GM_setValue(GM_SYNC_KEY, msg); } catch {}
  }

  function readPersistedTheme() {
    try {
      const raw = localStorage.getItem(SYNC_KEY);
      if (!raw) return null;
      const msg = JSON.parse(raw);
      if (!msg || typeof msg.isDark !== "boolean") return null;
      return msg;
    } catch {
      return null;
    }
  }

  async function updatePreferenceServer(isNightModeEnabled) {
    const csrf = getCsrfToken();
    if (!csrf) return { ok: false, reason: "missing_csrf" };

    const payload = {
      operation: OPERATION,
      variables: { input: { isNightModeEnabled } },
      csrf_token: csrf,
    };

    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      credentials: "include",
      headers: { "accept": "application/json", "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    return { ok: res.ok, reason: res.ok ? null : `http_${res.status}` };
  }

  async function syncFromThisTab() {
    if (inFlight) return;

    const desired = desiredNightModeEnabled();
    const lastDesired = GM_getValue("lastDesired", null);
    const lastUpdateAt = GM_getValue("lastUpdateAt", 0);
    const now = Date.now();

    inFlight = true;
    try {
      applyClientTheme(desired);
      broadcastTheme(desired);

      if (!(lastDesired === desired && (now - lastUpdateAt) < MIN_MS_BETWEEN_SERVER_UPDATES)) {
        const result = await updatePreferenceServer(desired);
        if (result.ok) {
          GM_setValue("lastDesired", desired);
          GM_setValue("lastUpdateAt", now);
        }
      }
    } finally {
      inFlight = false;
    }
  }

  function catchUpLocally() {
    const persisted = readPersistedTheme();
    if (persisted) {
      if (typeof persisted.ts === "number") lastSeenTs = Math.max(lastSeenTs, persisted.ts);
      applyClientTheme(persisted.isDark);
      return;
    }
    applyClientTheme(desiredNightModeEnabled());
  }

  function handleIncoming(msg) {
    if (!msg || typeof msg.isDark !== "boolean") return;
    const ts = (typeof msg.ts === "number") ? msg.ts : 0;
    if (ts && ts <= lastSeenTs) return;
    if (ts) lastSeenTs = ts;
    applyClientTheme(msg.isDark);
  }

  // --- NEW: re-apply on SPA route changes (fixes /r/popular/ + other feeds) ---
  function reapplySoon() {
    // Let Reddit finish its own routing/hydration, then “win back” theme.
    catchUpLocally();
    setTimeout(catchUpLocally, 50);
    setTimeout(catchUpLocally, 250);
    setTimeout(catchUpLocally, 1200);
  }

  function installSpaHook() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    history.pushState = function (...args) {
      origPush.apply(this, args);
      reapplySoon();
    };
    history.replaceState = function (...args) {
      origReplace.apply(this, args);
      reapplySoon();
    };

    window.addEventListener("popstate", () => reapplySoon(), true);
  }

  // --- NEW: watch for Reddit overriding html attrs/classes after hydration ---
  function installAntiOverrideObserver() {
    const target = document.documentElement;
    if (!target || typeof MutationObserver === "undefined") return;

    const obs = new MutationObserver(() => {
      // If Reddit flips theme attributes/classes, re-assert ours.
      // (Debounced by lastApplied de-dupe.)
      catchUpLocally();
    });

    obs.observe(target, { attributes: true, attributeFilter: ["class", "data-theme", "data-color-mode", "style"] });
  }

  // Startup behavior
  catchUpLocally();
  setTimeout(catchUpLocally, 250);
  setTimeout(catchUpLocally, 1500);

  installSpaHook();
  installAntiOverrideObserver();

  // OS theme changes while this tab is open
  media.addEventListener?.("change", () => syncFromThisTab());

  // Receive from other tabs
  bc?.addEventListener?.("message", (e) => handleIncoming(e.data));
  window.addEventListener("storage", (e) => {
    if (e.key !== SYNC_KEY || !e.newValue) return;
    try { handleIncoming(JSON.parse(e.newValue)); } catch {}
  });
  if (typeof GM_addValueChangeListener === "function") {
    GM_addValueChangeListener(GM_SYNC_KEY, (_name, _oldValue, newValue, _remote) => {
      handleIncoming(newValue);
    });
  }

  // When you “re-open” an existing tab / BFCache restore
  window.addEventListener("focus", catchUpLocally);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) catchUpLocally(); });
  window.addEventListener("pageshow", () => catchUpLocally(), true);

  // Server sync once csrf appears
  (function serverRetry() {
    let attempts = 0;
    const maxAttempts = 10;
    const tick = () => {
      attempts++;
      if (getCsrfToken()) syncFromThisTab();
      if (attempts < maxAttempts && !getCsrfToken()) setTimeout(tick, 750);
    };
    setTimeout(tick, 750);
  })();
})();