// ==UserScript==
// @name         中国大学MOOC 拖拽上传附件
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  为中国大学MOOC作业页面添加拖拽上传附件功能，支持粘贴图片上传
// @author       失意
// @match        https://www.icourse163.org/learn/*
// @match        https://www.icourse163.org/spoc/learn/*
// @icon         https://www.icourse163.org/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558305/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%20%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%E9%99%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/558305/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%20%E6%8B%96%E6%8B%BD%E4%B8%8A%E4%BC%A0%E9%99%84%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        uploadUrl: 'https://upload.icourse163.org/file/smallFileUpload.htm',
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedExtensions: ['txt', 'mp3', 'jpg', 'png', 'rar', 'zip', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf'],
        dropZoneSelector: '.j-attachment, .j-upload, .u-simpleFileUpload, .m-homework',
        fileInputSelector: '.j-upload.realIpt, input[type="file"].realIpt'
    };

    // 样式注入
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .mooc-drop-zone {
                position: relative;
                transition: all 0.3s ease;
            }
            
            .mooc-drop-zone.drag-over {
                background-color: rgba(0, 180, 120, 0.1) !important;
                border: 2px dashed #00b478 !important;
                border-radius: 8px;
            }
            
            .mooc-drop-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 180, 120, 0.15);
                z-index: 9999;
                display: none;
                justify-content: center;
                align-items: center;
                pointer-events: none;
            }
            
            .mooc-drop-overlay.active {
                display: flex;
            }
            
            .mooc-drop-hint {
                background: white;
                padding: 40px 60px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                text-align: center;
                border: 3px dashed #00b478;
            }
            
            .mooc-drop-hint-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .mooc-drop-hint-text {
                font-size: 18px;
                color: #333;
                font-weight: 500;
            }
            
            .mooc-drop-hint-subtext {
                font-size: 14px;
                color: #666;
                margin-top: 8px;
            }
            
            .mooc-upload-progress {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                min-width: 280px;
            }
            
            .mooc-upload-progress-title {
                font-size: 14px;
                font-weight: 500;
                color: #333;
                margin-bottom: 8px;
            }
            
            .mooc-upload-progress-bar {
                height: 6px;
                background: #e0e0e0;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .mooc-upload-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00b478, #00d68f);
                border-radius: 3px;
                transition: width 0.3s ease;
            }
            
            .mooc-upload-progress-text {
                font-size: 12px;
                color: #666;
                margin-top: 6px;
                text-align: right;
            }
            
            .mooc-toast {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 10001;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                animation: moocToastIn 0.3s ease;
            }
            
            .mooc-toast.success {
                background: #00b478;
            }
            
            .mooc-toast.error {
                background: #ff4d4f;
            }
            
            @keyframes moocToastIn {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    };

    // 创建拖拽提示覆盖层
    const createDropOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'mooc-drop-overlay';
        overlay.innerHTML = `
            <div class="mooc-drop-hint">
                <div class="mooc-drop-hint-icon">📁</div>
                <div class="mooc-drop-hint-text">释放文件以上传附件</div>
                <div class="mooc-drop-hint-subtext">支持 ${CONFIG.allowedExtensions.join(', ')} 等格式</div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    };

    // 显示Toast提示
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `mooc-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'moocToastIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // 创建上传进度条
    const createProgressBar = (fileName) => {
        const progress = document.createElement('div');
        progress.className = 'mooc-upload-progress';
        progress.innerHTML = `
            <div class="mooc-upload-progress-title">正在上传: ${fileName}</div>
            <div class="mooc-upload-progress-bar">
                <div class="mooc-upload-progress-fill" style="width: 0%"></div>
            </div>
            <div class="mooc-upload-progress-text">0%</div>
        `;
        document.body.appendChild(progress);
        return progress;
    };

    // 更新进度条
    const updateProgress = (progressEl, percent) => {
        const fill = progressEl.querySelector('.mooc-upload-progress-fill');
        const text = progressEl.querySelector('.mooc-upload-progress-text');
        fill.style.width = `${percent}%`;
        text.textContent = `${Math.round(percent)}%`;
    };

    // 验证文件
    const validateFile = (file) => {
        const ext = file.name.split('.').pop().toLowerCase();

        if (!CONFIG.allowedExtensions.includes(ext)) {
            showToast(`不支持的文件格式: .${ext}`, 'error');
            return false;
        }

        if (file.size > CONFIG.maxFileSize) {
            showToast(`文件过大，最大支持 ${CONFIG.maxFileSize / 1024 / 1024}MB`, 'error');
            return false;
        }

        return true;
    };

    // 查找页面上的文件输入框
    const findFileInput = () => {
        // 优先查找附件上传区域的input
        const attachmentInput = document.querySelector('.j-attachment input[type="file"]');
        if (attachmentInput) return attachmentInput;

        // 查找通用上传input
        const inputs = document.querySelectorAll(CONFIG.fileInputSelector);
        for (const input of inputs) {
            // 检查是否是附件上传的input（不是图片上传）
            const parent = input.closest('.j-attachment, .u-simpleFileUpload');
            if (parent) return input;
        }

        // 返回第一个找到的
        return inputs[0] || null;
    };

    // 模拟文件选择
    const triggerFileInput = (file) => {
        const fileInput = findFileInput();

        if (!fileInput) {
            showToast('未找到上传入口，请确保在作业页面', 'error');
            return false;
        }

        // 创建 DataTransfer 对象来设置文件
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        // 触发 change 事件
        const changeEvent = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(changeEvent);

        // 也触发 input 事件
        const inputEvent = new Event('input', { bubbles: true });
        fileInput.dispatchEvent(inputEvent);

        showToast(`已选择文件: ${file.name}`, 'success');
        return true;
    };

    // 使用 XHR 直接上传（备用方案）
    const uploadFileXHR = async (file) => {
        const progressBar = createProgressBar(file.name);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();

            return new Promise((resolve, reject) => {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        updateProgress(progressBar, percent);
                    }
                });

                xhr.addEventListener('load', () => {
                    progressBar.remove();
                    if (xhr.status >= 200 && xhr.status < 300) {
                        showToast('上传成功！', 'success');
                        resolve(xhr.response);
                    } else {
                        showToast('上传失败，请重试', 'error');
                        reject(new Error(`Upload failed: ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    progressBar.remove();
                    showToast('上传出错，请检查网络', 'error');
                    reject(new Error('Network error'));
                });

                xhr.open('POST', CONFIG.uploadUrl);
                xhr.withCredentials = true;
                xhr.send(formData);
            });
        } catch (error) {
            progressBar.remove();
            throw error;
        }
    };

    // 处理拖拽的文件
    const handleDroppedFile = async (file) => {
        if (!validateFile(file)) return;

        console.log('[MOOC DropUploader] 处理文件:', file.name);

        // 首先尝试触发原生的文件输入
        const triggered = triggerFileInput(file);

        if (!triggered) {
            // 如果没有找到输入框，尝试直接上传
            console.log('[MOOC DropUploader] 尝试直接上传...');
            try {
                await uploadFileXHR(file);
            } catch (error) {
                console.error('[MOOC DropUploader] 上传失败:', error);
            }
        }
    };

    // 将图片插入到编辑器中
    const insertImageToEditor = (imageUrl) => {
        try {
            // 查找 Quill 编辑器
            const editor = document.querySelector('.ql-editor');
            if (!editor) {
                console.log('[MOOC DropUploader] 未找到编辑器');
                return false;
            }

            // 创建图片元素
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100%';

            // 获取当前光标位置或在末尾插入
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // 确保range在编辑器内
                if (editor.contains(range.commonAncestorContainer)) {
                    range.deleteContents();
                    range.insertNode(img);
                    // 在图片后添加换行
                    const br = document.createElement('br');
                    range.collapse(false);
                    range.insertNode(br);
                    range.setStartAfter(br);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    return true;
                }
            }

            // 如果没有光标位置，在末尾插入
            editor.appendChild(img);
            editor.appendChild(document.createElement('br'));
            return true;
        } catch (error) {
            console.error('[MOOC DropUploader] 插入图片失败:', error);
            return false;
        }
    };

    // 上传图片并获取URL
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(CONFIG.uploadUrl, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();
            // 根据MOOC的返回格式调整
            return result.url || result.data?.url || result;
        } catch (error) {
            console.error('[MOOC DropUploader] 上传失败:', error);
            throw error;
        }
    };

    // 处理粘贴的图片
    const handlePastedImage = async (items) => {
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    // 生成文件名
                    const timestamp = new Date().getTime();
                    const ext = blob.type.split('/')[1] || 'png';
                    const fileName = `pasted-image-${timestamp}.${ext}`;

                    // 创建File对象
                    const file = new File([blob], fileName, { type: blob.type });

                    console.log('[MOOC DropUploader] 检测到粘贴图片:', fileName);

                    try {
                        showToast('正在上传图片...', 'info');
                        const imageUrl = await uploadImage(file);

                        if (imageUrl && insertImageToEditor(imageUrl)) {
                            showToast('图片插入成功！', 'success');
                        } else {
                            showToast('图片插入失败', 'error');
                        }
                    } catch (error) {
                        showToast('图片上传失败', 'error');
                        console.error('[MOOC DropUploader] 处理失败:', error);
                    }

                    return true;
                }
            }
        }
        return false;
    };

    // 初始化粘贴功能
    const initPaste = () => {
        document.addEventListener('paste', async (e) => {
            // 检查是否在作业编辑器中
            const editor = document.querySelector('.ql-editor');
            if (!editor) {
                return;
            }

            // 检查焦点是否在编辑器内
            const activeElement = document.activeElement;
            if (!editor.contains(activeElement) && activeElement !== editor) {
                return;
            }

            const items = e.clipboardData?.items;
            if (!items) return;

            // 转换为数组并处理
            const itemsArray = Array.from(items);
            const hasImage = await handlePastedImage(itemsArray);

            if (hasImage) {
                // 如果处理了图片，阻止默认行为
                e.preventDefault();
            }
        });

        console.log('[MOOC DropUploader] 粘贴上传功能已启用');
    };

    // 初始化拖拽功能
    const initDragDrop = () => {
        const overlay = createDropOverlay();
        let dragCounter = 0;

        // 全局拖拽事件
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dragCounter++;

            // 检查是否在作业页面
            if (document.querySelector('.m-homework, .j-attachment')) {
                overlay.classList.add('active');
            }
        });

        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragCounter--;

            if (dragCounter === 0) {
                overlay.classList.remove('active');
            }
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            dragCounter = 0;
            overlay.classList.remove('active');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                // 只处理第一个文件（MOOC只支持一个附件）
                handleDroppedFile(files[0]);

                if (files.length > 1) {
                    showToast('注意：只支持上传一个附件，已选择第一个文件', 'info');
                }
            }
        });

        // 为特定区域添加视觉反馈
        const addDropZoneStyle = () => {
            const zones = document.querySelectorAll(CONFIG.dropZoneSelector);
            zones.forEach(zone => {
                if (!zone.classList.contains('mooc-drop-zone')) {
                    zone.classList.add('mooc-drop-zone');

                    zone.addEventListener('dragenter', () => {
                        zone.classList.add('drag-over');
                    });

                    zone.addEventListener('dragleave', () => {
                        zone.classList.remove('drag-over');
                    });

                    zone.addEventListener('drop', () => {
                        zone.classList.remove('drag-over');
                    });
                }
            });
        };

        // 初始添加样式
        addDropZoneStyle();

        // 监听DOM变化，为动态加载的元素添加样式
        const observer = new MutationObserver(() => {
            addDropZoneStyle();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[MOOC DropUploader] 拖拽上传功能已启用');
    };

    // 等待页面加载完成
    const waitForPage = () => {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    };

    // 主函数
    const main = async () => {
        await waitForPage();

        // 延迟执行，确保MOOC的JS已加载
        setTimeout(() => {
            injectStyles();
            initDragDrop();
            initPaste();

            // 添加快捷键提示
            console.log('[MOOC DropUploader] 中国大学MOOC拖拽上传脚本已加载');
            console.log('[MOOC DropUploader] 直接将文件拖拽到页面即可上传附件');
            console.log('[MOOC DropUploader] 也可以直接在填写框内粘贴图片上传');
        }, 1000);
    };

    main();
})();
