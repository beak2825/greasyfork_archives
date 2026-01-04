// ==UserScript==
// @name         🚀网盘分享与搜索神器——资源分享者必备的工具箱！
// @namespace    https://google.com
// @version      1.7
// @description  支持一键去除阿里云盘、夸克网盘以及百度网盘的引流广告文字，支持自定义要去除的文本（字符），支持一键搜索你想要找的资源，支持复制和清空，支持拖拽移动位置，支持边缘自动隐藏
// @author       ssenx
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552098/%F0%9F%9A%80%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E4%B8%8E%E6%90%9C%E7%B4%A2%E7%A5%9E%E5%99%A8%E2%80%94%E2%80%94%E8%B5%84%E6%BA%90%E5%88%86%E4%BA%AB%E8%80%85%E5%BF%85%E5%A4%87%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/552098/%F0%9F%9A%80%E7%BD%91%E7%9B%98%E5%88%86%E4%BA%AB%E4%B8%8E%E6%90%9C%E7%B4%A2%E7%A5%9E%E5%99%A8%E2%80%94%E2%80%94%E8%B5%84%E6%BA%90%E5%88%86%E4%BA%AB%E8%80%85%E5%BF%85%E5%A4%87%E7%9A%84%E5%B7%A5%E5%85%B7%E7%AE%B1%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UI样式
    const style = `
        #customToggleButton {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #007bff;
            color: white;
            text-align: center;
            line-height: 60px;
            font-size: 24px;
            cursor: move;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            z-index: 10001;
            user-select: none;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        #customToggleButton:active {
            cursor: grabbing;
        }
        #customToggleButton.hidden-left {
            transform: translateX(-45px);
            opacity: 0.3;
        }
        #customToggleButton.hidden-right {
            transform: translateX(45px);
            opacity: 0.3;
        }
        #customToggleButton.hidden-top {
            transform: translateY(-45px);
            opacity: 0.3;
        }
        #customToggleButton.hidden-bottom {
            transform: translateY(45px);
            opacity: 0.3;
        }
        #customToggleButton:hover {
            transform: translateX(0) translateY(0) !important;
            opacity: 1 !important;
        }
        #customContainer {
            display: none;
            position: fixed;
            right: 20px;
            bottom: 100px;
            width: 300px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border-radius: 8px;
            background-color: #f8f9fa;
            padding: 10px;
        }
        #customContainer.dragging {
            opacity: 0.8;
        }
        #dragHandle {
            width: 100%;
            height: 30px;
            background-color: #007bff;
            color: white;
            text-align: center;
            line-height: 30px;
            border-radius: 8px 8px 0 0;
            cursor: move;
            margin: -10px -10px 10px -10px;
            padding: 0 10px;
            user-select: none;
        }
        #dragHandle:active {
            cursor: grabbing;
        }
        #customTextarea {
            width: 280px;
            height: 100px;
            margin-bottom: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            padding: 5px;
        }
        .customButton {
            width: calc(50% - 4px);
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            display: inline-block;
            margin-right: 4px;
            margin-bottom: 4px;
        }
        .customButton:last-child {
            margin-right: 0;
        }
    `;

    // 添加样式
    const head = document.head || document.getElementsByTagName('head')[0],
          styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    if (styleTag.styleSheet){
      styleTag.styleSheet.cssText = style;
    } else {
      styleTag.appendChild(document.createTextNode(style));
    }
    head.appendChild(styleTag);

    // 创建界面元素
    const container = document.createElement('div');
    container.id = 'customContainer';
    document.body.appendChild(container);

    // 添加拖拽手柄
    const dragHandle = document.createElement('div');
    dragHandle.id = 'dragHandle';
    dragHandle.innerHTML = '⋮⋮ 拖动此处移动 ⋮⋮';
    container.appendChild(dragHandle);

    const textArea = document.createElement('textarea');
    textArea.id = 'customTextarea';
    container.appendChild(textArea);

    const button = document.createElement('button');
    button.classList.add('customButton');
    button.innerHTML = '一键优化分享文本';
    container.appendChild(button);

    const toggleButton = document.createElement('div');
    toggleButton.id = 'customToggleButton';
    toggleButton.innerHTML = '🚀';
    document.body.appendChild(toggleButton);

    // 拖拽功能实现
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            isDragging = false;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            isDragging = true;
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // 边界检测
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = "auto";
            element.style.bottom = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;

            // 拖拽结束后检查是否靠近边缘
            if (element === toggleButton) {
                checkEdgeHide();
            }

            // 如果没有拖动，则触发点击事件
            if (!isDragging && element === toggleButton) {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            }
        }
    }

    // 边缘隐藏检测
    function checkEdgeHide() {
        const rect = toggleButton.getBoundingClientRect();
        const threshold = 10; // 距离边缘多少像素时触发隐藏

        // 移除所有隐藏类
        toggleButton.classList.remove('hidden-left', 'hidden-right', 'hidden-top', 'hidden-bottom');

        // 检查是否靠近边缘
        if (rect.left <= threshold) {
            toggleButton.classList.add('hidden-left');
        } else if (rect.right >= window.innerWidth - threshold) {
            toggleButton.classList.add('hidden-right');
        } else if (rect.top <= threshold) {
            toggleButton.classList.add('hidden-top');
        } else if (rect.bottom >= window.innerHeight - threshold) {
            toggleButton.classList.add('hidden-bottom');
        }
    }

    // 监听窗口大小变化，重新检查边缘隐藏
    window.addEventListener('resize', () => {
        checkEdgeHide();
    });

    // 初始化时检查一次
    setTimeout(() => {
        checkEdgeHide();
    }, 100);

    // 为悬浮按钮添加拖拽功能
    makeDraggable(toggleButton, toggleButton);

    // 为工具面板添加拖拽功能
    makeDraggable(container, dragHandle);

    // 按钮点击事件
    button.onclick = function() {
        let text = textArea.value;
        // 正则表达式匹配并处理文本
        // 夸克网盘
        text = text.replace(/我用夸克网盘分享了「(.*?)」，点击链接即可保存。打开「夸克APP」，无需下载在线播放视频，畅享原画5倍速，支持电视投屏。\n链接：(https?:\/\/\S+)/g, '$1\n链接：$2');
        // 阿里云盘
        text = text.replace(/(.*?)\n(https?:\/\/www\.alipan\.com\/s\/\S+)\n点击链接保存，或者复制本段内容，打开「阿里云盘」APP ，无需下载极速在线查看，视频原画倍速播放。/g, '$1\n链接：$2');
        // 百度网盘
        text = text.replace(/链接：(https?:\/\/pan\.baidu\.com\/s\/\S+)?pwd=([\w\d]+)\s*提取码：(\w+)\s*复制这段内容后打开百度网盘手机App，操作更方便哦/g, '链接：$1\n提取码：$3');
        // 迅雷网盘
        text = text.replace(/「链接：(https?:\/\/pan\.xunlei\.com\/\S+)\s*提取码：(\w+)"复制这段内容后打开手机迅雷App，查看更方便」/g, '链接：$1 提取码：$2');
        textArea.value = text;
    };

    // 创建去除双引号按钮
    const removeButton = document.createElement('button');
    removeButton.classList.add('customButton');
    removeButton.innerHTML = '一键去除特殊字符';
    container.appendChild(removeButton);

    // 创建自定义查找替换按钮
    const customReplaceButton = document.createElement('button');
    customReplaceButton.classList.add('customButton');
    customReplaceButton.innerHTML = '自定义特殊字符';
    container.appendChild(customReplaceButton);

    // 创建搜索按钮
    const searchButton = document.createElement('button');
    searchButton.classList.add('customButton');
    searchButton.innerHTML = '一键搜索网盘资源';
    container.appendChild(searchButton);

    // 去除双引号按钮点击事件
    removeButton.onclick = function() {
        textArea.value = textArea.value.replace(/"/g, '');
    };

    // 标记是否处于自定义查找替换模式
    let isCustomReplaceMode = false;

    // 自定义查找替换按钮点击事件
    customReplaceButton.onclick = function() {
        if (!isCustomReplaceMode) {
            const input = document.createElement('input');
            input.type = 'text';
            input.style = 'width: calc(50% - 4px); height: 30px;';
            container.insertBefore(input, removeButton);
            container.removeChild(removeButton);
            customReplaceButton.innerHTML = '保存';
            isCustomReplaceMode = true;
        } else {
            const input = container.querySelector('input[type="text"]');
            const searchText = input.value.split('/')[0];
            const replaceText = input.value.split('/')[1] || '';
            textArea.value = textArea.value.replace(new RegExp(searchText, 'g'), replaceText);
            container.insertBefore(removeButton, input);
            container.removeChild(input);
            customReplaceButton.innerHTML = '自定义特殊字符';
            isCustomReplaceMode = false;
        }
    };

    // 搜索按钮点击事件
    searchButton.onclick = () => {
        const searchText = encodeURIComponent(textArea.value);
        const searchUrl = `https://www.pikaso.top/search/?q=${searchText}`;
        window.open(searchUrl, '_blank');
    };

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.classList.add('customButton');
    copyButton.innerHTML = '复制';
    container.appendChild(copyButton);

    // 创建清空按钮
    const clearButton = document.createElement('button');
    clearButton.classList.add('customButton');
    clearButton.innerHTML = '清空';
    container.appendChild(clearButton);

    // 复制按钮点击事件
    copyButton.onclick = function() {
        textArea.select();
        document.execCommand('copy');
        alert('内容已复制到剪贴板');
    };

    // 清空按钮点击事件
    clearButton.onclick = function() {
        textArea.value = '';
    };
})();