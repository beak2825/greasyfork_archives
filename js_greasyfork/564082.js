// ==UserScript==
// @name         幕布批量导出工具 (Mubu Batch Export)
// @namespace    https://mubu.com/
// @version      1.0.0
// @description  批量导出幕布笔记为 Markdown/OPML/JSON 格式
// @author       r007b34r
// @match        https://mubu.com/*
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564082/%E5%B9%95%E5%B8%83%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20%28Mubu%20Batch%20Export%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564082/%E5%B9%95%E5%B8%83%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7%20%28Mubu%20Batch%20Export%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============== 样式定义 ==============
    GM_addStyle(`
        .mbe-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .mbe-panel {
            background: #fff;
            border-radius: 12px;
            width: 700px;
            max-height: 80vh;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .mbe-header {
            padding: 20px 24px;
            border-bottom: 1px solid #e8e8e8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .mbe-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        .mbe-close {
            width: 32px;
            height: 32px;
            border: none;
            background: #f5f5f5;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .mbe-close:hover {
            background: #e8e8e8;
            color: #333;
        }
        .mbe-body {
            flex: 1;
            overflow-y: auto;
            padding: 20px 24px;
        }
        .mbe-section {
            margin-bottom: 20px;
        }
        .mbe-section-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }
        .mbe-format-options {
            display: flex;
            gap: 12px;
        }
        .mbe-format-btn {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e8e8e8;
            border-radius: 8px;
            background: #fff;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
        }
        .mbe-format-btn:hover {
            border-color: #4a90d9;
        }
        .mbe-format-btn.active {
            border-color: #4a90d9;
            background: #f0f7ff;
        }
        .mbe-format-btn .format-name {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }
        .mbe-format-btn .format-desc {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
        }
        .mbe-doc-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
        }
        .mbe-doc-item {
            padding: 12px 16px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: background 0.2s;
        }
        .mbe-doc-item:last-child {
            border-bottom: none;
        }
        .mbe-doc-item:hover {
            background: #f9f9f9;
        }
        .mbe-doc-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        .mbe-doc-info {
            flex: 1;
            min-width: 0;
        }
        .mbe-doc-name {
            font-size: 14px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .mbe-doc-meta {
            font-size: 12px;
            color: #888;
            margin-top: 2px;
        }
        .mbe-toolbar {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
        }
        .mbe-toolbar-btn {
            padding: 8px 16px;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            background: #fff;
            cursor: pointer;
            font-size: 13px;
            color: #666;
            transition: all 0.2s;
        }
        .mbe-toolbar-btn:hover {
            border-color: #4a90d9;
            color: #4a90d9;
        }
        .mbe-footer {
            padding: 16px 24px;
            border-top: 1px solid #e8e8e8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .mbe-status {
            font-size: 13px;
            color: #666;
        }
        .mbe-actions {
            display: flex;
            gap: 12px;
        }
        .mbe-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .mbe-btn-secondary {
            background: #f5f5f5;
            color: #666;
        }
        .mbe-btn-secondary:hover {
            background: #e8e8e8;
        }
        .mbe-btn-primary {
            background: #4a90d9;
            color: #fff;
        }
        .mbe-btn-primary:hover {
            background: #3a7fc8;
        }
        .mbe-btn-primary:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .mbe-progress {
            margin-top: 16px;
        }
        .mbe-progress-bar {
            height: 8px;
            background: #e8e8e8;
            border-radius: 4px;
            overflow: hidden;
        }
        .mbe-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90d9, #6aa3e0);
            border-radius: 4px;
            transition: width 0.3s;
        }
        .mbe-progress-text {
            font-size: 13px;
            color: #666;
            margin-top: 8px;
            text-align: center;
        }
        .mbe-float-btn {
            position: fixed;
            right: 24px;
            bottom: 24px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4a90d9, #6aa3e0);
            border: none;
            box-shadow: 0 4px 16px rgba(74, 144, 217, 0.4);
            cursor: pointer;
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        .mbe-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(74, 144, 217, 0.5);
        }
        .mbe-float-btn svg {
            width: 24px;
            height: 24px;
            fill: #fff;
        }
        .mbe-loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .mbe-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e8e8e8;
            border-top-color: #4a90d9;
            border-radius: 50%;
            animation: mbe-spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        @keyframes mbe-spin {
            to { transform: rotate(360deg); }
        }
        .mbe-empty {
            text-align: center;
            padding: 40px;
            color: #888;
        }
        .mbe-log {
            margin-top: 12px;
            max-height: 150px;
            overflow-y: auto;
            background: #f9f9f9;
            border-radius: 6px;
            padding: 12px;
            font-size: 12px;
            font-family: monospace;
        }
        .mbe-log-item {
            padding: 4px 0;
            border-bottom: 1px solid #eee;
        }
        .mbe-log-item:last-child {
            border-bottom: none;
        }
        .mbe-log-success { color: #52c41a; }
        .mbe-log-error { color: #ff4d4f; }
        .mbe-log-info { color: #666; }
    `);

    // ============== 工具函数 ==============
    function getJwtToken() {
        // 从 localStorage 或 cookie 获取 token (注意大小写: Jwt-Token)
        const token = localStorage.getItem('Jwt-Token') ||
                      localStorage.getItem('jwt-token');
        if (token) return token;

        // 从 cookie 获取
        const cookieMatch = document.cookie.split(';').find(c => c.trim().startsWith('Jwt-Token='));
        if (cookieMatch) {
            return cookieMatch.split('=')[1];
        }
        return null;
    }

    function getHeaders() {
        const token = getJwtToken();
        return {
            'Content-Type': 'application/json',
            'jwt-token': token,  // API 请求头用小写
            'platform': 'web',
            'version': '3.0.0',
            'system': 'Windows',
            'devicemodel': 'Chrome'
        };
    }

    async function fetchDocList(folderId = 0, source = 'recent') {
        const response = await fetch('https://api2.mubu.com/v3/api/list/get', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                folderId: folderId,
                sort: 'time',
                keywords: '',
                source: source
            })
        });
        const data = await response.json();
        if (data.code === 0) {
            return data.data;
        }
        throw new Error(data.msg || '获取文档列表失败');
    }

    async function fetchDocContent(docId) {
        const response = await fetch('https://api2.mubu.com/v3/api/document/edit/get', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                docId: docId,
                password: '',
                isFromDocDir: true
            })
        });
        const data = await response.json();
        if (data.code === 0) {
            return data.data;
        }
        throw new Error(data.msg || '获取文档内容失败');
    }

    // ============== 格式转换 ==============
    function parseDefinition(definition) {
        try {
            const parsed = JSON.parse(definition);
            return parsed.nodes || [];
        } catch (e) {
            return [];
        }
    }

    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    function nodesToMarkdown(nodes, level = 0) {
        let md = '';
        const indent = '  '.repeat(level);

        for (const node of nodes) {
            const text = stripHtml(node.text || '');
            if (text.trim()) {
                if (level === 0) {
                    md += `# ${text}\n\n`;
                } else {
                    md += `${indent}- ${text}\n`;
                }
            }

            if (node.children && node.children.length > 0) {
                md += nodesToMarkdown(node.children, level + 1);
            }
        }

        return md;
    }

    function nodesToOpml(nodes, docName) {
        let opml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(docName)}</title>
  </head>
  <body>
