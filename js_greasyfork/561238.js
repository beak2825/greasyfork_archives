// ==UserScript==
// @name         MangaUpdates Extended Info
// @require      https://update.greasyfork.org/scripts/506699/1684845/marked.js
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fetch series info and display in a modern custom UI
// @author       You
// @match        https://www.mangaupdates.com/lists/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        window.onurlchange
// @run-at       document-end
// @connect      api.mangaupdates.com
// @downloadURL https://update.greasyfork.org/scripts/561238/MangaUpdates%20Extended%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/561238/MangaUpdates%20Extended%20Info.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /* =======================
       CONFIGURATION
     ======================== */
  const isDev = true;
  let cancelCurrentProcessing = false;
  let isEnhancedView = true; // Toggle between original and enhanced view
  let showOnlyCompleted = false;

  /* =======================
       SELECTORS (Constants)
     ======================== */
  const SELECTORS = {
    SERIES_TABLE: 'div[class*="series-list-table"]',
    TABLE_ROW: ".row.g-0",
    SERIES_LINK: '.p-1.col.text a[title="Click for Series Info"]',
    SERIES_NAME_SPAN: "span",
    RATING_LINK: 'a[title="Update rating"]',
    MAIN_CONTAINER: ".p-1.col.text",
  };

  function getCurrentListId() {
    const match = location.pathname.match(/\/lists\/([\w-]+)/);
    return match ? match[1] : "default";
  }

  /* =======================
       DEBUG UTILITIES
     ======================== */
  function debugLog(type, text, ...args) {
    if (!isDev) return;
    const prefix = "[MU Script Debug]";
    if (type === "warn") console.warn(prefix, text, ...args);
    else if (type === "error") console.error(prefix, text, ...args);
    else console.log(prefix, text, ...args);
  }

  debugLog("log", "Script loaded", { url: location.href });

  /* =======================
       MODERN UI STYLES
     ======================== */
  debugLog("log", "Injecting modern styles");

  GM_addStyle(`
    /* ===== CSS Variables ===== */
    :root {
      --mu-bg-primary: #0f0f1a;
      --mu-bg-secondary: #1a1a2e;
      --mu-bg-card: rgba(30, 30, 50, 0.8);
      --mu-bg-glass: rgba(255, 255, 255, 0.05);
      --mu-border: rgba(255, 255, 255, 0.1);
      --mu-text-primary: #ffffff;
      --mu-text-secondary: #a0a0b0;
      --mu-accent: #6c5ce7;
      --mu-accent-glow: rgba(108, 92, 231, 0.3);
      --mu-gold: #ffd700;
      --mu-success: #00b894;
      --mu-warning: #fdcb6e;
    }

    /* ===== Persistent Header ===== */
    #mu-header {
      background: linear-gradient(135deg, var(--mu-bg-primary) 0%, var(--mu-bg-secondary) 100%);
      border-radius: 16px;
      padding: 16px 24px;
      margin: 20px 0 10px 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .mu-header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mu-header-status {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--mu-border);
    }

    .mu-header-status.hidden {
      display: none;
    }

    .mu-mini-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--mu-border);
      border-top-color: var(--mu-accent);
      border-radius: 50%;
      animation: mu-spin 1s linear infinite;
    }

    .mu-status-log {
      font-size: 13px;
      color: var(--mu-text-secondary);
      flex: 1;
    }

    .mu-header-stats {
      display: flex;
      gap: 16px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--mu-border);
      font-size: 12px;
      color: var(--mu-text-secondary);
    }

    .mu-header-stat {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .mu-header-stat-value {
      color: var(--mu-accent);
      font-weight: 700;
    }

    .mu-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mu-text-primary);
      font-size: 13px;
      cursor: pointer;
      user-select: none;
    }

    .mu-checkbox-label input {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    /* ===== Container ===== */
    #mu-modern-container {
      background: linear-gradient(135deg, var(--mu-bg-primary) 0%, var(--mu-bg-secondary) 100%);
      border-radius: 16px;
      padding: 24px;
      margin: 0 0 20px 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    /* ===== Toolbar ===== */
    .mu-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--mu-border);
    }

    .mu-toolbar-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--mu-text-primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mu-toolbar-title::before {
      content: '📚';
      font-size: 28px;
    }

    .mu-toolbar-actions {
      display: flex;
      gap: 12px;
    }

    .mu-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mu-btn-primary {
      background: linear-gradient(135deg, var(--mu-accent) 0%, #a55eea 100%);
      color: white;
      box-shadow: 0 4px 15px var(--mu-accent-glow);
    }

    .mu-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px var(--mu-accent-glow);
    }

    .mu-btn-secondary {
      background: var(--mu-bg-glass);
      color: var(--mu-text-primary);
      border: 1px solid var(--mu-border);
      backdrop-filter: blur(10px);
    }

    .mu-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* ===== Stats Bar ===== */
    .mu-stats {
      display: flex;
      gap: 24px;
      margin-bottom: 20px;
    }

    .mu-stat {
      background: var(--mu-bg-glass);
      border: 1px solid var(--mu-border);
      border-radius: 12px;
      padding: 16px 24px;
      backdrop-filter: blur(10px);
    }

    .mu-stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--mu-accent);
    }

    .mu-stat-label {
      font-size: 12px;
      color: var(--mu-text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* ===== Grid Layout ===== */
    .mu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    /* ===== Card ===== */
    .mu-card {
      background: var(--mu-bg-card);
      border: 1px solid var(--mu-border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .mu-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      border-color: var(--mu-accent);
    }

    .mu-card-inner {
      display: flex;
      padding: 16px;
      gap: 16px;
    }

    /* ===== Card Image ===== */
    .mu-card-image {
      flex-shrink: 0;
      width: 100px;
      height: 140px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
    }

    .mu-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .mu-card:hover .mu-card-image img {
      transform: scale(1.05);
    }

    .mu-card-image::after {
      content: '🔗';
      position: absolute;
      bottom: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.7);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .mu-card:hover .mu-card-image::after {
      opacity: 1;
    }

    /* ===== Card Left Panel (image + meta) ===== */
    .mu-card-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .mu-card-meta {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 100%;
    }

    .mu-card-ratings {
      display: flex;
      gap: 6px;
      justify-content: center;
    }

    .mu-card-refresh {
      background: transparent;
      border: 1px solid var(--mu-border);
      color: var(--mu-text-secondary);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 4px;
    }

    .mu-card-refresh:hover {
      background: var(--mu-accent);
      color: white;
      border-color: var(--mu-accent);
    }

    /* ===== Card Content ===== */
    .mu-card-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mu-card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--mu-text-primary);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mu-rating-item {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      background: var(--mu-bg-glass);
      border-radius: 12px;
      font-size: 11px;
      border: 1px solid var(--mu-border);
    }

    .mu-rating-bayesian {
      color: var(--mu-gold);
    }

    .mu-rating-my {
      color: var(--mu-accent);
      border: 1px solid var(--mu-accent);
    }

    .mu-star-filled { color: var(--mu-gold); }
    .mu-star-empty { color: #444; }

    .mu-genres {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .mu-genre-pill {
      padding: 2px 6px;
      font-size: 9px;
      font-weight: 600;
      border-radius: 10px;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .mu-genre-adult { background: linear-gradient(135deg, #e74c3c, #c0392b); }
    .mu-genre-romance { background: linear-gradient(135deg, #e84393, #d63384); }
    .mu-genre-action { background: linear-gradient(135deg, #f39c12, #e67e22); }
    .mu-genre-comedy { background: linear-gradient(135deg, #00b894, #00cec9); }
    .mu-genre-fantasy { background: linear-gradient(135deg, #9b59b6, #8e44ad); }
    .mu-genre-drama { background: linear-gradient(135deg, #636e72, #2d3436); }
    .mu-genre-default { background: linear-gradient(135deg, #0984e3, #6c5ce7); }

    /* ===== Description ===== */
    .mu-description {
      font-size: 13px;
      color: var(--mu-text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .mu-description:hover {
      -webkit-line-clamp: unset;
      max-height: 200px;
      overflow-y: auto;
    }

    .mu-description p { margin: 0 0 8px 0; }
    .mu-description a { color: var(--mu-accent); }

    .mu-completed-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      background: linear-gradient(135deg, var(--mu-success), #10ac84);
      color: white;
      font-size: 10px;
      font-weight: 700;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .mu-ongoing-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      background: linear-gradient(135deg, var(--mu-warning), #f9ca24);
      color: #1a1a2e;
      font-size: 10px;
      font-weight: 700;
      border-radius: 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    /* ===== Status Text ===== */
    .mu-status-text {
      font-size: 12px;
      color: var(--mu-text-secondary);
      line-height: 1.4;
      background: var(--mu-bg-glass);
      border-radius: 8px;
      padding: 8px 12px;
      border-left: 3px solid var(--mu-accent);
    }

    .mu-status-text p { margin: 0 0 4px 0; }
    .mu-status-text p:last-child { margin: 0; }
    .mu-status-text strong { color: var(--mu-text-primary); }

    /* ===== Loading State ===== */
    .mu-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--mu-text-secondary);
    }

    .mu-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--mu-border);
      border-top-color: var(--mu-accent);
      border-radius: 50%;
      animation: mu-spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes mu-spin {
      to { transform: rotate(360deg); }
    }

    /* ===== Empty State ===== */
    .mu-empty {
      text-align: center;
      padding: 60px;
      color: var(--mu-text-secondary);
    }

    .mu-empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    /* ===== Responsive ===== */
    @media (max-width: 900px) {
      .mu-grid {
        grid-template-columns: 1fr;
      }

      .mu-stats {
        flex-wrap: wrap;
      }
    }
  `);

  /* =======================
       DOM UTILITIES
     ======================== */
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async function checkForElement(selector, timeout = 10000, parent = document) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = parent.querySelector(selector);
      if (element) return element;
      await sleep(100);
    }
    debugLog("error", `Element not found (timeout ${timeout}ms):`, selector);
    return null;
  }

  function getElement(selector, parent = document, selectorName = "") {
    const element = parent.querySelector(selector);
    if (!element) {
      debugLog("warn", `Selector failed: ${selectorName || selector}`);
    }
    return element;
  }

  function getElements(selector, parent = document, selectorName = "") {
    const elements = parent.querySelectorAll(selector);
    if (elements.length === 0) {
      debugLog(
        "warn",
        `Selector returned no elements: ${selectorName || selector}`
      );
    }
    return elements;
  }

  /* =======================
       API UTILITIES
     ======================== */
  function muApiRequest(method, endpoint, body) {
    debugLog("log", "API request", method, endpoint);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url: `https://api.mangaupdates.com/v1/${endpoint}`,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        data: body ? JSON.stringify(body) : undefined,
        onload: (res) => {
          try {
            resolve(JSON.parse(res.responseText));
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject,
      });
    });
  }

  /* =======================
       DATA LAYER
     ======================== */
  async function getSeriesId(item) {
    const cachedIds = (await GM_getValue("seriesIds", {})) || {};
    if (cachedIds[item.href]) return cachedIds[item.href];

    const searchResults = await muApiRequest("POST", "series/search", {
      search: item.name,
      stype: "title",
      perpage: 5,
    });

    let foundId = null;
    for (const r of searchResults.results || []) {
      const record = r.record;
      if (
        record?.url &&
        record.url.split("/series/")[1]?.split("/")[0] ===
          item.href.split("/series/")[1]?.split("/")[0]
      ) {
        foundId = record.series_id;
        break;
      }
    }

    if (foundId) {
      cachedIds[item.href] = foundId;
      await GM_setValue("seriesIds", cachedIds);
    }
    return foundId;
  }

  async function getSeriesInfo(seriesId, userRating = null, listId = null) {
    const cached = (await GM_getValue("seriesInfo", {})) || {};

    if (cached[seriesId]) {
      let needsUpdate = false;
      if (userRating !== null && cached[seriesId].userRating !== userRating) {
        cached[seriesId].userRating = userRating;
        needsUpdate = true;
      }
      if (listId && cached[seriesId].listId !== listId) {
        cached[seriesId].listId = listId;
        needsUpdate = true;
      }
      if (needsUpdate) {
        await GM_setValue("seriesInfo", cached);
      }
      return cached[seriesId];
    }

    const info = await muApiRequest("GET", `series/${seriesId}`);
    info.userRating = userRating;
    info.listId = listId;
    cached[seriesId] = info;
    await GM_setValue("seriesInfo", cached);
    return info;
  }

  async function loadSeriesForCurrentList() {
    const listId = getCurrentListId();
    const seriesInfo = (await GM_getValue("seriesInfo", {})) || {};
    const filtered = Object.values(seriesInfo).filter(
      (s) => s.listId === listId
    );
    debugLog("log", `Loaded ${filtered.length} series for list: ${listId}`);
    return filtered;
  }

  async function saveListHtml(listId, html, count) {
    const cache = (await GM_getValue("htmlCache", {})) || {};
    cache[listId] = {
      html: html,
      timestamp: Date.now(),
      count: count,
    };
    await GM_setValue("htmlCache", cache);
    debugLog("log", `Saved HTML cache for list ${listId}`);
  }

  async function getListHtml(listId) {
    const cache = (await GM_getValue("htmlCache", {})) || {};
    return cache[listId];
  }

  /* =======================
       UI HELPERS
     ======================== */
  function getGenreClass(genre) {
    if (!genre) return "mu-genre-default";
    const g = genre.toLowerCase();
    if (["adult", "ecchi", "hentai", "smut", "mature"].includes(g))
      return "mu-genre-adult";
    if (["romance", "shoujo", "josei", "harem"].includes(g))
      return "mu-genre-romance";
    if (["action", "adventure", "shounen"].includes(g))
      return "mu-genre-action";
    if (["comedy", "slice of life", "school life"].includes(g))
      return "mu-genre-comedy";
    if (["fantasy", "supernatural", "mystery", "psychological"].includes(g))
      return "mu-genre-fantasy";
    if (["drama", "historical", "tragedy"].includes(g)) return "mu-genre-drama";
    return "mu-genre-default";
  }

  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /* =======================
       MODERN UI RENDERING
     ======================== */
  function renderSeriesCard(series) {
    const thumbUrl =
      series.image?.url?.thumb || series.image?.url?.original || "";
    const title = escapeHtml(series.title || "Unknown Title");
    const bayesian = series.bayesian_rating || 0;
    const myRating = series.userRating;
    const genres = series.genres || [];
    const completed = series.completed === true;
    const description = series.description || "";
    const status = series.status || "";
    const url = series.url || "#";

    // Parse description and status with marked
    const parsedDesc = description ? marked.parse(description) : "";
    const parsedStatus = status ? marked.parse(status) : "";

    const seriesId = series.series_id || "";

    const card = document.createElement("div");
    card.className = "mu-card";
    card.dataset.seriesId = seriesId;
    card.innerHTML = `
      <div class="mu-card-inner">
        <div class="mu-card-left">
          <a href="${escapeHtml(
            url
          )}" target="_blank" rel="noopener" class="mu-card-image">
            <img src="${escapeHtml(
              thumbUrl
            )}" alt="${title}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 140%22><rect fill=%22%231a1a2e%22 width=%22100%22 height=%22140%22/><text x=%2250%22 y=%2270%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2212%22>No Image</text></svg>'"/>
          </a>
          <div class="mu-card-meta">
            ${
              completed
                ? '<span class="mu-completed-badge">✓ Completed</span>'
                : '<span class="mu-ongoing-badge">⏳ Ongoing</span>'
            }
            <div class="mu-card-ratings">
              <div class="mu-rating-item mu-rating-bayesian">
                <span>★</span>
                <span>${bayesian > 0 ? bayesian.toFixed(1) : "N/A"}</span>
              </div>
              ${
                myRating
                  ? `
                <div class="mu-rating-item mu-rating-my">
                  <span>${myRating}/10</span>
                </div>
              `
                  : ""
              }
            </div>
            <button class="mu-card-refresh" data-id="${seriesId}">🔄</button>
          </div>
        </div>
        <div class="mu-card-content">
          <h3 class="mu-card-title">${title}</h3>

          <div class="mu-genres">
            ${genres
              .map((g) => {
                const genreName = typeof g === "string" ? g : g.genre;
                return `<span class="mu-genre-pill ${getGenreClass(
                  genreName
                )}">${escapeHtml(genreName)}</span>`;
              })
              .join("")}
          </div>

          ${parsedDesc ? `<div class="mu-description">${parsedDesc}</div>` : ""}

          ${
            parsedStatus
              ? `<div class="mu-status-text">${parsedStatus}</div>`
              : ""
          }
        </div>
      </div>
    `;

    // Add refresh button event
    card
      .querySelector(".mu-card-refresh")
      ?.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = parseInt(e.target.dataset.id, 10);
        if (!id) return;

        e.target.textContent = "⏳...";
        e.target.disabled = true;

        try {
          // Force refresh from API by removing from cache first
          const cached = (await GM_getValue("seriesInfo", {})) || {};
          const oldData = cached[id] || {};
          delete cached[id];
          await GM_setValue("seriesInfo", cached);

          // Fetch fresh data
          const info = await muApiRequest("GET", `series/${id}`);
          info.userRating = oldData.userRating;
          info.listId = oldData.listId;

          // Save back to cache
          cached[id] = info;
          await GM_setValue("seriesInfo", cached);

          // Re-render just this card
          const newCard = renderSeriesCard(info);
          card.replaceWith(newCard);

          debugLog("log", `Refreshed series: ${info.title}`);
        } catch (err) {
          debugLog("error", "Failed to refresh", err);
          e.target.textContent = "❌ Failed";
          setTimeout(() => {
            e.target.textContent = "🔄 Refresh";
            e.target.disabled = false;
          }, 2000);
        }
      });

    return card;
  }

  function updateStatusLog(message) {
    const log = document.getElementById("mu-status-log");
    const statusRow = document.getElementById("mu-header-status");
    if (log) log.textContent = message;
    if (statusRow) statusRow.classList.remove("hidden");
  }

  function hideStatusLog() {
    const statusRow = document.getElementById("mu-header-status");
    if (statusRow) statusRow.classList.add("hidden");
  }

  async function updateHeaderStats(originalCount, modernCount) {
    const cacheEl = document.getElementById("mu-stat-cache");
    const originalEl = document.getElementById("mu-stat-original");
    const modernEl = document.getElementById("mu-stat-modern");

    // Get total cache count
    const seriesInfo = (await GM_getValue("seriesInfo", {})) || {};
    const cacheCount = Object.keys(seriesInfo).length;

    if (cacheEl) cacheEl.textContent = cacheCount;
    if (originalEl) originalEl.textContent = originalCount || 0;
    if (modernEl) modernEl.textContent = modernCount || 0;
  }

  async function markUnusedEntries(currentListSeriesIds) {
    const listId = getCurrentListId();
    const seriesInfo = (await GM_getValue("seriesInfo", {})) || {};
    let updated = false;

    // Find entries that belong to this list but are not in currentListSeriesIds
    for (const id in seriesInfo) {
      const entry = seriesInfo[id];
      if (entry.listId === listId) {
        const isInCurrentList = currentListSeriesIds.includes(parseInt(id, 10));
        if (!isInCurrentList && !entry.unused) {
          entry.unused = true;
          updated = true;
          debugLog("log", `Marked as unused: ${entry.title} (ID: ${id})`);
        } else if (isInCurrentList && entry.unused) {
          // If it's back in the list, remove unused flag
          entry.unused = false;
          updated = true;
          debugLog("log", `Removed unused flag: ${entry.title} (ID: ${id})`);
        }
      }
    }

    if (updated) {
      await GM_setValue("seriesInfo", seriesInfo);
    }
  }

  async function clearCacheForList() {
    const listId = getCurrentListId();
    debugLog("log", `Clearing cache for list: ${listId}`);

    // Clear series data for this list
    const seriesInfo = (await GM_getValue("seriesInfo", {})) || {};
    let count = 0;
    for (const id in seriesInfo) {
      if (seriesInfo[id].listId === listId) {
        delete seriesInfo[id];
        count++;
      }
    }
    await GM_setValue("seriesInfo", seriesInfo);
    debugLog("log", `Removed ${count} entries from series cache`);

    // Clear HTML cache for this list
    const htmlCache = (await GM_getValue("htmlCache", {})) || {};
    if (htmlCache[listId]) {
      delete htmlCache[listId];
      await GM_setValue("htmlCache", htmlCache);
      debugLog("log", "Cleared HTML cache");
    }
  }

  function createPersistentHeader(originalTable) {
    const existingHeader = document.getElementById("mu-header");
    if (existingHeader) return existingHeader;

    const header = document.createElement("div");
    header.id = "mu-header";
    header.innerHTML = `
      <div class="mu-header-top">
        <div class="mu-toolbar-title">My Series Collection</div>
        <div class="mu-toolbar-actions">
          <label class="mu-checkbox-label">
            <input type="checkbox" id="mu-filter-completed">
            Show Only Completed
          </label>
          <button class="mu-btn mu-btn-secondary" id="mu-toggle-view">
            ${isEnhancedView ? "📋 Original View" : "✨ Enhanced View"}
          </button>
          <button class="mu-btn mu-btn-primary" id="mu-refresh-data">
            🔄 Refresh Data
          </button>
        </div>
      </div>
      <div class="mu-header-stats">
        <div class="mu-header-stat">
          <span>📦 Cache:</span>
          <span class="mu-header-stat-value" id="mu-stat-cache">0</span>
        </div>
        <div class="mu-header-stat">
          <span>📋 Original:</span>
          <span class="mu-header-stat-value" id="mu-stat-original">0</span>
        </div>
        <div class="mu-header-stat">
          <span>✨ Modern:</span>
          <span class="mu-header-stat-value" id="mu-stat-modern">0</span>
        </div>
      </div>
      <div class="mu-header-status hidden" id="mu-header-status">
        <div class="mu-mini-spinner"></div>
        <div class="mu-status-log" id="mu-status-log">Initializing...</div>
      </div>
    `;

    originalTable.parentNode.insertBefore(header, originalTable);

    // Filter completed event
    header
      .querySelector("#mu-filter-completed")
      .addEventListener("change", async (e) => {
        showOnlyCompleted = e.target.checked;
        await renderModernUI();
      });

    // Toggle view event
    header.querySelector("#mu-toggle-view").addEventListener("click", () => {
      isEnhancedView = !isEnhancedView;
      const container = document.getElementById("mu-modern-container");
      const toggleBtn = document.getElementById("mu-toggle-view");

      if (isEnhancedView) {
        if (container) container.style.display = "block";
        originalTable.style.display = "none";
        toggleBtn.textContent = "📋 Original View";
      } else {
        if (container) container.style.display = "none";
        originalTable.style.display = "block";
        toggleBtn.textContent = "✨ Enhanced View";
      }
    });

    // Refresh data event
    header
      .querySelector("#mu-refresh-data")
      .addEventListener("click", async () => {
        if (
          confirm(
            "This will clear cached data for this list and re-fetch everything. Continue?"
          )
        ) {
          // Clear just for this list
          await clearCacheForList();

          // Clear current UI to show we're starting fresh
          const container = document.getElementById("mu-modern-container");
          if (container) {
            container.innerHTML = `
            <div class="mu-loading">
              <div class="mu-spinner"></div>
              <div style="margin-top:15px">Clearing cache & Refreshing data...</div>
            </div>`;
          }

          // Reset stats
          await updateHeaderStats(0, 0);

          await processSeriesListInBackground();
          await renderModernUI();
        }
      });

    return header;
  }

  function renderStats(seriesList) {
    const total = seriesList.length;
    const completed = seriesList.filter((s) => s.completed === true).length;
    const avgRating = seriesList
      .filter((s) => s.bayesian_rating > 0)
      .reduce((sum, s, _, arr) => sum + s.bayesian_rating / arr.length, 0);
    const rated = seriesList.filter((s) => s.userRating).length;

    const stats = document.createElement("div");
    stats.className = "mu-stats";
    stats.innerHTML = `
      <div class="mu-stat">
        <div class="mu-stat-value">${total}</div>
        <div class="mu-stat-label">Total Series</div>
      </div>
      <div class="mu-stat">
        <div class="mu-stat-value">${completed}</div>
        <div class="mu-stat-label">Completed</div>
      </div>
      <div class="mu-stat">
        <div class="mu-stat-value">${
          avgRating > 0 ? avgRating.toFixed(1) : "-"
        }</div>
        <div class="mu-stat-label">Avg Rating</div>
      </div>
      <div class="mu-stat">
        <div class="mu-stat-value">${rated}</div>
        <div class="mu-stat-label">My Ratings</div>
      </div>
    `;
    return stats;
  }

  async function renderModernUI() {
    debugLog("log", "Rendering modern UI");

    // Wait for original table
    const originalTable = await checkForElement(SELECTORS.SERIES_TABLE, 10000);
    if (!originalTable) {
      debugLog("error", "Original table not found");
      return;
    }

    // Create persistent header (stays visible above both views)
    createPersistentHeader(originalTable);

    // Hide original table if in enhanced view
    if (isEnhancedView) {
      originalTable.style.display = "none";
    }

    // Remove existing container if present
    const existingContainer = document.getElementById("mu-modern-container");
    if (existingContainer) existingContainer.remove();

    // Create container
    const container = document.createElement("div");
    container.id = "mu-modern-container";
    container.style.display = isEnhancedView ? "block" : "none";

    // Show loading
    container.innerHTML = `
      <div class="mu-loading">
        <div class="mu-spinner"></div>
        <div>Loading your collection...</div>
      </div>
    `;

    // Insert after header
    const header = document.getElementById("mu-header");
    if (header) {
      header.after(container);
    } else {
      originalTable.parentNode.insertBefore(container, originalTable);
    }

    // Load cached data for current list only
    let seriesList = await loadSeriesForCurrentList();

    // Filter if needed
    if (showOnlyCompleted) {
      seriesList = seriesList.filter((s) => s.completed === true);
    }

    debugLog("log", "Loaded series for current list", seriesList.length);

    if (seriesList.length === 0) {
      const listId = getCurrentListId();
      container.innerHTML = `
        <div class="mu-empty">
          <div class="mu-empty-icon">📭</div>
          <h3>No data for List #${listId}</h3>
          <p>Click "Refresh Data" in the header to fetch series from this list.</p>
        </div>
      `;
      return;
    }

    // Clear and render content
    container.innerHTML = "";

    // Stats
    const stats = renderStats(seriesList);
    container.appendChild(stats);

    // Grid
    const grid = document.createElement("div");
    grid.className = "mu-grid";
    seriesList.forEach((series) => {
      const card = renderSeriesCard(series);
      grid.appendChild(card);
    });
    container.appendChild(grid);

    // Save rendered HTML to cache for instant load next time
    // Only save if we have data and filters are default (all entries)
    if (!showOnlyCompleted) {
      await saveListHtml(
        getCurrentListId(),
        container.innerHTML,
        seriesList.length
      );
    }

    debugLog("log", "Modern UI rendered successfully");
  }

  /* =======================
       BACKGROUND PROCESSING
     ======================== */
  async function processSeriesListInBackground() {
    debugLog("log", "processSeriesListInBackground start");
    cancelCurrentProcessing = false;

    const table = await checkForElement(SELECTORS.SERIES_TABLE, 10000);
    if (!table) return { originalCount: 0, processedIds: [] };

    // Show original table temporarily for scraping
    const wasHidden = table.style.display === "none";
    if (wasHidden) table.style.display = "block";

    const rows = getElements(SELECTORS.TABLE_ROW, table, "TABLE_ROW");
    const originalCount = rows.length;
    debugLog("log", "Rows to process", originalCount);
    updateStatusLog(`Found ${originalCount} series to process...`);

    // Collect all series IDs found in the current table
    const processedIds = [];

    for (let i = 0; i < rows.length; i++) {
      if (cancelCurrentProcessing) {
        debugLog("warn", "Processing cancelled by user");
        updateStatusLog("Processing cancelled");
        break;
      }

      const link = getElement(SELECTORS.SERIES_LINK, rows[i], "SERIES_LINK");
      if (!link) {
        debugLog("warn", `Row ${i + 1}: No series link found, skipping`);
        continue;
      }

      const ratingLink = rows[i].querySelector(SELECTORS.RATING_LINK);
      let userRating = null;
      if (ratingLink) {
        const ratingText = ratingLink.querySelector("b")?.textContent?.trim();
        if (ratingText && !isNaN(parseInt(ratingText, 10))) {
          userRating = parseInt(ratingText, 10);
        }
      }

      const item = {
        name: link
          .querySelector(SELECTORS.SERIES_NAME_SPAN)
          ?.textContent?.trim(),
        href: link.href,
        userRating,
      };

      const logMsg = `[${i + 1}/${rows.length}] ${item.name}`;
      debugLog("log", `Processing: ${logMsg}`);
      updateStatusLog(logMsg);

      try {
        debugLog("log", `[${i + 1}] Fetching series ID...`);
        const id = await getSeriesId(item);

        if (id) {
          processedIds.push(id);
          debugLog("log", `[${i + 1}] Got ID: ${id}, fetching series info...`);
          await getSeriesInfo(id, item.userRating, getCurrentListId());
          debugLog("log", `[${i + 1}] ✓ Done: ${item.name}`);
        } else {
          debugLog("warn", `[${i + 1}] Could not find ID for: ${item.name}`);
        }

        await sleep(300);
      } catch (e) {
        debugLog("error", "Processing failed", e);
      }
    }

    // Hide table again if it was hidden
    if (wasHidden) table.style.display = "none";

    // Mark entries not in current table as unused
    await markUnusedEntries(processedIds);

    // Update header stats
    const modernSeries = await loadSeriesForCurrentList();
    await updateHeaderStats(originalCount, modernSeries.length);

    hideStatusLog();
    debugLog("log", "processSeriesListInBackground complete");

    return { originalCount, processedIds };
  }

  /* =======================
       INITIALIZATION
     ======================== */
  async function init() {
    debugLog("log", "Init start");
    await sleep(500);

    // Wait for table to appear first
    const table = await checkForElement(SELECTORS.SERIES_TABLE, 10000);
    if (!table) {
      debugLog("error", "Table not found, cannot initialize");
      return;
    }

    // Create header IMMEDIATELY so user sees it with status log
    createPersistentHeader(table);
    // Try to load from HTML cache first for instant render
    const listId = getCurrentListId();
    const cachedHtml = await getListHtml(listId);

    if (cachedHtml && cachedHtml.html) {
      debugLog("log", "Found cached HTML, rendering immediately");

      // Inject cached HTML
      const existingContainer = document.getElementById("mu-modern-container");
      if (existingContainer) existingContainer.remove();

      const container = document.createElement("div");
      container.id = "mu-modern-container";
      container.innerHTML = cachedHtml.html;
      container.style.display = isEnhancedView ? "block" : "none";

      // Insert after header
      const header = document.getElementById("mu-header");
      if (header) {
        header.after(container);
      } else {
        table.parentNode.insertBefore(container, table);
      }

      // Hide original table if enhanced
      if (isEnhancedView) {
        table.style.display = "none";

        // Re-attach event listeners for features inside the container (like refresh buttons) - logic duplicated from renderModernUI for now
        // Ideally renderModernUI should be split, but for now we just handle re-rendering after background process
      }

      updateStatusLog("Loaded from cache. Checking for updates...");
      await updateHeaderStats(0, cachedHtml.count || 0); // Original count unknown yet
    } else {
      updateStatusLog("Initializing...");
    }

    // Process visible rows to update cache (shows progress in header)
    await processSeriesListInBackground();

    // Then render modern UI (this will update the cache)
    await renderModernUI();

    debugLog("log", "Init complete");
  }

  // Handle SPA URL changes
  if (window.onurlchange === null) {
    window.addEventListener("urlchange", (e) => {
      debugLog("warn", "URL changed", e.url);
      cancelCurrentProcessing = true;
      init();
    });
  }

  init();
})();
