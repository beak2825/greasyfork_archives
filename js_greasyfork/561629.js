// ==UserScript==
// @name         PepeHash Auto Collect
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Auto-collect on dashboard
// @author       Rubystance
// @license      MIT
// @match        https://pepehash.lovable.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561629/PepeHash%20Auto%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/561629/PepeHash%20Auto%20Collect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REF_CODE = 'A047F1BA';
    const REF_KEY = 'pepehash_ref_used';

    if (!localStorage.getItem(REF_KEY)) {
        localStorage.setItem(REF_KEY, 'true');
        if (!location.search.includes('ref=')) {
            location.replace(`https://pepehash.lovable.app/?ref=${REF_CODE}`);
            return;
        }
    }

    function observeCollectButton() {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('button').forEach(btn => {
                if (
                    btn.textContent.includes('Collect') &&
                    !btn.disabled
                ) {
                    btn.click();
                    console.log('Collect button clicked!');
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    if (location.pathname.startsWith('/dashboard')) {
        observeCollectButton();
    }

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (location.pathname.startsWith('/dashboard')) {
                observeCollectButton();
            }
        }
    }, 500);

})();
