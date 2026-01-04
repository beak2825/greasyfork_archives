// ==UserScript==
// @name         Improved Mouse-Follow Clicker doubler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  it just doubles your click 
// @author       TheHackerClient (fixed by Chatgpt)
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559488/Improved%20Mouse-Follow%20Clicker%20doubler.user.js
// @updateURL https://update.greasyfork.org/scripts/559488/Improved%20Mouse-Follow%20Clicker%20doubler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MULTIPLIER = 2; // change this to 2, 3, 4, 5, etc.

    let lastX = 0, lastY = 0;
    document.addEventListener('mousemove', e => { lastX = e.clientX; lastY = e.clientY; }, { passive: true });

    function dispatchClick(el, x, y) {
        const init = {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0,
            buttons: 1,
            detail: 1
        };
        try {
            el.dispatchEvent(new MouseEvent('mousedown', init));
            el.dispatchEvent(new MouseEvent('mouseup', init));
            el.dispatchEvent(new MouseEvent('click', init));
            if (typeof el.click === 'function') el.click(); // fallback for buttons/inputs
        } catch (e) { console.error('Synthetic click error', e); }
    }

    document.addEventListener('click', function (ev) {
        if (!ev.isTrusted || ev.button !== 0) return; // only hardware left-click
        const x = ev.clientX || lastX;
        const y = ev.clientY || lastY;
        const el = ev.target || document.elementFromPoint(x, y);

        // Dispatch multiple synthetic clicks
        for (let i = 1; i < MULTIPLIER; i++) {
            setTimeout(() => dispatchClick(el, x, y), i * 5); // tiny delay between them (5ms)
        }
    }, true);

})();
