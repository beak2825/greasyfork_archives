// ==UserScript==
// @name         Pixiv页码过滤
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  低页数插画过滤
// @author       Your Name
// @match        https://www.pixiv.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557931/Pixiv%E9%A1%B5%E7%A0%81%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/557931/Pixiv%E9%A1%B5%E7%A0%81%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================
    // ## ⚙️ 配置常量 (Configuration)
    // ===================================

    const DEFAULT_MIN_VALUE = 5;
    const DEFAULT_IS_ENABLED = true;
    const COOLDOWN_MS = 100;

    const KEY_MIN_VALUE = 'minValue';
    const KEY_IS_ENABLED = 'isEnabled';

    // 白名单选择器: 包含此类的元素将被跳过过滤
    const WHITELIST_SELECTOR = '.gtm-new-work-tag-event-click';

    let isProcessing = false;
    let lastHiddenTime = 0;
    let whiteListCount = 0; // 用于统计跳过的元素数量

    // ===================================
    // ## 💾 配置存取 (Config Management)
    // ===================================

    /** 获取配置值 */
    function getConfig(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    }

    /** 设置配置值并更新 UI */
    function setConfig(key, value) {
        GM_setValue(key, value);
        updatePanelDisplay();
    }

    // ===================================
    // ## 🔍 元素过滤与隐藏 (Filtering Logic)
    // ===================================

    function filterElements() {
        if (isProcessing) {
            return;
        }

        const isEnabled = getConfig(KEY_IS_ENABLED, DEFAULT_IS_ENABLED);
        if (!isEnabled) {
            console.log('Pixiv Filter Script: 脚本已临时关闭。');
            return;
        }

        isProcessing = true;
        const minValue = getConfig(KEY_MIN_VALUE, DEFAULT_MIN_VALUE);
        const now = Date.now();
        const elapsedTime = now - lastHiddenTime;

        // 避免在短时间内重复执行，设置冷却时间
        if (elapsedTime < COOLDOWN_MS) {
            isProcessing = false;
            setTimeout(filterElements, COOLDOWN_MS - elapsedTime);
            return;
        }

        const targetSelector = 'li[size="1"][offset="0"], li';
        const elementsToHide = [];
        whiteListCount = 0;

        document.querySelectorAll(targetSelector).forEach(li => {
            // 检查是否已被处理或被隐藏
            if (li.style.display === 'none' || li.hasAttribute('data-score-checked')) {
                return;
            }

            // 1. 白名单检查：如果包含特定 Tag，则跳过过滤
            if (li.querySelector(WHITELIST_SELECTOR)) {
                li.setAttribute('data-score-checked', 'true');
                whiteListCount++;
                return;
            }

            let hideElement = false;

            // 2. 优先匹配：检查 pagecount 属性 (页数)
            const pageCountElement = li.querySelector('[pagecount]');

            if (pageCountElement) {
                const pageCount = parseInt(pageCountElement.getAttribute('pagecount'), 10);
                if (!isNaN(pageCount) && pageCount < minValue) {
                    hideElement = true;
                }
            }

            // 3. 次级匹配：检查收藏数
            if (!hideElement) {
                const scoreSpan = li.querySelector('.sc-a686e337-0 > span:last-child');
                let score = 0;

                if (scoreSpan) {
                    const scoreText = scoreSpan.textContent.replace(/,/g, '').trim();
                    score = parseInt(scoreText, 10);
                    if (isNaN(score)) { score = 1; }
                } else {
                    score = 1; // 默认给 1，防止没有元素被误判
                }

                if (score < minValue) {
                    hideElement = true;
                }
            }

            if (hideElement) {
                elementsToHide.push(li);
            }

            // 标记为已检查
            li.setAttribute('data-score-checked', 'true');
        });

        // 批量隐藏元素
        if (elementsToHide.length > 0) {
            elementsToHide.forEach(li => {
                li.style.display = 'none';
            });

            console.log(`Pixiv Filter Script: 隐藏了 ${elementsToHide.length} 个不符合最低页数/收藏数的元素 (最低要求: ${minValue})。`);

            if (whiteListCount > 0) {
                console.log(`Pixiv Filter Script: 白名单跳过 ${whiteListCount} 个元素。`);
            }

            lastHiddenTime = Date.now();

            // 延迟以防止卡顿，并进行下一轮检查
            setTimeout(() => {
                isProcessing = false;
                filterElements();
            }, COOLDOWN_MS);
        } else {
            isProcessing = false;
            if (whiteListCount > 0) {
                console.log(`Pixiv Filter Script: 白名单跳过 ${whiteListCount} 个元素。`);
            }
        }
    }


    // ===================================
    // ## 🖥️ 用户界面 (UI)
    // ===================================

    /** 注入 CSS 样式 */
    function injectStyles() {
        GM_addStyle(`
            /* 按钮样式 */
            #pixiv-filter-toggle-btn {
                position: fixed;
                top: 15px;
                right: 15px;
                z-index: 10000;
                background-color: transparent;
                color: #000;
                border: none;
                cursor: pointer;
                padding: 5px 10px;
                font-size: 24px;
                line-height: 1;
                opacity: 1.0;
                transition: opacity 0.2s;
                width: 35px;
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #pixiv-filter-toggle-btn:hover {
                opacity: 0.8;
            }

            /* 面板样式 */
            #pixiv-filter-settings-panel {
                position: fixed;
                top: 50px;
                right: 15px;
                z-index: 9999;
                width: 200px;
                background-color: rgba(255, 255, 255, 0.95);
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 10px;
                display: none;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #333;
            }
            #pixiv-filter-settings-panel.active {
                display: block;
            }
            #pixiv-filter-settings-panel h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #0096fa;
            }
            #pixiv-filter-settings-panel label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 13px;
            }
            #pixiv-filter-settings-panel input[type="number"] {
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #ccc;
                width: 60px;
                text-align: right;
            }
            #pixiv-filter-settings-panel button {
                padding: 5px 10px;
                border-radius: 4px;
                border: 1px solid #ccc;
                background-color: #f0f0f0;
                cursor: pointer;
            }
        `);
    }

    /** 创建并初始化 UI 元素和事件 */
    function createUI() {
        // 1. 创建切换按钮 (♍)
        const button = document.createElement('button');
        button.id = 'pixiv-filter-toggle-btn';
        button.innerHTML = '♍';
        button.title = 'Pixiv 过滤设置';
        document.body.appendChild(button);

        // 2. 创建设置面板
        const panel = document.createElement('div');
        panel.id = 'pixiv-filter-settings-panel';
        panel.innerHTML = `
            <h4>Pixiv 过滤控制</h4>
            <label>
                <span>设置最低页数/收藏数:</span>
                <input type="number" id="min-value-input" min="1">
            </label>
            <label>
                <span>脚本状态:</span>
                <button id="toggle-script-btn"></button>
            </label>
        `;
        document.body.appendChild(panel);

        // 3. 绑定事件监听器

        // 切换面板显示/隐藏
        button.addEventListener('click', () => {
            panel.classList.toggle('active');
        });

        // 调整数值
        document.getElementById('min-value-input').addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1) {
                setConfig(KEY_MIN_VALUE, val);
                // 立即重新执行一次过滤
                filterElements();
            }
        });

        // 切换脚本开关
        document.getElementById('toggle-script-btn').addEventListener('click', () => {
            const isEnabled = getConfig(KEY_IS_ENABLED, DEFAULT_IS_ENABLED);
            setConfig(KEY_IS_ENABLED, !isEnabled);

            if (!isEnabled) {
                // 重新开启脚本，立即过滤一次
                filterElements();
            } else {
                // 关闭脚本时，恢复所有被隐藏的元素并清除标记
                document.querySelectorAll('li[data-score-checked="true"]').forEach(li => {
                    li.style.display = '';
                    li.removeAttribute('data-score-checked');
                });
            }
        });

        // 初始更新显示
        updatePanelDisplay();
    }

    /** 根据配置更新 UI 状态显示 */
    function updatePanelDisplay() {
        const minValue = getConfig(KEY_MIN_VALUE, DEFAULT_MIN_VALUE);
        const isEnabled = getConfig(KEY_IS_ENABLED, DEFAULT_IS_ENABLED);

        const minValueInput = document.getElementById('min-value-input');
        const toggleButton = document.getElementById('toggle-script-btn');

        if (minValueInput) {
            minValueInput.value = minValue;
        }

        if (toggleButton) {
            if (isEnabled) {
                toggleButton.textContent = '🟢 运行中 (点击关闭)';
                toggleButton.style.backgroundColor = '#d4ffc7';
            } else {
                toggleButton.textContent = '🔴 已禁用 (点击开启)';
                toggleButton.style.backgroundColor = '#ffd4d4';
            }
        }
    }


    // ===================================
    // ## 🚀 启动与监听 (Initialization)
    // ===================================

    function initialize() {
        injectStyles();
        createUI();

        const targetNode = document.body;
        // 监听 body 及其子树的节点增减
        const config = { childList: true, subtree: true };

        // 使用 MutationObserver 监听页面动态加载的新元素
        const observer = new MutationObserver((mutationsList) => {
            let shouldFilter = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldFilter = true;
                    break;
                }
            }

            if (shouldFilter) {
                filterElements();
            }
        });

        // 初始延迟启动 (3秒) 以确保页面元素加载完毕
        setTimeout(() => {
            console.log('Pixiv Filter Script: 初始延迟加载完成，开始过滤和监听。');
            filterElements();
            observer.observe(targetNode, config);
        }, 3000);
    }

    initialize();

})();