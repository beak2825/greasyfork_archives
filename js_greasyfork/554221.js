// ==UserScript==
// @name         YouTube: Hide "Members Only" Videos
// @namespace    https://github.com/krrrrrrk/youtube-hide-members-only
// @version      1.0
// @description  Hides all YouTube videos with the "Members only" badge.
// @author       krrrrrrk
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Krrrrrrk/YouTube-Hide-Members-only-videos
// @downloadURL https://update.greasyfork.org/scripts/554221/YouTube%3A%20Hide%20%22Members%20Only%22%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/554221/YouTube%3A%20Hide%20%22Members%20Only%22%20Videos.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- Config --------------------------------------------------------------
  // Badge text to match (case-insensitive). Add translations if you need them.
  const BADGE_TEXTS = [
    "Members only",
    // "Miembros solamente", "Nur für Mitglieder", etc.
  ].map(s => s.toLowerCase());

  // Which container tags we consider a "video tile"
  const VIDEO_TILE_SELECTORS = [
    // Classic & search
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
    "ytd-playlist-video-renderer",
    "ytd-rich-item-renderer",
    "ytd-reel-item-renderer",         // Shorts in some contexts
    "ytd-radio-renderer",
    // New(er) lockup model you pasted
    ".yt-lockup-view-model",
  ].join(",");

  // A few known badge containers/leafs that may contain the text
  const BADGE_SELECTORS = [
    ".yt-badge-shape__text",
    ".yt-content-metadata-view-model__badge",
    "yt-badge-view-model",
    "badge-shape",
    // Fallback: anything in content metadata blocks
    ".yt-content-metadata-view-model",
  ].join(",");

  // --- Helpers -------------------------------------------------------------
  const lc = s => (s || "").toLowerCase();

  function isMembersOnlyBadge(el) {
    const txt = lc(el.textContent || "");
    return BADGE_TEXTS.some(t => txt.includes(t));
  }

  function findVideoTile(start) {
    if (!start) return null;
    // climb up to a recognized tile container
    return start.closest(VIDEO_TILE_SELECTORS);
  }

  function hideTile(tile) {
    if (!tile || tile.dataset._tmMembersHidden === "1") return;
    tile.style.display = "none";
    tile.dataset._tmMembersHidden = "1";
  }

  function processNode(root) {
    if (!root || root.nodeType !== 1) return;

    // Fast path: if the node itself is a badge, check it
    if (root.matches && root.matches(BADGE_SELECTORS) && isMembersOnlyBadge(root)) {
      const tile = findVideoTile(root);
      if (tile) hideTile(tile);
      return;
    }

    // Otherwise, look inside for any badges
    const badges = root.querySelectorAll(BADGE_SELECTORS);
    for (const b of badges) {
      if (isMembersOnlyBadge(b)) {
        const tile = findVideoTile(b);
        if (tile) hideTile(tile);
      }
    }
  }

  // Debounced rescans help when Polymer reflows a lot at once.
  let pending = false;
  function rescanSoon() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      processNode(document.body);
    });
  }

  // Initial pass
  processNode(document.body);

  // Watch for dynamic additions
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      // Process added nodes (tiles/badges often arrive as fragments)
      m.addedNodes && m.addedNodes.forEach(node => processNode(node));
      // If text changed inside a badge, rescan
      if (m.type === "characterData") rescanSoon();
    }
  });

  mo.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Also rescan on route changes (YouTube SPA navigation)
  const pushState = history.pushState;
  const replaceState = history.replaceState;
  function onNav() { setTimeout(() => processNode(document.body), 300); }
  history.pushState = function () { pushState.apply(this, arguments); onNav(); };
  history.replaceState = function () { replaceState.apply(this, arguments); onNav(); };
  window.addEventListener("yt-navigate-finish", onNav);
  window.addEventListener("popstate", onNav);
})();
