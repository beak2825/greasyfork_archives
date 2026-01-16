// ==UserScript==
// @name         Gemini Model Autopilot (Fast & Think (Multilingual & Manual Override))
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Switches between Fast and Thinking mode (DE/EN), allows manual override.
// @author       Steffen
// @match        *://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562745/Gemini%20Model%20Autopilot%20%28Fast%20%20Think%20%28Multilingual%20%20Manual%20Override%29%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562745/Gemini%20Model%20Autopilot%20%28Fast%20%20Think%20%28Multilingual%20%20Manual%20Override%29%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIG ---
    const FAST_GEM_IDS = [
        "3e1ed5bc8347",
        "ID_VON_GEM_2"
    ];
    // Determine which group of names we are looking for
    // Begriffe für die Erkennung (DE und EN)
    const LABELS_THINKING = ['Thinking-Modus', 'Thinking','Thinking mode'];
    const LABELS_FAST = ['Fast', 'Schnell']; // Falls Google "Schnell" einführt
    const ALL_MODELS = [...LABELS_THINKING, ...LABELS_FAST, 'Pro', 'Gemini Advanced'];
    // --------------

    let isProcessing = false;
    let lastUrl = "";
    let hasAutoSwitchedForCurrentUrl = false;

    function autopilot() {
        const currentURL = window.location.href;

        if (currentURL !== lastUrl) {
            lastUrl = currentURL;
            hasAutoSwitchedForCurrentUrl = false;
        }

        if (hasAutoSwitchedForCurrentUrl || isProcessing) return;

        const isTargetFast = FAST_GEM_IDS.some(id => currentURL.includes(id)) || currentURL.includes('model=fast');

        const allSpans = Array.from(document.querySelectorAll('span'));
        const currentModelSpan = allSpans.find(s =>
            ALL_MODELS.includes(s.textContent.trim())
        );

        if (!currentModelSpan) return;

        const currentModelText = currentModelSpan.textContent.trim();
        let targetLabels = [];

        // Terms for detection (DE and EN)
        // Bestimme, welche Gruppe von Namen wir suchen
        if (isTargetFast) {
            if (LABELS_FAST.includes(currentModelText)) {
                hasAutoSwitchedForCurrentUrl = true;
                return;
            }
            targetLabels = LABELS_FAST;
        } else {
            if (LABELS_THINKING.includes(currentModelText)) {
                hasAutoSwitchedForCurrentUrl = true;
                return;
            }
            targetLabels = LABELS_THINKING;
        }

        const btn = currentModelSpan.closest('button');
        if (btn) {
            isProcessing = true;
            btn.click();

            setTimeout(() => {
                const menuOptions = Array.from(document.querySelectorAll('span'));
                // Search the menu for ANY of the valid labels (e.g., "Thinking mode" OR "Thinking-Modus")
                // Suche im Menü nach IRGENDEINEM der gültigen Labels (z.B. "Thinking mode" ODER "Thinking-Modus")
                const targetOption = menuOptions.find(s => targetLabels.includes(s.textContent.trim()));

                if (targetOption) {
                    const clickable = targetOption.closest('div[role="menuitem"]') || targetOption.parentElement;
                    clickable.click();
                    console.log(`Autopilot: Switched to ${targetOption.textContent.trim()}`);
                }

                hasAutoSwitchedForCurrentUrl = true;
                setTimeout(() => { isProcessing = false; }, 1000);
            }, 300);
        }
    }

    setInterval(autopilot, 500);
    window.addEventListener('popstate', autopilot);
})();