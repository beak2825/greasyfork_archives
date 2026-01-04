// ==UserScript==
// @name         解决腾讯QQ危险拦截
// @namespace    http://tampermonkey.net/
// @description  立即从QQ拦截页面跳转到目标网址，无延迟！QQ交流群：329389937
// @author       红尘旧梦
// @match        *://c.pc.qq.com/*
// @run-at       document-start
// @grant        none
// @icon         https://youke1.picui.cn/s1/2025/09/01/68b52916dba22.ico
// @license      MIT
// @version      3.1.1
// @downloadURL https://update.greasyfork.org/scripts/547989/%E8%A7%A3%E5%86%B3%E8%85%BE%E8%AE%AFQQ%E5%8D%B1%E9%99%A9%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/547989/%E8%A7%A3%E5%86%B3%E8%85%BE%E8%AE%AFQQ%E5%8D%B1%E9%99%A9%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 document-start 运行，在页面加载前就执行
    console.log('QQ拦截极速跳转脚本已启动');

    // 立即获取目标URL（不等待DOM加载）
    function getTargetUrlImmediately() {
        const currentUrl = window.location.href;
        console.log('当前URL:', currentUrl);

        // 方法1：直接从URL参数中提取
        const urlMatch = currentUrl.match(/[?&](?:url|u|link|target)=([^&]+)/i);
        if (urlMatch && urlMatch[1]) {
            let targetUrl = decodeURIComponent(urlMatch[1]);
            console.log('从URL参数找到目标:', targetUrl);
            return targetUrl;
        }

        // 方法2：尝试其他可能的参数名
        const paramNames = ['url', 'u', 'link', 'target', 'to', 'redirect'];
        for (const param of paramNames) {
            const regex = new RegExp(`[?&]${param}=([^&]+)`, 'i');
            const match = currentUrl.match(regex);
            if (match && match[1]) {
                let targetUrl = decodeURIComponent(match[1]);
                console.log('从参数', param, '找到目标:', targetUrl);
                return targetUrl;
            }
        }

        console.log('未在URL参数中找到目标链接');
        return null;
    }

    // 验证URL格式
    function isValidUrl(url) {
        if (!url) return false;
        try {
            // 确保URL包含协议
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            new URL(url);
            return url;
        } catch (e) {
            console.log('URL格式验证失败:', e);
            return false;
        }
    }

    // 立即跳转函数
    function immediateRedirect() {
        const targetUrl = getTargetUrlImmediately();

        if (targetUrl) {
            const validUrl = isValidUrl(targetUrl);
            if (validUrl) {
                console.log('立即跳转到:', validUrl);

                // 关键：立即跳转，不等待任何内容加载
                window.stop(); // 停止当前页面加载
                window.location.replace(validUrl); // 替换当前历史记录
                return;
            } else {
                console.log('目标URL格式无效:', targetUrl);
            }
        }

        // 如果没有立即找到URL，设置监听器在DOM加载时再次尝试
        console.log('未立即找到目标URL，设置DOM监听器');
        document.addEventListener('DOMContentLoaded', domRedirect);
    }

    // DOM加载后的备用跳转方法
    function domRedirect() {
        console.log('DOM加载完成，尝试备用跳转方法');

        // 方法1：再次尝试从URL参数获取
        const urlParams = new URLSearchParams(window.location.search);
        const paramNames = ['url', 'u', 'link', 'target', 'to', 'redirect'];

        for (const param of paramNames) {
            const targetUrl = urlParams.get(param);
            if (targetUrl) {
                const decodedUrl = decodeURIComponent(targetUrl);
                const validUrl = isValidUrl(decodedUrl);
                if (validUrl) {
                    console.log('DOM加载后找到目标:', validUrl);
                    window.location.replace(validUrl);
                    return;
                }
            }
        }

        // 方法2：尝试从页面内容提取
        try {
            // 查找可能的继续访问按钮
            const continueButtons = document.querySelectorAll([
                'a[href*="http"]',
                'button',
                '.btn-continue',
                '.continue-btn',
                '*[onclick*="window.location"]'
            ].join(','));

            for (let element of continueButtons) {
                if (element.textContent && (
                    element.textContent.includes('继续访问') ||
                    element.textContent.includes('访问原网址') ||
                    element.textContent.includes('打开链接') ||
                    element.textContent.includes('立即前往')
                )) {
                    console.log('找到跳转按钮:', element.textContent);
                    element.click();
                    return;
                }

                // 如果是链接且不是QQ域名
                if (element.href && !element.href.includes('c.pc.qq.com')) {
                    console.log('找到外部链接:', element.href);
                    window.location.replace(element.href);
                    return;
                }
            }
        } catch (e) {
            console.log('DOM提取失败:', e);
        }

        console.log('所有跳转方法都失败了');
    }

    // 立即执行跳转
    immediateRedirect();

})();