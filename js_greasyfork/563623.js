// ==UserScript==
// @name         CubeRealm Zoom X and Z
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Instant zoom with X and Z keys in CubeRealm (X=3, Z=10)
// @author       King
// @match        *://*.cuberealm.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563623/CubeRealm%20Zoom%20X%20and%20Z.user.js
// @updateURL https://update.greasyfork.org/scripts/563623/CubeRealm%20Zoom%20X%20and%20Z.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const zoomOut = 1;    // Normal scale
    const zoomX = 3;      // Zoom when holding X
    const zoomZ = 10;     // Zoom when holding Z

    let canvas = document.querySelector('canvas');

    const keys = {};

    function updateZoom() {
        if (!canvas) return;
        if (keys['KeyZ']) {
            canvas.style.transform = `scale(${zoomZ})`;
        } else if (keys['KeyX']) {
            canvas.style.transform = `scale(${zoomX})`;
        } else {
            canvas.style.transform = `scale(${zoomOut})`;
        }
    }

    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        updateZoom();
    });

    document.addEventListener('keyup', (e) => {
        keys[e.code] = false;
        updateZoom();
    });
})();
