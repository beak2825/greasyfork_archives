// ==UserScript==
// @name          Zoom
// @description   Make more the page visible and make icons bigger
// @author        Tirion
// @namespace     http://userstyles.org
// @include       *.horsereality.com/horses*
// @run-at        document-start
// @version       0.5
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/551042/Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/551042/Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        try {
            var horses = document.querySelector('#horses');

            horses.style = "width: 960px; zoom: 40%;"; //zoom: 35%;
            horses.querySelector('.tabdetails').style = "max-width: 10000vw;";
            var contentShadowRoot = document.querySelector('horsereality-horse').shadowRoot;
            var divider = contentShadowRoot.querySelector('#content').querySelector('hr-divider-container').shadowRoot;
            divider.querySelector('ul').style="height: 150px;";
            var svgs = divider.querySelectorAll('svg');
            for (var i = 0; i < svgs.length; i++){
                svgs[i].style = "height: 5em !important;";
            }
        var arrows = contentShadowRoot.querySelectorAll('hr-button-icon');
        arrows[0].shadowRoot.querySelector('hr-int-button').shadowRoot.querySelector('a').querySelector('svg').style = "height: 8em !important; width: 8em !important;";
        arrows[1].shadowRoot.querySelector('hr-int-button').shadowRoot.querySelector('a').querySelector('svg').style = "height: 8em !important; width: 8em !important;";

        } catch (e) {};
    }, 1000);
})();