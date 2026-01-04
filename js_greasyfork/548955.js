// ==UserScript==
// @name         Gartic Phone Remove All Ads
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Почти полностью убирает все рекламные элементы на Gartic Phone
// @author       Gorynych
// @match        *://garticphone.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548955/Gartic%20Phone%20Remove%20All%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/548955/Gartic%20Phone%20Remove%20All%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds() {
        const mainAd = document.querySelector('#garticphone-com_160x600');
        if (mainAd) mainAd.remove();

        document.querySelectorAll('iframe').forEach(iframe => iframe.remove());

        document.querySelectorAll('[class*="ads"], [class*="banner"], [class*="overlay"]').forEach(el => el.remove());

        const lobbyPopup = document.querySelector('.jsx-b6582d438744e10b.side');
        if (lobbyPopup) lobbyPopup.style.display = 'none';

        document.querySelectorAll('video[title="Advertisement"]').forEach(video => {
            const parentDiv = video.closest('div');
            if (parentDiv) parentDiv.remove();
        });

        document.querySelectorAll('div').forEach(div => {
            const z = window.getComputedStyle(div).zIndex;
            if (z && parseInt(z) > 100000) {
                div.remove();
            }
        });
    }

    const observer = new MutationObserver(() => {
        removeAds();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    removeAds();

})();
