// ==UserScript==
// @name         YouTube 网速单位转换器
// @name:en      YouTube Connection Speed Converter
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  在YouTube的"详细统计信息"中，将连接速度(Connection Speed)从Kbps实时转换为MB/s并显示。支持手机端(m.youtube.com)和中文界面。
// @description:en In YouTube's "Stats for nerds", it converts the Connection Speed from Kbps to MB/s in real-time. Supports mobile and Chinese interface.
// @author       BlingCc & Refined for Mobile
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560641/YouTube%20%E7%BD%91%E9%80%9F%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560641/YouTube%20%E7%BD%91%E9%80%9F%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const CONVERTED_VALUE_ID = 'yt-speed-converter-mbps-display';
    const CONVERTED_VALUE_COLOR = '#42a5f5'; // Material Design Blue

    /**
     * 将 Kbps 字符串转换为 MB/s 字符串
     */
    function convertKbpsToMBps(kbpsString) {
        // 移除可能的非数字字符（比如 "Kbps" 后缀）再解析
        const kbps = parseInt(kbpsString.replace(/[^0-9]/g, ''), 10);
        if (isNaN(kbps)) return null;
        const mbps = kbps / 8 / 1024;
        return mbps.toFixed(2);
    }

    /**
     * 核心函数：根据原始网速节点，更新我们添加的 MB/s 显示
     * @param {HTMLElement} speedValueSpan - 显示原始 "XXXX Kbps" 的那个 span 元素
     */
    function updateSpeedDisplay(speedValueSpan) {
        if (!speedValueSpan) return;

        // 读取原始文本并进行转换
        const originalText = speedValueSpan.textContent;
        // 如果文本里不包含数字，可能还没加载好，跳过
        if (!/\d/.test(originalText)) return;

        const mbpsValue = convertKbpsToMBps(originalText);
        if (mbpsValue === null) return;

        // 查找或创建用于显示 MB/s 的元素
        let displayEl = document.getElementById(CONVERTED_VALUE_ID);

        if (!displayEl) {
            displayEl = document.createElement('span');
            displayEl.id = CONVERTED_VALUE_ID;
            displayEl.style.marginLeft = '8px';
            displayEl.style.color = CONVERTED_VALUE_COLOR;
            displayEl.style.fontWeight = 'bold';
            // 针对移动端字体大小可能需要微调，防止换行
            displayEl.style.whiteSpace = 'nowrap'; 
            
            // 将其附加到整个 "Connection Speed" 行的末尾
            if (speedValueSpan.parentElement && speedValueSpan.parentElement.parentElement) {
                 speedValueSpan.parentElement.parentElement.appendChild(displayEl);
            }
        }

        // 更新我们创建的元素的内容
        displayEl.textContent = `(${mbpsValue} MB/s)`;
    }

    /**
     * 当 "详细统计信息" 面板出现时，设置精准的观察者
     * @param {HTMLElement} panelNode - "详细统计信息" 的主面板元素
     */
    function setupSpeedObserver(panelNode) {
        // 1. 精准定位到显示原始网速的那个 <span>
        // 修改点：支持英文 "Connection Speed" 和中文 "连接速度"
        const labelDivXpath = ".//div[contains(text(), 'Connection Speed') or contains(text(), '连接速度')]";
        const labelDiv = document.evaluate(labelDivXpath, panelNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!labelDiv || !labelDiv.nextElementSibling) return;

        // 在某些移动端视图中，结构可能略有不同，尝试获取包含数据的 span
        const speedValueSpan = labelDiv.nextElementSibling.querySelector('span:nth-child(2)') || labelDiv.nextElementSibling.querySelector('span');

        if (speedValueSpan) {
            // 2. 立即执行一次，显示初始值
            updateSpeedDisplay(speedValueSpan);

            // 3. 创建一个只观察这个特定 <span> 文本变化的观察者
            const speedObserver = new MutationObserver(() => {
                updateSpeedDisplay(speedValueSpan);
            });

            // 4. 启动观察者
            speedObserver.observe(speedValueSpan, {
                characterData: true, 
                childList: true,
                subtree: true
            });

            // 5. 将观察者实例附加到面板节点上
            panelNode.speedObserver = speedObserver;
        }
    }

    /**
     * 设置一个主观察者，用于监视"详细统计信息"面板的出现和消失
     */
    function setupMainObserver() {
        // 修改点：移动端 ID 可能不同，或者通过 class 查找更稳妥，这里扩大搜索范围
        // 优先找 movie_player，如果没找到则监视 body (移动端 SPA 变化大)
        const targetNode = document.getElementById('movie_player') || document.getElementById('player') || document.body;
        
        if (!targetNode) {
            // 如果极早期页面甚至 body 都没好
            setTimeout(setupMainObserver, 500);
            return;
        }

        const mainObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                // 监视节点添加
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            // 检查是否是信息面板
                            if (node.classList.contains('html5-video-info-panel')) {
                                setupSpeedObserver(node);
                            }
                            // 有时候面板是作为子元素被添加进来的，向下查找
                            else if (node.querySelector && node.querySelector('.html5-video-info-panel')) {
                                setupSpeedObserver(node.querySelector('.html5-video-info-panel'));
                            }
                        }
                    });
                }
                // 监视节点移除
                if (mutation.removedNodes.length > 0) {
                     mutation.removedNodes.forEach(node => {
                         if (node.nodeType === 1) {
                             let panel = null;
                             if (node.classList.contains('html5-video-info-panel')) {
                                 panel = node;
                             } else if (node.querySelector) {
                                 panel = node.querySelector('.html5-video-info-panel');
                             }
                             
                             if (panel) {
                                 if (panel.speedObserver) {
                                     panel.speedObserver.disconnect();
                                 }
                                 const displayEl = document.getElementById(CONVERTED_VALUE_ID);
                                 if(displayEl) displayEl.remove();
                             }
                         }
                     });
                }
            }
        });

        mainObserver.observe(targetNode, { childList: true, subtree: true });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMainObserver);
    } else {
        setupMainObserver();
    }

})();