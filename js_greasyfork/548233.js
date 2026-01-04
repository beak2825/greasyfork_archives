// ==UserScript==
// @name         FB Marketplace Item Sort
// @namespace    http://tampermonkey.net/
// @icon         https://www.facebook.com/favicon.ico
// @version      2025-09-24.2
// @description  Marketplace 排序上架日期控制面板
// @author       Henrik
// @match        *://www.facebook.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/548233/FB%20Marketplace%20Item%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/548233/FB%20Marketplace%20Item%20Sort.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PANEL_ID = 'marketplace-control-panel';
    const COLLAPSE_KEY = PANEL_ID + '-collapsed';
    let panel = null;
    let container = null;

    // ---------- 建立控制面板 ----------
    function createPanel() {
        if (panel) return;

        panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.position = 'fixed';
        panel.style.top = '80px';
        panel.style.right = '20px'; // 固定在右側
        panel.style.zIndex = '9999';
        panel.style.width = '220px';
        panel.style.background = 'rgba(255,255,255,0.97)';
        panel.style.border = '1px solid #ddd';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        panel.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial';
        panel.style.fontSize = '14px';
        panel.style.color = '#111';

        // 標題列
        const titleBar = document.createElement('div');
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.padding = '4px 6px';
        titleBar.style.background = '#f3f3f3';
        titleBar.style.fontWeight = '600';

        const title = document.createElement('div');
        title.textContent = 'Marketplace 排序';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '－';
        toggleBtn.style.border = 'none';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '16px';
        toggleBtn.style.lineHeight = '1';
        toggleBtn.style.padding = '0 6px';

        titleBar.appendChild(title);
        titleBar.appendChild(toggleBtn);
        panel.appendChild(titleBar);

        // 控制項容器
        container = document.createElement('div');
        container.style.padding = '8px';

        const controls = [
            {
                label: '排序方式',
                param: 'sortBy',
                type: 'select',
                options: [
                    { text: '推薦', value: 'best_match' },
                    { text: '從近到遠', value: 'distance_ascend' },
                    { text: '由新到舊', value: 'creation_time_descend' },
                    { text: '價格低至高', value: 'price_ascend' },
                    { text: '價格高至低', value: 'price_descend' }
                ]
            },
            {
                label: '上架日期（天）',
                param: 'daysSinceListed',
                type: 'select',
                options: [
                    { text: '不限', value: '' },
                    ...Array.from({ length: 30 }, (_, i) => ({ text: `${i + 1} 天內`, value: `${i + 1}` }))
                ]
            }
        ];

        const inputs = {};

        controls.forEach(ctrl => {
            const label = document.createElement('label');
            label.textContent = ctrl.label;
            label.style.fontWeight = '500';
            container.appendChild(label);

            if (ctrl.type === 'select') {
                const select = document.createElement('select');
                select.style.width = '100%';
                select.style.padding = '6px';
                select.style.borderRadius = '6px';
                select.style.border = '1px solid #ccc';
                select.style.fontSize = '13px';

                ctrl.options.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.value;
                    o.textContent = opt.text;
                    select.appendChild(o);
                });

                container.appendChild(select);
                inputs[ctrl.param] = select;
            }
        });

        panel.appendChild(container);
        document.body.appendChild(panel);

        // 初始化 URL 參數
        try {
            const url = new URL(window.location.href);
            controls.forEach(ctrl => {
                const val = url.searchParams.get(ctrl.param);
                if (val !== null && inputs[ctrl.param]) inputs[ctrl.param].value = val;
            });
        } catch (e) {
            console.warn('URL 解析失敗', e);
        }

        // select 改變即更新 URL 並刷新頁面
        function updateURL() {
            try {
                const newUrl = new URL(window.location.href);
                Object.entries(inputs).forEach(([param, el]) => {
                    const value = el.value;
                    if (value) newUrl.searchParams.set(param, value);
                    else newUrl.searchParams.delete(param);
                });
                window.location.href = newUrl.toString();
            } catch (e) {
                console.error('更新 URL 失敗', e);
            }
        }
        Object.values(inputs).forEach(el => el.addEventListener('change', updateURL));

        // ---------- 收合/展開 ----------
        function setCollapsed(collapsed) {
            if (collapsed) {
                container.style.display = 'none';
                panel.style.width = '160px';
                toggleBtn.textContent = '+';
            } else {
                container.style.display = 'block';
                panel.style.width = '220px';
                toggleBtn.textContent = '－';
            }
            localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
        }

        toggleBtn.addEventListener('click', () => {
            const isCollapsed = container.style.display !== 'none';
            setCollapsed(isCollapsed);
        });

        const savedCollapsed = localStorage.getItem(COLLAPSE_KEY);
        if (savedCollapsed === '1') setCollapsed(true);
    }

    function removePanel() {
        const p = document.getElementById(PANEL_ID);
        if (p) p.remove();
        panel = null;
    }

    // ---------- 判斷是否顯示 ----------
    function checkPanelVisibility() {
        const isMarketplacePage = !!window.location.pathname.match(/\/marketplace/);
        const isItemPage = window.location.pathname.includes('/item');

        if (isItemPage || !isMarketplacePage) {
            if (panel) removePanel();
        } else {
            if (!panel) createPanel();
        }
    }

    // ---------- SPA 導航支援 ----------
    (function () {
        const wrapHistory = function (type) {
            const orig = history[type];
            return function () {
                const rv = orig.apply(this, arguments);
                setTimeout(checkPanelVisibility, 300);
                return rv;
            };
        };
        history.pushState = wrapHistory('pushState');
        history.replaceState = wrapHistory('replaceState');
        window.addEventListener('popstate', () => setTimeout(checkPanelVisibility, 300));
    })();

    // 初始檢查
    checkPanelVisibility();

})();
