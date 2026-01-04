// ==UserScript==
// @name         download from noteslink
// @namespace    http://tampermonkey.net/
// @version      2024-09-12
// @description  enable the download option in view screen
// @author       You
// @match        https://noteslink.in/*
// @icon         https://noteslink.in/wp-content/uploads/2024/09/cropped-favicon-32x32-1-192x192.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551123/download%20from%20noteslink.user.js
// @updateURL https://update.greasyfork.org/scripts/551123/download%20from%20noteslink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("script rnning for enabling download option in file view");
    // Function to check and update the iframe src
    const checkAndUpdateIframeSrc = () => {
        // Select all iframes with class pdfjs-iframe
        const iframes = document.querySelectorAll('iframe.pdfjs-iframe');

        iframes.forEach(iframe => {
            let src = iframe.getAttribute('src');
            if (src && src.includes('dButton=false')) {
                // Replace dButton=false with dButton=true
                let newSrc = src.replace('dButton=false', 'dButton=true');
                iframe.setAttribute('src', newSrc);
                console.log('Updated iframe src:', newSrc);
            }
        });
    };

    // Check and update iframe src every 2 seconds
    setInterval(checkAndUpdateIframeSrc, 2000);
})();