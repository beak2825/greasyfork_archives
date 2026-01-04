// ==UserScript==
// @name Neopets Enhanced Quickstock Pro
// @namespace http://tampermonkey.net/
// @version 1
// @description Enhanced Quickstock interface for Neopets with fully functional toggle switches. Includes item image display, discard and donate warnings, proper NC item visualization, and an improved overall layout and usability.
// @author TheZuki10@clraik.com
// @match https://www.neopets.com/quickstock.phtml*
// @match https://www.neopets.com/inventory.phtml*
// @icon https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/559973/Neopets%20Enhanced%20Quickstock%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/559973/Neopets%20Enhanced%20Quickstock%20Pro.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const options = { debug: true };

  function debug(...args) {
    if (options.debug) {
      console.debug("[Enhanced Quickstock]", ...args);
    }
  }

  // ============================================================================
  // ENTRY POINT
  // ============================================================================
  main();

  function main() {
    if (isInventoryPage()) {
      window.addEventListener("load", async () => {
        const hasItems = await waitUntilItemsLoaded();
        if (!hasItems) return;
        debug("Caching all item data from inventory...");
        cacheAllItems();
      });
} else if (isQuickStockPage()) {
  window.addEventListener("load", () => {
    debug("Starting Enhanced Quickstock...");
    enhanceQuickstock();
  });
}
  }

  function isInventoryPage() {
    return window.location.href.includes("inventory.phtml");
  }

  function isQuickStockPage() {
    return window.location.href.includes("quickstock.phtml");
  }

  async function waitUntilItemsLoaded() {
    return new Promise((resolve) => {
      const items = document.querySelectorAll(".item-img");
      if (items.length) {
        resolve(true);
        return;
      }
      const observer = new MutationObserver(() => {
        const itemCount = document.querySelector(".inv-total-count, #noItems");
        if (itemCount != null) {
          observer.disconnect();
          resolve(document.querySelectorAll(".item-img").length > 0);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function cacheAllItems() {
    const items = document.querySelectorAll(".item-img");
    items.forEach(cacheItemData);
  }

  function cacheItemData(item) {
    const data = item.dataset;
    const itemName = data.itemname;
    const flags = item.parentElement.querySelector(".item-subname")?.innerHTML || "";
    const itemData = {
      image: data.image,
      isNc: data.itemset == "nc",
      rarity: data.rarity,
      flags,
    };
    GM_setValue(itemName, JSON.stringify(itemData));
  }

  function loadItemData(itemName) {
    const value = GM_getValue(itemName);
    return value ? JSON.parse(value) : null;
  }

  // ============================================================================
  // MAIN ENHANCEMENT FUNCTION
  // ============================================================================
function enhanceQuickstock() {
    const form = document.forms.quickstock;
    if (!form) {
      debug("Quickstock form not found!");
      return;
    }

    debug("Form found. Beginning enhancement...");

    // STEP 1: Hide radios via CSS ONLY (keep them in DOM)
    hideRadiosWithCss();

// STEP 2: Get all item rows (include both NP rows #f and NC rows #85ffcb green)
const itemRows = Array.from(form.querySelectorAll("tr")).filter(tr => {
  const radio = tr.querySelector('input[type="radio"]');
  return radio && !radio.disabled;
});
    debug(`Found ${itemRows.length} item rows`);

    // STEP 2.5: Style NC divider rows
    styleNCDividerRows(form);

    // STEP 3: Define all categories in order
    const categories = ["stock", "deposit", "donate", "discard", "gallery", "closet", "storage_shed"];

    // STEP 4: Enhance each item row with toggles
    itemRows.forEach((row, index) => {
      const rowNumber = index + 1;
const rawNameCell = row.querySelector("td");
const itemName = rawNameCell ? rawNameCell.textContent.trim() : null;
      const itemData = loadItemData(itemName);
      enhanceItemRow(form, row, itemName, itemData, rowNumber, categories);
    });

// STEP 5: Hide the original "Check All" row
    hideOriginalCheckAllRow(form);

    // STEP 6: Add quick action buttons above submit row
    addQuickActionButtons(form, categories);

    // STEP 6.5: Apply initial button order based on toggle
    reorderQuickActionButtons(form);

    // STEP 7: Replace original submit button with styled capsule button
    replaceSubmitButton(form);

    // STEP 8: Replace Clear button with styled version
    replaceClearButton(form);

// STEP 8.5: Style submit row to match quick actions
    styleSubmitRow(form);

    // STEP 9: Style header and visual elements
    styleHeaderRow(form);

// STEP 10: Inject all custom CSS
    injectStyles();

    // STEP 11: Add settings panel
    addSettingsPanel(form);

    // STEP 12: Replace default headers with custom headers
    replaceDefaultHeaders(form);

    if (window.jQuery && jQuery.fn.lazy) {
  jQuery(".lazy").lazy({
    bind: "event",
    delay: 0
  });
  jQuery(".lazy").trigger("load");
}
  }
  // ============================================================================
  // STEP 1: Hide radios via CSS only (KEEP in DOM)
  // ============================================================================
function hideRadiosWithCss() {
    const style = document.createElement("style");
    style.textContent = `
input[type="radio"][name^="radio_arr"],
input[type="radio"][name^="cash_radio_arr"] {
  display: none !important;
}
      input[type="radio"][name="checkall"] {
        display: none !important;
      }
      input[type="reset"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    debug("Radio buttons and reset button hidden via CSS");
  }

function styleNCDividerRows(form) {
    const allRows = form.querySelectorAll("tr");

    allRows.forEach(row => {
      const cells = row.querySelectorAll("td");

      // Match the exact HTML structure: <tr bgcolor='#ffffff'><td colspan=7>&nbsp;</td></tr>
      if (cells.length === 1 && (cells[0].colSpan === 7 || cells[0].colSpan === "7")) {
        const cellContent = cells[0].textContent.trim();
        const cellHTML = cells[0].innerHTML.trim();

        // Check for empty cell or just whitespace/nbsp
        if (cellContent === "" || cellContent === " " || cellHTML === "&nbsp;" || cellHTML === "") {
          // Check if there are cash_radio_arr (NC items) after this row
          let hasNCItemsAfter = false;
          let currentRow = row.nextElementSibling;
          let rowsChecked = 0;

          while (currentRow && rowsChecked < 100) {
            // Look specifically for NC item radios (cash_radio_arr)
            const ncRadio = currentRow.querySelector('input[type="radio"][name*="cash_radio_arr"]');
            if (ncRadio) {
              hasNCItemsAfter = true;
              break;
            }

            // Stop if we hit another divider
            const potentialDivider = currentRow.querySelectorAll("td");
            if (potentialDivider.length === 1 && (potentialDivider[0].colSpan === 7 || potentialDivider[0].colSpan === "7")) {
              break;
            }

            currentRow = currentRow.nextElementSibling;
            rowsChecked++;
          }

          if (hasNCItemsAfter) {
            // Remove bgcolor attribute completely to prevent it from fighting
            row.removeAttribute("bgcolor");

            // Apply ALL styles with !important flags
            row.style.backgroundColor = "#85ffcb !important";
            row.style.background = "#85ffcb !important";

            cells[0].removeAttribute("bgcolor");
            cells[0].style.backgroundColor = "#85ffcb !important";
            cells[0].style.background = "#85ffcb !important";
            cells[0].style.color = "black !important";
            cells[0].style.fontWeight = "bold !important";
            cells[0].style.fontFamily = '"Cafeteria", "Arial Bold", sans-serif !important';
            cells[0].style.fontSize = "14px !important";
            cells[0].style.textAlign = "center !important";
            cells[0].style.padding = "8px !important";
            cells[0].style.border = "2px solid #2d7d32 !important";
            cells[0].textContent = "NC Items Start Here";

            // CRITICAL: Set colspan to 8 to span the entire table width
            cells[0].colSpan = 8;

            // Add class for extra CSS reinforcement
            row.classList.add("nc-divider-row");
            cells[0].classList.add("nc-divider-cell");

            debug("NC Items divider row styled - bgcolor removed, green applied");
          }
        }
      }
    });
  }

  // ============================================================================
  // STEP 1.5: Hide original Check All row
  // ============================================================================
function hideOriginalCheckAllRow(form) {
    const rows = form.querySelectorAll("tr[bgcolor='#eeeebb'], tr[bgcolor='#EEEEBB']");
    rows.forEach(row => {
      const firstCell = row.querySelector("td");
      if (firstCell && firstCell.textContent.includes("Check All")) {
        row.style.display = "none";
        debug("Original Check All row hidden");
      }
    });
  }
  // ============================================================================
  // STEP 2: Enhance each item row with enhanced visuals and toggles
  // ============================================================================
  function enhanceItemRow(form, row, itemName, itemData, rowNumber, categories) {
    const firstCell = row.querySelector("td");
    if (!firstCell) return;
const originalItemName = firstCell.textContent.trim();
const originalImgEl = firstCell.querySelector("img");
const originalLazyDiv = firstCell.querySelector(".item-img.lazy");

const existingImg = originalImgEl ? originalImgEl.src : null;
const lazyImageUrl = originalLazyDiv?.dataset?.image || null;

    // Create enhanced item display (name + image + flags)
    const container = document.createElement("div");
    container.className = "item-display-container";

    // Add image if available
let imageSrc = null;
let isNcItem = false;

if (itemData?.isNc && lazyImageUrl) {
  imageSrc = lazyImageUrl;
  isNcItem = true;
} else if (itemData?.image) {
  imageSrc = itemData.image;
} else if (existingImg) {
  imageSrc = existingImg;
}

if (imageSrc) {
  if (isNcItem) {
    const ncDiv = document.createElement("div");
    ncDiv.className = "item-display-image lazy";
    ncDiv.dataset.image = imageSrc;
    ncDiv.style.backgroundImage = `url("${imageSrc}")`;
    ncDiv.style.backgroundSize = "contain";
    ncDiv.style.backgroundRepeat = "no-repeat";
    ncDiv.style.backgroundPosition = "center";
    container.appendChild(ncDiv);
  } else {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.className = "item-display-image";
    img.loading = "lazy";
    container.appendChild(img);
  }
}

    // Add item info (name + flags + rarity)
    const info = document.createElement("div");
    info.className = "item-info-container";

const safeItemName = originalItemName;
const nameSpan = document.createElement("span");
    nameSpan.className = "item-name";
nameSpan.textContent = safeItemName;
    nameSpan.dataset.cleanName = itemName;
    info.appendChild(nameSpan);

    if (itemData?.flags) {
      const flagsSpan = document.createElement("span");
      flagsSpan.className = "item-flags";
      flagsSpan.innerHTML = itemData.flags;
      info.appendChild(flagsSpan);
    }

if (itemData?.rarity) {
      const raritySpan = document.createElement("span");
      raritySpan.className = "item-rarity";
      raritySpan.textContent = `Rarity: ${itemData.rarity}`;

      // Add color class based on rarity value
      const r = parseInt(itemData.rarity);
      if (r >= 1 && r <= 74) {
        raritySpan.classList.add("rarity-1-74");
      } else if (r >= 75 && r <= 100) {
        raritySpan.classList.add("rarity-75-100");
      } else if (r >= 101 && r <= 104) {
        raritySpan.classList.add("rarity-101-104");
      } else if (r >= 105 && r <= 110) {
        raritySpan.classList.add("rarity-105-110");
      } else if (r >= 111 && r <= 179) {
        raritySpan.classList.add("rarity-111-179");
      } else if (r === 180) {
        raritySpan.classList.add("rarity-180");
      } else if (r >= 200 && r <= 250) {
        raritySpan.classList.add("rarity-200-250");
      } else if (r === 500) {
        raritySpan.classList.add("rarity-500");
      }

      info.appendChild(raritySpan);
    }

    container.appendChild(info);
const existingChildren = Array.from(firstCell.childNodes);

firstCell.textContent = "";
firstCell.appendChild(container);

// Reattach any non-text nodes added by other scripts
existingChildren.forEach(node => {
  if (node.nodeType === Node.ELEMENT_NODE && !container.contains(node)) {
    container.appendChild(node);
  }
});

// Replace radio buttons with label-based pill toggles
const cells = Array.from(row.querySelectorAll("td"));
categories.forEach((category, idx) => {
  const cellIndex = idx + 1;
  if (cellIndex < cells.length) {
    const cell = cells[cellIndex];
    // Support both NP items (radio_arr) and NC items (cash_radio_arr)
    let radio = row.querySelector(
  `input[type="radio"][value="${category}"]`
);
    if (!radio) {
      radio = row.querySelector(
  `input[type="radio"][name*="cash_radio_arr"][value="${category}"]`
);
    }

    if (radio && !radio.disabled) {
      // Create unique ID for this radio
      const labelId = `radio_${rowNumber}_${category}`;
      if (!radio.id) {
        radio.id = labelId;
      }

      // MOVE the radio into this cell first
      cell.innerHTML = "";
      cell.appendChild(radio);
      cell.style.textAlign = "center";
      cell.style.padding = "8px";

      // NOW create and add the label (it must come AFTER the radio in DOM)
      const label = document.createElement("label");
      label.htmlFor = radio.id;
      label.className = "pill-toggle-label";
      label.setAttribute("data-row", rowNumber);
      label.setAttribute("data-category", category);

      cell.appendChild(label);

// Add toggle click handler
      label.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        const targetRadio = document.getElementById(this.htmlFor);
        if (!targetRadio) return;

        const isCurrentlyChecked = targetRadio.checked;

        if (isCurrentlyChecked) {
          // If already checked, uncheck it
          targetRadio.checked = false;
        } else {
          // If not checked, check it and uncheck all others in this row
const allRadiosInRow = row.querySelectorAll('input[type="radio"]');
          allRadiosInRow.forEach(r => {
            r.checked = false;
          });
          targetRadio.checked = true;
        }

        // Update visuals immediately
        updatePillVisuals(form, rowNumber);
      });

    } else if (cell.textContent.trim() === "N/A") {
      cell.style.textAlign = "center";
      cell.style.padding = "8px";
    }
  }
});
  }

  // ============================================================================
  // Select a radio for a specific row (ensures only one per row)
  // ============================================================================
function selectRadioForRow(form, rowNumber, targetCategory) {
  debug(`Selecting radio: row ${rowNumber}, category ${targetCategory}`);

  // Query all radios in this row and check the target
  const allItemRows = Array.from(form.querySelectorAll("tr")).filter(tr => {
    const radio = tr.querySelector('input[type="radio"]');
    return radio && !radio.disabled;
  });

  const row = allItemRows[rowNumber - 1];
  if (!row) return;

  const allRadiosInRow = row.querySelectorAll('input[type="radio"]');

  allRadiosInRow.forEach(radio => {
    radio.checked = (radio.value === targetCategory);
  });

  debug(`Radio selected for row ${rowNumber}, category ${targetCategory}`);
}

// ============================================================================
// Update pill visual state based on radio checked status
// ============================================================================
function updatePillVisuals(form, rowNumber) {
  const allItemRows = Array.from(form.querySelectorAll("tr")).filter(tr => {
    const radio = tr.querySelector('input[type="radio"]');
    return radio && !radio.disabled;
  });

  const row = allItemRows[rowNumber - 1];
  if (!row) return;

  const labels = row.querySelectorAll(".pill-toggle-label");

  labels.forEach(label => {
    const radio = row.querySelector(`#${label.htmlFor}`);
    if (radio && radio.checked) {
      label.classList.add("active");
    } else {
      label.classList.remove("active");
    }
  });

  debug(`Updated pill visuals for row ${rowNumber}`);
}
  // ============================================================================
  // STEP 4: Add quick action buttons (Yellow capsule style)
  // ============================================================================
  function addQuickActionButtons(form, categories) {
    const table = form.querySelector("table");
    if (!table) return;

    // Find the submit row (last row)
    const submitRow = form.querySelector("tr:last-child");
    if (!submitRow) return;

    // Create new button row above submit
    const buttonRow = document.createElement("tr");
    buttonRow.className = "quick-actions-row";

    const td = document.createElement("td");
    td.colSpan = "8";
    td.className = "quick-actions-cell";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "quick-actions-container";

    // Create buttons for each action
const actions = [
      { category: "stock", label: "Stock All", danger: false },
      { category: "deposit", label: "Deposit All", danger: false },
      { category: "gallery", label: "Gallery All", danger: false },
      { category: "closet", label: "Closet All", danger: false },
      { category: "storage_shed", label: "Shed All", danger: false },
      { category: "donate", label: "Donate All", danger: true },
      { category: "discard", label: "Discard All", danger: true },
    ];

actions.forEach(action => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = action.danger ? "action-button danger-button" : "action-button";
      btn.textContent = action.label;
      btn.dataset.action = action.category;
      btn.dataset.category = action.category;
      btn.dataset.isDanger = action.danger ? "true" : "false";
      btn.dataset.label = action.label;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        handleQuickAction(form, action.category);
      });

      buttonContainer.appendChild(btn);
    });

    td.appendChild(buttonContainer);
    buttonRow.appendChild(td);
    submitRow.parentNode.insertBefore(buttonRow, submitRow);
  }

// ============================================================================
  // STEP 4.5: Reorder quick action buttons based on toggle setting
  // ============================================================================
function reorderQuickActionButtons(form) {
  const bulkButtonsMode = document.getElementById("setting-bulk-buttons-mode")?.checked !== false;
  const quickActionsRow = document.querySelector(".quick-actions-row");

  if (!quickActionsRow || quickActionsRow === form.querySelector("tr:last-child")) {
    return;
  }

  const buttonContainer = quickActionsRow.querySelector(".quick-actions-container");
  if (!buttonContainer) return;

  const buttons = Array.from(buttonContainer.querySelectorAll("button[data-category]"));

  if (bulkButtonsMode) {
    // New mode: Stock, Deposit, Gallery, Closet, Shed, Donate, Discard
    const newOrder = ["stock", "deposit", "gallery", "closet", "storage_shed", "donate", "discard"];
    buttons.sort((a, b) => newOrder.indexOf(a.dataset.category) - newOrder.indexOf(b.dataset.category));
  } else {
    // Old mode: Stock, Deposit, Donate, Discard, Gallery, Closet, Shed
    const oldOrder = ["stock", "deposit", "donate", "discard", "gallery", "closet", "storage_shed"];
    buttons.sort((a, b) => oldOrder.indexOf(a.dataset.category) - oldOrder.indexOf(b.dataset.category));
  }

  // Remove all buttons and re-add in new order
  buttons.forEach(btn => buttonContainer.removeChild(btn));
  buttons.forEach(btn => buttonContainer.appendChild(btn));

  debug(`Quick action buttons reordered to ${bulkButtonsMode ? "new" : "old"} mode`);
}

  // ============================================================================
  // STEP 5: Handle quick action button clicks
  // ============================================================================
function handleQuickAction(form, action) {
    if (action === "clear") {
      clearAllSelections(form);
      return;
    }

    const itemRows = Array.from(form.querySelectorAll("tr")).filter(tr => {
      const radio = tr.querySelector('input[type="radio"]');
      return radio && !radio.disabled;
    });

    let affectedCount = 0;

    itemRows.forEach((row, index) => {
      const rowNumber = index + 1;
      // Check both NP and NC radios
      let radio = row.querySelector(
  `input[type="radio"][value="${action}"]`
);
      if (!radio) {
        radio = row.querySelector(
  `input[type="radio"][name*="cash_radio_arr"][value="${action}"]`
);
      }

      if (radio && !radio.disabled) {
        // Select the radio using our function
        selectRadioForRow(form, rowNumber, action);
        // Update visuals immediately
        updatePillVisuals(form, rowNumber);
        affectedCount++;
      }
    });

debug(`Action '${action}' applied to ${affectedCount} items`);

    // Show confirmation for dangerous actions (check settings)
    if (affectedCount > 0) {
      const discardWarningsEnabled = document.getElementById("setting-discard-warnings")?.checked !== false;
      const donateWarningsEnabled = document.getElementById("setting-donate-warnings")?.checked !== false;

      const shouldWarn = (action === "discard" && discardWarningsEnabled) ||
                         (action === "donate" && donateWarningsEnabled);

      if (shouldWarn) {
        showConfirmationDialog(action, affectedCount, form);
      }
    }
  }

function clearAllSelections(form) {
  const itemRows = Array.from(form.querySelectorAll("tr")).filter(tr => {
    const radio = tr.querySelector('input[type="radio"]');
    return radio && !radio.disabled;
  });

  itemRows.forEach((row, index) => {
    const rowNumber = index + 1;

    // Uncheck all radios in this row (both NP and NC)
    const radiosInRow = row.querySelectorAll('input[type="radio"]');
    radiosInRow.forEach(r => {
      r.checked = false;
    });

    // Update pill visuals
    updatePillVisuals(form, rowNumber);
  });

  debug("All selections cleared");
}
  // ============================================================================
  // STEP 6: Show confirmation dialog for dangerous actions
  // ============================================================================
  function showConfirmationDialog(action, count, form) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "confirmation-overlay";

    // Create modal
    const modal = document.createElement("div");
    modal.className = "confirmation-modal";

    const title = document.createElement("h3");
    title.className = "confirmation-title";
    title.textContent = "Warning";
    modal.appendChild(title);

    const actionWord = action === "donate" ? "donate" : "discard";
    const message = document.createElement("p");
    message.className = "confirmation-message";
    message.textContent = `You are about to ${actionWord} ${count} item${count > 1 ? "s" : ""}. This cannot be undone. Are you sure?`;
    modal.appendChild(message);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "confirmation-buttons";

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "confirmation-button confirm";
    confirmBtn.textContent = `Yes, ${actionWord.toUpperCase()}`;
    confirmBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    buttonContainer.appendChild(confirmBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "confirmation-button cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
      clearAllSelections(form);
      document.body.removeChild(overlay);
    });
    buttonContainer.appendChild(cancelBtn);

    modal.appendChild(buttonContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

// ============================================================================
  // STEP 7: Replace submit button with styled capsule button
  // ============================================================================
function replaceSubmitButton(form) {
    const originalSubmit = form.querySelector("input[type='submit']");
    if (!originalSubmit) return;

    // Hide original submit button
    originalSubmit.style.display = "none";

    debug("Original submit button hidden; new button will be added in replaceClearButton");
  }

// ============================================================================
  // STEP 8: Replace Clear button with styled version
  // ============================================================================
function replaceClearButton(form) {
    const originalClear = form.querySelector("input[type='reset']");
    if (!originalClear) return;

    const submitRow = form.querySelector("tr:last-child");
    if (!submitRow) return;

    const submitCell = submitRow.querySelector("td");
    if (!submitCell) return;

    // Create main container with space-between to separate left and right
    const mainContainer = document.createElement("div");
    mainContainer.style.display = "flex";
    mainContainer.style.alignItems = "center";
    mainContainer.style.justifyContent = "space-between";
    mainContainer.style.gap = "15px";
    mainContainer.style.width = "100%";

    // Create centered buttons container for Submit and Clear All
    const centeredButtonsContainer = document.createElement("div");
    centeredButtonsContainer.style.display = "flex";
    centeredButtonsContainer.style.alignItems = "center";
    centeredButtonsContainer.style.justifyContent = "center";
    centeredButtonsContainer.style.gap = "15px";
    centeredButtonsContainer.style.flex = "1";

    // Create new styled submit button (moved here for correct positioning)
    const newSubmitBtn = document.createElement("button");
    newSubmitBtn.type = "button";
    newSubmitBtn.className = "submit-capsule-button";
    newSubmitBtn.textContent = "Submit";

    newSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSubmit(form);
    });

    // Create new styled clear button
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "action-button clear-button-blue";
    clearBtn.textContent = "Clear All";

    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearAllSelections(form);
    });

    centeredButtonsContainer.appendChild(newSubmitBtn);
    centeredButtonsContainer.appendChild(clearBtn);

    // Create scroll up button for right alignment
    const scrollUpBtn = document.createElement("button");
    scrollUpBtn.type = "button";
    scrollUpBtn.className = "scroll-up-button";
    scrollUpBtn.innerHTML = "▲";
    scrollUpBtn.title = "Scroll to top";

    scrollUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    mainContainer.appendChild(centeredButtonsContainer);
    mainContainer.appendChild(scrollUpBtn);
    submitCell.appendChild(mainContainer);

    debug("Submit, Clear, and scroll buttons positioned correctly");
  }

