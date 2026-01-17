// ==UserScript==
// @name         Poky Bypass / Poki Ad Bypass
// @version      1
// @description  easy ad bypass for all poki games
// @author       progressive
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poki.com
// @grant        none
// @namespace https://greasyfork.org/users/1561336
// @downloadURL https://update.greasyfork.org/scripts/562987/Poky%20Bypass%20%20Poki%20Ad%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/562987/Poky%20Bypass%20%20Poki%20Ad%20Bypass.meta.js
// ==/UserScript==

/*

Most asked question: Why does the match have "*://* /*"? / Why does it run on all websites?

Answer: The are a lot of poki games, and some of them have their own domain.
Instead of listing all of them, the script runs on all websites,
but it does nothing if no Poki game is detected.
Also, you can turn off the userscript at any time.
Just to let you know, you can also paste this script in the console.

*/

(function() {
    "use strict";

    // support for console & userscript
    var win = Function("\"POKY BYPASS\";return this")();

    poky();
    function poky() {
        if ("PokiSDK" in win) {
            win.PokiSDK.rewardedBreak = () => new Promise(res => res(true));
            win.PokiSDK.commercialBreak = () => new Promise(res => res(true));
            win.PokiSDK.displayAd = () => {};
        }
        requestAnimationFrame(poky)
    }
})();