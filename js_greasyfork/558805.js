// ==UserScript==
// @name         Torn Elimination filter players
// @namespace    http://tampermonkey.net/
// @version      2025-12-13_03
// @description  Filter players marked with high FF score, or being offline, and enable the attack button
// @author       Elbowlian [3916566]
// @match        https://www.torn.com/page.php?sid=competition
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/558805/Torn%20Elimination%20filter%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/558805/Torn%20Elimination%20filter%20players.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const inputHideFFRed = $('<input>', { id: "inputHideFFRed", class: "checkbox-css", type: "checkbox", checked: false})
    const inputOffline = $('<input>', { id: "inputOffline", class: "checkbox-css", type: "checkbox", checked: false})
    let loaded = false;
    const doInstall = () => {
        const targetNode = document.querySelector('div[class*="teamPageWrapper___"]');
        if(targetNode == null) {
            setTimeout( doInstall, 100);
            return;
        }

        const ffInputDiv = $('<div>', {class: "choice-container"})
        ffInputDiv.append(inputHideFFRed)
        ffInputDiv.append($('<label>', {text:'Hide red FF', class: "marker-css", for: "inputHideFFRed"}))

        const offlineInputDiv = $('<div>', {class: "choice-container"})
        offlineInputDiv.append(inputOffline)
        offlineInputDiv.append($('<label>', {text:'Hide offliners', class: "marker-css", for: "inputOffline"}))

        $('div[class*=filterContainer___]')
            .prepend($('<div>').html('&nbsp;   |   &nbsp;'))
            .prepend(ffInputDiv)
            .prepend($('<div>').html('&nbsp;   |   &nbsp;'))
            .prepend(offlineInputDiv)
        //<div class="card___VUoAc filterContainer___hjP9P">
        //  <div class="choice-container">
        //    <input id="show-available-targets" class="checkbox-css" type="checkbox" checked="">
        //    <label class="marker-css" for="show-available-targets">Only show available targets</label></div></div>

        // Select the node that will be observed for mutations

        const run = () => {
            Array.from(targetNode.querySelectorAll('div[class*="teamRow___"]')).forEach(row => {
                let hide = false;
                if(inputOffline.is(':checked') && row.querySelector('li[id*="icon2___"]')) {
                    hide = true;
                } else if (inputHideFFRed.is(':checked') && row.querySelector('img[class="tt-ff-scouter-arrow"][src$="/red-arrow.svg"]')) {
                    hide = true;
                }
                if(hide) {
                    $(row).hide();
                } else {
                    $(row).show();
                    const attackDiv = row.querySelector('div[class*=attackLink___]');
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
                }
            });
        };
        run();

        inputHideFFRed.change(run);
        inputOffline.change(run);

        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            run();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        //observer.disconnect();
    };
    doInstall();
})();