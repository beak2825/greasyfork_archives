// ==UserScript==
// @name         Youtube.music Playlist liker
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  Automatically likes all songs in a playlist
// @author       TheOnlyWayUp, mousa-aljasem, T-TaaN
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548226/Youtubemusic%20Playlist%20liker.user.js
// @updateURL https://update.greasyfork.org/scripts/548226/Youtubemusic%20Playlist%20liker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let logging = true;
    let timer = 0;

     GM_registerMenuCommand("Like this playlist", () =>
    {
         const songs = document.getElementsByTagName("ytmusic-responsive-list-item-renderer");

         log(`Found ${songs.length} songs.`);

         var i = 1;
         Array.from(songs).forEach((song, index) => {
             setTimeout(() => {
                 const likeButton = song.querySelector("#button-shape-like button");
                 const songInfo = song.getElementsByTagName('a'); // 0 == Song Title, 1 == Artist, 2 == Album

                 if (logging) console.log(i, songInfo[1].innerHTML, "-", songInfo[0].innerHTML, "- isLiked:", likeButton.getAttribute("aria-pressed"))

                 if (likeButton.getAttribute("aria-pressed") === "false") {
                     likeButton.click();
                     log("liked");
                 }

                 i++;
                 if (i > songs.length) {
                     log("------------ COMPLETE ------------");

                 }
             }, index * timer)
         })
    })

    function log(message) {
      if (logging)
          console.log(message)
     }
})();