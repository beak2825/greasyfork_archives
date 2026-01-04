// ==UserScript==
// @name         Storage Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示网页存储的Storage内容到悬浮窗
// @author       Dahi
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551317/Storage%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/551317/Storage%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮窗容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.top = '20px';
    container.style.width = '300px';
    container.style.maxHeight = '500px';
    container.style.overflow = 'auto';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    container.style.zIndex = '9999';
    container.style.padding = '10px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '12px';
    container.style.borderRadius = '5px';

    // 创建标题栏
    const header = document.createElement('div');
    header.textContent = 'Storage Viewer (可拖动)';
    header.style.padding = '5px';
    header.style.backgroundColor = '#f0f0f0';
    header.style.cursor = 'move';
    header.style.borderBottom = '1px solid #ddd';
    header.style.marginBottom = '10px';
    header.style.userSelect = 'none';

    // 创建内容区域
    const content = document.createElement('div');
    content.id = 'storage-content';

    // 创建刷新按钮
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '刷新';
    refreshBtn.style.marginTop = '10px';
    refreshBtn.style.padding = '5px 10px';
    refreshBtn.style.cursor = 'pointer';

    // 组装元素
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(refreshBtn);
    document.body.appendChild(container);

    // 更新Storage显示
    function updateStorageDisplay() {
        let html = '<h3 style="margin:0 0 5px 0;">localStorage</h3>';
        
        if (localStorage.length > 0) {
            html += '<table style="width:100%; border-collapse:collapse; margin-bottom:15px;">';
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                html += `
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:3px; font-weight:bold; width:30%; word-break:break-all;">${escapeHtml(key)}</td>
                        <td style="padding:3px; word-break:break-all;">${escapeHtml(value)}</td>
                    </tr>
                `;
            }
            html += '</table>';
        } else {
            html += '<p>空</p>';
        }

        html += '<h3 style="margin:15px 0 5px 0;">sessionStorage</h3>';
        
        if (sessionStorage.length > 0) {
            html += '<table style="width:100%; border-collapse:collapse;">';
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                const value = sessionStorage.getItem(key);
                html += `
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:3px; font-weight:bold; width:30%; word-break:break-all;">${escapeHtml(key)}</td>
                        <td style="padding:3px; word-break:break-all;">${escapeHtml(value)}</td>
                    </tr>
                `;
            }
            html += '</table>';
        } else {
            html += '<p>空</p>';
        }

        content.innerHTML = html;
    }

    // HTML转义函数
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 拖拽功能
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'move';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
        container.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'default';
    });

    // 刷新按钮点击事件
    refreshBtn.addEventListener('click', updateStorageDisplay);

    // 初始显示
    updateStorageDisplay();

    // 监听storage变化
    window.addEventListener('storage', updateStorageDisplay);
})();