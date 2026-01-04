// ==UserScript==
// @name         Fix til Klimafoderdatabase.dk
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Viser klimaaftryk på Klimafoderdatabase.dk
// @match        *://klimafoderdatabase.dk/Blandingsberegner*
// @match        *://www.klimafoderdatabase.dk/Blandingsberegner*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547724/Fix%20til%20Klimafoderdatabasedk.user.js
// @updateURL https://update.greasyfork.org/scripts/547724/Fix%20til%20Klimafoderdatabasedk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Userscript kører!");

    function fixClasses() {
        document.querySelectorAll('[class]').forEach(el => {
            el.className = el.className.replace(/_disabled/g, "");
        });
    }

    fixClasses();

    const observer = new MutationObserver(() => fixClasses());
    observer.observe(document.body, { childList: true, subtree: true });
})();
