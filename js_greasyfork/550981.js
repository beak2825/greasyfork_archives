// ==UserScript==
// @name         YouTube Disable Force Mix Playlist On songs 
// @match        https://www.youtube.com/*
// @grant        none
// @description  Disable Force Mix Playlist On songs. will cause a offline error half seconds.
// @version      1.0
// @author       Lucia “LuciaTheDragon” Ekberg.
// @license MIT
// @namespace https://greasyfork.org/users/1520424
// @downloadURL https://update.greasyfork.org/scripts/550981/YouTube%20Disable%20Force%20Mix%20Playlist%20On%20songs.user.js
// @updateURL https://update.greasyfork.org/scripts/550981/YouTube%20Disable%20Force%20Mix%20Playlist%20On%20songs.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let lastRedirect = '';

    function cleanURL() {
        try {
            const url = new URL(location.href);
            if (url.pathname === '/watch' && url.searchParams.has('v') && url.searchParams.has('start_radio')) {
                const v = url.searchParams.get('v');
                const clean = `${url.origin}/watch?v=${encodeURIComponent(v)}`;
                if (clean !== lastRedirect) {  // only redirect once per URL
                    lastRedirect = clean;
                    location.replace(clean);
                }
            }
        } catch(e){}
    }

    // Persistent check — can be very short interval
    setInterval(cleanURL, 1);

})();