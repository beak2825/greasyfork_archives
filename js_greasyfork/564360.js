// ==UserScript==
// @name         西安电子科技大学研究生评教脚本
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  自动化评教脚本
// @match        https://yjspt.xidian.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564360/%E8%A5%BF%E5%AE%89%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/564360/%E8%A5%BF%E5%AE%89%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%94%9F%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let logContainer = null;

    function log(msg, type = 'info') {
        console.log(msg);

        if (!logContainer) return;

        const line = document.createElement('div');
        const time = new Date().toLocaleTimeString();

        let color = '#333';
        if (type === 'warn') color = '#d98400';
        if (type === 'error') color = '#d93026';
        if (type === 'success') color = '#188038';

        line.style.color = color;
        line.textContent = `[${time}] ${msg}`;

        logContainer.appendChild(line);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    async function mainLogic() {
        const evalDivs = Array.from(document.querySelectorAll('div[data-action="评教"]'));
        log(`找到 ${evalDivs.length} 个评教项`);

        for (let i = 0; i < evalDivs.length; i++) {
            const _evalDivs = Array.from(document.querySelectorAll('div[data-action="评教"]'));
            const div = _evalDivs[0];

            let statusText = '';
            try {
                statusText = div.childNodes[1].childNodes[1].innerText.trim();
            } catch {
                log(`第 ${i + 1} 个：无法读取状态，跳过`, 'warn');
                continue;
            }

            if (statusText === '已评教') {
                log(`第 ${i + 1} 个：已评教，跳过`);
                continue;
            }

            log(`第 ${i + 1} 个：开始评教`);

            // 点击评教
            div.click();
            await sleep(500);

            // 选择单选
            const radioGroups = document.querySelectorAll('.bh-radio-group-v');
            log(`  找到 ${radioGroups.length} 个单选组`);

            radioGroups.forEach((group, idx) => {
                const first = group.children[0];
                if (first) {
                    first.click();
                    log(`  ✔ 单选组 ${idx + 1} 已选择`);
                }
            });
            await sleep(500);

            // 提交
            const submitBtn = document.querySelector('a[data-action="提交"]');
            if (submitBtn) {
                submitBtn.click();
                log('  ✔ 已点击提交', 'success');
            } else {
                log('  ✖ 未找到提交按钮', 'error');
                continue;
            }

            // 等待提交后的弹窗出现
            await sleep(500);

            // ✅ 新增：处理确认弹窗
            const dialogBoxes = document.querySelectorAll('.bh-dialog-btnContainerBox');
            if (dialogBoxes.length > 0) {
                const box = dialogBoxes[0];
                const btn = box.children[0];
                if (btn) {
                    btn.click();
                    log('  ✔ 已点击提交确认按钮', 'success');
                } else {
                    log('  ✖ 确认按钮子节点不存在', 'warn');
                }
            } else {
                log('  ⚠ 未找到确认弹窗，可能无需确认', 'warn');
            }

            await sleep(2000);
        }

        log('全部评教完成 ✅', 'success');
        alert('评教已全部完成');
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-eval-panel';

        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:6px;">自动评教</div>
            <div style="margin-bottom:6px;">
                <button id="auto-eval-start">开始执行</button>
                <button id="auto-eval-close" style="margin-left:6px;">关闭</button>
            </div>
            <div id="auto-eval-log"></div>
        `;

        Object.assign(panel.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '320px',
            zIndex: 99999,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            fontSize: '13px'
        });

        logContainer = panel.querySelector('#auto-eval-log');

        Object.assign(logContainer.style, {
            height: '160px',
            overflowY: 'auto',
            border: '1px solid #e0e0e0',
            padding: '6px',
            background: '#fafafa',
            fontFamily: 'monospace',
            fontSize: '12px'
        });

        document.body.appendChild(panel);

        const startBtn = panel.querySelector('#auto-eval-start');
        const closeBtn = panel.querySelector('#auto-eval-close');

        startBtn.onclick = async () => {
            startBtn.disabled = true;
            startBtn.innerText = '执行中...';
            log('开始执行评教流程');
            try {
                await mainLogic();
            } finally {
                startBtn.innerText = '已完成';
            }
        };

        closeBtn.onclick = () => {
            panel.remove();
        };
    }

    setTimeout(createPanel, 1000);
})();