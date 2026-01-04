// ==UserScript==
// @name         HBOMax Gradient Remover
// @namespace    https://github.com/neura-neura/userscripts
// @version      1.5
// @description  Remove the gradient element from the control overlay which is shown on a mouse movement
// @author       neura-neura
// @license      MIT
// @match        http*://play.hbomax.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=max.com
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/556797/HBOMax%20Gradient%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/556797/HBOMax%20Gradient%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the URL change handler
    window.addEventListener('popstate', function() {
        waitAndRemove();
    });

    // Call the function in case there is a change in the URL
    waitAndRemove();

    // Set an interval to repeatedly remove gradients
    setInterval(waitAndRemove, 1000);  // Each 1 second
})();

function waitAndRemove() {
    // Use a selector that matches classes that start with "TopGradient-Fuse-Web-Play"
    let topGradient = document.querySelector("[class^='TopGradient-Fuse-Web-Play']");
    if (topGradient) {
        console.log('Top Gradient Element found:', topGradient);
        topGradient.remove();
        console.log('Top Gradient Element removed.');
    }

    // Use a selector that matches classes that start with "BottomGradient-Fuse-Web-Play"
    let bottomGradient = document.querySelector("[class^='BottomGradient-Fuse-Web-Play']");
    if (bottomGradient) {
        console.log('Bottom Gradient Element found:', bottomGradient);
        bottomGradient.remove();
        console.log('Bottom Gradient Element removed.');
    }
}

