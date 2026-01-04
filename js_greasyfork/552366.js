// ==UserScript==
// @name 网易云音乐移动版
// @namespace github.com/Labolasya
// @version 2025.10.12.04
// @description 测试版本
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.music.163.com/*
// @downloadURL https://update.greasyfork.org/scripts/552366/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%A7%BB%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552366/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%A7%BB%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
let css = `
html,
body {
    -webkit-text-size-adjust: 100%;
}

body,
div {
    min-width: initial !important;
}
/* nav */
#g-topbar {
    width: 100% !important;
    a {
        padding: 4px;
    }
    a[href="https://music.163.com/st/ad-song"] {
        display: none;
    }
}
.logo {
    display: none;
}
#g_search {
    float: left;
}
#topbar-download-link {
    display: none;
    /*隐藏下载*/
}
/* 中间 */
#g_mymusic > div > div {
    width: 100% !important;
    position: initial;
}

/* 下面 */
body > .g-btmbar {
    width: 100%;
    max-width: 100%;
}
#g_player {
    margin: 0 !important;
    padding: 0 !important;
    left: 0;
}
body > .g-btmbar > div[style] {
    top: -53px !important;
    * {
        min-width: 0 !important;
    }
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
