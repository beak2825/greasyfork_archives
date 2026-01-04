// ==UserScript==
// @name         Spotify - Open Spotify links in desktop app
// @author       notmayo
// @description  Redirect Spotify URLs to the desktop app (spotify://) and close the tab
// @version      1.1
// @license      MIT License
// @match        *://open.spotify.com/*
// @namespace    https://greasyfork.org/en/users/1536062-notmayo
// @run-at       document-start
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @downloadURL https://update.greasyfork.org/scripts/555334/Spotify%20-%20Open%20Spotify%20links%20in%20desktop%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/555334/Spotify%20-%20Open%20Spotify%20links%20in%20desktop%20app.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var data=document.URL.match(/[\/\&](track|playlist|album|artist|show|episode)\/([^\&\#\/\?]+)/i);
    console.log("This is a "+data[1]+" with id:"+data[2]+"\nAttempting to redirect");
    window.location.replace('spotify:'+data[1]+':'+data[2]);
    window.close();
})();