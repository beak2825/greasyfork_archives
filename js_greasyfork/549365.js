// ==UserScript==
// @name             AGE动漫 绕过播放限制V2
// @namespace     https://github.com/sardinfish/greasyfork-agefans-bypass-pclimits-v2
// @license           MIT
// @version           2.0.1
// @description  绕过部分番剧的「非常抱歉，由于视频版权原因，暂不提供PC端播放，请下载APP进行观看。」
// @author       sardinfish
// @match        https://*/play/*
// @match        https://*/#/play/*
// @downloadURL https://update.greasyfork.org/scripts/549365/AGE%E5%8A%A8%E6%BC%AB%20%E7%BB%95%E8%BF%87%E6%92%AD%E6%94%BE%E9%99%90%E5%88%B6V2.user.js
// @updateURL https://update.greasyfork.org/scripts/549365/AGE%E5%8A%A8%E6%BC%AB%20%E7%BB%95%E8%BF%87%E6%92%AD%E6%94%BE%E9%99%90%E5%88%B6V2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // URL转换函数
    function convertUrl(currentUrl, toMobile) {
        if (toMobile) {
            // PC端转移动端：www改为m，在/play前加#/
            return currentUrl
                .replace('www.', 'm.')
                .replace('/play', '/#/play');
        } else {
            // 移动端转PC端：m改为www，在/play前删#/
            return currentUrl
                .replace('m.', 'www.')
                .replace('/#/play', '/play');
        }
    }
    
    // 创建浮窗样式
    const style = document.createElement('style');
    style.textContent = `
        .custom-float-window {
            position: fixed;
            z-index: 10000;
            top: 20px;
            right: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 15px;
            min-width: 250px;
            font-family: Arial, sans-serif;
            border-left: 4px solid #e74c3c;
            animation: floatFadeIn 0.3s ease;
        }
        @keyframes floatFadeIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .custom-float-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #e74c3c;
        }
        .custom-float-message {
            margin-bottom: 12px;
            line-height: 1.4;
            font-size: 14px;
        }
        .custom-float-button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
            width: 100%;
        }
        .custom-float-button:hover {
            background-color: #2980b9;
        }
        .custom-float-close {
            position: absolute;
            top: 8px;
            right: 8px;
            color: #999;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            line-height: 1;
        }
        .custom-float-close:hover {
            color: #333;
        }
    `;
    document.head.appendChild(style);
    
    // 创建右上角浮窗
    function createFloatWindow(message, buttonText, onClick) {
        // 移除已存在的浮窗
        const existingWindow = document.getElementById('customFloatWindow');
        if (existingWindow) {
            existingWindow.remove();
        }
        
        const floatWindow = document.createElement('div');
        floatWindow.id = 'customFloatWindow';
        floatWindow.className = 'custom-float-window';
        floatWindow.innerHTML = `
            <span class="custom-float-close">&times;</span>
            <div class="custom-float-title">提示</div>
            <div class="custom-float-message">${message}</div>
            <button class="custom-float-button">${buttonText}</button>
        `;
        
        document.body.appendChild(floatWindow);
        
        // 添加事件监听
        const closeBtn = floatWindow.querySelector('.custom-float-close');
        const actionBtn = floatWindow.querySelector('.custom-float-button');
        
        closeBtn.onclick = function() {
            floatWindow.remove();
        };
        
        actionBtn.onclick = onClick;
        
    }
    
    // 检测横屏状态并应用样式
    function checkOrientationAndApplyStyles() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isLandscape) {
            document.body.style.width = "50%";
            document.body.style.margin = "0 auto";
        } else {
            document.body.style.width = "";
            document.body.style.margin = "";
        }
        
        return isLandscape;
    }
    
    // 检查元素并执行相应操作
    function checkForElements() {
        const cpraidElement = document.getElementById('cpraid');
        const appElement = document.getElementById('app');
        
        if (cpraidElement) {
            // 检测到PC端限制播放
            createFloatWindow(
                '<span style=color:black>检测到PC端限制播放，点击链接切换到网页移动端播放。</span>',
                '切换到移动端',
                function() {
                    const mobileUrl = convertUrl(window.location.href, true);
                    window.location.href = mobileUrl;
                }
            );
        }
        
        if (appElement) {
            // 检测到移动端
            const isLandscape = checkOrientationAndApplyStyles();
            
            createFloatWindow(
                '<span style=color:black><p>当前处于移动端模式</p><p>如遇异常请刷新页面</p>' + (isLandscape ? '<p> √ 横屏优化已开启</p></span>' : '</span>'),
                '返回PC端',
                function() {
                    const pcUrl = convertUrl(window.location.href, false);
                    window.location.href = pcUrl;
                }
            );
            
            // 监听窗口大小变化（横竖屏切换）
            window.addEventListener('resize', checkOrientationAndApplyStyles);
        }
        
        return cpraidElement || appElement;
    }
    
    // 初始检查
    if (checkForElements()) {
        return;
    }
    
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        checkForElements();
    });
    
    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();