// ==UserScript==
// @name         NeoDeck Auto-Add
// @namespace    MoonLord
// @version      2.5
// @description  Automatically adds cards from the inventory to the NeoDeck.
// @match        https://www.neopets.com/inventory.phtml*
// @match        https://neopets.com/inventory.phtml*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558794/NeoDeck%20Auto-Add.user.js
// @updateURL https://update.greasyfork.org/scripts/558794/NeoDeck%20Auto-Add.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Patterns that match card backs to detect collectible/trading cards
    const CARD_BACK_PATTERNS = [
        'bluetradingcardback','redtradingcardback','pinktradingcardback',
        'greentradingcardback','purpletradingcardback','blacktradingcardback',
        'goldtradingcardback','holotradingcardback'
    ];

    // Timing configuration
    const DELAY_BETWEEN_ACTIONS = 2000;
    const OPEN_ITEM_TIMEOUT = 1200;
    const MENU_INTERACTION_DELAY = 600;
    const SUCCESS_POPUP_TIMEOUT = 3500;
    const SELECT_WAIT_TIMEOUT = 8000;

    // LocalStorage keys
    const STORAGE_KEY = 'neodeck_auto_running';
    const INDEX_KEY = 'neodeck_last_index';

    let processing = false;
    let stopped = false;
    let currentIndex = 0;
    let cards = [];
    let inventoryReady = false;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Save/restore persistence flags
    function persistRunning(v){ try{ localStorage.setItem(STORAGE_KEY,v?'1':'0'); }catch(e){} }
    function readPersist(){ try{return localStorage.getItem(STORAGE_KEY)==='1';}catch(e){return false;} }

    function saveIndex(i){ try{ localStorage.setItem(INDEX_KEY,String(i)); }catch(e){} }
    function loadIndex(){ try{const v=parseInt(localStorage.getItem(INDEX_KEY));return isNaN(v)?0:v;}catch(e){return 0;} }

    function debugLog(...a){ console.log('[NeoDeckAuto]',...a); }

    // Detect inventory item nodes
    function getItemNodes(){
        return Array.from(document.querySelectorAll('.lazy.item-img, .item-img, .item'));
    }

    // Extract image/background URL from an item element
    function extractBgUrl(el){
        if(!el) return '';
        const style = el.style.backgroundImage || '';
        const m = style.match(/url\((?:\"|\')?(.*?)(?:\"|\')?\)/);
        if(m) return m[1].toLowerCase();
        const dataImg = el.getAttribute('data-image')||'';
        if(dataImg) return dataImg.toLowerCase();
        const img = el.querySelector('img');
        if(img) return (img.src||img.getAttribute('data-src')||'').toLowerCase();
        return '';
    }

    // Determine whether an item is a card
    function isCard(el){
        if(!el) return false;
        const type = (el.getAttribute('data-itemtype')||'').toLowerCase();
        if(type.includes('collectable card')||type.includes('trading card')) return true;
        const url = extractBgUrl(el);
        if(url) return CARD_BACK_PATTERNS.some(p=>url.includes(p));
        return false;
    }

    // Wait for selector
    async function waitForSelector(sel,timeout=SELECT_WAIT_TIMEOUT,poll=150){
        const t0=Date.now();
        while(Date.now()-t0<timeout){
            const el=document.querySelector(sel);
            if(el) return el;
            await sleep(poll);
        }
        return null;
    }

    // Open inventory item modal
    async function openItem(el){
        try{
            if(typeof window.invView2==='function' && el.id){
                window.invView2(el.id);
            }else{
                el.click();
            }
        }catch(e){ el.click(); }
        await sleep(OPEN_ITEM_TIMEOUT);
    }

    // Select "Put in your NeoDeck" via dropdown menu
    async function chooseNeodeckViaSelect(){
        const select = await waitForSelector('#iteminfo_select_action select[name="action"], select[name="action"]', SELECT_WAIT_TIMEOUT);
        if(!select) throw new Error('select_action_not_found');

        try{ select.focus(); select.click(); }catch(e){}

        let opt=null;
        for(const o of Array.from(select.options)){
            if((o.text||'').toLowerCase().includes('neodeck')){ opt=o; break; }
        }
        if(!opt) throw new Error('neodeck_option_not_found');

        select.value = opt.value;
        select.dispatchEvent(new Event('input',{bubbles:true}));
        select.dispatchEvent(new Event('change',{bubbles:true}));

        await sleep(MENU_INTERACTION_DELAY);
        return true;
    }

    // Click the submit button in the inventory modal
    async function clickSubmit(){
        let btn=document.querySelector('.invitem-submit.button-default__2020.button-yellow__2020');
        if(!btn){
            btn=[...document.querySelectorAll('.invitem-submit')]
                .find(el => (el.textContent||'').trim().toLowerCase()==='submit');
        }
        if(!btn) throw new Error('submit_not_found');
        btn.click();
        return true;
    }

    // Wait for success confirmation popup
    async function waitForSuccessPopup(){
        const t0=Date.now();
        while(Date.now()-t0<SUCCESS_POPUP_TIMEOUT){
            const successNode = Array.from(document.querySelectorAll('div,p,span'))
                .find(el => (el.textContent||'').toLowerCase().includes('you have added'));
            if(successNode){
                const closeBtn =
                    document.querySelector('a.inv-refresh .button-red__2020') ||
                    document.querySelector('a.inv-refresh') ||
                    Array.from(document.querySelectorAll('div.button-red__2020'))
                        .find(el => (el.textContent||'').toLowerCase().includes('close and refresh'));
                return {success:true,closeBtn};
            }
            await sleep(200);
        }
        return {success:false};
    }

    // Close the success popup
    async function closeSuccess(btn){
        try{
            if(btn) btn.click();
            else window.location.reload();
        }catch(e){
            window.location.reload();
        }
        await sleep(1800);
    }

    // Wait until inventory is fully loaded
    async function waitInventoryFullyLoaded(){
        const t0=Date.now();
        while(Date.now()-t0<8000){
            const items = getItemNodes();
            if(items.length > 0){
                inventoryReady = true;
                return true;
            }
            await sleep(150);
        }
        inventoryReady = true;
        return true;
    }

    // Detect changes to inventory (fallback for slower loads)
    function attachInventoryObserver(){
        const target = document.querySelector('#inventory') || document.body;
        const obs = new MutationObserver(() => {
            const items = getItemNodes();
            if(items.length > 0){
                inventoryReady = true;
            }
        });
        obs.observe(target,{childList:true,subtree:true});
    }

    // Process a single card
    async function processCardAt(i){
        if(stopped) throw new Error('stopped');
        const el = cards[i];
        if(!el) return false;

        await openItem(el);

        let chosen=false;
        try{
            await chooseNeodeckViaSelect();
            chosen=true;
        }catch(e){}

        if(!chosen){
            const node=Array.from(document.querySelectorAll('button,a,li,span'))
                .find(n=>(n.textContent||'').toLowerCase().includes('put in your neodeck'));
            if(node){try{node.click();chosen=true;}catch(e){}}
        }

        if(!chosen) throw new Error('neodeck_action_not_chosen');

        await sleep(200);
        await clickSubmit();

        const res=await waitForSuccessPopup();
        if(res.success){
            await closeSuccess(res.closeBtn);
            return true;
        }else{
            window.location.reload();
            await sleep(1200);
            return false;
        }
    }

    // Core loop
    async function processLoop(){
        if(processing) return;
        processing=true;
        stopped=false;
        persistRunning(true);

        await waitInventoryFullyLoaded();
        cards = getItemNodes().filter(isCard);

        currentIndex = loadIndex();
        if(currentIndex >= cards.length) currentIndex=0;

        while(!stopped && currentIndex < cards.length){
            try{
                await processCardAt(currentIndex);
                currentIndex++;
                saveIndex(currentIndex);
                await sleep(DELAY_BETWEEN_ACTIONS);
                cards = getItemNodes().filter(isCard);
            }catch(e){
                if(String(e).toLowerCase().includes('stopped')) break;
                await sleep(1000);
                cards = getItemNodes().filter(isCard);
            }
        }

        processing=false;
        persistRunning(false);
        saveIndex(0);
    }

    // Create floating UI panel
    function createUI(){
        if(document.getElementById('neodeck-ui-wrapper')) return;

        const wrapper=document.createElement('div');
        wrapper.id='neodeck-ui-wrapper';
        wrapper.style.cssText='position:fixed;top:200px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;';

        const start=document.createElement('button');
        start.textContent='▶ Start NeoDeck';
        start.style.cssText='padding:8px 12px;background:#4CAF50;color:white;border-radius:6px;border:0;cursor:pointer;font-weight:bold;';
        start.onclick=()=>{ if(!processing){ currentIndex=0; saveIndex(0); processLoop(); } };

        const stop=document.createElement('button');
        stop.textContent='⛔ Stop';
        stop.style.cssText='padding:8px 12px;background:#d9534f;color:white;border-radius:6px;border:0;cursor:pointer;font-weight:bold;';
        stop.onclick=()=>{ stopped=true; processing=false; persistRunning(false); saveIndex(0); };

        const label=document.createElement('label');
        label.style.cssText='color:#fff;background:#222;padding:6px;border-radius:6px;text-align:center;';
        label.textContent='Auto-resume on reload: '+(readPersist()?'ON':'OFF');

        wrapper.appendChild(start);
        wrapper.appendChild(stop);
        wrapper.appendChild(label);
        document.body.appendChild(wrapper);
    }

    // Auto-resume feature
    function tryAutoResume(){
        if(readPersist()){
            setTimeout(()=>{processLoop();},600);
        }
    }

    // Initialization
    function init(){
        attachInventoryObserver();
        createUI();
        tryAutoResume();
    }

    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
    else init();

})();
