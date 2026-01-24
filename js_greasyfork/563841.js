// ==UserScript==
// @name         速卖通定价助手
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  增加套组计算功能 (进价*数量) + 修复拖拽拉伸 + 完美布局
// @author       AI Assistant
// @match        *://*.mabangerp.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/563841/%E9%80%9F%E5%8D%96%E9%80%9A%E5%AE%9A%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563841/%E9%80%9F%E5%8D%96%E9%80%9A%E5%AE%9A%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 防止iframe重复运行
    if (window.top !== window.self) return;

    // 2. 防止重复加载
    if (document.getElementById('ae-pricing-tool')) return;

    // --- CSS样式 ---
    const style = document.createElement('style');
    style.innerHTML = `
        #ae-pricing-tool * { box-sizing: border-box; }
        #ae-pricing-tool {
            font-family: "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 13px;
            color: #333;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #dcdfe6;
            background: #fff;
            transition: width 0.2s ease;
            z-index: 2147483647;
        }
        .ae-header {
            background: linear-gradient(135deg, #006eff 0%, #0056b3 100%);
            color: white;
            padding: 0 15px;
            height: 40px;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            white-space: nowrap;
        }
        .ae-body {
            background: #fff;
            padding: 15px;
            display: none;
        }
        .ae-row {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
        }
        .ae-row span { white-space: nowrap; }
        .ae-input {
            width: 100px; padding: 6px 8px; border: 1px solid #dcdfe6;
            border-radius: 4px; text-align: right; outline: none; transition: border-color 0.2s;
        }
        .ae-input:focus { border-color: #006eff; }
        /* 针对套组输入的特殊样式 */
        .ae-input-group {
            display: flex; align-items: center;
        }
        .ae-input-short {
            width: 70px; margin-right: 5px;
        }
        .ae-result-box {
            background: #f4f6f9; border: 1px solid #ebeef5; border-radius: 6px; padding: 12px; margin-top: 5px;
        }
        .ae-res-row {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .ae-price-val { font-weight: bold; font-size: 15px; margin-right: 8px; }
        .ae-copy-btn {
            background: #fff; border: 1px solid #dcdfe6; color: #409eff;
            cursor: pointer; padding: 2px 10px; border-radius: 4px; font-size: 12px;
        }
        .ae-copy-btn:hover { background: #ecf5ff; border-color: #c6e2ff; }
        .ae-copy-btn:active { transform: scale(0.95); }
        .ae-toast {
            position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: white; padding: 6px 16px;
            border-radius: 20px; font-size: 12px; opacity: 0; transition: opacity 0.3s;
            pointer-events: none; z-index: 10000002;
        }
        #ae-btn-reset {
            width: 100%; padding: 8px; background: #f4f4f5; border: 1px solid #dcdfe6;
            color: #606266; border-radius: 4px; cursor: pointer; margin-top: 10px;
        }
        #ae-btn-reset:hover { background: #e9e9eb; }
    `;
    document.head.appendChild(style);

    // --- HTML构建 ---
    const div = document.createElement('div');
    div.id = 'ae-pricing-tool';
    div.style.position = 'fixed';
    div.style.top = '150px';
    div.style.right = '100px';
    div.style.left = 'auto';
    div.style.width = 'auto';

    div.innerHTML = `
        <div class="ae-header" id="ae-tool-header">
            <span style="margin-right: 15px; font-weight: bold;">📊 速卖通助手</span>
            <span id="ae-tool-toggle" style="cursor: pointer; font-size: 18px; line-height: 1;">+</span>
        </div>
        <div id="ae-tool-body" class="ae-body">
            <!-- 进价 -->
            <div class="ae-row">
                <span>进价 (CNY)</span>
                <input type="number" id="ae-cost" class="ae-input" placeholder="0">
            </div>

            <!-- 新增：套组数量 -->
            <div class="ae-row">
                <span>设为套组</span>
                <div class="ae-input-group">
                    <input type="number" id="ae-qty" class="ae-input ae-input-short" value="1" min="1">
                    <span>件</span>
                </div>
            </div>

            <div class="ae-row">
                <span>平台费率 (%)</span>
                <input type="number" id="ae-commission" class="ae-input" value="15.5">
            </div>
            <div class="ae-row">
                <span>目标毛利 (%)</span>
                <input type="number" id="ae-margin" class="ae-input" value="50">
            </div>
            <div class="ae-row" style="border-bottom: 1px dashed #e1e4e8; padding-bottom: 12px;">
                <span>前台折扣 (%)</span>
                <input type="number" id="ae-discount" class="ae-input" value="65">
            </div>

            <div class="ae-result-box">
                <div class="ae-res-row">
                    <span style="color: #606266;">折后售价</span>
                    <div style="display:flex; align-items:center;">
                        <span id="ae-res-real" class="ae-price-val" style="color: #f56c6c;">0.00</span>
                        <button class="ae-copy-btn" data-target="ae-res-real">复制</button>
                    </div>
                </div>
                <div class="ae-res-row">
                    <span style="color: #606266;">后台挂牌</span>
                    <div style="display:flex; align-items:center;">
                        <span id="ae-res-list" class="ae-price-val" style="color: #67c23a;">0.00</span>
                        <button class="ae-copy-btn" data-target="ae-res-list">复制</button>
                    </div>
                </div>
                <div style="margin-top: 8px; border-top: 1px solid #ebeef5; padding-top: 8px; font-size: 12px; color: #909399; display: flex; justify-content: space-between;">
                    <span>预估利润:</span>
                    <span id="ae-res-profit" style="font-weight: bold; color: #303133;">0.00</span>
                </div>
            </div>
            <button id="ae-btn-reset">清空</button>
        </div>
        <div id="ae-toast" class="ae-toast">已复制</div>
    `;

    document.body.appendChild(div);

    // --- 逻辑处理 ---
    const elCost = document.getElementById('ae-cost');
    const elQty = document.getElementById('ae-qty'); // 新增
    const elMargin = document.getElementById('ae-margin');
    const elCommission = document.getElementById('ae-commission');
    const elDiscount = document.getElementById('ae-discount');

    const elResReal = document.getElementById('ae-res-real');
    const elResList = document.getElementById('ae-res-list');
    const elResProfit = document.getElementById('ae-res-profit');
    const toast = document.getElementById('ae-toast');
    const body = document.getElementById('ae-tool-body');
    const toggleBtn = document.getElementById('ae-tool-toggle');

    // 初始化
    body.style.display = 'none';

    // 读取记忆
    elMargin.value = localStorage.getItem('ae_margin_v3') || 50;
    elCommission.value = localStorage.getItem('ae_commission_v3') || 15.5;
    elDiscount.value = localStorage.getItem('ae_discount_v3') || 65;
    // 套组数量通常不记忆，默认回1比较安全，防止下一单算错。如果需要记忆请告诉我。

    function calculate() {
        let unitCost = parseFloat(elCost.value) || 0;
        let qty = parseFloat(elQty.value) || 1; // 获取套组数量，默认为1
        if (qty < 1) qty = 1; // 修正不合法数值

        let marginRate = (parseFloat(elMargin.value) || 0) / 100;
        let commRate = (parseFloat(elCommission.value) || 0) / 100;
        let discountRate = (parseFloat(elDiscount.value) || 0) / 100;

        if (unitCost === 0) {
            elResReal.innerText = "0.00";
            elResList.innerText = "0.00";
            elResProfit.innerText = "0.00";
            return;
        }

        // --- 核心改动：计算总成本 ---
        let totalCost = unitCost * qty;

        // Excel 倒推公式 (基于总成本)
        let denominator = (1 - commRate) * (1 - marginRate);
        if (denominator <= 0) { elResReal.innerText = "Err"; return; }

        let realPrice = totalCost / denominator;
        let listPrice = realPrice / (1 - discountRate);
        let profit = (realPrice * (1 - commRate)) - totalCost;

        elResReal.innerText = realPrice.toFixed(2);
        elResList.innerText = listPrice.toFixed(2);
        elResProfit.innerText = profit.toFixed(2);

        // 保存设置
        localStorage.setItem('ae_margin_v3', elMargin.value);
        localStorage.setItem('ae_commission_v3', elCommission.value);
        localStorage.setItem('ae_discount_v3', elDiscount.value);
    }

    // 复制提示
    function showToast() {
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 1500);
    }
    document.querySelectorAll('.ae-copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = document.getElementById(e.target.getAttribute('data-target')).innerText;
            if(val === '0.00' || val === 'Err') return;
            navigator.clipboard.writeText(val).then(showToast);
        });
    });

    // 监听所有输入框
    [elCost, elQty, elMargin, elCommission, elDiscount].forEach(input => input.addEventListener('input', calculate));

    document.getElementById('ae-btn-reset').addEventListener('click', () => {
        elCost.value = '';
        elQty.value = '1'; // 重置时恢复为1件
        elCost.focus();
        calculate();
    });

    // 拖拽逻辑 (防拉伸)
    const header = document.getElementById('ae-tool-header');
    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - div.offsetLeft;
        offsetY = e.clientY - div.offsetTop;
        header.style.cursor = 'grabbing';
        div.style.right = 'auto'; // 解除限制
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            div.style.right = 'auto';
            div.style.left = (e.clientX - offsetX) + 'px';
            div.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', () => { isDragging = false; header.style.cursor = 'move'; });

    // 折叠展开
    toggleBtn.addEventListener('click', () => {
        if (body.style.display === 'none') {
            body.style.display = 'block';
            toggleBtn.innerText = '−';
            div.style.width = '300px';
        } else {
            body.style.display = 'none';
            toggleBtn.innerText = '+';
            div.style.width = 'auto';
        }
    });

})();