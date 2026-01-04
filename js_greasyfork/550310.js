// ==UserScript==
// @name         TMN Jail Break
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  TMN Jail Break Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/jail.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550310/TMN%20Jail%20Break.user.js
// @updateURL https://update.greasyfork.org/scripts/550310/TMN%20Jail%20Break.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HA_URL = 'https://67wol.duckdns.org:8443';
    const TOKEN = localStorage.getItem("TMN_TOKEN") || prompt("Enter Token");
    localStorage.setItem("TMN_TOKEN", TOKEN);

    async function ToggleScripts(on) {
        const state = on == true ? "turn_on" : on == false ? "turn_off" : "toggle";
        const res = await fetch(`${HA_URL}/api/services/input_boolean/${state}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entity_id: 'input_boolean.tmn_scripts' })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log('Toggle result:', data);
    }

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


    // Break script using the humanClick function
    function randomBreakClick() {
        var buttons = $("[id$='_btnBreak']:not([disabled])");
        if (buttons.length) {
            // Pick random button and click human-like
            var randomButton = buttons.eq(Math.floor(Math.random() * buttons.length))[0];
            ScriptsEnabled()
                .then(enabled => {
                if (!enabled) {
                    setTimeout(randomBreakClick, 10000);
                    return;
                };
                humanClick(randomButton);
            })
        } else {
            // Fallback: press "R" after 1–3s pause
            var wait = Math.random() * 2000 + 1000;
            setTimeout(() => {
                document.dispatchEvent(new KeyboardEvent("keydown", {key: "r", code: "KeyR", keyCode: 82, which: 82, bubbles: true}));
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent("keyup", {key: "r", code: "KeyR", keyCode: 82, which: 82, bubbles: true}));
                }, Math.random() * 100 + 50);
            }, wait);
        }
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

    var sentenceLength = parseInt(localStorage.getItem("TMN_Sentence_Length")) || 0;
    var text = $("#ctl00_lblMsg").text();
    if (text.includes("seconds")) {
        var match = text.match(/(\d+)\s*more seconds/);
        if (match) {
            var seconds = parseInt(match[1], 10);
            if (seconds * 1000 > sentenceLength) {
                localStorage.setItem("TMN_Sentence_Length", Math.max(seconds * 1000, sentenceLength));
                console.log("sentenceLength updated: " + localStorage.getItem("TMN_Sentence_Length"));
            }
        }
    }

    var nextCrimeTime = parseInt(localStorage.getItem("TMN_Crime_Time"), 10);
    var nextGTATime = parseInt(localStorage.getItem("TMN_GTA_Time"), 10);
    var nextBoozeTime = parseInt(localStorage.getItem("TMN_Booze_Time"), 10);

    //if (!nextCrimeTime || !nextGTATime || (Date.now() + sentenceLength < nextCrimeTime - sentenceLength && Date.now() + sentenceLength < nextGTATime - sentenceLength && Date.now() + sentenceLength < nextBoozeTime - sentenceLength)) {
    if (Date.now() > nextCrimeTime || Date.now() > nextGTATime || Date.now() > nextBoozeTime) {
        var sentenceFinish = Date.now() + sentenceLength;
        console.log("Pausing script, " + new Date(sentenceFinish).toLocaleTimeString() + " too close to stored cooldown time: " + new Date(Math.min(Math.min(nextCrimeTime, nextGTATime), nextBoozeTime)).toLocaleTimeString());
        const checkTimers = setInterval(() => {
            nextCrimeTime = parseInt(localStorage.getItem("TMN_Crime_Time"), 10);
            nextGTATime = parseInt(localStorage.getItem("TMN_GTA_Time"), 10);
            nextBoozeTime = parseInt(localStorage.getItem("TMN_Booze_Time"), 10);
            if (Date.now() < nextCrimeTime && Date.now() < nextGTATime && Date.now() < nextBoozeTime) {
                clearInterval(checkTimers);
                setTimeout(() => { location.href = location.href }, Math.random() * 5000);
            }
        }, 500);
    } else {
        randomBreakClick();
    }
})();