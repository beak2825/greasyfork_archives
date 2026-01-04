// ==UserScript==
// @name ListenBrainz: Center lengths and clip titles
// @namespace https://musicbrainz.org/user/chaban
// @version 1.0.0
// @description Moves track lengths to the center of the cards and clips titles instead of wrapping
// @author chaban
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.listenbrainz.org/*
// @match *://*.beta.listenbrainz.org/*
// @match *://*.test.listenbrainz.org/*
// @downloadURL https://update.greasyfork.org/scripts/560350/ListenBrainz%3A%20Center%20lengths%20and%20clip%20titles.user.js
// @updateURL https://update.greasyfork.org/scripts/560350/ListenBrainz%3A%20Center%20lengths%20and%20clip%20titles.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Move track lengths to the center of listen cards */
    .listen-card .main-content .title-duration > [title="Duration"] {
        margin-left: auto;
        padding-left: .5rem;
    }

    /* Clip track titles instead of wrapping in listen cards */
    .ellipsis-2-lines {
        -webkit-line-clamp: 1;
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
