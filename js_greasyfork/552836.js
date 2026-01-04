// ==UserScript==
// @name         Auto Play if Paused (Edge)
// @namespace    https://greasyfork.org/en/users/1527556-imhungrie
// @version      1.0
// @description  Simple code that automatically presses play when a video is paused on Edgenuity
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552836/Auto%20Play%20if%20Paused%20%28Edge%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552836/Auto%20Play%20if%20Paused%20%28Edge%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickPlayButton() {
        const btn = document.querySelector('.vjs-play-control');
        if (btn && (btn.title === 'Play' || btn.getAttribute('aria-label') === 'Play')) {
            btn.click();
        }
    }
    const observer = new MutationObserver(() => {
        clickPlayButton();
    });
    window.addEventListener('load', () => {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
        setInterval(clickPlayButton, 3000);
    });
})();
