// ==UserScript==
// @name         IMDb to VidPlus (Unified Integration)
// @namespace    https://www.imdb.com/
// @icon         https://vidplus.to/favicon.ico
// @version      1.0
// @description  Inline VidPlus players on IMDb: styled Episode guide on series pages, per-episode buttons on episode list pages, inline player toggle for movies/episodes if needed (matching official player style).
// @author       Grok (built on VidFast script)
// @license      MIT
// @match        https://*.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555909/IMDb%20to%20VidPlus%20%28Unified%20Integration%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555909/IMDb%20to%20VidPlus%20%28Unified%20Integration%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getImdbId() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[1] || null;
  }

  function getTmdbId() {
    // Try JSON-LD first (most reliable)
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd.textContent);
        if (data['@type'] === 'Movie' || data['@type'] === 'TVEpisode') {
          return data.sameAs?.find(url => url.includes('themoviedb.org'))?.split('/').pop() || null;
        }
      } catch (e) {}
    }
    // Fallback: Meta tag or data attributes
    const meta = document.querySelector('link[rel="alternate"][href*="themoviedb"]');
    if (meta) {
      return meta.href.split('/').pop().split('?')[0] || null;
    }
    // Ultimate fallback: Use IMDb ID (VidPlus may redirect/work)
    console.warn('TMDB ID not found, using IMDb ID as fallback');
    return getImdbId();
  }

  // ---------- Inline iframe creation (matching IMDb VidPlus Player style) ----------
  function createIframe(src) {
    const iframe = document.createElement("iframe");
    iframe.id = "vidplus-player";
    iframe.src = src;
    iframe.allowFullscreen = true;
    iframe.setAttribute("webkitallowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "true");
    Object.assign(iframe.style, {
      height: "300px",
      width: "100%",
      margin: "0 auto",
      display: "block",
      border: "none"
    });
    return iframe;
  }

  // ---------- Toggle player *after* episode card ----------
  function toggleCardPlayer(card, url) {
    const next = card.nextElementSibling;
    if (next && next.classList.contains("vp-inline-player")) {
      next.remove();
      return;
    }
    const iframe = createIframe(url);
    iframe.className = "vp-inline-player";
    card.insertAdjacentElement("afterend", iframe);
  }

  // ---------- Episode list helpers ----------
  function parseEpisodeNumbers(card, seasonDefault) {
    const label =
      card.querySelector(".ipc-title__text, .image, .info, .hover-over-image")
        ?.textContent || card.textContent;

    let m = label.match(/S(\d+)\.E(\d+)/i);
    if (m) return { season: +m[1], episode: +m[2] };

    m = label.match(/Episode\s+(\d+)/i);
    if (m) return { season: seasonDefault, episode: +m[1] };

    return null;
  }

  function getSeasonFromUrl() {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get("season") || "1", 10);
  }

  function insertEpisodeButtons() {
    const tmdbId = getTmdbId();
    if (!tmdbId) return;
    const season = getSeasonFromUrl();

    const cards = document.querySelectorAll(".episode-item-wrapper, .list_item");
    cards.forEach((card) => {
      if (card.querySelector(".vp-ep-btn")) return;

      const ep = parseEpisodeNumbers(card, season);
      if (!ep) return;
      const { season: s, episode: e } = ep;

      if (getComputedStyle(card).position === "static")
        card.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "vp-ep-btn";
      btn.textContent = "VidPlus";
      Object.assign(btn.style, {
        position: "absolute",
        right: "8px",
        bottom: "8px",
        padding: "6px 12px",
        background: "#1e40af",  // VidPlus blue theme
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "6px",
        fontSize: "13px",
        zIndex: 9999,
        opacity: 0.95
      });

      const url = `https://player.vidplus.to/embed/tv/${tmdbId}/${s}/${e}?subcolor=FFFFFF&subsize=16&subopacity=1`;
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        toggleCardPlayer(card, url);
      });

      card.appendChild(btn);
    });
  }

  // ---------- Replace Episode guide link ----------
  function styleEpisodeGuide() {
    const guideLink = document.querySelector('a[href*="/episodes"]');
    if (!guideLink) return;

    guideLink.textContent = "Episode guide (Watch on VidPlus)";

    // Adjust spacing & shift slightly left
    Object.assign(guideLink.style, {
      display: "inline-block",
      padding: "8px 12px",
      marginLeft: "4px",
      marginRight: "6px",
      background: "#1e40af",
      color: "#ffffff",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      borderRadius: "6px",
      textDecoration: "none"
    });
  }

  // ---------- Floating button for movies only ----------
  function addMovieButton() {
    if (document.getElementById("vp-main-btn")) return;

    const tmdbId = getTmdbId();
    if (!tmdbId) return;

    const url = `https://player.vidplus.to/embed/movie/${tmdbId}?subcolor=FFFFFF&subsize=16&subopacity=1`;

    const btn = document.createElement("button");
    btn.id = "vp-main-btn";
    btn.textContent = "📽 Watch on VidPlus";
    Object.assign(btn.style, {
      fontFamily: "Arial",
      position: "fixed",
      bottom: "10px",
      right: "10px",
      padding: "10px 14px",
      background: "#1e40af",
      color: "#ffffff",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      borderRadius: "6px",
      zIndex: 10001,
      filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.2))"
    });

    btn.addEventListener("click", () => {
      const existing = document.getElementById("vidplus-player");
      if (existing) {
        existing.remove();
        return;
      }
      const iframe = createIframe(url);
      const target = document.querySelector("main");
      if (target) target.before(iframe);
    });

    document.body.appendChild(btn);
  }

  // ---------- Init ----------
  function init() {
    if (location.pathname.includes("/episodes")) {
      insertEpisodeButtons();
      const mo = new MutationObserver(() => insertEpisodeButtons());
      mo.observe(document.body, { childList: true, subtree: true });
    } else if (document.title.includes("TV Series") ||
               document.title.includes("TV Mini Series")) {
      styleEpisodeGuide();
    } else {
      addMovieButton();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();