// ==UserScript==
// @name         Youtube 2 rows fix
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Youtube watch page with 1 row videos
// @author       You
// @match        *://www.youtube.com/watch*
// @icon         https://cdn-icons-png.flaticon.com/256/1384/1384060.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562633/Youtube%202%20rows%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562633/Youtube%202%20rows%20fix.meta.js
// ==/UserScript==


(function() {
    'use strict';
let style = document.createElement('style');
let cssOutput = `
ytd-watch-next-secondary-results-renderer {
  display: block !important;
}

ytd-watch-next-secondary-results-renderer * {
    grid-template-columns: unset !important;
    grid-auto-flow: unset !important;
}

#secondary {
  width: 375px !important;
  max-width: 400px !important;
}

ytd-watch-flexy #secondary .yt-lockup-view-model {
    display:flex !important;
    flex-direction:row !important;
    align-items:flex-start !important;
    margin:0 !important;
    padding:0 !important;
    margin-bottom:3px !important;
}

ytd-watch-flexy #secondary .yt-lockup-view-model__content-image {
    flex-shrink:0 !important;
    width:170px !important;
    height:auto !important;
    border-radius:4px !important;
}

ytd-watch-flexy #secondary .yt-lockup-view-model--wrapper.lockup {
    margin:0 !important;
    padding:0 !important;
    min-height:0 !important;
}

ytd-watch-flexy #secondary .yt-lockup-view-model--vertical {
    margin:0 !important;
    padding:0 !important;
}

ytd-watch-flexy #secondary .yt-lockup-view-model--rich-grid-legacy-margin {
    margin:2 !important;
    padding:0 !important;
}

ytd-watch-flexy #secondary .yt-lockup-metadata-view-model__text-container {
    margin-left:8px !important;
    margin-top:-2px !important;
    font-size:12px !important;
    line-height:17px !important;
    max-width:260px !important;
}

ytd-watch-flexy #secondary .ytd-compact-video-renderer {
display: none !important;
visibility: hidden !important;
}

ytd-watch-flexy #secondary .yt-content-metadata-view-model__delimiter {
visibility: hidden !important;
margin:2px !important;
}

ytd-watch-flexy #secondary .yt-content-metadata-view-model__delimiter--standalone {
display: none;
}

ytd-watch-flexy #secondary .yt-content-metadata-view-model__metadata-row--metadata-row-wrap {
display: flex;
}
`;

style.textContent = cssOutput;
document.head.appendChild(style);
})();