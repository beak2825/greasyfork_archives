// ==UserScript==
// @name         greentext liberation now!
// @namespace    jackl
// @version      2025-12-12
// @description  makes all greentexts green; do not stand for white genocide
// @author       jackl
// @match        https://www.destiny.gg/embed/chat*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558290/greentext%20liberation%20now%21.user.js
// @updateURL https://update.greasyfork.org/scripts/558290/greentext%20liberation%20now%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    // Ignore text that is already span-wrapped
                    if (!textContainer
                      || textContainer.firstChild.hasChildNodes()) continue;

                    if (textContainer.textContent.startsWith('>')) {
                        const wrapper = document.createElement('span');
                        wrapper.className = 'greentext';

                        // Move content
                        wrapper.innerHTML = textContainer.innerHTML;
                        textContainer.innerHTML = '';
                        textContainer.appendChild(wrapper);
                    }
                }
            }
        }
    }

    const targetElement = document.getElementById("chat-win-main").querySelector(".chat-lines");

    if (targetElement) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetElement, { childList: true });
    }
})();