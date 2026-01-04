// ==UserScript==
// @name         RoPro Badge Changer
// @version      pre-alpha-0.9.9
// @description  Gives you a random badge on your profile everytime you refresh! Your badge will change in 6 seconds. (RoPro extension needed)
// @author       @focat on roblox
// @match        http://*.roblox.com/users/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://ropro.io/images/ultra_icon_shadow.png&size=64
// @grant        none
// @license      Apache 2.0
// @namespace    https://replit.com/@Code1Tech
// @downloadURL https://update.greasyfork.org/scripts/553048/RoPro%20Badge%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/553048/RoPro%20Badge%20Changer.meta.js
// ==/UserScript==

function changeBadge() {
    var badge = "https://ropro.io/images/ultra_icon_shadow.png";
    document.getElementsByClassName("ropro-profile-icon")[0].src=badge;
}

(function() {
    'use strict';
    setTimeout(changeBadge, 1);
})();