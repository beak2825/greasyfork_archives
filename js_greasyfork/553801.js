// ==UserScript==
// @name         Neopets: Better Book Highlighter V5.0 (Documented)
// @version      5.0
// @description  Identifies and highlights read books across Neopets.
// @namespace    https://git.gay/valkyrie1248/Neopets-Userscripts
// @author       valkryie1248 (refactored with Gemini)
// @license      MIT
// @match        https://www.neopets.com/objects.phtml?type=shop&obj_type=7
// @match        https://www.neopets.com/objects.phtml?obj_type=7&type=shop
// @match        https://www.neopets.com/objects.phtml?*obj_type=38*
// @match        https://www.neopets.com/objects.phtml?*obj_type=51*
// @match        https://www.neopets.com/objects.phtml?*obj_type=70*
// @match        https://www.neopets.com/objects.phtml?*obj_type=77*
// @match        https://www.neopets.com/objects.phtml?*obj_type=92*
// @match        https://www.neopets.com/objects.phtml?*obj_type=106*
// @match        https://www.neopets.com/objects.phtml?*obj_type=112*
// @match        https://www.neopets.com/objects.phtml?*obj_type=114*
// @match        https://www.neopets.com/books_read.phtml?pet_name=*
// @match        https://www.neopets.com/moon/books_read.phtml?pet_name=*
// @match        https://www.neopets.com/browseshop.phtml*
// @match        https://www.neopets.com/safetydeposit.phtml*
// @match        https://www.neopets.com/halloween/garage*
// @match        https://www.neopets.com/inventory*
// @match        https://www.neopets.com/quickstock.phtml*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553801/Neopets%3A%20Better%20Book%20Highlighter%20V50%20%28Documented%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553801/Neopets%3A%20Better%20Book%20Highlighter%20V50%20%28Documented%29.meta.js
// ==/UserScript==

/**
 * Better Book Highlighter V5 Architecture
 * ---------------------------------------
 * This userscript employs a modular "Scanner-Matcher-Renderer" architecture designed for resilience
 * against the old and new website structures of Neopets.
 *
 * Core Components:
 * 1. StateManager: Handles data I/O, sanitization, and business logic (Read vs Wishlist).
 * 2. BaseModule: Orchestrates the execution loop, mutation observers, and debouncing.
 * 3. Concrete Modules (InventoryModule, ShopModule, etc.): Implement specific DOM traversal strategies.
 * 4. DashboardUI: Renders the persistent status overlay.
 */

