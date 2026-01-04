// ==UserScript==
// @name         腾讯PC端安全中心自动跳转
// @namespace    https://github.com/geeki-wonchong/fuckqq
// @version      0.1.0
// @description  自动跳过腾讯电脑管家安全中心页面，直接跳转到原始链接
// @author       geek-wonchong
// @match        http*://c.pc.qq.com/ios.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549040/%E8%85%BE%E8%AE%AFPC%E7%AB%AF%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/549040/%E8%85%BE%E8%AE%AFPC%E7%AB%AF%E5%AE%89%E5%85%A8%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let urlParam = new URLSearchParams(window.location.search);
    let originalUrl = urlParam.get('url');

    if (originalUrl) {
        window.location.replace(originalUrl);
    }
})();