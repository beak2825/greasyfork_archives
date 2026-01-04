// ==UserScript==
// @name         YouTube 留言彈幕 (YT Danmaku)
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  將 YouTube 影片留言變成彈幕，並在進入頁面時【穩定、無感、自動】載入多頁留言，實現源源不絕的彈幕效果。
// @author       You
// @match        *://www.youtube.com/watch*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553110/YouTube%20%E7%95%99%E8%A8%80%E5%BD%88%E5%B9%95%20%28YT%20Danmaku%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553110/YouTube%20%E7%95%99%E8%A8%80%E5%BD%88%E5%B9%95%20%28YT%20Danmaku%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定 ---
    const MAX_DANMAKU_CHARS = 20;       // 彈幕最大字數
    const DISPLAY_DANMAKU_INTERVAL = 1500; // 每 1.5 秒發射一條彈幕
    const DANMAKU_FONT_SIZE = '22px';   // 彈幕字體大小
    const DANMAKU_DURATION_MIN = 8;     // 彈幕飄動最短時間 (秒)
    const DANMAKU_DURATION_MAX = 15;    // 彈幕飄動最長時間 (秒)
    const INITIAL_LOAD_PAGES = 5;       // 進入頁面時，自動載入的留言頁數 (設為 0 可關閉)
    // --- ---

    let commentQueue = [];
    let processedComments = new Set();
    let danmakuContainer = null;
    let displayIntervalId = null;
    let commentObserver = null;
    let isInitializing = false; // 防止重複初始化

    GM_addStyle(`
        #danmaku-container {
            position: absolute; top: 0; left: 0; width: 100%; height: 85%;
            overflow: hidden; pointer-events: none; z-index: 100;
        }
        .danmaku-item {
            position: absolute; white-space: nowrap; color: white;
            font-size: ${DANMAKU_FONT_SIZE}; font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            will-change: transform; animation-name: scroll-right-to-left;
            animation-timing-function: linear;
        }
        @keyframes scroll-right-to-left {
            from { transform: translateX(100vw); }
            to { transform: translateX(-100%); }
        }
    `);

    // 輔助函式：等待指定元素出現 (使用 MutationObserver，更可靠)
    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                if (!document.querySelector(selector)) {
                    reject(new Error(`Element ${selector} not found after ${timeout}ms`));
                }
            }, timeout);
        });
    }

    // 處理單一留言元素並加入佇列
    function processCommentElement(el) {
        const commentText = el.textContent.trim();
        if (commentText && !processedComments.has(commentText)) {
            processedComments.add(commentText);
            const truncatedText = commentText.substring(0, MAX_DANMAKU_CHARS);
            commentQueue.push(truncatedText);
        }
    }

    // 發射彈幕
    function displayDanmaku() {
        if (commentQueue.length === 0 || !danmakuContainer) return;
        const text = commentQueue.shift();
        const danmaku = document.createElement('span');
        danmaku.className = 'danmaku-item';
        danmaku.textContent = text;
        const containerHeight = danmakuContainer.clientHeight;
        danmaku.style.top = `${Math.floor(Math.random() * (containerHeight - parseInt(DANMAKU_FONT_SIZE) * 2))}px`;
        const duration = Math.random() * (DANMAKU_DURATION_MAX - DANMAKU_DURATION_MIN) + DANMAKU_DURATION_MIN;
        danmaku.style.animationDuration = `${duration}s`;
        danmaku.addEventListener('animationend', () => danmaku.remove());
        danmakuContainer.appendChild(danmaku);
    }

    // 【核心功能】自動觸發並載入留言，無可見滾動
    async function triggerAndLoadComments() {
        if (INITIAL_LOAD_PAGES <= 0) return;
        console.log('[YT Danmaku] 開始無感自動載入留言...');

        // 找到留言區塊，它可能被延遲加載
        const commentsElement = await waitForElement("#comments");
        const originalStyle = {
            position: commentsElement.style.position,
            top: commentsElement.style.top,
            left: commentsElement.style.left,
            zIndex: commentsElement.style.zIndex,
            opacity: commentsElement.style.opacity,
        };

        try {
            // 技巧：暫時將留言區塊移到視窗內（但設為透明），以觸發 YouTube 的 IntersectionObserver
            commentsElement.style.position = 'fixed';
            commentsElement.style.top = '0';
            commentsElement.style.left = '0';
            commentsElement.style.zIndex = '-999';
            commentsElement.style.opacity = '0';

            // 等待初始留言載入
            await waitForElement("#comments #contents ytd-comment-thread-renderer", 5000);

            // 循環點擊 "載入更多"
            for (let i = 0; i < INITIAL_LOAD_PAGES; i++) {
                // 尋找 spinner 或 "顯示更多回覆" 的按鈕
                const spinner = document.querySelector('ytd-continuation-item-renderer, #show-more-button');
                if (spinner) {
                    console.log(`[YT Danmaku] 正在載入第 ${i + 1} 頁留言...`);
                    // 使用 click() 比 scrollIntoView() 更可靠
                    spinner.click();
                    await new Promise(resolve => setTimeout(resolve, 1500)); // 等待網路請求和 DOM 更新
                } else {
                    console.log('[YT Danmaku] 沒有更多留言可以載入。');
                    break;
                }
            }
        } catch (error) {
            console.warn('[YT Danmaku] 自動載入留言時出錯 (可能影片沒有留言或結構改變):', error.message);
        } finally {
            // 無論成功或失敗，都恢復原始樣式並確保滾動條在頂部
            Object.assign(commentsElement.style, originalStyle);
            window.scrollTo(0, 0);
            console.log('[YT Danmaku] 自動載入完成。');
        }
    }

    // 設置留言觀察者，監聽後續由使用者手動滾動載入的新留言
    function setupCommentObserver() {
        if (commentObserver) commentObserver.disconnect();
        waitForElement("#comments #contents").then(target => {
            const observerCallback = (mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                node.querySelectorAll('#content-text').forEach(processCommentElement);
                            }
                        });
                    }
                }
            };
            commentObserver = new MutationObserver(observerCallback);
            commentObserver.observe(target, { childList: true, subtree: true });
            console.log('[YT Danmaku] 留言觀察者已啟動。');
        }).catch(() => console.warn('[YT Danmaku] 未找到留言區，手動滾動可能無法載入新彈幕。'));
    }

    // 主初始化函式
    async function initializeDanmaku() {
        if (isInitializing) return;
        isInitializing = true;

        console.log('[YT Danmaku] 初始化...');
        cleanup(); // 先清理舊的實例

        try {
            const playerContainer = await waitForElement('#movie_player');

            danmakuContainer = document.createElement('div');
            danmakuContainer.id = 'danmaku-container';
            playerContainer.appendChild(danmakuContainer);

            // 執行無感自動載入
            await triggerAndLoadComments();

            // 抓取所有已載入的留言
            document.querySelectorAll('ytd-comment-thread-renderer #content-text').forEach(processCommentElement);
            console.log(`[YT Danmaku] 總共抓取了 ${commentQueue.length} 則留言到佇列。`);

            setupCommentObserver();
            displayIntervalId = setInterval(displayDanmaku, DISPLAY_DANMAKU_INTERVAL);
            console.log('[YT Danmaku] 彈幕系統已成功啟動！');

        } catch (error) {
            console.error('[YT Danmaku] 腳本執行失敗:', error);
        } finally {
            isInitializing = false;
        }
    }

    function cleanup() {
        if (displayIntervalId) clearInterval(displayIntervalId);
        if (commentObserver) commentObserver.disconnect();
        if (danmakuContainer) danmakuContainer.remove();
        displayIntervalId = null;
        commentObserver = null;
        danmakuContainer = null;
        commentQueue = [];
        processedComments.clear();
        console.log('[YT Danmaku] 已清理舊的彈幕資源。');
    }

    // 監聽 YouTube 的 SPA 導航事件
    window.addEventListener('yt-navigate-finish', () => {
        // 確保是在 watch 頁面
        if (window.location.href.includes('/watch')) {
            setTimeout(initializeDanmaku, 500); // 稍微延遲以確保新頁面的 DOM 元素已完全渲染
        } else {
            cleanup();
        }
    });

    // 首次進入頁面時執行
    if (document.readyState === 'complete') {
        initializeDanmaku();
    } else {
        window.addEventListener('load', initializeDanmaku);
    }
})();