// ==UserScript==
// @name         显示实时价格 (v0.9 - 币安API版)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  使用币安API显示价格，可拖动/记忆位置，且不在币安网站上运行。
// @author       You & AI Assistant
// @match        *://*/*
// @exclude      *://*.binance.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553975/%E6%98%BE%E7%A4%BA%E5%AE%9E%E6%97%B6%E4%BB%B7%E6%A0%BC%20%28v09%20-%20%E5%B8%81%E5%AE%89API%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553975/%E6%98%BE%E7%A4%BA%E5%AE%9E%E6%97%B6%E4%BB%B7%E6%A0%BC%20%28v09%20-%20%E5%B8%81%E5%AE%89API%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用于存储位置的键名
    const POS_STORAGE_KEY_X = 'price-div-pos-x';
    const POS_STORAGE_KEY_Y = 'price-div-pos-y';

    // --- 修改：加密货币配置列表以适应币安API ---
    // 'name' 用于显示, 'symbol' 用于API查询
    const cryptoConfig = [
        { name: 'BTC', symbol: 'BTCUSDT' },
        { name: 'ETH', symbol: 'ETHUSDT' },
        { name: 'SOL', symbol: 'SOLUSDT' }
    ];

    // 创建价格显示容器
    const priceDiv = document.createElement('div');
    // ... (所有样式和拖动功能的代码保持不变)
    priceDiv.style.position = 'fixed';
    priceDiv.style.zIndex = '999999';
    const savedX = GM_getValue(POS_STORAGE_KEY_X, null);
    const savedY = GM_getValue(POS_STORAGE_KEY_Y, null);
    if (savedX !== null && savedY !== null) {
        priceDiv.style.left = savedX;
        priceDiv.style.top = savedY;
    } else {
        priceDiv.style.top = '30px';
        priceDiv.style.right = '10px';
    }
    priceDiv.style.pointerEvents = 'none';
    priceDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
    priceDiv.style.color = '#000000';
    priceDiv.style.padding = '5px 10px';
    priceDiv.style.border = '1px solid #ccc';
    priceDiv.style.borderRadius = '5px';
    priceDiv.style.fontSize = '14px';
    priceDiv.style.fontFamily = 'monospace';
    priceDiv.style.lineHeight = '1.5';
    priceDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    priceDiv.style.textAlign = 'right';
    document.body.appendChild(priceDiv);
    let isDragging = false;
    let dragStartX, dragStartY, initialLeft, initialTop;
    document.addEventListener('keydown', e => { if (e.key === 'Alt' && !isDragging) { priceDiv.style.pointerEvents = 'auto'; priceDiv.style.cursor = 'move'; } });
    document.addEventListener('keyup', e => { if (e.key === 'Alt' && !isDragging) { priceDiv.style.pointerEvents = 'none'; priceDiv.style.cursor = 'default'; } });
    priceDiv.addEventListener('mousedown', e => { if (e.altKey) { isDragging = true; if(priceDiv.style.right) { priceDiv.style.left = priceDiv.offsetLeft + 'px'; priceDiv.style.right = ''; } dragStartX = e.clientX; dragStartY = e.clientY; initialLeft = priceDiv.offsetLeft; initialTop = priceDiv.offsetTop; e.preventDefault(); } });
    document.addEventListener('mousemove', e => { if (isDragging) { const dx = e.clientX - dragStartX; const dy = e.clientY - dragStartY; priceDiv.style.left = `${initialLeft + dx}px`; priceDiv.style.top = `${initialTop + dy}px`; } });
    document.addEventListener('mouseup', e => { if (isDragging) { isDragging = false; if (!e.altKey) { priceDiv.style.pointerEvents = 'none'; priceDiv.style.cursor = 'default'; } GM_setValue(POS_STORAGE_KEY_X, priceDiv.style.left); GM_setValue(POS_STORAGE_KEY_Y, priceDiv.style.top); } });


    // --- 重写：更新价格函数以使用币安API ---
    function updatePrices() {
        // 币安API可以一次性获取所有交易对的价格
        fetch('https://api.binance.com/api/v3/ticker/price')
            .then(response => {
                if (!response.ok) throw new Error('Binance API request failed');
                return response.json();
            })
            .then(allPrices => {
                // 为了高效查找，将返回的数组转换成一个Map对象
                const priceMap = new Map(allPrices.map(item => [item.symbol, item.price]));

                // 根据我们的配置列表，从Map中查找价格并生成HTML
                const priceHTML = cryptoConfig.map(crypto => {
                    const price = parseFloat(priceMap.get(crypto.symbol) || 0); // 从Map中获取价格
                    const formattedPrice = price.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    return `<div>${crypto.name}: $${formattedPrice}</div>`;
                }).join('');

                const tipHTML = `<div style="font-size: 10px; color: #888; border-top: 1px solid #eee; margin-top: 4px; padding-top: 4px;">按住ALT键可拖动</div>`;

                priceDiv.innerHTML = priceHTML + tipHTML;
            })
            .catch(error => {
                console.error('获取价格失败:', error);
                priceDiv.innerHTML = '价格加载失败';
            });
    }

    // 立即执行一次，然后每5秒更新
    updatePrices();
    setInterval(updatePrices, 5000);
})();
