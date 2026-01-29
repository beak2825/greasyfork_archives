// ==UserScript==
// @name         Humble Bundle Library 自动化点击下载器
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  适配最新的 js-download-button 结构。直接读取左侧 h2 标题，模拟点击右侧 div 按钮进行下载。
// @author       YuoHira
// @match        https://www.humblebundle.com/home/library*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564315/Humble%20Bundle%20Library%20%E8%87%AA%E5%8A%A8%E5%8C%96%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/564315/Humble%20Bundle%20Library%20%E8%87%AA%E5%8A%A8%E5%8C%96%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 ---
    const style = document.createElement('style');
    style.innerHTML = `
        #hb-v9-panel {
            position: fixed; top: 10px; right: 10px; width: 420px; height: 85vh;
            background: #1a1a1b; color: #fff; border: 2px solid #ed1c24; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.8); z-index: 999999; display: flex; flex-direction: column;
            font-family: "Segoe UI", system-ui, sans-serif;
        }
        #hb-v9-header { padding: 15px; border-bottom: 1px solid #333; background: #222; }
        #hb-v9-header h3 { margin: 0; color: #ed1c24; font-size: 16px; }
        #hb-v9-content { flex: 1; overflow-y: auto; padding: 10px; background: #111; }
        #hb-v9-footer { padding: 15px; background: #222; border-top: 1px solid #333; display: flex; flex-direction: column; gap: 8px; }

        .hb-item-row { display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #222; cursor: default; }
        .hb-item-row:hover { background: #252525; }
        .hb-item-name { flex: 1; font-size: 13px; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .hb-btn { border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; color: white; transition: 0.2s; }
        .btn-scan { background: #007bff; }
        .btn-dl { background: #28a745; }
        .btn-dl:disabled { background: #444; cursor: not-allowed; }

        #hb-v9-toggle { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; background: #ed1c24;
                        border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;
                        cursor: pointer; z-index: 1000000; box-shadow: 0 5px 20px rgba(0,0,0,0.5); font-weight: bold; font-size: 18px; }
        .hb-progress-bar { height: 4px; background: #333; margin-top: 10px; border-radius: 2px; overflow: hidden; }
        #hb-progress-inner { height: 100%; background: #28a745; width: 0%; transition: width 0.3s; }
    `;
    document.head.appendChild(style);

    let listItems = [];

    // --- UI 渲染 ---
    const toggle = document.createElement('div');
    toggle.id = 'hb-v9-toggle';
    toggle.innerHTML = 'HB';
    document.body.appendChild(toggle);

    const panel = document.createElement('div');
    panel.id = 'hb-v9-panel';
    panel.style.display = 'none';
    panel.innerHTML = `
        <div id="hb-v9-header">
            <h3>Humble 下载助手 V9</h3>
            <div id="hb-v9-status" style="font-size:11px; color:#999; margin-top:5px;">已适配 Div 类型下载按钮</div>
            <div class="hb-progress-bar"><div id="hb-progress-inner"></div></div>
        </div>
        <div id="hb-v9-content"><div style="text-align:center; padding-top:100px; color:#555;">请点击“读取左侧列表”</div></div>
        <div id="hb-v9-footer">
            <button id="btn-scan" class="hb-btn btn-scan">第一步：读取左侧列表</button>
            <button id="btn-dl" class="hb-btn btn-dl" disabled>第二步：模拟点击下载 (0)</button>
        </div>
    `;
    document.body.appendChild(panel);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // --- 核心逻辑 ---

    function fetchTitles() {
        const rows = Array.from(document.querySelectorAll('.subproduct-selector'));
        if (rows.length === 0) {
            alert("未发现 .subproduct-selector，请确保页面已加载。");
            return;
        }

        listItems = rows.map((row, index) => {
            const nameEl = row.querySelector('.text-holder h2') || row.querySelector('h2') || row;
            return {
                dom: row,
                title: nameEl.innerText.trim(),
                id: index
            };
        });

        renderList();
        document.getElementById('hb-v9-status').innerText = `已读取 ${listItems.length} 个资源。`;
    }

    function renderList() {
        const container = document.getElementById('hb-v9-content');
        container.innerHTML = listItems.map(item => `
            <div class="hb-item-row">
                <input type="checkbox" class="hb-v9-chk" checked data-id="${item.id}">
                <div class="hb-item-name" title="${item.title}">${item.title}</div>
            </div>
        `).join('');
        updateCount();
    }

    function updateCount() {
        const count = document.querySelectorAll('.hb-v9-chk:checked').length;
        const btn = document.getElementById('btn-dl');
        btn.innerText = `第二步：模拟点击下载 (${count})`;
        btn.disabled = count === 0;
    }

    async function startBatchDownload() {
        const checkedBoxes = Array.from(document.querySelectorAll('.hb-v9-chk:checked'));
        if (!confirm(`准备模拟下载 ${checkedBoxes.length} 个项目。`)) return;

        const status = document.getElementById('hb-v9-status');
        const progress = document.getElementById('hb-progress-inner');

        for (let i = 0; i < checkedBoxes.length; i++) {
            const id = checkedBoxes[i].getAttribute('data-id');
            const item = listItems[id];

            status.innerText = `处理中 (${i+1}/${checkedBoxes.length}): ${item.title}`;
            progress.style.width = `${((i + 1) / checkedBoxes.length) * 100}%`;

            // 1. 点击左侧
            item.dom.scrollIntoView({ behavior: 'auto', block: 'center' });
            item.dom.click();

            // 2. 等待右侧面板渲染
            await sleep(1500);

            // 3. 核心改进：寻找下载按钮
            // 兼容 a 标签和 div 标签按钮
            const dlButtons = Array.from(document.querySelectorAll('.js-download-button, .download-button, a.a, .download-buttons a'))
                                    .filter(el => {
                                        // 如果是 A 标签，检查是否是下载链接
                                        if (el.tagName === 'A') {
                                            const href = el.href || "";
                                            return href.includes('dl.humble.com') && !href.includes('.torrent');
                                        }
                                        // 如果是 Div 按钮（根据你提供的 HTML 结构），它是主要的下载触发器
                                        return el.classList.contains('js-download-button') || el.classList.contains('download-button');
                                    });

            if (dlButtons.length === 0) {
                console.warn(`[${item.title}] 未找到任何下载按钮，请检查页面是否加载。`);
            } else {
                for (const btn of dlButtons) {
                    // 派发点击事件，确保触发 JS 监听器
                    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    btn.dispatchEvent(clickEvent);
                    await sleep(1000);
                }
            }
            await sleep(800);
        }

        status.innerText = "✅ 模拟下载任务全部完成！";
        progress.style.width = "100%";
    }

    toggle.onclick = () => { panel.style.display = panel.style.display === 'none' ? 'flex' : 'none'; };
    document.getElementById('btn-scan').onclick = fetchTitles;
    document.getElementById('btn-dl').onclick = startBatchDownload;
    panel.addEventListener('change', e => { if (e.target.classList.contains('hb-v9-chk')) updateCount(); });

})();