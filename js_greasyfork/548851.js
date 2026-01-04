// ==UserScript==
// @name         DeepFix
// @namespace    https://greasyfork.org/users/1513077-faww
// @version      1.3
// @description  Fixing some interface elements, which makes using DeepSeek more convenient and enjoyable
// @author       Faww / Fawwero
// @icon         https://registry.npmmirror.com/@lobehub/icons-static-png/1.64.0/files/dark/deepseek-color.png
// @match        https://chat.deepseek.com/*
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548851/DeepFix.user.js
// @updateURL https://update.greasyfork.org/scripts/548851/DeepFix.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const fixTables = () => {
        document.querySelectorAll('table').forEach(table => {
            table.style.width = "100%";
            table.style.maxWidth = "100%";
        });
    };
    const fixPad = () => {
        document.querySelectorAll('._0f72b0b').forEach(el => {
            el.style.padding = '0 calc((100% - var(--message-list-max-width)) / 3)';
        });
    };

    const runAll = () => { fixTables(); fixPad(); };

    runAll();

    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });

})();