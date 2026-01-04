// ==UserScript==
// @name         DailyGH 劇場模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  為 DailyGH 增加劇場模式，並加入二次元風格元件（萌系按鈕 + 看板娘提示），且具備防重覆檢測功能。
// @author       Antigravity
// @match        https://www.dailygh.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dailygh.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556539/DailyGH%20%E5%8A%87%E5%A0%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/556539/DailyGH%20%E5%8A%87%E5%A0%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義元件 ID，方便管理與檢查
    const BUTTON_ID = 'acg-theater-btn';
    const MASCOT_ID = 'acg-mascot-tip';

    // 二次元風格 CSS
    const css = `
        /* --- 劇場模式核心樣式 --- */
        .theater-mode-active #video-player {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
            padding: 0 !important;
            transition: all 0.5s ease;
        }

        .theater-mode-active #video_content {
            height: 85vh !important;
            box-shadow: 0 0 20px rgba(255, 105, 180, 0.3); /* 粉色光暈 */
        }

        .theater-mode-active #video_content iframe {
            height: 100% !important;
        }

        /* 隱藏側邊欄 */
        .theater-mode-active #video-player ~ div {
            display: none !important;
        }

        /* --- 元件一：萌系按鈕 --- */
        #${BUTTON_ID} {
            background: linear-gradient(45deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%);
            color: #fff;
            border: 2px solid #fff;
            padding: 8px 20px;
            margin-left: 15px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 彈性動畫 */
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        #${BUTTON_ID}:hover {
            transform: scale(1.05) rotate(-2deg);
            box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
        }

        #${BUTTON_ID}:active {
            transform: scale(0.95);
        }

        /* --- 元件二：看板娘提示框 (右下角) --- */
        #${MASCOT_ID} {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(255, 255, 255, 0.95);
            border: 3px solid #FF9A9E;
            padding: 15px 25px;
            border-radius: 20px 20px 0 20px;
            box-shadow: 5px 5px 0px rgba(255, 154, 158, 0.5);
            font-family: "Microsoft JhengHei", sans-serif;
            color: #555;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
            pointer-events: none; /* 不阻擋點擊 */
            font-weight: bold;
        }

        #${MASCOT_ID}.show-tip {
            opacity: 1;
            transform: translateY(0);
        }

        /* 提示框的小尾巴 */
        #${MASCOT_ID}::after {
            content: '';
            position: absolute;
            bottom: -15px;
            right: 0;
            border-width: 15px 15px 0 0;
            border-style: solid;
            border-color: #FF9A9E transparent transparent transparent;
        }
    `;

    // 注入 CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 主要邏輯
    function init() {
        // --- 檢查並免重覆 (Check Duplicates) ---
        // 如果按鈕已經存在，直接結束函式，不執行後續動作
        if (document.getElementById(BUTTON_ID)) {
            return;
        }

        // 尋找插入點 (通常在標題或麵包屑附近)
        const targetArea = document.querySelector('.page-title') ||
                           document.querySelector('h1') ||
                           document.querySelector('#video-player');

        if (!targetArea) return; // 如果連插入點都找不到，稍後重試

        // --- 建立元件一：萌系按鈕 ---
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.innerHTML = '<span>(★^O^★)</span> 劇場模式 ON!';
        btn.onclick = toggleTheaterMode;

        // 插入按鈕
        if (targetArea.id === 'video-player') {
            targetArea.parentNode.insertBefore(btn, targetArea);
        } else {
            targetArea.appendChild(btn);
        }

        // --- 建立元件二：看板娘提示框 ---
        const mascotTip = document.createElement('div');
        mascotTip.id = MASCOT_ID;
        mascotTip.innerHTML = '歡迎來到二次元劇場！ (ﾉ>ω<)ﾉ';
        document.body.appendChild(mascotTip);

        console.log('DailyGH 二次元劇場模式：元件已加載');
    }

    // 切換模式功能
    function toggleTheaterMode() {
        const container = document.querySelector('#video-box .row');
        const btn = document.getElementById(BUTTON_ID);
        const mascot = document.getElementById(MASCOT_ID);

        if (!container || !btn || !mascot) return;

        container.classList.toggle('theater-mode-active');
        const isActive = container.classList.contains('theater-mode-active');

        // 更新按鈕狀態
        if (isActive) {
            btn.innerHTML = '<span>(OwO)</span> 恢復原狀';
            btn.style.background = 'linear-gradient(45deg, #4ecdc4 0%, #556270 100%)';
            showMascotTip('沉浸模式啟動！享受動畫吧~ ✨');
        } else {
            btn.innerHTML = '<span>(★^O^★)</span> 劇場模式 ON!';
            btn.style.background = ''; // 恢復預設 CSS
            showMascotTip('歡迎回來現實世界~ (´・ω・`)');
        }
    }

    // 顯示並自動隱藏提示
    let tipTimeout;
    function showMascotTip(text) {
        const mascot = document.getElementById(MASCOT_ID);
        mascot.innerHTML = text;
        mascot.classList.add('show-tip');

        clearTimeout(tipTimeout);
        tipTimeout = setTimeout(() => {
            mascot.classList.remove('show-tip');
        }, 3000); // 3秒後消失
    }

    // --- 監聽器設置 ---
    // 1. 頁面加載完成時執行
    window.addEventListener('load', init);

    // 2. 針對 SPA (單頁應用) 或動態加載的內容，使用 MutationObserver 監控
    // 這樣即使切換集數，按鈕也會自動補上，且因為有防重覆檢查，不會變多個
    const observer = new MutationObserver((mutations) => {
        init();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();