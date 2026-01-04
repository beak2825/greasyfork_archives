// ==UserScript==
// @name         TMN Auto Travel
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  TMN Auto Travel Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/travel.aspx?d=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552112/TMN%20Auto%20Travel.user.js
// @updateURL https://update.greasyfork.org/scripts/552112/TMN%20Auto%20Travel.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const destination = location.href.split("d=")[1];
    const lblMsg = $("#ctl00_lblMsg").text();
    const welcomeMsg = $("#ctl00_main_lblWelcome").text();

    if (lblMsg.includes("jail")) {
        setTimeout(() => { location.href = location.href }, Math.random() * 5000);
    } else if (welcomeMsg.includes("Welcome")) {
        setTimeout(() => { location.href = "default.aspx" }, Math.random() * 5000);
    } else {
        $(`label:contains(${destination})`).click();
        setTimeout(() => { $("#ctl00_main_btntravel").click() }, Math.random() * 2000 + 3000);
    }
})();