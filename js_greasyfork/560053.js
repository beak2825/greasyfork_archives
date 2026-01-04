// ==UserScript==
// @name         pre.collapsed - 代码块折叠助手 - 支持多平台
// @namespace    http://leizingyiu.cool/
// @version      20251224
// @description  在deepseek、chatgpt、qwen、doubao等平台的代码块添加折叠功能
// @author       leizingyiu
// @license      GNU AGPLv3
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://*.deepseek.com/*
// @match        https://*.qwen.ai/*
// @match        https://*.doubao.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/560053/precollapsed%20-%20%E4%BB%A3%E7%A0%81%E5%9D%97%E6%8A%98%E5%8F%A0%E5%8A%A9%E6%89%8B%20-%20%E6%94%AF%E6%8C%81%E5%A4%9A%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/560053/precollapsed%20-%20%E4%BB%A3%E7%A0%81%E5%9D%97%E6%8A%98%E5%8F%A0%E5%8A%A9%E6%89%8B%20-%20%E6%94%AF%E6%8C%81%E5%A4%9A%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置表 - 不同平台的CSS选择器
    const PLATFORM_CONFIGS = {
        // ChatGPT
        'chatgpt.com': {
            parent: 'pre',
            title: 'pre>div>div:nth-child(2)>*',
            code: 'pre>div>div:last-child'
        },
        // DeepSeek
        'deepseek.com': {
            parent: '.md-code-block',
            title: '.md-code-block-banner>div>div',
            code: 'pre'
        },
        // 通义千问 (需要根据实际情况调整)
        'chat.qwen.ai': {
            parent: 'pre.qwen-markdown-code',
            title: 'pre.qwen-markdown-code>div>div',
            code: 'pre.qwen-markdown-code>div:last-child'
        },
        // 豆包 (需要根据实际情况调整)
        'doubao.com': {
            parent: '.code-area',
            title: '.code-area>div>div>div',
            code: '.code-content'
        }
    };

    GM_addStyle(`
    .code-collapsed {
        max-height: 0 !important;
        overflow: hidden !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
    }

    .code-expanded {
        max-height: var(--code-max-height, 99999px) !important;
    }


    .code-parent {
        transition: all 0.5s ease !important;
        --code-max-height: 0;
    }

    .code-parent * {
        --transition-dura:0.5s;
        transition: max-height var(--transition-dura) ease,
                    padding var(--transition-dura) ease ,
                    margin var(--transition-dura) ease !important;
    }

    .code-toggle-btn {
        background: none !important;
        border: 1px solid rgba(156, 163, 175, 0.3) !important;
        color: #9ca3af !important;
        padding: 2px 8px !important;
        font-size: 12px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        margin-left: 8px !important;
        transition: all 0.2s ease !important;
    }

    .code-toggle-btn:hover {
        background: rgba(156, 163, 175, 0.1) !important;
        border-color: rgba(156, 163, 175, 0.5) !important;
    }

    #global-code-controls {
        --bg-color: rgba(0, 0, 0, 0.8);
        --btn-bg-color: rgba(59, 130, 246, 0.7);
        --btn-text-color: white;
        --btn-hover-bg-color: rgba(59, 130, 246, 0.8);

        position: fixed !important;
        --position-padding: 10px;
        bottom: var(--position-padding) !important;
        right:  var(--position-padding) !important;
        z-index: 999999 !important;
        background: var(--bg-color) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 6px !important;
        padding: 8px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        backdrop-filter: blur(10px) !important;

        opacity: 0.3 !important;
        transition: opacity 0.2s ease !important;
    }
    #global-code-controls:hover {
        opacity: 1 !important;
    }

    .global-toggle-btn {
        background: var(--btn-bg-color) !important;
        border: none !important;
        color: var(--btn-text-color) !important;
        padding: 6px 12px !important;
        font-size: 12px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        transition: background 0.2s ease !important;
    }

    .global-toggle-btn:hover {
        background: var(--btn-hover-bg-color) !important;
    }
`);

    let currentConfig = null;

    function getPlatformConfig() {
        const hostname = window.location.hostname;

        for (const [domain,
            config]of Object.entries(PLATFORM_CONFIGS)) {
            if (hostname.includes(domain)) {
                return config;
            }
        }

        return {parent: 'pre', title: null, code: 'code'};
    }

    function createToggleButton(isCollapsed = false) {
        const btn = document.createElement('button');
        btn.className = 'code-toggle-btn';
        btn.textContent = isCollapsed
            ? '展开'
            : '折叠';
        btn.setAttribute('data-collapsed', isCollapsed.toString());
        return btn;
    }

    function toggleCodeBlock(codeElement, btn) {
        const isCollapsed = btn.getAttribute('data-collapsed') === 'true';
        const parent = btn.closest('.code-parent');

        if (isCollapsed) {

            codeElement
                .classList
                .remove('code-collapsed');
            codeElement
                .classList
                .add('code-expanded');
            btn.textContent = '折叠';
            btn.setAttribute('data-collapsed', 'false');

            if (parent && parent.style.getPropertyValue('--code-max-height')) {
                parent
                    .style
                    .setProperty('--code-max-height', parent.getAttribute('data-original-height') + 'px');
            }
        } else {

            const currentHeight = codeElement.scrollHeight;

            if (parent) {
                parent.setAttribute('data-original-height', currentHeight);
            }

            if (parent) {
                parent
                    .style
                    .setProperty('--code-max-height', currentHeight + 'px');
            }

            codeElement
                .classList
                .remove('code-expanded');
            codeElement
                .classList
                .add('code-collapsed');
            btn.textContent = '展开';
            btn.setAttribute('data-collapsed', 'true');

            requestAnimationFrame(() => {
                if (parent) {
                    parent
                        .style
                        .setProperty('--code-max-height', '0');
                }
            });
        }
    }

    function addFoldableCodeBlocks() {
        const config = getPlatformConfig();

        const parentElements = document.querySelectorAll(config.parent);

        parentElements.forEach((parent) => {

            if (parent.classList.contains('code-processed')) {
                return;
            }

            parent
                .classList
                .add('code-processed', 'code-parent');

            let titleElement;
            let codeElement;

            if (config.title) {
                titleElement = parent.querySelector(config.title);
            } else {

                titleElement = parent.querySelector('.flex, .header, .title') || parent.firstElementChild;
            }

            codeElement = parent.querySelector(config.code) || parent.querySelector('code') || parent;

            if (!codeElement)
                return;

            if (!titleElement) {
                titleElement = document.createElement('div');
                titleElement.style.cssText = `
                background: rgba(0, 0, 0, 0.2);
                padding: 4px 8px;
                font-size: 12px;
                color: #9ca3af;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;
                titleElement.textContent = '代码块';

                parent.insertBefore(titleElement, codeElement);
            }

            if (titleElement.querySelector('.code-toggle-btn')) {
                return;
            }

            const initialHeight = codeElement.scrollHeight;
            parent
                .style
                .setProperty('--code-max-height', initialHeight + 'px');
            parent.setAttribute('data-original-height', initialHeight);

            const toggleBtn = createToggleButton(false);
            titleElement.appendChild(toggleBtn);

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleCodeBlock(codeElement, toggleBtn);
            });
        });
    }

    function createGlobalControls() {

        const existingControls = document.getElementById('global-code-controls');
        if (existingControls) {
            existingControls.remove();
        }

        const controls = document.createElement('div');
        controls.id = 'global-code-controls';

        const collapseAllBtn = document.createElement('button');
        collapseAllBtn.className = 'global-toggle-btn';
        collapseAllBtn.textContent = '全部折叠';
        collapseAllBtn.onclick = collapseAllCodeBlocks;

        const expandAllBtn = document.createElement('button');
        expandAllBtn.className = 'global-toggle-btn';
        expandAllBtn.textContent = '全部展开';
        expandAllBtn.onclick = expandAllCodeBlocks;

        controls.appendChild(collapseAllBtn);
        controls.appendChild(expandAllBtn);

        document
            .body
            .appendChild(controls);
    }

    function collapseAllCodeBlocks() {
        const config = getPlatformConfig();
        const parentElements = document.querySelectorAll(config.parent);

        parentElements.forEach((parent) => {
            if (!parent.classList.contains('code-parent'))
                return;

            const btn = parent.querySelector('.code-toggle-btn');
            const codeElement = parent.querySelector(config.code) || parent.querySelector('code') || parent;

            if (btn && codeElement) {
                const currentHeight = codeElement.scrollHeight;

                parent.setAttribute('data-original-height', currentHeight);

                parent
                    .style
                    .setProperty('--code-max-height', currentHeight + 'px');

                codeElement
                    .classList
                    .remove('code-expanded');
                codeElement
                    .classList
                    .add('code-collapsed');
                btn.textContent = '展开';
                btn.setAttribute('data-collapsed', 'true');

                requestAnimationFrame(() => {
                    parent
                        .style
                        .setProperty('--code-max-height', '0');
                });
            }
        });
    }

    function expandAllCodeBlocks() {
        const config = getPlatformConfig();
        const parentElements = document.querySelectorAll(config.parent);

        parentElements.forEach((parent) => {
            if (!parent.classList.contains('code-parent'))
                return;

            const btn = parent.querySelector('.code-toggle-btn');
            const codeElement = parent.querySelector(config.code) || parent.querySelector('code') || parent;

            if (btn && codeElement) {

                const originalHeight = parent.getAttribute('data-original-height');
                if (originalHeight) {
                    parent
                        .style
                        .setProperty('--code-max-height', originalHeight + 'px');
                }

                codeElement
                    .classList
                    .remove('code-collapsed');
                codeElement
                    .classList
                    .add('code-expanded');
                btn.textContent = '折叠';
                btn.setAttribute('data-collapsed', 'false');
            }
        });
    }

    function init() {

        currentConfig = getPlatformConfig();
        console.log('代码折叠助手：检测到平台', window.location.hostname, '使用配置:', currentConfig);

        addFoldableCodeBlocks();
        createGlobalControls();

        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                    break;
                }
            }

            if (shouldProcess) {
                setTimeout(() => {
                    addFoldableCodeBlocks();
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('scroll', () => {
            const controls = document.getElementById('global-code-controls');
            if (controls) {}
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();