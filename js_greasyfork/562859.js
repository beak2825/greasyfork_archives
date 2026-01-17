// ==UserScript==
// @name         Bazaar Helper GOAT - Bulk Edition
// @author       srsbsns
// @version      9.3
// @description  Fixed "Manage" page price fetching for % MV and Beat buttons
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @namespace https://greasyfork.org/users/1553986
// @downloadURL https://update.greasyfork.org/scripts/562859/Bazaar%20Helper%20GOAT%20-%20Bulk%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/562859/Bazaar%20Helper%20GOAT%20-%20Bulk%20Edition.meta.js
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
  let lastFocusedInput = null;

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
    const v = prompt('Enter dollar amount to undercut lowest market price:', getMarketDiscount());
    if (v!==null){
      const num = Number(v);
      if (num >= 0) {
        setMarketDiscount(num);
        alert('Saved market undercut: $' + num);
      }
    }
  });

  // ---- Styles ----
  GM_addStyle(`
    .jp-pct-box {
      position: fixed !important;
      top: 135px !important;
      right: 80px !important;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(50,50,50,0.95);
      padding: 5px 10px;
      border-radius: 4px;
      border: 1px solid #666;
      z-index: 10000;
    }
    .jp-pct-box label { color: #ddd; font-size: 12px; }
    .jp-pct-box input { width: 50px; background: #2a2a2a; color: #fff; border: 1px solid #777; text-align: center; }

    .jp-action-row {
      position: fixed !important;
      top: 170px !important;
      right: 5px !important;
      display: flex;
      gap: 4px;
      align-items: center;
      background: rgba(40,40,40,0.95);
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #666;
      z-index: 10000;
    }

    .jp-action-btn {
      padding: 8px 12px;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }

    .jp-apply-pct-btn { background: linear-gradient(135deg, #1565c0, #1976d2); }
    .jp-apply-dollar-btn { background: linear-gradient(135deg, #c2185b, #d81b60); }
    .jp-apply-market-btn { background: linear-gradient(135deg, #e65100, #f57c00); }

    .jp-checkbox-wrap {
  display: inline-flex;
  align-items: center;
  margin-left: 0px;
  margin-right: 5px;
  vertical-align: middle;
  position: relative;
  z-index: 10;
}
    .jp-item-checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .jp-select-all-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 5px;
      border-right: 1px solid #555;
      padding-right: 8px;
    }
    .jp-select-all-wrap label { font-size: 9px; color: #aaa; font-weight: bold; }

    .bazaar-item, li[class*="item"], div[class*="row_"] {
       min-height: auto !important;
    }

    .jpx { margin-left: 8px; color: #fff; background: #c62828; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 700; }
    .jp-blocked-row { box-shadow: inset 0 0 5px rgba(198,40,40,0.4); }
  `);

  const onBazaar = () => /\/bazaar\.php$/i.test(location.pathname);
  const onManage = () => onBazaar() && /^#\/manage\b/i.test(location.hash||'');
  const onAdd    = () => onBazaar() && /^#\/add\b/i.test(location.hash||'');
  const selPriceInputs = 'input.input-money, input[class*="price" i]';

  const sanitize = s => String(s||'').replace(/\(x?\d+\)$/i,'').replace(/\s+/g,' ').trim().toLowerCase();
  const num = v => Number(String(v ?? '').replace(/[^0-9.-]/g,'')) || 0;

  function dollars(n, mode=getRounding()){
    if (!isFinite(n)) return 0;
    if (mode==='up')   return Math.ceil(n);
    if (mode==='down') return Math.floor(n);
    return Math.round(n);
  }

  const JGet = (k) => { try{ const v=GM_getValue(k,null); return v?JSON.parse(v):null; }catch{return null;} };
  const JSet = (k,o) => GM_setValue(k, JSON.stringify(o||null));

  async function xfetch(url){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:'GET', url,
        onload:r=>{
          try{
            const j = JSON.parse(r.responseText);
            if (j?.error) return reject(new Error(j.error.error_desc));
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
    if (!key) return {byId:{}, byName:{}};
    const data = await xfetch(`${BASE}/torn/?selections=items&key=${encodeURIComponent(key)}`);
    const items = data.items || {};
    const out = { byId:{}, byName:{} };
    for (const id in items){
      const it = items[id];
      const rec = { id:Number(id), name:it.name, mv:Number(it.market_value)||0, sell:Number(it.sell_price)||0 };
      out.byId[rec.id]=rec;
      out.byName[sanitize(it.name)]=rec;
    }
    JSet(S.cat,out);
    GM_setValue(S.catTs,Date.now());
    return out;
  }

  async function fetchMarketPrice(itemId){
    const key = getApiKey();
    if (!key) return null;
    const data = await xfetch(`${BASE}/v2/market/${itemId}?selections=itemmarket&key=${encodeURIComponent(key)}`);
    const listings = data.itemmarket?.listings || data.itemmarket || [];
    if (Array.isArray(listings) && listings.length > 0) return Number(listings[0].price || listings[0].cost);
    return null;
  }

  function resolveItemForPriceInput(input, catObj){
    const row = input.closest('li, [class*="row"], .bazaar-item, .item-li');
    if (!row) return null;

    // 1. Try to find ID in data attributes
    const idHolder = row.querySelector('[data-item-id],[data-itemid],[data-item],[data-id]');
    if (idHolder) {
        let id = idHolder.getAttribute('data-item-id') || idHolder.getAttribute('data-id') || idHolder.getAttribute('data-item');
        if (id && catObj.byId[id]) return catObj.byId[id];
    }

    // 2. Try to find ID in image URLs (very reliable on Manage page)
    const img = row.querySelector('img[src*="items/"]');
    if (img) {
        const match = img.src.match(/items\/(\d+)/);
        if (match && catObj.byId[match[1]]) return catObj.byId[match[1]];
    }

    // 3. Try to find by Name (looking for bold tags or specific class names)
    const nameEl = row.querySelector('.name, .item-name, .title, b, [class*="name"]');
    if (nameEl) {
        const cleaned = sanitize(nameEl.textContent);
        if (catObj.byName[cleaned]) return catObj.byName[cleaned];
    }

    return null;
  }

  function applyPrice(input, price){
    if (!input) return;
    const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeSet ? nativeSet.call(input, String(price)) : (input.value = String(price));
    input.dispatchEvent(new Event('input', {bubbles: true}));
    input.dispatchEvent(new Event('change', {bubbles: true}));
  }

  function updateNpcWarning(priceInput, item){
    if (!item || !priceInput) return;
    const price = num(priceInput.value);
    if (price > 0 && price < item.sell && price !== 1) {
      priceInput.style.color = '#ff4444';
      priceInput.style.fontWeight = '700';
    } else {
      priceInput.style.color = '';
      priceInput.style.fontWeight = '';
    }
  }

  function getTargetInputs() {
    const checked = document.querySelectorAll('.jp-item-checkbox:checked');
    if (checked.length > 0) {
        return Array.from(checked).map(cb => cb.closest('li, [class*="row"], .bazaar-item, .item-li').querySelector(selPriceInputs)).filter(i => i);
    }
    return lastFocusedInput ? [lastFocusedInput] : [];
  }

  function createActionRow(){
    if (document.querySelector('.jp-action-row')) return;
    if (!onAdd() && !onManage()) return;

    const row = document.createElement('div');
    row.className = 'jp-action-row';

    const selectAllWrap = document.createElement('div');
    selectAllWrap.className = 'jp-select-all-wrap';
    const saCb = document.createElement('input');
    saCb.type = 'checkbox';
    saCb.id = 'jp-master-toggle';
    saCb.addEventListener('change', (e) => {
        document.querySelectorAll('.jp-item-checkbox').forEach(cb => cb.checked = e.target.checked);
    });
    const saLb = document.createElement('label');
    saLb.textContent = 'ALL';
    selectAllWrap.append(saCb, saLb);
    row.appendChild(selectAllWrap);

    const btnPct = document.createElement('button');
    btnPct.className = 'jp-action-btn jp-apply-pct-btn';
    btnPct.textContent = '% MV';
    btnPct.onclick = async () => {
        const targets = getTargetInputs();
        if (!targets.length) return;
        if (!cat) cat = await fetchCatalog();
        targets.forEach(input => {
            const item = resolveItemForPriceInput(input, cat);
            if (item?.mv) {
              applyPrice(input, dollars(item.mv * (getSellPct()/100)));
              updateNpcWarning(input, item);
            }
        });
    };

    const btnDollar = document.createElement('button');
btnDollar.className = 'jp-action-btn jp-apply-dollar-btn';
btnDollar.textContent = '$1';
btnDollar.onclick = () => {
    getTargetInputs().forEach(input => {
        applyPrice(input, 1);
        if (cat) updateNpcWarning(input, resolveItemForPriceInput(input, cat));

        // Only on Add page: set quantity to 1
        if (onAdd()) {
            const row = input.closest('li, [class*="row"], .bazaar-item, .item-li');
            if (row) {
                const qtyInput = row.querySelector('input[name="amount"], input[placeholder*="Qty" i]');
                if (qtyInput) {
                    applyPrice(qtyInput, 1);
                }
            }
        }
    });
};

    const btnMarket = document.createElement('button');
    btnMarket.className = 'jp-action-btn jp-apply-market-btn';
    btnMarket.textContent = 'Beat';
    btnMarket.onclick = async () => {
        const targets = getTargetInputs();
        if (!targets.length) return;
        btnMarket.disabled = true;
        btnMarket.textContent = '...';
        if (!cat) cat = await fetchCatalog();
        for (const input of targets) {
            const item = resolveItemForPriceInput(input, cat);
            if (item?.id) {
                const low = await fetchMarketPrice(item.id);
                if (low) {
                    applyPrice(input, Math.max(1, low - getMarketDiscount()));
                    updateNpcWarning(input, item);
                }
            }
        }
        btnMarket.disabled = false;
        btnMarket.textContent = 'Beat';
    };

    row.append(btnPct, btnDollar, btnMarket);
    document.body.appendChild(row);
  }

  function createPctInput(){
    if (document.querySelector('.jp-pct-box') || (!onAdd() && !onManage())) return;
    const box = document.createElement('div');
    box.className = 'jp-pct-box';
    box.innerHTML = `<label>%</label><input type="number" value="${getSellPct()}">`;
    box.querySelector('input').onchange = (e) => setSellPct(e.target.value);
    document.body.appendChild(box);
  }

  function ensureCheckboxes() {
    const inputs = document.querySelectorAll(selPriceInputs);
    inputs.forEach(input => {
        const row = input.closest('li, [class*="row"], .bazaar-item, .item-li');
        if (row && !row.querySelector('.jp-checkbox-wrap')) {
            const wrap = document.createElement('div');
            wrap.className = 'jp-checkbox-wrap';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'jp-item-checkbox';
            wrap.appendChild(cb);
            input.parentElement.insertBefore(wrap, input);
        }
    });
  }

  async function annotate(){
    if (!onBazaar() || busy) return;
    busy = true;
    try {
        if (!cat) cat = await fetchCatalog();
        createPctInput();
        createActionRow();
        ensureCheckboxes();

        const blocked = getBlockedSet();
        document.querySelectorAll(selPriceInputs).forEach(input => {
            const item = resolveItemForPriceInput(input, cat);
            if (item) {
                updateNpcWarning(input, item);
                if (blocked.has(item.id) && !input.parentElement.querySelector('.jpx')) {
                    const span = document.createElement('span');
                    span.className = 'jpx'; span.textContent = '✖';
                    input.after(span);
                    input.closest('li, [class*="row"]')?.classList.add('jp-blocked-row');
                }
            }
        });
    } finally { busy = false; }
  }

  document.addEventListener('focus', (e) => {
    if (e.target.classList?.contains('input-money')) lastFocusedInput = e.target;
  }, true);

  const mo = new MutationObserver(() => annotate());
  mo.observe(document.documentElement, {childList:true, subtree:true});

  window.addEventListener('hashchange', () => {
      document.querySelector('.jp-action-row')?.remove();
      document.querySelector('.jp-pct-box')?.remove();
      annotate();
  });

  setTimeout(() => annotate(), 800);
})();