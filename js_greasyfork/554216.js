// ==UserScript==
// @name         即刻(Jike)评论屏蔽器 (带设置面板)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  根据关键词隐藏 jike.web.okjike.com 上的评论（包括头像、昵称、正文等），支持动态加载。
// @author       Gemini (based on user request)
// @match        https://web.okjike.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554216/%E5%8D%B3%E5%88%BB%28Jike%29%E8%AF%84%E8%AE%BA%E5%B1%8F%E8%94%BD%E5%99%A8%20%28%E5%B8%A6%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554216/%E5%8D%B3%E5%88%BB%28Jike%29%E8%AF%84%E8%AE%BA%E5%B1%8F%E8%94%BD%E5%99%A8%20%28%E5%B8%A6%E8%AE%BE%E7%BD%AE%E9%9D%A2%E6%9D%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置和关键词管理 ---

    const CONFIG_KEY = 'jike_blocked_keywords';
    const DEFAULT_KEYWORDS = ['房地产', '买两套房']; // 你可以修改默认关键词
    const HIDDEN_CLASS = 'gh-hidden-comment-by-keyword';

    // 使用 GM_addStyle 一次性添加隐藏样式，比逐个设置 display:none 高效
    GM_addStyle(`.${HIDDEN_CLASS} { display: none !important; }`);

    /**
     * 从存储中获取关键词列表
     * @returns {string[]}
     */
    function getKeywords() {
        const savedKeywords = GM_getValue(CONFIG_KEY, DEFAULT_KEYWORDS.join(','));
        return savedKeywords.split(',')
                            .map(k => k.trim()) // 去除首尾空格
                            .filter(k => k.length > 0); // 过滤空字符串
    }

    /**
     * 显示设置面板并保存关键词
     */
    function showKeywordsPanel() {
        const currentKeywords = getKeywords().join(',');
        const newKeywordsStr = prompt(
            '请输入要屏蔽的关键词，用英文逗号 (,) 隔开:',
            currentKeywords
        );

        if (newKeywordsStr !== null) { // 检查用户是否点击了 "取消"
            GM_setValue(CONFIG_KEY, newKeywordsStr);
            alert('关键词已保存！将立即重新扫描页面。');

            // 立即重新扫描整个页面
            // 1. 先把所有隐藏的都显示出来，万一关键词被删除了
            document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach(el => {
                el.classList.remove(HIDDEN_CLASS);
            });

            // 2. 立即用新规则重新扫描
            processNode(document.body);
        }
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand('设置即刻屏蔽关键词', showKeywordsPanel);

    // --- 2. 核心屏蔽逻辑 ---

    // 根据你提供的 HTML 结构，定义选择器
    // 评论的顶层容器，我们要隐藏这个
    const COMMENT_CONTAINER_SELECTOR = 'div[data-clickable-feedback="true"]';
    // 评论的文本内容容器，我们要检查这个
    const COMMENT_TEXT_SELECTOR = '.jk-1mipk4t'; // 你提供的 class

    /**
     * 扫描一个节点（及其子节点）并隐藏匹配的评论
     * @param {Node} node - 要扫描的 DOM 节点
     */
    function processNode(node) {
        if (!node || typeof node.querySelectorAll !== 'function') {
            return;
        }

        const keywords = getKeywords();
        if (keywords.length === 0) {
            return; // 没有关键词，不执行任何操作
        }

        // 查找节点内的所有潜在评论容器
        // 也包括节点本身就是评论容器的情况
        let commentsToScan = [];
        try {
             if (node.matches(COMMENT_CONTAINER_SELECTOR)) {
                commentsToScan.push(node);
            }
        } catch (e) {
            // node 可能不是 Element 节点，比如是 document
        }

        commentsToScan.push(...node.querySelectorAll(COMMENT_CONTAINER_SELECTOR));

        for (const commentEl of commentsToScan) {
            // 避免重复处理已经隐藏的元素
            if (commentEl.classList.contains(HIDDEN_CLASS)) {
                continue;
            }

            const textElement = commentEl.querySelector(COMMENT_TEXT_SELECTOR);
            if (!textElement) {
                continue;
            }

            const text = textElement.textContent || textElement.innerText;
            if (!text) {
                continue;
            }

            // 检查是否包含任一关键词 (some 方法会在找到第一个匹配项后立即停止)
            const shouldHide = keywords.some(keyword => text.includes(keyword));

            if (shouldHide) {
                commentEl.classList.add(HIDDEN_CLASS);
                // console.log('Jike Blocker: 已隐藏评论 ->', text.substring(0, 30) + '...');
            }
        }
    }

    // --- 3. 动态内容监控 (MutationObserver) ---

    // 创建一个观察器实例，当 DOM 发生变化时调用 processNode
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const addedNode of mutation.addedNodes) {
                    // 仅处理元素节点 (nodeType === 1)
                    if (addedNode.nodeType === 1) {
                        processNode(addedNode);
                    }
                }
            }
        }
    });

    // --- 4. 启动脚本 ---

    // 观察整个文档的子节点变化
    // Jike 是单页应用 (SPA)，内容会动态加载到 body 的某个子节点里
    observer.observe(document.body, {
        childList: true, // 观察子节点的添加或删除
        subtree: true    // 观察所有后代节点
    });

    // 立即对页面上已有的内容执行一次扫描
    // 使用 requestIdleCallback 或 setTimeout 确保在 Jike 渲染完成后执行
    if (document.readyState === 'complete') {
        setTimeout(() => processNode(document.body), 500);
    } else {
        window.addEventListener('load', () => {
            setTimeout(() => processNode(document.body), 500);
        });
    }

    console.log('即刻(Jike)评论屏蔽器已启动。');

})();