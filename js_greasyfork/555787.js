// ==UserScript==
// @name         搜索跳转条（终极防误触版）
// @namespace    https://greasyfork.org/users/1271574-capricorn666
// @version      1.8
// @description  彻底杜绝谷歌验证码页显示 | 当前页跳转 | 完全透明 | 仅Google/百度/Bing | 修复空格编码BUG
// @author       zy
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555787/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E6%9D%A1%EF%BC%88%E7%BB%88%E6%9E%81%E9%98%B2%E8%AF%AF%E8%A7%A6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555787/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E6%9D%A1%EF%BC%88%E7%BB%88%E6%9E%81%E9%98%B2%E8%AF%AF%E8%A7%A6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const engines = [
        { name: "Google", url: "https://www.google.com/search?q=",     icon: "https://www.google.com/favicon.ico" },
        { name: "百度",   url: "https://www.baidu.com/s?wd=",          icon: "https://www.baidu.com/favicon.ico" },
        { name: "Bing",   url: "https://cn.bing.com/search?q=",        icon: "https://cn.bing.com/favicon.ico" }
    ];

    /**
     * 提取当前页面的搜索关键词。
     * 优先从URL参数获取（使用URLSearchParams自动处理+→空格解码），其次从页面输入框获取。
     * @returns {string} 编码后的搜索关键词（空格统一为%20）。
     */
    function getKeyword() {
        // 1. 优先从URL参数获取，使用URLSearchParams自动解码+为空格
        const params = new URLSearchParams(location.search);
        let rawKeyword = params.get('q') || params.get('wd');
        if (rawKeyword && rawKeyword.trim()) {
            return encodeURIComponent(rawKeyword.trim());
        }

        // 2. Fallback：如果URLSearchParams失败（极少见），用原正则方式（但已优化）
        const urlMatch = location.href.match(/[?&](q|wd)=([^&#]+)/i);
        if (urlMatch && urlMatch[2]) {
            // 手动处理+为空格（fallback逻辑）
            let decoded = urlMatch[2].replace(/\+/g, ' '); // 先替换+为空格
            try {
                decoded = decodeURIComponent(decoded); // 再解码%XX
            } catch (e) {
                // 忽略错误，继续用替换后的
            }
            return encodeURIComponent(decoded.trim());
        }

        // 3. 如果URL中没有，再尝试从页面上的输入框获取当前值
        const selectors = ['input[name="q"]', 'textarea[name="q"]', 'input[name="wd"]', 'input#kw', 'input#sb_form_q'];
        for (let s of selectors) {
            const el = document.querySelector(s);
            if (el && el.value?.trim()) {
                return encodeURIComponent(el.value.trim());
            }
        }
        return "";
    }

    /**
     * 判断当前页面是否为真正的搜索结果页面。
     * 这是防止误触的核心逻辑。
     * @returns {boolean}
     */
    function isRealSearchPage() {
        const url = location.href;
        const path = location.pathname;

        // 百度：只要在 /s 或 /baidu 且有搜索词，并且页面有搜索结果元素
        if (/baidu\.com/.test(url) && (url.includes('/s?') || url.includes('/baidu?'))) {
             return document.querySelector('#content_left, #results') !== null; // 检查结果容器
        }

        // Bing：只要在 /search 且有 q 参数，并且页面有搜索结果元素
        if (/bing\.com/.test(url) && url.includes('/search?q=')) {
            return document.querySelector('#b_results, #b_content') !== null; // 检查结果容器
        }

        // Google：严格判断，只在真正有搜索结果时显示
        if (/google\./.test(url)) {
            // 排除验证码页、登录页、设置页、隐私同意页、只有搜索框没有结果页等
            if (document.querySelector('#captcha') ||                      // 验证码表单
                document.querySelector('#recaptcha') ||                     // reCAPTCHA
                document.querySelector('form[action*="Consent"]') ||        // 隐私同意页
                document.querySelector('form[action*="signin"]') ||         // 登录页
                (document.querySelector('#searchform') && !document.querySelector('#res, #search')) || // 只有搜索框没结果
                path === '/' || path === '/webhp' ||                       // 主页或空白搜索页
                (path === '/search' && !url.includes('q=')) ||             // /search 但没有 q 参数
                url.includes('/sorry/') ||                                 // 机器人验证
                url.includes('/accounts/') ||                              // 账户页
                url.includes('consent.google.com')) {                      // 同意页
                return false;
            }
            // 真正有搜索结果的页面，检查常见的搜索结果容器
            return document.querySelector('#search, #res, #rso, div[data-hveid], div.g') !== null;
        }

        return false;
    }

    /**
     * 创建并插入搜索跳转条。
     */
    function createBar() {
        // 防止重复创建
        if (document.getElementById('sej-bar')) return;
        if (!isRealSearchPage()) return;  // 核心判断：不是搜索结果页就直接不创建

        const keyword = getKeyword();
        if (!keyword) return; // 如果没有关键词，也不创建

        const bar = document.createElement('div');
        bar.id = 'sej-bar';
        bar.style.cssText = `
            background: transparent;
            padding: 8px 0; /* 略微调整 padding */
            text-align: center;
            pointer-events: none; /* 默认不响应鼠标事件 */
            margin: 8px 0;
            z-index: 9999; /* 确保在最上层 */
            display: flex; /* 使用 flexbox 布局 */
            justify-content: center; /* 居中对齐 */
            align-items: center;
            flex-wrap: wrap; /* 允许换行 */
            max-width: 100%; /* 确保不超过父容器 */
        `;

        engines.forEach(engine => {
            const a = document.createElement('a');
            a.href = engine.url + keyword; // 使用获取到的关键词（已正确编码为%20）
            a.innerHTML = `<img src="${engine.icon}" width="16" height="16" style="vertical-align:middle;">
                           <span style="margin-left:6px;font-size:14px;color:currentColor;font-weight:normal;">${engine.name}</span>`; // 使用 currentColor
            a.style.cssText = `
                margin: 0 16px; /* 略微调整间距 */
                text-decoration: none;
                pointer-events: auto; /* 链接自身响应鼠标事件 */
                display: inline-flex; /* 使得图标和文字可以对齐 */
                align-items: center;
                opacity: 1;
                transition: opacity 0.2s ease-in-out; /* 添加过渡效果 */
            `;
            a.onclick = e => { e.preventDefault(); location.href = a.href; };
            a.onmouseover = () => a.style.opacity = '0.7';
            a.onmouseout  = () => a.style.opacity = '1';
            bar.appendChild(a);
        });

        // 插入位置
        const host = location.host;
        if (host.includes('baidu.com')) {
            const t = document.querySelector('#s_tab') || document.querySelector('#head');
            if (t) t.insertAdjacentElement('afterend', bar);
            else document.body.prepend(bar); // 备用方案：添加到 body 顶部
        }
        else if (host.includes('google.')) {
            const t = document.querySelector('#appbar') || document.querySelector('#searchform') || document.querySelector('#top_nav');
            if (t) {
                t.insertAdjacentElement('beforebegin', bar);
                // 移除硬编码 margin-left，通过 flexbox 居中
                // 可以考虑在bar外面再包一层 div.g (Google搜索结果的主容器，如果存在) 来继承其样式
            } else {
                document.body.prepend(bar); // 备用方案
            }
        }
        else if (host.includes('bing.com')) {
            const t = document.querySelector('#b_header') || document.querySelector('#b_content') || document.querySelector('#b_results');
            if (t) {
                t.insertAdjacentElement('beforebegin', bar);
                // 移除硬编码 margin，通过 flexbox 居中
            } else {
                 document.body.prepend(bar); // 备用方案
            }
        }
    }

    // 智能延迟 + 多次尝试，确保DOM加载完成
    let attempts = 0;
    const MAX_ATTEMPTS = 40;
    const INITIAL_DELAY = 400; // 初始延迟
    const tryCreate = () => {
        if (document.body && isRealSearchPage()) {
            createBar();
            if (document.getElementById('sej-bar')) return; // 如果成功创建，就停止尝试
        }
        if (++attempts < MAX_ATTEMPTS) {
            setTimeout(tryCreate, INITIAL_DELAY + attempts * 50); // 每次增加一点延迟，确保能抓到较慢加载的页面
        }
    };
    tryCreate();

    // 支持无刷新翻页和内容动态加载
    let debounceTimerForMutation;
    new MutationObserver(() => {
        // 只有当条不存在且当前是搜索页面时才尝试创建
        if (!document.getElementById('sej-bar') && isRealSearchPage()) {
            clearTimeout(debounceTimerForMutation); // 清除上次的定时器，实现去抖
            debounceTimerForMutation = setTimeout(() => {
                createBar();
            }, 600); // 延迟执行，给页面充分的渲染时间
        }
    }).observe(document.body, { childList: true, subtree: true }); // 监听整个body的变化

})();
