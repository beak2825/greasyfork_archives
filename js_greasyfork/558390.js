// ==UserScript==
// @name         Custom Suruga-ya
// @namespace    http://tampermonkey.net/
// @version      2025-12-09
// @description  Remove entries from wishlist without the whole page reloading
// @author       Doni
// @match        https://www.suruga-ya.com/*/mypage/wishlist/detail/*
// @icon         https://www.suruga-ya.com/sites/default/files_light/pwa/images/icons/favicon-32x32.png.webp?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558390/Custom%20Suruga-ya.user.js
// @updateURL https://update.greasyfork.org/scripts/558390/Custom%20Suruga-ya.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SELECTOR = 'span.ti-trash.delete-item';
    const DELETE_PATH = '/es/wishlist/delete/';

    async function handleClick(ev) {
        if (ev.button !== 0) return;

        ev.preventDefault();
        ev.stopImmediatePropagation();

        const itemId = ev.currentTarget.getAttribute('data-item_id');
        const link = ev.currentTarget.closest('a');

        if (!itemId) return;
        link.removeAttribute('href');
        link.parentElement.parentElement.remove();

        const deleteUrl = new URL(DELETE_PATH + encodeURIComponent(itemId), location.origin).href;
        fetch(deleteUrl, { method: 'GET', credentials: 'same-origin' })
            .catch(err => alert('Deletion error, please reload: ' + err));
    }

    document.querySelectorAll(SELECTOR).forEach(el => {
        el.addEventListener('click', handleClick, true);
    });

})();