// ==UserScript==
// @name         Bing 极致净化：重定向全球版 + 背景替换 + 屏蔽资讯
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动跳转全球版，替换背景为随机二次元图，屏蔽首页干扰元素
// @author       Gemini
// @match        *://*.bing.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559345/Bing%20%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%EF%BC%9A%E9%87%8D%E5%AE%9A%E5%90%91%E5%85%A8%E7%90%83%E7%89%88%20%2B%20%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2%20%2B%20%E5%B1%8F%E8%94%BD%E8%B5%84%E8%AE%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/559345/Bing%20%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%EF%BC%9A%E9%87%8D%E5%AE%9A%E5%90%91%E5%85%A8%E7%90%83%E7%89%88%20%2B%20%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2%20%2B%20%E5%B1%8F%E8%94%BD%E8%B5%84%E8%AE%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 自动跳转逻辑 (保持不变) ---
    const targetHost = "global.bing.com";
    const targetParam = "mkt=en-us";
    if (window.location.hostname !== targetHost || !window.location.search.includes(targetParam)) {
        if (!window.location.pathname.startsWith('/ck/') &&
            !window.location.pathname.startsWith('/th') &&
            !window.location.pathname.startsWith('/rp')) {
            let newUrl = new URL(window.location.href);
            newUrl.hostname = targetHost;
            newUrl.searchParams.set("mkt", "en-us");
            window.location.replace(newUrl.toString());
            return;
        }
    }

    // --- 2. 强力样式注入 ---
    // 我们把背景图直接写在 CSS 里，利用 !important 夺取最高控制权
    const customBgUrl = "https://www.loliapi.com/acg/pc/";
    const css = `
        /* 1. 强制屏蔽所有干扰层 */
        .hp_top_cover_container,
        #hp_top_cover,
        .hp_top_cover_dim,
        .bottom_row,
        #hp_bottom_contents,
        .hp_bottom_contents,
        #id_view_container_as,
        .show_msg_cards,
        #feed_container {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            pointer-events: none !important;
        }

        /* 2. 核心：强制固定背景图 */
        /* 使用 !important 确保即使 Bing 的 JS 修改了 inline style 也无效 */
        #img_cont {
            display: block !important;
            background-image: url('${customBgUrl}') !important;
            background-size: cover !important;
            background-position: center !important;
            opacity: 1 !important;
            visibility: visible !important;
        }

        /* 隐藏可能存在的覆盖层遮罩 */
        .hp_media_container_gradient {
            display: none !important;
        }
    `;

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // --- 3. 兜底逻辑：针对动态加载的元素 ---
    const ensureEffect = () => {
        const bgDiv = document.getElementById('img_cont');
        if (bgDiv) {
            // 双重保险：如果 CSS 没压住，JS 强行再改一次
            if (!bgDiv.style.backgroundImage.includes(customBgUrl)) {
                bgDiv.style.setProperty('background-image', `url(${customBgUrl})`, 'important');
            }
        }
    };

    // 页面加载过程多次检查，确保冷启动成功
    window.addEventListener('load', ensureEffect);
    const observer = new MutationObserver(ensureEffect);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();