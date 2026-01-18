// ==UserScript==
// @name         AF3 Auto Submitter (AlphaFold3 自动提交助手)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AF3 批量提交工具：支持拖拽面板、红绿灯状态指示、自动纠错、断点续传。
// @author       Jiang Siyuan
// @match        https://alphafoldserver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563083/AF3%20Auto%20Submitter%20%28AlphaFold3%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%8A%A9%E6%89%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563083/AF3%20Auto%20Submitter%20%28AlphaFold3%20%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E5%8A%A9%E6%89%8B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const CONTAINER_ID = 'af3-v12-panel';
    const WAIT_FOR_MODAL = 2000;
    const MAX_WAIT_RETRIES = 60;
    // -----------

    let isRunning = false;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 辅助：查找按钮
    function findButtonByText(text) {
        const els = Array.from(document.querySelectorAll('button, div[role="button"], span[role="button"]'));
        return els.find(el =>
            el.textContent &&
            el.textContent.toLowerCase().includes(text.toLowerCase()) &&
            !el.disabled &&
            el.offsetParent !== null
        );
    }

    // 辅助：获取草稿行
    function getDraftRows() {
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
        const listItems = checkboxes.map(cb => {
            let parent = cb.parentElement;
            while(parent && parent.tagName !== 'TR' && !parent.getAttribute('role')?.includes('row') && parent.className.indexOf('row') === -1) {
                parent = parent.parentElement;
                if (!parent || parent === document.body) return null;
            }
            return parent;
        }).filter(row => row !== null);
        const uniqueRows = [...new Set(listItems)];
        return uniqueRows.filter(r => !r.textContent.includes('Name'));
    }

    // 强力点击模拟
    function simulateClick(element, color = 'rgba(255, 0, 0, 0.3)') {
        if (!element) return;
        const originalBg = element.style.backgroundColor;
        const originalTrans = element.style.transition;
        element.style.backgroundColor = color;
        element.style.transition = 'background 0.2s';
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
            element.style.transition = originalTrans;
        }, 300);

        const opts = { bubbles: true, cancelable: true, view: window, buttons: 1 };
        element.dispatchEvent(new MouseEvent('mouseover', opts));
        element.dispatchEvent(new MouseEvent('mousedown', opts));
        element.dispatchEvent(new MouseEvent('mouseup', opts));
        element.click();
    }

    // --- 拖拽逻辑 ---
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('#af3-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            const currentLeft = element.offsetLeft;
            const currentTop = element.offsetTop;
            element.style.left = currentLeft + "px";
            element.style.top = currentTop + "px";
            element.style.right = "auto";
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            element.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            element.style.cursor = 'default';
        }
    }

    // --- 核心：尝试选中行 ---
    async function tryClickRowToTriggerContinue(row, jobIndex) {
        const allDescendants = Array.from(row.querySelectorAll('*'));
        const textNodes = allDescendants.filter(el =>
            el.children.length === 0 && el.textContent.trim().length > 0 && el.tagName !== 'INPUT'
        );
        textNodes.sort((a, b) => b.textContent.length - a.textContent.length);

        let candidates = [];
        if (textNodes.length > 0) {
            let target = textNodes[0];
            candidates.push(target);
            if (target.parentElement) candidates.push(target.parentElement);
        }
        candidates.push(row);
        candidates = [...new Set(candidates)];

        console.log(`[Job ${jobIndex}] 尝试选中...`);

        for (let i = 0; i < candidates.length; i++) {
            const el = candidates[i];
            el.scrollIntoView({behavior: "auto", block: "center"});
            simulateClick(el, i === 0 ? 'rgba(255,0,0,0.3)' : 'rgba(0,0,255,0.3)');
            await sleep(800 + (i * 400));
            const continueBtn = findButtonByText("Continue and preview job");
            if (continueBtn) return true;
        }
        return false;
    }

    // --- UI ---
    function ensureUI() {
        if (document.getElementById(CONTAINER_ID)) return;

        const container = document.createElement('div');
        container.id = CONTAINER_ID;

        // 面板样式
        Object.assign(container.style, {
            position: 'fixed', top: '80px', right: '30px', zIndex: '2147483647',
            display: 'flex', flexDirection: 'column', gap: '10px',
            padding: '15px', backgroundColor: 'rgba(32, 33, 36, 0.95)',
            borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            border: '1px solid #5f6368', minWidth: '200px', // 稍微加宽
            fontFamily: 'Roboto, sans-serif'
        });

        // 1. 标题栏 (仅用于拖拽)
        const header = document.createElement('div');
        header.id = 'af3-header';
        Object.assign(header.style, {
            textAlign: 'center', cursor: 'move', paddingBottom: '8px',
            borderBottom: '1px solid #444', fontWeight: 'bold', color: '#eee',
            fontSize: '14px'
        });
        header.textContent = '🤖 AF3 自动提交助手';

        // 2. 状态显示行 (新功能)
        const statusRow = document.createElement('div');
        Object.assign(statusRow.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            gap: '8px', padding: '0 4px'
        });

        // 灯
        const statusLight = document.createElement('div');
        statusLight.id = 'af3-status-light';
        Object.assign(statusLight.style, {
            width: '10px', height: '10px', borderRadius: '50%',
            backgroundColor: '#f44336', flexShrink: '0',
            boxShadow: '0 0 5px #f44336', transition: 'all 0.3s'
        });

        // 文字
        const statusText = document.createElement('span');
        statusText.id = 'af3-status-text';
        statusText.textContent = '初始化中...';
        Object.assign(statusText.style, {
            fontSize: '12px', color: '#bbb', whiteSpace: 'nowrap'
        });

        statusRow.appendChild(statusLight);
        statusRow.appendChild(statusText);

        // 3. 控件区域
        const controls = document.createElement('div');
        Object.assign(controls.style, {
            display: 'flex', alignItems: 'center', gap: '8px'
        });

        const input = document.createElement('input');
        input.type = 'number';
        input.value = '10';
        input.id = 'af3-v12-count';
        Object.assign(input.style, {
            width: '50px', padding: '8px', borderRadius: '6px', border: '1px solid #555',
            textAlign: 'center', fontWeight: 'bold', backgroundColor: '#333', color: '#fff'
        });

        const btn = document.createElement('button');
        btn.id = 'af3-v12-btn';
        btn.textContent = '🚀 启动';
        Object.assign(btn.style, {
            flex: '1', padding: '8px', backgroundColor: '#666', color: '#aaa',
            border: 'none', borderRadius: '6px', cursor: 'not-allowed',
            fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s'
        });
        btn.disabled = true;
        btn.onclick = startProcess;

        controls.appendChild(input);
        controls.appendChild(btn);

        // 4. 底部提示
        const footer = document.createElement('div');
        footer.textContent = '⚠️ 默认items per page为10，请进行调整';
        Object.assign(footer.style, {
            fontSize: '11px', color: '#fdd835', textAlign: 'center', marginTop: '4px'
        });

        container.appendChild(header);
        container.appendChild(statusRow); // 插入新行
        container.appendChild(controls);
        container.appendChild(footer);
        document.body.appendChild(container);

        makeDraggable(container);
    }

    // --- 状态检测 (UI更新逻辑) ---
    function checkSystemStatus() {
        const btn = document.getElementById('af3-v12-btn');
        const light = document.getElementById('af3-status-light');
        const text = document.getElementById('af3-status-text');

        if (!btn || !light || !text || isRunning) return;

        const activeTab = document.querySelector('button[aria-selected="true"], div[aria-selected="true"]');
        const isDraftTab = activeTab && activeTab.textContent.toLowerCase().includes('draft');

        if (isDraftTab) {
            // 绿灯状态
            light.style.backgroundColor = '#00e676';
            light.style.boxShadow = '0 0 8px #00e676';

            text.textContent = '✅ 就绪: 可以运行';
            text.style.color = '#00e676';

            btn.disabled = false;
            btn.style.backgroundColor = '#1a73e8';
            btn.style.color = 'white';
            btn.style.cursor = 'pointer';
        } else {
            // 红灯状态
            light.style.backgroundColor = '#f44336';
            light.style.boxShadow = '0 0 8px #f44336';

            text.textContent = '⛔ 暂停: 请切换到 Draft 页';
            text.style.color = '#ef5350';

            btn.disabled = true;
            btn.style.backgroundColor = '#444';
            btn.style.color = '#888';
            btn.style.cursor = 'not-allowed';
        }
    }

    // --- 流程 ---
    async function startProcess() {
        if (isRunning) return;

        const countInput = document.getElementById('af3-v12-count');
        const maxJobs = parseInt(countInput.value, 10) || 10;

        const currentVisibleRows = getDraftRows().length;
        if (maxJobs > currentVisibleRows) {
            const proceed = confirm(
                `⚠️ 数量警告\n\n` +
                `你设定了 ${maxJobs} 个任务，但当前页面只显示了 ${currentVisibleRows} 行。\n` +
                `建议先在页面底部增加 "Rows per page"。\n\n` +
                `是否强行继续？`
            );
            if (!proceed) return;
        }

        if (!confirm(`准备自动提交 ${maxJobs} 个任务。确认继续？`)) return;

        isRunning = true;
        const btn = document.getElementById('af3-v12-btn');
        const text = document.getElementById('af3-status-text');

        btn.disabled = true;
        btn.style.backgroundColor = '#666';
        text.textContent = '⏳ 运行中...';
        text.style.color = '#ffa726'; // 橙色
        countInput.disabled = true;

        try {
            for (let i = 1; i <= maxJobs; i++) {
                btn.textContent = `${i} / ${maxJobs}`;

                const rowsBefore = getDraftRows();
                if (rowsBefore.length === 0) {
                    alert("当前页面列表空了！");
                    break;
                }
                const currentCount = rowsBefore.length;
                const targetRow = rowsBefore[0];

                const isSelected = await tryClickRowToTriggerContinue(targetRow, i);
                if (!isSelected) throw new Error("无法选中任务行。");

                const continueBtn = findButtonByText("Continue and preview job");
                simulateClick(continueBtn, 'rgba(0,255,0,0.3)');
                await sleep(WAIT_FOR_MODAL);

                let confirmBtn = findButtonByText("Confirm and submit");
                if (!confirmBtn) {
                    if (document.body.textContent.includes("Daily quota")) throw new Error("配额已满");
                    throw new Error("弹窗未出现");
                }

                simulateClick(confirmBtn, 'rgba(0,255,0,0.3)');

                await sleep(1500);
                confirmBtn = findButtonByText("Confirm and submit");
                if (confirmBtn) {
                    console.log("补刀点击 Confirm...");
                    simulateClick(confirmBtn, 'rgba(255,0,0,0.5)');
                    await sleep(1000);
                }

                btn.textContent = `Wait...`;
                let success = false;
                for (let retry = 0; retry < MAX_WAIT_RETRIES; retry++) {
                    await sleep(500);
                    const rowsNow = getDraftRows();
                    if (rowsNow.length < currentCount) {
                        success = true;
                        break;
                    }
                    if (retry % 5 === 0) {
                         confirmBtn = findButtonByText("Confirm and submit");
                         if (confirmBtn) simulateClick(confirmBtn);
                    }
                }
                if (!success) throw new Error("任务未消失，可能是网络卡顿。");
            }
        } catch (e) {
            alert(`停止: ${e.message}`);
        } finally {
            isRunning = false;
            if (btn) {
                btn.textContent = '🚀 启动';
                countInput.disabled = false;
                checkSystemStatus(); // 恢复状态显示
            }
        }
    }

    setInterval(ensureUI, 1000);
    setInterval(checkSystemStatus, 500);
    ensureUI();
})();