// ==UserScript==
// @name         YouTube to DownSub (With Format Choice)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Automated subtitle download via DownSub with format selection popup
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

        let currentUrl = location.href;

        // --- POPUP LOGIC ---
        function createFormatPopup() {
            // Remove existing if any
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

            // Append everything
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
            // We append the selected format to the URL (target_fmt)
            window.open(`https://downsub.com/?url=${videoUrl}&auto_dl=1&target_fmt=${format}`, '_blank');
        }

        // --- BUTTON INJECTION ---
        function addButton() {
            if (document.getElementById('ds-download-btn')) return;

            const validSelectors = [
                '#top-level-buttons-computed',
                '#flexible-item-buttons',
                'ytd-menu-renderer #top-level-buttons-computed'
            ];

            let container = null;
            for (let sel of validSelectors) {
                container = document.querySelector(sel);
                if (container) break;
            }

            if (window.location.pathname === '/watch' && container) {
                const btn = document.createElement('button');
                btn.id = 'ds-download-btn';
                btn.innerText = 'Download Subtitle';
                btn.style.cssText = `
                    background-color: #2c3e50; color: white; border: 1px solid #e67e22;
                    border-radius: 18px; padding: 0 16px; margin-left: 8px;
                    height: 36px; font-size: 14px; font-weight: 700;
                    cursor: pointer; display: flex; align-items: center;
                `;

                btn.onmouseover = () => { btn.style.backgroundColor = '#e67e22'; };
                btn.onmouseout = () => { btn.style.backgroundColor = '#2c3e50'; };

                // Open the popup instead of direct link
                btn.onclick = createFormatPopup;

                container.appendChild(btn);
            }
        }

        const observer = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(addButton, 500);
            }
            addButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(addButton, 1000);
    }

    // ==========================================
    // PART 2: DOWNSUB
    // ==========================================
    if (window.location.hostname.includes('downsub.com')) {

        // 1. Check if we should run
        if (!window.location.href.includes('auto_dl=1')) return;

        // 2. Determine target format from URL (Default to TXT if missing)
        const urlParams = new URLSearchParams(window.location.search);
        const targetFormat = urlParams.get('target_fmt') || 'TXT';

        console.log(`⚡ Auto-Downloader Active. Target: ${targetFormat}`);

        let hasClicked = false;

        const checkLoop = setInterval(() => {
            if (hasClicked) return;

            const candidates = document.querySelectorAll('button, a');

            for (let el of candidates) {
                const text = el.textContent.trim();

                // DYNAMIC CHECK: Matches "SRT" or "TXT" depending on user choice
                // Logic: Text matches target exactly OR contains target but is NOT a translation button
                if (text === targetFormat || (text.includes(targetFormat) && !text.includes('Translate'))) {

                    console.log(`⚡ Target (${targetFormat}) found:`, el);

                    el.click();
                    hasClicked = true;
                    clearInterval(checkLoop);

                    setTimeout(() => {
                        window.close();
                    }, 1500);

                    break;
                }
            }
        }, 100);

        setTimeout(() => clearInterval(checkLoop), 15000);
    }

})();