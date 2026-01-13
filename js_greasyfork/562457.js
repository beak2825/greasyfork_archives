// ==UserScript==
// @name         虫虫钢琴简谱跳转拦截
// @namespace    TesterNaN.github.io
// @version      1.0
// @description  在getOpernDetail响应中添加play_json: true以阻止跳转
// @author       TesterNaN
// @license      GPLv3
// @match        *://*.gangqinpu.com/*
// @icon         https://www.gangqinpu.com/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562457/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E7%AE%80%E8%B0%B1%E8%B7%B3%E8%BD%AC%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/562457/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E7%AE%80%E8%B0%B1%E8%B7%B3%E8%BD%AC%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待jQuery加载
    function waitForjQuery(callback) {
        if (window.jQuery) {
            callback();
        } else {
            setTimeout(() => waitForjQuery(callback), 100);
        }
    }

    // 拦截并修改响应
    function hookAjaxResponse() {
        const originalAjax = jQuery.ajax;

        jQuery.ajax = function(settings) {
            if (settings.url && settings.url.includes('/home/user/getOpernDetail')) {
                console.log('拦截到getOpernDetail请求');

                const originalSuccess = settings.success;

                settings.success = function(res) {

                    if (res && res.returnCode === '0000' && res.list) {
                        if (typeof res.list === 'object') {
                            res.list.play_json = true;
                            console.log('请求注入成功');
                        }
                    }

                    if (originalSuccess) {
                        return originalSuccess.apply(this, arguments);
                    }
                };
            }
            return originalAjax.call(this, settings);
        };
    }
    waitForjQuery(hookAjaxResponse);
})();