// ==UserScript==
// @name         GoComics Arrow Key Control
// @version      1.1
// @description  Use arrow keys to go back and forth on comics on GoComics
// @author       ScarrleTRain
// @license      The Unlicense
// @match        https://www.gocomics.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1527183
// @downloadURL https://update.greasyfork.org/scripts/552729/GoComics%20Arrow%20Key%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/552729/GoComics%20Arrow%20Key%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keyup', function(e) {
        const key = e.key;
        if (key === "ArrowLeft") {
            const link = document.getElementsByClassName("ComicNavigation_controls__button_previous__PZdwJ")[0].href;
            window.location.href = link;
        } else if (key === "ArrowRight") {
            const link = document.getElementsByClassName("ComicNavigation_controls__button_next___psjs")[0].href;
            window.location.href = window.location.href !== link ? link : window.location.href;
        }
    });
})();
