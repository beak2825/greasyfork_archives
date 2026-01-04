// ==UserScript==
// @name         9gag Auto Confirm Refresh
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks OK on 9gag's refresh confirmation dialog
// @author       You
// @match        https://9gag.com/*
// @match        http://9gag.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556419/9gag%20Auto%20Confirm%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/556419/9gag%20Auto%20Confirm%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // Override the confirm function to automatically return true (OK)
    window.confirm = function(message) {
        // Check if this is the refresh confirmation dialog
        if (message && (message.includes('Refresh the page?'))) {
            return true;
        }
    };

})();