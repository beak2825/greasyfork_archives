// ==UserScript==
// @name         优酷弹幕过滤
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  通过关键词屏蔽优酷网页版的弹幕，突破10个限制，请自行在配置区域添加屏蔽关键词。本脚本通过Deepseek编写，仅限学习交流使用。
// @match        *://v.youku.com/*
// @match        *://*.youku.com/v_*
// @match        *://*.youku.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555923/%E4%BC%98%E9%85%B7%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/555923/%E4%BC%98%E9%85%B7%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 Set 提高查找效率
    const BLOCKED_WORDS_SET = new Set([
    // ==========屏蔽词配置区域==========
        "哈哈哈","哈哈哈","哈哈哈","哈哈哈","哈哈哈",
        "哈哈哈","哈哈哈","哈哈哈","哈哈哈","哈哈哈",
    // ==========屏蔽词配置区域==========
    ]);

    // 添加配置选项
    const CONFIG = {
        enableFilter: true,
        caseSensitive: false,
        filterMode: 'contains', // 'contains' | 'exact' | 'regex'
        logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
        initialDelay: 2000,
        observerThrottle: 100
    };

    console.log('优酷弹幕过滤器已启动，屏蔽关键词数量:', BLOCKED_WORDS_SET.size);

    // 专门针对优酷弹幕的选择器
    const DANMAKU_SELECTOR = '.barrage-word';

    // 改进过滤逻辑
    function shouldBlockText(text) {
        if (!text) return false;

        const cleanText = text.trim();
        if (!cleanText) return false;

        const compareText = CONFIG.caseSensitive ? cleanText : cleanText.toLowerCase();

        // 使用 Set 进行高效查找
        for (let word of BLOCKED_WORDS_SET) {
            const compareWord = CONFIG.caseSensitive ? word : word.toLowerCase();

            switch (CONFIG.filterMode) {
                case 'exact':
                    if (cleanText === word) return true;
                    break;
                case 'regex':
                    try {
                        const regex = new RegExp(word, CONFIG.caseSensitive ? '' : 'i');
                        if (regex.test(cleanText)) return true;
                    } catch (e) {
                        console.warn('正则表达式错误:', e);
                    }
                    break;
                case 'contains':
                default:
                    if (compareText.includes(compareWord)) return true;
                    break;
            }
        }

        return false;
    }

    // 过滤弹幕的主函数
    function filterDanmaku(danmakuElements) {
        if (!CONFIG.enableFilter) return;

        let filteredCount = 0;

        danmakuElements.forEach(element => {
            // 检查元素是否已经被隐藏
            if (element.style.display === 'none') return;

            // 获取弹幕文本内容
            const textElement = element.querySelector('span');
            if (!textElement) return;

            const text = textElement.textContent || textElement.innerText || '';
            const cleanText = text.trim();

            if (!cleanText) return;

            // 使用改进的过滤判断
            if (shouldBlockText(cleanText)) {
                element.style.display = 'none';
                filteredCount++;
                if (CONFIG.logLevel === 'debug') {
                    console.log('已屏蔽弹幕:', cleanText);
                }
            }
        });

        if (filteredCount > 0 && CONFIG.logLevel !== 'none') {
            console.log(`本轮过滤完成，共屏蔽 ${filteredCount} 条弹幕`);
        }
    }

    // 获取所有弹幕元素
    function getAllDanmaku() {
        return document.querySelectorAll(DANMAKU_SELECTOR);
    }

    // 初始过滤
    function initialFilter() {
        const danmakuElements = getAllDanmaku();
        if (danmakuElements.length > 0) {
            console.log(`找到 ${danmakuElements.length} 条弹幕，开始初始过滤`);
            filterDanmaku(danmakuElements);
        }
    }

    // 节流函数优化性能
    let throttleTimer;
    function throttleFilter(danmakuElements) {
        if (throttleTimer) return;

        throttleTimer = setTimeout(() => {
            filterDanmaku(danmakuElements);
            throttleTimer = null;
        }, CONFIG.observerThrottle);
    }

    // 创建观察器监听新弹幕
    const observer = new MutationObserver(function(mutations) {
        const newDanmaku = [];

        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查是否是弹幕元素
                        if (node.classList && node.classList.contains('barrage-word')) {
                            newDanmaku.push(node);
                        }

                        // 检查子节点中是否包含弹幕
                        if (node.querySelectorAll) {
                            const childDanmaku = node.querySelectorAll(DANMAKU_SELECTOR);
                            if (childDanmaku.length > 0) {
                                newDanmaku.push(...childDanmaku);
                            }
                        }
                    }
                });
            }
        });

        if (newDanmaku.length > 0) {
            if (CONFIG.logLevel === 'debug') {
                console.log(`检测到 ${newDanmaku.length} 条新弹幕`);
            }
            throttleFilter(newDanmaku);
        }
    });

    // 启动脚本
    function startFilter() {
        // 初始过滤
        setTimeout(initialFilter, CONFIG.initialDelay);

        // 启动观察器
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('弹幕过滤器已启动，正在监听新弹幕...');

        // 添加配置到全局，方便调试
        window.danmakuFilter = {
            config: CONFIG,
            blockedWords: BLOCKED_WORDS_SET,
            reloadFilter: function() {
                const allDanmaku = getAllDanmaku();
                allDanmaku.forEach(el => {
                    if (el.style.display === 'none') {
                        el.style.display = '';
                    }
                });
                initialFilter();
            },
            addWord: function(word) {
                BLOCKED_WORDS_SET.add(word);
            },
            removeWord: function(word) {
                BLOCKED_WORDS_SET.delete(word);
            }
        };
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startFilter);
    } else {
        startFilter();
    }

})();