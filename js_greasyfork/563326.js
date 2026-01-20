// ==UserScript==
// @name         Neopets: Highlight Wearables in Quick Stock
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Highlights wearable items in Quick Stock. Optionally auto-selects "Closet".
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/quickstock.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/563326/Neopets%3A%20Highlight%20Wearables%20in%20Quick%20Stock.user.js
// @updateURL https://update.greasyfork.org/scripts/563326/Neopets%3A%20Highlight%20Wearables%20in%20Quick%20Stock.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Makes the background color of any wearables in your Quick Stock blue (the same shade as in your SDB)
    - If you set autoSelectCloset to true, automatically selects "Closet" for all of them

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

const autoSelectCloset = false;

(function() {
    'use strict';
    document.querySelectorAll("[name='buyitem'] ~ table tr:not([bgcolor='#eeeebb']):has(td:nth-child(8) input)").forEach(wearable => {
        wearable.style.backgroundColor = "#DFEAF7";
        if(autoSelectCloset) wearable.querySelector("td:nth-child(8) input").checked = true;
    });
})();
