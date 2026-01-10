// ==UserScript==
// @name         Threads.net 強制顯示 Spoiler (V1.0)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動移除 Threads 敏感內容遮罩（完整版 - 圖片+文字）
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562081/Threadsnet%20%E5%BC%B7%E5%88%B6%E9%A1%AF%E7%A4%BA%20Spoiler%20%28V10%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562081/Threadsnet%20%E5%BC%B7%E5%88%B6%E9%A1%AF%E7%A4%BA%20Spoiler%20%28V10%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_ATTR = 'data-spoiler-removed-v11';

    // 全域 CSS 強制移除所有遮罩效果
    GM_addStyle(`
        /* 移除所有 blur filter */
        div[style*="blur"] {
            filter: none !important;
            -webkit-filter: none !important;
        }

        /* 移除 backdrop-filter */
        div[style*="backdrop-filter"] {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
    `);

    function removeSpoilers() {
        // === 策略 1: 移除圖片的 blur filter ===
        document.querySelectorAll('div').forEach(div => {
            if (div.hasAttribute(PROCESSED_ATTR)) return;

            const style = getComputedStyle(div);
            const filter = style.filter || style.webkitFilter;

            if (filter && filter.includes('blur')) {
                console.log('[V11.0] 移除 DIV blur filter');
                div.style.setProperty('filter', 'none', 'important');
                div.style.setProperty('-webkit-filter', 'none', 'important');
                div.setAttribute(PROCESSED_ATTR, 'true');
            }
        });

        // === 策略 2: 移除圖片的 Spoiler 標籤覆蓋層 ===
        document.querySelectorAll('span').forEach(span => {
            if (span.hasAttribute(PROCESSED_ATTR + '-label')) return;

            const text = span.textContent?.trim();
            if ((text === 'Spoiler' || text === '敏感內容') && span.children.length <= 1) {
                let current = span;
                for (let i = 0; i < 5; i++) {
                    current = current.parentElement;
                    if (!current) break;

                    const style = getComputedStyle(current);
                    if (style.position === 'absolute') {
                        console.log('[V11.0] 隱藏 Spoiler 標籤層');
                        current.style.setProperty('display', 'none', 'important');
                        span.setAttribute(PROCESSED_ATTR + '-label', 'true');
                        break;
                    }
                }
            }
        });

        // === 策略 3: 移除文字遮罩的灰色背景 (rgb(77,77,77)) ===
        document.querySelectorAll('div').forEach(div => {
            if (div.hasAttribute(PROCESSED_ATTR + '-textbg')) return;

            const style = getComputedStyle(div);
            // 檢測 Threads 的文字遮罩背景色
            if (style.backgroundColor === 'rgb(77, 77, 77)') {
                console.log('[V11.0] 移除文字遮罩灰色背景');
                div.style.setProperty('background-color', 'transparent', 'important');
                div.style.setProperty('background', 'transparent', 'important');
                div.setAttribute(PROCESSED_ATTR + '-textbg', 'true');
            }
        });

        // === 策略 4: 修復 opacity:0 隱藏的文字 (關鍵！) ===
        document.querySelectorAll('div').forEach(div => {
            if (div.hasAttribute(PROCESSED_ATTR + '-opacity')) return;

            const style = getComputedStyle(div);

            // 檢測 opacity 為 0 且有文字內容的元素
            if (parseFloat(style.opacity) < 0.1) {
                const text = div.innerText?.trim();
                // 只處理有文字且長度合理的（排除空元素和超長內容）
                if (text && text.length > 0 && text.length < 200) {
                    console.log('[V11.0] 修復 opacity:0 文字:', text.substring(0, 20));
                    div.style.setProperty('opacity', '1', 'important');
                    div.setAttribute(PROCESSED_ATTR + '-opacity', 'true');
                }
            }
        });

        // === 策略 5: 移除 backdrop-filter ===
        document.querySelectorAll('div').forEach(div => {
            if (div.hasAttribute(PROCESSED_ATTR + '-backdrop')) return;

            const style = getComputedStyle(div);
            const backdrop = style.backdropFilter || style.webkitBackdropFilter;

            if (backdrop && backdrop.includes('blur')) {
                div.style.setProperty('backdrop-filter', 'none', 'important');
                div.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
                div.setAttribute(PROCESSED_ATTR + '-backdrop', 'true');
            }
        });

        // === 策略 6: 確保圖片可見 ===
        document.querySelectorAll('img').forEach(img => {
            const style = getComputedStyle(img);
            if (style.filter && style.filter.includes('blur')) {
                img.style.setProperty('filter', 'none', 'important');
            }
            if (parseFloat(style.opacity) < 1) {
                img.style.setProperty('opacity', '1', 'important');
            }
        });
    }

    console.log('[V11.0] Threads Spoiler Remover 啟動（完整版）');

    // DOM 監聽
    const startObserver = () => {
        const observer = new MutationObserver(() => {
            requestAnimationFrame(removeSpoilers);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        removeSpoilers();
    };

    if (document.body) {
        startObserver();
    } else {
        document.addEventListener('DOMContentLoaded', startObserver);
    }

    // 多次延遲執行
    [100, 300, 500, 1000, 2000, 3000, 5000].forEach(delay => {
        setTimeout(removeSpoilers, delay);
    });

    // 滾動時執行
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(removeSpoilers, 100);
    }, { passive: true });

})();