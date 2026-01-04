// ==UserScript==
// @name         1xBit přesměrování
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přesměruje do správne live url
// @author       Michal
// @match        https://1xbitx1.com/*
// @match        https://www.1xbitx1.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555112/1xBit%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/555112/1xBit%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const match = url.match(/\/(\d+)-[^\/]+$/);

    if (match && match[1]) {
        const id = match[1];
        const target = `https://1xbit2.com/LiveFeed/GetGameZip?id=${id}&lng=en&cfview=0&isSubGames=true&GroupEvents=true&countevents=50&grMode=2`;
        window.location.replace(target);
    }
})();