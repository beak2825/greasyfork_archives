// ==UserScript==
// @name         Bounce Client for Bloxd.io
// @namespace    Created By Bounce Team
// @version      2.1
// @description  Bounce Client (Hacks) for Bloxd.io
// @license      MIT
// @author       ExpertCrafts, CyphrNX, Ugvs_, and United Nations Hacks (Not ChatGPT -_-)
// @match        https://bloxd.io/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552257/Bounce%20Client%20for%20Bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/552257/Bounce%20Client%20for%20Bloxdio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= KILLAURA PART =================
    let isInjectionSuccessful = false;
    let killauraInterval = null;
    let killauraEnabled = false;

    const ObjectUtils = {
        getKeys(obj) { return obj ? Object.keys(obj) : []; },
        getValues(obj) { return this.getKeys(obj).map(k => obj[k]); }
    };

    const VectorMath = {
        normalize(v) {
            const [x, y, z] = v;
            const magSq = x*x + y*y + z*z;
            if (magSq > 0) { const inv = 1/Math.sqrt(magSq); return [x*inv, y*inv, z*inv]; }
            return v;
        },
        getDistance(a, b) { return Math.sqrt(this.getDistanceSquared(a,b)); },
        getDistanceSquared(a, b) { return (b[0]-a[0])**2 + (b[1]-a[1])**2 + (b[2]-a[2])**2; }
    };

    const GameInterface = {
        webpackRequire: null,
        _cachedNoaInstance: null,
        bloxdProps: null,
        get noa() {
            if (this._cachedNoaInstance) return this._cachedNoaInstance;
            this._cachedNoaInstance = ObjectUtils.getValues(this.bloxdProps).find(p => p?.entities);
            return this._cachedNoaInstance;
        },
        init() {
            const descs = Object.getOwnPropertyDescriptors(window);
            const wpKey = Object.keys(descs).find(k => descs[k]?.set?.toString().includes("++"));
            window[wpKey] = window[wpKey];
            const randId = Math.floor(Math.random()*9999999+1);
            window[wpKey].push([[randId], {}, require => { this.webpackRequire = require; }]);
            this.bloxdProps = ObjectUtils.getValues(this.findModule("nonBlocksClient:")).find(p => typeof p=="object");
        },
        findModule(text) {
            const allModules = this.webpackRequire.m;
            for (let id in allModules)
                if (allModules[id] && allModules[id].toString().includes(text))
                    return this.webpackRequire(id);
            return null;
        }
    };

    const NoaAPI = {
        getPosition(id) { return GameInterface.noa.entities.getState(id,"position").position; },
        getHeldItem(id) {
            try {
                const func = ObjectUtils.getValues(GameInterface.noa.entities)
                    .find(p => typeof p==='function' && p.length==1 && p.toString().length<13 && p.toString().includes(")."));
                return func(id);
            } catch { return null; }
        },
        get playerList() {
            return ObjectUtils.getValues(GameInterface.noa.bloxd.getPlayerIds())
                .filter(id => id!==1 && this.getHeldItem(id))
                .map(id => parseInt(id));
        },
        get doAttack() {
            const held = this.getHeldItem(1);
            if (!held) return () => {};
            return (held.doAttack || held.breakingItem.doAttack).bind(held);
        }
    };

    function killauraLogic() {
        if (!isInjectionSuccessful || !killauraEnabled) return;
        const myPos = NoaAPI.getPosition(1);
        const radius = 5;
        const attack = NoaAPI.doAttack;

        NoaAPI.playerList.forEach(eId => {
            const enemyPos = NoaAPI.getPosition(eId);
            if (enemyPos && VectorMath.getDistance(myPos, enemyPos)<=radius) {
                const vec = VectorMath.normalize([
                    enemyPos[0]-myPos[0],
                    enemyPos[1]-myPos[1],
                    enemyPos[2]-myPos[2]
                ]);
                attack(vec, eId.toString(), "BodyMesh");
            }
        });
    }

    function performInjection() {
        try { GameInterface.init(); isInjectionSuccessful=true; console.log("Injection successful!"); }
        catch(e){ console.error("Injection failed:", e); }
    }
    performInjection();

    function toggleKillaura(state) {
        killauraEnabled = state;
        if (state) {
            if (!killauraInterval)
                killauraInterval = setInterval(killauraLogic, 100);
            console.log("Killaura ON");
        } else {
            if (killauraInterval) {
                clearInterval(killauraInterval);
                killauraInterval = null;
            }
            console.log("Killaura OFF");
        }
    }

    // Keep R key toggle for convenience
    document.addEventListener('keydown', e => {
        if (!isInjectionSuccessful || e.key.toLowerCase()!=='r' || document.activeElement.tagName==='INPUT') return;
        toggleKillaura(!killauraEnabled);
    });

    // ================= OVERLAY PART =================
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blueWhite {0%{background:#001f3f;}50%{background:#fff;}100%{background:#001f3f;}}
      #bounce-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;animation:blueWhite 4s infinite alternate;font-family:monospace;color:cyan;}
      #bounce-title{text-align:center;font-size:40px;font-weight:bold;margin:20px 0;background:linear-gradient(90deg, blue, white, blue);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 10px blue,0 0 20px white;}
      #bounce-list{position:absolute;top:100px;left:20px;width:280px;height:75%;overflow-y:auto;background:rgba(0,0,0,0.15);padding:8px;border-radius:8px;}
      .bounce-item{padding:6px;cursor:pointer;font-size:16px;color:white;border-radius:6px;margin-bottom:6px;}
      .bounce-item:hover{background:rgba(0,0,255,0.12);}
      #bounce-close{position:absolute;top:10px;right:15px;color:blue;cursor:pointer;font-weight:bold;font-size:18px;}
      #bounce-reopen{display:none;position:fixed;top:10px;left:10px;z-index:999999;background:#001f3f;color:white;padding:6px 12px;cursor:pointer;border:1px solid blue;font-family:monospace;font-size:14px;}
      #bloxd-ping-display{position:fixed;top:10px;right:10px;padding:8px 14px;background:rgba(0,0,0,0.7);color:#4CAF50;font-family:'Inter',sans-serif;font-size:18px;font-weight:700;border-radius:12px;z-index:10000;user-select:none;box-shadow:0 4px 10px rgba(0,0,0,0.5);min-width:120px;text-align:center;transition:all 0.3s ease;border:1px solid rgba(255,255,255,0.1);}
    `;
    document.head.appendChild(style);

    // Added "Killaura" to the cheat list
    const cheats = ["Killaura","Auto Sprint","Night Mode","Rainbow Username","FPS Boost","Anti AFK","Old Skins","New Skins","Show Ping","Clean UI","Custom Crosshair"];

    const overlay = document.createElement("div");
    overlay.id="bounce-overlay";
    overlay.innerHTML=`<div id="bounce-title">Bounce Client</div><div id="bounce-close">Close</div><div id="bounce-list"></div>`;
    document.body.appendChild(overlay);

    const list = overlay.querySelector("#bounce-list");
    let pingDisplay, pingInterval;
    const PING_INTERVAL_MS=3000;

    function createPingDisplay(){if(pingDisplay) return; pingDisplay=document.createElement('div'); pingDisplay.id='bloxd-ping-display'; pingDisplay.textContent='Ping: Loading...'; document.body.appendChild(pingDisplay);}
    async function measurePing(){const url=window.location.origin; const start=performance.now(); try{await fetch(url,{method:'HEAD',cache:'no-store'}); updatePingDisplay(Math.round(performance.now()-start));}catch{updatePingDisplay('ERR');}}
    function updatePingDisplay(p){if(!pingDisplay) return; let color,text=(p==='ERR')?'Error':`${p} ms`; color=(p==='ERR')?'#FF4500':p<100?'#4CAF50':p<250?'#FFD700':'#FF4500'; pingDisplay.textContent=`Ping: ${text}`; pingDisplay.style.color=color;}
    function startPing(){createPingDisplay(); measurePing(); pingInterval=setInterval(measurePing,PING_INTERVAL_MS);}
    function stopPing(){if(pingInterval) clearInterval(pingInterval); pingInterval=null; if(pingDisplay){pingDisplay.remove(); pingDisplay=null;}}

    cheats.forEach(c=>{const item=document.createElement("div"); item.className="bounce-item"; item.textContent=c+" [OFF]"; item.dataset.state="off"; item.onclick=()=>{const state=item.dataset.state==="off"?"on":"off"; item.dataset.state=state; item.textContent=c+(state==="on"?" [ON]":" [OFF]"); item.style.color=state==="on"?"lime":"white";
        // Logic for real toggles
        if(c==="Show Ping"){if(state==="on") startPing(); else stopPing();}
        if(c==="Killaura"){toggleKillaura(state==="on");}
    }; list.appendChild(item);});

    const closeBtn=overlay.querySelector("#bounce-close");
    const reopenBtn=document.createElement("div");
    reopenBtn.id="bounce-reopen"; reopenBtn.textContent="= Bounce Client"; document.body.appendChild(reopenBtn);
    closeBtn.onclick=()=>{overlay.style.display="none"; reopenBtn.style.display="block";};
    reopenBtn.onclick=()=>{overlay.style.display="block"; reopenBtn.style.display="none";};
})();
