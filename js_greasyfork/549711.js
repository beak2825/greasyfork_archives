// ==UserScript==
// @name         Dashboard - CD Timers
// @namespace    http://tampermonkey.net/
// @version      4.0.13
// @description  Cooldown panel showing important CD timers and other details
// @author       Tiago
// @match        https://*.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549711/Dashboard%20-%20CD%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/549711/Dashboard%20-%20CD%20Timers.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'CYMRDDN0Cuq2odBP';
    const COOLDOWN_URL = `https://api.torn.com/user/?selections=cooldowns,travel,education,refills&key=${API_KEY}`;
    const INVEST_URL = `https://api.torn.com/v2/user/personalstats?cat=investments&stat=&key=${API_KEY}`;
    const OC_URL = `https://api.torn.com/v2/user/organizedcrime?key=${API_KEY}`;

    const COOLDOWN_KEYS = ['drug','medical','booster','travel','education','bank','energy','oc'];
    const COOLDOWNS = {};
    const END_TIMES = {};
    let energyUsed = false;

    function formatTime(s){
        if(s<=0) return 'Ready!';
        const d=Math.floor(s/86400), h=Math.floor((s%86400)/3600), m=Math.floor((s%3600)/60), sec=s%60;
        const parts=[];
        if(d>0) parts.push(`${d}d`);
        if(h>0||d>0) parts.push(`${h}h`);
        if(m>0||h>0||d>0) parts.push(`${m}m`);
        if(s<86400) parts.push(`${sec}s`);
        return parts.join(' ');
    }

    function getEndDatetime(seconds){
        const end=new Date(Date.now()+seconds*1000);
        return `${end.getDate().toString().padStart(2,'0')}/${(end.getMonth()+1).toString().padStart(2,'0')} ${end.getHours().toString().padStart(2,'0')}:${end.getMinutes().toString().padStart(2,'0')}`;
    }

    const tooltip = (() => {
        const t = document.createElement('div');
        t.id = 'cooldown-tooltip';
        t.style.cssText = `position:fixed;display:none;background-color:rgba(0,0,0,0.85);color:white;padding:5px 8px;border-radius:4px;font-size:12px;z-index:9999;pointer-events:none;white-space:nowrap;`;
        document.body.appendChild(t);
        return t;
    })();

    function setupTooltip(el, seconds){
        if (el._tooltipEnter) {
            try {
                el.removeEventListener('mouseenter', el._tooltipEnter);
                el.removeEventListener('mouseleave', el._tooltipLeave);
            } catch(e){}
            if(el._tooltipUpdate){
                try { window.removeEventListener('scroll', el._tooltipUpdate, true); } catch(e){}
                delete el._tooltipUpdate;
            }
            delete el._tooltipEnter;
            delete el._tooltipLeave;
        }

        if(seconds<=0) return;

        el._tooltipEnter = function(){
            tooltip.textContent = `Ends: ${getEndDatetime(seconds)}`;
            tooltip.style.display='block';
            const updatePos = function(){
                const rect = el.getBoundingClientRect();
                tooltip.style.left = `${rect.right+5}px`;
                tooltip.style.top = `${rect.top}px`;
            };
            updatePos();
            el._tooltipUpdate = updatePos;
            window.addEventListener('scroll', updatePos, true);
        };

        el._tooltipLeave = function(){
            tooltip.style.display='none';
            if(el._tooltipUpdate){
                try { window.removeEventListener('scroll', el._tooltipUpdate, true); } catch(e){}
                delete el._tooltipUpdate;
            }
        };

        el.addEventListener('mouseenter', el._tooltipEnter);
        el.addEventListener('mouseleave', el._tooltipLeave);
    }

    function updateEndTimeFromRemaining(key, remainingSeconds){
        const now = Math.floor(Date.now()/1000);
        const newEnd = remainingSeconds > 0 ? (now + Math.floor(remainingSeconds)) : 0;
        if(!END_TIMES[key] || END_TIMES[key] === 0){
            END_TIMES[key] = newEnd;
        } else if(newEnd === 0){
            END_TIMES[key] = 0;
        } else {
            if(newEnd < END_TIMES[key] - 2){
                END_TIMES[key] = newEnd;
            }
        }
        COOLDOWNS[key] = END_TIMES[key] ? Math.max(END_TIMES[key] - now, 0) : 0;
    }

    function updateEndTimeFromAbsolute(key, absoluteTimestamp){
        const now = Math.floor(Date.now()/1000);
        const newEnd = absoluteTimestamp ? Math.floor(absoluteTimestamp) : 0;
        if(!END_TIMES[key] || END_TIMES[key] === 0){
            END_TIMES[key] = newEnd;
        } else if(newEnd === 0){
            END_TIMES[key] = 0;
        } else {
            if(newEnd < END_TIMES[key] - 2){
                END_TIMES[key] = newEnd;
            }
        }
        COOLDOWNS[key] = END_TIMES[key] ? Math.max(END_TIMES[key] - now, 0) : 0;
    }

    function updateUI(){
        const container = document.getElementById('cd-container');
        if(!container) return;

        COOLDOWN_KEYS.forEach(k=>{
            let seconds = 0;
            if(k === 'energy'){
                const now = new Date(), utc = new Date(now.toUTCString());
                seconds = energyUsed ? 86400 - (utc.getUTCHours()*3600 + utc.getUTCMinutes()*60 + utc.getUTCSeconds()) : 0;
            } else {
                const now = Math.floor(Date.now()/1000);
                if(END_TIMES[k]) seconds = Math.max(END_TIMES[k] - now, 0);
                else seconds = COOLDOWNS[k] || 0;
            }

            const el = document.getElementById(`cd-${k}`);
            if(!el) return;
            el.textContent = formatTime(seconds);
            el.style.color = seconds<=0 ? 'red' : seconds<=14400 ? 'yellow' : 'var(--default-green-color)';
            setupTooltip(el, seconds);
        });

        const rows = Array.from(container.querySelectorAll('.cd-item'));
        rows.sort((a,b)=>{
            const keyA = a.dataset.key;
            const keyB = b.dataset.key;
            const now = Math.floor(Date.now()/1000);
            let secondsA = 0, secondsB = 0;
            if(keyA==='energy'){
                const d = new Date(), utc = new Date(d.toUTCString());
                secondsA = energyUsed ? 86400 - (utc.getUTCHours()*3600 + utc.getUTCMinutes()*60 + utc.getUTCSeconds()) : 0;
            } else {
                secondsA = END_TIMES[keyA] ? Math.max(END_TIMES[keyA] - now, 0) : (COOLDOWNS[keyA]||0);
            }
            if(keyB==='energy'){
                const d = new Date(), utc = new Date(d.toUTCString());
                secondsB = energyUsed ? 86400 - (utc.getUTCHours()*3600 + utc.getUTCMinutes()*60 + utc.getUTCSeconds()) : 0;
            } else {
                secondsB = END_TIMES[keyB] ? Math.max(END_TIMES[keyB] - now, 0) : (COOLDOWNS[keyB]||0);
            }
            return secondsA - secondsB;
        });

        rows.forEach(r => container.appendChild(r.parentNode));
    }

    function countdownTick(){
        const now = Math.floor(Date.now()/1000);
        ['drug','medical','booster','travel','education','bank','oc'].forEach(k=>{
            if(END_TIMES[k]){
                COOLDOWNS[k] = Math.max(END_TIMES[k] - now, 0);
            } else if(COOLDOWNS[k] > 0){
                COOLDOWNS[k]--;
            } else {
                COOLDOWNS[k] = 0;
            }
        });
        updateUI();
    }

    function fetchData(){
        const cdUrl = COOLDOWN_URL + '&_=' + Date.now();
        const investUrl = INVEST_URL + '&_=' + Date.now();
        const ocUrl = OC_URL + '&_=' + Date.now();

        GM_xmlhttpRequest({
            method:'GET',
            url: cdUrl,
            headers: { 'Cache-Control': 'no-cache' },
            onload: res=>{
                try{
                    const json=JSON.parse(res.responseText);
                    updateEndTimeFromRemaining('drug', json.cooldowns?.drug || 0);
                    updateEndTimeFromRemaining('medical', json.cooldowns?.medical || 0);
                    updateEndTimeFromRemaining('booster', json.cooldowns?.booster || 0);
                    updateEndTimeFromRemaining('travel', json.travel?.time_left || 0);
                    updateEndTimeFromRemaining('education', json.education_timeleft || 0);
                    energyUsed = !!json.refills?.energy_refill_used;
                    updateUI();
                }catch(e){console.error('cooldown fetch error', e);}
            }
        });

        GM_xmlhttpRequest({
            method:'GET',
            url: investUrl,
            headers: { 'Cache-Control': 'no-cache' },
            onload: res=>{
                try{
                    const json=JSON.parse(res.responseText);
                    const apiRem = json.personalstats?.investments?.bank?.time_remaining || 0;
                    updateEndTimeFromRemaining('bank', apiRem);
                    updateUI();
                }catch(e){console.error('invest fetch error', e);}
            }
        });

        GM_xmlhttpRequest({
            method:'GET',
            url: ocUrl,
            headers: { 'Cache-Control': 'no-cache' },
            onload: res=>{
                try{
                    const json=JSON.parse(res.responseText);
                    let ready = json.organizedCrime?.ready_at || 0;
                    let missing=0;
                    if(Array.isArray(json.organizedCrime?.slots)) missing=json.organizedCrime.slots.filter(s=>!s.user).length;
                    else if(Array.isArray(json.organizedCrime?.members)) missing=json.organizedCrime.members.filter(m=>!m.user).length;
                    if(ready) ready += missing * 86400;
                    updateEndTimeFromAbsolute('oc', ready);
                    updateUI();
                }catch(e){console.error('oc fetch error', e);}
            }
        });
    }

    function insertPanel(referenceDiv){
        const wrapper = document.createElement('div');
        wrapper.style.width = referenceDiv.offsetWidth + 'px';
        wrapper.style.marginTop = '10px';
        referenceDiv.parentNode.insertBefore(wrapper, referenceDiv.nextSibling);

        const panel = document.createElement('div');
        panel.id = 'cooldown-panel';
        panel.style.cssText = 'font:11.5px Arial; line-height:1.4; color:white; border-radius:0 5px 5px 0; background-color:#333333; padding: 8px;';
        wrapper.appendChild(panel);

        const style = document.createElement('style');
        style.textContent = `
            .cd-item{display:flex; justify-content:space-between; padding:2px 0; border-radius:5px; cursor:pointer; transition:background 0.2s; position:relative; color:white;}
            .cd-item:hover{background: rgba(255,255,255,0.10); margin:0 -4px; padding:2px 4px;}
            .cd-label{font-weight:700;}
            .cd-time{margin-left:auto; font-weight:600;}
            #cooldown-panel hr{margin:4px 0 8px 0;}
            #refresh-btn:hover{background: rgba(255,255,255,0.15); border-radius:5px;}
        `;
        document.head.appendChild(style);

        const headerBar = document.createElement('div');
        headerBar.style.cssText = `
            display:flex;
            justify-content:space-between;
            align-items:center;
            border-radius:5px;
            margin-bottom:6px;
            font-weight:600;
            font-size:13px;
            user-select:none;
            color:white;
        `;

        const toggleBtn = document.createElement('span');
        toggleBtn.textContent = 'Dashboard ⮟';
        toggleBtn.style.flex = '1';
        toggleBtn.style.cursor = 'pointer';
        headerBar.appendChild(toggleBtn);

        const refreshBtn = document.createElement('span');
        refreshBtn.id = 'refresh-btn';
        refreshBtn.textContent = '⭮';
        refreshBtn.style.cssText = `
            font-size:14px;
            font-weight:600;
            padding:2px 6px;
            cursor:pointer;
            margin-left:8px;
            transition: background 0.5s;
        `;
        headerBar.appendChild(refreshBtn);

        panel.appendChild(headerBar);

        const contentWrapper = document.createElement('div');
        contentWrapper.innerHTML = `<div id="cd-container"><hr></div>`;
        panel.appendChild(contentWrapper);

        toggleBtn.addEventListener('click', () => {
            if(contentWrapper.style.display === 'none'){
                contentWrapper.style.display = 'block';
                toggleBtn.textContent = 'Dashboard ⮟';
            } else {
                contentWrapper.style.display = 'none';
                toggleBtn.textContent = 'Dashboard ⮞';
            }
        });

        refreshBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fetchData();
        });

        const container = contentWrapper.querySelector('#cd-container');

        const links = {drug:'https://www.torn.com/item.php#drugs-items', medical:'https://www.torn.com/factions.php?step=your#/tab=armoury', booster:'https://www.torn.com/item.php?cat=14#candy-items', travel:'https://www.torn.com/page.php?sid=travel', education:'https://www.torn.com/page.php?sid=education', bank:'https://www.torn.com/bank.php', energy:'https://www.torn.com/points.php', oc:'https://www.torn.com/factions.php?step=your#/tab=crimes'};
        const labels = {drug:'Drug CD', medical:'Medical CD', booster:'Booster CD', travel:'Flight ETA', education:'Education', bank:'Bank', energy:'E Refill', oc:'OC'};

        COOLDOWN_KEYS.forEach(k=>{
            const link = document.createElement('a'); link.href = links[k]; link.style.textDecoration='none'; link.style.color='inherit';
            const row = document.createElement('div'); row.className='cd-item'; row.dataset.key = k;
            row.innerHTML=`<span class="cd-label">${labels[k]}:</span><span class="cd-time" id="cd-${k}">--</span>`;
            link.appendChild(row); container.appendChild(link);
        });
    }

    function waitForReferenceDiv(callback){
        const referenceDiv = document.querySelector('.header___RpWar.desktop___ei8Er');
        if(referenceDiv) return callback(referenceDiv);
        const observer = new MutationObserver((mutations, obs)=>{
            const div = document.querySelector('.header___RpWar.desktop___ei8Er');
            if(div){obs.disconnect(); callback(div);}
        });
        observer.observe(document.body,{childList:true,subtree:true});
    }

    waitForReferenceDiv(insertPanel);
    fetchData();
    setInterval(countdownTick,1000);
    setInterval(fetchData,60000);

})();
