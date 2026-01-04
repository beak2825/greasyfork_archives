// ==UserScript==
// @name         Torn Elimination team attack links from Hospital
// @namespace    http://tampermonkey.net/
// @version      2025-12-12
// @description  When you are hospitalized, the attack links are not clickable, this fixes that problem 😈
// @author       mystify-321
// @match        https://www.torn.com/page.php?sid=competition
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      GPL-3.0 https://github.com/all-licenses/GNU-General-Public-License-v3.0/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/558726/Torn%20Elimination%20team%20attack%20links%20from%20Hospital.user.js
// @updateURL https://update.greasyfork.org/scripts/558726/Torn%20Elimination%20team%20attack%20links%20from%20Hospital.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const allRows = Array.from(document.querySelectorAll('div[class*=dataGridRow___][class*=teamRow___][class*=showAttackLink___]'));
        console.log('found '+allRows.length+' rows')
        allRows.forEach((row) => {
            const attackDiv = row.querySelector('div[class*=attackLink___]')
            if(attackDiv == null) {
                console.log('attackDiv is null');
                return
            }
            if(attackDiv.querySelector('a') == null) {
                const svg = attackDiv.querySelector('svg')
                if(svg == null) {
                    console.log('svg is null');
                    return
                }
                const playerIdArr = row.querySelector('div[class*=name___]')?.querySelector('a')?.href?.split('\?XID=')
                if(playerIdArr == null) {
                    console.log('playerIdArr is null');
                    return
                }
                const playerId = playerIdArr[1];
                const attackLink = 'https://www.torn.com/loader.php?sid=attack&user2ID=' + playerId;
                $(svg).wrap(
                    $('<a>',{href: attackLink})
                );
            }
        });
    }, 1000);
})();