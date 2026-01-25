// ==UserScript==
// @name         Weapon list on the right
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Moves weapon list to the right side on attack page. Useful if you are righthanded and use mobile with one hand.
// @author       ljovcheg | 3191064
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @license	 GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/564021/Weapon%20list%20on%20the%20right.user.js
// @updateURL https://update.greasyfork.org/scripts/564021/Weapon%20list%20on%20the%20right.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        [class*="weaponList___"]{
           order: 2 !important;
        }
    `);
})();