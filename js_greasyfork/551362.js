// ==UserScript==
// @name         world-geography-games.com | Flag quiz auto anwser
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Auto-complete flag game with TM menu toggle button + 1ms + custom interval option
// @author       OmniSec
// @match        https://world-geography-games.com/en/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551362/world-geography-gamescom%20%7C%20Flag%20quiz%20auto%20anwser.user.js
// @updateURL https://update.greasyfork.org/scripts/551362/world-geography-gamescom%20%7C%20Flag%20quiz%20auto%20anwser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Core Auto-Play ---
    window.autoPlayFlagQuiz = function() {
        if (typeof buttons !== "undefined" && typeof correct_answer !== "undefined") {
            buttons.forEach(function(btn){
                if (btn.name === correct_answer && can_tap === true) {
                    tap_country(btn);
                }
            });
            if (button_next && button_next.inputEnabled) {
                next_flag();
            }
        }
    }

    // --- Interval Control ---
    window.autoPlayIntervalTime = 500; // default interval
    window.autoPlayIntervalID = setInterval(window.autoPlayFlagQuiz, window.autoPlayIntervalTime);
    window.isAutoPlaying = true; // Track state

    window.startAutoPlay = function() {
        clearInterval(window.autoPlayIntervalID);
        window.autoPlayIntervalID = setInterval(window.autoPlayFlagQuiz, window.autoPlayIntervalTime);
        window.isAutoPlaying = true;
        updateToggleMenu();
        console.log("Auto-play started with interval " + window.autoPlayIntervalTime + "ms");
    }

    window.stopAutoPlay = function() {
        clearInterval(window.autoPlayIntervalID);
        window.isAutoPlaying = false;
        updateToggleMenu();
        console.log("Auto-play stopped");
    }

    window.toggleAutoPlay = function() {
        if (window.isAutoPlaying) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }

    // --- Menu Commands ---
    // ✅ Keep only 1ms option
    GM_registerMenuCommand("Set Interval 1ms", function() {
        window.autoPlayIntervalTime = 1;
        if (window.isAutoPlaying) startAutoPlay();
        console.log("Interval set to 1ms");
    });

    // ✅ Custom interval option
    GM_registerMenuCommand("Set Custom Interval", function() {
        let input = prompt("Enter custom interval in ms:", window.autoPlayIntervalTime);
        if (input !== null) {
            let val = parseInt(input, 10);
            if (!isNaN(val) && val > 0) {
                window.autoPlayIntervalTime = val;
                if (window.isAutoPlaying) startAutoPlay();
                console.log("Custom interval set to " + val + "ms");
            } else {
                console.log("Invalid interval entered.");
            }
        }
    });

    // Placeholder for the toggle command
    let toggleCommandID;
    function updateToggleMenu() {
        if (toggleCommandID) GM_unregisterMenuCommand(toggleCommandID);
        toggleCommandID = GM_registerMenuCommand(
            window.isAutoPlaying ? "Pause Auto-Play" : "Play Auto-Play",
            toggleAutoPlay
        );
    }

    // Initialize toggle menu
    updateToggleMenu();

})();
