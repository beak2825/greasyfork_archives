// ==UserScript==
// @name         Schedules: Link people to profiles
// @namespace    https://github.com/nate-kean/
// @version      2025-10-06
// @description  Make people's names on schedules links that you can click in order to see their profiles.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/schedules/schedule/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552088/Schedules%3A%20Link%20people%20to%20profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/552088/Schedules%3A%20Link%20people%20to%20profiles.meta.js
// ==/UserScript==

(function() {
    // Supplement some of F1's CSS that was only meant a for span's with an equivalent for a's too
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-">
            .scheduler-position-person-name-search a {
                display: inline-block;
                position: relative;
                top: 0px;
                margin-left: 10px;
                font-size: 14px;
                font-weight: 300;
                letter-spacing: 0.6px;
            }

            .scheduler-position-person-name-search[data-statusid="3"] a,
            .scheduler-position-person-name-search[data-statusid="2"] a,
            .scheduler-position-person-name-search[data-statusid="4"] a {
                top: -7px;
            }
        </style>
    `);

    for (const entry of document.querySelectorAll("div.scheduler-position-person-name-search")) {
        const span = entry.querySelector("div > span");
        const name = span.textContent;
        const img = entry.querySelector("img");
        if (!img) {
            console.warn(`${name} doesn't have a profile picture! Can't link them to a profile.`);
            continue;
        }
        const uid = img.src.split("/").at(-1).split("_")[0];
        const url = `https://jamesriver.fellowshiponego.com/members/view/${uid}`;
        const a = document.createElement("a");
        a.href = url;
        a.textContent = name;
        span.replaceWith(a);
    }
})();
