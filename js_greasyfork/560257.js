// ==UserScript==
// @name Element - Hide Date Separators
// @namespace github.com/openstyles/stylus
// @version 0.1.0
// @description Hides the date separator lines (e.g. "Thu, Dec 25, 2025") in Element chat timelines
// @author anonymous
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.app.element.io/*
// @match *://*.element.io/*
// @downloadURL https://update.greasyfork.org/scripts/560257/Element%20-%20Hide%20Date%20Separators.user.js
// @updateURL https://update.greasyfork.org/scripts/560257/Element%20-%20Hide%20Date%20Separators.meta.js
// ==/UserScript==

(function() {
let css = `
    .mx_TimelineSeparator {
        display: none !important;
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
