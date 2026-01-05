// ==UserScript==
// @name         智能识别二维码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强大的二维码识别工具 - 支持悬停识别、快捷键、预识别等功能
// @author       Spkyle
// @license      CC-BY-NC-SA-4.0
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558376/%E6%99%BA%E8%83%BD%E8%AF%86%E5%88%AB%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/558376/%E6%99%BA%E8%83%BD%E8%AF%86%E5%88%AB%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        hoverEnabled: true,           // 悬停显示按钮
        preRecognition: false,        // 预识别（只在二维码上显示按钮）
        squareOnly: false,            // 只在正方形图片上显示
        hoverDelay: 400,              // 悬停延迟(ms)
        buttonSize: 50,               // 按钮大小
        shortcutKey: 'ctrlKey',       // 快捷键
        showNotification: true,       // 显示通知
        autoOpen: false               // 识别后自动打开链接
    };

    // 加载配置
    let config = { ...defaultConfig, ...GM_getValue('qrConfig', {}) };

    let floatingButton = null;
    let currentImageElement = null;
    let showTimer = null;
    let hideTimer = null;
    let isEnabled = config.hoverEnabled;

    // 注册油猴菜单
    GM_registerMenuCommand('⚙️ 设置选项', showSettingsPanel);
    GM_registerMenuCommand(isEnabled ? '✅ 悬停识别 (已启用)' : '❌ 悬停识别 (已禁用)', toggleHover);
    GM_registerMenuCommand(config.preRecognition ? '✅ 预识别 (已启用)' : '❌ 预识别 (已禁用)', togglePreRecognition);
    GM_registerMenuCommand(config.squareOnly ? '✅ 仅正方形 (已启用)' : '❌ 仅正方形 (已禁用)', toggleSquareOnly);
    GM_registerMenuCommand('🔄 恢复默认设置', resetSettings);

    console.log('🔍 二维码识别脚本已加载');

    // 切换悬停识别
    function toggleHover() {
        config.hoverEnabled = !config.hoverEnabled;
        isEnabled = config.hoverEnabled;
        GM_setValue('qrConfig', config);
        showNotification(config.hoverEnabled ? '✅ 悬停识别已启用' : '❌ 悬停识别已禁用', 'success');
        location.reload();
    }

    // 切换预识别
    function togglePreRecognition() {
        config.preRecognition = !config.preRecognition;
        GM_setValue('qrConfig', config);
        showNotification(config.preRecognition ? '✅ 预识别已启用（会影响性能）' : '❌ 预识别已禁用', 'success');
        location.reload();
    }

    // 切换仅正方形
    function toggleSquareOnly() {
        config.squareOnly = !config.squareOnly;
        GM_setValue('qrConfig', config);
        showNotification(config.squareOnly ? '✅ 仅识别正方形已启用' : '❌ 仅识别正方形已禁用', 'success');
        location.reload();
    }

    // 恢复默认设置
    function resetSettings() {
        if (confirm('确定要恢复默认设置吗？')) {
            config = { ...defaultConfig };
            GM_setValue('qrConfig', config);
            showNotification('✅ 已恢复默认设置', 'success');
            location.reload();
        }
    }

    // 创建悬浮识别按钮
    function createFloatingButton() {
        if (floatingButton) return floatingButton;

        floatingButton = document.createElement('div');
        floatingButton.innerHTML = '🔍';
        floatingButton.title = '点击识别二维码';
        floatingButton.style.cssText = `
            position: fixed;
            width: ${config.buttonSize}px;
            height: ${config.buttonSize}px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: ${config.buttonSize * 0.48}px;
            cursor: pointer;
            z-index: 2147483647;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
            transition: all 0.2s ease;
            user-select: none;
        `;

        floatingButton.onmouseenter = function() {
            clearTimeout(hideTimer);
            this.style.transform = 'scale(1.15)';
            this.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.7)';
        };

        floatingButton.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.5)';
            hideTimer = setTimeout(() => {
                if (floatingButton) floatingButton.style.display = 'none';
            }, 400);
        };

        floatingButton.onclick = function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (currentImageElement && currentImageElement.tagName) {
                floatingButton.style.display = 'none';
                decodeQRCode(currentImageElement);
            } else {
                showNotification('图片元素已失效，请重新悬停', 'error');
                floatingButton.style.display = 'none';
            }
        };

        document.body.appendChild(floatingButton);
        return floatingButton;
    }

    // 显示按钮
    async function showButton(imgElement) {
        if (!isEnabled || !imgElement || !imgElement.tagName) return;

        // 预识别模式
        if (config.preRecognition) {
            const imageData = await getImageData(imgElement);
            if (imageData) {
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (!code) return; // 不是二维码，不显示按钮
            }
        }

        // 只识别正方形图片
        if (config.squareOnly) {
            const rect = imgElement.getBoundingClientRect();
            const ratio = rect.width / rect.height;
            if (ratio < 0.8 || ratio > 1.2) return; // 不是正方形，不显示
        }

        currentImageElement = imgElement;
        clearTimeout(hideTimer);

        const btn = createFloatingButton();
        const rect = imgElement.getBoundingClientRect();

        let left = rect.right + window.scrollX - config.buttonSize - 10;
        let top = rect.top + window.scrollY + 10;

        if (left < 10) left = rect.left + window.scrollX + 10;
        if (left + config.buttonSize > window.innerWidth + window.scrollX) {
            left = rect.left + window.scrollX + 10;
        }
        if (top < window.scrollY + 10) top = window.scrollY + 10;
        if (top + config.buttonSize > window.innerHeight + window.scrollY) {
            top = rect.bottom + window.scrollY - config.buttonSize - 10;
        }

        btn.style.left = left + 'px';
        btn.style.top = top + 'px';
        btn.style.display = 'flex';
    }

    // 检查是否是图片元素
    function isImageElement(element) {
        if (!element || !element.tagName) return false;

        if (element.tagName === 'IMG' || element.tagName === 'CANVAS') {
            return true;
        }

        try {
            const bg = window.getComputedStyle(element).backgroundImage;
            return bg && bg !== 'none' && bg.includes('url');
        } catch (e) {
            return false;
        }
    }

    // 监听鼠标悬停
    document.addEventListener('mouseover', function(e) {
        if (!isEnabled) return;

        const target = e.target;
        if (target === floatingButton) return;

        if (isImageElement(target)) {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);

            showTimer = setTimeout(() => {
                if (isImageElement(target)) {
                    showButton(target);
                }
            }, config.hoverDelay);
        }
    }, true);

    // 监听鼠标移出
    document.addEventListener('mouseout', function(e) {
        const target = e.target;

        if (isImageElement(target)) {
            clearTimeout(showTimer);

            if (floatingButton && !floatingButton.matches(':hover')) {
                clearTimeout(hideTimer);
                hideTimer = setTimeout(() => {
                    if (floatingButton && floatingButton.style.display !== 'none') {
                        floatingButton.style.display = 'none';
                    }
                }, 600);
            }
        }
    }, true);

    // 快捷键识别
    document.addEventListener('contextmenu', function(e) {
        const target = e.target;

        if (isImageElement(target) && e[config.shortcutKey]) {
            e.preventDefault();
            decodeQRCode(target);
            if (floatingButton) floatingButton.style.display = 'none';
        }
    }, true);

    // 滚动时隐藏
    document.addEventListener('scroll', () => {
        clearTimeout(showTimer);
        if (floatingButton) floatingButton.style.display = 'none';
    }, true);

    // 解码二维码
    async function decodeQRCode(element) {
        if (!element || !element.tagName) {
            showNotification('图片元素无效，请重试', 'error');
            return;
        }

        try {
            if (config.showNotification) {
                GM_notification({
                    text: '正在识别二维码...',
                    title: '二维码识别',
                    timeout: 1000
                });
            }

            const imageData = await getImageData(element);
            if (!imageData) {
                showNotification('无法读取图片数据', 'error');
                return;
            }

            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                if (config.autoOpen && (code.data.startsWith('http://') || code.data.startsWith('https://'))) {
                    window.open(code.data, '_blank');
                    showNotification('✅ 已自动打开链接', 'success');
                } else {
                    showQRResult(code.data);
                }
            } else {
                showNotification('未检测到二维码', 'error');
            }
        } catch (error) {
            console.error('二维码识别错误:', error);
            showNotification('识别失败: ' + error.message, 'error');
        }
    }

    // 获取图片数据
    async function getImageData(element) {
        if (!element || !element.tagName) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let img;

        if (element.tagName === 'IMG') {
            img = element;
        } else if (element.tagName === 'CANVAS') {
            return element.getContext('2d').getImageData(0, 0, element.width, element.height);
        } else {
            const bg = window.getComputedStyle(element).backgroundImage;
            const urlMatch = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (urlMatch) {
                img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = urlMatch[1];
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
            }
        }

        if (!img) return null;

        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        ctx.drawImage(img, 0, 0);

        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    // 显示设置面板
    function showSettingsPanel() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            max-height: 80vh;
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 22px;">⚙️ 二维码识别设置</h2>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="hoverEnabled" ${config.hoverEnabled ? 'checked' : ''}
                           style="width: 18px; height: 18px; margin-right: 10px; cursor: pointer;">
                    <span style="font-size: 15px; color: #333;">启用悬停显示按钮</span>
                </label>
                <p style="margin: 0 0 0 28px; font-size: 13px; color: #666;">鼠标悬停图片时自动显示识别按钮</p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="preRecognition" ${config.preRecognition ? 'checked' : ''}
                           style="width: 18px; height: 18px; margin-right: 10px; cursor: pointer;">
                    <span style="font-size: 15px; color: #333;">启用预识别</span>
                </label>
                <p style="margin: 0 0 0 28px; font-size: 13px; color: #666;">只在检测到二维码的图片上显示按钮（会消耗性能）</p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="squareOnly" ${config.squareOnly ? 'checked' : ''}
                           style="width: 18px; height: 18px; margin-right: 10px; cursor: pointer;">
                    <span style="font-size: 15px; color: #333;">只识别正方形图片</span>
                </label>
                <p style="margin: 0 0 0 28px; font-size: 13px; color: #666;">过滤掉明显不是二维码的长方形图片</p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="showNotification" ${config.showNotification ? 'checked' : ''}
                           style="width: 18px; height: 18px; margin-right: 10px; cursor: pointer;">
                    <span style="font-size: 15px; color: #333;">显示通知消息</span>
                </label>
                <p style="margin: 0 0 0 28px; font-size: 13px; color: #666;">识别时显示浏览器通知</p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; margin-bottom: 10px; cursor: pointer;">
                    <input type="checkbox" id="autoOpen" ${config.autoOpen ? 'checked' : ''}
                           style="width: 18px; height: 18px; margin-right: 10px; cursor: pointer;">
                    <span style="font-size: 15px; color: #333;">自动打开链接</span>
                </label>
                <p style="margin: 0 0 0 28px; font-size: 13px; color: #666;">识别到链接后自动在新标签页打开</p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 15px; color: #333;">
                    悬停延迟时间: <span id="delayValue">${config.hoverDelay}</span>ms
                </label>
                <input type="range" id="hoverDelay" min="100" max="1000" step="50" value="${config.hoverDelay}"
                       style="width: 100%; cursor: pointer;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-size: 15px; color: #333;">
                    按钮大小: <span id="sizeValue">${config.buttonSize}</span>px
                </label>
                <input type="range" id="buttonSize" min="30" max="80" step="5" value="${config.buttonSize}"
                       style="width: 100%; cursor: pointer;">
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; font-size: 15px; color: #333;">快捷键识别</label>
                <select id="shortcutKey" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; cursor: pointer;">
                    <option value="ctrlKey" ${config.shortcutKey === 'ctrlKey' ? 'selected' : ''}>Ctrl + 右键</option>
                    <option value="altKey" ${config.shortcutKey === 'altKey' ? 'selected' : ''}>Alt + 右键</option>
                    <option value="shiftKey" ${config.shortcutKey === 'shiftKey' ? 'selected' : ''}>Shift + 右键</option>
                </select>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancelBtn" style="padding: 10px 20px; background: #757575; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    取消
                </button>
                <button id="saveBtn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                    保存设置
                </button>
            </div>
        `;

        modal.appendChild(panel);
        document.body.appendChild(modal);

        // 实时更新显示值
        panel.querySelector('#hoverDelay').oninput = function() {
            panel.querySelector('#delayValue').textContent = this.value;
        };
        panel.querySelector('#buttonSize').oninput = function() {
            panel.querySelector('#sizeValue').textContent = this.value;
        };

        // 保存按钮
        panel.querySelector('#saveBtn').onclick = function() {
            config.hoverEnabled = panel.querySelector('#hoverEnabled').checked;
            config.preRecognition = panel.querySelector('#preRecognition').checked;
            config.squareOnly = panel.querySelector('#squareOnly').checked;
            config.showNotification = panel.querySelector('#showNotification').checked;
            config.autoOpen = panel.querySelector('#autoOpen').checked;
            config.hoverDelay = parseInt(panel.querySelector('#hoverDelay').value);
            config.buttonSize = parseInt(panel.querySelector('#buttonSize').value);
            config.shortcutKey = panel.querySelector('#shortcutKey').value;

            GM_setValue('qrConfig', config);

            showNotification('✅ 设置已保存，刷新页面后生效', 'success');
            document.body.removeChild(modal);

            setTimeout(() => location.reload(), 1000);
        };

        // 取消按钮
        panel.querySelector('#cancelBtn').onclick = function() {
            document.body.removeChild(modal);
        };

        // 点击背景关闭
        modal.onclick = function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    // 显示二维码结果
    function showQRResult(data) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 25px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        `;

        const title = document.createElement('h3');
        title.textContent = '✅ 识别成功';
        title.style.cssText = 'margin: 0 0 15px 0; color: #333; font-size: 18px;';

        const result = document.createElement('div');
        result.textContent = data;
        result.style.cssText = `
            padding: 12px;
            background: #f5f5f5;
            border-radius: 6px;
            word-break: break-all;
            margin-bottom: 20px;
            max-height: 200px;
            overflow-y: auto;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 复制';
        copyBtn.style.cssText = `
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        `;
        copyBtn.onmouseover = () => copyBtn.style.background = '#45a049';
        copyBtn.onmouseout = () => copyBtn.style.background = '#4CAF50';
        copyBtn.onclick = () => {
            GM_setClipboard(data);
            showNotification('✅ 已复制到剪贴板', 'success');
            document.body.removeChild(modal);
        };

        const openBtn = document.createElement('button');
        openBtn.textContent = '🔗 打开链接';
        openBtn.style.cssText = `
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        `;
        openBtn.onmouseover = () => openBtn.style.background = '#0b7dda';
        openBtn.onmouseout = () => openBtn.style.background = '#2196F3';
        openBtn.onclick = () => {
            window.open(data, '_blank');
            document.body.removeChild(modal);
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖ 关闭';
        closeBtn.style.cssText = `
            padding: 10px 20px;
            background: #757575;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        `;
        closeBtn.onmouseover = () => closeBtn.style.background = '#616161';
        closeBtn.onmouseout = () => closeBtn.style.background = '#757575';
        closeBtn.onclick = () => document.body.removeChild(modal);

        buttonContainer.appendChild(copyBtn);
        if (data.startsWith('http://') || data.startsWith('https://')) {
            buttonContainer.appendChild(openBtn);
        }
        buttonContainer.appendChild(closeBtn);

        content.appendChild(title);
        content.appendChild(result);
        content.appendChild(buttonContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };

        const escHandler = (e) => {
            if (e.key === 'Escape' && document.body.contains(modal)) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // 显示通知
    function showNotification(message, type) {
        if (config.showNotification) {
            GM_notification({
                text: message,
                title: '二维码识别',
                timeout: 2500
            });
        }
    }
})();