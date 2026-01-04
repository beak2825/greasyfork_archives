// ==UserScript==
// @name         DeepSeek单窗口记事本
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  在DeepSeek页面添加可拖拽的单窗口记事本，支持文件列表和远程存储
// @author       www.funnyai.com
// @match        https://chat.deepseek.com/*
// @match        https://www.deepseek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557500/DeepSeek%E5%8D%95%E7%AA%97%E5%8F%A3%E8%AE%B0%E4%BA%8B%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/557500/DeepSeek%E5%8D%95%E7%AA%97%E5%8F%A3%E8%AE%B0%E4%BA%8B%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        apiBaseUrl: 'https://www.funnyai.com/api/deepseek_notepad',
        windowWidth: 333,  // 减少1/3宽度，从500px减少到333px
        windowHeight: 520,  // 保持高度不变
        fileListWidth: 200,  // 文件列表宽度
        maxRecentFiles: 20,
        autoSaveInterval: 10000, // 10秒自动保存
        defaultPosition: { x: window.innerWidth - 353, y: 50 },  // 默认位置在窗口右侧
        minimizedWidth: 330,  // 最小化窗口宽度也相应减小
        minimizedHeight: 40   // 最小化窗口高度（只显示标题栏）
    };

/**
 * 文件管理器类
 */
class FileManager {
    constructor() {
        this.recentFiles = [];
        this.currentFileId = null;
        this.storageKey = 'deepseek_notepad_files';
    }

    /**
     * 初始化文件管理器
     */
    init() {
        this.loadFromStorage();

        // 如果没有文件，创建默认文件
        if (this.recentFiles.length === 0) {
            this.createNewFile('欢迎使用DeepSeek记事本');
        }

        // 设置当前文件
        if (!this.currentFileId && this.recentFiles.length > 0) {
            this.currentFileId = this.recentFiles[0].id;
        }
    }

    /**
     * 从本地存储加载数据
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.recentFiles = parsed.recentFiles || [];
                this.currentFileId = parsed.currentFileId;
            }
        } catch (error) {
            console.error('加载文件数据失败:', error);
            this.recentFiles = [];
            this.currentFileId = null;
        }
    }

    /**
     * 保存数据到本地存储
     */
    saveToStorage() {
        try {
            const data = {
                recentFiles: this.recentFiles,
                currentFileId: this.currentFileId
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('保存文件数据失败:', error);
        }
    }

    /**
     * 创建新文件
     * @param {string} title - 文件标题
     * @returns {object} 新文件对象
     */
    createNewFile(title) {
        const newFile = {
            id: Date.now().toString(),
            title: title,
            content: '',
            createTime: Date.now(),
            updateTime: Date.now()
        };

        this.recentFiles.unshift(newFile);
        this.currentFileId = newFile.id;

        // 限制文件数量
        if (this.recentFiles.length > CONFIG.maxRecentFiles) {
            this.recentFiles = this.recentFiles.slice(0, CONFIG.maxRecentFiles);
        }

        this.saveToStorage();
        return newFile;
    }

    /**
     * 获取当前文件
     * @returns {object|null} 当前文件对象
     */
    getCurrentFile() {
        return this.recentFiles.find(file => file.id === this.currentFileId);
    }

    /**
     * 设置当前文件
     * @param {string} fileId - 文件ID
     */
    setCurrentFile(fileId) {
        this.currentFileId = fileId;
        this.saveToStorage();
    }

    /**
     * 更新文件内容
     * @param {string} fileId - 文件ID
     * @param {string} content - 文件内容
     */
    updateFileContent(fileId, content) {
        const file = this.recentFiles.find(f => f.id === fileId);
        if (file) {
            file.content = content;
            file.updateTime = Date.now();

            // 将文件移到列表顶部
            this.recentFiles = this.recentFiles.filter(f => f.id !== fileId);
            this.recentFiles.unshift(file);

            this.saveToStorage();
        }
    }

    /**
     * 重命名文件
     * @param {string} fileId - 文件ID
     * @param {string} newTitle - 新标题
     */
    renameFile(fileId, newTitle) {
        const file = this.recentFiles.find(f => f.id === fileId);
        if (file) {
            file.title = newTitle;
            file.updateTime = Date.now();
            this.saveToStorage();
        }
    }

    /**
     * 删除文件
     * @param {string} fileId - 文件ID
     */
    deleteFile(fileId) {
        this.recentFiles = this.recentFiles.filter(f => f.id !== fileId);

        if (this.currentFileId === fileId) {
            this.currentFileId = this.recentFiles.length > 0 ? this.recentFiles[0].id : null;
        }

        this.saveToStorage();
    }

    /**
     * 根据ID获取文件
     * @param {string} fileId - 文件ID
     * @returns {object|null} 文件对象
     */
    getFileById(fileId) {
        return this.recentFiles.find(file => file.id === fileId);
    }

    /**
     * 获取所有文件
     * @returns {array} 文件列表
     */
    getAllFiles() {
        return this.recentFiles;
    }
}

// 创建全局文件管理器实例
const fileManager = new FileManager();




