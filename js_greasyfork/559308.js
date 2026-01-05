// ==UserScript==
// @name         YouTube to DownSub (With Format Choice)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Automated subtitle download via DownSub with format selection popup.
// @author       You
// @match        https://www.youtube.com/*
// @match        https://downsub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=downsub.com
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/559308/YouTube%20to%20DownSub%20%28With%20Format%20Choice%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559308/YouTube%20to%20DownSub%20%28With%20Format%20Choice%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // PART 1: YOUTUBE
    // ==========================================
    if (window.location.hostname.includes('youtube.com')) {

        // --- POPUP LOGIC ---
        function createFormatPopup() {
            if (document.getElementById('ds-popup-overlay')) return;

            // 1. Overlay
            const overlay = document.createElement('div');
            overlay.id = 'ds-popup-overlay';
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.5); z-index: 9999;
                display: flex; justify-content: center; align-items: center;
            `;
            overlay.onclick = (e) => { if(e.target === overlay) closePopup(); };

            // 2. The Box
            const box = document.createElement('div');
            box.style.cssText = `
                background: #1f1f1f; padding: 20px; border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5); text-align: center;
                font-family: Roboto, Arial, sans-serif; min-width: 250px;
                border: 1px solid #333; color: white;
            `;

            // 3. Title
            const title = document.createElement('h3');
            title.innerText = 'Select Format';
            title.style.margin = '0 0 20px 0';
            title.style.fontSize = '18px';

            // 4. Buttons Container
            const btnContainer = document.createElement('div');
            btnContainer.style.display = 'flex';
            btnContainer.style.justifyContent = 'space-around';
            btnContainer.style.gap = '10px';

            // 5. Button Creator Helper
            const createBtn = (text, color, formatCode) => {
                const b = document.createElement('button');
                b.innerText = text;
                b.style.cssText = `
                    padding: 10px 20px; border: none; border-radius: 6px;
                    background-color: ${color}; color: white; font-weight: bold;
                    cursor: pointer; font-size: 14px; transition: opacity 0.2s;
                `;
                b.onmouseover = () => b.style.opacity = '0.8';
                b.onmouseout = () => b.style.opacity = '1';
                b.onclick = () => {
                    openDownSub(formatCode);
                    closePopup();
                };
                return b;
            };

            const srtBtn = createBtn('SRT', '#3498db', 'SRT');
            const txtBtn = createBtn('TXT', '#e67e22', 'TXT');

            btnContainer.appendChild(srtBtn);
            btnContainer.appendChild(txtBtn);
            box.appendChild(title);
            box.appendChild(btnContainer);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }

        function closePopup() {
            const overlay = document.getElementById('ds-popup-overlay');
            if (overlay) overlay.remove();
        }

        function openDownSub(format) {
            const videoUrl = encodeURIComponent(window.location.href);
            window.open(`https://downsub.com/?url=${videoUrl}&auto_dl=1&target_fmt=${format}`, '_blank');
        }

        // --- BUTTON INJECTION ---
        function tryInjectButton() {
            // 1. Only run on Watch pages
            if (!window.location.pathname.startsWith('/watch')) return;

            // 2. Check if button already exists
            if (document.getElementById('ds-download-btn')) return;

            // 3. Find the container (Updated Selectors for 2025 compatibility)
            const selectors = [
                'ytd-watch-metadata #top-level-buttons-computed', // Newest YouTube UI
                '#top-level-buttons-computed',                    // Older UI
                '#flexible-item-buttons',                         // Flexible container
                'ytd-menu-renderer #top-level-buttons-computed'   // Fallback
            ];

            let container = null;
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.offsetParent !== null) { // Check visibility
                    container = el;
                    break;
                }
            }

            // 4. Create and Inject the button (With your Original Style)
            if (container) {
                const btn = document.createElement('button');
                btn.id = 'ds-download-btn';
                btn.innerText = 'Download Subtitle';

                // RESTORED ORIGINAL STYLING
                btn.style.cssText = `
                    background-color: #2c3e50; color: white; border: 1px solid #e67e22;
                    border-radius: 18px; padding: 0 16px; margin-left: 8px;
                    height: 36px; font-size: 14px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center;
                `;

                btn.onmouseover = () => { btn.style.backgroundColor = '#e67e22'; };
                btn.onmouseout = () => { btn.style.backgroundColor = '#2c3e50'; };

                btn.onclick = (e) => {
                    e.preventDefault(); // Stop YouTube from clicking background elements
                    createFormatPopup();
                };

                container.appendChild(btn);
            }
        }

        // --- HEARTBEAT CHECK ---
        // Checks every second. If the user navigates to a new video,
        // the button is re-added automatically without refreshing.
        setInterval(tryInjectButton, 1000);
    }

    // ==========================================
    // PART 2: DOWNSUB
    // ==========================================
    if (window.location.hostname.includes('downsub.com')) {

        if (!window.location.href.includes('auto_dl=1')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const targetFormat = urlParams.get('target_fmt') || 'TXT';

        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max wait time

        const downsubInterval = setInterval(() => {
            attempts++;
            if (attempts > maxAttempts) clearInterval(downsubInterval);

            const buttons = document.querySelectorAll('button, a');

            for (let el of buttons) {
                const text = el.textContent.trim().toUpperCase();

                // Check matches format but ignore "Translate" buttons
                if ((text === targetFormat || text.includes(targetFormat)) && !text.includes('TRANSLATE')) {

                    el.click();
                    clearInterval(downsubInterval);

                    setTimeout(() => {
                        window.close();
                    }, 1500);

                    return;
                }
            }
        }, 1000);
    }

})();