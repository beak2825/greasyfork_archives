// ==UserScript==
// @name         Highlight External Links
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Resalta todos los enlaces externos en cualquier página web.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558053/Highlight%20External%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/558053/Highlight%20External%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentHost = window.location.hostname;

    document.querySelectorAll('a[href]').forEach(link => {
        try {
            const url = new URL(link.href);
            if (url.hostname !== currentHost) {
                link.style.border = "2px solid red";
                link.style.padding = "2px";
                link.style.borderRadius = "4px";
            }
        } catch (e) {
            // Ignorar URLs inválidas
        }
    });
})();