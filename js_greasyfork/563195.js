// ==UserScript==
// @name Shimmer All Text
// @namespace greasyfork.org
// @version 1.0
// @description Makes all text on page shimmer. Why did I do this? I have no idea.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/563195/Shimmer%20All%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/563195/Shimmer%20All%20Text.meta.js
// ==/UserScript==

(function() {
let css = `* {
  background: linear-gradient(90deg, red, orange, yellow, green, blue, purple);
  background-size: 400%;
  -webkit-background-clip: text;
  color: transparent !important;
  animation: shine 6s linear infinite;
}

@keyframes shine {
  to { background-position: 400% 0; }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
