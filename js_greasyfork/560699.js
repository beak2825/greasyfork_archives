// ==UserScript==
// @name         Torn Trade Helper (Tracker Import)
// @namespace    http://tampermonkey.net/
// @version      1.5
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
        // Normalize separators and remove common Torn log fluff
        const cleaned = text.replace(/\u00A0/g,' ')
                            .replace(/\band\b/gi, ',')
                            .replace(/from the trade\.?/i,'') // Added specifically to handle "removed X from the trade"
                            .replace(/to the trade\.?/i,'')
                            .replace(/\s+items\b/gi, '')
                            .trim();
        // matches "1x Can of Crocozade" and variations
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

    // UI panel - reuse existing panel if present to avoid duplicate panels
    let panel = document.getElementById('torn-trade-helper-panel');
    if (!panel) {
        panel = document.createElement('div');
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
            <div id="tth-body" style="font-size:13px;line-height:1.2;color:#ddd;max-height:280px;overflow:auto;padding-bottom:6px;">Waiting for trade items...</div>
            <div id="tth-console" style="font-size:11px;line-height:1.2;color:#aaa;height:80px;overflow:auto;padding:4px;background:rgba(0,0,0,0.3);border-radius:4px;margin-top:4px;border-top:1px solid #444;font-family:monospace;">Script activity console...</div>
            <div style="display:flex;gap:8px;margin-top:8px;">
                <button id="tth-copy" style="flex:1;padding:8px;background:#28a745;border:none;border-radius:6px;color:#fff;cursor:pointer;">Copy Receipt</button>
                <button id="tth-clear" style="padding:8px;background:#6c757d;border:none;border-radius:6px;color:#fff;cursor:pointer;">Clear</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    const bodyEl = panel.querySelector('#tth-body');
    const consoleEl = panel.querySelector('#tth-console');
    const importBtn = panel.querySelector('#tth-copy');
    const clearBtn = panel.querySelector('#tth-clear');
    const collapseBtn = panel.querySelector('#tth-collapse-btn');

    function tthLog(msg) {
        if (!consoleEl) return;
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const line = document.createElement('div');
        line.textContent = `[${time}] ${msg}`;
        consoleEl.appendChild(line);
        consoleEl.scrollTop = consoleEl.scrollHeight;
        if (consoleEl.children.length > 50) consoleEl.removeChild(consoleEl.firstChild);
    }

    // Delegated copy button handler inside the panel
    panel.addEventListener('click', (ev) => {
        try {
            const btn = ev.target.closest && ev.target.closest('.tth-copy-btn');
            if (btn) {
                const v = btn.getAttribute('data-val');
                if (typeof window.tthCopy === 'function') window.tthCopy(JSON.parse(v));
                else tthCopy(JSON.parse(v));
            }
        } catch (e) { /* ignore */ }
    });

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
    // Memory of processed messages to prevent re-processing on refresh
    let processedMessageHashes = new Set();
    const messageDeltas = new Map();

    function normalizeName(name) {
        if (!name) return '';
        return name.toLowerCase()
            .replace(/\s+items$/i, '')
            .replace(/[^a-z0-9]/g, '')
            .trim();
    }

    function getMessageHash(msgEl) {
        const text = (msgEl.textContent || '').trim();
        const dateEl = msgEl.closest && msgEl.closest('li') ? msgEl.closest('li').querySelector('.date') : null;
        const dateText = dateEl ? dateEl.textContent.trim() : '';
        return `${dateText}|${text}`;
    }

    function aggregateItems(newItems){
        newItems.forEach(it => {
            const normalizedSearch = normalizeName(it.name);
            const found = aggregated.items.find(x => normalizeName(x.name) === normalizedSearch);
            if (found) found.qty += it.qty; else aggregated.items.push({ name: it.name, qty: it.qty });
        });
        if (newItems.length > 0) {
            const details = newItems.map(i => `${i.qty}x ${i.name}`).join(', ');
            tthLog(`Added ${details}`);
            logConclusion();
        }
    }

    function logConclusion() {
        if (!aggregated.items.length) {
            tthLog(`Conclusion: [ Empty ]`);
            return;
        }
        const details = aggregated.items.map(i => `${i.qty}x ${i.name}`).join(', ');
        tthLog(`Conclusion: [ ${details} ]`);
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
        const allNewMsgEls = [];
        mutations.forEach(m=>{
            m.addedNodes.forEach(node=>{
                if (node.nodeType === 1){
                    if (node.matches && node.matches('.msg')) allNewMsgEls.push(node);
                    allNewMsgEls.push(...Array.from(node.querySelectorAll && node.querySelectorAll('.msg') || []));
                }
            });
        });

        // Filter for "added" or "removed" items and sort by date element if present (oldest first)
        const toProcess = allNewMsgEls.filter(msgEl => {
            const hash = getMessageHash(msgEl);
            if (messageDeltas.has(hash)) return false;
            
            const text = (msgEl.textContent || '').trim();
            const hasAdded = /\badded\b/i.test(text);
            const hasRemoved = /\bremoved\b/i.test(text);
            
            // Only process if it contains a quantity like "1x" to avoid false positives
            const hasQty = /(\d+)\s*x\s*/i.test(text);
            
            return (hasAdded || hasRemoved) && hasQty;
        }).sort((a, b) => {
            const dateA = a.closest && a.closest('li') ? a.closest('li').querySelector('.date') : null;
            const dateB = b.closest && b.closest('li') ? b.closest('li').querySelector('.date') : null;
            if (dateA && dateB) {
                const parseDate = (el) => {
                    const txt = el.textContent.trim();
                    const [time, date] = txt.split(' - ');
                    const [d, m, y] = date.split('/');
                    return new Date(`${m}/${d}/${y} ${time}`).getTime();
                };
                return parseDate(dateA) - parseDate(dateB);
            }
            return 0;
        });

        if (toProcess.length > 0) {
            toProcess.forEach(msgEl => {
                try {
                    const hash = getMessageHash(msgEl);
                    if (messageDeltas.has(hash)) return;
                    messageDeltas.set(hash, true);

                    const text = (msgEl.textContent || '').trim();
                    const isRemoval = /\bremoved\b/i.test(text);
                    const parsed = parseAddedItemsFromText(text);
                    if (parsed.length){
                        aggregated.seller = aggregated.seller || findSellerName();
                        const dateEl = msgEl.closest && msgEl.closest('li') ? msgEl.closest('li').querySelector('.date') : null;
                        aggregated.timestamp = aggregated.timestamp || (dateEl ? dateEl.textContent.trim() : (new Date()).toLocaleString());
                        
                        if (isRemoval) {
                            removeItems(parsed);
                        } else {
                            aggregateItems(parsed);
                        }
                    }
                } catch(e) { console.warn('tth mutation process err', e); }
            });
            refreshPanelWithPrices();
        }
    }

    function removeItems(itemsToRemove) {
        itemsToRemove.forEach(it => {
            const searchName = normalizeName(it.name);
            const foundIndex = aggregated.items.findIndex(x => {
                const existingName = normalizeName(x.name);
                return existingName === searchName;
            });

            if (foundIndex !== -1) {
                const currentQty = aggregated.items[foundIndex].qty;
                const newQty = currentQty - it.qty;
                
                if (newQty <= 0) {
                    aggregated.items.splice(foundIndex, 1);
                } else {
                    aggregated.items[foundIndex].qty = newQty;
                }
            }
        });
        if (itemsToRemove.length > 0) {
            const details = itemsToRemove.map(i => `${i.qty}x ${i.name}`).join(', ');
            tthLog(`Removed ${details}`);
            logConclusion();
        }
    }

    // Initial scan (in case items already present)
    function initialScan(){
        // Scan all existing .msg elements across the page
        const allMsgEls = Array.from(document.querySelectorAll('.msg'));
        
        // Filter for "added" or "removed" items and sort by date element if present (oldest first)
        const toProcess = allMsgEls.filter(msgEl => {
            const hash = getMessageHash(msgEl);
            if (messageDeltas.has(hash)) return false;
            const text = (msgEl.textContent || '').trim();
            return /\badded\b/i.test(text) || /\bremoved\b/i.test(text);
        }).sort((a, b) => {
            const dateA = a.closest && a.closest('li') ? a.closest('li').querySelector('.date') : null;
            const dateB = b.closest && b.closest('li') ? b.closest('li').querySelector('.date') : null;
            if (dateA && dateB) {
                const parseDate = (el) => {
                    const txt = el.textContent.trim();
                    const [time, date] = txt.split(' - ');
                    const [d, m, y] = date.split('/');
                    return new Date(`${m}/${d}/${y} ${time}`).getTime();
                };
                return parseDate(dateA) - parseDate(dateB);
            }
            return 0;
        });

        toProcess.forEach(msgEl => {
            try {
                const hash = getMessageHash(msgEl);
                if (messageDeltas.has(hash)) return;
                messageDeltas.set(hash, true);
                
                const text = (msgEl.textContent || '').trim();
                const isRemoval = /\bremoved\b/i.test(text);
                const parsed = parseAddedItemsFromText(text);
                if (parsed.length){
                    aggregated.seller = aggregated.seller || findSellerName();
                    const dateEl = msgEl.closest && msgEl.closest('li') ? msgEl.closest('li').querySelector('.date') : null;
                    aggregated.timestamp = aggregated.timestamp || (dateEl ? dateEl.textContent.trim() : null);
                    
                    if (isRemoval) {
                        removeItems(parsed);
                    } else {
                        aggregateItems(parsed);
                    }
                }
            } catch(e) { /* ignore */ }
        });
        refreshPanelWithPrices();
    }

    clearBtn.addEventListener('click', ()=>{ 
        aggregated = { seller:null, items:[], timestamp:null }; 
        processedMessageHashes.clear();
        messageDeltas.clear();
        refreshPanelWithPrices(); 
        tthLog('Cleared panel data');
    });

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
            const normalizedName = it.name.toLowerCase().replace(/\s+items$/i, '').trim();
            const key = normalizedName;
            const found = map[key] || map[it.name.toLowerCase()] || null;
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

    function tthCopy(val){
        try{
            let out = '';
            if (val === null || val === undefined) out = '';
            else if (typeof val === 'number') out = val.toLocaleString();
            else if (typeof val === 'string') {
                // strip leading $ and surrounding whitespace
                out = val.replace(/^\s*\$/,'').trim();
            } else {
                out = String(val);
            }

            if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(out).catch(e=>console.warn('tth copy failed', e));
            }
            const ta = document.createElement('textarea'); ta.value = out; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
        }catch(e){ console.warn('tth copy error', e); }
    }
    // expose to window for inline onclick handlers
    try{ window.tthCopy = tthCopy; }catch(e){ /* ignore */ }

    async function refreshPanelWithPrices(){
        const { rows, grandTotal, grandMarket, error } = await buildDisplayData();
        
        if (!rows.length){ 
            bodyEl.innerHTML = '<em style="color:#999;">Waiting for trade items...</em>'; 
            return; 
        }

        const header = `<div style="margin-bottom:6px;color:#9bf;font-size:12px;">Seller: <strong>${escapeHtml(aggregated.seller || 'Unknown')}</strong>${aggregated.timestamp? ' • '+escapeHtml(aggregated.timestamp):''}</div>`;
        const bodyRows = rows.map(r=>{
            const warn = r.adjusted_unit === null ? '<span style="color:#ffc107;margin-left:6px;">⚠️ missing</span>' : '';
            const tot = r.total || 0;
            const unit = r.adjusted_unit || 0;
            const mv = r.base_unit || 0;
            return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed rgba(255,255,255,0.04);">
                        <div style="flex:1">${escapeHtml(r.qty+'x '+r.name)} ${warn}</div>
                        <div style="text-align:right;min-width:160px">
                            ${formatMoney(tot)} <button class="tth-copy-btn" data-val=${JSON.stringify(tot)} title="Copy total" style="margin-left:6px;font-size:12px;padding:2px 6px;">📋</button>
                            <div style="font-size:11px;color:#9ae;">(${formatMoney(unit)}) <button class="tth-copy-btn" data-val=${JSON.stringify(unit)} title="Copy unit price" style="margin-left:6px;font-size:11px;padding:2px 6px;">📋</button> • MV ${formatMoney(mv)} <button class="tth-copy-btn" data-val=${JSON.stringify(mv)} title="Copy market value" style="margin-left:6px;font-size:11px;padding:2px 6px;">📋</button></div>
                        </div>
                    </div>`;
        }).join('');
        const totals = `<div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.04);padding-top:8px;color:#ddd;font-size:13px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;"><div>Value Total</div><div>${formatMoney(grandTotal)} <button class=\"tth-copy-btn\" data-val=${JSON.stringify(grandTotal)} title=\"Copy total value\" style=\"margin-left:8px;font-size:12px;padding:4px 6px;\">📋</button></div></div>
                            <div style="display:flex;justify-content:space-between;margin-top:4px;align-items:center;"><div>Market Value Total</div><div>${formatMoney(grandMarket)} <button class=\"tth-copy-btn\" data-val=${JSON.stringify(grandMarket)} title=\"Copy market value total\" style=\"margin-left:8px;font-size:12px;padding:4px 6px;\">📋</button></div></div>
                        </div>`;
        
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
            if (!logged) { 
                tthLog('❌ Auth failed. Check settings.');
                throw new Error('Authentication failed. Please configure valid admin credentials in Settings.'); 
            }
            
            tthLog('🔍 Looking up item IDs...');
            const { rows, grandTotal } = await buildDisplayData();
            // build trade items for server
            const tradeItems = await Promise.all(rows.map(async r => {
                const purchasePriceUnit = r.adjusted_unit ? r.adjusted_unit : 0;
                const qty = Number(r.qty || 0);
                const purchasePriceTotal = purchasePriceUnit * qty;

                // Calculate expected price: (purchase_price * (1 + profit%)) / (1 - market_fee%)
                const marketFee = 5; 
                const expectedPriceUnit = Math.ceil(purchasePriceUnit / (1 - marketFee / 100));

                let itemId = null;
                try {
                    const searchUrl = BACKEND_BASE + '/api/items/search/' + encodeURIComponent(r.name);
                    const searchResp = await gmGetText(searchUrl);
                    const searchData = JSON.parse(searchResp);
                    if (searchData && searchData.id) {
                        itemId = String(searchData.id);
                    }
                } catch (e) {
                    console.warn('tth: failed to lookup item id for ' + r.name, e);
                }

                return {
                    name: r.name,
                    extra_name: '',
                    item_id: itemId,
                    quantity: qty,
                    remaining_qty: qty,
                    purchase_price: purchasePriceTotal, // Use total price instead of unit price
                    expected_price: expectedPriceUnit,
                    sold_price: null,
                    paid_out: false,
                    needs_config: !r.found
                };
            }));

            const tradeId = `import_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
            
            // Partner is required by the backend, mapped from aggregated.seller
            const tradePayload = {
                trader_name: aggregated.seller || 'Unknown',
                partner: aggregated.seller || 'Unknown',
                trader_id: null,
                items: tradeItems,
                total_value: Math.round(grandTotal),
                // Backend expects timestamp as a Number (Unix timestamp in SECONDS)
                timestamp: aggregated.timestamp ? (function(){
                    try {
                        const txt = aggregated.timestamp.trim();
                        // Handle "HH:mm:ss - DD/MM/YY" format
                        const [timePart, datePart] = txt.split(' - ');
                        if (!timePart || !datePart) throw new Error("Invalid format");
                        
                        const [d, m, y] = datePart.split('/');
                        const [HH, MM, SS] = timePart.split(':');
                        
                        // Ensure year is 20YY if only 2 digits
                        const fullYear = y.length === 2 ? '20' + y : y;
                        
                        // Create date using individual components to avoid browser parsing quirks
                        // monthIndex is 0-based
                        const dateObj = new Date(
                            parseInt(fullYear),
                            parseInt(m) - 1,
                            parseInt(d),
                            parseInt(HH),
                            parseInt(MM),
                            parseInt(SS)
                        );
                        
                        const tsMs = dateObj.getTime();
                        if (isNaN(tsMs)) {
                            console.warn("tth: Date parsing resulted in NaN", txt);
                            return Math.floor(Date.now() / 1000);
                        }
                        return Math.floor(tsMs / 1000);
                    } catch(e) { 
                        console.warn("tth: Timestamp parse error", e, aggregated.timestamp);
                        return Math.floor(Date.now() / 1000); 
                    }
                })() : Math.floor(Date.now() / 1000),
                status: 'pending',
                source: 'helper_script',
                trade_id: tradeId
            };

            tthLog(`📤 Sending trade for ${aggregated.seller}...`);
            const postUrl = (function(){ let b = BACKEND_BASE; if (!/^https?:\/\//i.test(b)) b = 'https://' + b.replace(/^\/+/, ''); return b.replace(/\/$/, '') + '/api/trades'; })();
            const resp = await gmPostJson(postUrl, tradePayload);
            if (!resp || !(resp.status >= 200 && resp.status < 400)){
                const txt = resp && resp.text ? resp.text : 'HTTP ' + (resp && resp.status || '??');
                tthLog(`❌ Save failed: ${txt}`);
                throw new Error(txt || 'Trade POST failed');
            }

            tthLog(`✅ Trade saved successfully!`);
            // Build receipt text (short variant)
            const receiptLink = `${BACKEND_BASE}/receipt/${tradeId}`;
            const receiptText = `Hey ${aggregated.seller || 'Trader'}! 👋\n\n🤝 Thank you for the Trade!\n\n💰 Total trade: ${Math.round(grandTotal).toLocaleString()}\n📋 [View your Receipt Here]( ${receiptLink} )\n\nHave a nice day!! 😊✨`;

            await navigator.clipboard.writeText(receiptText);
            tthLog(`📋 Receipt copied to clipboard`);
            alert('Receipt copied to clipboard and trade saved.');
            aggregated = { seller:null, items:[], timestamp:null };
            await refreshPanelWithPrices();
        }catch(e){ 
            console.error('Copy+Save failed', e); 
            tthLog(`❌ Error: ${e.message}`);
            alert('Save or copy failed: '+e.message); 
        }
        finally{ importBtn.disabled = false; importBtn.textContent = 'Copy Receipt'; }
    });

    // Start
    initialScan();
    setupObservers();

})();