// ==UserScript==
// @name         TMN Scripts
// @namespace    http://tampermonkey.net/
// @version      1.4.9
// @description  TMN Script Page Setup
// @author       Pap
// @license      MIT
// @match        https://www.tmn2010.net/*uthenticated/*efault.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmn2010.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550317/TMN%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/550317/TMN%20Scripts.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    const $ = window.jQuery;

    function GetOrientation() {
        const consoleContent = $("#console")[0] && $("#console > span").html() || "";
        if (window.matchMedia("(orientation: landscape)").matches) {
            $("#divContent").css({
                "display": "grid",
                "grid-template-columns": "1fr 1fr",
                "grid-template-rows": "30px 1fr 1fr",
                "grid-template-areas": `
    "a a"
    "b c"
    "d e"
  `});
            $("#divContent").html(`
<div id="console" style="text-align: left; align-content: center; grid-area: a; width: 100%; height: 100%;">
<span></span>
  <input type="checkbox" id="autoOcToggle">
</div>
    <iframe src="https://www.tmn2010.net/authenticated/jail.aspx" style="grid-area: b; width: 100%; height: 100%; box-sizing: border-box;"></iframe>
    <iframe src="https://www.tmn2010.net/authenticated/crimes.aspx" style="grid-area: c; width: 100%; height: 100%; box-sizing: border-box;"></iframe>
    <iframe src="https://www.tmn2010.net/authenticated/crimes.aspx?p=b" style="grid-area: d; width: 100%; height: 100%; box-sizing: border-box;"></iframe>
    <iframe src="https://www.tmn2010.net/authenticated/crimes.aspx?p=g" style="grid-area: e; width: 100%; height: 100%; box-sizing: border-box;"></iframe>`
                                 );
        } else {
            $("#divContent").css({
                "display": "grid",
                "grid-template-columns": "1fr",
                "grid-template-rows": "30px 1fr)",
                "grid-template-rows": "30px 1fr 1fr 1fr 1fr",
                "grid-template-areas": `
    "a"
    "b"
    "c"
    "d"
    "e"
  `});
            $("#divContent").html(`
<div id="console" style="text-align: left; align-content: center; grid-area: a; width: 100%; height: 100%;">
<span></span>
  <input type="checkbox" id="autoOcToggle">
</div>
    <iframe src="https://www.tmn2010.net/authenticated/jail.aspx" style="grid-area: b; width: 100%; height: 100%; box-sizing: border-box;"></iframe>
    <iframe src="https://www.tmn2010.net/authenticated/crimes.aspx" style="grid-area: c; width: 100%; height: 100%; box-sizing: border-box;"></iframe>
    <iframe src="https://www.tmn2010.net/authenticated/crimes.aspx?p=b" style="grid-area: d; width: 100%; height: 100%; box-sizing: border-box;"></iframe>
    <iframe src="https://www.tmn2010.net/authenticated/crimes.aspx?p=g" style="grid-area: e; width: 100%; height: 100%; box-sizing: border-box;"></iframe>`
                                 );
        }
        $("#console > span").html(consoleContent);
        $("#autoOcToggle").css({ "float": "right" });
    }

    function Log(message) {
        console.log(message);
        $("#console > span").html(message);
    }

    function GetAvailableTime(message) {
        const regex = /(\d+)\s*hours?.*?(\d+)\s*minutes?.*?(\d+)\s*seconds?/i;

        const match = message.match(regex);

        if (message === "Available") {
            return 1;
        } else if (message.includes("Doing one")) {
            return Infinity;
        } else if (!match) {
            throw new Error("Time format not found in the message.");
        }

        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);

        const now = new Date();
        const availableTime = now.getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000;

        return availableTime;
    }

    async function GetSydneyBulletsAvailability() {
        const res = await fetch("https://www.tmn2010.net/authenticated/forum.aspx");
        const body = await res.text();
        const doc = $("<div>").html($(body));
        const shouts = doc.find("#ctl00_main_pnlShoutBoxContent").children().toArray().reverse(); // reverse to start from the end

        const now = new Date();
        const cetOffset = 1 * 60; // CEST is UTC+2
        const cetNow = new Date(now.getTime() + (cetOffset + now.getTimezoneOffset()) * 60000);

        const regex = /^\d{2}:\d{2}:\d{2}\s+System:\s+.*BF just produced .*bullets!/;

        for (const shout of shouts) {
            const text = $(shout).text().replace(/\u00A0/g, ' ').trim().replace(/\s+/g, ' ');
            const timeMatch = text.match(/(\d{2}:\d{2}:\d{2})/);
            if (!timeMatch) continue;

            const [hours, minutes, seconds] = timeMatch[0].split(":").map(Number);
            const shoutDate = new Date(cetNow);
            shoutDate.setHours(hours + 11, minutes, seconds, 0);

            if (regex.test(text)) {
                const destCity = text.split("System: ")[1].split(" -")[0];
                if (destCity == "Sydney") {
                    return new Date(shoutDate.getTime() + 2 * 60 * 60 * 1000);
                }
            }
        }
    }

    async function WaitForFlightAvailability() {
        let flightAvailability = localStorage.getItem("TMN_FLIGHT_TIME");
        if (flightAvailability && flightAvailability * 1 > Date.now()) {
            return flightAvailability * 1;
        }

        return new Promise((resolve) => {
            const timer = setInterval(async () => {
                const res = await fetch("travel.aspx");
                const body = await res.text();
                const doc = $("<div>").html($(body));
                const flightLblMsg = doc.find("#ctl00_lblMsg").text();

                if (!flightLblMsg.includes("jail")) {
                    flightAvailability = flightLblMsg == "" ? 0 : GetAvailableTime(flightLblMsg);
                    localStorage.setItem("TMN_FLIGHT_TIME", flightAvailability);
                    clearInterval(timer);
                    resolve(flightAvailability);
                }
            }, 1000);
        });
    }

    async function AutoTravel() {
        const playerHref = playerEl.attr("href");
        const destination = location.href.split("d=")[1];
        const currentCity = $("#ctl00_userInfo_lblcity").text().trim();
        const canFly = Date.now() > flightAvailability;
        let res = await fetch("travel.aspx");
        let body = await res.text();
        let doc = $("<div>").html($(body));

        res = await fetch(playerHref);
        body = await res.text();
        doc = $("<div>").html($(body));
        const quote = doc.find("#ctl00_main_lblQuote").text();

        let ocAvailability = quote != "Quote" && (quote.split("OC: ")[1] != undefined ? GetAvailableTime(quote.split("OC: ")[1].split("DTM:")[0]) : false) || false;
        let dtmAvailability = quote != "Quote" && (quote.split("DTM: ")[1] != undefined ? GetAvailableTime(quote.split("DTM: ")[1]) : false) || false;
        if (!ocAvailability || !dtmAvailability) {
            //alert("Profile statuses not set.");
            return;
        }
        const sydneyBulletsAvailability = await GetSydneyBulletsAvailability();
        const flightCD = 45 * 60000;
        const now = Date.now();
        //console.log(now + flightCD, new Date(sydneyBulletsAvailability));
        /*if (now > ocAvailability && (currentCity != "London")) {
            if (currentCity == "Sydney" && now + 30 * 60000 > sydneyBulletsAvailability) {
                setTimeout(() => { location.href = "store.aspx?p=b" }, sydneyBulletsAvailability - now - 60000);
                Log(`Buy bullets in ${(sydneyBulletsAvailability - now - 60000)/1000}s.`);
            } else if (canFly) {
                Log("<a href='travel.aspx?d=London'>Should fly to London</a>");
            }
        } else if ((now > ocAvailability || now + flightCD > ocAvailability) && (currentCity == "London")) {
            //do OC
            Log("Should be doing an OC.");
        } else if (now < sydneyBulletsAvailability && now + flightCD > sydneyBulletsAvailability && currentCity != "Sydney" && canFly) {
            Log("<a href='travel.aspx?d=Sydney'>Should fly to Sydney</a>");
        } else if (now < sydneyBulletsAvailability && now + flightCD > sydneyBulletsAvailability && currentCity == "Sydney") {
            //wait and buy bullets
            setTimeout(() => { location.href = "store.aspx?p=b" }, sydneyBulletsAvailability - now - 60000);
            Log(`Buy bullets in ${(sydneyBulletsAvailability - now - 60000)/1000}s.`);
        } else if (now + flightCD + flightCD < sydneyBulletsAvailability && now > dtmAvailability && canFly) {
            //do dtm
            Log("Should be doing a DTM.");
        } else if (dtmAvailability > now && now + flightCD + flightCD + (dtmAvailability - now) < sydneyBulletsAvailability && now + flightCD > dtmAvailability) {
            //wait and do dtm
            Log("Do a DTM soon.");
        } else if (now + flightCD + flightCD < sydneyBulletsAvailability && currentCity != "London" && canFly) {
            Log("<a href='travel.aspx?d=London'>Should fly to London</a>");
        } else if (now + flightCD + flightCD < sydneyBulletsAvailability && currentCity == "London" && canFly) {
            //fly anywhere but Sydney
            Log("Fly anywhere but Sydney.");
        }*/
        const nextGTATime = parseInt(localStorage.getItem("TMN_GTA_Time"), 10);
        if (canFly && currentCity != "London" && Date.now() < nextGTATime) {
            location.href = "travel.aspx?d=London";
        }
    }

    const HA_URL = 'https://67wol.duckdns.org:8443';
    const TOKEN = localStorage.getItem("TMN_TOKEN") || prompt("Enter Token");
    localStorage.setItem("TMN_TOKEN", TOKEN);

    window.matchMedia("(orientation: landscape)").addEventListener("change", GetOrientation);
    GetOrientation();

    let res = await fetch("https://www.tmn2010.net/authenticated/players.aspx");
    let body = await res.text();
    let doc = $("<div>").html($(body));
    const playerEl = doc.find('a[style="color: #AA0000; font-weight: bold; "]');
    const TMN_PLAYER = playerEl.text().trim();
    localStorage.setItem("TMN_PLAYER", TMN_PLAYER);

    res = await fetch("https://www.tmn2010.net/authenticated/personal.aspx");
    body = await res.text();
    doc = $("<div>").html($(body));
    const TMN_PIC = doc.find("#ctl00_main_lstFriends").children().last().text();
    localStorage.setItem("TMN_PIC", TMN_PIC);

    const flightAvailability = await WaitForFlightAvailability();
    if (flightAvailability > 0) {
        Log(`Next Flight: ${new Date(flightAvailability).toLocaleTimeString('en-NZ', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`);
    }

    const phoneNotifTimer = setInterval(async () => {
        const currentCity = $("#ctl00_userInfo_lblcity").text().trim();
        const res = await fetch("https://www.tmn2010.net/authenticated/mailbox.aspx");
        const body = await res.text();
        const doc = $("<div>").html($(body));
        const messages = doc.find("#ctl00_main_gridMail").find(".unreadmail .nomobile").map((n, e) => {
            const msg = $(e).text().replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
            if (msg.includes(`${TMN_PLAYER} Organized Crime Invitation`) || msg.includes(`${TMN_PLAYER} DTM invitation`)) {
                const mailLink = $(e).find("a[href*='mailbox']").attr("href");
                fetch(mailLink).then(res => res.text())
                    .then(body => {
                    const doc = $("<div>").html(body);
                    const msg = doc.find(".GridHeader").next().text().replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim();
                    const ocLoc = msg.split(") in ")[1].split(" -")[0];
                    const acceptLink = doc.find(".GridHeader").next().find("a").eq(0).attr("href");
                    if (msg.toLowerCase().includes(TMN_PIC.toLowerCase())) {
                        if (ocLoc == currentCity) {
                            location.href = acceptLink;
                        }
                    }
                });
            }
            return msg;
        }).get();
        const lastNewMessage = localStorage.getItem("TMN_LAST_NEW_MSG") || "Apples";
        const unnotifiedNewMessages = [];

        for (const msg of messages) {
            if (msg === lastNewMessage) break;
            unnotifiedNewMessages.push(msg);
        }

        (async () => {
            for (const message of unnotifiedNewMessages.reverse()) {
                await fetch("https://67wol.duckdns.org:8443/api/webhook/checktmn", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: "Inbox Alert",
                        message: message
                    })
                });
                localStorage.setItem("TMN_LAST_NEW_MSG", message);
                await new Promise(resolve => setTimeout(resolve, 5000));;
            }
        })();

        $("#divStats").html(doc.find("#divStats").html());
    }, 10000);

    AutoTravel();
    const autoTravelTimer = setInterval(() => {
        AutoTravel();
    }, 60000);
})();