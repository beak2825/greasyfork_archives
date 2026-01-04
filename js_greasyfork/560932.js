// ==UserScript==
// @name         图片链接转存pixhost
// @namespace    https://guyuan.de/
// @version      1.0.1
// @description  转存图片至 PixHost
// @author       guyuanwind
// @match        https://pixhost.to/*
// @icon         https://img1.pixhost.to/images/11284/677295392_.jpg
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560932/%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%AD%98pixhost.user.js
// @updateURL https://update.greasyfork.org/scripts/560932/%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%AD%98pixhost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #remote-transfer-zone {
            position: fixed; top: 15px; left: 15px; width: 260px;
            background: #fff; border-radius: 8px;
            z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: sans-serif; overflow: hidden; border: 1px solid #ddd;
        }
        .rtz-header { background: #2c3e50; color: white; padding: 8px 12px; font-size: 13px; font-weight: bold; text-align: center; }
        .rtz-body { padding: 10px; }
        #url-input { width: 100%; height: 70px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px; padding: 8px; font-size: 11px; box-sizing: border-box; outline: none; resize: none; }
        .action-btn { width: 100%; padding: 8px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }
        .action-btn:disabled { background: #bdc3c7; }

        .result-area { margin-top: 10px; max-height: 380px; overflow-y: auto; }
        .format-group { margin-bottom: 10px; position: relative; }
        .format-label { font-size: 10px; font-weight: bold; color: #95a5a6; margin-bottom: 3px; display: block; }

        .format-output { width: 100%; height: 45px; font-family: monospace; font-size: 10px; background: #fdfdfd; border: 1px solid #eee; border-radius: 3px; padding: 5px; box-sizing: border-box; resize: none; cursor: pointer; transition: all 0.2s; overflow: hidden; }
        .format-output:hover { background: #f0f7ff; border-color: #3498db; }
        .format-output.copy-success { background: #e8f5e9 !important; border-color: #27ae60 !important; }

        .error-list { margin-top: 10px; padding: 8px; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 4px; font-size: 10px; color: #c53030; }
        .error-item { word-break: break-all; margin-bottom: 4px; border-bottom: 1px dashed #fed7d7; padding-bottom: 2px; }

        .status-msg { font-size: 11px; margin-top: 5px; color: #718096; text-align: center; }
        .copy-hint { position: absolute; right: 5px; top: 0; font-size: 9px; color: #27ae60; font-weight: bold; opacity: 0; pointer-events: none; }
        .copy-hint.show { animation: fadeUp 1s ease-out; }
        @keyframes fadeUp { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-5px); } 100% { opacity: 0; transform: translateY(-10px); } }
        .result-area::-webkit-scrollbar { width: 3px; }
        .result-area::-webkit-scrollbar-thumb { background: #eee; }
    `);

    const container = document.createElement('div');
    container.id = 'remote-transfer-zone';
    container.innerHTML = `
        <div class="rtz-header">PixHost 转存助手</div>
        <div class="rtz-body">
            <textarea id="url-input" placeholder="粘贴链接 (每行一个)"></textarea>
            <button id="start-transfer" class="action-btn">开始转存</button>
            <div id="transfer-status" class="status-msg">准备就绪</div>
            <div id="result-display" class="result-area"></div>
        </div>
    `;
    document.body.appendChild(container);

    const btn = document.getElementById('start-transfer');
    const input = document.getElementById('url-input');
    const status = document.getElementById('transfer-status');
    const resultDisplay = document.getElementById('result-display');

    const downloadToBlob = (url) => new Promise((res, rej) => {
        GM_xmlhttpRequest({
            method: 'GET', url, responseType: 'blob',
            onload: (r) => r.status === 200 ? res(r.response) : rej(`HTTP ${r.status}`),
            onerror: () => rej('网络下载失败'), timeout: 20000
        });
    });

    const uploadToPixhost = (blob) => new Promise((res, rej) => {
        const fd = new FormData();
        fd.append('img', blob, `img_${Date.now()}.jpg`);
        fd.append('content_type', '0');
        fd.append('max_th_size', '420');
        GM_xmlhttpRequest({
            method: 'POST', url: 'https://api.pixhost.to/images',
            data: fd, headers: { 'Accept': 'application/json' },
            onload: (r) => { try { const d = JSON.parse(r.responseText); d.show_url ? res(d) : rej('API错误'); } catch(e) { rej('解析失败'); } },
            onerror: () => rej('上传请求失败')
        });
    });

    const fetchDirectLink = (showUrl) => new Promise((res) => {
        GM_xmlhttpRequest({
            method: 'GET', url: showUrl,
            onload: (r) => {
                const doc = new DOMParser().parseFromString(r.responseText, 'text/html');
                const img = doc.querySelector('#image');
                res(img ? img.src : showUrl);
            },
            onerror: () => res(showUrl)
        });
    });

    btn.addEventListener('click', async () => {
        const lines = input.value.split('\n').map(u => u.trim()).filter(u => u !== '');
        if (!lines.length) return;

        btn.disabled = true;
        resultDisplay.innerHTML = '';
        const finalResults = [];
        const failedUrls = [];

        for (let i = 0; i < lines.length; i++) {
            const currentUrl = lines[i];
            status.innerHTML = `<span style="color:#3182ce">处理中: ${i + 1}/${lines.length}</span>`;
            try {
                const blob = await downloadToBlob(currentUrl);
                const upData = await uploadToPixhost(blob);
                const dLink = await fetchDirectLink(upData.show_url);
                finalResults.push({ direct: dLink });
            } catch (err) {
                console.error(`Error: ${currentUrl}`, err);
                failedUrls.push({ url: currentUrl, reason: err });
            }
        }

        btn.disabled = false;
        status.innerHTML = failedUrls.length > 0 ? `<span style="color:#e53e3e">完成 (失败 ${failedUrls.length} 个)</span>` : `<span style="color:#38a169">全部处理成功</span>`;

        if (finalResults.length) renderResults(finalResults);
        if (failedUrls.length) renderErrors(failedUrls);
    });

    function renderResults(results) {
        const formats = [
            { label: 'DIRECT', gen: r => r.direct },
            { label: 'MARKDOWN', gen: r => `![](${r.direct})` },
            { label: 'BBCODE', gen: r => `[img]${r.direct}[/img]` },
            { label: 'HTML', gen: r => `<img src="${r.direct}">` }
        ];

        formats.forEach(fmt => {
            const text = results.map(fmt.gen).join('\n');
            const group = document.createElement('div');
            group.className = 'format-group';
            group.innerHTML = `<span class="format-label">${fmt.label}</span><span class="copy-hint">已复制</span><textarea class="format-output" readonly title="点击复制">${text}</textarea>`;

            const area = group.querySelector('.format-output');
            const hint = group.querySelector('.copy-hint');
            area.addEventListener('click', () => {
                navigator.clipboard.writeText(text).then(() => {
                    area.classList.add('copy-success'); hint.classList.add('show');
                    setTimeout(() => { area.classList.remove('copy-success'); hint.classList.remove('show'); }, 1000);
                });
            });
            resultDisplay.appendChild(group);
        });
    }

    function renderErrors(errors) {
        const errDiv = document.createElement('div');
        errDiv.className = 'error-list';
        errDiv.innerHTML = `<strong>⚠️ 以下链接无法下载/转存:</strong><div style="margin-top:5px"></div>`;
        const listCont = errDiv.querySelector('div');

        errors.forEach(err => {
            const item = document.createElement('div');
            item.className = 'error-item';
            item.innerHTML = `• ${err.url} <br><span style="opacity:0.7">[原因: ${err.reason}]</span>`;
            listCont.appendChild(item);
        });
        resultDisplay.appendChild(errDiv);
    }
})();