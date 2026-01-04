// ==UserScript==
// @name         CleanChat
// @namespace    http://tampermonkey.net/
// @version      2025-10-12
// @description  A script to clear all the errors in bloxd.io
// @author       Cvetocheckcactus (Цветочек Кактус)
// @match        https://bloxd.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553027/CleanChat.user.js
// @updateURL https://update.greasyfork.org/scripts/553027/CleanChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const badWords = ['internalerror', 's to run more code', 'apierror', 'last error of', 'logging too many errors', 'syntaxerror', 'not a function', 'evalerror'];
    const hiddenMessages = [];

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const text = node.textContent.toLowerCase();

                        if (badWords.some(word => text.includes(word))) {
                            node.style.transition = 'all 0.3s ease';
                            node.style.opacity = '0';
                            node.style.height = '0';
                            hiddenMessages.push(node);
                        }
                    }
                });
            }
        }
    });

    setInterval(() => {
        observer.disconnect();
        const chat = document.querySelector('.ChatMessages');
        if (chat) {
            observer.observe(chat, {
                childList: true,
                subtree: false
            });
        }
    }, 10000);

    let hiddenVisible = false;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'h') {
            hiddenVisible = !hiddenVisible;

            hiddenMessages.forEach(msg => {
                if (hiddenVisible) {
                    msg.style.height = '20px';
                    msg.style.opacity = '0.5';
                } else {
                    msg.style.height = '0';
                    msg.style.opacity = '0';
                }
            });
        }
    });

})();
