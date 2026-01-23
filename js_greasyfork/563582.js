// ==UserScript==
// @name         kissjav fuck adblockblock
// @author       Minjae Kim
// @version      1.03
// @description  cleans the site
// @match        https://kissjav.com/*
// @match        https://kissjav.li/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @namespace    clearjade
// @downloadURL https://update.greasyfork.org/scripts/563582/kissjav%20fuck%20adblockblock.user.js
// @updateURL https://update.greasyfork.org/scripts/563582/kissjav%20fuck%20adblockblock.meta.js
// ==/UserScript==


const intervalId = setInterval(fadb, 1000);

function fadb() {
    const scroll = document.querySelector('[style="overflow: hidden;"]');
    const style = document.createElement('style');
style.innerHTML = `
    #ad-lock-screen {
        display: none !important;
    }
`;
document.head.appendChild(style);

    if (scroll) {
        scroll.style.overflow = 'visible';

        if (scroll.style.overflow === 'visible') {
            clearInterval(intervalId);
        }
    }
}