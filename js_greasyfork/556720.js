// ==UserScript==
// @name         YouTube + Vorapis – Toggle Video, Comments & Sidebar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows toggling the visibility of YouTube videos, comments, and recommended sidebar videos
// @author       Sefa AVAN
// @license      MIT
// @match        https://www.youtube.com/watch*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/556720/YouTube%20%2B%20Vorapis%20%E2%80%93%20Toggle%20Video%2C%20Comments%20%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/556720/YouTube%20%2B%20Vorapis%20%E2%80%93%20Toggle%20Video%2C%20Comments%20%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoVisible = true;
    let commentsVisible = false;
    let sidebarVisible = false;

    /*************** CSS to hide comments and sidebar ***************/
    const style = document.createElement('style');
    style.textContent = `
        ytd-comments,
        #comments,
        ytd-item-section-renderer#comments,
        [node-type="comments"],
        [class*="comments"],
        [id*="comments"],
        #secondary,
        #secondary-inner,
        #related,
        ytd-watch-next-secondary-results-renderer,
        [node-type="related"],
        [class*="secondary"],
        [id*="secondary"],
        [class*="related"],
        ytd-compact-video-renderer {
            display: none !important;
        }
        ytd-watch-flexy {
            flex-direction: column !important;
        }
    `;
    document.head.appendChild(style);

    /*************** Functions ***************/
    function toggleVideo() {
        const video = document.querySelector('video');
        if (!video) return;
        videoVisible = !videoVisible;
        video.style.display = videoVisible ? 'block' : 'none';
    }

    function toggleComments() {
        const selectors = [
            "ytd-comments",
            "#comments",
            "ytd-item-section-renderer#comments",
            '[node-type="comments"]',
            '[class*="comments"]',
            '[id*="comments"]'
        ];
        commentsVisible = !commentsVisible;
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = commentsVisible ? 'block' : 'none';
            });
        });
    }

    function toggleSidebar() {
        const selectors = [
            "#secondary",
            "#secondary-inner",
            "#related",
            "ytd-watch-next-secondary-results-renderer",
            '[node-type="related"]',
            '[class*="secondary"]',
            '[id*="secondary"]',
            '[class*="related"]',
            "ytd-compact-video-renderer"
        ];
        sidebarVisible = !sidebarVisible;
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = sidebarVisible ? 'block' : 'none';
            });
        });
    }

    /*************** Tampermonkey Menu ***************/
    GM_registerMenuCommand("Toggle Video Visibility", toggleVideo);
    GM_registerMenuCommand("Toggle Comments Visibility", toggleComments);
    GM_registerMenuCommand("Toggle Sidebar Visibility", toggleSidebar);

    /*************** MutationObserver ***************/
    const observer = new MutationObserver(() => {
        toggleVideo();
        toggleComments();
        toggleSidebar();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();
