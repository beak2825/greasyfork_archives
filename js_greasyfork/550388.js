// ==UserScript==
// @name         MaruMori Days Studied
// @namespace    http://marumori.io/
// @version      1.1.0
// @license      WTFPL
// @description  Replace the MaruMori "Streak" widget with a "Days Studied" widget.
// @author       Eearslya Sleiarion
// @match        https://marumori.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550388/MaruMori%20Days%20Studied.user.js
// @updateURL https://update.greasyfork.org/scripts/550388/MaruMori%20Days%20Studied.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const update = (streak) => {
        if (streak === null) { return; }

        streak.style.alignSelf = "start";
        streak.querySelector(".subtitle").innerText = "DAYS STUDIED";
        streak.querySelector(".restore-streak-btn").remove();
        streak.querySelector(".title").innerText = "Loading...";
        streak.querySelector(".days-wrapper").remove();

        fetch("https://api.marumori.io/home", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => { streak.querySelector(".title").innerText = data.data.stats.streakDays.length + " Days" });
    };

    const updateCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1 && node.querySelector(".streak") !== null) {
                    update(node.querySelector(".streak"));
                }
            }
        }
    };

    const setupCallback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType == 1 && node.classList.contains("content")) {
                    const newObserver = new MutationObserver(updateCallback);
                    newObserver.observe(node, { childList: true });
                    update(node.querySelector(".streak"));
                }
            }
        }
    };

    const observer = new MutationObserver(setupCallback);
    observer.observe(document.getElementById("svelte"), { childList: true });
})();