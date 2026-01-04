// ==UserScript==
// @name         Golden Age Roblox Website Theme
// @namespace    https://sites.google.com/view/vizblox/
// @version      1
// @description  Dark mode + blocky gold UI + 2006–2013 nostalgia + Comic Sans
// @author       Vizblox
// @match        https://www.roblox.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559925/Golden%20Age%20Roblox%20Website%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/559925/Golden%20Age%20Roblox%20Website%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🌑 Dark mode for entire website
    GM_addStyle(`
        body, html {
            background-color: #1C1C1C !important;
            color: #FFD700 !important;
            font-family: "Comic Sans MS", cursive !important;
        }
    `);

    // 🟨 Gold buttons everywhere
    GM_addStyle(`
        button, .btn, .btn-primary, .rbx-btn {
            background-color: #FFD700 !important;
            color: black !important;
            border: 2px solid black !important;
            border-radius: 0 !important;
            font-family: "Comic Sans MS", cursive !important;
            text-transform: uppercase !important;
        }
    `);

    // 🟨 Blocky navigation bar / top menu
    GM_addStyle(`
        #roblox-top-navbar, .navbar, .nav-menu {
            background-color: #1C1C1C !important;
            border-bottom: 2px solid #FFD700 !important;
            border-radius: 0 !important;
        }
    `);

    // 🟩 Inputs / search / chat boxes blocky gold
    GM_addStyle(`
        input, textarea {
            background-color: #2A2A2A !important;
            color: #FFD700 !important;
            border: 2px solid black !important;
            border-radius: 0 !important;
            font-family: "Comic Sans MS", cursive !important;
        }
    `);

    // 🟨 Progress bars or loading bars
    GM_addStyle(`
        progress, .progress-bar {
            background-color: #1C1C1C !important;
            border: 2px solid black !important;
            border-radius: 0 !important;
            color: #FFD700 !important;
        }
    `);

    // 🖼️ Optional: recolor icons for golden age vibes
    // GM_addStyle(`img { filter: hue-rotate(40deg); }`);
})();
