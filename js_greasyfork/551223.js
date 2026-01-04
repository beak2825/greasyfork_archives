// ==UserScript==
// @name         蓝白-棕色尘埃2消息页面布局优化
// @namespace    http://tampermonkey.net/
// @version      2025-07-11
// @description  棕色尘埃2消息页面布局优化
// @author       蓝白社野怪
// @match        https://www.browndust2.com/*/news/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=browndust2.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/551223/%E8%93%9D%E7%99%BD-%E6%A3%95%E8%89%B2%E5%B0%98%E5%9F%832%E6%B6%88%E6%81%AF%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/551223/%E8%93%9D%E7%99%BD-%E6%A3%95%E8%89%B2%E5%B0%98%E5%9F%832%E6%B6%88%E6%81%AF%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置要处理的元素
    const config = {
        removePrefixes: ['_other-list_', '_banner_','_section-head_','_view-name_'],
        heightSettings: {
            '_view-content_': 700,
            '_news-view_': 850,
            '_header_': 25
        }
    };

    // 已处理的元素集合，避免重复处理
    const processedElements = new Set();

    // 处理元素的主要函数
    function processElements() {
        // 移除指定前缀的div
        config.removePrefixes.forEach(prefix => {
            const selector = `div[class^="${prefix}"]`;
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!processedElements.has(element)) {
                    console.log(`移除元素: ${selector}`);
                    element.remove();
                    processedElements.add(element);
                }
            });
        });

        // 调整元素高度
        for (const [prefix, height] of Object.entries(config.heightSettings)) {
            let selector;
            let elements;

            // 特殊处理header元素
            if (prefix === '_header_') {
                selector = `header[class^="${prefix}"]`;
                elements = document.querySelectorAll(selector);
            } else {
                selector = `div[class^="${prefix}"]`;
                elements = document.querySelectorAll(selector);
            }

            elements.forEach(element => {
                if (!processedElements.has(element)) {
                    console.log(`设置 ${selector} 高度为: ${height}px`);
                    element.style.height = `${height}px`;
                    element.style.overflow = 'auto';
                    element.style.border = '2px dashed #4CAF50';
                    element.style.margin = '5px';

                    // 特别为news-view添加居中样式
                    if (prefix === '_news-view_') {
                        element.style.display = 'block';
                        element.style.margin = '0 auto';
                        element.style.maxWidth = '80%';
                    }

                    // 特别为header添加样式
                    if (prefix === '_header_') {
                        element.style.overflow = 'hidden';
                        element.style.position = 'relative';
                        adjustHeaderLinks(element);
                    }

                    processedElements.add(element);
                }
            });
        }
        $("section[class^='_news-detail_']").css('padding-top','0');
    }

    // 只调整header内的a标签高度
    function adjustHeaderLinks(headerElement) {
        // 找到header内的所有a标签
        const links = headerElement.querySelectorAll('a');
        links.forEach(link => {
            link.style.height = '20px';
            link.style.lineHeight = '20px';
            link.style.display = 'inline-flex';
            link.style.alignItems = 'center';
            link.style.justifyContent = 'center';
        });

        console.log(`调整了 ${links.length} 个a标签的高度`);
    }

    // 增强的MutationObserver配置
    function initObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            for (const mutation of mutations) {
                // 检查新增的节点
                if (mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }

                // 检查属性变化（特别是class变化）
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    shouldProcess = true;
                    break;
                }
            }

            if (shouldProcess) {
                // 使用防抖避免频繁处理
                clearTimeout(window.processElementsTimeout);
                window.processElementsTimeout = setTimeout(processElements, 100);
            }
        });

        // 更全面的观察配置
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        return observer;
    }

    // 添加布局修复样式
    function addLayoutStyles() {
        const style = document.createElement('style');
        style.textContent = `
            div[class^="_view-content_"] {
                transition: height 0.5s ease-in-out;
                overflow: auto;
            }
            div[class^="_news-view_"] {
                transition: height 0.5s ease-in-out;
                display: block !important;
                margin: 0 auto !important;
                max-width: 80% !important;
                position: relative;
                left: 0;
                right: 0;
            }
            header[class^="_header_"] {
                transition: height 0.5s ease-in-out;
                overflow: hidden !important;
                position: relative !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 10px !important;
            }

            /* 只调整header内的a标签 */
            header[class^="_header_"] a {
                height: 20px !important;
                line-height: 20px !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                text-decoration: none !important;
            }

            /* 确保容器正确布局 */
            .container, [class*="container"], [class^="container"] {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: flex-start !important;
            }

            /* 修复astro-island布局 */
            astro-island {
                display: block !important;
                width: 100% !important;
            }

            /* 确保section正确布局 */
            section[class*="_news-detail_"] {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // 添加布局样式
            addLayoutStyles();
            // 初始处理
            processElements();
            // 初始化观察器
            initObserver();
            // 添加周期性检查（针对极端情况）
            setInterval(processElements, 2000);
        });
    } else {
        addLayoutStyles();
        processElements();
        initObserver();
        setInterval(processElements, 2000);
    }

    // 添加一个简单的UI指示器
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.top = '10px';
    indicator.style.right = '10px';
    indicator.style.background = '#4CAF50';
    indicator.style.color = 'white';
    indicator.style.padding = '10px';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '10000';
    indicator.style.fontFamily = 'Arial, sans-serif';
    indicator.style.fontSize = '14px';
    indicator.textContent = '页面元素调整脚本已加载';
    document.body.appendChild(indicator);

    // 5秒后隐藏指示器
    setTimeout(() => {
        indicator.style.display = 'none';
    }, 5000);

    console.log('页面元素调整脚本已初始化');
})();