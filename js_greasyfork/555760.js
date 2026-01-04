// ==UserScript==
// @name         DF1 Alt-Use Item
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  Alt + Click an item to automatically "use" it by simulating a drop on the character 
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555760/DF1%20Alt-Use%20Item.user.js
// @updateURL https://update.greasyfork.org/scripts/555760/DF1%20Alt-Use%20Item.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("click", function(e) {
        if (!e.altKey) return;

        const item = e.target.closest(".item");
        if (!item) return;

        console.log("[AltUse] Using item:", item);

        // DF internal functions + globals required (Which makes no sense but whatever)
        if (typeof window.dragDropAction !== "function") {
            console.warn("[AltUse] dragDropAction() missing");
            return;
        }
        if (!window.fakeGrabbedItem || !window.mousePos) {
            console.warn("[AltUse] DF globals not ready yet");
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // The game checks this global
        window.currentItem = item;

        // The ONLY correct place to drag items to
        const slot = document.querySelector('div.fakeSlot[data-action="giveToChar"]');
        if (!slot) {
            console.warn("[AltUse] fakeSlot (giveToChar) not found");
            return;
        }

        // Save real elementFromPoint
        const originalElementFromPoint = document.elementFromPoint;

        // Override it so dragDropAction thinks cursor is over the fakeSlot
        document.elementFromPoint = function() {
            return slot;
        };

        try {
            console.log("[AltUse] Triggering dragDropAction → giveToChar");

            // Call DF’s real (retarded) drop handler
            window.dragDropAction({
                preventDefault() {}
            });
        } finally {
            // Always restore
            document.elementFromPoint = originalElementFromPoint;
        }
    }, true);
})();
