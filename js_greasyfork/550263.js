// ==UserScript==
// @name         WebDoc - Restnoteringar Data Provider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Laddar restnoteringsdata från GitHub och injicerar den globalt i sidan så att andra script kan använda window.RESTNOTERINGAR.
// @author       Du
// @match        https://webdoc.atlan.se/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/550263/WebDoc%20-%20Restnoteringar%20Data%20Provider.user.js
// @updateURL https://update.greasyfork.org/scripts/550263/WebDoc%20-%20Restnoteringar%20Data%20Provider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const today = new Date().toISOString().split('T')[0];
    const JSON_URL = `https://raw.githubusercontent.com/segerkvist/Restnoteringar/main/Restanm%C3%A4lningar.json?cachebust=${today}`;

    function injectIntoPage(data) {
        const script = document.createElement('script');
        script.textContent = `window.RESTNOTERINGAR = ${JSON.stringify(data)};`;
        script.id = '__restnoteringar_injected';
        (document.head || document.documentElement).appendChild(script);
        console.log('[Restnoteringar Data Provider] Data injicerad i sidan:', data.length, 'poster');
    }

    function loadAndInject() {
        GM_xmlhttpRequest({
            method: "GET",
            url: JSON_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    injectIntoPage(data);
                } catch (e) {
                    console.error('[Restnoteringar Data Provider] Fel vid tolkning av JSON:', e);
                }
            },
            onerror: function(error) {
                console.error('[Restnoteringar Data Provider] Kunde inte ladda JSON:', error);
            }
        });
    }

    // Starta direkt
    loadAndInject();
})();