// ==UserScript==
// @name         FACEIT Renamer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Renames Faceit buttons and menu texts for English and Russian versions
// @author       frz
// @icon         https://play-lh.googleusercontent.com/4iFS-rI0ImIFZyTwjidPChDOTUGxZqX2sCBLRsf9g_noMIUnH9ywsCmCzSu9vSM9Jg
// @match        https://www.faceit.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551795/FACEIT%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/551795/FACEIT%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGETS = [
        { regex: /Find match/i,      text: "Register" },
        { regex: /Finding match/i,   text: "Finding Hidden Pool" },

        { regex: /Найти матч/i,      text: "Регнуть" },
        { regex: /Поиск матча/i,     text: "Ищу скрытый пул" },

        { regex: /^Report$/i,        text: "Fuck Him" },

        { regex: /^Доложить$/i,  text: "Заебашить" }
    ];

    function replaceText(el) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node;
        while (node = walker.nextNode()) {
            const trimmed = node.nodeValue.trim();
            for (const t of TARGETS) {
                if (t.regex.test(trimmed)) {
                    node.nodeValue = node.nodeValue.replace(t.regex, t.text);
                }
            }
        }
    }

    function scanPage() {
        document.querySelectorAll('div, span, button').forEach(replaceText);
    }

    scanPage();
    new MutationObserver(scanPage).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();