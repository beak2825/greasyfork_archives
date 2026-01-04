// ==UserScript==
// @name         Inventory Pricing
// @namespace    https://greasyfork.org/users/1543605
// @version      0.5.2
// @description  Adds market pricing for items in your inventory
// @license      MIT
// @author       Bobb
// @match        https://www.zed.city/*
// @connect      api.zed.city
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557585/Inventory%20Pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/557585/Inventory%20Pricing.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const PLUGIN_NAME = 'Inventory Pricing';
  const MARKET_URL = 'https://api.zed.city/getMarket';
  const LOCAL_STORAGE_NAME = 'market-prices';
  const INVENTORY_PRICING_SETTING_LOCAL_STORAGE_NAME = 'inventory-pricing-currency-settings'
  const LOCAL_STORAGE_TTL_MS = 5 * 60 * 1000; 
  const LABEL_SELECTOR = '.q-item__label';
  const PRICE_CLASS = 'market-pricing';
  const DATA_FLAG = 'priceInjected';

  const DEFAULT_CURRENCY_OBJECT_TEMPLATE = {
    locale: "en-US",
    style: "currency",
    currency: "USD"
  }

  const DEFAULT_CURRENCY_OBJ = new Intl.NumberFormat(DEFAULT_CURRENCY_OBJECT_TEMPLATE.locale, { style: DEFAULT_CURRENCY_OBJECT_TEMPLATE.style, currency: DEFAULT_CURRENCY_OBJECT_TEMPLATE.currency});
  let currentCurrencyObject = null;
  let currentCurrencyObjectTemplate = null;

  const COMMON_LOCALES = [
    "en-US",
    "en-GB",
    "fr-FR",
    "de-DE",
    "es-ES",
    "it-IT",
    "ja-JP",
    "zh-CN",
    "ko-KR",
    "pt-BR"
  ];

  const COMMON_CURRENCIES = [
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "CNY",
    "AUD",
    "CAD",
    "CHF",
    "HKD",
    "INR"
  ];

  const getPluginName = () => PLUGIN_NAME.toUpperCase();

  GM_addStyle(`
    .${PRICE_CLASS} {
      font-size: 12px;
      color: #00b894;
      margin: 4px 0 0 0;
      opacity: 0.9;
    }
  `);

  GM_addStyle(`
    .inventory-prices-settings-modal {
      position: absolute;
      bottom: 50px;
      left: 50px;
      width: 200px;
      height: 400px;
      z-index: 2;
      background-color: rgba(30,30,30,0.8);
      padding: 20px;
    }
  `);

  GM_addStyle(`
    .inventory-prices-settings-modal__select {
      width: 100%;
    }
  `);

  const fetchJSON = (url) =>
    new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (res) => {
          try {
            const txt = res.responseText;
            const json = JSON.parse(txt);
            resolve(json);
          } catch (e) {
            console.error(`[${getPluginName()}] Error parsing JSON from ${url}:`, e);
            reject(e);
          }
        },
        onerror: (err) => {
          console.error(`[${getPluginName()}] Request failed:`, err);
          reject(err);
        },
      });
    });

  const initializeSettingsModal = () => {
    const div = document.createElement('div');
    div.classList.add('inventory-prices-settings-modal')

    const localeSelectEl = document.createElement('select')
    const currencySelectEl = document.createElement('select')


    

    if(!localStorage.getItem(INVENTORY_PRICING_SETTING_LOCAL_STORAGE_NAME)) {
      currentCurrencyObject = DEFAULT_CURRENCY_OBJ
      currentCurrencyObjectTemplate = DEFAULT_CURRENCY_OBJECT_TEMPLATE
      localStorage.setItem(INVENTORY_PRICING_SETTING_LOCAL_STORAGE_NAME, JSON.stringify(currentCurrencyObjectTemplate))
    } else {
      currentCurrencyObjectTemplate = JSON.parse(localStorage.getItem(INVENTORY_PRICING_SETTING_LOCAL_STORAGE_NAME))
      currentCurrencyObject = new Intl.NumberFormat(currentCurrencyObjectTemplate.locale, { style: currentCurrencyObjectTemplate.style, currency: currentCurrencyObjectTemplate.currency})
    }

        COMMON_LOCALES.forEach(l => {
      let opt = document.createElement('option')
      opt.value = l
      opt.innerText = l

      if(currentCurrencyObjectTemplate.locale == l) {
        opt.selected = true
      } else {
        opt.selected = false
      }

      localeSelectEl.appendChild(opt)
    })

    

    COMMON_CURRENCIES.forEach(l => {
      let opt = document.createElement('option')
      opt.value = l
      opt.innerText = l

      if(currentCurrencyObjectTemplate.currency == l) {
        opt.selected = true
      } else {
        opt.selected = false
      }

      currencySelectEl.appendChild(opt)
    });


    localeSelectEl.addEventListener('change', (e) => {
      currentCurrencyObjectTemplate.locale = e.target.value
      localStorage.setItem(INVENTORY_PRICING_SETTING_LOCAL_STORAGE_NAME, JSON.stringify(currentCurrencyObjectTemplate))
      currentCurrencyObject = new Intl.NumberFormat(currentCurrencyObjectTemplate.locale, { style: currentCurrencyObjectTemplate.style, currency: currentCurrencyObjectTemplate.currency})

      Array.from(document.querySelectorAll(`.${PRICE_CLASS}`)).forEach(p => {
        const price = p.getAttribute('data-market-price')
        p.textContent = currentCurrencyObject.format(price)
      })
    })

    currencySelectEl.addEventListener('change', (e) => {
      currentCurrencyObjectTemplate.currency = e.target.value
      localStorage.setItem(INVENTORY_PRICING_SETTING_LOCAL_STORAGE_NAME, JSON.stringify(currentCurrencyObjectTemplate))
      currentCurrencyObject = new Intl.NumberFormat(currentCurrencyObjectTemplate.locale, { style: currentCurrencyObjectTemplate.style, currency: currentCurrencyObjectTemplate.currency})

      Array.from(document.querySelectorAll(`.${PRICE_CLASS}`)).forEach(p => {
        const price = p.getAttribute('data-market-price')
        p.textContent = currentCurrencyObject.format(price)
      })
    })

    const localSelectLabelEl = document.createElement('label')
    localSelectLabelEl.style.display = "block"
    localSelectLabelEl.style.color = "white"
    localSelectLabelEl.innerText = "Locale"

    const currencySelectLabelEl = document.createElement('label')
    currencySelectLabelEl.style.display = "block"
    currencySelectLabelEl.style.color = "white"
    currencySelectLabelEl.innerText = "Currency"

    div.appendChild(localSelectLabelEl)
    div.appendChild(localeSelectEl)
    div.appendChild(currencySelectLabelEl)
    div.appendChild(currencySelectEl)
    document.body.appendChild(div)
  }

  const createMarketPriceElement = (price) => {
    const div = document.createElement('div');
    div.classList.add('inventory-pricing__price-wrapper')
    const p = document.createElement('p');
    p.classList.add(PRICE_CLASS);
    p.setAttribute('data-market-price', price)
    p.textContent = currentCurrencyObject.format(price);
    div.appendChild(p);
    return div;
  };

