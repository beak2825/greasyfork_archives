// ==UserScript==
// @name         Torn People Tracker
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tracks new arrivals in a country ;)
// @author       Tsume [195620]
// @match        https://www.torn.com/index.php?page=people*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548128/Torn%20People%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/548128/Torn%20People%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "trackedUsers";
    const HIDE_DELAY = 60 * 1000; // 1 minute

    function getTracked() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    }

    function saveTracked(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function trackUsers() {
        let tracked = getTracked();
        const now = Date.now();

        // collect all visible IDs in the DOM
        const currentIDs = [];
        document.querySelectorAll(".users-list > li").forEach(li => {
            const profile = li.querySelector("a.user.name");
            if (!profile) return;

            const match = profile.href.match(/XID=(\d+)/);
            if (!match) return;
            const xid = match[1];
            currentIDs.push(xid);

            // make attack open in new tab
            const attackLink = li.querySelector("a.attack-act");
            if (attackLink) attackLink.setAttribute("target", "_blank");

            // if new user → add to storage
            if (!tracked[xid]) {
                tracked[xid] = { firstSeen: now };
                saveTracked(tracked);
            }

            // if in storage long enough → hide
            if (now - tracked[xid].firstSeen > HIDE_DELAY) {
                li.style.display = "none";
            } else {
                li.style.display = "";
            }
        });

        // remove users that are no longer in DOM
        Object.keys(tracked).forEach(xid => {
            if (!currentIDs.includes(xid)) {
                delete tracked[xid];
            }
        });
        saveTracked(tracked);
    }

    function addClearButton() {
        if (document.getElementById("clearTrackedBtn")) return;

        const btn = document.createElement("button");
        btn.id = "clearTrackedBtn";
        btn.innerText = "Clear Tracked Users";
        btn.style.position = "fixed";
        btn.style.top = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.padding = "8px 12px";
        btn.style.background = "#d9534f";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";

        btn.addEventListener("click", () => {
            localStorage.removeItem(STORAGE_KEY);
            alert("Tracked users cleared!");
            location.reload();
        });

        document.body.appendChild(btn);
    }

    // run every second
    setInterval(trackUsers, 1000);

    // add button on load
    window.addEventListener("load", addClearButton);
})();
