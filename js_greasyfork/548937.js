// ==UserScript==
// @name         哆啦新番社页面精简
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于哆啦新番社的简易页面美化、精简脚本
// @author       Pixcat
// @match        *://*.dora-video.cn/*
// @match        *://dora.xiaoxinbk.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548937/%E5%93%86%E5%95%A6%E6%96%B0%E7%95%AA%E7%A4%BE%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/548937/%E5%93%86%E5%95%A6%E6%96%B0%E7%95%AA%E7%A4%BE%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏公告，避免重复显示
    localStorage.setItem("announcement_shown_" + new Date().toDateString(), "true");

    // 等待页面加载完成后执行美化和精简操作
    window.addEventListener('load', function() {
        // 选择页面元素并执行隐藏操作
        var ulMenus = document.querySelectorAll('ul');
        var forms = document.getElementsByTagName("form");
        var elements = document.querySelectorAll('.carousel-inner, .lunbo, .carousel-indicators, .youlink, #comments');
        var cards = document.querySelectorAll('.card');

        // 隐藏包含“登录”文本的菜单项
        hideElementsWithText(ulMenus, '登录');
        // 隐藏所有POST方法的表单
        hideFormsByMethod(forms, 'post');
        // 隐藏特定的页面元素，如轮播图、评论区等
        hideElements(elements);
        // 隐藏包含“红包”文本的卡片
        hideElementsWithText(cards, '红包');
    });

    // 定义隐藏包含特定文本的元素的函数
    function hideElementsWithText(elements, text) {
        elements.forEach(function(element) {
            if (element.textContent.includes(text)) {
                element.style.display = 'none';
            }
        });
    }

    // 定义隐藏特定请求方法的表单的函数
    function hideFormsByMethod(forms, method) {
        for (var i = 0; i < forms.length; i++) {
            var formMethod = forms[i].getAttribute("method");
            if (formMethod && formMethod.toLowerCase() === method.toLowerCase()) {
                forms[i].style.display = "none";
            }
        }
    }

    // 定义隐藏特定元素的函数
    function hideElements(elements) {
        elements.forEach(function(element) {
            element.style.display = 'none';
        });
    }
})();