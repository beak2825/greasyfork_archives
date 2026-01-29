// ==UserScript==
// @name         SeaDex search input autofill
// @namespace    copyMister
// @license      MIT
// @version      0.1
// @description  Autofill input with this custom search engine URL: https://releases.moe/?q=%s
// @author       copyMister
// @match        https://releases.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://releases.moe
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564394/SeaDex%20search%20input%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/564394/SeaDex%20search%20input%20autofill.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!location.search.startsWith('?q=')) return;
    const q = decodeURIComponent(location.search.slice(3).replace(/\+/g, ' '));

    const fill = () => {
        const i = document.querySelector('input.flex');
        if (!i) return setTimeout(fill, 100);
        i.focus();
        i.value = q;
        setTimeout(() => i.dispatchEvent(new Event('input', {bubbles: true})), 300);
    };

    fill();
})();