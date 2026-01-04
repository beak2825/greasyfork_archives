// ==UserScript==
// @name        AO3: Reading Time & Quality Score
// @version     4.0.2
// @author       BlackBatCat
// @description  Add reading time, chapter reading time, and quality scores to AO3 works with color coding, score normalization and sorting.
// @match       *://archiveofourown.org/tags/*
// @match       *://archiveofourown.org/works*
// @match       *://archiveofourown.org/chapters/*
// @match       *://archiveofourown.org/users/*
// @match       *://archiveofourown.org/collections/*
// @match       *://archiveofourown.org/bookmarks*
// @match       *://archiveofourown.org/series/*
// @license     MIT
// @require     https://update.greasyfork.org/scripts/554170/1693013/AO3%3A%20Menu%20Helpers%20Library%20v2.js?v=2.1.6
// @grant       none
// @namespace https://greasyfork.org/users/1498004
// @downloadURL https://update.greasyfork.org/scripts/549777/AO3%3A%20Reading%20Time%20%20Quality%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/549777/AO3%3A%20Reading%20Time%20%20Quality%20Score.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SCRIPT_VERSION = "4.0.1";

  const DEFAULTS = {
    enableReadingTime: true,
    enableQualityScore: true,
    enableChapterStats: true,
    wpm: 375,
    alwaysCountReadingTime: true,
    readingTimeLvl1: 120,
    readingTimeLvl2: 360,
    alwaysCountQualityScore: true,
    alwaysSortQualityScore: false,
    excludeMyContentFromSort: false,
    hideMetrics: false,
    hideHits: false,
    hideKudos: false,
    hideBookmarks: false,
    hideComments: false,
    useNormalization: true,
    userMaxScore: 22,
    minKudosToShowScore: 50,
    colorThresholdLow: 8,
    colorThresholdHigh: 14,
    colorStyle: "background",
    colorGreen: "#3e8fb0",
    colorYellow: "#f6c177",
    colorRed: "#eb6f92",
    colorText: "#ffffff",
    useIcons: false,
    iconColor: "",
    chapterTimeStyle: "default",
    username: "",
    hideWorksEnabled: false,
    hideWorksScore: 4,
    keepUnscoredVisible: false,
    hideScoreWorksEnabled: false,
    hideScoreWorks: "",
    lastSeenVersion: null,
  };

  let CONFIG = { ...DEFAULTS };
  let countable = false;
  let sortable = false;
  let statsPage = false;

  const $ = (selector, root = document) => root.querySelectorAll(selector);
  const $1 = (selector, root = document) => root.querySelector(selector);

  const saveAllSettings = () => {
    if (typeof Storage !== "undefined") {
      const { _hideScoreWorksSet, ...configToSave } = CONFIG;
      localStorage.setItem(
        "ao3_reading_quality_config",
        JSON.stringify(configToSave)
      );
    }
  };

  const loadUserSettings = () => {
    if (typeof Storage === "undefined") return;
    const savedConfig = localStorage.getItem("ao3_reading_quality_config");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        delete parsedConfig._hideScoreWorksSet;
        CONFIG = { ...DEFAULTS, ...parsedConfig };
      } catch (e) {
        console.error("Error loading saved config, using defaults:", e);
        CONFIG = { ...DEFAULTS };
      }
    }
  };

  loadUserSettings();

  const buildHideScoreWorksSet = () => {
    if (!CONFIG.hideScoreWorks) {
      CONFIG._hideScoreWorksSet = new Set();
      return;
    }
    const rawIds = CONFIG.hideScoreWorks;
    const ids = rawIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => /^\d+$/.test(id));
    CONFIG._hideScoreWorksSet = new Set(ids);
  };

  buildHideScoreWorksSet();
  migrateToV4IfNeeded();

  function migrateToV4IfNeeded() {
    const prev = CONFIG.lastSeenVersion || null;
    if (prev === SCRIPT_VERSION) return;

    CONFIG.userMaxScore = 22;
    if (CONFIG.useNormalization) {
      CONFIG.colorThresholdLow = 40;
      CONFIG.colorThresholdHigh = 60;
      CONFIG.hideWorksScore = 20;
    } else {
      CONFIG.colorThresholdLow = 8;
      CONFIG.colorThresholdHigh = 14;
      CONFIG.hideWorksScore = 4;
    }

    CONFIG.lastSeenVersion = SCRIPT_VERSION;
    saveAllSettings();
  }

  function saveSetting(key, value) {
    CONFIG[key] = value;
    saveAllSettings();
  }

  const resetAllSettings = () => {
    if (confirm("Reset all settings to defaults?")) {
      if (typeof Storage !== "undefined") {
        localStorage.removeItem("ao3_reading_quality_config");
      }
      CONFIG = { ...DEFAULTS };
      CONFIG.userMaxScore = 22;
      if (CONFIG.useNormalization) {
        CONFIG.colorThresholdLow = 40;
        CONFIG.colorThresholdHigh = 60;
        CONFIG.hideWorksScore = 20;
      } else {
        CONFIG.colorThresholdLow = 8;
        CONFIG.colorThresholdHigh = 14;
        CONFIG.hideWorksScore = 4;
      }
      CONFIG.keepUnscoredVisible = CONFIG.hideWorksEnabled ? true : false;
      saveAllSettings();
      buildHideScoreWorksSet();
      if (
        (CONFIG.enableReadingTime || CONFIG.enableQualityScore) &&
        countable
      ) {
        calculateMetrics(null, false, true);
      }
      if (CONFIG.enableChapterStats) calculateChapterStats();
    }
  };

  const detectAndStoreUsername = () => {
    let username = null;
    const userLink = document.querySelector(
      'li.user.logged-in a[href^="/users/"]'
    );
    if (userLink) {
      const match = userLink.getAttribute("href").match(/^\/users\/([^\/]+)/);
      if (match) username = match[1];
    }
    if (!username && CONFIG.username) {
      username = CONFIG.username;
    }
    if (!username) {
      const urlMatch = window.location.pathname.match(/^\/users\/([^\/]+)/);
      if (urlMatch) username = urlMatch[1];
    }
    if (!username) {
      const params = new URLSearchParams(window.location.search);
      const paramUserId = params.get("user_id");
      if (paramUserId) username = paramUserId;
    }
    if (username && username !== CONFIG.username) {
      saveSetting("username", username);
    }
    return username;
  };

  const USERNAME_PATTERNS = {
    userPath:
      /^\/users\/([^\/]+)(?:\/pseuds\/[^\/]+)?(?:\/(bookmarks|works))?(?:\/|$)/,
    readings: /^\/users\/([^\/]+)\/readings(?:\/|$)/,
  };

  const numberRegex = /[\d,]+/;
  const cleanNumberRegex = /[^\d]/g;

  const isMyContentPage = (username) => {
    if (!username) return false;
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const userPathPattern = new RegExp(
      `^/users/${escapedUsername}(?:/pseuds/[^/]+)?(?:/(bookmarks|works))?(?:/|$)`
    );
    const readingsPattern = new RegExp(
      `^/users/${escapedUsername}/readings(?:/|$)`
    );

    if (
      userPathPattern.test(window.location.pathname) ||
      readingsPattern.test(window.location.pathname)
    ) {
      return true;
    }
    if (window.location.pathname.startsWith("/bookmarks")) {
      const params = new URLSearchParams(window.location.search);
      const paramUserId = params.get("user_id");
      if (paramUserId && paramUserId.toLowerCase() === username.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const getWorkIdFromElement = (workElement) => {
    if (!workElement) return null;
    const titleLink = workElement.querySelector(
      ".header .heading a:first-child"
    );
    if (!titleLink) return null;
    const match = titleLink.href.match(/\/works\/(\d+)/);
    return match ? match[1] : null;
  };

  const getWorkIdFromUrl = () => {
    const match = window.location.href.match(/\/works\/(\d+)/);
    return match ? match[1] : null;
  };

  const getNumberFromElement = (element) => {
    if (!element) return NaN;
    const text = element.textContent;
    if (!text) return NaN;

    if (element.matches("dd.chapters")) {
      const match = text.match(/^(\d+)/);
      if (!match) return NaN;
      return parseInt(match[1], 10);
    }

    const match = text.match(numberRegex);
    if (!match) return NaN;
    const cleaned = match[0].replace(cleanNumberRegex, "");
    const number = parseInt(cleaned, 10);
    return isNaN(number) ? NaN : number;
  };

  const applyColorStyling = (element, color) => {
    if (CONFIG.colorStyle === "background") {
      element.style.backgroundColor = color;
      element.style.color = CONFIG.colorText;
      element.style.padding = "0 4px";
    } else if (CONFIG.colorStyle === "text") {
      element.style.color = color;
      element.style.backgroundColor = "";
      element.style.padding = "";
    } else {
      element.style.backgroundColor = "";
      element.style.color = "inherit";
      element.style.padding = "";
    }
  };

  const addIconStyles = () => {
    if (document.getElementById("ao3-userscript-icon-styles")) return;

    const style = document.createElement("style");
    style.id = "ao3-userscript-icon-styles";
    const iconColor = CONFIG.iconColor || "currentColor";

    const readingTimeIcon =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMS4yLDAsMCwxLjIsLTIuNCwtMi40KSI+PHBhdGggZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik05LjY2OCAxMy4zNjlhMS44ODQgMS44ODQgMCAwIDAgMC0yLjczOGwtLjEwOC0uMTAyQzcuNTQ1IDguNjA1IDUuOTg4IDcuMTIgNS41MiA0LjAwNyA1LjM1MiAyLjkxIDYuMjkyIDIgNy40MjQgMmg5LjE1YzEuMTMyIDAgMi4wNzIuOTEgMS45MDYgMi4wMDctLjQ3IDMuMTEzLTIuMDI2IDQuNTk4LTQuMDQxIDYuNTIybC0uMTA3LjEwMmExLjg4NCAxLjg4NCAwIDAgMCAwIDIuNzM4bC4xMDcuMTAyYzIuMDE1IDEuOTI0IDMuNTcyIDMuNDA5IDQuMDQxIDYuNTIyLjE2NiAxLjA5Ny0uNzc0IDIuMDA3LTEuOTA2IDIuMDA3aC05LjE1Yy0xLjEzMiAwLTIuMDcyLS45MS0xLjkwNi0yLjAwNy40Ny0zLjExMyAyLjAyNi00LjU5OCA0LjA0MS02LjUyMnptLjY4MyAxLjY5OC0uMDA4LjAwNmMtMS41MzUgMS4zNzMtMi42NzggMi4zOTUtMi44MjcgNC45MjNhLjQ2OC40NjggMCAwIDAgLjE2OC4zODguNDkzLjQ5MyAwIDAgMCAuMzIuMTE2aDcuOTkyYy4xNDQgMCAuMjc0LS4wNi4zNjMtLjE1OGEuNDY2LjQ2NiAwIDAgMCAuMTI0LS4zNDZjLS4xNDktMi41MjgtMS4yOTEtMy41NS0yLjgyNi00LjkyMy0uNDA2LS4zNjMtLjg0LS43NTEtMS4yOS0xLjE5OGEuNTIzLjUyMyAwIDAgMC0uNzM1IDBjLS40NDcuNDQ0LS44NzguODMtMS4yODEgMS4xOTF6Ii8+PC9nPjwvc3ZnPg==";

    const scoreIcon =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMjk4LjEzOCAxMzYuNjY1Yy02Mi4wNjUtMTMuMDExLTExMC41NzYtNjEuNTIyLTEyMy41ODUtMTIzLjU4OGExNi40NTUgMTYuNDU1IDAgMCAwLTMyLjIwOS4wMDFjLTEzLjAxIDYyLjA2NS02MS41MjEgMTEwLjU3NS0xMjMuNTg2IDEyMy41ODRhMTYuNDU1IDE2LjQ1NSAwIDAgMCAwIDMyLjIwOGM2Mi4wNjQgMTMuMDExIDExMC41NzMgNjEuNTIxIDEyMy41ODMgMTIzLjU4NmExNi40NTQgMTYuNDU0IDAgMCAwIDMyLjIwOCAwYzEzLjAxMS02Mi4wNjUgNjEuNTIzLTExMC41NzUgMTIzLjU4OC0xMjMuNTgzYTE2LjQ1NCAxNi40NTQgMCAwIDAgLjAwMS0zMi4yMDh6TTI3MC45MzggNDA4LjQ4NGMtMjkuMjQyLTYuMTI5LTUyLjA5OC0yOC45ODUtNTguMjI5LTU4LjIyOWExNi40NTQgMTYuNDU0IDAgMCAwLTMyLjIwOC0uMDAxYy02LjEzMSAyOS4yNDMtMjguOTg4IDUyLjA5OS01OC4yMyA1OC4yMjlhMTYuNDU1IDE2LjQ1NSAwIDAgMCAwIDMyLjIwOGMyOS4yNDEgNi4xMyA1Mi4wOTggMjguOTg3IDU4LjIyOCA1OC4yM2ExNi40NTQgMTYuNDU0IDAgMCAwIDMyLjIwOCAwYzYuMTMxLTI5LjI0MyAyOC45ODgtNTIuMDk5IDU4LjIzMS01OC4yMjlhMTYuNDU1IDE2LjQ1NSAwIDAgMCAwLTMyLjIwOHpNNDkzLjI0MyAyNTYuMTM1Yy0zOS41MjYtOC4yODYtNzAuNDE5LTM5LjE4LTc4LjcwNC03OC43MDVhMTYuNDU0IDE2LjQ1NCAwIDAgMC0zMi4yMDgtLjAwMWMtOC4yODYgMzkuNTI2LTM5LjE3OSA3MC40MTktNzguNzA1IDc4LjcwNGExNi40NTUgMTYuNDU1IDAgMCAwIDAgMzIuMjA4YzM5LjUyNSA4LjI4NiA3MC40MTggMzkuMTc5IDc4LjcwMyA3OC43MDVhMTYuNDU0IDE2LjQ1NCAwIDAgMCAzMi4yMDggMGM4LjI4Ny0zOS41MjYgMzkuMTgtNzAuNDE5IDc4LjcwNS03OC43MDNhMTYuNDU0IDE2LjQ1NCAwIDAgMCAuMDAxLTMyLjIwOHoiLz48L3N2Zz4=";

    style.textContent = `
      .stats dd.readtime::before,
      dl.statistics dt.readtime::before {
        display: inline-block !important;
        width: 1em !important;
        height: 1em !important;
        min-width: 1em !important;
        min-height: 1em !important;
        margin-right: 5px !important;
        background-color: ${iconColor} !important;
        ${CONFIG.iconColor ? "filter: none !important;" : ""}
        -webkit-mask-image: url("${readingTimeIcon}") !important;
        mask-image: url("${readingTimeIcon}") !important;
        -webkit-mask-size: contain !important;
        mask-size: contain !important;
        -webkit-mask-repeat: no-repeat !important;
        mask-repeat: no-repeat !important;
        -webkit-mask-position: center center !important;
        mask-position: center center !important;
        content: "" !important;
        transform: translate(0, 1px) !important;
      }
      .stats dd.kudoshits::before,
      dl.statistics dt.kudoshits::before {
        display: inline-block !important;
        width: 1em !important;
        height: 1em !important;
        min-width: 1em !important;
        min-height: 1em !important;
        margin-right: 5px !important;
        background-color: ${iconColor} !important;
        ${CONFIG.iconColor ? "filter: none !important;" : ""}
        -webkit-mask-image: url("${scoreIcon}") !important;
        mask-image: url("${scoreIcon}") !important;
        -webkit-mask-size: contain !important;
        mask-size: contain !important;
        -webkit-mask-repeat: no-repeat !important;
        mask-repeat: no-repeat !important;
        -webkit-mask-position: center center !important;
        mask-position: center center !important;
        content: "" !important;
        transform: translate(0, 1px) !important;
      }
      dl.stats dd {
        justify-content: center;
        position: relative;
      }
      .stats dd.readtime::after {
        display: none;
        position: absolute;
        top: 2em;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        padding: 0.3em;
        font-size: 0.8em;
        line-height: 1;
        text-align: center;
        content: "Time";
        white-space: nowrap;
        pointer-events: none;
      }
      .stats dd.kudoshits::after {
        display: none;
        position: absolute;
        top: 2em;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        padding: 0.3em;
        font-size: 0.8em;
        line-height: 1;
        text-align: center;
        content: "Score";
        white-space: nowrap;
        pointer-events: none;
      }
      .stats dd:hover::after {
        display: inline-block;
      }
      .statistics .stats dd:last-of-type::after,
      .index .stats dd:last-of-type:has(a[href$=bookmarks])::after,
      .stats dd.inspired::after,
      .tagset .index .stats dd:last-of-type::after {
        right: 0;
        left: auto;
        transform: none;
      }
      .stats a,
      .stats a:visited {
        border: none;
        color: inherit;
      }
      .stats dt.readtime,
      .stats dt.kudoshits,
      dl.statistics dt.readtime,
      dl.statistics dt.kudoshits {
        font-size: 0 !important;
        line-height: 0 !important;
      }
      dl.statistics dt.readtime::before,
      dl.statistics dt.kudoshits::before {
        font-size: 1rem !important;
        line-height: normal !important;
      }
      .notice.ao3-chapter-stats {
        list-style: none;
      }
      .notice.ao3-chapter-stats li {
        list-style: none;
        margin: 0;
      }
      .ao3-chapter-stats-default,
      .ao3-chapter-stats-timeonly {
        font-style: italic;
        text-align: center;
        opacity: 0.9;
        margin: 1em 0;
        font-size: 1.2em;
      }
    `;
    if (document.head) {
      document.head.appendChild(style);
    }
  };

  const checkCountable = () => {
    const foundStats = $("dl.stats");
    if (foundStats.length === 0) return;
    for (const stat of foundStats) {
      const li = stat.closest("li.work, li.bookmark");
      if (li) {
        countable = true;
        sortable = true;
        return;
      }
      if (stat.closest(".statistics")) {
        countable = true;
        sortable = true;
        statsPage = true;
        return;
      }
      if (stat.closest("dl.work")) {
        countable = true;
        return;
      }
    }
  };

  const calculateWordBasedScore = (kudos, hits, words) => {
    if (!kudos || !hits || !words) return 0;

    const eff = Math.max(1, words / 5000);
    const adjustedHits = hits / Math.pow(eff, 0.4);
    return (100 * kudos) / adjustedHits;
  };

  const calculateMetrics = (
    statsElements = null,
    forceRecalculation = false,
    allowCalculation = true
  ) => {
    if (!countable) return;
    if (
      !CONFIG.enableReadingTime &&
      !CONFIG.enableQualityScore &&
      !CONFIG.hideMetrics
    )
      return;

    if (CONFIG.hideWorksEnabled) {
    }

    const normalizedThresholdLow = CONFIG.colorThresholdLow;
    const normalizedThresholdHigh = CONFIG.colorThresholdHigh;

    const allStats = statsElements || Array.from($("dl.stats"));
    allStats.forEach((statsElement) => {
      const parentLi = statsElement.closest("li.work, li.bookmark");
      const wordsElement = $1("dd.words", statsElement);
      if (!wordsElement) return;

      const words = getNumberFromElement(wordsElement);
      if (isNaN(words)) return;

      const readtimeDt = $1("dt.readtime", statsElement);
      const kudoshitsDt = $1("dt.kudoshits", statsElement);
      const hitsElement = $1("dd.hits", statsElement);
      const kudosElement = $1("dd.kudos", statsElement);
      const bookmarksElement = $1("dd.bookmarks", statsElement);
      const commentsElement = $1("dd.comments", statsElement);
      const hitsLabel = $1("dt.hits", statsElement);
      const kudosLabel = $1("dt.kudos", statsElement);
      const bookmarksLabel = $1("dt.bookmarks", statsElement);
      const commentsLabel = $1("dt.comments", statsElement);

      const needsReadingTime =
        allowCalculation && CONFIG.enableReadingTime && !readtimeDt;
      const needsScore =
        allowCalculation &&
        CONFIG.enableQualityScore &&
        (!kudoshitsDt || forceRecalculation);
      const needsHiding = CONFIG.hideMetrics && !statsPage;
      const needsWorkHiding = CONFIG.hideWorksEnabled;
      const needsScoreHiding = CONFIG.hideScoreWorksEnabled && kudoshitsDt;

      if (
        !needsReadingTime &&
        !needsScore &&
        !needsHiding &&
        !needsWorkHiding &&
        !needsScoreHiding
      )
        return;

      if (needsScoreHiding && CONFIG._hideScoreWorksSet instanceof Set) {
        let workId = parentLi ? getWorkIdFromElement(parentLi) : null;
        if (!workId) {
          workId = getWorkIdFromUrl();
        }
        if (workId && CONFIG._hideScoreWorksSet.has(workId)) {
          const existingScoreDt = $1("dt.kudoshits", statsElement);
          const existingScoreDd = $1("dd.kudoshits", statsElement);
          if (existingScoreDt) existingScoreDt.remove();
          if (existingScoreDd) existingScoreDd.remove();
          if (parentLi) parentLi.removeAttribute("kudospercent");
          return;
        }
      }

      if (needsReadingTime) {
        const minutes = words / CONFIG.wpm;
        const hrs = Math.floor(minutes / 60);
        const mins = (minutes % 60).toFixed(0);
        const minutes_print = hrs > 0 ? hrs + "h" + mins + "m" : mins + "m";

        let color;
        if (minutes < CONFIG.readingTimeLvl1) {
          color = CONFIG.colorGreen;
        } else if (minutes < CONFIG.readingTimeLvl2) {
          color = CONFIG.colorYellow;
        } else {
          color = CONFIG.colorRed;
        }

        let ddStyle = "display: inline-block; vertical-align: baseline;";
        let spanStyle =
          "border-radius: 4px; display: inline-block; vertical-align: baseline; font-size: inherit; line-height: inherit;";

        if (CONFIG.colorStyle === "background") {
          spanStyle += ` background-color: ${color}; color: ${CONFIG.colorText}; padding: 0 4px;`;
        } else if (CONFIG.colorStyle === "text") {
          spanStyle += ` color: ${color};`;
        }

        if (CONFIG.useIcons) {
          wordsElement.insertAdjacentHTML(
            "afterend",
            `<dt class="readtime"></dt><dd class="readtime" style="${ddStyle}"><span style="${spanStyle}">${minutes_print}</span></dd>`
          );
        } else {
          ddStyle +=
            " border-radius: 4px; font-size: inherit; line-height: inherit;";
          if (CONFIG.colorStyle === "background") {
            ddStyle += ` background-color: ${color}; color: ${CONFIG.colorText}; padding: 0 4px;`;
          } else if (CONFIG.colorStyle === "text") {
            ddStyle += ` color: ${color};`;
          }
          wordsElement.insertAdjacentHTML(
            "afterend",
            `<dt class="readtime">Time:</dt><dd class="readtime" style="${ddStyle}">${minutes_print}</dd>`
          );
        }
      }

      if (needsScore) {
        if (
          CONFIG.hideScoreWorksEnabled &&
          CONFIG._hideScoreWorksSet instanceof Set
        ) {
          let workId = parentLi ? getWorkIdFromElement(parentLi) : null;
          if (!workId) {
            workId = getWorkIdFromUrl();
          }
          if (workId && CONFIG._hideScoreWorksSet.has(workId)) {
            return;
          }
        }

        const existingScoreElement = $1("dd.kudoshits", statsElement);
        if (existingScoreElement && !forceRecalculation) {
          if (parentLi && !parentLi.hasAttribute("kudospercent")) {
            const scoreText = existingScoreElement.textContent.trim();
            parentLi.setAttribute("kudospercent", parseFloat(scoreText));
          }
          return;
        }
        try {
          const hits = getNumberFromElement(hitsElement);
          const kudos = getNumberFromElement(kudosElement);

          if (isNaN(hits) || isNaN(kudos) || hits === 0) {
            return;
          }

          if (kudos >= CONFIG.minKudosToShowScore) {
            if (words === 0) {
              const existingScoreDt = $1("dt.kudoshits", statsElement);
              const existingScoreDd = $1("dd.kudoshits", statsElement);
              if (existingScoreDt) existingScoreDt.remove();
              if (existingScoreDd) existingScoreDd.remove();
              if (parentLi) parentLi.removeAttribute("kudospercent");
              return;
            }

            let rawScore = calculateWordBasedScore(kudos, hits, words);
            let displayScore = rawScore;
            if (CONFIG.useNormalization) {
              displayScore = (rawScore / CONFIG.userMaxScore) * 100;
              displayScore = Math.min(100, displayScore);
              displayScore = Math.ceil(displayScore);
            } else {
              displayScore = Math.round(displayScore * 10) / 10;
            }

            let color;
            if (displayScore >= normalizedThresholdHigh) {
              color = CONFIG.colorGreen;
            } else if (displayScore >= normalizedThresholdLow) {
              color = CONFIG.colorYellow;
            } else {
              color = CONFIG.colorRed;
            }

            if (kudoshitsDt && forceRecalculation) {
              const existingScoreElement = $1("dd.kudoshits", statsElement);
              if (existingScoreElement) {
                if (CONFIG.useIcons) {
                  const span = existingScoreElement.querySelector("span");
                  if (span) {
                    span.textContent = displayScore;
                    span.style.cssText = `border-radius: 4px; display: inline-block; vertical-align: baseline; font-size: inherit; line-height: inherit;`;
                    if (CONFIG.colorStyle === "background") {
                      span.style.backgroundColor = color;
                      span.style.color = CONFIG.colorText;
                      span.style.padding = "0 4px";
                    } else if (CONFIG.colorStyle === "text") {
                      span.style.color = color;
                    }
                  }
                } else {
                  existingScoreElement.textContent = displayScore;
                  existingScoreElement.style.cssText = `display: inline-block; vertical-align: baseline; border-radius: 4px; font-size: inherit; line-height: inherit;`;
                  if (CONFIG.colorStyle === "background") {
                    existingScoreElement.style.backgroundColor = color;
                    existingScoreElement.style.color = CONFIG.colorText;
                    existingScoreElement.style.padding = "0 4px";
                  } else if (CONFIG.colorStyle === "text") {
                    existingScoreElement.style.color = color;
                  }
                }
              }
            } else if (!kudoshitsDt) {
              let ddStyle = "display: inline-block; vertical-align: baseline;";
              let spanStyle =
                "border-radius: 4px; display: inline-block; vertical-align: baseline; font-size: inherit; line-height: inherit;";

              if (CONFIG.colorStyle === "background") {
                spanStyle += ` background-color: ${color}; color: ${CONFIG.colorText}; padding: 0 4px;`;
              } else if (CONFIG.colorStyle === "text") {
                spanStyle += ` color: ${color};`;
              }

              if (CONFIG.useIcons) {
                hitsElement.insertAdjacentHTML(
                  "afterend",
                  `<dt class="kudoshits"></dt><dd class="kudoshits" style="${ddStyle}"><span style="${spanStyle}">${displayScore}</span></dd>`
                );
              } else {
                ddStyle +=
                  " border-radius: 4px; font-size: inherit; line-height: inherit;";
                if (CONFIG.colorStyle === "background") {
                  ddStyle += ` background-color: ${color}; color: ${CONFIG.colorText}; padding: 0 4px;`;
                } else if (CONFIG.colorStyle === "text") {
                  ddStyle += ` color: ${color};`;
                }
                hitsElement.insertAdjacentHTML(
                  "afterend",
                  `<dt class="kudoshits">Score:</dt><dd class="kudoshits" style="${ddStyle}">${displayScore}</dd>`
                );
              }
            }

            if (parentLi) parentLi.setAttribute("kudospercent", displayScore);
          }
        } catch (error) {
          console.error("Error calculating score:", error);
        }
      }

      if (CONFIG.hideMetrics && !statsPage) {
        if (CONFIG.hideHits) {
          if (hitsElement) hitsElement.style.display = "none";
          if (hitsLabel) hitsLabel.style.display = "none";
        }
        if (CONFIG.hideKudos) {
          if (kudosElement) kudosElement.style.display = "none";
          if (kudosLabel) kudosLabel.style.display = "none";
        }
        if (CONFIG.hideBookmarks) {
          if (bookmarksElement) bookmarksElement.style.display = "none";
          if (bookmarksLabel) bookmarksLabel.style.display = "none";
        }
        if (CONFIG.hideComments) {
          if (commentsElement) commentsElement.style.display = "none";
          if (commentsLabel) commentsLabel.style.display = "none";
        }
      }

      if (CONFIG.hideWorksEnabled && parentLi) {
        const username = detectAndStoreUsername();
        const authorLink = parentLi.querySelector('a[href*="/users/"]');
        let shouldHide = true;

        if (authorLink && username) {
          const authorHref = authorLink.getAttribute("href");
          const authorUsername = authorHref.match(/\/users\/([^\/]+)/)?.[1];
          if (authorUsername === username) {
            shouldHide = false;
          }
        }

        if (isMyContentPage(username)) {
          shouldHide = false;
        }

        if (shouldHide) {
          if (parentLi.hasAttribute("kudospercent")) {
            const displayScore = parseFloat(
              parentLi.getAttribute("kudospercent")
            );
            parentLi.style.display =
              displayScore < CONFIG.hideWorksScore ? "none" : "";
          } else {
            parentLi.style.display = CONFIG.keepUnscoredVisible ? "" : "none";
          }
        } else {
          parentLi.style.display = "";
        }
      }
    });
  };

  const calculateReadtime = () => {
    if (!countable || !CONFIG.enableReadingTime) return;
    calculateMetrics(null, false, true);
  };

  const countRatio = () => {
    if (!countable || !CONFIG.enableQualityScore) return;
    calculateMetrics(null, false, true);
  };

  const sortByRatio = (ascending = false, cachedStats = null) => {
    if (!sortable) return;

    const statsElements = cachedStats || Array.from($("dl.stats"));
    const listsToSort = new Set();
    statsElements.forEach((statsElement) => {
      const parentLi = statsElement.closest("li");
      const list = parentLi?.parentElement;
      if (list) listsToSort.add(list);
    });

    listsToSort.forEach((list) => {
      const listElements = Array.from(list.children);

      const parent = list.parentNode;
      const nextSibling = list.nextSibling;
      parent.removeChild(list);

      listElements.forEach((el, index) => {
        if (!el.hasAttribute("data-original-index")) {
          el.setAttribute("data-original-index", index);
        }
      });

      const scoreCache = new Map();
      listElements.forEach((el) => {
        const score = parseFloat(el.getAttribute("kudospercent")) || 0;
        scoreCache.set(el, score);
      });

      listElements.sort((a, b) => {
        return ascending
          ? scoreCache.get(a) - scoreCache.get(b)
          : scoreCache.get(b) - scoreCache.get(a);
      });

      const fragment = document.createDocumentFragment();
      listElements.forEach((el) => fragment.appendChild(el));
      list.appendChild(fragment);

      parent.insertBefore(list, nextSibling);
    });
  };

  const restoreOriginalOrder = () => {
    const allLists = new Set();
    $("dl.stats").forEach((statsElement) => {
      const parentLi = statsElement.closest("li");
      const list = parentLi?.parentElement;
      if (list) allLists.add(list);
    });

    allLists.forEach((list) => {
      const listElements = Array.from(list.children);

      listElements.sort((a, b) => {
        const aIndex = parseInt(a.getAttribute("data-original-index")) || 0;
        const bIndex = parseInt(b.getAttribute("data-original-index")) || 0;
        return aIndex - bIndex;
      });

      const fragment = document.createDocumentFragment();
      listElements.forEach((el) => fragment.appendChild(el));
      list.appendChild(fragment);
    });
  };

  const updateExistingVisualStyles = () => {
    const allStats = Array.from($("dl.stats"));
    allStats.forEach((statsElement) => {
      if (
        CONFIG.hideScoreWorksEnabled &&
        CONFIG._hideScoreWorksSet instanceof Set
      ) {
        const parentLi = statsElement.closest("li.work, li.bookmark");
        let workId = parentLi ? getWorkIdFromElement(parentLi) : null;
        if (!workId) {
          workId = getWorkIdFromUrl();
        }
        if (workId && CONFIG._hideScoreWorksSet.has(workId)) {
          const kudoshitsDt = $1("dt.kudoshits", statsElement);
          const kudoshitsDd = $1("dd.kudoshits", statsElement);
          if (kudoshitsDt) kudoshitsDt.remove();
          if (kudoshitsDd) kudoshitsDd.remove();
          if (parentLi) parentLi.removeAttribute("kudospercent");
        }
      }

      const readtimeDd = $1("dd.readtime", statsElement);
      if (readtimeDd) {
        const span = readtimeDd.querySelector("span");
        if (span) {
          const timeText = span.textContent;
          let minutes = 0;
          const hourMatch = timeText.match(/(\d+)h/);
          const minuteMatch = timeText.match(/(\d+)m/);

          if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
          if (minuteMatch) minutes += parseInt(minuteMatch[1]);

          let color;
          if (minutes < CONFIG.readingTimeLvl1) {
            color = CONFIG.colorGreen;
          } else if (minutes < CONFIG.readingTimeLvl2) {
            color = CONFIG.colorYellow;
          } else {
            color = CONFIG.colorRed;
          }

          span.style.cssText = `border-radius: 4px; display: inline-block; vertical-align: baseline; font-size: inherit; line-height: inherit;`;
          if (CONFIG.colorStyle === "background") {
            span.style.backgroundColor = color;
            span.style.color = CONFIG.colorText;
            span.style.padding = "0 4px";
          } else if (CONFIG.colorStyle === "text") {
            span.style.color = color;
          }
        }
      }

      const kudoshitsDd = $1("dd.kudoshits", statsElement);
      if (kudoshitsDd) {
        const span = kudoshitsDd.querySelector("span");
        if (span) {
          const scoreText = span.textContent;
          const scoreValue = parseFloat(scoreText);

          let color;
          const normalizedThresholdLow = CONFIG.colorThresholdLow;
          const normalizedThresholdHigh = CONFIG.colorThresholdHigh;

          if (scoreValue >= normalizedThresholdHigh) {
            color = CONFIG.colorGreen;
          } else if (scoreValue >= normalizedThresholdLow) {
            color = CONFIG.colorYellow;
          } else {
            color = CONFIG.colorRed;
          }

          span.style.cssText = `border-radius: 4px; display: inline-block; vertical-align: baseline; font-size: inherit; line-height: inherit;`;
          if (CONFIG.colorStyle === "background") {
            span.style.backgroundColor = color;
            span.style.color = CONFIG.colorText;
            span.style.padding = "0 4px";
          } else if (CONFIG.colorStyle === "text") {
            span.style.color = color;
          }
        } else if (kudoshitsDd.textContent && !span) {
          const scoreValue = parseFloat(kudoshitsDd.textContent);

          let color;
          const normalizedThresholdLow = CONFIG.colorThresholdLow;
          const normalizedThresholdHigh = CONFIG.colorThresholdHigh;

          if (scoreValue >= normalizedThresholdHigh) {
            color = CONFIG.colorGreen;
          } else if (scoreValue >= normalizedThresholdLow) {
            color = CONFIG.colorYellow;
          } else {
            color = CONFIG.colorRed;
          }

          kudoshitsDd.style.cssText = `display: inline-block; vertical-align: baseline; border-radius: 4px; font-size: inherit; line-height: inherit;`;
          if (CONFIG.colorStyle === "background") {
            kudoshitsDd.style.backgroundColor = color;
            kudoshitsDd.style.color = CONFIG.colorText;
            kudoshitsDd.style.padding = "0 4px";
          } else if (CONFIG.colorStyle === "text") {
            kudoshitsDd.style.color = color;
          }
        }
      }
    });
  };

  const updateExistingChapterTimeStyles = () => {
    const WORKS_PAGE_REGEX =
      /^https?:\/\/archiveofourown\.org\/(?:.*\/)?(works|chapters)(\/|$)/;
    if (!WORKS_PAGE_REGEX.test(window.location.href)) return;

    const chaptersContainer = $1("#chapters");
    if (!chaptersContainer) return;

    const existingStats = chaptersContainer.querySelectorAll(
      ".ao3-chapter-stats-default, .ao3-chapter-stats-colored, .ao3-chapter-stats-timeonly, .ao3-chapter-stats"
    );
    existingStats.forEach((statsElement) => {
      let wordCountText;
      if (statsElement.classList.contains("ao3-chapter-stats-default")) {
        wordCountText = statsElement.textContent.match(
          /(\d{1,3}(?:,\d{3})*|\d+) words/
        );
      } else if (
        statsElement.classList.contains("ao3-chapter-stats-colored") ||
        statsElement.classList.contains("ao3-chapter-stats")
      ) {
        wordCountText = statsElement.textContent.match(
          /(\d{1,3}(?:,\d{3})*|\d+) words/
        );
      } else if (
        statsElement.classList.contains("ao3-chapter-stats-timeonly")
      ) {
        return;
      }

      if (!wordCountText) return;

      const wordCount = parseInt(wordCountText[1].replace(/,/g, ""));
      const minutes = wordCount / CONFIG.wpm;
      const hrs = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);

      let timeLongStr;
      if (hrs > 0) {
        timeLongStr =
          mins > 0
            ? `${hrs} hour${hrs > 1 ? "s" : ""} ${mins} minute${
                mins > 1 ? "s" : ""
              }`
            : `${hrs} hour${hrs > 1 ? "s" : ""}`;
      } else {
        timeLongStr = `${mins} minute${mins > 1 ? "s" : ""}`;
      }

      let timeOnlyStr;
      if (hrs > 0) {
        timeOnlyStr =
          mins > 0
            ? `${hrs} hour${hrs > 1 ? "s" : ""}, ${mins} minute${
                mins > 1 ? "s" : ""
              }`
            : `${hrs} hour${hrs > 1 ? "s" : ""}`;
      } else {
        timeOnlyStr = `${mins} minute${mins > 1 ? "s" : ""}`;
      }

      if (CONFIG.chapterTimeStyle === "default") {
        if (!statsElement.classList.contains("ao3-chapter-stats-default")) {
          statsElement.className = "ao3-chapter-stats-default";
          statsElement.tagName = "p";
          statsElement.textContent = `~${timeLongStr} (${wordCount.toLocaleString()} words)`;
        }
      } else if (CONFIG.chapterTimeStyle === "colored") {
        if (!statsElement.classList.contains("ao3-chapter-stats")) {
          if (statsElement.tagName !== "UL") {
            const newUl = document.createElement("ul");
            newUl.className = "notice ao3-chapter-stats";
            const listItem = document.createElement("li");
            listItem.textContent = `~${timeLongStr} (${wordCount.toLocaleString()} words)`;
            newUl.appendChild(listItem);
            statsElement.parentNode.replaceChild(newUl, statsElement);
          } else {
            statsElement.className = "notice ao3-chapter-stats";
            const listItem = statsElement.querySelector("li");
            if (listItem) {
              listItem.textContent = `~${timeLongStr} (${wordCount.toLocaleString()} words)`;
            }
          }
        }
      } else if (CONFIG.chapterTimeStyle === "timeonly") {
        if (!statsElement.classList.contains("ao3-chapter-stats-timeonly")) {
          statsElement.className = "ao3-chapter-stats-timeonly";
          statsElement.tagName = "p";
          statsElement.textContent = `~${timeOnlyStr}`;
        }
      }
    });
  };

  const calculateChapterStats = (chaptersContainer = null) => {
    if (!CONFIG.enableChapterStats) return;
    const WORKS_PAGE_REGEX =
      /^https?:\/\/archiveofourown\.org\/(?:.*\/)?(works|chapters)(\/|$)/;
    if (!WORKS_PAGE_REGEX.test(window.location.href)) return;

    const container = chaptersContainer || $1("#chapters");
    if (!container) return;

    const chapters = container.querySelectorAll(".chapter");
    const singleChapter = container.querySelector("div.userstuff");
    let chaptersToProcess = [];

    if (chapters.length > 0) {
      chaptersToProcess = Array.from(chapters);
    } else if (singleChapter) {
      chaptersToProcess = [{ userstuff: singleChapter, isSingle: true }];
    }
    if (chaptersToProcess.length === 0) return;

    const wordRegex = /\b[a-zA-Z][a-zA-Z0-9'-]*\b/g;

    chaptersToProcess.forEach((chapter) => {
      let userstuff;
      let existingStats;

      if (chapter.isSingle) {
        userstuff = chapter.userstuff;
        const chapterNotes = $1("#chapters .notes");
        if (
          userstuff.previousElementSibling &&
          userstuff.previousElementSibling.classList.contains("notice")
        ) {
          return;
        }
        existingStats = chapterNotes;
      } else {
        const prefaceContainer = $1(".chapter.preface", chapter);
        if ($1(".notice.ao3-chapter-stats", chapter)) {
          return;
        }
        userstuff = $1("div.userstuff", chapter);
        existingStats = prefaceContainer;
      }
      if (!userstuff) return;

      const text = userstuff.textContent || "";

      const words = text.match(wordRegex);
      const wordCount = words ? words.length : 0;

      if (wordCount === 0) return;
      const minutes = wordCount / CONFIG.wpm;
      const hrs = Math.floor(minutes / 60);
      const mins = Math.ceil(minutes % 60);

      let timeLongStr;
      if (hrs > 0) {
        timeLongStr =
          mins > 0
            ? `${hrs} hour${hrs > 1 ? "s" : ""} ${mins} minute${
                mins > 1 ? "s" : ""
              }`
            : `${hrs} hour${hrs > 1 ? "s" : ""}`;
      } else {
        timeLongStr = `${mins} minute${mins > 1 ? "s" : ""}`;
      }

      let timeOnlyStr;
      if (hrs > 0) {
        timeOnlyStr =
          mins > 0
            ? `${hrs} hour${hrs > 1 ? "s" : ""}, ${mins} minute${
                mins > 1 ? "s" : ""
              }`
            : `${hrs} hour${hrs > 1 ? "s" : ""}`;
      } else {
        timeOnlyStr = `${mins} minute${mins > 1 ? "s" : ""}`;
      }

      let statsDiv;
      if (CONFIG.chapterTimeStyle === "default") {
        statsDiv = document.createElement("p");
        statsDiv.className = "ao3-chapter-stats-default";
        statsDiv.textContent = `~${timeLongStr} (${wordCount.toLocaleString()} words)`;
      } else if (CONFIG.chapterTimeStyle === "colored") {
        statsDiv = document.createElement("ul");
        statsDiv.className = "notice ao3-chapter-stats";
        const listItem = document.createElement("li");
        listItem.textContent = `~${timeLongStr} (${wordCount.toLocaleString()} words)`;
        statsDiv.appendChild(listItem);
      } else {
        statsDiv = document.createElement("p");
        statsDiv.className = "ao3-chapter-stats-timeonly";
        statsDiv.textContent = `~${timeOnlyStr}`;
      }

      if (chapter.isSingle) {
        if (existingStats) {
          existingStats.insertAdjacentElement("afterend", statsDiv);
        } else {
          userstuff.insertAdjacentElement("beforebegin", statsDiv);
        }
      } else {
        if (existingStats) {
          existingStats.insertAdjacentElement("afterend", statsDiv);
        } else {
          userstuff.insertAdjacentElement("beforebegin", statsDiv);
        }
      }
    });
  };

  const showSettingsPopup = () => {
    if (!window.AO3MenuHelpers) return;

    window.AO3MenuHelpers.removeAllDialogs();

    const dialog = window.AO3MenuHelpers.createDialog(
      "⏱️ Reading Time & Quality Score ⭐",
      {
        maxWidth: "600px",
      }
    );

    const fragment = document.createDocumentFragment();

    const displayThresholdLow = CONFIG.colorThresholdLow;
    const displayThresholdHigh = CONFIG.colorThresholdHigh;

    const displayHideWorksScore = CONFIG.hideWorksScore;

    const readingTimeSection =
      window.AO3MenuHelpers.createSection("📚 Reading Time");
    const readingTimeGroup = window.AO3MenuHelpers.createSettingGroup();
    const enableReadingTimeCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "enableReadingTime",
      label: "Enable Reading Time",
      checked: CONFIG.enableReadingTime,
      inGroup: false,
    });
    readingTimeGroup.appendChild(enableReadingTimeCheckbox);

    const readingTimeSubsettings = window.AO3MenuHelpers.createSubsettings();
    readingTimeSubsettings.style.display = CONFIG.enableReadingTime
      ? ""
      : "none";
    readingTimeSubsettings.appendChild(
      window.AO3MenuHelpers.createCheckbox({
        id: "alwaysCountReadingTime",
        label: "Calculate automatically",
        checked: CONFIG.alwaysCountReadingTime,
      })
    );
    readingTimeSubsettings.appendChild(
      window.AO3MenuHelpers.createCheckbox({
        id: "enableChapterStats",
        label: "Show chapter reading times",
        checked: CONFIG.enableChapterStats,
        tooltip:
          "Show word count and reading time at the start of each chapter",
      })
    );
    readingTimeSubsettings.appendChild(
      window.AO3MenuHelpers.createNumberInput({
        id: "wpm",
        label: "Words per minute",
        value: CONFIG.wpm,
        min: 100,
        max: 1000,
        step: 25,
        tooltip:
          "Average reading speed is 200-300 wpm. 375 is for faster readers.",
      })
    );
    const readingTimeTwoColumn = window.AO3MenuHelpers.createTwoColumnLayout(
      window.AO3MenuHelpers.createNumberInput({
        id: "readingTimeLvl1",
        label: "Yellow threshold (minutes)",
        value: CONFIG.readingTimeLvl1,
        min: 5,
        max: 240,
        step: 5,
        tooltip:
          "Works taking less than this many minutes will be colored green",
      }),
      window.AO3MenuHelpers.createNumberInput({
        id: "readingTimeLvl2",
        label: "Red threshold (minutes)",
        value: CONFIG.readingTimeLvl2,
        min: 30,
        max: 480,
        step: 10,
        tooltip: "Works taking more than this many minutes will be colored red",
      })
    );
    readingTimeTwoColumn.style.marginBottom = "0";
    readingTimeSubsettings.appendChild(readingTimeTwoColumn);
    readingTimeGroup.appendChild(readingTimeSubsettings);
    readingTimeSection.appendChild(readingTimeGroup);
    fragment.appendChild(readingTimeSection);

    const qualityScoreSection =
      window.AO3MenuHelpers.createSection("💖 Quality Score");
    qualityScoreSection.style.paddingBottom = "20px";
    const qualityScoreGroup = window.AO3MenuHelpers.createSettingGroup();
    const enableQualityScoreCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "enableQualityScore",
      label: "Enable Quality Score",
      checked: CONFIG.enableQualityScore,
      inGroup: false,
    });
    qualityScoreGroup.appendChild(enableQualityScoreCheckbox);

    const qualityScoreSubsettings = window.AO3MenuHelpers.createSubsettings();
    qualityScoreSubsettings.style.display = CONFIG.enableQualityScore
      ? ""
      : "none";
    qualityScoreSubsettings.appendChild(
      window.AO3MenuHelpers.createCheckbox({
        id: "alwaysCountQualityScore",
        label: "Calculate automatically",
        checked: CONFIG.alwaysCountQualityScore,
      })
    );

    const autoCalculateSubsettings = window.AO3MenuHelpers.createSubsettings();
    autoCalculateSubsettings.style.display = CONFIG.alwaysCountQualityScore
      ? ""
      : "none";

    const alwaysSortGroup = window.AO3MenuHelpers.createSettingGroup();
    const alwaysSortCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "alwaysSortQualityScore",
      label: "Sort by score automatically",
      checked: CONFIG.alwaysSortQualityScore,
      inGroup: false,
    });
    alwaysSortGroup.appendChild(alwaysSortCheckbox);

    const excludeMyContentSubsetting =
      window.AO3MenuHelpers.createSubsettings();
    excludeMyContentSubsetting.style.marginLeft = "1em";
    excludeMyContentSubsetting.style.display = CONFIG.alwaysSortQualityScore
      ? ""
      : "none";
    excludeMyContentSubsetting.appendChild(
      window.AO3MenuHelpers.createCheckbox({
        id: "excludeMyContentFromSort",
        label: "Exclude my content",
        checked: CONFIG.excludeMyContentFromSort,
        tooltip:
          "Disable automatic sorting on your user dashboard, bookmarks, history, and works pages",
        inGroup: false,
      })
    );
    alwaysSortGroup.appendChild(excludeMyContentSubsetting);
    autoCalculateSubsettings.appendChild(alwaysSortGroup);
    qualityScoreSubsettings.appendChild(autoCalculateSubsettings);
    qualityScoreSubsettings.appendChild(
      window.AO3MenuHelpers.createNumberInput({
        id: "minKudosToShowScore",
        label: "Minimum kudos to show score",
        value: CONFIG.minKudosToShowScore,
        min: 0,
        step: 1,
      })
    );

    const normalizationGroup = window.AO3MenuHelpers.createSettingGroup();
    const useNormalizationCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "useNormalization",
      label: "Normalize scores to 100%",
      checked: CONFIG.useNormalization,
      tooltip:
        "Scale the raw score so your 'Best Possible Raw Score' equals 100%. Makes scores from different fandoms more comparable.",
      inGroup: false,
    });
    normalizationGroup.appendChild(useNormalizationCheckbox);

    const userMaxScoreGroup = window.AO3MenuHelpers.createSettingGroup();
    userMaxScoreGroup.id = "userMaxScoreContainer";
    userMaxScoreGroup.style.display = CONFIG.useNormalization ? "" : "none";

    const userMaxScoreLabel = document.createElement("label");
    userMaxScoreLabel.className = "setting-label";
    userMaxScoreLabel.setAttribute("for", "userMaxScore");
    userMaxScoreLabel.textContent = "Max Raw Score ";

    const normalizationLabel = document.createElement("span");
    normalizationLabel.id = "normalizationLabel";
    normalizationLabel.textContent = CONFIG.useNormalization ? "(100%)" : "";
    userMaxScoreLabel.appendChild(normalizationLabel);

    userMaxScoreLabel.appendChild(document.createTextNode(" "));
    userMaxScoreLabel.appendChild(
      window.AO3MenuHelpers.createTooltip(
        "The top score you want to treat as 100%. Use a solid high performer, not the single highest spike."
      )
    );

    userMaxScoreGroup.appendChild(userMaxScoreLabel);
    userMaxScoreGroup.appendChild(
      window.AO3MenuHelpers.createNumberInput({
        id: "userMaxScore",
        value: CONFIG.userMaxScore,
        min: 1,
        max: 100,
        step: 1,
      })
    );
    normalizationGroup.appendChild(userMaxScoreGroup);
    qualityScoreSubsettings.appendChild(normalizationGroup);

    const thresholdLowLabel = document.createElement("label");
    thresholdLowLabel.className = "setting-label";
    thresholdLowLabel.setAttribute("for", "colorThresholdLow");
    thresholdLowLabel.textContent = "Good Score ";

    const thresholdLowLabelSpan = document.createElement("span");
    thresholdLowLabelSpan.id = "thresholdLowLabel";
    thresholdLowLabelSpan.textContent = CONFIG.useNormalization ? "(%)" : "";
    thresholdLowLabel.appendChild(thresholdLowLabelSpan);

    thresholdLowLabel.appendChild(document.createTextNode(" "));
    thresholdLowLabel.appendChild(
      window.AO3MenuHelpers.createTooltip(
        "Scores at or above this threshold will be colored yellow"
      )
    );

    const thresholdHighLabel = document.createElement("label");
    thresholdHighLabel.className = "setting-label";
    thresholdHighLabel.setAttribute("for", "colorThresholdHigh");
    thresholdHighLabel.textContent = "Excellent Score ";

    const thresholdHighLabelSpan = document.createElement("span");
    thresholdHighLabelSpan.id = "thresholdHighLabel";
    thresholdHighLabelSpan.textContent = CONFIG.useNormalization ? "(%)" : "";
    thresholdHighLabel.appendChild(thresholdHighLabelSpan);

    thresholdHighLabel.appendChild(document.createTextNode(" "));
    thresholdHighLabel.appendChild(
      window.AO3MenuHelpers.createTooltip(
        "Scores at or above this threshold will be colored green"
      )
    );

    const colorThresholdLowInput = document.createElement("div");
    colorThresholdLowInput.className = "setting-group";
    colorThresholdLowInput.style.marginBottom = "0";
    colorThresholdLowInput.appendChild(thresholdLowLabel);
    colorThresholdLowInput.appendChild(
      window.AO3MenuHelpers.createNumberInput({
        id: "colorThresholdLow",
        value: displayThresholdLow,
        min: 0.1,
        max: 100,
        step: 0.1,
      }).querySelector("input")
    );

    const colorThresholdHighInput = document.createElement("div");
    colorThresholdHighInput.className = "setting-group";
    colorThresholdHighInput.style.marginBottom = "0";
    colorThresholdHighInput.appendChild(thresholdHighLabel);
    colorThresholdHighInput.appendChild(
      window.AO3MenuHelpers.createNumberInput({
        id: "colorThresholdHigh",
        value: displayThresholdHigh,
        min: 0.1,
        max: 100,
        step: 0.1,
      }).querySelector("input")
    );

    const thresholdTwoColumn = window.AO3MenuHelpers.createTwoColumnLayout(
      colorThresholdLowInput,
      colorThresholdHighInput
    );
    thresholdTwoColumn.style.marginBottom = "0";
    qualityScoreSubsettings.appendChild(thresholdTwoColumn);

    const hideWorksScoreLabel = document.createElement("label");
    hideWorksScoreLabel.className = "setting-label";
    hideWorksScoreLabel.setAttribute("for", "hideWorksScore");
    hideWorksScoreLabel.textContent = "Minimum Score ";

    const hideWorksScoreLabelSpan = document.createElement("span");
    hideWorksScoreLabelSpan.id = "hideWorksScoreLabel";
    hideWorksScoreLabelSpan.textContent = CONFIG.useNormalization ? "(%)" : "";
    hideWorksScoreLabel.appendChild(hideWorksScoreLabelSpan);

    const hideWorksScoreInput = window.AO3MenuHelpers.createNumberInput({
      id: "hideWorksScore",
      value: displayHideWorksScore,
      min: 1,
      max: 100,
      step: 1,
    });

    const keepUnscoredCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "keepUnscoredVisible",
      label: "Show unscored works",
      checked: CONFIG.hideWorksEnabled ? true : CONFIG.keepUnscoredVisible,
    });

    const hideWorksSubsettings = window.AO3MenuHelpers.createSubsettings();
    hideWorksSubsettings.appendChild(hideWorksScoreLabel);
    hideWorksSubsettings.appendChild(hideWorksScoreInput);
    hideWorksSubsettings.appendChild(keepUnscoredCheckbox);

    const hideWorksConditional =
      window.AO3MenuHelpers.createConditionalCheckbox({
        id: "hideWorksEnabled",
        label: "Hide works below score",
        checked: CONFIG.hideWorksEnabled,
        tooltip:
          "Works with scores below this threshold will be hidden. Excludes your own works, bookmarks, and history.",
        subsettings: [hideWorksSubsettings],
      });

    hideWorksConditional.style.marginTop = "10px";

    qualityScoreSubsettings.appendChild(hideWorksConditional);

    const hideScoreWorksSubsettings = window.AO3MenuHelpers.createSubsettings();
    hideScoreWorksSubsettings.appendChild(
      window.AO3MenuHelpers.createTextarea({
        id: "hideScoreWorks-input",
        label: "Work IDs",
        value: CONFIG.hideScoreWorks,
        placeholder: "73294031, 12345678",
        tooltip:
          "Enter work IDs (8-digit numbers from the work URL), separated by commas. Invalid IDs will be filtered out.",
      })
    );

    const hideScoreWorksConditional =
      window.AO3MenuHelpers.createConditionalCheckbox({
        id: "hideScoreWorksEnabled",
        label: "Hide scores on specific works",
        checked: CONFIG.hideScoreWorksEnabled,
        tooltip:
          "Hide quality scores on works by their ID. Scores will not be calculated or displayed for these works.",
        subsettings: [hideScoreWorksSubsettings],
      });

    hideScoreWorksConditional.style.marginTop = "10px";

    qualityScoreSubsettings.appendChild(hideScoreWorksConditional);

    qualityScoreGroup.appendChild(qualityScoreSubsettings);
    qualityScoreSection.appendChild(qualityScoreGroup);
    fragment.appendChild(qualityScoreSection);

    const visualSection =
      window.AO3MenuHelpers.createSection("🎨 Visual Styling");

    const twoColumnLayout = document.createElement("div");
    twoColumnLayout.className = "two-column";

    twoColumnLayout.appendChild(
      window.AO3MenuHelpers.createSelect({
        id: "colorStyle",
        label: "Visual Style:",
        options: [
          {
            value: "none",
            label: "Default",
            selected: CONFIG.colorStyle === "none",
          },
          {
            value: "text",
            label: "Colored",
            selected: CONFIG.colorStyle === "text",
          },
          {
            value: "background",
            label: "Bars",
            selected: CONFIG.colorStyle === "background",
          },
        ],
      })
    );

    const chapterTimeStyleGroup = window.AO3MenuHelpers.createSelect({
      id: "chapterTimeStyle",
      label: "Chapter Time Style:",
      options: [
        {
          value: "default",
          label: "Default",
          selected: CONFIG.chapterTimeStyle === "default",
        },
        {
          value: "colored",
          label: "Notice",
          selected: CONFIG.chapterTimeStyle === "colored",
        },
        {
          value: "timeonly",
          label: "Time Only",
          selected: CONFIG.chapterTimeStyle === "timeonly",
        },
      ],
    });
    chapterTimeStyleGroup.id = "chapterTimeStyleSettings";
    chapterTimeStyleGroup.style.display = CONFIG.enableChapterStats
      ? ""
      : "none";
    twoColumnLayout.appendChild(chapterTimeStyleGroup);

    visualSection.appendChild(twoColumnLayout);

    const colorPickerSettings = window.AO3MenuHelpers.createSubsettings();
    colorPickerSettings.id = "colorPickerSettings";
    colorPickerSettings.style.display =
      CONFIG.colorStyle !== "none" ? "" : "none";

    const twoColumnColors = document.createElement("div");
    twoColumnColors.className = "two-column";
    twoColumnLayout.style.marginBottom = "0";
    twoColumnColors.appendChild(
      window.AO3MenuHelpers.createTextInput({
        id: "colorGreen",
        label: "Green",
        value: CONFIG.colorGreen,
        placeholder: "#hex or rgb(r,g,b)",
      })
    );
    twoColumnColors.appendChild(
      window.AO3MenuHelpers.createTextInput({
        id: "colorYellow",
        label: "Yellow",
        value: CONFIG.colorYellow,
        placeholder: "#hex or rgb(r,g,b)",
      })
    );
    twoColumnColors.appendChild(
      window.AO3MenuHelpers.createTextInput({
        id: "colorRed",
        label: "Red",
        value: CONFIG.colorRed,
        placeholder: "#hex or rgb(r,g,b)",
      })
    );

    const textColorContainer = window.AO3MenuHelpers.createSettingGroup();
    textColorContainer.id = "textColorContainer";
    textColorContainer.style.display =
      CONFIG.colorStyle === "background" ? "" : "none";
    textColorContainer.appendChild(
      window.AO3MenuHelpers.createTextInput({
        id: "colorText",
        label: "Text color",
        value: CONFIG.colorText,
        placeholder: "#hex or rgb(r,g,b)",
      })
    );
    twoColumnColors.appendChild(textColorContainer);

    colorPickerSettings.appendChild(twoColumnColors);
    visualSection.appendChild(colorPickerSettings);

    const useIconsGroup = window.AO3MenuHelpers.createSettingGroup();
    const useIconsCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "useIcons",
      label: "Use icons instead of text labels",
      checked: CONFIG.useIcons,
      tooltip: "Replace 'Time:' and 'Score:' labels with icons",
      inGroup: false,
    });
    useIconsGroup.appendChild(useIconsCheckbox);

    const iconColorSettings = window.AO3MenuHelpers.createSubsettings();
    iconColorSettings.id = "iconColorSettings";
    iconColorSettings.style.display = CONFIG.useIcons ? "" : "none";
    iconColorSettings.appendChild(
      window.AO3MenuHelpers.createCheckbox({
        id: "useCustomIconColor",
        label: "Use custom icon color",
        checked: !!CONFIG.iconColor,
        tooltip:
          "When unchecked, icons will inherit color from your site skin. When checked, you can set a specific color.",
      })
    );

    const customIconColorPicker = window.AO3MenuHelpers.createSettingGroup();
    customIconColorPicker.id = "customIconColorPicker";
    customIconColorPicker.style.display = CONFIG.iconColor ? "" : "none";
    customIconColorPicker.appendChild(
      window.AO3MenuHelpers.createTextInput({
        id: "iconColor",
        label: "Icon color",
        value: CONFIG.iconColor || "#000000",
        placeholder: "#hex or rgb(r,g,b)",
      })
    );
    iconColorSettings.appendChild(customIconColorPicker);
    useIconsGroup.appendChild(iconColorSettings);
    visualSection.appendChild(useIconsGroup);

    const hideMetricsGroup = window.AO3MenuHelpers.createSettingGroup();
    const hideMetricsCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "hideMetrics",
      label: "Hide metrics",
      checked: CONFIG.hideMetrics,
      tooltip: "Hide metrics (hits, kudos, bookmarkers, comments) from blurbs",
      inGroup: false,
    });
    hideMetricsGroup.appendChild(hideMetricsCheckbox);

    const hideMetricsSubsettings = window.AO3MenuHelpers.createSubsettings();
    hideMetricsSubsettings.id = "hideMetricsSubsettings";
    hideMetricsSubsettings.style.display = CONFIG.hideMetrics ? "" : "none";

    const hideHitsKudosRow = window.AO3MenuHelpers.createTwoColumnLayout(
      window.AO3MenuHelpers.createCheckbox({
        id: "hideHits",
        label: "Hits",
        checked: CONFIG.hideHits,
        inGroup: false,
      }),
      window.AO3MenuHelpers.createCheckbox({
        id: "hideKudos",
        label: "Kudos",
        checked: CONFIG.hideKudos,
        inGroup: false,
      })
    );
    hideMetricsSubsettings.appendChild(hideHitsKudosRow);

    const hideBookmarksCommentsRow =
      window.AO3MenuHelpers.createTwoColumnLayout(
        window.AO3MenuHelpers.createCheckbox({
          id: "hideBookmarks",
          label: "Bookmarks",
          checked: CONFIG.hideBookmarks,
          inGroup: false,
        }),
        window.AO3MenuHelpers.createCheckbox({
          id: "hideComments",
          label: "Comments",
          checked: CONFIG.hideComments,
          inGroup: false,
        })
      );
    hideMetricsSubsettings.appendChild(hideBookmarksCommentsRow);
    hideMetricsGroup.appendChild(hideMetricsSubsettings);
    visualSection.appendChild(hideMetricsGroup);

    fragment.appendChild(visualSection);

    fragment.appendChild(
      window.AO3MenuHelpers.createButtonGroup([
        { text: "Save", id: "saveButton" },
        { text: "Cancel", id: "closeButton" },
      ])
    );
    fragment.appendChild(
      window.AO3MenuHelpers.createResetLink("Reset to Default Settings", () => {
        resetAllSettings();
        dialog.remove();
      })
    );

    dialog.appendChild(fragment);
    dialog
      .querySelector("#enableReadingTime")
      .addEventListener("change", (e) => {
        readingTimeSubsettings.style.display = e.target.checked ? "" : "none";
      });

    dialog
      .querySelector("#enableChapterStats")
      .addEventListener("change", (e) => {
        chapterTimeStyleGroup.style.display = e.target.checked ? "" : "none";
      });

    dialog
      .querySelector("#enableQualityScore")
      .addEventListener("change", (e) => {
        qualityScoreSubsettings.style.display = e.target.checked ? "" : "none";
      });

    dialog
      .querySelector("#alwaysSortQualityScore")
      .addEventListener("change", (e) => {
        excludeMyContentSubsetting.style.display = e.target.checked
          ? ""
          : "none";
      });

    const colorStyleSelect = dialog.querySelector("#colorStyle");
    colorStyleSelect.addEventListener("change", () => {
      const selectedStyle = colorStyleSelect.value;
      colorPickerSettings.style.display =
        selectedStyle !== "none" ? "" : "none";
      textColorContainer.style.display =
        selectedStyle === "background" ? "" : "none";
    });

    dialog.querySelector("#useIcons").addEventListener("change", (e) => {
      iconColorSettings.style.display = e.target.checked ? "" : "none";
    });

    dialog
      .querySelector("#useCustomIconColor")
      .addEventListener("change", (e) => {
        customIconColorPicker.style.display = e.target.checked ? "" : "none";
      });

    dialog
      .querySelector("#useNormalization")
      .addEventListener("change", (e) => {
        const isNormalizationEnabled = e.target.checked;
        const normLabel = dialog.querySelector("#normalizationLabel");
        const thresholdLowLabel = dialog.querySelector("#thresholdLowLabel");
        const thresholdHighLabel = dialog.querySelector("#thresholdHighLabel");
        const thresholdLowInput = dialog.querySelector("#colorThresholdLow");
        const thresholdHighInput = dialog.querySelector("#colorThresholdHigh");
        const userMaxScoreInput = dialog.querySelector("#userMaxScore");
        const userMaxScoreContainer = dialog.querySelector(
          "#userMaxScoreContainer"
        );

        if (isNormalizationEnabled) {
          normLabel.textContent = "(for 100%)";
          thresholdLowLabel.textContent = "(%)";
          thresholdHighLabel.textContent = "(%)";
          userMaxScoreContainer.style.display = "";
          thresholdLowInput.value = 40;
          thresholdHighInput.value = 60;
        } else {
          normLabel.textContent = "";
          thresholdLowLabel.textContent = "";
          thresholdHighLabel.textContent = "";
          userMaxScoreContainer.style.display = "none";
          thresholdLowInput.value = 8;
          thresholdHighInput.value = 14;
        }

        const hideWorksScoreInput = dialog.querySelector("#hideWorksScore");
        const hideWorksScoreLabel = dialog.querySelector(
          "#hideWorksScoreLabel"
        );
        if (isNormalizationEnabled) {
          hideWorksScoreLabel.textContent = "(%)";
          hideWorksScoreInput.value = 20;
          hideWorksScoreInput.max = 100;
        } else {
          hideWorksScoreLabel.textContent = "";
          hideWorksScoreInput.value = 4;
          hideWorksScoreInput.max = 100;
        }
      });

    dialog.querySelector("#hideMetrics").addEventListener("change", (e) => {
      hideMetricsSubsettings.style.display = e.target.checked ? "" : "none";
    });

    dialog
      .querySelector("#alwaysCountQualityScore")
      .addEventListener("change", (e) => {
        autoCalculateSubsettings.style.display = e.target.checked ? "" : "none";
      });

    dialog.querySelector("#closeButton").addEventListener("click", () => {
      dialog.remove();
    });

    dialog.querySelector("#saveButton").addEventListener("click", () => {
      let userMaxScoreValue = parseFloat(
        dialog.querySelector("#userMaxScore").value
      );
      let thresholdLowValue = parseFloat(
        dialog.querySelector("#colorThresholdLow").value
      );
      let thresholdHighValue = parseFloat(
        dialog.querySelector("#colorThresholdHigh").value
      );
      const isNormalizationEnabled =
        dialog.querySelector("#useNormalization").checked;

      CONFIG.enableReadingTime =
        dialog.querySelector("#enableReadingTime").checked;
      CONFIG.enableQualityScore = dialog.querySelector(
        "#enableQualityScore"
      ).checked;
      CONFIG.enableChapterStats = dialog.querySelector(
        "#enableChapterStats"
      ).checked;
      CONFIG.alwaysCountReadingTime = dialog.querySelector(
        "#alwaysCountReadingTime"
      ).checked;
      CONFIG.wpm = parseInt(dialog.querySelector("#wpm").value);
      CONFIG.readingTimeLvl1 = parseInt(
        dialog.querySelector("#readingTimeLvl1").value
      );
      CONFIG.readingTimeLvl2 = parseInt(
        dialog.querySelector("#readingTimeLvl2").value
      );
      CONFIG.alwaysCountQualityScore = dialog.querySelector(
        "#alwaysCountQualityScore"
      ).checked;

      const wasAutoSortEnabled = CONFIG.alwaysSortQualityScore;
      CONFIG.alwaysSortQualityScore = dialog.querySelector(
        "#alwaysSortQualityScore"
      ).checked;

      if (wasAutoSortEnabled && !CONFIG.alwaysSortQualityScore) {
        restoreOriginalOrder();
      }

      CONFIG.excludeMyContentFromSort =
        dialog.querySelector("#excludeMyContentFromSort")?.checked || false;
      CONFIG.hideMetrics = dialog.querySelector("#hideMetrics").checked;
      CONFIG.hideHits = dialog.querySelector("#hideHits").checked;
      CONFIG.hideKudos = dialog.querySelector("#hideKudos").checked;
      CONFIG.hideBookmarks = dialog.querySelector("#hideBookmarks").checked;
      CONFIG.hideComments = dialog.querySelector("#hideComments").checked;
      CONFIG.minKudosToShowScore = parseInt(
        dialog.querySelector("#minKudosToShowScore").value
      );

      const normalizationChanged =
        CONFIG.useNormalization !== isNormalizationEnabled;

      CONFIG.useNormalization = isNormalizationEnabled;
      CONFIG.userMaxScore = userMaxScoreValue;
      CONFIG.colorThresholdLow = thresholdLowValue;
      CONFIG.colorThresholdHigh = thresholdHighValue;
      CONFIG.colorStyle = dialog.querySelector("#colorStyle").value;
      CONFIG.colorGreen = dialog.querySelector("#colorGreen").value;
      CONFIG.colorYellow = dialog.querySelector("#colorYellow").value;
      CONFIG.colorRed = dialog.querySelector("#colorRed").value;
      CONFIG.colorText = dialog.querySelector("#colorText").value;
      CONFIG.useIcons = dialog.querySelector("#useIcons").checked;
      CONFIG.iconColor = dialog.querySelector("#useCustomIconColor").checked
        ? dialog.querySelector("#iconColor").value
        : "";
      CONFIG.chapterTimeStyle = dialog.querySelector("#chapterTimeStyle").value;

      CONFIG.hideWorksEnabled =
        dialog.querySelector("#hideWorksEnabled").checked;
      CONFIG.keepUnscoredVisible = dialog.querySelector(
        "#keepUnscoredVisible"
      ).checked;
      if (!CONFIG.hideWorksEnabled) {
        CONFIG.keepUnscoredVisible = false;
      }
      CONFIG.hideWorksScore = parseFloat(
        dialog.querySelector("#hideWorksScore").value
      );

      const hideScoreWorksChanged =
        CONFIG.hideScoreWorksEnabled !==
          dialog.querySelector("#hideScoreWorksEnabled").checked ||
        CONFIG.hideScoreWorks !==
          dialog.querySelector("#hideScoreWorks-input").value;

      CONFIG.hideScoreWorksEnabled = dialog.querySelector(
        "#hideScoreWorksEnabled"
      ).checked;
      CONFIG.hideScoreWorks = dialog.querySelector(
        "#hideScoreWorks-input"
      ).value;
      buildHideScoreWorksSet();

      saveAllSettings();
      dialog.remove();

      const existingIconStyles = document.getElementById(
        "ao3-userscript-icon-styles"
      );
      if (existingIconStyles) existingIconStyles.remove();
      if (CONFIG.useIcons) addIconStyles();

      updateExistingVisualStyles();

      updateExistingChapterTimeStyles();

      const readingTimeDisabled =
        CONFIG.enableReadingTime && !CONFIG.alwaysCountReadingTime;
      const qualityScoreDisabled =
        CONFIG.enableQualityScore && !CONFIG.alwaysCountQualityScore;

      if (readingTimeDisabled || qualityScoreDisabled) {
        const allStats = Array.from($("dl.stats"));
        allStats.forEach((statsElement) => {
          if (readingTimeDisabled) {
            const readtimeDt = $1("dt.readtime", statsElement);
            const readtimeDd = $1("dd.readtime", statsElement);
            if (readtimeDt) readtimeDt.remove();
            if (readtimeDd) readtimeDd.remove();
          }
          if (qualityScoreDisabled) {
            const kudoshitsDt = $1("dt.kudoshits", statsElement);
            const kudoshitsDd = $1("dd.kudoshits", statsElement);
            if (kudoshitsDt) kudoshitsDt.remove();
            if (kudoshitsDd) kudoshitsDd.remove();
          }
        });
      }

      if (
        hideScoreWorksChanged ||
        (CONFIG.alwaysCountReadingTime && CONFIG.enableReadingTime) ||
        (CONFIG.alwaysCountQualityScore && CONFIG.enableQualityScore)
      ) {
        calculateMetrics(null, normalizationChanged, true);
      }
      if (CONFIG.alwaysSortQualityScore && CONFIG.enableQualityScore) {
        const username = detectAndStoreUsername();
        const myContentPage = isMyContentPage(username);
        if (!(CONFIG.excludeMyContentFromSort && myContentPage)) {
          sortByRatio();
        }
      }
      if (CONFIG.enableChapterStats) {
        calculateChapterStats();
      }
    });

    document.body.appendChild(dialog);
  };

  function initSharedMenu() {
    if (window.AO3MenuHelpers) {
      window.AO3MenuHelpers.addToSharedMenu({
        id: "opencfg_reading_quality",
        text: "Reading Time & Quality Score",
        onClick: showSettingsPopup,
      });

      if (CONFIG.enableReadingTime || CONFIG.enableQualityScore) {
      }

      if (CONFIG.enableReadingTime && !CONFIG.alwaysCountReadingTime) {
        window.AO3MenuHelpers.addToSharedMenu({
          id: "calc_reading_time",
          text: "Reading Time: Calculate Times",
          onClick: calculateReadtime,
        });
      }

      if (CONFIG.enableQualityScore && !CONFIG.alwaysCountQualityScore) {
        window.AO3MenuHelpers.addToSharedMenu({
          id: "calc_quality_score",
          text: "Quality Score: Calculate Scores",
          onClick: countRatio,
        });
      }

      const username = detectAndStoreUsername();
      const isWorksPage = /^\/works\/(\d+)(\/chapters\/\d+)?(\/|$)/.test(
        window.location.pathname
      );
      if (
        isAllowedMenuPage() &&
        CONFIG.enableQualityScore &&
        (!CONFIG.alwaysSortQualityScore ||
          (CONFIG.alwaysSortQualityScore &&
            CONFIG.excludeMyContentFromSort &&
            isMyContentPage(username))) &&
        !isWorksPage
      ) {
        window.AO3MenuHelpers.addToSharedMenu({
          id: "sort_by_score",
          text: "Quality Score: Sort by Score",
          onClick: () => sortByRatio(),
        });
      }
    }
  }

  function isAllowedMenuPage() {
    const path = window.location.pathname;
    if (/^\/works\/(\d+)(\/chapters\/\d+)?(\/|$)/.test(path)) return false;
    if (
      /^\/users\/[^\/]+\/bookmarks(\/|$)/.test(path) ||
      /^\/bookmarks(\/|$)/.test(path)
    )
      return true;
    if (/^\/users\/[^\/]+\/pseuds\/[^\/]+\/bookmarks(\/|$)/.test(path))
      return true;
    if (/^\/users\/[^\/]+\/?$/.test(path)) return true;
    if (/^\/users\/[^\/]+\/pseuds\/[^\/]+\/works(\/|$)/.test(path)) return true;
    if (/^\/tags\/[^\/]+\/works(\/|$)/.test(path)) return true;
    if (/^\/collections\/[^\/]+(\/|$)/.test(path)) return true;
    if (/^\/works(\/|$)/.test(path)) return true;
    return false;
  }

  const init = () => {
    checkCountable();

    const cachedElements = {
      allStats: countable ? Array.from($("dl.stats")) : [],
      workElements: Array.from($("li.work, li.bookmark")),
      chaptersContainer: $1("#chapters"),
    };

    initSharedMenu();

    const username = detectAndStoreUsername();

    const runCalculations = () => {
      if (
        (CONFIG.alwaysCountReadingTime && CONFIG.enableReadingTime) ||
        (CONFIG.alwaysCountQualityScore && CONFIG.enableQualityScore)
      ) {
        calculateMetrics(cachedElements.allStats, false, true);

        if (CONFIG.alwaysSortQualityScore && CONFIG.enableQualityScore) {
          const myContentPage = isMyContentPage(username);
          if (!(CONFIG.excludeMyContentFromSort && myContentPage)) {
            sortByRatio(false, cachedElements.allStats);
          }
        }
      }

      if (CONFIG.hideMetrics) {
        calculateMetrics(cachedElements.allStats, false, false);
      }

      if (CONFIG.enableChapterStats) {
        calculateChapterStats(cachedElements.chaptersContainer);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(runCalculations, { timeout: 500 });
    } else {
      setTimeout(runCalculations, 0);
    }
  };

  if (CONFIG.useIcons) {
    addIconStyles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
