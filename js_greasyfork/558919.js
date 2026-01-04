// ==UserScript==
// @name         YouTube - No Playlist
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open a video without a playlist with the middle button or button.
// @license      MIT License
// @author       Hunterrock
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558919/YouTube%20-%20No%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/558919/YouTube%20-%20No%20Playlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addNoPlaylistButton() {
        if (document.getElementById('yt-no-playlist-btn')) return;

        const currentUrl = new URL(window.location.href);
        // Sadece playlist parametresi varsa butonu göster
        if (!currentUrl.searchParams.has('list') || !currentUrl.searchParams.has('v')) return;

        // Başlık alanını bul
        const targetElement = document.querySelector('ytd-watch-metadata #title') ||
                              document.querySelector('#container > h1 > yt-formatted-string');

        if (targetElement) {
            const btn = document.createElement('button');
            btn.id = 'yt-no-playlist-btn';
            btn.innerText = '🚫 Listeden Çık';
            btn.title = 'Bu videoyu playlist olmadan yeniden yükle';
            // Buton stili
            Object.assign(btn.style, {
                marginLeft: '15px',
                cursor: 'pointer',
                backgroundColor: '#cc0000',
                color: 'white',
                border: 'none',
                borderRadius: '18px',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                verticalAlign: 'middle'
            });

            btn.onclick = function() {
                const url = new URL(window.location.href);
                url.searchParams.delete('list');
                url.searchParams.delete('index');
                url.searchParams.delete('start_radio');
                window.location.href = url.toString();
            };

            targetElement.parentNode.insertBefore(btn, targetElement.nextSibling);
        }
    }

    document.addEventListener('mousedown', function(e) {
        if (e.button !== 1) return;

        const anchor = e.target.closest('a');
        if (!anchor || !anchor.href) return;

        if (anchor.href.includes('/watch') && anchor.href.includes('list=')) {
            const originalHref = anchor.href;
            const url = new URL(originalHref);

            url.searchParams.delete('list');
            url.searchParams.delete('index');
            url.searchParams.delete('start_radio');
            url.searchParams.delete('pp');

            anchor.href = url.toString();

            setTimeout(() => {
                anchor.href = originalHref;
            }, 500);
        }
    }, true);

    const observer = new MutationObserver(() => {
        addNoPlaylistButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    addNoPlaylistButton();

})();