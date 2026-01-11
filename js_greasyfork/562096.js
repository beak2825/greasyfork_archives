// ==UserScript==
// @name         解决Via的广告拦截问题（MissAV专用）
// @namespace    https://viayoo.com/
// @version      V2
// @description  解决via用MissAV空白占位符和重定向到广告页面的问题
// @author       Google Gemini
// @run-at       document-end
// @match        https://missav.ws/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562096/%E8%A7%A3%E5%86%B3Via%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E9%97%AE%E9%A2%98%EF%BC%88MissAV%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562096/%E8%A7%A3%E5%86%B3Via%E7%9A%84%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E9%97%AE%E9%A2%98%EF%BC%88MissAV%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    // 1. 【安全第一】如果是验证码页面，脚本立即自杀，确保能通过验证
    if (document.title.includes('请稍候') || document.querySelector('#cf-wrapper')) return;

    // 2. 【核心拦截】只拦截域名跳转，不干扰页面元素渲染
    const adLog = /diffusedpassion|tsyndicate|traffshop|popads|click|[0-9]{6,}/i;
    window.open = (u) => { if (u && adLog.test(u)) return null; };

    // 3. 【静默样式】通过底层 CSS 抹除空白，这是最快、最省电的方法
    const style = document.createElement('style');
    style.innerHTML = `
        /* 抹除你红圈标出的那些顽固黑块 */
        #syndicated-content, .mg-ad-card, .mx-auto.text-center, 
        .mb-4.mt-4:empty, div[class*="adv-"] { 
            display: none !important; 
            height: 0 !important; 
            margin: 0 !important; 
        }

        /* 解决“粘在一起”的问题：强制给搜索框和图片留出间距 [针对图12/14] */
        .input-group, #search-form { 
            display: flex !important; 
            margin: 15px 0 !important; 
            min-height: 48px !important; 
            visibility: visible !important;
        }

        /* 锁定菜单：防止语言栏乱跳 [针对图13] */
        .dropdown-menu { z-index: 9999 !important; }
        
        /* 列表页间距固定：防止图片挤在一起 */
        .video-img-box { margin-bottom: 20px !important; }
    `;
    document.head.appendChild(style);

    // 4. 【被动清理】仅在页面加载完后执行一次手术，避免频繁扫描导致卡顿
    const singleSweep = () => {
        document.querySelectorAll('div').forEach(el => {
            // 判定特征：高度>45px，没字，里面没图也没链接
            if (el.offsetHeight > 45 && el.innerText.trim() === "" && !el.querySelector('img, a, video, input')) {
                // 避开导航栏
                if (!el.closest('nav, .navbar, .input-group')) {
                    el.style.setProperty('display', 'none', 'important');
                }
            }
        });
    };

    // 仅在加载完成和 3 秒后各跑一次
    window.addEventListener('load', singleSweep);
    setTimeout(singleSweep, 3000);
})();