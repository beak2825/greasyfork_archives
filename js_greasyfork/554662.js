// ==UserScript==
// @name         Dreamscape Background
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Making Dreamscape better one background at a time! Share this to anyone that misses console backgrounds.
// @author       shawsaul (Shawn Saulmon)
// @include      *dreamscape*
// @icon         https://img.game8.co/3446068/e5d6404c3848c96842c69d380bb7a355.png/show
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554662/Dreamscape%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/554662/Dreamscape%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hopefully this script works for a while. I added comments to make it easy to understand if updates are needed.
    // This script will run on any website with "dreamscape" in the url and will edit the ".xterm-viewport" class.

    // .xterm-viewport is the class for the div that the background-image goes to. Unsure if this is used on any other website.
    // .xterm-screen was used before but it left a little bit of the the dreamscape color background still visible. viewport fits the image over it.

    //A gradient is on my default to make Dreamscape text on any light colored backgrounds easier to read.
    //If you would like to remove the gradient, change the 'hasGradient' boolean below to 'false'

    let hasGradient = true;

    // Replace myBackground with the URL of the background image you want.
    const myBackground = 'https://images.steamusercontent.com/ugc/2058741574591784143/310818E5D3AE1CF90927AB9555326A88AECAA889/';

    if (hasGradient) {
      GM_addStyle(`
        .xterm-viewport {
            background-image:linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, transparent 100%),url(${myBackground}) !important;
            background-size: cover; /* Makes your image cover the whole background. You could change this. */
            background-position: center center; /* Centers your image. Change if you want I guess. */
            background-repeat: no-repeat; /* Do you really want your image to repeat? Change this if you do. */
        }
    `);
    } else {
      GM_addStyle(`
        .xterm-viewport {
            background-image: url(${myBackground}) !important;
            background-size: cover; /* Makes your image cover the whole background. You could change this. */
            background-position: center center; /* Centers your image. Change if you want I guess. */
            background-repeat: no-repeat; /* Do you really want your image to repeat? Change this if you do. */
        }
    `);
    }
})();