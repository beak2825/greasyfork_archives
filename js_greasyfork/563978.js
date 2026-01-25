// ==UserScript==
// @name         Overtide.io chams
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  chams
// @author       extra
// @match        *://*.overtide.io/*
// @match        *://overtide.io/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563978/Overtideio%20chams.user.js
// @updateURL https://update.greasyfork.org/scripts/563978/Overtideio%20chams.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENEMY_IDS = [3912, 1110, 1116, 1734, 1638, 3300, 2718];
    const SMOKE_FLASH_IDS = [108, 144, 212];

    setInterval(() => {
        document.querySelectorAll('iframe').forEach((ifr, i) => {
            if (!ifr.id) ifr.id = `auto_iframe_${i}`;
            try {
                const inner = ifr.contentDocument || ifr.contentWindow.document;
                inner.querySelectorAll('iframe').forEach((nested, j) => {
                    if (!nested.id) nested.id = `inner_iframe_auto_${j}`;
                });
            } catch (e) {}
        });
    }, 2000);

    const orgContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function() {
        let gl = orgContext.apply(this, arguments);
        if (gl && (arguments[0]?.includes('webgl'))) {
            const drawElements = gl.drawElements;
            gl.drawElements = function(mode, count, type, offset) {
                if (mode === gl.TRIANGLE_STRIP && count === 4) return;
                if (SMOKE_FLASH_IDS.includes(count)) return;
                if (ENEMY_IDS.includes(count)) {
                    gl.depthFunc(gl.ALWAYS);
                    gl.enable(gl.BLEND);
                    gl.blendColor(0, 1, 0, 0.8);
                    const res = drawElements.apply(this, arguments);
                    gl.depthFunc(gl.LEQUAL);
                    return res;
                }
                return drawElements.apply(this, arguments);
            };
        }
        return gl;
    };
})();