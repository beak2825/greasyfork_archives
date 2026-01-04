// ==UserScript==
// @name         Remove tn param
// @name:zh-CN   移除百度链接中的 tn 参数
// @version      1.0
// @description  Remove the 'tn' parameter from Baidu search result URLs to prevent tracking or redirect issues.
// @description:zh-CN 移除百度搜索结果链接中的 'tn' 参数，防止跟踪或跳转问题。
// @author       Torry
// @match        *://www.baidu.com/*
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1524095
// @downloadURL https://update.greasyfork.org/scripts/551969/Remove%20tn%20param.user.js
// @updateURL https://update.greasyfork.org/scripts/551969/Remove%20tn%20param.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.search.includes('tn=')) {
        const newUrl = new URL(location.href);
        newUrl.searchParams.delete('tn');
        location.replace(newUrl.toString());
    }
})();