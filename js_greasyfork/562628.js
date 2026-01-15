// ==UserScript==
// @name Autoscroll Fix
// @namespace substack.com
// @version 1.0.0
// @description Allows middle click to scroll function to work in Notes feed.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.substack.com/*
// @downloadURL https://update.greasyfork.org/scripts/562628/Autoscroll%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562628/Autoscroll%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
  body, html {
    overflow-x: unset;
    overflow-y: unset;
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