(() => {
  try {
    /* ---------------------- LOGGER UTILITY ----------------------- */

    /**
     * Usage: Logger.info("Component", "Message");
     */
    const Logger = {
      debug: (component, message) =>
        console.debug(`%c[BBH] [${component}] ${message}`, "color: #999"),
      info: (component, message) =>
        console.info(`%c[BBH] [${component}] ${message}`, "color: #00bcd4"),
      warn: (component, message) =>
        console.warn(`%c[BBH] [${component}] ${message}`, "color: #ff9800"),
      error: (component, message) =>
        console.error(`%c[BBH] [${component}] ${message}`, "color: #ff5252"),
    };

    /* ---------------------- CONSTANTS & STYLES ----------------------- */

    const READ_LIST_KEY_PREFIX = "neopets_book_readlist_";
    const WISHLIST_KEY = "neopets_book_wishlist_ids";
    const VISUAL_PREF_KEY = "neopets_book_visual_style";

    /**
     * CSS Definitions.
     * Injected into the document head at runtime.
     * Classes are toggled on elements as needed.
     */

    // New Bold Style: High visibility, uses a "READ" pseudo-element stamp.
    const STYLES_BOLD = `
            .bbh-read { position: relative; background-color: #fff5f5 !important; }
            .bbh-read img, .bbh-read .item-img { opacity: 0.3 !important; filter: grayscale(100%) !important; transition: opacity 0.2s; }
            .bbh-read, .bbh-read a, .bbh-read b, .bbh-read strong, .bbh-read td { color: #bbb !important; font-weight: normal !important; }
            .bbh-read::after {
                content: "READ"; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg);
                font-family: "Arial Black", Gadget, sans-serif; font-weight: 900; font-size: 26px; letter-spacing: 2px;
                color: #ff0000; text-shadow: 2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
                pointer-events: none; z-index: 100; opacity: 1.0 !important;
            }
        `;

    // Classic Style: Subdued, uses strikethrough text and blue tint.
    const STYLES_CLASSIC = `
            .bbh-read {
                background-color: rgba(0,255,255,0.6) !important;
                opacity: 0.8 !important;
                position: relative;
            }
            .bbh-read img, .bbh-read .item-img {
                opacity: 0.7 !important;
            }
            .bbh-read, .bbh-read a, .bbh-read b, .bbh-read strong, .bbh-read td {
                text-decoration: line-through !important;
                color: #555 !important;
            }
            .bbh-read::after { content: none !important; }
        `;

    const STYLES_SHARED = `
            .bbh-wishlist { border: 4px solid #32CD32 !important; box-shadow: 0 0 15px #32CD32 !important; opacity: 1 !important; filter: none !important; z-index: 101; background-color: #f0fff0 !important; }

            #bbh-dashboard {
                position: fixed; bottom: 10px; left: 10px; z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                border: 2px solid #444; border-radius: 8px;
                padding: 10px 15px;
                font-family: Verdana, sans-serif; font-size: 11px; color: #333;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                pointer-events: none;
                min-width: 120px;
            }
            #bbh-dashboard h4 { margin: 0 0 5px 0; font-size: 12px; color: #000; border-bottom: 1px solid #ccc; padding-bottom: 3px; }
            #bbh-dashboard .stat-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
            #bbh-dashboard .stat-label { font-weight: bold; color: #666; margin-right: 10px; }
            #bbh-dashboard .stat-val { font-weight: bold; color: #000; }
            #bbh-dashboard .stat-val.wish { color: #32CD32; }
        `;

    /* ---------------------- UTILS ----------------------- */

    /**
     * Extracts and normalizes the unique image key from a URL.
     * Removes CSS url() wrappers, leading slashes, and converts to lowercase.
     * @param {string} src - The raw source URL or background-image string.
     * @returns {string|null} - The normalized key (e.g., "items/book_blue.gif") or null if invalid.
     */
    function getRelativeImagePath(src) {
      if (!src) return null;
      try {
        const cleanSrc = src.replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
        const decoded = decodeURIComponent(cleanSrc);
        const match = decoded.match(/\/items\/([^"]+)/);
        if (match) return `items/${match[1]}`.toLowerCase();
        return null;
      } catch (e) {
        return null;
      }
    }

    /* ---------------------- UI COMPONENT ----------------------- */

    /**
     * Manages the persistent Dashboard UI element.
     */
    class DashboardUI {
      constructor() {
        this.element = null;
      }

      /**
       * Updates or creates the dashboard element based on the current state.
       * @param {StateManager} state - The current application state.
       */
      render(state) {
        if (this.element) this.element.remove();
        if (!state.petName) return;

        this.element = document.createElement("div");
        this.element.id = "bbh-dashboard";
        this.element.innerHTML = `
                    <h4>${state.petName}</h4>
                    <div class="stat-row"><span class="stat-label">Regular:</span> <span class="stat-val">${state.regularSet.size.toLocaleString()}</span></div>
                    <div class="stat-row"><span class="stat-label">Booktastic:</span> <span class="stat-val">${state.booktasticSet.size.toLocaleString()}</span></div>
                    <div class="stat-row"><span class="stat-label">Wishlist:</span> <span class="stat-val wish">${state.wishlistSet.size.toLocaleString()}</span></div>
                `;
        document.body.appendChild(this.element);
      }
    }

    /* ---------------------- DATA LAYER ----------------------- */

    /**
     * Manages data persistence, loading, and business logic.
     * Handles separate lists for Regular/Booktastic books and merges them at runtime.
     */
    class StateManager {
      constructor() {
        this.regularSet = new Set();
        this.booktasticSet = new Set();
        this.combinedSet = new Set(); // Runtime union of both read lists
        this.wishlistSet = new Set();
        this.petName = null;
        this.visualStyle = "classic";
      }

      /**
       * Initializes application state.
       * Detects the active pet, loads their specific read history, and loads the global wishlist.
       */
      async load() {
        this.visualStyle = await GM.getValue(VISUAL_PREF_KEY, "classic");
        this.injectStyles();

        // Pet Detection: Checks multiple DOM locations for the active pet name.
        // Required because Neopets layout varies significantly between pages (Classic vs Beta).
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("view")) this.petName = urlParams.get("view");
        else {
          const newLayoutName = document
            .querySelector(".active-pet-status .active-pet-name")
            ?.textContent?.trim();
          const newLayoutImg = document
            .querySelector(".active-pet-status img[alt]")
            ?.alt?.split(/\s+/)?.[0];
          const dropdown = document
            .querySelector(".nav-profile-dropdown-text .profile-dropdown-link")
            ?.textContent?.trim();
          const classicSidebar = document
            .querySelector(".sidebarHeader a b")
            ?.textContent?.trim();
          const userInfo = document
            .querySelector('.user_info a[href*="pet_name"]')
            ?.textContent?.trim();
          this.petName =
            newLayoutName ||
            newLayoutImg ||
            dropdown ||
            classicSidebar ||
            userInfo ||
            null;
        }

        if (this.petName) {
          await GM.setValue("last_active_pet", this.petName);
          await this.loadBookData(this.petName);
        } else {
          // Fallback to cached pet name if UI detection fails (common in iframes/popups)
          this.petName = await GM.getValue("last_active_pet", null);
          if (this.petName) {
            Logger.warn("State", `Using fallback pet: ${this.petName}`);
            await this.loadBookData(this.petName);
          }
        }

        const wishData = await GM.getValue(WISHLIST_KEY, []);
        this.wishlistSet = new Set(this.sanitizeList(wishData));
      }

      /**
       * Loads read lists for a specific pet from storage.
       * Handles data migration from legacy formats if detected.
       */
      async loadBookData(petName) {
        const storageKey = `${READ_LIST_KEY_PREFIX}${petName}`;
        let data = await GM.getValue(storageKey, {
          regular: [],
          booktastic: [],
        });

        // Legacy Data Migration (V5.20 -> V5.21)
        if (data.readKeys) {
          data = { regular: data.readKeys, booktastic: [] };
          await GM.setValue(storageKey, data);
        }

        this.regularSet = new Set(this.sanitizeList(data.regular));
        this.booktasticSet = new Set(this.sanitizeList(data.booktastic));
        this.combinedSet = new Set([...this.regularSet, ...this.booktasticSet]);

        Logger.info("State", `Loaded ${this.combinedSet.size} total books.`);
      }

      /**
       * Normalizes a list of image keys.
       * Ensures lowercase and removes leading slashes to prevent matching errors.
       */
      sanitizeList(list) {
        if (!Array.isArray(list)) return [];
        return list.map((k) => {
          let clean = k.toLowerCase();
          if (clean.startsWith("/")) clean = clean.substring(1);
          return clean;
        });
      }

      injectStyles() {
        const style = document.createElement("style");
        style.id = "bbh-styles";
        style.innerHTML =
          STYLES_SHARED +
          (this.visualStyle === "bold" ? STYLES_BOLD : STYLES_CLASSIC);
        const old = document.getElementById("bbh-styles");
        if (old) old.remove();
        document.head.appendChild(style);
      }

      async toggleVisualStyle() {
        this.visualStyle = this.visualStyle === "bold" ? "classic" : "bold";
        await GM.setValue(VISUAL_PREF_KEY, this.visualStyle);
        this.injectStyles();
        console.log(
          `[BBH] Visual Style switched to: ${this.visualStyle.toUpperCase()}`
        );
      }

      /**
       * Determines the status of a specific item key.
       * @returns {'WISHLIST' | 'READ' | null}
       */
      checkStatus(imagePath) {
        if (!imagePath) return null;
        if (this.wishlistSet.has(imagePath)) return "WISHLIST";
        if (this.combinedSet.has(imagePath)) return "READ";
        return null;
      }
    }

    /* ---------------------- BASE MODULE ----------------------- */

    /**
     * Abstract base class for page modules.
     * Handles the main execution loop, including MutationObservers and Debouncing.
     */
    class BaseModule {
      constructor(name) {
        this.name = name;
        this.observer = null;
        this.debounceTimer = null;
      }

      /**
       * DOM Scanning Strategy. Must be implemented by subclasses.
       * @param {Document|Element} doc - Root node to scan.
       * @returns {Array<{container: Element, imageSrc: string}>} List of found items.
       */
      scan(doc) {
        return [];
      }

      async execute(stateManager) {
        Logger.info("Module", `Executing ${this.name}...`);
        this.applyHighlights(document, stateManager);
        this.startObserver(stateManager);
      }

      applyHighlights(rootNode, stateManager) {
        const items = this.scan(rootNode);
        if (items.length === 0) return;

        Logger.info(this.name, `Found ${items.length} items on page.`);

        let matchCount = 0;
        items.forEach((item) => {
          // Mark item as processed to assist debugging visuals
          if (!item.container.classList.contains("bbh-scanned"))
            item.container.classList.add("bbh-scanned");

          const key = getRelativeImagePath(item.imageSrc);
          if (!key) return;

          const status = stateManager.checkStatus(key);

          // Reset previous state
          item.container.classList.remove("bbh-read", "bbh-wishlist");

          if (status) {
            matchCount++;
            if (status === "WISHLIST")
              item.container.classList.add("bbh-wishlist");
            else if (status === "READ")
              item.container.classList.add("bbh-read");
          }
        });
        if (matchCount > 0)
          Logger.info(this.name, `Highlighted ${matchCount} matching items.`);
      }

      /**
       * Sets up a MutationObserver to handle dynamic content loading (AJAX).
       * Uses a debounce strategy (500ms) to wait for the DOM to settle before scanning.
       */
      startObserver(stateManager) {
        if (this.observer) return;
        this.observer = new MutationObserver((mutations) => {
          let meaningfulMutation = false;
          mutations.forEach((m) => {
            for (let n of m.addedNodes) {
              if (n.nodeName !== "#text" && n.nodeName !== "SCRIPT") {
                meaningfulMutation = true;
                break;
              }
            }
          });

          if (meaningfulMutation) {
            if (this.debounceTimer) clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
              Logger.debug("Observer", "DOM settled. Scanning...");
              this.applyHighlights(document, stateManager);
            }, 500);
          }
        });
        if (document.body)
          this.observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
      }
    }

    /* ---------------------- MODULES ----------------------- */

    /**
     * Module: Inventory
     * Supports both Classic (Table) and Beta (Grid) layouts.
     * Handles the Beta quirk where images are CSS backgrounds on divs.
     */
    class InventoryModule extends BaseModule {
      scan(doc) {
        const results = [];
        // Strategy 1: Data-Image Attribute (Beta Inventory)
        doc.querySelectorAll(".item-img").forEach((div) => {
          let src = div.getAttribute("data-image");
          if (!src) {
            // Fallback to computed style if attribute is missing
            let bg =
              div.style.backgroundImage ||
              window.getComputedStyle(div).backgroundImage;
            if (bg && bg.includes("/items/")) src = bg;
          }
          if (src && src.includes("/items/")) {
            const container =
              div.closest(".grid-item") ||
              div.closest(".item-grid-item") ||
              div;
            results.push({ container: container, imageSrc: src });
          }
        });
        // Strategy 2: IMG tags (Classic/Stack View)
        doc.querySelectorAll('img[src*="/items/"]').forEach((img) => {
          const container =
            img.closest(".grid-item") ||
            img.closest(".item-sub") ||
            img.closest("td.inventory-item");
          if (container)
            results.push({ container: container, imageSrc: img.src });
        });
        return results;
      }
    }

    class ShopModule extends BaseModule {
      scan(doc) {
        const results = [];
        // Strategy 1: NPC Shops (Divs with background images)
        doc.querySelectorAll(".shop-item .item-img").forEach((div) => {
          const bg =
            div.style.backgroundImage ||
            window.getComputedStyle(div).backgroundImage;
          if (bg && bg.includes("/items/")) {
            const container = div.closest(".shop-item");
            if (container) results.push({ container: container, imageSrc: bg });
          }
        });
        // Strategy 2: User Shops (Standard IMG tags)
        doc.querySelectorAll('img[src*="/items/"]').forEach((img) => {
          const container = img.closest(".shop-item") || img.closest("td");
          if (container)
            results.push({ container: container, imageSrc: img.src });
        });
        return results;
      }
    }

    class SDBModule extends BaseModule {
      scan(doc) {
        const results = [];
        doc.querySelectorAll('img[src*="/items/"]').forEach((img) => {
          const row = img.closest("tr");
          // Ensure row has cells to avoid highlighting layout tables
          if (row && row.cells && row.cells.length > 2)
            results.push({ container: row, imageSrc: img.src });
        });
        return results;
      }
    }

    class QuickstockModule extends BaseModule {
      scan(doc) {
        const results = [];
        doc
          .querySelectorAll('form[name="quickstock"] img[src*="/items/"]')
          .forEach((img) => {
            const row = img.closest("tr");
            if (row) results.push({ container: row, imageSrc: img.src });
          });
        return results;
      }
    }

    /**
     * Module: Extractor
     * Scrapes the "Books Read" page to update the database.
     * Does not perform highlighting.
     */
    class ExtractorModule extends BaseModule {
      async execute(stateManager) {
        const urlParams = new URLSearchParams(window.location.search);
        const petName = urlParams.get("pet_name");
        if (!petName) {
          Logger.error("Extractor", "No pet_name found.");
          return;
        }

        // Detect page type to sort into correct list
        const isBooktastic = window.location.href.includes("moon");
        const listName = isBooktastic ? "Booktastic" : "Regular";
        Logger.info("Extractor", `Scanning ${listName} list for ${petName}...`);

        const images = document.querySelectorAll('td img[src*="/items/"]');
        const foundKeys = new Set();
        images.forEach((img) => {
          const key = getRelativeImagePath(img.src);
          if (key) foundKeys.add(key);
        });

        if (foundKeys.size > 0) {
          const storageKey = `${READ_LIST_KEY_PREFIX}${petName}`;
          let data = await GM.getValue(storageKey, {
            regular: [],
            booktastic: [],
          });

          // Handle migration for old data structure
          if (data.readKeys) data = { regular: data.readKeys, booktastic: [] };

          if (isBooktastic) data.booktastic = Array.from(foundKeys);
          else data.regular = Array.from(foundKeys);

          await GM.setValue(storageKey, data);
          await stateManager.loadBookData(petName);

          const banner = document.createElement("div");
          banner.style.cssText =
            "position:fixed; top:0; left:0; width:100%; background:#cfc; padding:10px; text-align:center; z-index:9999; border-bottom:2px solid green; font-size: 16px; font-weight: bold; font-family: sans-serif;";

          banner.innerText = `[BBH] ${listName} book list updated.`;

          if (document.body) {
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 5000);
          }
        }
      }
    }

    /* ---------------------- INIT ----------------------- */

    async function init() {
      const state = new StateManager();
      await state.load();

      const dashboard = new DashboardUI();
      dashboard.render(state);

      const url = window.location.href;
      let activeModule = null;

      // Simple Router to select the correct strategy
      if (url.includes("books_read.phtml"))
        activeModule = new ExtractorModule("Extractor");
      else if (url.includes("inventory"))
        activeModule = new InventoryModule("Inventory");
      else if (url.includes("safetydeposit"))
        activeModule = new SDBModule("SDB");
      else if (url.includes("quickstock"))
        activeModule = new QuickstockModule("Quickstock");
      else if (
        url.includes("obj_type") ||
        url.includes("browseshop") ||
        url.includes("garage")
      )
        activeModule = new ShopModule("Shop");

      if (activeModule) await activeModule.execute(state);

      // Register Menu Commands
      GM.registerMenuCommand("Toggle Visual Style (Classic/Bold)", async () => {
        await state.toggleVisualStyle();
        if (activeModule) activeModule.applyHighlights(document, state);
      });
      GM.registerMenuCommand("Edit Wishlist (JSON)", async () => {
        const current = await GM.getValue(WISHLIST_KEY, []);
        const input = prompt("Wishlist JSON:", JSON.stringify(current));
        if (input) await GM.setValue(WISHLIST_KEY, JSON.parse(input));
      });
    }

    init();
  } catch (e) {
    console.error("[BBH CRASH] Global syntax or runtime error:", e);
  }
})();
