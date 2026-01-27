// ==UserScript==
// @name         OA显示加班脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  dog dog
// @author       nndc
// @match        http://oa.en-plus.com.cn:8090/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=en-plus.com.cn
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564068/OA%E6%98%BE%E7%A4%BA%E5%8A%A0%E7%8F%AD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/564068/OA%E6%98%BE%E7%A4%BA%E5%8A%A0%E7%8F%AD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForEcodeSDK() {

        // 等待页面加载完成后执行
        window.addEventListener('load', function () {
            // 完全覆盖 getAllowableDateRange 函数
            window.getAllowableDateRange = function () {
                console.log('日期限制已解除');

                // 返回一个极大的日期范围（比如1900-2100年）
                return {
                    startDate: new Date(1900, 0, 1),
                    endDate: new Date(2100, 11, 31)
                };
            };

            // 如果有 ModeForm.controlDateRange 函数，也重写它
            if (window.ModeForm && window.ModeForm.controlDateRange) {
                const originalControlDateRange = window.ModeForm.controlDateRange;
                window.ModeForm.controlDateRange = function (fieldId, startDate, endDate) {
                    console.log(`绕过字段 ${fieldId} 的日期限制`);
                };
            }
        });



        if (window.ecodeSDK && typeof window.ecodeSDK === 'object') {
            try {
                Object.defineProperty(window.ecodeSDK, 'rewriteApiDataQueue', {
                    configurable: true,
                    enumerable: true,
                    get() {
                        console.log('🔍 window.ecodeSDK.rewriteApiDataQueue 被访问');
                        return window.ecodeSDK; // 如果有原值，可以改成返回原值或替换
                    },
                    set(value) {
                        console.log('🔍 window.ecodeSDK.rewriteApiDataQueue 被修改为:', value);
                        this._rewriteApiDataQueue = value; // 存储赋值
                    }
                });


                console.log('OA显示加班脚本已加载并劫持rewriteApiDataQueue');
            } catch (e) {
                console.error('劫持rewriteApiDataQueue失败:', e);
            }
        } else {
            setTimeout(waitForEcodeSDK, 50);
        }
    }



    waitForEcodeSDK();

    waitForDateRange();

})();
