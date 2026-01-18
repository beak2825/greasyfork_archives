// ==UserScript==
// @name         Bing 颜色修复
// @namespace    http://tampermonkey.net/
// @version      2026-01-14
// @description  修复 Bing 链接和红色高亮的颜色
// @author       Ganlv
// @match        https://bing.com/*
// @match        https://www.bing.com/*
// @match        https://www4.bing.com/*
// @match        https://cn.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563113/Bing%20%E9%A2%9C%E8%89%B2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/563113/Bing%20%E9%A2%9C%E8%89%B2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
* {
    --smtc-ctrl-link-foreground-brand-rest: #1a0dab;
    --bing-smtc-ctrl-link-foreground-brand-alt-visited: #681da8;
    --bing-smtc-data-foreground-red-strong: #cc0000;
}
#b_results>li.b_algo h2:not(.sa_uc h2) a:visited {
    color: var(--bing-smtc-ctrl-link-foreground-brand-alt-visited);
}
    `);
})();