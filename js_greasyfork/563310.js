// ==UserScript==
// @name         1688一键复制商品完整信息
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键复制1688商品名称、价格、尺码表信息，整合所有核心数据
// @author       BINSON
// @match        *://detail.1688.com/*
// @match        *://*.1688.com/offer/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563310/1688%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%95%86%E5%93%81%E5%AE%8C%E6%95%B4%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/563310/1688%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E5%95%86%E5%93%81%E5%AE%8C%E6%95%B4%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 核心选择器（适配1688全量商品页） ==========
    const selectors = {
        name: '.product-title, .title-text, .offer-title', // 商品名称
        price: '.price-price, .price-tag, .price-normal', // 商品价格
        sizeTable: '.size-table, .spec-table, .tb-size-table', // 尺码表
        sizeTableBackup: '.detail-content table, [data-spm-node="size"] table' // 尺码表备用
    };

    // ========== 提取所有商品信息 ==========
    function getProductFullInfo() {
        // 通用文本提取函数
        const getText = (selector) => {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim().replace(/\s+/g, ' ') : '未找到信息';
        };

        // 1. 提取商品名称和价格
        const productName = getText(selectors.name);
        const productPrice = getText(selectors.price);

        // 2. 提取尺码表信息
        let sizeTable = document.querySelector(selectors.sizeTable);
        if (!sizeTable) sizeTable = document.querySelector(selectors.sizeTableBackup);
        
        let sizeInfo = '未找到尺码表信息';
        if (sizeTable) {
            const rows = sizeTable.querySelectorAll('tr');
            const sizeData = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('th, td');
                const cellTexts = Array.from(cells).map(cell => cell.textContent.trim().replace(/\s+/g, ' '));
                if (cellTexts.length > 0) {
                    sizeData.push(cellTexts.join('\t')); // 制表符分隔，粘贴后自动对齐
                }
            });
            sizeInfo = sizeData.join('\n');
        }

        // 3. 整理最终复制格式
        return `【1688商品信息】
商品名称：${productName}
商品价格：${productPrice}
商品链接：${window.location.href}

【尺码表】
${sizeInfo}`;
    }

    // ========== 复制到剪贴板 ==========
    function copyFullInfo() {
        const fullContent = getProductFullInfo();
        GM_setClipboard(fullContent);
        showToast('商品信息（名称+价格+尺码）复制成功！');
    }

    // ========== 复制成功提示 ==========
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #2663EB;
            color: white;
            border-radius: 4px;
            z-index: 999999;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ========== 添加悬浮复制按钮 ==========
    function addCopyButton() {
        if (document.getElementById('1688-full-copy-btn')) return;

        const button = document.createElement('button');
        button.id = '1688-full-copy-btn';
        button.textContent = '复制商品完整信息';

        // 按钮样式（1688品牌蓝，悬浮右下角）
        GM_addStyle(`
            #1688-full-copy-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                padding: 12px 20px;
                background: #2663EB;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                z-index: 999999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: background 0.3s;
            }
            #1688-full-copy-btn:hover {
                background: #1E54D9;
            }
        `);

        button.addEventListener('click', copyFullInfo);
        document.body.appendChild(button);
    }

    // ========== 页面加载适配（兼容动态渲染） ==========
    // 延迟执行+监听DOM变化，确保信息加载完成
    window.addEventListener('load', () => setTimeout(addCopyButton, 3000));
    const observer = new MutationObserver(() => {
        if (document.querySelector(selectors.name) || document.querySelector(selectors.sizeTable)) {
            addCopyButton();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();