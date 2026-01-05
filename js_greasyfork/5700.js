// ==UserScript==
// @name         Yun Pan WAP Redirect
// @description  重定向百度云盘的 WAP 页面到普通页面
// @author       wenLiangcan
// @version      0.3
// @namespace    https://github.com/wenLiangcan
// @homepage     https://github.com/wenLiangcan/Userscripts
// @license      GPL version 3 (http://www.gnu.org/licenses/gpl.txt)
// @copyright    Copyright © 2014-2016 wenLiangcan
// @updateURL
// @downloadURL
// @include      http://*
// @include      https://*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5700/Yun%20Pan%20WAP%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/5700/Yun%20Pan%20WAP%20Redirect.meta.js
// ==/UserScript==

(function() {
    if (/^http:\/\/(pan|yun)\.baidu\.com\/wap\/link\?.*?$/.test(document.URL)) {
        window.location.href = document.URL.replace('wap', 'share');
    }
    else if (/^http:\/\/pan\.baidu\.com\/wap\/share\/.*?$/.test(document.URL)) {
        window.location.href = document.URL.replace('wap/', '');
    }
    else if (/^http:\/\/pan\.baidu\.com\/wap\/album\/.*?$/.test(document.URL)) {
        window.location.href = document.URL.replace('wap', 'pcloud');
    }
})();
