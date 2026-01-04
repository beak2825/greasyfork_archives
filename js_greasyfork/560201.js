// ==UserScript==
// @name         webbymans free admin script - websim
// @description  provided by ducksim - no gatekeeping
// @namespace    http://tampermonkey.net/
// @version      6.1
// @match        *://*.websim.ai/*
// @match        *://websim.ai/*
// @match        *://*.websim.com/*
// @match        *://websim.com/*
// @run-at       document-start
// @grant        none
// @allFrames    true
// @downloadURL https://update.greasyfork.org/scripts/560201/webbymans%20free%20admin%20script%20-%20websim.user.js
// @updateURL https://update.greasyfork.org/scripts/560201/webbymans%20free%20admin%20script%20-%20websim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // bug fix to prevent the script running twice if its in the same frame
    if (window.hasRunFlyHack) return;
    window.hasRunFlyHack = true;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // finding original script
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('main.js')) {

                    console.log('[DuckSim] intercepted main.js:', node.src);

                    // block original script
                    node.type = 'javascript/blocked';
                    const originalUrl = node.src;
                    node.remove();

                    // hi if youre reading this
                    fetch(originalUrl)
                        .then(response => response.text())
                        .then(code => {
                            // fixing imports
                            const baseUrl = originalUrl.substring(0, originalUrl.lastIndexOf('/') + 1);
                            code = code.replace(/from\s+['"]\.\/(.*?)['"]/g, `from "${baseUrl}$1"`);

                            // enable the fly/admin
                            code = code.replace(
                                /function isUsernameAdminOrCo\(name\)\s*\{[\s\S]*?\}/,
                                'function isUsernameAdminOrCo(name) { return true; }'
                            );

                            // injection
                            const blob = new Blob([code], { type: 'text/javascript' });
                            const newScript = document.createElement('script');
                            newScript.type = 'module';
                            newScript.src = URL.createObjectURL(blob);
                            document.documentElement.appendChild(newScript);

                            console.log('[DuckSim] injected cheat');
                        });
                }
            });
        });
    });

    // the end.. absolute cinema
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();

// merry christmas