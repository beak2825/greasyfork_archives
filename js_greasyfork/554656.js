// ==UserScript==
// @name         瑞云服务单界面批量上传机器人R号和机器人型号
// @namespace    fanuc.auto.upload
// @version      2.1
// @description  从CSV批量导入R号，维修时长固定8；保存失败时多次尝试填入机型并重试保存
// @match        https://fisd.shanghai-fanuc.com.cn:8001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554656/%E7%91%9E%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%8D%95%E7%95%8C%E9%9D%A2%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E6%9C%BA%E5%99%A8%E4%BA%BAR%E5%8F%B7%E5%92%8C%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%9E%8B%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554656/%E7%91%9E%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%8D%95%E7%95%8C%E9%9D%A2%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E6%9C%BA%E5%99%A8%E4%BA%BAR%E5%8F%B7%E5%92%8C%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%9E%8B%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wait = ms => new Promise(res => setTimeout(res, ms));

    async function waitForDialog(timeout = 8000) {
        const interval = 150;
        let waited = 0;
        while (waited < timeout) {
            const dialog = Array.from(document.querySelectorAll('div[role="dialog"]'))
                .find(d => d.classList.contains('rtxpc-dialog') && d.offsetParent !== null);
            if (dialog) return dialog;
            await wait(interval);
            waited += interval;
        }
        return null;
    }

    async function clickSaveWithRetry(dialog, opts = {}) {
        const maxClicks = opts.maxClicks ?? 6;
        const clickInterval = opts.clickInterval ?? 300;
        const afterClickWait = opts.afterClickWait ?? 300;

        for (let attempt = 1; attempt <= maxClicks; attempt++) {
            const saveBtn = Array.from(dialog.querySelectorAll('button'))
                .find(b => b.querySelector('span.rt-button-text')?.textContent.trim() === '保存');
            if (!saveBtn) { await wait(clickInterval); continue; }

            try {
                saveBtn.focus();
                ['mouseover','mousedown','mouseup','click'].forEach(type => {
                    saveBtn.dispatchEvent(new MouseEvent(type, {bubbles:true, cancelable:true, view:window}));
                });
            } catch { try { saveBtn.click(); } catch {} }

            await wait(afterClickWait);

            if (dialog.offsetParent === null) {
                console.log(`[保存] 弹窗关闭成功（第 ${attempt} 次）`);
                return true;
            }
            await wait(clickInterval);
        }

        return dialog.offsetParent === null;
    }

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = '上传 CSV 并录入';
    Object.assign(uploadBtn.style, {
        position: 'fixed', top: '80px', right: '20px', zIndex: 9999,
        padding: '8px 12px', backgroundColor: '#1E90FF', color: '#fff',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    });
    document.body.appendChild(uploadBtn);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.txt';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (ev) => {
        const file = ev.target.files[0];
        if (!file) { alert('未选择文件'); return; }

        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) { alert('CSV 无有效数据'); return; }

        const data = lines.slice(1).map(l => {
            let cols = l.split('\t');
            if (cols.length < 2) cols = l.split(',');
            cols = cols.map(s => s.trim());
            return { C号: cols[0] ?? '', R号: cols[1] ?? '', 机型: cols[2] ?? '' };
        }).filter(x => x.R号);

        if (!data.length) { alert('未解析到 R号'); return; }
        alert(`解析 ${data.length} 条，开始录入（请保持页面前台）`);

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            console.log(`开始第 ${i+1}/${data.length}：`, item);

            // 点击添加
            const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('添加'));
            if (!addBtn) { alert('未找到添加按钮，脚本终止'); break; }
            addBtn.click();

            const dialog = await waitForDialog(8000);
            if (!dialog) { alert(`第 ${i+1}：弹窗未出现，跳过`); continue; }

            // 填 R号
            const rInput = dialog.querySelector('input[aria-label="设备序列号"]');
            if (!rInput) {
                alert(`第 ${i+1}：未找到设备序列号输入框，跳过`);
                const closeBtn = dialog.querySelector('button[aria-label="Close"], .rtxpc-dialog__headerbtn');
                if (closeBtn) { try { closeBtn.click(); } catch {} }
                continue;
            }
            rInput.focus();
            rInput.value = item.R号;
            rInput.dispatchEvent(new Event('input', {bubbles:true}));
            rInput.dispatchEvent(new Event('change', {bubbles:true}));
            await wait(200);

            // 填维修时长固定 8
            const repairInput = dialog.querySelector('input[aria-label="设备维修时长"]');
            if (repairInput) {
                repairInput.focus();
                repairInput.value = '8';
                repairInput.dispatchEvent(new Event('input', {bubbles:true}));
                repairInput.dispatchEvent(new Event('change', {bubbles:true}));
            }
            await wait(200);

            // 第一次尝试保存
            let saved = await clickSaveWithRetry(dialog, { maxClicks: 6, clickInterval: 300, afterClickWait: 300 });

            // 若保存失败且 CSV 有机型，多次尝试填机型再保存
            if (!saved && item.机型) {
                const modelInput = dialog.querySelector('input[placeholder="请选择"], input[aria-label*="型号"], input[aria-label*="设备型号"]');
                if (modelInput) {
                    for (let attempt = 1; attempt <= 5; attempt++) { // 多次尝试
                        console.log(`第 ${i+1}：机型重试第 ${attempt} 次`);
                        modelInput.focus();
                        modelInput.value = item.机型;
                        modelInput.dispatchEvent(new Event('input', {bubbles:true}));
                        modelInput.dispatchEvent(new Event('change', {bubbles:true}));
                        await wait(100);

                        const option = Array.from(document.querySelectorAll('li')).find(li => li.textContent.trim() === item.机型);
                        if (option) { try { option.click(); } catch {} await wait(100); }

                        saved = await clickSaveWithRetry(dialog, { maxClicks: 2, clickInterval: 200, afterClickWait: 200 });
                        if (saved) break;
                    }
                }
            }

            if (!saved) {
                const cont = confirm(`第 ${i+1} 条保存可能未成功，是否继续下一条？取消中止脚本。`);
                if (!cont) { alert('脚本中止'); break; }
            } else {
                console.log(`第 ${i+1} 条保存成功`);
            }

            await wait(500);
        }

        alert('所有条目处理结束');
    });

})();
