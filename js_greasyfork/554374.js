// ==UserScript==
// @name         JCR Journal Data Exporter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Export journal data from Clarivate JCR to CSV with Chinese headers. Start from current page.
// @author       YourName
// @match        https://jcr.clarivate.com/jcr/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554374/JCR%20Journal%20Data%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/554374/JCR%20Journal%20Data%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let csvContent = "期刊名称,版本,影响因子,分区,年发文量\n"; // ← 调整顺序 + 改名
    let isRunning = false;
    let direction = 'forward'; // 'forward' or 'backward'

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'jcr-export-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10%;
            right: 10px;
            background: white;
            border: 1px solid #ccc;
            padding: 8px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            border-radius: 4px;
            display: flex;
            gap: 6px;
            align-items: center;
            opacity: 0.8;
        `;

        const btnStyle = `
            padding: 4px 8px;
            font-size: 12px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        `;

        panel.innerHTML = `
            <button id="btn-forward" style="${btnStyle} background-color: #4CAF50; color: white;">▶ 正向</button>
            <button id="btn-backward" style="${btnStyle} background-color: #2196F3; color: white;">◀ 反向</button>
            <button id="btn-stop" style="${btnStyle} background-color: #f44336; color: white; display: none;">⏹ 停止</button>
            <span id="status" style="font-size:12px; color:#555; min-width:80px;"></span>
        `;

        document.body.appendChild(panel);

        document.getElementById('btn-forward').addEventListener('click', () => startExport('forward'));
        document.getElementById('btn-backward').addEventListener('click', () => startExport('backward'));
        document.getElementById('btn-stop').addEventListener('click', stopAndExport);
    }

    function startExport(dir) {
        if (isRunning) return;
        direction = dir;
        isRunning = true;
        csvContent = "期刊名称,版本,影响因子,分区,年发文量\n"; // ← 重置为新顺序和新列名
        updateStatus(`开始${dir === 'forward' ? '正向' : '反向'}采集...`);

        document.getElementById('btn-forward').disabled = true;
        document.getElementById('btn-backward').disabled = true;
        document.getElementById('btn-stop').style.display = 'inline-block';

        collectCurrentPageData(); // 从当前页开始，不跳转
    }

    function stopAndExport() {
        isRunning = false;
        if (csvContent.trim().split('\n').length > 1) {
            downloadCSV(csvContent, `JCR_部分数据_${direction}.csv`);
            updateStatus('已导出当前数据！');
        } else {
            updateStatus('无数据可导出。');
        }
        resetButtons();
    }

    function updateStatus(text) {
        document.getElementById('status').textContent = text;
    }

    function resetButtons() {
        document.getElementById('btn-forward').disabled = false;
        document.getElementById('btn-backward').disabled = false;
        document.getElementById('btn-stop').style.display = 'none';
    }

    function collectCurrentPageData() {
        if (!isRunning) return;

        const journalNames = document.querySelectorAll('.table-cell-journalName');
        const impactFactors = document.querySelectorAll('.table-cell-jif2019');
        const quartiles = document.querySelectorAll('.table-cell-quartile');
        const totalarticles = document.querySelectorAll('.table-cell-totalArticles');
        const editions = document.querySelectorAll('.table-cell-edition'); // 版本字段

        if (journalNames.length === 0) {
            updateStatus('当前页无数据。');
            stopAndExport();
            return;
        }

        journalNames.forEach((journalNameElement, index) => {
            const journalName = (journalNameElement.getAttribute('title') || '').replace(/"/g, '""');
            const edition = (editions[index]?.textContent.trim() || '').replace(/"/g, '""'); // 第二列
            const impactFactor = (impactFactors[index]?.getAttribute('title') || '').replace(/"/g, '""');
            const quartile = (quartiles[index]?.textContent.trim() || '').replace(/"/g, '""');
            const totalArticle = (totalarticles[index]?.textContent.trim() || '').replace(/"/g, '""'); // 年发文量

            csvContent += `"${journalName}","${edition}","${impactFactor}","${quartile}","${totalArticle}"\n`;
        });

        updateStatus(`采集完成，翻页中...`);

        if (direction === 'forward') {
            const nextBtn = document.querySelector('.mat-paginator-navigation-next:not(.mat-button-disabled)');
            if (nextBtn) {
                nextBtn.click();
                setTimeout(collectCurrentPageData, 2000);
            } else {
                finishExport();
            }
        } else {
            const prevBtn = document.querySelector('.mat-paginator-navigation-previous:not(.mat-button-disabled)');
            if (prevBtn) {
                prevBtn.click();
                setTimeout(collectCurrentPageData, 2000);
            } else {
                finishExport();
            }
        }
    }

    function finishExport() {
        isRunning = false;
        downloadCSV(csvContent, `JCR_完整数据_${direction}.csv`);
        updateStatus('采集完成！');
        resetButtons();
    }

    function downloadCSV(content, filename) {
        const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 初始化
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createControlPanel);
    } else {
        createControlPanel();
    }
})();