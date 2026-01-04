// ==UserScript==
// @name         Netflix Challenge Logger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Log Netflix challenge
// @match        https://www.netflix.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560804/Netflix%20Challenge%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/560804/Netflix%20Challenge%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('cadmium-playercore')) {
                    console.log('Netflix Player Script detected:', node.src);

                    const originalSrc = node.src;
                    node.src = '';

                    fetch(originalSrc)
                        .then(res => res.text())
                        .then(scriptText => {
                            const modifiedScript = scriptText.replace(
                                /p\.log\.trace\("Challenge generated",\s*q\);/g,
                                'p.log.trace("Challenge generated", q); console.log("=== NETFLIX CHALLENGE ===", q); window.__nfChallenge = q;'
                            );

                            const scriptElement = document.createElement('script');
                            scriptElement.textContent = modifiedScript;
                            document.head.appendChild(scriptElement);
                        })
                        .catch(err => console.error('Failed to modify script:', err));
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();