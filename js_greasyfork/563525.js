// ==UserScript==
// @name         nhentai Language Filter
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Adds quick language filters (English, Japanese, Chinese) to nhentai pages
// @author       Snow2122
// @icon         https://nhentai.net/favicon.ico
// @include      /https:\/\/nhentai\.net\/(parody|favorites|artist|tag|group|category|search)\/.*/
// @include      https://nhentai.net/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563525/nhentai%20Language%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/563525/nhentai%20Language%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ============================================
  // CONFIGURATION
  // ============================================
  const LANGUAGES = [
    { code: "english", label: "English", shortLabel: "EN", flag: "🇬🇧" },
    { code: "japanese", label: "Japanese", shortLabel: "JP", flag: "🇯🇵" },
    { code: "chinese", label: "Chinese", shortLabel: "CN", flag: "🇨🇳" },
  ];

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  function getPathname() {
    return window.location.pathname;
  }

  function getNamespaceQuery() {
    return window.location.pathname.split("/")[2] || "";
  }

  function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  function hasLanguageFilter(query, langCode) {
    const regex = new RegExp(`language:${langCode}`, "i");
    return regex.test(query);
  }

  /**
   * Create a language filter link matching the reference style
   * Uses the same "sort-type" class as existing sort options
   */
  function createLanguageLink(lang, baseQuery, isNamespace = true) {
    let searchUrl;

    if (isNamespace) {
      // For namespace pages (tag, artist, group, etc.)
      searchUrl = `https://nhentai.net/search/?q=${encodeURIComponent(baseQuery)}+language:${lang.code}`;
    } else {
      // For search pages - replace existing language filter
      let cleanQuery = baseQuery
        .replace(/\s*language:(english|japanese|chinese)\s*/gi, " ")
        .trim();

      const newQuery = cleanQuery
        ? `${cleanQuery} language:${lang.code}`
        : `language:${lang.code}`;

      searchUrl = `https://nhentai.net/search/?q=${encodeURIComponent(newQuery)}`;
    }

    // Create element matching the existing sort-type style
    const div = document.createElement("div");
    div.className = "sort-type";

    const link = document.createElement("a");
    link.href = searchUrl;
    link.textContent = `${lang.label} Only`;
    link.title = `Show ${lang.label} only`;

    div.appendChild(link);
    return div;
  }

  /**
   * Create "ALL" reset link for namespace and search pages
   */
  function createAllLink(query, pageType) {
    let resetUrl;

    if (pageType === "namespace") {
      // For namespace pages, go back to the original page
      resetUrl = window.location.origin + window.location.pathname;
    } else if (pageType === "search") {
      // For search pages, remove language filter from query
      let cleanQuery = query
        .replace(/\s*language:(english|japanese|chinese)\s*/gi, " ")
        .trim();
      resetUrl = cleanQuery
        ? `https://nhentai.net/search/?q=${encodeURIComponent(cleanQuery)}`
        : "https://nhentai.net/";
    }

    const div = document.createElement("div");
    div.className = "sort-type";

    const link = document.createElement("a");
    link.href = resetUrl;
    link.textContent = "All";
    link.title = "Show all languages";

    div.appendChild(link);
    return div;
  }

  /**
   * Create "ALL" reset button for favorites page
   */
  function createAllFavoritesButton(currentQuery) {
    // Remove any existing language filters from the query
    let cleanQuery = currentQuery
      .replace(/\s*language:(english|japanese|chinese)\s*/gi, " ")
      .trim();

    const searchUrl = cleanQuery
      ? `https://nhentai.net/favorites/?q=${encodeURIComponent(cleanQuery)}`
      : "https://nhentai.net/favorites/";

    const link = document.createElement("a");
    link.className = "btn btn-primary";
    link.href = searchUrl;
    link.title = "Show All Languages";
    link.innerHTML = `<i class="fa fa-globe"></i> ALL`;
    link.style.marginLeft = "5px";

    return link;
  }

  /**
   * Create favorites button matching reference style
   */
  function createFavoritesButton(lang, currentQuery) {
    // Remove any existing language filters from the query
    let cleanQuery = currentQuery
      .replace(/\s*language:(english|japanese|chinese)\s*/gi, " ")
      .trim();

    const newQuery = cleanQuery
      ? `language:${lang.code} ${cleanQuery}`
      : `language:${lang.code}`;

    const searchUrl = `https://nhentai.net/favorites/?q=${encodeURIComponent(newQuery)}`;

    const link = document.createElement("a");
    link.className = "btn btn-primary";
    link.href = searchUrl;
    link.title = `${lang.label} Only`;
    link.innerHTML = `<i class="fa fa-flag"></i> ${lang.shortLabel}`;
    link.style.marginLeft = "5px";

    return link;
  }

  // ============================================
  // MAIN LOGIC
  // ============================================

  function init() {
    const pathname = getPathname();
    const namespaceQuery = getNamespaceQuery();
    const searchQuery = getSearchQuery();

    // Handle different page types
    if (/\/(artist|tag|group|category|parody)\//.test(pathname)) {
      handleNamespacePage(namespaceQuery);
    } else if (/\/search\//.test(pathname)) {
      handleSearchPage(searchQuery);
    } else if (/\/favorites\//.test(pathname)) {
      handleFavoritesPage(searchQuery);
    } else if (pathname === "/") {
      handleHomepage();
    }
  }

  /**
   * Handle namespace pages (tag, artist, group, parody, category)
   * Adds language filter links inline with existing sort options
   */
  function handleNamespacePage(namespaceQuery) {
    const sortContainer = document.getElementsByClassName("sort")[0];
    if (!sortContainer) return;

    // Add language filter links directly to the sort container (inline)
    LANGUAGES.forEach((lang) => {
      const linkElement = createLanguageLink(lang, namespaceQuery, true);
      sortContainer.appendChild(linkElement);
    });

    // Add "ALL" reset option
    const allLink = createAllLink(namespaceQuery, "namespace");
    sortContainer.appendChild(allLink);
  }

  /**
   * Handle search results page
   * Adds language filter links inline with existing sort options
   */
  function handleSearchPage(searchQuery) {
    const sortContainer = document.getElementsByClassName("sort")[0];
    if (!sortContainer) return;

    // Check which language (if any) is currently active
    const activeLanguage = LANGUAGES.find((lang) =>
      hasLanguageFilter(searchQuery, lang.code),
    );

    // Add language filter links directly to the sort container (inline)
    LANGUAGES.forEach((lang) => {
      const linkElement = createLanguageLink(lang, searchQuery, false);

      // Highlight active filter
      if (activeLanguage && activeLanguage.code === lang.code) {
        linkElement.querySelector("a").style.color = "#ed2553";
        linkElement.querySelector("a").style.fontWeight = "bold";
      }

      sortContainer.appendChild(linkElement);
    });

    // Add "ALL" reset option
    const allLink = createAllLink(searchQuery, "search");
    // Highlight if no language filter is active
    if (!activeLanguage) {
      allLink.querySelector("a").style.color = "#ed2553";
      allLink.querySelector("a").style.fontWeight = "bold";
    }
    sortContainer.appendChild(allLink);
  }

  /**
   * Handle favorites page
   * Adds language filter buttons after the random button
   */
  function handleFavoritesPage(searchQuery) {
    const randomButton = document.getElementById("favorites-random-button");
    if (!randomButton) return;

    // Add "ALL" reset button first (will appear last due to insertAdjacentElement)
    const allBtn = createAllFavoritesButton(searchQuery);
    randomButton.insertAdjacentElement("afterend", allBtn);

    // Add language filter buttons after random button
    LANGUAGES.forEach((lang) => {
      const btn = createFavoritesButton(lang, searchQuery);
      randomButton.insertAdjacentElement("afterend", btn);
    });
  }

  /**
   * Handle homepage - add quick filter links to navigation
   */
  function handleHomepage() {
    const menuContainer =
      document.querySelector(".menu.right") || document.querySelector(".menu");
    if (!menuContainer) return;

    // Create dropdown menu item
    const container = document.createElement("li");
    container.innerHTML = `
            <a href="#" style="position: relative;">
                🌐 Language <i class="fa fa-caret-down"></i>
            </a>
        `;

    const dropdown = document.createElement("ul");
    dropdown.style.cssText = `
            display: none;
            position: absolute;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 5px 0;
            min-width: 140px;
            z-index: 1000;
            list-style: none;
            margin: 0;
        `;

    LANGUAGES.forEach((lang) => {
      const li = document.createElement("li");
      li.innerHTML = `
                <a href="https://nhentai.net/search/?q=language:${lang.code}" 
                   style="display: block; padding: 8px 15px; color: #fff; text-decoration: none;">
                    ${lang.flag} ${lang.label}
                </a>
            `;
      li.querySelector("a").addEventListener("mouseenter", function () {
        this.style.background = "rgba(237, 37, 83, 0.2)";
      });
      li.querySelector("a").addEventListener("mouseleave", function () {
        this.style.background = "transparent";
      });
      dropdown.appendChild(li);
    });

    // Add "ALL" option to homepage dropdown
    const allLi = document.createElement("li");
    allLi.innerHTML = `
            <a href="https://nhentai.net/" 
               style="display: block; padding: 8px 15px; color: #fff; text-decoration: none; border-top: 1px solid #333;">
                🌍 All
            </a>
        `;
    allLi.querySelector("a").addEventListener("mouseenter", function () {
      this.style.background = "rgba(237, 37, 83, 0.2)";
    });
    allLi.querySelector("a").addEventListener("mouseleave", function () {
      this.style.background = "transparent";
    });
    dropdown.appendChild(allLi);

    container.appendChild(dropdown);

    // Toggle dropdown on hover
    container.addEventListener("mouseenter", () => {
      dropdown.style.display = "block";
    });
    container.addEventListener("mouseleave", () => {
      dropdown.style.display = "none";
    });

    container.querySelector("a").addEventListener("click", (e) => {
      e.preventDefault();
    });

    menuContainer.appendChild(container);
  }

  // Run initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
