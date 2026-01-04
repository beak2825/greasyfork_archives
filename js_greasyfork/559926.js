// ==UserScript==
// @name         超星自测小助手
// @namespace    http://tampermonkey.net/
// @version      2025-12-23
// @description  ← →翻页 | 1/2兼容选择与判断 | 3/4选CD | 空格查看答案
// @author       Andy
// @match        https://mooc1.chaoxing.com/exam-ans/exam/test/reVersionTestStartNew*
// @icon         https://www.chaoxing.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559926/%E8%B6%85%E6%98%9F%E8%87%AA%E6%B5%8B%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559926/%E8%B6%85%E6%98%9F%E8%87%AA%E6%B5%8B%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("超星全能助手已启动：");
    console.log("  [← / →] 上一题 / 下一题");
    console.log("  [1] 选 A 或 对(√)");
    console.log("  [2] 选 B 或 错(×)");
    console.log("  [3 / 4] 选 C / D");
    console.log("  [空格] 显示/隐藏答案");

    document.addEventListener('keydown', function(e) {
        // 1. 防误触：如果在输入框打字，不执行快捷键
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement.isContentEditable) {
            return;
        }

        // ============================
        // 功能一：左右键切换题目
        // ============================
        if (e.key === 'ArrowLeft') {
            const prevBtn = document.querySelector('a[onclick*="getTheNextQuestion(-1)"]');
            if (prevBtn) prevBtn.click();
        }
        if (e.key === 'ArrowRight') {
            const nextBtn = document.querySelector('a[onclick*="getTheNextQuestion(1)"]');
            if (nextBtn) nextBtn.click();
        }

        // ============================
        // 功能二：数字键选题 (兼容ABCD和判断题)
        // ============================
        // 映射规则：键值 -> [选择题属性, 判断题属性]
        const keyMap = {
            '1': ['A', 'true'],   // 按1：选A 或 选True(对)
            '2': ['B', 'false'],  // 按2：选B 或 选False(错)
            '3': ['C'],
            '4': ['D']
        };

        if (keyMap.hasOwnProperty(e.key)) {
            const potentialValues = keyMap[e.key];
            let targetSpan = null;

            // 遍历查找：先找选择题的A，没找到再找判断题的true
            for (const val of potentialValues) {
                targetSpan = document.querySelector(`.stem_answer span[data="${val}"]`);
                if (targetSpan) break; // 找到了就跳出循环
            }

            if (targetSpan) {
                // 向上寻找最近的可点击父级 (class包含 answerBg)
                const clickTarget = targetSpan.closest('.answerBg');
                if (clickTarget) {
                    clickTarget.click();
                    console.log(`已选择: ${e.key} (对应 data="${targetSpan.getAttribute('data')}")`);
                }
            }
        }

        // ============================
        // 功能三：空格键显示答案
        // ============================
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault(); // 阻止页面滚动

            // 查找显示答案按钮
            const showAnsBtn = document.querySelector('.showAnsBtn a') || document.querySelector('a[onclick="toAnsweredView()"]');

            if (showAnsBtn) {
                showAnsBtn.click();
                console.log("执行：显示/隐藏答案");
            }
        }
    });

})();