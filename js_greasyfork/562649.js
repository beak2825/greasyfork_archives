// ==UserScript==
// @name         Discord Remove Keybinds (CTRL+{number})
// @description  Removes CTRL+{number} keybinds so you can switch tabs without it interacting with Discord.
// @author       ∫(Ace)³dx
// @match        https://*.discord.com/*
// @grant        none
// @version 0.0.1.20260114143150
// @namespace https://greasyfork.org/users/449798
// @downloadURL https://update.greasyfork.org/scripts/562649/Discord%20Remove%20Keybinds%20%28CTRL%2B%7Bnumber%7D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562649/Discord%20Remove%20Keybinds%20%28CTRL%2B%7Bnumber%7D%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener(
        'keydown',
        function (e) {
            // Ctrl + number only
            if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
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
