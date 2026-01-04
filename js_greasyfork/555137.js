// ==UserScript==
// @name         Microsoft Bing 国内版重定向至国际版
// @version      1.0
// @description  将 cn.bing.com 重定向至 www.bing.com
// @author       信标beta
// @match        *://cn.bing.com/*
// @icon         https://i0.hdslb.com/bfs/new_dyn/102262cfa11668bb1367fd4fd6a374fd1640301561.png
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1407995
// @downloadURL https://update.greasyfork.org/scripts/555137/Microsoft%20Bing%20%E5%9B%BD%E5%86%85%E7%89%88%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3%E5%9B%BD%E9%99%85%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/555137/Microsoft%20Bing%20%E5%9B%BD%E5%86%85%E7%89%88%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3%E5%9B%BD%E9%99%85%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirectFlag = 'bing_redirect_performed';

    if (sessionStorage.getItem(redirectFlag)) {
        return;
    }

    const currentUrl = new URL(window.location.href);

    if (currentUrl.hostname === 'cn.bing.com') {
        currentUrl.hostname = 'www.bing.com';

        const newUrl = currentUrl.href;

        sessionStorage.setItem(redirectFlag, 'true');

        window.location.replace(newUrl);
    }
})();