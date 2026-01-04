// ==UserScript==
// @name         【图灵】Discord 左侧导航变宽 + 图标自适应 + 拖拽调整宽度
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动扩展导航栏，图标智能排布，并支持拖拽右侧边缘自由调整宽度
// @author       You (Optimized by Qwen)
// @match        https://discord.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAfCAYAAABgfwTIAAACPElEQVRYhe2XsW/TQBTGvyL+Cs5bByR2xyMVFZ3tZKMQytqkGRtCZoQYCWnmqlI3EqdrpEgZa3tGYmDrvf4bxwBn2cm78xElpAO/Jcrl3fnzu3ffvewppRQeGI92LYDjvyhXnEVJIgyGIxwcHiFJM2vsYDjCcfMEg+GoMpZjz1boSZohSTMMhhel8aDmox6FILoHABARhBAQ4gkAoNvrl+I9IVCPQgQ1H0HNX19Ut9fHOJ5WLvC3XF9dVgpjRSVphuPmycYFAb+ztpjPrDFsTS1v1ybRtWljRZSuo20yiaeQRO6ilot0G0giTOIb4+8lUUmaWd9gk0wsh6gkyha4aSSRsUxWMmXDE8LJZ1zjTEnIRY0riq/TbmExn+H66hKL+QyeEGxcIwpLcY0oNK7plCkTQc1Hp32af/eEwOdPH9nY4rgnBM4K85YxJSEXlVq2jsuKvlKKcFtWtZVctpwyxb0RJ1Tfha7jlaJsRU50vyKMc2XuRFXVKsfj4oImJBFeN9/hrH2KoOZjEt8Yr6Jur593BFyHsQwxz80v5IPDo39mnEUaUbhyaHbeeQqmNp1EmTxpW+Si6haTq/8xxE675eTUgPa2ltVATXZRavIkEbq9PnsStRE2ohCSqHQi9ZHXD9Cf43hq7Do67VbJkI2iNIPhiO15fv74zi5igutg9W1gzbgycCel+jaJ1fn7D2r/6TN1m6SmUCuv3rxVz1+8VF++Xqg7KZ3mGEUtC1yXdeZa/2Ltip37FMeDFPUL3fUp5paJc/oAAAAASUVORK5CYII=
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560061/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91Discord%20%E5%B7%A6%E4%BE%A7%E5%AF%BC%E8%88%AA%E5%8F%98%E5%AE%BD%20%2B%20%E5%9B%BE%E6%A0%87%E8%87%AA%E9%80%82%E5%BA%94%20%2B%20%E6%8B%96%E6%8B%BD%E8%B0%83%E6%95%B4%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/560061/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91Discord%20%E5%B7%A6%E4%BE%A7%E5%AF%BC%E8%88%AA%E5%8F%98%E5%AE%BD%20%2B%20%E5%9B%BE%E6%A0%87%E8%87%AA%E9%80%82%E5%BA%94%20%2B%20%E6%8B%96%E6%8B%BD%E8%B0%83%E6%95%B4%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isWide = false;
    let initialized = false;
    let resizerCreated = false;

    function waitForNav(callback) {
        const nav = document.querySelector('nav');
        if (nav && nav.querySelector('div[aria-label="服务器"]')) {
            callback(nav);
        } else {
            setTimeout(() => waitForNav(callback), 100);
        }
    }

    function getServerCount() {
        const list = document.querySelector('div[aria-label="服务器"]');
        return list ? list.children.length : 0;
    }

    function layoutServers(serverList) {
        serverList.style.display = 'grid';
        serverList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(40px, 1fr))';
        serverList.style.gap = '6px';
        serverList.style.padding = '8px 4px';
        serverList.style.justifyContent = 'flex-start';
        serverList.style.alignItems = 'center';

        const items = serverList.querySelectorAll('[class*="listItem"], [class*="iconInactive"]');
        items.forEach(item => {
            item.style.width = '40px';
            item.style.height = '40px';
            item.style.margin = '0';
            item.style.boxSizing = 'border-box';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
        });
    }

    function createResizer(nav) {
        if (resizerCreated) return;
        resizerCreated = true;

        const resizer = document.createElement('div');
        resizer.id = 'discord-nav-resizer';
        resizer.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 6px;
            height: 100%;
            background: transparent;
            cursor: col-resize;
            z-index: 999998;
            user-select: none;
        `;

        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            e.preventDefault();
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            // 计算新宽度：鼠标 X 坐标 - nav 左边界
            const newWidth = e.clientX - nav.getBoundingClientRect().left;
            if (newWidth >= 80 && newWidth <= 500) { // 限制合理范围
                nav.style.width = `${newWidth}px`;
                const serverList = document.querySelector('div[aria-label="服务器"]');
                if (serverList) layoutServers(serverList);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                // 更新状态（用于 toggle 按钮逻辑）
                isWide = nav.offsetWidth > 100;
                updateCount();
            }
        });

        nav.appendChild(resizer);
    }

    function createUI(nav) {
        if (document.getElementById('discord-nav-toggle-btn')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'discord-nav-toggle-btn';
        toggleBtn.textContent = '↔️';
        toggleBtn.title = '切换导航宽度';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 4px;
            left: 4px;
            z-index: 999999;
            width: 28px;
            height: 28px;
            background: rgba(0,0,0,0.4);
            color: white;
            border: none;
            border-radius: 0 0 4px 0;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        toggleBtn.onclick = () => {
            isWide = !isWide;
            nav.style.width = isWide ? '220px' : '';
            const serverList = document.querySelector('div[aria-label="服务器"]');
            if (serverList) layoutServers(serverList);
            updateCount();
        };
        document.body.appendChild(toggleBtn);

        const countEl = document.createElement('div');
        countEl.id = 'discord-server-count';
        countEl.style.cssText = `
            position: fixed;
            top: 6px;
            left: 36px;
            z-index: 999999;
            color: #aaa;
            font-size: 12px;
            pointer-events: none;
        `;
        const updateCount = () => {
            countEl.textContent = `${getServerCount()} 个服务器`;
        };
        updateCount();
        document.body.appendChild(countEl);

        // 提供全局更新函数
        window.discordNavUpdateCount = updateCount;
    }

    function init() {
        if (initialized) return;
        initialized = true;

        waitForNav((nav) => {
            isWide = true;
            nav.style.width = '220px';
            nav.style.position = 'relative'; // 确保 resizer 定位正确

            createUI(nav);
            createResizer(nav);

            const serverList = document.querySelector('div[aria-label="服务器"]');
            if (serverList) {
                layoutServers(serverList);
            } else {
                const observer = new MutationObserver(() => {
                    const list = document.querySelector('div[aria-label="服务器"]');
                    if (list) {
                        layoutServers(list);
                        observer.disconnect();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();