// ==UserScript==
// @name         Wallhaven 裁剪辅助 (自动填入+倍数选择)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wallhaven壁纸详情页，点击裁剪下载时，自动填入原图分辨率，并提供1/2, 1/3等倍数缩放选项。
// @author       You
// @license      MIT
// @match        https://wallhaven.cc/w/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wallhaven.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563661/Wallhaven%20%E8%A3%81%E5%89%AA%E8%BE%85%E5%8A%A9%20%28%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%2B%E5%80%8D%E6%95%B0%E9%80%89%E6%8B%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563661/Wallhaven%20%E8%A3%81%E5%89%AA%E8%BE%85%E5%8A%A9%20%28%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5%2B%E5%80%8D%E6%95%B0%E9%80%89%E6%8B%A9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const MAX_SCALE = 5; // 最大缩小倍数

    // === 工具函数：获取原始分辨率 ===
    function getOriginalResolution() {
        // Wallhaven 详情页的分辨率通常在 sidebar 的 h3.showcase-resolution 标签里
        // 格式通常是 "3840 x 1650"
        const resElement = document.querySelector('h3.showcase-resolution');
        if (resElement) {
            const text = resElement.textContent.trim();
            const parts = text.split('x');
            if (parts.length === 2) {
                return {
                    w: parseInt(parts[0].trim(), 10),
                    h: parseInt(parts[1].trim(), 10)
                };
            }
        }
        return null;
    }

    // === 工具函数：触发输入框事件 ===
    // 仅仅修改 value 有时候网页检测不到，需要手动触发 input 事件
    function triggerInputEvent(element) {
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
        const event2 = new Event('change', { bubbles: true });
        element.dispatchEvent(event2);
    }

    // === 核心逻辑：注入UI到弹窗 ===
    function injectControlPanel(modal, inputW, inputH) {
        // 防止重复注入 (如果已经注入过，就退出去)
        if (modal.querySelector('#wh-scale-selector')) return;

        const originalRes = getOriginalResolution();
        if (!originalRes) {
            console.log("未找到原始分辨率，脚本停止注入。");
            return;
        }

        console.log(`获取到原图分辨率: ${originalRes.w} x ${originalRes.h}`);

        // 1. 自动填入默认分辨率 (原图)
        inputW.value = originalRes.w;
        inputH.value = originalRes.h;
        triggerInputEvent(inputW);
        triggerInputEvent(inputH);

        // 2. 创建倍数选择下拉框
        const select = document.createElement('select');
        select.id = 'wh-scale-selector';
        select.style.marginLeft = '10px';
        select.style.padding = '5px';
        select.style.borderRadius = '4px';
        select.style.backgroundColor = '#2b2b2b'; // 配合深色主题
        select.style.color = '#fff';
        select.style.border = '1px solid #444';
        select.style.cursor = 'pointer';

        // 添加选项
        for (let i = 1; i <= MAX_SCALE; i++) {
            const option = document.createElement('option');
            option.value = i;
            if (i === 1) {
                option.text = `原图 (1x)`;
            } else {
                option.text = `缩小 ${i} 倍 (1/${i})`;
            }
            select.appendChild(option);
        }

        // 3. 监听下拉框变化
        select.addEventListener('change', function() {
            const factor = parseInt(this.value, 10);
            
            // 计算新分辨率 (向下取整)
            const newW = Math.floor(originalRes.w / factor);
            const newH = Math.floor(originalRes.h / factor);

            // 更新输入框
            inputW.value = newW;
            inputH.value = newH;
            
            // 触发事件让网页知道值变了
            triggerInputEvent(inputW);
            triggerInputEvent(inputH);
        });

        // 4. 将下拉框插入到页面
        // 寻找输入框的父容器，把它插在 Height 输入框后面
        // 这里的 DOM 结构可能需要根据实际情况微调，一般插在 inputH 后面即可
        if (inputH.parentNode) {
            // 创建一个简单的容器来包裹，或者直接插入
            inputH.parentNode.style.display = 'flex'; // 确保横向排列(如果有必要)
            inputH.parentNode.style.alignItems = 'center';
            inputH.parentNode.appendChild(select);
        }
    }

    // === 监听器：使用 MutationObserver 监听弹窗出现 ===
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                // 遍历新增的节点
                mutation.addedNodes.forEach(node => {
                    // 确保是元素节点
                    if (node.nodeType === 1) {
                        // 检查是否是那个弹窗 (根据截图和经验推测)
                        // Wallhaven 弹窗里有 Width 和 Height 的 placeholder
                        const inputW = node.querySelector('input[placeholder="Width"]');
                        const inputH = node.querySelector('input[placeholder="Height"]');
                        
                        // 如果在新增的节点里找到了这两个输入框，说明弹窗加载了
                        if (inputW && inputH) {
                            // 找到包含输入框的那个区域容器，用于注入
                            // 传入 node 或者具体的 form 容器
                            injectControlPanel(node, inputW, inputH);
                        }
                    }
                });
            }
        }
    });

    // 开始监听 body 的变化 (subtree: true 表示监听所有子孙节点的变化)
    observer.observe(document.body, { childList: true, subtree: true });

})();