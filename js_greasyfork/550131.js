// ==UserScript==
// @name         拼多多商家后台网页端优化
// @namespace    http://tampermonkey.net/
// @version      2025-08-01
// @description  优化拼多多商家版网页发货体验
// @author       HCskia
//
// @match        https://mms.pinduoduo.com/logistics/home?*
// @match        https://mms.pinduoduo.com/logistics/home
//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550131/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/550131/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E7%BD%91%E9%A1%B5%E7%AB%AF%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoInsertPddProblem8(){
        console.log("尝试执行脚本中");
        let input1 = document.querySelector('input[placeholder="请输入"]');
        input1.focus();
        document.execCommand('inserttext',false,'其他');
        input1.blur();

        let elements = document.querySelectorAll('input[placeholder="请选择"]');
        elements.forEach(element => {
            if (element.getAttribute('value')!="发货中心不能使用拼面单发货") {
                console.log(element);
                let inputT = element;
                inputT.focus();
                document.execCommand('inserttext',false,'中通快运');
                inputT.blur();
            }
        });

        let input2 = document.querySelector('textarea[placeholder="请输入问题描述(10~500字)"]');
        input2.focus();
        document.execCommand('inserttext',false,'无需打单，厂家已经进行打单。');
        input2.blur();

        let input3 = document.querySelector('input[placeholder="请输入11位手机号或座机号码"]');
        input3.focus();
        document.execCommand('inserttext',false,'18382818382');
        input3.blur();

        let input4 = document.querySelector('input[placeholder="请输入QQ号"]');
        input4.focus();
        document.execCommand('inserttext',false,'132818382818');
        input4.blur();
    }

    function initScript(){
        setTimeout(() => {
            autoInsertPddProblem8();
        }, 2500);
    }

    window.onload = function() {
        console.log("页面加载完成，尝试执行脚本");
        requestAnimationFrame(() => {
            initScript();
        });
    };
})();