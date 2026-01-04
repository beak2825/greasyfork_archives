// ==UserScript==
// @name         TMN Spawn Camp Bullets
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  TMN Spawn Camp Bullets Script
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/authenticated/*ravel.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550749/TMN%20Spawn%20Camp%20Bullets.user.js
// @updateURL https://update.greasyfork.org/scripts/550749/TMN%20Spawn%20Camp%20Bullets.meta.js
// ==/UserScript==

(function() {
    function CheckShoutBox() {
        const lblMsg = $("#ctl00_lblMsg").text();
        if (lblMsg.includes("jail")) {
            location.href = location.href;
        } else {
            fetch("https://www.tmn2010.net/authenticated/forum.aspx", {
                method: "GET"
            })
                .then(res => res.text())
                .then(body => {
                console.log("Checking...");
                const doc = $("<div>").html($(body));
                const shouts = doc.find("#ctl00_main_pnlShoutBoxContent").children().toArray().reverse(); // reverse to start from the end

                const now = new Date();
                const cetOffset = 0 * 60; // CEST is UTC+2
                const cetNow = new Date(now.getTime() + (cetOffset - now.getTimezoneOffset()) * 60000);

                const regex = /^\d{2}:\d{2}:\d{2}\s+System:\s+.*BF just produced .*bullets!/;

                for (const shout of shouts) {
                    const text = $(shout).text().replace(/\u00A0/g, ' ').trim().replace(/\s+/g, ' ');
                    const timeMatch = text.match(/(\d{2}:\d{2}:\d{2})/);
                    if (!timeMatch) continue;

                    const [hours, minutes, seconds] = timeMatch[0].split(":").map(Number);
                    const shoutDate = new Date(cetNow);
                    shoutDate.setHours(hours, minutes, seconds, 0);

                    const diffMs = Math.abs(cetNow - shoutDate);
                    const isWithinOneMinute = diffMs <= 60000 * 1;

                    if (!isWithinOneMinute) break;

                    if (regex.test(text)) {
                        const utterance = new SpeechSynthesisUtterance("Alert");
                        window.speechSynthesis.speak(utterance);
                        const destCity = text.split("System: ")[1].split(" -")[0];
                        const currentCity = $("#ctl00_userInfo_lblcity").text().trim();
                        if (destCity == currentCity) {
                            location.href = "/authenticated/store.aspx?p=b";
                        } else {
                            const destCityInput = $(`label:contains(${destCity})`).prev("input");
                            if (confirm(`Travel to ${destCity}?`)) {
                                destCityInput.click();
                            }
                            clearInterval(checkInterval);
                            break;
                        }

                    }
                }
            });
        }
    }

    //$("#ctl00_main_lblWelcome")
    const regex = /Welcome to .+ - .+!/;
    const hasFlown = regex.test($("div:contains('Welcome to')").last().text());
    if (hasFlown && document.referrer.includes("Travel")) {
        location.href = "/authenticated/store.aspx?p=b";
    } else if (location.href.includes("Travel")) {
        CheckShoutBox();
        const checkInterval = setInterval( CheckShoutBox, 10000);
    }
})();