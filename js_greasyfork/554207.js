// ==UserScript==
// @name linux.do - 添加 timeline 背景色
// @namespace https://github.com/utags
// @version 1.0.0
// @description 添加 timeline 背景色，快速识别，防止误触。
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/554207/linuxdo%20-%20%E6%B7%BB%E5%8A%A0%20timeline%20%E8%83%8C%E6%99%AF%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/554207/linuxdo%20-%20%E6%B7%BB%E5%8A%A0%20timeline%20%E8%83%8C%E6%99%AF%E8%89%B2.meta.js
// ==/UserScript==

(function() {
let css = `
    .timeline-scrollarea-wrapper {
        background-color: aliceblue;
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
