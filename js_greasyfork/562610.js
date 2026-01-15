// ==UserScript==
// @name         企业微信链接拦截自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  企业微信自动拦截未知链接时，自动跳转到目标地址
// @author       You
// @run-at       document-start
// @match        *://open.work.weixin.qq.com/wwopen/uriconfirm*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/562610/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562610/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E9%93%BE%E6%8E%A5%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getQueryVariable(variable)
    {
        var url = new URL(location.href);
        var query = url.searchParams.toString();
        var vars = query.split("&");
        for (var i = 0; i < vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable) {
                return pair[1];
            }
        }
        return null;
    }

    var url = decodeURIComponent(getQueryVariable("uri"));
    var urllowercase = url.toLowerCase();
    if (urllowercase.startsWith("http://") || urllowercase.startsWith("https://") || urllowercase.startsWith("ftp://") || urllowercase.startsWith("ftps://")) {
        // no thing
    } else {
        url = "http://" + url;
    }

    unsafeWindow.location.replace(url);
})();