// ==UserScript==
// @name         flipos Jenkins获取分支
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Jenkins获取分支
// @author       yang
// @match        https://jenkins.51hchc.com/job/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553262/flipos%20Jenkins%E8%8E%B7%E5%8F%96%E5%88%86%E6%94%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/553262/flipos%20Jenkins%E8%8E%B7%E5%8F%96%E5%88%86%E6%94%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 卡片样式
    const css = `
    .build-row, .build {
        background: #fff !important;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        padding: 12px 16px;
        margin-bottom: 12px;
        display: block; /* 保证内部独立行正常显示 */
    }

    .branch-copy-row {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%; /* 独占整行 */
        margin-bottom: 8px;
        font-size: 13px;
    }

    .branch-copy-row .branch-highlight {
        background: rgba(15,118,110,0.08);
        color: #0f766e;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 6px;
        margin-right: 6px;
    }

    .branch-copy-row .copy-btn {
        background: #0f766e;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: 2px 6px;
        font-size: 12px;
        cursor: pointer;
        transition: opacity .2s;
        vertical-align: middle;
    }

    .branch-copy-row .copy-btn:hover {
        opacity: 0.8;
    }
    `;
       // 等待右侧面板加载完成
    function initToggle() {
        const rightPanel = document.querySelector('#buildHistory, .build-history-pane, .pane.build-history');
        if (!rightPanel) {
            setTimeout(initToggle, 500);
            return;
        }

        // 添加收起按钮
        const btn = document.createElement('button');
        btn.textContent = '收起 Build History';
        btn.style.position = 'fixed';
        btn.style.top = '80px';
        btn.style.right = '8px';
        btn.style.zIndex = 9999;
        btn.style.padding = '4px 8px';
        btn.style.background = '#0f766e';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);

        let hidden = false;
        btn.addEventListener('click', () => {
            hidden = !hidden;
            rightPanel.style.display = hidden ? 'none' : '';
            btn.textContent = hidden ? '显示 Build History' : '收起 Build History';
        });
    }
   initToggle();

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 添加分支行到最上面
    function addBranchRow() {
        const builds = document.querySelectorAll('.build-row, .build');
        builds.forEach(build => {
            if (build.querySelector('.branch-copy-row')) return; // 避免重复添加
            const text = build.innerText;
            const branchMatch = text.match(/deploy '([^']+)'/);
            if (!branchMatch) return;

            // 创建独立行容器
            const row = document.createElement('div');
            row.className = 'branch-copy-row';
            row.innerHTML = `<span class="branch-highlight">${branchMatch[1]}</span>
                             <button class="copy-btn" data-branch="${branchMatch[1]}">复制</button>`;

            // 插入到最前面
            build.insertBefore(row, build.firstChild);
        });
    }

    // 复制功能
    document.addEventListener('click', e => {
        const btn = e.target.closest('.copy-btn');
        if (!btn) return;
        GM_setClipboard(btn.dataset.branch);
        btn.innerText = '已复制';
        setTimeout(() => (btn.innerText = '复制'), 1200);
    });

    // 初始化
    function retryInit(times = 10) {
        addBranchRow();
        if (times > 0) setTimeout(() => retryInit(times - 1), 1000);
    }

    retryInit();
})();