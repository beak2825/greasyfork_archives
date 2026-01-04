// ==UserScript==
// @name         Qw Zapper
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  Ratchet up Qwinky.com
// @author       BMS
// @license      GPL
// @match        https://qwinky.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549667/Qw%20Zapper.user.js
// @updateURL https://update.greasyfork.org/scripts/549667/Qw%20Zapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const hostname = window.location.hostname;
    if(hostname.includes('qwinky')){
            window.addEventListener('load', function() {
                // Your code here will execute after the entire page and all resources have loaded
                console.log("Page and all resources are fully loaded!");
                member_nbrCredits=3333;
                window.member_nbrCredits=3333
            });
    }
})();