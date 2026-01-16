// ==UserScript==
// @name         Discord Remove Keybinds (CTRL/CMD+{number})
// @description  Removes CTRL/CMD+{number} keybinds so you can switch tabs without it interacting with Discord.
// @author       ∫(Ace)³dx
// @match        https://*.discord.com/*
// @version      1.1
// @grant        none
// @namespace https://greasyfork.org/users/449798
// @downloadURL https://update.greasyfork.org/scripts/562649/Discord%20Remove%20Keybinds%20%28CTRLCMD%2B%7Bnumber%7D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562649/Discord%20Remove%20Keybinds%20%28CTRLCMD%2B%7Bnumber%7D%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener(
        'keydown',
        function (e) {
            // Ctrl + number only
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
                if (/^[0-9]$/.test(e.key)) {
                    // ❗ DO NOT preventDefault
                    // This keeps browser tab switching intact
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        },
        true // capture phase so Discord never sees it
    );
})();
