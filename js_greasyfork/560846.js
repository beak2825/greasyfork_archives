// ==UserScript==
// @name         Youtube → M.Youtube.com（100%）Fork by YouTube Minimal Switcher (Coq-Style Total + Perf-First)
// @version      0.8
// @description  Perf-first & formally-friendly: total URL parsing, strong sanitize, domain-allowlist, one-shot hop.
// @namespace    http://tampermonkey.net/
// @author       ?
// @license      CC-BY-4.0
// @run-at       document-start
// @noframes
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/560846/Youtube%20%E2%86%92%20MYoutubecom%EF%BC%88100%25%EF%BC%89Fork%20by%20YouTube%20Minimal%20Switcher%20%28Coq-Style%20Total%20%2B%20Perf-First%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560846/Youtube%20%E2%86%92%20MYoutubecom%EF%BC%88100%25%EF%BC%89Fork%20by%20YouTube%20Minimal%20Switcher%20%28Coq-Style%20Total%20%2B%20Perf-First%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // Coq-ish FORMAL MODEL (comments only)
  //
  // (* Abstract state at document-start *)
  // Record State := {
  //   curHost : string;
  //   curPath : string;
  //   cookieHop : option string;   (* raw cookie string *)
  // }.
  //
  // Definition AllowedHost (h:string) : Prop :=
  //   h = "youtube.com" \/ h = "www.youtube.com" \/ h = "m.youtube.com".
  //
  // Definition sanitize (u:URL) : URL :=
  //   u with queryParams := (remove "persist_app" (remove "app" u.queryParams)).
  //
  // Definition appForHost (h:string) : string :=
  //   if startsWith "m." h then "m" else "desktop".
  //
  // Invariants we enforce by construction:
  //
  // INV_SINGLE_REDIRECT:
  //   In one run, at most one location.replace is executed.
  //
  // INV_COOKIE_ONESHOT:
  //   If hop cookie exists, it is deleted BEFORE any redirect attempt.
  //
  // INV_URL_SANITIZE_STRONG:
  //   Final redirect URL has:
  //     - no persist_app
  //     - exactly one app param, matching destination host
  //
  // INV_NO_OPEN_REDIRECT:
  //   Redirect only to AllowedHost; otherwise do nothing.
  //
  // Totality / “no exceptions” principle:
  //   All URL parsing is guarded; malformed inputs lead to safe no-op.
  // ─────────────────────────────────────────────────────────────

  const COOKIE_NAME = 'userjs-ym-url';
  const COOKIE_MAX_AGE_SEC = 30;

  // Keep cookie shared across youtube.com subdomains (m./www.)
  const COOKIE_ATTR = 'Domain=.youtube.com; Path=/; Secure; SameSite=Lax';

  // ─────────────────────────────────────────────────────────────
  // Total URL parsing (never throw)
  // ─────────────────────────────────────────────────────────────
  function tryParseUrl(s) {
    try { return new URL(s); } catch { return null; }
  }

  function isAllowedHost(host) {
    return host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com';
  }

  function canonicalizeHost(u) {
    // Normalize youtube.com -> www.youtube.com (optional but makes proofs simpler)
    if (u.hostname === 'youtube.com') u.hostname = 'www.youtube.com';
    return u;
  }

  function sanitizeUrlObj(u) {
    // Remove switching control params; ensures sanitize idempotence
    u.searchParams.delete('persist_app');
    u.searchParams.delete('app');
    return u;
  }

  function appForHost(host) {
    return host.startsWith('m.') ? 'm' : 'desktop';
  }

  function enforceFinalApp(u) {
    // Strong sanitize + correct app for destination host
    sanitizeUrlObj(u);
    u.searchParams.set('app', appForHost(u.hostname));
    return u;
  }

  // ─────────────────────────────────────────────────────────────
  // Ultra-lite cookie helpers (robust boundary matching)
  // ─────────────────────────────────────────────────────────────
  function getCookieValue(name) {
    const all = document.cookie;
    if (!all) return '';

    // Find exact token boundary: start or '; ' then name=
    const key = name + '=';
    let i = 0;

    while (true) {
      const idx = all.indexOf(key, i);
      if (idx < 0) return '';

      // boundary check: idx==0 OR preceded by ';'
      const okBoundary = (idx === 0) || (all.charCodeAt(idx - 1) === 59 /* ';' */);
      if (okBoundary) {
        let end = all.indexOf(';', idx);
        if (end < 0) end = all.length;
        const raw = all.slice(idx + key.length, end);
        try { return decodeURIComponent(raw); } catch { return raw; }
      }
      i = idx + key.length;
    }
  }

  function setCookieValue(name, value, maxAgeSec) {
    // Keep it short-lived; enough for one hop
    const v = encodeURIComponent(value);
    document.cookie = `${name}=${v}; Max-Age=${maxAgeSec}; ${COOKIE_ATTR}`;
  }

  function deleteCookieValue(name) {
    document.cookie = `${name}=; Max-Age=0; ${COOKIE_ATTR}`;
  }

  // ─────────────────────────────────────────────────────────────
  // Phase 0: cookie hop (highest priority)
  // ─────────────────────────────────────────────────────────────
  const hopRaw = getCookieValue(COOKIE_NAME);
  if (hopRaw) {
    // INV_COOKIE_ONESHOT: delete before any redirect attempt
    deleteCookieValue(COOKIE_NAME);

    // Total parsing + allowlist => INV_NO_OPEN_REDIRECT
    const hopU = tryParseUrl(hopRaw);
    if (hopU && isAllowedHost(hopU.hostname) && hopU.hostname.endsWith('youtube.com')) {
      canonicalizeHost(hopU);
      enforceFinalApp(hopU); // INV_URL_SANITIZE_STRONG
      location.replace(hopU.toString()); // INV_SINGLE_REDIRECT via early return
    }
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // Phase 1: menu switch (only on top-level doc)
  // ─────────────────────────────────────────────────────────────
  const canMenu = (typeof GM_registerMenuCommand === 'function');
  if (!canMenu) return;

  const isMobileSite = location.hostname.startsWith('m.');
  const eligibleReturn = (location.pathname === '/' || location.pathname === '/watch');
  // (Intentionally minimal: only home/watch like original intent)

  function addMenu(label, landingUrl, toMobile) {
    GM_registerMenuCommand(label, function () {
      // Menu click path: we only parse URL once for performance
      if (eligibleReturn) {
        const curU = tryParseUrl(location.href);
        if (curU && curU.hostname && curU.hostname.endsWith('youtube.com')) {
          sanitizeUrlObj(curU);
          // Swap host deterministically
          curU.hostname = toMobile ? 'm.youtube.com' : 'www.youtube.com';
          canonicalizeHost(curU);

          // Store sanitized swapped URL (no app/persist_app)
          // (Next page load consumes it once)
          setCookieValue(COOKIE_NAME, curU.toString(), COOKIE_MAX_AGE_SEC);
        }
      }
      // Landing URL is fixed constant; replace avoids history bloat
      location.replace(landingUrl);
    });
  }

  if (!isMobileSite) {
    // desktop -> mobile
    addMenu('Switch to YouTube Mobile (persist)', 'https://m.youtube.com/?persist_app=1&app=m', true);
    addMenu('Switch to YouTube Mobile (temp)',    'https://m.youtube.com/?persist_app=0&app=m', true);
  } else {
    // mobile -> desktop
    addMenu('Switch to YouTube Desktop (persist)', 'https://www.youtube.com/?persist_app=1&app=desktop', false);
    addMenu('Switch to YouTube Desktop (temp)',    'https://www.youtube.com/?persist_app=0&app=desktop', false);
  }

})();
