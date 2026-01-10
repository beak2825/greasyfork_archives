// ==UserScript==
// @name         Bazaar Helper GOATworkingon
// @author       srsbsns
// @version      7.9
// @description  Automatically insert $1 prices or your chosen % discount on market value!
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @namespace damorale ft srsbsns
// @downloadURL https://update.greasyfork.org/scripts/562049/Bazaar%20Helper%20GOATworkingon.user.js
// @updateURL https://update.greasyfork.org/scripts/562049/Bazaar%20Helper%20GOATworkingon.meta.js
// ==/UserScript==

(() => {
  const BASE = 'https://api.torn.com';
  const S = {
    apiKey:   'torn.apiKey',
    pct:      'torn.sellPct',
    rounding: 'torn.rounding',
    cat:      'torn.items.catalog',
    catTs:    'torn.items.catalog.ts',
    blockIds: 'torn.items.blockIds',
    marketDiscount: 'torn.marketDiscount'
  };

  let cat = null;
  let busy = false;

  const getApiKey = () => GM_getValue(S.apiKey,'');
  const setApiKey = v => GM_setValue(S.apiKey, String(v||'').trim());

  const getSellPct = () => {
    const n = Number(GM_getValue(S.pct,95));
    return (isFinite(n)&&n>0)?n:95;
  };
  const setSellPct = n => GM_setValue(S.pct, Number(n)||95);

  const getMarketDiscount = () => {
    const n = Number(GM_getValue(S.marketDiscount,1));
    return (isFinite(n)&&n>=0)?n:1;
  };
  const setMarketDiscount = n => GM_setValue(S.marketDiscount, Number(n)||1);

  const getRounding = () => {
    const v = GM_getValue(S.rounding,'nearest');
    return ['nearest','up','down'].includes(v) ? v : 'nearest';
  };
  const setRounding = v =>
    GM_setValue(S.rounding, ['nearest','up','down'].includes(v)?v:'nearest');

  function parseIdList(s){
    return new Set(
      String(s||'')
        .split(/[\s,;]+/)
        .map(x=>Number(x))
        .filter(n=>Number.isInteger(n) && n>0)
    );
  }
  function getBlockedSet(){ return parseIdList(GM_getValue(S.blockIds,'')); }

  // ---- Menu ----
  GM_registerMenuCommand('Set API key (for MV + shop sell)', () => {
    const v = prompt('Enter your Torn API key', getApiKey()||'');
    if (v!==null){ setApiKey(v); alert('Saved.'); }
  });

  GM_registerMenuCommand('Set rounding (nearest/up/down)', () => {
    const v = prompt('Choose rounding: nearest | up | down', getRounding());
    if (v!==null) setRounding(v.toLowerCase());
  });

  GM_registerMenuCommand('Set market undercut amount ($)', () => {
    const v = prompt('Enter dollar amount to undercut lowest market price (e.g., 1 for $1 below):', getMarketDiscount());
    if (v!==null){
      const num = Number(v);
      if (num >= 0) {
        setMarketDiscount(num);
        alert('Saved market undercut: $' + num);
      } else {
        alert('Please enter a positive number.');
      }
    }
  });

  GM_registerMenuCommand('Refresh MV/Shop now (force)', async () => {
    try {
      cat = await fetchCatalog(true);
      annotate(true);
      alert('MV/Shop refreshed from API.');
    } catch (e){
      alert('Refresh failed: ' + (e?.message||e));
    }
  });

  GM_registerMenuCommand('Set Do-Not-Sell item IDs (comma/space separated)', () => {
    const current = GM_getValue(S.blockIds,'');
    const v = prompt('Enter item IDs you never want to sell (comma/space/newline separated):', current);
    if (v!==null){
      GM_setValue(S.blockIds, String(v).trim());
      annotate(true);
      alert('Saved Do-Not-Sell list.');
    }
  });

  // ---- Styles ----
  GM_addStyle(`
    /* Percentage input - fixed position top right (stays when scrolling) */
    .jp-pct-box {
      position: fixed !important;
      top: 135px !important;
      right: 20px !important;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(50,50,50,0.95);
      padding: 5px 10px;
      border-radius: 4px;
      border: 1px solid #666;
      z-index: 10000;
      white-space: nowrap;
    }
    .jp-pct-box label {
      color: #ddd;
      font-size: 12px;
      font-weight: 500;
    }
    .jp-pct-box input {
      width: 50px;
      padding: 3px 6px;
      font-size: 12px;
      border: 1px solid #777;
      border-radius: 3px;
      background: #2a2a2a;
      color: #fff;
      text-align: center;
      font-weight: 500;
    }

    /* Action buttons row - fixed position */
    .jp-action-row {
      position: fixed !important;
      top: 170px !important;
      right: 20px !important;
      display: flex;
      gap: 10px;
      align-items: center;
      z-index: 10000;
    }

    /* Action buttons */
    .jp-action-btn {
      padding: 8px 16px;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .jp-action-btn:hover {
      transform: scale(1.05);
    }

    .jp-action-btn:active {
      transform: scale(0.95);
    }

    /* Apply % button - blue gradient */
    .jp-apply-pct-btn {
      background: linear-gradient(135deg, #1565c0, #1976d2);
      border: 1px solid #1e88e5;
    }

    .jp-apply-pct-btn:hover {
      background: linear-gradient(135deg, #1976d2, #1e88e5);
    }

    /* Apply $1 button - pink/rainbow gradient */
    .jp-apply-dollar-btn {
      background: linear-gradient(135deg, #c2185b, #d81b60);
      border: 1px solid #e91e63;
      animation: rainbow-glow 3s linear infinite;
    }

    .jp-apply-dollar-btn:hover {
      background: linear-gradient(135deg, #d81b60, #e91e63);
    }

    /* Apply Market button - orange/gold gradient */
    .jp-apply-market-btn {
      background: linear-gradient(135deg, #e65100, #f57c00);
      border: 1px solid #ff9800;
    }

    .jp-apply-market-btn:hover {
      background: linear-gradient(135deg, #f57c00, #fb8c00);
    }

    .jp-apply-market-btn:disabled {
      background: linear-gradient(135deg, #666, #777);
      border: 1px solid #888;
      cursor: not-allowed;
      opacity: 0.6;
    }

    @keyframes rainbow-glow {
      0% { box-shadow: 0 0 10px rgba(255,20,147,0.5); }
      50% { box-shadow: 0 0 15px rgba(138,43,226,0.7); }
      100% { box-shadow: 0 0 10px rgba(255,20,147,0.5); }
    }

    /* Update button for Manage page */
    .jp-update-btn {
      position: fixed !important;
      top: 170px !important;
      right: 20px !important;
      padding: 8px 16px;
      background: linear-gradient(135deg, #2e7d32, #388e3c);
      color: #fff;
      border: 1px solid #4caf50;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      z-index: 10000;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .jp-update-btn:hover {
      background: linear-gradient(135deg, #388e3c, #43a047);
      transform: scale(1.05);
    }
    .jp-update-btn:active {
      transform: scale(0.95);
    }

    /* Single active checkbox column */
    .jp-active-cb {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-left: 8px;
      vertical-align: middle;
    }

    .jp-active-cb input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
      vertical-align: middle;
      accent-color: #4caf50;
    }

    .jp-active-cb label {
      font-size: 11px;
      color: #aaa;
      font-weight: 500;
      cursor: pointer;
    }

    /* NPC warning */
    .jp-npc-warn {
      display: inline-block;
      margin-left: 6px;
      font-size: 11px;
      color: #e53935;
      font-weight: 500;
      vertical-align: middle;
    }

    /* Market price info */
    .jp-market-info {
      display: inline-block;
      margin-left: 6px;
      font-size: 11px;
      color: #ff9800;
      font-weight: 500;
      vertical-align: middle;
    }

    /* Do-Not-Sell */
    .jpx {
      display: inline-block;
      margin-left: 8px;
      padding: 2px 8px;
      border-radius: 10px;
      font: 12px/18px system-ui,sans-serif;
      color: #fff;
      background: #c62828;
      border: 1px solid rgba(255,255,255,.25);
      cursor: pointer;
      user-select: none;
      font-weight: 700;
    }
    .jpx:hover { filter: brightness(1.08); }
    .jp-blocked-row { box-shadow: 0 0 0 2px rgba(198,40,40,.65) inset !important; border-radius: 8px; }
  `);

  // ---- Page helpers ----
  const onBazaar = () => /\/bazaar\.php$/i.test(location.pathname);
  const onManage = () => onBazaar() && /^#\/manage\b/i.test(location.hash||'');
  const onAdd    = () => onBazaar() && /^#\/add\b/i.test(location.hash||'');

  const selPriceInputs = [
    'div.input-money-group input.input-money[type="text"]',
    'div.input-money-group input.input-money:not([type])',
    'input.input-money[type="text"]',
    'input[class*="price" i][type="text"]'
  ].join(',');

  const sanitize = s => String(s||'').replace(/\(x?\d+\)$/i,'').replace(/\s+/g,' ').trim().toLowerCase();
  const num = v => Number(String(v ?? '').replace(/[^0-9.-]/g,'')) || 0;

  function dollars(n, mode=getRounding()){
    if (!isFinite(n)) return 0;
    if (mode==='up')   return Math.ceil(n);
    if (mode==='down') return Math.floor(n);
    return Math.round(n);
  }

  // ---- JSON helpers ----
  const JGet = (k) => { try{ const v=GM_getValue(k,null); return v?JSON.parse(v):null; }catch{return null;} };
  const JSet = (k,o) => GM_setValue(k, JSON.stringify(o||null));

  // ---- API ----
  async function xfetch(url){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url,
        onload:r=>{
          try{
            if (r.status!==200) return reject(new Error('HTTP '+r.status));
            const j = JSON.parse(r.responseText);
            if (j?.error) return reject(new Error(j.error.error_desc||'API error'));
            resolve(j);
          }catch(e){reject(e);}
        },
        onerror:e=>reject(e)
      });
    });
  }

  async function fetchCatalog(force=false){
    const cached = JGet(S.cat), ts = GM_getValue(S.catTs,0);
    if (!force && cached && (Date.now()-ts) < 12*3600*1000) return cached;

    const key = getApiKey();
    if (!key) return {};

    const data = await xfetch(`${BASE}/torn/?selections=items&key=${encodeURIComponent(key)}`);
    const items = data.items || {};
    const out = { byId:{}, byName:{} };

    for (const id in items){
      const it = items[id]||{};
      const name=(it.name||'').trim();
      if (!name) continue;

      const rec = { id:Number(id), name, mv:Number(it.market_value)||0, sell:Number(it.sell_price)||0 };
      out.byId[rec.id]=rec;
      const k=sanitize(name);
      if (!out.byName[k]) out.byName[k]=rec;
    }

    JSet(S.cat,out);
    GM_setValue(S.catTs,Date.now());
    return out;
  }

  // ---- Fetch market prices for specific item ----
  async function fetchMarketPrice(itemId){
    const key = getApiKey();
    if (!key) throw new Error('API key not set');

    // Use API v2 for itemmarket (has listings array)
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

  // ---- Item resolution (FULL VERSION FROM ORIGINAL) ----
  function firstFromSrcset(val){ if(!val) return ''; return String(val).split(',')[0].trim().split(/\s+/)[0]||''; }
  function nameFromFile(url){
    try{
      const u=decodeURIComponent(url);
      const f=(u.split('/').pop()||'').split('?')[0];
      return f.replace(/\.(png|jpg|jpeg|webp)$/i,'').replace(/[_-]+/g,' ').trim();
    }catch{return '';}
  }
  function lookupByName(raw,catObj){ return catObj.byName[sanitize(raw)]||null; }

  function resolveItemForPriceInput(input, catObj){
    const row = input.closest('.bazaar-item, .item-row, .item, .info-cont, li, tr, .row, .table-row, [class*="row"], [class*="list"], [class*="entry"]') || input.parentElement;
    let id=null;

    const idHolder = row?.querySelector?.('[data-item-id],[data-itemid],[data-item],[data-id]');
    if (idHolder){
      for (const a of ['data-item-id','data-itemid','data-item','data-id']){
        const v=Number(idHolder.getAttribute(a));
        if (v>0){ id=v; break; }
      }
    }
    if (!id){
      const a = row?.querySelector?.('a[href*="itemID="],a[href*="item.php"],a[href*="items.php"]');
      if (a){
        const m=a.href.match(/[?&#]itemID=(\d+)/)||a.href.match(/[?&#]item=(\d+)/);
        if (m) id=Number(m[1]);
      }
    }
    if (!id){
      const media=[...(row?.querySelectorAll?.('img[src*="/images/"], source[srcset*="/images/"]')||[])];
      for (const el of media){
        const maybe=Number(el.dataset?.itemId||el.dataset?.id||el.getAttribute?.('data-id'));
        if (maybe>0){ id=maybe; break; }
      }
      if (!id){
        for (const el of media){
          const nmAttr=(el.getAttribute?.('alt')||el.getAttribute?.('title')||el.getAttribute?.('aria-label')||'').trim();
          if (nmAttr){ const nm=lookupByName(nmAttr,catObj); if (nm) return nm; }
        }
      }
      if (!id){
        for (const el of media){
          const u=firstFromSrcset(el.currentSrc||el.src||el.getAttribute?.('srcset')||el.getAttribute?.('src')||'');
          if (!u) continue;
          const m=u.match(/\/items\/(\d+)\//)||u.match(/\/items\/(\d+)\./)||u.match(/\/(\d+)\.(png|jpg|jpeg|webp)/i);
          if (m){ id=Number(m[1]); break; }
          const nf=nameFromFile(u); if (nf){ const nm=lookupByName(nf,catObj); if (nm) return nm; }
        }
      }
    }

    if (id && catObj.byId[id]) return catObj.byId[id];

    const label = row?.querySelector?.('.name, .item-name, .title, .name-wrap, [class*="name"], h4, h5, a, [title], [aria-label], .desc, .info, .line, .details');
    const texts=new Set();
    const push=s=>{ if(s){ const t=String(s).trim(); if(t && t.length<=64) texts.add(t); } };
    if (label){ push(label.textContent); push(label.getAttribute?.('title')); push(label.getAttribute?.('aria-label')); }
    row?.querySelectorAll?.('h4,h5,a,span,div,[title],[aria-label]')?.forEach(el=>{ push(el.textContent); push(el.getAttribute?.('title')); push(el.getAttribute?.('aria-label')); });
    for (const t of texts){ const nm=lookupByName(t,catObj); if (nm) return nm; }

    return null;
  }

  // ---- Price apply ----
  function applyPrice(input, price){
    if (!input) return;

    // Use native setter if available
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeSet) {
      nativeSet.call(input, String(price));
    } else {
      input.value = String(price);
    }

    // Dispatch events with proper configuration for React
    const inputEvent = new Event('input', {bubbles: true, cancelable: true, composed: true});
    const changeEvent = new Event('change', {bubbles: true, cancelable: true, composed: true});

    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);

    // Also update hidden price input if exists
    const hidden = input.closest('.input-money-group')?.querySelector('input[name="price"]');
    if (hidden){
      if (nativeSet) {
        nativeSet.call(hidden, String(price));
      } else {
        hidden.value = String(price);
      }
      hidden.dispatchEvent(new Event('input', {bubbles: true, cancelable: true, composed: true}));
      hidden.dispatchEvent(new Event('change', {bubbles: true, cancelable: true, composed: true}));
    }
  }

  // ---- Create % input (fixed position, no DOM manipulation) ----
  function createPctInput(){
    if (document.querySelector('.jp-pct-box')) return;
    if (!onBazaar()) return;
    // Only show on Add or Manage pages
    if (!onAdd() && !onManage()) return;

    const box = document.createElement('div');
    box.className = 'jp-pct-box';

    const label = document.createElement('label');
    label.textContent = '%';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '150';
    input.value = getSellPct();

    input.addEventListener('change', () => {
      const val = Number(input.value);
      if (val > 0 && val <= 200) {
        setSellPct(val);
      }
    });

    box.appendChild(label);
    box.appendChild(input);
    document.body.appendChild(box);
  }

  // ---- Create action buttons row - ADD PAGE ONLY ----
  function createActionRow(){
    if (document.querySelector('.jp-action-row')) return;
    if (!onAdd()) return; // Only show on add page
    if (onManage()) return; // Never show on manage page

    const row = document.createElement('div');
    row.className = 'jp-action-row';

    // Apply % button
    const btnPct = document.createElement('button');
    btnPct.className = 'jp-action-btn jp-apply-pct-btn';
    btnPct.textContent = 'Apply % to Active';
    btnPct.title = 'Apply current % discount to all active items';

    btnPct.addEventListener('click', async () => {
      try {
        if (!cat) cat = await fetchCatalog(false);

        const activeCheckboxes = document.querySelectorAll('.jp-active-cb input:checked');
        let applied = 0;

        for (const cb of activeCheckboxes) {
          const row = cb.closest('li, [class*="item"]');
          const priceInput = row?.querySelector(selPriceInputs);

          if (priceInput && cat) {
            const item = resolveItemForPriceInput(priceInput, cat);
            if (item && item.mv) {
              const price = dollars(item.mv * (getSellPct() / 100));
              applyPrice(priceInput, price);
              updateNpcWarning(priceInput, item);
              applied++;
            }
          }
        }

        if (applied > 0) {
          btnPct.textContent = `Applied to ${applied}!`;
          setTimeout(() => {
            btnPct.textContent = 'Apply % to Active';
          }, 2000);
        } else {
          btnPct.textContent = 'No active items';
          setTimeout(() => {
            btnPct.textContent = 'Apply % to Active';
          }, 2000);
        }
      } catch (e) {
        console.error('Apply % error:', e);
        btnPct.textContent = 'Error!';
        setTimeout(() => {
          btnPct.textContent = 'Apply % to Active';
        }, 2000);
      }
    });

    // Apply $1 button
    const btnDollar = document.createElement('button');
    btnDollar.className = 'jp-action-btn jp-apply-dollar-btn';
    btnDollar.textContent = 'Apply $1 to Active';
    btnDollar.title = 'Apply $1 price to all active items';

    btnDollar.addEventListener('click', () => {
      const activeCheckboxes = document.querySelectorAll('.jp-active-cb input:checked');
      let applied = 0;

      for (const cb of activeCheckboxes) {
        const row = cb.closest('li, [class*="item"]');
        const priceInput = row?.querySelector(selPriceInputs);

        if (priceInput) {
          applyPrice(priceInput, 1);

          // Update NPC warning
          if (cat) {
            const item = resolveItemForPriceInput(priceInput, cat);
            if (item) updateNpcWarning(priceInput, item);
          }
          applied++;
        }
      }

      if (applied > 0) {
        btnDollar.textContent = `Applied to ${applied}!`;
        setTimeout(() => {
          btnDollar.textContent = 'Apply $1 to Active';
        }, 2000);
      } else {
        btnDollar.textContent = 'No active items';
        setTimeout(() => {
          btnDollar.textContent = 'Apply $1 to Active';
        }, 2000);
      }
    });

    // Apply Market Price button
    const btnMarket = document.createElement('button');
    btnMarket.className = 'jp-action-btn jp-apply-market-btn';
    btnMarket.textContent = 'Beat Market';
    btnMarket.title = 'Set price below lowest market listing (configure undercut in menu)';

    btnMarket.addEventListener('click', async () => {
      try {
        btnMarket.disabled = true;
        btnMarket.textContent = 'Checking...';

        if (!cat) cat = await fetchCatalog(false);

        const activeCheckboxes = document.querySelectorAll('.jp-active-cb input:checked');
        let applied = 0;
        let errors = 0;

        for (const cb of activeCheckboxes) {
          const row = cb.closest('li, [class*="item"]');
          const priceInput = row?.querySelector(selPriceInputs);

          if (priceInput && cat) {
            const item = resolveItemForPriceInput(priceInput, cat);
            if (item && item.id) {
              try {
                const lowestPrice = await fetchMarketPrice(item.id);

                if (lowestPrice !== null) {
                  const undercut = getMarketDiscount();
                  const newPrice = Math.max(1, lowestPrice - undercut);

                  // Use requestAnimationFrame to let React update properly
                  await new Promise(resolve => {
                    requestAnimationFrame(() => {
                      applyPrice(priceInput, newPrice);
                      updateNpcWarning(priceInput, item);
                      resolve();
                    });
                  });

                  applied++;

                  // Longer delay between items to avoid overwhelming React and rate limiting
                  await new Promise(resolve => setTimeout(resolve, 250));
                } else {
                  console.log(`No market listings found for ${item.name}`);
                }
              } catch (e) {
                console.error(`Error fetching market price for ${item.name}:`, e);
                errors++;
              }
            }
          }
        }

        btnMarket.disabled = false;
        if (applied > 0) {
          btnMarket.textContent = `Updated ${applied}!`;
          setTimeout(() => {
            btnMarket.textContent = 'Beat Market';
          }, 2000);
        } else if (errors > 0) {
          btnMarket.textContent = `Errors: ${errors}`;
          setTimeout(() => {
            btnMarket.textContent = 'Beat Market';
          }, 2000);
        } else {
          btnMarket.textContent = 'None found';
          setTimeout(() => {
            btnMarket.textContent = 'Beat Market';
          }, 2000);
        }
      } catch (e) {
        console.error('Beat market error:', e);
        btnMarket.disabled = false;
        btnMarket.textContent = 'Error!';
        setTimeout(() => {
          btnMarket.textContent = 'Beat Market';
        }, 2000);
      }
    });

    row.appendChild(btnPct);
    row.appendChild(btnDollar);
    row.appendChild(btnMarket);
    document.body.appendChild(row);
  }

  // ---- Create Update button for Manage page ONLY ----
  function createUpdateButton(){
    if (document.querySelector('.jp-update-btn')) return;
    if (onAdd()) return; // Never show on add page
    if (!onManage()) return; // Only show on manage page

    const btn = document.createElement('button');
    btn.className = 'jp-update-btn';
    btn.textContent = 'Update Prices';
    btn.title = 'Update all prices above $1 to current market value %';

    btn.addEventListener('click', async () => {
      try {
        if (!cat) cat = await fetchCatalog(false);

        const inputs = document.querySelectorAll(selPriceInputs);
        let updated = 0;

        for (const input of inputs) {
          try {
            if (!input.offsetParent) continue;

            const currentPrice = num(input.value);
            // Skip $1 items (intentional hot sales)
            if (currentPrice <= 1) continue;

            const item = resolveItemForPriceInput(input, cat);
            if (!item || !item.mv) continue;

            const newPrice = dollars(item.mv * (getSellPct() / 100));
            if (newPrice > 1) {
              applyPrice(input, newPrice);
              updated++;
            }
          } catch (e) {
            console.error('Error updating item:', e);
          }
        }

        if (updated > 0) {
          btn.textContent = `Updated ${updated}!`;
          setTimeout(() => {
            btn.textContent = 'Update Prices';
          }, 2000);
        } else {
          btn.textContent = 'No updates';
          setTimeout(() => {
            btn.textContent = 'Update Prices';
          }, 2000);
        }
      } catch (e) {
        console.error('Update prices error:', e);
        btn.textContent = 'Error!';
        setTimeout(() => {
          btn.textContent = 'Update Prices';
        }, 2000);
      }
    });

    document.body.appendChild(btn);
  }

  // ---- Single active checkbox ----
  function attachActiveCheckbox(priceInput, item){
    if (!onAdd() || !item) return;
    if (priceInput.dataset.jpActiveCb === '1') return;

    const container = document.createElement('span');
    container.className = 'jp-active-cb';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `jp-active-${item.id}`;

    const label = document.createElement('label');
    label.htmlFor = `jp-active-${item.id}`;
    label.textContent = 'Active';

    container.appendChild(input);
    container.appendChild(label);

    priceInput.insertAdjacentElement('afterend', container);
    priceInput.dataset.jpActiveCb = '1';
  }

  // ---- NPC warning ----
  function updateNpcWarning(priceInput, item){
    if (!item) return;

    const existing = priceInput.parentElement?.querySelector('.jp-npc-warn');
    if (existing) existing.remove();

    const price = num(priceInput.value);

    // Don't show warning if price is $1 (intentional hot sale)
    if (price === 1) return;

    if (price > 0 && price < item.sell) {
      const warn = document.createElement('span');
      warn.className = 'jp-npc-warn';
      warn.textContent = `NPC: $${item.sell.toLocaleString()}`;

      const cbContainer = priceInput.parentElement?.querySelector('.jp-active-cb');
      if (cbContainer) cbContainer.insertAdjacentElement('afterend', warn);
      else priceInput.insertAdjacentElement('afterend', warn);
    }
  }

  // ---- Do-Not-Sell ----
  function attachBlockChip(priceInput, item){
    if (!onAdd() || !item) return;
    if (priceInput.dataset.jpx === '1') return;

    const blocked = getBlockedSet();
    if (!blocked.has(item.id)) return;

    const chip = document.createElement('span');
    chip.className = 'jpx';
    chip.textContent = '✖';
    chip.title = `Do-Not-Sell: ${item.name}`;

    chip.addEventListener('click', () => {
      alert(`This item is marked Do-Not-Sell: ${item.name}`);
    });

    priceInput.insertAdjacentElement('afterend', chip);

    const row = priceInput.closest('li, [class*="item"]');
    row?.classList?.add('jp-blocked-row');

    priceInput.dataset.jpx = '1';
  }

  // ---- Annotate ----
  async function annotate(force=false){
    if (!onBazaar()) return;
    if (busy && !force) return;
    busy=true;

    try{
      if (!cat) cat = await fetchCatalog(false);

      createPctInput();

      // Add page only
      if (onAdd()) {
        createActionRow();

        const inputs = document.querySelectorAll(selPriceInputs);
        const blocked = getBlockedSet();

        inputs.forEach(input => {
          try {
            if (!input.offsetParent) return;
            const item = resolveItemForPriceInput(input, cat);
            if (!item) return;

            attachActiveCheckbox(input, item);
            updateNpcWarning(input, item);
            if (blocked.has(item.id)) attachBlockChip(input, item);
          } catch (e) {
            console.error('Error processing input:', e);
          }
        });
      }

      // Manage page only
      if (onManage()) {
        createUpdateButton();
      }

    } catch (e) {
      console.error('Annotate error:', e);
    } finally {
      busy = false;
    }
  }

  // ---- Live updates ----
  document.addEventListener('input', async (e) => {
    const el = e.target;
    if (!el || el.tagName !== 'INPUT' || !el.classList.contains('input-money')) return;
    if (!onBazaar()) return;

    if (!cat) cat = await fetchCatalog(false);
    const item = resolveItemForPriceInput(el, cat);
    if (item) updateNpcWarning(el, item);
  }, true);

  // ---- Observer ----
  let timeout = null;
  const mo = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => annotate(), 200);
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener('hashchange', () => {
    // Clean up elements when on wrong pages
    if (!onAdd() && !onManage()) {
      // On main bazaar or other player's bazaar - remove all elements
      document.querySelector('.jp-pct-box')?.remove();
      document.querySelector('.jp-action-row')?.remove();
      document.querySelector('.jp-update-btn')?.remove();
    } else if (onAdd()) {
      // On add page - remove manage elements
      document.querySelector('.jp-update-btn')?.remove();
    } else if (onManage()) {
      // On manage page - remove add elements
      document.querySelector('.jp-action-row')?.remove();
    }
    setTimeout(() => annotate(true), 300);
  });

  setTimeout(() => annotate(), 800);
})();