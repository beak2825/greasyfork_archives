// ==UserScript==
// @name         TOS Filters
// @namespace    tos-filters
// @version      1.1.0
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
  var LANGUAGE_PATTERNS = [
    ["MULTI", /\bMULTI\b/i],
    ["TRUEFRENCH", /\bTRUEFRENCH\b/i],
    ["VFF", /\bVFF\b/i],
    ["VFQ", /\bVFQ\b/i],
    ["VFI", /\bVFI\b/i],
    ["VF2", /\bVF2\b/i],
    ["VF", /\bVF\b(?![FQI2])/i],
    ["FRENCH", /(?<!TRUE|SUB)\bFRENCH\b/i],
    ["VOSTFR", /\b(VOSTFR|SUBFRENCH)\b/i]
  ];
  function parseSeasons(title) {
    const rangeMatch = title.match(/S(\d{1,2})-S(\d{1,2})(?![0-9])/i);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      const seasons = [];
      for (let s = start; s <= end; s++) seasons.push(s);
      return seasons;
    }
    const singleMatch = title.match(/S(\d{1,2})(?![0-9])/i);
    if (singleMatch) {
      return [parseInt(singleMatch[1], 10)];
    }
    return [];
  }
  function parseEpisodes(title) {
    const episodes = /* @__PURE__ */ new Set();
    const rangeMatches = title.matchAll(/E(\d{1,4})-E(\d{1,4})/gi);
    for (const match of rangeMatches) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);
      for (let e = start; e <= end; e++) {
        episodes.add(e);
      }
    }
    if (episodes.size > 0) return [...episodes];
    const singleMatches = title.matchAll(/E(\d{1,4})(?![0-9-])/gi);
    for (const match of singleMatches) {
      episodes.add(parseInt(match[1], 10));
    }
    return [...episodes];
  }
  function parseTitle(title) {
    const seasons = parseSeasons(title);
    const episodes = parseEpisodes(title);
    const codecMatch = title.match(/\b(H\.?264|X\.?264|H\.?265|X\.?265|HEVC|AV1)\b/i);
    const codec = codecMatch ? normalizeCodec(codecMatch[1]) : "Unknown";
    const teamMatch = title.match(/-([A-Za-z0-9]+)$/);
    const team = teamMatch ? teamMatch[1] : "NOTAG";
    const isIntegrale = /\bINTEGRALE\b/i.test(title) || /\bCOMPLETE\b/i.test(title);
    let collection;
    if (isIntegrale) {
      collection = "int\xE9grale";
    } else if (episodes.length > 0) {
      collection = "\xE9pisode";
    } else if (seasons.length > 0) {
      collection = "saison";
    } else {
      collection = "int\xE9grale";
    }
    const hasHDR = /\bHDR(10)?(\+|Plus)?\b/i.test(title);
    const hasDV = /\b(DV|DoVi|Dolby[.\s]?Vision)\b/i.test(title);
    const hasAtmos = /\bAtmos\b/i.test(title);
    const hasSDR = /\bSDR\b/i.test(title) || !hasHDR && !hasDV;
    const qualities = [];
    if (hasHDR) qualities.push("HDR");
    if (hasDV) qualities.push("DV");
    if (hasSDR) qualities.push("SDR");
    if (hasAtmos) qualities.push("Atmos");
    const languages = LANGUAGE_PATTERNS.filter(([, pattern]) => pattern.test(title)).map(([lang]) => lang);
    return { seasons, episodes, codec, team, collection, hasHDR, hasDV, hasSDR, hasAtmos, qualities, languages };
  }
  function normalizeCodec(codec) {
    return codec.toUpperCase().replace(/\./g, "");
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
    if (normalized.includes("web")) return "WEB";
    if (normalized.includes("dvdr")) return "DVDR";
    if (normalized.includes("dvd")) return "DVD";
    if (normalized.includes("hdtv")) return "HDTV";
    if (normalized.includes("full disc") || normalized.includes("fulldisc")) return "Full Disc";
    if (normalized.includes("3d")) return "3D";
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
      seasons: parsed.seasons,
      episodes: parsed.episodes,
      team: parsed.team,
      size: sizeText,
      sizeBytes,
      seeders,
      leechers,
      completed,
      date,
      freeleech,
      highspeed,
      downloadUrl,
      hasHDR: parsed.hasHDR,
      hasDV: parsed.hasDV,
      hasSDR: parsed.hasSDR,
      hasAtmos: parsed.hasAtmos,
      qualities: parsed.qualities,
      languages: parsed.languages
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
  var RESOLUTION_ORDER = { "2160p": 1, "1080p": 2, "720p": 3, "480p": 4 };
  var QUALITY_ORDER = { HDR: 1, DV: 2, SDR: 3, Atmos: 4 };
  var LANGUAGE_ORDER = {
    MULTI: 1,
    TRUEFRENCH: 2,
    VFF: 3,
    VFQ: 4,
    VFI: 5,
    VF2: 6,
    VF: 7,
    FRENCH: 8,
    VOSTFR: 9
  };
  function sortByOrder(items, order) {
    return [...items].sort((a, b) => (order[a] ?? 99) - (order[b] ?? 99));
  }
  function excludeUnknown(items) {
    return [...items].filter((c) => c !== "Unknown");
  }
  function createDefaultFilterState() {
    return {
      types: /* @__PURE__ */ new Set(),
      collections: /* @__PURE__ */ new Set(),
      codecs: /* @__PURE__ */ new Set(),
      teams: /* @__PURE__ */ new Set(),
      resolutions: /* @__PURE__ */ new Set(),
      seasons: /* @__PURE__ */ new Set(),
      qualities: /* @__PURE__ */ new Set(),
      languages: /* @__PURE__ */ new Set(),
      searchTerm: ""
    };
  }
  function matchesSearch(torrent, term) {
    if (!term) return true;
    const termLower = term.toLowerCase();
    if (torrent.title.toLowerCase().includes(termLower)) return true;
    const seasonMatch = term.match(/S(\d{1,2})/i);
    const episodeMatch = term.match(/E(\d{1,4})/i);
    if (seasonMatch || episodeMatch) {
      const searchSeason = seasonMatch ? parseInt(seasonMatch[1], 10) : null;
      const searchEpisode = episodeMatch ? parseInt(episodeMatch[1], 10) : null;
      const seasonOk = searchSeason === null || torrent.seasons.includes(searchSeason);
      const episodeOk = searchEpisode === null || torrent.episodes.includes(searchEpisode);
      return seasonOk && episodeOk;
    }
    return false;
  }
  function hideRedundantSdrOption(qualities) {
    if (!qualities.has("HDR") && !qualities.has("DV")) {
      qualities.delete("SDR");
    }
  }
  function applyFiltersExcluding(torrents, state, exclude) {
    return torrents.filter((torrent) => {
      if (!matchesSearch(torrent, state.searchTerm)) return false;
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
      if (exclude !== "seasons" && state.seasons.size > 0 && !torrent.seasons.some((s) => state.seasons.has(s))) {
        return false;
      }
      if (exclude !== "qualities" && state.qualities.size > 0 && !torrent.qualities.some((q) => state.qualities.has(q))) {
        return false;
      }
      if (exclude !== "languages" && state.languages.size > 0 && !torrent.languages.some((l) => state.languages.has(l))) {
        return false;
      }
      return true;
    });
  }
  function applyFilters(torrents, state) {
    return applyFiltersExcluding(torrents, state, null);
  }
  function extractFilterOptions(torrents) {
    const types = /* @__PURE__ */ new Set();
    const collections = /* @__PURE__ */ new Set();
    const codecs = /* @__PURE__ */ new Set();
    const teams = /* @__PURE__ */ new Set();
    const resolutions = /* @__PURE__ */ new Set();
    const seasons = /* @__PURE__ */ new Set();
    const qualities = /* @__PURE__ */ new Set();
    const languages = /* @__PURE__ */ new Set();
    for (const torrent of torrents) {
      types.add(torrent.type);
      collections.add(torrent.collection);
      codecs.add(torrent.codec);
      teams.add(torrent.team);
      resolutions.add(torrent.resolution);
      for (const s of torrent.seasons) {
        seasons.add(s);
      }
      for (const q of torrent.qualities) qualities.add(q);
      for (const lang of torrent.languages) languages.add(lang);
    }
    hideRedundantSdrOption(qualities);
    return {
      types: [...types].sort(),
      collections: [...collections].sort(),
      codecs: excludeUnknown(codecs).sort(),
      teams: [...teams].sort(),
      resolutions: sortByOrder([...resolutions], RESOLUTION_ORDER),
      seasons: [...seasons].sort((a, b) => a - b),
      qualities: sortByOrder([...qualities], QUALITY_ORDER),
      languages: sortByOrder([...languages], LANGUAGE_ORDER)
    };
  }
  function computeAvailableOptions(torrents, state) {
    const available = {
      types: /* @__PURE__ */ new Set(),
      collections: /* @__PURE__ */ new Set(),
      codecs: /* @__PURE__ */ new Set(),
      teams: /* @__PURE__ */ new Set(),
      resolutions: /* @__PURE__ */ new Set(),
      seasons: /* @__PURE__ */ new Set(),
      qualities: /* @__PURE__ */ new Set(),
      languages: /* @__PURE__ */ new Set()
    };
    for (const torrent of torrents) {
      if (!matchesSearch(torrent, state.searchTerm)) continue;
      const matchType = state.types.size === 0 || state.types.has(torrent.type);
      const matchCollection = state.collections.size === 0 || state.collections.has(torrent.collection);
      const matchCodec = state.codecs.size === 0 || state.codecs.has(torrent.codec);
      const matchTeam = state.teams.size === 0 || state.teams.has(torrent.team);
      const matchResolution = state.resolutions.size === 0 || state.resolutions.has(torrent.resolution);
      const matchSeason = state.seasons.size === 0 || torrent.seasons.some((s) => state.seasons.has(s));
      const matchQuality = state.qualities.size === 0 || torrent.qualities.some((q) => state.qualities.has(q));
      const matchLanguage = state.languages.size === 0 || torrent.languages.some((l) => state.languages.has(l));
      if (matchCollection && matchCodec && matchTeam && matchResolution && matchSeason && matchQuality && matchLanguage) {
        available.types.add(torrent.type);
      }
      if (matchType && matchCodec && matchTeam && matchResolution && matchSeason && matchQuality && matchLanguage) {
        available.collections.add(torrent.collection);
      }
      if (matchType && matchCollection && matchTeam && matchResolution && matchSeason && matchQuality && matchLanguage) {
        if (torrent.codec !== "Unknown") {
          available.codecs.add(torrent.codec);
        }
      }
      if (matchType && matchCollection && matchCodec && matchResolution && matchSeason && matchQuality && matchLanguage) {
        available.teams.add(torrent.team);
      }
      if (matchType && matchCollection && matchCodec && matchTeam && matchSeason && matchQuality && matchLanguage) {
        available.resolutions.add(torrent.resolution);
      }
      if (matchType && matchCollection && matchCodec && matchTeam && matchResolution && matchQuality && matchLanguage) {
        for (const s of torrent.seasons) {
          available.seasons.add(s);
        }
      }
      if (matchType && matchCollection && matchCodec && matchTeam && matchResolution && matchSeason && matchLanguage) {
        for (const q of torrent.qualities) {
          available.qualities.add(q);
        }
      }
      if (matchType && matchCollection && matchCodec && matchTeam && matchResolution && matchSeason && matchQuality) {
        for (const lang of torrent.languages) {
          available.languages.add(lang);
        }
      }
    }
    hideRedundantSdrOption(available.qualities);
    return available;
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
  .tos-results-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding-top: 8px;
  }
  .tos-search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  .tos-search-icon {
    position: absolute;
    left: 8px;
    opacity: 0.4;
    font-size: 12px;
    pointer-events: none;
  }
  .tos-search-input {
    padding: 4px 8px 4px 28px;
    border: 1px solid var(--input-border);
    border-radius: 4px;
    background: var(--data-table-th-bg);
    color: var(--body-fg);
    min-width: 250px;
  }
  .tos-search-input::placeholder {
    color: var(--body-fg);
    opacity: 0.4;
  }
`;
  function createFilterOptions(options, activeSet, onChange, container) {
    const elements = /* @__PURE__ */ new Map();
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
      container.appendChild(label);
      elements.set(opt, label);
    }
    return elements;
  }
  function createUpdateAvailable(elements) {
    return (available) => {
      for (const [opt, label] of elements) {
        const isAvailable = available.has(opt);
        const isActive = label.classList.contains("active");
        label.classList.toggle("disabled", !isAvailable && !isActive);
      }
    };
  }
  function createSectionWithHeader(title) {
    const section = createElement("div", { class: "tos-filter-section" });
    const header = createElement("div", { class: "tos-filter-section-header" });
    const titleEl = createElement("span", { class: "tos-filter-section-title" }, [title]);
    header.appendChild(titleEl);
    section.appendChild(header);
    const optionsContainer = createElement("div", { class: "tos-filter-options" });
    return { section, optionsContainer };
  }
  function createFilterSectionBase(config) {
    const { title, options, activeSet, onChange, collapsible = false, threshold = 10 } = config;
    const { section, optionsContainer } = createSectionWithHeader(title);
    const shouldCollapse = collapsible && options.length > threshold;
    if (shouldCollapse) {
      optionsContainer.classList.add("tos-collapsed");
    }
    const optionElements = createFilterOptions(options, activeSet, onChange, optionsContainer);
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
    return { element: section, updateAvailable: createUpdateAvailable(optionElements) };
  }
  function createFilterSection(title, options, activeSet, onChange) {
    return createFilterSectionBase({ title, options, activeSet, onChange });
  }
  function createCollapsibleFilterSection(title, options, activeSet, onChange, threshold = 10) {
    return createFilterSectionBase({ title, options, activeSet, onChange, collapsible: true, threshold });
  }
  function createCombinedCodecQualitySection(codecs, qualities, codecSet, qualitySet, onCodecChange, onQualityChange) {
    const { section, optionsContainer } = createSectionWithHeader("Codec");
    const codecElements = createFilterOptions(codecs, codecSet, onCodecChange, optionsContainer);
    const qualityElements = createFilterOptions(qualities, qualitySet, onQualityChange, optionsContainer);
    section.appendChild(optionsContainer);
    return {
      element: section,
      updateCodecsAvailable: createUpdateAvailable(codecElements),
      updateQualitiesAvailable: createUpdateAvailable(qualityElements)
    };
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
  var lastSortKey = null;
  var lastSortOrder = null;
  var lastFilteredIds = null;
  var cachedSorted = [];
  function sortTorrents(torrents, key, order) {
    const filteredIds = torrents.map((t) => t.id).join(",");
    if (key === lastSortKey && order === lastSortOrder && filteredIds === lastFilteredIds) {
      return cachedSorted;
    }
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
    lastSortKey = key;
    lastSortOrder = order;
    lastFilteredIds = filteredIds;
    cachedSorted = sorted;
    return sorted;
  }
  function renderRows(torrents) {
    if (!containerEl) return;
    containerEl.replaceChildren(...torrents.map((t) => t.element));
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
      let codecQualitySection;
      let resolutionSection;
      let languageSection;
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
        codecQualitySection?.updateCodecsAvailable(available.codecs);
        codecQualitySection?.updateQualitiesAvailable(available.qualities);
        resolutionSection?.updateAvailable(available.resolutions);
        languageSection?.updateAvailable(available.languages);
        teamSection?.updateAvailable(available.teams);
        for (const [season, label] of seasonOptionElements) {
          const isAvailable = available.seasons.has(season);
          const isActive = label.classList.contains("active");
          label.classList.toggle("disabled", !isAvailable && !isActive);
        }
      });
      const createToggleHandler = (set) => (v, checked) => {
        checked ? set.add(v) : set.delete(v);
        controller.update();
      };
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
      typeSection = createFilterSection("Type", options.types, controller.state.types, createToggleHandler(controller.state.types));
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
      codecQualitySection = createCombinedCodecQualitySection(
        options.codecs,
        options.qualities,
        controller.state.codecs,
        controller.state.qualities,
        createToggleHandler(controller.state.codecs),
        createToggleHandler(controller.state.qualities)
      );
      filterContainer.appendChild(codecQualitySection.element);
      resolutionSection = createFilterSection(
        "R\xE9solution",
        options.resolutions,
        controller.state.resolutions,
        createToggleHandler(controller.state.resolutions)
      );
      filterContainer.appendChild(resolutionSection.element);
      languageSection = createFilterSection("Langue", options.languages, controller.state.languages, createToggleHandler(controller.state.languages));
      filterContainer.appendChild(languageSection.element);
      teamSection = createCollapsibleFilterSection(
        "Team",
        options.teams,
        controller.state.teams,
        createToggleHandler(controller.state.teams)
      );
      filterContainer.appendChild(teamSection.element);
      filterWrapperEl.appendChild(filterContainer);
      const resultsRow = createElement("div", { class: "tos-results-row" });
      const searchWrapper = createElement("div", { class: "tos-search-wrapper" });
      const searchIcon = createElement("i", { class: "tos-search-icon fas fa-search" });
      const searchInput = createElement("input", {
        type: "text",
        class: "tos-search-input",
        placeholder: "Rechercher"
      });
      let searchTimeout = null;
      searchInput.addEventListener("input", () => {
        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = window.setTimeout(() => {
          controller.state.searchTerm = searchInput.value;
          controller.update();
        }, 300);
      });
      searchWrapper.appendChild(searchIcon);
      searchWrapper.appendChild(searchInput);
      resultsRow.appendChild(searchWrapper);
      resultsEl = createResultsCount(torrents.length, torrents.length);
      resultsRow.appendChild(resultsEl);
      filterWrapperEl.appendChild(resultsRow);
      table.parentElement?.insertBefore(filterWrapperEl, table);
      updateSortIndicators(currentSortKey, currentSortOrder);
      controller.update();
    }
  };

  // src/main.ts
  var earlyStyle = document.createElement("style");
  earlyStyle.textContent = `
  section.panelV2 { display: none !important; }
`;
  document.head.appendChild(earlyStyle);
  function init() {
    const torrents = getAllTorrents();
    if (torrents.length === 0) {
      earlyStyle.remove();
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
