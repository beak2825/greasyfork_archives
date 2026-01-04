// ==UserScript==
// @name         Bypass Mijia Geek Edition Chrome Warning
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  用於忽略米家極客版的 Chrome 警告提示
// @author       Zedo
// @include      http://192.168.*.*:8086/
// @icon         https://cdn.cnbj1.fds.api.mi-img.com/mijia-tob/common/ai-config/ico.png
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-or-later
// @updated      2025-10-28
// @downloadURL https://update.greasyfork.org/scripts/548269/Bypass%20Mijia%20Geek%20Edition%20Chrome%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/548269/Bypass%20Mijia%20Geek%20Edition%20Chrome%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        SELECTOR: '.ant-modal-root.css-2rgkd4',
        OBSERVER_CONFIG: {
            childList: true,
            subtree: true
        },
        MAX_ATTEMPTS: 10,
        ATTEMPT_INTERVAL: 1000,
        ENABLE_LOGGING: false,  // 控制是否輸出日誌
        SAFE_MODE: true         // 安全模式：優先隱藏而非移除
    };

    // 日誌函數
    const log = (message) => {
        if (CONFIG.ENABLE_LOGGING) {
            console.log(`[Mijia Bypass] ${message}`);
        }
    };

    // 移除模態框函數
    const removeModal = () => {
        const modal = document.querySelector(`${CONFIG.SELECTOR}:not([data-mijia-bypass-hidden])`);
        if (modal) {
            try {
                if (CONFIG.SAFE_MODE) {
                    // 安全模式：只隱藏不移除
                    modal.style.display = 'none';
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                    modal.style.pointerEvents = 'none';
                    modal.style.zIndex = '-9999';

                    // 添加一個標記，防止重複處理
                    modal.setAttribute('data-mijia-bypass-hidden', 'true');

                    log('警告模態框已隱藏（安全模式）');
                    return true;
                } else {
                    // 標準模式：隱藏後移除
                    modal.style.display = 'none';
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';

                    // 使用 setTimeout 延遲移除，避免與 React 衝突
                    setTimeout(() => {
                        if (modal && modal.parentNode) {
                            try {
                                modal.parentNode.removeChild(modal);
                            } catch (removeError) {
                                log(`移除元素時發生錯誤: ${removeError.message}`);
                            }
                        }
                    }, 100);

                    log('警告模態框已隱藏並將被移除');
                    return true;
                }
            } catch (error) {
                log(`處理模態框時發生錯誤: ${error.message}`);
                return false;
            }
        }
        return false;
    };

    // 立即嘗試移除模態框
    const attemptInitialRemoval = () => {
        if (removeModal()) {
            return true;
        }

        // 如果頁面還沒完全加載，等待並重試
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (removeModal()) {
                clearInterval(checkInterval);
                return;
            }

            if (attempts >= CONFIG.MAX_ATTEMPTS) {
                clearInterval(checkInterval);
                log('達到最大重試次數，停止檢查');
            }
        }, CONFIG.ATTEMPT_INTERVAL);

        return false;
    };

    // 設置 MutationObserver 監聽動態添加的模態框
    const setupObserver = () => {
        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 檢查新增的節點是否包含目標模態框
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasModal = addedNodes.some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return node.matches && node.matches(CONFIG.SELECTOR) ||
                                   node.querySelector && node.querySelector(CONFIG.SELECTOR);
                        }
                        return false;
                    });

                    if (hasModal) {
                        // 延遲處理，確保 React 完成渲染
                        setTimeout(() => {
                            if (removeModal()) {
                                observer.disconnect();
                                log('動態模態框已移除，觀察器已停止');
                            }
                        }, 50);
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(document.body, CONFIG.OBSERVER_CONFIG);

        log('MutationObserver 已設置，監聽動態內容變化');
        return observer;
    };

    // 主函數
    const init = () => {
        log('腳本開始執行');

        // 嘗試立即移除現有的模態框
        attemptInitialRemoval();

        // 設置觀察器監聽後續添加的模態框
        setupObserver();
    };

    // 確保 DOM 已準備好
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();