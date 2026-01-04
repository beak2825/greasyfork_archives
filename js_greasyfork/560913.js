// ==UserScript==
// @name         Shopee 回饋文字顯示
// @namespace    AOScript
// @version      2.0
// @description  掃描縮圖圖片，將回饋文字顯示在價格區塊底下；無回饋則提示。
// @author       AO-AO
// @match        https://shopee.tw/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560913/Shopee%20%E5%9B%9E%E9%A5%8B%E6%96%87%E5%AD%97%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560913/Shopee%20%E5%9B%9E%E9%A5%8B%E6%96%87%E5%AD%97%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---- 原本的映射表 ----
    const imageMap = {
        "tw-11134258-7ra0h-mb8aqnxyq3cmb5": "5%",
        "tw-11134258-7ra0h-mblt835cxsz264": "5%",
        "tw-11134258-7ra0n-mdjslxxb3r3939": "5%",

        "tw-11134258-81ztf-megjtkhgx4av2b": "5%", //new
        "tw-11134258-81ztc-megjs1bfrdhfa5": "5%", //199+5
        "tw-11134258-81zth-megjmixgqxhe23": "5%", //199+490+5
        
        "tw-11134258-81ztc-mi9ytluzsdtt12": "5%", //new?199+490+5

        "tw-11134258-7ra0u-mb8aqvc1wo2e75": "10%",
        "tw-11134258-7ra0j-mblt87t82sxwa6": "10%",
        "tw-11134258-7ra0k-mdjsna5yibyf64": "10%",

        "tw-11134258-81zte-megju7friyv406": "10%", //new
        "tw-11134258-81zto-megjsqkb3rb665": "10%", //199+10
        "tw-11134258-81ztf-megjn9cpbmki45": "10%" //199+490+10

    };

    // ---- 選擇器（保留原本設定）----
    const PRICE_BOX_SELECTOR = 'div.flex.flex-column.IFdRIb';
    const THUMB_SELECTOR = 'div.UBG7wZ img.WgnznX';

    // ---- 用於避免同一頁重複插入（以 pathname 當唯一鍵）----
    const pageKey = () => location.pathname;

    // ---- rAF 等待元素就緒（最多 2000ms）----
    function waitForElement(selector, timeout = 2000) {
        return new Promise((resolve, reject) => {
            const start = performance.now();
            function tick() {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                const elapsed = performance.now() - start;
                if (elapsed >= timeout) return reject(new Error('waitForElement timeout: ' + selector));
                requestAnimationFrame(tick);
            }
            tick();
        });
    }

    function getRatingFromThumbnails() {
        const thumbnails = document.querySelectorAll(THUMB_SELECTOR);
        for (const img of thumbnails) {
            const src = img?.src || '';
            for (const key in imageMap) {
                if (src.includes(key)) {
                    return imageMap[key];
                }
            }
        }
        return null;
    }

    function insertRatingBox(ratingText) {
        const target = document.querySelector(PRICE_BOX_SELECTOR);
        if (target && !document.querySelector('#custom-rating-box')) {
            const box = document.createElement('div');
            box.id = 'custom-rating-box';
            box.textContent = ratingText ? `🔥 回饋：${ratingText}` : '⚠️ 沒有回饋';
            box.style.backgroundColor = '#fff3e0';
            box.style.border = '2px dashed #ff9800';
            box.style.color = '#e65100';
            box.style.padding = '10px';
            box.style.marginTop = '12px';
            box.style.fontSize = '16px';
            box.style.fontWeight = 'bold';
            box.style.borderRadius = '6px';
            box.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
            box.style.textAlign = 'left';
            target.appendChild(box);
        }
    }

    // ---- 單次流程：等待價格區塊就緒 -> 讀縮圖 -> 插入（有/沒有回饋） ----
    async function runOnceForPage() {
        try {
            // 已插入過就不重複
            if (document.querySelector('#custom-rating-box')) return;

            // 等待價格區塊容器出現（最多 2 秒）
            await waitForElement(PRICE_BOX_SELECTOR, 2000);

            // 取縮圖評價
            const rating = getRatingFromThumbnails();

            // 插入顯示框（有回饋 or 沒有回饋）
            insertRatingBox(rating);
        } catch (e) {
            // 若等待超時（容器未出現），不要卡住頁面；這頁就略過
            // console.debug('[Shopee rating box] skipped:', e?.message || e);
        }
    }

    // ---- 監聽 SPA 路由變化：pushState / replaceState / popstate / hashchange ----
    function hookHistory() {
        const origPush = history.pushState;
        const origReplace = history.replaceState;
        history.pushState = function () {
            const ret = origPush.apply(this, arguments);
            onRouteChange();
            return ret;
        };
        history.replaceState = function () {
            const ret = origReplace.apply(this, arguments);
            onRouteChange();
            return ret;
        };
        window.addEventListener('popstate', onRouteChange, { passive: true });
        window.addEventListener('hashchange', onRouteChange, { passive: true });
    }

    let lastPageKey = '';
    function onRouteChange() {
        const current = pageKey();
        if (current !== lastPageKey) {
            lastPageKey = current;
            // 清除舊框，避免上一頁殘留（安全起見）
            const old = document.querySelector('#custom-rating-box');
            if (old) old.remove();
            // 跑一次
            // 使用微延遲，讓新頁面的主容器有機會先建好
            setTimeout(runOnceForPage, 0);
        }
    }

    // ---- 初始化：頁面就緒後啟動一次 + 綁路由 ----
    function init() {
        hookHistory();
        lastPageKey = pageKey();
        runOnceForPage();
        // 當頁面重新可見（從背景回來）也再試一次，防止 SPA 動態載入延遲
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) runOnceForPage();
        }, { passive: true });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init, { once: true });
    }
})();
