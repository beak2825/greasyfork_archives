// ==UserScript==
// @name         Threads 貼文橫排顯示
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  讓 Threads 貼文瀑布流顯示
// @author       Da
// @match        https://www.threads.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560474/Threads%20%E8%B2%BC%E6%96%87%E6%A9%AB%E6%8E%92%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560474/Threads%20%E8%B2%BC%E6%96%87%E6%A9%AB%E6%8E%92%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        columns: 3,
        gap: 20,
        leftMargin: 76,
        rightMargin: 40,
        maxWidth: 1800
    };

    GM_addStyle(`
        [role="button"]:has(svg[aria-label="新增直欄"]),
        [role="button"]:has(svg[aria-label="Add column"]) {
            display: none !important;
        }

        .tg-masonry {
            position: relative !important;
            width: calc(100vw - ${CONFIG.leftMargin + CONFIG.rightMargin}px) !important;
            max-width: ${CONFIG.maxWidth}px !important;
            margin: 0 !important;
            padding: 24px 0 !important;
            margin-left: ${CONFIG.leftMargin}px !important;
            margin-right: ${CONFIG.rightMargin}px !important;
            z-index: 1 !important;
        }

        .tg-card {
            position: absolute !important;
            border: 1px solid rgba(128,128,128,0.12) !important;
            border-radius: 20px !important;
            padding: 20px !important;
            background: #fff !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
            box-sizing: border-box !important;
            transition: box-shadow 0.25s ease !important;
            opacity: 0 !important;  /* 先隱藏，排版後再顯示 */
        }

        .tg-card.tg-ready {
            opacity: 1 !important;
        }

        html[style*="color-scheme: dark"] .tg-card {
            background: #181818 !important;
            border-color: rgba(255,255,255,0.08) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
        }

        .tg-card:hover {
            border-color: rgba(128,128,128,0.25) !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
            z-index: 100 !important;
        }

        html[style*="color-scheme: dark"] .tg-card:hover {
            border-color: rgba(255,255,255,0.15) !important;
            box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
        }

        .tg-card [class*="x169f3pf"],
        .tg-card [class*="xpxidue"] {
            display: none !important;
        }

        .tg-card svg[aria-label="讚"] + span,
        .tg-card svg[aria-label="Like"] + span,
        .tg-card svg[aria-label="赞"] + span {
            color: #e74c3c !important;
            font-weight: 700 !important;
            font-size: 15px !important;
        }

        .tg-card svg[aria-label="讚"],
        .tg-card svg[aria-label="Like"],
        .tg-card svg[aria-label="赞"] {
            color: #e74c3c !important;
        }

        .tg-expand {
            max-width: 100% !important;
            width: 100% !important;
            overflow: visible !important;
        }

        .x6s0dn4.x78zum5.x5yr21d.xlqzeqv,
        .x1ey2m1c.x1dr59a3.xtijo5x.x13vifvy.xixxii4 {
            pointer-events: none !important;
        }

        .tg-hide-composer {
            display: none !important;
        }

        body {
            overflow-x: hidden !important;
        }

        @media (max-width: 1200px) {
            .tg-masonry { --tg-cols: 2 !important; }
        }
        @media (max-width: 700px) {
            .tg-masonry {
                --tg-cols: 1 !important;
                margin-left: 16px !important;
                width: calc(100vw - 32px) !important;
            }
        }
    `);

    let gridContainer = null;
    let layoutTimer = null;
    let isLayouting = false;

    function findGridContainer() {
        const posts = document.querySelectorAll('[data-pressable-container="true"]');
        if (posts.length < 2) return null;

        let el = posts[0];
        for (let i = 0; i < 10; i++) {
            el = el.parentElement;
            if (!el) break;
            if (el.children.length > 5) {
                return el;
            }
        }
        return null;
    }

    function getColumnCount() {
        const width = window.innerWidth;
        if (width <= 700) return 1;
        if (width <= 1200) return 2;
        return CONFIG.columns;
    }

    // 檢查卡片是否有實際內容
    function isCardReady(card) {
        // 至少要有文字或圖片
        const hasText = card.innerText.length > 20;
        const hasImage = card.querySelector('img');
        return hasText || hasImage;
    }

    function layoutMasonry() {
        if (!gridContainer || isLayouting) return;

        isLayouting = true;

        const allCards = Array.from(gridContainer.children).filter(c => c.classList.contains('tg-card'));

        // 只處理有內容的卡片
        const cards = allCards.filter(isCardReady);

        if (cards.length === 0) {
            isLayouting = false;
            return;
        }

        const containerWidth = gridContainer.offsetWidth;
        const cols = getColumnCount();
        const cardWidth = (containerWidth - (cols - 1) * CONFIG.gap) / cols;
        const columnHeights = new Array(cols).fill(0);

        // 設定寬度
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
        });

        // 等兩幀確保寬度生效
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cards.forEach(card => {
                    const minHeight = Math.min(...columnHeights);
                    const colIndex = columnHeights.indexOf(minHeight);

                    card.style.left = `${colIndex * (cardWidth + CONFIG.gap)}px`;
                    card.style.top = `${minHeight}px`;
                    card.classList.add('tg-ready');

                    columnHeights[colIndex] = minHeight + card.offsetHeight + CONFIG.gap;
                });

                gridContainer.style.height = `${Math.max(...columnHeights)}px`;
                isLayouting = false;
            });
        });
    }

    function scheduleLayout(delay = 500) {
        if (layoutTimer) clearTimeout(layoutTimer);
        layoutTimer = setTimeout(layoutMasonry, delay);
    }

    function applyCardStyle() {
        if (!gridContainer) return false;

        let hasNewCards = false;
        Array.from(gridContainer.children).forEach(child => {
            if (!child.classList.contains('tg-card')) {
                child.classList.add('tg-card');
                hasNewCards = true;
            }
        });

        return hasNewCards;
    }

    function hideComposer() {
        const textareas = document.querySelectorAll('[contenteditable="true"], [role="textbox"]');
        textareas.forEach(textarea => {
            const parent = textarea.closest('[class*="xb57i2i"]');
            if (parent && !parent.querySelector('[data-pressable-container="true"]')) {
                parent.classList.add('tg-hide-composer');
            }
        });

        const postBtns = document.querySelectorAll('[aria-label="發佈"], [aria-label="Post"]');
        postBtns.forEach(btn => {
            const container = btn.closest('[class*="xb57i2i"]');
            if (container && !container.querySelector('[data-pressable-container="true"]')) {
                container.classList.add('tg-hide-composer');
            }
        });
    }

    function initGrid() {
        gridContainer = findGridContainer();
        if (!gridContainer) return;

        if (!gridContainer.classList.contains('tg-masonry')) {
            gridContainer.classList.add('tg-masonry');

            let p = gridContainer.parentElement;
            while (p && p !== document.body) {
                p.classList.add('tg-expand');
                p = p.parentElement;
            }
        }

        hideComposer();
        applyCardStyle();

        // 初次排版，等久一點讓內容載入
        scheduleLayout(800);
        // 再排一次確保圖片載入後正確
        scheduleLayout(1500);
        scheduleLayout(3000);

        console.log(`✓ Threads Masonry v7.2: ${gridContainer.children.length} 篇`);
    }

    window.addEventListener('resize', () => scheduleLayout(200));

    // 圖片載入後重排
    document.addEventListener('load', (e) => {
        if (e.target.tagName === 'IMG' && gridContainer) {
            scheduleLayout(300);
        }
    }, true);

    const observer = new MutationObserver(() => {
        if (!gridContainer) {
            const container = findGridContainer();
            if (container) {
                initGrid();
            }
        } else {
            const hasNew = applyCardStyle();
            if (hasNew) {
                scheduleLayout(600);
            }
        }
    });

    function init() {
        initGrid();
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 等頁面穩定
    setTimeout(init, 1000);
})();