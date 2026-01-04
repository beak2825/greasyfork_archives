// ==UserScript==
// @name         工匠放置暗黑小工具之3：自动扫货
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  每1-5秒随机扫描市场，满足条件自动购买最大。UI可拖拽、可最小化为图标、位置可记忆、带购买记录，面板更美观，价格/数量在同一行。新增功能：在控制台打印关注物品的最低价。
// @match        https://idleartisan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549343/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E6%9A%97%E9%BB%91%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B3%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%89%AB%E8%B4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/549343/%E5%B7%A5%E5%8C%A0%E6%94%BE%E7%BD%AE%E6%9A%97%E9%BB%91%E5%B0%8F%E5%B7%A5%E5%85%B7%E4%B9%8B3%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%89%AB%E8%B4%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // [配置区域] 在这里修改您想自动购买的物品、价格和数量阈值
    // price: 价格低于或等于此值时购买
    // qty:   数量大于或等于此值时购买
    // 您可以自由增删以下物品行，或者修改后面的数字。
    // =================================================================================
    const defaultThresholds = {
        // --- 基础资源 ---
        "木头":       { price: 1.05, qty: 10000 },
        "木板":       { price: 12,   qty: 10000 },
        "铁矿石":     { price: 1.05, qty: 10000 },
        "铁锭":       { price: 12,   qty: 10000 },
        "金锭":       { price: 12,   qty: 10000 },

        // --- 代币/特殊材料 ---
        "Boss代币":   { price: 100,  qty: 1000 },
        "树人树脂":   { price: 3000, qty: 1000 },

        // --- 高级材料 (默认价格设置得很高，如需购买请自行修改) ---
        "星落矿石":   { price: 100, qty: 1 },
        "微光树液":   { price: 100, qty: 1 },
        "生命结晶":   { price: 100, qty: 1 },
    };
    // =================================================================================
    // [配置区域] 结束
    // =================================================================================


    const items = Object.keys(defaultThresholds);

    let thresholds = JSON.parse(localStorage.getItem("autoBuyerThresholds")) || structuredClone(defaultThresholds);
    let buyHistory = JSON.parse(localStorage.getItem("autoBuyerHistory")) || [];

    function saveThresholds() { localStorage.setItem("autoBuyerThresholds", JSON.stringify(thresholds)); }
    function saveHistory() { localStorage.setItem("autoBuyerHistory", JSON.stringify(buyHistory)); }

    function addHistory(item, qty, price) {
        const time = new Date().toLocaleTimeString();
        buyHistory.unshift(`[${time}] ${item} • 数量=${qty} • 价格=${price}`);
        if (buyHistory.length > 20) buyHistory.pop();
        saveHistory();
        renderHistory();
    }

    function renderHistory() {
        const logDiv = document.getElementById("buyHistoryLog");
        if (!logDiv) return;
        logDiv.innerHTML = buyHistory.length
            ? buyHistory.map(line => `<div style="padding:2px 0;">${line}</div>`).join("")
            : "<i style='color:#888'>暂无记录</i>";
    }

    function createElements() {
        const panel = document.createElement("div");
        panel.id = "autoBuyerPanel";
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            width: 420px;
            background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(250,250,250,0.94));
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 12px;
            padding: 10px;
            z-index: 2147483647;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            font-size: 13px;
            color: #222;
            user-select: none;
            display: ${localStorage.getItem('panelHidden') === 'true' ? 'none' : 'block'};
        `;

        const icon = document.createElement("div");
        icon.id = "autoBuyerIcon";
        icon.textContent = "🛒";
        icon.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            display: ${localStorage.getItem('panelHidden') === 'true' ? 'flex' : 'none'};
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: move;
            z-index: 2147483647;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid rgba(0,0,0,0.06);
            user-select: none;
        `;

        // 内置样式和 html
        panel.innerHTML = `
            <style>
                #autoBuyerPanel .header { position:relative; cursor: move; background: #f3f4f6; padding:8px; border-radius:8px; text-align:center; font-weight:600; margin-bottom:8px; }
                #autoBuyerPanel .hide-btn { position:absolute; top:6px; right:8px; width:20px; height:20px; line-height:20px; text-align:center; border-radius:50%; background:#e8e9eb; cursor:pointer; font-weight:bold; }
                #autoBuyerPanel .hide-btn:hover { background: #dcdde1; }
                #autoBuyerPanel .controls { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
                .item-row { display:flex; align-items:center; gap:8px; padding:4px 6px; border-radius:8px; } /* 行距调窄 */
                .item-row + .item-row { margin-top:2px; } /* 行距调窄 */
                .item-name { width:86px; flex: 0 0 86px; font-weight:600; color:#333; }
                .input-price { width:64px; padding:4px 6px; border-radius:6px; border:1px solid #ddd; font-size:12px; }
                .input-qty { width:82px; padding:4px 6px; border-radius:6px; border:1px solid #ddd; font-size:12px; }
                .small-btn { padding:6px 10px; border-radius:8px; border:none; cursor:pointer; font-size:13px; }
                .btn-save { background:#007aff; color:white; box-shadow: 0 2px 0 rgba(0,0,0,0.06); }
                .btn-reset { background:#f1f2f4; color:#222; border:1px solid #e4e6ea; }
                .history-box { max-height:130px; overflow:auto; background:#fff; border:1px solid #eee; padding:8px; border-radius:8px; font-size:12px; color:#333; }
                .panel-footer { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:8px; }
                .tiny { font-size:12px; color:#666; }
                .clear-link { cursor:pointer; color:#007aff; text-decoration:underline; font-size:12px; }
            </style>

            <div class="header">
                🛒 扫货助手
                <div id="hidePanelBtn" class="hide-btn" title="最小化">─</div>
            </div>

            <div class="controls">
                <label style="display:flex;align-items:center;gap:6px;">
                    <input id="autoBuyerToggle" type="checkbox"> <span class="tiny">启用自动购买</span>
                </label>
                <div style="flex:1"></div>
            </div>

            <div id="itemsContainer" style="max-height:260px; overflow:auto; padding-right:6px;">
                <!-- items 插入位置 -->
            </div>

            <div class="panel-footer">
                <div style="display:flex;gap:8px;">
                    <button id="saveThresholds" class="small-btn btn-save">保存</button>
                    <button id="resetThresholds" class="small-btn btn-reset">恢复默认</button>
                </div>
                <div style="text-align:right;">
                    <span class="tiny">记录最多 20 条</span>
                </div>
            </div>

            <hr style="margin:10px 0;border:none;border-top:1px solid #f0f0f0;">

            <div style="display:flex;justify-content:space-between;align-items:center;">
                <b style="font-size:13px;">购买记录</b>
                <span id="clearHistory" class="clear-link">清空</span>
            </div>
            <div id="buyHistoryLog" class="history-box" style="margin-top:6px;"></div>
        `;

        document.body.appendChild(panel);
        document.body.appendChild(icon);

        // 恢复位置
        const savedPanelPos = JSON.parse(localStorage.getItem('autoBuyerPanelPos'));
        if (savedPanelPos) {
            panel.style.top = savedPanelPos.top;
            panel.style.left = savedPanelPos.left;
            panel.style.right = 'auto';
        }
        const savedIconPos = JSON.parse(localStorage.getItem('autoBuyerIconPos'));
        if (savedIconPos) {
            icon.style.top = savedIconPos.top;
            icon.style.left = savedIconPos.left;
            icon.style.right = 'auto';
        }

        // 动态插入 items 行
        const itemsContainer = panel.querySelector("#itemsContainer");
        items.forEach((item, idx) => {
            const row = document.createElement("div");
            row.className = "item-row";
            row.dataset.itemIndex = idx;
            const currentThreshold = thresholds[item] || { price: 0, qty: 0 };
            row.innerHTML = `
                <div class="item-name">${item}</div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:nowrap;">
                    <div style="font-size:12px;color:#666;">价 ≤</div>
                    <input id="price_${idx}" class="input-price" type="number" step="0.01" value="${currentThreshold.price}">
                </div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:nowrap;margin-left:6px;">
                    <div style="font-size:12px;color:#666;">数 ≥</div>
                    <input id="qty_${idx}" class="input-qty" type="number" value="${currentThreshold.qty}">
                </div>
            `;
            itemsContainer.appendChild(row);
        });

        // 恢复开关状态
        const toggle = document.getElementById("autoBuyerToggle");
        toggle.checked = localStorage.getItem("autoBuyerEnabled") === "true";

        // --- 事件绑定 ---
        document.getElementById("saveThresholds").addEventListener("click", () => {
            items.forEach((item, idx) => {
                const p = parseFloat(document.getElementById(`price_${idx}`).value);
                const q = parseInt(document.getElementById(`qty_${idx}`).value, 10);
                if (!thresholds[item]) thresholds[item] = {};
                thresholds[item].price = Number.isFinite(p) ? p : defaultThresholds[item].price;
                thresholds[item].qty = Number.isFinite(q) ? q : defaultThresholds[item].qty;
            });
            saveThresholds();
            showToast("已保存设置");
        });

        document.getElementById("resetThresholds").addEventListener("click", () => {
            if (!confirm("确认恢复为默认配置吗？所有自定义修改都将丢失。")) return;
            thresholds = structuredClone(defaultThresholds);
            saveThresholds();
            items.forEach((item, idx) => {
                document.getElementById(`price_${idx}`).value = thresholds[item].price;
                document.getElementById(`qty_${idx}`).value = thresholds[item].qty;
            });
            showToast("已恢复默认设置");
        });

        toggle.addEventListener("change", (e) => {
            localStorage.setItem("autoBuyerEnabled", e.target.checked);
            showToast(e.target.checked ? "自动购买 已启用" : "自动购买 已暂停");
        });

        document.getElementById("clearHistory").addEventListener("click", () => {
            if (!confirm("确认清空购买记录？")) return;
            buyHistory = [];
            saveHistory();
            renderHistory();
        });

        // 隐藏/显示逻辑
        document.getElementById('hidePanelBtn').addEventListener('click', () => {
            panel.style.display = 'none';
            icon.style.display = 'flex';
            localStorage.setItem('panelHidden', 'true');
        });

        icon.addEventListener('click', () => {
            icon.style.display = 'none';
            panel.style.display = 'block';
            localStorage.setItem('panelHidden', 'false');
        });

        // 拖拽
        dragElement(panel, panel.querySelector(".header"), 'autoBuyerPanelPos');
        dragElement(icon, icon, 'autoBuyerIconPos');
        renderHistory();
    }

    // =================================================================================
    // vvvvvvvvvvvvvvvvvvvvvvvvvvv  主要修改区域开始 vvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // =================================================================================
    function scanMarket() {
        try {
            const enabled = localStorage.getItem("autoBuyerEnabled") === "true";
            if (!enabled) return; // 如果未启用，则不执行任何操作

            const rows = document.querySelectorAll("#marketListingsDisplay table.market-table tbody tr");
            if (!rows || rows.length === 0) return;

            // 【新增】初始化一个对象，用于存储本次扫描中各个物品的最低价
            const lowestPrices = {};

            rows.forEach(row => {
                const itemCell = row.querySelector("td:nth-child(1)");
                if (!itemCell || itemCell.querySelector('span')) return;

                const item = itemCell.innerText.trim();
                const qtyText = row.querySelector("td:nth-child(2)")?.innerText.replace(/,/g, "").trim();
                const priceText = row.querySelector("td:nth-child(3)")?.innerText.replace(/,/g, "").trim();
                if (!item || !qtyText || !priceText) return;

                const qty = parseInt(qtyText, 10);
                const price = parseFloat(priceText);
                if (!Number.isFinite(qty) || !Number.isFinite(price)) return;

                // 【新增】检查这是否是我们需要追踪的物品
                if (thresholds[item]) {
                    // 【新增】如果尚未记录该物品价格，或当前价格更低，则更新最低价
                    if (lowestPrices[item] === undefined || price < lowestPrices[item]) {
                        lowestPrices[item] = price;
                    }
                }

                // [保留] 原有的自动购买逻辑
                if (thresholds[item] && price <= thresholds[item].price && qty >= thresholds[item].qty) {
                    const buyMaxBtn = row.querySelector("button[onclick*=\"'max'\"]");
                    if (buyMaxBtn) {
                        buyMaxBtn.click();
                        addHistory(item, qty, price);
                    }
                }
            });

            // 【新增】在扫描结束后，检查是否记录到了价格，并打印到控制台
            if (Object.keys(lowestPrices).length > 0) {
                console.log(`--- 市场最低价扫描 (${new Date().toLocaleTimeString()}) ---`);
                // 为了输出更整齐，按物品名称排序后打印
                Object.keys(lowestPrices).sort().forEach(item => {
                    console.log(`  ${item}: ${lowestPrices[item]}`);
                });
            }

        } catch (e) {
            console.error("scanMarket error:", e);
        }
    }
    // =================================================================================
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^  主要修改区域结束 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // =================================================================================

    // 修改为持续扫描，而不是执行完一次再等延时
    function scheduleNextScan() {
        setInterval(() => {
            scanMarket();
        }, Math.floor(Math.random() * 4000) + 1000); // 1-5s 随机间隔
    }

    // 拖拽函数 (增加保存位置功能)
    function dragElement(elmnt, header, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            // 保存位置
            const pos = { top: elmnt.style.top, left: elmnt.style.left };
            localStorage.setItem(storageKey, JSON.stringify(pos));
        }
    }

    function showToast(msg) {
        const id = "autoBuyer_toast";
        let t = document.getElementById(id);
        if (!t) {
            t = document.createElement("div");
            t.id = id;
            t.style.cssText = "position:fixed;right:24px;bottom:24px;padding:8px 12px;background:rgba(0,0,0,0.75);color:#fff;border-radius:8px;font-size:13px;z-index:2147483647;transition:opacity 0.3s;";
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.style.opacity = "1";
        clearTimeout(t._timeout);
        t._timeout = setTimeout(() => { t.style.opacity = "0"; }, 1800);
    }

    // --- 启动 ---
    // 确保在 DOM 完全加载后再创建面板，以防游戏脚本还没执行完
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createElements);
    } else {
        createElements();
    }
    scheduleNextScan();
})();