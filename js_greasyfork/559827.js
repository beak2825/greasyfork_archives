// ==UserScript==
// @name         Unipus UTalk评分控制器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  引入随机分布算法，模拟真人发音瑕疵，支持界面自由拖拽 ~ (≧▽≦)/
// @author       YIBI
// @match        https://ucontent.unipus.cn/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559827/Unipus%20UTalk%E8%AF%84%E5%88%86%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559827/Unipus%20UTalk%E8%AF%84%E5%88%86%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 1. 配置与存储 =================
    const SCORE_KEY = 'UTALK_MINIMAL_SCORE';
    const POS_KEY = 'UTALK_UI_POS';
    let targetScore = parseInt(localStorage.getItem(SCORE_KEY)) || 92;

    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // ================= 2. 核心拦截逻辑 =================
    const originalParse = JSON.parse;
    JSON.parse = function() {
        const result = originalParse.apply(this, arguments);

        if (result?.finalResult?.result) {
            const res = result.finalResult.result;
            const base = targetScore;

            // 核心总分拟合
            res.accuracy = rnd(Math.max(0, base - 5), Math.min(100, base + 2));
            res.completeness = rnd(Math.max(0, base - 2), Math.min(100, base + 5));
            res.total = Math.round((res.accuracy * 0.6) + (res.completeness * 0.4));

            // 流利度拟合
            if (res.fluency) {
                res.fluency.overall = rnd(base - 8, base);
                res.fluency.pause = (base > 90) ? rnd(0, 1) : rnd(1, 3);
                res.fluency.speed = rnd(145, 175);
            }

            // 单词详情重构
            if (Array.isArray(res.details)) {
                let tableHtml = '<table border="1" style="border-collapse:collapse;width:100%;"><tr><th>单词</th><th>得分</th></tr>';
                res.details.forEach((item) => {
                    let wordScore = Math.random() > 0.15 ? rnd(base, 100) : rnd(base - 20, base - 5);
                    item.score = wordScore;
                    item.indict = 1;
                    tableHtml += `<tr><td style="padding:4px;">${item.word || '---'}</td><td style="padding:4px;">${wordScore}</td></tr>`;
                });
                tableHtml += '</table>';
                res.detail = tableHtml;
            }

            console.log(`%c [Moe System] 魔法施放成功！当前目标: ${base}分 ヾ(≧▽≦*)o`, 'color: #3399ff; font-weight: bold;');
        }
        return result;
    };

    // ================= 3. 视觉样式 (Blue Moe Style) =================
    GM_addStyle(`
        #moe-ctrl {
            position: fixed; z-index: 2147483647;
            background: rgba(240, 248, 255, 0.85);
            backdrop-filter: blur(10px);
            border: 2px solid #add8ff;
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 8px 32px rgba(173, 216, 255, 0.4);
            font-family: "Microsoft YaHei", sans-serif;
            color: #3399ff;
            user-select: none;
            cursor: move;
            transition: border-color 0.3s, transform 0.2s;
            width: 180px;
        }
        #moe-ctrl:active { transform: scale(0.98); }
        .moe-title {
            font-size: 13px; font-weight: bold; margin-bottom: 8px;
            display: flex; align-items: center; justify-content: center; gap: 5px;
            color: #007bff;
        }
        .moe-body { display: flex; align-items: center; justify-content: space-between; }
        .moe-input {
            background: #fff; border: 2px solid #add8ff;
            color: #3399ff; width: 50px; text-align: center; border-radius: 8px;
            outline: none; font-weight: bold; font-size: 16px; padding: 2px;
            transition: all 0.3s;
        }
        .moe-input:focus { border-color: #1e90ff; box-shadow: 0 0 8px rgba(30, 144, 255, 0.3); }
        .moe-hint { font-size: 10px; color: #82c1ff; margin-top: 6px; text-align: center; }
        #moe-status {
            width: 10px; height: 10px; border-radius: 50%;
            background: #add8ff; box-shadow: 0 0 5px #add8ff;
            transition: all 0.3s;
        }
        .active-glow { background: #00ff88 !important; box-shadow: 0 0 8px #00ff88 !important; }
    `);

    // ================= 4. UI 初始化与拖拽逻辑 =================
    function initUI() {
        if (document.getElementById('moe-ctrl')) return;

        const ctrl = document.createElement('div');
        ctrl.id = 'moe-ctrl';
        
        const savedPos = JSON.parse(localStorage.getItem(POS_KEY) || '{"top":"20px","right":"20px"}');
        Object.assign(ctrl.style, savedPos);

        ctrl.innerHTML = `
            <div class="moe-title"><span>(｡･ω･｡)</span> 魔法控制中心</div>
            <div class="moe-body">
                <span style="font-size:12px;">目标分:</span>
                <input type="number" class="moe-input" id="moe-val" min="0" max="100" value="${targetScore}">
                <div id="moe-status"></div>
            </div>
            <div class="moe-hint">修改会自动同步哒~</div>
        `;
        document.body.appendChild(ctrl);

        const input = document.getElementById('moe-val');
        const status = document.getElementById('moe-status');

        input.addEventListener('change', (e) => {
            let val = parseInt(e.target.value);
            if (val > 100) val = 100;
            if (val < 0) val = 0;
            targetScore = val;
            localStorage.setItem(SCORE_KEY, targetScore);

            status.classList.add('active-glow');
            setTimeout(() => status.classList.remove('active-glow'), 500);
        });

        let isDragging = false;
        let offsetX, offsetY;

        ctrl.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT') return; 
            isDragging = true;
            offsetX = e.clientX - ctrl.getBoundingClientRect().left;
            offsetY = e.clientY - ctrl.getBoundingClientRect().top;
            ctrl.style.transition = 'none'; 
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            ctrl.style.left = x + 'px';
            ctrl.style.top = y + 'px';
            ctrl.style.right = 'auto'; 
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            ctrl.style.transition = 'border-color 0.3s, transform 0.2s';
            
            const pos = {
                top: ctrl.style.top,
                left: ctrl.style.left
            };
            localStorage.setItem(POS_KEY, JSON.stringify(pos));
        });
    }

    if (document.readyState === 'complete') initUI();
    else window.addEventListener('load', initUI);

})();