// ==UserScript==
// @name         Unicorn Storage Test
// @match        *://*.google.com/*
// @description  adadsa
// @grant        GM_setValue
// @grant        GM_getValue
// @version      1.0
// @namespace    noyb
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563128/Unicorn%20Storage%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/563128/Unicorn%20Storage%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 1. Try to get the value (default to 0 if not found)
    let count = GM_getValue("test_count", 0);
    
    // 2. Increment it
    count++;
    
    // 3. Try to save it
    GM_setValue("test_count", count);
    
    // 4. Visual Feedback
    alert("Unicorn Storage Test\n\nStored Value: " + count + "\n\nIf this number increases after you refresh, GM_setValue is WORKING!");
})();