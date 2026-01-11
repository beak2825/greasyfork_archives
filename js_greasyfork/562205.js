// ==UserScript==
// @name         B站屏蔽所有@开头的评论
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  扫描并屏蔽B站评论区中所有以"@"字符开头的评论
// @author       rmt48r
// @match        *://www.bilibili.com/*
// @match        *://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562205/B%E7%AB%99%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%40%E5%BC%80%E5%A4%B4%E7%9A%84%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/562205/B%E7%AB%99%E5%B1%8F%E8%94%BD%E6%89%80%E6%9C%89%40%E5%BC%80%E5%A4%B4%E7%9A%84%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    // 判断文本是否需要屏蔽
    function shouldBlock(text) {
        if (!text) return false;
        // 移除空白后检查，兼容全角和半角@
        const t = text.trim();
        return t.startsWith('@') || t.startsWith('＠');
    }

    // 隐藏逻辑：找到包含该文本的“评论条目”组件并隐藏
    function hideComment(richTextEl) {
        // 1. 先找到富文本组件的宿主（一般是 bili-comment-renderer）
        let host = richTextEl.getRootNode().host;

        // 2. 尝试向上回溯，找到最大的容器（thread-renderer 或 reply-renderer）
        // 这样可以把整条评论连带下方的回复框一起隐藏，不留空白
        let depth = 0;
        while (host && depth < 5) {
            const tagName = host.tagName.toLowerCase();

            if (tagName === 'bili-comment-thread-renderer' || tagName === 'bili-comment-reply-renderer') {
                host.style.display = 'none';
                if(DEBUG) console.log(`[已屏蔽] ${tagName}:`, richTextEl.shadowRoot.textContent.trim().substring(0, 20));
                return;
            }

            // 继续向上找：如果当前是在 shadowRoot 里，就找 host；否则找 parentElement
            const root = host.getRootNode();
            if (root instanceof ShadowRoot) {
                host = root.host;
            } else {
                host = host.parentElement;
            }
            depth++;
        }
    }

    // 核心函数：递归扫描
    function deepScan(root) {
        if (!root) return;

        // 直接在当前层级寻找 bili-rich-text 组件
        const richTexts = root.querySelectorAll('bili-rich-text');
        richTexts.forEach(rt => {
            if (rt.getAttribute('data-at-scanned') === 'true') return; // 避免重复处理

            // 钻入 rich-text 内部看文字
            if (rt.shadowRoot) {
                const contentNode = rt.shadowRoot.querySelector('#contents');
                if (contentNode) {
                    if (shouldBlock(contentNode.textContent)) {
                        hideComment(rt);
                    }
                    // 标记为已扫描
                    rt.setAttribute('data-at-scanned', 'true');
                }
            }
        });

        // querySelectorAll('*') 虽然暴力，但对于未知的嵌套结构是唯一的办法
        const allElements = root.querySelectorAll('*');
        for (const el of allElements) {
            // 如果这个元素有影子根 (Shadow Root)，就递归进去找
            if (el.shadowRoot) {
                deepScan(el.shadowRoot);
            }
        }
    }

    // 启动逻辑
    // 由于 DOM 结构复杂，使用定时器轮询最稳妥
    // 1.5 秒一次
    setInterval(() => {
        deepScan(document);
    }, 1500);

    // 开局先跑一次
    setTimeout(() => {
        deepScan(document);
    }, 1000);

    console.log('B站@评论屏蔽脚本已启动');
})();