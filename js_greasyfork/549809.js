// ==UserScript==
// @name 乾淨的YouTube 影片結尾
// @namespace https://github.com/Max46656
// @version 2.0.0
// @description 把其他推薦影片、創作者資訊與更多有的沒的改成透明，直到你將滑鼠指向該區域
// @author Max
// @supportURL https://github.com/Max46656/EverythingInGreasyFork/issues
// @license MPL2.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/549809/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20%E5%BD%B1%E7%89%87%E7%B5%90%E5%B0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/549809/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20%E5%BD%B1%E7%89%87%E7%B5%90%E5%B0%BE.meta.js
// ==/UserScript==

(function() {
let css = `
    :root {
        --default-opacity: 0;   /* 預設透明度 */
        --hover-opacity: 0.8;   /* 滑鼠懸停時的透明度 */
    }
 
    ytd-reel-player-overlay-renderer .metadata-container.style-scope {
        opacity: var(--default-opacity) !important;
        transition: opacity 0.3s ease !important;
    }
 
    ytd-reel-player-overlay-renderer .metadata-container.style-scope:hover {
        opacity: var(--hover-opacity) !important;
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
