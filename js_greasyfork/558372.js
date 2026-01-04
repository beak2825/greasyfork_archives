// ==UserScript==
// @name         GameSense Forum Customization
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Changes the forum background image and sets the theme to light blue.
// @author       bekonn
// @match        https://gamesense.pub/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558372/GameSense%20Forum%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/558372/GameSense%20Forum%20Customization.meta.js
// ==/UserScript==

(function() {
    'use strict';

const customCSS = `

        body {
            background-image: url('https://i.imgur.com/7KI4AQL.png') !important;

            background-size: cover !important;
            background-attachment: fixed !important;
            background-position: center center !important;
            background-color: #000000 !important;
            background-repeat: no-repeat;
        }

        .pun,
        .punwrap,
        #brdheader,
        #brdfooter,

        .block,
        .box,
        .inbox,

        .blocktable,
        .block table,
        .block table tbody,
        .block table tr,

        .rowodd, .roweven,
        .tcl, .tcr, .tcm,
        div.top-box,
        .end-box,
        #brdtitle,
        #brddesc {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }


        .blockform h2 span,
        #shout,
        #brdwelcome {
            background-color: rgba(0, 0, 0, 0.7) !important;
            padding: 10px;
            border-radius: 5px;
        }

        .box {
            background-color: rgba(0, 0, 0, 0.5) !important;
        }

        .blockform h2, .forumlist h3 {
            background-color: rgba(0, 0, 0, 0.8) !important;
        }

        body,
        .pun,
        .punwrap,
        .inbox a, .box a,
        h1, h2, h3, h4,
        li, p, span,
        .usergroup-5, .usergroup-3,
        #brdmenu ul li a,
        .rowOdd a, .rowEven a,
        div, table, tr, td {
            color: #FFFFFF !important;
        }
    `;

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(customCSS);
})();