// ==UserScript==
// @name         X(Twitter) 跳转到 APP（改进参数识别）
// @namespace    http://via
// @version      1.2
// @description  在 X/Twitter 网页添加跳转按钮，点击后根据当前页面智能跳转到 APP（支持 /user 和 /status 等多种格式）
// @match        *://twitter.com/*
// @match        *://x.com/*
// @match        *://mobile.twitter.com/*
// @match        *://m.twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551527/X%28Twitter%29%20%E8%B7%B3%E8%BD%AC%E5%88%B0%20APP%EF%BC%88%E6%94%B9%E8%BF%9B%E5%8F%82%E6%95%B0%E8%AF%86%E5%88%AB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551527/X%28Twitter%29%20%E8%B7%B3%E8%BD%AC%E5%88%B0%20APP%EF%BC%88%E6%94%B9%E8%BF%9B%E5%8F%82%E6%95%B0%E8%AF%86%E5%88%AB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 根据当前 href 构建 App Scheme（智能识别 status/id、user 等）
    function buildAppUrl(href) {
        try {
            const u = new URL(href);
            const parts = u.pathname.split('/').filter(Boolean); // 分段并去掉空段

            // 1) 如果路径中包含 "status"，取其后面的 id（支持 /i/web/status/ID 之类）
            const statusIdx = parts.findIndex(p => p.toLowerCase() === 'status');
            if (statusIdx !== -1 && parts.length > statusIdx + 1) {
                const id = parts[statusIdx + 1];
                if (id) return 'twitter://status?id=' + encodeURIComponent(id);
            }

            // 2) 否则尝试把首段作为用户名（排除一些保留路径）
            if (parts.length >= 1) {
                const username = parts[0];
                const reserved = new Set([
                    'home','i','explore','search','settings','notifications','messages',
                    'compose','intent','hashtag','about','login','signup','logout','oauth',
                    'developer','privacy','tos','status' // 包含 status 但前面已被处理
                ]);
                if (username && !reserved.has(username.toLowerCase())) {
                    return 'twitter://user?screen_name=' + encodeURIComponent(username);
                }
            }
        } catch (e) {
            // URL parsing 出错时回退到首页 scheme
        }
        // 兜底：打开 App 首页
        return 'twitter://';
    }

    // 插入按钮（保证在单页应用里持续存在）
    function addBtn() {
        if (document.getElementById('xAppBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'xAppBtn';
        btn.innerText = '📱 打开X';
        // 样式：靠左、避开底部导航，超高 z-index 保证可见
        btn.style.position = 'fixed';
btn.style.bottom = '70px';
btn.style.left = '15px';
btn.style.zIndex = '2147483647';
btn.style.padding = '8px 12px';
btn.style.background = 'rgba(0,0,0,0.7)';
btn.style.color = '#fff';
btn.style.border = '1px solid #fff';               // 白色描边
btn.style.borderRadius = '20px';
btn.style.fontSize = '14px';
btn.style.cursor = 'pointer';
btn.style.pointerEvents = 'auto';
btn.style.boxShadow = '0 0 6px rgba(0,0,0,0.8)';   // 阴影
btn.style.textShadow = '0 0 2px #000';             // 字体描边

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const appUrl = buildAppUrl(location.href);
            // 直接跳转到 App scheme（与 YouTube 脚本的方式一致）
            location.href = appUrl;
        });

        // 防止页面阻止右键等，这里允许基本交互
        btn.oncontextmenu = null;

        document.body.appendChild(btn);
    }

    // 初次尝试添加
    addBtn();
    // SPA 页面频繁切换，定时检查以保证按钮存在（不会重复创建）
    setInterval(addBtn, 1500);

})();