// ==UserScript==
// @name         知乎暗黑模式切换器
// @namespace    https://github.com/Lanzy1029/bilibili-batch-blocker
// @version      3.0
// @description  强制覆盖知乎样式。点击按钮彻底切换“亮色/暗色”，修复Banner不白、文字看不清等Bug。
// @author       Lanzzzy
// @license      MIT
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562846/%E7%9F%A5%E4%B9%8E%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/562846/%E7%9F%A5%E4%B9%8E%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'zhihu_custom_dark_mode';
    const BUTTON_ID = 'zhihu-dark-toggle-btn';

    // 1. 强力修复样式 (Fix Style)
    // 即使系统是暗黑模式，只要切换到 light，这段 CSS 会强制把背景变白，文字变黑
    const FIX_CSS = `
        html[data-theme="light"] {
            --header-bg: #fff !important;
            --bg-body: #fff !important;
            --text-1: #121212 !important; /* 正文黑字 */
            --text-2: #646464 !important; /* 辅助灰字 */
            color-scheme: light !important; /* 强制滚动条和表单控件变亮 */
        }
        /* 强制 Banner 变白 */
        html[data-theme="light"] .AppHeader, 
        html[data-theme="light"] .ColumnPageHeader {
            background-color: #fff !important;
            background: #fff !important;
        }
    `;

    // 按钮样式
    const BTN_STYLE = `
        position: fixed; 
        bottom: 100px; right: 20px;
        width: 50px; height: 50px;
        border-radius: 50%;
        background-color: #0084ff; color: white;
        border: none; cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        z-index: 99999;
        font-size: 24px;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.2s;
    `;

    // 2. 注入样式到页面
    function injectStyle() {
        if (document.getElementById('zhihu-dark-fix-style')) return;
        const style = document.createElement('style');
        style.id = 'zhihu-dark-fix-style';
        style.textContent = FIX_CSS;
        document.head.appendChild(style);
    }

    // 3. 核心切换逻辑
    function applyTheme() {
        const targetMode = localStorage.getItem(STORAGE_KEY) || 'light';
        const htmlTag = document.documentElement;

        // 关键点：不再是 removeAttribute，而是强制 setAttribute
        // 这样可以压制住知乎原生脚本的判断
        if (htmlTag.getAttribute('data-theme') !== targetMode) {
            htmlTag.setAttribute('data-theme', targetMode);
        }

        updateButton(targetMode);
    }

    // 4. 更新按钮图标
    function updateButton(mode) {
        const btn = document.getElementById(BUTTON_ID);
        if (!btn) return;
        
        if (mode === 'dark') {
            btn.innerHTML = '☀️';
            btn.style.backgroundColor = '#444';
        } else {
            btn.innerHTML = '🌙';
            btn.style.backgroundColor = '#0084ff';
        }
    }

    // 5. 创建按钮
    function createButton() {
        if (document.getElementById(BUTTON_ID)) return;
        
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.title = "点击切换模式";
        btn.style.cssText = BTN_STYLE;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            const current = localStorage.getItem(STORAGE_KEY) || 'light';
            // 切换状态
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, next);
            applyTheme();
        };

        btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseout = () => btn.style.transform = 'scale(1.0)';
        
        document.body.appendChild(btn);
        // 创建完立即刷新状态
        applyTheme();
    }

    // 6. 监控防篡改 (Observer)
    // 只要知乎敢偷偷改回 dark，我们立刻改回去
    function startObserver() {
        const observer = new MutationObserver(() => {
            applyTheme();
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // 监控按钮是否被删 (换页时)
        const bodyObserver = new MutationObserver(() => {
            if (!document.getElementById(BUTTON_ID)) {
                createButton();
                applyTheme();
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: false });
    }

    // 启动
    (function init() {
        injectStyle();
        createButton();
        applyTheme();
        startObserver();
    })();

})();