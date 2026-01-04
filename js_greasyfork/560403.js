// ==UserScript==
// @name         Mercari RMB 价格显示
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  适配 Mercari 主站、Shops 页、搜索页、详情页，显示换算的 RMB 价格，可修改汇率。
// @author       ZhFuwe
// @match        https://jp.mercari.com/*
// @match        https://mercari-shops.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/560403/Mercari%20RMB%20%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560403/Mercari%20RMB%20%E4%BB%B7%E6%A0%BC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentRate = GM_getValue('rate', 0.0469);

    const ICONS = {
        tag: `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>`,
        close: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
        save: `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>`
    };

    GM_addStyle(`
        /* 列表页角标 */
        .rmb-overlay-tag {
            position: absolute; top: 6px; right: 6px;
            background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
            color: #fff !important; font-size: 13px; font-weight: 700;
            padding: 4px 10px; line-height: 1.5; border-radius: 6px;
            z-index: 10; pointer-events: none;
            font-family: "Helvetica Neue", Arial, sans-serif;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            min-height: 22px; display: flex; align-items: center; justify-content: center;
        }
        /* 详情页大字 */
        .rmb-detail-text {
            font-size: 24px; color: #d32f2f; font-weight: 700; margin-left: 12px;
            display: inline-flex; align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1;
        }
        .rmb-detail-text::before { content: '≈'; font-size: 0.8em; margin-right: 4px; color: #888; font-weight: normal; }
        
        /* 悬浮按钮 */
        #rmb-fab {
            position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px;
            background: #d32f2f; color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
            cursor: pointer; z-index: 2147483647; transition: transform 0.2s;
        }
        #rmb-fab:hover { transform: scale(1.05); }

        /* 设置菜单 */
        #rmb-settings-modal {
            position: fixed; bottom: 100px; right: 30px; width: 320px;
            background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            padding: 20px; z-index: 2147483647; display: none;
            font-family: sans-serif; border: 1px solid #f0f0f0;
        }
        .rmb-modal-header { display: flex; color: black; justify-content: space-between; margin-bottom: 15px; }
        .rmb-input-wrapper input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .rmb-save-btn { width: 100%; background: #d32f2f; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; margin-top: 15px; font-weight:bold;}
        
        /* 布局修正 */
        [data-testid="item-cell"] > div > a, .merItemThumbnail, mer-item-thumbnail, mer-item-thumbnail::part(container), a[data-testid="item-thumbnail-link"], div[data-testid="product-box"] { position: relative !important; }
        [data-testid="price"], [data-testid="product-price"] { display: inline-flex; align-items: center; flex-wrap: wrap; }
    `);

    function calc(cleanNumStr) {
        const num = parseFloat(cleanNumStr);
        if (!isNaN(num) && num > 0) return Math.floor(num * currentRate);
        return null;
    }

    function getRMB(text) {
        if (!text) return null;
        let str = text.toString().trim();
        
        const symbolMatch = str.match(/([￥¥])\s*([\d,]+)|([\d,]+)\s*円/);
        if (symbolMatch) {
            const numPart = symbolMatch[2] || symbolMatch[3];
            if (numPart) return calc(numPart.replace(/,/g, ''));
        }
        if (!str.includes('円') && !str.includes('¥') && !str.includes('￥')) {
             const cleanStr = str.replace(/[^\d.]/g, '');
             if (cleanStr.length > 0 && /\d/.test(str)) return calc(cleanStr);
        }
        return null;
    }

    function appendTagToElement(el, priceText) {
        if (el.hasAttribute('data-rmb-done')) return;
        if (el.closest('[data-testid="image-gallery"]')) return;
        if (el.closest('[data-testid="checkout-button"]')) return;

        const rmb = getRMB(priceText);
        if (rmb) {
            el.setAttribute('data-rmb-done', 'true');
            const tag = document.createElement('span');
            tag.className = 'rmb-overlay-tag';
            tag.innerText = `¥${rmb}`;
            if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
            el.appendChild(tag);
        }
    }

    function mainLoop() {
        document.querySelectorAll('[aria-label*="円"]:not([data-rmb-done])').forEach(el => appendTagToElement(el, el.getAttribute('aria-label')));
        document.querySelectorAll('mer-item-thumbnail').forEach(host => {
            if (host.shadowRoot) {
                const target = host.shadowRoot.querySelector('[aria-label*="円"]');
                if (target) appendTagToElement(target, target.getAttribute('aria-label'));
            }
        });
        document.querySelectorAll('a[data-testid="item-thumbnail-link"]:not([data-rmb-done])').forEach(el => appendTagToElement(el, el.innerText));
        document.querySelectorAll('[data-testid="product-box"]:not([data-rmb-done])').forEach(el => {
            const priceNode = el.querySelector('[data-testid="product-thumbnail-item-price"]');
            if (priceNode) appendTagToElement(el, priceNode.innerText);
        });

        // 详情页
        const detailTargets = document.querySelectorAll(`[data-testid="price"]:not([data-rmb-done]), mer-price:not([data-rmb-done]), .item-price:not([data-rmb-done]), [data-testid="product-price"]:not([data-rmb-done])`);
        detailTargets.forEach(el => {
            el.setAttribute('data-rmb-done', 'true');
            const rawPrice = el.getAttribute('value') || el.innerText;
            const rmb = getRMB(rawPrice);
            if (rmb) {
                const span = document.createElement('span');
                span.className = 'rmb-detail-text';
                span.innerText = `${rmb} 元`;
                if (el.parentNode) el.parentNode.insertBefore(span, el.nextSibling);
                else el.appendChild(span);
            }
        });
    }

    // --- UI ---
    function createUI() {
        const fab = document.createElement('div');
        fab.id = 'rmb-fab'; fab.innerHTML = ICONS.tag; fab.title = "汇率设置";
        document.body.appendChild(fab);

        const modal = document.createElement('div');
        modal.id = 'rmb-settings-modal';
        modal.innerHTML = `
            <div class="rmb-modal-header">
                <div style="font-weight:bold">${ICONS.tag} 汇率设置</div>
                <div style="cursor:pointer" id="rmb-close">${ICONS.close}</div>
            </div>
            <div style="margin-bottom:15px">
                <label style="display:block;margin-bottom:5px;font-size:13px;color:#666">当前汇率 (100日元 ≈ <span id="rmb-preview-rate"></span>元)</label>
                <div class="rmb-input-wrapper">
                    <input type="number" id="rmb-rate-input" step="0.0001">
                </div>
            </div>
            <button class="rmb-save-btn" id="rmb-save-btn">保存并刷新</button>
        `;
        document.body.appendChild(modal);

        let isOpen = false;

        // 打开菜单
        fab.onclick = (e) => {
            e.stopPropagation();
            isOpen = !isOpen;
            modal.style.display = isOpen ? 'block' : 'none';
            if (isOpen) {
                // 动态读取最新汇率
                const freshRate = GM_getValue('rate', 0.0469); 
                document.getElementById('rmb-rate-input').value = freshRate;
                document.getElementById('rmb-preview-rate').innerText = (freshRate * 100).toFixed(2);
            }
        };

        document.getElementById('rmb-close').onclick = () => { isOpen = false; modal.style.display = 'none'; };

        // 保存逻辑
        document.getElementById('rmb-save-btn').onclick = () => {
            const val = parseFloat(document.getElementById('rmb-rate-input').value);
            if (val > 0) {
                GM_setValue('rate', val);
                currentRate = val; 
                
                const btn = document.getElementById('rmb-save-btn');
                btn.innerText = "已保存，正在刷新...";
                btn.style.background = "#4caf50";

                setTimeout(() => {
                    location.reload();
                }, 500); 
            } else {
                alert("请输入有效的汇率数值");
            }
        };

        document.addEventListener('click', (e) => {
            if (isOpen && !modal.contains(e.target) && e.target !== fab) {
                isOpen = false; modal.style.display = 'none';
            }
        });
        
        // 输入预览
        document.getElementById('rmb-rate-input').addEventListener('input', (e)=>{
             const val = parseFloat(e.target.value);
             if(!isNaN(val)) document.getElementById('rmb-preview-rate').innerText = (val * 100).toFixed(2);
        });
    }

    // --- 启动 ---
    function init() {
        createUI();
        GM_registerMenuCommand("⚙️ 修改汇率", () => document.getElementById('rmb-fab').click());
        const observer = new MutationObserver(mainLoop);
        observer.observe(document.body, { childList: true, subtree: true });
        setInterval(mainLoop, 2000); 
        mainLoop();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();