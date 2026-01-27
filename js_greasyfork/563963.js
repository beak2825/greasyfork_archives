// ==UserScript==
// @name         Скрипт для кураторов форума White
// @namespace    Скрипт для кураторов форума White
// @version      1.1
// @description  Загружает скрипт для кураторов форума Black Russia
// @author       Novikov
// @match        https://forum.blackrussia.online/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563963/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20White.user.js
// @updateURL https://update.greasyfork.org/scripts/563963/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20White.meta.js
// ==/UserScript==

(function(){
    const s = document.createElement('script');
    s.src = 'https://update.greasyfork.org/scripts/563955/Black%20Russia%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js?v=' + Date.now();
    document.head.appendChild(s);
})();
