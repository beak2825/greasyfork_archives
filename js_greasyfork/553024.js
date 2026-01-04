// ==UserScript==
// @name         Start YouTube Video at 10 sec mark aka skip intro.
// @namespace    https://greasyfork.org/en/users/73635-ashmedai
// @version      1.0.5
// @license      MIT 
// @description  Automatically plays YouTube videos from the set time mark.
// @author       Ashmedai
// @match        *://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553024/Start%20YouTube%20Video%20at%2010%20sec%20mark%20aka%20skip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/553024/Start%20YouTube%20Video%20at%2010%20sec%20mark%20aka%20skip%20intro.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function seekTo(sec) {
        document.getElementById("movie_player").seekTo(10);
    }

    function onChangeVideoId () {
        seekTo(10);
    }

    let actualVideoId = null;
    let urlCheckerInterval = setInterval(() => {
        let videoId = document.getElementById("movie_player").getVideoData().video_id;
        console.log(`VideoId(${videoId})`);
        if (videoId == null) {
            return;
        }

        if (actualVideoId !== videoId) {
            actualVideoId = videoId;
            onChangeVideoId();
        }
    }, 500);
})();