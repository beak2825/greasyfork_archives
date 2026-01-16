// ==UserScript==
// @name         Wealthfront Hide Goal Graph
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide the dashboard goal graph
// @match        https://www.wealthfront.com/dashboard*
// @author       @trumpetbear
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562786/Wealthfront%20Hide%20Goal%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/562786/Wealthfront%20Hide%20Goal%20Graph.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const className = 'dashboard-components-dashboard-overview-overview-graph';

    const hideElement = () => {
        const el = document.querySelector(`.${className}`);
        if (el) {
            el.style.display = 'none';
        }
    };

    // Try immediately
    hideElement();

    // Observe DOM changes for SPA loads
    const observer = new MutationObserver(() => hideElement());

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