    /**
     * 记事本窗口类（单窗口模式）
     */
    class NotepadWindow {
        constructor() {
            this.x = 50;
            this.y = 50;
            this.showFileList = true;
            this.minimized = false; // 窗口最小化状态
            this.createDOM();
            this.setPosition(this.x, this.y);
            this.bindEvents();
            this.initFileManager();
            this.startAutoSave();
            this.loadWindowState(); // 加载保存的窗口状态
        }

        /**
         * 创建DOM元素
         */
        createDOM() {
            this.element = document.createElement('div');
            this.element.id = 'deepseek-notepad';
            this.element.className = 'notepad-window';
            this.element.innerHTML = `
                <div class="notepad-header">
                    <h3>📝记事本</h3>
                    <div class="notepad-controls">
                        <button class="btn-minimize" title="最小化窗口">➖</button>
                        <button class="btn-new" title="新建文件">📄</button>
                        <button class="btn-save-local" title="保存到本地">💾</button>
                        <button class="btn-save-remote" title="保存到云端">S</button>
                        <button class="btn-load-remote" title="从云端加载">R</button>
                        <button class="btn-download" title="下载为Markdown">📥</button>
                    </div>
                </div>
                <div class="notepad-body">
                    <div class="editor-panel">
                        <div class="editor-header">
                            <div class="editor-header-row">
                                <div class="file-selector">
                                    <select class="file-dropdown" id="file-dropdown">
                                        <option value="">选择文件...</option>
                                        <!-- 文件列表将在这里动态生成 -->
                                    </select>
                                    <button class="btn-refresh" title="刷新列表">🔄</button>
                                </div>
                                <div class="file-title-container">
                                    <div class="editor-controls">
                                        <button class="btn-rename" title="重命名">✏️</button>
                                        <button class="btn-delete" title="删除文件">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="editor-content">
                            <textarea class="notepad-textarea" id="notepad-textarea" placeholder="在这里记录您的想法、代码片段或重要信息..."></textarea>
                        </div>
                    </div>
                </div>
                <div class="notepad-footer">
                    <span class="char-count">字符数: 0</span>
                    <span class="file-info">未选择文件</span>
                    <span class="save-status">本地存储</span>
                </div>
            `;

            document.body.appendChild(this.element);

            // 获取DOM引用
            this.fileDropdown = this.element.querySelector('#file-dropdown');
            this.textarea = this.element.querySelector('#notepad-textarea');
            this.charCount = this.element.querySelector('.char-count');
            this.fileInfo = this.element.querySelector('.file-info');
            this.saveStatus = this.element.querySelector('.save-status');
        }

