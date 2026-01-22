// ==UserScript==
// @name         蝦皮分潤連結攔截器 (Shopee Affiliate Link Interceptor)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  當點擊 s.shopee 開頭的連結時，攔截並顯示提示視窗，提供前往或取消的選項。
// @author       SheepText
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        none
// @run-at       document-start['
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563459/%E8%9D%A6%E7%9A%AE%E5%88%86%E6%BD%A4%E9%80%A3%E7%B5%90%E6%94%94%E6%88%AA%E5%99%A8%20%28Shopee%20Affiliate%20Link%20Interceptor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563459/%E8%9D%A6%E7%9A%AE%E5%88%86%E6%BD%A4%E9%80%A3%E7%B5%90%E6%94%94%E6%88%AA%E5%99%A8%20%28Shopee%20Affiliate%20Link%20Interceptor%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 建立並注入 CSS 樣式
    const css = `
        #shopee-alert-modal {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 2147483647; /* 確保在最上層 */
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        #shopee-alert-box {
            background: #fff;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            width: 350px;
            text-align: center;
            animation: fadeIn 0.2s ease-out;
        }
        #shopee-alert-title {
            color: #ee4d2d; /* 蝦皮橘色 */
            margin-top: 0;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        #shopee-alert-url {
            background: #f5f5f5;
            padding: 8px;
            margin: 15px 0;
            border-radius: 4px;
            font-size: 12px;
            color: #555;
            word-break: break-all;
            max-height: 60px;
            overflow-y: auto;
            text-align: left;
        }
        .shopee-alert-btn {
            margin: 5px;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.2s;
        }
        .shopee-alert-btn:hover { opacity: 0.9; }
        #btn-cancel { background: #e0e0e0; color: #333; }
        #btn-go { background: #ee4d2d; color: white; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);

    // 顯示彈窗的函數
    function showWarning(url, target) {
        if (document.getElementById('shopee-alert-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'shopee-alert-modal';
        // 在標題旁也加入一個小圖示，增加辨識度
        modal.innerHTML = `
            <div id="shopee-alert-box">
                <div id="shopee-alert-title">
                    <img src="https://shopee.tw/favicon.ico" width="24" height="24" style="vertical-align: middle;">
                    <span>偵測到分潤連結</span>
                </div>
                <p style="margin: 10px 0; color: #333; font-size: 14px;">此連結開頭為 <strong>s.shopee</strong>，這通常是蝦皮的分潤或推廣連結。</p>
                <div id="shopee-alert-url">${url}</div>
                <div style="display:flex; justify-content:space-between; margin-top:20px;">
                    <button id="btn-cancel" class="shopee-alert-btn">拒絕前往</button>
                    <button id="btn-go" class="shopee-alert-btn">繼續前往</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('btn-cancel').onclick = () => {
            modal.remove();
        };

        document.getElementById('btn-go').onclick = () => {
            modal.remove();
            if (target === '_blank') {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }
        };
    }

    // 全域監聽點擊事件
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a');

        if (anchor && anchor.href) {
            const href = anchor.href;
            if (href.includes('//s.shopee') || href.startsWith('https://s.shopee')) {
                e.preventDefault();
                e.stopPropagation();
                showWarning(href, anchor.target);
            }
        }
    }, true);

})();