// ==UserScript==
// @name         Redgifs Fullscreen CSS de-enshitification
// @namespace    https://greasyfork.org/users/1197672
// @version      1.1
// @description  Fix Redgifs fullscreen after Oct 2025 enshitification / "redesign"
// @author       frak808
// @match        https://www.redgifs.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554826/Redgifs%20Fullscreen%20CSS%20de-enshitification.user.js
// @updateURL https://update.greasyfork.org/scripts/554826/Redgifs%20Fullscreen%20CSS%20de-enshitification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`

        /* Fix fullscreen to work again */
        #root .fullScreen .previewFeed {
            top: 0 !important;
            height: 100vh !important;
        }

        /* Fix fullscreen to work again */
        #root .fullScreen .previewFeed .GifPreview.GifPreview_isActive {
            max-width: unset !important;
            width: 100% !important;
            max-height: 100vh !important;
        }

        /* Fix fullscreen to work again - fix pause before video fullscreens on scroll */
        #root .fullScreen .GifPreview {
          max-height: 100vh !important;
        }

        /* Hide full screen nav bar ie (x) (↑) (↓) */
        #root .fullScreenNav {
         display: none !important;
         height: 420px;
        }

        /* Hide suggested niches */
        #root .gifNiches {
          display: none !important;
        }

        /* Hide Suggested Creators/Suggested Niches */
        #root .desktop .FeedModule {
          display: none !important;
        }

        /* Hide Description */
        #root .description {
          display: none !important;
        }

        /* Hide suggested Niches in between videos */
        #root .injection {
           display: none !important;
        }

        /* Hide RedCams Previews/Click to Chat */
        #root .GifPreview.VisibleOnly {
          display: none !important;
        }

    `);

})();
