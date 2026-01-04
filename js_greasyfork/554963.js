// ==UserScript==
// @name             Neopets: Fix Battledome Loading and Scrolling
// @namespace        kmtxcxjx
// @version          1.1.1
// @description      Fixes the Battledome's hang on loading when you click, and removes some elements above the battledome so it can be seen in full without scrolling
// @match            *://www.neopets.com/dome/arena.phtml
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/554963/Neopets%3A%20Fix%20Battledome%20Loading%20and%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/554963/Neopets%3A%20Fix%20Battledome%20Loading%20and%20Scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bd = document.querySelector('div.battledome-container');
    if (!bd) return;

    // This removes some elements from above the battledome, so the battledome can be seen in full without scrolling
    // (or with less scrolling, I guess, depending on screen size)
    Array.from(bd.childNodes).forEach(node => {
        if (
            node.nodeType === Node.TEXT_NODE || // The flavor text above the battledome
            node.nodeName === 'BR' || // Two linebreaks above the battledome
            (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('social-links')) // Social media links above the battledome
        ) {
            node.remove();
        }
    });

    // Detects when the Battledome loading bar gets stuck, and unstucks it by calling window.stop()
    // This is equivalent to pressing the Esc key, which is the usual manual fix for that issue
    let fullTime = null; // when we first saw 100%
    // Checks for the loading bar every 100ms
    const interval = setInterval(() => {
        const bar = bd.querySelector('#loadprogress');

        // Loading bar missing - loading is likely already finished on its own
        if (!bar) return clearInterval(interval);

        const barWidth = parseFloat(bar.style.width) || 0;
        const doneLoading = barWidth >= 28695;
        // The bar is fully loaded for the first time - note the time
        if (doneLoading && fullTime === null) fullTime = performance.now();

        if (fullTime !== null) {
            const elapsed = performance.now() - fullTime;
            if (elapsed >= 200) {
                if (document.contains(bar)) {
                    // 200 or more milliseconds have passed and the loading bar is still there
                    // It's stuck - window.stop() fixes it (equivalent to pressing Esc key)
                    // This listener will call that only once the user clicks, then remove itself
                    document.addEventListener('click', stopOnClick);
                    //window.stop();
                    return clearInterval(interval);
                }
            }
        }
    }, 100);

    function stopOnClick(e) {
        const bar = bd.querySelector('#loadprogress');
        if (bar) window.stop();
        document.removeEventListener('click', stopOnClick);
    }
})();
