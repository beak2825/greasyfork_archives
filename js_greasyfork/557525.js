// ==UserScript==
// @name         嗶哩輕小說直排閱讀器
// @namespace    http://tampermonkey.net/
// @version      7.11
// @description  去除背景色 + 調整 P 標籤屬性 + 滾輪/上下鍵卷動(距離一致) + 邊界跳轉章節 + 線上字體 + 符號替換(括號/破折號等)
// @author       You
// @match        *://*.linovelib.com/novel/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linovelib.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557525/%E5%97%B6%E5%93%A9%E8%BC%95%E5%B0%8F%E8%AA%AA%E7%9B%B4%E6%8E%92%E9%96%B1%E8%AE%80%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557525/%E5%97%B6%E5%93%A9%E8%BC%95%E5%B0%8F%E8%AA%AA%E7%9B%B4%E6%8E%92%E9%96%B1%E8%AE%80%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 字體設定
    const fontName = "'源流明體月', 'HanaMinA', 'PMingLiU', serif";

    // 2. CSS 樣式
    const css = `
        /* --- 引入線上字體 (源流明體) --- */
        @font-face {
            font-family: '源流明體月';
            /* 使用 jsDelivr CDN 加速 GitHub 檔案讀取 */
            src: url('https://cdn.jsdelivr.net/gh/ButTaiwan/genryu-font@master/otf/TW/GenRyuMin2TW-R.otf') format('opentype');
            font-display: swap;
        }

        /* 隱藏干擾元素 */
        .read_head, .read_foot, .hub_uni_3, .header, .footer, #ad, .chapter-page, .footlink, #pinglun {
            display: none !important;
        }



        /* .main 設定 (移除背景色) */
        .main {
            writing-mode: vertical-rl !important;
            -webkit-writing-mode: vertical-rl !important;
            text-orientation: upright !important;
            height: 98vh !important;
            width: 100vw !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            outline: none !important;

            /* 隱藏捲動條 */
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .main::-webkit-scrollbar {
            display: none;
        }

        /* #acontent 設定 */
        #acontent {
            height: 100% !important;
            width: auto !important;
            display: block !important;
            font-family: ${fontName} !important;
            padding: 30px 50px !important;
            box-sizing: border-box !important;
        }

        /* 段落設定 (已移除 display: block) */
        #acontent p {
            text-indent: 2em !important;
            white-space: normal !important;
            word-break: break-all !important;
            overflow-wrap: break-word !important;
        }

        /* 圖片設定 */
        #acontent img {
            max-height: 90vh !important;
            width: auto !important;
            max-width: 100% !important;
            display: block !important;
            margin: 10px auto !important;
        }
    `;

    GM_addStyle(css);

    // 3. 互動邏輯
    setTimeout(() => {
        // --- 設定：參數區 ---
        const SCROLL_STEP = 120;   // 卷動距離
        const RESET_TIME = 1000;   // 邊界跳轉重置時間 (1000ms = 1秒)

        // --- A. 符號替換功能 ---
        function replaceSymbols() {
            const contentDiv = document.getElementById('acontent');
            if (!contentDiv) return;

            const walker = document.createTreeWalker(
                contentDiv,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                let text = node.nodeValue;
                let modified = false;

                // 1. 替換破折號 ─ -> ︱
                if (text.includes('─')) {
                    text = text.replace(/─/g, '︱');
                    modified = true;
                }
                // 2. 替換左圓括號 ( -> （
                if (text.includes('(')) {
                    text = text.replace(/\(/g, '（');
                    modified = true;
                }
                // 3. 替換右圓括號 ) -> ）
                if (text.includes(')')) {
                    text = text.replace(/\)/g, '）');
                    modified = true;
                }
                // 4. 替換連字號 - -> ︲
                if (text.includes('-')) {
                    text = text.replace(/-/g, '︲');
                    modified = true;
                }
                // 5. 替換左中括號 [ -> ［
                if (text.includes('[')) {
                    text = text.replace(/\[/g, '［');
                    modified = true;
                }
                // 6. 替換右中括號 ] -> ］
                if (text.includes(']')) {
                    text = text.replace(/\]/g, '］');
                    modified = true;
                }

                if (modified) {
                    node.nodeValue = text;
                }
            }
        }

        replaceSymbols();


        // --- B. 捲動與翻頁邏輯 ---
        const scrollContainer = document.querySelector('.main');

        // 狀態變數
        let isKeyScrolling = false;

        // 計數器
        let wheelEdgeHitNext = 0;
        let wheelEdgeHitPrev = 0;
        let wheelResetTimer = null;

        let arrowEdgeHitNext = 0;
        let arrowEdgeHitPrev = 0;
        let arrowResetTimer = null;

        // 輔助函式
        function pageJump(xAmount) {
            if (isKeyScrolling) return;
            isKeyScrolling = true;
            scrollContainer.scrollBy({ left: xAmount, behavior: 'smooth' });
            setTimeout(() => { isKeyScrolling = false; }, 300);
        }

        function smoothScrollTo(xPos) {
             scrollContainer.scrollTo({ left: xPos, behavior: 'smooth' });
        }

        function goToNextChapter() {
            if (typeof ReadParams !== 'undefined' && ReadParams.url_next) {
                window.location.href = ReadParams.url_next;
            }
        }

        function goToPrevChapter() {
            if (typeof ReadParams !== 'undefined' && ReadParams.url_previous) {
                window.location.href = ReadParams.url_previous;
            }
        }

        const isAtEdge = (direction) => {
            const before = scrollContainer.scrollLeft;
            if (direction === 'left') scrollContainer.scrollLeft -= 1;
            else scrollContainer.scrollLeft += 1;

            const after = scrollContainer.scrollLeft;
            const stuck = (Math.abs(before - after) < 0.5);
            scrollContainer.scrollLeft = before;
            return stuck;
        };

        if (scrollContainer) {
            scrollContainer.focus();

            // --- 滑鼠滾輪事件 ---
            scrollContainer.addEventListener('wheel', function(e) {
                e.preventDefault();

                const startScrollLeft = scrollContainer.scrollLeft;
                const direction = Math.sign(e.deltaY);
                if (direction === 0) return;

                const moveAmount = direction * SCROLL_STEP;
                scrollContainer.scrollLeft -= moveAmount;

                const endScrollLeft = scrollContainer.scrollLeft;

                // 邊界判定
                if (Math.abs(startScrollLeft - endScrollLeft) < 1) {
                    if (wheelResetTimer) clearTimeout(wheelResetTimer);
                    // 使用新的 RESET_TIME (1000ms)
                    wheelResetTimer = setTimeout(() => {
                        wheelEdgeHitNext = 0;
                        wheelEdgeHitPrev = 0;
                    }, RESET_TIME);

                    if (direction > 0) {
                        wheelEdgeHitNext++;
                        wheelEdgeHitPrev = 0;
                        if (wheelEdgeHitNext >= 2) goToNextChapter();
                    } else {
                        wheelEdgeHitPrev++;
                        wheelEdgeHitNext = 0;
                        if (wheelEdgeHitPrev >= 2) goToPrevChapter();
                    }
                } else {
                    wheelEdgeHitNext = 0;
                    wheelEdgeHitPrev = 0;
                }
            }, { passive: false });


            // --- 鍵盤事件 ---
            document.addEventListener('keydown', function(e) {
                const pageWidth = scrollContainer.clientWidth;
                const pageJumpAmount = pageWidth * 0.95;

                // 重置計數器
                if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
                    if (arrowResetTimer) clearTimeout(arrowResetTimer);
                    // 使用新的 RESET_TIME (1000ms)
                    arrowResetTimer = setTimeout(() => {
                        arrowEdgeHitNext = 0;
                        arrowEdgeHitPrev = 0;
                    }, RESET_TIME);
                }

                switch (e.key) {
                    case 'PageDown':
                        e.preventDefault();
                        if (isAtEdge('left')) goToNextChapter();
                        else pageJump(-pageJumpAmount);
                        break;

                    case 'PageUp':
                        e.preventDefault();
                        if (isAtEdge('right')) goToPrevChapter();
                        else pageJump(pageJumpAmount);
                        break;

                    case 'ArrowDown':
                        e.preventDefault();
                        {
                            const start = scrollContainer.scrollLeft;
                            scrollContainer.scrollLeft -= SCROLL_STEP;
                            const end = scrollContainer.scrollLeft;

                            if (Math.abs(start - end) < 1) {
                                arrowEdgeHitNext++;
                                arrowEdgeHitPrev = 0;
                                if (arrowEdgeHitNext >= 2) goToNextChapter();
                            } else {
                                arrowEdgeHitNext = 0;
                            }
                        }
                        break;

                    case 'ArrowUp':
                        e.preventDefault();
                        {
                            const start = scrollContainer.scrollLeft;
                            scrollContainer.scrollLeft += SCROLL_STEP;
                            const end = scrollContainer.scrollLeft;

                            if (Math.abs(start - end) < 1) {
                                arrowEdgeHitPrev++;
                                arrowEdgeHitNext = 0;
                                if (arrowEdgeHitPrev >= 2) goToPrevChapter();
                            } else {
                                arrowEdgeHitPrev = 0;
                            }
                        }
                        break;

                    case 'Home':
                        e.preventDefault();
                        if (scrollContainer.scrollLeft < 0) smoothScrollTo(0);
                        else smoothScrollTo(scrollContainer.scrollWidth);
                        break;

                    case 'End':
                        e.preventDefault();
                        smoothScrollTo(-scrollContainer.scrollWidth);
                        break;
                }
            });
        }
    }, 500);

})();

