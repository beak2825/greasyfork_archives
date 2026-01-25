// ==UserScript==
// @name         B站屏蔽@开头或?!震惊体评论
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  扫描并屏蔽B站评论区中所有以"@"字符开头、或含震惊体特征的评论（？+！/≥2个？/≥2个！/结尾单个！）
// @author       rmt48r & doubao
// @match        *://www.bilibili.com/*
// @match        *://t.bilibili.com/*
// @match        *://space.bilibili.com/*
// @match        *://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563986/B%E7%AB%99%E5%B1%8F%E8%94%BD%40%E5%BC%80%E5%A4%B4%E6%88%96%21%E9%9C%87%E6%83%8A%E4%BD%93%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/563986/B%E7%AB%99%E5%B1%8F%E8%94%BD%40%E5%BC%80%E5%A4%B4%E6%88%96%21%E9%9C%87%E6%83%8A%E4%BD%93%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    // ===================== 新增：震惊体检测规则 =====================
    const SHOCK_RULE = {
        qMark: /[？?]/g,    // 匹配中英文问号
        exMark: /[！!]/g,   // 匹配中英文感叹号
        endSingleEx: /[！!]$/  // 匹配结尾单个中英文感叹号
    };

    // ===================== 扩展：判断文本是否需要屏蔽（@开头 或 震惊体） =====================
    function shouldBlock(text) {
        if (!text) return false;
        const t = text.trim();

        // 1. 原有规则：屏蔽@/＠开头的评论
        const isAtStart = t.startsWith('@') || t.startsWith('＠');

        // 2. 新增规则：检测震惊体特征
        if (!t) return isAtStart;
        const qCount = (t.match(SHOCK_RULE.qMark) || []).length;
        const exCount = (t.match(SHOCK_RULE.exMark) || []).length;
        const hasEndSingleEx = SHOCK_RULE.endSingleEx.test(t);
        const isShockText = (qCount > 0 && exCount > 0) || qCount >= 2 || exCount >= 2 || hasEndSingleEx;

        // 满足任一条件即屏蔽
        return isAtStart || isShockText;
    }

    function hideComment(richTextEl) {
        // 1. 找到富文本组件的宿主（bili-comment-renderer）
        let host = richTextEl.getRootNode().host;

        // 2. 向上回溯找到整条评论容器（连带回复框一起隐藏）
        let depth = 0;
        while (host && depth < 5) {
            const tagName = host.tagName.toLowerCase();

            if (tagName === 'bili-comment-thread-renderer' || tagName === 'bili-comment-reply-renderer') {
                host.style.display = 'none';
                if(DEBUG) {
                    const commentText = richTextEl.shadowRoot.textContent.trim().substring(0, 20);
                    console.log(`[已屏蔽] ${tagName}: ${commentText}...`);
                }
                return;
            }

            // 继续向上找Shadow DOM宿主或父元素
            const root = host.getRootNode();
            if (root instanceof ShadowRoot) {
                host = root.host;
            } else {
                host = host.parentElement;
            }
            depth++;
        }
    }

    function deepScan(root) {
        if (!root) return;

        // 扫描当前层级的bili-rich-text组件（B站评论核心文本组件）
        const richTexts = root.querySelectorAll('bili-rich-text');
        richTexts.forEach(rt => {
            if (rt.getAttribute('data-at-scanned') === 'true') return; // 避免重复处理

            // 进入ShadowRoot获取评论真实文本
            if (rt.shadowRoot) {
                const contentNode = rt.shadowRoot.querySelector('#contents');
                if (contentNode) {
                    const commentText = contentNode.textContent;
                    // 检测并屏蔽符合条件的评论
                    if (shouldBlock(commentText)) {
                        hideComment(rt);
                    }
                    // 标记为已扫描
                    rt.setAttribute('data-at-scanned', 'true');
                }
            }
        });

        // 递归扫描所有Shadow DOM嵌套结构
        const allElements = root.querySelectorAll('*');
        for (const el of allElements) {
            if (el.shadowRoot) {
                deepScan(el.shadowRoot);
            }
        }
    }

    // 1.5秒轮询扫描（适配动态加载的评论）
    setInterval(() => {
        deepScan(document);
    }, 1500);

    // 初始化先执行一次
    setTimeout(() => {
        deepScan(document);
    }, 1000);

    //console.log('B站@开头+?!震惊体评论屏蔽脚本已启动');
})();