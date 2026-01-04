// ==UserScript==
// @name         TMN OC
// @namespace    http://tampermonkey.net/
// @version      1.0.10
// @description  TMN OC Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/organizedcrime.aspx
// @match        https://www.tmn2010.net/authenticated/organizedcrime.aspx?act=*
// @match        https://www.tmn2010.net/authenticated/store.aspx?p=w*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551625/TMN%20OC.user.js
// @updateURL https://update.greasyfork.org/scripts/551625/TMN%20OC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TMN_PLAYER = localStorage.getItem("TMN_PLAYER");
    function GetAvailableTime(message) {
        const regex = /(\d+)\s*hours?.*?(\d+)\s*minutes?.*?(\d+)\s*seconds?/i;

        const match = message.match(regex);

        if (!match) {
            throw new Error("Time format not found in the message.");
        }

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);

        const now = new Date();
        const availableTime = now.getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000;

        return availableTime;
    }
    //https://www.tmn2010.net/authenticated/organizedcrime.aspx?act=accept&ocid=3288&pos=WeaponMaster
    const lblMsg = $("#ctl00_lblMsg").text();

    if (lblMsg?.includes("jail")) {
        setTimeout(() => { location.href = location.href }, 3000);
    } else if (location.href.includes("store")) {
        if (location.href.includes("?p=w&r=organizedcrime&cat=weapon")) {
            setTimeout(() => { document.querySelector("a[href='store.aspx?p=w&act=buy&cat=weapon&itemid=18&r=organizedcrime']").click() }, 3000);
        } else if (location.href.includes("?p=w&r=organizedcrime&cat=explosive")) {
            setTimeout(() => { document.querySelector("a[href='store.aspx?p=w&act=buy&cat=explosive&itemid=9&r=organizedcrime']").click() }, 3000);
        } else {
            setTimeout(() => { location.href = "organizedcrime.aspx" }, 3000);
        }
    } else if (!lblMsg[0] || lblMsg.includes("successfully accepted")) {
        const amReady = $(`tr:contains('${TMN_PLAYER}') > td`).eq(3).text().includes("Ready");
        const curCity = $("#ctl00_userInfo_lblcity").text().trim();
        // const position = location.href.split("pos=")[1]; //2 Transporter 3 WeaponMaster 4 ExplosiveExpert
        const position = $(`tr:contains(${TMN_PLAYER})`).index();
        if (curCity != "London") {
            setTimeout(() => { location.href = "default.aspx"}, 3000);
        } else if (amReady) {
            localStorage.removeItem("TMN_OC_LINK");
            localStorage.removeItem("TMN_OC_Time");
            setTimeout(() => { location.href = "default.aspx"}, 3000);
        } else if (position == "2") {
            let carToUse;
            const carsList = $("#ctl00_main_carslist");
            carsList.children().map((n, e) => {
                if (e.textContent.includes("Audi RS6")) {
                    carToUse = e.value;
                    return;
                } else if (e.textContent.includes("Bentley Continental")) {
                    carToUse = e.value;
                } else if (e.textContent.includes("Bentley Arnage") && !carToUse) {
                    carToUse = e.value;
                }
            });
            carsList.val(carToUse);
            setTimeout(() => { $("#ctl00_main_btnchoosecar").click(); }, 5000);
        } else if (position == "3") {
            //location.href = "https://www.tmn2010.net/authenticated/store.aspx?p=w&r=organizedcrime";
            const weaponList = $("#ctl00_main_weaponslist");
            if (!weaponList.val()) {
                setTimeout(() => { location.href = "store.aspx?p=w&r=organizedcrime&cat=weapon" }, 3000);
            } else {
                setTimeout(() => { $("#ctl00_main_btnChooseWeapon").click(); }, 5000);
            }
        } else if (position == "4") {
            const explosiveList = $("#ctl00_main_explosiveslist");
            if (!explosiveList.val()) {
                setTimeout(() => { location.href = "store.aspx?p=w&r=organizedcrime&cat=explosive" }, 3000);
            } else {
                setTimeout(() => { $("#ctl00_main_btnchooseexplosive").click(); }, 5000);
            }
        }
    } else if (lblMsg.includes("Invalid invitation")) {
        localStorage.removeItem("TMN_OC_LINK");
        setTimeout(() => { location.href = "default.aspx" }, 3000);
    } else if (lblMsg.includes("You cannot do")) {
        localStorage.removeItem("TMN_OC_LINK");
        setTimeout(() => { location.href = "default.aspx" }, 3000);
    } // else if selected equipment delete localstorage return to default
})();