// ==UserScript==
// @name         replace furry
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Уточка в диалогах и на странице 404.
// @author       Shadman
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560359/replace%20furry.user.js
// @updateURL https://update.greasyfork.org/scripts/560359/replace%20furry.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CONVERSATIONS_IMAGE_URL = "https://i.ibb.co/Rphyg3QH/utka-lolz.png";
    const ERROR_404_IMAGE_URL = "https://i.ibb.co/bMvVSTdV/utya-utya-duck.png";
    const style = document.createElement('style');
    style.innerHTML = `
        /* Правило для диалогов */
        img.conversationCapImage {
            content: url("${CONVERSATIONS_IMAGE_URL}") !important;
            object-fit: contain;
        }
        .error-container img {
            content: url("${ERROR_404_IMAGE_URL}") !important;
            object-fit: contain;
            width: 100%; /* На странице ошибки картинка может быть большой */
            max-height: 300px; /* Ограничим высоту, чтобы не была на весь экран */
        }
    `;
    document.head.appendChild(style);
    function replaceSources() {
        const convImg = document.querySelector('img.conversationCapImage');
        if (convImg && convImg.src !== CONVERSATIONS_IMAGE_URL) {
            convImg.src = CONVERSATIONS_IMAGE_URL;
        }
        const errorImg = document.querySelector('.error-container img');
        if (errorImg && errorImg.src !== ERROR_404_IMAGE_URL) {
            errorImg.src = ERROR_404_IMAGE_URL;
            errorImg.removeAttribute('width');
            errorImg.removeAttribute('height');
        }
    }

    const observer = new MutationObserver((mutations) => {
        replaceSources();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    replaceSources();
})();