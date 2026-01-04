// ==UserScript==
// @name         ALEXCODER RAINBOW VIRUS OVERLOAD
// @namespace    tampermonkey.net
// @version      2025.MAX
// @description  The absolute most insane rainbow destruction possible.
// @author       You
// @match        https://sites.google.com/view/alexcoder11/home
// @icon.        file:///Users/mac1/Downloads/flower.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559737/ALEXCODER%20RAINBOW%20VIRUS%20OVERLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/559737/ALEXCODER%20RAINBOW%20VIRUS%20OVERLOAD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        /* 1. TOTAL WORLD DESTRUCTION - Everything spins, shakes, and flashes */
        @keyframes virusChaos {
            0% { filter: hue-rotate(0deg) invert(0) contrast(1); transform: scale(1) rotate(0deg); }
            20% { filter: hue-rotate(72deg) invert(1) contrast(5); transform: scale(1.1) rotate(2deg) skew(5deg); }
            40% { filter: hue-rotate(144deg) invert(0) contrast(10); transform: scale(0.9) rotate(-2deg) skew(-10deg); }
            60% { filter: hue-rotate(216deg) invert(1) contrast(2); transform: scale(1.2) rotate(5deg) skew(15deg); }
            80% { filter: hue-rotate(288deg) invert(0) contrast(8); transform: scale(0.8) rotate(-5deg) skew(-5deg); }
            100% { filter: hue-rotate(360deg) invert(1) contrast(1); transform: scale(1) rotate(0deg); }
        }

        /* 2. GLITCHING TEXT */
        @keyframes glitchText {
            0% { text-shadow: 5px 5px red, -5px -5px blue; }
            50% { text-shadow: -5px 5px lime, 5px -5px magenta; color: yellow; }
            100% { text-shadow: 5px -5px cyan, -5px 5px orange; }
        }

        body {
            background: black !important;
            animation: virusChaos 0.05s infinite linear !important; /* ULTRA FAST */
            overflow: hidden !important;
        }

        /* Force every single element to vibrate and change colors independently */
        * {
            animation: virusChaos 0.2s infinite alternate !important;
            background-color: transparent !important;
            border: 2px solid lime !important;
        }

        h1, h2, p, a, span {
            animation: glitchText 0.1s infinite !important;
            font-size: 150% !important;
            font-family: 'Comic Sans MS', cursive !important;
        }

        img {
            animation: spin 0.1s infinite linear !important;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);

    // 3. SPAWN RAINBOW CLONES
    setInterval(() => {
        let clone = document.createElement('div');
        clone.innerText = "ALEXCODER VIRUS LOADED";
        clone.style = `position:fixed; top:${Math.random()*100}%; left:${Math.random()*100}%;
                       color:hsl(${Math.random()*360}, 100%, 50%); font-size:40px;
                       font-weight:bold; z-index:9999; pointer-events:none;
                       text-shadow: 0 0 20px white; transform: rotate(${Math.random()*360}deg);`;
        document.body.appendChild(clone);

        // Remove old clones to prevent browser from crashing immediately
        if (document.body.children.length > 100) {
            document.body.children[10].remove();
        }
    }, 50);

    // 4. RANDOM INVERT STROBE
    setInterval(() => {
        document.documentElement.style.filter = Math.random() > 0.5 ? 'invert(1)' : 'invert(0)';
    }, 30);

    console.log("%cSYSTEM FAILURE: RAINBOW MODE OVERLOAD", "color: red; font-size: 30px; font-weight: bold;");
})();
