// ==UserScript==
// @name         批量图片下载器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  批量下载页面图片，支持去重、打包ZIP下载，保留原文件名
// @author       upsky
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/548925/%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548925/%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isScriptEnabled = false;
    let scannedImages = new Set();
    let imageList = [];
    let panel = null;
    let floatingButton = null;

    // 从URL中提取文件名
    function extractFileName(url) {
        try {
            const urlObj = new URL(url);
            let pathname = urlObj.pathname;

            // 移除查询参数
            pathname = pathname.split('?')[0];

            // 获取文件名部分
            let filename = pathname.split('/').pop();

            // 如果没有文件名或者文件名为空
            if (!filename || filename === '') {
                filename = 'image';
            }

            // 如果没有扩展名，尝试从Content-Type或默认为jpg
            if (!filename.includes('.')) {
                filename += '.jpg';
            }

            // 清理文件名中的特殊字符
            filename = filename.replace(/[<>:"/\\|?*]/g, '_');

            // 限制文件名长度
            if (filename.length > 100) {
                const ext = filename.split('.').pop();
                const name = filename.substring(0, 100 - ext.length - 1);
                filename = name + '.' + ext;
            }

            return filename;
        } catch (error) {
            console.error('提取文件名失败:', error);
            return 'image.jpg';
        }
    }

    // 检查并处理重复文件名
    function getUniqueFileName(filename, existingNames) {
        let uniqueName = filename;
        let counter = 1;

        while (existingNames.has(uniqueName)) {
            const lastDotIndex = filename.lastIndexOf('.');
            if (lastDotIndex > 0) {
                const name = filename.substring(0, lastDotIndex);
                const ext = filename.substring(lastDotIndex);
                uniqueName = `${name}_${counter}${ext}`;
            } else {
                uniqueName = `${filename}_${counter}`;
            }
            counter++;
        }

        existingNames.add(uniqueName);
        return uniqueName;
    }

    // 创建浮动按钮
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'image-downloader-btn';
        button.innerHTML = '📷';
        button.style.cssText = `
            position: fixed !important;
            bottom: 50px !important;
            right: 20px !important;
            width: 50px !important;
            height: 50px !important;
            background: #007bff !important;
            color: white !important;
            border: 2px solid #0056b3 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 20px !important;
            z-index: 999999 !important;
            box-shadow: 0 4px 15px rgba(0,123,255,0.4) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
            user-select: none !important;
            font-family: Arial, sans-serif !important;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) !important';
            button.style.boxShadow = '0 6px 20px rgba(0,123,255,0.6) !important';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) !important';
            button.style.boxShadow = '0 4px 15px rgba(0,123,255,0.4) !important';
        });

        button.addEventListener('click', togglePanel);

        document.body.appendChild(button);
        return button;
    }

    // 创建主界面
    function createUI() {
        const panelContainer = document.createElement('div');
        panelContainer.id = 'image-downloader-panel';
        panelContainer.style.cssText = `
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 400px !important;
            min-height: 70vh !important;
            background: #ffffff !important;
            border: 2px solid #007bff !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
            z-index: 999998 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: none !important;
            overflow: hidden !important;
        `;

        panelContainer.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #007bff, #0056b3) !important;
                color: white !important;
                padding: 16px !important;
                font-weight: bold !important;
                text-align: center !important;
                position: relative !important;
                font-size: 16px !important;
            ">
                🖼️ 批量图片下载器 v1.2
                <button id="close-panel" style="
                    position: absolute !important;
                    right: 12px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    background: rgba(255,255,255,0.2) !important;
                    border: none !important;
                    color: white !important;
                    font-size: 20px !important;
                    cursor: pointer !important;
                    width: 28px !important;
                    height: 28px !important;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                ">×</button>
            </div>

            <div style="padding: 20px !important; background: white !important;">
                <div style="margin-bottom: 16px !important;">
                    <button id="toggle-script" style="
                        width: 100% !important;
                        padding: 12px !important;
                        background: #28a745 !important;
                        color: white !important;
                        border: none !important;
                        border-radius: 6px !important;
                        cursor: pointer !important;
                        font-size: 14px !important;
                        font-weight: bold !important;
                        margin-bottom: 12px !important;
                        transition: background 0.3s ease !important;
                    ">🔧 启用脚本</button>

                    <div style="display: flex !important; gap: 8px !important;">
                        <button id="scan-images" style="
                            flex: 1 !important;
                            padding: 10px !important;
                            background: #17a2b8 !important;
                            color: white !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 13px !important;
                            font-weight: bold !important;
                        " disabled>🔍 扫描图片</button>

                        <button id="clear-images" style="
                            flex: 1 !important;
                            padding: 10px !important;
                            background: #ffc107 !important;
                            color: #212529 !important;
                            border: none !important;
                            border-radius: 6px !important;
                            cursor: pointer !important;
                            font-size: 13px !important;
                            font-weight: bold !important;
                        " disabled>🗑️ 清空</button>
                    </div>
                </div>

                <div style="margin-bottom: 16px !important;">
                    <div style="
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        margin-bottom: 12px !important;
                        padding: 8px 12px !important;
                        background: #f8f9fa !important;
                        border-radius: 6px !important;
                    ">
                        <span style="font-size: 14px !important; font-weight: bold !important; color: #495057 !important;">
                            📊 已扫描: <span id="image-count" style="color: #007bff !important;">0</span> 张
                        </span>
                        <button id="select-all" style="
                            padding: 6px 12px !important;
                            background: #6c757d !important;
                            color: white !important;
                            border: none !important;
                            border-radius: 4px !important;
                            cursor: pointer !important;
                            font-size: 12px !important;
                            font-weight: bold !important;
                        " disabled>☑️ 全选</button>
                    </div>

                    <div id="image-list" style="
                        max-height: 300px !important;
                        overflow-y: auto !important;
                        border: 2px solid #e9ecef !important;
                        border-radius: 8px !important;
                        padding: 8px !important;
                        background: #fafafa !important;
                    "></div>
                </div>

                <button id="download-selected" style="
                    width: 100% !important;
                    padding: 14px !important;
                    background: #dc3545 !important;
                    color: white !important;
                    border: none !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                    font-size: 15px !important;
                    font-weight: bold !important;
                    transition: background 0.3s ease !important;
                " disabled>📦 下载选中图片</button>

                <div id="progress-container" style="
                    margin-top: 16px !important;
                    display: none !important;
                    padding: 12px !important;
                    background: #f8f9fa !important;
                    border-radius: 8px !important;
                    border: 1px solid #dee2e6 !important;
                ">
                    <div style="margin-bottom: 8px !important; font-size: 13px !important; font-weight: bold !important; color: #495057 !important;" id="progress-text">准备下载...</div>
                    <div style="
                        width: 100% !important;
                        height: 24px !important;
                        background: #e9ecef !important;
                        border-radius: 12px !important;
                        overflow: hidden !important;
                        border: 1px solid #dee2e6 !important;
                    ">
                        <div id="progress-bar" style="
                            height: 100% !important;
                            background: linear-gradient(90deg, #007bff, #0056b3) !important;
                            width: 0% !important;
                            transition: width 0.3s ease !important;
                            border-radius: 12px !important;
                        "></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panelContainer);
        return panelContainer;
    }

    // 切换面板显示
    function togglePanel() {
        if (!panel) return;

        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            panel.style.zIndex = '999998';
        }
    }

    // 扫描页面图片
    function scanImages() {
        const images = document.querySelectorAll('img');
        let newImagesCount = 0;

        images.forEach(img => {
            if (img.src && img.src.startsWith('http') && !scannedImages.has(img.src)) {
                // 检查图片尺寸，过滤掉太小的图片
                if (img.naturalWidth > 50 && img.naturalHeight > 50) {
                    scannedImages.add(img.src);

                    // 提取原始文件名
                    const originalFileName = extractFileName(img.src);

                    imageList.push({
                        src: img.src,
                        alt: img.alt || originalFileName,
                        fileName: originalFileName,
                        selected: false
                    });
                    newImagesCount++;
                }
            }
        });

        updateImageList();
        showNotification(newImagesCount > 0 ? `🎉 发现 ${newImagesCount} 张新图片` : '😅 未发现新图片');
    }

    // 更新图片列表显示
    function updateImageList() {
        const imageListElement = document.getElementById('image-list');
        const imageCountElement = document.getElementById('image-count');

        if (!imageListElement || !imageCountElement) return;

        imageCountElement.textContent = imageList.length;
        imageListElement.innerHTML = '';

        if (imageList.length === 0) {
            imageListElement.innerHTML = `
                <div style="
                    text-align: center !important;
                    padding: 40px 20px !important;
                    color: #6c757d !important;
                    font-size: 14px !important;
                ">
                    📷 暂无图片<br>
                    <small style="color: #adb5bd !important;">点击"扫描图片"开始搜索</small>
                </div>
            `;
        } else {
            imageList.forEach((image, index) => {
                const imageItem = document.createElement('div');
                imageItem.style.cssText = `
                    display: flex !important;
                    align-items: center !important;
                    padding: 10px !important;
                    margin-bottom: 8px !important;
                    border: 1px solid ${image.selected ? '#007bff' : '#e9ecef'} !important;
                    border-radius: 8px !important;
                    background: ${image.selected ? '#e3f2fd' : '#ffffff'} !important;
                    transition: all 0.2s ease !important;
                    cursor: pointer !important;
                `;

                imageItem.innerHTML = `
                    <input type="checkbox" ${image.selected ? 'checked' : ''}
                           style="
                               margin-right: 12px !important;
                               transform: scale(1.2) !important;
                               cursor: pointer !important;
                           ">
                    <img src="${image.src}" style="
                        width: 50px !important;
                        height: 50px !important;
                        object-fit: cover !important;
                        border-radius: 6px !important;
                        margin-right: 12px !important;
                        border: 2px solid #e9ecef !important;
                    " onerror="this.style.display='none'">
                    <div style="flex: 1 !important; font-size: 12px !important; overflow: hidden !important;">
                        <div style="font-weight: bold !important; margin-bottom: 4px !important; color: #495057 !important;">
                            📄 ${image.fileName}
                        </div>
                        <div style="color: #28a745 !important; font-size: 11px !important; margin-bottom: 2px !important;">
                            原文件名: ${image.fileName}
                        </div>
                        <div style="color: #6c757d !important; word-break: break-all !important; font-size: 10px !important;">
                            ${image.src.length > 50 ? image.src.substring(0, 50) + '...' : image.src}
                        </div>
                    </div>
                `;

                // 点击整个项目来切换选择状态
                imageItem.addEventListener('click', () => {
                    imageList[index].selected = !imageList[index].selected;
                    updateImageList();
                });

                imageListElement.appendChild(imageItem);
            });
        }

        updateButtonStates();
    }

    // 更新按钮状态
    function updateButtonStates() {
        const hasImages = imageList.length > 0;
        const hasSelected = imageList.some(img => img.selected);
        const allSelected = imageList.length > 0 && imageList.every(img => img.selected);

        const clearBtn = document.getElementById('clear-images');
        const selectAllBtn = document.getElementById('select-all');
        const downloadBtn = document.getElementById('download-selected');

        if (clearBtn) clearBtn.disabled = !hasImages;
        if (selectAllBtn) {
            selectAllBtn.disabled = !hasImages;
            selectAllBtn.textContent = allSelected ? '❌ 取消全选' : '☑️ 全选';
        }
        if (downloadBtn) downloadBtn.disabled = !hasSelected;
    }

    // 全选/取消全选
    function toggleSelectAll() {
        const allSelected = imageList.every(img => img.selected);
        imageList.forEach(img => {
            img.selected = !allSelected;
        });
        updateImageList();
    }

    // 下载选中的图片
    async function downloadSelectedImages() {
        const selectedImages = imageList.filter(img => img.selected);

        if (selectedImages.length === 0) {
            showNotification('⚠️ 请先选择要下载的图片');
            return;
        }

        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (!progressContainer || !progressBar || !progressText) return;

        progressContainer.style.display = 'block';
        progressText.textContent = '🚀 准备下载...';
        progressBar.style.width = '0%';

        const zip = new JSZip();
        const usedFileNames = new Set();
        let completed = 0;

        try {
            for (let i = 0; i < selectedImages.length; i++) {
                const image = selectedImages[i];
                progressText.textContent = `📥 下载图片 ${i + 1}/${selectedImages.length} - ${image.fileName}`;

                try {
                    const response = await fetch(image.src);
                    const blob = await response.blob();

                    // 使用原始文件名，如果重复则添加序号
                    const uniqueFileName = getUniqueFileName(image.fileName, usedFileNames);

                    zip.file(uniqueFileName, blob);
                    completed++;

                    const progress = (completed / selectedImages.length) * 80;
                    progressBar.style.width = progress + '%';
                } catch (error) {
                    console.error('下载图片失败:', image.src, error);
                    // 即使下载失败也要添加文件名到已使用列表，避免序号混乱
                    getUniqueFileName(image.fileName, usedFileNames);
                }
            }

            progressText.textContent = '📦 正在打包ZIP文件...';
            progressBar.style.width = '90%';

            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6
                }
            });

            progressText.textContent = '✅ 下载完成！';
            progressBar.style.width = '100%';

            // 创建下载链接
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = `images_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.zip`;
            link.click();

            setTimeout(() => {
                progressContainer.style.display = 'none';
                URL.revokeObjectURL(link.href);
            }, 3000);

            showNotification(`🎉 成功下载 ${completed} 张图片，保留原文件名`);

        } catch (error) {
            console.error('打包失败:', error);
            showNotification('❌ 下载失败，请重试');
            progressContainer.style.display = 'none';
        }
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed !important;
            top: 80px !important;
            right: 430px !important;
            background: #333 !important;
            color: white !important;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            z-index: 999999 !important;
            font-size: 14px !important;
            font-weight: bold !important;
            max-width: 300px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }

    // 绑定事件
    function bindEvents() {
        // 关闭面板
        const closeBtn = document.getElementById('close-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.style.display = 'none';
            });
        }

        // 启用/禁用脚本
        const toggleBtn = document.getElementById('toggle-script');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                isScriptEnabled = !isScriptEnabled;
                const scanButton = document.getElementById('scan-images');

                if (isScriptEnabled) {
                    toggleBtn.textContent = '🔧 禁用脚本';
                    toggleBtn.style.background = '#dc3545';
                    if (scanButton) scanButton.disabled = false;
                    showNotification('✅ 脚本已启用');
                } else {
                    toggleBtn.textContent = '🔧 启用脚本';
                    toggleBtn.style.background = '#28a745';
                    if (scanButton) scanButton.disabled = true;
                    showNotification('⏸️ 脚本已禁用');
                }
            });
        }

        // 扫描图片
        const scanBtn = document.getElementById('scan-images');
        if (scanBtn) {
            scanBtn.addEventListener('click', scanImages);
        }

        // 清空列表
        const clearBtn = document.getElementById('clear-images');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                imageList = [];
                scannedImages.clear();
                updateImageList();
                showNotification('🗑️ 已清空图片列表');
            });
        }

        // 全选
        const selectAllBtn = document.getElementById('select-all');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', toggleSelectAll);
        }

        // 下载选中图片
        const downloadBtn = document.getElementById('download-selected');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadSelectedImages);
        }
    }

    // 初始化
    function init() {
        setTimeout(() => {
            floatingButton = createFloatingButton();
            panel = createUI();
            bindEvents();

            console.log('🎉 批量图片下载器 v1.2 已加载');

            setTimeout(() => {
                showNotification('🎉 图片下载器已就绪！支持保留原文件名');
            }, 1000);
        }, 1000);
    }

    // 确保在页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
