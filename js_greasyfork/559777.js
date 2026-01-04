// ==UserScript==
// @name         屏蔽漫蛙广告拦截检测弹窗
// @version      1.0
// @description  拦截特定alert弹窗
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/559777/%E5%B1%8F%E8%94%BD%E6%BC%AB%E8%9B%99%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%A3%80%E6%B5%8B%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/559777/%E5%B1%8F%E8%94%BD%E6%BC%AB%E8%9B%99%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E6%A3%80%E6%B5%8B%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const nativeAlert = window.alert;
    
    window.alert = function(msg) {
        // 如果包含广告拦截相关文字，则静默拦截
        if (typeof msg === 'string' && msg.includes('请关闭阻挡广告插件并使用官方推荐浏览器 Chrome , Edge , Safari')) {
            console.log('拦截了广告检测弹窗');
            return;
        }
        // 否则正常显示
        return nativeAlert(msg);
    };
})();