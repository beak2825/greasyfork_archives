// ==UserScript==
// @name         Quicker 动作库自动翻页
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Quicker 动作库列表页自动向下滚动加载，提前预加载内容。
// @author       User
// @match        https://getquicker.net/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562947/Quicker%20%E5%8A%A8%E4%BD%9C%E5%BA%93%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/562947/Quicker%20%E5%8A%A8%E4%BD%9C%E5%BA%93%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 自动无限翻页功能
    // ==========================================

    let isLoading = false;
    let hasMore = true;

    // 创建底部加载状态提示
    const loadingTip = document.createElement('div');
    loadingTip.style.cssText = 'text-align: center; padding: 20px; color: #888; font-size: 14px; clear: both; width: 100%;';
    loadingTip.textContent = '正在加载更多内容...';
    loadingTip.style.display = 'none';

    // 尝试将提示插入到合适的位置
    function appendLoadingTip() {
        const table = document.querySelector('.table');
        if (table && table.parentNode) {
            if (!document.contains(loadingTip)) {
                table.parentNode.insertBefore(loadingTip, table.nextSibling);
            }
        } else {
             if (!document.contains(loadingTip)) {
                document.body.appendChild(loadingTip);
             }
        }
    }

    // 初始尝试插入
    appendLoadingTip();

    function getNextPageUrl() {
        // 在分页导航中查找“下一页”链接
        // 兼容不同的DOM结构，查找包含“下一页”文本的链接
        const links = document.querySelectorAll('.page-link');
        for (const link of links) {
            if (link.textContent.trim() === '下一页' || link.textContent.trim() === 'Next') {
                return link.href;
            }
        }
        return null;
    }

    async function loadNextPage() {
        // 确保页面有动作列表表格才执行
        if (!document.querySelector('.table tbody')) return;

        if (isLoading || !hasMore) return;

        const nextUrl = getNextPageUrl();
        if (!nextUrl) {
            hasMore = false;
            loadingTip.textContent = '--- 到底了，没有更多内容了 ---';
            loadingTip.style.display = 'block';
            return;
        }

        isLoading = true;
        appendLoadingTip(); // 确保提示元素存在
        loadingTip.style.display = 'block';
        loadingTip.textContent = '正在加载下一页...';

        try {
            console.log('正在获取下一页:', nextUrl);
            const response = await fetch(nextUrl);
            if (!response.ok) throw new Error('网络响应异常');

            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // 提取新页面的表格行
            const newRows = doc.querySelectorAll('.table tbody tr');
            const currentTbody = document.querySelector('.table tbody');

            if (newRows.length > 0 && currentTbody) {
                const fragment = document.createDocumentFragment();

                // 检测第一行是否为表头
                let startIndex = 0;
                const firstRow = newRows[0];
                if (firstRow.querySelector('th')) {
                    startIndex = 1; // 如果是表头则跳过
                }

                for (let i = startIndex; i < newRows.length; i++) {
                    const importedNode = document.importNode(newRows[i], true);
                    fragment.appendChild(importedNode);
                }

                currentTbody.appendChild(fragment);

                // 关键：更新页面底部的分页导航，以便下一次能找到新的“下一页”链接
                const currentPagination = document.querySelector('.pagination');
                const newPagination = doc.querySelector('.pagination');

                if (currentPagination && newPagination) {
                    currentPagination.innerHTML = newPagination.innerHTML;
                } else if (currentPagination) {
                    // 如果新页面没有分页条，说明是最后一页
                    currentPagination.style.display = 'none';
                }

            } else {
                hasMore = false;
                loadingTip.textContent = '--- 到底了，没有更多内容了 ---';
            }

        } catch (error) {
            console.error('自动翻页加载失败:', error);
            loadingTip.textContent = '加载失败，请手动翻页或刷新重试';
            // 出错后允许重试，但不立即重置isLoading，防止疯狂报错
            setTimeout(() => { isLoading = false; }, 2000);
            return;
        }

        isLoading = false;
        if (hasMore) {
            loadingTip.style.display = 'none';
        }
    }

    // 滚动事件防抖处理
    let scrollTimer = null;
    const checkAndLoad = () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        // 当距离底部小于 2000px 时触发加载（提前加载）
        if (scrollTop + clientHeight >= scrollHeight - 3500) {
            loadNextPage();
        }
    };

    window.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(checkAndLoad, 100);
    });

    // 初始加载检查（防止页面内容过少无法触发滚动）
    setTimeout(checkAndLoad, 1000);

})();
