// ==UserScript==
// @name         Fortunate Son Button Player (works on every website)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Make fortunate son play infinitly when click (theres a stop button)
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548690/Fortunate%20Son%20Button%20Player%20%28works%20on%20every%20website%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548690/Fortunate%20Son%20Button%20Player%20%28works%20on%20every%20website%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // First audio/button (Fortunate Son)
    if (!window.fortunateAudio) {
        let audio1 = document.createElement('audio');
        audio1.src = "https://raw.githubusercontent.com/p00p4nts/p00p/main/sound2.mp3";
        audio1.loop = true;
        document.body.appendChild(audio1);
        window.fortunateAudio = audio1;

        let button1 = document.createElement('button');
        button1.id = "fortunateSonButton";
        button1.innerText = "Fortunate Son";
        Object.assign(button1.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 2147483647,
            padding: "12px 20px",
            backgroundColor: "#ff4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)"
        });
        document.body.appendChild(button1);

        button1.addEventListener('click', () => {
            if (audio1.paused) {
                audio1.play().catch(() => console.log("Click detected. Starting music..."));
                button1.innerText = "stop";
            } else {
                audio1.pause();
                button1.innerText = "CCR Fortunate Son ";
            }
        });
    }

    // Second smaller audio/button
    if (!window.fortunateAudio2) {
        let audio2 = document.createElement('audio');
        audio2.src = "https://raw.githubusercontent.com/p00p4nts/p00p/main/sound3.mp3";
        audio2.loop = true;
        document.body.appendChild(audio2);
        window.fortunateAudio2 = audio2;

        let button2 = document.createElement('button');
        button2.id = "fortunateSonButton2";
        button2.innerText = "rain";  // changed label
        Object.assign(button2.style, {
            position: "fixed",
            bottom: "70px", // above the first button
            right: "20px",
            zIndex: 2147483647,
            padding: "6px 12px",
            backgroundColor: "#44ff44",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
        });
        document.body.appendChild(button2);

        button2.addEventListener('click', () => {
            if (audio2.paused) {
                audio2.play().catch(() => console.log("Click detected. Starting second music..."));
                button2.innerText = "Stop";
            } else {
                audio2.pause();
                button2.innerText = "rain";
            }
        });
    }

    // Keep both buttons on top
    const observer = new MutationObserver(() => {
        const btn1 = document.getElementById("fortunateSonButton");
        if (btn1 && btn1.style.zIndex != "2147483647") btn1.style.zIndex = "2147483647";

        const btn2 = document.getElementById("fortunateSonButton2");
        if (btn2 && btn2.style.zIndex != "2147483647") btn2.style.zIndex = "2147483647";
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();