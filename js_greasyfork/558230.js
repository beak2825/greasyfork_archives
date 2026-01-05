// ==UserScript==
// @name         ChatGPT 聊天整理助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 ChatGPT 侧边栏批量删除对话（模拟人工点击），自行承担风险使用。
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558230/ChatGPT%20%E8%81%8A%E5%A4%A9%E6%95%B4%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558230/ChatGPT%20%E8%81%8A%E5%A4%A9%E6%95%B4%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const THEME_KEY = 'cgpt-bulk-theme';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function injectStyle() {
        if (document.getElementById('cgpt-bulk-style')) return;
        const style = document.createElement('style');
        style.id = 'cgpt-bulk-style';
        style.textContent = `
    #cgpt-bulk-panel {
      position: fixed;
      z-index: 9999;
      background: rgba(17, 24, 39, 0.96);
      backdrop-filter: blur(10px);
      color: #e5e7eb;
      padding: 10px 12px;
      border-radius: 12px;
      font-size: 12px;
      max-width: 340px;
      max-height: 60vh;
      overflow: hidden;
      box-shadow: 0 18px 45px rgba(0,0,0,.35);
      border: 1px solid rgba(148, 163, 184, 0.35);
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0;
      transform: translateY(6px) scale(0.97);
      pointer-events: none;
      transition:
        opacity 0.28s cubic-bezier(0.22,0.61,0.36,1),
        transform 0.28s cubic-bezier(0.22,0.61,0.36,1);
    }

    #cgpt-bulk-panel.cgpt-visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    #cgpt-panel-header {
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: move;
      color: #f9fafb;
    }

    #cgpt-panel-header-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    #cgpt-panel-header-badge {
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 999px;
      background: rgba(96,165,250,0.2);
      color: #bfdbfe;
    }

    .cgpt-theme-toggle {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      padding: 1px 8px;
      font-size: 10px;
      background: transparent;
      color: inherit;
      cursor: pointer;
    }

    #cgpt-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .cgpt-btn {
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      padding: 3px 10px;
      font-size: 11px;
      background: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
      cursor: pointer;
      transition:
        background 0.15s ease,
        border-color 0.15s ease,
        transform 0.1s ease,
        box-shadow 0.15s ease;
    }

    .cgpt-btn:hover {
      background: rgba(30, 64, 175, 0.85);
      border-color: rgba(129, 140, 248, 0.9);
      transform: translateY(-0.5px);
    }

    /* 深色主题下的危险按钮：偏扁平、半透明红 */
    .cgpt-btn-danger {
      background: rgba(248, 113, 113, 0.16);
      border-color: rgba(248, 113, 113, 0.9);
      color: #fecaca;
    }
    
    .cgpt-btn-danger:hover {
      background: rgba(248, 113, 113, 0.35);
      border-color: rgba(248, 113, 113, 1);
      color: #fee2e2;
    }

    #cgpt-subtoolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 11px;
    }

    #cgpt-select-all-label {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #e5e7eb;
      cursor: pointer;
      white-space: nowrap;
    }

    #cgpt-select-toggle {
      accent-color: #60a5fa;
    }

    #cgpt-status {
      font-size: 11px;
      color: #9ca3af;
      padding: 4px 6px;
      border-radius: 6px;
      background: rgba(15, 23, 42, 0.9);
    }

    #cgpt-list {
      margin-top: 2px;
      padding-right: 2px;
      overflow: auto;
    }

    .cgpt-item-row {
      padding: 2px 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      color: #e5e7eb;
    }

    .cgpt-item-row:nth-child(odd) {
      background: rgba(15, 23, 42, 0.85);
    }

    .cgpt-item-row:nth-child(even) {
      background: rgba(17, 24, 39, 0.9);
    }

    .cgpt-item-label {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      cursor: pointer;
    }

    .cgpt-item-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cgpt-item-row input[type="checkbox"] {
      accent-color: #60a5fa;
    }

    .cgpt-item-row.cgpt-item-deleted {
      opacity: 0.35;
      text-decoration: line-through;
    }

    .cgpt-current-highlight {
      background-color: rgba(234, 179, 8, 0.18) !important;
    }
    

    #cgpt-result {
      font-size: 11px;
      margin-top: 2px;
      padding: 4px 6px;
      border-radius: 6px;
      background: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
    }
    #cgpt-result .cgpt-result-line {
      margin-top: 2px;
      font-size: 10px;
      line-height: 1.4;
    }

    #cgpt-result .cgpt-result-note {
      margin-top: 3px;
      opacity: 0.8;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-result .cgpt-result-note {
      color: #6b7280;
    }

    .cgpt-result-empty {
      color: #6b7280;
    }

    #cgpt-search-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    #cgpt-search {
      width: 100%;
      border-radius: 999px;
      border: 1px solid rgba(55,65,81,0.9);
      background: rgba(15,23,42,0.9);
      color: #e5e7eb;
      padding: 3px 22px 3px 8px;
      font-size: 11px;
    }

    #cgpt-search::placeholder {
      color: #6b7280;
      font-size: 11px;
    }

    #cgpt-search-clear {
      position: absolute;
      right: 6px;
      border: none;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
      font-size: 11px;
      padding: 0;
      line-height: 1;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      transition: background 0.15s ease, color 0.15s ease, transform 0.06s ease;
    }

    #cgpt-search-clear:hover {
      background: rgba(148,163,184,0.25);
      color: #374151;
      transform: translateY(-0.5px);
    }

    /* ====== 浅色主题覆盖 ====== */
    #cgpt-bulk-panel.cgpt-theme-light {
      background: #f9fafb;
      color: #111827;
      border-color: #d1d5db;
      box-shadow: 0 16px 40px rgba(15,23,42,0.15);
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-panel-header {
      color: #111827;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-panel-header-badge {
      background: rgba(59,130,246,0.1);
      color: #1d4ed8;
    }

    #cgpt-bulk-panel.cgpt-theme-light .cgpt-btn {
      background: #f3f4f6;
      color: #111827;
      border-color: #d1d5db;
    }

    #cgpt-bulk-panel.cgpt-theme-light .cgpt-btn:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    /* 浅色主题下的危险按钮 */
    #cgpt-bulk-panel.cgpt-theme-light .cgpt-btn-danger {
      background: #fee2e2;
      border-color: #fecaca;
      color: #b91c1c;
    }
    
    #cgpt-bulk-panel.cgpt-theme-light .cgpt-btn-danger:hover {
      background: #fecaca;
      border-color: #fca5a5;
      color: #7f1d1d;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-status,
    #cgpt-bulk-panel.cgpt-theme-light #cgpt-result {
      background:#e5e7eb;
      color:#374151;
    }

    #cgpt-bulk-panel.cgpt-theme-light .cgpt-item-row:nth-child(odd) {
      background:#f9fafb;
      color:#111827;
    }

    #cgpt-bulk-panel.cgpt-theme-light .cgpt-item-row:nth-child(even) {
      background:#f3f4f6;
      color:#111827;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-select-all-label {
      color:#111827;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-search {
      background:#ffffff;
      color:#111827;
      border-color:#d1d5db;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-search::placeholder {
      color:#9ca3af;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-search-clear {
      color:#9ca3af;
    }

    #cgpt-bulk-panel.cgpt-theme-light #cgpt-search-clear:hover {
      color:#6b7280;
    }

    #cgpt-bulk-panel.cgpt-theme-light .cgpt-item-row.cgpt-item-deleted {
      color:#9ca3af;
    }

    /* 浮动 CLEAR 按钮（固定浅底） */
    #cgpt-fab-container {
      position: fixed;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    #cgpt-fab {
      width: 52px;
      height: 52px;
      border-radius: 999px;
      background: #ffffff;
      border: 1px solid rgba(148,163,184,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #111827;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(15,23,42,0.20);
      user-select: none;
      transition:
        box-shadow 0.18s ease,
        transform 0.12s ease,
        border-color 0.18s ease;
    }

    #cgpt-fab:hover {
      box-shadow: 0 7px 18px rgba(15,23,42,0.26);
      transform: translateY(-1px);
      border-color: rgba(148,163,184,0.9);
    }

    #cgpt-fab-close {
      width: 24px;
      height: 24px;
      border-radius: 999px;
      border: 1px solid rgba(148,163,184,0.6);
      background: #f3f4f6;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition:
        opacity 0.15s ease,
        transform 0.15s ease,
        background 0.15s ease,
        color 0.15s ease;
    }

    #cgpt-fab-close:hover {
      background: #e5e7eb;
      color: #4b5563;
      transform: translateY(-1px);
    }

    #cgpt-fab-container:hover #cgpt-fab-close {
      opacity: 1;
      pointer-events: auto;
    }
  `;
        document.head.appendChild(style);
    }

    function simulateRealClick(el) {
        if (!el) return;
        const events = [
            'pointerover',
            'mouseover',
            'mousedown',
            'pointerdown',
            'mouseup',
            'pointerup',
            'click'
        ];
        for (const type of events) {
            const evt = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            el.dispatchEvent(evt);
        }
    }

    // 只把真正的聊天 (href 以 /c/ 开头) 当成待删对象
    function findConversationNodes() {
        const links = Array.from(
            document.querySelectorAll('a.__menu-item[data-sidebar-item="true"][href^="/c/"]')
        );

        const items = [];

        links.forEach(a => {
            const container = a;

            if (!container.__cgptId) {
                container.__cgptId = 'cgpt-' + Math.random().toString(36).slice(2);
            }

            const titleNode = a.querySelector('span[dir="auto"]') || a;
            const title = (titleNode.textContent || '').trim().split('\n')[0];

            items.push({
                id: container.__cgptId,
                container,
                title: title || '(无标题对话)'
            });
        });

        return items;
    }

    function injectPanel() {
        if (document.getElementById('cgpt-bulk-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'cgpt-bulk-panel';

        panel.innerHTML = `
    <div id="cgpt-panel-header">
      <span>ChatGPT 聊天整理助手</span>
      <div id="cgpt-panel-header-right">
        <button id="cgpt-theme-toggle" class="cgpt-theme-toggle" title="切换明暗主题">暗黑</button>
        <span id="cgpt-panel-header-badge">beta</span>
      </div>
    </div>
    <div id="cgpt-toolbar">
      <button id="cgpt-scan" class="cgpt-btn">刷新列表</button>
      <button id="cgpt-create-test" class="cgpt-btn">生成测试</button>
      <button id="cgpt-clear" class="cgpt-btn">清空</button>
      <button id="cgpt-delete" class="cgpt-btn cgpt-btn-danger">删除</button>
    </div>
    <div id="cgpt-subtoolbar">
      <label id="cgpt-select-all-label">
        <input type="checkbox" id="cgpt-select-toggle">
        <span>本页全选</span>
      </label>
      <div id="cgpt-search-wrapper">
        <input id="cgpt-search" type="text" placeholder="标题关键字过滤">
        <button id="cgpt-search-clear" type="button" aria-label="清除搜索">×</button>
      </div>
    </div>
    <div id="cgpt-status">请点击「刷新列表」，将读取当前左侧可见的聊天。</div>
    <div id="cgpt-result" class="cgpt-result-empty"></div>
    <div id="cgpt-list"></div>
  `;

        document.body.appendChild(panel);

        positionPanelNextToSidebar(panel);
        initTheme(panel);
        makePanelDraggable(panel, document.getElementById('cgpt-panel-header'));
    }

    // 让面板可以拖动
    function makePanelDraggable(panel, handle) {
        if (!panel || !handle) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = panel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            panel.style.right = '';
            panel.style.bottom = '';

            function onMouseMove(ev) {
                if (!isDragging) return;
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;

                panel.style.left = startLeft + dx + 'px';
                panel.style.top = startTop + dy + 'px';
            }

            function onMouseUp() {
                if (!isDragging) return;
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function positionPanelNextToSidebar(panel) {
        try {
            const nav = document.querySelector('nav');
            if (nav) {
                const rect = nav.getBoundingClientRect();
                panel.style.left = (rect.right + 8) + 'px';
                panel.style.top = (rect.top + 8) + 'px';
            } else {
                panel.style.left = '280px';
                panel.style.top = '60px';
            }
        } catch (e) {
            panel.style.left = '280px';
            panel.style.top = '60px';
        }
    }

    let currentItems = [];
    let filteredItems = [];
    let currentFilter = '';

    function setStatus(text) {
        const s = document.getElementById('cgpt-status');
        if (s) s.textContent = text;
    }

    function applyFilterAndRender() {
        if (!Array.isArray(currentItems)) currentItems = [];
        if (!currentFilter) {
            filteredItems = currentItems.slice();
        } else {
            const q = currentFilter.trim().toLowerCase();
            filteredItems = currentItems.filter(it =>
                (it.title || '').toLowerCase().includes(q)
            );
        }
        renderList();
    }

    function renderList() {
        const listDiv = document.getElementById('cgpt-list');
        if (!listDiv) return;
        listDiv.innerHTML = '';

        const source = filteredItems || [];
        source.forEach((it, idx) => {
            const row = document.createElement('div');
            row.className = 'cgpt-item-row';

            row.innerHTML = `
      <label class="cgpt-item-label">
        <input type="checkbox" class="cgpt-item-checkbox" data-id="${it.id}">
        <span class="cgpt-item-title">[${idx + 1}] ${it.title}</span>
      </label>
    `;

            listDiv.appendChild(row);
        });

        const total = currentItems.length;
        const cur = source.length;
        if (total === 0) {
            setStatus('当前列表为空，请先点击「刷新列表」。');
        } else if (!currentFilter) {
            setStatus(`已发现 ${cur} 条对话（仅当前视图可见部分）。`);
        } else {
            setStatus(`已发现 ${cur} 条匹配结果（扫描总数 ${total} 条）。`);
        }

        const toggle = document.getElementById('cgpt-select-toggle');
        if (toggle) {
            const boxes = listDiv.querySelectorAll('.cgpt-item-checkbox:not(:disabled)');
            const checkedCount = listDiv.querySelectorAll('.cgpt-item-checkbox:not(:disabled):checked').length;
            if (!boxes.length) {
                toggle.checked = false;
                toggle.indeterminate = false;
            } else {
                toggle.checked = checkedCount === boxes.length;
                toggle.indeterminate = checkedCount > 0 && checkedCount < boxes.length;
            }
        }
    }

    // 简单转义，避免标题里有 < > 之类破坏 HTML
    function escapeHTML(str) {
        return (str || '').replace(/[&<>"']/g, s => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'
        }[s] || s));
    }

    function renderDeleteResult(logs, success, fail) {
        const resultDiv = document.getElementById('cgpt-result');
        if (!resultDiv) return;

        if (!logs || !logs.length) {
            resultDiv.classList.add('cgpt-result-empty');
            resultDiv.textContent = '';
            return;
        }

        resultDiv.classList.remove('cgpt-result-empty');

        const oks = logs.filter(l => String(l.status).toUpperCase() === 'OK');
        const fails = logs.filter(l => String(l.status).toUpperCase() === 'FAIL');

        const fmtTitles = (arr, maxCount = 5) => {
            if (!arr.length) return '';
            const titles = arr.map(l => l.title || '(无标题)').slice(0, maxCount);
            let text = titles.join('、');
            if (arr.length > maxCount) {
                text += ` 等 ${arr.length} 条`;
            }
            return escapeHTML(text);
        };

        let html = `<div>本次删除：成功 ${success} 条，失败 ${fail} 条</div>`;

        const okText = fmtTitles(oks);
        if (okText) {
            html += `<div class="cgpt-result-line">成功：${okText}</div>`;
        }

        const failText = fmtTitles(fails);
        if (failText) {
            html += `<div class="cgpt-result-line">失败：${failText}</div>`;
        }

        html += `<div class="cgpt-result-line cgpt-result-note">完整明细可在 Console 中查看（分组：ChatGPT 批量删除结果）。</div>`;

        resultDiv.innerHTML = html;
    }

    async function deleteSelected() {
        const checkboxes = Array.from(
            document.querySelectorAll('.cgpt-item-checkbox')
        ).filter(cb => cb.checked);

        if (!checkboxes.length) {
            setStatus('未选中任何对话。');
            return;
        }

        if (!confirm(`确定要删除 ${checkboxes.length} 条对话？此操作无法撤销。`)) {
            return;
        }

        const map = {};
        currentItems.forEach(it => {
            map[it.id] = it;
        });

        let success = 0;
        let fail = 0;
        const logs = [];

        for (const cb of checkboxes) {
            const item = map[cb.dataset.id];
            if (!item) {
                fail++;
                logs.push({title: '(未知项)', status: 'FAIL', reason: '未在 currentItems 中找到'});
                continue;
            }

            try {
                const node = item.container;

                node.scrollIntoView({block: 'center', behavior: 'smooth'});
                await sleep(500);

                node.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
                node.dispatchEvent(new MouseEvent('mouseover', {bubbles: true}));
                await sleep(150);

                let moreBtn =
                    node.querySelector('button[data-testid$="-options"]') ||
                    node.querySelector('button[aria-label*="选项"]') ||
                    node.querySelector('button[aria-haspopup="menu"]') ||
                    node.querySelector('button');

                if (!moreBtn) {
                    throw new Error('找不到更多按钮');
                }

                moreBtn.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
                moreBtn.dispatchEvent(new MouseEvent('mouseover', {bubbles: true}));
                await sleep(80);

                simulateRealClick(moreBtn);

                let menuDeleteCandidate = null;
                for (let i = 0; i < 15; i++) {
                    await sleep(100);
                    const menu = document.querySelector(
                        'div[role="menu"][data-radix-menu-content][data-state="open"]'
                    );
                    if (!menu) continue;

                    const el = menu.querySelector('[data-testid="delete-chat-menu-item"]');
                    if (el) {
                        menuDeleteCandidate = el;
                        break;
                    }
                }

                if (!menuDeleteCandidate) {
                    throw new Error('找不到菜单中的删除项');
                }

                let clickable =
                    menuDeleteCandidate.closest('[role="menuitem"]') || menuDeleteCandidate;
                simulateRealClick(clickable);
                await sleep(300);

                let confirmBtn = null;
                for (let i = 0; i < 20; i++) {
                    await sleep(100);
                    const dialog = document.querySelector(
                        'div[role="dialog"][data-modal-layer="content"][data-state="open"]'
                    );
                    if (!dialog) continue;

                    confirmBtn = dialog.querySelector(
                        'button[data-testid="delete-conversation-confirm-button"]'
                    );
                    if (!confirmBtn) {
                        confirmBtn = Array.from(dialog.querySelectorAll('button')).find(b => {
                            const t = (b.textContent || '').trim();
                            return /删除|Delete/i.test(t);
                        });
                    }
                    if (confirmBtn) break;
                }

                if (!confirmBtn) {
                    throw new Error('找不到确认删除按钮');
                }

                simulateRealClick(confirmBtn);

                let removed = false;
                for (let i = 0; i < 15; i++) {
                    await sleep(200);
                    if (!document.body.contains(node)) {
                        removed = true;
                        break;
                    }
                }

                if (!removed) {
                    throw new Error('节点未消失，疑似删除失败');
                }

                success++;

                const row = document
                    .querySelector(`.cgpt-item-row input[data-id="${item.id}"]`)
                    ?.closest('.cgpt-item-row');
                if (row) {
                    row.classList.add('cgpt-item-deleted');
                    const rowCb = row.querySelector('input[type="checkbox"]');
                    if (rowCb) rowCb.disabled = true;
                }

                logs.push({title: item.title, status: 'OK', reason: ''});
                console.log(`[OK] 删除成功：${item.title}`);
                setStatus(`处理中：已成功删除 ${success} 条，失败 ${fail} 条……`);
            } catch (e) {
                fail++;
                const reason = e && e.message ? e.message : String(e);
                logs.push({title: item.title, status: 'FAIL', reason});
                console.warn(`[FAIL] 删除失败：${item.title} - ${reason}`);
                setStatus(`处理中：已成功删除 ${success} 条，失败 ${fail} 条……`);
                await sleep(500);
            }
        }

        console.group('ChatGPT 批量删除结果');
        console.table(logs);
        console.groupEnd();

        renderDeleteResult(logs, success, fail);

        // 删除完成后重新扫描，让侧栏和面板保持一致
        currentItems = findConversationNodes();
        applyFilterAndRender();

        setStatus(`完成：成功 ${success} 条，失败 ${fail} 条。已重新扫描当前侧栏列表。`);
    }

    // 统一兼容 textarea / ProseMirror contenteditable
    async function findChatInput() {
        let inputEl = null;
        for (let i = 0; i < 40; i++) {      // 最多等 10s
            await sleep(250);

            // 1. 优先找新版 ProseMirror
            const ces = Array.from(
                document.querySelectorAll('div[contenteditable="true"]')
            );
            inputEl = ces.find(el =>
                el.id === 'prompt-textarea' ||
                el.classList.contains('ProseMirror')
            );
            if (inputEl && inputEl.offsetParent !== null &&
                inputEl.offsetWidth > 0 && inputEl.offsetHeight > 0) {
                break;
            }

            // 2. 退回老版 textarea
            const tas = Array.from(document.querySelectorAll('textarea'));
            inputEl = tas.find(t =>
                !t.disabled &&
                t.offsetParent !== null &&
                t.offsetWidth > 0 &&
                t.offsetHeight > 0
            );
            if (inputEl) break;
        }
        return inputEl;
    }

    async function waitForSendButton() {
        const selectors = [
            'button[data-testid="send-button"]',
            'button[aria-label*="发送"]',
            'button[aria-label*="Send"]',
            'button[type="submit"]'
        ];
        let btn = null;
        const maxLoop = 20; // 20 * 200ms = 4s
        for (let i = 0; i < maxLoop; i++) {
            for (const sel of selectors) {
                const candidate = document.querySelector(sel);
                if (
                    candidate &&
                    candidate.offsetParent !== null &&
                    !candidate.disabled &&
                    candidate.getAttribute('aria-disabled') !== 'true'
                ) {
                    btn = candidate;
                    break;
                }
            }
            if (btn) break;
            await sleep(200);
        }
        return btn;
    }

    // 新建测试会话：点击“新聊天”并发送一条随机测试内容
    async function createTestChat() {
        try {
            setStatus('正在创建测试会话……');

            // 1. 找“新聊天”按钮
            const newSelectors = [
                'button[data-testid="new-chat-button"]',
                'a[data-testid="new-chat-button"]',
                'button[aria-label*="新聊天"]',
                'a[aria-label*="新聊天"]',
                'button[aria-label*="New chat"]',
                'a[aria-label*="New chat"]',
                'a[href="/?model="]',
                'a[href="/"]'
            ];
            let newBtn = null;
            for (const sel of newSelectors) {
                newBtn = document.querySelector(sel);
                if (newBtn) break;
            }
            if (!newBtn) throw new Error('找不到「新聊天」按钮');

            simulateRealClick(newBtn);

            // 2. 等待输入框
            const inputEl = await findChatInput();
            if (!inputEl) throw new Error('找不到可见输入框');

            // 3. 填入随机测试文案
            const text = '测试 ' + Math.random().toString(36).slice(2, 8);

            if (inputEl.tagName === 'TEXTAREA') {
                inputEl.focus();
                inputEl.value = text;
                inputEl.dispatchEvent(new InputEvent('input', {bubbles: true}));
                inputEl.dispatchEvent(new Event('change', {bubbles: true}));
            } else if (inputEl.isContentEditable) {
                inputEl.focus();
                const sel = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(inputEl);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);

                inputEl.textContent = text;
                const ev = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: text,
                    inputType: 'insertText'
                });
                inputEl.dispatchEvent(ev);
            }

            // 4. 等待发送按钮可用并点击
            let sendBtn = await waitForSendButton();

            if (sendBtn) {
                simulateRealClick(sendBtn);
                setStatus('测试会话已创建，点击「刷新列表」即可加载到列表。');
            } else {
                // 兜底：模拟回车
                const opt = {
                    key: 'Enter',
                    code: 'Enter',
                    which: 13,
                    keyCode: 13,
                    bubbles: true
                };
                (inputEl || document.activeElement || document.body)
                    .dispatchEvent(new KeyboardEvent('keydown', opt));
                (inputEl || document.activeElement || document.body)
                    .dispatchEvent(new KeyboardEvent('keyup', opt));

                setStatus('已输入测试内容并尝试发送，如未成功可手动回车发送。');
            }
        } catch (e) {
            console.error('[测试会话创建失败]', e);
            setStatus('创建测试会话失败：' + (e && e.message ? e.message : e));
        }
    }

    function applyTheme(panel, theme) {
        if (!panel) return;
        if (theme === 'dark') {
            panel.classList.remove('cgpt-theme-light');
        } else {
            panel.classList.add('cgpt-theme-light');
        }
        const btn = panel.querySelector('#cgpt-theme-toggle');
        if (btn) {
            btn.textContent = theme === 'dark' ? '浅色' : '暗黑';
        }
    }

    function initTheme(panel) {
        let theme = localStorage.getItem(THEME_KEY);
        if (theme !== 'dark' && theme !== 'light') {
            theme = 'light'; // 默认浅色
        }
        applyTheme(panel, theme);
    }

    // 深浅主题切换（补上缺失函数）
    function toggleTheme() {
        const panel = document.getElementById('cgpt-bulk-panel');
        if (!panel) return;
        const isLight = panel.classList.contains('cgpt-theme-light');
        const next = isLight ? 'dark' : 'light';
        applyTheme(panel, next);
        localStorage.setItem(THEME_KEY, next);
    }

    // 打开面板：从 CLEAR 按钮位置“长出来”
    function openPanelFrom(originEl) {
        const panel = document.getElementById('cgpt-bulk-panel');
        if (!panel) return;

        if (panel.classList.contains('cgpt-visible')) return;

        panel.classList.add('cgpt-visible');

        if (!originEl) {
            return;
        }

        try {
            const pr = panel.getBoundingClientRect();
            const or = originEl.getBoundingClientRect();

            const panelCx = pr.left + pr.width / 2;
            const panelCy = pr.top + pr.height / 2;
            const originCx = or.left + or.width / 2;
            const originCy = or.top + or.height / 2;

            const dx = originCx - panelCx;
            const dy = originCy - panelCy;

            panel.style.transition = 'none';
            panel.style.opacity = '0';
            panel.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
            panel.getBoundingClientRect(); // 强制重排

            panel.style.transition = '';
            panel.style.removeProperty('opacity');
            panel.style.removeProperty('transform');
        } catch (e) {
            panel.style.transition = '';
            panel.style.removeProperty('opacity');
            panel.style.removeProperty('transform');
        }
    }

    // 关闭面板：往 CLEAR 按钮收回去
    function closePanelTo(originEl) {
        const panel = document.getElementById('cgpt-bulk-panel');
        if (!panel) return;

        if (!originEl) {
            panel.classList.remove('cgpt-visible');
            return;
        }

        try {
            const pr = panel.getBoundingClientRect();
            const or = originEl.getBoundingClientRect();

            const panelCx = pr.left + pr.width / 2;
            const panelCy = pr.top + pr.height / 2;
            const originCx = or.left + or.width / 2;
            const originCy = or.top + or.height / 2;

            const dx = originCx - panelCx;
            const dy = originCy - panelCy;

            panel.style.transition = '';
            panel.style.opacity = '1';
            panel.style.transform = 'translate(0,0) scale(1)';
            panel.getBoundingClientRect();

            panel.style.opacity = '0';
            panel.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;

            const duration = 280;
            setTimeout(() => {
                panel.classList.remove('cgpt-visible');
                panel.style.removeProperty('opacity');
                panel.style.removeProperty('transform');
            }, duration + 40);
        } catch (e) {
            panel.classList.remove('cgpt-visible');
            panel.style.removeProperty('opacity');
            panel.style.removeProperty('transform');
        }
    }

    function togglePanelVisible(originEl) {
        const panel = document.getElementById('cgpt-bulk-panel');
        if (!panel) return;
        const willOpen = !panel.classList.contains('cgpt-visible');
        if (willOpen) {
            openPanelFrom(originEl);
        } else {
            closePanelTo(originEl);
        }
    }

    function createFloatingButton() {
        if (document.getElementById('cgpt-fab-container')) return;

        const container = document.createElement('div');
        container.id = 'cgpt-fab-container';

        const fab = document.createElement('div');
        fab.id = 'cgpt-fab';
        fab.textContent = 'CLEAR';

        const closeBtn = document.createElement('button');
        closeBtn.id = 'cgpt-fab-close';
        closeBtn.type = 'button';
        closeBtn.textContent = '×';

        container.appendChild(fab);
        container.appendChild(closeBtn);
        document.body.appendChild(container);

        // 默认位置：靠 GPT logo 稍上、稍右
        try {
            const logoLink = document.querySelector('nav a[href="/"]') || document.querySelector('nav');
            if (logoLink) {
                const rect = logoLink.getBoundingClientRect();
                container.style.left = (rect.left + 40) + 'px';
                container.style.top = (rect.top + 4) + 'px';
            } else {
                container.style.left = '96px';
                container.style.top = '40px';
            }
        } catch (e) {
            container.style.left = '96px';
            container.style.top = '40px';
        }

        let isDragging = false;
        let moved = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        fab.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            moved = false;
            startX = e.clientX;
            startY = e.clientY;

            const rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            function onMove(ev) {
                if (!isDragging) return;
                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;

                if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
                    moved = true;
                }

                if (!moved) return;

                container.style.left = startLeft + dx + 'px';
                container.style.top = startTop + dy + 'px';
            }

            function onUp() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);

                if (!isDragging) return;
                isDragging = false;

                if (!moved) {
                    togglePanelVisible(fab);
                }
            }

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });

        fab.addEventListener('click', (e) => {
            e.preventDefault();
        });

        // 关闭悬浮按钮（刷新恢复）
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            container.style.display = 'none';
        });
    }

    function bindEvents() {
        const scanBtn = document.getElementById('cgpt-scan');
        const createTestBtn = document.getElementById('cgpt-create-test');
        const clearBtn = document.getElementById('cgpt-clear');
        const delBtn = document.getElementById('cgpt-delete');
        const selectToggle = document.getElementById('cgpt-select-toggle');
        const searchInput = document.getElementById('cgpt-search');
        const searchClear = document.getElementById('cgpt-search-clear');
        const listDiv = document.getElementById('cgpt-list');
        const themeToggle = document.getElementById('cgpt-theme-toggle');

        if (!scanBtn || !clearBtn || !delBtn || !selectToggle ||
            !searchInput || !searchClear || !listDiv || !createTestBtn || !themeToggle) return;

        // 刷新时保留关键字过滤
        scanBtn.onclick = () => {
            const keyword = searchInput.value || '';
            currentItems = findConversationNodes();
            currentFilter = keyword;
            applyFilterAndRender();
        };

        createTestBtn.onclick = () => {
            createTestChat();
        };

        clearBtn.onclick = () => {
            currentItems = [];
            filteredItems = [];
            listDiv.innerHTML = '';
            setStatus('列表已清空。');
            selectToggle.checked = false;
            selectToggle.indeterminate = false;
            const resultDiv = document.getElementById('cgpt-result');
            if (resultDiv) {
                resultDiv.textContent = '';
                resultDiv.classList.add('cgpt-result-empty');
            }
            // 同时清空搜索框
            currentFilter = '';
            if (searchInput) {
                searchInput.value = '';
            }
        };

        selectToggle.onchange = () => {
            const boxes = listDiv.querySelectorAll('.cgpt-item-checkbox:not(:disabled)');
            boxes.forEach(cb => {
                cb.checked = selectToggle.checked;
            });
        };

        searchInput.oninput = () => {
            currentFilter = searchInput.value || '';
            applyFilterAndRender();
        };

        searchClear.onclick = () => {
            if (!searchInput.value) return;
            searchInput.value = '';
            currentFilter = '';
            applyFilterAndRender();
        };

        listDiv.addEventListener('change', (e) => {
            if (!e.target.matches('.cgpt-item-checkbox')) return;
            const boxes = listDiv.querySelectorAll('.cgpt-item-checkbox:not(:disabled)');
            const checkedCount = listDiv.querySelectorAll('.cgpt-item-checkbox:not(:disabled):checked').length;
            if (!boxes.length) {
                selectToggle.checked = false;
                selectToggle.indeterminate = false;
            } else {
                selectToggle.checked = checkedCount === boxes.length;
                selectToggle.indeterminate = checkedCount > 0 && checkedCount < boxes.length;
            }
        });

        delBtn.onclick = () => {
            deleteSelected();
        };

        themeToggle.onclick = () => {
            toggleTheme();
        };
    }

    function init() {
        injectStyle();
        injectPanel();
        createFloatingButton();
        bindEvents();
    }

    window.addEventListener('load', () => {
        setTimeout(init, 2000);
    });
})();
