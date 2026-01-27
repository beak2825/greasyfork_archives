// ==UserScript==
// @name         🍪 Recipe Automator
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Mobile-optimized Latte UI with persistent timer and touch support.
// @author       anon
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character/Recipe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564013/%F0%9F%8D%AA%20Recipe%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/564013/%F0%9F%8D%AA%20Recipe%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Import Inter Font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap';
    document.head.appendChild(fontLink);

    const INTERVAL_MS = 61 * 60 * 1000;
    const BUTTON_ID = 'ctl00_cphLeftColumn_ctl00_btnUseRecipe';
    const STORAGE_KEY = 'popmundo_next_bake_time';

    // --- Persistence Logic ---
    function getNextClickTime() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const time = parseInt(stored, 10);
            if (!isNaN(time)) return time;
        }
        const newTime = Date.now() + INTERVAL_MS;
        localStorage.setItem(STORAGE_KEY, newTime);
        return newTime;
    }

    let nextClickTime = getNextClickTime();

    // --- UI Construction ---
    const ui = document.createElement('div');
    ui.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 140px;
        background: #FDFCFB;
        border: 1px solid #E6D5C3;
        border-radius: 20px;
        box-shadow: 0 12px 30px rgba(71, 54, 41, 0.1);
        z-index: 10001;
        font-family: 'Inter', sans-serif;
        padding: 15px;
        text-align: center;
        user-select: none;
        touch-action: none; /* Prevents scrolling while dragging UI */
    `;

    const emojiContainer = document.createElement('div');
    emojiContainer.innerHTML = '🍪';
    emojiContainer.style.cssText = `
        font-size: 45px;
        margin-bottom: 5px;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
        cursor: grab;
    `;

    const label = document.createElement('div');
    label.innerText = 'AUTO-BAKER';
    label.style.cssText = `
        font-size: 9px;
        font-weight: 800;
        color: #A68966;
        letter-spacing: 1px;
        margin-bottom: 10px;
    `;

    const timer = document.createElement('div');
    timer.style.cssText = `
        font-size: 20px;
        font-weight: 300;
        color: #473629;
        margin-bottom: 10px;
    `;

    const track = document.createElement('div');
    track.style.cssText = `
        width: 100%;
        height: 4px;
        background: #F0E6D2;
        border-radius: 10px;
        margin-bottom: 15px;
        overflow: hidden;
    `;
    const bar = document.createElement('div');
    bar.style.cssText = `
        width: 0%;
        height: 100%;
        background: #C4A484;
    `;
    track.appendChild(bar);

    const btnAction = document.createElement('button');
    btnAction.innerText = 'Bake Now';
    btnAction.style.cssText = `
        width: 100%;
        padding: 8px;
        background: #473629;
        color: #FDFCFB;
        border: none;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
    `;
    btnAction.onclick = () => attemptClick();

    ui.appendChild(emojiContainer);
    ui.appendChild(label);
    ui.appendChild(timer);
    ui.appendChild(track);
    ui.appendChild(btnAction);
    document.body.appendChild(ui);

    // --- Logic ---
    function attemptClick() {
        const targetBtn = document.getElementById(BUTTON_ID);
        if (targetBtn && !targetBtn.disabled) {
            nextClickTime = Date.now() + INTERVAL_MS;
            localStorage.setItem(STORAGE_KEY, nextClickTime);
            targetBtn.click();
        }
    }

    function refresh() {
        const now = Date.now();
        const diff = nextClickTime - now;

        if (diff <= 0) {
            timer.innerText = "Ready!";
            bar.style.width = "100%";
            attemptClick();
        } else {
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            timer.innerText = `${m}:${s.toString().padStart(2, '0')}`;
            const progress = 100 - (diff / INTERVAL_MS * 100);
            bar.style.width = `${Math.max(0, progress)}%`;
        }
    }

    // Refresh every second
    setInterval(refresh, 1000);

    // Wake-up logic: If the tab was asleep, check the time immediately on wake
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            nextClickTime = getNextClickTime();
            refresh();
        }
    });

    // --- Mobile & Desktop Dragging ---
    let isDragging = false, currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === emojiContainer || emojiContainer.contains(e.target)) isDragging = true;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            ui.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    ui.addEventListener("touchstart", dragStart, false);
    document.addEventListener("touchend", dragEnd, false);
    document.addEventListener("touchmove", drag, false);
    ui.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", drag, false);

})();