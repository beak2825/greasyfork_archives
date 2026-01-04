// ==UserScript==
// @name        CubeRealm.io X-R-A-Y
// @namespace   http://tampermonkey.net/
// @match       https://cuberealm.io/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      Rash_Vison
// @description Xray + GUI + Delayed save optimization + Select all / Deselect all + Hide / Show GUI + Safely hide ads
// @downloadURL https://update.greasyfork.org/scripts/559513/CubeRealmio%20X-R-A-Y.user.js
// @updateURL https://update.greasyfork.org/scripts/559513/CubeRealmio%20X-R-A-Y.meta.js
// ==/UserScript==

(function(){
    'use strict';

    /****************************************************
     * 0️⃣ 安全隐藏广告
     ****************************************************/
    window.adSDKType = '';
    const interval = setInterval(() => {
        try {
            if (window.adsLoadedPromiseResolve) {
                window.adsLoadedPromiseResolve();
                clearInterval(interval);
                console.log("[Custom Adblock] Ads resolved safely.");
            }
        } catch(e){}
    }, 200);

    document.cookie = 'FCCDCF=;domain=cuberealm.io;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';

    const adStyle = document.createElement("style");
    adStyle.textContent = `
        /* 广告容器 */
        .adsbygoogle,
        #ad,
        #ads,
        .ad-banner,
        .ad-container,
        [id*="ad"],
        [class*="ad"] {
            display: none !important;
            visibility: hidden !important;
        }
    `;
    document.documentElement.appendChild(adStyle);

    /****************************************************
     * 1️⃣ CubeRealm Rash xray 优化版
     ****************************************************/

    // --------- 方块配置 ---------
    let BlockConfig = {
        grass: true,
        dirt: true,
        sand: true,
        stone: true,
        deep_stone: true,
        bedrock: true,
        inferno_stone: true,
    };

    const BlockIDs = {
        GRASS: 1,
        DIRT: 2,
        SAND: 3,
        STONE: 4,
        DEEP_STONE: 6,
        BEDROCK: 8,
        HELL_STONE: 10,
    };

    let filter = new Set();

    // --------- 保存/加载配置 ---------
    function saveConfig() {
        localStorage.setItem('xrayBlockConfig', JSON.stringify(BlockConfig));
    }

    function loadConfig() {
        const saved = localStorage.getItem('xrayBlockConfig');
        if (saved) {
            const parsed = JSON.parse(saved);
            for (const key in BlockConfig) {
                if (key in parsed) BlockConfig[key] = parsed[key];
            }
        }
    }

    // --------- 更新 filter 并延迟保存 ---------
    let saveTimeout;
    function updateFilter() {
        filter.clear();
        if (BlockConfig.grass) filter.add(BlockIDs.GRASS);
        if (BlockConfig.dirt) filter.add(BlockIDs.DIRT);
        if (BlockConfig.sand) filter.add(BlockIDs.SAND);
        if (BlockConfig.stone) filter.add(BlockIDs.STONE);
        if (BlockConfig.deep_stone) filter.add(BlockIDs.DEEP_STONE);
        if (BlockConfig.bedrock) filter.add(BlockIDs.BEDROCK);
        if (BlockConfig.inferno_stone) filter.add(BlockIDs.HELL_STONE);

        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveConfig, 200);
    }

    // --------- 初始化 ---------
    loadConfig();
    updateFilter();

    // --------- GUI ---------
    const guiContainer = document.createElement('div');
    guiContainer.id = 'block-gui';
    document.body.appendChild(guiContainer);

    const style = document.createElement('style');
    style.innerHTML = `
#block-gui {
  position: fixed;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0,0,0,0.6);
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 16px;
  z-index: 10000;
  pointer-events: auto;
}
.block-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
  padding-bottom: 6px;
  background: linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#00eaff,#0066ff,#8a00ff,#ff00aa,#ff0000);
  background-size: 400%;
  -webkit-background-clip: text;
  color: transparent;
  animation: rainbowMove 6s linear infinite;
  text-shadow: 0 0 6px rgba(255,255,255,0.6),0 0 10px rgba(255,255,255,0.8),0 0 20px currentColor,0 0 30px currentColor;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
@keyframes rainbowMove {0%{background-position:0% 50%;}100%{background-position:400% 50%;}}
.block-switch { display:flex; align-items:center; gap:8px; color:#fff; cursor:pointer; user-select:none; }
.block-switch input[type="checkbox"] {
  appearance:none; width:20px; height:20px; border-radius:4px; cursor:pointer;
  border:2px solid rgba(255,255,255,0.4); background:rgba(0,0,0,0.4); position:relative; transition:0.25s;
}
.block-switch input[type="checkbox"]:not(:checked) { box-shadow:0 0 4px rgba(255,255,255,0.5); }
.block-switch input[type="checkbox"]:checked { border-color:transparent; background:rgba(0,0,0,0.4); }
.block-switch input[type="checkbox"]:checked::after { content:'✓'; color:red; font-size:16px; position:absolute; top:-2px; left:3px; }
.block-switch button { width:100%; cursor:pointer; background:linear-gradient(90deg,#ff0000,#ff7f00,#ffff00,#00ff00,#00ccff,#0066ff,#9933ff,#ff0099,#ff0000);
  background-size:200%; animation: rainbowMove 6s linear infinite; color:#fff; border:none; border-radius:6px; padding:4px 0; font-size:14px;
  box-shadow:0 0 8px rgba(255,255,255,0.5);
}`;
    document.head.appendChild(style);

    const title = document.createElement('div');
    title.className = "block-title";
    title.textContent = "Rash XRAY";
    guiContainer.appendChild(title);

    const controls = [
        { key: 'grass', name: 'GRASS' },
        { key: 'dirt', name: 'DIRT' },
        { key: 'sand', name: 'SAND' },
        { key: 'stone', name: 'STONE' },
        { key: 'deep_stone', name: 'DEEP STONE' },
        { key: 'bedrock', name: 'BEDROCK' },
        { key: 'inferno_stone', name: 'HELL STONE' },
    ];

    const toggleAllLabel = document.createElement('label');
    toggleAllLabel.className = 'block-switch';
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.textContent = 'ON/OFF';
    toggleAllBtn.addEventListener('click', () => {
        const allChecked = Object.values(BlockConfig).every(v => v === true);
        controls.forEach(c => {
            BlockConfig[c.key] = !allChecked;
            const inp = guiContainer.querySelector(`input[data-key="${c.key}"]`);
            if (inp) inp.checked = BlockConfig[c.key];
        });
        updateFilter();
    });
    toggleAllLabel.appendChild(toggleAllBtn);
    guiContainer.appendChild(toggleAllLabel);

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
        });
        const span = document.createElement('span');
        span.textContent = c.name;
        label.appendChild(input);
        label.appendChild(span);
        guiContainer.appendChild(label);
    });

    // --------- WebSocket Hook ---------
    function hookWebSocket() {
        if (!window.WebSocket || window._xrayHooked) {
            setTimeout(hookWebSocket, 50);
            return;
        }
        window._xrayHooked = true;

        const OriginalWebSocket = window.WebSocket;
        window.WebSocket = new Proxy(OriginalWebSocket, {
            construct(target, args) {
                const ws = new target(...args);

                ws.addEventListener('message', async (event) => {
                    let buffer;
                    if (event.data instanceof ArrayBuffer) buffer = event.data;
                    else if (event.data instanceof Blob) buffer = await event.data.arrayBuffer();
                    else return;

                    const dv = new DataView(buffer);
                    if(dv.getUint8(0)!==0x11) return;
                    if(dv.getUint8(1)!==0x1) return;

                    let o = 0x10;
                    const maxLen = 0x8000;

                    if(dv.getUint8(o++)>0){
                        const len = dv.getUint16(o); o+=2;
                        for(let i=0;i<len;i++){
                            o+=2;
                            const id = dv.getUint16(o);
                            if(filter.has(id)) dv.setUint16(o,0x4e);
                            o+=2;
                        }
                    } else {
                        for(let i=0;i<maxLen;i++){
                            const id = dv.getUint16(o);
                            if(filter.has(id)) dv.setUint16(o,0x4e);
                            o+=2;
                        }
                    }
                });

                return ws;
            }
        });
    }
    hookWebSocket();

    // --------- GUI 热键隐藏/显示 ---------
    document.addEventListener('keydown', (e)=>{
        if(e.key==='.'||e.key==='。'){
            guiContainer.style.display=(guiContainer.style.display==='none'?'flex':'none');
        }
    });

})();
