// ==UserScript==
// @name         TMDB to VidPlus (Fast & Unified !!)
// @namespace    https://www.themoviedb.org/
// @icon         https://vidplus.to/favicon.ico
// @version      1.2
// @description  Fast inline VidPlus player on TMDB: floating button for movies, episode buttons on seasons. Optimized.
// @author       Grok
// @license      MIT
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556003/TMDB%20to%20VidPlus%20%28Fast%20%20Unified%20%21%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556003/TMDB%20to%20VidPlus%20%28Fast%20%20Unified%20%21%21%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getTmdbIdAndType() {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] === "movie") return { id: parts[1], type: "movie" };
    if (parts[0] === "tv") return { id: parts[1], type: "tv" };
    return null;
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

  function togglePlayer(container, url) {
    const existing = document.getElementById("vidplus-player");
    if (existing) { existing.remove(); return; }
    const iframe = createIframe(url);
    container.insertAdjacentElement("afterend", iframe);
  }

  function insertEpisodeButtons() {
    const { id: tmdbId } = getTmdbIdAndType();
    if (!tmdbId || !location.pathname.includes("/season/")) return;
    const seasonMatch = location.pathname.match(/\/season\/(\d+)/);
    const season = seasonMatch ? parseInt(seasonMatch[1], 10) : 1;

    const episodes = document.querySelectorAll('h3 a[href*="/episode/"], h4 a[href*="/episode/"]');
    episodes.forEach((link) => {
      const epLink = link.closest('h3') || link.closest('h4') || link.parentElement;
      if (epLink.querySelector(".vp-ep-btn")) return;

      const epMatch = link.href.match(/\/episode\/(\d+)/);
      if (!epMatch) return;
      const episode = parseInt(epMatch[1], 10);

      const btn = document.createElement("button");
      btn.className = "vp-ep-btn";
      btn.textContent = "Watch";  // ← ONLY THIS LINE CHANGED
      Object.assign(btn.style, {
        marginLeft: "10px",
        padding: "4px 8px",
        background: "#1e40af",
        color: "#ffffff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "4px",
        fontSize: "12px",
        verticalAlign: "middle"
      });

      const url = `https://player.vidplus.to/embed/tv/${tmdbId}/${season}/${episode}?subcolor=FFFFFF&subsize=16&subopacity=1`;
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        togglePlayer(epLink, url);
      });

      epLink.style.display = "inline-flex";
      epLink.style.alignItems = "center";
      epLink.appendChild(btn);
    });

    const mo = new MutationObserver(insertEpisodeButtons);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function styleEpisodesTab() {
    const tab = document.querySelector('a[href*="/episodes"], .tab[href*="/episodes"]');
    if (!tab) return;
    tab.textContent = "Episodes (Watch on VidPlus)";
    Object.assign(tab.style, {
      padding: "8px 12px",
      background: "#1e40af",
      color: "#ffffff",
      borderRadius: "6px",
      textDecoration: "none",
      fontWeight: "bold"
    });
  }

  function addMovieButton() {
    const { id: tmdbId, type } = getTmdbIdAndType();
    if (type !== "movie" || document.getElementById("vp-main-btn")) return;
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
      const overview = document.querySelector(".overview, p[data-purpose='overview']");
      if (overview) {
        togglePlayer(overview, url);
      } else {
        document.body.appendChild(createIframe(url));
      }
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

    const { type } = getTmdbIdAndType();
    if (!type) return;

    if (location.pathname.includes("/season/")) {
      insertEpisodeButtons();
    } else if (type === "tv") {
      styleEpisodesTab();
    } else if (type === "movie") {
      addMovieButton();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();