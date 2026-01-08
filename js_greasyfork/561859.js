// ==UserScript==
// @name         Crunchyroll Deutschland: Überspringe Fillerepisoden für Detektiv Conan
// @name:en      Crunchyroll Germany: Skip Filler Episodes for Detective Conan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Überspringt automatisch fillerepisoden für Detektiv Conan.
// @description:en Automatically skips filler episodes for Detective Conan
// @author       bee1850
// @match        https://www.crunchyroll.com/de/watch/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561859/Crunchyroll%20Deutschland%3A%20%C3%9Cberspringe%20Fillerepisoden%20f%C3%BCr%20Detektiv%20Conan.user.js
// @updateURL https://update.greasyfork.org/scripts/561859/Crunchyroll%20Deutschland%3A%20%C3%9Cberspringe%20Fillerepisoden%20f%C3%BCr%20Detektiv%20Conan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fillerEpisodes = [
        6, 15, 18, 20, 22, 25, 26, 27, 30, 31,
        34, 37, 38, 42, 45, 46, 48, 52, 55, 57,
        58, 61, 63, 64, 66, 67,68,69, 73, 75, 76,
        82, 83, 86, 89, 90, 91, 92, 93, 95, 96, 97,
        98, 103, 112, 113, 114, 115, 116, 117, 119,
        126, 127, 130, 131, 132, 133, 134, 145, 150,
        153, 158, 159, 160, 161, 162, 165, 168, 169,
        170, 171, 176, 180, 189, 193, 194, 195, 196,
        197, 198, 199, 200, 201, 202, 211, 212, 213,
        216, 217, 218, 219, 222, 223, 224, 225, 226,
        227, 230, 231, 232, 244, 251, 254, 255, 256,
        264, 267, 270, 271, 274, 275, 276, 279, 280,
        281, 286, 287, 295, 298, 303, 304, 305, 316,
        317, 318, 319, 320, 321, 322, 331, 339, 340,
        340, 343, 344, 345, 346, 347, 353, 362, 367,
        368, 378, 379, 382, 383, 388, 391, 394, 395,
        396, 399, 400, 401, 404, 407, 408, 409, 410,
        411, 418, 422, 423, 426, 427, 431, 437, 438,
        439, 443, 444, 447, 448, 452, 453, 454, 457,
        458, 464, 471, 472, 475, 477, 478, 479, 480,
        486, 489, 490, 491, 492, 496, 499, 501, 508,
        511, 515, 523, 529
    ];
    let lastCheckedUrl = "";

    function checkAndSkip() {
        if (!window.location.href.includes("/watch/")) return;

        const titleEl = document.querySelector(".title");
        const showTitleLinkEl = document.querySelector(".show-title-link");

        if (!titleEl || !showTitleLinkEl) return;

        const showTitle = showTitleLinkEl.textContent.trim();

        if (showTitle !== "Detektiv Conan" && showTitle !== "Detective Conan") return;

        const textContent = titleEl.textContent;
        const episodeMatch = textContent.match(/E(\d+)/) || textContent.match(/(\d+)/);

        if (!episodeMatch) return;

        const episodeNum = parseInt(episodeMatch[1], 10);
        console.log(`[Skipper] Current Episode: ${episodeNum}`);

        if (fillerEpisodes.includes(episodeNum)) {
            console.log(`[Skipper] Episode ${episodeNum} is FILLER. Attempting to skip...`);

            const navContainer = document.querySelector(".erc-prev-next-episode");
            if (navContainer) {
                const links = navContainer.querySelectorAll("a");

                let nextButton = null;

                if (links.length === 2) {
                    nextButton = links[1];
                } else if (links.length === 1) {
                    nextButton = links[0];
                } else if (links.length === 4) {
                    nextButton = links[2];
                }

                if (nextButton) {
                    nextButton.style.border = "3px solid red";
                    nextButton.click();
                    console.log("[Skipper] Clicked Next!");
                }
            }
        }
    }

    setInterval(checkAndSkip, 2000);

})();