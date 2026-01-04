// ==UserScript==
// @name         天雪拼图助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  一键完成天雪拼图小游戏，随机跳过一片
// @author       Gemini
// @license      MIT
// @match        https://www.skyey2.com//puzzle.php?img=*
// @match        https://skyeysnow.com//puzzle.php?img=*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/559464/%E5%A4%A9%E9%9B%AA%E6%8B%BC%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559464/%E5%A4%A9%E9%9B%AA%E6%8B%BC%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.innerText = "自动拼图";
    btn.style.cssText = "position: fixed; top: 10px; right: 10px; z-index: 99999; padding: 10px 20px; background-color: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);";
    document.body.appendChild(btn);

    btn.onclick = function() {
        const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const puzzle = win.mainPuzzle;

        if (!puzzle || !puzzle.piecesStart) {
            alert("游戏尚未加载完成！");
            return;
        }

        // 1. 将链表转换为数组，方便操作
        const allPieces = [];
        let cursor = puzzle.piecesStart;
        // 安全遍历链表
        let safeCount = 0;
        while (cursor && safeCount < puzzle.totalPieces + 10) {
            allPieces.push(cursor);
            cursor = cursor.next;
            safeCount++;
        }

        // 找出所有还未归位的碎片
        const unplacedPieces = allPieces.filter(p => !p.inPlace);

        if (unplacedPieces.length < 2) {
            alert("剩余碎片不足，无法保留最后一片（可能已经完成了？）");
            return;
        }

        // 2. 随机选定一个“最后一片”
        const randomIndex = Math.floor(Math.random() * unplacedPieces.length);
        const finalPiece = unplacedPieces[randomIndex];
        console.log(`选定的最后一片是: Grid(${finalPiece.gridX}, ${finalPiece.gridY})`);

        // 3. 批量处理：除了 finalPiece 以外，全部归位
        allPieces.forEach(p => {
            if (p === finalPiece) {
                // 如果是最后一片，确保它是未完成状态
                p.inPlace = false;
                // 不修改 x, y, r，让它保持原样
            } else {
                // 其他碎片全部强制归位
                // 坐标计算公式源自 puzzle.js [cite: 193-194]
                const targetX = (p.gridX * p.size) - (p.size * 0.2);
                const targetY = (p.gridY * p.size) - (p.size * 0.2);

                p.x = targetX;
                p.y = targetY;
                p.r = 0;
                p.inPlace = true;
            }
        });

        // 4. 强制修正计数器
        // 既然我们只留了一片，那么完成数必然是总数 - 1
        puzzle.piecesInPlace = puzzle.totalPieces - 1;

        // 5. 重构双向链表 (关键步骤)
        // 游戏绘制顺序是从 piecesEnd (底) 到 piecesStart (顶)
        // 我们需要把未完成的 finalPiece 放在 piecesStart (最顶层)，方便用户操作
        // 其他已完成的碎片放在后面 (底层)

        const otherPieces = allPieces.filter(p => p !== finalPiece);
        // 新的顺序: [顶层碎片, ...底层碎片]
        const newOrder = [finalPiece, ...otherPieces];

        // 重连链表指针
        puzzle.piecesStart = newOrder[0];
        puzzle.piecesEnd = newOrder[newOrder.length - 1];

        for (let i = 0; i < newOrder.length; i++) {
            const p = newOrder[i];

            // 设置 prev
            if (i === 0) {
                p.prev = null;
            } else {
                p.prev = newOrder[i - 1];
            }

            // 设置 next
            if (i === newOrder.length - 1) {
                p.next = null;
            } else {
                p.next = newOrder[i + 1];
            }
        }

        // 6. 触发重绘
        win.hasChanged = true;
        console.log("处理完成，已重构图层顺序。");
    };
})();