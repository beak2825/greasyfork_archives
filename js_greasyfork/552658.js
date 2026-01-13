// ==UserScript==
// @name            在 Zread 中打开
// @name:en         Read Repo in Zread
// @namespace       https://greasyfork.org/zh-CN/scripts/552658
// @version         1.1
// @description     在GitHub仓库页面添加按钮，快速跳转到Zread AI阅读器
// @description:en  Add a button on GitHub repository pages to quickly navigate to the Zread AI reader page
// @author          Corlius
// @match           https://github.com/*/*
// @icon            https://zread.ai/favicon.ico
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/552658/%E5%9C%A8%20Zread%20%E4%B8%AD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/552658/%E5%9C%A8%20Zread%20%E4%B8%AD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在仓库页面（而非用户/组织主页）
    function isRepoPage() {
        const pathParts = window.location.pathname.split('/').filter(part => part);
        // 路径应该至少包含用户名和仓库名，且不是用户主页
        return pathParts.length >= 2 &&
               !window.location.pathname.endsWith('.md') &&
               document.querySelector('[data-testid="repository-container"], .repository-content');
    }

    // 获取仓库信息
    function getRepoInfo() {
        const pathParts = window.location.pathname.split('/').filter(part => part);
        if (pathParts.length >= 2) {
            const owner = pathParts[0];
            const repo = pathParts[1];
            return { owner, repo };
        }
        return null;
    }

    // 创建Zread按钮
    function createZreadButton() {
        const repoInfo = getRepoInfo();
        if (!repoInfo) return null;

        // 创建按钮元素
        const button = document.createElement('a');
        button.href = `https://zread.ai/${repoInfo.owner}/${repoInfo.repo}`;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        
        // 使用 GitHub 原生 btn 类名以适配各种主题（包括 Catppuccin）
        // 之前的 prc-* 类名是动态生成的，不稳定且容易导致样式失效
        button.className = 'btn btn-sm';
        button.style.marginLeft = '8px'; // 添加一点间距，防止紧贴着其他按钮
        button.textContent = 'Zread';

        return button;
    }

    // 插入按钮到合适位置
    function insertButton() {
        if (!isRepoPage()) return;

        // 查找按钮容器 - GitHub的仓库操作按钮区域
        const buttonContainer = document.querySelector('[data-testid="repository-container"] .d-flex .d-flex:last-child') ||
                               document.querySelector('.repository-content .d-flex .d-flex:last-child') ||
                               document.querySelector('.pagehead-actions') ||
                               document.querySelector('.BtnGroup:last-of-type') ||
                               document.querySelector('.d-flex.gap-2');

        if (buttonContainer && !document.getElementById('zread-button')) {
            const zreadButton = createZreadButton();
            if (zreadButton) {
                zreadButton.id = 'zread-button';
                buttonContainer.appendChild(zreadButton);
                console.log('Zread按钮已添加');
            }
        }
    }

    // 监听页面变化（GitHub是SPA应用）
    let currentUrl = window.location.href;

    function handleUrlChange() {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            // URL变化时移除旧按钮
            const oldButton = document.getElementById('zread-button');
            if (oldButton) {
                oldButton.remove();
            }
            // 延迟一点时间等待页面渲染
            setTimeout(insertButton, 500);
        }
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                handleUrlChange();
                insertButton();
            }
        });
    });

    // 监听整个document的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后立即插入按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        setTimeout(insertButton, 100);
    }

    // 监听popstate事件（浏览器前进后退）
    window.addEventListener('popstate', function() {
        setTimeout(insertButton, 100);
    });

    console.log('Read Repo in Zread 用户脚本已加载');
})();