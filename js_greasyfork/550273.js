// ==UserScript==
// @name         YouTube Beğeni Sayacı (SPA Uyumlu)
// @name:en    YouTube Like Counter (SPA Compatible)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  YouTube videolarında beğeni sayısını, sayfa geçişleri dahil olmak üzere dinamik olarak günceller.
// @description:en It dynamically updates the number of likes on YouTube videos, including page views.
// @author       JavaScript Kod Asistanı
// @match        https://www.youtube.com/watch?*
// @icon           https://www.google.com/s2/favicons?domain=youtube.com&sz=128
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550273/YouTube%20Be%C4%9Feni%20Sayac%C4%B1%20%28SPA%20Uyumlu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550273/YouTube%20Be%C4%9Feni%20Sayac%C4%B1%20%28SPA%20Uyumlu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const likeButtonSelector = '#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button-view-model > button';
    const likeCountTextSelector = `${likeButtonSelector} > div.yt-spec-button-shape-next__button-text-content`;

    function updateLikeCount() {
        const likeButton = document.querySelector(likeButtonSelector);
        const likeCountElement = document.querySelector(likeCountTextSelector);

        if (likeButton && likeCountElement) {
            const ariaLabel = likeButton.getAttribute('aria-label');
            if (ariaLabel) {
                const matches = ariaLabel.match(/(\d[\d,.]*)/);
                if (matches && matches[1]) {
                    const likeCount = matches[1];
                    likeCountElement.textContent = likeCount;
                }
            }
        }
    }

    // YouTube'un sayfa geçiş olayını dinle
    window.addEventListener('yt-page-data-updated', () => {
        // Olay her tetiklendiğinde beğeni sayısını güncelle
        updateLikeCount();
    });

    // Sayfa ilk yüklendiğinde de çalıştır
    updateLikeCount();
})();