// ==UserScript==
// @name         gying.net 无名小站 btnull 广告移除脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  移除 www.gying.net 网站的广告
// @author       You
// @license      MIT
// @match        https://www.gying.net/*
// @match        http://www.gying.net/*
// @match        https://www.gying.org/*
// @match        http://www.gying.org/*
// @match        https://www.gying.si/*
// @match        http://www.gying.si/*
// @match        https://www.gying.in/*
// @match        http://www.gying.in/*
// @match        https://www.gyg.la/*
// @match        http://www.gyg.la/*
// @match        https://www.gyg.si/*
// @match        http://www.gyg.si/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550339/gyingnet%20%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99%20btnull%20%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/550339/gyingnet%20%E6%97%A0%E5%90%8D%E5%B0%8F%E7%AB%99%20btnull%20%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function removeAds() {
        // 移除广告图片 - 根据ID选择器
        const adElements = [
            '#HMimageright',  // AD1.html 中的右侧广告
            '#HMimageleft',   // AD2.html 中的左侧广告
            '#ly'             // AD3.html 中的写真图集广告容器
        ];

        adElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
                console.log(`已移除广告元素: ${selector}`);
            }
        });

        // 移除包含特定广告域名的图片
        const adImages = document.querySelectorAll('img[src*="sogowan.com"]');
        adImages.forEach(img => {
            img.remove();
            console.log('已移除 sogowan.com 广告图片');
        });

        // 移除写真图集相关的广告内容
        const photoGalleryAds = document.querySelectorAll('.wrap.row');
        photoGalleryAds.forEach(element => {
            if (element.innerHTML.includes('写真图集') || element.innerHTML.includes('yalayi.net')) {
                element.remove();
                console.log('已移除写真图集广告');
            }
        });

        // 移除包含 btnull.html 链接的广告内容
        const btnullLinks = document.querySelectorAll('a[href*="btnull.html"]');
        btnullLinks.forEach(link => {
            const parentLi = link.closest('li');
            if (parentLi) {
                parentLi.remove();
                console.log('已移除 btnull 广告链接');
            }
        });
    }

    // 页面加载时执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAds);
    } else {
        removeAds();
    }

    // 监听动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                setTimeout(removeAds, 100); // 延迟执行以确保元素完全加载
            }
        });
    });

    // 开始观察
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    console.log('gying.net 广告移除脚本已启动');
})();