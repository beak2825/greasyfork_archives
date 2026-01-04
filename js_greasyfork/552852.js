// ==UserScript==
// @name         Current Local Date
// @version      1.5
// @description  Shows current date in a slim overlay
// @author       You
// @match        *://deadshot.io/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1527574
// @downloadURL https://update.greasyfork.org/scripts/552852/Current%20Local%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/552852/Current%20Local%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const overlayStyle = `
    #metricOverlay {
        position: fixed;
        top: 7px;  /* 7 pixels from top */
        left: 7px; /* 7 pixels from left */
        background: rgba(0, 0, 0, 0.6);
        padding: 7px 12px;
        border-radius: 6px;
        color: #fff;
        border: 2px solid #fff;  /* White border */
        z-index: 100000;
        font-size: 15px;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        visibility: hidden; /* Start hidden */
    }`;

    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.innerText = overlayStyle;
    document.head.appendChild(styleElement);

    const metricOverlay = document.createElement('div');
    metricOverlay.id = 'metricOverlay';
    metricOverlay.innerText = 'Initializing metrics...';
    document.body.appendChild(metricOverlay);


    setInterval(() => {
        const currentDate = new Date().toLocaleDateString();
        metricOverlay.innerHTML = `Date: ${currentDate}`;

        // Make the overlay visible after the first update
        metricOverlay.style.visibility = 'visible';
    }, 1800000);

    // Run the update immediately on load
    const initialDate = new Date().toLocaleDateString();
    metricOverlay.innerHTML = `Date: ${initialDate}`;
    metricOverlay.style.visibility = 'visible';

})();