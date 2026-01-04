// ==UserScript==
// @name         genius-date
// @description  script to inject today's date when transcribing a new song
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0.1
// @description  A simple example userscript
// @author       solomoncyj
// @match        https://genius.com/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556743/genius-date.user.js
// @updateURL https://update.greasyfork.org/scripts/556743/genius-date.meta.js
// ==/UserScript==

function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

function inject()
{
    const today = new Date(Date.now());
    selectElement('song_release_date_1i', today.getFullYear());
    selectElement('song_release_date_2i', today.getMonth() + 1);
    selectElement('song_release_date_3i', today.getDate());
}

(function() {
   'use strict';

    let btn = document.createElement("button");
    btn.onclick = () => {
        inject()
    };
    const info = document.createTextNode("Today");
    let div = document.querySelector(".add_song_page-release_date");
    div.appendChild(btn);
    btn.appendChild(info);
})();