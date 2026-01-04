// ==UserScript==
// @name         BotMafia s3
// @namespace    https://tampermonkey.net/
// @version      3.0
// @description  Automatyzacja gry (Loader)
// @license      MIT
// @match        https://s3.polskamafia.pl/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
//
// @downloadURL https://update.greasyfork.org/scripts/548038/BotMafia%20s3.user.js
// @updateURL https://update.greasyfork.org/scripts/548038/BotMafia%20s3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_URL = 'https://raw.githubusercontent.com/Awq1337/Bot/main/botmafia_main.js';
    console.log('[BotMafia Loader] Próba załadowania głównego skryptu...');
    GM_xmlhttpRequest({
        method: 'GET',
        url: SCRIPT_URL + '?nocache=' + Math.random(),
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                console.log('[BotMafia Loader] Skrypt pobrany, uruchamiam...');
                eval(response.responseText);
            } else {
                console.error(`[BotMafia Loader] Nie udało się pobrać skryptu: ${response.statusText} (Status: ${response.status})`);
            }
        },
        onerror: function(response) {
            console.error('[BotMafia Loader] Błąd sieci podczas ładowania skryptu:', response.statusText);
        }
    });
})();