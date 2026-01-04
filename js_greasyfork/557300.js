// ==UserScript==
// @name         Customize Torn War Helper
// @namespace    shade.torn.wall-battlestats
// @version      1.0.0
// @author       Shade [3129695]
// @description  Customizes Torn War Helper Script - Right now it just hides the Source highlighter
// @license      GNU GPLv3
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557300/Customize%20Torn%20War%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/557300/Customize%20Torn%20War%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
    	var styleTag = $('<style>.__warhelper_bstype { display: none !important; }</style>')
        $('html > head').append(styleTag);
    });
})();