// ==UserScript==
// @name         Google Search Infinite Scroll & Open New Tab / 谷歌搜索无限滚动与新标签页
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically open links in a new tab and auto-load the next page results. / 自动在新标签页打开谷歌搜索结果，并实现无限滚动翻页。
// @author       Gemini
// @match        *://www.google.com/search*
// @match        *://www.google.com.hk/search*
// @match        *://www.google.co.jp/search*
// @match        *://www.google.co.uk/search*
// @match        *://www.google.cn/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557984/Google%20Search%20Infinite%20Scroll%20%20Open%20New%20Tab%20%20%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E4%B8%8E%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/557984/Google%20Search%20Infinite%20Scroll%20%20Open%20New%20Tab%20%20%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E4%B8%8E%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const DISTANCE_TO_BOTTOM = 800; // 距离底部多少像素时开始加载
    let isLoading = false; // 防止重复加载标志位

    // --- 功能 1: 强制新标签页打开 ---
    function openInNewTab() {
        // 选择主要结果、广告结果
        const selectors = [
            '#search a[href^="http"]:not([target="_blank"])',
            '#rso a[href^="http"]:not([target="_blank"])',
            '#tads a[href^="http"]:not([target="_blank"])',
            '#bottomads a[href^="http"]:not([target="_blank"])',
            // 针对追加加载的容器
            '.g a[href^="http"]:not([target="_blank"])'
        ];

        const links = document.querySelectorAll(selectors.join(','));

        links.forEach(link => {
            // 排除页码链接、功能链接
            if (link.getAttribute('href') &&
                !link.getAttribute('href').startsWith('#') &&
                !link.id.includes('pn') // 排除分页按钮
            ) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.addEventListener('click', (e) => e.stopPropagation(), { passive: true });
            }
        });
    }

    // --- 功能 2: 无限滚动逻辑 ---

    // 获取下一页的链接元素
    function getNextPageElement() {
        return document.querySelector('#pnnext'); // 谷歌标准的“下一页”ID
    }

    // 获取“更多结果”按钮（现代版谷歌有时不分页，而是显示按钮）
    function getMoreButton() {
        // 查找常见的“更多结果”按钮，通常包含特定类名或文本
        // 谷歌经常变换类名，这里尝试通过属性或层级查找
        const buttons = Array.from(document.querySelectorAll('a, div[role="button"]'));
        return buttons.find(el => el.innerText && (el.innerText.includes('More results') || el.innerText.includes('更多结果')));
    }

    async function loadNextPage() {
        if (isLoading) return;

        // 1. 优先检查是否有“更多结果”按钮（现代动态加载模式）
        const moreBtn = getMoreButton();
        if (moreBtn && moreBtn.offsetParent !== null) {
            isLoading = true;
            moreBtn.click(); // 直接点击谷歌原生的加载按钮
            console.log('Gemini Script: Clicked "More results" button.');

            // 等待一下重置状态
            setTimeout(() => { isLoading = false; }, 2000);
            return;
        }

        // 2. 传统分页模式（获取 #pnnext 链接）
        const nextLink = getNextPageElement();
        if (!nextLink) return; // 没有下一页了

        isLoading = true;
        const url = nextLink.href;

        // 插入一个加载提示
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style.cssText = 'text-align:center; padding: 20px; color: #666; font-size: 14px;';
        loadingIndicator.innerText = '正在加载下一页...';
        document.querySelector('#center_col').appendChild(loadingIndicator);

        try {
            const response = await fetch(url);
            const text = await response.text();

            // 解析返回的 HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // 提取新结果 (#rso 是搜索结果的主要容器)
            const newResults = doc.querySelector('#rso');
            const currentResults = document.querySelector('#rso');

            if (newResults && currentResults) {
                // 为了保持样式，我们创建一个分隔线
                const separator = document.createElement('div');
                separator.style.cssText = 'border-bottom: 1px dashed #dfe1e5; margin: 20px 0; text-align: center; color: #888; font-size: 12px;';
                separator.innerText = `--- 第 ${getPageNumber(url)} 页 ---`;
                currentResults.appendChild(separator);

                // 将新结果追加到当前页面
                // 注意：直接追加 innerHTML 可能会丢失事件，最好追加子节点
                while (newResults.firstChild) {
                    currentResults.appendChild(newResults.firstChild);
                }

                // 关键：更新页面底部的“下一页”链接，以便下次滚动能加载再下一页
                const newNextLink = doc.querySelector('#pnnext');
                const oldNextLink = document.querySelector('#pnnext');
                const navTable = document.querySelector('[role="navigation"] table'); // 分页导航条

                if (oldNextLink && newNextLink) {
                    oldNextLink.href = newNextLink.href; // 更新链接地址
                } else if (!newNextLink && navTable) {
                     // 如果没有下一页了，移除分页条
                    navTable.style.display = 'none';
                    loadingIndicator.innerText = '已到达底部';
                }
            }
        } catch (err) {
            console.error('Gemini Script Error:', err);
        } finally {
            loadingIndicator.remove();
            isLoading = false;
        }
    }

    // 辅助：尝试从URL提取页码
    function getPageNumber(url) {
        const match = url.match(/start=(\d+)/);
        if (match) {
            return (parseInt(match[1]) / 10) + 1;
        }
        return 'Next';
    }

    // --- 初始化与监听 ---

    // 1. 运行一次新标签页逻辑
    openInNewTab();

    // 2. 监听滚动事件（防抖处理）
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // 检查是否滚动到底部
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - DISTANCE_TO_BOTTOM) {
                loadNextPage();
            }
        }, 100);
    });

    // 3. 监听 DOM 变化 (用于处理新加载的内容，使其符合“新标签页打开”规则)
    const observer = new MutationObserver((mutations) => {
        openInNewTab();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();