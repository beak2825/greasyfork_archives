// ==UserScript==
// @name         CoinPayz Faucet Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Otomatis Klik Iklan Faucet nggo Bypass Termux
// @author       Gemini
// @match        https://coinpayz.xyz/faucet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562117/CoinPayz%20Faucet%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/562117/CoinPayz%20Faucet%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Script Faucet Clicker Aktif!");

    // Nunggu 5 detik ben iklan metu dhisik
    setTimeout(function() {
        // Goleki kabeh elemen sing dadi syarat klik (iframe utawa banner)
        var ads = document.querySelectorAll('iframe, .ad-slot, ins, [id^="ad_"]');
        if (ads.length > 0) {
            console.log("Iklan ketemu, nyoba nge-klik...");
            ads[0].click(); 
            // Kadang butuh diklik ping pindho beda panggon
            if(ads[1]) ads[1].click();
        } else {
            console.log("Iklan durung ketemu, jajal refresh manual.");
        }
    }, 5000);
})();