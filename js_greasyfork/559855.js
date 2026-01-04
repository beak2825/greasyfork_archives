// ==UserScript==
// @name        Better favourite button (no more refreshing page)
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/view/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      crunchy2382
// @description Toggle favorites via fetch without following href making double navigation a problem
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @downloadURL https://update.greasyfork.org/scripts/559855/Better%20favourite%20button%20%28no%20more%20refreshing%20page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559855/Better%20favourite%20button%20%28no%20more%20refreshing%20page%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findFavButton() {
        return [...document.querySelectorAll('a')].find(a => {
            const text = a.textContent.trim();
            return text === '+Fav' || text === '-Fav';
        });
    }

    function extractFavButtonFromHTML(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return [...doc.querySelectorAll('a')].find(a => {
            const t = a.textContent.trim();
            return t === '+Fav' || t === '-Fav';
        });
    }

    function bindButton(button) {
        if (button.dataset.favBound) return;
        button.dataset.favBound = 'true';

        const originalHref = button.href;
        if (!originalHref) return;

        button.dataset.favUrl = originalHref;
        button.removeAttribute('href');
        button.style.cursor = 'pointer';

        button.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const url = button.dataset.favUrl;
            if (!url) return;

            button.style.pointerEvents = 'none';
            button.style.opacity = '0.6';

            fetch(url, {
                method: 'GET',
                credentials: 'same-origin'
            })
            .then(res => res.text())
            .then(html => {
                const newBtn = extractFavButtonFromHTML(html);
                if (!newBtn) return;

                button.textContent = newBtn.textContent.trim();
                button.dataset.favUrl = newBtn.href;
            })
            .finally(() => {
                button.style.pointerEvents = '';
                button.style.opacity = '';
            });
        });
    }

    function init() {
        const btn = findFavButton();
        if (btn) bindButton(btn);
    }

    init();

    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
