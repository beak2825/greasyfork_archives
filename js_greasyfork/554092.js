// ==UserScript==
// @name         智慧教育培训管理平台刷课脚本
// @namespace    https://docs.scriptcat.org/
// @version      1.0
// @description  该油猴脚本用于 智慧教育培训管理平台 的辅助看课，脚本功能如下：检测到视频滑块认证后自动刷新页面
// @author       脚本喵
// @match        https://wlpx.nmgdata.org.cn/*
// @grant        none
// @icon         https://jiaobenmiao.com/img/logo2.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554092/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/554092/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        var ele = document.querySelector(".captcha-container")
        if (ele && isElementVisible(ele)) {
            location.reload()
        }
    }, 5000)

    function isElementVisible(element) {
        // 首先检查传入的参数是否为Element对象
        if (!(element instanceof Element)) {
            console.error('The provided parameter is not an Element.');
            return false;
        }

        // 检查元素是否在DOM中
        if (!document.body.contains(element)) {
            return false;
        }

        // 获取元素的计算样式
        var style = window.getComputedStyle(element);

        // 检查元素的visibility属性
        if (style.visibility === 'hidden') {
            return false;
        }

        // 检查元素的opacity属性
        if (style.opacity === '0') {
            return false;
        }

        // 检查元素的尺寸
        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            return false;
        }

        // 获取元素的位置和尺寸
        var rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return false;
        }

        // 检查元素是否在视口内
        if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
            return false;
        }

        // 检查元素是否被其他元素遮挡
        while ((element = element.parentNode) && !document.body.contains(element)) {
            if (style['overflow'] === 'hidden') {
                var parentRect = element.getBoundingClientRect();
                if (rect.right < parentRect.left || rect.left > parentRect.right || rect.bottom < parentRect.top || rect.top > parentRect.bottom) {
                    return false;
                }
            }
        }

        // 如果所有检查都通过了，那么元素是可见的
        return true;
    }
})();
