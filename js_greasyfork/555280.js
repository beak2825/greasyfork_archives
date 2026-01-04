// ==UserScript==
// @name         Comick Source Linker
// @namespace    http://github.com/GooglyBlox
// @version      1.7
// @description  Link Comick chapters to alternative sources
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @connect      comick-source-api.notaspider.dev
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555280/Comick%20Source%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/555280/Comick%20Source%20Linker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const API_BASE_URL = "https://comick-source-api.notaspider.dev";
  const STORAGE_KEY_PREFIX = "comick_sources_";
  const SETTINGS_STORAGE_KEY = "comick_source_linker_settings";

  let sourcesCache = null;
  const chapterListCache = {};
  const CACHE_DURATION = 5 * 60 * 1000;

  const error = (...args) => console.error("[Comick Source Linker]", ...args);

  const getSettings = () => {
    try {
      const data = GM_getValue(SETTINGS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (err) {
      error("Failed to get settings:", err);
    }
    return { enabledSources: {} };
  };

  const saveSettings = (settings) => {
    try {
      GM_setValue(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      error("Failed to save settings:", err);
    }
  };

  const getCachedChapters = async (url, source, comicId) => {
    const cacheKey = `${comicId}_${source}`;
    const cached = chapterListCache[cacheKey];

    // Avoid hammering the API for chapter lists we've already fetched
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.chapters;
    }

    const result = await getChapters(url, source);
    const chapters = result.chapters || result;

    if (!Array.isArray(chapters)) {
      error(`Invalid chapters data from ${source}:`, chapters);
      return [];
    }

    chapterListCache[cacheKey] = {
      chapters: chapters,
      timestamp: Date.now(),
    };

    return chapters;
  };

  const getFaviconUrl = (baseUrl) => {
    try {
      const url = new URL(baseUrl);
      return `https://www.google.com/s2/favicons?sz=32&domain_url=${url.origin}`;
    } catch {
      return null;
    }
  };

  const createLoadingSpinner = (size = "w-5 h-5") => {
    return `
            <svg class="animate-spin ${size} text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          `;
  };

  const setButtonLoading = (button, isLoading, loadingText = "") => {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalHtml = button.innerHTML;
      button.innerHTML = `
              <span class="flex items-center justify-center gap-2">
                ${createLoadingSpinner("w-4 h-4")}
                ${loadingText}
              </span>
            `;
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalHtml || button.innerHTML;
      delete button.dataset.originalHtml;
    }
  };

  const getSourceInfo = (sourceName) => {
    if (!sourcesCache) return null;
    return sourcesCache.sources.find((s) => s.name === sourceName);
  };

  const getStoredSources = (comicId) => {
    try {
      const data = GM_getValue(STORAGE_KEY_PREFIX + comicId);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      error("Failed to get stored sources:", err);
      return null;
    }
  };

  const setStoredSources = (comicId, sources) => {
    try {
      GM_setValue(STORAGE_KEY_PREFIX + comicId, JSON.stringify(sources));
    } catch (err) {
      error("Failed to store sources:", err);
    }
  };

  const apiRequest = (endpoint, method = "GET", data = null) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data ? JSON.stringify(data) : null,
        onload: (response) => {
          try {
            const result = JSON.parse(response.responseText);
            resolve(result);
          } catch {
            reject(new Error("Failed to parse response"));
          }
        },
        onerror: (err) => reject(err),
        ontimeout: () => reject(new Error("Request timeout")),
      });
    });
  };

  const getSources = () => apiRequest("/api/sources");
  const searchSources = (query, sources = "all") =>
    apiRequest("/api/search", "POST", { query, source: sources });
  const getChapters = (url, source) =>
    apiRequest("/api/chapters", "POST", { url, source });

  const isComicPage = () => {
    const path = window.location.pathname;
    const parts = path.split("/").filter((p) => p);
    return parts.length === 2 && parts[0] === "comic";
  };

  const isChapterPage = () => {
    const path = window.location.pathname;
    const parts = path.split("/").filter((p) => p);
    return parts.length === 3 && parts[0] === "comic";
  };

  const extractComicInfo = () => {
    const titleElement = document.querySelector("h1");
    const title = titleElement ? titleElement.textContent.trim() : null;

    const aliasesElement = document.querySelector(
      '.text-gray-500.dark\\:text-gray-400[style*="max-height"]'
    );
    const aliases = aliasesElement
      ? aliasesElement.textContent
          .split("•")
          .map((a) => a.trim())
          .filter((a) => a)
      : [];

    const comicId = window.location.pathname.split("/")[2];

    return { title, aliases, comicId };
  };

  const extractChapterNumber = (chapterElement) => {
    const titleElement = chapterElement.querySelector("span.font-bold");
    if (!titleElement) return null;

    const match = titleElement.textContent.match(/Ch\.\s*(\d+(?:\.\d+)?)/i);
    return match ? parseFloat(match[1]) : null;
  };

  const extractChapterGroup = (chapterElement) => {
    const groupLink = chapterElement.querySelector("td:last-child a.link");
    if (!groupLink) return null;

    const groupName = groupLink.textContent.trim();
    const groupUrl = groupLink.getAttribute("href");

    return {
      name: groupName,
      url: groupUrl ? `https://comick.io${groupUrl}` : null,
    };
  };

  const fuzzyMatchGroupNames = (name1, name2) => {
    if (!name1 || !name2) return false;

    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/scans?$/i, "")
        .replace(/official/i, "");

    const n1 = normalize(name1);
    const n2 = normalize(name2);

    if (n1 === n2) return true;

    if (n1.includes(n2) || n2.includes(n1)) return true;

    return false;
  };

  const extractCurrentChapter = () => {
    const infoElement = document.querySelector(
      ".rounded-md.bg-gray-50.dark\\:bg-gray-900"
    );
    if (!infoElement) return null;

    const chapterElement = infoElement.querySelector("h3");
    if (!chapterElement) return null;

    const match = chapterElement.textContent.match(
      /Chapter\s+(\d+(?:\.\d+)?)/i
    );
    return match ? parseFloat(match[1]) : null;
  };

  const createSourceButton = () => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "flex-none w-12 h-12 btn px-2 py-2 inline-flex items-center rounded font-medium shadow-sm focus:outline-none focus:ring-2 rounded-md px-3 py-2 text-sm leading-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-blue-500";
    button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          `;
    button.title = "Manage Alternative Sources";
    return button;
  };

  const createModal = (comicInfo, onClose) => {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 z-50 overflow-y-auto";
    overlay.style.cssText = "background-color: rgba(0, 0, 0, 0.5);";

    const style = document.createElement("style");
    style.textContent = `
        .comick-modal-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .comick-modal-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .comick-modal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }
        .comick-modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
        .dark .comick-modal-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .dark .comick-modal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        .dark .comick-modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `;
    document.head.appendChild(style);

    const settings = getSettings();
    const availableSources = sourcesCache?.sources || [];

    // First time setup: enable all sources by default
    if (
      availableSources.length > 0 &&
      Object.keys(settings.enabledSources).length === 0
    ) {
      availableSources.forEach((source) => {
        settings.enabledSources[source.name] = true;
      });
    }

    const scanlators = availableSources.filter((s) => s.type === "scanlator");
    const aggregators = availableSources.filter((s) => s.type === "aggregator");

    const createSourceHtml = (source) => `
        <label class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600 transition-colors">
          <input type="checkbox" class="source-toggle w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" data-source="${
            source.name
          }" ${settings.enabledSources[source.name] !== false ? "checked" : ""}>
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-900 dark:text-gray-100 truncate">${
              source.name
            }</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">${
              source.baseUrl
            }</div>
          </div>
        </label>
      `;

    overlay.innerHTML = `
            <div class="flex items-center justify-center min-h-screen p-4">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div id="modal-header" class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Alternative Sources</h2>
                  <div class="flex items-center gap-2">
                    <button class="settings-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title="Settings">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button class="close-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div id="modal-content" class="p-6 flex-1 overflow-y-auto comick-modal-scrollbar">
                  <div id="search-view">
                    <div class="mb-4">
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Searching for: <strong>${comicInfo.title}</strong>
                      </p>
                      <div class="flex gap-2 items-center">
                        <label class="text-sm text-gray-600 dark:text-gray-400">Use alias:</label>
                        <select id="alias-selector" class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                          <option value="${comicInfo.title}">${
      comicInfo.title
    }</option>
                          ${comicInfo.aliases
                            .map(
                              (alias) =>
                                `<option value="${alias}">${alias}</option>`
                            )
                            .join("")}
                        </select>
                        <button id="search-btn" class="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">
                          Search
                        </button>
                      </div>
                    </div>
                    <div id="search-status" class="mb-4 text-sm"></div>
                    <!-- Search Results Tabs -->
                    <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                      <nav class="flex -mb-px space-x-8" aria-label="Search Results">
                        <button type="button" class="search-results-tab whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600 dark:text-blue-400" data-tab="aggregators">
                          Aggregators
                        </button>
                        <button type="button" class="search-results-tab whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="scanlators">
                          Scanlators
                        </button>
                      </nav>
                    </div>
                    <!-- Tab Contents -->
                    <div id="search-results-aggregators" class="search-results-content overflow-y-auto max-h-96 comick-modal-scrollbar"></div>
                    <div id="search-results-scanlators" class="search-results-content overflow-y-auto max-h-96 hidden comick-modal-scrollbar"></div>
                  </div>
                  <div id="settings-view" class="hidden">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Select which sources to search. Disabling unused sources can improve search performance.
                    </p>
                    <!-- Tab Navigation -->
                    <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                      <nav class="flex -mb-px space-x-8" aria-label="Tabs">
                        <button type="button" class="source-tab whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600 dark:text-blue-400" data-tab="all">
                          All Sources (${availableSources.length})
                        </button>
                        <button type="button" class="source-tab whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="aggregators">
                          Aggregators (${aggregators.length})
                        </button>
                        <button type="button" class="source-tab whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="scanlators">
                          Scanlators (${scanlators.length})
                        </button>
                      </nav>
                    </div>
                    <!-- Tab Content -->
                    <div id="tab-content-all" class="source-tab-content space-y-2 overflow-y-auto max-h-96 comick-modal-scrollbar">
                      ${availableSources.map(createSourceHtml).join("")}
                    </div>
                    <div id="tab-content-aggregators" class="source-tab-content hidden space-y-2 overflow-y-auto max-h-96 comick-modal-scrollbar">
                      ${aggregators.map(createSourceHtml).join("")}
                    </div>
                    <div id="tab-content-scanlators" class="source-tab-content hidden space-y-2 overflow-y-auto max-h-96 comick-modal-scrollbar">
                      ${scanlators.map(createSourceHtml).join("")}
                    </div>
                  </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                  <button id="cancel-btn" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                  <button id="save-btn" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                    Save Selected
                  </button>
                </div>
              </div>
            </div>
          `;

    const closeHandler = () => {
      onClose();
    };

    const modalHeader = overlay.querySelector("#modal-header");
    const searchView = overlay.querySelector("#search-view");
    const settingsView = overlay.querySelector("#settings-view");
    const settingsBtn = overlay.querySelector(".settings-btn");
    const saveBtn = overlay.querySelector("#save-btn");

    const showSettings = () => {
      searchView.classList.add("hidden");
      settingsView.classList.remove("hidden");

      modalHeader.innerHTML = `
          <div class="flex items-center gap-3">
            <button class="back-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Source Settings</h2>
          </div>
          <button class="close-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        `;

      saveBtn.textContent = "Save Settings";

      modalHeader
        .querySelector(".back-btn")
        .addEventListener("click", showSearch);
      modalHeader
        .querySelector(".close-btn")
        .addEventListener("click", closeHandler);

      const tabButtons = settingsView.querySelectorAll(".source-tab");
      const tabContents = settingsView.querySelectorAll(".source-tab-content");

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetTab = button.dataset.tab;

          tabButtons.forEach((btn) => {
            if (btn === button) {
              btn.classList.remove(
                "border-transparent",
                "text-gray-500",
                "dark:text-gray-400"
              );
              btn.classList.add(
                "border-blue-500",
                "text-blue-600",
                "dark:text-blue-400"
              );
            } else {
              btn.classList.remove(
                "border-blue-500",
                "text-blue-600",
                "dark:text-blue-400"
              );
              btn.classList.add(
                "border-transparent",
                "text-gray-500",
                "dark:text-gray-400"
              );
            }
          });

          tabContents.forEach((content) => {
            if (content.id === `tab-content-${targetTab}`) {
              content.classList.remove("hidden");
            } else {
              content.classList.add("hidden");
            }
          });
        });
      });
    };

    const showSearch = () => {
      searchView.classList.remove("hidden");
      settingsView.classList.add("hidden");

      modalHeader.innerHTML = `
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Alternative Sources</h2>
          <div class="flex items-center gap-2">
            <button class="settings-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" title="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button class="close-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        `;

      saveBtn.textContent = "Save Selected";

      modalHeader
        .querySelector(".settings-btn")
        .addEventListener("click", showSettings);
      modalHeader
        .querySelector(".close-btn")
        .addEventListener("click", closeHandler);
    };

    overlay.querySelector(".close-btn").addEventListener("click", closeHandler);
    overlay
      .querySelector("#cancel-btn")
      .addEventListener("click", closeHandler);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeHandler();
    });

    settingsBtn.addEventListener("click", showSettings);

    const searchResultsTabs = overlay.querySelectorAll(".search-results-tab");
    const searchResultsContents = overlay.querySelectorAll(
      ".search-results-content"
    );

    searchResultsTabs.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.dataset.tab;

        searchResultsTabs.forEach((btn) => {
          if (btn === button) {
            btn.classList.remove(
              "border-transparent",
              "text-gray-500",
              "dark:text-gray-400"
            );
            btn.classList.add(
              "border-blue-500",
              "text-blue-600",
              "dark:text-blue-400"
            );
          } else {
            btn.classList.remove(
              "border-blue-500",
              "text-blue-600",
              "dark:text-blue-400"
            );
            btn.classList.add(
              "border-transparent",
              "text-gray-500",
              "dark:text-gray-400"
            );
          }
        });

        searchResultsContents.forEach((content) => {
          if (content.id === `search-results-${targetTab}`) {
            content.classList.remove("hidden");
          } else {
            content.classList.add("hidden");
          }
        });
      });
    });

    return overlay;
  };

  const displaySearchResults = (resultsContainer, sources) => {
    if (!sources || sources.length === 0) {
      resultsContainer.innerHTML =
        '<p class="text-gray-500">No results found</p>';
      return;
    }

    resultsContainer.innerHTML = sources
      .map((source) => {
        if (!source.results || source.results.length === 0) return "";

        return `
              <div class="mb-4 border border-gray-200 dark:border-gray-700 rounded p-3">
                <h3 class="font-semibold mb-2 text-gray-900 dark:text-gray-100">${
                  source.source
                }</h3>
                <div class="space-y-2">
                  ${source.results
                    .map(
                      (result) => `
                    <label class="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input type="checkbox" class="source-checkbox mt-1"
                        data-source="${source.source}"
                        data-url="${result.url}"
                        data-title="${result.title}">
                      <div class="flex-1">
                        <div class="font-medium text-gray-900 dark:text-gray-100">${result.title}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                          Latest: Ch. ${result.latestChapter} | Updated: ${result.lastUpdated}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">${result.url}</div>
                      </div>
                    </label>
                  `
                    )
                    .join("")}
                </div>
              </div>
            `;
      })
      .join("");
  };

  const handleComicPage = async () => {
    const comicInfo = extractComicInfo();
    if (!comicInfo.title) return;

    const buttonsContainer = document.querySelector(
      ".flex.items-center.w-full.md\\:max-w-md.xl\\:max-w-xl.space-x-3"
    );
    if (!buttonsContainer) return;

    if (!buttonsContainer.querySelector(".source-linker-btn")) {
      const sourceButton = createSourceButton();
      sourceButton.classList.add("source-linker-btn");
      buttonsContainer.appendChild(sourceButton);

      sourceButton.addEventListener("click", async () => {
        setButtonLoading(sourceButton, true);

        const currentComicInfo = extractComicInfo();
        const modal = createModal(currentComicInfo, () => {
          document.body.removeChild(modal);
          setButtonLoading(sourceButton, false);
        });
        document.body.appendChild(modal);

        const searchBtn = modal.querySelector("#search-btn");
        const aliasSelector = modal.querySelector("#alias-selector");
        const searchStatus = modal.querySelector("#search-status");
        const searchResultsScanlators = modal.querySelector(
          "#search-results-scanlators"
        );
        const searchResultsAggregators = modal.querySelector(
          "#search-results-aggregators"
        );
        const saveBtn = modal.querySelector("#save-btn");

        const storedSources = getStoredSources(currentComicInfo.comicId);

        const performSearch = async () => {
          const query = aliasSelector.value;
          setButtonLoading(searchBtn, true, "Searching...");

          const settings = getSettings();

          const scanlatorSources = (sourcesCache?.sources || []).filter(
            (s) => s.type === "scanlator"
          );
          const aggregatorSources = (sourcesCache?.sources || []).filter(
            (s) => s.type === "aggregator"
          );

          const enabledScanlators = scanlatorSources
            .filter((s) => settings.enabledSources[s.name] !== false)
            .map((s) => s.name);
          const enabledAggregators = aggregatorSources
            .filter((s) => settings.enabledSources[s.name] !== false)
            .map((s) => s.name);

          searchStatus.innerHTML = `<p class="text-blue-500">Searching ${enabledScanlators.length} scanlator(s) and ${enabledAggregators.length} aggregator(s)...</p>`;
          searchResultsScanlators.innerHTML = "";
          searchResultsAggregators.innerHTML = "";

          try {
            const [scanlatorsResults, aggregatorsResults] = await Promise.all([
              Promise.all(
                enabledScanlators.map(async (sourceName) => {
                  try {
                    const result = await searchSources(query, sourceName);
                    return {
                      source: sourceName,
                      results: result.results || [],
                    };
                  } catch (err) {
                    error(`Failed to search ${sourceName}:`, err);
                    return {
                      source: sourceName,
                      results: [],
                      error:
                        err instanceof Error ? err.message : "Search failed",
                    };
                  }
                })
              ),
              Promise.all(
                enabledAggregators.map(async (sourceName) => {
                  try {
                    const result = await searchSources(query, sourceName);
                    return {
                      source: sourceName,
                      results: result.results || [],
                    };
                  } catch (err) {
                    error(`Failed to search ${sourceName}:`, err);
                    return {
                      source: sourceName,
                      results: [],
                      error:
                        err instanceof Error ? err.message : "Search failed",
                    };
                  }
                })
              ),
            ]);

            searchStatus.innerHTML =
              '<p class="text-green-500">Search complete!</p>';
            displaySearchResults(searchResultsScanlators, scanlatorsResults);
            displaySearchResults(searchResultsAggregators, aggregatorsResults);

            if (storedSources) {
              storedSources.forEach((stored) => {
                const checkboxScanlator = searchResultsScanlators.querySelector(
                  `input[data-source="${stored.source}"][data-url="${stored.url}"]`
                );
                const checkboxAggregator =
                  searchResultsAggregators.querySelector(
                    `input[data-source="${stored.source}"][data-url="${stored.url}"]`
                  );
                if (checkboxScanlator) checkboxScanlator.checked = true;
                if (checkboxAggregator) checkboxAggregator.checked = true;
              });
            }
          } catch (err) {
            error("Search failed:", err);
            searchStatus.innerHTML =
              '<p class="text-red-500">Search failed. Please try again.</p>';
          } finally {
            setButtonLoading(searchBtn, false);
          }
        };

        searchBtn.addEventListener("click", performSearch);

        saveBtn.addEventListener("click", async () => {
          setButtonLoading(saveBtn, true, "Saving...");

          try {
            const settingsCheckboxes = modal.querySelectorAll(".source-toggle");
            const newSettings = { enabledSources: {} };

            settingsCheckboxes.forEach((checkbox) => {
              newSettings.enabledSources[checkbox.dataset.source] =
                checkbox.checked;
            });

            saveSettings(newSettings);

            const checkboxesScanlators =
              searchResultsScanlators.querySelectorAll(".source-checkbox");
            const checkboxesAggregators =
              searchResultsAggregators.querySelectorAll(".source-checkbox");
            const allCheckboxes = [
              ...checkboxesScanlators,
              ...checkboxesAggregators,
            ];

            const currentResults = Array.from(allCheckboxes).map((cb) => ({
              source: cb.dataset.source,
              url: cb.dataset.url,
              title: cb.dataset.title,
              checked: cb.checked,
            }));

            const existingStored = storedSources || [];

            // Build a set of current search results for quick lookup
            const currentResultKeys = new Set(
              currentResults.map((r) => `${r.source}:${r.url}`)
            );

            // Keep sources from previous searches that aren't in current results
            const sourcesToKeep = existingStored.filter(
              (stored) =>
                !currentResultKeys.has(`${stored.source}:${stored.url}`)
            );

            const newlySelected = currentResults
              .filter((r) => r.checked)
              .map((r) => ({
                source: r.source,
                url: r.url,
                title: r.title,
              }));

            const finalSources = [...sourcesToKeep, ...newlySelected];

            setStoredSources(currentComicInfo.comicId, finalSources);

            if (finalSources.length > 0) {
              await addChapterIcons(currentComicInfo.comicId, finalSources);
            }

            document.body.removeChild(modal);
            setButtonLoading(sourceButton, false);
          } catch (err) {
            error("Failed to save:", err);
            setButtonLoading(saveBtn, false);
          }
        });

        try {
          await performSearch();
        } finally {
          setButtonLoading(sourceButton, false);
        }
      });
    }

    const storedSources = getStoredSources(comicInfo.comicId);
    if (storedSources && storedSources.length > 0) {
      await addChapterIcons(comicInfo.comicId, storedSources);

      const chapterTable = document.querySelector("table.table-fixed tbody");
      if (chapterTable) {
        if (window.chapterListObserver) {
          window.chapterListObserver.disconnect();
        }

        let isUpdating = false;

        window.chapterListObserver = new MutationObserver((mutations) => {
          if (isUpdating) return;

          // Ignore changes to our own aggregate rows to avoid infinite loops
          const hasNonAggregateChanges = mutations.some((mutation) => {
            return (
              Array.from(mutation.addedNodes).some(
                (node) =>
                  node.nodeType === 1 &&
                  !node.classList.contains("aggregate-chapter-row")
              ) ||
              Array.from(mutation.removedNodes).some(
                (node) =>
                  node.nodeType === 1 &&
                  !node.classList.contains("aggregate-chapter-row")
              )
            );
          });

          if (hasNonAggregateChanges) {
            isUpdating = true;
            addChapterIcons(comicInfo.comicId, storedSources).finally(() => {
              isUpdating = false;
            });
          }
        });

        window.chapterListObserver.observe(chapterTable, {
          childList: true,
          subtree: false,
        });
      }
    }
  };

  const createAggregateChapterRow = (chapterNum, sourcesWithChapter) => {
    const firstSource = sourcesWithChapter[0];
    const lastUpdated = firstSource.chapter.lastUpdated || "Unknown";

    const iconsHtml = sourcesWithChapter
      .map(({ source, chapter }) => {
        const sourceInfo = getSourceInfo(source);
        const faviconUrl = sourceInfo
          ? getFaviconUrl(sourceInfo.baseUrl)
          : null;

        const groupInfo = chapter.group
          ? ` (${chapter.group.name})`
          : "";
        const titleText = `${source}${groupInfo} - Ch. ${chapter.number}`;

        if (faviconUrl) {
          return `
              <a href="${chapter.url}" target="_blank"
                class="inline-block w-5 h-5 ml-1 hover:opacity-75"
                title="${titleText}">
                <img src="${faviconUrl}" alt="${source}" class="w-full h-full rounded" />
              </a>
            `;
        } else {
          return `
              <a href="${chapter.url}" target="_blank"
                class="inline-block w-5 h-5 rounded-full bg-blue-500 text-white text-xs leading-5 text-center ml-1 hover:bg-blue-600"
                title="${titleText}">
                ${source.charAt(0).toUpperCase()}
              </a>
            `;
        }
      })
      .join("");

    // Determine group label
    let groupLabel = "Aggregate Source";
    let groupHtml = `<span class="text-gray-500 dark:text-gray-500">${groupLabel}</span>`;

    // If all sources are from Comix and have the same group, show that group
    const comixSources = sourcesWithChapter.filter(
      (s) => s.source === "Comix" && s.chapter.group
    );
    if (
      comixSources.length === sourcesWithChapter.length &&
      comixSources.length > 0
    ) {
      const firstGroup = comixSources[0].chapter.group;
      const allSameGroup = comixSources.every(
        (s) => s.chapter.group.name === firstGroup.name
      );

      if (allSameGroup && firstGroup.url) {
        groupHtml = `<a class="link text-blue-400 dark:text-blue-500" href="${firstGroup.url}" target="_blank">${firstGroup.name}</a>`;
      } else if (allSameGroup) {
        groupHtml = `<span>${firstGroup.name}</span>`;
      }
    }

    const tr = document.createElement("tr");
    tr.className =
      "group border-t dark:border-gray-600 border-gray-300 aggregate-chapter-row";
    tr.style.backgroundColor = "rgba(59, 130, 246, 0.05)";

    tr.innerHTML = `
        <td class="customclass1 left-0 break-all cursor-pointer flex items-center justify-between group">
          <div class="py-3 w-full link-effect-no-ring dark:visited:text-gray-500 visited:text-gray-400 text-black dark:text-gray-200 flex items-center justify-between active:bg-blue-500/30 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="truncate">
              <i class="fi mr-2 fi-gb rounded"></i><span class="font-bold" title="Chapter ${chapterNum}">Ch. ${chapterNum}</span><span class="source-icons ml-2">${iconsHtml}</span>
            </div>
          </div>
        </td>
        <td class="text-gray-600 text-right dark:text-gray-400 text-xs md:text-sm lg:text-base">
          <time class="cursor-pointer">${lastUpdated}</time>
        </td>
        <td class="pl-3 xl:pl-8 text-right text-gray-600 dark:text-gray-400 text-xs md:text-sm lg:text-base flex items-center justify-between">
          <div class="flex">
            <div class="w-32 md:w-40 lg:w-48 xl:w-56 text-left truncate">
              ${groupHtml}
            </div>
            <div></div>
          </div>
          <div></div>
        </td>
      `;

    return tr;
  };

  const isOnFirstPage = () => {
    const currentPageLink = document.querySelector(
      'nav[aria-label="pagination"] a[aria-current="page"]'
    );
    if (!currentPageLink) return true;

    const pageText = currentPageLink.textContent.trim();
    return pageText === "1";
  };

  const addChapterIcons = async (comicId, sources) => {
    const sourceChapters = {};

    for (const source of sources) {
      try {
        sourceChapters[source.source] = await getCachedChapters(
          source.url,
          source.source,
          comicId
        );
      } catch (err) {
        error(`Failed to fetch chapters for ${source.source}:`, err);
        sourceChapters[source.source] = [];
      }
    }

    const chapterRows = document.querySelectorAll(
      "table.table-fixed tbody tr:not(.aggregate-chapter-row)"
    );
    const existingChapterNumbers = new Set();

    chapterRows.forEach((row) => {
      const chapterNum = extractChapterNumber(row);
      if (chapterNum !== null) {
        existingChapterNumbers.add(chapterNum);
      }
    });

    const tbody = document.querySelector("table.table-fixed tbody");

    if (isOnFirstPage()) {
      const highestComickChapter =
        existingChapterNumbers.size > 0
          ? Math.max(...Array.from(existingChapterNumbers))
          : 0;

      const newChaptersMap = new Map();

      // Find chapters on alternative sources that aren't on Comick yet
      for (const [sourceName, chapters] of Object.entries(sourceChapters)) {
        for (const chapter of chapters) {
          if (
            chapter.number > highestComickChapter &&
            !existingChapterNumbers.has(chapter.number)
          ) {
            if (!newChaptersMap.has(chapter.number)) {
              newChaptersMap.set(chapter.number, []);
            }
            newChaptersMap.get(chapter.number).push({
              source: sourceName,
              chapter: chapter,
            });
          }
        }
      }

      if (tbody) {
        tbody
          .querySelectorAll(".aggregate-chapter-row")
          .forEach((row) => row.remove());

        const sortedNewChapters = Array.from(newChaptersMap.entries()).sort(
          (a, b) => b[0] - a[0]
        );

        const firstChapterRow = tbody.querySelector(
          "tr:not(.aggregate-chapter-row)"
        );

        for (const [chapterNum, sourcesWithChapter] of sortedNewChapters) {
          const newRow = createAggregateChapterRow(
            chapterNum,
            sourcesWithChapter
          );
          if (firstChapterRow) {
            tbody.insertBefore(newRow, firstChapterRow);
          } else {
            tbody.appendChild(newRow);
          }
        }
      }
    } else {
      if (tbody) {
        tbody
          .querySelectorAll(".aggregate-chapter-row")
          .forEach((row) => row.remove());
      }
    }

    chapterRows.forEach((row) => {
      const chapterNum = extractChapterNumber(row);
      if (chapterNum === null) return;

      const comickGroup = extractChapterGroup(row);

      const availableSources = [];
      for (const [sourceName, chapters] of Object.entries(sourceChapters)) {
        // Fuzzy match chapter numbers (handles 1 vs 1.0, etc.)
        const matchingChapters = chapters.filter(
          (ch) => Math.abs(ch.number - chapterNum) < 0.01
        );

        if (matchingChapters.length === 0) continue;

        // For sources that support group matching (like Comix), try to match by translator
        if (comickGroup && matchingChapters.some((ch) => ch.group)) {
          const groupMatchedChapter = matchingChapters.find(
            (ch) =>
              ch.group && fuzzyMatchGroupNames(ch.group.name, comickGroup.name)
          );

          if (groupMatchedChapter) {
            availableSources.push({
              source: sourceName,
              chapter: groupMatchedChapter,
            });
            continue;
          }
        }

        // If no group match or source doesn't support groups, use the first matching chapter
        availableSources.push({
          source: sourceName,
          chapter: matchingChapters[0],
        });
      }

      if (availableSources.length === 0) return;

      const titleCell = row.querySelector("td:first-child .truncate");
      if (!titleCell) return;

      const existingIcons = titleCell.querySelector(".source-icons");
      if (existingIcons) existingIcons.remove();

      const iconsContainer = document.createElement("span");
      iconsContainer.className = "source-icons ml-2";
      iconsContainer.innerHTML = availableSources
        .map(({ source, chapter }) => {
          const sourceInfo = getSourceInfo(source);
          const faviconUrl = sourceInfo
            ? getFaviconUrl(sourceInfo.baseUrl)
            : null;

          const groupInfo = chapter.group ? ` (${chapter.group.name})` : "";
          const titleText = `${source}${groupInfo} - Ch. ${chapter.number}`;

          if (faviconUrl) {
            return `
                  <a href="${chapter.url}" target="_blank"
                    class="inline-block w-5 h-5 ml-1 hover:opacity-75"
                    title="${titleText}">
                    <img src="${faviconUrl}" alt="${source}" class="w-full h-full rounded" />
                  </a>
                `;
          } else {
            return `
                  <a href="${chapter.url}" target="_blank"
                    class="inline-block w-5 h-5 rounded-full bg-blue-500 text-white text-xs leading-5 text-center ml-1 hover:bg-blue-600"
                    title="${titleText}">
                    ${source.charAt(0).toUpperCase()}
                  </a>
                `;
          }
        })
        .join("");

      titleCell.appendChild(iconsContainer);
    });
  };

  const handleChapterPage = async () => {
    const pathParts = window.location.pathname.split("/");
    const comicId = pathParts[2];
    const currentChapter = extractCurrentChapter();

    if (!currentChapter) return;

    const storedSources = getStoredSources(comicId);
    if (!storedSources || storedSources.length === 0) return;

    const infoContainer = document.querySelector(
      ".rounded-md.bg-gray-50.dark\\:bg-gray-900"
    );
    if (!infoContainer) return;

    if (infoContainer.querySelector(".alt-source-links-container")) return;

    const linksContainer = document.createElement("div");
    linksContainer.className =
      "mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 alt-source-links-container";
    linksContainer.innerHTML = `
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Read on alternative sources:</h4>
            <div id="alt-source-links" class="flex flex-wrap gap-2">
              <div class="flex items-center gap-2 text-sm text-gray-500">
                ${createLoadingSpinner("w-4 h-4")}
                <span>Loading alternative sources...</span>
              </div>
            </div>
          `;

    const buttonsDiv = infoContainer.querySelector(".flex.flex-col.gap-2");
    if (buttonsDiv) {
      buttonsDiv.parentNode.insertBefore(linksContainer, buttonsDiv);
    } else {
      infoContainer.appendChild(linksContainer);
    }

    const linksDiv = linksContainer.querySelector("#alt-source-links");
    const links = [];
    for (const source of storedSources) {
      try {
        const chapters = await getCachedChapters(
          source.url,
          source.source,
          comicId
        );
        const matchingChapter = chapters.find(
          (ch) => Math.abs(ch.number - currentChapter) < 0.01
        );

        if (matchingChapter) {
          links.push({
            source: source.source,
            url: matchingChapter.url,
            title: matchingChapter.title || `Chapter ${matchingChapter.number}`,
          });
        }
      } catch (err) {
        error(`Failed to fetch chapters for ${source.source}:`, err);
      }
    }

    if (links.length === 0) {
      linksDiv.innerHTML =
        '<p class="text-sm text-gray-500">No matching chapters found on alternative sources</p>';
      return;
    }

    linksDiv.innerHTML = links
      .map((link) => {
        const sourceInfo = getSourceInfo(link.source);
        const faviconUrl = sourceInfo
          ? getFaviconUrl(sourceInfo.baseUrl)
          : null;

        return `
              <a href="${link.url}" target="_blank" rel="noreferrer">
                <button type="button" class="rounded-md bg-blue-200 dark:bg-blue-900 px-2 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 flex items-center cursor-pointer gap-2">
                  ${
                    faviconUrl
                      ? `<img src="${faviconUrl}" alt="${link.source}" class="w-4 h-4" />`
                      : ""
                  }
                  <span>${link.source}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="w-4 h-4 shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
                  </svg>
                </button>
              </a>
            `;
      })
      .join("");
  };

  let currentUrl = window.location.href;
  let isInitialized = false;

  const init = async () => {
    if (!sourcesCache) {
      try {
        sourcesCache = await getSources();
      } catch (err) {
        error("Failed to load sources:", err);
        alert(
          "Failed to connect to the API. Please make sure the API server is running at " +
            API_BASE_URL
        );
        return;
      }
    }

    isInitialized = true;
    handlePageLoad();
  };

  const handlePageLoad = () => {
    if (isComicPage()) {
      setTimeout(() => handleComicPage(), 500);
    } else if (isChapterPage()) {
      setTimeout(() => handleChapterPage(), 500);
    } else {
      if (window.chapterListObserver) {
        window.chapterListObserver.disconnect();
        window.chapterListObserver = null;
      }
    }
  };

  const setupUrlChangeDetection = () => {
    setInterval(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        if (isInitialized) handlePageLoad();
      }
    }, 500);

    window.addEventListener("popstate", () => {
      if (isInitialized) handlePageLoad();
    });
  };

  const start = async () => {
    setupUrlChangeDetection();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      await init();
    }
  };

  start();
})();
