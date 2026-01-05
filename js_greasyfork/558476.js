// ==UserScript==
// @name         DeepSeek 代码块展开折叠
// @namespace    http://www.junxiaopang.com/
// @version      0.1
// @description  给 .md-code-block-banner-wrap 区域增加展开/折叠按钮
// @author       俊小胖
// @match        https://chat.deepseek.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558476/DeepSeek%20%E4%BB%A3%E7%A0%81%E5%9D%97%E5%B1%95%E5%BC%80%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/558476/DeepSeek%20%E4%BB%A3%E7%A0%81%E5%9D%97%E5%B1%95%E5%BC%80%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化一次，并监听后续动态加载内容
    function init() {
        addToggleButtons();
        observeForNewBlocks();
    }

    // 给现有的 .md-code-block-banner-wrap 添加按钮
    function addToggleButtons(root = document) {
        const banners = root.querySelectorAll('.md-code-block-banner-wrap');
        banners.forEach(banner => {
            // 防止重复加按钮
            if (banner.dataset.hasToggle === '1') return;
            banner.dataset.hasToggle = '1';
            const divGrandchildren = banner.children[0]?.children[0]?.children[1]?.children[0];
            console.log("divGrandchildren",divGrandchildren)
            // 创建按钮
            const btn = document.createElement('button');
            btn.textContent = '折叠';
            btn.className = 'ds-atom-button ds-text-button ds-text-button--with-icon'
            btn.style.marginLeft = '8px';
            btn.style.cursor = 'pointer';
            btn.style.color = 'red';
            btn.style.padding = '2px 6px';
            btn.style.fontSize = '12px';
            // 默认找到紧跟在 banner 后面的代码块容器
            // 你可以根据实际 DOM 结构调整选择器
            // 例如：const codeBlock = banner.nextElementSibling;
            const codeBlock = banner.nextElementSibling;

            btn.addEventListener('click', () => {
                if (!codeBlock) return;

                const isHidden = codeBlock.style.display === 'none';
                codeBlock.style.display = isHidden ? '' : 'none';
                btn.textContent = isHidden ? '折叠' : '展开';
            });

            divGrandchildren.append(btn);
        });
    }

    // 监听后续新插入的代码块（聊天类页面经常是动态加载）
    function observeForNewBlocks() {
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                m.addedNodes.forEach(node => {
                    if (!(node instanceof HTMLElement)) return;

                    // 如果新节点本身或其子元素中包含 banner，则补按钮
                    if (node.matches && node.matches('.md-code-block-banner-wrap')) {
                        addToggleButtons(node.parentNode || node);
                    } else {
                        const innerBanner = node.querySelector?.('.md-code-block-banner-wrap');
                        if (innerBanner) {
                            addToggleButtons(node);
                        }
                    }
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // DOM 就绪后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
