// ==UserScript==
// @name         Bestie Button
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a Bestie toggle button to Torn profile pages
// @author       2115907
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560221/Bestie%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/560221/Bestie%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const IMG_OFF = "https://i.ibb.co/7JGxJFmf/Bestie-off.png";
    const IMG_ON  = "https://i.ibb.co/wZVQp00M/Bestie-on.png";

    const urlParams = new URLSearchParams(window.location.search);
    const profileXID = urlParams.get("XID");
    if (!profileXID) return;

    const storageKey = `bestie_${profileXID}`;

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            }
        }, 250);
    }

    // Glow animation
    const style = document.createElement("style");
    style.textContent = `
        @keyframes bestieGlow {
            0%   { box-shadow: 0 0 0px rgba(255, 105, 180, 0.0); }
            50%  { box-shadow: 0 0 10px rgba(255, 105, 180, 0.9); }
            100% { box-shadow: 0 0 0px rgba(255, 105, 180, 0.0); }
        }

        .bestie-glow {
            border-radius: 6px;
            animation: bestieGlow 2s infinite;
        }
    `;
    document.head.appendChild(style);

    function createButton(container) {
        if (document.getElementById("bestie-button")) return;

        const img = document.createElement("img");
        img.id = "bestie-button";

        const isOn = localStorage.getItem(storageKey) === "true";

        img.src = isOn ? IMG_ON : IMG_OFF;
        img.style.height = "42px";
        img.style.cursor = "pointer";
        img.style.marginLeft = "6px";

        // Tooltip text
        img.title = isOn ? "This is your Bestie!" : "Mark as Bestie";

        if (isOn) img.classList.add("bestie-glow");

        img.onclick = () => {
            const enabled = img.src.includes("Bestie-on");

            img.src = enabled ? IMG_OFF : IMG_ON;
            localStorage.setItem(storageKey, (!enabled).toString());

            img.title = enabled
                ? "Mark as Bestie"
                : "This is your Bestie!";

            img.classList.toggle("bestie-glow", !enabled);
        };

        container.appendChild(img);
    }

    waitForElement(".profile-buttons .buttons-wrap", createButton);

})();


