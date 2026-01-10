// ==UserScript==
// @name         NJU南大教务自动评教
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  锁定“很好”，随机评语，可自行修改
// @author       DTR
// @match        *://ehallapp.nju.edu.cn/jwapp/sys/wspjyyapp/*
// @match        *://*.nju.edu.cn/jwapp/sys/wspjyyapp/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562056/NJU%E5%8D%97%E5%A4%A7%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/562056/NJU%E5%8D%97%E5%A4%A7%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区 =================
    const CONFIG = {
        // 1. 如果评分选项不是“很好”，请修改这里
        targetText: "很好",

        // 2. 自定义随机评语库
        comments: [
            "老师授课认真负责，课堂气氛活跃，非常满意！",
            "教学内容丰富，由浅入深，非常容易理解。",
            "老师备课极其充分，重点突出，获益匪浅。",
            "对学生很有耐心，课后答疑也非常细致。"
        ],

        btnStyle: `
            position: fixed; right: 0px; top: 50%; transform: translateY(-50%);
            z-index: 999999; width: 60px; height: 180px; font-size: 18px;
            line-height: 1.2; background-color: #673ab7; color: white;
            border: none; border-radius: 15px 0 0 15px; cursor: pointer;
            font-weight: bold; box-shadow: -4px 0 15px rgba(0,0,0,0.3);
        `
    };

    // ================= 逻辑区 =================
    function startEvaluation() {
        let count = 0;
        // 遍历所有带有 .bh-radio-label 类名的标签
        const labels = document.querySelectorAll('.bh-radio-label');

        labels.forEach(label => {
            // trim() 用于剔除网页源码中多余的空格和换行
            if (label.textContent.trim().includes(CONFIG.targetText)) {
                label.click();
                count++;
            }
        });

        // 随机填充评语
        document.querySelectorAll('textarea').forEach(box => {
            if (box.value.length < 5) {
                const randomMsg = CONFIG.comments[Math.floor(Math.random() * CONFIG.comments.length)];
                box.value = randomMsg;
                // 必须触发 input/change 事件，否则 Vue 等框架无法识别赋值
                box.dispatchEvent(new Event('input', { bubbles: true }));
                box.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        console.log(`[成功] 已勾选 ${count} 个选项。`);
    }

    function injectButton() {
        if (document.getElementById('nju-mega-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'nju-mega-btn';
        btn.innerHTML = '🚀<br>一<br>键<br>满<br>分';
        btn.style.cssText = CONFIG.btnStyle;
        btn.onclick = (e) => {
            e.preventDefault();
            startEvaluation();
        };
        document.body.appendChild(btn);
    }

    // 每秒巡检一次，确保按钮永不消失
    setInterval(injectButton, 1000);
})();