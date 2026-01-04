// ==UserScript==
// @name         Chiphell 论坛字体大小调整工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自从被轮大改版后有点大，感觉不习惯了，这个脚本允许用户手动调整Chiphell论坛帖子的字体大小，让轮大想大就大，如果需要大家可以自行修改。让轮大大到你无法想象~
// @author       @猫儿扛着枪
// @match        https://www.chiphell.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560467/Chiphell%20%E8%AE%BA%E5%9D%9B%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/560467/Chiphell%20%E8%AE%BA%E5%9D%9B%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板容器
    const panel = document.createElement('div');
    panel.id = 'chiphell-font-control-panel';
    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.zIndex = '9999';
    panel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.3)';
    panel.style.padding = '15px';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '10px';
    panel.style.fontFamily = '"Microsoft YaHei", sans-serif';
    panel.style.border = '1px solid #ddd';

    // 创建标题
    const title = document.createElement('div');
    title.textContent = '字体大小调整';
    title.style.fontWeight = 'bold';
    title.style.textAlign = 'center';
    title.style.marginBottom = '8px';
    title.style.color = '#333';
    title.style.fontSize = '16px';

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';

    // 创建减小按钮
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '减小';
    decreaseBtn.style.flex = '1';
    decreaseBtn.style.padding = '10px 0';
    decreaseBtn.style.backgroundColor = '#f5f5f5';
    decreaseBtn.style.border = '1px solid #ddd';
    decreaseBtn.style.borderRadius = '6px';
    decreaseBtn.style.cursor = 'pointer';
    decreaseBtn.style.fontSize = '14px';
    decreaseBtn.style.transition = 'all 0.3s';

    // 创建重置按钮
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '重置';
    resetBtn.style.flex = '1';
    resetBtn.style.padding = '10px 0';
    resetBtn.style.backgroundColor = '#f5f5f5';
    resetBtn.style.border = '1px solid #ddd';
    resetBtn.style.borderRadius = '6px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontSize = '14px';
    resetBtn.style.transition = 'all 0.3s';

    // 创建增大按钮
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '增大';
    increaseBtn.style.flex = '1';
    increaseBtn.style.padding = '10px 0';
    increaseBtn.style.backgroundColor = '#f5f5f5';
    increaseBtn.style.border = '1px solid #ddd';
    increaseBtn.style.borderRadius = '6px';
    increaseBtn.style.cursor = 'pointer';
    increaseBtn.style.fontSize = '14px';
    increaseBtn.style.transition = 'all 0.3s';

    // 添加到容器
    buttonContainer.appendChild(decreaseBtn);
    buttonContainer.appendChild(resetBtn);
    buttonContainer.appendChild(increaseBtn);
    panel.appendChild(title);
    panel.appendChild(buttonContainer);

    // 添加到页面
    document.body.appendChild(panel);

    // 当前字体大小（默认为100%）
    let fontSize = localStorage.getItem('chiphellFontSize') || 100;
    fontSize = parseInt(fontSize);

    // 应用字体大小到论坛内容区域
    function applyFontSize() {
        // 移除旧样式
        const oldStyle = document.getElementById('chiphell-font-style');
        if (oldStyle) oldStyle.remove();
        
        // 创建新样式
        const style = document.createElement('style');
        style.id = 'chiphell-font-style';
        style.textContent = `
            .t_f, .t_fsz { 
                font-size: ${fontSize}% !important; 
            }
            .message { 
                font-size: ${fontSize}% !important; 
            }
            .vwthd { 
                font-size: ${fontSize + 10}% !important; 
            }
        `;
        document.head.appendChild(style);
        
        // 保存设置
        localStorage.setItem('chiphellFontSize', fontSize);
    }

    // 初始化字体大小
    applyFontSize();

    // 按钮事件处理
    decreaseBtn.addEventListener('click', () => {
        fontSize = Math.max(70, fontSize - 10); // 最小70%
        applyFontSize();
    });

    resetBtn.addEventListener('click', () => {
        fontSize = 100;
        applyFontSize();
    });

    increaseBtn.addEventListener('click', () => {
        fontSize = Math.min(150, fontSize + 10); // 最大150%
        applyFontSize();
    });

    // 添加悬停效果
    [decreaseBtn, resetBtn, increaseBtn].forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#e9e9e9';
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = '#f5f5f5';
            btn.style.transform = 'translateY(0)';
        });
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(2px)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(0)';
        });
    });

    // 添加拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    title.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.right = 'unset';
            panel.style.bottom = 'unset';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = '';
    });

    // 添加关闭按钮
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '8px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.color = '#999';
    closeBtn.addEventListener('click', () => {
        panel.style.display = 'none';
    });
    panel.appendChild(closeBtn);
})();