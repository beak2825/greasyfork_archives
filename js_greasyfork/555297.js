// ==UserScript==
// @name         小红书链接收藏家
// @namespace    https://tampermonkey.net/
// @version      1.9
// @description  在收藏弹窗内直接管理文档，快速查找和操作
// @author       大佬的鼠DonRat
// @match        https://www.xiaohongshu.com/*
// @match        https://xiaohongshu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @license      Copyright (c) [大佬的鼠DonRat] All rights reserved.
// @downloadURL https://update.greasyfork.org/scripts/555297/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%93%BE%E6%8E%A5%E6%94%B6%E8%97%8F%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555297/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E9%93%BE%E6%8E%A5%E6%94%B6%E8%97%8F%E5%AE%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let docs = GM_getValue('xhsLinkDocs', {});
    const MENU_ID = 'xhs-link-manager';
    const EXPORT_CHANNEL = 'xhs_export_channel';

    function saveDocs() {
        GM_setValue('xhsLinkDocs', docs);
    }

    // 创建复制按钮
    function createCopyButton() {
        if (document.getElementById('xhs-copy-btn')) return;

        const button = document.createElement('button');
        button.id = 'xhs-copy-btn';
        button.textContent = '📋 收藏笔记链接';
        button.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 99999;
            padding: 10px 16px;
            background: linear-gradient(135deg, #ff2442 0%, #ff7a2e 100%);
            color: white;
            border: none;
            border-radius: 24px;
            box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        `;

        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
        });

        button.addEventListener('click', () => {
            const currentUrl = window.location.href;
            showDocumentSelector(currentUrl);
        });

        document.body.appendChild(button);
    }

    // 核心优化：在收藏弹窗内集成文档管理功能
    function showDocumentSelector(url) {
        const existingSelector = document.getElementById('xhs-doc-selector');
        if (existingSelector) existingSelector.remove();

        const container = document.createElement('div');
        container.id = 'xhs-doc-selector';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            padding: 24px;
            width: 90%;
            max-width: 500px;
        `;

        // 标题和搜索框（核心优化1：快速查找文档）
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '16px';

        const title = document.createElement('h3');
        title.textContent = '选择保存的文档';
        title.style.margin = '0';
        header.appendChild(title);

        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '搜索文档...';
        searchBox.style.padding = '6px 10px';
        searchBox.style.border = '1px solid #ddd';
        searchBox.style.borderRadius = '4px';
        searchBox.style.width = '180px';
        searchBox.addEventListener('input', (e) => {
            filterDocuments(e.target.value);
        });
        header.appendChild(searchBox);
        container.appendChild(header);

        // 文档列表容器（带滚动，适合大量文档）
        const docListContainer = document.createElement('div');
        docListContainer.style.maxHeight = '300px';
        docListContainer.style.overflowY = 'auto';
        docListContainer.style.marginBottom = '16px';
        docListContainer.id = 'doc-list-container';

        const docList = document.createElement('div');
        docList.id = 'doc-list';
        docList.style.marginBottom = '16px';

        renderDocumentList(docList, url);
        docListContainer.appendChild(docList);
        container.appendChild(docListContainer);

        // 操作按钮区域
        const buttonArea = document.createElement('div');
        buttonArea.style.display = 'grid';
        buttonArea.style.gridTemplateColumns = '1fr 1fr';
        buttonArea.style.gap = '10px';
        buttonArea.style.marginBottom = '16px';

        // 新建文档按钮
        const newDocBtn = document.createElement('button');
        newDocBtn.textContent = '+ 新建文档';
        newDocBtn.style.cssText = `
            padding: 10px;
            background: #f0f7ff;
            color: #165dff;
            border: 1px dashed #165dff;
            border-radius: 6px;
            cursor: pointer;
        `;
        newDocBtn.addEventListener('click', () => {
            const docName = prompt('请输入新文档名称：');
            if (docName?.trim()) {
                saveUrlToDocument(url, docName.trim());
                container.remove();
                document.getElementById('xhs-overlay').remove();
            }
        });
        buttonArea.appendChild(newDocBtn);

        // 批量操作按钮（核心优化2：弹窗内直接管理）
        const batchOpsBtn = document.createElement('button');
        batchOpsBtn.textContent = '文档管理 ▾';
        batchOpsBtn.style.cssText = `
            padding: 10px;
            background: #f5f5f5;
            color: #666;
            border: 1px solid #eee;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
        `;

        // 下拉菜单
        const batchMenu = document.createElement('div');
        batchMenu.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #eee;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            width: 160px;
            padding: 8px 0;
            z-index: 1000;
            display: none;
        `;

        // 重命名选中文档
        const renameItem = document.createElement('div');
        renameItem.textContent = '重命名文档';
        renameItem.style.padding = '8px 16px';
        renameItem.style.cursor = 'pointer';
        renameItem.addEventListener('mouseover', () => renameItem.style.background = '#f5f5f5');
        renameItem.addEventListener('mouseout', () => renameItem.style.background = 'transparent');
        renameItem.addEventListener('click', () => {
            const selectedDoc = document.querySelector('.doc-btn.selected');
            if (selectedDoc) {
                const oldName = selectedDoc.dataset.name;
                const newName = prompt('重命名文档：', oldName);
                if (newName?.trim() && newName !== oldName) {
                    docs[newName] = docs[oldName];
                    delete docs[oldName];
                    saveDocs();
                    renderDocumentList(docList, url); // 刷新列表
                }
            } else {
                alert('请先点击选择一个文档');
            }
        });

        // 删除选中文档
        const deleteItem = document.createElement('div');
        deleteItem.textContent = '删除选中文档';
        deleteItem.style.padding = '8px 16px';
        deleteItem.style.cursor = 'pointer';
        deleteItem.addEventListener('mouseover', () => deleteItem.style.background = '#f5f5f5');
        deleteItem.addEventListener('mouseout', () => deleteItem.style.background = 'transparent');
        deleteItem.addEventListener('click', () => {
            const selectedDoc = document.querySelector('.doc-btn.selected');
            if (selectedDoc) {
                const docName = selectedDoc.dataset.name;
                if (confirm(`确定删除“${docName}”？`)) {
                    delete docs[docName];
                    saveDocs();
                    renderDocumentList(docList, url); // 刷新列表
                }
            } else {
                alert('请先点击选择一个文档');
            }
        });

        // 导出选中文档
        const exportItem = document.createElement('div');
        exportItem.textContent = '导出选中文档';
        exportItem.style.padding = '8px 16px';
        exportItem.style.cursor = 'pointer';
        exportItem.addEventListener('mouseover', () => exportItem.style.background = '#f5f5f5');
        exportItem.addEventListener('mouseout', () => exportItem.style.background = 'transparent');
        exportItem.addEventListener('click', () => {
            const selectedDoc = document.querySelector('.doc-btn.selected');
            if (selectedDoc) {
                const docName = selectedDoc.dataset.name;
                const requestId = Date.now() + '-' + Math.random().toString(36).slice(2, 10);
                localStorage.setItem(EXPORT_CHANNEL, JSON.stringify({
                    id: requestId,
                    type: 'export',
                    doc: docName,
                    timestamp: Date.now()
                }));
                alert(`“${docName}”导出成功`);
            } else {
                alert('请先点击选择一个文档');
            }
        });

        batchMenu.appendChild(renameItem);
        batchMenu.appendChild(deleteItem);
        batchMenu.appendChild(exportItem);
        batchOpsBtn.appendChild(batchMenu);

        // 显示/隐藏下拉菜单
        batchOpsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            batchMenu.style.display = batchMenu.style.display === 'block' ? 'none' : 'block';
        });

        // 点击其他区域关闭菜单
        document.addEventListener('click', () => {
            batchMenu.style.display = 'none';
        });

        buttonArea.appendChild(batchOpsBtn);
        container.appendChild(buttonArea);

        // 取消按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '取消';
        closeBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: transparent;
            color: #666;
            border: 1px solid #eee;
            border-radius: 6px;
            cursor: pointer;
        `;
        closeBtn.addEventListener('click', () => {
            container.remove();
            document.getElementById('xhs-overlay').remove();
        });
        container.appendChild(closeBtn);

        // 遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'xhs-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999998;
        `;
        overlay.addEventListener('click', () => {
            container.remove();
            overlay.remove();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(container);
    }

    // 渲染文档列表（支持选中状态和排序）
    function renderDocumentList(container, url) {
        container.innerHTML = '';
        const docNames = Object.keys(docs).sort((a, b) => a.localeCompare(b)); // 中文排序

        if (docNames.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = '暂无文档，创建一个新文档吧~';
            emptyMsg.style.color = '#999';
            emptyMsg.style.margin = '10px 0';
            container.appendChild(emptyMsg);
            return;
        }

        docNames.forEach(name => {
            const docBtn = document.createElement('button');
            docBtn.className = 'doc-btn';
            docBtn.dataset.name = name;
            docBtn.textContent = name + `（${docs[name].length}条）`;
            docBtn.style.cssText = `
                width: 100%;
                padding: 10px;
                margin-bottom: 8px;
                background: #f5f5f5;
                border: 1px solid transparent;
                border-radius: 6px;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s;
            `;

            // 点击选中效果
            docBtn.addEventListener('click', (e) => {
                // 区分点击是为了选中还是保存
                if (e.detail === 1) {
                    // 单选效果
                    document.querySelectorAll('.doc-btn').forEach(btn => {
                        btn.classList.remove('selected');
                        btn.style.background = '#f5f5f5';
                        btn.style.borderColor = 'transparent';
                    });
                    docBtn.classList.add('selected');
                    docBtn.style.background = '#e6f7ed';
                    docBtn.style.borderColor = '#b7eb8f';
                } else if (e.detail === 2) {
                    // 双击直接保存
                    saveUrlToDocument(url, name);
                    document.getElementById('xhs-doc-selector').remove();
                    document.getElementById('xhs-overlay').remove();
                }
            });

            // 右键保存（额外快捷方式）
            docBtn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                saveUrlToDocument(url, name);
                document.getElementById('xhs-doc-selector').remove();
                document.getElementById('xhs-overlay').remove();
            });

            container.appendChild(docBtn);
        });
    }

    // 搜索过滤文档
    function filterDocuments(keyword) {
        const docBtns = document.querySelectorAll('.doc-btn');
        keyword = keyword.toLowerCase();
        docBtns.forEach(btn => {
            const docName = btn.dataset.name.toLowerCase();
            if (docName.includes(keyword)) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    // 保存链接到文档
    function saveUrlToDocument(url, docName) {
        if (!docs[docName]) docs[docName] = [];

        if (docs[docName].some(item => item.url === url)) {
            alert(`链接已存在于“${docName}”文档中`);
            return;
        }

        docs[docName].push({
            url: url,
            title: document.title || '未命名笔记',
            time: new Date().toLocaleString()
        });

        saveDocs();
        alert(`已保存到“${docName}”文档`);
    }

    // 导出文档到本地文件
    function exportDocToFile(docName) {
        const links = docs[docName] || [];
        if (links.length === 0) {
            alert('该文档为空，无需导出');
            return;
        }

        const fileContent = links.map(item => item.url).join('\n');
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docName}_小红书链接.txt`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // 导出请求监听器
    function setupExportListener() {
        let lastProcessedId = null;
        setInterval(() => {
            try {
                const rawData = localStorage.getItem(EXPORT_CHANNEL);
                if (!rawData) return;

                const data = JSON.parse(rawData);
                if (data.type === 'export' && data.id !== lastProcessedId) {
                    lastProcessedId = data.id;
                    exportDocToFile(data.doc);
                    localStorage.removeItem(EXPORT_CHANNEL);
                }
            } catch (e) {
                console.error('处理导出请求失败:', e);
                localStorage.removeItem(EXPORT_CHANNEL);
            }
        }, 200);
    }

    // 处理文档操作
    function handleDocActions() {
        const action = window.localStorage.getItem('xhsDocAction');
        if (!action) return;

        try {
            const { type, name, index } = JSON.parse(action);

            switch (type) {
                case 'deleteDoc':
                    if (docs[name]) delete docs[name];
                    saveDocs();
                    break;
                case 'deleteLink':
                    if (docs[name]?.[index] !== undefined) {
                        docs[name].splice(index, 1);
                        saveDocs();
                    }
                    break;
            }
        } catch (e) {
            console.error('操作失败:', e);
        } finally {
            window.localStorage.removeItem('xhsDocAction');
        }
    }

    // 注册菜单
    function registerMenuCommands() {
        GM_unregisterMenuCommand(MENU_ID);
        GM_registerMenuCommand('查看所有文档', () => {
            handleDocActions();
            const tab = window.open('', '_blank');
            tab.document.write(generateDocsHtml());
            tab.document.close();
        }, MENU_ID);
    }

    // 生成完整文档管理页面（保留原有功能）
    function generateDocsHtml() {
        const docNames = Object.keys(docs).sort();
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>小红书链接文档管理</title>
            <style>
                body { font-family: sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
                h1 { color: #ff2442; }
                .doc-card { background: white; border-radius: 8px; box-shadow: 0 2px 8px #eee; margin: 16px 0; }
                .doc-header { padding: 16px; background: #f9f9f9; display: flex; justify-content: space-between; align-items: center; }
                .doc-title { margin: 0; }
                .doc-actions button { margin-left: 8px; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
                .export-btn { background: #e6f7ed; color: #00875a; }
                .delete-btn { background: #fff0f0; color: #f53f3f; }
                .link-list { list-style: none; padding: 0; margin: 0; }
                .link-item { padding: 12px 16px; border-bottom: 1px solid #f5f5f5; }
                .link-item a { color: #165dff; text-decoration: none; }
                .link-item a:hover { text-decoration: underline; }
                .link-meta { color: #999; font-size: 12px; margin-top: 4px; }
                .empty-state { text-align: center; padding: 40px; color: #999; }
            </style>
        </head>
        <body>
            <h1>小红书链接文档管理</h1>
            <p>所有收藏的链接文档</p>
        `;

        if (docNames.length === 0) {
            html += `<div class="empty-state"><p>暂无文档</p></div>`;
        } else {
            docNames.forEach(name => {
                html += `
                <div class="doc-card">
                    <div class="doc-header">
                        <h2 class="doc-title">${name}（${docs[name].length}条）</h2>
                        <div class="doc-actions">
                            <button class="export-btn" onclick="exportDoc('${name}')">导出文档</button>
                            <button class="delete-btn" onclick="deleteDoc('${name}')">删除文档</button>
                        </div>
                    </div>
                </div>`;
            });
        }

        html += `
            <script>
                function exportDoc(docName) {
                    const requestId = Date.now() + '-' + Math.random().toString(36).slice(2, 10);
                    window.localStorage.setItem('${EXPORT_CHANNEL}', JSON.stringify({
                        id: requestId,
                        type: 'export',
                        doc: docName
                    }));
                    alert('导出成功');
                }
                function deleteDoc(docName) {
                    if (confirm(\`删除"\${docName}"？\`)) {
                        window.localStorage.setItem('xhsDocAction', JSON.stringify({
                            type: 'deleteDoc',
                            name: docName
                        }));
                        window.close();
                    }
                }
            </script>
        </body></html>`;
        return html;
    }

    // 初始化
    function init() {
        handleDocActions();
        registerMenuCommands();
        setupExportListener();

        const observer = new MutationObserver(() => {
            createCopyButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        createCopyButton();
    }

    init();
})();