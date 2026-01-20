// ==UserScript==
// @name         Dress to Impress: Auto Compare
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.0
// @description  Turns the compare feature on by default and hides categories with no comparable items
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://impress.openneo.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=impress.openneo.net
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/563327/Dress%20to%20Impress%3A%20Auto%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/563327/Dress%20to%20Impress%3A%20Auto%20Compare.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
........................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
    This script does the following:
    - Automatically turns on the "Compare with Your Items" feature whenever you visit someone else's profile
    - Hides all empty categories while comparing. Turn comparing off (by clicking the usual button) to see them again.
    - Turns the background red if a trade couldn't be found (they don't have an item you want and/or you don't have an
    item they want)
    - Fixes the search feature being behind other elements. As a bonus

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦
........................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•:•.••:
*/

(function() {
    'use strict';
    document.head.insertAdjacentHTML('beforeEnd', `<style>
    body:has(#toggle-compare) .comparing [data-owned="true"] .closet-list:not(:has(.user-wants)),
    body:has(#toggle-compare) .comparing [data-owned="false"] .closet-list:not(:has(.user-owns)) {
        display: none;
    }
    body:has(#toggle-compare):not(:has(.comparing [data-owned="true"] .user-wants):has(.comparing [data-owned="false"] .user-owns)) {
        background: #f3bdbd;
    }
    .ui-menu {
        z-index: 12!important;
    }
    </style>`);
    if(!document.getElementById('toggle-compare')) return;
    document.getElementById('closet-hangers').classList.add('comparing');
})();
