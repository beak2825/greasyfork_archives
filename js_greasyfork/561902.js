// ==UserScript==
// @name         Torn Plane Swapper Spinning UFO
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces the traveling plane image with a spinning UFO
// @author       srsbsns
// @match        *.torn.com/page.php?sid=travel*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561902/Torn%20Plane%20Swapper%20Spinning%20UFO.user.js
// @updateURL https://update.greasyfork.org/scripts/561902/Torn%20Plane%20Swapper%20Spinning%20UFO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // REPLACE THIS URL with your image link (keep the quotes!)
    const customPlaneUrl = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3RhYm9lcXFieTRtbTBrcmc1eWtmYnh3N3AxMW85cXFzZ2RrcGliNyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/dWS0YNs10XAoAbhHS0/giphy.gif";

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