const repaintAllPrices = async () => {
  const data = await getParsedLocalStorage();
  if (!data || !data.map) return;

  const labels = document.querySelectorAll(LABEL_SELECTOR);
  labels.forEach((labelEl) => {
    const itemName = labelEl.textContent?.trim();
    if (!itemName) return;

    const host =
      labelEl.closest('.q-item__section--main') || labelEl.parentElement || labelEl;
    let priceEl = host.querySelector(`.${PRICE_CLASS}`);

    const price = data.map[itemName] ?? null;

    if (price == null) {
      if (priceEl) priceEl.remove();
      labelEl.dataset[DATA_FLAG] = '0';
      return;
    }

    if (!priceEl) {
      host.appendChild(createMarketPriceElement(price));
    } else {
      priceEl.setAttribute('data-market-price', price);
      priceEl.textContent = currentCurrencyObject.format(price);
    }
    labelEl.dataset[DATA_FLAG] = '1';
  });
};

const refreshMarketAndRepaint = async () => {
  try {
    await setLocalStorage();
    await repaintAllPrices();
  } catch (e) {
    console.error(`[${getPluginName()}] refreshMarketAndRepaint error:`, e);
  }
};


  const now = () => Date.now();

  const getRawLocalStorage = async () => {
    const raw = localStorage.getItem(LOCAL_STORAGE_NAME);
    if (!raw) {
      await setLocalStorage(); 
      return localStorage.getItem(LOCAL_STORAGE_NAME);
    }
    return raw;
  };

  const getParsedLocalStorage = async () => {
    try {
      const raw = await getRawLocalStorage();
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`[${getPluginName()}] Error parsing local storage:`, e);
      return null;
    }
  };

  const setLocalStorage = async () => {
    console.log(`[${getPluginName()}] Fetching market data…`);
    const res = await fetchJSON(MARKET_URL);
    
    const map = Array.isArray(res?.items)
      ? Object.fromEntries(res.items.map((i) => [String(i.name || '').trim(), i.market_price ?? null]))
      : {};
    const payload = {
      fetchedAt: now(),
      items: res?.items || [],
      map,
    };
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(payload));
    return payload;
  };

  const ensureMarketData = async () => {
    let data = await getParsedLocalStorage();
    const expired = !data || typeof data.fetchedAt !== 'number' || now() - data.fetchedAt > LOCAL_STORAGE_TTL_MS;
    if (expired) {
      data = await setLocalStorage();
    }
    
    if (!data.map) {
      data.map = Object.fromEntries((data.items || []).map((i) => [String(i.name || '').trim(), i.market_price ?? null]));
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data));
    }
    return data;
  };

  const getMarketPrice = async (nameRaw) => {
    try {
      const name = String(nameRaw || '').trim();
      if (!name) return null;
      const market = await ensureMarketData();
      
      if (name in market.map) return market.map[name];

      
      const lower = name.toLowerCase();
      for (const key of Object.keys(market.map)) {
        if (key.toLowerCase() === lower) return market.map[key];
      }
      return null;
    } catch (e) {
      console.error(`[${getPluginName()}] getMarketPrice error: ${e.message}`);
      return null;
    }
  };

  const injectForLabelEl = async (labelEl) => {
    try {
      
      if (labelEl.dataset[DATA_FLAG] === '1') return;

      const itemName = labelEl.textContent?.trim();
      if (!itemName) return;

      const price = await getMarketPrice(itemName);
      if (price == null) return;

      
      
      const host = labelEl.closest('.q-item__section--main') || labelEl.parentElement || labelEl;
      
      if (host.querySelector(`.${PRICE_CLASS}`)) {
        labelEl.dataset[DATA_FLAG] = '1';
        return;
      }
      host.appendChild(createMarketPriceElement(price));
      labelEl.dataset[DATA_FLAG] = '1';
    } catch (e) {
      console.error(`[${getPluginName()}] Injection error:`, e);
    }
  };

  const processInventoryOnce = () => {
    const labels = document.querySelectorAll(LABEL_SELECTOR);
    if (!labels || labels.length === 0) {
      
      return;
    }
    labels.forEach((el) => void injectForLabelEl(el));
  };

  const observeInventory = () => {
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
        if (m.type === 'attributes') {
          shouldScan = true;
          break;
        }
      }
      if (shouldScan) processInventoryOnce();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    processInventoryOnce();
  };

  // Bind listeners to pagination and filter tabs to refresh market data on click
