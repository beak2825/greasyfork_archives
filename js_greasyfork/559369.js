// ==UserScript==
// @name               Wikipedia wuu/zh-yue domain redirect
// @name:zh-CN         Wikipedia 吴语/粤语域名重定向
// @namespace          Wikipedia-redirect
// @version            2025.12.18
// @description        Automatically redirect Wikipedia wuu/zh-yue domains to zh
// @description:zh-CN  自动重定向 Wikipedia 吴语/粤语域名到中文
// @author             Amelia
// @license            MIT
// @run-at             document-start
// @match              *://wuu.wikipedia.org/*
// @match              *://zh-yue.wikipedia.org/*
// @icon               https://zh.wikipedia.org/static/favicon/wikipedia.ico
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/559369/Wikipedia%20wuuzh-yue%20domain%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/559369/Wikipedia%20wuuzh-yue%20domain%20redirect.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    if (location.hostname != "zh.wikipedia.org") {
        window.location.hostname = "zh.wikipedia.org";
    }
})();