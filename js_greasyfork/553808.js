// ==UserScript==
// @name         一键复制腾讯文档外链跳转链接
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  一键复制腾讯文档外链跳转链接...
// @author       imzhi <yxz_blue@126.com>
// @match        https://docs.qq.com/scenario/link.html?url=*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553808/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/553808/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('@charset utf-8;#imzhi_button { font-size: 22px; }');

    function imzhi_copy() {
        const href = $('.url-src.url-click').text()
        return href
    }
    setTimeout(() => {
        $('.pcm-download').before(`<div><button id="imzhi_button">一键复制</button></div>`)
        $('#imzhi_button').attr('data-clipboard-text', imzhi_copy());
        new ClipboardJS('#imzhi_button');
    }, 1000)
})();