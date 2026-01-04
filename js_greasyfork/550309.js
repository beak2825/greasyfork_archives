// ==UserScript==
// @name         TMN GTA
// @namespace    http://tampermonkey.net/
// @version      1.1.8
// @description  TMN GTA Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/crimes.aspx?p=g
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550309/TMN%20GTA.user.js
// @updateURL https://update.greasyfork.org/scripts/550309/TMN%20GTA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HA_URL = 'https://67wol.duckdns.org:8443';
    const TOKEN = localStorage.getItem("TMN_TOKEN") || prompt("Enter Token");
    localStorage.setItem("TMN_TOKEN", TOKEN);

    function ScriptsEnabled() {
        return fetch(`${HA_URL}/api/states/input_boolean.tmn_scripts`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
            credentials: 'omit',
            cache: 'no-store'
        })
            .then(res => res.json())
            .then(body => body?.state === 'on')
            .catch(() => true);
    }

    if (window.self == window.top) {
        return;
    }

    function humanClick(el) {
        if (!el) return;
        el.click();
    }

    const scriptCheck = $("#ctl00_main_MyScriptTest_btnSubmit")[0];
    if (scriptCheck) {
        /*const recheck = setInterval(() => {
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

    function PerformGTA() {
        ScriptsEnabled()
            .then(enabled => {
            if (!enabled) {
                setTimeout(PerformGTA, 10000);
                return;
            };
            var text = $("#ctl00_main_lblResult").text();
            if (text.includes("seconds")) {
                var match = text.match(/(\d+)\s*seconds/);
                if (match) {
                    var seconds = parseInt(match[1], 10);

                    // Calculate target timestamp
                    var targetTime = Date.now() + seconds * 1000;

                    // Store in localStorage
                    localStorage.setItem("TMN_GTA_Time", targetTime);

                    // Log human-readable local time
                    console.log("Reload scheduled at:", new Date(targetTime).toLocaleTimeString());

                    // Check periodically to reload when time is reached
                    var interval = setInterval(() => {
                        text = $("#ctl00_main_lblResult").text();
                        match = text.match(/(\d+)\s*seconds/);
                        $("#ctl00_main_lblResult").html(`You are only allowed to attempt a car theft every 4 minutes!<br>Still ${match[1] - 1} seconds left.`)
                        var storedTime = parseInt(localStorage.getItem("TMN_GTA_Time"), 10);
                        if (storedTime && Date.now() >= storedTime) {
                            clearInterval(interval);
                            location.href = location.href; // reload page
                        }
                    }, 1000);
                }
            } else if ($("#ctl00_main_carslist_4")[0]) {
                humanClick($("#ctl00_main_carslist_4")[0]);
                setTimeout(() => {
                    humanClick($("#ctl00_main_btnStealACar")[0]);
                }, Math.random() * 400 + 200);
            } else if (text.includes("successfully")) {
                setTimeout(() => { location.href = "/authenticated/playerproperty.aspx?p=g&cleanup" }, Math.random() * 3000);
            } else {
                setTimeout(() => { location.href = location.href }, Math.random() * 5000);
            }
        })
    }

    PerformGTA();
})();