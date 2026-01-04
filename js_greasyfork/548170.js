// ==UserScript==
// @name         Pornhub Ultra Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tüm reklamları engeller (banner, pop-up, video pre-roll, Trafficky) ve header'ı korur
// @author       Volkan
// @match        https://www.pornhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548170/Pornhub%20Ultra%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/548170/Pornhub%20Ultra%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Reklamları silme fonksiyonu
    function removeAds() {
        // Standart banner, iframe ve container reklamlar
        document.querySelectorAll(
            '#ph-main-ad, .ad-container, .ads, iframe[src*="ads"], .adBanner'
        ).forEach(el => {
            if (!el.closest('header')) el.remove();
        });

        // Overlay ve pop-up reklamlar
        document.querySelectorAll('.overlayAd, .popupAd, .popUp').forEach(el => el.remove());

        // Trafficky ve karmaşık rastgele reklam containerları
        document.querySelectorAll(
            '.tj-inban-container, .bddfnhclec1756647663941, .dfgfgbccfe'
        ).forEach(el => {
            if (!el.closest('header')) el.remove();
        });

        // Rastgele ID’li Trafficky benzeri reklamlar
        document.querySelectorAll('div[id^="b"]').forEach(el => {
            if (el.querySelector('.tj-inban-icon, iframe[src*="traffic"]')) {
                if (!el.closest('header')) el.remove();
            }
        });
    }

    // Sayfa yüklemesinde çalıştır
    removeAds();

    // Dinamik reklam eklemelerini izle
    const observer = new MutationObserver(() => removeAds());
    observer.observe(document.body, { childList: true, subtree: true });

    // Video pre-roll reklamları atlamak
    const skipAdsInterval = setInterval(() => {
        const skipBtn = document.querySelector('.videoAdUiSkipButton');
        if(skipBtn) skipBtn.click();
    }, 1000);

    // WebSocket üzerinden gelen gizli reklam verilerini engelle
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const socket = new originalWebSocket(url, protocols);
        const originalSend = socket.send;
        socket.send = function(data) {
            if (data && data.includes && data.includes('ad')) {
                console.log('Reklam verisi engellendi:', data);
                return;
            }
            originalSend.apply(socket, arguments);
        };
        return socket;
    };
})();
