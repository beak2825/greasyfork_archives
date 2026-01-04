// ==UserScript==
// @name         Hide SoundCloud Visual Ads
// @namespace    https://github.com/ZeyFoxOFF/userscript-soundcloud
// @version      1.0.4
// @description  Hide visual ads for soundcloud
// @author       ZeyFox
// @match        *://soundcloud.com/*
// @icon         https://i.ibb.co/QFQyyK3q/Icon.jpg
// @grant        GM_addStyle
// @homepageURL  https://github.com/ZeyFoxOFF/userscript-soundcloud
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554340/Hide%20SoundCloud%20Visual%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/554340/Hide%20SoundCloud%20Visual%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSS = `
        .creatorSubscriptionsButton {
            display: none !important;
        }
        .header__upsellWrapper {
            display: none !important;
        }
        .mobileApps {
            display: none !important;
        }
        .l-product-banners {
            display: none !important;
        }
        .m-promotion {
            display: none !important;
        }
        .webiEmbeddedModule {
            display: none !important;
        }
        .m-highlight {
            display: none !important;
        }
        .sidebarModule:has(.velvetCakeIframe) {
            display: none !important;
        }
    `;
    GM_addStyle(CSS);
})();
