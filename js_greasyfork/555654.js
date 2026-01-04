// ==UserScript==
// @name         Steam Broadcast Page remover
// @namespace    http://tampermonkey.net/
// @version      2025-11-12
// @description  removes steam broadcast section
// @author       nouxinf
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555654/Steam%20Broadcast%20Page%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/555654/Steam%20Broadcast%20Page%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBroadcast() {
        document.getElementById("broadcast").remove();
    }
    const interval = setInterval(removeBroadcast, 1000);
})();