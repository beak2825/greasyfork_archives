// ==UserScript==
// @name         YouTube 网速单位转换器 & 统计信息汉化
// @name:en      YouTube Connection Speed Converter & Translation
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  在YouTube的"详细统计信息"中，将连接速度转换为MB/s，并将面板主要术语汉化。
// @description:en Converts Connection Speed from Kbps to MB/s and translates the "Stats for nerds" panel into Chinese.
// @author       BlingCc & Refined for Mobile & Translation
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://youtube.com/*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564003/YouTube%20%E7%BD%91%E9%80%9F%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8%20%20%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/564003/YouTube%20%E7%BD%91%E9%80%9F%E5%8D%95%E4%BD%8D%E8%BD%AC%E6%8D%A2%E5%99%A8%20%20%E7%BB%9F%E8%AE%A1%E4%BF%A1%E6%81%AF%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const CONVERTED_VALUE_ID = 'yt-speed-converter-mbps-display';
    const CONVERTED_VALUE_COLOR = '#42a5f5'; // Material Design Blue

    // --- 汉化字典 ---
    const TRANSLATIONS = {
        'Video ID / sCPN': '视频 ID / 随机码',
        'Viewport / Frames': '视窗口 / 丢帧率',
        'Current / Optimal Res': '当前 / 最佳分辨率',
        'Volume / Normalized': '音量 / 标准化',
        'Codecs': '视频 / 音频编码格式',
        'Color': '色彩特性',
        'Connection Speed': '连接速度',
        'Network Activity': '网络活动',
        'Buffer Health': '缓冲健康度',
        'Live Latency': '直播延迟',
        'Live Mode': '直播模式',
        'Mystery Text': '开发调试代码', // YouTube 工程师留下的彩蛋
        'Date': '日期',
        'Audio / Video': '音频 / 视频',
        'Protected': '受保护内容'
    };

    /**
     * 将 Kbps 字符串转换为 MB/s 字符串
     */
    function convertKbpsToMBps(kbpsString) {
        const kbps = parseInt(kbpsString.replace(/[^0-9]/g, ''), 10);
        if (isNaN(kbps)) return null;
        const mbps = kbps / 8 / 1024;
        return mbps.toFixed(2);
    }

    /**
     * 核心函数：更新 MB/s 显示
     */
    function updateSpeedDisplay(speedValueSpan) {
        if (!speedValueSpan) return;

        const originalText = speedValueSpan.textContent;
        if (!/\d/.test(originalText)) return;

        const mbpsValue = convertKbpsToMBps(originalText);
        if (mbpsValue === null) return;

        let displayEl = document.getElementById(CONVERTED_VALUE_ID);

        if (!displayEl) {
            displayEl = document.createElement('span');
            displayEl.id = CONVERTED_VALUE_ID;
            displayEl.style.marginLeft = '8px';
            displayEl.style.color = CONVERTED_VALUE_COLOR;
            displayEl.style.fontWeight = 'bold';
            displayEl.style.whiteSpace = 'nowrap';

            // 确保其在父级元素中显示
            if (speedValueSpan.parentElement && speedValueSpan.parentElement.parentElement) {
                 speedValueSpan.parentElement.parentElement.appendChild(displayEl);
            }
        }

        displayEl.textContent = `${mbpsValue} MB/s`;
    }

    /**
     * 汉化面板文本
     * 遍历面板内的所有文本节点，如果匹配字典则替换
     */
    function localizePanel(panelNode) {
        // 使用 TreeWalker 高效遍历文本节点
        const walker = document.createTreeWalker(
            panelNode,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.nodeValue.trim();
            // 检查是否有匹配的翻译项
            for (const [english, chinese] of Object.entries(TRANSLATIONS)) {
                // 这里使用 startsWith 或者完全匹配，防止误伤数值
                // 很多时候 Label 和 Value 是分开的节点，所以全等匹配较安全
                // 但有时候 Label 包含空格，所以用 include 判断 Label 部分
                if (text === english || text.startsWith(english + ' ')) {
                    node.nodeValue = node.nodeValue.replace(english, chinese);
                    break;
                }
            }
        }
    }

    /**
     * 设置网速观察者
     */
    function setupSpeedObserver(panelNode) {
        // 1. 先执行一次汉化
        localizePanel(panelNode);

        // 2. 定位“连接速度”节点 (支持中英文，因为我们刚才可能已经汉化了)
        const labelDivXpath = ".//div[contains(text(), 'Connection Speed') or contains(text(), '连接速度')]";
        const labelDiv = document.evaluate(labelDivXpath, panelNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (!labelDiv || !labelDiv.nextElementSibling) return;

        const speedValueSpan = labelDiv.nextElementSibling.querySelector('span:nth-child(2)') || labelDiv.nextElementSibling.querySelector('span');

        if (speedValueSpan) {
            updateSpeedDisplay(speedValueSpan);

            const speedObserver = new MutationObserver(() => {
                updateSpeedDisplay(speedValueSpan);
                // 可选：如果担心YouTube动态刷新导致汉化失效，可以在这里再次调用 localizePanel(panelNode);
                // 但通常Label是静态的，只有Value变动。
            });

            speedObserver.observe(speedValueSpan, {
                characterData: true,
                childList: true,
                subtree: true
            });

            panelNode.speedObserver = speedObserver;
        }
    }

    /**
     * 主观察者：监视面板出现
     */
    function setupMainObserver() {
        const targetNode = document.getElementById('movie_player') || document.getElementById('player') || document.body;

        if (!targetNode) {
            setTimeout(setupMainObserver, 500);
            return;
        }

        const mainObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList.contains('html5-video-info-panel')) {
                                setupSpeedObserver(node);
                            }
                            else if (node.querySelector && node.querySelector('.html5-video-info-panel')) {
                                setupSpeedObserver(node.querySelector('.html5-video-info-panel'));
                            }
                        }
                    });
                }
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMainObserver);
    } else {
        setupMainObserver();
    }

})();