// ==UserScript==
// @name              Kemono 更新標示 (虛擬DOM兼容版)
// @name:zh-TW        Kemono 更新標示 (虛擬DOM兼容版)
// @name:zh-CN        Kemono 更新标记 (虚拟DOM兼容版)
// @namespace         https://greasyfork.org/zh-CN/users/1051751-mark-levi
// @version           2.4.0
// @description       Kemono post highlighter with virtual DOM support. Force reprocessing on navigation.
// @description:zh-TW Kemono更新標示，支援虛擬DOM。導航時強制重新處理。
// @description:zh-CN Kemono更新标记，支援虚拟DOM。导航时强制重新处理。
// @author            Your Name Here
// @match             https://kemono.cr/*
// @match             http://kemono.cr/*
// @match             https://kemono.su/*
// @match             http://kemono.su/*
// @grant             none
// @run-at            document-idle
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/548796/Kemono%20%E6%9B%B4%E6%96%B0%E6%A8%99%E7%A4%BA%20%28%E8%99%9B%E6%93%ACDOM%E5%85%BC%E5%AE%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548796/Kemono%20%E6%9B%B4%E6%96%B0%E6%A8%99%E7%A4%BA%20%28%E8%99%9B%E6%93%ACDOM%E5%85%BC%E5%AE%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const prefix = '[KemonoCR]';
    const log = (...args) => console.log(prefix, ...args);
    let isProcessing = false;

    // --- 日期處理函式 ---
    const toYMD = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const today = new Date();
    const todayStr = toYMD(today);

    // 計算天數差的函式
    function getDayDiff(dateStr) {
        try {
            const postDate = new Date(dateStr);
            const todayNoTime = new Date(todayStr);
            const postDateNoTime = new Date(dateStr);

            const diffTime = todayNoTime - postDateNoTime;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return Math.max(0, diffDays);
        } catch (error) {
            return -1;
        }
    }

    /**
     * 添加標記到元素
     */
    function appendLabel(el, text, dayDiff) {
        // 移除現有的標記（如果存在）
        const existingLabel = el.querySelector('.kemono-label');
        if (existingLabel) {
            existingLabel.remove();
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'kemono-label';
        labelSpan.textContent = text;
        labelSpan.style.fontWeight = 'bold';
        labelSpan.style.marginLeft = '5px';

        if (dayDiff === 0) {
            labelSpan.style.color = 'red';
        } else if (dayDiff === 1) {
            labelSpan.style.color = 'orange';
        } else if (dayDiff === 2) {
            labelSpan.style.color = 'gold';
        } else if (dayDiff === 3) {
            labelSpan.style.color = 'green';
        } else if (dayDiff === 4) {
            labelSpan.style.color = 'blue';
        } else if (dayDiff === 5) {
            labelSpan.style.color = 'purple';
        } else if (dayDiff >= 6) {
            labelSpan.style.color = '#666666';
        }

        el.appendChild(labelSpan);
    }

    /**
     * 處理單一 <time> 元素（強制重新處理）
     */
    function processElement(el) {
        // 清除處理標記，強制重新處理
        delete el.dataset.kemonoProcessed;

        const dateText = (el.textContent || '').trim().split(' ')[0];
        const dayDiff = getDayDiff(dateText);

        if (dayDiff >= 0) {
            if (dayDiff === 0) {
                appendLabel(el, '今日更新', dayDiff);
            } else {
                appendLabel(el, `${dayDiff}天前`, dayDiff);
            }
        }

        el.dataset.kemonoProcessed = 'true';
    }

    /**
     * 強制重新處理所有元素
     */
    function forceReprocessAll() {
        if (isProcessing) return;
        isProcessing = true;

        log('Force reprocessing all elements...');

        // 移除所有現有標記
        document.querySelectorAll('.kemono-label').forEach(label => {
            label.remove();
        });

        // 清除所有處理標記
        document.querySelectorAll('time.timestamp[data-kemono-processed]').forEach(el => {
            delete el.dataset.kemonoProcessed;
        });

        // 重新處理所有元素
        const elements = document.querySelectorAll('time.timestamp');
        if (elements.length > 0) {
            log(`Reprocessing ${elements.length} elements`);
            elements.forEach(processElement);
        }

        isProcessing = false;
        log('Force reprocessing complete');
    }

    /**
     * 處理新元素
     */
    function processNewElements() {
        const elements = document.querySelectorAll('time.timestamp:not([data-kemono-processed])');
        if (elements.length > 0) {
            log(`Processing ${elements.length} new elements`);
            elements.forEach(processElement);
        }
    }

    // --- 虛擬DOM偵測與處理 ---

    // 1. 強力定時器（主要解決方案）
    setInterval(() => {
        processNewElements();
    }, 1000);

    // 2. 監聽所有可能的變化
    const observer = new MutationObserver((mutations) => {
        let shouldReprocess = false;

        mutations.forEach(mutation => {
            // 如果有任何節點變化，就重新處理
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                shouldReprocess = true;
            }

            // 如果是屬性變化，檢查是否是內容相關的
            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'class' ||
                    mutation.attributeName === 'style' ||
                    mutation.attributeName.includes('data')) {
                    shouldReprocess = true;
                }
            }
        });

        if (shouldReprocess) {
            setTimeout(processNewElements, 100);
        }
    });

    // 監聽整個文檔
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'data-*']
    });

    // 3. 監聽頁面焦點變化（切換標籤頁返回時）
    let lastVisibilityState = document.visibilityState;
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && lastVisibilityState === 'hidden') {
            setTimeout(forceReprocessAll, 300);
        }
        lastVisibilityState = document.visibilityState;
    });

    // 4. 監聽滾動事件（無限滾動）
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            processNewElements();
        }, 500);
    });

    // 5. 重寫 History API（SPA 導航）
    const originalMethods = {
        pushState: history.pushState,
        replaceState: history.replaceState
    };

    history.pushState = function(...args) {
        const result = originalMethods.pushState.apply(this, args);
        setTimeout(forceReprocessAll, 200);
        return result;
    };

    history.replaceState = function(...args) {
        const result = originalMethods.replaceState.apply(this, args);
        setTimeout(forceReprocessAll, 200);
        return result;
    };

    window.addEventListener('popstate', () => {
        setTimeout(forceReprocessAll, 300);
    });

    // 6. 監聽點擊事件（分頁按鈕）
    document.addEventListener('click', (event) => {
        const target = event.target;
        // 檢查是否是分頁相關的元素
        if (target.closest('.pagination, [data-page], [href*="page="]')) {
            setTimeout(forceReprocessAll, 500);
        }
    });

    // 7. 初始處理
    setTimeout(() => {
        forceReprocessAll();
        log('Virtual DOM compatible script loaded');
    }, 1000);

})();