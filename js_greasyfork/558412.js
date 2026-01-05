// ==UserScript==
// @name         Torn Comp Targets + FFScouter BS (stable targets + min level)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Random stable attack targets + BS estimation + live status + min/max level filter + reroll button + profile BS display.
// @author       ChatGPT
// @match        https://www.torn.com/page.php?sid=competition*
// @match        https://www.torn.com/profiles.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      ffscouter.com
// @downloadURL https://update.greasyfork.org/scripts/558412/Torn%20Comp%20Targets%20%2B%20FFScouter%20BS%20%28stable%20targets%20%2B%20min%20level%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558412/Torn%20Comp%20Targets%20%2B%20FFScouter%20BS%20%28stable%20targets%20%2B%20min%20level%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- CONFIG ----------
    const TARGET_COUNT = 5;
    const SCAN_INTERVAL_MS = 7000;
    const DEFAULT_MAX_LEVEL = 50;
    const DEFAULT_MIN_LEVEL = 1;

    const FF_BASE_URL = 'https://ffscouter.com';
    const FF_API_KEY_STORAGE = 'ffscouter-limited-key';
    const FF_CACHE_PREFIX = 'ffscouter-bs-cache-';
    const FF_CACHE_TTL_MS = 60 * 60 * 1000;

    // ---------- STATE ----------
    let maxLevel = DEFAULT_MAX_LEVEL;
    let minLevel = DEFAULT_MIN_LEVEL;
    let panelInitialized = false;
    let currentTargets = [];
    let apiPromptShown = false;

    // ---------- UTILITIES ----------
    function isCompetitionPage() {
        return location.href.includes('sid=competition');
    }
    function isOnProfilePage() {
        return /profiles\.php\?XID=\d+/.test(location.href);
    }
    function formatShortNumber(num) {
        if (typeof num !== 'number' || !isFinite(num)) return '?';
        const abs = Math.abs(num);
        if (abs < 1000) return String(Math.round(num));
        if (abs < 1_000_000) return (num/1_000).toFixed(abs>=10_000?0:1).replace(/\.0$/,'')+'k';
        if (abs < 1_000_000_000) return (num/1_000_000).toFixed(abs>=10_000_000?0:1).replace(/\.0$/,'')+'m';
        return (num/1_000_000_000).toFixed(abs>=10_000_000_000?0:1).replace(/\.0$/,'')+'b';
    }
    function buildAttackUrl(id) {
        return `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;
    }

    function getApiKey() {
        try { return GM_getValue(FF_API_KEY_STORAGE,null) } catch(e){return null}
    }
    function setApiKey(key) { GM_setValue(FF_API_KEY_STORAGE,key||'') }
    function getCacheKey(playerId){ return FF_CACHE_PREFIX+String(playerId) }
    function getCachedStats(playerId){
        try {
            const raw = GM_getValue(getCacheKey(playerId),null);
            if (!raw) return null;
            const obj = JSON.parse(raw);
            if (!obj || !obj.expiry || obj.expiry < Date.now()) return null;
            return obj;
        } catch(e){ return null }
    }
    function setCachedStats(playerId,data){
        GM_setValue(getCacheKey(playerId),JSON.stringify({
            bs_estimate:data.bs_estimate||null,
            last_updated:data.last_updated||null,
            expiry:Date.now()+FF_CACHE_TTL_MS
        }))
    }

    // ---------- FF API ----------
    function fetchStatsForPlayers(playerIds,onDone){
        const apiKey = getApiKey();
        if (!apiKey){ onDone&&onDone(); return }
        const unique = Array.from(new Set(playerIds.map(String)));
        const missing = unique.filter(id=>!getCachedStats(id));
        if (missing.length===0){ onDone&&onDone(); return }

        const url = `${FF_BASE_URL}/api/v1/get-stats?key=${encodeURIComponent(apiKey)}&targets=${missing.join(',')}`;
        GM_xmlhttpRequest({
            method:'GET',
            url,
            onload:(resp)=>{
                try {
                    if(resp.status===200){
                        const data = JSON.parse(resp.responseText);
                        if(Array.isArray(data)){
                            for(const entry of data){
                                if(entry && entry.player_id){
                                    setCachedStats(entry.player_id,entry)
                                }
                            }
                        }
                    }
                }catch(e){}
                onDone&&onDone();
            }
        })
    }
    function getFormattedBs(playerId){
        const cache = getCachedStats(playerId);
        if(!cache||!cache.bs_estimate) return null;
        return formatShortNumber(cache.bs_estimate);
    }

    // ---------- PANEL ----------
    function createPanel(){
        if(panelInitialized) return;
        panelInitialized=true;

        const panel = document.createElement('div');
        panel.id='compff-panel';
        Object.assign(panel.style,{
            position:'fixed',
            left:'50%',
            bottom:'40px',
            transform:'translateX(-50%)',
            background:'rgba(0,0,0,0.85)',
            color:'#fff',
            padding:'8px 12px',
            borderRadius:'10px',
            fontFamily:'Arial,sans-serif',
            fontSize:'12px',
            zIndex:999998,
            minWidth:'300px',
            boxShadow:'0 0 10px rgba(0,0,0,0.6)'
        });

        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:4px;">Comp Targets (FFScouter BS)</div>

            <div style="margin-bottom:6px;display:flex;gap:6px;align-items:center;">
                <span>Min:</span>
                <input id="compff-minlevel" type="number" value="${DEFAULT_MIN_LEVEL}" style="width:50px;font-size:11px;">
                <span>Max:</span>
                <input id="compff-maxlevel" type="number" value="${DEFAULT_MAX_LEVEL}" style="width:50px;font-size:11px;">
                <button id="compff-refresh" style="margin-left:auto;border:none;background:#444;color:#fff;border-radius:4px;padding:2px 6px;cursor:pointer;font-size:11px;">
                    New targets
                </button>
            </div>

            <div id="compff-targets" style="max-height:240px;overflow-y:auto;"></div>
        `;
        document.body.appendChild(panel);

        document.getElementById('compff-minlevel').addEventListener('change',()=>{
            const val = parseInt(event.target.value,10);
            if(!isNaN(val)&&val>0){
                minLevel=val;
                if(minLevel>maxLevel) maxLevel=minLevel;
                rerollTargetsFromCurrentTable(true);
            }
        });
        document.getElementById('compff-maxlevel').addEventListener('change',()=>{
            const val = parseInt(event.target.value,10);
            if(!isNaN(val)&&val>0){
                maxLevel=val;
                if(maxLevel<minLevel) minLevel=maxLevel;
                rerollTargetsFromCurrentTable(true);
            }
        });
        document.getElementById('compff-refresh').addEventListener('click',()=>{
            rerollTargetsFromCurrentTable(true);
        });
    }
    function ensurePanel(){
        if(!document.getElementById('compff-panel')){
            panelInitialized=false;
            createPanel();
        }
    }

    function getTeamRows(){
        return Array.from(document.querySelectorAll('div[class*="teamRow"]'));
    }
    function parseTeamRow(row){
        try{
            const link=row.querySelector('a[href*="profiles.php?XID="]');
            if(!link) return null;
            const href=link.getAttribute('href')||'';
            const m=href.match(/XID=(\d+)/);
            if(!m) return null;
            const id=m[1];
            const name=link.textContent.trim();
            const levelSpan=row.querySelector('div[class*="level"] span');
            if(!levelSpan) return null;
            const level=parseInt(levelSpan.textContent.trim(),10);
            if(isNaN(level)) return null;
            const statusSpan=row.querySelector('div[class*="status"] span');
            const status=statusSpan?statusSpan.textContent.trim():'';
            return {id,name,level,statusText:status.toLowerCase(),rawStatus:status}
        }catch{ return null }
    }

    function getAllPlayersSnapshot(){
        const rows=getTeamRows();
        const byId={};
        const candidates=[];
        for(const row of rows){
            const d=parseTeamRow(row);
            if(!d) continue;
            byId[d.id]=d;
            if(d.statusText==='okay' && d.level>=minLevel && d.level<=maxLevel){
                candidates.push(d);
            }
        }
        return {byId,candidates};
    }

    function pickRandomTargets(candidates){
        if(candidates.length<=TARGET_COUNT) return candidates.slice();
        const arr=candidates.slice();
        for(let i=arr.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            [arr[i],arr[j]]=[arr[j],arr[i]];
        }
        return arr.slice(0,TARGET_COUNT);
    }

    function statusColor(st){
        st=st||'';
        if(st==='okay') return '#7CFC00';
        if(st.includes('travel')) return '#ffa500';
        if(st==='hospital'||st==='jail') return '#ff5555';
        return '#ccc';
    }

    function renderTargetsUsingCurrent(){
        ensurePanel();
        const box=document.getElementById('compff-targets');
        if(!box) return;

        if(!currentTargets.length){
            box.innerHTML=`<div>No valid targets found (levels ${minLevel}-${maxLevel}).</div>`;
            return;
        }

        box.innerHTML='';
        const ids=[];
        for(const t of currentTargets){
            ids.push(t.id);
            const attackUrl=buildAttackUrl(t.id);
            const profileUrl=`https://www.torn.com/profiles.php?XID=${t.id}`;
            const row=document.createElement('div');
            row.className='compff-target-row';
            row.dataset.id=t.id;
            row.style.marginBottom='6px';
            row.style.lineHeight='1.3';

            const bs=getFormattedBs(t.id)||'...';
            const sColor=statusColor(t.statusText);
            row.innerHTML=`
                <strong>${t.name}</strong> (Lvl ${t.level})<br>
                <a href="${attackUrl}" target="_blank" style="color:#ffb347;">Attack</a>
                &nbsp;|&nbsp;
                <a href="${profileUrl}" target="_blank" style="color:#9ecbff;">Profile</a>
                &nbsp;|&nbsp;
                <span class="compff-bs">${bs}</span>
                <br>
                <span class="compff-status" style="font-size:11px;color:${sColor}">
                    Status: ${t.rawStatus}
                </span>
            `;
            box.appendChild(row);
        }
        fetchStatsForPlayers(ids,()=>ids.forEach(updateRowBs));
    }

    function updateRowBs(id){
        const box=document.getElementById('compff-targets');
        if(!box) return;
        const row=box.querySelector(`.compff-target-row[data-id="${id}"]`);
        if(!row) return;
        const span=row.querySelector('.compff-bs');
        if(!span) return;
        span.textContent=getFormattedBs(id)||'?';
    }

    function updatePanelStatuses(byId){
        const box=document.getElementById('compff-targets');
        if(!box) return;
        for(const row of box.querySelectorAll('.compff-target-row')){
            const id=row.dataset.id;
            if(!id) continue;
            const data=byId[id];
            const span=row.querySelector('.compff-status');
            if(!span) continue;
            if(!data){
                span.textContent='Status: ?';
                span.style.color='#ccc';
                continue;
            }
            span.textContent='Status: '+data.rawStatus;
            span.style.color=statusColor(data.statusText);
        }
    }

    function rerollTargetsFromCurrentTable(){
        const {byId,candidates}=getAllPlayersSnapshot();
        currentTargets=pickRandomTargets(candidates);
        renderTargetsUsingCurrent();
        updatePanelStatuses(byId);
    }

    function scanAndMaintainTargets(){
        if(!isCompetitionPage()) return;
        ensurePanel();
        if(!getApiKey()) showApiPrompt();

        const {byId}=getAllPlayersSnapshot();
        updatePanelStatuses(byId);

        const stillOkay=currentTargets.filter(t=>{
            const d=byId[t.id];
            return d && d.statusText==='okay';
        }).length;

        if(currentTargets.length===0 || stillOkay<=1){
            rerollTargetsFromCurrentTable();
        }
    }

    // ---------- PROFILE BS ----------
    function getPid(){ const m=location.href.match(/XID=(\d+)/); return m?m[1]:null }
    function insertProfileBs(pid){
        const wrap=document.querySelector('.profile-wrapper')||
                    document.querySelector('[class*="profile-container"]')||
                    document.querySelector('.user-information')||
                    document.body;

        if(!wrap) return;
        let box=wrap.querySelector('.compff-profile-bs');
        const cache=getCachedStats(pid);
        const val=cache&&cache.bs_estimate?formatShortNumber(cache.bs_estimate):'?';

        if(!box){
            box=document.createElement('div');
            box.className='compff-profile-bs';
            Object.assign(box.style,{
                marginTop:'6px',fontSize:'12px',fontWeight:'bold',color:'#ccc'
            });
            const nameNode=wrap.querySelector('.user-name,.profile-name,h1');
            if(nameNode&&nameNode.parentNode){ nameNode.parentNode.appendChild(box) }
            else wrap.appendChild(box);
        }
        box.textContent='BS est: '+val;
    }

    function initProfile(){
        if(!isOnProfilePage()) return;
        if(!getApiKey()) showApiPrompt();
        const pid=getPid();
        if(!pid) return;
        insertProfileBs(pid);
        fetchStatsForPlayers([pid],()=>insertProfileBs(pid));
    }

    // ---------- BOOT ----------
    function init(){
        if(isCompetitionPage()) initCompetition();
        if(isOnProfilePage()) initProfile();
    }

    function initCompetition(){
        ensurePanel();
        if(!getApiKey()) showApiPrompt();
        rerollTargetsFromCurrentTable();
        setInterval(scanAndMaintainTargets,SCAN_INTERVAL_MS);
    }

    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded',init);
    }else init();

})();
