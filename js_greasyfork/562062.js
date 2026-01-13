// ==UserScript==
// @name         Item Market Selling Helper
// @author       srsbsns
// @version      1.9
// @description  Auto-fill prices $1 below market lowest on Item Market with MV% indicator
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @namespace    srsbsns
// @downloadURL https://update.greasyfork.org/scripts/562062/Item%20Market%20Selling%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562062/Item%20Market%20Selling%20Helper.meta.js
// ==/UserScript==

(() => {
  const BASE = 'https://api.torn.com';
  const S = {
    apiKey: 'torn.apiKey',
    marketDiscount: 'torn.marketDiscount',
    cat: 'torn.items.catalog',
    catTs: 'torn.items.catalog.ts'
  };

  let busy = false;
  let cat = null;

  const getApiKey = () => GM_getValue(S.apiKey, '');
  const setApiKey = v => GM_setValue(S.apiKey, String(v || '').trim());

  const getMarketDiscount = () => {
    const n = Number(GM_getValue(S.marketDiscount, 1));
    return (isFinite(n) && n >= 0) ? n : 1;
  };
  const setMarketDiscount = n => GM_setValue(S.marketDiscount, Number(n) || 1);

  // ---- Menu ----
  GM_registerMenuCommand('Set API key', () => {
    const v = prompt('Enter your Torn API key', getApiKey() || '');
    if (v !== null) { setApiKey(v); alert('Saved.'); }
  });

  GM_registerMenuCommand('Set market undercut amount ($)', () => {
    const v = prompt('Enter dollar amount to undercut lowest market price (e.g., 1 for $1 below):', getMarketDiscount());
    if (v !== null) {
      const num = Number(v);
      if (num >= 0) {
        setMarketDiscount(num);
        alert('Saved market undercut: $' + num);
      } else {
        alert('Please enter a positive number.');
      }
    }
  });

  GM_registerMenuCommand('Refresh item catalog now (force)', async () => {
    try {
      cat = await fetchCatalog(true);
      annotate(true);
      alert('Item catalog refreshed from API.');
    } catch (e) {
      alert('Refresh failed: ' + (e?.message || e));
    }
  });

  // ---- Styles ----
  GM_addStyle(`
    /* Market checkbox - positioned to the right of wrapper with spacing */
    .im-market-cb {
      display: inline-flex !important;
      align-items: center !important;
      margin-left: 12px !important;
      margin-right: 12px !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: relative !important;
      z-index: 100 !important;
      vertical-align: middle !important;
    }

    .im-market-cb input[type="checkbox"] {
      width: 20px !important;
      height: 20px !important;
      margin: 0 !important;
      cursor: pointer !important;
      accent-color: #ff9800 !important;
      display: block !important;
      visibility: visible !important;
    }

    /* MV Percentage Indicator */
    .im-mv-indicator {
      display: inline-block !important;
      margin-left: 8px !important;
      font-weight: bold !important;
      font-size: 12px !important;
      padding: 2px 6px !important;
      border-radius: 3px !important;
      white-space: nowrap !important;
    }

    .im-mv-indicator.good {
      color: #00ff00 !important;
      background: rgba(0, 255, 0, 0.1) !important;
    }

    .im-mv-indicator.warning {
      color: #ffa500 !important;
      background: rgba(255, 165, 0, 0.1) !important;
    }

    .im-mv-indicator.danger {
      color: #ff0000 !important;
      background: rgba(255, 0, 0, 0.1) !important;
    }

    /* Hide indicators on confirm screen */
    [class*="confirm"] .im-mv-indicator,
    [class*="Confirm"] .im-mv-indicator {
      display: none !important;
    }
  `);

  // ---- Page helpers ----
  const onItemMarket = () => /sid=ItemMarket/i.test(location.search || location.href);
  const onAddListing = () => onItemMarket() && /#\/addListing/i.test(location.hash || '');
  const onViewListing = () => onItemMarket() && /#\/viewListing/i.test(location.hash || '');
  const onConfirmScreen = () => onItemMarket() && /#\/addListing\/confirm/i.test(location.hash || '');
  const onListingPage = () => (onAddListing() || onViewListing()) && !onConfirmScreen();

  const selPriceInputs = [
    'div.input-money-group input.input-money[type="text"]',
    'div.input-money-group input.input-money:not([type])',
    'input.input-money[aria-label*="price" i]'
  ].join(',');

  // ---- API ----
  async function xfetch(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET', url,
        onload: r => {
          try {
            if (r.status !== 200) return reject(new Error('HTTP ' + r.status));
            const j = JSON.parse(r.responseText);
            if (j?.error) return reject(new Error(j.error.error_desc || 'API error'));
            resolve(j);
          } catch (e) { reject(e); }
        },
        onerror: e => reject(e)
      });
    });
  }

  // ---- JSON helpers ----
  const JGet = (k) => { try { const v = GM_getValue(k, null); return v ? JSON.parse(v) : null; } catch { return null; } };
  const JSet = (k, o) => GM_setValue(k, JSON.stringify(o || null));

  // ---- Fetch catalog ----
  async function fetchCatalog(force = false) {
    const cached = JGet(S.cat), ts = GM_getValue(S.catTs, 0);
    if (!force && cached && (Date.now() - ts) < 12 * 3600 * 1000) return cached;

    const key = getApiKey();
    if (!key) return {};

    const data = await xfetch(`${BASE}/torn/?selections=items&key=${encodeURIComponent(key)}`);
    const items = data.items || {};
    const out = { byId: {}, byName: {} };

    for (const id in items) {
      const it = items[id] || {};
      const name = (it.name || '').trim();
      if (!name) continue;

      const rec = { id: Number(id), name, mv: Number(it.market_value) || 0, sell: Number(it.sell_price) || 0 };
      out.byId[rec.id] = rec;
      const k = sanitize(name);
      if (!out.byName[k]) out.byName[k] = rec;
    }

    JSet(S.cat, out);
    GM_setValue(S.catTs, Date.now());
    return out;
  }

  const sanitize = s => String(s || '').replace(/\(x?\d+\)$/i, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const lookupByName = (raw, catObj) => catObj.byName[sanitize(raw)] || null;

  // ---- Fetch market prices for specific item ----
  async function fetchMarketPrice(itemId) {
    const key = getApiKey();
    if (!key) throw new Error('API key not set');

    // Use API v2 for itemmarket
    const data = await xfetch(`${BASE}/v2/market/${itemId}?selections=itemmarket&key=${encodeURIComponent(key)}`);

    let lowestPrice = null;

    // Check item market listings - v2 has listings array or direct object
    const listings = data.itemmarket?.listings || data.itemmarket;

    if (Array.isArray(listings)) {
      // If it's an array (sorted by price, cheapest first)
      if (listings.length > 0) {
        lowestPrice = Number(listings[0].price || listings[0].cost);
      }
    } else if (listings && typeof listings === 'object') {
      // If it's an object with listing IDs as keys
      for (const listingId in listings) {
        const listing = listings[listingId];
        const price = Number(listing.price || listing.cost);
        if (price > 0 && (lowestPrice === null || price < lowestPrice)) {
          lowestPrice = price;
        }
      }
    }

    return lowestPrice;
  }

  // ---- Item ID extraction ----
  function getItemIdFromRow(priceInput) {
    // Look for item ID in the row
    const row = priceInput.closest('[class*="item"], [class*="row"], [class*="listing"], li, div');

    // Check data attributes first
    const dataHolder = row?.querySelector('[data-item-id], [data-itemid], [data-item], [data-id]');
    if (dataHolder) {
      for (const attr of ['data-item-id', 'data-itemid', 'data-item', 'data-id']) {
        const v = Number(dataHolder.getAttribute(attr));
        if (v > 0) return v;
      }
    }

    // Check the input itself for data-item-name attribute
    const itemName = priceInput.getAttribute('data-item-name');
    if (itemName && cat) {
      const item = lookupByName(itemName, cat);
      if (item) return item.id;
    }

    // Check aria-label on the price input
    const ariaLabel = priceInput.getAttribute('aria-label');
    if (ariaLabel && cat) {
      // Extract item name from aria-label like "Laptop price" or "Lump of Coal amount"
      const itemName = ariaLabel.replace(/\s+(price|amount)$/i, '').trim();
      if (itemName) {
        const item = lookupByName(itemName, cat);
        if (item) return item.id;
      }
    }

    // Check images
    const img = row?.querySelector('img[src*="/items/"]');
    if (img) {
      const match = img.src.match(/\/items\/(\d+)\//);
      if (match) return Number(match[1]);
    }

    return null;
  }

  // ---- Price apply ----
  function applyPrice(input, price) {
    if (!input) return;

    // Use native setter if available
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeSet) {
      nativeSet.call(input, String(price));
    } else {
      input.value = String(price);
    }

    // Dispatch events with proper configuration for React
    const inputEvent = new Event('input', { bubbles: true, cancelable: true, composed: true });
    const changeEvent = new Event('change', { bubbles: true, cancelable: true, composed: true });

    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);

    // Also update hidden price input if exists
    const hidden = input.closest('.input-money-group')?.querySelector('input[type="hidden"]');
    if (hidden) {
      if (nativeSet) {
        nativeSet.call(hidden, String(price));
      } else {
        hidden.value = String(price);
      }
      hidden.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
      hidden.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
    }
  }

  // ---- Show MV percentage indicator ----
  function showMVIndicator(container, price, itemId) {
    // Remove existing indicator
    const existing = container.querySelector('.im-mv-indicator');
    if (existing) existing.remove();

    if (!cat || !cat.byId[itemId]) return;

    const item = cat.byId[itemId];
    const mv = item.mv;
    const npcPrice = item.sell; // NPC shop sell price

    if (!mv || mv === 0) return;

    const pctDiff = ((price - mv) / mv) * 100;
    const indicator = document.createElement('span');
    indicator.className = 'im-mv-indicator';

    let colorClass = 'good';
    let text = '';

    if (pctDiff < -20) {
      // More than 20% below MV - danger (way too cheap!)
      colorClass = 'danger';
      text = `${Math.round(pctDiff)}% MV`;
    } else if (pctDiff < 0) {
      // Below MV but less than 20%
      colorClass = 'warning';
      text = `${Math.round(pctDiff)}% MV`;
    } else if (pctDiff === 0) {
      colorClass = 'good';
      text = `At MV`;
    } else {
      // Above MV
      colorClass = 'good';
      text = `+${Math.round(pctDiff)}% MV`;
    }

    indicator.classList.add(colorClass);
    indicator.textContent = text;

    // Calculate actual profit after 5% market fee
    const actualProfit = Math.floor(price * 0.95); // Market takes 5% fee

    // Build concise tooltip
    let tooltip = `MV: $${mv.toLocaleString()}\nYour price: $${price.toLocaleString()} → $${actualProfit.toLocaleString()} (after 5% fee)`;

    if (npcPrice && npcPrice > 0) {
      tooltip += `\nNPC price: $${npcPrice.toLocaleString()}`;

      if (actualProfit < npcPrice) {
        const loss = npcPrice - actualProfit;
        tooltip += `\n⚠️ Item market LOSS: $${loss.toLocaleString()}!`;
      } else {
        const profit = actualProfit - npcPrice;
        tooltip += `\n✓ Profit vs NPC: +$${profit.toLocaleString()}`;
      }
    }

    indicator.title = tooltip;

    container.appendChild(indicator);
  }

  // ---- Attach checkbox ----
  function attachMarketCheckbox(priceInput, itemId) {
    if (!onListingPage()) return;
    if (priceInput.dataset.imCb === '1') return;

    const wrapper = priceInput.closest('.priceInputWrapper___TBFHl, [class*="priceInput"], [class*="price"]');
    if (!wrapper) return;

    const container = document.createElement('span');
    container.className = 'im-market-cb';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `im-market-${itemId || Math.random()}`;

    // Function to update MV indicator based on current price
    const updateIndicator = () => {
      // Remove commas from the price string before parsing
      const priceText = (priceInput.value || '').replace(/,/g, '');
      const currentPrice = Number(priceText);
      if (currentPrice && currentPrice > 0) {
        showMVIndicator(container, currentPrice, itemId);
      }
    };

    // Listen for manual price changes
    priceInput.addEventListener('input', updateIndicator);
    priceInput.addEventListener('change', updateIndicator);

    input.addEventListener('change', async () => {
      if (input.checked) {
        try {
          const lowestPrice = await fetchMarketPrice(itemId);

          if (lowestPrice !== null) {
            const undercut = getMarketDiscount();
            const newPrice = Math.max(1, lowestPrice - undercut);

            await new Promise(resolve => {
              requestAnimationFrame(() => {
                applyPrice(priceInput, newPrice);

                // Show MV indicator
                showMVIndicator(container, newPrice, itemId);

                resolve();
              });
            });
          } else {
            // No listings found - uncheck the box
            input.checked = false;
          }
        } catch (e) {
          console.error('Error fetching market price:', e);
          // Error - uncheck the box
          input.checked = false;
        }
      } else {
        // When unchecked, remove the indicator
        const indicator = container.querySelector('.im-mv-indicator');
        if (indicator) indicator.remove();
      }
    });

    container.appendChild(input);

    // Insert AFTER the wrapper, not inside it
    wrapper.insertAdjacentElement('afterend', container);

    priceInput.dataset.imCb = '1';
  }

  // ---- Annotate ----
  async function annotate(force = false) {
    if (!onItemMarket()) return;
    if (!onListingPage()) return;
    if (busy && !force) return;
    busy = true;

    try {
      // Fetch catalog first
      if (!cat) cat = await fetchCatalog(false);

      const inputs = document.querySelectorAll(selPriceInputs);

      inputs.forEach(input => {
        try {
          if (!input.offsetParent) return;
          if (input.dataset.imCb === '1') return;

          const itemId = getItemIdFromRow(input);
          if (!itemId) {
            console.log('Could not find item ID for input:', input);
            return;
          }

          attachMarketCheckbox(input, itemId);
        } catch (e) {
          console.error('Error processing input:', e);
        }
      });

    } catch (e) {
      console.error('Annotate error:', e);
    } finally {
      busy = false;
    }
  }

  // ---- Observer ----
  let timeout = null;
  const mo = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Remove indicators if on confirm screen
      if (onConfirmScreen()) {
        document.querySelectorAll('.im-mv-indicator').forEach(el => el.remove());
      } else {
        annotate();
      }
    }, 300);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      if (onConfirmScreen()) {
        document.querySelectorAll('.im-mv-indicator').forEach(el => el.remove());
      } else {
        annotate(true);
      }
    }, 300);
  });

  setTimeout(() => annotate(), 1000);
})();