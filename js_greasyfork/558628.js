// ==UserScript==
// @name         CamWhoresTV – Hide PRIVATE videos
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрывает приватные видео на сайте camwhores.tv
// @match        https://www.camwhores.tv/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558628/CamWhoresTV%20%E2%80%93%20Hide%20PRIVATE%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/558628/CamWhoresTV%20%E2%80%93%20Hide%20PRIVATE%20videos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hidePrivate() {

        const cards = document.querySelectorAll('a[href*="/videos/"], .item');

        cards.forEach(card => {

            const hasPrivateSpan = card.querySelector('.line-private');


            const hasPrivateClass =
                card.classList.contains('private') ||
                card.closest('.private');

            if (hasPrivateSpan || hasPrivateClass) {
                card.style.display = 'none';
            }
        });
    }

    hidePrivate();


    const observer = new MutationObserver(() => hidePrivate());
    observer.observe(document.body, { childList: true, subtree: true });

})();
