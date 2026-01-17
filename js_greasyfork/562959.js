// ==UserScript==
// @name         YouTube Home -> Playlists Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  YouTube ana sayfasını direkt olarak kayıtlı playlistlere yönlendirir.
// @author       Gemini
// @match        *://www.youtube.com/*
// @run-at       document-start
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562959/YouTube%20Home%20-%3E%20Playlists%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/562959/YouTube%20Home%20-%3E%20Playlists%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirectToPlaylists() {
        // Sadece ana sayfadaysak (root URL) yönlendir
        if (window.location.pathname === '/' || window.location.pathname === '') {
            window.location.replace('https://www.youtube.com/feed/playlists');
        }
    }

    // 1. Sayfa ilk açıldığında kontrol et
    redirectToPlaylists();

    // 2. YouTube içinde gezinirken (SPA) ana sayfa logosuna basılırsa kontrol et
    window.addEventListener('yt-navigate-finish', redirectToPlaylists);
    window.addEventListener('popstate', redirectToPlaylists);

})();