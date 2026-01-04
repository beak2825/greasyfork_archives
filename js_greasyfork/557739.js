// ==UserScript==
// @name         Twitter/X (推特) t.co 直连 & 完整链接还原
// @name:en      Twitter/X t.co Direct Link & Full URL
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  将推特推文中的 t.co 链接替换为实际显示的完整 URL，同时修复被推特截断的站内链接显示（如 x.com/...）。
// @description:en Bypasses the t.co redirection on Twitter/X, replacing the shortened links with the actual full URLs. It also restores truncated links (e.g., "x.com/long...") to their full original form.
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557739/TwitterX%20%28%E6%8E%A8%E7%89%B9%29%20tco%20%E7%9B%B4%E8%BF%9E%20%20%E5%AE%8C%E6%95%B4%E9%93%BE%E6%8E%A5%E8%BF%98%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/557739/TwitterX%20%28%E6%8E%A8%E7%89%B9%29%20tco%20%E7%9B%B4%E8%BF%9E%20%20%E5%AE%8C%E6%95%B4%E9%93%BE%E6%8E%A5%E8%BF%98%E5%8E%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function restoreLinks() {
        // 1. 扩大搜索范围：搜索所有可能是链接的元素
        // 排除掉已经处理过的 (data-resolved)
        const links = document.querySelectorAll('a:not([data-resolved])');

        links.forEach(link => {
            // --- 过滤阶段 ---

            // 如果链接里包含图片、视频、或者 div (通常是推特卡片/头像/导航栏)，直接跳过
            if (link.querySelector('img, video, div')) return;

            // 获取隐藏的完整文本 (利用 textContent 获取 span 里的所有内容)
            let rawText = link.textContent.trim();

            // 核心判断 A：必须以省略号结尾 (说明被截断了)
            // Twitter 使用的是 unicode 省略号 '…'
            if (!rawText.endsWith('…')) {
                // 如果不是截断的链接，但它是 t.co 链接，我们依然需要处理它的跳转 (仅替换href)
                if (link.href.includes('t.co')) {
                     // 这种情况通常是短链接本身就是完整的，或者显示的文本不是 URL
                     // 我们只尝试移除 t.co 追踪，不做文本替换
                     bypassTcoOnly(link);
                }
                return; 
            }

            // 核心判断 B：看起来必须像一个 URL
            // 匹配 http 开头，或者 x.com / twitter.com 开头
            // 你的案例中 rawText 是 "https://x.com/imxiaohu/status/1996088137349751134?s=20…"
            const isUrlLike = /^(https?:\/\/|www\.|x\.com|twitter\.com)/.test(rawText);
            
            if (!isUrlLike) return;

            // --- 处理阶段 ---

            // 1. 清洗文本：移除末尾的省略号
            let cleanUrl = rawText.replace(/…$/, '');

            // 2. 补全协议 (如果只是 x.com 开头)
            if (!cleanUrl.startsWith('http')) {
                cleanUrl = 'https://' + cleanUrl;
            }

            // 标记为已处理
            link.dataset.resolved = "true";

            // 3. 替换显示文本 (解决你的核心需求)
            link.innerText = cleanUrl;
            
            // 4. 样式修正 (防止长链接破坏布局)
            link.style.wordBreak = "break-all";
            link.style.color = "rgb(29, 155, 240)"; // 保持推特蓝
            link.style.textDecoration = "underline";
            link.style.textDecorationColor = "rgba(29, 155, 240, 0.5)";

            // 5. 替换 href 为完整绝对路径
            link.href = cleanUrl;

            // 6. 阻止 Twitter 劫持 (对于站内链接，这会强制刷新页面访问，而不是 SPA 跳转，符合"直连"定义)
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            }, true);
        });
    }

    // 辅助函数：仅处理 t.co 跳转，不修改文本 (用于那些没有被截断的短链接)
    function bypassTcoOnly(link) {
        if (link.dataset.resolved) return;
        
        let rawText = link.textContent.trim();
        // 如果显示文本本身就是 URL，就用显示文本作为 href
        if (/^(https?:\/\/|www\.)/.test(rawText) && !rawText.includes('…')) {
             link.href = rawText;
             link.dataset.resolved = "true";
             link.addEventListener('click', (e) => e.stopPropagation(), true);
        }
    }

    // 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        restoreLinks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始运行
    restoreLinks();
})();