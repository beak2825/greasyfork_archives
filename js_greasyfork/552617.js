// ==UserScript==
// @name linux.do - 去除用户头衔特效
// @namespace https://github.com/utags
// @version 1.0.0
// @description 去除用户头衔特效，太晃眼了
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/552617/linuxdo%20-%20%E5%8E%BB%E9%99%A4%E7%94%A8%E6%88%B7%E5%A4%B4%E8%A1%94%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552617/linuxdo%20-%20%E5%8E%BB%E9%99%A4%E7%94%A8%E6%88%B7%E5%A4%B4%E8%A1%94%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
let css = `
    .user-title {
        filter: none !important;
        background: none !important;
        animation: none !important;
        -webkit-text-fill-color: unset !important;
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
