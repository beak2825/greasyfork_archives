// ==UserScript==
// @name         知乎多功能标题栏隐藏器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  【可配置开关】智能隐藏知乎文章页和问题页的悬浮标题栏。文章页移除class，问题页清空标题内容，提供沉浸式阅读。可在油猴菜单中单独控制。
// @author       inspirewind
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/question/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @downloadURL https://update.greasyfork.org/scripts/549752/%E7%9F%A5%E4%B9%8E%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%A0%87%E9%A2%98%E6%A0%8F%E9%9A%90%E8%97%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549752/%E7%9F%A5%E4%B9%8E%E5%A4%9A%E5%8A%9F%E8%83%BD%E6%A0%87%E9%A2%98%E6%A0%8F%E9%9A%90%E8%97%8F%E5%99%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // --- 配置管理 ---

    const CONFIG_KEYS = {
        hideArticle: 'config_hide_article_header',
        hideQuestion: 'config_hide_question_header'
    };

    // 读取配置，如果配置不存在，则默认为 true (隐藏)
    let hideArticleHeader = GM_getValue(CONFIG_KEYS.hideArticle, true);
    let hideQuestionHeader = GM_getValue(CONFIG_KEYS.hideQuestion, true);

    // --- 注册油猴菜单 ---

    // 动态更新菜单项的文本，用✅和❌表示当前状态
    const updateMenu = () => {
        // 为了确保菜单能动态刷新，我们需要一个唯一的key来注册，这里用脚本名+key
        const menuKeyArticle = `article_menu_toggle_${Math.random()}`;
        const menuKeyQuestion = `question_menu_toggle_${Math.random()}`;

        GM_registerMenuCommand(
            `${hideArticleHeader ? '✅' : '❌'} 切换隐藏文章页标题`,
            () => {
                // 点击时，反转设置并保存
                hideArticleHeader = !hideArticleHeader;
                GM_setValue(CONFIG_KEYS.hideArticle, hideArticleHeader);
                // 刷新页面以立即应用设置
                location.reload();
            },
            menuKeyArticle
        );

        GM_registerMenuCommand(
            `${hideQuestionHeader ? '✅' : '❌'} 切换隐藏问题页标题`,
            () => {
                hideQuestionHeader = !hideQuestionHeader;
                GM_setValue(CONFIG_KEYS.hideQuestion, hideQuestionHeader);
                location.reload();
            },
            menuKeyQuestion
        );
    };

    // 初始化菜单
    updateMenu();


    // --- 核心逻辑 ---

    /**
     * 创建一个MutationObserver来监视指定元素的class变化
     * @param {string} selector - 要监视的元素选择器
     * @param {string} className - 要移除的class名称
     */
    const observeAndRemoveClass = (selector, className) => {
        const targetNode = document.querySelector(selector);
        if (!targetNode) {
            // 如果页面上没有这个元素，就直接返回
            console.log(`[知乎标题栏隐藏器] 未找到目标元素: ${selector}`);
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (targetNode.classList.contains(className)) {
                        targetNode.classList.remove(className);
                        // console.log(`已移除 ${selector} 的 ${className} class。`);
                    }
                }
            }
        });

        observer.observe(targetNode, { attributes: true });
        console.log(`[知乎标题栏隐藏器] 已开始监视 ${selector}`);
    };

    // --- 页面路由：根据当前URL决定执行哪个逻辑 ---

    // 使用 try...catch 避免在某些特殊页面因找不到元素而报错
    try {
        const currentUrl = window.location.href;

        // 1. 如果是文章页 (zhuanlan.zhihu.com/p/...)
        if (currentUrl.includes('zhuanlan.zhihu.com/p/')) {
            if (hideArticleHeader) {
                console.log("[知乎标题栏隐藏器] 文章页模式启动");
                // 文章页是 .PageHeader 和 is-shown
                observeAndRemoveClass('.PageHeader', 'is-shown');
            } else {
                 console.log("[知乎标题栏隐藏器] 文章页标题栏已设置为显示。");
            }
        }

        // 2. 如果是问题页 (zhihu.com/question/...)
        else if (currentUrl.includes('www.zhihu.com/question/')) {
            if (hideQuestionHeader) {
                console.log("[知乎标题栏隐藏器] 问题页模式启动");
                 // 问题页也是 .PageHeader 和 is-shown
                observeAndRemoveClass('.PageHeader', 'is-shown');
            } else {
                 console.log("[知乎标题栏隐藏器] 问题页标题栏已设置为显示。");
            }
        }
    } catch (error) {
        console.error('[知乎标题栏隐藏器] 脚本执行出错:', error);
    }

})();