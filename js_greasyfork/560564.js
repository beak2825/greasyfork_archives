// ==UserScript==
// @name         Torn Crimes - Search For Cash Pro
// @version      2.8
// @author       car [3581510]
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1553591
// @description Adds a persistent control panel to manage crime density thresholds, toggle safety guards, and highlight high-yield targets with accurate tooltip data.
// @downloadURL https://update.greasyfork.org/scripts/560564/Torn%20Crimes%20-%20Search%20For%20Cash%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560564/Torn%20Crimes%20-%20Search%20For%20Cash%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let guardEnabled = true;
    let threshold = 30;

    function getMutedColor(p) {
        let r, g, b = 0;
        if (p < 50) { r = 180; g = Math.round(3.6 * p); }
        else { r = Math.round(180 - 3.6 * (p - 50)); g = 140; b = 40; }
        return `rgb(${r}, ${g}, ${b})`;
    }

    function createControlPanel() {
        if (!window.location.hash.includes("/searchforcash")) return;
        if (document.getElementById('sfc-control-panel')) return;

        const levelBar = document.querySelector('div[class*="levelBar___"]');
        if (!levelBar) return;

        const panel = document.createElement('div');
        panel.id = 'sfc-control-panel';
        panel.style.cssText = 'background: #333; padding: 10px; margin: 8px 0; border-radius: 5px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #444; color: #fff; font-size: 12px;';

        const sliderContainer = document.createElement('div');
        sliderContainer.style.display = 'flex';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.gap = '10px';
        
        const sliderLabel = document.createElement('span');
        sliderLabel.id = 'threshold-val';
        sliderLabel.textContent = `Block below: ${threshold}%`;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = threshold;
        slider.oninput = (e) => {
            threshold = e.target.value;
            sliderLabel.textContent = `Block below: ${threshold}%`;
        };

        sliderContainer.append(sliderLabel, slider);

        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.gap = '8px';

        const radioOn = document.createElement('input');
        radioOn.type = 'radio';
        radioOn.name = 'sfc-guard';
        radioOn.checked = guardEnabled;
        radioOn.onclick = () => { guardEnabled = true; };

        const radioOff = document.createElement('input');
        radioOff.type = 'radio';
        radioOff.name = 'sfc-guard';
        radioOff.checked = !guardEnabled;
        radioOff.onclick = () => { guardEnabled = false; };

        toggleContainer.append("Safety Guard:", radioOn, "ON", radioOff, "OFF");
        panel.append(sliderContainer, toggleContainer);
        levelBar.after(panel);
    }

    function processDashboard() {
        if (!window.location.hash.includes("/searchforcash")) {
            const existingPanel = document.getElementById('sfc-control-panel');
            if (existingPanel) existingPanel.remove();
            return;
        }

        createControlPanel();

        const rows = Array.from(document.querySelectorAll('div[class*="sections___tZPkg"]'));
        let bestP = -1;
        let bestRow = null;

        rows.forEach(row => {
            const tooltip = row.querySelector('div[class*="densityTooltipTrigger"]');
            if (!tooltip) return;
            const match = (tooltip.getAttribute('aria-label') || "").match(/\((\d+)%\)/);
            if (match) {
                const p = parseInt(match[1]);
                row.dataset.density = p;
                if (p > bestP) { bestP = p; bestRow = row; }
            }
        });

        rows.forEach(row => {
            const titleEl = row.querySelector('div[class*="crimeOptionSection___hslpu"]');
            const searchBtn = row.querySelector('button[class*="commitButton"]');
            const p = parseInt(row.dataset.density || "0");
            const color = getMutedColor(p);

            if (titleEl && searchBtn) {
                titleEl.style.color = color;
                titleEl.style.fontWeight = 'bold';
                const base = titleEl.textContent.split(' (')[0].trim();
                if (!titleEl.textContent.includes(`(${p}%)`)) titleEl.textContent = `${base} (${p}%)`;

                const btnWrapper = searchBtn.querySelector('div[class*="childrenWrapper"]');
                
                if (guardEnabled && p < threshold) {
                    searchBtn.disabled = true;
                    searchBtn.style.opacity = '0.3';
                    if (btnWrapper && !btnWrapper.dataset.original) {
                        btnWrapper.dataset.original = btnWrapper.innerHTML;
                        btnWrapper.innerHTML = `<span style="font-size: 9px; color: #ff9999; font-weight: bold;">Percentage too low!</span>`;
                    }
                } else {
                    searchBtn.disabled = false;
                    searchBtn.style.opacity = '1';
                    if (btnWrapper && btnWrapper.dataset.original) {
                        btnWrapper.innerHTML = btnWrapper.dataset.original;
                        delete btnWrapper.dataset.original;
                    }
                }

                const oldBadge = row.querySelector('.best-choice-badge');
                if (oldBadge) oldBadge.remove();
                
                if (row === bestRow && p >= threshold) {
                    searchBtn.style.setProperty('border', `2px solid ${color}`, 'important');
                    searchBtn.style.setProperty('background-color', 'rgba(0,0,0,0.5)', 'important');
                    searchBtn.style.setProperty('color', '#ffffff', 'important');

                    const badge = document.createElement('div');
                    badge.className = 'best-choice-badge';
                    badge.textContent = '★ BEST CHOICE';
                    badge.style.cssText = `position: absolute; right: 5px; top: -14px; color: ${color}; font-size: 9px; font-weight: bold; text-shadow: 1px 1px 2px black;`;
                    searchBtn.parentElement.style.position = 'relative';
                    searchBtn.parentElement.appendChild(badge);
                } else {
                    searchBtn.style.border = '';
                    searchBtn.style.backgroundColor = '';
                    searchBtn.style.color = '';
                }
            }
        });
    }

    setInterval(processDashboard, 400);
})();