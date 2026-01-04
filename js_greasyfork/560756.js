// ==UserScript==
// @name         Mobile IMDb to 2Embed (Fast & Working)
// @namespace    https://m.imdb.com/
// @icon         https://www.2embed.cc/favicon.ico
// @version      1.0
// @description  Inline 2Embed player on mobile IMDb: floating Stream button, episode buttons, yellow theme, super stable.
// @author       Grok
// @license      MIT
// @match        https://m.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560756/Mobile%20IMDb%20to%202Embed%20%28Fast%20%20Working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560756/Mobile%20IMDb%20to%202Embed%20%28Fast%20%20Working%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Preconnect for speed
  const link = document.createElement("link");
  link.rel = "preconnect";
  link.href = "https://www.2embed.cc";
  document.head.appendChild(link);

  function getTmdbId() {
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd.textContent);
        const sameAs = Array.isArray(data.sameAs) ? data.sameAs : [];
        const tmdb = sameAs.find(u => typeof u === 'string' && u.includes('themoviedb.org'));
        if (tmdb) return tmdb.split('/').pop().split('?')[0];
      } catch (e) {}
    }
    return null;
  }

  function createIframe(src) {
    const iframe = document.createElement("iframe");
    iframe.src = "about:blank";
    iframe.setAttribute("data-src", src);
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.style.width = "100%";
    iframe.style.height = "300px";
    iframe.style.border = "none";
    iframe.style.margin = "10px 0";
    iframe.style.display = "block";
    setTimeout(() => { iframe.src = iframe.getAttribute("data-src"); }, 150);
    return iframe;
  }

  function toggleCardPlayer(card, url) {
    const next = card.nextElementSibling;
    if (next && next.classList.contains("embed-inline-player")) {
      next.remove();
      return;
    }
    const iframe = createIframe(url);
    iframe.className = "embed-inline-player";
    card.insertAdjacentElement("afterend", iframe);
  }

  function parseEpisodeNumbers(card, seasonDefault) {
    const text = card.textContent || "";
    let m = text.match(/S(\d+)[.:]?\s*E(\d+)/i);
    if (m) return { season: +m[1], episode: +m[2] };
    m = text.match(/Episode\s+(\d+)/i);
    if (m) return { season: seasonDefault, episode: +m[1] };
    return null;
  }

  function getSeasonFromUrl() {
    return parseInt(new URLSearchParams(location.search).get("season") || "1", 10);
  }

  function insertEpisodeButtons() {
    const tmdbId = getTmdbId();
    if (!tmdbId) return;
    const season = getSeasonFromUrl();
    const cards = document.querySelectorAll(".ipc-list__item, .episode-item, [data-testid='episode-list-item']");
    cards.forEach(card => {
      if (card.querySelector(".embed-ep-btn")) return;
      const ep = parseEpisodeNumbers(card, season);
      if (!ep) return;
      card.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "embed-ep-btn";
      btn.textContent = "Stream";
      btn.style.position = "absolute";
      btn.style.right = "8px";
      btn.style.bottom = "8px";
      btn.style.padding = "6px 12px";
      btn.style.background = "#fbbf24"; // Yellow
      btn.style.color = "#000000"; // Black
      btn.style.border = "none";
      btn.style.borderRadius = "6px";
      btn.style.fontWeight = "bold";
      btn.style.fontSize = "13px";
      btn.style.cursor = "pointer";
      btn.style.zIndex = "9999";

      const url = `https://www.2embed.cc/embedtv/\( {tmdbId}&s= \){ep.season}&e=${ep.episode}`;
      btn.onclick = (e) => {
        e.stopPropagation();
        toggleCardPlayer(card, url);
      };
      card.appendChild(btn);
    });
  }

  function addFloatingButton() {
    if (document.getElementById("embed-main-btn")) return;
    const tmdbId = getTmdbId();
    if (!tmdbId) return;

    const btn = document.createElement("button");
    btn.id = "embed-main-btn";
    btn.textContent = "Stream";
    btn.style.position = "fixed";
    btn.style.bottom = "10px";
    btn.style.right = "10px";
    btn.style.padding = "10px 14px";
    btn.style.background = "#fbbf24"; // Yellow
    btn.style.color = "#000000"; // Black
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "15px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "10001";
    btn.style.boxShadow = "0 10px 8px rgba(0,0,0,0.2)";

    const url = `https://www.2embed.cc/embed/${tmdbId}`;

    btn.onclick = () => {
      const existing = document.querySelector(".embed-main-player");
      if (existing) { existing.remove(); return; }
      const iframe = createIframe(url);
      iframe.className = "embed-main-player";
      iframe.style.height = "400px";
      const target = document.querySelector("main") || document.body;
      target.prepend(iframe);
    };

    document.body.appendChild(btn);
  }

  function init() {
    addFloatingButton();
    if (location.pathname.includes("/episodes") || location.search.includes("season")) {
      insertEpisodeButtons();
      new MutationObserver(insertEpisodeButtons).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();