const bindUITriggers = () => {
  let debounceTimer = null;

  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;

      // Pagination buttons (Quasar q-pagination)
      const hitPagination =
        t.closest('.q-pagination .q-btn') ||
        t.closest('.q-pagination [role="button"]');

      // Category/filter tabs row (the "WEAPONS / ARMOUR / ..." strip)
      // Covers .filter-btn in your screenshot and common Quasar tab roles/classes
      const hitFilters =
        t.closest('.filter-btn') ||
        t.closest('[role="tablist"] .q-tab') ||
        t.closest('[role="tab"]');

      if (hitPagination || hitFilters) {
        clearTimeout(debounceTimer);
        // Small delay lets the UI update before we repaint prices
        debounceTimer = setTimeout(refreshMarketAndRepaint, 120);
      }
    },
    true // capture phase to be more resilient with Quasar’s internal handlers
  );
};


  const wrapHistory = () => {
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function () {
      const ret = push.apply(this, arguments);
      setTimeout(processInventoryOnce, 50);
      return ret;
    };
    history.replaceState = function () {
      const ret = replace.apply(this, arguments);
      setTimeout(processInventoryOnce, 50);
      return ret;
    };
    window.addEventListener('popstate', () => setTimeout(processInventoryOnce, 50));
  };

  const start = () => {
    console.log(`[${getPluginName()}] Starting…`);
    wrapHistory();
    observeInventory();
    bindUITriggers();
    
    ensureMarketData().catch(() => {});

    initializeSettingsModal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
