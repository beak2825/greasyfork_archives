// ==UserScript==
// @name         Cyberpunk 2077 Official Map Background Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle tile background instantly on Piggyback Night City map
// @match        https://maps.piggyback.com/cyberpunk-2077/maps/night-city*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551324/Cyberpunk%202077%20Official%20Map%20Background%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/551324/Cyberpunk%202077%20Official%20Map%20Background%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS to hide the tiles
    var css = ''
        + '.hide-map-background .leaflet-tile-pane {'
        + '  display: none !important;'
        + '}'
        + '#toggleBackgroundBtn {'
        + '  position: fixed;'
        + '  top: 10px;'
        + '  left: 10px;'
        + '  z-index: 99999;'
        + '  background: black;'
        + '  color: white;'
        + '  border: 1px solid #444;'
        + '  padding: 5px 10px;'
        + '  cursor: pointer;'
        + '  font-size: 14px;'
        + '  border-radius: 5px;'
        + '}';

    if (typeof GM_addStyle === 'function') {
        GM_addStyle(css);
    } else {
        var styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    var btn = document.createElement('button');
    btn.id = 'toggleBackgroundBtn';
    btn.textContent = 'Background: ON (B)';
    document.body.appendChild(btn);

    var mapContainer = null;
    var hidden = false;

    function init() {
        mapContainer = document.querySelector('.leaflet-container');
        if (!mapContainer) return false;

        function toggle() {
            hidden = !hidden;
            if (hidden) {
                mapContainer.classList.add('hide-map-background');
                btn.textContent = 'Background: OFF (B)';
            } else {
                mapContainer.classList.remove('hide-map-background');
                btn.textContent = 'Background: ON (B)';
            }
        }

        btn.addEventListener('click', toggle);
        document.addEventListener('keydown', function (e) {
            if (e.key.toLowerCase() === 'b' &&
                !['INPUT', 'TEXTAREA'].includes(e.target.tagName) &&
                !e.target.isContentEditable) {
                toggle();
            }
        });

        return true;
    }

    // Try immediately, otherwise wait for the map
    if (!init()) {
        var observer = new MutationObserver(function () {
            if (init()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
