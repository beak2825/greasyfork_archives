// ==UserScript==
// @name         Nuke Marketplace Idiots
// @namespace    http://tampermonkey.net/
// @version      2025-11-05
// @description  stop you from seeing assholes on the SL marketplace
// @author       You
// @include      https://marketplace.secondlife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=secondlife.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554839/Nuke%20Marketplace%20Idiots.user.js
// @updateURL https://update.greasyfork.org/scripts/554839/Nuke%20Marketplace%20Idiots.meta.js
// ==/UserScript==

// List of assholes as their names appear in the MP. Very specific names or very specific store names work best.
let assholes = ["Ghost Cloud","ANGELHIVE"];

(function() {
    'use strict';
    // Delete assholes from existence
    if (assholes.length > 0)
    {

        for (let i = 0; i < assholes.length; i++) {
            console.log('by '+assholes[i])
            let thisAsshole = $("span:contains("+assholes[i]+")");
            if (thisAsshole)
            {
                let toNuke = thisAsshole.parents(".gallery-item")
                toNuke.remove();
            }
        }
    }
})();