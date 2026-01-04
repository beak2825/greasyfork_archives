// ==UserScript==
// @name         e621 布局补丁（手机专用）
// @namespace    Lecrp.com
// @version      1.5
// @description  手机版图片放大脚本的补丁，对投票收藏按钮行进行优化
// @author       jcjyids
// @match        https://e621.net/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e621.net
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554520/e621%20%E5%B8%83%E5%B1%80%E8%A1%A5%E4%B8%81%EF%BC%88%E6%89%8B%E6%9C%BA%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554520/e621%20%E5%B8%83%E5%B1%80%E8%A1%A5%E4%B8%81%EF%BC%88%E6%89%8B%E6%9C%BA%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        #ptbr-wrapper {
            margin-inline: 10px;
        }
        #ptbr-wrapper .ptbr-resize {
            display: flex;
            flex: auto;
            width: 52px;
            max-width: max-content;
        }
        #image-resize-selector {
            max-width: 100% !important;
        }
        .ptbr-vote-button, .ptbr-vote-button {
            padding: 5px;
            width: 26px;
        }
        .ptbr-score {
            width: 60px;
        }
        .ptbr-favorite-button, .ptbr-favorite-button, .upscale-toggle-btn, .ptbr-etc-toggle {
            width: 40px;
            padding: 0px;
        }
        .st-button {
            align-items: center !important;
        }
    `);
})();