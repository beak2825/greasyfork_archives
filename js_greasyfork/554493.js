// ==UserScript==
// @name         Reverse Order of Quest in SMMO
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Reverse the order of quests listed on the quests page in Simple MMO.
// @author       @dngda
// @match        https://web.simple-mmo.com/quests*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simple-mmo.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554493/Reverse%20Order%20of%20Quest%20in%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/554493/Reverse%20Order%20of%20Quest%20in%20SMMO.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function reverseChildren(parent) {
        for (var i = 1; i < parent.childNodes.length; i++) {
            parent.insertBefore(parent.childNodes[i], parent.firstChild);
        }
    }

    const rootObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (
                    node.nodeType === Node.ELEMENT_NODE &&
                    node.matches(
                        "div[x-data='expedition'] > div.grid > div.relative > div > div"
                    )
                ) {
                    reverseChildren(node);
                }
            }
        }
    });

    rootObserver.observe(document.body, { childList: true, subtree: true });
})();