        /**
         * 绑定事件
         */
        bindEvents() {
            const header = this.element.querySelector('.notepad-header');
            const controls = this.element.querySelector('.notepad-controls');

            // 拖拽功能
            this.makeDraggable(header);

            // 按钮事件
            controls.querySelector('.btn-minimize').addEventListener('click', () => {
                if (this.minimized) {
                    this.maximize();
                } else {
                    this.minimize();
                }
            });

            controls.querySelector('.btn-new').addEventListener('click', () => {
                this.createNewFile();
            });

            controls.querySelector('.btn-save-local').addEventListener('click', () => {
                this.saveToLocal();
            });

            controls.querySelector('.btn-save-remote').addEventListener('click', () => {
                this.saveToRemote();
            });

            controls.querySelector('.btn-load-remote').addEventListener('click', () => {
                this.loadFromRemote();
            });

            controls.querySelector('.btn-download').addEventListener('click', () => {
                this.downloadAsMarkdown();
            });

            // 编辑器控件事件
            this.element.querySelector('.btn-rename').addEventListener('click', () => {
                this.renameCurrentFile();
            });

            this.element.querySelector('.btn-delete').addEventListener('click', () => {
                this.deleteCurrentFile();
            });

            this.element.querySelector('.btn-refresh').addEventListener('click', () => {
                this.refreshFileList();
            });

            // 文本区域事件
            this.textarea.addEventListener('input', () => {
                this.updateCharCount();
                this.autoSave();
            });

            // 文件下拉框事件
            this.fileDropdown.addEventListener('change', () => {
                const selectedFileId = this.fileDropdown.value;
                if (selectedFileId) {
                    const file = fileManager.getFileById(selectedFileId);
                    if (file) {
                        this.loadFile(file);
                    }
                }
            });

            // 键盘快捷键
            this.textarea.addEventListener('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    switch(e.key) {
                        case 's':
                            e.preventDefault();
                            this.saveToLocal();
                            break;
                        case 'n':
                            e.preventDefault();
                            this.createNewFile();
                            break;
                    }
                }
            });
        }

        /**
         * 初始化文件管理器
         */
        initFileManager() {
            fileManager.init();
            this.refreshFileList();

            // 如果有当前文件，加载它
            const currentFile = fileManager.getCurrentFile();
            if (currentFile) {
                this.loadFile(currentFile);
            } else if (fileManager.recentFiles.length > 0) {
                // 如果没有当前文件但有最近文件，加载第一个
                this.loadFile(fileManager.recentFiles[0]);
            } else {
                // 创建默认文件
                this.createNewFile();
            }
        }

        /**
         * 刷新文件下拉列表
         */
        refreshFileList() {
            this.fileDropdown.innerHTML = '<option value="">选择文件...</option>';

            fileManager.recentFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = file.id;
                option.textContent = file.title;
                if (file.id === fileManager.currentFileId) {
                    option.selected = true;
                }
                this.fileDropdown.appendChild(option);
            });
        }

        /**
         * 加载文件
         * @param {object} file - 文件对象
         */
        loadFile(file) {
            // 在切换文件前自动保存当前文件的内容
            const currentFile = fileManager.getCurrentFile();
            if (currentFile && currentFile.id !== file.id) {
                const content = this.textarea.value;
                fileManager.updateFileContent(currentFile.id, content);
            }

            fileManager.setCurrentFile(file.id);
            this.textarea.value = file.content;
            this.updateCharCount();
            this.fileInfo.textContent = `${file.title} - ${new Date(file.updateTime).toLocaleString()}`;
            this.refreshFileList();
        }

        /**
         * 创建新文件
         */
        createNewFile() {
            const title = prompt('请输入新文件标题:', '新笔记');
            if (title) {
                const newFile = fileManager.createNewFile(title);
                this.loadFile(newFile);
            }
        }

        /**
         * 重命名当前文件
         * @param {string} newTitle - 新标题
         */
        renameCurrentFile(newTitle = null) {
            const currentFile = fileManager.getCurrentFile();
            if (!currentFile) return;

            if (!newTitle) {
                newTitle = prompt('请输入新标题:', currentFile.title);
            }

            if (newTitle && newTitle !== currentFile.title) {
                fileManager.renameFile(currentFile.id, newTitle);
                this.fileInfo.textContent = `${newTitle} - ${new Date().toLocaleString()}`;
                this.refreshFileList();
            }
        }

        /**
         * 删除当前文件
         */
        deleteCurrentFile() {
            const currentFile = fileManager.getCurrentFile();
            if (!currentFile) return;

            if (confirm(`确定要删除文件"${currentFile.title}"吗？`)) {
                fileManager.deleteFile(currentFile.id);
                this.refreshFileList();

                // 加载下一个文件或创建新文件
                if (fileManager.recentFiles.length > 0) {
                    this.loadFile(fileManager.recentFiles[0]);
                } else {
                    this.createNewFile();
                }
            }
        }

        /**
         * 切换文件列表显示
         */
        toggleFileList() {
            this.showFileList = !this.showFileList;
            if (this.showFileList) {
                this.fileListPanel.style.display = 'block';
            } else {
                this.fileListPanel.style.display = 'none';
            }
        }

        /**
         * 开始自动保存
         */
        startAutoSave() {
            setInterval(() => {
                if (fileManager.getCurrentFile()) {
                    this.autoSave();
                }
            }, CONFIG.autoSaveInterval);
        }

        /**
         * 设置窗口位置
         * @param {number} x - X坐标
         * @param {number} y - Y坐标
         */
        setPosition(x, y) {
            this.x = x;
            this.y = y;
            this.element.style.left = x + 'px';
            this.element.style.top = y + 'px';
            //this.saveWindowState(); // 保存窗口状态
        }

        /**
         * 最小化/最大化切换
         */
        toggleMinimize() {
            this.minimized = !this.minimized;
            if (this.minimized) {
                this.minimize();
            } else {
                this.maximize();
            }
        }

        /**
         * 最小化窗口
         */
        minimize() {
            this.element.classList.add('minimized');
            const toggleBtn = this.element.querySelector('.btn-toggle');
            toggleBtn.textContent = '➕';
            toggleBtn.title = '最大化';
        }

        /**
         * 最大化窗口
         */
        maximize() {
            this.element.classList.remove('minimized');
            const toggleBtn = this.element.querySelector('.btn-toggle');
            toggleBtn.textContent = '➖';
            toggleBtn.title = '最小化';
        }

        /**
         * 关闭窗口
         */
        close() {
            if (confirm('确定要关闭此记事本窗口吗？')) {
                this.element.remove();
                // 单窗口模式不需要窗口管理器，直接移除元素即可
            }
        }

        /**
         * 获取内容
         */
        getContent() {
            return this.textarea.value;
        }

        /**
         * 设置内容
         * @param {string} content - 内容
         */
        setContent(content) {
            this.textarea.value = content;
            this.updateCharCount();
        }

        /**
         * 更新字符计数
         */
        updateCharCount() {
            const count = this.textarea.value.length;
            this.charCount.textContent = `字符数: ${count}`;
        }

        /**
         * 自动保存到本地
         */
        autoSave() {
            const currentFile = fileManager.getCurrentFile();
            if (currentFile) {
                const content = this.textarea.value;
                fileManager.updateFileContent(currentFile.id, content);

                // 更新文件信息显示
                this.fileInfo.textContent = `${currentFile.title} - ${new Date().toLocaleString()}`;
                this.saveStatus.textContent = '本地已保存';
                this.saveStatus.style.color = '#10a37f';
            }
        }

        /**
         * 保存到本地
         */
        saveToLocal() {
            const currentFile = fileManager.getCurrentFile();
            if (currentFile) {
                const content = this.textarea.value;
                fileManager.updateFileContent(currentFile.id, content);

                // 更新文件信息显示
                this.fileInfo.textContent = `${currentFile.title} - ${new Date().toLocaleString()}`;

                // 显示保存成功提示
                this.showNotification(`文件"${currentFile.title}"已保存！`, 'success');
            }
        }

        /**
         * 保存到远程服务器
         */
        saveToRemote() {
            const content = this.textarea.value;
            const noteId = this.generateNoteId();

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.apiBaseUrl + '/save.php',
                data: `note_id=${encodeURIComponent(noteId)}&content=${encodeURIComponent(content)}&title=${encodeURIComponent(this.title)}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        this.showNotification('内容已保存到云端！', 'success');
                        this.saveStatus.textContent = '云端已保存';
                        this.saveStatus.style.color = '#3498db';
                    } else {
                        this.showNotification('保存到云端失败！', 'error');
                    }
                },
                onerror: () => {
                    this.showNotification('网络错误，保存失败！', 'error');
                }
            });
        }

        /**
         * 下载当前文件为Markdown格式
         */
        downloadAsMarkdown() {
            const currentFile = fileManager.getCurrentFile();
            if (!currentFile) {
                this.showNotification('请先选择或创建文件！', 'error');
                return;
            }

            const content = this.textarea.value;
            if (!content.trim()) {
                this.showNotification('文件内容为空，无法下载！', 'error');
                return;
            }

            // 生成文件名：使用文件标题，如果没有则使用时间戳
            const fileName = currentFile.title ?
                `${currentFile.title.replace(/[^\w\u4e00-\u9fa5]/g, '_')}.md` :
                `note_${new Date().toISOString().replace(/[:.]/g, '-')}.md`;

            // 创建Blob对象
            const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';

            // 添加到文档并触发点击
            document.body.appendChild(link);
            link.click();

            // 清理资源
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);

            this.showNotification(`文件已下载为 ${fileName}`, 'success');
        }

        /**
         * 从远程服务器加载
         */
        loadFromRemote() {
            const noteId = prompt('请输入笔记ID（留空加载最新笔记）:');
            if (noteId === null) return;

            const url = noteId ?
                `${CONFIG.apiBaseUrl}/load.php?note_id=${encodeURIComponent(noteId)}` :
                `${CONFIG.apiBaseUrl}/load.php`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            this.setContent(data.content);
                            this.showNotification('内容已从云端加载！', 'success');
                        } else {
                            this.showNotification('加载失败：' + data.message, 'error');
                        }
                    } else {
                        this.showNotification('网络错误，加载失败！', 'error');
                    }
                },
                onerror: () => {
                    this.showNotification('网络错误，加载失败！', 'error');
                }
            });
        }

        /**
         * 清空内容
         */
        clearContent() {
            if (confirm('确定要清空此窗口的所有内容吗？')) {
                this.textarea.value = '';
                this.updateCharCount();
                this.showNotification('内容已清空！', 'info');
            }
        }

        /**
         * 生成笔记ID
         */
        generateNoteId() {
            return 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        /**
         * 显示通知
         * @param {string} message - 消息内容
         * @param {string} type - 消息类型
         */
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${type === 'success' ? '#10a37f' : type === 'error' ? '#e74c3c' : '#3498db'};
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10001;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                animation: slideDown 0.3s ease;
            `;

            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        /**
         * 使窗口可拖拽
         * @param {HTMLElement} handle - 拖拽手柄
         */
        makeDraggable(handle) {
            let isDragging = false;
            let startX, startY, initialX, initialY;

            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;

                // 记录初始位置
                startX = e.clientX;
                startY = e.clientY;
                initialX = this.x;
                initialY = this.y;

                // 添加拖拽样式
                this.element.classList.add('dragging');

                // 防止文本选择
                document.body.style.userSelect = 'none';

                // 添加全局事件监听器
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            const onMouseMove = (e) => {
                if (!isDragging) return;

                e.preventDefault();

                // 计算移动距离
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // 更新窗口位置
                this.x = initialX + deltaX;
                this.y = initialY + deltaY;

                // 应用新位置
                this.element.style.left = this.x + "px";
                this.element.style.top = this.y + "px";

                // 限制窗口在可视区域内
                this.constrainToViewport();
            };

            const onMouseUp = (e) => {
                if (!isDragging) return;

                e.preventDefault();
                isDragging = false;

                // 移除拖拽样式
                this.element.classList.remove('dragging');

                // 恢复文本选择
                document.body.style.userSelect = '';

                // 移除全局事件监听器
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // 保存窗口位置状态
                this.saveWindowState();
            };
        }

        /**
         * 限制窗口在可视区域内
         */
        constrainToViewport() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const windowWidth = this.element.offsetWidth;
            const windowHeight = this.element.offsetHeight;

            // 限制X坐标
            this.x = Math.max(0, Math.min(this.x, viewportWidth - windowWidth));

            // 限制Y坐标
            this.y = Math.max(0, Math.min(this.y, viewportHeight - windowHeight));

            // 应用限制后的位置
            this.element.style.left = this.x + "px";
            this.element.style.top = this.y + "px";
        }

        /**
         * 最小化窗口
         */
        minimize() {
            // 直接设置最小化状态，而不是切换
            this.element.classList.add('minimized');
            this.minimized = true;

            // 应用最小化样式
            this.element.style.height = '40px';
            this.element.style.width = '330px';
            this.element.style.resize = 'none';
            this.element.style.overflow = 'hidden';

            // 隐藏内容区域
            const body = this.element.querySelector('.notepad-body');
            const footer = this.element.querySelector('.notepad-footer');
            if (body) body.style.display = 'none';
            if (footer) footer.style.display = 'none';

            this.showNotification('窗口已最小化', 'info');
            this.saveWindowState(); // 保存窗口状态
        }

        /**
         * 最大化窗口
         */
        maximize() {
            // 移除最小化状态
            this.element.classList.remove('minimized');
            this.minimized = false;

            // 恢复正常样式
            this.element.style.height = '';
            this.element.style.width = '';
            this.element.style.resize = '';
            this.element.style.overflow = '';

            // 显示内容区域
            const body = this.element.querySelector('.notepad-body');
            const footer = this.element.querySelector('.notepad-footer');
            if (body) body.style.display = '';
            if (footer) footer.style.display = '';

            this.showNotification('窗口已恢复', 'info');
            this.saveWindowState(); // 保存窗口状态
        }

        /**
         * 保存窗口状态到本地存储
         */
        saveWindowState() {
            try {
                const windowState = {
                    x: this.x,
                    y: this.y,
                    minimized: this.minimized,
                    showFileList: this.showFileList
                };
                localStorage.setItem('deepseek_notepad_window_state', JSON.stringify(windowState));
            } catch (error) {
                console.error('保存窗口状态失败:', error);
            }
        }

        /**
         * 从本地存储加载窗口状态
         */
        loadWindowState() {
            try {
                const savedState = localStorage.getItem('deepseek_notepad_window_state');
                if (savedState) {
                    const windowState = JSON.parse(savedState);

                    // 恢复位置
                    if (windowState.x !== undefined && windowState.y !== undefined) {
                        this.x = windowState.x;
                        this.y = windowState.y;
                        this.setPosition(this.x, this.y);
                    }

                    // 恢复最小化状态
                    if (windowState.minimized) {
                        this.minimized = true;
                        this.element.classList.add('minimized');
                        // 立即应用最小化样式，确保窗口正确显示为最小化状态
                        this.element.style.height = '40px';
                        this.element.style.width = '330px';
                        this.element.style.resize = 'none';
                        this.element.style.overflow = 'hidden';

                        // 隐藏内容区域
                        const body = this.element.querySelector('.notepad-body');
                        const footer = this.element.querySelector('.notepad-footer');
                        if (body) body.style.display = 'none';
                        if (footer) footer.style.display = 'none';

                        this.showNotification('窗口已恢复最小化状态', 'info');
                    }

                    // 恢复文件列表显示状态
                    if (windowState.showFileList !== undefined) {
                        this.showFileList = windowState.showFileList;
                    }
                }
            } catch (error) {
                console.error('加载窗口状态失败:', error);
            }
        }
    }

    // 添加样式
    GM_addStyle(`
        .notepad-window {
            position: fixed;
            width: ${CONFIG.windowWidth}px;
            height: ${CONFIG.windowHeight}px;
            background: #ffffff;
            border: 2px solid #10a37f;
            border-radius: 8px;  /* 减小圆角，更紧凑 */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* 减小阴影 */
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            resize: both;
            overflow: hidden;
            min-width: 250px;  /* 减小最小宽度 */
        }

        .notepad-window.minimized {
            height: ${CONFIG.minimizedHeight}px !important;
            width: ${CONFIG.minimizedWidth}px !important;
            resize: none;
            overflow: hidden;
        }

        .notepad-window.minimized .notepad-body,
        .notepad-window.minimized .notepad-footer {
            display: none !important;
        }

        .notepad-window.minimized .notepad-header {
            border-radius: 6px !important;
            cursor: move;
        }

        .notepad-header {
            background: #10a37f;
            color: white;
            padding: 8px 12px;  /* 减小内边距 */
            border-radius: 6px 6px 0 0;  /* 减小圆角 */
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }

        .notepad-header h3 {
            margin: 0;
            font-size: 16px;  /* 增加字体大小 */
            font-weight: 600;
        }

        .notepad-controls {
            display: flex;
            gap: 5px;
        }

        .notepad-controls button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            border-radius: 4px;
            width: 28px;  /* 增加按钮大小 */
            height: 28px;  /* 增加按钮大小 */
            cursor: pointer;
            font-size: 14px;  /* 增加字体大小 */
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .notepad-controls button:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .notepad-content {
            flex: 1;
            padding: 0;
            display: flex;
            min-height: 450px;  /* 增加最小高度，减少空白 */
        }

        .notepad-textarea {
            width: 100%;
            border: none;
            padding: 10px;  /* 增加内边距 */
            font-size: 15px;  /* 增加字体大小 */
            line-height: 1.5;
            resize: none;
            outline: none;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            background: #fafafa;
            color: #333333;
        }

        .notepad-textarea:focus {
            background: white;
            color: #000000;
        }

        .notepad-footer {
            background: #f5f5f5;
            padding: 4px 10px;  /* 增加内边距 */
            border-top: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            font-size: 12px;  /* 增加字体大小 */
            color: #666;
            min-height: 24px;  /* 增加最小高度 */
        }

        .char-count {
            font-weight: 500;
        }

        .save-status {
            font-weight: 500;
            transition: color 0.3s;
        }

        /* 拖拽样式 */
        .notepad-window.dragging {
            opacity: 0.8;
        }

        /* 动画样式 */
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        }

        /* 文件列表样式 */
        .file-list-panel {
            width: ${CONFIG.fileListWidth}px;
            background: #f8f9fa;
            border-right: 1px solid #e5e5e5;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
        }

        .file-list-panel.hidden {
            width: 0;
            min-width: 0;
            overflow: hidden;
        }

        .file-list-header {
            padding: 8px 12px;  /* 减小内边距 */
            border-bottom: 1px solid #e5e5e5;
            background: #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .file-list-header h4 {
            margin: 0;
            font-size: 13px;  /* 减小字体大小 */
            font-weight: 600;
            color: #333;
        }

        .file-list {
            flex: 1;
            overflow-y: auto;
            padding: 0;
            margin: 0;
            list-style: none;
        }

        .file-item {
            padding: 6px 10px;  /* 减小内边距 */
            border-bottom: 1px solid #e5e5e5;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;  /* 减小字体大小 */
        }

        .file-item:hover {
            background: #e9ecef;
        }

        .file-item.active {
            background: #10a37f;
            color: white;
        }

        .file-item.active:hover {
            background: #0d8a6a;
        }

        /* 文件下拉框样式 */
        .file-dropdown-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .file-dropdown {
            flex: 1;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            background: white;
            color: #333;
            outline: none;
            transition: border-color 0.2s;
        }

        .file-dropdown:focus {
            border-color: #10a37f;
            box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2);
        }

        .file-dropdown option {
            padding: 6px 8px;
            font-size: 12px;
        }

        .btn-refresh {
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 8px;
            font-size: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-refresh:hover {
            background: #0d8a6a;
        }

        .file-name {
            flex: 1;
            font-size: 13px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .file-actions {
            display: flex;
            gap: 5px;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .file-item:hover .file-actions {
            opacity: 1;
        }

        .file-action {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 12px;
            padding: 2px 4px;
            border-radius: 3px;
            transition: background 0.2s;
        }

        .file-action:hover {
            background: rgba(0, 0, 0, 0.1);
        }

        .file-item.active .file-action {
            color: rgba(255, 255, 255, 0.8);
        }

        .file-item.active .file-action:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* 编辑器样式 */
        .editor-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: white;
        }

        .editor-header {
            padding: 4px;  /* 进一步减小内边距 */
            border-bottom: 1px solid #e5e5e5;
            background: #f8f9fa;
        }

        .editor-header-row {
            display: flex;
            align-items: center;
            gap: 4px;  /* 减小间距 */
            flex-wrap: nowrap;
            min-height: 28px;  /* 减小高度 */
        }

        .file-selector {
            display: flex;
            align-items: center;
            gap: 4px;
            flex: 1;
            min-width: 0;
        }

        .file-dropdown {
            flex: 1;
            padding: 4px 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 11px;
            background: white;
            min-width: 100px;
            height: 24px;
        }

        .file-dropdown:focus {
            outline: none;
            border-color: #10a37f;
            box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2);
        }

        .file-dropdown option {
            padding: 4px 6px;
            font-size: 11px;
        }

        .btn-refresh {
            padding: 4px 5px;
            background: #10a37f;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            white-space: nowrap;
            height: 24px;
            min-width: 24px;
        }

        .btn-refresh:hover {
            background: #0d8a6a;
        }

        .file-title-container {
            display: flex;
            align-items: center;
            gap: 4px;
            flex: 1;
            min-width: 0;
        }

        .file-title {
            flex: 1;
            padding: 4px 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 11px;
            background: white;
            min-width: 80px;
            height: 24px;
        }

        .file-title:focus {
            outline: none;
            border-color: #10a37f;
            box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2);
        }

        .editor-controls {
            display: flex;
            gap: 3px;
        }

        .editor-controls button {
            padding: 4px 5px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            transition: all 0.2s;
            height: 24px;
            min-width: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .editor-controls button:hover {
            background: #e0e0e0;
            border-color: #ccc;
        }

        .file-title-input {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 14px;
            font-weight: 500;
            outline: none;
            transition: border 0.2s;
        }

        .file-title-input:focus {
            border-color: #10a37f;
        }

        .file-info {
            font-size: 12px;
            color: #666;
            margin-left: 10px;
        }

        .editor-content {
            flex: 1;
            display: flex;
            min-height: 400px;  /* 确保内容区域有足够高度 */
        }

        .editor-textarea {
            width: 100%;
            height: 100%;
            border: none;
            padding: 8px;  /* 减小内边距，增加内容显示区域 */
            font-size: 13px;
            line-height: 1.4;
            resize: none;
            outline: none;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            background: #fafafa;
            color: #333333;
        }

        .editor-textarea:focus {
            background: white;
            color: #000000;
        }

        /* 响应式调整 */
        @media (max-width: 768px) {
            .notepad-window {
                width: 300px;
                height: 400px;
            }

            .file-list-panel {
                width: 200px;
            }

            .file-list-panel.hidden {
                width: 0;
            }
        }
    `);

    /**
     * 主函数：创建单窗口记事本系统
     */
    function createSingleWindowNotepad() {
        // 检查是否已经存在记事本窗口
        if (document.getElementById('deepseek-notepad')) {
            return;
        }

        // 创建单窗口记事本
        const notepad = new NotepadWindow();

        // 设置默认位置
        notepad.setPosition(CONFIG.defaultPosition.x, CONFIG.defaultPosition.y);

        // 显示欢迎消息
        setTimeout(() => {
            notepad.showNotification('DeepSeek单窗口记事本已加载！', 'success');
        }, 1000);
    }

    /**
     * 等待页面加载完成后初始化
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createSingleWindowNotepad);
        } else {
            createSingleWindowNotepad();
        }
    }

    // 启动脚本
    init();

})();