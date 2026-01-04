// ==UserScript==
// @name         Peacock - Improved Overlay
// @namespace    userstyles.world/user/ariackonrel
// @version      1.0
// @description  Improves the video overlay on Peacock
// @author       ariackonrel
// @match        *://*.peacocktv.com/*
// @license      No License
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/548782/Peacock%20-%20Improved%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/548782/Peacock%20-%20Improved%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.playback-overlay__container,
.playback-rating-overlay__container,
.playback-header__container {
  background: none !important;
}

.playback-header__container,
.playback-overlay__container-upper-controls,
.playback-controls__container {
  transform: scale(0.75) !important;
}

.playback-metadata__container-title {
  font-size: 2rem !important;
}

.playback-metadata__container {
  margin-bottom: 0 !important;
}
    `);
})();
