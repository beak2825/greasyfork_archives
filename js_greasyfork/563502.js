// ==UserScript==
// @name         $1 Auction Navigator
// @namespace    MrLucasEE.Script
// @version      2.2
// @description  Click to navigate between current $1 auctions, updated weekly.
// @author       MrLucasEE with help by Gemini. Adapted from a script by Skarr02 [3462286].
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563502/%241%20Auction%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/563502/%241%20Auction%20Navigator.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // --- GUARD CLAUSES ---
    if (window.self !== window.top) return;
    if (document.getElementById('bazaarNavFloat')) return;

    // --- Configuration ---
    const rawIds = [
        3459303, 3656001, 2113568, 3280284, 3922073, 3650134, 3894434, 3597510, 3063478, 3388065, 3672282, 3866455, 3323759, 2607439, 2972834, 2765944, 1956938, 3351076, 2966467, 3636359,
        3949473, 3246784, 2332873, 3838787, 2629513, 3886744, 3724878, 2511408, 3397129, 3081881, 2450348, 3450348, 584064, 3407376, 3372673, 3402938, 2170976, 2580166, 3569967, 3600571,
        3549321, 3799808, 1636350, 2911228, 3232880, 3018883, 3528504, 3722369, 3521694, 3831612, 3809686, 3591323, 3682529, 2810688, 2737338, 3920168, 3303958, 3771189, 3465045, 3411403,
        3602729, 3923113, 2779945, 3461279, 2362815, 3429079, 3919319, 3963530, 1195734, 3859772, 3364078, 2862776, 3757038, 3047036, 3578512, 3364003, 3888369, 2139384, 288160, 3618339,
        2875897, 3662930, 2865837, 3298281, 3583749, 3666082, 3675575, 3787131, 3393752, 3342580, 3222877, 3722234, 2771196, 3651030, 2933938, 3684766, 3253015, 3953370, 2658048, 3260944,
        2842410, 3628284, 2930086, 3187441, 2803893, 3300790, 2893074, 3641938, 3458385, 3384523, 2642809, 3831844, 3324720, 3307942, 2734979, 3952653, 3724222, 2271807, 1010587, 3232732,
        3702492, 3834576, 3637460, 3395229, 3640032, 2225461, 3696702, 3604688, 3758850, 3729018, 3717504, 3761056, 3249754, 3794639, 1941593, 2011336, 3629768, 3710468, 3690575, 3473887,
        3167471, 3438807, 2493409, 3049928, 3619801, 3750519, 3899032, 2239233, 2086491, 3212450, 3518826, 3805449, 3803990, 2679739, 3712521, 3660990, 3450172, 3253836, 1593313, 1472890,
        3619531, 3569298, 3254494, 3377841, 3853187, 3472828, 3186599, 3818717, 2472641, 3845537, 3961834, 2203565, 2354402, 3462910, 3551559, 3212620, 3964395, 3701742, 3579175
    ];

    const uniqueIds = [...new Set(rawIds)];
    const links = uniqueIds.map(id => `https://www.torn.com/bazaar.php?userId=${id}`);

    // --- State Initialization ---
    let [index, isLocked, isMinimized, savedTop, savedLeft] = await Promise.all([
        GM_getValue('bazaarLinkIndex', 0),
        GM_getValue('bazaarLocked', false),
        GM_getValue('bazaarMinimized', false),
        GM_getValue('bazaarPosTop', 'auto'),
        GM_getValue('bazaarPosLeft', '10px')
    ]);

    const currentUrl = window.location.href;
    const foundIndex = links.findIndex(link => currentUrl.includes(link));
    
    if (foundIndex !== -1) {
        index = foundIndex;
        await GM_setValue('bazaarLinkIndex', index);
    }
    
    if (index >= links.length) index = 0;

    // --- Styling ---
    GM_addStyle(`
        #bazaarNavFloat {
            z-index: 999999;
            position: fixed;
            top: ${savedTop};
            left: ${savedLeft};
            bottom: ${savedTop === 'auto' ? '80px' : 'auto'};
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(232, 232, 232, 0.95);
            color: #111;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 14px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
            border: 1px solid #ccc;
            overflow: hidden;
            user-select: none;
            width: 150px;
            touch-action: none;
            transition: width 0.2s, opacity 0.2s;
        }

        /* Minimized State */
        #bazaarNavFloat.minimized {
            width: 50px; /* Small square */
            height: 28px;
        }
        #bazaarNavFloat.minimized #bazaarCounter,
        #bazaarNavFloat.minimized #bazaarBtnRow {
            display: none;
        }

        #bazaarNavFloat.unlocked { cursor: move; }
        #bazaarNavFloat.locked { cursor: default; }

        #bazaarBtnRow {
            display: flex;
            width: 100%;
        }

        #bazaarNavFloat button {
            background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%);
            border: 1px solid #ccc;
            border-top: none;
            padding: 10px 0;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            flex: 1;
            color: #111;
            text-shadow: 0 1px 0px #fff;
            transition: background 0.1s;
        }

        #bazaarNavFloat button:first-child { border-right: 1px solid #ccc; }
        #bazaarNavFloat button:hover { background: linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 100%); }
        #bazaarNavFloat button:active { background: #ccc; }

        #bazaarCounter {
            padding: 10px 0;
            width: 100%;
            text-align: center;
            border-bottom: 1px solid #ccc;
            position: relative;
        }

        /* Header Icons */
        .bazaar-icon-btn {
            position: absolute;
            top: 0;
            padding: 5px 8px;
            font-size: 14px;
            cursor: pointer;
            opacity: 0.5;
            z-index: 100;
        }
        .bazaar-icon-btn:hover { opacity: 1; }

        #bazaarLockBtn { right: 0; }
        #bazaarMinBtn { left: 0; font-weight: bold; }

        #bazaarCounter::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background: #666;
            transition: width 0s;
        }
        #bazaarCounter.loading::after {
            width: 100%;
            transition: width 1s linear;
        }
    `);

    // --- UI Construction ---
    const container = document.createElement('div');
    container.id = 'bazaarNavFloat';
    // Apply both locked and minimized classes if needed
    container.className = `${isLocked ? 'locked' : 'unlocked'} ${isMinimized ? 'minimized' : ''}`;

    const lockBtn = document.createElement('div');
    lockBtn.id = 'bazaarLockBtn';
    lockBtn.className = 'bazaar-icon-btn';
    lockBtn.textContent = isLocked ? '🔒' : '🔓';
    lockBtn.title = "Toggle Lock";

    const minBtn = document.createElement('div');
    minBtn.id = 'bazaarMinBtn';
    minBtn.className = 'bazaar-icon-btn';
    minBtn.textContent = isMinimized ? '+' : '—';
    minBtn.title = "Minimize/Maximize";

    const counter = document.createElement('div');
    counter.id = 'bazaarCounter';
    counter.textContent = `${index + 1} / ${links.length}`;

    const btnRow = document.createElement('div');
    btnRow.id = 'bazaarBtnRow';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '< Prev';
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next >';

    // --- Core Logic ---
    const navigateTo = async (newIndex) => {
        index = (newIndex + links.length) % links.length;
        await GM_setValue('bazaarLinkIndex', index);
        counter.textContent = `${index + 1} / ${links.length}`;
        window.location.href = links[index];
    };

    const resetToStart = async () => {
        counter.classList.remove('loading');
        navigateTo(0);
    };

    // --- Input Handlers ---
    const toggleLock = async (e) => {
        e.stopPropagation();
        isLocked = !isLocked;
        lockBtn.textContent = isLocked ? '🔒' : '🔓';
        
        // Update class list safely
        container.classList.remove('locked', 'unlocked');
        container.classList.add(isLocked ? 'locked' : 'unlocked');
        
        await GM_setValue('bazaarLocked', isLocked);
    };

    const toggleMin = async (e) => {
        e.stopPropagation();
        isMinimized = !isMinimized;
        minBtn.textContent = isMinimized ? '+' : '—';
        
        if (isMinimized) container.classList.add('minimized');
        else container.classList.remove('minimized');

        await GM_setValue('bazaarMinimized', isMinimized);
    };

    lockBtn.onclick = toggleLock;
    minBtn.onclick = toggleMin;
    nextBtn.onclick = (e) => { e.stopPropagation(); navigateTo(index + 1); };
    prevBtn.onclick = (e) => { e.stopPropagation(); navigateTo(index - 1); };

    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === "ArrowRight") navigateTo(index + 1);
        if (e.key === "ArrowLeft") navigateTo(index - 1);
    });

    // --- Drag & Hold System ---
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let pressTimer = null;

    const onMove = (e) => {
        if (!isDragging) return;
        
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();

        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
            counter.classList.remove('loading');
        }

        const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

        container.style.left = `${clientX - dragOffset.x}px`;
        container.style.top = `${clientY - dragOffset.y}px`;
        container.style.bottom = 'auto';
    };

    const onEnd = async () => {
        if (!isDragging) return;
        isDragging = false;
        
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        
        await GM_setValue('bazaarPosTop', container.style.top);
        await GM_setValue('bazaarPosLeft', container.style.left);
    };

    const onStart = (e) => {
        // Ignore clicks on controls
        if (e.target.closest('button') || e.target.classList.contains('bazaar-icon-btn')) return;
        
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();

        // Only start reset timer if NOT minimized
        if (!isMinimized) {
            counter.classList.add('loading');
            pressTimer = setTimeout(resetToStart, 1000);
        }

        // Drag if unlocked
        if (!isLocked) {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
            const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
            
            dragOffset.x = clientX - rect.left;
            dragOffset.y = clientY - rect.top;

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        }
    };

    const onRelease = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
            counter.classList.remove('loading');
        }
    };

    container.addEventListener('mousedown', onStart);
    container.addEventListener('touchstart', onStart, { passive: false });
    container.addEventListener('mouseup', onRelease);
    container.addEventListener('touchend', onRelease);
    container.addEventListener('mouseleave', onRelease);

    container.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.classList.contains('bazaar-icon-btn')) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

    container.append(minBtn, lockBtn);
    btnRow.append(prevBtn, nextBtn);
    container.append(counter, btnRow);
    document.body.appendChild(container);
})();
