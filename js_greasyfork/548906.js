// ==UserScript==
// @name         工匠放置小工具之2：价格计算器
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  自动计算材料成本 + 自动出价检测
// @match        https://idleartisan.com/*
// @grant        none
// @author       Stella
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/548906/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B2%EF%BC%9A%E4%BB%B7%E6%A0%BC%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548906/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B2%EF%BC%9A%E4%BB%B7%E6%A0%BC%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==
(function(){
    'use strict';

    // --- 用户配置 ---
    const WORKSHOP_LEVEL = 4; // 你的军需工坊等级
    const WORKSHOP_DISCOUNT_PER_LEVEL = 0.015;

    function formatNumber(num){
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- UI 美化部分 ---
    // 注入CSS样式
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --panel-bg: rgba(249, 249, 251, 0.85); /* Light mode background */
            --input-bg: rgba(235, 235, 240, 0.9);
            --text-color: #1d1d1f; /* Dark text for light background */
            --label-color: #6e6e73; /* Secondary text color */
            --accent-blue: #007AFF;
            --accent-green: #34C759;
            --accent-red: #FF3B30;
            --border-radius: 12px;
            --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            --border-color: rgba(0, 0, 0, 0.12);
        }
        .artisan-panel {
            position: fixed; top: 20px; right: 20px;
            background: var(--panel-bg);
            backdrop-filter: blur(12px) saturate(180%); -webkit-backdrop-filter: blur(12px) saturate(180%);
            color: var(--text-color);
            padding: 16px; border-radius: 16px;
            z-index: 9999; font-family: var(--font-family);
            font-size: 14px; width: 360px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid var(--border-color);
            cursor: move; user-select: none;
            display: flex; flex-direction: column; gap: 12px;
        }
        .artisan-panel-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 4px; padding-bottom: 8px; border-bottom: 1px solid var(--border-color);
        }
        .artisan-panel-header strong { font-size: 13px; color: var(--label-color); }
        .artisan-panel-header button {
            background: none; border: none; color: #888; cursor: pointer; font-size: 16px; padding: 4px; line-height: 1;
        }
        .artisan-panel .form-group { display: flex; flex-direction: column; gap: 6px; }
        .artisan-panel .form-group-inline { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;}
        .artisan-panel label { color: var(--label-color); font-weight: 500; }
        .artisan-panel input[type="number"], .artisan-panel select {
            background: var(--input-bg); color: var(--text-color);
            border: 1px solid transparent; border-radius: 8px;
            padding: 8px 10px; font-size: 14px; width: 100%; box-sizing: border-box;
            transition: border-color 0.2s;
        }
        .artisan-panel input[type="number"]:focus, .artisan-panel select:focus {
            outline: none; border-color: var(--accent-blue);
        }
        .artisan-panel .form-group-inline input[type="number"] { width: 70px; }
        .artisan-panel button {
            padding: 8px 12px; border: none; border-radius: 8px; cursor: pointer;
            font-weight: 600; font-size: 14px; transition: opacity 0.2s;
        }
        .artisan-panel button:hover { opacity: 0.85; }
        .artisan-panel #fetchBtn { background: var(--accent-blue); color: #fff; flex-grow: 1;}
        .artisan-panel #result {
            background: rgba(0,0,0,0.04); padding: 12px; border-radius: 10px;
            margin-top: 4px; max-height: 400px; overflow: auto;
            line-height: 1.6;
        }
        .artisan-panel #result hr { border: none; height: 1px; background: var(--border-color); margin: 10px 0; }
        .artisan-icon {
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            font-size: 28px; cursor: pointer;
            background: var(--panel-bg); backdrop-filter: blur(8px) saturate(180%);
            width: 44px; height: 44px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid var(--border-color);
            display:none;
        }
    `;
    document.head.appendChild(style);

    // 创建浮动面板
    const panel = document.createElement('div');
    panel.className = 'artisan-panel';
    panel.innerHTML = `
        <div class="artisan-panel-header">
            <strong>工坊等级: ${WORKSHOP_LEVEL} (每级 -1.5%)</strong>
            <button id="togglePanel" title="隐藏">✖</button>
        </div>

        <div class="form-group">
            <label for="itemType">物品类型:</label>
            <select id="itemType">
                <option value="Pickaxe">镐子</option>
                <option value="Axe">斧子</option>
                <option value="Sword">剑</option>
                <option value="Building">冶炼台 & 制作台</option>
            </select>
        </div>

        <div class="form-group">
            <label for="itemLevel">物品等级:</label>
            <input type="number" id="itemLevel" min="1" value="1">
        </div>

        <div class="form-group">
            <label>材料单价:</label>
            <div class="form-group-inline">
                <button id="fetchBtn">读取市场最低价</button>
            </div>
            <div class="form-group-inline">
                <label for="priceWood">木板:</label> <input type="number" id="priceWood" min="0" value="12">
                <label for="priceIron">铁锭:</label> <input type="number" id="priceIron" min="0" value="12">
                <label for="priceGold">金锭:</label> <input type="number" id="priceGold" min="0" value="12">
            </div>
        </div>

        <div id="result"></div>
    `;
    document.body.appendChild(panel);

    // 隐藏图标
    const icon = document.createElement('div');
    icon.className = 'artisan-icon';
    icon.textContent = '⚖️';
    document.body.appendChild(icon);
    icon.addEventListener('click', () => { panel.style.display = 'flex'; icon.style.display = 'none'; saveSettings(); });

    // 拖动
    let isDragging = false, offsetX, offsetY;
    panel.addEventListener('mousedown', e => {
        if (!['INPUT', 'BUTTON', 'SELECT', 'LABEL'].includes(e.target.tagName) && !e.target.closest('input, button, select')) {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        }
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            panel.style.left = e.clientX - offsetX + 'px';
            panel.style.top = e.clientY - offsetY + 'px';
            panel.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; saveSettings(); } });

    // 隐藏按钮
    panel.querySelector('#togglePanel').addEventListener('click', () => { panel.style.display = 'none'; icon.style.display = 'flex'; saveSettings(); });

    // --- 以下为功能性代码 ---

    function saveSettings() {
        try {
            const settings = {
                itemType: document.getElementById('itemType')?.value,
                itemLevel: document.getElementById('itemLevel')?.value,
                priceWood: document.getElementById('priceWood')?.value,
                priceIron: document.getElementById('priceIron')?.value,
                priceGold: document.getElementById('priceGold')?.value,
                hidden: (panel.style.display === 'none'),
                posX: panel.style.left || '',
                posY: panel.style.top || ''
            };
            localStorage.setItem('artisanCalculatorSettings', JSON.stringify(settings));
        } catch (e) {
            console.warn("saveSettings error", e);
        }
    }

    function calculateCost(baseCost, level) {
        let cost = baseCost;
        if (level <= 1) return cost;
        for (let i = 2; i <= level; i++) {
            if (i <= 9) cost *= 3;
            else if (i === 10) cost *= 2;
            else cost *= 1.5;
        }
        return parseFloat(cost.toFixed(2));
    }
    function applyWorkshopDiscount(cost) {
        const discount = 1 - WORKSHOP_LEVEL * WORKSHOP_DISCOUNT_PER_LEVEL;
        return parseFloat((cost * discount).toFixed(2));
    }

    function showToast(msg, success = true) {
        const toast = document.createElement("div");
        toast.textContent = msg;
        toast.style.position = "fixed";
        toast.style.bottom = "40px";
        toast.style.right = "40px";
        toast.style.padding = "10px 16px";
        toast.style.background = success ? "var(--accent-green)" : "var(--accent-red)";
        toast.style.color = "#fff";
        toast.style.borderRadius = "10px";
        toast.style.zIndex = 10000;
        toast.style.fontSize = "14px";
        toast.style.fontFamily = "var(--font-family)";
        toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    function fetchMarketPrices() {
        const marketTab = document.querySelector('#marketplaceButton');
        if (marketTab) marketTab.click();

        setTimeout(() => {
            const rows = document.querySelectorAll('#marketListingsDisplay table.market-table tbody tr');
            let minPrices = { "Planks": Infinity, "Iron Bars": Infinity, "Gold Bars": Infinity, "Logs": Infinity, "Iron Ore": Infinity,"Boss Tokens": Infinity,"Treant Resin":Infinity,"Rune Shards":Infinity,
                "Starfall Ore": Infinity,
                "Glimmerwood Sap": Infinity,
                "Crystallized Anima": Infinity };
            const nameMap = {
                "木板":"Planks", "铁锭":"Iron Bars", "金锭":"Gold Bars",
                "木头":"Logs", "铁矿石":"Iron Ore",
                "Boss代币":"Boss Tokens", "树人树脂":"Treant Resin",
                "符文碎片":"Rune Shards", "星落矿石":"Starfall Ore",
                "微光树液":"Glimmerwood Sap", "生命结晶":"Crystallized Anima",
                "Planks":"Planks","Iron Bars":"Iron Bars","Gold Bars":"Gold Bars",
                "Logs":"Logs","Iron Ore":"Iron Ore",
                "Boss Tokens":"Boss Tokens", "Treant Resin":"Treant Resin",
                "Rune Shards":"Rune Shards", "Starfall Ore":"Starfall Ore",
                "Glimmerwood Sap":"Glimmerwood Sap", "Crystallized Anima":"Crystallized Anima"
            };

            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (tds.length < 3) return;
                const rawName = tds[0].innerText.trim();
                const mappedName = nameMap[rawName];
                const price = parseFloat(tds[2].innerText.replace(/,/g, ''));
                if (mappedName && !isNaN(price) && price < minPrices[mappedName]) {
                    minPrices[mappedName] = price;
                }
            });

            // 更新原先的输入框（木板/铁锭/金锭）
            let updated = false;
            if (minPrices["Planks"] !== Infinity) { document.getElementById('priceWood').value = minPrices["Planks"]; updated = true; }
            if (minPrices["Iron Bars"] !== Infinity) { document.getElementById('priceIron').value = minPrices["Iron Bars"]; updated = true; }
            if (minPrices["Gold Bars"] !== Infinity) { document.getElementById('priceGold').value = minPrices["Gold Bars"]; updated = true; }

            // 缓存所有材料价格
            const cachedPrices = {
                planks: minPrices["Planks"] !== Infinity ? minPrices["Planks"] : null,
                ironBars: minPrices["Iron Bars"] !== Infinity ? minPrices["Iron Bars"] : null,
                goldBars: minPrices["Gold Bars"] !== Infinity ? minPrices["Gold Bars"] : null,
                logs: minPrices["Logs"] !== Infinity ? minPrices["Logs"] : null,
                ironOre: minPrices["Iron Ore"] !== Infinity ? minPrices["Iron Ore"] : null,
                bossTokens: minPrices["Boss Tokens"] !== Infinity ? minPrices["Boss Tokens"] : null,
                treantResin: minPrices["Treant Resin"] !== Infinity ? minPrices["Treant Resin"] : null,
                runeShards: minPrices["Rune Shards"] !== Infinity ? minPrices["Rune Shards"] : null,
                starfallOre: minPrices["Starfall Ore"] !== Infinity ? minPrices["Starfall Ore"] : null,
                glimmerwoodSap: minPrices["Glimmerwood Sap"] !== Infinity ? minPrices["Glimmerwood Sap"] : null,
                crystallizedAnima: minPrices["Crystallized Anima"] !== Infinity ? minPrices["Crystallized Anima"] : null,
                timestamp: Date.now()
            };

            // ✅ 写入本地缓存
            localStorage.setItem('artisanMarketPrices', JSON.stringify(cachedPrices));
            window._artisanMarketPrices = cachedPrices;

            updateResult();
            if (updated) showToast("✅ 已更新市场最低价", true);
            else showToast("❌ 未找到相关价格", false);
        }, 300);
    }
    document.getElementById("fetchBtn").addEventListener("click", fetchMarketPrices);

    function updateResult() {
        const type = document.getElementById('itemType').value;
        const level = parseInt(document.getElementById('itemLevel').value) || 1;
        const priceWood = parseFloat(document.getElementById('priceWood').value) || 12;
        const priceIron = parseFloat(document.getElementById('priceIron').value) || 12;
        const priceGold = parseFloat(document.getElementById('priceGold').value) || 12;

        let baseCost, materials;
        switch (type) {
            case 'Pickaxe': baseCost = 25; materials = { "木板": 1, "金锭": 1 }; break;
            case 'Axe': baseCost = 25; materials = { "铁锭": 1, "金锭": 1 }; break;
            case 'Sword': baseCost = 25; materials = { "铁锭": 1, "木板": 1 }; break;
            case 'Building': baseCost = 100; materials = { "铁锭": 1, "木板": 1, "金锭": 1 }; break;
        }

        let totalCost = applyWorkshopDiscount(calculateCost(baseCost, level));

        let resultText = `<strong>所需材料:</strong><br>`;
        let grandTotal = 0;
        for (let mat in materials) {
            let count = parseFloat((totalCost * materials[mat]).toFixed(2));
            let cost = 0;
            switch (mat) {
                case "木板": cost = count * priceWood; break;
                case "铁锭": cost = count * priceIron; break;
                case "金锭": cost = count * priceGold; break;
            }
            grandTotal += cost;
            resultText += `${mat}: ${formatNumber(count)} 个 × 单价 = ${formatNumber(cost)}<br>`;
        }

        const recyclePriceRaw = Math.floor(grandTotal * 0.25);

        resultText += `
            <hr>
            <strong style="color:var(--accent-red);">总价格: ${formatNumber(grandTotal)}</strong><br>
            <strong>回收价格 (25%): ${formatNumber(recyclePriceRaw)}</strong>
        `;
        document.getElementById('result').innerHTML = resultText;

        saveSettings();
    }

    // --- 初始化 ---
    const savedSettings = JSON.parse(localStorage.getItem('artisanCalculatorSettings') || '{}');
    if (savedSettings.itemType) document.getElementById('itemType').value = savedSettings.itemType;
    if (savedSettings.itemLevel) document.getElementById('itemLevel').value = savedSettings.itemLevel;

    // 加载用户上次保存的价格设置
    if (savedSettings.priceWood) document.getElementById('priceWood').value = savedSettings.priceWood;
    if (savedSettings.priceIron) document.getElementById('priceIron').value = savedSettings.priceIron;
    if (savedSettings.priceGold) document.getElementById('priceGold').value = savedSettings.priceGold;

    if(savedSettings.hidden) { panel.style.display = 'none'; icon.style.display = 'flex'; }
    if(savedSettings.posX && savedSettings.posY) { panel.style.left = savedSettings.posX; panel.style.top = savedSettings.posY; panel.style.right = 'auto'; }

    updateResult();

    ['priceWood', 'priceIron', 'priceGold', 'itemLevel', 'itemType'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const eventType = (el.tagName === 'SELECT') ? 'change' : 'input';
            el.addEventListener(eventType, updateResult);
        }
    });

})();
