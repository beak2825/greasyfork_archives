// ==UserScript==
// @name         自助分析下载当前活动步骤-CSV流传输保存
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在10.177.71.114网站添加悬浮按钮下载当前活动步骤（并发分页 + 单 CSV 流式写入 + 可折叠日志 + 进度 + 16位以上大数保持精度）
// @author       eden
// @match        https://10.177.71.114/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/553429/%E8%87%AA%E5%8A%A9%E5%88%86%E6%9E%90%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E6%B4%BB%E5%8A%A8%E6%AD%A5%E9%AA%A4-CSV%E6%B5%81%E4%BC%A0%E8%BE%93%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/553429/%E8%87%AA%E5%8A%A9%E5%88%86%E6%9E%90%E4%B8%8B%E8%BD%BD%E5%BD%93%E5%89%8D%E6%B4%BB%E5%8A%A8%E6%AD%A5%E9%AA%A4-CSV%E6%B5%81%E4%BC%A0%E8%BE%93%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 配置参数 ----------
    const STORAGE_KEY = 'download_step_button_visible';
    const CONCURRENCY = 5;       // 并发请求数量
    const BATCH_SIZE = 10000;    // 后端每页大小（保持原接口）
    const CSV_CHUNK_ROWS = 2000; // 每次转换并 push 到 csvChunks 的行数（降低内存峰值）

    // ---------- UI / 按钮（保持原有样式/行为） ----------
    function createFloatingButton() {
        if (document.getElementById('download-step-container')) return;
        const container = document.createElement('div');
        container.id = 'download-step-container';
        container.style.position = 'fixed';
        container.style.left = '20px';
        container.style.top = '50%';
        container.style.transform = 'translateY(-50%)';
        container.style.zIndex = '99999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.backgroundColor = 'rgba(255,255,255,0.9)';
        container.style.padding = '10px';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
        document.body.appendChild(container);

        const button = document.createElement('button');
        button.id = 'download-step-button';
        button.textContent = '下载当前步骤';
        button.style.padding = '10px 16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '600';
        button.addEventListener('click', () => downloadActiveStep());

        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-button';
        toggleButton.textContent = '隐藏';
        toggleButton.style.padding = '8px 12px';
        toggleButton.style.backgroundColor = '#2196F3';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '6px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.addEventListener('click', () => {
            const btn = document.getElementById('download-step-button');
            if (!btn) return;
            if (btn.style.display === 'none') {
                btn.style.display = 'block';
                toggleButton.textContent = '隐藏';
                localStorage.setItem(STORAGE_KEY, 'true');
            } else {
                btn.style.display = 'none';
                toggleButton.textContent = '显示';
                localStorage.setItem(STORAGE_KEY, 'false');
            }
        });

        const isVisible = localStorage.getItem(STORAGE_KEY) !== 'false';
        button.style.display = isVisible ? 'block' : 'none';
        toggleButton.textContent = isVisible ? '隐藏' : '显示';

        container.appendChild(button);
        container.appendChild(toggleButton);
    }

    // ---------- Cookie / Headers ----------
    function getCookieValue(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [k, v] = cookie.trim().split('=');
            if (k === name) return v;
        }
        return '';
    }
    function getCurrentHeaders() {
        const token = getCookieValue('token') || '';
        const guid = getCookieValue('guid') || '';
        const headers = {
            "User-Agent": navigator.userAgent,
            "Accept": "*/*",
            "Accept-Language": navigator.language || "zh-CN,zh;q=0.8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        };
        if (token) headers.token = token;
        if (guid) headers.guid = guid;
        return headers;
    }

    // ---------- 日志面板 + 进度条（可折叠） ----------
    function ensureLogWindow() {
        if (document.getElementById('log-window')) return;
        const logWindow = document.createElement('div');
        logWindow.id = 'log-window';
        logWindow.style.position = 'fixed';
        logWindow.style.bottom = '12px';
        logWindow.style.right = '12px';
        logWindow.style.width = '480px';
        logWindow.style.maxHeight = '460px';
        logWindow.style.background = 'rgba(0,0,0,0.85)';
        logWindow.style.color = '#bfffbf';
        logWindow.style.fontFamily = 'monospace';
        logWindow.style.fontSize = '12px';
        logWindow.style.padding = '8px';
        logWindow.style.borderRadius = '6px';
        logWindow.style.zIndex = '10000';
        logWindow.style.display = 'flex';
        logWindow.style.flexDirection = 'column';
        logWindow.style.boxShadow = '0 0 12px rgba(0,0,0,0.6)';

        // progress elements
        const progressWrapper = document.createElement('div');
        progressWrapper.style.width = '100%';
        progressWrapper.style.height = '12px';
        progressWrapper.style.background = '#222';
        progressWrapper.style.border = '1px solid #444';
        progressWrapper.style.borderRadius = '6px';
        progressWrapper.style.overflow = 'hidden';
        progressWrapper.style.marginBottom = '6px';
        const progressInner = document.createElement('div');
        progressInner.id = 'log-progress-inner';
        progressInner.style.width = '0%';
        progressInner.style.height = '100%';
        progressInner.style.background = '#4caf50';
        progressInner.style.transition = 'width 200ms linear';
        progressWrapper.appendChild(progressInner);

        const progressText = document.createElement('div');
        progressText.id = 'log-progress-text';
        progressText.style.margin = '6px 0';
        progressText.style.fontSize = '11px';
        progressText.textContent = '进度：0%';

        const titleBar = document.createElement('div');
        titleBar.style.display = 'flex';
        titleBar.style.justifyContent = 'space-between';
        titleBar.style.alignItems = 'center';
        titleBar.style.marginBottom = '6px';
        const title = document.createElement('div');
        title.textContent = '数据处理日志';
        title.style.fontWeight = '700';
        title.style.color = '#dfffd8';

        const btns = document.createElement('div');
        const collapseBtn = document.createElement('button');
        collapseBtn.textContent = '折叠';
        collapseBtn.style.marginRight = '8px';
        collapseBtn.style.cursor = 'pointer';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cursor = 'pointer';
        btns.appendChild(collapseBtn);
        btns.appendChild(closeBtn);
        titleBar.appendChild(title);
        titleBar.appendChild(btns);

        const logContent = document.createElement('div');
        logContent.id = 'log-content';
        logContent.style.overflowY = 'auto';
        logContent.style.maxHeight = '320px';
        logContent.style.paddingRight = '6px';

        logWindow.appendChild(progressWrapper);
        logWindow.appendChild(progressText);
        logWindow.appendChild(titleBar);
        logWindow.appendChild(logContent);
        document.body.appendChild(logWindow);

        let collapsed = false;
        collapseBtn.addEventListener('click', function() {
            collapsed = !collapsed;
            if (collapsed) {
                progressWrapper.style.display = 'none';
                progressText.style.display = 'none';
                logContent.style.display = 'none';
                collapseBtn.textContent = '展开';
            } else {
                progressWrapper.style.display = 'block';
                progressText.style.display = 'block';
                logContent.style.display = 'block';
                collapseBtn.textContent = '折叠';
            }
        });
        closeBtn.addEventListener('click', function() { logWindow.style.display = 'none'; });

        // override console.log to also write to logContent
        const originalLog = console.log.bind(console);
        console.log = function(...args) {
            originalLog(...args);
            try {
                const message = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
                const entry = document.createElement('div');
                entry.style.borderBottom = '1px dotted #333';
                entry.style.padding = '3px 0';
                entry.textContent = message;
                const lc = document.getElementById('log-content');
                if (lc) {
                    lc.appendChild(entry);
                    lc.scrollTop = lc.scrollHeight;
                }
            } catch (e) {
                originalLog('日志写入失败', e);
            }
        };

        window.__updateDownloadProgress = function(percentage, text) {
            const inner = document.getElementById('log-progress-inner');
            const t = document.getElementById('log-progress-text');
            if (inner) inner.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
            if (t) t.textContent = (text ? text + ' ' : '') + `进度：${Math.round(percentage)}%`;
        };
    }

    // ---------- 辅助：安全 CSV 单元格生成（处理长数字/日期/转义） ----------
    function safeCSVCell(value, fieldDef) {
        if (value === null || value === undefined) return '';

        if (fieldDef && fieldDef.originalType === 'Date') {
            const d = parsePossibleDate(value);
            if (d instanceof Date && !isNaN(d.getTime())) {
                const s = formatDateTime(d);
                return `"${s.replace(/"/g, '""')}"`;
            } else {
                return '';
            }
        }

        const str = (typeof value === 'number') ? String(value) : String(value);

        if (/^\d{16,}$/.test(str)) {
            const inner = `="${str}"`.replace(/"/g, '""');
            return `"${inner}"`;
        }

        if (/[,"\r\n]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    function formatDateTime(d) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function parsePossibleDate(value) {
        if (value === null || value === undefined || value === '') return null;
        if (value instanceof Date) return value;
        if (typeof value === 'Number' || typeof value === 'number') {
            if (value > 1e12) return new Date(value);
            if (value > 1e9) return new Date(value * 1000);
            return new Date(value);
        }
        if (typeof value === 'string') {
            const s = value.trim();
            if (/^\d+$/.test(s)) {
                const n = parseInt(s, 10);
                if (n > 1e12) return new Date(n);
                if (n > 1e9) return new Date(n * 1000);
                return new Date(n);
            }
            const t = Date.parse(s);
            if (!isNaN(t)) return new Date(t);
            const m = s.match(/\/Date\((\d+)(?:[+-]\d+)?\)\//);
            if (m && m[1]) {
                const n = parseInt(m[1], 10);
                if (n > 1e12) return new Date(n);
                if (n > 1e9) return new Date(n * 1000);
                return new Date(n);
            }
        }
        return null;
    }

    // ---------- 将 rows (array of arrays) 转为 CSV 文本的一部分（按 fieldDefs） ----------
    function rowsToCsvChunk(rows, fieldDefs) {
        const lines = [];
        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            const cells = [];
            for (let c = 0; c < row.length; c++) {
                const fieldDef = (fieldDefs && fieldDefs[c]) ? fieldDefs[c] : null;
                cells.push(safeCSVCell(row[c], fieldDef));
            }
            lines.push(cells.join(','));
        }
        return lines.join('\r\n') + '\r\n';
    }

    async function pushRowsToCsvChunks(rows, fieldDefs, csvChunks) {
        if (!rows || rows.length === 0) return 0;
        let written = 0;
        for (let i = 0; i < rows.length; i += CSV_CHUNK_ROWS) {
            const slice = rows.slice(i, i + CSV_CHUNK_ROWS);
            const chunkText = rowsToCsvChunk(slice, fieldDefs);
            csvChunks.push(chunkText);
            written += slice.length;
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        return written;
    }

    function saveCsvChunksAsFile(csvChunks, fileName) {
        const parts = ['\uFEFF', ...csvChunks];
        const blob = new Blob(parts, { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName.endsWith('.csv') ? fileName : (fileName + '.csv');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, 200);
    }

    function convertBatchToRows(batchArray) {
        const rows = [];
        if (!Array.isArray(batchArray)) return rows;
        if (batchArray.length === 0) return rows;
        if (Array.isArray(batchArray[0])) {
            for (let row of batchArray) {
                const processed = row.map(cell => (cell === null || cell === undefined ? '' : cell));
                rows.push(processed);
            }
        } else {
            for (let item of batchArray) {
                if (typeof item === 'object' && item !== null) {
                    const vals = Object.values(item);
                    const processed = vals.map(cell => (cell === null || cell === undefined ? '' : cell));
                    rows.push(processed);
                } else {
                    rows.push([item]);
                }
            }
        }
        return rows;
    }

    // ---------- 主逻辑：并发分页请求并流式写 CSV ----------
    async function downloadActiveStep() {
        try {
            console.log('开始下载当前步骤（CSV 流式导出）...');
            ensureLogWindow();

            const stepList = document.getElementById('steplist');
            if (!stepList) {
                alert('未找到步骤列表元素');
                return;
            }
            const activeLi = stepList.querySelector('li.active');
            if (!activeLi) {
                alert('未找到活动步骤元素');
                return;
            }
            const stepId = activeLi.id;
            if (!stepId) {
                alert('活动步骤没有ID');
                return;
            }

            if (!confirm('请确定已根据用户标识user_id/用户号码device_number排序(否则下载数据会错误重复),数据量过大可能导致浏览器卡死(不负责)')) {
                console.log('用户取消下载');
                return;
            }

            let headers = {};
            try { headers = getCurrentHeaders(); } catch (e) { headers = {}; }

            const countUrl = `https://10.177.71.114/datasience/xquery/getStepMessTotalCount?stepId=${stepId}`;
            console.log('获取数据总量：', countUrl);
            const countResp = await fetch(countUrl, { credentials: 'include', headers, referrer: window.location.href, method: 'GET', mode: 'cors' });
            const countData = await countResp.json();
            if (!countData || !countData.data || !countData.data.totalCount) {
                alert('获取数据总量失败或返回格式不正确');
                return;
            }
            const totalCount = parseInt(countData.data.totalCount);
            console.log('总数据量:', totalCount);
            const batchCount = Math.ceil(totalCount / BATCH_SIZE);
            console.log(`将分 ${batchCount} 批次请求（每批 ${BATCH_SIZE} 行）`);

            const csvChunks = [];
            let tableHeaders = [];
            let orgFieldDefsTemplate = null;
            let totalWritten = 0;

            const fetchConfig = { credentials: 'include', headers, referrer: window.location.href, method: 'GET', mode: 'cors' };

            for (let start = 0; start < batchCount; start += CONCURRENCY) {
                const groupPromises = [];
                const groupIdx = [];
                for (let j = 0; j < CONCURRENCY && (start + j) < batchCount; j++) {
                    const idx = start + j;
                    const offset = idx + 1;
                    const url = `https://10.177.71.114/datasience/xquery/getStepMassNew?stepId=${stepId}&limit=${BATCH_SIZE}&offset=${offset}`;
                    console.log(`请求第 ${idx + 1}/${batchCount} 批，offset=${offset}`);
                    const p = fetch(url, fetchConfig).then(r => r.json()).catch(e => ({ __fetchError: true, error: e }));
                    groupPromises.push(p);
                    groupIdx.push(idx);
                }

                const settled = await Promise.allSettled(groupPromises);

                for (let k = 0; k < settled.length; k++) {
                    const res = settled[k];
                    const batchIndex = groupIdx[k];
                    if (res.status === 'fulfilled') {
                        const batchData = res.value;
                        if (!batchData || !batchData.data || !Array.isArray(batchData.data.data)) {
                            console.error(`第 ${batchIndex + 1} 批数据异常`, batchData);
                            continue;
                        }

                        if (tableHeaders.length === 0 && batchData.data.orgFieldDefs && Array.isArray(batchData.data.orgFieldDefs) && batchData.data.orgFieldDefs.length > 0) {
                            const firstArray = batchData.data.orgFieldDefs[0];
                            if (Array.isArray(firstArray)) {
                                tableHeaders = firstArray.map(f => f.label || '');
                                orgFieldDefsTemplate = firstArray.map(f => ({ originalType: f.originalType, fieldName: f.fieldName }));
                            }
                        }

                        if (!orgFieldDefsTemplate && batchData.data.orgFieldDefs && Array.isArray(batchData.data.orgFieldDefs) && batchData.data.orgFieldDefs.length > 0) {
                            const firstArray = batchData.data.orgFieldDefs[0];
                            if (Array.isArray(firstArray)) {
                                orgFieldDefsTemplate = firstArray.map(f => ({ originalType: f.originalType, fieldName: f.fieldName }));
                            }
                        }

                        // ---------- 修复点：写表头时不要把 fieldDefs 传入（避免 Date 类型把表头解析为空） ----------
                        if (batchIndex === 0 && tableHeaders.length > 0) {
                            const headerRow = [tableHeaders];
                            // 这里传 null 作为 fieldDefs，确保表头按普通字符串写入
                            await pushRowsToCsvChunks(headerRow, null, csvChunks);
                            totalWritten += headerRow.length;
                            if (window.__updateDownloadProgress) {
                                const pct = totalCount > 0 ? (totalWritten / totalCount) * 100 : 100;
                                window.__updateDownloadProgress(pct, `已写入 ${totalWritten}/${totalCount} 行`);
                            }
                            console.log('已写入表头:', tableHeaders);
                        }

                        const rows = convertBatchToRows(batchData.data.data);
                        if (rows.length > 0) {
                            const wrote = await pushRowsToCsvChunks(rows, orgFieldDefsTemplate, csvChunks);
                            totalWritten += wrote;
                            console.log(`第 ${batchIndex + 1} 批写入 ${wrote} 行（累计 ${totalWritten} 行）`);
                        } else {
                            console.log(`第 ${batchIndex + 1} 批无数据`);
                        }
                    } else {
                        console.error(`第 ${batchIndex + 1} 批请求失败`, res.reason || res.value);
                    }
                }

                await new Promise(resolve => setTimeout(resolve, 0));
            }

            console.log(`所有批次处理完成，累计写入 ${totalWritten} 行`);
            if (totalWritten === 0) {
                alert('未获取到任何有效数据');
                return;
            }

            // 生成文件名及保存
            let datasetName = 'Result';
            const now = new Date();
            const timestamp = now.getFullYear() +
                  ('0' + (now.getMonth() + 1)).slice(-2) +
                  ('0' + now.getDate()).slice(-2) +
                  ('0' + now.getHours()).slice(-2) +
                  ('0' + now.getMinutes()).slice(-2) +
                  ('0' + now.getSeconds()).slice(-2);
            const fileName = `${(datasetName || 'Result')}-${timestamp}.csv`;

            console.log('开始生成 CSV Blob 并下载（流式）...');
            saveCsvChunksAsFile(csvChunks, fileName);
            alert(`CSV 导出完成: ${fileName}\n共写入 ${totalWritten} 行`);

        } catch (err) {
            console.error('导出失败', err);
            alert('导出失败: ' + (err && err.message ? err.message : err));
        }
    }

    // ---------- 初始化 ----------
    function initScript() {
        ensureLogWindow();
        createFloatingButton();
        console.log('脚本初始化完成（CSV 流式导出版 v1.5.1）');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (!document.getElementById('download-step-container')) initScript();
        }, 1000);
    });
})();
