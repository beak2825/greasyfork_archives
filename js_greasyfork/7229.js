// ==UserScript==
// @name        Backspace Means Backspace
// @namespace   https://github.com/infofarmer
// @version     0.1.1
// @description Prevents Back action on Backspace key
// @include     *
// @run-at      document-start
// @copyright   2014+, nollegcraft/playswithlife
// @downloadURL https://update.greasyfork.org/scripts/7229/Backspace%20Means%20Backspace.user.js
// @updateURL https://update.greasyfork.org/scripts/7229/Backspace%20Means%20Backspace.meta.js
// ==/UserScript==

window.addEventListener('keydown', function(e) {
    if (e.keyIdentifier == 'U+0008' || e.keyIdentifier == 'Backspace') {
        if (e.target == document.body) {
            e.preventDefault();
        }
    }
}, true);
