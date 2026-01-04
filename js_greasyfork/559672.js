// ==UserScript==
// @name         Smart Cyrillic Address Bar to Yandex 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Jim Chen
// @description  Redirect Cyrillic searches to Yandex if initiated from the Address Bar
// @match        https://www.google.com/search*
// @match        https://google.com/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559672/Smart%20Cyrillic%20Address%20Bar%20to%20Yandex.user.js
// @updateURL https://update.greasyfork.org/scripts/559672/Smart%20Cyrillic%20Address%20Bar%20to%20Yandex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const referrer = document.referrer;
    if (referrer && referrer.includes('google.com')) {
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query && /[\u0400-\u04FF]/.test(query)) {
        window.location.replace(`https://yandex.ru/search/?text=${encodeURIComponent(query)}`);
    }
})();