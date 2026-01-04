// ==UserScript==
// @name         ASTRIX Zed City Explorer Helper
// @namespace    https://www.zed.city/
// @version      1.0.2
// @description  Zed City Explorer Helper
// @author       ASTRIX & Opus 4.5
// @match        https://www.zed.city/*
// @match        https://zed.city/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/561202/ASTRIX%20Zed%20City%20Explorer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/561202/ASTRIX%20Zed%20City%20Explorer%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const HELPER_CLASS = "zed-explore-helper-box";
  const TRAVELING_BTN_CLASS = "zed-update-inventory-btn";
  const API_ITEMS = "https://api.zed.city/loadItems";
  const API_ADD_ITEM = "https://api.zed.city/vehicleAddItem";
  const API_UNLOAD_ITEM = "https://api.zed.city/unloadItem?vehicle=true";
  const API_CSRF_TOKEN = "https://api.zed.city/csrfToken";

  // Zone requirements for each explore location
  const ZONE_REQUIREMENTS = {
    0: {
      name: "Fuel Depot",
      zones: [
        { zone: 1, name: "Secure Panel", items: [{ name: "Security Card", quantity: 1 }] }
      ]
    },
    1: {
      name: "Construction Yard",
      zones: [
        { zone: 1, name: "Secure Lockup Door", items: [{ name: "Lockpick", quantity: 1 }] },
        { zone: 2, name: "Security Vault", items: [{ name: "Explosives", quantity: 1 }] }
      ]
    },
    2: {
      name: "Demolition Site",
      zones: [
        { zone: 1, name: "Secure Gate", items: [{ name: "Lockpick", quantity: 1 }] }
      ]
    },
    3: {
      name: "Research Facility",
      zones: [
        { zone: 1, name: "Serum Storage", items: [{ name: "Splicer", quantity: 1 }] }
      ]
    },
    4: {
      name: "Reclaim Zone",
      zones: []
    },
    5: {
      name: "Fishing Reserve",
      zones: []
    },
    6: {
      name: "Military Base",
      zones: [
        { zone: 1, name: "Enter Barracks", items: [{ name: "Barracks Key", quantity: 1 }] },
        { zone: 2, name: "Enter Generals Quarters", items: [{ name: "Generals RFID", quantity: 1 }] }
      ]
    },
    7: {
      name: "Data Center",
      zones: [
        { zone: 1, name: "Security Room", items: [{ name: "Lockpick", quantity: 1 }] },
        { zone: 2, name: "Control Room", items: [{ name: "Explosives", quantity: 1 }] }
      ]
    },
    8: {
      name: "Junkyard",
      zones: [
        { zone: 1, name: "Power Backup Generator", items: [{ name: "Battery", quantity: 1 }] },
        { zone: 2, name: "Hack Security Door", items: [{ name: "Splicer", quantity: 1 }] }
      ]
    },
    9: {
      name: "Logging Camp",
      zones: [
        { zone: 1, name: "Construct Log Lifter", items: [{ name: "Nails", quantity: 250 }, { name: "Planks", quantity: 250 }, { name: "Rope", quantity: 5 }] }
      ]
    },
    10: {
      name: "Open Meadow",
      zones: [
        { zone: 1, name: "Create Clearing", items: [{ name: "Hatchet", quantity: 1 }] }
      ]
    },
    11: {
      name: "Oil Refinery",
      zones: [
        { zone: 1, name: "Bypass Security Door", items: [{ name: "Splicer", quantity: 1 }] },
        { zone: 2, name: "Access Hidden Armourer", items: [{ name: "Money", quantity: 10000 }] }
      ]
    },
    12: {
      name: "Industrial Foundry",
      zones: [
        { zone: 1, name: "Picklock Main Doors", items: [{ name: "Lockpick", quantity: 1 }] },
        { zone: 2, name: "Bypass Staff Access", items: [{ name: "Splicer", quantity: 1 }] },
        { zone: 3, name: "Fire Up Forge", items: [{ name: "Fuel", quantity: 10 }] },
        { zone: 3, name: "Repair Control Unit", items: [{ name: "Computer Board", quantity: 1 }] },
        { zone: 3, name: "Repair Toolbench", items: [{ name: "Advanced Tools", quantity: 1 }, { name: "Steel", quantity: 100 }] }
      ]
    },
    13: {
      name: "Abandoned Quarry",
      zones: [
        { zone: 1, name: "Break-in to old mine", items: [{ name: "Splicer", quantity: 1 }] }
      ]
    }
  };

  // Get current explore location ID from URL
  function getExploreLocationId() {
    const match = window.location.pathname.match(/^\/explore\/(\d+)$/);
    return match ? parseInt(match[1]) : null;
  }

  // Get zone requirements for current location
  function getZoneRequirementsForLocation() {
    const locationId = getExploreLocationId();
    if (locationId === 0) {
      return ZONE_REQUIREMENTS[0];
    }
    if (!locationId || !ZONE_REQUIREMENTS[locationId]) return null;
    return ZONE_REQUIREMENTS[locationId];
  }

  // Check if a zone is already unlocked by searching the page DOM
  function getZoneUnlockStatus(zoneName) {
    // Find all divs that might contain the zone name
    const allDivs = document.querySelectorAll("div.col, div[class*='col']");
    
    for (const div of allDivs) {
      // Check if this div contains the zone name (exact or partial match)
      if (div.textContent.trim() === zoneName || div.textContent.includes(zoneName)) {
        // Go to parent row
        const parentRow = div.closest(".row, .tbl-row, [class*='row']");
        if (!parentRow) continue;
        
        // Look for "Unlocked" text in a sibling element
        const siblings = parentRow.querySelectorAll("div, span");
        for (const sibling of siblings) {
          const text = sibling.textContent || "";
          if (text.includes("Unlocked")) {
            // Found unlocked status, now look for countdown timer
            const timerSpan = parentRow.querySelector(".countdown-timer, [class*='countdown']");
            let timeRemaining = "";
            if (timerSpan) {
              timeRemaining = timerSpan.textContent.trim();
            } else {
              // Try to extract time from the text itself (format: "Unlocked (HH:MM:SS)")
              const timeMatch = text.match(/(\d{1,2}:\d{2}:\d{2})/);
              if (timeMatch) {
                timeRemaining = timeMatch[1];
              }
            }
            return { unlocked: true, timeRemaining };
          }
        }
      }
    }
    return { unlocked: false, timeRemaining: "" };
  }

  // Helper function to wait for an element
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeout);
    });
  }

  // Check if current page is traveling page
  function isTravelingPage() {
    return window.location.pathname === "/traveling";
  }
  let helperObserver = null;
  let itemsCache = null;
  let vehicleItemsCache = null;
  let currencyItemsCache = null;
  let csrfToken = null;
  let refreshInterval = null;
  let currentListContainer = null;
  let currentSearchInput = null;
  let weightDisplay = null;
  let weightProgressBar = null;
  let maxVehicleWeight = 0; // Default max vehicle capacity in kg

  // Get max weight from page element with <small>kg</small>
  function getMaxWeightFromPage() {
    const smallKgElements = document.querySelectorAll("small");
    for (const small of smallKgElements) {
      if (small.textContent.trim() === "kg") {
        const parent = small.parentElement;
        if (parent && parent.classList.contains("col-shrink")) {
          // Text content is like "3.5/38" followed by <small>kg</small>
          const textContent = parent.textContent.replace("kg", "").trim();
          const match = textContent.match(/[\d.]+\/([\d.]+)/);
          if (match) {
            return parseFloat(match[1]) || 38;
          }
        }
      }
    }
    return 38; // Default fallback
  }

  // Calculate total weight of vehicle items
  function calculateVehicleWeight(vehicleItems) {
    let totalWeight = 0;
    vehicleItems.forEach((item) => {
      const weight = parseFloat(item.vars?.weight) || 0;
      const quantity = parseInt(item.quantity) || 1;
      totalWeight += weight * quantity;
    });
    return totalWeight;
  }

  // Update weight display
  function updateWeightDisplay() {
    if (!weightDisplay || !vehicleItemsCache) return;
    maxVehicleWeight = getMaxWeightFromPage();
    const currentWeight = calculateVehicleWeight(vehicleItemsCache);
    weightDisplay.textContent = `${currentWeight.toFixed(
      1
    )}/${maxVehicleWeight}kg`;

    // Update progress bar
    if (weightProgressBar) {
      const percentage =
        maxVehicleWeight > 0
          ? Math.min((currentWeight / maxVehicleWeight) * 100, 100)
          : 0;
      const isOverweight = currentWeight > maxVehicleWeight;
      weightProgressBar.style.width = `${percentage}%`;
      weightProgressBar.style.background = isOverweight
        ? "linear-gradient(90deg, #ef4444 0%, #f87171 100%)"
        : "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)";
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
      // console.log("ZED Explore Helper: Error fetching CSRF token", error);
    }
    return null;
  }

  // Show toast notification in bottom right
  function showToast(message, isSuccess = true) {
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${isSuccess ? "#22c55e" : "#dc2626"};
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Add animation keyframes if not exists
    if (!document.getElementById("explore-helper-toast-styles")) {
      const style = document.createElement("style");
      style.id = "explore-helper-toast-styles";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.animation = "slideIn 0.3s ease reverse";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Show quantity popup modal
  function showQuantityPopup(item, onConfirm, isUnload = false) {
    const maxQty = item.quantity || 1;
    let currentQty = 1;

    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Modal
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: #0d0d0d;
      border: 1px solid #1a1a1a;
      border-radius: 8px;
      padding: 24px;
      min-width: 300px;
      text-align: center;
    `;

    // Item name
    const itemName = document.createElement("div");
    itemName.textContent = item.name;
    itemName.style.cssText =
      "color: #fff; font-size: 18px; font-weight: 500; margin-bottom: 16px;";
    modal.appendChild(itemName);

    // Item image
    const imgContainer = document.createElement("div");
    imgContainer.style.cssText =
      "position: relative; display: inline-block; margin-bottom: 20px;";
    const img = document.createElement("img");
    const codename =
      item.codename || item.name?.toLowerCase().replace(/\s+/g, "_") || "";
    img.src = `https://www.zed.city/items/${codename}.webp`;
    img.style.cssText = "width: 80px; height: 80px; object-fit: contain;";
    imgContainer.appendChild(img);
    if (maxQty > 1) {
      const badge = document.createElement("span");
      badge.textContent = `x${maxQty}`;
      badge.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,0.8);
        color: #fff;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 3px;
      `;
      imgContainer.appendChild(badge);
    }
    modal.appendChild(imgContainer);

    // Quantity section
    const qtySection = document.createElement("div");
    qtySection.style.cssText =
      "background: #141414; border-radius: 8px; padding: 16px; margin-bottom: 20px;";

    const qtyLabel = document.createElement("div");
    qtyLabel.textContent = "QUANTITY";
    qtyLabel.style.cssText =
      "color: #888; font-size: 12px; margin-bottom: 12px; letter-spacing: 1px;";
    qtySection.appendChild(qtyLabel);

    // Quantity controls
    const qtyControls = document.createElement("div");
    qtyControls.style.cssText =
      "display: flex; align-items: center; justify-content: center; gap: 0;";

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "<";
    minusBtn.style.cssText = `
      background: #1f1f1f;
      color: #888;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 4px 0 0 4px;
    `;

    // Add styles for hiding number input spinners
    if (!document.getElementById("explore-helper-input-styles")) {
      const style = document.createElement("style");
      style.id = "explore-helper-input-styles";
      style.textContent = `
        .explore-helper-qty-input::-webkit-outer-spin-button,
        .explore-helper-qty-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `;
      document.head.appendChild(style);
    }

    const qtyDisplay = document.createElement("input");
    qtyDisplay.type = "number";
    qtyDisplay.className = "explore-helper-qty-input";
    qtyDisplay.value = currentQty;
    qtyDisplay.min = 1;
    qtyDisplay.max = maxQty;
    qtyDisplay.style.cssText = `
      background: #0a0a0a;
      color: #fff;
      padding: 10px 0;
      font-size: 18px;
      width: 80px;
      text-align: center;
      border: none;
      border-top: 1px solid #222;
      border-bottom: 1px solid #222;
      outline: none;
      -moz-appearance: textfield;
      appearance: textfield;
    `;
    qtyDisplay.addEventListener("input", () => {
      let val = parseInt(qtyDisplay.value) || 1;
      if (val < 1) val = 1;
      if (val > maxQty) val = maxQty;
      currentQty = val;
    });
    qtyDisplay.addEventListener("blur", () => {
      qtyDisplay.value = currentQty;
    });

    const plusBtn = document.createElement("button");
    plusBtn.textContent = ">";
    plusBtn.style.cssText = `
      background: #1f1f1f;
      color: #888;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 0 4px 4px 0;
    `;

    minusBtn.addEventListener("click", () => {
      if (currentQty > 1) {
        currentQty--;
        qtyDisplay.value = currentQty;
      }
    });

    plusBtn.addEventListener("click", () => {
      if (currentQty < maxQty) {
        currentQty++;
        qtyDisplay.value = currentQty;
      }
    });

    qtyControls.appendChild(minusBtn);
    qtyControls.appendChild(qtyDisplay);
    qtyControls.appendChild(plusBtn);
    qtySection.appendChild(qtyControls);

    // MAX button
    const maxBtn = document.createElement("button");
    maxBtn.textContent = "MAX";
    maxBtn.style.cssText = `
      background: #1f1f1f;
      color: #888;
      border: none;
      padding: 8px 40px;
      cursor: pointer;
      font-size: 12px;
      border-radius: 20px;
      margin-top: 12px;
    `;
    maxBtn.addEventListener("click", () => {
      currentQty = maxQty;
      qtyDisplay.value = currentQty;
    });
    qtySection.appendChild(maxBtn);
    modal.appendChild(qtySection);

    // Action buttons
    const actionBtns = document.createElement("div");
    actionBtns.style.cssText =
      "display: flex; justify-content: center; gap: 20px; align-items: center;";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "CANCEL";
    cancelBtn.style.cssText = `
      background: transparent;
      color: #ef4444;
      border: none;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    `;
    cancelBtn.addEventListener("click", () => backdrop.remove());

    const actionBtn = document.createElement("button");
    actionBtn.textContent = isUnload ? "UNLOAD ITEM" : "ADD ITEM";
    actionBtn.style.cssText = `
      background: ${isUnload ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"};
      color: #fff;
      border: none;
      padding: 12px 24px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      border-radius: 4px;
    `;
    actionBtn.addEventListener("click", async () => {
      actionBtn.disabled = true;
      actionBtn.textContent = isUnload ? "Unloading..." : "Adding...";
      await onConfirm(currentQty);
      backdrop.remove();
    });

    actionBtns.appendChild(cancelBtn);
    actionBtns.appendChild(actionBtn);
    modal.appendChild(actionBtns);

    backdrop.appendChild(modal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.remove();
    });

    document.body.appendChild(backdrop);
  }

  // Add item to vehicle via API
  async function addItemToVehicle(item, quantity) {
    try {
      // Get CSRF token first
      const token = await fetchCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["x-csrf-token"] = token;
      }

      const res = await fetch(API_ADD_ITEM, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ item: item.id, quantity }),
      });
      const json = await res.json();

      if (json.success) {
        const addedItems = json.reactive_items_data || [];
        if (addedItems.length > 0) {
          const names = addedItems
            .map((i) => `${i.quantity}x ${i.name}`)
            .join(", ");
          showToast(`Added: ${names}`, true);
        } else {
          showToast(`Added ${quantity}x ${item.name}`, true);
        }
        // Refresh items list
        await refreshItemList();
      } else {
        showToast(json.error || "Failed to add item", false);
      }
    } catch (error) {
      // console.log("ZED Explore Helper: Error adding item", error);
      showToast("Error adding item", false);
    }
  }

  // Unload item from vehicle via API
  async function unloadItemFromVehicle(item, quantity) {
    try {
      // Get CSRF token first
      const token = await fetchCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["x-csrf-token"] = token;
      }

      const res = await fetch(API_UNLOAD_ITEM, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ item_id: item.id, quantity }),
      });
      const json = await res.json();

      if (json.success) {
        showToast(`Unloaded ${quantity}x ${item.name}`, true);
        // Refresh items list
        await refreshItemList();
      } else {
        showToast(json.error || "Failed to unload item", false);
      }
    } catch (error) {
      // console.log("ZED Explore Helper: Error unloading item", error);
      showToast("Error unloading item", false);
    }
  }

  // Check if current URL matches /explore/{number}
  function isExplorePage() {
    const match = window.location.pathname.match(/^\/explore\/(\d+)$/);
    return match !== null;
  }

  // Find span with "Travel" text
  function findTravelSpan() {
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
      if (span.textContent.trim() === "Travel") {
        // add margin top to the parent of the span
        span.parentElement.style.marginTop = "10px";
        return span;
      }
    }
    return null;
  }

  // Fetch items from API (returns inventory, vehicle, and currency items)
  async function fetchItems(forceRefresh = false) {
    if (!forceRefresh && itemsCache && vehicleItemsCache && currencyItemsCache) {
      return { items: itemsCache, vehicleItems: vehicleItemsCache, currencyItems: currencyItemsCache };
    }
    try {
      const res = await fetch(API_ITEMS, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch items");
      const json = await res.json();
      itemsCache = Array.isArray(json?.items) ? json.items : [];
      vehicleItemsCache = Array.isArray(json?.vehicle_items)
        ? json.vehicle_items
        : [];
      currencyItemsCache = Array.isArray(json?.currency_items)
        ? json.currency_items
        : [];
      updateWeightDisplay();
      return { items: itemsCache, vehicleItems: vehicleItemsCache, currencyItems: currencyItemsCache };
    } catch (error) {
      // console.log("ZED Explore Helper: Error fetching items", error);
      return { items: [], vehicleItems: [], currencyItems: [] };
    }
  }

  // Create zone requirement item row
  function createZoneRequirementRow(zoneReq, reqItem, allItems, vehicleItems, currencyItems = []) {
    // Check if this zone is already unlocked
    const unlockStatus = getZoneUnlockStatus(zoneReq.name);
    const isUnlocked = unlockStatus.unlocked;

    const row = document.createElement("div");
    row.className = "item-row zone-requirement-item";
    row.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      align-items: center;
      padding: 3px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: ${isUnlocked ? "rgba(34, 197, 94, 0.15)" : "rgba(234, 179, 8, 0.15)"};
    `;

    // Check if this is a currency item (like Money)
    const isMoney = reqItem.name.toLowerCase() === "money";
    const currencyItem = currencyItems.find(
      (i) => i.name.toLowerCase() === reqItem.name.toLowerCase()
    );

    // Find actual item in inventory or vehicle
    const allAvailableItems = [...allItems, ...vehicleItems];
    const actualItem = isMoney ? currencyItem : allAvailableItems.find(
      (i) => i.name.toLowerCase() === reqItem.name.toLowerCase()
    );
    const inventoryItem = allItems.find(
      (i) => i.name.toLowerCase() === reqItem.name.toLowerCase()
    );
    const vehicleItem = vehicleItems.find(
      (i) => i.name.toLowerCase() === reqItem.name.toLowerCase()
    );

    // Item image (left column)
    const imgContainer = document.createElement("div");
    imgContainer.style.cssText =
      "width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;";
    if (actualItem?.image) {
      const img = document.createElement("img");
      img.src = actualItem.image;
      img.alt = reqItem.name;
      img.style.cssText = "max-width: 100%; max-height: 100%; object-fit: contain;";
      imgContainer.appendChild(img);
    } else {
      imgContainer.innerHTML = `<div style="width: 24px; height: 24px; background: rgba(234, 179, 8, 0.3); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #eab308;">?</div>`;
    }
    row.appendChild(imgContainer);

    // Item name and zone info (center column - always centered)
    const nameContainer = document.createElement("div");
    nameContainer.style.cssText = "display: flex; flex-direction: column; align-items: center; text-align: center;";

    const nameSpan = document.createElement("span");
    nameSpan.className = "item-name";
    nameSpan.style.cssText = `color: ${isUnlocked ? "#22c55e" : "#eab308"}; font-size: 12px; font-weight: 500;`;
    nameSpan.textContent = reqItem.name;
    nameContainer.appendChild(nameSpan);

    const zoneInfo = document.createElement("span");
    zoneInfo.style.cssText = "color: #a8a29e; font-size: 9px;";
    if (isUnlocked) {
      const timeText = unlockStatus.timeRemaining ? ` for ${unlockStatus.timeRemaining}` : "";
      zoneInfo.textContent = `Zone ${zoneReq.zone} - ${zoneReq.name} - ✓ Unlocked${timeText}`;
      zoneInfo.style.color = "#86efac";
    } else {
      zoneInfo.textContent = `Zone ${zoneReq.zone} - ${zoneReq.name} - Required: ${reqItem.quantity}`;
    }
    nameContainer.appendChild(zoneInfo);

    row.appendChild(nameContainer);

    // Right column container (quantity + buttons)
    const rightContainer = document.createElement("div");
    rightContainer.style.cssText = "display: flex; align-items: center; justify-content: flex-end; gap: 8px;";

    // If unlocked, just show "Not Required" label
  
      // Quantity display
      const qtySpan = document.createElement("span");
      const vehicleQty = vehicleItem?.quantity || 0;
      const inventoryQty = inventoryItem?.quantity || 0;
      const currencyQty = currencyItem?.quantity || 0;
      
      // For Money, use currency quantity; for others, use vehicle quantity
      const displayQty = isMoney ? currencyQty : vehicleQty;
      const hasEnough = isMoney ? (currencyQty >= reqItem.quantity) : (vehicleQty >= reqItem.quantity);
      
      qtySpan.style.cssText = `color: ${hasEnough ? "#22c55e" : "#eab308"}; font-size: 11px; min-width: 35px; text-align: right;`;
      qtySpan.textContent = `${displayQty}/${reqItem.quantity}`;
      qtySpan.title = isMoney ? `Money: ${currencyQty}` : `In vehicle: ${vehicleQty}, In inventory: ${inventoryQty}`;
      rightContainer.appendChild(qtySpan);

      if (!isMoney) {
        // Buttons container
        const btnsContainer = document.createElement("div");
        btnsContainer.style.cssText = "display: flex; gap: 4px;";

        const hasInInventory = inventoryItem && inventoryItem.quantity > 0;
        const hasInVehicle = vehicleItem && vehicleItem.quantity > 0;

        // Add button (if item exists in inventory)
        if (hasInInventory) {
          const addBtn = document.createElement("button");
          addBtn.textContent = "Add";
          addBtn.style.cssText = `
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border: none;
            color: #fff;
            padding: 4px 0;
            border-radius: 3px;
            cursor: pointer;
            font-weight: 500;
            font-size: 10px;
            width: 45px;
            text-align: center;
          `;
          addBtn.addEventListener("click", () => {
            showQuantityPopup(inventoryItem, async (quantity) => {
              await addItemToVehicle(inventoryItem, quantity);
            });
          });
          btnsContainer.appendChild(addBtn);
        }

        // Unload button (if item exists in vehicle)
        if (hasInVehicle) {
          const unloadBtn = document.createElement("button");
          unloadBtn.textContent = "Unload";
          unloadBtn.style.cssText = `
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            border: none;
            color: #fff;
            padding: 4px 0;
            border-radius: 3px;
            cursor: pointer;
            font-weight: 500;
            font-size: 10px;
            width: 45px;
            text-align: center;
          `;
          unloadBtn.addEventListener("click", () => {
            showQuantityPopup(vehicleItem, async (quantity) => {
              await unloadItemFromVehicle(vehicleItem, quantity);
            }, true);
          });
          btnsContainer.appendChild(unloadBtn);
        }

        // Missing label (if item not available anywhere)
        if (!hasInInventory && !hasInVehicle) {
          const missingSpan = document.createElement("span");
          missingSpan.style.cssText = "color: #ef4444; font-size: 9px; width: 60px; text-align: center;";
          missingSpan.textContent = "Missing";
          btnsContainer.appendChild(missingSpan);
        }

        rightContainer.appendChild(btnsContainer);
      }
    

    row.appendChild(rightContainer);
    return row;
  }

  // Refresh and update the item list
  async function refreshItemList() {
    if (!currentListContainer) return;

    const { items, vehicleItems, currencyItems } = await fetchItems(true);
    currentListContainer.innerHTML = "";

    // Add zone requirements first (at the top)
    const zoneReqs = getZoneRequirementsForLocation();
    if (zoneReqs && zoneReqs.zones.length > 0) {
      const zoneSection = document.createElement("div");
      zoneSection.className = "zone-requirements-section";
      zoneSection.style.cssText = "border-bottom: 2px solid rgba(234, 179, 8, 0.3); margin-bottom: 4px;";

      // Section header
      const header = document.createElement("div");
      header.style.cssText = "padding: 4px 8px; font-size: 10px; color: #eab308; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;";
      header.textContent = `🔓 Zone Requirements - ${zoneReqs.name}`;
      zoneSection.appendChild(header);

      zoneReqs.zones.forEach((zoneReq) => {
        zoneReq.items.forEach((reqItem) => {
          zoneSection.appendChild(createZoneRequirementRow(zoneReq, reqItem, items, vehicleItems, currencyItems));
        });
      });
      currentListContainer.appendChild(zoneSection);
    }

    // Add vehicle items (pinned section)
    if (vehicleItems.length > 0) {
      const vehicleSection = document.createElement("div");
      vehicleSection.className = "vehicle-items-section";
      vehicleItems.forEach((item) => {
        vehicleSection.appendChild(createItemRow(item, true));
      });
      currentListContainer.appendChild(vehicleSection);
    }

    // Add inventory items
    if (items.length === 0 && vehicleItems.length === 0 && (!zoneReqs || zoneReqs.zones.length === 0)) {
      currentListContainer.innerHTML =
        "<div style='padding: 20px; text-align: center; color: #888;'>No items found</div>";
    } else {
      items.forEach((item) => {
        currentListContainer.appendChild(createItemRow(item, false));
      });
    }

    // Reapply search filter if there's a query (exclude zone requirements)
    if (currentSearchInput && currentSearchInput.value.trim()) {
      const query = currentSearchInput.value.toLowerCase().trim();
      const rows = currentListContainer.querySelectorAll(".item-row:not(.zone-requirement-item)");
      rows.forEach((row) => {
        const name =
          row.querySelector(".item-name")?.textContent?.toLowerCase() || "";
        row.style.display = name.includes(query) ? "grid" : "none";
      });
    }
  }

  // Create item row element (isVehicleItem = true for items in vehicle)
  function createItemRow(item, isVehicleItem = false) {
    const row = document.createElement("div");
    row.className = isVehicleItem ? "item-row vehicle-item" : "item-row";
    row.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      align-items: center;
      padding: 3px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: ${isVehicleItem ? "rgba(59, 130, 246, 0.15)" : "transparent"};
    `;

    // Check if item exists in both vehicle and inventory
    const inventoryItem = itemsCache?.find(
      (i) => i.name?.toLowerCase() === item.name?.toLowerCase()
    );
    const vehicleItem = vehicleItemsCache?.find(
      (i) => i.name?.toLowerCase() === item.name?.toLowerCase()
    );
    const hasInInventory = inventoryItem && inventoryItem.quantity > 0;
    const hasInVehicle = vehicleItem && vehicleItem.quantity > 0;

    // Left column: Item image
    const imgContainer = document.createElement("div");
    imgContainer.style.cssText =
      "position: relative; width: 28px; height: 28px;";
    const img = document.createElement("img");
    const codename =
      item.codename || item.name?.toLowerCase().replace(/\s+/g, "_") || "";
    img.src = `https://www.zed.city/items/${codename}.webp`;
    img.alt = item.name || "";
    img.style.cssText = "width: 100%; height: 100%; object-fit: contain;";
    imgContainer.appendChild(img);

    // Quantity badge if > 1
    if (item.quantity && item.quantity > 1) {
      const badge = document.createElement("span");
      badge.textContent = `x${item.quantity}`;
      badge.style.cssText = `
        position: absolute;
        bottom: -2px;
        right: -4px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        font-size: 9px;
        padding: 0px 3px;
        border-radius: 2px;
      `;
      imgContainer.appendChild(badge);
    }
    row.appendChild(imgContainer);

    // Center column: Item name (with quantity if in vehicle, condition if < 100)
    const name = document.createElement("div");
    name.className = "item-name";
    const condition = item.vars?.condition;
    let nameText = item.name || "Unknown";
    // Show quantity in name for vehicle items
    if (isVehicleItem && item.quantity && item.quantity > 1) {
      nameText += ` x ${item.quantity}`;
    }
    if (condition !== undefined && condition < 100) {
      nameText += ` (${condition}%)`;
    }
    name.textContent = nameText;
    name.style.cssText =
      "font-size: 14px; color: #fff; text-align: center;";
    row.appendChild(name);

    // Right column: Buttons container
    const btnsContainer = document.createElement("div");
    btnsContainer.style.cssText = "display: flex; gap: 4px; justify-content: flex-end;";

    // Add button (if item exists in inventory)
    if (hasInInventory) {
      const addBtn = document.createElement("button");
      addBtn.textContent = "Add";
      addBtn.style.cssText = `
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        border: none;
        color: #fff;
        padding: 4px 0;
        border-radius: 3px;
        cursor: pointer;
        font-weight: 500;
        font-size: 10px;
        width: 45px;
        text-align: center;
      `;
      addBtn.addEventListener("click", () => {
        showQuantityPopup(inventoryItem, async (quantity) => {
          await addItemToVehicle(inventoryItem, quantity);
        });
      });
      btnsContainer.appendChild(addBtn);
    }

    // Unload button (if item exists in vehicle)
    if (hasInVehicle) {
      const unloadBtn = document.createElement("button");
      unloadBtn.textContent = "Unload";
      unloadBtn.style.cssText = `
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        border: none;
        color: #fff;
        padding: 4px 0;
        border-radius: 3px;
        cursor: pointer;
        font-weight: 500;
        font-size: 10px;
        width: 45px;
        text-align: center;
      `;
      unloadBtn.addEventListener("click", () => {
        showQuantityPopup(vehicleItem, async (quantity) => {
          await unloadItemFromVehicle(vehicleItem, quantity);
        }, true);
      });
      btnsContainer.appendChild(unloadBtn);
    }

    row.appendChild(btnsContainer);
    return row;
  }

  // Create items list panel
  function createItemsPanel(contentDiv) {
    const panel = document.createElement("div");
    panel.className = "items-panel";
    panel.style.cssText = "display: none; flex-direction: column;";

    // Search bar container
    const searchContainer = document.createElement("div");
    searchContainer.style.cssText = "padding: 8px;";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search items...";
    searchInput.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      background: rgba(0,0,0,0.5);
      color: #fff;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
    `;
    searchContainer.appendChild(searchInput);
    panel.appendChild(searchContainer);

    // Items list container (max ~5 rows visible, each row ~35px)
    const listContainer = document.createElement("div");
    listContainer.className = "items-list";
    listContainer.style.cssText = "overflow-y: auto; max-height: 276px;";
    panel.appendChild(listContainer);

    // Search functionality (filters items but NOT zone requirements)
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      // Only filter regular item rows, not zone requirements
      const rows = listContainer.querySelectorAll(".item-row:not(.zone-requirement-item)");
      rows.forEach((row) => {
        const name =
          row.querySelector(".item-name")?.textContent?.toLowerCase() || "";
        row.style.display = name.includes(query) ? "grid" : "none";
      });
      // Keep zone requirements section always visible
      const zoneSection = listContainer.querySelector(".zone-requirements-section");
      if (zoneSection) {
        zoneSection.style.display = "block";
      }
    });

    // Store references for global access
    currentListContainer = listContainer;
    currentSearchInput = searchInput;

    return { panel, listContainer, searchInput };
  }

  // Create the explore helper box
  function createExploreHelperBox() {
    const mainContainer = document.createElement("div");
    mainContainer.className = "col-xs-12 q-mt-sm";
    const container = document.createElement("div");
    container.className = `zed-grid has-title has-content full-height ${HELPER_CLASS}`;
    mainContainer.appendChild(container);

    const title = document.createElement("div");
    title.className = "title";
    title.style.cssText =
      "display: flex; flex-direction: column; padding-bottom: 0;";

    // Title row with text and weight
    const titleRow = document.createElement("div");
    titleRow.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; width: 100%;";

    const titleInner = document.createElement("div");
    titleInner.textContent = "Inventory";
    titleRow.appendChild(titleInner);

    // Weight display
    weightDisplay = document.createElement("div");
    weightDisplay.className = "col-shrink subtext-large text-grey-7";
    weightDisplay.style.cssText = "font-size: 12px; color: #888;";
    weightDisplay.textContent = `0/${maxVehicleWeight}kg`;
    titleRow.appendChild(weightDisplay);

    title.appendChild(titleRow);
    container.appendChild(title);

    // Progress bar container - positioned right below title (like STINGER bar)
    const progressContainer = document.createElement("div");
    progressContainer.style.cssText = `
      width: 100%;
      height: 5px;
      background: #202327;
      overflow: hidden;
      position: relative;
    `;

    // Progress bar fill
    weightProgressBar = document.createElement("div");
    weightProgressBar.style.cssText = `
      height: 100%;
      width: 0%;
      position: absolute;
      left: 0;
      top: 0;
      background: linear-gradient(90deg,rgba(34, 197, 94, 0.45) 0%,rgba(74, 222, 128, 0.85) 100%);
      transition: width 0.3s ease, background 0.3s ease;
    `;
    progressContainer.appendChild(weightProgressBar);
    container.insertBefore(progressContainer, container.children[1] || null);

    const content = document.createElement("div");
    content.className = "grid-cont";
    content.style.cssText = "padding: 12px;";

    // Add Items button
    const addItemsBtn = document.createElement("button");
    addItemsBtn.textContent = "Add Items";
    addItemsBtn.style.cssText = `
      background:rgba(60, 139, 64, 0.5);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      width: 100%;
    `;
    //hover effect
    addItemsBtn.addEventListener("mouseenter", () => {
      addItemsBtn.style.backgroundColor = "rgba(60, 139, 64, 0.8)";
    });
    addItemsBtn.addEventListener("mouseleave", () => {
      addItemsBtn.style.backgroundColor = "rgba(60, 139, 64, 0.5)";
    });
    addItemsBtn.style.transition = "background 0.3s ease";

    // Create items panel
    const { panel, listContainer } = createItemsPanel(content);
    let panelOpen = false;
    let itemsLoaded = false;

    // Function to load items into list
    async function loadItems() {
      listContainer.innerHTML =
        "<div style='padding: 20px; text-align: center; color: #888;'>Loading items...</div>";
      const { items, vehicleItems, currencyItems } = await fetchItems(true);
      listContainer.innerHTML = "";

      // Add zone requirements first (at the top)
      const zoneReqs = getZoneRequirementsForLocation();
      if (zoneReqs && zoneReqs.zones.length > 0) {
        const zoneSection = document.createElement("div");
        zoneSection.className = "zone-requirements-section";
        zoneSection.style.cssText = "border-bottom: 2px solid rgba(234, 179, 8, 0.3); margin-bottom: 4px;";

        // Section header
        const header = document.createElement("div");
        header.style.cssText = "padding: 4px 8px; font-size: 10px; color: #eab308; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;";
        header.textContent = `🔓 Zone Requirements - ${zoneReqs.name}`;
        zoneSection.appendChild(header);

        zoneReqs.zones.forEach((zoneReq) => {
          zoneReq.items.forEach((reqItem) => {
            zoneSection.appendChild(createZoneRequirementRow(zoneReq, reqItem, items, vehicleItems, currencyItems));
          });
        });
        listContainer.appendChild(zoneSection);
      }

      if (items.length === 0 && vehicleItems.length === 0 && (!zoneReqs || zoneReqs.zones.length === 0)) {
        listContainer.innerHTML =
          "<div style='padding: 20px; text-align: center; color: #888;'>No items found</div>";
      } else {
        // Add vehicle items first (pinned at top with different background)
        vehicleItems.forEach((item) => {
          listContainer.appendChild(createItemRow(item, true));
        });
        // Add inventory items
        items.forEach((item) => {
          listContainer.appendChild(createItemRow(item, false));
        });
        itemsLoaded = true;
      }
    }

    addItemsBtn.addEventListener("click", async () => {
      if (!panelOpen) {
        panelOpen = true;
        panel.style.display = "flex";
        addItemsBtn.style.display = "none"; // Hide button once opened

        if (!itemsLoaded) {
          await loadItems();
        }
        // Start 10-second refresh interval
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(refreshItemList, 10000);
      }
    });

    content.appendChild(addItemsBtn);
    content.appendChild(panel);
    container.appendChild(content);

    return mainContainer;
  }

  function insertBox() {
    // Check if box already exists
    if (document.querySelector(`.${HELPER_CLASS}`)) {
      // console.log("ZED Explore Helper: Hello box already exists");
      return;
    }

    const travelSpan = findTravelSpan();
    if (!travelSpan) {
      // console.log("ZED Explore Helper: Travel span not found");
      return;
    }

    // Get parent (should be button)
    const parentButton = travelSpan.parentElement;
    if (!parentButton) {
      // console.log("ZED Explore Helper: Parent button not found");
      return;
    }

    // Get grandparent (parent of button)
    const grandparent = parentButton.parentElement;
    if (!grandparent) {
      // console.log("ZED Explore Helper: Grandparent element not found");
      return;
    }

    // Create and insert the hello box
    const mainBox = createExploreHelperBox();
    grandparent.insertBefore(mainBox, grandparent.firstChild);
    // console.log("ZED Explore Helper: Main box inserted successfully");
  }

  // Initialize the helper
  function init() {
    if (!isExplorePage()) {
      // console.log("ZED Explore Helper: Not an explore page, skipping");
      return;
    }

    // console.log(
    //   "ZED Explore Helper: Initializing on",
    //   window.location.pathname
    // );

    // Wait for the Travel span to appear, then insert the box
    const checkForTravelSpan = () => {
      const travelSpan = findTravelSpan();
      if (travelSpan) {
        insertBox();
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkForTravelSpan()) {
      return;
    }

    // Otherwise, use MutationObserver to wait for it
    const observer = new MutationObserver(() => {
      if (checkForTravelSpan()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Timeout after 15 seconds
    setTimeout(() => {
      observer.disconnect();
      // console.log("ZED Explore Helper: Timeout waiting for Travel span");
    }, 15000);
  }

  // Handle traveling page - add Update Inventory button
  function handleTravelingPage() {
    if (!isTravelingPage()) {
      return;
    }

    // Wait for the main-text element to check if it says "You are traveling"
    waitForElement("div.main-text.zed-font.text-no-bg")
      .then(() => {
        const mainTextDiv = document.querySelector(
          "div.main-text.zed-font.text-no-bg"
        );
        if (!mainTextDiv) {
          return;
        }

        const textContent = mainTextDiv.textContent?.trim();
        if (textContent === "You are traveling") {
          // Wait for travel-line element
          waitForElement("div.travel-line")
            .then(() => {
              const travelLineDiv = document.querySelector("div.travel-line");
              if (!travelLineDiv) {
                return;
              }

              // Check if button already exists to avoid duplicates
              const existingButton = travelLineDiv.parentElement?.querySelector(
                `.${TRAVELING_BTN_CLASS}`
              );
              if (existingButton) {
                return;
              }

              // Create the Update Inventory button
              const button = document.createElement("button");
              button.className = TRAVELING_BTN_CLASS;
              button.textContent = "Update Inventory";
              button.style.cssText = `
                background: rgba(60, 139, 64, 0.6);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                margin-bottom: 8px;
                margin-top: 8px;
                font-weight: 500;
                font-size: 12px;
                transition: all 0.3s ease;
              `;
              //hover effect
              button.addEventListener("mouseenter", () => {
                button.style.backgroundColor = "rgba(60, 139, 64, 0.9)";
              });
              button.addEventListener("mouseleave", () => {
                button.style.backgroundColor = "rgba(60, 139, 64, 0.6)";
              });

              // Click handler - refresh the page
              button.addEventListener("click", () => {
                window.location.reload();
              });

              // Insert button before travel-line
              if (travelLineDiv.parentElement) {
                travelLineDiv.parentElement.insertBefore(button, travelLineDiv);
              }
            })
            .catch(() => {
              // Travel line not found
            });
        }
      })
      .catch(() => {
        // Main text not found
      });
  }

  // Track current pathname for SPA navigation
  let currentPathname = window.location.pathname;

  // Handle URL changes (SPA navigation)
  function handleUrlChange() {
    const newPathname = window.location.pathname;
    if (newPathname !== currentPathname) {
      currentPathname = newPathname;
      // console.log("ZED Explore Helper: URL changed to", currentPathname);

      // Clear refresh interval when navigating away
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
      }

      // Reset caches and references
      itemsCache = null;
      vehicleItemsCache = null;
      currentListContainer = null;
      currentSearchInput = null;

      // Remove existing box if navigating away
      const existingBox = document.querySelector(`.${HELPER_CLASS}`);
      if (existingBox) {
        existingBox.remove();
      }

      // Reinitialize if on explore page
      if (isExplorePage()) {
        setTimeout(init, 500);
      }

      // Handle traveling page
      if (isTravelingPage()) {
        setTimeout(handleTravelingPage, 500);
      }
    }
  }

  // Intercept pushState and replaceState for SPA navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    originalPushState.apply(history, arguments);
    setTimeout(handleUrlChange, 100);
  };

  history.replaceState = function () {
    originalReplaceState.apply(history, arguments);
    setTimeout(handleUrlChange, 100);
  };

  // Listen for browser back/forward navigation
  window.addEventListener("popstate", handleUrlChange);

  // Watch for SPA navigation changes
  helperObserver = new MutationObserver(() => {
    if (window.location.pathname !== currentPathname) {
      handleUrlChange();
    }
    // Re-check for Travel span if on explore page and box doesn't exist
    if (isExplorePage() && !document.querySelector(`.${HELPER_CLASS}`)) {
      const travelSpan = findTravelSpan();
      if (travelSpan) {
        insertBox();
      }
    }
    // Re-check for traveling page button
    if (isTravelingPage() && !document.querySelector(`.${TRAVELING_BTN_CLASS}`)) {
      handleTravelingPage();
    }
  });

  // Run on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      handleTravelingPage();
    });
  } else {
    init();
    handleTravelingPage();
  }

  // Start observing for SPA navigation changes
  helperObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
