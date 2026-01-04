// ==UserScript==
// @name         Force dark mode
// @name:lv      Spiest tumšo režīmu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  because the devs are lazy
// @description:lv jo skolas developeri is mazliet slinki
// @match        *://evide.talmacibasvsk.lv/*
// @run-at       document-start
// @author       amcalledglitchy.dev
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548030/Force%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/548030/Force%20dark%20mode.meta.js
// ==/UserScript==

// Force dark mode

(function() {
    'use strict';
    const obs = new MutationObserver(() => {
        const html = document.documentElement;
        if (!html.classList.contains('dark')) {
            html.classList.add('dark');
        }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();

// Style the loading screen to prevent flashbangs

(function() {
    'use strict';

    document.documentElement.style.backgroundColor = 'rgb(10,10,10)';


    const observer = new MutationObserver((mutations, obs) => {
        const loader = document.querySelector('.fixed.top-0.left-0.right-0.bottom-0.w-full.h-full.flex.justify-center.items-center.bg-white, .dark\\:bg-neutral-900');
        if (!loader) return;

        // Loader found, stop observing
        obs.disconnect();

        // Style the loader container
        loader.style.backgroundColor = 'rgb(10,10,10)';

        // Style the spinner inside
        const spinner = loader.querySelector('.ri-loader-4-line');
        if (spinner) {
            spinner.style.color = 'white';
            spinner.style.transition = 'color 0.3s';
        }
    });

    // Watch the whole document for added nodes
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();