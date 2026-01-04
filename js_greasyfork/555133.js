// ==UserScript==
// @name         Lichess Walnut Board (Replaces Wood4)
// @namespace    http://tampermonkey.net/
// @version      999.999
// @description  Select the wood4 board and you'll use the Walnut. Walnut board from chess.com
// @author       ZeptionT
// @include     http://lichess.org/*
// @include     https://lichess.org/*
// @include     http://*.lichess.org/*
// @include     https://*.lichess.org/*
// @run-at      document-start
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555133/Lichess%20Walnut%20Board%20%28Replaces%20Wood4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555133/Lichess%20Walnut%20Board%20%28Replaces%20Wood4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cssboard = `
        /* Walnut board will be installed replacing the wood4 theme */
        body[data-board="wood4"] .is2d cg-board::before {
            background-image: url("https://images.chesscomfiles.com/chess-themes/boards/walnut/150.png") !important;
        }
    `;

    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(cssboard);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(cssboard);
    } else if (typeof addStyle != "undefined") {
        addStyle(cssboard);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
})();