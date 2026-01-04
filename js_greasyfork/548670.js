// ==UserScript==
// @name         NIKKE Switching position
// @version      1.0
// @description  妮姬聯盟戰儀表板單位轉換，自動切換困難分頁 B→億, M→萬 + 「Day 2」tab
// @match        https://www.blablalink.com/*
// @grant        none
// @namespace https://greasyfork.org/users/204955
// @downloadURL https://update.greasyfork.org/scripts/548670/NIKKE%20Switching%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/548670/NIKKE%20Switching%20position.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function convertText(text) {
        return text
            .replace(/([\d.,]+)\s*B\b/g, '$1 億')
            .replace(/([\d.,]+)\s*M\b/g, '$1 萬');
    }

    function replaceUnits(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const newText = convertText(node.textContent);
            if (newText !== node.textContent) {
                node.textContent = newText;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(replaceUnits);
        }
    }


    document.querySelectorAll('span').forEach(span => replaceUnits(span));


    function clickDay2() {

        const candidates = Array.from(document.querySelectorAll('div.cursor-pointer'))
            .filter(el => el.textContent.includes("Day 2"));
        if (candidates.length > 0) {
            console.log("Click:", candidates[0]);
            candidates[0].click();
            return true;
        }
        return false;
    }


    if (!clickDay2()) {

        const observer = new MutationObserver(() => {
            if (clickDay2()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }


    const unitObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                replaceUnits(node);
            }
        }
    });
    unitObserver.observe(document.body, { childList: true, subtree: true });
})();