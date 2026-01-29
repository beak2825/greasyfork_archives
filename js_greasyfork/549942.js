// ==UserScript==
// @name          AO3: Advanced Blocker
// @version       4.0.5
// @description   Block works by tags, authors, titles, word counts, and more. Filter by language, completion status, and primary pairings with customizable highlighting.
// @author        BlackBatCat
// @match         *://archiveofourown.org/tags/*
// @match         *://archiveofourown.org/works
// @match         *://archiveofourown.org/works?*
// @match         *://archiveofourown.org/works/search*
// @match         *://archiveofourown.org/users/*
// @match         *://archiveofourown.org/collections/*
// @match         *://archiveofourown.org/bookmarks*
// @match         *://archiveofourown.org/series/*
// @license       MIT
// @require       https://update.greasyfork.org/scripts/554170/1693013/AO3%3A%20Menu%20Helpers%20Library%20v2.js?v=2.1.6
// @grant         none
// @run-at        document-end
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/549942/AO3%3A%20Advanced%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/549942/AO3%3A%20Advanced%20Blocker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let quickAddKeyPressed = false;
  let cachedUsername = null;
  let checkWorksTimeout = null;

  function scheduleCheckWorks() {
    if (checkWorksTimeout) {
      clearTimeout(checkWorksTimeout);
    }
    checkWorksTimeout = setTimeout(() => {
      clearProcessedFlags();
      checkWorks();
      checkWorksTimeout = null;
    }, 100);
  }
  function detectUsername(config) {
    if (cachedUsername) return cachedUsername;
    if (config.username) {
      cachedUsername = config.username;
      return config.username;
    }
    const userLink = document.querySelector(
      'li.user.logged-in a[href^="/users/"]',
    );
    if (userLink) {
      const username = userLink.textContent.trim();
      if (username && config.username !== username) {
        config.username = username;
        saveConfig(config);
      }
      cachedUsername = username;
      return username;
    }
    const urlMatch = window.location.href.match(/\/users\/([^\/]+)/);
    if (urlMatch && urlMatch[1]) {
      const username = urlMatch[1];
      if (config.username !== username) {
        config.username = username;
        saveConfig(config);
      }
      cachedUsername = username;
      return username;
    }
    return null;
  }

  window.ao3Blocker = {};
  try {
    console.log("[AO3: Advanced Blocker] loaded.");
  } catch (e) {}

  const normalizationCache = new Map();

  const CSS_NAMESPACE = "ao3-blocker";
  const VERSION = "4.0.5"; // Keep in sync with @version in userscript header

  const DEFAULTS = {
    tagBlacklist: "",
    tagWhitelist: "",
    tagHighlights: "",
    highlightColor: "#eb6f92",
    minWords: "",
    maxWords: "",
    minChapters: "",
    maxChapters: "",
    maxMonthsSinceUpdate: "",
    blockComplete: false,
    blockOngoing: false,
    authorBlacklist: "",
    titleBlacklist: "",
    summaryBlacklist: "",
    workBlacklist: "",
    showReasons: true,
    showPlaceholders: true,
    allowedLanguages: "",
    maxCrossovers: "6",
    disableOnMyContent: true,
    enableHighlightingOnMyContent: false,
    username: null,
    primaryRelationships: "",
    primaryCharacters: "",
    primaryRelpad: "1",
    primaryCharpad: "5",
    pauseBlocking: false,
    hideCompletelyRules: {},
    quickAddKey: "Alt",
    enableStrictTagBlocking: false,
    strictTagBlacklist: "",
    conditionalTagBlacklist: [],
    _version: VERSION,
  };

  const STORAGE_KEY = "ao3_advanced_blocker_config";

  function sanitizeConfig(config) {
    const sanitized = {};
    const stringFields = [
      "tagBlacklist",
      "tagWhitelist",
      "tagHighlights",
      "authorBlacklist",
      "titleBlacklist",
      "summaryBlacklist",
      "workBlacklist",
      "allowedLanguages",
      "primaryRelationships",
      "primaryCharacters",
      "minWords",
      "maxWords",
      "minChapters",
      "maxChapters",
      "maxMonthsSinceUpdate",
      "maxCrossovers",
      "highlightColor",
      "primaryRelpad",
      "primaryCharpad",
      "username",
      "quickAddKey",
      "strictTagBlacklist",
    ];
    stringFields.forEach((field) => {
      const value = config[field];
      sanitized[field] =
        typeof value === "string"
          ? value
          : value === null
            ? null
            : typeof value === "number"
              ? String(value)
              : String(DEFAULTS[field]);
    });
    const boolFields = [
      "blockComplete",
      "blockOngoing",
      "showReasons",
      "showPlaceholders",
      "disableOnMyContent",
      "enableHighlightingOnMyContent",
      "pauseBlocking",
      "enableStrictTagBlocking",
    ];
    boolFields.forEach((field) => {
      sanitized[field] =
        typeof config[field] === "boolean" ? config[field] : DEFAULTS[field];
    });
    sanitized.hideCompletelyRules = {};
    if (
      config.hideCompletelyRules &&
      typeof config.hideCompletelyRules === "object"
    ) {
      const validKeys = [
        "minWords",
        "maxWords",
        "minChapters",
        "maxChapters",
        "blockComplete",
        "blockOngoing",
        "maxMonthsSinceUpdate",
        "maxCrossovers",
        "language",
        "tagBlacklist",
        "tagWhitelist",
        "authorBlacklist",
        "titleBlacklist",
        "summaryBlacklist",
        "workBlacklist",
        "primaryRelationships",
        "primaryCharacters",
      ];
      validKeys.forEach((key) => {
        if (typeof config.hideCompletelyRules[key] === "boolean") {
          sanitized.hideCompletelyRules[key] = config.hideCompletelyRules[key];
        }
      });
    }
    sanitized.conditionalTagBlacklist = Array.isArray(
      config.conditionalTagBlacklist,
    )
      ? config.conditionalTagBlacklist
          .filter(
            (item) =>
              item &&
              typeof item === "object" &&
              typeof item.block === "string" &&
              item.block.trim() &&
              ((typeof item.operator === "string" &&
                (item.operator === "unless" || item.operator === "with") &&
                typeof item.condition === "string" &&
                item.condition.trim()) ||
                (typeof item.unless === "string" && item.unless.trim())), // backward compatibility
          )
          .map((item) => {
            let block = item.block.trim();
            let operator, condition;

            // Convert old format to new format
            if (item.unless && !item.operator) {
              operator = "unless";
              condition = item.unless;
            } else {
              operator = item.operator;
              condition = item.condition;
            }

            // Fix corrupted block field that includes "unless:" or "with:"
            const blockMatch = block.match(/^(.+?)\s*(unless|with)\s*:\s*$/i);
            if (blockMatch) {
              block = blockMatch[1].trim();
            }

            return {
              block: block,
              operator: operator,
              condition: condition,
              display: item.display || `${block} ${operator}:{${condition}}`,
            };
          })
      : [];
    sanitized._version = "4.0.5";
    return sanitized;
  }

  // Load and set the global config
  window.ao3Blocker.config = sanitizeConfig(
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULTS,
  );

  const STYLE = `
  html body .ao3-blocker-hidden { display: none; }
  .ao3-blocker-cut {
    display: block;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.25s ease, opacity 0.25s ease;
  }
  .ao3-blocker-cut::after { clear: both; content: ''; display: block; }
  .ao3-blocker-reason { margin-left: 5px; }
  .ao3-blocker-hide-reasons .ao3-blocker-reason { display: none; }
  .ao3-blocker-unhide .ao3-blocker-cut {
    max-height: var(--ao3-blocker-cut-height, 2000px);
    opacity: 1;
    overflow: hidden;
  }
  .ao3-blocker-fold {
    align-items: center; display: flex; justify-content: space-between !important;
    gap: 10px !important; width: 100% !important;
  }
  .ao3-blocker-unhide .ao3-blocker-fold {
    border-bottom: 1px dashed; border-bottom-color: inherit;
    margin-bottom: 15px; padding-bottom: inherit;
  }
  button.ao3-blocker-toggle {
    margin-left: auto; min-width: inherit; min-height: inherit; display: flex;
    align-items: center; justify-content: center; gap: 0.2em; min-width: 80px !important;
    margin-left: 10px !important; flex-shrink: 0 !important; white-space: nowrap !important;
    padding: 4px 8px !important;
  }
  .ao3-blocker-note {
    flex: 1 !important; min-width: 0 !important; word-wrap: break-word !important;
    overflow-wrap: break-word !important; margin-left: 2.5em !important;
    position: relative !important; display: block !important;
  }
  .ao3-blocker-fold .ao3-blocker-note .ao3-blocker-icon {
    position: absolute !important; left: -2.0em !important; top: 50% !important; transform: translateY(-50%) !important; margin-right: 0 !important;
    display: block !important; float: none !important; vertical-align: top !important;
    width: 1.2em !important; height: 1.2em !important;
  }
  .ao3-blocker-toggle span {
    width: 1em !important; height: 1em !important; display: inline-block;
    vertical-align: -0.15em; margin-right: 0.2em; background-color: currentColor;
  }
  .ao3-blocker-eye-toggle {
    display: inline-block; width: 1.2em; height: 1.2em; margin-left: 0.3em; margin-right: 0.3em;
    vertical-align: -0.15em; color: inherit; opacity: 0.75; transition: opacity 0.2s ease;
    border: none; padding: 0; cursor: pointer; background: none;
  }
  .ao3-blocker-eye-toggle:hover { opacity: 1.0; }
  .ao3-blocker-eye-toggle:focus { outline: 2px solid currentColor; outline-offset: 2px; }
  .ao3-blocker-highlight { position: relative !important; }
  .ao3-blocker-highlight::before {
    content: '' !important; position: absolute !important; left: 0 !important;
    top: 0 !important; right: 0 !important; bottom: 0 !important;
    box-shadow: inset 4px 0 0 0 var(--ao3-blocker-highlight-color, #eb6f92) !important;
    pointer-events: none !important; border-radius: inherit !important;
  }
  .reading .ao3-blocker-highlight h4.viewed {
    border-left: 4px solid var(--ao3-blocker-highlight-color, #eb6f92) !important;
  }
  @keyframes ao3-blocker-slideInRight {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes ao3-blocker-slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
  `;

  function createEyeToggle(filterId, initialState) {
    const button = document.createElement("button");
    button.className = "ao3-blocker-eye-toggle";
    button.setAttribute("data-filter-id", filterId);
    button.setAttribute("aria-label", `Toggle hide completely for ${filterId}`);
    button.setAttribute("aria-pressed", initialState ? "true" : "false");
    button.setAttribute("title", "Hide works completely");
    button.innerHTML = `<span style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;background-color:currentColor;mask:url('${
      initialState ? ICON_HIDE : ICON_EYE
    }') no-repeat center/contain;-webkit-mask:url('${
      initialState ? ICON_HIDE : ICON_EYE
    }') no-repeat center/contain;"></span>`;
    button.addEventListener("click", () => {
      const currentPressed = button.getAttribute("aria-pressed") === "true";
      const newPressed = !currentPressed;
      button.setAttribute("aria-pressed", newPressed ? "true" : "false");
      const span = button.querySelector("span");
      span.style.mask = `url('${
        newPressed ? ICON_HIDE : ICON_EYE
      }') no-repeat center/contain`;
      span.style.webkitMask = `url('${
        newPressed ? ICON_HIDE : ICON_EYE
      }') no-repeat center/contain`;
    });
    return button;
  }

  function createInputWithEyeToggle(element, filterId, config) {
    const label = element.querySelector("label");
    if (label) {
      const eyeToggle = createEyeToggle(
        filterId,
        config.hideCompletelyRules[filterId] || false,
      );
      // Insert after label text but before tooltip
      const tooltip = label.querySelector(".ao3mh-tooltip");
      if (tooltip) {
        label.insertBefore(eyeToggle, tooltip);
      } else {
        label.appendChild(eyeToggle);
      }
    }
    return element;
  }

  const ICON_HIDE =
    "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2040%2040%22%3E%3Cg%20data-name%3D%22Eye%20Hidden%22%20id%3D%22Eye_Hidden%22%3E%3Cpath%20d%3D%22M21.67%2C25.2a1%2C1%2C0%2C0%2C0-.86-.28A4.28%2C4.28%2C0%2C0%2C1%2C20%2C25a5%2C5%2C0%2C0%2C1-5-5%2C4.28%2C4.28%2C0%2C0%2C1%2C.08-.81%2C1%2C1%2C0%2C0%2C0-.28-.86l-3.27-3.26a1%2C1%2C0%2C0%2C0-1.38%2C0%2C22.4%2C22.4%2C0%2C0%2C0-3.82%2C4.43%2C1%2C1%2C0%2C0%2C0%2C0%2C1.08C7.59%2C22.49%2C12.35%2C29%2C20%2C29A13.43%2C13.43%2C0%2C0%2C0%2C23%2C28.67%2C1%2C1%2C0%2C0%2C0%2C23.44%2C27Z%22%2F%3E%3Cpath%20d%3D%22M33.67%2C19.46C32.41%2C17.51%2C27.65%2C11%2C20%2C11a13.58%2C13.58%2C0%2C0%2C0-6.11%2C1.48l-1.18-1.19a1%2C1%2C0%2C0%2C0-1.42%2C1.42l16%2C16a1%2C1%2C0%2C0%2C0%2C1.42%2C0%2C1%2C1%2C0%2C0%2C0%2C0-1.42l-.82-.81a21.53%2C21.53%2C0%2C0%2C0%2C5.78-5.94A1%2C1%2C0%2C0%2C0%2C33.67%2C19.46Zm-9.5%2C3.29-6.92-6.92a5%2C5%2C0%2C0%2C1%2C4.03-.69%2C4.93%2C4.93%2C0%2C0%2C1%2C3.68%2C3.68A5%2C5%2C0%2C0%2C1%2C24.17%2C22.75Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";
  const ICON_EYE =
    "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2040%2040%22%3E%3Cg%20data-name%3D%22Eye%20Visible%22%20id%3D%22Eye_Visible%22%3E%3Cpath%20d%3D%22M33.67%2C19.46C32.42%2C17.51%2C27.66%2C11%2C20%2C11S7.58%2C17.51%2C6.33%2C19.46a1%2C1%2C0%2C0%2C0%2C0%2C1.08C7.58%2C22.49%2C12.34%2C29%2C20%2C29s12.42-6.51%2C13.67-8.46A1%2C1%2C0%2C0%2C0%2C33.67%2C19.46ZM20%2C25a5%2C5%2C0%2C1%2C1%2C5-5A5%2C5%2C0%2C0%2C1%2C20%2C25Z%22%2F%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

  function compilePattern(pattern) {
    const hasWildcard = pattern.includes("*");
    if (hasWildcard) {
      const parts = pattern.split("*").map((part) => {
        const normalized = normalizeText(part);
        return normalized.replace(/[.+^${}()|[\]\\]/g, "\\$&");
      });
      const regexPattern = parts.join(".*");
      const normalized = normalizeText(pattern.replace(/\*/g, ""));
      return {
        originalText: pattern,
        text: normalized,
        regex: new RegExp(regexPattern, "i"),
        exactRegex: new RegExp("^" + regexPattern + "$", "i"),
        hasWildcard: true,
      };
    }
    const normalized = normalizeText(pattern);
    return { originalText: pattern, text: normalized, hasWildcard: false };
  }

  function parseConditional(entry) {
    const trimmed = entry.trim();
    const withMatch = trimmed.match(/^(.+?)\s+with:\{(.+?)\}$/i);
    const unlessMatch = trimmed.match(/^(.+?)\s+unless:\{(.+?)\}$/i);
    if (withMatch) {
      return {
        item: normalizeText(withMatch[1].trim()),
        operator: "with",
        condition: normalizeText(withMatch[2].trim()),
      };
    } else if (unlessMatch) {
      return {
        item: normalizeText(unlessMatch[1].trim()),
        operator: "unless",
        condition: normalizeText(unlessMatch[2].trim()),
      };
    } else {
      return { item: normalizeText(trimmed) };
    }
  }

  function checkConditional(entry, allTags) {
    if (!entry.condition || !entry.operator) return true;
    // Check if any tag matches the condition pattern (supports wildcards)
    const hasCondition = allTags.some((tag) =>
      matchPattern(tag, entry.condition, true),
    );
    return (
      (entry.operator === "with" && hasCondition) ||
      (entry.operator === "unless" && !hasCondition)
    );
  }

  function loadConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { ...DEFAULTS };
      const parsedConfig = JSON.parse(stored);
      const needsSanitization =
        !parsedConfig._version || parsedConfig._version !== DEFAULTS._version;
      if (needsSanitization) {
        const sanitized = sanitizeConfig({ ...DEFAULTS, ...parsedConfig });
        saveConfig(sanitized);
        return sanitized;
      }
      return { ...DEFAULTS, ...parsedConfig };
    } catch (e) {
      console.error("[AO3 Advanced Blocker] Failed to load config:", e);
      return { ...DEFAULTS };
    }
  }

  function saveConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      return true;
    } catch (e) {
      console.error("[AO3 Advanced Blocker] Failed to save config:", e);
      return false;
    }
  }

  function isMyContentPage(username) {
    if (!username || !username.trim()) return false;
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const path = window.location.pathname;
    const myContentRegex = new RegExp(
      `^/users/${escapedUsername}(?:/pseuds/[^/]+)?(?:/(?:bookmarks|works|readings))?/?(?:$|[?#])`,
      "i",
    );
    if (myContentRegex.test(path)) return true;
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");
    if (userId && userId.toLowerCase() === username.toLowerCase()) return true;
    // Check for individual bookmark pages
    if (path.match(/^\/bookmarks\/\d+$/)) {
      const userLink = document.querySelector(`a[href="/users/${username}"]`);
      if (userLink) return true;
    }
    return false;
  }

  function parseChaptersStatus(chaptersText) {
    if (!chaptersText) return null;
    const cleaned = chaptersText.replace(/&nbsp;/gi, " ").trim();
    const match = cleaned.match(/^(\d+)\s*\/\s*([\d\?]+)/);
    if (match) {
      let chaptersDenom = match[2].trim();
      if (chaptersDenom === "?") return "ongoing";
      const current = parseInt(match[1].replace(/\D/g, ""), 10);
      const total = parseInt(chaptersDenom.replace(/\D/g, ""), 10);
      if (!isNaN(current) && !isNaN(total)) {
        if (current < total) return "ongoing";
        if (current === total) return "complete";
        return "ongoing";
      }
      return "ongoing";
    }
    return "ongoing";
  }

  function getCategorizedAndFlatTags(container) {
    const tags = {
      ratings: [],
      warnings: [],
      categories: [],
      fandoms: [],
      relationships: [],
      characters: [],
      freeforms: [],
    };

    const allTagElements = container.querySelectorAll(
      "li.rating a.tag, li.ratings a.tag, li.rating span.tag, li.ratings span.tag, span.rating, span.ratings, " +
        "li.warning a.tag, li.warnings a.tag, li.warning span.tag, li.warnings span.tag, " +
        "li.category a.tag, li.categories a.tag, li.category span.tag, li.categories span.tag, span.category, span.categories, " +
        "h5.fandoms.heading a.tag, li.fandom a.tag, li.fandoms a.tag, li.fandom span.tag, li.fandoms span.tag, " +
        "li.relationship a.tag, li.relationships a.tag, li.relationship span.tag, li.relationships span.tag, " +
        "li.character a.tag, li.characters a.tag, li.character span.tag, li.characters span.tag, " +
        "li.freeform a.tag, li.freeforms a.tag, li.freeform span.tag, li.freeforms span.tag",
    );

    // Helper to get category for an element
    function getCategory(el) {
      if (el.tagName === "SPAN") {
        if (el.classList.contains("rating") || el.classList.contains("ratings"))
          return "ratings";
        if (
          el.classList.contains("category") ||
          el.classList.contains("categories")
        )
          return "categories";
      }
      const li = el.closest("li");
      if (li) {
        if (li.classList.contains("rating") || li.classList.contains("ratings"))
          return "ratings";
        if (
          li.classList.contains("warning") ||
          li.classList.contains("warnings")
        )
          return "warnings";
        if (
          li.classList.contains("category") ||
          li.classList.contains("categories")
        )
          return "categories";
        if (li.classList.contains("fandom") || li.classList.contains("fandoms"))
          return "fandoms";
        if (
          li.classList.contains("relationship") ||
          li.classList.contains("relationships")
        )
          return "relationships";
        if (
          li.classList.contains("character") ||
          li.classList.contains("characters")
        )
          return "characters";
        if (
          li.classList.contains("freeform") ||
          li.classList.contains("freeforms")
        )
          return "freeforms";
      }
      const h5 = el.closest("h5");
      if (h5 && h5.classList.contains("fandoms")) return "fandoms";
      return null;
    }

    // Process all tag elements
    allTagElements.forEach((el) => {
      const text = getText(el);
      if (!text) return;
      const category = getCategory(el);
      if (!category) return;

      // Split comma-separated tags and add them
      text.split(", ").forEach((tag) => {
        const trimmed = tag.trim();
        if (trimmed && !tags[category].includes(trimmed)) {
          tags[category].push(trimmed);
        }
      });
    });

    // Infer "Multi" if multiple categories are present but not explicitly tagged
    if (tags.categories.length > 1 && !tags.categories.includes("Multi")) {
      tags.categories.push("Multi");
    }

    const flat = [
      ...tags.ratings,
      ...tags.warnings,
      ...tags.categories,
      ...tags.fandoms,
      ...tags.relationships,
      ...tags.characters,
      ...tags.freeforms,
    ];
    return { categorized: tags, flat: flat };
  }

  function normalizeText(text) {
    if (typeof text !== "string") return "";
    if (normalizationCache.has(text)) {
      return normalizationCache.get(text);
    }
    const normalized = text.toLowerCase();
    normalizationCache.set(text, normalized);
    return normalized;
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getMatchedSubstring(text, pattern) {
    let regex;
    if (typeof pattern === "string") {
      regex = new RegExp(escapeRegex(pattern), "i");
    } else {
      if (pattern.hasWildcard) {
        regex = pattern.regex;
      } else {
        regex = new RegExp(escapeRegex(pattern.text), "i");
      }
    }
    const match = text.match(regex);
    return match ? match[0] : null;
  }

  function showQuickAddNotification(message) {
    const existing = document.getElementById(
      "ao3-blocker-quickadd-notification",
    );
    if (existing) existing.remove();
    const testElement = document.createElement("input");
    testElement.type = "text";
    testElement.style.cssText =
      "position: absolute; visibility: hidden; pointer-events: none;";
    document.body.appendChild(testElement);
    const computedStyles = window.getComputedStyle(testElement);
    const pageBg = computedStyles.backgroundColor;
    const pageColor = computedStyles.color;
    const pageBorderRadius = computedStyles.borderRadius || "0.25em";
    testElement.remove();
    const notification = document.createElement("div");
    notification.id = "ao3-blocker-quickadd-notification";
    notification.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: ${pageBg}; color: ${pageColor}; padding: 12px 20px; border-radius: ${pageBorderRadius}; font-size: 0.95em; font-weight: 500; z-index: 10001; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-family: inherit; max-width: 350px; word-wrap: break-word; animation: ao3-blocker-slideInRight 0.3s ease-out; border: 1px solid currentColor; opacity: 0.95;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "ao3-blocker-slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  function clearProcessedFlags() {
    const processedWorks = document.querySelectorAll(
      `.${CSS_NAMESPACE}-processed`,
    );
    processedWorks.forEach((work) => {
      work.classList.remove(`${CSS_NAMESPACE}-processed`);
    });
    normalizationCache.clear();
  }

  function checkWorks() {
    const config = window.ao3Blocker.config;
    let blocked = 0;
    let total = 0;
    if (config.pauseBlocking) {
      return;
    }

    let isOnMyContent = false;

    const username = config.username;
    if (config.disableOnMyContent && username) {
      isOnMyContent = isMyContentPage(username);
      if (isOnMyContent && !config.enableHighlightingOnMyContent) return;
    }
    const blurbs = document.querySelectorAll("li.blurb");
    blurbs.forEach((blurbEl) => {
      const isWorkOrBookmark =
        (blurbEl.classList.contains("work") ||
          blurbEl.classList.contains("bookmark")) &&
        !blurbEl.classList.contains("picture");
      if (!isWorkOrBookmark) return;
      if (
        blurbEl.classList.contains(`${CSS_NAMESPACE}-hidden`) ||
        blurbEl.classList.contains(`${CSS_NAMESPACE}-work`) ||
        blurbEl.classList.contains(`${CSS_NAMESPACE}-processed`)
      )
        return;
      const blockables = selectFromBlurb(blurbEl);
      const allTags = blockables.tags;
      total++;
      let shouldHighlight = false;
      if (config.tagHighlights.length > 0) {
        shouldHighlight = allTags.some((tag) =>
          config.tagHighlights.some((highlight) =>
            matchPattern(tag, highlight, true),
          ),
        );
      }
      if (shouldHighlight) {
        blurbEl.classList.add("ao3-blocker-highlight");
      }
      let reason = null;
      if (!isOnMyContent) reason = getBlockReason(blockables, config, blurbEl);
      if (reason) {
        blockWork(blurbEl, reason, config);
        blocked++;
      } else {
        blurbEl.classList.add(`${CSS_NAMESPACE}-processed`);
      }
    });
  }

  function handleQuickAdd(event) {
    if (!quickAddKeyPressed) return;
    const target = event.target;
    const config = loadConfig();
    if (target.classList.contains("tag")) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (event.target.closest("a")) {
        event.target.closest("a").style.pointerEvents = "none";
        setTimeout(() => {
          if (event.target.closest("a"))
            event.target.closest("a").style.pointerEvents = "";
        }, 100);
      }
      const tagText = target.textContent.trim();

      // Check if Shift is also pressed for strict blacklist
      const useStrictBlacklist =
        config.enableStrictTagBlocking && event.shiftKey;
      const targetList = useStrictBlacklist
        ? "strictTagBlacklist"
        : "tagBlacklist";

      const currentTags = config[targetList]
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const normalizedTag = normalizeText(tagText);
      const alreadyExists = currentTags.some(
        (t) => normalizeText(t) === normalizedTag,
      );
      if (alreadyExists) {
        const listName = useStrictBlacklist
          ? "strict blacklist"
          : "tag blacklist";
        showQuickAddNotification(`"${tagText}" is already in ${listName}`);
        return;
      }
      const updatedTags =
        currentTags.length > 0 ? config[targetList] + ", " + tagText : tagText;
      config[targetList] = updatedTags;
      saveConfig(config);
      const rawField = useStrictBlacklist
        ? "_rawStrictTagBlacklist"
        : "_rawTagBlacklist";
      window.ao3Blocker.config[rawField] = updatedTags;
      window.ao3Blocker.config[targetList] = updatedTags
        .split(/,(?:\s)?/g)
        .map((i) => i.trim())
        .filter(Boolean)
        .map((i) => {
          if (useStrictBlacklist) {
            const parsed = parseConditional(i);
            if (parsed.operator) {
              return {
                type: "conditional",
                block: compilePattern(parsed.item),
                operator: parsed.operator,
                condition: compilePattern(parsed.condition),
              };
            } else {
              return { type: "simple", pattern: compilePattern(parsed.item) };
            }
          } else {
            return compilePattern(i);
          }
        });
      scheduleCheckWorks();

      const listName = useStrictBlacklist
        ? "strict tag blacklist"
        : "tag blacklist";
      showQuickAddNotification(`✓ Added "${tagText}" to ${listName}`);
      return;
    }
    if (target.getAttribute("rel") === "author") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (event.target.closest("a")) {
        event.target.closest("a").style.pointerEvents = "none";
        setTimeout(() => {
          if (event.target.closest("a"))
            event.target.closest("a").style.pointerEvents = "";
        }, 100);
      }
      const authorText = target.textContent.trim();
      if (authorText.toLowerCase() === "anonymous") {
        showQuickAddNotification(
          'Cannot blacklist "Anonymous" (would block all anonymous works)',
        );
        return;
      }
      const currentAuthors = config.authorBlacklist
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      const alreadyExists = currentAuthors.some(
        (a) => a.toLowerCase() === authorText.toLowerCase(),
      );
      if (alreadyExists) {
        showQuickAddNotification(`"${authorText}" is already blacklisted`);
        return;
      }
      const updatedAuthors =
        currentAuthors.length > 0
          ? config.authorBlacklist + ", " + authorText
          : authorText;
      config.authorBlacklist = updatedAuthors;
      saveConfig(config);
      window.ao3Blocker.config._rawAuthorBlacklist = updatedAuthors;
      window.ao3Blocker.config.authorBlacklist = updatedAuthors
        .toLowerCase()
        .split(/,(?:\s)?/g)
        .map((i) => i.trim())
        .filter(Boolean);
      scheduleCheckWorks();
      showQuickAddNotification(`✓ Added "${authorText}" to author blacklist`);
      return;
    }
    if (
      target.tagName === "A" &&
      target.href &&
      target.href.match(/\/works\/\d+/)
    ) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (event.target.closest("a")) {
        event.target.closest("a").style.pointerEvents = "none";
        setTimeout(() => {
          if (event.target.closest("a"))
            event.target.closest("a").style.pointerEvents = "";
        }, 100);
      }
      const workIdMatch = target.href.match(/\/works\/(\d+)/);
      if (!workIdMatch) return;
      const workId = workIdMatch[1];
      const currentWorks = config.workBlacklist
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);
      const alreadyExists = currentWorks.some((w) => w === workId);
      if (alreadyExists) {
        showQuickAddNotification(`"${workId}" is already blacklisted`);
        return;
      }
      const updatedWorks =
        currentWorks.length > 0 ? config.workBlacklist + ", " + workId : workId;
      config.workBlacklist = updatedWorks;
      saveConfig(config);
      window.ao3Blocker.config._rawWorkBlacklist = updatedWorks;
      window.ao3Blocker.config.workBlacklist = updatedWorks
        .toLowerCase()
        .split(/,(?:\s)?/g)
        .map((i) => i.trim())
        .filter(Boolean);
      scheduleCheckWorks();
      showQuickAddNotification(`✓ Added "${workId}" to work blacklist`);
      return;
    }
  }

  function initConfig() {
    const config = loadConfig();
    // Cache processed lists to avoid redundant computations
    const rawTagBlacklist = config.tagBlacklist;
    const rawTagWhitelist = config.tagWhitelist;
    const rawTagHighlights = config.tagHighlights;
    const rawTitleBlacklist = config.titleBlacklist;
    const rawSummaryBlacklist = config.summaryBlacklist;
    const rawAuthorBlacklist = config.authorBlacklist;
    const rawWorkBlacklist = config.workBlacklist;
    const rawAllowedLanguages = config.allowedLanguages;
    const rawPrimaryRelationships = config.primaryRelationships;
    const rawPrimaryCharacters = config.primaryCharacters;
    const rawStrictTagBlacklist = config.strictTagBlacklist;
    const rawMinWords = config.minWords;
    const rawMaxWords = config.maxWords;
    const rawMinChapters = config.minChapters;
    const rawMaxChapters = config.maxChapters;
    const rawMaxMonthsSinceUpdate = config.maxMonthsSinceUpdate;
    const rawMaxCrossovers = config.maxCrossovers;
    const rawPrimaryRelpad = config.primaryRelpad;
    const rawPrimaryCharpad = config.primaryCharpad;
    const rawConditionalTagBlacklist = JSON.stringify(
      config.conditionalTagBlacklist || [],
    );

    // Check if cache is valid
    const cacheValid =
      window.ao3Blocker.config &&
      window.ao3Blocker.config.quickAddKey === config.quickAddKey &&
      window.ao3Blocker.config._rawTagBlacklist === rawTagBlacklist &&
      window.ao3Blocker.config._rawTagWhitelist === rawTagWhitelist &&
      window.ao3Blocker.config._rawTagHighlights === rawTagHighlights &&
      window.ao3Blocker.config._rawTitleBlacklist === rawTitleBlacklist &&
      window.ao3Blocker.config._rawSummaryBlacklist === rawSummaryBlacklist &&
      window.ao3Blocker.config._rawAuthorBlacklist === rawAuthorBlacklist &&
      window.ao3Blocker.config._rawWorkBlacklist === rawWorkBlacklist &&
      window.ao3Blocker.config._rawAllowedLanguages === rawAllowedLanguages &&
      window.ao3Blocker.config._rawPrimaryRelationships ===
        rawPrimaryRelationships &&
      window.ao3Blocker.config._rawPrimaryCharacters === rawPrimaryCharacters &&
      window.ao3Blocker.config._rawStrictTagBlacklist ===
        rawStrictTagBlacklist &&
      window.ao3Blocker.config._rawMinWords === rawMinWords &&
      window.ao3Blocker.config._rawMaxWords === rawMaxWords &&
      window.ao3Blocker.config._rawMinChapters === rawMinChapters &&
      window.ao3Blocker.config._rawMaxChapters === rawMaxChapters &&
      window.ao3Blocker.config._rawMaxMonthsSinceUpdate ===
        rawMaxMonthsSinceUpdate &&
      window.ao3Blocker.config._rawMaxCrossovers === rawMaxCrossovers &&
      window.ao3Blocker.config._rawPrimaryRelpad === rawPrimaryRelpad &&
      window.ao3Blocker.config._rawPrimaryCharpad === rawPrimaryCharpad &&
      window.ao3Blocker.config._rawConditionalTagBlacklist ===
        rawConditionalTagBlacklist;

    if (!cacheValid) {
      window.ao3Blocker.config = {
        showReasons: config.showReasons,
        showPlaceholders: config.showPlaceholders ?? true,
        quickAddKey: config.quickAddKey,
        authorBlacklist: new Set(
          rawAuthorBlacklist
            .toLowerCase()
            .split(/,(?:\s)?/g)
            .map((i) => i.trim())
            .filter(Boolean),
        ),
        titleBlacklist: rawTitleBlacklist
          .split(/,(?:\s)?/g)
          .map((i) => i.trim())
          .filter(Boolean)
          .map(compilePattern),
        tagBlacklist: rawTagBlacklist
          .split(/,(?:\s)?/g)
          .map((i) => i.trim())
          .filter(Boolean)
          .map(compilePattern),
        conditionalTagBlacklist: (config.conditionalTagBlacklist || []).map(
          (rule) => ({
            block: compilePattern(rule.block),
            operator: rule.operator,
            condition: compilePattern(rule.condition),
            display: rule.display,
          }),
        ),
        strictTagBlacklist: rawStrictTagBlacklist
          .split(/,(?:\s)?/g)
          .map((i) => i.trim())
          .filter(Boolean)
          .map((i) => {
            const parsed = parseConditional(i);
            if (parsed.operator) {
              return {
                type: "conditional",
                block: compilePattern(parsed.item),
                operator: parsed.operator,
                condition: compilePattern(parsed.condition),
              };
            } else {
              return { type: "simple", pattern: compilePattern(parsed.item) };
            }
          }),
        enableStrictTagBlocking: !!config.enableStrictTagBlocking,
        tagWhitelist: rawTagWhitelist
          .split(/,(?:\s)?/g)
          .map((i) => i.trim())
          .filter(Boolean)
          .map((i) => {
            const parsed = parseConditional(i);
            if (parsed.operator) {
              return {
                type: "conditional",
                block: compilePattern(parsed.item),
                operator: parsed.operator,
                condition: compilePattern(parsed.condition),
              };
            } else {
              return { type: "simple", pattern: compilePattern(parsed.item) };
            }
          }),
        tagHighlights: rawTagHighlights
          .split(/,(?:\s)?/g)
          .map((i) => i.trim())
          .filter(Boolean)
          .map(compilePattern),
        summaryBlacklist: rawSummaryBlacklist
          .split(/,(?:\s)?/g)
          .map((i) => i.trim())
          .filter(Boolean)
          .map(compilePattern),
        workBlacklist: new Set(
          rawWorkBlacklist
            .toLowerCase()
            .split(/,(?:\s)?/g)
            .map((i) => i.trim())
            .filter(Boolean),
        ),
        highlightColor: config.highlightColor,
        allowedLanguages: rawAllowedLanguages
          .toLowerCase()
          .split(/,(?:\s)?/g)
          .map((s) => s.trim())
          .filter(Boolean),
        maxCrossovers: (() => {
          const val = config.maxCrossovers;
          const parsed = parseInt(val, 10);
          return val === undefined ||
            val === null ||
            val === "" ||
            isNaN(parsed)
            ? null
            : parsed;
        })(),
        minWords: (() => {
          const v = config.minWords;
          const n = parseInt((v || "").toString().replace(/[,_\s]/g, ""), 10);
          return Number.isFinite(n) ? n : null;
        })(),
        maxWords: (() => {
          const v = config.maxWords;
          const n = parseInt((v || "").toString().replace(/[,_\s]/g, ""), 10);
          return Number.isFinite(n) ? n : null;
        })(),
        minChapters: (() => {
          const v = config.minChapters;
          const n = parseInt((v || "").toString().replace(/[,_\s]/g, ""), 10);
          return Number.isFinite(n) && n > 0 ? n : null;
        })(),
        maxChapters: (() => {
          const v = config.maxChapters;
          const n = parseInt((v || "").toString().replace(/[,_\s]/g, ""), 10);
          return Number.isFinite(n) && n > 0 ? n : null;
        })(),
        maxMonthsSinceUpdate: (() => {
          const v = config.maxMonthsSinceUpdate;
          const n = parseInt((v || "").toString().replace(/[,_\s]/g, ""), 10);
          return Number.isFinite(n) && n > 0 ? n : null;
        })(),
        blockComplete: config.blockComplete,
        blockOngoing: config.blockOngoing,
        primaryRelationships: rawPrimaryRelationships
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const parsed = parseConditional(s);
            return parsed.operator ? parsed : { relationship: parsed.item };
          }),
        primaryCharacters: rawPrimaryCharacters
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const parsed = parseConditional(s);
            return parsed.operator ? parsed : { character: parsed.item };
          }),
        primaryRelpad: (() => {
          const val = config.primaryRelpad;
          const parsed = parseInt(val, 10);
          return val === undefined ||
            val === null ||
            val === "" ||
            isNaN(parsed)
            ? 1
            : Math.max(1, parsed);
        })(),
        primaryCharpad: (() => {
          const val = config.primaryCharpad;
          const parsed = parseInt(val, 10);
          return val === undefined ||
            val === null ||
            val === "" ||
            isNaN(parsed)
            ? 5
            : Math.max(1, parsed);
        })(),
        disableOnMyContent: !!config.disableOnMyContent,
        enableHighlightingOnMyContent: !!config.enableHighlightingOnMyContent,
        pauseBlocking: !!config.pauseBlocking,
        hideCompletelyRules: config.hideCompletelyRules || {},
        username: config.username || null,
        // Store raw strings for cache validation
        _rawTagBlacklist: rawTagBlacklist,
        _rawTagWhitelist: rawTagWhitelist,
        _rawTagHighlights: rawTagHighlights,
        _rawTitleBlacklist: rawTitleBlacklist,
        _rawSummaryBlacklist: rawSummaryBlacklist,
        _rawAuthorBlacklist: rawAuthorBlacklist,
        _rawWorkBlacklist: rawWorkBlacklist,
        _rawAllowedLanguages: rawAllowedLanguages,
        _rawPrimaryRelationships: rawPrimaryRelationships,
        _rawPrimaryCharacters: rawPrimaryCharacters,
        _rawStrictTagBlacklist: rawStrictTagBlacklist,
        _rawMinWords: rawMinWords,
        _rawMaxWords: rawMaxWords,
        _rawMinChapters: rawMinChapters,
        _rawMaxChapters: rawMaxChapters,
        _rawMaxMonthsSinceUpdate: rawMaxMonthsSinceUpdate,
        _rawMaxCrossovers: rawMaxCrossovers,
        _rawPrimaryRelpad: rawPrimaryRelpad,
        _rawPrimaryCharpad: rawPrimaryCharpad,
        _rawConditionalTagBlacklist: rawConditionalTagBlacklist,
      };
    }
    addStyle();
    document.documentElement.style.setProperty(
      "--ao3-blocker-highlight-color",
      window.ao3Blocker.config.highlightColor || "#eb6f92",
    );
    checkWorks();
    document.addEventListener("click", handleQuickAdd, true);

    const quickAddKey = config.quickAddKey || "Alt";
    document.addEventListener("keydown", (e) => {
      if (e.key === quickAddKey) {
        e.preventDefault();
        quickAddKeyPressed = true;
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === quickAddKey) quickAddKeyPressed = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConfig);
  } else {
    initConfig();
  }

  function initSharedMenu() {
    let menuContainer = document.getElementById("scriptconfig");

    if (!menuContainer) {
      const headerMenu = document.querySelector(
        "ul.primary.navigation.actions",
      );
      const searchItem = headerMenu?.querySelector("li.search");
      if (!headerMenu || !searchItem) return;

      menuContainer = document.createElement("li");
      menuContainer.className = "dropdown";
      menuContainer.id = "scriptconfig";
      menuContainer.innerHTML = `
        <a class="dropdown-toggle" href="/" data-toggle="dropdown" data-target="#">Userscripts</a>
        <ul class="menu dropdown-menu"></ul>
      `;
      headerMenu.insertBefore(menuContainer, searchItem);
    }

    const menu = menuContainer.querySelector(".dropdown-menu");
    if (menu) {
      const config = window.ao3Blocker.config;
      const username = config.username || detectUsername(config);
      const isOnMyContent =
        config.disableOnMyContent && username && isMyContentPage(username);

      if (!menu.querySelector("#opencfg_advanced_blocker")) {
        const settingsItem = document.createElement("li");
        settingsItem.innerHTML =
          '<a href="javascript:void(0);" id="opencfg_advanced_blocker">Advanced Blocker</a>';
        settingsItem
          .querySelector("a")
          .addEventListener("click", showBlockerMenu);
        menu.appendChild(settingsItem);
      }

      if (!isOnMyContent && !menu.querySelector("#toggle-blocker-pause")) {
        const pauseItem = document.createElement("li");
        const pauseLink = document.createElement("a");
        pauseLink.href = "javascript:void(0);";
        pauseLink.id = "toggle-blocker-pause";
        if (config.pauseBlocking) {
          pauseLink.innerHTML = `Advanced Blocker: Resume ▶`;
        } else {
          pauseLink.innerHTML = `Advanced Blocker: Pause ⏸`;
        }
        pauseLink.addEventListener("click", function () {
          const currentConfig = loadConfig();
          currentConfig.pauseBlocking = !currentConfig.pauseBlocking;
          saveConfig(currentConfig);
          location.reload();
        });
        pauseItem.appendChild(pauseLink);
        menu.appendChild(pauseItem);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSharedMenu);
  } else {
    initSharedMenu();
  }

  function addStyle() {
    const style = document.createElement("style");
    style.className = CSS_NAMESPACE;
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function showBlockerMenu() {
    if (!window.AO3MenuHelpers) {
      alert(
        "AO3 Menu Helpers Library is required for this script to function properly.",
      );
      return;
    }
    window.AO3MenuHelpers.removeAllDialogs();
    const config = window.ao3Blocker.config;
    const dialog = window.AO3MenuHelpers.createDialog(
      "🛡️ Advanced Blocker 🛡️",
      { maxWidth: "800px" },
    );

    const tagSection = window.AO3MenuHelpers.createSection("📖 Tag Filtering");

    const tagBlacklistContainer = document.createElement("div");
    tagBlacklistContainer.id = "tag-blacklist-container";

    let persistentStrictBlacklistValue = config._rawStrictTagBlacklist || "";

    function renderTagBlacklistUI(strictEnabled) {
      tagBlacklistContainer.innerHTML = "";

      if (strictEnabled) {
        const regularBlacklist = createInputWithEyeToggle(
          window.AO3MenuHelpers.createTextarea({
            id: "tag-blacklist-input",
            label: "Blacklist Tags",
            value: (() => {
              const regularTags = (config._rawTagBlacklist || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const conditionalDisplays = (config.conditionalTagBlacklist || [])
                .map((c) => c.display)
                .filter(Boolean);
              return [...regularTags, ...conditionalDisplays].join(", ");
            })(),
            placeholder: "Explicit, Major Character Death, F/M unless:{Multi}",
            tooltip:
              "Show a placeholder for blocked works. Use eye toggle to hide completely. * for wildcards. Conditionals supported.",
          }),
          "tagBlacklist",
          config,
        );

        const strictBlacklist = window.AO3MenuHelpers.createTextarea({
          id: "strict-tag-blacklist-input",
          label: "Strict Blacklist Tags",
          value: persistentStrictBlacklistValue,
          placeholder: "Dead Dove: Do Not Eat, Unhappy Ending, Abandoned*",
          tooltip:
            "Hide works completely with no placeholder. Use for hard deal-breakers you never want to see. * for wildcards. Conditionals supported.",
        });

        const strictInput = strictBlacklist.querySelector(
          "#strict-tag-blacklist-input",
        );
        if (strictInput) {
          strictInput.addEventListener("input", (e) => {
            persistentStrictBlacklistValue = e.target.value;
          });
        }

        const twoColumnLayout = window.AO3MenuHelpers.createTwoColumnLayout(
          regularBlacklist,
          strictBlacklist,
        );
        tagBlacklistContainer.appendChild(twoColumnLayout);
      } else {
        const tagBlacklist = createInputWithEyeToggle(
          window.AO3MenuHelpers.createTextarea({
            id: "tag-blacklist-input",
            label: "Blacklist Tags",
            value: (() => {
              const regularTags = (config._rawTagBlacklist || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
              const conditionalDisplays = (config.conditionalTagBlacklist || [])
                .map((c) => c.display)
                .filter(Boolean);
              return [...regularTags, ...conditionalDisplays].join(", ");
            })(),
            placeholder:
              "Explicit, Major Character Death, Abandoned*, Dead Dove: Do Not Eat, F/M unless:{Multi}",
            description:
              "Matches any AO3 tag: ratings, warnings, fandoms, ships, characters, freeforms. * for wildcards. Conditionals supported.",
          }),
          "tagBlacklist",
          config,
        );
        tagBlacklistContainer.appendChild(tagBlacklist);
      }
    }

    renderTagBlacklistUI(config.enableStrictTagBlocking);
    tagSection.appendChild(tagBlacklistContainer);
    const tagWhitelist = window.AO3MenuHelpers.createTextarea({
      id: "tag-whitelist-input",
      label: "Whitelist Tags",
      value: config._rawTagWhitelist,
      placeholder:
        "*Happy Ending*, Fluff, Slow Burn* unless:{Enemies to Lovers}",
      description:
        "Always shows the work even if it matches the blacklist. * for wildcards. Conditionals supported.",
    });
    tagSection.appendChild(tagWhitelist);
    const tagHighlightsInput = window.AO3MenuHelpers.createTextarea({
      id: "tag-highlights-input",
      label: "Highlight Tags",
      value: config._rawTagHighlights,
      placeholder: "*Fix-It*, Enemies to Lovers",
      tooltip: "Make these works stand out. * for wildcards.",
    });
    const highlightColorInput = window.AO3MenuHelpers.createTextInput({
      id: "highlight-color-input",
      label: "Highlight Color",
      value: config.highlightColor || "#eb6f92",
      placeholder: "#hex or rgb(r,g,b)",
    });
    const highlightRow = window.AO3MenuHelpers.createTwoColumnLayout(
      tagHighlightsInput,
      highlightColorInput,
    );
    tagSection.appendChild(highlightRow);
    dialog.appendChild(tagSection);

    const pairingSection = window.AO3MenuHelpers.createSection(
      "💕 Primary Pairing Filtering",
    );
    const primaryRel = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextarea({
        id: "primary-relationships-input",
        label: "Primary Relationships",
        value: config._rawPrimaryRelationships,
        placeholder:
          "Kim Dokja/Yoo Joonghyuk with:{전지적 독자 시점 - 싱숑 | Omniscient Reader - Sing-Shong}",
        tooltip:
          "Only show works where at least one ofthese relationships are in the first few relationship tags. Use 'with:{Fandom}' to specify fandom.",
      }),
      "primaryRelationships",
      config,
    );
    pairingSection.appendChild(primaryRel);
    const primaryChar = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextarea({
        id: "primary-characters-input",
        label: "Primary Characters",
        value: config._rawPrimaryCharacters,
        placeholder:
          "Kim Dokja with:{전지적 독자 시점 - 싱숑 | Omniscient Reader - Sing-Shong}",
        tooltip:
          "Only show works where at least one of these characters are in the first few character tags.Use 'with:{Fandom}' to specify fandom.",
      }),
      "primaryCharacters",
      config,
    );
    pairingSection.appendChild(primaryChar);
    const relPad = window.AO3MenuHelpers.createNumberInput({
      id: "primary-relpad-input",
      label: "Relationship Tag Window",
      value: config._rawPrimaryRelpad || 1,
      min: 1,
      max: 10,
      tooltip: "Check only the first X relationship tags.",
    });
    const charPad = window.AO3MenuHelpers.createNumberInput({
      id: "primary-charpad-input",
      label: "Character Tag Window",
      value: config._rawPrimaryCharpad || 5,
      min: 1,
      max: 10,
      tooltip: "Check only the first X character tags.",
    });
    const pairingRow = window.AO3MenuHelpers.createTwoColumnLayout(
      relPad,
      charPad,
    );
    pairingSection.appendChild(pairingRow);
    dialog.appendChild(pairingSection);

    const workSection =
      window.AO3MenuHelpers.createSection("🔍 Work Filtering");
    const languages = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextInput({
        id: "allowed-languages-input",
        label: "Allowed Languages",
        value: config._rawAllowedLanguages || "",
        placeholder: "English, Русский, 中文-普通话国语",
        tooltip: "Only show these languages. Leave empty for all.",
      }),
      "language",
      config,
    );
    workSection.appendChild(languages);
    const maxFandoms = createInputWithEyeToggle(
      window.AO3MenuHelpers.createNumberInput({
        id: "max-crossovers-input",
        label: "Max Fandoms",
        value: config._rawMaxCrossovers || "",
        min: 1,
        tooltip: "Hide works with more than this many fandoms.",
      }),
      "maxCrossovers",
      config,
    );
    const maxMonths = createInputWithEyeToggle(
      window.AO3MenuHelpers.createNumberInput({
        id: "max-months-since-update-input",
        label: "Max Months Since Update",
        value: config._rawMaxMonthsSinceUpdate || "",
        min: 1,
        placeholder: "6",
        tooltip:
          "Hide ongoing works not updated in X months. Only applies to ongoing works.",
      }),
      "maxMonthsSinceUpdate",
      config,
    );
    const row1 = window.AO3MenuHelpers.createTwoColumnLayout(
      maxFandoms,
      maxMonths,
    );
    workSection.appendChild(row1);
    const minWords = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextInput({
        id: "min-words-input",
        label: "Min Words",
        value: config._rawMinWords || "",
        placeholder: "1000",
        tooltip: "Hide works under this many words.",
      }),
      "minWords",
      config,
    );
    const maxWords = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextInput({
        id: "max-words-input",
        label: "Max Words",
        value: config._rawMaxWords || "",
        placeholder: "100000",
        tooltip: "Hide works over this many words.",
      }),
      "maxWords",
      config,
    );
    const row2 = window.AO3MenuHelpers.createTwoColumnLayout(
      minWords,
      maxWords,
    );
    workSection.appendChild(row2);
    const minChapters = createInputWithEyeToggle(
      window.AO3MenuHelpers.createNumberInput({
        id: "min-chapters-input",
        label: "Min Chapters",
        value: config._rawMinChapters || "",
        min: 1,
        placeholder: "2",
        tooltip: "Hide works with fewer chapters. Set to 2 to skip oneshots.",
      }),
      "minChapters",
      config,
    );
    const maxChapters = createInputWithEyeToggle(
      window.AO3MenuHelpers.createNumberInput({
        id: "max-chapters-input",
        label: "Max Chapters",
        value: config._rawMaxChapters || "",
        min: 1,
        placeholder: "200",
        tooltip:
          "Hide works with more chapters. Useful for avoiding epic-length works or drabble collections.",
      }),
      "maxChapters",
      config,
    );
    const row3 = window.AO3MenuHelpers.createTwoColumnLayout(
      minChapters,
      maxChapters,
    );
    workSection.appendChild(row3);
    const blockOngoing = window.AO3MenuHelpers.createCheckbox({
      id: "block-ongoing-checkbox",
      label: "Block Ongoing Works",
      checked: config.blockOngoing,
      tooltip: "Hide works that are ongoing.",
      inGroup: false,
    });
    const blockComplete = window.AO3MenuHelpers.createCheckbox({
      id: "block-complete-checkbox",
      label: "Block Complete Works",
      checked: config.blockComplete,
      tooltip: "Hide works that are marked as complete.",
      inGroup: false,
    });
    const blockOngoingGroup = createInputWithEyeToggle(
      window.AO3MenuHelpers.createSettingGroup(blockOngoing),
      "blockOngoing",
      config,
    );
    const blockCompleteGroup = createInputWithEyeToggle(
      window.AO3MenuHelpers.createSettingGroup(blockComplete),
      "blockComplete",
      config,
    );
    const row4 = window.AO3MenuHelpers.createTwoColumnLayout(
      blockOngoingGroup,
      blockCompleteGroup,
    );
    workSection.appendChild(row4);
    dialog.appendChild(workSection);

    const authorSection = window.AO3MenuHelpers.createSection(
      "✏️ Author & Content Filtering",
    );
    const titleBlacklist = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextarea({
        id: "title-blacklist-input",
        label: "Blacklist Titles",
        value: config._rawTitleBlacklist,
        placeholder: "oneshot, prompt, 2025",
        tooltip: "Blocks if the title contains your text.",
      }),
      "titleBlacklist",
      config,
    );
    const authorBlacklist = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextarea({
        id: "author-blacklist-input",
        label: "Blacklist Authors",
        value: config._rawAuthorBlacklist,
        placeholder: "DetectiveMittens, BlackBatCat",
        tooltip: "Match the author name exactly.",
      }),
      "authorBlacklist",
      config,
    );
    const summaryBlacklist = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextarea({
        id: "summary-blacklist-input",
        label: "Blacklist Summary",
        value: config._rawSummaryBlacklist,
        placeholder: "oneshot, prompt, 2025",
        tooltip: "Blocks if the summary has these words/phrases.",
      }),
      "summaryBlacklist",
      config,
    );
    const workBlacklist = createInputWithEyeToggle(
      window.AO3MenuHelpers.createTextarea({
        id: "work-blacklist-input",
        label: "Blacklist Works",
        value: config._rawWorkBlacklist,
        placeholder: "73294031, 12345678",
        tooltip: `To get the work ID, \`${
          config.quickAddKey || "Alt"
        } + Click\` the title of the work or copy the 8-digit number from the work URL.`,
      }),
      "workBlacklist",
      config,
    );
    const authorRow1 = window.AO3MenuHelpers.createTwoColumnLayout(
      titleBlacklist,
      authorBlacklist,
    );
    authorSection.appendChild(authorRow1);
    const authorRow2 = window.AO3MenuHelpers.createTwoColumnLayout(
      summaryBlacklist,
      workBlacklist,
    );
    authorSection.appendChild(authorRow2);
    dialog.appendChild(authorSection);

    const displaySection =
      window.AO3MenuHelpers.createSection("⚙️ Display Options");
    const showReasonsCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "show-reasons-checkbox",
      label: "Show Block Reason",
      checked: config.showReasons,
      tooltip:
        "Show detailed reasons in placeholders, or just show 'Hidden by filters'.",
      inGroup: false,
    });
    const showPlaceholdersCheckbox =
      window.AO3MenuHelpers.createConditionalCheckbox({
        id: "show-placeholders-checkbox",
        label: "Show Placeholders",
        checked: config.showPlaceholders,
        tooltip:
          "When ON: show placeholders for blocked works (use eye icons below to hide specific filters completely). When OFF: hide ALL blocked works completely.",
        subsettings: showReasonsCheckbox,
      });
    const enableHighlighting = window.AO3MenuHelpers.createCheckbox({
      id: "enable-highlighting-on-my-content-checkbox",
      label: "Enable Highlighting",
      checked: config.enableHighlightingOnMyContent,
      tooltip: "Re-enable tag highlighting on your own pages.",
      inGroup: false,
    });
    const disableOnMyContent = window.AO3MenuHelpers.createConditionalCheckbox({
      id: "disable-on-my-content-checkbox",
      label: "Disable on My Content",
      checked: config.disableOnMyContent,
      tooltip:
        "Don't block or highlight works on your dashboard, bookmarks, history, and works pages. Automatically includes all your pseuds.",
      subsettings: enableHighlighting,
    });
    const displayRow1 = window.AO3MenuHelpers.createTwoColumnLayout(
      showPlaceholdersCheckbox,
      disableOnMyContent,
    );
    displaySection.appendChild(displayRow1);

    const quickAddKeyInput = window.AO3MenuHelpers.createTextInput({
      id: "quick-add-key-input",
      label: "Quick-Add Key",
      value: config.quickAddKey || "Alt",
      placeholder: "Alt",
      tooltip:
        "Keyboard key to press while clicking to quickly add tags/authors/works to blacklist. Common options: Alt, Ctrl, F1, F2, etc.",
    });

    const strictTagBlockingCheckbox = window.AO3MenuHelpers.createCheckbox({
      id: "enable-strict-tag-blocking-checkbox",
      label: "Enable Strict Tag Blocking",
      checked: config.enableStrictTagBlocking,
      tooltip: `Split tag blacklist into two lists: 'Blacklist Tags' (shows placeholder) and 'Strict Blacklist Tags' (hides completely). Useful for separating mild dislikes from absolute deal-breakers. Quick-add: ${
        config.quickAddKey || "Alt"
      } + Click adds to Blacklist Tags, Shift + ${
        config.quickAddKey || "Alt"
      } + Click adds to Strict Blacklist Tags.`,
      inGroup: false,
    });

    const strictTagBlockingGroup = window.AO3MenuHelpers.createSettingGroup(
      strictTagBlockingCheckbox,
    );

    const displayRow2 = window.AO3MenuHelpers.createTwoColumnLayout(
      quickAddKeyInput,
      strictTagBlockingGroup,
    );
    displaySection.appendChild(displayRow2);

    dialog.appendChild(displaySection);

    const eyeToggleTipContent = document.createElement("span");
    eyeToggleTipContent.innerHTML =
      "<strong>Hide Works:</strong> Click the eye icon next to any filter above to hide matching works completely. ";
    const eyeToggleTipSpan = document.createElement("span");
    eyeToggleTipSpan.style.opacity = "0.8";
    eyeToggleTipSpan.textContent =
      'Works hidden this way won\'t show placeholders even when "Show Placeholders" is enabled.';
    eyeToggleTipContent.appendChild(eyeToggleTipSpan);
    const eyeToggleTipBox = window.AO3MenuHelpers.createInfoBox(
      eyeToggleTipContent,
      { icon: "👁️" },
    );
    eyeToggleTipBox.id = "eye-toggle-info";
    dialog.appendChild(eyeToggleTipBox);

    const tipContent = document.createElement("span");
    tipContent.innerHTML = "<strong> Quick-Add:</strong> Press ";
    tipContent.appendChild(
      window.AO3MenuHelpers.createKeyboardKey(config.quickAddKey || "Alt"),
    );
    tipContent.appendChild(
      document.createTextNode(
        " and click any tag, author name, or work title to instantly add them to your blacklist.",
      ),
    );
    if (config.enableStrictTagBlocking) {
      tipContent.appendChild(document.createTextNode(" Hold Shift + "));
      tipContent.appendChild(
        window.AO3MenuHelpers.createKeyboardKey(config.quickAddKey || "Alt"),
      );
      tipContent.appendChild(
        document.createTextNode(
          " to add to strict blacklist (hides completely).",
        ),
      );
    }
    const tipBox = window.AO3MenuHelpers.createInfoBox(tipContent, {
      icon: "➕",
    });
    dialog.appendChild(tipBox);

    const buttons = window.AO3MenuHelpers.createButtonGroup([
      { text: "Save", id: "blocker-save" },
      { text: "Cancel", id: "blocker-cancel" },
    ]);
    dialog.appendChild(buttons);

    const resetLink = window.AO3MenuHelpers.createResetLink(
      "Reset to Default Settings",
      () => {
        if (
          confirm("Are you sure you want to reset all settings to default?")
        ) {
          const config = loadConfig();
          const username = config.username || null;
          const newDefaults = { ...DEFAULTS, username };
          if (saveConfig(newDefaults)) {
            alert("Settings reset! Reloading...");
            location.reload();
          }
        }
      },
    );
    dialog.appendChild(resetLink);

    const exportBtn = document.createElement("button");
    exportBtn.id = "ao3-export";
    exportBtn.textContent = "Export Settings";
    exportBtn.style.marginRight = "8px";
    const fileInput = window.AO3MenuHelpers.createFileInput({
      id: "ao3-import",
      buttonText: "Import Settings",
      accept: "application/json",
      onChange: (file) => {
        const reader = new FileReader();
        reader.onload = function (evt) {
          try {
            const importedConfig = JSON.parse(evt.target.result);
            if (typeof importedConfig !== "object" || !importedConfig)
              throw new Error("Invalid JSON");
            const validConfig = { ...DEFAULTS };
            Object.keys(validConfig).forEach((key) => {
              if (importedConfig.hasOwnProperty(key))
                validConfig[key] = importedConfig[key];
            });
            if (saveConfig(validConfig)) {
              alert("Settings imported! Reloading...");
              location.reload();
            } else {
              throw new Error("Failed to save imported settings");
            }
          } catch (err) {
            alert("Import failed: " + (err && err.message ? err.message : err));
          }
        };
        reader.readAsText(file);
      },
    });
    const importExportContainer = document.createElement("div");
    importExportContainer.className = "reset-link";
    importExportContainer.style.marginTop = "18px";
    importExportContainer.appendChild(exportBtn);
    importExportContainer.appendChild(fileInput.button);
    importExportContainer.appendChild(fileInput.input);
    dialog.appendChild(importExportContainer);

    exportBtn.addEventListener("click", function () {
      try {
        const config = loadConfig();
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const yyyy = now.getFullYear();
        const mm = pad(now.getMonth() + 1);
        const dd = pad(now.getDate());
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const filename = `ao3_advanced_blocker_config_${dateStr}.json`;
        const blob = new Blob([JSON.stringify(config, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      } catch (e) {
        alert("Export failed: " + (e && e.message ? e.message : e));
      }
    });

    dialog.querySelector("#blocker-save").addEventListener("click", () => {
      // Parse tag blacklist input to separate regular and conditional entries
      const rawInput =
        window.AO3MenuHelpers.getValue("tag-blacklist-input") || "";
      const rawList = rawInput
        .split(/,(?:\s)?/g)
        .map((i) => i.trim())
        .filter(Boolean);
      const regular = [];
      const conditionals = [];
      rawList.forEach((entry) => {
        // Check for conditional syntax: "Tag unless:{OtherTag}" or "Tag with:{OtherTag}"
        const conditionalMatch = entry.match(
          /^(.+?)\s*(unless|with)\s*:\s*\{(.+)\}$/i,
        );

        if (conditionalMatch) {
          const block = conditionalMatch[1].trim();
          const operator = conditionalMatch[2].toLowerCase();
          const condition = conditionalMatch[3].trim();

          if (block && condition) {
            conditionals.push({
              block: block,
              operator: operator,
              condition: condition,
              display: entry.trim(),
            });
          } else {
            regular.push(entry);
          }
        } else {
          regular.push(entry);
        }
      });

      const updatedConfig = {
        tagBlacklist: regular.join(", "),
        conditionalTagBlacklist: conditionals,
        tagWhitelist:
          window.AO3MenuHelpers.getValue("tag-whitelist-input") || "",
        tagHighlights:
          window.AO3MenuHelpers.getValue("tag-highlights-input") || "",
        authorBlacklist:
          window.AO3MenuHelpers.getValue("author-blacklist-input") || "",
        titleBlacklist:
          window.AO3MenuHelpers.getValue("title-blacklist-input") || "",
        summaryBlacklist:
          window.AO3MenuHelpers.getValue("summary-blacklist-input") || "",
        workBlacklist:
          window.AO3MenuHelpers.getValue("work-blacklist-input") || "",
        showReasons: window.AO3MenuHelpers.getValue("show-reasons-checkbox"),
        showPlaceholders: window.AO3MenuHelpers.getValue(
          "show-placeholders-checkbox",
        ),
        highlightColor:
          window.AO3MenuHelpers.getValue("highlight-color-input") ||
          DEFAULTS.highlightColor,
        allowedLanguages:
          window.AO3MenuHelpers.getValue("allowed-languages-input") || "",
        maxCrossovers:
          window.AO3MenuHelpers.getValue("max-crossovers-input") || "",
        minWords: window.AO3MenuHelpers.getValue("min-words-input") || "",
        maxWords: window.AO3MenuHelpers.getValue("max-words-input") || "",
        minChapters: window.AO3MenuHelpers.getValue("min-chapters-input") || "",
        maxChapters: window.AO3MenuHelpers.getValue("max-chapters-input") || "",
        maxMonthsSinceUpdate:
          window.AO3MenuHelpers.getValue("max-months-since-update-input") || "",
        blockComplete: window.AO3MenuHelpers.getValue(
          "block-complete-checkbox",
        ),
        blockOngoing: window.AO3MenuHelpers.getValue("block-ongoing-checkbox"),
        disableOnMyContent: window.AO3MenuHelpers.getValue(
          "disable-on-my-content-checkbox",
        ),
        enableHighlightingOnMyContent: window.AO3MenuHelpers.getValue(
          "enable-highlighting-on-my-content-checkbox",
        ),
        username: config.username || null,
        primaryRelationships:
          window.AO3MenuHelpers.getValue("primary-relationships-input") || "",
        primaryCharacters:
          window.AO3MenuHelpers.getValue("primary-characters-input") || "",
        primaryRelpad:
          window.AO3MenuHelpers.getValue("primary-relpad-input") ||
          DEFAULTS.primaryRelpad,
        primaryCharpad:
          window.AO3MenuHelpers.getValue("primary-charpad-input") ||
          DEFAULTS.primaryCharpad,
        quickAddKey:
          window.AO3MenuHelpers.getValue("quick-add-key-input") ||
          DEFAULTS.quickAddKey,
        enableStrictTagBlocking: window.AO3MenuHelpers.getValue(
          "enable-strict-tag-blocking-checkbox",
        ),
        strictTagBlacklist: (() => {
          const currentDomValue = window.AO3MenuHelpers.getValue(
            "strict-tag-blacklist-input",
          );
          if (currentDomValue !== null && currentDomValue !== undefined) {
            persistentStrictBlacklistValue = currentDomValue;
          }
          return persistentStrictBlacklistValue;
        })(),
        hideCompletelyRules: (() => {
          const rules = {};
          document
            .querySelectorAll(".ao3-blocker-eye-toggle")
            .forEach((toggle) => {
              const filterId = toggle.getAttribute("data-filter-id");
              const pressed = toggle.getAttribute("aria-pressed") === "true";
              rules[filterId] = pressed;
            });
          return rules;
        })(),
        _version: VERSION,
      };
      if (saveConfig(updatedConfig)) {
        location.href =
          location.href + (location.search ? "&" : "?") + "t=" + Date.now();
      } else {
        alert("Error saving settings.");
      }
      dialog.remove();
    });

    dialog.querySelector("#blocker-cancel").addEventListener("click", () => {
      dialog.remove();
    });
    document.body.appendChild(dialog);

    // Function to toggle eye icon visibility
    function updateEyeToggleVisibility() {
      const showPlaceholders = window.AO3MenuHelpers.getValue(
        "show-placeholders-checkbox",
      );
      const eyeToggles = dialog.querySelectorAll(".ao3-blocker-eye-toggle");
      const eyeToggleTip = dialog.querySelector("#eye-toggle-info");

      eyeToggles.forEach((toggle) => {
        toggle.style.display = showPlaceholders ? "inline-block" : "none";
      });

      if (eyeToggleTip) {
        eyeToggleTip.style.display = showPlaceholders ? "block" : "none";
      }
    }

    updateEyeToggleVisibility();

    const showPlaceholdersElement = dialog.querySelector(
      "#show-placeholders-checkbox",
    );
    if (showPlaceholdersElement) {
      showPlaceholdersElement.addEventListener(
        "change",
        updateEyeToggleVisibility,
      );
    }

    const strictTagBlockingElement = dialog.querySelector(
      "#enable-strict-tag-blocking-checkbox",
    );
    if (strictTagBlockingElement) {
      strictTagBlockingElement.addEventListener("change", function () {
        const isEnabled = this.checked;

        const currentRegularValue =
          window.AO3MenuHelpers.getValue("tag-blacklist-input") || "";
        const strictElement = document.getElementById(
          "strict-tag-blacklist-input",
        );
        if (strictElement) {
          persistentStrictBlacklistValue = strictElement.value;
        }

        config.tagBlacklist = currentRegularValue;
        renderTagBlacklistUI(isEnabled);
        updateEyeToggleVisibility();
      });
    }
  }

  function getWordCount(ddElements) {
    const wordsElement = ddElements.words;
    if (!wordsElement) return null;
    let txt = wordsElement.textContent.trim();
    txt = txt.replace(/(?<=\d)[ ,](?=\d{3}(\D|$))/g, "");
    txt = txt.replace(/[^\d]/g, "");
    const n = parseInt(txt, 10);
    return Number.isFinite(n) ? n : null;
  }

  function getCut(workElement) {
    const cut = document.createElement("div");
    cut.className = `${CSS_NAMESPACE}-cut`;
    const children = Array.from(workElement.children);
    children.forEach((child) => {
      if (
        !child.classList.contains(`${CSS_NAMESPACE}-fold`) &&
        !child.classList.contains(`${CSS_NAMESPACE}-cut`)
      ) {
        cut.appendChild(child);
      }
    });
    return cut;
  }

  function getFold(reasons) {
    const fold = document.createElement("div");
    fold.className = `${CSS_NAMESPACE}-fold`;
    const note = document.createElement("span");
    note.className = `${CSS_NAMESPACE}-note`;
    let message = "";
    const config = window.ao3Blocker && window.ao3Blocker.config;
    const showReasons = config && config.showReasons !== false;
    let iconHtml = "";
    if (showReasons && reasons && reasons.length > 0) {
      const parts = [];
      reasons.forEach((reason) => {
        if (reason.completionStatus)
          parts.push(`<em>${reason.completionStatus}</em>`);
        if (reason.wordCount) parts.push(`<em>${reason.wordCount}</em>`);
        if (reason.chapterCount) parts.push(`<em>${reason.chapterCount}</em>`);
        if (reason.staleUpdate) parts.push(`<em>${reason.staleUpdate}</em>`);
        if (reason.tags && reason.tags.length > 0) {
          const categoryTags = new Set([
            "M/M",
            "Gen",
            "Multi",
            "F/F",
            "F/M",
            "Other",
          ]);
          const ratingTags = new Set([
            "Teen And Up Audiences",
            "Explicit",
            "General Audiences",
            "Mature",
            "Not Rated",
          ]);
          const warningTags = new Set([
            "No Archive Warnings Apply",
            "Creator Chose Not To Use Archive Warnings",
            "Graphic Depictions Of Violence",
            "Major Character Death",
            "Rape/Non-Con",
            "Underage Sex",
          ]);
          const categories = reason.tags.filter((tag) => categoryTags.has(tag));
          const ratings = reason.tags.filter((tag) => ratingTags.has(tag));
          const warnings = reason.tags.filter((tag) => warningTags.has(tag));
          const otherTags = reason.tags.filter(
            (tag) =>
              !categoryTags.has(tag) &&
              !ratingTags.has(tag) &&
              !warningTags.has(tag),
          );
          if (categories.length > 0) {
            const label = categories.length === 1 ? "Category:" : "Categories:";
            parts.push(`<em>${label} ${categories.join(", ")}</em>`);
          }
          if (ratings.length > 0) {
            const label = ratings.length === 1 ? "Rating:" : "Ratings:";
            parts.push(`<em>${label} ${ratings.join(", ")}</em>`);
          }
          if (warnings.length > 0) {
            const label = warnings.length === 1 ? "Warning:" : "Warnings:";
            parts.push(`<em>${label} ${warnings.join(", ")}</em>`);
          }
          if (otherTags.length > 0) {
            const label = otherTags.length === 1 ? "Tag:" : "Tags:";
            parts.push(`<em>${label} ${otherTags.join(", ")}</em>`);
          }
        }
        if (reason.authors && reason.authors.length > 0) {
          const label = reason.authors.length === 1 ? "Author:" : "Authors:";
          parts.push(`<em>${label} ${reason.authors.join(", ")}</em>`);
        }
        if (reason.works && reason.works.length > 0) {
          const label = reason.works.length === 1 ? "Work:" : "Works:";
          parts.push(`<em>${label} ${reason.works.join(", ")}</em>`);
        }
        if (reason.titles && reason.titles.length > 0)
          parts.push(`<em>Title: ${reason.titles[0]}</em>`);
        if (reason.summaryTerms && reason.summaryTerms.length > 0)
          parts.push(`<em>Summary: ${reason.summaryTerms[0]}</em>`);
        if (reason.language)
          parts.push(`<em>Language: ${reason.language}</em>`);
        if (reason.crossovers !== undefined)
          parts.push(`<em>Fandoms: ${reason.crossovers}</em>`);
        if (reason.primaryPairing)
          parts.push(`<em>${reason.primaryPairing}</em>`);
      });
      message = parts.join("; ");
      iconHtml = `<span class="${CSS_NAMESPACE}-icon" style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;margin-right:0.3em;background-color:currentColor;mask:url('${ICON_HIDE}') no-repeat center/contain;-webkit-mask:url('${ICON_HIDE}') no-repeat center/contain;"></span>`;
    } else if (reasons && reasons.length > 0) {
      message = "<em>Hidden by filters.</em>";
      iconHtml = `<span class="${CSS_NAMESPACE}-icon" style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;margin-right:0.3em;background-color:currentColor;mask:url('${ICON_HIDE}') no-repeat center/contain;-webkit-mask:url('${ICON_HIDE}') no-repeat center/contain;"></span>`;
    }
    note.innerHTML = `${iconHtml}${message}`;
    fold.appendChild(note);
    fold.appendChild(getToggleButton());
    return fold;
  }

  function getToggleButton() {
    const showIcon = `<span style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;margin-right:0.2em;background-color:currentColor;mask:url('${ICON_EYE}') no-repeat center/contain;-webkit-mask:url('${ICON_EYE}') no-repeat center/contain;"></span>`;
    const hideIcon = `<span style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;margin-right:0.2em;background-color:currentColor;mask:url('${ICON_HIDE}') no-repeat center/contain;-webkit-mask:url('${ICON_HIDE}') no-repeat center/contain;"></span>`;
    const button = document.createElement("button");
    button.className = `${CSS_NAMESPACE}-toggle`;
    button.innerHTML = showIcon + "Show";
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    const unhideClassFragment = `${CSS_NAMESPACE}-unhide`;
    button.addEventListener("click", (event) => {
      const buttonEl = event.currentTarget;
      const work = buttonEl.closest(`.${CSS_NAMESPACE}-work`);
      if (!work) return;
      const note = work.querySelector(`.${CSS_NAMESPACE}-note`);
      const cut = work.querySelector(`.${CSS_NAMESPACE}-cut`);
      if (!note) return;
      let message = note.innerHTML;
      const iconRegex = new RegExp(
        "<span[^>]*class=[\"']" +
          CSS_NAMESPACE +
          "-icon[\"'][^>]*><\\/span>\\s*",
        "i",
      );
      message = message.replace(iconRegex, "");
      if (cut) {
        const targetHeight = cut.scrollHeight;
        cut.style.setProperty(
          "--ao3-blocker-cut-height",
          `${Math.max(targetHeight, 0)}px`,
        );
      }
      if (work.classList.contains(unhideClassFragment)) {
        work.classList.remove(unhideClassFragment);
        if (cut) cut.style.overflow = "hidden";
        note.innerHTML = `<span class="${CSS_NAMESPACE}-icon" style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;margin-right:0.3em;background-color:currentColor;mask:url('${ICON_HIDE}') no-repeat center/contain;-webkit-mask:url('${ICON_HIDE}') no-repeat center/contain;"></span>${message}`;
        buttonEl.innerHTML = showIcon + "Show";
        buttonEl.setAttribute("aria-expanded", "false");
      } else {
        work.classList.add(unhideClassFragment);
        if (cut) {
          cut.style.overflow = "hidden";
          setTimeout(() => {
            if (work.classList.contains(unhideClassFragment)) {
              cut.style.overflow = "visible";
            }
          }, 260);
        }
        note.innerHTML = `<span class="${CSS_NAMESPACE}-icon" style="display:inline-block;width:1.2em;height:1.2em;vertical-align:-0.15em;margin-right:0.3em;background-color:currentColor;mask:url('${ICON_EYE}') no-repeat center/contain;-webkit-mask:url('${ICON_EYE}') no-repeat center/contain;"></span>${message}`;
        buttonEl.innerHTML = hideIcon + "Hide";
        buttonEl.setAttribute("aria-expanded", "true");
      }
    });
    return button;
  }

  function blockWork(workElement, reasons, config) {
    if (!reasons) return;

    // Check if any reason has the _forceHide flag (strict tags)
    const forceHide = reasons.some((reason) => reason._forceHide);

    // Master override: if Show Placeholders is off OR strict tag match, hide everything
    if (!config.showPlaceholders || forceHide) {
      workElement.classList.add(`${CSS_NAMESPACE}-hidden`);
      return;
    }

    // Otherwise, check individual eye toggle rules
    const hideCompletely = reasons.some(
      (reason) =>
        config.hideCompletelyRules &&
        config.hideCompletelyRules[reason._filterType],
    );

    if (hideCompletely) {
      workElement.classList.add(`${CSS_NAMESPACE}-hidden`);
    } else {
      // Show placeholder with fold/toggle
      const fold = getFold(reasons);
      const cut = getCut(workElement);
      workElement.classList.add(`${CSS_NAMESPACE}-work`);
      workElement.innerHTML = "";
      workElement.appendChild(fold);
      workElement.appendChild(cut);
      if (!config.showReasons)
        workElement.classList.add(`${CSS_NAMESPACE}-hide-reasons`);
    }
  }

  function matchPattern(text, pattern, exactMatch) {
    const normalizedText = normalizeText(text);
    if (typeof pattern === "string") {
      return exactMatch
        ? normalizedText === pattern
        : normalizedText.includes(pattern);
    }
    if (!pattern.hasWildcard) {
      return exactMatch
        ? normalizedText === pattern.text
        : normalizedText.includes(pattern.text);
    }
    if (exactMatch) {
      return pattern.exactRegex.test(normalizedText);
    }
    return pattern.regex.test(normalizedText);
  }

  function isTagWhitelisted(tags, whitelist) {
    return tags.some((tag) => {
      return whitelist.some((item) => {
        if (item.type === "simple") {
          if (
            (typeof item.pattern === "string" && !item.pattern.trim()) ||
            (item.pattern && item.pattern.text && !item.pattern.text.trim())
          )
            return false;
          return matchPattern(tag, item.pattern, true);
        } else if (item.type === "conditional") {
          if (matchPattern(tag, item.block, true)) {
            const hasConditionTag = tags.some((t) =>
              matchPattern(t, item.condition, true),
            );
            return (
              (item.operator === "with" && hasConditionTag) ||
              (item.operator === "unless" && !hasConditionTag)
            );
          }
          return false;
        }
        return false;
      });
    });
  }

  function shouldBlockTag(tag, config, allTags) {
    if (!config.conditionalTagBlacklist) config.conditionalTagBlacklist = [];

    const normalizedTag = normalizeText(tag);

    // Check regular blacklist with early return
    const isRegularBlacklisted = config.tagBlacklist.some((pattern) => {
      if (
        (typeof pattern === "string" && pattern.trim()) ||
        (pattern && pattern.text && pattern.text.trim())
      ) {
        return matchPattern(tag, pattern, true);
      }
      return false;
    });

    if (isRegularBlacklisted) return { blocked: true, type: "regular" };

    // Check conditional rules
    for (const rule of config.conditionalTagBlacklist) {
      if (!rule?.block) continue;
      if (!matchPattern(tag, rule.block, true)) continue;
      if (checkConditional(rule, allTags)) {
        // Find the condition tag that triggered this
        const conditionTag = allTags.find((t) =>
          matchPattern(t, rule.condition, true),
        );
        return {
          blocked: true,
          type: "conditional",
          conditionTag: conditionTag,
        };
      }
    }

    return { blocked: false };
  }

  function checkPrimaryPairing(categorizedTags, config) {
    const primaryRelationships = config.primaryRelationships || [];
    const primaryCharacters = config.primaryCharacters || [];
    const relpad = config.primaryRelpad || 1;
    const charpad = config.primaryCharpad || 5;
    if (primaryRelationships.length === 0 && primaryCharacters.length === 0)
      return null;
    const relationshipTags = categorizedTags.relationships
      .slice(0, relpad)
      .map((tag) => normalizeText(tag));
    const characterTags = categorizedTags.characters
      .slice(0, charpad)
      .map((tag) => normalizeText(tag));
    const fandomTags = categorizedTags.fandoms.map((tag) => normalizeText(tag));

    // Group relationships by condition (OR logic within group)
    const relGroups = new Map();
    let hasGlobalRel = false;
    for (const entry of primaryRelationships) {
      const key = entry.condition || "global";
      const item = entry.relationship || entry.item;
      if (item) {
        if (!relGroups.has(key)) relGroups.set(key, []);
        relGroups.get(key).push(item);
        if (key === "global") hasGlobalRel = true;
      }
    }

    // Group characters by condition (OR logic within group)
    const charGroups = new Map();
    let hasGlobalChar = false;
    for (const entry of primaryCharacters) {
      const key = entry.condition || "global";
      const item = entry.character || entry.item;
      if (item) {
        if (!charGroups.has(key)) charGroups.set(key, []);
        charGroups.get(key).push(item);
        if (key === "global") hasGlobalChar = true;
      }
    }

    // If all relationship requirements are conditional and none match current fandom, skip blocking
    if (
      relGroups.size > 0 &&
      !hasGlobalRel &&
      !Array.from(relGroups.keys()).some(
        (cond) => cond !== "global" && fandomTags.includes(normalizeText(cond)),
      )
    ) {
      // No applicable relationship requirement for this fandom
      return null;
    }
    // Same for characters
    if (
      charGroups.size > 0 &&
      !hasGlobalChar &&
      !Array.from(charGroups.keys()).some(
        (cond) => cond !== "global" && fandomTags.includes(normalizeText(cond)),
      )
    ) {
      // No applicable character requirement for this fandom
      return null;
    }

    // OR logic: If any group is satisfied, permit the work
    let relationshipGroupSatisfied = false;
    for (const [condition, items] of relGroups) {
      const conditionMet =
        condition === "global" || fandomTags.includes(normalizeText(condition));
      if (conditionMet) {
        if (items.some((item) => relationshipTags.includes(item))) {
          relationshipGroupSatisfied = true;
          break;
        }
      }
    }
    // If there are no relationship requirements, treat as satisfied
    if (relGroups.size === 0) relationshipGroupSatisfied = true;

    let characterGroupSatisfied = false;
    for (const [condition, items] of charGroups) {
      const conditionMet =
        condition === "global" || fandomTags.includes(normalizeText(condition));
      if (conditionMet) {
        if (items.some((item) => characterTags.includes(item))) {
          characterGroupSatisfied = true;
          break;
        }
      }
    }
    // If there are no character requirements, treat as satisfied
    if (charGroups.size === 0) characterGroupSatisfied = true;

    // Block if relationships are required and not satisfied
    if (relGroups.size > 0 && !relationshipGroupSatisfied) {
      return {
        primaryPairing: `Missing required relationship(s)`,
      };
    }
    // Block if characters are required and not satisfied
    if (charGroups.size > 0 && !characterGroupSatisfied) {
      return {
        primaryPairing: `Missing required character(s)`,
      };
    }
    // If neither are required, or both are satisfied, permit
    return null;
  }

  function getChapterInfo(ddElements) {
    const chaptersElement = ddElements.chapters;
    if (!chaptersElement) return null;
    const text = chaptersElement.textContent.trim();
    const match = text.match(/^(\d+)\s*\/\s*([\d\?]+)/);
    if (!match) return null;
    const current = parseInt(match[1], 10);
    const totalStr = match[2];
    const total = totalStr === "?" ? null : parseInt(totalStr, 10);
    return {
      current: current,
      total: total,
      isComplete: totalStr !== "?" && current === total,
      isOngoing: totalStr === "?" || current < total,
    };
  }

  function getMonthsSinceUpdate(ddElements) {
    const dateElement = ddElements.updated;
    if (!dateElement) return null;
    const dateText = dateElement.textContent.trim();
    const updated = new Date(dateText);
    if (isNaN(updated.getTime())) return null;
    const now = Date.now();
    const months = (now - updated.getTime()) / (30.4 * 24 * 60 * 60 * 1000);
    return months;
  }

  function getBlockReason(blockables, config, blurbElement) {
    const {
      completionStatus,
      authors,
      title,
      categorizedTags,
      tags,
      summary,
      language,
      fandomCount,
      wordCount,
      workId,
      ddElements,
    } = blockables;
    const {
      authorBlacklist,
      titleBlacklist,
      tagBlacklist,
      tagWhitelist,
      summaryBlacklist,
      workBlacklist,
      allowedLanguages,
      maxCrossovers,
      minWords,
      maxWords,
      blockComplete,
      blockOngoing,
    } = config;
    const allTags = tags;
    if (isTagWhitelisted(allTags, tagWhitelist)) return null;

    // Check strict blacklist first - these always hide completely
    if (
      config.enableStrictTagBlocking &&
      config.strictTagBlacklist &&
      config.strictTagBlacklist.length > 0
    ) {
      const strictBlockedTags = [];
      allTags.forEach((tag) => {
        config.strictTagBlacklist.forEach((item) => {
          if (item.type === "simple") {
            if (matchPattern(tag, item.pattern, true)) {
              const matched = getMatchedSubstring(tag, item.pattern);
              if (matched && !strictBlockedTags.includes(matched)) {
                strictBlockedTags.push(matched);
              }
            }
          } else if (item.type === "conditional") {
            if (matchPattern(tag, item.block, true)) {
              // Check if any tag matches the condition pattern (supports wildcards)
              const hasConditionTag = allTags.some((t) =>
                matchPattern(t, item.condition, true),
              );
              if (
                (item.operator === "with" && hasConditionTag) ||
                (item.operator === "unless" && !hasConditionTag)
              ) {
                const matched = getMatchedSubstring(tag, item.block);
                if (matched && !strictBlockedTags.includes(matched)) {
                  strictBlockedTags.push(matched);
                }
              }
            }
          }
        });
      });

      if (strictBlockedTags.length > 0) {
        return [
          {
            tags: strictBlockedTags,
            _filterType: "strictTagBlacklist",
            _forceHide: true, // Special flag to always hide completely
          },
        ];
      }
    }

    const reasons = [];
    const primaryPairingReason = checkPrimaryPairing(categorizedTags, config);
    if (primaryPairingReason)
      reasons.push({
        ...primaryPairingReason,
        _filterType: "primaryRelationships",
      }); // or primaryCharacters, but since it's combined, maybe choose one
    if (blockComplete && completionStatus === "complete")
      reasons.push({
        completionStatus: "Status: Complete",
        _filterType: "blockComplete",
      });
    if (blockOngoing && completionStatus === "ongoing")
      reasons.push({
        completionStatus: "Status: Ongoing",
        _filterType: "blockOngoing",
      });
    if (allowedLanguages.length > 0) {
      const lang = language;
      if (lang && lang !== "unknown") {
        const allowed = allowedLanguages.includes(lang);
        if (!allowed)
          reasons.push({
            language: language || "unknown",
            _filterType: "language",
          });
      }
    }
    if (
      typeof maxCrossovers === "number" &&
      maxCrossovers > 0 &&
      fandomCount > maxCrossovers
    ) {
      reasons.push({ crossovers: fandomCount, _filterType: "maxCrossovers" });
    }
    if (minWords != null || maxWords != null) {
      const wc = wordCount;
      const wcHit = (() => {
        if (wc == null) return null;
        if (minWords != null && wc < minWords)
          return { over: false, limit: minWords };
        if (maxWords != null && wc > maxWords)
          return { over: true, limit: maxWords };
        return null;
      })();
      if (wcHit) {
        const wcStr = wc?.toLocaleString?.() ?? wc;
        const filterType = wcHit.over ? "maxWords" : "minWords";
        reasons.push({ wordCount: `Words: ${wcStr}`, _filterType: filterType });
      }
    }
    if (config.minChapters != null || config.maxChapters != null) {
      const chapterInfo = getChapterInfo(ddElements);
      if (chapterInfo && chapterInfo.current != null) {
        const chapters = chapterInfo.current;
        let blocked = false;
        if (config.minChapters != null && chapters < config.minChapters)
          blocked = true;
        if (config.maxChapters != null && chapters > config.maxChapters)
          blocked = true;
        if (blocked)
          reasons.push({
            chapterCount: `Chapters: ${chapters}`,
            _filterType:
              config.minChapters != null && chapters < config.minChapters
                ? "minChapters"
                : "maxChapters",
          });
      }
    }
    if (config.maxMonthsSinceUpdate != null && completionStatus === "ongoing") {
      const monthsSinceUpdate = getMonthsSinceUpdate(ddElements);
      if (
        monthsSinceUpdate != null &&
        monthsSinceUpdate > config.maxMonthsSinceUpdate
      ) {
        const monthsDisplay = Math.floor(monthsSinceUpdate);
        reasons.push({
          staleUpdate: `Updated ${monthsDisplay} month${
            monthsDisplay !== 1 ? "s" : ""
          } ago`,
          _filterType: "maxMonthsSinceUpdate",
        });
      }
    }
    const blockedTags = [];
    const conditionTags = new Set(); // Track condition tags separately
    allTags.forEach((tag) => {
      const blockResult = shouldBlockTag(tag, config, allTags);
      if (blockResult.blocked) {
        blockedTags.push(tag);
        // If it's a conditional block, also track the condition tag
        if (blockResult.type === "conditional" && blockResult.conditionTag) {
          conditionTags.add(blockResult.conditionTag);
        }
      }
    });
    // Add condition tags to the blocked tags list for display
    if (conditionTags.size > 0) {
      conditionTags.forEach((tag) => {
        if (!blockedTags.includes(tag)) {
          blockedTags.push(tag);
        }
      });
    }
    if (blockedTags.length > 0)
      reasons.push({ tags: blockedTags, _filterType: "tagBlacklist" });
    const blockedAuthors = [];
    authors.forEach((author) => {
      if (authorBlacklist.has(author)) {
        blockedAuthors.push(author);
      }
    });
    if (blockedAuthors.length > 0)
      reasons.push({ authors: blockedAuthors, _filterType: "authorBlacklist" });
    const blockedWorks = [];
    if (workId) {
      if (workBlacklist.has(workId)) {
        blockedWorks.push(workId);
      }
    }
    if (blockedWorks.length > 0)
      reasons.push({ works: blockedWorks, _filterType: "workBlacklist" });
    const blockedTitles = new Set();
    titleBlacklist.forEach((pattern) => {
      if (
        (typeof pattern === "string" && pattern.trim()) ||
        (pattern && pattern.text && pattern.text.trim())
      ) {
        if (matchPattern(title, pattern, false)) {
          const matched = getMatchedSubstring(title, pattern);
          if (matched) blockedTitles.add(matched);
        }
      }
    });
    if (blockedTitles.size > 0)
      reasons.push({
        titles: Array.from(blockedTitles),
        _filterType: "titleBlacklist",
      });
    const blockedSummaryTerms = new Set();
    summaryBlacklist.forEach((pattern) => {
      if (
        (typeof pattern === "string" && pattern.trim()) ||
        (pattern && pattern.text && pattern.text.trim())
      ) {
        if (matchPattern(summary, pattern, false)) {
          const matched = getMatchedSubstring(summary, pattern);
          if (matched) blockedSummaryTerms.add(matched);
        }
      }
    });
    if (blockedSummaryTerms.size > 0)
      reasons.push({
        summaryTerms: Array.from(blockedSummaryTerms),
        _filterType: "summaryBlacklist",
      });
    return reasons.length > 0 ? reasons : null;
  }

  function getText(element) {
    return (element.textContent || element.innerText || "").trim();
  }

  function selectTextsIn(root, selector) {
    const elements = root.querySelectorAll(selector);
    return Array.from(elements).map(getText);
  }

  function selectFromBlurb(blurbElement) {
    const ddElements = {
      chapters: blurbElement.querySelector("dd.chapters"),
      words: blurbElement.querySelector("dd.words"),
      language: blurbElement.querySelector("dd.language"),
      updated: blurbElement.querySelector("dd.updated .datetime, .datetime"),
    };
    const fandoms = blurbElement.querySelectorAll("h5.fandoms.heading a.tag");
    let completionStatus = null;
    const chaptersNode = ddElements.chapters;
    if (chaptersNode) {
      let chaptersText = "";
      const a = chaptersNode.querySelector("a");
      if (a) {
        chaptersText = a.textContent.trim();
        let raw = chaptersNode.innerHTML;
        raw = raw.replace(/<a[^>]*>.*?<\/a>/, "");
        raw = raw.replace(/&nbsp;/gi, " ");
        const match = raw.match(/\/\s*([\d\?]+)/);
        if (match) chaptersText += "/" + match[1].trim();
      } else {
        chaptersText = chaptersNode.textContent.replace(/&nbsp;/gi, " ").trim();
      }
      completionStatus = parseChaptersStatus(chaptersText);
    }
    const tagData = getCategorizedAndFlatTags(blurbElement);
    const titleLink = blurbElement.querySelector(
      ".header .heading a:first-child",
    );
    const workId = titleLink
      ? titleLink.href.match(/\/works\/(\d+)/)?.[1]
      : null;
    return {
      authors: selectTextsIn(blurbElement, "a[rel=author]").map((a) =>
        a.toLowerCase(),
      ),
      categorizedTags: tagData.categorized,
      tags: tagData.flat,
      title: selectTextsIn(blurbElement, ".header .heading a:first-child")[0],
      summary: selectTextsIn(blurbElement, "blockquote.summary")[0],
      language: (ddElements.language
        ? ddElements.language.textContent.trim()
        : ""
      )
        .toLowerCase()
        .trim(),
      fandomCount: fandoms.length,
      wordCount: getWordCount(ddElements),
      completionStatus: completionStatus,
      workId: workId,
      ddElements: ddElements,
    };
  }
})();
