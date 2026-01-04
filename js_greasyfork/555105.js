// ==UserScript==
// @name           Blocca AnimeClick video-intro
// @name:en        Block AnimeClick video-intro
// @namespace      skip-animeclick-video-intro
// @version        1.04
// @description    Salta automaticamente la pagina "video-intro" di AnimeClick.it portando direttamente alla homepage.
// @description:en This script automatically skips the “video-intro” page on AnimeClick.it, an Italian Anime and Manga website, and redirects you directly to the homepage.
// @match          https://www.animeclick.it/*
// @run-at         document-start
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/555105/Blocca%20AnimeClick%20video-intro.user.js
// @updateURL https://update.greasyfork.org/scripts/555105/Blocca%20AnimeClick%20video-intro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (/video[-_]intro/i.test(location.href)) {
        location.replace('https://www.animeclick.it/');
    }
})();










