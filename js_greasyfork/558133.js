// ==UserScript==
// @name         SteamGifts Space Monkey
// @version      1.1
// @description  replaces the space cat gif with space monkey
// @match        https://www.steamgifts.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/104933
// @downloadURL https://update.greasyfork.org/scripts/558133/SteamGifts%20Space%20Monkey.user.js
// @updateURL https://update.greasyfork.org/scripts/558133/SteamGifts%20Space%20Monkey.meta.js
// ==/UserScript==

(function() {
    const newGif = "https://i.imgur.com/MEguFpH.gif";

    function replace() {
        document.querySelectorAll('img[src="https://cdn.steamgifts.com/img/cat/default.gif"]')
            .forEach(img => {
                img.src = newGif;
                img.style.width = "250px";
                img.style.height = "178px";
                img.style.objectFit = "cover"; // optional, verhindert Verzerrung
            });
    }

    replace();

    const obs = new MutationObserver(replace);
    obs.observe(document.body, { childList: true, subtree: true });
})();