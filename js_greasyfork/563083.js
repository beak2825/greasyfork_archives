// ==UserScript==
// @name         AF3 Auto Submitter V1.2 (极速宽容版)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  针对大量任务积压优化：移除超时报错停止逻辑，改为对比首行内容变化，支持强制列表刷新，实现"不死机"连续提交。
// @author       Gemini
// @match        https://alphafoldserver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563083/AF3%20Auto%20Submitter%20V12%20%28%E6%9E%81%E9%80%9F%E5%AE%BD%E5%AE%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563083/AF3%20Auto%20Submitter%20V12%20%28%E6%9E%81%E9%80%9F%E5%AE%BD%E5%AE%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const CONTAINER_ID = 'af3-v12-panel';
    const WAIT_FOR_MODAL = 2000;   
    const MAX_WAIT_RETRIES = 60;   // 这里的等待不再是死等，一旦首行变了立刻跳过
    // -----------

    let isRunning = false;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function findButtonByText(text) {
        const els = Array.from(document.querySelectorAll('button, div[role="button"], span[role="button"]'));
        return els.find(el => 
            el.textContent && 
            el.textContent.toLowerCase().includes(text.toLowerCase()) && 
            !el.disabled && 
            el.offsetParent !== null
        );
    }

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

    // 辅助：获取第一行的特征文本（用于判断列表是否刷新）
    function getFirstRowSignature() {
        const rows = getDraftRows();
        if (rows.length === 0) return null;
        // 获取该行内所有的文本，组合成一个指纹
        return rows[0].textContent.trim();
    }

    // 尝试强制刷新列表
    function forceRefreshList() {
        console.log("尝试强制刷新列表...");
        const tab = document.querySelector('button[aria-selected="true"], div[aria-selected="true"]');
        if (tab) tab.click();
    }

    function simulateClick(element, color = 'rgba(255, 0, 0, 0.3)') {
        if (!element) return;
        const originalBg = element.style.backgroundColor;
        const originalTrans = element.style.transition;
        element.style.backgroundColor = color;
        element.style.transition = 'background 0.2s';
        setTimeout(() => { 
            element.style.backgroundColor = originalBg; 
            element.style.transition = originalTrans;
        }, 200);

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

    // --- 选中行 ---
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
            await sleep(500 + (i * 200));  // 稍微缩短选中等待
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
        Object.assign(container.style, {
            position: 'fixed', top: '80px', right: '30px', zIndex: '2147483647',
            display: 'flex', flexDirection: 'column', gap: '10px',
            padding: '15px', backgroundColor: 'rgba(32, 33, 36, 0.95)',
            borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', 
            border: '1px solid #5f6368', minWidth: '200px', fontFamily: 'Roboto, sans-serif'
        });

        const header = document.createElement('div');
        header.id = 'af3-header';
        Object.assign(header.style, {
            textAlign: 'center', cursor: 'move', paddingBottom: '8px',
            borderBottom: '1px solid #444', fontWeight: 'bold', color: '#eee', fontSize: '14px'
        });
        header.textContent = '🤖 AF3 自动提交助手';

        const statusRow = document.createElement('div');
        Object.assign(statusRow.style, {
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            gap: '8px', padding: '0 4px'
        });
        const statusLight = document.createElement('div');
        statusLight.id = 'af3-status-light';
        Object.assign(statusLight.style, {
            width: '10px', height: '10px', borderRadius: '50%',
            backgroundColor: '#f44336', flexShrink: '0',
            boxShadow: '0 0 5px #f44336', transition: 'all 0.3s'
        });
        const statusText = document.createElement('span');
        statusText.id = 'af3-status-text';
        statusText.textContent = '初始化中...';
        Object.assign(statusText.style, { fontSize: '12px', color: '#bbb', whiteSpace: 'nowrap' });
        statusRow.appendChild(statusLight);
        statusRow.appendChild(statusText);

        const controls = document.createElement('div');
        Object.assign(controls.style, { display: 'flex', alignItems: 'center', gap: '8px' });
        const input = document.createElement('input');
        input.type = 'number'; input.value = '10'; input.id = 'af3-v12-count';
        Object.assign(input.style, {
            width: '50px', padding: '8px', borderRadius: '6px', border: '1px solid #555',
            textAlign: 'center', fontWeight: 'bold', backgroundColor: '#333', color: '#fff'
        });
        const btn = document.createElement('button');
        btn.id = 'af3-v12-btn'; btn.textContent = '🚀 启动';
        Object.assign(btn.style, {
            flex: '1', padding: '8px', backgroundColor: '#666', color: '#aaa',
            border: 'none', borderRadius: '6px', cursor: 'not-allowed',
            fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s'
        });
        btn.disabled = true; btn.onclick = startProcess;
        controls.appendChild(input);
        controls.appendChild(btn);

        const footer = document.createElement('div');
        footer.textContent = '⚠️ 列表加载慢会自动跳过等待';
        Object.assign(footer.style, {
            fontSize: '11px', color: '#fdd835', textAlign: 'center', marginTop: '4px'
        });

        container.appendChild(header); container.appendChild(statusRow);
        container.appendChild(controls); container.appendChild(footer);
        document.body.appendChild(container);
        makeDraggable(container);
    }

    function checkSystemStatus() {
        const btn = document.getElementById('af3-v12-btn');
        const light = document.getElementById('af3-status-light');
        const text = document.getElementById('af3-status-text');
        if (!btn || !light || !text || isRunning) return;

        const activeTab = document.querySelector('button[aria-selected="true"], div[aria-selected="true"]');
        const isDraftTab = activeTab && activeTab.textContent.toLowerCase().includes('draft');

        if (isDraftTab) {
            light.style.backgroundColor = '#00e676'; light.style.boxShadow = '0 0 8px #00e676';
            text.textContent = '✅ 就绪: 点击启动开始'; text.style.color = '#00e676';
            btn.disabled = false; btn.style.backgroundColor = '#1a73e8';
            btn.style.color = 'white'; btn.style.cursor = 'pointer';
        } else {
            light.style.backgroundColor = '#f44336'; light.style.boxShadow = '0 0 8px #f44336';
            text.textContent = '⛔ 暂停: 请在下侧列表中仅保留Saved draft'; text.style.color = '#ef5350';
            btn.disabled = true; btn.style.backgroundColor = '#444';
            btn.style.color = '#888'; btn.style.cursor = 'not-allowed';
        }
    }

    // --- 主流程 ---
    async function startProcess() {
        if (isRunning) return;

        const countInput = document.getElementById('af3-v12-count');
        const maxJobs = parseInt(countInput.value, 10) || 10;
        
        if (!confirm(`准备自动提交 ${maxJobs} 个任务。\n\n提示：此版本在列表卡顿时不会报错停止，而是尝试继续运行。请留意提交情况。`)) return;

        isRunning = true;
        const btn = document.getElementById('af3-v12-btn');
        const text = document.getElementById('af3-status-text');
        btn.disabled = true; btn.style.backgroundColor = '#666';
        text.textContent = '⏳ 运行中...'; text.style.color = '#ffa726';
        countInput.disabled = true;

        try {
            for (let i = 1; i <= maxJobs; i++) {
                btn.textContent = `${i} / ${maxJobs}`;
                const rows = getDraftRows();
                if (rows.length === 0) { alert("列表已空"); break; }
                
                // 1. 记录当前第一行的“指纹”（内容）
                const currentFirstRowSig = getFirstRowSignature();

                // 2. 选中行
                const isSelected = await tryClickRowToTriggerContinue(rows[0], i);
                if (!isSelected) {
                    console.warn(`[Job ${i}] 选中失败，尝试刷新列表并跳过本次循环...`);
                    forceRefreshList();
                    await sleep(2000);
                    continue; // 不报错，直接重试下一轮
                }

                // 3. Click Continue
                const continueBtn = findButtonByText("Continue and preview job");
                simulateClick(continueBtn, 'rgba(0,255,0,0.3)'); 
                await sleep(WAIT_FOR_MODAL);

                // 4. Click Confirm
                let confirmBtn = findButtonByText("Confirm and submit");
                if (!confirmBtn) {
                    if (document.body.innerText.includes("Daily quota")) throw new Error("配额已满");
                    // 如果弹窗没出来，可能是刚才 Continue 没点上，不报错，直接下一轮重试
                    console.warn("Confirm 弹窗未出现，可能是网络延迟，重试中...");
                    continue; 
                }
                simulateClick(confirmBtn, 'rgba(0,255,0,0.3)');
                
                // 5. 智能等待（宽容模式）
                btn.textContent = `Verifying...`;
                
                // 等待循环：不再是等它消失，而是只要第一行变了，就认为成功
                let jobSuccess = false;
                for (let retry = 0; retry < MAX_WAIT_RETRIES; retry++) {
                    await sleep(500);
                    
                    // 检查 A: 弹窗里的 Confirm 按钮还在不在？如果还在，补刀！
                    confirmBtn = findButtonByText("Confirm and submit");
                    if (confirmBtn) {
                        if (retry % 3 === 0) simulateClick(confirmBtn, 'rgba(255, 0, 0, 0.5)');
                    } else {
                        // 弹窗没了，这是好兆头。现在看列表变没变。
                        const newFirstRowSig = getFirstRowSignature();
                        if (newFirstRowSig !== currentFirstRowSig) {
                            // 列表第一行变了！说明刚才那个肯定交上去了（或者被挤下去了）
                            console.log(`[Job ${i}] 列表已更新，任务提交成功。`);
                            jobSuccess = true;
                            break;
                        }
                    }
                }

                // 6. 核心修改：如果超时了，列表还没变，怎么办？
                if (!jobSuccess) {
                    // 旧版本：throw Error("任务未消失") -> 停止
                    // 新版本：打印警告，强行继续
                    console.warn(`[Job ${i}] 警告：列表刷新延迟，但弹窗已消失。假设提交成功，强制进入下一个任务。`);
                    // 可以在这里加一个强制刷新，保险一点
                    // forceRefreshList(); 
                    // await sleep(1000);
                }
            }
        } catch (e) {
            alert(`停止: ${e.message}`);
        } finally {
            isRunning = false;
            if (btn) {
                btn.textContent = '🚀 启动';
                countInput.disabled = false;
                checkSystemStatus();
            }
        }
    }

    setInterval(ensureUI, 1000);        
    setInterval(checkSystemStatus, 500); 
    ensureUI();
})();