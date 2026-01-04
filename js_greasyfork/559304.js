// ==UserScript==
// @name         知乎免登录自动关闭弹窗
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动关闭知乎登录弹窗、移除移动端APP导流提示、解除滚动锁定。修复了用户提供的配置语法错误，涵盖桌面端与移动端。
// @author       Gemini
// @match        *://*.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @license MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559304/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/559304/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================= 配置区域 (已修复语法错误) =================
    const CONFIG = {
        // 1. 需要【暴力移除】的广告、导流、遮罩层选择器
        REMOVE_SELECTORS: [
            '.Modal-wrapper',            // 通用弹窗容器 (如果点击关闭失败，则移除)
            '.MobileAppHeader-downloadLink', // 移动端顶部 App 下载链接
            '.OpenInAppButton',          // 移动端“在 App 中打开”按钮
            '.MobileModal-wrapper',      // 移动端模态框
            '.AdblockBanner',            // 广告拦截提示
            '.Argus',                    // 某些追踪/广告埋点
            '.HotQuestions-bottomButton' // 移动端底部“热榜”引流
        ],

        // 2. 需要【自动点击】的按钮选择器 (优先点击关闭，比直接移除更安全)
        CLICK_SELECTORS: [
            '.Modal-closeButton',           // 桌面端通用关闭按钮
            'button[aria-label="关闭"]',    // 语义化关闭按钮
            '.Button.Modal-closeButton',    // 特定样式的关闭按钮
            '.close',                       // 某些旧版关闭类名
            '.Modal-wrapper button.Button'  // 用户提供的特定选择器
        ],

        // 3. 导致页面无法滚动的类名 (存在于 body 或 html 标签上)
        LOCK_CLASSES: [
            'Modal-open',
            'Overflow-hidden',
            'is-locked',
            'Scroll-lock' // 补充常见的锁定类
        ]
    };

    // ================= 核心逻辑 =================

    /**
     * 执行清理工作
     */
    function cleanUp() {
        // 1. 解除滚动锁定 (最重要，否则关了弹窗也划不动)
        const html = document.documentElement;
        const body = document.body;

        CONFIG.LOCK_CLASSES.forEach(className => {
            if (html.classList.contains(className)) html.classList.remove(className);
            if (body.classList.contains(className)) body.classList.remove(className);
        });

        // 2. 尝试点击关闭按钮 (优先策略)
        CONFIG.CLICK_SELECTORS.forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                // console.log('[知乎净化] 自动点击关闭按钮:', selector);
                btn.click();
            }
        });

        // 3. 暴力移除顽固元素 (兜底策略)
        // 只有当明确不需要交互的遮罩，或者没有关闭按钮时才移除
        // 注意：这里我们主要移除移动端的导流，对于登录弹窗，优先依靠上面的点击
        CONFIG.REMOVE_SELECTORS.forEach(selector => {
            // 注意：不直接移除 .Modal-wrapper，除非它是登录强迫弹窗且没法关闭
            // 这里为了演示性能，我们只移除明确是广告/导流的 DOM
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // 判断：如果是登录弹窗，先看有没有关闭按钮，没有再移除
                if (el.classList.contains('Modal-wrapper')) {
                    const hasCloseBtn = el.querySelector('.Modal-closeButton');
                    if (!hasCloseBtn) {
                        el.remove();
                    }
                } else {
                    // 其他广告直接移除
                    el.remove();
                }
            });
        });

        // 特殊处理：移动端有时会把正文截断，需要展开
        // 这一步视情况开启，因为有时展开需要加载新数据
    }

    // ================= 性能优化：MutationObserver =================

    // 使用防抖或节流可能导致弹窗闪烁，对于这种去广告脚本，
    // 我们直接在回调中执行轻量级检查。由于 querySelector 很快，通常不会卡顿。
    const observer = new MutationObserver((mutations) => {
        let shouldClean = false;

        for (const mutation of mutations) {
            // 只有当节点增加或属性(如 class)改变时才触发
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldClean = true;
                break;
            }
            if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                shouldClean = true;
                break;
            }
        }

        if (shouldClean) {
            cleanUp();
        }
    });

    // ================= 启动脚本 =================

    function init() {
        // 1. 初始清理
        cleanUp();

        // 2. 开启监听
        // 监听 body 的子节点变化和属性变化
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style'] // 只监听 class 和 style 变化，提升性能
        });

        // 3. 针对某些动态加载较慢的情况，定期检查一次 (兜底)
        // 比如页面切换时
        window.addEventListener('load', cleanUp);
        setInterval(cleanUp, 3000); // 3秒一次低频兜底，防止 Observer 失效
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();