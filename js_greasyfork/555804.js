// ==UserScript==
// @name         拖拽上传增强
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  为文件上传按钮添加拖拽上传功能
// @author       damu
// @match        *://qlabel.tencent.com/workbench/tasks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555804/%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/555804/%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        addGlobalStyles();
        initAllUploadAreas();
        observeDOMChanges();
    }

    // 立即初始化，不等待
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function addGlobalStyles() {
        if (document.querySelector('#drag-upload-styles')) return;

        const style = document.createElement('style');
        style.id = 'drag-upload-styles';
        style.textContent = `
            .drag-upload-container {
                display: flex;
                align-items: center;
                gap: 16px;
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
            }
            .original-upload-btn {
                flex-shrink: 0;
            }
            .drag-upload-area {
                flex: 1;
                min-height: 80px;
                border: 2px dashed #d9d9d9;
                border-radius: 6px;
                background: #fafafa;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                padding: 10px;
            }
            .drag-upload-area:hover {
                border-color: #2d8cf0;
                background: #f0faff;
            }
            .drag-upload-area.drag-over {
                border-color: #2d8cf0;
                background-color: #f0faff;
                transform: scale(1.02);
            }
            .drag-content {
                text-align: center;
                color: #666;
            }
            .drag-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }
            .drag-text {
                font-size: 14px;
                margin-bottom: 4px;
            }
            .drag-hint {
                font-size: 12px;
                color: #999;
            }
            .step-indicator {
                position: absolute;
                top: -10px;
                left: 10px;
                background: #2d8cf0;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
                z-index: 10;
            }
            .upload-feedback {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            }
            .upload-feedback.show {
                opacity: 1;
                transform: translateX(0);
            }
            .upload-feedback.success {
                background: #f6ffed;
                border: 1px solid #b7eb8f;
                color: #52c41a;
            }
            .upload-feedback.error {
                background: #fff2f0;
                border: 1px solid #ffccc7;
                color: #ff4d4f;
            }
            .upload-success-state {
                text-align: center;
                padding: 20px;
                background: #f6ffed;
                border: 1px solid #b7eb8f;
                border-radius: 6px;
                color: #52c41a;
                margin: 10px 0;
            }
            .success-checkmark {
                font-size: 20px;
                margin-right: 8px;
            }
            .file-info {
                font-size: 11px;
                color: #666;
                margin-top: 4px;
                word-break: break-all;
            }
            .reupload-btn {
                background: #fff;
                border: 1px solid #b7eb8f;
                color: #52c41a;
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                margin-top: 8px;
            }
            .reupload-btn:hover {
                background: #f6ffed;
            }
            .drag-upload-area-hidden {
                display: none !important;
            }
            .step-completed .title h3 {
                color: #52c41a !important;
            }
            .step-completed .title::after {
                content: " ✅";
                color: #52c41a;
                margin-left: 8px;
            }
            @media (max-width: 768px) {
                .drag-upload-container {
                    flex-direction: column;
                    gap: 12px;
                }
                .drag-upload-area {
                    width: 100%;
                    min-height: 70px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function initAllUploadAreas() {
        const uploadContainers = document.querySelectorAll('.t-upload');

        uploadContainers.forEach((container, index) => {
            if (!container.hasAttribute('data-drag-initialized')) {
                enhanceUploadArea(container, index + 1);
            }
        });
    }

    function enhanceUploadArea(uploadContainer, stepNumber) {
        if (uploadContainer.hasAttribute('data-drag-initialized')) {
            return;
        }

        const fileInput = uploadContainer.querySelector('input[type="file"]');
        const singleFileArea = uploadContainer.querySelector('.t-upload__single-file');

        if (!fileInput || !singleFileArea) {
            return;
        }

        // 查找上传按钮并校验按钮文字
        const uploadButton = findUploadButton(singleFileArea);
        if (!uploadButton) {
            // console.log(`步骤${stepNumber}: 未找到有效的文件上传按钮`);
            return;
        }

        // 检查是否已经有文件上传了
        if (fileInput.files.length > 0) {
            markStepAsCompleted(uploadContainer, fileInput.files[0].name, stepNumber, fileInput);
            uploadContainer.setAttribute('data-drag-initialized', 'true');
            return;
        }

        // 检查是否已经是我们添加的拖拽区域（避免重复初始化）
        if (singleFileArea.querySelector('.drag-upload-container')) {
            uploadContainer.setAttribute('data-drag-initialized', 'true');
            return;
        }

        // 保存原始按钮的HTML
        const originalButton = singleFileArea.querySelector('.t-upload__trigger');
        if (!originalButton) {
            console.log('未找到原始上传按钮');
            return;
        }

        // 创建新的容器
        const dragContainer = document.createElement('div');
        dragContainer.className = 'drag-upload-container';

        // 左侧：原始按钮区域
        const originalBtnWrapper = document.createElement('div');
        originalBtnWrapper.className = 'original-upload-btn';
        originalBtnWrapper.appendChild(originalButton.cloneNode(true));

        // 右侧：拖拽区域
        const dragArea = document.createElement('div');
        dragArea.className = 'drag-upload-area';
        dragArea.innerHTML = `
            <div class="drag-content">
                <div class="drag-icon">📁</div>
                <div class="drag-text">拖拽图片到此处</div>
                <div class="drag-hint">或点击选择文件</div>
            </div>
            <div class="step-indicator">步骤 ${stepNumber}</div>
        `;

        // 组装容器
        dragContainer.appendChild(originalBtnWrapper);
        dragContainer.appendChild(dragArea);

        // 替换原内容 - 只替换上传按钮区域
        singleFileArea.innerHTML = '';
        singleFileArea.appendChild(dragContainer);

        // 重新绑定原始按钮的点击事件
        const newButton = originalBtnWrapper.querySelector('.t-upload__trigger button');
        if (newButton) {
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            });
        }

        // 拖拽事件处理
        setupDragEvents(dragArea, fileInput, stepNumber, uploadContainer);

        // 点击拖拽区域也可以选择文件
        dragArea.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                fileInput.click();
            }
        });

        // 监听原生文件输入变化
        fileInput.addEventListener('change', function(e) {
            if (this.files.length > 0) {
                // 修改文件名
                modifyFileName(this, stepNumber);
                markStepAsCompleted(uploadContainer, this.files[0].name, stepNumber, this);
                showFeedback(`第${stepNumber}步：文件上传成功`, 'success');
            }
        });

        uploadContainer.setAttribute('data-drag-initialized', 'true');
        console.log(`步骤${stepNumber}: 已添加拖拽上传功能`);
    }

    function findUploadButton(container) {
        // 查找所有可能的按钮元素
        const buttons = container.querySelectorAll('button, .t-upload__trigger, [class*="upload"], [class*="btn"]');

        for (let element of buttons) {
            // 获取元素的文本内容（包括子元素的文本）
            const textContent = element.textContent?.trim() || '';

            // 检查是否包含"文件上传"文字
            if (textContent.includes('文件上传')) {
                return element;
            }

            // 如果是按钮元素，检查其内部的span或div的文本
            if (element.tagName === 'BUTTON') {
                const buttonText = element.querySelector('.t-button__text, .ivu-btn span, span, div');
                if (buttonText && buttonText.textContent?.trim().includes('文件上传')) {
                    return element;
                }
            }
        }

        // 如果没找到，尝试在.t-upload__trigger内查找
        const trigger = container.querySelector('.t-upload__trigger');
        if (trigger) {
            const triggerText = trigger.textContent?.trim() || '';
            if (triggerText.includes('文件上传')) {
                return trigger;
            }
        }

        return null;
    }

    function setupDragEvents(dragArea, fileInput, stepNumber, uploadContainer) {
        dragArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('drag-over');
        });

        dragArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!this.contains(e.relatedTarget)) {
                this.classList.remove('drag-over');
            }
        });

        dragArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files, fileInput, stepNumber, uploadContainer);
            }
        });
    }

    function handleFiles(files, fileInput, stepNumber, uploadContainer) {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

        const imageFiles = Array.from(files).filter(file =>
            validTypes.includes(file.type)
        );

        if (imageFiles.length === 0) {
            showFeedback(`第${stepNumber}步：请上传有效的图片文件（PNG, JPG, GIF）`, 'error');
            return;
        }

        if (imageFiles.length > 1) {
            showFeedback(`第${stepNumber}步：每次只能上传一个文件`, 'error');
            return;
        }

        const file = imageFiles[0];

        if (file.size > 10 * 1024 * 1024) {
            showFeedback(`第${stepNumber}步：文件大小不能超过10MB`, 'error');
            return;
        }

        // 更新文件输入
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        // 修改文件名
        modifyFileName(fileInput, stepNumber);

        // 标记步骤为完成
        markStepAsCompleted(uploadContainer, fileInput.files[0].name, stepNumber, fileInput);

        // 触发change事件
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);

        showFeedback(`第${stepNumber}步：文件上传成功`, 'success');
    }

    function modifyFileName(fileInput, stepNumber) {
        // 获取任务ID
        let taskId = getTaskId();
        if (!taskId) {
            console.log('未找到任务ID');
            return;
        }

        // 获取文件扩展名
        const originalFile = fileInput.files[0];
        const fileExtension = originalFile.name.split('.').pop();

        // 构建新文件名：任务ID_步骤数字.扩展名
        const newFileName = `${taskId}_${stepNumber}.${fileExtension}`;

        // 创建新文件对象
        const newFile = new File([originalFile], newFileName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified
        });

        // 更新文件输入
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(newFile);
        fileInput.files = dataTransfer.files;

        console.log(`文件名已修改: ${originalFile.name} -> ${newFileName}`);
    }

    function getTaskId() {
        // 从页面表格中获取任务ID
        const taskIdElement = document.querySelector('.ivu-table-tbody tr:first-child .ivu-table-cell pre');
        if (taskIdElement) {
            return taskIdElement.textContent.trim();
        }

        // 备用方法：从其他可能的位置查找任务ID
        const possibleElements = document.querySelectorAll('pre, code, .task-id, [class*="id"], [class*="task"]');
        for (let element of possibleElements) {
            const text = element.textContent?.trim();
            if (text && text.includes('wxapp_instructions')) {
                return text;
            }
        }

        // 默认返回img
        return 'img';
    }

    function markStepAsCompleted(uploadContainer, fileName, stepNumber, fileInput) {
        // 只隐藏我们添加的拖拽上传区域，保留页面原有的文件显示
        const singleFileArea = uploadContainer.querySelector('.t-upload__single-file');
        if (!singleFileArea) return;

        // 创建成功状态显示
        const successState = document.createElement('div');
        successState.className = 'upload-success-state';
        successState.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                <span class="success-checkmark">✅</span>
                <strong>第${stepNumber}步上传完成</strong>
            </div>
            <div class="file-info">文件: ${fileName}</div>
            <button class="reupload-btn">重新上传</button>
        `;

        // 替换我们添加的上传区域
        singleFileArea.innerHTML = '';
        singleFileArea.appendChild(successState);

        // 标记整个步骤卡片为完成状态
        const collectItem = uploadContainer.closest('.collect-item');
        if (collectItem) {
            collectItem.classList.add('step-completed');
        }

        // 重新上传功能
        const reuploadBtn = successState.querySelector('.reupload-btn');
        reuploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // 清除文件输入
            fileInput.value = '';

            // 移除完成状态
            if (collectItem) {
                collectItem.classList.remove('step-completed');
            }

            // 重新初始化上传区域
            uploadContainer.removeAttribute('data-drag-initialized');
            enhanceUploadArea(uploadContainer, stepNumber);
        });
    }

    function showFeedback(message, type = 'info') {
        const oldFeedback = document.querySelector('.upload-feedback');
        if (oldFeedback) {
            oldFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.className = `upload-feedback ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);

        setTimeout(() => feedback.classList.add('show'), 100);

        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 3000);
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            const newUploadContainers = node.querySelectorAll ? node.querySelectorAll('.t-upload:not([data-drag-initialized])') : [];
                            if (node.classList && node.classList.contains('t-upload') && !node.hasAttribute('data-drag-initialized')) {
                                newUploadContainers.push(node);
                            }

                            if (newUploadContainers.length > 0) {
                                // 立即初始化，不等待
                                newUploadContainers.forEach(container => {
                                    const stepNumber = getStepNumber(container);
                                    enhanceUploadArea(container, stepNumber);
                                });
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function getStepNumber(container) {
        const header = container.closest('.collect-item')?.querySelector('.title h3');
        if (header) {
            const match = header.textContent.match(/第(\d+)步/);
            if (match) return parseInt(match[1]);
        }

        const allContainers = document.querySelectorAll('.t-upload');
        return Array.from(allContainers).indexOf(container) + 1;
    }

    // 防止页面本身的拖拽事件被干扰
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    }, false);

    document.addEventListener('drop', function(e) {
        e.preventDefault();
    }, false);

    // 定期检查是否有新的上传区域需要初始化（间隔缩短）
    setInterval(() => {
        const uninitializedContainers = document.querySelectorAll('.t-upload:not([data-drag-initialized])');
        if (uninitializedContainers.length > 0) {
            initAllUploadAreas();
        }
    }, 500); // 缩短到500ms
})();