// ==UserScript==
// @name         Letterboxd Scarecrow Integration
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Check movie availability at Scarecrow Video from film pages
// @author       Bryant Durrell <durrell@innocence.com>
// @license      MIT
// @match        https://letterboxd.com/film/*
// @match        https://letterboxd.com/*/film/*
// @match        https://letterboxd.com/*/list/*
// @grant        GM_xmlhttpRequest
// @connect      api.zardoz.scarecrowvideo.org
// @downloadURL https://update.greasyfork.org/scripts/553982/Letterboxd%20Scarecrow%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/553982/Letterboxd%20Scarecrow%20Integration.meta.js
// ==/UserScript==



(function () {
  "use strict";

  // Configuration
  const DEBUG = false; // Set to true to enable console logging

  // Cache for storing search results during session
  const cache = new Map();

  // Scarecrow GraphQL API endpoint
  const SCARECROW_API = "https://api.zardoz.scarecrowvideo.org/graphql";

  // Detect page type based on URL pattern
  function getPageType() {
    const path = window.location.pathname;
    if (path.match(/^\/film\/[^/]+\/?$/)) {
      return "film";
    } else if (path.match(/^\/[^/]+\/film\/[^/]+\/?$/)) {
      return "review";
    } else if (path.match(/^\/[^/]+\/list\/[^/]+/)) {
      return "list";
    }
    return null; // Not a supported page
  }

  // GraphQL query
  const GRAPHQL_QUERY = `
        query LibrarySearchResultsQuery(
          $filters: RentalItemFilterInput
          $page: Int
          $limit: Int
          $order: RentalItemOrder
        ) {
          rentalItems(filters: $filters, page: $page, perPage: $limit, order: $order, webVisibility: ANY_VISIBLE) {
            __typename
            nodes {
              __typename
              id
              slug
              title
              supplementaryTitle
              sku
              numberOfDiscs
              currentState
              storeSection {
                title
                id
              }
              format {
                title
                id
              }
              ownFormat {
                title
                id
              }
              release {
                additionalInfo
                numberOfDiscs
                runtime
                year {
                  __typename
                  ... on MultipleReleaseYear {
                    minYear
                    maxYear
                  }
                  ... on SingleReleaseYear {
                    year
                  }
                }
                rating {
                  title
                  id
                }
                primaryLanguage {
                  language {
                    name
                    id
                  }
                  id
                }
                format {
                  title
                  id
                }
                region {
                  title
                  identifier
                  id
                }
                flags {
                  pal
                }
                collection {
                  title
                  id
                }
              }
              cartRentability {
                mail {
                  allowed
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              page
              pageCount
            }
          }
          globalConfiguration {
            rentalByMailDiscLimit
            id
          }
        }
    `;

  // Extract title from page title based on page type
  function extractTitleFromPageTitle(pageType) {
    const title = document.title;

    if (pageType === "film") {
      const match = title.match(
        /^([^(]+) \(\d{4}\) directed by .+ • .+ • Letterboxd$/,
      );
      return match ? match[1].trim() : null;
    } else if (pageType === "review") {
      const match = title.match(/^['"]([^'"]+)['"] review by .+ • Letterboxd$/);
      return match ? match[1] : null;
    }

    return null;
  }

  // Extract movie data from Letterboxd page
  function extractMovieData() {
    const pageType = getPageType();
    if (!pageType) return null;

    // Get title using page-type-specific extraction
    let title = extractTitleFromPageTitle(pageType);

    // Fallback to DOM extraction if page title parsing fails
    if (!title) {
      if (pageType === "film") {
        const titleElement = document.querySelector("h1.headline-1");
        title = titleElement ? titleElement.textContent.trim() : null;
      } else if (pageType === "review") {
        const titleElement = document.querySelector("h2");
        title = titleElement ? titleElement.textContent.trim() : null;
      }
    }

    // Get year from page content
    let year = null;

    // Primary: look for the releasedate span
    const releaseDateElement = document.querySelector("span.releasedate a");
    if (releaseDateElement) {
      const yearText = releaseDateElement.textContent.trim();
      const yearNum = parseInt(yearText);
      if (
        yearNum &&
        yearNum >= 1900 &&
        yearNum <= new Date().getFullYear() + 5
      ) {
        year = yearNum;
      }
    }

    // Fallback 1: look for year in page title
    if (!year && (pageType === "film" || pageType === "review")) {
      const titleMatch = document.title.match(/\((\d{4})\)/);
      if (titleMatch) {
        const yearNum = parseInt(titleMatch[1]);
        if (yearNum >= 1900 && yearNum <= new Date().getFullYear() + 5) {
          year = yearNum;
        }
      }
    }

    // Get director from the page - only attempt on film pages where reliable
    let director = null;
    if (pageType === "film") {
      const directorLinks = document.querySelectorAll('a[href*="/director/"]');
      if (directorLinks.length > 0) {
        director = directorLinks[0].textContent.trim();
      } else {
        // Fallback: look for "Directed by" text
        const directedByText = document.querySelector(
          'p:contains("Directed by")',
        );
        if (directedByText) {
          const directorMatch =
            directedByText.textContent.match(/Directed by ([^,]+)/);
          if (directorMatch) director = directorMatch[1].trim();
        }
      }
    }
    // For review pages, we don't attempt director extraction since it's unreliable

    return { title, year, director, pageType };
  }

  // Extract movie data from poster element (for list pages)
  function extractMovieDataFromPoster(posterElement) {
    if (DEBUG) {
      console.log("🎬 Extracting data from poster element:", posterElement);
    }

    // Look for the react-component div as immediate child
    const reactComponent = posterElement.querySelector('div.react-component');
    
    if (!reactComponent) {
      if (DEBUG) console.log("🎬 No react-component found");
      return { title: null, year: null, director: null, pageType: "list" };
    }

    // Extract title and year from data-item-name
    const itemName = reactComponent.getAttribute("data-item-name");
    if (!itemName) {
      if (DEBUG) console.log("🎬 No data-item-name found");
      return { title: null, year: null, director: null, pageType: "list" };
    }

    if (DEBUG) console.log("🎬 data-item-name:", itemName);

    // Parse "Title (Year)" format
    const yearMatch = itemName.match(/\((\d{4})\)$/);
    let title = itemName;
    let year = null;
    
    if (yearMatch) {
      year = parseInt(yearMatch[1]);
      title = itemName.replace(/\s*\(\d{4}\)$/, '').trim();
    }

    if (DEBUG) {
      console.log("🎬 Extracted data:", { title, year });
    }

    return { title, year, director: null, pageType: "list" };
  }

  // Make GraphQL request to Scarecrow API
  function searchScarecrow(title, year, director) {
    return new Promise((resolve, reject) => {
      const cacheKey = `${title}-${year}-${director}`;

      // Check cache first
      if (cache.has(cacheKey)) {
        resolve(cache.get(cacheKey));
        return;
      }

      // Build search filters
      const filters = {
        damaged: false,
        q: title,
      };

      // Add year range filter (±1 year)
      if (year) {
        filters.releaseYear = {
          range: {
            min: year - 1,
            max: year + 1,
          },
        };
      }

      // Add director filter if available
      if (director) {
        const directorLastName = director.split(" ").pop();
        // Note: We'll filter by director post-query since we're using store sections
      }

      const variables = {
        filters: filters,
        page: 1,
        limit: 20,
        order: "TITLE_ASCENDING",
      };

      GM_xmlhttpRequest({
        method: "POST",
        url: SCARECROW_API,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        data: JSON.stringify({
          query: GRAPHQL_QUERY,
          variables: variables,
        }),
        onload: function (response) {
          try {
            if (response.status !== 200) {
              reject(
                new Error(`HTTP ${response.status}: ${response.statusText}`),
              );
              return;
            }

            const data = JSON.parse(response.responseText);
            if (data.errors) {
              reject(
                new Error("GraphQL errors: " + JSON.stringify(data.errors)),
              );
              return;
            }

            const results = processSearchResults(data.data, director);
            cache.set(cacheKey, results);
            resolve(results);
          } catch (error) {
            reject(new Error("Failed to parse response: " + error.message));
          }
        },
        onerror: function (error) {
          reject(new Error("Network request failed"));
        },
        ontimeout: function () {
          reject(new Error("Request timed out"));
        },
        timeout: 10000,
      });
    });
  }

  // Process search results - filter by director and prioritize formats
  function processSearchResults(data, director) {
    if (!data.rentalItems || !data.rentalItems.nodes) {
      return null;
    }

    let items = data.rentalItems.nodes;
    if (DEBUG) {
      console.log("🔍 Initial search results:", items.length, "items");
      console.log(
        "📋 All formats found:",
        items.map((item) => ({
          title: item.title,
          format: item.format?.title,
          section: item.storeSection?.title,
          status: item.currentState,
        })),
      );
    }

    // Store unfiltered results before director filtering
    const unfilteredItems = [...items];

    // Filter by director if specified
    if (director) {
      const directorLastName = director.split(" ").pop().toUpperCase();
      if (DEBUG) console.log("🎭 Filtering by director:", directorLastName);

      const filteredByDirector = items.filter((item) => {
        const storeSection = item.storeSection?.title || "";
        return storeSection.toUpperCase().startsWith(directorLastName);
      });

      if (filteredByDirector.length > 0) {
        items = filteredByDirector;
        if (DEBUG)
          console.log("🎭 After director filter:", items.length, "items");
      } else {
        // Fallback to unfiltered results if director filtering yields nothing
        items = unfilteredItems;
        if (DEBUG)
          console.log(
            "🔄 Director filter found no matches, falling back to unfiltered results:",
            items.length,
            "items",
          );
      }
    }

    if (items.length === 0) {
      return null;
    }

    // Filter to only desirable formats (exclude VHS, etc.)
    const filteredItems = items.filter((item) => {
      const format = item.format?.title || "";
      // Accept formats that contain BLU-RAY, 4K, DVD, or DIGITAL
      return (
        format.includes("BLU-RAY") ||
        format.includes("4K") ||
        format.includes("DVD") ||
        format.includes("DIGITAL")
      );
    });

    if (DEBUG) {
      console.log("💿 After format filter:", filteredItems.length, "items");
      console.log(
        "💿 Desirable formats found:",
        filteredItems.map((item) => ({
          title: item.title,
          format: item.format?.title,
          status: item.currentState,
        })),
      );
    }

    if (filteredItems.length === 0) {
      return null; // No desirable formats found
    }

    // Prioritize formats: 4K/BLU-RAY combos > BLU-RAY > DVD > DIGITAL
    function getFormatPriority(format) {
      if (format.includes("4K")) return 5; // Highest for any 4K
      if (format.includes("BLU-RAY")) return 4; // Blu-ray (including combos)
      if (format.includes("DVD")) return 2;
      if (format.includes("DIGITAL")) return 1;
      return 0;
    }

    filteredItems.sort((a, b) => {
      const formatA = a.format?.title || "";
      const formatB = b.format?.title || "";
      const priorityA = getFormatPriority(formatA);
      const priorityB = getFormatPriority(formatB);
      return priorityB - priorityA; // Higher priority first
    });

    if (DEBUG) {
      console.log(
        "🏆 After sorting by priority:",
        filteredItems.map((item) => ({
          title: item.title,
          format: item.format?.title,
          priority: getFormatPriority(item.format?.title || ""),
        })),
      );

      console.log("✅ Selected result:", {
        title: filteredItems[0].title,
        format: filteredItems[0].format?.title,
        status: filteredItems[0].currentState,
      });
    }

    // Return the best available format
    return filteredItems[0];
  }

  // Create and show popup with results
  function showResultsPopup(movieData, searchResult) {
    // Remove existing popup if any
    const existingPopup = document.getElementById("scarecrow-popup");
    if (existingPopup) existingPopup.remove();

    // Create popup container (overlay)
    const popup = document.createElement("div");
    popup.id = "scarecrow-popup";
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border: 2px solid #00e054;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      color: #333;
    `;

    // Build content safely with DOM APIs (no innerHTML)
    const contentBox = document.createElement("div");
    contentBox.style.cssText =
      "padding: 20px; position: relative; max-width: 520px;";

    const heading = document.createElement("h3");
    heading.style.marginTop = "0";

    if (searchResult) {
      heading.style.color = "#00e054";
      heading.textContent = "✓ Found at Scarecrow Video";
      contentBox.appendChild(heading);

      const year =
        searchResult.release?.year?.year ||
        (searchResult.release?.year?.minYear &&
        searchResult.release?.year?.maxYear
          ? `${searchResult.release.year.minYear}-${searchResult.release.year.maxYear}`
          : "Unknown");
      const format = searchResult.format?.title || "Unknown format";

      const titleLine = document.createElement("div");
      titleLine.style.margin = "10px 0";
      const strong = document.createElement("strong");
      strong.textContent = String(searchResult.title || "");
      titleLine.appendChild(strong);
      titleLine.appendChild(document.createTextNode(` (${year}) [${format}]`));
      contentBox.appendChild(titleLine);

      const status = searchResult.currentState
        ? String(searchResult.currentState)
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (l) => l.toUpperCase())
        : "Unknown";
      const statusLine = document.createElement("div");
      statusLine.style.margin = "5px 0";
      statusLine.appendChild(document.createTextNode("Status: "));
      const statusSpan = document.createElement("span");
      statusSpan.style.fontWeight = "bold";
      statusSpan.style.color = status === "Available" ? "#00e054" : "#ff6b35";
      statusSpan.textContent = status;
      statusLine.appendChild(statusSpan);
      contentBox.appendChild(statusLine);

      const section = searchResult.storeSection?.title || "Unknown";
      const sectionLine = document.createElement("div");
      sectionLine.style.margin = "5px 0";
      sectionLine.textContent = `Section: ${section}`;
      contentBox.appendChild(sectionLine);

      // Secure outbound link: opens new tab without access to window.opener,
      // and avoids leaking the Letterboxd URL via Referer header.
      const buttonWrap = document.createElement("div");
      buttonWrap.style.margin = "15px 0";
      const link = document.createElement("a");
      const rawSlug = String(searchResult.slug || "");
      const safeSlug = encodeURIComponent(rawSlug).replace(/%2F/g, "/"); // preserve path separators if present
      link.href = `https://scarecrowvideo.org/library/rentalItem/${safeSlug}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("referrerpolicy", "no-referrer");
      link.style.cssText =
        "background: #00e054; color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; display: inline-block;";
      link.textContent = "View at Scarecrow";
      buttonWrap.appendChild(link);
      contentBox.appendChild(buttonWrap);
    } else {
      heading.style.color = "#ff6b35";
      heading.textContent = "Not found at Scarecrow Video";
      contentBox.appendChild(heading);

      const displayYear = movieData.year ? movieData.year : "Year unknown";
      const info = document.createElement("div");
      info.style.margin = "10px 0";
      const strong = document.createElement("strong");
      strong.textContent = String(movieData.title || "");
      info.appendChild(strong);
      info.appendChild(document.createTextNode(` (${displayYear})`));
      contentBox.appendChild(info);

      const note = document.createElement("div");
      note.textContent =
        "This title doesn't appear to be available in their current inventory.";
      contentBox.appendChild(note);
    }

    // Close button (no innerHTML)
    const closeBtn = document.createElement("button");
    closeBtn.id = "scarecrow-close";
    closeBtn.type = "button";
    closeBtn.textContent = "×";
    closeBtn.style.cssText =
      "position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 20px; cursor: pointer; color: #666;";
    contentBox.appendChild(closeBtn);

    popup.appendChild(contentBox);

    // Close handlers
    closeBtn.addEventListener("click", () => popup.remove());
    popup.addEventListener("click", (e) => {
      if (e.target === popup) popup.remove();
    });

    document.body.appendChild(popup);
  }

  // Try to add button to standard actions panel (film pages)
  function tryStandardActionsPanel() {
    const actionsPanel = document.querySelector("ul.js-actions-panel");
    if (!actionsPanel) return false;

    // Find the Share li element to insert after it
    const shareElement = actionsPanel.querySelector(
      "li.panel-sharing, li.sharing-toggle",
    );

    // Create the Scarecrow list item
    const scarecrowLi = document.createElement("li");
    const scarecrowLink = document.createElement("a");

    scarecrowLink.href = "#";
    scarecrowLink.textContent = "Scarecrow";
    scarecrowLink.id = "scarecrow-check-link";

    // Prevent default link behavior
    scarecrowLink.addEventListener("click", function (e) {
      e.preventDefault();
    });

    scarecrowLi.appendChild(scarecrowLink);

    // Insert after the Share element, or at the end if Share not found
    if (shareElement && shareElement.nextSibling) {
      actionsPanel.insertBefore(scarecrowLi, shareElement.nextSibling);
    } else if (shareElement) {
      actionsPanel.appendChild(scarecrowLi);
    } else {
      actionsPanel.appendChild(scarecrowLi);
    }

    // Add the search functionality to the link
    addSearchFunctionality(scarecrowLink);
    return true;
  }

  // Try to add button to review page specific location
  function tryReviewPagePlacement() {
    // Look for review-specific elements to place the button near
    const reviewHeader = document.querySelector(".review-header, .film-header");
    if (reviewHeader) {
      // Create a simple button near the review
      const scarecrowButton = document.createElement("button");
      scarecrowButton.textContent = "Scarecrow";
      scarecrowButton.id = "scarecrow-check-link";
      scarecrowButton.style.cssText = `
                margin: 10px 0;
                background: #00e054;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 14px;
            `;

      reviewHeader.insertAdjacentElement("afterend", scarecrowButton);
      addSearchFunctionality(scarecrowButton);
      return true;
    }
    return false;
  }

  // Add Scarecrow button to popup menu (for list pages)
  function addScarecrowToPopupMenu(popupMenuElement) {
    if (DEBUG) {
      console.log("🎬 Adding Scarecrow to popup menu:", popupMenuElement);
    }
    
    // Check if we already added the button
    if (popupMenuElement.querySelector(".scarecrow-menu-item")) {
      if (DEBUG) {
        console.log("⚠️ Scarecrow button already exists in this popup menu");
      }
      return;
    }

    // Find the ul element in the popup
    const menuList = popupMenuElement.querySelector("ul");
    if (!menuList) return;

    // Create the Scarecrow menu item matching existing format
    const scarecrowItem = document.createElement("li");
    scarecrowItem.className = "popmenu-textitem -centered";

    const scarecrowButton = document.createElement("button");
    scarecrowButton.type = "button";
    scarecrowButton.textContent = "Scarecrow";
    scarecrowButton.className = "scarecrow-menu-item";

    scarecrowItem.appendChild(scarecrowButton);

    // Insert at the bottom of the menu (after "Change backdrop..." if it exists)
    menuList.appendChild(scarecrowItem);

    // Add click handler
    scarecrowButton.addEventListener("click", async function () {
      const originalText = this.textContent;
      this.textContent = "Searching...";
      this.disabled = true;

      try {
        // Find the associated poster element
        const posterElement = findAssociatedPoster(popupMenuElement);
        if (!posterElement) {
          throw new Error("Could not find associated movie poster");
        }

        const movieData = extractMovieDataFromPoster(posterElement);
        if (!movieData.title) {
          throw new Error("Could not extract movie title");
        }

        const searchResult = await searchScarecrow(
          movieData.title,
          movieData.year,
          movieData.director,
        );
        showResultsPopup(movieData, searchResult);

        // Close the popup menu by simulating a click outside
        // This should properly reset Letterboxd's menu state
        document.body.click();
      } catch (error) {
        alert("Error searching Scarecrow Video: " + error.message);
      } finally {
        this.textContent = originalText;
        this.disabled = false;
      }
    });
  }

  // Store reference to the poster that triggered the current popup
  let currentTriggeringPoster = null;

  // Find the poster element associated with a popup menu
  function findAssociatedPoster(popupMenuElement) {
    // Return the tracked poster or null if we can't identify it
    return currentTriggeringPoster;
  }

  // Set up observer for popup menus on list pages
  function setupListPageObserver() {
    // Listen for clicks on poster menu buttons to track which poster triggered the popup
    document.addEventListener("click", function (event) {
      // Try multiple possible selectors for menu buttons
      const menuButton = event.target.closest(".menu-link") || 
                         event.target.closest(".poster-menu") ||
                         event.target.closest("[data-target-menu]") ||
                         event.target.closest("button[class*='menu']") ||
                         event.target.closest("a[class*='menu']");
                         
      if (menuButton) {
        // Look for the posteritem container
        const posterContainer = menuButton.closest("li.posteritem");
                               
        if (posterContainer) {
          currentTriggeringPoster = posterContainer;
        }
      }
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if this is a poster popup menu
            if (node.classList && node.classList.contains("poster-popmenu")) {
              addScarecrowToPopupMenu(node);
            }
            // Also check child elements in case the menu is nested
            const popupMenus =
              node.querySelectorAll && node.querySelectorAll(".poster-popmenu");
            if (popupMenus) {
              popupMenus.forEach((menu) => addScarecrowToPopupMenu(menu));
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return observer;
  }

  // Add Scarecrow link to the page with page-type awareness
  function addScarecrowButton() {
    // Check if link already exists to prevent duplicates
    if (document.getElementById("scarecrow-check-link")) {
      return;
    }

    const pageType = getPageType();

    if (pageType === "film") {
      // Use standard actions panel for film pages
      if (!tryStandardActionsPanel()) {
        addScarecrowButtonFallback();
      }
    } else if (pageType === "review") {
      // Try review-specific placement, then fallbacks
      if (!tryReviewPagePlacement() && !tryStandardActionsPanel()) {
        addScarecrowButtonFallback();
      }
    } else if (pageType === "list") {
      // For list pages, we don't add a button directly
      // Instead, we set up the observer to inject into popup menus
      // This is handled in the init() function
    } else {
      // Unknown page type, use fallback
      addScarecrowButtonFallback();
    }
  }

  // Fallback method for when actions panel isn't found
  function addScarecrowButtonFallback() {
    // Create a simple floating button as fallback
    const scarecrowButton = document.createElement("button");
    scarecrowButton.textContent = "Scarecrow";
    scarecrowButton.id = "scarecrow-check-link";
    scarecrowButton.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: #00e054 !important;
            color: white !important;
            border: none !important;
            padding: 10px 16px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            font-size: 14px !important;
            z-index: 10000 !important;
        `;

    document.body.appendChild(scarecrowButton);
    addSearchFunctionality(scarecrowButton);
  }

  // Add search functionality to the element
  function addSearchFunctionality(element) {
    element.addEventListener("click", async function () {
      const originalText = this.textContent;
      this.textContent = "Searching...";

      // Disable the element temporarily
      this.style.pointerEvents = "none";
      this.style.opacity = "0.6";

      try {
        const movieData = extractMovieData();

        if (!movieData.title) {
          throw new Error("Could not extract movie title from page");
        }

        const searchResult = await searchScarecrow(
          movieData.title,
          movieData.year,
          movieData.director,
        );
        showResultsPopup(movieData, searchResult);
      } catch (error) {
        alert("Error searching Scarecrow Video: " + error.message);
      } finally {
        this.textContent = originalText;
        this.style.pointerEvents = "";
        this.style.opacity = "";
      }
    });
  }

  // Initialize the script
  function init() {
    const pageType = getPageType();
    if (!pageType) return; // Not a supported page

    // Set up list page observer if we're on a list page
    if (pageType === "list") {
      setupListPageObserver();
    }

    // For film and review pages, add buttons as before
    function tryAddButton() {
      const currentPageType = getPageType();
      if (currentPageType && currentPageType !== "list") {
        addScarecrowButton();
      }
    }

    // Wait for page to load
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", tryAddButton);
    } else {
      tryAddButton();
    }

    // Also try after a short delay in case of dynamic loading
    setTimeout(tryAddButton, 2000);

    // Watch for navigation changes (Letterboxd uses client-side routing)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        // Clear any existing link first
        const existingLink = document.getElementById("scarecrow-check-link");
        if (existingLink) {
          // Remove the element and its container if it's a list item
          const container = existingLink.closest("li") || existingLink;
          container.remove();
        }

        // Check if we need to set up list page observer
        const newPageType = getPageType();
        if (newPageType === "list") {
          setupListPageObserver();
        } else if (newPageType) {
          setTimeout(tryAddButton, 1500);
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }

  init();


  // Empty shared section at end to ensure proper closing
})();
