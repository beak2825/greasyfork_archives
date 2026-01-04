// ==UserScript==
// @name         内蒙电子学院强制显示账号密码登录选项
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强制显示统一身份认证平台的账号密码登录选项（li_4）
// @author       aiyumo
// @match        http://cas.imeic.cn/*
// @match        https://cas.imeic.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551949/%E5%86%85%E8%92%99%E7%94%B5%E5%AD%90%E5%AD%A6%E9%99%A2%E5%BC%BA%E5%88%B6%E6%98%BE%E7%A4%BA%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/551949/%E5%86%85%E8%92%99%E7%94%B5%E5%AD%90%E5%AD%A6%E9%99%A2%E5%BC%BA%E5%88%B6%E6%98%BE%E7%A4%BA%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方法1：直接显示 li_4（账号登录选项）
    function showAccountLogin() {
        const li4 = document.getElementById('li_4');
        if (li4) {
            li4.style.display = 'inline-block';
            console.log('已显示账号登录选项（li_4）');
        } else {
            console.error('未找到 li_4 元素！');
        }
    }

    // 方法2：切换到账号登录界面（list_4）
    function switchToAccountLogin() {
        const li4 = document.getElementById('li_4');
        if (li4) {
            li4.style.display = 'inline-block';
            li4.click(); // 尝试点击
            console.log('已切换到账号登录界面');
        } else {
            console.error('无法切换到账号登录界面，li_4 未找到！');
        }
    }

    // 方法3：使用 MutationObserver 监听动态加载
    function observeAndShowAccountLogin() {
        const observer = new MutationObserver(function(mutations) {
            const li4 = document.getElementById('li_4');
            if (li4) {
                li4.style.display = 'inline-block';
                li4.click();
                observer.disconnect(); // 停止监听
                console.log('动态加载后已显示账号登录选项');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 执行策略：
    // 1. 先尝试直接显示 li_4
    showAccountLogin();

    // 2. 如果 li_4 存在但点击无效，尝试直接显示 list_4
    setTimeout(() => {
        const list4 = document.getElementById('list_4');
        if (list4 && list4.style.display === 'none') {
            list4.style.display = 'block';
            console.log('已直接显示账号登录表单（list_4）');
        }
    }, 500);

    // 3. 如果页面是动态加载的，启动 MutationObserver
    setTimeout(() => {
        if (!document.getElementById('li_4')) {
            observeAndShowAccountLogin();
            console.log('正在监听动态加载的 li_4...');
        }
    }, 1000);
})();