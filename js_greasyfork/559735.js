// ==UserScript==
// @name         All Shorteners Instant Bypass
// @namespace    AutoBypass
// @version      3.0.71
// @description  Instantly bypass supported shorteners
// @author       Original Script by NickUpdates (Telegram)
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/559735/All%20Shorteners%20Instant%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/559735/All%20Shorteners%20Instant%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const host = location.hostname;
    const url = new URL(location.href);

    const id  = url.searchParams.get("id");
    const lid = url.searchParams.get("link");

    function clearPage() {
        window.stop();
        document.documentElement.innerHTML = "";
    }

    /* 7vibelife + creditshui → mealcold */
    if (
        host === "7vibelife.com" ||
        host.endsWith(".7vibelife.com") ||
        host === "creditshui.com" ||
        host.endsWith(".creditshui.com")
    ) {
        const token = url.searchParams.get("token") || id;
        if (token) {
            clearPage();
            location.replace("https://mealcold.com/prolink.php?id=" + token);
        }
        return;
    }

    /* mealcold → xtglinks */
    if (host === "mealcold.com" || host.endsWith(".mealcold.com")) {
        if (id) {
            clearPage();
            location.replace("https://xtglinks.com/" + id);
        }
        return;
    }

    /* wblaxmibhandar → lksfy */
    if (host.includes("wblaxmibhandar.com")) {
        if (id) {
            location.replace("https://lksfy.com/" + id);
        }
        return;
    }

    /* mahitimanch → inshorturl */
    if (host.includes("mahitimanch.in")) {
        if (lid) {
            location.replace("https://inshorturl.in/" + lid);
        }
        return;
    }

    /* rinku redirect */
    if (location.pathname.includes("/rinku/")) {
        const getid = url.searchParams.get("get");
        if (getid) {
            location.replace("https://rinku.pro/flyinc./" + getid);
        }
        return;
    }

    /* Auto submit button */
    function submitForm() {
        const btn = document.querySelector("#submit-button");
        if (btn) btn.click();
    }

    submitForm();

    const observer = new MutationObserver(submitForm);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();