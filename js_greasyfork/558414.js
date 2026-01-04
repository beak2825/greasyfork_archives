// ==UserScript==
// @name         腾讯文档多标签页
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  让腾讯文档像语雀一样点击文档不跳转到新页标签打开，而是像安装的PC版本腾讯文档一样实现多个Tab页切换。
// @author       Huathy https://gitee.com/huathy
// @match        https://docs.qq.com/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/558414/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A4%9A%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/558414/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E5%A4%9A%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TAB_STORAGE_KEY = 'tm_tencent_docs_tabs_v23';
    const HOME_URL = 'https://docs.qq.com/desktop';
    const HOME_TAB = { type: 'home', title: '首页', url: HOME_URL };

    const FONT_SIZE = '14px';
    const TAB_HEIGHT = 24; // px
    const CONTAINER_MARGIN_TOP = '16px';
    const CONTAINER_MARGIN_BOTTOM = '18px';

    // 判断是否为文档类页面（不含 query）
    function isDocPage(path) {
        return path.startsWith('/doc/') || path.startsWith('/sheet/') ||
               path.startsWith('/form/') || path.startsWith('/presentation/');
    }

    // 获取基础 docKey（如 sheet:ABC123），不含查询参数
    function getBaseDocKey() {
        const path = window.location.pathname;
        if (path === '/desktop' || path === '/') return 'home';
        const match = path.match(/^\/(doc|sheet|form|presentation)\/([A-Za-z0-9]+)/);
        return match ? `${match[1]}:${match[2]}` : null;
    }

    let docTabs = JSON.parse(localStorage.getItem(TAB_STORAGE_KEY) || '[]');

    // 保存 tabs 到 localStorage
    function saveTabs() {
        localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(docTabs));
    }

    // 更新当前文档的 URL 和标题（用于 tab 切换）
    function updateCurrentTabUrl() {
        const baseKey = getBaseDocKey();
        if (!baseKey || baseKey === 'home') return;

        const currentUrl = window.location.href;
        const title = document.title.trim() || '文档';

        const existingIndex = docTabs.findIndex(t => t.docKey === baseKey);
        if (existingIndex >= 0) {
            // 更新已有 tab 的 URL 和标题
            docTabs[existingIndex].url = currentUrl;
            docTabs[existingIndex].title = title;
            saveTabs();
            renderTabBar(); // 实时刷新标题显示
        } else {
            // 新文档，添加
            docTabs.push({ docKey: baseKey, title, url: currentUrl });
            if (docTabs.length > 12) docTabs.shift();
            saveTabs();
            renderTabBar();
        }
    }

    // 移除某个 tab
    function removeDocTab(docKey) {
        const wasCurrent = getBaseDocKey() === docKey;
        docTabs = docTabs.filter(t => t.docKey !== docKey);
        saveTabs();

        if (wasCurrent) {
            window.location.href = HOME_URL;
        } else {
            renderTabBar();
        }
    }

    // 移动 tab 位置（双击触发）
    function moveTabByInput(fromTabIndex, totalTabs) {
        const input = prompt(`当前共 ${totalTabs} 个 Tab\n请输入要移动到的位置（2 ~ ${totalTabs}）：`, '');
        if (input === null) return;

        const pos = parseInt(input, 10);
        if (isNaN(pos) || pos < 2 || pos > totalTabs) {
            alert('位置无效！请输入 2 到 ' + totalTabs + ' 之间的数字。');
            return;
        }

        const toIndexInDocTabs = pos - 2;
        const fromIndexInDocTabs = fromTabIndex;
        if (fromIndexInDocTabs === toIndexInDocTabs) return;

        const tab = docTabs[fromIndexInDocTabs];
        docTabs.splice(fromIndexInDocTabs, 1);
        docTabs.splice(toIndexInDocTabs, 0, tab);

        saveTabs();
        renderTabBar();
    }

    // 注入样式，下推主内容区域
    function adjustMainContainer() {
        const styleId = 'tm-container-offset-style';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #root,
            #workbenchContainer {
                margin-top: ${CONTAINER_MARGIN_TOP} !important;
            }
            #workbenchContainer {
                height: calc(100vh - ${CONTAINER_MARGIN_TOP}) !important;
                max-height: calc(100vh - ${CONTAINER_MARGIN_BOTTOM}) !important;
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(style);
    }

    // 渲染 Tab 栏
    function renderTabBar() {
        adjustMainContainer();

        let bar = document.getElementById('tm-docs-tab-bar');
        if (!bar) {
            bar = document.createElement('div');
            bar.id = 'tm-docs-tab-bar';
            bar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: ${TAB_HEIGHT}px;
                background: #f5f7fa;
                border-bottom: 1px solid #ddd;
                z-index: 2147483647;
                padding: 0 10px;
                font-size: ${FONT_SIZE};
                display: flex;
                gap: 8px;
                overflow-x: auto;
                overflow-y: hidden;
                white-space: nowrap;
                align-items: center;
                box-sizing: border-box;
                -webkit-overflow-scrolling: touch;
            `;
            document.body.prepend(bar);
        }

        const allTabs = [HOME_TAB, ...docTabs];
        const currentKey = getBaseDocKey() || 'home';
        const totalTabs = allTabs.length;

        bar.innerHTML = '';
        allTabs.forEach((tab, index) => {
            const isHome = tab.type === 'home';
            const key = isHome ? 'home' : tab.docKey;
            const isActive = key === currentKey;

            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                flex-shrink: 0;
            `;

            const label = document.createElement('span');
            label.textContent = (isHome ? '🏠' : '') +
                (tab.title.length > 18 ? tab.title.substring(0, 15) + '...' : tab.title);
            label.style.cssText = `
                display: inline-block;
                padding: 3px 8px;
                background: ${isActive ? '#1890ff' : '#e8eaed'};
                color: ${isActive ? 'white' : '#333'};
                border-radius: 4px;
                user-select: none;
                font-weight: ${isActive ? 'bold' : 'normal'};
                font-size: ${FONT_SIZE};
                line-height: 1.2;
                min-width: 36px;
                text-align: center;
                white-space: nowrap;
                box-sizing: border-box;
            `;
            label.title = `${isHome ? '首页' : tab.title}（位置：${index + 1}）`;
            label.onclick = () => {
                window.location.href = tab.url;
            };

            if (!isHome) {
                label.ondblclick = (e) => {
                    e.stopPropagation();
                    moveTabByInput(index - 1, totalTabs);
                };
            }

            container.appendChild(label);

            if (!isHome) {
                const closeBtn = document.createElement('span');
                closeBtn.textContent = '×';
                closeBtn.style.cssText = `
                    display: inline-block;
                    width: 15px;
                    height: 15px;
                    line-height: 15px;
                    text-align: center;
                    font-size: 12px;
                    background: #999;
                    color: white;
                    border-radius: 50%;
                    cursor: pointer;
                    user-select: none;
                    flex-shrink: 0;
                `;
                closeBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`确定关闭 "${tab.title}"？`)) {
                        removeDocTab(tab.docKey);
                    }
                };
                container.appendChild(closeBtn);
            }

            bar.appendChild(container);
        });
    }

    // 拦截页面内链接跳转（防止新开标签页）
    document.addEventListener('click', function (e) {
        let target = e.target;
        while (target && target.nodeName !== 'A') target = target.parentElement;
        if (!target || !target.href) return;

        try {
            const url = new URL(target.href, window.location.origin);
            if (url.hostname === 'docs.qq.com') {
                if (url.pathname === '/' || url.pathname === '/desktop' || isDocPage(url.pathname)) {
                    e.preventDefault();
                    window.location.href = target.href;
                }
            }
        } catch (err) {
            // ignore invalid URLs
        }
    }, true);

    // 👇 关键：监听前端路由变化（包括 ?tab=xxx 切换）
    (function () {
        const originalPushState = history.pushState;
        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            setTimeout(updateCurrentTabUrl, 100);
        };
        window.addEventListener('popstate', () => setTimeout(updateCurrentTabUrl, 100));
    })();

    // 初始化
    updateCurrentTabUrl(); // 自动处理首次加载或 tab 切换
    renderTabBar();
})();