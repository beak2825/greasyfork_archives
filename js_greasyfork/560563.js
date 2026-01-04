// ==UserScript==
// @name         Torn Crimes - Disposal Efficiency Pro
// @version      3.4
// @author       car [3581510]
// @description  Solely active on the Disposal page. Adds a toggle panel to hide risky disposal methods.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1553591
// @downloadURL https://update.greasyfork.org/scripts/560563/Torn%20Crimes%20-%20Disposal%20Efficiency%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560563/Torn%20Crimes%20-%20Disposal%20Efficiency%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let guardEnabled = true;

    const disposalEfficiency = {
        "Biological Waste": ["Sink"],
        "Body Part": ["Dissolve"],
        "Building Debris": ["Sink"],
        "Dead Body": ["Bury", "Dissolve"],
        "Documents": ["Burn"],
        "Firearm": ["Sink"],
        "General Waste": ["Bury", "Burn"],
        "Industrial Waste": ["Sink"],
        "Murder Weapon": ["Sink"],
        "Old Furniture": ["Burn"],
        "Broken Appliance": ["Sink"],
        "Vehicle": ["Burn", "Sink"]
    };

    const style = document.createElement('style');
    style.textContent = `
        .disposal-safe {
            border: 2px solid #37b24d !important;
            background: rgba(55, 178, 77, 0.2) !important;
            border-radius: 50% !important;
            opacity: 1 !important;
            filter: none !important;
        }
        .disposal-grey {
            opacity: 0.15 !important;
            filter: grayscale(1) brightness(0.7) !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);

    function createControlPanel() {
        if (!window.location.hash.includes("/disposal")) return;
        if (document.getElementById('disposal-control-panel')) return;

        const levelBar = document.querySelector('div[class*="levelBar___"]');
        if (!levelBar) return;

        const panel = document.createElement('div');
        panel.id = 'disposal-control-panel';
        panel.style.cssText = 'background: #333; padding: 10px; margin: 8px 0; border-radius: 5px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #444; color: #fff; font-size: 12px;';

        const label = document.createElement('span');
        label.textContent = "Toggle Safety Guard (Hide Risky Methods):";

        const toggleContainer = document.createElement('div');
        toggleContainer.style.display = 'flex';
        toggleContainer.style.gap = '10px';

        const radioOn = document.createElement('input');
        radioOn.type = 'radio';
        radioOn.name = 'disposal-guard';
        radioOn.checked = guardEnabled;
        radioOn.onclick = () => { guardEnabled = true; handleDisposal(); };

        const radioOff = document.createElement('input');
        radioOff.type = 'radio';
        radioOff.name = 'disposal-guard';
        radioOff.checked = !guardEnabled;
        radioOff.onclick = () => { guardEnabled = false; handleDisposal(); };

        toggleContainer.append(radioOn, "ON", radioOff, "OFF");
        panel.append(label, toggleContainer);
        levelBar.after(panel);
    }

    function handleDisposal() {
        if (!window.location.hash.includes("/disposal")) {
            const existingPanel = document.getElementById('disposal-control-panel');
            if (existingPanel) existingPanel.remove();
            return;
        }

        createControlPanel();

        const items = document.querySelectorAll('div[class*="virtualItem"]');
        items.forEach(item => {
            const categoryEl = item.querySelector('div[class*="flexGrow"]');
            if (!categoryEl) return;

            const categoryName = categoryEl.textContent.trim();
            const guaranteedMethods = disposalEfficiency[categoryName];
            if (!guaranteedMethods) return;

            const buttons = item.querySelectorAll('button[class*="methodButton"]');
            buttons.forEach(btn => {
                const label = btn.getAttribute('aria-label');
                if (!label) return;

                btn.classList.remove('disposal-safe', 'disposal-grey');
                const isGuaranteed = guaranteedMethods.some(m => label.includes(m));

                if (isGuaranteed) {
                    btn.classList.add('disposal-safe');
                } else if (guardEnabled) {
                    btn.classList.add('disposal-grey');
                }
            });
        });
    }

    const observer = new MutationObserver(handleDisposal);
    const targetNode = document.getElementById('mainContainer');
    if (targetNode) observer.observe(targetNode, { childList: true, subtree: true });
    
    setInterval(handleDisposal, 300);
})();