// ==UserScript==
// @name         YouTube 网速单位转换器
// @name:en      YouTube Connection Speed Converter
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在YouTube的"详细统计信息"中，将连接速度(Connection Speed)从Kbps实时转换为MB/s并显示。
// @description:en In YouTube's "Stats for nerds", it converts the Connection Speed from Kbps to MB/s in real-time.
// @author       BlingCc
// @match               *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555329/YouTube%20%E7%BD%91%E9%80%9F%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555329/YouTube%20%E7%BD%91%E9%80%9F%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
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
        const kbps = parseInt(kbpsString, 10);
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
            // 将其附加到整个 "Connection Speed" 行的末尾
            // speedValueSpan -> parent <span> -> parent <div> (the row)
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
        const labelDivXpath = ".//div[text()='Connection Speed']";
        const labelDiv = document.evaluate(labelDivXpath, panelNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!labelDiv || !labelDiv.nextElementSibling) return;

        const speedValueSpan = labelDiv.nextElementSibling.querySelector('span:nth-child(2)');

        if (speedValueSpan) {
            // 2. 立即执行一次，显示初始值
            updateSpeedDisplay(speedValueSpan);

            // 3. 创建一个只观察这个特定 <span> 文本变化的观察者
            const speedObserver = new MutationObserver(() => {
                // 当 YouTube 更新网速时，再次调用我们的更新函数
                updateSpeedDisplay(speedValueSpan);
            });

            // 4. 启动观察者，只监视目标节点的文本内容和子节点变化
            speedObserver.observe(speedValueSpan, {
                characterData: true, // 监视文本节点的变化
                childList: true      // 监视子节点（以防万一 YouTube 替换了整个文本节点）
            });

            // 5. 将观察者实例附加到面板节点上，以便在面板关闭时可以断开它
            panelNode.speedObserver = speedObserver;
        }
    }


    /**
     * 设置一个主观察者，用于监视"详细统计信息"面板的出现和消失
     */
    function setupMainObserver() {
        const targetNode = document.getElementById('movie_player');
        if (!targetNode) {
            setTimeout(setupMainObserver, 500);
            return;
        }

        const mainObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                // 监视节点添加
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('html5-video-info-panel')) {
                            // 面板出现了！调用我们的函数来设置精准的内部观察者
                            setupSpeedObserver(node);
                        }
                    });
                }
                // 监视节点移除
                if (mutation.removedNodes.length > 0) {
                     mutation.removedNodes.forEach(node => {
                         if (node.nodeType === 1 && node.classList.contains('html5-video-info-panel')) {
                             // 如果面板被移除，并且我们之前附加了观察者，就断开它，防止内存泄漏
                             if (node.speedObserver) {
                                 node.speedObserver.disconnect();
                             }
                             // 同时移除我们创建的显示元素，以防下次打开时残留
                             const displayEl = document.getElementById(CONVERTED_VALUE_ID);
                             if(displayEl) displayEl.remove();
                         }
                     });
                }
            }
        });

        mainObserver.observe(targetNode, { childList: true });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMainObserver);
    } else {
        setupMainObserver();
    }

})();