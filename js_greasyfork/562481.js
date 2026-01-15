// ==UserScript==
// @name         TikTok Smart Sorter & Auto-Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sorts videos, auto-loads, and REMEMBERS panel position, collapse state, and scroll position.
// @author       trouvaiilx
// @license      GNU GPLv3
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562481/TikTok%20Smart%20Sorter%20%20Auto-Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/562481/TikTok%20Smart%20Sorter%20%20Auto-Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- State Variables ---
    let scrollInterval = null;
    let isScrolling = false;
    let isCollapsed = localStorage.getItem('tt_panel_collapsed') === 'true'; // Load saved state
    let lastUrl = window.location.href;
    let restoreAttempts = 0;

    // --- Helper: Key for Scroll Storage ---
    function getStorageKey() {
        const match = window.location.href.match(/(@[\w\d\._]+)/);
        return match ? `tt_scroll_${match[0]}` : null;
    }

    // --- Feature 1: Scroll Memory ---
    window.addEventListener('scroll', () => {
        if (window.location.href.includes('/@')) {
            const key = getStorageKey();
            if (key && window.scrollY > 100) {
                sessionStorage.setItem(key, window.scrollY);
            }
        }
    });

    function attemptScrollRestore() {
        const key = getStorageKey();
        if (!key) return;
        const savedPos = parseFloat(sessionStorage.getItem(key));
        if (!savedPos) return;

        if (document.body.scrollHeight > savedPos) {
            console.log(`[TikTok Fix] Restoring scroll to ${savedPos}`);
            window.scrollTo({ top: savedPos, behavior: 'auto' });
        }
    }

    // --- Feature 2: Parsing & Sorting ---
    function parseViewCount(text) {
        if (!text) return 0;
        let number = parseFloat(text);
        if (text.toUpperCase().includes('K')) number *= 1000;
        else if (text.toUpperCase().includes('M')) number *= 1000000;
        else if (text.toUpperCase().includes('B')) number *= 1000000000;
        return Math.floor(number);
    }

    function getVideoCount() {
        const container = document.querySelector('[data-e2e="user-post-item-list"]');
        return container ? container.children.length : 0;
    }

    function startAutoScroll(targetCount) {
        if (isScrolling) return;
        isScrolling = true;
        updateUIState(true);

        let lastHeight = 0;
        let sameHeightCount = 0;

        scrollInterval = setInterval(() => {
            let currentCount = getVideoCount();
            const display = document.getElementById('tt-count-display');
            if(display) display.innerText = `${currentCount} Loaded`;

            if (currentCount >= targetCount) {
                stopAutoScroll(`Target reached (${currentCount})`);
                return;
            }

            let currentHeight = document.body.scrollHeight;
            if (currentHeight === lastHeight) {
                sameHeightCount++;
                if (sameHeightCount >= 6) {
                    stopAutoScroll("End of profile reached");
                    return;
                }
            } else {
                sameHeightCount = 0;
                lastHeight = currentHeight;
            }

            window.scrollTo(0, document.body.scrollHeight);
        }, 500);
    }

    function stopAutoScroll(message) {
        clearInterval(scrollInterval);
        isScrolling = false;
        updateUIState(false);
        const statusLabel = document.getElementById('tt-status-label');
        if(statusLabel) statusLabel.innerText = message;
    }

    function sortVideos() {
        const container = document.querySelector('[data-e2e="user-post-item-list"]');
        if (!container) {
            alert("Video list not found. Switch to Videos tab.");
            return;
        }

        let items = Array.from(container.children);

        items.sort((a, b) => {
            let viewElA = a.querySelector('[data-e2e="video-views"]');
            let viewElB = b.querySelector('[data-e2e="video-views"]');
            let countA = viewElA ? parseViewCount(viewElA.textContent) : 0;
            let countB = viewElB ? parseViewCount(viewElB.textContent) : 0;
            return countB - countA;
        });

        items.forEach(item => container.appendChild(item));

        const statusLabel = document.getElementById('tt-status-label');
        if(statusLabel) statusLabel.innerText = `Sorted ${items.length} videos!`;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- UI Logic ---
    function updateUIState(scrolling) {
        const btnLoad = document.getElementById('tt-load-btn');
        const btnStop = document.getElementById('tt-stop-btn');
        const statusLabel = document.getElementById('tt-status-label');
        if (!btnLoad || !btnStop) return;

        if (scrolling) {
            btnLoad.style.display = 'none';
            btnStop.style.display = 'inline-block';
            statusLabel.innerText = 'Scrolling...';
        } else {
            btnLoad.style.display = 'inline-block';
            btnStop.style.display = 'none';
        }
    }

    function toggleCollapse() {
        const content = document.getElementById('tt-panel-content');
        const toggleBtn = document.getElementById('tt-toggle-btn');
        isCollapsed = !isCollapsed;

        // Save state to LocalStorage
        localStorage.setItem('tt_panel_collapsed', isCollapsed);

        if (isCollapsed) {
            content.style.display = 'none';
            toggleBtn.innerText = '+';
        } else {
            content.style.display = 'block';
            toggleBtn.innerText = '−';
        }
    }

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById("tt-control-panel-header");
        if (header) header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            // Save final position to LocalStorage
            localStorage.setItem('tt_panel_top', el.style.top);
            localStorage.setItem('tt_panel_left', el.style.left);
        }
    }

    function createPanel() {
        if (document.getElementById('tt-control-panel')) return;

        // Load saved position (default to 100px top, 20px left)
        const savedTop = localStorage.getItem('tt_panel_top') || '100px';
        const savedLeft = localStorage.getItem('tt_panel_left') || '20px';

        const panel = document.createElement('div');
        panel.id = 'tt-control-panel';
        panel.style.cssText = `position: fixed; top: ${savedTop}; left: ${savedLeft}; z-index: 99999; background: #121212; color: white; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.6); font-family: sans-serif; width: 220px; border: 1px solid #333; overflow: hidden;`;

        const header = document.createElement('div');
        header.id = 'tt-control-panel-header';
        header.style.cssText = `padding: 10px; background: #fe2c55; cursor: move; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 13px; user-select: none;`;

        const titleSpan = document.createElement('span');
        titleSpan.innerText = '🔥 TikTok Sorter';
        const toggleBtn = document.createElement('span');
        toggleBtn.id = 'tt-toggle-btn';
        toggleBtn.innerText = isCollapsed ? '+' : '−'; // Set initial button icon
        toggleBtn.style.cssText = 'cursor: pointer; font-size: 16px; font-weight: bold; padding: 0 5px;';
        toggleBtn.onclick = (e) => { e.stopPropagation(); toggleCollapse(); };

        header.appendChild(titleSpan);
        header.appendChild(toggleBtn);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.id = 'tt-panel-content';
        content.style.padding = '15px';

        // Apply initial collapse state
        if (isCollapsed) {
            content.style.display = 'none';
        }

        content.innerHTML += `<div id="tt-count-display" style="font-size: 12px; color: #ccc; margin-bottom: 10px; text-align:center;">0 Loaded</div>`;

        const inputArea = document.createElement('div');
        inputArea.style.marginBottom = '10px';
        inputArea.innerHTML = `<div style="display:flex; gap:5px; align-items: center;"><span style="font-size:11px; color:#aaa;">Limit:</span><input type="number" id="tt-target-input" value="100" style="flex: 1; padding: 4px; border-radius: 4px; border: 1px solid #444; background: #222; color: white; font-size: 12px;"></div>`;
        content.appendChild(inputArea);

        const btnRow = document.createElement('div');
        btnRow.style.display = 'flex';
        btnRow.style.gap = '5px';
        btnRow.style.marginBottom = '8px';

        const loadBtn = document.createElement('button');
        loadBtn.id = 'tt-load-btn';
        loadBtn.innerText = 'Load';
        loadBtn.style.cssText = 'flex:1; padding: 6px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
        loadBtn.onclick = () => startAutoScroll(parseInt(document.getElementById('tt-target-input').value) || 100);

        const stopBtn = document.createElement('button');
        stopBtn.id = 'tt-stop-btn';
        stopBtn.innerText = 'Stop';
        stopBtn.style.cssText = 'flex:1; padding: 6px; background: #fe2c55; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; display: none;';
        stopBtn.onclick = () => stopAutoScroll("Stopped by user");

        btnRow.appendChild(loadBtn);
        btnRow.appendChild(stopBtn);
        content.appendChild(btnRow);

        const sortBtn = document.createElement('button');
        sortBtn.innerText = '⚡ Sort & Top';
        sortBtn.style.cssText = 'width: 100%; padding: 8px; background: #fe2c55; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;';
        sortBtn.onclick = sortVideos;
        content.appendChild(sortBtn);

        const status = document.createElement('div');
        status.id = 'tt-status-label';
        status.innerText = 'Ready';
        status.style.cssText = 'margin-top: 8px; font-size: 10px; color: #666; text-align: center;';
        content.appendChild(status);

        panel.appendChild(content);
        document.body.appendChild(panel);

        makeDraggable(panel);
    }

    // --- MAIN LOOP ---
    setInterval(() => {
        const currentUrl = window.location.href;
        const isProfilePage = currentUrl.includes('/@') && !currentUrl.includes('/video/');
        const panel = document.getElementById('tt-control-panel');

        // 1. Navigation Detection
        if (currentUrl !== lastUrl) {
            if (isProfilePage) restoreAttempts = 5;
            lastUrl = currentUrl;
        }

        // 2. Scroll Restoration
        if (isProfilePage && restoreAttempts > 0) {
            attemptScrollRestore();
            restoreAttempts--;
        }

        // 3. Panel Management
        if (isProfilePage) {
            if (!panel) {
                createPanel();
            } else {
                const display = document.getElementById('tt-count-display');
                if (display && !isScrolling) display.innerText = `${getVideoCount()} Loaded`;
            }
        } else {
            if (panel) panel.remove();
        }
    }, 500);

})();