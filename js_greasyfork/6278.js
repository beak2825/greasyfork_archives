// ==UserScript==
// @name        CH OCMP Press Enter To Submit
// @author      clickhappier
// @namespace   clickhappier
// @description Makes enter/return key submit a HIT for OCMP, like it already does for other requesters who use standard form submit buttons.
// @version     1.0c
// @grant       none
// @match       https://*.crowdcomputingsystems.com/*
// @downloadURL https://update.greasyfork.org/scripts/6278/CH%20OCMP%20Press%20Enter%20To%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/6278/CH%20OCMP%20Press%20Enter%20To%20Submit.meta.js
// ==/UserScript==

document.addEventListener( "keydown", entersubmit, false);
function entersubmit(i) {
    if (i.keyCode == 13) { // enter/return key
        document.querySelector("a.button.cc-button.submit-btn").click();
    }  
}