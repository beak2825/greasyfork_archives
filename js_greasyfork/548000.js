// ==UserScript==
// @name        Auto Close NotebookLM Panels
// @namespace   Violentmonkey Scripts
// @match       https://notebooklm.google.com/*
// @run-at      document-start
// @version     1.1
// @author      Bui Quoc Dung
// @description Close the source & studio panels after navigating to notebooklm
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548000/Auto%20Close%20NotebookLM%20Panels.user.js
// @updateURL https://update.greasyfork.org/scripts/548000/Auto%20Close%20NotebookLM%20Panels.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastUrl = null;
    let panelStates = {
        'Source': { userInteracted: false },
        'Studio': { userInteracted: false }
    };

    const CONFIG = {
        checkInterval: 1000,
        maxDuration: 5000,
        panels: [
            {
                name: 'Source',
                btn: 'button.toggle-source-panel-button',
                section: 'section.source-panel'
            },
            {
                name: 'Studio',
                btn: 'button.toggle-studio-panel-button',
                section: 'section.studio-panel'
            }
        ]
    };

    document.addEventListener('click', (e) => {
        CONFIG.panels.forEach(p => {
            if (e.target.closest(p.btn)) {
                if (e.isTrusted) {
                    panelStates[p.name].userInteracted = true;
                }
            }
        });
    }, true);

    function initAutoClose() {
        if (!location.pathname.startsWith('/notebook/')) return;

        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            panelStates.Source.userInteracted = false;
            panelStates.Studio.userInteracted = false;
            startLoop();
        }
    }

    function startLoop() {
        let elapsed = 0;
        const timer = setInterval(() => {
            CONFIG.panels.forEach(p => {
                const section = document.querySelector(p.section);
                const button = document.querySelector(p.btn);

                if (!panelStates[p.name].userInteracted && section && button) {
                    if (!section.classList.contains('panel-collapsed')) {
                        button.click();
                    }
                }
            });

            elapsed += CONFIG.checkInterval;
            if (elapsed >= CONFIG.maxDuration) clearInterval(timer);
        }, CONFIG.checkInterval);
    }

    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) initAutoClose();
    });
    observer.observe(document, { childList: true, subtree: true });

    const patch = (type) => {
        const orig = history[type];
        return function() {
            const rv = orig.apply(this, arguments);
            initAutoClose();
            return rv;
        };
    };
    history.pushState = patch('pushState');
    history.replaceState = patch('replaceState');
    window.addEventListener('popstate', initAutoClose);
    window.addEventListener('load', initAutoClose);

})();