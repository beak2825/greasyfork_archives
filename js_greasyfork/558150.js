// ==UserScript==
// @name         1337x download helper
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Hover to reveal magnet, torrent, and stream links on search results. Episode navigation for series.
// @author       danielosiro
// @license      MIT
// @match        *://1337x.to/search/*
// @match        *://1337x.st/search/*
// @match        *://1337x.ws/search/*
// @match        *://1337x.eu/search/*
// @match        *://1337x.se/search/*
// @match        *://1337x.is/search/*
// @match        *://1337x.gd/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558150/1337x%20download%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558150/1337x%20download%20helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const cache = {};

  const STATES = {
    LOADING: "loading",
    LOADED: "loaded",
    ERROR: "error",
  };

  const ICON_STYLE = "position: absolute; left: -28px; font-size: 18px; cursor: pointer; text-decoration: none;";
  const NAV_ARROW_STYLE = "font-family: Flaticon; font-size: 14px; color: #d63600; cursor: pointer; text-decoration: none; margin-left: 12px; display: inline-block;";

  // Episode navigation
  function parseEpisodeFromSearch(searchText) {
    // Match patterns like S01E01, s01e01, S1E1, etc.
    const match = searchText.match(/s(\d{1,2})e(\d{1,2})/i);
    if (!match) return null;

    return {
      season: parseInt(match[1], 10),
      episode: parseInt(match[2], 10),
      fullMatch: match[0],
      prefix: searchText.substring(0, match.index),
      suffix: searchText.substring(match.index + match[0].length)
    };
  }

  function formatEpisode(season, episode) {
    const s = String(season).padStart(2, "0");
    const e = String(episode).padStart(2, "0");
    return `s${s}e${e}`;
  }

  function buildSearchUrl(prefix, season, episode, suffix) {
    const searchTerm = (prefix + formatEpisode(season, episode) + suffix).trim();
    const encoded = searchTerm.replace(/\s+/g, "+");
    return `/search/${encoded}/1/`;
  }

  function initEpisodeNavigation() {
    const heading = document.querySelector(".box-info-heading h1");
    if (!heading) {
      return;
    }

    const searchSpan = heading.querySelector("span");
    if (!searchSpan) {
      return;
    }

    const searchText = searchSpan.textContent.trim();

    const parsed = parseEpisodeFromSearch(searchText);
    if (!parsed) {
      return;
    }
    // Find the category select box to place arrows after it
    const categoryBox = document.querySelector(".box-info-heading .box-info-left.sort-by-box");
    if (!categoryBox) {
      return;
    }

    // Create container for arrows
    const navContainer = document.createElement("span");
    navContainer.className = "episode-nav";
    navContainer.style.cssText = "display: inline-flex; align-items: center; margin-left: 15px; vertical-align: middle;";

    // Previous arrow (only if not episode 1)
    if (parsed.episode > 1) {
      const prevUrl = buildSearchUrl(parsed.prefix, parsed.season, parsed.episode - 1, parsed.suffix);
      const prevArrow = document.createElement("a");
      prevArrow.href = prevUrl;
      prevArrow.innerHTML = "&#xf19e;";
      prevArrow.title = `Previous: ${formatEpisode(parsed.season, parsed.episode - 1).toUpperCase()}`;
      prevArrow.style.cssText = NAV_ARROW_STYLE + "transform: rotate(180deg);";
      navContainer.appendChild(prevArrow);
    }

    // Next arrow
    const nextUrl = buildSearchUrl(parsed.prefix, parsed.season, parsed.episode + 1, parsed.suffix);
    const nextArrow = document.createElement("a");
    nextArrow.href = nextUrl;
    nextArrow.innerHTML = "&#xf19e;";
    nextArrow.title = `Next: ${formatEpisode(parsed.season, parsed.episode + 1).toUpperCase()}`;
    nextArrow.style.cssText = NAV_ARROW_STYLE;
    navContainer.appendChild(nextArrow);

    // Insert after category box
    categoryBox.insertAdjacentElement("afterend", navContainer);

  }

  function updateCell(cell, element) {
    // Ensure cell has relative positioning for absolute child
    cell.style.position = "relative";

    const existing = cell.querySelector(".magnet-status");
    if (existing) {
      existing.replaceWith(element);
    } else {
      cell.insertBefore(element, cell.firstChild);
    }
  }

  function createPlaceholder() {
    const span = document.createElement("span");
    span.className = "magnet-status magnet-placeholder";
    span.style.cssText = ICON_STYLE;
    span.textContent = "🔗";
    span.title = "Hover to load magnet link";
    return span;
  }

  function createSpinner() {
    const span = document.createElement("span");
    span.className = "magnet-status";
    span.textContent = "⏳";
    span.title = "Loading...";
    span.style.cssText = ICON_STYLE;
    return span;
  }

  function createMagnetLink(data) {
    // Calculate number of icons
    let iconCount = 1; // magnet is always present
    if (data.torrentUrl) iconCount++;
    if (data.streamUrl) iconCount++;
    const leftOffset = iconCount * -30;

    const container = document.createElement("span");
    container.className = "magnet-status";
    container.style.cssText = `position: absolute; left: ${leftOffset}px; font-size: 18px; cursor: pointer; text-decoration: none; display: flex; gap: 6px;`;

    // Magnet link
    const magnetA = document.createElement("a");
    magnetA.href = data.magnetUrl;
    magnetA.textContent = "🧲";
    magnetA.title = "Magnet link";
    magnetA.style.cssText = "text-decoration: none;";
    container.appendChild(magnetA);

    // Torrent download link (if available)
    if (data.torrentUrl) {
      const torrentA = document.createElement("a");
      torrentA.href = data.torrentUrl;
      torrentA.textContent = "📁";
      torrentA.title = "Download .torrent file";
      torrentA.target = "_blank";
      torrentA.style.cssText = "text-decoration: none;";
      container.appendChild(torrentA);
    }

    // Stream link (if available)
    if (data.streamUrl) {
      const streamA = document.createElement("a");
      streamA.href = data.streamUrl;
      streamA.textContent = "▶️";
      streamA.title = "Play now (Stream)";
      streamA.target = "_blank";
      streamA.style.cssText = "text-decoration: none;";
      container.appendChild(streamA);
    }

    return container;
  }

  function createErrorIndicator() {
    const span = document.createElement("span");
    span.className = "magnet-status";
    span.textContent = "⚠️";
    span.title = "Failed to load. Hover again to retry.";
    span.style.cssText = ICON_STYLE;
    return span;
  }

  function fetchMagnetLink(url, cell) {

    if (cache[url]) {
      if (cache[url].status === STATES.LOADED) {
        updateCell(cell, createMagnetLink(cache[url]));
        return;
      }
      if (cache[url].status === STATES.LOADING) {
        return;
      }
      // If error, allow retry
    }

    cache[url] = { status: STATES.LOADING };
    updateCell(cell, createSpinner());
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })
      .then((response) => {

        if (!response.ok) {
          cache[url] = { status: STATES.ERROR };
          updateCell(cell, createErrorIndicator());
          return;
        }

        return response.text();
      })
      .then((html) => {
        if (!html) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const magnetAnchor = doc.querySelector('a[href^="magnet:"]');
        if (!magnetAnchor) {
          cache[url] = { status: STATES.ERROR };
          updateCell(cell, createErrorIndicator());
          return;
        }

        const magnetUrl = magnetAnchor.getAttribute("href");

        // Extract torrent download link (first .torrent mirror)
        const torrentAnchor = doc.querySelector('a[href$=".torrent"]');
        const torrentUrl = torrentAnchor ? torrentAnchor.getAttribute("href") : null;

        // Extract stream link (Play now)
        const streamAnchor = doc.querySelector('a[href*="uflix"], a[href*="playEpisode"]');
        const streamUrl = streamAnchor ? streamAnchor.getAttribute("href") : null;

        const data = { status: STATES.LOADED, magnetUrl, torrentUrl, streamUrl };
        cache[url] = data;
        updateCell(cell, createMagnetLink(data));
      })
      .catch((error) => {
        cache[url] = { status: STATES.ERROR };
        updateCell(cell, createErrorIndicator());
      });
  }

  function init() {

    // Initialize episode navigation
    initEpisodeNavigation();

    const rows = document.querySelectorAll("table.table-list tbody tr");

    rows.forEach((row, index) => {
      const torrentLink = row.querySelector("td.coll-1 a:not(.icon)");
      if (!torrentLink) {
        return;
      }

      const detailUrl = torrentLink.href;
      const cell = torrentLink.closest("td");
      const placeholder = createPlaceholder();
      updateCell(cell, placeholder);

      placeholder.addEventListener("mouseenter", function () {
        const currentStatus = cache[detailUrl]?.status;

        if (currentStatus === STATES.LOADED) {
          updateCell(cell, createMagnetLink(cache[detailUrl]));
        } else if (currentStatus === STATES.LOADING) {
          // In progress, do nothing
        } else {
          if (currentStatus === STATES.ERROR) {
            delete cache[detailUrl];
          }
          fetchMagnetLink(detailUrl, cell);
        }
      });
    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();