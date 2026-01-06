// ==UserScript==
// @name         GitHub Commits Quick Jump
// @namespace    https://github.com/aojunhao123
// @version      1.0.0
// @description  Add "Jump to Start" and "Jump to End" buttons on GitHub commits page
// @author       aojunhao123
// @license      MIT
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @homepageURL  https://github.com/aojunhao123/github-commits-quick-jump
// @supportURL   https://github.com/aojunhao123/github-commits-quick-jump/issues
// @grant        none
// @copyright    2026, aojunhao123(https://aojunhao.com)
// @downloadURL https://update.greasyfork.org/scripts/561623/GitHub%20Commits%20Quick%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/561623/GitHub%20Commits%20Quick%20Jump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 按钮容器 ID，用于防止重复插入
    const CONTAINER_ID = 'quick-jump-buttons';

    /**
     * 判断当前是否在 commits 页面
     */
    function isCommitsPage() {
        return /\/commits\//.test(window.location.pathname);
    }

    /**
     * 从仓库主页解析 commit 数量并存入 sessionStorage
     */
    function getCommits() {
        const elements = document.querySelectorAll("span .fgColor-default");
        for (const el of elements) {
            const match = el.innerText.match(/([\d,]+)\s*Commits?/i);
            if (match) {
                sessionStorage.setItem("commits", match[1]);
                return;
            }
        }
    }

    /**
     * 在 commits 页面插入跳转按钮
     */
    function insertButtons() {
        // 防止重复插入
        if (document.getElementById(CONTAINER_ID)) {
            return;
        }

        // 获取存储的 commit 数量
        const commitsStr = sessionStorage.getItem("commits");
        if (!commitsStr) {
            console.log('[Quick Jump] No commit count found, please visit repo main page first');
            return;
        }

        // 找到分页按钮
        const paginationNext = document.querySelector('a[data-testid="pagination-next-button"]');
        if (!paginationNext) {
            return;
        }

        const btnGroup = paginationNext.parentNode.parentNode;
        const commitsNum = parseInt(commitsStr.replace(/,/g, ""), 10);
        const basePath = window.location.pathname;

        // 创建按钮容器
        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.style.cssText = 'display: flex; gap: 8px; margin-left: 16px;';

        // 创建 "Jump to Start" 按钮（回到最新的 commits，即第一页）
        const btnToStart = document.createElement('a');
        btnToStart.className = paginationNext.className;
        btnToStart.href = basePath;
        btnToStart.innerText = "⏮ First";
        btnToStart.title = "Jump to latest commits";

        // 创建 "Jump to End" 按钮（跳到最早的 commits，即最后一页）
        // 复用分页按钮的 href（包含 commit hash），只替换 offset 数字
        const btnToEnd = document.createElement('a');
        btnToEnd.className = paginationNext.className;
        btnToEnd.href = paginationNext.href.replace(/\+\d+/, `+${commitsNum - 35}`);
        btnToEnd.innerText = "Last ⏭";
        btnToEnd.title = "Jump to first commit";

        // 添加按钮到容器
        container.appendChild(btnToStart);
        container.appendChild(btnToEnd);

        // 插入到按钮组后面
        btnGroup.parentNode.insertBefore(container, btnGroup.nextSibling);
    }

    /**
     * 页面变化时的处理函数
     */
    function handlePageChange() {
        if (isCommitsPage()) {
            // 在 commits 页面，插入跳转按钮
            insertButtons();
        } else {
            // 在其他页面（如主页），尝试获取 commit 数量
            getCommits();
        }
    }

    // 监听 GitHub 的 Turbo 导航事件（SPA 页面切换）
    document.addEventListener('turbo:load', handlePageChange);

    // 首次加载时执行
    handlePageChange();
})();
