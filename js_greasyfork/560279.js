// ==UserScript==
// @name         易班公管平台更换手机号审核辅助脚本
// @namespace    https://baka.plus/
// @version      V1.0.2-251226
// @description  易班公共管理平台更换手机号审核辅助脚本，支持集中展示图片 批量审核，理论上兼容不同学校易班公共管理平台
// @author       笨蛋ovo (GitHub @liuran001)
// @license      GNU GPLv3
// @match        https://mp.yiban.cn/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/560279/%E6%98%93%E7%8F%AD%E5%85%AC%E7%AE%A1%E5%B9%B3%E5%8F%B0%E6%9B%B4%E6%8D%A2%E6%89%8B%E6%9C%BA%E5%8F%B7%E5%AE%A1%E6%A0%B8%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/560279/%E6%98%93%E7%8F%AD%E5%85%AC%E7%AE%A1%E5%B9%B3%E5%8F%B0%E6%9B%B4%E6%8D%A2%E6%89%8B%E6%9C%BA%E5%8F%B7%E5%AE%A1%E6%A0%B8%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
        #yb-helper-box {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 500px;
            max-height: 85vh;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: 9998;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            font-family: "Microsoft YaHei", sans-serif;
            font-size: 14px;
        }
        #yb-helper-header {
            padding: 10px 15px;
            background: #2196F3;
            color: #fff;
            font-weight: bold;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        #yb-helper-content {
            padding: 10px;
            overflow-y: auto;
            flex: 1;
        }
        
        /* 全局预览容器 */
        #yb-global-preview-box {
            position: fixed;
            display: none;
            z-index: 9999;
            background: #fff;
            border: 5px solid #fff;
            box-shadow: 0 0 20px rgba(0,0,0,0.6);
            border-radius: 4px;
            width: 300px;
            height: 300px;
            pointer-events: none; 
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #yb-global-preview-box img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }

        .yb-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            color: #fff;
            font-size: 12px;
            margin-right: 5px;
        }
        .yb-btn-primary { background: #2196F3; }
        .yb-btn-success { background: #4CAF50; }
        .yb-btn-danger { background: #F44336; }
        .yb-btn:hover { opacity: 0.9; }
        .yb-btn:disabled { background: #ccc; cursor: not-allowed; }

        .yb-row-item {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #eee;
            padding: 8px 0;
            position: relative;
        }
        .yb-row-item.error-bg { background-color: #fff0f0; }
        .yb-col-check { width: 30px; text-align: center; }
        .yb-col-img { width: 60px; text-align: center; }
        .yb-col-info { flex: 1; padding: 0 10px; }
        .yb-col-action { width: 140px; display: flex; flex-direction: column; gap: 5px; }

        .yb-avatar {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
            cursor: zoom-in;
            border: 1px solid #ddd;
        }
        
        .yb-name-link {
            color: #2196F3;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
        }
        .yb-name-link:hover { text-decoration: underline; color: #1976D2; }

        .yb-input-reason {
            width: 100%;
            padding: 4px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            box-sizing: border-box;
            margin-bottom: 2px;
        }
        .yb-status-msg { font-size: 12px; font-weight: bold; }
        .text-green { color: green; }
        .text-red { color: red; }
        .text-gray { color: #999; }
        
        #yb-toolbar {
            padding: 10px;
            border-top: 1px solid #eee;
            background: #f9f9f9;
            border-radius: 0 0 8px 8px;
        }
    `;
    GM_addStyle(css);

    const htmlTemplate = `
        <div id="yb-helper-header">
            <span>更换手机号审核辅助</span>
            <button id="yb-minimize-btn" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;">-</button>
        </div>
        <div id="yb-helper-content">
            <div style="text-align:center; padding: 20px; color: #666;" id="yb-placeholder">
                请点击下方“读取页面信息”按钮开始
            </div>
            <div id="yb-list-container"></div>
        </div>
        <div id="yb-toolbar">
            <div style="margin-bottom:10px;">
                <button id="yb-read-btn" class="yb-btn yb-btn-primary" style="width:100%">读取本页面信息</button>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <label><input type="checkbox" id="yb-select-all"> 全选</label>
                <div>
                    <button id="yb-batch-pass" class="yb-btn yb-btn-success">批量通过</button>
                    <button id="yb-batch-reject" class="yb-btn yb-btn-danger">批量拒绝</button>
                </div>
            </div>
             <div style="margin-top:5px; font-size:12px; color:#666;">
                * 理由为空时默认：请本人手持身份证或学生证进行拍摄
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.id = 'yb-helper-box';
    container.innerHTML = htmlTemplate;
    document.body.appendChild(container);

    const previewBox = document.createElement('div');
    previewBox.id = 'yb-global-preview-box';
    document.body.appendChild(previewBox);

    const header = document.getElementById('yb-helper-header');
    let isDragging = false;
    let dragStartX, dragStartY, initialLeft, initialTop;

    header.addEventListener('mousedown', (e) => {
        if (e.target.id === 'yb-minimize-btn') return;
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = container.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        container.style.left = `${initialLeft + dx}px`;
        container.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'move';
        }
    });

    const DEFAULT_REJECT_REASON = "请本人手持身份证或学生证进行拍摄";
    const ERROR_REJECT_REASON = "原手机号非本校学生";
    const SLEEP_TIME = 600; 

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    document.getElementById('yb-read-btn').addEventListener('click', async () => {
        const listContainer = document.getElementById('yb-list-container');
        const placeholder = document.getElementById('yb-placeholder');
        const readBtn = document.getElementById('yb-read-btn');
        
        listContainer.innerHTML = '';
        placeholder.style.display = 'block';
        
        readBtn.disabled = true;
        readBtn.innerText = '正在读取...';

        const rows = document.querySelectorAll('.mdc-data-table__row');
        if (rows.length === 0) {
            placeholder.innerText = '未找到数据行，请确认表格已加载完毕。';
            readBtn.disabled = false;
            readBtn.innerText = '读取本页面信息';
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const applyNoCell = row.querySelector('td:nth-child(1)');
            if (!applyNoCell) continue;
            
            const applyNo = applyNoCell.innerText.trim();
            const id = applyNo.slice(-6);

            placeholder.innerText = `正在处理: ${i + 1} / ${rows.length}`;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'yb-row-item';
            itemDiv.id = `yb-item-${id}`;
            itemDiv.innerHTML = `<span style="margin-left:10px; color: #999;">⌛ 正在读取 ${id}...</span>`;
            listContainer.appendChild(itemDiv);
            
            try {
                // 获取基本信息
                const res = await fetchInfo(id);

                if (res.code === 666) {
                    itemDiv.innerHTML = `<span class="text-red" style="padding:10px;">⚠ 操作太频繁，暂停3秒...</span>`;
                    await sleep(3000); 
                    const retryRes = await fetchInfo(id);
                    if (retryRes.code === 666) {
                         itemDiv.innerHTML = `<span class="text-red" style="padding:10px;">读取失败: 操作太频繁</span>`;
                         continue;
                    } else {
                         await processSuccess(id, itemDiv, retryRes);
                    }
                } else {
                    await processSuccess(id, itemDiv, res);
                }

            } catch (err) {
                console.error(err);
                itemDiv.innerHTML = `<span class="text-red" style="padding:10px;">请求失败 ID:${id}</span>`;
            }

            await sleep(SLEEP_TIME);
        }

        placeholder.style.display = 'none'; 
        readBtn.disabled = false;
        readBtn.innerText = '读取本页面信息';
    });

    async function processSuccess(id, itemDiv, res) {
        if (res.data && res.data.photo) {
             try {
                 const blobUrl = await fetchImageAsBlobUrl(res.data.photo);
                 res.data.blobUrl = blobUrl;
             } catch(e) {
                 console.log('图片下载失败，使用原链接', e);
             }
        }
        renderItem(id, itemDiv, res);
    }

    function fetchInfo(id) {
        return new Promise((resolve, reject) => {
            fetch('/admin/user/replacephone/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
        });
    }

    function fetchImageAsBlobUrl(url) {
        return new Promise((resolve, reject) => {
            const fullUrl = url.startsWith('http') ? url : (window.location.origin + url);
            fetch(fullUrl)
            .then(response => {
                if (!response.ok) throw new Error('Img Fail');
                return response.blob();
            })
            .then(blob => {
                const localUrl = URL.createObjectURL(blob);
                resolve(localUrl);
            })
            .catch(err => reject(err));
        });
    }

    function renderItem(id, containerDiv, res) {
        let isErrorUser = false;
        let rejectReasonVal = '';

        if (res.code === '0404' && res.message.includes('原手机号非本校学生')) {
            isErrorUser = true;
            rejectReasonVal = ERROR_REJECT_REASON;
            containerDiv.classList.add('error-bg');
        } else if (res.code !== 200) {
             containerDiv.innerHTML = `<span class="text-red" style="padding:10px;">API错误: ${res.message}</span>`;
             return;
        }

        const info = res.data || {};
        const name = info.name || "未知";
        const className = info.className || "未知";
        const verifyVal = info.verifyVal || "未知";
        
        const displayUrl = info.blobUrl || info.photo;
        
        const photoHtml = displayUrl 
            ? `<img src="${displayUrl}" class="yb-avatar" data-src="${displayUrl}">` 
            : '<div style="width:50px;height:50px;background:#eee;line-height:50px;text-align:center;font-size:10px;">无图</div>';

        const nameHtml = `<a href="https://mp.yiban.cn/app/user-phone/${id}" target="_blank" class="yb-name-link" title="点击查看详情">${name}</a>`;

        const html = `
            <div class="yb-col-check">
                <input type="checkbox" class="yb-item-checkbox" data-id="${id}">
            </div>
            <div class="yb-col-img">
                ${photoHtml}
            </div>
            <div class="yb-col-info">
                <span class="yb-info-text">${nameHtml}</span>
                <span class="yb-info-text" style="font-size:12px;color:#666;">${className}</span>
                <span class="yb-info-text" style="font-size:12px;color:#666;">${verifyVal}</span>
                ${isErrorUser ? '<span class="text-red" style="font-weight:bold;">⚠ 非本校学生</span>' : ''}
            </div>
            <div class="yb-col-action">
                <input type="text" class="yb-input-reason" id="reason-${id}" placeholder="拒绝理由" value="${rejectReasonVal}">
                <div style="display:flex;">
                    <button class="yb-btn yb-btn-success btn-pass" data-id="${id}" style="flex:1;">通过</button>
                    <button class="yb-btn yb-btn-danger btn-reject" data-id="${id}" style="flex:1;">拒绝</button>
                </div>
                <div id="status-${id}" class="yb-status-msg"></div>
            </div>
        `;

        containerDiv.innerHTML = html;

        containerDiv.querySelector('.btn-pass').addEventListener('click', () => submitAudit(id, 1));
        containerDiv.querySelector('.btn-reject').addEventListener('click', () => submitAudit(id, 2));

        if(displayUrl) {
            const imgEl = containerDiv.querySelector('.yb-avatar');
            imgEl.addEventListener('mouseenter', (e) => showPreview(e, displayUrl));
            imgEl.addEventListener('mousemove', (e) => movePreview(e));
            imgEl.addEventListener('mouseleave', hidePreview);
        }
    }

    function showPreview(e, src) {
        previewBox.innerHTML = '';
        const img = document.createElement('img');
        img.src = src;
        previewBox.appendChild(img);
        previewBox.style.display = 'block';
        movePreview(e);
    }

    function movePreview(e) {
        const x = e.clientX - previewBox.offsetWidth - 20; 
        const y = e.clientY - (previewBox.offsetHeight / 2);
        const finalX = x < 10 ? e.clientX + 20 : x;
        previewBox.style.left = finalX + 'px';
        previewBox.style.top = y + 'px';
    }

    function hidePreview() {
        previewBox.style.display = 'none';
        previewBox.innerHTML = '';
    }

    async function submitAudit(id, type) {
        const reasonInput = document.getElementById(`reason-${id}`);
        const statusDiv = document.getElementById(`status-${id}`);
        
        if (!reasonInput || !statusDiv) {
            console.error(`找不到ID为 ${id} 的DOM元素，跳过`);
            return;
        }

        let reason = reasonInput.value.trim();

        if (type === 2 && !reason) {
            reason = DEFAULT_REJECT_REASON;
            reasonInput.value = reason;
        }

        statusDiv.innerHTML = '<span class="text-gray">提交中...</span>';
        
        try {
            const res = await fetch('/admin/user/replacephone/examine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    type: type,
                    reason: reason
                })
            }).then(r => r.json());

            if (res.code === 200) {
                statusDiv.innerHTML = type === 1 ? '<span class="text-green">已通过</span>' : '<span class="text-red">已拒绝</span>';
                const row = document.getElementById(`yb-item-${id}`);
                if(row) {
                    row.querySelectorAll('button').forEach(b => b.disabled = true);
                    const cb = row.querySelector('input[type="checkbox"]');
                    if(cb) {
                        cb.disabled = true;
                        cb.checked = false;
                    }
                }
            } else {
                statusDiv.innerHTML = `<span class="text-red">${res.message || '失败'}</span>`;
            }
        } catch (e) {
            console.error(e);
            statusDiv.innerHTML = `<span class="text-red">网络错误</span>`;
        }
    }

    const selectAllBtn = document.getElementById('yb-select-all');
    if(selectAllBtn) {
        selectAllBtn.addEventListener('change', (e) => {
            const checked = e.target.checked;
            document.querySelectorAll('.yb-item-checkbox:not(:disabled)').forEach(cb => {
                cb.checked = checked;
            });
        });
    }

    async function batchAction(type) {
        const checkboxes = document.querySelectorAll('.yb-item-checkbox:checked');
        if (checkboxes.length === 0) {
            alert('请先勾选需要操作的条目');
            return;
        }

        const actionName = type === 1 ? '通过' : '拒绝';
        if (!confirm(`确定要批量 ${actionName} 选中的 ${checkboxes.length} 条申请吗？`)) {
            return;
        }

        console.log(`开始批量处理 ${checkboxes.length} 条数据...`);

        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            const id = cb.getAttribute('data-id');
            
            try {
                await submitAudit(id, type);
            } catch (err) {
                console.error(`批量处理 ID ${id} 时出错:`, err);
            }
            
            // 每次操作后休息，防止并发过高
            await sleep(300); 
        }
        alert('批量处理完成');
    }

    const batchPassBtn = document.getElementById('yb-batch-pass');
    const batchRejectBtn = document.getElementById('yb-batch-reject');

    if(batchPassBtn) batchPassBtn.addEventListener('click', () => batchAction(1));
    if(batchRejectBtn) batchRejectBtn.addEventListener('click', () => batchAction(2));

    const contentBox = document.getElementById('yb-helper-content');
    const toolbarBox = document.getElementById('yb-toolbar');
    const minimizeBtn = document.getElementById('yb-minimize-btn');
    let isMinimized = false;

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMinimized) {
            contentBox.style.display = 'block';
            toolbarBox.style.display = 'block';
            minimizeBtn.innerText = '-';
            container.style.width = '500px';
        } else {
            contentBox.style.display = 'none';
            toolbarBox.style.display = 'none';
            minimizeBtn.innerText = '+';
            container.style.width = '200px';
            container.style.height = 'auto';
        }
        isMinimized = !isMinimized;
    });

})();