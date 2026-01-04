// ==UserScript==
// @name         Goban Resizer for online-go.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Resizes and centers the goban or go board at online-go.com via a draggable triangle handle at the bottom-right corner. Just refresh the page to reset the size.
// @author       Hesper
// @match        https://online-go.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548688/Goban%20Resizer%20for%20online-gocom.user.js
// @updateURL https://update.greasyfork.org/scripts/548688/Goban%20Resizer%20for%20online-gocom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addResizer() {
        const goban = document.querySelector('.goban-container');
        if (!goban || goban.dataset.resizerAdded) return;

        goban.dataset.resizerAdded = "true";
        goban.style.position = "relative";

        // Triangle handle at bottom-right corner
        const handle = document.createElement("div");
        handle.style.position = "absolute";
        handle.style.right = "0";
        handle.style.bottom = "0";
        handle.style.width = "0";
        handle.style.height = "0";
        handle.style.borderTop = "20px solid transparent";
        handle.style.borderRight = "20px solid rgba(128,128,128,0.7)";
        handle.style.cursor = "ew-resize"; 
        handle.style.zIndex = "9999";

        goban.appendChild(handle);

        // Drag logic
        handle.addEventListener("mousedown", function(e) {
            e.preventDefault();
            const startX = e.clientX;
            const startWidth = goban.offsetWidth;

            function onMouseMove(e) {
                const newWidth = startWidth + (e.clientX - startX);
                goban.style.width = newWidth + "px";
                goban.style.alignSelf = "center";
            }

            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }

    const observer = new MutationObserver(addResizer);
    observer.observe(document.body, { childList: true, subtree: true });

    addResizer();
})();
