// ==UserScript==
// @name         Alegion - Disable Enter Key
// @description  Disable Enter Key on Alegion HITs
// @author       Kerek
// @namespace    Kerek
// @version      0.1
// @match  https://staging.alegion.com/render/hit?*
// @downloadURL https://update.greasyfork.org/scripts/7770/Alegion%20-%20Disable%20Enter%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/7770/Alegion%20-%20Disable%20Enter%20Key.meta.js
// ==/UserScript==

document.addEventListener("keydown",function(i) {
    if (i.keyCode == 13) {
        i.preventDefault();
    }
});