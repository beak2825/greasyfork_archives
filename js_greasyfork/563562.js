// ==UserScript==
// @name         bonk.io Custom Fps
// @namespace    https://greasyfork.org/en/scripts/custom-fps
// @description  Sets the Fps to a custom value
// @match        https://bonk.io/gameframe-release.html
// @author       hi123241426
// @run-at       document-start
// @version      1.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563562/bonkio%20Custom%20Fps.user.js
// @updateURL https://update.greasyfork.org/scripts/563562/bonkio%20Custom%20Fps.meta.js
// ==/UserScript==

(function () {
    const FPS = 240;
    const delay = 1000 / FPS;
    window.requestAnimationFrame = cb =>
        setTimeout(() => cb(performance.now()), delay);
    console.log("Fps set to", FPS);
})();
