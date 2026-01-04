// ==UserScript==
// @name         Disable ratelimit on dl.malwarewatch.org
// @namespace    http://tampermonkey.net/
// @version      2025-09-30
// @description  Block the shitty ratelimit from dl.malwarewatch.org
// @author       needsomewater11
// @match        https://dl.malwarewatch.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=malwarewatch.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551170/Disable%20ratelimit%20on%20dlmalwarewatchorg.user.js
// @updateURL https://update.greasyfork.org/scripts/551170/Disable%20ratelimit%20on%20dlmalwarewatchorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // this is the shit
    const fuckyouendermanch = 'https://dl.malwarewatch.org/check_ratelimit.js';

    // the other shit thats important to block
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT' && node.src.includes(fuckyouendermanch)) {
                        console.log('ANALLY PENETREATED THE RATELIMIT (GET FUCKED ENDERMANCH FUCK YOU!)');
                        node.remove();
                    }
                });
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();