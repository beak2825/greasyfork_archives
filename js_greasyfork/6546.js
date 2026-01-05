// ==UserScript==
// @name            Derefered
// @namespace       varb
// @version         0.2
// @description     Ctrl-click opens pages through a dereferer.
// @match           *://*/*
// @grant           none
// @noframes
// @run-at          document-end
// @license         WTFPL Version 2; http://www.wtfpl.net/txt/copying/
// @downloadURL https://update.greasyfork.org/scripts/6546/Derefered.user.js
// @updateURL https://update.greasyfork.org/scripts/6546/Derefered.meta.js
// ==/UserScript==

(function () {
    document.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && e.ctrlKey) {
            e.preventDefault();
            window.open(deref(e.target.href), '_blank');
        }
    }, false);

    function deref(uri) {
        return 'http://www.dereferer.org/?' + encodeURIComponent(uri);
    }
})();
