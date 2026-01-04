// ==UserScript==
// @name          GameSense Forum Customization By bekonn
// @namespace     http://tampermonkey.net/
// @version       2.3
// @description   Changes the forum background image, sets the theme to dark/transparent, changes the browser title, and customizes the site's main heading. Makes the message input area semi-transparent and defined.
// @author        bekonn
// @match         https://gamesense.pub/*
// @grant         none
// @run-at        document-start
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/558729/GameSense%20Forum%20Customization%20By%20bekonn.user.js
// @updateURL https://update.greasyfork.org/scripts/558729/GameSense%20Forum%20Customization%20By%20bekonn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newFaviconUrl = 'https://i.imgur.com/Aa8oOvK.png';
    document.title = 'gamesense';

    function changeFavicon(url) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = url;

        const existingFavicon = document.querySelector("link[rel*='icon']");
        if (existingFavicon) {
            existingFavicon.remove();
        }

        document.getElementsByTagName('head')[0].appendChild(link);
    }

    function changeMainTitle() {
        const titleElement = document.getElementById('brdtitle');

        if (titleElement) {
            const titleLink = titleElement.querySelector('a');

            if (titleLink) {
                titleLink.innerHTML = '<span class="gs-text">game</span><span class="sense-text">SENSE</span>';
            }
        }
    }

    changeFavicon(newFaviconUrl);
    window.addEventListener('load', changeMainTitle);


    const customCSS = `

        body {
            background-image: url('https://i.imgur.com/T9jMwL0.jpeg') !important;
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

        #brdtitle {
            padding-bottom: 0 !important;
            font-family: 'Raleway', sans-serif !important;
        }

        #brdtitle a {
            text-transform: lowercase !important;
            font-size: initial;
        }

        #brdtitle .gs-text {
            color: #FFFFFF !important;
            font-weight: 900;
        }

        #brdtitle .sense-text {
            color: #3CB371 !important;
            font-weight: 900;
        }



        .blockform h2, .forumlist h3 {
            background-color: transparent !important;
        }

        .blockform h2 span {
            background-color: transparent !important;
            padding: 10px;
            border-radius: 5px;
        }

        .blockform h2 {
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        #brdmain .blockform .box {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
        }

        #shout,
        #brdwelcome {
            background-color: transparent !important;
            padding: 10px;
            border-radius: 5px;
        }

        #shout ul,
        #shout li,
        #shout div,
        #shout p,
        #shout span,
        #shout > div {
            background-color: transparent !important;
        }

        #shout form {
            background-color: transparent !important;
        }

        #shout input#shouttext {
            background-color: rgba(0, 0, 0, 0.4) !important; /* Yarı saydam koyu arka plan */
            border: 1px solid rgba(255, 255, 255, 0.3) !important; /* İnce beyaz sınır */
            box-shadow: none !important;
            color: #FFFFFF !important;
            border-radius: 4px;
        }

        #shout label {
            background-color: transparent !important;
        }

        .box {
            background-color: rgba(0, 0, 0, 0.5) !important;
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