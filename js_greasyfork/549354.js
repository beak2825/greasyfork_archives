// ==UserScript==
// @name         【微博移动端】UI 精简
// @namespace   https://github.com/realSilasYang
// @version         2025-9-14
// @description    移除顶部导航栏、悬浮刷新按钮和诸多横线等界面元素。
// @author          阳熙来
// @icon             data:image/png;base64,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
// @license         GNU GPLv3
// @match        *://m.weibo.cn/*
// @match        *://huati.weibo.cn/*
// @match        *://h5.video.weibo.com/*
// @match        *://card.weibo.com/*
// @match        *://weibo.com/l/wblive/m/show/*
// @downloadURL https://update.greasyfork.org/scripts/549354/%E3%80%90%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%AB%AF%E3%80%91UI%20%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/549354/%E3%80%90%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%AB%AF%E3%80%91UI%20%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

// ==UserScript==
// @name         微博UI精简 & 横线去除（保留原注释）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动移除微博顶部导航、刷新按钮，并去掉多余横线和阴影
// @author       你
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // -------------------- 配置区域 --------------------

    // 页面上需要直接移除的 UI 元素选择器
    const SELECTORS_TO_REMOVE = [
        '.lite-topbar.main-top',  // 顶部导航栏
        '.refresh-btn.lite-iconf' // 悬浮刷新按钮
    ];

    // 统一管理所有需要去掉横线的 CSS 规则
    // 以后新增规则只需在此数组中添加一条
    const BORDER_FIX_RULES = [
        /* 去掉 .lite-line 元素的上边框 */
        `.lite-line { border-top-width: 0px !important; }`,

        /* 去掉顶部导航栏 .lite-topbar.lite-page-top 的底部横线和阴影 */
        `.lite-topbar.lite-page-top { border-bottom: none !important; box-shadow: none !important; }`,

        /* 去掉评论输入栏 .lite-page-editor 的顶部横线和阴影 */
        `.lite-page-editor { border-top: none !important; box-shadow: none !important; }`,

        /* 去掉微博卡片内部的横线（头像栏、正文模块、卡片容器） */
        `.weibo-top,
         .weibo-og,
         .wb-item-wrap .card-wrap {
            border-top: none !important;
            border-bottom: none !important;
            box-shadow: none !important;
         }`
    ];

    /**
     * 注入统一的横线去除样式
     * 只会执行一次，避免重复插入 <style>
     */
    function applyBorderFixes() {
        if (!document.getElementById('unified-border-fix-style')) {
            const style = document.createElement('style');
            style.id = 'unified-border-fix-style';
            // 将数组中的所有规则拼接成一个字符串
            style.textContent = BORDER_FIX_RULES.join('\n');
            document.head.appendChild(style);
        }
    }

    /**
     * 移除指定的 UI 元素
     */
    function cleanupUI() {
        SELECTORS_TO_REMOVE.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => element.remove());
        });
    }

    /**
     * 执行一次完整的清理流程
     */
    function runCleanup() {
        applyBorderFixes();
        cleanupUI();
    }

    // 页面初次加载完成后执行
    document.addEventListener('DOMContentLoaded', runCleanup);

    // 监听 DOM 变化（应对微博的动态加载 / 单页应用）
    const observer = new MutationObserver(runCleanup);
    observer.observe(document.body, { childList: true, subtree: true });

})();
