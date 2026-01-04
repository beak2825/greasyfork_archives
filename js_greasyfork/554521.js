// ==UserScript==
// @name         IMDb to Download
// @namespace    https://www.imdb.com/
// @icon         https://vidsrc.vip/favicon.ico
// @version      1.0
// @description  Adds "Download" buttons on IMDb pages linking to VidSrc download URLs for movies and TV episodes.
// @author       
// @license      MIT
// @match        https://*.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554521/IMDb%20to%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/554521/IMDb%20to%20Download.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Extract IMDb ID
  function getImdbId() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[1] || null;
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

  // ---------- Add episode Download buttons ----------
  function insertEpisodeButtons() {
    const imdbId = getImdbId();
    if (!imdbId) return;
    const season = getSeasonFromUrl();

    const cards = document.querySelectorAll(".episode-item-wrapper, .list_item");
    cards.forEach((card) => {
      if (card.querySelector(".vf-dl-btn")) return;

      const ep = parseEpisodeNumbers(card, season);
      if (!ep) return;
      const { season: s, episode: e } = ep;

      if (getComputedStyle(card).position === "static")
        card.style.position = "relative";

      const btn = document.createElement("a");
      btn.className = "vf-dl-btn";
      btn.textContent = "Download";
      btn.href = `https://dl.vidsrc.vip/tv/${imdbId}/${s}/${e}`;
      btn.target = "_blank";
      Object.assign(btn.style, {
        position: "absolute",
        right: "8px",
        bottom: "8px",
        padding: "6px 12px",
        background: "#125784",
        color: "#bad8eb",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "6px",
        fontSize: "13px",
        zIndex: 9999,
        opacity: 0.95,
        textDecoration: "none",
      });

      card.appendChild(btn);
    });
  }

  // ---------- Replace Episode guide link ----------
  function styleEpisodeGuide() {
    const guideLink = document.querySelector('a[href*="/episodes"]');
    if (!guideLink) return;

    guideLink.textContent = "Episode guide (Download via VidSrc)";
    Object.assign(guideLink.style, {
      display: "inline-block",
      padding: "8px 12px",
      marginLeft: "4px",
      marginRight: "6px",
      background: "#125784",
      color: "#bad8eb",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      borderRadius: "6px",
      textDecoration: "none",
    });
  }

  // ---------- Floating button for movies ----------
  function addMovieButton() {
    if (document.getElementById("vf-dl-main-btn")) return;

    const imdbId = getImdbId();
    if (!imdbId) return;

    const url = `https://dl.vidsrc.vip/movie/${imdbId}`;

    const btn = document.createElement("a");
    btn.id = "vf-dl-main-btn";
    btn.textContent = "Download";
    btn.href = url;
    btn.target = "_blank";
    Object.assign(btn.style, {
      fontFamily: "Arial",
      position: "fixed",
      bottom: "10px",
      right: "10px",
      padding: "10px 14px",
      background: "#125784",
      color: "#bad8eb",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      borderRadius: "6px",
      zIndex: 10001,
      filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.2))",
      textDecoration: "none",
    });

    document.body.appendChild(btn);
  }

  // ---------- Init ----------
  function init() {
    if (location.pathname.includes("/episodes")) {
      insertEpisodeButtons();
      const mo = new MutationObserver(() => insertEpisodeButtons());
      mo.observe(document.body, { childList: true, subtree: true });
    } else if (
      document.title.includes("TV Series") ||
      document.title.includes("TV Mini Series")
    ) {
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