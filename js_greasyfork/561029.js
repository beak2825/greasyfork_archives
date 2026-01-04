// ==UserScript==
// @name         Swift Client (idk)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Cleaned, fixed, and made compatible with Safari Userscripts + Tampermonkey
// @author       Swift, Blueify, NotNightmare
// @match        https://bloxd.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561029/Swift%20Client%20%28idk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561029/Swift%20Client%20%28idk%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for DOM to exist
    function waitFor(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        const obs = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                callback(el);
            }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    // -------------------------------
    // TITLE + BACKGROUND
    // -------------------------------
    waitFor('.Title.FullyFancyText', (maintext) => {
        document.title = "Swift Client";

        maintext.textContent = "Swift Client";
        maintext.style.fontFamily = "Reglisse-Fill, serif";
        maintext.style.textShadow = "none";
        maintext.style.webkitTextStroke = "none";

        const bg = document.querySelector(".Background");
        if (bg) bg.src = "https://i.imgur.com/Vg1T5ap.png";
    });

    // -------------------------------
    // GAME LIST ICONS + NAMES
    // -------------------------------
    waitFor('.AvailableGame', () => {
        const names = document.getElementsByClassName("AvailableGameText");
        const imgs = document.getElementsByClassName("AvailableGameImg");
        const items = document.getElementsByClassName("AvailableGame");

        const edits = [
            ["Survival", "https://i.imgur.com/G9bUnQO.png"],
            ["Peaceful", "https://i.imgur.com/xC9jltf.png"],
            ["Creative", "https://i.imgur.com/BQEsCog.png"],
            ["Bedwars Squads", "https://i.imgur.com/TaF7UmB.png"],
            ["Bedwars Duos", "https://i.imgur.com/QqM1WwQ.png"],
            ["Skywars", "https://i.imgur.com/1EvgKmL.png"],
            ["Oneblock", "https://i.imgur.com/aXstUVN.png"],
            ["Greenville", "https://i.imgur.com/YQsbnFc.png"],
            ["Lego Fortnite", "https://i.imgur.com/heFKXJ6.png"],
            ["Eviltower", "https://i.imgur.com/Gpm1cvW.png"],
            ["Doodlecube", "https://i.imgur.com/hjUAKVI.png"],
            ["BloxdHop", "https://i.imgur.com/MPRY80l.png"],
            ["Hide & Seek", "https://i.imgur.com/UXVWqA5.png"],
            ["", ""],
            ["Plots (superflat)", "https://i.imgur.com/mMwt42i.png"],
            ["", ""],
            ["Worlds", "https://i.imgur.com/TWCWlyP.png"]
        ];

        for (let i = 0; i < edits.length; i++) {
            if (!names[i] || !imgs[i]) continue;
            if (edits[i][0]) names[i].textContent = edits[i][0];
            names[i].style.textShadow = "none";
            if (edits[i][1]) imgs[i].src = edits[i][1];
        }

        for (let i = 0; i < items.length; i++) {
            items[i].style.border = "none";
            items[i].style.boxShadow = "0px 10px 20px rgba(0,0,0,0.3)";
        }
    });

    // -------------------------------
    // CROSSHAIR
    // -------------------------------
    waitFor('.CrossHair', (crosshair) => {
        crosshair.textContent = "⨀";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    });

    // -------------------------------
    // REMOVE ADS
    // -------------------------------
    const removeAds = () => {
        const adClasses = [
            '.partnersAndCredits',
            '.SmallTextLight',
            '.AdContainer'
        ];
        adClasses.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.remove();
        });
    };
    setInterval(removeAds, 500);

    // -------------------------------
    // FLOATING "SWIFT NETWORK" BADGE
    // -------------------------------
    waitFor('body', () => {
        const badge = document.createElement('div');
        badge.textContent = "Swift Network";
        badge.style.position = "fixed";
        badge.style.top = "85%";
        badge.style.left = "50%";
        badge.style.transform = "translateX(-50%)";
        badge.style.color = "#fff";
        badge.style.fontSize = "18px";
        badge.style.fontWeight = "bold";
        badge.style.padding = "10px 20px";
        badge.style.borderRadius = "25px";
        badge.style.background = "rgba(0,0,0,0.4)";
        badge.style.zIndex = "99999";
        badge.style.cursor = "pointer";
        badge.style.boxShadow =
            "rgba(0, 0, 0, 0.25) 0px 54px 55px," +
            "rgba(0, 0, 0, 0.12) 0px -12px 30px," +
            "rgba(0, 0, 0, 0.12) 0px 4px 6px," +
            "rgba(0, 0, 0, 0.17) 0px 12px 13px," +
            "rgba(0, 0, 0, 0.09) 0px -3px 5px";

        document.body.appendChild(badge);
    });

    // -------------------------------
    // HOTBAR STYLING (IN‑GAME)
    // -------------------------------
    setInterval(() => {
        const hotbars = document.querySelectorAll(".item");
        const selected = document.querySelectorAll(".SelectedItem");

        hotbars.forEach(h => {
            h.style.borderRadius = "8px";
            h.style.borderColor = "#303a5900";
            h.style.backgroundColor = "#D13D2E";
            h.style.boxShadow =
                "inset -2px -2px 10px rgb(133,0,0), inset 0.3px 0.3px 5px white";
        });

        selected.forEach(s => {
            s.style.backgroundColor = "#c9991c";
            s.style.boxShadow =
                "inset -2px -2px 10px rgb(210,183,45), inset 0.3px 0.3px 5px white";
            s.style.borderColor = "#b88c1a";
        });
    }, 50);

})();
