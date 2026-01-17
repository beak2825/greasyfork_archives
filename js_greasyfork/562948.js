// ==UserScript==
// @name        Colors Improvement v1
// @namespace   Violentmonkey Scripts
// @match       https://ourworldoftext.com/
// @grant       none
// @version     1.0
// @author      WindowToaster
// @description Colors for OWOT
// @license Public Domain or CC0
// @downloadURL https://update.greasyfork.org/scripts/562948/Colors%20Improvement%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/562948/Colors%20Improvement%20v1.meta.js
// ==/UserScript==

gradient = true;

(function () {
    const wait = setInterval(() => {
        if (typeof window.renderChar === "function") {
            clearInterval(wait);

            const original = window.renderChar;

            window.renderChar = function (...args) {

                if (gradient && args[3].charCodeAt(0) < 0x1000 && (args[8] == null || args[8] == "note"))
                {
                  gred =   Math.abs((Math.abs(args[13]) * 0x40) % 0x200 - 0xFF);
                  ggreen = Math.abs((         args[11]  * 0x30) % 0x180 - 0xB9 + 0x20);
                  gblue =  Math.abs((Math.abs(args[12]) * 0x18) % 0x200 - 0xFF);

                  args[4] = gred * 0x10000 + ggreen * 0x100 + gblue;
                }

                if (args[3].includes("\u0307"))
                { if (args[8] == "url") { args[4] = 0xB000A0; }
                    else if (args[8] == "coord") { args[4] = 0x70C000; }
                    else { args[4] = 0xA00000; } }

                if (args[3].includes("\u034f"))
                { if (args[8] == "url") { args[4] = 0x0080FF; }
                    else if (args[8] == "coord") { args[4] = 0xc0b000; }
                    else { args[4] = 0x906000; } }

                return original.apply(this, args);
            };
        }
    }, 50);
})();