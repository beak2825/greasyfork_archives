// ==UserScript==
// @name         Torn Plane Swapper- flying dude
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces the traveling plane image with a flying dude
// @author       srsbsns
// @match        *.torn.com/page.php?sid=travel*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561903/Torn%20Plane%20Swapper-%20flying%20dude.user.js
// @updateURL https://update.greasyfork.org/scripts/561903/Torn%20Plane%20Swapper-%20flying%20dude.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // REPLACE THIS URL with your image link (keep the quotes!)
    const customPlaneUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHlraWV6aXFnZGFtM3UwbXFid2Q4Z25xbXpncjNzdDF3OW1qZWRwaCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/g0pkmtVidIwQvtDyJI/giphy.gif";

    function swapPlane() {
        const planeImg = document.querySelector('.planeImage___Kbn3b');

        if (planeImg && planeImg.src !== customPlaneUrl) {
            planeImg.src = customPlaneUrl;

            // ADJUST POSITION HERE:
            // Increase 50px to move it right, use -50px to move it left
            planeImg.style.transform = "translateX(265px)";

            // Optional: Adjust size if your new image looks too big/small
            planeImg.style.height = "auto";
            planeImg.style.maxWidth = "230px";
        }
    }

    // Run once on load and then check every second (in case of page transitions)
    setInterval(swapPlane, 1000);
})();