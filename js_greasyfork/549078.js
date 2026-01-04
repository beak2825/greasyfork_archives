// ==UserScript==
// @name         Neopets: Avatars in Reverse Order
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.0.1
// @description  Reorders avatars in the Neoboards preference page to most recent first
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/settings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/549078/Neopets%3A%20Avatars%20in%20Reverse%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/549078/Neopets%3A%20Avatars%20in%20Reverse%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const parent = document.querySelector(".popup-body__2020:has(.settings-avatars)");
    const p = document.createElement("p");
    const b = document.createElement("b");
    b.textContent = "Normal Avatars:";
    p.appendChild(b);
    parent.appendChild(p);
    parent.appendChild(document.getElementsByClassName("settings-avatars")[0]);
    const avatars = [...document.querySelectorAll(".settings-avatars:first-of-type .settings-av")];
    const div = document.getElementsByClassName("settings-avatars")[0];
    for (let i = avatars.length - 1; i > -1; i--) {
        div.appendChild(avatars[i]);
    }
})();
