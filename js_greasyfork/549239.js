// ==UserScript==
// @name         图片批量修改自定义尺寸和颜色的背景(树洞先生)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  为图片批量添加自定义尺寸和颜色的背景，支持多种格式
// @author       树洞先生
// @match        *://*/*
// @license      MIT
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/549239/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%BA%E5%AF%B8%E5%92%8C%E9%A2%9C%E8%89%B2%E7%9A%84%E8%83%8C%E6%99%AF%28%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549239/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B0%BA%E5%AF%B8%E5%92%8C%E9%A2%9C%E8%89%B2%E7%9A%84%E8%83%8C%E6%99%AF%28%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建工具界面
    function createToolInterface() {
        // 检查是否已存在工具
        if (document.getElementById('whiteBackgroundTool')) {
            return;
        }

        // 创建主容器
        const toolContainer = document.createElement('div');
        toolContainer.id = 'whiteBackgroundTool';
        toolContainer.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                font-family: Arial, sans-serif;
                display: none;
            ">
                <div style="
                    background: #4CAF50;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">✅</span>
                        <span style="font-weight: bold;">批量添加白色背景</span>
                    </div>
                    <button id="closeTool" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0;
                        width: 24px;
                        height: 24px;
                    ">×</button>
                </div>

                <div style="padding: 16px;">
                    <!-- 功能说明 -->
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <span style="font-size: 14px;">📋</span>
                            <span style="font-weight: bold; font-size: 14px;">功能说明:</span>
                        </div>
                        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #666; line-height: 1.4;">
                            <li>创建自定义尺寸白色背景</li>
                            <li>图片自动居中放置</li>
                            <li>保持原图宽高比</li>
                            <li>支持JPG、PNG、BMP等格式</li>
                        </ul>
                    </div>

                    <!-- 自定义设置 -->
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 14px;">⚙️</span>
                            <span style="font-weight: bold; font-size: 14px;">自定义设置:</span>
                        </div>

                        <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 3px solid #4CAF50;">
                            <!-- 尺寸设置 -->
                            <div style="display: flex; gap: 12px; margin-bottom: 10px;">
                                <div style="flex: 1;">
                                    <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #666;">宽度 (px)</label>
                                    <input type="number" id="canvasWidth" value="800" min="100" max="4000" style="
                                        width: 100%;
                                        padding: 6px 8px;
                                        border: 1px solid #ddd;
                                        border-radius: 4px;
                                        font-size: 13px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                                <div style="flex: 1;">
                                    <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #666;">高度 (px)</label>
                                    <input type="number" id="canvasHeight" value="800" min="100" max="4000" style="
                                        width: 100%;
                                        padding: 6px 8px;
                                        border: 1px solid #ddd;
                                        border-radius: 4px;
                                        font-size: 13px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                            </div>

                            <!-- 颜色设置 -->
                            <div>
                                <label style="display: block; margin-bottom: 4px; font-size: 12px; color: #666;">背景颜色</label>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="color" id="backgroundColor" value="#ffffff" style="
                                        width: 36px;
                                        height: 32px;
                                        border: 1px solid #ddd;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        padding: 0;
                                    ">
                                    <input type="text" id="backgroundColorText" value="#ffffff" placeholder="#ffffff" style="
                                        flex: 1;
                                        padding: 6px 8px;
                                        border: 1px solid #ddd;
                                        border-radius: 4px;
                                        font-size: 13px;
                                        font-family: monospace;
                                        box-sizing: border-box;
                                    ">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 文件选择 -->
                    <div style="margin-bottom: 16px;">
                        <label style="
                            display: block;
                            margin-bottom: 8px;
                            font-weight: bold;
                            color: #333;
                            font-size: 14px;
                        ">选择图片文件:</label>
                        <input type="file" id="imageInput" multiple accept="image/*" style="
                            width: 100%;
                            padding: 8px;
                            border: 2px dashed #ddd;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 13px;
                            box-sizing: border-box;
                        ">
                    </div>

                    <!-- 文件列表 -->
                    <div id="fileList" style="
                        max-height: 120px;
                        overflow-y: auto;
                        margin-bottom: 16px;
                        padding: 8px;
                        background: #f9f9f9;
                        border-radius: 5px;
                        font-size: 12px;
                        display: none;
                        border: 1px solid #eee;
                    "></div>

                    <!-- 操作按钮 -->
                    <div style="display: flex; gap: 10px;">
                        <button id="processImages" disabled style="
                            flex: 1;
                            padding: 10px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-weight: bold;
                            font-size: 14px;
                        ">🚀 开始处理</button>

                        <button id="clearImages" disabled style="
                            padding: 10px 16px;
                            background: #ff4444;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                        ">🗑️ 清空</button>
                    </div>

                    <!-- 进度条 -->
                    <div id="progressContainer" style="
                        margin-top: 16px;
                        display: none;
                    ">
                        <div style="margin-bottom: 8px;">
                            <span id="progressText" style="font-size: 13px; color: #666;">处理中...</span>
                        </div>
                        <div style="
                            width: 100%;
                            height: 8px;
                            background: #eee;
                            border-radius: 4px;
                            overflow: hidden;
                        ">
                            <div id="progressBar" style="
                                height: 100%;
                                background: #4CAF50;
                                width: 0%;
                                transition: width 0.3s;
                            "></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(toolContainer);

        // 绑定事件
        bindEvents();
    }

    // 绑定事件处理
    function bindEvents() {
        const toolPanel = document.querySelector('#whiteBackgroundTool > div');
        const closeBtn = document.getElementById('closeTool');
        const imageInput = document.getElementById('imageInput');
        const processBtn = document.getElementById('processImages');
        const clearBtn = document.getElementById('clearImages');
        const fileList = document.getElementById('fileList');

        // 背景设置相关元素
        const canvasWidth = document.getElementById('canvasWidth');
        const canvasHeight = document.getElementById('canvasHeight');
        const backgroundColor = document.getElementById('backgroundColor');
        const backgroundColorText = document.getElementById('backgroundColorText');

        let selectedFiles = [];

        // 关闭工具
        closeBtn.addEventListener('click', () => {
            toolPanel.style.display = 'none';
        });

        // 颜色选择器和文本框同步
        backgroundColor.addEventListener('input', (e) => {
            backgroundColorText.value = e.target.value;
        });

        backgroundColorText.addEventListener('input', (e) => {
            const color = e.target.value;
            if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                backgroundColor.value = color;
            }
        });

        // 文件选择
        imageInput.addEventListener('change', (e) => {
            selectedFiles = Array.from(e.target.files);
            updateFileList(selectedFiles);
            processBtn.disabled = selectedFiles.length === 0;
            clearBtn.disabled = selectedFiles.length === 0;
        });

        // 清空文件
        clearBtn.addEventListener('click', () => {
            selectedFiles = [];
            imageInput.value = '';
            updateFileList(selectedFiles);
            processBtn.disabled = true;
            clearBtn.disabled = true;
        });

        // 处理图片
        processBtn.addEventListener('click', () => {
            if (selectedFiles.length > 0) {
                const settings = {
                    width: parseInt(canvasWidth.value) || 800,
                    height: parseInt(canvasHeight.value) || 800,
                    backgroundColor: backgroundColor.value || '#ffffff'
                };
                processImages(selectedFiles, settings);
            }
        });

        // 更新文件列表显示
        function updateFileList(files) {
            if (files.length === 0) {
                fileList.style.display = 'none';
                return;
            }

            fileList.style.display = 'block';
            fileList.innerHTML = `
                <strong>已选择 ${files.length} 个文件：</strong><br>
                ${files.map((file, index) =>
                    `${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
                ).join('<br>')}
            `;
        }
    }

    // 处理图片主函数
    async function processImages(files, settings) {
        const progressContainer = document.getElementById('progressContainer');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const processBtn = document.getElementById('processImages');

        // 显示进度条
        progressContainer.style.display = 'block';
        processBtn.disabled = true;

        const zip = new JSZip();
        const processedImages = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // 更新进度
            const progress = ((i + 1) / files.length) * 100;
            progressBar.style.width = progress + '%';
            progressText.textContent = `处理中... ${i + 1}/${files.length} - ${file.name}`;

            try {
                const processedImageBlob = await addWhiteBackground(file, settings);
                const fileName = getOutputFileName(file.name);

                zip.file(fileName, processedImageBlob);
                processedImages.push(fileName);

            } catch (error) {
                console.error(`处理文件 ${file.name} 时出错:`, error);
            }

            // 添加延迟，避免浏览器卡顿
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // 生成并下载ZIP文件
        progressText.textContent = '生成下载文件...';
        try {
            const zipBlob = await zip.generateAsync({type: 'blob'});
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const zipName = `processed_images_${settings.width}x${settings.height}_${timestamp}.zip`;
            saveAs(zipBlob, zipName);

            progressText.textContent = `✅ 完成！已处理 ${processedImages.length} 张图片`;
            setTimeout(() => {
                progressContainer.style.display = 'none';
                processBtn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('生成ZIP文件出错:', error);
            progressText.textContent = '❌ 下载失败，请重试';
            processBtn.disabled = false;
        }
    }

    // 为单张图片添加背景
    function addWhiteBackground(file, settings) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = function() {
                // 设置画布尺寸
                canvas.width = settings.width;
                canvas.height = settings.height;

                // 填充背景颜色
                ctx.fillStyle = settings.backgroundColor;
                ctx.fillRect(0, 0, settings.width, settings.height);

                // 计算图片缩放比例（保持宽高比）
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;
                const scale = Math.min(settings.width / imgWidth, settings.height / imgHeight);

                // 计算绘制尺寸和位置
                const drawWidth = imgWidth * scale;
                const drawHeight = imgHeight * scale;
                const x = (settings.width - drawWidth) / 2;
                const y = (settings.height - drawHeight) / 2;

                // 绘制图片（居中）
                ctx.drawImage(img, x, y, drawWidth, drawHeight);

                // 转换为Blob
                canvas.toBlob(resolve, 'image/jpeg', 0.95);
            };

            img.onerror = () => reject(new Error('图片加载失败'));

            // 读取文件
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsDataURL(file);
        });
    }

    // 生成输出文件名
    function getOutputFileName(originalName) {
        const lastDotIndex = originalName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return `${originalName}_with_bg.jpg`;
        }

        const name = originalName.substring(0, lastDotIndex);
        return `${name}_with_bg.jpg`;
    }

    // 创建启动按钮
    function createLaunchButton() {
        const button = document.createElement('div');
        button.innerHTML = '🖼️';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', () => {
            createToolInterface();
            const toolPanel = document.querySelector('#whiteBackgroundTool > div');
            toolPanel.style.display = toolPanel.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(button);
    }

    // 等待页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createLaunchButton);
    } else {
        createLaunchButton();
    }

})();