// ==UserScript==
// @name         re621 - e621 Reimagined - Download button mover
// @namespace    re621DLBtnmvr
// @version      1.3.1
// @description  Moves the download button out of the overflow menu.
// @author       Mel Otsagae
// @license      MIT
// @match        https://e621.net/posts/*
// @match        https://e926.net/posts/*
// @icon         https://cdn.jsdelivr.net/gh/re621/re621.Legacy@master/assets/icon64.png
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552793/re621%20-%20e621%20Reimagined%20-%20Download%20button%20mover.user.js
// @updateURL https://update.greasyfork.org/scripts/552793/re621%20-%20e621%20Reimagined%20-%20Download%20button%20mover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveDownloadButton() {
        setTimeout(function() {
            const DLBtn = document.getElementById('image-custom-download-file');
            if (!DLBtn) return;

            const currentParent = DLBtn.parentNode;
            const newParent = currentParent?.parentNode;

            if (newParent) {
                newParent.insertBefore(DLBtn, currentParent);
            }
        }, 600);
    }

    // Run immediately if the window already has focus
    if (document.hasFocus()) {
        moveDownloadButton();
    } else {
        // Otherwise, wait for the focus event
        window.addEventListener('focus', moveDownloadButton, { once: true });
    }
})();
