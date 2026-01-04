// ==UserScript==
// @name        mastodon css
// @description a
// @match       https://mastodon.social/*
// @run-at      document-end
// @version 0.0.1.20251123104905
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/555185/mastodon%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/555185/mastodon%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
.translatedText {
//color: red !important;
}

article:has(a.status-card > div.status-card__image) {
display: none !important;
}

.media-gallery, .video-player {
aspect-ratio: unset !important;
}

  img, video {
    //max-width: 100px !important;
    max-height: 100px !important;
    object-fit: contain !important;
}

.zoomable-image img, .gifv video {
max-width: 100% !important;
    max-height: 80% !important;
}

.fullscreen video {
max-height: unset !important
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();