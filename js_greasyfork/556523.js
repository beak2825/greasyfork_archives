// ==UserScript==
// @name         Torn Crime checker? idkkkkkkkkkk
// @namespace    http://tampermonkey.net/
// @version      3.2.12
// @description  Compact Torn Crime checker for shoplifting and search for cash
// @author       Chib
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/556523/Torn%20Crime%20checker%20idkkkkkkkkkk.user.js
// @updateURL https://update.greasyfork.org/scripts/556523/Torn%20Crime%20checker%20idkkkkkkkkkk.meta.js
// ==/UserScript==
/* eslint-disable no-multi-spaces */

(function(){
    'use strict';
    let API_KEY = GM_getValue('API_KEY', '') || '';
    const CHECK_INTERVAL = 30000;
    let isMinimized = GM_getValue('isMinimized', false);
    const NO_GUARDS_SHOPS = ["Sally's Sweet Shop","Bits 'n' Bobs"];
    let leftContent = GM_getValue('leftContent', 'shop');

    const PANEL_WIDTH = 340;
    const API_POPUP_WIDTH = 280;

    GM_addStyle(`
        #shopPanel{position:fixed;top:48px;right:16px;z-index:10000;font-family:Arial,Helvetica,sans-serif;border-radius:8px;overflow:visible;box-shadow:0 6px 18px rgba(0,0,0,0.6);background:linear-gradient(180deg,#0d0d0d,#0a0a0a);color:#eaeaea;transition:none;box-sizing:border-box}
        #shopPanel .panel-header{display:flex;align-items:center;justify-content:space-between;padding:6px 8px;gap:8px;background:linear-gradient(180deg,#141414,#0b0b0b);border-bottom:1px solid rgba(255,255,255,0.03)}
        #shopPanel .panel-title{display:flex;align-items:center;gap:6px;font-weight:700;font-size:12px;min-width:140px;max-width:420px;overflow:visible;flex-wrap:nowrap}
        #shopPanel .panel-title #updatedLabel{font-weight:600;font-size:11px;opacity:0.85;white-space:nowrap}
        #shopPanel .panel-title #lastCheckedHeader{white-space:nowrap;display:inline-block;min-width:80px}
        #shopPanel .panel-title button{background:#171717;color:#ddd;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:11px;margin-left:8px;flex:0 0 auto;white-space:nowrap;min-width:84px}
        #shopPanel .panel-controls{display:flex;gap:6px;align-items:center;flex-shrink:0}
        #shopPanel .panel-controls button{background:#171717;color:#ddd;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:11px}
        .panel-body{display:flex;gap:2px;padding:2px;align-items:flex-start;min-width:220px;max-width:720px;transition:none}
        .left-col{flex:1 1 100%;max-height:420px;overflow:auto;position:relative;padding-right:6px}
        .right-col{display:none}
        .section-title{font-weight:700;font-size:11px;margin-bottom:6px;display:inline-block;background:#111;padding:4px 6px;border-radius:5px;position:relative;z-index:1}
        .section-title a{color:inherit;text-decoration:none;display:inline-block;padding:0;margin:0}
        .section-title a:hover{opacity:0.95;text-decoration:underline}
        .shop-card{margin-bottom:2px;display:grid;grid-template-columns:minmax(56px,1fr) 80px 80px;column-gap:1px;align-items:center;padding:2px 6px;border-radius:6px;position:relative;z-index:1;background:transparent}
        .shop-name{grid-column:1/2;font-weight:700;font-size:12px;color:#f3f3f3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:0;max-width:1fr}
        .camera-col{grid-column:2/3;display:flex;align-items:center;justify-self:start;gap:1px;flex-shrink:0;justify-content:flex-start}
        .pills{grid-column:3/4;display:flex;gap:1px;align-items:center;justify-self:center;flex-shrink:0}
        .pill{display:inline-flex;align-items:center;gap:4px;padding:4px 7px;border-radius:13px;color:#fff;font-size:11px;min-height:20px;box-sizing:border-box;white-space:nowrap;justify-content:center;border:1px solid rgba(255,255,255,0.03);box-shadow:0 2px 0 rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.02) inset}
        .pill .name{font-weight:700;font-size:11px}
        .pill .state{font-weight:800;font-size:11px;opacity:0.95;margin-left:1px}
        .pill.missing-guard{background:#4a4a4a;color:#cfcfcf;opacity:0.95;text-decoration:line-through;border:1px solid rgba(255,255,255,0.03);box-shadow:none}
        .pill.guard-pill{padding:5px 8px;min-width:66px;max-width:78px;border-radius:14px}
        .pill.camera-pill{padding-left:9px;padding-right:9px;min-width:68px;max-width:80px;border-radius:14px}
        .search-entry{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start;padding:6px 8px;border-radius:8px;margin-bottom:6px;color:#fff;font-size:11px;background-clip:padding-box;white-space:normal;overflow:visible}
        .search-title{overflow:visible;white-space:normal;max-width:calc(100% - 56px);word-break:break-word;font-weight:600;flex:1 1 auto;margin-right:8px;display:block}
        .search-title .loc{font-weight:900;margin-right:6px;display:inline-block}
        .search-entry .percent{font-weight:900;min-width:36px;text-align:right;flex:0 0 36px;white-space:nowrap}
        .status-line{font-size:11px;color:#ffcc66;margin-left:8px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle}
        .error-line{font-size:11px;color:#ff7b7b;margin-left:8px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle}
        .blink-alert{animation:security-blink 900ms ease forwards}
        @keyframes security-blink{0%{box-shadow:0 0 0 rgba(179,51,51,0);background:rgba(179,51,51,0);transform:translateZ(0)}25%{box-shadow:0 0 18px rgba(179,51,51,0.98);background:rgba(179,51,51,0.95)}60%{box-shadow:0 0 8px rgba(179,51,51,0.6);background:rgba(179,51,51,0.45)}100%{box-shadow:none;background:transparent}}
        #shopPanel.smallScreen .panel-body{flex-direction:column;min-width:220px;max-width:92vw}
        .left-col::-webkit-scrollbar{width:8px;height:8px}
        .left-col::-webkit-scrollbar-thumb{background:rgba(120,120,120,0.22);border-radius:6px}
        .api-popup{position:fixed;display:none;padding:8px;border-radius:8px;background:linear-gradient(180deg,#3a3a3a,#272727);border:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 30px rgba(0,0,0,0.75);z-index:10002;color:#f0f0f0}
        .api-popup .row{display:flex;gap:6px;align-items:center}
        .api-popup input{flex:1;background:#2b2b2b;border:1px solid rgba(255,255,255,0.03);color:#fff;padding:6px;border-radius:6px;font-size:12px;max-width:220px}
        .api-popup button{background:#333;color:#ddd;border:none;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px}
        .no-api-ribbon{position:absolute;top:10px;left:-40px;width:calc(100% + 80px);transform:rotate(12deg);background:rgba(120,120,120,0.95);color:#fff;text-align:center;font-weight:800;padding:6px 0;pointer-events:none;z-index:9999;border-radius:4px;box-shadow:0 6px 18px rgba(0,0,0,0.6)}
        #minimizeIcon{cursor:pointer;user-select:none;padding:2px 6px;border-radius:6px;background:rgba(255,255,255,0.02)}
    `);

    function getScreenSize(){ if(window.innerWidth<=480) return 'small'; if(window.innerWidth<=768) return 'medium'; return 'large' }

    function formatShortTime(ts){
        if(!ts) return 'Never';
        try{
            const d = new Date(ts);
            return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
        }catch(e){
            return new Date(ts).toLocaleString();
        }
    }

    function applyFixedWidth(){
        const panel = document.getElementById('shopPanel');
        if(!panel) return;
        if(getScreenSize()==='small'){
            panel.style.width = '';
            const body = panel.querySelector('.panel-body');
            if(body) body.style.maxWidth = '';
            return;
        }
        panel.style.width = PANEL_WIDTH + 'px';
        const body = panel.querySelector('.panel-body');
        if(body) body.style.maxWidth = Math.max(120, PANEL_WIDTH - 12) + 'px';
    }

    function escapeHtml(s){
        return String(s).replace(/[&<>"'`=\/]/g, function (c) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;','=':'&#61;','/':'&#47;'}[c];
        });
    }

    function capitalizeWords(s){
        return s.split(/[\s_-]+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
    }

    function getLocationName(key, title){
        const t = (title || '').toLowerCase();
        const m = t.match(/search the ([^:]+)/i);
        if(m){
            return capitalizeWords(m[1].trim());
        }
        const map = {
            trash: 'Trash',
            subway: 'Subway',
            junkyard: 'Junkyard',
            beach: 'Beach',
            cemetery: 'Cemetery',
            fountain: 'Fountain'
        };
        if(map[key]) return map[key];
        for(const k in map){
            if(key.toLowerCase().includes(k)) return map[k];
        }
        return capitalizeWords(key.replace(/_/g,' '));
    }

    function lerp(a,b,t){ return a + (b-a)*t; }
    function toHex(n){ const h = Math.round(n).toString(16); return h.length===1 ? '0'+h : h; }

    function percentToColor(p){
        const clamped = Math.max(0, Math.min(100, p));
        const red = {r:179,g:51,b:51};     // ~#b33333
        const yellow = {r:184,g:134,b:11}; // ~#b8860b
        const green = {r:46,g:139,b:87};   // ~#2e8b57
        let c;
        if(clamped <= 50){
            const t = clamped / 50;
            c = {
                r: lerp(red.r, yellow.r, t),
                g: lerp(red.g, yellow.g, t),
                b: lerp(red.b, yellow.b, t)
            };
        } else {
            const t = (clamped - 50) / 50;
            c = {
                r: lerp(yellow.r, green.r, t),
                g: lerp(yellow.g, green.g, t),
                b: lerp(yellow.b, green.b, t)
            };
        }
        return '#' + toHex(c.r) + toHex(c.g) + toHex(c.b);
    }

    function createPanel(){
        const existing=document.getElementById('shopPanel');
        if(existing) existing.remove();
        const panel=document.createElement('div');
        panel.id='shopPanel';
        if(getScreenSize()==='small') panel.classList.add('smallScreen');
        const lastCheckedTime=GM_getValue('lastCheckedTime',null);
        const savedShopData=GM_getValue('shopData','<div style="color:#999;padding:6px;">No shop data</div>');
        const savedSearchData=GM_getValue('searchData','<div style="color:#999;padding:6px;">No search data</div>');
        const shortTime = lastCheckedTime ? formatShortTime(lastCheckedTime) : 'Never';
        const fullTimeTitle = lastCheckedTime ? new Date(lastCheckedTime).toLocaleString() : '';
        const leftInner = leftContent === 'shop' ? `<div class="section-title"><a href="https://www.torn.com/page.php?sid=crimes#/shoplifting" target="_blank" rel="noopener noreferrer">Shoplifting</a></div><div class="shop_List" style="margin-top:8px;">${savedShopData}</div>` : `<div class="section-title"><a href="https://www.torn.com/page.php?sid=crimes#/searchforcash" target="_blank" rel="noopener noreferrer">Search for Cash</a></div><div class="search_List" style="margin-top:8px;">${savedSearchData}</div>`;
        const toggleLabel = leftContent === 'shop' ? 'search4cash' : 'shoplifting';
        panel.innerHTML=`
            <div class="panel-header">
                <div class="panel-title">
                    <span id="minimizeIcon">${isMinimized ? '▶' : '▼'}</span>
                    <span id="updatedLabel">updated at</span>
                    <span id="lastCheckedHeader" title="${fullTimeTitle}" style="font-weight:600;font-size:11px;opacity:0.85;margin-left:6px;">${shortTime}</span>
                    <span id="statusLine" class="status-line"></span>
                    <button id="toggleSearch">${toggleLabel}</button>
                </div>
                <div class="panel-controls">
                    <button id="apiButton">API</button>
                </div>
            </div>
            <div class="panel-body" style="display:${isMinimized ? 'none' : 'flex'};">
                <div class="left-col">
                    ${leftInner}
                </div>
                <div class="right-col"></div>
            </div>
        `;
        document.body.appendChild(panel);
        const minimizeIconEl = document.getElementById('minimizeIcon');
        if(minimizeIconEl) minimizeIconEl.addEventListener('click', toggleMinimize);
        const toggleSearchBtn = document.getElementById('toggleSearch');
        if(toggleSearchBtn) toggleSearchBtn.addEventListener('click', toggleSearchColumn);
        document.getElementById('apiButton').addEventListener('click',toggleApiPopup);
        window.addEventListener('resize',()=>{ const size=getScreenSize(); const p=document.getElementById('shopPanel'); if(size==='small') p.classList.add('smallScreen'); else p.classList.remove('smallScreen'); repositionApiPopup(); applyFixedWidth(); });
        if(!API_KEY){
            const leftCol = panel.querySelector('.left-col');
            if(leftCol){
                const ribbon = document.createElement('div');
                ribbon.className = 'no-api-ribbon';
                ribbon.innerText = 'No API key';
                leftCol.appendChild(ribbon);
            }
        }
        requestAnimationFrame(()=>{ applyFixedWidth(); });
    }

    function setStatus(text, isError){
        const el=document.getElementById('statusLine');
        if(!el) return;
        el.textContent = text || '';
        el.className = isError ? 'error-line' : 'status-line';
        if(text && !isError){
            setTimeout(()=>{ if(el.textContent===text) el.textContent=''; }, 6000);
        }
    }

    function toggleMinimize(){
        const body=document.querySelector('#shopPanel .panel-body');
        const icon=document.getElementById('minimizeIcon');
        if(!body) return;
        if(body.style.display==='none'){
            body.style.display='flex';
            if(icon) icon.textContent='▼';
            isMinimized=false;
            GM_setValue('isMinimized',false);
            applyFixedWidth();
        } else {
            body.style.display='none';
            if(icon) icon.textContent='▶';
            isMinimized=true;
            GM_setValue('isMinimized',true);
            applyFixedWidth();
        }
    }

    function toggleSearchColumn(){
        leftContent = (leftContent === 'shop') ? 'search' : 'shop';
        GM_setValue('leftContent', leftContent);
        createPanel();
    }

    function createApiPopup(){
        let existing = document.getElementById('apiPopup');
        if(existing) return;
        const popup = document.createElement('div');
        popup.id = 'apiPopup';
        popup.className = 'api-popup';
        popup.style.width = API_POPUP_WIDTH + 'px';
        popup.innerHTML = `
            <div class="row" style="margin-bottom:8px;">
                <input id="apiPopupInput" type="text" maxlength="30" placeholder="Enter Torn API key (max 30 chars)" value="${API_KEY?API_KEY.slice(0,30):''}" />
            </div>
            <div class="row" style="justify-content:flex-end;">
                <button id="apiSaveBtn">Save</button>
                <button id="apiClearBtn">Clear</button>
                <button id="apiCloseBtn">Close</button>
            </div>
        `;
        document.body.appendChild(popup);
        document.getElementById('apiSaveBtn').addEventListener('click', saveApiKey);
        document.getElementById('apiClearBtn').addEventListener('click', clearApiKey);
        document.getElementById('apiCloseBtn').addEventListener('click', closeApiPopup);
    }

    function toggleApiPopup(){
        createApiPopup();
        const popup = document.getElementById('apiPopup');
        if(!popup) return;
        if(popup.style.display === 'block'){ closeApiPopup(); }
        else{ positionApiPopup(); popup.style.display = 'block'; const input = document.getElementById('apiPopupInput'); if(input){ input.focus(); input.select(); } }
    }

    function positionApiPopup(){
        const popup = document.getElementById('apiPopup');
        const panel = document.getElementById('shopPanel');
        if(!popup || !panel) return;
        const header = panel.querySelector('.panel-header');
        const rect = header.getBoundingClientRect();
        const popupWidth = API_POPUP_WIDTH;
        let top = Math.max(8, rect.bottom + 6);
        let left = Math.min(window.innerWidth - popupWidth - 8, rect.right - popupWidth);
        left = left - 20;
        if(left < 8) left = 8;
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }

    function repositionApiPopup(){
        const popup = document.getElementById('apiPopup');
        if(popup && popup.style.display === 'block') positionApiPopup();
    }

    function closeApiPopup(){
        const popup = document.getElementById('apiPopup');
        if(!popup) return;
        popup.style.display = 'none';
    }

    function saveApiKey(){
        const input = document.getElementById('apiPopupInput');
        if(!input) return;
        let key = input.value.trim();
        if(!key){ setStatus('API key empty', true); return; }
        if(key.length > 30) key = key.slice(0,30);
        API_KEY = key;
        GM_setValue('API_KEY', API_KEY);
        setStatus(API_KEY.length === 30 ? 'API key saved (truncated to 30 chars)' : 'API key saved', false);
        closeApiPopup();
        createPanel();
        startPolling(true);
    }

    function clearApiKey(){
        API_KEY = '';
        GM_deleteValue('API_KEY');
        const input = document.getElementById('apiPopupInput');
        if(input) input.value = '';
        setStatus('API key cleared', false);
        closeApiPopup();
        createPanel();
        stopPolling();
    }

    async function fetchAllData(){
        if(!API_KEY) return;
        try{
            const r = await fetch(`https://api.torn.com/torn/?selections=shoplifting,searchforcash&key=${API_KEY}`);
            const apiData = await r.json();
            if(apiData.error){ setStatus(`API error ${apiData.error.code}: ${apiData.error.error}`, true); return }
            GM_setValue('lastCheckedTime', Date.now());
            const shops = extractShopsData(apiData.shoplifting);
            const search = apiData.searchforcash || {};
            const changedShops = detectSecurityChanges(shops);
            GM_setValue('previousShopsData', shops);
            if(changedShops && changedShops.length){ changedShops.forEach(s=>blinkShopCard(s)); setStatus('Changes detected', false) }
            displayShops(shops);
            displaySearchData(search);
            detectSearchThresholdsAndBlink(search);
            requestAnimationFrame(()=>{ applyFixedWidth(); });
        } catch(e){
            console.error(e);
            setStatus('Fetch data failed: ' + (e.message||e), true);
        }
    }

    function startPolling(runImmediate){
        if(!API_KEY) return;
        if(window._tornCrimeInterval) return;
        if(runImmediate) fetchAllData();
        window._tornCrimeInterval = setInterval(fetchAllData, CHECK_INTERVAL);
    }

    function stopPolling(){
        if(window._tornCrimeInterval){
            clearInterval(window._tornCrimeInterval);
            window._tornCrimeInterval = null;
        }
    }

    function extractShopsData(shoplifting){
        if(!shoplifting) return {};
        return {
            "Sally's Sweet Shop": shoplifting.sallys_sweet_shop || [],
            "Bits 'n' Bobs": shoplifting.Bits_n_bobs || [],
            "TC Clothing": shoplifting.tc_clothing || [],
            "Super Store": shoplifting.super_store || [],
            "Pharmacy": shoplifting.pharmacy || [],
            "Cyber Force": shoplifting.cyber_force || [],
            "Jewelry Store": shoplifting.jewelry_store || [],
            "Big Al's Gun Shop": shoplifting.big_als || []
        };
    }

    function detectSecurityChanges(currentShops){
        const prev = GM_getValue('previousShopsData', {}) || {};
        const changedShops = [];
        Object.keys(currentShops).forEach(shopName=>{
            const curArr = currentShops[shopName] || [];
            const prevArr = prev[shopName] || [];
            curArr.forEach((sec, idx)=>{
                const prevSec = prevArr[idx] || {};
                if((!prevSec.disabled || prevSec.disabled === false) && sec.disabled){
                    if(!changedShops.includes(shopName)) changedShops.push(shopName);
                }
            });
        });
        return changedShops;
    }

    function blinkShopCard(shopName){
        const cards = document.querySelectorAll('.shop-card');
        for(const card of cards){
            const nameEl = card.querySelector('.shop-name');
            if(!nameEl) continue;
            if(nameEl.textContent.trim() === shopName){
                card.classList.remove('blink-alert');
                void card.offsetWidth;
                card.classList.add('blink-alert');
                setTimeout(()=>card.classList.remove('blink-alert'),1000);
                break;
            }
        }
    }

    function blinkSearchEntry(searchKeyOrTitle){
        const entries = document.querySelectorAll('.search-entry');
        for(const e of entries){
            const title = e.getAttribute('title') || '';
            const label = e.querySelector('.search-title')?.textContent || '';
            if(title.includes(searchKeyOrTitle) || label.includes(searchKeyOrTitle)){
                e.classList.remove('blink-alert');
                void e.offsetWidth;
                e.classList.add('blink-alert');
                setTimeout(()=>e.classList.remove('blink-alert'),1000);
                break;
            }
        }
    }

    function categorizeEntries(entries){
        const cameras = [];
        const guards = [];
        entries.forEach(e=>{
            const t = (e.title || '').toLowerCase();
            if(/cam|camera|cctv|video/.test(t)) cameras.push(e);
            else if(/guard|checkpoint|guards|security guard|security/.test(t)) guards.push(e);
            else{
                if(t.includes('cam')) cameras.push(e);
                else if(t.includes('guard')||t.includes('check')) guards.push(e);
            }
        });
        return {cameras,guards};
    }

    function displayShops(shops){
        let shopDisplay = '';
        Object.keys(shops).forEach(shopName=>{
            const entries = shops[shopName] || [];
            const {cameras, guards} = categorizeEntries(entries);
            const camCount = cameras.length;
            const camDisabledCount = cameras.filter(c=>c.disabled).length;
            let camState='N/A', camBg='#666';
            if(camCount===0){ camState='N/A'; camBg='#666' }
            else if(camDisabledCount===camCount){ camState='Off'; camBg='#b33' }
            else if(camDisabledCount>0){ camState='Partial'; camBg='#b8860b' }
            else{ camState='On'; camBg='#228b22' }
            const guardCount = guards.length;
            const guardDisabledCount = guards.filter(g=>g.disabled).length;
            let guardState='N/A', guardBg='#666';
            if(guardCount===0){ guardState='N/A'; guardBg='#666' }
            else if(guardDisabledCount===guardCount){ guardState='Off'; guardBg='#b33' }
            else if(guardDisabledCount>0){ guardState='Partial'; guardBg='#b8860b' }
            else{ guardState='On'; guardBg='#228b22' }
            const camTitles = cameras.map(c=>c.title||'Camera').join(', ');
            const guardTitles = guards.map(g=>g.title||'Guard').join(', ');
            const camTooltip = camCount>0?`${camCount} total, ${camDisabledCount} disabled — ${camTitles}`:'No cameras detected';
            const guardTooltip = guardCount>0?`${guardCount} total, ${guardDisabledCount} disabled — ${guardTitles}`:'No guards detected';
            const cameraPill = `<div class="pill camera-pill" title="${escapeHtml(camTooltip)}" style="background:${escapeHtml(camBg)};"><span class="name">Cameras</span><span class="state">${camState}</span></div>`;
            const guardPill = `<div class="pill guard-pill" title="${escapeHtml(guardTooltip)}" style="background:${escapeHtml(guardBg)};"><span class="name">Guards</span><span class="state">${guardState}</span></div>`;
            let pillsHtml = guardCount>0 ? guardPill : `<div class="pill missing-guard" title="Guards not present"><span class="name">Guards</span></div>`;
            if (NO_GUARDS_SHOPS.includes(shopName)) pillsHtml = '';
            shopDisplay += `<div class="shop-card"><div class="shop-name" title="${escapeHtml(shopName)}">${escapeHtml(shopName)}</div><div class="camera-col">${cameraPill}</div><div class="pills">${pillsHtml}</div></div>`;
        });
        GM_setValue('shopData', shopDisplay);
        const el = document.querySelector('.shop_List');
        if(el) el.innerHTML = shopDisplay || '<div style="color:#999;padding:6px;">No shop data</div>';
        const lastCheckedEl = document.getElementById('lastCheckedHeader');
        if(lastCheckedEl) {
            const ts = GM_getValue('lastCheckedTime') || Date.now();
            lastCheckedEl.innerText = formatShortTime(ts);
            lastCheckedEl.title = new Date(ts).toLocaleString();
        }
    }

    function displaySearchData(searchData){
        let searchDisplay = '';
        const entries = Object.entries(searchData || {});
        if(entries.length===0){
            searchDisplay = '<div style="color:#999;padding:6px;">No search data</div>';
        } else {
            const preferred = ['trash','subway','junkyard','beach','cemetery','fountain'];
            const remaining = new Map(entries);
            const ordered = [];
            for(const p of preferred){
                for(const [k,v] of remaining){
                    const title = (v.title || k).toLowerCase();
                    if(title.includes(p) || k.toLowerCase().includes(p)){
                        ordered.push([k,v]);
                        remaining.delete(k);
                        break;
                    }
                }
            }
            for(const [k,v] of remaining) ordered.push([k,v]);
            ordered.forEach(([key,data])=>{
                const percentage = Math.round((data.percentage ?? 0) * 10) / 10;
                const color = percentToColor(percentage);
                const title = data.title || key;
                const loc = getLocationName(key, title);
                searchDisplay += `<div class="search-entry" title="${escapeHtml(title)}" style="background:${escapeHtml(color)};"><div class="search-title"><span class="loc">${escapeHtml(loc)}</span>${escapeHtml(title)}</div><div class="percent">${percentage}%</div></div>`;
            });
        }
        GM_setValue('searchData', searchDisplay);
        const el = document.querySelector('.search_List');
        if(el) el.innerHTML = searchDisplay;
    }

    function detectSearchThresholdsAndBlink(currentSearchData){
        const prev = GM_getValue('previousSearchData', {}) || {};
        const toBlink = [];
        Object.keys(currentSearchData || {}).forEach(k=>{
            const cur = currentSearchData[k]?.percentage ?? 0;
            const prevVal = prev[k]?.percentage ?? 0;
            if(cur > 80 && prevVal <= 80){
                const title = currentSearchData[k].title || k;
                toBlink.push(title);
            }
        });
        toBlink.forEach(t => blinkSearchEntry(t));
        GM_setValue('previousSearchData', currentSearchData);
    }

    createPanel();
    createApiPopup();

    if(API_KEY){
        startPolling(true);
    }

})();