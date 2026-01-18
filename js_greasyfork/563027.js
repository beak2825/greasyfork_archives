// ==UserScript==
// @name         UNIT3D Reward
// @namespace    http://tampermonkey.net/
// @version      2025-08-18
// @description  Claim UNIT3D event rewards automaticaly
// @author       Z
// @license      GPL-3.0 License
// @match        https://bitporn.eu/events/*
// @match        https://lat-team.com/events/*
// @match        https://seedpool.org/events/*
// @match        https://onlyencodes.cc/events/*
// @match        https://upload.cx/events/*
// @match        https://aither.cc/events/*
// @match        https://oldtoons.world/events/*
// @match        https://fearnopeer.com/events/*
// @match        https://lst.gg/events/*
// @icon         https://avatars.githubusercontent.com/u/34430773?s=48&v=4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563027/UNIT3D%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/563027/UNIT3D%20Reward.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function claim() {
        const elem = document.querySelector('FORM > P > BUTTON');
        if (elem) {
            elem.click();
        }
        let today = document.querySelectorAll('MAIN > ARTICLE > DIV > SECTION > DIV > OL > LI > ARTICLE > UL > LI > I');
        if (today.length > 0) {
            today = today[today.length - 1];
            const info = document.querySelector('MAIN > ARTICLE > ASIDE > SECTION > DIV');
            if (info) {
                info.innerText = today.parentElement.parentElement.parentElement.innerText.replaceAll('\n', ' - ');
            }
        }

        // BitPorn uses one event page for each month
        // OnlyEncodes+ uses one event page for each Christmas week
        const rewardLinks = Array.from(document.querySelectorAll('.top-nav__dropdown A')).filter((a) => {
            return a.innerText.indexOf('Daily Reward') >= 0 ||
                a.innerText.indexOf('Christmas') >= 0;
        }).sort((a, b) => {
            const m1 = a.href.match(/\/(\d+)$/);
            const m2 = b.href.match(/\/(\d+)$/);
            if (m1 && m2) return parseInt(m1[1]) - parseInt(m2[1]);
            return a.href.length - b.href.length;
        });
        const len = rewardLinks.length;
        if (len > 0 && rewardLinks[len - 1].href != window.location.href) {
            window.location.href = rewardLinks[len - 1].href;
        }
    }

    setTimeout(claim, 1000);
})();