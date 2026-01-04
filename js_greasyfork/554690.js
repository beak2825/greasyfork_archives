// ==UserScript==
// @name         天津百分网人脸验证拦截器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  拦截并修改人脸验证请求，替换图片数据并自动化人脸识别流程，实现自动化刷课
// @author       YourName
// @match        https://*tj.100.wang/*
// @match        https://*.baifenwang.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554690/%E5%A4%A9%E6%B4%A5%E7%99%BE%E5%88%86%E7%BD%91%E4%BA%BA%E8%84%B8%E9%AA%8C%E8%AF%81%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554690/%E5%A4%A9%E6%B4%A5%E7%99%BE%E5%88%86%E7%BD%91%E4%BA%BA%E8%84%B8%E9%AA%8C%E8%AF%81%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储原始的fetch函数
    const originalFetch = window.fetch;

    // 拦截计数和状态
    let interceptCount = 0;
    let successCount = 0;
    let failCount = 0;
    let uploadedFileName = "";
    let originalImage = null;
    let autoProcessEnabled = true; // 默认开启自动处理

    // 自动化流程状态
    const autoSteps = {
        modalDetected: false,
        cameraOpened: false,
        photoTaken: false,
        comparisonStarted: false
    };

    // 控制台日志增强
    const logger = {
        info: function(message, ...args) {
            console.log(`%c📢 [拦截器信息] ${message}`, 'color: #3498db; font-weight: bold;', ...args);
            addLog(message, 'info');
        },
        success: function(message, ...args) {
            console.log(`%c✅ [拦截器成功] ${message}`, 'color: #2ecc71; font-weight: bold;', ...args);
            addLog(message, 'success');
        },
        warning: function(message, ...args) {
            console.warn(`%c⚠️ [拦截器警告] ${message}`, 'color: #f39c12; font-weight: bold;', ...args);
            addLog(message, 'warning');
        },
        error: function(message, ...args) {
            console.error(`%c❌ [拦截器错误] ${message}`, 'color: #e74c3c; font-weight: bold;', ...args);
            addLog(message, 'error');
        },
        debug: function(message, ...args) {
            console.debug(`%c🔍 [拦截器调试] ${message}`, 'color: #9b59b6; font-weight: bold;', ...args);
            addLog(message, 'debug');
        }
    };

    // CSS样式 - 蓝白配色
    const styles = `
        /* 悬浮容器样式 */
        #interceptor-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: rgba(240, 248, 255, 0.95);
            border: 1px solid #a0cbe8;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 131, 255, 0.2);
            z-index: 99999;
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #2c3e50;
            overflow: hidden;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            font-size: 12px;
        }

        /* 头部样式 */
        #interceptor-header {
            background: linear-gradient(to right, #3498db, #2980b9);
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #a0cbe8;
            cursor: move;
        }

        #interceptor-title {
            font-size: 14px;
            font-weight: bold;
            color: #fff;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.3);
        }

        #interceptor-controls {
            display: flex;
            gap: 8px;
        }

        .interceptor-btn {
            background: rgba(255, 255, 255, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 11px;
        }

        .interceptor-btn:hover {
            background: rgba(255, 255, 255, 0.4);
        }

        /* 主体样式 */
        #interceptor-body {
            padding: 12px;
            overflow-y: auto;
            flex-grow: 1;
        }

        .interceptor-section {
            margin-bottom: 15px;
        }

        .section-title {
            font-size: 13px;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #a0cbe8;
            color: #3498db;
            font-weight: bold;
        }

        /* 图片上传区域 */
        #image-upload-area {
            border: 2px dashed #3498db;
            border-radius: 6px;
            padding: 15px;
            text-align: center;
            margin-bottom: 12px;
            background: rgba(52, 152, 219, 0.05);
            cursor: pointer;
            transition: all 0.3s;
        }

        #image-upload-area:hover {
            background: rgba(52, 152, 219, 0.1);
        }

        #image-upload-text {
            font-size: 12px;
            margin-bottom: 8px;
            color: #3498db;
        }

        #file-name-display {
            max-width: 100%;
            background: rgba(52, 152, 219, 0.1);
            padding: 6px;
            border-radius: 4px;
            word-break: break-all;
            color: #2980b9;
            font-size: 11px;
            display: none;
        }

        /* 状态显示 */
        #status-display {
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
        }

        .status-item {
            flex: 1;
            text-align: center;
            padding: 8px 5px;
            background: rgba(52, 152, 219, 0.1);
            border-radius: 4px;
        }

        .status-value {
            font-size: 16px;
            font-weight: bold;
            color: #3498db;
        }

        .status-label {
            font-size: 10px;
            color: #7f8c8d;
            margin-top: 2px;
        }

        /* 自动化选项 */
        #auto-process-container {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: rgba(52, 152, 219, 0.1);
            border-radius: 4px;
        }

        #auto-process-toggle {
            margin-right: 8px;
        }

        #auto-process-label {
            font-size: 12px;
            color: #2980b9;
        }

        /* 日志容器 */
        #log-container {
            background: rgba(236, 240, 241, 0.8);
            border-radius: 4px;
            padding: 8px;
            max-height: 150px;
            overflow-y: auto;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 11px;
            border: 1px solid #a0cbe8;
        }

        .log-entry {
            margin-bottom: 6px;
            padding: 3px 5px;
            border-radius: 3px;
            background: rgba(255, 255, 255, 0.7);
        }

        .log-timestamp {
            color: #95a5a6;
            margin-right: 8px;
            font-size: 10px;
        }

        .log-info {
            color: #3498db;
        }

        .log-success {
            color: #2ecc71;
        }

        .log-warning {
            color: #f39c12;
        }

        .log-error {
            color: #e74c3c;
        }

        .log-debug {
            color: #9b59b6;
        }

        /* 响应显示 */
        #response-display {
            background: rgba(236, 240, 241, 0.8);
            border-radius: 4px;
            padding: 8px;
            max-height: 120px;
            overflow-y: auto;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 11px;
            white-space: pre-wrap;
            color: #34495e;
            border: 1px solid #a0cbe8;
        }

        /* 切换按钮 */
        #toggle-container {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(240, 248, 255, 0.95);
            border: 1px solid #a0cbe8;
            border-radius: 4px;
            padding: 3px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
            z-index: 99998;
        }

        #toggle-btn {
            background: linear-gradient(to right, #3498db, #2980b9);
            border: none;
            color: white;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }

        .hidden {
            display: none !important;
        }

        /* 自动化进度 */
        #auto-steps {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 12px;
        }

        .auto-step {
            display: flex;
            align-items: center;
            padding: 5px;
            background: rgba(236, 240, 241, 0.8);
            border-radius: 3px;
            font-size: 11px;
        }

        .step-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
            background-color: #95a5a6;
        }

        .step-complete .step-indicator {
            background-color: #2ecc71;
        }

        .step-pending .step-indicator {
            background-color: #f39c12;
        }

        .step-waiting .step-indicator {
            background-color: #95a5a6;
        }
    `;

    // 修改图片生成随机变化的Base64
    function generateRandomizedImage(originalBase64) {
        return new Promise((resolve, reject) => {
            // 确保输入是有效的 Base64 图片
            if (!originalBase64 || !originalBase64.includes('base64,')) {
                reject(new Error('无效的图片数据'));
                return;
            }

            const img = new Image();
            img.onload = function() {
                // 创建一个画布
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // 绘制原始图片
                ctx.drawImage(img, 0, 0);

                // 随机添加轻微变化
                const randomizeImage = () => {
                    // 获取图片数据
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    // 随机修改几个像素
                    for (let i = 0; i < 20; i++) {
                        const randomX = Math.floor(Math.random() * canvas.width);
                        const randomY = Math.floor(Math.random() * canvas.height);
                        const pixelIndex = (randomY * canvas.width + randomX) * 4;

                        // 轻微改变RGB值，保持Alpha不变
                        if (pixelIndex + 3 < data.length) {
                            data[pixelIndex] = Math.min(255, Math.max(0, data[pixelIndex] + Math.floor(Math.random() * 3) - 1));
                            data[pixelIndex + 1] = Math.min(255, Math.max(0, data[pixelIndex + 1] + Math.floor(Math.random() * 3) - 1));
                            data[pixelIndex + 2] = Math.min(255, Math.max(0, data[pixelIndex + 2] + Math.floor(Math.random() * 3) - 1));
                        }
                    }

                    // 在图片角落添加当前时间戳（几乎不可见）
                    const timestamp = Date.now().toString();
                    ctx.fillStyle = 'rgba(255,255,255,0.01)'; // 几乎透明
                    ctx.font = '1px Arial';
                    ctx.fillText(timestamp, canvas.width - 20, canvas.height - 1);

                    // 应用修改后的图像数据
                    ctx.putImageData(imageData, 0, 0);

                    // 返回新的Base64编码
                    const quality = 0.92 + (Math.random() * 0.07); // 92-99% 质量的随机值
                    return canvas.toDataURL('image/jpeg', quality);
                };

                // 生成随机化的图像
                const randomizedBase64 = randomizeImage();
                logger.debug("生成了随机化图片");
                resolve(randomizedBase64);
            };

            img.onerror = function() {
                reject(new Error('图片加载失败'));
            };

            img.src = originalBase64;
        });
    }

    // 自动化处理人脸识别流程
    function setupAutoProcessing() {
        // 监控人脸识别窗口
        const modalObserver = new MutationObserver((mutations) => {
            const modal = document.querySelector('body > div:nth-child(9) > div > div.ant-modal-wrap > div > div.ant-modal-content');
            if (modal && !autoSteps.modalDetected) {
                autoSteps.modalDetected = true;
                updateAutoStepsDisplay();
                logger.success('检测到人脸识别窗口');

                if (autoProcessEnabled) {
                    // 点击开启摄像头
                    setTimeout(() => {
                        const openCameraButton = document.querySelector('body > div:nth-child(9) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-body > div > div > div.face_btn > span');
                        if (openCameraButton) {
                            openCameraButton.click();
                            autoSteps.cameraOpened = true;
                            updateAutoStepsDisplay();
                            logger.success('已点击开启摄像头');

                            // 点击拍照
                            setTimeout(() => {
                                const takePhotoButton = document.querySelector('body > div:nth-child(9) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-body > div > div > div.face_btn > span');
                                if (takePhotoButton) {
                                    takePhotoButton.click();
                                    autoSteps.photoTaken = true;
                                    updateAutoStepsDisplay();
                                    logger.success('已点击拍照');

                                    // 点击开始对比
                                    setTimeout(() => {
                                        const compareButton = document.querySelector('body > div:nth-child(9) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-body > div > div > div.face_btn > span.face_btns.btn_contrast.btn_fill');
                                        if (compareButton) {
                                            compareButton.click();
                                            autoSteps.comparisonStarted = true;
                                            updateAutoStepsDisplay();
                                            logger.success('已点击开始对比，等待拦截绕过');
                                        } else {
                                            logger.error('找不到开始对比按钮');
                                        }
                                    }, 1000);
                                } else {
                                    logger.error('找不到拍照按钮');
                                }
                            }, 1500);
                        } else {
                            logger.error('等待人脸识别窗口出现');
                        }
                    }, 800);
                } else {
                    logger.info('自动处理已禁用，请手动操作');
                }
            } else if (!modal && autoSteps.modalDetected) {
                // 重置状态，为下次识别做准备
                resetAutoSteps();
                logger.info('人脸识别窗口已关闭');
            }
        });

        // 观察整个页面的变化
        modalObserver.observe(document.body, { childList: true, subtree: true });
        logger.info('已设置自动化处理监控');
    }

    // 重置自动化步骤状态
    function resetAutoSteps() {
        Object.keys(autoSteps).forEach(key => {
            autoSteps[key] = false;
        });
        updateAutoStepsDisplay();
    }

    // 更新自动化步骤显示
    function updateAutoStepsDisplay() {
        const stepsContainer = document.getElementById('auto-steps');
        if (!stepsContainer) return;

        const steps = [
            { id: 'modalDetected', name: '检测窗口', status: autoSteps.modalDetected },
            { id: 'cameraOpened', name: '开启摄像头', status: autoSteps.cameraOpened },
            { id: 'photoTaken', name: '拍照', status: autoSteps.photoTaken },
            { id: 'comparisonStarted', name: '开始对比', status: autoSteps.comparisonStarted }
        ];

        stepsContainer.innerHTML = '';
        steps.forEach((step, index) => {
            let stepClass = 'step-waiting';
            if (step.status) {
                stepClass = 'step-complete';
            } else if (steps[index-1]?.status) {
                stepClass = 'step-pending';
            }

            const stepElement = document.createElement('div');
            stepElement.className = `auto-step ${stepClass}`;
            stepElement.innerHTML = `
                <div class="step-indicator"></div>
                <div class="step-name">${step.name}</div>
            `;
            stepsContainer.appendChild(stepElement);
        });
    }

    // 创建UI
    function createUI() {
        // 应用样式
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'interceptor-container';
        container.innerHTML = `
            <div id="interceptor-header">
                <div id="interceptor-title">人脸验证识别绕过</div>
                <div id="interceptor-controls">
                    <button id="clear-log-btn" class="interceptor-btn">清空日志</button>
                    <button id="minimize-btn" class="interceptor-btn">最小化</button>
                </div>
            </div>

            <div id="interceptor-body">
                <div class="interceptor-section">
                    <div class="section-title">替换图片</div>
                    <div id="image-upload-area">
                        <div id="image-upload-text">点击或拖放图片到此处上传</div>
                        <input type="file" id="image-upload" accept="image/*" style="display: none;">
                        <div id="file-name-display"></div>
                    </div>
                </div>

                <div class="interceptor-section">
                    <div class="section-title">自动处理</div>
                    <div id="auto-process-container">
                        <input type="checkbox" id="auto-process-toggle" ${autoProcessEnabled ? 'checked' : ''}>
                        <label id="auto-process-label" for="auto-process-toggle">自动处理人脸识别流程</label>
                    </div>
                    <div id="auto-steps">
                        <div class="auto-step step-waiting">
                            <div class="step-indicator"></div>
                            <div class="step-name">检测窗口</div>
                        </div>
                        <div class="auto-step step-waiting">
                            <div class="step-indicator"></div>
                            <div class="step-name">开启摄像头</div>
                        </div>
                        <div class="auto-step step-waiting">
                            <div class="step-indicator"></div>
                            <div class="step-name">拍照</div>
                        </div>
                        <div class="auto-step step-waiting">
                            <div class="step-indicator"></div>
                            <div class="step-name">开始对比</div>
                        </div>
                    </div>
                </div>

                <div class="interceptor-section">
                    <div class="section-title">拦截状态</div>
                    <div id="status-display">
                        <div class="status-item">
                            <div class="status-value" id="status-text">已激活</div>
                            <div class="status-label">状态</div>
                        </div>
                        <div class="status-item">
                            <div class="status-value" id="intercept-count">0</div>
                            <div class="status-label">拦截次数</div>
                        </div>
                        <div class="status-item">
                            <div class="status-value" id="success-count">0</div>
                            <div class="status-label">成功次数</div>
                        </div>
                    </div>
                </div>

                <div class="interceptor-section">
                    <div class="section-title">请求日志</div>
                    <div id="log-container"></div>
                </div>

                <div class="interceptor-section">
                    <div class="section-title">最近响应</div>
                    <div id="response-display">{
    "code": 200,
    "type": "success",
    "message": ""
}</div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 添加切换按钮
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'toggle-container';
        toggleContainer.innerHTML = '<button id="toggle-btn">显示拦截器</button>';
        document.body.appendChild(toggleContainer);

        // 初始化UI状态
        updateUI();

        // 设置事件监听器
        setupEventListeners();
    }

    // 更新UI状态
    function updateUI() {
        if (document.getElementById('intercept-count')) {
            document.getElementById('intercept-count').textContent = interceptCount;
            document.getElementById('success-count').textContent = successCount;
        }
    }

    // 添加日志函数
    function addLog(message, type = 'info') {
        const logContainer = document.getElementById('log-container');
        if (!logContainer) return;

        const now = new Date();
        const timestamp = now.toLocaleTimeString();

        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';

        let typeClass = 'log-info';
        if (type === 'success') typeClass = 'log-success';
        else if (type === 'warning') typeClass = 'log-warning';
        else if (type === 'error') typeClass = 'log-error';
        else if (type === 'debug') typeClass = 'log-debug';

        logEntry.innerHTML = `
            <span class="log-timestamp">${timestamp}</span>
            <span class="${typeClass}">${message}</span>
        `;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 图片上传
        const uploadArea = document.getElementById('image-upload-area');
        const imageUpload = document.getElementById('image-upload');
        const fileNameDisplay = document.getElementById('file-name-display');

        uploadArea.addEventListener('click', () => {
            imageUpload.click();
        });

        imageUpload.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const reader = new FileReader();

                reader.onload = function(e) {
                    originalImage = e.target.result;
                    uploadedFileName = file.name;

                    // 显示文件名而不是图片
                    fileNameDisplay.textContent = '已上传: ' + uploadedFileName;
                    fileNameDisplay.style.display = 'block';

                    logger.success('替换图片已更新: ' + uploadedFileName);
                };

                reader.readAsDataURL(file);
            }
        });

        // 拖放上传
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(52, 152, 219, 0.05)';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(52, 152, 219, 0.05)';

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];

                if (file.type.match('image.*')) {
                    const reader = new FileReader();

                    reader.onload = function(e) {
                        originalImage = e.target.result;
                        uploadedFileName = file.name;

                        // 显示文件名而不是图片
                        fileNameDisplay.textContent = '已上传: ' + uploadedFileName;
                        fileNameDisplay.style.display = 'block';

                        logger.success('替换图片已更新 (拖放上传): ' + uploadedFileName);
                    };

                    reader.readAsDataURL(file);
                } else {
                    logger.error('请上传图片文件');
                }
            }
        });

        // 清空日志
        document.getElementById('clear-log-btn')?.addEventListener('click', function() {
            document.getElementById('log-container').innerHTML = '';
            logger.info('日志已清空');
        });

        // 最小化/最大化
        document.getElementById('minimize-btn')?.addEventListener('click', function() {
            const container = document.getElementById('interceptor-container');
            container.classList.toggle('hidden');
            document.getElementById('toggle-btn').textContent = container.classList.contains('hidden') ? '显示拦截器' : '隐藏拦截器';
        });

        // 切换按钮
        document.getElementById('toggle-btn')?.addEventListener('click', function() {
            const container = document.getElementById('interceptor-container');
            container.classList.toggle('hidden');
            this.textContent = container.classList.contains('hidden') ? '显示拦截器' : '隐藏拦截器';
        });

        // 自动处理开关
        document.getElementById('auto-process-toggle')?.addEventListener('change', function() {
            autoProcessEnabled = this.checked;
            logger.info('自动处理已' + (autoProcessEnabled ? '启用' : '禁用'));
        });

        // 拖动功能
        const header = document.getElementById('interceptor-header');
        if (header) {
            let isDragging = false;
            let offsetX, offsetY;

            header.addEventListener('mousedown', function(e) {
                isDragging = true;
                const container = document.getElementById('interceptor-container');
                offsetX = e.clientX - container.getBoundingClientRect().left;
                offsetY = e.clientY - container.getBoundingClientRect().top;
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    const container = document.getElementById('interceptor-container');
                    container.style.left = (e.clientX - offsetX) + 'px';
                    container.style.top = (e.clientY - offsetY) + 'px';
                    container.style.right = 'auto';
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });
        }
    }

    // 重写fetch函数
    window.fetch = async function(...args) {
        const url = args[0];

        // 检查是否是目标URL
        if (typeof url === 'string' && url.includes('/service/apilearnside/study/checkFace')) {
            interceptCount++;
            updateUI();

            logger.info('检测到人脸验证请求，开始拦截...');

            // 如果是字符串URL，直接处理
            if (args.length >= 2 && args[1] && args[1].body) {
                return handleInterceptedRequest(args);
            }

            // 如果是Request对象，需要特殊处理
            if (args[0] instanceof Request) {
                const request = args[0];
                if (request.method === 'POST') {
                    return handleRequestObject(request);
                }
            }
        }

        // 非目标请求，直接放行
        return originalFetch.apply(this, args);
    };

    // 处理拦截的请求（参数形式）
    async function handleInterceptedRequest(args) {
        try {
            const requestOptions = args[1];

            // 解析原始请求体
            let requestBody;
            if (typeof requestOptions.body === 'string') {
                requestBody = JSON.parse(requestOptions.body);
            } else {
                requestBody = requestOptions.body;
            }

            logger.debug('原始请求数据: ' + JSON.stringify(requestBody).substring(0, 100) + '...');

            // 替换图片数据
            if (requestBody.tagers && requestBody.tagers.includes('base64,')) {
                logger.info('检测到图片数据，准备替换...');

                // 保存原始图片数据（用于调试）
                const requestImage = requestBody.tagers;

                if (originalImage) {
                    try {
                        // 生成随机化的图片数据
                        const randomizedImage = await generateRandomizedImage(originalImage);
                        requestBody.tagers = randomizedImage;

                        logger.success('图片数据随机化替换完成');
                        logger.debug(`原始图片大小: ${requestImage.length}字节, 新图片大小: ${randomizedImage.length}字节`);
                    } catch (error) {
                        logger.warning('图片随机化失败，使用原图: ' + error.message);
                        requestBody.tagers = originalImage;
                    }
                } else {
                    logger.warning('未上传替换图片，保持原始图片不变');
                }
            }

            // 更新请求体
            args[1].body = JSON.stringify(requestBody);

            // 发送修改后的请求
            return originalFetch.apply(this, args).then(response => {
                logger.success('修改后的请求发送成功');
                return handleResponse(response);
            }).catch(error => {
                logger.error('请求失败: ' + error.message);
                throw error;
            });

        } catch (error) {
            logger.error('请求处理错误: ' + error.message);
            // 出错时发送原始请求
            return originalFetch.apply(this, args);
        }
    }

    // 处理Request对象
    async function handleRequestObject(request) {
        return request.clone().text().then(async bodyText => {
            try {
                let requestBody = JSON.parse(bodyText);
                logger.debug('原始请求数据: ' + bodyText.substring(0, 100) + '...');

                // 替换图片数据
                if (requestBody.tagers && requestBody.tagers.includes('base64,')) {
                    logger.info('检测到图片数据，准备替换...');
                    const requestImage = requestBody.tagers;

                    if (originalImage) {
                        try {
                            // 生成随机化的图片数据
                            const randomizedImage = await generateRandomizedImage(originalImage);
                            requestBody.tagers = randomizedImage;

                            logger.success('图片数据随机化替换完成');
                            logger.debug(`原始图片大小: ${requestImage.length}字节, 新图片大小: ${randomizedImage.length}字节`);
                        } catch (error) {
                            logger.warning('图片随机化失败，使用原图: ' + error.message);
                            requestBody.tagers = originalImage;
                        }
                    } else {
                        logger.warning('未上传替换图片，保持原始图片不变');
                    }
                }

                // 创建新的请求
                const newRequest = new Request(request.url, {
                    method: request.method,
                    headers: request.headers,
                    body: JSON.stringify(requestBody),
                    mode: request.mode,
                    credentials: request.credentials,
                    cache: request.cache,
                    redirect: request.redirect,
                    referrer: request.referrer,
                    integrity: request.integrity
                });

                // 发送新请求
                return originalFetch.call(this, newRequest).then(response => {
                    logger.success('修改后的请求发送成功');
                    return handleResponse(response);
                });

            } catch (error) {
                logger.error('请求解析错误: ' + error.message);
                return originalFetch.call(this, request);
            }
        });
    }

    // 处理响应
    function handleResponse(response) {
        // 克隆响应以便读取内容
        const clonedResponse = response.clone();

        // 读取响应内容
        clonedResponse.text().then(text => {
            try {
                const result = JSON.parse(text);

                if (document.getElementById('response-display')) {
                    document.getElementById('response-display').textContent = JSON.stringify(result, null, 2);
                }

                logger.debug('服务器响应: ' + JSON.stringify(result).substring(0, 150) + '...');

                // 根据响应结果执行相应操作
                if (result.code === 200 || result.success) {
                    successCount++;
                    updateUI();
                    logger.success('人脸验证绕过成功');
                } else {
                    logger.warning('人脸验证绕过失败: ' + (result.message || '未知错误'));
                }
            } catch (e) {
                logger.debug('服务器响应（原始文本）: ' + text.substring(0, 150) + '...');
            }
        }).catch(error => {
            logger.error('响应处理错误: ' + error.message);
        });

        return response;
    }

    // 监听XMLHttpRequest请求（作为备用方案）
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        this._method = method;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = async function(body) {
        if (this._url && this._url.includes('/service/apilearnside/study/checkFace') && this._method === 'POST') {
            interceptCount++;
            updateUI();

            logger.info('检测到XHR人脸验证请求');

            try {
                if (body) {
                    const requestBody = JSON.parse(body);
                    logger.debug('XHR原始请求数据: ' + JSON.stringify(requestBody).substring(0, 100) + '...');

                    // 替换图片数据
                    if (requestBody.tagers && requestBody.tagers.includes('base64,')) {
                        logger.info('XHR检测到图片数据，准备替换...');
                        const requestImage = requestBody.tagers;

                        if (originalImage) {
                            try {
                                // 生成随机化的图片数据
                                const randomizedImage = await generateRandomizedImage(originalImage);
                                requestBody.tagers = randomizedImage;

                                logger.success('XHR图片数据随机化替换完成');
                                logger.debug(`XHR原始图片大小: ${requestImage.length}字节, 新图片大小: ${randomizedImage.length}字节`);
                            } catch (error) {
                                logger.warning('XHR图片随机化失败，使用原图: ' + error.message);
                                requestBody.tagers = originalImage;
                            }
                        } else {
                            logger.warning('未上传替换图片，保持XHR原始图片不变');
                        }

                        // 使用修改后的body
                        body = JSON.stringify(requestBody);
                    }
                }
            } catch (error) {
                logger.error('XHR请求处理错误: ' + error.message);
            }
        }

        // 监听XHR响应
        if (this._url && this._url.includes('/service/apilearnside/study/checkFace')) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);

                    if (document.getElementById('response-display')) {
                        document.getElementById('response-display').textContent = JSON.stringify(response, null, 2);
                    }

                    if (response.code === 200 || response.success) {
                        successCount++;
                        updateUI();
                        logger.success('XHR人脸验证绕过成功');
                    } else {
                        logger.warning('XHR人脸验证绕过失败: ' + (response.message || '未知错误'));
                    }
                } catch (e) {
                    logger.error('XHR响应解析错误: ' + e.message);
                }
            });
        }

        return originalXHRSend.call(this, body);
    };

    // 初始化拦截器
    function initInterceptor() {
        logger.info('人脸验证拦截器已启动 - 版本 2.1');

        // 延迟创建UI，确保页面已加载
        setTimeout(() => {
            createUI();
            logger.info('UI已加载，拦截器就绪');
            setupAutoProcessing();
        }, 1000);
    }

    // 执行初始化
    initInterceptor();
})();
//by Console于2025年10月20日