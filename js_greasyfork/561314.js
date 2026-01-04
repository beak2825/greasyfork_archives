// ==UserScript==
// @name         发票查验二维码扫描好使
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在国家税务总局发票查验网站自动扫描二维码并填充表单
// @author       Cline
// @match        https://inv-veri.chinatax.gov.cn/*
// @grant        GM_addStyle
// @grant        GM_notification
// @noframes
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js
// @downloadURL https://update.greasyfork.org/scripts/561314/%E5%8F%91%E7%A5%A8%E6%9F%A5%E9%AA%8C%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%89%AB%E6%8F%8F%E5%A5%BD%E4%BD%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/561314/%E5%8F%91%E7%A5%A8%E6%9F%A5%E9%AA%8C%E4%BA%8C%E7%BB%B4%E7%A0%81%E6%89%AB%E6%8F%8F%E5%A5%BD%E4%BD%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        scanInterval: 200, // 扫描间隔（毫秒）
        debugMode: true,   // 调试模式
        overlayPosition: 'bottom', // 悬浮窗位置：bottom, top, left, right
        overlayHeight: '300px',    // 悬浮窗高度
        cameraWidth: 320,          // 摄像头画面宽度
        cameraHeight: 240,         // 摄像头画面高度
        maxScanRetries: 3,         // 最大重试次数
        showCameraPreview: true,   // 显示摄像头预览
        notificationDuration: 3000, // 通知显示时间（毫秒）
        retryDelay: 1000,          // 重试延迟（毫秒）
        maxRetryCount: 5           // 最大重试次数
    };

    // 全局变量
    let video = null;
    let canvas = null;
    let ctx = null;
    let overlay = null;
    let isScanning = false;
    let scanTimer = null;
    let lastQRData = '';
    let permissionGranted = false;
    let stream = null;
    let errorCount = 0;
    let retryCount = 0;
    let lastErrorTime = 0;
    let lastFilledValues = {}; // 跟踪上次填充的值

    // 样式
    const STYLES = `
        #qr-scanner-overlay {
            width: 100%;
            height: ${CONFIG.overlayHeight};
            background: #ffffff;
            color: #333333;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            font-family: 'PingFang SC', 'Microsoft YaHei', 'SimHei', sans-serif;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .scanner-header {
            padding: 12px 16px;
            background: #f8f9fa;
            border-bottom: 1px solid #e8e8e8;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .scanner-title {
            font-size: 16px;
            font-weight: bold;
            color: #096dd9;
        }

        .scanner-controls {
            display: flex;
            gap: 10px;
        }

        .scanner-btn {
            padding: 6px 16px;
            background: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .scanner-btn:hover {
            background: #40a9ff;
        }

        .scanner-content {
            flex: 1;
            display: flex;
            padding: 16px;
            gap: 16px;
        }

        .camera-container {
            flex: 0 0 auto;
            position: relative;
        }

        #qr-video {
            width: ${CONFIG.cameraWidth}px;
            height: ${CONFIG.cameraHeight}px;
            background: #f5f5f5;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            object-fit: cover;
        }

        .camera-status {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            color: #333;
            border: 1px solid #d9d9d9;
        }

        .status-active {
            color: #52c41a;
        }

        .status-inactive {
            color: #ff4d4f;
        }

        .results-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #f8f9fa;
            border-radius: 6px;
            padding: 16px;
            overflow: hidden;
            border: 1px solid #e8e8e8;
        }

        .results-header {
            font-size: 14px;
            color: #096dd9;
            margin-bottom: 12px;
            border-bottom: 1px solid #e8e8e8;
            padding-bottom: 8px;
        }

        .results-display {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 12px;
        }

        .result-item {
            background: #ffffff;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 8px;
            border: 1px solid #f0f0f0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .result-field {
            display: flex;
            margin-bottom: 6px;
            font-size: 13px;
            align-items: center;
        }

        .field-label {
            width: 90px;
            color: #595959;
            font-weight: 500;
        }

        .field-value {
            flex: 1;
            color: #262626;
            word-break: break-all;
            font-weight: normal;
        }

        .scanner-footer {
            padding: 12px 16px;
            background: #f8f9fa;
            border-top: 1px solid #e8e8e8;
            font-size: 13px;
            color: #595959;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer-status {
            color: #52c41a;
            font-weight: 500;
        }

        .footer-error {
            color: #ff4d4f;
            font-weight: 500;
        }

        .footer-info {
            font-size: 12px;
            color: #8c8c8c;
        }

        .hide-camera #qr-video {
            display: none;
        }

        .hide-camera .camera-status {
            display: none;
        }

        @media (max-width: 768px) {
            #qr-scanner-overlay {
                height: 250px;
            }

            .scanner-content {
                flex-direction: column;
                padding: 12px;
            }

            #qr-video {
                width: 100%;
                max-width: 280px;
                height: 180px;
            }

            .camera-container {
                align-self: center;
                margin-bottom: 12px;
                order: 1;
            }

            .results-container {
                order: 2;
                margin-top: 0;
                height: auto;
                max-height: 120px;
                overflow-y: auto;
            }

            .results-display {
                max-height: 100px;
                overflow-y: auto;
            }

            .result-field {
                font-size: 12px;
            }

            .field-label {
                width: 70px;
            }
        }
    `;

    // 初始化
    function init() {
        console.log('发票查验二维码扫描助手初始化...');
        console.log('用户代理:', navigator.userAgent);
        console.log('是否为iOS:', isIOS());
        console.log('是否为移动设备:', isMobile());
        
        // 添加样式
        try {
            GM_addStyle(STYLES);
            console.log('样式添加成功');
        } catch (styleError) {
            console.error('添加样式失败:', styleError);
            // 回退到内联样式
            const styleElement = document.createElement('style');
            styleElement.textContent = STYLES;
            document.head.appendChild(styleElement);
            console.log('使用内联样式回退');
        }
        
        // 创建悬浮窗
        createOverlay();
        
        // 检查是否在iOS Safari中，可能需要用户交互
        // if (isIOS()) {
        //     console.log('检测到iOS设备，添加摄像头启动按钮');
        //     // 在iOS上，可能需要用户交互才能请求摄像头权限
        //     updateStatus('iOS Safari检测到，请点击下方按钮启用摄像头', 'info');
            
        //     // 添加启动按钮
        //     const startButton = document.createElement('button');
        //     startButton.className = 'scanner-btn';
        //     startButton.id = 'start-camera';
        //     startButton.textContent = '启用摄像头';
        //     startButton.style.marginLeft = '10px';
            
        //     startButton.addEventListener('click', function() {
        //         console.log('iOS用户点击了启用摄像头按钮');
        //         startButton.remove();
        //         initCamera();
        //     });
            
        //     const controls = document.querySelector('.scanner-controls');
        //     if (controls) {
        //         controls.appendChild(startButton);
        //     }
        // } else {
        //     // 非iOS设备，正常初始化摄像头
        //     initCamera();
        // }

        initCamera();
        
        // 监听页面变化
        observePageChanges();
    }

    // 创建悬浮窗
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'qr-scanner-overlay';
        overlay.innerHTML = `
            <div class="scanner-header">
                <div class="scanner-title">📱 发票二维码扫描助手</div>
                <div class="scanner-controls">
                    <button class="scanner-btn" id="toggle-camera">隐藏摄像头</button>
                </div>
            </div>
            <div class="scanner-content">
                <div class="camera-container">
                    <video id="qr-video" autoplay playsinline></video>
                    <div class="camera-status status-inactive">摄像头未启动</div>
                </div>
                <div class="results-container">
                    <div class="results-header">扫描结果</div>
                    <div class="results-display" id="results-display">
                        <div class="result-item">
                            <div class="result-field">
                                <span class="field-label">状态:</span>
                                <span class="field-value">初始化中...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scanner-footer">
                <div class="footer-status" id="footer-status">准备就绪</div>
                <div class="footer-info" id="footer-info">请将发票二维码对准摄像头</div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 绑定事件
        document.getElementById('toggle-camera').addEventListener('click', toggleCamera);
    }

    // 初始化摄像头
    async function initCamera() {
        try {
            console.log('开始初始化摄像头...');
            console.log('是否为移动设备:', isMobile());
            console.log('是否为iOS:', isIOS());
            
            // iOS Safari需要更简单的配置
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' }, // 优先使用后置摄像头
                    width: { ideal: CONFIG.cameraWidth },
                    height: { ideal: CONFIG.cameraHeight }
                },
                audio: false
            };

            // 对于移动设备，放宽约束
            if (isMobile()) {
                constraints.video = {
                    facingMode: { ideal: 'environment' },
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 }
                };
            }

            console.log('摄像头约束:', constraints);
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video = document.getElementById('qr-video');
            if (!video) {
                throw new Error('视频元素未找到');
            }
            video.srcObject = stream;
            permissionGranted = true;

            // 等待视频元素准备好
            await new Promise((resolve) => {
                if (video.readyState >= 1) {
                    resolve();
                } else {
                    video.addEventListener('loadedmetadata', resolve, { once: true });
                }
            });

            // 创建canvas用于截图
            canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || CONFIG.cameraWidth;
            canvas.height = video.videoHeight || CONFIG.cameraHeight;
            ctx = canvas.getContext('2d');

            console.log('摄像头初始化成功，视频尺寸:', video.videoWidth, 'x', video.videoHeight);
            updateCameraStatus('active');
            updateStatus('摄像头已就绪，开始扫描...', 'success');
            
            // 自动开始扫描
            setTimeout(() => {
                startScanning();
            }, 500);
            
        } catch (error) {
            console.error('摄像头初始化失败:', error);
            updateCameraStatus('inactive');
            updateStatus('摄像头访问失败: ' + error.message, 'error');
            permissionGranted = false;
            handleError(error, 'camera');
        }
    }

    // 开始扫描
    function startScanning() {
        if (!permissionGranted) {
            updateStatus('请先允许摄像头权限', 'error');
            return;
        }

        if (isScanning) return;

        isScanning = true;
        updateStatus('正在扫描二维码...', 'info');
        updateCameraStatus('active');

        // 开始扫描循环
        scanTimer = setInterval(scanQRCode, CONFIG.scanInterval);
    }

    // 停止扫描
    function stopScanning() {
        if (!isScanning) return;

        isScanning = false;
        clearInterval(scanTimer);
        updateStatus('扫描已停止', 'info');
        updateCameraStatus('inactive');
    }

    // 扫描二维码
    function scanQRCode() {
        if (!video || !ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
            return;
        }

        try {
            // 绘制视频帧到canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 使用jsQR识别二维码
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                processQRCode(code.data);
            }
        } catch (error) {
            console.error('二维码扫描错误:', error);
            updateStatus('扫描错误: ' + error.message, 'error');
        }
    }

    // 处理二维码数据
    function processQRCode(qrData) {
        // 如果与上次相同，跳过
        if (qrData === lastQRData) {
            return;
        }

        lastQRData = qrData;
        console.log('扫描到二维码:', qrData);

        // 解析发票数据
        const invoiceData = parseQRCode(qrData);
        
        if (invoiceData) {
            // 显示结果
            displayResults(invoiceData);
            
            // 尝试自动填充表单
            autoFillForm(invoiceData);
            
            // 更新状态
            updateStatus(`成功识别发票: ${invoiceData.invoiceNumber}`, 'success');
        } else {
            updateStatus('无法识别发票二维码格式', 'warning');
        }
    }

    // 解析二维码数据
    function parseQRCode(qrData) {
        // 发票二维码格式通常为逗号分隔的字段
        // 格式示例: 01,04,发票代码,发票号码,金额,日期,校验码,加密区
        try {
            const parts = qrData.split(',');

            // 检查是否是发票二维码格式
            if (parts.length < 6) {
                console.warn('二维码字段不足:', parts.length);
                return null;
            }

            // 常见的增值税发票二维码格式
            // 格式1: 01,04,发票代码,发票号码,金额,日期,校验码...
            const dateStr = parts[5] ? parts[5].trim() : '';
            let invoiceData = {
                invoiceNumber: parts[3] ? parts[3].trim() : '',    // 发票号码
                amount: parts[4] ? parts[4].trim() : '',           // 金额
                rawDate: dateStr,                                   // 原始日期格式（YYYYMMDD）
                date: dateStr.length === 8 ? 
                    `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : dateStr, // 转换后的日期
                checkCode: parts[6] ? parts[6].trim() : '',         // 校验码
                rawData: qrData                                     // 原始数据
            };

            console.log('解析的发票数据:', invoiceData);
            return invoiceData;

        } catch (err) {
            console.error('解析二维码数据失败:', err);
            return null;
        }
    }

    // 显示扫描结果（移除发票代码显示）
    function displayResults(invoiceData) {
        const resultsDisplay = document.getElementById('results-display');
        resultsDisplay.innerHTML = `
            <div class="result-item">
                <div class="result-field">
                    <span class="field-label">发票号码:</span>
                    <span class="field-value">${invoiceData.invoiceNumber || '未识别'}</span>
                </div>
                <div class="result-field">
                    <span class="field-label">开票日期:</span>
                    <span class="field-value">${invoiceData.date || '未识别'}</span>
                </div>
                <div class="result-field">
                    <span class="field-label">金额:</span>
                    <span class="field-value">${invoiceData.amount || '未识别'}</span>
                </div>
                <div class="result-field">
                    <span class="field-label">校验码:</span>
                    <span class="field-value">${invoiceData.checkCode || '未识别'}</span>
                </div>
            </div>
        `;
    }

    // 检查字段是否需要填充
    function shouldFillField(field, newValue) {
        if (!field) return false;
        const currentValue = field.value || '';
        return currentValue.trim() !== newValue.trim();
    }

    // 自动填充表单
    function autoFillForm(invoiceData) {
        try {
            console.log('开始自动填充表单，数据:', invoiceData);
            
            // 直接使用ID选择器定位字段
            const fields = {
                invoiceNumber: document.querySelector('#fphm'),  // 发票号码
                date: document.querySelector('#kprq'),           // 开票日期
                amountWithoutTax: document.querySelector('#kjje') // 开具金额(不含税)
            };

            console.log('找到的字段:', {
                invoiceNumber: fields.invoiceNumber ? '找到 #fphm' : '未找到 #fphm',
                date: fields.date ? '找到 #kprq' : '未找到 #kprq',
                amountWithoutTax: fields.amountWithoutTax ? '找到 #kjje' : '未找到 #kjje'
            });

            let filledCount = 0;

            // 填充发票号码（只有当值不同时才填充）
            if (fields.invoiceNumber && invoiceData.invoiceNumber) {
                if (shouldFillField(fields.invoiceNumber, invoiceData.invoiceNumber)) {
                    console.log('填充发票号码:', invoiceData.invoiceNumber, '到字段 #fphm');
                    fillField(fields.invoiceNumber, invoiceData.invoiceNumber);
                    lastFilledValues.fphm = invoiceData.invoiceNumber;
                    filledCount++;
                } else {
                    console.log('发票号码字段值未变化，跳过填充');
                }
            }

            // 填充开票日期（保持YYYYMMDD格式）
            if (fields.date && invoiceData.rawDate) {
                if (shouldFillField(fields.date, invoiceData.rawDate)) {
                    console.log('填充开票日期:', invoiceData.rawDate, '到字段 #kprq');
                    fillField(fields.date, invoiceData.rawDate);
                    lastFilledValues.kprq = invoiceData.rawDate;
                    filledCount++;
                } else {
                    console.log('开票日期字段值未变化，跳过填充');
                }
            }

            // 填充开具金额(不含税)
            if (fields.amountWithoutTax && invoiceData.amount) {
                if (shouldFillField(fields.amountWithoutTax, invoiceData.amount)) {
                    console.log('填充开具金额(不含税):', invoiceData.amount, '到字段 #kjje');
                    fillField(fields.amountWithoutTax, invoiceData.amount);
                    lastFilledValues.kjje = invoiceData.amount;
                    filledCount++;
                } else {
                    console.log('开具金额字段值未变化，跳过填充');
                }
            }

            if (filledCount > 0) {
                const successMsg = `已自动填充 ${filledCount} 个字段`;
                console.log(successMsg);
                updateStatus(successMsg, 'success');
                

                
                // 模拟点击验证码输入框，以便用户可以直接输入验证码
                setTimeout(() => {
                    simulateYzmClick();
                }, 200);
            } else {
                console.log('未找到表单字段或值未变化，请手动填写');
                updateStatus('未找到表单字段或值未变化，请手动填写', 'warning');
            }

        } catch (error) {
            console.error('自动填充失败:', error);
            updateStatus('自动填充失败: ' + error.message, 'error');
        }
    }



    // 填充字段
    function fillField(field, value) {
        field.value = value;
        
        // 触发标准事件
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        // 触发验证事件（focus和blur）
        field.focus();
        field.blur();
        
        console.log(`填充字段: ${field.name || field.id || field.placeholder} = ${value}`);
    }

    // 模拟点击验证码输入框
    function simulateYzmClick() {
        const yzmInput = document.querySelector('#yzm');
        if (yzmInput) {
            console.log('找到验证码输入框 #yzm，模拟点击');
            yzmInput.focus();
            yzmInput.click();
            console.log('已模拟点击验证码输入框');
        } else {
            console.log('未找到验证码输入框 #yzm');
        }
    }
    

    // 更新摄像头状态
    function updateCameraStatus(status) {
        const statusEl = document.querySelector('.camera-status');
        if (statusEl) {
            statusEl.textContent = status === 'active' ? '摄像头运行中' : '摄像头未启动';
            statusEl.className = `camera-status status-${status}`;
        }
    }

    // 更新状态信息
    function updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('footer-status');
        const infoEl = document.getElementById('footer-info');

        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `footer-${type}`;
        }

        if (infoEl && type === 'info') {
            infoEl.textContent = message;
        }

        // 记录到控制台
        console.log(`状态: ${message}`);
    }

    // 切换摄像头显示
    function toggleCamera() {
        const btn = document.getElementById('toggle-camera');
        if (overlay.classList.contains('hide-camera')) {
            overlay.classList.remove('hide-camera');
            btn.textContent = '隐藏摄像头';
            updateStatus('摄像头已显示，恢复扫描', 'info');
            // 恢复扫描
            if (permissionGranted && !isScanning) {
                startScanning();
            }
        } else {
            overlay.classList.add('hide-camera');
            btn.textContent = '显示摄像头';
            updateStatus('摄像头已隐藏，停止扫描', 'info');
            // 停止扫描
            if (isScanning) {
                stopScanning();
            }
        }
    }

    // 监听页面变化（简化版，避免无限循环）
    function observePageChanges() {
        // 简化版本，仅监听页面主体变化，不触发重复填充
        const observer = new MutationObserver((mutations) => {
            // 仅记录变化，不触发自动填充
            console.log('页面DOM发生变化', mutations.length, '个变化');
        });

        // 限制监听范围，避免过度触发
        observer.observe(document.body, {
            childList: true,
            subtree: false  // 不监听子树，避免表单填充触发变化
        });
    }

    // 清理资源
    function cleanup() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        if (scanTimer) {
            clearInterval(scanTimer);
        }
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    // 显示用户通知
    function showNotification(title, message, type = 'info') {
        if (typeof GM_notification !== 'undefined') {
            const options = {
                text: message,
                title: title,
                timeout: CONFIG.notificationDuration
            };
            
            // 添加样式
            if (type === 'error') {
                options.highlight = true;
            }
            
            GM_notification(options);
        } else {
            // 回退到alert
            const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
            alert(`${icon} ${title}\n\n${message}`);
        }
    }


    // 验证发票数据格式（修改版：跳过发票代码验证）
    function validateInvoiceData(invoiceData) {
        const errors = [];
        
        // 金额验证
        if (!invoiceData.amount) {
            errors.push('金额不能为空');
        } else if (!/^\d+(\.\d{1,2})?$/.test(invoiceData.amount)) {
            errors.push('金额格式不正确，应为数字格式，最多两位小数');
        }
        
        // 开票日期验证（YYYYMMDD格式）
        if (!invoiceData.rawDate) {
            errors.push('开票日期不能为空');
        } else if (!/^\d{8}$/.test(invoiceData.rawDate)) {
            errors.push('开票日期格式不正确，应为YYYYMMDD格式');
        }
        
        if (errors.length > 0) {
            const errorMessage = `数据验证失败:\n${errors.join('\n')}`;
            showNotification('数据验证失败', errorMessage, 'warning');
            updateStatus('数据格式有误，请检查二维码', 'warning');
            return false;
        }
        
        return true;
    }

    // 优化二维码处理，增加数据验证和调试信息
    function processQRCode(qrData) {
        console.log('processQRCode called with data:', qrData);
        
        // 如果与上次相同，跳过
        if (qrData === lastQRData) {
            console.log('Same QR code data, skipping...');
            return;
        }

        lastQRData = qrData;
        console.log('扫描到新二维码:', qrData);
        updateStatus('正在解析二维码...', 'info');

        // 解析发票数据
        const invoiceData = parseQRCode(qrData);
        console.log('解析结果:', invoiceData);
        
        if (invoiceData) {
            // 验证数据格式
            if (validateInvoiceData(invoiceData)) {
                console.log('数据验证通过:', invoiceData);
                
                // 显示结果
                displayResults(invoiceData);
                
                // 尝试自动填充表单
                autoFillForm(invoiceData);
                
                // 更新状态
                const successMsg = `成功识别发票: ${invoiceData.invoiceNumber}`;
                console.log('状态更新为:', successMsg);
                updateStatus(successMsg, 'success');
                
                // 显示成功通知
                // showNotification('识别成功', `成功识别发票 ${invoiceData.invoiceNumber}`, 'success');
            } else {
                console.log('数据验证失败');
                updateStatus('数据格式有误，请检查二维码', 'warning');
            }
        } else {
            console.log('无法解析二维码格式');
            updateStatus('无法识别发票二维码格式', 'warning');
            showNotification('格式错误', '无法识别二维码格式，请确保是有效的发票二维码', 'warning');
        }
    }

    // 检测是否为iOS Safari
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // 检测是否为移动设备
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 增强的错误处理
    function handleError(error, context) {
        const now = Date.now();
        errorCount++;
        
        console.error(`[${context}] 错误:`, error);
        
        // 避免频繁显示相同错误
        if (now - lastErrorTime < CONFIG.retryDelay * 2) {
            return;
        }
        
        lastErrorTime = now;
        
        let errorMessage = '';
        let userMessage = '';
        
        // 根据错误类型提供不同的反馈
        if (error.name === 'NotAllowedError') {
            errorMessage = '用户拒绝了摄像头权限';
            userMessage = '请在浏览器设置中允许摄像头权限，然后刷新页面重试';
        } else if (error.name === 'NotFoundError') {
            errorMessage = '未找到可用的摄像头';
            userMessage = '请检查摄像头设备是否连接正常';
        } else if (error.name === 'NotReadableError') {
            errorMessage = '摄像头被其他应用占用';
            userMessage = '请关闭其他正在使用摄像头的应用后重试';
        } else if (error.name === 'OverconstrainedError') {
            errorMessage = '摄像头参数不满足要求';
            userMessage = '请尝试调整摄像头设置';
        } else if (error.name === 'NotSupportedError') {
            errorMessage = '浏览器不支持摄像头功能';
            userMessage = '请使用支持摄像头的浏览器（如Chrome、Firefox、Edge等）';
        } else if (error.name === 'SecurityError') {
            errorMessage = '安全限制';
            userMessage = '请在HTTPS环境下使用此功能';
        } else {
            errorMessage = error.message || '未知错误';
            userMessage = `发生错误: ${errorMessage}`;
        }
        
        // 显示通知
        showNotification('扫描助手错误', userMessage, 'error');
        
        // 更新状态显示
        updateStatus(`错误: ${errorMessage}`, 'error');
        
        // 如果错误过多，自动停止扫描
        if (errorCount >= CONFIG.maxRetryCount) {
            if (isScanning) {
                stopScanning();
                showNotification('扫描已停止', '因连续错误，扫描已自动停止', 'error');
            }
        }
        
        // 重试逻辑
        if (retryCount < CONFIG.maxRetryCount && context === 'camera') {
            retryCount++;
            setTimeout(() => {
                console.log(`重试摄像头初始化 (${retryCount}/${CONFIG.maxRetryCount})`);
                initCamera();
            }, CONFIG.retryDelay);
        }
    }

    // 页面卸载时清理
    window.addEventListener('beforeunload', cleanup);

    // 确保页面完全加载后初始化
    if (document.readyState === 'complete') {
        console.log('页面已完全加载，立即初始化');
        setTimeout(init, 1000); // 延迟1秒确保页面稳定
    } else {
        console.log('等待页面完全加载...');
        window.addEventListener('load', function() {
            console.log('window.load事件触发，开始初始化');
            setTimeout(init, 1000); // 延迟1秒确保页面稳定
        });
        
        // 同时监听DOMContentLoaded作为备用
        document.addEventListener('DOMContentLoaded', function() {
            console.log('DOMContentLoaded事件触发');
            // 如果window.load尚未触发，设置一个较长的超时
            if (!window.loaded) {
                setTimeout(function() {
                    if (!window.loaded) {
                        console.log('DOMContentLoaded超时后开始初始化');
                        init();
                    }
                }, 3000);
            }
        });
    }

    // 标记window.load事件状态
    window.loaded = false;
    window.addEventListener('load', function() {
        window.loaded = true;
    });

})();
