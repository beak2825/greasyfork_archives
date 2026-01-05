// ==UserScript==
// @name         知乎首页屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  完全屏蔽知乎首页（包括动态路由和热榜），提供美观搜索入口
// @author       You
// @match        *://www.zhihu.com/*
// @match        *://zhihu.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558878/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558878/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========= 1. 工具 ========= */
    function isHomePage() {
        const p = location.pathname;
        return p === '/' || p === '/index' || p === '/index.html' || p === '/home';
    }

    function isHotPage() {
        const p = location.pathname;
        return p === '/hot' || p === '/hot/' || p.startsWith('/hot?') ||
               p === '/hot.html' || location.href.includes('zhihu.com/hot');
    }

    function shouldBlockPage() {
        return isHomePage() || isHotPage();
    }

    /* ========= 2. 预隐藏，避免闪屏 ========= */
    let preHideStyle = null;
    if (shouldBlockPage()) {
        preHideStyle = document.createElement('style');
        preHideStyle.id = 'zhihu-prehide-style';
        /* visibility:hidden 比 display:none 更安全，能避免某些脚本检测不到节点 */
        preHideStyle.textContent = `
            html,body,#root {
                visibility: hidden !important;
            }
        `;
        document.documentElement.appendChild(preHideStyle);
    }

    /* ========= 3. 主功能 ========= */
    function createBlocker() {
        if (document.getElementById('zhihu-blocker')) return; // 已经创建过

        // 移除预隐藏
        if (preHideStyle) preHideStyle.remove();

        // 防止页面滚动
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        // 清空现有内容
        document.body.innerHTML = '';

        // 根据当前页面类型显示不同的提示信息
        const pageType = isHotPage() ? '热榜' : '首页';
        const titleText = isHotPage() ? '知乎热榜已屏蔽' : '知乎首页已屏蔽';
        const descriptionText = isHotPage() ?
            '热榜容易分散注意力，专注重要内容' :
            '保持专注，高效工作或学习';

        // 1) 主容器
        const blocker = document.createElement('div');
        blocker.id = 'zhihu-blocker';
        blocker.innerHTML = `
            <div class="container">
                <h1>${titleText}</h1>
                <p>${descriptionText}</p>

                <div class="search-box">
                    <input type="text" id="zhihu-search" placeholder="搜索知乎内容..." autocomplete="off" />
                    <button id="search-btn">🔍 搜索</button>
                </div>
                <div class="search-tips">按 / 键快速聚焦到搜索框</div>

                <div class="footer">
                    输入关键词，直达你想看的内容
                </div>
            </div>
        `;
        document.body.appendChild(blocker);

        // 2) 样式
        const style = document.createElement('style');
        style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden!important;font-family:'Inter',-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#f5f7fa 0%,#e4edf5 100%);color:#2c3e50;line-height:1.7;text-rendering:optimizeLegibility}
        #zhihu-blocker{position:fixed;inset:0;width:100%;height:100%;z-index:99999;display:flex;justify-content:center;align-items:center;padding:20px;background:linear-gradient(135deg,#f5f7fa 0%,#e4edf5 100%);overflow:auto}
        .container{background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.12);padding:50px 40px;max-width:520px;width:100%;text-align:center;border:1px solid rgba(255,255,255,.3)}
        h1{color:#1d78ff;margin-bottom:12px;font-size:28px;font-weight:600}
        p{margin-bottom:30px;font-size:16px;color:#5a6b82}
        .search-box{display:flex;gap:10px;margin-bottom:20px;width:100%}
        .search-box input{padding:14px 20px;flex:1;border:1px solid #d0d7e2;border-radius:12px;font-size:16px;background:#f8faff;transition:.3s;box-shadow:0 1px 3px rgba(0,0,0,.05)}
        .search-box input:focus{border-color:#1d78ff;background:#fff;transform:scale(1.02);box-shadow:0 4px 15px rgba(29,120,255,.15);outline:none}
        .search-box button{padding:14px 24px;background:#1d78ff;color:#fff;border:none;border-radius:12px;cursor:pointer;font-size:16px;font-weight:500;transition:.2s;box-shadow:0 4px 10px rgba(29,120,255,.2);min-width:90px}
        .search-box button:hover{background:#0d66e0;transform:translateY(-1px)}
        .search-tips{font-size:13px;color:#9aa6b2;margin-bottom:20px}
        .footer{margin-top:35px;color:#9aa6b2;font-size:14px}
        @media(max-width:600px){#zhihu-blocker{padding:15px;align-items:flex-start}.container{padding:30px 20px;margin-top:20px}.search-box{flex-direction:column;gap:15px}.search-box input,.search-box button{width:100%;padding:16px}h1{font-size:24px}p{font-size:15px}}
        @media(max-width:350px){.container{padding:25px 15px}h1{font-size:22px}.search-box input,.search-box button{padding:14px}}
        `;
        document.head.appendChild(style);

        // 3) 交互
        const input = blocker.querySelector('#zhihu-search');
        const btn   = blocker.querySelector('#search-btn');

        const doSearch = () => {
            const q = input.value.trim();
            if (!q) return;
            location.href = `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(q)}`;
        };

        btn.addEventListener('click', doSearch);
        input.addEventListener('keypress', e => e.key === 'Enter' && doSearch());

        // 快捷键 /
        document.addEventListener('keydown', e => {
            if (e.key === '/' && e.target !== input) {
                e.preventDefault();
                input.focus();
            }
        });

        // 自动聚焦
        setTimeout(() => input.focus(), 100);
    }

    /* ========= 4. 统一检查函数 ========= */
    function checkAndBlock() {
        if (shouldBlockPage()) {
            /* 如果 body 已经有了，直接执行；否则等它出现 */
            if (document.body) {
                createBlocker();
            } else {
                const ob = new MutationObserver(() => {
                    if (document.body) {
                        ob.disconnect();
                        createBlocker();
                    }
                });
                ob.observe(document.documentElement, { childList: true });
            }
        }
    }

    /* ========= 5. 监听路由 / 首次加载 ========= */
    if (shouldBlockPage()) checkAndBlock();                        // 首次进入
    const rawPush   = history.pushState;
    const rawReplace = history.replaceState;

    history.pushState = function () {
        rawPush.apply(this, arguments);
        checkAndBlock();
    };
    history.replaceState = function () {
        rawReplace.apply(this, arguments);
        checkAndBlock();
    };
    window.addEventListener('popstate', checkAndBlock);
})();