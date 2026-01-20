// ==UserScript==
// @name         蚌埠医科大学-教务系统一键评教(修复版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  精准识别“优”选项，防止误选“差”
// @author       Gemini
// @match        *://byjw.bbmu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563311/%E8%9A%8C%E5%9F%A0%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6-%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563311/%E8%9A%8C%E5%9F%A0%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6-%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const COMMENT_TEXT = "老师教学严谨，备课充分，课堂气氛活跃，对学生很有耐心，收获很大！";
    // ----------------

    function createButton() {
        if (document.getElementById('gm-auto-fill-btn')) return;

        let btn = document.createElement("button");
        btn.id = 'gm-auto-fill-btn';
        btn.innerHTML = "🌟 一键全优 (修复版)";
        btn.style.cssText = `
            position: fixed;
            bottom: 50px;
            right: 30px;
            z-index: 99999;
            padding: 12px 24px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            cursor: pointer;
        `;
        btn.onclick = autoFillForm;
        document.body.appendChild(btn);
    }

    function autoFillForm() {
        let count = 0;
        const radios = document.querySelectorAll('input[type="radio"]');

        radios.forEach(radio => {
            // 获取单选框后面的节点
            let nextNode = radio.nextSibling;
            let nextEl = radio.nextElementSibling;
            
            let isTarget = false;

            // 策略1：检查紧跟在后面的纯文字 (TextNode)
            // 结构像这样：<input> 优
            if (nextNode && nextNode.nodeType === 3 && nextNode.textContent.trim() === "优") {
                isTarget = true;
            }
            
            // 策略2：检查紧跟在后面的标签 (Element)
            // 结构像这样：<input> <span>优</span>
            else if (nextEl && nextEl.innerText.trim() === "优") {
                isTarget = true;
            }

            // 策略3：检查父级 LABEL 标签 (必须是 LABEL，不能是 DIV/TD)
            // 结构像这样：<label><input> 优</label>
            else if (radio.parentElement.tagName === "LABEL" && radio.parentElement.innerText.trim().includes("优")) {
                // 再次确认这个 label 里没有其他选项，防止误判
                if (radio.parentElement.querySelectorAll('input').length === 1) {
                    isTarget = true;
                }
            }

            if (isTarget) {
                radio.click();
                count++;
            }
        });

        // 填充评语
        let textareas = document.querySelectorAll('textarea');
        textareas.forEach(area => {
            if(area.value.trim() === "") area.value = COMMENT_TEXT;
        });

        if (count > 0) {
            alert(`已精准勾选 ${count} 个“优”！\n请检查无误后提交。`);
        } else {
            // 备用方案：如果上面都失效了，尝试按照 Value 值来选
            // 很多系统 优=10 或 优=A
            fallbackSelection();
        }
    }

    // 备用方案：通过Value值猜测（如果上面的文字识别失败）
    function fallbackSelection() {
        let attempts = ["10", "A", "优", "0"]; // 常见的代表“优秀”的value值
        let count = 0;
        
        // 尝试找一种能匹配上的
        for (let val of attempts) {
            let matches = document.querySelectorAll(`input[type="radio"][value="${val}"]`);
            if (matches.length > 0) {
                matches.forEach(r => {
                    r.click(); 
                    count++;
                });
                if(count > 0) {
                    alert(`启用备用模式：根据 Value="${val}" 勾选了 ${count} 项。`);
                    return;
                }
            }
        }
        
        if(count === 0) alert("脚本未找到“优”选项，请截图网页源代码以便进一步调试。");
    }

    window.addEventListener('load', createButton);
    setInterval(createButton, 1000);
})();