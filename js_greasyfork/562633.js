// ==UserScript==
// @name         Youtube 2 columns fix
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Youtube watch page with 1 column videos
// @author       You
// @match        *://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/256/1384/1384060.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562633/Youtube%202%20columns%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562633/Youtube%202%20columns%20fix.meta.js
// ==/UserScript==


(function() {
    'use strict';
let style = document.createElement('style');
let cssOutput = `
ytd-watch-next-secondary-results-renderer * {
grid-template-columns: unset !important;
grid-auto-flow: unset !important;
}
ytd-watch-flexy .ytd-watch-next-secondary-results-renderer {
display: block !important;
}
.style-scope .ytd-watch-flexy #secondary {
width: 400px !important;
max-width: 400px !important;
padding-right: 1ch !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-view-model {
display: flex !important;
flex-direction: row !important;
align-items: flex-start !important;
margin: 0 !important;
padding: 0 !important;
margin-bottom: 8px !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-view-model__content-image {
flex-shrink: 0 !important;
width: 170px !important;
height: auto !important;
padding: 0 !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-view-model--wrapper.lockup {
margin: 0 !important;
margin-bottom: 0 !important;
min-height: 0 !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-view-model--vertical {
padding: 0 !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-view-model--rich-grid-legacy-margin {
margin: 0 !important;
padding: 0 !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-metadata-view-model__text-container {
margin-left: 6px !important;
margin-top: -3px !important;
line-height: normal !important;
max-width: 260px !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-metadata-view-model__menu-button {
margin-top: -2px !important;
}
ytd-watch-flexy #secondary-inner ytd-compact-video-renderer {
display: none !important;
}
ytd-watch-flexy #secondary-inner .yt-content-metadata-view-model__delimiter {
visibility: hidden !important;
margin-left: 2px !important;
}
ytd-watch-flexy #secondary-inner .yt-content-metadata-view-model__delimiter--standalone {
display: none;
}
ytd-watch-flexy #secondary-inner .yt-content-metadata-view-model__metadata-row--metadata-row-wrap {
display: flex;
height: 16px;
}
ytd-watch-flexy #secondary-inner .yt-content-metadata-view-model__badge {
display: flex;
height: 16px;
}
ytd-watch-flexy #secondary-inner .yt-content-metadata-view-model__metadata-row--metadata-row-inline {
display: flex;
}
ytd-watch-flexy #secondary-inner .yt-lockup-view-model--vertical .yt-lockup-view-model__content-image {
padding-bottom: 0 !important;
}
ytd-watch-flexy #secondary-inner .yt-lockup-metadata-view-model__avatar {
display: none;
}
ytd-compact-radio-renderer #dismissible {
flex-direction: row !important;
margin: 0;
height:92px;
}
ytd-compact-radio-renderer #dismissible .modern-collection-parent .ytd-compact-radio-renderer {
width: 170px;
}
ytd-compact-radio-renderer #video-title {
width: 230px;
}
ytd-watch-flexy #secondary-inner .yt-badge-shape__icon {
width: 13px !important;
height:13px !important;
margin-bottom: 1px;
}`;
style.textContent = cssOutput;
document.head.appendChild(style);
})();