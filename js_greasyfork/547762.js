// ==UserScript==
// @name         ibon_open_shadow
// @namespace    ibon_open_shadow_cc
// @version      0.0.0
// @description  IBON： 打開 shadow
// @author       cg
// @match        https://orders.ibon.com.tw/*
// @match        https://ticket.ibon.com.tw/*
// @grant        none
// @license      MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/547762/ibon_open_shadow.user.js
// @updateURL https://update.greasyfork.org/scripts/547762/ibon_open_shadow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function (init) {
        // If the component tries to create a 'closed' root...
        if (init.mode === 'closed') {
            console.warn('A component tried to create a closed shadow root. Forcing it to be open.');
            // ...force it to be 'open' instead.
            init.mode = 'open';
        }
        // Call the original method with the (potentially modified) options
        return originalAttachShadow.call(this, init);
    };
})();