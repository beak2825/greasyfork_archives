// ==UserScript==
// @name                    YouTube Comments and recommendation list locations exchanged
// @name:zh-TW              YouTube 评论与推荐列表位置互换
// @name:zh-CN              YouTube 评论与推荐列表位置互换
// @icon                    https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author                  devret
// @namespace               devret_youtube_exchanged_squared_namespace
// @version                 0.1.1
// @match                   *://www.youtube.com/*
// @exclude                 *://www.youtube.com/live_chat*
// @grant                   none
// @run-at                  document-idle
// @inject-into             page
// @license                 MIT
// @description             Comments and recommendation list locations exchanged.
// @description:zh-TW       评论与推荐列表位置互换。
// @description:zh-CN       评论与推荐列表位置互换。
// @downloadURL https://update.greasyfork.org/scripts/550828/YouTube%20Comments%20and%20recommendation%20list%20locations%20exchanged.user.js
// @updateURL https://update.greasyfork.org/scripts/550828/YouTube%20Comments%20and%20recommendation%20list%20locations%20exchanged.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {

    function setMaxHeight() {
        const secondary = document.getElementById('secondary');
        const windowHeight = window.innerHeight;
        const offsetTop = secondary.getBoundingClientRect().top;
        secondary.style.height = `${windowHeight - offsetTop}px`;
        secondary.style.overflowY = 'auto';
    }
    function exchanged(){
         const observer = new MutationObserver((mutations) => {
             const sections = document.getElementById('comments');
             const secondary = document.getElementById('secondary');
             const secondaryInner = document.getElementById('secondary-inner');
             const primary = document.getElementById('primary');

             if (sections && secondary) {
                 secondary.appendChild(sections);
                 primary.appendChild(secondaryInner);
                 setMaxHeight();
                 observer.disconnect();
             }
         });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        const initialSections = document.getElementById('comments');
        const initialSecondary = document.getElementById('secondary');
        const initialSecondaryInner = document.getElementById('secondary-inner');
        const initialPrimary = document.getElementById('secondary-inner');
        if (initialSections && initialSecondary && initialSecondaryInner && initialPrimary) {
            initialSecondary.appendChild(initialSections);
            initialPrimary.appendChild(initialSecondaryInner);
            setMaxHeight();
            observer.disconnect();
        }

    }

    function initialize() {
        exchanged();
        window.addEventListener('load', setMaxHeight);
        window.addEventListener('resize', setMaxHeight);
    }


    initialize();
})();
