// ==UserScript==
// @name         百度贴吧图片粘贴上传助手
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  支持粘贴任意图片（本地/网络），自动通过图床中转上传
// @author       Your name
// @match        *://tieba.baidu.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @connect      tieba.baidu.com
// @connect      gitee.com
// @connect      tiebapic.baidu.com
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555110/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555110/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E7%B2%98%E8%B4%B4%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        MAX_SIZE_KB: 500,
        JPEG_QUALITY: 0.85,
        MAX_WIDTH: 1920,
        MAX_HEIGHT: 1920,
        TIEBA_API: 'http://upload.tieba.baidu.com/upload/pic',

        // Gitee 图床配置
        GITEE_USERNAME: '',        // ⚠️ 确认你的 Gitee 用户名
        GITEE_REPO: '',        // ⚠️ 确认仓库名（访问 https://gitee.com/lpzams/typora_img 检查）
        GITEE_TOKEN: '',        // ⚠️ 确认 Token 有 projects 权限
        GITEE_BRANCH: '',          // ⚠️ 确认分支名（master 或 main）
        GITEE_PATH: '',                  // ⚠️ 改为空字符串，直接存储在仓库根目录

        USE_IMAGEBED: true
    };

    let progressContainer = null;

    console.log('====================================');
    console.log('贴吧图片粘贴助手 v6.0 - 支持本地图片');
    console.log('图床服务: Gitee');
    console.log('====================================');

    GM_addStyle(`
        .tieba-paste-progress-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 320px;
            max-height: 450px;
            overflow-y: auto;
            z-index: 10000;
        }
        .tieba-paste-progress-item {
            background: rgba(33, 33, 33, 0.96);
            border: 2px solid #4a90e2;
            border-radius: 10px;
            margin-bottom: 12px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            animation: slideInRight 0.3s ease-out;
        }
        .tieba-paste-progress-item.success {
            border-color: #52c41a;
        }
        .tieba-paste-progress-item.error {
            border-color: #f5222d;
        }
        .tieba-paste-preview-img {
            width: 100%;
            max-height: 80px;
            object-fit: contain;
            border-radius: 6px;
            margin-bottom: 10px;
            background: #222;
        }
        .tieba-paste-progress-bar {
            width: 100%;
            height: 24px;
            border-radius: 12px;
            overflow: hidden;
            background: #333;
            margin-top: 8px;
        }
        .tieba-paste-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2, #52c41a);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        .tieba-paste-status {
            color: #fff;
            font-size: 13px;
            margin-top: 8px;
            text-align: center;
        }
        .tieba-paste-file-info {
            color: #999;
            font-size: 11px;
            margin-top: 4px;
            text-align: center;
        }
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes tieba-hint-show {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `);

    async function compressImage(blob, maxSizeKB = CONFIG.MAX_SIZE_KB) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > CONFIG.MAX_WIDTH || height > CONFIG.MAX_HEIGHT) {
                    const ratio = Math.min(CONFIG.MAX_WIDTH / width, CONFIG.MAX_HEIGHT / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                let currentQuality = CONFIG.JPEG_QUALITY;
                let attempts = 0;

                const tryCompress = () => {
                    canvas.toBlob((resultBlob) => {
                        const sizeKB = resultBlob.size / 1024;

                        if (sizeKB <= maxSizeKB || attempts >= 5 || currentQuality <= 0.3) {
                            resolve(resultBlob);
                        } else {
                            attempts++;
                            currentQuality -= 0.1;
                            tryCompress();
                        }
                    }, 'image/jpeg', currentQuality);
                };

                tryCompress();
            };

            img.onerror = () => reject(new Error('图片加载失败'));
            reader.readAsDataURL(blob);
        });
    }

    function isLocalImage(blob) {
        return blob instanceof File;
    }

    async function uploadToImageBed(blob) {
        return new Promise((resolve, reject) => {
            // 生成唯一文件名
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 11);
            const filename = `${timestamp}_${random}.jpg`;
            const filepath = CONFIG.GITEE_PATH + filename;

            console.log('📤 上传到Gitee图床...');

            // 将 Blob 转换为 Base64
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // 去掉 data:image/jpeg;base64, 前缀

                // Gitee API 参数
                const apiUrl = `https://gitee.com/api/v5/repos/${CONFIG.GITEE_USERNAME}/${CONFIG.GITEE_REPO}/contents/${filepath}`;
                const requestData = {
                    access_token: CONFIG.GITEE_TOKEN,
                    content: base64,
                    message: `Upload image ${filename}`,
                    branch: CONFIG.GITEE_BRANCH
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: apiUrl,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(requestData),
                    onload: (response) => {
                        console.log('📥 图床响应状态:', response.status);
                        console.log('📥 图床响应内容:', response.responseText);

                        try {
                            const result = JSON.parse(response.responseText);

                            if (response.status === 201 && result.content) {
                                // Gitee raw 文件 URL
                                const imageUrl = `https://gitee.com/${CONFIG.GITEE_USERNAME}/${CONFIG.GITEE_REPO}/raw/${CONFIG.GITEE_BRANCH}/${filepath}`;
                                console.log('✓ 图床上传成功:', imageUrl);
                                resolve(imageUrl);
                            } else {
                                console.error('❌ 图床返回错误:', result.message || '未知错误');
                                reject(new Error(result.message || '图床上传失败'));
                            }
                        } catch (error) {
                            console.error('❌ 图床响应解析失败:', error);
                            console.error('原始响应:', response.responseText);
                            reject(new Error('图床响应解析失败'));
                        }
                    },
                    onerror: (error) => {
                        console.error('❌ 图床请求失败:', error);
                        reject(new Error('图床网络请求失败'));
                    }
                });
            };

            reader.onerror = () => {
                reject(new Error('图片读取失败'));
            };

            reader.readAsDataURL(blob);
        });
    }

    async function downloadFromImageBed(imageUrl) {
        return new Promise((resolve, reject) => {
            console.log('📥 从图床下载图片:', imageUrl);

            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer',
                onload: (response) => {
                    if (response.status === 200) {
                        console.log('✓ 图片下载成功');
                        // 手动创建 Blob，确保类型正确
                        const blob = new Blob([response.response], { type: 'image/jpeg' });
                        resolve(blob);
                    } else {
                        console.error('❌ 图片下载失败，状态码:', response.status);
                        reject(new Error('图片下载失败'));
                    }
                },
                onerror: (error) => {
                    console.error('❌ 图片下载请求失败:', error);
                    reject(new Error('图片下载失败'));
                }
            });
        });
    }

    async function uploadToTieba(blob) {
        return new Promise((resolve, reject) => {
            const fid = unsafeWindow.PageData?.forum?.id;
            const tbs = unsafeWindow.PageData?.tbs;

            if (!fid || !tbs) {
                reject(new Error('无法获取贴吧参数'));
                return;
            }

            const filename = `paste_${Date.now()}.jpg`;
            const formData = new FormData();
            formData.append('Filename', filename);
            formData.append('tbs', tbs);
            formData.append('fid', fid);
            formData.append('file', blob);

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.TIEBA_API}?is_wm=1`,
                data: formData,
                onload: (response) => {
                    try {
                        const result = JSON.parse(response.responseText);

                        if (result.err_no === 0 && result.info) {
                            const imageUrl = `https://tiebapic.baidu.com/tieba/pic/item/${result.info.pic_id_encode}.jpg`;
                            resolve({
                                url: imageUrl,
                                width: result.info.fullpic_width,
                                height: result.info.fullpic_height
                            });
                        } else {
                            reject(new Error(result.err_msg || '贴吧上传失败'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: () => reject(new Error('贴吧上传请求失败'))
            });
        });
    }

    function insertImageToEditor(editor, imageUrl, width, height) {
        let displayWidth = width;
        let displayHeight = height;

        if (displayWidth > 560) {
            displayHeight = Math.floor((560 / displayWidth) * displayHeight);
            displayWidth = 560;
        }

        const img = document.createElement('img');
        img.src = imageUrl;
        img.setAttribute('pic_type', '0');
        img.setAttribute('class', 'BDE_Image');
        img.setAttribute('width', displayWidth);
        img.setAttribute('height', displayHeight);

        insertAtCursor(editor, img);
    }

    function insertAtCursor(editor, element) {
        let doc, selection, range;

        if (editor.tagName === 'IFRAME') {
            doc = editor.contentDocument || editor.contentWindow.document;
            const win = editor.contentWindow;
            selection = win.getSelection();
        } else {
            doc = document;
            selection = window.getSelection();
        }

        if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);

            // 确保range在编辑器内
            const container = editor.tagName === 'IFRAME' ? doc.body : editor;
            if (container.contains(range.commonAncestorContainer) || container === range.commonAncestorContainer) {
                range.deleteContents();
                range.insertNode(element);

                // 添加换行
                const br = document.createElement('br');
                range.collapse(false);
                range.insertNode(br);

                // 移动光标到图片后面
                range.setStartAfter(br);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);

                console.log('✓ 图片已插入到光标位置');
                return;
            }
        }

        // 如果没有选区或选区不在编辑器内，则追加到末尾
        console.log('⚠ 无法获取光标位置，追加到末尾');
        const container = editor.tagName === 'IFRAME' ? doc.body : editor;
        container.appendChild(element);
        container.appendChild(document.createElement('br'));
    }

    function createProgressItem(imageDataURL) {
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'tieba-paste-progress-container';
            document.body.appendChild(progressContainer);
        }

        const item = document.createElement('div');
        item.className = 'tieba-paste-progress-item';

        const img = document.createElement('img');
        img.src = imageDataURL;
        img.className = 'tieba-paste-preview-img';

        const progressBar = document.createElement('div');
        progressBar.className = 'tieba-paste-progress-bar';

        const progressFill = document.createElement('div');
        progressFill.className = 'tieba-paste-progress-fill';
        progressFill.style.width = '0%';
        progressFill.textContent = '0%';

        const status = document.createElement('div');
        status.className = 'tieba-paste-status';
        status.textContent = '准备上传...';

        const fileInfo = document.createElement('div');
        fileInfo.className = 'tieba-paste-file-info';

        progressBar.appendChild(progressFill);
        item.appendChild(img);
        item.appendChild(progressBar);
        item.appendChild(status);
        item.appendChild(fileInfo);
        progressContainer.appendChild(item);

        return {
            updateProgress: (percent) => {
                progressFill.style.width = `${percent}%`;
                progressFill.textContent = `${Math.round(percent)}%`;
            },
            updateStatus: (text) => {
                status.textContent = text;
            },
            updateFileInfo: (text) => {
                fileInfo.textContent = text;
            },
            setSuccess: () => {
                item.classList.add('success');
                setTimeout(() => {
                    item.style.opacity = '0';
                    setTimeout(() => item.remove(), 500);
                }, 2500);
            },
            setError: () => {
                item.classList.add('error');
                setTimeout(() => {
                    item.style.opacity = '0';
                    setTimeout(() => item.remove(), 500);
                }, 5000);
            }
        };
    }

    async function handleImageUpload(blob, editor, uploadContext) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onload = async (e) => {
            const imageDataURL = e.target.result;
            const progressItem = createProgressItem(imageDataURL);
            const originalSizeKB = (blob.size / 1024).toFixed(2);

            progressItem.updateFileInfo(`原始: ${originalSizeKB}KB`);

            try {
                // 压缩图片
                progressItem.updateStatus('🔄 压缩中...');
                progressItem.updateProgress(30);
                const compressedBlob = await compressImage(blob);
                const compressedSizeKB = (compressedBlob.size / 1024).toFixed(2);
                progressItem.updateFileInfo(`压缩后: ${compressedSizeKB}KB`);

                // 上传到图床
                progressItem.updateStatus('📤 上传到图床...');
                progressItem.updateProgress(70);
                const imageBedUrl = await uploadToImageBed(compressedBlob);

                // 记录上传成功的URL
                progressItem.updateStatus('✓ 上传完成');
                progressItem.updateProgress(100);

                if (uploadContext) {
                    uploadContext.urls.push(imageBedUrl);
                    uploadContext.completed++;

                    // 检查是否所有图片都上传完成
                    if (uploadContext.completed === uploadContext.total) {
                        // 所有图片上传完成，复制所有URL
                        progressItem.updateStatus('📋 复制所有链接...');
                        await copyAllUrlsToClipboard(editor, uploadContext.urls);
                        progressItem.updateStatus('✓ 所有链接已复制');
                    }
                }

                progressItem.setSuccess();

            } catch (error) {
                console.error('❌ 上传失败:', error);
                progressItem.updateStatus(`❌ ${error.message}`);
                progressItem.setError();

                if (uploadContext) {
                    uploadContext.completed++;
                    uploadContext.failed++;

                    // 即使失败也要检查是否所有图片都处理完
                    if (uploadContext.completed === uploadContext.total) {
                        if (uploadContext.urls.length > 0) {
                            await copyAllUrlsToClipboard(editor, uploadContext.urls);
                        }
                    }
                }
            }
        };
    }

    // 复制所有URL到剪贴板
    async function copyAllUrlsToClipboard(editor, urls) {
        if (urls.length === 0) return;

        const urlText = urls.join('\n');

        try {
            await navigator.clipboard.writeText(urlText);
            console.log(`✓ 已复制 ${urls.length} 个图片链接到剪贴板`);

            // 聚焦编辑器
            let win;
            if (editor.tagName === 'IFRAME') {
                win = editor.contentWindow;
                win.focus();
                editor.contentDocument.body.focus();
            } else {
                window.focus();
                editor.focus();
            }

            // 显示提示
            showPasteHint(urls.length);

        } catch (error) {
            console.error('❌ 剪贴板写入失败:', error);
        }
    }

    // 将URL复制到剪贴板，提示用户手动粘贴
    async function simulatePasteURL(editor, url) {
        console.log('🔄 复制URL到剪贴板:', url);

        try {
            // 将URL写入系统剪贴板
            await navigator.clipboard.writeText(url);
            console.log('✓ URL已复制到剪贴板');

            // 聚焦编辑器
            let win;
            if (editor.tagName === 'IFRAME') {
                win = editor.contentWindow;
                win.focus();
                editor.contentDocument.body.focus();
            } else {
                window.focus();
                editor.focus();
            }

            // 显示醒目提示
            showPasteHint();

        } catch (error) {
            console.error('❌ 剪贴板写入失败:', error);
            throw error;
        }
    }

    // 显示粘贴提示
    function showPasteHint(imageCount = 1) {
        // 移除旧提示（如果存在）
        const oldHint = document.getElementById('tieba-paste-hint');
        if (oldHint) oldHint.remove();

        // 创建提示框
        const hint = document.createElement('div');
        hint.id = 'tieba-paste-hint';

        const countText = imageCount > 1 ? `${imageCount} 张图片已上传到图床！` : '图片已上传到图床！';
        const hintText = imageCount > 1 ? `${imageCount} 个链接已复制` : '链接已复制';

        hint.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
                ✅ ${countText}
            </div>
            <div style="font-size: 14px; color: #52c41a;">
                📋 ${hintText}，请按 <kbd style="background: #fff; color: #333; padding: 2px 6px; border-radius: 3px; border: 1px solid #ddd;">Ctrl+V</kbd> 粘贴到编辑器
            </div>
            <div style="font-size: 12px; color: #999; margin-top: 8px;">
                (手动粘贴可触发贴吧自动转换为图片)
            </div>
        `;

        Object.assign(hint.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(33, 33, 33, 0.98)',
            color: '#fff',
            padding: '24px 32px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            zIndex: '99999',
            textAlign: 'center',
            border: '2px solid #52c41a',
            animation: 'tieba-hint-show 0.3s ease-out',
            minWidth: '400px'
        });

        document.body.appendChild(hint);

        // 监听粘贴事件，粘贴后自动移除提示
        const handlePasteComplete = () => {
            setTimeout(() => {
                hint.style.opacity = '0';
                hint.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => hint.remove(), 300);
            }, 500);
            document.removeEventListener('paste', handlePasteComplete);
        };
        document.addEventListener('paste', handlePasteComplete);

        // 5秒后自动消失
        setTimeout(() => {
            if (hint.parentNode) {
                hint.style.opacity = '0';
                hint.style.transform = 'translate(-50%, -50%) scale(0.9)';
                setTimeout(() => hint.remove(), 300);
            }
            document.removeEventListener('paste', handlePasteComplete);
        }, 5000);
    }

    function handlePaste(e, editor) {
        const items = e.clipboardData?.items;
        if (!items) return;

        let hasImage = false;
        const images = [];

        // 收集所有图片
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf('image') !== -1) {
                hasImage = true;
                images.push(item.getAsFile());
            }
        }

        // 如果有图片，阻止默认行为并上传到图床
        if (hasImage) {
            e.preventDefault();
            e.stopPropagation();

            console.log(`📋 检测到 ${images.length} 张图片`);

            // 创建上传上下文，用于收集所有图片的URL
            const uploadContext = {
                total: images.length,
                completed: 0,
                failed: 0,
                urls: []
            };

            // 依次上传所有图片，传递uploadContext
            images.forEach((blob, index) => {
                console.log(`📤 开始上传第 ${index + 1}/${images.length} 张图片`);
                setTimeout(() => {
                    handleImageUpload(blob, editor, uploadContext);
                }, index * 500);  // 间隔500ms，避免同时触发多个paste事件
            });
        }
    }

    function attachPasteListener(editor) {
        if (editor._tiebaImagePasteAttached) return;
        editor._tiebaImagePasteAttached = true;
        editor.addEventListener('paste', (e) => handlePaste(e, editor), true);
    }

    function findAndInitEditors() {
        const selectors = [
            '#ueditor_replace',
            '.edui-editor-iframeholder iframe',
            '[contenteditable="true"]',
            '.j_quick_reply_editor',
            '.lzl_panel_wrap [contenteditable]',
            '#ueditor_0',
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(editor => {
                attachPasteListener(editor);
            });
        });
    }

    function init() {
        setTimeout(findAndInitEditors, 1000);

        const observer = new MutationObserver(findAndInitEditors);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
