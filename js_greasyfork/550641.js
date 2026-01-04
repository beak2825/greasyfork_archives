// ==UserScript==
// @name         Force all links to open in new tabs
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Modify the <a> tag in the page so that it opens in a new tab
// @author       Xiaowu
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550641/Force%20all%20links%20to%20open%20in%20new%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/550641/Force%20all%20links%20to%20open%20in%20new%20tabs.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Modify the <a> tag in the page so that it opens in a new tab
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer'); // For safe
    });
 
})();