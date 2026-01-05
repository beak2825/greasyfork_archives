// ==UserScript==
// @name         Fast Xtglinks AutoClicker
// @namespace    AutoBypass
// @version      2.0
// @description  Auto Clicker For Xtglinks
// @author       NickUpdates-Telegram
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/558492/Fast%20Xtglinks%20AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/558492/Fast%20Xtglinks%20AutoClicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var host = location.hostname;
    var url = new URL(location.href);

    /* 7vibelife + creditshui → mealcold */
    if (host.includes("7vibelife.com") || host.includes("creditshui.com")) {
        var token =
            url.searchParams.get("token") ||
            url.searchParams.get("id");

        if (token) {
            location.replace("https://mealcold.com/prolink.php?id=" + token);
        } else {
            location.replace("https://mealcold.com/");
        }
        return;
    }

    /* mealcold → xtglinks */
    if (host.includes("mealcold.com")) {
        var id = url.searchParams.get("id");
        if (id) {
            location.replace("https://xtglinks.com/" + id);
        }
        return;
    }

})();
