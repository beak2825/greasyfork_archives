// ==UserScript==
// @name linux.do - 隐藏用户头衔
// @namespace https://github.com/utags
// @version 1.0.3
// @description 隐藏用户头衔，太晃眼了
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/552610/linuxdo%20-%20%E9%9A%90%E8%97%8F%E7%94%A8%E6%88%B7%E5%A4%B4%E8%A1%94.user.js
// @updateURL https://update.greasyfork.org/scripts/552610/linuxdo%20-%20%E9%9A%90%E8%97%8F%E7%94%A8%E6%88%B7%E5%A4%B4%E8%A1%94.meta.js
// ==/UserScript==

(function() {
let css = `
    .user-title {
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
