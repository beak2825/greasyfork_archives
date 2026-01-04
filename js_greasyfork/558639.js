// ==UserScript==
// @name         Neopets - Smaller NeoBoards Stickers
// @version      1.0
// @description  Update the size of all neoboard stickers with CSS
// @author       pixiezui
// @match        *://*.neopets.com/neoboards/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1546968
// @downloadURL https://update.greasyfork.org/scripts/558639/Neopets%20-%20Smaller%20NeoBoards%20Stickers.user.js
// @updateURL https://update.greasyfork.org/scripts/558639/Neopets%20-%20Smaller%20NeoBoards%20Stickers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '.boardPostMessage img { max-height: 50px; }'; // CHANGE THE NUMBER IF YOU WANT IT SMALLER OR BIGGER
    document.head.appendChild(style);
})();