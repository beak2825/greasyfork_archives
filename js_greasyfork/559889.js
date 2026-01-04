// ==UserScript==
// @name         超星评课助手-自动最高分减1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  针对超星newes评价系统设计：分数最高分减1，自动计算总分，填充必填评价。
// @author       Gemini
// @match        *://newes.chaoxing.com/pj/newesReception/questionnaireInfo*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559889/%E8%B6%85%E6%98%9F%E8%AF%84%E8%AF%BE%E5%8A%A9%E6%89%8B-%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E5%88%86%E5%87%8F1.user.js
// @updateURL https://update.greasyfork.org/scripts/559889/%E8%B6%85%E6%98%9F%E8%AF%84%E8%AF%BE%E5%8A%A9%E6%89%8B-%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E5%88%86%E5%87%8F1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建UI按钮
    const btn = document.createElement('button');
    btn.innerHTML = '🚀 智能填充评课';
    btn.style.cssText = `
        position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
        z-index: 10000; padding: 12px 25px; background: #3dacf5;
        color: white; border: none; border-radius: 25px;
        font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(btn);

    btn.onclick = function() {
        let totalScore = 0;

        // 1. 处理所有打分项 (input.dafen)
        const scoreInputs = document.querySelectorAll('input.dafen');
        scoreInputs.forEach(input => {
            const max = parseFloat(input.getAttribute('maxscore'));
            if (!isNaN(max)) {
                // 执行逻辑：满分减1
                const targetScore = max > 0 ? max - 1 : 0;
                input.value = targetScore;
                totalScore += targetScore;

                // 触发超星页面自带的 JS 逻辑（如计算、跳转等）
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                input.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        });

        // 2. 处理简答题和必填文本 (textarea)
        const textareas = document.querySelectorAll('textarea.temp-save');
        textareas.forEach(txt => {
            // 获取题目内容
            const container = txt.closest('.zquest-row');
            const title = container ? container.querySelector('.target-title').innerText : "";

            if (title.includes("听课记录")) {
                txt.value = "教师教学态度认真，准备充分。课堂引入自然，教学环节环环相扣，实验指导细致入微。";
            } else if (title.includes("言论") || title.includes("一票否决")) {
                txt.value = "该教师政治立场坚定，教学过程中无任何与课程无关的误导性言论。";
            } else if (title.includes("意见") || title.includes("建议")) {
                if(title.includes("其他")) {
                    txt.value = "无。";
                } else {
                    txt.value = "教师能够很好地结合前沿动态，建议进一步增加学生自主探究的时间。";
                }
            } else {
                txt.value = "教学认真负责，实践环节安排合理，学生反馈良好。";
            }
            txt.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // 3. 处理总分填空项 (指标七：16题)
        // 该项 input 的 name 通常为 1101252_1
        const totalInput = document.querySelector('input[name="1101252_1"]');
        if (totalInput) {
            totalInput.value = totalScore;
            totalInput.dispatchEvent(new Event('input', { bubbles: true }));
            totalInput.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        // 修改按钮状态
        btn.innerHTML = `✅ 已填充 (计算总分: ${totalScore})`;
        btn.style.background = '#4caf50';

        console.log('自动填充逻辑执行完毕，总分：' + totalScore);
    };
})();