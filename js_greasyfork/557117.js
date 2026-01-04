// ==UserScript==
// @name         TW - Show nuke buttons
// @namespace    http://tampermonkey.net/
// @version      2025-11-27
// @description  Show new fortbattle nuke buttons after pressing the Pos1/Home key
// @author       Lauser
// @match        https://*.the-west.net/game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=the-west.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557117/TW%20-%20Show%20nuke%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/557117/TW%20-%20Show%20nuke%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.key === "Home") {
            document.querySelectorAll('.fort_battle_button.single_use')
                .forEach(el => el.style.display = 'block');
        }
    });

})();