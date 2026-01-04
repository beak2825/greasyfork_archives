// ==UserScript==
// @name         Page Annotator with Jianguoyun Sync and URL Filter (Progress Icon)
// @name:zh-CN   坚果云笔记
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Highlight text, add notes, and sync them to a specified Jianguoyun account with cross-device sync. Prioritizes local cache. Enhanced with URL filtering and a non-intrusive progress icon for sync status.
// @description:zh-CN 在任意页面划词、高亮、添加笔记，并可将笔记同步到指定的坚果云账户，支持跨设备同步。优先从本地缓存获取高亮。新增网址过滤功能和非侵入式图标状态提示。
// @author       Enhanced (Modified for Jianguoyun & URL Filter)
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      dav.jianguoyun.com
// @downloadURL https://update.greasyfork.org/scripts/556522/Page%20Annotator%20with%20Jianguoyun%20Sync%20and%20URL%20Filter%20%28Progress%20Icon%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556522/Page%20Annotator%20with%20Jianguoyun%20Sync%20and%20URL%20Filter%20%28Progress%20Icon%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 坚果云 (WebDAV) 配置 ---
    const JIANGUOYUN_CONFIG = {
        username: 'lhwuhuei@gmail.com',
        password: 'a7sdzcg69qr4kwjj', // 这是应用密码
        serverUrl: 'https://dav.jianguoyun.com/dav/',
        filePath: 'config/annotation.txt'
    };

    const HIGHLIGHT_CLASS = 'userscript-highlight';
    const LOCAL_STORAGE_KEY = 'page_annotator_cache';
    const LAST_SYNC_KEY = 'last_jianguoyun_sync_timestamp';
    const MATCH_URLS_KEY = 'page_annotator_match_urls';

    // Predefined colors
    const HIGHLIGHT_COLORS = {
        yellow: '#fff2a8',
        green: '#c7f7c7',
        blue: '#c7e3f7',
        pink: '#f7c7e8',
        orange: '#f7d7c7'
    };

    function getPageId() {
        return btoa(encodeURIComponent(window.location.href)).replace(/[+/=]/g, '');
    }

    // --- Styles (Updated for Progress Icon) ---
    GM_addStyle(`
        .${HIGHLIGHT_CLASS} {
            cursor: pointer;
            position: relative;
            border-radius: 2px;
            transition: opacity 0.2s;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .${HIGHLIGHT_CLASS}:hover {
            opacity: 0.8;
        }
        .custom-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5); z-index: 10000; display: flex;
            justify-content: center; align-items: center; padding: 10px;
            box-sizing: border-box;
        }
        .modal-content {
            background: white; border-radius: 10px; padding: 20px;
            max-width: 500px; width: 95%; max-height: 90%; overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); position: relative;
        }
        .modal-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;
        }
        .modal-title { font-size: 18px; font-weight: bold; color: #333; }
        .modal-close {
            background: none; border: none; font-size: 24px; cursor: pointer;
            color: #999; padding: 0; width: 30px; height: 30px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            position: absolute; top: 10px; right: 10px;
        }
        .modal-close:hover { background-color: #f0f0f0; }
        .selected-text {
            background-color: #f8f9fa; padding: 10px; border-left: 4px solid #007bff;
            margin-bottom: 15px; border-radius: 4px; font-style: italic; word-wrap: break-word;
        }
        .color-picker {
            display: flex; gap: 10px; margin-bottom: 15px; align-items: center; flex-wrap: wrap;
        }
        .color-option {
            width: 35px; height: 35px; border-radius: 50%; cursor: pointer;
            border: 3px solid transparent; transition: border-color 0.2s, transform 0.1s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .color-option:active { transform: scale(0.95); }
        .color-option.selected { border-color: #333; box-shadow: 0 0 0 2px #333 inset; }
        .note-textarea {
            width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ddd;
            border-radius: 5px; resize: vertical; font-family: inherit;
            margin-bottom: 15px; box-sizing: border-box;
        }
        .modal-buttons {
            display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap;
        }
        .btn {
            padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;
            font-size: 15px; transition: background-color 0.2s, transform 0.1s;
            flex-grow: 1; min-width: 100px;
        }
        .btn:active { transform: scale(0.98); }
        .btn-primary { background-color: #007bff; color: white; }
        .btn-primary:hover { background-color: #0056b3; }
        .btn-secondary { background-color: #6c757d; color: white; }
        .btn-secondary:hover { background-color: #545b62; }
        .btn-danger { background-color: #dc3545; color: white; }
        .btn-danger:hover { background-color: #c82333; }
        .note-display {
            margin-top: 10px; padding: 10px; background-color: #f8f9fa;
            border-radius: 5px; border-left: 4px solid #28a745; word-wrap: break-word;
        }
        /* URL Management Specific Styles */
        #url-list-container {
            max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px; margin-bottom: 15px;
        }
        .url-item {
            display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px dotted #eee;
        }
        .url-item:last-child { border-bottom: none; }
        .url-text { overflow-wrap: break-word; flex-grow: 1; margin-right: 10px; font-size: 14px; }
        .url-remove-btn { background: none; border: none; color: #dc3545; cursor: pointer; font-size: 18px; line-height: 1; }
        .url-remove-btn:hover { color: #c82333; }
        .url-add-input { width: calc(100% - 70px); padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        .url-add-wrapper { display: flex; gap: 10px; margin-bottom: 15px; }

        /* Sync Progress Icon Styles */
        #sync-progress-icon {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 30px;
            height: 10px;
            border-radius: 3px;
            background-color: #ccc;
            opacity: 0;
            transition: opacity 0.3s, background-color 0.3s;
            z-index: 10001;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
        #sync-progress-icon.show {
            opacity: 1;
        }
        #sync-progress-icon.syncing {
            background-color: #ffc107; /* Yellow for syncing */
            animation: pulse 1.5s infinite;
        }
        #sync-progress-icon.success {
            background-color: #28a745; /* Green for success */
        }
        #sync-progress-icon.error {
            background-color: #dc3545; /* Red for error */
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        @media (max-width: 600px) {
            .modal-content { padding: 15px; width: 98%; }
            #sync-progress-icon { top: 10px; right: 10px; }
        }
    `);

    // --- 坚果云 WebDAV API 操作 (不变) ---
    const apiUrl = `${JIANGUOYUN_CONFIG.serverUrl}${JIANGUOYUN_CONFIG.filePath}`;
    const authHeader = "Basic " + btoa(`${JIANGUOYUN_CONFIG.username}:${JIANGUOYUN_CONFIG.password}`);

    function getAnnotationsFromJianguoyun() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                headers: { "Authorization": authHeader },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const annotations = JSON.parse(response.responseText);
                            resolve({ annotations: annotations });
                        } catch (e) {
                            console.error("无法解析坚果云上的批注数据:", e);
                            resolve({ annotations: {} });
                        }
                    } else if (response.status === 404) {
                        resolve({ annotations: {} });
                    } else {
                        reject(new Error(`获取批注失败: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`网络错误: ${error}`));
                }
            });
        });
    }

    function updateAnnotationsOnJianguoyun(annotations) {
        const content = JSON.stringify(annotations, null, 2);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "PUT",
                url: apiUrl,
                headers: {
                    "Authorization": authHeader,
                    "Content-Type": "application/json; charset=UTF-8"
                },
                data: content,
                onload: function(response) {
                    if (response.status === 201 || response.status === 204) {
                        resolve("同步成功!");
                    } else if (response.status === 409) {
                        reject(new Error(`同步失败: 目录不存在。请在坚果云创建 'config' 文件夹。`));
                    } else {
                        reject(new Error(`同步失败: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`网络错误: ${error}`));
                }
            });
        });
    }

    // --- Status Progress Icon ---
    let progressIcon = null;

    function createProgressIcon() {
        progressIcon = document.createElement('div');
        progressIcon.id = 'sync-progress-icon';
        document.body.appendChild(progressIcon);
    }

    /**
     * 显示同步状态，用图标代替文字提示。
     * @param {'syncing'|'success'|'error'|'hide'} type 状态类型
     * @param {string} [logMessage] 仅用于控制台输出的日志消息
     */
    function showSyncStatusIcon(type, logMessage = '') {
        if (!progressIcon) return;

        // 清除所有状态类和定时器
        progressIcon.classList.remove('syncing', 'success', 'error', 'show');
        if (progressIcon.timeoutId) {
            clearTimeout(progressIcon.timeoutId);
        }

        if (type === 'hide') {
            console.log("隐藏同步图标。");
            return;
        }

        if (type !== 'syncing' && logMessage) {
            console.log(`同步状态: ${logMessage}`); // 仅在非同步中时输出详细日志
        }
        
        progressIcon.classList.add('show', type);

        // Success and Error icons should hide after a short delay
        if (type === 'success' || type === 'error') {
            progressIcon.timeoutId = setTimeout(() => {
                progressIcon.classList.remove('show');
            }, 3000);
        }
    }

    // --- Custom Modal (不变) ---
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">${title}</div>
                    <button class="modal-close" aria-label="Close modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        document.body.appendChild(modal);
        return modal;
    }

    function showAddNoteModal(selectedText, range) {
        const content = `
            <div class="selected-text">"${selectedText}"</div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">选择高亮颜色:</label>
                <div class="color-picker">
                    ${Object.entries(HIGHLIGHT_COLORS).map(([name, color]) =>
                        `<div class="color-option ${name === 'yellow' ? 'selected' : ''}"
                             data-color="${name}"
                             style="background-color: ${color}"
                             title="${name}"></div>`
                    ).join('')}
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">添加笔记:</label>
                <textarea class="note-textarea" placeholder="在此输入笔记..."></textarea>
            </div>
            <div class="modal-buttons">
                <button class="btn btn-secondary" id="cancel-note-btn">取消</button>
                <button class="btn btn-primary" id="save-note-btn">保存</button>
            </div>
        `;
        const modal = createModal('添加批注', content);
        const colorOptions = modal.querySelectorAll('.color-option');
        let selectedColor = 'yellow';
        colorOptions.forEach(option => {
            option.onclick = () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedColor = option.dataset.color;
            };
        });
        modal.querySelector('#save-note-btn').onclick = () => {
            const note = modal.querySelector('.note-textarea').value.trim();
            saveAnnotation(selectedText, note, selectedColor, range);
            modal.remove();
        };
        modal.querySelector('#cancel-note-btn').onclick = () => {
            modal.remove();
            window.getSelection().removeAllRanges();
        };
        setTimeout(() => modal.querySelector('.note-textarea').focus(), 100);
    }

    function showViewNoteModal(annotation) {
        const safeText = annotation.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeNote = (annotation.note || '无笔记').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
        const content = `
            <div class="selected-text">"${safeText}"</div>
            <div class="note-display">
                <strong>笔记:</strong><br>
                ${safeNote}
            </div>
            <div style="margin-top: 10px; color: #666; font-size: 12px;">
                创建于: ${new Date(annotation.createdAt).toLocaleString()}
            </div>
            <div class="modal-buttons" style="margin-top: 15px;">
                <button class="btn btn-danger" id="delete-note-btn">删除</button>
                <button class="btn btn-secondary" onclick="this.closest('.custom-modal').remove()">关闭</button>
            </div>
        `;
        const modal = createModal('查看批注', content);
        modal.querySelector('#delete-note-btn').onclick = () => {
            if (confirm('您确定要删除此条批注吗?')) {
                deleteAnnotation(annotation.id);
                modal.remove();
            }
        };
    }

    // --- Annotation Management (调用新的状态函数) ---
    let allAnnotations = {};
    let currentPageAnnotations = [];

    async function saveAnnotation(text, note, color, range) {
        try {
            const annotationId = 'anno-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const pageId = getPageId();
            const highlightSpan = document.createElement('span');
            highlightSpan.className = HIGHLIGHT_CLASS;
            highlightSpan.dataset.annotationId = annotationId;
            highlightSpan.style.backgroundColor = HIGHLIGHT_COLORS[color];
            range.surroundContents(highlightSpan);
            window.getSelection().removeAllRanges();
            const annotation = {
                id: annotationId, text: text, note: note, color: color,
                url: window.location.href, pageId: pageId,
                createdAt: new Date().toISOString()
            };
            currentPageAnnotations.push(annotation);
            if (!allAnnotations[pageId]) {
                allAnnotations[pageId] = [];
            }
            allAnnotations[pageId].push(annotation);
            saveLocalCache(allAnnotations);
            showSyncStatusIcon('success', '批注已保存!');
            syncWithJianguoyun().catch(e => console.error("后台同步失败 (保存后):", e));
        } catch (e) {
            console.error("保存批注失败:", e);
            showSyncStatusIcon('error', '保存批注失败!');
        }
    }

    async function deleteAnnotation(annotationId) {
        try {
            const pageId = getPageId();
            const highlightElement = document.querySelector(`[data-annotation-id="${annotationId}"]`);
            if (highlightElement) {
                const parent = highlightElement.parentNode;
                const textNode = document.createTextNode(highlightElement.textContent);
                parent.replaceChild(textNode, highlightElement);
                parent.normalize();
            }
            currentPageAnnotations = currentPageAnnotations.filter(a => a.id !== annotationId);
            if (allAnnotations[pageId]) {
                allAnnotations[pageId] = allAnnotations[pageId].filter(a => a.id !== annotationId);
                if (allAnnotations[pageId].length === 0) {
                    delete allAnnotations[pageId];
                }
            }
            saveLocalCache(allAnnotations);
            showSyncStatusIcon('success', '批注已删除!');
            syncWithJianguoyun().catch(e => console.error("后台同步失败 (删除后):", e));
        } catch (e) {
            console.error("删除批注失败:", e);
            showSyncStatusIcon('error', '删除批注失败!');
        }
    }

    function loadPageAnnotations() {
        const pageId = getPageId();
        const pageAnnotations = allAnnotations[pageId] || [];
        document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
        currentPageAnnotations = [];
        pageAnnotations.forEach(anno => {
            let found = false;
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {
                if (node.parentNode.tagName === 'SCRIPT' ||
                    node.parentNode.tagName === 'STYLE' ||
                    node.parentNode.classList.contains(HIGHLIGHT_CLASS)) {
                    continue;
                }
                const nodeText = node.nodeValue;
                const index = nodeText.indexOf(anno.text);
                if (index !== -1) {
                    try {
                        const range = document.createRange();
                        range.setStart(node, index);
                        range.setEnd(node, index + anno.text.length);
                        if (range.toString() === anno.text) {
                            const highlightSpan = document.createElement('span');
                            highlightSpan.className = HIGHLIGHT_CLASS;
                            highlightSpan.dataset.annotationId = anno.id;
                            highlightSpan.style.backgroundColor = HIGHLIGHT_COLORS[anno.color] || HIGHLIGHT_COLORS.yellow;
                            range.surroundContents(highlightSpan);
                            currentPageAnnotations.push(anno);
                            found = true;
                            break;
                        }
                    } catch (e) {
                        console.warn(`无法恢复高亮 "${anno.text}":`, e);
                    }
                }
            }
            if (!found) {
                console.warn(`页面上未找到批注文本 "${anno.text}" 以进行恢复。`);
            }
        });
        console.log(`为当前页面加载了 ${currentPageAnnotations.length} 条批注。`);
    }

    // --- Local Cache Management (不变) ---
    function saveLocalCache(data) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            console.log("批注已保存至本地缓存。");
        } catch (e) {
            console.error("保存至本地存储失败:", e);
        }
    }

    function loadLocalCache() {
        try {
            const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        } catch (e) {
            console.error("从本地存储加载失败:", e);
        }
        return {};
    }

    // 同步到坚果云 (调用新的状态函数)
    async function syncWithJianguoyun() {
        try {
            showSyncStatusIcon('syncing');

            const { annotations: remoteAnnotations } = await getAnnotationsFromJianguoyun();
            let hasChangesToPush = false;
            let currentLocalAnnotations = JSON.parse(JSON.stringify(allAnnotations)); // Deep copy for comparison

            // Merge logic (omitted for brevity, assume original logic is here)
            // ... [Original Merge Logic] ...
            for (const pageId in currentLocalAnnotations) {
                if (currentLocalAnnotations.hasOwnProperty(pageId)) {
                    if (!remoteAnnotations[pageId]) {
                        remoteAnnotations[pageId] = [];
                    }
                    currentLocalAnnotations[pageId].forEach(localAnno => {
                        const remoteIndex = remoteAnnotations[pageId].findIndex(ra => ra.id === localAnno.id);
                        if (remoteIndex !== -1) {
                            if (JSON.stringify(remoteAnnotations[pageId][remoteIndex]) !== JSON.stringify(localAnno)) {
                                remoteAnnotations[pageId][remoteIndex] = localAnno;
                                hasChangesToPush = true;
                            }
                        } else {
                            remoteAnnotations[pageId].push(localAnno);
                            hasChangesToPush = true;
                        }
                    });
                    remoteAnnotations[pageId] = remoteAnnotations[pageId].filter(remoteAnno =>
                        currentLocalAnnotations[pageId].some(localAnno => localAnno.id === remoteAnno.id)
                    );
                    if (remoteAnnotations[pageId].length === 0) {
                        delete remoteAnnotations[pageId];
                    }
                }
            }

            for (const pageId in remoteAnnotations) {
                if (remoteAnnotations.hasOwnProperty(pageId)) {
                    if (!currentLocalAnnotations[pageId]) {
                        currentLocalAnnotations[pageId] = [];
                        hasChangesToPush = true;
                    }
                    remoteAnnotations[pageId].forEach(remoteAnno => {
                        if (!currentLocalAnnotations[pageId].some(localAnno => localAnno.id === remoteAnno.id)) {
                            currentLocalAnnotations[pageId].push(remoteAnno);
                            hasChangesToPush = true;
                        }
                    });
                }
            }
            // ... [End Original Merge Logic] ...


            if (hasChangesToPush || JSON.stringify(currentLocalAnnotations) !== JSON.stringify(allAnnotations)) {
                allAnnotations = currentLocalAnnotations;
                saveLocalCache(allAnnotations);
                await updateAnnotationsOnJianguoyun(allAnnotations);
                localStorage.setItem(LAST_SYNC_KEY, Date.now());
                showSyncStatusIcon('success', '同步成功!');
            } else {
                showSyncStatusIcon('success', '数据已是最新，无需同步!'); // 无需同步也显示成功，但快速消失
            }
        } catch (error) {
            console.error("同步失败:", error);
            showSyncStatusIcon('error', `同步失败: ${error.message || error}`);
        }
    }

    // 从坚果云加载数据 (手动触发, 调用新的状态函数)
    async function loadFromJianguoyun() {
        try {
            showSyncStatusIcon('syncing');
            const { annotations } = await getAnnotationsFromJianguoyun();
            allAnnotations = annotations;
            saveLocalCache(allAnnotations);
            loadPageAnnotations();
            localStorage.setItem(LAST_SYNC_KEY, Date.now());
            showSyncStatusIcon('success', '已从坚果云加载数据!');
        } catch (error) {
            console.error("从坚果云加载数据失败:", error);
            showSyncStatusIcon('error', `加载失败: ${error.message || error}`);
        }
    }

    // --- Event Handling (不变) ---
    let currentSelection = null;
    let currentRange = null;
    let modalTriggered = false;

    function captureTextSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText.length > 0 && !selection.anchorNode.parentNode.classList.contains(HIGHLIGHT_CLASS) && !selection.focusNode.parentNode.classList.contains(HIGHLIGHT_CLASS)) {
            currentSelection = selectedText;
            currentRange = selection.getRangeAt(0).cloneRange();
            modalTriggered = false;
        } else {
            currentSelection = null;
            currentRange = null;
        }
    }

    function handleScroll() {
        if (currentSelection && currentRange && !document.querySelector('.custom-modal') && !modalTriggered) {
            showAddNoteModal(currentSelection, currentRange);
            modalTriggered = true;
            currentSelection = null;
            currentRange = null;
        }
    }

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains(HIGHLIGHT_CLASS)) {
            const annotationId = e.target.dataset.annotationId;
            const annotation = currentPageAnnotations.find(a => a.id === annotationId);
            if (annotation) {
                showViewNoteModal(annotation);
            }
        }
    });

    document.addEventListener('mouseup', captureTextSelection);
    document.addEventListener('touchend', captureTextSelection);
    document.addEventListener('scroll', handleScroll);


    // --- URL 过滤管理功能 (不变) ---

    function loadMatchUrls() {
        try {
            const urls = GM_getValue(MATCH_URLS_KEY, '[]');
            return JSON.parse(urls);
        } catch (e) {
            console.error("加载匹配 URL 列表失败:", e);
            return [];
        }
    }

    function saveMatchUrls(urls) {
        try {
            GM_setValue(MATCH_URLS_KEY, JSON.stringify(urls));
            // 网址列表保存成功后，使用之前的文本提示，因为它不常发生且需要用户关注
            // 并且此时 progressIcon 可能未加载或不应该使用
            let statusDiv = document.querySelector('.sync-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.className = 'sync-status';
                document.body.appendChild(statusDiv);
            }
            statusDiv.className = `sync-status info`;
            statusDiv.textContent = '网址列表已保存!';
            statusDiv.classList.add('show');
            if (statusDiv.timeoutId) {
                clearTimeout(statusDiv.timeoutId);
            }
            statusDiv.timeoutId = setTimeout(() => {
                statusDiv.classList.remove('show');
                setTimeout(() => statusDiv.remove(), 300);
            }, 3000);
        } catch (e) {
            console.error("保存匹配 URL 列表失败:", e);
        }
    }

    function showUrlManagementModal() {
        let matchUrls = loadMatchUrls();

        const content = `
            <p style="margin-bottom: 15px; font-size: 14px; color: #666;">
                请在此处添加您希望启用批注功能的网址。仅支持 **完整 URL** 或 **域名** (例如: <code>https://www.google.com/search?q=test</code> 或 <code>google.com</code>)。
                留空则表示在所有页面启用。
            </p>
            <div class="url-add-wrapper">
                <input type="text" id="new-url-input" class="url-add-input" placeholder="输入要添加的 URL 或域名">
                <button class="btn btn-primary" id="add-url-btn" style="flex-grow: 0;">添加</button>
            </div>
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">当前匹配列表:</label>
            <div id="url-list-container">
                </div>
            <div class="modal-buttons" style="margin-top: 15px; justify-content: space-between;">
                 <span style="font-size: 12px; color: #999;">当前已启用: <strong id="enabled-status"></strong></span>
                <button class="btn btn-secondary" onclick="this.closest('.custom-modal').remove()">关闭</button>
            </div>
        `;
        const modal = createModal('管理网址过滤列表', content);
        const listContainer = modal.querySelector('#url-list-container');
        const input = modal.querySelector('#new-url-input');
        const addButton = modal.querySelector('#add-url-btn');
        const enabledStatusSpan = modal.querySelector('#enabled-status');

        function updateListDisplay() {
            listContainer.innerHTML = '';
            enabledStatusSpan.textContent = matchUrls.length > 0 ? `${matchUrls.length} 个网址` : '在所有页面';
            if (matchUrls.length === 0) {
                listContainer.innerHTML = '<p style="text-align: center; color: #999;">列表为空，脚本将在所有页面启用。</p>';
                return;
            }

            matchUrls.forEach(url => {
                const item = document.createElement('div');
                item.className = 'url-item';
                item.innerHTML = `
                    <span class="url-text">${url}</span>
                    <button class="url-remove-btn" data-url="${url}">&times;</button>
                `;
                listContainer.appendChild(item);
            });

            listContainer.querySelectorAll('.url-remove-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const urlToRemove = e.target.dataset.url;
                    matchUrls = matchUrls.filter(u => u !== urlToRemove);
                    saveMatchUrls(matchUrls);
                    updateListDisplay();
                };
            });
        }

        const addUrl = () => {
            let newUrl = input.value.trim();
            if (newUrl) {
                if (newUrl.endsWith('/')) {
                    newUrl = newUrl.slice(0, -1);
                }
                if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://') && newUrl.includes('/')) {
                    newUrl = 'https://' + newUrl;
                }

                if (!matchUrls.includes(newUrl)) {
                    matchUrls.push(newUrl);
                    saveMatchUrls(matchUrls);
                    updateListDisplay();
                    input.value = '';
                } else {
                    // 仅在模态框内显示信息
                    alert('该网址已存在!');
                }
            }
        };

        addButton.onclick = addUrl;
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addUrl();
            }
        });

        updateListDisplay();
    }

    function isUrlMatched(currentUrl, matchUrls) {
        if (matchUrls.length === 0) {
            return true;
        }

        const normalizedCurrentUrl = currentUrl.split('?')[0].split('#')[0];
        
        return matchUrls.some(rule => {
            if (rule.startsWith('http://') || rule.startsWith('https://')) {
                return normalizedCurrentUrl.startsWith(rule);
            } else {
                return currentUrl.includes(rule);
            }
        });
    }

    // --- New Functionality (Clear/Export, using new status icon) ---

    async function clearAllAnnotations() {
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * 5) + 1;
        const answer = num1 + num2;
        const userAnswer = prompt(`警告：此操作将清空所有批注（本地和云端）。请回答：${num1} + ${num2} = ?`);

        if (userAnswer === null || parseInt(userAnswer) !== answer) {
            showSyncStatusIcon('hide'); // 取消操作不显示错误
            return;
        }

        if (!confirm('再次确认：您确定要彻底删除所有批注吗？此操作不可撤销！')) {
            showSyncStatusIcon('hide');
            return;
        }

        try {
            showSyncStatusIcon('syncing');
            allAnnotations = {};
            saveLocalCache(allAnnotations);
            await updateAnnotationsOnJianguoyun({});
            localStorage.removeItem(LAST_SYNC_KEY);
            loadPageAnnotations();
            showSyncStatusIcon('success', '所有批注已成功清空！');
        } catch (error) {
            console.error("清空所有批注失败:", error);
            showSyncStatusIcon('error', `清空失败: ${error.message || error}`);
        }
    }

    function exportAllAnnotationsToTxt() {
        let exportContent = [];
        let totalAnnotations = 0;

        for (const pageId in allAnnotations) {
            if (allAnnotations.hasOwnProperty(pageId)) {
                allAnnotations[pageId].forEach(anno => {
                    const cleanedText = anno.text.replace(/[\n\r]/g, ' ').trim();
                    const cleanedNote = (anno.note || '').replace(/[\n\r]/g, ' ').trim();
                    exportContent.push(`${cleanedText}|${cleanedNote}`);
                    totalAnnotations++;
                });
            }
        }

        if (totalAnnotations === 0) {
            // 不显示图标，因为这不是同步错误
            console.log('没有批注可导出。'); 
            return;
        }

        const filename = `Annotations_Export_${new Date().toISOString().split('T')[0]}.txt`;
        const blob = new Blob([exportContent.join('\n')], { type: 'text/plain;charset=utf-8' });

        GM_download({
            url: URL.createObjectURL(blob),
            name: filename,
            saveAs: true,
            onload: () => showSyncStatusIcon('success', `成功导出 ${totalAnnotations} 条批注到 ${filename}`),
            onerror: (error) => {
                console.error("导出文件失败:", error);
                showSyncStatusIcon('error', `导出失败: ${error.details || error}`);
            }
        });
    }


    // --- Initialization ---
    async function initialize() {
        const matchUrls = loadMatchUrls();

        if (!isUrlMatched(window.location.href, matchUrls)) {
            console.log(`当前 URL (${window.location.href}) 不在匹配列表中，脚本核心功能停止运行。`);
            // 只注册 URL 管理菜单
            GM_registerMenuCommand("🌐 管理启用网址列表", showUrlManagementModal);
            return;
        }

        // 如果匹配成功，创建进度图标并继续初始化
        createProgressIcon();
        allAnnotations = loadLocalCache();
        loadPageAnnotations();

        const lastSyncTimestamp = parseInt(localStorage.getItem(LAST_SYNC_KEY) || '0', 10);
        const syncInterval = 1 * 60 * 60 * 1000;

        if (Date.now() - lastSyncTimestamp > syncInterval) {
            console.log("计划的坚果云同步时间已到...");
            try {
                await syncWithJianguoyun();
                loadPageAnnotations();
            } catch (error) {
                console.warn("初始化时坚果云同步失败:", error);
                showSyncStatusIcon('error', '初始化时无法与坚果云同步，正在使用本地数据。');
            }
        } else {
            console.log("坚果云同步时间未到，使用本地缓存。");
            // 快速显示一次成功状态，表示数据已加载且本地数据最新
            showSyncStatusIcon('success', '已加载本地批注数据。');
        }

        registerMenuCommands();
    }

    function registerMenuCommands() {
        GM_registerMenuCommand("🌐 管理启用网址列表", showUrlManagementModal);
        GM_registerMenuCommand("---", () => {});
        GM_registerMenuCommand("🔄 同步到坚果云", syncWithJianguoyun);
        GM_registerMenuCommand("📥 从坚果云加载", loadFromJianguoyun);
        GM_registerMenuCommand("---", () => {});
        GM_registerMenuCommand("🗑️ 清空当前页面批注", async function() {
            if (confirm('您确定要清空当前页面的所有批注吗？该操作也会在同步时从坚果云移除它们。')) {
                const pageId = getPageId();
                document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
                    const parent = el.parentNode;
                    parent.replaceChild(document.createTextNode(el.textContent), el);
                    parent.normalize();
                });
                if (allAnnotations[pageId]) {
                    delete allAnnotations[pageId];
                }
                currentPageAnnotations = [];
                saveLocalCache(allAnnotations);
                showSyncStatusIcon('success', '当前页面批注已清空!');
                await syncWithJianguoyun();
            }
        });
        GM_registerMenuCommand("🚫 清空所有批注 (本地和云端)", clearAllAnnotations);
        GM_registerMenuCommand("📤 导出所有批注为TXT", exportAllAnnotationsToTxt);
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();