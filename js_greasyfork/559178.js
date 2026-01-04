// ==UserScript==
// @name         Facebook Layout & Scroll Fix v2.6.1 (回歸穩定+搜尋修復版)
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @description  Based on V2.6 stability. Keeps default Home Feed layout. Only fixes Scroll keys and widens Photo/Video modals (excluding Search).
// @author       Gemini
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559178/Facebook%20Layout%20%20Scroll%20Fix%20v261%20%28%E5%9B%9E%E6%AD%B8%E7%A9%A9%E5%AE%9A%2B%E6%90%9C%E5%B0%8B%E4%BF%AE%E5%BE%A9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559178/Facebook%20Layout%20%20Scroll%20Fix%20v261%20%28%E5%9B%9E%E6%AD%B8%E7%A9%A9%E5%AE%9A%2B%E6%90%9C%E5%B0%8B%E4%BF%AE%E5%BE%A9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定區
    // ==========================================
    const SCROLL_STEP = 100;
    const MODAL_WIDTH_SCALE = 1.4;      // 浮動視窗放大倍率 (僅針對看圖/影片)

    // ==========================================
    // 核心工具：判斷是否為系統選單或搜尋視窗
    // ==========================================
    function isSystemMenu(element) {
        if (!element) return true;
        const label = (element.getAttribute('aria-label') || '').toLowerCase();
        
        // 1. 基本黑名單 (通知、Messenger、功能表)
        const blackList = ['通知', 'notifications', 'messenger', '聊天', 'chats', '功能表', 'menu', '帳號', 'account'];
        if (blackList.some(keyword => label.includes(keyword))) return true;

        // 2. [關鍵修復] 搜尋視窗黑名單
        // 只要標籤包含「搜尋」或內容包含「在找什麼」，一律不處理
        if (label.includes('搜尋') || label.includes('search')) return true;
        const bodyText = element.innerText || '';
        if (bodyText.includes('在找什麼') || bodyText.includes('近期搜尋')) return true;

        // 3. 尺寸防呆機制
        const style = window.getComputedStyle(element);
        const width = parseFloat(style.width) || element.clientWidth;
        
        // 太窄的通常是選單，不放大
        if (width > 0 && width < 450) return true; 

        // 雙重檢查：如果沒有「關閉」按鈕，通常不是我們想放大的內容視窗
        const closeBtn = element.querySelector('div[aria-label="關閉"], div[aria-label="Close"]');
        if (!closeBtn && width < 600) return true;

        return false;
    }

    // ==========================================
    // 功能一：浮動視窗優化 (僅放大看圖/影片，排除搜尋)
    // ==========================================
    function expandDialogWidth() {
        const dialogs = document.querySelectorAll('div[role="dialog"]');
        if (dialogs.length === 0) return;
        
        // 通常最上層的 dialog 是使用者正在互動的
        const currentDialog = dialogs[dialogs.length - 1];

        // 檢查是否為系統選單或搜尋視窗，如果是就跳過
        if (isSystemMenu(currentDialog)) return;

        const contentContainer = currentDialog.querySelector('div[role="document"]') || currentDialog.firstChild;
        if (contentContainer) {
            if (contentContainer.dataset.widenApplied === 'true') return;

            const style = window.getComputedStyle(contentContainer);
            const currentMaxWidth = parseFloat(style.maxWidth);
            const currentWidth = parseFloat(style.width);

            // 只有當視窗原本就夠大 (代表是內容視窗) 才放大
            if ((!isNaN(currentMaxWidth) && currentMaxWidth > 500 && currentMaxWidth < window.innerWidth) ||
                (!isNaN(currentWidth) && currentWidth > 500 && currentWidth < window.innerWidth)) {

                const baseWidth = currentMaxWidth || currentWidth;
                const newWidth = baseWidth * MODAL_WIDTH_SCALE;

                // 避免放大超過螢幕邊緣
                if (newWidth < window.innerWidth) {
                    contentContainer.style.maxWidth = `${newWidth}px`;
                    contentContainer.style.width = `${newWidth}px`;
                    contentContainer.style.position = 'relative';
                    contentContainer.style.left = '50%';
                    contentContainer.style.transform = 'translateX(-50%)';
                    contentContainer.dataset.widenApplied = 'true';
                }
            }
        }
    }

    // ==========================================
    // 監聽器與執行
    // ==========================================
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) shouldUpdate = true;
        }
        if (shouldUpdate) {
            // 只有當畫面有變動時才檢查浮動視窗，不影響主頁面效能
            setTimeout(() => {
                expandDialogWidth();
            }, 300);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });


    // ==========================================
    // 功能二：鍵盤捲動修復 (Scroll Fix) - 保持 V2.6 原樣
    // ==========================================
    document.addEventListener('keydown', function(e) {
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (['input', 'textarea'].includes(activeTag) || document.activeElement.getAttribute('contenteditable') === 'true') {
            return;
        }
        if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
            return;
        }

        const dialogs = document.querySelectorAll('div[role="dialog"]');
        if (dialogs.length === 0) return;
        const currentDialog = dialogs[dialogs.length - 1];

        // 搜尋視窗也不要攔截鍵盤事件，避免無法選字
        if (isSystemMenu(currentDialog)) return;

        // 補強：按鍵時也觸發一次寬度檢查
        expandDialogWidth();

        let targetElement = null;
        let maxScrollHeight = 0;
        const allDivs = currentDialog.querySelectorAll('div');

        for (let el of allDivs) {
            if (el.clientHeight < 50) continue;
            const style = window.getComputedStyle(el);
            if (['auto', 'scroll'].includes(style.overflowY)) {
                if (el.scrollHeight > el.clientHeight) {
                    if (el.scrollHeight > maxScrollHeight) {
                        maxScrollHeight = el.scrollHeight;
                        targetElement = el;
                    }
                }
            }
        }

        if (targetElement) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            switch (e.code) {
                case 'ArrowUp': targetElement.scrollTop -= SCROLL_STEP; break;
                case 'ArrowDown': targetElement.scrollTop += SCROLL_STEP; break;
                case 'PageUp': targetElement.scrollTop -= targetElement.clientHeight * 0.9; break;
                case 'PageDown': targetElement.scrollTop += targetElement.clientHeight * 0.9; break;
                case 'Home': targetElement.scrollTop = 0; break;
                case 'End': targetElement.scrollTop = targetElement.scrollHeight; break;
            }
        }
    }, true);

})();