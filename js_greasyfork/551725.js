// ==UserScript==
// @name ! CowGame Private Server
// @author Murka
// @description Moomoo.io private server for all type of needs!
// @icon https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @version 1.1
// @match *://moomoo.io/
// @match *://moomoo.io/?server*
// @match *://*.moomoo.io/
// @match *://*.moomoo.io/?server*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/551725/%21%20CowGame%20Private%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/551725/%21%20CowGame%20Private%20Server.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Greasyfork: https://greasyfork.org/users/919633
    Discord: https://discord.gg/cPRFdcZkeD

    HOW IT WORKS?
    Just simply go to moomoo.io and click PLAY.
    You'll be automatically redirected to a private server!
*/

(function() {
    "use strict";

    window.WebSocket = new Proxy(WebSocket, {
        construct(target, args) {
            args[0] = "wss://cowgame-private-server-production.up.railway.app/";
            return new target(...args);
        }
    });

})();