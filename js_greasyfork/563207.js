// ==UserScript==
// @name         Medium Open In Freedium Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a floating button to Medium to open current page in Localhost
// @author       Bharat Makwana
// @match        https://medium.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563207/Medium%20Open%20In%20Freedium%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/563207/Medium%20Open%20In%20Freedium%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create the Button element
    const btn = document.createElement("button");
    btn.innerText = "Open in Freedium";
    btn.id = "tm-localhost-btn";

    // 2. Add the Logic
    btn.addEventListener("click", function() {
        const targetUrl = "http://localhost:7080/" + window.location.href;
        window.open(targetUrl, '_blank');
    });

    // 3. Add the Styling (Replacing Stylus)
    const style = document.createElement('style');
    style.innerHTML = `
        #tm-localhost-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999999;

            /* Visuals */
            background-color: #1a8917;
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            outline: none;
        }

        #tm-localhost-btn:hover {
            background-color: #156d12;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        #tm-localhost-btn:active {
            transform: translateY(0);
        }
    `;

    // 4. Inject into the page
    document.head.appendChild(style);
    document.body.appendChild(btn);
})();