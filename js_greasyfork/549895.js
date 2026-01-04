// ==UserScript==
// @name         Frosty's C1S5 Reset Script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  F4 to toggle gamemode-NMPZ, No Move, Move. F3 to Reset selected gamemode. V1.2 Added Resets Counter per Gamemode.
// @author       ItsFrosty
// @match        https://lostgamer.io/*
// @icon         https://lostgamer.io/icons/Guessr.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549895/Frosty%27s%20C1S5%20Reset%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/549895/Frosty%27s%20C1S5%20Reset%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Options array
    const options = [
        { name: "No Move", link: "/guessr/chapter-1-season-5?controls=no+move" },
        { name: "NMPZ", link: "/guessr/chapter-1-season-5?controls=nmpz" },
        { name: "Move", link: "/guessr/chapter-1-season-5" }
    ];

    // Load last selected index from localStorage
    let currentIndex = parseInt(localStorage.getItem("lostgamer_selectedIndex")) || 0;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10%';
    overlay.style.right = '20px';
    overlay.style.padding = '10px 15px';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.color = 'white';
    overlay.style.fontSize = '16px';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.borderRadius = '5px';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transform = 'translateY(-50%)';
    document.body.appendChild(overlay);

    // Function to get attempts for current mode
    function getAttempts(modeName) {
        return parseInt(localStorage.getItem("lostgamer_attempts_" + modeName)) || 0;
    }

    // Function to increment attempts for current mode
    function incrementAttempts(modeName) {
        let attempts = getAttempts(modeName) + 1;
        localStorage.setItem("lostgamer_attempts_" + modeName, attempts);
        return attempts;
    }

    // Update overlay
    function updateOverlay() {
        const modeName = options[currentIndex].name;
        const attempts = getAttempts(modeName);
        overlay.innerHTML = `
            <div>Selected: ${modeName}</div>
            <div>Attempts: ${attempts}</div>
        `;
    }

    updateOverlay(); // initial overlay

    // Key listener for F3/F4
    document.addEventListener('keydown', (e) => {
        if (e.code === "F4") {
            currentIndex = (currentIndex + 1) % options.length;
            localStorage.setItem("lostgamer_selectedIndex", currentIndex);
            updateOverlay();
        }
        if (e.code === "F3") {
            const modeName = options[currentIndex].name;
            incrementAttempts(modeName);
            updateOverlay();
            const url = "https://lostgamer.io" + options[currentIndex].link;
            window.location.href = url;
        }
    });

    // Auto-click Start Game button after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const startButton = document.querySelector(".start-button");
            if (startButton) {
                startButton.click();
                console.log("[Tampermonkey] Clicked Start Game button");
            } else {
                console.log("[Tampermonkey] Start Game button not found");
            }
        }, 1000);
    });

})();