// ==UserScript==
// @name         TMN Buy Bullets
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  try to take over the world!
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/store.aspx?p=b*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550426/TMN%20Buy%20Bullets.user.js
// @updateURL https://update.greasyfork.org/scripts/550426/TMN%20Buy%20Bullets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function humanClick(el) {
        if (!el) return;
        el.click();
    }

    const scriptCheck = $("#ctl00_main_MyScriptTest_btnSubmit")[0];
    if (scriptCheck) {
        const recheck = setInterval(() => {
            fetch(location.href)
                .then(res => res.text())
                .then(body => {
                const doc = $("<div>").html($(body));
                const scriptCheckStillPresent = doc.find("#ctl00_main_MyScriptTest_btnSubmit")[0];
                if (!scriptCheckStillPresent) {
                    clearInterval(recheck);
                    location.href = location.href;
                }
            });
        }, 5000);
        return;
    }
    const lblMsg = $("#ctl00_lblMsg").text();
    const bulletsAvailable = [ $("#ctl00_main_lblbullet1").text() * 1, $("#ctl00_main_lblbullet2").text() * 1 ];
    const bulletType = bulletsAvailable[0] > 0 ? 0 : bulletsAvailable[1] > 0 ? 1 : 0;
    const purchaseAmount = Math.min(bulletsAvailable[bulletType], 400) == 0 ? Math.min(bulletsAvailable[1 - bulletType], 400) == 0 ? 0 : Math.min(bulletsAvailable[1 - bulletType], 400) : Math.min(bulletsAvailable[bulletType], 400);

    if (purchaseAmount == 0) {
        if (lblMsg.includes("bought") || lblMsg.includes("that many")) {
            setTimeout(() => { location.href = "default.aspx" }, Math.random() * 5000);
        }
    } else if (lblMsg.includes("again")) {
        setTimeout(() => { location.href = location.href }, Math.random() * 2000);
    } else if (lblMsg.includes("bought")) {
        setTimeout(() => {
            location.href = location.href;
        }, 16000);
    } else {
        $("#ctl00_main_txtbullets").val(purchaseAmount);
        $("#ctl00_main_ddlbullettype").val(bulletType + 1);
        //humanClick($("#ctl00_main_btnBuyBullets")[0]);
    }
})();