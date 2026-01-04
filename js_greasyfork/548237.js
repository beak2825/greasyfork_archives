// ==UserScript==
// @name         Mobile01 免登入
// @namespace    http://tampermonkey.net/
// @version      2025-08-14
// @description  fk login check
// @author       HY chen
// @match        *://www.mobile01.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobile01.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548237/Mobile01%20%E5%85%8D%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/548237/Mobile01%20%E5%85%8D%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let refreshInterval = setInterval(() => {
        if (typeof window.check_login === 'function') {
            // 鎖定覆寫，避免被還原
            Object.defineProperty(window, "check_login", {
                value: function(target_link) {
                    location.href = target_link;
                },
                writable: false,
                configurable: false
            });

            console.log("[Tampermonkey] check_login 已覆寫成功");
            clearInterval(refreshInterval);
        }
    }, 500);
})();
