// ==UserScript==
// @name         思齐密码机-逻辑分析辅助表
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  原生组件 + 完美居中 + 自动提取第三行关键线索至底部
// @author       Gemini
// @match        https://si-qi.xyz/secret_code.php
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563297/%E6%80%9D%E9%BD%90%E5%AF%86%E7%A0%81%E6%9C%BA-%E9%80%BB%E8%BE%91%E5%88%86%E6%9E%90%E8%BE%85%E5%8A%A9%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563297/%E6%80%9D%E9%BD%90%E5%AF%86%E7%A0%81%E6%9C%BA-%E9%80%BB%E8%BE%91%E5%88%86%E6%9E%90%E8%BE%85%E5%8A%A9%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectedNativeComponent() {
        if (window.scTableLoaded) return;
        window.scTableLoaded = true;

        // 1. 样式定义
        const style = document.createElement('style');
        style.innerHTML = `
            #sc-logic-board{margin-top:15px;padding-top:15px;border-top:2px dashed #e4d8c9;display:flex;flex-direction:column;gap:6px;align-items:center;animation:fadeIn .3s ease;width:100%}@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}.sc-logic-row{display:flex;align-items:center;gap:8px;padding:4px 12px;border-radius:12px;transition:background .1s}.sc-logic-row:hover{background:#fffaf2}.sc-logic-slot{width:28px;height:28px;border-radius:8px;border:2px solid #e8d9c6;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;font-size:14px;font-weight:bold;line-height:1;transition:all .1s;box-shadow:0 1px 2px rgba(0,0,0,0.05)}.sc-logic-slot:hover{border-color:#e87a31;transform:translateY(-1px);box-shadow:0 2px 4px rgba(232,122,49,0.2)}.sc-indicator-slot{background:transparent;border-color:transparent;box-shadow:none}.sc-indicator-slot:hover{background:transparent;border-color:transparent;box-shadow:none;transform:scale(1.1)}.logic-no{background:#ffebee;border-color:#ffcdd2;color:#c62828}.logic-yes{background:#e8f5e9;border-color:#c8e6c9;color:#2e7d32}.logic-maybe{background:#fffde7;border-color:#fff9c4;color:#f9a825}.row-excluded{opacity:.4;filter:grayscale(1)}.row-excluded .sc-indicator-slot{position:relative}.row-excluded .sc-indicator-slot::after{content:'';position:absolute;width:100%;height:2px;background:#e74c3c;transform:rotate(-45deg)}.sc-logic-clue-box{margin-top:8px;padding:6px 16px;background:#fff3e0;border:1px solid #ffe0b2;border-radius:20px;color:#e65100;font-size:13px;font-weight:bold;text-align:center;box-shadow:0 2px 4px rgba(230,81,0,0.05);max-width:90%}
        `;
        document.head.appendChild(style);

        // 2. 渲染函数
        function renderBoard() {
            if (typeof scColorMap === 'undefined') return;

            let colorIds = Object.keys(scColorMap);
            if (typeof scProfile !== 'undefined' && scProfile.pool) {
                colorIds = colorIds.filter(id => scProfile.pool.includes(id));
            }

            const container = document.querySelector('.sc-inputs');

            // 检查线索是否有第三行 (Index 2)
            let clueText = "";
            if (typeof scProfile !== 'undefined' && scProfile.clue_lines && scProfile.clue_lines.length > 2) {
                clueText = scProfile.clue_lines[2];
            }

            // 哈希计算增加 clueText，确保线索变化时也能重绘
            const currentHash = colorIds.join(',') + '|' + clueText;
            const existingBoard = document.getElementById('sc-logic-board');

            if (!container) return;
            if (existingBoard && existingBoard.dataset.hash === currentHash) return;
            if (existingBoard) existingBoard.remove();

            const board = document.createElement('div');
            board.id = 'sc-logic-board';
            board.dataset.hash = currentHash;

            // 渲染行
            colorIds.forEach(id => {
                const colorObj = scColorMap[id];
                const hex = colorObj ? colorObj.hex : '#ccc';
                const name = colorObj ? colorObj.name : id;

                const row = document.createElement('div');
                row.className = 'sc-logic-row';
                row.innerHTML = `
                    <div class="sc-logic-slot sc-indicator-slot" title="排除整行: ${name}" onclick="window.scLogicToggleRow(this)">
                        <div class="sc-mini-dot" style="background:${hex};"></div>
                    </div>
                    <div class="sc-logic-slot" onclick="window.scLogicToggle(this)"></div>
                    <div class="sc-logic-slot" onclick="window.scLogicToggle(this)"></div>
                    <div class="sc-logic-slot" onclick="window.scLogicToggle(this)"></div>
                    <div class="sc-logic-slot" onclick="window.scLogicToggle(this)"></div>
                `;
                board.appendChild(row);
            });

            // 渲染底部线索 (如果存在)
            if (clueText) {
                const clueBox = document.createElement('div');
                clueBox.className = 'sc-logic-clue-box';
                clueBox.innerHTML = `💡 ${clueText}`;
                board.appendChild(clueBox);
            }

            container.appendChild(board);
        }

        // 3. 交互逻辑
        window.scLogicToggle = function(el) {
            if (el.textContent === '') {
                el.textContent = '❌';
                el.className = 'sc-logic-slot logic-no';
            } else if (el.textContent === '❌') {
                el.textContent = '✅';
                el.className = 'sc-logic-slot logic-yes';
            } else if (el.textContent === '✅') {
                el.textContent = '❓';
                el.className = 'sc-logic-slot logic-maybe';
            } else {
                el.textContent = '';
                el.className = 'sc-logic-slot';
            }
        };

        window.scLogicToggleRow = function(el) {
            const row = el.closest('.sc-logic-row');
            const slots = row.querySelectorAll('.sc-logic-slot:not(.sc-indicator-slot)');

            if (row.classList.contains('row-excluded')) {
                row.classList.remove('row-excluded');
                slots.forEach(slot => {
                    if (slot.textContent === '❌') {
                        slot.textContent = '';
                        slot.className = 'sc-logic-slot';
                    }
                });
            } else {
                row.classList.add('row-excluded');
                slots.forEach(slot => {
                    if (slot.textContent === '') {
                        slot.textContent = '❌';
                        slot.className = 'sc-logic-slot logic-no';
                    }
                });
            }
        };

        setInterval(renderBoard, 1000);
    }

    const script = document.createElement('script');
    script.textContent = `(${injectedNativeComponent.toString()})();`;
    document.body.appendChild(script);

})();