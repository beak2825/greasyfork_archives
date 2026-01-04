// ==UserScript==
// @name         Nexus NSFW Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filters Adult mods on Nexus Mods
// @author       ChatGPT
// @match        https://www.nexusmods.com/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547774/Nexus%20NSFW%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/547774/Nexus%20NSFW%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Visible tags to filter
    const FILTER_TAGS = {
    adult: "Adult"
  };

  // LocalStorage keys
  const LS_KEY = "nexusFilterSettings";

  // Load settings or default value
    let filterSettings = JSON.parse(localStorage.getItem(LS_KEY)) || {adult: false};

  // Create control UI
    function createControlPanel() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "60px";
    container.style.right = "20px";
    container.style.background = "#222";
    container.style.color = "white";
    container.style.padding = "10px";
    container.style.zIndex = "9999";
    container.style.borderRadius = "8px";
    container.style.fontSize = "14px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.maxWidth = "200px";

    container.innerHTML = `
      <strong>NSFW Filter</strong><br>
      <label><input type="checkbox" id="filterAdult"> Adult (NSFW)</label><br>
    `;

    document.body.appendChild(container);

    // Initialize states
        document.getElementById("filterAdult").checked = filterSettings.adult;

    // Change events
        document.getElementById("filterAdult").addEventListener("change", e => {
      filterSettings.adult = e.target.checked;
      localStorage.setItem(LS_KEY, JSON.stringify(filterSettings));
      applyFilter();
    });
  }

  // Apply the filter to the page
    function applyFilter() {
    const tiles = document.querySelectorAll('[data-e2eid="mod-tile"]');

    tiles.forEach(tile => {
      const categories = Array.from(tile.querySelectorAll('[data-e2eid="mod-tile-category"], span'))
        .map(el => el.textContent.trim());

      let hide = false;
      if (filterSettings.adult && categories.includes(FILTER_TAGS.adult)) {
        hide = true;
      }
      tile.style.display = hide ? "none" : "";
    });
  }

  // Observer to reapply the filter if content is loaded dynamically
    const observer = new MutationObserver(() => {
    applyFilter();
  });

  function startObserver() {
    observer.observe(document.body, {childList: true, subtree: true});
  }

  // Initialization
    function init() {
    createControlPanel();
    applyFilter();
    startObserver();
  }

  // Wait until the page is ready (mods loaded)
    window.addEventListener("load", init);

})();
