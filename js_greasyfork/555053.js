// ==UserScript==
// @name         Neopets: A Better Plushie Highlighter (Class-Based Refactor)
// @version      3.0
// @description  Uses precise selectors for shops, SDB, and Inventory page.
// @namespace    https://git.gay/valkyrie1248/Neopets-Userscripts
// @author       valkryie1248 (Refactored with help of Gemini)
// @license      MIT
// @match        https://www.neopets.com/objects.phtml?type=shop&obj_type=98
// @match        https://www.neopets.com/objects.phtml?obj_type=98&type=shop
// @match        https://www.neopets.com/objects.phtml?*obj_type=74*
// @match        https://www.neopets.com/gallery/quickremove.phtml
// @match        https://www.neopets.com/browseshop.phtml*
// @match        https://www.neopets.com/safetydeposit.phtml*
// @match        https://www.neopets.com/halloween/garage*
// @match        https://www.neopets.com/inventory*
// @match        https://www.neopets.com/quickstock.phtml*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555053/Neopets%3A%20A%20Better%20Plushie%20Highlighter%20%28Class-Based%20Refactor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555053/Neopets%3A%20A%20Better%20Plushie%20Highlighter%20%28Class-Based%20Refactor%29.meta.js
// ==/UserScript==

(() => {
  /* ---------------------- GLOBAL UTILITIES & CONSTANTS ----------------------- */

  function safeLogError(err) {
    try {
      console.error("[Plushie Highlighter Error]", err);
    } catch (e) {
      /* ignore */
    }
  }
  const normalize = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[.,`'’"():/–—\-_]/g, " ")
      .replace(/\b(the|a|an|of|and|&)\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const CSS_CLASSES = {
    OVERLAY: "ph-img-overlay", // Renamed to avoid conflict with other scripts.
    LIST1: "List1-highlight",
    LIST2: "List2-highlight",
    LIST3: "List3-highlight",
    LIST4: "List4-highlight",
    GALLERY_HIGHLIGHT: "Gallery-highlight",
    KEY_BOX: "ph-key-box",
  };
  const TIER_LISTS_KEY = "ph_tier_lists_v1";
  const GALLERY_LIST_KEY = "ph_gallery_list_v1";

  const NORM_LIST1 = new Set();
  const NORM_LIST2 = new Set();
  const NORM_LIST3 = new Set();
  const NORM_LIST4 = new Set();
  const NORM_LISTGALLERY = new Set();

  // --- CSS & Key Setup ---
  // Using template literals here so the class name is always in sync
  const css = `
.${CSS_CLASSES.OVERLAY} { position: relative; }
.${CSS_CLASSES.OVERLAY}::after{
    content: "";
    position: absolute;
    inset: 0;
    /* Light purple overlay for "In Gallery" */
    background: rgba(128,0,128,0.25);
    pointer-events: none;
    transition: opacity .15s;
    opacity: 1;
}
.${CSS_CLASSES.OVERLAY}.no-overlay::after { opacity: 0; }
.${CSS_CLASSES.GALLERY_HIGHLIGHT} { color:purple; text-decoration: line-through;}
tr:has(> .${CSS_CLASSES.GALLERY_HIGHLIGHT}) { padding-top:5px; box-shadow:0 4px 8px rgba(128,0,128,0.6);}
.${CSS_CLASSES.LIST4}{ color: red; font-weight: 800; text-decoration: underline;}
:has(>.${CSS_CLASSES.LIST4}) {border: 5px solid red; padding: 5px; box-shadow: 0 4px 8px rgba(255, 0, 0, 0.2); }
.${CSS_CLASSES.LIST3}{ color:red; }
:has(> .${CSS_CLASSES.LIST3}) { border: 2px dashed red; padding-top: 5px; box-shadow: 0 4px 8px rgba(255, 0, 0, 0.1);}
.${CSS_CLASSES.LIST2} { color: orange; }
:has(> .${CSS_CLASSES.LIST2}) { border:2px solid orange; padding-top:5px; box-shadow:0 4px 8px rgba(255,165,0,0.2);}
.${CSS_CLASSES.LIST1} { color:green; }
:has(> .${CSS_CLASSES.LIST1}) { border:1px dotted green; padding-top:5px; box-shadow:0 4px 8px rgba(0,255,0,0.2);}
.${CSS_CLASSES.KEY_BOX} {
    position: fixed; bottom: 20px; right: 20px; background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ccc; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000; font-size: 12px; max-width: 250px; pointer-events: auto;
}
.${CSS_CLASSES.KEY_BOX} h4 { margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px dashed #ddd; padding-bottom: 5px;}
.${CSS_CLASSES.KEY_BOX} p { margin: 3px 0; line-height: 1.4;}
.${CSS_CLASSES.KEY_BOX} .ph-key-item { display: flex; align-items: center; gap: 8px;}
.ph-key-swatch { display: inline-block; width: 12px; height: 12px; border: 1px solid #333;}
:where(.item-name) b { font-weight: normal; }`;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const keyDiv = document.createElement("div");
  keyDiv.className = CSS_CLASSES.KEY_BOX;
  keyDiv.style.display = "none";
  keyDiv.innerHTML = `<h4>Plushie Priority Key</h4><div id="ph-key-content"></div>`;

  // --- Data & UI Management Functions ---
  function updateKeyUI() {
    try {
      const keyContent = document.getElementById("ph-key-content");
      if (!keyContent) return;

      const lists = [
        {
          name: "Tier 4 (High)",
          set: NORM_LIST4,
          class: CSS_CLASSES.LIST4,
          color: "red",
          count: NORM_LIST4.size,
        },
        {
          name: "Tier 3",
          set: NORM_LIST3,
          class: CSS_CLASSES.LIST3,
          color: "red",
          count: NORM_LIST3.size,
        },
        {
          name: "Tier 2",
          set: NORM_LIST2,
          class: CSS_CLASSES.LIST2,
          color: "orange",
          count: NORM_LIST2.size,
        },
        {
          name: "Tier 1 (Low)",
          set: NORM_LIST1,
          class: CSS_CLASSES.LIST1,
          color: "green",
          count: NORM_LIST1.size,
        },
      ];

      let html = "";
      let hasTiers = false;

      html += `<div class="ph-key-item"><span class="ph-key-swatch" style="background: rgba(128,0,128,0.25); border: 1px solid purple;"></span>**Owned Plushie** (${NORM_LISTGALLERY.size})</div>`;
      html +=
        '<hr style="border: 0; border-top: 1px solid #eee; margin: 5px 0;">';

      lists.forEach((list) => {
        if (list.count > 0) {
          hasTiers = true;
          html += `
            <div class="ph-key-item">
                <span class="ph-key-swatch" style="background: transparent; border: 1px solid ${list.color};"></span>
                <strong>${list.name}</strong> (${list.count})
            </div>
          `;
        }
      });

      keyContent.innerHTML = html;

      if (NORM_LISTGALLERY.size > 0 || hasTiers) {
        keyDiv.style.display = "block";
      } else {
        keyDiv.style.display = "none";
      }
    } catch (e) {
      safeLogError(e);
    }
  }
  async function loadTieredListsToSets() {
    try {
      const rawLists = await GM.getValue(TIER_LISTS_KEY, {});
      NORM_LIST1.clear();
      NORM_LIST2.clear();
      NORM_LIST3.clear();
      NORM_LIST4.clear();

      (rawLists.List1 || []).forEach((item) => NORM_LIST1.add(normalize(item)));
      (rawLists.List2 || []).forEach((item) => NORM_LIST2.add(normalize(item)));
      (rawLists.List3 || []).forEach((item) => NORM_LIST3.add(normalize(item)));
      (rawLists.List4 || []).forEach((item) => NORM_LIST4.add(normalize(item)));
    } catch (e) {
      safeLogError(e);
    }
  }
  async function loadGalleryListToSet() {
    try {
      const raw = await GM.getValue(GALLERY_LIST_KEY, []);
      NORM_LISTGALLERY.clear();
      (raw || []).forEach((item) => NORM_LISTGALLERY.add(normalize(item)));
    } catch (e) {
      safeLogError(e);
    }
  }

  /* ---------------------- CLASS-BASED REGISTRY / STRATEGY PATTERN -------------------- */

  class BaseHighlighterModule {
    constructor(name, urlIdentifier) {
      this.name = name;
      this.urlIdentifier = urlIdentifier;
    }
    shouldRun(url) {
      return url.includes(this.urlIdentifier);
    }
    async execute(doc) {
      throw new Error(
        `Module '${this.name}' must implement the 'execute' method.`
      );
    }

    // Shared Highlighting Application Logic
    applyListClass(element, nameNorm) {
      if (!element) return;

      // 1. GALLERY HIGHLIGHTING (Owned/Faded)
      if (NORM_LISTGALLERY.has(nameNorm)) {
        element.classList.add(CSS_CLASSES.GALLERY_HIGHLIGHT);
        // PlushieHighlighter.js, line 314 (Removed 'td' to allow search to continue to 'tr[bgcolor]')
        const overlayTarget =
          element.closest(".grid-item, .item-img, tr[bgcolor], li") ||
          element.parentNode;
        if (overlayTarget) overlayTarget.classList.add(CSS_CLASSES.OVERLAY);
      }

      // 2. TIERED PLUSHIE HIGHLIGHTING
      if (NORM_LIST4.has(nameNorm)) element.classList.add(CSS_CLASSES.LIST4);
      else if (NORM_LIST3.has(nameNorm))
        element.classList.add(CSS_CLASSES.LIST3);
      else if (NORM_LIST2.has(nameNorm))
        element.classList.add(CSS_CLASSES.LIST2);
      else if (NORM_LIST1.has(nameNorm))
        element.classList.add(CSS_CLASSES.LIST1);
    }

    // Helper to loop and style a NodeList of elements (Assumes element.textContent is the clean name)
    styleItemElements(elements) {
      try {
        for (const element of elements) {
          try {
            const raw = (element.textContent || "").trim();
            if (!raw) continue;

            const nameNorm = normalize(raw);
            this.applyListClass(element, nameNorm);
          } catch (inner) {
            safeLogError(inner);
          }
        }
      } catch (err) {
        safeLogError(err);
      }
    }
  }

  // Concrete Strategy: Gallery Extractor Page (UNCHANGED)
  class GalleryExtractorModule extends BaseHighlighterModule {
    constructor() {
      super("Gallery Extractor", "gallery/quickremove.phtml");
    }
    extractPlushieListFromDOM() {
      const ownedPlushies = [];
      try {
        const tbody = document.querySelector(
          "form[name='quickremove_form'] tbody"
        );
        if (!tbody) return [];

        const rows = tbody.querySelectorAll("tr:nth-child(n+2)");
        rows.forEach((row) => {
          const thirdTD = row.querySelector("td:nth-child(3)");
          if (thirdTD) {
            const itemName = thirdTD.textContent.trim();
            if (itemName) ownedPlushies.push(itemName);
          }
        });
        console.log(
          `[${this.name}] Extracted ${ownedPlushies.length} plushies from the DOM.`
        );
        return ownedPlushies;
      } catch (error) {
        safeLogError(error);
        return [];
      }
    }
    async promptToSaveGalleryList(extractedList) {
      if (extractedList.length === 0) {
        alert(
          "Gallery extraction completed, but no plushies were found. Nothing saved."
        );
        return;
      }

      try {
        const oldList = await GM.getValue(GALLERY_LIST_KEY, []);
        const confirmText =
          `Gallery Plushie List Extractor\n\n` +
          `Extracted ${extractedList.length} plushies from this page.\n` +
          `Your current saved list has ${oldList.length} plushies.\n\n` +
          `Do you want to **REPLACE** the saved list with the ${extractedList.length} items found now?`;

        if (confirm(confirmText)) {
          await GM.setValue(GALLERY_LIST_KEY, extractedList);
          alert(
            `Gallery list successfully updated with ${extractedList.length} items!`
          );
        } else {
          alert("Extraction canceled. No changes were made to the saved list.");
        }
      } catch (e) {
        safeLogError(e);
        alert(`Failed to save list. Error: ${e.message}`);
      }
    }
    async execute() {
      const extractedList = this.extractPlushieListFromDOM();
      await this.promptToSaveGalleryList(extractedList);
    }
  }

  // Concrete Strategy: Shop Pages (Covers Plushie Palace, User Shops) (UNCHANGED)
  class ShopPageModule extends BaseHighlighterModule {
    constructor() {
      super("Shop & User Shop Highlighter", "phtml");
    }
    async execute(doc) {
      await loadGalleryListToSet();
      await loadTieredListsToSets();

      // Selectors for legacy shop pages: bold tag after a line break, or item-name class.
      let itemNames = doc.querySelectorAll("td > br + b, .item-name");

      this.styleItemElements(itemNames);
      updateKeyUI();

      if (!document.body.contains(keyDiv)) {
        document.body.appendChild(keyDiv);
      }
    }
  }

  // FINALIZED Module: Inventory (UNCHANGED)
  class InventoryModule extends BaseHighlighterModule {
    constructor() {
      super("Inventory Highlighter", "inventory");
      this.observer = null; // Store the observer instance
    }

    // Dedicated Observer for the dynamic Inventory page
    initInventoryObserver(doc) {
      // Use multiple selectors and fallback to document.body to guarantee the observer starts.
      const targetNode =
        doc.querySelector(".inventory-grid-container") ||
        doc.querySelector(".inventory-container") ||
        doc.getElementById("content") ||
        doc.body;

      if (!targetNode) {
        console.log(
          `[${this.name}] Fatal: Could not find ANY target container for observer.`
        );
        return;
      }

      if (targetNode === doc.body) {
        console.log(
          `[${this.name}] Warning: Using document.body as fallback target.`
        );
      }

      if (this.observer) this.observer.disconnect();

      const config = { childList: true, subtree: true };

      const callback = (mutationsList, observer) => {
        let itemsAdded = false;
        for (const mutation of mutationsList) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            itemsAdded = true;
            break;
          }
        }

        if (itemsAdded) {
          console.log(
            `[${this.name}] Observer triggered: New item nodes added. Re-applying styles.`
          );
          const itemNames = doc.querySelectorAll("p.item-name");
          this.styleItemElements(itemNames);
        }
      };

      this.observer = new MutationObserver(callback);
      this.observer.observe(targetNode, config);
      console.log(
        `[${this.name}] Mutation Observer started on Inventory container.`
      );
    }

    async execute(doc) {
      console.log(`[${this.name}] Executing.`);
      await loadGalleryListToSet();
      await loadTieredListsToSets();

      const itemNames = doc.querySelectorAll("p.item-name");
      this.styleItemElements(itemNames);
      updateKeyUI();

      this.initInventoryObserver(doc);
    }
  }

  // NEW MODULE: Quickstock
  class QuickstockModule extends BaseHighlighterModule {
    constructor() {
      super("Quickstock Highlighter", "quickstock.phtml");
    }

    // Custom helper to correctly extract the item name from the TD, ignoring the child <p class="search-helper">
    styleQuickstockItemElements(elements) {
      try {
        for (const cell of elements) {
          try {
            // Start with the full text content of the TD
            let raw = (cell.textContent || "").trim();

            // Find the search helper to extract its text content
            const searchHelper = cell.querySelector("p.search-helper");
            if (searchHelper) {
              // Crucial: Subtract the search helper's text from the cell's text to isolate the item name
              const helperText = searchHelper.textContent || "";
              raw = raw.replace(helperText, "").trim();
            }

            if (!raw) continue;

            const nameNorm = normalize(raw);
            // Apply class to the TD element itself
            this.applyListClass(cell, nameNorm);
          } catch (inner) {
            safeLogError(inner);
          }
        }
      } catch (err) {
        safeLogError(err);
      }
    }

    async execute(doc) {
      console.log(`[${this.name}] Executing.`);
      await loadGalleryListToSet();
      await loadTieredListsToSets();

      // Selector for the TD containing the item name (first TD in the table rows)
      // tr[bgcolor] ensures we target item rows, not header/footer rows.
      const itemCells = doc.querySelectorAll("tr[bgcolor] > td:first-child");

      this.styleQuickstockItemElements(itemCells);
      updateKeyUI();
    }
  }

  // Module: Safety Deposit Box (SDB)
  class SDBModule extends BaseHighlighterModule {
    constructor() {
      super("Safety Deposit Box Highlighter", "safetydeposit.phtml");
    }

    async execute(doc) {
      console.log(`[${this.name}] Executing.`);
      await loadGalleryListToSet();
      await loadTieredListsToSets();

      // Precise Selector for SDB item names (b tag in the second td)
      const itemNames = doc.querySelectorAll("td:nth-child(2) b");
      this.styleItemElements(itemNames);
      updateKeyUI();
    }
  }

  // Module: Garage (Attic) (FIXED Selector)
  class GarageModule extends BaseHighlighterModule {
    constructor() {
      super("Garage Highlighter (Attic)", "halloween/garage");
    }
    async execute(doc) {
      console.log(`[${this.name}] Executing.`);
      await loadGalleryListToSet();
      await loadTieredListsToSets();

      // FIXED Selector: Target the <b> tag containing the item name inside the <li> item container
      this.styleItemElements(doc.querySelectorAll("li b"));
      updateKeyUI();
    }
  }

  /* ---------------------- MODULE REGISTRY & RUNNER -------------------- */

  const modules = [];
  function registerModule(moduleInstance) {
    modules.push(moduleInstance);
  }

  // Order matters: Specific pages first, generic pages last.
  registerModule(new GalleryExtractorModule());
  registerModule(new SDBModule());
  registerModule(new InventoryModule());
  registerModule(new QuickstockModule()); // NEW
  registerModule(new GarageModule()); // FIXED
  registerModule(new ShopPageModule());

  async function runHighlighter() {
    const currentURL = location.href;
    for (const module of modules) {
      if (module.shouldRun(currentURL)) {
        console.log(`[System] Activating: ${module.name}`);
        try {
          await module.execute(document);
          return;
        } catch (e) {
          safeLogError(`Execution failed for ${module.name}`, e);
        }
      }
    }
    console.log("[System] No specific module matched the current URL.");
  }

  /* ---------------------- MENU COMMANDS -------------------- */

  async function manageTieredLists() {
    try {
      const currentData = await GM.getValue(TIER_LISTS_KEY, {});
      const json = JSON.stringify(currentData, null, 2);
      const promptText =
        `Paste your complete Tiered Plushie Lists in JSON object format below.\n\n` +
        `This will REPLACE the existing lists.\n` +
        `Format example:\n` +
        `{\n  "List1": ["Plushie A", "Plushie B"],\n  "List4": ["Rare Plushie C", "Prized Plushie D"]\n}`;

      const input = prompt(promptText, json);
      if (input === null || input === json) return;

      const parsed = JSON.parse(input);

      await GM.setValue(TIER_LISTS_KEY, parsed);
      await loadTieredListsToSets();
      runHighlighter();
      alert("Tiered highlight lists updated successfully!");
    } catch (e) {
      safeLogError(e);
      alert(`Failed to parse or save list. Error: ${e.message}`);
    }
  }

  async function manageGalleryList() {
    try {
      const currentData = await GM.getValue(GALLERY_LIST_KEY, []);
      const json = JSON.stringify(currentData, null, 2);

      const promptText =
        `Paste your complete list of plushies in JSON array format below.\n\n` +
        `This will REPLACE the existing list.\n` +
        `Format example (use an array of raw item names):\n` +
        `[\n  "Plushie Name A",\n  "Plushie Name B",\n  "Plushie Name C"\n]`;

      const input = prompt(promptText, json);
      if (input === null || input === json) return;

      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        alert(
          "Invalid JSON structure. Must contain a single array of item names."
        );
        return;
      }

      await GM.setValue(GALLERY_LIST_KEY, parsed);
      await loadGalleryListToSet();
      runHighlighter();
      alert("Gallery highlight list updated successfully!");
    } catch (e) {
      safeLogError(e);
      alert(`Failed to parse or save list. Error: ${e.message}`);
    }
  }

  try {
    GM.registerMenuCommand(
      "Manage Gallery Plushie List (JSON)",
      manageGalleryList
    );
    GM.registerMenuCommand(
      "Manage Tiered Plushie Lists (JSON)",
      manageTieredLists
    );
  } catch (e) {
    /* Ignore if GM functions are not supported */
  }

  // Execute the runner
  runHighlighter();
})();
