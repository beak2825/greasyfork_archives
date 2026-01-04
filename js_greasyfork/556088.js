// ==UserScript==
// @name         Gear Browser Auto-Click TD Bars
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-click all interactive TD bars on Gear browser and pause
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556088/Gear%20Browser%20Auto-Click%20TD%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/556088/Gear%20Browser%20Auto-Click%20TD%20Bars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector for TD bars — update if your implementation differs
    var tdBars = document.querySelectorAll('td[data-testid="chevron"], td.sc-8f1bf317-10, td.cIaiyO, td.kDsKm');

    let i = 0;
    function clickNext() {
        if (i < tdBars.length) {
            // If the bar contains a button or clickable div/icon, click that.
            let target = tdBars[i].querySelector('button, div, svg');
            if (target) {
                target.click();
            } else {
                tdBars[i].click();
            }
            i++;
            setTimeout(clickNext, 500);
        } else {
            alert('All TD bars clicked. Paused.');
        }
    }

    if (tdBars.length > 0) {
        clickNext();
    } else {
        console.log('No TD bar elements found!');
    }
})();
