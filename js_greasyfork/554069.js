// ==UserScript==
// @name         Tio网站优化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tio添加样式、移除句尾句号、显示搜索信息、整体右移和滚动到顶部按钮
// @author       Cafwell
// @match        https://tio.freemdict.com/*
// @exclude      https://tio.freemdict.com/en/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554069/Tio%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554069/Tio%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 改动：内容整体右移
    function addGlobalStyles() {
        const globalStyle = document.createElement('style');
        globalStyle.textContent = `
            body, html {
                margin-left: 50px !important;
            }
            .tioresult {
                font-size: 18px !important
            }
            .pg_exam{
                margin-bottom: 3px;
            }
            .pg_book {
                font-size: 0.7em !important;
                opacity: 0.5;
                margin-left: 2px;
            }
        `;
        document.head.appendChild(globalStyle);
    }

    // 功能1：添加搜索信息栏
    function addSearchInfoBar() {
        const urlParams = new URLSearchParams(window.location.search);
        let searchQuery = urlParams.get('key') || '无'; // 从key参数获取
        searchQuery = decodeURIComponent(searchQuery); // 解码URL编码
        const searchTime = new Date().toLocaleString('zh-CN');
        const searchInfoDiv = document.createElement('div');
        searchInfoDiv.id = 'search-info-bar';
        searchInfoDiv.style.cssText = `
            position: fixed;
            text-align: center;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #f0f8ff;
            color: #333;
            padding: 8px 10px;
            font-size: 14px;
            border-bottom: 1px solid #ccc;
            z-index: 9999;
            box-sizing: border-box;
        `;

        searchInfoDiv.innerHTML = `
            <strong>搜索关键词:</strong><span style="color: #C42424; font-weight: bold;"> ${searchQuery}</span> |
            <strong>时间:</strong> ${searchTime}
        `;

        document.body.appendChild(searchInfoDiv);

        // 防遮挡
        const bodyStyle = document.createElement('style');
        bodyStyle.textContent = `
            body {
                margin-top: 40px !important;
            }
        `;
        document.head.appendChild(bodyStyle);
    }

    // 功能2：移除句号
    function removeTrailingPunctuation() {
        // 查找所有包含zh_cn标签的pg_exam元素
        const examElements = document.querySelectorAll('.pg_exam');

        examElements.forEach(element => {
            // 查找每个元素内的zh_cn标签
            const zhCnElements = element.querySelectorAll('zh_cn');

            zhCnElements.forEach(zhCnElement => {
                // 获取zh_cn标签内的直接文本内容（不包括子标签内的文本）
                const childNodes = Array.from(zhCnElement.childNodes);

                childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // 检查文本节点是否以句号结尾
                        if (node.textContent.trim().endsWith('。') || node.textContent.trim().endsWith('.')) {
                            node.textContent = node.textContent.replace(/[。.]$/, '');
                        }
                    }
                });
            });
        });
    }

    // 功能3：移动到顶
    function addScrollToTopButton() {
        // 检查是否已经存在滚动到顶部按钮，避免重复创建
        if (document.getElementById('scrollToTopBtn')) {
            return; // 如果按钮已存在，则直接返回，不再创建
        }

        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scrollToTopBtn';
        scrollToTopBtn.innerHTML = '🔝';
        scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 40px;
        width: 40px;
        height: 40px;
        background-color: rgba(176,186,191,0.7);
        color: white;
        border: none;
        border-radius: 20%;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 9998;
        display: none;
    `;

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'instant' // 改为smooth可以变成滑动
            });
        });

        document.body.appendChild(scrollToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        });
    }

    // 页面加载完成后执行
    function initialize() {
        // 添加全局样式（包括整体右移和pg_book样式）
        addGlobalStyles();

        // 添加搜索信息栏
        addSearchInfoBar();

        // 添加滚动到顶部按钮
        addScrollToTopButton();

        // 处理文本
        removeTrailingPunctuation();

        // 监听DOM变化，处理动态加载的内容
        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新增节点或其子节点是否包含.pg_exam
                            if (node.querySelector && (node.querySelector('.pg_exam') || node.classList.contains('pg_exam'))) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                removeTrailingPunctuation();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待页面完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();