// ==UserScript==
// @name         Pomocnik ataków (Loader)
// @namespace    https://tampermonkey.net/
// @version      1.4
// @description  Pomocnik ataków
// @match        https://s3.polskamafia.pl/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
//
// @downloadURL https://update.greasyfork.org/scripts/559431/Pomocnik%20atak%C3%B3w%20%28Loader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559431/Pomocnik%20atak%C3%B3w%20%28Loader%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_URL = 'https://raw.githubusercontent.com/Awq1337/Pomocnik-Atak-w/main/main.js';
    console.log('[Pomocnik ataków] Próba załadowania głównego skryptu...');
    GM_xmlhttpRequest({
        method: 'GET',
        url: SCRIPT_URL + '?nocache=' + Math.random(),
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                console.log('[Pomocnik ataków] Skrypt pobrany, uruchamiam...');
                eval(response.responseText);
            } else {
                console.error(`[Pomocnik ataków] Nie udało się pobrać skryptu: ${response.statusText} (Status: ${response.status})`);
                console.error(`[Pomocnik ataków] SPRAWDŹ, CZY TEN LINK DZIAŁA W PRZEGLĄDARCE: ${SCRIPT_URL}`);
            }
        },
        onerror: function(response) {
            console.error('[Pomocnik ataków] Błąd sieci podczas ładowania skryptu:', response.statusText);
        }
    });
})();