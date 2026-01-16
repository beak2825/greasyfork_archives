// ==UserScript==
// @name               X/Twitter Timeline Master
// @version            5.2
// @description        Easily fish yourself out of a doomscroll and reload your timeline without refreshing the page. Also includes an auto-refresh countdown timer, draggable UI, and hotkey functionality.
// @author             Gemini
// @match              https://x.com/*
// @grant              GM_getValue
// @license            MIT
// @namespace https://greasyfork.org/users/1275465
// @downloadURL https://update.greasyfork.org/scripts/561795/XTwitter%20Timeline%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/561795/XTwitter%20Timeline%20Master.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configurations & Persistence ---
    let refreshInterval = GM_getValue('refreshInterval', 5);
    let autoRefreshEnabled = GM_getValue('autoRefreshEnabled', false);
    let hotkeyUp = GM_getValue('hotkeyUp', 'u');
    let hotkeyDown = GM_getValue('hotkeyDown', 'd');
    
    let secondsRemaining = refreshInterval;
    let autoRefreshTick = null;
    let idleTimer = null;
    let dragHoldTimer = null;
    let isDragging = false;
    let dragThresholdMet = false;

    const isHome = () => window.location.pathname === '/home';

    // --- Assets ---
    const ICON_UP = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#00ff00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    const ICON_DOWN = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#00ff00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`;
    const ICON_MENU = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="#00ff00" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;

    // --- Styles ---
    const style = document.head.appendChild(document.createElement('style'));
    style.textContent = `
        .xtm-container { 
            position: fixed; z-index: 2147483647; display: flex; flex-direction: column; 
            gap: 7px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            right: 20px; bottom: 100px; user-select: none;
            transform-origin: bottom right; /* Shrinks toward the corner */
        }
        
        /* Stealth Mode: Restored Shrink with Increased Visibility */
        .xtm-container.idle { 
            opacity: 0.65 !important; 
            transform: scale(0.5); 
        }
        .xtm-container.idle:hover { 
            opacity: 1 !important; 
            transform: scale(1);
        }

        .xtm-btn { 
            width: 32px !important; height: 32px !important; 
            background-color: rgba(0, 0, 0, 0.3) !important;
            backdrop-filter: blur(6px); border: 2px solid #00ff00 !important; 
            border-radius: 8px !important; display: flex !important; align-items: center !important; 
            justify-content: center !important; cursor: pointer; box-sizing: border-box !important; 
            transition: all 0.2s ease; position: relative;
        }
        
        .xtm-btn:hover { 
            transform: scale(1.1); border-color: #00ff88 !important; 
            box-shadow: 0 0 12px rgba(0, 255, 0, 0.5);
        }

        .xtm-container.dragging .xtm-btn { 
            border-color: #ff0000 !important; 
            box-shadow: 0 0 15px #ff0000 !important;
            animation: xtmPulse 1s infinite;
        }
        .xtm-container.dragging svg { stroke: #ff0000 !important; }

        @keyframes xtmPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        #xtm-menu { 
            position: absolute; right: 45px; bottom: 0; background: rgba(0,0,0,0.95); 
            border: 2px solid #00ff00; border-radius: 8px; padding: 12px; color: #00ff00; 
            width: 180px; display: none; flex-direction: column; gap: 10px; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        #xtm-menu.open { display: flex; }
        .xtm-row { display: flex; justify-content: space-between; align-items: center; }
        .xtm-row input { 
            background: #111; border: 1px solid #00ff00; color: #00ff00; 
            width: 55px; text-align: center; border-radius: 4px; padding: 2px;
        }
        
        .xtm-badge { 
            position: absolute; bottom: -5px; right: -5px; width: 16px; height: 16px; 
            background: #000; border: 1.5px solid #00ff00; border-radius: 50%; color: #00ff00; 
            font-size: 9px; font-weight: bold; display: none; align-items: center; 
            justify-content: center; z-index: 10;
        }
        .xtm-badge.active { display: flex; }

        @keyframes neonRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .xtm-ring { 
            position: absolute; width: 40px; height: 40px; border: 3px solid transparent; 
            border-top-color: #00ff00; border-radius: 50%; animation: neonRotate 0.8s linear infinite; 
        }
    `;

    // --- UI Implementation ---
    const container = document.createElement('div');
    container.className = 'xtm-container';
    const btnUp = createBtn(ICON_UP);
    const btnDown = createBtn(ICON_DOWN);
    const btnMenu = createBtn(ICON_MENU);
    const badge = document.createElement('div');
    badge.className = 'xtm-badge';
    btnMenu.appendChild(badge);
    const menu = createMenu();
    container.append(btnUp, btnDown, btnMenu, menu);
    document.body.appendChild(container);

    const savedPos = GM_getValue('btnPos', { right: 20, bottom: 100 });
    container.style.right = savedPos.right + 'px';
    container.style.bottom = savedPos.bottom + 'px';

    // --- Logic ---
    function resetIdle() {
        container.classList.remove('idle');
        clearTimeout(idleTimer);
        if (!isDragging && !menu.classList.contains('open')) {
            idleTimer = setTimeout(() => container.classList.add('idle'), 3000);
        }
    }

    function showSpinner() {
        if (!isHome()) return;
        const old = document.getElementById('xtm-spinner');
        if (old) old.remove();
        const s = document.createElement('div');
        s.id = 'xtm-spinner';
        s.innerHTML = `<div class="xtm-ring"></div>`;
        const tweet = document.querySelector('article');
        const rect = tweet ? tweet.getBoundingClientRect() : { left: window.innerWidth/2, top: 200, width: 0 };
        s.style.cssText = `position: fixed; top: ${rect.top + 50}px; left: ${rect.left + rect.width/2}px; transform: translate(-50%, -50%); z-index: 10000; pointer-events: none;`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 2000);
    }

    function actionUp() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (isHome()) {
            const homeBtn = document.querySelector('[data-testid="AppTabBar_Home_Link"], a[href="/home"]');
            if (homeBtn) { showSpinner(); homeBtn.click(); }
        }
    }

    function actionDown() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

    // --- Interaction Events ---
    container.onmousedown = (e) => {
        if (e.target.closest('#xtm-menu')) return;
        dragHoldTimer = setTimeout(() => {
            isDragging = true;
            dragThresholdMet = true;
            container.classList.add('dragging');
        }, 500);
    };

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.right = (window.innerWidth - e.clientX - 16) + 'px';
            container.style.bottom = (window.innerHeight - e.clientY - 48) + 'px';
            resetIdle();
        }
    });

    window.addEventListener('mouseup', () => {
        clearTimeout(dragHoldTimer);
        if (isDragging) {
            GM_setValue('btnPos', { right: parseInt(container.style.right), bottom: parseInt(container.style.bottom) });
            setTimeout(() => { isDragging = false; dragThresholdMet = false; container.classList.remove('dragging'); }, 50);
        } else { dragThresholdMet = false; }
    });

    btnUp.onclick = (e) => { e.stopPropagation(); if (!dragThresholdMet) actionUp(); };
    btnDown.onclick = (e) => { e.stopPropagation(); if (!dragThresholdMet) actionDown(); };
    btnMenu.onclick = (e) => { e.stopPropagation(); if (!dragThresholdMet) menu.classList.toggle('open'); resetIdle(); };

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;
        if (e.key.toLowerCase() === hotkeyUp.toLowerCase()) { e.preventDefault(); actionUp(); resetIdle(); }
        if (e.key.toLowerCase() === hotkeyDown.toLowerCase()) { e.preventDefault(); actionDown(); resetIdle(); }
    });

    document.addEventListener('mousedown', (e) => {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !btnMenu.contains(e.target)) {
            menu.classList.remove('open');
            resetIdle();
        }
    });

    // --- Helpers ---
    function createBtn(svg) {
        const b = document.createElement('div');
        b.className = 'xtm-btn';
        b.innerHTML = svg;
        return b;
    }

    function createMenu() {
        const m = document.createElement('div');
        m.id = 'xtm-menu';
        m.innerHTML = `
            <div class="xtm-row"><span>Auto Refresh</span><input type="checkbox" id="xtm-ar"></div>
            <div class="xtm-row"><span>Secs</span><input type="number" id="xtm-val" min="1"></div>
            <div class="xtm-row"><span>Key Up</span><input type="text" id="xtm-hk-u" readonly></div>
            <div class="xtm-row"><span>Key Down</span><input type="text" id="xtm-hk-d" readonly></div>
        `;
        const ar = m.querySelector('#xtm-ar');
        const val = m.querySelector('#xtm-val');
        const hku = m.querySelector('#xtm-hk-u');
        const hkd = m.querySelector('#xtm-hk-d');

        ar.checked = autoRefreshEnabled; val.value = refreshInterval; hku.value = hotkeyUp; hkd.value = hotkeyDown;

        ar.onchange = (e) => { autoRefreshEnabled = e.target.checked; GM_setValue('autoRefreshEnabled', autoRefreshEnabled); startTimer(); };
        val.onchange = (e) => { refreshInterval = Math.max(1, parseInt(e.target.value) || 5); GM_setValue('refreshInterval', refreshInterval); };
        hku.onkeydown = (e) => { e.preventDefault(); hotkeyUp = e.key; hku.value = e.key; GM_setValue('hotkeyUp', e.key); };
        hkd.onkeydown = (e) => { e.preventDefault(); hotkeyDown = e.key; hkd.value = e.key; GM_setValue('hotkeyDown', e.key); };
        
        return m;
    }

    function startTimer() {
        clearInterval(autoRefreshTick);
        if (!autoRefreshEnabled) { badge.classList.remove('active'); return; }
        secondsRemaining = refreshInterval;
        badge.classList.add('active');
        autoRefreshTick = setInterval(() => {
            badge.innerText = secondsRemaining;
            if (secondsRemaining <= 0) { actionUp(); secondsRemaining = refreshInterval; }
            else { secondsRemaining--; }
        }, 1000);
    }

    window.addEventListener('scroll', resetIdle, { passive: true });
    resetIdle();
    startTimer();

})();