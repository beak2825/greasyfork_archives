// ==UserScript==
// @name        Always has focus
// @namespace   dev.tock.keepfocus
// @version     1.0
// @description Tricks the page into thinking it is always focused
// @author      Steve Persson
// @match       *://*/*
// @run-at      document-start
// @grant       unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/560247/Always%20has%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/560247/Always%20has%20focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the document.hasFocus() method to always return true
    document.hasFocus = function () {
        return true;
    };
    
    // Override the document.hidden property and visibilityState
    Object.defineProperty(Document.prototype, "hidden", { get: () => false });
    Object.defineProperty(Document.prototype, "visibilityState", { get: () => "visible" });

    // Override the Page Visibility API properties
    Object.defineProperty(document, "visibilityState", {
        get: function () {
            return "visible";
        }
    });

    Object.defineProperty(document, "hidden", {
        get: function () {
            return false;
        }
    });

    // Stop propagation of visibilitychange and blur events
    window.addEventListener('visibilitychange', function (event) {
        event.stopImmediatePropagation();
    }, true);

    window.addEventListener('blur', function (event) {
        event.stopImmediatePropagation();
    }, true);

    // Some sites might use window.onfocus/onblur
    window.onblur = null;
    window.onfocus = null;
    
    // Override the window.onblur event handler
    if (unsafeWindow) {
        unsafeWindow.onblur = null;
    }

})();