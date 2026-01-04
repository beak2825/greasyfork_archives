// ==UserScript==
// @name         LiblibAI 数据提取器增强版与批量上传
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  提取页面用户信息与生成API数据，支持折叠显示和恢复按钮，右侧伸缩面板，复制功能，并整合批量图片上传生成器
// @author       Tarktip
// @match        https://www.liblib.art/*
// @match        https://bridge.liblib.art/*
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554450/LiblibAI%20%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88%E4%B8%8E%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/554450/LiblibAI%20%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96%E5%99%A8%E5%A2%9E%E5%BC%BA%E7%89%88%E4%B8%8E%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加统一样式
    const style = document.createElement('style');
    style.textContent = `
        /* 数据提取器样式 */
        .copy-btn {
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 11px;
            margin: 2px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-family: Arial, sans-serif;
            flex-shrink: 0;
        }
        .copy-btn:hover {
            background-color: #45a049;
        }
        .copy-btn-blue {
            background-color: #2196f3;
        }
        .copy-btn-blue:hover {
            background-color: #1976d2;
        }
        .truncate-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 300px;
        }
        .full-text {
            word-break: break-all;
            white-space: normal;
        }
        .collapsible-section {
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
        }
        .section-header {
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .section-content {
            padding: 0 12px;
            background: white;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .api-param-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            margin: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        .api-param-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .panel-toggle-btn {
            position: fixed;
            top: 50%;
            right: 0;
            width: 30px;
            height: 80px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            z-index: 9999;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -2px 2px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            transform: translateY(-50%);
        }
        .panel-toggle-btn:hover {
            background: #357abd;
        }
        .liblib-enhanced-panel {
            position: fixed;
            top: 0;
            right: 0;
            width: 450px;
            height: 100vh;
            background: #f5f5f5;
            border-left: 2px solid #333;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        .liblib-enhanced-panel.expanded {
            transform: translateX(0);
        }
        .panel-header {
            background: #4a90e2;
            color: white;
            padding: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        .panel-title {
            font-weight: bold;
            font-size: 14px;
        }
        .panel-close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* 批量上传样式 */
        .upload-section {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            background: white;
        }
        .upload-section h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #333;
        }
        .file-select-btn {
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .file-select-btn:hover {
            background: #40a9ff;
        }
        .control-buttons {
            display: flex;
            gap: 5px;
            margin-top: 10px;
        }
        .control-btn {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .start-btn {
            background: #52c41a;
            color: white;
        }
        .start-btn:hover {
            background: #73d13d;
        }
        .stop-btn {
            background: #ff4d4f;
            color: white;
        }
        .stop-btn:hover {
            background: #ff7875;
        }
        .refresh-btn {
            background: #faad14;
            color: white;
        }
        .refresh-btn:hover {
            background: #ffc53d;
        }
        .file-list-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            width: 400px;
            max-height: 400px;
            overflow: hidden;
        }
        .file-list-header {
            background: #f5f5f5;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .file-list-content {
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
        }
        .file-item {
            padding: 5px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 12px;
            word-break: break-all;
        }
        .status-info {
            margin-top: 10px;
            padding: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
        }
        .file-count {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
        }
        .progress-info {
            margin-top: 5px;
            font-size: 10px;
            color: #666;
            text-align: center;
        }
        .batch-upload-controls {
            background: white;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .preserve-files-btn {
            background: #722ed1;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 11px;
            margin-top: 5px;
            width: 100%;
        }
        .preserve-files-btn:hover {
            background: #9254de;
        }
    `;
    document.head.appendChild(style);

    // 存储提取的数据
    let userData = {
        id: null,
        uuid: null,
        mobile: null,
        email: null,
        nickname: null,
        token: null,
        usertoken: null
    };

    // 存储捕获的生成API数据
    let capturedGenerateData = {
        latest: null,
        all: []
    };

    // 存储折叠状态
    let collapseState = {
        userBasicInfo: true,
        generateLatestData: false,
        generateKeyFields: false,
        generateAllData: false,
        userFullData: false,
        batchUpload: true
    };

    // 初始化状态
    let initializationState = {
        panelCreated: false,
        userDataAttempts: 0,
        maxUserDataAttempts: 10,
        isUserLoggedIn: false,
        isPanelExpanded: false
    };

    // 批量上传器实例
    let batchUploader = null;

    // 初始化
    function init() {
        console.log('Liblib Art 数据提取器增强版开始初始化...');

        // 创建面板
        createPanel();

        // 初始化批量上传器
        initBatchUploader();

        // 开始拦截网络请求
        interceptXHR();
        interceptFetch();

        // 尝试多种方式提取用户数据
        extractUserDataWithMultipleMethods();

        // 监听页面变化，处理动态加载的内容
        observePageChanges();

        // 检查并添加API参数按钮
        checkAndAddApiParamButton();

        console.log('Liblib Art 数据提取器增强版已启动');
    }

    // 初始化批量上传器
    function initBatchUploader() {
        if (!batchUploader) {
            batchUploader = new BatchUploader();
        }
    }

    // 批量上传器类
    class BatchUploader {
        constructor() {
            this.uploadButtons = [];
            this.fileLists = [];
            this.isRunning = false;
            this.currentIndex = 0;
            this.totalBatches = 0;
            this.clickInterceptors = new Map();
            this.controlButtonHandler = null;
            this.preservedFileLists = []; // 保存的文件列表，用于页面刷新后恢复
            this.init();
        }

        init() {
            this.findUploadButtons();
            this.setupEventListeners();
            this.setupControlButtons();
        }

        // 设置控制按钮事件（使用事件委托）
        setupControlButtons() {
            const panel = document.getElementById('liblib-enhanced-panel');
            if (!panel) {
                // 如果面板不存在，稍后重试
                setTimeout(() => this.setupControlButtons(), 500);
                return;
            }

            // 移除现有的事件监听器
            if (this.controlButtonHandler) {
                panel.removeEventListener('click', this.controlButtonHandler);
            }

            // 创建新的事件处理器
            this.controlButtonHandler = (event) => {
                const target = event.target;

                if (target.id === 'batch-refresh-btn' || (target.classList.contains('refresh-btn') && target.closest('.batch-upload-controls'))) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.refresh();
                } else if (target.id === 'batch-start-btn' || (target.classList.contains('start-btn') && target.closest('.batch-upload-controls'))) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.startProcess();
                } else if (target.id === 'batch-stop-btn' || (target.classList.contains('stop-btn') && target.closest('.batch-upload-controls'))) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.stopProcess();
                } else if (target.id === 'preserve-files-btn') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.preserveFileLists();
                }
            };

            // 绑定事件
            panel.addEventListener('click', this.controlButtonHandler.bind(this));
        }

        findUploadButtons() {
            // 先移除之前的点击拦截器
            this.removeClickInterceptors();

            // 查找页面中的所有上传按钮容器
            const uploadContainers = document.querySelectorAll('.fields_imgWrap__TI0qh');
            const sectionsContainer = document.getElementById('batch-upload-sections');

            if (!sectionsContainer) return;

            // 保存当前文件列表的备份
            const oldFileLists = [...this.fileLists];

            sectionsContainer.innerHTML = '';

            this.uploadButtons = [];
            this.fileLists = [];

            uploadContainers.forEach((container, index) => {
                const uploadBox = container.querySelector('.fields_uploadBox__zud7U');
                if (uploadBox) {
                    // 找到上传按钮
                    const uploadBtn = uploadBox.querySelector('button[data-trigger-window="mask-editor"]');
                    if (uploadBtn) {
                        this.uploadButtons.push({
                            container: container,
                            button: uploadBtn,
                            uploadBox: uploadBox
                        });

                        // 恢复之前保存的文件列表，如果有的话
                        if (this.preservedFileLists[index] && this.preservedFileLists[index].length > 0) {
                            this.fileLists[index] = [...this.preservedFileLists[index]];
                        } else if (oldFileLists[index]) {
                            this.fileLists[index] = [...oldFileLists[index]];
                        } else {
                            this.fileLists[index] = [];
                        }

                        // 创建对应的文件选择区域
                        const section = document.createElement('div');
                        section.className = 'upload-section';
                        section.innerHTML = `
                            <h4>上传区域 ${index + 1}</h4>
                            <button class="file-select-btn" data-index="${index}">选择图片文件</button>
                            <div class="file-count">已选择: ${this.fileLists[index].length} 个文件</div>
                        `;
                        sectionsContainer.appendChild(section);

                        // 添加事件监听器
                        const selectBtn = section.querySelector('.file-select-btn');
                        selectBtn.addEventListener('click', (e) => this.handleFileSelect(e, index));
                        selectBtn.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            this.showFileList(index);
                        });

                        // 为上传按钮添加点击拦截器
                        this.addClickInterceptor(uploadBtn, index);
                    }
                }
            });

            // 如果有保存的文件列表，显示恢复按钮
            if (this.preservedFileLists.some(list => list && list.length > 0)) {
                this.showPreserveFilesButton();
            }

            this.updateStatus(`找到 ${this.uploadButtons.length} 个上传区域`);
        }

        // 显示保存文件按钮
        showPreserveFilesButton() {
            const sectionsContainer = document.getElementById('batch-upload-sections');
            if (!sectionsContainer) return;

            // 移除已存在的按钮
            const existingBtn = document.getElementById('preserve-files-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            const preserveBtn = document.createElement('button');
            preserveBtn.id = 'preserve-files-btn';
            preserveBtn.className = 'preserve-files-btn';
            preserveBtn.textContent = '恢复已保存的文件列表';

            sectionsContainer.appendChild(preserveBtn);
        }

        // 保存文件列表
        preserveFileLists() {
            this.preservedFileLists = [...this.fileLists];
            this.updateStatus('文件列表已保存，刷新页面后可以恢复');
            showNotification('文件列表已保存');
        }

        addClickInterceptor(uploadBtn, index) {
            const clickHandler = (e) => {
                if (this.isRunning) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const file = this.fileLists[index][this.currentIndex];
                    if (file) {
                        this.setFileInput(uploadBtn, file);
                    }
                    return false;
                }
            };

            this.clickInterceptors.set(uploadBtn, clickHandler);
            uploadBtn.addEventListener('click', clickHandler, true);
        }

        removeClickInterceptors() {
            this.clickInterceptors.forEach((handler, button) => {
                button.removeEventListener('click', handler, true);
            });
            this.clickInterceptors.clear();
        }

        setFileInput(uploadBtn, file) {
            const uploadBox = uploadBtn.closest('.fields_uploadBox__zud7U');
            if (!uploadBox) return;

            const fileInput = uploadBox.querySelector('input[type="file"]');
            if (!fileInput) return;

            if (fileInput.disabled) {
                fileInput.disabled = false;
            }

            const dataTransfer = new DataTransfer();

            if (typeof file === 'string') {
                const virtualFile = new File([''], file.split('/').pop() || 'file.jpg', { type: 'image/jpeg' });
                dataTransfer.items.add(virtualFile);
            } else {
                dataTransfer.items.add(file);
            }

            fileInput.files = dataTransfer.files;

            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }

        handleFileSelect(event, index) {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = '.png,.jpg,.jpeg,.xls,.xlsx,.csv';

            input.onchange = (e) => {
                const files = Array.from(e.target.files);
                this.processSelectedFiles(files, index);
            };

            input.click();
        }

        async processSelectedFiles(files, index) {
            const filePaths = [];

            for (const file of files) {
                if (file.name.match(/\.(png|jpg|jpeg)$/i)) {
                    filePaths.push(file);
                } else if (file.name.match(/\.(xls|xlsx|csv)$/i)) {
                    try {
                        const paths = await this.readExcelFile(file);
                        filePaths.push(...paths);
                    } catch (error) {
                        console.error('读取表格文件失败:', error);
                        this.updateStatus(`读取表格文件失败: ${file.name}`);
                    }
                }
            }

            const validFiles = [];
            for (const file of filePaths) {
                if (typeof file === 'string') {
                    validFiles.push(file);
                } else {
                    validFiles.push(file);
                }
            }

            this.fileLists[index] = validFiles;

            const section = document.querySelector(`#batch-upload-sections .upload-section:nth-child(${index + 1})`);
            if (section) {
                const fileCount = section.querySelector('.file-count');
                fileCount.textContent = `已选择: ${validFiles.length} 个文件`;
            }

            this.updateStatus(`区域 ${index + 1} 加载了 ${validFiles.length} 个文件`);
        }

        readExcelFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function(e) {
                    try {
                        const data = new Uint8Array(e.target.result);
                        let workbook;

                        if (file.name.match(/\.csv$/i)) {
                            const csvText = new TextDecoder().decode(data);
                            const lines = csvText.split('\n');
                            const paths = lines.map(line => {
                                const firstCell = line.split(',')[0];
                                return firstCell ? firstCell.trim() : null;
                            }).filter(path => path && this.isValidPath(path));
                            resolve(paths);
                        } else {
                            workbook = XLSX.read(data, { type: 'array' });
                            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                            const paths = jsonData.map(row => {
                                const firstCell = row[0];
                                return firstCell ? firstCell.toString().trim() : null;
                            }).filter(path => path && this.isValidPath(path));

                            resolve(paths);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }.bind(this);

                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }

        isValidPath(path) {
            return typeof path === 'string' && path.length > 0;
        }

        showFileList(index) {
            const existingModal = document.querySelector('.file-list-modal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.className = 'file-list-modal';
            modal.innerHTML = `
                <div class="file-list-header">
                    <span>区域 ${index + 1} 文件列表</span>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="file-list-content">
                    ${this.fileLists[index].length === 0 ?
                        '<div class="file-item">暂无文件</div>' :
                        this.fileLists[index].map((file, i) =>
                            `<div class="file-item">${i + 1}. ${typeof file === 'string' ? file : file.name}</div>`
                        ).join('')
                    }
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.remove();
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }

        setupEventListeners() {
            // 事件监听器会在创建面板时绑定
        }

        refresh() {
            // 在刷新前保存当前文件列表
            const currentFileLists = [...this.fileLists];
            this.findUploadButtons();

            // 恢复文件列表到UI
            this.fileLists.forEach((list, index) => {
                if (currentFileLists[index] && currentFileLists[index].length > 0) {
                    this.fileLists[index] = [...currentFileLists[index]];
                    this.updateFileCountDisplay(index);
                }
            });

            this.updateStatus('已刷新上传区域（文件列表已保留）');
        }

        // 更新文件计数显示
        updateFileCountDisplay(index) {
            const section = document.querySelector(`#batch-upload-sections .upload-section:nth-child(${index + 1})`);
            if (section) {
                const fileCount = section.querySelector('.file-count');
                fileCount.textContent = `已选择: ${this.fileLists[index].length} 个文件`;
            }
        }

        startProcess() {
            if (this.isRunning) return;

            const hasFiles = this.fileLists.some(list => list.length > 0);
            if (!hasFiles) {
                this.updateStatus('请先选择文件');
                return;
            }

            this.isRunning = true;
            this.currentIndex = 0;
            this.totalBatches = Math.max(...this.fileLists.map(list => list.length));
            this.updateStatus('开始处理...');
            this.updateProgress();
            this.processNextBatch();
        }

        stopProcess() {
            this.isRunning = false;
            this.updateStatus('已终止');
        }

        updateProgress() {
            const progressElement = document.getElementById('batch-progress-info');
            if (progressElement && this.totalBatches > 0) {
                progressElement.textContent = `进度: ${this.currentIndex + 1}/${this.totalBatches}`;
            }
        }

        async processNextBatch() {
            if (!this.isRunning) return;

            if (this.currentIndex >= this.totalBatches) {
                this.isRunning = false;
                this.updateStatus('所有文件处理完成');
                return;
            }

            this.updateStatus(`处理第 ${this.currentIndex + 1} 批文件`);
            this.updateProgress();

            try {
                // 在开始处理前保存文件列表，防止页面刷新丢失
                this.preserveFileLists();

                for (let i = 0; i < this.uploadButtons.length; i++) {
                    const file = this.fileLists[i][this.currentIndex];
                    if (file) {
                        this.uploadButtons[i].button.click();
                    }
                }

                this.updateStatus('所有文件上传完成，等待图片加载...');
                await this.waitForAllUploadsComplete();

                this.updateStatus('图片上传完成，等待2秒后生成...');
                await new Promise(resolve => setTimeout(resolve, 2000));

                this.updateStatus('开始生成...');
                await this.clickGenerateButton();

            } catch (error) {
                console.error('处理失败:', error);
                this.updateStatus('处理失败: ' + error.message);
                this.isRunning = false;
            }
        }

        waitForAllUploadsComplete() {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    const allUploaded = Array.from(document.querySelectorAll('.fields_imgWrap__TI0qh')).every(container => {
                        const overlay = container.querySelector('.absolute.inset-0');
                        return !overlay || window.getComputedStyle(overlay).opacity === '0';
                    });

                    if (allUploaded) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 1000);
            });
        }

        async clickGenerateButton() {
            const generateButton = document.querySelector('.ModelApiLeft_rawImg__03pwb span');
            if (!generateButton) {
                this.updateStatus('未找到生成按钮');
                this.isRunning = false;
                return;
            }

            generateButton.click();
            this.updateStatus('生成中...');

            await this.waitForGenerationComplete();

            this.currentIndex++;

            // 短暂延迟后继续下一批，给页面一些时间稳定
            setTimeout(() => {
                // 检查页面是否刷新，如果刷新了需要重新查找上传按钮
                this.checkAndRecoverAfterGeneration();
                this.processNextBatch();
            }, 3000);
        }

        // 检查生成后页面状态并恢复
        checkAndRecoverAfterGeneration() {
            // 检查上传按钮是否还存在
            const currentUploadContainers = document.querySelectorAll('.fields_imgWrap__TI0qh');
            if (currentUploadContainers.length !== this.uploadButtons.length) {
                // 页面结构发生变化，需要重新初始化
                this.updateStatus('检测到页面变化，重新初始化上传区域...');
                this.findUploadButtons();
            }
        }

        waitForGenerationComplete() {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    const generateButton = document.querySelector('.ModelApiLeft_rawImg__03pwb span');
                    if (generateButton && generateButton.textContent === '一键生成') {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 1000);
            });
        }

        updateStatus(message) {
            const statusElement = document.getElementById('batch-status-info');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }
    }

    // 检查并添加API参数按钮
    function checkAndAddApiParamButton() {
        if (!window.location.pathname.includes('/modelinfo/')) {
            return;
        }

        const existingApiCard = document.querySelector('.ModelApiCard_modelFileCard__lKb9r');

        if (existingApiCard) {
            console.log('页面已存在API服务卡片，无需添加');
            return;
        }

        const runAppButton = document.querySelector('.ModelActionCard_runPic__0I9wi');

        if (runAppButton) {
            console.log('检测到运行应用按钮，准备添加API参数按钮');
            addApiParamButtonToPage();
        }
    }

    // 在页面中添加API参数按钮
    function addApiParamButtonToPage() {
        const currentUrl = window.location.href;
        const apiParamLink = generateApiParamLink(currentUrl);

        if (!apiParamLink) {
            console.log('无法生成API参数链接');
            return;
        }

        const apiCard = document.createElement('div');
        apiCard.className = 'ModelApiCard_modelFileCard__lKb9r';
        apiCard.innerHTML = `
            <div class="ModelApiCard_head__wNuvz">API</div>
            <div class="ModelApiCard_body__a_dO2">
                <div class="ModelApiCard_attachItem__PFId4">
                    <div class="ModelApiCard_attachBasic__V_poQ">
                        <div class="ModelApiCard_attachName__7Ko8E"> 本工作流已提供API服务</div>
                        <div class="ModelApiCard_attachDown__pLo90" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M3.55591 0.167969H8.44425C10.5676 0.167969 11.8334 1.4338 11.8276 3.55714V8.44547C11.8276 10.5688 10.5617 11.8346 8.43842 11.8346H3.55591C1.43258 11.8346 0.166748 10.5688 0.166748 8.43964V3.55714C0.166748 1.4338 1.43258 0.167969 3.55591 0.167969ZM4.92554 3.22832C4.68309 3.01618 4.31456 3.04074 4.10241 3.2832L2.39686 5.2324C2.01197 5.67227 2.01198 6.32905 2.39686 6.76892L4.10241 8.71812C4.31456 8.96058 4.68309 8.98514 4.92554 8.773C5.168 8.56085 5.19257 8.19232 4.98042 7.94987L3.27486 6.00066L4.98042 4.05145C5.19257 3.809 5.168 3.44047 4.92554 3.22832ZM6.78304 3.22832C6.54058 3.44047 6.51601 3.809 6.72816 4.05145L8.43372 6.00066L6.72816 7.94987C6.51601 8.19232 6.54058 8.56085 6.78304 8.773C7.02549 8.98514 7.39402 8.96058 7.60617 8.71812L9.31172 6.76892C9.6966 6.32905 9.6966 5.67227 9.31172 5.2324L7.60617 3.2832C7.39402 3.04074 7.02549 3.01618 6.78304 3.22832Z" fill="#173EFF"></path>
                            </svg>
                            <span class="ml-[2px]">查看API参数</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const apiButton = apiCard.querySelector('.ModelApiCard_attachDown__pLo90');
        apiButton.addEventListener('click', function() {
            window.open(apiParamLink, '_blank');
        });

        const modelActionCard = document.querySelector('.ModelActionCard_modelActionCard__RtIQT');
        if (modelActionCard && modelActionCard.parentNode) {
            modelActionCard.parentNode.insertBefore(apiCard, modelActionCard.nextSibling);
            console.log('API参数按钮已添加到页面');
        }
    }

    // 生成API参数链接
    function generateApiParamLink(originalLink) {
        try {
            const url = new URL(originalLink);

            if (url.pathname.includes('/modelinfo/')) {
                const pathParts = url.pathname.split('/');
                const modelInfoPath = pathParts[pathParts.length - 1].split('?')[0];
                const versionUuid = url.searchParams.get('versionUuid');

                if (modelInfoPath && versionUuid) {
                    return `https://www.liblib.art/apis/workflow?uuid=${versionUuid}&modelInfoPath=${modelInfoPath}`;
                }
            }
        } catch (error) {
            console.log('生成API参数链接失败:', error);
        }
        return null;
    }

    // 使用多种方法提取用户数据
    function extractUserDataWithMultipleMethods() {
        extractFromNextData();
        setTimeout(extractFromWindow, 500);
        setTimeout(extractFromLocalStorage, 1000);

        const retryInterval = setInterval(() => {
            if (initializationState.userDataAttempts < initializationState.maxUserDataAttempts) {
                extractFromNextData();
                extractFromWindow();
                initializationState.userDataAttempts++;

                if (userData.id || userData.uuid) {
                    clearInterval(retryInterval);
                    initializationState.isUserLoggedIn = true;
                    updateStatusIndicator('✓ 用户数据获取成功', '#4caf50');
                }
            } else {
                clearInterval(retryInterval);
                if (!userData.id && !userData.uuid) {
                    updateStatusIndicator('⚠ 未检测到登录用户', '#ff9800');
                }
            }
        }, 2000);
    }

    // 从 __NEXT_DATA__ 提取用户数据
    function extractFromNextData() {
        try {
            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (nextDataScript && nextDataScript.textContent) {
                const nextData = JSON.parse(nextDataScript.textContent);
                extractUserFromData(nextData);
                return true;
            }
        } catch (error) {
            console.log('从 __NEXT_DATA__ 提取用户数据失败:', error);
        }
        return false;
    }

    // 从 window 对象提取用户数据
    function extractFromWindow() {
        try {
            if (window.__NEXT_DATA__) {
                extractUserFromData(window.__NEXT_DATA__);
            }

            if (window._app && window._app.props) {
                extractUserFromData({ props: window._app.props });
            }

            if (window.currentUser) {
                updateUserData(window.currentUser);
            }
        } catch (error) {
            console.log('从 window 对象提取用户数据失败:', error);
        }
    }

    // 从 localStorage 提取用户数据
    function extractFromLocalStorage() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.includes('user') || key.includes('auth') || key.includes('token'))) {
                    try {
                        const value = JSON.parse(localStorage.getItem(key));
                        if (value && (value.id || value.uuid || value.token)) {
                            console.log('从 localStorage 找到用户数据:', key, value);
                            updateUserData(value);
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        } catch (error) {
            console.log('从 localStorage 提取用户数据失败:', error);
        }
    }

    // 从数据对象中提取用户信息
    function extractUserFromData(data) {
        if (!data) return false;

        let found = false;

        const possiblePaths = [
            data.props?.currentUser,
            data.props?.pageProps?.currentUser,
            data.props?.initialState?.user,
            data.props?.initialState?.auth?.user,
            data.currentUser,
            data.user,
            data.auth?.user
        ];

        for (const user of possiblePaths) {
            if (user && (user.id || user.uuid)) {
                updateUserData(user);
                found = true;
                break;
            }
        }

        return found;
    }

    // 更新用户数据
    function updateUserData(user) {
        if (!user) return;

        userData = {
            id: user.id || userData.id,
            uuid: user.uuid || userData.uuid,
            mobile: user.mobile || userData.mobile,
            email: user.email || userData.email,
            nickname: user.nickname || userData.nickname,
            token: user.token || userData.token,
            usertoken: user.usertoken || userData.usertoken
        };

        console.log('更新用户数据:', userData);
        updatePanel();
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.id === '__NEXT_DATA__' ||
                                (node.tagName === 'SCRIPT' && node.textContent && node.textContent.includes('__NEXT_DATA__'))) {
                                shouldUpdate = true;
                            }

                            if (node.querySelector &&
                                (node.querySelector('[class*="user"]') ||
                                 node.querySelector('[class*="account"]') ||
                                 node.querySelector('[class*="login"]'))) {
                                shouldUpdate = true;
                            }

                            // 检查上传区域的变化
                            if (node.querySelector && node.querySelector('.fields_imgWrap__TI0qh')) {
                                if (batchUploader) {
                                    setTimeout(() => batchUploader.findUploadButtons(), 100);
                                }
                            }

                            if (node.querySelector &&
                                (node.querySelector('.ModelApiCard_modelFileCard__lKb9r') ||
                                 node.querySelector('.ModelActionCard_runPic__0I9wi'))) {
                                setTimeout(checkAndAddApiParamButton, 100);
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(extractFromNextData, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 更新状态指示器
    function updateStatusIndicator(message, color) {
        const statusIndicator = document.getElementById('status-indicator');
        if (statusIndicator) {
            statusIndicator.textContent = message;
            statusIndicator.style.background = color;
        }
    }

    // 拦截XMLHttpRequest
    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        const requestHeaders = new WeakMap();

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._method = method;
            this._url = url;
            requestHeaders.set(this, {});
            return originalOpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            const headers = requestHeaders.get(this) || {};
            headers[header] = value;
            requestHeaders.set(this, headers);
            return originalSetRequestHeader.apply(this, [header, value]);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._url && this._url.includes('/gateway/sd-api/generate/image')) {
                const headers = requestHeaders.get(this) || {};

                try {
                    if (body && typeof body === 'string') {
                        const generateData = JSON.parse(body);
                        capturedGenerateData.latest = {
                            url: this._url,
                            headers: headers,
                            data: generateData,
                            timestamp: new Date().toLocaleString()
                        };
                        capturedGenerateData.all.push(capturedGenerateData.latest);

                        console.log('捕获到生成图片请求数据:', generateData);
                        updatePanel();
                    }
                } catch (e) {
                    console.log('解析生成图片请求数据失败:', e);
                }
            }

            return originalSend.apply(this, [body]);
        };
    }

    // 拦截Fetch API
    function interceptFetch() {
        const originalFetch = window.fetch;

        window.fetch = function(...args) {
            const request = new Request(...args);
            const url = request.url;

            if (url.includes('/gateway/sd-api/generate/image')) {
                return originalFetch.apply(this, args).then(response => {
                    if (request.method === 'POST') {
                        response.clone().text().then(bodyText => {
                            try {
                                const generateData = JSON.parse(bodyText);
                                capturedGenerateData.latest = {
                                    url: url,
                                    headers: Object.fromEntries(request.headers),
                                    data: generateData,
                                    timestamp: new Date().toLocaleString()
                                };
                                capturedGenerateData.all.push(capturedGenerateData.latest);

                                console.log('捕获到生成图片Fetch数据:', generateData);
                                updatePanel();
                            } catch (e) {
                                console.log('解析生成图片Fetch数据失败:', e);
                            }
                        });
                    }
                    return response;
                });
            }

            return originalFetch.apply(this, args);
        };
    }

    // 创建面板
    function createPanel() {
        if (document.getElementById('liblib-enhanced-panel')) return;

        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'liblib-panel-toggle';
        toggleBtn.className = 'panel-toggle-btn';
        toggleBtn.textContent = '<<';
        toggleBtn.title = '展开数据提取面板';

        toggleBtn.addEventListener('click', togglePanel);

        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'liblib-enhanced-panel';
        panel.className = 'liblib-enhanced-panel';

        // 创建面板头部
        const panelHeader = document.createElement('div');
        panelHeader.className = 'panel-header';

        const panelTitle = document.createElement('div');
        panelTitle.className = 'panel-title';
        panelTitle.textContent = 'Liblib 数据提取器 & 批量上传';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'panel-close-btn';
        closeBtn.textContent = '×';
        closeBtn.title = '关闭面板';
        closeBtn.addEventListener('click', togglePanel);

        panelHeader.appendChild(panelTitle);
        panelHeader.appendChild(closeBtn);

        const content = document.createElement('div');
        content.id = 'enhanced-data-content';
        content.style.cssText = `
            flex: 1;
            padding: 12px;
            overflow-y: auto;
            line-height: 1.4;
        `;

        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'status-indicator';
        statusIndicator.style.cssText = `
            padding: 8px;
            background: #ffeb3b;
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
        `;
        statusIndicator.textContent = '数据提取器已启动，等待数据...';

        panel.appendChild(panelHeader);
        panel.appendChild(statusIndicator);
        panel.appendChild(content);

        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);

        updatePanel();
    }

    // 切换面板展开/收缩状态
    function togglePanel() {
        const panel = document.getElementById('liblib-enhanced-panel');
        const toggleBtn = document.getElementById('liblib-panel-toggle');

        if (!panel || !toggleBtn) return;

        initializationState.isPanelExpanded = !initializationState.isPanelExpanded;

        if (initializationState.isPanelExpanded) {
            panel.classList.add('expanded');
            toggleBtn.textContent = '>>';
            toggleBtn.title = '收缩数据提取面板';

            // 面板展开时刷新上传区域并重新绑定按钮
            if (batchUploader) {
                setTimeout(() => {
                    batchUploader.findUploadButtons();
                    batchUploader.setupControlButtons();
                }, 100);
            }
        } else {
            panel.classList.remove('expanded');
            toggleBtn.textContent = '<<';
            toggleBtn.title = '展开数据提取面板';
        }
    }

    // 创建可折叠部分
    function createCollapsibleSection(title, content, isExpanded, sectionId) {
        const section = document.createElement('div');
        section.className = 'collapsible-section';

        const header = document.createElement('div');
        header.className = 'section-header';
        header.style.cssText = `
            padding: 8px 12px;
            background: ${isExpanded ? '#e9ecef' : '#f8f9fa'};
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            border-bottom: ${isExpanded ? '1px solid #ddd' : 'none'};
        `;

        const titleSpan = document.createElement('span');
        titleSpan.style.fontWeight = 'bold';
        titleSpan.textContent = title;

        const toggleIcon = document.createElement('span');
        toggleIcon.textContent = isExpanded ? '▼' : '▶';
        toggleIcon.style.cssText = `font-size: 10px; margin-right: 5px;`;

        header.prepend(toggleIcon);
        header.appendChild(titleSpan);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'section-content';
        contentDiv.style.cssText = `
            padding: ${isExpanded ? '12px' : '0 12px'};
            background: white;
            max-height: ${isExpanded ? 'none' : '0'};
            overflow: ${isExpanded ? 'auto' : 'hidden'};
            transition: max-height 0.3s ease, padding 0.3s ease;
        `;

        if (isExpanded) {
            contentDiv.innerHTML = content;
        }

        header.addEventListener('click', () => {
            const isNowExpanded = contentDiv.style.maxHeight !== '0px';
            if (isNowExpanded) {
                contentDiv.style.maxHeight = '0';
                contentDiv.style.padding = '0 12px';
                toggleIcon.textContent = '▶';
                header.style.borderBottom = 'none';
                header.style.background = '#f8f9fa';
            } else {
                contentDiv.style.maxHeight = '500px';
                contentDiv.style.padding = '12px';
                contentDiv.innerHTML = content;
                toggleIcon.textContent = '▼';
                header.style.borderBottom = '1px solid #ddd';
                header.style.background = '#e9ecef';
                setTimeout(() => {
                    bindCopyButtons(contentDiv);
                }, 0);
            }
            collapseState[sectionId] = !isNowExpanded;
        });

        section.appendChild(header);
        section.appendChild(contentDiv);
        return section;
    }

    // 创建带独立复制按钮的数据行（带省略样式）
    function createDataRow(label, value, copyText = null, isLongText = false) {
        const row = document.createElement('div');
        row.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding: 4px 0;
        `;

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        labelSpan.style.fontWeight = 'bold';
        labelSpan.style.minWidth = '80px';
        labelSpan.style.flexShrink = '0';

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value || '未获取';
        valueSpan.style.cssText = `
            flex: 1;
            margin: 0 8px;
            word-break: break-all;
            font-family: monospace;
            font-size: 11px;
            ${isLongText ? 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' : ''}
        `;
        if (isLongText) {
            valueSpan.className = 'truncate-text';
            valueSpan.title = value || '';
        }

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.className = 'copy-btn';
        copyBtn.setAttribute('data-text', copyText || value || '');

        row.appendChild(labelSpan);
        row.appendChild(valueSpan);
        row.appendChild(copyBtn);

        return row;
    }

    // 绑定复制按钮事件
    function bindCopyButtons(container) {
        if (!container) return;

        container.querySelectorAll('.copy-btn').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            newButton.addEventListener('click', function() {
                const text = this.getAttribute('data-text');
                if (text) {
                    copyToClipboard(text);
                } else {
                    showNotification('复制内容为空！');
                }
            });
        });
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            GM_setClipboard(text);
            showNotification('已复制到剪贴板！');
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('已复制到剪贴板！');
            }).catch(err => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('已复制到剪贴板！');
            });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('已复制到剪贴板！');
        }
    }

    // 显示通知
    function showNotification(message) {
        if (typeof GM_notification !== 'undefined') {
            GM_notification({
                text: message,
                timeout: 2000,
                title: '数据提取器'
            });
            return;
        }

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            if (document.body.contains(notification))
                document.body.removeChild(notification);
        }, 1500);
    }

    // 更新面板显示
    function updatePanel() {
        const content = document.getElementById('enhanced-data-content');
        if (!content) return;

        const hasUserData = userData.id || userData.uuid;
        const hasGenerateData = capturedGenerateData.latest;

        if (hasUserData) {
            updateStatusIndicator('✓ 数据捕获正常', '#4caf50');
        } else if (hasGenerateData) {
            updateStatusIndicator('✓ 已捕获生成数据（未登录）', '#4caf50');
        } else {
            updateStatusIndicator('⏳ 等待捕获数据...', '#ff9800');
        }

        content.innerHTML = '';

        // 批量上传部分
        const batchUploadContent = document.createElement('div');
        batchUploadContent.innerHTML = `
            <div id="batch-upload-sections"></div>
            <div class="batch-upload-controls">
                <div class="control-buttons">
                    <button class="control-btn refresh-btn" id="batch-refresh-btn">刷新上传区域</button>
                    <button class="control-btn start-btn" id="batch-start-btn">开始</button>
                    <button class="control-btn stop-btn" id="batch-stop-btn">终止</button>
                </div>
                <div class="progress-info" id="batch-progress-info"></div>
                <div class="status-info" id="batch-status-info">准备就绪</div>
            </div>
        `;

        content.appendChild(createCollapsibleSection('批量图片上传', batchUploadContent.innerHTML, collapseState.batchUpload, 'batchUpload'));

        // 初始化批量上传区域
        if (batchUploader) {
            // 重新绑定控制按钮事件
            batchUploader.setupControlButtons();
            setTimeout(() => batchUploader.findUploadButtons(), 100);
        }

        // 用户基本信息部分
        if (hasUserData) {
            const basicInfoContent = document.createElement('div');

            basicInfoContent.appendChild(createDataRow('ID:', userData.id, userData.id));
            basicInfoContent.appendChild(createDataRow('UUID:', userData.uuid, userData.uuid));
            basicInfoContent.appendChild(createDataRow('手机:', userData.mobile, userData.mobile));
            basicInfoContent.appendChild(createDataRow('邮箱:', userData.email, userData.email));
            basicInfoContent.appendChild(createDataRow('昵称:', userData.nickname, userData.nickname));

            if (userData.token) {
                basicInfoContent.appendChild(createDataRow('Token:', userData.token, userData.token, true));
            }

            if (userData.usertoken) {
                basicInfoContent.appendChild(createDataRow('UserToken:', userData.usertoken, userData.usertoken, true));
            }

            const copyAllBtn = document.createElement('button');
            copyAllBtn.textContent = '复制所有基本信息';
            copyAllBtn.className = 'copy-btn copy-btn-blue';
            copyAllBtn.setAttribute('data-text', JSON.stringify({
                id: userData.id,
                uuid: userData.uuid,
                mobile: userData.mobile,
                email: userData.email,
                nickname: userData.nickname,
                token: userData.token,
                usertoken: userData.usertoken
            }, null, 2));

            basicInfoContent.appendChild(copyAllBtn);

            content.appendChild(createCollapsibleSection('用户基本信息', basicInfoContent.innerHTML, collapseState.userBasicInfo, 'userBasicInfo'));

            // 用户完整数据部分
            const fullDataContent = document.createElement('div');
            const fullDataPre = document.createElement('pre');
            fullDataPre.style.cssText = `
                background: white;
                padding: 8px;
                border-radius: 4px;
                font-size: 10px;
                overflow-x: auto;
                white-space: pre-wrap;
                margin-top: 5px;
                max-height: 300px;
                overflow-y: auto;
            `;
            fullDataPre.textContent = JSON.stringify(userData, null, 2);

            const copyFullDataBtn = document.createElement('button');
            copyFullDataBtn.textContent = '复制完整JSON';
            copyFullDataBtn.className = 'copy-btn';
            copyFullDataBtn.setAttribute('data-text', JSON.stringify(userData, null, 2));
            copyFullDataBtn.style.marginTop = '5px';

            fullDataContent.appendChild(fullDataPre);
            fullDataContent.appendChild(copyFullDataBtn);

            content.appendChild(createCollapsibleSection('用户完整数据', fullDataContent.innerHTML, collapseState.userFullData, 'userFullData'));
        }

        // 生成请求数据部分
        if (hasGenerateData) {
            const latestGenerate = capturedGenerateData.latest;

            const generateLatestContent = document.createElement('div');

            const timestampDiv = document.createElement('div');
            timestampDiv.style.marginBottom = '8px';
            timestampDiv.innerHTML = `<strong>捕获时间:</strong> ${latestGenerate.timestamp}`;

            const urlDiv = document.createElement('div');
            urlDiv.style.marginBottom = '8px';
            urlDiv.innerHTML = `<strong>URL:</strong> ${latestGenerate.url}`;

            generateLatestContent.appendChild(timestampDiv);
            generateLatestContent.appendChild(urlDiv);

            const headersDetails = document.createElement('details');
            headersDetails.style.marginBottom = '8px';
            headersDetails.innerHTML = `
                <summary style="cursor: pointer; font-size: 11px;">请求头信息</summary>
                <pre style="background: white; padding: 8px; border-radius: 4px; font-size: 9px; overflow-x: auto; white-space: pre-wrap; margin-top: 5px; max-height: 200px; overflow-y: auto;">${JSON.stringify(latestGenerate.headers, null, 2)}</pre>
            `;

            const bodyDetails = document.createElement('details');
            bodyDetails.style.marginBottom = '8px';
            bodyDetails.innerHTML = `
                <summary style="cursor: pointer; font-size: 11px;">请求体数据</summary>
                <pre style="background: white; padding: 8px; border-radius: 4px; font-size: 9px; overflow-x: auto; white-space: pre-wrap; margin-top: 5px; max-height: 300px; overflow-y: auto;">${JSON.stringify(latestGenerate.data, null, 2)}</pre>
            `;

            const copyBodyBtn = document.createElement('button');
            copyBodyBtn.textContent = '复制请求体数据';
            copyBodyBtn.className = 'copy-btn';
            copyBodyBtn.setAttribute('data-text', JSON.stringify(latestGenerate.data, null, 2));
            copyBodyBtn.style.marginTop = '5px';

            generateLatestContent.appendChild(headersDetails);
            generateLatestContent.appendChild(bodyDetails);
            generateLatestContent.appendChild(copyBodyBtn);

            content.appendChild(createCollapsibleSection('最新生成请求数据', generateLatestContent.innerHTML, collapseState.generateLatestData, 'generateLatestData'));

            // 关键字段部分
            const keyFieldsContent = document.createElement('div');

            if (latestGenerate.headers) {
                const headerToken = latestGenerate.headers.token || latestGenerate.headers.Token;
                const headerWebid = latestGenerate.headers.webid || latestGenerate.headers.Webid;

                if (headerToken) {
                    keyFieldsContent.appendChild(createDataRow('Header Token:', headerToken, headerToken, true));
                }

                if (headerWebid) {
                    keyFieldsContent.appendChild(createDataRow('Header Webid:', headerWebid, headerWebid));
                }
            }

            if (latestGenerate.data) {
                const data = latestGenerate.data;

                if (data.comfyApp) {
                    if (data.comfyApp.workFlowUuid) {
                        keyFieldsContent.appendChild(createDataRow('WorkFlow UUID:', data.comfyApp.workFlowUuid, data.comfyApp.workFlowUuid));
                    }
                }

                if (data.generateType !== undefined) {
                    keyFieldsContent.appendChild(createDataRow('Generate Type:', data.generateType, data.generateType));
                }

                if (data.source !== undefined) {
                    keyFieldsContent.appendChild(createDataRow('Source:', data.source, data.source));
                }

                if (data.taskQueuePriority !== undefined) {
                    keyFieldsContent.appendChild(createDataRow('Task Queue Priority:', data.taskQueuePriority, data.taskQueuePriority));
                }

                if (data.comfyApp && data.comfyApp.prompt) {
                    for (const nodeId in data.comfyApp.prompt) {
                        const node = data.comfyApp.prompt[nodeId];
                        if (node.class_type === 'LibLibSeedreamV4Node' && node.inputs && node.inputs.prompt) {
                            keyFieldsContent.appendChild(createDataRow(
                                'Prompt:',
                                node.inputs.prompt,
                                node.inputs.prompt,
                                true
                            ));
                            break;
                        }
                    }
                }
            }

            const copyAllKeyFieldsBtn = document.createElement('button');
            copyAllKeyFieldsBtn.textContent = '复制所有关键字段';
            copyAllKeyFieldsBtn.className = 'copy-btn copy-btn-blue';

            const keyFieldsData = {};
            if (latestGenerate.headers) {
                keyFieldsData.token = latestGenerate.headers.token || latestGenerate.headers.Token;
                keyFieldsData.webid = latestGenerate.headers.webid || latestGenerate.headers.Webid;
            }
            if (latestGenerate.data) {
                if (latestGenerate.data.comfyApp) {
                    keyFieldsData.workFlowUuid = latestGenerate.data.comfyApp.workFlowUuid;
                }
                keyFieldsData.generateType = latestGenerate.data.generateType;
                keyFieldsData.source = latestGenerate.data.source;
                keyFieldsData.taskQueuePriority = latestGenerate.data.taskQueuePriority;

                if (latestGenerate.data.comfyApp && latestGenerate.data.comfyApp.prompt) {
                    for (const nodeId in latestGenerate.data.comfyApp.prompt) {
                        const node = latestGenerate.data.comfyApp.prompt[nodeId];
                        if (node.class_type === 'LibLibSeedreamV4Node' && node.inputs && node.inputs.prompt) {
                            keyFieldsData.prompt = node.inputs.prompt;
                            break;
                        }
                    }
                }
            }

            copyAllKeyFieldsBtn.setAttribute('data-text', JSON.stringify(keyFieldsData, null, 2));

            keyFieldsContent.appendChild(copyAllKeyFieldsBtn);

            content.appendChild(createCollapsibleSection('生成请求关键字段', keyFieldsContent.innerHTML, collapseState.generateKeyFields, 'generateKeyFields'));

            // 所有生成请求数据
            if (capturedGenerateData.all.length > 1) {
                const generateAllContent = document.createElement('div');

                const countDiv = document.createElement('div');
                countDiv.style.marginBottom = '8px';
                countDiv.innerHTML = `<strong>总请求数:</strong> ${capturedGenerateData.all.length}`;

                const allDataPre = document.createElement('pre');
                allDataPre.style.cssText = `
                    background: white;
                    padding: 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    overflow-x: auto;
                    white-space: pre-wrap;
                    margin-top: 5px;
                    max-height: 300px;
                    overflow-y: auto;
                `;
                allDataPre.textContent = JSON.stringify(capturedGenerateData.all, null, 2);

                const copyAllDataBtn = document.createElement('button');
                copyAllDataBtn.textContent = '复制所有生成请求数据';
                copyAllDataBtn.className = 'copy-btn';
                copyAllDataBtn.setAttribute('data-text', JSON.stringify(capturedGenerateData.all, null, 2));
                copyAllDataBtn.style.marginTop = '5px';

                generateAllContent.appendChild(countDiv);
                generateAllContent.appendChild(allDataPre);
                generateAllContent.appendChild(copyAllDataBtn);

                content.appendChild(createCollapsibleSection('所有生成请求数据', generateAllContent.innerHTML, collapseState.generateAllData, 'generateAllData'));
            }
        }

        if (!hasUserData && !hasGenerateData) {
            updateStatusIndicator('⏳ 等待捕获数据...', '#ff9800');
            content.innerHTML = `
                <div style="margin-bottom: 10px; color: #d32f2f;">
                    <p>正在等待捕获数据...</p>
                    <p>请确保：</p>
                    <ul style="margin-left: 15px;">
                        <li>已登录liblib.art</li>
                        <li>在页面上进行了一些操作</li>
                    </ul>
                    <p>尝试次数: ${initializationState.userDataAttempts}/${initializationState.maxUserDataAttempts}</p>
                </div>
            `;
        }

        // 绑定所有复制按钮事件
        bindCopyButtons(content);
    }

    // 修改初始化时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();
