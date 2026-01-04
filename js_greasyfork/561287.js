// ==UserScript==
// @name         FV - Single Click Fairy in Inventory
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Single click using any fairy or openable item in inventory pages. To open items in their separate pae, go to your inventory and right click the fairy you want to open > open link in new tab. It will auto start, you click once to confirm the roll.
// @match        https://www.furvilla.com/inventory/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561287/FV%20-%20Single%20Click%20Fairy%20in%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/561287/FV%20-%20Single%20Click%20Fairy%20in%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickUseButtons() {
        document.querySelectorAll('a.btn.pull-left[data-url*="/use/"]').forEach(btn => {
            if (!btn.dataset.clicked) {
                btn.dataset.clicked = 'true';
                btn.click();
            }
        });
    }

    function observeModal() {
        const observer = new MutationObserver((mutations, obs) => {
            const modal = document.querySelector('.modal-dialog');
            if (modal) {
                const continueBtn = modal.querySelector('input[type="submit"][value="Continue"]');
                if (continueBtn) {
                    continueBtn.click();
                    obs.disconnect();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            clickUseButtons();
            observeModal();
        }, 1000);
    });

    setInterval(() => {
        clickUseButtons();
    }, 3000);
})();