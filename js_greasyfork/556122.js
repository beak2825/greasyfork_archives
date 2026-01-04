// ==UserScript==
// @name         Torn - Drug Cooldown Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Show "DRUG CD OVER" if no drug cd
// @author       SuperGogu
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556122/Torn%20-%20Drug%20Cooldown%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/556122/Torn%20-%20Drug%20Cooldown%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createPanel() {
        let panel = document.getElementById('tm-drugcd-panel');
        if (panel) return panel;

        panel = document.createElement('div');
        panel.id = 'tm-drugcd-panel';
        panel.textContent = 'DRUG CD OVER';

        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.zIndex = '99999';
        panel.style.padding = '6px 12px';
        panel.style.borderRadius = '6px';
        panel.style.background = 'rgba(0, 0, 0, 0.85)';
        panel.style.color = '#00ff00';
        panel.style.fontWeight = 'bold';
        panel.style.fontSize = '14px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.5)';
        panel.style.pointerEvents = 'none';
        panel.style.display = 'none'; 

        document.body.appendChild(panel);
        return panel;
    }

    function hasDrugCooldown() {
        const statusUl = document.querySelector('ul[class*="status-icons"][class*="big"]');
        if (!statusUl) return false;

        const drugIcon = statusUl.querySelector('a[aria-label^="Drug Cooldown"]');
        return !!drugIcon;
    }

    function updatePanel() {
        const panel = createPanel();
        if (!document.body.contains(panel)) {
            document.body.appendChild(panel);
        }

        if (hasDrugCooldown()) {
            // Ai încă Drug CD -> nu afișăm mesajul
            panel.style.display = 'none';
        } else {
            // Nu ai Drug CD -> afișăm mesajul
            panel.style.display = 'block';
        }
    }

    function initObserver() {
        const statusUl = document.querySelector('ul[class*="status-icons"][class*="big"]');
        if (!statusUl) {
            setTimeout(initObserver, 1000);
            return;
        }

        updatePanel();

        const observer = new MutationObserver(() => {
            updatePanel();
        });

        observer.observe(statusUl, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    function start() {
        createPanel();
        initObserver();

        setInterval(updatePanel, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
