// ==UserScript==
// @name         思齐玩偶抢曝光 - 显示抽中概率
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在玩偶信息中添加抽中概率显示
// @author       You
// @match        https://si-qi.xyz/toy_show.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557843/%E6%80%9D%E9%BD%90%E7%8E%A9%E5%81%B6%E6%8A%A2%E6%9B%9D%E5%85%89%20-%20%E6%98%BE%E7%A4%BA%E6%8A%BD%E4%B8%AD%E6%A6%82%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/557843/%E6%80%9D%E9%BD%90%E7%8E%A9%E5%81%B6%E6%8A%A2%E6%9B%9D%E5%85%89%20-%20%E6%98%BE%E7%A4%BA%E6%8A%BD%E4%B8%AD%E6%A6%82%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从页面中提取初始数据
    function extractInitialData() {
        // 查找包含 TOY_SHOW_INITIAL_STATE 的 script 标签
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const content = script.textContent;
            if (content && content.includes('TOY_SHOW_INITIAL_STATE')) {
                // 提取 JSON 数据
                const match = content.match(/const TOY_SHOW_INITIAL_STATE = ({[\s\S]*?});/);
                if (match) {
                    try {
                        return JSON.parse(match[1]);
                    } catch (e) {
                        // 静默处理错误
                    }
                }
            }
        }
        return null;
    }

    // 存储提取的数据
    let toyShowData = null;

    // 计算玩偶概率
    function calculateProbability(dollKey) {
        // 跳过直售玩偶（通常以 _direct 结尾）
        if (dollKey && dollKey.endsWith('_direct')) {
            return null;
        }

        if (!toyShowData || !toyShowData.catalog) {
            return null;
        }

        const catalog = toyShowData.catalog;

        // 查找玩偶所属的盲盒
        for (let i = 0; i < catalog.length; i++) {
            const box = catalog[i];
            if (box.dolls && box.dolls[dollKey]) {
                const dollData = box.dolls[dollKey];
                // 计算概率
                const probability = (dollData.weight / box.total_weight * 100).toFixed(2);
                return {
                    probability: probability,
                    boxName: box.name,
                    dollName: dollData.name
                };
            }
        }

        return null;
    }

    // 添加概率显示
    function addProbabilityDisplay() {
        // 查找所有玩偶卡片
        const dollCards = document.querySelectorAll('.toy-doll-card');

        dollCards.forEach((card) => {
            // 检查是否已经添加了概率显示
            if (card.querySelector('.toy-doll-probability')) {
                return;
            }

            const dollKey = card.dataset.dollKey;

            if (!dollKey) {
                return;
            }

            // 计算概率
            const probData = calculateProbability(dollKey);
            if (!probData) {
                return;
            }

            // 创建概率显示元素
            const probElement = document.createElement('span');
            probElement.className = 'toy-doll-probability';
            probElement.textContent = `抽中概率: ${probData.probability}%`;
            probElement.style.color = '#e67e22';
            probElement.style.fontSize = '12px';
            probElement.style.fontWeight = 'bold';
            probElement.style.marginTop = '4px';
            probElement.style.display = 'block';

            // 添加到玩偶信息区域
            const dollInfo = card.querySelector('.toy-doll-info');
            if (dollInfo) {
                dollInfo.appendChild(probElement);
            }
        });

        // 处理盲盒预览中的玩偶
        const dollPreviews = document.querySelectorAll('.toy-doll-preview');

        dollPreviews.forEach((preview) => {
            // 检查是否已经添加了概率显示
            if (preview.querySelector('.toy-doll-probability')) {
                return;
            }

            const dollIcon = preview.dataset.dollIcon;
            const dollName = preview.dataset.dollName;

            if (!dollIcon || !dollName) {
                return;
            }

            // 从数据中查找玩偶
            let dollData = null;
            let boxData = null;

            // 查找玩偶所属的盲盒
            for (const box of toyShowData.catalog) {
                if (box.dolls) {
                    for (const [key, doll] of Object.entries(box.dolls)) {
                        if (doll.name === dollName && doll.icon === dollIcon) {
                            dollData = doll;
                            boxData = box;
                            break;
                        }
                    }
                }
                if (dollData) break;
            }

            if (!dollData || !boxData) {
                return;
            }

            // 计算概率
            const probability = (dollData.weight / boxData.total_weight * 100).toFixed(2);

            // 创建概率显示元素
            const probElement = document.createElement('div');
            probElement.className = 'toy-doll-probability';
            probElement.textContent = `抽中概率: ${probability}%`;
            probElement.style.color = '#e67e22';
            probElement.style.fontSize = '11px';
            probElement.style.fontWeight = 'bold';
            probElement.style.marginTop = '4px';

            // 添加到预览信息区域
            const previewInfo = preview.querySelector('.toy-doll-preview-info');
            if (previewInfo) {
                previewInfo.appendChild(probElement);
            }
        });
    }

    // 初始化函数
    function init() {
        // 等待玩偶卡片加载
        const checkInterval = setInterval(() => {
            const dollCards = document.querySelectorAll('.toy-doll-card');
            if (dollCards.length > 0) {
                addProbabilityDisplay();
                clearInterval(checkInterval);
            }
        }, 100);

        // 监听页面变化
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    if (addedNodes.some(node =>
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.classList?.contains('toy-doll-card') ||
                         node.classList?.contains('toy-doll-preview') ||
                         node.querySelector?.('.toy-doll-card, .toy-doll-preview'))
                    )) {
                        shouldUpdate = true;
                    }
                }
            });
            if (shouldUpdate) {
                setTimeout(() => {
                    addProbabilityDisplay();
                }, 100);
            }
        });

        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后启动
    function start() {
        // 提取初始数据
        toyShowData = extractInitialData();

        if (toyShowData) {
            init();
        } else {
            setTimeout(start, 1000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    // 添加样式优化
    const style = document.createElement('style');
    style.textContent = `
        .toy-doll-probability {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            padding: 2px 8px;
            border-radius: 12px;
            border: 1px solid #ffcc80;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            display: inline-block;
        }

        .toy-doll-probability:hover {
            background: linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%);
            transform: scale(1.05);
        }

        .toy-doll-preview .toy-doll-probability {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #ffd4a3;
            margin-top: 6px;
        }

        @keyframes probabilityGlow {
            0% { box-shadow: 0 0 5px rgba(230, 126, 34, 0.3); }
            50% { box-shadow: 0 0 15px rgba(230, 126, 34, 0.6); }
            100% { box-shadow: 0 0 5px rgba(230, 126, 34, 0.3); }
        }

        .toy-doll-probability {
            animation: probabilityGlow 2s infinite;
        }
    `;
    document.head.appendChild(style);

})();
