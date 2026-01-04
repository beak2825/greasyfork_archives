// ==UserScript==
// @name         Hide hotThemesContainer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Скрывает Горячие темы на лолзе
// @author       You
// @match        https://lolz.live/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550859/Hide%20hotThemesContainer.user.js
// @updateURL https://update.greasyfork.org/scripts/550859/Hide%20hotThemesContainer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = '.hotThreadsContainer { display: none !important; }';

    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.documentElement.appendChild(style);
    }

})();