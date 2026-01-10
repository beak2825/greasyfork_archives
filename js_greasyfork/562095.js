// ==UserScript==
// @name         YabanciDizi Reklam Kaldırıcı + Fullscreen + Ultra Siyah Tema
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Reklam temizler + fullscreen + Siyah tema
// @author       Echelon
// @match        *://yabancidizi.so/*
// @grant        none
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/562095/YabanciDizi%20Reklam%20Kald%C4%B1r%C4%B1c%C4%B1%20%2B%20Fullscreen%20%2B%20Ultra%20Siyah%20Tema.user.js
// @updateURL https://update.greasyfork.org/scripts/562095/YabanciDizi%20Reklam%20Kald%C4%B1r%C4%B1c%C4%B1%20%2B%20Fullscreen%20%2B%20Ultra%20Siyah%20Tema.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockedDomains = [
        'vidmoly.me', 'okru.tv', 'ads', 'reklam', 'banner', 'adsterra', 'popads',
        'doubleclick', 'googleadservices', 'sovrn', 'openx', 'dygdigital'
    ];

    const popupSelectors = [
        '.modal', '.popup', '.overlay', '.lightbox', '.swal2-container',
        '[class*="ad-"]', '[id*="ad-"]', '.alert', '.notification', '.toast'
    ];

    function removeAds(root = document) {
        root.querySelectorAll(
            '[data-gets], [data-ad], [data-ads], ' +
            '[data-gets][data-type^="v"], .adsbygoogle, [id*="ads"], [class*="reklam"], ' +
            '[class*="banner"], .ydad, .app, .ad-block, .advert, .sponsored'
        ).forEach(el => el.remove());

        root.querySelectorAll('iframe, video').forEach(el => {
            const src = (el.src || el.currentSrc || '').toLowerCase();
            if (blockedDomains.some(d => src.includes(d))) el.remove();
        });

        popupSelectors.forEach(sel => root.querySelectorAll(sel).forEach(el => el.remove()));
    }

    function forceBlackTheme() {
        // 1. Stil ekle (CSS katmanı)
        let style = document.getElementById('ultra-black-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'ultra-black-style';
            document.head.appendChild(style);
        }

        style.textContent = `
            html, body, #wrapper, .wrapper, .container-fluid, .container, .content,
            .main, .page-content, .player-section, .video-area, .sidebar, .col-md-*, .row,
            .episode-detail, .synopsis, .comments-area, .footer, header, .header-top,
            .navbar, .card, .bg-white, .bg-light, .bg-gray, .bg-default {
                background: #000000 !important;
                background-color: #000000 !important;
                color: #e0e0e0 !important;
            }

            [style*="background"], [style*="bg-"], [style*="color:#fff"], [style*="white"] {
                background-color: #000000 !important;
                color: #e0e0e0 !important;
            }

            /* Özel sınıfları koru */
            *:not(video):not(canvas):not([class*="player"]):not(input):not(button):not(.poster-subject):not(.mofy-movbox-on) {
                background-color: #000000 !important;
            }
        `;

        // 2. JS ile inline stilleri zorla temizle (en güçlü yöntem)
        document.querySelectorAll('div, section, article, aside, main, header, footer, nav').forEach(el => {
            if (el.classList.contains('poster-subject') || el.classList.contains('mofy-movbox-on')) return;

            const bg = window.getComputedStyle(el).backgroundColor;
            if (bg.includes('255') || bg.includes('rgb(2') || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                el.style.backgroundColor = '#000000';
                el.style.background = '#000000';
                el.style.backgroundImage = 'none';
            }
        });
    }

    function makeFullscreen() {
        const wrapper = document.querySelector('#wrapper, .main-wrapper, .container');
        if (wrapper) {
            wrapper.style.cssText = 'width:100vw !important; max-width:100vw !important; min-height:100vh !important; margin:0 !important; padding:0 !important; background:#000 !important;';
        }
        document.body.style.cssText = 'margin:0 !important; padding:0 !important; background:#000000 !important; overflow-x:hidden !important;';
        document.documentElement.style.background = '#000000';
    }



    function fullCleanup() {
        removeAds();
        makeFullscreen();
        forceBlackTheme();
    }


   function enableCinemaMode() {
        const player = document.querySelector('div.player');
        if (!player) return;

        const iframe = player.querySelector('iframe');
        if (!iframe) return;

        let isCinema = false;
        const originalStyles = {
            playerPosition: player.style.position || '',
            playerZIndex: player.style.zIndex || '',
            playerBoxShadow: player.style.boxShadow || ''
        };

        // Overlay ekle
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = '#000';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.zIndex = '9998'; // player'ın altında
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);

        // Exit button ekle
        let exitBtn = document.createElement('button');
        exitBtn.textContent = '✕';
        exitBtn.style.position = 'fixed';
        exitBtn.style.top = '20px';
        exitBtn.style.right = '20px';
        exitBtn.style.zIndex = '10000';
        exitBtn.style.padding = '5px 10px';
        exitBtn.style.fontSize = '18px';
        exitBtn.style.background = 'rgba(0,0,0,0.7)';
        exitBtn.style.color = '#fff';
        exitBtn.style.border = 'none';
        exitBtn.style.borderRadius = '4px';
        exitBtn.style.cursor = 'pointer';
        exitBtn.style.display = 'none'; // başlangıçta gizli
        document.body.appendChild(exitBtn);

        exitBtn.addEventListener('click', deactivateCinema);

        function activateCinema() {
            if (isCinema) return;
            isCinema = true;

            // Player öne al ve glow ekle
            player.style.position = 'relative';
            player.style.zIndex = '10001';
            player.style.boxShadow = '0 0 20px 5px rgba(255,255,255,0.3)';

            // Overlay animasyonlu
            overlay.style.opacity = '1';
            exitBtn.style.display = 'block';

            // Diğer her şeyi karartmak
            document.querySelectorAll('body > *:not(.player)').forEach(el => {
                el.style.background = '#000';
                el.style.color = '#000';
            });
            document.body.style.background = '#000';
            document.documentElement.style.background = '#000';
        }

        function deactivateCinema() {
            if (!isCinema) return;
            isCinema = false;

            // Player eski stil
            player.style.position = originalStyles.playerPosition;
            player.style.zIndex = originalStyles.playerZIndex;
            player.style.boxShadow = originalStyles.playerBoxShadow;

            // Overlay ve exit button
            overlay.style.opacity = '0';
            exitBtn.style.display = 'none';

            // Diğer her şeyi eski hâline döndür
            document.querySelectorAll('body > *:not(.player)').forEach(el => {
                el.style.background = '';
                el.style.color = '';
            });
            document.body.style.background = '';
            document.documentElement.style.background = '';
        }

        // iframe yüklendiğinde otomatik sinema modu
        iframe.addEventListener('load', activateCinema);

        // ESC ile çıkış
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') deactivateCinema();
        });
    }

    enableCinemaMode();



    // Başlangıç
    fullCleanup();





    // Sayfa olayları
    window.addEventListener('load', fullCleanup);
    document.addEventListener('DOMContentLoaded', fullCleanup);

    // Dinamik izleme
    new MutationObserver(() => {
        if (Math.random() < 0.6) fullCleanup();
    }).observe(document.documentElement, { childList: true, subtree: true });

    // En inatçı beyazlıkları her 2 saniyede yok et
    setInterval(fullCleanup, 2000);

})();
