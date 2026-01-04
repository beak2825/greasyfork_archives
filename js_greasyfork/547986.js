// ==UserScript==
// @name         箱规合箱计算器-树洞先生
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在阿里物流页面集成箱规合箱计算表单
// @author       树洞先生
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547986/%E7%AE%B1%E8%A7%84%E5%90%88%E7%AE%B1%E8%AE%A1%E7%AE%97%E5%99%A8-%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/547986/%E7%AE%B1%E8%A7%84%E5%90%88%E7%AE%B1%E8%AE%A1%E7%AE%97%E5%99%A8-%E6%A0%91%E6%B4%9E%E5%85%88%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建触发按钮
    const showBtn = document.createElement('button');
    showBtn.textContent = '📦';
    showBtn.style.position = 'fixed';
    showBtn.style.top = '80px';
    showBtn.style.right = '20px';
    showBtn.style.zIndex = 9999;
    showBtn.style.background = '#1890ff';
    showBtn.style.color = '#fff';
    showBtn.style.border = 'none';
    showBtn.style.padding = '10px 20px';
    showBtn.style.borderRadius = '6px';
    showBtn.style.cursor = 'pointer';
    document.body.appendChild(showBtn);

    // 创建表单容器（初始隐藏）
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '130px';
    container.style.right = '20px';
    container.style.zIndex = 10000;
    container.style.background = '#e6f0ff'; // 蓝色背景
    container.style.border = '1px solid #1890ff';
    container.style.padding = '16px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    container.style.fontSize = '14px';
    container.style.display = 'none';

    // 表单内容
    container.innerHTML = `
        <div style="font-weight:bold;margin-bottom:8px;">箱规合箱计算器</div>
        <div style="margin-bottom:8px;">
            <label>产品尺寸(cm):
                <input id="product-l" type="number" style="width:50px" placeholder="长"> ×
                <input id="product-w" type="number" style="width:50px" placeholder="宽"> ×
                <input id="product-h" type="number" style="width:50px" placeholder="高">
            </label>
        </div>
        <div style="margin-bottom:8px;">
            <label>箱规尺寸(cm):(选填)
                <input id="maxbox-l" type="number" style="width:50px" placeholder="长"> ×
                <input id="maxbox-w" type="number" style="width:50px" placeholder="宽"> ×
                <input id="maxbox-h" type="number" style="width:50px" placeholder="高">
            </label>
        </div>
        <div style="margin-bottom:8px;">
            <label>最大装箱数:(选填) <input id="max-per-box" type="number" style="width:60px" placeholder=""></label>
        </div>
        <div style="margin-bottom:8px;">
            <label>实际装箱数量: <input id="box-count" type="number" style="width:60px" placeholder=""></label>
        </div>
        <div style="margin-bottom:8px;">
            <label>空隙率(%): <input id="gap-rate" type="number" style="width:60px" placeholder="如5" value="5"></label>
        </div>
        <button id="box-calc-btn" style="margin-top:10px;background:#1890ff;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;">计算</button>
        <button id="box-close-btn" style="margin-top:10px;margin-left:10px;background:#fff;color:#1890ff;border:1px solid #1890ff;padding:6px 16px;border-radius:4px;cursor:pointer;">关闭</button>
        <div id="box-result" style="margin-top:10px;color:#333;"></div>
    `;

    document.body.appendChild(container);

    // 紧凑排列算法：允许空位，体积最小且三边差最小
    function getBestLooseArrangement(n) {
        let best = [n, 1, 1];
        let minVol = Infinity;
        let minDiff = Infinity;
        const maxSide = Math.ceil(Math.pow(n, 1/3)) * 3;
        for (let a = 1; a <= maxSide; a++) {
            for (let b = 1; b <= maxSide; b++) {
                for (let c = 1; c <= maxSide; c++) {
                    if (a * b * c < n) continue;
                    let arr = [a, b, c];
                    let vol = a * b * c;
                    let diff = Math.max(...arr) - Math.min(...arr);
                    if (
                        vol < minVol ||
                        (vol === minVol && diff < minDiff)
                    ) {
                        minVol = vol;
                        minDiff = diff;
                        best = arr;
                    }
                }
            }
        }
        return best;
    }

    // 显示弹窗
    showBtn.onclick = function() {
        container.style.display = 'block';
    };
    // 关闭弹窗
    container.querySelector('#box-close-btn').onclick = function() {
        container.style.display = 'none';
    };

    // 事件
    container.querySelector('#box-calc-btn').onclick = function() {
        const productL = parseFloat(document.getElementById('product-l').value);
        const productW = parseFloat(document.getElementById('product-w').value);
        const productH = parseFloat(document.getElementById('product-h').value);
        const maxBoxL = parseFloat(document.getElementById('maxbox-l').value);
        const maxBoxW = parseFloat(document.getElementById('maxbox-w').value);
        const maxBoxH = parseFloat(document.getElementById('maxbox-h').value);
        const maxPerBox = parseInt(document.getElementById('max-per-box').value, 10);
        const count = parseInt(document.getElementById('box-count').value, 10);
        const gapRate = parseFloat(document.getElementById('gap-rate').value) || 0;

        let resultDiv = document.getElementById('box-result');
        // 只校验产品尺寸和装箱数量
        if ([productL, productW, productH, count].some(x => isNaN(x) || x <= 0)) {
            resultDiv.textContent = '请正确填写产品尺寸和装箱数量！';
            return;
        }
        // 判断是否有限制
        const hasBoxLimit = !isNaN(maxBoxL) && !isNaN(maxBoxW) && !isNaN(maxBoxH) && maxBoxL > 0 && maxBoxW > 0 && maxBoxH > 0;
        const hasCountLimit = !isNaN(maxPerBox) && maxPerBox > 0;
        if (hasCountLimit && count > maxPerBox) {
            resultDiv.textContent = '实际装箱数量不能大于单箱最大装箱数！';
            return;
        }
        // 使用紧凑排列算法
        const [numL, numW, numH] = getBestLooseArrangement(count);
        // 生成所有排列组合（6种）
        function getAllPermutations(arr) {
            return [
                [arr[0], arr[1], arr[2]],
                [arr[0], arr[2], arr[1]],
                [arr[1], arr[0], arr[2]],
                [arr[1], arr[2], arr[0]],
                [arr[2], arr[0], arr[1]],
                [arr[2], arr[1], arr[0]],
            ];
        }
        const boxDims = hasBoxLimit ? [maxBoxL, maxBoxW, maxBoxH].sort((a, b) => b - a) : null;
        const factor = 1 + gapRate / 100;
        let bestOpt = null, minVol = Infinity;
        for (const nArr of getAllPermutations([numL, numW, numH])) {
            for (const pArr of getAllPermutations([productL, productW, productH])) {
                const dims = [nArr[0] * pArr[0], nArr[1] * pArr[1], nArr[2] * pArr[2]];
                const dimsWithGap = dims.map(x => x * factor).sort((a, b) => b - a);
                if (hasBoxLimit) {
                    if (dimsWithGap[0] > boxDims[0] || dimsWithGap[1] > boxDims[1] || dimsWithGap[2] > boxDims[2]) continue;
                }
                const vol = dimsWithGap[0] * dimsWithGap[1] * dimsWithGap[2];
                if (vol < minVol) {
                    minVol = vol;
                    bestOpt = dimsWithGap;
                }
            }
        }
        if (bestOpt) {
            const l = bestOpt[0], w = bestOpt[1], h = bestOpt[2];
            const cbm = (l * w * h) / 1e6;
            const volWeightExpress = (l * w * h) / 5000;
            const volWeightSea = (l * w * h) / 6000;
            resultDiv.innerHTML = `
                排列：${numL} × ${numW} × ${numH}（共${numL * numW * numH}格，实际装${count}个）<br>
                合箱尺寸（含空隙）：<b>${l.toFixed(1)} × ${w.toFixed(1)} × ${h.toFixed(1)} cm</b><br>
                CBM：<b>${cbm.toFixed(4)}</b> 立方米<br>
                体积重（快递）：<b>${volWeightExpress.toFixed(2)}</b> kg<br>
                体积重（海运）：<b>${volWeightSea.toFixed(2)}</b> kg
            `;
        } else {
            resultDiv.innerHTML = '该数量无法在最大箱规内装下！';
        }
    };
})();