// ============================================================================
  // STEP 8.5: Style submit row to match quick actions
  // ============================================================================
function styleSubmitRow(form) {
    const submitRow = form.querySelector("tr:last-child");
    if (!submitRow) return;

    submitRow.classList.add("quick-actions-row");

    const submitCell = submitRow.querySelector("td");
    if (submitCell) {
      submitCell.classList.add("quick-actions-cell");
    }

    debug("Submit row styled to match quick actions");
  }

  // ============================================================================
  // STEP 9: Handle form submission with danger checks
  // ============================================================================
function handleSubmit(form) {
    let donateCount = 0;
    let discardCount = 0;

    // Count dangerous actions by reading RADIO BUTTONS only (both NP and NC)
    form.querySelectorAll("input[type='radio'][name^='radio_arr']:checked, input[type='radio'][name^='cash_radio_arr']:checked").forEach(radio => {
      if (radio.value === "donate") donateCount++;
      if (radio.value === "discard") discardCount++;
    });

    const totalDangerous = donateCount + discardCount;

debug(`Submit check: donate=${donateCount}, discard=${discardCount}, total=${totalDangerous}`);

    if (totalDangerous > 0) {
      const discardWarningsEnabled = document.getElementById("setting-discard-warnings")?.checked !== false;
      const donateWarningsEnabled = document.getElementById("setting-donate-warnings")?.checked !== false;

      const shouldWarnDiscard = discardCount > 0 && discardWarningsEnabled;
      const shouldWarnDonate = donateCount > 0 && donateWarningsEnabled;

      if (shouldWarnDiscard || shouldWarnDonate) {
        const actionWord = donateCount > 0 && discardCount > 0 ? "donate and discard" : donateCount > 0 ? "donate" : "discard";
        showFinalConfirmation(actionWord, totalDangerous, form);
        return;
      }
    }

    // No dangerous items or warnings disabled, submit normally
    form.submit();
  }

  function showFinalConfirmation(actionWord, count, form) {
    const overlay = document.createElement("div");
    overlay.className = "confirmation-overlay";

    const modal = document.createElement("div");
    modal.className = "confirmation-modal final-confirmation";

    const title = document.createElement("h3");
    title.className = "confirmation-title";
    title.textContent = "Final Confirmation";
    modal.appendChild(title);

    const message = document.createElement("p");
    message.className = "confirmation-message";
    message.textContent = `You are about to ${actionWord} ${count} item${count > 1 ? "s" : ""}. This action cannot be undone. Are you completely sure?`;
    modal.appendChild(message);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "confirmation-buttons";

    const proceedBtn = document.createElement("button");
    proceedBtn.className = "confirmation-button confirm";
    proceedBtn.textContent = "Proceed";
    proceedBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
      form.submit();
    });
    buttonContainer.appendChild(proceedBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "confirmation-button cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
    buttonContainer.appendChild(cancelBtn);

    modal.appendChild(buttonContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // ============================================================================
  // STEP 10: Style header row
  // ============================================================================
function styleHeaderRow(form) {
    const headerRows = form.querySelectorAll("tr[bgcolor='#EEEEBB'], tr[bgcolor='#eeeebb']");
    if (!headerRows.length) return;

    headerRows.forEach(headerRow => {
      headerRow.classList.add("quickstock-header-row");
      headerRow.querySelectorAll("th").forEach(th => {
        th.classList.add("quickstock-header-cell");
      });
    });
  }

// ============================================================================
  // STEP 11: Add settings panel at top
  // ============================================================================
  function addSettingsPanel(form) {
    const table = form.querySelector("table");
    if (!table) return;

    // Create settings row
    const settingsRow = document.createElement("tr");
    settingsRow.className = "settings-row";

    const settingsCell = document.createElement("td");
    settingsCell.colSpan = "8";
    settingsCell.className = "settings-cell";

    // Create settings button
    const settingsBtn = document.createElement("button");
    settingsBtn.type = "button";
    settingsBtn.className = "settings-button";
    settingsBtn.textContent = "Settings";

    // Create settings panel (hidden by default)
    const settingsPanel = document.createElement("div");
    settingsPanel.className = "settings-panel";
    settingsPanel.style.display = "none";

    // Create toggle for discard warnings
    const discardToggleContainer = document.createElement("div");
    discardToggleContainer.className = "settings-toggle-container";

    const discardLabel = document.createElement("label");
    discardLabel.className = "settings-toggle-wrapper";

    const discardCheckbox = document.createElement("input");
    discardCheckbox.type = "checkbox";
    discardCheckbox.id = "setting-discard-warnings";
    discardCheckbox.checked = true;
    discardCheckbox.className = "settings-checkbox";

    const discardToggle = document.createElement("span");
    discardToggle.className = "settings-toggle-pill";

    const discardText = document.createElement("span");
    discardText.className = "settings-toggle-text";
    discardText.textContent = "Enable Discard Warnings";

    discardLabel.appendChild(discardCheckbox);
    discardLabel.appendChild(discardToggle);
    discardLabel.appendChild(discardText);
    discardToggleContainer.appendChild(discardLabel);

// Create toggle for donate warnings
    const donateToggleContainer = document.createElement("div");
    donateToggleContainer.className = "settings-toggle-container";

    const donateLabel = document.createElement("label");
    donateLabel.className = "settings-toggle-wrapper";

    const donateCheckbox = document.createElement("input");
    donateCheckbox.type = "checkbox";
    donateCheckbox.id = "setting-donate-warnings";
    donateCheckbox.checked = true;
    donateCheckbox.className = "settings-checkbox";

    const donateToggle = document.createElement("span");
    donateToggle.className = "settings-toggle-pill";

    const donateText = document.createElement("span");
    donateText.className = "settings-toggle-text";
    donateText.textContent = "Enable Donate Warnings";

    donateLabel.appendChild(donateCheckbox);
    donateLabel.appendChild(donateToggle);
    donateLabel.appendChild(donateText);
    donateToggleContainer.appendChild(donateLabel);

    // Create toggle for bulk buttons mode
    const bulkButtonsToggleContainer = document.createElement("div");
    bulkButtonsToggleContainer.className = "settings-toggle-container";

    const bulkButtonsLabel = document.createElement("label");
    bulkButtonsLabel.className = "settings-toggle-wrapper";

    const bulkButtonsCheckbox = document.createElement("input");
    bulkButtonsCheckbox.type = "checkbox";
    bulkButtonsCheckbox.id = "setting-bulk-buttons-mode";
    bulkButtonsCheckbox.checked = true;
    bulkButtonsCheckbox.className = "settings-checkbox";

    const bulkButtonsToggle = document.createElement("span");
    bulkButtonsToggle.className = "settings-toggle-pill";

    const bulkButtonsText = document.createElement("span");
    bulkButtonsText.className = "settings-toggle-text";
    bulkButtonsText.textContent = "Display All Bulk Buttons First";

    bulkButtonsLabel.appendChild(bulkButtonsCheckbox);
    bulkButtonsLabel.appendChild(bulkButtonsToggle);
    bulkButtonsLabel.appendChild(bulkButtonsText);
    bulkButtonsToggleContainer.appendChild(bulkButtonsLabel);

    // Add change listener to reorder buttons
    bulkButtonsCheckbox.addEventListener("change", () => {
      reorderQuickActionButtons(form);
    });

    settingsPanel.appendChild(discardToggleContainer);
    settingsPanel.appendChild(donateToggleContainer);
    settingsPanel.appendChild(bulkButtonsToggleContainer);

    // Toggle panel visibility on button click
    settingsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (settingsPanel.style.display === "none") {
        settingsPanel.style.display = "block";
      } else {
        settingsPanel.style.display = "none";
      }
    });

// Create container for settings and scroll button
    const settingsContainer = document.createElement("div");
    settingsContainer.style.display = "flex";
    settingsContainer.style.alignItems = "center";
    settingsContainer.style.justifyContent = "center";
    settingsContainer.style.gap = "15px";
    settingsContainer.style.flexWrap = "wrap";

    // Create settings button wrapper
    const settingsWrapper = document.createElement("div");
    settingsWrapper.style.display = "flex";
    settingsWrapper.style.flexDirection = "column";
    settingsWrapper.style.alignItems = "center";
    settingsWrapper.style.gap = "12px";
    settingsWrapper.style.flex = "1";

    settingsWrapper.appendChild(settingsBtn);
    settingsWrapper.appendChild(settingsPanel);

    // Create scroll down button
    const scrollDownBtn = document.createElement("button");
    scrollDownBtn.type = "button";
    scrollDownBtn.className = "scroll-down-button";
    scrollDownBtn.innerHTML = "▼";
    scrollDownBtn.title = "Scroll to quick actions";

    scrollDownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const quickActionsRow = document.querySelector(".quick-actions-row");
      if (quickActionsRow) {
        quickActionsRow.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    settingsContainer.appendChild(settingsWrapper);
    settingsContainer.appendChild(scrollDownBtn);
    settingsCell.appendChild(settingsContainer);
    settingsRow.appendChild(settingsCell);

    // Insert at the very top of the table
    table.insertBefore(settingsRow, table.firstChild);

    debug("Settings panel added");
  }
// ============================================================================
  // STEP 11: Replace default headers with custom headers every 20 items
  // ============================================================================
function replaceDefaultHeaders(form) {
    const table = form.querySelector("table");
    if (!table) return;

    // Find all header rows (default ones that appear every 20 items) - both cases
    const allRows = table.querySelectorAll("tr[bgcolor='#EEEEBB'], tr[bgcolor='#eeeebb']");

    allRows.forEach(row => {
      const firstCell = row.querySelector("th");
      if (firstCell && firstCell.textContent.includes("Object Name")) {
        // This is a default header row - replace it with custom styling
        row.classList.add("quickstock-header-row");
        row.querySelectorAll("th").forEach(th => {
          th.classList.add("quickstock-header-cell");
        });
        debug("Replaced default header with custom styled header");
      }
    });
  }

  // ============================================================================
  // STEP 12: Inject all custom CSS
  // ============================================================================
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      /* ========== PILL TOGGLE STYLES (using labels) ========== */
.pill-toggle-label {
  display: inline-block;
  width: 50px;
  height: 28px;
  background-color: #e0e0e0;
  border: 2px solid #999;
  border-radius: 14px;
  cursor: pointer;
  user-select: none;
  text-align: center;
  line-height: 24px;
  font-weight: bold;
  color: #666;
  transition: all 0.2s ease;
  position: relative;
  vertical-align: middle;
  font-size: 16px;
  padding: 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pill-toggle-label:hover {
  background-color: #f0f0f0;
  border-color: #666;
  transform: scale(1.05);
}

.pill-toggle-label:active {
  transform: scale(0.95);
}

/* ACTIVE pill state (JavaScript adds .active class) */
.pill-toggle-label.active {
  background: linear-gradient(to bottom, #4CAF50, #45a049);
  border-color: #2d7d32;
  color: white;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
}

.pill-toggle-label.active:before {
  content: '✓';
  color: white;
  opacity: 1;
}

.pill-toggle-label:before {
  content: '✕';
  opacity: 0.4;
  color: #999;
}

/* ========== SETTINGS PANEL ========== */
      .settings-row {
        background: linear-gradient(to bottom, #f6e250, #ebb233) !important;
      }

      .settings-cell {
        padding: 12px !important;
        text-align: center;
      }

      .settings-button {
        background: linear-gradient(to bottom, rgb(255, 80, 80), rgb(220, 40, 40));
        box-shadow:
          rgb(255,80,80) 0 0 0 1px inset,
          rgb(180,20,20) 0 -3px 2px 3px inset,
          rgb(255,180,180) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(255,255,255);
        border: 0.8px solid white;
        border-radius: 15px;
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        padding: 8px 16px;
        min-height: 32px;
        transition: all 0.2s ease;
      }

      .settings-button:hover {
        background: linear-gradient(to bottom, rgb(255, 100, 100), rgb(240, 60, 60));
        transform: translateY(-2px);
      }

      .settings-button:active {
        background: linear-gradient(to bottom, rgb(220, 40, 40), rgb(255, 80, 80));
        transform: translateY(0);
      }

.settings-panel {
        margin-top: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid #333;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
      }

      .settings-toggle-container {
        display: flex;
padding: 2px;
        align-items: left;
        justify-content: left;
      }

      .settings-toggle-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        user-select: none;
      }

      .settings-checkbox {
        display: none;
      }

      .settings-toggle-pill {
        display: inline-block;
        width: 50px;
        height: 28px;
        background-color: #e0e0e0;
        border: 2px solid #999;
        border-radius: 14px;
        position: relative;
        transition: all 0.2s ease;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .settings-toggle-pill:before {
        content: '✕';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #999;
        opacity: 0.4;
        font-weight: bold;
        font-size: 16px;
      }

      .settings-checkbox:checked + .settings-toggle-pill {
        background: linear-gradient(to bottom, #4CAF50, #45a049);
        border-color: #2d7d32;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
      }

      .settings-checkbox:checked + .settings-toggle-pill:before {
        content: '✓';
        color: white;
        opacity: 1;
      }

      .settings-toggle-pill:hover {
        background-color: #f0f0f0;
        border-color: #666;
        transform: scale(1.05);
      }

      .settings-checkbox:checked + .settings-toggle-pill:hover {
        background: linear-gradient(to bottom, #5bc05f, #4db852);
      }

      .settings-toggle-text {
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        font-size: 14px;
        font-weight: bold;
        color: #333;
      }

.scroll-down-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(to bottom, rgb(255, 80, 80), rgb(220, 40, 40));
        border: 0.8px solid white;
        box-shadow:
          rgb(255,80,80) 0 0 0 1px inset,
          rgb(180,20,20) 0 -3px 2px 3px inset,
          rgb(255,180,180) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        cursor: pointer;
        font-size: 20px;
        color: white;
        font-weight: bold;
        transition: all 0.2s ease;
        margin-left: 20px;
      }

      .scroll-down-button:hover {
        background: linear-gradient(to bottom, rgb(255, 100, 100), rgb(240, 60, 60));
        transform: scale(1.1);
      }

      .scroll-down-button:active {
        transform: scale(0.95);
      }

      .scroll-up-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(to bottom, rgb(255, 80, 80), rgb(220, 40, 40));
        border: 0.8px solid white;
        box-shadow:
          rgb(255,80,80) 0 0 0 1px inset,
          rgb(180,20,20) 0 -3px 2px 3px inset,
          rgb(255,180,180) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        cursor: pointer;
        font-size: 20px;
        color: white;
        font-weight: bold;
        transition: all 0.2s ease;
      }

      .scroll-up-button:hover {
        background: linear-gradient(to bottom, rgb(255, 100, 100), rgb(240, 60, 60));
        transform: scale(1.1);
      }

      .scroll-up-button:active {
        transform: scale(0.95);
      }

      /* ========== ITEM DISPLAY ========== */
      .item-display-container {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        width: 100%;
        text-align: left;
      }

      .item-display-image {
        height: 50px;
        width: 50px;
        flex-shrink: 0;
        border-radius: 4px;
      }

      .item-info-container {
        display: grid;
        gap: 4px;
        flex: 1;
      }

      .item-name {
        font-size: 1.3em;
        font-weight: bold;
        font-family: "Cafeteria", "Arial Bold", sans-serif;
      }

   .item-flags {
        font-size: 0.85em;
        display: none !important;
      }

.item-rarity {
        font-size: 1.05em;
        color: #666;
font-weight: bold;
        font-family: "Cafeteria", "Arial Bold", sans-serif;
      }

.item-rarity.rarity-1-74 {
        color: #888;
      }

      .item-rarity.rarity-75-100 {
        color: #2d7d32;
      }

      .item-rarity.rarity-101-104,
      .item-rarity.rarity-111-179,
      .item-rarity.rarity-200-250 {
        color: #cc0000;
      }

      .item-rarity.rarity-105-110 {
        color: #ff8c00;
      }

      .item-rarity.rarity-180 {
        color: #a0a0a0;
      }

      .item-rarity.rarity-500 {
        color: #8b00ff;
      }

      /* ========== QUICK ACTION BUTTONS (YELLOW CAPSULE) ========== */
      .quick-actions-row {
        background: linear-gradient(to bottom, #f6e250, #ebb233) !important;
        border-top: 2px solid #ccc;
      }

      .quick-actions-cell {
        padding: 12px !important;
        text-align: center;
      }

      .quick-actions-container {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }

.action-button {
        background: linear-gradient(to bottom, rgb(246, 226, 80), rgb(235, 178, 51));
        border: 0.8px solid white;
        border-radius: 15px;
        box-shadow:
          rgb(246,226,80) 0 0 0 1px inset,
          rgb(196,124,25) 0 -3px 2px 3px inset,
          rgb(253,249,220) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(0,0,0);
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        padding: 8px 16px;
        min-height: 32px;
        transition: all 0.2s ease;
      }

      .action-button:hover:not(.danger-button, .clear-button-blue) {
        background: linear-gradient(to bottom, rgb(250, 230, 90), rgb(240, 185, 60));
        transform: translateY(-2px);
      }

      .action-button:active:not(.danger-button) {
        background: linear-gradient(to bottom, rgb(235, 178, 51), rgb(246, 226, 80));
        transform: translateY(0);
      }

      /* Danger action buttons (red) */
      .danger-button {
        background: linear-gradient(to bottom, rgb(255, 80, 80), rgb(220, 40, 40));
        box-shadow:
          rgb(255,80,80) 0 0 0 1px inset,
          rgb(180,20,20) 0 -3px 2px 3px inset,
          rgb(255,180,180) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(255,255,255);
      }

      .danger-button:hover {
        background: linear-gradient(to bottom, rgb(255, 100, 100), rgb(240, 60, 60));
        transform: translateY(-2px);
      }

.danger-button:active {
        background: linear-gradient(to bottom, rgb(220, 40, 40), rgb(255, 80, 80));
        transform: translateY(0);
      }

      /* Blue Clear button */
      .clear-button-blue {
        background: linear-gradient(to bottom, rgb(100, 180, 255), rgb(40, 120, 200));
        box-shadow:
          rgb(100,180,255) 0 0 0 1px inset,
          rgb(20,80,160) 0 -3px 2px 3px inset,
          rgb(180,220,255) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(255,255,255);
      }

.clear-button-blue:hover {
        background: linear-gradient(to bottom, rgb(80, 160, 235), rgb(30, 100, 180));
        transform: translateY(-2px);
      }

      .clear-button-blue:active {
        background: linear-gradient(to bottom, rgb(40, 120, 200), rgb(100, 180, 255));
        transform: translateY(0);
      }

      /* ========== SUBMIT BUTTON (YELLOW CAPSULE) ========== */
.submit-capsule-button {
background: linear-gradient(to bottom, rgb(129, 199, 132), rgb(56, 142, 60));
border: 0.8px solid white;
border-radius: 15px;
box-shadow:
rgb(76,175,80) 0 0 0 1px inset,
rgb(27, 94, 32) 0 -3px 2px 3px inset,
rgb(165, 214, 167) 0 2px 0 1px inset,
rgb(0,0,0) 0 0 0 2px !important;
color: rgb(255,255,255);
font-family: "Cafeteria", "Arial Bold", sans-serif;
font-size: 13px;
font-weight: bold;
cursor: pointer;
padding: 8px 16px;
min-height: 32px;
transition: all 0.2s ease;
}

.submit-capsule-button:hover {
        background: linear-gradient(to bottom, rgb(102, 187, 106), rgb(76, 175, 80)) !important;
        transform: translateY(-2px);
      }

      .submit-capsule-button:active {
        background: linear-gradient(to bottom, rgb(56, 142, 60), rgb(76, 175, 80)) !important;
        transform: translateY(0);
      }

      .clear-button-blue {
        background: linear-gradient(to bottom, rgb(100, 180, 255), rgb(40, 120, 200));
        box-shadow:
          rgb(100,180,255) 0 0 0 1px inset,
          rgb(20,80,160) 0 -3px 2px 3px inset,
          rgb(180,220,255) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(255,255,255);
      }

      .clear-button-blue:hover {
        background: linear-gradient(to bottom, rgb(120, 200, 255), rgb(60, 140, 220));
      }

      .clear-button-blue:active {
        background: linear-gradient(to bottom, rgb(40, 120, 200), rgb(100, 180, 255));
      }

      /* ========== HEADER STYLING ========== */
      .quickstock-header-row {
        background: linear-gradient(to bottom, #f6e250, #ebb233) !important;
      }

      .quickstock-header-cell {
        padding: 12px 8px !important;
        color: rgb(54,54,54);
        font-weight: bold;
        font-family: "Cafeteria", "Arial Bold", sans-serif;
      }

      /* ========== CONFIRMATION DIALOG ========== */
      .confirmation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      }

      .confirmation-modal {
        background: linear-gradient(to bottom, #f6e250, #ebb233);
        border: 2px solid #333;
        border-radius: 8px;
        padding: 24px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        font-family: "Cafeteria", "Arial Bold", sans-serif;
      }

      .confirmation-title {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 18px;
        color: #cc0000;
        font-weight: bold;
      }

      .confirmation-message {
        margin: 16px 0;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }

      .confirmation-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
      }

.confirmation-button {
        background: linear-gradient(to bottom, rgb(246, 226, 80), rgb(235, 178, 51));
        border: 0.8px solid white;
        border-radius: 15px;
        box-shadow:
          rgb(246,226,80) 0 0 0 1px inset,
          rgb(196,124,25) 0 -3px 2px 3px inset,
          rgb(253,249,220) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(0,0,0);
        font-family: "Cafeteria", "Arial Bold", sans-serif;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        padding: 8px 16px;
        min-height: 32px;
        transition: all 0.2s ease;
      }

      .confirmation-button:hover {
        background: linear-gradient(to bottom, rgb(250, 230, 90), rgb(240, 185, 60));
        transform: translateY(-2px);
      }

      .confirmation-button:active {
        background: linear-gradient(to bottom, rgb(235, 178, 51), rgb(246, 226, 80));
        transform: translateY(0);
      }

      .confirmation-button.cancel {
        background: linear-gradient(to bottom, rgb(100, 180, 255), rgb(40, 120, 200));
        box-shadow:
          rgb(100,180,255) 0 0 0 1px inset,
          rgb(20,80,160) 0 -3px 2px 3px inset,
          rgb(180,220,255) 0 2px 0 1px inset,
          rgb(0,0,0) 0 0 0 2px;
        color: rgb(255,255,255);
      }

      .confirmation-button.cancel:hover {
        background: linear-gradient(to bottom, rgb(120, 200, 255), rgb(60, 140, 220));
      }

      .confirmation-button.cancel:active {
        background: linear-gradient(to bottom, rgb(40, 120, 200), rgb(100, 180, 255));
      }

.final-confirmation {
        border: 3px solid #cc0000;
      }

/* Override inline bgcolor attribute for quick-actions-row */
      tr.quick-actions-row {
        background: linear-gradient(to bottom, #f6e250, #ebb233) !important;
        background-color: transparent !important;
      }

      tr.quick-actions-row td {
        background: inherit !important;
        background-color: inherit !important;
      }

/* NC Divider Row Styling - Override bgcolor attribute */
      tr.nc-divider-row {
        background: #85ffcb !important;
        background-color: #85ffcb !important;
      }

      tr.nc-divider-row td,
      td.nc-divider-cell {
        background: #85ffcb !important;
        background-color: #85ffcb !important;
        color: black !important;
        font-weight: bold !important;
        font-family: "Cafeteria", "Arial Bold", sans-serif !important;
        font-size: 14px !important;
        text-align: center !important;
        padding: 8px !important;
        border: 2px solid #2d7d32 !important;
      }

      /* Force removal of bgcolor attribute styling */
      tr[bgcolor="#ffffff"].nc-divider-row,
      tr[bgcolor="#FFFFFF"].nc-divider-row {
        background: #85ffcb !important;
        background-color: #85ffcb !important;
      }
    `;

    document.head.appendChild(style);
    debug("CSS styles injected");
  }
})();
