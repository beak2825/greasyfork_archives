// ==UserScript==
// @name         Google CS:GO 2 Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transform Google into a CS:GO 2-themed site
// @author       villads
// @match        https://www.google.com/*
// @match        https://www.google.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549710/Google%20CS%3AGO%202%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/549710/Google%20CS%3AGO%202%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global CSS for the theme
    const css = `
        body, html {
            background: url('https://i.imgur.com/5g8k0pL.jpg') no-repeat center center fixed;
            background-size: cover;
            font-family: 'Arial Black', sans-serif;
            color: #FF6F00 !important;
        }

        input, textarea, button {
            font-family: 'Arial Black', sans-serif;
            border: 2px solid #FF6F00 !important;
            background-color: rgba(0,0,0,0.8) !important;
            color: #FF6F00 !important;
        }

        a, a:visited {
            color: #FFA000 !important;
            text-decoration: none !important;
        }

        a:hover {
            color: #FF6F00 !important;
            text-shadow: 0 0 10px #FF6F00;
        }

        #hplogo, .lnXdpd {
            filter: drop-shadow(0 0 10px #FF6F00);
        }

        /* Style search results */
        .g {
            background-color: rgba(0,0,0,0.7);
            border: 1px solid #FF6F00;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
        }

        /* Style buttons */
        input[type="submit"], .gNO89b, .RNmpXc {
            background-color: #FF6F00 !important;
            border-color: #FF6F00 !important;
            color: black !important;
            font-weight: bold;
            text-transform: uppercase;
            box-shadow: 0 0 10px #FF6F00;
        }

        input[type="submit"]:hover, .gNO89b:hover, .RNmpXc:hover {
            background-color: #FFA000 !important;
            box-shadow: 0 0 20px #FFA000;
        }
    `;

    // Append CSS to the page
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

})();
