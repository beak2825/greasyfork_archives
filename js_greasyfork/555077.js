// ==UserScript==
// @name         IMDb to VidSrc (open in new tab)
// @namespace    https://www.imdb.com/
// @icon         https://vidsrc.net/favicon.ico
// @version      1.3
// @description  Adds VidSrc buttons on IMDb: floating button for movies/shows, styled Episode guide link, per-episode buttons on episode list pages. Always opens in a new tab.
// @match        https://*.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555077/IMDb%20to%20VidSrc%20%28open%20in%20new%20tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555077/IMDb%20to%20VidSrc%20%28open%20in%20new%20tab%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getImdbId() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[1] || null;
  }

  function getSeasonFromUrl() {
    const params = new URLSearchParams(location.search);
    return parseInt(params.get("season") || "1", 10);
  }

  function findEpisodeCards() {
    return document.querySelectorAll(".episode-item-wrapper, .list_item");
  }

  function parseEpisodeNumbers(card, seasonDefault) {
    const label =
      card.querySelector(".ipc-title__text, .image, .info, .hover-over-image")
        ?.textContent || card.textContent;

    let m = label.match(/S(\d+)\.E(\d+)/i);
    if (m) return { season: +m[1], episode: +m[2] };

    m = label.match(/Episode\s+(\d+)/i);
    if (m) return { season: seasonDefault, episode: +m[1] };

    const index = Array.from(card.parentNode.children).indexOf(card) + 1;
    return { season: seasonDefault, episode: index };
  }

  function insertEpisodeButtons() {
    const imdbId = getImdbId();
    if (!imdbId) return;
    const season = getSeasonFromUrl();

    findEpisodeCards().forEach((card) => {
      if (card.querySelector(".vs-ep-btn")) return;

      const ep = parseEpisodeNumbers(card, season);
      if (!ep) return;
      const { season: s, episode: e } = ep;

      if (getComputedStyle(card).position === "static")
        card.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "vs-ep-btn";
      btn.textContent = "VidSrc";
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
        opacity: 0.95
      });

      const url = `https://vidsrc-embed.ru/embed/tv/${imdbId}?season=${s}&episode=${e}`;
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        window.open(url, "_blank");
      });

      card.appendChild(btn);
    });
  }

  function styleEpisodeGuide() {
    const guideLink = document.querySelector('a[href*="/episodes"]');
    if (!guideLink) return;

    guideLink.textContent = "Episode guide (Watch on VidSrc)";
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
      textDecoration: "none"
    });
  }

  function addMainButton() {
    if (document.getElementById("vs-main-btn")) return;

    const imdbId = getImdbId();
    if (!imdbId) return;

    const btn = document.createElement("button");
    btn.id = "vs-main-btn";
    btn.textContent = "📽 Watch on VidSrc";
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
      filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.2))"
    });

    btn.addEventListener("click", () => {
      const isMovie =
    document.title.indexOf("TV Series") === -1 &&
    document.title.indexOf("TV Mini Series") === -1 &&
    document.title.indexOf("Episode") === -1;
      const url = isMovie
        ? `https://vidsrc-embed.ru/embed/movie/${imdbId}`
        : `https://vidsrc-embed.ru/embed/tv/${imdbId}?season=1&episode=1`;
      window.open(url, "_blank");
    });

    document.body.appendChild(btn);
  }

  function init() {
    if (location.pathname.includes("/episodes")) {
      insertEpisodeButtons();
      const mo = new MutationObserver(() => insertEpisodeButtons());
      mo.observe(document.body, { childList: true, subtree: true });
    } else if (document.title.includes("TV Series") || document.title.includes("TV Mini Series")) {
      styleEpisodeGuide();
    } else {
      addMainButton();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();