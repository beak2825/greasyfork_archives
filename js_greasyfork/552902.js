// ==UserScript==
// @name         NodeSeek & DeepFlood 一键传图
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  在 NodeSeek 或 DeepFlood 评论或发贴时将图片上传到并插入 Markdown 链接。
// @author       ceocok
// @match        https://www.nodeseek.com/*
// @match        https://www.deepflood.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552902/NodeSeek%20%20DeepFlood%20%E4%B8%80%E9%94%AE%E4%BC%A0%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/552902/NodeSeek%20%20DeepFlood%20%E4%B8%80%E9%94%AE%E4%BC%A0%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个隐藏的文件输入框，用于点击上传
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 获取编辑器实例
    const editorWrapper = document.querySelector('#cm-editor-wrapper');
    const codeMirror = document.querySelector('.CodeMirror.cm-s-default.cm-s-nsk.CodeMirror-wrap.CodeMirror-overlayscroll');
    const cmInstance = document.querySelector('.CodeMirror')?.CodeMirror;

    let isUploading = false;

    /**
     * 在编辑器右下角添加一个永久性的提示文字
     * @param {HTMLElement} container - 编辑器容器元素
     */
    function addPermanentHint(container) {
        if (!container) return;
        if (container.querySelector('.upload-permanent-hint')) return;
        const hint = document.createElement('div');
        hint.className = 'upload-permanent-hint';
        hint.textContent = '支持拖拽或粘贴上传图片';
        hint.style.position = 'absolute';
        hint.style.bottom = '5px';
        hint.style.right = '5px';
        hint.style.color = '#888';
        hint.style.fontSize = '12px';
        hint.style.zIndex = '10';
        hint.style.pointerEvents = 'none'; // 确保不影响鼠标操作
        container.style.position = 'relative'; // 确保相对定位生效
        container.appendChild(hint);
    }

    // 为编辑器添加永久提示
    addPermanentHint(editorWrapper || codeMirror);


    /**
     * 在上传过程中显示一个临时的提示
     * @param {HTMLElement} container - 编辑器容器元素
     * @param {number} fileCount - 正在上传的文件数量
     */
    function showUploadHint(container, fileCount) {
        if (!container) return;
        // 移除旧提示
        removeUploadHint(container);
        const uploadHint = document.createElement('div');
        uploadHint.className = 'upload-in-progress-hint';
        uploadHint.textContent = `正在上传 ${fileCount} 张图片...`;
        Object.assign(uploadHint.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '10px 15px',
            borderRadius: '5px',
            zIndex: '20',
            whiteSpace: 'nowrap',
        });
        container.appendChild(uploadHint);
    }

    /**
     * 移除上传中的临时提示
     * @param {HTMLElement} container - 编辑器容器元素
     */
    function removeUploadHint(container) {
        const uploadHint = container?.querySelector('.upload-in-progress-hint');
        if (uploadHint) uploadHint.remove();
    }


    /**
     * 将 Markdown 文本插入到编辑器中
     * @param {string} markdown - 要插入的 Markdown 文本
     */
    function insertToEditor(markdown) {
        const textToInsert = markdown + '\n';
        if (cmInstance) {
            cmInstance.replaceSelection(textToInsert);
        } else {
            const editorTextarea = document.querySelector('.CodeMirror textarea') || document.querySelector('textarea');
            if (editorTextarea) {
                const start = editorTextarea.selectionStart;
                const end = editorTextarea.selectionEnd;
                editorTextarea.value = editorTextarea.value.substring(0, start) + textToInsert + editorTextarea.value.substring(end);
                editorTextarea.selectionStart = editorTextarea.selectionEnd = start + textToInsert.length;
                editorTextarea.dispatchEvent(new Event('input', { bubbles: true })); // 触发输入事件，让前端框架知道内容已改变
            } else {
                console.error('未找到编辑器实例或文本框。');
            }
        }
    }


    /**
     * 上传单个文件到 Catbox.moe
     * @param {File} file - 要上传的文件
     * @returns {Promise<void>}
     */
    function uploadFileToCatbox(file) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', file);

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://catbox.moe/user/api.php',
                data: formData,
                timeout: 60000, // 60秒超时
                onload: (response) => {
                    if (response.status === 200 && response.responseText.startsWith('http')) {
                        const imageUrl = response.responseText;
                        const fileName = file.name.split('.').slice(0, -1).join('.') || 'image';
                        const markdownImage = `![${fileName}](${imageUrl})`;
                        insertToEditor(markdownImage);
                        resolve();
                    } else {
                        reject(new Error(`上传失败: ${response.responseText || response.statusText}`));
                    }
                },
                onerror: (error) => reject(new Error('网络请求错误')),
                ontimeout: () => reject(new Error('上传超时')),
            });
        });
    }


    /**
     * 处理多个文件的上传流程
     * @param {File[]} files - 文件数组
     * @param {HTMLElement} container - 编辑器容器元素
     */
    async function handleFileUploads(files, container) {
        if (isUploading || files.length === 0) return;

        isUploading = true;
        showUploadHint(container, files.length);

        try {
            // 使用 Promise.allSettled 来确保所有上传都完成，无论成功或失败
            const results = await Promise.allSettled(files.map(uploadFileToCatbox));
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`文件 ${files[index].name} 上传失败:`, result.reason);
                    alert(`文件 ${files[index].name} 上传失败，请查看控制台获取详情。`);
                }
            });
        } finally {
            isUploading = false;
            removeUploadHint(container);
            fileInput.value = ''; // 重置文件输入框
        }
    }


    // 1. 监听工具栏图片图标的点击事件
    document.addEventListener('click', function(e) {
        const uploadIcon = e.target.closest('span.toolbar-item.i-icon.i-icon-pic');
        if (uploadIcon) {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click(); // 触发隐藏的文件输入框
        }
    }, true);

    // 文件输入框选择文件后触发上传
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUploads(files, editorWrapper || codeMirror);
    });

    // 2. 为编辑器添加拖拽和粘贴事件监听
    function addEventListenersTo(element) {
        if (!element) return;

        // 拖拽事件
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isUploading) element.style.border = '2px dashed #007bff';
        });
        element.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.style.border = '';
        });
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            element.style.border = '';
            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
            handleFileUploads(files, element);
        });

        // 粘贴事件
        element.addEventListener('paste', (e) => {
            const files = Array.from(e.clipboardData.files).filter(f => f.type.startsWith('image/'));
            if (files.length > 0) {
                e.preventDefault();
                handleFileUploads(files, element);
            }
        });
    }

    addEventListenersTo(editorWrapper);
    addEventListenersTo(codeMirror);

})();