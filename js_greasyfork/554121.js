// ==UserScript==
// @name         Auto retry Grok Imagine
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Grok Imagineの動画生成が中断（Moderate）された場合に自動で再試行します。
// @match        https://grok.com/imagine/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554121/Auto%20retry%20Grok%20Imagine.user.js
// @updateURL https://update.greasyfork.org/scripts/554121/Auto%20retry%20Grok%20Imagine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", () => {
        const timer = setInterval(() => {
            const targetNode = document.querySelector('section[aria-label="Notifications alt+T"]');
            if (targetNode) {
                clearInterval(timer);
                const config = { childList: true, subtree: true };
                const callback = function(mutationsList) {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE &&
                                    node.textContent.includes('Content Moderated.')) {
                                    clickTargetButton();
                                }
                            }
                        }
                    }
                };
                const observer = new MutationObserver(callback);
                observer.observe(targetNode, config);
            }
        }, 500);
    });

    function clickTargetButton() {
        const btn = document.querySelector('button[aria-label="動画を作成"][data-slot="button"]');
        if (btn) {
            btn.click();
        } else {
            console.warn('No found button.');
        }
    }


})();
