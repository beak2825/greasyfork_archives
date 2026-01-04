// ==UserScript==
// @name         TMN Garage Cleanup
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  TMN Garage Cleanup Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/playerproperty.aspx?p=g&cleanup
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553813/TMN%20Garage%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/553813/TMN%20Garage%20Cleanup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.confirm = () => true;
    const lblMsg = $("#ctl00_lblMsg");
    const city = $("#ctl00_userInfo_lblcity").text();
    const desiredCars = [ "Bentley Continental", "Audi RS6 Avant", "Bentley Arnage", "Mercedes Benz E-Class" ];
    const availableCars = $("#ctl00_main_gvCars tr").slice(1);

    function Repair() {
        availableCars.each((n, e) => {
            const car = $(e).find("td:eq(1)").text();
            const carDamage = $(e).find("td:eq(4)").text();
            if (desiredCars.includes(car) && carDamage !== "0%") $(e).find("input").prop("checked", true);
        });
        if ($("input:checked").length > 0) {
            setTimeout(() => { $("#ctl00_main_btnRepair").click(); }, 3000);
            return;
        } else {
            Transport();
        }
    }

    function Transport() {
        availableCars.each((n, e) => {
            const car = $(e).find("td:eq(1)").text();
            const carLocation = $(e).find("td:eq(5)").text();
            if (desiredCars.includes(car) && carLocation !== "London - England") $(e).find("input").prop("checked", true);
            if ($("input:checked").length > 0) {
                setTimeout(() => {
                    $("#ctl00_main_ddlCities").val(5);
                    $("#ctl00_main_btnTransport").click();
                }, 3000);
                return;
            } else {
                setTimeout(() => { location.href = "/authenticated/crimes.aspx?p=g" }, 3000);
            }
        });
        setTimeout(() => { location.href = "/authenticated/crimes.aspx?p=g" }, 3000);
    }

    function Sell() {
        availableCars.each((n, e) => {
            const car = $(e).find("td:eq(1)").text();
            if (!desiredCars.includes(car)) $(e).find("input").prop("checked", true);
        });
        if ($("input:checked").length > 0) {
            setTimeout(() => { $("#ctl00_main_btnSellSelected").click(); }, 3000);
            return;
        } else {
            Repair();
        }
    }

    if (lblMsg?.text().includes("jail")) {
        setTimeout(() => { location.href = location.href }, 3000);
        return;
    } else if (lblMsg?.text().includes("repaired")) {
        if (!city.includes("London")) {
            Transport();
        } else {
            setTimeout(() => { location.href = "crimes.aspx?p=g" }, 3000);
        }
    } else if (lblMsg?.text().includes("sold")) {
        Repair();
    } else if (lblMsg?.text().includes("London")) {
        setTimeout(() => { location.href = "crimes.aspx?p=g" }, 3000);
    } else {
        Sell();
    }
})();