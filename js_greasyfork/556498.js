// ==UserScript==
// @name linux.do - 简化类别页
// @namespace https://github.com/utags
// @version 1.0.0
// @description 简化类别页。
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/556498/linuxdo%20-%20%E7%AE%80%E5%8C%96%E7%B1%BB%E5%88%AB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/556498/linuxdo%20-%20%E7%AE%80%E5%8C%96%E7%B1%BB%E5%88%AB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
let css = `
  section.category-heading,
  #header-list-area {

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
