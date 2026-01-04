// ==UserScript==
// @name         中国网信办www.12377.cn自动同意并跳转nmjb.html
// @namespace    http://www.12377.cn/
// @version      1.1
// @description  移除5秒限制，自动勾选同意，并默认跳转到匿名举报
// @author       Dahi
// @match        https://www.12377.cn/jbxzxq/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551316/%E4%B8%AD%E5%9B%BD%E7%BD%91%E4%BF%A1%E5%8A%9Ewww12377cn%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E5%B9%B6%E8%B7%B3%E8%BD%ACnmjbhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/551316/%E4%B8%AD%E5%9B%BD%E7%BD%91%E4%BF%A1%E5%8A%9Ewww12377cn%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%E5%B9%B6%E8%B7%B3%E8%BD%ACnmjbhtml.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 启用同意按钮并自动操作
    function autoAgreeAndRedirect() {
        const agreeBtn = document.getElementById('agree');
        const disagreeBtn = document.getElementById('disagree');
        const iseeCheckbox = document.getElementById('isee');
        
        // 1. 立即启用同意按钮
        if (agreeBtn) {
            agreeBtn.removeAttribute('disabled');
            agreeBtn.classList.remove('grey');
            agreeBtn.style.pointerEvents = 'auto';
            agreeBtn.style.opacity = '1';
        }
        
        // 2. 自动勾选同意复选框
        if (iseeCheckbox) {
            iseeCheckbox.checked = true;
            console.log('已自动勾选同意复选框');
        }
        
        // 3. 修改Agree函数，默认跳转到nmjb.html
        if (window.Agree) {
            const originalAgree = window.Agree;
            window.Agree = function() {
                if ($("#isee").is(':checked')) {
                    // 修改跳转地址为nmjb.html
                    window.location.href = "/jbxzxq/jbxx/nmjb/nmjb.html";
                } else {
                    alert('请阅读举报须知');
                }
            };
            console.log('已修改Agree函数跳转地址');
        }
        
        // 4. 可选：自动点击同意按钮（如果需要）
        // setTimeout(() => {
        //     if (agreeBtn) {
        //         agreeBtn.click();
        //         console.log('已自动点击同意按钮');
        //     }
        // }, 1000);
        
        console.log('已启用同意按钮并设置自动跳转');
    }

    // 重写setdisagreestate函数，确保同意按钮保持primary样式
    function overrideSetDisagreeState() {
        if (window.setdisagreestate) {
            const originalSetDisagreeState = window.setdisagreestate;
            window.setdisagreestate = function(obj) {
                // 调用原函数
                originalSetDisagreeState.apply(this, arguments);
                
                // 确保同意按钮保持primary样式
                if (obj == 2) {
                    const agreeBtn = document.getElementById('agree');
                    if (agreeBtn) {
                        agreeBtn.className = "btn primary";
                    }
                }
            };
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            autoAgreeAndRedirect();
            overrideSetDisagreeState();
        });
    } else {
        autoAgreeAndRedirect();
        overrideSetDisagreeState();
    }

    // 监听DOM变化，防止动态加载
    new MutationObserver(function() {
        setTimeout(autoAgreeAndRedirect, 100);
    }).observe(document.body, {
        childList: true,
        subtree: true
    });

    // 如果页面使用jQuery，也监听jQuery的ready事件
    if (window.jQuery) {
        $(document).ready(function() {
            setTimeout(autoAgreeAndRedirect, 200);
        });
    }
})();