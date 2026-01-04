// ==UserScript==
// @name         CubeRealm.io Xray
// @namespace    http://tampermonkey.net/
// @match        https://cuberealm.io/*
// @run-at       document-start
// @grant        none
// @version      2.0
// @author       Mo7a.ExE
// @description  CubeRealm.io Xray - Made By MohammedXIslam :D
// @downloadURL https://update.greasyfork.org/scripts/560560/CubeRealmio%20Xray.user.js
// @updateURL https://update.greasyfork.org/scripts/560560/CubeRealmio%20Xray.meta.js
// ==/UserScript==

(function(){
    'use strict';

    /****************************************************
     * 0️⃣ Safe Adblock Integration
     ****************************************************/
    window.adSDKType = '';
    const interval = setInterval(() => {
        try {
            if (window.adsLoadedPromiseResolve) {
                window.adsLoadedPromiseResolve();
                clearInterval(interval);
            }
        } catch(e){}
    }, 200);

    const adStyle = document.createElement("style");
    adStyle.textContent = `.adsbygoogle, #ad, #ads, .ad-banner, .ad-container, [id*="ad"] { display: none !important; }`;
    document.documentElement.appendChild(adStyle);

    /****************************************************
     * 1️⃣ Configuration & Filter Logic
     ****************************************************/
    let BlockConfig = {
        grass: true, dirt: true, sand: true, stone: true, deep_stone: true, bedrock: true, inferno_stone: true
    };

    const BlockIDs = { GRASS: 1, DIRT: 2, SAND: 3, STONE: 4, DEEP_STONE: 6, BEDROCK: 8, HELL_STONE: 10 };
    let filter = new Set();

    function updateFilter() {
        filter.clear();
        if (BlockConfig.grass) filter.add(BlockIDs.GRASS);
        if (BlockConfig.dirt) filter.add(BlockIDs.DIRT);
        if (BlockConfig.sand) filter.add(BlockIDs.SAND);
        if (BlockConfig.stone) filter.add(BlockIDs.STONE);
        if (BlockConfig.deep_stone) filter.add(BlockIDs.DEEP_STONE);
        if (BlockConfig.bedrock) filter.add(BlockIDs.BEDROCK);
        if (BlockConfig.inferno_stone) filter.add(BlockIDs.HELL_STONE);
        localStorage.setItem('xrayBlockConfig', JSON.stringify(BlockConfig));
    }

    const saved = localStorage.getItem('xrayBlockConfig');
    if (saved) Object.assign(BlockConfig, JSON.parse(saved));
    updateFilter();

    /****************************************************
     * 2️⃣ UI - Fixed Divider Line Version
     ****************************************************/
    const guiContainer = document.createElement('div');
    guiContainer.id = 'block-gui';
    document.body.appendChild(guiContainer);

    const style = document.createElement('style');
    style.innerHTML = `
#block-gui {
  position: fixed;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(10, 10, 10, 0.9);
  padding: 12px 15px;
  border-radius: 8px;
  z-index: 10000;
  pointer-events: auto;
  border: 1px solid #444;
  box-shadow: 0 5px 20px rgba(0,0,0,0.8);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  min-width: 140px;
}

.rw-text {
  background: linear-gradient(90deg, #ff0000, #ffffff, #ff0000);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rwMove 4s linear infinite;
  font-weight: bold;
  display: inline-block;
}

@keyframes rwMove {
  to { background-position: 200% center; }
}

.block-title {
  font-size: 14px;
  text-align: center;
  width: 100%;
  margin-bottom: 5px;
  padding-bottom: 5px;
  /* Fixed Color for the line - NO ANIMATION */
  border-bottom: 1px solid #444; 
  letter-spacing: 0.5px;
}

.main-toggle-btn { 
  width: 100%; 
  cursor: pointer; 
  background: rgba(255,255,255,0.05); 
  border: 1px solid #555; 
  border-radius: 4px; 
  padding: 6px; 
  font-size: 13px;
  margin-bottom: 5px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-toggle-btn:active {
  transform: scale(0.92);
}

.block-switch { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer; 
  user-select: none;
  font-size: 12px;
}

.block-switch input[type="checkbox"] {
  appearance: none; 
  width: 14px; 
  height: 14px; 
  border-radius: 3px; 
  cursor: pointer;
  border: 1px solid #666; 
  background: #111; 
  position: relative; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.block-switch input[type="checkbox"]:checked { 
  background: #ff0000; 
  border-color: #ff4d4d; 
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
}

.block-switch input[type="checkbox"]::after { 
  content: '✔'; 
  color: white; 
  font-size: 10px; 
  position: absolute; 
  top: 50%; 
  left: 50%; 
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.block-switch input[type="checkbox"]:checked::after { 
  transform: translate(-50%, -50%) scale(1);
}
`;
    document.head.appendChild(style);

    const title = document.createElement('div');
    title.className = "block-title rw-text";
    title.textContent = "Mo7a.ExE - XRAY";
    guiContainer.appendChild(title);

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'main-toggle-btn';
    const btnSpan = document.createElement('span');
    btnSpan.className = 'rw-text';
    toggleBtn.appendChild(btnSpan);
    
    const updateBtnStatus = () => {
        const anyDisabled = Object.values(BlockConfig).some(v => v === false);
        btnSpan.textContent = anyDisabled ? "Disabled" : "Enabled";
    };
    updateBtnStatus();

    toggleBtn.addEventListener('click', () => {
        const shouldEnable = btnSpan.textContent === "Disabled";
        controls.forEach(c => {
            BlockConfig[c.key] = shouldEnable;
            const inp = guiContainer.querySelector(`input[data-key="${c.key}"]`);
            if (inp) inp.checked = shouldEnable;
        });
        updateFilter();
        updateBtnStatus();
    });
    guiContainer.appendChild(toggleBtn);

    const controls = [
        { key: 'grass', name: 'Grass' },
        { key: 'dirt', name: 'Dirt' },
        { key: 'sand', name: 'Sand' },
        { key: 'stone', name: 'Stone' },
        { key: 'deep_stone', name: 'Deep Stone' },
        { key: 'bedrock', name: 'Bedrock' },
        { key: 'inferno_stone', name: 'Hell Stone' },
    ];

    controls.forEach((c) => {
        const label = document.createElement('label');
        label.className = 'block-switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = BlockConfig[c.key];
        input.dataset.key = c.key;
        input.addEventListener('change', () => {
            BlockConfig[c.key] = input.checked;
            updateFilter();
            updateBtnStatus();
        });
        const span = document.createElement('span');
        span.className = "rw-text";
        span.textContent = c.name;
        label.appendChild(input);
        label.appendChild(span);
        guiContainer.appendChild(label);
    });

    /****************************************************
     * 3️⃣ WebSocket Hooking
     ****************************************************/
    function hookWebSocket() {
        if (!window.WebSocket || window._xrayHooked) { setTimeout(hookWebSocket, 50); return; }
        window._xrayHooked = true;
        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(OriginalWebSocket, {
            construct(target, args) {
                const ws = new target(...args);
                ws.addEventListener('message', async (event) => {
                    let buffer = (event.data instanceof ArrayBuffer) ? event.data : await event.data.arrayBuffer();
                    const dv = new DataView(buffer);
                    if(dv.getUint8(0)!==0x11 || dv.getUint8(1)!==0x1) return;
                    let o = 0x10;
                    if(dv.getUint8(o++)>0){
                        const len = dv.getUint16(o); o+=2;
                        for(let i=0;i<len;i++){ o+=2; if(filter.has(dv.getUint16(o))) dv.setUint16(o,0x4e); o+=2; }
                    } else {
                        for(let i=0;i<0x8000;i++){ if(filter.has(dv.getUint16(o))) dv.setUint16(o,0x4e); o+=2; }
                    }
                });
                return ws;
            }
        });
    }
    hookWebSocket();

    document.addEventListener('keydown', (e)=>{
        if(e.key==='.'||e.key==='|') guiContainer.style.display=(guiContainer.style.display==='none'?'flex':'none');
    });
})();