`;
        opml += nodesToOpmlOutline(nodes, 2);
        opml += `  </body>
</opml>`;
        return opml;
    }

    function nodesToOpmlOutline(nodes, indentLevel) {
        let output = '';
        const indent = '  '.repeat(indentLevel);

        for (const node of nodes) {
            const text = stripHtml(node.text || '');
            if (text.trim()) {
                if (node.children && node.children.length > 0) {
                    output += `${indent}<outline text="${escapeXml(text)}">\n`;
                    output += nodesToOpmlOutline(node.children, indentLevel + 1);
                    output += `${indent}</outline>\n`;
                } else {
                    output += `${indent}<outline text="${escapeXml(text)}"/>\n`;
                }
            } else if (node.children && node.children.length > 0) {
                output += nodesToOpmlOutline(node.children, indentLevel);
            }
        }

        return output;
    }

    function escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function convertDoc(docData, format) {
        const nodes = parseDefinition(docData.definition);
        const name = docData.name || 'untitled';

        switch (format) {
            case 'markdown':
                return {
                    content: nodesToMarkdown(nodes),
                    ext: 'md'
                };
            case 'opml':
                return {
                    content: nodesToOpml(nodes, name),
                    ext: 'opml'
                };
            case 'json':
                return {
                    content: JSON.stringify({
                        name: name,
                        nodes: nodes
                    }, null, 2),
                    ext: 'json'
                };
            default:
                return {
                    content: nodesToMarkdown(nodes),
                    ext: 'md'
                };
        }
    }

    // ============== 下载功能 ==============
    function downloadFile(filename, content, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async function downloadAsZip(files) {
        // 使用简单的文本合并方式，避免依赖外部库
        // 实际使用时可以引入 JSZip
        if (files.length === 1) {
            downloadFile(files[0].name, files[0].content);
            return;
        }

        // 多文件逐个下载
        for (const file of files) {
            downloadFile(file.name, file.content);
            await new Promise(r => setTimeout(r, 300)); // 避免浏览器拦截
        }
    }

    // ============== UI 组件 ==============
    class ExportPanel {
        constructor() {
            this.overlay = null;
            this.documents = [];
            this.selectedDocs = new Set();
            this.format = 'markdown';
            this.isExporting = false;
            this.logs = [];
        }

        async show() {
            this.createUI();
            await this.loadDocuments();
        }

        hide() {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
        }

        createUI() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'mbe-overlay';
            this.overlay.innerHTML = `
                <div class="mbe-panel">
                    <div class="mbe-header">
                        <div class="mbe-title">批量导出幕布笔记</div>
                        <button class="mbe-close">&times;</button>
                    </div>
                    <div class="mbe-body">
                        <div class="mbe-section">
                            <div class="mbe-section-title">导出格式</div>
                            <div class="mbe-format-options">
                                <button class="mbe-format-btn active" data-format="markdown">
                                    <div class="format-name">Markdown</div>
                                    <div class="format-desc">通用文本格式</div>
                                </button>
                                <button class="mbe-format-btn" data-format="opml">
                                    <div class="format-name">OPML</div>
                                    <div class="format-desc">大纲格式</div>
                                </button>
                                <button class="mbe-format-btn" data-format="json">
                                    <div class="format-name">JSON</div>
                                    <div class="format-desc">原始数据</div>
                                </button>
                            </div>
                        </div>
                        <div class="mbe-section">
                            <div class="mbe-section-title">选择文档</div>
                            <div class="mbe-toolbar">
                                <button class="mbe-toolbar-btn" id="mbe-select-all">全选</button>
                                <button class="mbe-toolbar-btn" id="mbe-select-none">取消全选</button>
                                <button class="mbe-toolbar-btn" id="mbe-refresh">刷新列表</button>
                            </div>
                            <div class="mbe-doc-list" id="mbe-doc-list">
                                <div class="mbe-loading">
                                    <div class="mbe-loading-spinner"></div>
                                    正在加载文档列表...
                                </div>
                            </div>
                        </div>
                        <div class="mbe-progress" id="mbe-progress" style="display: none;">
                            <div class="mbe-progress-bar">
                                <div class="mbe-progress-fill" id="mbe-progress-fill" style="width: 0%"></div>
                            </div>
                            <div class="mbe-progress-text" id="mbe-progress-text">准备导出...</div>
                            <div class="mbe-log" id="mbe-log"></div>
                        </div>
                    </div>
                    <div class="mbe-footer">
                        <div class="mbe-status" id="mbe-status">已选择 0 个文档</div>
                        <div class="mbe-actions">
                            <button class="mbe-btn mbe-btn-secondary" id="mbe-cancel">取消</button>
                            <button class="mbe-btn mbe-btn-primary" id="mbe-export" disabled>开始导出</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(this.overlay);
            this.bindEvents();
        }

        bindEvents() {
            // 关闭按钮
            this.overlay.querySelector('.mbe-close').addEventListener('click', () => this.hide());
            this.overlay.querySelector('#mbe-cancel').addEventListener('click', () => this.hide());

            // 点击遮罩关闭
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.hide();
            });

            // 格式选择
            this.overlay.querySelectorAll('.mbe-format-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.overlay.querySelectorAll('.mbe-format-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.format = btn.dataset.format;
                });
            });

            // 全选/取消全选
            this.overlay.querySelector('#mbe-select-all').addEventListener('click', () => {
                this.documents.forEach(doc => this.selectedDocs.add(String(doc.id)));
                this.updateDocList();
                this.updateStatus();
            });

            this.overlay.querySelector('#mbe-select-none').addEventListener('click', () => {
                this.selectedDocs.clear();
                this.updateDocList();
                this.updateStatus();
            });

            // 刷新
            this.overlay.querySelector('#mbe-refresh').addEventListener('click', () => this.loadDocuments());

            // 导出
            this.overlay.querySelector('#mbe-export').addEventListener('click', () => this.startExport());
        }

        async loadDocuments() {
            const listEl = this.overlay.querySelector('#mbe-doc-list');
            listEl.innerHTML = `
                <div class="mbe-loading">
                    <div class="mbe-loading-spinner"></div>
                    正在加载文档列表...
                </div>
            `;

            try {
                // 获取最近文档
                const data = await fetchDocList(0, 'recent');
                this.documents = data.documents || [];

                // 同时获取文件夹中的文档
                if (data.folders && data.folders.length > 0) {
                    for (const folder of data.folders) {
                        try {
                            const folderData = await fetchDocList(folder.id);
                            if (folderData.documents) {
                                this.documents.push(...folderData.documents);
                            }
                        } catch (e) {
                            console.warn('加载文件夹失败:', folder.name, e);
                        }
                    }
                }

                // 去重
                const seen = new Set();
                this.documents = this.documents.filter(doc => {
                    if (seen.has(doc.id)) return false;
                    seen.add(doc.id);
                    return true;
                });

                this.updateDocList();
            } catch (e) {
                listEl.innerHTML = `<div class="mbe-empty">加载失败: ${e.message}</div>`;
            }
        }

        updateDocList() {
            const listEl = this.overlay.querySelector('#mbe-doc-list');

            if (this.documents.length === 0) {
                listEl.innerHTML = '<div class="mbe-empty">没有找到文档</div>';
                return;
            }

            listEl.innerHTML = this.documents.map(doc => `
                <div class="mbe-doc-item">
                    <input type="checkbox" data-id="${doc.id}" ${this.selectedDocs.has(String(doc.id)) ? 'checked' : ''}>
                    <div class="mbe-doc-info">
                        <div class="mbe-doc-name">${this.escapeHtml(doc.name)}</div>
                        <div class="mbe-doc-meta">更新于 ${this.formatDate(doc.updateTime)}</div>
                    </div>
                </div>
            `).join('');

            // 绑定复选框事件
            listEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.addEventListener('change', () => {
                    const id = cb.dataset.id;
                    if (cb.checked) {
                        this.selectedDocs.add(id);
                    } else {
                        this.selectedDocs.delete(id);
                    }
                    this.updateStatus();
                });
            });
        }

        updateStatus() {
            const statusEl = this.overlay.querySelector('#mbe-status');
            const exportBtn = this.overlay.querySelector('#mbe-export');
            const count = this.selectedDocs.size;

            statusEl.textContent = `已选择 ${count} 个文档`;
            exportBtn.disabled = count === 0 || this.isExporting;
        }

        async startExport() {
            if (this.selectedDocs.size === 0 || this.isExporting) return;

            this.isExporting = true;
            this.logs = [];

            const progressEl = this.overlay.querySelector('#mbe-progress');
            const progressFill = this.overlay.querySelector('#mbe-progress-fill');
            const progressText = this.overlay.querySelector('#mbe-progress-text');
            const logEl = this.overlay.querySelector('#mbe-log');
            const exportBtn = this.overlay.querySelector('#mbe-export');

            progressEl.style.display = 'block';
            exportBtn.disabled = true;
            exportBtn.textContent = '导出中...';

            const selectedIds = Array.from(this.selectedDocs);
            const files = [];
            let completed = 0;
            let failed = 0;

            for (const docId of selectedIds) {
                const doc = this.documents.find(d => String(d.id) === docId);
                const docName = doc ? doc.name : docId;

                try {
                    this.addLog(`正在导出: ${docName}`, 'info');
                    logEl.innerHTML = this.logs.map(l =>
                        `<div class="mbe-log-item mbe-log-${l.type}">${l.text}</div>`
                    ).join('');
                    logEl.scrollTop = logEl.scrollHeight;

                    const docData = await fetchDocContent(docId);
                    const converted = convertDoc(docData, this.format);
                    const safeName = docName.replace(/[<>:"/\\|?*]/g, '_');

                    files.push({
                        name: `${safeName}.${converted.ext}`,
                        content: converted.content
                    });

                    this.addLog(`完成: ${docName}`, 'success');
                    completed++;
                } catch (e) {
                    this.addLog(`失败: ${docName} - ${e.message}`, 'error');
                    failed++;
                }

                const progress = ((completed + failed) / selectedIds.length) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `已完成 ${completed + failed}/${selectedIds.length}，成功 ${completed}，失败 ${failed}`;

                logEl.innerHTML = this.logs.map(l =>
                    `<div class="mbe-log-item mbe-log-${l.type}">${l.text}</div>`
                ).join('');
                logEl.scrollTop = logEl.scrollHeight;

                // 避免请求过快
                await new Promise(r => setTimeout(r, 200));
            }

            // 下载文件
            if (files.length > 0) {
                this.addLog(`开始下载 ${files.length} 个文件...`, 'info');
                logEl.innerHTML = this.logs.map(l =>
                    `<div class="mbe-log-item mbe-log-${l.type}">${l.text}</div>`
                ).join('');

                await downloadAsZip(files);

                this.addLog('导出完成!', 'success');
            }

            logEl.innerHTML = this.logs.map(l =>
                `<div class="mbe-log-item mbe-log-${l.type}">${l.text}</div>`
            ).join('');

            this.isExporting = false;
            exportBtn.textContent = '开始导出';
            this.updateStatus();
        }

        addLog(text, type) {
            this.logs.push({ text, type });
            if (this.logs.length > 50) {
                this.logs.shift();
            }
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        formatDate(timestamp) {
            const date = new Date(timestamp);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
    }

    // ============== 入口 ==============
    function createFloatButton() {
        const btn = document.createElement('button');
        btn.className = 'mbe-float-btn';
        btn.title = '批量导出';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        `;
        btn.addEventListener('click', () => {
            const panel = new ExportPanel();
            panel.show();
        });
        document.body.appendChild(btn);
    }

    // 等待页面加载完成
    function init() {
        if (document.querySelector('.mbe-float-btn')) return;

        // 确保在幕布应用页面
        if (location.href.includes('mubu.com/app') || location.href.includes('mubu.com/doc')) {
            createFloatButton();
        }
    }

    // 初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // 监听路由变化（SPA）
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 500);
        }
    }).observe(document.body, { subtree: true, childList: true });

})();
