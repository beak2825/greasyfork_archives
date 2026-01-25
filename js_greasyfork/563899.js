// ==UserScript==
// @name         AniList: Color airing dots on anime lists orange if the user is behind on episodes
// @namespace    plennhar-anilist-color-airing-dots-on-anime-lists-orange-if-the-user-is-behind-on-episodes
// @version      1.0.1
// @description  On AniList anime list pages, turns the "Releasing" dot orange (Watching section only) when the user is behind the aired episode count.
// @author       Plennhar
// @match        https://anilist.co/*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563899/AniList%3A%20Color%20airing%20dots%20on%20anime%20lists%20orange%20if%20the%20user%20is%20behind%20on%20episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/563899/AniList%3A%20Color%20airing%20dots%20on%20anime%20lists%20orange%20if%20the%20user%20is%20behind%20on%20episodes.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2026 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(() => {
  "use strict";

  const CFG = {
    WATCHING_SECTION_NAME: "Watching",

    ORANGE_RGB_FALLBACK: "255,152,0",

    CACHE_KEY: "al_watching_airing_cache_v1",
    FALLBACK_TTL_MS: 6 * 60 * 60 * 1000,
    POST_AIR_GRACE_MS: 2 * 60 * 1000,
    ROUND_UP_COARSE_COUNTDOWN: true,

    MAX_CONCURRENT_UPDATES: 2,
    BACKOFF_BASE_MS: 2 * 60 * 1000,
    BACKOFF_MAX_MS: 6 * 60 * 60 * 1000,


    ENABLE_IFRAME_FALLBACK: true,
    IFRAME_TIMEOUT_MS: 20 * 1000,
    IFRAME_SELECTOR_TIMEOUT_MS: 15 * 1000,

    SCAN_DEBOUNCE_MS: 250,

    DEBUG: false,
  };

  const CLS = {
    BEHIND: "alws-behind-dot",
  };

  const log = (...args) => CFG.DEBUG && console.log("[ALWS]", ...args);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function clampInt(n, min, max) {
    n = Number(n);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, Math.trunc(n)));
  }

  function nowMs() {
    return Date.now();
  }

  async function gmGet(key, def) {
    try {
      if (typeof GM_getValue === "function") return GM_getValue(key, def);
    } catch (_) {}
    const raw = localStorage.getItem(key);
    return raw == null ? def : raw;
  }

  async function gmSet(key, val) {
    try {
      if (typeof GM_setValue === "function") return GM_setValue(key, val);
    } catch (_) {}
    localStorage.setItem(key, val);
  }

  function getRgbTripletFromCssVar(varName, fallbackTriplet) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (/^\d+\s*,\s*\d+\s*,\s*\d+$/.test(v)) return v;
    return fallbackTriplet;
  }

  function injectStyle() {
    const orangeTriplet = getRgbTripletFromCssVar("--color-orange", CFG.ORANGE_RGB_FALLBACK);

    const style = document.createElement("style");
    style.textContent = `
      :root { --alws-orange: ${orangeTriplet}; }

      /* Match AniList's green dot styling, but with orange */
      span.release-status.RELEASING.${CLS.BEHIND} {
        background: rgb(var(--alws-orange)) !important;
        background-color: rgb(var(--alws-orange)) !important;
        box-shadow: 0 0 5px rgba(var(--alws-orange), .8) !important;
        opacity: 1 !important;
      }

      /* If AniList renders the dot via pseudo-elements in some layouts */
      span.release-status.RELEASING.${CLS.BEHIND}::before,
      span.release-status.RELEASING.${CLS.BEHIND}::after {
        background: rgb(var(--alws-orange)) !important;
        background-color: rgb(var(--alws-orange)) !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  let cache = Object.create(null);
  let cacheSaveTimer = null;

  async function loadCache() {
    const raw = await gmGet(CFG.CACHE_KEY, "{}");
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_) {}
    return Object.create(null);
  }

  function scheduleSaveCache() {
    if (cacheSaveTimer) return;
    cacheSaveTimer = setTimeout(async () => {
      cacheSaveTimer = null;
      try {
        await gmSet(CFG.CACHE_KEY, JSON.stringify(cache));
      } catch (e) {
        log("Failed to save cache:", e);
      }
    }, 500);
  }

  function getCacheEntry(id) {
    return cache[id] || null;
  }

  function setCacheEntry(id, entry) {
    cache[id] = entry;
    scheduleSaveCache();
  }

  function computeBackoffMs(failCount) {
    const exp = Math.max(0, failCount - 1);
    const ms = CFG.BACKOFF_BASE_MS * Math.pow(2, exp);
    return Math.min(ms, CFG.BACKOFF_MAX_MS);
  }

  function shouldUpdateEntry(entry, now) {
    if (!entry) return true;
    if (entry.backoffUntil && now < entry.backoffUntil) return false;

    if (Number.isFinite(entry.nextCheckAt)) return now >= entry.nextCheckAt;
    if (!Number.isFinite(entry.checkedAt)) return true;

    return now >= entry.checkedAt + CFG.FALLBACK_TTL_MS;
  }

  function findWatchingWraps() {
    const wraps = Array.from(document.querySelectorAll(".list-wrap"));
    return wraps.filter((wrap) => {
      const h = wrap.querySelector(".section-name");
      if (!h) return false;
      const name = (h.textContent || "").trim();
      return name === CFG.WATCHING_SECTION_NAME;
    });
  }

  function extractAnimeIdFromEntry(entry) {
    const a =
      entry.querySelector('.title a[href^="/anime/"]') ||
      entry.querySelector('a[href^="/anime/"]');
    if (!a) return null;
    const href = a.getAttribute("href") || "";
    const m = href.match(/\/anime\/(\d+)(?:\/|$)/);
    return m ? m[1] : null;
  }

  function extractWatchedFromEntry(entry) {
    const prog = entry.querySelector(".progress");
    if (!prog) return null;
    const n = parseInt((prog.textContent || "").trim(), 10);
    return Number.isFinite(n) ? n : null;
  }

  function getReleasingDot(entry) {
    return entry.querySelector("span.release-status.RELEASING");
  }

  function applyDotColor(dotEl, watched, aired) {
    if (!dotEl) return;
    if (!Number.isFinite(watched) || !Number.isFinite(aired)) {
      dotEl.classList.remove(CLS.BEHIND);
      return;
    }
    dotEl.classList.toggle(CLS.BEHIND, watched < aired);
  }

  function parseCountdownFromDocument(doc) {
    const countdownEl =
      doc.querySelector(".data-set.airing-countdown .countdown") ||
      doc.querySelector(".airing-countdown .countdown") ||
      doc.querySelector(".data-set.airing-countdown .value");

    if (!countdownEl) return null;

    const rawText = (countdownEl.textContent || "").replace(/\s+/g, " ").trim();
    const epMatch = rawText.match(/\bEp\s*(\d+)\b/i);
    if (!epMatch) return null;

    const nextEp = parseInt(epMatch[1], 10);
    if (!Number.isFinite(nextEp)) return null;

    const tokenRe = /(\d+)\s*([dhms])\b/gi;
    let days = 0, hours = 0, mins = 0, secs = 0;

    const unitsSeen = { d: false, h: false, m: false, s: false };
    for (const m of rawText.matchAll(tokenRe)) {
      const val = parseInt(m[1], 10);
      const unit = (m[2] || "").toLowerCase();
      if (!Number.isFinite(val)) continue;
      if (unit === "d") { days = val; unitsSeen.d = true; }
      else if (unit === "h") { hours = val; unitsSeen.h = true; }
      else if (unit === "m") { mins = val; unitsSeen.m = true; }
      else if (unit === "s") { secs = val; unitsSeen.s = true; }
    }

    const hasAnyTime = unitsSeen.d || unitsSeen.h || unitsSeen.m || unitsSeen.s;

    let totalSeconds = days * 86400 + hours * 3600 + mins * 60 + secs;

    if (hasAnyTime && CFG.ROUND_UP_COARSE_COUNTDOWN) {
      let smallest = null;
      if (unitsSeen.s) smallest = "s";
      else if (unitsSeen.m) smallest = "m";
      else if (unitsSeen.h) smallest = "h";
      else if (unitsSeen.d) smallest = "d";

      if (smallest === "d") totalSeconds += 23 * 3600 + 59 * 60 + 59;
      else if (smallest === "h") totalSeconds += 59 * 60 + 59;
      else if (smallest === "m") totalSeconds += 59;
    }

    const aired = Math.max(0, nextEp - 1);

    return {
      aired,
      hasAnyTime,
      secondsUntilNext: hasAnyTime ? Math.max(0, totalSeconds) : null,
    };
  }

  async function fetchMediaPageHtml(animeId) {
    const url = `https://anilist.co/anime/${animeId}/`;
    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${url}`);
    return await resp.text();
  }

  function parseAiringFromHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return parseCountdownFromDocument(doc);
  }

  let hiddenFrame = null;
  let iframeBusy = false;

  function getOrCreateHiddenFrame() {
    if (hiddenFrame && document.contains(hiddenFrame)) return hiddenFrame;

    hiddenFrame = document.createElement("iframe");
    hiddenFrame.setAttribute("aria-hidden", "true");
    hiddenFrame.style.position = "fixed";
    hiddenFrame.style.left = "-99999px";
    hiddenFrame.style.top = "0";
    hiddenFrame.style.width = "1px";
    hiddenFrame.style.height = "1px";
    hiddenFrame.style.opacity = "0";
    hiddenFrame.style.pointerEvents = "none";
    hiddenFrame.style.border = "0";
    document.body.appendChild(hiddenFrame);

    return hiddenFrame;
  }

  function waitForSelectorInDocument(doc, selector, timeoutMs) {
    return new Promise((resolve, reject) => {
      const found = doc.querySelector(selector);
      if (found) return resolve(found);

      const root = doc.documentElement || doc;
      if (!root) return reject(new Error("No documentElement to observe"));

      const mo = new MutationObserver(() => {
        const el = doc.querySelector(selector);
        if (el) {
          mo.disconnect();
          clearTimeout(t);
          resolve(el);
        }
      });

      mo.observe(root, { childList: true, subtree: true });

      const t = setTimeout(() => {
        mo.disconnect();
        reject(new Error(`Timeout waiting for selector: ${selector}`));
      }, timeoutMs);
    });
  }

  async function extractAiringViaIframe(animeId) {
    while (iframeBusy) await sleep(50);
    iframeBusy = true;

    try {
      const frame = getOrCreateHiddenFrame();
      const url = `https://anilist.co/anime/${animeId}/`;

      const result = await new Promise((resolve, reject) => {
        let settled = false;

        const timeout = setTimeout(() => {
          cleanup();
          reject(new Error("Iframe load timeout"));
        }, CFG.IFRAME_TIMEOUT_MS);

        function cleanup() {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          frame.removeEventListener("load", onLoad);
        }

        async function onLoad() {
          try {
            const doc = frame.contentDocument;
            if (!doc) throw new Error("iframe.contentDocument unavailable");

            await waitForSelectorInDocument(
              doc,
              ".data-set.airing-countdown .countdown, .airing-countdown .countdown, .data-set.airing-countdown .value",
              CFG.IFRAME_SELECTOR_TIMEOUT_MS
            );

            const parsed = parseCountdownFromDocument(doc);
            cleanup();
            resolve(parsed);
          } catch (e) {
            cleanup();
            reject(e);
          }
        }

        frame.addEventListener("load", onLoad);
        frame.src = url;
      });

      return result;
    } finally {
      iframeBusy = false;
    }
  }

  const pendingIds = new Set();
  const inFlight = new Set();
  let activeUpdates = 0;

  function queueUpdate(animeId) {
    if (!animeId) return;
    if (inFlight.has(animeId)) return;
    pendingIds.add(animeId);
    pumpUpdates();
  }

  function pumpUpdates() {
    while (activeUpdates < CFG.MAX_CONCURRENT_UPDATES && pendingIds.size > 0) {
      const id = pendingIds.values().next().value;
      pendingIds.delete(id);
      inFlight.add(id);
      activeUpdates++;

      updateAnimeAiringInfo(id)
        .catch((e) => log("update failed:", id, e))
        .finally(() => {
          inFlight.delete(id);
          activeUpdates--;
          pumpUpdates();
        });
    }
  }

  async function updateAnimeAiringInfo(animeId) {
    const now = nowMs();
    const prev = getCacheEntry(animeId);

    if (prev?.backoffUntil && now < prev.backoffUntil) return;

    let parsed = null;
    let failureReason = null;

    try {
      const html = await fetchMediaPageHtml(animeId);
      parsed = parseAiringFromHtml(html);
    } catch (e) {
      failureReason = `fetch/parse html failed: ${String(e && e.message ? e.message : e)}`;
    }

    if (!parsed && CFG.ENABLE_IFRAME_FALLBACK) {
      try {
        parsed = await extractAiringViaIframe(animeId);
      } catch (e) {
        failureReason = failureReason
          ? `${failureReason}; iframe failed: ${String(e && e.message ? e.message : e)}`
          : `iframe failed: ${String(e && e.message ? e.message : e)}`;
      }
    }

    if (!parsed) {
      const failCount = clampInt((prev?.failCount ?? 0) + 1, 1, 50);
      const backoffMs = computeBackoffMs(failCount);
      setCacheEntry(animeId, {
        aired: prev?.aired ?? null,
        nextCheckAt: now + CFG.FALLBACK_TTL_MS,
        checkedAt: now,
        failCount,
        backoffUntil: now + backoffMs,
        lastError: failureReason || "unknown",
      });
      scheduleScan();
      return;
    }

    let nextCheckAt = null;
    if (parsed.hasAnyTime && Number.isFinite(parsed.secondsUntilNext)) {
      nextCheckAt = now + parsed.secondsUntilNext * 1000 + CFG.POST_AIR_GRACE_MS;
    } else {
      nextCheckAt = now + CFG.FALLBACK_TTL_MS;
    }

    setCacheEntry(animeId, {
      aired: Number.isFinite(parsed.aired) ? parsed.aired : null,
      nextCheckAt,
      checkedAt: now,
      failCount: 0,
      backoffUntil: null,
      lastError: null,
    });

    scheduleScan();
  }

  let scanTimer = null;

  function scheduleScan() {
    if (scanTimer) return;
    scanTimer = setTimeout(() => {
      scanTimer = null;
      scanWatchingSection();
    }, CFG.SCAN_DEBOUNCE_MS);
  }

  function scanWatchingSection() {
    const now = nowMs();
    const wraps = findWatchingWraps();
    if (!wraps.length) return;

    for (const wrap of wraps) {
      const entries = Array.from(wrap.querySelectorAll(".list-entries .entry, .list-entries .entry.row, .entry"));
      for (const entry of entries) {
        const dot = getReleasingDot(entry);
        if (!dot) continue;

        const animeId = extractAnimeIdFromEntry(entry);
        if (!animeId) continue;

        const watched = extractWatchedFromEntry(entry);
        if (!Number.isFinite(watched)) continue;

        const c = getCacheEntry(animeId);
        if (c && Number.isFinite(c.aired)) applyDotColor(dot, watched, c.aired);
        else dot.classList.remove(CLS.BEHIND);

        if (shouldUpdateEntry(c, now)) queueUpdate(animeId);
      }
    }
  }

  function hookSpaNavigation() {
    let lastHref = location.href;

    const onMaybeChanged = () => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        if (location.pathname.includes("/animelist")) scheduleScan();
      }
    };

    const _pushState = history.pushState;
    history.pushState = function (...args) {
      const r = _pushState.apply(this, args);
      onMaybeChanged();
      return r;
    };

    const _replaceState = history.replaceState;
    history.replaceState = function (...args) {
      const r = _replaceState.apply(this, args);
      onMaybeChanged();
      return r;
    };

    window.addEventListener("popstate", onMaybeChanged);
  }

  function observeDom() {
    const mo = new MutationObserver(() => scheduleScan());
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  (async function init() {
    injectStyle();
    cache = await loadCache();

    hookSpaNavigation();
    observeDom();

    scanWatchingSection();
  })();
})();