// ==UserScript==
// @name        Restore Reddit subscriber count
// @namespace   Violentmonkey Scripts
// @match       *://*.reddit.com/r/*
// @grant       GM.xmlHttpRequest
// @version     0.5.3
// @license     MIT
// @author      https://github.com/wlonkly/
// @description Restores the subscriber count on Reddit subreddits.
// @downloadURL https://update.greasyfork.org/scripts/550811/Restore%20Reddit%20subscriber%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/550811/Restore%20Reddit%20subscriber%20count.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // captures up to "/r/subreddit". technically you can also get
    // an about.json from an individual post page with a different data
    // structure, but that's more work than this.
    const statsUrl = window.location.href.split('/').slice(0,5).join('/') + "/about.json";
    console.log("subreddit stats URL: " + statsUrl);

    GM.xmlHttpRequest({
        method: 'GET',
        url: statsUrl,
        onload: function(response) {
            try {
                const resp = JSON.parse(response.responseText);

                let subscribers;
                if (resp.data?.subscribers !== undefined) {
                  subscribers = resp.data.subscribers.toLocaleString();
                } else {
                  subscribers = "[unknown]";
                }

               // Find target element and append

                const div = document.createElement('div');
                div.textContent = subscribers + ' subscribers';
                // this renders properly on new reddit and is not used on old reddit
                div.classList.add('flex', 'items-center', 'text-neutral-content-weak', 'w-max');

                // class="hover redditname" for old reddit, slot="community-details" for new reddit
                const target = document.querySelector('h1[class="hover redditname"], [slot="community-details"] rpl-tooltip:last-child');
                if (target) {
                    target.after(div);
                } else {
                    console.warn('Target element not found, appending to body');
                    document.body.appendChild(div);
                }

            } catch (error) {
                console.error('Failed to parse stats:', error);
            }
        },
        onerror: function() {
            console.error('Failed to fetch stats');
        }
    });
})();