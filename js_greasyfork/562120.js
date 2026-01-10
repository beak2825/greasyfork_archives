// ==UserScript==
// @name         Reddit hide videos
// @version      1.0
// @description  Hides videos on Reddit feed.
// @author       yojc
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.com
// @downloadURL https://update.greasyfork.org/scripts/562120/Reddit%20hide%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/562120/Reddit%20hide%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const stylesheet = `
    .post-hidden,
    .post-hidden + hr,
    shreddit-ad-post,
    shreddit-ad-post + hr {
        display: none;
    }
    `;

    function appendStylesheet() {
        //console.log("Appending stylesheet");

        const head = document.getElementsByTagName("head")[0];
        const s = document.createElement("style");
        s.setAttribute("type", "text/css");
        s.appendChild(document.createTextNode(stylesheet));
        head.appendChild(s);
    }

    function hideVideos() {
        for (const redditPost of document.querySelectorAll("shreddit-post:not([data-hide-videos-processed])")) {
            redditPost.dataset.hideVideosProcessed = true;

            if (redditPost.querySelector("shreddit-player-2, shreddit-player-static-hlsjs, shreddit-player, shreddit-embed[providername=YouTube], shreddit-embed[providername=Streamable]")) {
                redditPost.parentNode.classList.add("post-hidden");
                continue;
            }
        }
    }

    let oldHref = window.location.href;

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != window.location.href) {
                oldHref = window.location.href;
            }

            hideVideos();
        });
    });

    function init(bodyList) {
        //console.log("Running init");

        const config = {
            childList: true,
            subtree: true
        };

        observer.observe(bodyList, config);
        appendStylesheet();
        hideVideos();
    }

    const initInterval = setInterval(function() {
        const bodyList = document.querySelector("body");

        if (bodyList) {
            clearInterval(initInterval);
            init(bodyList);
        }
    }, 100);

})();
