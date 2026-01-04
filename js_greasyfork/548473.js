// ==UserScript==
// @name Hide reblogs
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Hides reblogs from tumblr profile
// @author rlego
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.tumblr.com/*
// @downloadURL https://update.greasyfork.org/scripts/548473/Hide%20reblogs.user.js
// @updateURL https://update.greasyfork.org/scripts/548473/Hide%20reblogs.meta.js
// ==/UserScript==

(function() {
let css = `
    .So6RQ.YSitt:has(.x66yu .Fuxs_:not(:empty)) {
    display:none
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
