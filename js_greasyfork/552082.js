// ==UserScript==
// @name         Blooket Auto-Reveal Packs with Drag & Pack Filter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-reveals selected Blooket Market packs with a draggable black overlay and pack name filter.
// @author       King's group
// @license      MIT
// @match        https://dashboard.blooket.com/market*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552082/Blooket%20Auto-Reveal%20Packs%20with%20Drag%20%20Pack%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/552082/Blooket%20Auto-Reveal%20Packs%20with%20Drag%20%20Pack%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoRevealEnabled = true;
    let revealCount = 0;
    let filterPackName = '';

    // Create draggable overlay panel
    function createOverlay() {
        if (document.getElementById('blooket-auto-reveal-ui')) return;

        const panel = document.createElement('div');
        panel.id = 'blooket-auto-reveal-ui';
        panel.style.position = 'fixed';
        panel.style.bottom = '12px';
        panel.style.right = '12px';
        panel.style.zIndex = 99999;
        panel.style.background = '#000';
        panel.style.color = '#fff';
        panel.style.border = '3px solid #ff0000';
        panel.style.borderRadius = '8px';
        panel.style.padding = '10px';
        panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontSize = '13px';
        panel.style.width = '200px';
        panel.style.cursor = 'move';
        panel.style.transition = 'border-color 2s linear';

        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">Blooket Auto-Reveal</div>
            <div style="margin-bottom:6px;">
                <label>
                    <input type="checkbox" id="bfo-toggle" checked> Enable Auto-Reveal
                </label>
            </div>
            <div style="margin-bottom:6px;">
                Filter Pack: <input type="text" id="bfo-pack-filter" placeholder="Spooky Pack" style="width:100%;padding:2px;font-size:12px;margin-top:2px;">
            </div>
            <div style="margin-bottom:6px;">Revealed Packs: <span id="bfo-count">0</span></div>
            <button id="bfo-reset" style="padding:4px 6px;">Reset Counter</button>
        `;

        document.body.appendChild(panel);

        // Toggle Auto-Reveal
        document.getElementById('bfo-toggle').addEventListener('change', (e) => {
            autoRevealEnabled = e.target.checked;
        });

        // Filter Pack Name
        document.getElementById('bfo-pack-filter').addEventListener('input', (e) => {
            filterPackName = e.target.value.trim().toLowerCase();
        });

        // Reset counter
        document.getElementById('bfo-reset').addEventListener('click', () => {
            revealCount = 0;
            document.getElementById('bfo-count').textContent = revealCount;
        });

        // Color cycle border
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            panel.style.borderColor = `hsl(${hue}, 100%, 50%)`;
        }, 100);

        // Make draggable
        let isDragging = false;
        let offsetX, offsetY;

        panel.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = e.clientX - offsetX + 'px';
                panel.style.top = e.clientY - offsetY + 'px';
                panel.style.bottom = 'auto';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.transition = 'border-color 2s linear';
        });
    }

    createOverlay();

    // Click Show/Reveal button if pack matches filter
    function clickShowButton() {
        if (!autoRevealEnabled) return;

        const modalTitle = document.querySelector('h1,h2,h3,h4,h5,h6')?.innerText?.trim().toLowerCase() || '';
        if (filterPackName && !modalTitle.includes(filterPackName)) return; // skip if doesn't match

        const showBtn = Array.from(document.querySelectorAll('button, div'))
            .find(el => {
                const text = (el.innerText || '').trim().toLowerCase();
                return text === 'show' || text === 'reveal' || text === 'open' || text.includes('view');
            });
        if (showBtn) {
            showBtn.click();
            revealCount++;
            const countEl = document.getElementById('bfo-count');
            if (countEl) countEl.textContent = revealCount;
            console.log("Auto-Reveal: clicked a button");
        }
    }

    // Observe for new modal/dialog
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const role = node.getAttribute('role') || '';
                        const classNames = node.className || '';
                        if (role.toLowerCase() === 'dialog' || classNames.toLowerCase().includes('modal')) {
                            setTimeout(clickShowButton, 300);
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
