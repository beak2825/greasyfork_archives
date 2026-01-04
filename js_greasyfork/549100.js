// ==UserScript==
// @name         LunaTV输入YouTube网址观看的插件
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在LuaTV搜索YouTube视频页面，提供一个输入框可以输入网址观看视频，要点击以下视频中央的播放按钮才会在右上角出现输入框，获取YouTube视频网址v=Vo0n4PA_FbE，将LunaTV输入框网址中的embed/dQw4w9WgXcQ?修改为embed/Vo0n4PA_FbE?就可以点击刷新播放。
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549100/LunaTV%E8%BE%93%E5%85%A5YouTube%E7%BD%91%E5%9D%80%E8%A7%82%E7%9C%8B%E7%9A%84%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/549100/LunaTV%E8%BE%93%E5%85%A5YouTube%E7%BD%91%E5%9D%80%E8%A7%82%E7%9C%8B%E7%9A%84%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- grid 修改 ----------
    let gridFound = false;

    function fixGrid(div) {
        if (div.classList.contains('grid') &&
            div.classList.contains('grid-cols-1') &&
            div.classList.contains('gap-4')) {
            div.classList.remove('md:grid-cols-2', 'lg:grid-cols-3');
            gridFound = true; // 标记 grid 已找到
            checkIframe();    // 触发 iframe 检测
        }
    }

    document.querySelectorAll('div.grid.grid-cols-1.gap-4').forEach(fixGrid);

    const gridObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches('div.grid')) {
                        fixGrid(node);
                    }
                    node.querySelectorAll?.('div.grid').forEach(fixGrid);
                }
            });

            mutation.removedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches && node.matches('div.grid')) {
                    gridFound = !!document.querySelector('div.grid.grid-cols-1.gap-4');
                    if (!gridFound) removeIframePanel();
                }
            });
        }
    });
    gridObserver.observe(document.body, { childList: true, subtree: true });

    // ---------- iframe 控制 ----------
    let container = null;
    let input = null;
    let refreshBtn = null;
    let currentIframe = null;

    function createIframePanel(iframe) {
        if (container) return; // 已存在就不重复创建

        currentIframe = iframe;

        container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '99999';
        container.style.padding = '6px';
        container.style.background = 'white';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '6px';
        container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        container.style.cursor = 'move';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '6px';

        // 输入框
        input = document.createElement('input');
        input.type = 'text';
        input.value = iframe.src || '';
        input.style.width = '350px';
        input.style.fontSize = '14px';
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';

        // 刷新按钮
        refreshBtn = document.createElement('button');
        refreshBtn.textContent = '刷新';
        refreshBtn.style.padding = '5px 10px';
        refreshBtn.style.fontSize = '14px';
        refreshBtn.style.cursor = 'pointer';
        refreshBtn.style.border = '1px solid #888';
        refreshBtn.style.borderRadius = '4px';
        refreshBtn.style.background = '#f5f5f5';

        refreshBtn.addEventListener('click', () => {
            if (currentIframe) {
                currentIframe.src = currentIframe.src;
            }
        });

        function updateIframe() {
            if (currentIframe) {
                currentIframe.src = input.value;
            }
        }
        input.addEventListener('change', updateIframe);
        input.addEventListener('keyup', e => {
            if (e.key === 'Enter') updateIframe();
        });

        container.appendChild(input);
        container.appendChild(refreshBtn);
        document.body.appendChild(container);

        // 拖动逻辑
        let offsetX = 0, offsetY = 0, dragging = false;

        container.addEventListener('mousedown', e => {
            if (e.target === input || e.target === refreshBtn) return;
            dragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', e => {
            if (dragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
            container.style.cursor = 'move';
        });
    }

    function removeIframePanel() {
        if (container) {
            container.remove();
            container = null;
            input = null;
            refreshBtn = null;
            currentIframe = null;
        }
    }

    // 检测 iframe 是否存在（依赖 grid）
    function checkIframe() {
        if (!gridFound) {
            removeIframePanel();
            return;
        }
        const iframe = document.querySelector('iframe');
        if (iframe) {
            if (!container) {
                createIframePanel(iframe);
            } else {
                currentIframe = iframe;
                input.value = iframe.src || '';
            }
        } else {
            removeIframePanel();
        }
    }

    // 使用 MutationObserver 实时检测 iframe（但只有 gridFound 才执行）
    const iframeObserver = new MutationObserver(checkIframe);
    iframeObserver.observe(document.body, { childList: true, subtree: true });

    // 初始检测
    checkIframe();
})();
