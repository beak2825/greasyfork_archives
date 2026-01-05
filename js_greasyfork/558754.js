// ==UserScript==
// @name         YouTube Redirect to Channels Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect from subscription feed to channels page showing all subscribed channels
// @author       You
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558754/YouTube%20Redirect%20to%20Channels%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/558754/YouTube%20Redirect%20to%20Channels%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const currentUrl = window.location.href;
    
    // Only redirect if we're on the subscription feed, NOT already on channels page
    if (currentUrl.includes('/feed/subscriptions') && !currentUrl.includes('/feed/channels')) {
        const isMobile = currentUrl.includes('m.youtube.com');
        
        if (isMobile) {
            window.location.replace('https://m.youtube.com/feed/channels');
        } else {
            window.location.replace('https://www.youtube.com/feed/channels');
        }
    }
    
})();