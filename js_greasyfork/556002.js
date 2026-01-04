// ==UserScript==
// @name         IMDb to VidPlus (Fast & Unified !!)
// @namespace    https://www.imdb.com/
// @icon         https://vidplus.to/favicon.ico
// @version      1.2
// @description  Fast inline VidPlus player on IMDb: floating button for movies, episode buttons, styled guide. Optimized.
// @author       Grok
// @license      MIT
// @match        https://*.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556002/IMDb%20to%20VidPlus%20%28Fast%20%20Unified%20%21%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556002/IMDb%20to%20VidPlus%20%28Fast%20%20Unified%20%21%21%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getImdbId() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[1] || null;
  }

  function getTmdbId() {
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd.textContent);
        if (data['@type'] === 'Movie' || data['@type'] === 'TVEpisode') {
          return data.sameAs?.find(url => url.includes('themoviedb.org'))?.split('/').pop() || null;
        }
      } catch (e) {}
    }
    const meta = document.querySelector('link[rel="alternate"][href*="themoviedb"]');
    if (meta) return meta.href.split('/').pop().split('?')[0] || null;
    console.warn('TMDB ID not found, using IMDb ID fallback');
    return getImdbId();
  }

  // ---------- Fast iframe ----------
  function createIframe(src) {
    const iframe = document.createElement("iframe");
    iframe.id = "vidplus-player";
    iframe.src = "about:blank";
    iframe.setAttribute("data-src", src + "&autoplay=1");
    iframe.allowFullscreen = true;
    iframe.setAttribute("webkitallowfullscreen", "true");
    iframe.setAttribute("mozallowfullscreen", "true");
    iframe.loading = "lazy";
    iframe.referrerPolicy = "origin";
    Object.assign(iframe.style, {
      height: "300px",
      width: "100%",
      margin: "0 auto",
      display: "block",
      border: "none"
    });
    setTimeout(() => { iframe.src = iframe.getAttribute("data-src"); }, 100);
    return iframe;
  }

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

  function parseEpisodeNumbers(card, seasonDefault) {
    const label = card.querySelector(".ipc-title__text, .image, .info, .hover-over-image")?.textContent || card.textContent;
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
      if (getComputedStyle(card).position === "static") card.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "vp-ep-btn";
      btn.textContent = "Watch";  // ← ONLY THIS LINE CHANGED
      Object.assign(btn.style, {
        position: "absolute",
        right: "8px",
        bottom: "8px",
        padding: "6px 12px",
        background: "#1e40af",
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

  function styleEpisodeGuide() {
    const guideLink = document.querySelector('a[href*="/episodes"]');
    if (!guideLink) return;
    guideLink.textContent = "Episode guide (Watch on VidPlus)";
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

  function addMovieButton() {
    if (document.getElementById("vp-main-btn")) return;
    const tmdbId = getTmdbId();
    if (!tmdbId) return;
    const url = `https://player.vidplus.to/embed/movie/${tmdbId}?subcolor=FFFFFF&subsize=16&subopacity=1`;

    const btn = document.createElement("button");
    btn.id = "vp-main-btn";
    btn.textContent = "Watch";  // ← ONLY THIS LINE CHANGED
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
      if (existing) { existing.remove(); return; }
      const iframe = createIframe(url);
      const target = document.querySelector("main");
      if (target) target.before(iframe);
    });

    document.body.appendChild(btn);
  }

  function init() {
    if (!document.querySelector('link[rel="preconnect"][href="https://player.vidplus.to"]')) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://player.vidplus.to";
      document.head.appendChild(link);
    }

    if (location.pathname.includes("/episodes")) {
      insertEpisodeButtons();
      const mo = new MutationObserver(insertEpisodeButtons);
      mo.observe(document.body, { childList: true, subtree: true });
    } else if (document.title.includes("TV Series") || document.title.includes("TV Mini Series")) {
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