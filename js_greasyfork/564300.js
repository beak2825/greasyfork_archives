// ==UserScript==
// @name         YouMind Code Collapse (Default Folded)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  YouMind 代码块折叠功能，默认状态：[折叠]
// @author       YouMind User
// @match        https://youmind.com/*
// @match        https://*.youmind.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564300/YouMind%20Code%20Collapse%20%28Default%20Folded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564300/YouMind%20Code%20Collapse%20%28Default%20Folded%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==========================================================================
       CSS: 代码块折叠样式
       ========================================================================== */
    const css = `
        .ym-code-collapse-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f3f4f6; /* 浅灰背景 */
            padding: 6px 12px;
            font-size: 12px;
            color: #6b7280;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            border: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            cursor: pointer;
            margin-top: 1.25em; 
            font-family: inherit;
            user-select: none;
            transition: all 0.2s;
        }

        .ym-code-collapse-header:hover {
            background: #e5e7eb;
        }

        .ym-code-collapse-header .ym-btn-text {
            font-weight: 500;
        }
        
        /* 紧贴 Header 的 Pre 样式调整 */
        .ym-code-collapse-header + pre {
            margin-top: 0 !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
        }

        /* 折叠状态 */
        pre.ym-collapsed {
            display: none !important;
        }

        .ym-code-collapse-header.ym-header-collapsed {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            margin-bottom: 1.25em; /* 保持垂直韵律 */
        }
    `;

    // 注入样式
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ==========================================================================
       Logic: 代码块折叠功能初始化 (默认折叠)
       ========================================================================== */
    function initCodeCollapse() {
        const SELECTOR = '.ym-askai-content pre';
        const HEADER_CLASS = 'ym-code-collapse-header';

        function processBlock(pre) {
            // 0. 忽略嵌套在其他 pre 内部的 pre (只处理最外层，防止双重折叠)
            // 使用 closest 检测祖先元素中是否存在 pre
            if (pre.parentElement && pre.parentElement.closest('pre')) {
                return;
            }

            // 1. 检查是否已经处理过
            if (pre.previousElementSibling && pre.previousElementSibling.classList.contains(HEADER_CLASS)) {
                return;
            }

            // 2. 创建头部 (默认折叠样式)
            const header = document.createElement('div');
            header.className = HEADER_CLASS + ' ym-header-collapsed';
            header.innerHTML = `
                <span class="ym-label">Code</span>
                <span class="ym-btn-text">Expand</span>
            `;

            // 3. 默认折叠内容
            pre.classList.add('ym-collapsed');

            // 4. 点击事件
            header.addEventListener('click', () => {
                const isCollapsed = pre.classList.contains('ym-collapsed');
                if (isCollapsed) {
                    // 展开
                    pre.classList.remove('ym-collapsed');
                    header.classList.remove('ym-header-collapsed');
                    header.querySelector('.ym-btn-text').textContent = 'Collapse';
                } else {
                    // 折叠
                    pre.classList.add('ym-collapsed');
                    header.classList.add('ym-header-collapsed');
                    header.querySelector('.ym-btn-text').textContent = 'Expand';
                }
            });

            // 5. 插入 DOM (插入到 pre 之前)
            if (pre.parentNode) {
                pre.parentNode.insertBefore(header, pre);
            }
        }

        function scanAndInject() {
            const pres = document.querySelectorAll(SELECTOR);
            pres.forEach(processBlock);
        }

        // 监听 DOM 变化
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldScan = true;
                    break;
                }
            }
            if (shouldScan) {
                scanAndInject();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 初始运行
        setTimeout(scanAndInject, 500);
        setTimeout(scanAndInject, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeCollapse);
    } else {
        initCodeCollapse();
    }

})();
