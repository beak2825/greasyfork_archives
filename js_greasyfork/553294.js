// ==UserScript==
// @name         🌰榛子图床-nodeseek专用脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 NodeSeek 支持点击、拖拽和粘贴上传图片到 cococ.co 图床，并插入 Markdown 格式到编辑器
// @author       ZhangBreeze (Modified by Gemini)
// @match        https://www.nodeseek.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553294/%F0%9F%8C%B0%E6%A6%9B%E5%AD%90%E5%9B%BE%E5%BA%8A-nodeseek%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/553294/%F0%9F%8C%B0%E6%A6%9B%E5%AD%90%E5%9B%BE%E5%BA%8A-nodeseek%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API Key 的存储键
    const COCOC_API_KEY = 'cococApiKey';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    const editorWrapper = document.querySelector('#cm-editor-wrapper');
    const codeMirror = document.querySelector('.CodeMirror.cm-s-default.cm-s-nsk.CodeMirror-wrap.CodeMirror-overlayscroll');
    const cmInstance = document.querySelector('.CodeMirror')?.CodeMirror;

    function addUploadHint(container) {
        if (!container) return;
        const existingHint = container.querySelector('.upload-hint-text');
        if (existingHint) return;
        const hint = document.createElement('div');
        hint.className = 'upload-hint-text';
        hint.textContent = '支持拖拽或粘贴上传图片';
        hint.style.position = 'absolute';
        hint.style.bottom = '5px';
        hint.style.right = '5px';
        hint.style.color = '#888';
        hint.style.fontSize = '12px';
        hint.style.zIndex = '10';
        hint.style.pointerEvents = 'none';
        container.style.position = 'relative';
        container.appendChild(hint);
    }

    if (editorWrapper) {
        addUploadHint(editorWrapper);
    } else if (codeMirror) {
        addUploadHint(codeMirror);
    }

    function showUploadHint(container, fileCount) {
        if (!container) return;
        const existingHints = document.querySelectorAll('[id^="upload-hint-"]');
        existingHints.forEach(hint => hint.remove());
        const uploadHint = document.createElement('div');
        uploadHint.textContent = `正在上传 ${fileCount} 张图片，请稍等`;
        uploadHint.style.position = 'absolute';
        uploadHint.style.top = '50%';
        uploadHint.style.left = '50%';
        uploadHint.style.transform = 'translate(-50%, -50%)';
        uploadHint.style.color = '#666';
        uploadHint.style.fontSize = '14px';
        uploadHint.style.background = 'rgba(0, 0, 0, 0.1)';
        uploadHint.style.padding = '5px 10px';
        uploadHint.style.borderRadius = '3px';
        uploadHint.style.zIndex = '20';
        uploadHint.id = 'upload-hint-' + (container === editorWrapper ? 'wrapper' : 'codemirror');
        container.appendChild(uploadHint);
    }

    function removeUploadHint(container) {
        const uploadHint = document.getElementById('upload-hint-' + (container === editorWrapper ? 'wrapper' : 'codemirror'));
        if (uploadHint) uploadHint.remove();
    }

    function addSettingsIcon() {
        const uploadIcon = document.querySelector('span.toolbar-item.i-icon.i-icon-pic');
        if (!uploadIcon) return;
        const existingSettingsIcon = uploadIcon.parentNode.querySelector('.settings-icon');
        if (existingSettingsIcon) return;
        const settingsIcon = document.createElement('span');
        settingsIcon.className = 'toolbar-item i-icon settings-icon';
        settingsIcon.style.cursor = 'pointer';
        settingsIcon.style.marginLeft = '5px';
        settingsIcon.style.display = 'inline-block';
        settingsIcon.style.verticalAlign = 'middle';
        settingsIcon.style.width = '16px';
        settingsIcon.style.height = '16px';
        settingsIcon.title = '图床设置';
        settingsIcon.innerHTML = `
            <svg style="width: 100%; height: 100%; fill: currentColor;">
                <use data-v-0f04b1f4="" href="#setting-two"></use>
            </svg>
        `;
        uploadIcon.parentNode.insertBefore(settingsIcon, uploadIcon.nextSibling);
        settingsIcon.addEventListener('click', () => {
            showSettingsModal();
        });
    }

    function observeToolbar() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const uploadIcon = document.querySelector('span.toolbar-item.i-icon.i-icon-pic');
                    if (uploadIcon) {
                        addSettingsIcon();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        addSettingsIcon();
    }

    observeToolbar();

    function showSettingsModal() {
        const existingModal = document.querySelector('#image-host-settings-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'image-host-settings-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.background = 'linear-gradient(135deg, #ffffff, #f0f4f8)';
        modal.style.padding = '25px';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        modal.style.zIndex = '1000';
        modal.style.width = '370px';
        modal.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        modal.style.color = '#333';

        const currentApiKey = GM_getValue(COCOC_API_KEY, '');

        modal.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #2c3e50;">图床设置 (cococ.co)</h3>
            <div id="cococ-section">
                <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #34495e;">API Key：</label>
                <input type="text" id="cococ-api-key-input" value="${currentApiKey}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #dcdcdc; border-radius: 6px; background: #fff; font-size: 14px; color: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);" placeholder="请输入你的 API Key">
            </div>
            <div style="text-align: right;">
                <button id="save-settings-btn" style="background: linear-gradient(90deg, #4CAF50, #45a049); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.3s;">保存</button>
                <button id="close-settings-btn" style="background: linear-gradient(90deg, #f44336, #e53935); color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin-left: 10px; transition: background 0.3s;">关闭</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.4)';
        overlay.style.zIndex = '999';

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        document.querySelector('#save-settings-btn').addEventListener('click', () => {
            const apiKeyInput = document.querySelector('#cococ-api-key-input').value;
            GM_setValue(COCOC_API_KEY, apiKeyInput);
            modal.remove();
            overlay.remove();
        });

        document.querySelector('#close-settings-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
    }

    let isUploading = false;

    document.addEventListener('click', function(e) {
        const target = e.target.closest('span.toolbar-item.i-icon.i-icon-pic');
        if (target && !isUploading) {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        }
    }, true);

    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files.length > 0 && !isUploading) {
            isUploading = true;
            const files = Array.from(e.target.files);
            uploadMultipleFiles(files, editorWrapper || codeMirror).finally(() => {
                isUploading = false;
                fileInput.value = '';
            });
        }
    });

    if (editorWrapper) {
        editorWrapper.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); if (!isUploading) editorWrapper.style.border = '2px dashed #000'; });
        editorWrapper.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); editorWrapper.style.border = ''; });
        editorWrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editorWrapper.style.border = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isUploading) {
                isUploading = true;
                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    uploadMultipleFiles(files, editorWrapper).finally(() => isUploading = false);
                } else {
                    isUploading = false;
                }
            }
        });
        editorWrapper.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0 && !isUploading) {
                e.preventDefault();
                isUploading = true;
                uploadMultipleFiles(imageFiles, editorWrapper).finally(() => isUploading = false);
            }
        });
    }

    if (codeMirror) {
        codeMirror.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); if (!isUploading) codeMirror.style.border = '2px dashed #000'; });
        codeMirror.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); codeMirror.style.border = ''; });
        codeMirror.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            codeMirror.style.border = '';
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isUploading) {
                isUploading = true;
                const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
                if (files.length > 0) {
                    uploadMultipleFiles(files, codeMirror).finally(() => isUploading = false);
                } else {
                    isUploading = false;
                }
            }
        });
        codeMirror.addEventListener('paste', (e) => {
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0 && !isUploading) {
                e.preventDefault();
                isUploading = true;
                uploadMultipleFiles(imageFiles, codeMirror).finally(() => isUploading = false);
            }
        });
    }

    async function uploadMultipleFiles(files, container) {
        if (files.length === 0) return;
        showUploadHint(container, files.length);

        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append('images', file, file.name);
            return uploadToImageHost(formData);
        });

        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('批量上传失败:', error);
            alert(`部分或全部图片上传失败: ${error.message}`);
        } finally {
            removeUploadHint(container);
        }
    }

    function uploadToImageHost(formData) {
        return new Promise((resolve, reject) => {
            const apiUrl = 'https://images.cococ.co/api/upload';
            const apiKey = GM_getValue(COCOC_API_KEY, '').trim();

            if (!apiKey) {
                const errorMsg = '未设置 API Key。请点击编辑器工具栏中的设置图标进行配置。';
                console.error(errorMsg);
                reject(new Error(errorMsg));
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'X-API-Key': apiKey,
                    'Accept': 'application/json'
                },
                data: formData,
                timeout: 30000,
                onload: (response) => {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);

                        // --- THIS IS THE CORRECTED LOGIC ---
                        if (response.status === 200 && jsonResponse.success && Array.isArray(jsonResponse.files) && jsonResponse.files.length > 0) {
                            const fileInfo = jsonResponse.files[0];
                            const imageName = fileInfo.name || 'image';
                            const imageUrl = fileInfo.fullUrl;

                            if (imageUrl) {
                                const markdownImage = `![${imageName}](${imageUrl})`;
                                console.log('cococ.co 上传成功，Markdown:', markdownImage);
                                insertToEditor(markdownImage);
                                resolve();
                            } else {
                                console.error('上传成功但响应中缺少 fullUrl:', jsonResponse);
                                reject(new Error('上传成功，但响应中缺少图片 URL。'));
                            }
                        } else {
                            const serverMessage = jsonResponse.message || JSON.stringify(jsonResponse);
                            console.error('cococ.co 上传失败或返回格式无效:', serverMessage);
                            reject(new Error(`上传失败: ${serverMessage}`));
                        }
                    } catch (error) {
                        console.error('解析 cococ.co 响应错误:', error, response.responseText);
                        reject(new Error('解析服务器响应失败。'));
                    }
                },
                onerror: (error) => {
                    console.error('cococ.co 上传错误详情:', error);
                    reject(new Error(`网络请求失败: ${error.statusText || '未知错误'}`));
                },
                ontimeout: () => {
                    console.error('cococ.co 请求超时');
                    reject(new Error('上传请求超时。'));
                }
            });
        });
    }

    function insertToEditor(markdown) {
        if (cmInstance) {
            const cursor = cmInstance.getCursor();
            cmInstance.replaceRange(markdown + '\n', cursor);
            console.log('已插入 Markdown 到编辑器');
        } else {
            const editable = document.querySelector('.CodeMirror textarea') || document.querySelector('textarea');
            if (editable) {
                const start = editable.selectionStart;
                const end = editable.selectionEnd;
                editable.value = editable.value.substring(0, start) + markdown + '\n' + editable.value.substring(end);
                editable.selectionStart = editable.selectionEnd = start + markdown.length + 1;
                console.log('已插入 Markdown 到 textarea');
                const event = new Event('input', { bubbles: true });
                editable.dispatchEvent(event);
            } else {
                console.error('未找到可编辑的 CodeMirror 实例或 textarea');
            }
        }
    }
})();