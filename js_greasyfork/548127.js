// ==UserScript==
// @name uKvAc - Avatar - Transparent Background
// @namespace eliotcole Scripts
// @version 1.0
// @description This removes the xenforo php enacted style which colours the background of the avatar image to the same as the block-container class for a given theme
// @author eliotcole
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.ukvac.com/*
// @downloadURL https://update.greasyfork.org/scripts/548127/uKvAc%20-%20Avatar%20-%20Transparent%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/548127/uKvAc%20-%20Avatar%20-%20Transparent%20Background.meta.js
// ==/UserScript==

(function() {
let css = `
  .avatar img {
    background-color: transparent !important;
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
