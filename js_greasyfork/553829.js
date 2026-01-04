// ==UserScript==
// @name         WeatherStar Patcher 1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Patches WeatherStar sites to make them feel more like the Weather Channel.
// @             Patch update 1.1: Added 3000+ compatibility. Fixed number string still showing.
// @match        https://weatherstar.netbymatt.com/*
// @match        https://weatherstar3000.netbymatt.com/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/553829/WeatherStar%20Patcher%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/553829/WeatherStar%20Patcher%2011.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Replace most WeatherStar traces (as in title, logo, etc) and replaces with Weather Channel ===

    // Text replacing
    function replaceText(find, replace) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            node.textContent = node.textContent.replace(new RegExp(find, 'gi'), replace);
        }
    }

    // Replace text phrases with Weather Channel
    replaceText('Weatherstar', 'The Weather Channel');
    replaceText('Weather Star', 'The Weather Channel');
    replaceText('WeatherStar', 'The Weather Channel');
    replaceText('4000\\+', '‎'); // Remove the 4000 string
    replaceText('3000\\+', '‎'); // Remove the 3000 string
    replaceText('V1.0.4', '‎'); // Remove the 3000 version string
    replaceText('v6.2.6', '‎'); // Remove the 4000 version string
    replaceText('\\+', '‎'); // FINALLY REMOVES PLUS! YAYYYY :) (patched in 1.1)
    replaceText('WeatherStar 4000\\+', 'The Weather Channel');

    // Change the webpage title from Weatherstar to Weather Channel
    document.title = 'The Weather Channel [weatherstar patch]';

    // Replace the logo in the top left to say Weather Channel
    const logoURL = 'https://i.ibb.co/FLDPTdNG/weather-channel-logo-85-67.png';

    function updateImages() {
        // Select only the correct logo in the HTML (this was patched in 0.1.1)
        const logoImgs = document.querySelectorAll('.header .logo img');

        logoImgs.forEach(img => {
            // Only change if the image source is originally a WeatherStar logo (this was patched in 1.1)
            if (img.src.includes('logo') || img.src.match(/weatherstar|weather-star|4000/i)) {
                img.src = logoURL;
            }
        });
    }

    setInterval(updateImages, 500);
    updateImages();

})();
