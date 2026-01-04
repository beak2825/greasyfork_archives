// ==UserScript==
// @name         FaceACG一部动漫 网站增强
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  动漫、里番、COS站
// @author       You
// @match        https://www.faceacg.com/*
// @match        http://www.faceacg.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555986/FaceACG%E4%B8%80%E9%83%A8%E5%8A%A8%E6%BC%AB%20%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/555986/FaceACG%E4%B8%80%E9%83%A8%E5%8A%A8%E6%BC%AB%20%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 创建样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 暗色模式样式 */
        .faceacg-dark-mode {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }
        .faceacg-dark-mode a {
            color: #8ab4f8 !important;
        }
        .faceacg-dark-mode .header, 
        .faceacg-dark-mode .footer,
        .faceacg-dark-mode .sidebar {
            background-color: #2d2d2d !important;
            border-color: #444 !important;
        }
        
        /* 增强功能面板样式 */
        #faceacg-enhance-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            min-width: 150px;
        }
        .faceacg-dark-mode #faceacg-enhance-panel {
            background: #2d2d2d;
            border-color: #555;
            color: #e0e0e0;
        }
        #faceacg-enhance-panel h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .faceacg-dark-mode #faceacg-enhance-panel h3 {
            border-color: #555;
        }
        .faceacg-btn {
            display: block;
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            background: #4a76a8;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            text-align: center;
        }
        .faceacg-btn:hover {
            background: #3a6698;
        }
        .faceacg-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 12px;
        }
        .faceacg-toggle-switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
        }
        .faceacg-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .faceacg-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 17px;
        }
        .faceacg-toggle-slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .faceacg-toggle-slider {
            background-color: #4a76a8;
        }
        input:checked + .faceacg-toggle-slider:before {
            transform: translateX(13px);
        }
        
        /* 阅读模式样式 */
        .faceacg-reading-mode {
            max-width: 800px !important;
            margin: 0 auto !important;
            line-height: 1.6 !important;
            font-size: 16px !important;
            padding: 20px !important;
        }
        .faceacg-reading-mode * {
            max-width: 100% !important;
        }
        
        /* 简化模式样式 */
        .faceacg-simplified-mode .ad,
        .faceacg-simplified-mode .sidebar,
        .faceacg-simplified-mode .recommendation {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 创建增强功能面板
    const panel = document.createElement('div');
    panel.id = 'faceacg-enhance-panel';
    panel.innerHTML = `
        <h3>FaceACG 增强</h3>
        <div class="faceacg-toggle">
            <span>暗色模式</span>
            <label class="faceacg-toggle-switch">
                <input type="checkbox" id="faceacg-dark-mode">
                <span class="faceacg-toggle-slider"></span>
            </label>
        </div>
        <div class="faceacg-toggle">
            <span>阅读模式</span>
            <label class="faceacg-toggle-switch">
                <input type="checkbox" id="faceacg-reading-mode">
                <span class="faceacg-toggle-slider"></span>
            </label>
        </div>
        <div class="faceacg-toggle">
            <span>简化模式</span>
            <label class="faceacg-toggle-switch">
                <input type="checkbox" id="faceacg-simplified-mode">
                <span class="faceacg-toggle-slider"></span>
            </label>
        </div>
        <button class="faceacg-btn" id="faceacg-font-increase">增大字体</button>
        <button class="faceacg-btn" id="faceacg-font-decrease">减小字体</button>
    `;
    document.body.appendChild(panel);
    
    // 获取DOM元素
    const darkModeToggle = document.getElementById('faceacg-dark-mode');
    const readingModeToggle = document.getElementById('faceacg-reading-mode');
    const simplifiedModeToggle = document.getElementById('faceacg-simplified-mode');
    const fontIncreaseBtn = document.getElementById('faceacg-font-increase');
    const fontDecreaseBtn = document.getElementById('faceacg-font-decrease');
    
    // 暗色模式功能
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.classList.add('faceacg-dark-mode');
            localStorage.setItem('faceacg-dark-mode', 'enabled');
        } else {
            document.documentElement.classList.remove('faceacg-dark-mode');
            localStorage.setItem('faceacg-dark-mode', 'disabled');
        }
    });
    
    // 阅读模式功能
    readingModeToggle.addEventListener('change', function() {
        const mainContent = document.querySelector('.main-content, .content, article, .post') || document.body;
        
        if (this.checked) {
            mainContent.classList.add('faceacg-reading-mode');
            localStorage.setItem('faceacg-reading-mode', 'enabled');
        } else {
            mainContent.classList.remove('faceacg-reading-mode');
            localStorage.setItem('faceacg-reading-mode', 'disabled');
        }
    });
    
    // 简化模式功能
    simplifiedModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('faceacg-simplified-mode');
            localStorage.setItem('faceacg-simplified-mode', 'enabled');
        } else {
            document.body.classList.remove('faceacg-simplified-mode');
            localStorage.setItem('faceacg-simplified-mode', 'disabled');
        }
    });
    
    // 字体调整功能
    let currentFontSize = 16;
    fontIncreaseBtn.addEventListener('click', function() {
        currentFontSize += 1;
        document.body.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('faceacg-font-size', currentFontSize);
    });
    
    fontDecreaseBtn.addEventListener('click', function() {
        currentFontSize = Math.max(12, currentFontSize - 1);
        document.body.style.fontSize = currentFontSize + 'px';
        localStorage.setItem('faceacg-font-size', currentFontSize);
    });
    
    // 恢复用户设置
    window.addEventListener('load', function() {
        // 恢复暗色模式设置
        if (localStorage.getItem('faceacg-dark-mode') === 'enabled') {
            darkModeToggle.checked = true;
            document.documentElement.classList.add('faceacg-dark-mode');
        }
        
        // 恢复阅读模式设置
        if (localStorage.getItem('faceacg-reading-mode') === 'enabled') {
            readingModeToggle.checked = true;
            const mainContent = document.querySelector('.main-content, .content, article, .post') || document.body;
            mainContent.classList.add('faceacg-reading-mode');
        }
        
        // 恢复简化模式设置
        if (localStorage.getItem('faceacg-simplified-mode') === 'enabled') {
            simplifiedModeToggle.checked = true;
            document.body.classList.add('faceacg-simplified-mode');
        }
        
        // 恢复字体大小设置
        const savedFontSize = localStorage.getItem('faceacg-font-size');
        if (savedFontSize) {
            currentFontSize = parseInt(savedFontSize);
            document.body.style.fontSize = currentFontSize + 'px';
        }
    });
    
    // 使面板可拖动
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    panel.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
            return;
        }
        
        isDragging = true;
        dragOffset.x = e.clientX - panel.getBoundingClientRect().left;
        dragOffset.y = e.clientY - panel.getBoundingClientRect().top;
        panel.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        panel.style.left = (e.clientX - dragOffset.x) + 'px';
        panel.style.top = (e.clientY - dragOffset.y) + 'px';
        panel.style.right = 'auto';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        panel.style.cursor = 'grab';
    });
})();