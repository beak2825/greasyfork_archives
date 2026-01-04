// ==UserScript==
// @name        多关键词段落搜索器
// @namespace   http://tampermonkey.net/
// @version     0.3
// @description 支持输入多个关键词（用空格分隔），筛选出包含关键词的段落并显示在新的面板中。
// @match       https://maintenance.akuvox.com/download/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554824/%E5%A4%9A%E5%85%B3%E9%94%AE%E8%AF%8D%E6%AE%B5%E8%90%BD%E6%90%9C%E7%B4%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554824/%E5%A4%9A%E5%85%B3%E9%94%AE%E8%AF%8D%E6%AE%B5%E8%90%BD%E6%90%9C%E7%B4%A2%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // ======= 控制面板 =======
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.bottom = '20px';
    controlPanel.style.right = '20px';
    controlPanel.style.background = 'rgba(0,0,0,0.85)';
    controlPanel.style.color = 'white';
    controlPanel.style.padding = '10px 12px';
    controlPanel.style.borderRadius = '10px';
    controlPanel.style.fontSize = '13px';
    controlPanel.style.zIndex = '99999';
    controlPanel.style.fontFamily = 'monospace';
    controlPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    controlPanel.innerHTML = `
        <b>🔍 Log Filter</b><br>
        <input id="keywordInput" type="text" placeholder="输入关键字，用空格分隔"
               style="width:240px; margin-top:6px; padding:3px; border-radius:4px; border:none;">
        <button id="filterBtn" style="margin-left:5px;">过滤</button>
        <button id="clearAllBtn" style="margin-left:5px;">关闭全部面板</button>
        <div id="filterStatus" style="margin-top:6px;color:#ccc;font-size:12px;"></div>
    `;
    document.body.appendChild(controlPanel);

    const keywordInput = document.getElementById('keywordInput');
    const filterBtn = document.getElementById('filterBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const statusDiv = document.getElementById('filterStatus');

    // ======= 日志源区域 =======
    const logContainer = document.querySelector('pre, code') || document.body;
    const originalText = logContainer.innerText;
    const originalLines = originalText.split('\n');

    // 存储所有面板
    const panels = [];

    // ======= 创建结果面板函数 =======
    function createResultPanel(filteredLines) {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = `${20 + panels.length * 30}px`;
        panel.style.left = `${20 + panels.length * 30}px`;
        panel.style.width = '800px';
        panel.style.height = '55vh';
        panel.style.background = 'rgba(30,30,30,0.95)';
        panel.style.color = '#00ff99';
        panel.style.padding = '10px';
        panel.style.borderRadius = '10px';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '12px';
        panel.style.overflow = 'auto';
        panel.style.whiteSpace = 'pre-wrap';
        panel.style.zIndex = '99998';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.6)';
        panel.style.resize = 'both';
        panel.style.border = '2px solid #00ff99';

        // ======= 关闭按钮 =======
        const closeBtn = document.createElement('span');
        closeBtn.innerText = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '4px';
        closeBtn.style.right = '8px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.fontSize = '14px';
        closeBtn.onclick = () => {
            panel.remove();
            const index = panels.indexOf(panel);
            if (index > -1) panels.splice(index, 1);
        };
        panel.appendChild(closeBtn);

        // ======= 内容区域，可复制 =======
        const contentDiv = document.createElement('div');
        contentDiv.style.marginTop = '20px';
        contentDiv.style.userSelect = 'text'; // 支持复制

        // 按行显示，每行可点击定位原文
        filteredLines.forEach(obj => {
            const lineDiv = document.createElement('div');
            lineDiv.innerText = obj.line;
            lineDiv.style.cursor = 'pointer';
            lineDiv.style.padding = '2px 0';
            lineDiv.onmouseover = () => lineDiv.style.background = 'rgba(0,255,153,0.2)';
            lineDiv.onmouseout = () => lineDiv.style.background = 'transparent';
            lineDiv.onclick = () => {
                const targetLineIndex = obj.index;
                // 计算滚动高度
                const preHeight = logContainer.scrollHeight;
                const lineHeight = preHeight / originalLines.length;
                logContainer.scrollTop = lineHeight * targetLineIndex;
            };
            contentDiv.appendChild(lineDiv);

            // 每行之间加分隔符
            const sep = document.createElement('div');
            sep.innerText = '==========';
            sep.style.color = '#999';
            sep.style.fontSize = '10px';
            contentDiv.appendChild(sep);
        });

        panel.appendChild(contentDiv);

        document.body.appendChild(panel);
        panels.push(panel);

        // ======= 可拖动功能 =======
        let isDragging = false;
        let offsetX = 0, offsetY = 0;
        panel.addEventListener('mousedown', (e) => {
            if (e.target === panel) {
                isDragging = true;
                offsetX = e.clientX - panel.offsetLeft;
                offsetY = e.clientY - panel.offsetTop;
                panel.style.cursor = 'move';
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
    }

    // ======= 过滤逻辑 =======
    filterBtn.onclick = function () {
        const inputVal = keywordInput.value.trim();
        if (!inputVal) {
            alert('请输入至少一个关键字');
            return;
        }

        const keywords = inputVal.split(/\s+/);
        const filtered = [];

        originalLines.forEach((line, idx) => {
            if (keywords.every(k => line.toLowerCase().includes(k.toLowerCase()))) {
                filtered.push({ line, index: idx });
            }
        });

        if (filtered.length === 0) {
            alert('未匹配到日志行');
            return;
        }

        createResultPanel(filtered);
        statusDiv.innerText = `✅ 新面板已生成，匹配 ${filtered.length} 行日志`;
    };

    // ======= 清除全部面板 =======
    clearAllBtn.onclick = function () {
        panels.forEach(p => p.remove());
        panels.length = 0;
        statusDiv.innerText = '🧹 已关闭全部面板';
    };

})();


