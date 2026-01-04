// ==UserScript==
// @name linux.do - 自定义 timeline 宽度
// @namespace https://github.com/utags
// @version 1.0.0
// @description 自定义 timeline 宽度。
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @downloadURL https://update.greasyfork.org/scripts/554209/linuxdo%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%20timeline%20%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/554209/linuxdo%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%20timeline%20%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
let css = `
.timeline-scrollarea-wrapper {
        max-width: 150px !important;
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
