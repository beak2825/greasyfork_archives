// ==UserScript==
// @name         Torn Trade Helper (Tracker Import)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scrape Torn trade page, aggregate added items, show panel and POST to Tracker backend to import trades
// @author       ---
// @match        https://www.torn.com/trade.php*
// @grant        GM_xmlhttpRequest
// @connect      my-sheet.onrender.com
// @downloadURL https://update.greasyfork.org/scripts/560699/Torn%20Trade%20Helper%20%28Tracker%20Import%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560699/Torn%20Trade%20Helper%20%28Tracker%20Import%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration - prompt for backend base URL once and persist in localStorage
    function getBackendBase() {
        try {
            const stored = localStorage.getItem('tth_backend_base');
            if (stored) return stored.replace(/\/$/, '');
            const input = prompt('Enter your Tracker backend base URL (e.g. https://my-sheet.onrender.com):', 'https://');
            if (input) {
                localStorage.setItem('tth_backend_base', input.replace(/\/$/, ''));
                return input.replace(/\/$/, '');
            }
        } catch (e) {
            console.warn('tth: failed to access localStorage', e);
        }
        return null;
    }

    const BACKEND_BASE = getBackendBase();
    const BACKEND_PENDING_URL = BACKEND_BASE ? BACKEND_BASE + '/api/pending-imports' : null;

    // Helpers
    function escapeHtml(s){ return s ? s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]) : s; }

    function parseAddedItemsFromText(text){
        const items = [];
        if (!text || typeof text !== 'string') return items;
        // Normalize separators and remove the leading "added by <user>" if present
        // Allow patterns like "72x Item, 10x Other and 5x Foo to the trade."
        const cleaned = text.replace(/\u00A0/g,' ').replace(/\band\b/gi, ',').replace(/to the trade\.?/i,'');
        // matches "1x Can of Crocozade" and variations, non-greedy name capture
        const re = /(\d+)\s*x\s*([^,]+?)(?:,|$)/gi;
        let m;
        while ((m = re.exec(cleaned)) !== null){
            const qty = parseInt(m[1].replace(/[^0-9]/g,''),10) || 0;
            const name = (m[2] || '').trim().replace(/[.,]$/,'');
            if (qty > 0 && name) items.push({ qty, name });
        }
        return items;
    }

    // Stable signature for matching pending imports -> finalization
    function makeSignature(payload) {
        // payload: { traderName, timestamp, items }
        const items = (payload.items || []).slice().map(i=>({ name: (i.name||'').toLowerCase().trim(), qty: Number(i.qty||i.quantity||0) }));
        items.sort((a,b)=> a.name.localeCompare(b.name));
        const itemsStr = items.map(i=>`${i.name}:${i.qty}`).join('|');
        const base = `${(payload.traderName||'').toLowerCase().trim()}|${payload.timestamp||''}|${itemsStr}`;
        // simple hash
        let h = 2166136261 >>> 0;
        for (let i=0;i<base.length;i++){ h = Math.imul(h ^ base.charCodeAt(i), 16777619) >>> 0; }
        return h.toString(16);
    }

    function findSellerName(){
        const el = document.querySelector('.desc.t-break-word .msg a') || document.querySelector('.log .msg a');
        return el ? el.textContent.trim() : null;
    }

    function findLogContainers(){
        // Prefer explicit log lists, but fall back to any container with .msg children
        const lists = Array.from(document.querySelectorAll('ul.log'));
        if (lists.length) return lists;
        const containers = new Set();
        document.querySelectorAll('.msg').forEach(m => {
            let p = m.parentElement;
            while(p && p !== document.body){
                if (p.matches && p.matches('ul, ol, div')) { containers.add(p); break; }
                p = p.parentElement;
            }
        });
        return Array.from(containers.length ? containers : [document.body]);
    }

    // UI panel
    const panel = document.createElement('div');
    panel.id = 'torn-trade-helper-panel';
    panel.style.cssText = 'position:fixed;right:12px;top:80px;z-index:2147483647;background:rgba(18,18,20,0.95);color:#fff;padding:10px;border-radius:8px;font-family:Arial, sans-serif;min-width:260px;max-width:360px;box-shadow:0 8px 30px rgba(0,0,0,0.6);';
    panel.innerHTML = `
        <div style="position:relative;display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="font-size:14px;">Trade Helper</strong>
            <div style="display:flex;gap:6px;align-items:center">
                <!-- header-embedded toggle moved out of panel; see insertHeaderToggle() -->
                <button id="tth-settings-btn" style="background:#333;border:1px solid #444;color:#fff;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;">Settings</button>
                <button id="tth-collapse-btn" style="background:#222;border:1px solid #444;color:#fff;padding:4px 8px;border-radius:4px;cursor:pointer;">Close</button>
            </div>
        </div>
        <div id="tth-body" style="font-size:13px;line-height:1.2;color:#ddd;max-height:320px;overflow:auto;padding-bottom:6px;">Waiting for trade items...</div>
        <div style="display:flex;gap:8px;margin-top:8px;">
            <button id="tth-copy" style="flex:1;padding:8px;background:#28a745;border:none;border-radius:6px;color:#fff;cursor:pointer;">Copy Receipt</button>
            <button id="tth-clear" style="padding:8px;background:#6c757d;border:none;border-radius:6px;color:#fff;cursor:pointer;">Clear</button>
        </div>
    `;
    document.body.appendChild(panel);

    const bodyEl = panel.querySelector('#tth-body');
    const importBtn = panel.querySelector('#tth-copy');
    const clearBtn = panel.querySelector('#tth-clear');
    const collapseBtn = panel.querySelector('#tth-collapse-btn');

    // Observer management so we can pause work when user collapses/hides
    let observers = [];
    let bodyMo = null;
    let observersActive = false;

    function setupObservers(){
        if (observersActive) return;
        const logs = findLogContainers();
        logs.forEach(l=>{
            const mo = new MutationObserver(handleMutations);
            mo.observe(l, { childList:true, subtree:true });
            observers.push(mo);
        });
        bodyMo = new MutationObserver(handleMutations);
        bodyMo.observe(document.body, { childList:true, subtree:true });
        observersActive = true;
    }

    function disconnectObservers(){
        try{
            observers.forEach(o=>{ try{ o.disconnect(); }catch(e){} });
            observers = [];
            if (bodyMo){ try{ bodyMo.disconnect(); }catch(e){} bodyMo = null; }
        }finally{ observersActive = false; }
    }

    // Close button: fully hide panel, pause observers, and show '+' on header toggle
    collapseBtn.addEventListener('click', ()=>{
        try{
            disconnectObservers();
            panel.style.display = 'none';
            if (headerToggleEl) headerToggleEl.textContent = '+';
            collapsed = true;
        }catch(e){ console.warn('tth close failed', e); }
    });
    const settingsBtn = panel.querySelector('#tth-settings-btn');
    settingsBtn.addEventListener('click', ()=>{
        try{
            const newBase = prompt('Tracker backend base URL:', localStorage.getItem('tth_backend_base')||BACKEND_BASE||'https://');
            if (newBase) { localStorage.setItem('tth_backend_base', newBase.replace(/\/$/,'')); alert('Saved backend URL. You may need to refresh the page.'); }
            const creds = localStorage.getItem('tth_creds');
            const want = confirm('Would you like to (OK) set credentials or (Cancel) clear stored credentials?');
            if (want){
                const user = prompt('Admin username:', creds? (JSON.parse(creds).u||'') : '');
                const pass = prompt('Admin password (will be stored in localStorage):', '');
                if (user && pass) localStorage.setItem('tth_creds', JSON.stringify({ u: user, p: pass }));
                alert('Credentials saved to localStorage.');
            } else {
                localStorage.removeItem('tth_creds');
                alert('Credentials cleared');
            }
        }catch(e){ alert('Settings failed: '+e.message); }
    });

    let aggregated = { seller: null, items: [], timestamp: null };

    function aggregateItems(newItems){
        newItems.forEach(it => {
            const found = aggregated.items.find(x => x.name.toLowerCase() === it.name.toLowerCase());
            if (found) found.qty += it.qty; else aggregated.items.push({ name: it.name, qty: it.qty });
        });
    }

    function updatePanel(){
        if (!aggregated.items.length){ bodyEl.innerHTML = '<em style="color:#999;">Waiting for added items...</em>'; return; }
        const rows = aggregated.items.map(i=>`<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px dashed rgba(255,255,255,0.04);"><div>${escapeHtml(i.qty+'x '+i.name)}</div><div style="color:#9ae;font-weight:600;">-</div></div>`);
        const header = `<div style="margin-bottom:6px;color:#9bf;font-size:12px;">Seller: <strong>${escapeHtml(aggregated.seller || 'Unknown')}</strong>${aggregated.timestamp? ' • '+escapeHtml(aggregated.timestamp):''}</div>`;
        bodyEl.innerHTML = header + rows.join('');
    }

    // Observe new entries in log lists
    // NOTE: setupObservers is now defined above where it's used so skip the old local definition

    function handleMutations(mutations){
        mutations.forEach(m=>{
            m.addedNodes.forEach(node=>{
                try{
                    // If node itself is a .msg or contains .msg children, process them
                    const msgEls = [];
                    if (node.nodeType === 1){
                        if (node.matches && node.matches('.msg')) msgEls.push(node);
                        msgEls.push(...Array.from(node.querySelectorAll && node.querySelectorAll('.msg') || []));
                    }
                    msgEls.forEach(msgEl => {
                        try {
                            // Skip if we've already processed this message node
                            if (msgEl.dataset && msgEl.dataset.tthParsed) return;
                            const text = (msgEl.textContent || '').trim();
                            if (!text) return;
                            if (/\badded\b/i.test(text)){
                                const parsed = parseAddedItemsFromText(text);
                                if (parsed.length){
                                    aggregated.seller = aggregated.seller || findSellerName();
                                    // try to find sibling date element
                                    const dateEl = msgEl.closest && msgEl.closest('li') ? msgEl.closest('li').querySelector('.date') : null;
                                    aggregated.timestamp = aggregated.timestamp || (dateEl ? dateEl.textContent.trim() : (new Date()).toLocaleString());
                                    aggregateItems(parsed);
                                    refreshPanelWithPrices();
                                    // mark as processed to avoid double-counting
                                    try { msgEl.dataset.tthParsed = '1'; } catch(e) { /* ignore */ }
                                }
                            }
                        } catch(e) { console.warn('tth inner parse err', e); }
                    });
                }catch(e){ console.warn('tth parse err', e); }
            });
        });
    }

    // Initial scan (in case items already present)
    function initialScan(){
        // Scan all existing .msg elements across the page for "added" entries
        document.querySelectorAll('.msg').forEach(msgEl => {
            try{
                // Skip if already processed
                if (msgEl.dataset && msgEl.dataset.tthParsed) return;
                const text = (msgEl.textContent || '').trim();
                if (!text) return;
                if (/\badded\b/i.test(text)){
                    const parsed = parseAddedItemsFromText(text);
                    if (parsed.length){
                        aggregated.seller = aggregated.seller || findSellerName();
                        const dateEl = msgEl.closest && msgEl.closest('li') ? msgEl.closest('li').querySelector('.date') : null;
                        aggregated.timestamp = aggregated.timestamp || (dateEl ? dateEl.textContent.trim() : null);
                        aggregateItems(parsed);
                        try { msgEl.dataset.tthParsed = '1'; } catch(e) { /* ignore */ }
                    }
                }
            }catch(e){/* ignore */}
        });
        refreshPanelWithPrices();
    }

    clearBtn.addEventListener('click', ()=>{ aggregated = { seller:null, items:[], timestamp:null }; refreshPanelWithPrices(); });

    // Header-embedded toggle: create button in Torn header/news-ticker area and wire it
    let collapsed = false;
    let headerToggleEl = null;

    function togglePanel(){
        // If panel is hidden entirely (Close was used), treat as collapsed
        const isHidden = panel.style.display === 'none';
        if (!collapsed && !isHidden){
            // collapse: hide body, shrink panel and pause observers
            disconnectObservers();
            bodyEl.style.display = 'none';
            panel.style.height = '40px';
            panel.style.overflow = 'hidden';
            if (headerToggleEl) headerToggleEl.textContent = '+';
            collapsed = true;
        } else {
            // expand or unhide: restore panel and resume observers
            panel.style.display = '';
            bodyEl.style.display = '';
            panel.style.height = '';
            panel.style.overflow = '';
            if (headerToggleEl) headerToggleEl.textContent = '≡';
            collapsed = false;
            // perform a fresh scan in case we missed items while collapsed
            initialScan();
            setupObservers();
        }
    }

    function insertHeaderToggle(){
        try{
            // anchor to header-wrapper-bottom when possible, but use fixed positioning
            const headerWrap = document.querySelector('.header-wrapper-bottom') || document.querySelector('.header-wrapper-top') || document.querySelector('.header-wrapper');
            if (!headerWrap) return;
            if (document.getElementById('tth-header-toggle-btn')) { headerToggleEl = document.getElementById('tth-header-toggle-btn'); return; }
            headerToggleEl = document.createElement('button');
            headerToggleEl.id = 'tth-header-toggle-btn';
            headerToggleEl.setAttribute('type','button');
            headerToggleEl.title = 'Toggle Trade Helper';
            headerToggleEl.textContent = '— — —';
            // fixed positioning so it doesn't affect page layout
            headerToggleEl.style.position = 'fixed';
            headerToggleEl.style.zIndex = '2147483647';
            headerToggleEl.style.background = '#222';
            headerToggleEl.style.border = '1px solid #444';
            headerToggleEl.style.color = '#fff';
            headerToggleEl.style.padding = '6px 8px';
            headerToggleEl.style.borderRadius = '6px';
            headerToggleEl.style.cursor = 'pointer';
            headerToggleEl.style.fontSize = '13px';
            headerToggleEl.style.lineHeight = '1';
            document.body.appendChild(headerToggleEl);

            function updatePos(){
                try{
                    const rect = headerWrap.getBoundingClientRect();
                    // place at bottom-right corner of the header wrapper, with small offset
                    const btnW = headerToggleEl.offsetWidth || 70;
                    const btnH = headerToggleEl.offsetHeight || 28;
                    const right = Math.max(8, window.innerWidth - rect.right + 8);
                    const top = Math.max(8, rect.bottom - btnH - 6);
                    headerToggleEl.style.right = right + 'px';
                    headerToggleEl.style.top = top + 'px';
                }catch(e){ /* ignore */ }
            }

            // position now and on resize/scroll
            updatePos();
            window.addEventListener('resize', updatePos);
            window.addEventListener('scroll', updatePos);

            headerToggleEl.addEventListener('click', togglePanel);
        }catch(e){ console.warn('tth: insertHeaderToggle failed', e); }
    }

    // Try inserting header toggle now and retry a few times while header renders
    (function ensureHeaderToggle(){
        insertHeaderToggle();
        if (!document.getElementById('tth-header-toggle-btn')){
            let attempts = 0;
            const t = setInterval(()=>{
                attempts++;
                insertHeaderToggle();
                if (document.getElementById('tth-header-toggle-btn') || attempts > 10) clearInterval(t);
            }, 500);
        }
    })();

    // Fetch pricelist JSON and return a map { nameLower: { adjusted_price, base_price, item_id, name } }
    // Helper: perform cross-origin GET using GM_xmlhttpRequest when available to bypass page CSP/CORS
    function gmGetText(url){
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === 'function'){
                try{
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: function(res){
                            if (res.status >= 200 && res.status < 300) return resolve(res.responseText);
                            return reject(new Error('HTTP ' + res.status + ' from ' + url));
                        },
                        onerror: function(err){ reject(new Error('Network error fetching ' + url)); },
                        ontimeout: function(){ reject(new Error('Timeout fetching ' + url)); }
                    });
                }catch(e){
                    reject(e);
                }
            } else {
                // Fallback to window.fetch (may be blocked by CSP)
                fetch(url).then(r=>{ if (!r.ok) throw new Error('HTTP '+r.status); return r.text(); }).then(resolve).catch(reject);
            }
        });
    }

    // Perform a form-encoded POST via GM_xmlhttpRequest (returns { status, responseText })
    function gmPostForm(url, obj){
        const body = Object.keys(obj||{}).map(k=>encodeURIComponent(k)+'='+encodeURIComponent(String(obj[k]||''))).join('&');
        return new Promise((resolve, reject)=>{
            if (typeof GM_xmlhttpRequest === 'function'){
                try{
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: url,
                        data: body,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        onload: function(res){ resolve({ status: res.status, responseText: res.responseText }); },
                        onerror: function(err){ reject(new Error('Network error')); },
                        ontimeout: function(){ reject(new Error('Timeout')); }
                    });
                }catch(e){ reject(e); }
            } else {
                fetch(url, { method: 'POST', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body, credentials: 'include' })
                    .then(r=>r.text().then(t=>resolve({ status: r.status, responseText: t })).catch(e=>reject(e))).catch(e=>reject(e));
            }
        });
    }

    // Perform a JSON POST via GM_xmlhttpRequest (returns { status, json, text })
    function gmPostJson(url, obj){
        const body = JSON.stringify(obj || {});
        return new Promise((resolve, reject)=>{
            if (typeof GM_xmlhttpRequest === 'function'){
                try{
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: url,
                        data: body,
                        headers: { 'Content-Type': 'application/json' },
                        onload: function(res){
                            let parsed = null;
                            try { parsed = res.responseText ? JSON.parse(res.responseText) : null; } catch(e) { /* ignore */ }
                            resolve({ status: res.status, json: parsed, text: res.responseText });
                        },
                        onerror: function(err){ reject(new Error('Network error')); },
                        ontimeout: function(){ reject(new Error('Timeout')); }
                    });
                }catch(e){ reject(e); }
            } else {
                fetch(url, { method: 'POST', headers: { 'Content-Type':'application/json' }, body, credentials: 'include' })
                    .then(async r=>{
                        const txt = await r.text();
                        let parsed = null; try{ parsed = txt ? JSON.parse(txt) : null }catch(e){}
                        resolve({ status: r.status, json: parsed, text: txt });
                    }).catch(e=>reject(e));
            }
        });
    }

    async function fetchPricelistMap(){
        let base = localStorage.getItem('tth_backend_base') || BACKEND_BASE;
        if (!base) return { map: {}, error: 'No backend configured' };
        // Normalize: ensure protocol present
        if (!/^https?:\/\//i.test(base)) base = 'https://' + base.replace(/^\/+/, '');
        const url = base.replace(/\/$/, '') + '/api/pricelist';
        try{
            const text = await gmGetText(url);
            const data = JSON.parse(text);
            const map = data && data.map ? data.map : {};
            return { map, error: null };
        }catch(e){
            console.warn('tth pricelist fetch failed (final):', e);
            return { map: {}, error: (e.message || String(e)) + ' (' + url + ')' };
        }
    }

    async function buildDisplayData(){
        // returns list of { qty, name, adjusted_price, base_price, total } and fetch error
        const { map, error } = await fetchPricelistMap();
        const rows = [];
        let grandTotal = 0;
        let grandMarket = 0;
        aggregated.items.forEach(it => {
            const key = it.name.toLowerCase();
            const found = map[key] || null;
            const adjusted_unit = found && found.adjusted_price ? found.adjusted_price : null;
            const base_unit = found && found.base_price ? found.base_price : null;
            const total = adjusted_unit ? adjusted_unit * it.qty : 0;
            if (adjusted_unit) grandTotal += total;
            if (base_unit) grandMarket += (base_unit * it.qty);
            rows.push({ qty: it.qty, name: it.name, adjusted_unit, base_unit, total, found: !!found });
        });
        return { rows, grandTotal, grandMarket, error };
    }

    function formatMoney(n){ return '$' + (n || 0).toLocaleString(); }

    async function refreshPanelWithPrices(){
        if (!aggregated.items.length){ updatePanel(); return; }
        const { rows, grandTotal, grandMarket, error } = await buildDisplayData();
        const header = `<div style="margin-bottom:6px;color:#9bf;font-size:12px;">Seller: <strong>${escapeHtml(aggregated.seller || 'Unknown')}</strong>${aggregated.timestamp? ' • '+escapeHtml(aggregated.timestamp):''}</div>`;
        const bodyRows = rows.map(r=>{
            const warn = r.adjusted_unit === null ? '<span style="color:#ffc107;margin-left:6px;">⚠️ missing</span>' : '';
            return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed rgba(255,255,255,0.04);"><div style="flex:1">${escapeHtml(r.qty+'x '+r.name)} ${warn}</div><div style="text-align:right;min-width:160px">${formatMoney(r.total)}<div style="font-size:11px;color:#9ae;">(${formatMoney(r.adjusted_unit||0)}) • MV ${formatMoney(r.base_unit||0)}</div></div></div>`;
        }).join('');
        const totals = `<div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.04);padding-top:8px;color:#ddd;font-size:13px;"><div style="display:flex;justify-content:space-between;"><div>Value Total</div><div>${formatMoney(grandTotal)}</div></div><div style="display:flex;justify-content:space-between;margin-top:4px;"><div>Market Value Total</div><div>${formatMoney(grandMarket)}</div></div></div>`;
        let errHtml = '';
        if (error) errHtml = `<div style="color:#ffc107;margin-top:8px;font-size:12px;">⚠️ Pricelist fetch error: ${escapeHtml(String(error))}</div>`;
        bodyEl.innerHTML = header + bodyRows + totals + errHtml;
    }

    // When Copy Receipt clicked: build trade payload, POST to /api/trades, then copy receipt text
    async function ensureLoggedIn(){
        const creds = localStorage.getItem('tth_creds');
        const baseRaw = localStorage.getItem('tth_backend_base') || BACKEND_BASE;
        if (!baseRaw) return false;
        let base = baseRaw;
        if (!/^https?:\/\//i.test(base)) base = 'https://' + base.replace(/^\/+/, '');
        if (!creds) return true; // no creds stored - assume cookies/session already present or public
        try{
            const { u, p } = JSON.parse(creds);
            const url = base.replace(/\/$/, '') + '/login';
            const resp = await gmPostForm(url, { username: u, password: p, remember: 1 });
            // success typically returns 200 or a redirect; consider 200-399 as success
            return resp && (resp.status >= 200 && resp.status < 400);
        }catch(e){ console.warn('Login attempt failed', e); return false; }
    }

    importBtn.addEventListener('click', async ()=>{
        if (!aggregated.items.length) return alert('No items to import');
        if (!BACKEND_BASE) return alert('No backend configured. Please set your Tracker backend URL.');
        importBtn.disabled = true; importBtn.textContent = 'Processing...';
        try{
            const logged = await ensureLoggedIn();
            if (!logged) { throw new Error('Authentication failed. Please configure valid admin credentials in Settings.'); }
            const { rows, grandTotal } = await buildDisplayData();
            // build trade items for server
            const tradeItems = rows.map(r => ({
                name: r.name,
                extra_name: '',
                item_id: null,
                quantity: Number(r.qty),
                remaining_qty: Number(r.qty),
                purchase_price: r.adjusted_unit ? r.adjusted_unit * r.qty : 0,
                expected_price: r.adjusted_unit ? r.adjusted_unit * r.qty : 0,
                sold_price: null,
                paid_out: false,
                needs_config: !r.found
            }));

            const tradeId = `import_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
            // Determine timestamp to send to backend.
            // Prefer the parsed timestamp from the trade (if available and parseable),
            // otherwise use the current time. Backend expects UNIX seconds.
            let payloadTimestampMs = Date.now();
            if (aggregated.timestamp) {
                try{
                    // Some date strings include the word 'at' (e.g. "1/21/25 at 2:00:26 AM"); normalize before parsing
                    const normalized = String(aggregated.timestamp).replace(/\s+at\s+/i, ' ');
                    const parsed = Date.parse(normalized);
                    if (!isNaN(parsed)) payloadTimestampMs = parsed;
                }catch(e){ /* fall back to now */ }
            }
            const payloadTimestampSec = Math.floor(payloadTimestampMs / 1000);

            const tradePayload = {
                trade_id: tradeId,
                partner: aggregated.seller || 'Unknown',
                // UNIX epoch seconds (backend expects seconds, not ms)
                timestamp: payloadTimestampSec,
                // keep human-readable original time for backup/diagnostics
                trade_time_text: aggregated.timestamp || null,
                items: tradeItems
            };

            const postUrl = (function(){ let b = BACKEND_BASE; if (!/^https?:\/\//i.test(b)) b = 'https://' + b.replace(/^\/+/, ''); return b.replace(/\/$/, '') + '/api/trades'; })();
            const resp = await gmPostJson(postUrl, tradePayload);
            if (!resp || !(resp.status >= 200 && resp.status < 400)){
                const txt = resp && resp.text ? resp.text : 'HTTP ' + (resp && resp.status || '??');
                throw new Error(txt || 'Trade POST failed');
            }

            // Build receipt text (short variant)
            const receiptLink = `${BACKEND_BASE}/receipt/${tradeId}`;
            const receiptText = `Hey ${aggregated.seller || 'Trader'}! 👋\n\n🤝 Thank you for our Trade!\n\n💰 Total of your trade: ${Math.round(grandTotal).toLocaleString()}\n📋 [View your Receipt Here]( ${receiptLink} )\n\nHave a nice day!! 😊✨`;

            await navigator.clipboard.writeText(receiptText);
            alert('Receipt copied to clipboard and trade saved.');
            aggregated = { seller:null, items:[], timestamp:null };
            await refreshPanelWithPrices();
        }catch(e){ console.error('Copy+Save failed', e); alert('Save or copy failed: '+e.message); }
        finally{ importBtn.disabled = false; importBtn.textContent = 'Copy Receipt'; }
    });

    // Start
    initialScan();
    setupObservers();

})();