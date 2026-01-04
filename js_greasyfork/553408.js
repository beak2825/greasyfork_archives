// ==UserScript==
// @name         allySync
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Sincroniza y muestra tropas por ciudad (Grepolis) con token compartible
// @author       You
// @match        https://*.grepolis.com/game/*
// @exclude      view-source://*
// @exclude      https://classic.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553408/allySync.user.js
// @updateURL https://update.greasyfork.org/scripts/553408/allySync.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const uw = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const playerId = uw.Game?.player_id;
    const worldId = uw.Game?.world_id;
    const apiUrl = 'https://allySync.grepo.win/api/';

    const STATE = {
        info: null,
        cacheTime: 0,
        syncing: false,
        token: null,
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const debounce = (fn, t=400) => { let h; return (...a)=>{ clearTimeout(h); h=setTimeout(()=>fn(...a),t); }; };
    const deepEqual = (a,b)=>JSON.stringify(a)===JSON.stringify(b);

    class Api {
        constructor(baseUrl, worldId, token, playerId) {
            this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
            this.worldId = worldId;
            this.token = token;
            this.playerId = playerId;
        }
        _qs(o){ return new URLSearchParams(o).toString(); }
        async _fetchJSON(url, opt={}){ const r=await fetch(url,opt); if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); }

        async newToken(){
            return this._fetchJSON(`${this.baseUrl}new_token`, { method:'POST' });
        }
        async getDataWorld(){
            const url = `${this.baseUrl}get_data?${this._qs({ worldId:this.worldId, token:this.token })}`;
            return this._fetchJSON(url);
        }
        async getUpdateTime(){
            const url = `${this.baseUrl}get_updateTime?${this._qs({ worldId:this.worldId, token:this.token })}`;
            return this._fetchJSON(url);
        }
        async updateData(payload){
            const url = `${this.baseUrl}update_data?${this._qs({ worldId:this.worldId, token:this.token, playerId:this.playerId })}`;
            return this._fetchJSON(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
        }
    }

    let api = null;

    // ========== TOKEN ==========
    async function ensureToken(){
        let tok = GM_getValue('allysync_token', null);
        if (!tok) {
            // pide token al server y guárdalo
            const tmp = new Api(apiUrl, worldId, '', playerId);
            const resp = await tmp.newToken();
            tok = resp?.token;
            if (!tok) throw new Error('No se pudo obtener token del servidor');
            GM_setValue('allysync_token', tok);
        }
        STATE.token = tok;
        api = new Api(apiUrl, worldId, tok, playerId);
    }

    // ========== CACHE ==========
    function loadCache(){
        STATE.cacheTime = GM_getValue(`lastUpdatedAt:${worldId}:${STATE.token}`, 0);
        const data = GM_getValue(`cachedData:${worldId}:${STATE.token}`, null);
        if (data && typeof data === 'object') STATE.info = data;
    }
    function saveCache(data, serverTime){
        GM_setValue(`cachedData:${worldId}:${STATE.token}`, data);
        GM_setValue(`lastUpdatedAt:${worldId}:${STATE.token}`, serverTime);
        STATE.info = data;
        STATE.cacheTime = serverTime;
    }

    // ========== CLIENT DATA ==========
    async function waitUntil(pred, {tries=200, delay=50}={}) {
        for(let i=0;i<tries;i++){ if (await pred()) return true; await sleep(delay); }
        return false;
    }

    async function getMyTownIds(){
        const ok = await waitUntil(()=>!!uw.MM?.getModels?.().TownIdList?.[playerId]?.attributes?.town_ids?.length);
        if (!ok) return [];
        return uw.MM.getModels().TownIdList[playerId].attributes.town_ids.slice();
    }

    async function buildClientData(){
        const toids = await getMyTownIds();
        const out = {};
        for (const tid of toids){
            const town = uw.ITowns?.towns?.[tid];
            if (!town) continue;
            out[tid] = { ...(town.units() || {}) };
        }
        return out;
    }

    // ========== PULL WORLD ==========
    async function pullWorldIfNeeded(){
        let serverTime = 0;
        try { serverTime = await api.getUpdateTime(); } catch(e){ console.warn('[Api] get_updateTime falló', e); return STATE.info; }
        const sKey = String(serverTime), cKey = String(STATE.cacheTime);
        if (!STATE.info || sKey !== cKey){
            try{
                const worldData = await api.getDataWorld();
                if (worldData && typeof worldData==='object'){
                    saveCache(worldData, serverTime);
                    console.debug('[Cache] world data actualizado');
                }
            }catch(e){ console.warn('[Api] get_data falló', e); }
        }
        return STATE.info;
    }

    // ========== PUSH MINE ==========
    async function syncMyCities(){
        if (STATE.syncing) return;
        STATE.syncing = true;
        try{
            const local = await buildClientData();
            const world = STATE.info || await api.getDataWorld().catch(()=> ({}));

            const toUpdate = {};
            for (const [tid, units] of Object.entries(local)){
                if (!world[tid] || !deepEqual(world[tid], units)){
                    toUpdate[tid] = units;
                }
            }
            if (Object.keys(toUpdate).length){
                await api.updateData(toUpdate);
                // Optimista: fusiono local en STATE y sello tiempo local
                STATE.info = { ...(STATE.info || {}), ...local };
                GM_setValue(`cachedData:${worldId}:${STATE.token}`, STATE.info);
                const now = Date.now();
                GM_setValue(`lastUpdatedAt:${worldId}:${STATE.token}`, now);
                STATE.cacheTime = now;
                rerenderAll();
                console.debug(`[Sync] Subidas ${Object.keys(toUpdate).length} ciudades.`);
            } else {
                console.debug('[Sync] Sin cambios que subir.');
            }
        }catch(e){
            console.warn('[Sync] Error', e);
        }finally{
            STATE.syncing = false;
        }
    }
    const syncMyCitiesDebounced = debounce(syncMyCities, 600);

    // ========== AUTOSYNC ==========
    function startAutoSync(ms=60000){
        setInterval(async ()=>{
            const before = STATE.info ? JSON.stringify(STATE.info) : '';
            await pullWorldIfNeeded();
            const after = STATE.info ? JSON.stringify(STATE.info) : '';
            if (before !== after) rerenderAll();
        }, ms);
    }

    // ========== RENDER ==========
    function rerenderAll(){
        console.debug('[rerenderAll] start');
        try {
            renderStrategic();
            console.debug('[rerenderAll] strategic ok');
            renderIsland();
            console.debug('[rerenderAll] island ok');
            tryUpdateOpenTownInfo();
            console.debug('[rerenderAll] towninfo ok');
        } catch(e) {
            console.warn('[rerenderAll] error', e);
        }
    }

    function renderStrategic(){
        const data = STATE.info; if (!data) return;
        for (const [toid, units] of Object.entries(data)){
            const miniEl = uw.document.getElementById('mini_t'+toid);
            if (!miniEl) continue;
            const bg = miniEl.getAttribute('style') || '';
            if (bg.includes('dio-david1327.github.io')) continue;
            if (miniEl.classList.contains(`player_${playerId}`)) continue;

            if (!miniEl.dataset.customized){
                miniEl.dataset.customized = 'true';
                miniEl.style.fontSize='14px';
                miniEl.style.textShadow='0 0 2px #000, 0 0 4px #000, 0 0 8px #42f595, 0 0 12px #42f595';
                miniEl.style.fontWeight='bold';
                miniEl.style.zIndex=10000;
                miniEl.innerHTML='⬤';

                const tooltip = uw.document.createElement('div');
                tooltip.className='mini_troop_tooltip';
                tooltip.style.cssText=
                    'display:none;position:absolute;top:-9999px;left:-9999px;background:#f9e4b0;border:1px solid #d1b37f;color:#000;font-size:11px;padding:6px 8px;border-radius:4px;box-shadow:2px 2px 6px rgba(0,0,0,0.4);min-width:120px;z-index:10001;';
                uw.document.body.appendChild(tooltip);
                miniEl._allySyncTooltip = tooltip;

                miniEl.addEventListener('mouseenter', ()=>{
                    fillTooltip(tooltip, STATE.info[toid] || {});
                    const rect = miniEl.getBoundingClientRect();
                    tooltip.style.display='block';
                    tooltip.style.left = rect.left + rect.width/2 + 'px';
                    tooltip.style.top = rect.top - 15 + 'px';
                    tooltip.style.transform='translate(-50%,-100%)';
                });
                miniEl.addEventListener('mouseleave', ()=>{ tooltip.style.display='none'; });
            } else {
                // si ya existe, se actualiza on hover (arriba)
            }
        }

        function fillTooltip(tooltip, units){
            tooltip.innerHTML='';
            const title = uw.document.createElement('div');
            title.textContent='Unidades de la ciudad';
            title.style.cssText='font-weight:bold;font-size:12px;text-align:center;margin-bottom:4px;border-bottom:1px solid #c0a060;';
            tooltip.appendChild(title);

            const active = Object.entries(units||{}).filter(([,q])=>q>0);
            const n = active.length || 1, cols = Math.ceil(Math.sqrt(n));
            const grid = uw.document.createElement('div');
            grid.style.cssText=`display:grid;grid-template-columns:repeat(${cols},auto);gap:3px;justify-content:center;align-items:center;`;

            for (const [name, qty] of active){
                const d = uw.document.createElement('div');
                d.className=`unit_icon25x25 ${name}`;
                d.style.cssText='overflow:unset;font-size:10px;text-shadow:1px 1px 3px #000;color:#fff;font-weight:700;border:1px solid #626262;padding:10px 0 0;line-height:13px;height:15px;width:25px;text-align:right;';
                d.textContent=qty; grid.appendChild(d);
            }
            tooltip.appendChild(grid);
        }
    }

    function renderIsland(){
        const towns = STATE.info;
        if (!towns) return;

        console.debug('[renderIsland] start');

        // 1️⃣ Render inicial de lo visible
        renderVisibleTowns();

        // 2️⃣ Configura un observer robusto
        const root = uw.document.body;
        if (window.__allySyncIslandObs) window.__allySyncIslandObs.disconnect();

        const obs = new MutationObserver(mutations => {
            let touched = false;

            for (const m of mutations) {
                for (const node of m.addedNodes || []) {
                    if (node.nodeType !== 1) continue;

                    // Si el nodo es una ciudad
                    if (node.id?.startsWith('town_')) {
                        const toid = node.id.slice(5);
                        addBox(node, towns[toid]);
                        touched = true;
                    }

                    // Si tiene ciudades dentro
                    const inner = node.querySelectorAll?.('[id^="town_"]');
                    if (inner && inner.length) {
                        inner.forEach(el => {
                            const toid = el.id.slice(5);
                            addBox(el, towns[toid]);
                            touched = true;
                        });
                    }
                }
            }

            // Si nada cambió, pequeño repaso
            if (!touched) renderVisibleTowns(true);
        });

        obs.observe(root, { childList:true, subtree:true });
        window.__allySyncIslandObs = obs;

        // ---- Helpers ----
        function renderVisibleTowns(onlyMissing = false) {
            uw.document.querySelectorAll('[id^="town_"]').forEach(el => {
                const toid = el.id.slice(5);
                const units = towns[toid];
                if (!units) return;
                addBox(el, units, onlyMissing);
            });
        }

        function addBox(townEl, units, onlyMissing = false){
            if (!units || typeof units !== 'object') return;

            const existing = townEl.querySelector('.troop_info_box');
            if (existing){
                if (onlyMissing) return;
                existing.remove();
            }

            const active = Object.entries(units).filter(([,q])=>q>0);
            if (!active.length) return;

            let top=null, val=0;
            for (const [n,q] of active){
                if (n==='small_transporter'||n==='big_transporter') continue;
                const pop = uw.GameData?.units?.[n]?.population || 1;
                const v = pop*q;
                if (v>val){ val=v; top=[n,q]; }
            }
            if (!top) return;

            const cols = Math.ceil(Math.sqrt(active.length));
            const box = uw.document.createElement('div');
            box.className='troop_info_box';
            box.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-60%,-30%);background:rgba(0,0,0,0.6);border:1px solid #f00;border-radius:4px;padding:0;width:22px;height:22px;display:flex;justify-content:center;align-items:center;z-index:9999;pointer-events:auto;cursor:pointer;transition:all .25s ease-in-out;overflow:hidden;';
            const topDiv = uw.document.createElement('div');
            topDiv.className=`unit_icon25x25 ${top[0]}`;
            topDiv.style.cssText='position:absolute;left:50%;transform:translateX(-50%) scale(0.8);text-shadow:1px 1px 3px #000;color:#fff;height:25px;text-align:center;overflow:unset;';
            box.appendChild(topDiv);

            const grid = uw.document.createElement('div');
            grid.style.cssText=`display:grid;grid-template-columns:repeat(${cols},auto);gap:3px;justify-content:center;align-items:center;opacity:0;pointer-events:none;transition:opacity .2s ease-in-out;`;
            for (const [n,q] of active){
                const d=uw.document.createElement('div');
                d.className=`unit_icon25x25 ${n}`;
                d.style.cssText='overflow:unset;font-size:10px;text-shadow:1px 1px 3px #000;color:#fff;font-weight:700;border:1px solid #626262;padding:10px 0 0;line-height:13px;height:15px;text-align:right;margin-right:2px;';
                d.textContent=q;
                grid.appendChild(d);
            }
            box.appendChild(grid);

            box.addEventListener('mouseenter', ()=>{
                topDiv.style.display='none';
                grid.style.opacity='1';
                grid.style.pointerEvents='auto';
                Object.assign(box.style,{
                    width:'auto',height:'auto',padding:'6px',display:'grid',
                    gridTemplateColumns:`repeat(${cols},auto)`,overflow:'visible'
                });
            });
            box.addEventListener('mouseleave', ()=>{
                grid.style.opacity='0';
                grid.style.pointerEvents='none';
                topDiv.style.display='block';
                Object.assign(box.style,{
                    display:'flex',padding:'0px',width:'22px',height:'22px',overflow:'hidden'
                });
            });

            const pos = uw.getComputedStyle(townEl).position;
            if (pos==='static'||!pos) townEl.style.position='relative';
            townEl.appendChild(box);
        }
    }

    function tryUpdateOpenTownInfo(){
        const boxes = uw.document.querySelectorAll('[class^="info_tab_content_"]');
        if (!boxes?.length) return;
        boxes.forEach(box=>{
            const m = box.className.match(/info_tab_content_(\d+)/);
            if (!m) return;
            renderTownInfo(m[1]);
        });
    }

    function renderTownInfo(toid){
        if (!STATE.info) return;
        const wnd = uw.document.querySelector('.info_tab_content_'+toid); if (!wnd) return;
        const units = STATE.info[toid] || {};
        const wrapper = uw.document.createElement('div');
        wrapper.className='game_inner_box';
        wrapper.style.marginTop='8px';
        wrapper.innerHTML = `
      <div class="game_border">
        <div class="game_border_top"></div>
        <div class="game_border_bottom"></div>
        <div class="game_border_left"></div>
        <div class="game_border_right"></div>
        <div class="game_border_corner corner1"></div>
        <div class="game_border_corner corner2"></div>
        <div class="game_border_corner corner3"></div>
        <div class="game_border_corner corner4"></div>
        <div class="game_header bold">Tropas en esta ciudad</div>
        <ul class="game_list"></ul>
      </div>`;
        const list = wrapper.querySelector('.game_list');
        const li = uw.document.createElement('li');
        li.className='even';
        li.style.cssText='display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap;gap:4px;padding:4px 8px;min-height:38px;';
        for (const [n,q] of Object.entries(units)){
            const d=uw.document.createElement('div');
            d.className=`unit_icon25x25 ${n}`;
            d.style.cssText='overflow:unset;font-size:10px;text-shadow:1px 1px 3px #000;color:#fff;font-weight:700;border:1px solid #626262;padding:10px 0 0;line-height:13px;height:15px;text-align:right;margin-right:2px;';
            d.textContent=q; li.appendChild(d);
        }
        list.appendChild(li);
        wnd.appendChild(wrapper);
        const dialog = wnd.closest('.ui-dialog');
        const gpFrame = dialog?.querySelector('.gpwindow_frame');
        const gpContent= dialog?.querySelector('.gpwindow_content');
        wnd.style.height='auto'; wnd.style.minHeight='0';
        if (gpContent) gpContent.style.height='auto';
        if (gpFrame) gpFrame.style.height='auto';
        if (dialog) dialog.style.height='auto';
        const total = wnd.scrollHeight + 20;
        if (gpFrame) gpFrame.style.minHeight = `${total}px`;
        if (dialog) dialog.style.minHeight = `${total+50}px`;
    }

    // ========== UI: botón y diálogo token ==========
    function changeIcon(){
        const btn = uw.document.querySelector('.btn_grepo_score');
        if (!btn) return void setTimeout(changeIcon, 200);
        btn.removeAttribute('onclick');
        if (uw.$) uw.$(btn).off('click');
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
        Object.assign(clone.style, {
            backgroundImage:'url("https://i.imgur.com/rZr3N8n.png")',
            backgroundPosition:'center', backgroundRepeat:'no-repeat', backgroundSize:'28px 28px',
            cursor:'pointer'
        });
        clone.addEventListener('click', (e)=>{ e.preventDefault(); openCfg(); });
    }

    function openCfg(){
        // evita múltiples
        const existing = Array.from(document.querySelectorAll('.ui-dialog-title'))
        .some(t => t.textContent.trim()==='AllySync');
        if (existing) return;

        const wnd = uw.Layout.wnd.Create(uw.Layout.wnd.TYPE_DIALOG, "AllySync", { width: "520", height: "200" });
        // localiza contenedor
        let dialog;
        Array.from(document.querySelectorAll('.ui-dialog-title')).forEach(t=>{
            if (t.textContent.trim()==='AllySync') dialog = t.closest('.ui-dialog');
        });
        if (!dialog) return;

        const content = dialog.querySelector('.gpwindow_content') || dialog;
        const box = document.createElement('div');
        box.style.padding='12px';
        box.innerHTML = `
      <div style="margin-bottom:8px;font-weight:bold;">Token de sincronización</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
        <input type="text" id="allysync_token_input" style="flex:1;padding:6px;" value="${STATE.token || ''}" />
        <button id="allysync_copy" class="button_new">Copiar</button>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button id="allysync_save" class="button_new">Guardar y recargar</button>
        <button id="allysync_new"  class="button_new">Generar nuevo</button>
      </div>
      <div style="margin-top:10px;color:#888;font-size:12px;">
        Comparte este token con tu equipo: todos los que lo usen verán y subirán las tropas al mismo “grupo”.
      </div>
    `;
        content.appendChild(box);

        const $ = (sel)=>box.querySelector(sel);
        $('#allysync_copy').onclick = ()=> {
            const v = $('#allysync_token_input').value.trim();
            navigator.clipboard.writeText(v).catch(()=>{});
        };
        $('#allysync_save').onclick = ()=> {
            const v = $('#allysync_token_input').value.trim();
            if (!v) return;
            GM_setValue('allysync_token', v);
            location.reload();
        };
        $('#allysync_new').onclick = async ()=> {
            try{
                const resp = await api.newToken();
                const t = resp?.token;
                if (t){
                    $('#allysync_token_input').value = t;
                }
            }catch(e){ console.warn('No se pudo generar token', e); }
        };
    }

    // ========== OBSERVERS ==========
    function observeMovements(){
        console.debug('[observerMovements] iniciado');
        const hooked = new Set();

        function hookModel(m){
            if (!m || !m.id || hooked.has(m.id)) return;
            hooked.add(m.id);
            m.on('destroy', ()=>{
                console.debug('[observerMovements] movimiento destruido:', m.id);
                syncMyCitiesDebounced();
            });
        }

        function safeScan(){
            const collection = uw.MM?.getCollections?.().MovementsUnits;
            if (!collection) return;

            const models = collection.getAll?.() || Object.values(collection);
            for (const m of models){
                hookModel(m);
            }
        }

        // solo escanea cada 3 segundos, no cada 1
        setInterval(safeScan, 3000);
    }
    function observeViews(){
        uw.$(uw.document).ajaxComplete(function (e, xhr, opt) {
            const parts=(opt.url||'').split('?'); const filename=parts[0]||''; const qs=parts[1]||'';
            if (filename !== '/game/town_info') return;
            const seg = qs.split(/&/)[1] || ''; const action = seg.substr(7);
            if (action !== 'info') return;
            try{
                const params = new URLSearchParams(qs);
                const rdata = JSON.parse(decodeURIComponent(params.get('json')));
                renderTownInfo(rdata.id);
            }catch{}
        });

        uw.$.Observer(uw.GameEvents.ui.layout_mode.island_view.activate)
            .subscribe(['allysync_island'], ()=>{ renderIsland(); });

        uw.$.Observer(uw.GameEvents.map.zoom_out)
            .subscribe(['allysync_zoom_out'], ()=>{
            uw.$.Observer(uw.GameEvents.minimap.load_chunks)
                .subscribe(['allysync_chunks'], ()=>{ renderStrategic(); });
            uw.$.Observer(uw.GameEvents.map.zoom_in)
                .subscribe(['allysync_zoom_in'], ()=>{ renderIsland(); });
        });
    }

    // ========== MAIN ==========
    async function main(){
        await ensureToken();
        loadCache();
        await pullWorldIfNeeded(); // pull por token/mundo
        await syncMyCities(); // push si hay dif

        if (!STATE.info) STATE.info = {};
        changeIcon();
        rerenderAll();
        observeViews();
        observeMovements();
        startAutoSync(60000);
    }

    (async ()=>{
        const ready = await waitUntil(()=>!!uw.Game && !!uw.MM && !!uw.ITowns);
        if (!ready){ console.warn('[Init] Grepolis no listo.'); return; }
        main();
    })();
})();