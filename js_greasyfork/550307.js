// ==UserScript==
// @name         TMN Booze
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  TMN Booze Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/crimes.aspx?p=b*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550307/TMN%20Booze.user.js
// @updateURL https://update.greasyfork.org/scripts/550307/TMN%20Booze.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function humanClick(el) {
        if (!el) return;
        el.click();
    }

    const sqlScriptCheck = $("#ctl00_main_pnlMessage")[0];
    const scriptCheck = $("#ctl00_main_MyScriptTest_btnSubmit")[0];

    if (window.self == window.top) {
        return;
    }

    if (sqlScriptCheck) {
        const message = $("#ctl00_main_pnlMessage").text().replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").replace("Important message ", "").trim();
        fetch("https://67wol.duckdns.org:8443/api/webhook/checktmn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "SQL Script Check",
                message: message
            })
        })
        const recheck = setInterval(() => {
            fetch(location.href)
                .then(res => res.text())
                .then(body => {
                const doc = $("<div>").html($(body));
                const scriptCheckStillPresent = doc.find("#ctl00_main_pnlMessage")[0];
                if (!scriptCheckStillPresent) {
                    clearInterval(recheck);
                    location.href = location.href;
                }
            });
        }, 5000);
        return;
    } else if (scriptCheck) {
        /*fetch("https://67wol.duckdns.org:8443/api/webhook/checktmn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Script Check",
                message: "Scripts paused due to a script check."
            })
        })
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
        return;*/
        window.top.location.href = "crimes.aspx?scriptCheck";
    }

    const lblMsg = $("#ctl00_lblMsg").text() || $("#ctl00_main_lblResult").text();

    if (lblMsg.includes("You successfully") || lblMsg.includes("jail")) {
        setTimeout(() => { location.href = location.href }, Math.random() * 5000);
        return;
    } else if (lblMsg.includes("seconds")) {
        let match = lblMsg.match(/(\d+)\s*seconds/);
        if (match) {
            const seconds = parseInt(match[1], 10);
            const targetTime = Date.now() + seconds * 1000;

            localStorage.setItem("TMN_Booze_Time", targetTime);
            console.log("Reload scheduled at:", new Date(targetTime).toLocaleTimeString());

            const interval = setInterval(() => {
                let text = $("#ctl00_main_lblResult").text();
                match = text.match(/(\d+)\s*seconds/);
                $("#ctl00_main_lblResult").html(`You are only allowed to sell or buy booze every 2 minutes!<br>Still ${match[1] - 1} seconds left.`)
                const storedTime = parseInt(localStorage.getItem("TMN_Booze_Time"), 10);
                if (storedTime && Date.now() >= storedTime) {
                    clearInterval(interval);
                    setTimeout(() => { location.href = location.href }, Math.random() * 5000);
                }
            }, 1000);
        }
        return;
    }

    const rows = $('tr').slice(1).map(function () {
        return {
            price: parseInt($(this).find('td').eq(1).text().replace(/[^0-9]/g, '')) || Infinity,
            holdings: $(this).find('td').eq(2)
        };
    });

    let lowestInput = null;
    let lowestBuyBtn = null;
    let lowestCost = Infinity;
    let didSell = false;

    rows.each((n, el) => {
        const amount = parseInt(el.holdings.text().replace(/[^0-9]/g, '')) || 0;

        if (amount > 0) {
            didSell = true;

            const sellInput = $('[id*="tbAmtSell"]')[n];
            const sellBtn = $('[id*="btnSell"]')[n];

            if (sellInput && sellBtn) {
                sellInput.value = 1;
                humanClick(sellBtn);
            }
        }

        if (el.price < lowestCost) {
            lowestCost = el.price;
            lowestInput = $('[id*="tbAmtBuy"]')[n];
            lowestBuyBtn = $('[id*="btnBuy"]')[n];
        }
    });

    if (!didSell && lowestInput && lowestBuyBtn) {
        humanClick(lowestInput);
        const amountToBuy = lblMsg.split("Maximum for your rank is: ")[1] || 999;
        const cash = $("#ctl00_userInfo_lblcash").text().split("$")[1].replaceAll(",", "") * 1;

        lowestInput.value = Math.floor(Math.min(cash / lowestCost, amountToBuy));
        humanClick(lowestBuyBtn);
    }
})();