// ==UserScript==
// @name         欧亿AI对话文件夹管理器
// @name:en      OuyiAI Chat Folder Manager
// @namespace    https://github.com/yuyihuai
// @version      1.1.1
// @description  为欧亿AI添加文件夹功能，轻松归纳整理历史对话，支持拖拽分类、自定义命名、悬浮窗管理
// @description:en  Add folder function to OuyiAI, easily organize chat history with drag-drop, custom naming, floating panel
// @author       鱼亦怀（脚本用户交流群：1035051165）
// @license      MIT
// @match        *://ai8.rcouyi.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @connect      ai8.rcouyi.com
// @supportURL   https://github.com/yuyihuai/ouyi-folder-manager/issues
// @homepageURL  https://github.com/yuyihuai/ouyi-folder-manager
// @downloadURL https://update.greasyfork.org/scripts/563441/%E6%AC%A7%E4%BA%BFAI%E5%AF%B9%E8%AF%9D%E6%96%87%E4%BB%B6%E5%A4%B9%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563441/%E6%AC%A7%E4%BA%BFAI%E5%AF%B9%E8%AF%9D%E6%96%87%E4%BB%B6%E5%A4%B9%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 安全样式注入 ====================
    function addStyle(css) {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    addStyle(`
        /* 主容器 - 悬浮窗样式 */
        #folder-container {
            position: fixed;
            top: 60px;
            left: 70px;
            z-index: 9999;
            width: 320px;
            max-width: 90vw;
        }
        
        /* 文件夹面板头部 - 折叠切换按钮 */
        .folder-panel-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .folder-panel-header:hover {
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
        }
        
        .folder-panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            flex-shrink: 0;
        }
        
        .folder-panel-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .folder-panel-qq {
            font-size: 9px;
            color: rgba(255,255,255,0.8);
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        .folder-panel-qq:hover {
            background: rgba(255,255,255,0.15);
            color: white;
        }
        
        .folder-panel-toggle-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 4px;
            color: white;
            font-size: 10px;
            padding: 4px 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .folder-panel-toggle-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        
        /* 文件夹内容区 - 悬浮面板 */
        .folder-panel-content {
            background: #1a1a2e;
            border: 1px solid #3d3d55;
            border-radius: 10px;
            margin-top: 6px;
            padding: 10px;
            max-height: 60vh;
            overflow-y: auto;
            overflow-x: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            position: relative;
        }

        /* 高度调整手柄 */
        .folder-resize-handle {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.3));
            cursor: ns-resize;
            border-radius: 0 0 10px 10px;
            transition: background 0.2s ease;
        }

        .folder-resize-handle:hover {
            background: linear-gradient(to bottom, transparent, rgba(102, 126, 234, 0.6));
        }

        .folder-resize-handle::after {
            content: '⋯';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255,255,255,0.5);
            font-size: 16px;
            line-height: 8px;
        }
        
        .folder-panel-content.collapsed {
            max-height: 0;
            padding: 0;
            margin: 0;
            opacity: 0;
            overflow: hidden;
            border: none;
            pointer-events: none;
        }
        
        /* 内容区底部的操作栏 (导入导出) */
        .folder-actions-bar {
            display: flex;
            gap: 6px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }

        .folder-action-btn {
            flex: 1;
            padding: 6px;
            background: #252538;
            border: 1px solid #3d3d55;
            border-radius: 6px;
            color: #aaa;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
        }

        .folder-action-btn:hover {
            background: #35354a;
            color: white;
            border-color: #667eea;
        }

        .folder-create-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px 12px;
            background: #2d2d44;
            border: 1px dashed #667eea;
            border-radius: 8px;
            color: #667eea;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s ease;
            margin-bottom: 8px;
        }

        .folder-create-btn:hover {
            background: #3d3d55;
            border-style: solid;
            color: white;
        }

        .folder-create-btn svg {
            width: 14px;
            height: 14px;
        }

        /* 文件夹项目 */
        .folder-item {
            margin: 4px 0;
            border-radius: 8px;
            overflow: hidden;
            background: #2d2d3a;
            border: 1px solid #3d3d4a;
            transition: all 0.3s ease;
        }

        .folder-item:hover {
            background: #35354a;
            border-color: #667eea;
        }

        .folder-item.drag-over {
            background: #3a3a55;
            border-color: #667eea;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.4);
        }

        /* 文件夹头部 */
        .folder-header {
            display: flex;
            align-items: center;
            padding: 8px 10px;
            cursor: pointer;
            user-select: none;
            gap: 6px;
        }

        .folder-icon {
            font-size: 14px;
            transition: transform 0.3s ease;
        }

        .folder-item.collapsed .folder-icon {
            transform: rotate(-90deg);
        }

        .folder-name {
            flex: 1;
            font-size: 13px;
            font-weight: 600;
            color: #ffffff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .folder-count {
            font-size: 10px;
            color: #667eea;
            background: rgba(102, 126, 234, 0.2);
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 600;
        }

        .folder-actions {
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .folder-header:hover .folder-actions {
            opacity: 1;
        }

        .folder-action-btn {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            cursor: pointer;
            color: #aaa;
            font-size: 12px;
            transition: all 0.2s ease;
        }

        .folder-action-btn:hover {
            background: rgba(255,255,255,0.2);
            color: #fff;
        }

        .folder-action-btn.delete:hover {
            background: rgba(239, 68, 68, 0.3);
            color: #ef4444;
        }

        /* 文件夹内容区 */
        .folder-content {
            max-height: 500px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .folder-item.collapsed .folder-content {
            max-height: 0;
        }

        .folder-chats {
            padding: 4px 6px 6px;
        }

        /* 文件夹内的对话项 */
        .folder-chat-item {
            display: flex;
            align-items: center;
            padding: 8px 10px;
            margin: 3px 0;
            background: #252532;
            border-radius: 6px;
            cursor: pointer;
            gap: 8px;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }

        .folder-chat-item:hover {
            background: #35354a;
            border-color: #667eea;
        }

        .folder-chat-item .chat-title {
            flex: 1;
            font-size: 12px;
            color: #ffffff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 500;
        }

        .folder-chat-item .chat-date {
            font-size: 9px;
            color: #888;
            flex-shrink: 0;
        }

        .folder-chat-item .remove-btn {
            opacity: 0;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(239, 68, 68, 0.2);
            border: none;
            border-radius: 4px;
            color: #ef4444;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.2s ease;
        }

        .folder-chat-item:hover .remove-btn,
        .folder-chat-item:hover .edit-btn {
            opacity: 1;
        }

        .folder-chat-item .remove-btn:hover {
            background: rgba(239, 68, 68, 0.4);
        }
        
        /* 编辑按钮 */
        .folder-chat-item .edit-btn {
            opacity: 0;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(102, 126, 234, 0.2);
            border: none;
            border-radius: 4px;
            color: #667eea;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.2s ease;
        }
        
        .folder-chat-item .edit-btn:hover {
            background: rgba(102, 126, 234, 0.4);
        }
        
        /* 自定义名称标记 */
        .folder-chat-item .custom-badge {
            font-size: 9px;
            color: #667eea;
            background: rgba(102, 126, 234, 0.15);
            padding: 1px 4px;
            border-radius: 3px;
            margin-left: 4px;
        }

        /* 空文件夹提示 */
        .folder-empty {
            text-align: center;
            padding: 12px;
            color: #666;
            font-size: 11px;
            font-style: italic;
        }

        /* 对话列表项可拖拽样式 */
        .chat-item-draggable {
            cursor: grab;
        }

        .chat-item-draggable:active {
            cursor: grabbing;
        }

        .chat-item-draggable.dragging {
            opacity: 0.5;
        }

        /* 拖拽提示 */
        .drag-hint {
            position: fixed;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }

        /* 模态框 */
        .folder-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(4px);
        }

        .folder-modal {
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 16px;
            padding: 24px;
            width: 320px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .folder-modal h3 {
            margin: 0 0 16px;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
        }

        .folder-modal input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        .folder-modal input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .folder-modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }

        .folder-modal-btn {
            flex: 1;
            padding: 10px 16px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .folder-modal-btn.cancel {
            background: rgba(255,255,255,0.1);
            color: #aaa;
        }

        .folder-modal-btn.cancel:hover {
            background: rgba(255,255,255,0.15);
            color: #fff;
        }

        .folder-modal-btn.confirm {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .folder-modal-btn.confirm:hover {
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        /* Toast 提示 */
        .folder-toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10002;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }

        .folder-toast.show {
            transform: translateX(-50%) translateY(0);
        }

        /* 未分类区域标题 */
        .uncategorized-title {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            color: #888;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .uncategorized-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.1);
        }
    `);

    // ==================== 数据管理 ====================
    const STORAGE_KEY = 'ouyiai_folders';

    function loadFolders() {
        try {
            const data = GM_getValue(STORAGE_KEY, '{}');
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
            console.error('加载文件夹数据失败:', e);
            return {};
        }
    }

    function saveFolders(folders) {
        try {
            GM_setValue(STORAGE_KEY, JSON.stringify(folders));
        } catch (e) {
            console.error('保存文件夹数据失败:', e);
        }
    }

    // 文件夹数据结构: { folderId: { name: string, chats: [{ id, title, date }], collapsed: boolean }}
    let folders = loadFolders();

    // ==================== UI 组件 ====================

    function showToast(message) {
        const existing = document.querySelector('.folder-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'folder-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    function showModal(title, defaultValue, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'folder-modal-overlay';
        overlay.innerHTML = `
            <div class="folder-modal">
                <h3>${title}</h3>
                <input type="text" placeholder="请输入文件夹名称" value="${defaultValue || ''}">
                <div class="folder-modal-actions">
                    <button class="folder-modal-btn cancel">取消</button>
                    <button class="folder-modal-btn confirm">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const input = overlay.querySelector('input');
        const cancelBtn = overlay.querySelector('.cancel');
        const confirmBtn = overlay.querySelector('.confirm');

        input.focus();
        input.select();

        const close = () => overlay.remove();

        cancelBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        confirmBtn.addEventListener('click', () => {
            const value = input.value.trim();
            if (value) {
                onConfirm(value);
                close();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = input.value.trim();
                if (value) {
                    onConfirm(value);
                    close();
                }
            } else if (e.key === 'Escape') {
                close();
            }
        });
    }

    // ==================== 文件夹管理器 ====================

    function createFolderManager() {
        const manager = document.createElement('div');
        manager.className = 'folder-manager';

        // 新建文件夹按钮
        const createBtn = document.createElement('button');
        createBtn.className = 'folder-create-btn';
        createBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
            <span>新建文件夹</span>
        `;
        createBtn.addEventListener('click', () => {
            showModal('新建文件夹', '', (name) => {
                const folderId = 'folder_' + Date.now();
                folders[folderId] = {
                    name: name,
                    chats: [],
                    collapsed: false
                };
                saveFolders(folders);
                renderFolders();
                showToast(`文件夹"${name}"创建成功`);
            });
        });

        manager.appendChild(createBtn);

        // 添加导入导出操作栏
        const actionsBar = document.createElement('div');
        actionsBar.className = 'folder-actions-bar';

        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.className = 'folder-action-btn export-btn';
        exportBtn.innerHTML = '📤 导出备份';
        exportBtn.title = '将当前文件夹配置复制到剪贴板，用于备份或在其他浏览器导入';
        exportBtn.addEventListener('click', () => {
            const data = JSON.stringify({
                folders: folders,
                panelPosition: GM_getValue('panelPosition', null)
            });
            GM_setClipboard(data);
            showToast('备份已复制到剪贴板！');
        });

        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.className = 'folder-action-btn import-btn';
        importBtn.innerHTML = '📥 导入备份';
        importBtn.title = '从剪贴板导入备份数据';
        importBtn.addEventListener('click', () => {
            showModal('导入备份', '', (jsonStr) => {
                try {
                    const data = JSON.parse(jsonStr);
                    if (data && data.folders) {
                        folders = data.folders;
                        saveFolders(folders);

                        // 尝试恢复位置
                        if (data.panelPosition) {
                            GM_setValue('panelPosition', data.panelPosition);
                            restorePanelPosition();
                        }

                        renderFolders();
                        showToast('备份数据已成功导入！');
                    } else {
                        throw new Error('无效的数据格式');
                    }
                } catch (e) {
                    showToast('导入失败：数据格式不正确');
                    console.error('Import error:', e);
                }
            });
            // 修改 modal 的 input 占位符提示它是放 JSON 的
            setTimeout(() => {
                const modalInput = document.querySelector('.folder-modal input');
                if (modalInput) modalInput.placeholder = '请在此粘贴备份 JSON 字符串';
            }, 50);
        });

        actionsBar.appendChild(exportBtn);
        actionsBar.appendChild(importBtn);
        manager.appendChild(actionsBar);

        return manager;
    }

    function createFolderElement(folderId, folderData) {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item' + (folderData.collapsed ? ' collapsed' : '');
        folderItem.dataset.folderId = folderId;

        // 文件夹头部
        const header = document.createElement('div');
        header.className = 'folder-header';
        header.innerHTML = `
            <span class="folder-icon">📁</span>
            <span class="folder-name">${folderData.name}</span>
            <span class="folder-count">${folderData.chats.length}</span>
            <div class="folder-actions">
                <button class="folder-action-btn rename" title="重命名">✏️</button>
                <button class="folder-action-btn delete" title="删除">🗑️</button>
            </div>
        `;

        // 折叠/展开
        header.addEventListener('click', (e) => {
            if (!e.target.closest('.folder-action-btn')) {
                folderData.collapsed = !folderData.collapsed;
                folderItem.classList.toggle('collapsed');
                saveFolders(folders);
            }
        });

        // 重命名
        header.querySelector('.rename').addEventListener('click', (e) => {
            e.stopPropagation();
            showModal('重命名文件夹', folderData.name, (newName) => {
                folderData.name = newName;
                saveFolders(folders);
                renderFolders();
                showToast('文件夹已重命名');
            });
        });

        // 删除
        header.querySelector('.delete').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`确定要删除文件夹"${folderData.name}"吗？\n文件夹内的对话将移回列表。`)) {
                delete folders[folderId];
                saveFolders(folders);
                renderFolders();
                showToast('文件夹已删除');
            }
        });

        folderItem.appendChild(header);

        // 文件夹内容
        const content = document.createElement('div');
        content.className = 'folder-content';

        const chatsContainer = document.createElement('div');
        chatsContainer.className = 'folder-chats';

        if (folderData.chats.length === 0) {
            chatsContainer.innerHTML = '<div class="folder-empty">拖拽对话到这里</div>';
        } else {
            folderData.chats.forEach((chat, index) => {
                const chatItem = document.createElement('div');
                chatItem.className = 'folder-chat-item';

                // 显示自定义名称（如果有）或原始标题
                const displayTitle = chat.customTitle || chat.title;
                const hasCustomTitle = !!chat.customTitle;

                chatItem.innerHTML = `
                    <span class="chat-title">${displayTitle}${hasCustomTitle ? '<span class="custom-badge">✓</span>' : ''}</span>
                    <button class="edit-btn" title="编辑名称">✏️</button>
                    <button class="remove-btn" title="移出文件夹">✕</button>
                `;

                // 点击打开对话
                chatItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.remove-btn') && !e.target.closest('.edit-btn')) {
                        // 优先使用URL直接跳转
                        if (chat.url && chat.url.includes('/chat/')) {
                            window.location.href = chat.url;
                        } else {
                            // 备用方案：尝试找到并点击原始对话项（同时用ID和标题匹配）
                            const originalChat = findOriginalChatById(chat.id, chat.title);
                            if (originalChat) {
                                originalChat.click();
                            } else {
                                showToast('无法找到该对话，请尝试在下方列表中点击');
                            }
                        }
                    }
                });

                // 编辑名称
                chatItem.querySelector('.edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showModal('自定义对话名称', chat.customTitle || chat.title, (newTitle) => {
                        chat.customTitle = newTitle;
                        saveFolders(folders);
                        renderFolders();
                        showToast('名称已更新');
                    });
                });

                // 移出文件夹
                chatItem.querySelector('.remove-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    folderData.chats.splice(index, 1);
                    saveFolders(folders);
                    renderFolders();
                    showToast('对话已移出文件夹');
                });

                chatsContainer.appendChild(chatItem);
            });
        }

        content.appendChild(chatsContainer);
        folderItem.appendChild(content);

        // 拖拽放置支持
        folderItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            folderItem.classList.add('drag-over');
        });

        folderItem.addEventListener('dragleave', () => {
            folderItem.classList.remove('drag-over');
        });

        folderItem.addEventListener('drop', (e) => {
            e.preventDefault();
            folderItem.classList.remove('drag-over');

            const chatData = e.dataTransfer.getData('text/plain');
            if (chatData) {
                try {
                    const chat = JSON.parse(chatData);

                    // 检查是否已在此文件夹中
                    if (folderData.chats.some(c => c.id === chat.id)) {
                        showToast('该对话已在此文件夹中');
                        return;
                    }

                    // 从其他文件夹移除
                    Object.values(folders).forEach(f => {
                        f.chats = f.chats.filter(c => c.id !== chat.id);
                    });

                    // 添加到当前文件夹
                    folderData.chats.push(chat);
                    saveFolders(folders);
                    renderFolders();
                    showToast(`已添加到"${folderData.name}"`);
                } catch (err) {
                    console.error('解析拖拽数据失败:', err);
                }
            }
        });

        return folderItem;
    }

    // ==================== 对话列表处理 ====================

    function findChatListContainer() {
        // 方法1: 通过搜索框定位
        const searchInput = document.querySelector('input[placeholder*="搜索对话"], input[placeholder*="搜索"]');
        if (searchInput) {
            // 向上找到包含对话列表的容器
            let parent = searchInput.closest('[class*="sidebar"], aside, nav');
            if (!parent) {
                // 如果没找到，向上遍历5层
                parent = searchInput.parentElement;
                for (let i = 0; i < 6; i++) {
                    if (parent && parent.parentElement) {
                        parent = parent.parentElement;
                    }
                }
            }
            return parent;
        }

        // 方法2: 直接查找侧边栏
        const selectors = [
            'aside',
            '[class*="sidebar"]',
            '[class*="side-bar"]',
            'nav[class*="left"]',
            '.left-panel'
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el;
        }

        return null;
    }

    function findChatItems() {
        const container = findChatListContainer();
        if (!container) {
            console.log('未找到对话列表容器');
            return [];
        }

        // 查找所有可点击的对话项
        // 欧亿AI的对话项通常是包含标题和日期的div或链接
        let items = [];

        // 方法1: 查找包含日期格式文本的元素（如 2026-01-19）
        const allElements = container.querySelectorAll('div, a');
        const datePattern = /\d{4}-\d{2}-\d{2}/;

        allElements.forEach(el => {
            const text = el.textContent || '';
            // 检查是否包含日期，且不是太深的嵌套
            if (datePattern.test(text) && el.children.length > 0 && el.children.length < 10) {
                // 检查是否可能是对话项（有合理的高度和内容）
                const rect = el.getBoundingClientRect();
                if (rect.height > 30 && rect.height < 150 && rect.width > 100) {
                    // 避免重复添加父子元素
                    const isChildOfExisting = items.some(item => item.contains(el));
                    const isParentOfExisting = items.some(item => el.contains(item));

                    if (!isChildOfExisting && !isParentOfExisting) {
                        items.push(el);
                    } else if (isParentOfExisting) {
                        // 如果是现有项的父元素，用父元素替换
                        items = items.filter(item => !el.contains(item));
                        items.push(el);
                    }
                }
            }
        });

        // 方法2: 如果上面没找到，尝试直接选择器
        if (items.length === 0) {
            const selectors = [
                '[class*="chat-item"]',
                '[class*="conversation"]',
                '[class*="history-item"]',
                '[class*="dialog-item"]',
                'a[href*="/chat/"]'
            ];

            for (const selector of selectors) {
                items = Array.from(container.querySelectorAll(selector));
                if (items.length > 0) break;
            }
        }

        // 过滤掉可能的公告或其他非对话元素
        items = items.filter(item => {
            const text = item.textContent || '';
            // 排除公告区域
            if (text.includes('重要公告') || text.includes('请文明使用')) return false;
            // 必须包含日期格式
            if (!datePattern.test(text)) return false;
            return true;
        });

        console.log(`找到 ${items.length} 个对话项`);
        return items;
    }

    function getChatInfo(chatElement) {
        // 提取对话信息
        let title = '';
        let date = '';

        // 获取元素的文本内容
        const fullText = chatElement.textContent || '';

        // 尝试用日期正则分割标题和日期
        const dateMatch = fullText.match(/(\d{4}-\d{2}-\d{2}\s*\d{2}:\d{2}|\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            date = dateMatch[1].trim();
            // 标题是日期之前的内容（去掉可能的图标字符）
            const beforeDate = fullText.split(dateMatch[0])[0];
            title = beforeDate.replace(/[📁📄📝🗂️✏️🗑️⬆️⬇️←→↑↓]/g, '').trim();
            // 如果标题太长或包含太多空白，截取前50个字符
            if (title.length > 60) {
                title = title.slice(0, 50).trim() + '...';
            }
        }

        // 如果上面没获取到，尝试其他方式
        if (!title) {
            const titleEl = chatElement.querySelector('[class*="title"], h4, h5, span:first-of-type');
            title = titleEl?.textContent?.trim() || fullText.slice(0, 50).trim() || '未命名对话';
        }

        if (!date) {
            const dateEl = chatElement.querySelector('[class*="date"], [class*="time"], time, small');
            date = dateEl?.textContent?.trim() || '';
        }

        // 尝试获取对话ID和URL - 检查链接或数据属性
        const link = chatElement.querySelector('a[href*="/chat/"]') || chatElement.closest('a[href*="/chat/"]');
        let id = link?.href?.match(/\/chat\/([^\/\?]+)/)?.[1];
        let url = link?.href || '';

        // 也检查data-id或其他属性
        if (!id) {
            id = chatElement.dataset?.id || chatElement.dataset?.chatId || chatElement.getAttribute('data-id');
        }

        if (!id) {
            // 使用标题和日期生成唯一ID
            try {
                id = 'chat_' + btoa(unescape(encodeURIComponent(title + date))).slice(0, 20);
            } catch (e) {
                id = 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            }
        }

        return { id, title: title || '未命名对话', date, url };
    }

    function findOriginalChatById(chatId, chatTitle) {
        const chatItems = findChatItems();

        // 首先尝试通过ID匹配
        for (const item of chatItems) {
            const info = getChatInfo(item);
            if (info.id === chatId) {
                return item;
            }
        }

        // 如果ID匹配失败，尝试通过标题匹配
        if (chatTitle) {
            const normalizedTitle = chatTitle.toLowerCase().trim();
            for (const item of chatItems) {
                const info = getChatInfo(item);
                const itemTitle = info.title.toLowerCase().trim();
                // 完全匹配或包含匹配
                if (itemTitle === normalizedTitle ||
                    itemTitle.includes(normalizedTitle) ||
                    normalizedTitle.includes(itemTitle)) {
                    return item;
                }
            }
        }

        return null;
    }

    function makeChatsDraggable() {
        const chatItems = findChatItems();

        chatItems.forEach(item => {
            // 避免重复处理
            if (item.dataset.draggableInit) return;
            item.dataset.draggableInit = 'true';

            item.draggable = true;
            item.classList.add('chat-item-draggable');

            item.addEventListener('dragstart', (e) => {
                item.classList.add('dragging');
                const chatInfo = getChatInfo(item);
                e.dataTransfer.setData('text/plain', JSON.stringify(chatInfo));
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });
    }

    // ==================== 渲染逻辑 ====================

    let folderContainer = null;
    let isPanelCollapsed = GM_getValue('isPanelCollapsed', false); // 面板折叠状态
    let dragListeners = null; // 存储拖动监听器，避免重复绑定

    function renderFolders() {
        if (!folderContainer) {
            folderContainer = document.createElement('div');
            folderContainer.id = 'folder-container';
        }

        const folderCount = Object.keys(folders).length;
        const chatCount = Object.values(folders).reduce((sum, f) => sum + f.chats.length, 0);

        folderContainer.innerHTML = '';

        // 创建可折叠的面板头部
        const panelHeader = document.createElement('div');
        panelHeader.className = 'folder-panel-header' + (isPanelCollapsed ? ' collapsed' : '');
        panelHeader.innerHTML = `
            <div class="folder-panel-title">
                <span>📁</span>
                <span>文件夹 (${folderCount}/${chatCount})</span>
            </div>
            <div class="folder-panel-info">
                <span class="folder-panel-qq" title="点击复制群号">脚本用户交流群：1035051165</span>
                <button class="folder-panel-toggle-btn" title="展开/折叠">${isPanelCollapsed ? '▶' : '▼'}</button>
            </div>
        `;

        // 点击群号复制
        const qqSpan = panelHeader.querySelector('.folder-panel-qq');
        qqSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText('1035051165').then(() => {
                showToast('群号已复制：1035051165');
            }).catch(() => {
                showToast('脚本用户交流群：1035051165');
            });
        });

        // 点击切换按钮折叠/展开
        const toggleBtn = panelHeader.querySelector('.folder-panel-toggle-btn');
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡，不触发拖动
            isPanelCollapsed = !isPanelCollapsed;
            GM_setValue('isPanelCollapsed', isPanelCollapsed); // 保存折叠状态
            panelHeader.classList.toggle('collapsed');
            panelContent.classList.toggle('collapsed');
            toggleBtn.textContent = isPanelCollapsed ? '▶' : '▼';

            // 折叠时清除内联高度，展开时恢复保存的高度
            if (isPanelCollapsed) {
                panelContent.style.maxHeight = '';
            } else {
                const savedHeight = GM_getValue('panelHeight', null);
                if (savedHeight) {
                    panelContent.style.maxHeight = savedHeight;
                }
            }
        });

        folderContainer.appendChild(panelHeader);

        // 创建面板内容区
        const panelContent = document.createElement('div');
        panelContent.className = 'folder-panel-content' + (isPanelCollapsed ? ' collapsed' : '');

        // 添加高度调整手柄
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'folder-resize-handle';
        panelContent.appendChild(resizeHandle);

        // 实现拖拽调整高度
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            startHeight = panelContent.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const deltaY = e.clientY - startY;
            const newHeight = startHeight + deltaY;
            const minHeight = 100;
            const maxHeight = window.innerHeight - folderContainer.getBoundingClientRect().top - 20;
            const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
            panelContent.style.maxHeight = clampedHeight + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                GM_setValue('panelHeight', panelContent.style.maxHeight);
                isResizing = false;
            }
        });

        // 恢复保存的高度
        const savedHeight = GM_getValue('panelHeight', null);
        if (savedHeight) {
            panelContent.style.maxHeight = savedHeight;
        }

        // 添加新建文件夹按钮
        panelContent.appendChild(createFolderManager());

        // 渲染所有文件夹
        Object.entries(folders).forEach(([folderId, folderData]) => {
            panelContent.appendChild(createFolderElement(folderId, folderData));
        });

        folderContainer.appendChild(panelContent);

        // 重新绑定拖动事件（修复拉长后不能移动的问题）
        setTimeout(() => {
            makePanelDraggable();
        }, 100);
    }

    function insertFolderUI() {
        // 检查是否已插入
        if (document.getElementById('folder-container')) {
            return;
        }

        // 等待页面基本加载
        if (!document.body) {
            setTimeout(insertFolderUI, 500);
            return;
        }

        renderFolders();

        // 悬浮窗直接添加到body
        document.body.appendChild(folderContainer);

        // 添加拖拽移动功能
        makePanelDraggable();

        // 恢复上次保存的位置
        restorePanelPosition();

        console.log('文件夹悬浮窗已创建');

        // 使对话可拖拽
        setTimeout(makeChatsDraggable, 1000);
    }

    // 悬浮窗拖拽移动功能
    let dragMouseMove = null;
    let dragMouseUp = null;
    let dragMouseDown = null;
    let lastHeader = null;

    function makePanelDraggable() {
        const header = folderContainer.querySelector('.folder-panel-header');
        if (!header) return;

        // 移除旧的监听器
        if (dragMouseMove) document.removeEventListener('mousemove', dragMouseMove);
        if (dragMouseUp) document.removeEventListener('mouseup', dragMouseUp);
        if (dragMouseDown && lastHeader) lastHeader.removeEventListener('mousedown', dragMouseDown);

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.style.cursor = 'move';

        dragMouseDown = (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('.folder-panel-toggle-btn') || e.target.closest('.folder-panel-qq')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = folderContainer.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            e.preventDefault();
        };

        dragMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            const maxLeft = window.innerWidth - 100;
            const maxTop = window.innerHeight - 50;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            folderContainer.style.left = newLeft + 'px';
            folderContainer.style.top = newTop + 'px';
        };

        dragMouseUp = () => {
            if (isDragging) {
                const rect = folderContainer.getBoundingClientRect();
                GM_setValue('panelPosition', { left: rect.left, top: rect.top });
            }
            isDragging = false;
        };

        header.addEventListener('mousedown', dragMouseDown);
        document.addEventListener('mousemove', dragMouseMove);
        document.addEventListener('mouseup', dragMouseUp);

        lastHeader = header;
    }

    // 恢复悬浮窗位置
    function restorePanelPosition() {
        const pos = GM_getValue('panelPosition', null);
        if (pos && folderContainer) {
            // 确保位置在屏幕范围内
            const maxLeft = window.innerWidth - 100;
            const maxTop = window.innerHeight - 50;
            const left = Math.max(0, Math.min(pos.left, maxLeft));
            const top = Math.max(0, Math.min(pos.top, maxTop));

            folderContainer.style.left = left + 'px';
            folderContainer.style.top = top + 'px';
        }
    }

    // ==================== 初始化 ====================

    function init() {
        console.log('欧亿AI文件夹管理器启动中...');

        const run = () => {
            // 确保样式已注入 (Edge 可能会在局部刷新时丢失 GM_addStyle)
            if (!document.getElementById('folder-styles')) {
                const styleCss = `
                    #folder-container { position: fixed; top: 60px; left: 70px; z-index: 10000; width: 320px; max-width: 90vw; pointer-events: auto; }
                    .folder-toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px); background: rgba(50, 50, 80, 0.95); color: white; padding: 10px 20px; border-radius: 8px; font-size: 14px; z-index: 20000; transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 1px solid #667eea; pointer-events: none; }
                    .folder-toast.show { transform: translateX(-50%) translateY(0); }
                `;
                const styleTag = document.createElement('style');
                styleTag.id = 'folder-styles';
                styleTag.textContent = styleCss;
                (document.head || document.documentElement).appendChild(styleTag);
            }

            if (!document.getElementById('folder-container')) {
                insertFolderUI();
            }
            makeChatsDraggable();
        };

        // 持续观察 body
        const checkBody = setInterval(() => {
            if (document.body) {
                run();

                // 监听DOM变化
                const observer = new MutationObserver((mutations) => {
                    let shouldUpdate = false;
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length > 0) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === 1 && (
                                    node.matches?.('[class*="chat"]') ||
                                    node.querySelector?.('[class*="chat"]') ||
                                    node.querySelector?.('input[placeholder*="搜索"]')
                                )) {
                                    shouldUpdate = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (shouldUpdate) run();
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                clearInterval(checkBody);
            }
        }, 800);

        // 处理路由变化 (SPA)
        window.addEventListener('popstate', () => setTimeout(run, 800));
        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(run, 800);
        };

        // 兜底检查
        setInterval(run, 5000);
    }

    init();
})();
