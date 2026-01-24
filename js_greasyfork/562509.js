// ==UserScript==
// @name Youtube Search Grid Layout
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Show youtube search results in a grid layout
// @author cicero.elead.apollonius@gmail.com
// @license GPL
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https://www\.youtube\.com/results\?search_query=.*$)$/
// @downloadURL https://update.greasyfork.org/scripts/562509/Youtube%20Search%20Grid%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/562509/Youtube%20Search%20Grid%20Layout.meta.js
// ==/UserScript==

(function() {
let css = `
  /* === ONLY APPLY TO SEARCH RESULTS === */
  ytd-search ytd-item-section-renderer > #contents {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
  }
  /* === STANDARDIZE VIDEO CARD WIDTH IN SEARCH === */
  ytd-search ytd-video-renderer,
  ytd-search ytd-playlist-renderer,
  ytd-search ytd-radio-renderer {
    width: 250px !important;
    box-sizing: border-box;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
  }
  /* === VIDEO STRUCTURE === */
  ytd-search ytd-video-renderer #dismissible {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  ytd-search ytd-video-renderer ytd-thumbnail {
    width: 100%;
    aspect-ratio: 16 / 9;
    display: block;
  }
  /* === VIDEO TITLE AND METADATA === */
  ytd-search ytd-video-renderer .text-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 8px;
    overflow: visible;
  }
  ytd-search ytd-video-renderer h3 {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: white;
    overflow: visible;
    white-space: normal;
    line-height: 1.4em;
  }
  ytd-search ytd-video-renderer .metadata-line {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 12px;
    color: #aaa;
  }
  /* === CHANNEL INFO === */
  ytd-search ytd-video-renderer #channel-info {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }
  /* === REMOVE NON-VIDEO ELEMENTS IN SEARCH === */
  ytd-search ytd-shelf-renderer,
  ytd-search ytd-ad-slot-renderer,
  ytd-search ytd-horizontal-card-list-renderer,
  ytd-search ytd-promoted-sparkles-web-renderer,
  ytd-search ytd-search-pyv-renderer,
  ytd-search ytd-display-ad-renderer,
  ytd-search ytd-video-masthead-ad-advertiser-info-renderer,
  ytd-search ytd-rich-section-renderer,
  ytd-search ytd-reel-shelf-renderer,
  ytd-search ytd-channel-renderer,
  ytd-search yt-did-you-mean-renderer,
  ytd-search ytd-secondary-search-container-renderer,
  ytd-search yt-lockup-view-model,
  ytd-search skip-key-interaction,
  ytd-search #expandable-metadata {
    display: none !important;
    margin: 0 !important;
    padding: 0 !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
  }
  /* === FIX PLAYLIST STYLES === */
  ytd-search #content.ytd-playlist-renderer {
    overflow: visible !important;
  }
  /* === MAX WIDTH FULL IN SEARCH === */
  ytd-search ytd-two-column-search-results-renderer,
  ytd-search #primary.style-scope.ytd-two-column-search-results-renderer {
    max-width: none !important;
  }
  /* === ENSURE CARD WIDTHS CONSISTENT IN SEARCH === */
  ytd-search #dismissible > div {
    width: 250px;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
