// ==UserScript==
// @name         ASTRIX Zed City Armor Sets Tab
// @namespace    https://www.zed.city/
// @version      1.0.0
// @description  Adds an Armor Sets tab next to Inventory and Vehicle on the Inventory page
// @author       ASTRIX
// @match        https://www.zed.city/*
// @match        https://zed.city/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/564266/ASTRIX%20Zed%20City%20Armor%20Sets%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/564266/ASTRIX%20Zed%20City%20Armor%20Sets%20Tab.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const ARMOR_SETS_TAB_CLASS = "zed-armor-sets-tab-injected";
  const ARMOR_SETS_PANEL_CLASS = "zed-armor-sets-panel-injected";
  const ARMOR_SETS_KEY = "zed-armor-sets-data";

  // API endpoints
  const API_LOAD_ITEMS = "https://api.zed.city/loadItems";
  const API_CSRF_TOKEN = "https://api.zed.city/csrfToken";

  // Armor slot types
  const ARMOR_SLOTS = {
    head: { type: "defense_head", label: "Head", icon: "" },
    body: { type: "defense_body", label: "Body", icon: "" },
    legs: { type: "defense_legs", label: "Legs", icon: "" },
    feet: { type: "defense_feet", label: "Feet", icon: "" }
  };

  // Track state
  let isArmorSetsPanelOpen = false;
  let csrfToken = null;
  let cachedItems = null;
  let isCreatingSet = false;
  let editingSetUuid = null; // UUID of set being edited, null if creating new
  let currentNewSet = { name: "", head: null, body: null, legs: null, feet: null };
  let viewedSetUuid = null; // UUID of set currently being viewed, null if none

  // Generate UUID
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Check if current URL matches /inventory
  function isDesiredPage() {
    return window.location.pathname === "/inventory";
  }

  // Find the tablist container and return the q-tabs__content div where tabs should be inserted
  function findTablistContainer() {
    // Must be inside <main> element
    const mainElement = document.querySelector("main");
    if (!mainElement) {
      console.log("[ArmorSets] No <main> element found");
      return null;
    }
    
    // Find all tablists inside <main> and look for the one containing "Inventory" text
    const tablists = mainElement.querySelectorAll('[role="tablist"]');
    console.log("[ArmorSets] Found", tablists.length, "tablists inside <main>");
    
    let targetTablist = null;
    
    for (const tablist of tablists) {
      // Check if this tablist contains a div with "Inventory" text
      const inventoryDiv = Array.from(tablist.querySelectorAll("div")).find(
        div => div.textContent.trim() === "Inventory"
      );
      
      if (inventoryDiv) {
        console.log("[ArmorSets] Found tablist with 'Inventory' text");
        targetTablist = tablist;
        break;
      }
    }
    
    if (!targetTablist) {
      console.log("[ArmorSets] No tablist with 'Inventory' found inside <main>");
      return null;
    }
    
    // Find the q-tabs__content div inside the tablist
    const tabsContent = targetTablist.querySelector(".q-tabs__content");
    if (tabsContent) {
      console.log("[ArmorSets] Found q-tabs__content");
      return tabsContent;
    }
    
    // Fallback: find the first div child of the tablist
    const divChild = targetTablist.querySelector(":scope > div");
    console.log("[ArmorSets] Using fallback div child:", divChild);
    return divChild || targetTablist;
  }

  // Find the tablist that contains "Inventory" text inside <main>
  function findInventoryTablist() {
    const mainElement = document.querySelector("main");
    if (!mainElement) return null;
    
    const tablists = mainElement.querySelectorAll('[role="tablist"]');
    
    for (const tablist of tablists) {
      const inventoryDiv = Array.from(tablist.querySelectorAll("div")).find(
        div => div.textContent.trim() === "Inventory"
      );
      
      if (inventoryDiv) {
        return tablist;
      }
    }
    return null;
  }

  // Find an existing tab (Inventory or Vehicle) to clone styles from
  function findExistingTab() {
    const tablist = findInventoryTablist();
    if (!tablist) return null;
    
    // Look for filter-btn elements which are the INVENTORY/VEHICLE tabs
    const filterBtns = tablist.querySelectorAll(".filter-btn");
    if (filterBtns.length > 0) {
      console.log("[ArmorSets] Found filter-btn tabs:", filterBtns.length);
      return filterBtns[0];
    }
    
    // Fallback: Look for tabs that contain "INVENTORY" or "VEHICLE" text
    const tabs = tablist.querySelectorAll(".q-tab");
    for (const tab of tabs) {
      const text = tab.textContent?.toLowerCase();
      if (text && (text.includes("inventory") || text.includes("vehicle"))) {
        return tab;
      }
    }
    
    // Fallback to any q-tab found
    return tabs.length > 0 ? tabs[0] : null;
  }

  // Get saved armor sets from localStorage
  function getArmorSets() {
    try {
      const stored = localStorage.getItem(ARMOR_SETS_KEY);
      const sets = stored ? JSON.parse(stored) : [];
      // Migrate old sets without UUIDs
      let needsSave = false;
      sets.forEach(set => {
        if (!set.uuid) {
          set.uuid = generateUUID();
          needsSave = true;
        }
      });
      if (needsSave) {
        saveArmorSets(sets);
      }
      return sets;
    } catch {
      return [];
    }
  }

  // Save armor sets to localStorage
  function saveArmorSets(sets) {
    try {
      localStorage.setItem(ARMOR_SETS_KEY, JSON.stringify(sets));
    } catch (e) {
      console.error("Failed to save armor sets", e);
    }
  }

  // Fetch CSRF token from API
  async function fetchCsrfToken() {
    if (csrfToken) return csrfToken;
    try {
      const res = await fetch(API_CSRF_TOKEN, { credentials: "include" });
      const json = await res.json();
      if (json.token) {
        csrfToken = json.token;
        return csrfToken;
      }
    } catch (error) {
      console.error("[ArmorSets] Error fetching CSRF token", error);
    }
    return null;
  }

  // Fetch items from API
  async function fetchItems() {
    if (cachedItems) return cachedItems;
    
    try {
      const token = await fetchCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["x-csrf-token"] = token;
      }

      const res = await fetch(API_LOAD_ITEMS, {
        method: "GET",
        credentials: "include",
        headers,
      });

      const json = await res.json();

      if (json.error) {
        throw new Error(json.error);
      }

      cachedItems = json;
      return json;
    } catch (error) {
      console.error("[ArmorSets] Error fetching items", error);
      throw error;
    }
  }

  // Get armor items by type from the items array
  function getArmorItemsByType(items, armorType) {
    return items.filter(item => item.type === armorType);
  }

  // Get armor items by type from all sources (inventory, vehicle, equipped)
  async function getAllArmorItemsByType(armorType) {
    try {
      const itemsData = await fetchItems();
      const allItems = [];
      const itemIds = new Set(); // Track IDs to avoid duplicates
      
      // Get items from equipped slots
      if (itemsData.equip && typeof itemsData.equip === 'object') {
        for (const [slotKey, slotItem] of Object.entries(itemsData.equip)) {
          if (slotItem && slotItem.type === armorType && !itemIds.has(slotItem.id)) {
            allItems.push({ ...slotItem, _source: 'equipped' });
            itemIds.add(slotItem.id);
          }
        }
      }
      
      // Get items from inventory
      if (itemsData.items && Array.isArray(itemsData.items)) {
        itemsData.items.forEach(item => {
          if (item.type === armorType && !itemIds.has(item.id)) {
            allItems.push({ ...item, _source: 'inventory' });
            itemIds.add(item.id);
          }
        });
      }
      
      // Get items from vehicle
      if (itemsData.vehicle_items && Array.isArray(itemsData.vehicle_items)) {
        itemsData.vehicle_items.forEach(item => {
          if (item.type === armorType && !itemIds.has(item.id)) {
            allItems.push({ ...item, _source: 'vehicle' });
            itemIds.add(item.id);
          }
        });
      }
      
      return allItems;
    } catch (error) {
      console.error("[ArmorSets] Error getting all armor items", error);
      return [];
    }
  }

  // Create loading spinner
  function createLoadingSpinner() {
    const spinner = document.createElement("div");
    spinner.className = "armor-sets-loading-spinner";
    spinner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; gap: 8px; padding: 12px 0;">
        <div style="
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #0A748F;
          border-radius: 50%;
          animation: armor-sets-spin 1s linear infinite;
        "></div>
        <span style="color: #4a585c; font-size: 11px;">Loading...</span>
      </div>
    `;
    return spinner;
  }

  // Create the armor sets panel div
  function createArmorSetsPanel() {
    const panel = document.createElement("div");
    panel.className = ARMOR_SETS_PANEL_CLASS;
    panel.style.cssText = `
      width: 100%;
      height: 0;
      background: #121212;
      overflow: hidden;
      transition: height 0.3s ease, margin-bottom 0.2s ease;
      border-radius: 4px;
      border: 1px solid #202327;
      box-sizing: border-box;
    `;

    // Add CSS animation for spinner
    if (!document.getElementById("armor-sets-spinner-styles")) {
      const style = document.createElement("style");
      style.id = "armor-sets-spinner-styles";
      style.textContent = `
        @keyframes armor-sets-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    return panel;
  }

  // Refresh all data (clear cache, fetch, update IDs, and re-render)
  async function refreshAllData(panel) {
    try {
      // Clear cached items to force fresh fetch
      cachedItems = null;
      
      // Fetch fresh items
      await fetchItems();
      
      // Update missing IDs in saved sets
      await updateMissingItemIds();
      
      // Re-render the content
      renderArmorSetsContent(panel);
      adjustPanelHeight(panel);
    } catch (error) {
      console.error("[ArmorSets] Error refreshing data", error);
    }
  }

  // Update missing item IDs in all saved sets
  async function updateMissingItemIds() {
    try {
      const armorSets = getArmorSets();
      let needsSave = false;
      
      for (const set of armorSets) {
        if (!set.items) continue;
        
        for (const slotKey of ['head', 'body', 'legs', 'feet']) {
          const itemData = set.items[slotKey];
          if (!itemData) continue;
          
          // Handle both old format (full object) and new format (just ID/codename/traits)
          const savedItemData = typeof itemData === 'object' ? itemData : { id: itemData };
          const itemId = savedItemData.id;
          
          if (!itemId && !savedItemData.codename) continue;
          
          // Try to find the item by ID first, with fallback to codename/traits
          const result = await findItemById(itemId, savedItemData);
          
          if (!result) {
            // Item not found - skip (will show "Item not found" in UI)
            continue;
          }
          
          if (result.multipleMatches) {
            // Multiple matches - skip (will show selection dialog in UI)
            continue;
          }
          
          // If ID changed or was missing, update it
          if (result.item) {
            const currentId = itemId || savedItemData.id;
            if (result.item.id !== currentId) {
              const setIndex = armorSets.findIndex(s => s.uuid === set.uuid);
              if (setIndex !== -1) {
                // Update with new ID, preserving/updating codename and traits
                armorSets[setIndex].items[slotKey] = {
                  id: result.item.id,
                  codename: result.item.codename || savedItemData.codename,
                  traits: getTraitCodenames(result.item)
                };
                needsSave = true;
                console.log(`[ArmorSets] Updated item ID for ${set.name} ${slotKey}: ${currentId} -> ${result.item.id}`);
              }
            }
          }
        }
      }
      
      if (needsSave) {
        saveArmorSets(armorSets);
      }
    } catch (error) {
      console.error("[ArmorSets] Error updating missing item IDs", error);
    }
  }

  // Render armor sets content
  function renderArmorSetsContent(panel) {
    panel.innerHTML = "";
    
    if (isCreatingSet) {
      renderCreateSetUI(panel);
      return;
    }
    
    const armorSets = getArmorSets();

    // Create list container
    const listContainer = document.createElement("div");
    listContainer.style.cssText = `
      overflow: visible;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    `;

    // Header with add button
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid #202327;
    `;

    const title = document.createElement("span");
    title.textContent = "ARMOR SETS";
    title.style.cssText = `
      color: #0A748F;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    `;
    header.appendChild(title);

    // Right side buttons container
    const rightButtons = document.createElement("div");
    rightButtons.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    // Unequip items button with dropdown
    const unequipContainer = document.createElement("div");
    unequipContainer.style.cssText = `
      position: relative;
    `;

    const unequipBtn = document.createElement("button");
    unequipBtn.textContent = "Unequip items";
    unequipBtn.style.cssText = `
      background: #0A748F;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 4px 8px;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    unequipBtn.addEventListener("mouseenter", () => {
      unequipBtn.style.background = "#0b8aa8";
    });
    unequipBtn.addEventListener("mouseleave", () => {
      unequipBtn.style.background = "#0A748F";
    });

    // Unequip dropdown
    const unequipDropdown = document.createElement("div");
    unequipDropdown.className = "unequip-dropdown";
    unequipDropdown.style.cssText = `
      position: fixed;
      background: #1a1a1a;
      border: 1px solid #202327;
      border-radius: 4px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 99999;
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      min-width: 200px;
      padding: 8px;
    `;

    // Add scrollbar styling (reuse existing if available)
    if (!document.getElementById("armor-sets-dropdown-scrollbar")) {
      const scrollbarStyle = document.createElement("style");
      scrollbarStyle.id = "armor-sets-dropdown-scrollbar";
      scrollbarStyle.textContent = `
        .armor-sets-dropdown::-webkit-scrollbar,
        .unequip-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .armor-sets-dropdown::-webkit-scrollbar-track,
        .unequip-dropdown::-webkit-scrollbar-track {
          background: #121212;
          border-radius: 3px;
        }
        .armor-sets-dropdown::-webkit-scrollbar-thumb,
        .unequip-dropdown::-webkit-scrollbar-thumb {
          background: #4a585c;
          border-radius: 3px;
        }
        .armor-sets-dropdown::-webkit-scrollbar-thumb:hover,
        .unequip-dropdown::-webkit-scrollbar-thumb:hover {
          background: #6a7a7f;
        }
      `;
      document.head.appendChild(scrollbarStyle);
    }

    // Checkbox for "Unequip to car?"
    const checkboxContainer = document.createElement("div");
    checkboxContainer.style.cssText = `
      padding: 8px;
      border-bottom: 1px solid #202327;
      margin-bottom: 4px;
    `;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      color: #fff;
      font-size: 12px;
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "unequip-to-car";
    checkbox.style.cssText = `
      cursor: pointer;
      width: 16px;
      height: 16px;
    `;

    const checkboxText = document.createElement("span");
    checkboxText.textContent = "Unequip to car?";

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(checkboxText);
    checkboxContainer.appendChild(checkboxLabel);
    unequipDropdown.appendChild(checkboxContainer);

    // Slot options
    const slotOptions = [
      { key: "head", label: "Head" },
      { key: "body", label: "Body" },
      { key: "legs", label: "Legs" },
      { key: "feet", label: "Feet" }
    ];

    slotOptions.forEach(slot => {
      const option = document.createElement("div");
      option.className = "dropdown-option";
      option.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: #fff;
        font-size: 14px;
        transition: background 0.2s ease;
      `;
      option.textContent = slot.label;
      option.dataset.slotKey = slot.key;
      
      // Store handlers so we can remove them later
      const mouseEnterHandler = () => {
        if (option.style.opacity !== "0.5") {
          option.style.background = "#252525";
        }
      };
      const mouseLeaveHandler = () => {
        if (option.style.opacity !== "0.5") {
          option.style.background = "transparent";
        }
      };
      
      option.addEventListener("mouseenter", mouseEnterHandler);
      option.addEventListener("mouseleave", mouseLeaveHandler);
      
      option.addEventListener("click", async () => {
        // Skip if already disabled
        if (option.style.opacity === "0.5" || option.style.cursor === "not-allowed") {
          return;
        }

        const toVehicle = checkbox.checked;
        const originalText = option.textContent;
        option.textContent = "Unequipping...";
        option.style.pointerEvents = "none";
        
        try {
          const result = await unequipItem(slot.key, toVehicle);
          
          // Check if item was already unequipped (success: true or error: "Item not found!")
          if ((result.success === true) || 
              (result.error === "Item not found!" && result.errorCode === -1)) {
            // Disable the option and mark as empty
            option.textContent = "Empty";
            option.style.opacity = "0.5";
            option.style.cursor = "not-allowed";
            option.style.color = "#4a585c";
            option.style.pointerEvents = "none";
            // Remove hover effects
            option.removeEventListener("mouseenter", mouseEnterHandler);
            option.removeEventListener("mouseleave", mouseLeaveHandler);
          } else {
            // Successfully unequipped, restore text
            option.textContent = originalText;
            option.style.pointerEvents = "auto";
          }
          
          // Refresh all data after 100ms
          setTimeout(async () => {
            const panel = document.querySelector(`.${ARMOR_SETS_PANEL_CLASS}`);
            if (panel) {
              await refreshAllData(panel);
            }
          }, 100);
        } catch (error) {
          // Error occurred, restore text
          option.textContent = originalText;
          option.style.pointerEvents = "auto";
          console.error("[ArmorSets] Error unequipping item", error);
        }
      });
      unequipDropdown.appendChild(option);
    });

    // Position dropdown function
    const positionUnequipDropdown = () => {
      const rect = unequipBtn.getBoundingClientRect();
      unequipDropdown.style.top = `${rect.bottom + 4}px`;
      unequipDropdown.style.left = `${rect.left}px`;
      unequipDropdown.style.width = `${Math.max(rect.width, 200)}px`;
    };

    // Toggle dropdown
    unequipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (unequipDropdown.style.display === "none" || !unequipDropdown.parentElement) {
        positionUnequipDropdown();
        unequipDropdown.style.display = "block";
        document.body.appendChild(unequipDropdown);
      } else {
        unequipDropdown.style.display = "none";
        if (unequipDropdown.parentElement) {
          unequipDropdown.parentElement.removeChild(unequipDropdown);
        }
      }
    });

    // Close dropdown on click outside
    const closeUnequipDropdown = (e) => {
      if (unequipDropdown.style.display === "block" && 
          !unequipContainer.contains(e.target) && 
          !unequipDropdown.contains(e.target)) {
        unequipDropdown.style.display = "none";
        if (unequipDropdown.parentElement) {
          unequipDropdown.parentElement.removeChild(unequipDropdown);
        }
      }
    };

    // Close on scroll
    const closeOnScroll = () => {
      if (unequipDropdown.style.display === "block") {
        unequipDropdown.style.display = "none";
        if (unequipDropdown.parentElement) {
          unequipDropdown.parentElement.removeChild(unequipDropdown);
        }
      }
    };

    // Use one-time listeners that check if dropdown is open
    document.addEventListener("click", closeUnequipDropdown);
    window.addEventListener("scroll", closeOnScroll, true);

    unequipContainer.appendChild(unequipBtn);
    rightButtons.appendChild(unequipContainer);

    // Refresh button
    const refreshBtn = document.createElement("button");
    refreshBtn.textContent = "🔄 Refresh";
    refreshBtn.style.cssText = `
      background: #0A748F;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 4px 8px;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    refreshBtn.addEventListener("mouseenter", () => {
      refreshBtn.style.background = "#0b8aa8";
    });
    refreshBtn.addEventListener("mouseleave", () => {
      refreshBtn.style.background = "#0A748F";
    });
    refreshBtn.addEventListener("click", async () => {
      try {
        refreshBtn.disabled = true;
        refreshBtn.textContent = "Refreshing...";
        
        // Use refreshAllData which includes updateMissingItemIds
        await refreshAllData(panel);
        
        refreshBtn.textContent = "✓ Refreshed";
        setTimeout(() => {
          refreshBtn.textContent = "🔄 Refresh";
          refreshBtn.disabled = false;
        }, 1500);
      } catch (error) {
        console.error("[ArmorSets] Error refreshing items", error);
        refreshBtn.textContent = "✗ Error";
        setTimeout(() => {
          refreshBtn.textContent = "🔄 Refresh";
          refreshBtn.disabled = false;
        }, 2000);
      }
    });
    rightButtons.appendChild(refreshBtn);

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ New Set";
    addBtn.style.cssText = `
      background: #0A748F;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 4px 8px;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    addBtn.addEventListener("mouseenter", () => {
      addBtn.style.background = "#0b8aa8";
    });
    addBtn.addEventListener("mouseleave", () => {
      addBtn.style.background = "#0A748F";
    });
    addBtn.addEventListener("click", async () => {
      isCreatingSet = true;
      editingSetUuid = null; // Creating new set, not editing
      currentNewSet = { name: "", head: null, body: null, legs: null, feet: null };
      renderArmorSetsContent(panel);
      adjustPanelHeight(panel);
    });
    rightButtons.appendChild(addBtn);
    header.appendChild(rightButtons);

    listContainer.appendChild(header);

    // Render existing armor sets in 2-column grid
    if (armorSets.length > 0) {
      const setsGrid = document.createElement("div");
      setsGrid.className = "armor-sets-grid";
      setsGrid.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        box-sizing: border-box;
      `;
      
      // Create armor set rows asynchronously
      (async () => {
        for (const [index, set] of armorSets.entries()) {
          const setRow = await createArmorSetRow(set, index, panel);
          setsGrid.appendChild(setRow);
        }
        adjustPanelHeight(panel);
      })();
      
      listContainer.appendChild(setsGrid);
    } else {
      // Empty state
      const emptyState = document.createElement("div");
      emptyState.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #4a585c;
        font-size: 12px;
        text-align: center;
      `;
      emptyState.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
        <div>No armor sets saved yet</div>
        <div style="font-size: 10px; margin-top: 4px;">Click "+ New Set" to create your first armor set</div>
      `;
      listContainer.appendChild(emptyState);
    }

    panel.appendChild(listContainer);
  }

  // Adjust panel height based on content
  function adjustPanelHeight(panel) {
    setTimeout(() => {
      if (!panel.firstChild) {
        panel.style.height = "0px";
        return;
      }
      // Use scrollHeight to get the full content height including padding
      // This ensures padding/margin is preserved when content grows
      const contentHeight = panel.firstChild.scrollHeight;
      panel.style.height = `${Math.max(contentHeight, 100)}px`;
    }, 10);
  }

  // Render create set UI
  async function renderCreateSetUI(panel) {
    const container = document.createElement("div");
    container.style.cssText = `
      padding: 12px;
      box-sizing: border-box;
      min-height: fit-content;
    `;

    // Header
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #202327;
    `;

    const title = document.createElement("span");
    title.textContent = editingSetUuid ? "EDIT SET" : "CREATE NEW SET";
    title.style.cssText = `
      color: #0A748F;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
    `;
    header.appendChild(title);

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "← Back";
    cancelBtn.style.cssText = `
      background: transparent;
      border: 1px solid #0A748F;
      border-radius: 4px;
      color: #0A748F;
      padding: 4px 8px;
      font-size: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.background = "#0A748F";
      cancelBtn.style.color = "#fff";
    });
    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.background = "transparent";
      cancelBtn.style.color = "#0A748F";
    });
    cancelBtn.addEventListener("click", () => {
      isCreatingSet = false;
      editingSetUuid = null;
      currentNewSet = { name: "", head: null, body: null, legs: null, feet: null };
      renderArmorSetsContent(panel);
      adjustPanelHeight(panel);
    });
    header.appendChild(cancelBtn);

    container.appendChild(header);

    // Set name input
    const nameContainer = document.createElement("div");
    nameContainer.style.cssText = `margin-bottom: 12px;`;
    
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Set Name";
    nameLabel.style.cssText = `
      display: block;
      color: #4a585c;
      font-size: 10px;
      margin-bottom: 4px;
    `;
    nameContainer.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Enter set name...";
    nameInput.value = currentNewSet.name;
    nameInput.style.cssText = `
      width: 100%;
      padding: 8px;
      background: #1a1a1a;
      border: 1px solid #202327;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      box-sizing: border-box;
    `;
    nameInput.addEventListener("input", (e) => {
      currentNewSet.name = e.target.value;
    });
    nameContainer.appendChild(nameInput);
    container.appendChild(nameContainer);

    // Loading indicator
    const loadingDiv = document.createElement("div");
    loadingDiv.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #4a585c;
      font-size: 11px;
    `;
    loadingDiv.innerHTML = `
      <div style="
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.2);
        border-top-color: #0A748F;
        border-radius: 50%;
        animation: armor-sets-spin 1s linear infinite;
        margin-right: 8px;
      "></div>
      Loading items...
    `;
    container.appendChild(loadingDiv);
    panel.appendChild(container);
    adjustPanelHeight(panel);

    // Fetch items
    try {
      const data = await fetchItems();
      const items = data.items || [];
      
      // Remove loading
      loadingDiv.remove();
      
      // Create armor slots UI
      const slotsContainer = document.createElement("div");
      slotsContainer.className = "armor-slots-container";
      slotsContainer.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
      `;
      
      // Add responsive styles
      if (!document.getElementById("armor-sets-responsive-styles")) {
        const responsiveStyle = document.createElement("style");
        responsiveStyle.id = "armor-sets-responsive-styles";
        responsiveStyle.textContent = `
          @media (max-width: 700px) {
            .armor-slots-container {
              grid-template-columns: 1fr !important;
            }
            .armor-set-row {
              flex-direction: column !important;
            }
            .armor-set-actions {
              flex-direction: row !important;
              align-items: flex-start !important;
              width: 100%;
            }
          }
        `;
        document.head.appendChild(responsiveStyle);
      }

      // Create slot selectors asynchronously
      (async () => {
        for (const [slotKey, slotInfo] of Object.entries(ARMOR_SLOTS)) {
          const slotDiv = await createArmorSlotSelector(slotKey, slotInfo, items, panel);
          slotsContainer.appendChild(slotDiv);
        }
        adjustPanelHeight(panel);
      })();

      container.appendChild(slotsContainer);

      // Save button
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "💾 Save Set";
      saveBtn.style.cssText = `
        width: 100%;
        background: #0A748F;
        border: none;
        border-radius: 4px;
        color: white;
        padding: 10px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      saveBtn.addEventListener("mouseenter", () => {
        saveBtn.style.background = "#0b8aa8";
      });
      saveBtn.addEventListener("mouseleave", () => {
        saveBtn.style.background = "#0A748F";
      });
      saveBtn.addEventListener("click", () => {
        saveCurrentSet(panel);
      });
      container.appendChild(saveBtn);

      // After all slots are created, update displays for pre-selected items (when editing)
      setTimeout(() => {
        for (const [slotKey] of Object.entries(ARMOR_SLOTS)) {
          const slotDiv = slotsContainer.querySelector(`[data-slot="${slotKey}"]`);
          if (slotDiv && currentNewSet[slotKey]) {
            updateSlotDisplay(slotDiv, slotKey);
          }
        }
        adjustPanelHeight(panel);
      }, 50);
    } catch (error) {
      loadingDiv.innerHTML = `
        <span style="color: #FF4242;">Failed to load items. Please try again.</span>
      `;
    }
  }

  // Create armor slot selector
  async function createArmorSlotSelector(slotKey, slotInfo, items, panel) {
    const slotDiv = document.createElement("div");
    slotDiv.dataset.slot = slotKey;
    slotDiv.style.cssText = `
      background: #1a1a1a;
      border: 1px solid #202327;
      border-radius: 4px;
      padding: 8px;
    `;

    const slotHeader = document.createElement("div");
    slotHeader.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    `;

    const icon = document.createElement("span");
    icon.textContent = slotInfo.icon;
    icon.style.fontSize = "14px";
    slotHeader.appendChild(icon);

    const label = document.createElement("span");
    label.textContent = slotInfo.label;
    label.style.cssText = `
      color: #fff;
      font-size: 11px;
      font-weight: 600;
    `;
    slotHeader.appendChild(label);

    slotDiv.appendChild(slotHeader);

    // Get items for this slot type from all sources (inventory, vehicle, equipped)
    const slotItems = await getAllArmorItemsByType(slotInfo.type);

    // Custom dropdown container
    const dropdownContainer = document.createElement("div");
    dropdownContainer.style.cssText = `
      position: relative;
      width: 100%;
    `;

    // Dropdown button/display
    const dropdownButton = document.createElement("div");
    dropdownButton.className = `dropdown-button-${slotKey}`;
    const selectedItem = currentNewSet[slotKey];
    const displayText = selectedItem 
      ? selectedItem.name 
      : `Select ${slotInfo.label.toLowerCase()}...`;
    dropdownButton.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      background: #121212;
      border: 1px solid #202327;
      border-radius: 4px;
      color: ${selectedItem ? '#fff' : '#4a585c'};
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
    `;
    dropdownButton.innerHTML = `
      <span>${displayText}</span>
      <span style="font-size: 14px;">▼</span>
    `;

    // Dropdown options list - append to body to avoid overflow issues
    const dropdownList = document.createElement("div");
    dropdownList.className = `dropdown-list-${slotKey} armor-sets-dropdown`;
    dropdownList.style.cssText = `
      position: fixed;
      background: #1a1a1a;
      border: 1px solid #202327;
      border-radius: 4px;
      max-height: 300px;
      overflow-y: auto;
      z-index: 99999;
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      min-width: 200px;
    `;
    
    // Function to position dropdown relative to button
    const positionDropdown = () => {
      const rect = dropdownButton.getBoundingClientRect();
      dropdownList.style.top = `${rect.bottom + 4}px`;
      dropdownList.style.left = `${rect.left}px`;
      dropdownList.style.width = `${rect.width}px`;
    };
    
    // Add scrollbar styling
    if (!document.getElementById("armor-sets-dropdown-scrollbar")) {
      const scrollbarStyle = document.createElement("style");
      scrollbarStyle.id = "armor-sets-dropdown-scrollbar";
      scrollbarStyle.textContent = `
        .armor-sets-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .armor-sets-dropdown::-webkit-scrollbar-track {
          background: #121212;
          border-radius: 3px;
        }
        .armor-sets-dropdown::-webkit-scrollbar-thumb {
          background: #4a585c;
          border-radius: 3px;
        }
        .armor-sets-dropdown::-webkit-scrollbar-thumb:hover {
          background: #6a7a7f;
        }
      `;
      document.head.appendChild(scrollbarStyle);
    }

    // Empty option
    const emptyOption = document.createElement("div");
    emptyOption.className = "dropdown-option";
    emptyOption.dataset.value = "";
    emptyOption.style.cssText = `
      padding: 6px 10px;
      cursor: pointer;
      color: #4a585c;
      font-size: 14px;
      border-bottom: 1px solid #202327;
      transition: background 0.2s ease;
    `;
    emptyOption.textContent = `Select ${slotInfo.label.toLowerCase()}...`;
    emptyOption.addEventListener("mouseenter", () => {
      emptyOption.style.background = "#252525";
    });
    emptyOption.addEventListener("mouseleave", () => {
      emptyOption.style.background = "transparent";
    });
      emptyOption.addEventListener("click", () => {
      currentNewSet[slotKey] = null;
      dropdownButton.innerHTML = `<span>Select ${slotInfo.label.toLowerCase()}...</span><span style="font-size: 14px;">▼</span>`;
      dropdownButton.style.color = "#4a585c";
      dropdownList.style.display = "none";
      if (dropdownList.parentElement) {
        dropdownList.parentElement.removeChild(dropdownList);
      }
      updateSlotDisplay(slotDiv, slotKey);
      const panel = slotDiv.closest(`.${ARMOR_SETS_PANEL_CLASS}`);
      if (panel) adjustPanelHeight(panel);
    });
    dropdownList.appendChild(emptyOption);

    // Add item options
    slotItems.forEach(item => {
      const option = document.createElement("div");
      option.className = "dropdown-option";
      option.dataset.value = item.id;
      option.dataset.item = JSON.stringify(item);
      
      const imageUrl = getItemImageUrl(item.codename);
      const vars = item.vars || {};
      const traits = formatItemTraits(item);
      const hasTraits = traits.length > 0;
      
      // Compact layout - single line if no traits, expand if traits exist
      let optionHTML = `<div style="padding: ${hasTraits ? '8px' : '6px'} 10px; cursor: pointer; border-bottom: 1px solid #202327; transition: background 0.2s ease; line-height: 1.4;">`;
      
      // Item header with image, name, and stats inline
      optionHTML += `<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">`;
      if (imageUrl) {
        optionHTML += `<img src="${imageUrl}" alt="${item.name}" style="width: 24px; height: 24px; object-fit: contain; border-radius: 2px; border: 1px solid #202327; flex-shrink: 0;" onerror="this.style.display='none';">`;
      }
      optionHTML += `<div style="flex: 1; min-width: 0;">`;
      // Show quantity if more than 1
      const quantity = item.quantity || 1;
      const quantityDisplay = quantity > 1 ? ` <span style="color: #0A748F; font-size: 12px; font-weight: 400;">(x${quantity})</span>` : "";
      
      // Show source label (equipped, vehicle, or inventory)
      let sourceLabel = '';
      if (item._source === 'equipped') {
        sourceLabel = ' <span style="color: #4CAF50; font-size: 12px;">(equipped)</span>';
      } else if (item._source === 'vehicle') {
        sourceLabel = ' <span style="color: #0A748F; font-size: 12px;">(vehicle)</span>';
      } else if (item._source === 'inventory') {
        sourceLabel = ' <span style="color: #6a7a7f; font-size: 12px;">(inventory)</span>';
      }
      
      optionHTML += `<div style="color: #fff; font-size: 14px; font-weight: 600; display: inline;">${item.name}${sourceLabel}${quantityDisplay}</div>`;
      
      // Stats inline with name (compact)
      const stats = [];
      if (vars.defense_percent !== undefined) stats.push({ icon: "🛡️", value: `${vars.defense_percent}%` });
      if (vars.condition !== undefined) stats.push({ icon: "💚", value: `${vars.condition}%` });
      if (vars.weight !== undefined) stats.push({ icon: "⚖️", value: `${vars.weight}kg` });
      if (vars.durability !== undefined) stats.push({ icon: "🔧", value: vars.durability });
      
      if (stats.length > 0) {
        optionHTML += `<span style="color: #6a7a7f; font-size: 14px; margin-left: 8px;">`;
        stats.forEach((stat, idx) => {
          optionHTML += `<span style="margin-right: ${idx < stats.length - 1 ? '8px' : '0'};">${stat.icon} ${stat.value}</span>`;
        });
        optionHTML += `</span>`;
      }
      
      optionHTML += `</div>`;
      optionHTML += `</div>`;
      
      // Traits on separate line only if they exist
      if (hasTraits) {
        optionHTML += `<div style="margin-top: 6px; padding-left: ${imageUrl ? '34px' : '0'};">`;
        traits.forEach(traitDesc => {
          optionHTML += `<div style="color: #0A748F; font-size: 14px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">`;
          optionHTML += `<span>✨</span>`;
          optionHTML += `<span>${traitDesc}</span>`;
          optionHTML += `</div>`;
        });
        optionHTML += `</div>`;
      }
      
      optionHTML += `</div>`;
      option.innerHTML = optionHTML;
      
      // Hover effects
      option.addEventListener("mouseenter", () => {
        option.style.background = "#252525";
      });
      option.addEventListener("mouseleave", () => {
        option.style.background = "transparent";
      });
      
      // Click handler
      option.addEventListener("click", () => {
        // Remove the _source property before saving
        const { _source, ...itemToSave } = item;
        currentNewSet[slotKey] = itemToSave;
        dropdownButton.innerHTML = `<span>${item.name}</span><span style="font-size: 14px;">▼</span>`;
        dropdownButton.style.color = "#fff";
        dropdownList.style.display = "none";
        if (dropdownList.parentElement) {
          dropdownList.parentElement.removeChild(dropdownList);
        }
        updateSlotDisplay(slotDiv, slotKey);
        const panel = slotDiv.closest(`.${ARMOR_SETS_PANEL_CLASS}`);
        if (panel) adjustPanelHeight(panel);
      });
      
      dropdownList.appendChild(option);
    });

    // Toggle dropdown
    dropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownList.style.display === "block";
      if (!isOpen) {
        positionDropdown();
        document.body.appendChild(dropdownList);
        dropdownList.style.display = "block";
      } else {
        dropdownList.style.display = "none";
        if (dropdownList.parentElement) {
          dropdownList.parentElement.removeChild(dropdownList);
        }
      }
    });

    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
      if (!dropdownContainer.contains(e.target) && !dropdownList.contains(e.target)) {
        dropdownList.style.display = "none";
        if (dropdownList.parentElement) {
          dropdownList.parentElement.removeChild(dropdownList);
        }
      }
    };
    document.addEventListener("click", closeDropdown);
    
    // Also close on scroll to prevent positioning issues
    window.addEventListener("scroll", closeDropdown, true);

    dropdownContainer.appendChild(dropdownButton);
    slotDiv.appendChild(dropdownContainer);

    // Selected item display
    const selectedDisplay = document.createElement("div");
    selectedDisplay.className = `slot-selected-${slotKey}`;
    selectedDisplay.style.cssText = `
      margin-top: 6px;
      font-size: 9px;
      color: #4a585c;
    `;
    
    slotDiv.appendChild(selectedDisplay);

    // Initialize display if item is already selected (after DOM is ready)
    if (currentNewSet[slotKey]) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        updateSlotDisplay(slotDiv, slotKey);
      }, 0);
    }

    return slotDiv;
  }

  // Get item image URL from codename
  function getItemImageUrl(codename) {
    if (!codename) return null;
    return `https://www.zed.city/items/${codename}.webp`;
  }

  // Format item attributes for display
  function formatItemAttributes(item) {
    if (!item || !item.vars) return [];
    const attrs = [];
    const vars = item.vars;
    
    if (vars.desc) attrs.push({ label: "Description", value: vars.desc });
    if (vars.defense_percent !== undefined) attrs.push({ label: "Defense", value: `${vars.defense_percent}%` });
    if (vars.condition !== undefined) attrs.push({ label: "Condition", value: `${vars.condition}%` });
    if (vars.weight !== undefined) attrs.push({ label: "Weight", value: `${vars.weight}kg` });
    if (vars.durability !== undefined) attrs.push({ label: "Durability", value: vars.durability });
    
    return attrs;
  }

  // Format item attributes as compact inline string
  function formatItemAttributesInline(item) {
    if (!item || !item.vars) return "";
    const vars = item.vars;
    const parts = [];
    
    if (vars.defense_percent !== undefined) parts.push(`Def: ${vars.defense_percent}%`);
    if (vars.condition !== undefined) parts.push(`Cond: ${vars.condition}%`);
    if (vars.weight !== undefined) parts.push(`${vars.weight}kg`);
    if (vars.durability !== undefined) parts.push(`Dur: ${vars.durability}`);
    
    return parts.length > 0 ? ` [${parts.join(", ")}]` : "";
  }

  // Format item traits as compact inline string
  function formatItemTraitsInline(item) {
    if (!item || !item.traits || item.traits.length === 0) return "";
    const traitDescs = [];
    
    item.traits.forEach(trait => {
      if (trait.vars && trait.vars.effects) {
        trait.vars.effects.forEach(effect => {
          if (effect.desc) {
            traitDescs.push(effect.desc);
          }
        });
      }
    });
    
    return traitDescs.length > 0 ? ` | ${traitDescs.join(", ")}` : "";
  }

  // Format item traits for display
  function formatItemTraits(item) {
    if (!item || !item.traits || item.traits.length === 0) return [];
    const traitDescs = [];
    
    item.traits.forEach(trait => {
      if (trait.vars && trait.vars.effects) {
        trait.vars.effects.forEach(effect => {
          if (effect.desc) {
            traitDescs.push(effect.desc);
          }
        });
      }
    });
    
    return traitDescs;
  }

  // Update slot display after selection
  function updateSlotDisplay(slotDiv, slotKey) {
    const display = slotDiv.querySelector(`.slot-selected-${slotKey}`);
    if (display) {
      if (currentNewSet[slotKey]) {
        const item = currentNewSet[slotKey];
        
        // Check if item is marked as not found
        if (item.notFound) {
          display.innerHTML = `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #202327; color: #FF4242; font-size: 14px;">⚠️ Item not found (ID: ${item.id}) try refreshing</div>`;
          display.style.color = "#FF4242";
          return;
        }
        
        const attributes = formatItemAttributes(item);
        const traits = formatItemTraits(item);
        const imageUrl = getItemImageUrl(item.codename);
        
        // Compact horizontal layout
        let html = `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #202327; display: flex; gap: 8px; align-items: flex-start;">`;
        
        // Item image (small, on left)
        if (imageUrl) {
          html += `<div style="flex-shrink: 0;">`;
          html += `<img src="${imageUrl}" alt="${item.name}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 3px; border: 1px solid #202327; background: #121212;" onerror="this.style.display='none';">`;
          html += `</div>`;
        }
        
        // Details (on right)
        html += `<div style="flex: 1; min-width: 0;">`;
        // Show quantity if more than 1
        const quantity = item.quantity || 1;
        const quantityDisplay = quantity > 1 ? ` <span style="color: #0A748F; font-size: 12px; font-weight: 400;">(x${quantity})</span>` : "";
        html += `<div style="color: #0A748F; font-size: 14px; font-weight: 600; margin-bottom: 6px;">✓ ${item.name}${quantityDisplay}</div>`;
        
        // Stats with icons - matching dropdown style
        const vars = item.vars || {};
        const stats = [];
        if (vars.defense_percent !== undefined) stats.push({ icon: "🛡️", value: `${vars.defense_percent}%` });
        if (vars.condition !== undefined) stats.push({ icon: "💚", value: `${vars.condition}%` });
        if (vars.weight !== undefined) stats.push({ icon: "⚖️", value: `${vars.weight}kg` });
        if (vars.durability !== undefined) stats.push({ icon: "🔧", value: vars.durability });
        
        if (stats.length > 0) {
          html += `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">`;
          stats.forEach((stat, idx) => {
            html += `<span style="color: #6a7a7f; font-size: 14px; display: flex; align-items: center; gap: 3px;">`;
            html += `<span>${stat.icon}</span>`;
            html += `<span>${stat.value}</span>`;
            html += `</span>`;
          });
          html += `</div>`;
        }
        
        // Traits on separate lines
        if (traits.length > 0) {
          html += `<div style="margin-top: 4px;">`;
          traits.forEach(traitDesc => {
            html += `<div style="color: #0A748F; font-size: 14px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">`;
            html += `<span>✨</span>`;
            html += `<span>${traitDesc}</span>`;
            html += `</div>`;
          });
          html += `</div>`;
        }
        
        html += `</div>`;
        html += `</div>`;
        display.innerHTML = html;
        display.style.color = "#0A748F";
      } else {
        display.innerHTML = "";
        display.style.color = "#4a585c";
      }
    }
  }

  // Remove quantity from item before saving
  function cleanItemForSave(item) {
    if (!item) return null;
    // Save ID, codename, and traits for matching
    const savedItem = {
      id: item.id,
      codename: item.codename
    };
    
    // Save traits array (simplified - just codenames for matching)
    if (item.traits && Array.isArray(item.traits)) {
      savedItem.traits = item.traits.map(trait => trait.codename || trait.name).filter(Boolean);
    } else {
      savedItem.traits = [];
    }
    
    return savedItem;
  }

  // Get trait codenames from an item
  function getTraitCodenames(item) {
    if (!item || !item.traits || !Array.isArray(item.traits)) return [];
    return item.traits.map(trait => trait.codename || trait.name).filter(Boolean);
  }

  // Count matching traits between two items
  function countMatchingTraits(traits1, traits2) {
    const set1 = new Set(traits1);
    const set2 = new Set(traits2);
    let matches = 0;
    for (const trait of set1) {
      if (set2.has(trait)) matches++;
    }
    return matches;
  }

  // Find items by codename across all sources
  async function findItemsByCodename(codename) {
    if (!codename) return [];
    
    try {
      const itemsData = await fetchItems();
      const results = [];
      
      // Search in equipped items
      if (itemsData.equip && typeof itemsData.equip === 'object') {
        for (const [slotKey, slotItem] of Object.entries(itemsData.equip)) {
          if (slotItem && slotItem.codename === codename) {
            results.push({ item: slotItem, isVehicle: false, isEquipped: true, source: 'equipped' });
          }
        }
      }
      
      // Search in inventory items
      if (itemsData.items && Array.isArray(itemsData.items)) {
        itemsData.items.forEach(item => {
          if (item.codename === codename) {
            results.push({ item, isVehicle: false, isEquipped: false, source: 'inventory' });
          }
        });
      }
      
      // Search in vehicle_items
      if (itemsData.vehicle_items && Array.isArray(itemsData.vehicle_items)) {
        itemsData.vehicle_items.forEach(item => {
          if (item.codename === codename) {
            results.push({ item, isVehicle: true, isEquipped: false, source: 'vehicle' });
          }
        });
      }
      
      return results;
    } catch (error) {
      console.error("[ArmorSets] Error finding items by codename", error);
      return [];
    }
  }

  // Find item by ID or fallback to codename/traits matching
  async function findItemById(itemId, savedItemData = null) {
    if (!itemId && !savedItemData) return null;
    
    try {
      const itemsData = await fetchItems();
      
      // First try to find by ID if provided
      if (itemId) {
        // Search in equipped items
        if (itemsData.equip && typeof itemsData.equip === 'object') {
          for (const [slotKey, slotItem] of Object.entries(itemsData.equip)) {
            if (slotItem && slotItem.id === itemId) {
              return { item: slotItem, isVehicle: false, isEquipped: true };
            }
          }
        }
        
        // Then search in inventory items
        if (itemsData.items && Array.isArray(itemsData.items)) {
          const item = itemsData.items.find(i => i.id === itemId);
          if (item) {
            return { item, isVehicle: false, isEquipped: false };
          }
        }
        
        // If not found, search in vehicle_items
        if (itemsData.vehicle_items && Array.isArray(itemsData.vehicle_items)) {
          const item = itemsData.vehicle_items.find(i => i.id === itemId);
          if (item) {
            return { item, isVehicle: true, isEquipped: false };
          }
        }
      }
      
      // If ID not found and we have saved item data, search by codename and traits
      if (savedItemData && savedItemData.codename) {
        const candidates = await findItemsByCodename(savedItemData.codename);
        
        if (candidates.length === 0) {
          return null;
        }
        
        if (candidates.length === 1) {
          // Single match - return it
          return candidates[0];
        }
        
        // Multiple matches - try to match by traits
        if (savedItemData.traits && savedItemData.traits.length > 0) {
          const savedTraits = savedItemData.traits;
          
          // Score each candidate by trait matches
          const scored = candidates.map(candidate => {
            const candidateTraits = getTraitCodenames(candidate.item);
            const matches = countMatchingTraits(savedTraits, candidateTraits);
            return { ...candidate, traitMatches: matches };
          });
          
          // Sort by trait matches (descending)
          scored.sort((a, b) => b.traitMatches - a.traitMatches);
          
          // If the best match has more than 0 trait matches, or all have 0, use the best one
          if (scored[0].traitMatches > 0 || scored.every(s => s.traitMatches === 0)) {
            // If there's a clear winner (more matches than second place), return it
            if (scored.length === 1 || scored[0].traitMatches > scored[1].traitMatches) {
              return scored[0];
            }
          }
        }
        
        // Multiple matches with same trait score - need user selection
        return { multipleMatches: true, candidates };
      }
      
      return null;
    } catch (error) {
      console.error("[ArmorSets] Error finding item", error);
      return null;
    }
  }

  // Update saved item ID in local storage
  async function updateSavedItemId(set, slotKey, newId) {
    try {
      const armorSets = getArmorSets();
      const setIndex = armorSets.findIndex(s => s.uuid === set.uuid);
      if (setIndex !== -1 && armorSets[setIndex].items?.[slotKey]) {
        // Update the ID while preserving codename and traits
        armorSets[setIndex].items[slotKey] = {
          ...armorSets[setIndex].items[slotKey],
          id: newId
        };
        saveArmorSets(armorSets);
      }
    } catch (error) {
      console.error("[ArmorSets] Error updating saved item ID", error);
    }
  }

  // Show item selection dialog when multiple matches found
  function showItemSelectionDialog(candidates, savedItemData, slotKey, set, panel) {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      `;

      // Create dialog
      const dialog = document.createElement("div");
      dialog.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #202327;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      `;

      const title = document.createElement("div");
      title.textContent = `Multiple items found for ${savedItemData.codename || 'this item'}`;
      title.style.cssText = `
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
      `;
      dialog.appendChild(title);

      const subtitle = document.createElement("div");
      subtitle.textContent = "Please select the correct item:";
      subtitle.style.cssText = `
        color: #6a7a7f;
        font-size: 12px;
        margin-bottom: 16px;
      `;
      dialog.appendChild(subtitle);

      const candidatesList = document.createElement("div");
      candidatesList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      `;

      candidates.forEach((candidate, index) => {
        const item = candidate.item;
        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = `
          background: #121212;
          border: 2px solid #202327;
          border-radius: 4px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        `;

        const imageUrl = getItemImageUrl(item.codename);
        const vars = item.vars || {};
        const traits = formatItemTraits(item);
        const sourceLabel = candidate.isEquipped ? '(equipped)' : candidate.isVehicle ? '(vehicle)' : '(inventory)';

        let itemHTML = `<div style="display: flex; gap: 12px; align-items: flex-start;">`;
        
        if (imageUrl) {
          itemHTML += `<img src="${imageUrl}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 4px; border: 1px solid #202327; flex-shrink: 0;" onerror="this.style.display='none';">`;
        }
        
        itemHTML += `<div style="flex: 1;">`;
        itemHTML += `<div style="color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item.name} <span style="color: #0A748F; font-size: 12px;">${sourceLabel}</span></div>`;
        itemHTML += `<div style="color: #6a7a7f; font-size: 12px; margin-bottom: 4px;">ID: ${item.id}</div>`;
        
        // Stats
        const stats = [];
        if (vars.defense_percent !== undefined) stats.push(`🛡️ ${vars.defense_percent}%`);
        if (vars.condition !== undefined) stats.push(`💚 ${vars.condition}%`);
        if (vars.weight !== undefined) stats.push(`⚖️ ${vars.weight}kg`);
        if (stats.length > 0) {
          itemHTML += `<div style="color: #6a7a7f; font-size: 12px; margin-bottom: 4px;">${stats.join(' • ')}</div>`;
        }
        
        // Traits
        if (traits.length > 0) {
          itemHTML += `<div style="margin-top: 6px;">`;
          traits.forEach(traitDesc => {
            itemHTML += `<div style="color: #0A748F; font-size: 12px; margin-bottom: 2px;">✨ ${traitDesc}</div>`;
          });
          itemHTML += `</div>`;
        }
        
        itemHTML += `</div>`;
        itemHTML += `</div>`;
        
        itemDiv.innerHTML = itemHTML;

        itemDiv.addEventListener("mouseenter", () => {
          itemDiv.style.borderColor = "#0A748F";
          itemDiv.style.background = "#1f1f1f";
        });
        itemDiv.addEventListener("mouseleave", () => {
          itemDiv.style.borderColor = "#202327";
          itemDiv.style.background = "#121212";
        });
        itemDiv.addEventListener("click", () => {
          overlay.remove();
          resolve(candidate);
        });

        candidatesList.appendChild(itemDiv);
      });

      dialog.appendChild(candidatesList);

      // Cancel button
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText = `
        background: transparent;
        border: 1px solid #4a585c;
        border-radius: 4px;
        color: #4a585c;
        padding: 8px 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
      `;
      cancelBtn.addEventListener("mouseenter", () => {
        cancelBtn.style.background = "#4a585c";
        cancelBtn.style.color = "#fff";
      });
      cancelBtn.addEventListener("mouseleave", () => {
        cancelBtn.style.background = "transparent";
        cancelBtn.style.color = "#4a585c";
      });
      cancelBtn.addEventListener("click", () => {
        overlay.remove();
        resolve(null);
      });
      dialog.appendChild(cancelBtn);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      // Close on overlay click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
          resolve(null);
        }
      });
    });
  }

  // Update saved item ID in local storage
  async function updateSavedItemId(set, slotKey, newId) {
    try {
      const armorSets = getArmorSets();
      const setIndex = armorSets.findIndex(s => s.uuid === set.uuid);
      if (setIndex !== -1 && armorSets[setIndex].items?.[slotKey]) {
        // Update the ID while preserving codename and traits
        armorSets[setIndex].items[slotKey] = {
          ...armorSets[setIndex].items[slotKey],
          id: newId
        };
        saveArmorSets(armorSets);
      }
    } catch (error) {
      console.error("[ArmorSets] Error updating saved item ID", error);
    }
  }

  // Show item selection dialog when multiple matches found
  function showItemSelectionDialog(candidates, savedItemData, slotKey, set, panel) {
    return new Promise((resolve) => {
      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      `;

      // Create dialog
      const dialog = document.createElement("div");
      dialog.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #202327;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      `;

      const title = document.createElement("div");
      title.textContent = `Multiple items found for ${savedItemData.codename || 'this item'}`;
      title.style.cssText = `
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
      `;
      dialog.appendChild(title);

      const subtitle = document.createElement("div");
      subtitle.textContent = "Please select the correct item:";
      subtitle.style.cssText = `
        color: #6a7a7f;
        font-size: 12px;
        margin-bottom: 16px;
      `;
      dialog.appendChild(subtitle);

      const candidatesList = document.createElement("div");
      candidatesList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      `;

      candidates.forEach((candidate, index) => {
        const item = candidate.item;
        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = `
          background: #121212;
          border: 2px solid #202327;
          border-radius: 4px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        `;

        const imageUrl = getItemImageUrl(item.codename);
        const vars = item.vars || {};
        const traits = formatItemTraits(item);
        const sourceLabel = candidate.isEquipped ? '(equipped)' : candidate.isVehicle ? '(vehicle)' : '(inventory)';

        let itemHTML = `<div style="display: flex; gap: 12px; align-items: flex-start;">`;
        
        if (imageUrl) {
          itemHTML += `<img src="${imageUrl}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 4px; border: 1px solid #202327; flex-shrink: 0;" onerror="this.style.display='none';">`;
        }
        
        itemHTML += `<div style="flex: 1;">`;
        itemHTML += `<div style="color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item.name} <span style="color: #0A748F; font-size: 12px;">${sourceLabel}</span></div>`;
        itemHTML += `<div style="color: #6a7a7f; font-size: 12px; margin-bottom: 4px;">ID: ${item.id}</div>`;
        
        // Stats
        const stats = [];
        if (vars.defense_percent !== undefined) stats.push(`🛡️ ${vars.defense_percent}%`);
        if (vars.condition !== undefined) stats.push(`💚 ${vars.condition}%`);
        if (vars.weight !== undefined) stats.push(`⚖️ ${vars.weight}kg`);
        if (stats.length > 0) {
          itemHTML += `<div style="color: #6a7a7f; font-size: 12px; margin-bottom: 4px;">${stats.join(' • ')}</div>`;
        }
        
        // Traits
        if (traits.length > 0) {
          itemHTML += `<div style="margin-top: 6px;">`;
          traits.forEach(traitDesc => {
            itemHTML += `<div style="color: #0A748F; font-size: 12px; margin-bottom: 2px;">✨ ${traitDesc}</div>`;
          });
          itemHTML += `</div>`;
        }
        
        itemHTML += `</div>`;
        itemHTML += `</div>`;
        
        itemDiv.innerHTML = itemHTML;

        itemDiv.addEventListener("mouseenter", () => {
          itemDiv.style.borderColor = "#0A748F";
          itemDiv.style.background = "#1f1f1f";
        });
        itemDiv.addEventListener("mouseleave", () => {
          itemDiv.style.borderColor = "#202327";
          itemDiv.style.background = "#121212";
        });
        itemDiv.addEventListener("click", () => {
          overlay.remove();
          resolve(candidate);
        });

        candidatesList.appendChild(itemDiv);
      });

      dialog.appendChild(candidatesList);

      // Cancel button
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.cssText = `
        background: transparent;
        border: 1px solid #4a585c;
        border-radius: 4px;
        color: #4a585c;
        padding: 8px 16px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
      `;
      cancelBtn.addEventListener("mouseenter", () => {
        cancelBtn.style.background = "#4a585c";
        cancelBtn.style.color = "#fff";
      });
      cancelBtn.addEventListener("mouseleave", () => {
        cancelBtn.style.background = "transparent";
        cancelBtn.style.color = "#4a585c";
      });
      cancelBtn.addEventListener("click", () => {
        overlay.remove();
        resolve(null);
      });
      dialog.appendChild(cancelBtn);

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      // Close on overlay click
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
          resolve(null);
        }
      });
    });
  }

  // Save the current new set
  function saveCurrentSet(panel) {
    const setName = currentNewSet.name.trim() || `Set ${getArmorSets().length + 1}`;
    const armorSets = getArmorSets();
    
    if (editingSetUuid) {
      // Update existing set by UUID
      const setIndex = armorSets.findIndex(s => s.uuid === editingSetUuid);
      if (setIndex !== -1) {
        armorSets[setIndex] = {
          ...armorSets[setIndex],
          name: setName,
          items: {
            head: cleanItemForSave(currentNewSet.head),
            body: cleanItemForSave(currentNewSet.body),
            legs: cleanItemForSave(currentNewSet.legs),
            feet: cleanItemForSave(currentNewSet.feet)
          },
          updatedAt: Date.now()
        };
      }
    } else {
      // Create new set with UUID
      const newSet = {
        uuid: generateUUID(),
        name: setName,
        items: {
          head: cleanItemForSave(currentNewSet.head),
          body: cleanItemForSave(currentNewSet.body),
          legs: cleanItemForSave(currentNewSet.legs),
          feet: cleanItemForSave(currentNewSet.feet)
        },
        createdAt: Date.now()
      };
      armorSets.push(newSet);
    }

    saveArmorSets(armorSets);

    // Reset state and go back to list
    isCreatingSet = false;
    editingSetUuid = null;
    currentNewSet = { name: "", head: null, body: null, legs: null, feet: null };
    
    renderArmorSetsContent(panel);
    adjustPanelHeight(panel);
  }

  // Count items in a set
  function countSetItems(set) {
    if (!set.items) return 0;
    let count = 0;
    if (set.items.head) count++;
    if (set.items.body) count++;
    if (set.items.legs) count++;
    if (set.items.feet) count++;
    return count;
  }

  // Create armor set row
  // Equip individual item
  async function equipItem(itemId, isVehicle = false) {
    try {
      const token = await fetchCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["x-csrf-token"] = token;
      }

      const res = await fetch(`https://api.zed.city/equipItem?vehicle=${isVehicle}`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ item_id: itemId }),
      });

      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      return json;
    } catch (error) {
      console.error("[ArmorSets] Error equipping item", error);
      throw error;
    }
  }

  // Unequip item from slot
  async function unequipItem(slot, vehicle = false) {
    try {
      const token = await fetchCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["x-csrf-token"] = token;
      }

      const res = await fetch(`https://api.zed.city/unequipItem?vehicle=${vehicle}`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ slot: slot }),
      });

      const json = await res.json();
      // Return the response even if there's an error, so we can check for specific error codes
      return json;
    } catch (error) {
      console.error("[ArmorSets] Error unequipping item", error);
      throw error;
    }
  }

  async function createArmorSetRow(set, index, panel) {
    const row = document.createElement("div");
    row.className = "armor-set-row";
    const setUuidForRow = set.uuid || generateUUID();
    row.setAttribute("data-set-uuid", setUuidForRow);
    row.style.cssText = `
      background: #1a1a1a;
      border-radius: 4px;
      margin-bottom: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
    `;

    // Header row with set name and action buttons
    const headerRow = document.createElement("div");
    headerRow.className = "armor-set-header-row";
    headerRow.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      width: 100%;
      gap: 8px;
    `;

    // Set name
    const setName = document.createElement("div");
    setName.textContent = set.name || `Set ${index + 1}`;
    setName.style.cssText = `
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      flex: 1;
    `;
    headerRow.appendChild(setName);

    // Items grid (2 columns)
    const itemsContainer = document.createElement("div");
    itemsContainer.className = "armor-set-items-grid";
    itemsContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      width: 100%;
      align-items: stretch;
    `;
    
    // Add responsive styles for items grid and actions
    if (!document.getElementById("armor-set-items-grid-responsive")) {
      const itemsGridStyle = document.createElement("style");
      itemsGridStyle.id = "armor-set-items-grid-responsive";
      itemsGridStyle.textContent = `
        @media (max-width: 700px) {
          .armor-set-items-grid {
            grid-template-columns: 1fr !important;
          }
          .armor-set-header-row {
            flex-wrap: wrap;
          }
          .armor-set-actions {
            margin-left: auto;
            width: 100%;
            justify-content: flex-end;
            margin-top: 8px;
          }
        }
      `;
      document.head.appendChild(itemsGridStyle);
    }

    // Items with details
    for (const [slotKey, slotInfo] of Object.entries(ARMOR_SLOTS)) {
      const itemId = set.items?.[slotKey]?.id || set.items?.[slotKey];
      const itemDiv = document.createElement("div");
      itemDiv.style.cssText = `
        background: #121212;
        border: 1px solid #202327;
        border-radius: 4px;
        padding: 6px 8px;
        display: flex;
        flex-direction: column;
        height: 100%;
      `;

      if (itemId) {
        // Handle both old format (full object) and new format (just ID/codename/traits)
        const savedItemData = typeof itemId === 'object' ? itemId : { id: itemId };
        const actualItemId = savedItemData.id;
        
        // Find item by ID, with fallback to codename/traits matching
        const itemResult = await findItemById(actualItemId, savedItemData);
        
        if (!itemResult) {
          // Item not found, show empty
          itemDiv.innerHTML = `
            <div style="color: #4a585c; font-size: 14px; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
              Item not found in the inventory or vehicle, try refreshing
            </div>
          `;
          itemsContainer.appendChild(itemDiv);
          continue;
        }
        
        // Handle multiple matches - show selection UI
        if (itemResult.multipleMatches) {
          const selectedItem = await showItemSelectionDialog(itemResult.candidates, savedItemData, slotKey, set, panel);
          if (!selectedItem) {
            // User cancelled or closed dialog
            itemDiv.innerHTML = `
              <div style="color: #4a585c; font-size: 14px; display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
                Item selection cancelled
              </div>
            `;
            itemsContainer.appendChild(itemDiv);
            continue;
          }
          // Update saved item with new ID
          await updateSavedItemId(set, slotKey, selectedItem.item.id);
          // Use the selected item
          const item = selectedItem.item;
          const isVehicle = selectedItem.isVehicle;
          const isEquipped = selectedItem.isEquipped;
          
          // Render item display (continue with existing code)
          const imageUrl = getItemImageUrl(item.codename);
          const vars = item.vars || {};
          const traits = formatItemTraits(item);
          const quantity = item.quantity || 1;
          const quantityDisplay = quantity > 1 ? ` <span style="color: #0A748F; font-size: 12px;">(x${quantity})</span>` : "";

          let itemHTML = `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">`;
          
          // Item image
          if (imageUrl) {
            itemHTML += `<img src="${imageUrl}" alt="${item.name}" style="width: 24px; height: 24px; object-fit: contain; border-radius: 3px; border: 1px solid #202327; flex-shrink: 0;" onerror="this.style.display='none';">`;
          }
          
          // Item name and quantity
          itemHTML += `<div style="flex: 1; min-width: 0;">`;
          const vehicleLabel = isVehicle ? ' <span style="color: #0A748F; font-size: 12px;">(vehicle)</span>' : '';
          const equippedLabel = isEquipped ? ' <span style="color: #4CAF50; font-size: 12px;">(equipped)</span>' : '';
          itemHTML += `<div style="color: #fff; font-size: 14px; font-weight: 600;">${slotInfo.icon} ${item.name}${equippedLabel}${vehicleLabel}${quantityDisplay}</div>`;
          
          // Stats with icons
          const stats = [];
          if (vars.defense_percent !== undefined) stats.push({ icon: "🛡️", value: `${vars.defense_percent}%` });
          if (vars.condition !== undefined) stats.push({ icon: "💚", value: `${vars.condition}%` });
          if (vars.weight !== undefined) stats.push({ icon: "⚖️", value: `${vars.weight}kg` });
          if (vars.durability !== undefined) stats.push({ icon: "🔧", value: vars.durability });
          
          if (stats.length > 0) {
            itemHTML += `<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 3px;">`;
            stats.forEach(stat => {
              itemHTML += `<span style="color: #6a7a7f; font-size: 14px; display: flex; align-items: center; gap: 3px;">`;
              itemHTML += `<span>${stat.icon}</span>`;
              itemHTML += `<span>${stat.value}</span>`;
              itemHTML += `</span>`;
            });
            itemHTML += `</div>`;
          }
          
          // Traits
          if (traits.length > 0) {
            itemHTML += `<div style="margin-top: 4px;">`;
            traits.forEach(traitDesc => {
              itemHTML += `<div style="color: #0A748F; font-size: 14px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">`;
              itemHTML += `<span>✨</span>`;
              itemHTML += `<span>${traitDesc}</span>`;
              itemHTML += `</div>`;
            });
            itemHTML += `</div>`;
          }
          
          itemHTML += `</div>`;
          itemHTML += `</div>`;
          
          // Equip button
          itemHTML += `<div style="margin-top: auto; padding-top: 6px;">`;
          itemHTML += `<button class="equip-item-btn" data-item-id="${item.id}" style="
            background: #0A748F;
            border: none;
            border-radius: 4px;
            color: white;
            padding: 4px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
          ">⚔️ Equip</button>`;
          itemHTML += `</div>`;
          
          itemDiv.innerHTML = itemHTML;
          
          // Add equip button event listener
          const equipBtn = itemDiv.querySelector(".equip-item-btn");
          if (equipBtn) {
            equipBtn.addEventListener("mouseenter", () => {
              equipBtn.style.background = "#0b8aa8";
            });
            equipBtn.addEventListener("mouseleave", () => {
              equipBtn.style.background = "#0A748F";
            });
            equipBtn.addEventListener("click", async () => {
              try {
                equipBtn.disabled = true;
                equipBtn.textContent = "Equipping...";
                await equipItem(item.id, isVehicle);
                equipBtn.textContent = "✓ Equipped";
                
                // Refresh all data after 100ms
                setTimeout(async () => {
                  const panel = row.closest(`.${ARMOR_SETS_PANEL_CLASS}`);
                  if (panel) {
                    await refreshAllData(panel);
                  }
                }, 100);
                
                setTimeout(() => {
                  equipBtn.textContent = "⚔️ Equip";
                  equipBtn.disabled = false;
                }, 2000);
              } catch (error) {
                equipBtn.textContent = "✗ Error";
                setTimeout(() => {
                  equipBtn.textContent = "⚔️ Equip";
                  equipBtn.disabled = false;
                }, 2000);
              }
            });
          }
          
          itemsContainer.appendChild(itemDiv);
          continue;
        }
        
        // Update saved ID if it changed (item found via codename/traits matching)
        if (itemResult.item && actualItemId && itemResult.item.id !== actualItemId) {
          await updateSavedItemId(set, slotKey, itemResult.item.id);
        }
        
        const item = itemResult.item;
        const isVehicle = itemResult.isVehicle;
        const isEquipped = itemResult.isEquipped;
        const imageUrl = getItemImageUrl(item.codename);
        const vars = item.vars || {};
        const traits = formatItemTraits(item);
        const quantity = item.quantity || 1;
        const quantityDisplay = quantity > 1 ? ` <span style="color: #0A748F; font-size: 12px;">(x${quantity})</span>` : "";

        let itemHTML = `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">`;
        
        // Item image
        if (imageUrl) {
          itemHTML += `<img src="${imageUrl}" alt="${item.name}" style="width: 24px; height: 24px; object-fit: contain; border-radius: 3px; border: 1px solid #202327; flex-shrink: 0;" onerror="this.style.display='none';">`;
        }
        
        // Item name and quantity
        itemHTML += `<div style="flex: 1; min-width: 0;">`;
        const vehicleLabel = isVehicle ? ' <span style="color: #0A748F; font-size: 12px;">(vehicle)</span>' : '';
        const equippedLabel = isEquipped ? ' <span style="color: #4CAF50; font-size: 12px;">(equipped)</span>' : '';
        itemHTML += `<div style="color: #fff; font-size: 14px; font-weight: 600;">${slotInfo.icon} ${item.name}${equippedLabel}${vehicleLabel}${quantityDisplay}</div>`;
        
        // Stats with icons
        const stats = [];
        if (vars.defense_percent !== undefined) stats.push({ icon: "🛡️", value: `${vars.defense_percent}%` });
        if (vars.condition !== undefined) stats.push({ icon: "💚", value: `${vars.condition}%` });
        if (vars.weight !== undefined) stats.push({ icon: "⚖️", value: `${vars.weight}kg` });
        if (vars.durability !== undefined) stats.push({ icon: "🔧", value: vars.durability });
        
        if (stats.length > 0) {
          itemHTML += `<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 3px;">`;
          stats.forEach(stat => {
            itemHTML += `<span style="color: #6a7a7f; font-size: 14px; display: flex; align-items: center; gap: 3px;">`;
            itemHTML += `<span>${stat.icon}</span>`;
            itemHTML += `<span>${stat.value}</span>`;
            itemHTML += `</span>`;
          });
          itemHTML += `</div>`;
        }
        
        // Traits
        if (traits.length > 0) {
          itemHTML += `<div style="margin-top: 4px;">`;
          traits.forEach(traitDesc => {
            itemHTML += `<div style="color: #0A748F; font-size: 14px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">`;
            itemHTML += `<span>✨</span>`;
            itemHTML += `<span>${traitDesc}</span>`;
            itemHTML += `</div>`;
          });
          itemHTML += `</div>`;
        }
        
        itemHTML += `</div>`;
        itemHTML += `</div>`;
        
        // Equip button - use margin-top: auto to push to bottom
        itemHTML += `<div style="margin-top: auto; padding-top: 6px;">`;
        itemHTML += `<button class="equip-item-btn" data-item-id="${item.id}" style="
          background: #0A748F;
          border: none;
          border-radius: 4px;
          color: white;
          padding: 4px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        ">⚔️ Equip</button>`;
        itemHTML += `</div>`;
        
        itemDiv.innerHTML = itemHTML;
        
        // Add equip button event listener
        const equipBtn = itemDiv.querySelector(".equip-item-btn");
        if (equipBtn) {
          equipBtn.addEventListener("mouseenter", () => {
            equipBtn.style.background = "#0b8aa8";
          });
          equipBtn.addEventListener("mouseleave", () => {
            equipBtn.style.background = "#0A748F";
          });
          // Always allow equipping, even if already equipped
          equipBtn.addEventListener("click", async () => {
            try {
              equipBtn.disabled = true;
              equipBtn.textContent = "Equipping...";
              await equipItem(item.id, isVehicle);
              equipBtn.textContent = "✓ Equipped";
              
              // Refresh all data after 100ms
              setTimeout(async () => {
                const panel = row.closest(`.${ARMOR_SETS_PANEL_CLASS}`);
                if (panel) {
                  await refreshAllData(panel);
                }
              }, 100);
              
              setTimeout(() => {
                equipBtn.textContent = "⚔️ Equip";
                equipBtn.disabled = false;
              }, 2000);
            } catch (error) {
              equipBtn.textContent = "✗ Error";
              setTimeout(() => {
                equipBtn.textContent = "⚔️ Equip";
                equipBtn.disabled = false;
              }, 2000);
            }
          });
        }
      } else {
        itemDiv.innerHTML = `
          <div style="color: #4a585c; font-size: 14px; display: flex; align-items: center; gap: 6px;">
            ${slotInfo.icon} <span>Empty</span>
          </div>
        `;
      }

      itemsContainer.appendChild(itemDiv);
    }

    // Action buttons container - horizontal layout
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "armor-set-actions";
    actionsContainer.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    `;

    // Remove set button with confirmation (first button)
    let isConfirmingDelete = false;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "🗑️";
    removeBtn.style.cssText = `
      background: transparent;
      border: 1px solid #FF4242;
      border-radius: 4px;
      color: #FF4242;
      padding: 6px 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      box-sizing: border-box;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    removeBtn.addEventListener("mouseenter", () => {
      if (!isConfirmingDelete) {
        removeBtn.style.background = "#FF4242";
        removeBtn.style.color = "#fff";
      } else {
        removeBtn.style.background = "rgba(255, 66, 66, 0.5)";
      }
    });
    removeBtn.addEventListener("mouseleave", () => {
      if (!isConfirmingDelete) {
        removeBtn.style.background = "transparent";
        removeBtn.style.color = "#FF4242";
      } else {
        removeBtn.style.background = "rgba(255, 66, 66, 0.3)";
      }
    });
    removeBtn.addEventListener("click", () => {
      if (!isConfirmingDelete) {
        // Show confirmation
        isConfirmingDelete = true;
        removeBtn.textContent = "Delete set";
        removeBtn.style.background = "rgba(255, 66, 66, 0.3)";
        removeBtn.style.color = "#FF4242";
        removeBtn.style.padding = "6px 12px";
        removeBtn.style.fontSize = "12px";
        removeBtn.style.height = "28px";
        
        
        // editBtn.style.display = "none";
        
        // Add cancel button
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel Set Deletion";
        cancelBtn.style.cssText = `
          background: transparent;
          border: 1px solid #4a585c;
          border-radius: 4px;
          color: #4a585c;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-sizing: border-box;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        cancelBtn.addEventListener("mouseenter", () => {
          cancelBtn.style.background = "#4a585c";
          cancelBtn.style.color = "#fff";
        });
        cancelBtn.addEventListener("mouseleave", () => {
          cancelBtn.style.background = "transparent";
          cancelBtn.style.color = "#4a585c";
        });
        cancelBtn.addEventListener("click", () => {
          isConfirmingDelete = false;
          removeBtn.textContent = "🗑️";
          removeBtn.style.background = "transparent";
          removeBtn.style.color = "#FF4242";
          removeBtn.style.padding = "6px 8px";
          removeBtn.style.fontSize = "14px";
          removeBtn.style.height = "28px";
          // Show Edit Set button again
          editBtn.style.display = "";
          cancelBtn.remove();
        });
        // Insert cancel button after remove button (before view button)
        actionsContainer.insertBefore(cancelBtn, removeBtn.nextSibling);
      } else {
        // Confirm deletion by UUID
        const armorSets = getArmorSets();
        const setUuid = set.uuid || (() => {
          // Migration: if set doesn't have UUID, generate one and remove by index
          const uuid = generateUUID();
          armorSets[index].uuid = uuid;
          return uuid;
        })();
        const setIndex = armorSets.findIndex(s => s.uuid === setUuid);
        if (setIndex !== -1) {
          armorSets.splice(setIndex, 1);
          saveArmorSets(armorSets);
        }
        renderArmorSetsContent(panel);
        adjustPanelHeight(panel);
      }
    });
    actionsContainer.appendChild(removeBtn);

    // Edit set button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit Set";
    editBtn.style.cssText = `
      background: #0A748F;
      border: none;
      border-radius: 4px;
      color: white;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      box-sizing: border-box;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    editBtn.addEventListener("mouseenter", () => {
      editBtn.style.background = "#0b8aa8";
    });
    editBtn.addEventListener("mouseleave", () => {
      editBtn.style.background = "#0A748F";
    });
    editBtn.addEventListener("click", async () => {
      // Enter edit mode - set UUID to track which set we're editing
      const setUuid = set.uuid || generateUUID(); // Generate UUID if missing (migration)
      if (!set.uuid) {
        // Migrate existing set to have UUID
        const armorSets = getArmorSets();
        const setIndex = armorSets.findIndex(s => s === set);
        if (setIndex !== -1) {
          armorSets[setIndex].uuid = setUuid;
          saveArmorSets(armorSets);
        }
      }
      
      isCreatingSet = true;
      editingSetUuid = setUuid; // Track which set we're editing
      
      // Load item data from IDs
      const loadedItems = {
        head: null,
        body: null,
        legs: null,
        feet: null
      };
      
      for (const slotKey of ['head', 'body', 'legs', 'feet']) {
        const itemData = set.items?.[slotKey];
        if (itemData) {
          // Handle both old format (full object) and new format (just ID/codename/traits)
          const savedItemData = typeof itemData === 'object' ? itemData : { id: itemData };
          const itemId = savedItemData.id;
          if (itemId || savedItemData.codename) {
            const result = await findItemById(itemId, savedItemData);
            if (result && !result.multipleMatches) {
              loadedItems[slotKey] = result.item;
              // Update saved ID if it changed
              if (result.item.id !== itemId) {
                await updateSavedItemId(set, slotKey, result.item.id);
              }
            } else if (result && result.multipleMatches) {
              // Show selection dialog in edit mode
              const selectedItem = await showItemSelectionDialog(result.candidates, savedItemData, slotKey, set, panel);
              if (selectedItem) {
                loadedItems[slotKey] = selectedItem.item;
                await updateSavedItemId(set, slotKey, selectedItem.item.id);
              } else {
                loadedItems[slotKey] = { notFound: true, id: itemId || 'unknown' };
              }
            } else {
              // Item not found - mark as not found
              loadedItems[slotKey] = { notFound: true, id: itemId || 'unknown' };
            }
          }
        }
      }
      
      currentNewSet = {
        name: set.name || "",
        head: loadedItems.head,
        body: loadedItems.body,
        legs: loadedItems.legs,
        feet: loadedItems.feet
      };
      // Don't remove the set - it will be updated on save
      renderArmorSetsContent(panel);
      adjustPanelHeight(panel);
    });
    actionsContainer.appendChild(editBtn);

    // View/Hide button
    const viewHideBtn = document.createElement("button");
    viewHideBtn.className = "armor-set-view-btn";
    const setUuid = setUuidForRow;
    const isCurrentlyViewed = viewedSetUuid === setUuid;
    viewHideBtn.textContent = isCurrentlyViewed ? "👁️ Hide" : "👁️ View";
    viewHideBtn.style.cssText = `
      background: ${isCurrentlyViewed ? "#4a585c" : "transparent"};
      border: 1px solid #4a585c;
      border-radius: 4px;
      color: #fff;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      box-sizing: border-box;
      margin-left: auto;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    viewHideBtn.addEventListener("mouseenter", () => {
      const currentState = viewedSetUuid === setUuid;
      if (!currentState) {
        viewHideBtn.style.background = "#4a585c";
      }
    });
    viewHideBtn.addEventListener("mouseleave", () => {
      const currentState = viewedSetUuid === setUuid;
      if (!currentState) {
        viewHideBtn.style.background = "transparent";
      }
    });
    viewHideBtn.addEventListener("click", () => {
      const currentlyViewed = viewedSetUuid === setUuid;
      
      // Close any previously viewed set
      if (viewedSetUuid && viewedSetUuid !== setUuid) {
        const previousRow = document.querySelector(`[data-set-uuid="${viewedSetUuid}"]`);
        if (previousRow) {
          const previousWrapper = previousRow.querySelector(".armor-set-items-wrapper");
          const previousBtn = previousRow.querySelector(".armor-set-view-btn");
          if (previousWrapper) {
            previousWrapper.style.display = "none";
          }
          if (previousBtn) {
            previousBtn.textContent = "👁️ View";
            previousBtn.style.background = "transparent";
          }
        }
      }

      // Toggle current set
      if (currentlyViewed) {
        // Hide
        viewedSetUuid = null;
        itemsWrapper.style.display = "none";
        viewHideBtn.textContent = "👁️ View";
        viewHideBtn.style.background = "transparent";
      } else {
        // Show
        viewedSetUuid = setUuid;
        itemsWrapper.style.display = "block";
        viewHideBtn.textContent = "👁️ Hide";
        viewHideBtn.style.background = "#4a585c";
      }
      adjustPanelHeight(panel);
    });
    actionsContainer.appendChild(viewHideBtn);
    headerRow.appendChild(actionsContainer);

    // Items container (full width below header)
    const itemsWrapper = document.createElement("div");
    itemsWrapper.className = "armor-set-items-wrapper";
    itemsWrapper.style.cssText = `
      width: 100%;
      display: ${isCurrentlyViewed ? "block" : "none"};
    `;
    itemsWrapper.appendChild(itemsContainer);

    row.appendChild(headerRow);
    row.appendChild(itemsWrapper);

    return row;
  }

  // Equip armor set (placeholder - you can implement the actual equip logic)
  async function equipArmorSet(set) {
    console.log("[ArmorSets] Equipping set:", set);
    // TODO: Implement actual equip API calls
    // For each item in the set, call the equip API
    alert(`Equipping set: ${set.name}\n\nThis will equip:\n- Head: ${set.items?.head?.name || 'None'}\n- Body: ${set.items?.body?.name || 'None'}\n- Legs: ${set.items?.legs?.name || 'None'}\n- Feet: ${set.items?.feet?.name || 'None'}`);
  }

  // Toggle the armor sets panel
  function toggleArmorSetsPanel(armorSetsBtn) {
    const existingPanel = document.querySelector(`.${ARMOR_SETS_PANEL_CLASS}`);

    if (existingPanel) {
      // Animate panel closing
      existingPanel.style.height = "0";
      existingPanel.style.marginBottom = "0";
      isArmorSetsPanelOpen = false;
      
      // Update button style - remove selected class
      armorSetsBtn.classList.remove("selected");

      setTimeout(() => {
        existingPanel.remove();
      }, 300);
    } else {
      // Find insertion point - after the tablist container that has "Inventory"
      const tablist = findInventoryTablist();
      if (!tablist) return;

      // Create and insert panel after the tablist's parent container
      const panel = createArmorSetsPanel();

      // Insert after the tablist parent
      const tabsContainer = tablist.closest(".q-tabs") || tablist.parentElement;
      if (tabsContainer && tabsContainer.parentElement) {
        if (tabsContainer.nextSibling) {
          tabsContainer.parentElement.insertBefore(panel, tabsContainer.nextSibling);
        } else {
          tabsContainer.parentElement.appendChild(panel);
        }
      }

      // Show loading state
      panel.appendChild(createLoadingSpinner());

      // Trigger reflow then animate
      panel.offsetHeight;
      panel.style.height = "50px";
      panel.style.marginBottom = "6px";

      isArmorSetsPanelOpen = true;

      // Update button style - add selected class
      armorSetsBtn.classList.add("selected");

      // Render content
      setTimeout(() => {
        renderArmorSetsContent(panel);
        
        // Adjust panel height based on content
        const contentHeight = panel.firstChild ? panel.firstChild.scrollHeight : 100;
        panel.style.height = `${Math.max(contentHeight, 100)}px`;
      }, 100);
    }
  }

  // Inject CSS styles for the armor sets tab
  function injectTabStyles() {
    if (document.getElementById("armor-sets-tab-styles")) return;
    
    const style = document.createElement("style");
    style.id = "armor-sets-tab-styles";
    style.textContent = `
      .${ARMOR_SETS_TAB_CLASS} {
        padding: 10px;
        text-align: center;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        border-right: 1px solid rgb(0, 0, 0);
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.05em;
        font-size: 9px;
        white-space: nowrap;
        background: linear-gradient(#25282d, #090a0b);
        cursor: pointer;
        color: #ffffffb3;
      }
      
      .${ARMOR_SETS_TAB_CLASS}:hover {
        color: #ffffff;
      }
      
      .${ARMOR_SETS_TAB_CLASS}.selected {
        color: #fff;
        background: linear-gradient(#090a0b, #17191c);
      }
    `;
    document.head.appendChild(style);
  }

  // Create the Armor Sets tab element matching the exact structure of INVENTORY/VEHICLE tabs
  function createArmorSetsTab(existingTab) {
    // Inject styles first
    injectTabStyles();
    
    // Outer container - filter-btn
    const armorSetsBtn = document.createElement("div");
    armorSetsBtn.className = "filter-btn non-selectable full-width full-height relative-position";
    armorSetsBtn.classList.add(ARMOR_SETS_TAB_CLASS);

    // Row container
    const rowContainer = document.createElement("div");
    rowContainer.className = "row items-center full-width full-height";

    // Col container
    const colContainer = document.createElement("div");
    colContainer.className = "col";

    // Inner row with text
    const innerRow = document.createElement("div");
    innerRow.className = "row justify-between q-col-gutter-sm item-filter-text no-wrap";

    // Text div
    const textDiv = document.createElement("div");
    textDiv.textContent = "Armor Sets";

    // Build the structure
    innerRow.appendChild(textDiv);
    colContainer.appendChild(innerRow);
    rowContainer.appendChild(colContainer);
    armorSetsBtn.appendChild(rowContainer);

    armorSetsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("[ArmorSets] Tab clicked");
      toggleArmorSetsPanel(armorSetsBtn);
    });

    console.log("[ArmorSets] Created tab element:", armorSetsBtn);
    return armorSetsBtn;
  }

  // Insert the Armor Sets tab into the tablist
  function insertArmorSetsTab() {
    if (document.querySelector(`.${ARMOR_SETS_TAB_CLASS}`)) {
      console.log("[ArmorSets] Tab already exists, skipping");
      return;
    }

    const tablistContainer = findTablistContainer();
    if (!tablistContainer) {
      console.log("[ArmorSets] No tablist container found");
      return;
    }

    const existingTab = findExistingTab();
    console.log("[ArmorSets] Existing tab found:", existingTab);
    
    const armorSetsTab = createArmorSetsTab(existingTab);

    // Append to the tablist container
    tablistContainer.appendChild(armorSetsTab);
    console.log("[ArmorSets] Tab inserted successfully into:", tablistContainer);
  }

  // Initialize the script
  function init() {
    console.log("[ArmorSets] Init called, pathname:", window.location.pathname);
    
    if (!isDesiredPage()) {
      console.log("[ArmorSets] Not on inventory page, skipping");
      return;
    }

    console.log("[ArmorSets] On inventory page, attempting to insert tab");

    if (insertArmorSetsTabWithRetry()) {
      console.log("[ArmorSets] Tab inserted on first try");
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(`.${ARMOR_SETS_TAB_CLASS}`)) {
        observer.disconnect();
        return;
      }

      const tablistContainer = findTablistContainer();
      if (tablistContainer) {
        insertArmorSetsTab();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
    }, 15000);
  }

  function insertArmorSetsTabWithRetry() {
    const tablistContainer = findTablistContainer();
    if (tablistContainer) {
      insertArmorSetsTab();
      return true;
    }
    return false;
  }

  let currentPathname = window.location.pathname;

  function handleUrlChange() {
    const newPathname = window.location.pathname;
    if (newPathname !== currentPathname) {
      currentPathname = newPathname;

      const existingTab = document.querySelector(`.${ARMOR_SETS_TAB_CLASS}`);
      if (existingTab) {
        existingTab.remove();
      }
      const existingPanel = document.querySelector(`.${ARMOR_SETS_PANEL_CLASS}`);
      if (existingPanel) {
        existingPanel.remove();
      }
      isArmorSetsPanelOpen = false;

      if (isDesiredPage()) {
        setTimeout(init, 500);
      }
    }
  }

  window.addEventListener("popstate", () => setTimeout(handleUrlChange, 100));

  const navigationObserver = new MutationObserver(() => {
    if (window.location.pathname !== currentPathname) {
      handleUrlChange();
    }
    if (isDesiredPage() && !document.querySelector(`.${ARMOR_SETS_TAB_CLASS}`)) {
      const tablistContainer = findTablistContainer();
      if (tablistContainer) {
        insertArmorSetsTab();
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  navigationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
