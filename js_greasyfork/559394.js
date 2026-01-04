// ==UserScript==
// @name         Filman.cc popup banner remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes popup banner on filman.cc
// @author       000rosiu
// @license      GNU GPL v3.0
// @match        *://*.filman.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559394/Filmancc%20popup%20banner%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/559394/Filmancc%20popup%20banner%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hidePopup() {
        const popup = document.getElementById('kam-ban-player');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    hidePopup();

    setTimeout(hidePopup, 1000);
    setTimeout(hidePopup, 5000);
})();
