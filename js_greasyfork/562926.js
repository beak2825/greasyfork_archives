// ==UserScript==
// @name         Grims Smart Bazaar Pricing
// @namespace    https://www.torn.com/
// @version      1.1.0
// @description  Bazaar pricing helper with smart undercut logic (auto % vs $), per-item + global floors, caching, and UI controls.
// @author       Grimsnecrosis
// @license      GPL-3.0
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      weav3r.dev
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/562926/Grims%20Smart%20Bazaar%20Pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/562926/Grims%20Smart%20Bazaar%20Pricing.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*********************************************************
   * STORAGE KEYS
   *********************************************************/
  const KEY_API = 'grims_api_key';

  // Base undercut settings
  const KEY_UNDERCUT = 'grims_undercut_percent';          // % undercut (wide markets)
  const KEY_TARGET_IDX = 'grims_target_listing_index';    // 0 = lowest, 1 = 2nd, etc.

  // Floors
  const KEY_GLOBAL_FLOOR = 'grims_global_floor';
  const KEY_ITEM_FLOORS  = 'grims_item_floors';           // { [itemId]: floor }

  // Smart logic settings
  const KEY_TIGHT_GAP = 'grims_tight_gap';                // if (base - lowest) <= this => use $ undercut
  const KEY_DOLLAR_UNDERCUT = 'grims_dollar_undercut';    // default $ undercut in tight market
  const KEY_DOLLAR_MIN = 'grims_dollar_min';              // min $ undercut
  const KEY_DOLLAR_MAX = 'grims_dollar_max';              // max $ undercut
  const KEY_MAX_DROP_PCT = 'grims_max_drop_pct';          // refuse if new price drops too much vs your current price
  const KEY_OUTLIER_PCT = 'grims_outlier_pct';            // ignore lowest if it's >X% below next listing

  // Caches
  const KEY_ITEMMAP = 'grims_itemmap_cache';              // { ts, map }
  const KEY_WEAV3R  = 'grims_weav3r_cache';               // { [id]: { ts, listings } }

  // Defaults
  const DEFAULT_UNDERCUT_PERCENT = 2;
  const DEFAULT_TARGET_INDEX = 1; // 1 = 2nd lowest
  const DEFAULT_GLOBAL_FLOOR = 1;

  // Smart defaults
  const DEFAULT_TIGHT_GAP = 2500;       // if gap between lowest and target is small, use $ undercut
  const DEFAULT_DOLLAR_UNDERCUT = 10;   // default $ undercut when tight
  const DEFAULT_DOLLAR_MIN = 1;
  const DEFAULT_DOLLAR_MAX = 250;
  const DEFAULT_MAX_DROP_PCT = 15;      // refuse if it would drop more than 15% from your current listed price
  const DEFAULT_OUTLIER_PCT = 25;       // treat lowest as outlier if it's 25%+ below next price

  // TTLs
  const ITEMMAP_TTL = 24 * 60 * 60 * 1000; // 24h
  const WEAV3R_TTL  = 2 * 60 * 1000;       // 2 min

  /*********************************************************
   * HELPERS
   *********************************************************/
  const ordinal = n => {
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const waitFor = (sel, cb) => {
    const el = document.querySelector(sel);
    if (el) return cb(el);
    const mo = new MutationObserver(() => {
      const f = document.querySelector(sel);
      if (f) { mo.disconnect(); cb(f); }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  const getJSON = url => new Promise((res, rej) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: r => {
        try {
          if (r.status !== 200) return rej(new Error(`HTTP ${r.status}`));
          res(JSON.parse(r.responseText));
        } catch (e) {
          rej(e);
        }
      },
      onerror: () => rej(new Error('Network error'))
    });
  });

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const parseMoney = (s) => {
    if (s == null) return NaN;
    const cleaned = String(s).replace(/[^\d]/g, '');
    if (!cleaned) return NaN;
    return parseInt(cleaned, 10);
  };

  /*********************************************************
   * SETTINGS GETTERS/SETTERS
   *********************************************************/
  const getApiKey = () => GM_getValue(KEY_API, '');
  const setApiKey = v => GM_setValue(KEY_API, (v || '').trim());

  const getUndercutPercent = () => {
    const v = parseFloat(GM_getValue(KEY_UNDERCUT, DEFAULT_UNDERCUT_PERCENT));
    return Number.isFinite(v) ? v : DEFAULT_UNDERCUT_PERCENT;
  };

  const getTargetIndex = () => {
    const v = parseInt(GM_getValue(KEY_TARGET_IDX, DEFAULT_TARGET_INDEX), 10);
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_TARGET_INDEX;
  };

  const getGlobalFloor = () => {
    const v = parseInt(GM_getValue(KEY_GLOBAL_FLOOR, DEFAULT_GLOBAL_FLOOR), 10);
    return Number.isFinite(v) && v >= 1 ? v : DEFAULT_GLOBAL_FLOOR;
  };

  const loadItemFloors = () => {
    try { return JSON.parse(GM_getValue(KEY_ITEM_FLOORS, '{}')) || {}; }
    catch { return {}; }
  };

  const saveItemFloors = obj =>
    GM_setValue(KEY_ITEM_FLOORS, JSON.stringify(obj || {}));

  const getItemFloor = id => {
    const floors = loadItemFloors();
    const v = parseInt(floors[String(id)] ?? '', 10);
    return Number.isFinite(v) && v >= 1 ? v : getGlobalFloor();
  };

  const setItemFloor = (id, name) => {
    const floors = loadItemFloors();
    const current = getItemFloor(id);
    const input = prompt(`Set minimum price floor for:\n${name}`, String(current));
    if (input === null) return;
    const num = parseInt(input, 10);
    if (!Number.isFinite(num) || num < 1) return alert('Invalid floor (must be >= 1).');
    floors[String(id)] = num;
    saveItemFloors(floors);
    alert(`Floor saved for ${name}: ${num.toLocaleString()}`);
  };

  // Smart logic settings
  const getTightGap = () => {
    const v = parseInt(GM_getValue(KEY_TIGHT_GAP, DEFAULT_TIGHT_GAP), 10);
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_TIGHT_GAP;
  };

  const getDollarUndercut = () => {
    const v = parseInt(GM_getValue(KEY_DOLLAR_UNDERCUT, DEFAULT_DOLLAR_UNDERCUT), 10);
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_DOLLAR_UNDERCUT;
  };

  const getDollarMin = () => {
    const v = parseInt(GM_getValue(KEY_DOLLAR_MIN, DEFAULT_DOLLAR_MIN), 10);
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_DOLLAR_MIN;
  };

  const getDollarMax = () => {
    const v = parseInt(GM_getValue(KEY_DOLLAR_MAX, DEFAULT_DOLLAR_MAX), 10);
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_DOLLAR_MAX;
  };

  const getMaxDropPct = () => {
    const v = parseFloat(GM_getValue(KEY_MAX_DROP_PCT, DEFAULT_MAX_DROP_PCT));
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_MAX_DROP_PCT;
  };

  const getOutlierPct = () => {
    const v = parseFloat(GM_getValue(KEY_OUTLIER_PCT, DEFAULT_OUTLIER_PCT));
    return Number.isFinite(v) && v >= 0 ? v : DEFAULT_OUTLIER_PCT;
  };

  /*********************************************************
   * CACHING
   *********************************************************/
  const loadItemMapCache = () => {
    try { return JSON.parse(GM_getValue(KEY_ITEMMAP, 'null')); }
    catch { return null; }
  };

  const saveItemMapCache = obj =>
    GM_setValue(KEY_ITEMMAP, JSON.stringify(obj));

  const ensureItemMap = async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Missing API key (set via menu).');

    const now = Date.now();
    const cached = loadItemMapCache();
    if (cached?.ts && (now - cached.ts) < ITEMMAP_TTL && cached.map) return cached.map;

    const data = await getJSON(`https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(apiKey)}`);
    if (data?.error) throw new Error(`Torn API error: ${data.error.error}`);

    const map = {};
    Object.entries(data.items || {}).forEach(([id, obj]) => {
      if (obj?.name) map[obj.name.toLowerCase()] = Number(id);
    });

    saveItemMapCache({ ts: now, map });
    return map;
  };

  const loadWeav3rCache = () => {
    try { return JSON.parse(GM_getValue(KEY_WEAV3R, '{}')) || {}; }
    catch { return {}; }
  };

  const saveWeav3rCache = obj =>
    GM_setValue(KEY_WEAV3R, JSON.stringify(obj));

  const fetchListings = async id => {
    const cache = loadWeav3rCache();
    const now = Date.now();
    const hit = cache[id];

    if (hit?.ts && (now - hit.ts) < WEAV3R_TTL && Array.isArray(hit.listings)) return hit.listings;

    const data = await getJSON(`https://weav3r.dev/api/marketplace/${id}`);
    const listings = Array.isArray(data?.listings) ? data.listings : [];

    cache[id] = { ts: now, listings };
    saveWeav3rCache(cache);

    return listings;
  };

  /*********************************************************
   * UI
   *********************************************************/
  const addStyles = () => {
    if (document.querySelector('#grims-style')) return;
    const s = document.createElement('style');
    s.id = 'grims-style';
    s.textContent = `
      .grims-label { display:inline-flex; gap:4px; margin-left:6px; align-items:center; }
      .grims-checkbox { width:16px; height:16px; cursor:pointer; }
      .grims-badge { font-size:11px; padding:0 4px; border:1px solid #444; border-radius:3px; cursor:default; }
      .grims-ok { border-color:#3c3; }
      .grims-err { border-color:#c33; }
      .grims-warn { border-color:#cc3; }
      .grims-btn { cursor:pointer; user-select:none; }
    `;
    document.head.appendChild(s);
  };

  const setBadge = (badge, state, text, title) => {
    badge.className = 'grims-badge ' + (state || '');
    badge.textContent = text;
    badge.title = title || '';
  };

  /*********************************************************
   * SMART UNDERCUT LOGIC
   *********************************************************/
  const computeSmartPrice = ({ prices, targetIdx, percentUndercut, tightGap, dollarUndercut, dollarMin, dollarMax, outlierPct }) => {
    // prices sorted asc
    if (!prices.length) throw new Error('No prices');

    // Optional: ignore extreme outlier lowest price if it’s far below next price
    // Example: lowest=1,000, next=2,000 -> lowest is 50% below next; outlierPct=25 => treat as outlier
    let effectivePrices = prices;

    if (prices.length >= 2) {
      const lowest = prices[0];
      const next = prices[1];
      if (lowest > 0) {
        const dropPct = ((next - lowest) / next) * 100; // how far lowest is below next (relative to next)
        if (dropPct >= outlierPct) {
          // skip the outlier listing by using prices[1] as "lowest"
          effectivePrices = prices.slice(1);
        }
      }
    }

    const idx = Math.min(targetIdx, effectivePrices.length - 1);
    const base = effectivePrices[idx];

    const lowestEff = effectivePrices[0];
    const gap = Math.max(0, base - lowestEff);

    // AUTO: tight market => dollar undercut; wide market => percent undercut
    if (gap <= tightGap) {
      const dollars = clamp(dollarUndercut, dollarMin, dollarMax);
      return {
        newPrice: Math.max(1, base - dollars),
        mode: `$-${dollars}`,
        base,
        gap
      };
    }

    const newP = Math.max(1, Math.floor(base * (1 - percentUndercut / 100)));
    return {
      newPrice: newP,
      mode: `%-${percentUndercut}`,
      base,
      gap
    };
  };

  /*********************************************************
   * CORE LOGIC
   *********************************************************/
  const undercutItem = async (itemEl, badge) => {
    try {
      setBadge(badge, '', '⏳', 'Working...');

      const name = (itemEl.getAttribute('aria-label') || '').trim();
      if (!name) throw new Error('Item name not found');

      const map = await ensureItemMap();
      const id = map[name.toLowerCase()];
      if (!id) throw new Error('Item ID not found');

      const listings = await fetchListings(id);
      if (!listings.length) throw new Error('No listings');

      const prices = listings
        .map(x => x?.price)
        .filter(p => Number.isFinite(p))
        .sort((a, b) => a - b);

      if (!prices.length) throw new Error('No valid listing prices');

      const input = itemEl.querySelector('input.input-money');
      if (!input) throw new Error('Price box not found');

      const currentListed = parseMoney(input.value); // your current price (if set)

      const smart = computeSmartPrice({
        prices,
        targetIdx: getTargetIndex(),
        percentUndercut: getUndercutPercent(),
        tightGap: getTightGap(),
        dollarUndercut: getDollarUndercut(),
        dollarMin: getDollarMin(),
        dollarMax: getDollarMax(),
        outlierPct: getOutlierPct()
      });

      let newPrice = smart.newPrice;

      // Floors
      const floor = getItemFloor(id);
      if (newPrice < floor) {
        setBadge(badge, 'grims-err', '🧱', `Floor hit: ${floor.toLocaleString()} (computed ${newPrice.toLocaleString()})`);
        return;
      }

      // Max-drop guard vs your current listed price (prevents nukes)
      // If currentListed is NaN or 0, skip this guard.
      const maxDropPct = getMaxDropPct();
      if (Number.isFinite(currentListed) && currentListed > 0) {
        const minAllowed = Math.floor(currentListed * (1 - maxDropPct / 100));
        if (newPrice < minAllowed) {
          setBadge(
            badge,
            'grims-warn',
            '🛑',
            `Refused: would drop >${maxDropPct}% (current ${currentListed.toLocaleString()} → computed ${newPrice.toLocaleString()})`
          );
          return;
        }
      }

      // Apply
      input.value = String(newPrice);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      setBadge(
        badge,
        'grims-ok',
        '✅',
        `Set ${newPrice.toLocaleString()} | Mode ${smart.mode} | Base ${smart.base.toLocaleString()} | Gap ${smart.gap.toLocaleString()}`
      );
    } catch (e) {
      console.error('[GrimsBazaar]', e);
      setBadge(badge, 'grims-err', '⚠️', String(e?.message || e));
    }
  };

  const addCheckboxes = () => {
    document.querySelectorAll('.item___jLJcf').forEach(item => {
      if (item.querySelector('.grims-checkbox')) return;

      const label = document.createElement('span');
      label.className = 'grims-label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'grims-checkbox';

      const badge = document.createElement('span');
      badge.className = 'grims-badge';
      badge.textContent = '—';

      const floorBtn = document.createElement('span');
      floorBtn.className = 'grims-badge grims-btn';
      floorBtn.textContent = 'F';
      floorBtn.title = 'Set per-item price floor';

      // Prevent click bubbling into Torn handlers
      const stop = (e) => { e.stopPropagation(); e.stopImmediatePropagation(); };
      ['pointerdown','pointerup','click','mousedown','mouseup'].forEach(ev => {
        checkbox.addEventListener(ev, stop, true);
        floorBtn.addEventListener(ev, stop, true);
      });

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) undercutItem(item, badge);
        else setBadge(badge, '', '—', '');
      });

      floorBtn.addEventListener('click', async () => {
        try {
          setBadge(badge, '', '⏳', 'Loading item ID...');
          const name = (item.getAttribute('aria-label') || '').trim();
          const map = await ensureItemMap();
          const id = map[name.toLowerCase()];
          if (!id) throw new Error('Item ID not found');
          setItemFloor(id, name);
          setBadge(badge, '', '—', 'Floor updated');
        } catch (err) {
          console.error('[GrimsBazaar floor]', err);
          setBadge(badge, 'grims-err', '⚠️', 'Failed to set floor');
        }
      });

      label.appendChild(checkbox);
      label.appendChild(badge);
      label.appendChild(floorBtn);

      const host = item.querySelector('.desc___VJSNQ span') || item;
      host.appendChild(label);
    });
  };

  /*********************************************************
   * MENU COMMANDS
   *********************************************************/
  GM_registerMenuCommand('Set API Key', () => {
    const k = prompt('Enter Torn API key:', getApiKey() || '');
    if (k) setApiKey(k);
  });

  GM_registerMenuCommand('Set Undercut Percent (wide market)', () => {
    const input = prompt('Percent undercut for wide markets:', String(getUndercutPercent()));
    if (input === null) return;
    const num = parseFloat(input);
    if (!Number.isFinite(num) || num < 0 || num > 50) return alert('Enter 0–50.');
    GM_setValue(KEY_UNDERCUT, num);
    alert(`Saved: ${num}%`);
  });

  GM_registerMenuCommand('Set Target Listing Index', () => {
    const input = prompt('Target index (0=lowest, 1=2nd lowest, ...):', String(getTargetIndex()));
    if (input === null) return;
    const num = parseInt(input, 10);
    if (!Number.isFinite(num) || num < 0 || num > 50) return alert('Enter 0–50.');
    GM_setValue(KEY_TARGET_IDX, num);
    alert(`Saved: ${num} (${ordinal(num + 1)} lowest)`);
  });

  GM_registerMenuCommand('Set Global Price Floor', () => {
    const input = prompt('Global minimum price floor:', String(getGlobalFloor()));
    if (input === null) return;
    const num = parseInt(input, 10);
    if (!Number.isFinite(num) || num < 1) return alert('Enter >= 1.');
    GM_setValue(KEY_GLOBAL_FLOOR, num);
    alert(`Saved global floor: ${num.toLocaleString()}`);
  });

  GM_registerMenuCommand('Clear All Item Floors', () => {
    GM_setValue(KEY_ITEM_FLOORS, '{}');
    alert('Cleared all per-item floors.');
  });

  GM_registerMenuCommand('Set Tight-Market Gap Threshold ($)', () => {
    const input = prompt('If (base - lowest) <= this, use $-undercut instead of %:', String(getTightGap()));
    if (input === null) return;
    const num = parseInt(input, 10);
    if (!Number.isFinite(num) || num < 0) return alert('Enter >= 0.');
    GM_setValue(KEY_TIGHT_GAP, num);
    alert(`Saved tight gap threshold: ${num.toLocaleString()}`);
  });

  GM_registerMenuCommand('Set Dollar Undercut (tight market)', () => {
    const input = prompt('Dollar undercut used in tight markets:', String(getDollarUndercut()));
    if (input === null) return;
    const num = parseInt(input, 10);
    if (!Number.isFinite(num) || num < 0) return alert('Enter >= 0.');
    GM_setValue(KEY_DOLLAR_UNDERCUT, num);
    alert(`Saved: $${num.toLocaleString()}`);
  });

  GM_registerMenuCommand('Set Dollar Undercut Min/Max', () => {
    const minIn = prompt('Min $ undercut:', String(getDollarMin()));
    if (minIn === null) return;
    const maxIn = prompt('Max $ undercut:', String(getDollarMax()));
    if (maxIn === null) return;

    const minV = parseInt(minIn, 10);
    const maxV = parseInt(maxIn, 10);
    if (!Number.isFinite(minV) || !Number.isFinite(maxV) || minV < 0 || maxV < 0 || minV > maxV) {
      return alert('Invalid min/max.');
    }
    GM_setValue(KEY_DOLLAR_MIN, minV);
    GM_setValue(KEY_DOLLAR_MAX, maxV);
    alert(`Saved $ undercut clamp: ${minV}–${maxV}`);
  });

  GM_registerMenuCommand('Set Max Drop Guard (%)', () => {
    const input = prompt('Refuse if new price would drop more than this % vs your current listed price:', String(getMaxDropPct()));
    if (input === null) return;
    const num = parseFloat(input);
    if (!Number.isFinite(num) || num < 0 || num > 100) return alert('Enter 0–100.');
    GM_setValue(KEY_MAX_DROP_PCT, num);
    alert(`Saved max drop guard: ${num}%`);
  });

  GM_registerMenuCommand('Set Outlier Ignore Threshold (%)', () => {
    const input = prompt('Ignore the lowest listing if it is >= this % below the next listing:', String(getOutlierPct()));
    if (input === null) return;
    const num = parseFloat(input);
    if (!Number.isFinite(num) || num < 0 || num > 99) return alert('Enter 0–99.');
    GM_setValue(KEY_OUTLIER_PCT, num);
    alert(`Saved outlier threshold: ${num}%`);
  });

  GM_registerMenuCommand('Clear Caches (Item map + Weav3r)', () => {
    GM_deleteValue(KEY_ITEMMAP);
    GM_deleteValue(KEY_WEAV3R);
    alert('Caches cleared.');
  });

  /*********************************************************
   * INIT
   *********************************************************/
  const init = () => {
    addStyles();

    if (!getApiKey()) {
      const key = prompt('Enter your Torn API key (items access required):');
      if (key) setApiKey(key);
    }

    waitFor('.item___jLJcf', () => {
      addCheckboxes();
      new MutationObserver(addCheckboxes)
        .observe(document.body, { childList: true, subtree: true });
    });
  };

  init();

})();
