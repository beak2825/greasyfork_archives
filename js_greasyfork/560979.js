// ==UserScript==
// @name         TOS Filters
// @namespace    tos-filters
// @version      1.0.0
// @description  Torrent Filter Userscript
// @match        https://theoldschool.cc/torrents/similar/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560979/TOS%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/560979/TOS%20Filters.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/parser.ts
  function parseTitle(title) {
    const seasonMatch = title.match(/S(\d{1,2})(?![0-9])/i);
    const episodeMatch = title.match(/E(\d{1,2})(?![0-9])/i);
    const codecMatch = title.match(/\b(H\.?264|X\.?264|H\.?265|X\.?265|HEVC|AV1)\b/i);
    const codec = codecMatch ? normalizeCodec(codecMatch[1]) : "Unknown";
    const teamMatch = title.match(/-([A-Za-z0-9]+)$/);
    const team = teamMatch ? teamMatch[1] : "NOTAG";
    const isIntegrale = /\bINTEGRALE\b/i.test(title) || /\bCOMPLETE\b/i.test(title);
    const season = seasonMatch ? parseInt(seasonMatch[1], 10) : null;
    const episode = episodeMatch ? parseInt(episodeMatch[1], 10) : null;
    let collection;
    if (isIntegrale) {
      collection = "int\xE9grale";
    } else if (episode !== null) {
      collection = "\xE9pisode";
    } else {
      collection = "saison";
    }
    return { season, episode, codec, team, collection };
  }
  function normalizeCodec(codec) {
    const upper = codec.toUpperCase().replace(/\./g, "");
    if (upper === "H264") return "H264";
    if (upper === "X264") return "X264";
    if (upper === "H265") return "H265";
    if (upper === "X265") return "X265";
    if (upper === "HEVC") return "HEVC";
    if (upper === "AV1") return "AV1";
    return upper;
  }
  function parseSize(sizeText) {
    const match = sizeText.match(/([\d.]+)\s*(GiB|MiB|TiB|GB|MB|TB)/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    switch (unit) {
      case "TIB":
      case "TB":
        return value * 1024 * 1024 * 1024 * 1024;
      case "GIB":
      case "GB":
        return value * 1024 * 1024 * 1024;
      case "MIB":
      case "MB":
        return value * 1024 * 1024;
      default:
        return value;
    }
  }
  function parseType(typeText) {
    const normalized = typeText.trim().toLowerCase();
    if (normalized.includes("remux")) return "Remux";
    if (normalized.includes("encode")) return "Encode";
    if (normalized.includes("webrip")) return "WEBRip";
    if (normalized.includes("web")) return "WEB";
    if (normalized.includes("full disc") || normalized.includes("fulldisc")) return "Full Disc";
    return "Unknown";
  }
  function parseTorrentRow(tr) {
    const id = tr.dataset.torrentId;
    if (!id) return null;
    const titleEl = tr.querySelector(".torrent-search--list__name");
    const title = titleEl?.textContent?.trim() ?? "";
    if (!title) return null;
    const typeEl = tr.querySelector(".torrent-search--list__type");
    const type = parseType(typeEl?.textContent ?? "");
    const resolutionEl = tr.querySelector(".torrent-search--list__resolution");
    const resolution = resolutionEl?.textContent?.trim() ?? "Unknown";
    const sizeEl = tr.querySelector(".torrent-search--list__size span");
    const sizeText = sizeEl?.textContent?.trim() ?? "0";
    const sizeBytes = parseSize(sizeText);
    const seedersEl = tr.querySelector(".torrent-search--list__seeders span");
    const seeders = parseInt(seedersEl?.textContent?.trim() ?? "0", 10);
    const leechersEl = tr.querySelector(".torrent-search--list__leechers span");
    const leechers = parseInt(leechersEl?.textContent?.trim() ?? "0", 10);
    const completedEl = tr.querySelector(".torrent-search--list__completed span");
    const completed = parseInt(completedEl?.textContent?.trim() ?? "0", 10);
    const dateEl = tr.querySelector(".torrent-search--list__age time");
    const dateStr = dateEl?.getAttribute("datetime");
    const date = dateStr ? new Date(dateStr) : null;
    const freeleech = tr.querySelector(".torrent-icons__freeleech") !== null;
    const highspeed = tr.querySelector(".torrent-icons__highspeed") !== null;
    const downloadEl = tr.querySelector('.torrent-search--list__buttons a[href*="/download/"]');
    const downloadUrl = downloadEl?.href ?? "";
    const parsed = parseTitle(title);
    return {
      id,
      element: tr,
      title,
      type,
      resolution,
      codec: parsed.codec,
      collection: parsed.collection,
      season: parsed.season,
      episode: parsed.episode,
      team: parsed.team,
      size: sizeText,
      sizeBytes,
      seeders,
      leechers,
      completed,
      date,
      freeleech,
      highspeed,
      downloadUrl
    };
  }
  function getAllTorrents() {
    const rows = document.querySelectorAll("tr[data-torrent-id]");
    const torrents = [];
    for (const row of rows) {
      const torrent = parseTorrentRow(row);
      if (torrent) {
        torrents.push(torrent);
      }
    }
    return torrents;
  }

  // src/filters.ts
  function createDefaultFilterState() {
    return {
      types: /* @__PURE__ */ new Set(),
      collections: /* @__PURE__ */ new Set(),
      codecs: /* @__PURE__ */ new Set(),
      teams: /* @__PURE__ */ new Set(),
      resolutions: /* @__PURE__ */ new Set(),
      seasons: /* @__PURE__ */ new Set()
    };
  }
  function applyFilters(torrents, state) {
    return torrents.filter((torrent) => {
      if (state.types.size > 0 && !state.types.has(torrent.type)) {
        return false;
      }
      if (state.collections.size > 0 && !state.collections.has(torrent.collection)) {
        return false;
      }
      if (state.codecs.size > 0 && !state.codecs.has(torrent.codec)) {
        return false;
      }
      if (state.teams.size > 0 && !state.teams.has(torrent.team)) {
        return false;
      }
      if (state.resolutions.size > 0 && !state.resolutions.has(torrent.resolution)) {
        return false;
      }
      if (state.seasons.size > 0 && (torrent.season === null || !state.seasons.has(torrent.season))) {
        return false;
      }
      return true;
    });
  }
  function extractFilterOptions(torrents) {
    const types = /* @__PURE__ */ new Set();
    const collections = /* @__PURE__ */ new Set();
    const codecs = /* @__PURE__ */ new Set();
    const teams = /* @__PURE__ */ new Set();
    const resolutions = /* @__PURE__ */ new Set();
    const seasons = /* @__PURE__ */ new Set();
    for (const torrent of torrents) {
      types.add(torrent.type);
      collections.add(torrent.collection);
      codecs.add(torrent.codec);
      teams.add(torrent.team);
      resolutions.add(torrent.resolution);
      if (torrent.season !== null) {
        seasons.add(torrent.season);
      }
    }
    return {
      types: [...types].sort(),
      collections: [...collections].sort(),
      codecs: [...codecs].sort(),
      teams: [...teams].sort(),
      resolutions: sortResolutions([...resolutions]),
      seasons: [...seasons].sort((a, b) => a - b)
    };
  }
  function computeAvailableOptions(torrents, state) {
    const filterWithout = (exclude) => {
      return torrents.filter((torrent) => {
        if (exclude !== "types" && state.types.size > 0 && !state.types.has(torrent.type)) {
          return false;
        }
        if (exclude !== "collections" && state.collections.size > 0 && !state.collections.has(torrent.collection)) {
          return false;
        }
        if (exclude !== "codecs" && state.codecs.size > 0 && !state.codecs.has(torrent.codec)) {
          return false;
        }
        if (exclude !== "teams" && state.teams.size > 0 && !state.teams.has(torrent.team)) {
          return false;
        }
        if (exclude !== "resolutions" && state.resolutions.size > 0 && !state.resolutions.has(torrent.resolution)) {
          return false;
        }
        if (exclude !== "seasons" && state.seasons.size > 0 && (torrent.season === null || !state.seasons.has(torrent.season))) {
          return false;
        }
        return true;
      });
    };
    const typesFiltered = filterWithout("types");
    const collectionsFiltered = filterWithout("collections");
    const codecsFiltered = filterWithout("codecs");
    const teamsFiltered = filterWithout("teams");
    const resolutionsFiltered = filterWithout("resolutions");
    const seasonsFiltered = filterWithout("seasons");
    return {
      types: new Set(typesFiltered.map((t) => t.type)),
      collections: new Set(collectionsFiltered.map((t) => t.collection)),
      codecs: new Set(codecsFiltered.map((t) => t.codec)),
      teams: new Set(teamsFiltered.map((t) => t.team)),
      resolutions: new Set(resolutionsFiltered.map((t) => t.resolution)),
      seasons: new Set(seasonsFiltered.filter((t) => t.season !== null).map((t) => t.season))
    };
  }
  function sortResolutions(resolutions) {
    const order = {
      "2160p": 1,
      "1080p": 2,
      "720p": 3,
      "480p": 4
    };
    return resolutions.sort((a, b) => {
      const orderA = order[a] ?? 99;
      const orderB = order[b] ?? 99;
      return orderA - orderB;
    });
  }

  // src/ui/common.ts
  function injectStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  }
  function createElement(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
    }
    if (children) {
      for (const child of children) {
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        } else {
          el.appendChild(child);
        }
      }
    }
    return el;
  }
  var BASE_STYLES = `
  .tos-filter-panel {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 13px;
    line-height: 1.4;
  }
  .tos-filter-panel * {
    box-sizing: border-box;
  }
  .tos-filter-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    font-weight: 600;
  }
  .tos-filter-section-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .tos-filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tos-filter-option {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: var(--torrent-row-format-bg);
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    transition: opacity 0.15s;
  }
  .tos-filter-option:hover {
    opacity: 0.8;
  }
  .tos-filter-option.active {
    background: var(--color-blue);
  }
  .tos-filter-option.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  .tos-filter-option input {
    display: none;
  }
  .tos-filter-option span {
    font-size: 12px;
  }
  .tos-results-count {
    opacity: 0.6;
    font-size: 12px;
    margin-bottom: 8px;
  }
  .tos-filter-options.tos-collapsed {
    max-height: 56px;
    overflow: hidden;
    position: relative;
  }
  .tos-filter-overflow-toggle {
    background: none;
    border: none;
    padding: 8px 0;
    font-size: 12px;
    cursor: pointer;
    color: var(--body-fg);
    opacity: 0.6;
    transition: opacity 0.15s;
  }
  .tos-filter-overflow-toggle:hover {
    opacity: 0.9;
  }
`;
  function createFilterSectionBase(config) {
    const { title, options, activeSet, onChange, collapsible = false, threshold = 10 } = config;
    const section = createElement("div", { class: "tos-filter-section" });
    const header = createElement("div", { class: "tos-filter-section-header" });
    const titleEl = createElement("span", { class: "tos-filter-section-title" }, [title]);
    header.appendChild(titleEl);
    section.appendChild(header);
    const shouldCollapse = collapsible && options.length > threshold;
    const optionsContainer = createElement("div", {
      class: `tos-filter-options ${shouldCollapse ? "tos-collapsed" : ""}`
    });
    const optionElements = /* @__PURE__ */ new Map();
    for (const opt of options) {
      const label = createElement("label", {
        class: `tos-filter-option ${activeSet.has(opt) ? "active" : ""}`
      });
      const checkbox = createElement("input", { type: "checkbox" });
      checkbox.checked = activeSet.has(opt);
      const span = createElement("span", {}, [opt]);
      checkbox.addEventListener("change", () => {
        onChange(opt, checkbox.checked);
        label.classList.toggle("active", checkbox.checked);
      });
      label.appendChild(checkbox);
      label.appendChild(span);
      optionsContainer.appendChild(label);
      optionElements.set(opt, label);
    }
    section.appendChild(optionsContainer);
    if (shouldCollapse) {
      let expanded = false;
      const toggleBtn = createElement("button", { class: "tos-filter-overflow-toggle" }, [
        "Voir plus"
      ]);
      toggleBtn.addEventListener("click", () => {
        expanded = !expanded;
        optionsContainer.classList.toggle("tos-collapsed", !expanded);
        toggleBtn.textContent = expanded ? "R\xE9duire" : "Voir plus";
      });
      section.appendChild(toggleBtn);
    }
    const updateAvailable = (available) => {
      for (const [opt, label] of optionElements) {
        const isAvailable = available.has(opt);
        const isActive = label.classList.contains("active");
        label.classList.toggle("disabled", !isAvailable && !isActive);
      }
    };
    return { element: section, updateAvailable };
  }
  function createFilterSection(title, options, activeSet, onChange) {
    return createFilterSectionBase({ title, options, activeSet, onChange });
  }
  function createCollapsibleFilterSection(title, options, activeSet, onChange, threshold = 10) {
    return createFilterSectionBase({ title, options, activeSet, onChange, collapsible: true, threshold });
  }
  function createResultsCount(count, total) {
    return createElement("div", { class: "tos-results-count" }, [
      `Affichage de ${count} sur ${total} torrents`
    ]);
  }
  function createFilterController(torrents, onUpdate) {
    const controller = {
      state: createDefaultFilterState(),
      update() {
        const filtered = applyFilters(torrents, this.state);
        onUpdate(filtered);
      }
    };
    return controller;
  }

  // src/ui/top-bar.ts
  var TOPBAR_STYLES = `
  ${BASE_STYLES}
  div[wire\\:id] {
    gap: 0 !important;
  }
  .tos-filter-wrapper {
    background: var(--data-table-tr-odd-bg);
    padding: 12px 16px;
    margin-bottom: 0;
    border-radius: 8px 8px 0 0;
  }
  .tos-filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-start;
  }
  .tos-filter-section {
    margin-bottom: 0;
    flex: 1;
    min-width: 150px;
  }
  .tos-results-count {
    margin: 0;
    padding-top: 6px;
  }
  #torrent-similar {
    border-radius: 0 0 8px 8px;
  }
  #torrent-similar thead tr {
    display: grid;
    grid-template-areas: "format overview buttons rating size seeders leechers completed age";
    grid-template-columns: 100px 1fr 150px 60px 100px 50px 50px 50px 120px;
    grid-template-rows: auto;
    background: var(--data-table-th-bg);
  }
  #torrent-similar thead th:nth-child(1) { grid-area: overview; }
  #torrent-similar thead th:nth-child(2) { grid-area: age; text-align: right; }
  #torrent-similar thead th:nth-child(3) { grid-area: size; text-align: right; }
  #torrent-similar thead th:nth-child(4) { grid-area: seeders; text-align: right; }
  #torrent-similar thead th:nth-child(5) { grid-area: leechers; text-align: right; }
  #torrent-similar thead th:nth-child(6) { grid-area: completed; text-align: right; }
  th[data-tos-sort] {
    cursor: pointer;
  }
  th[data-tos-sort] .fa-sort-alt {
    transition: opacity 0.15s;
  }
  th[data-tos-sort].tos-sort-active .fa-sort-alt {
    opacity: 1 !important;
  }
  th[data-tos-sort].tos-sort-asc .fa-sort-alt::before {
    content: "\\f15d" !important;
  }
  th[data-tos-sort].tos-sort-desc .fa-sort-alt::before {
    content: "\\f15e" !important;
  }
  @media (max-width: 766px) {
    #torrent-similar thead tr {
      display: flex;
      justify-content: flex-end;
    }
  }
`;
  var styleEl = null;
  var filterWrapperEl = null;
  var resultsEl = null;
  var currentSortKey = "created_at";
  var currentSortOrder = "desc";
  var containerEl = null;
  function sortTorrents(torrents, key, order) {
    const sorted = [...torrents];
    const multiplier = order === "asc" ? 1 : -1;
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (key) {
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "created_at":
          const dateA = a.date?.getTime() ?? 0;
          const dateB = b.date?.getTime() ?? 0;
          comparison = dateA - dateB;
          break;
        case "size":
          comparison = a.sizeBytes - b.sizeBytes;
          break;
        case "seeders":
          comparison = a.seeders - b.seeders;
          break;
        case "leechers":
          comparison = a.leechers - b.leechers;
          break;
        case "times_completed":
          comparison = a.completed - b.completed;
          break;
      }
      return comparison * multiplier;
    });
    return sorted;
  }
  function renderRows(torrents) {
    if (!containerEl) return;
    containerEl.innerHTML = "";
    for (const torrent of torrents) {
      containerEl.appendChild(torrent.element);
    }
  }
  function updateSortIndicators(key, order) {
    const headers = document.querySelectorAll("th[data-tos-sort]");
    headers.forEach((th) => {
      th.classList.remove("tos-sort-active", "tos-sort-asc", "tos-sort-desc");
      if (th.getAttribute("data-tos-sort") === key) {
        th.classList.add("tos-sort-active", `tos-sort-${order}`);
      }
    });
  }
  var topBar = {
    init(torrents, options) {
      styleEl = injectStyles(TOPBAR_STYLES);
      const table = document.getElementById("torrent-similar");
      if (!table) return;
      const thead = table.querySelector("thead");
      if (!thead) return;
      let tbody = table.querySelector("tbody");
      if (!tbody) {
        tbody = document.createElement("tbody");
        table.appendChild(tbody);
      }
      containerEl = tbody;
      for (const torrent of torrents) {
        tbody.appendChild(torrent.element);
      }
      const panels = document.querySelectorAll("section.panelV2");
      panels.forEach((panel) => {
        panel.style.display = "none";
      });
      let typeSection;
      let collectionSection;
      let codecSection;
      let resolutionSection;
      let teamSection;
      const seasonOptionElements = /* @__PURE__ */ new Map();
      const controller = createFilterController(torrents, (filtered) => {
        const sorted = sortTorrents(filtered, currentSortKey, currentSortOrder);
        renderRows(sorted);
        if (resultsEl) {
          resultsEl.textContent = `Affichage de ${sorted.length} sur ${torrents.length} torrents`;
        }
        const available = computeAvailableOptions(torrents, controller.state);
        typeSection?.updateAvailable(available.types);
        collectionSection?.updateAvailable(available.collections);
        codecSection?.updateAvailable(available.codecs);
        resolutionSection?.updateAvailable(available.resolutions);
        teamSection?.updateAvailable(available.teams);
        for (const [season, label] of seasonOptionElements) {
          const isAvailable = available.seasons.has(season);
          const isActive = label.classList.contains("active");
          label.classList.toggle("disabled", !isAvailable && !isActive);
        }
      });
      const sortHeaders = thead.querySelectorAll("th[wire\\:click]");
      sortHeaders.forEach((th) => {
        const wireClick = th.getAttribute("wire:click");
        const match = wireClick?.match(/sortBy\('(\w+)'\)/);
        if (match) {
          const sortKey = match[1];
          th.setAttribute("data-tos-sort", sortKey);
          th.removeAttribute("wire:click");
          th.removeAttribute(":direction");
          const newTh = th.cloneNode(true);
          th.parentNode?.replaceChild(newTh, th);
          newTh.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentSortKey === sortKey) {
              currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
            } else {
              currentSortKey = sortKey;
              currentSortOrder = "desc";
            }
            updateSortIndicators(currentSortKey, currentSortOrder);
            controller.update();
          });
        }
      });
      filterWrapperEl = createElement("div", { class: "tos-filter-wrapper tos-filter-panel" });
      const filterContainer = createElement("div", { class: "tos-filter-container" });
      typeSection = createFilterSection("Type", options.types, controller.state.types, (v, checked) => {
        checked ? controller.state.types.add(v) : controller.state.types.delete(v);
        controller.update();
      });
      filterContainer.appendChild(typeSection.element);
      if (options.seasons.length > 0) {
        const seasonOptionsContainer = createElement("div", { class: "tos-filter-options" });
        seasonOptionsContainer.style.display = "none";
        seasonOptionsContainer.style.marginTop = "4px";
        for (const s of options.seasons) {
          const label = createElement("label", { class: "tos-filter-option" });
          const checkbox = createElement("input", { type: "checkbox" });
          const text = `S${s.toString().padStart(2, "0")}`;
          const span = createElement("span", {}, [text]);
          checkbox.addEventListener("change", () => {
            checkbox.checked ? controller.state.seasons.add(s) : controller.state.seasons.delete(s);
            label.classList.toggle("active", checkbox.checked);
            controller.update();
          });
          label.appendChild(checkbox);
          label.appendChild(span);
          seasonOptionsContainer.appendChild(label);
          seasonOptionElements.set(s, label);
        }
        collectionSection = createFilterSection(
          "Collection",
          options.collections,
          controller.state.collections,
          (v, checked) => {
            const set = controller.state.collections;
            checked ? set.add(v) : set.delete(v);
            if (v === "saison") {
              seasonOptionsContainer.style.display = checked ? "" : "none";
              if (!checked) {
                controller.state.seasons.clear();
                seasonOptionsContainer.querySelectorAll("input").forEach((cb) => {
                  cb.checked = false;
                  cb.parentElement?.classList.remove("active");
                });
              }
            }
            controller.update();
          }
        );
        collectionSection.element.appendChild(seasonOptionsContainer);
        filterContainer.appendChild(collectionSection.element);
      }
      codecSection = createFilterSection("Codec", options.codecs, controller.state.codecs, (v, checked) => {
        checked ? controller.state.codecs.add(v) : controller.state.codecs.delete(v);
        controller.update();
      });
      filterContainer.appendChild(codecSection.element);
      resolutionSection = createFilterSection(
        "R\xE9solution",
        options.resolutions,
        controller.state.resolutions,
        (v, checked) => {
          checked ? controller.state.resolutions.add(v) : controller.state.resolutions.delete(v);
          controller.update();
        }
      );
      filterContainer.appendChild(resolutionSection.element);
      teamSection = createCollapsibleFilterSection(
        "Team",
        options.teams,
        controller.state.teams,
        (v, checked) => {
          checked ? controller.state.teams.add(v) : controller.state.teams.delete(v);
          controller.update();
        }
      );
      filterContainer.appendChild(teamSection.element);
      filterWrapperEl.appendChild(filterContainer);
      resultsEl = createResultsCount(torrents.length, torrents.length);
      filterWrapperEl.appendChild(resultsEl);
      table.parentElement?.insertBefore(filterWrapperEl, table);
      updateSortIndicators(currentSortKey, currentSortOrder);
      controller.update();
    }
  };

  // src/main.ts
  function init() {
    const torrents = getAllTorrents();
    if (torrents.length === 0) {
      console.log("[TOS Filters] No torrents found on this page");
      return;
    }
    console.log(`[TOS Filters] Found ${torrents.length} torrents`);
    const options = extractFilterOptions(torrents);
    topBar.init(torrents, options);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
