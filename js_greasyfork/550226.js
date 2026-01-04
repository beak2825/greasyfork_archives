// ==UserScript==
// @name         PublishMarkdown导出PNG
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  为 PublishMarkdown 页面添加 PNG 导出功能 - 仅文本内容
// @author       船长zscc
// @match        https://publishmarkdown.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550226/PublishMarkdown%E5%AF%BC%E5%87%BAPNG.user.js
// @updateURL https://update.greasyfork.org/scripts/550226/PublishMarkdown%E5%AF%BC%E5%87%BAPNG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建PNG按钮
    function createPNGButton() {
        const pngButton = document.createElement('button');
        pngButton.innerHTML = `
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
                <path stroke="currentColor" stroke-width="1.5" d="M3 15h18"/>
            </svg>
        `;
        pngButton.className = 'p-3 text-primary-dark/40 hover:text-primary-dark/70 transition-all duration-200 hover:bg-primary-gray/20 png-generator-button';
        pngButton.title = '生成 PNG';
        pngButton.style.cursor = 'pointer';
        return pngButton;
    }

    // 移除所有图片元素
    function removeImages(element) {
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            img.remove();
        });
    }

    // 生成PNG
    async function generatePNG() {
        try {
            // 加载html2canvas
            if (typeof html2canvas === 'undefined') {
                console.log('加载html2canvas...');
                showNotification('加载截图库...', 'info');
                const script = document.createElement('script');
                script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
                document.head.appendChild(script);
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('无法加载截图库'));
                    setTimeout(() => reject(new Error('加载超时')), 10000);
                });
            }

            // 查找内容容器
            const contentElement = document.querySelector('.bg-primary-white') ||
                                 document.querySelector('.markdown-content');

            if (!contentElement) {
                throw new Error('未找到内容容器');
            }

            console.log('找到内容容器，开始处理...');
            showNotification('正在处理内容...', 'info');

            // 克隆元素避免影响原页面
            const clonedElement = contentElement.cloneNode(true);

            // 移除所有图片
            removeImages(clonedElement);

            // 隐藏按钮
            const buttons = clonedElement.querySelectorAll('.png-generator-button, .absolute.top-0.right-0');
            buttons.forEach(btn => btn.remove());

            // 设置样式
            clonedElement.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                width: 800px;
                max-width: 800px;
                padding: 40px;
                background: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                line-height: 1.6;
                color: #333;
                box-shadow: none;
                border: none;
            `;

            // 添加到页面
            document.body.appendChild(clonedElement);

            try {
                showNotification('正在生成PNG...', 'info');

                const canvas = await html2canvas(clonedElement, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: false,
                    allowTaint: true,
                    logging: false,
                    width: 800,
                    height: clonedElement.scrollHeight + 80,
                    windowWidth: 800,
                    windowHeight: clonedElement.scrollHeight + 80
                });

                console.log(`PNG生成成功: ${canvas.width}x${canvas.height}`);
                return canvas.toDataURL('image/png', 0.9);

            } finally {
                // 清理克隆元素
                if (clonedElement.parentNode) {
                    document.body.removeChild(clonedElement);
                }
            }

        } catch (error) {
            console.error('生成PNG失败:', error);
            throw error;
        }
    }

    // 复制到剪贴板
    async function copyPNGToClipboard() {
        try {
            const dataUrl = await generatePNG();

            // 转换为blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            if (navigator.clipboard && navigator.clipboard.write) {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                showNotification('PNG已复制到剪贴板', 'success');
            } else {
                // 降级到下载
                downloadBlob(blob);
                showNotification('已自动下载PNG文件', 'success');
            }

        } catch (error) {
            console.error('复制失败:', error);
            showNotification(`操作失败: ${error.message}`, 'error');
        }
    }

    // 下载PNG
    async function downloadPNG() {
        try {
            const dataUrl = await generatePNG();

            const response = await fetch(dataUrl);
            const blob = await response.blob();

            downloadBlob(blob);
            showNotification('PNG已下载', 'success');

        } catch (error) {
            console.error('下载失败:', error);
            showNotification(`下载失败: ${error.message}`, 'error');
        }
    }

    // 下载blob文件
    function downloadBlob(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `publishmarkdown-content-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 显示通知
    function showNotification(message, type = 'success') {
        const old = document.querySelector('.png-notification');
        if (old) old.remove();

        const colors = {success: '#10b981', error: '#ef4444', info: '#3b82f6'};
        const notification = document.createElement('div');
        notification.className = 'png-notification';
        notification.innerHTML = message.replace(/\n/g, '<br>');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 16px 20px;
            background: ${colors[type]}; color: white; border-radius: 8px;
            z-index: 10000; font-family: system-ui; font-size: 14px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2); max-width: 350px;
            line-height: 1.4; word-wrap: break-word;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), type === 'error' ? 8000 : 4000);
    }

    // 手动截图提示
    function showManualScreenshotGuide() {
        const guide = document.createElement('div');
        guide.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 30px; border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 10001;
            max-width: 500px; font-family: system-ui; line-height: 1.6;
        `;

        guide.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #333;">
                📸 手动截图指南
            </div>
            <div style="color: #666; margin-bottom: 20px;">
                由于技术限制，无法自动截取外部图片。您可以使用以下方法：
            </div>
            <div style="margin: 12px 0; padding: 12px; background: #f5f5f5; border-radius: 6px;">
                <strong>Chrome/Edge:</strong> Ctrl+Shift+S (Windows) 或 Cmd+Shift+5 (Mac)
            </div>
            <div style="margin: 12px 0; padding: 12px; background: #f5f5f5; border-radius: 6px;">
                <strong>Firefox:</strong> 按F12 → 截图工具 → 截取整页
            </div>
            <div style="margin: 12px 0; padding: 12px; background: #f5f5f5; border-radius: 6px;">
                <strong>Safari:</strong> Cmd+Shift+4 选择截图区域
            </div>
            <button id="close-guide" style="
                background: #0066cc; color: white; border: none; padding: 10px 20px;
                border-radius: 6px; cursor: pointer; margin-top: 16px; font-size: 14px;
            ">我知道了</button>
        `;

        document.body.appendChild(guide);

        document.getElementById('close-guide').onclick = () => guide.remove();

        // 3秒后自动关闭
        setTimeout(() => {
            if (guide.parentNode) guide.remove();
        }, 10000);
    }

    // 添加按钮
    function addButton() {
        if (document.querySelector('.png-generator-button')) return;

        const container = document.querySelector('div.absolute.top-0.right-0.flex');
        if (!container) {
            setTimeout(addButton, 1000);
            return;
        }

        const button = createPNGButton();
        let timer;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            copyPNGToClipboard();
        });

        button.addEventListener('mousedown', () => {
            timer = setTimeout(() => downloadPNG(), 800);
        });
        button.addEventListener('mouseup', () => clearTimeout(timer));
        button.addEventListener('mouseleave', () => clearTimeout(timer));

        // 右键显示手动截图指南
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showManualScreenshotGuide();
        });

        container.insertBefore(button, container.firstChild);
        console.log('PNG按钮已添加');
    }

    // 初始化
    function init() {
        console.log('PublishMarkdown导出PNG 启动');
        console.log('- 点击: 复制PNG');
        console.log('- 长按: 下载PNG');
        console.log('- 右键: 手动截图指南');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButton);
        } else {
            addButton();
        }

        new MutationObserver(() => {
            if (!document.querySelector('.png-generator-button')) {
                setTimeout(addButton, 500);
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    init();
})();
