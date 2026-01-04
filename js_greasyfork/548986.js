// ==UserScript==
// @name         Draftmancer轮抓模拟中文卡牌显示
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  在Draftmancer牌局中显示卡牌的中文信息（稳定按钮版本）
// @author       You
// @license      MIT // <
// @match        https://draftmancer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=draftmancer.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548986/Draftmancer%E8%BD%AE%E6%8A%93%E6%A8%A1%E6%8B%9F%E4%B8%AD%E6%96%87%E5%8D%A1%E7%89%8C%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/548986/Draftmancer%E8%BD%AE%E6%8A%93%E6%A8%A1%E6%8B%9F%E4%B8%AD%E6%96%87%E5%8D%A1%E7%89%8C%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = true;
    let autoObserver = null;
    const cardTranslationCache = new Map();
    const processedUUIDs = new Set();
    let isProcessing = false;

    // 添加样式
    function addStyles() {
        if (document.getElementById('draftmancer-styles')) return;

        const style = document.createElement('style');
        style.id = 'draftmancer-styles';
        style.textContent = `
            #chineseDisplayToggle {
                position: fixed;
                top: 20px;
                right: 120px;
                z-index: 99999;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                transition: all 0.3s ease;
                user-select: none;
            }
            #chineseDisplayToggle.disabled {
                background: #ccc;
                color: #333;
                cursor: pointer;
            }
            #chineseDisplayToggle:hover:not(.disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            #chineseDisplayToggle.disabled:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }

            .draftmancer-card-name {
                position: absolute;
                top: 5px;
                left: 5px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
                z-index: 999;
                border: 1px solid rgba(255, 255, 255, 0.3);
                font-family: Arial, sans-serif;
                pointer-events: none;
                max-width: 80%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .draftmancer-card-type {
                position: absolute;
                top: 140px;
                left: 12px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                z-index: 999;
                border: 1px solid rgba(255, 255, 255, 0.3);
                font-family: Arial, sans-serif;
                pointer-events: none;
            }

            .draftmancer-card-text {
                position: absolute;
                top: 160px;
                left: 12px;
                right: 12px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 10px;
                z-index: 999;
                border: 1px solid rgba(255, 255, 255, 0.3);
                font-family: Arial, sans-serif;
                pointer-events: none;
                word-wrap: break-word;
                line-height: 1.3;
                text-align: left;
            }

            .draftmancer-card-name,
            .draftmancer-card-type,
            .draftmancer-card-text {
                text-align: left;
            }
        `;
        document.head.appendChild(style);
    }

    // 创建开关按钮
    function createToggleButton() {
        // 移除现有按钮
        const existingBtn = document.getElementById('chineseDisplayToggle');
        if (existingBtn) {
            existingBtn.remove();
        }

        const btn = document.createElement('button');
        btn.id = 'chineseDisplayToggle';
        btn.textContent = '关闭中文显示';
        btn.classList.add('enabled');

        // 使用最简单的事件绑定
        btn.onclick = toggleChineseDisplay;

        document.body.appendChild(btn);
        return btn;
    }

    // 切换中文显示
    function toggleChineseDisplay() {
        console.log('按钮被点击，当前状态:', isEnabled);

        isEnabled = !isEnabled;
        const btn = document.getElementById('chineseDisplayToggle');

        if (!btn) {
            console.log('按钮不存在，重新创建');
            createToggleButton();
            return;
        }

        try {
            if (isEnabled) {
                btn.textContent = '关闭中文显示';
                btn.classList.remove('disabled');
                btn.classList.add('enabled');
                btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                btn.style.color = 'white';
                console.log('开启翻译显示');
                startAutoDetection();
            } else {
                btn.textContent = '开启中文显示';
                btn.classList.add('disabled');
                btn.classList.remove('enabled');
                btn.style.background = '#ccc';
                btn.style.color = '#333';
                console.log('关闭翻译显示');
                stopAutoDetection();
                clearAllCardElements();
            }

            // 确保按钮保持可点击状态
            btn.style.cursor = 'pointer';
            btn.style.pointerEvents = 'auto';
            btn.style.userSelect = 'none';

        } catch (error) {
            console.error('切换状态时出错:', error);
        }
    }

    // 获取卡牌翻译数据
    async function getCardTranslation(uuid) {
        if (cardTranslationCache.has(uuid)) {
            return cardTranslationCache.get(uuid);
        }

        try {
            const cardData = await fetch(`https://api.scryfall.com/cards/${uuid}`).then(r => r.json());
            if (!cardData) return null;

            let chineseData = null;
            try {
                chineseData = await fetch(`https://mtgch.com/api/v1/card/${cardData.set}/${cardData.collector_number}`).then(r => r.json());
            } catch (error) {
                console.warn('使用英文数据:', cardData.name);
            }

            const translation = {
                name: chineseData?.atomic_translated_name || cardData.name,
                type: chineseData?.atomic_translated_type || cardData.type_line,
                text: chineseData?.atomic_translated_text || cardData.oracle_text || '',
                set: cardData.set,
                number: cardData.collector_number
            };

            cardTranslationCache.set(uuid, translation);
            return translation;
        } catch (error) {
            console.error('获取卡牌数据失败:', error);
            return null;
        }
    }

    // 为卡牌容器创建翻译元素
    function createTranslationElements(container, translation, uuid) {
        // 清除容器中现有的翻译元素
        const existingElements = container.querySelectorAll('[data-uuid="' + uuid + '"]');
        existingElements.forEach(el => el.remove());

        // 确保容器有相对定位
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        // 创建名称元素
        const nameEl = document.createElement('div');
        nameEl.className = 'draftmancer-card-name';
        nameEl.textContent = translation.name;
        nameEl.setAttribute('data-uuid', uuid);
        nameEl.style.textAlign = 'left';
        container.appendChild(nameEl);

        // 创建类型元素
        const typeEl = document.createElement('div');
        typeEl.className = 'draftmancer-card-type';
        typeEl.textContent = translation.type;
        typeEl.setAttribute('data-uuid', uuid);
        typeEl.style.textAlign = 'left';
        container.appendChild(typeEl);

        // 创建文字元素（如果有）
        if (translation.text) {
            const textEl = document.createElement('div');
            textEl.className = 'draftmancer-card-text';
            textEl.textContent = translation.text;
            textEl.setAttribute('data-uuid', uuid);
            textEl.style.textAlign = 'left';
            container.appendChild(textEl);
        }
    }

    // 处理单个卡牌图片
    async function processCardImage(cardImg) {
        const uuidMatch = cardImg.src.match(/\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\./);
        if (!uuidMatch) return;

        const uuid = uuidMatch[1];

        // 如果已经处理过这个UUID，检查是否需要重新应用到当前容器
        if (processedUUIDs.has(uuid)) {
            const container = cardImg.closest('.card-image, .card, .pool-item, .deck-item') || cardImg.parentElement;
            if (container) {
                const existingElements = container.querySelectorAll('[data-uuid="' + uuid + '"]');
                if (existingElements.length === 0) {
                    const translation = cardTranslationCache.get(uuid);
                    if (translation) {
                        createTranslationElements(container, translation, uuid);
                    }
                }
            }
            return;
        }

        processedUUIDs.add(uuid);

        // 获取翻译数据
        const translation = await getCardTranslation(uuid);
        if (!translation) return;

        // 找到容器并创建翻译元素
        const container = cardImg.closest('.card-image, .card, .pool-item, .deck-item') || cardImg.parentElement;
        if (container) {
            createTranslationElements(container, translation, uuid);
        }
    }

    // 扫描并处理所有卡牌
    async function scanAndProcessCards() {
        if (isProcessing || !isEnabled) return;
        isProcessing = true;

        try {
            const cardImages = document.querySelectorAll('img.front-image, img[src*="scryfall"], img[src*="/front/"], img.card-image, .card img, .pool img, .deck img');

            const promises = Array.from(cardImages).map(cardImg =>
                processCardImage(cardImg).catch(error => {
                    console.error('处理卡牌图片失败:', error);
                    return null;
                })
            );

            await Promise.all(promises);
        } catch (error) {
            console.error('扫描卡牌失败:', error);
        } finally {
            isProcessing = false;
        }
    }

    // 清除所有卡牌元素
    function clearAllCardElements() {
        const elements = document.querySelectorAll('.draftmancer-card-name, .draftmancer-card-type, .draftmancer-card-text');
        elements.forEach(el => el.remove());
        processedUUIDs.clear();
        console.log('清除所有翻译元素，缓存保留:', cardTranslationCache.size, '个翻译');
    }

    // 开始自动检测
    function startAutoDetection() {
        if (autoObserver) return;

        console.log('开始自动检测');
        scanAndProcessCards();

        autoObserver = new MutationObserver(mutations => {
            if (!isEnabled) return;

            let needsProcessing = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.querySelector && node.querySelector('img')) {
                            needsProcessing = true;
                        }
                        if (node.tagName === 'IMG' && (
                            node.src.includes('scryfall') ||
                            node.src.includes('/front/')
                        )) {
                            needsProcessing = true;
                        }
                    }
                });

                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    const target = mutation.target;
                    if (target.tagName === 'IMG' && (
                        target.src.includes('scryfall') ||
                        target.src.includes('/front/')
                    )) {
                        needsProcessing = true;
                    }
                }
            });

            if (needsProcessing) {
                setTimeout(() => {
                    scanAndProcessCards();
                }, 100);
            }
        });

        autoObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        setInterval(() => {
            if (isEnabled) {
                scanAndProcessCards();
            }
        }, 3000);
    }

    // 停止自动检测
    function stopAutoDetection() {
        if (autoObserver) {
            autoObserver.disconnect();
            autoObserver = null;
        }
        console.log('停止自动检测');
    }

    // 定期检查按钮状态
    function maintainButton() {
        const btn = document.getElementById('chineseDisplayToggle');
        if (btn) {
            // 确保按钮始终可点击
            btn.style.cursor = 'pointer';
            btn.style.pointerEvents = 'auto';
            btn.style.userSelect = 'none';
            btn.style.zIndex = '99999';

            // 重新绑定事件（如果需要）
            if (!btn.onclick) {
                btn.onclick = toggleChineseDisplay;
            }
        } else {
            // 如果按钮不存在，重新创建
            createToggleButton();
        }
    }

    // 初始化
    function init() {
        console.log('Draftmancer中文卡牌显示脚本初始化（稳定按钮版本）');
        addStyles();
        createToggleButton();
        startAutoDetection();

        // 定期维护按钮状态
        setInterval(maintainButton, 3000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();