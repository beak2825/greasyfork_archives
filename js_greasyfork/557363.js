// ==UserScript==
// @name         Torn Poker – Attack Button Above Players
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds an attack button above poker player names linking to Torn attack page.
// @author       X
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @license Any
// @downloadURL https://update.greasyfork.org/scripts/557363/Torn%20Poker%20%E2%80%93%20Attack%20Button%20Above%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/557363/Torn%20Poker%20%E2%80%93%20Attack%20Button%20Above%20Players.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const observed = new Set();

    function addAttackButton(playerBox) {
        if (observed.has(playerBox)) return;
        observed.add(playerBox);

        const idMatch = playerBox.id.match(/^player-(\d+)/);
        if (!idMatch) return;

        const playerID = idMatch[1];

        // Create the attack button
        const btn = document.createElement("a");
        btn.textContent = "Attack";
        btn.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${playerID}`;
        btn.target = "_blank";

        // Style the button to bottom-right
        Object.assign(btn.style, {
            position: "absolute",
            bottom: "2px",
            right: "2px",
            padding: "2px 5px",
            background: "red",
            color: "white",
            borderRadius: "4px",
            fontSize: "11px",
            zIndex: 9999,
            textDecoration: "none",
            cursor: "pointer"
        });

        // Make sure the parent can handle absolute children
        const currentPosition = window.getComputedStyle(playerBox).position;
        if (currentPosition === "static" || !currentPosition) {
            playerBox.style.position = "relative";
        }

        playerBox.appendChild(btn);
    }

    function scanPlayers() {
        const players = document.querySelectorAll("[id^='player-']");
        players.forEach(addAttackButton);
    }

    // React updates — observe DOM changes
    const observer = new MutationObserver(scanPlayers);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    scanPlayers();

})();
