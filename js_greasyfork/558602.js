// ==UserScript==
// @name         Full-screen flcksbr
// @name:en      Full-screen flcksbr
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @description:en  -
// @author       antoxa-kms
// @match        https://flcksbr.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flcksbr.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558602/Full-screen%20flcksbr.user.js
// @updateURL https://update.greasyfork.org/scripts/558602/Full-screen%20flcksbr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---- ПЕРЕПИСЫВАЕМ CSS ---- */
    const cssToAdd = `
    @media screen and (min-width: 901px) {
        .wrapper {
            width: 100% !important;
            height: 100% !important;
        }
    }`;

    const style = document.createElement("style");
    style.textContent = cssToAdd;
    document.head.appendChild(style);

    /* ---- УДАЛЕНИЕ ЭЛЕМЕНТОВ ---- */
    function removeElements() {
        const tgMain = document.querySelector('.tgMain');
        const tgClose = document.querySelector('#tgClose');

        if (tgMain) tgMain.remove();
        if (tgClose) tgClose.remove();
    }

    // Удаляем сразу после загрузки
    removeElements();

    // И на случай, если элементы появляются динамически
    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();