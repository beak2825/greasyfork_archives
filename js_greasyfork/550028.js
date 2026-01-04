// ==UserScript==
// @name         IMDb to OpenSubtitles
// @namespace    https://www.imdb.com/
// @icon         https://www.opensubtitles.com/favicon.ico
// @version      1.2
// @description  Add a floating button on IMDb movie/series pages to open the corresponding OpenSubtitles search (by IMDb ID, with filters).
// @author       
// @license      MIT
// @match        https://*.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550028/IMDb%20to%20OpenSubtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/550028/IMDb%20to%20OpenSubtitles.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Extract IMDb ID from URL
  function getImdbId() {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[1] || null;
  }

  // Create floating button
  function addOpenSubtitlesButton() {
    if (document.getElementById("opensub-btn")) return;

    const imdbId = getImdbId();
    if (!imdbId) return;

    // Updated OpenSubtitles URL with filters
    const url = `https://www.opensubtitles.com/en/en/search-all/q-${imdbId}/hearing_impaired-include/machine_translated-/trusted_sources-/`;

    const btn = document.createElement("button");
    btn.id = "opensub-btn";
    btn.textContent = "📄 OpenSubtitles";
    Object.assign(btn.style, {
      fontFamily: "Arial",
      position: "fixed",
      bottom: "60px",   // stacked above VidFast button
      right: "10px",
      padding: "10px 14px",
      background: "#444", // dark gray to distinguish
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      borderRadius: "6px",
      zIndex: 10001,
      filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.2))"
    });

    btn.addEventListener("click", () => {
      window.open(url, "_blank");
    });

    document.body.appendChild(btn);
  }

  // Init
  function init() {
    addOpenSubtitlesButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();