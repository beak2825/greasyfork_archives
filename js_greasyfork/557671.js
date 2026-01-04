// ==UserScript==
// @name         🎯 Dakkar's Pendulum (iOS Safari, delayed)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  iOS Safari compatible version. Adds dynamic cooldown timer. Waits for compass & diary elements before acting.
// @author       anon
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Diary*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Locale/Compass*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557671/%F0%9F%8E%AF%20Dakkar%27s%20Pendulum%20%28iOS%20Safari%2C%20delayed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557671/%F0%9F%8E%AF%20Dakkar%27s%20Pendulum%20%28iOS%20Safari%2C%20delayed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "dakkar_loop_state";
    const PENDING_KEY = "dakkar_pending_action";
    const DEFAULT_COOLDOWN_MS = 4.4 * 60 * 1000;

    let statusBox, statusText;

    function createStatusBox() {
        if (document.getElementById("dakkar-status")) {
            statusBox = document.getElementById("dakkar-status");
            statusText = statusBox.querySelector(".dakkar-text");
            return;
        }
        statusBox = document.createElement("div");
        statusBox.id = "dakkar-status";
        statusBox.style.cssText = `
            position: fixed; bottom:20px; left:20px;
            background: rgba(255,255,255,0.95);
            padding:8px 12px; border-radius:10px;
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
            font-size:13px; color:#222; z-index:999999;
            box-shadow:0 4px 14px rgba(0,0,0,0.18);
            border:1px solid #ddd; min-width:170px; max-width:230px;
            display:flex; align-items:center; justify-content:space-between; gap:8px;
            opacity:0; transform:translateY(8px);
            transition:opacity 0.25s ease-out, transform 0.25s ease-out;
        `;
        statusBox.innerHTML = `<div class="dakkar-text" style="flex:1;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">🔁 Initializing...</div>`;
        statusText = statusBox.querySelector(".dakkar-text");
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "⛔";
        resetBtn.title = "Stop loop";
        resetBtn.style.cssText = `cursor:pointer;background:#ff4d4d;color:white;border:none;padding:6px 8px;border-radius:6px;font-size:12px;font-weight:600;width:32px;`;
        resetBtn.onclick = () => { clearState(); localStorage.removeItem(PENDING_KEY); updateStatus("🛑 STOPPED"); location.reload(); };
        statusBox.appendChild(resetBtn);
        document.body.appendChild(statusBox);
        setTimeout(()=>{statusBox.style.opacity="1";statusBox.style.transform="translateY(0)";},10);
    }
    function updateStatus(text){ if(!statusBox) createStatusBox(); statusText.textContent=text; }

    function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
    function saveState(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
    function loadState(){ const s=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"); if(s&&s.dir){ if(typeof s.moveCount!=='number') s.moveCount=0; if(typeof s.awaitingComponent!=='boolean') s.awaitingComponent=false; if(typeof s.maxMoveLimit!=='number') s.maxMoveLimit=2; } return s; }
    function clearState(){ localStorage.removeItem(STORAGE_KEY); }

    const DIAGONAL_COMPONENTS={NorthEast:["North","East"],NorthWest:["North","West"],SouthEast:["South","East"],SouthWest:["South","West"]};
    function normalizeDirection(d){const map={north:"North",south:"South",east:"East",west:"West",northeast:"NorthEast",northwest:"NorthWest",southeast:"SouthEast",southwest:"SouthWest",up:"Up",down:"Down"};return map[d.trim().toLowerCase()]||d;}
    function isDiagonal(dir){return DIAGONAL_COMPONENTS.hasOwnProperty(dir);}
    function isCardinal(dir){return ["North","South","East","West"].includes(normalizeDirection(dir));}
    function isElementHidden(el){return !el||el.getAttribute("display")==="none"||el.style.display==="none";}
    function findDirEl(dir){const id=normalizeDirection(dir);let el=document.getElementById(id);if(!el) el=document.querySelector('g[data-dir="'+id+'"]');if(!el) el=document.querySelector('a[href*="/Locale/MoveTo/"][title*="'+id+'"]');return el;}
    async function waitForDirEl(dir,timeout=5000){const start=Date.now();let el;while(Date.now()-start<timeout){el=findDirEl(dir);if(el) return el;await sleep(200);}return null;}
    async function waitForElement(selector,timeout=5000){const start=Date.now();let el;while(Date.now()-start<timeout){el=document.querySelector(selector);if(el) return el;await sleep(200);}return null;}

    function getOppositeDirection(dir){const norm=normalizeDirection(dir);const map={North:"South",South:"North",East:"West",West:"East",NorthEast:"SouthWest",SouthWest:"NorthEast",NorthWest:"SouthEast",SouthEast:"NorthWest",Up:"Down",Down:"Up"};return map[norm]||null;}

    // Cooldown countdown
    function checkCooldownAndReload(state){
        const now=Date.now();const remaining=state.nextUse-now;
        if(remaining<=0){updateStatus("✅ Cooldown done. Reloading...");setTimeout(()=>location.reload(),500);return;}
        const mm=Math.floor(remaining/60000),ss=Math.ceil((remaining/1000)%60);updateStatus("💤 Cooldown: "+mm+"m "+(ss<10?"0":"")+ss+"s...");
        setTimeout(()=>checkCooldownAndReload(state),1000);
    }

    // Items
    async function handleItemsPage(){
        const state=loadState()||{};updateStatus("🎒 Checking Items...");
        if(localStorage.getItem(PENDING_KEY)){
            const err=document.querySelector(".notification-real.notification-error");
            if(err&&/You can't do that yet/i.test(err.innerText)){
                const m=err.innerText.match(/wait (\d+) minutes?/i);const minutes=m?parseInt(m[1],10):DEFAULT_COOLDOWN_MS/60000;
                state.nextUse=Date.now()+minutes*60000;saveState(state);localStorage.removeItem(PENDING_KEY);
                updateStatus("🛑 Cooldown Error. Waiting "+minutes+"m.");checkCooldownAndReload(state);return;
            }
            updateStatus("✅ Redirecting to Diary...");window.location.href="/World/Popmundo.aspx/Character/Diary/";return;
        }
        if(state.nextUse&&Date.now()<state.nextUse){checkCooldownAndReload(state);return;}
        const rows=document.querySelectorAll("tr");let pendRow=[...rows].find(r=>r.innerText.includes("Dakkar's Pendulum"));
        if(!pendRow){updateStatus("❌ Pendulum not found!");return;}
        const useBtn=pendRow.querySelector("input[type=image][title=Use]");if(!useBtn){updateStatus("❌ Use button not found!");return;}
        localStorage.setItem(PENDING_KEY,Date.now().toString());state.nextUse=Date.now()+DEFAULT_COOLDOWN_MS;saveState(state);
        updateStatus("🔮 Using Pendulum...");useBtn.click();
    }

    // Diary
    async function handleDiaryPage(){
        if(localStorage.getItem(PENDING_KEY)) localStorage.removeItem(PENDING_KEY);
        const oldState=loadState()||{};updateStatus("⏳ Waiting for Diary...");
        const diaryList=await waitForElement("ul.diaryExtraspace",5000);
        if(!diaryList){updateStatus("❌ Diary list missing.");return;}
        updateStatus("📖 Scanning Diary...");
        const entries=[...diaryList.querySelectorAll("li")];let found=false;
        for(let entry of entries){
            const html=entry.innerHTML;if(!html.includes("Dakkar's Pendulum")) continue;
            if(html.includes("says my destination lies to")){
                const m=html.match(/lies to the\s*<strong>(.*?)<\/strong>/i);
                if(m){found=true;const newDir=normalizeDirection(m[1]);const prev=oldState.dir?normalizeDirection(oldState.dir):null;
                    let limit=15;const isOpp=prev&&(newDir===getOppositeDirection(prev));
                                        let isRel=false;
                    if(prev && isDiagonal(prev) && isDiagonal(newDir)){
                        const prevComps=DIAGONAL_COMPONENTS[prev];
                        const newComps=DIAGONAL_COMPONENTS[newDir];
                        isRel=prevComps.some(c=>newComps.includes(c));
                    }

                    if(isOpp){
                        limit=5;
                        updateStatus("🧭 Opposite direction ("+newDir+") found! Limit: 5.");
                    } else if(isRel){
                        limit=5;
                        updateStatus("🧭 Related diagonal ("+newDir+") found! Limit: 5.");
                    } else if(isCardinal(newDir)){
                        limit=2;
                        updateStatus("🧭 Cardinal direction ("+newDir+") found. Limit: 2.");
                    } else if(isDiagonal(newDir)){
                        limit=15;
                        updateStatus("🧭 Unrelated Diagonal direction ("+newDir+") found. Limit: 15.");
                    } else {
                        updateStatus("⚠️ Unknown direction ("+newDir+"). Defaulting limit to 15.");
                    }

                    const state={
                        dir:newDir,
                        moveCount:0,
                        awaitingComponent:false,
                        maxMoveLimit:limit
                    };
                    if(oldState.nextUse) state.nextUse=oldState.nextUse;
                    const cdMatch=html.match(/in (\d+) minutes/);
                    if(cdMatch) state.nextUse=Date.now()+parseInt(cdMatch[1],10)*60000;

                    saveState(state);
                    await sleep(1000);
                    window.location.href="/World/Popmundo.aspx/Locale/Compass/";
                    return;
                }
            }

            if(html.includes("reached my destination")){
                updateStatus("🎉 Destination Reached!");
                clearState();
                alert("Dakkar Loop: Destination Reached! 🎉");
                return;
            }
        }
        if(!found) updateStatus("⚠️ No recent Pendulum entry found.");
    }

    // Compass (already patched with waitForDirEl)
    async function handleCompassPage(){
        localStorage.removeItem(PENDING_KEY);
        const state=loadState();
        if(!state||!state.dir){
            updateStatus("⚠️ No direction. Go to Items.");
            setTimeout(()=>window.location.href="/World/Popmundo.aspx/Character/Items/",1000);
            return;
        }
        if(state.moveCount>=state.maxMoveLimit){
            updateStatus("🔄 "+state.maxMoveLimit+" moves done. Recalibrating...");
            saveState({nextUse:state.nextUse});
            await sleep(1000);
            window.location.href="/World/Popmundo.aspx/Character/Items/";
            return;
        }
        const mainDir=normalizeDirection(state.dir);
        let el=await waitForDirEl(mainDir);
        let targetDirText=mainDir;
        let shouldIncrement=true;
        const isDiagBlocked=isDiagonal(mainDir)&&isElementHidden(el);
        if(isDiagBlocked){
            const comps=DIAGONAL_COMPONENTS[mainDir];
            if(comps){
                if(!state.awaitingComponent){
                    targetDirText=comps[0];
                    el=await waitForDirEl(targetDirText);
                    state.awaitingComponent=true;
                    shouldIncrement=false;
                    updateStatus("⚠️ "+mainDir+" blocked. ZIG: "+targetDirText);
                } else {
                    targetDirText=comps[1];
                    el=await waitForDirEl(targetDirText);
                    state.awaitingComponent=false;
                    shouldIncrement=true;
                    updateStatus("⚠️ "+mainDir+" blocked. ZAG: "+targetDirText+" (Move "+(state.moveCount+1)+")");
                }
            } else {
                updateStatus("❌ Blocked: "+mainDir+" (Cannot move)");
                return;
            }
        } else {
            state.awaitingComponent=false;
            updateStatus("🧭 Moving "+mainDir+" (Move "+(state.moveCount+1)+"/"+state.maxMoveLimit+")");
        }
        if(!el){updateStatus("❌ Element '"+targetDirText+"' not found after waiting!");return;}
        if(shouldIncrement) state.moveCount++;
        saveState(state);
        await sleep(400);
        const clickEvent=document.createEvent('MouseEvents');
        clickEvent.initEvent('click',true,true);
        el.dispatchEvent(clickEvent);
    }

    // Dispatcher
    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded',()=>{
            createStatusBox();
            const url=location.href;
            if(url.includes("/Character/Items")) handleItemsPage();
            else if(url.includes("/Character/Diary")) handleDiaryPage();
            else if(url.includes("/Locale/Compass")) handleCompassPage();
        });
    } else {
        createStatusBox();
        const url=location.href;
        if(url.includes("/Character/Items")) handleItemsPage();
        else if(url.includes("/Character/Diary")) handleDiaryPage();
        else if(url.includes("/Locale/Compass")) handleCompassPage();
    }
})();
