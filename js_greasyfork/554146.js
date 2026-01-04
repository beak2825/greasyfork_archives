// ==UserScript==
// @name         Discord & Spotify URL Redirector
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically redirects Discord and Spotify URLs to desktop apps
// @author       You
// @match        *://discord.com/channels/*
// @match        *://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554146/Discord%20%20Spotify%20URL%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/554146/Discord%20%20Spotify%20URL%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const currentUrl = window.location.href;
    
    // Discord redirect
    if (currentUrl.startsWith('https://discord.com/channels/')) {
        const newUrl = currentUrl.replace('https://discord.com/channels/', 'discord://discord.com/channels/');
        window.location.replace(newUrl);
    }
    
    // Spotify redirect
    if (currentUrl.startsWith('https://open.spotify.com/')) {
        // Преобразуем URL вида https://open.spotify.com/track/ID в spotify:track:ID
        const spotifyUrl = new URL(currentUrl);
        const pathParts = spotifyUrl.pathname.split('/').filter(part => part.length > 0);
        
        if (pathParts.length >= 2) {
            const type = pathParts[0]; // track, album, artist, playlist и т.д.
            const id = pathParts[1];
            const newUrl = `spotify:${type}:${id}`;
            window.location.replace(newUrl);
        }
    }
})();
