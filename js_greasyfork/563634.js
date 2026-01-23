// ==UserScript==
// @name         Customizable Bazaar Filler
// @namespace    http://tampermonkey.net/
// @version      1.94
// @description  On click, auto-fills bazaar item quantities and prices based on your preferences
// @match        https://www.torn.com/bazaar.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      weav3r.dev
// @downloadURL https://update.greasyfork.org/scripts/563634/Customizable%20Bazaar%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/563634/Customizable%20Bazaar%20Filler.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function handleError(error, context = "") {
    console.error(`[Bazaar Filler] ${context}:`, error);

    if (error.userMessage) {
      alert(error.userMessage);
    }
  }

  function safeExecute(fn, context = "") {
    return async function (...args) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        handleError(error, context);
        return null;
      }
    };
  }

  const styleBlock = `
  .item-toggle {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      outline: none;
  }
  @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
  }
  .item-toggle::after {
      content: '\\2713';
      position: absolute;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
  }
  .item-toggle:checked::after {
      display: block;
  }

  body:not(.dark-mode) .item-toggle {
      border: 1px solid #ccc;
      background: #fff;
  }
  body:not(.dark-mode) .item-toggle:checked {
      background: #007bff;
  }
  body:not(.dark-mode) .item-toggle:checked::after {
      color: #fff;
  }

  body.dark-mode .item-toggle {
      border: 1px solid #4e535a;
      background: #2f3237;
  }
  body.dark-mode .item-toggle:checked {
      background: #4e535a;
  }
  body.dark-mode .item-toggle:checked::after {
      color: #fff;
  }

  .checkbox-wrapper {
      position: absolute;
      top: 50%;
      right: 8px;
      width: 30px;
      height: 30px;
      transform: translateY(-50%);
      cursor: pointer;
  }
  .checkbox-wrapper input.item-toggle {
      position: absolute;
      top: 6px;
      left: 6px;
  }

  .settings-modal-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
  }
  .settings-modal {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      min-width: 300px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      color: #000;
  }
  .settings-modal h2 {
      margin-top: 0;
  }
  .settings-modal label {
      display: block;
      margin: 10px 0 5px;
  }
  .settings-modal input, .settings-modal select {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
  }
  .settings-modal button {
      margin-top: 15px;
      padding: 5px 10px;
  }
  .settings-modal div[style*="text-align:right"] {
      text-align: right;
  }
  body.dark-mode .settings-modal {
      background: #2f3237;
      color: #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.7);
  }
  body.dark-mode .settings-modal input,
  body.dark-mode .settings-modal select {
      background: #3c3f41;
      color: #fff;
      border: 1px solid #555;
  }
  body.dark-mode .settings-modal button {
      background: #555;
      color: #fff;
      border: none;
  }

  .black-friday-active {
      color: #28a745 !important;
  }
  .black-friday-active .black-friday-icon {
      color: #28a745 !important;
      fill: #28a745 !important;
  }
  .black-friday-icon {
      color: inherit;
      fill: currentColor;
  }
    `;
  $("<style>").prop("type", "text/css").html(styleBlock).appendTo("head");

  let apiKey = GM_getValue("tornApiKey", "");
  let pricingSource = GM_getValue("pricingSource", "Market Value");
  if (pricingSource === "Bazaars/TornPal") {
    pricingSource = "Bazaars/weav3r.dev";
    GM_setValue("pricingSource", pricingSource);
  }
  let itemMarketOffset = GM_getValue("itemMarketOffset", -1);
  let itemMarketMarginType = GM_getValue("itemMarketMarginType", "absolute");
  let itemMarketListing = GM_getValue("itemMarketListing", 1);
  let itemMarketClamp = GM_getValue("itemMarketClamp", false);
  let marketMarginOffset = GM_getValue("marketMarginOffset", 0);
  let marketMarginType = GM_getValue("marketMarginType", "absolute");
  let bazaarMarginOffset = GM_getValue("bazaarMarginOffset", 0);
  let bazaarMarginType = GM_getValue("bazaarMarginType", "absolute");
  let bazaarClamp = GM_getValue("bazaarClamp", false);
  let bazaarListing = GM_getValue("bazaarListing", 1);
  let blackFridayMode = GM_getValue("blackFridayMode", false);
  const validPages = ["#/add", "#/manage"];
  let currentPage = window.location.hash;
  let itemMarketCache = {};
  let weav3rItemCache = {};

  function getItemIdByName(itemName) {
    const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
    for (const [id, info] of Object.entries(storedItems)) {
      if (info.name === itemName) return id;
    }
    return null;
  }
  function getPriceColor(listedPrice, marketValue) {
    if (marketValue <= 0) return "";
    const ratio = listedPrice / marketValue;
    const lowerBound = 0.998;
    const upperBound = 1.002;
    const isDarkMode = document.body.classList.contains("dark-mode");
    if (ratio >= lowerBound && ratio <= upperBound) {
      return "";
    }
    if (ratio < lowerBound) {
      const diff = lowerBound - ratio;
      const t = Math.min(diff / 0.05, 1.2);
      if (isDarkMode) {
        const r = Math.round(255 - t * (255 - 190));
        const g = Math.round(255 - t * (255 - 70));
        const b = Math.round(255 - t * (255 - 70));
        return `rgb(${r},${g},${b})`;
      } else {
        const r = Math.round(180 - t * 40);
        const g = Math.round(60 - t * 40);
        const b = Math.round(60 - t * 40);
        return `rgb(${r},${g},${b})`;
      }
    } else {
      const diff = ratio - upperBound;
      const t = Math.min(diff / 0.05, 1.2);
      if (isDarkMode) {
        const r = Math.round(255 - t * (255 - 70));
        const g = Math.round(255 - t * (255 - 190));
        const b = Math.round(255 - t * (255 - 70));
        return `rgb(${r},${g},${b})`;
      } else {
        const r = Math.round(60 - t * 40);
        const g = Math.round(160 - t * 40);
        const b = Math.round(60 - t * 40);
        return `rgb(${r},${g},${b})`;
      }
    }
  }
  async function fetchItemMarketData(itemId) {
    if (!apiKey) {
      const error = new Error("No API key set for Item Market calls.");
      error.userMessage =
        "No API key set. Please set your Torn API key in Bazaar Filler Settings before continuing.";
      throw error;
    }
    const now = Date.now();
    if (itemMarketCache[itemId] && now - itemMarketCache[itemId].time < 30000) {
      return itemMarketCache[itemId].data;
    }
    const url = `https://api.torn.com/v2/market/${itemId}/itemmarket?comment=wBazaarFiller`;
    const res = await fetch(url, {
      headers: { Authorization: "ApiKey " + apiKey },
    });
    const data = await res.json();
    if (data.error) {
      const error = new Error("Item Market API error: " + data.error.error);
      error.userMessage = "Item Market API error: " + data.error.error;
      throw error;
    }
    itemMarketCache[itemId] = { time: now, data };
    return data;
  }
  async function fetchWeav3rItemData(itemId) {
    const now = Date.now();
    if (weav3rItemCache[itemId] && now - weav3rItemCache[itemId].time < 60000) {
      return weav3rItemCache[itemId].data;
    }
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://weav3r.dev/api/marketplace/${itemId}`,
        onload: function (response) {
          const data = JSON.parse(response.responseText);
          weav3rItemCache[itemId] = { time: now, data };
          resolve(data);
        },
        onerror: function (err) {
          reject(new Error("Failed fetching weav3r.dev item data"));
        },
      });
    });
  }
  function updatePriceFieldColor($priceInput) {
    var _a;
    let $row = $priceInput.closest("li.clearfix");
    let itemName = "";
    if ($row.length) {
      itemName = $row.find(".name-wrap span.t-overflow").text().trim();
    } else {
      $row = $priceInput.closest(".item___jLJcf");
      itemName = $row.length ? $row.find(".desc___VJSNQ b").text().trim() : "";
    }
    if (!itemName) return;
    const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
    const matchedItem = Object.values(storedItems).find(
      (i) => i.name === itemName,
    );
    if (!matchedItem || !matchedItem.market_value) return;
    const raw =
      ((_a = $priceInput.val()) === null || _a === void 0
        ? void 0
        : _a.replace(/,/g, "")) || "";
    const typedPrice = Number(raw);
    if (isNaN(typedPrice)) {
      $priceInput.css("color", "");
      return;
    }
    $priceInput.css(
      "color",
      getPriceColor(typedPrice, matchedItem.market_value),
    );
  }
  function attachPriceFieldObservers() {
    $(".price input").each(function () {
      const $el = $(this);
      if ($el.data("listenerAttached")) return;
      $el.on("input", function () {
        updatePriceFieldColor($(this));
      });
      $el.data("listenerAttached", true);
      updatePriceFieldColor($el);
    });
    $(".price___DoKP7 .input-money-group.success input.input-money").each(
      function () {
        const $el = $(this);
        if ($el.data("listenerAttached")) return;
        $el.on("input", function () {
          updatePriceFieldColor($(this));
        });
        $el.data("listenerAttached", true);
        updatePriceFieldColor($el);
      },
    );
    $(
      "[class*=bottomMobileMenu___] [class*=priceMobile___] .input-money-group.success input.input-money",
    ).each(function () {
      const $el = $(this);
      if ($el.data("listenerAttached")) return;
      $el.on("input", function () {
        updatePriceFieldColor($(this));
      });
      $el.data("listenerAttached", true);
      updatePriceFieldColor($el);
    });
  }

  async function calculatePrice(itemName, itemId, matchedItem) {
    if (!matchedItem) return null;

    if (pricingSource === "Market Value") {
      const mv = matchedItem.market_value;
      let finalPrice = mv;
      if (marketMarginType === "absolute") {
        finalPrice += marketMarginOffset;
      } else if (marketMarginType === "percentage") {
        finalPrice = Math.round(mv * (1 + marketMarginOffset / 100));
      }
      return { price: finalPrice, marketValue: mv };
    }

    if (pricingSource === "Item Market" && itemId) {
      const data = await safeExecute(
        fetchItemMarketData,
        "Fetch Item Market Data",
      )(itemId);
      if (!data || !data.itemmarket?.listings?.length) return null;

      const listings = data.itemmarket.listings;
      const baseIndex = Math.min(itemMarketListing - 1, listings.length - 1);
      const listingPrice = listings[baseIndex].price;

      let finalPrice;
      if (itemMarketMarginType === "absolute") {
        finalPrice = listingPrice + itemMarketOffset;
      } else if (itemMarketMarginType === "percentage") {
        finalPrice = Math.round(listingPrice * (1 + itemMarketOffset / 100));
      } else {
        finalPrice = listingPrice;
      }

      if (itemMarketClamp && matchedItem.market_value) {
        finalPrice = Math.max(finalPrice, matchedItem.market_value);
      }

      return {
        price: finalPrice,
        marketValue: matchedItem.market_value,
        listings: listings.slice(0, 5),
      };
    }

    if (pricingSource === "Bazaars/weav3r.dev") {
      if (!itemId) return null;

      const itemData = await safeExecute(
        fetchWeav3rItemData,
        "Fetch weav3r.dev Item Data",
      )(itemId);
      if (!itemData || !itemData.listings || itemData.listings.length === 0)
        return null;

      const baseIndex = Math.min(
        bazaarListing - 1,
        itemData.listings.length - 1,
      );
      const basePrice = itemData.listings[baseIndex].price;

      let finalPrice;
      if (bazaarMarginType === "absolute") {
        finalPrice = basePrice + bazaarMarginOffset;
      } else if (bazaarMarginType === "percentage") {
        finalPrice = Math.round(basePrice * (1 + bazaarMarginOffset / 100));
      } else {
        finalPrice = basePrice;
      }

      if (bazaarClamp && matchedItem.market_value) {
        finalPrice = Math.max(finalPrice, matchedItem.market_value);
      }

      return { price: finalPrice, marketValue: matchedItem.market_value };
    }

    return null;
  }

  async function updateAddRow($row, isChecked) {
    const $qtyInput = $row.find(".amount input").first();
    const $priceInput = $row.find(".price input").first();
    const $choiceCheckbox = $row.find("div.amount.choice-container input");

    if (!isChecked) {
      if ($choiceCheckbox.length && $choiceCheckbox.prop("checked")) {
        $choiceCheckbox.click();
      }
      if ($qtyInput.data("orig") !== undefined) {
        $qtyInput.val($qtyInput.data("orig"));
        $qtyInput.removeData("orig");
      } else {
        $qtyInput.val("");
      }
      $qtyInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
      if ($priceInput.data("orig") !== undefined) {
        $priceInput.val($priceInput.data("orig"));
        $priceInput.removeData("orig");
        $priceInput.css("color", "");
      } else {
        $priceInput.val("");
      }
      $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
      $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
      return;
    }

    if (!$qtyInput.data("orig")) $qtyInput.data("orig", $qtyInput.val());
    if (!$priceInput.data("orig")) $priceInput.data("orig", $priceInput.val());

    if ($choiceCheckbox.length) {
      if (!$choiceCheckbox.prop("checked")) {
        $choiceCheckbox.click();
      }
    } else {
      const qty = $row.find(".item-amount.qty").text().trim();
      $qtyInput.val(qty);
      $qtyInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
    }

    if (blackFridayMode) {
      $priceInput.val("1");
      $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
      $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));
      return;
    }

    const itemName = $row.find(".name-wrap span.t-overflow").text().trim();
    const itemId = getItemIdByName(itemName);
    const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
    const matchedItem = Object.values(storedItems).find(
      (i) => i.name === itemName,
    );

    const priceData = await calculatePrice(itemName, itemId, matchedItem);
    if (!priceData) return;

    if (priceData.listings) {
      const $checkbox = $row
        .find(".checkbox-wrapper input.item-toggle")
        .first();
      const listingsText = priceData.listings
        .map(
          (x, i) =>
            `${i + 1}) $${x.price.toLocaleString("en-US")} x${x.amount}`,
        )
        .join("\n");
      $checkbox.attr("title", listingsText);
      setTimeout(() => {
        $checkbox.removeAttr("title");
      }, 30000);
    }

    $priceInput.val(priceData.price.toLocaleString("en-US"));
    $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
    $priceInput[0].dispatchEvent(new Event("keyup", { bubbles: true }));

    if (priceData.marketValue) {
      $priceInput.css(
        "color",
        getPriceColor(priceData.price, priceData.marketValue),
      );
    }
  }
  async function updateManageRow($row, isChecked) {
    const $priceInput = $row
      .find(".price___DoKP7 .input-money-group.success input.input-money")
      .first();

    if ($priceInput.length === 0) {
      console.warn("Price input not found in the row:", $row);
      return;
    }

    if (!isChecked) {
      if ($priceInput.data("orig") !== undefined) {
        $priceInput.val($priceInput.data("orig"));
        $priceInput.removeData("orig");
        $priceInput.css("color", "");
      } else {
        $priceInput.val("");
      }
      $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if (!$priceInput.data("orig")) $priceInput.data("orig", $priceInput.val());

    if (blackFridayMode) {
      $priceInput.val("1");
      $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    const itemName = $row.find(".desc___VJSNQ b").text().trim();
    const itemId = getItemIdByName(itemName);
    const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
    const matchedItem = Object.values(storedItems).find(
      (i) => i.name === itemName,
    );

    const priceData = await calculatePrice(itemName, itemId, matchedItem);
    if (!priceData) return;

    if (priceData.listings) {
      const $checkbox = $row
        .find(".checkbox-wrapper input.item-toggle")
        .first();
      const listingsText = priceData.listings
        .map(
          (x, i) =>
            `${i + 1}) $${x.price.toLocaleString("en-US")} x${x.amount}`,
        )
        .join("\n");
      $checkbox.attr("title", listingsText);
      setTimeout(() => {
        $checkbox.removeAttr("title");
      }, 30000);
    }

    $priceInput.val(priceData.price.toLocaleString("en-US"));
    $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));

    if (priceData.marketValue) {
      $priceInput.css(
        "color",
        getPriceColor(priceData.price, priceData.marketValue),
      );
    }
  }
  async function updateManageRowMobile($row, isChecked) {
    const $priceInput = $row
      .find(
        "[class*=bottomMobileMenu___] [class*=priceMobile___] .input-money-group.success input.input-money",
      )
      .first();

    if (!$priceInput.length) {
      console.error("Mobile price field not found.");
      return;
    }

    if (!isChecked) {
      if ($priceInput.data("orig") !== undefined) {
        $priceInput.val($priceInput.data("orig"));
        $priceInput.removeData("orig");
        $priceInput.css("color", "");
      } else {
        $priceInput.val("");
      }
      $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    if (!$priceInput.data("orig")) $priceInput.data("orig", $priceInput.val());

    if (blackFridayMode) {
      $priceInput.val("1");
      $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    const itemName = $row.find(".desc___VJSNQ b").text().trim();
    const itemId = getItemIdByName(itemName);
    const storedItems = JSON.parse(localStorage.getItem("tornItems") || "{}");
    const matchedItem = Object.values(storedItems).find(
      (i) => i.name === itemName,
    );

    const priceData = await calculatePrice(itemName, itemId, matchedItem);
    if (!priceData) return;

    $priceInput.val(priceData.price.toLocaleString("en-US"));
    $priceInput[0].dispatchEvent(new Event("input", { bubbles: true }));

    if (priceData.marketValue) {
      $priceInput.css(
        "color",
        getPriceColor(priceData.price, priceData.marketValue),
      );
    }
  }

  function openSettingsModal() {
    $(".settings-modal-overlay").remove();
    const $overlay = $('<div class="settings-modal-overlay"></div>');
    const $modal = $(`
              <div class="settings-modal" style="width:400px; max-width:90%; font-family:Arial, sans-serif;">
                  <h2 style="margin-bottom:6px;">Bazaar Filler Settings</h2>
                  <hr style="border-top:1px solid #ccc; margin:8px 0;">
                  <div style="margin-bottom:15px;">
                      <label for="api-key-input" style="font-weight:bold; display:block;">Torn API Key</label>
                      <div style="display:flex; align-items:center; gap:8px;">
                          <input id="api-key-input" type="text" placeholder="Enter API key" style="flex:1; padding:6px; box-sizing:border-box;" value="${apiKey || ""}">
                          <button id="refresh-market-values" style="padding:6px; cursor:pointer; background:none; border:none;" title="Refresh Market Values">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M23 4v6h-6"></path>
                                  <path d="M1 20v-6h6"></path>
                                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                              </svg>
                          </button>
                      </div>
                  </div>
                  <hr style="border-top:1px solid #ccc; margin:8px 0;">
                  <div style="margin-bottom:15px;">
                      <label for="pricing-source-select" style="font-weight:bold; display:block;">Pricing Source</label>
                      <select id="pricing-source-select" style="width:100%; padding:6px; box-sizing:border-box;">
                          <option value="Market Value">Market Value</option>
                          <option value="Bazaars/weav3r.dev">Bazaars/weav3r.dev</option>
                          <option value="Item Market">Item Market</option>
                      </select>
                  </div>
                  <div id="market-value-options" style="display:none; margin-bottom:15px;">
                      <hr style="border-top:1px solid #ccc; margin:8px 0;">
                      <h3 style="margin:0 0 10px 0; font-size:1em; font-weight:bold;">Market Value Options</h3>
                      <div style="margin-bottom:10px;">
                          <label for="market-margin-offset" style="display:block;">Margin (ie: -1 is either $1 less or 1% less depending on margin type)</label>
                          <input id="market-margin-offset" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${marketMarginOffset}">
                      </div>
                      <div style="margin-bottom:10px;">
                          <label for="market-margin-type" style="display:block;">Margin Type</label>
                          <select id="market-margin-type" style="width:100%; padding:6px; box-sizing:border-box;">
                              <option value="absolute">Absolute ($)</option>
                              <option value="percentage">Percentage (%)</option>
                          </select>
                      </div>
                  </div>
                  <div id="item-market-options" style="display:none; margin-bottom:15px;">
                      <hr style="border-top:1px solid #ccc; margin:8px 0;">
                      <h3 style="margin:0 0 10px 0; font-size:1em; font-weight:bold;">Item Market Options</h3>
                      <div style="margin-bottom:10px;">
                          <label for="item-market-listing" style="display:block;">Listing Index (1 = lowest, 2 = 2nd lowest, etc)</label>
                          <input id="item-market-listing" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${itemMarketListing}">
                      </div>
                      <div style="margin-bottom:10px;">
                          <label for="item-market-offset" style="display:block;">Margin (ie: -1 is either $1 less or 1% less depending on margin type)</label>
                          <input id="item-market-offset" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${itemMarketOffset}">
                      </div>
                      <div style="margin-bottom:10px;">
                          <label for="item-market-margin-type" style="display:block;">Margin Type</label>
                          <select id="item-market-margin-type" style="width:100%; padding:6px; box-sizing:border-box;">
                              <option value="absolute">Absolute ($)</option>
                              <option value="percentage">Percentage (%)</option>
                          </select>
                      </div>
                      <div style="display:inline-flex; align-items:center; margin-bottom:5px;">
                          <input id="item-market-clamp" type="checkbox" style="margin-right:5px;" ${itemMarketClamp ? "checked" : ""}>
                          <label for="item-market-clamp" style="margin:0; cursor:pointer;">Clamp minimum price to Market Value</label>
                      </div>
                  </div>
                  <div id="weav3r-options" style="display:none; margin-bottom:15px;">
                      <hr style="border-top:1px solid #ccc; margin:8px 0;">
                      <h3 style="margin:0 0 10px 0; font-size:1em; font-weight:bold;">weav3r.dev Options</h3>
                      <div style="margin-bottom:10px;">
                          <label for="weav3r-listing" style="display:block;">Listing Index (1 = lowest, 2 = 2nd lowest, etc)</label>
                          <input id="weav3r-listing" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${bazaarListing || 1}">
                      </div>
                      <div style="margin-bottom:10px;">
                          <label for="weav3r-margin-offset" style="display:block;">Margin (e.g., -1 for $1 less or 1% less)</label>
                          <input id="weav3r-margin-offset" type="number" style="width:100%; padding:6px; box-sizing:border-box;" value="${bazaarMarginOffset}">
                      </div>
                      <div style="margin-bottom:10px;">
                          <label for="weav3r-margin-type" style="display:block;">Margin Type</label>
                          <select id="weav3r-margin-type" style="width:100%; padding:6px; box-sizing:border-box;">
                              <option value="absolute">Absolute ($)</option>
                              <option value="percentage">Percentage (%)</option>
                          </select>
                      </div>
                      <div style="display:inline-flex; align-items:center; margin-bottom:5px;">
                          <input id="weav3r-clamp" type="checkbox" style="margin-right:5px;" ${bazaarClamp ? "checked" : ""}>
                          <label for="weav3r-clamp" style="margin:0; cursor:pointer;">Clamp minimum price to Market Value</label>
                      </div>
                  </div>
                  <hr style="border-top:1px solid #ccc; margin:8px 0;">
                  <div style="text-align:right;">
                      <button id="settings-save" style="margin-right:8px; padding:6px 10px; cursor:pointer;">Save</button>
                      <button id="settings-cancel" style="padding:6px 10px; cursor:pointer;">Cancel</button>
                  </div>
              </div>
          `);
    $overlay.append($modal);
    $("body").append($overlay);
    $("#pricing-source-select").val(pricingSource);
    $("#item-market-margin-type").val(itemMarketMarginType);
    $("#market-margin-type").val(marketMarginType);
    $("#weav3r-margin-type").val(bazaarMarginType);
    function toggleFields() {
      const src = $("#pricing-source-select").val();
      $("#market-value-options").toggle(src === "Market Value");
      $("#item-market-options").toggle(src === "Item Market");
      $("#weav3r-options").toggle(src === "Bazaars/weav3r.dev");
    }
    $("#pricing-source-select").change(toggleFields);
    toggleFields();
    $("#settings-save").click(function () {
      var _a;
      const oldPricingSource = pricingSource;
      apiKey =
        ((_a = $("#api-key-input").val()) === null || _a === void 0
          ? void 0
          : _a.trim()) || "";
      pricingSource = $("#pricing-source-select").val();
      if (oldPricingSource !== pricingSource) {
        itemMarketCache = {};
        weav3rItemCache = {};
      }
      if (pricingSource === "Bazaars/weav3r.dev") {
        bazaarMarginOffset = Number($("#weav3r-margin-offset").val() || 0);
        bazaarMarginType = $("#weav3r-margin-type").val();
        bazaarClamp = $("#weav3r-clamp").is(":checked");
        bazaarListing = Number($("#weav3r-listing").val() || 1);

        GM_setValue("bazaarMarginOffset", bazaarMarginOffset);
        GM_setValue("bazaarMarginType", bazaarMarginType);
        GM_setValue("bazaarClamp", bazaarClamp);
        GM_setValue("bazaarListing", bazaarListing);
      }
      if (pricingSource === "Market Value") {
        marketMarginOffset = Number($("#market-margin-offset").val() || 0);
        marketMarginType = $("#market-margin-type").val();
        GM_setValue("marketMarginOffset", marketMarginOffset);
        GM_setValue("marketMarginType", marketMarginType);
      }
      if (pricingSource === "Item Market") {
        itemMarketListing = Number($("#item-market-listing").val() || 1);
        itemMarketOffset = Number($("#item-market-offset").val() || -1);
        itemMarketMarginType = $("#item-market-margin-type").val();
        itemMarketClamp = $("#item-market-clamp").is(":checked");
        GM_setValue("itemMarketListing", itemMarketListing);
        GM_setValue("itemMarketOffset", itemMarketOffset);
        GM_setValue("itemMarketMarginType", itemMarketMarginType);
        GM_setValue("itemMarketClamp", itemMarketClamp);
      }
      GM_setValue("tornApiKey", apiKey);
      GM_setValue("pricingSource", pricingSource);
      $overlay.remove();
    });
    $("#settings-cancel").click(() => $overlay.remove());

    $("#refresh-market-values").click(
      safeExecute(async function () {
        const $button = $(this);
        const $svg = $button.find("svg");
        const currentApiKey = $("#api-key-input").val().trim() || apiKey;

        if (!currentApiKey) {
          const error = new Error("No API key");
          error.userMessage = "Please enter a valid API key first.";
          throw error;
        }

        $button.prop("disabled", true);
        $svg.css("animation", "spin 1s linear infinite");

        try {
          const response = await fetch(
            `https://api.torn.com/torn/?key=${currentApiKey}&selections=items&comment=wBazaarFiller`,
          );
          const data = await response.json();

          if (!data.items) {
            throw new Error(
              data.error?.error || "Failed to fetch market values",
            );
          }

          const filtered = {};
          for (const [id, item] of Object.entries(data.items)) {
            if (item.tradeable) {
              filtered[id] = {
                name: item.name,
                market_value: item.market_value,
              };
            }
          }

          localStorage.setItem("tornItems", JSON.stringify(filtered));
          GM_setValue("lastUpdatedTime", Date.now());

          const $successMsg = $(
            '<div style="color: #28a745; margin-top: 5px;">Market values refreshed successfully!</div>',
          );
          $button.after($successMsg);
          setTimeout(() => $successMsg.remove(), 3000);
        } catch (error) {
          const $errorMsg = $(
            '<div style="color: #dc3545; margin-top: 5px;">Error: ' +
              error.message +
              "</div>",
          );
          $button.after($errorMsg);
          setTimeout(() => $errorMsg.remove(), 3000);
          throw error;
        } finally {
          $button.prop("disabled", false);
          $svg.css("animation", "");
        }
      }, "Refresh Market Values"),
    );
  }
  function addPricingSourceLink() {
    if (document.getElementById("pricing-source-button")) return;

    const linksContainer = document.querySelector(".linksContainer___LiOTN");
    if (!linksContainer) {
      return;
    }

    const link = document.createElement("a");
    link.id = "pricing-source-button";
    link.href = "#";
    link.className =
      "linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9";
    link.target = "_self";
    link.rel = "noreferrer";

    const iconSpan = document.createElement("span");
    iconSpan.className =
      "iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV";
    iconSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 1 0 6.492 3.246 3.246 0 0 1 0-6.492zM5.754 8a2.246 2.246 0 1 0 4.492 0 2.246 2.246 0 0 0-4.492 0z"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 0-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 0-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 0 .52 1.255l-.16.292c-.892 1.64.901 3.433 2.54 2.54l.292-.16a.873.873 0 0 0 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 0 1.255-.52l.292.16c1.64.893 3.433-.902 2.54-2.541l-.16-.292a.873.873 0 0 0-.52-1.255l-.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 0-.52-1.255l-.16-.292c-.893-1.64-.902-3.433-2.54-2.54l-.292.16a.873.873 0 0 0-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.416 1.6.42 1.184 1.185l-.16.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.318.094a1.873 1.873 0 0 0-1.116 2.692l.16.292c.416.764-.42 1.6-1.185 1.184l-.291-.16a1.873 1.873 0 0 0-1.116-2.692l-.318-.094c-.835-.246-.835-1.428 0-1.674l.318-.094a1.873 1.873 0 0 0 1.116-2.692l-.16-.292c-.416-.764.42-1.6 1.185-1.184l.292.16a1.873 1.873 0 0 0 2.693-1.115l.094-.318z"/>
            </svg>
        `;
    link.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "linkTitle____NPyM";
    textSpan.textContent = "Bazaar Filler Settings";
    link.appendChild(textSpan);

    link.addEventListener("click", function (e) {
      e.preventDefault();
      openSettingsModal();
    });

    linksContainer.insertBefore(link, linksContainer.firstChild);
  }
  function addBlackFridayToggle() {
    if (document.getElementById("black-friday-toggle")) return;

    const linksContainer = document.querySelector(".linksContainer___LiOTN");
    if (!linksContainer) {
      return;
    }

    const link = document.createElement("a");
    link.id = "black-friday-toggle";
    link.href = "#";
    link.className =
      "linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9";
    if (blackFridayMode) {
      link.classList.add("black-friday-active");
    }
    link.target = "_self";
    link.rel = "noreferrer";

    const iconSpan = document.createElement("span");
    iconSpan.className =
      "iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV";
    iconSpan.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="black-friday-icon" style="color: ${blackFridayMode ? "#28a745" : "inherit"}; fill: ${blackFridayMode ? "#28a745" : "currentColor"};">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
            </svg>
        `;
    link.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "linkTitle____NPyM";
    textSpan.textContent = blackFridayMode
      ? "Black Friday: ON"
      : "Black Friday: OFF";
    link.appendChild(textSpan);

    link.addEventListener("click", function (e) {
      e.preventDefault();
      blackFridayMode = !blackFridayMode;
      GM_setValue("blackFridayMode", blackFridayMode);
      textSpan.textContent = blackFridayMode
        ? "Black Friday: ON"
        : "Black Friday: OFF";
      const svg = this.querySelector(".black-friday-icon");
      if (svg) {
        svg.style.color = blackFridayMode ? "#28a745" : "inherit";
        svg.style.fill = blackFridayMode ? "#28a745" : "currentColor";
      }
      if (blackFridayMode) {
        link.classList.add("black-friday-active");
      } else {
        link.classList.remove("black-friday-active");
      }
    });

    const settingsButton = document.getElementById("pricing-source-button");
    if (settingsButton) {
      linksContainer.insertBefore(link, settingsButton);
    } else {
      linksContainer.insertBefore(link, linksContainer.firstChild);
    }
  }

  // NEW FUNCTION: Add Select All button for the manage page
  // Replace the addManagePageSelectAll function with this improved version:

  function addManagePageSelectAll() {
    if (document.getElementById("select-all-manage-button")) return;

    const linksContainer = document.querySelector(".linksContainer___LiOTN");
    if (!linksContainer) {
      return;
    }

    const link = document.createElement("a");
    link.id = "select-all-manage-button";
    link.href = "#";
    link.className =
      "linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP iconActive___oAum9";
    link.target = "_self";
    link.rel = "noreferrer";

    const iconSpan = document.createElement("span");
    iconSpan.className =
      "iconWrapper___x3ZLe iconWrapper___COKJD svgIcon___IwbJV";
    iconSpan.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
    `;
    link.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "linkTitle____NPyM";
    textSpan.textContent = "Select All";
    link.appendChild(textSpan);

    let isProcessing = false;
    let shouldCancel = false;

    link.addEventListener(
      "click",
      safeExecute(async function (e) {
        e.preventDefault();

        // If already processing, cancel it
        if (isProcessing) {
          shouldCancel = true;
          textSpan.textContent = "Cancelling...";
          return;
        }

        if (!GM_getValue("tornApiKey", "")) {
          const error = new Error("No API key set");
          error.userMessage =
            "No Torn API key set. Please click the 'Bazaar Filler Settings' button to enter your API key.";
          openSettingsModal();
          throw error;
        }

        const $checkboxes = $(
          ".item___jLJcf .checkbox-wrapper input.item-toggle:not(:checked)",
        );
        if ($checkboxes.length === 0) {
          textSpan.textContent = "All Selected";
          setTimeout(() => {
            textSpan.textContent = "Select All";
          }, 2000);
          return;
        }

        isProcessing = true;
        shouldCancel = false;
        link.style.opacity = "0.8";

        const totalItems = $checkboxes.length;
        let processedItems = 0;
        let errorCount = 0;

        // Determine delay based on pricing source
        let delayMs = 100; // Default delay for Market Value (no API calls)
        if (pricingSource === "Item Market") {
          delayMs = 650; // ~90 requests per minute to stay under limit
        } else if (pricingSource === "Bazaars/weav3r.dev") {
          delayMs = 400; // weav3r.dev may have different limits
        }

        try {
          for (let i = 0; i < $checkboxes.length; i++) {
            if (shouldCancel) {
              textSpan.textContent = `Cancelled (${processedItems}/${totalItems})`;
              setTimeout(() => {
                textSpan.textContent = "Select All";
              }, 2000);
              break;
            }

            const $checkbox = $($checkboxes[i]);
            const $row = $checkbox.closest(".item___jLJcf");

            // Update progress
            textSpan.textContent = `Processing ${i + 1}/${totalItems}...`;

            try {
              $checkbox.prop("checked", true);
              await updateManageRow($row, true);
              processedItems++;
            } catch (err) {
              console.error(
                `[Bazaar Filler] Error processing item ${i + 1}:`,
                err,
              );
              errorCount++;
              $checkbox.prop("checked", false);

              // If we get too many consecutive errors, might be rate limited
              if (errorCount >= 3) {
                textSpan.textContent = `Rate limited? Pausing...`;
                await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second pause
                errorCount = 0; // Reset error count after pause
              }
            }

            // Add delay between items to avoid rate limiting
            if (i < $checkboxes.length - 1 && !shouldCancel) {
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
          }

          if (!shouldCancel) {
            textSpan.textContent = `Done! (${processedItems}/${totalItems})`;
            setTimeout(() => {
              textSpan.textContent = "Select All";
            }, 3000);
          }
        } finally {
          isProcessing = false;
          shouldCancel = false;
          link.style.opacity = "";
        }
      }, "Select All Manage Click"),
    );

    const blackFridayToggle = document.getElementById("black-friday-toggle");
    if (blackFridayToggle) {
      linksContainer.insertBefore(link, blackFridayToggle);
    } else {
      const settingsButton = document.getElementById("pricing-source-button");
      if (settingsButton) {
        linksContainer.insertBefore(link, settingsButton);
      } else {
        linksContainer.insertBefore(link, linksContainer.firstChild);
      }
    }
  }

  // NEW FUNCTION: Remove Select All button when not on manage page
  function removeManagePageSelectAll() {
    const selectAllBtn = document.getElementById("select-all-manage-button");
    if (selectAllBtn) {
      selectAllBtn.remove();
    }
  }

  function createItemToggleCheckbox(updateFunction, context) {
    return $("<input>", {
      type: "checkbox",
      class: "item-toggle",
      click: safeExecute(async function (e) {
        e.stopPropagation();
        if (!GM_getValue("tornApiKey", "")) {
          const error = new Error("No API key set");
          error.userMessage =
            "No Torn API key set. Please click the 'Bazaar Filler Settings' button to enter your API key.";
          $(this).prop("checked", false);
          openSettingsModal();
          throw error;
        }
        await updateFunction.call(this, e);
      }, context),
    });
  }

  function addAddPageCheckboxes() {
    $(".items-cont .title-wrap").each(function () {
      const $el = $(this);
      if ($el.find(".checkbox-wrapper").length) return;
      $el.css("position", "relative");
      const wrapper = $('<div class="checkbox-wrapper"></div>');
      const checkbox = createItemToggleCheckbox(async function (e) {
        await updateAddRow($(this).closest("li.clearfix"), this.checked);
      }, "Add Page Checkbox Click");
      wrapper.append(checkbox);
      $el.append(wrapper);
    });
    $(document)
      .off("dblclick", ".amount input")
      .on("dblclick", ".amount input", function () {
        const $row = $(this).closest("li.clearfix");
        const qty = $row.find(".item-amount.qty").text().trim();
        if (qty) {
          $(this).val(qty);
          $(this)[0].dispatchEvent(new Event("input", { bubbles: true }));
          $(this)[0].dispatchEvent(new Event("keyup", { bubbles: true }));
        }
      });

    if ($(".select-all-action").length === 0) {
      const $clearAllBtn = $(".clear-action");
      if ($clearAllBtn.length) {
        const $selectAllBtn = $(
          '<span class="select-all-action t-blue h c-pointer" style="margin-left: 15px;">Select All</span>',
        );
        $clearAllBtn.before($selectAllBtn);

        $selectAllBtn.on(
          "click",
          safeExecute(async function (e) {
            e.preventDefault();
            if (!GM_getValue("tornApiKey", "")) {
              const error = new Error("No API key set");
              error.userMessage =
                "No Torn API key set. Please click the 'Bazaar Filler Settings' button to enter your API key.";
              openSettingsModal();
              throw error;
            }

            let $activePanel = $(
              ".items-cont.ui-tabs-panel[style*='display: block']",
            );
            if (!$activePanel.length) {
              const $activeTab = $(".ui-tabs-active.ui-state-active");
              if ($activeTab.length) {
                const tabId = $activeTab
                  .find("a")
                  .attr("href")
                  .replace("#", "");
                $activePanel = $(
                  `.items-cont.ui-tabs-panel[data-reactid*='$${tabId}']`,
                );
              }
              if (!$activePanel.length) {
                $activePanel = $(".items-cont.ui-tabs-panel").filter(
                  function () {
                    return $(this).css("display") !== "none";
                  },
                );
              }
            }

            if ($activePanel.length) {
              const $checkboxes = $activePanel.find(
                "li.clearfix:not(.disabled) .checkbox-wrapper input.item-toggle:not(:checked)",
              );
              if ($checkboxes.length === 0) return;

              const originalText = $selectAllBtn.text();
              const totalItems = $checkboxes.length;

              // Determine delay based on pricing source
              let delayMs = 100;
              if (pricingSource === "Item Market") {
                delayMs = 650;
              } else if (pricingSource === "Bazaars/weav3r.dev") {
                delayMs = 400;
              }

              for (let i = 0; i < $checkboxes.length; i++) {
                const $checkbox = $($checkboxes[i]);

                // Update progress
                $selectAllBtn.text(`${i + 1}/${totalItems}...`);

                try {
                  $checkbox.prop("checked", true);
                  const $row = $checkbox.closest("li.clearfix");
                  await updateAddRow($row, true);
                } catch (err) {
                  console.error(
                    `[Bazaar Filler] Error processing item ${i + 1}:`,
                    err,
                  );
                  $checkbox.prop("checked", false);
                }

                // Add delay between items
                if (i < $checkboxes.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, delayMs));
                }
              }

              $selectAllBtn.text("Done!");
              setTimeout(() => {
                $selectAllBtn.text(originalText);
              }, 2000);
            }
          }, "Select All Click"),
        );
      }
    }
  }
  function addManagePageCheckboxes() {
    $(".item___jLJcf").each(function () {
      const $row = $(this);
      const $desc = $row.find(".desc___VJSNQ");
      if (!$desc.length || $desc.find(".checkbox-wrapper").length) return;
      $desc.css("position", "relative");
      const wrapper = $('<div class="checkbox-wrapper"></div>');
      const checkbox = createItemToggleCheckbox(async function (e) {
        const $row = $(this).closest(".item___jLJcf");
        if ($row.length === 0) {
          const $correctRow = $(this).closest(".item___jLJcf");
          if ($correctRow.length > 0) {
            if (window.innerWidth <= 784) {
              const $manageBtn = $correctRow
                .find('button[aria-label="Manage"]')
                .first();
              if ($manageBtn.length) {
                if (!$manageBtn.find("span").hasClass("active___OTFsm")) {
                  $manageBtn.click();
                }
                setTimeout(async () => {
                  await updateManageRowMobile($correctRow, this.checked);
                }, 200);
                return;
              }
            }
            await updateManageRow($correctRow, this.checked);
            return;
          }
          console.warn("Row not found with either selector");
          return;
        }
        await updateManageRow($row, this.checked);
      }, "Manage Page Checkbox Click");
      wrapper.append(checkbox);
      $desc.append(wrapper);
    });
  }

  const storedItems = localStorage.getItem("tornItems");
  const lastUpdatedTime = GM_getValue("lastUpdatedTime", 0);
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const lastUpdatedDate = new Date(lastUpdatedTime);
  const todayUTC = new Date().toISOString().split("T")[0];
  const lastUpdatedUTC = lastUpdatedDate.toISOString().split("T")[0];

  if (
    apiKey &&
    (!storedItems ||
      lastUpdatedUTC < todayUTC ||
      now - lastUpdatedTime >= oneDayMs)
  ) {
    safeExecute(async () => {
      const response = await fetch(
        `https://api.torn.com/torn/?key=${apiKey}&selections=items&comment=wBazaarFiller`,
      );
      const data = await response.json();

      if (!data.items) {
        throw new Error(
          "Failed to fetch Torn items or no items found. Possibly invalid API key or rate limit.",
        );
      }

      const filtered = {};
      for (const [id, item] of Object.entries(data.items)) {
        if (item.tradeable) {
          filtered[id] = {
            name: item.name,
            market_value: item.market_value,
          };
        }
      }

      localStorage.setItem("tornItems", JSON.stringify(filtered));
      GM_setValue("lastUpdatedTime", now);
    }, "Initial Item Fetch")();
  }
  let observerTimeout;
  const domObserver = new MutationObserver((mutations) => {
    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(() => {
      safeExecute(() => {
        const hash = window.location.hash;
        if (hash === "#/add") {
          addAddPageCheckboxes();
          removeManagePageSelectAll(); // Remove manage page select all when on add page
        } else if (hash === "#/manage") {
          addManagePageCheckboxes();
          addManagePageSelectAll(); // Add select all button for manage page
        }
        addPricingSourceLink();
        addBlackFridayToggle();
        attachPriceFieldObservers();
      }, "DOM Observer")();
    }, 100);
  });

  const observeTarget = document.querySelector("#bazaarRoot") || document.body;
  domObserver.observe(observeTarget, {
    childList: true,
    subtree: true,
  });

  const initializeUI = safeExecute(() => {
    const hash = window.location.hash;
    if (hash === "#/add") {
      addAddPageCheckboxes();
      removeManagePageSelectAll();
    } else if (hash === "#/manage") {
      addManagePageCheckboxes();
      addManagePageSelectAll(); // Add select all button for manage page
    }
    addPricingSourceLink();
    addBlackFridayToggle();
    attachPriceFieldObservers();
  }, "Initialize UI");

  window.addEventListener("load", () => setTimeout(initializeUI, 100));
  window.addEventListener("hashchange", () => {
    currentPage = window.location.hash;
    // Remove or add the select all button based on the page
    if (currentPage === "#/manage") {
      addManagePageSelectAll();
    } else {
      removeManagePageSelectAll();
    }
    setTimeout(initializeUI, 100);
  });

  $(document).on("click", "button.undo___FTgvP", function (e) {
    e.preventDefault();
    $(".item___jLJcf .checkbox-wrapper input.item-toggle:checked").each(
      function () {
        $(this).prop("checked", false);
        const $row = $(this).closest(".item___jLJcf");
        updateManageRow($row, false);
      },
    );
  });
  $(document).on("click", ".clear-action", function (e) {
    e.preventDefault();
    $("li.clearfix .checkbox-wrapper input.item-toggle:checked").each(
      function () {
        $(this).prop("checked", false);
        const $row = $(this).closest("li.clearfix");
        updateAddRow($row, false);
      },
    );
  });
  $(document).ready(function () {
    itemMarketCache = {};
    weav3rItemCache = {};
  });
})();
